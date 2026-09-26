/**
 * Disequazioni di primo grado e intervalli. Spec: specs/exercises/disequazioni-primo-grado.md
 *
 * Seven levels in the order of the lesson: intervals (from an inequality to an interval and back), a
 * positive coefficient, a negative coefficient (the sign flips), parentheses and the unknown on both
 * sides, numeric denominators with a fractional endpoint, the cases 0x ⋈ b, word problems.
 *
 * No answer type holds an interval, so levels 1-6 answer with a choice among sets written as the lesson
 * writes them: S = \mathopen{]}-\infty, 3\mathclose{[}, S = [-1, +\infty\mathclose{[}, S = \mathbb{R},
 * S = \emptyset; with a fractional endpoint the brackets are \left[ … \right[. Level 7 answers a number
 * (the most or the fewest items, the lowest mark) and builds its choice from the mistakes.
 *
 * Built backwards: the endpoint is chosen first, then one constant is computed so that the two sides are
 * equal there. Each side is a list of terms k·(a·x + b)/d, as in equazioni-primo-grado.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { numberChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'disequazioni-primo-grado';
const MAX_COEF = 60;

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'fattore 1 davanti a una parentesi', re: /(?<![\d.])1\(/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

// ---------------------------------------------------------------------------
// Relations and solution sets

export type Rel = '<' | '<=' | '>' | '>=';
const RELS: Rel[] = ['<', '<=', '>', '>='];
const REL_TEX: Record<Rel, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
/** The sign turned round, as when dividing by a negative number. */
const flip = (r: Rel): Rel => ({ '<': '>', '<=': '>=', '>': '<', '>=': '<=' })[r] as Rel;
const holds = (l: Rational, r: Rel, v: Rational) => {
	const c = l.compare(v);
	return r === '<' ? c < 0 : r === '<=' ? c <= 0 : r === '>' ? c > 0 : c >= 0;
};

/**
 * A solution set: all reals, the empty set, or an interval. An endpoint null is -∞ (lo) or +∞ (hi). A
 * distractor may "include" an infinite end ([-\infty), the mistake the lesson warns about.
 */
export type Sol = { t: 'R' } | { t: 'E' } | { t: 'I'; lo: Rational | null; loIn: boolean; hi: Rational | null; hiIn: boolean };

const R_SET: Sol = { t: 'R' };
const EMPTY: Sol = { t: 'E' };

/** The set of the x with x ⋈ v. */
function half(r: Rel, v: Rational): Sol {
	if (r === '>' || r === '>=') return { t: 'I', lo: v, loIn: r === '>=', hi: null, hiIn: false };
	return { t: 'I', lo: null, loIn: false, hi: v, hiIn: r === '<=' };
}

function solKey(s: Sol): string {
	if (s.t !== 'I') return s.t;
	return [s.lo?.toString() ?? '-oo', s.loIn ? '1' : '0', s.hi?.toString() ?? '+oo', s.hiIn ? '1' : '0'].join('|');
}
/** Choice values: ["R"], ["E"], or [lo, loIn, hi, hiIn] with "-oo", "+oo" and "1"/"0". */
const solValues = (s: Sol): string[] => solKey(s).split('|');

const endTex = (v: Rational | null, side: 'lo' | 'hi') => (v ? v.toLatex() : side === 'lo' ? '-\\infty' : '+\\infty');

/**
 * An interval as the lesson writes it: [a, b], \mathopen{]}a, b\mathclose{[}, [a, +\infty\mathclose{[}.
 * With a fraction at an end the brackets grow: \left[-\frac{14}{5}, +\infty\right[.
 */
export function intervalTex(s: Extract<Sol, { t: 'I' }>): string {
	const big = !!(s.lo && !s.lo.isInteger()) || !!(s.hi && !s.hi.isInteger());
	const open = big ? (s.loIn ? '\\left[' : '\\left]') : s.loIn ? '[' : '\\mathopen{]}';
	const close = big ? (s.hiIn ? '\\right]' : '\\right[') : s.hiIn ? ']' : '\\mathclose{[}';
	return `${open}${endTex(s.lo, 'lo')}, ${endTex(s.hi, 'hi')}${close}`;
}

export function solTex(s: Sol): string {
	if (s.t === 'R') return 'S = \\mathbb{R}';
	if (s.t === 'E') return 'S = \\emptyset';
	return `S = ${intervalTex(s)}`;
}

/** The inequality that describes an interval: -1 \le x < 3, x > 2. */
function inequalityTex(s: Extract<Sol, { t: 'I' }>): string {
	if (s.lo && s.hi) return `${s.lo.toLatex()} ${s.loIn ? '\\le' : '<'} x ${s.hiIn ? '\\le' : '<'} ${s.hi.toLatex()}`;
	if (s.lo) return `x ${s.loIn ? '\\ge' : '>'} ${s.lo.toLatex()}`;
	return `x ${s.hiIn ? '\\le' : '<'} ${s.hi!.toLatex()}`;
}

// ---------------------------------------------------------------------------
// Terms and sides: k·(a·x + b)/d

export interface Term {
	k: number;
	a: number;
	b: number;
	d: number;
}
const T = (k: number, a: number, b: number, d = 1): Term => ({ k, a, b, d });
const X = (a: number): Term => T(1, a, 0);
const C = (b: number): Term => T(1, 0, b);

function linearOf(side: Term[]): { a: Rational; b: Rational } {
	let a = q(0), b = q(0);
	for (const t of side) {
		a = a.add(q(t.k * t.a, t.d));
		b = b.add(q(t.k * t.b, t.d));
	}
	return { a, b };
}
const evaluate = (side: Term[], x: Rational) => {
	const { a, b } = linearOf(side);
	return a.mul(x).add(b);
};

/** Normal form A·x ⋈ B (x terms on the left, numbers on the right). */
function normalForm(lhs: Term[], rhs: Term[]): { A: Rational; B: Rational } {
	const l = linearOf(lhs), r = linearOf(rhs);
	return { A: l.a.sub(r.a), B: r.b.sub(l.b) };
}

/** The solution set of A·x ⋈ B, as the lesson's table says. */
function solveNormal(A: Rational, rel: Rel, B: Rational): Sol {
	if (A.isZero()) return holds(q(0), rel, B) ? R_SET : EMPTY;
	return A.sign() > 0 ? half(rel, B.div(A)) : half(flip(rel), B.div(A));
}

