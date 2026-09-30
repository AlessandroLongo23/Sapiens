'use client';

import { Drawing, frame, v, num, THIN, THICK, FONT, FONT_MATH, FONT_SIZE, TINT, type V } from '@/components/content/interactive/kit';
import { Axes, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A velocity-time graph made of straight pieces (lesson 43, Il grafico velocità-tempo; group 13): a squared sheet
 * with the time axis from 0 to `tMax` and the velocity axis from `vMin` (0 or negative) to `vMax`, numbered ticks
 * every `tPasso` seconds and `vPasso` m/s (one cell each), and the polyline through `punti` ([t, v] pairs in s and
 * m/s, t increasing). With `aree` (for the solution's scene) the areas between the graph and the time axis are filled,
 * blue above the axis and red below. The scene draws the data, never the answer.
 *
 *   { type: 'grafico-velocita-tempo', data: { tMax: 12, tPasso: 2, vMin: -4, vMax: 12, vPasso: 2,
 *       punti: [[0, 0], [4, 8], [10, 8], [12, 0]], aree: false } }
 *
 * fisica.tsx's Axes has no numbered ticks yet; they are drawn here, as in GraficoDati.tsx (group 3). The cartesian
 * plane of the kit will replace both.
 */
const RED = '#ffd9d9';
const pairs = (a: unknown): [number, number][] => (Array.isArray(a) ? a.filter((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) : []);
const places = (x: number) => {
	for (let d = 0; d <= 3; d++) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6) return d;
	return 3;
};

export default function GraficoVelocitaTempo({ data, alt }: SceneProps) {
	const tMax = Number(data.tMax), tStep = Number(data.tPasso);
	const vMin = Math.min(0, Number(data.vMin ?? 0)), vMax = Number(data.vMax), vStep = Number(data.vPasso);
	const pts = pairs(data.punti);
	if (!(tMax > 0 && tStep > 0 && vMax > 0 && vStep > 0) || pts.length < 2) return <p className="sr-only">{alt}</p>;
	const nx = Math.round(tMax / tStep), ny = Math.round((vMax - vMin) / vStep);
	const c = Math.min(0.6, 5.4 / nx, 4.2 / ny);
	const at = (t: number, w: number): V => v((t / tStep) * c, (w / vStep) * c);
	const x1 = nx * c, yLo = (vMin / vStep) * c, yHi = (vMax / vStep) * c;
	const f = frame(-1.0, x1 + 0.75, yLo - (vMin < 0 ? 0.35 : 0.8), yHi + 0.75);

	const grid: string[] = [];
	for (let i = 0; i <= nx; i++) grid.push(f.path([v(i * c, yLo), v(i * c, yHi)]));
	for (let j = Math.round(vMin / vStep); j <= Math.round(vMax / vStep); j++) grid.push(f.path([v(0, j * c), v(x1, j * c)]));

	// Areas, each piece cut where it crosses the axis.
	const pos: V[][] = [], neg: V[][] = [];
	if (data.aree) {
		const push = (a: [number, number], b: [number, number]) => {
			const poly = [at(a[0], 0), at(a[0], a[1]), at(b[0], b[1]), at(b[0], 0)];
			if (a[1] + b[1] > 0) pos.push(poly);
			else if (a[1] + b[1] < 0) neg.push(poly);
		};
		for (let i = 0; i + 1 < pts.length; i++) {
			const a = pts[i], b = pts[i + 1];
			if (a[1] * b[1] < 0) {
				const tc = a[0] + ((b[0] - a[0]) * a[1]) / (a[1] - b[1]);
				push(a, [tc, 0]);
				push([tc, 0], b);
			} else push(a, b);
		}
	}

	const dx = places(tStep), dy = places(vStep);
	const text = (p: V, s: string, anchor: 'start' | 'middle' | 'end', dyEm: string, size = 12) => {
		const q = f.px(p);
		return (
			<text x={q.x} y={q.y} dy={dyEm} textAnchor={anchor} fontSize={size} fontFamily={FONT}>
				{s}
			</text>
		);
	};
	const minus = (x: number, d: number) => (x < 0 ? `−${num(-x, d)}` : num(x, d));

	return (
		<Drawing f={f} label={alt}>
			<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={0.4} fill="none" />
			{pos.map((p, i) => <path key={`p${i}`} d={f.path(p, true)} fill={TINT.blue} stroke="none" />)}
			{neg.map((p, i) => <path key={`n${i}`} d={f.path(p, true)} fill={RED} stroke="none" />)}
			<Axes f={f} x0={0} x1={x1 + 0.35} y0={yLo - (vMin < 0 ? 0.15 : 0)} y1={yHi + 0.35} xName="" yName="" />
			<g pointerEvents="none">
				{Array.from({ length: nx }, (_, i) => i + 1).map((i) => (
					<g key={`x${i}`}>
						<path d={f.path([v(i * c, 0.07), v(i * c, -0.07)])} stroke="#000" strokeWidth={THIN} />
						{text(v(i * c, -0.12), num(i * tStep, dx), 'middle', '0.8em')}
					</g>
				))}
				{Array.from({ length: ny + 1 }, (_, j) => Math.round(vMin / vStep) + j)
					.filter((j) => j !== 0)
					.map((j) => (
						<g key={`y${j}`}>
							<path d={f.path([v(0.07, j * c), v(-0.07, j * c)])} stroke="#000" strokeWidth={THIN} />
							{text(v(-0.14, j * c), minus(j * vStep, dy), 'end', '0.35em')}
						</g>
					))}
				{text(v(-0.14, 0), '0', 'end', '0.9em')}
				<text x={f.px(v(x1 + 0.7, 0)).x} y={f.px(v(x1 + 0.7, 0)).y} dy={vMin < 0 ? '-0.5em' : '1.95em'} textAnchor="end" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">t</tspan>
					<tspan fontFamily={FONT}> (s)</tspan>
				</text>
				<text x={f.px(v(0, yHi + 0.45)).x} y={f.px(v(0, yHi + 0.45)).y} textAnchor="middle" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">v</tspan>
					<tspan fontFamily={FONT}> (m/s)</tspan>
				</text>
				<path d={f.path(pts.map(([t, w]) => at(t, w)))} stroke={QTY.velocita} strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{pts.map(([t, w], i) => {
					const q = f.px(at(t, w));
					return <circle key={i} cx={q.x} cy={q.y} r={2.4} fill={QTY.velocita} />;
				})}
			</g>
		</Drawing>
	);
}
