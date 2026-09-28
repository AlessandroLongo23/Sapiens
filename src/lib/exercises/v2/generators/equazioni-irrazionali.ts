/**
 * Equazioni e disequazioni irrazionali. Spec: specs/exercises/equazioni-irrazionali.md
 *
 * Nine levels in the order of lesson 92 (docs/lezioni/riscritte/92-equazioni-irrazionali.md): a root equal to a
 * number, a root equal to a first-degree expression, a radical to isolate first, the condition on the second
 * member (a negative solution that stays, a resolvent of first degree), two radicals, a cube root, inequalities
 * with a number, a root less than an expression, a root greater than an expression.
 *
 * Built backwards: the solutions of the squared (or cubed) equation are chosen first, the problem is written
 * from them. The truth does not come from the construction: the candidates are the rational roots of the
 * resolvent, and each one is put back into the equation of the problem with exact rationals, the square root
 * defined only where the radicand is not negative. The inequalities are solved by testing every region and
 * every critical point with the same exact rule. Equations answer with a set of values and have a
 * multiple-choice variant; inequalities answer with a choice among unions of intervals, written as in lessons
 * 88 and 89. Wrong options are the mistakes named in the lesson's warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, ZERO, exactSqrt, gcd, q } from '../rational';
import { polyDegree, polyToLatex, type Poly } from '../latex';
import { forbidden, shuffle } from '../monomi';

export const ID = 'equazioni-irrazionali';

// ---------------------------------------------------------------------------
// Polynomials with rational coefficients

const P = (...cs: number[]): Poly => cs.map((c) => q(c));
const co = (p: Poly, i: number) => p[i] ?? ZERO;
const padd = (a: Poly, b: Poly): Poly => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => co(a, i).add(co(b, i)));
const pneg = (a: Poly): Poly => a.map((c) => c.neg());
const psub = (a: Poly, b: Poly): Poly => padd(a, pneg(b));
const pscale = (a: Poly, k: Rational): Poly => a.map((c) => c.mul(k));
function pmul(a: Poly, b: Poly): Poly {
	const out: Poly = Array.from({ length: a.length + b.length - 1 }, () => ZERO);
	a.forEach((x, i) => b.forEach((y, j) => (out[i + j] = out[i + j].add(x.mul(y)))));
	return out;
}
const pl = (p: Poly) => polyToLatex(p);
const deg = (p: Poly) => polyDegree(p);
const lin = (m: number, n: number): Poly => P(n, m);
/** A first-degree second member as the lesson writes it: 7 - x, not -x + 7. */
function pn(p: Poly): string {
	if (deg(p) === 1 && co(p, 1).sign() < 0 && co(p, 0).sign() > 0) return `${co(p, 0).toLatex()} - ${pl([ZERO, co(p, 1).neg()])}`;
	return pl(p);
}

function evalP(p: Poly, x: Rational): Rational {
	let r = ZERO;
	for (let i = p.length - 1; i >= 0; i--) r = r.mul(x).add(co(p, i));
	return r;
}

function uniqSorted(xs: Rational[]): Rational[] {
	const out: Rational[] = [];
	for (const v of [...xs].sort((a, b) => a.compare(b))) if (!out.length || !out[out.length - 1].equals(v)) out.push(v);
	return out;
}

/**
 * Real zeros of a polynomial of degree at most 2, ascending and distinct; null if they are irrational or the
 * polynomial is zero (every x).
 */
function rootsOf(p: Poly): Rational[] | null {
	const d = deg(p);
	if (d === -1) return null;
	if (d === 0) return [];
	if (d === 1) return [co(p, 0).neg().div(co(p, 1))];
	if (d > 2) return null;
	const [c, b, a] = [co(p, 0), co(p, 1), co(p, 2)];
	const D = b.mul(b).sub(q(4).mul(a).mul(c));
	if (D.sign() < 0) return [];
	const s = exactSqrt(D);
	if (!s) return null;
	const den = a.mul(q(2));
	return uniqSorted([b.neg().sub(s).div(den), b.neg().add(s).div(den)]);
}

/** Leading coefficient positive, integer coefficients divided by their gcd: the resolvent as the lesson writes it. */
function normalize(p: Poly): Poly {
	const d = deg(p);
	if (d < 0) return p;
	let out = co(p, d).sign() < 0 ? pneg(p) : p;
	out = out.slice(0, d + 1);
	if (out.every((c) => c.isInteger())) {
		const g = out.reduce((s, c) => gcd(s, Math.abs(c.num)), 0);
		if (g > 1) out = pscale(out, q(1, g));
	}
	return out;
}

const polyJSON = (p: Poly) => p.slice(0, Math.max(deg(p) + 1, 1)).map((c) => c.toString());
const polyFrom = (xs: unknown): Poly | null => (Array.isArray(xs) && xs.every((s) => typeof s === 'string') ? (xs as string[]).map((s) => Rational.parse(s)) : null);

// ---------------------------------------------------------------------------
// Relations and intervals

