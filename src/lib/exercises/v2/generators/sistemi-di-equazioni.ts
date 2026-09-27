/**
 * Sistemi di due equazioni in due incognite. Spec: specs/exercises/sistemi-di-equazioni.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/68-sistemi-di-equazioni.md): which pair
 * solves the system, substitution, comparison, reduction, a system with numeric denominators or
 * parentheses to put in normal form, determinate / impossible / indeterminate, and fractional systems
 * whose solution the C.E. may exclude.
 *
 * Built backwards: the solution pair is chosen first, then the coefficients, and the known terms are
 * computed from it. Impossible and indeterminate systems are multiples of one equation.
 *
 * Answer: always multiple choice, because the answer is a pair (no answer type has two fields) or a set of
 * pairs (∅, the pairs of a line). Option values: [x, y] for S = {(x, y)} (at level 1 the bare pair),
 * [] for ∅, ["R"] for ℝ (a mistake the lesson names), ["line", a, b, c] for S = {(x, y) | ax + by = c}.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { paren } from '../latex';

export const ID = 'sistemi-di-equazioni';

type V = 'x' | 'y';
/** a x + b y = c */
interface Lin {
	a: Rational;
	b: Rational;
	c: Rational;
}
type Sys = [Lin, Lin];
type Pair = [Rational, Rational];
type Kind = 'determinato' | 'impossibile' | 'indeterminato';

const lin = (a: number | Rational, b: number | Rational, c: number | Rational): Lin => ({
	a: typeof a === 'number' ? q(a) : a,
	b: typeof b === 'number' ? q(b) : b,
	c: typeof c === 'number' ? q(c) : c,
});
const scaleLin = (l: Lin, k: Rational): Lin => ({ a: l.a.mul(k), b: l.b.mul(k), c: l.c.mul(k) });
const coefOf = (l: Lin, v: V) => (v === 'x' ? l.a : l.b);
const other = (v: V): V => (v === 'x' ? 'y' : 'x');
const ORD = ['prima', 'seconda'] as const;

// ---------------------------------------------------------------------------
// Algebra

const det = (s: Sys) => s[0].a.mul(s[1].b).sub(s[1].a.mul(s[0].b));

function solveSys(s: Sys): Pair | null {
	const d = det(s);
	if (d.isZero()) return null;
	const x = s[0].c.mul(s[1].b).sub(s[1].c.mul(s[0].b)).div(d);
	const y = s[0].a.mul(s[1].c).sub(s[1].a.mul(s[0].c)).div(d);
	return [x, y];
}

function classify(s: Sys): Kind {
	if (!det(s).isZero()) return 'determinato';
	const cx = s[0].a.mul(s[1].c).sub(s[1].a.mul(s[0].c));
	const cy = s[0].b.mul(s[1].c).sub(s[1].b.mul(s[0].c));
	return cx.isZero() && cy.isZero() ? 'indeterminato' : 'impossibile';
}

const evalLin = (l: Lin, p: Pair) => l.a.mul(p[0]).add(l.b.mul(p[1]));
const holds = (l: Lin, p: Pair) => evalLin(l, p).equals(l.c);
const samePair = (p: Pair, r: Pair) => p[0].equals(r[0]) && p[1].equals(r[1]);
const nice = (r: Rational, den = 12, num = 60) => r.den <= den && Math.abs(r.num) <= num;
const nicePair = (p: Pair | null, den = 12, num = 30): p is Pair => !!p && nice(p[0], den, num) && nice(p[1], den, num);

/** The equation divided by the gcd of its coefficients, with a > 0 (or b > 0 when a = 0). Integer coefficients. */
function primitive(l: Lin): Lin {
	const g = gcd(gcd(l.a.num, l.b.num), l.c.num);
	const s = l.a.sign() < 0 || (l.a.isZero() && l.b.sign() < 0) ? -1 : 1;
	return scaleLin(l, q(s, g));
}

// ---------------------------------------------------------------------------
// LaTeX

/** "3x", "x", "5" for a non-negative coefficient (the sign is written by the caller). */
function body(c: Rational, v: string): string {
	const a = c.abs();
	if (!v) return a.toLatex();
	return a.isOne() ? v : `${a.toLatex()}${v}`;
}

interface Term {
	neg: boolean;
	tex: string;
}
function joinTerms(ts: Term[]): string {
	if (ts.length === 0) return '0';
	return ts.map((t, i) => (i === 0 ? (t.neg ? '-' : '') + t.tex : (t.neg ? ' - ' : ' + ') + t.tex)).join('');
}
/** A sequence of monomials, not reduced: "2x + 15 - 3x". */
function seq(items: [Rational, string][]): string {
	return joinTerms(items.filter(([c]) => !c.isZero()).map(([c, v]) => ({ neg: c.sign() < 0, tex: body(c, v) })));
}

const eqLatex = (l: Lin) => `${seq([[l.a, 'x'], [l.b, 'y']])} = ${l.c.toLatex()}`;
const hasFrac = (p: Pair) => !p[0].isInteger() || !p[1].isInteger();
const pairLatex = (p: Pair) => (hasFrac(p) ? `\\left(${p[0].toLatex()}, ${p[1].toLatex()}\\right)` : `(${p[0].toLatex()}, ${p[1].toLatex()})`);
const setPairLatex = (p: Pair) => (hasFrac(p) ? `S = \\left\\{${pairLatex(p)}\\right\\}` : `S = \\{${pairLatex(p)}\\}`);
const lineSetLatex = (l: Lin) => `S = \\{(x, y) \\mid ${eqLatex(l)}\\}`;

