/**
 * Semplificazione delle frazioni algebriche. Spec: specs/exercises/frazioni-algebriche-semplificazione.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/47-frazioni-algebriche-semplificazione.md),
 * each adding one difficulty: a monomial denominator with a common factor taken out of the binomial;
 * numerator and denominator of degree 2 with one common factor; the common factor is the whole
 * numerator or the whole denominator (1 left on top, or a polynomial); opposite factors (2 - x and
 * x - 2), with different exponents; two letters (partial grouping, notable products); cubes and
 * Ruffini.
 *
 * Built backwards: the answer (an irreducible fraction, already factored) and the common factors are
 * chosen first, and numerator and denominator are their products, expanded only for the text. The
 * answer follows the lesson's form: every factor with its first term positive in decreasing powers
 * (x - 2, never 2 - x), the numeric factors reduced, the minus sign in front of the fraction, the
 * numerator and denominator left factored (example 6), a polynomial when the denominator disappears.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { type Mono, type Opt, buildChoice, collect, forbidden, literalLatex, mono, monoFromJSON, monoJSON, monoKey, monoLatex, polySympy, shuffle, sumLatex } from '../monomi';

export const ID = 'frazioni-algebriche-semplificazione';

/** An irreducible factor (terms in decreasing order, first term positive) with its exponent. */
interface Fac {
	t: Mono[];
	e: number;
}

/** A polynomial as an integer numeric factor times factors. */
interface Pol {
	c: Rational;
	fs: Fac[];
}

interface Built {
	kase: string;
	vars: string[];
	num: Pol;
	den: Pol;
}

/** A fraction as the student writes it: a sign in front, numerator and denominator with positive numeric factors. */
interface Frac {
	sign: 1 | -1;
	n: Pol;
	d: Pol;
}

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials

const tKey = (t: Mono[]): string => t.map(monoKey).sort().join('+');
const isLetter = (t: Mono[]): boolean => t.length === 1;

function mulMono(a: Mono, b: Mono): Mono {
	const e: Record<string, number> = { ...a.e };
	for (const v of Object.keys(b.e)) e[v] = (e[v] ?? 0) + b.e[v];
	return mono(a.c.mul(b.c), e);
}

function polyMul(a: Mono[], b: Mono[]): Mono[] {
	const out: Mono[] = [];
	for (const x of a) for (const y of b) out.push(mulMono(x, y));
	return collect(out);
}

/** Lexicographic order on the exponents of vars (in alphabetical order), highest first. */
function cmpDesc(vars: string[]) {
	return (a: Mono, b: Mono): number => {
		for (const v of vars) {
			const d = (b.e[v] ?? 0) - (a.e[v] ?? 0);
			if (d !== 0) return d;
		}
		return 0;
	};
}

const sortDesc = (t: Mono[], vars: string[]): Mono[] => [...t].sort(cmpDesc(vars));
const sortAsc = (t: Mono[], vars: string[]): Mono[] => [...t].sort(cmpDesc(vars)).reverse();

function expand(p: Pol, vars: string[]): Mono[] {
	let acc: Mono[] = [mono(p.c)];
	for (const f of p.fs) for (let i = 0; i < f.e; i++) acc = polyMul(acc, f.t);
	return sortDesc(acc, vars);
}

const tDegree = (t: Mono[]): number => Math.max(...t.map((m) => Object.values(m.e).reduce((s, n) => s + n, 0)));
const polDegree = (p: Pol): number => p.fs.reduce((s, f) => s + f.e * tDegree(f.t), 0);

/** The same factor twice becomes one factor with the sum of the exponents. */
function norm(p: Pol): Pol {
	const fs: Fac[] = [];
	for (const f of p.fs) {
		const g = fs.find((h) => tKey(h.t) === tKey(f.t));
		if (g) g.e += f.e;
		else fs.push({ t: f.t, e: f.e });
	}
	return { c: p.c, fs };
}

/** The text of a polynomial: decreasing powers, or increasing when the numeric factor is negative (6 - 3x, 1 - x^2). */
function displayLatex(p: Pol, vars: string[]): string {
	const t = expand(p, vars);
	return sumLatex(p.c.sign() < 0 ? sortAsc(t, vars) : t);
}

// ---------------------------------------------------------------------------
// Factored form

function sortKey(f: Fac, vars: string[]): number[] {
	const t = sortDesc(f.t, vars);
	return [isLetter(f.t) ? 0 : 1, tDegree(f.t), ...t.slice(1).map((m) => m.c.num / m.c.den)];
}

function sortFacs(fs: Fac[], vars: string[]): Fac[] {
	return [...fs].sort((a, b) => {
		const ka = sortKey(a, vars);
		const kb = sortKey(b, vars);
		for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
			const d = (ka[i] ?? -1e9) - (kb[i] ?? -1e9);
			if (d !== 0) return d;
		}
		return 0;
	});
}

const facBody = (f: Fac): string => sumLatex(f.t);

