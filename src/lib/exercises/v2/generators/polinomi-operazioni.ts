/**
 * Operazioni tra polinomi. Spec: specs/exercises/polinomi-operazioni.md
 *
 * Seven levels in the order of the lesson, each adding one difficulty: sum of two polynomials,
 * difference (the minus changes the sign of every term), algebraic sum with fractional
 * coefficients, monomial times polynomial, binomial times binomial, polynomial times polynomial
 * (binomial by trinomial, two letters, fractions), polynomial divided by a monomial. The answer
 * is a polynomial, reduced and ordered by decreasing powers of the first letter (lexicographic
 * order on the letters in alphabetical order, as in the lesson's examples).
 *
 * Built backwards where it matters: products with fractions start from nice products, the
 * division starts from the quotient and the divisor.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, lcm, q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	buildChoice,
	div,
	expOf,
	factorLatex,
	forbidden,
	letters,
	literalKey,
	mono,
	monoFromJSON,
	monoJSON,
	monoKey,
	monoLatex,
	mul,
	neg,
	nonZero,
	polyLatex,
	polySympy,
	sumLatex,
	wrap,
} from '../monomi';

export const ID = 'polinomi-operazioni';

type Op = 'sum' | 'diff' | 'monoPoly' | 'polyPoly' | 'div';

interface Built {
	level: number;
	case: string;
	op: Op;
	/** First polynomial; for monoPoly the monomial as a one-term list. */
	left: Mono[];
	/** Second polynomial; for div the divisor as a one-term list. */
	right: Mono[];
}

const OP_OF_LEVEL: Record<number, Op[]> = {
	1: ['sum'],
	2: ['diff'],
	3: ['sum', 'diff'],
	4: ['monoPoly'],
	5: ['polyPoly'],
	6: ['polyPoly'],
	7: ['div'],
};

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials

/** Letters of all the terms, alphabetical. */
function allLetters(terms: Mono[]): string[] {
	return [...new Set(terms.flatMap(letters))].sort();
}

/** Decreasing powers of the first letter, then of the second, and so on. */
function sortPoly(terms: Mono[]): Mono[] {
	const ls = allLetters(terms);
	return [...terms].sort((a, b) => {
		for (const v of ls) {
			const d = expOf(b, v) - expOf(a, v);
			if (d !== 0) return d;
		}
		return 0;
	});
}

/**
 * Similar terms summed, zero terms dropped. Written here because `collect` of monomi.ts turns a
 * cancelled pair into the zero monomial, which has no letters, and then adds the constants to it.
 */
function collect(terms: Mono[]): Mono[] {
	const sums = new Map<string, Mono>();
	for (const t of terms) {
		const k = literalKey(t.e);
		const prev = sums.get(k);
		sums.set(k, prev ? { c: prev.c.add(t.c), e: prev.e } : t);
	}
	return [...sums.values()].filter((t) => !t.c.isZero()).map((t) => mono(t.c, { ...t.e }));
}

const norm = (terms: Mono[]): Mono[] => sortPoly(collect(terms));
const pl = (terms: Mono[]): string => polyLatex(norm(terms));
const totalDeg = (m: Mono): number => Object.values(m.e).reduce((s, n) => s + n, 0);
const polyDeg = (terms: Mono[]): number => Math.max(...terms.map(totalDeg));

function opt(terms: Mono[]): Opt {
	const t = norm(terms);
	return { latex: polyLatex(t), value: polySympy(t), key: t.map(monoKey).sort().join('+') || '0' };
}

/** Every term of a times every term of b, in the order of the lesson (first term of a first). */
function products(a: Mono[], b: Mono[]): Mono[] {
	return a.flatMap((x) => b.map((y) => mul(x, y)));
}

function result(b: Built): Mono[] {
	switch (b.op) {
		case 'sum':
			return norm([...b.left, ...b.right]);
		case 'diff':
			return norm([...b.left, ...b.right.map(neg)]);
		case 'monoPoly':
			return norm(products(b.left, b.right));
		case 'polyPoly':
			return norm(products(b.left, b.right));
		case 'div': {
			const out = b.left.map((t) => div(t, b.right[0]));
			if (out.some((t) => !t)) throw new Error(`${ID}: the polynomial is not divisible by the monomial`);
			return norm(out as Mono[]);
		}
	}
}

// ---------------------------------------------------------------------------
// LaTeX

/**
 * Rough width in pixels of a one-line formula in KaTeX display at 18 px: digits about 9 px, letters
 * 10 px, exponents 6.5 px, a binary + or - with its spaces 22 px, brackets 7 px; a fraction is as wide
 * as its longer line. Only used to decide when to break the problem over two lines.
 */
export function estimateWidth(latex: string): number {
	let s = latex.replace(/\\(left|right)/g, '').replace(/\\,/g, '');
	let w = 0;
	s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, n: string, d: string) => {
		w += Math.max(n.length, d.length) * 9 + 5;
		return '';
	});
	s = s.replace(/\^(\d|\{\d+\})/g, (m) => {
		w += (m.length > 2 ? m.length - 3 : 1) * 6.5;
		return '';
	});
	s = s.replace(/ [+-] /g, () => {
		w += 22;
		return '';
	});
	for (const ch of s) {
		if (/\d/.test(ch)) w += 9;
		else if (/[a-z]/.test(ch)) w += 10;
		else if (/[()]/.test(ch)) w += 7;
		else if (ch === ':' || ch === '-' || ch === '+') w += 14;
	}
	return w;
}

