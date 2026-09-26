/**
 * Monomials with an exact rational coefficient, shared by the generators monomi-grado,
 * monomi-operazioni, monomi-mcm-mcd and monomi-espressioni.
 *
 * A Mono is always in normal form: coefficient reduced, letters in alphabetical order, each
 * letter once, only positive exponents stored; the zero monomial has no letters. The LaTeX
 * never contains "1x", "-1x", "+ -", "x^1", "x^0" or a fraction with the sign inside.
 */
import { Rational, ZERO, ONE, q } from './rational';
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export type Exps = Readonly<Record<string, number>>;

export interface Mono {
	readonly c: Rational;
	readonly e: Exps;
}

/** Letter families: an exercise draws its letters from one of them, as textbooks do. */
export const FAMILIES: readonly (readonly string[])[] = [
	['a', 'b', 'c'],
	['x', 'y', 'z'],
];

export function mono(c: number | Rational, e: Record<string, number> = {}): Mono {
	const cr = typeof c === 'number' ? q(c) : c;
	if (cr.isZero()) return { c: ZERO, e: {} };
	const out: Record<string, number> = {};
	for (const v of Object.keys(e).sort()) {
		const n = e[v];
		if (!/^[a-z]$/.test(v)) throw new Error(`mono: invalid letter "${v}"`);
		if (!Number.isInteger(n) || n < 0) throw new Error(`mono: invalid exponent ${v}^${n}`);
		if (n > 0) out[v] = n;
	}
	return { c: cr, e: out };
}

export const letters = (m: Mono): string[] => Object.keys(m.e).sort();
export const expOf = (m: Mono, v: string): number => m.e[v] ?? 0;
export const isZeroMono = (m: Mono): boolean => m.c.isZero();

/** Total degree; null for the zero monomial, which has no degree. */
export function degree(m: Mono): number | null {
	if (m.c.isZero()) return null;
	return Object.values(m.e).reduce((s, n) => s + n, 0);
}

export function literalKey(e: Exps): string {
	return Object.keys(e)
		.sort()
		.map((v) => `${v}${e[v]}`)
		.join('');
}

export const similar = (a: Mono, b: Mono): boolean => literalKey(a.e) === literalKey(b.e);
export const monoKey = (m: Mono): string => `${m.c.toString()}|${literalKey(m.e)}`;
export const monoEquals = (a: Mono, b: Mono): boolean => monoKey(a) === monoKey(b);

// ---------------------------------------------------------------------------
// Operations

export function mul(a: Mono, b: Mono): Mono {
	const e: Record<string, number> = { ...a.e };
	for (const v of Object.keys(b.e)) e[v] = (e[v] ?? 0) + b.e[v];
	return mono(a.c.mul(b.c), e);
}

/** a : b as a monomial, or null when b is zero or some exponent would become negative. */
export function div(a: Mono, b: Mono): Mono | null {
	if (b.c.isZero()) return null;
	const e: Record<string, number> = { ...a.e };
	for (const v of Object.keys(b.e)) {
		const n = (e[v] ?? 0) - b.e[v];
		if (n < 0) return null;
		e[v] = n;
	}
	return mono(a.c.div(b.c), e);
}

export function divisible(a: Mono, b: Mono): boolean {
	return div(a, b) !== null;
}

export function ratPow(r: Rational, n: number): Rational {
	let out = ONE;
	for (let i = 0; i < n; i++) out = out.mul(r);
	return out;
}

export function pow(a: Mono, n: number): Mono {
	if (!Number.isInteger(n) || n < 0) throw new Error(`pow: invalid exponent ${n}`);
	const e: Record<string, number> = {};
	for (const v of Object.keys(a.e)) e[v] = a.e[v] * n;
	return mono(ratPow(a.c, n), e);
}

export const neg = (a: Mono): Mono => mono(a.c.neg(), { ...a.e });
export const scale = (a: Mono, k: Rational): Mono => mono(a.c.mul(k), { ...a.e });

/** Sum of similar monomials (zero terms allowed); null if two nonzero terms are not similar. */
export function addSimilar(terms: Mono[]): Mono | null {
	const nz = terms.filter((t) => !t.c.isZero());
	if (nz.length === 0) return mono(0);
	for (const t of nz) if (!similar(t, nz[0])) return null;
	return mono(
		nz.reduce((s, t) => s.add(t.c), ZERO),
		{ ...nz[0].e },
	);
}

