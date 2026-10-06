/**
 * What the three generators of the first law share (physics, third year, group 41: fis-lavoro-termodinamico,
 * principi-termo, fis-trasformazioni-termodinamiche): the units of lessons 109-111 (joule, pascal and kilopascal,
 * litres and cubic metres, kelvin, moles), numbers written as the lessons write them (decimal comma, thin space
 * before the unit, scientific notation with \cdot), signed answers (a work done on the gas is negative), results
 * that come from a logarithm, and the scene of the pressure-volume plane (`piano-pv`). Exact values are rationals;
 * rounding, ties and the writing of a value come from fis-termologia.ts, whose Built, checkCommon and generateWith
 * are reused. R = 8,31 J/(mol·K) and 1 atm = 1,01·10⁵ Pa, as the README of the physics lessons fixes them.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { shuffle } from './insiemi';
import { q } from './rational';
import { type R, decimals, exponent, fixed } from './fisica-forze';
import { type Fmt, fmt, fmtExact, plainDec, roundTo } from './fis-termologia';

export { type R } from './fisica-forze';
export { q } from './rational';
export { type Built, type Fmt, INT, SIG2, checkCommon, fmt, fmtExact, generateWith, roundTo, tie } from './fis-termologia';
export { textBlock } from './insiemi';

export const t = (s: string) => `\\text{${s}}`;

export const UNIT = {
	J: '\\text{J}',
	Pa: '\\text{Pa}',
	kPa: '\\text{kPa}',
	atm: '\\text{atm}',
	L: '\\text{L}',
	m3: '\\text{m}^3',
	K: '\\text{K}',
	mol: '\\text{mol}',
} as const;
export type Unit = keyof typeof UNIT;

/** The gas constant, 8,31 J/(mol·K), and one atmosphere in pascal. */
export const R_GAS = q(831, 100);
export const ATM = q(101000);

const p10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** A number and its unit, with the thin space; the same between dollars, for prose. */
export const wu = (num: string, u: Unit) => `${num}\\,${UNIT[u]}`;
export const pu = (num: string, u: Unit) => `$${wu(num, u)}$`;
/** An exact terminating decimal with its unit, between dollars. */
export const pd = (r: R, u: Unit) => pu(fmtExact(r), u);

/** A datum with two significant figures in scientific notation: 1{,}5 \cdot 10^{5} for m = 3/2, e = 5. */
export const sci = (m: R, e: number) => `${fixed(m, 1)} \\cdot 10^{${e}}`;
/** A value with one decimal, zero kept: 2{,}0. */
export const one = (r: R) => fixed(r, 1);

/** n/10 for n in lo..hi: two significant figures written with their zero (2,0). */
export const tenths = (rng: Rng, lo: number, hi: number) => q(rng.int(lo, hi), 10);
/** An integer in lo..hi that does not end with a zero. */
export function noZero(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
}

/** A result from a logarithm as a rational, to the thousandth: enough to round it to two or three figures. */
export const fromFloat = (x: number) => q(Math.round(x * 1000), 1000);
/** True when a float is too close to a rounding boundary at s significant figures to be rounded safely. */
export function nearTie(x: number, s: number): boolean {
	const a = Math.abs(x);
	if (a === 0) return true;
	const y = a / 10 ** (Math.floor(Math.log10(a)) - s + 1);
	return Math.abs(y - Math.floor(y) - 0.5) < 0.02;
}

/**
 * True when a rounded answer would be written with an ambiguous zero: a whole number under 1000 that ends with a
 * zero and is not in scientific notation (60 J; 300 J when the format is an integer).
 */
export function ambiguous(r: R, f: Fmt): boolean {
	const v = roundTo(r, f).abs();
	if (v.sign() === 0) return true;
	if (f.kind === 'sig' && exponent(v) >= f.s) return false;
	return v.isInteger() && v.num % 10 === 0;
}

