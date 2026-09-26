/**
 * Sistemi di disequazioni. Spec: specs/exercises/sistemi-di-disequazioni.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/53-sistemi-di-disequazioni.md): two
 * inequalities already solved or one step away, two to solve with a change of direction, three with one
 * with numeric denominators, the limit cases (impossible, one point, a point excluded), a row always true
 * or never true, a double inequality with x only in the middle, a double inequality with x in two members.
 *
 * Built backwards: the solution of every row (a ray x > e, x ≤ e, or "always"/"never") is chosen first, then
 * the row is written so that it solves to it (the constant on the other side is the "hole"). The answer is an
 * interval, a point or ∅ in the lesson's notation, and no answer type holds an interval: every level is
 * multiple choice from the start, the distractors from the lesson's warnings (union instead of intersection,
 * direction not changed, an endpoint included or excluded wrongly, one row read alone).
 *
 * Reversed brackets are written \mathopen{]} and \mathclose{[}, as lesson 52 does: a bare "]" after "=" sticks
 * to it and makes the next minus a subtraction.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';

export const ID = 'sistemi-di-disequazioni';

// ---------------------------------------------------------------------------
// Rows

type Op = '<' | '>' | '<=' | '>=';
/** k · (a x + b) / den. A monomial has k = 1, den = 1 and one of a, b zero; a group k(ax + b) has |k| ≥ 2. */
interface Term {
	k: number;
	a: number;
	b: number;
	den: number;
}
interface Row {
	lhs: Term[];
	op: Op;
	rhs: Term[];
}
/** A double inequality left op1 mid op2 right, both ops < or ≤. */
interface Double {
	left: Term[];
	op1: Op;
	mid: Term[];
	op2: Op;
	right: Term[];
}

const mono = (c: number, deg: 0 | 1): Term => (deg === 1 ? { k: 1, a: c, b: 0, den: 1 } : { k: 1, a: 0, b: c, den: 1 });
const lin = (a: number, b: number): Term[] => [...(a ? [mono(a, 1)] : []), ...(b ? [mono(b, 0)] : [])];
const linConstFirst = (a: number, b: number): Term[] => [...(b ? [mono(b, 0)] : []), ...(a ? [mono(a, 1)] : [])];

const isFrac = (t: Term) => t.den > 1;
const isGroup = (t: Term) => t.den === 1 && t.k !== 1;

const flipOp = (op: Op): Op => ({ '<': '>', '>': '<', '<=': '>=', '>=': '<=' })[op] as Op;
const OP_TEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' };
const isStrict = (op: Op) => op === '<' || op === '>';
const holds = (l: Rational, op: Op, r: Rational) => {
	const c = l.compare(r);
	return op === '<' ? c < 0 : op === '>' ? c > 0 : op === '<=' ? c <= 0 : c >= 0;
};

/** Coefficient of x and constant of a side. */
function sideAB(ts: Term[]): { A: Rational; B: Rational } {
	let A = q(0), B = q(0);
	for (const t of ts) {
		A = A.add(q(t.k * t.a, t.den));
		B = B.add(q(t.k * t.b, t.den));
	}
	return { A, B };
}
const mcmOf = (r: Row) => [...r.lhs, ...r.rhs].reduce((m, t) => lcm(m, t.den), 1);

/** What a row says once solved. `A x op B` is its normal form, multiplied by the MCM of its denominators. */
type RowSol =
	| { kind: 'always' | 'never'; A: Rational; B: Rational }
	| { kind: 'ray'; dir: '>' | '<'; e: number; closed: boolean; A: Rational; B: Rational };

function solveRow(r: Row): RowSol | null {
	const M = mcmOf(r);
	const l = sideAB(r.lhs), rr = sideAB(r.rhs);
	const A = l.A.sub(rr.A).mul(q(M)), B = rr.B.sub(l.B).mul(q(M));
	if (A.isZero()) return { kind: holds(q(0), r.op, B) ? 'always' : 'never', A, B };
	const e = B.div(A);
	if (!e.isInteger()) return null;
	const op = A.sign() < 0 ? flipOp(r.op) : r.op;
	return { kind: 'ray', dir: op === '>' || op === '>=' ? '>' : '<', e: e.num, closed: !isStrict(op), A, B };
}

// ---------------------------------------------------------------------------
// Sets of reals: sorted disjoint intervals with integer (or infinite) endpoints

interface Iv {
	lo: number;
	loC: boolean;
	hi: number;
	hiC: boolean;
}
type RSet = Iv[];
const INF = Infinity;
const R_ALL: RSet = [{ lo: -INF, loC: false, hi: INF, hiC: false }];
const ivEmpty = (i: Iv) => i.lo > i.hi || (i.lo === i.hi && !(i.loC && i.hiC));

function normalize(ivs: Iv[]): RSet {
	const xs = ivs.filter((i) => !ivEmpty(i)).sort((a, b) => a.lo - b.lo || Number(b.loC) - Number(a.loC));
	const out: Iv[] = [];
	for (const n of xs) {
		const cur = out.at(-1);
		if (cur && (n.lo < cur.hi || (n.lo === cur.hi && (n.loC || cur.hiC)))) {
			if (n.hi > cur.hi) {
				cur.hi = n.hi;
				cur.hiC = n.hiC;
			} else if (n.hi === cur.hi) cur.hiC = cur.hiC || n.hiC;
		} else out.push({ ...n });
	}
	return out;
}
function meetIv(a: Iv, b: Iv): Iv {
	const lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
	const loC = a.lo === b.lo ? a.loC && b.loC : a.lo > b.lo ? a.loC : b.loC;
	const hiC = a.hi === b.hi ? a.hiC && b.hiC : a.hi < b.hi ? a.hiC : b.hiC;
	return { lo, loC, hi, hiC };
}
const meet = (s: RSet, t: RSet): RSet => normalize(s.flatMap((a) => t.map((b) => meetIv(a, b))));
const join = (s: RSet, t: RSet): RSet => normalize([...s, ...t]);
const meetAll = (xs: RSet[]) => xs.reduce(meet, R_ALL);
const joinAll = (xs: RSet[]) => xs.reduce(join, []);