/** "2x(2x - 3)", "-3(x - 2)", "(x - 2)^2(x + 1)", "x + 3" alone, "1" when there is nothing. */
function factoredLatex(p: Pol, vars: string[]): string {
	const fs = sortFacs(p.fs, vars);
	const lit: Record<string, number> = {};
	const groups: string[] = [];
	for (const f of fs) {
		if (isLetter(f.t)) {
			const v = Object.keys(f.t[0].e)[0];
			lit[v] = (lit[v] ?? 0) + f.e;
		} else groups.push(`(${facBody(f)})${f.e > 1 ? `^${f.e}` : ''}`);
	}
	const body = literalLatex(lit) + groups.join('');
	if (body === '') return p.c.toLatex();
	if (p.c.isOne() && fs.length === 1 && fs[0].e === 1 && !isLetter(fs[0].t)) return facBody(fs[0]);
	const prefix = p.c.isOne() ? '' : p.c.equals(q(-1)) ? '-' : p.c.toLatex();
	return prefix + body;
}

function factoredSympy(p: Pol): string {
	return [p.c.toString(), ...p.fs.map((f) => `(${polySympy(f.t)})**${f.e}`)].join('*');
}

const isOnePol = (p: Pol): boolean => p.c.isOne() && p.fs.length === 0;

/** "-\frac{x - 1}{x + 1}", "\frac{1}{x}", "x + 2", "-(x + 2)", "3(x - 2)", "-1". */
function fracLatex(f: Frac, vars: string[]): string {
	const n = factoredLatex(f.n, vars);
	if (isOnePol(f.d)) {
		if (f.sign > 0) return n;
		const bare = f.n.c.isOne() && f.n.fs.length === 1 && f.n.fs[0].e === 1 && !isLetter(f.n.fs[0].t);
		return bare ? `-(${n})` : `-${n}`;
	}
	return `${f.sign < 0 ? '-' : ''}\\frac{${n}}{${factoredLatex(f.d, vars)}}`;
}

const fracSympy = (f: Frac): string => `${f.sign < 0 ? '-' : ''}(${factoredSympy(f.n)})/(${factoredSympy(f.d)})`;

// ---------------------------------------------------------------------------
// Simplification, the rule of the lesson

/** Distinct factors of numerator and denominator with their exponent on each side (0 if absent). */
function factorTable(num: Pol, den: Pol): { t: Mono[]; en: number; ed: number }[] {
	const rows: { t: Mono[]; en: number; ed: number }[] = [];
	const add = (f: Fac, side: 'en' | 'ed') => {
		let row = rows.find((r) => tKey(r.t) === tKey(f.t));
		if (!row) {
			row = { t: f.t, en: 0, ed: 0 };
			rows.push(row);
		}
		row[side] += f.e;
	};
	for (const f of num.fs) add(f, 'en');
	for (const f of den.fs) add(f, 'ed');
	return rows;
}

/** Each common factor divided with its lower exponent, the numeric factors reduced, the sign in front. */
function simplify(num: Pol, den: Pol): Frac {
	const r = num.c.div(den.c);
	const n: Fac[] = [];
	const d: Fac[] = [];
	for (const row of factorTable(num, den)) {
		if (row.en > row.ed) n.push({ t: row.t, e: row.en - row.ed });
		if (row.ed > row.en) d.push({ t: row.t, e: row.ed - row.en });
	}
	return { sign: r.sign() < 0 ? -1 : 1, n: { c: q(Math.abs(r.num)), fs: n }, d: { c: q(r.den), fs: d } };
}

/** Whether numerator and denominator of the problem have something to simplify. */
function hasCommon(num: Pol, den: Pol): boolean {
	return gcd(num.c.num, den.c.num) > 1 || factorTable(num, den).some((r) => r.en > 0 && r.ed > 0);
}

// ---------------------------------------------------------------------------
// Conditions of existence

/** "x \neq 0", "x \neq -\frac{3}{2}", "x \neq 2y", "a \neq -b"; nothing for a factor that never vanishes (x^2 + 1). */
function ceOf(den: Pol, vars: string[]): string[] {
	const out: string[] = [];
	for (const f of sortFacs(den.fs, vars)) {
		const t = sortDesc(f.t, vars);
		if (isLetter(t)) {
			out.push(`${Object.keys(t[0].e)[0]} \\neq 0`);
			continue;
		}
		if (tDegree(t) !== 1 || t.length !== 2) {
			if (!neverZero(t)) throw new Error(`${ID}: no C.E. rule for the factor ${sumLatex(t)}`);
			continue;
		}
		const [lead, rest] = t;
		const v = Object.keys(lead.e)[0];
		const other = mono(rest.c.neg().div(lead.c), { ...rest.e });
		out.push(`${v} \\neq ${Object.keys(rest.e).length === 0 ? other.c.toLatex() : monoLatex(other)}`);
	}
	return [...new Set(out)];
}

