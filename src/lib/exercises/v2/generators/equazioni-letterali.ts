/**
 * Equazioni letterali. Spec: specs/exercises/equazioni-letterali.md
 *
 * Seven levels in the order of lesson 50: a numeric coefficient (no discussion); a coefficient that is a
 * monomial in the parameter (one impossible case); a binomial coefficient to collect (indeterminate or
 * impossible); a coefficient with two factors (three cases); numeric denominators and a coefficient with a
 * minus (r - a); inverse formulas; inverse formulas with numbers.
 *
 * Levels 1-5 are built backwards from the normal form A(a)·x = B(a): the factors of A, the generic solution
 * and the particular values of the parameter are chosen first, then the monomials of A·x and B are scattered
 * over the two sides (moved, split in two, with a term that cancels, collected in a bracket). The answer of
 * levels 2-5 is a whole discussion, so it is a `choice` among four discussions; level 1 is an expression,
 * level 6 a formula, level 7 a number, each with its multiple-choice variant.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { numberChoice } from '../insiemi';

export const ID = 'equazioni-letterali';
const MAX_COEF = 12;

// ---------------------------------------------------------------------------
// Polynomials in the parameter a: Rational[] indexed by power.

type P = Rational[];

const trim = (p: P): P => {
	const out = [...p];
	while (out.length && out[out.length - 1].isZero()) out.pop();
	return out;
};
const coef = (p: P, k: number) => p[k] ?? q(0);
const pAdd = (x: P, y: P): P => trim(Array.from({ length: Math.max(x.length, y.length) }, (_, k) => coef(x, k).add(coef(y, k))));
const pScale = (x: P, r: Rational): P => trim(x.map((c) => c.mul(r)));
const pSub = (x: P, y: P): P => pAdd(x, pScale(y, q(-1)));
const pMul = (x: P, y: P): P => {
	const out: Rational[] = Array.from({ length: Math.max(0, x.length + y.length - 1) }, () => q(0));
	x.forEach((c, i) => y.forEach((d, j) => (out[i + j] = out[i + j].add(c.mul(d)))));
	return trim(out);
};
const pEval = (x: P, v: Rational): Rational => x.reduceRight((acc, c) => acc.mul(v).add(c), q(0));
const pInt = (...cs: number[]): P => trim(cs.map((c) => q(c)));
/** a - r */
const lin = (r: number): P => pInt(-r, 1);
const pEq = (x: P, y: P) => pSub(x, y).length === 0;
const pDeg = (x: P) => trim(x).length - 1;
const isIntPoly = (x: P) => x.every((c) => c.isInteger());

const powTex = (k: number, v = 'a') => (k === 0 ? '' : k === 1 ? v : `${v}^${k}`);

