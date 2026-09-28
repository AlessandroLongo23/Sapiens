/**
 * Equazioni e disequazioni con il valore assoluto. Spec: specs/exercises/valore-assoluto-equazioni.md
 *
 * Nine levels in the order of lesson 91 (docs/lezioni/riscritte/91-valore-assoluto-equazioni.md): |A| = k with
 * A of first and of second degree, |A| = |B|, |A| = B with A of first and of second degree, two absolute
 * values, |A| < k and |A| > k with A of first and of second degree, |A| < B and |A| > B.
 *
 * Built backwards: the zeros and the solutions are chosen first (integers, small fractions), the problem is
 * written from them. The truth does not come from the construction: a generic solver removes the bars
 * region by region (between the zeros of the arguments) for the equations, and tests every region and every
 * critical point with exact rationals for the inequalities. Equations answer with a set of values and have a
 * multiple-choice variant; inequalities answer with a choice among unions of intervals, written as in
 * lessons 88 and 89. Wrong options are the mistakes named in the lesson's warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, ZERO, exactSqrt, gcd, q } from '../rational';
import { polyDegree, polyToLatex, type Poly } from '../latex';
import { forbidden, shuffle } from '../monomi';

export const ID = 'valore-assoluto-equazioni';

// ---------------------------------------------------------------------------
// Polynomials with rational coefficients

const P = (...cs: number[]): Poly => cs.map((c) => q(c));
const co = (p: Poly, i: number) => p[i] ?? ZERO;
const padd = (a: Poly, b: Poly): Poly => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => co(a, i).add(co(b, i)));
const pneg = (a: Poly): Poly => a.map((c) => c.neg());
const psub = (a: Poly, b: Poly): Poly => padd(a, pneg(b));
const pl = (p: Poly) => polyToLatex(p);
const deg = (p: Poly) => polyDegree(p);

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

/** Real zeros of a polynomial of degree at most 2, ascending and distinct; null if they are irrational. */
function rootsOf(p: Poly): Rational[] | null {
	const d = deg(p);
	if (d <= 0) return [];
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

/** A trinomial that takes both signs (Δ > 0): otherwise its bars would change nothing. */
const changesSign = (p: Poly) => co(p, 1).mul(co(p, 1)).sub(q(4).mul(co(p, 2)).mul(co(p, 0))).sign() > 0;

const polyJSON = (p: Poly) => [0, 1, 2].map((i) => co(p, i).toString());
const polyFrom = (xs: unknown): Poly | null => (Array.isArray(xs) && xs.every((s) => typeof s === 'string') ? (xs as string[]).map((s) => Rational.parse(s)) : null);

// ---------------------------------------------------------------------------
// Signs and intervals

type Op = '<' | '>' | '<=' | '>=';
type Rel = '=' | Op;
const OPS: Op[] = ['<', '>', '<=', '>='];
const OP_LATEX: Record<Rel, string> = { '=': '=', '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const positive = (o: Op) => o === '>' || o === '>=';

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

/** An interval; null is -∞ at the left and +∞ at the right. lo = hi, both closed, is a point. */
interface Iv {
	lo: Rational | null;
	hi: Rational | null;
	loC: boolean;
	hiC: boolean;
}

/**
 * The set where `pred` holds, as ordered intervals, given every point where it can change (a superset is
 * fine): each open region between two critical points is tested at its midpoint, each point on its own.
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

/** Two intervals with a fraction, or three intervals, go one per line. */
const wide = (ivs: Iv[]) => ivs.length >= 3 || (ivs.length === 2 && ivs.some((iv) => nonInteger(iv.lo) || nonInteger(iv.hi)));

function setLatex(ivs: Iv[]): string {
	if (!ivs.length) return 'S = \\emptyset';
	if (isAll(ivs)) return 'S = \\mathbb{R}';
	if (allBut(ivs)) return `S = \\mathbb{R} \\setminus \\{${ivs[0].hi!.toLatex()}\\}`;
	if (ivs.every(isPoint)) return valuesLatex(ivs.map((iv) => iv.lo!));
	const w = wide(ivs);
	const parts = ivs.map((iv, i) => {
		const t = intervalLatex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}') && !w) s += '\\,';
		return s;
	});
	if (w) return `\\begin{gathered} S = ${parts.join(' \\\\ \\cup ')} \\end{gathered}`;
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

/** Three pieces, or two bounded ones (-6 \leq x \leq -2 oppure 2 \leq x \leq 6), go one per line. */
const wideDis = (ivs: Iv[]) => ivs.length >= 3 || (ivs.length === 2 && ivs.every((iv) => !!iv.lo && !!iv.hi && !isPoint(iv)));

function disOption(ivs: Iv[]): string {
	if (wideDis(ivs)) return `\\begin{gathered} ${ivs.map(pieceLatex).join(' \\\\ \\text{oppure} \\ ')} \\end{gathered}`;
	return disLatex(ivs);
}

const optionLatex = (ivs: Iv[], n: Notation) => (n === 'intervalli' || special(ivs) ? setLatex(ivs) : disOption(ivs));

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
	const body = uniqSorted(vs)
		.map((v) => v.toLatex())
		.join(', ');
	return vs.some((v) => !v.isInteger()) ? `S = \\left\\{${body}\\right\\}` : `S = \\{${body}\\}`;
}

// ---------------------------------------------------------------------------
// The problem: sum of |args| rel rhs (or |rhs|)

interface Problem {
	args: Poly[];
	rhs: Poly;
	rhsAbs: boolean;
	rel: Rel;
}

const absL = (p: Poly) => `|${pl(p)}|`;
const problemLatex = (pr: Problem) => `${pr.args.map(absL).join(' + ')} ${OP_LATEX[pr.rel]} ${pr.rhsAbs ? absL(pr.rhs) : pl(pr.rhs)}`;
const lhsAt = (pr: Problem, x: Rational) => pr.args.reduce((s, a) => s.add(evalP(a, x).abs()), ZERO);
const rhsAt = (pr: Problem, x: Rational) => (pr.rhsAbs ? evalP(pr.rhs, x).abs() : evalP(pr.rhs, x));

/**
 * Solutions of an equation. Wherever it holds, each bar is removed with some sign, so every solution is a root
 * of Σ ±arg (±rhs) for one choice of the signs: those roots are the candidates, and each one is put back into
 * the equation with the bars. null if a choice of signs gives an identity (it could mean infinitely many
 * solutions) or irrational roots.
 */
function solveEquation(pr: Problem): Rational[] | null {
	const parts = pr.rhsAbs ? [...pr.args, pr.rhs] : pr.args;
	const out: Rational[] = [];
	for (let mask = 0; mask < 1 << parts.length; mask++) {
		const signed = parts.map((a, i) => (mask & (1 << i) ? pneg(a) : a));
		let f = signed.slice(0, pr.args.length).reduce<Poly>((acc, a) => padd(acc, a), [ZERO]);
		f = psub(f, pr.rhsAbs ? signed[pr.args.length] : pr.rhs);
		if (deg(f) === -1) return null;
		const rs = rootsOf(f);
		if (!rs) return null;
		for (const r of rs) if (lhsAt(pr, r).equals(rhsAt(pr, r))) out.push(r);
	}
	return uniqSorted(out);
}

/** Every point where |A| rel B, A rel ±B or B can change: the zeros of A - B, A + B and B. */
function critOf(A: Poly, B: Poly): Rational[] | null {
	const out: Rational[] = [];
	for (const p of [psub(A, B), padd(A, B), B]) {
		const r = rootsOf(p);
		if (!r) return null;
		out.push(...r);
	}
	return out;
}

// ---------------------------------------------------------------------------
// Steps

const IMPLIES = ' \\ \\Rightarrow \\ ';
const xs = (vs: Rational[]) => vs.map((v) => `x = ${v.toLatex()}`).join(', \\ ');

/** L = R ⇒ … ⇒ x = …: one line of an equation without bars, solved as in the lesson. */
function eqLine(L: Poly, R: Poly): string {
	const head = `${pl(L)} = ${pl(R)}`;
	const f = psub(L, R);
	const d = deg(f);
	if (d <= 0) return `${head}${IMPLIES}\\text{impossibile}`;
	if (d === 1) {
		const x = co(f, 0).neg().div(co(f, 1));
		// a x + b = c with a ≠ 1: the step a x = c - b
		if (deg(R) <= 0 && co(L, 1).isInteger() && !co(L, 1).isOne() && !co(L, 0).isZero()) return `${head}${IMPLIES}${pl([ZERO, co(L, 1)])} = ${co(R, 0).sub(co(L, 0)).toLatex()}${IMPLIES}x = ${x.toLatex()}`;
		return `${head}${IMPLIES}x = ${x.toLatex()}`;
	}
	// pure: x^2 + c = k ⇒ x^2 = k - c
	if (co(f, 1).isZero() && co(f, 2).isOne()) {
		const v = co(f, 0).neg();
		const left = deg(R) <= 0 && co(L, 1).isZero() ? `${head}${IMPLIES}x^2 = ${v.toLatex()}` : `${head}${IMPLIES}${pl(f)} = 0`;
		if (v.sign() < 0) return `${left}${IMPLIES}\\text{nessuna soluzione}`;
		if (v.isZero()) return `${left}${IMPLIES}x = 0`;
		return `${left}${IMPLIES}x = \\pm ${exactSqrt(v)!.toLatex()}`;
	}
	const rs = rootsOf(f)!;
	const std = `${head}${IMPLIES}${pl(f)} = 0`;
	if (!rs.length) {
		const D = co(f, 1).mul(co(f, 1)).sub(q(4).mul(co(f, 2)).mul(co(f, 0)));
		return `${std}${IMPLIES}\\Delta = ${D.toLatex()} < 0\\text{, nessuna soluzione}`;
	}
	return `${std}${IMPLIES}${xs(rs)}`;
}

/** B ≥ 0 solved: x ≥ -n/m, or x ≤ -n/m with m < 0. */
function conditionLine(B: Poly): string {
	const m = co(B, 1);
	const z = co(B, 0).neg().div(m);
	return `\\text{Condizione: } ${pl(B)} \\geq 0\\text{, cioè } x ${m.sign() > 0 ? '\\geq' : '\\leq'} ${z.toLatex()}\\text{.}`;
}

/** Which candidates the condition keeps: "x = -5 non rispetta la condizione e si scarta; x = 1 la rispetta." */
function verdictLine(cands: Rational[], keep: (x: Rational) => boolean): string {
	const kept = cands.filter(keep);
	const out = cands.filter((c) => !keep(c));
	const list = (vs: Rational[]) => vs.map((v) => `x = ${v.toLatex()}`).join(vs.length === 2 ? ' \\text{ e } ' : ', \\ ');
	const many = (vs: Rational[], one: string, more: string) => (vs.length > 1 ? more : one);
	if (!out.length) return `${list(kept)} \\text{ ${many(kept, 'rispetta', 'rispettano')} la condizione: ${many(kept, 'è accettata', 'sono accettate')}.}`;
	const head = `${list(out)} \\text{ non ${many(out, 'rispetta', 'rispettano')} la condizione e si ${many(out, 'scarta', 'scartano')}}`;
	if (!kept.length) return `${head}\\text{: nessuna soluzione.}`;
	return `${head}\\text{; } ${list(kept)} \\text{ la ${many(kept, 'rispetta', 'rispettano')}.}`;
}

// ---------------------------------------------------------------------------
// Levels

interface Cand {
	tag: string;
	values: Rational[];
}
interface IvCand {
	tag: string;
	ivs: Iv[];
}

interface Build {
	kind: string;
	pr: Problem;
	steps: string[];
	/** Equations: the wrong sets in order of preference. */
	cands?: Cand[];
	/** Inequalities: the wrong unions of intervals, or the four answers of the table around a point. */
	ivCands?: IvCand[];
	quartet?: Rational;
	extra?: Record<string, unknown>;
}

const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};
const lin = (a: number, b: number): Poly => P(b, a);
const small = (vs: Rational[], den: number, max: number) => vs.every((v) => v.den <= den && Math.abs(v.num / v.den) <= max);

