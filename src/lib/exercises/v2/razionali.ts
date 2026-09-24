/**
 * Helpers shared by the generators of the chapter "Numeri razionali" (conversione, confronto,
 * potenze): shuffling, multiple choice with distinct options, prime factorisation in LaTeX and
 * decimal numbers (limited or periodic) with an exact value.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { Rational, gcd, q } from './rational';

export function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (let i = 0; i < 10_000; i++) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
	throw new Error(`nonZero: no value in [${a}, ${b}]`);
}

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** Weighted pick: [[value, weight], ...]. */
export function weighted<T>(rng: Rng, items: [T, number][]): T {
	const total = items.reduce((s, [, w]) => s + w, 0);
	let u = rng.next() * total;
	for (const [v, w] of items) {
		if (u < w) return v;
		u -= w;
	}
	return items[items.length - 1][0];
}

/**
 * Multiple choice with `count` options: the correct one, then the candidates in order of
 * preference, then the fallback until there are enough. Options are distinct both in value
 * (`values`) and in LaTeX. Shuffled with `rng`; throws if it cannot reach `count`.
 */
export function buildChoice(
	rng: Rng,
	correct: ChoiceOption,
	candidates: (ChoiceOption | null | undefined)[],
	fallback: (i: number) => ChoiceOption | null = () => null,
	count = 4,
): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const options: ChoiceOption[] = [correct];
	const keys = new Set([key(correct)]);
	const latexes = new Set([correct.latex]);
	const add = (o: ChoiceOption | null | undefined) => {
		if (!o || options.length >= count || keys.has(key(o)) || latexes.has(o.latex)) return;
		keys.add(key(o));
		latexes.add(o.latex);
		options.push(o);
	};
	candidates.forEach(add);
	for (let i = 0; options.length < count && i < 200; i++) add(fallback(i));
	if (options.length < count) throw new Error(`buildChoice: only ${options.length} distinct options`);
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => options[i]), correct: order.indexOf(0) };
}

/** Option for a rational number, shown reduced. */
export const ratOption = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });

/** A fraction as written, not reduced: "\frac{10}{15}", "-\frac{3}{4}"; den must be > 0. */
export function rawFrac(n: number, d: number): string {
	if (d === 1) return `${n}`;
	return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}

/** Number in LaTeX with parentheses when negative: for exponents like 3 \cdot (-2). */
export const parenInt = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

/** Prime factorisation of n >= 2 as [prime, exponent] pairs, ascending. */
export function primeFactors(n: number): [number, number][] {
	const out: [number, number][] = [];
	for (let p = 2; p * p <= n; p++) {
		let e = 0;
		while (n % p === 0) {
			n /= p;
			e++;
		}
		if (e > 0) out.push([p, e]);
	}
	if (n > 1) out.push([n, 1]);
	return out;
}

/** "2^2 \cdot 3" for 12. */
export function factorLatex(n: number): string {
	return primeFactors(n)
		.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e < 10 ? e : `{${e}}`}`))
		.join(' \\cdot ');
}

// ---------------------------------------------------------------------------
// Decimal numbers

/** A decimal as written: sign, integer part, antiperiod (or the decimals of a limited one), period. */
export interface Decimal {
	neg: boolean;
	int: string;
	ante: string;
	period: string;
}

/** Exact value: (N - M) / (99...9 00...0), or N / 10^k when there is no period. */
export function decimalValue(d: Decimal): Rational {
	const a = d.ante.length, p = d.period.length;
	let v: Rational;
	if (p === 0) {
		v = q(Number(d.int + d.ante), 10 ** a);
	} else {
		const N = Number(d.int + d.ante + d.period);
		const M = Number(d.int + d.ante);
		v = q(N - M, (10 ** p - 1) * 10 ** a);
	}
	return d.neg ? v.neg() : v;
}

/** "0{,}41\overline{6}", "-2{,}35", "3". */
export function decimalLatex(d: Decimal): string {
	const sign = d.neg ? '-' : '';
	if (!d.ante && !d.period) return `${sign}${d.int}`;
	return `${sign}${d.int}{,}${d.ante}${d.period ? `\\overline{${d.period}}` : ''}`;
}

/**
 * The decimal of a rational by long division, in canonical form: shortest antiperiod and period,
 * never a period 9. Null if the antiperiod or the period is longer than the limits.
 */
export function toDecimal(r: Rational, maxAnte = 6, maxPeriod = 6): Decimal | null {
	const neg = r.sign() < 0;
	const n = Math.abs(r.num), den = r.den;
	const int = String(Math.floor(n / den));
	let rem = n % den;
	const digits: string[] = [];
	const seen = new Map<number, number>();
	while (rem !== 0 && !seen.has(rem)) {
		if (digits.length > maxAnte + maxPeriod) return null;
		seen.set(rem, digits.length);
		rem *= 10;
		digits.push(String(Math.floor(rem / den)));
		rem %= den;
	}
	if (rem === 0) {
		if (digits.length > maxAnte) return null;
		return { neg, int, ante: digits.join(''), period: '' };
	}
	const start = seen.get(rem)!;
	const ante = digits.slice(0, start).join(''), period = digits.slice(start).join('');
	if (ante.length > maxAnte || period.length > maxPeriod) return null;
	return { neg, int, ante, period };
}

/** Long-division steps of n : d (n, d > 0) after the integer part, e.g. "50 : 12 = 4 resto 2". */
export function divisionSteps(n: number, d: number, maxSteps = 8): { lines: string[]; repeated: number | null } {
	let rem = n % d;
	const lines: string[] = [];
	const seen = new Set<number>();
	while (rem !== 0 && lines.length < maxSteps) {
		if (seen.has(rem)) return { lines, repeated: rem };
		seen.add(rem);
		const t = rem * 10;
		rem = t % d;
		lines.push(`${t} : ${d} = ${Math.floor(t / d)} \\text{ resto } ${rem}`);
	}
	if (rem !== 0 && seen.has(rem)) return { lines, repeated: rem };
	return { lines, repeated: rem === 0 ? null : rem };
}

export const isReduced = (n: number, d: number): boolean => d > 0 && gcd(n, d) === 1;