const solve = (lhs: Term[], rel: Rel, rhs: Term[]) => {
	const { A, B } = normalForm(lhs, rhs);
	return solveNormal(A, rel, B);
};

const inner = (t: Term) => polyToLatex(poly(t.b, t.a));

function termBody(t: Term): { sign: 1 | -1; body: string } {
	if (t.d !== 1 && t.a === 0) return { sign: t.k * t.b < 0 ? -1 : 1, body: `\\frac{${Math.abs(t.b)}}{${t.d}}` };
	if (t.d !== 1) return { sign: t.k < 0 ? -1 : 1, body: `\\frac{${inner(t)}}{${t.d}}` };
	if (t.k !== 1) return { sign: t.k < 0 ? -1 : 1, body: `${Math.abs(t.k) === 1 ? '' : Math.abs(t.k)}(${inner(t)})` };
	if (t.a !== 0 && t.b !== 0) return { sign: 1, body: `(${inner(t)})` };
	const c = t.a !== 0 ? t.a : t.b;
	const abs = Math.abs(c);
	const body = t.a !== 0 ? `${abs === 1 ? '' : abs}x` : `${abs}`;
	return { sign: c < 0 ? -1 : 1, body };
}

export function sideLatex(side: Term[]): string {
	if (side.length === 0) return '0';
	return side
		.map((t, i) => {
			const { sign, body } = termBody(t);
			if (i === 0) return (sign < 0 ? '-' : '') + body;
			return (sign < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}

/** A sequence of monomials, not reduced: "4x + 4 - 3". */
function monoSeq(items: { c: Rational; x: boolean }[]): string {
	const nz = items.filter((m) => !m.c.isZero());
	if (nz.length === 0) return '0';
	return nz
		.map((m, i) => {
			const abs = m.c.abs();
			const body = m.x ? (abs.isOne() ? 'x' : `${abs.toLatex()}x`) : abs.toLatex();
			if (i === 0) return (m.c.sign() < 0 ? '-' : '') + body;
			return (m.c.sign() < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}

const expanded = (side: Term[]) =>
	side.flatMap((t) => [
		{ c: q(t.k * t.a, t.d), x: true },
		{ c: q(t.k * t.b, t.d), x: false },
	]);

const axTex = (A: Rational) => (A.isZero() ? '0x' : A.isOne() ? 'x' : A.equals(q(-1)) ? '-x' : `${A.toLatex()}x`);

// ---------------------------------------------------------------------------
// Construction, levels 2-6

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}
const shuffle2 = <U>(rng: Rng, xs: U[]): U[] => (rng.int(0, 1) ? [...xs].reverse() : xs);

interface Built {
	lhs: Term[];
	rel: Rel;
	rhs: Term[];
	kind: string;
}

/** The constant that makes the two sides equal at x = s, to append to the right side. */
const closing = (lhs: Term[], rhs: Term[], s: Rational) => evaluate(lhs, s).sub(evaluate(rhs, s));

function withConstant(rhs: Term[], c: Rational): Term[] | null {
	if (!c.isInteger() || Math.abs(c.num) > MAX_COEF) return null;
	return c.isZero() ? rhs : [...rhs, C(c.num)];
}

function build(rng: Rng, level: number): Built | null {
	const rel = rng.pick(RELS);
	const s = q(rng.int(-10, 10));
	switch (level) {
		case 2: {
			// a·x + b ⋈ c, a from 2 to 9 (example 1: 3x - 5 > 7)
			const lhs = shuffle2(rng, [X(rng.int(2, 9)), C(nonZero(rng, -20, 20))]);
			const rhs = withConstant([], closing(lhs, [], s));
			return rhs && { lhs, rel, rhs, kind: 'positivo' };
		}
		case 3: {
			// Negative coefficient (example 2: 2 - 5x ≥ 17), or a positive one with a negative right side (3x > -6).
			const neg = rng.next() < 0.7;
			const a = neg ? rng.int(-9, -1) : rng.int(2, 9);
			const sol = neg ? s : q(rng.int(-10, -1));
			const alone = rng.next() < 0.3 && a !== -1;
			const lhs = alone ? [X(a)] : shuffle2(rng, [X(a), C(nonZero(rng, -20, 20))]);
			const rhs = withConstant([], closing(lhs, [], sol));
			if (!rhs || (!neg && linearOf(rhs).b.sub(linearOf(lhs).b).sign() >= 0)) return null;
			return { lhs, rel, rhs, kind: neg ? 'negativo' : 'positivo' };
		}
		case 4: {
			// Parentheses and the unknown on both sides (example 3: 4(x + 1) - 3 ≤ 6x - (x - 2)).
			const k = () => rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
			const paren = (kk = k()) => T(kk, rng.int(1, 3), nonZero(rng, -9, 9));
			const v = rng.int(1, 4);
			let lhs: Term[], rhs: Term[];
			if (v === 1) {
				lhs = [paren()];
				if (rng.int(0, 1)) lhs.push(C(nonZero(rng, -9, 9)));
				rhs = [X(nonZero(rng, -9, 9))];
			} else if (v === 2) {
				lhs = [paren(), paren()];
				rhs = [X(nonZero(rng, -9, 9))];
			} else if (v === 3) {
				lhs = [paren()];
				rhs = [paren()];
			} else {
				lhs = [paren(), C(nonZero(rng, -9, 9))];
				rhs = [X(rng.int(2, 9)), paren(-1)];
			}
			const rh = withConstant(rhs, closing(lhs, rhs, s));
			// no side whose x terms cancel (3x - (3x - 7)): that is level 6
			if (!rh || normalForm(lhs, rh).A.isZero() || linearOf(lhs).a.isZero() || linearOf(rh).a.isZero()) return null;
			return { lhs, rel, rhs: rh, kind: normalForm(lhs, rh).A.sign() > 0 ? 'positivo' : 'negativo' };
		}
		case 5: {
			// Numeric denominators (example 4: (x - 2)/3 - (x + 1)/2 ≤ x/4), the endpoint often a fraction.
			const sol = rng.next() < 0.5 ? q(rng.int(-9, 9)) : q(nonZero(rng, -12, 12), rng.int(2, 5));
			const den = () => rng.int(2, 6);
			const frac = (sign: 1 | -1, d: number) => {
				const a = rng.int(1, 4);
				const b = rng.next() < 0.2 ? 0 : nonZero(rng, -9, 9);
				return T(sign, a, b, d);
			};
			const d1 = den(), d2 = den();
			const lhs = [frac(1, d1), frac(rng.int(0, 1) ? 1 : -1, d2)];
			if (rng.next() < 0.3) lhs.push(C(nonZero(rng, -9, 9)));
			let rhs: Term[];
			if (rng.next() < 0.6) {
				// k3·(a3·x + b3)/d3, b3 computed
				const d3 = den(), a3 = rng.int(0, 3);
				let k3: 1 | -1 = rng.int(0, 1) ? 1 : -1;
				let b3 = evaluate(lhs, sol).mul(q(k3 * d3)).sub(q(a3).mul(sol));
				if (!b3.isInteger() || Math.abs(b3.num) > 30) return null;
				if (a3 === 0 && b3.isZero()) return null;
				if (a3 === 0 && b3.sign() < 0) {
					k3 = k3 === 1 ? -1 : 1;
					b3 = b3.neg();
				}
				rhs = [T(k3, a3, b3.num, d3)];
			} else {
				// a term without denominator on the right: c·x + e, e computed
				const c = rng.int(-3, 3);
				const base = c === 0 ? [] : [X(c)];
				const r = withConstant(base, closing(lhs, base, sol));
				if (!r || r.length === 0) return null;
				rhs = r;
			}
			const { A } = normalForm(lhs, rhs);
			if (A.isZero()) return null;
			return { lhs, rel, rhs, kind: A.sign() > 0 ? 'positivo' : 'negativo' };
		}
		case 6: {
			const u = rng.next();
			if (u < 0.2) {
				for (;;) {
					const b = build(rng, 4);
					if (b) return { ...b, kind: 'determinata' };
				}
			}
			const want = u < 0.6 ? 'sempre' : 'impossibile';
			// k(ax + b) [+ e·x or + e] ⋈ (k·a + e)·x + f (examples 5 and 6)
			const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
			const a = rng.int(1, 3);
			const lhs: Term[] = [T(k, a, nonZero(rng, -9, 9))];
			const extra = rng.int(0, 2);
			let e = 0;
			if (extra === 1) {
				e = nonZero(rng, -5, 5);
				lhs.push(X(e));
			} else if (extra === 2) lhs.push(C(nonZero(rng, -9, 9)));
			if (k * a + e === 0) return null;
			const delta = rng.next() < 1 / 3 ? 0 : nonZero(rng, -6, 6);
			const ok = RELS.filter((r) => holds(q(0), r, q(delta)) === (want === 'sempre'));
			const r = rng.pick(ok);
			const f = linearOf(lhs).b.add(q(delta));
			const rhs = withConstant([X(k * a + e)], f);
			if (!rhs) return null;
			return { lhs, rel: r, rhs: shuffle2(rng, rhs), kind: want };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps, levels 2-6

function finalSteps(A: Rational, rel: Rel, B: Rational, sol: Sol): string[] {
	const out: string[] = [];
	if (A.isZero()) {
		const truth = holds(q(0), rel, B);
		out.push(
			`\\text{Il primo membro vale } 0 \\text{ per ogni } x \\text{, e } 0 ${REL_TEX[rel]} ${B.toLatex()} \\text{ è ${truth ? 'vera' : 'falsa'}: la disequazione è ${truth ? 'sempre verificata' : 'impossibile'}}`,
		);
	} else if (A.equals(q(-1))) {
		out.push(`\\text{Moltiplica per } -1 \\text{ e cambia il verso: } x ${REL_TEX[flip(rel)]} ${B.neg().toLatex()}`);
	} else if (!A.isOne()) {
		const r = A.sign() > 0 ? rel : flip(rel);
		const why = A.sign() > 0 ? 'che è positivo, e il verso resta' : 'che è negativo, e cambia il verso';
		out.push(`\\text{Dividi per } ${A.sign() < 0 ? `(${A.toLatex()})` : A.toLatex()}\\text{, ${why}: } x ${REL_TEX[r]} ${B.div(A).toLatex()}`);
	}
	out.push(solTex(sol));
	return out;
}

function steps(lhs: Term[], rel: Rel, rhs: Term[]): string[] {
	const out: string[] = [];
	const R = REL_TEX[rel];
	const m = [...lhs, ...rhs].map((t) => t.d).reduce((acc, d) => lcm(acc, d), 1);
	let L = lhs, Rh = rhs;
	if (m > 1) {
		const clear = (t: Term) => (t.a === 0 ? C(t.k * (m / t.d) * t.b) : t.b === 0 ? X(t.k * (m / t.d) * t.a) : T(t.k * (m / t.d), t.a, t.b));
		L = lhs.map(clear);
		Rh = rhs.map(clear);
		out.push(`\\text{Il MCM dei denominatori è } ${m}\\text{, positivo: moltiplica ogni termine per } ${m} \\text{ senza cambiare il verso: } ${sideLatex(L)} ${R} ${sideLatex(Rh)}`);
	}
	if ([...L, ...Rh].some((t) => t.k !== 1 || (t.a !== 0 && t.b !== 0))) {
		out.push(`\\text{Togli le parentesi: } ${monoSeq(expanded(L))} ${R} ${monoSeq(expanded(Rh))}`);
	}
	const lx = expanded(L).filter((e) => e.x), lc = expanded(L).filter((e) => !e.x);
	const rx = expanded(Rh).filter((e) => e.x), rc = expanded(Rh).filter((e) => !e.x);
	const moveX = [...lx, ...rx.map((e) => ({ c: e.c.neg(), x: true }))];
	const moveC = [...rc, ...lc.map((e) => ({ c: e.c.neg(), x: false }))];
	const A = moveX.reduce((s, e) => s.add(e.c), q(0));
	const B = moveC.reduce((s, e) => s.add(e.c), q(0));
	const nx = moveX.filter((e) => !e.c.isZero()).length, nc = moveC.filter((e) => !e.c.isZero()).length;
	const alreadyNormal = rx.every((e) => e.c.isZero()) && lc.every((e) => e.c.isZero()) && nx <= 1 && nc <= 1;
	if (!alreadyNormal) {
		out.push(`\\text{Porta i termini con la } x \\text{ a primo membro e i numeri a secondo membro: } ${monoSeq(moveX)} ${R} ${monoSeq(moveC)}`);
		if (nx > 1 || nc > 1) out.push(`\\text{Riduci i termini simili: } ${axTex(A)} ${R} ${B.toLatex()}`);
	}
	out.push(...finalSteps(A, rel, B, solveNormal(A, rel, B)));
	return out;
}

// ---------------------------------------------------------------------------
// Choice, levels 2-6

/** Wrong normal forms from the mistakes of the lesson, each solved with its own coefficient. */
function mistakeSols(lhs: Term[], rel: Rel, rhs: Term[]): Sol[] {
	const out: Sol[] = [];
	const m = [...lhs, ...rhs].map((t) => t.d).reduce((acc, d) => lcm(acc, d), 1);
	const scale = (side: Term[]) => side.map((t) => T(t.k * (m / t.d), t.a, t.b));
	const L = linearOf(scale(lhs)), R = linearOf(scale(rhs));
	const A = L.a.sub(R.a);
	const push = (a: Rational, b: Rational) => {
		if (!a.isZero()) out.push(solveNormal(a, rel, b));
	};
	// the minus in front of a parenthesis or of a fraction applied to the first term only
	const wrongMinus = (side: Term[]) => linearOf(scale(side).flatMap((t) => (t.k < 0 && t.a !== 0 && t.b !== 0 ? [T(t.k, t.a, 0), T(1, 0, t.b * Math.abs(t.k))] : [t])));
	const wl = wrongMinus(lhs), wr = wrongMinus(rhs);
	push(wl.a.sub(wr.a), wr.b.sub(wl.b));
	// a term without denominator not multiplied by the MCM
	if (m > 1 && [...lhs, ...rhs].some((t) => t.d === 1)) {
		const keep = (side: Term[]) => linearOf(side.map((t) => (t.d === 1 ? t : T(t.k * (m / t.d), t.a, t.b))));
		const kl = keep(lhs), kr = keep(rhs);
		push(kl.a.sub(kr.a), kr.b.sub(kl.b));
	}
	// a number carried across without changing its sign
	push(A, R.b.add(L.b));
	return out;
}

function assemble(rng: Rng, correct: Sol, cands: (Sol | null)[], tex: (s: Sol) => string): ChoiceAnswer {
	const seen = new Set([solKey(correct)]);
	const opts: Sol[] = [correct];
	const add = (s: Sol | null) => {
		if (!s || opts.length >= 4 || seen.has(solKey(s))) return;
		if (s.t === 'I' && ((s.lo && Math.abs(s.lo.num) > 200) || (s.hi && Math.abs(s.hi.num) > 200))) return;
		if (s.t === 'I' && ((s.lo && s.lo.den > 20) || (s.hi && s.hi.den > 20))) return;
		seen.add(solKey(s));
		opts.push(s);
	};
	cands.forEach(add);
	if (correct.t === 'I') {
		const v = (correct.lo ?? correct.hi)!;
		const rel: Rel = correct.lo ? (correct.loIn ? '>=' : '>') : correct.hiIn ? '<=' : '<';
		for (let d = 1; opts.length < 4 && d < 30; d++) {
			add(half(rel, v.add(q(d))));
			add(half(rel, v.sub(q(d))));
		}
	}
	if (opts.length < 4) throw new Error(`${ID}: not enough distractors`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: tex(opts[i]), values: solValues(opts[i]) }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** The same half-line with the endpoint included the other way; the other half-line from the same endpoint. */
function bracketFlip(s: Sol): Sol | null {
	if (s.t !== 'I') return null;
	return s.lo && !s.hi ? { ...s, loIn: !s.loIn } : !s.lo && s.hi ? { ...s, hiIn: !s.hiIn } : null;
}
function versoFlip(s: Sol): Sol | null {
	if (s.t !== 'I') return null;
	if (s.lo && !s.hi) return { t: 'I', lo: null, loIn: false, hi: s.lo, hiIn: s.loIn };
	if (!s.lo && s.hi) return { t: 'I', lo: s.hi, loIn: s.hiIn, hi: null, hiIn: false };
	return null;
}

function equationChoice(rng: Rng, lhs: Term[], rel: Rel, rhs: Term[], level: number): ChoiceAnswer {
	const sol = solve(lhs, rel, rhs);
	const { A, B } = normalForm(lhs, rhs);
	const cands: (Sol | null)[] = [];
	if (sol.t === 'I') {
		const vf = versoFlip(sol), bf = bracketFlip(sol);
		cands.push(vf, bf);
		if (level === 3) {
			// the endpoint with its sign changed (divided by the absolute value), then both mistakes together
			cands.push(half(A.sign() > 0 ? rel : flip(rel), B.div(A).neg()), vf && bracketFlip(vf));
		} else if (level === 2) {
			cands.push(...mistakeSols(lhs, rel, rhs), vf && bracketFlip(vf));
		} else if (level === 6) {
			cands.length = 0;
			cands.push(vf, R_SET, EMPTY, bf);
		} else {
			cands.push(...mistakeSols(lhs, rel, rhs), vf && bracketFlip(vf));
		}
	} else {
		// 0x ⋈ B: the other case, and 0x read as x (x ⋈ B), with the endpoint also the other way
		const asX = half(rel, B);
		cands.push(sol.t === 'R' ? EMPTY : R_SET, asX, bracketFlip(asX), versoFlip(asX));
	}
	return assemble(rng, sol, cands, solTex);
}

// ---------------------------------------------------------------------------
// Level 1: intervals

function level1(rng: Rng): Sample {
	const dir = rng.int(0, 1) === 0 ? 'intervallo' : 'disuguaglianza';
	const bounded = rng.next() < 0.5;
	let sol: Extract<Sol, { t: 'I' }>;
	let cands: Sol[];
	if (bounded) {
		const a = rng.int(-9, 8);
		const b = rng.int(a + 1, Math.min(a + 10, 10));
		const combos = [
			[true, true],
			[true, false],
			[false, true],
			[false, false],
		].map(([li, hi]) => ({ t: 'I' as const, lo: q(a), loIn: li, hi: q(b), hiIn: hi }));
		sol = rng.pick(combos);
		cands = combos;
	} else {
		const v = q(rng.int(-10, 10));
		const rel = rng.pick(RELS);
		sol = half(rel, v) as Extract<Sol, { t: 'I' }>;
		if (dir === 'disuguaglianza') cands = RELS.map((r) => half(r, v));
		else {
			const wrongInf: Sol = sol.lo ? { ...sol, hiIn: true } : { ...sol, loIn: true };
			const vf = versoFlip(sol)!;
			cands = [bracketFlip(sol)!, vf, rng.int(0, 1) ? wrongInf : bracketFlip(vf)!];
		}
	}
	const optTex = (s: Sol) => (s.t !== 'I' ? solTex(s) : dir === 'intervallo' ? intervalTex(s) : inequalityTex(s));
	const choice = assemble(rng, sol, cands, optTex);
	const problem = dir === 'intervallo' ? inequalityTex(sol) : intervalTex(sol);
	const lo = sol.lo, hi = sol.hi;
	const say: string[] = [];
	if (lo) say.push(`${lo.toLatex()} \\text{ è ${sol.loIn ? 'incluso' : 'escluso'}: pallino ${sol.loIn ? 'pieno' : 'vuoto'} e parentesi ${sol.loIn ? 'rivolta verso il numero' : "rivolta verso l'esterno"}}`);
	else say.push(`\\text{L'intervallo prosegue verso sinistra senza fine: } -\\infty\\text{, con la parentesi rivolta verso l'esterno}`);
	if (hi) say.push(`${hi.toLatex()} \\text{ è ${sol.hiIn ? 'incluso' : 'escluso'}: pallino ${sol.hiIn ? 'pieno' : 'vuoto'} e parentesi ${sol.hiIn ? 'rivolta verso il numero' : "rivolta verso l'esterno"}}`);
	else say.push(`\\text{L'intervallo prosegue verso destra senza fine: } +\\infty\\text{, con la parentesi rivolta verso l'esterno}`);
	return {
		generatorId: ID,
		level: 1,
		seed: rng.seed,
		prompt: dir === 'intervallo' ? 'Quale intervallo contiene i numeri che rispettano la disuguaglianza?' : "Quale disuguaglianza descrive l'intervallo?",
		problem,
		solution: dir === 'intervallo' ? intervalTex(sol) : inequalityTex(sol),
		steps: [...say, dir === 'intervallo' ? `${inequalityTex(sol)} \\text{ si scrive } ${intervalTex(sol)}` : `${intervalTex(sol)} \\text{ si scrive } ${inequalityTex(sol)}`],
		answer: choice,
		params: { direction: dir, shape: bounded ? 'limitato' : 'illimitato', set: solValues(sol) },
	};
}

// ---------------------------------------------------------------------------
// Sample and checks, levels 2-6

const termStr = (t: Term) => ({ k: String(t.k), a: String(t.a), b: String(t.b), d: String(t.d) });
function parseTerms(x: unknown): Term[] | null {
	if (!Array.isArray(x)) return null;
	return x.map((t) => T(Number(t.k), Number(t.a), Number(t.b), Number(t.d)));
}

function assembleSample(b: Built, level: number, rng: Rng): Sample {
	const sol = solve(b.lhs, b.rel, b.rhs);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Risolvi la disequazione e scegli l\'insieme delle soluzioni.',
		problem: `${sideLatex(b.lhs)} ${REL_TEX[b.rel]} ${sideLatex(b.rhs)}`,
		solution: solTex(sol),
		steps: steps(b.lhs, b.rel, b.rhs),
		answer: equationChoice(rng, b.lhs, b.rel, b.rhs, level),
		params: { lhs: b.lhs.map(termStr), rel: b.rel, rhs: b.rhs.map(termStr), kind: b.kind, set: solValues(sol) },
	};
}

function checkEquation(sample: Sample): string[] {
	const v: string[] = [];
	const lhs = parseTerms(sample.params.lhs), rhs = parseTerms(sample.params.rhs);
	const rel = sample.params.rel as Rel;
	if (!lhs || !rhs || !RELS.includes(rel)) return ['params non validi'];
	for (const t of [...lhs, ...rhs]) {
		if (![t.k, t.a, t.b, t.d].every(Number.isInteger) || t.d < 1) v.push('termine con valori non interi');
		if (Math.abs(t.k * t.a) > MAX_COEF || Math.abs(t.k * t.b) > MAX_COEF) v.push('coefficiente troppo grande');
		if (t.k === 1 && t.d === 1 && t.a !== 0 && t.b !== 0) v.push('termine piatto con due monomi');
		if (t.a === 0 && t.b === 0) v.push('termine nullo');
		if (t.d > 1 && gcd(gcd(t.a, t.b), t.d) > 1) v.push('frazione non ridotta');
	}
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const sol = solve(lhs, rel, rhs);
	if ((sample.params.set as string[]).join('|') !== solKey(sol)) v.push('params.set diverso dalla soluzione');
	const ans = sample.answer;
	if (ans.kind !== 'choice' || ans.options.length !== 4) v.push('servono quattro opzioni');
	else {
		const keys = ans.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== 4) v.push('opzioni ripetute');
		if (keys[ans.correct] !== solKey(sol) || keys.filter((k) => k === solKey(sol)).length !== 1) v.push("l'opzione giusta non è la soluzione");
		const vf = versoFlip(sol);
		if (vf && !keys.includes(solKey(vf))) v.push('manca il distrattore del verso sbagliato');
		if (sol.t !== 'I' && !keys.includes(sol.t === 'R' ? 'E' : 'R')) v.push("manca l'altro caso tra R e vuoto");
	}
	const { A, B } = normalForm(lhs, rhs);
	const endpoint = sol.t === 'I' ? (sol.lo ?? sol.hi)! : null;
	const hasX = (s: Term[]) => s.some((t) => t.a !== 0);
	const hasParen = [...lhs, ...rhs].some((t) => t.k !== 1 && t.d === 1);
	const dens = new Set([...lhs, ...rhs].map((t) => t.d).filter((d) => d > 1));
	const intIn = (r: Rational | null) => !!r && r.isInteger() && Math.abs(r.num) <= 10;
	switch (sample.level) {
		case 2:
			if (hasX(rhs) || lhs.length !== 2 || hasParen || dens.size) v.push('forma diversa da ax + b ⋈ c');
			if (A.sign() <= 0 || A.isOne()) v.push('coefficiente positivo e diverso da 1');
			if (!intIn(endpoint)) v.push('estremo non intero o fuori intervallo');
			break;
		case 3:
			if (hasX(rhs) || hasParen || dens.size) v.push('forma diversa da ax + b ⋈ c');
			if (A.isZero() || (A.sign() > 0 && B.sign() >= 0)) v.push('serve un coefficiente negativo, o positivo con secondo membro negativo');
			if (!intIn(endpoint)) v.push('estremo non intero o fuori intervallo');
			break;
		case 4:
			if (!hasParen || dens.size || !hasX(lhs) || !hasX(rhs)) v.push('servono parentesi e la x nei due membri, senza denominatori');
			if (!intIn(endpoint)) v.push('estremo non intero o fuori intervallo');
			break;
		case 5:
			if (dens.size < 2 || [...dens].some((d) => d > 6)) v.push('servono almeno due denominatori diversi, fino a 6');
			if (!endpoint || endpoint.den > 5 || Math.abs(endpoint.num) > 60) v.push('estremo p/q con q fino a 5');
			break;
		case 6:
			if (sample.params.kind === 'determinata' ? A.isZero() : !A.isZero()) v.push('caso diverso da params.kind');
			if (sample.params.kind === 'sempre' && sol.t !== 'R') v.push('doveva essere sempre verificata');
			if (sample.params.kind === 'impossibile' && sol.t !== 'E') v.push('doveva essere impossibile');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.level <= 5 && sol.t !== 'I') v.push('serve un intervallo');
	return v;
}

function checkIntervals(sample: Sample): string[] {
	const v: string[] = [];
	const ans = sample.answer;
	if (ans.kind !== 'choice' || ans.options.length !== 4) return ['servono quattro opzioni'];
	const keys = ans.options.map((o) => o.values.join('|'));
	const truth = (sample.params.set as string[]).join('|');
	if (new Set(keys).size !== 4) v.push('opzioni ripetute');
	if (keys[ans.correct] !== truth) v.push("l'opzione giusta non è quella dei params");
	return v;
}

function check(sample: Sample): string[] {
	if (sample.level === 1) return checkIntervals(sample);
	if (sample.level === 7) return checkProblem(sample);
	return checkEquation(sample);
}

// ---------------------------------------------------------------------------
// Level 7: word problems. The question asks for a whole number (the most items, the fewest weeks, the
// lowest mark); the inequality gives an interval and the context keeps the natural numbers in it.

const NAMES_F = ['Giulia', 'Sara', 'Chiara', 'Marta', 'Anna', 'Elena', 'Sofia', 'Laura', 'Alice', 'Irene'];
const NAMES_M = ['Luca', 'Marco', 'Paolo', 'Pietro', 'Davide', 'Matteo', 'Tommaso', 'Giorgio', 'Lorenzo', 'Nicola'];

export const STORIES = ['spesa', 'voto', 'tariffe', 'conviene', 'risparmio'] as const;
type Story = (typeof STORIES)[number];

interface Problem {
	story: Story;
	data: Record<string, string | number>;
	prose: string;
	steps: string[];
	answer: number;
	solution: string;
	mistakes: number[];
}

const t = (s: string) => `\\text{${s}}`;
const kx = (k: number) => (k === 1 ? 'x' : `${k}x`);
const frac = (n: number, d: number) => q(n, d).toLatex();
const floorDiv = (n: number, d: number) => Math.floor(n / d);
const ceilDiv = (n: number, d: number) => Math.ceil(n / d);

interface SpesaCtx {
	prose: (B: number, Z: number, p: number, name: string) => string;
	unknown: string;
	unit: string;
	B: [number, number];
	Z: [number, number];
	p: [number, number];
}
const SPESA_CTX: SpesaCtx[] = [
	{
		prose: (B, Z, p, name) => `${name} ha ${B} euro. Compra uno zaino da ${Z} euro e con quello che resta vuole comprare dei quaderni da ${p} euro l'uno. Quanti quaderni può comprare al massimo?`,
		unknown: 'il numero dei quaderni',
		unit: 'quaderni',
		B: [30, 60],
		Z: [8, 25],
		p: [2, 6],
	},
	{
		prose: (B, Z, p) => `Un ascensore porta al massimo ${B} kg. Un fattorino che pesa ${Z} kg vuole caricare dei pacchi da ${p} kg l'uno. Quanti pacchi può portare al massimo in un viaggio?`,
		unknown: 'il numero dei pacchi',
		unit: 'pacchi',
		B: [300, 600],
		Z: [60, 95],
		p: [15, 40],
	},
];

function spesa(rng: Rng): Problem | null {
	const ci = rng.int(0, SPESA_CTX.length - 1);
	const ctx = SPESA_CTX[ci];
	const B = rng.int(ctx.B[0], ctx.B[1]), Z = rng.int(ctx.Z[0], ctx.Z[1]), p = rng.int(ctx.p[0], ctx.p[1]);
	const n = floorDiv(B - Z, p);
	if (n < 2 || n > 30) return null;
	const name = rng.pick(rng.int(0, 1) ? NAMES_F : NAMES_M);
	const exact = (B - Z) % p === 0;
	return {
		story: 'spesa',
		data: { context: ci, name, B, Z, p },
		prose: ctx.prose(B, Z, p, name),
		steps: [
			`${t('Chiama ')} x ${t(` ${ctx.unknown}. Il totale non deve superare ${B}: `)} ${Z} + ${kx(p)} \\le ${B}`,
			`${t('Porta ')} ${Z} ${t(' a secondo membro: ')} ${kx(p)} \\le ${B - Z}`,
			`${t('Dividi per ')} ${p}${t(', che è positivo: ')} x \\le ${frac(B - Z, p)}`,
			exact ? `${t(`Il numero più grande che va bene è ${n}`)}` : `x ${t(' è un numero naturale: il più grande che non supera ')} ${frac(B - Z, p)} ${t(` è ${n}`)}`,
		],
		answer: n,
		solution: t(`Al massimo ${n} ${ctx.unit}`),
		// rounded up; the fixed part forgotten; the fixed part carried across without changing sign; one fewer
		mistakes: [exact ? n - 1 : n + 1, floorDiv(B, p), floorDiv(B + Z, p), n - 1, n + 1],
	};
}

function voto(rng: Rng): Problem | null {
	const n = rng.pick([2, 3]);
	const m = rng.pick([6, 6, 7]);
	const k = rng.int(Math.max(4, m - 2), 10);
	const grades = Array.from({ length: n - 1 }, () => rng.int(3, 9));
	const last = m * (n + 1) - k - grades.reduce((s, g) => s + g, 0);
	if (last < 3 || last > 9) return null;
	grades.push(last);
	const sum = grades.reduce((s, g) => s + g, 0);
	const list = n === 2 ? `${grades[0]} e ${grades[1]}` : `${grades[0]}, ${grades[1]} e ${grades[2]}`;
	const words = n === 2 ? 'due' : 'tre';
	return {
		story: 'voto',
		data: { grades: grades.join(','), m },
		prose: `Nei primi ${words} compiti di matematica hai preso ${list}. Che voto devi prendere nel prossimo compito per avere la media almeno ${m}? Scegli il voto più basso che basta.`,
		steps: [
			`${t('Chiama ')} x ${t(` il voto del prossimo compito. La media dei ${n + 1} voti deve essere almeno ${m}: `)} \\frac{${grades.join(' + ')} + x}{${n + 1}} \\ge ${m}`,
			`${t('Moltiplica per ')} ${n + 1}${t(', che è positivo: ')} ${sum} + x \\ge ${m * (n + 1)}`,
			`${t('Porta ')} ${sum} ${t(' a secondo membro: ')} x \\ge ${k}`,
			`${t(`Serve almeno ${k}`)}${k === 10 ? t(', e più di 10 non si può prendere') : ''}`,
		],
		answer: k,
		solution: t(`Almeno ${k}`),
		// "more than" instead of "at least"; the target itself; divided by n instead of n + 1; one less
		mistakes: [k + 1, m, m * n - sum, k - 1],
	};
}

interface TariffeCtx {
	prose: (F: number, f: number, r: number) => string;
	unit: string;
	pay: string;
}
const TARIFFE_CTX: TariffeCtx[] = [
	{
		prose: (F, f, r) => `Una piscina offre due tariffe mensili: la tariffa A costa ${F} euro con ingressi liberi, la tariffa B costa ${f} euro più ${r} euro per ogni ingresso. Per quanti ingressi al mese, al massimo, la tariffa B costa meno della A?`,
		unit: 'ingressi',
		pay: 'Con la tariffa B spendi ',
	},
	{
		prose: (F, f, r) => `Un cinema vende un abbonamento da ${F} euro al mese per vedere tutti i film che vuoi. Senza abbonamento paghi una tessera da ${f} euro al mese e ${r} euro per ogni film. Quanti film al mese puoi vedere, al massimo, spendendo meno che con l'abbonamento?`,
		unit: 'film',
		pay: 'Senza abbonamento spendi ',
	},
];

function tariffe(rng: Rng): Problem | null {
	const ci = rng.int(0, TARIFFE_CTX.length - 1);
	const ctx = TARIFFE_CTX[ci];
	const r = rng.int(2, 7), f = rng.int(5, 20), n = rng.int(3, 12);
	// exact: the two rates are equal at n + 1, as in the lesson; otherwise F falls between two counts
	const exact = rng.next() < 0.5;
	const F = f + r * (n + 1) - (exact ? 0 : rng.int(1, r - 1));
	if (F > 100) return null;
	const gap = F - f;
	return {
		story: 'tariffe',
		data: { context: ci, F, f, r },
		prose: ctx.prose(F, f, r),
		steps: [
			`${t(`Chiama `)} x ${t(` il numero di ${ctx.unit}. ${ctx.pay}`)} ${f} + ${kx(r)} ${t(' euro, e deve essere meno di ')} ${F}\\text{: } ${f} + ${kx(r)} < ${F}`,
			`${t('Porta ')} ${f} ${t(' a secondo membro: ')} ${kx(r)} < ${gap}`,
			`${t('Dividi per ')} ${r}${t(', che è positivo: ')} x < ${frac(gap, r)}`,
			exact
				? `${t(`Con ${n + 1} ${ctx.unit} le due tariffe costano uguale, e il segno è stretto: il numero naturale più grande minore di ${n + 1} è ${n}`)}`
				: `x ${t(' è un numero naturale: il più grande minore di ')} ${frac(gap, r)} ${t(` è ${n}`)}`,
		],
		answer: n,
		solution: t(`Al massimo ${n} ${ctx.unit}`),
		// the break-even count taken as a solution; the fixed part forgotten; the fixed part added; one fewer
		mistakes: [n + 1, floorDiv(F, r), floorDiv(F + f, r), n - 1],
	};
}

function conviene(rng: Rng): Problem | null {
	const r2 = rng.int(1, 4), d = rng.int(1, 3), r1 = r2 + d;
	const f1 = rng.int(2, 10);
	const exact = rng.next() < 0.5;
	const lim = rng.int(2, 12);
	const f2 = f1 + d * lim + (exact ? 0 : rng.int(1, Math.max(1, d - 1)));
	if (!exact && d === 1) return null;
	if (f2 > 60) return null;
	const gap = f2 - f1;
	const n = floorDiv(gap, d) + 1;
	return {
		story: 'conviene',
		data: { f1, r1, f2, r2 },
		prose: `Per noleggiare una bicicletta un negozio chiede ${f1} euro fissi più ${r1} euro all'ora, un altro ${f2} euro fissi più ${r2} euro all'ora. Qual è il numero minimo di ore intere di noleggio per cui il secondo negozio costa meno del primo?`,
		steps: [
			`${t('Chiama ')} x ${t(' il numero di ore. Il secondo negozio deve costare meno del primo: ')} ${f2} + ${kx(r2)} < ${f1} + ${kx(r1)}`,
			`${t('Porta i termini con la ')} x ${t(' a primo membro e i numeri a secondo membro: ')} ${kx(r2)} - ${kx(r1)} < ${f1} - ${f2}`,
			`${t('Riduci: ')} ${d === 1 ? '-x' : `-${d}x`} < ${-gap}`,
			d === 1
				? `${t('Moltiplica per ')} -1 ${t(' e cambia il verso: ')} x > ${gap}`
				: `${t('Dividi per ')} (-${d})${t(', che è negativo, e cambia il verso: ')} x > ${frac(gap, d)}`,
			exact ? `${t(`Con ${lim} ore i due negozi costano uguale: il primo numero intero maggiore di ${lim} è ${n}`)}` : `${t('Il primo numero intero maggiore di ')} ${frac(gap, d)} ${t(` è ${n}`)}`,
		],
		answer: n,
		solution: t(`Da ${n} ore in su`),
		// the break-even (or the integer part); the sign kept when dividing by a negative number reads as "fino a"; one more
		mistakes: [n - 1, floorDiv(gap, r1), n + 1, ceilDiv(f2 + f1, d)],
	};
}

function risparmio(rng: Rng): Problem | null {
	const A = rng.int(0, 12) * 5, r = rng.int(3, 15), n = rng.int(3, 20);
	const exact = rng.next() < 0.5;
	const target = A + r * n - (exact ? 0 : rng.int(1, r - 1));
	if (target > 300 || target <= A) return null;
	const P = rng.pick(rng.int(0, 1) ? NAMES_F : NAMES_M);
	const gap = target - A;
	const first = A === 0 ? `${P} non ha risparmi e ogni settimana mette da parte ${r} euro.` : `${P} ha ${A} euro nel salvadanaio e ogni settimana ne aggiunge ${r}.`;
	const lhs = A === 0 ? kx(r) : `${A} + ${kx(r)}`;
	const stepsList = [`${t('Chiama ')} x ${t(' il numero di settimane. La somma deve essere almeno ')} ${target}\\text{: } ${lhs} \\ge ${target}`];
	if (A !== 0) stepsList.push(`${t('Porta ')} ${A} ${t(' a secondo membro: ')} ${kx(r)} \\ge ${gap}`);
	stepsList.push(`${t('Dividi per ')} ${r}${t(', che è positivo: ')} x \\ge ${frac(gap, r)}`);
	stepsList.push(exact ? t(`Servono almeno ${n} settimane`) : `${t('Il primo numero intero che non è minore di ')} ${frac(gap, r)} ${t(` è ${n}`)}`);
	return {
		story: 'risparmio',
		data: { name: P, A, r, target },
		prose: `${first} Dopo quante settimane avrà per la prima volta almeno ${target} euro?`,
		steps: stepsList,
		answer: n,
		solution: t(`Dopo ${n} settimane`),
		// rounded down; the savings already there forgotten; the savings added; one more
		mistakes: [exact ? n + 1 : n - 1, ceilDiv(target, r), ceilDiv(target + A, r), n + 1, n - 1],
	};
}

const BUILDERS: Record<Story, (rng: Rng) => Problem | null> = { spesa, voto, tariffe, conviene, risparmio };

/** Recomputes the answer from the data of the story, counting whole numbers as the text says. */
function problemTruth(p: Record<string, unknown>): number | null {
	const n = (k: string) => Number(p[k]);
	const ok = (f: (x: number) => boolean, from = 0, to = 1000) => {
		const xs: number[] = [];
		for (let x = from; x <= to; x++) if (f(x)) xs.push(x);
		return xs;
	};
	switch (p.story) {
		case 'spesa': {
			const xs = ok((x) => n('Z') + n('p') * x <= n('B'));
			return xs.length ? Math.max(...xs) : null;
		}
		case 'voto': {
			const g = String(p.grades).split(',').map(Number);
			const xs = ok((x) => (g.reduce((s, v) => s + v, 0) + x) / (g.length + 1) >= n('m'), 0, 10);
			return xs.length ? Math.min(...xs) : null;
		}
		case 'tariffe': {
			const xs = ok((x) => n('f') + n('r') * x < n('F'));
			return xs.length ? Math.max(...xs) : null;
		}
		case 'conviene': {
			const xs = ok((x) => n('f2') + n('r2') * x < n('f1') + n('r1') * x);
			return xs.length ? Math.min(...xs) : null;
		}
		case 'risparmio': {
			const xs = ok((x) => n('A') + n('r') * x >= n('target'));
			return xs.length ? Math.min(...xs) : null;
		}
		default:
			return null;
	}
}

function generateProblem(rng: Rng): Sample {
	// The story comes from the seed (seed mod 5), and only its own draws are retried: over consecutive seeds
	// the five stories come out exactly evenly. A draw of rng.pick on the first output of consecutive seeds
	// is uneven (154 of 1000 for one story from seed 424242).
	const story = STORIES[((rng.seed % STORIES.length) + STORIES.length) % STORIES.length];
	for (let attempt = 0; attempt < 1000; attempt++) {
		const p = BUILDERS[story](rng);
		if (!p) continue;
		const sample: Sample = {
			generatorId: ID,
			level: 7,
			seed: rng.seed,
			prompt: 'Risolvi il problema con una disequazione.',
			problem: textBlock(p.prose),
			solution: p.solution,
			steps: p.steps,
			answer: { kind: 'number', value: String(p.answer) },
			params: {
				story: p.story,
				...Object.fromEntries(Object.entries(p.data).map(([k, v]) => [k, String(v)])),
				mistakes: p.mistakes.filter((m) => Number.isInteger(m) && m > 0 && m !== p.answer).map(String),
			},
		};
		if (checkProblem(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid word problem, seed ${rng.seed}`);
}

function checkProblem(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	if (!STORIES.includes(p.story as Story)) return [`storia sconosciuta ${String(p.story)}`];
	const truth = problemTruth(p);
	if (truth === null || truth <= 0) return ['il problema non ha una risposta intera positiva'];
	const ans = sample.answer;
	if (ans.kind !== 'number' || ans.value !== String(truth)) v.push('risposta diversa da quella del problema');
	if (!sample.problem.includes('\\text{')) v.push('testo mancante');
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	return v;
}

// ---------------------------------------------------------------------------

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const value = Number((sample.answer as { value: string }).value);
	const mistakes = ((sample.params.mistakes as string[]) ?? []).map(Number).filter((m) => m > 0);
	for (let d = 1; d < 40; d++) mistakes.push(value + d, ...(value - d > 0 ? [value - d] : []));
	return numberChoice(rng, value, mistakes);
}

export const disequazioniPrimoGrado: Generator = {
	id: ID,
	title: 'Disequazioni di primo grado e intervalli',
	levels: {
		1: { label: 'Intervalli', constraints: ['dalla disuguaglianza all\'intervallo e viceversa, limitati e illimitati', 'estremi interi tra -10 e 10'] },
		2: { label: 'Coefficiente positivo', constraints: ['ax + b ⋈ c con a da 2 a 9', 'estremo intero tra -10 e 10'] },
		3: { label: 'Coefficiente negativo', constraints: ['7 su 10 con a negativo (il verso cambia), 3 su 10 con a positivo e secondo membro negativo', 'estremo intero tra -10 e 10'] },
		4: { label: 'Parentesi e incognita nei due membri', constraints: ['almeno un termine k(ax + b), la x nei due membri', 'estremo intero tra -10 e 10'] },
		5: { label: 'Con i denominatori', constraints: ['termini (ax + b)/d con d da 2 a 6, almeno due denominatori diversi', 'estremo intero o p/q con q fino a 5'] },
		6: { label: 'Sempre verificate e impossibili', constraints: ['circa 4 su 10 sempre verificate, 4 su 10 impossibili, 2 su 10 con un intervallo', 'un terzo dei casi con a = 0 ha b = 0'] },
		7: { label: 'Problemi', constraints: ['cinque storie: al massimo, almeno, conviene', 'risposta intera e positiva, letta nel contesto'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (level === 1) return level1(rng);
		if (level === 7) return generateProblem(rng);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample = assembleSample(b, level, rng);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default disequazioniPrimoGrado;