/** Problems wider than this (estimated) go on two lines; the phone column is about 350 px. */
const MAX_ONE_LINE = 270;

/** The problem on one line, as used in the steps and in the solution. */
function problemLatex(b: Built): string {
	const L = pl(b.left);
	const R = pl(b.right);
	switch (b.op) {
		case 'sum':
			return `${wrap(L)} + ${wrap(R)}`;
		case 'diff':
			return `${wrap(L)} - ${wrap(R)}`;
		case 'monoPoly': {
			const w = wrap(R);
			return `${monoLatex(b.left[0])}${w.startsWith('\\left') ? '' : '\\,'}${w}`;
		}
		case 'polyPoly':
			return `${wrap(L)}${wrap(R)}`;
		case 'div':
			return `${wrap(L)} : ${wrap(monoLatex(b.right[0]))}`;
	}
}

/**
 * The problem as shown: a sum, difference or quotient too wide for a phone is broken before the
 * operator between the two brackets, the second line starting with \quad and the operator.
 */
function displayLatex(b: Built): string {
	const one = problemLatex(b);
	if (estimateWidth(one) <= MAX_ONE_LINE) return one;
	if (b.op === 'div') return `\\begin{aligned} &${wrap(pl(b.left))} \\\\ &\\quad : ${wrap(monoLatex(b.right[0]))} \\end{aligned}`;
	if (b.op !== 'sum' && b.op !== 'diff') return one;
	const op = b.op === 'sum' ? '+' : '-';
	return `\\begin{aligned} &${wrap(pl(b.left))} \\\\ &\\quad ${op} ${wrap(pl(b.right))} \\end{aligned}`;
}

/** "\frac{9}{12}x - \frac{32}{12}x": a sum of similar terms over the common denominator L, not reduced. */
function overDenLatex(terms: Mono[], L: number): string {
	const lit = monoLatex(mono(1, { ...terms[0].e }));
	const litPart = lit === '1' ? '' : lit;
	return terms
		.map((t, i) => {
			const n = (t.c.num * L) / t.c.den;
			const body = `\\frac{${Math.abs(n)}}{${L}}${litPart}`;
			if (i === 0) return (n < 0 ? '-' : '') + body;
			return n < 0 ? ` - ${body}` : ` + ${body}`;
		})
		.join('');
}

/** "-8x^2 - 3x^2 = -11x^2" for each group of similar terms with more than one member, in the order of the result. */
function reductionParts(raw: Mono[]): string[] {
	const groups: Mono[][] = [];
	for (const t of raw) {
		const g = groups.find((gr) => literalKey(gr[0].e) === literalKey(t.e));
		if (g) g.push(t);
		else groups.push([t]);
	}
	const order = sortPoly(groups.map((g) => g[0]));
	return order
		.map((head) => groups.find((g) => g[0] === head)!)
		.filter((g) => g.length > 1)
		.map((g) => {
			const s = collect(g);
			const r = s.length ? monoLatex(s[0]) : '0';
			if (g.every((t) => t.c.isInteger())) return `${sumLatex(g)} = ${r}`;
			const L = g.reduce((acc, t) => lcm(acc, t.c.den), 1);
			if (g.every((t) => t.c.den === L)) return `${sumLatex(g)} = ${r}`;
			return `${sumLatex(g)} = ${overDenLatex(g, L)} = ${r}`;
		});
}

function hasCancelled(raw: Mono[]): boolean {
	const keys = new Set(raw.map((t) => literalKey(t.e)));
	return collect(raw).length < keys.size;
}

const PROMPTS: Record<Op, string> = {
	sum: 'Calcola la somma algebrica dei polinomi.',
	diff: 'Calcola la somma algebrica dei polinomi.',
	monoPoly: 'Calcola il prodotto.',
	polyPoly: 'Calcola il prodotto.',
	div: 'Calcola il quoziente.',
};

function orderNote(res: Mono[]): string {
	const ls = allLetters(res);
	return ls.length > 1 ? `\\text{Il risultato è ordinato secondo le potenze decrescenti di } ${ls[0]}` : '';
}