type Op = '<' | '>' | '<=' | '>=';
type Rel = '=' | Op;
const OP_LATEX: Record<Rel, string> = { '=': '=', '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const greater = (o: Rel) => o === '>' || o === '>=';

function holds(l: Rational, o: Rel, r: Rational): boolean {
	const c = l.compare(r);
	switch (o) {
		case '=':
			return c === 0;
		case '<':
			return c < 0;
		case '>':
			return c > 0;
		case '<=':
			return c <= 0;
		case '>=':
			return c >= 0;
	}
}

/** √a rel b for rationals, the root defined only for a ≥ 0 and never negative. */
function sqrtRel(a: Rational, o: Rel, b: Rational): boolean {
	if (a.sign() < 0) return false;
	if (o === '=') return b.sign() >= 0 && a.equals(b.mul(b));
	if (b.sign() < 0) return greater(o);
	return holds(a, o, b.mul(b));
}

/** An interval; null is -∞ at the left and +∞ at the right. lo = hi, both closed, is a point. */
interface Iv {
	lo: Rational | null;
	hi: Rational | null;
	loC: boolean;
	hiC: boolean;
}

/** Every zero of the polynomials, or null if one is irrational. Constant polynomials have none. */
function critOf(ps: Poly[]): Rational[] | null {
	const out: Rational[] = [];
	for (const p of ps) {
		if (deg(p) <= 0) continue;
		const r = rootsOf(p);
		if (!r) return null;
		out.push(...r);
	}
	return uniqSorted(out);
}

/**
 * The set where `pred` holds, as ordered intervals, given every point where it can change: each open region
 * between two critical points is tested at its midpoint, each point on its own.
 */
function solveBy(pred: (x: Rational) => boolean, crit: Rational[]): Iv[] {
	const zs = uniqSorted(crit);
	const n = zs.length;
	const probe = (j: number) => (n === 0 ? ZERO : j === 0 ? zs[0].sub(q(1)) : j === n ? zs[n - 1].add(q(1)) : zs[j - 1].add(zs[j]).div(q(2)));
	const sel = Array.from({ length: n + 1 }, (_, j) => pred(probe(j)));
	const inc = zs.map(pred);
	const on = (i: number) => (i % 2 === 0 ? sel[i / 2] : inc[(i - 1) / 2]);
	const out: Iv[] = [];
	let i = 0;
	while (i <= 2 * n) {
		if (!on(i)) {
			i++;
			continue;
		}
		let j = i;
		while (j + 1 <= 2 * n && on(j + 1)) j++;
		const lo = i % 2 === 0 ? (i === 0 ? null : zs[i / 2 - 1]) : zs[(i - 1) / 2];
		const hi = j % 2 === 0 ? (j === 2 * n ? null : zs[j / 2]) : zs[(j - 1) / 2];
		out.push({ lo, hi, loC: i % 2 === 1, hiC: j % 2 === 1 });
		i = j + 1;
	}
	return out;
}

/** solveBy with the zeros of the given polynomials as critical points; null if one is irrational. */
function solveWith(pred: (x: Rational) => boolean, ps: Poly[]): Iv[] | null {
	const crit = critOf(ps);
	return crit ? solveBy(pred, crit) : null;
}

const endKey = (r: Rational | null, inf: string) => (r ? r.toString() : inf);
/** "(-oo,-3)", "[1,oo)", "[2,2]" for a point: the values of an option, one per interval. */
const ivValue = (iv: Iv) => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
const ivsKey = (ivs: Iv[]) => ivs.map(ivValue).join('|');
const isPoint = (iv: Iv) => !!iv.lo && !!iv.hi && iv.lo.equals(iv.hi);
const isAll = (ivs: Iv[]) => ivs.length === 1 && !ivs[0].lo && !ivs[0].hi;
const allBut = (ivs: Iv[]) => ivs.length === 2 && !ivs[0].lo && !ivs[1].hi && !!ivs[0].hi && !!ivs[1].lo && ivs[0].hi.equals(ivs[1].lo) && !ivs[0].hiC && !ivs[1].loC;
const special = (ivs: Iv[]) => !ivs.length || isAll(ivs) || allBut(ivs) || ivs.every(isPoint);

// ---------------------------------------------------------------------------
// Writing sets and intervals

type Notation = 'disequazioni' | 'intervalli';
const nonInteger = (r: Rational | null) => !!r && !r.isInteger();

/** ]-1, 4[ as \mathopen{]}-1, 4\mathclose{[}; \left] \right[ around fractions, as in lesson 88. */
function intervalLatex(iv: Iv): string {
	const lo = iv.lo ? iv.lo.toLatex() : '-\\infty';
	const hi = iv.hi ? iv.hi.toLatex() : '+\\infty';
	if (nonInteger(iv.lo) || nonInteger(iv.hi)) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** Two intervals with a fraction go one per line. */
const wide = (ivs: Iv[]) => ivs.length === 2 && ivs.some((iv) => nonInteger(iv.lo) || nonInteger(iv.hi));

function setLatex(ivs: Iv[]): string {
	if (!ivs.length) return 'S = \\emptyset';
	if (isAll(ivs)) return 'S = \\mathbb{R}';
	if (allBut(ivs)) return `S = \\mathbb{R} \\setminus \\{${ivs[0].hi!.toLatex()}\\}`;
	if (ivs.every(isPoint)) return `S = \\{${ivs.map((iv) => iv.lo!.toLatex()).join(', ')}\\}`;
	const w = wide(ivs);
	const parts = ivs.map((iv, i) => {
		const t = intervalLatex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}') && !w) s += '\\,';
		return s;
	});
	if (w) return `\\begin{gathered} S = ${parts[0]} \\\\ \\cup ${parts[1]} \\end{gathered}`;
	return `S = ${parts.join(' \\cup ')}`;
}

/** x < -3, x \geq 1, -1 < x \leq 4, x = 2. */
function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (isPoint(iv)) return `x = ${iv.lo!.toLatex()}`;
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi!.toLatex()}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo.toLatex()}`;
	return `${iv.lo.toLatex()} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi.toLatex()}`;
}

const OPPURE = ' \\ \\text{ oppure } \\ ';
const disLatex = (ivs: Iv[]) => ivs.map(pieceLatex).join(OPPURE);
const optionLatex = (ivs: Iv[], n: Notation) => (n === 'intervalli' || special(ivs) ? setLatex(ivs) : disLatex(ivs));

/** A solution in a step: "ogni x", "nessun x", x ≠ r, or the inequalities. */
function solText(ivs: Iv[]): string {
	if (!ivs.length) return '\\text{nessun } x';
	if (isAll(ivs)) return '\\text{ogni } x';
	if (allBut(ivs)) return `x \\neq ${ivs[0].hi!.toLatex()}`;
	return disLatex(ivs);
}

function lastStep(ivs: Iv[]): string {
	if (!ivs.length) return '\\text{Nessun } x \\text{ è soluzione.}';
	if (isAll(ivs)) return '\\text{Ogni } x \\text{ è soluzione.}';
	if (allBut(ivs)) return `x \\neq ${ivs[0].hi!.toLatex()}`;
	return disLatex(ivs);
}

/** A set of values: S = \{-2, 3\}, \left\{ \right\} with a fraction, S = \emptyset. */
function valuesLatex(vs: Rational[]): string {
	if (!vs.length) return 'S = \\emptyset';
	const u = uniqSorted(vs);
	const body = u.map((v) => v.toLatex()).join(', ');
	return u.some((v) => !v.isInteger()) ? `S = \\left\\{${body}\\right\\}` : `S = \\{${body}\\}`;
}

// ---------------------------------------------------------------------------
// The problem

/**
 * sqrt: √A rel B. cbrt: ∛A = B. iso: T + √A = B (or √A + T = B), T = px. rr: √A = √C (written in the
 * other order when `swap`). sum: √A + √C = B, B a number.
 */
type Kind = 'sqrt' | 'cbrt' | 'iso' | 'rr' | 'sum';

interface Problem {
	kind: Kind;
	A: Poly;
	B: Poly;
	C?: Poly;
	T?: Poly;
	before?: boolean;
	swap?: boolean;
	rel: Rel;
}

const rad = (p: Poly) => `\\sqrt{${pl(p)}}`;
const cbrt = (p: Poly) => `\\sqrt[3]{${pl(p)}}`;

function problemLatex(pr: Problem): string {
	const r = OP_LATEX[pr.rel];
	switch (pr.kind) {
		case 'sqrt':
			return `${rad(pr.A)} ${r} ${pn(pr.B)}`;
		case 'cbrt':
			return `${cbrt(pr.A)} = ${pl(pr.B)}`;
		case 'iso': {
			const t = pr.T!;
			if (pr.before) return `${pl(t)} + ${rad(pr.A)} = ${pl(pr.B)}`;
			const neg = co(t, 1).sign() < 0;
			return `${rad(pr.A)} ${neg ? '-' : '+'} ${pl(neg ? pneg(t) : t)} = ${pl(pr.B)}`;
		}
		case 'rr':
			return pr.swap ? `${rad(pr.C!)} = ${rad(pr.A)}` : `${rad(pr.A)} = ${rad(pr.C!)}`;
		case 'sum':
			return `${rad(pr.A)} + ${rad(pr.C!)} = ${pl(pr.B)}`;
	}
}

/** The second member once the radical is alone: B, or B - T when a term has to be moved. */
const effB = (pr: Problem): Poly => (pr.kind === 'iso' ? psub(pr.B, pr.T!) : pr.B);

/** Does x solve the problem as written? Exact, with the square root defined only for non-negative radicands. */
function holdsAt(pr: Problem, x: Rational): boolean {
	const a = evalP(pr.A, x);
	switch (pr.kind) {
		case 'sqrt':
		case 'iso':
			return sqrtRel(a, pr.rel, evalP(effB(pr), x));
		case 'cbrt': {
			const b = evalP(pr.B, x);
			return a.equals(b.mul(b).mul(b));
		}
		case 'rr': {
			const c = evalP(pr.C!, x);
			return a.sign() >= 0 && c.sign() >= 0 && a.equals(c);
		}
		case 'sum': {
			const sa = exactSqrt(a);
			const sc = exactSqrt(evalP(pr.C!, x));
			return !!sa && !!sc && sa.add(sc).equals(evalP(pr.B, x));
		}
	}
}

/** The polynomial equation the lesson's squarings (or the cubing) lead to: its roots include every solution. */
function resolvent(pr: Problem): Poly {
	switch (pr.kind) {
		case 'sqrt':
		case 'iso': {
			const B = effB(pr);
			return psub(pr.A, pmul(B, B));
		}
		case 'cbrt':
			return psub(pr.A, pmul(pmul(pr.B, pr.B), pr.B));
		case 'rr':
			return psub(pr.A, pr.C!);
		case 'sum': {
			// √A = k - √C ⇒ A = k² - 2k√C + C ⇒ 2k√C = k² + C - A ⇒ 4k²C = (k² + C - A)²
			const k = co(pr.B, 0);
			const R = padd(psub(pr.C!, pr.A), [k.mul(k)]);
			return psub(pscale(pr.C!, q(4).mul(k).mul(k)), pmul(R, R));
		}
	}
}

/** Solutions of an equation: the rational roots of the resolvent that solve the problem as written. */
function solveEquation(pr: Problem): { roots: Rational[]; truth: Rational[] } | null {
	const f = resolvent(pr);
	if (deg(f) > 2) return null;
	const roots = rootsOf(f);
	if (!roots) return null;
	return { roots, truth: roots.filter((r) => holdsAt(pr, r)) };
}

/** Solutions of an inequality √A op B (B may be a number). */
function solveInequality(pr: Problem): Iv[] | null {
	const B = pr.B;
	return solveWith((x) => holdsAt(pr, x), [pr.A, B, psub(pr.A, pmul(B, B))]);
}

// ---------------------------------------------------------------------------
// Steps

const IMPLIES = ' \\Rightarrow ';

/** The roots of f = 0 as the lesson writes them. */
function rootsText(f: Poly): string {
	const d = deg(f);
	if (d <= 0) return '\\text{impossibile}';
	const rs = rootsOf(f)!;
	if (d === 1) return `x = ${rs[0].toLatex()}`;
	if (!rs.length) return '\\Delta < 0\\text{: nessuna soluzione}';
	if (rs.length === 1) return `x_1 = x_2 = ${rs[0].toLatex()}`;
	return `x_1 = ${rs[0].toLatex()}, \\quad x_2 = ${rs[1].toLatex()}`;
}

/** L = R ⇒ … ⇒ x = …: an equation without radicals, solved as in the lesson. */
function eqLine(L: Poly, R: Poly): string {
	const head = `${pl(L)} = ${pl(R)}`;
	const f = psub(L, R);
	const d = deg(f);
	if (d <= 0) return `${head}${IMPLIES}\\text{impossibile}`;
	if (d === 1) {
		const x = co(f, 0).neg().div(co(f, 1));
		if (deg(R) <= 0 && deg(L) === 1 && !co(L, 1).isOne() && !co(L, 0).isZero()) return `${head}${IMPLIES}${pl([ZERO, co(L, 1)])} = ${co(R, 0).sub(co(L, 0)).toLatex()}${IMPLIES}x = ${x.toLatex()}`;
		return `${head}${IMPLIES}x = ${x.toLatex()}`;
	}
	// pure: x^2 + c = k ⇒ x^2 = k - c
	if (co(f, 1).isZero() && co(f, 2).isOne() && deg(R) <= 0 && co(L, 1).isZero()) {
		const v = co(f, 0).neg();
		const left = `${head}${IMPLIES}x^2 = ${v.toLatex()}`;
		if (v.sign() < 0) return `${left}${IMPLIES}\\text{impossibile}`;
		if (v.isZero()) return `${left}${IMPLIES}x = 0`;
		return `${left}${IMPLIES}x = \\pm ${exactSqrt(v)!.toLatex()}`;
	}
	const n = normalize(f);
	if (deg(R) === -1 && pl(n) === pl(L)) return `${head}${IMPLIES}${rootsText(n)}`;
	return `${head}${IMPLIES}${pl(n)} = 0${IMPLIES}${rootsText(n)}`;
}

/** B ≥ 0 solved, for B = mx + n. */
function conditionLine(B: Poly): string {
	const m = co(B, 1);
	const z = co(B, 0).neg().div(m);
	return `\\text{Condizione: } ${pn(B)} \\geq 0\\text{, cioè } x ${m.sign() > 0 ? '\\geq' : '\\leq'} ${z.toLatex()}\\text{.}`;
}

/** Which candidates the condition keeps. */
function verdictLine(cands: Rational[], keep: (x: Rational) => boolean): string {
	const kept = cands.filter(keep);
	const out = cands.filter((c) => !keep(c));
	const list = (vs: Rational[]) => vs.map((v) => `x = ${v.toLatex()}`).join(vs.length === 2 ? ' \\text{ e } ' : ', \\ ');
	const many = (vs: Rational[], one: string, more: string) => (vs.length > 1 ? more : one);
	if (!cands.length) return '\\text{Nessun candidato: l\'equazione è impossibile.}';
	if (!out.length) return `${list(kept)} \\text{ ${many(kept, 'rispetta', 'rispettano')} la condizione: ${many(kept, 'è accettata', 'sono accettate')}.}`;
	const head = `${list(out)} \\text{ non ${many(out, 'rispetta', 'rispettano')} la condizione e si ${many(out, 'scarta', 'scartano')}}`;
	if (!kept.length) return `${head}\\text{: l'equazione è impossibile.}`;
	return `${head}\\text{; } ${list(kept)} \\text{ la ${many(kept, 'rispetta', 'rispettano')}.}`;
}

