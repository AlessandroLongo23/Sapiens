/**
 * What the four generators of group 32 share (physics, third year: fis-forze-conservative-energia,
 * fis-bilancio-energia, fis-quantita-moto-def, fis-impulso), on top of fis-energia.ts, fisica-equilibrio.ts and
 * vettori.ts, which are used as they are: quantities in a compound unit (kg·m/s, N·s), which \text{} cannot hold in
 * one piece; exact decimals for values read on a graph; the option "0" of a unit; and the scene of a graph made of
 * straight pieces (type `grafico-spezzata`, src/components/content/exercises/scenes/GraficoSpezzata.tsx).
 */
import type { ChoiceOption, SceneRef } from './types';
import { decTex } from './vettori';

/** kg·m/s and N·s as LaTeX, to follow a number after a thin space. */
export const KGMS = '\\text{kg}\\cdot\\text{m/s}';
export const NS = '\\text{N}\\cdot\\text{s}';

/** A quantity in a unit already written in LaTeX: 3{,}5\,\text{N}\cdot\text{s}. */
export const uq = (s: string, unitTex: string) => `${decTex(s)}\\,${unitTex}`;
/** The same inside a line of prose. */
export const puq = (s: string, unitTex: string) => `$${uq(s, unitTex)}$`;
/** An option in such a unit; its value is the decimal string. */
export const uOpt = (s: string, unitTex: string): ChoiceOption => ({ latex: uq(s, unitTex), values: [s] });
/** Options from values that may be missing. */
export const uOptsTex = (xs: (string | null)[], unitTex: string) => xs.filter((x): x is string => x !== null).map((s) => uOpt(s, unitTex));

/** An exact decimal with at most `places` decimals and no useless zeros ("7.5", "15", "-2.5"); null if it is not one. */
export function dec(x: number, places = 2): string | null {
	const p = 10 ** places;
	const r = Math.round(x * p);
	if (Math.abs(x * p - r) > 1e-7) return null;
	const s = (r / p).toFixed(places);
	return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

export type GraphAxis = { nome: string; unita: string; passo: number; celle: number; etichette?: number };

/** The scene of a graph made of straight pieces; `livello` is a dashed horizontal line, `area` and `segna` are for the solution. */
export function spezzata(alt: string, d: { x: GraphAxis; y: GraphAxis; punti: [number, number][]; livello?: { valore: number; nome: string }; area?: boolean; segna?: [number, number][] }): SceneRef {
	const data: Record<string, unknown> = { x: d.x, y: d.y, punti: d.punti };
	if (d.livello) data.livello = d.livello;
	if (d.area) data.area = true;
	if (d.segna?.length) data.segna = d.segna;
	return { type: 'grafico-spezzata', data, alt };
}

/** The value of a piecewise-linear graph at x (x inside the graph). */
export function valueAt(points: [number, number][], x: number): number {
	for (let i = 0; i + 1 < points.length; i++) {
		const [xa, ya] = points[i], [xb, yb] = points[i + 1];
		if (x >= xa && x <= xb) return ya + ((yb - ya) * (x - xa)) / (xb - xa);
	}
	return NaN;
}
