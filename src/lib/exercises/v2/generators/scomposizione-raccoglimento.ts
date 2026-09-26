/**
 * Raccoglimento totale e parziale. Spec: specs/exercises/scomposizione-raccoglimento.md
 *
 * Six levels in the order of lesson 34, each adding one difficulty: total factoring with a
 * number or one letter, with a monomial MCD in two letters (often a quotient equal to 1), with a
 * minus sign collected, collecting a polynomial (equal, squared or opposite brackets), grouping
 * with four terms, then grouping after a reordering, with six terms or after a total factoring.
 *
 * Built backwards: the factors are chosen first (integer coefficients, every polynomial factor
 * primitive and irreducible in Z), then the polynomial is expanded. The answer is the complete
 * factorization in the lesson's sense: an integer monomial in front (the MCD, or its opposite when
 * the first term is negative) and polynomial factors with no common factor that cannot be split
 * further. A number in front does not make 6x - 9 "reducible": 3(2x - 3) is the expected form.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { gcd, q } from '../rational';
import {
	type Mono,
	FAMILIES,
	collect,
	div,
	expOf,
	forbidden,
	letters,
	mono,
	monoFromJSON,
	monoJSON,
	monoKey,
	monoLatex,
	monoSympy,
	mul,
	neg,
	nonZero,
	pickLetters,
	polyLatex,
	polySympy,
	shuffle,
	sumLatex,
} from '../monomi';

export const ID = 'scomposizione-raccoglimento';

type Poly = Mono[];

/** pre · (g1)(g2)...: the lesson's factored form. */
interface Factored {
	pre: Mono;
	groups: Poly[];
}

/** m(g)^k, a term of a sum written with a bracket; g empty means the bare monomial m. */
interface ProdTerm {
	m: Mono;
	g: Poly;
	k: number;
}

interface Built {
	level: number;
	case: string;
	/** Expanded polynomial as written (levels 1-3, 5, 6). */
	poly?: Poly;
	/** Sum of bracketed terms as written (level 4). */
	terms?: ProdTerm[];
	answer: Factored;
	/** Levels 5-6: the common bracket P and the cofactor Q; the problem is sum_i Q_i·P, reordered at level 6. */
	P?: Poly;
	Q?: Poly;
	/** Level 6 "totale poi parziale": the number collected first. */
	g?: number;
	/** Level 4 "quadrato": the number k in (P)^2 + k(P). */
	k?: number;
}

const MAX_COEF = 60;

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');
const tdeg = (m: Mono) => Object.values(m.e).reduce((s, n) => s + n, 0);

/** Decreasing total degree, then decreasing powers in alphabetical order of the letters. */
function cmpMono(a: Mono, b: Mono): number {
	const d = tdeg(b) - tdeg(a);
	if (d !== 0) return d;
	for (const v of ALPHA) {
		const x = expOf(b, v) - expOf(a, v);
		if (x !== 0) return x;
	}
	return 0;
}

const sortPoly = (p: Poly): Poly => [...p].sort(cmpMono);
const pscale = (p: Poly, m: Mono): Poly => p.map((t) => mul(t, m));
const pneg = (p: Poly): Poly => p.map(neg);
const pmul = (a: Poly, b: Poly): Poly => collect(a.flatMap((x) => b.map((y) => mul(x, y))));
const polyKey = (p: Poly): string => collect(p).map(monoKey).sort().join('+') || '0';
const samePoly = (a: Poly, b: Poly) => polyKey(a) === polyKey(b);
const polyVars = (p: Poly): string[] => [...new Set(p.flatMap(letters))].sort();

/** MCD of the terms with the lesson's convention: positive gcd of the integer coefficients, common letters with the lowest exponent. */
function mcd(p: Poly): Mono {
	const c = p.map((t) => Math.abs(t.c.num)).reduce(gcd);
	const e: Record<string, number> = {};
	for (const v of polyVars(p)) {
		const m = Math.min(...p.map((t) => expOf(t, v)));
		if (m > 0) e[v] = m;
	}
	return mono(c, e);
}

const isUnit = (m: Mono) => letters(m).length === 0 && m.c.abs().isOne();
const intPoly = (p: Poly) => p.every((t) => t.c.isInteger());
const isPrimitive = (p: Poly) => intPoly(p) && isUnit(mcd(p));

/** Univariate integer polynomial (coefficients by power) has a rational root: rational root test. */
function hasRationalRoot(cs: number[]): boolean {
	const n = cs.length - 1;
	if (cs[0] === 0) return true;
	const divisors = (k: number) => {
		const out: number[] = [];
		for (let d = 1; d <= Math.abs(k); d++) if (k % d === 0) out.push(d);
		return out;
	};
	for (const p of divisors(cs[0]))
		for (const qq of divisors(cs[n]))
			for (const s of [1, -1]) {
				let v = 0;
				for (let i = 0; i <= n; i++) v += cs[i] * (s * p) ** i * qq ** (n - i);
				if (v === 0) return true;
			}
	return false;
}

/**
 * Sufficient test of irreducibility in Z, enough for the factors this generator builds: primitive
 * and either in one letter with degree at most 3 and no rational root, or of degree 1 in some
 * letter v with the terms containing v (or the terms without v) forming a single monomial.
 * False means "not irreducible or not recognised"; the builders then draw again.
 */
