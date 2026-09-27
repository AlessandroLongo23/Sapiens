/**
 * Intersezione tra due rette. Spec: specs/exercises/intersezione-tra-due-rette.md
 *
 * Six levels in the order of lesson 84 (docs/lezioni/riscritte/84-intersezione-tra-due-rette.md): the point
 * where two lines in explicit form meet (comparison, integer point); two lines in implicit form, or one
 * parallel to an axis, with a fractional coordinate; incident, parallel or coincident, with traps; a vertex of
 * a triangle given the lines of its sides; the area of a triangle with a side on an axis, or of the triangle a
 * line forms with the axes; three lines through the same point, or the parameter that makes them so.
 *
 * Built backwards: the point (or the vertices, the area, the value of k) is chosen first, then the lines
 * through it. A point is a `choice` answer (no answer type has two fields); an area and the parameter are
 * `number` answers with a multiple-choice variant. The distractors are the mistakes the lesson warns about.
 *
 * Option values: ["P", x, y] a point (the letter is the vertex asked at level 4, P elsewhere); ["x", h] the
 * line x = h, ["y", k] the line y = k (the answer of who stops at the first coordinate); ["incidenti", x, y],
 * ["parallele"], ["coincidenti"] at level 3; ["concorrenti", x, y], ["non concorrenti"] at level 6; [value] for
 * a number.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';

export const ID = 'intersezione-tra-due-rette';

type R = Rational;
type V = 'x' | 'y';
const ZERO = q(0);
const R_ = (s: unknown): R => Rational.parse(String(s));
const other = (v: V): V => (v === 'x' ? 'y' : 'x');

/** a x + b y + c = 0 */
interface Lin {
	a: R;
	b: R;
	c: R;
}
/** How a line is written: implicit (with its own coefficients), explicit y = mx + q, x = h, y = k. */
type Form = 'imp' | 'exp' | 'vert' | 'hor';
interface Shown {
	name: string;
	lin: Lin;
	form: Form;
}
type Pt = [R, R];
type Opt = string[];

const lin = (a: number | R, b: number | R, c: number | R): Lin => ({
	a: typeof a === 'number' ? q(a) : a,
	b: typeof b === 'number' ? q(b) : b,
	c: typeof c === 'number' ? q(c) : c,
});
const scale = (l: Lin, k: R): Lin => ({ a: l.a.mul(k), b: l.b.mul(k), c: l.c.mul(k) });
const coefOf = (l: Lin, v: V) => (v === 'x' ? l.a : l.b);
const at = (l: Lin, p: Pt) => l.a.mul(p[0]).add(l.b.mul(p[1])).add(l.c);
const onLine = (l: Lin, p: Pt) => at(l, p).isZero();
const det = (l1: Lin, l2: Lin) => l1.a.mul(l2.b).sub(l2.a.mul(l1.b));
const samePt = (p: Pt, r: Pt) => p[0].equals(r[0]) && p[1].equals(r[1]);

function intersect(l1: Lin, l2: Lin): Pt | null {
	const d = det(l1, l2);
	if (d.isZero()) return null;
	return [l1.b.mul(l2.c).sub(l2.b.mul(l1.c)).div(d), l2.a.mul(l1.c).sub(l1.a.mul(l2.c)).div(d)];
}

type Position = 'incidenti' | 'parallele' | 'coincidenti';
function position(l1: Lin, l2: Lin): Position {
	if (!det(l1, l2).isZero()) return 'incidenti';
	const cx = l1.a.mul(l2.c).sub(l2.a.mul(l1.c));
	const cy = l1.b.mul(l2.c).sub(l2.b.mul(l1.c));
	return cx.isZero() && cy.isZero() ? 'coincidenti' : 'parallele';
}

/** Integer coefficients without a common factor, a > 0 (or b > 0 when a = 0): the way the lesson writes a line. */
function primitive(l: Lin): Lin {
	const L = lcm(lcm(l.a.den, l.b.den), l.c.den);
	const ints = scale(l, q(L));
	const g = gcd(gcd(Math.abs(ints.a.num), Math.abs(ints.b.num)), Math.abs(ints.c.num)) || 1;
	const s = ints.a.sign() < 0 || (ints.a.isZero() && ints.b.sign() < 0) ? -1 : 1;
	return scale(ints, q(s, g));
}
const isPrimitive = (l: Lin) => {
	const p = primitive(l);
	return p.a.equals(l.a) && p.b.equals(l.b) && p.c.equals(l.c);
};

function through(p1: Pt, p2: Pt): Lin {
	const a = p2[1].sub(p1[1]);
	const b = p1[0].sub(p2[0]);
	return primitive({ a, b, c: a.mul(p1[0]).add(b.mul(p1[1])).neg() });
}

const nice = (r: R, den = 12, num = 30) => r.den <= den && Math.abs(r.num) <= num;
const nicePt = (p: Pt | null, den = 12, num = 30): p is Pt => !!p && nice(p[0], den, num) && nice(p[1], den, num);
const smallLin = (l: Lin, ab: number, c: number) =>
	[l.a, l.b, l.c].every((r) => r.isInteger()) && Math.abs(l.a.num) <= ab && Math.abs(l.b.num) <= ab && Math.abs(l.c.num) <= c;

