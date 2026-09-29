/**
 * Shared pieces of the physics generators of the first chapter, quantities and units (group 1:
 * fis-metodo-sperimentale, fis-grandezze-si, fis-grandezze-derivate, fis-strumenti-misura).
 *
 * Numbers as the physics lessons write them (docs/lezioni/fisica/README.md): decimal comma {,}, thousands with \,
 * from five digits in the integer part, scientific notation a \cdot 10^{n}, units upright after a thin space
 * (4{,}2\,\mu\text{m}, 2700\,\text{kg/m}^3). Every answer with a unit is a multiple choice.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { Rational, q } from './rational';
import { shuffle } from './insiemi';

export type R = Rational;

/** Number of decimal digits of r, or Infinity if its decimal expansion does not end. */
export function decimals(r: R): number {
	let d = r.den;
	let k2 = 0;
	let k5 = 0;
	while (d % 2 === 0) {
		d /= 2;
		k2++;
	}
	while (d % 5 === 0) {
		d /= 5;
		k5++;
	}
	return d === 1 ? Math.max(k2, k5) : Infinity;
}

/** 10^n as a rational, n from -15 to 15. */
export function pow10(n: number): R {
	return n >= 0 ? q(10 ** n) : q(1, 10 ** -n);
}

/**
 * A terminating decimal in LaTeX: 9{,}6, 5400, 35\,000, 0{,}0035, -2{,}5. With `digits` the decimals are padded to
 * that many (a measure written with its uncertainty: 12{,}30).
 */
export function dec(r: R, digits?: number): string {
	const k0 = decimals(r);
	if (!Number.isFinite(k0)) throw new Error(`dec: ${r} is not a terminating decimal`);
	const k = digits === undefined ? k0 : digits;
	if (k < k0) throw new Error(`dec: ${r} has more than ${k} decimals`);
	const neg = r.sign() < 0;
	const a = r.abs();
	const scaled = String(a.num * (10 ** k / a.den)).padStart(k + 1, '0');
	let int = scaled.slice(0, scaled.length - k);
	const frac = scaled.slice(scaled.length - k);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return (neg ? '-' : '') + (frac ? `${int}{,}${frac}` : int);
}

/** r = a · 10^n with 1 ≤ a < 10 (r > 0). */
export function sciParts(r: R): { a: R; n: number } {
	if (r.sign() <= 0) throw new Error(`sciParts: ${r} is not positive`);
	let n = Math.floor(Math.log10(r.num / r.den));
	let a = r.div(pow10(n));
	// floating log10 can be off by one near powers of ten
	if (a.compare(q(10)) >= 0) {
		n += 1;
		a = r.div(pow10(n));
	} else if (a.compare(q(1)) < 0) {
		n -= 1;
		a = r.div(pow10(n));
	}
	return { a, n };
}

/** The power of ten: 10^{-4}, 10^3, 10^{12}, 10. */
export function pow10Tex(n: number): string {
	if (n === 1) return '10';
	return n >= 0 && n < 10 ? `10^${n}` : `10^{${n}}`;
}

/** a \cdot 10^{n}, the scientific notation of r (r > 0); just a when n = 0. */
export function sci(r: R): string {
	const { a, n } = sciParts(r);
	return n === 0 ? dec(a) : `${dec(a)} \\cdot ${pow10Tex(n)}`;
}

/** An explicit mantissa and exponent, not normalised: 38{,}4 \cdot 10^4. */
export function sciRaw(a: R, n: number): string {
	return n === 0 ? dec(a) : `${dec(a)} \\cdot ${pow10Tex(n)}`;
}

/** A unit upright: m, km, kg/m^3; a leading μ becomes \mu (4{,}2\,\mu\text{m}). */
export function unitTex(u: string): string {
	if (u.startsWith('μ')) return `\\mu\\text{${u.slice(1)}}`;
	const m = /^(.*?)(\^\d)?$/.exec(u)!;
	return `\\text{${m[1]}}${m[2] ?? ''}`;
}

/** A number with its unit: 3{,}5\,\text{km}. */
export const withUnit = (num: string, u: string) => `${num}\\,${unitTex(u)}`;
/** The same in prose, between dollars. */
export const pw = (num: string, u: string) => `$${withUnit(num, u)}$`;

/** A decimal with its unit. */
export const du = (r: R, u: string) => withUnit(dec(r), u);

/**
 * A multiple choice: the right option first in `opts`, then the others in order of preference; the first three
 * whose key (their `values` joined) differs from every option before them are kept, then all four are shuffled.
 */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const seen = new Set([key(right)]);
	const latexSeen = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (seen.has(key(o)) || latexSeen.has(o.latex)) continue;
		seen.add(key(o));
		latexSeen.add(o.latex);
		opts.push(o);
	}
	if (opts.length < count) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Values near r for filling a choice: r ± k units of its last significant digit, positive only. */
export function near(r: R, count = 8): R[] {
	const k = Math.max(0, decimals(r));
	const { n } = sciParts(r);
	const e = Math.min(n - 1, -k);
	const step = pow10(Math.max(e, -k));
	const out: R[] = [];
	for (let i = 1; out.length < count && i < 40; i++) {
		for (const c of [r.add(step.mul(q(i))), r.sub(step.mul(q(i)))]) if (c.sign() > 0) out.push(c);
	}
	return out;
}

export const BANNED = /—|piuttosto che/;
export const t = (s: string) => `\\text{${s}}`;

/** Prose with inline $…$ formulas as one LaTeX line: \text{…} around the prose, the formulas as they are. */
export function tx(prose: string): string {
	return prose
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`))
		.join('');
}