/** Integer (or rational) polynomial in a. Descending powers; "3 - a" when the lead is negative and the constant positive. */
function polyTex(p: P): string {
	let ts = trim(p)
		.map((c, k) => ({ c, k }))
		.filter((t) => !t.c.isZero())
		.reverse();
	if (ts.length === 0) return '0';
	if (ts.length > 1 && ts[0].c.sign() < 0 && ts[ts.length - 1].c.sign() > 0) ts = [ts[ts.length - 1], ...ts.slice(0, -1)];
	return ts
		.map((t, i) => {
			const abs = t.c.abs();
			const body = t.k === 0 ? abs.toLatex() : `${abs.isOne() ? '' : abs.toLatex()}${powTex(t.k)}`;
			if (i === 0) return (t.c.sign() < 0 ? '-' : '') + body;
			return (t.c.sign() < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}

function polySympy(p: P): string {
	const ts = trim(p)
		.map((c, k) => ({ c, k }))
		.filter((t) => !t.c.isZero());
	if (!ts.length) return '0';
	return ts.map((t) => `(${t.c.toString()})${t.k ? `*a**${t.k}` : ''}`).join(' + ');
}

const numGcd = (xs: number[]) => xs.reduce((g, v) => gcd(g, Math.abs(v)), 0);

/** A rational function N/D (integer polynomials) in lowest numeric terms, as the lesson writes it. */
function fracTex(N0: P, D0: P): string {
	let N = trim(N0), D = trim(D0);
	const g = numGcd([...N, ...D].map((c) => c.num));
	if (g > 1) {
		N = pScale(N, q(1, g));
		D = pScale(D, q(1, g));
	}
	// A numerator with only minus signs turns positive, then a leading minus of the denominator goes in front.
	if (N.every((c) => c.sign() <= 0)) {
		N = pScale(N, q(-1));
		D = pScale(D, q(-1));
	}
	let neg = false;
	if (polyTex(D).startsWith('-')) {
		D = pScale(D, q(-1));
		neg = true;
	}
	if (pDeg(D) === 0 && D[0].isOne()) return polyTex(neg ? pScale(N, q(-1)) : N);
	if (N.length === 0) return '0';
	return `${neg ? '-' : ''}\\frac{${polyTex(N)}}{${polyTex(D)}}`;
}

const fracSympy = (N: P, D: P) => `(${polySympy(N)})/(${polySympy(D)})`;

// ---------------------------------------------------------------------------
// Terms of the equation: c·a^p·x^e, and brackets g·(inner).

interface Mono {
	c: Rational;
	p: number;
	x: 0 | 1;
}
interface Item {
	/** Factor in front of a bracket (integer coefficient, power of a); absent for a plain monomial. */
	g?: { c: number; p: number };
	monos: Mono[];
}

const M = (c: number | Rational, p: number, x: 0 | 1): Mono => ({ c: typeof c === 'number' ? q(c) : c, p, x });

/** The monomial without its sign, and the sign. Fractions go whole into \frac, as in the lesson (\frac{ax}{6}). */
function monoBody(m: Mono): { neg: boolean; body: string } {
	const abs = m.c.abs();
	const letters = powTex(m.p) + (m.x ? 'x' : '');
	const n = abs.num, d = abs.den;
	const top = letters ? `${n === 1 ? '' : n}${letters}` : `${n}`;
	return { neg: m.c.sign() < 0, body: d === 1 ? top : `\\frac{${top}}{${d}}` };
}

function monosTex(ms: Mono[]): string {
	if (!ms.length) return '0';
	return ms
		.map((m, i) => {
			const { neg, body } = monoBody(m);
			if (i === 0) return (neg ? '-' : '') + body;
			return (neg ? ' - ' : ' + ') + body;
		})
		.join('');
}

function sideTex(side: Item[]): string {
	if (!side.length) return '0';
	return side
		.map((it, i) => {
			let neg: boolean, body: string;
			if (it.g) {
				neg = it.g.c < 0;
				const abs = Math.abs(it.g.c);
				body = `${abs === 1 ? '' : abs}${powTex(it.g.p)}(${monosTex(it.monos)})`;
			} else ({ neg, body } = monoBody(it.monos[0]));
			if (i === 0) return (neg ? '-' : '') + body;
			return (neg ? ' - ' : ' + ') + body;
		})
		.join('');
}

/** The monomials of a side with brackets removed, in order, not reduced. */
const expandSide = (side: Item[]): Mono[] =>
	side.flatMap((it) => (it.g ? it.monos.map((m) => M(m.c.mul(q(it.g!.c)), m.p + it.g!.p, m.x)) : it.monos));

const monoSympy = (m: Mono) => `(${m.c.toString()})${m.p ? `*a**${m.p}` : ''}${m.x ? '*x' : ''}`;
const sideSympy = (side: Item[]) => {
	const ms = expandSide(side);
	return ms.length ? ms.map(monoSympy).join(' + ') : '0';
};

/** lhs - rhs = A·x - B, so A·x = B is the normal form. */
function normalForm(lhs: Item[], rhs: Item[]): { A: P; B: P } {
	let A: P = [], B: P = [];
	const put = (m: Mono, s: 1 | -1) => {
		const p: P = trim(Array.from({ length: m.p + 1 }, (_, k) => (k === m.p ? m.c.mul(q(s)) : q(0))));
		if (m.x) A = pAdd(A, p);
		else B = pSub(B, p);
	};
	expandSide(lhs).forEach((m) => put(m, 1));
	expandSide(rhs).forEach((m) => put(m, -1));
	return { A, B };
}

/** Sums like monomials of a side, drops zeros. */
function merge(ms: Mono[]): Mono[] {
	const out: Mono[] = [];
	for (const m of ms) {
		const same = out.find((o) => o.p === m.p && o.x === m.x);
		if (same) same.c = same.c.add(m.c);
		else out.push({ ...m });
	}
	return out.filter((m) => !m.c.isZero());
}

/** Order of a side: x terms first (higher power of a first), then the known terms; a known term leads with a plus sign when it can. */
function order(ms: Mono[]): Mono[] {
	const xs = ms.filter((m) => m.x).sort((a, b) => b.p - a.p);
	let cs = ms.filter((m) => !m.x).sort((a, b) => b.p - a.p);
	if (!xs.length && cs.length > 1 && cs[0].c.sign() < 0) {
		const pos = cs.findIndex((m) => m.c.sign() > 0);
		if (pos > 0) cs = [cs[pos], ...cs.filter((_, i) => i !== pos)];
	}
	return [...xs, ...cs];
}

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

interface ScatterOpts {
	/** Probability that a monomial is split over the two sides. */
	split: number;
	/** Probability that a monomial is moved to the other side. */
	move: number;
	/** Probability of a known term added to both sides (it cancels). */
	decoy: number;
	/** Probability of collecting a bracket on each side. */
	group: number;
	/** Monomials of A·x that must stay put (index = power): 'l' on the left, 'r' moved to the right. */
	fixX?: Record<number, 'l' | 'r'>;
}

/** Scatters A·x = B over two sides; null if the draw is unusable. */
function scatter(rng: Rng, A: P, B: P, o: ScatterOpts): { lhs: Item[]; rhs: Item[] } | null {
	const L: Mono[] = [], R: Mono[] = [];
	A.forEach((c, k) => {
		if (c.isZero()) return;
		const fix = o.fixX?.[k];
		const u = rng.next();
		if (fix === 'l' || (!fix && u >= o.split + o.move)) L.push(M(c, k, 1));
		else if (fix === 'r' || u >= o.split) R.push(M(c.neg(), k, 1));
		else {
			const t = q(nonZero(rng, -4, 4, [-c.num]));
			L.push(M(c.add(t), k, 1));
			R.push(M(t, k, 1));
		}
	});
	B.forEach((c, k) => {
		if (c.isZero()) return;
		const u = rng.next();
		if (u < o.split) {
			const t = q(nonZero(rng, -6, 6, [c.num]));
			R.push(M(c.sub(t), k, 0));
			L.push(M(t.neg(), k, 0));
		} else if (u < o.split + o.move) L.push(M(c.neg(), k, 0));
		else R.push(M(c, k, 0));
	});
	if (rng.next() < o.decoy) {
		const d = M(nonZero(rng, -5, 5), rng.pick([0, 1, 1]), 0);
		L.push(d);
		R.push({ ...d });
	}
	const l = order(merge(L)), r = order(merge(R));
	if (!l.length || !r.length || !l.some((m) => m.x)) return null;
	if ([...l, ...r].some((m) => Math.abs(m.c.num) > MAX_COEF)) return null;
	return { lhs: collect(rng, l, o.group), rhs: collect(rng, r, o.group) };
}

/** Optionally writes an x term and a known term with a common factor as a bracket: a(x - 1), 2(x - a). */
function collect(rng: Rng, ms: Mono[], prob: number): Item[] {
	const plain = (xs: Mono[]): Item[] => xs.map((m) => ({ monos: [m] }));
	if (rng.next() >= prob || ms.some((m) => !m.c.isInteger())) return plain(ms);
	const pairs: [number, number][] = [];
	ms.forEach((m, i) =>
		ms.forEach((n, j) => {
			if (!m.x || n.x) return;
			const g = gcd(Math.abs(m.c.num), Math.abs(n.c.num));
			if (g > 1 || Math.min(m.p, n.p) > 0) pairs.push([i, j]);
		}),
	);
	if (!pairs.length) return plain(ms);
	const [i, j] = rng.pick(pairs);
	const m = ms[i], n = ms[j];
	const gp = Math.min(m.p, n.p);
	const gc = gcd(Math.abs(m.c.num), Math.abs(n.c.num)) * (m.c.sign() < 0 ? -1 : 1);
	const inner = [M(m.c.div(q(gc)), m.p - gp, 1), M(n.c.div(q(gc)), n.p - gp, 0)];
	const rest = ms.filter((_, k) => k !== i && k !== j);
	return [{ g: { c: gc, p: gp }, monos: inner }, ...plain(rest)];
}

// ---------------------------------------------------------------------------
// Discussions

type Kind = 'imp' | 'ind' | 'det';
interface Case {
	v: number;
	kind: Kind;
	/** The single solution claimed for that value (a wrong option only). */
	val?: Rational;
}
interface Disc {
	N: P;
	D: P;
	cases: Case[];
	/** "for every a": the division done without discussing. */
	all?: boolean;
}

const S = (tex: string) => `S = \\left\\{ ${tex} \\right\\}`;
const kindTex = (c: Case) => (c.kind === 'imp' ? 'S = \\emptyset' : c.kind === 'ind' ? 'S = \\mathbb{R}' : S(c.val!.toLatex()));

function neqTex(vs: number[]): string {
	if (vs.length === 2 && vs[0] === -vs[1]) return `a \\neq \\pm ${Math.abs(vs[0])}`;
	return vs.map((v) => `a \\neq ${v}`).join(',\\ ');
}

function discTex(d: Disc): string {
	const gen = S(fracTex(d.N, d.D));
	if (d.all) return `\\text{per ogni } a\\text{: } ${gen}`;
	const cases = [...d.cases].sort((x, y) => x.v - y.v);
	const lines = [`${neqTex(cases.map((c) => c.v))}\\text{: } ${gen}`, ...cases.map((c) => `a = ${c.v}\\text{: } ${kindTex(c)}`)];
	return `\\begin{gathered} ${lines.join(' \\\\ ')} \\end{gathered}`;
}

/** The discussion as one line of prose for the solution, which the page splits at every \\text (no environments). */
function discLine(d: Disc): string {
	const cases = [...d.cases].sort((x, y) => x.v - y.v);
	const first = `\\text{per } ${neqTex(cases.map((c) => c.v))}\\text{: } ${S(fracTex(d.N, d.D))}`;
	return [first, ...cases.map((c) => `\\text{; per } a = ${c.v}\\text{: } ${kindTex(c)}`)].join(' ');
}

function discValues(d: Disc): string[] {
	const gen = `x=${fracSympy(d.N, d.D)}`;
	if (d.all) return ['per_ogni', gen];
	return [gen, ...[...d.cases].sort((x, y) => x.v - y.v).map((c) => `a=${c.v}:${c.kind}${c.kind === 'det' ? `:${c.val!.toString()}` : ''}`)];
}

/** Two discussions are the same answer when they say the same thing: same generic solution, same cases. */
function discKey(d: Disc): string {
	const pts = [q(97, 7), q(-113, 11), q(59, 13)];
	const gen = pts.map((v) => {
		const den = pEval(d.D, v);
		return den.isZero() ? 'inf' : pEval(d.N, v).div(den).toString();
	});
	if (d.all) return `all|${gen.join(',')}`;
	const cs = [...d.cases].sort((x, y) => x.v - y.v).map((c) => `${c.v}:${c.kind}:${c.val?.toString() ?? ''}`);
	return `${gen.join(',')}|${cs.join(',')}`;
}

// ---------------------------------------------------------------------------
// Levels 1-5: construction

interface Built {
	lhs: Item[];
	rhs: Item[];
	/** Truth, from the construction. */
	N: P;
	D: P;
	cases: Case[];
	/** Factored coefficient and known term, as the lesson writes them in the step "Scomponi". */
	Atex: string;
	Btex: string;
	case: string;
}

/** k·(factors), with the numeric factor in front: "(a - 2)(a + 2)", "3(a + 1)", "a(a - 3)", "-(a - 1)". */
function factorTex(k: number, roots: number[], extra?: P): string {
	const fs = roots.map((r) => (r === 0 ? 'a' : `(${polyTex(lin(r))})`));
	fs.sort((x, y) => (x === 'a' ? -1 : y === 'a' ? 1 : 0));
	if (extra) fs.push(`(${polyTex(extra)})`);
	if (fs.length === 1 && k === 1 && fs[0].startsWith('(')) return fs[0].slice(1, -1);
	const pre = k === 1 ? '' : k === -1 ? '-' : `${k}`;
	return pre + fs.join('');
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			// A a nonzero integer, x = m·a + n.
			const A = nonZero(rng, -6, 6, [1, -1]);
			const m = nonZero(rng, -5, 5), n = rng.next() < 0.4 ? 0 : nonZero(rng, -6, 6);
			const B = pInt(A * n, A * m);
			const sc = scatter(rng, pInt(A), B, { split: 0.55, move: 0.3, decoy: 0.15, group: 0.3 });
			if (!sc) return null;
			return { ...sc, N: pInt(n, m), D: pInt(1), cases: [], Atex: `${A}`, Btex: polyTex(B), case: 'determinata' };
		}
		case 2: {
			// A = c·a, B = m·a + n with n ≠ 0: impossible for a = 0.
			const c = rng.pick([1, 1, 2, 3, -1, -2]);
			const n = nonZero(rng, -9, 9), m = rng.next() < 0.5 ? 0 : nonZero(rng, -4, 4);
			const A = pInt(0, c), B = pInt(n, m);
			const sc = scatter(rng, A, B, { split: 0.3, move: 0.3, decoy: 0.5, group: 0.6, fixX: { 1: 'l' } });
			if (!sc) return null;
			return { ...sc, N: B, D: A, cases: [{ v: 0, kind: 'imp' }], Atex: polyTex(A), Btex: polyTex(B), case: 'impossibile' };
		}
		case 3: {
			// A = a - r; B = (a - r)(p·a + s) (indeterminate) or B(r) ≠ 0 (impossible).
			const r = nonZero(rng, -5, 5);
			const A = lin(r);
			const ind = rng.next() < 2 / 3;
			let B: P, N: P, D: P, Btex: string;
			if (ind) {
				const p = rng.pick([1, 1, 1, -1, 2]), s = rng.int(-5, 5);
				N = pInt(s, p);
				if (pEq(N, pInt(-r, p)) && p === 1) return null; // B = (a - r)^2 is fine, but keep the lesson's shape
				B = pMul(A, N);
				D = pInt(1);
				Btex = `(${polyTex(A)})${pDeg(N) === 0 ? polyTex(N) : `(${polyTex(N)})`}`;
				if (pDeg(N) === 1 && N[0].isZero()) Btex = `${p === 1 ? '' : p === -1 ? '-' : p}a(${polyTex(A)})`;
			} else {
				const m = rng.next() < 0.5 ? 0 : nonZero(rng, -3, 3), n = rng.int(-9, 9);
				B = pInt(n, m);
				if (pEval(B, q(r)).isZero() || B.length === 0) return null;
				N = B;
				D = A;
				Btex = polyTex(B);
			}
			const sc = scatter(rng, A, B, { split: 0.3, move: 0.4, decoy: 0.4, group: 0.6, fixX: { 1: 'l' } });
			if (!sc) return null;
			// The coefficient must be collected: x appears in at least two terms.
			const xs = [...expandSide(sc.lhs), ...expandSide(sc.rhs)].filter((mm) => mm.x);
			if (xs.length < 2) return null;
			return { ...sc, N, D, cases: [{ v: r, kind: ind ? 'ind' : 'imp' }], Atex: polyTex(A), Btex, case: ind ? 'indeterminata' : 'impossibile' };
		}
		case 4: {
			// A = (a - r1)(a - r2); B = (a - r2)·k or (a - r2)(p·a + s) with B(r1) ≠ 0: impossible at r1, indeterminate at r2.
			const r1 = rng.int(-4, 4);
			const r2 = rng.next() < 0.4 ? -r1 : rng.int(-4, 4);
			if (r1 === r2) return null;
			const A = pMul(lin(r1), lin(r2));
			let N: P, extra: P | undefined, k = 1;
			if (rng.next() < 0.7) {
				k = nonZero(rng, -4, 4);
				N = pInt(k);
			} else {
				N = pInt(rng.int(-4, 4), rng.pick([1, -1]));
				extra = N;
			}
			if (pEval(N, q(r1)).isZero()) return null;
			const B = pMul(lin(r2), N);
			const sc = scatter(rng, A, B, { split: 0.25, move: 0.4, decoy: 0.2, group: 0.3, fixX: { 2: 'l' } });
			if (!sc) return null;
			const xs = [...expandSide(sc.lhs), ...expandSide(sc.rhs)].filter((mm) => mm.x);
			if (xs.length < 2) return null;
			return {
				...sc,
				N,
				D: lin(r1),
				cases: [
					{ v: r1, kind: 'imp' },
					{ v: r2, kind: 'ind' },
				],
				Atex: factorTex(1, [r1, r2]),
				Btex: extra ? factorTex(1, [r2], extra) : factorTex(k, [r2]),
				case: 'tre casi',
			};
		}
		case 5: {
			// After multiplying by L: (r - a)·x = k·a + n with k·r + n ≠ 0; then every term divided by L.
			const L = rng.pick([4, 6, 6, 8, 10, 12]);
			const r = rng.int(1, 6);
			const k = nonZero(rng, -4, 4), n = rng.next() < 0.5 ? 0 : nonZero(rng, -6, 6);
			const B = pInt(n, k);
			if (pEval(B, q(r)).isZero()) return null;
			const A = pInt(r, -1);
			const sc = scatter(rng, A, B, { split: 0.15, move: 0.4, decoy: 0, group: 0, fixX: { 0: 'l', 1: 'r' } });
			if (!sc) return null;
			const div = (side: Item[]): Item[] => side.map((it) => ({ monos: it.monos.map((m) => M(m.c.div(q(L)), m.p, m.x)) }));
			const lhs = div(sc.lhs), rhs = div(sc.rhs);
			const dens = [...expandSide(lhs), ...expandSide(rhs)].map((m) => m.c.den);
			if (new Set(dens.filter((d) => d > 1)).size < 2) return null;
			return { lhs, rhs, N: B, D: A, cases: [{ v: r, kind: 'imp' }], Atex: polyTex(A), Btex: polyTex(B), case: n === 0 ? 'termine noto ka' : 'termine noto ka + n' };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps (levels 1-5)

const mcmOf = (lhs: Item[], rhs: Item[]) => [...expandSide(lhs), ...expandSide(rhs)].reduce((acc, m) => lcm(acc, m.c.den), 1);

function scaleSide(side: Item[], k: number): Item[] {
	return side.map((it) => ({ ...(it.g ? { g: it.g } : {}), monos: it.monos.map((m) => M(m.c.mul(q(k)), m.p, m.x)) }));
}

const t = (s: string) => `\\text{${s}}`;

/** A·x written as in the lesson: "2x", "ax", "-2ax", "(a - 2)x", "(a^2 - 1)x". */
function axTex(A: P): string {
	const nz = A.filter((c) => !c.isZero()).length;
	if (nz === 1) {
		const k = A.findIndex((c) => !c.isZero());
		const c = A[k];
		const pre = c.isOne() ? '' : c.equals(q(-1)) ? '-' : c.toLatex();
		return `${pre}${powTex(k)}x`;
	}
	return `(${polyTex(A)})x`;
}

/** True when the LaTeX is a sum at top level ("a - 2"), false for a product ("a(a - 3)", "(a - 1)(a + 1)"). */
function topLevelSum(s: string): boolean {
	let depth = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === '(') depth++;
		else if (s[i] === ')') depth--;
		else if (depth === 0 && (s[i] === '+' || s[i] === '-') && s[i - 1] === ' ') return true;
	}
	return false;
}

function steps(b: Built, level: number): string[] {
	const out: string[] = [];
	let L = b.lhs, R = b.rhs;
	const m = mcmOf(L, R);
	if (m > 1) {
		L = scaleSide(L, m);
		R = scaleSide(R, m);
		out.push(`${t('Il mcm dei denominatori è ')} ${m}${t(': moltiplica per ')} ${m} ${t(' tutti i termini')}`);
		out.push(`${sideTex(L)} = ${sideTex(R)}`);
	}
	if ([...L, ...R].some((it) => it.g)) out.push(`${t('Togli le parentesi: ')} ${monosTex(expandSide(L))} = ${monosTex(expandSide(R))}`);
	const el = expandSide(L), er = expandSide(R);
	const moveX = [...el.filter((x) => x.x), ...er.filter((x) => x.x).map((x) => M(x.c.neg(), x.p, 1))];
	const moveC = [...er.filter((x) => !x.x), ...el.filter((x) => !x.x).map((x) => M(x.c.neg(), x.p, 0))];
	const { A, B } = normalForm(L, R);
	const moved = `${monosTex(moveX)} = ${monosTex(moveC)}`;
	const normal = `${axTex(A)} = ${polyTex(B)}`;
	out.push(`${t('Porta i termini con la ')} x ${t(' a primo membro e gli altri a secondo membro: ')} ${moved}`);
	if (moved !== normal) {
		const collectX = moveX.length > 1 && pDeg(A) > 0;
		out.push(`${collectX ? `${t('Riduci e raccogli la ')} x${t(': ')}` : t('Riduci i termini simili: ')} ${normal}`);
	}
	if (level === 1) {
		const c = A[0];
		out.push(`${t('Il coefficiente di ')} x ${t(' è ')} ${c.toLatex()}${t(', diverso da zero: dividi per ')} ${c.sign() < 0 ? `(${c.toLatex()})` : c.toLatex()}${t(': ')} x = ${fracTex(b.N, b.D)}`);
		return out;
	}
	const factored = `${topLevelSum(b.Atex) ? `(${b.Atex})` : b.Atex}x = ${b.Btex}`;
	if (factored !== normal && (b.Atex !== polyTex(A) || b.Btex !== polyTex(B))) out.push(`${t('Scomponi: ')} ${factored}`);
	const roots = b.cases.map((c) => c.v).sort((x, y) => x - y);
	out.push(`${t('Il coefficiente si annulla per ')} ${roots.map((v) => `a = ${v}`).join(t(' e per '))}`);
	const simplify = pDeg(b.D) < pDeg(A);
	out.push(`${t('Se ')} ${neqTex(roots)}${t(simplify ? ', dividi e semplifica: ' : ', dividi: ')} x = ${fracTex(b.N, b.D)}`);
	for (const c of [...b.cases].sort((x, y) => x.v - y.v)) {
		const Bv = pEval(B, q(c.v));
		out.push(
			`${t('Se ')} a = ${c.v}${t(': sostituisci nella forma normale, ')} 0x = ${Bv.toLatex()}${Bv.isZero() ? `${t(', vera per ogni ')} x${t(': indeterminata')}` : t(', nessun numero la soddisfa: impossibile')}`,
		);
	}
	return out;
}

// ---------------------------------------------------------------------------
// Distractors (levels 1-5)

/** Wrong discussions from the mistakes of the lesson's warnings, in order of preference. */
function wrongDiscs(b: Built, level: number, rng: Rng): Disc[] {
	const truth: Disc = { N: b.N, D: b.D, cases: b.cases };
	const out: Disc[] = [];
	const { A, B } = normalForm(...cleared(b));
	const noDisc: Disc = { ...truth, cases: [], all: true };
	const flip = (k: Kind): Kind => (k === 'imp' ? 'ind' : 'imp');
	const wrongKind: Disc = { ...truth, cases: truth.cases.map((c) => ({ ...c, kind: flip(c.kind) })) };
	const signGen: Disc = { ...truth, N: pScale(truth.N, q(-1)) };
	const wrongRoot: Disc = { ...truth, cases: truth.cases.map((c) => ({ ...c, v: -c.v })) };
	// The known terms carried across without changing sign.
	const { L, R } = { L: expandSide(cleared(b)[0]), R: expandSide(cleared(b)[1]) };
	const polyOf = (ms: Mono[]) => ms.reduce<P>((acc, mm) => pAdd(acc, trim(Array.from({ length: mm.p + 1 }, (_, k) => (k === mm.p ? mm.c : q(0))))), []);
	const Bwrong = pAdd(polyOf(R.filter((mm) => !mm.x)), polyOf(L.filter((mm) => !mm.x)));
	const transport: Disc | null = !pEq(Bwrong, B) && Bwrong.length ? { ...truth, N: Bwrong, D: A } : null;
	// The zero of the known term taken for a particular case (warning "Cercare i casi particolari nel termine noto").
	const bRoot = pDeg(B) === 1 ? B[0].neg().div(B[1]) : null;
	const trap: Disc | null =
		bRoot && bRoot.isInteger() && !truth.cases.some((c) => c.v === bRoot.num) ? { ...truth, cases: [...truth.cases, { v: bRoot.num, kind: 'imp' }] } : null;
	switch (level) {
		case 2:
			out.push(noDisc, ...shuffled(rng, [wrongKind, signGen, ...(transport ? [transport] : []), ...(trap ? [trap] : [])]));
			break;
		case 3:
			out.push(noDisc, ...shuffled(rng, [wrongKind, wrongRoot, signGen]));
			break;
		case 4: {
			const [imp, ind] = [truth.cases.find((c) => c.kind === 'imp')!, truth.cases.find((c) => c.kind === 'ind')!];
			// Substituting in the solution instead of the normal form: a single solution for the indeterminate value.
			const atInd = pEval(truth.N, q(ind.v)).div(pEval(truth.D, q(ind.v)));
			const subs: Disc = { ...truth, cases: [imp, { v: ind.v, kind: 'det', val: atInd }] };
			const swapped: Disc = { ...truth, cases: truth.cases.map((c) => ({ ...c, kind: flip(c.kind) })) };
			const missing: Disc = { ...truth, cases: [imp] };
			const otherFactor: Disc = { ...truth, D: lin(ind.v) };
			out.push(subs, ...shuffled(rng, [swapped, missing, otherFactor, noDisc, wrongRoot]));
			break;
		}
		case 5: {
			const coefFlip: Disc = { ...truth, D: pScale(truth.D, q(-1)) };
			out.push(...(trap ? [trap] : []), ...shuffled(rng, [coefFlip, wrongKind, noDisc, ...(transport ? [transport] : [])]));
			break;
		}
	}
	// Fallback: the generic solution plus one.
	out.push({ ...truth, N: pAdd(truth.N, truth.D) }, { ...truth, N: pSub(truth.N, truth.D) });
	return out;
}

function shuffled<U>(rng: Rng, xs: U[]): U[] {
	const a = [...xs];
	for (let i = a.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** The sides after multiplying by the mcm of the denominators (unchanged without denominators). */
function cleared(b: Built): [Item[], Item[]] {
	const m = mcmOf(b.lhs, b.rhs);
	return [scaleSide(b.lhs, m), scaleSide(b.rhs, m)];
}

function discChoice(b: Built, level: number, rng: Rng): ChoiceAnswer {
	const truth: Disc = { N: b.N, D: b.D, cases: b.cases };
	const opts: Disc[] = [truth];
	const seen = new Set([discKey(truth)]);
	for (const d of wrongDiscs(b, level, rng)) {
		if (opts.length === 4) break;
		const k = discKey(d);
		if (seen.has(k) || !isIntPoly(d.N) || !isIntPoly(d.D) || trim(d.D).length === 0 || trim(d.N).length === 0) continue;
		seen.add(k);
		opts.push(d);
	}
	return assembleChoice(rng, opts.map((d) => ({ latex: discTex(d), values: discValues(d) })));
}

function assembleChoice(rng: Rng, opts: ChoiceOption[]): ChoiceAnswer {
	if (opts.length < 4) throw new Error(`${ID}: not enough distractors`);
	const order = shuffled(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Levels 1-5: sample

const itemJson = (it: Item) => ({ ...(it.g ? { g: { c: String(it.g.c), p: String(it.g.p) } } : {}), monos: it.monos.map((m) => ({ c: m.c.toString(), p: String(m.p), x: String(m.x) })) });
function parseItems(x: unknown): Item[] | null {
	if (!Array.isArray(x)) return null;
	try {
		return x.map((it: { g?: { c: string; p: string }; monos: { c: string; p: string; x: string }[] }) => ({
			...(it.g ? { g: { c: Number(it.g.c), p: Number(it.g.p) } } : {}),
			monos: it.monos.map((m) => M(Rational.parse(m.c), Number(m.p), m.x === '1' ? 1 : 0)),
		}));
	} catch {
		return null;
	}
}

const PROMPT: Record<number, string> = {
	1: "Risolvi l'equazione nell'incognita x.",
	2: "Risolvi e discuti l'equazione nell'incognita x.",
};

function assemble(b: Built, level: number, rng: Rng): Sample {
	const problem = `${sideTex(b.lhs)} = ${sideTex(b.rhs)}`;
	const params: Record<string, unknown> = {
		lhs: b.lhs.map(itemJson),
		rhs: b.rhs.map(itemJson),
		equation: `${sideSympy(b.lhs)} = ${sideSympy(b.rhs)}`,
		solution: fracSympy(b.N, b.D),
		cases: b.cases.map((c) => `${c.v}:${c.kind}`),
		case: b.case,
	};
	if (level === 1) {
		return {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: PROMPT[1],
			problem,
			solution: `x = ${fracTex(b.N, b.D)}`,
			steps: steps(b, level),
			answer: { kind: 'expression', value: polySympy(b.N), latex: fracTex(b.N, b.D) },
			params,
		};
	}
	const choice = discChoice(b, level, rng);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: PROMPT[2],
		problem,
		solution: discLine({ N: b.N, D: b.D, cases: b.cases }),
		steps: steps(b, level),
		answer: choice,
		params,
	};
}

// ---------------------------------------------------------------------------
// Levels 6-7: inverse formulas

/** Evaluates the small expressions of the bank ("(B+b)*h/2", "2*pi*r") with numbers; null on a division by zero. */
function evalExpr(src: string, vars: Record<string, number>): number | null {
	const toks = src.match(/\d+|[A-Za-z_][A-Za-z_0-9]*|[-+*/()]/g) ?? [];
	let i = 0;
	let bad = false;
	const peek = () => toks[i];
	const atom = (): number => {
		const tk = toks[i++];
		if (tk === '(') {
			const v = sum();
			i++;
			return v;
		}
		if (tk === '-') return -atom();
		if (/^\d+$/.test(tk)) return Number(tk);
		if (tk === 'pi') return Math.PI;
		if (!(tk in vars)) throw new Error(`${ID}: unknown letter ${tk} in ${src}`);
		return vars[tk];
	};
	const prod = (): number => {
		let v = atom();
		while (peek() === '*' || peek() === '/') {
			const op = toks[i++];
			const w = atom();
			if (op === '/' && w === 0) bad = true;
			v = op === '*' ? v * w : v / w;
		}
		return v;
	};
	const sum = (): number => {
		let v = prod();
		while (peek() === '+' || peek() === '-') {
			const op = toks[i++];
			const w = prod();
			v = op === '+' ? v + w : v - w;
		}
		return v;
	};
	const v = sum();
	return bad ? null : v;
}

interface Letter {
	tex: string;
	/** In the prompt, plain text. */
	name: string;
	unit?: string;
}
interface Target {
	ans: [string, string];
	wrong: [string, string][];
}
interface Formula {
	id: string;
	/** "dell'area del trapezio" */
	of: string;
	tex: string;
	lhs: string;
	rhs: string;
	letters: Record<string, Letter>;
	targets: Record<string, Target>;
	/** Values of every letter, the formula holding; absent when the formula has no numeric level (π). */
	data?: (rng: Rng) => Record<string, number> | null;
}

const U = (u: string) => `\\text{${u}}`;
const between = (rng: Rng, a: number, b: number, step = 1) => a + step * rng.int(0, Math.floor((b - a) / step));

export const FORMULAS: Formula[] = [
	{
		id: 'velocita',
		of: 'della velocità media',
		tex: 'v = \\frac{s}{t}',
		lhs: 'v',
		rhs: 's/t',
		letters: { v: { tex: 'v', name: 'v', unit: U('km/h') }, s: { tex: 's', name: 's', unit: U('km') }, t: { tex: 't', name: 't', unit: U('h') } },
		targets: {
			s: { ans: ['vt', 'v*t'], wrong: [['\\frac{v}{t}', 'v/t'], ['\\frac{t}{v}', 't/v'], ['v + t', 'v+t']] },
			t: { ans: ['\\frac{s}{v}', 's/v'], wrong: [['sv', 's*v'], ['\\frac{v}{s}', 'v/s'], ['s - v', 's-v']] },
		},
		data: (rng) => {
			const v = between(rng, 30, 120, 5), t = rng.int(2, 6);
			return { v, t, s: v * t };
		},
	},
	{
		id: 'trapezio',
		of: "dell'area del trapezio",
		tex: 'A = \\frac{(B + b)h}{2}',
		lhs: 'A',
		rhs: '(B+b)*h/2',
		letters: { A: { tex: 'A', name: 'A', unit: `${U('cm')}^2` }, B: { tex: 'B', name: 'B', unit: U('cm') }, b: { tex: 'b', name: 'b', unit: U('cm') }, h: { tex: 'h', name: 'h', unit: U('cm') } },
		targets: {
			h: { ans: ['\\frac{2A}{B + b}', '2*A/(B+b)'], wrong: [['\\frac{2A}{B} + b', '2*A/B+b'], ['\\frac{A}{B + b}', 'A/(B+b)'], ['\\frac{B + b}{2A}', '(B+b)/(2*A)']] },
			B: { ans: ['\\frac{2A}{h} - b', '2*A/h-b'], wrong: [['\\frac{2A}{h} + b', '2*A/h+b'], ['\\frac{A}{h} - b', 'A/h-b'], ['\\frac{2A - b}{h}', '(2*A-b)/h']] },
			b: { ans: ['\\frac{2A}{h} - B', '2*A/h-B'], wrong: [['\\frac{2A}{h} + B', '2*A/h+B'], ['\\frac{A}{h} - B', 'A/h-B'], ['\\frac{2A - B}{h}', '(2*A-B)/h']] },
		},
		data: (rng) => {
			const B = rng.int(6, 20), b = rng.int(2, B - 1), h = rng.int(2, 12);
			return ((B + b) * h) % 2 ? null : { B, b, h, A: ((B + b) * h) / 2 };
		},
	},
	{
		id: 'moto',
		of: 'del moto a velocità costante',
		tex: 's = s_0 + vt',
		lhs: 's',
		rhs: 's0+v*t',
		letters: { s: { tex: 's', name: 's', unit: U('km') }, s0: { tex: 's_0', name: 's₀', unit: U('km') }, v: { tex: 'v', name: 'v', unit: U('km/h') }, t: { tex: 't', name: 't', unit: U('h') } },
		targets: {
			t: { ans: ['\\frac{s - s_0}{v}', '(s-s0)/v'], wrong: [['\\frac{s + s_0}{v}', '(s+s0)/v'], ['\\frac{s}{v} - s_0', 's/v-s0'], ['\\frac{v}{s - s_0}', 'v/(s-s0)']] },
			v: { ans: ['\\frac{s - s_0}{t}', '(s-s0)/t'], wrong: [['\\frac{s + s_0}{t}', '(s+s0)/t'], ['\\frac{s}{t} - s_0', 's/t-s0'], ['\\frac{t}{s - s_0}', 't/(s-s0)']] },
			s0: { ans: ['s - vt', 's-v*t'], wrong: [['s + vt', 's+v*t'], ['vt - s', 'v*t-s'], ['\\frac{s}{vt}', 's/(v*t)']] },
		},
		data: (rng) => {
			const s0 = between(rng, 10, 60, 5), v = between(rng, 40, 110, 10), t = rng.int(2, 5);
			return { s0, v, t, s: s0 + v * t };
		},
	},
	{
		id: 'triangolo',
		of: "dell'area del triangolo",
		tex: 'A = \\frac{bh}{2}',
		lhs: 'A',
		rhs: 'b*h/2',
		letters: { A: { tex: 'A', name: 'A', unit: `${U('cm')}^2` }, b: { tex: 'b', name: 'b', unit: U('cm') }, h: { tex: 'h', name: 'h', unit: U('cm') } },
		targets: {
			b: { ans: ['\\frac{2A}{h}', '2*A/h'], wrong: [['\\frac{A}{h}', 'A/h'], ['\\frac{h}{2A}', 'h/(2*A)'], ['2Ah', '2*A*h']] },
			h: { ans: ['\\frac{2A}{b}', '2*A/b'], wrong: [['\\frac{A}{b}', 'A/b'], ['\\frac{b}{2A}', 'b/(2*A)'], ['2Ab', '2*A*b']] },
		},
		data: (rng) => {
			const b = rng.int(3, 20), h = rng.int(3, 20);
			return (b * h) % 2 ? null : { b, h, A: (b * h) / 2 };
		},
	},
	{
		id: 'rettangolo',
		of: 'del perimetro del rettangolo',
		tex: 'P = 2(b + h)',
		lhs: 'P',
		rhs: '2*(b+h)',
		letters: { P: { tex: 'P', name: 'P', unit: U('cm') }, b: { tex: 'b', name: 'b', unit: U('cm') }, h: { tex: 'h', name: 'h', unit: U('cm') } },
		targets: {
			b: { ans: ['\\frac{P}{2} - h', 'P/2-h'], wrong: [['\\frac{P}{2} + h', 'P/2+h'], ['P - h', 'P-h'], ['\\frac{P - h}{2}', '(P-h)/2']] },
			h: { ans: ['\\frac{P}{2} - b', 'P/2-b'], wrong: [['\\frac{P}{2} + b', 'P/2+b'], ['P - b', 'P-b'], ['\\frac{P - b}{2}', '(P-b)/2']] },
		},
		data: (rng) => {
			const b = rng.int(3, 30), h = rng.int(3, 30);
			return b === h ? null : { b, h, P: 2 * (b + h) };
		},
	},
	{
		id: 'forza',
		of: 'del secondo principio della dinamica',
		tex: 'F = ma',
		lhs: 'F',
		rhs: 'm*a',
		letters: { F: { tex: 'F', name: 'F', unit: U('N') }, m: { tex: 'm', name: 'm', unit: U('kg') }, a: { tex: 'a', name: 'a', unit: `${U('m/s')}^2` } },
		targets: {
			m: { ans: ['\\frac{F}{a}', 'F/a'], wrong: [['Fa', 'F*a'], ['\\frac{a}{F}', 'a/F'], ['F - a', 'F-a']] },
			a: { ans: ['\\frac{F}{m}', 'F/m'], wrong: [['Fm', 'F*m'], ['\\frac{m}{F}', 'm/F'], ['F - m', 'F-m']] },
		},
		data: (rng) => {
			const m = rng.int(2, 25), a = rng.int(2, 9);
			return m === a ? null : { m, a, F: m * a };
		},
	},
	{
		id: 'densita',
		of: 'della densità',
		tex: 'd = \\frac{m}{V}',
		lhs: 'd',
		rhs: 'm/V',
		letters: { d: { tex: 'd', name: 'd', unit: `${U('g/cm')}^3` }, m: { tex: 'm', name: 'm', unit: U('g') }, V: { tex: 'V', name: 'V', unit: `${U('cm')}^3` } },
		targets: {
			m: { ans: ['dV', 'd*V'], wrong: [['\\frac{d}{V}', 'd/V'], ['\\frac{V}{d}', 'V/d'], ['d + V', 'd+V']] },
			V: { ans: ['\\frac{m}{d}', 'm/d'], wrong: [['md', 'm*d'], ['\\frac{d}{m}', 'd/m'], ['m - d', 'm-d']] },
		},
		data: (rng) => {
			const d = rng.int(2, 11), V = rng.int(3, 40);
			return { d, V, m: d * V };
		},
	},
	{
		id: 'accelerato',
		of: 'della velocità nel moto accelerato',
		tex: 'v = v_0 + at',
		lhs: 'v',
		rhs: 'v0+a*t',
		letters: { v: { tex: 'v', name: 'v', unit: U('m/s') }, v0: { tex: 'v_0', name: 'v₀', unit: U('m/s') }, a: { tex: 'a', name: 'a', unit: `${U('m/s')}^2` }, t: { tex: 't', name: 't', unit: U('s') } },
		targets: {
			a: { ans: ['\\frac{v - v_0}{t}', '(v-v0)/t'], wrong: [['\\frac{v + v_0}{t}', '(v+v0)/t'], ['\\frac{v}{t} - v_0', 'v/t-v0'], ['\\frac{t}{v - v_0}', 't/(v-v0)']] },
			t: { ans: ['\\frac{v - v_0}{a}', '(v-v0)/a'], wrong: [['\\frac{v + v_0}{a}', '(v+v0)/a'], ['\\frac{v}{a} - v_0', 'v/a-v0'], ['\\frac{a}{v - v_0}', 'a/(v-v0)']] },
			v0: { ans: ['v - at', 'v-a*t'], wrong: [['v + at', 'v+a*t'], ['at - v', 'a*t-v'], ['\\frac{v}{at}', 'v/(a*t)']] },
		},
		data: (rng) => {
			const v0 = rng.int(2, 20), a = rng.int(2, 5), t = rng.int(2, 10);
			return { v0, a, t, v: v0 + a * t };
		},
	},
	{
		id: 'rombo',
		of: "dell'area del rombo",
		tex: 'A = \\frac{Dd}{2}',
		lhs: 'A',
		rhs: 'D*d/2',
		letters: { A: { tex: 'A', name: 'A', unit: `${U('cm')}^2` }, D: { tex: 'D', name: 'D', unit: U('cm') }, d: { tex: 'd', name: 'd', unit: U('cm') } },
		targets: {
			D: { ans: ['\\frac{2A}{d}', '2*A/d'], wrong: [['\\frac{A}{d}', 'A/d'], ['\\frac{d}{2A}', 'd/(2*A)'], ['2Ad', '2*A*d']] },
			d: { ans: ['\\frac{2A}{D}', '2*A/D'], wrong: [['\\frac{A}{D}', 'A/D'], ['\\frac{D}{2A}', 'D/(2*A)'], ['2AD', '2*A*D']] },
		},
		data: (rng) => {
			const D = rng.int(5, 30), d = rng.int(2, D - 1);
			return (D * d) % 2 ? null : { D, d, A: (D * d) / 2 };
		},
	},
	{
		id: 'potenza',
		of: 'della potenza',
		tex: 'P = \\frac{L}{t}',
		lhs: 'P',
		rhs: 'L/t',
		letters: { P: { tex: 'P', name: 'P', unit: U('W') }, L: { tex: 'L', name: 'L', unit: U('J') }, t: { tex: 't', name: 't', unit: U('s') } },
		targets: {
			L: { ans: ['Pt', 'P*t'], wrong: [['\\frac{P}{t}', 'P/t'], ['\\frac{t}{P}', 't/P'], ['P + t', 'P+t']] },
			t: { ans: ['\\frac{L}{P}', 'L/P'], wrong: [['LP', 'L*P'], ['\\frac{P}{L}', 'P/L'], ['L - P', 'L-P']] },
		},
		data: (rng) => {
			const P = between(rng, 20, 300, 10), t = rng.int(2, 30);
			return { P, t, L: P * t };
		},
	},
	{
		id: 'media',
		of: 'della media di due numeri',
		tex: 'M = \\frac{a + b}{2}',
		lhs: 'M',
		rhs: '(a+b)/2',
		letters: { M: { tex: 'M', name: 'M' }, a: { tex: 'a', name: 'a' }, b: { tex: 'b', name: 'b' } },
		targets: {
			a: { ans: ['2M - b', '2*M-b'], wrong: [['2M + b', '2*M+b'], ['M - b', 'M-b'], ['\\frac{M - b}{2}', '(M-b)/2']] },
			b: { ans: ['2M - a', '2*M-a'], wrong: [['2M + a', '2*M+a'], ['M - a', 'M-a'], ['\\frac{M - a}{2}', '(M-a)/2']] },
		},
		data: (rng) => {
			const a = rng.int(2, 40), b = rng.int(2, 40);
			return (a + b) % 2 || a === b ? null : { a, b, M: (a + b) / 2 };
		},
	},
	{
		id: 'isoscele',
		of: 'del perimetro del triangolo isoscele',
		tex: 'P = 2l + b',
		lhs: 'P',
		rhs: '2*l+b',
		letters: { P: { tex: 'P', name: 'P', unit: U('cm') }, l: { tex: 'l', name: 'l', unit: U('cm') }, b: { tex: 'b', name: 'b', unit: U('cm') } },
		targets: {
			l: { ans: ['\\frac{P - b}{2}', '(P-b)/2'], wrong: [['\\frac{P}{2} - b', 'P/2-b'], ['\\frac{P + b}{2}', '(P+b)/2'], ['2(P - b)', '2*(P-b)']] },
			b: { ans: ['P - 2l', 'P-2*l'], wrong: [['P + 2l', 'P+2*l'], ['\\frac{P}{2} - l', 'P/2-l'], ['2l - P', '2*l-P']] },
		},
		data: (rng) => {
			const l = rng.int(4, 25), b = rng.int(2, 2 * l - 1);
			return b === l ? null : { l, b, P: 2 * l + b };
		},
	},
	{
		id: 'pressione',
		of: 'della pressione',
		tex: 'p = \\frac{F}{S}',
		lhs: 'p',
		rhs: 'F/S',
		letters: { p: { tex: 'p', name: 'p', unit: U('Pa') }, F: { tex: 'F', name: 'F', unit: U('N') }, S: { tex: 'S', name: 'S', unit: `${U('m')}^2` } },
		targets: {
			F: { ans: ['pS', 'p*S'], wrong: [['\\frac{p}{S}', 'p/S'], ['\\frac{S}{p}', 'S/p'], ['p + S', 'p+S']] },
			S: { ans: ['\\frac{F}{p}', 'F/p'], wrong: [['Fp', 'F*p'], ['\\frac{p}{F}', 'p/F'], ['F - p', 'F-p']] },
		},
		data: (rng) => {
			const p = between(rng, 50, 900, 50), S = rng.int(2, 8);
			return { p, S, F: p * S };
		},
	},
	{
		id: 'circonferenza',
		of: 'della lunghezza della circonferenza',
		tex: 'C = 2\\pi r',
		lhs: 'C',
		rhs: '2*pi*r',
		letters: { C: { tex: 'C', name: 'C' }, r: { tex: 'r', name: 'r' } },
		targets: {
			r: { ans: ['\\frac{C}{2\\pi}', 'C/(2*pi)'], wrong: [['2\\pi C', '2*pi*C'], ['\\frac{2\\pi}{C}', '2*pi/C'], ['C - 2\\pi', 'C-2*pi']] },
		},
	},
	{
		id: 'temperatura',
		of: 'dai gradi Celsius ai gradi Fahrenheit',
		tex: 'F = \\frac{9}{5}C + 32',
		lhs: 'F',
		rhs: '9*C/5+32',
		letters: { F: { tex: 'F', name: 'F', unit: '^\\circ\\text{F}' }, C: { tex: 'C', name: 'C', unit: '^\\circ\\text{C}' } },
		targets: {
			C: { ans: ['\\frac{5(F - 32)}{9}', '5*(F-32)/9'], wrong: [['\\frac{5F}{9} - 32', '5*F/9-32'], ['\\frac{9(F - 32)}{5}', '9*(F-32)/5'], ['\\frac{5(F + 32)}{9}', '5*(F+32)/9']] },
		},
		data: (rng) => {
			const C = between(rng, 5, 100, 5);
			return { C, F: (9 * C) / 5 + 32 };
		},
	},
	{
		id: 'interesse',
		of: "dell'interesse semplice",
		tex: 'I = \\frac{Crt}{100}',
		lhs: 'I',
		rhs: 'C*r*t/100',
		letters: { I: { tex: 'I', name: 'I', unit: U('euro') }, C: { tex: 'C', name: 'C', unit: U('euro') }, r: { tex: 'r', name: 'r' }, t: { tex: 't', name: 't', unit: U('anni') } },
		targets: {
			C: { ans: ['\\frac{100I}{rt}', '100*I/(r*t)'], wrong: [['\\frac{I}{100rt}', 'I/(100*r*t)'], ['\\frac{Irt}{100}', 'I*r*t/100'], ['100I - rt', '100*I-r*t']] },
			t: { ans: ['\\frac{100I}{Cr}', '100*I/(C*r)'], wrong: [['\\frac{I}{100Cr}', 'I/(100*C*r)'], ['\\frac{ICr}{100}', 'I*C*r/100'], ['100I - Cr', '100*I-C*r']] },
		},
		data: (rng) => {
			const C = between(rng, 200, 5000, 100), r = rng.int(1, 8), t = rng.int(2, 6);
			return { C, r, t, I: (C * r * t) / 100 };
		},
	},
	{
		id: 'parallelepipedo',
		of: 'del volume del parallelepipedo',
		tex: 'V = abc',
		lhs: 'V',
		rhs: 'a*b*c',
		letters: { V: { tex: 'V', name: 'V', unit: `${U('cm')}^3` }, a: { tex: 'a', name: 'a', unit: U('cm') }, b: { tex: 'b', name: 'b', unit: U('cm') }, c: { tex: 'c', name: 'c', unit: U('cm') } },
		targets: {
			c: { ans: ['\\frac{V}{ab}', 'V/(a*b)'], wrong: [['Vab', 'V*a*b'], ['\\frac{ab}{V}', 'a*b/V'], ['V - ab', 'V-a*b']] },
			a: { ans: ['\\frac{V}{bc}', 'V/(b*c)'], wrong: [['Vbc', 'V*b*c'], ['\\frac{bc}{V}', 'b*c/V'], ['V - bc', 'V-b*c']] },
		},
		data: (rng) => {
			const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(2, 12);
			return { a, b, c, V: a * b * c };
		},
	},
];

/** The letter to find, with its name, for the prompt. */
const TARGET_NAMES: Record<string, string> = {
	'velocita/s': 'lo spazio s',
	'velocita/t': 'il tempo t',
	'trapezio/h': "l'altezza h",
	'trapezio/B': 'la base maggiore B',
	'trapezio/b': 'la base minore b',
	'moto/t': 'il tempo t',
	'moto/v': 'la velocità v',
	'moto/s0': 'la posizione iniziale s₀',
	'triangolo/b': 'la base b',
	'triangolo/h': "l'altezza h",
	'rettangolo/b': 'la base b',
	'rettangolo/h': "l'altezza h",
	'forza/m': 'la massa m',
	'forza/a': "l'accelerazione a",
	'densita/m': 'la massa m',
	'densita/V': 'il volume V',
	'accelerato/a': "l'accelerazione a",
	'accelerato/t': 'il tempo t',
	'accelerato/v0': 'la velocità iniziale v₀',
	'rombo/D': 'la diagonale maggiore D',
	'rombo/d': 'la diagonale minore d',
	'potenza/L': 'il lavoro L',
	'potenza/t': 'il tempo t',
	'media/a': 'il numero a',
	'media/b': 'il numero b',
	'isoscele/l': 'il lato obliquo l',
	'isoscele/b': 'la base b',
	'pressione/F': 'la forza F',
	'pressione/S': 'la superficie S',
	'circonferenza/r': 'il raggio r',
	'temperatura/C': 'la temperatura C in gradi Celsius',
	'interesse/C': 'il capitale C',
	'interesse/t': 'il tempo t, in anni,',
	'parallelepipedo/c': 'lo spigolo c',
	'parallelepipedo/a': 'lo spigolo a',
};
const targetName = (f: Formula, tg: string) => {
	const n = TARGET_NAMES[`${f.id}/${tg}`];
	if (!n) throw new Error(`${ID}: no name for ${f.id}/${tg}`);
	return n;
};

const TARGETS = FORMULAS.flatMap((f) => Object.keys(f.targets).map((tg) => ({ f, tg })));
const NUMERIC_TARGETS = TARGETS.filter(({ f }) => f.data);

function formulaSample(rng: Rng): Sample {
	const { f, tg } = rng.pick(TARGETS);
	const T = f.targets[tg];
	const L = f.letters[tg];
	const opts: ChoiceOption[] = [T.ans, ...shuffled(rng, T.wrong)].slice(0, 4).map(([tex, sym]) => ({ latex: `${L.tex} = ${tex}`, values: [sym] }));
	const choice = assembleChoice(rng, opts);
	return {
		generatorId: ID,
		level: 6,
		seed: rng.seed,
		prompt: `Ricava ${targetName(f, tg)} dalla formula ${f.of}.`,
		problem: f.tex,
		solution: `${L.tex} = ${T.ans[0]}`,
		steps: formulaSteps(f, tg),
		answer: { kind: 'expression', value: T.ans[1], latex: `${L.tex} = ${T.ans[0]}` },
		choice,
		params: { formula: f.id, lhs: f.lhs, rhs: f.rhs, target: tg, case: f.id },
	};
}

/** The steps of each inverse formula, as in examples 6-8 of the lesson. */
function formulaSteps(f: Formula, tg: string): string[] {
	const L = f.letters[tg].tex;
	const ans = `${L} = ${f.targets[tg].ans[0]}`;
	const custom: Record<string, string[]> = {
		'velocita/s': [`${t('Moltiplica entrambi i membri per ')} t${t(': ')} vt = s`],
		'velocita/t': [`${t('Moltiplica per ')} t${t(': ')} vt = s`, `${t('Dividi entrambi i membri per ')} v`],
		'trapezio/h': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2A = (B + b)h`, `${t('Dividi per tutta la somma ')} B + b`],
		'trapezio/B': [`${t('Moltiplica per ')} 2 ${t(' e dividi per ')} h${t(': ')} \\frac{2A}{h} = B + b`, `${t('Porta ')} b ${t(' a primo membro, cambiandogli il segno')}`],
		'trapezio/b': [`${t('Moltiplica per ')} 2 ${t(' e dividi per ')} h${t(': ')} \\frac{2A}{h} = B + b`, `${t('Porta ')} B ${t(' a primo membro, cambiandogli il segno')}`],
		'moto/t': [`${t('Porta ')} s_0 ${t(' a primo membro: ')} s - s_0 = vt`, `${t('Dividi entrambi i membri per ')} v`],
		'moto/v': [`${t('Porta ')} s_0 ${t(' a primo membro: ')} s - s_0 = vt`, `${t('Dividi entrambi i membri per ')} t`],
		'moto/s0': [`${t('Porta ')} vt ${t(' a primo membro, cambiandogli il segno')}`],
		'accelerato/a': [`${t('Porta ')} v_0 ${t(' a primo membro: ')} v - v_0 = at`, `${t('Dividi entrambi i membri per ')} t`],
		'accelerato/t': [`${t('Porta ')} v_0 ${t(' a primo membro: ')} v - v_0 = at`, `${t('Dividi entrambi i membri per ')} a`],
		'accelerato/v0': [`${t('Porta ')} at ${t(' a primo membro, cambiandogli il segno')}`],
		'rettangolo/b': [`${t('Dividi entrambi i membri per ')} 2${t(': ')} \\frac{P}{2} = b + h`, `${t('Porta ')} h ${t(' a primo membro, cambiandogli il segno')}`],
		'rettangolo/h': [`${t('Dividi entrambi i membri per ')} 2${t(': ')} \\frac{P}{2} = b + h`, `${t('Porta ')} b ${t(' a primo membro, cambiandogli il segno')}`],
		'media/a': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2M = a + b`, `${t('Porta ')} b ${t(' a primo membro, cambiandogli il segno')}`],
		'media/b': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2M = a + b`, `${t('Porta ')} a ${t(' a primo membro, cambiandogli il segno')}`],
		'isoscele/l': [`${t('Porta ')} b ${t(' a primo membro: ')} P - b = 2l`, `${t('Dividi entrambi i membri per ')} 2`],
		'isoscele/b': [`${t('Porta ')} 2l ${t(' a primo membro, cambiandogli il segno')}`],
		'temperatura/C': [`${t('Porta ')} 32 ${t(' a primo membro: ')} F - 32 = \\frac{9}{5}C`, `${t('Moltiplica entrambi i membri per ')} \\frac{5}{9}`],
		'interesse/C': [`${t('Moltiplica entrambi i membri per ')} 100${t(': ')} 100I = Crt`, `${t('Dividi entrambi i membri per ')} rt`],
		'triangolo/b': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2A = bh`, `${t('Dividi entrambi i membri per ')} h`],
		'triangolo/h': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2A = bh`, `${t('Dividi entrambi i membri per ')} b`],
		'rombo/D': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2A = Dd`, `${t('Dividi entrambi i membri per ')} d`],
		'rombo/d': [`${t('Moltiplica entrambi i membri per ')} 2${t(': ')} 2A = Dd`, `${t('Dividi entrambi i membri per ')} D`],
		'forza/m': [`${t('Dividi entrambi i membri per ')} a`],
		'forza/a': [`${t('Dividi entrambi i membri per ')} m`],
		'densita/m': [`${t('Moltiplica entrambi i membri per ')} V`],
		'densita/V': [`${t('Moltiplica per ')} V${t(': ')} dV = m`, `${t('Dividi entrambi i membri per ')} d`],
		'potenza/L': [`${t('Moltiplica entrambi i membri per ')} t`],
		'potenza/t': [`${t('Moltiplica per ')} t${t(': ')} Pt = L`, `${t('Dividi entrambi i membri per ')} P`],
		'pressione/F': [`${t('Moltiplica entrambi i membri per ')} S`],
		'pressione/S': [`${t('Moltiplica per ')} S${t(': ')} pS = F`, `${t('Dividi entrambi i membri per ')} p`],
		'circonferenza/r': [`${t('Dividi entrambi i membri per ')} 2\\pi`],
		'parallelepipedo/c': [`${t('Dividi entrambi i membri per ')} ab`],
		'parallelepipedo/a': [`${t('Dividi entrambi i membri per ')} bc`],
		'interesse/t': [`${t('Moltiplica entrambi i membri per ')} 100${t(': ')} 100I = Crt`, `${t('Dividi entrambi i membri per ')} Cr`],
	};
	const key = `${f.id}/${tg}`;
	if (!custom[key]) throw new Error(`${ID}: no steps for ${key}`);
	return [...custom[key], ans];
}

function numericSample(rng: Rng): Sample | null {
	const { f, tg } = rng.pick(NUMERIC_TARGETS);
	const vals = f.data!(rng);
	if (!vals) return null;
	const T = f.targets[tg];
	const L = f.letters[tg];
	const answer = vals[tg];
	if (!Number.isInteger(answer) || answer <= 0) return null;
	const given = Object.keys(f.letters).filter((k) => k !== tg);
	if (given.some((k) => vals[k] === answer)) return null;
	const unit = (k: string) => (f.letters[k].unit ? (f.letters[k].unit!.startsWith('^') ? f.letters[k].unit! : `\\ ${f.letters[k].unit}`) : '');
	const givens = given.map((k) => `${f.letters[k].tex} = ${vals[k]}${unit(k)}`).join(' \\quad ');
	const mistakes = T.wrong.map(([, sym]) => evalExpr(sym, vals)).filter((v): v is number => v !== null && Number.isInteger(v) && v > 0 && v !== answer);
	const choice = numberChoice(rng, answer, mistakes);
	const inverse = `${L.tex} = ${T.ans[0]}`;
	const sub = T.ans[1].replace(/[A-Za-z_][A-Za-z_0-9]*/g, (name) => (name === 'pi' ? '\\pi' : String(vals[name])));
	return {
		generatorId: ID,
		level: 7,
		seed: rng.seed,
		prompt: `Ricava ${targetName(f, tg)} dalla formula ${f.of} e calcola il suo valore.`,
		problem: `\\begin{array}{l} ${f.tex} \\\\ ${givens} \\end{array}`,
		solution: `${L.tex} = ${answer}${unit(tg)}`,
		steps: [...formulaSteps(f, tg).slice(0, -1), inverse, `${t('Sostituisci i dati: ')} ${L.tex} = ${substTex(T.ans[0], f, vals)} = ${answer}${unit(tg)}`],
		answer: { kind: 'number', value: String(answer) },
		choice,
		params: { formula: f.id, lhs: f.lhs, rhs: f.rhs, target: tg, inverse: T.ans[1], substituted: sub, data: Object.fromEntries(given.map((k) => [k, String(vals[k])])), case: f.id },
	};
}

/** The inverse formula with the numbers in place of the letters: \frac{2 \cdot 24}{4} - 5. */
function substTex(tex: string, f: Formula, vals: Record<string, number>): string {
	const names = Object.keys(f.letters).sort((x, y) => f.letters[y].tex.length - f.letters[x].tex.length);
	const parts: { s: string; num: boolean }[] = [];
	const push = (str: string, num: boolean) => {
		const last = parts[parts.length - 1];
		if (!num && last && !last.num) last.s += str;
		else parts.push({ s: str, num });
	};
	for (let i = 0; i < tex.length; ) {
		const cmd = /^\\[a-zA-Z]+/.exec(tex.slice(i));
		if (cmd) {
			push(cmd[0], false);
			i += cmd[0].length;
			continue;
		}
		const name = names.find((n) => tex.startsWith(f.letters[n].tex, i));
		if (name) {
			push(String(vals[name]), true);
			i += f.letters[name].tex.length;
		} else push(tex[i++], false);
	}
	// Juxtaposed factors get a \cdot: 2A, vt, 5(F - 32) stay readable with numbers.
	let out = '';
	parts.forEach((p, i) => {
		const prev = parts[i - 1];
		if (p.num && prev && (prev.num || /[\d)]$/.test(prev.s))) out += ' \\cdot ';
		else if (!p.num && prev?.num && /^[(\d]/.test(p.s)) out += ' \\cdot ';
		out += p.s;
	});
	return out;
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (sample.level >= 6) {
		const f = FORMULAS.find((x) => x.id === p.formula);
		if (!f || !f.targets[String(p.target)]) return ['formula o lettera sconosciuta'];
		const T = f.targets[String(p.target)];
		if (sample.level === 6) {
			if (sample.answer.kind !== 'expression' || sample.answer.value !== T.ans[1]) v.push('risposta diversa dalla formula inversa');
			const ch = sample.choice;
			if (!ch || ch.options.length !== 4 || ch.options[ch.correct].values[0] !== T.ans[1]) v.push('scelta multipla sbagliata');
		} else {
			const data = Object.fromEntries(Object.entries(p.data as Record<string, string>).map(([k, x]) => [k, Number(x)]));
			const ans = sample.answer.kind === 'number' ? Number(sample.answer.value) : NaN;
			const lhs = evalExpr(f.lhs, { ...data, [String(p.target)]: ans }), rhs = evalExpr(f.rhs, { ...data, [String(p.target)]: ans });
			if (lhs === null || rhs === null || Math.abs(lhs - rhs) > 1e-9) v.push('il valore non soddisfa la formula');
			if (!Number.isInteger(ans) || ans <= 0) v.push('risposta non intera positiva');
		}
		// Every formula option must really be the inverse formula or not: checked on numbers.
		for (const [tex, sym] of T.wrong) {
			const pts = [{ ...Object.fromEntries(Object.keys(f.letters).map((k, i) => [k, 3 + 2 * i])) }];
			const truth = evalExpr(T.ans[1], pts[0]), wrong = evalExpr(sym, pts[0]);
			if (truth !== null && wrong !== null && Math.abs(truth - wrong) < 1e-9) v.push(`distrattore uguale alla risposta: ${tex}`);
		}
		return v;
	}
	const lhs = parseItems(p.lhs), rhs = parseItems(p.rhs);
	if (!lhs || !rhs) return ['params.lhs/params.rhs non validi'];
	const { A, B } = normalForm(...clearedItems(lhs, rhs));
	const all = [...expandSide(lhs), ...expandSide(rhs)];
	if (all.some((m) => Math.abs(m.c.num) > MAX_COEF || m.c.den > 12)) v.push('coefficiente troppo grande');
	if (!all.some((m) => m.x)) v.push('manca la x');
	// Readable on a phone: at most 7 terms and 25 visible characters (350 px at 18 px).
	if (lhs.length + rhs.length > 7) v.push('più di 7 termini');
	if (visibleLength(sample.problem) > 25) v.push(`problema troppo lungo: ${sample.problem}`);
	if (!expandSide(rhs).some((m) => m.x) && !expandSide(lhs).some((m) => !m.x)) v.push('già in forma normale: niente da spostare');
	if (/(?<![\d}])1\s*[a-z(]|\+\s*-|-\s*-|\+\s*\+|\^\{?[01]\}?(?!\d)|[+-]\s*0(?!\d)/.test(sample.problem)) v.push(`scrittura vietata: ${sample.problem}`);
	const roots = new Set<number>();
	for (let r = -12; r <= 12; r++) if (A.length && pEval(A, q(r)).isZero()) roots.add(r);
	const cases = [...roots].map((r) => `${r}:${pEval(B, q(r)).isZero() ? 'ind' : 'imp'}`).sort();
	if (cases.join(',') !== [...(p.cases as string[])].sort().join(',')) v.push(`casi diversi: ${cases.join(',')}`);
	const lvl = sample.level;
	const deg = pDeg(A);
	if (lvl === 1 && (deg !== 0 || !A[0] || A[0].isZero() || pDeg(B) !== 1)) v.push('livello 1: coefficiente numerico, termine noto con il parametro');
	if (lvl === 2 && (deg !== 1 || !A[0].isZero() || pEval(B, q(0)).isZero())) v.push('livello 2: coefficiente c·a, impossibile per a = 0');
	if (lvl === 3 && (deg !== 1 || A[0].isZero() || roots.size !== 1)) v.push('livello 3: coefficiente a - r');
	if (lvl === 4 && (deg !== 2 || roots.size !== 2 || cases.filter((c) => c.endsWith('ind')).length !== 1)) v.push('livello 4: due fattori, tre casi');
	if (lvl === 5) {
		const dens = new Set(all.map((m) => m.c.den).filter((d) => d > 1));
		if (dens.size < 2) v.push('livello 5: servono due denominatori diversi');
		if (deg !== 1 || A[1].sign() >= 0 || !A[1].equals(q(-1)) || cases.some((c) => c.endsWith('ind'))) v.push('livello 5: coefficiente r - a, impossibile');
	}
	// The generic solution: B/A equals N/D.
	const pts = [q(97, 7), q(-113, 11)];
	const sol = String(p.solution);
	const m = /^\((.*)\)\/\((.*)\)$/.exec(sol);
	if (!m) v.push('params.solution illeggibile');
	if (lvl === 1) {
		if (sample.answer.kind !== 'expression') v.push('livello 1: risposta expression');
		else {
			const N = pFromSympy(sample.answer.value);
			for (const pt of pts) if (!N || !pEval(N, pt).equals(pEval(B, pt).div(pEval(A, pt)))) v.push('livello 1: risposta sbagliata');
		}
	} else {
		const ch = sample.answer;
		if (ch.kind !== 'choice' || ch.options.length !== 4) v.push('serve una scelta fra quattro');
		else {
			const keys = ch.options.map((o) => o.values.join('|'));
			if (new Set(keys).size !== 4) v.push('opzioni ripetute');
		}
	}
	return v;
}

/** Characters a student sees: without \\frac, braces, carets and spaces. */
const visibleLength = (tex: string) => tex.replace(/\\frac|[{}^ ]/g, '').length;

function clearedItems(lhs: Item[], rhs: Item[]): [Item[], Item[]] {
	const m = mcmOf(lhs, rhs);
	return [scaleSide(lhs, m), scaleSide(rhs, m)];
}

/** Reads back polySympy output: "(3)*a**1 + (-2)". */
function pFromSympy(s: string): P | null {
	let out: P = [];
	for (const part of s.split(' + ')) {
		const mm = /^\((-?\d+(?:\/\d+)?)\)(?:\*a\*\*(\d+))?$/.exec(part.trim());
		if (!mm) return part.trim() === '0' ? out : null;
		const k = mm[2] ? Number(mm[2]) : 0;
		out = pAdd(out, trim(Array.from({ length: k + 1 }, (_, i) => (i === k ? Rational.parse(mm[1]) : q(0)))));
	}
	return out;
}

// ---------------------------------------------------------------------------
// Choice for levels 1, 6, 7

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.choice) return sample.choice;
	// Level 1: x = m·a + n and the values of the transport mistakes.
	const lhs = parseItems(sample.params.lhs)!, rhs = parseItems(sample.params.rhs)!;
	const { A, B } = normalForm(lhs, rhs);
	const el = expandSide(lhs), er = expandSide(rhs);
	const polyOf = (ms: Mono[]) => ms.reduce<P>((acc, mm) => pAdd(acc, trim(Array.from({ length: mm.p + 1 }, (_, k) => (k === mm.p ? mm.c : q(0))))), []);
	const Lx = polyOf(el.filter((m) => m.x)), Rx = polyOf(er.filter((m) => m.x));
	const Lc = polyOf(el.filter((m) => !m.x)), Rc = polyOf(er.filter((m) => !m.x));
	const right = pScale(B, q(1).div(A[0]));
	const cands: P[] = [];
	const A2 = pAdd(Lx, Rx), B2 = pAdd(Rc, Lc);
	if (B2.length) cands.push(pScale(B2, q(1).div(A[0]))); // known terms carried across without changing sign
	if (A2.length && !A2[0].isZero()) cands.push(pScale(B, q(1).div(A2[0]))); // x terms carried across without changing sign
	cands.push(pScale(right, q(-1)));
	if (!A[0].abs().isOne()) cands.push(B); // not divided
	cands.push(pAdd(right, pInt(0, 1)), pSub(right, pInt(0, 1)), pAdd(right, pInt(1)), pSub(right, pInt(1)), pAdd(right, pInt(0, 2)));
	const key = (x: P) => polySympy(x);
	const opts: P[] = [right];
	const seen = new Set([key(right)]);
	for (const c of cands) {
		if (opts.length === 4) break;
		if (seen.has(key(c)) || !c.length) continue;
		seen.add(key(c));
		opts.push(c);
	}
	return assembleChoice(
		rng,
		opts.map((x) => {
			const den = x.reduce((acc, c) => lcm(acc, c.den), 1);
			const N = pScale(x, q(den));
			return { latex: `x = ${fracTex(N, pInt(den))}`, values: [polySympy(x)] };
		}),
	);
}