function raySet(dir: '>' | '<', e: number, closed: boolean): RSet {
	return dir === '>' ? [{ lo: e, loC: closed, hi: INF, hiC: false }] : [{ lo: -INF, loC: false, hi: e, hiC: closed }];
}
function solSet(s: RowSol): RSet {
	if (s.kind !== 'ray') return s.kind === 'always' ? R_ALL : [];
	return raySet(s.dir, s.e, s.closed);
}

const endTex = (v: number) => (v === INF ? '+\\infty' : v === -INF ? '-\\infty' : `${v}`);
function ivTex(i: Iv): string {
	if (i.lo === i.hi) return `\\{${i.lo}\\}`;
	return `${i.loC ? '[' : '\\mathopen{]}'}${endTex(i.lo)}, ${endTex(i.hi)}${i.hiC ? ']' : '\\mathclose{[}'}`;
}
function setTex(s: RSet): string {
	if (s.length === 0) return '\\emptyset';
	if (s.length === 1 && s[0].lo === -INF && s[0].hi === INF) return '\\mathbb{R}';
	return s.map(ivTex).join(' \\cup ');
}
const endKey = (v: number) => (v === INF ? '+oo' : v === -INF ? '-oo' : `${v}`);
/** Option value: "]2,5]", "{2}", "]-oo,+oo[", one per interval; ∅ is no value. */
const setValues = (s: RSet): string[] => s.map((i) => (i.lo === i.hi ? `{${i.lo}}` : `${i.loC ? '[' : ']'}${endKey(i.lo)},${endKey(i.hi)}${i.hiC ? ']' : '['}`));
const setKey = (s: RSet) => setValues(s).join('|');

// ---------------------------------------------------------------------------
// LaTeX of the problem