/** A number in a problem: 3, -\dfrac{1}{2}. */
function dfrac(r: Rational): string {
	if (r.isInteger()) return `${r.num}`;
	return `${r.num < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
}

/** v - r, or just v when r = 0 (a denominator, a factor). */
function shifted(v: string, r: number): string {
	if (r === 0) return v;
	return `${v} ${r > 0 ? '-' : '+'} ${Math.abs(r)}`;
}

/** k times an expression: "3(5 - x)", "(5 - x)" for k = ±1 (the sign is written by the caller). */
function times(k: Rational, inner: string): string {
	return `${k.abs().isOne() ? '' : k.abs().toLatex()}(${inner})`;
}

/** k · val for a check or a substitution: "3 \cdot 2", "(-3)", "2 \cdot \left(-\frac{1}{2}\right)". */
function prodTerm(k: Rational, val: Rational, first: boolean): Term {
	const a = k.abs();
	if (a.isOne()) return { neg: k.sign() < 0, tex: first && k.sign() > 0 ? val.toLatex() : paren(val) };
	return { neg: k.sign() < 0, tex: `${a.toLatex()} \\cdot ${paren(val)}` };
}

/** The value of a x + b y at a pair, written out: "2 \cdot 3 + 3 \cdot 2". */
function evalLatex(l: Lin, p: Pair): string {
	const ts: Term[] = [];
	if (!l.a.isZero()) ts.push(prodTerm(l.a, p[0], true));
	if (!l.b.isZero()) ts.push(prodTerm(l.b, p[1], ts.length === 0));
	return joinTerms(ts);
}

type Option = string[];

function optionLatex(v: Option, bare: boolean): string {
	if (v.length === 0) return 'S = \\emptyset';
	if (v[0] === 'R') return 'S = \\mathbb{R}';
	if (v[0] === 'line') return lineSetLatex(lin(Rational.parse(v[1]), Rational.parse(v[2]), Rational.parse(v[3])));
	const p: Pair = [Rational.parse(v[0]), Rational.parse(v[1])];
	return bare ? pairLatex(p) : setPairLatex(p);
}
const pairOpt = (p: Pair): Option => [p[0].toString(), p[1].toString()];
const lineOpt = (l: Lin): Option => ['line', l.a.toString(), l.b.toString(), l.c.toString()];

// ---------------------------------------------------------------------------
// Solving steps, as in the lesson

/** v = e1 u + e0, written "5 - x" when e1 < 0 < e0 (as the lesson does), else "2x - 1". */
function exprLatex(e1: Rational, e0: Rational, u: V): { tex: string; constFirst: boolean } {
	if (e1.sign() < 0 && e0.sign() > 0) return { tex: `${e0.toLatex()} - ${body(e1, u)}`, constFirst: true };
	return { tex: seq([[e1, u], [e0, '']]), constFirst: false };
}

/** e1 · val + e0 in the order of the expression: "5 - 3", "2 \cdot \frac{5}{3} - 1". */
function plugLatex(e1: Rational, e0: Rational, val: Rational, constFirst: boolean): string {
	const e0t: Term = { neg: e0.sign() < 0, tex: e0.abs().toLatex() };
	if (constFirst) return joinTerms([e0t, prodTerm(e1, val, false)]);
	const ts = [prodTerm(e1, val, true)];
	if (!e0.isZero()) ts.push(e0t);
	return joinTerms(ts);
}

/** "u = val", then the step that finds it from A u = B (skipped when A = 1). */
function divide(A: Rational, B: Rational, u: V, out: string[], shown = false): Rational {
	if (!shown) out.push(`${seq([[A, u]])} = ${B.toLatex()}`);
	const val = B.div(A);
	if (!A.isOne()) out.push(`${u} = ${val.toLatex()}`);
	return val;
}

function substitutionSteps(s: Sys, i: 0 | 1, v: V): { steps: string[]; sol: Pair } {
	const out: string[] = [];
	const eq = s[i], oth = s[1 - i];
	const u = other(v);
	const cv = coefOf(eq, v), cu = coefOf(eq, u);
	const e1 = cu.neg().div(cv), e0 = eq.c.div(cv);
	const ex = exprLatex(e1, e0, u);
	out.push(`\\text{Nella ${ORD[i]} equazione } ${v} \\text{ ha coefficiente } ${cv.toLatex()}\\text{: ricavala, } ${v} = ${ex.tex}`);
	const dv = coefOf(oth, v), du = coefOf(oth, u);
	const vTerm: Term = { neg: dv.sign() < 0, tex: times(dv, ex.tex) };
	const uTerm: Term = { neg: du.sign() < 0, tex: body(du, u) };
	out.push(`\\text{Sostituisci nella ${ORD[1 - i]}, tra parentesi: } ${joinTerms(v === 'x' ? [vTerm, uTerm] : [uTerm, vTerm])} = ${oth.c.toLatex()}`);
	const inner: [Rational, string][] = ex.constFirst ? [[dv.mul(e0), ''], [dv.mul(e1), u]] : [[dv.mul(e1), u], [dv.mul(e0), '']];
	const items: [Rational, string][] = v === 'x' ? [...inner, [du, u]] : [[du, u], ...inner];
	out.push(`${seq(items)} = ${oth.c.toLatex()}`);
	const A = du.add(dv.mul(e1)), B = oth.c.sub(dv.mul(e0));
	const val = divide(A, B, u, out);
	const vv = e0.add(e1.mul(val));
	const plug = plugLatex(e1, e0, val, ex.constFirst);
	out.push(`\\text{Metti } ${u} = ${val.toLatex()} \\text{ nell'espressione di } ${v}\\text{: } ${v} = ${plug === vv.toLatex() ? plug : `${plug} = ${vv.toLatex()}`}`);
	const sol: Pair = v === 'x' ? [vv, val] : [val, vv];
	return { steps: out, sol };
}

/** Which unknown reduction eliminates: the smaller lcm of its coefficients, opposite signs first, then x. */
function reductionChoice(s: Sys): { v: V; k1: number; k2: number; opp: boolean } {
	const cands = (['x', 'y'] as V[]).map((v) => {
		const p1 = coefOf(s[0], v), p2 = coefOf(s[1], v);
		const L = lcm(Math.abs(p1.num), Math.abs(p2.num));
		return { v, L, k1: L / Math.abs(p1.num), k2: L / Math.abs(p2.num), opp: p1.sign() !== p2.sign() };
	});
	cands.sort((a, b) => a.L - b.L || Number(b.opp) - Number(a.opp));
	return cands[0];
}

function reductionSteps(s: Sys): { steps: string[]; sol: Pair } {
	const out: string[] = [];
	const { v, k1, k2, opp } = reductionChoice(s);
	const u = other(v);
	const e1 = scaleLin(s[0], q(k1)), e2 = scaleLin(s[1], q(k2));
	if (k1 === 1 && k2 === 1) {
		const p1 = coefOf(s[0], v), p2 = coefOf(s[1], v);
		const sg = (r: Rational) => (r.sign() > 0 ? `+${r.toLatex()}` : r.toLatex());
		out.push(`\\text{I coefficienti di } ${v} \\text{ sono } ${sg(p1)} \\text{ e } ${sg(p2)}\\text{, ${opp ? 'opposti' : 'uguali'}}`);
	} else {
		const what =
			k1 > 1 && k2 > 1
				? `\\text{, moltiplica la prima equazione per } ${k1} \\text{ e la seconda per } ${k2}\\text{: }`
				: `\\text{, moltiplica la ${k1 > 1 ? 'prima' : 'seconda'} equazione per } ${k1 > 1 ? k1 : k2}\\text{: }`;
		out.push(`\\text{Per eliminare } ${v}${what}${eqLatex(e1)},\\quad ${eqLatex(e2)}`);
	}
	const q1 = coefOf(e1, u), q2 = coefOf(e2, u);
	let A: Rational, B: Rational;
	if (opp) {
		A = q1.add(q2);
		B = e1.c.add(e2.c);
		out.push(`\\text{Somma le due equazioni membro a membro: } ${seq([[A, u]])} = ${B.toLatex()}`);
	} else {
		A = q1.sub(q2);
		B = e1.c.sub(e2.c);
		const sub = q2.sign() < 0 ? `(${seq([[q2, u]])})` : seq([[q2, u]]);
		out.push(`\\text{Sottrai la seconda dalla prima: } ${seq([[q1, u]])} - ${sub} = ${e1.c.toLatex()} - ${paren(e2.c)}`);
	}
	const val = divide(A, B, u, out, opp);
	// back into the first equation
	const cu = coefOf(s[0], u), cv = coefOf(s[0], v);
	const uT = prodTerm(cu, val, u === 'x');
	const vT: Term = { neg: cv.sign() < 0, tex: body(cv, v) };
	out.push(`\\text{Metti } ${u} = ${val.toLatex()} \\text{ nella prima equazione: } ${joinTerms(u === 'x' ? [uT, vT] : [vT, uT])} = ${s[0].c.toLatex()}`);
	const vv = divide(cv, s[0].c.sub(cu.mul(val)), v, out);
	return { steps: out, sol: u === 'x' ? [val, vv] : [vv, val] };
}

/** Substitution when a coefficient is ±1 (y in the first equation first), reduction otherwise. */
function solveSteps(s: Sys): { steps: string[]; sol: Pair } {
	const order: [0 | 1, V][] = [[0, 'y'], [0, 'x'], [1, 'y'], [1, 'x']];
	for (const [i, v] of order) if (coefOf(s[i], v).abs().isOne()) return substitutionSteps(s, i, v);
	return reductionSteps(s);
}

/** A step that writes the equation with a > 0, when it is not already. */
function positiveA(l: Lin, out: string[]): Lin {
	if (l.a.sign() >= 0) return l;
	const n = scaleLin(l, q(-1));
	out.push(`\\text{Cambia segno a tutti i termini: } ${eqLatex(n)}`);
	return n;
}

// ---------------------------------------------------------------------------
// Construction

function nz(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}
const casesLatex = (lines: string[], gap = false) => `\\begin{cases} ${lines.join(gap ? ' \\\\[1ex] ' : ' \\\\ ')} \\end{cases}`;

interface Built {
	problem: string;
	/** The integer system in normal form, the one that gets solved. */
	sys: Sys;
	/** Steps before solving (normal form, C.E.). */
	pre: string[];
	kind?: string;
	/** Excluded values (level 7). */
	ce: { v: V; r: number }[];
	/** Wrong pairs from the mistakes the lesson names, in order of preference. */
	wrong: (Pair | null)[];
	/** Level 7: solve the fractional system; level 6: solved by ratios. */
	extra?: Record<string, unknown>;
}

const allNonZero = (s: Sys) => s.every((l) => !l.a.isZero() && !l.b.isZero());
const intCoefs = (s: Sys, max: number, maxC: number) =>
	s.every((l) => [l.a, l.b, l.c].every((r) => r.isInteger()) && Math.abs(l.a.num) <= max && Math.abs(l.b.num) <= max && Math.abs(l.c.num) <= maxC);

/** A random equation a x + b y = c through p: nonzero coprime coefficients in [-m, m], not both negative. */
function through(rng: Rng, p: Pair, m: number): Lin {
	for (;;) {
		const a = nz(rng, -m, m), b = nz(rng, -m, m);
		if (gcd(a, b) !== 1 || (a < 0 && b < 0)) continue;
		return lin(a, b, q(a).mul(p[0]).add(q(b).mul(p[1])));
	}
}

/** Integer points of an equation near p (p on it, integer coefficients), p excluded. */
function pointsOn(l: Lin, p: Pair, n: number): Pair[] {
	const g = gcd(l.a.num, l.b.num);
	const dx = q(l.b.num / g), dy = q(-l.a.num / g);
	const out: Pair[] = [];
	for (let k = 1; out.length < n && k < 6; k++) for (const s of [k, -k]) out.push([p[0].add(dx.mul(q(s))), p[1].add(dy.mul(q(s)))]);
	return out.filter((r) => Math.abs(r[0].num) <= 12 && Math.abs(r[1].num) <= 12);
}

const intPair = (rng: Rng, m: number): Pair => [q(rng.int(-m, m)), q(rng.int(-m, m))];

/** Level 1: the system and a pair; the options are pairs. */
function level1(rng: Rng): Built | null {
	const p = intPair(rng, 6);
	const s: Sys = [through(rng, p, 5), through(rng, p, 5)];
	if (classify(s) !== 'determinato' || !intCoefs(s, 5, 40)) return null;
	// one pair solves the first equation only, one the second only
	const on1 = pointsOn(s[0], p, 4), on2 = pointsOn(s[1], p, 4);
	if (!on1.length || !on2.length) return null;
	return { problem: casesLatex(s.map(eqLatex)), sys: s, pre: [], ce: [], wrong: [[p[1], p[0]], rng.pick(on1), rng.pick(on2), ...on1, ...on2] };
}

/** Level 2: substitution, a coefficient ±1, integer solution. */
function level2(rng: Rng): Built | null {
	const p = intPair(rng, 6);
	const i = rng.next() < 0.75 ? 0 : 1;
	const v: V = rng.next() < 0.6 ? 'y' : 'x';
	const easy = (() => {
		const one = rng.pick([1, 1, 1, -1]), k = nz(rng, -5, 5);
		const [a, b] = v === 'y' ? [k, one] : [one, k];
		return lin(a, b, q(a).mul(p[0]).add(q(b).mul(p[1])));
	})();
	const hard = through(rng, p, 5);
	const s: Sys = i === 0 ? [easy, hard] : [hard, easy];
	if (classify(s) !== 'determinato' || !allNonZero(s) || !intCoefs(s, 5, 40)) return null;
	// the substitution the steps make must be this one
	const first: [0 | 1, V] | undefined = ([[0, 'y'], [0, 'x'], [1, 'y'], [1, 'x']] as [0 | 1, V][]).find(([j, w]) => coefOf(s[j], w).abs().isOne());
	if (!first) return null;
	const [j, w] = first;
	const wrong: (Pair | null)[] = [];
	// the parenthesis multiplied only in its first term, and a number carried across without its sign
	const eq = s[j], oth = s[1 - j], u = other(w);
	const e1 = coefOf(eq, u).neg().div(coefOf(eq, w)), e0 = eq.c.div(coefOf(eq, w));
	const cf = e1.sign() < 0 && e0.sign() > 0;
	const dv = coefOf(oth, w), du = coefOf(oth, u);
	const back = (val: Rational | null): Pair | null => {
		if (!val) return null;
		const vv = e0.add(e1.mul(val));
		return w === 'x' ? [vv, val] : [val, vv];
	};
	const solve1 = (A: Rational, B: Rational) => (A.isZero() ? null : B.div(A));
	wrong.push(back(cf ? solve1(du.add(e1), oth.c.sub(dv.mul(e0))) : solve1(du.add(dv.mul(e1)), oth.c.sub(e0))));
	wrong.push(back(solve1(du.add(dv.mul(e1)), oth.c.add(dv.mul(e0)))));
	return { problem: casesLatex(s.map(eqLatex)), sys: s, pre: [], ce: [], wrong };
}

/** Level 3: comparison, v = m1 u + q1 and v = m2 u + q2. */
function level3(rng: Rng): Built | null {
	const v: V = rng.next() < 0.75 ? 'y' : 'x';
	const u = other(v);
	const m1 = nz(rng, -4, 4), m2 = nz(rng, -4, 4, [m1]);
	const q1 = rng.int(-6, 6), q2 = rng.int(-6, 6);
	if (q1 === 0 && q2 === 0) return null;
	const uval = q(q2 - q1, m1 - m2);
	if (!nice(uval, 6, 12)) return null;
	const vval = q(m1).mul(uval).add(q(q1));
	if (!nice(vval, 6, 30)) return null;
	const side = (m: number, c: number) => exprLatex(q(m), q(c), u).tex;
	const problem = casesLatex([`${v} = ${side(m1, q1)}`, `${v} = ${side(m2, q2)}`]);
	// normal form: -m u + v = q
	const toLin = (m: number, c: number) => (v === 'y' ? lin(-m, 1, c) : lin(1, -m, c));
	const sys: Sys = [toLin(m1, q1), toLin(m2, q2)];
	const pairOf = (uv: Rational | null): Pair | null => {
		if (!uv) return null;
		const vv = q(m1).mul(uv).add(q(q1));
		return v === 'y' ? [uv, vv] : [vv, uv];
	};
	const wrong = [
		// numbers carried across without changing sign: (m1 - m2) u = q2 + q1
		pairOf(q(q2 + q1, m1 - m2)),
		// the division upside down
		q2 - q1 !== 0 ? pairOf(q(m1 - m2, q2 - q1)) : null,
	];
	return { problem, sys, pre: [], ce: [], wrong, kind: v, extra: { m: [m1, m2], q: [q1, q2] } };
}

/** Level 4: reduction, no coefficient ±1, a negative coordinate. */
function level4(rng: Rng, pick: number): Built | null {
	const p = intPair(rng, 6);
	if (p[0].sign() >= 0 && p[1].sign() >= 0) return null;
	const ready = pick < 0.3;
	const c2 = () => rng.pick([2, 3, 4, 5, 6, 7]) * (rng.next() < 0.5 ? -1 : 1);
	let s: Sys;
	if (ready) {
		// one unknown with equal or opposite coefficients (example 3)
		const a = c2(), b1 = c2(), b2 = c2();
		const a2 = rng.next() < 0.6 ? -a : a;
		const mk = (x: number, y: number) => lin(x, y, q(x).mul(p[0]).add(q(y).mul(p[1])));
		s = rng.next() < 0.5 ? [mk(a, b1), mk(a2, b2)] : [mk(b1, a), mk(b2, a2)];
	} else {
		const mk = () => {
			const x = c2(), y = c2();
			return lin(x, y, q(x).mul(p[0]).add(q(y).mul(p[1])));
		};
		s = [mk(), mk()];
		if (Math.abs(s[0].a.num) === Math.abs(s[1].a.num) || Math.abs(s[0].b.num) === Math.abs(s[1].b.num)) return null;
	}
	if (classify(s) !== 'determinato' || !intCoefs(s, 7, 60)) return null;
	for (const l of s) if (l.a.abs().isOne() || l.b.abs().isOne() || gcd(gcd(l.a.num, l.b.num), l.c.num) > 1 || (l.a.sign() < 0 && l.b.sign() < 0)) return null;
	const { v, k1, k2, opp } = reductionChoice(s);
	const u = other(v);
	const e1 = scaleLin(s[0], q(k1)), e2 = scaleLin(s[1], q(k2));
	const fromU = (uv: Rational): Pair => {
		const vv = s[0].c.sub(coefOf(s[0], u).mul(uv)).div(coefOf(s[0], v));
		return u === 'x' ? [uv, vv] : [vv, uv];
	};
	const q1 = coefOf(e1, u), q2 = coefOf(e2, u);
	const wrong: (Pair | null)[] = [];
	// the sign of the subtraction: 8y - 15y instead of 8y + 15y
	if (!opp && !q1.add(q2).isZero()) wrong.push(fromU(e1.c.sub(e2.c).div(q1.add(q2))));
	// only the first member multiplied
	if (k1 > 1 || k2 > 1) {
		const c1 = s[0].c, cc2 = s[1].c;
		const A = opp ? q1.add(q2) : q1.sub(q2), B = opp ? c1.add(cc2) : c1.sub(cc2);
		if (!A.isZero()) wrong.push(fromU(B.div(A)));
	}
	return { problem: casesLatex(s.map(eqLatex)), sys: s, pre: [], ce: [], wrong, kind: ready ? 'pronti' : 'da moltiplicare' };
}

// Level 5 forms --------------------------------------------------------------

interface Form {
	tex: string;
	normal: Lin;
	steps: (ord: string) => string[];
	/** Normal forms reached by the mistakes of the lesson. */
	wrongs: Lin[];
	kind: 'frazioni' | 'binomi' | 'parentesi';
}

/** n_x x / d_x + n_y y / d_y = k (first equation of example 5). */
function fracForm(rng: Rng, p: Pair): Form | null {
	const term = (pos: boolean) => {
		const d = rng.pick([2, 3, 4, 5, 6]);
		const n = rng.pick([1, 1, 2, 3]) * (pos || rng.next() < 0.6 ? 1 : -1);
		return gcd(n, d) === 1 ? { n, d } : null;
	};
	const tx = term(true), ty = term(false);
	if (!tx || !ty) return null;
	const k = q(tx.n, tx.d).mul(p[0]).add(q(ty.n, ty.d).mul(p[1]));
	if (!nice(k, 6, 20)) return null;
	const M = lcm(lcm(tx.d, ty.d), k.den);
	if (M > 12) return null;
	const normal = lin(q(M * tx.n, tx.d), q(M * ty.n, ty.d), k.mul(q(M)));
	const t = (n: number, d: number, v: string) => `\\dfrac{${Math.abs(n) === 1 ? '' : Math.abs(n)}${v}}{${d}}`;
	const tex = `${t(tx.n, tx.d, 'x')} ${ty.n < 0 ? '-' : '+'} ${t(ty.n, ty.d, 'y')} = ${dfrac(k)}`;
	const wrongs: Lin[] = [];
	if (k.isInteger() && M > 1) wrongs.push(lin(normal.a, normal.b, k));
	return {
		tex,
		normal,
		steps: (ord) => [`\\text{Nella ${ord} equazione il MCM è } ${M}\\text{: moltiplica ogni termine per } ${M}\\text{ e ottieni } ${eqLatex(normal)}`],
		wrongs,
		kind: 'frazioni',
	};
}

/** (x + h_x)/d_x ± (y + h_y)/d_y = k (second equation of example 5). */
function binForm(rng: Rng, p: Pair): Form | null {
	const hx = nz(rng, -5, 5), hy = nz(rng, -5, 5);
	const dx = rng.pick([2, 3, 4, 5, 6]), dy = rng.pick([2, 3, 4, 5, 6]);
	const sy = rng.next() < 0.6 ? -1 : 1;
	const k = q(p[0].num + hx, dx).add(q(sy * (p[1].num + hy), dy));
	if (!nice(k, 6, 20)) return null;
	const M = lcm(lcm(dx, dy), k.den);
	if (M > 12) return null;
	const mx = M / dx, my = M / dy;
	const Kx = q(mx * hx), Ky = q(sy * my * hy);
	const C = k.mul(q(M)).sub(Kx).sub(Ky);
	const normal = lin(mx, sy * my, C);
	const tex = `\\dfrac{${shifted('x', -hx)}}{${dx}} ${sy < 0 ? '-' : '+'} \\dfrac{${shifted('y', -hy)}}{${dy}} = ${dfrac(k)}`;
	const wrongs: Lin[] = [];
	// the minus in front of a fraction changes only the first term of the numerator
	if (sy < 0) wrongs.push(lin(normal.a, normal.b, C.add(Ky.mul(q(2)))));
	if (k.isInteger() && M > 1) wrongs.push(lin(normal.a, normal.b, k.sub(Kx).sub(Ky)));
	return {
		tex,
		normal,
		steps: (ord) => {
			const xT: Term = { neg: false, tex: mx === 1 ? shifted('x', -hx) : `${mx}(${shifted('x', -hx)})` };
			const yT: Term = { neg: sy < 0, tex: times(q(my), shifted('y', -hy)) };
			return [
				`\\text{Nella ${ord} equazione il MCM è } ${M}\\text{: tieni i numeratori tra parentesi, } ${joinTerms([xT, yT])} = ${k.mul(q(M)).toLatex()}`,
				`${seq([[q(mx), 'x'], [Kx, ''], [q(sy * my), 'y'], [Ky, '']])} = ${k.mul(q(M)).toLatex()}`,
				eqLatex(normal),
			];
		},
		wrongs,
		kind: 'binomi',
	};
}

/** m(v + h) + n w = s v + t: parentheses and the unknowns on both sides (the normal form of the lesson). */
function parForm(rng: Rng, p: Pair): Form | null {
	const v: V = rng.next() < 0.6 ? 'x' : 'y';
	const m = rng.int(2, 4), h = nz(rng, -5, 5), n = nz(rng, -3, 3), s = nz(rng, -3, 3, [m]);
	const vv = v === 'x' ? p[0] : p[1], ww = v === 'x' ? p[1] : p[0];
	const t = q(m).mul(vv.add(q(h))).add(q(n).mul(ww)).sub(q(s).mul(vv));
	if (Math.abs(t.num) > 30) return null;
	const w = other(v);
	const parT: Term = { neg: false, tex: `${m}(${shifted(v, -h)})` };
	const wT: Term = { neg: n < 0, tex: body(q(n), w) };
	const lhs = v === 'x' ? [parT, wT] : [wT, parT];
	const rhs = seq([[q(s), v], [t, '']]);
	const tex = `${joinTerms(lhs)} = ${rhs}`;
	const cv = q(m - s), cc = t.sub(q(m * h));
	const normal = v === 'x' ? lin(cv, n, cc) : lin(n, cv, cc);
	const wrongC = t.add(q(m * h));
	const wrongs = [v === 'x' ? lin(cv, n, wrongC) : lin(n, cv, wrongC)];
	return {
		tex,
		normal,
		steps: (ord) => {
			const exp: [Rational, string][] = [[q(m), v], [q(m * h), '']];
			const all: [Rational, string][] = v === 'x' ? [...exp, [q(n), w]] : [[q(n), w], ...exp];
			const moved: [Rational, string][] = v === 'x' ? [[q(m), 'x'], [q(-s), 'x'], [q(n), 'y']] : [[q(n), 'x'], [q(m), 'y'], [q(-s), 'y']];
			return [
				`\\text{Nella ${ord} equazione svolgi il prodotto: } ${seq(all)} = ${rhs}`,
				`\\text{Porta le incognite a primo membro e i numeri a secondo: } ${seq(moved)} = ${seq([[t, ''], [q(-m * h), '']])}`,
				eqLatex(normal),
			];
		},
		wrongs,
		kind: 'parentesi',
	};
}

const COMBOS: [typeof fracForm, typeof fracForm][] = [
	[fracForm, binForm],
	[binForm, fracForm],
	[fracForm, parForm],
	[binForm, parForm],
	[parForm, binForm],
];

function level5(rng: Rng): Built | null {
	const p = intPair(rng, 6);
	const [f1, f2] = rng.pick(COMBOS);
	const a = f1(rng, p), b = f2(rng, p);
	if (!a || !b) return null;
	const pre: string[] = [];
	const sys = [a, b].map((f, i) => {
		const st = f.steps(ORD[i]);
		// the last line of the steps is the normal form; a negative a gets a sign change
		pre.push(...st);
		return positiveA(f.normal, pre);
	}) as Sys;
	if (classify(sys) !== 'determinato' || !allNonZero(sys) || !intCoefs(sys, 15, 60)) return null;
	if (!samePair(solveSys(sys)!, p)) return null;
	pre.push(`\\text{Il sistema in forma normale è } ${eqLatex(sys[0])},\\quad ${eqLatex(sys[1])}`);
	const wrong: (Pair | null)[] = [];
	for (const w of a.wrongs) wrong.push(solveSys([w, sys[1]]));
	for (const w of b.wrongs) wrong.push(solveSys([sys[0], w]));
	return { problem: casesLatex([a.tex, b.tex], true), sys, pre, ce: [], wrong, kind: `${a.kind}+${b.kind}` };
}

// Level 6 ----------------------------------------------------------------------

function level6(rng: Rng, pick: number): Built | null {
	const kind: Kind = pick < 0.2 ? 'determinato' : pick < 0.6 ? 'impossibile' : 'indeterminato';
	let s: Sys;
	let base: Lin;
	if (kind === 'determinato') {
		const p = intPair(rng, 5);
		const a = nz(rng, -4, 4), b = nz(rng, -4, 4), h = rng.pick([2, 3, -2, -1, 2]), e = rng.pick([1, -1, 2, -2]);
		if (h * b + e === 0) return null;
		const mk = (x: number, y: number) => lin(x, y, q(x).mul(p[0]).add(q(y).mul(p[1])));
		s = [mk(a, b), mk(h * a, h * b + e)];
		base = primitive(s[0]);
	} else {
		const a = rng.int(1, 5), b = nz(rng, -5, 5), c = nz(rng, -9, 9);
		if (gcd(gcd(a, b), c) !== 1) return null;
		base = lin(a, b, c);
		const k1 = rng.pick([1, 1, 2, 3, -1]), k2 = nz(rng, -4, 4, [k1]);
		const e1 = scaleLin(base, q(k1));
		let e2 = scaleLin(base, q(k2));
		if (kind === 'impossibile') {
			const d = nz(rng, -6, 6);
			e2 = lin(e2.a, e2.b, e2.c.add(q(d)));
		}
		s = [e1, e2];
	}
	if (classify(s) !== kind || !intCoefs(s, 20, 60)) return null;
	if (s.some((l) => l.a.isZero() || l.b.isZero() || l.c.isZero())) return null;
	return { problem: casesLatex(s.map(eqLatex)), sys: s, pre: [], ce: [], wrong: [], kind, extra: { base } };
}

/** a / a' written as in example 8: \\frac{a}{a'} = \\frac{2}{4} = \\frac{1}{2}. */
function ratioLatex(sym: string, n: Rational, d: Rational): string {
	const raw = `\\frac{${n.toLatex()}}{${d.toLatex()}}`;
	const red = n.div(d).toLatex();
	return `\\frac{${sym}}{${sym}'} = ${raw}${raw === red ? '' : ` = ${red}`}`;
}

// Level 7 ----------------------------------------------------------------------

type K7 = 'due frazioni' | 'x al numeratore' | 'y al numeratore';

function level7(rng: Rng, pick: number): Built | null {
	const ok = pick < 0.6;
	const shape = rng.pick<K7>(['due frazioni', 'due frazioni', 'x al numeratore', 'y al numeratore']);
	let p: Pair;
	let first: Lin; // the cleared first equation, before the sign change
	let tex: string;
	const pre: string[] = [];
	let ce: { v: V; r: number }[];
	let wrong1: Lin; // the first equation cleared with the mistake of the lesson
	if (shape === 'due frazioni') {
		// k1/(x - px) = k2/(y - ry) (example 9)
		const px = rng.int(-5, 5), ry = rng.int(-5, 5);
		let k1: number, k2: number;
		if (ok) {
			p = intPair(rng, 6);
			const d1 = p[0].num - px, d2 = p[1].num - ry;
			if (d1 === 0 || d2 === 0) return null;
			const g = gcd(d1, d2), t = rng.int(1, 2) * (d1 < 0 ? -1 : 1);
			k1 = (t * d1) / g;
			k2 = (t * d2) / g;
		} else {
			p = [q(px), q(ry)];
			k1 = rng.int(1, 6);
			k2 = nz(rng, -6, 6, [k1]);
		}
		if (Math.abs(k1) > 9 || Math.abs(k2) > 9 || k1 <= 0) return null;
		ce = [
			{ v: 'x', r: px },
			{ v: 'y', r: ry },
		];
		tex = `\\dfrac{${k1}}{${shifted('x', px)}} = ${k2 < 0 ? '-' : ''}\\dfrac{${Math.abs(k2)}}{${shifted('y', ry)}}`;
		const fx = px === 0 ? 'x' : `(${shifted('x', px)})`, fy = ry === 0 ? 'y' : `(${shifted('y', ry)})`;
		const prod = px === 0 && ry === 0 ? 'xy' : ry === 0 ? `y${fx}` : `${fx}${fy}`;
		const ct = (k: number, v: string, r: number): string => (r === 0 ? seq([[q(k), v]]) : k === 1 ? shifted(v, r) : k === -1 ? `-(${shifted(v, r)})` : `${k}(${shifted(v, r)})`);
		pre.push(`\\text{C.E.: } x \\neq ${px},\\ y \\neq ${ry}`);
		pre.push(`\\text{Nella prima equazione c'è una frazione per membro: moltiplica per } ${prod}\\text{: } ${ct(k1, 'y', ry)} = ${ct(k2, 'x', px)}`);
		const exp = `${seq([[q(k1), 'y'], [q(-k1 * ry), '']])} = ${seq([[q(k2), 'x'], [q(-k2 * px), '']])}`;
		if (exp !== pre[pre.length - 1].split('\\text{: } ')[1]) pre.push(exp);
		first = lin(k2, -k1, k2 * px - k1 * ry);
		wrong1 = lin(k1, -k2, k1 * px - k2 * ry);
	} else {
		// (u + h)/(w - r) = k (example 10), u the unknown of the numerator
		const u: V = shape === 'x al numeratore' ? 'x' : 'y';
		const w = other(u);
		const r = rng.int(-5, 5), k = nz(rng, -4, 4);
		let h: number;
		if (ok) {
			p = intPair(rng, 6);
			const uv = u === 'x' ? p[0].num : p[1].num, wv = u === 'x' ? p[1].num : p[0].num;
			if (wv === r) return null;
			h = k * (wv - r) - uv;
		} else {
			h = rng.int(-6, 6);
			p = u === 'x' ? [q(-h), q(r)] : [q(r), q(-h)];
		}
		if (Math.abs(h) > 9) return null;
		ce = [{ v: w, r }];
		tex = `\\dfrac{${shifted(u, -h)}}{${shifted(w, r)}} = ${k}`;
		const kr = k === 1 ? shifted(w, r) : r === 0 ? seq([[q(k), w]]) : k === -1 ? `-(${shifted(w, r)})` : `${k}(${shifted(w, r)})`;
		pre.push(`\\text{C.E.: } ${w} \\neq ${r}`);
		pre.push(`\\text{Moltiplica la prima equazione per } ${shifted(w, r)}\\text{: } ${shifted(u, -h)} = ${kr}`);
		const exp = `${shifted(u, -h)} = ${seq([[q(k), w], [q(-k * r), '']])}`;
		if (exp !== pre[pre.length - 1].split('\\text{: } ')[1]) pre.push(exp);
		// u - k w = -k r - h
		first = u === 'x' ? lin(1, -k, -k * r - h) : lin(-k, 1, -k * r - h);
		// the parenthesis multiplied only in its first term: u + h = k w - r
		wrong1 = u === 'x' ? lin(1, -k, -r - h) : lin(-k, 1, -r - h);
	}
	const moved = eqLatex(first);
	pre.push(`\\text{Porta le incognite a primo membro: } ${moved}`);
	const e1 = positiveA(first, pre);
	const e2 = through(rng, p, 3);
	const sys: Sys = [e1, e2];
	if (classify(sys) !== 'determinato' || !allNonZero(sys) || !intCoefs(sys, 12, 40)) return null;
	if (!samePair(solveSys(sys)!, p)) return null;
	pre.push(`\\text{Il sistema intero è } ${eqLatex(e1)},\\quad ${eqLatex(e2)}`);
	return { problem: casesLatex([tex, eqLatex(e2)], true), sys, pre, ce, wrong: [solveSys([wrong1, e2])], kind: ok ? 'accettabile' : 'non accettabile', extra: { shape } };
}

// ---------------------------------------------------------------------------
// Answer and choice

const excludedBy = (ce: { v: V; r: number }[], p: Pair) => ce.some(({ v, r }) => (v === 'x' ? p[0] : p[1]).equals(q(r)));

function shuffle(rng: Rng, opts: Option[], bare: boolean): ChoiceAnswer {
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(opts[i], bare), values: opts[i] }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** Correct option first, then the candidates in order, distinct, up to four. Null when fewer than four. */
function pickOptions(correct: Option, cands: (Option | null)[]): Option[] | null {
	const out = [correct];
	const seen = new Set([correct.join('|')]);
	for (const c of cands) {
		if (!c || out.length >= 4) continue;
		const k = c.join('|');
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(c);
	}
	return out.length === 4 ? out : null;
}

/** Pairs near the solution, to fill the options: swapped, signs changed, one unit off. */
function nearby(p: Pair): Pair[] {
	const [x, y] = p;
	return [
		[y, x],
		[x, y.neg()],
		[x.neg(), y],
		[x.neg(), y.neg()],
		[x.add(q(1)), y],
		[x, y.sub(q(1))],
		[x.sub(q(1)), y.add(q(1))],
		[x.add(q(2)), y.sub(q(1))],
	];
}

interface Solved {
	kind: Kind;
	/** Level 7: the solution of the integer system is excluded. */
	accepted: boolean;
	sol: Pair | null;
	correct: Option;
	solution: string;
	steps: string[];
}

function solveBuilt(b: Built, level: number): Solved {
	const kind = classify(b.sys);
	const steps = [...b.pre];
	if (level === 6) {
		const [l1, l2] = b.sys;
		steps.push(`\\text{Confronta i rapporti dei coefficienti: } ${ratioLatex('a', l1.a, l2.a)}`);
		steps.push(ratioLatex('b', l1.b, l2.b));
		if (kind !== 'determinato') steps.push(ratioLatex('c', l1.c, l2.c));
		if (kind === 'impossibile') {
			steps.push(`\\text{I primi due rapporti sono uguali e il terzo è diverso: il sistema è impossibile}`);
			steps.push('S = \\emptyset');
			return { kind, accepted: false, sol: null, correct: [], solution: `\\text{Sistema impossibile: } S = \\emptyset`, steps };
		}
		if (kind === 'indeterminato') {
			const base = primitive(l1);
			steps.push(`\\text{Tutti e tre i rapporti sono uguali: il sistema è indeterminato}`);
			steps.push(`\\text{Le soluzioni sono tutte e sole le coppie che risolvono } ${eqLatex(base)}`);
			steps.push(lineSetLatex(base));
			return { kind, accepted: false, sol: null, correct: lineOpt(base), solution: `\\text{Sistema indeterminato: } ${lineSetLatex(base)}`, steps };
		}
		steps.push(`\\text{I due rapporti sono diversi: il sistema è determinato}`);
	}
	const solved = level === 4 ? reductionSteps(b.sys) : level === 3 ? comparisonSteps(b) : solveSteps(b.sys);
	steps.push(...solved.steps);
	const sol = solved.sol;
	if (level === 7) {
		const bad = excludedBy(b.ce, sol);
		if (bad) {
			steps.push(`\\text{La coppia } ${pairLatex(sol)} \\text{ non rispetta le C.E.: non è accettabile}`);
			steps.push(`\\text{Il sistema è impossibile: } S = \\emptyset`);
			return { kind, accepted: false, sol, correct: [], solution: `\\text{Soluzione non accettabile: } S = \\emptyset`, steps };
		}
		steps.push(`\\text{La coppia } ${pairLatex(sol)} \\text{ rispetta le C.E.: è accettabile}`);
	}
	steps.push(setPairLatex(sol));
	return { kind, accepted: true, sol, correct: pairOpt(sol), solution: setPairLatex(sol), steps };
}

/** Level 3: the two expressions of the same unknown set equal (example 2). */
function comparisonSteps(b: Built): { steps: string[]; sol: Pair } {
	const v = b.kind as V, u = other(v);
	const { m, q: qq } = b.extra as { m: number[]; q: number[] };
	const [m1, m2] = m.map((n) => q(n)), [q1, q2] = qq.map((n) => q(n));
	const e1 = exprLatex(m1, q1, u), e2 = exprLatex(m2, q2, u);
	const out: string[] = [];
	out.push(`\\text{Tutte e due le equazioni danno } ${v}\\text{: uguaglia le due espressioni, } ${e1.tex} = ${e2.tex}`);
	const moved = `${seq([[m1, u], [m2.neg(), u]])} = ${seq([[q2, ''], [q1.neg(), '']])}`;
	out.push(`\\text{Porta la } ${u} \\text{ a primo membro e i numeri a secondo: } ${moved}`);
	const uv = divide(m1.sub(m2), q2.sub(q1), u, out);
	// the equation with fewer computations: the smaller slope, then no constant
	const useSecond = m2.abs().compare(m1.abs()) < 0 || (m2.abs().equals(m1.abs()) && q1.isZero() === false && q2.isZero());
	const [mm, qc, ex, ord] = useSecond ? [m2, q2, e2, 'seconda'] : [m1, q1, e1, 'prima'];
	const vv = mm.mul(uv).add(qc);
	const plug = plugLatex(mm, qc, uv, ex.constFirst);
	out.push(`\\text{Metti } ${u} = ${uv.toLatex()} \\text{ nella ${ord} equazione: } ${v} = ${plug === vv.toLatex() ? plug : `${plug} = ${vv.toLatex()}`}`);
	return { steps: out, sol: v === 'y' ? [uv, vv] : [vv, uv] };
}

function buildChoice(b: Built, s: Solved, level: number): Option[] | null {
	const pairs = (ps: (Pair | null)[]) => ps.filter((p) => nicePair(p) && !(level === 7 && excludedBy(b.ce, p))).map((p) => pairOpt(p!));
	if (level === 1) {
		const p = s.sol!;
		// the swapped pair, a pair solving only the first, one solving only the second
		const cands = pairs(b.wrong).filter((o) => !(o[0] === p[0].toString() && o[1] === p[1].toString()));
		return pickOptions(s.correct, cands);
	}
	if (level === 6) {
		const base = (b.extra as { base: Lin }).base;
		const p0 = s.sol;
		if (s.kind === 'impossibile') {
			const on = pointsOn(base, pointOnBase(base), 3);
			return pickOptions(s.correct, [['R'], lineOpt(primitive(b.sys[0])), ...on.slice(0, 1).map(pairOpt), lineOpt(base)]);
		}
		if (s.kind === 'indeterminato') {
			const on = [pointOnBase(base), ...pointsOn(base, pointOnBase(base), 2)];
			return pickOptions(s.correct, [['R'], [], pairOpt(on[0])]);
		}
		return pickOptions(s.correct, [[], lineOpt(primitive(b.sys[0])), ['R'], ...pairs(nearby(p0!))]);
	}
	if (level === 7 && !s.accepted) {
		const p = s.sol!;
		// the pair the C.E. exclude (the answer of who forgets them), then the mistakes
		return pickOptions(s.correct, [pairOpt(p), ...pairs(b.wrong), ...pairs(nearby(p))]);
	}
	const p = s.sol!;
	const extra: Option[] = level === 7 ? [[]] : [];
	return pickOptions(s.correct, [...extra, ...pairs(b.wrong), ...pairs(nearby(p))]);
}

/** An integer point of a primitive equation with small coordinates. */
function pointOnBase(l: Lin): Pair {
	for (let r = 0; r <= 12; r++)
		for (const x0 of r === 0 ? [0] : [r, -r]) {
			const y = l.c.sub(l.a.mul(q(x0))).div(l.b);
			if (y.isInteger()) return [q(x0), y];
		}
	return [q(0), l.c.div(l.b)];
}

// ---------------------------------------------------------------------------
// Sample

const PROMPTS: Record<number, string> = {
	1: 'Quale di queste coppie è la soluzione del sistema?',
	2: 'Risolvi il sistema con il metodo di sostituzione.',
	3: 'Risolvi il sistema con il metodo del confronto.',
	4: 'Risolvi il sistema con il metodo di riduzione.',
	5: 'Porta il sistema in forma normale e risolvilo.',
	6: 'Stabilisci se il sistema è determinato, impossibile o indeterminato e scegli le sue soluzioni.',
	7: 'Risolvi il sistema fratto.',
};

function level1Steps(b: Built, opts: Option[]): string[] {
	const [l1, l2] = b.sys;
	const p = solveSys(b.sys)!;
	const out = [
		`\\text{Sostituisci } x = ${p[0].toLatex()} \\text{ e } y = ${p[1].toLatex()} \\text{ nella prima equazione: } ${evalLatex(l1, p)} = ${l1.c.toLatex()}`,
		`\\text{e nella seconda: } ${evalLatex(l2, p)} = ${l2.c.toLatex()}`,
		`\\text{Tutte e due le uguaglianze sono vere: } ${pairLatex(p)} \\text{ è la soluzione}`,
	];
	for (const o of opts.slice(1)) {
		const r: Pair = [Rational.parse(o[0]), Rational.parse(o[1])];
		const bad = holds(l1, r) ? l2 : l1;
		const which = holds(l1, r) ? 'risolve la prima equazione ma non la seconda' : holds(l2, r) ? 'risolve la seconda equazione ma non la prima' : 'non risolve la prima equazione';
		out.push(`${pairLatex(r)}\\text{ ${which}: } ${evalLatex(bad, r)} = ${evalLin(bad, r).toLatex()} \\neq ${bad.c.toLatex()}`);
	}
	return out;
}

const sysJSON = (s: Sys) => s.map((l) => [l.a.toString(), l.b.toString(), l.c.toString()]);

/** `u` is drawn once per exercise: it fixes the case, so that discarded attempts do not change the shares. */
function build(rng: Rng, level: number, u: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng, u);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng, u);
		case 7:
			return level7(rng, u);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function assemble(b: Built, level: number, rng: Rng): Sample | null {
	const s = solveBuilt(b, level);
	if (level !== 6 && s.kind !== 'determinato') return null;
	if (level === 7 && s.accepted !== (b.kind === 'accettabile')) return null;
	const opts = buildChoice(b, s, level);
	if (!opts) return null;
	const answer = shuffle(rng, opts, level === 1);
	const steps = (level === 1 ? level1Steps(b, opts) : s.steps).filter((t, i, all) => i === 0 || t !== all[i - 1]);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: PROMPTS[level],
		problem: b.problem,
		solution: level === 1 ? pairLatex(s.sol!) : s.solution,
		steps,
		answer,
		params: {
			sys: sysJSON(b.sys),
			kind: level === 6 ? s.kind : level === 7 ? (s.accepted ? 'accettabile' : 'non accettabile') : (b.kind ?? null),
			solution: s.sol ? pairOpt(s.sol) : null,
			ce: b.ce.map(({ v, r }) => [v, String(r)]),
			...(level === 7 ? { shape: (b.extra as { shape: string }).shape } : {}),
		},
	};
}

