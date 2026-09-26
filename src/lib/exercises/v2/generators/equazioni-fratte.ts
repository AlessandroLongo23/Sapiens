/**
 * Equazioni fratte. Spec: specs/exercises/equazioni-fratte.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/49-equazioni-fratte.md): one fraction
 * per side, monomial denominators, a denominator to factor, opposite denominators with a term without
 * denominator, binomial products where x^2 cancels, and the awkward cases (a solution the C.E. exclude,
 * an impossible or indeterminate equation, a solution 0 that is accepted).
 *
 * Built backwards: the denominators (their roots) and the solution are chosen first, then one constant of
 * a numerator (the "hole") is computed so that the equation holds at the solution. Every term is
 * sign · N(x) / (c · Π(x − r)): the checker gets numerators and denominators in params and rebuilds the
 * rest from the LaTeX of the problem.
 *
 * Answer: levels 1-5 a set with one value. Level 6 is multiple choice from the start, because the answer of
 * an indeterminate fractional equation is ℝ minus the excluded values, which the `set` answer type
 * (values or "every real number") cannot say.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { type Poly, polyAdd, polyDegree, polyMul, polyScale, polySub, polyToLatex } from '../latex';

export const ID = 'equazioni-fratte';

/** c · Π(x − r). `asc`: written by increasing powers, "a − x" (c = −1, one root a > 0). */
interface Den {
	c: number;
	roots: number[];
	asc: boolean;
}
/** sign · num / den; num are integer coefficients by degree. A term with den 1 has no fraction. */
interface Term {
	sign: 1 | -1;
	num: number[];
	den: Den;
}
interface Eq {
	lhs: Term[];
	rhs: Term[];
}
type Case = 'accettabile' | 'non accettabile' | 'impossibile' | 'indeterminata';
type Case6 = 'non accettabile' | 'impossibile' | 'indeterminata' | 'zero';

const D = (c: number, roots: number[] = [], asc = false): Den => ({ c, roots, asc });
const PLAIN = D(1);
const T = (sign: 1 | -1, num: number[], den: Den): Term => ({ sign, num, den });
const sgn = (n: number): 1 | -1 => (n < 0 ? -1 : 1);

// ---------------------------------------------------------------------------
// Polynomials

const P = (cs: number[]): Poly => cs.map((c) => q(c));
const rootsPoly = (roots: number[]): Poly => roots.reduce<Poly>((p, r) => polyMul(p, P([-r, 1])), P([1]));
const denPoly = (d: Den): Poly => polyScale(rootsPoly(d.roots), q(d.c));
function evalPoly(p: Poly, x: Rational): Rational {
	let v = q(0);
	for (let i = p.length - 1; i >= 0; i--) v = v.mul(x).add(p[i]);
	return v;
}
function trim(cs: number[]): number[] {
	const out = [...cs];
	while (out.length > 1 && out[out.length - 1] === 0) out.pop();
	return out;
}
const coefAt = (p: Poly, i: number): Rational => p[i] ?? q(0);
const isPlain = (t: Term) => t.den.c === 1 && t.den.roots.length === 0;
const nonZeroCount = (cs: number[]) => cs.filter((c) => c !== 0).length;

/** A negative constant numerator becomes a minus in front of the fraction. */
function normTerm(t: Term): Term {
	const num = trim(t.num);
	if (num.length === 1 && num[0] < 0) return T((-t.sign) as 1 | -1, [-num[0]], t.den);
	return { ...t, num };
}

/** The same equation with every opposite denominator a − x written as −(x − a), the minus moved in front. */
function positive(eq: Eq): Eq {
	const f = (t: Term): Term => (t.den.c < 0 ? T((-t.sign) as 1 | -1, t.num, D(-t.den.c, t.den.roots)) : t);
	return { lhs: eq.lhs.map(f), rhs: eq.rhs.map(f) };
}

// ---------------------------------------------------------------------------
// Solving, as in the lesson: C.E., MCM, multiply every term, solve the integer equation, compare.

interface Solved {
	/** Excluded values, ascending. */
	ce: number[];
	/** Factors of the MCM in order of first appearance, and its numeric factor. */
	order: number[];
	C: number;
	L: Poly;
	R: Poly;
	A: Rational;
	B: Rational;
	case: Case;
	x: Rational | null;
}

function mcmOf(eq: Eq): { order: number[]; C: number } {
	const all = [...eq.lhs, ...eq.rhs];
	const order: number[] = [];
	for (const t of all) for (const r of t.den.roots) if (!order.includes(r)) order.push(r);
	return { order, C: all.reduce((m, t) => lcm(m, Math.abs(t.den.c)), 1) };
}

/** MCM / den, for a term of an equation without opposite denominators. */
const missing = (t: Term, C: number, order: number[]): Poly =>
	polyScale(rootsPoly(order.filter((r) => !t.den.roots.includes(r))), q(C / t.den.c));

function cleared(eq: Eq, C: number, order: number[]): { L: Poly; R: Poly } {
	const side = (ts: Term[]) => ts.reduce<Poly>((acc, t) => polyAdd(acc, polyScale(polyMul(P(t.num), missing(t, C, order)), q(t.sign))), P([0]));
	return { L: side(eq.lhs), R: side(eq.rhs) };
}

