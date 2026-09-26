/**
 * Composizione e funzione inversa. Spec: specs/exercises/composizione-di-funzioni.md
 *
 * Seven levels in the order of lesson 44: the composite of two functions between finite sets (or the
 * answer that it cannot be done); the composite at a number, step by step; the formula of the composite
 * of two linear functions, in both orders and with itself; the formula with a quadratic, where the x
 * appears twice; the inverse of a linear function with integer coefficients; the inverse with a
 * fractional coefficient, checked by composing; recognising an invertible function, and the point of
 * the inverse's graph. Every answer is built first (the arrows, the coefficients, the point) and the
 * text follows.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { type Poly, paren, poly, polyAdd, polyDegree, polyMul, polyScale, polyToLatex } from '../latex';
import { assembleChoice, lines, pickDistinct, shuffle } from '../insiemi';

export const ID = 'composizione-di-funzioni';

const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.{])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
];

// ---------------------------------------------------------------------------
// Small helpers

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

/** "\{1,\ 2,\ 3\}", as the lesson writes sets. */
const listSet = (xs: (number | string)[]) => `\\{${xs.join(',\\ ')}\\}`;

/** "a", "a e b", "a, b e c". */
function andList(xs: string[]): string {
	if (xs.length === 1) return xs[0];
	return `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`;
}

/** Trailing zero coefficients removed. */
function trim(p: Poly): Poly {
	const d = polyDegree(p);
	return d < 0 ? [q(0)] : p.slice(0, d + 1);
}

const pl = (p: Poly) => polyToLatex(trim(p));

function evalP(p: Poly, v: Rational): Rational {
	let out = q(0);
	for (let i = p.length - 1; i >= 0; i--) out = out.mul(v).add(p[i]);
	return out;
}

function polyPow(p: Poly, n: number): Poly {
	let out: Poly = [q(1)];
	for (let i = 0; i < n; i++) out = polyMul(out, p);
	return out;
}

/** g ∘ f: the polynomial g with f in place of x. */
function compose(g: Poly, f: Poly): Poly {
	let out: Poly = [q(0)];
	g.forEach((c, i) => (out = polyAdd(out, polyScale(polyPow(f, i), c))));
	return trim(out);
}

/** SymPy form, e.g. "(3/2)*x**1 + (6)*x**0". */
function sym(p: Poly): string {
	const t = trim(p);
	const parts = t.map((c, i) => (c.isZero() ? null : `(${c.toString()})*x**${i}`)).filter((s): s is string => s !== null);
	return parts.length ? parts.join(' + ') : '0';
}

const polyKey = (p: Poly) => trim(p).map(String).join(',');
const polyJSON = (p: Poly) => trim(p).map(String);
const polyFromJSON = (x: unknown): Poly => (Array.isArray(x) ? x.map((s) => Rational.parse(String(s))) : []);

/** A term c·(inner)^d joined to what comes before: "+ 3 \cdot 2", "- (-1)^2". */
function joinTerm(out: string, c: Rational, body: string): string {
	if (out === '') return (c.sign() < 0 ? '-' : '') + body;
	return `${out} ${c.sign() < 0 ? '-' : '+'} ${body}`;
}

/** p with the number v in place of x, before computing: "2 \cdot 3 + 1", "(-2)^2 - 5". */
function substNumber(p: Poly, v: Rational): string {
	let out = '';
	for (let d = p.length - 1; d >= 0; d--) {
		const c = p[d];
		if (c.isZero()) continue;
		const a = c.abs();
		const base = d === 0 ? '' : d === 1 ? paren(v) : `${paren(v)}^${d}`;
		const body = d === 0 ? a.toLatex() : a.isOne() ? base : `${a.toLatex()} \\cdot ${base}`;
		out = joinTerm(out, c, body);
	}
	return out || '0';
}

/** "f(3) = 2 \cdot 3 + 1 = 7", without the middle when it says nothing new. */
function valueStep(name: string, p: Poly, v: Rational): string {
	const mid = substNumber(p, v);
	const val = evalP(p, v).toLatex();
	return mid === val ? `${name}(${v.toLatex()}) = ${val}` : `${name}(${v.toLatex()}) = ${mid} = ${val}`;
}

/** The outer polynomial with (inner) in place of x, before expanding: "(x - 1)^2 - 3(x - 1)". */
function substPoly(outer: Poly, inner: Poly): string {
	const inTex = pl(inner);
	const single = trim(inner).filter((c) => !c.isZero()).length === 1;
	let out = '';
	for (let d = outer.length - 1; d >= 0; d--) {
		const c = outer[d];
		if (c.isZero()) continue;
		const a = c.abs();
		if (d === 0) {
			out = joinTerm(out, c, a.toLatex());
			continue;
		}
		if (single) {
			// A monomial goes in directly: 2 · x^2 is written 2x^2.
			const piece = pl(polyScale(polyPow(inner, d), c));
			out = out === '' ? piece : piece.startsWith('-') ? `${out} - ${piece.slice(1)}` : `${out} + ${piece}`;
			continue;
		}
		const lr = a.isInteger() ? ['(', ')'] : ['\\left(', '\\right)'];
		const base = d === 1 ? `${lr[0]}${inTex}${lr[1]}` : `${lr[0]}${inTex}${lr[1]}^${d}`;
		if (out === '' && d === 1 && c.isOne()) {
			out = inTex;
			continue;
		}
		out = joinTerm(out, c, a.isOne() ? base : `${a.toLatex()}${base}`);
	}
	return out || '0';
}

/** Each term of outer(inner) expanded, not yet collected: "x^2 - 2x + 1 - 3x + 3". */
function expandedPieces(outer: Poly, inner: Poly): string {
	let out = '';
	for (let d = outer.length - 1; d >= 0; d--) {
		const c = outer[d];
		if (c.isZero()) continue;
		const piece = pl(polyScale(polyPow(inner, d), c));
		out = out === '' ? piece : piece.startsWith('-') ? `${out} - ${piece.slice(1)}` : `${out} + ${piece}`;
	}
	return out || '0';
}

// ---------------------------------------------------------------------------
// Level 1: composite of two functions between finite sets

