/**
 * Espressioni con monomi. Spec: specs/exercises/monomi-espressioni.md
 *
 * Five levels in the order of the lesson, each adding one difficulty: one product or quotient
 * and then a sum; products and quotients in a row, from left to right; powers; one bracket that
 * contains a sum; round, square and curly brackets together. Every intermediate result is a
 * monomial and the answer is a nonzero monomial in normal form.
 *
 * The expression is a tree, built forwards: divisors are chosen among the divisors of what they
 * divide, and the term added in a sum is chosen similar to the other one.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	addSimilar,
	buildChoice,
	div,
	factorLatex,
	forbidden,
	letters,
	literalLatex,
	mono,
	monoFromJSON,
	monoJSON,
	monoLatex,
	monoOpt,
	monoSympy,
	mul,
	nearMono,
	neg,
	nonZero,
	numSumLatex,
	pickLetters,
	pow,
	randomFraction,
	sumLatex,
	wrap,
} from '../monomi';

export const ID = 'monomi-espressioni';

type Op = 'mul' | 'div';
interface Leaf {
	t: 'm';
	m: Mono;
}
interface Pow {
	t: 'pow';
	base: Leaf | Group;
	n: number;
}
interface Chain {
	t: 'chain';
	items: (Leaf | Pow | Group)[];
	ops: Op[];
}
interface Term {
	neg: boolean;
	n: Leaf | Pow | Chain | Group;
}
interface Sum {
	t: 'sum';
	terms: Term[];
}
interface Group {
	t: 'group';
	inner: Sum;
}
type Node = Leaf | Pow | Chain | Sum | Group;

const L = (m: Mono): Leaf => ({ t: 'm', m });
const P = (base: Leaf | Group, n: number): Pow => ({ t: 'pow', base, n });
const C = (items: (Leaf | Pow | Group)[], ops: Op[]): Chain => ({ t: 'chain', items, ops });
const T = (n: Term['n'], isNeg = false): Term => ({ neg: isNeg, n });
const S = (...terms: Term[]): Sum => ({ t: 'sum', terms });
const G = (inner: Sum): Group => ({ t: 'group', inner });

// ---------------------------------------------------------------------------
// Evaluation, with the students' mistakes as variants

type Mistake = 'none' | 'order' | 'powcoef' | 'powadd' | 'powsign' | 'recip' | 'sumexp';

function evalChain(vals: Mono[], ops: Op[], mk: Mistake): Mono | null {
	const d = (a: Mono, b: Mono) => {
		const r = div(a, b);
		// dividing by a fraction without taking the reciprocal
		return r && mk === 'recip' && !b.c.isInteger() ? mono(a.c.mul(b.c), { ...r.e }) : r;
	};
	if (mk === 'order') {
		// "·" done before ":": a : b · c read as a : (b · c)
		const segs: Mono[] = [vals[0]];
		ops.forEach((op, i) => {
			if (op === 'mul') segs[segs.length - 1] = mul(segs[segs.length - 1], vals[i + 1]);
			else segs.push(vals[i + 1]);
		});
		let acc: Mono | null = segs[0];
		for (let i = 1; i < segs.length && acc; i++) acc = d(acc, segs[i]);
		return acc;
	}
	let acc: Mono | null = vals[0];
	ops.forEach((op, i) => {
		if (acc) acc = op === 'mul' ? mul(acc, vals[i + 1]) : d(acc, vals[i + 1]);
	});
	return acc;
}

function ev(n: Node, mk: Mistake = 'none'): Mono | null {
	switch (n.t) {
		case 'm':
			return n.m;
		case 'pow': {
			const b = ev(n.base, mk);
			if (!b) return null;
			const r = pow(b, n.n);
			if (mk === 'powcoef') return mono(b.c, { ...r.e });
			if (mk === 'powadd') return mono(r.c, Object.fromEntries(letters(b).map((v) => [v, b.e[v] + n.n])));
			if (mk === 'powsign' && b.c.sign() < 0 && n.n % 2 === 0) return neg(r);
			return r;
		}
		case 'chain': {
			const vals = n.items.map((it) => ev(it, mk));
			if (vals.some((v) => !v)) return null;
			return evalChain(vals as Mono[], n.ops, mk);
		}
		case 'sum': {
			const vals: Mono[] = [];
			for (const t of n.terms) {
				const v = ev(t.n, mk);
				if (!v) return null;
				// "-(2a)^2" read as "(-2a)^2"
				vals.push(t.neg && !(mk === 'powsign' && t.n.t === 'pow' && t.n.n % 2 === 0) ? neg(v) : v);
			}
			if (mk === 'sumexp') {
				const s = addSimilar(vals);
				if (!s || s.c.isZero()) return s;
				return mono(s.c, Object.fromEntries(letters(s).map((v) => [v, s.e[v] * vals.length])));
			}
			return addSimilar(vals);
		}
		case 'group':
			return ev(n.inner, mk);
	}
}

const value = (n: Node): Mono => {
	const v = ev(n);
	if (!v) throw new Error(`${ID}: expression is not a monomial`);
	return v;
};

// ---------------------------------------------------------------------------
// LaTeX

interface Out {
	s: string;
	lvl: number;
}

const OPEN = ['', '\\left(', '\\left[', '\\left\\{'];
const CLOSE = ['', '\\right)', '\\right]', '\\right\\}'];

const hasParen = (s: string) => s.startsWith('(') || s.startsWith('\\left(');
const absLeaf = (m: Mono) => mono(m.c.abs(), { ...m.e });

/** Sign that the term shows in front: a leading negative monomial gives its sign to the term. */
function leadSign(n: Node): 1 | -1 {
	if (n.t === 'm') return n.m.c.sign() < 0 ? -1 : 1;
	if (n.t === 'chain' && n.items[0].t === 'm') return n.items[0].m.c.sign() < 0 ? -1 : 1;
	return 1;
}