function numTex(a: number, b: number): string {
	const x = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
	if (!b) return x || '0';
	if (!x) return `${b}`;
	return `${x} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
}
function termTex(t: Term): { neg: boolean; body: string } {
	if (isFrac(t)) return { neg: t.k < 0, body: `\\dfrac{${numTex(t.a, t.b)}}{${t.den}}` };
	if (isGroup(t)) return { neg: t.k < 0, body: `${Math.abs(t.k)}(${numTex(t.a, t.b)})` };
	const c = t.a || t.b;
	const body = t.a ? (Math.abs(c) === 1 ? 'x' : `${Math.abs(c)}x`) : `${Math.abs(c)}`;
	return { neg: c < 0, body };
}
function sideTex(ts: Term[]): string {
	if (ts.length === 0) return '0';
	return ts
		.map((t, i) => {
			const { neg, body } = termTex(t);
			return (i === 0 ? (neg ? '-' : '') : neg ? ' - ' : ' + ') + body;
		})
		.join('');
}
const rowTex = (r: Row) => `${sideTex(r.lhs)} ${OP_TEX[r.op]} ${sideTex(r.rhs)}`;
const doubleTex = (d: Double) => `${sideTex(d.left)} ${OP_TEX[d.op1]} ${sideTex(d.mid)} ${OP_TEX[d.op2]} ${sideTex(d.right)}`;
/** A row with a fraction is followed by \\[2mm], as in the lesson, so the tall fractions do not touch. */
function casesTex(rows: Row[]): string {
	const body = rows.map((r, i) => rowTex(r) + (i < rows.length - 1 ? (rows[i].lhs.concat(rows[i].rhs).some(isFrac) ? ' \\\\[2mm] ' : ' \\\\ ') : '')).join('');
	return `\\begin{cases} ${body} \\end{cases}`;
}
const doubleRows = (d: Double): Row[] => [
	{ lhs: d.left, op: d.op1, rhs: d.mid },
	{ lhs: d.mid, op: d.op2, rhs: d.right },
];

// ---------------------------------------------------------------------------
// Steps

const ORD = ['Prima', 'Seconda', 'Terza'];
const coefX = (A: Rational) => (A.isOne() ? 'x' : A.equals(q(-1)) ? '-x' : `${A.toLatex()}x`);

/** A sequence of monomials, not reduced: "2x + 2 - x + 1". */
function monoSeq(items: { c: Rational; d: number }[]): string {
	const nz = items.filter((m) => !m.c.isZero());
	if (nz.length === 0) return '0';
	return nz
		.map((m, i) => {
			const abs = m.c.abs();
			const body = m.d ? (abs.isOne() ? 'x' : `${abs.toLatex()}x`) : abs.toLatex();
			return (i === 0 ? (m.c.sign() < 0 ? '-' : '') : m.c.sign() < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}
function expandedItems(ts: Term[], M: number): { c: Rational; d: number }[] {
	return ts.flatMap((t) => [
		{ c: q(t.k * t.a * M, t.den), d: 1 },
		{ c: q(t.k * t.b * M, t.den), d: 0 },
	]);
}
/** A term multiplied by the MCM, not expanded: 3(x - 1), -2x, 6. */
function productTerm(t: Term, M: number): { neg: boolean; body: string } {
	const f = (t.k * M) / t.den;
	if (t.a && t.b) {
		if (Math.abs(f) === 1) return { neg: f < 0, body: f < 0 ? `(${numTex(t.a, t.b)})` : numTex(t.a, t.b) };
		return { neg: f < 0, body: `${Math.abs(f)}(${numTex(t.a, t.b)})` };
	}
	return termTex(mono(f * (t.a || t.b), t.a ? 1 : 0));
}
function productSide(ts: Term[], M: number): string {
	return ts
		.map((t, i) => {
			const { neg, body } = productTerm(t, M);
			if (i === 0) return (neg ? '-' : '') + body;
			return (neg ? ' - ' : ' + ') + body;
		})
		.join('');
}

function rowSteps(r: Row, s: RowSol, name: string): string[] {
	const out: string[] = [];
	const M = mcmOf(r);
	const head = `\\text{${name} disequazione: }`;
	const orig = rowTex(r);
	// the last line the student has already seen: the row itself, or the row multiplied by the MCM
	let seen = orig;
	if (M > 1) {
		seen = `${productSide(r.lhs, M)} ${OP_TEX[r.op]} ${productSide(r.rhs, M)}`;
		out.push(`${head} \\text{il MCM dei denominatori è } ${M}\\text{; moltiplica ogni termine per } ${M}\\text{: } ${seen}`);
	}
	const pre = M > 1 ? '\\text{quindi }' : head;
	const expanded = `${monoSeq(expandedItems(r.lhs, M))} ${OP_TEX[r.op]} ${monoSeq(expandedItems(r.rhs, M))}`;
	const normal = `${coefX(s.A)} ${OP_TEX[r.op]} ${s.B.toLatex()}`;
	const chain: string[] = [];
	const add = (c: string) => {
		if (c !== (chain.at(-1) ?? seen)) chain.push(c);
	};
	add(expanded);
	if (s.kind !== 'ray') {
		// the normal form 0x op B is always shown: it is what says "always" or "never"
		if (chain.at(-1) !== normal) chain.push(normal);
		const why = s.kind === 'always' ? '\\text{: è vera per ogni numero reale}' : '\\text{: non è vera per nessun numero}';
		out.push(`${pre} ${chain.join(' \\;\\Rightarrow\\; ')}${why}`);
		return out;
	}
	const final = `x ${OP_TEX[s.dir === '>' ? (s.closed ? '>=' : '>') : s.closed ? '<=' : '<']} ${s.e}`;
	// with a change of direction the line before the division stays, even when it is the row as written
	if (s.A.sign() < 0 && chain.length === 0 && normal === seen) chain.push(normal);
	else add(normal);
	add(final);
	if (chain.length === 0) return [`${head} ${orig} \\text{ è già risolta}`];
	const flip = s.A.sign() < 0 ? `\\text{ (dividi per } ${s.A.toLatex()} \\text{ e cambia il verso)}` : '';
	out.push(`${pre} ${chain.join(' \\;\\Rightarrow\\; ')}${flip}`);
	return out;
}

/** The lines after the rows: which strip is common, the endpoints, S. */
function meetSteps(sols: RowSol[], S: RSet): string[] {
	const out: string[] = [];
	const never = sols.findIndex((s) => s.kind === 'never');
	if (never >= 0) {
		out.push(`\\text{La ${ORD[never].toLowerCase()} disequazione non è vera per nessun numero, quindi il sistema è impossibile}`);
		return [...out, 'S = \\emptyset'];
	}
	const always = sols.findIndex((s) => s.kind === 'always');
	if (always >= 0) out.push(`\\text{La ${ORD[always].toLowerCase()} disequazione è vera per ogni numero e non toglie niente}`);
	const rays = sols.filter((s): s is Extract<RowSol, { kind: 'ray' }> => s.kind === 'ray');
	if (S.length === 0) {
		const touch = rays.some((a) => rays.some((b) => a.e === b.e && a.dir !== b.dir));
		if (touch) out.push(`\\text{Le linee si toccano solo in } ${rays.find((a) => rays.some((b) => a.e === b.e && a.dir !== b.dir))!.e}\\text{, che è escluso in almeno una: il sistema è impossibile}`);
		else out.push(`\\text{Nessun numero le rende vere tutte: il sistema è impossibile}`);
		return [...out, 'S = \\emptyset'];
	}
	const iv = S[0];
	if (iv.lo === iv.hi) {
		out.push(`\\text{Le linee si toccano solo in } ${iv.lo}\\text{, compreso in tutte le disequazioni}`);
		return [...out, `S = ${setTex(S)}`];
	}
	for (const [e, c] of [
		[iv.lo, iv.loC],
		[iv.hi, iv.hiC],
	] as [number, boolean][]) {
		if (!Number.isFinite(e)) continue;
		const at = rays.filter((r) => r.e === e);
		if (at.length >= 2 && !c && at.some((r) => r.closed)) out.push(`\\text{Il } ${e} \\text{ è compreso in una disequazione ma escluso in un'altra, quindi è escluso}`);
	}
	const ends = [iv.lo, iv.hi].filter(Number.isFinite);
	if (ends.length === 2) out.push(`\\text{Le linee si sovrappongono tra } ${iv.lo} \\text{ e } ${iv.hi}`);
	else out.push(`\\text{Le linee si sovrappongono ${iv.lo === -INF ? 'a sinistra' : 'a destra'} di } ${ends[0]}`);
	return [...out, `S = ${setTex(S)}`];
}

// ---------------------------------------------------------------------------
// Building rows backwards

function nz(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}
const sgnPick = (rng: Rng) => (rng.int(0, 1) ? 1 : -1);

/** The written operator of a row whose normal form has coefficient sign `sA` and solves to x dir e (closed). */
function writtenOp(dir: '>' | '<', closed: boolean, sA: number): Op {
	const op: Op = dir === '>' ? (closed ? '>=' : '>') : closed ? '<=' : '<';
	return sA < 0 ? flipOp(op) : op;
}
/** Swap the two members: 5 > 2x + 1 instead of 2x + 1 < 5. */
const swapRow = (r: Row): Row => ({ lhs: r.rhs, op: flipOp(r.op), rhs: r.lhs });

interface Target {
	dir: '>' | '<';
	e: number;
	closed: boolean;
}

