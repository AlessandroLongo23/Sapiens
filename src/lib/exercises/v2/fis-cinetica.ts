/**
 * What the four generators of the kinetic theory and of the internal energy share (physics, third year, group 40:
 * fis-teoria-cinetica, fis-temperatura-microscopica, fis-sistemi-termodinamici, fis-energia-interna).
 *
 * Their numbers go from 10^-27 kg to 10^24 molecules and many answers are square roots, so they are not the exact
 * rationals of fis-termologia.ts (whose numerators would overflow): a value is a float, rounded to its significant
 * figures as the lessons write it (decimal comma, thin space before the unit, scientific notation with \cdot from
 * 10^s up and under 0,001), and a value too close to a rounding boundary is refused, so that the independent checker,
 * which works with exact numbers, always rounds the same way. The data are written with a fixed number of decimals or
 * in scientific notation and are exact decimals: the checker reads them back from the text.
 *
 * The constants are the README's: R = 8,31 J/(mol·K), k_B = 1,38·10^-23 J/K, N_A = 6,02·10^23 mol^-1.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { shuffle } from './insiemi';

export { textBlock } from './insiemi';
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';

export const R_GAS = 8.31;
export const K_B = 1.38e-23;
export const N_A = 6.02e23;

export const t = (s: string) => `\\text{${s}}`;

/** The units, as the lessons write them after the thin space. '' is a pure number. */
export const UNIT = {
	'': '',
	J: '\\text{J}',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	ms: '\\text{m/s}',
	Pa: '\\text{Pa}',
	kPa: '\\text{kPa}',
	kg: '\\text{kg}',
	g: '\\text{g}',
	gmol: '\\text{g/mol}',
	mol: '\\text{mol}',
	L: '\\text{L}',
	cm: '\\text{cm}',
	kgm3: '\\text{kg/m}^3',
} as const;
export type Unit = keyof typeof UNIT;

/** A value rounded to s significant figures: ±d·10^(e−s+1), with d an integer of s digits and e the exponent of its first digit. */
export type Sig = { neg: boolean; d: number; e: number; s: number };

/** x rounded to s significant figures, or null when x is zero or lies too close to a rounding boundary. */
export function round(x: number, s: number): Sig | null {
	if (!Number.isFinite(x) || x === 0) return null;
	const a = Math.abs(x);
	let e = Math.floor(Math.log10(a));
	let scaled = a / 10 ** (e - s + 1);
	// log10 can be off by one at a power of ten
	if (scaled >= 10 ** s) { e++; scaled /= 10; }
	if (scaled < 10 ** (s - 1)) { e--; scaled *= 10; }
	const frac = scaled - Math.floor(scaled);
	if (Math.abs(frac - 0.5) < 1e-6) return null;
	let d = Math.round(scaled);
	if (d === 10 ** s) { d /= 10; e++; }
	return { neg: x < 0, d, e, s };
}

export const valueOf = (v: Sig) => (v.neg ? -1 : 1) * v.d * 10 ** (v.e - v.s + 1);

const thin = (int: string) => (int.length >= 5 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : int);

/**
 * A rounded value as the lessons write it: 511, 5{,}11, 0{,}0511, and in scientific notation when the integer part
 * would need more digits than s or the value is under 0,001: 6{,}07 \cdot 10^{-21}.
 */
export function tex(v: Sig): string {
	const digits = String(v.d);
	const sign = v.neg ? '-' : '';
	if (v.e >= v.s || v.e < -3) {
		const m = v.s > 1 ? `${digits[0]}{,}${digits.slice(1)}` : digits;
		return `${sign}${m} \\cdot 10^{${v.e}}`;
	}
	if (v.e >= 0) {
		const int = digits.slice(0, v.e + 1), frac = digits.slice(v.e + 1);
		return sign + thin(int) + (frac ? `{,}${frac}` : '');
	}
	return `${sign}0{,}${'0'.repeat(-v.e - 1)}${digits}`;
}