const LETTERS = ['a', 'b', 'c', 'd', 'e'];
const IMPOSSIBLE = 'non-si-puo';
const IMPOSSIBLE_OPTION: ChoiceOption = { latex: '\\text{non si può calcolare}', values: [IMPOSSIBLE] };

interface Finite {
	A: number[];
	B: string[];
	C: number[];
	f: string[];
	g: number[];
	asked: 'gf' | 'fg';
}

function buildFinite(rng: Rng): Finite {
	const n = rng.pick([3, 3, 4]);
	const m = rng.int(Math.max(3, n - 1), Math.min(5, n + 1));
	const A = Array.from({ length: n }, (_, i) => i + 1);
	const B = LETTERS.slice(0, m);
	const C = pickDistinct(rng, [10, 20, 30, 40], rng.int(2, 3)).sort((a, b) => a - b);
	const f = A.map(() => rng.pick(B));
	const g = shuffle(rng, [...C, ...Array.from({ length: m - C.length }, () => rng.pick(C))]);
	return { A, B, C, f, g, asked: rng.next() < 0.7 ? 'gf' : 'fg' };
}

const gOf = (b: Finite, y: string) => b.g[b.B.indexOf(y)];
const composite = (b: Finite) => b.f.map((y) => gOf(b, y));

/** "1 \mapsto 20,\ 2 \mapsto 10, ..." on one line, or on two with 4 elements. */
function arrowsOption(A: number[], outs: number[]): ChoiceOption {
	const items = A.map((x, i) => `${x} \\mapsto ${outs[i]}`);
	const latex = items.length <= 3 ? items.join(',\\ ') : `\\begin{gathered} ${items.slice(0, 2).join(',\\ ')}, \\\\ ${items.slice(2).join(',\\ ')} \\end{gathered}`;
	return { latex, values: outs.map(String) };
}

function finiteProblem(b: Finite): string {
	const rows = [
		`f: A \\to B,\\quad g: B \\to C`,
		`A = ${listSet(b.A)},\\quad B = ${listSet(b.B)},\\quad C = ${listSet(b.C)}`,
		`f: \\ ${b.A.map((x, i) => `${x} \\mapsto ${b.f[i]}`).join(',\\quad ')}`,
		`g: \\ ${b.B.map((y, i) => `${y} \\mapsto ${b.g[i]}`).join(',\\quad ')}`,
		`${b.asked === 'gf' ? 'g \\circ f' : 'f \\circ g'} = \\ ?`,
	];
	return `\\begin{gathered} ${rows.join(' \\\\ ')} \\end{gathered}`;
}

function finiteChoice(rng: Rng, b: Finite): ChoiceAnswer | null {
	const right = composite(b);
	// g of the i-th letter of B, skipping f (only when B has at least as many elements as A)
	const positional = b.B.length >= b.A.length ? [b.A.map((_, i) => b.g[i])] : [];
	const oneWrong: number[][] = [];
	right.forEach((v, i) => b.C.filter((w) => w !== v).forEach((w) => oneWrong.push(right.map((u, j) => (j === i ? w : u)))));
	const wrongLists = [...positional, ...shuffle(rng, oneWrong)].map((o) => arrowsOption(b.A, o));
	if (b.asked === 'gf') return assembleChoice(rng, arrowsOption(b.A, right), [wrongLists[0], IMPOSSIBLE_OPTION, ...wrongLists.slice(1)]);
	return assembleChoice(rng, IMPOSSIBLE_OPTION, [arrowsOption(b.A, right), ...wrongLists]);
}

function finiteSteps(b: Finite): string[] {
	if (b.asked === 'fg') {
		return [
			`(f \\circ g)(x) = f(g(x))\\text{: agisce prima } g\\text{, poi } f\\text{.}`,
			`g \\text{ porta gli elementi di } B \\text{ in } C = ${listSet(b.C)}\\text{, ma } f \\text{ è definita solo sugli elementi di } A = ${listSet(b.A)}\\text{: per esempio } f(${b.g[0]}) \\text{ non ha senso.}`,
			`\\text{Quindi } f \\circ g \\text{ non si può calcolare.}`,
		];
	}
	const out = [`\\text{In } g \\circ f \\text{ agisce prima } f\\text{: per ogni elemento di } A \\text{ segui la freccia di } f \\text{ e poi quella di } g\\text{.}`];
	b.A.forEach((x, i) => out.push(`(g \\circ f)(${x}) = g(${b.f[i]}) = ${gOf(b, b.f[i])}`));
	const unused = b.B.filter((y) => !b.f.includes(y));
	if (unused.length === 1) out.push(`\\text{L'elemento } ${unused[0]} \\text{ di } B \\text{ non conta: nessuna freccia di } f \\text{ ci arriva.}`);
	else if (unused.length > 1) out.push(`\\text{Gli elementi } ${andList(unused)} \\text{ di } B \\text{ non contano: nessuna freccia di } f \\text{ ci arriva.}`);
	return out;
}

// ---------------------------------------------------------------------------
// Levels 2-4: composite with formulas

type Asked = 'gf' | 'fg' | 'ff';

const NAME: Record<Asked, string> = { gf: 'g \\circ f', fg: 'f \\circ g', ff: 'f \\circ f' };

/** The function applied last and the one applied first. */
function roles(asked: Asked, f: Poly, g: Poly): { outer: Poly; inner: Poly; o: string; i: string } {
	if (asked === 'gf') return { outer: g, inner: f, o: 'g', i: 'f' };
	if (asked === 'fg') return { outer: f, inner: g, o: 'f', i: 'g' };
	return { outer: f, inner: f, o: 'f', i: 'f' };
}

function formulaProblem(asked: Asked, f: Poly, g: Poly, at: string): string {
	const given = asked === 'ff' ? `f(x) = ${pl(f)}` : `f(x) = ${pl(f)},\\quad g(x) = ${pl(g)}`;
	return `\\begin{gathered} ${given} \\\\ (${NAME[asked]})(${at}) = \\ ? \\end{gathered}`;
}

const lin = (b: number, a: number): Poly => poly(b, a);

