/**
 * What the three generators of heat share (physics, second year, group 20: fis-equilibrio-termico,
 * fis-propagazione-calore, fis-passaggi-stato): numbers written as the lessons 68-70 write them (decimal comma, units
 * after a thin space, °C as ^\circ\text{C}, scientific notation with \cdot 10^{n}), results rounded to n significant
 * figures and refused when too close to a rounding boundary, and options that carry their unit. Values in the options
 * are plain decimal strings ("383", "0.012", "1.7e5"), so the checkers can read them back.
 *
 * Data (lessons 68-70, docs/lezioni/fisica/note/): water c = 4186 J/(kg·°C) as the Amaldi, ice 2,1·10³, steam 2,0·10³,
 * L_f = 3,34·10⁵ J/kg, L_v = 2,26·10⁶ J/kg.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { choiceOf, decTex } from './vettori';

export { choiceOf, decTex };
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';
export { textBlock } from './insiemi';

export const C_WATER = 4186;
export const C_ICE = 2100;
export const C_STEAM = 2000;
export const LF = 334000;
export const LV = 2260000;

export const t = (s: string) => `\\text{${s}}`;

/** Units as the lessons write them. */
export const UNIT: Record<string, string> = {
	C: '^\\circ\\text{C}',
	J: '\\text{J}',
	kJ: '\\text{kJ}',
	g: '\\text{g}',
	kg: '\\text{kg}',
	W: '\\text{W}',
	m: '\\text{m}',
	cm: '\\text{cm}',
	mm: '\\text{mm}',
	m2: '\\text{m}^2',
	cJ: '\\text{J/(kg}\\cdot{}^\\circ\\text{C)}',
	Jkg: '\\text{J/kg}',
	lam: '\\text{W/(m}\\cdot\\text{K)}',
	h: '\\text{h}',
	min: '\\text{min}',
};

/** A quantity in LaTeX: 20{,}5\,^\circ\text{C}. */
export const q = (num: string, u: string) => `${num}\\,${UNIT[u]}`;
/** The same inside prose: $…$. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;

/** Is x within 1e-6 of a rounding tie at the digit 10^k? */
function tie(x: number, k: number) {
	const y = Math.abs(x) / 10 ** k;
	return Math.abs(y - Math.floor(y) - 0.5) < 1e-6;
}

/**
 * x rounded to n significant figures, as LaTeX and as a value string. Plain from 0,001 to below 10^n (so 383 with three
 * figures, 12 with two), otherwise in scientific notation (1{,}7 \cdot 10^{5}). Null near a tie.
 */
export function sig(x: number, n: number): { tex: string; value: string } | null {
	if (!Number.isFinite(x) || x <= 0) return null;
	let e = Math.floor(Math.log10(x));
	if (10 ** e > x) e -= 1;
	if (10 ** (e + 1) <= x) e += 1;
	if (tie(x, e - n + 1)) return null;
	let m = Math.round(x / 10 ** (e - n + 1));
	if (m >= 10 ** n) {
		m /= 10;
		e += 1;
	}
	if (e < n && e >= -3) {
		// plain: m · 10^(e-n+1)
		const k = n - 1 - e; // decimals
		const s = (m / 10 ** k).toFixed(k);
		return { tex: decTex(s), value: s };
	}
	const mant = (m / 10 ** (n - 1)).toFixed(n - 1);
	return { tex: `${decTex(mant)} \\cdot 10^{${e}}`, value: `${mant}e${e}` };
}

/** The option of a rounded quantity. */
export const opt = (r: { tex: string; value: string }, u: string): ChoiceOption => ({ latex: q(r.tex, u), values: [r.value] });

/** Options from exact values, rounded like the answer; the ones refused are skipped. */
export function optsOf(xs: number[], n: number, u: string): ChoiceOption[] {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => opt(r, u));
}

/** The answer and its mistakes, with fallbacks (by default x·1,2, x·0,8, x·1,4, x·0,6) when two mistakes coincide. */
export function answerOf(rng: Rng, right: { tex: string; value: string }, exact: number, mistakes: number[], n: number, u: string, fallback = [exact * 1.2, exact * 0.8, exact * 1.4, exact * 0.6]): ChoiceAnswer {
	return choiceOf(rng, opt(right, u), optsOf(mistakes, n, u), optsOf(fallback, n, u));
}

/** A decimal string with `d` decimals from an integer count of units (k = 35, d = 2 → "0.35"). */
export const dec = (k: number, d: number) => (k / 10 ** d).toFixed(d);

/** Masses in kg with two significant figures, 0,11 to 0,99 without a trailing zero. */
export function mass2(rng: Rng, lo = 11, hi = 99): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return dec(k, 2);
	}
}

export const tex = (s: string) => decTex(s);