/**
 * The same case drawn again until it gives a usable sample (with three distinct wrong answers), so that
 * rejections do not change the share of the cases.
 */
function retry(f: () => Build | null): Build | null {
	for (let i = 0; i < 2000; i++) {
		const b = f();
		if (b && viable(b)) return b;
	}
	return null;
}

const negs = (vs: Rational[]) => vs.map((v) => v.neg());

// Level 1: |ax + b| = k
function level1(rng: Rng): Build | null {
	const u = rng.next();
	const kind = u < 0.6 ? 'k positivo' : u < 0.8 ? 'k nullo' : 'k negativo';
	return retry(() => {
		const a = rng.pick([1, 1, 1, 2, 2, 3, 4, 5]);
		const b = intIn(rng, -9, 9, [0]);
		if (gcd(a, Math.abs(b)) !== 1) return null;
		const k = kind === 'k positivo' ? rng.int(1, 12) : kind === 'k nullo' ? 0 : -rng.int(1, 9);
		const A = lin(a, b);
		const pr: Problem = { args: [A], rhs: P(k), rhsAbs: false, rel: '=' };
		const sol = (c: number) => q(c - b, a);
		const steps: string[] = [];
		let cands: Cand[];
		if (k > 0) {
			const [x1, x2] = [sol(k), sol(-k)];
			if (!small([x1, x2], 5, 20)) return null;
			steps.push(`\\text{Il secondo membro è positivo: l'argomento vale } ${k} \\text{ oppure } ${-k}\\text{.}`);
			steps.push(eqLine(A, P(k)), eqLine(A, P(-k)));
			cands = [
				{ tag: 'solo A = k', values: [x1] },
				{ tag: 'opposti', values: [x1, x1.neg()] },
				{ tag: 'vuoto', values: [] },
				{ tag: 'solo A = -k', values: [x2] },
			];
		} else if (k === 0) {
			const r = sol(0);
			steps.push(`\\text{Il secondo membro è zero: il valore assoluto vale zero solo dove l'argomento vale zero.}`);
			steps.push(eqLine(A, P(0)));
			cands = [
				{ tag: 'vuoto', values: [] },
				{ tag: 'opposti', values: [r, r.neg()] },
				{ tag: 'segno', values: [r.neg()] },
			];
		} else {
			const [y1, y2] = [sol(k), sol(-k)];
			if (!small([y1, y2], 5, 20)) return null;
			steps.push(`\\text{Il secondo membro è negativo: un valore assoluto non è mai negativo, quindi l'equazione è impossibile.}`);
			cands = [
				{ tag: 'più o meno', values: [y1, y2] },
				{ tag: 'solo A = k', values: [y1] },
				{ tag: 'solo A = -k', values: [y2] },
			];
		}
		return { kind, pr, steps, cands };
	});
}