/** Level 2: one linear function and x^2 + c, or two linear ones. */
function buildPoint(rng: Rng): { f: Poly; g: Poly; asked: 'gf' | 'fg'; p: number } {
	const linear = () => lin(rng.int(-5, 5), nonZero(rng, -3, 3));
	const square = () => poly(rng.int(-5, 5), 0, 1);
	let f: Poly, g: Poly;
	if (rng.next() < 0.7) [f, g] = rng.next() < 0.5 ? [linear(), square()] : [square(), linear()];
	else [f, g] = [linear(), linear()];
	return { f, g, asked: rng.next() < 0.5 ? 'gf' : 'fg', p: rng.int(-3, 3) };
}

function pointValues(f: Poly, g: Poly, asked: 'gf' | 'fg', p: number) {
	const { outer, inner } = roles(asked, f, g);
	const v = q(p);
	const mid = evalP(inner, v);
	return { mid, right: evalP(outer, mid), reversed: evalP(inner, evalP(outer, v)), product: evalP(f, v).mul(evalP(g, v)) };
}

/** Numbers wrong in the ways the lesson warns about: order, product, stopping halfway, sign of a square. */
function pointCandidates(f: Poly, g: Poly, asked: 'gf' | 'fg', p: number): number[] {
	const { outer } = roles(asked, f, g);
	const { mid, right, reversed, product } = pointValues(f, g, asked, p);
	const out = [right, reversed, product, mid].map((r) => r.num);
	if (polyDegree(outer) === 2 && mid.sign() < 0) out.push(-mid.num * mid.num + outer[0].num);
	for (let d = 1; d < 10; d++) out.push(right.num + d, right.num - d);
	return [...new Set(out)];
}

function pointSteps(f: Poly, g: Poly, asked: 'gf' | 'fg', p: number): string[] {
	const { outer, inner, o, i } = roles(asked, f, g);
	const v = q(p);
	const mid = evalP(inner, v);
	return [
		`(${NAME[asked]})(${p}) = ${o}(${i}(${p}))\\text{: prima calcoli } ${i}(${p})\\text{, poi } ${o} \\text{ nel risultato.}`,
		valueStep(i, inner, v),
		valueStep(o, outer, mid),
		`\\text{Quindi } (${NAME[asked]})(${p}) = ${evalP(outer, mid).toLatex()}`,
	];
}

/** Level 3: two linear functions. */
function buildLinear(rng: Rng): { f: Poly; g: Poly; asked: Asked } {
	const u = rng.next();
	const asked: Asked = u < 0.4 ? 'gf' : u < 0.7 ? 'fg' : 'ff';
	const f = lin(nonZero(rng, -6, 6), asked === 'ff' ? nonZero(rng, -4, 4, [1, -1]) : nonZero(rng, -4, 4));
	const g = lin(nonZero(rng, -6, 6), nonZero(rng, -4, 4));
	return { f, g, asked };
}

/** Level 4: a quadratic k x^2 + p x + q and a linear function. */
function buildQuadratic(rng: Rng): { f: Poly; g: Poly; asked: Asked } {
	const k = rng.pick([1, 1, 1, 1, 1, 1, 2, -1]);
	const p = rng.next() < 0.8 ? nonZero(rng, -5, 5) : 0;
	const c = p === 0 ? nonZero(rng, -5, 5) : rng.int(-5, 5);
	const g = poly(c, p, k);
	const f = lin(nonZero(rng, -4, 4), rng.pick([1, 1, 1, 2, -1, -2, 3]));
	return { f, g, asked: rng.next() < 0.7 ? 'gf' : 'fg' };
}

/** Wrong formulas, from the warnings of the lesson, correct one first. */
function formulaCandidates(asked: Asked, f: Poly, g: Poly): Poly[] {
	const { outer, inner } = roles(asked, f, g);
	const right = compose(outer, inner);
	const O = [...outer, q(0), q(0)], I = [...inner, q(0)];
	const out: Poly[] = [right];
	if (polyDegree(outer) === 2) {
		// the lesson's warnings: (a x + b)^2 = a^2 x^2 + b^2, order, product; then p(ax + b) = pax + b
		out.push(polyAdd(polyScale(poly(I[0].mul(I[0]), 0, I[1].mul(I[1])), O[2]), polyAdd(polyScale(inner, O[1]), poly(O[0]))));
		out.push(compose(inner, outer));
		out.push(polyMul(outer, inner));
		out.push(polyAdd(polyScale(polyPow(inner, 2), O[2]), poly(I[0].add(O[0]), O[1].mul(I[1]))));
		out.push(polyAdd(polyScale(poly(I[0].mul(I[0]), I[0].mul(I[1]).mul(q(-2)), I[1].mul(I[1])), O[2]), polyAdd(polyScale(inner, O[1]), poly(O[0]))));
	} else if (polyDegree(inner) === 2) {
		// f ∘ g with f linear: order, only the first term multiplied, product
		out.push(compose(inner, outer));
		out.push(polyAdd(inner.map((c, i) => (i === polyDegree(inner) ? c.mul(O[1]) : c)), poly(O[0])));
		out.push(polyMul(outer, inner));
		out.push(polyAdd(polyScale(inner, O[1]), poly(O[0].neg())));
	} else {
		// two linear functions: order, the constant not multiplied, product, sum, sign
		out.push(compose(inner, outer));
		out.push(poly(I[0].add(O[0]), O[1].mul(I[1])));
		out.push(polyMul(outer, inner));
		out.push(polyAdd(outer, inner));
		out.push(poly(O[0].sub(O[1].mul(I[0])), O[1].mul(I[1])));
	}
	const seen = new Set<string>();
	return out.map(trim).filter((p) => (seen.has(polyKey(p)) ? false : (seen.add(polyKey(p)), true)));
}