function steps(b: Built, res: Mono[]): string[] {
	const out: string[] = [];
	const problem = problemLatex(b);
	const R = polyLatex(res);
	switch (b.op) {
		case 'sum':
		case 'diff': {
			const right = b.op === 'sum' ? norm(b.right) : norm(b.right).map(neg);
			const raw = [...norm(b.left), ...right];
			const opened = sumLatex(raw);
			out.push(
				b.op === 'sum'
					? `\\text{Il + davanti alla seconda parentesi non cambia niente: } ${problem} = ${opened}`
					: `\\text{Il - davanti alla seconda parentesi cambia il segno a tutti i suoi termini: } ${problem} = ${opened}`,
			);
			const parts = reductionParts(raw);
			out.push(`\\text{Riduci i termini simili: } ${parts.join(' \\qquad ')}`);
			if (hasCancelled(raw)) out.push('\\text{I termini opposti si annullano e non compaiono nel risultato}');
			out.push(`\\text{Il risultato: } ${opened} = ${R}`);
			break;
		}
		case 'monoPoly': {
			const M = b.left[0];
			const P = norm(b.right);
			const parts = P.map((t) => `${factorLatex(M, true)}\\cdot${factorLatex(t, true)} = ${monoLatex(mul(M, t))}`);
			out.push(`\\text{Moltiplica il monomio per ogni termine del polinomio, con il suo segno: } ${parts.join(' \\qquad ')}`);
			out.push(`\\text{Somma i prodotti: } ${problem} = ${R}`);
			if (M.c.sign() < 0) out.push('\\text{Il monomio è negativo: ogni termine ha il segno opposto a quello che aveva nel polinomio}');
			break;
		}
		case 'polyPoly': {
			const A = norm(b.left);
			const B = norm(b.right);
			const raw = products(A, B);
			out.push(`\\text{I prodotti sono } ${A.length} \\cdot ${B.length} = ${A.length * B.length}`);
			if (A.length === 2 && B.length === 2 && raw.every((t) => t.c.isInteger()) && allLetters(raw).length === 1) {
				// Example 6 and the warning on signs: every product written out, negative factors in brackets
				const expl = A.flatMap((x) => B.map((y) => `${factorLatex(x)}\\cdot ${factorLatex(y)}`)).join(' + ');
				out.push(`\\text{Ogni termine del primo polinomio per ogni termine del secondo: } ${problem} = ${expl} = ${sumLatex(raw)}`);
			} else {
				out.push(`\\text{Ogni termine del primo polinomio per ogni termine del secondo: } ${problem} = ${sumLatex(raw)}`);
			}
			const parts = reductionParts(raw);
			if (parts.length) out.push(`\\text{Riduci i termini simili: } ${parts.join(' \\qquad ')}`);
			out.push(`\\text{Il risultato: } ${sumLatex(raw)} = ${R}`);
			const note = orderNote(res);
			if (note) out.push(note);
			break;
		}
		case 'div': {
			const M = b.right[0];
			const P = norm(b.left);
			if (!M.c.isInteger()) {
				out.push(`\\text{Dividere per } ${M.c.toLatex()} \\text{ vuol dire moltiplicare per } ${q(1).div(M.c).toLatex()}`);
			} else if (M.c.sign() < 0) {
				out.push(`\\text{Il divisore è negativo: ogni quoziente ha il segno opposto a quello del suo termine}`);
			}
			const Ml = factorLatex(M);
			const parts = P.map((t) => `${monoLatex(t)} : ${Ml} = ${monoLatex(div(t, M)!)}`);
			out.push(`\\text{Dividi ogni termine per il monomio: } ${parts.join(' \\qquad ')}`);
			out.push(`\\text{Somma i quozienti: } ${problem} = ${R}`);
			const dp = polyDeg(P);
			const dm = totalDeg(M);
			out.push(`\\text{Il polinomio ha grado } ${dp}\\text{, il monomio } ${dm}\\text{: il quoziente ha grado } ${dp} - ${dm} = ${dp - dm}`);
			break;
		}
	}
	return out;
}

// ---------------------------------------------------------------------------
// Random pieces

const intC = (rng: Rng, max: number): Rational => q(nonZero(rng, -max, max));

/** Letters of an exercise: x or a with one letter, (x, y) or (a, b) with two. */
function pickVars(rng: Rng, k: 1 | 2): string[] {
	const fam = rng.pick(FAMILIES);
	return fam.slice(0, k);
}

/** A term of one letter of degree d. */
const term1 = (c: Rational, v: string, d: number): Mono => mono(c, d > 0 ? { [v]: d } : {});
const term2 = (c: Rational, vs: string[], i: number, j: number): Mono => mono(c, { [vs[0]]: i, [vs[1]]: j });

/** k distinct degrees from `ds`, decreasing. */
function pickDegrees(rng: Rng, ds: number[], k: number): number[] {
	const pool = [...ds];
	const out: number[] = [];
	while (out.length < k) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
	return out.sort((a, b) => b - a);
}

/** Leading coefficient positive most of the time, as in the lesson. */
function leadCoef(rng: Rng, max: number): Rational {
	return q(rng.next() < 0.8 ? rng.int(1, max) : -rng.int(1, max));
}

/** A nice fraction or small integer: denominators 2, 3, 4, 6. */
function niceCoef(rng: Rng, fracShare: number): Rational {
	if (rng.next() < fracShare) {
		for (;;) {
			const r = q(nonZero(rng, -5, 5), rng.pick([2, 3, 4, 6]));
			if (!r.isInteger()) return r;
		}
	}
	return intC(rng, 4);
}

/** Literal parts in two letters with total degree 1 to 3: [i, j] exponents. */
const TWO_LETTER_PARTS: [number, number][] = [
	[3, 0],
	[2, 1],
	[1, 2],
	[0, 3],
	[2, 0],
	[1, 1],
	[0, 2],
	[1, 0],
	[0, 1],
];

function samePart(a: Mono, b: Mono): boolean {
	return literalKey(a.e) === literalKey(b.e);
}

function commonParts(a: Mono[], b: Mono[]): number {
	return a.filter((x) => b.some((y) => samePart(x, y))).length;
}

// ---------------------------------------------------------------------------
// Construction

/** Two polynomials in one letter with at least two pairs of similar terms. */
function oneLetterPair(rng: Rng, coef: (rng: Rng, lead: boolean) => Rational): [Mono[], Mono[]] | null {
	const v = pickVars(rng, 1)[0];
	const deg = rng.pick([2, 2, 2, 3]);
	const ds = Array.from({ length: deg + 1 }, (_, i) => i);
	const kA = deg === 2 ? 3 : rng.pick([3, 3, 4]);
	const dA = pickDegrees(rng, ds, kA);
	if (dA[0] !== deg) return null;
	const kB = rng.pick([2, 3, 3]);
	const dB = pickDegrees(rng, ds, kB);
	const A = dA.map((d, i) => term1(coef(rng, i === 0), v, d));
	const B = dB.map((d, i) => term1(coef(rng, i === 0), v, d));
	return [A, B];
}