function irreducible(p: Poly): boolean {
	if (p.length < 2 || !isPrimitive(p)) return false;
	const vs = polyVars(p);
	if (vs.length === 0) return false;
	if (vs.length === 1) {
		const v = vs[0];
		const d = Math.max(...p.map((t) => expOf(t, v)));
		if (d === 1) return true;
		if (d > 3) return false;
		const cs = Array.from({ length: d + 1 }, () => 0);
		for (const t of p) cs[expOf(t, v)] += t.c.num;
		return !hasRationalRoot(cs);
	}
	for (const v of vs) {
		if (Math.max(...p.map((t) => expOf(t, v))) !== 1) continue;
		const withV = p.filter((t) => expOf(t, v) === 1).length;
		if (withV === 1 || p.length - withV === 1) return true;
	}
	return false;
}

// ---------------------------------------------------------------------------
// LaTeX and SymPy

/** The monomial in front of a bracket: nothing for 1, "-" for -1. */
function prefix(m: Mono): string {
	if (letters(m).length === 0 && m.c.isOne()) return '';
	if (letters(m).length === 0 && m.c.equals(q(-1))) return '-';
	return monoLatex(m);
}

const factoredLatex = (f: Factored): string => prefix(f.pre) + f.groups.map((g) => `(${polyLatex(g)})`).join('');

function factoredSympy(f: Factored): string {
	const parts = isUnit(f.pre) && f.pre.c.isOne() ? [] : [monoSympy(f.pre)];
	return [...parts, ...f.groups.map((g) => `(${polySympy(g)})`)].join('*') || '1';
}

const expandFactored = (f: Factored): Poly => f.groups.reduce((acc, g) => pmul(acc, g), [f.pre]);

function termLatex(t: ProdTerm, first: boolean): string {
	const body = (m: Mono) => (t.g.length === 0 ? monoLatex(m) : prefix(m) + `(${polyLatex(t.g)})` + (t.k > 1 ? `^${t.k}` : ''));
	if (first) return body(t.m);
	return t.m.c.sign() < 0 ? ` - ${body(neg(t.m))}` : ` + ${body(t.m)}`;
}

const sumTermsLatex = (ts: ProdTerm[]): string => ts.map((t, i) => termLatex(t, i === 0)).join('');

function sumTermsSympy(ts: ProdTerm[]): string {
	return ts.map((t) => `(${monoSympy(t.m)})` + (t.g.length ? `*(${polySympy(t.g)})` + (t.k > 1 ? `**${t.k}` : '') : '')).join(' + ');
}

function expandTerms(ts: ProdTerm[]): Poly {
	return collect(
		ts.flatMap((t) => {
			let acc: Poly = [t.m];
			for (let i = 0; i < t.k && t.g.length; i++) acc = pmul(acc, t.g);
			return acc;
		}),
	);
}

const bt = (m: Mono, g: Poly, k = 1): ProdTerm => ({ m, g, k });

// ---------------------------------------------------------------------------
// Random pieces

const coefsOk = (p: Poly) => p.every((t) => t.c.isInteger() && Math.abs(t.c.num) <= MAX_COEF);
const distinctLiterals = (p: Poly) => collect(p).length === p.length;

/** A primitive irreducible polynomial in one letter v, `n` terms, degree <= maxDeg, constant term nonzero, first coefficient positive. */
function innerOneLetter(rng: Rng, v: string, n: number, maxDeg: number, maxC: number): Poly | null {
	const exps = n === 2 ? [rng.int(1, maxDeg), 0] : [rng.int(2, maxDeg), 0, 0];
	if (n === 3) exps[1] = rng.int(1, exps[0] - 1);
	const p = exps.map((e, i) => mono(i === 0 ? rng.int(1, maxC) : nonZero(rng, -maxC, maxC), { [v]: e }));
	return irreducible(p) ? sortPoly(p) : null;
}

/** A primitive irreducible polynomial in two letters with `n` terms, exponents up to 2, first coefficient positive. */
function innerTwoLetters(rng: Rng, vs: string[], n: number, maxC: number, withOne: boolean): Poly | null {
	const terms: Poly = [];
	for (let i = 0; i < n; i++) {
		const e: Record<string, number> = {};
		for (const v of vs) e[v] = rng.int(0, 2);
		if (tdeg(mono(1, e)) === 0 || tdeg(mono(1, e)) > 3) return null;
		terms.push(mono(nonZero(rng, -maxC, maxC), e));
	}
	if (withOne) terms.push(mono(rng.pick([1, -1])));
	const p = sortPoly(terms);
	if (p[0].c.sign() < 0) p[0] = neg(p[0]);
	if (!distinctLiterals(p) || polyVars(p).length !== 2) return null;
	if (!withOne && p.some((t) => isUnit(t))) return null;
	return irreducible(p) ? p : null;
}

/** A linear binomial c1·u ± c2·w (w a letter, or a constant when w is null), primitive, first term positive. */
function linear(rng: Rng, u: string, w: string | null, maxC: number, sign?: 1 | -1): Poly | null {
	const c1 = rng.int(1, maxC);
	const c2 = rng.int(1, w ? maxC : 6) * (sign ?? rng.pick([1, -1]));
	const p = [mono(c1, { [u]: 1 }), mono(c2, w ? { [w]: 1 } : {})];
	return isPrimitive(p) ? p : null;
}

function otherFamily(fam: readonly string[]): readonly string[] {
	return FAMILIES.find((f) => f !== fam)!;
}

// ---------------------------------------------------------------------------
// Construction