export const option = (r: R, u: Unit, f: Fmt): ChoiceOption => {
	const v = roundTo(r, f);
	return { latex: wu(fmt(v, f), u), values: [plainDec(v)] };
};

/**
 * The four options: the answer, then the mistakes rounded like it, then values near it. Negative values are options
 * like the others (the sign of a work or of a heat is part of the answer); zero and repeated values are dropped.
 */
export function options(rng: Rng, answer: R, mistakes: (R | null)[], u: Unit, f: Fmt): ChoiceAnswer {
	const a = roundTo(answer, f);
	const seen = new Set([plainDec(a)]);
	const opts: ChoiceOption[] = [option(a, u, f)];
	const step = f.kind === 'sig' ? p10(exponent(a.abs()) - f.s + 1) : f.kind === 'int' ? q(Math.max(1, Math.round(Math.abs(a.num / a.den) / 20))) : p10(-f.d);
	const nearby = [2, 1, 3, 5, 4, 6, 7, 8].flatMap((k) => [a.add(step.mul(q(k))), a.sub(step.mul(q(k)))]);
	for (const m of [...mistakes, ...nearby]) {
		if (opts.length >= 4) break;
		if (!m || m.sign() === 0) continue;
		const v = roundTo(m, f);
		if (v.sign() === 0) continue;
		const key = plainDec(v);
		if (seen.has(key)) continue;
		seen.add(key);
		opts.push(option(v, u, f));
	}
	if (opts.length < 4) throw new Error('not enough options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** A value as the steps show it: exact when it has at most one decimal, otherwise cut after the first with dots. */
export const shown = (r: R) => (Number.isFinite(decimals(r)) && decimals(r) <= 1 ? fmtExact(r) : cut1(r.num / r.den));

/** The last step of a computation: `= 303\\,\\text{J} \\approx 3{,}0 \\cdot 10^{2}\\,\\text{J}`, or `=` alone when exact. */
export function approx(exact: R, f: Fmt, u: Unit): string {
	const r = roundTo(exact, f);
	if (r.equals(exact)) return `= ${wu(fmt(r, f), u)}`;
	return `= ${wu(shown(exact), u)} \\approx ${wu(fmt(r, f), u)}`;
}

/** `=` when the rounded value is the exact one, `\approx` otherwise. */
export const rel = (exact: R, f: Fmt) => (roundTo(exact, f).equals(exact) ? '=' : '\\approx');

/** A float cut after one decimal with the dots of a number that goes on: 1728{,}0\ldots */
export function cut1(x: number): string {
	const r = Math.trunc(Math.abs(x) * 10) / 10;
	return `${x < 0 ? '-' : ''}${r.toFixed(1).replace('.', '{,}')}\\ldots`;
}

/** A value in parentheses when negative, for a product or a difference: (-350). */
export const par = (s: string) => (s.startsWith('-') ? `(${s})` : s);

// ---------------------------------------------------------------------------
// The scene of the pressure-volume plane (src/components/content/exercises/scenes/PianoPV.tsx)

export type StatoPV = { nome: string; V: number; p: number };
export type TrattoPV = { da: string; a: string; tipo: 'retta' | 'isoterma' | 'adiabatica'; gamma?: number };
export type AssePV = { unita: string; passo: number; celle: number; etichette: number };

export function scenaPV(V: AssePV, p: AssePV, stati: StatoPV[], tratti: TrattoPV[], alt: string, area?: 'sotto' | 'ciclo'): SceneRef {
	return { type: 'piano-pv', data: { V, p, stati, tratti, ...(area ? { area } : {}) }, alt };
}

/** "A (2 L, 300 kPa)" for the alt text of a scene. */
export const statoAlt = (s: StatoPV, vu: string, pu_: string) => `${s.nome} a ${String(s.V).replace('.', ',')} ${vu} e ${String(s.p).replace('.', ',')} ${pu_}`;
