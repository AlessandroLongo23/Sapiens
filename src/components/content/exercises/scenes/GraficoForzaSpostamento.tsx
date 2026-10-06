'use client';

import { Drawing, frame, v, num, THIN, THICK, FONT, FONT_MATH, FONT_SIZE, TINT, type V } from '@/components/content/interactive/kit';
import { Axes, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A force-displacement graph made of straight pieces (lesson 77, Il lavoro di una forza variabile; group 30): a
 * squared sheet with the position axis from 0 to `xMax` and the force axis from `fMin` (0 or negative) to `fMax`,
 * numbered ticks every `xPasso` metres and `fPasso` newtons (one cell each), and the polyline through `punti`
 * ([x, F] pairs in m and N, x increasing). With `aree` (for the solution's scene) the areas between the graph and
 * the x axis are filled, orange above the axis and blue below. The scene draws the data, never the answer.
 *
 *   { type: 'grafico-forza-spostamento', data: { xMax: 6, xPasso: 1, fMin: -4, fMax: 8, fPasso: 2,
 *       punti: [[0, 8], [6, -4]], aree: false } }
 *
 * The numbered ticks are drawn here, as in GraficoVelocitaTempo.tsx (group 13), on which this scene is modelled.
 */
const pairs = (a: unknown): [number, number][] => (Array.isArray(a) ? a.filter((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) : []);
const places = (x: number) => {
	for (let d = 0; d <= 3; d++) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6) return d;
	return 3;
};

export default function GraficoForzaSpostamento({ data, alt }: SceneProps) {
	const xMax = Number(data.xMax), xStep = Number(data.xPasso);
	const fMin = Math.min(0, Number(data.fMin ?? 0)), fMax = Number(data.fMax), fStep = Number(data.fPasso);
	const pts = pairs(data.punti);
	if (!(xMax > 0 && xStep > 0 && fMax > 0 && fStep > 0) || pts.length < 2) return <p className="sr-only">{alt}</p>;
	const nx = Math.round(xMax / xStep), ny = Math.round((fMax - fMin) / fStep);
	const c = Math.min(0.6, 5.4 / nx, 4.2 / ny);
	const at = (x: number, w: number): V => v((x / xStep) * c, (w / fStep) * c);
	const x1 = nx * c, yLo = (fMin / fStep) * c, yHi = (fMax / fStep) * c;
	const f = frame(-1.0, x1 + 0.85, yLo - (fMin < 0 ? 0.35 : 0.8), yHi + 0.75);

	const grid: string[] = [];
	for (let i = 0; i <= nx; i++) grid.push(f.path([v(i * c, yLo), v(i * c, yHi)]));
	for (let j = Math.round(fMin / fStep); j <= Math.round(fMax / fStep); j++) grid.push(f.path([v(0, j * c), v(x1, j * c)]));

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
				const xc = a[0] + ((b[0] - a[0]) * a[1]) / (a[1] - b[1]);
				push(a, [xc, 0]);
				push([xc, 0], b);
			} else push(a, b);
		}
	}

	const dx = places(xStep), dy = places(fStep);
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
			{pos.map((p, i) => <path key={`p${i}`} d={f.path(p, true)} fill={TINT.orange} stroke="none" />)}
			{neg.map((p, i) => <path key={`n${i}`} d={f.path(p, true)} fill={TINT.blue20} stroke="none" />)}
			<Axes f={f} x0={0} x1={x1 + 0.35} y0={yLo - (fMin < 0 ? 0.15 : 0)} y1={yHi + 0.35} xName="" yName="" />
			<g pointerEvents="none">
				{Array.from({ length: nx }, (_, i) => i + 1).map((i) => (
					<g key={`x${i}`}>
						<path d={f.path([v(i * c, 0.07), v(i * c, -0.07)])} stroke="#000" strokeWidth={THIN} />
						{text(v(i * c, fMin < 0 ? 0.12 : -0.12), num(i * xStep, dx), 'middle', fMin < 0 ? '-0.2em' : '0.8em')}
					</g>
				))}
				{Array.from({ length: ny + 1 }, (_, j) => Math.round(fMin / fStep) + j)
					.filter((j) => j !== 0)
					.map((j) => (
						<g key={`y${j}`}>
							<path d={f.path([v(0.07, j * c), v(-0.07, j * c)])} stroke="#000" strokeWidth={THIN} />
							{text(v(-0.14, j * c), minus(j * fStep, dy), 'end', '0.35em')}
						</g>
					))}
				{text(v(-0.14, 0), '0', 'end', fMin < 0 ? '0.35em' : '0.9em')}
				<text x={f.px(v(x1 + 0.8, 0)).x} y={f.px(v(x1 + 0.8, 0)).y} dy={fMin < 0 ? '1.3em' : '1.95em'} textAnchor="end" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">x</tspan>
					<tspan fontFamily={FONT}> (m)</tspan>
				</text>
				<text x={f.px(v(0, yHi + 0.45)).x} y={f.px(v(0, yHi + 0.45)).y} textAnchor="middle" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">F</tspan>
					<tspan fontFamily={FONT}> (N)</tspan>
				</text>
				<path d={f.path(pts.map(([x, w]) => at(x, w)))} stroke={QTY.forza} strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{pts.map(([x, w], i) => {
					const q = f.px(at(x, w));
					return <circle key={i} cx={q.x} cy={q.y} r={2.4} fill={QTY.forza} />;
				})}
			</g>
		</Drawing>
	);
}