/** Level 1: x op e, x + c op d, k x op d (k > 0): no change of direction. */
function simpleRow(rng: Rng, t: Target): Row {
	const op = writtenOp(t.dir, t.closed, 1);
	const f = rng.next();
	if (f < 0.35) return { lhs: [mono(1, 1)], op, rhs: t.e ? [mono(t.e, 0)] : [] };
	if (f < 0.7) {
		let c = nz(rng, -9, 9);
		while (Math.abs(t.e + c) > 12) c = nz(rng, -9, 9);
		return { lhs: lin(1, c), op, rhs: t.e + c ? [mono(t.e + c, 0)] : [] };
	}
	const k = rng.int(2, 6);
	return { lhs: [mono(k, 1)], op, rhs: t.e ? [mono(k * t.e, 0)] : [] };
}

/** ax + b op cx + d (or b + ... written with the number first), solving to the target. */
function linearRow(rng: Rng, t: Target, sign?: 1 | -1): Row | null {
	const A = (sign ?? sgnPick(rng)) * rng.int(1, 5);
	const op = writtenOp(t.dir, t.closed, A);
	let row: Row;
	if (rng.next() < 0.45) {
		// a x + b op d
		const b = nz(rng, -9, 9);
		const d = A * t.e + b;
		const lhs = A < 0 && b > 0 && rng.next() < 0.6 ? linConstFirst(A, b) : lin(A, b);
		row = { lhs, op, rhs: d ? [mono(d, 0)] : [] };
		if (!d) return null;
	} else {
		const c = nz(rng, -4, 4);
		const a = A + c;
		if (a === 0 || Math.abs(a) > 6) return null;
		const b = rng.int(-9, 9);
		const d = A * t.e + b;
		if (!b && !d) return null;
		row = { lhs: a < 0 && b > 0 && rng.next() < 0.5 ? linConstFirst(a, b) : lin(a, b), op, rhs: lin(c, d) };
	}
	return rng.next() < 0.2 ? swapRow(row) : row;
}

/** k(x + m) op cx + d, as 2(x + 1) ≥ x - 1 in example 3. */
function groupRow(rng: Rng, t: Target): Row | null {
	const k = rng.pick([2, 2, 3, 3, 4, 5, -2, -3]);
	const m = nz(rng, -6, 6);
	const c = rng.int(-3, 3);
	const A = k - c;
	if (A === 0) return null;
	const d = A * t.e + k * m;
	if (!c && !d) return null;
	return { lhs: [{ k, a: 1, b: m, den: 1 }], op: writtenOp(t.dir, t.closed, A), rhs: lin(c, d) };
}

/** A numerator a x + b over den that does not simplify. */
function fracOk(a: number, b: number, den: number) {
	return a > 0 && gcd(gcd(a, Math.abs(b)), den) === 1;
}

/** Numeric denominators, as the first row of example 3. */
function fracRow(rng: Rng, t: Target): Row | null {
	const [p, qq] = [rng.pick([2, 3, 4, 5, 6]), rng.pick([2, 3, 4, 5, 6])];
	if (p === qq) return null;
	const shape = rng.int(0, 2);
	const a1 = rng.pick([1, 1, 2, 3]), b1 = rng.int(-6, 6);
	if (!fracOk(a1, b1, p)) return null;
	const f1: Term = { k: 1, a: a1, b: b1, den: p };
	const at = (ts: Term[]) => {
		const { A, B } = sideAB(ts);
		return A.mul(q(t.e)).add(B);
	};
	let lhs: Term[], rhs: Term[];
	if (shape === 0) {
		// (a1 x + b1)/p ± (a2 x + b2)/q op r
		const a2 = rng.pick([1, 1, 2]), b2 = rng.int(-5, 5);
		if (!fracOk(a2, b2, qq)) return null;
		lhs = [f1, { k: sgnPick(rng), a: a2, b: b2, den: qq }];
		const r = at(lhs);
		if (!r.isInteger() || Math.abs(r.num) > 9) return null;
		rhs = r.num ? [mono(r.num, 0)] : [];
		if (!r.num) return null;
	} else if (shape === 1) {
		// (a1 x + b1)/p op (a2 x + b2)/q, b2 is the hole
		const a2 = rng.pick([1, 1, 2]);
		const need = at([f1]).mul(q(qq)).sub(q(a2 * t.e));
		if (!need.isInteger() || !need.num || Math.abs(need.num) > 9 || !fracOk(a2, need.num, qq)) return null;
		lhs = [f1];
		rhs = [{ k: 1, a: a2, b: need.num, den: qq }];
	} else {
		// c x ± (a1 x + b1)/p op r, or with the number: x/q + r op ...
		const c = nz(rng, -3, 3);
		lhs = [mono(c, 1), { ...f1, k: sgnPick(rng) }];
		const r = at(lhs);
		if (!r.isInteger() || !r.num || Math.abs(r.num) > 9) return null;
		rhs = [mono(r.num, 0)];
	}
	const { A: Al } = sideAB(lhs), { A: Ar } = sideAB(rhs);
	const A = Al.sub(Ar);
	if (A.isZero()) return null;
	return { lhs, op: writtenOp(t.dir, t.closed, A.sign()), rhs };
}

/** A row that becomes 0x op B: k(x + m) op kx + n, or x + m op x + n. */
function zeroRow(rng: Rng, always: boolean): Row | null {
	const k = rng.pick([1, 2, 2, 3, 4]);
	const m = nz(rng, -6, 6), n = nz(rng, -9, 9);
	const B = n - k * m;
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	if (holds(q(0), op, q(B)) !== always) return null;
	const lhs: Term[] = k === 1 ? lin(1, m) : [{ k, a: 1, b: m, den: 1 }];
	const rhs = lin(k, n);
	return rng.next() < 0.3 ? swapRow({ lhs, op, rhs }) : { lhs, op, rhs };
}

function target(rng: Rng, lo = -9, hi = 9): Target {
	return { dir: rng.int(0, 1) ? '>' : '<', e: rng.int(lo, hi), closed: rng.int(0, 1) === 1 };
}