function nz(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

// ---------------------------------------------------------------------------
// LaTeX

function body(c: R, v: string): string {
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
function seq(items: [R, string][]): string {
	return joinTerms(items.filter(([c]) => !c.isZero()).map(([c, v]) => ({ neg: c.sign() < 0, tex: body(c, v) })));
}
function paren(r: R): string {
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}
/** k · val in a substitution: "2 \cdot 3", "(-3)", "-2", "3 \cdot \left(-\frac{1}{2}\right)". */
function prodTerm(k: R, val: R, first: boolean): Term {
	const a = k.abs();
	if (a.isOne()) return { neg: k.sign() < 0, tex: first && k.sign() > 0 ? val.toLatex() : paren(val) };
	return { neg: k.sign() < 0, tex: `${a.toLatex()} \\cdot ${paren(val)}` };
}

const slope = (l: Lin) => l.a.neg().div(l.b);
const intercept = (l: Lin) => l.c.neg().div(l.b);
const expRhs = (m: R, qq: R) => seq([[m, 'x'], [qq, '']]);

function eqTex(s: Shown): string {
	const l = s.lin;
	switch (s.form) {
		case 'imp':
			return `${seq([[l.a, 'x'], [l.b, 'y'], [l.c, '']])} = 0`;
		case 'exp':
			return `y = ${expRhs(slope(l), intercept(l))}`;
		case 'vert':
			return `x = ${l.c.neg().div(l.a).toLatex()}`;
		case 'hor':
			return `y = ${l.c.neg().div(l.b).toLatex()}`;
	}
}
const shownTex = (s: Shown) => `${s.name}: ${eqTex(s)}`;

const hasFrac = (p: Pt) => !p[0].isInteger() || !p[1].isInteger();
const ptTex = (name: string, p: Pt) =>
	hasFrac(p) ? `${name}\\left(${p[0].toLatex()}, ${p[1].toLatex()}\\right)` : `${name}(${p[0].toLatex()}, ${p[1].toLatex()})`;

/** a x + b y + c at a point, written out: "2 \cdot 3 + 3 - 9". */
function evalLatex(l: Lin, p: Pt): string {
	const ts: Term[] = [];
	if (!l.a.isZero()) ts.push(prodTerm(l.a, p[0], true));
	if (!l.b.isZero()) ts.push(prodTerm(l.b, p[1], ts.length === 0));
	if (!l.c.isZero()) ts.push({ neg: l.c.sign() < 0, tex: l.c.abs().toLatex() });
	return joinTerms(ts);
}

// ---------------------------------------------------------------------------
// Solving, as in the lesson

interface Solved {
	steps: string[];
	p: Pt;
	/** The coordinate found first (the answer of who stops there). */
	first: V;
}

/** v = e1 u + e0, written "9 - 2x" when e1 < 0 < e0 (as the lesson does), else "2x - 1". */
function exprLatex(e1: R, e0: R, u: V): { tex: string; constFirst: boolean } {
	if (e1.sign() < 0 && e0.sign() > 0) return { tex: `${e0.toLatex()} - ${body(e1, u)}`, constFirst: true };
	return { tex: seq([[e1, u], [e0, '']]), constFirst: false };
}
function plugLatex(e1: R, e0: R, val: R, constFirst: boolean): string {
	const e0t: Term = { neg: e0.sign() < 0, tex: e0.abs().toLatex() };
	if (constFirst) return joinTerms([e0t, prodTerm(e1, val, false)]);
	const ts = [prodTerm(e1, val, true)];
	if (!e0.isZero()) ts.push(e0t);
	return joinTerms(ts);
}
const eqVal = (lhs: string, val: R) => (lhs === val.toLatex() ? lhs : `${lhs} = ${val.toLatex()}`);

/** A u + B = 0 (already written), then "u = value". */
function finish(A: R, B: R, u: V, out: string[]): R {
	const val = B.neg().div(A);
	out.push(`${u} = ${val.toLatex()}`);
	return val;
}

/** Substitute v = e1 u + e0 (from `from`) into `to`, written in the form = 0. */
function substitution(from: Shown, v: V, to: Shown, out: string[], intro: string): Solved {
	const u = other(v);
	const f = from.lin;
	const cv = coefOf(f, v);
	const e1 = coefOf(f, u).neg().div(cv), e0 = f.c.neg().div(cv);
	const ex = exprLatex(e1, e0, u);
	out.push(intro.replace('#', `${v} = ${ex.tex}`));
	const t = to.lin;
	const dv = coefOf(t, v), du = coefOf(t, u);
	let vTerm: Term;
	if (e0.isZero()) vTerm = { neg: dv.mul(e1).sign() < 0, tex: body(dv.mul(e1), u) };
	else vTerm = { neg: dv.sign() < 0, tex: `${dv.abs().isOne() ? '' : dv.abs().toLatex()}(${ex.tex})` };
	const uTerm: Term = { neg: du.sign() < 0, tex: body(du, u) };
	const ts: Term[] = [];
	for (const w of ['x', 'y'] as V[]) {
		if (w === v) ts.push(vTerm);
		else if (!du.isZero()) ts.push(uTerm);
	}
	if (!t.c.isZero()) ts.push({ neg: t.c.sign() < 0, tex: t.c.abs().toLatex() });
	const subst = `${joinTerms(ts)} = 0`;
	out.push(subst);
	const A = du.add(dv.mul(e1)), B = t.c.add(dv.mul(e0));
	const collected = `${seq([[A, u], [B, '']])} = 0`;
	if (collected !== subst) out.push(collected);
	const val = finish(A, B, u, out);
	const vv = e0.add(e1.mul(val));
	out.push(`\\text{quindi } ${v} = ${eqVal(plugLatex(e1, e0, val, ex.constFirst), vv)}`);
	return { steps: out, p: v === 'x' ? [vv, val] : [val, vv], first: u };
}

/** Reduction on the normal forms a x + b y = -c (example 2). */
function reduction(s1: Shown, s2: Shown, out: string[]): Solved {
	const n1 = { a: s1.lin.a, b: s1.lin.b, k: s1.lin.c.neg() }, n2 = { a: s2.lin.a, b: s2.lin.b, k: s2.lin.c.neg() };
	const nTex = (n: { a: R; b: R; k: R }) => `${seq([[n.a, 'x'], [n.b, 'y']])} = ${n.k.toLatex()}`;
	out.push(`\\text{Porta i termini noti a secondo membro, cambiando il segno: } ${nTex(n1)},\\quad ${nTex(n2)}`);
	const cands = (['x', 'y'] as V[]).map((v) => {
		const p1 = v === 'x' ? n1.a : n1.b, p2 = v === 'x' ? n2.a : n2.b;
		const L = lcm(Math.abs(p1.num), Math.abs(p2.num));
		return { v, L, k1: L / Math.abs(p1.num), k2: L / Math.abs(p2.num), opp: p1.sign() !== p2.sign() };
	});
	cands.sort((a, b) => a.L - b.L || Number(b.opp) - Number(a.opp));
	const { v, k1, k2, opp } = cands[0];
	const u = other(v);
	const m1 = { a: n1.a.mul(q(k1)), b: n1.b.mul(q(k1)), k: n1.k.mul(q(k1)) };
	const m2 = { a: n2.a.mul(q(k2)), b: n2.b.mul(q(k2)), k: n2.k.mul(q(k2)) };
	if (k1 > 1 && k2 > 1) out.push(`\\text{Per eliminare } ${v}\\text{, moltiplica la prima per } ${k1} \\text{ e la seconda per } ${k2}\\text{: } ${nTex(m1)},\\quad ${nTex(m2)}`);
	else if (k1 > 1 || k2 > 1) out.push(`\\text{Per eliminare } ${v}\\text{, moltiplica la ${k1 > 1 ? 'prima' : 'seconda'} per } ${k1 > 1 ? k1 : k2}\\text{: } ${nTex(k1 > 1 ? m1 : m2)}`);
	const q1 = u === 'x' ? m1.a : m1.b, q2 = u === 'x' ? m2.a : m2.b;
	const A = opp ? q1.add(q2) : q1.sub(q2);
	const B = opp ? m1.k.add(m2.k) : m1.k.sub(m2.k);
	out.push(`\\text{${opp ? 'Somma le due equazioni' : 'Sottrai la seconda dalla prima'}: } ${seq([[A, u]])} = ${B.toLatex()}`);
	const val = B.div(A);
	if (!A.isOne()) out.push(`${u} = ${val.toLatex()}`);
	const cu = u === 'x' ? n1.a : n1.b, cv = v === 'x' ? n1.a : n1.b;
	const uT = prodTerm(cu, val, u === 'x');
	const vT: Term = { neg: cv.sign() < 0, tex: body(cv, v) };
	out.push(`\\text{Metti } ${u} = ${val.toLatex()} \\text{ nella prima: } ${joinTerms(u === 'x' ? [uT, vT] : [vT, uT])} = ${n1.k.toLatex()}`);
	const rest = n1.k.sub(cu.mul(val));
	const vv = rest.div(cv);
	if (!cv.isOne()) out.push(`${seq([[cv, v]])} = ${rest.toLatex()}`);
	out.push(`${v} = ${vv.toLatex()}`);
	return { steps: out, p: v === 'x' ? [vv, val] : [val, vv], first: u };
}

/** The steps that find the common point of two incident lines, with the method the lesson uses for their forms. */
function solveSteps(s1: Shown, s2: Shown): Solved {
	const out: string[] = [];
	const axis = [s1, s2].find((s) => s.form === 'vert' || s.form === 'hor');
	if (axis) {
		const o = axis === s1 ? s2 : s1;
		const v: V = axis.form === 'vert' ? 'x' : 'y';
		const u = other(v);
		const h = axis.lin.c.neg().div(coefOf(axis.lin, v));
		out.push(`\\text{Tutti i punti di } ${axis.name} \\text{ hanno ${v === 'x' ? 'ascissa' : 'ordinata'} } ${h.toLatex()}\\text{: sostituisci } ${v} = ${h.toLatex()} \\text{ nell'equazione di } ${o.name}`);
		const l = o.lin;
		const cv = coefOf(l, v), cu = coefOf(l, u);
		const vTerm = prodTerm(cv, h, v === 'x');
		const uTerm: Term = { neg: cu.sign() < 0, tex: body(cu, u) };
		const ts: Term[] = v === 'x' ? [vTerm, uTerm] : [uTerm, vTerm];
		if (!l.c.isZero()) ts.push({ neg: l.c.sign() < 0, tex: l.c.abs().toLatex() });
		out.push(`${joinTerms(ts)} = 0`);
		const known = cv.mul(h);
		const tsv: Term[] = [];
		const kT: Term = { neg: known.sign() < 0, tex: known.abs().toLatex() };
		if (v === 'x') tsv.push(kT, uTerm);
		else tsv.push(uTerm, kT);
		if (!l.c.isZero()) tsv.push({ neg: l.c.sign() < 0, tex: l.c.abs().toLatex() });
		const done = `${joinTerms(tsv.filter((t) => t.tex !== '0'))} = 0`;
		if (done !== out[out.length - 1] && !known.isZero()) out.push(done);
		const rest = known.add(l.c).neg();
		if (!cu.isOne()) out.push(`${seq([[cu, u]])} = ${rest.toLatex()}`);
		const uv = rest.div(cu);
		out.push(`${u} = ${uv.toLatex()}`);
		return { steps: out, p: v === 'x' ? [h, uv] : [uv, h], first: v };
	}
	const exps = [s1, s2].filter((s) => s.form === 'exp');
	if (exps.length === 2) {
		// comparison (example 1)
		const [m1, m2] = [slope(s1.lin), slope(s2.lin)], [q1, q2] = [intercept(s1.lin), intercept(s2.lin)];
		out.push(`\\text{Le due equazioni danno già } y\\text{: uguaglia i secondi membri, } ${expRhs(m1, q1)} = ${expRhs(m2, q2)}`);
		const A = m1.sub(m2), B = q2.sub(q1);
		out.push(`\\text{Porta la } x \\text{ a primo membro e i numeri a secondo: } ${seq([[m1, 'x'], [m2.neg(), 'x']])} = ${seq([[q2, ''], [q1.neg(), '']])}`);
		out.push(`${seq([[A, 'x']])} = ${B.toLatex()}`);
		const xv = B.div(A);
		if (!A.isOne()) out.push(`x = ${xv.toLatex()}`);
		const useFirst = m1.abs().compare(m2.abs()) < 0;
		const [s, mm, qq, chk] = useFirst ? [s1, m1, q1, s2] : [s2, m2, q2, s1];
		const yv = mm.mul(xv).add(qq);
		const ex = exprLatex(mm, qq, 'x');
		out.push(`\\text{Metti } x = ${xv.toLatex()} \\text{ nell'equazione di } ${s.name}\\text{: } y = ${eqVal(plugLatex(mm, qq, xv, ex.constFirst), yv)}`);
		const cm = slope(chk.lin), cq = intercept(chk.lin);
		out.push(`\\text{Controllo su } ${chk.name}\\text{: } ${eqVal(plugLatex(cm, cq, xv, exprLatex(cm, cq, 'x').constFirst), yv)}`);
		return { steps: out, p: [xv, yv], first: 'x' };
	}
	if (exps.length === 1) {
		const e = exps[0], o = e === s1 ? s2 : s1;
		return substitution(e, 'y', o, out, `\\text{L'equazione di } ${e.name} \\text{ dà già } y\\text{: sostituisci } # \\text{ nell'equazione di } ${o.name}`);
	}
	// two implicit lines: substitution when a coefficient is ±1 (y first), reduction otherwise
	for (const [s, v] of [
		[s1, 'y'],
		[s2, 'y'],
		[s1, 'x'],
		[s2, 'x'],
	] as [Shown, V][]) {
		if (coefOf(s.lin, v).abs().isOne()) {
			const o = s === s1 ? s2 : s1;
			return substitution(s, v, o, out, `\\text{Da } ${s.name} \\text{ ricavi } # \\text{ e sostituisci in } ${o.name}`);
		}
	}
	return reduction(s1, s2, out);
}

// ---------------------------------------------------------------------------
// Options

function optLatex(o: Opt, name: string): string {
	const pt = (): Pt => [R_(o[1]), R_(o[2])];
	switch (o[0]) {
		case 'P':
			return ptTex(name, pt());
		case 'x':
			return `x = ${R_(o[1]).toLatex()}`;
		case 'y':
			return `y = ${R_(o[1]).toLatex()}`;
		case 'incidenti':
			return `\\text{incidenti in } ${ptTex('P', pt())}`;
		case 'parallele':
			return '\\text{parallele distinte}';
		case 'coincidenti':
			return '\\text{coincidenti}';
		case 'concorrenti':
			return `\\text{concorrenti in } ${ptTex('P', pt())}`;
		case 'non concorrenti':
			return '\\text{non concorrenti}';
		default:
			return R_(o[0]).toLatex();
	}
}
const ptOpt = (p: Pt, tag = 'P'): Opt => [tag, p[0].toString(), p[1].toString()];
const key = (o: Opt) => o.join('|');

/** Correct option first, then the candidates in order, distinct, up to four. Null when fewer than four. */
function pickOptions(correct: Opt, cands: (Opt | null)[]): Opt[] | null {
	const out = [correct];
	const seen = new Set([key(correct)]);
	for (const c of cands) {
		if (!c || out.length >= 4) continue;
		if (seen.has(key(c))) continue;
		seen.add(key(c));
		out.push(c);
	}
	return out.length === 4 ? out : null;
}

function shuffle(rng: Rng, opts: Opt[], name: string): ChoiceAnswer {
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: optLatex(opts[i], name), values: opts[i] }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** Points near p, to fill the options: swapped, signs changed, one unit off. */
function nearby(p: Pt): Pt[] {
	const [x, y] = p;
	return [
		[y, x],
		[x, y.neg()],
		[x.neg(), y],
		[x.neg(), y.neg()],
		[x.add(q(1)), y],
		[x, y.sub(q(1))],
		[x.sub(q(1)), y.add(q(1))],
	];
}
const pts = (ps: (Pt | null)[], tag = 'P'): Opt[] => ps.filter((p) => nicePt(p)).map((p) => ptOpt(p!, tag));

const linJSON = (s: Shown) => [s.name, s.form, s.lin.a.toString(), s.lin.b.toString(), s.lin.c.toString()];

// ---------------------------------------------------------------------------
// Level 1: two lines in explicit form, integer point (example 1)

function level1(rng: Rng): Sample | null {
	const px = nz(rng, -5, 5), py = rng.int(-6, 6);
	const m1 = nz(rng, -4, 4), m2 = nz(rng, -4, 4, [m1]);
	const q1 = py - m1 * px, q2 = py - m2 * px;
	if (Math.abs(q1) > 9 || Math.abs(q2) > 9) return null;
	const r: Shown = { name: 'r', lin: lin(m1, -1, q1), form: 'exp' };
	const s: Shown = { name: 's', lin: lin(m2, -1, q2), form: 'exp' };
	const sol = solveSteps(r, s);
	const P = sol.p;
	// y from the line the steps use
	const used = Math.abs(m1) < Math.abs(m2) ? { m: m1, qq: q1 } : { m: m2, qq: q2 };
	const withX = (xv: R): Pt => [xv, q(used.m).mul(xv).add(q(used.qq))];
	const wrong: (Opt | null)[] = [
		...pts([[P[1], P[0]]]),
		['x', P[0].toString()],
		// numbers carried across without changing sign: (m1 - m2) x = q1 - q2
		...pts([withX(P[0].neg())]),
		// the division upside down
		...pts([withX(q(1).div(P[0]))]),
		...pts(nearby(P)),
	];
	const opts = pickOptions(ptOpt(P), wrong);
	if (!opts) return null;
	return {
		generatorId: ID,
		level: 1,
		seed: rng.seed,
		prompt: 'Trova il punto di intersezione delle due rette.',
		problem: `${shownTex(r)} \\quad ${shownTex(s)}`,
		solution: ptTex('P', P),
		steps: [...sol.steps, `\\text{Il punto di intersezione è } ${ptTex('P', P)}`],
		answer: shuffle(rng, opts, 'P'),
		params: { lines: [linJSON(r), linJSON(s)], point: ptOpt(P).slice(1), kind: null },
	};
}

// ---------------------------------------------------------------------------
// Level 2: implicit form, or a line parallel to an axis; a fractional coordinate (examples 2 and 3)

type K2 = 'implicite' | 'verticale' | 'orizzontale';

function level2(rng: Rng, u: number): Sample | null {
	const kind: K2 = u < 0.6 ? 'implicite' : u < 0.8 ? 'verticale' : 'orizzontale';
	let r: Shown, s: Shown;
	const wrongPts: (Pt | null)[] = [];
	const extra: Opt[] = [];
	if (kind === 'implicite') {
		const fracX = rng.next() < 0.5;
		const d = rng.pick([2, 3, 4, 5]);
		const n = nz(rng, -5 * d, 5 * d);
		if (gcd(Math.abs(n), d) !== 1) return null;
		const P: Pt = fracX ? [q(n, d), q(rng.int(-5, 5))] : [q(rng.int(-5, 5)), q(n, d)];
		const mk = (): Lin | null => {
			const a = rng.int(1, 5), b = nz(rng, -5, 5);
			if (gcd(a, Math.abs(b)) !== 1) return null;
			const c = q(a).mul(P[0]).add(q(b).mul(P[1])).neg();
			if (!c.isInteger() || c.isZero() || Math.abs(c.num) > 20) return null;
			return lin(a, b, c);
		};
		const l1 = mk(), l2 = mk();
		if (!l1 || !l2 || det(l1, l2).isZero()) return null;
		r = { name: 'r', lin: l1, form: 'imp' };
		s = { name: 's', lin: l2, form: 'imp' };
		// the known term copied without changing its sign, in one equation or in both
		const flip = (l: Lin) => lin(l.a, l.b, l.c.neg());
		wrongPts.push(intersect(flip(l1), l2), intersect(l1, flip(l2)), [P[0].neg(), P[1].neg()]);
	} else {
		const v: V = kind === 'verticale' ? 'x' : 'y';
		const h = nz(rng, -5, 5);
		// the other line: coefficient of the other unknown at least 2, so that it comes out as a fraction
		const cOther = rng.pick([2, 3, 4, 5]) * (rng.next() < 0.3 ? -1 : 1);
		const cSame = nz(rng, -5, 5);
		const c = nz(rng, -9, 9);
		const l2 = v === 'x' ? lin(Math.abs(cSame), cOther * Math.sign(cSame), c) : lin(Math.abs(cOther), cSame * Math.sign(cOther), c);
		if (!isPrimitive(l2)) return null;
		const l1 = v === 'x' ? lin(1, 0, -h) : lin(0, 1, -h);
		r = { name: 'r', lin: l1, form: kind === 'verticale' ? 'vert' : 'hor' };
		s = { name: 's', lin: l2, form: 'imp' };
		const P = intersect(l1, l2);
		if (!P || !hasFrac(P)) return null;
		// x = h read as y = h, and the numbers carried across without changing sign
		wrongPts.push(intersect(v === 'x' ? lin(0, 1, -h) : lin(1, 0, -h), l2), v === 'x' ? [P[0], P[1].neg()] : [P[0].neg(), P[1]]);
		extra.push([v, String(h)]);
	}
	if (rng.next() < 0.5 && kind === 'implicite') [r, s] = [{ ...s, name: 'r' }, { ...r, name: 's' }];
	const sol = solveSteps(r, s);
	const P = sol.p;
	if (!hasFrac(P) || !nicePt(P, 6, 30)) return null;
	const opts = pickOptions(ptOpt(P), [
		...extra,
		...pts(wrongPts),
		...pts([[P[1], P[0]]]),
		kind === 'implicite' ? [sol.first, (sol.first === 'x' ? P[0] : P[1]).toString()] : null,
		...pts(nearby(P)),
	]);
	if (!opts) return null;
	return {
		generatorId: ID,
		level: 2,
		seed: rng.seed,
		prompt: 'Trova il punto di intersezione delle due rette.',
		problem: `${shownTex(r)} \\quad ${shownTex(s)}`,
		solution: ptTex('P', P),
		steps: [...sol.steps, `\\text{Il punto di intersezione è } ${ptTex('P', P)}`],
		answer: shuffle(rng, opts, 'P'),
		params: { lines: [linJSON(r), linJSON(s)], point: ptOpt(P).slice(1), kind },
	};
}

// ---------------------------------------------------------------------------
// Level 3: incident, parallel or coincident (example 4)

type Shape = 'esplicite' | 'implicite' | 'miste';

/** A line through p with small integer slope and intercept, or null. */
function expThrough(rng: Rng, p: Pt, not: number[] = []): Lin | null {
	const m = nz(rng, -4, 4, not);
	const qq = p[1].sub(q(m).mul(p[0]));
	if (!qq.isInteger() || Math.abs(qq.num) > 9) return null;
	return lin(m, -1, qq);
}
/** A primitive implicit line through p with a, b, c all nonzero and small. */
function impThrough(rng: Rng, p: Pt, a?: number): Lin | null {
	const aa = a ?? rng.int(1, 5), b = nz(rng, -5, 5);
	if (gcd(aa, Math.abs(b)) !== 1) return null;
	const c = q(aa).mul(p[0]).add(q(b).mul(p[1])).neg();
	if (!c.isInteger() || c.isZero() || Math.abs(c.num) > 20) return null;
	return lin(aa, b, c);
}
/** m x - y + q = 0 written with a > 0. */
const fromExp = (l: Lin) => primitive(l);

function level3(rng: Rng, u: number): Sample | null {
	const kind: Position = u < 0.4 ? 'incidenti' : u < 0.7 ? 'parallele' : 'coincidenti';
	const shape: Shape = kind === 'coincidenti' ? rng.pick<Shape>(['implicite', 'miste']) : rng.pick<Shape>(['esplicite', 'implicite', 'miste']);
	const trap = rng.next() < 0.5;
	let l1: Lin | null = null, l2: Lin | null = null;
	let f1: Form = 'imp', f2: Form = 'imp';
	let sub = shape as string;
	const t = () => rng.pick([1, 1, 2, 2, 3]);
	if (kind === 'incidenti') {
		const P: Pt = [q(rng.int(-5, 5)), q(rng.int(-5, 5))];
		if (shape === 'esplicite') {
			if (trap) P[0] = ZERO; // same q, different m (example 4c)
			l1 = expThrough(rng, P);
			l2 = l1 && expThrough(rng, P, [slope(l1).num]);
			f1 = f2 = 'exp';
			if (trap) sub = 'stessa q';
		} else if (shape === 'implicite') {
			l1 = impThrough(rng, P);
			// same coefficient of x, different coefficient of y: not parallel
			l2 = l1 && (trap ? impThrough(rng, P, l1.a.num) : impThrough(rng, P));
			if (l1 && l2 && Math.abs(l2.b.num) === 1 && Math.abs(l1.b.num) === 1) return null;
			if (trap) sub = 'stesso a';
		} else {
			l1 = expThrough(rng, P);
			const base = impThrough(rng, P);
			l2 = base && scale(base, q(t()));
			f1 = 'exp';
		}
	} else {
		// a primitive line and a multiple of it (parallel: another known term)
		if (shape === 'esplicite') {
			const m = nz(rng, -4, 4), q1 = rng.int(-9, 9), q2 = rng.int(-9, 9);
			if (q1 === q2) return null;
			l1 = lin(m, -1, q1);
			l2 = lin(m, -1, q2);
			f1 = f2 = 'exp';
		} else if (shape === 'implicite') {
			const P: Pt = [q(rng.int(-4, 4)), q(rng.int(-4, 4))];
			const base = impThrough(rng, P);
			if (!base) return null;
			const k1 = t(), k2 = rng.pick([1, 2, 3, 4].filter((k) => k !== k1));
			l1 = scale(base, q(k1));
			l2 = scale(base, q(k2));
			if (kind === 'parallele') {
				const c2 = nz(rng, -20, 20, [l2.c.num]);
				l2 = lin(l2.a, l2.b, c2);
				if (!primitive(l2).c.isInteger()) return null;
			}
		} else {
			const m = nz(rng, -4, 4), q1 = rng.int(-9, 9);
			l1 = lin(m, -1, q1);
			let q2 = q1;
			if (kind === 'parallele') q2 = nz(rng, -9, 9, [q1]);
			l2 = scale(fromExp(lin(m, -1, q2)), q(t()));
			f1 = 'exp';
		}
	}
	if (!l1 || !l2) return null;
	if (f2 === 'imp' && (l2.a.isZero() || l2.b.isZero() || l2.c.isZero())) return null;
	if (f1 === 'imp' && (l1.a.isZero() || l1.b.isZero() || l1.c.isZero())) return null;
	if (!smallLin(l1, 15, 30) || !smallLin(l2, 15, 30)) return null;
	if (position(l1, l2) !== kind) return null;
	let r: Shown = { name: 'r', lin: l1, form: f1 };
	let s: Shown = { name: 's', lin: l2, form: f2 };
	if (shape === 'miste' && rng.next() < 0.5) [r, s] = [{ ...s, name: 'r' }, { ...r, name: 's' }];
	if (eqTex(r) === eqTex(s)) return null;
	for (const x of [r, s]) if (x.form === 'exp' && (!slope(x.lin).isInteger() || !intercept(x.lin).isInteger())) return null;

	const steps = compareSteps(r, s, kind);
	let correct: Opt;
	let cands: (Opt | null)[];
	if (kind === 'incidenti') {
		const sol = solveSteps(r, s);
		steps.push(`\\text{Il punto comune si trova con il sistema}`, ...sol.steps, `\\text{Le rette sono incidenti in } ${ptTex('P', sol.p)}`);
		correct = ptOpt(sol.p, 'incidenti');
		cands = [['parallele'], ['coincidenti'], ...pts([[sol.p[1], sol.p[0]]], 'incidenti'), ...pts(nearby(sol.p), 'incidenti')];
	} else {
		// "incidenti" in a point of r only (parallel), or in a point on neither line (coincident)
		const onR = integerPoints(r.lin);
		const off = onR.map((p): Pt => [p[1], p[0]]).filter((p) => !onLine(r.lin, p) && !onLine(s.lin, p));
		const fake = kind === 'parallele' ? onR : off;
		correct = [kind];
		cands = [[kind === 'parallele' ? 'coincidenti' : 'parallele'], ...pts(fake, 'incidenti')];
	}
	const opts = pickOptions(correct, cands);
	if (!opts) return null;
	const solutionText: Record<Position, string> = {
		incidenti: '',
		parallele: '\\text{parallele distinte}',
		coincidenti: '\\text{coincidenti}',
	};
	return {
		generatorId: ID,
		level: 3,
		seed: rng.seed,
		prompt: 'Le due rette sono incidenti, parallele distinte o coincidenti? Se sono incidenti, in quale punto?',
		problem: `${shownTex(r)} \\quad ${shownTex(s)}`,
		solution: kind === 'incidenti' ? optLatex(correct, 'P') : solutionText[kind],
		steps,
		answer: shuffle(rng, opts, 'P'),
		params: { lines: [linJSON(r), linJSON(s)], kind, shape: sub },
	};
}

/** Small integer points of a line, nearest to the y axis first. */
function integerPoints(l: Lin): Pt[] {
	const out: Pt[] = [];
	for (let r = 0; r <= 8 && out.length < 4; r++)
		for (const x0 of r === 0 ? [0] : [r, -r]) {
			if (l.b.isZero()) continue;
			const y = l.c.add(l.a.mul(q(x0))).neg().div(l.b);
			if (y.isInteger() && Math.abs(y.num) <= 12) out.push([q(x0), y]);
		}
	return out;
}

/** a / a' written as in example 4: \frac{a}{a'} = \frac{2}{4} = \frac{1}{2}. */
function ratioLatex(sym: string, n: R, d: R): string {
	const raw = n.den === 1 && d.den === 1 ? `\\frac{${n.toLatex()}}{${d.toLatex()}}` : `${paren(n)} : ${paren(d)}`;
	const red = n.div(d);
	const rawN = d.isOne() ? n.toLatex() : raw;
	return `\\frac{${sym}}{${sym}'} = ${rawN}${rawN === red.toLatex() ? '' : ` = ${red.toLatex()}`}`;
}

function compareSteps(r: Shown, s: Shown, kind: Position): string[] {
	const out: string[] = [];
	const conclusion: Record<Position, string> = {
		incidenti: 'le rette sono incidenti',
		parallele: 'le rette sono parallele distinte',
		coincidenti: 'le rette sono coincidenti',
	};
	if (r.form === 'imp' && s.form === 'imp') {
		const [l1, l2] = [r.lin, s.lin];
		out.push(`\\text{Confronta i rapporti dei coefficienti: } ${ratioLatex('a', l1.a, l2.a)}`);
		out.push(ratioLatex('b', l1.b, l2.b));
		if (kind !== 'incidenti') out.push(ratioLatex('c', l1.c, l2.c));
		const why: Record<Position, string> = {
			incidenti: 'I primi due rapporti sono diversi',
			parallele: 'I primi due rapporti sono uguali e il terzo no',
			coincidenti: 'I tre rapporti sono uguali',
		};
		out.push(`\\text{${why[kind]}: ${conclusion[kind]}}`);
		return out;
	}
	for (const x of [r, s]) {
		if (x.form !== 'imp') continue;
		const l = x.lin;
		const lhs = seq([[l.b, 'y']]);
		const rhs = seq([[l.a.neg(), 'x'], [l.c.neg(), '']]);
		const exp = `y = ${expRhs(slope(l), intercept(l))}`;
		if (l.b.isOne()) out.push(`\\text{Porta } ${x.name} \\text{ in forma esplicita: } ${exp}`);
		else out.push(`\\text{Porta } ${x.name} \\text{ in forma esplicita: } ${lhs} = ${rhs}\\text{, e dividendo per } ${l.b.toLatex()}\\text{: } ${exp}`);
	}
	const mq = (x: Shown) => `m = ${slope(x.lin).toLatex()},\\ q = ${intercept(x.lin).toLatex()}`;
	out.push(`\\text{Per } ${r.name}\\text{: } ${mq(r)}\\text{; per } ${s.name}\\text{: } ${mq(s)}`);
	const sameQ = intercept(r.lin).equals(intercept(s.lin));
	const why: Record<Position, string> = {
		incidenti: sameQ ? 'Le } m \\text{ sono diverse, e la } q \\text{ uguale non conta' : 'Le } m \\text{ sono diverse',
		parallele: 'Stessa } m \\text{ e } q \\text{ diverse',
		coincidenti: 'Stessa } m \\text{ e stessa } q \\text{',
	};
	out.push(`\\text{${why[kind]}: ${conclusion[kind]}}`);
	return out;
}

// ---------------------------------------------------------------------------
// Level 4: a vertex of a triangle given the lines of its sides (example 5)

type Vx = 'A' | 'B' | 'C';
const SIDES: Record<Vx, [string, string]> = { A: ['AB', 'CA'], B: ['AB', 'BC'], C: ['BC', 'CA'] };

function level4(rng: Rng): Sample | null {
	const V: Record<Vx, Pt> = { A: [q(0), q(0)], B: [q(0), q(0)], C: [q(0), q(0)] };
	for (const k of ['A', 'B', 'C'] as Vx[]) V[k] = [q(rng.int(-5, 5)), q(rng.int(-5, 5))];
	const lines: Record<string, Lin> = { AB: through(V.A, V.B), BC: through(V.B, V.C), CA: through(V.C, V.A) };
	if (samePt(V.A, V.B) || samePt(V.B, V.C) || samePt(V.C, V.A) || onLine(lines.AB, V.C)) return null;
	for (const l of Object.values(lines)) if (l.a.isZero() || l.b.isZero() || !smallLin(l, 6, 20)) return null;
	const ask = rng.pick<Vx>(['A', 'B', 'C']);
	const [n1, n2] = SIDES[ask];
	const shown: Shown[] = ['AB', 'BC', 'CA'].map((n) => ({ name: n, lin: lines[n], form: 'imp' as Form }));
	const s1 = shown.find((x) => x.name === n1)!, s2 = shown.find((x) => x.name === n2)!;
	const sol = solveSteps(s1, s2);
	const P = sol.p;
	const others = (['A', 'B', 'C'] as Vx[]).filter((k) => k !== ask).map((k) => V[k]);
	const opts = pickOptions(ptOpt(P), [
		// the vertex of another pair of sides (the warning "Il vertice sta sui due lati che lo nominano")
		...pts(others),
		...pts([[P[1], P[0]]]),
		...pts(others.map((p): Pt => [p[1], p[0]])),
		...pts(nearby(P)),
	]);
	if (!opts) return null;
	return {
		generatorId: ID,
		level: 4,
		seed: rng.seed,
		prompt: `I lati del triangolo ABC stanno su queste rette. Trova il vertice ${ask}.`,
		problem: shown.map(shownTex).join(' \\quad '),
		solution: ptTex(ask, P),
		steps: [`\\text{Il vertice } ${ask} \\text{ sta sui lati } ${n1} \\text{ e } ${n2}\\text{: è la loro intersezione}`, ...sol.steps, `\\text{Il vertice è } ${ptTex(ask, P)}`],
		answer: shuffle(rng, opts, ask),
		params: { lines: shown.map(linJSON), ask, vertices: (['A', 'B', 'C'] as Vx[]).map((k) => ptOpt(V[k]).slice(1)), kind: null },
	};
}

// ---------------------------------------------------------------------------
// Level 5: area of a triangle with a side on an axis (examples 6 and 7)

type K5 = 'asse x' | 'asse y' | 'assi';

function level5(rng: Rng, u: number): Sample | null {
	const kind: K5 = u < 0.4 ? 'asse x' : u < 0.6 ? 'asse y' : 'assi';
	const steps: string[] = [];
	const mistakes: R[] = [];
	let area: R;
	let problem: string;
	let prompt: string;
	let lines: Shown[];
	if (kind === 'assi') {
		const a = rng.int(1, 6), b = nz(rng, -6, 6), c = nz(rng, -12, 12);
		const l = lin(a, b, c);
		if (!isPrimitive(l)) return null;
		const p = q(-c, a), qq = q(-c, b);
		if (p.den > 3 || qq.den > 3) return null;
		const r: Shown = { name: 'r', lin: l, form: 'imp' };
		lines = [r];
		area = p.mul(qq).abs().div(q(2));
		steps.push(`\\text{Con } y = 0\\text{: } ${seq([[q(a), 'x'], [q(c), '']])} = 0\\text{, quindi } x = ${p.toLatex()} \\text{ e il punto sull'asse } x \\text{ è } ${ptTex('A', [p, ZERO])}`);
		steps.push(`\\text{Con } x = 0\\text{: } ${seq([[q(b), 'y'], [q(c), '']])} = 0\\text{, quindi } y = ${qq.toLatex()} \\text{ e il punto sull'asse } y \\text{ è } ${ptTex('B', [ZERO, qq])}`);
		steps.push(`\\text{I cateti sono } \\overline{OA} = ${abs(p)} \\text{ e } \\overline{OB} = ${abs(qq)}`);
		steps.push(`\\text{Area} = \\frac{1}{2} \\cdot ${p.abs().toLatex()} \\cdot ${qq.abs().toLatex()} = ${area.toLatex()}`);
		// the signs kept, 1/2 forgotten, the known term read as the intercept on the y axis
		mistakes.push(p.mul(qq).div(q(2)), area.mul(q(2)), area.neg(), p.abs().mul(q(Math.abs(c))).div(q(2)));
		problem = shownTex(r);
		prompt = "Trova l'area del triangolo che la retta r forma con gli assi.";
	} else {
		// two vertices on the axis, the third off it; w is the coordinate along the axis
		const onX = kind === 'asse x';
		const w1 = rng.int(-6, 6), w2 = rng.int(-6, 6);
		if (w1 === w2) return null;
		const [lo, hi] = w1 < w2 ? [w1, w2] : [w2, w1];
		const h = rng.next() < 0.4 ? q(nz(rng, -9, 9), 2) : q(nz(rng, -6, 6)); // off the axis
		const along = rng.next() < 0.25 ? q(nz(rng, -9, 9), 2) : q(rng.int(-5, 5));
		if (along.equals(q(lo)) || along.equals(q(hi))) return null;
		const pt = (w: R, off: R): Pt => (onX ? [w, off] : [off, w]);
		const A = pt(q(lo), ZERO), B = pt(q(hi), ZERO), C = pt(along, h);
		const lr = through(B, C), ls = through(A, C);
		if (!smallLin(lr, 8, 20) || !smallLin(ls, 8, 20)) return null;
		if ([lr, ls].some((l) => l.a.isZero() || l.b.isZero())) return null;
		const r: Shown = { name: 'r', lin: lr, form: 'imp' };
		const s: Shown = { name: 's', lin: ls, form: 'imp' };
		lines = [r, s];
		const axis = onX ? 'x' : 'y';
		const zero = onX ? 'y' : 'x';
		steps.push(`\\text{L'asse } ${axis} \\text{ ha equazione } ${zero} = 0\\text{: metti } ${zero} = 0 \\text{ nelle due rette}`);
		for (const x of lines) {
			const cc = coefOf(x.lin, onX ? 'x' : 'y');
			const val = x.lin.c.neg().div(cc);
			steps.push(`${x.name}: ${seq([[cc, axis], [x.lin.c, '']])} = 0 \\ \\Rightarrow \\ ${axis} = ${val.toLatex()}`);
		}
		steps.push(`\\text{I vertici sull'asse sono } ${ptTex('A', A)} \\text{ e } ${ptTex('B', B)}`);
		const sol = solveSteps(r, s);
		if (!samePt(sol.p, C)) return null;
		steps.push(`\\text{Il terzo vertice è l'intersezione di } r \\text{ e } s`, ...sol.steps);
		steps.push(`\\text{Il terzo vertice è } ${ptTex('C', C)}`);
		const base = q(hi - lo);
		const height = h.abs();
		area = base.mul(height).div(q(2));
		steps.push(`\\text{La base è } \\overline{AB} = |${hi} - ${paren(q(lo))}| = ${base.toLatex()} \\text{ e l'altezza è } ${abs(h)}`);
		steps.push(`\\text{Area} = \\frac{1}{2} \\cdot ${base.toLatex()} \\cdot ${height.toLatex()} = ${area.toLatex()}`);
		// the height with its sign, 1/2 forgotten, the other coordinate of C as the height
		mistakes.push(base.mul(h).div(q(2)), area.mul(q(2)), base.mul(along.abs()).div(q(2)), area.neg());
		problem = `${shownTex(r)} \\quad ${shownTex(s)}`;
		prompt = `Trova l'area del triangolo formato dalle rette r, s e dall'asse ${axis}.`;
	}
	if (!nice(area, 4, 80) || area.isZero()) return null;
	const wrong = mistakes.filter((m) => !m.equals(area) && !m.isZero());
	if (new Set(wrong.map(String)).size < 2) return null;
	return {
		generatorId: ID,
		level: 5,
		seed: rng.seed,
		prompt,
		problem,
		solution: `\\text{Area} = ${area.toLatex()}`,
		steps,
		answer: { kind: 'number', value: area.toString() },
		params: { lines: lines.map(linJSON), kind, mistakes: mistakes.map(String) },
	};
}
const abs = (r: R) => (r.sign() < 0 ? `\\left|${r.toLatex()}\\right| = ${r.abs().toLatex()}` : r.toLatex());

// ---------------------------------------------------------------------------
// Level 6: three lines through the same point (examples 9 and 10)

type K6 = 'parametro' | 'concorrenti' | 'non concorrenti';

function level6(rng: Rng, u: number): Sample | null {
	const kind: K6 = u < 0.6 ? 'parametro' : u < 0.8 ? 'concorrenti' : 'non concorrenti';
	const P: Pt = [q(nz(rng, -5, 5)), q(nz(rng, -5, 5))];
	const l1 = impThrough(rng, P), l2 = impThrough(rng, P);
	if (!l1 || !l2 || det(l1, l2).isZero() || !smallLin(l1, 5, 20) || !smallLin(l2, 5, 20)) return null;
	const r: Shown = { name: 'r', lin: l1, form: 'imp' };
	const s: Shown = { name: 's', lin: l2, form: 'imp' };
	const sol = solveSteps(r, s);
	const steps = [`\\text{Intersezione di } r \\text{ e } s\\text{:}`, ...sol.steps, `\\text{Il punto comune a } r \\text{ e } s \\text{ è } ${ptTex('P', P)}`];
	if (kind === 'parametro') {
		const pos: V = rng.next() < 0.6 ? 'x' : 'y';
		const k = nz(rng, -6, 6);
		const o = nz(rng, -5, 5);
		const [kk, oo] = [q(k), q(o)];
		const l3 = pos === 'x' ? lin(kk, oo, ZERO) : lin(oo, kk, ZERO);
		l3.c = at(l3, P).neg();
		if (l3.c.isZero() || Math.abs(l3.c.num) > 20) return null;
		if (pos === 'y' && o < 0) return null;
		if (position(l3, l1) !== 'incidenti' || position(l3, l2) !== 'incidenti') return null;
		const vTex =
			pos === 'x'
				? `v: ${joinTerms([{ neg: false, tex: 'kx' }, { neg: o < 0, tex: body(oo, 'y') }, { neg: l3.c.sign() < 0, tex: l3.c.abs().toLatex() }])} = 0`
				: `v: ${joinTerms([{ neg: false, tex: body(oo, 'x') }, { neg: false, tex: 'ky' }, { neg: l3.c.sign() < 0, tex: l3.c.abs().toLatex() }])} = 0`;
		const pk = pos === 'x' ? P[0] : P[1], po = pos === 'x' ? P[1] : P[0];
		const rest = oo.mul(po).add(l3.c); // the known part: pk k + rest = 0
		const kT: Term = { neg: false, tex: `k \\cdot ${paren(pk)}` };
		const oT = prodTerm(oo, po, pos === 'y');
		const cT: Term = { neg: l3.c.sign() < 0, tex: l3.c.abs().toLatex() };
		const subst = `${joinTerms(pos === 'x' ? [kT, oT, cT] : [oT, kT, cT])} = 0`;
		steps.push(`\\text{Perché } v \\text{ passi per } P\\text{, le sue coordinate devono verificarne l'equazione: } ${subst}`);
		steps.push(`${seq([[pk, 'k']])} = ${rest.neg().toLatex()}`);
		if (!pk.isOne()) steps.push(`k = ${kk.toLatex()}`);
		const shownV: Shown = { name: 'v', lin: l3, form: 'imp' };
		steps.push(`\\text{Con } k = ${kk.toLatex()} \\text{ la retta è } ${shownTex(shownV)}\\text{, e infatti } ${evalLatex(l3, P)} = 0`);
		// the sign lost moving the numbers, x and y swapped, the division upside down
		const swapped = pos === 'x' ? (P[1].isZero() ? null : oo.mul(P[0]).add(l3.c).neg().div(P[1])) : oo.mul(P[1]).add(l3.c).neg().div(P[0]);
		const mistakes = [kk.neg(), swapped, rest.isZero() ? null : pk.div(rest.neg())].filter((m): m is R => !!m && nice(m, 6, 30));
		return {
			generatorId: ID,
			level: 6,
			seed: rng.seed,
			prompt: 'Per quale valore di k le tre rette passano per lo stesso punto?',
			problem: `${shownTex(r)} \\quad ${shownTex(s)} \\quad ${vTex}`,
			solution: `k = ${kk.toLatex()}`,
			steps,
			answer: { kind: 'number', value: kk.toString() },
			params: { lines: [linJSON(r), linJSON(s), ['v', pos, oo.toString(), l3.c.toString()]], kind, point: ptOpt(P).slice(1), mistakes: mistakes.map(String) },
		};
	}
	// a third line t: through P, or through another point of r (then r, s, t form a triangle)
	let l3: Lin | null;
	if (kind === 'concorrenti') l3 = impThrough(rng, P);
	else {
		const Q = integerPoints(l1).find((p) => !samePt(p, P) && rng.next() < 0.7) ?? null;
		if (!Q) return null;
		l3 = impThrough(rng, Q);
		if (l3 && onLine(l3, P)) return null;
	}
	if (!l3 || !smallLin(l3, 5, 20) || position(l3, l1) !== 'incidenti' || position(l3, l2) !== 'incidenti') return null;
	const t: Shown = { name: 't', lin: l3, form: 'imp' };
	const val = at(l3, P);
	if (val.isZero()) {
		steps.push(`\\text{Sostituisci } P \\text{ in } t\\text{: } ${evalLatex(l3, P)} = 0\\text{, vero}`);
		steps.push(`\\text{Le rette } r\\text{, } s \\text{ e } t \\text{ passano tutte per } ${ptTex('P', P)}`);
	} else {
		steps.push(`\\text{Sostituisci } P \\text{ in } t\\text{: } ${evalLatex(l3, P)} = ${val.toLatex()}\\text{, che non è } 0`);
		steps.push(`\\text{La retta } t \\text{ non passa per } P\\text{: le tre rette non sono concorrenti}`);
	}
	const correct: Opt = val.isZero() ? ptOpt(P, 'concorrenti') : ['non concorrenti'];
	const cands: (Opt | null)[] = val.isZero()
		? [['non concorrenti'], ...pts([[P[1], P[0]]], 'concorrenti'), ...pts(nearby(P), 'concorrenti')]
		: [...pts([P, intersect(l1, l3), intersect(l2, l3)], 'concorrenti'), ...pts(nearby(P), 'concorrenti')];
	const opts = pickOptions(correct, cands);
	if (!opts) return null;
	return {
		generatorId: ID,
		level: 6,
		seed: rng.seed,
		prompt: 'Le tre rette passano per lo stesso punto?',
		problem: `${shownTex(r)} \\quad ${shownTex(s)} \\quad ${shownTex(t)}`,
		solution: optLatex(correct, 'P'),
		steps,
		answer: shuffle(rng, opts, 'P'),
		params: { lines: [linJSON(r), linJSON(s), linJSON(t)], kind, point: ptOpt(P).slice(1) },
	};
}

// ---------------------------------------------------------------------------
// Check

const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito', re: /(?<![\d.])1\s*[xyk]/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xyk]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

function linesFrom(p: Record<string, unknown>): Lin[] {
	return (p.lines as string[][]).filter((l) => l.length === 5).map((l) => lin(R_(l[2]), R_(l[3]), R_(l[4])));
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const lvl = sample.level;
	const ls = linesFrom(sample.params);
	const a = sample.answer;
	if (a.kind === 'choice') {
		if (a.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(a.options.map((o) => key(o.values))).size !== a.options.length) v.push('opzioni ripetute');
	}
	const truthPoint = (): Pt | null => (ls.length >= 2 ? intersect(ls[0], ls[1]) : null);
	const correctIs = (o: Opt) => {
		if (a.kind !== 'choice' || key(a.options[a.correct]?.values ?? []) !== key(o)) v.push("l'opzione giusta non è la risposta");
	};
	switch (lvl) {
		case 1:
		case 2: {
			const P = truthPoint();
			if (!P) return [...v, 'le rette non sono incidenti'];
			correctIs(ptOpt(P));
			if (lvl === 1 && (hasFrac(P) || !sample.problem.startsWith('r: y = '))) v.push('livello 1: punto intero, rette in forma esplicita');
			if (lvl === 2 && !hasFrac(P)) v.push('livello 2: serve una coordinata frazionaria');
			break;
		}
		case 3: {
			const kind = position(ls[0], ls[1]);
			if (kind !== sample.params.kind) v.push('livello 3: caso sbagliato');
			const P = truthPoint();
			correctIs(P ? ptOpt(P, 'incidenti') : [kind]);
			break;
		}
		case 4: {
			const ask = sample.params.ask as Vx;
			const names = ['AB', 'BC', 'CA'];
			const [n1, n2] = SIDES[ask];
			const P = intersect(ls[names.indexOf(n1)], ls[names.indexOf(n2)]);
			if (!P) return [...v, 'lati paralleli'];
			correctIs(ptOpt(P));
			for (const l of ls) if (!isPrimitive(l)) v.push('livello 4: lato non primitivo');
			break;
		}
		case 5: {
			if (a.kind !== 'number' || R_(a.value).sign() <= 0) v.push('livello 5: area positiva');
			break;
		}
		case 6: {
			if (sample.params.kind === 'parametro') {
				if (a.kind !== 'number') v.push('livello 6: il parametro è un numero');
			} else {
				const P = truthPoint();
				if (!P) return [...v, 'r e s parallele'];
				correctIs(onLine(ls[2], P) ? ptOpt(P, 'concorrenti') : ['non concorrenti']);
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice for the number answers

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer`);
	const value = R_(sample.answer.value);
	const mistakes = (sample.params.mistakes as string[]).map(R_);
	const fill = [value.add(q(1)), value.sub(q(1)), value.mul(q(2)), value.add(q(2)), value.neg().add(q(1))];
	const opts = pickOptions(
		[value.toString()],
		[...mistakes, ...fill].filter((m) => !m.equals(value) && !(sample.level === 5 && m.isZero())).map((m) => [m.toString()]),
	);
	if (!opts) throw new Error(`${ID}: no choice for seed ${sample.seed}`);
	return shuffle(rng, opts, '');
}

const intersezioneTraDueRette: Generator = {
	id: ID,
	title: 'Intersezione tra due rette',
	levels: {
		1: { label: 'Due rette in forma esplicita', constraints: ['y = mx + q con m da -4 a 4, |q| fino a 9', 'punto intero, confronto'] },
		2: { label: 'Forma implicita e rette parallele agli assi', constraints: ['6 su 10 due rette implicite, 2 su 10 con x = h, 2 su 10 con y = k', 'una coordinata frazionaria'] },
		3: { label: 'Incidenti, parallele o coincidenti', constraints: ['4 su 10 incidenti, 3 su 10 parallele, 3 su 10 coincidenti', 'trappole: stessa q, stesso coefficiente di x'] },
		4: { label: 'I vertici di un triangolo', constraints: ['tre lati in forma implicita, vertici interi da -5 a 5', 'un vertice chiesto'] },
		5: { label: "L'area di un triangolo con un lato su un asse", constraints: ['4 su 10 lato sull\'asse x, 2 su 10 sull\'asse y, 4 su 10 triangolo con gli assi'] },
		6: { label: 'Tre rette per lo stesso punto', constraints: ['6 su 10 il parametro k, 2 su 10 concorrenti, 2 su 10 non concorrenti'] },
	},
	generate(rng: Rng, level: number): Sample {
		const u = rng.next();
		for (let attempt = 0; attempt < 20_000; attempt++) {
			let s: Sample | null;
			switch (level) {
				case 1:
					s = level1(rng);
					break;
				case 2:
					s = level2(rng, u);
					break;
				case 3:
					s = level3(rng, u);
					break;
				case 4:
					s = level4(rng);
					break;
				case 5:
					s = level5(rng, u);
					break;
				case 6:
					s = level6(rng, u);
					break;
				default:
					throw new Error(`${ID}: unknown level ${level}`);
			}
			if (!s) continue;
			s.steps = s.steps.filter((t, i, all) => i === 0 || t !== all[i - 1]);
			if (check(s).length === 0) {
				try {
					toChoice(s, rng);
				} catch {
					continue;
				}
				return s;
			}
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default intersezioneTraDueRette;
