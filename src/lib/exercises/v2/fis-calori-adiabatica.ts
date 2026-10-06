/**
 * What the two generators of group 42 share (physics, third year: fis-calori-molari, fis-trasformazione-adiabatica):
 * the gases of lessons 112 and 113 with their degrees of freedom, numbers written as the lessons write them (decimal
 * comma, the unit after a thin space, scientific notation with \cdot 10^{n}), results rounded to n significant
 * figures and refused near a rounding boundary, and options that carry their unit and, for a work, their sign.
 * Rounding and the choice of the options are those of fis-calore.ts, used as they are.
 *
 * Data (lesson 112): R = 8,31 J/(mol·K); a monatomic gas has C_V = 3/2 R, a diatomic one 5/2 R; C_p = C_V + R;
 * γ = C_p / C_V is 5/3 or 7/5.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { choiceOf, decTex, sig } from './fis-calore';

export { choiceOf, decTex, sig };
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';
export { textBlock } from './insiemi';

export const R = 8.31;

export type Gas = { nome: string; l: 3 | 5; M: string };

/** The gases of the lessons; M is the molar mass in g/mol. */
export const GASES: Gas[] = [
	{ nome: 'elio', l: 3, M: '4.00' },
	{ nome: 'neon', l: 3, M: '20.2' },
	{ nome: 'argon', l: 3, M: '39.9' },
	{ nome: 'azoto', l: 5, M: '28.0' },
	{ nome: 'ossigeno', l: 5, M: '32.0' },
	{ nome: 'idrogeno', l: 5, M: '2.02' },
];
export const MONO = GASES.filter((g) => g.l === 3);
export const BI = GASES.filter((g) => g.l === 5);

export const kind = (g: Gas) => (g.l === 3 ? 'monoatomico' : 'biatomico');
export const CV = (g: Gas) => (g.l / 2) * R;
export const CP = (g: Gas) => (g.l / 2 + 1) * R;
export const gamma = (g: Gas) => (g.l + 2) / g.l;
/** C_V and C_p as the lessons write them: \frac{3}{2} R. */
export const cvTex = (g: Gas) => `\\tfrac{${g.l}}{2}`;
export const cpTex = (g: Gas) => `\\tfrac{${g.l + 2}}{2}`;
/** γ in a formula: \tfrac{5}{3} or 1{,}40. */
export const gammaTex = (g: Gas) => (g.l === 3 ? '\\tfrac{5}{3}' : '1{,}40');
/** γ − 1: \tfrac{2}{3} or 0{,}40. */
export const gamma1Tex = (g: Gas) => (g.l === 3 ? '\\tfrac{2}{3}' : '0{,}40');

export const t = (s: string) => `\\text{${s}}`;

export const UNIT: Record<string, string> = {
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	J: '\\text{J}',
	mol: '\\text{mol}',
	g: '\\text{g}',
	gmol: '\\text{g/mol}',
	L: '\\text{L}',
	atm: '\\text{atm}',
	Pa: '\\text{Pa}',
	R: '\\text{J/(mol}\\cdot\\text{K)}',
};

/** A quantity in LaTeX: 2{,}50\,\text{mol}. */
export const q = (num: string, u: string) => `${num}\\,${UNIT[u]}`;
/** The same inside prose: $…$. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;
export const tex = (s: string) => decTex(s);

export const R_TEXT = `Usa ${pq('R = 8{,}31', 'R')}.`;

type Rounded = { tex: string; value: string };

/** x rounded to n significant figures with its sign (a work done on the gas is negative). Null near a tie or at zero. */
export function sigS(x: number, n: number): Rounded | null {
	const r = sig(Math.abs(x), n);
	if (!r) return null;
	return x < 0 ? { tex: `-${r.tex}`, value: `-${r.value}` } : r;
}

/** A whole number that ends in zero and has no comma (150, 680): its last zero may or may not be significant. */
export const ambiguous = (r: Rounded) => /^-?\d*0$/.test(r.value);

export const opt = (r: Rounded, u: string): ChoiceOption => ({ latex: q(r.tex, u), values: [r.value] });

export function optsOf(xs: number[], n: number, u: string): ChoiceOption[] {
	return xs.map((x) => sigS(x, n)).filter((r): r is Rounded => r !== null).map((r) => opt(r, u));
}

/** The answer and its mistakes, with fallbacks (x·1,2, x·0,8, x·1,4, x·0,6) when two mistakes coincide. */
export function answerOf(rng: Rng, right: Rounded, exact: number, mistakes: number[], n: number, u: string, fallback = [exact * 1.2, exact * 0.8, exact * 1.4, exact * 0.6]): ChoiceAnswer {
	return choiceOf(rng, opt(right, u), optsOf(mistakes, n, u), optsOf(fallback, n, u));
}

/** A value with three significant figures from a count of hundredths: 150 → "1.50". */
export const h3 = (k: number) => (k / 100).toFixed(2);
/** A number cut (not rounded) to `n` figures, to be followed by an ellipsis: 1346.22 → "1346{,}2", 50.197 → "50{,}19". */
export const shown = (x: number, n = 5) => {
	const e = Math.floor(Math.log10(Math.abs(x)));
	const d = Math.max(0, n - 1 - e);
	return decTex((Math.trunc(x * 10 ** d + (x < 0 ? -1e-9 : 1e-9)) / 10 ** d).toFixed(d));
};

/**
 * The scene `curve-pv` (src/components/content/exercises/scenes/CurvePV.tsx): the adiabat p V^γ = costante through A,
 * drawn from V_A to V_B, with the data written on the axes. `pB` is written only in the solution's scene.
 */
export function pvScene(alt: string, d: { gamma: number; VA: number; pA: number; VB: number; unitaV: string; unitaP: string; testi: { VA: string; pA: string; VB: string; pB?: string } }): SceneRef {
	return { type: 'curve-pv', data: { curva: 'adiabatica', ...d }, alt };
}