// ---------------------------------------------------------------------------
// Levels

type Built = { kind: 'system'; rows: Row[]; case: string } | { kind: 'double'; d: Double; case: string };

const setOfRows = (rows: Row[]) => {
	const sols = rows.map(solveRow);
	if (sols.some((s) => !s)) return null;
	return { sols: sols as RowSol[], S: meetAll((sols as RowSol[]).map(solSet)) };
};
const isInterval = (S: RSet) => S.length === 1 && S[0].lo < S[0].hi;

/** Two rays with different endpoints that meet in an interval: half the time with the same direction, half bounded. */
function twoTargets(rng: Rng, lo: number, hi: number): [Target, Target] | null {
	const e1 = rng.int(lo, hi), e2 = rng.int(lo, hi);
	if (e1 === e2) return null;
	const c = () => rng.int(0, 1) === 1;
	if (rng.int(0, 1)) {
		const dir = rng.pick<'>' | '<'>(['>', '<']);
		return [
			{ dir, e: e1, closed: c() },
			{ dir, e: e2, closed: c() },
		];
	}
	const ts: [Target, Target] = [
		{ dir: '>', e: Math.min(e1, e2), closed: c() },
		{ dir: '<', e: Math.max(e1, e2), closed: c() },
	];
	return rng.int(0, 1) ? ts : [ts[1], ts[0]];
}

function level1(rng: Rng): Built | null {
	const ts = twoTargets(rng, -9, 9);
	if (!ts) return null;
	const [t1, t2] = ts;
	const rows = [simpleRow(rng, t1), simpleRow(rng, t2)];
	if (rows.every((r) => r.lhs.length === 1 && r.lhs[0].a === 1 && r.lhs[0].den === 1 && r.lhs[0].k === 1)) {
		if (rng.next() < 0.6) return null; // mostly at least one row with a step
	}
	const res = setOfRows(rows);
	if (!res || !isInterval(res.S)) return null;
	return { kind: 'system', rows, case: t1.dir === t2.dir ? 'stesso verso' : 'versi opposti' };
}

function level2(rng: Rng): Built | null {
	let t1: Target, t2: Target;
	const same = rng.next() < 0.4;
	if (same) {
		const dir = rng.int(0, 1) ? '>' : '<';
		const e = rng.int(-8, 8);
		t1 = { dir, e, closed: true };
		t2 = { dir, e, closed: false };
	} else {
		const ts = twoTargets(rng, -8, 8);
		if (!ts) return null;
		[t1, t2] = ts;
	}
	const neg = rng.int(0, 1);
	const r1 = linearRow(rng, t1, neg ? -1 : undefined), r2 = linearRow(rng, t2, neg ? undefined : -1);
	if (!r1 || !r2) return null;
	const rows = rng.int(0, 1) ? [r1, r2] : [r2, r1];
	const res = setOfRows(rows);
	if (!res || !isInterval(res.S)) return null;
	return { kind: 'system', rows, case: same ? 'stesso estremo' : 'estremi diversi' };
}

function level3(rng: Rng): Built | null {
	const ts = [target(rng, -7, 7), target(rng, -7, 7), target(rng, -7, 7)];
	if (new Set(ts.map((t) => t.e)).size < 3) return null;
	const f = fracRow(rng, ts[0]), g = groupRow(rng, ts[1]), l = linearRow(rng, ts[2]);
	if (!f || !g || !l) return null;
	const order = [f, g, l];
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const res = setOfRows(order);
	if (!res || !isInterval(res.S)) return null;
	return { kind: 'system', rows: order, case: 'tre' };
}

type Case4 = 'impossibile' | 'un punto' | 'punto escluso' | 'intervallo';
function level4(rng: Rng): Built | null {
	const kase = rng.pick<Case4>(['impossibile', 'un punto', 'punto escluso', 'intervallo']);
	const e = rng.int(-7, 7), gap = rng.int(1, 4);
	const c = () => rng.int(0, 1) === 1;
	let t1: Target, t2: Target;
	if (kase === 'impossibile') [t1, t2] = [{ dir: '<', e, closed: c() }, { dir: '>', e: e + gap, closed: c() }];
	else if (kase === 'un punto') [t1, t2] = [{ dir: '>', e, closed: true }, { dir: '<', e, closed: true }];
	else if (kase === 'punto escluso') {
		const which = rng.int(0, 2);
		[t1, t2] = [{ dir: '>', e, closed: which === 1 }, { dir: '<', e, closed: which === 2 }];
	} else [t1, t2] = [{ dir: '>', e, closed: c() }, { dir: '<', e: e + gap, closed: c() }];
	const r1 = linearRow(rng, t1), r2 = linearRow(rng, t2);
	if (!r1 || !r2) return null;
	const rows = rng.int(0, 1) ? [r1, r2] : [r2, r1];
	return setOfRows(rows) ? { kind: 'system', rows, case: kase } : null;
}

function level5(rng: Rng): Built | null {
	const always = rng.int(0, 1) === 1;
	const z = zeroRow(rng, always), l = linearRow(rng, target(rng, -8, 8));
	if (!z || !l) return null;
	const rows = rng.int(0, 1) ? [z, l] : [l, z];
	return setOfRows(rows) ? { kind: 'system', rows, case: always ? 'sempre vera' : 'mai vera' } : null;
}