// Level 2: |A| = k with A of second degree
function level2(rng: Rng): Build | null {
	const pure = rng.next() < 0.6;
	return retry(() => (pure ? level2Pure(rng) : level2Full(rng)));
}

function level2Pure(rng: Rng): Build | null {
	// x^2 - c = ±k with c + k = s^2 and c - k = t^2 (t ≥ 0), or c - k negative
	const s = rng.int(2, 8);
	const neg = rng.next() < 0.5;
	let c: number;
	let k: number;
	if (neg) {
		k = rng.int(Math.floor((s * s) / 2) + 1, s * s - 1);
		c = s * s - k;
	} else {
		const t = rng.int(0, s - 1);
		if ((s + t) % 2 !== 0) return null;
		c = (s * s + t * t) / 2;
		k = (s * s - t * t) / 2;
	}
	if (c <= 0 || c > 40 || k > 40) return null;
	const u = exactSqrt(q(k - c));
	const A = P(-c, 0, 1);
	const pr: Problem = { args: [A], rhs: P(k), rhsAbs: false, rel: '=' };
	const cands: Cand[] = [
		{ tag: 'solo A = k', values: rootsOf(psub(A, P(k)))! },
		{ tag: 'solo A = -k', values: rootsOf(padd(A, P(k)))! },
		{ tag: 'positive', values: [] },
	];
	if (neg && u) cands.push({ tag: 'meno sotto radice', values: [q(-s), u.neg(), u, q(s)] });
	cands.push({ tag: 'vuoto', values: [] });
	const steps = [`\\text{Il secondo membro è positivo: l'argomento vale } ${k} \\text{ oppure } ${-k}\\text{.}`, eqLine(A, P(k)), eqLine(A, P(-k))];
	return { kind: 'pura', pr, steps, cands, extra: {} };
}

function level2Full(rng: Rng): Build | null {
	// A - k = (x - r1)(x - r2); A + k has Δ = (r1 - r2)^2 - 8k, a square or negative
	const r1 = rng.int(-8, 8);
	const r2 = intIn(rng, -8, 8, [r1]);
	const k = rng.int(1, 12);
	const p = -(r1 + r2);
	const c = r1 * r2 + k;
	if (p === 0 || Math.abs(c) > 30) return null;
	const A = P(c, p, 1);
	if (!changesSign(A) || !rootsOf(padd(A, P(k)))) return null;
	const pr: Problem = { args: [A], rhs: P(k), rhsAbs: false, rel: '=' };
	const cands: Cand[] = [
		{ tag: 'solo A = k', values: rootsOf(psub(A, P(k)))! },
		{ tag: 'solo A = -k', values: rootsOf(padd(A, P(k)))! },
		{ tag: 'positive', values: [] },
		{ tag: 'vuoto', values: [] },
		{ tag: 'opposti', values: [] },
	];
	const steps = [`\\text{Il secondo membro è positivo: l'argomento vale } ${k} \\text{ oppure } ${-k}\\text{.}`, eqLine(A, P(k)), eqLine(A, P(-k))];
	return { kind: 'completa', pr, steps, cands, extra: {} };
}