// ---------------------------------------------------------------------------
// Check

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito', re: /(?<![\d.])1\s*[xy]/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xy]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'numeratore nullo', re: /\\d?frac\{0\}/ },
];

function sysFrom(p: Record<string, unknown>): Sys | null {
	const s = p.sys;
	if (!Array.isArray(s) || s.length !== 2) return null;
	try {
		return s.map((l) => lin(Rational.parse(String(l[0])), Rational.parse(String(l[1])), Rational.parse(String(l[2])))) as Sys;
	} catch {
		return null;
	}
}

const optKey = (o: string[]) => o.join('|');

function check(sample: Sample): string[] {
	const v: string[] = [];
	const s = sysFrom(sample.params);
	if (!s) return ['params.sys non valido'];
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const a = sample.answer;
	if (a.kind !== 'choice') return [...v, 'la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map((o) => optKey(o.values))).size !== a.options.length) v.push('opzioni ripetute');
	const lvl = sample.level;
	const kind = classify(s);
	const sol = solveSys(s);
	let truth: string[];
	if (kind === 'impossibile') truth = [];
	else if (kind === 'indeterminato') truth = lineOpt(primitive(s[0]));
	else truth = pairOpt(sol!);
	const ce = (sample.params.ce as [V, string][]) ?? [];
	if (lvl === 7 && sol && excludedBy(ce.map(([w, r]) => ({ v: w, r: Number(r) })), sol)) truth = [];
	if (optKey(a.options[a.correct]?.values ?? ['?']) !== optKey(truth)) v.push("l'opzione giusta non è la soluzione");
	const coefs = s.flatMap((l) => [l.a, l.b, l.c]);
	if (!coefs.every((r) => r.isInteger())) v.push('coefficienti non interi in forma normale');
	const intSol = sol && sol[0].isInteger() && sol[1].isInteger() && Math.abs(sol[0].num) <= 6 && Math.abs(sol[1].num) <= 6;
	const small = (m: number) => s.every((l) => Math.abs(l.a.num) <= m && Math.abs(l.b.num) <= m);
	if (lvl !== 6 && kind !== 'determinato') v.push('il sistema deve essere determinato');
	switch (lvl) {
		case 1:
			if (!intSol || !small(5)) v.push('livello 1: coefficienti fino a 5, soluzione intera fino a 6');
			break;
		case 2:
			if (!intSol || !small(5) || !s.some((l) => l.a.abs().isOne() || l.b.abs().isOne())) v.push('livello 2: un coefficiente ±1, soluzione intera');
			break;
		case 3:
			if (!sol || !nice(sol[0], 6, 30) || !nice(sol[1], 6, 30)) v.push('livello 3: soluzione con denominatore fino a 6');
			break;
		case 4:
			if (!intSol || s.some((l) => l.a.abs().isOne() || l.b.abs().isOne())) v.push('livello 4: nessun coefficiente ±1, soluzione intera');
			if (sol && sol[0].sign() >= 0 && sol[1].sign() >= 0) v.push('livello 4: serve una coordinata negativa');
			break;
		case 5:
			if (!intSol || !sample.problem.includes('\\dfrac')) v.push('livello 5: denominatori numerici, soluzione intera');
			break;
		case 6:
			if (sample.params.kind !== kind) v.push(`caso ${String(sample.params.kind)} ma il sistema è ${kind}`);
			if (coefs.some((r) => r.isZero())) v.push('livello 6: coefficienti e termini noti diversi da zero');
			break;
		case 7:
			if (!ce.length || !sample.problem.includes('\\dfrac')) v.push('livello 7: serve un sistema fratto con le C.E.');
			if (sample.params.kind !== (optKey(truth) === '' ? 'non accettabile' : 'accettabile')) v.push('livello 7: caso sbagliato');
			break;
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	return v;
}

const sistemiDiEquazioni: Generator = {
	id: ID,
	title: 'Sistemi di due equazioni in due incognite',
	levels: {
		1: { label: 'Riconoscere la soluzione', constraints: ['quattro coppie: la soluzione, la coppia scambiata, una coppia che risolve una sola equazione'] },
		2: { label: 'Metodo di sostituzione', constraints: ['un coefficiente 1 o -1', 'soluzione intera tra -6 e 6'] },
		3: { label: 'Metodo del confronto', constraints: ['y = m1 x + q1 e y = m2 x + q2 (o con x ricavata)', 'soluzione anche frazionaria, denominatore fino a 6'] },
		4: { label: 'Metodo di riduzione', constraints: ['nessun coefficiente ±1', '3 su 10 con coefficienti già uguali od opposti', 'soluzione intera con una coordinata negativa'] },
		5: { label: 'Denominatori e parentesi', constraints: ['equazioni con denominatori numerici o parentesi da portare in forma normale', 'soluzione intera'] },
		6: { label: 'Determinato, impossibile o indeterminato', constraints: ['2 su 10 determinati, 4 su 10 impossibili, 4 su 10 indeterminati', 'rapporti dei coefficienti'] },
		7: { label: 'Sistemi fratti', constraints: ['C.E. su x e y', '6 su 10 soluzione accettabile, 4 su 10 non accettabile'] },
	},
	generate(rng: Rng, level: number): Sample {
		const u = rng.next();
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = build(rng, level, u);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample): ChoiceAnswer {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: answer is always a choice`);
		return sample.answer;
	},
};

export default sistemiDiEquazioni;