/** Solution of the integer equation L = R when it is of first degree; null when x^2 does not cancel. */
function linear(L: Poly, R: Poly): { A: Rational; B: Rational } | null {
	const d = polySub(L, R);
	if (polyDegree(d) > 1) return null;
	return { A: coefAt(d, 1), B: coefAt(d, 0).neg() };
}

function solve(eq0: Eq): Solved | null {
	const eq = positive(eq0);
	const { order, C } = mcmOf(eq);
	const { L, R } = cleared(eq, C, order);
	const lin = linear(L, R);
	if (!lin) return null;
	const ce = [...order].sort((a, b) => a - b);
	const { A, B } = lin;
	let kase: Case, x: Rational | null = null;
	if (!A.isZero()) {
		x = B.div(A);
		kase = ce.some((r) => q(r).equals(x!)) ? 'non accettabile' : 'accettabile';
	} else kase = B.isZero() ? 'indeterminata' : 'impossibile';
	return { ce, order, C, L, R, A, B, case: kase, x };
}

/** The constant of the hole that makes the equation hold at s, or null (not an integer, or s does not fix it). */
function close(eqOf: (h: number) => Eq, s: Rational): number | null {
	const at = (h: number) => {
		const eq = positive(eqOf(h));
		const { order, C } = mcmOf(eq);
		const { L, R } = cleared(eq, C, order);
		return evalPoly(polySub(L, R), s);
	};
	const d0 = at(0), d1 = at(1);
	if (d1.equals(d0)) return null;
	const h = d0.neg().div(d1.sub(d0));
	return h.isInteger() ? h.num : null;
}

// ---------------------------------------------------------------------------
// LaTeX

const numLatex = (num: number[]) => polyToLatex(P(num));
const factorLatex = (r: number) => polyToLatex(P([-r, 1]));
function denLatex(d: Den): string {
	if (d.asc) return `${d.roots[0]} - x`;
	return polyToLatex(denPoly(d));
}
/** A denominator in factors: x(x - 3), (x - 2)(x + 2). */
function factoredLatex(c: number, roots: number[]): string {
	const x = roots.includes(0) ? 'x' : '';
	const rest = roots.filter((r) => r !== 0);
	const pre = c === 1 ? '' : `${c}`;
	if (!x && rest.length === 1) return pre ? `${pre}(${factorLatex(rest[0])})` : factorLatex(rest[0]);
	const body = pre + x + rest.map((r) => `(${factorLatex(r)})`).join('');
	return body === '' ? '1' : body;
}
const termLatex = (t: Term) => (isPlain(t) ? numLatex(t.num) : `\\frac{${numLatex(t.num)}}{${denLatex(t.den)}}`);
function sideLatex(ts: Term[]): string {
	if (ts.length === 0) return '0';
	return ts.map((t, i) => (i === 0 ? (t.sign < 0 ? '-' : '') : t.sign < 0 ? ' - ' : ' + ') + termLatex(t)).join('');
}

/**
 * The problem on one line. Measured with scripts/exercises/width.mts: the widest (level 6, a trinomial
 * denominator and three fractions) is about 265 px at 18 px, under the 350 px of a phone, so no problem
 * needs to go on two lines.
 */
const problemLatex = (eq: Eq) => `${sideLatex(eq.lhs)} = ${sideLatex(eq.rhs)}`;

const setLatex = (vals: string[]) => `\\left\\{ ${vals.map((v) => Rational.parse(v).toLatex()).join(', ')} \\right\\}`;

/** An answer as option values: [] = ∅, ["R"] = ℝ, ["R", ...] = ℝ minus those values, otherwise the solutions. */
function optLatex(values: string[]): string {
	if (values.length === 0) return 'S = \\emptyset';
	if (values[0] === 'R') return values.length === 1 ? 'S = \\mathbb{R}' : `S = \\mathbb{R} \\setminus ${setLatex(values.slice(1))}`;
	return `S = ${setLatex(values)}`;
}

// ---------------------------------------------------------------------------
// Steps

/** A term multiplied by the MCM, not expanded: 3x, 5(x - 2), (x - 1)(x + 3), 8. */
function productLatex(t: Term, C: number, order: number[]): string {
	const k = C / t.den.c;
	const miss = order.filter((r) => !t.den.roots.includes(r));
	const others = miss.filter((r) => r !== 0).map((r) => `(${factorLatex(r)})`).join('');
	if (nonZeroCount(t.num) === 1) {
		const deg = t.num.length - 1 + (miss.includes(0) ? 1 : 0);
		const c = k * t.num[t.num.length - 1];
		const lit = deg === 0 ? '' : deg === 1 ? 'x' : `x^${deg}`;
		if (!lit && !others) return `${c}`;
		// a lone factor with coefficient 1 needs its parentheses only after a minus: 10(x - 4) = x + 5
		const lone = miss.filter((r) => r !== 0);
		if (c === 1 && !lit && lone.length === 1 && t.sign > 0) return factorLatex(lone[0]);
		return `${c === 1 ? '' : c}${lit}${others}`;
	}
	const pre = (k === 1 ? '' : `${k}`) + (miss.includes(0) ? 'x' : '');
	if (!pre && !others) return t.sign < 0 ? `(${numLatex(t.num)})` : numLatex(t.num);
	return `${pre}(${numLatex(t.num)})${others}`;
}
function productSide(ts: Term[], C: number, order: number[]): string {
	return ts.map((t, i) => (i === 0 ? (t.sign < 0 ? '-' : '') : t.sign < 0 ? ' - ' : ' + ') + productLatex(t, C, order)).join('');
}