// Level 3: |a1 x + b1| = |a2 x + b2|
function level3(rng: Rng): Build | null {
	const a1 = rng.pick([1, 1, 2, 3]);
	const a2 = intIn(rng, 1, 4, [a1]);
	const b1 = intIn(rng, -9, 9, [0]);
	const b2 = intIn(rng, -9, 9, [0, b1]);
	if (gcd(a1, Math.abs(b1)) !== 1 || gcd(a2, Math.abs(b2)) !== 1) return null;
	const A = lin(a1, b1);
	const B = lin(a2, b2);
	const x1 = q(b2 - b1, a1 - a2);
	const x2 = q(-(b1 + b2), a1 + a2);
	const x3 = q(b2 - b1, a1 + a2);
	if (x1.equals(x2) || !small([x1, x2], 7, 20)) return null;
	const pr: Problem = { args: [A], rhs: B, rhsAbs: true, rel: '=' };
	const steps = [`\\text{Due numeri hanno lo stesso valore assoluto quando sono uguali oppure opposti.}`, eqLine(A, B), eqLine(A, pneg(B))];
	const cands: Cand[] = [
		{ tag: 'un termine', values: [x1, x3] },
		{ tag: 'solo A = B', values: [x1] },
		{ tag: 'solo A = -B', values: [x2] },
		{ tag: 'opposti', values: negs([x1, x2]) },
	];
	return { kind: x1.isInteger() && x2.isInteger() ? 'intere' : 'frazionarie', pr, steps, cands };
}

// Level 4: |a1 x + b1| = m x + n
function level4(rng: Rng): Build | null {
	const u = rng.next();
	const kind = u < 0.6 ? 'una scartata' : u < 0.8 ? 'tutte e due' : 'nessuna';
	return retry(() => {
		const a1 = rng.pick([1, 1, 2, 3]);
		const b1 = intIn(rng, -9, 9, [0]);
		if (gcd(a1, Math.abs(b1)) !== 1) return null;
		const m = rng.pick([1, 2, 3, -1, -2]);
		if (Math.abs(m) === a1) return null;
		const n = rng.int(-9, 9);
		const A = lin(a1, b1);
		const B = lin(m, n);
		const x1 = q(n - b1, a1 - m);
		const x2 = q(-(b1 + n), a1 + m);
		if (x1.equals(x2) || !small([x1, x2], 5, 15)) return null;
		const bs = [x1, x2].map((v) => evalP(B, v));
		if (bs.some((v) => v.isZero())) return null;
		const ok = bs.filter((v) => v.sign() > 0).length;
		if ((kind === 'una scartata' && ok !== 1) || (kind === 'tutte e due' && ok !== 2) || (kind === 'nessuna' && ok !== 0)) return null;
		const pr: Problem = { args: [A], rhs: B, rhsAbs: false, rel: '=' };
		const keep = (x: Rational) => evalP(B, x).sign() >= 0;
		const cs = uniqSorted([x1, x2]);
		const steps = [conditionLine(B), eqLine(A, B), eqLine(A, pneg(B)), verdictLine(cs, keep)];
		const cands: Cand[] = [
			{ tag: 'senza condizione', values: cs },
			{ tag: 'scartate', values: cs.filter((x) => !keep(x)) },
			{ tag: 'solo A = B', values: [x1] },
			{ tag: 'solo A = -B', values: [x2] },
			{ tag: 'vuoto', values: [] },
		];
		return { kind, pr, steps, cands };
	});
}

/** A = x^2 + p x + c and B = m x + n with A - B = (x - r1)(x - r2) and A + B = (x - r3)(x - r4). */
function quadPair(rng: Rng, lim = 6): { A: Poly; B: Poly; r: number[] } | null {
	const r = [rng.int(-lim, lim), rng.int(-lim, lim), rng.int(-lim, lim), rng.int(-lim, lim)];
	const s1 = r[0] + r[1];
	const s2 = r[2] + r[3];
	const p1 = r[0] * r[1];
	const p2 = r[2] * r[3];
	if ((s1 + s2) % 2 !== 0 || (p1 + p2) % 2 !== 0) return null;
	const A = P((p1 + p2) / 2, -(s1 + s2) / 2, 1);
	const B = P((p2 - p1) / 2, (s1 - s2) / 2);
	if (co(B, 1).isZero()) return null;
	if (Math.abs(co(A, 1).num) > 8 || Math.abs(co(A, 0).num) > 20 || Math.abs(co(B, 1).num) > 9 || Math.abs(co(B, 0).num) > 15) return null;
	if (!changesSign(A)) return null;
	return { A, B, r };
}

// Level 5: |x^2 + p x + c| = m x + n
function level5(rng: Rng): Build | null {
	const g = quadPair(rng);
	if (!g) return null;
	const { A, B, r } = g;
	const cs = uniqSorted(r.map((v) => q(v)));
	if (cs.length !== 4) return null;
	if (cs.some((v) => evalP(B, v).isZero())) return null;
	const keep = (x: Rational) => evalP(B, x).sign() >= 0;
	const kept = cs.filter(keep);
	if (kept.length === 0 || kept.length === 4) return null;
	const pr: Problem = { args: [A], rhs: B, rhsAbs: false, rel: '=' };
	const steps = [conditionLine(B), eqLine(A, B), eqLine(A, pneg(B)), verdictLine(cs, keep)];
	const cands: Cand[] = [
		{ tag: 'senza condizione', values: cs },
		{ tag: 'scartate', values: cs.filter((x) => !keep(x)) },
		{ tag: 'solo A = B', values: rootsOf(psub(A, B))! },
		{ tag: 'solo A = -B', values: rootsOf(padd(A, B))! },
	];
	return { kind: kept.length === 1 ? 'una accettata' : kept.length === 2 ? 'due accettate' : 'tre accettate', pr, steps, cands };
}