/** (x - 1)^2 = x^2 - 2x + 1; a number is squared directly. */
function squareLatex(B: Poly): string {
	if (deg(B) <= 0) return `${co(B, 0).mul(co(B, 0)).toLatex()}`;
	return `(${pn(B)})^2`;
}

/** Condition, squaring, resolvent, roots, verdict: √A = B with B of first degree. */
function squareSteps(A: Poly, B: Poly): string[] {
	const B2 = pmul(B, B);
	const f = normalize(psub(A, B2));
	const rs = rootsOf(f) ?? [];
	return [
		conditionLine(B),
		`\\text{Eleva al quadrato: } ${pl(A)} = ${squareLatex(B)}`,
		`${pl(A)} = ${pl(B2)}${IMPLIES}${pl(f)} = 0`,
		rootsText(f),
		verdictLine(rs, (x) => evalP(B, x).sign() >= 0),
	];
}


// ---------------------------------------------------------------------------
// Levels

interface Cand {
	tag: string;
	values: Rational[];
}
interface IvCand {
	tag: string;
	ivs: Iv[] | null;
}

interface Build {
	kind: string;
	pr: Problem;
	steps: string[];
	/** Equations: the wrong sets in order of preference. */
	cands?: Cand[];
	/** Inequalities: the wrong unions of intervals in order of preference. */
	ivCands?: IvCand[];
}

const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};
const small = (vs: Rational[], den: number, max: number) => vs.every((v) => v.den <= den && Math.abs(v.num / v.den) <= max);
const smallCoefs = (p: Poly, max: number) => p.every((c) => c.isInteger() && Math.abs(c.num) <= max);

/** The same case drawn again until it gives a sample, so that rejections do not change the share of the cases. */
function retry(f: () => Build | null): Build | null {
	for (let i = 0; i < 3000; i++) {
		const b = f();
		if (b) return b;
	}
	return null;
}

/** The roots of p, or none when they are irrational or p is zero: a distractor that does not come out is skipped. */
const rootsOr = (p: Poly): Rational[] | null => rootsOf(p);
const cand = (tag: string, values: Rational[] | null): Cand | null => (values ? { tag, values: uniqSorted(values) } : null);
const nonNull = <T>(xs: (T | null)[]): T[] => xs.filter((x): x is T => x !== null);

// Level 1: √A = k
function level1(rng: Rng): Maker {
	const u = rng.next();
	const kind = u < 0.6 ? 'k positivo' : u < 0.8 ? 'k negativo' : 'k nullo';
	const quad = rng.next() < 0.4;
	return () => level1Form(rng, kind, quad);
}