/** A sequence of monomials, not reduced: "2x - 4 - x - 1". */
function monoSeq(items: { c: Rational; d: number }[]): string {
	const nz = items.filter((m) => !m.c.isZero());
	if (nz.length === 0) return '0';
	return nz
		.map((m, i) => {
			const abs = m.c.abs();
			const lit = m.d === 0 ? '' : m.d === 1 ? 'x' : `x^${m.d}`;
			const body = lit ? (abs.isOne() ? lit : `${abs.toLatex()}${lit}`) : abs.toLatex();
			if (i === 0) return (m.c.sign() < 0 ? '-' : '') + body;
			return (m.c.sign() < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}
function expandedItems(ts: Term[], C: number, order: number[]): { c: Rational; d: number }[] {
	return ts.flatMap((t) => {
		const p = polyScale(polyMul(P(t.num), missing(t, C, order)), q(t.sign));
		const out: { c: Rational; d: number }[] = [];
		for (let d = p.length - 1; d >= 0; d--) if (!p[d].isZero()) out.push({ c: p[d], d });
		return out;
	});
}

function listAnd(xs: string[]): string {
	return xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} \\text{ e da } ${xs[xs.length - 1]}`;
}

function steps(eq0: Eq, s: Solved): string[] {
	const out: string[] = [];
	const all0 = [...eq0.lhs, ...eq0.rhs];
	const seen = new Set<string>();
	for (const t of all0) {
		if (t.den.roots.length < 2) continue;
		const tex = denLatex(t.den);
		if (seen.has(tex)) continue;
		seen.add(tex);
		out.push(`\\text{Scomponi il denominatore: } ${tex} = ${factoredLatex(t.den.c, t.den.roots)}`);
	}
	const eq = positive(eq0);
	const opp = all0.find((t) => t.den.c < 0);
	if (opp) {
		out.push(`${denLatex(opp.den)} = -(${factorLatex(opp.den.roots[0])})\\text{: porta il meno davanti alla frazione}`);
		out.push(`${sideLatex(eq.lhs)} = ${sideLatex(eq.rhs)}`);
	}
	out.push(`\\text{C.E.: } ${s.ce.map((r) => `x \\neq ${r}`).join(',\\ ')}`);
	out.push(`\\text{Il MCM dei denominatori è } ${factoredLatex(s.C, s.order)}`);
	const pl = productSide(eq.lhs, s.C, s.order), pr = productSide(eq.rhs, s.C, s.order);
	out.push(`\\text{Moltiplica ogni termine per il MCM: } ${pl} = ${pr}`);
	const li = expandedItems(eq.lhs, s.C, s.order), ri = expandedItems(eq.rhs, s.C, s.order);
	const exl = monoSeq(li), exr = monoSeq(ri);
	if (`${exl} = ${exr}` !== `${pl} = ${pr}`) out.push(`\\text{Svolgi i prodotti: } ${exl} = ${exr}`);
	const square = li.some((m) => m.d === 2);
	const moveX = [...li.filter((m) => m.d === 1), ...ri.filter((m) => m.d === 1).map((m) => ({ c: m.c.neg(), d: 1 }))];
	const moveC = [...ri.filter((m) => m.d === 0), ...li.filter((m) => m.d === 0).map((m) => ({ c: m.c.neg(), d: 0 }))];
	const head = square ? `\\text{Il termine } x^2 \\text{ si cancella; porta la } x \\text{ a primo membro: }` : `\\text{Porta la } x \\text{ a primo membro e i numeri a secondo: }`;
	// a line equal to the one before it is not repeated
	let last = `${exl} = ${exr}`;
	const moved = `${monoSeq(moveX)} = ${monoSeq(moveC)}`;
	if (moved !== last) out.push(`${head} ${moved}`);
	last = moved;
	const { A, B } = s;
	const ax = A.isZero() ? '0x' : A.isOne() ? 'x' : A.equals(q(-1)) ? '-x' : `${A.toLatex()}x`;
	if (`${ax} = ${B.toLatex()}` !== last) out.push(`\\text{Riduci i termini simili: } ${ax} = ${B.toLatex()}`);
	const ceTex = s.ce.map((r) => `${r}`);
	if (s.x) {
		if (!A.isOne()) out.push(`\\text{Dividi entrambi i membri per } ${A.sign() < 0 ? `(${A.toLatex()})` : A.toLatex()}\\text{: } x = ${s.x.toLatex()}`);
		if (s.case === 'accettabile') {
			out.push(`${s.x.toLatex()} \\text{ è diverso da } ${listAnd(ceTex)}\\text{: è accettabile}`);
			out.push(`S = ${setLatex([s.x.toString()])}`);
		} else {
			out.push(`${s.x.toLatex()} \\text{ è un valore escluso dalle C.E.: non è accettabile}`);
			out.push(`\\text{L'equazione è impossibile: } S = \\emptyset`);
		}
	} else if (s.case === 'impossibile') {
		out.push(`\\text{Nessun numero moltiplicato per } 0 \\text{ dà } ${B.toLatex()}\\text{: l'equazione è impossibile}`);
		out.push(`S = \\emptyset`);
	} else {
		out.push(`\\text{Ogni numero moltiplicato per } 0 \\text{ dà } 0\\text{, ma restano esclusi i valori delle C.E.}`);
		out.push(optLatex(['R', ...s.ce.map(String)]));
	}
	return out;
}

// ---------------------------------------------------------------------------
// Construction

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}
function fracSol(rng: Rng, dens: number[], maxNum = 9): Rational {
	for (;;) {
		const d = rng.pick(dens), n = nonZero(rng, -maxNum, maxNum);
		if (gcd(n, d) === 1) return q(n, d);
	}
}