/** x^2 + bx + c with b^2 - 4c < 0: the quadratic factors of the lesson (x^2 + 1, x^2 + 2x + 4). */
function neverZero(t: Mono[]): boolean {
	if (t.some((m) => Object.keys(m.e).some((v) => v !== 'x'))) return false;
	const co = (k: number) => t.find((m) => (m.e.x ?? 0) === k)?.c ?? q(0);
	if (tDegree(t) !== 2 || !co(2).isOne()) return false;
	return co(1).mul(co(1)).sub(co(0).mul(q(4))).sign() < 0;
}

function ceLatex(den: Pol, vars: string[]): string {
	const ce = ceOf(den, vars);
	return ce.length ? `\\text{C.E.: } ${ce.join(',\\ ')}` : `\\text{per ogni } ${vars.join(', ')}`;
}

// ---------------------------------------------------------------------------
// Factors

const letterF = (v: string): Mono[] => [mono(1, { [v]: 1 })];
/** p·x + b, with p > 0 and gcd(p, b) = 1. */
const linF = (b: number, p = 1): Mono[] => [mono(p, { x: 1 }), mono(b)];
/** u + k·w, two letters. */
const lin2F = (u: string, k: number, w: string): Mono[] => [mono(1, { [u]: 1 }), mono(k, { [w]: 1 })];
/** x^2 + s·a·x + a^2, the false square of x^3 - s·a^3; with s = 0 the sum x^2 + a^2. */
const quadF = (a: number, s: number): Mono[] => (s === 0 ? [mono(1, { x: 2 }), mono(a * a)] : [mono(1, { x: 2 }), mono(s * a, { x: 1 }), mono(a * a)]);

const pol = (c: number, ...fs: [Mono[], number][]): Pol => norm({ c: q(c), fs: fs.filter(([, e]) => e > 0).map(([t, e]) => ({ t, e })) });