// Level 6: |m1 x - n1| + |m2 x - n2| = k, or = m x + n
function level6(rng: Rng): Build | null {
	const withX = rng.next() < 0.4;
	return retry(() => level6Form(rng, withX));
}

interface Region {
	label: string;
	f: Poly;
	root: Rational | null;
	inside: boolean;
}

function level6Form(rng: Rng, withX: boolean): Build | null {
	const z1 = rng.int(-6, 6);
	const z2 = intIn(rng, -6, 6, [z1]);
	const m1 = rng.pick([1, 1, 2]);
	const m2 = rng.pick([1, 1, 1, 2]);
	const A1 = P(-m1 * z1, m1);
	const A2 = P(-m2 * z2, m2);
	const rhs = withX ? P(rng.int(-6, 9), rng.pick([1, 1, 2])) : P(rng.int(1, 12));
	const pr: Problem = { args: [A1, A2], rhs, rhsAbs: false, rel: '=' };
	const truth = solveEquation(pr);
	if (!truth) return null;
	// the three regions of the lesson's table, zeros in the region at their right
	const [lo, hi] = z1 < z2 ? [q(z1), q(z2)] : [q(z2), q(z1)];
	const probes = [lo.sub(q(1)), lo.add(hi).div(q(2)), hi.add(q(1))];
	const labels = [`x < ${lo.toLatex()}`, `${lo.toLatex()} \\leq x < ${hi.toLatex()}`, `x \\geq ${hi.toLatex()}`];
	const inRegion = [(x: Rational) => x.compare(lo) < 0, (x: Rational) => x.compare(lo) >= 0 && x.compare(hi) < 0, (x: Rational) => x.compare(hi) >= 0];
	const regions: Region[] = [];
	for (let j = 0; j < 3; j++) {
		const t = probes[j];
		const sg = (a: Poly) => (evalP(a, t).sign() < 0 ? pneg(a) : a);
		const f = padd(sg(A1), sg(A2));
		const d = psub(f, rhs);
		if (deg(d) === -1) return null;
		const root = deg(d) === 1 ? co(d, 0).neg().div(co(d, 1)) : null;
		regions.push({ label: labels[j], f, root, inside: !!root && inRegion[j](root) });
	}
	const all = uniqSorted(regions.filter((g) => g.root).map((g) => g.root!));
	if (!small(all, 3, 15)) return null;
	const accepted = uniqSorted(regions.filter((g) => g.inside).map((g) => g.root!));
	if (accepted.map(String).join() !== truth.map(String).join()) return null;
	// the first warning: the bars removed without looking at the signs
	const naive = rootsOf(psub(padd(A1, A2), rhs))!;
	const steps = [`\\text{Gli argomenti si annullano in } ${lo.toLatex()} \\text{ e in } ${hi.toLatex()}\\text{: tre intervalli.}`];
	for (const g of regions) {
		const eq = `${pl(g.f)} = ${pl(rhs)}`;
		const res = g.root ? `x = ${g.root.toLatex()}\\text{, ${g.inside ? 'accettata' : 'scartata'}}` : '\\text{nessuna soluzione}';
		steps.push(`${g.label}\\text{: } ${eq}${IMPLIES}${res}`);
	}
	const cands: Cand[] = [
		{ tag: 'fuori', values: all },
		{ tag: 'togliere', values: naive },
		{ tag: 'opposti', values: negs(truth) },
		{ tag: 'vuoto', values: [] },
	];
	if (truth.length >= 2) cands.push({ tag: 'solo il minore', values: [truth[0]] }, { tag: 'solo il maggiore', values: [truth[truth.length - 1]] });
	const scartate = all.length > accepted.length;
	return { kind: withX ? 'con x' : 'numero', pr, steps, cands, extra: { scartate } };
}

// Inequalities -------------------------------------------------------------

/** |A| rel B as a predicate. */
const absRel = (A: Poly, o: Rel, B: Poly) => (x: Rational) => holds(evalP(A, x).abs(), o, evalP(B, x));
const plainRel = (A: Poly, o: Rel, B: Poly) => (x: Rational) => holds(evalP(A, x), o, evalP(B, x));

/** The wrong answers every inequality level can give. */
function commonIv(A: Poly, op: Op, B: Poly, crit: Rational[]): IvCand[] {
	return [
		{ tag: 'scambiati', ivs: solveBy(absRel(A, FLIP[op], B), crit) },
		{ tag: 'una sola', ivs: solveBy(plainRel(A, op, B), crit) },
		{ tag: 'estremi', ivs: solveBy(absRel(A, TOGGLE[op], B), crit) },
		{ tag: 'equazione', ivs: solveBy(absRel(A, '=', B), crit) },
		{ tag: 'scambiati ed estremi', ivs: solveBy(absRel(A, TOGGLE[FLIP[op]], B), crit) },
	];
}

/** One inequality without bars, in a step: L op R ⇒ (L - R op 0 ⇒) the solutions. */
function ineqLine(L: Poly, op: Op, R: Poly, crit: Rational[]): string {
	const sol = solveBy(plainRel(L, op, R), crit);
	const f = psub(L, R);
	const mid = deg(f) === 2 ? `${IMPLIES}${pl(f)} ${OP_LATEX[op]} 0` : '';
	return `${pl(L)} ${OP_LATEX[op]} ${pl(R)}${mid}${IMPLIES}${solText(sol)}`;
}

