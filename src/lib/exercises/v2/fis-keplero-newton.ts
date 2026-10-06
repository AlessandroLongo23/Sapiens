/**
 * What the three generators of group 36 share (physics, third year: fis-sistemi-cosmologici, fis-leggi-keplero,
 * fis-gravitazione-universale): numbers that span many orders of magnitude, written as the lessons 92-94 write them.
 *
 * A result is rounded to n significant figures and written as a plain decimal when it is between 0,01 and 1000 and
 * the figures fit without ambiguous zeros (0{,}72, 11{,}9, 687), otherwise in scientific notation
 * (3{,}3 \cdot 10^{-7}); a value too close to a rounding boundary is refused, so that the independent checker, which
 * rounds exact values, always agrees. Data in scientific notation are a mantissa string and an exponent.
 */
import type { ChoiceOption, Rng } from './types';
import { decTex } from './vettori';

export const G_NEWTON = 6.67e-11;
export const M_TERRA = 5.97e24;
export const R_TERRA = 6.37e6;
export const ANNO_GIORNI = 365.25;

export type Unit = 'N' | 'kg' | 'm' | 'km' | 'UA' | 'anni' | 'd' | 'km/s' | 'm/s2' | '';
const UNIT_TEX: Record<Unit, string> = {
	N: '\\text{N}',
	kg: '\\text{kg}',
	m: '\\text{m}',
	km: '\\text{km}',
	UA: '\\text{UA}',
	anni: '\\text{anni}',
	d: '\\text{d}',
	'km/s': '\\text{km/s}',
	'm/s2': '\\text{m/s}^2',
	'': '',
};
const withUnit = (num: string, u: Unit) => (u ? `${num}\\,${UNIT_TEX[u]}` : num);

/** A number as the lessons write it, and as a string that Number() reads back. */
export interface Num {
	tex: string;
	value: string;
}

/** x in scientific notation with n significant figures: mantissa string and exponent; null near a rounding boundary. */
export function sciRound(x: number, n: number): { m: string; e: number } | null {
	if (!Number.isFinite(x) || x <= 0) return null;
	let e = Math.floor(Math.log10(x));
	let y = x / 10 ** e;
	if (y >= 10) {
		y /= 10;
		e += 1;
	}
	if (y < 1) {
		y *= 10;
		e -= 1;
	}
	const k = 10 ** (n - 1);
	const z = y * k;
	if (Math.abs(z - Math.floor(z) - 0.5) < 1e-6) return null;
	let r = Math.round(z);
	if (r >= 10 * k) {
		r /= 10;
		e += 1;
	}
	return { m: (r / k).toFixed(n - 1), e };
}

/** 10^{n} as the lessons write it. */
export const pow10 = (e: number) => `10^{${e}}`;
/** A mantissa and an exponent: 5{,}97 \cdot 10^{24}. */
export const sciTex = (m: string, e: number) => `${decTex(m)} \\cdot ${pow10(e)}`;

/** x rounded to n significant figures, plain between 0,01 and 1000 when the figures allow it, otherwise scientific. */
export function fmt(x: number, n: number): Num | null {
	const s = sciRound(x, n);
	if (!s) return null;
	const k = n - 1 - s.e;
	if (s.e >= -2 && s.e <= 2 && k >= 0) {
		const plain = Number(`${s.m}e${s.e}`).toFixed(k);
		// a whole number that ends with a zero (690) would be ambiguous: it goes in scientific notation
		if (!/^\d*0$/.test(plain)) return { tex: decTex(plain), value: plain };
	}
	return { tex: sciTex(s.m, s.e), value: `${s.m}e${s.e}` };
}

/** A datum given exactly as a decimal string, with its unit: 0{,}586\,\text{UA}. */
export const qu = (s: string, u: Unit) => withUnit(decTex(s), u);
/** The same in the prose of a problem. */
export const pu = (s: string, u: Unit) => `$${qu(s, u)}$`;
/** A datum in scientific notation with its unit, and the same in prose. */
export const quS = (m: string, e: number, u: Unit) => withUnit(sciTex(m, e), u);
export const puS = (m: string, e: number, u: Unit) => `$${quS(m, e, u)}$`;
/** A rounded result with its unit. */
export const res = (x: Num, u: Unit) => withUnit(x.tex, u);

/** An option from a value rounded to n figures, or null when the rounding is refused. `tail` is added in words. */
export function opt(x: number, n: number, u: Unit, tail = '', sign = 1): ChoiceOption | null {
	const r = fmt(x, n);
	if (!r) return null;
	return { latex: withUnit(r.tex, u) + (tail ? `\\ \\text{${tail}}` : ''), values: [sign < 0 ? `-${r.value}` : r.value] };
}
/** Options from mistakes that may give no number (negative, not finite, refused): those are skipped. */
export const opts = (xs: number[], n: number, u: Unit) => xs.map((x) => opt(x, n, u)).filter((o): o is ChoiceOption => o !== null);
/** Fallback options around a value, when the mistakes give fewer than three different ones. */
export const around = (x: number, n: number, u: Unit) => opts([x * 1.5, x * 0.6, x * 2.5, x * 0.4, x * 4], n, u);

/** A value cut for a step of the solution: four significant figures, plain or scientific (no boundary check). */
export function show(x: number, n = 4): string {
	const ax = Math.abs(x);
	if (ax === 0) return '0';
	const e = Math.floor(Math.log10(ax));
	if (e >= -2 && e <= 4) {
		const d = Math.max(0, n - 1 - e);
		return decTex(x.toFixed(d).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, ''));
	}
	const m = (x / 10 ** e).toFixed(n - 1).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
	return sciTex(m, e);
}

/** A mantissa with two figures and no zero at the end, 1,1 to 9,9, as a string. */
export function mant2(rng: Rng): string {
	for (;;) {
		const k = rng.int(11, 99);
		if (k % 10) return (k / 10).toFixed(1);
	}
}
/** A mantissa with three figures and no zero at the end, 1,01 to 9,99. */
export function mant3(rng: Rng): string {
	for (;;) {
		const k = rng.int(101, 999);
		if (k % 10) return (k / 100).toFixed(2);
	}
}
/** A whole number between lo and hi that does not end with a zero, as a string. */
export function whole(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return String(k);
	}
}
/** A label for a drawing: decimal comma, no LaTeX. */
export const lab = (s: string) => s.replace('.', ',');
