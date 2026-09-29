'use client';

import { Drawing, frame, v, num, THIN, THICK, FONT, FONT_MATH, FONT_SIZE, INK, type V } from '@/components/content/interactive/kit';
import { Axes } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * The graph of a physics exercise on graphs and proportionality (group 3: fis-tabelle-grafici,
 * fis-proporzionalita-diretta, fis-proporzionalita-inversa): a squared sheet with the two axes, their names and units,
 * numbered ticks, the measured points and, if given, the line through them. Values are in the exercise's units; the
 * sheet has square cells, each worth `passo` of its axis, as on an exercise book.
 *
 *   { type: 'grafico-dati', data: {
 *       x: { nome: 'm', unita: 'g', passo: 25, celle: 12, etichette: 2 },
 *       y: { nome: 'Δl', unita: 'cm', passo: 1, celle: 11, etichette: 2 },
 *       punti: [[50, 2], [100, 4]], barre: 0.2,
 *       linea: { tipo: 'retta', m: 0.04, q: 0 },        // or { tipo: 'inversa', k }, { tipo: 'quadratica', k }
 *       evidenzia: [[125, 5]] } }
 *
 * Names and units are plain text (Unicode: Δl, cm³, °C), not LaTeX. The scene draws the data, never the answer: a
 * point to read or a slope to compute is up to the student (`evidenzia` is for the solution's scene).
 *
 * The numbered ticks are drawn here: fisica.tsx's Axes has none yet. The cartesian plane of the kit will replace them.
 */
type Axis = { nome: string; unita: string; passo: number; celle: number; etichette?: number };
type Line = { tipo: 'retta' | 'inversa' | 'quadratica'; m?: number; q?: number; k?: number };

const isAxis = (a: unknown): a is Axis => !!a && typeof a === 'object' && Number((a as Axis).passo) > 0 && Number((a as Axis).celle) > 0;
const pairs = (a: unknown): [number, number][] => (Array.isArray(a) ? a.filter((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) : []);

/** Decimals needed to write x without rounding (at most 4). */
const places = (x: number) => {
	for (let d = 0; d <= 4; d++) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6) return d;
	return 4;
};

export default function GraficoDati({ data, alt }: SceneProps) {
	if (!isAxis(data.x) || !isAxis(data.y)) return <p className="sr-only">{alt}</p>;
	const X = data.x, Y = data.y;
	const c = Math.min(0.6, 5.4 / X.celle, 4.2 / Y.celle);
	const Lx = X.celle * c, Ly = Y.celle * c;
	const at = (p: [number, number]): V => v((p[0] / X.passo) * c, (p[1] / Y.passo) * c);
	const f = frame(-1.0, Lx + 0.55, -0.95, Ly + 0.75);

	const grid: string[] = [];
	for (let i = 0; i <= X.celle; i++) grid.push(f.path([v(i * c, 0), v(i * c, Ly)]));
	for (let j = 0; j <= Y.celle; j++) grid.push(f.path([v(0, j * c), v(Lx, j * c)]));

	const everyX = X.etichette ?? 1, everyY = Y.etichette ?? 1;
	const dx = places(X.passo * everyX), dy = places(Y.passo * everyY);
	const ticksX = Array.from({ length: Math.floor(X.celle / everyX) }, (_, i) => (i + 1) * everyX);
	const ticksY = Array.from({ length: Math.floor(Y.celle / everyY) }, (_, j) => (j + 1) * everyY);

	// The line, sampled and cut to the sheet.
	const L = data.linea as Line | undefined;
	const fn = !L ? null : L.tipo === 'retta' ? (x: number) => (L.m ?? 0) * x + (L.q ?? 0) : L.tipo === 'inversa' ? (x: number) => (L.k ?? 0) / x : (x: number) => (L.k ?? 0) * x * x;
	const segments: V[][] = [];
	if (fn) {
		let cur: V[] = [];
		const N = 240;
		for (let i = 0; i <= N; i++) {
			const x = (X.celle * X.passo * i) / N;
			const y = x === 0 && L?.tipo === 'inversa' ? Infinity : fn(x);
			const p = at([x, y]);
			if (Number.isFinite(y) && p.y >= -1e-9 && p.y <= Ly + 1e-9) cur.push(p);
			else if (cur.length) {
				segments.push(cur);
				cur = [];
			}
		}
		if (cur.length) segments.push(cur);
	}

	const bar = Number(data.barre ?? 0);
	const points = pairs(data.punti);
	const marked = pairs(data.evidenzia);
	const text = (p: V, s: string, anchor: 'start' | 'middle' | 'end', dy: string, size = 12) => {
		const q = f.px(p);
		return (
			<text x={q.x} y={q.y} dy={dy} textAnchor={anchor} fontSize={size} fontFamily={FONT}>
				{s}
			</text>
		);
	};

	return (
		<Drawing f={f} label={alt}>
			<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={0.4} fill="none" />
			<Axes f={f} x0={0} x1={Lx + 0.35} y0={0} y1={Ly + 0.35} xName="" yName="" />
			<g pointerEvents="none">
				{ticksX.map((i) => (
					<g key={`x${i}`}>
						<path d={f.path([v(i * c, 0.07), v(i * c, -0.07)])} stroke="#000" strokeWidth={THIN} />
						{text(v(i * c, -0.12), num(i * X.passo, dx), 'middle', '0.8em')}
					</g>
				))}
				{ticksY.map((j) => (
					<g key={`y${j}`}>
						<path d={f.path([v(0.07, j * c), v(-0.07, j * c)])} stroke="#000" strokeWidth={THIN} />
						{text(v(-0.14, j * c), num(j * Y.passo, dy), 'end', '0.35em')}
					</g>
				))}
				{text(v(-0.14, 0), '0', 'end', '0.9em')}
				{/* axis names: the letter in italic, the unit upright, as in the lessons' TikZ */}
				<text x={f.px(v(Lx + 0.5, -0.12)).x} y={f.px(v(Lx + 0.5, -0.12)).y} dy="1.95em" textAnchor="end" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">{X.nome}</tspan>
					<tspan fontFamily={FONT}> ({X.unita})</tspan>
				</text>
				<text x={f.px(v(0, Ly + 0.45)).x} y={f.px(v(0, Ly + 0.45)).y} textAnchor="middle" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">{Y.nome}</tspan>
					<tspan fontFamily={FONT}> ({Y.unita})</tspan>
				</text>
				{segments.map((s, i) => (
					<path key={i} d={f.path(s)} stroke="#6666ff" strokeWidth={THICK} fill="none" />
				))}
				{points.map((p, i) => {
					const q = f.px(at(p));
					const h = (bar / Y.passo) * c * (f.W / (f.x1 - f.x0));
					return (
						<g key={i}>
							{h > 2.5 && <path d={`M${q.x - 3},${q.y - h} H${q.x + 3} M${q.x},${q.y - h} V${q.y + h} M${q.x - 3},${q.y + h} H${q.x + 3}`} stroke="#000" strokeWidth={THIN} fill="none" />}
							<circle cx={q.x} cy={q.y} r={2.6} fill="#000" />
						</g>
					);
				})}
				{marked.map((p, i) => {
					const q = f.px(at(p));
					return <circle key={i} cx={q.x} cy={q.y} r={3.4} fill={INK.orange} />;
				})}
			</g>
		</Drawing>
	);
}