interface Built {
	eq: Eq;
	/** Level 6 only: the case the construction aims at. */
	case6?: Case6;
}

/** k1/(x - a) = k2/(x - b), constant numerators (example 1). */
function level1(rng: Rng): Built | null {
	const s = rng.int(-9, 9);
	const a = rng.int(-6, 6), b = rng.int(-6, 6);
	if (a === b || s === a || s === b) return null;
	const d1 = s - a, d2 = s - b, g = gcd(d1, d2);
	const t = rng.int(1, 3) * sgn(d1);
	const k1 = (t * d1) / g, k2 = (t * d2) / g;
	if (Math.abs(k1) > 12 || Math.abs(k2) > 12) return null;
	return { eq: { lhs: [normTerm(T(1, [k1], D(1, [a])))], rhs: [normTerm(T(1, [k2], D(1, [b])))] } };
}

const L2_SOL = [1, 2, 3, 4, 5, 6].flatMap((n) => [q(n), q(-n)]).concat([q(1, 2), q(3, 2), q(5, 2), q(1, 3), q(2, 3), q(4, 3)].flatMap((r) => [r, r.neg()]));

/** n/(c x) terms and a numeric fraction (example 2). */
function level2(rng: Rng): Built | null {
	const s = rng.pick(L2_SOL);
	const xTerm = (sign: 1 | -1): Term => {
		const c = rng.pick([1, 2, 3, 4, 6]);
		for (;;) {
			const n = rng.int(1, 9);
			if (gcd(n, c) === 1) return T(sign, [n], D(c, [0]));
		}
	};
	const valueAt = (t: Term) => q(t.sign * t.num[0]).div(q(t.den.c).mul(s));
	const numTerm = (v: Rational, sign: 1 | -1 = 1): Term | null => {
		if (v.isZero() || v.den > 12 || Math.abs(v.num) > 20) return null;
		return T((sign * v.sign()) as 1 | -1, [Math.abs(v.num)], v.den === 1 ? PLAIN : D(v.den));
	};
	if (rng.next() < 0.6) {
		const t1 = xTerm(1), t2 = xTerm(rng.int(0, 1) ? 1 : -1);
		if (t1.den.c === t2.den.c) return null;
		const k = numTerm(valueAt(t1).add(valueAt(t2)));
		if (!k) return null;
		const eq: Eq = { lhs: [t1, t2], rhs: [k] };
		return { eq: rng.next() < 0.3 ? { lhs: eq.rhs, rhs: eq.lhs } : eq };
	}
	// n1/(c1 x) ± p/q = n3/(c3 x)
	const t1 = xTerm(1), t3 = xTerm(1);
	if (t1.den.c === t3.den.c) return null;
	const k = numTerm(valueAt(t3).sub(valueAt(t1)));
	if (!k) return null;
	return { eq: { lhs: [t1, k], rhs: [t3] } };
}

type Kind3 = 'differenza' | 'raccoglimento' | 'trinomio';
type Mode = 'solve' | 'impossible' | 'identity';

/**
 * n1/(x - r1) ± n2/(x - r2) = N3/((x - r1)(x - r2)), the big denominator written expanded (examples 3 and 8).
 * `sOf` gets the excluded values and returns the solution to build towards.
 */
function level3(rng: Rng, kinds: Kind3[], mode: Mode, sOf: (roots: number[]) => Rational | null): Built | null {
	const kind = rng.pick(kinds);
	let r1: number, r2: number;
	if (kind === 'differenza') {
		const a = rng.int(1, 6);
		[r1, r2] = rng.int(0, 1) ? [a, -a] : [-a, a];
	} else if (kind === 'raccoglimento') {
		[r1, r2] = [0, nonZero(rng, -6, 6)];
	} else {
		r1 = nonZero(rng, -5, 5);
		r2 = nonZero(rng, -5, 5, [r1, -r1]);
	}
	const n1 = rng.int(1, 9), n2 = rng.int(1, 9);
	const sigma: 1 | -1 = rng.int(0, 1) ? 1 : -1;
	const t1 = T(1, [n1], D(1, [r1])), t2 = T(sigma, [n2], D(1, [r2]));
	const big = D(1, [r1, r2]);
	const swap = rng.next() < 0.3;
	const make = (n3: number[]): Eq => {
		const eq = { lhs: [t1, t2], rhs: [T(1, n3, big)] };
		return swap ? { lhs: eq.rhs, rhs: eq.lhs } : eq;
	};
	let n3: number[];
	if (mode === 'identity') {
		// N3 = n1(x - r2) ± n2(x - r1): the integer equation is 0x = 0
		n3 = trim([-n1 * r2 - sigma * n2 * r1, n1 + sigma * n2]);
		if (n3.length > 1 && n3[1] < 0) return null;
	} else {
		const c3 = mode === 'impossible' ? n1 + sigma * n2 : rng.pick([0, 0, 1, 2]);
		if (c3 < 0) return null;
		let h: number | null;
		if (mode === 'impossible') h = rng.int(-20, 20);
		else {
			const s = sOf([r1, r2]);
			if (!s) return null;
			h = close((v) => make([v, c3]), s);
		}
		if (h === null) return null;
		n3 = trim([h, c3]);
	}
	if (nonZeroCount(n3) === 0) return null;
	const eq = make(n3);
	return { eq: { lhs: eq.lhs.map(normTerm), rhs: eq.rhs.map(normTerm) } };
}

