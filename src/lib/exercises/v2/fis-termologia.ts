/**
 * What the three generators of temperature and heat share (physics, second year, group 19: fis-temperatura,
 * fis-dilatazione-termica, calore): numbers written as the physics lessons write them (decimal comma, thin space
 * before the unit, degrees Celsius as `21\,^\circ\text{C}`, significant figures, scientific notation with \cdot), exact
 * values as rationals (the forces' module, fisica-forze.ts), signed values for temperatures below zero, and the
 * multiple choice with the unit in the option. The answer is a ChoiceAnswer whose option values are decimal strings,
 * as fisica-equilibrio.ts expects (its Built, checkCommon and generateWith are reused).
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { shuffle } from './insiemi';
import { q } from './rational';
import { type R, decimals, dec, exponent, fixed, isTie, roundSig, sig } from './fisica-forze';

export { type R } from './fisica-forze';
export { q } from './rational';
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';

export const t = (s: string) => `\\text{${s}}`;

/** The units, as the lessons write them after the thin space. */
export const UNIT = {
	C: '^\\circ\\text{C}',
	F: '^\\circ\\text{F}',
	K: '\\text{K}',
	J: '\\text{J}',
	kJ: '\\text{kJ}',
	cal: '\\text{cal}',
	kcal: '\\text{kcal}',
	m: '\\text{m}',
	cm: '\\text{cm}',
	mm: '\\text{mm}',
	kg: '\\text{kg}',
	g: '\\text{g}',
	L: '\\text{L}',
	mL: '\\text{mL}',
	cm3: '\\text{cm}^3',
	perC: '^\\circ\\text{C}^{-1}',
	c: '\\text{J/(kg}\\cdot{}^\\circ\\text{C)}',
	JC: '\\text{J}/^\\circ\\text{C}',
} as const;
export type Unit = keyof typeof UNIT;

/** How a value is written: rounded to s significant figures, an integer, or with exactly d decimals. */
export type Fmt = { kind: 'sig'; s: number } | { kind: 'int' } | { kind: 'fixed'; d: number };
export const SIG2: Fmt = { kind: 'sig', s: 2 };
export const INT: Fmt = { kind: 'int' };

const p10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** Half up on the absolute value (the lessons' rule), keeping the sign. */
export function roundTo(r: R, f: Fmt): R {
	if (r.sign() === 0) return r;
	const s = r.sign();
	const a = r.abs();
	let out: R;
	if (f.kind === 'sig') out = roundSig(a, f.s);
	else {
		const d = f.kind === 'int' ? 0 : f.d;
		const x = a.mul(p10(d));
		out = q(Math.floor((2 * x.num + x.den) / (2 * x.den))).div(p10(d));
	}
	return s < 0 ? out.neg() : out;
}

/** True when rounding r in format f would be a tie (half way): such values are not used. */
export function tie(r: R, f: Fmt): boolean {
	if (r.sign() === 0) return false;
	const a = r.abs();
	if (f.kind === 'sig') return isTie(a, f.s);
	const d = f.kind === 'int' ? 0 : f.d;
	const x = a.mul(p10(d));
	return x.sub(q(Math.floor(x.num / x.den))).equals(q(1, 2));
}

/** A rounded value written in format f, with the minus sign when negative: -196, 8{,}6, 6{,}7 \cdot 10^{5}. */
export function fmt(r: R, f: Fmt): string {
	const v = roundTo(r, f);
	if (v.sign() === 0) return f.kind === 'fixed' && f.d > 0 ? fixed(q(0), f.d) : '0';
	const body = f.kind === 'sig' ? sig(v.abs(), f.s) : f.kind === 'int' ? dec(v.abs()) : fixed(v.abs(), f.d);
	return (v.sign() < 0 ? '-' : '') + body;
}

/** An exact value as a plain decimal string, for the option's `values` ("-23", "0.000023", "670000"). */
export function plainDec(r: R): string {
	if (!Number.isFinite(decimals(r))) throw new Error(`plainDec: ${r} does not terminate`);
	const s = dec(r.abs()).replace(/\\,/g, '').replace('{,}', '.');
	return (r.sign() < 0 ? '-' : '') + s;
}

/** A number and its unit, with the thin space. */
export const wu = (num: string, u: Unit) => `${num}\\,${UNIT[u]}`;
/** The same between dollars, for prose. */
export const pu = (num: string, u: Unit) => `$${wu(num, u)}$`;
/** An exact datum (a terminating decimal, maybe negative) with its unit, between dollars. */
export const pd = (r: R, u: Unit) => pu(fmtExact(r), u);
/** An exact terminating decimal as it is: -15, 2{,}0 is not produced (use fixed for kept zeros). */
export function fmtExact(r: R): string {
	return (r.sign() < 0 ? '-' : '') + dec(r.abs());
}

export const option = (r: R, u: Unit, f: Fmt): ChoiceOption => {
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
		if (f.kind === 'sig' && m.sign() === 0) continue;
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

/** A value with two significant figures and no ambiguous trailing zero: 1,1 to 9,9 times 10^k (k = 0: 1,1..9,9). */
export function two(rng: Rng, k = 0): R {
	for (;;) {
		const n = rng.int(11, 99);
		if (n % 10) return q(n, 10).mul(p10(k));
	}
}

/** A value with two significant figures written with its zero if needed (2{,}0): n/10 for n in 10..99. */
export const tenths = (rng: Rng, lo = 10, hi = 99) => q(rng.int(lo, hi), 10);

/** "The exact result = … ≈ rounded", as the steps write it: `= 8{,}64 \cdot 10^{-3}` is avoided, decimals up to 6. */
export function approx(exact: R, f: Fmt, u: Unit): string {
	const r = roundTo(exact, f);
	const exactTex = Number.isFinite(decimals(exact)) && decimals(exact) <= 6 && exact.abs().compare(q(10000000)) < 0 ? fmtExact(exact) : null;
	if (r.equals(exact)) return `= ${wu(fmt(r, f), u)}`;
	return exactTex ? `= ${wu(exactTex, u)} \\approx ${wu(fmt(r, f), u)}` : `\\approx ${wu(fmt(r, f), u)}`;
}

/** An approximate float for the steps, cut after three decimals: 19{,}111\ldots */
export function cut3(x: R): string {
	const v = x.num / x.den;
	const r = Math.trunc(Math.abs(v) * 1000) / 1000;
	return (v < 0 ? '-' : '') + String(r).replace('.', '{,}');
}