function formulaSteps(asked: Asked, f: Poly, g: Poly): string[] {
	const { outer, inner, o, i } = roles(asked, f, g);
	const right = compose(outer, inner);
	const name = `(${NAME[asked]})(x)`;
	const subst = substPoly(outer, inner);
	const pieces = expandedPieces(outer, inner);
	const twice = polyDegree(outer) === 2 && !outer[1].isZero();
	const out = [`${name} = ${o}(${i}(x))\\text{: nella formula di } ${o} \\text{ metti } ${pl(inner)} \\text{ al posto di ${twice ? 'ogni' : ''} } x\\text{, tra parentesi.}`.replace('di  }', 'di }')];
	out.push(`${name} = ${subst}`);
	if (pieces !== subst && pieces !== pl(right)) out.push(`= ${pieces}`);
	if (pl(right) !== subst) out.push(`= ${pl(right)}`);
	const x0 = q(polyDegree(inner) === 2 ? 1 : 2);
	const mid = evalP(inner, x0);
	out.push(
		`\\text{Controllo in } x = ${x0.toLatex()}\\text{: } ${i}(${x0.toLatex()}) = ${mid.toLatex()} \\text{ e } ${o}(${mid.toLatex()}) = ${evalP(outer, mid).toLatex()}\\text{; dalla formula } ${substNumber(right, x0)} = ${evalP(right, x0).toLatex()}\\text{.}`,
	);
	return out;
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the inverse of a linear function

/** (p·x + c)/d written as the lesson writes it: \frac{x + 6}{3}, \frac{5 - x}{2}, 4 - x. */
function linFrac(p: number, c: number, d: number, v = 'x'): string {
	if (d < 0) [p, c, d] = [-p, -c, -d];
	const g = gcd(gcd(p, c), d);
	[p, c, d] = [p / g, c / g, d / g];
	const pv = (k: number) => `${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`;
	let num: string;
	let neg = false;
	if (p > 0) num = polyToLatex(poly(c, p), v);
	else if (c > 0) num = `${c} - ${pv(p)}`;
	else if (d === 1) num = polyToLatex(poly(c, p), v);
	else {
		neg = true;
		num = polyToLatex(poly(-c, -p), v);
	}
	if (d === 1) return num;
	return `${neg ? '-' : ''}\\frac{${num}}{${d}}`;
}

/** A candidate inverse: (p x + c)/d (optionally written x/d + c/d), or 1/(a x + b). */
type Inv = { kind: 'lin'; p: number; c: number; d: number; split?: boolean } | { kind: 'recip'; a: number; b: number };

function invKey(o: Inv): string {
	if (o.kind === 'recip') return `r:${o.a}:${o.b}`;
	return `l:${q(o.p, o.d)}:${q(o.c, o.d)}`;
}

function invLatex(o: Inv): string {
	if (o.kind === 'recip') return `\\frac{1}{${polyToLatex(poly(o.b, o.a))}}`;
	if (o.split) {
		const head = o.d === 1 ? 'x' : o.d === -1 ? '-x' : o.d < 0 ? `-\\frac{x}{${-o.d}}` : `\\frac{x}{${o.d}}`;
		const c = q(o.c, o.d);
		return c.isZero() ? head : c.sign() < 0 ? `${head} - ${c.abs().toLatex()}` : `${head} + ${c.toLatex()}`;
	}
	return linFrac(o.p, o.c, o.d);
}

function invSym(o: Inv): string {
	if (o.kind === 'recip') return `1/((${o.a})*x + (${o.b}))`;
	return `((${o.p})*x + (${o.c}))/(${o.d})`;
}

function inverseCandidates(a: number, b: number): Inv[] {
	const cands: Inv[] = [
		{ kind: 'lin', p: 1, c: -b, d: a },
		{ kind: 'lin', p: 1, c: b, d: a }, // the constant moved without changing sign
		{ kind: 'lin', p: 1, c: -a * b, d: a, split: true }, // x/a - b: only x divided
		{ kind: 'recip', a, b }, // f^{-1} read as 1/f
		{ kind: 'lin', p: -1, c: -b, d: a }, // sign of x lost
		{ kind: 'lin', p: a, c: -b, d: 1 }, // a x - b
	];
	const seen = new Set<string>();
	return cands.filter((o) => (seen.has(invKey(o)) ? false : (seen.add(invKey(o)), true)));
}

function inverseSteps(a: number, b: number, check: number): string[] {
	const fx = pl(lin(b, a));
	const out = [`\\text{Scrivi } y = ${fx} \\text{ e ricava } x\\text{.}`];
	if (a > 0) {
		out.push(`${polyToLatex(poly(-b, 1), 'y')} = ${pl(lin(0, a))}`);
		if (a !== 1) out.push(`x = ${linFrac(1, -b, a, 'y')}`);
	} else {
		out.push(`\\text{Il coefficiente di } x \\text{ è negativo: porta il termine con la } x \\text{ a sinistra e } y \\text{ a destra.}`);
		out.push(`${pl(lin(0, -a))} = ${linFrac(-1, b, 1, 'y')}`);
		if (a !== -1) out.push(`x = ${linFrac(-1, b, -a, 'y')}`);
	}
	out.push(`\\text{Scambia le lettere: } f^{-1}(x) = ${linFrac(1, -b, a)}`);
	const y0 = a * check + b;
	out.push(`\\text{Controllo: } f(${check}) = ${y0} \\text{ e } f^{-1}(${y0}) = ${check}\\text{.}`);
	return out;
}

/** Level 6: f(x) = (num/den) x + b, with b a multiple of num so that the inverse has an integer constant. */
interface FracLin {
	num: number;
	den: number;
	t: number;
}

const fracF = (s: FracLin): Poly => poly(q(s.num * s.t), q(s.num, s.den));
const fracInv = (s: FracLin): Poly => poly(q(-s.den * s.t), q(s.den, s.num));

function buildFrac(rng: Rng): FracLin {
	for (;;) {
		const den = rng.int(2, 5);
		const num = nonZero(rng, -5, 5);
		if (gcd(Math.abs(num), den) !== 1) continue;
		const t = nonZero(rng, -4, 4);
		if (Math.abs(num * t) > 12) continue;
		return { num, den, t };
	}
}

function fracCandidates(s: FracLin): Poly[] {
	const m = q(s.den, s.num), b = q(s.num * s.t), k = q(s.num, s.den);
	const out: Poly[] = [
		fracInv(s),
		poly(b.neg(), m), // the constant not multiplied by the reciprocal
		poly(q(s.den * s.t), m), // sign of the constant
		poly(b.neg().mul(k), k), // coefficient not inverted
		poly(q(-s.den * s.t), m.neg()),
		poly(b, m),
	];
	const seen = new Set<string>();
	return out.map(trim).filter((p) => (seen.has(polyKey(p)) ? false : (seen.add(polyKey(p)), true)));
}

function fracSteps(s: FracLin): string[] {
	const f = fracF(s), inv = fracInv(s);
	const k = q(s.num, s.den), m = q(s.den, s.num), b = q(s.num * s.t);
	const lhs = joinSignedY(b.neg());
	const coef = m.isOne() ? '' : m.equals(q(-1)) ? '-' : m.toLatex();
	const lr = m.isInteger() ? ['(', ')'] : ['\\left(', '\\right)'];
	const kb = k.mul(inv[0]); // f(f^{-1}(x)) = x + k·c + b, with k·c = -b
	return [
		`\\text{Scrivi } y = ${pl(f)} \\text{ e ricava } x\\text{.}`,
		`\\text{Porta il termine noto a sinistra: } ${lhs} = ${pl(poly(0, k))}`,
		`\\text{Moltiplica per } ${paren(m)}\\text{, il reciproco di } ${paren(k)}\\text{: } x = ${coef}${lr[0]}${lhs}${lr[1]} = ${polyToLatex(trim(inv), 'y')}`,
		`\\text{Scambia le lettere: } f^{-1}(x) = ${pl(inv)}`,
		`\\text{Controllo con la composizione: } f(f^{-1}(x)) = ${k.toLatex()}\\left(${pl(inv)}\\right) ${b.sign() < 0 ? '-' : '+'} ${b.abs().toLatex()} = x ${kb.sign() < 0 ? '-' : '+'} ${kb.abs().toLatex()} ${b.sign() < 0 ? '-' : '+'} ${b.abs().toLatex()} = x`,
	];
}

const joinSignedY = (c: Rational) => polyToLatex(poly(c, 1), 'y');

// ---------------------------------------------------------------------------
// Level 7: is it invertible? The point of the inverse's graph.

export type Kind = 'biettiva' | 'iniettiva' | 'suriettiva' | 'nessuna';
const KINDS: Kind[] = ['biettiva', 'iniettiva', 'suriettiva', 'nessuna'];

/** Always in this order. */
const INV_OPTIONS: Record<Kind, ChoiceOption> = {
	biettiva: { latex: '\\text{sì, è biettiva}', values: ['si-biettiva'] },
	iniettiva: { latex: '\\text{no: iniettiva, non suriettiva}', values: ['no-non-suriettiva'] },
	suriettiva: { latex: '\\text{no: suriettiva, non iniettiva}', values: ['no-non-iniettiva'] },
	nessuna: { latex: '\\text{no: né iniettiva né suriettiva}', values: ['no-nessuna'] },
};

type Fam = 'lin' | 'const' | 'sq' | 'finite';
type NumSet = 'R' | 'R+' | 'Z';
const SET_LATEX: Record<NumSet, string> = { R: '\\mathbb{R}', 'R+': '[0, +\\infty)', Z: '\\mathbb{Z}' };

interface Invertible {
	kind: Kind;
	fam: Fam;
	dom: NumSet;
	cod: NumSet;
	f: Poly;
	A: number[];
	B: string[];
	map: string[];
}

function buildInvertible(rng: Rng, kind: Kind): Invertible {
	const base = { kind, dom: 'R' as NumSet, cod: 'R' as NumSet, f: [q(0)] as Poly, A: [] as number[], B: [] as string[], map: [] as string[] };
	if (rng.next() < 0.4) {
		const sizes: Record<Kind, [number, number][]> = {
			biettiva: [[3, 3], [4, 4]],
			iniettiva: [[3, 4], [3, 5], [4, 5]],
			suriettiva: [[4, 3], [5, 3], [5, 4]],
			nessuna: [[3, 3], [4, 4], [3, 4], [4, 3]],
		};
		const [n, m] = rng.pick(sizes[kind]);
		const A = Array.from({ length: n }, (_, i) => i + 1);
		const B = LETTERS.slice(0, m);
		let map: string[];
		if (kind === 'biettiva' || kind === 'iniettiva') map = shuffle(rng, B).slice(0, n);
		else {
			const r = kind === 'suriettiva' ? m : rng.int(2, Math.min(n, m) - 1);
			const target = shuffle(rng, B).slice(0, r);
			map = shuffle(rng, [...target, ...Array.from({ length: n - r }, () => rng.pick(target))]);
		}
		return { ...base, fam: 'finite', A, B, map };
	}
	switch (kind) {
		case 'biettiva':
			return { ...base, fam: 'lin', f: lin(rng.int(-9, 9), nonZero(rng, -6, 6)) };
		case 'iniettiva':
			return { ...base, fam: 'lin', dom: 'Z', cod: 'Z', f: lin(rng.next() < 0.5 ? 0 : nonZero(rng, -5, 5), nonZero(rng, -5, 5, [1, -1])) };
		case 'suriettiva':
			return { ...base, fam: 'sq', cod: 'R+', f: poly(0, 0, rng.pick([1, 1, 2, 3])) };
		case 'nessuna':
			return rng.next() < 0.5 ? { ...base, fam: 'const', f: poly(nonZero(rng, -9, 9)) } : { ...base, fam: 'sq', f: poly(0, 0, rng.pick([1, 1, 2, 3])) };
	}
}

function invertibleProblem(b: Invertible): string {
	if (b.fam === 'finite') {
		return `\\begin{gathered} f: A \\to B,\\quad A = ${listSet(b.A)},\\quad B = ${listSet(b.B)} \\\\ ${b.A.map((x, i) => `${x} \\mapsto ${b.map[i]}`).join(',\\quad ')} \\end{gathered}`;
	}
	return `f: ${SET_LATEX[b.dom]} \\to ${SET_LATEX[b.cod]},\\quad f(x) = ${pl(b.f)}`;
}

const VERDICT: Record<Kind, string> = {
	biettiva: '\\text{Quindi } f \\text{ è biettiva e ha la funzione inversa.}',
	iniettiva: '\\text{Quindi } f \\text{ non è biettiva e non ha la funzione inversa.}',
	suriettiva: '\\text{Quindi } f \\text{ non è biettiva e non ha la funzione inversa.}',
	nessuna: '\\text{Quindi } f \\text{ non è biettiva e non ha la funzione inversa.}',
};

function invertibleSteps(b: Invertible): string[] {
	const out = ['\\text{Una funzione ha l\'inversa solo se è biettiva, cioè iniettiva e suriettiva.}'];
	if (b.fam === 'finite') {
		const pre = (y: string) => b.A.filter((_, i) => b.map[i] === y);
		const multi = b.B.find((y) => pre(y).length > 1);
		const missed = b.B.filter((y) => pre(y).length === 0);
		out.push(
			multi
				? `\\text{L'elemento } ${multi} \\text{ riceve più di una freccia, da } ${andList(pre(multi).map(String))}\\text{: } f \\text{ non è iniettiva, e rovesciando le frecce da } ${multi} \\text{ ne partirebbero due.}`
				: `\\text{A ogni elemento di } B \\text{ arriva al massimo una freccia: } f \\text{ è iniettiva.}`,
		);
		out.push(
			missed.length
				? `${missed.length === 1 ? `\\text{L'elemento } ${missed[0]} \\text{ non riceve}` : `\\text{Gli elementi } ${andList(missed)} \\text{ non ricevono}`} \\text{ nessuna freccia: } f \\text{ non è suriettiva.}`
				: `\\text{Ogni elemento di } B \\text{ riceve una freccia: } f \\text{ è suriettiva.}`,
		);
	} else if (b.fam === 'lin' && b.dom === 'R') {
		const a = b.f[1].num, c = b.f[0].num;
		out.push(`\\text{Il coefficiente di } x \\text{ è diverso da zero: per ogni } y \\text{ l'equazione } ${pl(b.f)} = y \\text{ ha una sola soluzione, } x = ${linFrac(1, -c, a, 'y')}\\text{.}`);
		out.push(`\\text{Ogni } y \\text{ di } \\mathbb{R} \\text{ proviene da uno e un solo } x\\text{: } f \\text{ è iniettiva e suriettiva.}`);
	} else if (b.fam === 'lin') {
		const a = b.f[1].num, c = b.f[0].num;
		const y0 = c + 1;
		out.push(`\\text{Da } ${polyToLatex(poly(c, a), 'x_1')} = ${polyToLatex(poly(c, a), 'x_2')} \\text{ segue } x_1 = x_2\\text{: } f \\text{ è iniettiva.}`);
		out.push(`${y0} \\in \\mathbb{Z}\\text{, ma } ${pl(b.f)} = ${y0} \\text{ dà } x = ${q(1, a).toLatex()}\\text{, che non è intero: } f \\text{ non è suriettiva.}`);
	} else if (b.fam === 'const') {
		const c = b.f[0].num;
		out.push(`f \\text{ porta tutti i numeri in } ${c}\\text{, per esempio } f(0) = f(1) = ${c}\\text{: non è iniettiva.}`);
		out.push(`\\text{Nessun } x \\text{ va in } ${c + 1}\\text{: } f \\text{ non è suriettiva.}`);
	} else {
		const k = b.f[2].num;
		out.push(`f(-1) = f(1) = ${k}\\text{: due numeri diversi hanno la stessa immagine, quindi } f \\text{ non è iniettiva.}`);
		out.push(
			b.cod === 'R+'
				? `\\text{Per ogni } y \\geq 0 \\text{ l'equazione } ${pl(b.f)} = y \\text{ ha la soluzione } x = \\sqrt{${k === 1 ? 'y' : `\\frac{y}{${k}}`}}\\text{: } f \\text{ è suriettiva.}`
				: `-1 \\in \\mathbb{R}\\text{, ma } ${pl(b.f)} = -1 \\text{ non ha soluzioni, perché } ${pl(b.f)} \\geq 0\\text{: } f \\text{ non è suriettiva.}`,
		);
	}
	out.push(VERDICT[b.kind]);
	return out;
}

function kindOfFinite(A: number[], B: string[], map: string[]): Kind {
	const hits = B.map((y) => map.filter((z) => z === y).length);
	const inj = hits.every((h) => h <= 1), surj = hits.every((h) => h >= 1);
	return inj ? (surj ? 'biettiva' : 'iniettiva') : surj ? 'suriettiva' : 'nessuna';
}

/** The point case: (p, q) on the graph of f(x) = a x + b; the answer is (q, p). */
function pointOption(x: number, y: number): ChoiceOption {
	return { latex: `(${x}, ${y})`, values: [String(x), String(y)] };
}

function graphChoice(rng: Rng, a: number, b: number, p: number): ChoiceAnswer | null {
	const y = a * p + b;
	const onInverse = (u: number, v: number) => a * v + b === u;
	const cands: [number, number][] = [
		[p, y],
		[-p, -y],
		[-y, -p],
		[y, -p],
		[-y, p],
		[p, -y],
		[-p, y],
	];
	const opts = cands.filter(([u, v]) => !onInverse(u, v)).map(([u, v]) => pointOption(u + 0, v + 0));
	return assembleChoice(rng, pointOption(y, p), opts);
}

// ---------------------------------------------------------------------------
// Assemble

function expressionOption(p: Poly): ChoiceOption {
	return { latex: pl(p), values: [sym(p)] };
}

function assemble(rng: Rng, level: number): Sample {
	const seed = rng.seed;
	const base = { generatorId: ID, level, seed };
	switch (level) {
		case 1: {
			const b = buildFinite(rng);
			const answer = finiteChoice(rng, b);
			if (!answer) throw new Error('retry');
			const right = composite(b);
			return {
				...base,
				prompt: 'Calcola la funzione composta per ogni elemento del suo dominio, se si può fare.',
				problem: finiteProblem(b),
				solution: b.asked === 'gf' ? `g \\circ f: \\ ${b.A.map((x, i) => `${x} \\mapsto ${right[i]}`).join(',\\ ')}` : 'f \\circ g \\text{ non si può calcolare}',
				steps: finiteSteps(b),
				answer,
				params: { A: b.A.map(String), B: b.B, C: b.C.map(String), f: b.f, g: b.g.map(String), case: b.asked },
			};
		}
		case 2: {
			const { f, g, asked, p } = buildPoint(rng);
			const v = pointValues(f, g, asked, p).right;
			return {
				...base,
				prompt: 'Calcola il valore della funzione composta.',
				problem: formulaProblem(asked, f, g, String(p)),
				solution: `(${NAME[asked]})(${p}) = ${v.toLatex()}`,
				steps: pointSteps(f, g, asked, p),
				answer: { kind: 'number', value: v.toString() },
				params: { f: polyJSON(f), g: polyJSON(g), case: asked, x: String(p) },
			};
		}
		case 3:
		case 4: {
			const { f, g, asked } = level === 3 ? buildLinear(rng) : buildQuadratic(rng);
			const { outer, inner } = roles(asked, f, g);
			const right = compose(outer, inner);
			return {
				...base,
				prompt: 'Scrivi la formula della funzione composta.',
				problem: formulaProblem(asked, f, g, 'x'),
				solution: `(${NAME[asked]})(x) = ${pl(right)}`,
				steps: formulaSteps(asked, f, g),
				answer: { kind: 'expression', value: sym(right), latex: pl(right), form: 'expanded' },
				params: asked === 'ff' ? { f: polyJSON(f), case: asked } : { f: polyJSON(f), g: polyJSON(g), case: asked },
			};
		}
		case 5: {
			const a = nonZero(rng, -6, 6, [1]);
			const b = nonZero(rng, -9, 9);
			const right: Inv = { kind: 'lin', p: 1, c: -b, d: a };
			const check = rng.pick([0, 1, 2, -1, 3].filter((x) => a * x + b !== x));
			return {
				...base,
				prompt: 'Trova la funzione inversa.',
				problem: `f: \\mathbb{R} \\to \\mathbb{R},\\quad f(x) = ${pl(lin(b, a))}`,
				solution: `f^{-1}(x) = ${invLatex(right)}`,
				steps: inverseSteps(a, b, check),
				answer: { kind: 'expression', value: invSym(right), latex: invLatex(right) },
				params: { f: polyJSON(lin(b, a)) },
			};
		}
		case 6: {
			const s = buildFrac(rng);
			const inv = fracInv(s);
			return {
				...base,
				prompt: 'Trova la funzione inversa e controllala con la composizione.',
				problem: `f: \\mathbb{R} \\to \\mathbb{R},\\quad f(x) = ${pl(fracF(s))}`,
				solution: `f^{-1}(x) = ${pl(inv)}`,
				steps: fracSteps(s),
				answer: { kind: 'expression', value: sym(inv), latex: pl(inv) },
				params: { f: polyJSON(fracF(s)) },
			};
		}
		case 7: {
			if (rng.next() < 0.4) {
				const a = nonZero(rng, -3, 3);
				const b = rng.int(-5, 5);
				const p = rng.int(-4, 4);
				const y = a * p + b;
				if (y === p || Math.abs(y) > 20) throw new Error('retry');
				const answer = graphChoice(rng, a, b, p);
				if (!answer) throw new Error('retry');
				const f = lin(b, a);
				return {
					...base,
					prompt: 'Scegli il punto che sta sul grafico della funzione inversa.',
					problem: lines([`f: \\mathbb{R} \\to \\mathbb{R},\\quad f(x) = ${pl(f)}`, `\\text{Il punto $(${p}, ${y})$ sta sul grafico di $f$.}`]),
					solution: `(${y}, ${p})`,
					steps: [
						valueStep('f', f, q(p)),
						`\\text{Se } (${p}, ${y}) \\text{ sta sul grafico di } f\\text{, allora } f(${p}) = ${y}\\text{, cioè } f^{-1}(${y}) = ${p}\\text{.}`,
						`\\text{Quindi sul grafico di } f^{-1} \\text{ sta il punto con le coordinate scambiate: } (${y}, ${p})\\text{.}`,
					],
					answer,
					params: { f: polyJSON(f), point: [String(p), String(y)], case: 'punto' },
				};
			}
			const kind = rng.pick(KINDS);
			const b = buildInvertible(rng, kind);
			return {
				...base,
				prompt: "La funzione ha l'inversa?",
				problem: invertibleProblem(b),
				solution: INV_OPTIONS[kind].latex,
				steps: invertibleSteps(b),
				answer: { kind: 'choice', options: KINDS.map((k) => ({ ...INV_OPTIONS[k], values: [...INV_OPTIONS[k].values] })), correct: KINDS.indexOf(kind) },
				params:
					b.fam === 'finite'
						? { case: kind, family: 'finite', A: b.A.map(String), B: b.B, map: b.map }
						: { case: kind, family: b.fam, dom: b.dom, cod: b.cod, f: polyJSON(b.f) },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const maxAbs = (p: Poly) => Math.max(...trim(p).map((c) => Math.abs(c.num)));

function distinctCount(options: ChoiceOption[]): number {
	return new Set(options.map((o) => o.values.join('|'))).size;
}

function checkChoice(ch: ChoiceAnswer, rightValues: string[], v: string[]): void {
	if (ch.options.length !== 4 || distinctCount(ch.options) !== 4) v.push('servono quattro opzioni distinte');
	if (ch.options[ch.correct]?.values.join('|') !== rightValues.join('|')) v.push("l'opzione giusta non è la risposta");
}

function candidatesOf(sample: Sample): ChoiceOption[] {
	const p = sample.params;
	switch (sample.level) {
		case 2:
			return pointCandidates(polyFromJSON(p.f), polyFromJSON(p.g), p.case as 'gf' | 'fg', Number(p.x)).map((n) => ({ latex: String(n), values: [String(n)] }));
		case 3:
		case 4: {
			const f = polyFromJSON(p.f);
			return formulaCandidates(p.case as Asked, f, p.case === 'ff' ? f : polyFromJSON(p.g)).map(expressionOption);
		}
		case 5: {
			const f = polyFromJSON(p.f);
			return inverseCandidates(f[1].num, f[0].num).map((o) => ({ latex: invLatex(o), values: [invSym(o)] }));
		}
		case 6: {
			const f = polyFromJSON(p.f);
			const k = f[1];
			const s: FracLin = { num: k.num, den: k.den, t: f[0].num / k.num };
			return fracCandidates(s).map(expressionOption);
		}
	}
	return [];
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	if (sample.steps.length === 0) v.push('nessun passaggio');
	switch (sample.level) {
		case 1: {
			const b: Finite = { A: (p.A as string[]).map(Number), B: p.B as string[], C: (p.C as string[]).map(Number), f: p.f as string[], g: (p.g as string[]).map(Number), asked: p.case as 'gf' | 'fg' };
			if (b.f.some((y) => !b.B.includes(y)) || b.g.some((z) => !b.C.includes(z))) v.push('le frecce escono dagli insiemi');
			if (b.C.some((z) => !b.g.includes(z))) v.push('ogni elemento di C riceve una freccia di g');
			if (new Set(composite(b)).size < 2) v.push('la composta non deve essere costante');
			if (b.A.length < 3 || b.A.length > 4) v.push('A con 3 o 4 elementi');
			if (sample.answer.kind !== 'choice') v.push('risposta a scelta multipla');
			else {
				checkChoice(sample.answer, b.asked === 'gf' ? composite(b).map(String) : [IMPOSSIBLE], v);
				const inC = (s: string) => s === IMPOSSIBLE || b.C.includes(Number(s));
				if (sample.answer.options.some((o) => o.values.length !== (o.values[0] === IMPOSSIBLE ? 1 : b.A.length) || !o.values.every(inC))) v.push('opzione con valori fuori da C');
			}
			break;
		}
		case 2: {
			const f = polyFromJSON(p.f), g = polyFromJSON(p.g);
			const x = Number(p.x);
			const vals = pointValues(f, g, p.case as 'gf' | 'fg', x);
			if (sample.answer.kind !== 'number' || sample.answer.value !== vals.right.toString()) v.push('risposta diversa dal valore della composta');
			if (vals.right.equals(vals.reversed)) v.push("i due ordini danno lo stesso valore: l'ordine non conta");
			if (Math.abs(vals.right.num) > 150 || Math.abs(vals.reversed.num) > 150) v.push('valori troppo grandi');
			if (x < -3 || x > 3) v.push('x tra -3 e 3');
			break;
		}
		case 3:
		case 4: {
			const f = polyFromJSON(p.f), g = p.case === 'ff' ? f : polyFromJSON(p.g);
			const { outer, inner } = roles(p.case as Asked, f, g);
			const right = compose(outer, inner);
			if (sample.answer.kind !== 'expression' || sample.answer.value !== sym(right)) v.push('risposta diversa dalla composta');
			if (p.case !== 'ff' && polyKey(right) === polyKey(compose(inner, outer))) v.push('le due composte coincidono');
			if (polyKey(f) === polyKey(g) && p.case !== 'ff') v.push('f e g uguali');
			if (maxAbs(right) > (sample.level === 3 ? 40 : 60)) v.push('coefficienti troppo grandi');
			if (sample.level === 3 && (polyDegree(f) !== 1 || polyDegree(g) !== 1)) v.push('livello 3: due funzioni lineari');
			if (sample.level === 4 && polyDegree(f) + polyDegree(g) !== 3) v.push('livello 4: una funzione di secondo grado e una lineare');
			break;
		}
		case 5: {
			const f = polyFromJSON(p.f);
			if (polyDegree(f) !== 1 || !f[1].isInteger() || !f[0].isInteger() || f[0].isZero() || f[1].isOne() || Math.abs(f[1].num) > 6 || Math.abs(f[0].num) > 9) v.push('f(x) = ax + b con a, b interi');
			break;
		}
		case 6: {
			const f = polyFromJSON(p.f);
			if (polyDegree(f) !== 1 || f[1].isInteger() || f[0].isZero()) v.push('coefficiente di x frazionario, b diverso da zero');
			else if (!q(f[0].num * f[1].den, f[1].num).isInteger()) v.push("l'inversa deve avere il termine noto intero");
			break;
		}
		case 7: {
			if (sample.answer.kind !== 'choice') {
				v.push('risposta a scelta multipla');
				break;
			}
			if (p.case === 'punto') {
				const [x0, y0] = (p.point as string[]).map(Number);
				const f = polyFromJSON(p.f);
				if (evalP(f, q(x0)).num !== y0) v.push('il punto non sta sul grafico di f');
				checkChoice(sample.answer, [String(y0), String(x0)], v);
			} else {
				const kind = p.case as Kind;
				if (p.family === 'finite' && kindOfFinite((p.A as string[]).map(Number), p.B as string[], p.map as string[]) !== kind) v.push('classificazione sbagliata');
				if (sample.answer.options.map((o) => o.values[0]).join() !== KINDS.map((k) => INV_OPTIONS[k].values[0]).join()) v.push('opzioni fuori ordine');
				if (sample.answer.options[sample.answer.correct].values[0] !== INV_OPTIONS[kind].values[0]) v.push('risposta sbagliata');
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.level >= 2 && sample.level <= 6 && candidatesOf(sample).length < 4) v.push('meno di quattro opzioni distinte');
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const cands = candidatesOf(sample);
	const ch = assembleChoice(rng, cands[0], cands.slice(1));
	if (!ch) throw new Error(`${ID}: not enough options at level ${sample.level}`);
	return ch;
}

// ---------------------------------------------------------------------------

export const composizioneDiFunzioni: Generator = {
	id: ID,
	title: 'Composizione e funzione inversa',
	levels: {
		1: { label: 'Composta di funzioni tra insiemi finiti', constraints: ['A di 3-4 numeri, B di 3-5 lettere, C di 2-3 decine', 'g ∘ f sette volte su dieci, f ∘ g (che non si può fare) tre volte su dieci'] },
		2: { label: 'Composta in un punto, per passi', constraints: ['una funzione lineare e x^2 + c, o due lineari', 'x tra -3 e 3; i due ordini danno valori diversi'] },
		3: { label: 'Formula della composta di due funzioni lineari', constraints: ['g ∘ f, f ∘ g o f ∘ f', 'le due composte sono diverse'] },
		4: { label: 'Formula della composta con una funzione di secondo grado', constraints: ['g(x) = kx^2 + px + q, f(x) = ax + b', 'g ∘ f sette volte su dieci'] },
		5: { label: 'Inversa di una funzione lineare', constraints: ['f(x) = ax + b, a e b interi, a ≠ 0 e a ≠ 1, b ≠ 0'] },
		6: { label: 'Inversa con un coefficiente frazionario', constraints: ['f(x) = (p/q)x + b, q da 2 a 5', "l'inversa ha il termine noto intero"] },
		7: { label: "Quando c'è l'inversa e il suo grafico", constraints: ['funzione invertibile o no, quattro risposte fisse', 'il punto (q, p) del grafico di f^{-1}'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			let sample: Sample;
			try {
				sample = assemble(rng, level);
			} catch (e) {
				if ((e as Error).message === 'retry') continue;
				throw e;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default composizioneDiFunzioni;
