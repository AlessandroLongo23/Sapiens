/**
 * What the three generators of group 44 share (physics, third year: fis-frigoriferi, fis-entropia,
 * fis-entropia-disordine): numbers written as lessons 117-119 write them (decimal comma, unit after a thin space,
 * scientific notation with \cdot 10^{n}), results rounded to n significant figures or to d decimals, with their sign
 * where the sign is the point (an entropy change), refused when too close to a rounding boundary, and options that
 * carry their unit. Values in the options are plain decimal strings ("5.9", "-3.00", "9.22e-22"), so the checkers can
 * read them back.
 *
 * Data (README of physics and lessons 117-119): R = 8,31 J/(mol·K), k_B = 1,38·10⁻²³ J/K, water c = 4186 J/(kg·°C),
 * L_f = 3,34·10⁵ J/kg, L_v = 2,26·10⁶ J/kg, 0 °C = 273 K.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { choiceOf, decTex } from './vettori';

export { choiceOf, decTex };
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';
export { textBlock } from './insiemi';

export const R_GAS = 8.31;
export const K_B = 1.38e-23;
export const C_WATER = 4186;
export const LF = 334000;
export const LV = 2260000;
export const ZERO_C = 273;

export const t = (s: string) => `\\text{${s}}`;

/** Units as the lessons write them; `none` for a pure number (a coefficient of performance, a count). */
export const UNIT: Record<string, string> = {
	none: '',
	J: '\\text{J}',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	JK: '\\text{J/K}',
	kg: '\\text{kg}',
	mol: '\\text{mol}',
	L: '\\text{L}',
	pct: '\\%',
};

/** A quantity in LaTeX: 255\,\text{K}; a pure number stays alone. */
export const q = (num: string, u: string) => (UNIT[u] ? `${num}\\,${UNIT[u]}` : num);
/** The same inside prose: $…$. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;

export type Num = { tex: string; value: string };

const tie = (y: number) => Math.abs(y - Math.floor(y) - 0.5) < 1e-6;

/**
 * x rounded to n significant figures, as LaTeX and as a value string. Plain from 0,001 to below 10^n (383 with three
 * figures, 5,9 with two), otherwise in scientific notation (1{,}7 \cdot 10^{5}). A negative x keeps its minus; with
 * `plus` a positive one gets a plus. Null for zero, near a rounding tie, and for a whole number ending with a zero.
 */
export function sig(x: number, n: number, plus = false): Num | null {
	if (!Number.isFinite(x) || x === 0) return null;
	const a = Math.abs(x);
	let e = Math.floor(Math.log10(a));
	if (10 ** e > a) e -= 1;
	if (10 ** (e + 1) <= a) e += 1;
	if (tie(a / 10 ** (e - n + 1))) return null;
	let m = Math.round(a / 10 ** (e - n + 1));
	if (m >= 10 ** n) {
		m /= 10;
		e += 1;
	}
	const sign = x < 0 ? '-' : plus ? '+' : '';
	const minus = x < 0 ? '-' : '';
	if (e < n && e >= -3) {
		const k = n - 1 - e;
		// A whole number that ends with a zero (20, 300) does not say how many of its figures count: refused.
		if (k === 0 && m % 10 === 0) return null;
		const s = (m / 10 ** k).toFixed(k);
		return { tex: sign + decTex(s), value: minus + s };
	}
	const mant = (m / 10 ** (n - 1)).toFixed(n - 1);
	return { tex: `${sign}${decTex(mant)} \\cdot 10^{${e}}`, value: `${minus}${mant}e${e}` };
}

/** x rounded to d decimals, with the same signs. Null near a tie and when it rounds to zero. */
export function fixed(x: number, d: number, plus = false): Num | null {
	if (!Number.isFinite(x)) return null;
	const y = Math.abs(x) * 10 ** d;
	if (tie(y)) return null;
	const m = Math.round(y);
	if (m === 0) return null;
	const s = (m / 10 ** d).toFixed(d);
	return { tex: (x < 0 ? '-' : plus ? '+' : '') + decTex(s), value: (x < 0 ? '-' : '') + s };
}

/** The option of a rounded quantity. */
export const opt = (r: Num, u: string): ChoiceOption => ({ latex: q(r.tex, u), values: [r.value] });

/** The answer and its mistakes, then the fallbacks, as four options; the values refused by the rounding are skipped. */
export function answerOf(rng: Rng, right: Num, mistakes: (Num | null)[], u: string, fallback: (Num | null)[] = []): ChoiceAnswer {
	const keep = (xs: (Num | null)[]) => xs.filter((r): r is Num => r !== null).map((r) => opt(r, u));
	return choiceOf(rng, opt(right, u), keep(mistakes), keep(fallback));
}

/** A decimal string with `d` decimals from an integer count of units (k = 35, d = 2 → "0.35"). */
export const dec = (k: number, d: number) => (k / 10 ** d).toFixed(d);
/** An integer in [lo, hi] that does not end with a zero. */
export function noZero(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
}
/** A label for a drawing: decimal comma and a true minus sign. */
export const lab = (s: string | number) => String(s).replace('.', ',').replace('-', '−');
/** An unrounded intermediate value for the steps: five figures, plain or in scientific notation as the lessons write it. */
export function raw(x: number): string {
	const a = Math.abs(x);
	if (a >= 1e-3 && a < 1e5) return decTex(Number(x.toPrecision(5)).toString());
	const e = Math.floor(Math.log10(a));
	return `${decTex(Number((x / 10 ** e).toPrecision(4)).toString())} \\cdot 10^{${e}}`;
}