type KPlace = 'rhs' | 'lhs' | 'none';

/**
 * (e x + h)/(x - a) ± n/(a - x) with a term k without denominator (examples 4 and 6); with `opposite` false
 * the second denominator is x - a too (level 6). In `identity` mode k cancels the x of the first numerator.
 */
function level4(rng: Rng, opposite: boolean, place: KPlace, mode: Mode, sOf: (a: number) => Rational): Built | null {
	const a = rng.int(1, 6);
	const e = mode === 'identity' ? rng.int(1, 2) : rng.pick([0, 1, 1, 2]);
	const n = rng.int(1, 9);
	const sigma: 1 | -1 = rng.int(0, 1) ? 1 : -1;
	const den2 = opposite ? D(-1, [a], true) : D(1, [a]);
	let k = nonZero(rng, -4, 4);
	if (mode === 'identity') {
		if (place === 'none') return null;
		k = place === 'rhs' ? e : -e;
	}
	const K = T(sgn(k), [Math.abs(k)], PLAIN);
	const make = (h: number): Eq => {
		const t1 = T(1, [h, e], D(1, [a]));
		if (place === 'rhs') return { lhs: [t1, T(sigma, [n], den2)], rhs: [K] };
		if (place === 'lhs') return { lhs: [t1, K], rhs: [T(1, [n], den2)] };
		return { lhs: [t1], rhs: [T(1, [n], den2)] };
	};
	const s = mode === 'identity' ? q(a + rng.int(1, 3)) : sOf(a);
	const h = close(make, s);
	if (h === null || Math.abs(h) > 30) return null;
	const eq = make(h);
	if (nonZeroCount(eq.lhs[0].num) === 0) return null;
	return { eq: { lhs: eq.lhs.map(normTerm), rhs: eq.rhs.map(normTerm) } };
}

/** (m x + a)/(x + b) = (m x + h)/(x + d): x^2 cancels (example 5, and example 7 when impossible). */
function level5(rng: Rng, mode: Mode, sOf: () => Rational): Built | null {
	const m = mode === 'impossible' ? 1 : rng.pick([1, 1, 1, 2]);
	const b = rng.int(-6, 6), d = rng.int(-6, 6);
	if (b === d) return null;
	const a = rng.int(-6, 6);
	const make = (h: number): Eq => ({ lhs: [T(1, [a, m], D(1, [-b]))], rhs: [T(1, [h, m], D(1, [-d]))] });
	const h = mode === 'impossible' ? a + d - b : close(make, sOf());
	if (h === null || Math.abs(h) > 9) return null;
	return { eq: make(h) };
}