/** A sum reduced by collecting similar terms, in order of first appearance; zero terms dropped. */
export function collect(terms: Mono[]): Mono[] {
	// Summed by literal part, not by comparing monomials: a group that cancels is the zero monomial,
	// which has no letters and would otherwise absorb the constant terms that follow it.
	const sums = new Map<string, { c: Rational; e: Exps }>();
	for (const t of terms) {
		if (t.c.isZero()) continue;
		const key = literalKey(t.e);
		const s = sums.get(key);
		if (s) s.c = s.c.add(t.c);
		else sums.set(key, { c: t.c, e: t.e });
	}
	return [...sums.values()].filter((s) => !s.c.isZero()).map((s) => mono(s.c, { ...s.e }));
}

// ---------------------------------------------------------------------------
// LaTeX

export function literalLatex(e: Exps): string {
	return Object.keys(e)
		.sort()
		.map((v) => {
			const n = e[v];
			if (n === 1) return v;
			return n < 10 ? `${v}^${n}` : `${v}^{${n}}`;
		})
		.join('');
}

/** "-\frac{3}{2}x^3y", "a^2b", "-7", "0". */
export function monoLatex(m: Mono): string {
	if (m.c.isZero()) return '0';
	const lit = literalLatex(m.e);
	if (lit === '') return m.c.toLatex();
	const abs = m.c.abs();
	return (m.c.sign() < 0 ? '-' : '') + (abs.isOne() ? '' : abs.toLatex()) + lit;
}

/** Wraps in round parentheses, with \left( \right) when the content has a fraction. */
export function wrap(inner: string): string {
	return inner.includes('\\frac') ? `\\left(${inner}\\right)` : `(${inner})`;
}

/** A monomial as a factor: in parentheses when forced, negative or with a fractional coefficient. */
export function factorLatex(m: Mono, force = false): string {
	const s = monoLatex(m);
	return force || m.c.sign() < 0 || !m.c.isInteger() ? wrap(s) : s;
}

/** A number as a factor: negative numbers in parentheses. */
export function numFactor(r: Rational): string {
	return r.sign() < 0 ? wrap(r.toLatex()) : r.toLatex();
}