/** The same value as a plain string for the option's `values`: "511", "-374", "6.07e-21". */
export function plain(v: Sig): string {
	const digits = String(v.d);
	const m = v.s > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
	return `${v.neg ? '-' : ''}${m}e${v.e}`;
}

/** A number and its unit, with the thin space; a pure number alone. */
export const wu = (num: string, u: Unit) => (u ? `${num}\\,${UNIT[u]}` : num);
/** The same between dollars, for prose. */
export const pu = (num: string, u: Unit) => `$${wu(num, u)}$`;

/** A datum with exactly d decimals: 2{,}00, 293, -15. */
export function fx(x: number, d = 0): string {
	const s = Math.abs(x).toFixed(d);
	const [int, frac] = s.split('.');
	return (x < 0 ? '-' : '') + thin(int) + (frac ? `{,}${frac}` : '');
}

/** A datum in scientific notation with s significant figures: 5{,}00 \cdot 10^{22}. The value must have no more. */
export function sci(x: number, s: number): string {
	const v = round(x, s);
	if (!v) throw new Error(`sci: ${x}`);
	const digits = String(v.d);
	return `${v.neg ? '-' : ''}${s > 1 ? `${digits[0]}{,}${digits.slice(1)}` : digits} \\cdot 10^{${v.e}}`;
}

/** x rounded to s figures, as a float: what a datum built from other data is once it is written in the text. */
export function rounded(x: number, s: number): number {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	return Number(plain(v));
}

/** "= exact… ≈ rounded unit" for the last step: the unrounded value cut after s + 1 figures, then the answer. */
export function approx(x: number, u: Unit, s: number): string {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	const more = round(x, s + 2);
	const exact = Math.abs(valueOf(v) - x) <= Math.abs(x) * 1e-12;
	if (exact) return `= ${wu(tex(v), u)}`;
	if (!more) return `\\approx ${wu(tex(v), u)}`;
	// one more figure, cut and not rounded, with the dots: 510{,}7\ldots
	const cut = cutTex(x, s + 1);
	const dotted = cut.includes(' \\cdot') ? cut.replace(' \\cdot', '\\ldots \\cdot') : `${cut}\\ldots`;
	return `= ${dotted}${u ? `\\,${UNIT[u]}` : ''} \\approx ${wu(tex(v), u)}`;
}

/** x cut (not rounded) after s significant figures, written like tex(): the body of "510,7…". */
function cutTex(x: number, s: number): string {
	const a = Math.abs(x);
	let e = Math.floor(Math.log10(a));
	let d = Math.floor(a / 10 ** (e - s + 1) + 1e-9);
	if (d >= 10 ** s) { e++; d = Math.floor(d / 10); }
	return tex({ neg: x < 0, d, e, s });
}

/** True for a value written as a whole number that ends with a zero (320: two or three significant figures?). */
export const ambiguous = (v: Sig) => v.e === v.s - 1 && v.d % 10 === 0;

export const option = (v: Sig, u: Unit): ChoiceOption => ({ latex: wu(tex(v), u), values: [plain(v)] });

/**
 * The four options: the answer, then the mistakes (rounded like the answer), then values near it. Values that
 * coincide are kept once; non-positive ones are dropped unless `signed`. Throws when the answer cannot be rounded or
 * fewer than four are left (the level draws again).
 */