/** Steps of |A| op B with the rules of the lesson: a system for <, an union for >. */
function ruleSteps(A: Poly, op: Op, B: Poly, crit: Rational[]): string[] {
	const Bn = pneg(B);
	if (!positive(op)) {
		return [
			`\\text{Valori interni: } ${pl(Bn)} ${OP_LATEX[op]} ${pl(A)} ${OP_LATEX[op]} ${pl(B)}\\text{, cioè il sistema di due disequazioni.}`,
			ineqLine(A, op, B, crit),
			ineqLine(A, FLIP[op], Bn, crit),
			`\\text{Si prendono i valori comuni alle due.}`,
		];
	}
	return [
		`\\text{Valori esterni: } ${pl(A)} ${OP_LATEX[FLIP[op]]} ${pl(Bn)} \\text{ oppure } ${pl(A)} ${OP_LATEX[op]} ${pl(B)}\\text{.}`,
		ineqLine(A, FLIP[op], Bn, crit),
		ineqLine(A, op, B, crit),
		`\\text{Si prendono i valori che risolvono almeno una delle due.}`,
	];
}

// Level 7: |ax + b| op k
function level7(rng: Rng): Build | null {
	const small0 = rng.next() >= 0.7;
	return retry(() => {
		const a = rng.pick([1, 1, 1, 2, 3, 4]);
		const b = intIn(rng, -9, 9, [0]);
		if (gcd(a, Math.abs(b)) !== 1) return null;
		const op = rng.pick(OPS);
		const A = lin(a, b);
		const r = q(-b, a);
		if (small0) {
			const k = rng.next() < 0.5 ? 0 : -rng.int(1, 9);
			const pr: Problem = { args: [A], rhs: P(k), rhsAbs: false, rel: op };
			const why =
				k < 0
					? positive(op)
						? `\\text{Il secondo membro è negativo: un valore assoluto è sempre maggiore di un numero negativo.}`
						: `\\text{Il secondo membro è negativo: un valore assoluto non è mai negativo, nessun } x \\text{ va bene.}`
					: {
							'<': `\\text{Un valore assoluto non è mai negativo: nessun } x \\text{ va bene.}`,
							'<=': `\\text{Il valore assoluto vale zero solo dove l'argomento vale zero: } ${pl(A)} = 0\\text{, cioè } x = ${r.toLatex()}\\text{.}`,
							'>': `\\text{Il valore assoluto è positivo tranne dove l'argomento vale zero, in } x = ${r.toLatex()}\\text{.}`,
							'>=': `\\text{Un valore assoluto non è mai negativo: ogni } x \\text{ va bene.}`,
						}[op];
			return { kind: 'k nullo o negativo', pr, steps: [why], quartet: r };
		}
		const k = rng.int(1, 9);
		const ends = [q(-k - b, a), q(k - b, a)];
		if (!small(ends, 4, 15)) return null;
		const pr: Problem = { args: [A], rhs: P(k), rhsAbs: false, rel: op };
		const o = OP_LATEX[op];
		const steps: string[] = [];
		if (!positive(op)) {
			steps.push(`\\text{Valori interni: } ${-k} ${o} ${pl(A)} ${o} ${k}`);
			// the last step divides by a: the line before it only when a ≠ 1
			if (a !== 1) steps.push(`${-k - b} ${o} ${pl(P(0, a))} ${o} ${k - b}`);
		} else {
			const fo = OP_LATEX[FLIP[op]];
			steps.push(`\\text{Valori esterni: } ${pl(A)} ${fo} ${-k} \\text{ oppure } ${pl(A)} ${o} ${k}`);
			steps.push(`${pl(A)} ${fo} ${-k}${IMPLIES}x ${fo} ${ends[0].toLatex()}`, `${pl(A)} ${o} ${k}${IMPLIES}x ${o} ${ends[1].toLatex()}`);
		}
		const crit = critOf(A, P(k))!;
		return { kind: 'k positivo', pr, steps, ivCands: commonIv(A, op, P(k), crit) };
	});
}

// Level 8: |A| op k with A of second degree
function level8(rng: Rng): Build | null {
	const pure = rng.next() < 0.6;
	return retry(() => {
		const b = pure ? level2Pure(rng) : level2Full(rng);
		if (!b) return null;
		const A = b.pr.args[0];
		const K = b.pr.rhs;
		const op = rng.pick(OPS);
		const crit = critOf(A, K)!;
		const truth = solveBy(absRel(A, op, K), crit);
		if (!truth.length || isAll(truth)) return null;
		const pr: Problem = { args: [A], rhs: K, rhsAbs: false, rel: op };
		const other: IvCand = { tag: 'altra sola', ivs: solveBy(plainRel(A, FLIP[op], pneg(K)), crit) };
		const [sc, one, ...rest] = commonIv(A, op, K, crit);
		return { kind: b.kind, pr, steps: ruleSteps(A, op, K, crit), ivCands: [one, other, sc, ...rest] };
	});
}

// Level 9: |A| op B(x)
function level9(rng: Rng): Build | null {
	const first = rng.next() < 0.6;
	return retry(() => {
		let A: Poly;
		let B: Poly;
		if (first) {
			const a1 = rng.pick([1, 1, 2, 3]);
			const b1 = intIn(rng, -9, 9, [0]);
			if (gcd(a1, Math.abs(b1)) !== 1) return null;
			const m = rng.pick([1, 2, 3, -1, -2]);
			if (Math.abs(m) === a1) return null;
			A = lin(a1, b1);
			B = lin(m, rng.int(-9, 9));
		} else {
			const g = quadPair(rng);
			if (!g || new Set(g.r).size !== 4) return null;
			({ A, B } = g);
		}
		const op = rng.pick(OPS);
		const crit = critOf(A, B);
		if (!crit || !small(crit, 4, 15)) return null;
		const truth = solveBy(absRel(A, op, B), crit);
		if (!truth.length || isAll(truth)) return null;
		const pr: Problem = { args: [A], rhs: B, rhsAbs: false, rel: op };
		const Bn = pneg(B);
		const cands: IvCand[] = [];
		if (positive(op)) {
			cands.push({ tag: 'intersezione', ivs: solveBy((x) => plainRel(A, op, B)(x) && plainRel(A, FLIP[op], Bn)(x), crit) });
			cands.push({ tag: 'condizione', ivs: solveBy((x) => absRel(A, op, B)(x) && evalP(B, x).sign() >= 0, crit) });
		} else {
			cands.push({ tag: 'unione', ivs: solveBy((x) => plainRel(A, op, B)(x) || plainRel(A, FLIP[op], Bn)(x), crit) });
		}
		cands.push(...commonIv(A, op, B, crit));
		return { kind: first ? 'primo grado' : 'secondo grado', pr, steps: ruleSteps(A, op, B, crit), ivCands: cands };
	});
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };
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