const intOrFrac = (rng: Rng, pFrac: number, dens: number[]) => (rng.next() < pFrac ? fracSol(rng, dens) : q(rng.int(-9, 9)));

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng, ['differenza', 'raccoglimento'], 'solve', () => intOrFrac(rng, 0.5, [2, 3, 4, 5]));
		case 4:
			return level4(rng, true, rng.pick(['rhs', 'lhs'] as const), 'solve', () => intOrFrac(rng, 0.3, [2, 3]));
		case 5:
			return level5(rng, 'solve', () => intOrFrac(rng, 0.4, [2, 3, 4, 5]));
		case 6: {
			const u = rng.next();
			const all: Kind3[] = ['differenza', 'raccoglimento', 'trinomio'];
			let b: Built | null;
			let c: Case6;
			if (u < 0.3) {
				c = 'non accettabile';
				b =
					rng.next() < 0.5
						? level4(rng, rng.next() < 0.3, rng.pick(['rhs', 'lhs', 'none'] as const), 'solve', (a) => q(a))
						: level3(rng, all, 'solve', (roots) => q(rng.pick(roots)));
			} else if (u < 0.5) {
				c = 'impossibile';
				b = rng.next() < 0.5 ? level5(rng, 'impossible', () => q(0)) : level3(rng, all, 'impossible', () => null);
			} else if (u < 0.75) {
				c = 'indeterminata';
				b = rng.next() < 0.6 ? level3(rng, all, 'identity', () => null) : level4(rng, rng.next() < 0.3, rng.pick(['rhs', 'lhs'] as const), 'identity', () => q(0));
			} else {
				c = 'zero';
				b = rng.next() < 0.5 ? level4(rng, rng.next() < 0.3, rng.pick(['rhs', 'lhs', 'none'] as const), 'solve', () => q(0)) : level3(rng, ['differenza', 'trinomio'], 'solve', () => q(0));
			}
			return b ? { ...b, case6: c } : null;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Params

const termJSON = (t: Term) => ({ sign: String(t.sign), num: t.num.map(String), den: { c: String(t.den.c), roots: t.den.roots.map(String), asc: t.den.asc } });
function termFrom(x: unknown): Term | null {
	if (!x || typeof x !== 'object') return null;
	const o = x as { sign?: unknown; num?: unknown; den?: { c?: unknown; roots?: unknown; asc?: unknown } };
	if (!Array.isArray(o.num) || !o.den || !Array.isArray(o.den.roots)) return null;
	const sign = Number(o.sign);
	if (sign !== 1 && sign !== -1) return null;
	return T(sign, o.num.map(Number), D(Number(o.den.c), o.den.roots.map(Number), o.den.asc === true));
}
function eqFrom(p: Record<string, unknown>): Eq | null {
	if (!Array.isArray(p.lhs) || !Array.isArray(p.rhs)) return null;
	const lhs = p.lhs.map(termFrom), rhs = p.rhs.map(termFrom);
	if (lhs.some((t) => !t) || rhs.some((t) => !t)) return null;
	return { lhs: lhs as Term[], rhs: rhs as Term[] };
}

function correctValues(s: Solved): string[] {
	if (s.case === 'accettabile') return [s.x!.toString()];
	if (s.case === 'indeterminata') return ['R', ...s.ce.map(String)];
	return [];
}

function case6Of(s: Solved): Case6 {
	return s.case === 'accettabile' ? 'zero' : s.case;
}

// ---------------------------------------------------------------------------
// Multiple choice: wrong solutions from the mistakes the lesson names

/** Solution of a wrong integer equation L = R, if it is a single nice value. */
function wrongSol(L: Poly, R: Poly): Rational | null {
	const lin = linear(L, R);
	if (!lin || lin.A.isZero()) return null;
	const x = lin.B.div(lin.A);
	return x.den <= 12 && Math.abs(x.num) <= 60 ? x : null;
}

/** Wrong values in order of preference for the level. */
function mistakes(eq0: Eq, s: Solved, level: number): Rational[] {
	const eq = positive(eq0);
	const { C, order } = s;
	const out: (Rational | null)[] = [];
	const contribution = (t: Term, how: 'ok' | 'forget' | 'minus' | 'nonumber' | 'opposite') => {
		if (how === 'forget' && isPlain(t)) return polyScale(P(t.num), q(t.sign));
		const miss = how === 'nonumber' ? rootsPoly(order.filter((r) => !t.den.roots.includes(r))) : missing(t, C, order);
		const prod = polyMul(P(t.num), miss);
		if (how === 'minus' && t.sign < 0) {
			// the minus changes only the first term of the numerator: -(x + 1) written -x + 1
			const lead = polyDegree(prod);
			return prod.map((c, i) => (i === lead ? c.neg() : c));
		}
		return polyScale(prod, q(t.sign));
	};
	const wrongWith = (how: 'forget' | 'minus' | 'nonumber' | 'opposite') => {
		const src = how === 'opposite' ? { lhs: eq0.lhs.map((t) => (t.den.c < 0 ? T(t.sign, t.num, D(1, t.den.roots)) : t)), rhs: eq0.rhs.map((t) => (t.den.c < 0 ? T(t.sign, t.num, D(1, t.den.roots)) : t)) } : eq;
		const side = (ts: Term[]) => ts.reduce<Poly>((acc, t) => polyAdd(acc, contribution(t, how === 'opposite' ? 'ok' : how)), P([0]));
		return wrongSol(side(src.lhs), side(src.rhs));
	};
	const hasOpp = [...eq0.lhs, ...eq0.rhs].some((t) => t.den.c < 0);
	const hasPlain = [...eq.lhs, ...eq.rhs].some(isPlain);
	const hasMinus = [...eq.lhs, ...eq.rhs].some((t) => t.sign < 0 && nonZeroCount(polyMul(P(t.num), missing(t, C, order)).map((c) => c.num)) >= 2);
	// cross multiplication the wrong way: num_l · den_l = num_r · den_r
	const oneEach = eq.lhs.length === 1 && eq.rhs.length === 1 && !isPlain(eq.lhs[0]) && !isPlain(eq.rhs[0]);
	if (oneEach) {
		const [l, r] = [eq.lhs[0], eq.rhs[0]];
		out.push(wrongSol(polyScale(polyMul(P(l.num), denPoly(l.den)), q(l.sign)), polyScale(polyMul(P(r.num), denPoly(r.den)), q(r.sign))));
	}
	if (hasOpp) out.push(wrongWith('opposite'));
	if (hasPlain) out.push(wrongWith('forget'));
	if (hasMinus) out.push(wrongWith('minus'));
	if (level === 2) out.push(wrongWith('nonumber'));
	// constants carried across without changing sign
	const bl = coefAt(s.L, 0), br = coefAt(s.R, 0);
	if (!s.A.isZero()) out.push(br.add(bl).div(s.A));
	if (s.x) out.push(s.x.neg());
	return out.filter((v): v is Rational => !!v && v.den <= 12 && Math.abs(v.num) <= 60);
}

function shuffleOptions(rng: Rng, opts: string[][]): ChoiceAnswer {
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: optLatex(opts[i]), values: opts[i] }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

function buildChoice(eq: Eq, s: Solved, level: number, rng: Rng): ChoiceAnswer {
	const correct = correctValues(s);
	const opts: string[][] = [correct];
	const key = (v: string[]) => v.join(',');
	const seen = new Set([key(correct)]);
	const add = (v: string[] | null) => {
		if (v && opts.length < 4 && !seen.has(key(v))) {
			seen.add(key(v));
			opts.push(v);
		}
	};
	const excluded = (r: Rational) => s.ce.some((c) => q(c).equals(r));
	const one = (r: Rational | null) => (r && !excluded(r) ? [r.toString()] : null);
	const wrong = mistakes(eq, s, level);
	const ce = s.ce.map(String);
	if (s.case === 'non accettabile') {
		add([s.x!.toString()]);
		wrong.forEach((w) => add(one(w)));
		add(['R', ...ce]);
	} else if (s.case === 'impossibile') {
		add(['R', ...ce]);
		add(['R']);
		add(ce);
	} else if (s.case === 'indeterminata') {
		add(['R']);
		add([]);
		add(ce);
	} else {
		if (s.x!.isZero()) add([]);
		wrong.forEach((w) => add(one(w)));
		s.ce.forEach((r) => add([String(r)]));
		add([]);
	}
	s.ce.forEach((r) => add([String(r)]));
	const base = s.x ?? q(0);
	for (let d = 1; opts.length < 4 && d < 40; d++) {
		add(one(base.add(q(d))));
		add(one(base.sub(q(d))));
	}
	return shuffleOptions(rng, opts);
}

// ---------------------------------------------------------------------------
// Sample, checks

const PROMPT = "Risolvi l'equazione.";
const PROMPT6 = "Risolvi l'equazione e scegli l'insieme delle soluzioni.";

function assemble(b: Built, level: number, rng: Rng): Sample | null {
	const s = solve(b.eq);
	if (!s) return null;
	if (level <= 5 && s.case !== 'accettabile') return null;
	if (level === 6 && case6Of(s) !== b.case6) return null;
	if (level === 6 && b.case6 === 'zero' && !s.x?.isZero()) return null;
	const values = correctValues(s);
	const solution =
		s.case === 'accettabile'
			? optLatex(values)
			: s.case === 'non accettabile'
				? `\\text{Soluzione non accettabile: } S = \\emptyset`
				: s.case === 'impossibile'
					? `\\text{Equazione impossibile: } S = \\emptyset`
					: `\\text{Equazione indeterminata: } ${optLatex(values)}`;
	const answer: SetAnswer | ChoiceAnswer =
		level === 6 ? buildChoice(b.eq, s, level, rng) : { kind: 'set', values, latex: optLatex(values) };
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: level === 6 ? PROMPT6 : PROMPT,
		problem: problemLatex(b.eq),
		solution,
		steps: steps(b.eq, s),
		answer,
		params: {
			lhs: b.eq.lhs.map(termJSON),
			rhs: b.eq.rhs.map(termJSON),
			ce: s.ce.map(String),
			case: level === 6 ? case6Of(s) : s.case,
			solution: s.x ? s.x.toString() : s.case,
		},
	};
}

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'esponente 1', re: /\^\{?1(?!\d)/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'numeratore nullo', re: /\\frac\{0\}/ },
];