function totale(level: number, kase: string, M: Mono, Q: Poly): Built | null {
	const poly = sortPoly(pscale(Q, M));
	if (!coefsOk(poly)) return null;
	return { level, case: kase, poly, answer: { pre: M, groups: [Q] } };
}

/** `cu` draws the case once per exercise, so that rejected attempts do not skew the shares. */
function build(rng: Rng, level: number, cu: number): Built | null {
	switch (level) {
		case 1: {
			const v = rng.pick(['x', 'x', 'x', 'a', 'y', 'b']);
			const u = cu;
			const kase = u < 0.4 ? 'numero' : u < 0.7 ? 'lettera' : 'numero e lettera';
			const Q = innerOneLetter(rng, v, rng.next() < 0.6 ? 2 : 3, 3, 9);
			if (!Q) return null;
			const M = kase === 'numero' ? mono(rng.int(2, 9)) : kase === 'lettera' ? mono(1, { [v]: rng.int(1, 3) }) : mono(rng.int(2, 6), { [v]: rng.int(1, 2) });
			return totale(level, kase, M, Q);
		}
		case 2: {
			const vs = pickLetters(rng, rng.pick(FAMILIES), 2);
			const kase = cu < 0.5 ? 'uno' : 'senza uno';
			const Q = innerTwoLetters(rng, vs, kase === 'uno' ? 2 : 3, 6, kase === 'uno');
			if (!Q) return null;
			const e: Record<string, number> = { [vs[0]]: rng.int(0, 3), [vs[1]]: rng.int(0, 2) };
			if (tdeg(mono(1, e)) === 0) return null;
			const M = mono(rng.next() < 0.8 ? rng.int(2, 6) : 1, e);
			return totale(level, kase, M, Q);
		}
		case 3: {
			const kase = cu < 0.3 ? 'numero' : 'monomio';
			const two = rng.next() < 0.4;
			const fam = rng.pick(FAMILIES);
			const vs = two ? pickLetters(rng, fam, 2) : [rng.pick(['x', 'x', 'a', 'y'])];
			const n = rng.next() < 0.5 ? 2 : 3;
			const withOne = n === 3 && rng.next() < 0.5;
			const Q = two ? innerTwoLetters(rng, vs, withOne ? 2 : n, 6, withOne) : innerOneLetter(rng, vs[0], n, 3, 6);
			if (!Q) return null;
			let M: Mono;
			if (kase === 'numero') M = mono(rng.int(2, 9));
			else {
				const e: Record<string, number> = {};
				for (const v of vs) e[v] = rng.int(0, 2);
				if (tdeg(mono(1, e)) === 0) e[vs[0]] = 1;
				M = mono(rng.next() < 0.75 ? rng.int(2, 6) : 1, e);
			}
			return totale(level, kase, neg(M), Q);
		}
		case 4: {
			const u = cu;
			const kase = u < 0.35 ? 'uguali' : u < 0.65 ? 'quadrato' : 'opposti';
			if (kase === 'quadrato') {
				const v = rng.pick(['x', 'x', 'a', 'y', 'b']);
				const P = linear(rng, v, null, 3);
				if (!P) return null;
				const k = nonZero(rng, -9, 9);
				const C = collect([...P, mono(k)]);
				if (C.length !== 2 || !isPrimitive(C)) return null;
				const terms = [bt(mono(1), P, 2), bt(mono(k), P)];
				return { level, case: kase, terms, answer: { pre: mono(1), groups: [P, C] }, k };
			}
			// P in the letters of one family (or a letter and a number), the cofactor in the other family
			const fam = rng.pick(FAMILIES);
			const [p1, p2] = pickLetters(rng, fam, 2);
			const withLetters = rng.next() < 0.6;
			const P = linear(rng, withLetters ? p1 : rng.pick([p1, p2]), withLetters ? p2 : null, withLetters ? 3 : 2, kase === 'opposti' ? -1 : undefined);
			if (!P) return null;
			const [s, t] = shuffle(rng, [...otherFamily(fam)]).slice(0, 2);
			const m1 = mono(rng.int(1, 5), { [s]: rng.int(1, 2) });
			const m2 = rng.next() < 0.7 ? mono(nonZero(rng, -5, 5), { [t]: rng.int(1, 2) }) : mono(nonZero(rng, -6, 6, [1, -1]));
			const C = [m1, m2];
			if (!irreducible(C)) return null;
			if (kase === 'uguali') return { level, case: kase, terms: [bt(m1, P), bt(m2, P)], answer: { pre: mono(1), groups: [P, C] } };
			const Pop = [neg(P[1]), neg(P[0])];
			return { level, case: kase, terms: [bt(m1, P), bt(neg(m2), Pop)], answer: { pre: mono(1), groups: [P, C] } };
		}
		case 5: {
			const kase = cu < 0.5 ? 'una lettera' : 'più lettere';
			let P: Poly | null;
			let Q: Poly | null;
			if (kase === 'una lettera') {
				const v = rng.pick(['x', 'x', 'a', 'y']);
				P = linear(rng, v, null, 3);
				const k = rng.next() < 0.7 ? 2 : 3;
				Q = [mono(rng.int(1, 3), { [v]: k }), mono(nonZero(rng, -9, 9))];
				if (!irreducible(Q)) return null;
			} else {
				const fam = rng.pick(FAMILIES);
				const [p1, p2] = pickLetters(rng, fam, 2);
				P = rng.next() < 0.5 ? linear(rng, p1, null, 3) : linear(rng, p1, p2, 3);
				const [s, t] = pickLetters(rng, otherFamily(fam), 2);
				Q = linear(rng, s, t, 4);
			}
			if (!P || !Q) return null;
			return partial(level, kase, P, Q);
		}
		case 6: {
			const u = cu;
			const kase = u < 1 / 3 ? 'riordino' : u < 2 / 3 ? 'sei termini' : 'totale poi parziale';
			if (kase === 'totale poi parziale') {
				const v = rng.pick(['x', 'x', 'a', 'y']);
				const P = linear(rng, v, null, 2);
				const Q = [mono(rng.int(1, 3), { [v]: rng.next() < 0.75 ? 2 : 3 }), mono(nonZero(rng, -7, 7))];
				if (!P || !irreducible(Q)) return null;
				const g = rng.int(2, 5);
				const b = partial(level, kase, P, Q);
				if (!b) return null;
				b.poly = b.poly!.map((t) => mul(t, mono(g)));
				if (!coefsOk(b.poly)) return null;
				b.g = g;
				b.answer = { pre: mono(g), groups: [P, Q] };
				return b;
			}
			if (kase === 'sei termini') {
				const fam = rng.pick(FAMILIES);
				const [p1, p2] = pickLetters(rng, fam, 2);
				const P = rng.next() < 0.7 ? linear(rng, p1, p2, 2) : linear(rng, p1, null, 2);
				const s = rng.pick(otherFamily(fam) === FAMILIES[1] ? ['x', 'x', 'y'] : ['a', 'b']);
				const Q = [mono(rng.int(1, 2), { [s]: 2 }), mono(nonZero(rng, -5, 5), { [s]: 1 }), mono(nonZero(rng, -6, 6))];
				if (!P || !irreducible(Q)) return null;
				return partial(level, kase, P, Q);
			}
			// riordino: P in two letters, Q a letter (maybe shared with P) and a number, or two letters of the other family
			const fam = rng.pick(FAMILIES);
			const [p1, p2] = pickLetters(rng, fam, 2);
			const P = linear(rng, p1, p2, 2);
			const [s, t] = pickLetters(rng, otherFamily(fam), 2);
			const Q = rng.next() < 0.6 ? linear(rng, rng.pick([p1, p2]), null, 2) : linear(rng, s, t, 3);
			if (!P || !Q) return null;
			const b = partial(level, kase, P, Q);
			if (!b) return null;
			// the grouped order is [q1p1, q1p2, q2p1, q2p2]; write a diagonal pair first
			const tt = b.poly!;
			const diag = rng.int(0, 1) ? [tt[0], tt[3], tt[1], tt[2]] : [tt[1], tt[2], tt[0], tt[3]];
			let written = [...(rng.int(0, 1) ? [diag[0], diag[1]] : [diag[1], diag[0]]), ...(rng.int(0, 1) ? [diag[2], diag[3]] : [diag[3], diag[2]])];
			if (written[0].c.sign() < 0) written = [written[1], written[0], written[2], written[3]];
			if (written[0].c.sign() < 0) return null;
			if (!isUnit(mcd(written.slice(0, 2))) || pairWorks(written[0], written[1], written[2], written[3])) return null;
			b.poly = written;
			return b;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** Partial factoring: the problem is Q1·P + Q2·P (+ Q3·P) expanded term by term, in this order. */
function partial(level: number, kase: string, P: Poly, Q: Poly): Built | null {
	if (!irreducible(P) || !irreducible(Q)) return null;
	const poly = Q.flatMap((qt) => pscale(P, qt));
	if (!distinctLiterals(poly) || !coefsOk(poly) || poly[0].c.sign() < 0) return null;
	if (!isUnit(mcd(poly))) return null;
	return { level, case: kase, poly, answer: { pre: mono(1), groups: [P, Q] }, P, Q };
}

/** The pair (a, b) and the pair (c, d), each with its MCD collected, give equal or opposite brackets. */
function pairWorks(a: Mono, b: Mono, c: Mono, d: Mono): boolean {
	const inner = (x: Mono, y: Mono) => {
		const m = mcd([x, y]);
		return [div(x, m)!, div(y, m)!];
	};
	const A = inner(a, b);
	const B = inner(c, d);
	return samePoly(A, B) || samePoly(A, pneg(B));
}

// ---------------------------------------------------------------------------
// Problem, steps

const problemLatex = (b: Built): string => (b.poly ? polyLatex(b.poly) : sumTermsLatex(b.terms!));
const problemPoly = (b: Built): Poly => (b.poly ? collect(b.poly) : expandTerms(b.terms!));

/** Groups of the written polynomial by the terms of Q: q_i(P). */
const groupTerms = (P: Poly, Q: Poly): ProdTerm[] => Q.map((qt) => bt(qt, P));

function divLatex(t: Mono, M: Mono): string {
	const d = M.c.sign() < 0 ? `(${monoLatex(M)})` : monoLatex(M);
	return `${monoLatex(t)} : ${d} = ${monoLatex(div(t, M)!)}`;
}

function totaleSteps(b: Built): string[] {
	const out: string[] = [];
	const poly = b.poly!;
	const M = b.answer.pre;
	const absM = mono(M.c.abs(), { ...M.e });
	const cs = poly.map((t) => Math.abs(t.c.num));
	if (absM.c.isOne()) out.push(`\\text{I coefficienti non hanno divisori comuni: il MCD dei coefficienti è } 1`);
	else out.push(`\\text{MCD dei coefficienti: } \\text{MCD}(${cs.join(',\\ ')}) = ${absM.c.num}`);
	for (const v of polyVars(poly)) {
		if (expOf(absM, v) > 0) out.push(`\\text{La } ${v} \\text{ compare in tutti i termini, con esponente minimo } ${expOf(absM, v)}`);
		else out.push(`\\text{La } ${v} \\text{ non compare in tutti i termini: non si raccoglie}`);
	}
	out.push(`\\text{Il MCD è } ${monoLatex(absM)}`);
	if (M.c.sign() < 0) out.push(`\\text{Il primo termine è negativo: si raccoglie } ${monoLatex(M)}\\text{, e dentro la parentesi ogni termine cambia segno}`);
	out.push(`\\text{Quozienti: } ${poly.map((t) => divLatex(t, M)).join(' \\qquad ')}`);
	out.push(`${polyLatex(poly)} = ${factoredLatex(b.answer)}`);
	return out;
}

function parzialeChain(b: Built, P: Poly, Q: Poly): string {
	return `${sumTermsLatex(groupTerms(P, Q))} = ${factoredLatex({ pre: mono(1), groups: [P, Q] })}`;
}

function steps(b: Built): string[] {
	if (b.level <= 3) return totaleSteps(b);
	const [P] = b.answer.groups;
	if (b.level === 4) {
		const prob = problemLatex(b);
		if (b.case === 'quadrato') {
			const k = b.k!;
			return [
				`\\text{Il quadrato vuol dire } (${polyLatex(P)})(${polyLatex(P)})\\text{: il fattore } (${polyLatex(P)}) \\text{ è comune ai due termini}`,
				`\\text{Dopo averlo raccolto, si riduce quello che resta nella parentesi quadra}`,
				`${prob} = (${polyLatex(P)})\\left[(${polyLatex(P)}) ${k < 0 ? '-' : '+'} ${Math.abs(k)}\\right] = ${factoredLatex(b.answer)}`,
			];
		}
		const [t1, t2] = b.terms!;
		const out: string[] = [];
		if (b.case === 'opposti') {
			out.push(`\\text{Le due parentesi sono opposte: } ${polyLatex(t2.g)} = -(${polyLatex(P)})`);
			out.push(`\\text{Il segno meno passa davanti al secondo termine}`);
			out.push(`${prob} = ${sumTermsLatex([t1, bt(neg(t2.m), P)])} = ${factoredLatex(b.answer)}`);
		} else {
			out.push(`\\text{I due termini hanno in comune il fattore } (${polyLatex(P)})`);
			out.push(`\\text{Dal primo termine resta } ${monoLatex(t1.m)}\\text{, dal secondo } ${monoLatex(t2.m)}`);
			out.push(`${prob} = ${factoredLatex(b.answer)}`);
		}
		return out;
	}
	const Pp = b.P!;
	const Q = b.Q!;
	const out: string[] = [];
	const grouped = Q.flatMap((qt) => pscale(Pp, qt));
	if (b.case === 'riordino') {
		const w = b.poly!;
		out.push(`\\text{I primi due termini, } ${sumLatex(w.slice(0, 2))}\\text{, non hanno fattori comuni: si riordina il polinomio}`);
		out.push(`${polyLatex(w)} = ${polyLatex(grouped)}`);
	}
	if (b.case === 'totale poi parziale') {
		const g = b.g!;
		out.push(`\\text{Tutti i coefficienti sono multipli di } ${g}\\text{: prima si raccoglie } ${g}`);
		out.push(
			`${polyLatex(b.poly!)} = ${g}(${polyLatex(grouped)}) = ${g}\\left[${sumTermsLatex(groupTerms(Pp, Q))}\\right] = ${factoredLatex(b.answer)}`,
		);
		return out;
	}
	for (let i = 0; i < Q.length; i++) {
		const pair = grouped.slice(2 * i, 2 * i + 2);
		const name = Q.length === 2 ? (i === 0 ? 'Primi due termini' : 'Ultimi due termini') : `Gruppo ${i + 1}`;
		if (isUnit(Q[i]) && Q[i].c.isOne()) out.push(`\\text{${name}: } ${sumLatex(pair)}\\text{, che è già la parentesi}`);
		else out.push(`\\text{${name}: } ${sumLatex(pair)} = ${termLatex(bt(Q[i], Pp), true)}`);
	}
	if (Q.slice(1).some((t) => t.c.sign() < 0)) out.push(`\\text{Dove il primo termine del gruppo è negativo si raccoglie il segno meno, così la parentesi viene uguale}`);
	out.push(`${polyLatex(grouped)} = ${parzialeChain(b, Pp, Q)}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks

function assemble(b: Built, seed: number): Sample {
	const prob = problemLatex(b);
	const ans = factoredLatex(b.answer);
	return {
		generatorId: ID,
		level: b.level,
		seed,
		prompt: 'Scomponi in fattori.',
		problem: prob,
		solution: `${prob} = ${ans}`,
		steps: steps(b),
		answer: { kind: 'expression', value: factoredSympy(b.answer), latex: ans, form: 'factored' },
		params: toJSON(b),
	};
}

const polyJSON = (p: Poly) => p.map(monoJSON);
const factJSON = (f: Factored) => ({ pre: monoJSON(f.pre), groups: f.groups.map(polyJSON) });

function toJSON(b: Built): Record<string, unknown> {
	const out: Record<string, unknown> = { case: b.case, answer: factJSON(b.answer) };
	if (b.poly) out.poly = polyJSON(b.poly);
	if (b.terms) out.terms = b.terms.map((t) => ({ m: monoJSON(t.m), g: polyJSON(t.g), k: t.k }));
	if (b.P) out.P = polyJSON(b.P);
	if (b.Q) out.Q = polyJSON(b.Q);
	if (b.g !== undefined) out.g = b.g;
	if (b.k !== undefined) out.k = b.k;
	return out;
}

function polyFrom(x: unknown): Poly | null {
	if (!Array.isArray(x)) return null;
	const p = x.map(monoFromJSON);
	return p.some((m) => !m) ? null : (p as Poly);
}

function parseBuilt(level: number, p: Record<string, unknown>): Built | null {
	const a = p.answer as { pre?: unknown; groups?: unknown[] } | undefined;
	if (typeof p.case !== 'string' || !a || !Array.isArray(a.groups)) return null;
	const pre = monoFromJSON(a.pre);
	const groups = a.groups.map(polyFrom);
	if (!pre || groups.some((g) => !g)) return null;
	const b: Built = { level, case: p.case, answer: { pre, groups: groups as Poly[] } };
	if (p.poly !== undefined) b.poly = polyFrom(p.poly) ?? undefined;
	if (Array.isArray(p.terms)) {
		const ts = p.terms.map((t: { m?: unknown; g?: unknown; k?: unknown }) => {
			const m = monoFromJSON(t.m);
			const g = polyFrom(t.g);
			return m && g && typeof t.k === 'number' ? bt(m, g, t.k) : null;
		});
		if (ts.some((t) => !t)) return null;
		b.terms = ts as ProdTerm[];
	}
	if (p.P !== undefined) b.P = polyFrom(p.P) ?? undefined;
	if (p.Q !== undefined) b.Q = polyFrom(p.Q) ?? undefined;
	if (typeof p.g === 'number') b.g = p.g;
	if (typeof p.k === 'number') b.k = p.k;
	if (!b.poly && !b.terms) return null;
	return b;
}

const CASES: Record<number, string[]> = {
	1: ['numero', 'lettera', 'numero e lettera'],
	2: ['uno', 'senza uno'],
	3: ['numero', 'monomio'],
	4: ['uguali', 'quadrato', 'opposti'],
	5: ['una lettera', 'più lettere'],
	6: ['riordino', 'sei termini', 'totale poi parziale'],
};

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.level, sample.params);
	if (!b) return ['params non validi'];
	const { answer: f } = b;
	const prob = problemPoly(b);
	v.push(...forbidden(sample.problem), ...forbidden(sample.answer.kind === 'expression' ? sample.answer.latex : ''));
	if (sample.problem !== problemLatex(b)) v.push('testo diverso dai params');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.latex !== factoredLatex(f) || a.value !== factoredSympy(f) || a.form !== 'factored') v.push('risposta diversa dalla scomposizione');
	if (!samePoly(expandFactored(f), prob)) v.push('la scomposizione non torna al polinomio');
	if (!f.pre.c.isInteger()) v.push('fattore davanti non intero');
	if (f.groups.some((g) => !irreducible(g))) v.push('un fattore non è irriducibile o non è primitivo');
	if (f.groups.some((g) => g[0].c.sign() < 0)) v.push('una parentesi comincia con un segno meno');
	if ((isUnit(f.pre) ? 0 : 1) + f.groups.length < 2) v.push('un solo fattore');
	if (!coefsOk(prob) || (b.poly && !coefsOk(b.poly))) v.push('coefficiente oltre 60');
	if (!CASES[b.level]?.includes(b.case)) v.push(`caso sconosciuto ${b.case}`);
	const M = mcd(prob);
	const first = b.poly ? b.poly[0] : prob[0];
	switch (b.level) {
		case 1:
		case 2:
		case 3: {
			if (!b.poly || f.groups.length !== 1) {
				v.push('serve un polinomio e un solo fattore tra parentesi');
				break;
			}
			if (isUnit(M)) v.push('nessun fattore comune');
			const want = b.level === 3 ? neg(M) : M;
			if (monoKey(f.pre) !== monoKey(want)) v.push('il fattore raccolto non è il MCD (o il suo opposto)');
			if ((first.c.sign() < 0) !== (b.level === 3)) v.push('segno del primo termine sbagliato per il livello');
			if (b.poly.length < 2 || b.poly.length > 3) v.push('servono 2 o 3 termini');
			const nv = polyVars(prob).length;
			if (b.level === 1 && nv !== 1) v.push('al livello 1 una sola lettera');
			if (b.level === 2 && (nv !== 2 || b.poly.length !== 3 || letters(M).length === 0)) v.push('al livello 2 due lettere, tre termini e MCD con lettere');
			if (b.level === 3 && nv > 2) v.push('al livello 3 al massimo due lettere');
			const one = f.groups[0].some((t) => isUnit(t));
			if (b.level === 2 && one !== (b.case === 'uno')) v.push('caso uno/senza uno sbagliato');
			if (b.level === 1) {
				const kase = letters(M).length === 0 ? 'numero' : M.c.isOne() ? 'lettera' : 'numero e lettera';
				if (kase !== b.case) v.push('caso del livello 1 sbagliato');
			}
			if (b.level === 3 && (letters(M).length === 0 ? 'numero' : 'monomio') !== b.case) v.push('caso del livello 3 sbagliato');
			break;
		}
		case 4: {
			if (!b.terms || b.terms.length !== 2 || !isUnit(f.pre) || f.groups.length !== 2) v.push('servono due termini con parentesi e due fattori');
			else {
				const [t1, t2] = b.terms;
				const eq = samePoly(t1.g, t2.g);
				const opp = samePoly(t1.g, pneg(t2.g));
				const kase = t1.k === 2 ? 'quadrato' : eq ? 'uguali' : opp ? 'opposti' : '?';
				if (kase !== b.case) v.push('caso del livello 4 sbagliato');
				if (!samePoly(t1.g, f.groups[0])) v.push('il fattore comune non è la prima parentesi');
			}
			break;
		}
		case 5:
		case 6: {
			if (!b.poly || !b.P || !b.Q || f.groups.length !== 2) {
				v.push('servono P e Q');
				break;
			}
			const n = b.poly.length;
			const want = b.case === 'sei termini' ? 6 : 4;
			if (n !== want) v.push(`servono ${want} termini`);
			if (b.case === 'totale poi parziale') {
				if (letters(M).length !== 0 || M.c.num < 2 || monoKey(f.pre) !== monoKey(M)) v.push('manca il raccoglimento totale di un numero');
			} else if (!isUnit(M) || !isUnit(f.pre)) v.push('non deve esserci un fattore comune a tutti i termini');
			const w = b.poly;
			if (b.level === 5 || b.case === 'totale poi parziale') {
				const inner = b.case === 'totale poi parziale' ? w.map((t) => div(t, M)!) : w;
				if (!pairWorks(inner[0], inner[1], inner[2], inner[3])) v.push('i primi due e gli ultimi due non danno la stessa parentesi');
			}
			if (b.case === 'riordino' && (!isUnit(mcd(w.slice(0, 2))) || pairWorks(w[0], w[1], w[2], w[3]))) v.push('il riordino non serve');
			if (b.level === 5 && (polyVars(prob).length === 1) !== (b.case === 'una lettera')) v.push('caso del livello 5 sbagliato');
			if (first.c.sign() < 0) v.push('primo termine negativo');
			break;
		}
		default:
			v.push(`livello sconosciuto ${b.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

interface Cand {
	latex: string;
	value: string;
	/** Equal to the polynomial but not a complete factorization: allowed as a distractor. */
	incomplete: boolean;
	equal: boolean;
}

function candFactored(f: Factored, target: Poly): Cand | null {
	if (f.groups.some((g) => g.length < 2 || g.some((t) => t.c.isZero()) || !distinctLiterals(g))) return null;
	if (!f.pre.c.isInteger() || f.pre.c.isZero()) return null;
	const equal = samePoly(expandFactored(f), target);
	// an equal option is a distractor only when some bracket still has a common factor
	if (equal && f.groups.every(isPrimitive)) return null;
	return { latex: factoredLatex(f), value: factoredSympy(f), incomplete: equal, equal };
}

/**
 * Rough width in px of a formula at 16 px, from its characters: the answer button has 252 px, and a
 * wider option is written on two lines. Exponents count less, a binary sign more (its spacing).
 */
function estWidth(latex: string): number {
	const s = latex.replace(/\^(\d)/g, '\u00b7').replace(/\s/g, '');
	let w = 0;
	for (const ch of s) w += ch === '\u00b7' ? 6 : ch === '+' || ch === '-' ? 17 : ch === '(' || ch === ')' ? 6 : 9.5;
	return w;
}

const MAX_OPTION_WIDTH = 215;

/** A sum of bracketed terms; on two lines, broken before a sign, when it would not fit the button. */
function candSum(ts: ProdTerm[], target: Poly): Cand {
	const equal = samePoly(expandTerms(ts), target);
	let latex = sumTermsLatex(ts);
	if (estWidth(latex) > MAX_OPTION_WIDTH && ts.length >= 3) {
		const k = Math.ceil(ts.length / 2);
		const line2 = ts
			.slice(k)
			.map((t) => termLatex(t, false))
			.join('')
			.trim();
		latex = `\\begin{gathered}${sumTermsLatex(ts.slice(0, k))} \\\\ ${line2}\\end{gathered}`;
	}
	return { latex, value: sumTermsSympy(ts), incomplete: equal, equal };
}

/** Flip the sign of term t of group j. */
function flip(f: Factored, j: number, t: number): Factored {
	return { pre: f.pre, groups: f.groups.map((g, i) => (i === j ? g.map((m, k) => (k === t ? neg(m) : m)) : g)) };
}

function distractors(b: Built, target: Poly): (Cand | null)[] {
	const f = b.answer;
	const [G0, G1] = f.groups;
	const out: (Cand | null)[] = [];
	const F = (pre: Mono, groups: Poly[]) => candFactored({ pre, groups }, target);
	if (b.level <= 3) {
		const M = f.pre;
		const Q = G0;
		// "Dimenticare l'1"
		const one = Q.findIndex((t) => isUnit(t));
		if (one >= 0 && Q.length > 2) out.push(F(M, [Q.filter((_, i) => i !== one)]));
		// L3: sign changed only on the first term, and the minus lost outside
		if (b.level === 3) {
			out.push(F(M, [Q.map((t, i) => (i === 0 ? t : neg(t)))]));
			out.push(F(neg(M), [Q]));
		}
		// "Raccogliere un fattore troppo piccolo": a letter, then a number, left inside
		const ls = letters(M);
		if (ls.length) {
			const d = mono(1, { [ls[ls.length - 1]]: 1 });
			out.push(F(div(M, d)!, [pscale(Q, d)]));
		}
		if (M.c.abs().num >= 2) {
			let p = 2;
			while (M.c.num % p !== 0) p++;
			out.push(F(mono(M.c.div(q(p)), { ...M.e }), [pscale(Q, mono(p))]));
		}
		// a sign changed inside the bracket
		out.push(F(M, flip(f, 0, Q.length - 1).groups));
		// exponents added instead of subtracted in the first quotient
		if (ls.length) out.push(F(M, [[mul(Q[0], mono(1, { ...M.e })), ...Q.slice(1)]]));
		return out;
	}
	if (b.level === 4) {
		const [, t2] = b.terms!;
		if (b.case === 'opposti') {
			out.push(F(f.pre, [G0, [G1[0], neg(G1[1])]])); // the lesson's error: (a - b)(x + y)
			out.push(F(f.pre, [t2.g, G1]));
			out.push(F(f.pre, [t2.g, [G1[0], neg(G1[1])]]));
		} else if (b.case === 'uguali') {
			out.push(F(f.pre, flip(f, 1, 1).groups));
			out.push(F(f.pre, flip(f, 0, 1).groups));
		} else {
			const k = b.k!;
			const v = letters(G0[0])[0];
			out.push(F(f.pre, [G0, [G0[0], mono(k)]])); // the number of P forgotten
			out.push(F(f.pre, [G0, collect([...G0, mono(-k)])]));
			out.push(F(f.pre, [G0, collect([mono(1, { [v]: 1 }), ...G0.slice(1), mono(k)])]));
		}
		return out;
	}
	const P = b.P!;
	const Q = b.Q!;
	if (b.case === 'totale poi parziale') {
		const g = mono(b.g!);
		out.push(F(mono(1), [P, pscale(Q, g)])); // the lesson's (x - 2)(2x^2 + 6)
		out.push(F(mono(1), [pscale(P, g), Q]));
		out.push(F(g, flip(f, 1, 1).groups));
		out.push(F(g, flip(f, 0, 1).groups));
		return out;
	}
	out.push(candSum(groupTerms(P, Q), target)); // "Fermarsi a metà"
	if (b.case === 'sei termini') out.push(F(f.pre, [P, [Q[0], Q[2]]])); // a term lost
	out.push(F(f.pre, flip(f, 1, Q.length - 1).groups));
	out.push(F(f.pre, flip(f, 0, 1).groups));
	return out;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.level, sample.params)!;
	const target = problemPoly(b);
	const f = b.answer;
	const correct: Cand = { latex: factoredLatex(f), value: factoredSympy(f), incomplete: false, equal: true };
	const options: Cand[] = [correct];
	const seen = new Set([correct.latex]);
	const add = (c: Cand | null) => {
		if (c && options.length < 4 && !seen.has(c.latex) && forbidden(c.latex).length === 0) {
			seen.add(c.latex);
			options.push(c);
		}
	};
	distractors(b, target).forEach(add);
	// fallback: change one coefficient of a bracket (never the first term)
	for (let i = 0; options.length < 4 && i < 200; i++) {
		const j = i % f.groups.length;
		const g = f.groups[j];
		const t = 1 + (Math.floor(i / f.groups.length) % (g.length - 1));
		const round = Math.floor(i / (f.groups.length * (g.length - 1)));
		const delta = round === 0 ? null : (round % 2 ? 1 : -1) * Math.ceil(round / 2);
		const m = g[t];
		const c = delta === null ? m.c.neg() : m.c.add(q(delta));
		if (c.isZero()) continue;
		add(candFactored({ pre: f.pre, groups: f.groups.map((gg, k) => (k === j ? gg.map((mm, s) => (s === t ? mono(c, { ...mm.e }) : mm)) : gg)) }, target));
	}
	if (options.length < 4) throw new Error(`${ID}: not enough distinct options`);
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	const opts: ChoiceOption[] = order.map((i) => ({ latex: options[i].latex, values: [options[i].value] }));
	return { kind: 'choice', options: opts, correct: order.indexOf(0) };
}

export const scomposizioneRaccoglimento: Generator = {
	id: ID,
	title: 'Raccoglimento totale e parziale',
	levels: {
		1: {
			label: 'Raccoglimento totale con un numero o una lettera',
			constraints: ['una sola lettera, 2 o 3 termini, primo termine positivo', 'il MCD è un numero, una potenza della lettera o tutti e due'],
		},
		2: { label: 'MCD monomio con più lettere', constraints: ['due lettere, tre termini', 'circa metà con un quoziente uguale a 1 o -1'] },
		3: { label: 'Raccogliere un segno meno', constraints: ['primo termine negativo: si raccoglie l’opposto del MCD', 'MCD diverso da 1'] },
		4: { label: 'Raccogliere un polinomio', constraints: ['due termini con la stessa parentesi, al quadrato o opposta', 'risposta con due fattori'] },
		5: { label: 'Raccoglimento parziale con quattro termini', constraints: ['i primi due e gli ultimi due danno la stessa parentesi', 'nessun fattore comune a tutti i termini'] },
		6: { label: 'Riordino, sei termini o prima il totale', constraints: ['un terzo per caso', 'risposta con due parentesi, più il numero nel caso totale poi parziale'] },
	},
	generate(rng: Rng, level: number): Sample {
		const cu = rng.next();
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level, cu);
			if (!b) continue;
			const sample = assemble(b, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default scomposizioneRaccoglimento;