/** Whether a build can give a sample: a finite rational truth and three distinct wrong answers. */
function viable(b: Build): boolean {
	if (b.cands) {
		const truth = solveEquation(b.pr);
		return !!truth && pickWrong(truth, withPositive(b.cands, truth)).length === 3;
	}
	const crit = critOf(b.pr.args[0], b.pr.rhs);
	if (!crit) return false;
	if (b.quartet) return true;
	const truth = solveBy(absRel(b.pr.args[0], b.pr.rel, b.pr.rhs), crit);
	if (!truth.length || isAll(truth)) return false;
	const seen = new Set([ivsKey(truth)]);
	for (const c of b.ivCands ?? []) if (usable(c)) seen.add(ivsKey(c.ivs));
	return seen.size >= 4;
}

/** The tags "positive" (only the positive solutions) and, when left empty, "opposti" are filled once the truth is known. */
const withPositive = (cands: Cand[], truth: Rational[]): Cand[] =>
	cands.map((c) => ({ tag: c.tag, values: c.tag === 'positive' ? truth.filter((v) => v.sign() > 0) : c.tag === 'opposti' && !c.values.length ? uniqSorted(negs(truth)) : uniqSorted(c.values) }));

/** The four answers of the table of lesson 91 around the zero r of the argument: ℝ minus r, ℝ, ∅, {r}. */
function quartet(r: Rational): IvCand[] {
	return [
		{ tag: 'tabella:>', ivs: [{ lo: null, hi: r, loC: false, hiC: false }, { lo: r, hi: null, loC: false, hiC: false }] },
		{ tag: 'tabella:>=', ivs: [{ lo: null, hi: null, loC: false, hiC: false }] },
		{ tag: 'tabella:<', ivs: [] },
		{ tag: 'tabella:<=', ivs: [{ lo: r, hi: r, loC: true, hiC: true }] },
	];
}

const usable = (c: IvCand) => c.ivs.length > 0 && !isAll(c.ivs);

function prJSON(pr: Problem) {
	return { args: pr.args.map(polyJSON), rhs: polyJSON(pr.rhs), rhsAbs: pr.rhsAbs, rel: pr.rel };
}

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const problem = problemLatex(b.pr);
	const base = { generatorId: ID, level, seed: rng.seed, problem };
	if (b.cands) {
		const truth = solveEquation(b.pr);
		if (!truth) return null;
		const cands = withPositive(b.cands, truth);
		if (pickWrong(truth, cands).length < 3) return null;
		const sol = valuesLatex(truth);
		const answer: SetAnswer = { kind: 'set', values: truth.map(String), latex: sol };
		return {
			...base,
			prompt: "Risolvi l'equazione.",
			solution: sol,
			steps: [...b.steps, sol],
			answer,
			params: { ...prJSON(b.pr), case: b.kind, truth: truth.map(String), distractors: cands.map((c) => ({ tag: c.tag, values: c.values.map(String) })), ...b.extra },
		};
	}
	const op = b.pr.rel as Op;
	const A = b.pr.args[0];
	const crit = critOf(A, b.pr.rhs);
	if (!crit) return null;
	const truth = solveBy(absRel(A, op, b.pr.rhs), crit);
	let picked: IvCand[];
	if (b.quartet) {
		const four = quartet(b.quartet);
		const i = four.findIndex((c) => ivsKey(c.ivs) === ivsKey(truth));
		if (i < 0) return null;
		picked = [{ tag: 'giusta', ivs: truth }, ...four.filter((_, j) => j !== i)];
	} else {
		if (!truth.length || isAll(truth)) return null;
		picked = [{ tag: 'giusta', ivs: truth }];
		const seen = new Set([ivsKey(truth)]);
		for (const c of b.ivCands ?? []) {
			if (picked.length === 4) break;
			if (!usable(c) || seen.has(ivsKey(c.ivs))) continue;
			seen.add(ivsKey(c.ivs));
			picked.push(c);
		}
		if (picked.length < 4) return null;
	}
	const notation: Notation = b.quartet ? 'intervalli' : rng.next() < 0.5 ? 'disequazioni' : 'intervalli';
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
		params: { ...prJSON(b.pr), case: b.kind, notation, truth: truth.map(ivValue), optionTags: order.map((i) => picked[i].tag), ...b.extra },
	};
}

// ---------------------------------------------------------------------------
// Check