export function options(rng: Rng, answer: number, mistakes: (number | null)[], u: Unit, s: number, signed = false): ChoiceAnswer {
	const a = round(answer, s);
	if (!a) throw new Error('answer on a rounding boundary');
	if (ambiguous(a)) throw new Error('answer with an ambiguous final zero');
	const seen = new Set([plain(a)]);
	const opts: ChoiceOption[] = [option(a, u)];
	const step = 10 ** (a.e - s + 1);
	const base = valueOf(a);
	const nearby = [3, 7, 2, 5, 11, 4, 9, 6].flatMap((k) => [base + k * step * (s >= 3 ? 4 : 1), base - k * step * (s >= 3 ? 4 : 1)]);
	for (const m of [...mistakes, ...nearby]) {
		if (opts.length >= 4) break;
		if (m === null || !Number.isFinite(m) || m === 0) continue;
		if (!signed && m <= 0) continue;
		const v = round(m, s);
		if (!v) continue;
		const key = plain(v);
		if (seen.has(key)) continue;
		seen.add(key);
		opts.push(option(v, u));
	}
	if (opts.length < 4) throw new Error('not enough options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Four options that are sentences or labels: the right one first in `labels`, then three wrong ones, all different. */
export function labelOptions(rng: Rng, labels: string[]): ChoiceAnswer {
	if (labels.length !== 4 || new Set(labels).size !== 4) throw new Error('four different labels needed');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => ({ latex: label(labels[i]), values: [labels[i]] })), correct: order.indexOf(0) };
}

/** A label as an option: one line of text, or two when it is long (an option is 252 px wide on a phone). */
export function label(s: string): string {
	if (s.length <= 26) return t(s);
	const words = s.split(' ');
	let best = 1;
	for (let i = 1; i < words.length; i++) if (Math.abs(words.slice(0, i).join(' ').length - s.length / 2) < Math.abs(words.slice(0, best).join(' ').length - s.length / 2)) best = i;
	return `\\begin{gathered} ${t(words.slice(0, best).join(' '))} \\\\ ${t(words.slice(best).join(' '))} \\end{gathered}`;
}

/** An integer between lo and hi that does not end with a zero (no ambiguous significant figures). */
export function noZero(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const n = rng.int(lo, hi);
		if (n % 10) return n;
	}
}

/**
 * Gases with their molar mass in g/mol (three significant figures, written with `d` decimals), the article that goes
 * before the name after "di" ("dell'elio"), and what their particles are. `mono` marks the monatomic ones, the only
 * ones the lessons' formula U = (3/2) n R T is for.
 */
export const GASES = [
	{ name: 'idrogeno', del: "dell'idrogeno", M: 2.02, d: 2, mono: false },
	{ name: 'elio', del: "dell'elio", M: 4.0, d: 2, mono: true },
	{ name: 'metano', del: 'del metano', M: 16.0, d: 1, mono: false },
	{ name: 'ammoniaca', del: "dell'ammoniaca", M: 17.0, d: 1, mono: false },
	{ name: 'neon', del: 'del neon', M: 20.2, d: 1, mono: true },
	{ name: 'azoto', del: "dell'azoto", M: 28.0, d: 1, mono: false },
	{ name: 'ossigeno', del: "dell'ossigeno", M: 32.0, d: 1, mono: false },
	{ name: 'fluoro', del: 'del fluoro', M: 38.0, d: 1, mono: false },
	{ name: 'argon', del: "dell'argon", M: 39.9, d: 1, mono: true },
	{ name: 'anidride carbonica', del: "dell'anidride carbonica", M: 44.0, d: 1, mono: false },
	{ name: 'ozono', del: "dell'ozono", M: 48.0, d: 1, mono: false },
	{ name: 'butano', del: 'del butano', M: 58.1, d: 1, mono: false },
	{ name: 'cloro', del: 'del cloro', M: 70.9, d: 1, mono: false },
	{ name: 'kripton', del: 'del kripton', M: 83.8, d: 1, mono: true },
	{ name: 'xeno', del: 'dello xeno', M: 131, d: 0, mono: true },
] as const;
export type GasData = (typeof GASES)[number];
export const MONO = GASES.filter((g) => g.mono);
/** "atomi" for a monatomic gas, "molecole" for the others. */
export const particles = (g: GasData) => (g.mono ? 'atomi' : 'molecole');