function level1Form(rng: Rng, kind: string, quad: boolean): Build | null {
	let A: Poly;
	let k: number;
	const steps: string[] = [];
	if (kind === 'k nullo') {
		// x^2 + px + c with two integer zeros, not opposite
		const r1 = rng.int(-7, 7);
		const r2 = intIn(rng, -7, 7, [r1, -r1]);
		A = P(r1 * r2, -(r1 + r2), 1);
		k = 0;
	} else if (quad) {
		// x^2 + c = k^2 with the solutions ±s
		k = kind === 'k positivo' ? rng.int(1, 7) : -rng.int(1, 6);
		const s = rng.int(1, 8);
		const c = k * k - s * s;
		if (c === 0 || Math.abs(c) > 45) return null;
		A = P(c, 0, 1);
	} else {
		k = kind === 'k positivo' ? rng.int(1, 7) : -rng.int(2, 6);
		const a = rng.pick([1, 1, 2, 3, 4, 5]);
		const x0 = rng.int(-9, 12);
		const b = k * k - a * x0;
		if (b === 0 || Math.abs(b) > 40) return null;
		A = P(b, a);
	}
	const pr: Problem = { kind: 'sqrt', A, B: P(k), rel: '=' };
	const K = q(k);
	const at = (v: Rational) => rootsOr(psub(A, [v]));
	let cands: Cand[];
	if (k > 0) {
		steps.push(`\\text{Il secondo membro è positivo: eleva al quadrato.}`);
		steps.push(eqLine(A, P(k * k)));
		steps.push(`\\text{Le soluzioni vanno bene tutte: in ognuna il radicando vale } ${k * k}\\text{, e } \\sqrt{${k * k}} = ${k}\\text{.}`);
		const sq = at(K.mul(K))!;
		cands = nonNull([
			quad ? cand('una sola', sq.filter((v) => v.sign() >= 0)) : null,
			cand('senza quadrato', at(K)),
			cand('doppio', at(K.mul(q(2)))),
			quad ? null : cand('opposti', sq.map((v) => v.neg())),
			cand('vuoto', []),
		]);
	} else if (k === 0) {
		steps.push(`\\text{Il secondo membro è zero: la radice vale zero solo dove vale zero il radicando.}`);
		steps.push(eqLine(A, P(0)));
		const sq = at(ZERO)!;
		cands = nonNull([cand('vuoto', []), cand('una sola', [sq[sq.length - 1]]), cand('opposti', sq.map((v) => v.neg()))]);
	} else {
		steps.push(`\\text{Il secondo membro è negativo: una radice quadrata non è mai negativa, quindi l'equazione è impossibile.}`);
		const sq = at(K.mul(K));
		if (!sq || !sq.length) return null;
		cands = nonNull([
			cand('quadrato', sq),
			quad ? cand('una sola', sq.filter((v) => v.sign() >= 0)) : null,
			cand('senza quadrato', at(K)),
			cand('modulo', at(K.neg())),
		]);
	}
	return { kind, pr, steps, cands };
}

/** B = mx + n and the zeros r1, r2 of B² - A: A = B² - m²(x - r1)(x - r2). */
function radicandFor(m: number, n: number, r1: number, r2: number): Poly {
	return P(n * n - m * m * r1 * r2, 2 * m * n + m * m * (r1 + r2));
}

/** The distractors of √A = B with B of first degree. */
function linearCands(A: Poly, B: Poly, roots: Rational[], truth: Rational[]): Cand[] {
	const m = co(B, 1);
	const n = co(B, 0);
	const noDouble = rootsOr(psub(A, [n.mul(n), ZERO, m.mul(m)]));
	return nonNull([
		cand('tutte', roots),
		cand('estranee', roots.filter((r) => !truth.some((t) => t.equals(r)))),
		cand('x positive', roots.filter((r) => r.sign() >= 0)),
		cand('senza doppio prodotto', noDouble && noDouble.length ? noDouble : null),
		cand('vuoto', []),
		cand('una sola', roots.length ? [roots[roots.length - 1]] : null),
	]);
}

// Level 2: √(ax + b) = mx + n
function level2(rng: Rng): Maker {
	const both = rng.next() < 0.2;
	return () => level2Form(rng, both);
}

function level2Form(rng: Rng, both: boolean): Build | null {
	const m = rng.pick([1, 1, 1, 2]);
	const n = rng.int(-8, 8);
	const r1 = rng.int(-9, 14);
	const r2 = intIn(rng, -9, 14, [r1]);
	const A = radicandFor(m, n, r1, r2);
	if (co(A, 1).sign() <= 0 || co(A, 1).num > 20 || Math.abs(co(A, 0).num) > 50) return null;
	const B = lin(m, n);
	const pr: Problem = { kind: 'sqrt', A, B, rel: '=' };
	const s = solveEquation(pr);
	if (!s || s.roots.length !== 2) return null;
	if (both ? s.truth.length !== 2 || s.roots.every((r) => r.sign() >= 0) : s.truth.length !== 1) return null;
	return { kind: both ? 'due accettate' : 'una estranea', pr, steps: squareSteps(A, B), cands: linearCands(A, B, s.roots, s.truth) };
}

// Level 3: px + √A = n, or √A + px = n
function level3(rng: Rng): Maker {
	const before = rng.next() < 0.5;
	return () => level3Form(rng, before);
}

function level3Form(rng: Rng, before: boolean): Build | null {
	const p = before ? rng.pick([1, 1, 2]) : rng.pick([1, 2, -1, -1, -2]);
	const N = before ? rng.int(1, 12) : rng.int(-6, 12);
	if (N === 0) return null;
	// √A = N - px: B = -px + N
	const r1 = rng.int(-6, 14);
	const r2 = intIn(rng, -6, 14, [r1]);
	const A = radicandFor(-p, N, r1, r2);
	if (co(A, 1).sign() <= 0 || co(A, 1).num > 15 || Math.abs(co(A, 0).num) > 50) return null;
	const T = P(0, p);
	const pr: Problem = { kind: 'iso', A, B: P(N), T, before, rel: '=' };
	const s = solveEquation(pr);
	if (!s || s.roots.length !== 2 || s.truth.length !== 1) return null;
	const B = effB(pr);
	// moving px without changing its sign: √A = N + px, with its own condition
	const wrongB = padd(P(N), T);
	const wr = rootsOr(psub(A, pmul(wrongB, wrongB)));
	const cands = linearCands(A, B, s.roots, s.truth);
	const sign = cand('segno', wr ? wr.filter((x) => evalP(wrongB, x).sign() >= 0) : null);
	if (sign && sign.values.length) cands.splice(2, 0, sign);
	return {
		kind: before ? 'termine prima' : 'termine dopo',
		pr,
		steps: [`\\text{Isola il radicale: } ${rad(A)} = ${pn(B)}`, ...squareSteps(A, B)],
		cands,
	};
}

// Level 4: the condition on B keeps a negative solution, or a resolvent of first degree
function level4(rng: Rng): Maker {
	const neg = rng.next() < 0.6;
	return () => (neg ? level4Negative(rng) : level4First(rng));
}

function level4Negative(rng: Rng): Build | null {
	const m = rng.pick([-1, -1, -1, -2]);
	const n = rng.int(-3, 4);
	const r1 = rng.int(-9, 9);
	const r2 = intIn(rng, -9, 9, [r1]);
	const A = radicandFor(m, n, r1, r2);
	if (co(A, 1).sign() <= 0 || co(A, 1).num > 15 || Math.abs(co(A, 0).num) > 40 || co(A, 0).isZero()) return null;
	const B = lin(m, n);
	const pr: Problem = { kind: 'sqrt', A, B, rel: '=' };
	const s = solveEquation(pr);
	if (!s || s.roots.length !== 2 || s.truth.length !== 1 || s.truth[0].sign() >= 0) return null;
	// the other root positive: the condition on x would keep it
	if (!s.roots.some((r) => r.sign() > 0)) return null;
	return {
		kind: 'soluzione negativa',
		pr,
		steps: [...squareSteps(A, B), `\\text{La soluzione è negativa, ma va bene: la condizione riguarda il secondo membro, non la } x\\text{.}`],
		cands: linearCands(A, B, s.roots, s.truth),
	};
}

function level4First(rng: Rng): Build | null {
	// √(x^2 + px + c) = x + n: the x^2 cancel, (p - 2n)x = n^2 - c
	const impossible = rng.next() < 0.65;
	return retry(() => {
		const p = rng.int(-6, 6);
		const n = intIn(rng, -5, 5, [0]);
		const c = intIn(rng, -20, 20, [0]);
		if (p === 2 * n) return null;
		const A = P(c, p, 1);
		const B = lin(1, n);
		const pr: Problem = { kind: 'sqrt', A, B, rel: '=' };
		const s = solveEquation(pr);
		if (!s || s.roots.length !== 1 || !small(s.roots, 3, 12)) return null;
		if (impossible !== (s.truth.length === 0)) return null;
		const x0 = s.roots[0];
		const N = q(n);
		const noDouble = rootsOr(psub(A, [N.mul(N), ZERO, q(1)]));
		const half = rootsOr(psub(A, [N.mul(N), N, q(1)]));
		const cands = nonNull([
			cand('tutte', s.roots),
			cand('vuoto', []),
			cand('senza doppio prodotto', noDouble && noDouble.length ? noDouble : null),
			cand('doppio prodotto a metà', half && half.length ? half : null),
			x0.isZero() ? null : cand('opposti', [x0.neg()]),
		]);
		const B2 = pmul(B, B);
		const steps = [
			conditionLine(B),
			`\\text{Eleva al quadrato: } ${pl(A)} = ${squareLatex(B)}`,
			`${pl(A)} = ${pl(B2)}`,
			`\\text{I termini } x^2 \\text{ si cancellano: } ${eqLine(psub(A, P(0, 0, 1)), psub(B2, P(0, 0, 1)))}`,
			verdictLine(s.roots, (x) => evalP(B, x).sign() >= 0),
		];
		return { kind: 'primo grado', pr, steps, cands };
	});
}

