/**
 * What the three generators of group 35 share (physics, third year: fis-energia-rotazionale, fis-momento-angolare-def,
 * fis-conservazione-momento-angolare): quantities whose unit is not a single word (kg·m², kg·m²/s, N·m, m/s²), the
 * round bodies of the lessons with the number c of I = c m r², answers rounded to two significant figures that never
 * end with an ambiguous zero, and the four options with the mistakes of the lessons' warnings.
 *
 * Data come from fis-energia.ts (data2: two significant figures, no trailing zero), g = 9,8 m/s².
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { choiceOf, decTex } from './vettori';
import { r2 } from './fisica-equilibrio';

export const G = 9.8;

/** Units that need more than `\text{…}`: the exponent and the dot stay outside the text, as KaTeX wants. */
const UNIT_TEX: Record<string, string> = {
	'kg·m²': '\\text{kg}\\cdot\\text{m}^2',
	'kg·m²/s': '\\text{kg}\\cdot\\text{m}^2/\\text{s}',
	'N·m': '\\text{N}\\cdot\\text{m}',
	'm/s²': '\\text{m/s}^2',
};
export const unitTex = (unit: string) => UNIT_TEX[unit] ?? `\\text{${unit}}`;

/** A quantity, "3{,}5\,\text{kg}\cdot\text{m}^2", and the same between dollars for the prose. */
export const q = (s: string, unit: string) => `${decTex(s)}\\,${unitTex(unit)}`;
export const pq = (s: string, unit: string) => `$${q(s, unit)}$`;

/** Two significant figures, or null: too close to a boundary, 100 or more, or a two-digit number ending in zero. */
export function r2n(x: number): string | null {
	if (!Number.isFinite(x) || x <= 0) return null;
	const s = r2(x);
	return s === null || /^\d0$/.test(s) ? null : s;
}

const option = (s: string, unit: string): ChoiceOption => ({ latex: q(s, unit), values: [s] });

/**
 * The four options of an answer `exact` in `unit`: the answer, the mistakes that round to something at least 8% away
 * from it, then the answer scaled as a fallback. Null if the answer itself cannot be written with two figures.
 */
export function pick4(rng: Rng, exact: number, unit: string, mistakes: number[]): { ans: string; answer: ChoiceAnswer } | null {
	const ans = r2n(exact);
	if (ans === null) return null;
	const a = Number(ans);
	const make = (xs: number[]) =>
		xs
			.map(r2n)
			.filter((s): s is string => s !== null && Math.abs(Number(s) - a) > 0.08 * a)
			.map((s) => option(s, unit));
	return { ans, answer: choiceOf(rng, option(ans, unit), make(mistakes), make([exact * 1.25, exact * 0.75, exact * 1.5, exact * 0.6, exact * 1.8])) };
}

/** The round bodies of lessons 87 and 89: I = c m r². `key` is the scene's name for the body. */
export interface Shape {
	key: 'anello' | 'cilindro' | 'sfera' | 'sfera-cava';
	/** With the article, for the prose: "un anello sottile". */
	nome: string;
	/** With the definite article: "l'anello". */
	il: string;
	c: number;
	/** c as LaTeX, and 1 + c as a decimal for the steps. */
	cTex: string;
	sum: string;
	/** The moment of inertia, as the lessons' table writes it. */
	inertia: string;
}
export const SHAPES: Shape[] = [
	{ key: 'anello', nome: 'un anello sottile', il: "l'anello", c: 1, cTex: '1', sum: '2', inertia: 'm r^2' },
	{ key: 'cilindro', nome: 'un cilindro pieno', il: 'il cilindro pieno', c: 1 / 2, cTex: '\\tfrac{1}{2}', sum: '1{,}5', inertia: '\\tfrac{1}{2} m r^2' },
	{ key: 'sfera', nome: 'una sfera piena', il: 'la sfera piena', c: 2 / 5, cTex: '\\tfrac{2}{5}', sum: '1{,}4', inertia: '\\tfrac{2}{5} m r^2' },
	{ key: 'sfera-cava', nome: 'una sfera cava sottile', il: 'la sfera cava', c: 2 / 3, cTex: '\\tfrac{2}{3}', sum: '\\tfrac{5}{3}', inertia: '\\tfrac{2}{3} m r^2' },
];

/** Centimetres written as metres, exactly: "35" → "0.35", "7.5" → "0.075". */
export function cmToM(cm: string): string {
	const [whole, dec = ''] = cm.split('.');
	const digits = whole.padStart(3, '0') + dec;
	const cut = whole.padStart(3, '0').length - 2;
	return `${Number(digits.slice(0, cut))}.${digits.slice(cut)}`.replace(/0+$/, '').replace(/\.$/, '');
}
