'use client';

import type { ReactNode } from 'react';
import { v, add, THIN, THICK, FONT, FONT_MATH, FONT_SIZE, TINT, type Frame, type V } from '../kit';
import { Arrow } from '../fisica';

/**
 * Pieces of the kinematics figures of group 12 (lessons 38-41): a straight road drawn upright beside a space-time
 * graph, sharing its vertical scale, so a vehicle on the road and its point on the graph stand at the same height;
 * vehicles seen from above; the graph's axes with numbered ticks. The graph is drawn for its own figure (the kit has
 * no cartesian plane yet: docs/lezioni/fisica/README.md, "Notazioni del secondo anno").
 *
 * Coordinates: the graph's origin is at (0, 0), `t` runs right for `w` cm and `s` runs up for `h` cm.
 */

export type GraphScale = { tMax: number; sMax: number; w: number; h: number; sMin?: number };

/** The point of the graph for time t and position s. */
export const at = (g: GraphScale, t: number, s: number): V => v((t / g.tMax) * g.w, ((s - (g.sMin ?? 0)) / (g.sMax - (g.sMin ?? 0))) * g.h);

/** The road, upright, from y = 0 to y = h, between x0 and x1, with its dashed middle line. */
export function Road({ f, x0, x1, h }: { f: Frame; x0: number; x1: number; h: number }) {
	const m = (x0 + x1) / 2;
	return (
		<g pointerEvents="none">
			<path d={f.path([v(x0, -0.4), v(x1, -0.4), v(x1, h + 0.15), v(x0, h + 0.15)], true)} fill={TINT.gray} stroke="none" />
			<path d={f.path([v(x0, -0.4), v(x0, h + 0.15)])} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(x1, -0.4), v(x1, h + 0.15)])} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(m, -0.4), v(m, h + 0.15)])} stroke="#000" strokeWidth={THIN} strokeDasharray="4 4" />
		</g>
	);
}

/**
 * A vehicle seen from above at `c`, pointing up (`dir` 1) or down (−1): a car (`long` false) or a truck. `fill` is a
 * TINT colour.
 */
export function TopVehicle({ f, c, dir, fill = TINT.blue, long = false }: { f: Frame; c: V; dir: 1 | -1; fill?: string; long?: boolean }) {
	const W = 0.3, L = long ? 0.62 : 0.5;
	const p = (x: number, y: number) => add(c, v(x, dir * y));
	const wheels = [-1, 1].flatMap((sx) => [-0.3, 0.28].map((sy) => f.path([p(sx * (W / 2 + 0.03), sy * L - 0.05), p(sx * (W / 2 + 0.03), sy * L + 0.05)])));
	return (
		<g pointerEvents="none">
			<path d={wheels.join(' ')} stroke="#000" strokeWidth={2.4} />
			<path d={f.path([p(-W / 2, -L / 2), p(W / 2, -L / 2), p(W / 2, L / 2 - 0.06), p(W / 2 - 0.05, L / 2), p(-W / 2 + 0.05, L / 2), p(-W / 2, L / 2 - 0.06)], true)} fill={fill} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			{long ? (
				<path d={f.path([p(-W / 2, L / 2 - 0.16), p(W / 2, L / 2 - 0.16)])} stroke="#000" strokeWidth={THIN} />
			) : (
				<path d={f.path([p(-W / 2 + 0.04, L / 2 - 0.2), p(W / 2 - 0.04, L / 2 - 0.2), p(W / 2 - 0.07, L / 2 - 0.1), p(-W / 2 + 0.07, L / 2 - 0.1)], true)} fill="#fff" stroke="#000" strokeWidth={THIN} />
			)}
		</g>
	);
}

/** A small text, upright (numbers) or italic (a letter), anchored like a TikZ node. */
export function Txt({ f, p, anchor = 'middle', dy = '0.35em', italic = false, size = 12, color = '#000', children }: { f: Frame; p: V; anchor?: 'start' | 'middle' | 'end'; dy?: string; italic?: boolean; size?: number; color?: string; children: ReactNode }) {
	const q = f.px(p);
	return (
		<text x={q.x} y={q.y} dy={dy} textAnchor={anchor} fontSize={size} fontStyle={italic ? 'italic' : 'normal'} fontFamily={italic ? FONT_MATH : FONT} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}

/** A number the Italian way, for the ticks. */
const tickNum = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',').replace('-', '−');

/**
 * The axes of a space-time graph (or velocity-time: `yName`, `yUnit`) with a light grid and numbered ticks every
 * `tStep` and `sStep`, as the lessons' TikZ graphs: `\draw[gray!25, very thin] grid`, `\draw[->]`, `\small` labels.
 */
export function GraphAxes({ f, g, tStep, sStep, yName = 's', yUnit = 'm', xName = 't', xUnit = 's' }: { f: Frame; g: GraphScale; tStep: number; sStep: number; yName?: string; yUnit?: string; xName?: string; xUnit?: string }) {
	const sMin = g.sMin ?? 0;
	const grid: string[] = [];
	const ts: number[] = [];
	const ss: number[] = [];
	for (let t = tStep; t <= g.tMax + 1e-9; t += tStep) ts.push(t);
	for (let s = Math.ceil(sMin / sStep) * sStep; s <= g.sMax + 1e-9; s += sStep) ss.push(s);
	for (const t of ts) grid.push(f.path([at(g, t, sMin), at(g, t, g.sMax)]));
	for (const s of ss) grid.push(f.path([at(g, 0, s), at(g, g.tMax, s)]));
	const y0 = at(g, 0, 0).y; // the t axis, where s = 0
	return (
		<g pointerEvents="none">
			<path d={grid.join(' ')} stroke="#e0e0e0" strokeWidth={0.4} fill="none" />
			<Arrow f={f} from={v(0, y0)} to={v(g.w + 0.35, y0)} weight="thin" />
			<Arrow f={f} from={v(0, 0)} to={v(0, g.h + 0.35)} weight="thin" />
			{ts.map((t) => (
				<Txt key={`t${t}`} f={f} p={v(at(g, t, 0).x, y0 - 0.1)} dy="0.8em">
					{tickNum(t)}
				</Txt>
			))}
			{ss.map((s) => (
				<Txt key={`s${s}`} f={f} p={v(-0.1, at(g, 0, s).y)} anchor="end">
					{tickNum(s)}
				</Txt>
			))}
			<text x={f.px(v(g.w + 0.45, y0)).x} y={f.px(v(g.w + 0.45, y0)).y} dy="0.35em" fontSize={FONT_SIZE - 2}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">{xName}</tspan>
				<tspan fontFamily={FONT}> ({xUnit})</tspan>
			</text>
			<text x={f.px(v(0, g.h + 0.45)).x} y={f.px(v(0, g.h + 0.45)).y} textAnchor="middle" fontSize={FONT_SIZE - 2}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">{yName}</tspan>
				<tspan fontFamily={FONT}> ({yUnit})</tspan>
			</text>
		</g>
	);
}