function operand(n: Leaf | Pow | Group, pos: 'first' | Op, abs = false): Out {
	if (n.t === 'm') {
		if (pos === 'first') return { s: monoLatex(abs ? absLeaf(n.m) : n.m), lvl: 0 };
		const s = factorLatex(n.m, pos === 'div');
		return { s, lvl: hasParen(s) ? 1 : 0 };
	}
	return render(n);
}

function render(n: Node, abs = false): Out {
	switch (n.t) {
		case 'm':
			return { s: monoLatex(abs ? absLeaf(n.m) : n.m), lvl: 0 };
		case 'pow': {
			if (n.base.t === 'm') return { s: `${wrap(monoLatex(n.base.m))}^${n.n}`, lvl: 1 };
			const g = render(n.base);
			return { s: `${g.s}^${n.n}`, lvl: g.lvl };
		}
		case 'chain': {
			const parts = n.items.map((it, i) => operand(it, i === 0 ? 'first' : n.ops[i - 1], i === 0 && abs));
			const s = parts.map((p, i) => (i === 0 ? p.s : `${n.ops[i - 1] === 'mul' ? ' \\cdot ' : ' : '}${p.s}`)).join('');
			return { s, lvl: Math.max(...parts.map((p) => p.lvl)) };
		}
		case 'sum': {
			let lvl = 0;
			const s = n.terms
				.map((t, i) => {
					const sign = (t.neg ? -1 : 1) * leadSign(t.n);
					const body = render(t.n, leadSign(t.n) < 0);
					lvl = Math.max(lvl, body.lvl);
					if (i === 0) return (sign < 0 ? '-' : '') + body.s;
					return (sign < 0 ? ' - ' : ' + ') + body.s;
				})
				.join('');
			return { s, lvl };
		}
		case 'group': {
			const inner = render(n.inner);
			const lvl = inner.lvl + 1;
			if (lvl > 3) throw new Error(`${ID}: brackets nested too deep`);
			return { s: `${OPEN[lvl]}${inner.s}${CLOSE[lvl]}`, lvl };
		}
	}
}

// ---------------------------------------------------------------------------
// Lines for the phone

/**
 * Estimated width in character units: visible characters (\left, \right and spaces do not count, a
 * fraction counts as its longer line, \cdot and each bracket count one) plus 0.6 for each fraction.
 * One unit is about 12 px of KaTeX at 18 px; the problem column on a phone is 350 px.
 */