function check(sample: Sample): string[] {
	const v: string[] = [];
	const eq = eqFrom(sample.params);
	if (!eq) return ['params.lhs/params.rhs non validi'];
	const all = [...eq.lhs, ...eq.rhs];
	for (const t of all) {
		if (![...t.num, t.den.c, ...t.den.roots].every(Number.isInteger)) v.push('valori non interi');
		if (t.num.some((c) => Math.abs(c) > 30)) v.push('coefficiente del numeratore oltre 30');
		if (nonZeroCount(t.num) === 0) v.push('numeratore nullo');
		if (t.num[t.num.length - 1] <= 0) v.push('numeratore con il primo coefficiente non positivo');
		if (t.num.length > 2) v.push('numeratore di grado oltre 1');
		if (t.den.roots.some((r) => Math.abs(r) > 6)) v.push('valore escluso oltre 6');
		if (new Set(t.den.roots).size !== t.den.roots.length) v.push('fattore ripetuto nel denominatore');
		if (t.den.roots.length > 2) v.push('denominatore di grado oltre 2');
		if (t.den.c === 0 || t.den.c < -1 || t.den.c > 12) v.push('fattore numerico del denominatore fuori intervallo');
		if (t.den.asc && !(t.den.c === -1 && t.den.roots.length === 1 && t.den.roots[0] > 0)) v.push('denominatore a - x scritto male');
		if (t.den.c < 0 && !t.den.asc) v.push('denominatore negativo non scritto come a - x');
		if (isPlain(t) && nonZeroCount(t.num) !== 1) v.push('termine senza denominatore con più monomi');
		// the fraction must not simplify
		for (const r of t.den.roots) if (evalPoly(P(t.num), q(r)).isZero()) v.push('frazione semplificabile');
		if (t.den.roots.length === 0 && t.den.c > 1 && gcd(t.num.reduce((g, c) => gcd(g, c), 0), t.den.c) > 1) v.push('frazione numerica non ridotta');
		if (t.den.roots.length > 0 && t.den.c > 1 && t.num.length === 1 && gcd(t.num[0], t.den.c) > 1) v.push('frazione con fattore numerico comune');
	}
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const s = solve(eq);
	if (!s) return [...v, "l'equazione intera non è di primo grado"];
	const truth = correctValues(s);
	const lvl = sample.level;
	if (lvl <= 5) {
		const a = sample.answer;
		if (a.kind !== 'set' || a.values.join(',') !== truth.join(',') || a.universal) v.push('risposta diversa dalla soluzione');
		if (s.case !== 'accettabile') v.push('ai livelli 1-5 la soluzione deve essere accettabile');
	} else {
		const a = sample.answer;
		if (a.kind !== 'choice') v.push('al livello 6 la risposta è a scelta multipla');
		else if (a.options[a.correct]?.values.join(',') !== truth.join(',')) v.push("l'opzione giusta non è la soluzione");
		if (sample.params.case !== case6Of(s)) v.push(`caso ${String(sample.params.case)} ma l'equazione è ${case6Of(s)}`);
		if (s.case === 'accettabile' && !s.x!.isZero()) v.push('al livello 6 una soluzione accettabile deve essere 0');
	}
	const x = s.x;
	const fracs = all.filter((t) => t.den.roots.length > 0);
	switch (lvl) {
		case 1:
			if (eq.lhs.length !== 1 || eq.rhs.length !== 1 || fracs.length !== 2 || all.some((t) => t.num.length > 1 || t.den.c !== 1 || t.den.roots.length !== 1)) v.push('livello 1: k/(x - a) = h/(x - b)');
			if (!x || !x.isInteger() || Math.abs(x.num) > 9) v.push('livello 1: soluzione intera tra -9 e 9');
			break;
		case 2:
			if (all.some((t) => t.den.roots.length > 1 || (t.den.roots.length === 1 && t.den.roots[0] !== 0) || t.num.length > 1)) v.push('livello 2: denominatori monomi o numerici, numeratori numerici');
			if (new Set(fracs.map((t) => t.den.c)).size < 2) v.push('livello 2: servono due denominatori con la x diversi');
			if (!x || x.den > 3 || Math.abs(x.num) > 6) v.push('livello 2: soluzione intera o con denominatore fino a 3');
			break;
		case 3:
			if (all.filter((t) => t.den.roots.length === 2).length !== 1 || all.some((t) => t.den.c !== 1)) v.push('livello 3: un solo denominatore da scomporre');
			if (!x || x.den > 5 || Math.abs(x.num) > 9) v.push('livello 3: soluzione con denominatore fino a 5');
			break;
		case 4:
			if (!all.some((t) => t.den.c < 0) || !all.some(isPlain) || s.ce.length !== 1) v.push('livello 4: denominatori opposti e un termine senza denominatore');
			if (!x || x.den > 3 || Math.abs(x.num) > 9) v.push('livello 4: soluzione con denominatore fino a 3');
			break;
		case 5: {
			const sq = coefAt(s.L, 2);
			if (eq.lhs.length !== 1 || eq.rhs.length !== 1 || all.some((t) => t.num.length !== 2 || t.den.roots.length !== 1) || sq.isZero()) v.push('livello 5: una frazione per membro, con x^2 che si cancella');
			if (!x || x.den > 5 || Math.abs(x.num) > 9) v.push('livello 5: soluzione con denominatore fino a 5');
			break;
		}
		case 6:
			break;
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const eq = eqFrom(sample.params)!;
	return buildChoice(eq, solve(eq)!, sample.level, rng);
}

const equazioniFratte: Generator = {
	id: ID,
	title: 'Equazioni fratte',
	levels: {
		1: { label: 'Una frazione per membro', constraints: ['k/(x - a) = h/(x - b), numeratori numerici', 'soluzione intera tra -9 e 9, accettabile'] },
		2: { label: 'Denominatori monomi', constraints: ['termini n/(cx) e una frazione numerica, MCM monomio', 'soluzione intera o con denominatore 2 o 3'] },
		3: { label: 'Un denominatore da scomporre', constraints: ['x^2 - a^2 oppure x^2 - ax, gli altri due denominatori sono i suoi fattori', 'soluzione anche frazionaria'] },
		4: { label: 'Denominatori opposti', constraints: ['x - a e a - x, con un termine senza denominatore'] },
		5: { label: 'Il termine x^2 si cancella', constraints: ['(mx + a)/(x + b) = (mx + c)/(x + d)'] },
		6: { label: 'Soluzioni escluse, impossibili e indeterminate', constraints: ['3 su 10 soluzione non accettabile, 2 su 10 impossibili, 1 su 4 indeterminate, 1 su 4 soluzione 0 accettabile', 'risposta a scelta multipla'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniFratte;