// Level 5: √A = √C, or √A + √C = k
function level5(rng: Rng): Maker {
	const equal = rng.next() < 0.5;
	return () => (equal ? level5Equal(rng) : level5Sum(rng));
}

function level5Equal(rng: Rng): Build | null {
	// A = x^2 + px + c, C = ax + b, A - C = (x - r1)(x - r2): one root with C < 0
	const a = rng.pick([1, 2, 3, 4]);
	const b = rng.int(-6, 6);
	const r1 = rng.int(-6, 8);
	const r2 = intIn(rng, -6, 8, [r1]);
	const C = P(b, a);
	const A = padd(C, P(r1 * r2, -(r1 + r2), 1));
	if (!smallCoefs(A, 30) || co(A, 1).isZero() && co(A, 0).isZero()) return null;
	const pr: Problem = { kind: 'rr', A, B: P(0), C, rel: '=', swap: rng.next() < 0.3 };
	const s = solveEquation(pr);
	if (!s || s.roots.length !== 2 || s.truth.length !== 1) return null;
	const steps = [
		`\\text{Il radicando più semplice è } ${pl(C)}\\text{. Condizione: } ${pl(C)} \\geq 0\\text{, cioè } x \\geq ${co(C, 0).neg().div(co(C, 1)).toLatex()}\\text{.}`,
		`\\text{Eleva al quadrato: } ${eqLine(A, C)}`,
		verdictLine(s.roots, (x) => evalP(C, x).sign() >= 0),
	];
	return { kind: 'radici uguali', pr, steps, cands: linearCands(A, P(0, 1), s.roots, s.truth).filter((c) => c.tag !== 'senza doppio prodotto') };
}

function level5Sum(rng: Rng): Build | null {
	// √(ax + b) + √(cx + d) = s + t, with ax0 + b = s², cx0 + d = t²
	const a = rng.pick([1, 2, 3, 4]);
	const c = intIn(rng, 1, 4, [a]);
	const x0 = rng.int(-3, 12);
	const s = rng.int(1, 6);
	const t = rng.int(1, 6);
	const A = P(s * s - a * x0, a);
	const C = P(t * t - c * x0, c);
	if (co(A, 0).isZero() || co(C, 0).isZero() || Math.abs(co(A, 0).num) > 40 || Math.abs(co(C, 0).num) > 40) return null;
	const k = s + t;
	const pr: Problem = { kind: 'sum', A, B: P(k), C, rel: '=' };
	const sol = solveEquation(pr);
	if (!sol || sol.roots.length !== 2 || sol.truth.length !== 1 || !sol.truth[0].equals(q(x0))) return null;
	const x1 = sol.roots.find((r) => !r.equals(q(x0)))!;
	if (!small([x1], 4, 150)) return null;
	const K = q(k);
	const R = padd(psub(C, A), [K.mul(K)]);
	const f = normalize(resolvent(pr));
	const verify = (x: Rational) => {
		const va = evalP(A, x);
		const vc = evalP(C, x);
		const head = `x = ${x.toLatex()}\\text{: }`;
		if (va.sign() < 0 || vc.sign() < 0) return `${head}\\text{un radicando è negativo, falso.}`;
		const sa = exactSqrt(va);
		const sc = exactSqrt(vc);
		const sum = `\\sqrt{${va.toLatex()}} + \\sqrt{${vc.toLatex()}}`;
		if (sa && sc) {
			const tot = sa.add(sc);
			return `${head}${sum} = ${sa.toLatex()} + ${sc.toLatex()} = ${tot.toLatex()}\\text{, ${tot.equals(K) ? 'vero' : 'falso'}.}`;
		}
		return `${head}${sum} \\neq ${k}\\text{, falso.}`;
	};
	const steps = [
		`\\text{Isola la prima radice: } ${rad(A)} = ${k} - ${rad(C)}`,
		`\\text{Eleva al quadrato: } ${pl(A)} = ${k * k} - ${2 * k}${rad(C)} + ${pl(C).startsWith('-') ? `(${pl(C)})` : pl(C)}`,
		`\\text{Isola la radice rimasta: } ${2 * k}${rad(C)} = ${pl(R)}`,
		`\\text{Eleva di nuovo al quadrato: } ${4 * k * k}(${pl(C)}) = ${deg(R) <= 0 ? squareLatex(R) : `(${pl(R)})^2`}`,
		`${pl(f)} = 0${IMPLIES}${rootsText(f)}`,
		`\\text{Verifica.}`,
		...sol.roots.map(verify),
	];
	const noDouble = rootsOr(psub(padd(A, C), [K.mul(K)]));
	const cands = nonNull([
		cand('tutte', sol.roots),
		cand('estranee', [x1]),
		cand('senza doppio prodotto', noDouble && noDouble.length ? noDouble : null),
		cand('vuoto', []),
	]);
	return { kind: 'somma', pr, steps, cands };
}

// Level 6: cube roots
function level6(rng: Rng): Maker {
	const binom = rng.next() < 0.7;
	return () => (binom ? level6Binomial(rng) : level6Number(rng));
}

function level6Binomial(rng: Rng): Build | null {
	// ∛(x^3 + px^2 + qx + r) = x + n with A - (x + n)^3 = K(x - r1)(x - r2)
	const n = intIn(rng, -3, 3, [0]);
	const K = rng.pick([-3, -2, -1, 1, 2, 3]);
	const r1 = rng.int(-5, 5);
	const r2 = intIn(rng, -5, 5, [r1]);
	const p = 3 * n + K;
	const qq = 3 * n * n - K * (r1 + r2);
	const r = n * n * n + K * r1 * r2;
	if (Math.abs(p) > 9 || Math.abs(qq) > 20 || Math.abs(r) > 40) return null;
	const A = P(r, qq, p, 1);
	const B = lin(1, n);
	const pr: Problem = { kind: 'cbrt', A, B, rel: '=' };
	const s = solveEquation(pr);
	if (!s || s.truth.length !== 2) return null;
	if (!s.truth.some((x) => evalP(B, x).sign() < 0)) return null;
	const B3 = pmul(pmul(B, B), B);
	const f = normalize(psub(A, B3));
	const noMiddle = rootsOr(psub(A, P(n * n * n, 0, 0, 1)));
	const cands = nonNull([
		cand('condizione', s.truth.filter((x) => evalP(B, x).sign() >= 0)),
		cand('cubo senza termini', noMiddle && noMiddle.length ? noMiddle : null),
		cand('opposti', s.truth.map((x) => x.neg())),
		cand('vuoto', []),
	]);
	const steps = [
		`\\text{Eleva al cubo tutti e due i membri: } ${pl(A)} = (${pl(B)})^3`,
		`(${pl(B)})^3 = ${pl(B3)}`,
		`${pl(A)} = ${pl(B3)}${IMPLIES}${pl(f)} = 0`,
		rootsText(f),
		`\\text{Elevare al cubo non aggiunge soluzioni: nessuna condizione, vanno bene tutte e due.}`,
	];
	return { kind: 'binomio', pr, steps, cands };
}