function level6(rng: Rng): Built | null {
	const neg = rng.int(0, 1) === 1;
	const a = (neg ? -1 : 1) * rng.int(1, 5);
	const b = rng.int(-9, 9);
	const lo = rng.int(-6, 5), hi = lo + rng.int(1, 6);
	if (hi > 7) return null;
	if (a === 1 && b === 0) return null;
	const loC = rng.int(0, 1) === 1, hiC = rng.int(0, 1) === 1;
	// c1 < a x + b < c2 with the solution lo..hi: for a < 0 the left member comes from hi
	const [c1, c2] = a > 0 ? [a * lo + b, a * hi + b] : [a * hi + b, a * lo + b];
	const [cl, cr] = a > 0 ? [loC, hiC] : [hiC, loC];
	if (Math.abs(c1) > 30 || Math.abs(c2) > 30) return null;
	const mid = a < 0 && b > 0 && rng.next() < 0.6 ? linConstFirst(a, b) : lin(a, b);
	const d: Double = { left: c1 ? [mono(c1, 0)] : [], op1: cl ? '<=' : '<', mid, op2: cr ? '<=' : '<', right: c2 ? [mono(c2, 0)] : [] };
	return { kind: 'double', d, case: neg ? 'coefficiente negativo' : 'coefficiente positivo' };
}

function level7(rng: Rng): Built | null {
	const a = nz(rng, -4, 4), b = rng.int(-9, 9);
	const ops = [rng.pick<Op>(['<', '<=']), rng.pick<Op>(['<', '<='])] as const;
	const e1 = rng.int(-7, 7), e2 = rng.int(-7, 7);
	let d: Double;
	if (rng.next() < 0.7) {
		// p x + q op1 a x + b op2 c: row 1 is (p - a) x op1 b - q
		const p = nz(rng, -4, 4, [a]);
		const A1 = p - a;
		const qv = b - A1 * e1, c = a * e2 + b;
		if (Math.abs(qv) > 20 || Math.abs(c) > 30) return null;
		d = { left: lin(p, qv), op1: ops[0], mid: lin(a, b), op2: ops[1], right: c ? [mono(c, 0)] : [] };
	} else {
		// c op1 a x + b op2 p x + q
		const p = nz(rng, -4, 4, [a]);
		const c = b + a * e1, qv = b + (a - p) * e2;
		if (Math.abs(qv) > 20 || Math.abs(c) > 30) return null;
		d = { left: c ? [mono(c, 0)] : [], op1: ops[0], mid: lin(a, b), op2: ops[1], right: lin(p, qv) };
	}
	if (d.left.length === 0 && d.right.length === 0) return null;
	const res = setOfRows(doubleRows(d));
	if (!res || !isInterval(res.S)) return null;
	return { kind: 'double', d, case: d.left.some((t) => t.a) ? 'x a sinistra' : 'x a destra' };
}

const BUILDERS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Distractors

const rowsOf = (b: Built) => (b.kind === 'system' ? b.rows : doubleRows(b.d));

/** The wrong answers the lesson warns about, most important first. */
function mistakes(b: Built, sols: RowSol[], S: RSet): RSet[] {
	const out: RSet[] = [];
	const sets = sols.map(solSet);
	// union instead of intersection
	out.push(joinAll(sets));
	// the direction not changed after dividing by a negative number
	const noflip = sols.map((s) => (s.kind === 'ray' && s.A.sign() < 0 ? raySet(s.dir === '>' ? '<' : '>', s.e, s.closed) : solSet(s)));
	if (sols.some((s) => s.kind === 'ray' && s.A.sign() < 0)) out.push(meetAll(noflip));
	const centerOnly = b.kind === 'double' && !b.d.left.some((t) => t.a) && !b.d.right.some((t) => t.a);
	if (b.kind === 'double' && centerOnly && b.d.mid.some((t) => t.a < 0) && isInterval(S) && Number.isFinite(S[0].lo) && Number.isFinite(S[0].hi)) {
		// three members: only the first sign changed, and the brackets kept where they were
		const iv = S[0];
		out.push(normalize([{ lo: -INF, loC: false, hi: iv.lo, hiC: iv.loC }]));
		out.push(normalize([{ lo: iv.lo, loC: iv.hiC, hi: iv.hi, hiC: iv.loC }]));
	}
	// every endpoint included (the point excluded read as included), and each endpoint of S toggled
	out.push(meetAll(sols.map((s) => (s.kind === 'ray' ? raySet(s.dir, s.e, true) : solSet(s)))));
	// a single point read as excluded: the system taken for impossible
	if (S.length === 1 && S[0].lo === S[0].hi) out.push([]);
	for (const iv of S) {
		if (Number.isFinite(iv.lo) && iv.lo !== iv.hi) out.push(normalize([{ ...iv, loC: !iv.loC }]));
		if (Number.isFinite(iv.hi) && iv.lo !== iv.hi) out.push(normalize([{ ...iv, hiC: !iv.hiC }]));
	}
	// always true read as never true, and the other way round
	if (sols.some((s) => s.kind === 'always')) out.push([]);
	if (sols.some((s) => s.kind === 'never')) out.push(meetAll(sols.filter((s) => s.kind !== 'never').map(solSet)), R_ALL);
	// one row read alone ("guardare solo la prima riga")
	for (const s of sets) out.push(s);
	// impossible written S = {0} (lesson: it would say that 0 is a solution)
	if (S.length === 0) out.push([{ lo: 0, loC: true, hi: 0, hiC: true }]);
	return out;
}

function fillers(S: RSet): RSet[] {
	const out: RSet[] = [];
	for (const iv of S) {
		if (iv.lo === iv.hi) {
			out.push(raySet('>', iv.lo, true), raySet('<', iv.lo, true), []);
			continue;
		}
		out.push(normalize([{ ...iv, loC: Number.isFinite(iv.lo) ? !iv.loC : false, hiC: Number.isFinite(iv.hi) ? !iv.hiC : false }]));
		for (const d of [1, -1, 2, -2]) {
			if (Number.isFinite(iv.lo)) out.push(normalize([{ ...iv, lo: iv.lo + d }]));
			if (Number.isFinite(iv.hi)) out.push(normalize([{ ...iv, hi: iv.hi + d }]));
		}
	}
	out.push(R_ALL, []);
	return out;
}

