'use client';

import { useEffect, useMemo, useRef } from 'react';
import { nodeSurfaces, referenceExtent, sampleSection, type SectionPlane } from '@/lib/orbitali/idrogeno';
import { css, currentInk, flowFactor, flowFloor, onThemeChange, pair } from './ink';
import type { OrbitalFigureProps } from './OrbitalCloud';

/**
 * A section of an orbital: the points of the cloud that lie in one plane through the nucleus, on a 2D canvas. Lighter
 * than the cloud in three dimensions (no three.js), and the picture a lesson can build step by step. In the plane
 * across the axis the points of a state with a definite m turn, as in the cloud; in the planes through the axis the
 * flow crosses the plane, so they stand still.
 */

export const SECTION_POINTS = 14000;

/** The letters of the two directions of each plane: across, up. */
export const PLANE_AXES: Record<SectionPlane, [string, string]> = { xz: ['x', 'z'], yz: ['y', 'z'], xy: ['x', 'y'] };

export function OrbitalSection({ orbital, plane, nodes, sameScale, referenceLevel, playing, onScale, label }: OrbitalFigureProps & { plane: SectionPlane }) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const section = useMemo(() => sampleSection(orbital, plane, SECTION_POINTS), [orbital, plane]);
	const surfaces = useMemo(() => nodeSurfaces(orbital), [orbital]);
	const flows = orbital.kind === 'complesso' && orbital.m !== 0 && plane === 'xy';
	// Read by the drawing loop without restarting it.
	const live = useRef({ playing, onScale });
	useEffect(() => {
		live.current = { playing, onScale };
	});

	useEffect(() => {
		const node = canvas.current;
		const ctx = node?.getContext('2d');
		if (!node || !ctx) return;
		let raf = 0;
		let time = 0;
		let last = performance.now();
		const frameExtent = sameScale ? referenceExtent(referenceLevel) : section.extent;
		const rate = flowFactor(orbital.n, sameScale) * orbital.m;
		const floor = flowFloor(orbital.n) ** 2;

		const draw = () => {
			const dpr = Math.min(window.devicePixelRatio, 2);
			const width = node.clientWidth;
			const height = node.clientHeight;
			if (!width || !height) return;
			if (node.width !== Math.round(width * dpr) || node.height !== Math.round(height * dpr)) {
				node.width = Math.round(width * dpr);
				node.height = Math.round(height * dpr);
			}
			const ink = currentInk();
			const scale = Math.min(width, height) / 2 / (frameExtent * 1.12);
			live.current.onScale(scale);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			const cx = width / 2;
			const cy = height / 2;
			const reach = Math.hypot(width, height);

			// The two axes of the plane.
			ctx.strokeStyle = css(ink.line, 0.3);
			ctx.lineWidth = 1;
			ctx.setLineDash([]);
			ctx.beginPath();
			ctx.moveTo(0, cy);
			ctx.lineTo(width, cy);
			ctx.moveTo(cx, 0);
			ctx.lineTo(cx, height);
			ctx.stroke();
			ctx.fillStyle = css(ink.line, 0.6);
			ctx.font = 'italic 13px Georgia, serif';
			ctx.fillText(PLANE_AXES[plane][0], width - 16, cy - 6);
			ctx.fillText(PLANE_AXES[plane][1], cx + 6, 14);

			if (!section.empty) {
				// A point is a disc about a hundred-and-fiftieth of the cloud, never under a pixel.
				const radius = Math.max(0.9, section.extent * scale * 0.007);
				const inks = pair(ink, orbital.kind);
				for (const sign of [1, -1]) {
					ctx.fillStyle = css(inks[sign > 0 ? 0 : 1], 0.85);
					ctx.beginPath();
					for (let i = 0; i < SECTION_POINTS; i++) {
						if (section.signs[i] !== sign) continue;
						let a = section.positions[2 * i];
						let b = section.positions[2 * i + 1];
						if (flows) {
							const angle = (rate * time) / Math.max(a * a + b * b, floor);
							const c = Math.cos(angle);
							const s = Math.sin(angle);
							[a, b] = [c * a - s * b, s * a + c * b];
						}
						const x = cx + a * scale;
						const y = cy - b * scale;
						ctx.moveTo(x + radius, y);
						ctx.arc(x, y, radius, 0, 2 * Math.PI);
					}
					ctx.fill();
				}
			}

			if (nodes) {
				ctx.strokeStyle = css(ink.line, 0.8);
				ctx.lineWidth = 1.5;
				ctx.setLineDash([6, 5]);
				ctx.beginPath();
				for (const r of surfaces.spheres) {
					ctx.moveTo(cx + r * scale, cy);
					ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
				}
				const line = (dx: number, dy: number) => {
					ctx.moveTo(cx - dx * reach, cy + dy * reach);
					ctx.lineTo(cx + dx * reach, cy - dy * reach);
				};
				if (plane === 'xy') {
					// The planes through the axis cut this plane along lines through the nucleus.
					for (const phi of surfaces.planes) line(Math.cos(phi), Math.sin(phi));
				} else {
					// A cone cuts a plane through the axis along two lines; the cone at 90° along the horizontal one.
					for (const theta of surfaces.cones) {
						line(Math.sin(theta), Math.cos(theta));
						if (Math.abs(theta - Math.PI / 2) > 1e-6) line(-Math.sin(theta), Math.cos(theta));
					}
					// The planes through the axis, and the axis itself for a state that turns, meet this plane along z.
					if (surfaces.planes.length > 0 || (orbital.kind === 'complesso' && orbital.m !== 0)) line(0, 1);
				}
				ctx.stroke();
				ctx.setLineDash([]);
			}

			// The nucleus.
			ctx.fillStyle = css(ink.line);
			ctx.beginPath();
			ctx.arc(cx, cy, 2.5, 0, 2 * Math.PI);
			ctx.fill();
		};

		const tick = (now: number) => {
			raf = requestAnimationFrame(tick);
			if (live.current.playing) time += Math.min(0.1, (now - last) / 1000);
			last = now;
			draw();
		};
		draw();
		if (flows) raf = requestAnimationFrame(tick);
		const resize = new ResizeObserver(draw);
		resize.observe(node);
		const stopTheme = onThemeChange(draw);
		return () => {
			cancelAnimationFrame(raf);
			resize.disconnect();
			stopTheme();
		};
	}, [section, surfaces, orbital, plane, nodes, sameScale, referenceLevel, flows]);

	return (
		<>
			<canvas ref={canvas} role="img" aria-label={label} className="relative block aspect-[4/3] w-full" />
			{section.empty && (
				<p className="pointer-events-none absolute inset-x-0 top-[28%] px-8 text-center text-sm text-fg-muted">
					Questo piano è un nodo dell’orbitale: qui la probabilità di trovare l’elettrone è zero. Scegli un altro piano.
				</p>
			)}
		</>
	);
}
