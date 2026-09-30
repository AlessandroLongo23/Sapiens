/**
 * What the three generators of work, power and kinetic energy share (physics, second year, group 17: lavoro,
 * fis-potenza, fis-energia-cinetica). Results have two significant figures and are written as the lessons write
 * them: a plain decimal between 0,01 and 99 ("35", "3,5", "0,35", "0,035"), scientific notation otherwise
 * ("3,5 · 10^2", "5,4 · 10^6", "2,5 · 10^{-3}"), with the unit after a thin space. Rounding is half up and refused
 * too close to a boundary, so the checker (scripts/exercises/checkers/_fis_lavoro.py) can agree digit by digit.
 */
import type { ChoiceOption, Rng } from './types';
import { decTex } from './vettori';

/** 10^n in LaTeX: 10^2, 10^{12}, 10^{-3}. */
export const pow10 = (n: number) => (n >= 0 && n < 10 ? `10^${n}` : `10^{${n}}`);

/** The integer n times 10^k as a plain decimal string ("35", "350", "0.035"). */
function scaled(n: number, k: number): string {
	if (k >= 0) return String(n) + '0'.repeat(k);
	const s = String(n).padStart(-k + 1, '0');
	return `${s.slice(0, s.length + k)}.${s.slice(s.length + k)}`;
}

export interface Sig {
	/** The rounded value as a plain decimal string, the option's identity ("-350", "0.035"). */
	value: string;
	/** As the lessons write it, without unit ("-3{,}5 \cdot 10^2", "0{,}035"). */
	latex: string;
}

/** x rounded to two significant figures; null when x is zero, not finite, or too close to a rounding boundary. */
export function sig2(x: number): Sig | null {
	if (!Number.isFinite(x) || x === 0) return null;
	const sign = x < 0 ? '-' : '';
	const ax = Math.abs(x);
	let e = Math.floor(Math.log10(ax));
	if (10 ** e > ax) e--;
	if (10 ** (e + 1) <= ax) e++;
	const y = ax / 10 ** (e - 1); // 10 <= y < 100
	if (Math.abs(y - Math.floor(y) - 0.5) < 1e-6) return null;
	let n = Math.round(y);
	if (n === 100) {
		n = 10;
		e += 1;
	}
	const value = sign + scaled(n, e - 1);
	const r = n * 10 ** (e - 1);
	const latex = r >= 0.01 && r < 100 ? sign + decTex(scaled(n, e - 1)) : `${sign}${Math.floor(n / 10)}{,}${n % 10} \\cdot ${pow10(e)}`;
	return { value, latex };
}

/** An option with its unit, or null (a rounding refused). Zero is written "0". */
export function qOpt2(x: number, unit: string): ChoiceOption | null {
	if (x === 0) return { latex: `0\\,\\text{${unit}}`, values: ['0'] };
	const s = sig2(x);
	return s ? { latex: `${s.latex}\\,\\text{${unit}}`, values: [s.value] } : null;
}

/** The latex of a rounded quantity, for solutions and steps ("3{,}5 \cdot 10^2\,\text{J}"). */
export function q2(x: number, unit: string): string {
	const s = sig2(x);
	if (!s) throw new Error(`q2: ${x} cannot be rounded`);
	return `${s.latex}\\,\\text{${unit}}`;
}

/** A value for a step, with a few decimals and the dots ("346{,}41\ldots"); exact values stay as they are. */
export function step(x: number, digits = 2): string {
	const r = Math.round(x * 10 ** digits) / 10 ** digits;
	const exact = Math.abs(x - r) < 1e-9;
	const s = Math.abs(x) >= 1e4 ? String(Math.round(x)) : r.toFixed(digits).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
	// Thousands of a large integer part separated by a thin space, as the lessons write 12\,000.
	const [int, dec] = s.split('.');
	const grouped = Math.abs(x) >= 1e4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : int;
	return decTex(dec ? `${grouped}.${dec}` : grouped) + (exact ? '' : '\\ldots');
}

/**
 * The end of a step: the value with a few decimals and its rounding ("346{,}41\ldots \approx 3{,}5 \cdot 10^2\,\text{J}"),
 * or just the rounded value when it is exact ("0{,}68\,\text{kWh}").
 */
export function approx(x: number, unit: string): string {
	const r = sig2(x);
	if (r && Math.abs(Number(r.value) - x) <= 1e-9 * Math.abs(x)) return q2(x, unit);
	return `${step(x, Math.max(2, 2 - Math.floor(Math.log10(Math.abs(x)))))} \\approx ${q2(x, unit)}`;
}

/** Only non-null options. */
export const some = (xs: (ChoiceOption | null)[]) => xs.filter((o): o is ChoiceOption => o !== null);

/** Fallback options around the answer: 1,2 and 0,8 times, then 1,5 and 0,5 times. */
export const around = (x: number, unit: string) => some([qOpt2(x * 1.2, unit), qOpt2(x * 0.8, unit), qOpt2(x * 1.5, unit), qOpt2(x * 0.5, unit)]);

/** A datum with two significant figures and no ambiguous zero: 1,1 to 9,9 (`small`) or 11 to 99, as a string. */
export function two(rng: Rng, small: boolean): string {
	for (;;) {
		const k = rng.int(11, 99);
		if (k % 10) return small ? (k / 10).toFixed(1) : String(k);
	}
}

/** A datum with three significant figures and no ambiguous zero: 101 to 999, not a multiple of ten. */
export function three(rng: Rng): string {
	for (;;) {
		const k = rng.int(101, 999);
		if (k % 10) return String(k);
	}
}

/** A quantity in prose: $4{,}5\,\text{m}$. */
export const pq = (s: string, unit: string) => `$${decTex(s)}\\,\\text{${unit}}$`;
/** A quantity in a formula: 4{,}5\,\text{m}. */
export const qty = (s: string, unit: string) => `${decTex(s)}\\,\\text{${unit}}`;

export { decTex };
