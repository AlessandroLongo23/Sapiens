'use client';

import { Drawing, frame, v, num, THIN, THICK, DASH, FONT, FONT_MATH, FONT_SIZE, INK, TINT, type V } from '@/components/content/interactive/kit';
import { Axes } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A graph made of straight pieces on a squared sheet, for the exercises of group 32 (physics, third year): the
 * potential energy against the position (fis-forze-conservative-energia) and the force against the time (fis-impulso).
 * Each axis has its name, its unit, the value of one cell (`passo`), the number of cells and how often a tick is
 * numbered; `punti` are the corners of the graph, in the units of the axes, x increasing. `livello` draws a dashed
 * horizontal line with its name (the mechanical energy E); `area` fills the region between the graph and the x axis
 * and `segna` marks points in orange, both for the solution's scene. The scene draws the data, never the answer.
 *
 *   { type: 'grafico-spezzata', data: {
 *       x: { nome: 'x', unita: 'm', passo: 1, celle: 8, etichette: 1 },
 *       y: { nome: 'U', unita: 'J', passo: 5, celle: 10, etichette: 2 },
 *       punti: [[0, 45], [2, 10], [5, 25], [8, 25]], livello: { valore: 40, nome: 'E' } } }
 *
 * The numbered ticks are drawn here, as in GraficoDati.tsx: fisica.tsx's Axes has none.
 */
type Axis = { nome: string; unita: string; passo: number; celle: number; etichette?: number };

const isAxis = (a: unknown): a is Axis => !!a && typeof a === 'object' && Number((a as Axis).passo) > 0 && Number((a as Axis).celle) > 0;
const pairs = (a: unknown): [number, number][] => (Array.isArray(a) ? a.filter((p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) : []);
const places = (x: number) => {
	for (let d = 0; d <= 4; d++) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6) return d;
	return 4;
};

export default function GraficoSpezzata({ data, alt }: SceneProps) {
	const points = pairs(data.punti);
	if (!isAxis(data.x) || !isAxis(data.y) || points.length < 2) return <p className="sr-only">{alt}</p>;
	const X = data.x, Y = data.y;
	const c = Math.min(0.6, 5.4 / X.celle, 4.2 / Y.celle);
	const Lx = X.celle * c, Ly = Y.celle * c;
	const at = (p: [number, number]): V => v((p[0] / X.passo) * c, (p[1] / Y.passo) * c);
	const f = frame(-1.0, Lx + 0.75, -0.95, Ly + 0.75);

	const grid: string[] = [];
	for (let i = 0; i <= X.celle; i++) grid.push(f.path([v(i * c, 0), v(i * c, Ly)]));
	for (let j = 0; j <= Y.celle; j++) grid.push(f.path([v(0, j * c), v(Lx, j * c)]));
	const everyX = X.etichette ?? 1, everyY = Y.etichette ?? 1;
	const dx = places(X.passo * everyX), dy = places(Y.passo * everyY);
	const ticksX = Array.from({ length: Math.floor(X.celle / everyX) }, (_, i) => (i + 1) * everyX);
	const ticksY = Array.from({ length: Math.floor(Y.celle / everyY) }, (_, j) => (j + 1) * everyY);

	const level = data.livello as { valore?: number; nome?: string } | undefined;
	const hasLevel = !!level && Number.isFinite(level.valore);
	const marked = pairs(data.segna);
	const line = points.map(at);
	const text = (p: V, s: string, anchor: 'start' | 'middle' | 'end', dyEm: string, size = 12) => {
		const q = f.px(p);
		return (
			<text x={q.x} y={q.y} dy={dyEm} textAnchor={anchor} fontSize={size} fontFamily={FONT}>
				{s}
			</text>
		);
	};

	return (
		<Drawing f={f} label={alt}>
			{data.area === true && <path d={f.path([v(line[0].x, 0), ...line, v(line[line.length - 1].x, 0)], true)} fill={TINT.orange} stroke="none" />}
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
				<text x={f.px(v(Lx + 0.7, -0.12)).x} y={f.px(v(Lx + 0.7, -0.12)).y} dy="1.95em" textAnchor="end" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">{X.nome}</tspan>
					<tspan fontFamily={FONT}> ({X.unita})</tspan>
				</text>
				<text x={f.px(v(0, Ly + 0.45)).x} y={f.px(v(0, Ly + 0.45)).y} textAnchor="middle" fontSize={FONT_SIZE - 1}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">{Y.nome}</tspan>
					<tspan fontFamily={FONT}> ({Y.unita})</tspan>
				</text>
				<path d={f.path(line)} stroke={INK.blue} strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{hasLevel && (
					<>
						<path d={f.path([at([0, level.valore as number]), v(Lx, at([0, level.valore as number]).y)])} stroke="#000" strokeWidth={THICK} strokeDasharray={DASH} fill="none" />
						{typeof level.nome === 'string' && (
							<text x={f.px(v(Lx + 0.12, 0)).x} y={f.px(at([0, level.valore as number])).y} dy="0.35em" textAnchor="start" fontSize={FONT_SIZE - 1} fontFamily={FONT_MATH} fontStyle="italic">
								{level.nome}
							</text>
						)}
					</>
				)}
				{marked.map((p, i) => {
					const q = f.px(at(p));
					return <circle key={i} cx={q.x} cy={q.y} r={3.4} fill={INK.orange} />;
				})}
			</g>
		</Drawing>
	);
}