function nz(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

/** x + b with b != 0 and not among the excluded constants. */
function drawLin(rng: Rng, max: number, not: number[] = []): Mono[] {
	for (;;) {
		const b = nz(rng, -max, max);
		if (!not.includes(b)) return linF(b);
	}
}

const constOf = (t: Mono[]): number => (t.length === 2 && Object.keys(t[1].e).length === 0 ? t[1].c.num : NaN);

// ---------------------------------------------------------------------------
// Levels

function build(rng: Rng, level: number): Built {
	const X = ['x'];
	switch (level) {
		case 1: {
			// 4x^2 - 6x over 10x^2: the answer n0·x^j0·B over d0·x^k0, times the common g·x^m
			let p = 1;
			let b = 0;
			do {
				p = rng.pick([1, 1, 2, 2, 3, 4, 5]);
				b = nz(rng, -9, 9);
			} while (gcd(p, b) !== 1);
			const B = linF(b, p);
			let n0 = 1;
			let d0 = 1;
			do {
				n0 = rng.pick([1, 1, 1, 2, 3, 4, 5]);
				d0 = rng.pick([1, 1, 2, 3, 4, 5, 6, 7]);
			} while (gcd(n0, d0) !== 1);
			const xOnTop = rng.next() < 0.3;
			const j0 = xOnTop ? rng.int(1, 2) : 0;
			const k0 = xOnTop ? 0 : rng.int(0, 2);
			const g = rng.pick([1, 2, 2, 3, 3, 4, 5, 6]);
			const m = g === 1 ? rng.int(1, 2) : rng.int(0, 2);
			const flipped = rng.next() < 0.3;
			const x = letterF('x');
			const bin = (c: number, k: number) => pol(g * c, [x, k + m], [B, 1]);
			const mon = (c: number, k: number) => pol(g * c, [x, k + m]);
			const num = flipped ? mon(n0, j0) : bin(n0, j0);
			const den = flipped ? bin(d0, k0) : mon(d0, k0);
			return { kase: flipped ? 'binomio sotto' : 'binomio sopra', vars: X, num, den };
		}
		case 2: {
			// x^2 - 4 over x^2 + x - 6: two factors on each side, one in common
			const C = drawLin(rng, 6);
			const pickOther = (not: Mono[][]) => {
				for (;;) {
					const t = rng.next() < 0.25 ? letterF('x') : drawLin(rng, 6);
					if (!not.some((o) => tKey(o) === tKey(t))) return t;
				}
			};
			const N1 = pickOther([C]);
			const D1 = pickOther([C, N1]);
			const cs = [1, 1, 1, 1, 1, 2, 3];
			return { kase: 'un fattore comune', vars: X, num: pol(rng.pick(cs), [C, 1], [N1, 1]), den: pol(rng.pick(cs), [C, 1], [D1, 1]) };
		}
		case 3: {
			if (rng.next() < 0.5) {
				// x + 1 over x^2 + x: the numerator is all common, 1 (or a number) is left on top
				const C = rng.next() < 0.2 ? letterF('x') : drawLin(rng, 6);
				const D1 = isLetter(C) ? drawLin(rng, 6) : rng.next() < 0.4 ? letterF('x') : drawLin(rng, 6, [constOf(C)]);
				const cn = rng.pick([1, 1, 1, 2, 3]);
				const cd = rng.next() < 0.75 ? cn * rng.pick([1, 1, 1, 2, 3]) : rng.pick([1, 2, 3, 5].filter((k) => gcd(k, cn) === 1 && k !== cn));
				return { kase: 'resta un numero sopra', vars: X, num: pol(cn, [C, 1]), den: pol(cd, [C, 1], [D1, 1]) };
			}
			// x^2 - 4 over x - 2: the denominator is all common, the answer is a polynomial
			const cd = rng.pick([1, 1, 1, 2, 3]);
			const cn = cd * rng.pick([1, 1, 1, 2, 3]);
			if (rng.next() < 0.2) {
				// x^3 + x over x^2 + 1: the denominator never vanishes
				const Q = quadF(rng.int(1, 3), 0);
				return { kase: 'risultato polinomio', vars: X, num: pol(cn, [letterF('x'), 1], [Q, 1]), den: pol(cd, [Q, 1]) };
			}
			const C = drawLin(rng, 6);
			const P1 = rng.next() < 0.3 ? letterF('x') : drawLin(rng, 6, [constOf(C)]);
			return { kase: 'risultato polinomio', vars: X, num: pol(cn, [C, 1], [P1, 1]), den: pol(cd, [C, 1]) };
		}
		case 4: {
			// 6 - 3x over x^2 - 4x + 4: x - a written as a - x on the side with a negative numeric factor
			const a = rng.int(1, 6);
			const f = linF(-a);
			const x = letterF('x');
			const negShape = (): Pol => {
				const u = rng.next();
				if (u < 0.45) return pol(-rng.pick([1, 1, 2, 3, 4, 5]), [f, 1]);
				if (u < 0.75) return pol(-rng.pick([1, 1, 2]), [f, 1], [linF(a), 1]);
				return pol(-rng.pick([1, 1, 2]), [x, 1], [f, 1]);
			};
			const posShape = (): Pol => {
				const k = rng.pick([1, 1, 1, 2, 3]);
				const u = rng.next();
				if (u < 0.3) return pol(k, [f, 2]);
				if (u < 0.7) return pol(k, [f, 1], [drawLin(rng, 6, [-a]), 1]);
				if (u < 0.9) return pol(k, [x, 1], [f, 1]);
				return pol(k, [f, 1]);
			};
			const both = rng.next() < 0.15;
			const neg = negShape();
			const other = both ? negShape() : posShape();
			const negOnTop = rng.next() < 0.5;
			return { kase: both ? 'segni che si annullano' : 'resta il segno meno', vars: X, num: negOnTop ? neg : other, den: negOnTop ? other : neg };
		}
		case 5: {
			// ax - ay + bx - by over x^2 - y^2, or x^2 - 2xy + y^2 over x^2 - y^2
			const pool = [1, -1, 2, -2].map((k) => lin2F('x', k, 'y'));
			const C = rng.pick(pool);
			const others = pool.filter((t) => tKey(t) !== tKey(C));
			const side = () => (rng.next() < 0.35 ? letterF(rng.pick(['x', 'y'])) : rng.pick(others));
			if (rng.next() < 0.4) {
				const G = lin2F('a', rng.pick([1, -1]), 'b');
				const D1 = rng.next() < 0.2 ? C : side();
				return { kase: 'raccoglimento parziale', vars: ['a', 'b', 'x', 'y'], num: pol(1, [C, 1], [G, 1]), den: pol(rng.pick([1, 1, 1, 2, 3]), [C, 1], [D1, 1]) };
			}
			const u = rng.next();
			const N1 = u < 0.25 ? C : side();
			let D1 = u >= 0.25 && u < 0.45 ? C : side();
			while (tKey(D1) === tKey(N1)) D1 = side();
			const cs = [1, 1, 1, 1, 2, 3];
			return { kase: 'prodotti notevoli', vars: ['x', 'y'], num: pol(rng.pick(cs), [C, 1], [N1, 1]), den: pol(rng.pick(cs), [C, 1], [D1, 1]) };
		}
		case 6: {
			const x = letterF('x');
			const k = rng.pick([1, 1, 1, 2]);
			let cube: Pol;
			let other: Pol;
			let kase: string;
			if (rng.next() < 0.5) {
				// x^3 - 8 = (x - 2)(x^2 + 2x + 4): the false square stays in the answer
				const a = rng.int(1, 3);
				const s = rng.next() < 0.6 ? 1 : -1;
				const L = linF(-s * a);
				cube = pol(k, [L, 1], [quadF(a, s), 1]);
				const e = rng.int(1, 2);
				const u = rng.next();
				const M = u < 0.5 ? drawLin(rng, 3, [s * a, -s * a]) : u < 0.8 ? x : null;
				other = M ? pol(rng.pick([1, 1, 2, 3]), [L, e], [M, 1]) : pol(rng.pick([1, 1, 2, 3]), [L, 2]);
				kase = 'cubi';
			} else {
				// x^3 - 3x^2 + 4 = (x - 2)^2(x + 1): three integer zeros, found with Ruffini
				const roots = [1, -1, 2, -2, 3, -3];
				const r = rng.pick(roots);
				const u = rng.pick(roots);
				let v = rng.pick(roots);
				while (u === r && v === r) v = rng.pick(roots);
				const C = linF(-r);
				cube = pol(k, [C, 1], [linF(-u), 1], [linF(-v), 1]);
				const w = rng.pick(roots.filter((z) => z !== u && z !== v));
				const shape = rng.next();
				if (shape < 0.5) other = pol(rng.pick([1, 1, 2]), [C, 1], [linF(-w), 1]);
				else if (shape < 0.7) other = pol(rng.pick([1, 1, 2]), [x, 1], [C, 1]);
				else other = pol(1, [C, 2], [linF(-w), 1]);
				kase = 'Ruffini';
			}
			const cubeOnTop = rng.next() < 0.5;
			return { kase, vars: X, num: cubeOnTop ? cube : other, den: cubeOnTop ? other : cube };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps

/** x - a written as a - x, the form in 6 - 3x = 3(2 - x). */
function flipped(t: Mono[]): Mono[] {
	return [...t].reverse().map((m) => mono(m.c.neg(), { ...m.e }));
}

/** x - a with a > 0. */
const isMinusConst = (t: Mono[]): boolean => t.length === 2 && Object.keys(t[1].e).length === 0 && t[1].c.sign() < 0 && t[0].c.isOne();

/** The polynomial with its negative numeric factor moved into a factor x - a: 6 - 3x = 3(2 - x), 1 - x^2 = (1 - x)(x + 1). */
function naturalForm(p: Pol): { nat: Pol; flip: Mono[] } | null {
	if (p.c.sign() >= 0) return null;
	const i = p.fs.findIndex((f) => isMinusConst(f.t) && f.e % 2 === 1);
	if (i < 0) return null;
	const fs = p.fs.map((f, j) => (j === i ? { t: flipped(f.t), e: f.e } : f));
	return { nat: { c: p.c.neg(), fs }, flip: p.fs[i].t };
}

function chainOf(p: Pol, vars: string[]): { text: string; flip: Mono[] | null } {
	const chain = [displayLatex(p, vars)];
	const nat = naturalForm(p);
	if (nat) chain.push(factoredLatex(nat.nat, vars));
	chain.push(factoredLatex(p, vars));
	const uniq = chain.filter((s, i) => chain.indexOf(s) === i);
	return { text: uniq.join(' = '), flip: nat ? nat.flip : null };
}

function steps(b: Built, r: Frac): string[] {
	const { vars, num, den } = b;
	const out: string[] = [];
	const flips: Mono[][] = [];
	const d = chainOf(den, vars);
	out.push(`\\text{Denominatore: } ${d.text}`);
	const ce = ceOf(den, vars);
	out.push(ce.length ? `\\text{C.E.: } ${ce.join(',\\ ')}` : `\\text{Il denominatore non si annulla mai: nessuna C.E.}`);
	const n = chainOf(num, vars);
	if (b.kase === 'raccoglimento parziale') {
		// ax - ay + bx - by = a(x - y) + b(x - y) = (a + b)(x - y), as in example 5
		const G = num.fs.find((f) => f.t.some((m) => m.e.a))!.t;
		const C = facBody(num.fs.find((f) => f.t.some((m) => m.e.x))!);
		const mid = `a(${C}) ${G[1].c.sign() < 0 ? '-' : '+'} b(${C})`;
		out.push(`\\text{Numeratore: } ${displayLatex(num, vars)} = ${mid} = ${factoredLatex(num, vars)}`);
	} else out.push(`\\text{Numeratore: } ${n.text}`);
	for (const f of [n.flip, d.flip]) if (f && !flips.some((g) => tKey(g) === tKey(f))) flips.push(f);
	for (const f of flips) out.push(`\\text{Fattori opposti: } ${sumLatex(flipped(f))} = -(${sumLatex(f)})`);
	const g = gcd(num.c.num, den.c.num);
	if (g > 1) out.push(`\\text{Fattore numerico comune: } ${g}`);
	const rows = factorTable(num, den).filter((row) => row.en > 0 && row.ed > 0);
	for (const row of sortFacs(
		rows.map((rr) => ({ t: rr.t, e: 1 })),
		vars,
	)) {
		const rr = rows.find((x) => tKey(x.t) === tKey(row.t))!;
		const body = facBody(row);
		if (rr.en === 1 && rr.ed === 1) out.push(`\\text{Fattore comune: } ${body}`);
		else out.push(`\\text{Fattore comune } ${body}\\text{: esponente } ${rr.en} \\text{ sopra e } ${rr.ed} \\text{ sotto, si toglie con esponente } ${Math.min(rr.en, rr.ed)}`);
	}
	out.push(`\\frac{${factoredLatex(num, vars)}}{${factoredLatex(den, vars)}} = ${fracLatex(r, vars)}`);
	out.push(`\\text{Risultato: } ${fracLatex(r, vars)},\\quad ${ceLatex(den, vars)}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks

function assemble(b: Built, level: number, seed: number): Sample {
	const r = simplify(b.num, b.den);
	const latex = fracLatex(r, b.vars);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: 'Semplifica la frazione algebrica.',
		problem: `\\frac{${displayLatex(b.num, b.vars)}}{${displayLatex(b.den, b.vars)}}`,
		solution: `${latex},\\quad ${ceLatex(b.den, b.vars)}`,
		steps: steps(b, r),
		answer: { kind: 'expression', value: fracSympy(r), latex, form: 'irriducibile' },
		params: { case: b.kase, vars: b.vars, num: polJSON(b.num), den: polJSON(b.den), ce: ceOf(b.den, b.vars) },
	};
}

const polJSON = (p: Pol) => ({ c: p.c.toString(), fs: p.fs.map((f) => ({ t: f.t.map(monoJSON), e: f.e })) });

function polFromJSON(x: unknown): Pol {
	const o = x as { c: string; fs: { t: unknown[]; e: number }[] };
	return {
		c: Rational.parse(o.c),
		fs: o.fs.map((f) => {
			const t = f.t.map(monoFromJSON);
			if (t.some((m) => !m) || !Number.isInteger(f.e) || f.e < 1) throw new Error('bad factor');
			return { t: t as Mono[], e: f.e };
		}),
	};
}

function parseBuilt(p: Record<string, unknown>): Built | null {
	if (typeof p.case !== 'string' || !Array.isArray(p.vars)) return null;
	try {
		return { kase: p.case, vars: p.vars as string[], num: polFromJSON(p.num), den: polFromJSON(p.den) };
	} catch {
		return null;
	}
}

const MAX_COEF = 60;

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.params);
	if (!b) return ['params non validi'];
	const { num, den, vars } = b;
	const r = simplify(num, den);
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== fracSympy(r) || a.latex !== fracLatex(r, vars) || a.form !== 'irriducibile') v.push('risposta diversa dal risultato');
	if (sample.problem !== `\\frac{${displayLatex(num, vars)}}{${displayLatex(den, vars)}}`) v.push('testo diverso dai parametri');
	v.push(...forbidden(sample.problem), ...forbidden(a.kind === 'expression' ? a.latex : ''));
	if (!hasCommon(num, den)) v.push('la frazione è già irriducibile');
	for (const p of [num, den]) {
		if (!p.c.isInteger()) v.push('fattore numerico non intero');
		if (new Set(p.fs.map((f) => tKey(f.t))).size !== p.fs.length) v.push('fattore ripetuto nei parametri');
		const t = expand(p, vars);
		for (const m of t) if (Math.abs(m.c.num) > MAX_COEF) v.push(`coefficiente oltre ${MAX_COEF}: ${m.c}`);
		if (polDegree(p) > 3) v.push('grado oltre 3');
		if (p.c.sign() < 0 && displayLatex(p, vars).startsWith('-')) v.push('un polinomio scritto con il segno meno davanti');
	}
	const rows = factorTable(num, den);
	const negs = [num, den].filter((p) => p.c.sign() < 0).length;
	const common = rows.filter((rr) => rr.en > 0 && rr.ed > 0);
	const t = [expand(num, vars), expand(den, vars)];
	const x = letterF('x');
	switch (sample.level) {
		case 1: {
			const mons = t.filter((s) => s.length === 1).length;
			if (vars.join() !== 'x' || negs || mons !== 1) v.push('livello 1: un monomio e un binomio in x, fattori positivi');
			const monoSide = t[0].length === 1 ? num : den;
			if (!monoSide.fs.some((f) => tKey(f.t) === tKey(x))) v.push('livello 1: il monomio contiene x');
			if (isOnePol(r.d) || isOnePol(r.n)) v.push('livello 1: resta una frazione, senza 1 al numeratore');
			break;
		}
		case 2:
			if (vars.join() !== 'x' || negs || polDegree(num) !== 2 || polDegree(den) !== 2) v.push('livello 2: numeratore e denominatore di secondo grado in x');
			if (common.length !== 1 || common[0].en !== 1 || common[0].ed !== 1) v.push('livello 2: un solo fattore comune, con esponente 1');
			if (polDegree(r.n) !== 1 || polDegree(r.d) !== 1) v.push('livello 2: risultato di primo grado sopra e sotto');
			break;
		case 3: {
			if (vars.join() !== 'x' || negs) v.push('livello 3: fattori numerici positivi');
			const top = polDegree(r.n) === 0 && polDegree(r.d) > 0;
			const poly = isOnePol(r.d) && polDegree(r.n) > 0;
			if ((b.kase === 'resta un numero sopra' && !top) || (b.kase === 'risultato polinomio' && !poly) || (!top && !poly)) v.push('livello 3: resta un numero sopra o un polinomio');
			break;
		}
		case 4: {
			if (vars.join() !== 'x' || negs === 0) v.push('livello 4: almeno un polinomio con fattore numerico negativo');
			const ok = [num, den].some((p) => p.c.sign() < 0 && p.fs.some((f) => isMinusConst(f.t) && f.e % 2 === 1 && common.some((c) => tKey(c.t) === tKey(f.t))));
			if (!ok) v.push('livello 4: serve un fattore opposto comune (a - x)');
			if ((b.kase === 'segni che si annullano') !== (negs === 2) || (negs === 2) !== (r.sign > 0)) v.push('livello 4: caso e segno non tornano');
			if (r.sign < 0 && isOnePol(r.d) && polDegree(r.n) > 0) v.push('livello 4: un polinomio con il segno meno davanti');
			break;
		}
		case 5: {
			if (vars.length < 2 || negs) v.push('livello 5: più lettere');
			for (const s of t) for (const u of ['x', 'y']) if (!s.some((m) => (m.e[u] ?? 0) > 0)) v.push('livello 5: numeratore e denominatore contengono x e y');
			if (!common.some((c) => c.t.length === 2)) v.push('livello 5: il fattore comune è un binomio in due lettere');
			break;
		}
		case 6: {
			if (vars.join() !== 'x' || negs) v.push('livello 6: fattori positivi in x');
			const cubic = [num, den].some((p) => polDegree(p) === 3 && expand(p, vars).some((m) => Object.keys(m.e).length === 0));
			if (!cubic) v.push('livello 6: un polinomio di terzo grado con termine noto');
			const hasQuad = rows.some((rr) => tDegree(rr.t) === 2);
			if ((b.kase === 'cubi') !== hasQuad) v.push('livello 6: il caso cubi ha il falso quadrato');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (polDegree(r.n) === 0 && polDegree(r.d) === 0 && sample.level !== 4) v.push('risultato numerico fuori dal livello 4');
	if (!isOnePol(r.d) && polDegree(r.d) === 0) v.push('denominatore del risultato solo numerico');
	// numerator and denominator made of the same factors: only 2 - x over x - 2 (= -1), as in the lesson
	const sameFactors = rows.every((rr) => rr.en === rr.ed);
	if (sameFactors && negs !== 1) v.push('numeratore e denominatore proporzionali');
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

/** A polynomial written by the student as it comes (a sum), split into content and the rest. */
function polFromTerms(terms: Mono[], vars: string[]): Pol | null {
	if (terms.length === 0) return null;
	const t = sortDesc(terms, vars);
	if (t.length === 1) {
		const m = t[0];
		return { c: m.c, fs: Object.keys(m.e).map((u) => ({ t: letterF(u), e: m.e[u] })) };
	}
	const content = t.map((m) => Math.abs(m.c.num)).reduce(gcd) * (t[0].c.sign() < 0 ? -1 : 1);
	return { c: q(content), fs: [{ t: t.map((m) => mono(m.c.div(q(content)), { ...m.e })), e: 1 }] };
}

/** Numerator over denominator, each with its own sign, as a fraction with the sign in front. */
function asFrac(n: Pol, d: Pol): Frac {
	const s = n.c.sign() * d.c.sign();
	return { sign: s < 0 ? -1 : 1, n: { c: n.c.abs(), fs: n.fs }, d: { c: d.c.abs(), fs: d.fs } };
}

const dropFactor = (p: Pol, key: string): Pol => ({ c: p.c, fs: p.fs.filter((f) => tKey(f.t) !== key) });

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.params)!;
	const { num, den, vars } = b;
	const r = simplify(num, den);
	const rows = factorTable(num, den);
	const common = rows.filter((rr) => rr.en > 0 && rr.ed > 0);
	const truthKey = fracLatex(r, vars);
	let sameUsed = false;
	/** Key by value, so that two options never have the same value; one unreduced form of the answer is allowed. */
	const opt = (f: Frac | null): Opt | null => {
		if (!f) return null;
		if (f.n.c.isZero()) return { latex: '0', value: '0', key: '0' };
		const red = simplify({ c: f.n.c.mul(q(f.sign)), fs: f.n.fs }, f.d);
		let key = fracLatex(red, vars);
		if (key === truthKey) {
			if (sameUsed || fracLatex(f, vars) === truthKey) return null;
			sameUsed = true;
			key = `stesso valore: ${fracLatex(f, vars)}`;
		}
		return { latex: fracLatex(f, vars), value: fracSympy(f), key };
	};
	const cands: (Frac | null)[] = [];
	const neg = (f: Frac): Frac => ({ ...f, sign: f.sign > 0 ? -1 : 1 });
	// opposite factors taken as equal: the minus sign lost
	if (num.c.sign() < 0 || den.c.sign() < 0) cands.push(neg(r));
	// a factor with different exponents taken away completely
	for (const rr of common)
		if (rr.en !== rr.ed) {
			const k = tKey(rr.t);
			cands.push({ sign: r.sign, n: dropFactor(r.n, k), d: dropFactor(r.d, k) });
		}
	// 0 instead of 1, and the denominator alone (the lesson's warning); the reciprocal for a polynomial
	if (polDegree(r.n) === 0 && r.n.c.isOne() && polDegree(r.d) > 0) {
		cands.push({ sign: r.sign, n: r.d, d: { c: q(1), fs: [] } });
		cands.push({ sign: 1, n: { c: q(0), fs: [] }, d: { c: q(1), fs: [] } });
	}
	if (isOnePol(r.d) && polDegree(r.n) > 0) cands.push({ sign: r.sign, n: { c: q(1), fs: [] }, d: r.n });
	// numeric factor divided on one side only, or the letters cancelled together with the numbers
	const g = gcd(num.c.num, den.c.num);
	if (g > 1) {
		cands.push({ sign: r.sign, n: r.n, d: { c: r.d.c.mul(q(g)), fs: r.d.fs } });
		cands.push({ sign: r.sign, n: { c: r.n.c.mul(q(g)), fs: r.n.fs }, d: r.d });
	}
	// terms cancelled instead of factors: the same leading term taken away from numerator and denominator
	const tn = expand(num, vars);
	const td = expand(den, vars);
	if (tn.length > 1 && td.length > 1 && monoKey(tn[0]) === monoKey(td[0])) {
		const pn = polFromTerms(tn.slice(1), vars);
		const pd = polFromTerms(td.slice(1), vars);
		if (pn && pd) cands.push(asFrac(pn, pd));
	}
	// the common factor forgotten on one side
	for (const rr of common) {
		const k = rr.t;
		cands.push({ sign: r.sign, n: norm({ c: r.n.c, fs: [...r.n.fs, { t: k, e: 1 }] }), d: r.d });
		break;
	}
	// not simplified completely: one common factor left on both sides (same value, not irreducible)
	const shuffled = shuffle(rng, common);
	if (shuffled.length) {
		const k = shuffled[0].t;
		cands.push({ sign: r.sign, n: norm({ c: r.n.c, fs: [...r.n.fs, { t: k, e: 1 }] }), d: norm({ c: r.d.c, fs: [...r.d.fs, { t: k, e: 1 }] }) });
	} else if (g > 1) cands.push({ sign: r.sign, n: { c: r.n.c.mul(q(g)), fs: r.n.fs }, d: { c: r.d.c.mul(q(g)), fs: r.d.fs } });
	// the fraction upside down
	if (!isOnePol(r.d)) cands.push({ sign: r.sign, n: r.d, d: r.n });
	const fallback = (i: number): Opt | null => {
		const j = Math.ceil(i / 3);
		switch (i % 3) {
			case 0:
				return opt({ sign: r.sign, n: r.n, d: { c: r.d.c.add(q(j)), fs: r.d.fs } });
			case 1:
				return opt({ sign: r.sign, n: { c: r.n.c.add(q(j)), fs: r.n.fs }, d: r.d });
			default:
				return i === 2 ? opt(neg(r)) : opt({ sign: r.sign, n: r.n, d: norm({ c: r.d.c, fs: [...r.d.fs, { t: letterF(vars[vars.length > 2 ? 2 : 0]), e: j }] }) });
		}
	};
	const correct: Opt = { latex: truthKey, value: fracSympy(r), key: truthKey };
	return buildChoice(
		correct,
		cands.map((f) => opt(f)),
		fallback,
		rng,
	);
}

export const frazioniAlgebricheSemplificazione: Generator = {
	id: ID,
	title: 'Semplificazione delle frazioni algebriche',
	levels: {
		1: { label: 'Denominatore monomio', constraints: ['un monomio e un binomio in x', 'fattore comune numerico o una potenza di x', 'circa 3 su 10 con il binomio al denominatore'] },
		2: { label: 'Un fattore comune', constraints: ['numeratore e denominatore di secondo grado, prodotti di due fattori', 'un solo fattore comune, con esponente 1'] },
		3: { label: 'Resta 1 o un polinomio', constraints: ['metà: il numeratore è tutto comune, sopra resta 1 o un numero', 'metà: il denominatore è tutto comune, il risultato è un polinomio', 'circa 1 su 10 con denominatore x^2 + a^2, senza C.E.'] },
		4: { label: 'Fattori opposti', constraints: ['un fattore x - a scritto come a - x', 'esponenti diversi in circa 3 su 10', 'circa 15 su 100 con due segni meno che si annullano'] },
		5: { label: 'Due lettere', constraints: ['fattore comune x ± y o x ± 2y', 'circa 4 su 10 con raccoglimento parziale in a, b, x, y'] },
		6: { label: 'Cubi e Ruffini', constraints: ['un polinomio di terzo grado con termine noto', 'metà somma o differenza di cubi, metà tre zeri interi'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			const sample = assemble(b, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default frazioniAlgebricheSemplificazione;