function twoLetterPoly(rng: Rng, vs: string[], parts: [number, number][], coef: (rng: Rng, lead: boolean) => Rational): Mono[] {
	return sortPoly(parts.map(([i, j], k) => term2(coef(rng, k === 0), vs, i, j)));
}

/** The case of a level, drawn once per exercise so that rejected draws do not change the shares. */
function pickCase(rng: Rng, level: number): string {
	const u = rng.next();
	switch (level) {
		case 2:
			return u < 0.5 ? 'un termine si annulla' : 'nessun termine si annulla';
		case 3:
			return u < 0.6 ? 'differenza' : 'somma';
		case 4:
			return u < 0.3 ? 'coefficienti frazionari' : u < 0.65 ? 'monomio negativo' : 'monomio positivo';
		case 6:
			return u < 0.4 ? 'binomio per trinomio' : u < 0.7 ? 'due lettere' : 'coefficienti frazionari';
		case 7:
			return u < 0.3 ? 'divisore frazionario' : u < 0.65 ? 'un termine diventa 1' : 'divisore intero';
		default:
			return '';
	}
}

function build(rng: Rng, level: number, want: string): Built | null {
	switch (level) {
		case 1: {
			const pair = oneLetterPair(rng, (r, lead) => (lead ? leadCoef(r, 6) : intC(r, 9)));
			if (!pair) return null;
			const [A, B] = pair;
			return { level, case: 'somma', op: 'sum', left: A, right: B };
		}
		case 2: {
			const cancel = want === 'un termine si annulla';
			let A: Mono[];
			let B: Mono[];
			const coef = (r: Rng, lead: boolean) => (lead ? leadCoef(r, 6) : intC(r, 9));
			if (rng.next() < 0.6) {
				const pair = oneLetterPair(rng, coef);
				if (!pair) return null;
				[A, B] = pair;
			} else {
				const vs = pickVars(rng, 2);
				const pA = pickDegrees(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8], 3).map((i) => TWO_LETTER_PARTS[i]);
				const shared = pickDegrees(rng, [0, 1, 2], rng.pick([2, 3])).map((i) => pA[i]);
				const extra = TWO_LETTER_PARTS.filter((p) => !pA.includes(p));
				const pB = shared.length === 3 ? shared : [...shared, rng.pick(extra)];
				A = twoLetterPoly(rng, vs, pA, coef);
				B = twoLetterPoly(rng, vs, pB, coef);
			}
			// make one pair cancel (A_i - B_j = 0) or none
			const common = sortPoly(A).filter((x) => B.some((y) => samePart(x, y)));
			if (cancel) {
				const x = rng.pick(common);
				B = B.map((y) => (samePart(x, y) ? mono(x.c, { ...y.e }) : y));
			}
			const cancelled = common.some((x) => B.some((y) => samePart(x, y) && x.c.equals(y.c)));
			if (cancelled !== cancel) return null;
			return { level, case: cancel ? 'un termine si annulla' : 'nessun termine si annulla', op: 'diff', left: A, right: B };
		}
		case 3: {
			const op: Op = want === 'differenza' ? 'diff' : 'sum';
			const coef = (r: Rng) => niceCoef(r, 0.7);
			let A: Mono[];
			let B: Mono[];
			if (rng.next() < 0.5) {
				const v = pickVars(rng, 1)[0];
				A = pickDegrees(rng, [0, 1, 2], rng.pick([2, 3])).map((d) => term1(coef(rng), v, d));
				B = pickDegrees(rng, [0, 1, 2], rng.pick([2, 3])).map((d) => term1(coef(rng), v, d));
			} else {
				const vs = pickVars(rng, 2);
				const homog: [number, number][] = [
					[2, 0],
					[1, 1],
					[0, 2],
				];
				A = twoLetterPoly(rng, vs, pickDegrees(rng, [0, 1, 2], rng.pick([2, 3])).map((i) => homog[i]), coef);
				B = twoLetterPoly(rng, vs, pickDegrees(rng, [0, 1, 2], rng.pick([2, 3])).map((i) => homog[i]), coef);
			}
			if (commonParts(A, B) < 2) return null;
			// at least one pair of similar terms with two fractions over different denominators
			const good = A.some((x) => B.some((y) => samePart(x, y) && !x.c.isInteger() && !y.c.isInteger() && x.c.den !== y.c.den));
			if (!good) return null;
			return { level, case: op === 'diff' ? 'differenza' : 'somma', op, left: A, right: B };
		}
		case 4: {
			const two = rng.next() < 0.5;
			const vs = pickVars(rng, two ? 2 : 1);
			const eM: Record<string, number> = {};
			for (const v of vs) eM[v] = rng.int(two ? 0 : 1, 2);
			if (Object.values(eM).every((n) => n === 0)) return null;
			const k = rng.pick([2, 3, 3]);
			let parts: Record<string, number>[];
			if (two) {
				parts = pickDegrees(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8], k).map((i) => ({ [vs[0]]: TWO_LETTER_PARTS[i][0], [vs[1]]: TWO_LETTER_PARTS[i][1] }));
			} else {
				parts = pickDegrees(rng, [0, 1, 2, 3], k).map((d) => ({ [vs[0]]: d }));
			}
			if (want === 'coefficienti frazionari') {
				// fractional: choose the products first, then divide by the monomial's coefficient
				const c = q(rng.pick([1, 2, 3, 4, 5]) * (rng.int(0, 1) ? 1 : -1), rng.pick([2, 3, 4]));
				if (c.isInteger()) return null;
				const P: Mono[] = [];
				for (const e of parts) {
					const target = niceCoef(rng, 0.4);
					const pc = target.div(c);
					if (Math.abs(pc.num) > 12 || pc.den > 6) return null;
					P.push(mono(pc, e));
				}
				if (P.every((t) => t.c.isInteger())) return null;
				return { level, case: 'coefficienti frazionari', op: 'monoPoly', left: [mono(c, eM)], right: sortPoly(P) };
			}
			const negM = want === 'monomio negativo';
			const c = q((negM ? -1 : 1) * rng.int(2, 6));
			const P = parts.map((e, i) => mono(i === 0 ? leadCoef(rng, 6) : intC(rng, 9), e));
			return { level, case: negM ? 'monomio negativo' : 'monomio positivo', op: 'monoPoly', left: [mono(c, eM)], right: sortPoly(P) };
		}
		case 5: {
			const v = pickVars(rng, 1)[0];
			const a = rng.pick([1, 1, 1, 2, 3]);
			const c = rng.pick([1, 1, 1, 2, 3]);
			const b = nonZero(rng, -9, 9);
			const d = nonZero(rng, -9, 9);
			if (a === c && Math.abs(b) === Math.abs(d)) return null; // square or conjugates: prodotti notevoli
			if (a * d + b * c === 0) return null;
			const A = [term1(q(a), v, 1), term1(q(b), v, 0)];
			const B = [term1(q(c), v, 1), term1(q(d), v, 0)];
			const kase = b < 0 && d < 0 ? 'due termini noti negativi' : b > 0 && d > 0 ? 'due termini noti positivi' : 'termini noti discordi';
			return { level, case: kase, op: 'polyPoly', left: A, right: B };
		}
		case 6: {
			let A: Mono[];
			let B: Mono[];
			let kase: string;
			if (want === 'binomio per trinomio') {
				const v = pickVars(rng, 1)[0];
				A = [term1(q(rng.pick([1, 1, 2, 3])), v, 1), term1(intC(rng, 5), v, 0)];
				B = [term1(leadCoef(rng, 3), v, 2), term1(intC(rng, 6), v, 1), term1(intC(rng, 6), v, 0)];
				kase = 'binomio per trinomio';
			} else if (want === 'due lettere') {
				const vs = pickVars(rng, 2);
				const small = (r: Rng, lead: boolean) => (lead ? leadCoef(r, 3) : intC(r, 4));
				A = twoLetterPoly(rng, vs, [[1, 0], [0, 1]], small);
				if (rng.next() < 0.5) {
					B = twoLetterPoly(rng, vs, [[1, 0], [0, 1]], small);
					const [p, s] = A.map((t) => t.c);
					const [r2, t2] = B.map((t) => t.c);
					if (p.abs().equals(r2.abs()) && s.abs().equals(t2.abs())) return null; // square or conjugates, up to the sign
				} else {
					B = twoLetterPoly(
						rng,
						vs,
						[
							[2, 0],
							[1, 1],
							[0, 2],
						],
						(r, lead) => (lead ? leadCoef(r, 3) : intC(r, 3)),
					);
				}
				kase = 'due lettere';
			} else {
				const v = pickVars(rng, 1)[0];
				const fc = (r: Rng) => {
					if (r.next() < 0.6) {
						for (;;) {
							const x = q(r.int(1, 5) * (r.next() < 0.3 ? -1 : 1), r.pick([2, 3, 4]));
							if (!x.isInteger()) return x;
						}
					}
					return intC(r, 4);
				};
				const a = fc(rng);
				const cc = fc(rng);
				if (a.sign() < 0 || cc.sign() < 0) return null; // leading coefficients positive
				A = [term1(a, v, 1), term1(fc(rng), v, 0)];
				B = [term1(cc, v, 1), term1(fc(rng), v, 0)];
				const nFrac = [...A, ...B].filter((t) => !t.c.isInteger()).length;
				if (nFrac < 2) return null;
				if (A[0].c.abs().equals(B[0].c.abs()) && A[1].c.abs().equals(B[1].c.abs())) return null;
				kase = 'coefficienti frazionari';
			}
			// the polynomial with more terms first, sometimes (example 8)
			if (B.length > A.length && rng.next() < 0.3) [A, B] = [B, A];
			return { level, case: kase, op: 'polyPoly', left: A, right: B };
		}
		case 7: {
			const two = rng.next() < 0.7;
			const vs = pickVars(rng, two ? 2 : 1);
			const eM: Record<string, number> = {};
			for (const v of vs) eM[v] = rng.int(1, 2);
			if (two && rng.next() < 0.25) eM[rng.pick(vs)] = 0;
			let c: Rational;
			let kase: string;
			const k = rng.pick([2, 3, 3]);
			let wantUnit = false;
			if (want === 'divisore frazionario') {
				c = q(rng.int(1, 5) * (rng.next() < 0.6 ? -1 : 1), rng.pick([2, 3, 4]));
				if (c.isInteger()) return null;
				kase = 'divisore frazionario';
			} else {
				c = q(rng.int(2, 6) * (rng.next() < 0.35 ? -1 : 1));
				wantUnit = want === 'un termine diventa 1';
				kase = wantUnit ? 'un termine diventa 1' : 'divisore intero';
			}
			const M = mono(c, eM);
			// the quotient: k distinct literal parts, exponents 0..2
			const Q: Mono[] = [];
			const seen = new Set<string>();
			if (wantUnit) {
				Q.push(mono(rng.next() < 0.75 ? 1 : -1, {}));
				seen.add('');
			}
			for (let tries = 0; Q.length < k && tries < 50; tries++) {
				const e: Record<string, number> = {};
				for (const v of vs) e[v] = rng.int(0, 2);
				const key = literalKey(mono(1, e).e);
				if (seen.has(key) || key === '') continue;
				seen.add(key);
				Q.push(mono(intC(rng, 5), e));
			}
			if (Q.length < k) return null;
			const Qs = sortPoly(Q);
			if (Qs[0].c.sign() < 0 && rng.next() < 0.7) return null; // leading term of the dividend mostly positive
			const P = sortPoly(Qs.map((t) => mul(t, M)));
			return { level, case: kase, op: 'div', left: P, right: [M] };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

/** Two binomials with the same terms up to the signs: a square or a sum times a difference. */
function notable(b: Built): boolean {
	const A = norm(b.left);
	const B = norm(b.right);
	return A.length === 2 && B.length === 2 && A.every((x, i) => samePart(x, B[i]) && x.c.abs().equals(B[i].c.abs()));
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.level, sample.params);
	if (!b) return ['params non validi'];
	let res: Mono[];
	try {
		res = result(b);
	} catch (e) {
		return [(e as Error).message];
	}
	const problem = displayLatex(b);
	if (problem !== sample.problem) v.push('problema diverso dai params');
	v.push(...forbidden(sample.problem));
	const a = sample.answer;
	const R = polyLatex(res);
	if (a.kind !== 'expression' || a.value !== polySympy(res) || a.latex !== R || a.form !== 'expanded') v.push('risposta diversa dal risultato');
	v.push(...forbidden(R).map((s) => `risposta: ${s}`));
	if (!OP_OF_LEVEL[b.level]?.includes(b.op)) v.push(`operazione ${b.op} fuori dal livello ${b.level}`);
	if (sample.prompt !== PROMPTS[b.op]) v.push('consegna sbagliata');
	const inputs = [...b.left, ...b.right];
	for (const m of inputs) {
		if (m.c.isZero()) v.push('termine nullo nel testo');
		if (Math.abs(m.c.num) > 60 || m.c.den > 12) v.push(`coefficiente del testo fuori intervallo: ${m.c}`);
	}
	for (const m of res) if (Math.abs(m.c.num) > 100 || m.c.den > 12) v.push(`coefficiente del risultato fuori intervallo: ${m.c}`);
	if (Math.max(0, ...[...inputs, ...res].flatMap((m) => Object.values(m.e))) > 8) v.push('esponente troppo grande');
	if (res.length < 2) v.push('il risultato deve avere almeno due termini');
	const nL = collect(b.left).length;
	const nR = collect(b.right).length;
	if (nL !== b.left.length || nR !== b.right.length) v.push('un polinomio del testo non è ridotto');
	const oneLetter = allLetters(inputs).length === 1;
	const integers = inputs.every((m) => m.c.isInteger());
	switch (b.level) {
		case 1:
			if (!oneLetter || !integers || commonParts(b.left, b.right) < 2) v.push('livello 1: due polinomi in una lettera, interi, almeno due coppie di termini simili');
			break;
		case 2: {
			if (!integers || nR < 2) v.push('livello 2: coefficienti interi, almeno due termini sottratti');
			const cancel = b.left.some((x) => b.right.some((y) => samePart(x, y) && x.c.equals(y.c)));
			if ((b.case === 'un termine si annulla') !== cancel) v.push('case non coerente');
			break;
		}
		case 3: {
			const good = b.left.some((x) => b.right.some((y) => samePart(x, y) && !x.c.isInteger() && !y.c.isInteger() && x.c.den !== y.c.den));
			if (!good || commonParts(b.left, b.right) < 2) v.push('livello 3: almeno due coppie simili, una con frazioni di denominatore diverso');
			if ((b.case === 'differenza') !== (b.op === 'diff')) v.push('case non coerente');
			break;
		}
		case 4: {
			const M = b.left[0];
			if (b.left.length !== 1 || nR < 2 || nR > 3 || M.c.abs().isOne() || letters(M).length === 0) v.push('livello 4: un monomio con lettere e coefficiente diverso da 1 per un polinomio di 2 o 3 termini');
			const kase = !integers ? 'coefficienti frazionari' : M.c.sign() < 0 ? 'monomio negativo' : 'monomio positivo';
			if (kase !== b.case) v.push('case non coerente');
			break;
		}
		case 5:
			if (nL !== 2 || nR !== 2 || !oneLetter || !integers || res.length !== 3) v.push('livello 5: due binomi in una lettera, interi, risultato di tre termini');
			if (notable(b)) v.push('livello 5: prodotto notevole');
			break;
		case 6: {
			if (res.length < 3) v.push('livello 6: il risultato ha almeno tre termini');
			const two = allLetters(inputs).length === 2;
			const kase = two ? 'due lettere' : !integers ? 'coefficienti frazionari' : 'binomio per trinomio';
			if (kase !== b.case) v.push('case non coerente');
			if (kase === 'binomio per trinomio' && [nL, nR].sort().join() !== '2,3') v.push('livello 6: binomio per trinomio');
			if (kase === 'coefficienti frazionari' && (nL !== 2 || nR !== 2)) v.push('livello 6: due binomi con frazioni');
			if (notable(b)) v.push('livello 6: prodotto notevole');
			break;
		}
		case 7: {
			const M = b.right[0];
			if (b.right.length !== 1 || nL < 2 || M.c.abs().isOne() || letters(M).length === 0) v.push('livello 7: un polinomio diviso per un monomio con lettere e coefficiente diverso da 1');
			const unit = res.some((t) => letters(t).length === 0 && t.c.abs().isOne());
			const kase = !M.c.isInteger() ? 'divisore frazionario' : unit ? 'un termine diventa 1' : 'divisore intero';
			if (kase !== b.case) v.push('case non coerente');
			break;
		}
		default:
			v.push(`livello sconosciuto ${b.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Sample and serialisation

function assemble(b: Built, seed: number): Sample {
	const res = result(b);
	const R = polyLatex(res);
	const problem = problemLatex(b);
	return {
		generatorId: ID,
		level: b.level,
		seed,
		prompt: PROMPTS[b.op],
		problem: displayLatex(b),
		solution: `${problem} = ${R}`,
		steps: steps(b, res),
		answer: { kind: 'expression', value: polySympy(res), latex: R, form: 'expanded' },
		params: {
			case: b.case,
			op: b.op,
			left: b.left.map(monoJSON),
			right: b.right.map(monoJSON),
			result: res.map(monoJSON),
		},
	};
}

function parseBuilt(level: number, p: Record<string, unknown>): Built | null {
	if (!Array.isArray(p.left) || !Array.isArray(p.right) || typeof p.op !== 'string') return null;
	const left = p.left.map(monoFromJSON);
	const right = p.right.map(monoFromJSON);
	if (left.some((m) => !m) || right.some((m) => !m) || !left.length || !right.length) return null;
	if (!['sum', 'diff', 'monoPoly', 'polyPoly', 'div'].includes(p.op)) return null;
	return { level, case: String(p.case), op: p.op as Op, left: left as Mono[], right: right as Mono[] };
}

// ---------------------------------------------------------------------------
// Multiple choice: distractors from the mistakes the lesson names

/** Coefficient of each pair of similar terms computed with the wrong sign: -5x + 4x = -9x. */
function signSlip(raw: Mono[]): Mono[] | null {
	const groups = new Map<string, Mono[]>();
	for (const t of raw) groups.set(literalKey(t.e), [...(groups.get(literalKey(t.e)) ?? []), t]);
	for (const g of groups.values()) {
		if (g.length === 2 && g[0].c.sign() !== g[1].c.sign()) {
			const wrong = q(g[0].c.sign()).mul(g[0].c.abs().add(g[1].c.abs()));
			return raw.filter((t) => !g.includes(t)).concat(mono(wrong, { ...g[0].e }));
		}
	}
	return null;
}

/** Exponents of a pair of similar terms added as in a product: 3x^2 + x^2 = 4x^4. */
function exponentsAdded(raw: Mono[]): Mono[] | null {
	const groups = new Map<string, Mono[]>();
	for (const t of raw) groups.set(literalKey(t.e), [...(groups.get(literalKey(t.e)) ?? []), t]);
	for (const g of groups.values()) {
		if (g.length === 2 && letters(g[0]).length > 0) {
			const s = g[0].c.add(g[1].c);
			if (s.isZero()) continue;
			const e = Object.fromEntries(letters(g[0]).map((v) => [v, 2 * g[0].e[v]]));
			return raw.filter((t) => !g.includes(t)).concat(mono(s, e));
		}
	}
	return null;
}

/** Numerators and denominators added: 1/2 - 3/4 = -2/6. */
function fractionsAdded(raw: Mono[]): Mono[] | null {
	const groups = new Map<string, Mono[]>();
	for (const t of raw) groups.set(literalKey(t.e), [...(groups.get(literalKey(t.e)) ?? []), t]);
	for (const g of groups.values()) {
		if (g.length === 2 && g.some((t) => !t.c.isInteger())) {
			const n = g[0].c.num + g[1].c.num;
			const d = g[0].c.den + g[1].c.den;
			if (n === 0) continue;
			return raw.filter((t) => !g.includes(t)).concat(mono(q(n, d), { ...g[0].e }));
		}
	}
	return null;
}

function mistakes(b: Built, res: Mono[]): (Opt | null)[] {
	const out: (Opt | null)[] = [];
	const o = (t: Mono[] | null) => (t && collect(t).length ? opt(t) : null);
	const A = norm(b.left);
	const B = norm(b.right);
	switch (b.op) {
		case 'sum':
		case 'diff': {
			const right = b.op === 'sum' ? B : B.map(neg);
			const raw = [...A, ...right];
			if (b.op === 'diff') {
				out.push(o([...A, neg(B[0]), ...B.slice(1)])); // sign changed only on the first term
				out.push(o([...A, ...B.slice(0, -1).map(neg), B[B.length - 1]])); // the last term forgotten
				out.push(o([...A, ...B])); // no sign changed
			}
			if (b.level === 3) out.push(o(fractionsAdded(raw)));
			out.push(o(signSlip(raw)));
			out.push(o(exponentsAdded(raw)));
			if (b.op === 'sum') {
				// a term that has no similar term forgotten
				const lone = raw.find((t) => raw.filter((s) => samePart(s, t)).length === 1);
				if (lone) out.push(o(raw.filter((t) => t !== lone)));
				out.push(o([...A, ...B.map(neg)]));
			}
			out.push(o(res.map((t, i) => (i === res.length - 1 ? neg(t) : t))));
			return out;
		}
		case 'monoPoly': {
			const M = A[0];
			out.push(o([mul(M, B[0]), ...B.slice(1)])); // only the first term multiplied
			const expMul = B.map((t) => {
				const e: Record<string, number> = {};
				for (const v of allLetters([M, t])) e[v] = expOf(M, v) > 0 && expOf(t, v) > 0 ? expOf(M, v) * expOf(t, v) : expOf(M, v) + expOf(t, v);
				return mono(M.c.mul(t.c), e);
			});
			out.push(o(expMul)); // exponents multiplied
			if (M.c.sign() < 0) out.push(o(B.map((t, i) => (i === 0 ? mul(M, t) : mul(neg(M), t))))); // the minus only on the first product
			const constant = B.find((t) => letters(t).length === 0);
			if (constant) out.push(o(B.map((t) => (t === constant ? mono(M.c.mul(t.c), {}) : mul(M, t))))); // the constant times the coefficient only
			out.push(o(res.map(neg)));
			return out;
		}
		case 'polyPoly': {
			const raw = products(A, B);
			if (A.length === 2 && B.length === 2) {
				out.push(o([raw[0], raw[3]])); // only first and last terms
				out.push(o([raw[0], raw[1], raw[2], neg(raw[3])])); // sign of the last product
				out.push(o([raw[0], raw[1], raw[3]])); // a cross product forgotten
				out.push(o([raw[0], neg(raw[1]), neg(raw[2]), raw[3]])); // cross products with the wrong sign
			} else {
				const negPair = raw.findIndex((_, i) => {
					const x = A[Math.floor(i / B.length)];
					const y = B[i % B.length];
					return x.c.sign() < 0 && y.c.sign() < 0;
				});
				if (negPair >= 0) out.push(o(raw.map((t, i) => (i === negPair ? neg(t) : t)))); // (-3)(-4) taken as -12
				out.push(o(raw.filter((_, i) => i !== B.length))); // a product of the second term forgotten
				out.push(o(raw.filter((_, i) => i !== raw.length - 1))); // the last product forgotten
				out.push(o(raw.map((t, i) => (i === 1 ? neg(t) : t))));
			}
			out.push(o(fractionsAdded(raw)));
			return out;
		}
		case 'div': {
			const M = B[0];
			const Q = res;
			const unit = Q.find((t) => letters(t).length === 0 && t.c.abs().isOne());
			if (unit) out.push(o(Q.filter((t) => t !== unit))); // the term equal to the divisor lost
			if (!M.c.isInteger()) out.push(o(A.map((t) => mono(t.c.mul(M.c), { ...div(t, M)!.e })))); // reciprocal forgotten
			if (M.c.sign() < 0) out.push(o(Q.map(neg))); // signs not changed
			out.push(o([div(A[0], M)!, ...A.slice(1)])); // only the first term divided
			out.push(o(A.map((t) => mono(div(t, M)!.c, { ...mul(t, mono(1, { ...M.e })).e })))); // exponents added
			return out;
		}
	}
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.level, sample.params)!;
	const res = result(b);
	const fallback = (i: number): Opt | null => {
		const j = i % res.length;
		const d = q(Math.ceil(i / res.length) * (i % 2 ? 1 : -1));
		const t = res[j];
		const c = t.c.add(d);
		if (c.isZero()) return null;
		return opt(res.map((s, k) => (k === j ? mono(c, { ...t.e }) : s)));
	};
	return buildChoice(opt(res), mistakes(b, res), fallback, rng);
}

export const polinomiOperazioni: Generator = {
	id: ID,
	title: 'Operazioni tra polinomi',
	levels: {
		1: { label: 'Somma di due polinomi', constraints: ['due polinomi in una lettera, coefficienti interi', 'almeno due coppie di termini simili'] },
		2: { label: 'Differenza di due polinomi', constraints: ['il meno cambia il segno a tutti i termini della seconda parentesi', 'una o due lettere; circa metà con due termini opposti che si annullano'] },
		3: { label: 'Somma algebrica con coefficienti frazionari', constraints: ['somme e differenze, denominatori 2, 3, 4, 6', 'almeno una coppia di termini simili con denominatori diversi'] },
		4: { label: 'Monomio per polinomio', constraints: ['il monomio moltiplica ogni termine del polinomio', 'circa 3 su 10 con coefficienti frazionari, circa metà degli altri con il monomio negativo'] },
		5: { label: 'Binomio per binomio', constraints: ['due binomi in una lettera, coefficienti interi', 'niente prodotti notevoli: il risultato ha tre termini'] },
		6: { label: 'Polinomio per polinomio', constraints: ['binomio per trinomio, due lettere o coefficienti frazionari', 'niente prodotti notevoli'] },
		7: { label: 'Polinomio diviso per un monomio', constraints: ['il polinomio è sempre divisibile per il monomio', 'circa 3 su 10 con divisore frazionario, circa 1 su 3 con un termine che diventa 1'] },
	},
	generate(rng: Rng, level: number): Sample {
		const want = pickCase(rng, level);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level, want);
			} catch {
				continue;
			}
			if (!b) continue;
			let sample: Sample;
			try {
				sample = assemble(b, rng.seed);
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

export default polinomiOperazioni;