function level6Number(rng: Rng): Build | null {
	// ∛A = k, A = ax + b or x^2 + c, k negative 7 times out of 10
	const k = rng.next() < 0.7 ? -rng.int(1, 4) : rng.int(1, 4);
	const k3 = k * k * k;
	let A: Poly;
	if (rng.next() < 0.6) {
		const a = rng.pick([1, 1, 2, 3]);
		const x0 = rng.int(-9, 9);
		const b = k3 - a * x0;
		if (b === 0 || Math.abs(b) > 70) return null;
		A = P(b, a);
	} else {
		const s = rng.int(1, 8);
		const c = k3 - s * s;
		if (c === 0 || Math.abs(c) > 70) return null;
		A = P(c, 0, 1);
	}
	const pr: Problem = { kind: 'cbrt', A, B: P(k), rel: '=' };
	const s = solveEquation(pr);
	if (!s || !s.truth.length) return null;
	const K = q(k);
	const at = (v: Rational) => rootsOr(psub(A, [v]));
	const sq = at(K.mul(K));
	const cands = nonNull([
		k < 0 ? cand('vuoto', []) : null,
		cand('quadrato', sq && sq.length ? sq : null),
		deg(A) === 2 ? cand('una sola', s.truth.filter((x) => x.sign() >= 0)) : null,
		cand('senza radice', at(K)),
		cand('triplo', at(K.mul(q(3)))),
	]);
	const steps = [
		`\\text{Eleva al cubo tutti e due i membri: } ${pl(A)} = ${k < 0 ? `(${k})^3` : `${k}^3`}`,
		eqLine(A, P(k3)),
		k < 0
			? `\\text{Una radice cubica può essere negativa: le soluzioni vanno bene, senza condizioni.}`
			: `\\text{Elevare al cubo non aggiunge soluzioni: vanno bene tutte.}`,
	];
	return { kind: 'numero', pr, steps, cands };
}

// Level 7: √A op k
const OPS_LESS: Op[] = ['<', '<='];
const OPS_MORE: Op[] = ['>', '>='];
const ALL_OPS: Op[] = ['<', '<=', '>', '>='];

function level7(rng: Rng): Maker {
	const u = rng.next();
	const kind = u < 0.6 ? 'k positivo' : u < 0.85 ? 'k negativo' : 'k nullo';
	const quad = kind === 'k positivo' && rng.next() < 0.4;
	return () => level7Form(rng, kind, quad);
}

function level7Form(rng: Rng, kind: string, quad: boolean): Build | null {
	const op = rng.pick(ALL_OPS);
	let A: Poly;
	let k: number;
	if (quad) {
		// x^2 + c with k^2 - c a square, and -c a square or c > 0
		k = rng.int(2, 8);
		const t = rng.int(1, 9);
		const c = k * k - t * t;
		if (c === 0 || Math.abs(c) > 40) return null;
		if (c < 0 && !exactSqrt(q(-c))) return null;
		A = P(c, 0, 1);
	} else {
		k = kind === 'k positivo' ? rng.int(1, 6) : kind === 'k nullo' ? 0 : -rng.int(1, 5);
		const a = rng.pick([1, 1, 2, 3]);
		const b = intIn(rng, -9, 9, [0]);
		if (gcd(a, Math.abs(b)) !== 1) return null;
		A = P(b, a);
	}
	const B = P(k);
	const pr: Problem = { kind: 'sqrt', A, B, rel: op };
	const K = q(k);
	const K2 = [K.mul(K)];
	const exists = (x: Rational) => evalP(A, x).sign() >= 0;
	const val = (x: Rational) => evalP(A, x);
	const S = (pred: (x: Rational) => boolean, ...ps: Poly[]) => solveWith(pred, [A, ...ps]);
	const steps: string[] = [];
	let ivCands: IvCand[];
	const Asq = psub(A, K2);
	if (k > 0 && !greater(op)) {
		steps.push(`\\text{Il numero è positivo: il radicando deve esistere ed essere ${op === '<' ? 'minore di' : 'minore o uguale a'} } ${k}^2 = ${k * k}\\text{.}`);
		steps.push(`${pl(A)} \\geq 0${IMPLIES}${solText(S(exists)!)}`);
		steps.push(`${pl(A)} ${OP_LATEX[op]} ${k * k}${IMPLIES}${solText(S((x) => holds(val(x), op, K2[0]), Asq)!)}`);
		ivCands = [
			{ tag: 'senza esistenza', ivs: S((x) => holds(val(x), op, K2[0]), Asq) },
			{ tag: 'estremi', ivs: S((x) => exists(x) && holds(val(x), TOGGLE[op], K2[0]), Asq) },
			{ tag: 'senza quadrato', ivs: S((x) => exists(x) && holds(val(x), op, K), psub(A, [K])) },
			{ tag: 'verso', ivs: S((x) => holds(val(x), FLIP[op], K2[0]), Asq) },
		];
	} else if (k > 0) {
		steps.push(`\\text{Il numero è positivo: eleva al quadrato. L'esistenza del radicale è già compresa.}`);
		steps.push(`${pl(A)} ${OP_LATEX[op]} ${k * k}${IMPLIES}${solText(S((x) => holds(val(x), op, K2[0]), Asq)!)}`);
		ivCands = [
			{ tag: 'verso', ivs: S((x) => exists(x) && holds(val(x), FLIP[op], K2[0]), Asq) },
			{ tag: 'estremi', ivs: S((x) => holds(val(x), TOGGLE[op], K2[0]), Asq) },
			{ tag: 'senza quadrato', ivs: S((x) => holds(val(x), op, K), psub(A, [K])) },
			{ tag: 'esistenza', ivs: S(exists) },
		];
	} else {
		if (k < 0) {
			steps.push(
				greater(op)
					? `\\text{Il numero è negativo: una radice, dove esiste, è sempre maggiore. Basta che il radicando esista.}`
					: `\\text{Il numero è negativo: una radice non è mai minore di un numero negativo.}`,
			);
		} else {
			const say: Record<Op, string> = {
				'<': `\\text{Una radice non è mai minore di zero.}`,
				'<=': `\\text{Una radice non è mai negativa: vale } \\leq 0 \\text{ solo dove vale zero, cioè dove il radicando vale zero.}`,
				'>': `\\text{Una radice è maggiore di zero dove il radicando è positivo.}`,
				'>=': `\\text{Una radice è sempre maggiore o uguale a zero, dove esiste.}`,
			};
			steps.push(say[op]);
		}
		if (greater(op) || (k === 0 && op === '<=')) {
			const cond = k === 0 && op === '>' ? '>' : k === 0 && op === '<=' ? '=' : '\\geq';
			const pred = cond === '>' ? (x: Rational) => val(x).sign() > 0 : cond === '=' ? (x: Rational) => val(x).isZero() : exists;
			steps.push(`${pl(A)} ${cond} 0${IMPLIES}${solText(S(pred)!)}`);
		}
		ivCands = [
			{ tag: 'quadrato', ivs: S((x) => holds(val(x), op, K2[0]), Asq) },
			{ tag: 'esistenza', ivs: S(exists) },
			{ tag: 'vuoto', ivs: [] },
			{ tag: 'positivo', ivs: S((x) => val(x).sign() > 0) },
			{ tag: 'punto', ivs: S((x) => val(x).isZero()) },
		];
	}
	return { kind, pr, steps, ivCands };
}

// Levels 8 and 9: √A op mx + n

/** A of first degree with B² - A = m²(x - r1)(x - r2), or x^2 + px + c with rational zeros (or none) and B = x + n. */
function radicandPair(rng: Rng, second: boolean): { A: Poly; B: Poly } | null {
	if (second) {
		const n = rng.int(-5, 5);
		const B = lin(1, n);
		let A: Poly;
		if (rng.next() < 0.7) {
			const r1 = rng.int(-6, 6);
			const r2 = intIn(rng, -6, 6, [r1]);
			A = P(r1 * r2, -(r1 + r2), 1);
		} else {
			// no real zeros: x^2 + c, c > 0
			A = P(rng.int(1, 12), 0, 1);
		}
		if (co(A, 1).equals(q(2 * n))) return null;
		return { A, B };
	}
	const m = rng.pick([1, 1, 1, 2, -1]);
	const n = rng.int(-5, 6);
	const r1 = rng.int(-6, 10);
	const r2 = intIn(rng, -6, 10, [r1]);
	const A = radicandFor(m, n, r1, r2);
	if (co(A, 1).sign() <= 0 || co(A, 1).num > 6 || Math.abs(co(A, 0).num) > 40) return null;
	return { A, B: lin(m, n) };
}