function estWidth(latex: string): number {
	let s = latex.replace(/\\left|\\right/g, '');
	s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a: string, b: string) => '#'.repeat(Math.max(a.length, b.length)));
	s = s.replace(/\\cdot/g, '*').replace(/\\\{/g, '{').replace(/\\\}/g, '}');
	s = s.replace(/\^\{([^{}]*)\}/g, '$1').replace(/\^/g, '');
	return s.replace(/\s/g, '').length + 0.6 * (latex.match(/\\frac/g) ?? []).length;
}

/**
 * A problem wider than ONE_LINE goes on several lines, each within LINE (LINE - 2 after the \quad of a
 * continuation line). Measured on 1,000 problems per level: up to 33.2 units a line is at most 345 px.
 */
const ONE_LINE = 33.5;
const LINE = 26;

const PLAIN_OPEN = ['', '(', '[', '\\{'];
const PLAIN_CLOSE = ['', ')', ']', '\\}'];

interface Piece {
	s: string;
	/** The line may break before this piece: it starts with a +, a -, a \cdot or a :. */
	brk: boolean;
}

/** The expression cut where a line may break, also inside square and curly brackets, which are then written without \left \right. Round brackets are never cut. */
function pieces(n: Node, abs = false): Piece[] {
	switch (n.t) {
		case 'sum': {
			const out: Piece[] = [];
			n.terms.forEach((t, i) => {
				const sign = (t.neg ? -1 : 1) * leadSign(t.n);
				const ps = pieces(t.n, leadSign(t.n) < 0);
				const pre = i === 0 ? (sign < 0 ? '-' : '') : sign < 0 ? ' - ' : ' + ';
				ps[0] = { s: pre + ps[0].s, brk: i > 0 };
				out.push(...ps);
			});
			return out;
		}
		case 'chain': {
			const out: Piece[] = [];
			n.items.forEach((it, i) => {
				const ps = it.t === 'group' ? pieces(it) : [{ s: operand(it, i === 0 ? 'first' : n.ops[i - 1], i === 0 && abs).s, brk: false }];
				if (i > 0) ps[0] = { s: `${n.ops[i - 1] === 'mul' ? ' \\cdot ' : ' : '}${ps[0].s}`, brk: true };
				out.push(...ps);
			});
			return out;
		}
		case 'group': {
			const lvl = render(n).lvl;
			if (lvl < 2) return [{ s: render(n).s, brk: false }];
			const ps = pieces(n.inner);
			ps[0] = { ...ps[0], s: PLAIN_OPEN[lvl] + ps[0].s };
			ps[ps.length - 1] = { ...ps[ps.length - 1], s: ps[ps.length - 1].s + PLAIN_CLOSE[lvl] };
			return ps;
		}
		default:
			return [{ s: render(n, abs).s, brk: false }];
	}
}

/** The problem as the student sees it: one line if it fits, otherwise an aligned block, a new line before a +, a -, a \cdot or a :. */
function problemLatex(root: Node): string {
	const one = render(root).s;
	if (estWidth(one) <= ONE_LINE) return one;
	const lines: string[] = [];
	let cur = '';
	for (const p of pieces(root)) {
		const limit = lines.length === 0 ? LINE : LINE - 2;
		if (cur && p.brk && estWidth(cur + p.s) > limit) {
			lines.push(cur);
			cur = p.s.trimStart();
		} else cur += p.s;
	}
	lines.push(cur);
	return `\\begin{aligned}&${lines.join('\\\\&\\quad ')}\\end{aligned}`;
}

/** The lines of a problem written as an aligned block (one line if it is not). */
function problemLines(latex: string): string[] {
	const m = /^\\begin\{aligned\}&(.*)\\end\{aligned\}$/.exec(latex);
	return m ? m[1].split('\\\\&\\quad ') : [latex];
}

// ---------------------------------------------------------------------------
// Steps

const BRACKET = ['', 'tonda', 'quadra', 'graffa'];

function chainValuesLatex(vals: Mono[], ops: Op[]): string {
	return render(C(vals.map(L), ops)).s;
}