// ---------------------------------------------------------------------------

export const equazioniLetterali: Generator = {
	id: ID,
	title: 'Equazioni letterali',
	levels: {
		1: { label: 'Coefficiente numerico', constraints: ['il parametro a solo nei termini noti', 'forma normale kx = B(a) con k intero diverso da 0 e da ±1', 'soluzione x = ma + n con m, n interi'] },
		2: { label: 'Coefficiente con il parametro: a = 0', constraints: ['forma normale ca·x = ma + n con n diverso da 0', 'se a ≠ 0 una soluzione, se a = 0 impossibile'] },
		3: { label: 'Raccogliere la x: il caso indeterminato', constraints: ['forma normale (a - r)x = B(a), da raccogliere', 'circa 2 su 3 indeterminate per a = r (B multiplo di a - r), le altre impossibili'] },
		4: { label: 'Coefficiente con due fattori: tre casi', constraints: ['forma normale (a - r1)(a - r2)x = (a - r2)N(a)', 'determinata, impossibile per a = r1, indeterminata per a = r2'] },
		5: { label: 'Denominatori e coefficiente r - a', constraints: ['termini con denominatori numerici, almeno due diversi', 'dopo il mcm (r - a)x = ka + n, impossibile per a = r'] },
		6: { label: 'Formule inverse', constraints: ['ricavare una lettera da una formula di geometria o di fisica', 'distrattori: dividere solo un pezzo, fattore dimenticato, frazione capovolta, segno nel trasporto'] },
		7: { label: 'Formule inverse con i numeri', constraints: ['ricavare la lettera e calcolarne il valore con i dati', 'risposta intera positiva'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let sample: Sample | null = null;
			if (level <= 5) {
				const b = build(rng, level);
				if (!b) continue;
				const { A, B } = normalForm(...cleared(b));
				// The construction and the scattered equation must agree: A·N = B·D.
				if (!pEq(pMul(A, b.N), pMul(B, b.D))) continue;
				try {
					sample = assemble(b, level, rng);
				} catch {
					continue;
				}
			} else if (level === 6) sample = formulaSample(rng);
			else if (level === 7) sample = numericSample(rng);
			else throw new Error(`${ID}: unknown level ${level}`);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniLetterali;