function level8(rng: Rng): Maker {
	const second = rng.next() < 0.3;
	return () => {
		const pair = radicandPair(rng, second);
		if (!pair) return null;
		const { A, B } = pair;
		const op = rng.pick(OPS_LESS);
		const pr: Problem = { kind: 'sqrt', A, B, rel: op };
		const val = (x: Rational) => evalP(A, x);
		const b = (x: Rational) => evalP(B, x);
		const sq = (x: Rational) => b(x).mul(b(x));
		const D = psub(A, pmul(B, B));
		const polys = [A, B, D];
		const S = (pred: (x: Rational) => boolean) => solveWith(pred, polys);
		const exists = (x: Rational) => val(x).sign() >= 0;
		const posB = (x: Rational) => (op === '<' ? b(x).sign() > 0 : b(x).sign() >= 0);
		const squared = (o: Op) => (x: Rational) => holds(val(x), o, sq(x));
		const e = S(exists)!;
		const pb = S(posB)!;
		const s2 = S(squared(op))!;
		const Dn = normalize(D);
		const flipD = co(D, deg(D)).sign() < 0;
		const steps = [
			`\\text{Il sistema: il radicale esiste, il secondo membro è ${op === '<' ? 'positivo' : 'non negativo'}, si eleva al quadrato.}`,
			`\\text{Esistenza: } ${pl(A)} \\geq 0${IMPLIES}${solText(e)}`,
			`\\text{Secondo membro: } ${pn(B)} ${op === '<' ? '>' : '\\geq'} 0${IMPLIES}${solText(pb)}`,
			`\\text{Quadrato: } ${pl(A)} ${OP_LATEX[op]} ${pl(pmul(B, B))}${IMPLIES}${pl(Dn)} ${OP_LATEX[flipD ? FLIP[op] : op]} 0${IMPLIES}${solText(s2)}`,
			`\\text{Le soluzioni sono i valori che rispettano tutte e tre le condizioni.}`,
		];
		const ivCands: IvCand[] = [
			{ tag: 'solo quadrato', ivs: s2 },
			{ tag: 'senza esistenza', ivs: S((x) => posB(x) && squared(op)(x)) },
			{ tag: 'senza segno', ivs: S((x) => exists(x) && squared(op)(x)) },
			{ tag: 'verso', ivs: S((x) => sqrtRel(val(x), FLIP[op], b(x))) },
			{ tag: 'estremi', ivs: S((x) => sqrtRel(val(x), TOGGLE[op], b(x))) },
		];
		return { kind: second ? 'secondo grado' : 'primo grado', pr, steps, ivCands };
	};
}

function level9(rng: Rng): Maker {
	return () => {
		const pair = radicandPair(rng, false);
		if (!pair) return null;
		const { A, B } = pair;
		const op = rng.pick(OPS_MORE);
		const pr: Problem = { kind: 'sqrt', A, B, rel: op };
		const val = (x: Rational) => evalP(A, x);
		const b = (x: Rational) => evalP(B, x);
		const sq = (x: Rational) => b(x).mul(b(x));
		const D = psub(A, pmul(B, B));
		const polys = [A, B, D];
		const S = (pred: (x: Rational) => boolean) => solveWith(pred, polys);
		const exists = (x: Rational) => val(x).sign() >= 0;
		const first = (x: Rational) => b(x).sign() < 0 && exists(x);
		const second = (x: Rational) => b(x).sign() >= 0 && holds(val(x), op, sq(x));
		const s1 = S(first)!;
		const s2 = S(second)!;
		// both systems must give something, or "un sistema solo" is the truth
		if (!s1.length || !s2.length) return null;
		const Dn = normalize(D);
		const flipD = co(D, deg(D)).sign() < 0;
		const steps = [
			`\\text{Primo sistema, secondo membro negativo: } ${pn(B)} < 0 \\text{ e } ${pl(A)} \\geq 0${IMPLIES}${solText(s1)}`,
			`\\text{Secondo sistema, secondo membro non negativo: } ${pn(B)} \\geq 0 \\text{ e } ${pl(A)} ${OP_LATEX[op]} ${pl(pmul(B, B))}`,
			`${pl(Dn)} ${OP_LATEX[flipD ? FLIP[op] : op]} 0 \\text{ con } ${pn(B)} \\geq 0${IMPLIES}${solText(s2)}`,
			`\\text{Le soluzioni sono l'unione delle soluzioni dei due sistemi.}`,
		];
		const ivCands: IvCand[] = [
			{ tag: 'un sistema solo', ivs: s2 },
			{ tag: 'solo quadrato', ivs: S((x) => holds(val(x), op, sq(x))) },
			{ tag: 'intersezione', ivs: [] },
			{ tag: 'solo primo', ivs: s1 },
			{ tag: 'estremi', ivs: S((x) => sqrtRel(val(x), TOGGLE[op], b(x))) },
		];
		return { kind: 'primo grado', pr, steps, ivCands };
	};
}

/** A level draws its case once, then makes candidates in that case until one gives a sample. */
type Maker = () => Build | null;

const BUILDERS: Record<number, (rng: Rng) => Maker> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };
const EQUATION_LEVELS = [1, 2, 3, 4, 5, 6];

// ---------------------------------------------------------------------------
// Assembly

const valuesKey = (vs: Rational[]) => uniqSorted(vs).map(String).join(',');

/** The first three wrong sets, distinct from the truth and from each other. */
function pickWrong(truth: Rational[], cands: Cand[]): Cand[] {
	const seen = new Set([valuesKey(truth)]);
	const out: Cand[] = [];
	for (const c of cands) {
		if (out.length === 3) break;
		const k = valuesKey(c.values);
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(c);
	}
	return out;
}

/** An inequality distractor: computed, not all of ℝ, at most two pieces; ∅ only as the named mistake. */
const usable = (c: IvCand) => !!c.ivs && !isAll(c.ivs) && c.ivs.length <= 2 && (c.ivs.length > 0 || c.tag === 'vuoto' || c.tag === 'intersezione');

function prJSON(pr: Problem) {
	return {
		kind: pr.kind,
		rel: pr.rel,
		A: polyJSON(pr.A),
		B: polyJSON(pr.B),
		...(pr.C ? { C: polyJSON(pr.C) } : {}),
		...(pr.T ? { T: polyJSON(pr.T), before: !!pr.before } : {}),
		...(pr.kind === 'rr' ? { swap: !!pr.swap } : {}),
	};
}

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const problem = problemLatex(b.pr);
	const base = { generatorId: ID, level, seed: rng.seed, problem };
	if (b.cands) {
		const s = solveEquation(b.pr);
		if (!s) return null;
		const truth = s.truth;
		if (pickWrong(truth, b.cands).length < 3) return null;
		const sol = valuesLatex(truth);
		const answer: SetAnswer = { kind: 'set', values: truth.map(String), latex: sol };
		return {
			...base,
			prompt: "Risolvi l'equazione.",
			solution: sol,
			steps: [...b.steps, sol],
			answer,
			params: { ...prJSON(b.pr), case: b.kind, truth: truth.map(String), distractors: b.cands.map((c) => ({ tag: c.tag, values: c.values.map(String) })) },
		};
	}
	const truth = solveInequality(b.pr);
	if (!truth || isAll(truth) || truth.length > 2) return null;
	const picked: { tag: string; ivs: Iv[] }[] = [{ tag: 'giusta', ivs: truth }];
	const seen = new Set([ivsKey(truth)]);
	for (const c of b.ivCands ?? []) {
		if (picked.length === 4) break;
		if (!usable(c) || seen.has(ivsKey(c.ivs!))) continue;
		seen.add(ivsKey(c.ivs!));
		picked.push({ tag: c.tag, ivs: c.ivs! });
	}
	if (picked.length < 4) return null;
	const notation: Notation = rng.next() < 0.5 ? 'disequazioni' : 'intervalli';
	const order = shuffle(
		rng,
		picked.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(picked[i].ivs, notation), values: picked[i].ivs.map(ivValue) }));
	const answer: ChoiceAnswer = { kind: 'choice', options, correct: order.indexOf(0) };
	return {
		...base,
		prompt: 'Risolvi la disequazione.',
		solution: setLatex(truth),
		steps: [...b.steps, lastStep(truth)],
		answer,
		params: { ...prJSON(b.pr), case: b.kind, notation, truth: truth.map(ivValue), optionTags: order.map((i) => picked[i].tag) },
	};
}