function evalSteps(n: Node, ctx: string, out: string[]): Mono {
	const label = (what: string) => `\\text{${ctx ? `${ctx}, ${what.toLowerCase()}` : what}: } `;
	switch (n.t) {
		case 'm':
			return n.m;
		case 'pow': {
			const b = evalSteps(n.base, ctx, out);
			const r = pow(b, n.n);
			out.push(`${label('Potenza')}${wrap(monoLatex(b))}^${n.n} = ${monoLatex(r)}`);
			return r;
		}
		case 'chain': {
			const vals = n.items.map((it) => evalSteps(it, ctx, out));
			const parts = [chainValuesLatex(vals, n.ops)];
			let cur = vals;
			let ops = n.ops;
			while (ops.length > 0) {
				const r = ops[0] === 'mul' ? mul(cur[0], cur[1]) : div(cur[0], cur[1])!;
				cur = [r, ...cur.slice(2)];
				ops = ops.slice(1);
				parts.push(chainValuesLatex(cur, ops));
			}
			const what = n.ops.length > 1 ? 'Prodotti e quozienti da sinistra a destra' : n.ops[0] === 'mul' ? 'Prodotto' : 'Quoziente';
			out.push(`${label(what)}${parts.join(' = ')}`);
			return cur[0];
		}
		case 'sum': {
			const vals = n.terms.map((t) => {
				const v = evalSteps(t.n, ctx, out);
				return t.neg ? neg(v) : v;
			});
			const r = addSimilar(vals)!;
			const lit = literalLatex(vals[0].e);
			const middle = vals.some((v) => !v.c.isInteger()) ? ` = ${wrap(numSumLatex(vals.map((v) => v.c)))}${lit} ` : ' ';
			out.push(`${label('Somma i monomi simili')}${sumLatex(vals)}${middle}= ${monoLatex(r)}`);
			return r;
		}
		case 'group': {
			const lvl = render(n).lvl;
			return evalSteps(n.inner, `Nella parentesi ${BRACKET[lvl]}`, out);
		}
	}
}

// ---------------------------------------------------------------------------
// Construction

function randLit(rng: Rng, ls: string[], lo: number, hi: number, allowMissing = true): Record<string, number> {
	for (;;) {
		const e: Record<string, number> = {};
		for (const v of ls) e[v] = allowMissing && rng.next() < 0.25 ? 0 : rng.int(lo, hi);
		if (Object.values(e).some((k) => k > 0)) return e;
	}
}

const intC = (rng: Rng, max: number) => q(nonZero(rng, -max, max));

function divisors(n: number): number[] {
	const out: number[] = [];
	for (let d = 2; d <= Math.abs(n); d++) if (n % d === 0) out.push(d);
	return out;
}

/** A divisor of V: exponents at most those of V, coefficient a divisor of V's (or a fraction). */
function divisorOf(rng: Rng, V: Mono, fracShare: number): Mono | null {
	const e: Record<string, number> = {};
	for (const v of letters(V)) e[v] = rng.int(0, V.e[v]);
	if (Object.values(e).every((k) => k === 0)) {
		const ls = letters(V);
		if (ls.length === 0) return null;
		const v = rng.pick(ls);
		e[v] = rng.int(1, V.e[v]);
	}
	let c: Rational;
	if (rng.next() < fracShare) c = randomFraction(rng, 5, 4);
	else {
		const ds = V.c.isInteger() ? divisors(V.c.num) : [];
		c = q(ds.length ? rng.pick(ds) : rng.int(2, 4));
		if (rng.int(0, 2) === 0) c = c.neg();
	}
	return mono(c, e);
}

/** A monomial similar to V such that V + it is not zero. */
function similarTo(rng: Rng, V: Mono, fracShare: number): Mono {
	for (;;) {
		const c = rng.next() < fracShare ? randomFraction(rng, 7, 4) : intC(rng, 9);
		if (!V.c.add(c).isZero()) return mono(c, { ...V.e });
	}
}

/** A two-term sum "x ± R" with the terms in either order. */
function sumWith(rng: Rng, x: Term['n'], xNeg: boolean, R: Mono): Sum {
	return rng.next() < 0.6 ? S(T(x, xNeg), T(L(R))) : S(T(L(R)), T(x, xNeg));
}

const smallCoef = (rng: Rng) => rng.pick([q(1), q(-1), q(2), q(-2), q(3), q(-3), q(1, 2), q(-1, 2)]);