function buildChoice(b: Built, sols: RowSol[], S: RSet, rng: Rng): ChoiceAnswer {
	const opts: RSet[] = [S];
	const seen = new Set([setKey(S)]);
	for (const c of [...mistakes(b, sols, S), ...fillers(S)]) {
		if (opts.length >= 4) break;
		// no option wider than a union of two pieces, and never a point written as an interval
		if (c.length > 2 || seen.has(setKey(c))) continue;
		seen.add(setKey(c));
		opts.push(c);
	}
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: `S = ${setTex(opts[i])}`, values: setValues(opts[i]) }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Sample

const termJSON = (t: Term) => ({ k: t.k, a: t.a, b: t.b, den: t.den });
const rowJSON = (r: Row) => ({ lhs: r.lhs.map(termJSON), op: r.op, rhs: r.rhs.map(termJSON) });

function doubleSteps(d: Double, sols: RowSol[], S: RSet): string[] {
	const centerOnly = !d.left.some((t) => t.a) && !d.right.some((t) => t.a);
	if (!centerOnly) {
		const rows = doubleRows(d);
		return [
			`\\text{La } x \\text{ è in due membri: risolvi il sistema di } ${rowTex(rows[0])} \\text{ e } ${rowTex(rows[1])}`,
			...rows.flatMap((r, i) => rowSteps(r, sols[i], ORD[i])),
			...meetSteps(sols, S),
		];
	}
	// three members, as example 7
	const { A, B } = sideAB(d.mid);
	const c1 = sideAB(d.left).B, c2 = sideAB(d.right).B;
	const out: string[] = [];
	let l = c1, r = c2;
	if (!B.isZero()) {
		l = c1.sub(B);
		r = c2.sub(B);
		const verb = B.sign() > 0 ? `\\text{Sottrai } ${B.toLatex()}` : `\\text{Aggiungi } ${B.neg().toLatex()}`;
		out.push(`${verb} \\text{ a tutti e tre i membri: } ${l.toLatex()} ${OP_TEX[d.op1]} ${coefX(A)} ${OP_TEX[d.op2]} ${r.toLatex()}`);
	}
	if (A.sign() > 0) {
		if (!A.isOne()) out.push(`\\text{Dividi i tre membri per } ${A.toLatex()}\\text{: } ${l.div(A).toLatex()} ${OP_TEX[d.op1]} x ${OP_TEX[d.op2]} ${r.div(A).toLatex()}`);
	} else {
		const L = l.div(A), Rr = r.div(A);
		out.push(`\\text{Dividi i tre membri per } ${A.toLatex()}\\text{, che è negativo: cambiano tutti e due i versi: } ${L.toLatex()} ${OP_TEX[flipOp(d.op1)]} x ${OP_TEX[flipOp(d.op2)]} ${Rr.toLatex()}`);
		out.push(`\\text{Letta da destra a sinistra: } ${Rr.toLatex()} ${OP_TEX[d.op2]} x ${OP_TEX[d.op1]} ${L.toLatex()}`);
	}
	out.push(`S = ${setTex(S)}`);
	return out;
}

function assemble(b: Built, level: number, rng: Rng): Sample | null {
	const rows = rowsOf(b);
	const res = setOfRows(rows);
	if (!res) return null;
	const { sols, S } = res;
	const steps = b.kind === 'system' ? [...rows.flatMap((r, i) => rowSteps(r, sols[i], ORD[i])), ...meetSteps(sols, S)] : doubleSteps(b.d, sols, S);
	const answer = buildChoice(b, sols, S, rng);
	if (answer.options.length !== 4) return null;
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.kind === 'system' ? "Risolvi il sistema e scegli l'insieme delle soluzioni." : "Risolvi la doppia disequazione e scegli l'insieme delle soluzioni.",
		problem: b.kind === 'system' ? casesTex(b.rows) : doubleTex(b.d),
		solution: S.length === 0 ? `\\text{Sistema impossibile: } S = \\emptyset` : `S = ${setTex(S)}`,
		steps,
		answer,
		params: {
			kind: b.kind,
			rows: rows.map(rowJSON),
			case: b.case,
			solution: setValues(S),
		},
	};
}

// ---------------------------------------------------------------------------
// Checks

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: '1(', re: /(?<![\d.])1\(/ },
];