// ---------------------------------------------------------------------------
// Check

function problemFrom(p: Record<string, unknown>): Problem | null {
	const A = polyFrom(p.A);
	const B = polyFrom(p.B);
	if (!A || !B || typeof p.kind !== 'string' || typeof p.rel !== 'string') return null;
	const pr: Problem = { kind: p.kind as Kind, A, B, rel: p.rel as Rel };
	if (p.C !== undefined) {
		const C = polyFrom(p.C);
		if (!C) return null;
		pr.C = C;
	}
	if (p.T !== undefined) {
		const T = polyFrom(p.T);
		if (!T) return null;
		pr.T = T;
		pr.before = !!p.before;
	}
	if (p.swap !== undefined) pr.swap = !!p.swap;
	return pr;
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const lvl = s.level;
	if (!BUILDERS[lvl]) return [`livello ${lvl} sconosciuto`];
	const pr = problemFrom(s.params);
	if (!pr) return ['params non validi'];
	if (problemLatex(pr) !== s.problem) errs.push('il testo non corrisponde ai params');
	errs.push(...forbidden(s.problem));
	const ans = s.answer;
	const dA = deg(pr.A);
	if (EQUATION_LEVELS.includes(lvl)) {
		if (pr.rel !== '=') return [...errs, "serve un'equazione"];
		const sol = solveEquation(pr);
		if (!sol) return [...errs, 'risolvente con soluzioni irrazionali o identità'];
		const truth = sol.truth;
		if (ans.kind !== 'set' || ans.values.join(',') !== truth.map(String).join(',') || ans.universal) errs.push('risposta diversa dalla soluzione');
		if (ans.kind === 'set') for (const v of ans.values) if (!holdsAt(pr, Rational.parse(v))) errs.push(`x = ${v} non soddisfa l'equazione`);
		const cands = (s.params.distractors as { tag: string; values: string[] }[]) ?? [];
		if (pickWrong(truth, cands.map((c) => ({ tag: c.tag, values: c.values.map((v) => Rational.parse(v)) }))).length < 3) errs.push('meno di tre distrattori distinti');
		const extraneous = sol.roots.length - truth.length;
		const kind = s.params.case;
		switch (lvl) {
			case 1:
				if (pr.kind !== 'sqrt' || deg(pr.B) > 0 || dA < 1) errs.push('livello 1: radice uguale a un numero');
				break;
			case 2:
				if (pr.kind !== 'sqrt' || dA !== 1 || deg(pr.B) !== 1 || co(pr.B, 1).sign() <= 0) errs.push('livello 2: √(ax + b) = mx + n, m > 0');
				if (sol.roots.length !== 2 || extraneous !== (kind === 'due accettate' ? 0 : 1)) errs.push('livello 2: due candidati, uno estraneo (o nessuno)');
				break;
			case 3:
				if (pr.kind !== 'iso' || dA !== 1 || deg(pr.T!) !== 1 || deg(pr.B) > 0) errs.push('livello 3: un termine da portare a secondo membro');
				if (sol.roots.length !== 2 || extraneous !== 1) errs.push('livello 3: due candidati, uno estraneo');
				break;
			case 4:
				if (pr.kind !== 'sqrt' || deg(pr.B) !== 1) errs.push('livello 4: √A = mx + n');
				if (kind === 'soluzione negativa' && (dA !== 1 || co(pr.B, 1).sign() >= 0 || truth.length !== 1 || truth[0].sign() >= 0)) errs.push('livello 4: soluzione negativa accettata');
				if (kind === 'primo grado' && (dA !== 2 || deg(resolvent(pr)) !== 1)) errs.push('livello 4: risolvente di primo grado');
				break;
			case 5:
				if (!(pr.kind === 'rr' || pr.kind === 'sum') || extraneous !== 1) errs.push('livello 5: due radicali, un candidato estraneo');
				break;
			case 6:
				if (pr.kind !== 'cbrt' || !truth.length || extraneous !== 0) errs.push('livello 6: radice cubica, nessuna soluzione estranea');
				break;
		}
		if (s.solution !== valuesLatex(truth)) errs.push('soluzione scritta male');
		return errs;
	}
	const op = pr.rel as Op;
	if (op === ('=' as Rel) || pr.kind !== 'sqrt') return [...errs, 'serve una disequazione √A op B'];
	const truth = solveInequality(pr);
	if (!truth) return [...errs, 'punti critici irrazionali'];
	if (ans.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== ivsKey(truth)) errs.push('opzione giusta sbagliata');
	if (lvl === 7 && deg(pr.B) > 0) errs.push('livello 7: un numero a secondo membro');
	if (lvl === 8 && (deg(pr.B) !== 1 || greater(op))) errs.push('livello 8: √A < mx + n');
	if (lvl === 9 && (deg(pr.B) !== 1 || !greater(op) || dA !== 1)) errs.push('livello 9: √A > mx + n');
	if (lvl >= 8 && !truth.length) errs.push('soluzione vuota');
	if (s.solution !== setLatex(truth)) errs.push('soluzione scritta male');
	return errs;
}

// ---------------------------------------------------------------------------

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const truth = (sample.params.truth as string[]).map((v) => Rational.parse(v));
	const cands = (sample.params.distractors as { tag: string; values: string[] }[]).map((c) => ({ tag: c.tag, values: c.values.map((v) => Rational.parse(v)) }));
	const all = [truth, ...pickWrong(truth, cands).map((c) => c.values)];
	if (all.length !== 4) throw new Error(`${ID}: not enough distractors`);
	const order = shuffle(
		rng,
		all.map((_, i) => i),
	);
	return {
		kind: 'choice',
		options: order.map((i) => ({ latex: valuesLatex(all[i]), values: uniqSorted(all[i]).map(String) })),
		correct: order.indexOf(0),
	};
}

const equazioniIrrazionali: Generator = {
	id: ID,
	title: 'Equazioni e disequazioni irrazionali',
	levels: {
		1: { label: 'Radice uguale a un numero', constraints: ['√A = k, A di primo o secondo grado; k positivo (6 su 10), negativo (2 su 10) o nullo (2 su 10)'] },
		2: { label: "Radice uguale a un'espressione", constraints: ['√(ax + b) = mx + n, m > 0: una soluzione estranea (8 su 10) o nessuna'] },
		3: { label: 'Prima si isola il radicale', constraints: ['px + √(ax + b) = n oppure √(ax + b) + px = n, una soluzione estranea'] },
		4: { label: 'La condizione sul secondo membro', constraints: ['√(ax + b) = mx + n con m < 0 e soluzione negativa (6 su 10), o √(x^2 + px + c) = x + n con risolvente di primo grado'] },
		5: { label: 'Due radicali', constraints: ['√A = √C con A di secondo grado, o √(ax + b) + √(cx + d) = k con due elevamenti; un candidato estraneo'] },
		6: { label: 'Radici cubiche', constraints: ['∛(x^3 + px^2 + qx + r) = x + n (7 su 10) o ∛A = k; nessuna condizione'] },
		7: { label: 'Disequazioni con un numero', constraints: ['√A op k, k positivo (6 su 10), negativo o nullo'] },
		8: { label: "Radice minore di un'espressione", constraints: ['√A < mx + n: sistema di tre disequazioni'] },
		9: { label: "Radice maggiore di un'espressione", constraints: ['√A > mx + n: unione di due sistemi, tutti e due non vuoti'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		// the first draw of a seed is not uniform across consecutive seeds
		rng.next();
		const make = build(rng);
		for (let attempt = 0; attempt < 200_000; attempt++) {
			const b = make();
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniIrrazionali;