/** Algebraic sum of monomials with the signs folded in: never "+ -". Zero terms are not allowed. */
export function sumLatex(terms: Mono[]): string {
	if (terms.length === 0) return '0';
	return terms
		.map((t, i) => {
			if (t.c.isZero()) throw new Error('sumLatex: zero term');
			const s = monoLatex(t);
			if (i === 0) return s;
			return t.c.sign() < 0 ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

/** A polynomial (already collected) in LaTeX; "0" when empty. */
export const polyLatex = (terms: Mono[]): string => (terms.length === 0 ? '0' : sumLatex(terms));

/** Sum of numbers with signs folded: "3 - 5 + 1", "-\frac{8}{12} - \frac{9}{12}". */
export function numSumLatex(xs: Rational[]): string {
	return xs
		.map((x, i) => {
			if (i === 0) return x.toLatex();
			return x.sign() < 0 ? ` - ${x.abs().toLatex()}` : ` + ${x.toLatex()}`;
		})
		.join('');
}

// ---------------------------------------------------------------------------
// SymPy strings (symbols are the single letters a, b, c, x, y, z, ...)

export function monoSympy(m: Mono): string {
	if (m.c.isZero()) return '0';
	const lit = letters(m).map((v) => (m.e[v] === 1 ? v : `${v}**${m.e[v]}`));
	if (lit.length === 0) return m.c.toString();
	const c = m.c.isOne() ? '' : m.c.equals(q(-1)) ? '-' : `${m.c.toString()}*`;
	return c + lit.join('*');
}

export function polySympy(terms: Mono[]): string {
	if (terms.length === 0) return '0';
	return terms.map((t) => `(${monoSympy(t)})`).join(' + ');
}

/** JSON-safe form for params: {c: "p/q", e: {x: 2}}. */
export const monoJSON = (m: Mono): { c: string; e: Record<string, number> } => ({ c: m.c.toString(), e: { ...m.e } });

export function monoFromJSON(x: unknown): Mono | null {
	if (!x || typeof x !== 'object') return null;
	const o = x as { c?: unknown; e?: unknown };
	if (typeof o.c !== 'string' || !o.e || typeof o.e !== 'object') return null;
	try {
		return mono(Rational.parse(o.c), o.e as Record<string, number>);
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// Random helpers

export function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

/** k distinct letters of a family, in alphabetical order. */
export function pickLetters(rng: Rng, family: readonly string[], k: number): string[] {
	const pool = [...family];
	const out: string[] = [];
	while (out.length < k && pool.length > 0) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
	return out.sort();
}

export function shuffle<T>(rng: Rng, xs: T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** A reduced fraction p/q with 1 <= |p| <= maxNum, 2 <= q <= maxDen, not an integer. */
export function randomFraction(rng: Rng, maxNum = 9, maxDen = 6): Rational {
	for (;;) {
		const r = q(nonZero(rng, -maxNum, maxNum), rng.int(2, maxDen));
		if (!r.isInteger()) return r;
	}
}

// ---------------------------------------------------------------------------
// Multiple choice

export interface Opt {
	latex: string;
	value: string;
	key: string;
}

/** An option for a monomial or a polynomial (list of monomials, collected here). */
export function monoOpt(m: Mono | Mono[]): Opt {
	const terms = Array.isArray(m) ? collect(m) : m.c.isZero() ? [] : [m];
	return {
		latex: polyLatex(terms),
		value: polySympy(terms),
		key: terms.map(monoKey).sort().join('+') || '0',
	};
}

export const numOpt = (n: number): Opt => ({ latex: `${n}`, value: `${n}`, key: `${n}` });

/**
 * Four distinct options, the first being the correct one before shuffling. Candidates come
 * from real mistakes, in order of preference; `fallback(i)` supplies more when they run out.
 */
export function buildChoice(correct: Opt, candidates: (Opt | null | undefined)[], fallback: (i: number) => Opt | null, rng: Rng, count = 4): ChoiceAnswer {
	const seen = new Set([correct.key]);
	const options: Opt[] = [correct];
	const add = (o: Opt | null | undefined) => {
		if (o && options.length < count && !seen.has(o.key)) {
			seen.add(o.key);
			options.push(o);
		}
	};
	candidates.forEach(add);
	for (let i = 1; options.length < count && i < 200; i++) add(fallback(i));
	if (options.length < count) throw new Error('buildChoice: not enough distinct options');
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	const shuffled: ChoiceOption[] = order.map((i) => ({ latex: options[i].latex, values: [options[i].value] }));
	return { kind: 'choice', options: shuffled, correct: order.indexOf(0) };
}

/** Generic wrong monomials near the right one: sign, coefficient ±i, one exponent +i. */
export function nearMono(m: Mono, i: number): Opt | null {
	const ls = letters(m);
	switch (i % 3) {
		case 1:
			return monoOpt(i === 1 ? neg(m) : mono(m.c.add(q(Math.ceil(i / 3))), { ...m.e }));
		case 2:
			return monoOpt(mono(m.c.sub(q(Math.ceil(i / 3))), { ...m.e }));
		default: {
			if (ls.length === 0) return monoOpt(mono(m.c.add(q(i)), {}));
			const v = ls[(i / 3) % ls.length];
			return monoOpt(mono(m.c, { ...m.e, [v]: m.e[v] + Math.ceil(i / (3 * ls.length)) }));
		}
	}
}

/** Patterns that must never appear in a problem or an answer. Mirrored in the Python checkers. */
export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d}])1\s*[a-z]/ },
	{ name: 'coefficiente 0 (0x)', re: /(?<![\d}])0\s*[a-z]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
	{ name: 'esponente 0', re: /\^\{0\}|\^0(?!\d)/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'segno dentro la frazione', re: /\\frac\{-/ },
	{ name: 'fattore 1 davanti a una parentesi', re: /(?<![\d}])1\s*\(/ },
];

export function forbidden(latex: string): string[] {
	return FORBIDDEN_PATTERNS.filter(({ re }) => re.test(latex)).map(({ name }) => `${name}: ${latex}`);
}