function problemFrom(p: Record<string, unknown>): Problem | null {
	const args = Array.isArray(p.args) ? p.args.map(polyFrom) : null;
	const rhs = polyFrom(p.rhs);
	if (!args || args.some((a) => !a) || !rhs || typeof p.rhsAbs !== 'boolean' || typeof p.rel !== 'string') return null;
	return { args: args as Poly[], rhs, rhsAbs: p.rhsAbs, rel: p.rel as Rel };
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const lvl = s.level;
	if (!BUILDERS[lvl]) return [`livello ${lvl} sconosciuto`];
	const pr = problemFrom(s.params);
	if (!pr) return ['params non validi'];
	if (problemLatex(pr) !== s.problem) errs.push('il testo non corrisponde ai params');
	errs.push(...forbidden(s.problem));
	const degs = pr.args.map(deg);
	const ans = s.answer;
	if (EQUATION_LEVELS.includes(lvl)) {
		if (pr.rel !== '=') return [...errs, 'serve un\'equazione'];
		const truth = solveEquation(pr);
		if (!truth) return [...errs, 'equazione con infinite soluzioni o soluzioni irrazionali'];
		if (ans.kind !== 'set' || ans.values.join(',') !== truth.map(String).join(',') || ans.universal) errs.push('risposta diversa dalla soluzione');
		// every value, put back into the equation with the bars, must satisfy it
		if (ans.kind === 'set') for (const v of ans.values) if (!lhsAt(pr, Rational.parse(v)).equals(rhsAt(pr, Rational.parse(v)))) errs.push(`x = ${v} non soddisfa l'equazione`);
		const cands = (s.params.distractors as { tag: string; values: string[] }[]) ?? [];
		if (pickWrong(truth, cands.map((c) => ({ tag: c.tag, values: c.values.map((v) => Rational.parse(v)) }))).length < 3) errs.push('meno di tre distrattori distinti');
		const k = co(pr.rhs, 0);
		switch (lvl) {
			case 1:
				if (degs.join() !== '1' || deg(pr.rhs) > 0 || pr.rhsAbs) errs.push('livello 1: |ax + b| = k');
				break;
			case 2:
				if (degs.join() !== '2' || deg(pr.rhs) > 0 || k.sign() <= 0) errs.push('livello 2: |A| = k con A di secondo grado e k positivo');
				break;
			case 3:
				if (degs.join() !== '1' || deg(pr.rhs) !== 1 || !pr.rhsAbs || truth.length !== 2) errs.push('livello 3: |A| = |B| di primo grado, due soluzioni');
				break;
			case 4:
			case 5: {
				if (degs.join() !== (lvl === 4 ? '1' : '2') || deg(pr.rhs) !== 1 || pr.rhsAbs) errs.push(`livello ${lvl}: |A| = B`);
				// the candidates of A = B and A = -B: the condition B ≥ 0 keeps exactly the solutions
				const cs = uniqSorted([...(rootsOf(psub(pr.args[0], pr.rhs)) ?? []), ...(rootsOf(padd(pr.args[0], pr.rhs)) ?? [])]);
				if (cs.filter((c) => evalP(pr.rhs, c).sign() >= 0).map(String).join() !== truth.map(String).join()) errs.push('condizione B ≥ 0 non rispettata');
				if (lvl === 5 && (cs.length !== 4 || truth.length === 0 || truth.length === 4)) errs.push('livello 5: quattro candidati, almeno uno accettato e uno scartato');
				break;
			}
			case 6:
				if (degs.join() !== '1,1' || deg(pr.rhs) > 1 || pr.rhsAbs) errs.push('livello 6: due valori assoluti di primo grado');
				break;
		}
		if (s.solution !== valuesLatex(truth)) errs.push('soluzione scritta male');
		return errs;
	}
	const op = pr.rel as Op;
	if (!OPS.includes(op)) return [...errs, 'serve una disequazione'];
	const A = pr.args[0];
	const crit = critOf(A, pr.rhs);
	if (!crit) return [...errs, 'punti critici irrazionali'];
	const truth = solveBy(absRel(A, op, pr.rhs), crit);
	if (ans.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== ivsKey(truth)) errs.push('opzione giusta sbagliata');
	const k = co(pr.rhs, 0);
	if (lvl === 7 && (pr.args.length !== 1 || degs[0] !== 1 || deg(pr.rhs) > 0)) errs.push('livello 7: |ax + b| op k');
	if (lvl === 8 && (pr.args.length !== 1 || degs[0] !== 2 || deg(pr.rhs) > 0 || k.sign() <= 0)) errs.push('livello 8: |A| op k con A di secondo grado');
	if (lvl === 9 && (pr.args.length !== 1 || deg(pr.rhs) !== 1)) errs.push('livello 9: |A| op B con B di primo grado');
	if (lvl >= 8 && (!truth.length || isAll(truth))) errs.push('soluzione vuota o R');
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

const valoreAssolutoEquazioni: Generator = {
	id: ID,
	title: 'Equazioni e disequazioni con il valore assoluto',
	levels: {
		1: { label: 'Valore assoluto uguale a un numero', constraints: ['|ax + b| = k con k positivo (6 su 10), nullo (2 su 10) o negativo (2 su 10)'] },
		2: { label: 'Argomento di secondo grado', constraints: ['|x^2 - c| = k (6 su 10) o |x^2 + px + c| = k, soluzioni intere'] },
		3: { label: 'Due valori assoluti uguali', constraints: ['|a1 x + b1| = |a2 x + b2|, due soluzioni'] },
		4: { label: 'Secondo membro con la x', constraints: ['|ax + b| = mx + n con la condizione mx + n ≥ 0'] },
		5: { label: 'Secondo membro con la x, argomento di secondo grado', constraints: ['|x^2 + px + c| = mx + n, quattro candidati interi, almeno uno scartato'] },
		6: { label: 'Più valori assoluti', constraints: ['|m1 x - n1| + |m2 x - n2| = k oppure mx + n, studio per intervalli'] },
		7: { label: 'Disequazioni con un numero', constraints: ['|ax + b| op k, k positivo (7 su 10) o nullo o negativo'] },
		8: { label: 'Disequazioni di secondo grado', constraints: ['|A| op k con A di secondo grado, k positivo'] },
		9: { label: 'Disequazioni con la x a secondo membro', constraints: ['|A| op mx + n, A di primo (6 su 10) o di secondo grado'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		// the first draw of a seed is not uniform across consecutive seeds
		rng.next();
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default valoreAssolutoEquazioni;
