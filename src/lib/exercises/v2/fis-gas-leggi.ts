/**
 * What the three generators of the gas laws share (physics, third year, group 39: fis-legge-boyle,
 * fis-leggi-gay-lussac, fis-gas-perfetto): the units of those lessons (pascal, kilopascal, cubic metres, litres,
 * kelvin, moles), the multiple choice with the unit in the option, numbers too large for an exact rational written
 * as a mantissa and a power of ten (a number of molecules), and the scene of the cylinder with its piston. Numbers
 * are written and rounded by fis-termologia.ts and fisica-forze.ts, used as they are.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { shuffle } from './insiemi';
import { type Fmt, type R, fmt, plainDec, q, roundTo } from './fis-termologia';
import { exponent, fixed, roundSig } from './fisica-forze';

export { type Fmt, type R, type Built, checkCommon, generateWith, fmt, fmtExact, plainDec, q, roundTo, tie } from './fis-termologia';

export const UNIT = {
	Pa: '\\text{Pa}',
	kPa: '\\text{kPa}',
	m3: '\\text{m}^3',
	L: '\\text{L}',
	cm3: '\\text{cm}^3',
	cm2: '\\text{cm}^2',
	cm: '\\text{cm}',
	m: '\\text{m}',
	kg: '\\text{kg}',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	mol: '\\text{mol}',
	J: '\\text{J}',
} as const;
export type Unit = keyof typeof UNIT;

export const SIG2: Fmt = { kind: 'sig', s: 2 };
export const SIG3: Fmt = { kind: 'sig', s: 3 };
export const INT: Fmt = { kind: 'int' };

/** The constants of the lessons, exact as they are written there. */
export const P_ATM = q(101000); // Pa
export const G = q(98, 10); // m/s²
export const R_GAS = q(831, 100); // J/(mol·K)
export const ZERO_C = q(273); // K

const p10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** A number and its unit, with the thin space. */
export const wu = (num: string, u: Unit) => `${num}\\,${UNIT[u]}`;
/** The same between dollars, for prose. */
export const pu = (num: string, u: Unit) => `$${wu(num, u)}$`;
/** A value written in format f with its unit, between dollars. */
export const pv = (r: R, u: Unit, f: Fmt) => pu(fmt(r, f), u);

/** True when the value, written in format f, is a whole number ending in zero (120, 2300): its figures are ambiguous. */
export const ambiguous = (r: R, f: Fmt) => /^-?[\d\\,]*0$/.test(fmt(r, f)) && roundTo(r, f).sign() !== 0;

const option = (r: R, u: Unit, f: Fmt): ChoiceOption => {
	const v = roundTo(r, f);
	return { latex: wu(fmt(v, f), u), values: [plainDec(v)] };
};

/**
 * The four options: the answer, then the mistakes (rounded like the answer), then values near it. Values that
 * coincide are kept once; non-positive ones are dropped unless `signed`. Throws when fewer than four are left (the
 * level resamples).
 */
export function options(rng: Rng, answer: R, mistakes: (R | null)[], u: Unit, f: Fmt, signed = false, near?: R): ChoiceAnswer {
	const a = roundTo(answer, f);
	const seen = new Set([plainDec(a)]);
	const opts: ChoiceOption[] = [option(a, u, f)];
	const step = near ?? (f.kind === 'sig' ? p10(exponent(a.abs()) - f.s + 1) : f.kind === 'int' ? q(1) : p10(-f.d));
	const nearby = [2, 1, 3, 5, 4, 6, 7, 8].flatMap((k) => [a.add(step.mul(q(k))), a.sub(step.mul(q(k)))]);
	for (const m of [...mistakes, ...nearby]) {
		if (opts.length >= 4) break;
		if (!m) continue;
		if (!signed && m.sign() <= 0) continue;
		if (m.sign() === 0) continue;
		const v = roundTo(m, f);
		if (!signed && v.sign() <= 0) continue;
		const key = plainDec(v);
		if (seen.has(key)) continue;
		seen.add(key);
		opts.push(option(v, u, f));
	}
	if (opts.length < 4) throw new Error('not enough options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Numbers beyond the exact rationals: a mantissa and a power of ten

/** m · 10^e, with m a positive rational of any size (it is normalised when written). */
export type Sci = { m: R; e: number };

/** The value rounded to s significant figures, as a mantissa in [1, 10) with s − 1 decimals and its exponent. */
export function sciRound(x: Sci, s: number): Sci {
	const r = roundSig(x.m, s);
	const k = exponent(r);
	return { m: r.div(p10(k)), e: x.e + k };
}
/** True when rounding the mantissa to s figures would be a tie. */
export function sciTie(x: Sci, s: number): boolean {
	const y = x.m.mul(p10(s - 1 - exponent(x.m)));
	return y.sub(q(Math.floor(y.num / y.den))).equals(q(1, 2));
}
/** `2{,}5 \cdot 10^{19}`: always in scientific notation, s figures. */
export function sciTex(x: Sci, s: number): string {
	const r = sciRound(x, s);
	return `${fixed(r.m, s - 1)} \\cdot 10^{${r.e}}`;
}
/** The option's value, as a decimal string a checker can read: "2.5e19". */
export function sciValue(x: Sci, s: number): string {
	const r = sciRound(x, s);
	return `${plainDec(r.m)}e${r.e}`;
}

/** Four options that are pure numbers in scientific notation: the answer and the first distinct mistakes. */
export function sciOptions(rng: Rng, answer: Sci, mistakes: Sci[], s: number): ChoiceAnswer {
	const seen = new Set<string>();
	const opts: ChoiceOption[] = [];
	for (const x of [answer, ...mistakes]) {
		if (opts.length >= 4) break;
		const key = sciValue(x, s);
		if (seen.has(key)) continue;
		seen.add(key);
		opts.push({ latex: sciTex(x, s), values: [key] });
	}
	if (opts.length < 4) throw new Error('not enough options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// The scene

/**
 * The cylinder with its piston (src/components/content/exercises/scenes/CilindroPistone.tsx). `altezza` and `scala`
 * are in the same unit (the piston's height and the height the drawing can hold); the labels are plain text.
 */
export function cylinder(data: { altezza: number; scala: number; etichette?: { h?: string; corpo?: string; S?: string; gas?: string }; corpo?: boolean; prima?: number; caldo?: boolean }, alt: string): SceneRef {
	return { type: 'cilindro-pistone', data, alt };
}