function rowsFrom(p: Record<string, unknown>): Row[] | null {
	const rows = p.rows as Row[] | undefined;
	if (!Array.isArray(rows)) return null;
	return rows;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const rows = rowsFrom(sample.params);
	if (!rows) return ['params.rows non validi'];
	const res = setOfRows(rows);
	if (!res) return ['una disequazione ha un estremo non intero'];
	const { sols, S } = res;
	const kind = sample.params.kind;
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	for (const r of rows)
		for (const t of [...r.lhs, ...r.rhs]) {
			if (![t.k, t.a, t.b, t.den].every(Number.isInteger)) v.push('valori non interi');
			if (Math.abs(t.k * t.a) > 30 || Math.abs(t.k * t.b) > 30) v.push('coefficiente oltre 30');
			if (isFrac(t) && (Math.abs(t.k) !== 1 || !fracOk(t.a, t.b, t.den))) v.push('frazione scritta male o semplificabile');
			if (isGroup(t) && (Math.abs(t.k) < 2 || !t.a || !t.b)) v.push('parentesi senza due termini');
			if (!isFrac(t) && !isGroup(t) && (t.k !== 1 || (t.a !== 0) === (t.b !== 0))) v.push('monomio scritto male');
		}
	for (const s of sols) if (s.kind === 'ray' && Math.abs(s.e) > 9) v.push('estremo oltre 9');
	const expected = kind === 'system' ? casesTex(rows) : doubleTex({ left: rows[0].lhs, op1: rows[0].op, mid: rows[0].rhs, op2: rows[1].op, right: rows[1].rhs });
	if (sample.problem !== expected) v.push('il testo non corrisponde alle disequazioni dei params');
	const a = sample.answer;
	if (a.kind !== 'choice') v.push('la risposta è a scelta multipla');
	else {
		if (a.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni ripetute');
		if (a.options[a.correct]?.values.join('|') !== setKey(S)) v.push("l'opzione giusta non è la soluzione");
		if (a.options.some((o) => o.latex !== `S = ${setTex(parseValues(o.values))}`)) v.push('testo di un\'opzione diverso dai suoi valori');
		if (a.options.some((o) => parseValues(o.values).some((i) => (i.lo === -INF && i.loC) || (i.hi === INF && i.hiC)))) v.push('infinito con la parentesi chiusa');
	}
	if ((sample.params.solution as string[]).join('|') !== setKey(S)) v.push('params.solution diversa dalla soluzione');
	const rays = sols.filter((s): s is Extract<RowSol, { kind: 'ray' }> => s.kind === 'ray');
	const negA = sols.some((s) => s.A.sign() < 0);
	const fr = (r: Row) => [...r.lhs, ...r.rhs].some(isFrac);
	const gr = (r: Row) => [...r.lhs, ...r.rhs].some(isGroup);
	switch (sample.level) {
		case 1:
			if (rows.length !== 2 || negA || rows.some((r) => fr(r) || gr(r) || r.rhs.some((t) => t.a))) v.push('livello 1: due disequazioni da un passaggio, senza cambio di verso');
			if (!isInterval(S)) v.push('livello 1: la soluzione è un intervallo');
			break;
		case 2:
			if (rows.length !== 2 || !negA || rows.some((r) => fr(r) || gr(r))) v.push('livello 2: due disequazioni, almeno un cambio di verso');
			if (!isInterval(S)) v.push('livello 2: la soluzione è un intervallo');
			break;
		case 3:
			if (rows.length !== 3 || rows.filter(fr).length !== 1 || rows.filter(gr).length !== 1) v.push('livello 3: tre disequazioni, una con i denominatori e una con le parentesi');
			if (!isInterval(S)) v.push('livello 3: la soluzione è un intervallo');
			break;
		case 4: {
			if (rows.length !== 2 || rays.length !== 2) v.push('livello 4: due disequazioni');
			const c = sample.params.case;
			const truth = S.length === 0 ? (rays.length === 2 && rays[0].e === rays[1].e ? 'punto escluso' : 'impossibile') : S[0].lo === S[0].hi ? 'un punto' : 'intervallo';
			if (c !== truth) v.push(`livello 4: caso ${String(c)} ma il sistema è ${truth}`);
			break;
		}
		case 5: {
			const zero = sols.filter((s) => s.kind !== 'ray');
			if (rows.length !== 2 || zero.length !== 1) v.push('livello 5: una disequazione sempre vera o mai vera');
			else if (sample.params.case !== (zero[0].kind === 'always' ? 'sempre vera' : 'mai vera')) v.push('livello 5: caso sbagliato');
			break;
		}
		case 6:
			if (kind !== 'double' || rows[0].lhs.some((t) => t.a) || rows[1].rhs.some((t) => t.a)) v.push('livello 6: doppia disequazione con la x solo al centro');
			if (!isInterval(S) || !Number.isFinite(S[0].lo) || !Number.isFinite(S[0].hi)) v.push('livello 6: la soluzione è un intervallo limitato');
			break;
		case 7:
			if (kind !== 'double' || !(rows[0].lhs.some((t) => t.a) || rows[1].rhs.some((t) => t.a))) v.push('livello 7: doppia disequazione con la x in due membri');
			if (!isInterval(S)) v.push('livello 7: la soluzione è un intervallo');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function parseValues(vals: string[]): RSet {
	return vals.map((s) => {
		const pt = /^\{(-?\d+)\}$/.exec(s);
		if (pt) return { lo: Number(pt[1]), loC: true, hi: Number(pt[1]), hiC: true };
		const m = /^([[\]])(-oo|-?\d+),(\+oo|-?\d+)([[\]])$/.exec(s);
		if (!m) throw new Error(`valore non leggibile ${s}`);
		const num = (t: string) => (t === '-oo' ? -INF : t === '+oo' ? INF : Number(t));
		return { lo: num(m[2]), loC: m[1] === '[', hi: num(m[3]), hiC: m[4] === ']' };
	});
}

function toChoice(sample: Sample): ChoiceAnswer {
	return sample.answer as ChoiceAnswer;
}

const sistemiDiDisequazioni: Generator = {
	id: ID,
	title: 'Sistemi di disequazioni',
	levels: {
		1: { label: 'Disequazioni già risolte o quasi', constraints: ['due righe x op e, x + c op d, kx op d (k > 0)', 'soluzione un intervallo, limitato o no'] },
		2: { label: 'Un cambio di verso', constraints: ['due disequazioni di primo grado, almeno una con il coefficiente negativo', '4 su 10 con lo stesso estremo compreso in una sola'] },
		3: { label: 'Tre disequazioni, una con i denominatori', constraints: ['una riga con denominatori numerici, una con k(x + m), una lineare', 'soluzione un intervallo'] },
		4: { label: 'Impossibile, un punto, punto escluso', constraints: ['un quarto ciascuno: impossibile, un punto, punto escluso, intervallo stretto'] },
		5: { label: 'Una disequazione sempre vera o mai vera', constraints: ['una riga diventa 0x op b', 'metà sempre vera, metà mai vera'] },
		6: { label: 'Doppia disequazione, x al centro', constraints: ['c1 op ax + b op c2', 'metà con il coefficiente negativo'] },
		7: { label: 'Doppia disequazione, x in due membri', constraints: ['px + q op ax + b op c, o c op ax + b op px + q', 'si risolve come sistema'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 20_000; attempt++) {
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

export default sistemiDiDisequazioni;