interface Built {
	root: Node;
	case: string;
}

function build(rng: Rng, level: number): Built | null {
	const fam = rng.pick(FAMILIES);
	const ls = pickLetters(rng, fam, rng.pick([1, 2, 2, 2]));
	switch (level) {
		case 1: {
			let ch: Chain;
			if (rng.next() < 0.55) {
				ch = C([L(mono(intC(rng, 9), randLit(rng, ls, 1, 3))), L(mono(intC(rng, 6), randLit(rng, ls, 1, 3)))], ['mul']);
			} else {
				const A = mono(q(nonZero(rng, -9, 9) * rng.pick([2, 3, 4, 6])), randLit(rng, ls, 2, 5, false));
				const D = divisorOf(rng, A, 0);
				if (!D) return null;
				ch = C([L(A), L(D)], ['div']);
			}
			const V = value(ch);
			return { root: sumWith(rng, ch, false, similarTo(rng, V, 0)), case: ch.ops[0] === 'mul' ? 'prodotto e somma' : 'quoziente e somma' };
		}
		case 2: {
			let ch: Chain;
			let kind: string;
			if (rng.next() < 0.7) {
				const A = mono(q(nonZero(rng, -9, 9) * rng.pick([2, 3, 4, 6])), randLit(rng, ls, 2, 6, false));
				const B = divisorOf(rng, A, 0.15);
				if (!B) return null;
				ch = C([L(A), L(B), L(mono(intC(rng, 5), randLit(rng, ls, 1, 3)))], ['div', 'mul']);
				kind = 'quoziente poi prodotto';
			} else {
				const A = mono(intC(rng, 9), randLit(rng, ls, 1, 4));
				const B = mono(intC(rng, 6), randLit(rng, ls, 1, 3));
				const D = divisorOf(rng, mul(A, B), 0.15);
				if (!D) return null;
				ch = C([L(A), L(B), L(D)], ['mul', 'div']);
				kind = 'prodotto poi quoziente';
			}
			if (rng.next() < 0.5) return { root: ch, case: kind };
			return { root: sumWith(rng, ch, false, similarTo(rng, value(ch), 0.2)), case: kind };
		}
		case 3: {
			const base = mono(smallCoef(rng), randLit(rng, ls, 1, 3));
			const n = base.c.abs().compare(q(2)) <= 0 ? rng.pick([2, 2, 3]) : 2;
			const pw = P(L(base), n);
			const V0 = pow(base, n);
			const u = rng.next();
			let ch: Chain;
			if (u < 0.4) {
				const D = divisorOf(rng, V0, 0.25);
				if (!D) return null;
				ch = C([pw, L(D)], ['div']);
			} else {
				const Q = mono(rng.next() < 0.25 ? randomFraction(rng, 5, 4) : intC(rng, 5), randLit(rng, ls, 1, 3));
				ch = u < 0.75 ? C([pw, L(Q)], ['mul']) : C([L(Q), pw], ['mul']);
			}
			const outsideMinus = ch.items[0].t === 'pow' && rng.next() < 0.3;
			const V = value(ch);
			const R = similarTo(rng, outsideMinus ? neg(V) : V, 0.35);
			return { root: sumWith(rng, ch, outsideMinus, R), case: outsideMinus ? 'meno fuori dalla potenza' : 'potenza' };
		}
		case 4: {
			const u = rng.next();
			if (u < 0.4) {
				// [P · (Q)^2 ± R] : (D)  or  · M
				const Pm = mono(intC(rng, 6), randLit(rng, ls, 1, 3));
				const Qm = mono(smallCoef(rng), randLit(rng, ls, 1, 2));
				const ch = C([L(Pm), P(L(Qm), 2)], ['mul']);
				const g = G(sumWith(rng, ch, false, similarTo(rng, value(ch), 0.2)));
				const gv = value(g);
				if (rng.next() < 0.75) {
					const D = divisorOf(rng, gv, 0.35);
					if (!D) return null;
					return { root: C([g, L(D)], ['div']), case: 'parentesi quadra' };
				}
				return { root: C([g, L(mono(intC(rng, 5), randLit(rng, ls, 1, 2)))], ['mul']), case: 'parentesi quadra' };
			}
			if (u < 0.75) {
				// (S1 ± S2)^n · Q  or  : D
				const S1 = mono(rng.next() < 0.4 ? randomFraction(rng, 5, 4) : intC(rng, 6), randLit(rng, ls, 1, 2));
				const g = G(S(T(L(S1)), T(L(similarTo(rng, S1, 0.3)))));
				const gv = value(g);
				if (gv.c.abs().compare(q(4)) > 0) return null;
				const n = gv.c.abs().compare(q(2)) <= 0 ? rng.pick([2, 3]) : 2;
				const pw = P(g, n);
				if (rng.next() < 0.5) {
					const D = divisorOf(rng, value(pw), 0.3);
					if (!D) return null;
					return { root: C([pw, L(D)], ['div']), case: 'potenza di una somma' };
				}
				const Q = L(mono(intC(rng, 6), randLit(rng, ls, 1, 3)));
				return { root: rng.int(0, 1) ? C([pw, Q], ['mul']) : C([Q, pw], ['mul']), case: 'potenza di una somma' };
			}
			// M · [A : (B) ± R]
			const A = mono(q(nonZero(rng, -9, 9) * rng.pick([2, 3, 4])), randLit(rng, ls, 2, 5, false));
			const B = divisorOf(rng, A, 0);
			if (!B) return null;
			const ch = C([L(A), L(B)], ['div']);
			const g = G(sumWith(rng, ch, false, similarTo(rng, value(ch), 0.2)));
			return { root: C([L(mono(intC(rng, 6), randLit(rng, ls, 1, 2))), g], ['mul']), case: 'parentesi quadra' };
		}
		case 5: {
			// { [ (S1 ± S2)^2 : (D1) ± R1 ] · (M1) ± T } : (D2)
			const S1 = mono(rng.next() < 0.5 ? randomFraction(rng, 3, 4) : intC(rng, 4), randLit(rng, ls, 1, 2));
			const g1 = G(S(T(L(S1)), T(L(similarTo(rng, S1, 0.3)))));
			const v1 = value(g1);
			if (v1.c.abs().compare(q(3)) > 0) return null;
			const pw1 = P(g1, 2);
			let inner: Chain;
			if (rng.next() < 0.6) {
				const D1 = divisorOf(rng, value(pw1), 0.4);
				if (!D1) return null;
				inner = C([pw1, L(D1)], ['div']);
			} else {
				inner = C([pw1, L(mono(intC(rng, 4), randLit(rng, ls, 1, 2)))], ['mul']);
			}
			const g2 = G(sumWith(rng, inner, false, similarTo(rng, value(inner), 0.4)));
			const M1 = mono(intC(rng, 4), randLit(rng, ls, 1, 2));
			const left = C([g2, L(M1)], ['mul']);
			const target = value(left);
			// T = (E)^2 · F or E · F, similar to [ ] · M1
			const Te: Record<string, number> = {};
			const Tf: Record<string, number> = {};
			const squared = rng.next() < 0.6;
			for (const v of letters(target)) {
				Te[v] = rng.int(0, squared ? Math.floor(target.e[v] / 2) : target.e[v]);
				Tf[v] = target.e[v] - (squared ? 2 : 1) * Te[v];
			}
			if (Object.values(Te).every((k) => k === 0) || Object.values(Tf).every((k) => k === 0)) return null;
			const E = mono(squared ? rng.pick([q(2), q(3), q(-2), q(1, 2), q(2, 3), q(1, 3)]) : intC(rng, 4), Te);
			const F = mono(intC(rng, 9), Tf);
			const Tn = C([squared ? P(L(E), 2) : L(E), L(F)], ['mul']);
			const tNeg = Tn.items[0].t === 'pow' && rng.next() < 0.3;
			const g3 = G(rng.next() < 0.7 ? S(T(left), T(Tn, tNeg)) : S(T(Tn, tNeg), T(left)));
			const v3 = ev(g3);
			if (!v3 || v3.c.isZero()) return null;
			const D2 = divisorOf(rng, v3, 0.2);
			if (!D2) return null;
			return { root: C([g3, L(D2)], ['div']), case: 'tonde, quadre e graffe' };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

interface Stats {
	maxLeafNum: number;
	maxLeafDen: number;
	maxNum: number;
	maxDen: number;
	maxExp: number;
	pows: number;
	groups: number;
	chainOps: Op[][];
	ok: boolean;
}

function stats(n: Node, s: Stats): void {
	const v = ev(n);
	if (!v || v.c.isZero()) s.ok = false;
	else {
		s.maxNum = Math.max(s.maxNum, Math.abs(v.c.num));
		s.maxDen = Math.max(s.maxDen, v.c.den);
		s.maxExp = Math.max(s.maxExp, ...Object.values(v.e), 0);
	}
	switch (n.t) {
		case 'm':
			s.maxLeafNum = Math.max(s.maxLeafNum, Math.abs(n.m.c.num));
			s.maxLeafDen = Math.max(s.maxLeafDen, n.m.c.den);
			if (letters(n.m).length === 0) s.ok = false;
			break;
		case 'pow':
			s.pows++;
			stats(n.base, s);
			break;
		case 'chain':
			s.chainOps.push(n.ops);
			n.items.forEach((it) => stats(it, s));
			break;
		case 'sum':
			n.terms.forEach((t) => stats(t.n, s));
			break;
		case 'group':
			s.groups++;
			stats(n.inner, s);
			break;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const root = fromJSON(sample.params.tree);
	if (!root) return ['params.tree non valido'];
	v.push(...forbidden(sample.problem));
	let r: Mono;
	let out: Out;
	try {
		r = value(root);
		out = render(root);
	} catch (e) {
		return [(e as Error).message];
	}
	if (problemLatex(root) !== sample.problem) v.push('problema diverso dall\'albero');
	const lines = problemLines(sample.problem);
	if (lines.length === 1 && estWidth(lines[0]) > ONE_LINE) v.push('problema troppo largo per una riga');
	if (lines.length > 1) lines.forEach((l, i) => {
		if (estWidth(l) > (i === 0 ? LINE : LINE - 2)) v.push(`riga ${i + 1} troppo larga per il telefono`);
	});
	if (lines.length > 3) v.push('più di tre righe');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== monoSympy(r) || a.latex !== monoLatex(r)) v.push('risposta diversa dal risultato');
	const st: Stats = { maxLeafNum: 0, maxLeafDen: 1, maxNum: 0, maxDen: 1, maxExp: 0, pows: 0, groups: 0, chainOps: [], ok: true };
	stats(root, st);
	if (!st.ok) v.push('un risultato intermedio non è un monomio non nullo, o un monomio del testo non ha lettere');
	if (st.maxLeafNum > 60 || st.maxLeafDen > 9) v.push('coefficiente del testo fuori intervallo');
	if (st.maxNum > 300 || st.maxDen > 12 || st.maxExp > 15) v.push('risultato intermedio troppo grande');
	if (Math.abs(r.c.num) > 100 || r.c.den > 9 || letters(r).length === 0 || Math.max(...Object.values(r.e)) > 12) v.push('risultato fuori intervallo');
	const ops = st.chainOps.flat();
	switch (sample.level) {
		case 1:
			if (root.t !== 'sum' || st.pows || st.groups || ops.length !== 1) v.push('serve un prodotto o un quoziente e una somma');
			break;
		case 2:
			if (st.pows || st.groups || !st.chainOps.some((o) => o.length === 2 && o.includes('div') && o.includes('mul'))) v.push('serve una catena di prodotti e quozienti');
			break;
		case 3:
			if (!st.pows || st.groups || root.t !== 'sum') v.push('serve una potenza, senza parentesi con somme');
			break;
		case 4:
			if (st.groups !== 1 || out.lvl > 2) v.push('serve una sola parentesi con una somma');
			break;
		case 5:
			if (out.lvl !== 3 || st.groups !== 3) v.push('servono tonde, quadre e graffe');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Serialisation, sample, choice

type JNode =
	| { t: 'm'; m: ReturnType<typeof monoJSON> }
	| { t: 'pow'; base: JNode; n: number }
	| { t: 'chain'; items: JNode[]; ops: Op[] }
	| { t: 'sum'; terms: { neg: boolean; n: JNode }[] }
	| { t: 'group'; inner: JNode };

function toJSON(n: Node): JNode {
	switch (n.t) {
		case 'm':
			return { t: 'm', m: monoJSON(n.m) };
		case 'pow':
			return { t: 'pow', base: toJSON(n.base), n: n.n };
		case 'chain':
			return { t: 'chain', items: n.items.map(toJSON), ops: [...n.ops] };
		case 'sum':
			return { t: 'sum', terms: n.terms.map((t) => ({ neg: t.neg, n: toJSON(t.n) })) };
		case 'group':
			return { t: 'group', inner: toJSON(n.inner) };
	}
}

function fromJSON(x: unknown): Node | null {
	try {
		const j = x as JNode;
		switch (j.t) {
			case 'm': {
				const m = monoFromJSON(j.m);
				return m ? L(m) : null;
			}
			case 'pow':
				return P(fromJSON(j.base) as Leaf | Group, j.n);
			case 'chain':
				return C(j.items.map(fromJSON) as (Leaf | Pow | Group)[], j.ops);
			case 'sum':
				return S(...j.terms.map((t) => T(fromJSON(t.n) as Term['n'], t.neg)));
			case 'group':
				return G(fromJSON(j.inner) as Sum);
			default:
				return null;
		}
	} catch {
		return null;
	}
}

function assemble(b: Built, level: number, seed: number): Sample {
	const r = value(b.root);
	const steps: string[] = [];
	evalSteps(b.root, '', steps);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: "Semplifica l'espressione.",
		problem: problemLatex(b.root),
		solution: monoLatex(r),
		steps,
		answer: { kind: 'expression', value: monoSympy(r), latex: monoLatex(r) },
		params: { case: b.case, tree: toJSON(b.root), result: monoJSON(r) },
	};
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const root = fromJSON(sample.params.tree)!;
	const r = value(root);
	const cands: (Opt | null)[] = [];
	const mistakes: Mistake[] =
		sample.level === 2 ? ['order', 'recip', 'sumexp'] : sample.level === 3 ? ['powsign', 'powcoef', 'powadd', 'recip'] : ['powcoef', 'order', 'powsign', 'recip', 'sumexp', 'powadd'];
	for (const mk of mistakes) {
		const w = ev(root, mk);
		if (w && Math.abs(w.c.num) <= 5000 && w.c.den <= 500) cands.push(monoOpt(w));
	}
	cands.push(monoOpt(neg(r)));
	if (sample.level === 1) {
		// sum done before the product, where it makes sense: exponents of the sum added
		const w = ev(root, 'sumexp');
		if (w) cands.unshift(monoOpt(w));
	}
	return buildChoice(monoOpt(r), cands, (i) => nearMono(r, i), rng);
}

export const monomiEspressioni: Generator = {
	id: ID,
	title: 'Espressioni con monomi',
	levels: {
		1: { label: 'Prima il prodotto o il quoziente, poi la somma', constraints: ['un prodotto o un quoziente di due monomi e un monomio simile al risultato', 'coefficienti interi'] },
		2: { label: 'Prodotti e quozienti da sinistra a destra', constraints: ['tre monomi legati da · e :, circa 7 su 10 nella forma a : b · c', 'metà delle volte segue una somma'] },
		3: { label: 'Con le potenze', constraints: ['una potenza di un monomio, poi un prodotto o un quoziente, poi una somma', 'circa 3 su 10 con il meno fuori dalla potenza'] },
		4: { label: 'Una parentesi con una somma', constraints: ['una parentesi tonda o quadra che contiene una somma di monomi simili', 'la parentesi è poi divisa, moltiplicata o elevata a potenza'] },
		5: { label: 'Tonde, quadre e graffe', constraints: ['tre livelli di parentesi, come nell\'esempio 4 della lezione', 'coefficienti intermedi fino a 300 con denominatore fino a 12, risultato fino a 100 con denominatore fino a 9'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level);
			} catch {
				continue; // a random draw that is not a monomial or nests too deep
			}
			if (!b) continue;
			let sample: Sample;
			try {
				sample = assemble(b, level, rng.seed);
			} catch {
				continue;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default monomiEspressioni;
