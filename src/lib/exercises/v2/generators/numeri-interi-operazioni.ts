/**
 * Operazioni in ℤ. Spec: specs/exercises/numeri-interi-operazioni.md
 *
 * Six levels in the order of the lesson: addition of two integers with the explicit sign;
 * subtraction as addition of the opposite; algebraic sums of 4-6 terms; algebraic sums with
 * brackets to remove; products and exact quotients with the rule of signs; expressions with the
 * four operations and nested brackets. Every answer is an integer.
 *
 * The integer expression machinery lives here (naturali.ts refuses negative numbers): a tree of
 * sums of signed terms, products and brackets; LaTeX with the conventions of the lesson (a
 * negative number after an operation goes in parentheses, the sign at the start of an expression
 * or right after an open bracket belongs to the first number); an ASCII form for the independent
 * checker; evaluation with the priorities and with the students' mistakes, for the distractors.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { buildChoice, shuffle } from '../razionali';

export const ID = 'numeri-interi-operazioni';

// ---------------------------------------------------------------------------
// Trees

type MulOp = '*' | ':';
export interface Term {
	s: 1 | -1;
	x: Node;
}
export interface Sum {
	t: 'sum';
	terms: Term[];
}
/** A number; `signed` writes it with its sign in parentheses, (+4) or (-4), as in the rules of the lesson. */
export interface Lit {
	t: 'n';
	v: number;
	signed: boolean;
}
export interface Prod {
	t: 'prod';
	f: Node[];
	ops: MulOp[];
}
/** A bracket; k is 0 (tonde), 1 (quadre) or 2 (graffe), fixed by withBrackets(). */
export interface Grp {
	t: 'g';
	c: Sum;
	k: number;
}
export type Node = Lit | Sum | Prod | Grp;

const L = (v: number, signed = false): Lit => ({ t: 'n', v, signed });
const T = (s: 1 | -1, x: Node): Term => ({ s, x });
const S = (...terms: Term[]): Sum => ({ t: 'sum', terms });
const G = (c: Sum): Grp => ({ t: 'g', c, k: -1 });

/** Height of the brackets inside x: -1 without brackets, 0 if the outermost is a tonda, and so on. */
function height(x: Node): number {
	switch (x.t) {
		case 'n':
			return -1;
		case 'sum':
			return Math.max(-1, ...x.terms.map((tm) => height(tm.x)));
		case 'prod':
			return Math.max(-1, ...x.f.map(height));
		case 'g':
			return height(x.c) + 1;
	}
}

/** Sets the kind of every bracket from how many it contains: tonde, then quadre, then graffe. */
function withBrackets<X extends Node>(x: X): X {
	const rec = (y: Node): Node => {
		switch (y.t) {
			case 'n':
				return y;
			case 'sum':
				return S(...y.terms.map((tm) => T(tm.s, rec(tm.x))));
			case 'prod':
				return { t: 'prod', f: y.f.map(rec), ops: [...y.ops] };
			case 'g': {
				const c = rec(y.c) as Sum;
				const k = height(c) + 1;
				if (k > 2) throw new Error('withBrackets: more than three levels of brackets');
				return { t: 'g', c, k };
			}
		}
	};
	return rec(x) as X;
}

function walk(x: Node, f: (y: Node, parent: Node | null) => void, parent: Node | null = null): void {
	f(x, parent);
	if (x.t === 'sum') x.terms.forEach((tm) => walk(tm.x, f, x));
	else if (x.t === 'prod') x.f.forEach((y) => walk(y, f, x));
	else if (x.t === 'g') walk(x.c, f, x);
}

function literals(x: Node): Lit[] {
	const out: Lit[] = [];
	walk(x, (y) => {
		if (y.t === 'n') out.push(y);
	});
	return out;
}

function groups(x: Node): Grp[] {
	const out: Grp[] = [];
	walk(x, (y) => {
		if (y.t === 'g') out.push(y);
	});
	return out;
}

// ---------------------------------------------------------------------------
// Formatting

const OPEN = ['(', '[', '\\{'];
const CLOSE = [')', ']', '\\}'];
const AOPEN = ['(', '[', '{'];
const ACLOSE = [')', ']', '}'];

/**
 * LaTeX (tex) or ASCII. `first` is true when x starts an expression or a bracket: only there a
 * negative number is written without parentheses.
 */
function render(x: Node, tex: boolean, first = true): string {
	const sp = tex ? ' ' : '';
	switch (x.t) {
		case 'n': {
			const a = Math.abs(x.v);
			if (x.signed) return `(${x.v < 0 ? '-' : '+'}${a})`;
			if (x.v < 0) return first ? `-${a}` : `(-${a})`;
			return `${a}`;
		}
		case 'sum':
			return x.terms
				.map((tm, i) => {
					if (i === 0) return tm.s < 0 ? `-${render(tm.x, tex, false)}` : render(tm.x, tex, first);
					return `${sp}${tm.s < 0 ? '-' : '+'}${sp}${render(tm.x, tex, false)}`;
				})
				.join('');
		case 'prod':
			return x.f.map((f, i) => (i === 0 ? render(f, tex, first) : `${sp}${x.ops[i - 1] === '*' ? (tex ? '\\cdot' : '*') : ':'}${sp}${render(f, tex, false)}`)).join('');
		case 'g':
			if (x.k < 0 || x.k > 2) throw new Error('bracket kind not set');
			return `${(tex ? OPEN : AOPEN)[x.k]}${render(x.c, tex, true)}${(tex ? CLOSE : ACLOSE)[x.k]}`;
	}
}

export const latex = (x: Node): string => render(x, true);
export const ascii = (x: Node): string => render(x, false);
/** An integer as a result: -5, 12. */
const fmt = (v: number): string => String(v);
/** An integer with its sign: +3, -3, 0 (the notation of the rules, levels 1, 2 and 5). */
const fmtS = (v: number): string => (v > 0 ? `+${v}` : String(v));
const t = (s: string): string => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Lines for the phone

/**
 * Estimated width in em of a formula as KaTeX draws it: a digit 0.5, a digit in an exponent 0.36, a
 * binary + or - with its spaces 1.22, \cdot 0.72, : 0.83, a tonda or quadra 0.39, a graffa 0.5, a
 * minus in front of a number 0.78. Binary operators are the ones written with a space on each side.
 */
export function emWidth(tex: string): number {
	const BIN: Record<string, number> = { '+': 1.22, '-': 1.22, '\\cdot': 0.72, ':': 0.83, '=': 1.33, '<': 1.33, '>': 1.33 };
	let w = 0;
	for (let i = 0; i < tex.length; ) {
		const rest = tex.slice(i);
		const bin = /^ (\+|-|\\cdot|:|=|<|>) /.exec(rest);
		const sup = /^\^(\{[^{}]*\}|\d)/.exec(rest);
		if (bin) {
			w += BIN[bin[1]];
			i += bin[0].length - 1;
		} else if (sup) {
			w += 0.36 * sup[1].replace(/\\,|[{}]/g, '').length;
			i += sup[0].length;
		} else if (rest.startsWith('\\{') || rest.startsWith('\\}')) {
			w += 0.5;
			i += 2;
		} else if (rest.startsWith('\\,')) {
			w += 0.17;
			i += 2;
		} else if (rest.startsWith('\\cdot')) {
			w += 0.72;
			i += 5;
		} else {
			const c = tex[i++];
			w += /\d/.test(c) ? 0.5 : '()[]'.includes(c) ? 0.39 : c === '+' || c === '-' ? 0.78 : c === ' ' ? 0 : 0.5;
		}
	}
	return w;
}

/**
 * A problem line at 18 px holds 350 px on a phone. Measured with KaTeX on 1600 expressions of
 * this generator and of numeri-interi-potenze, every line of more than 350 px has an estimate above
 * 17, and only 25 of those above 17 would have fitted.
 */
export const PROBLEM_EM = 17;

/**
 * Cuts a formula into lines of at most maxEm, each new line starting with the binary operator
 * (+, -, \cdot, :) it breaks before. Among the cuts that keep the line long enough, the one with
 * the fewest brackets open wins, so the line breaks at the outermost level it can.
 */
export function phoneLines(tex: string, maxEm = PROBLEM_EM): string[] {
	const cuts: { at: number; depth: number }[] = [];
	let depth = 0;
	for (let i = 0; i < tex.length; i++) {
		const rest = tex.slice(i);
		if (/^ (\+|-|\\cdot|:) /.test(rest)) cuts.push({ at: i, depth });
		if (rest.startsWith('\\{') || rest.startsWith('\\}')) {
			depth += rest[1] === '{' ? 1 : -1;
			i++;
		} else if ('(['.includes(tex[i])) depth++;
		else if (')]'.includes(tex[i])) depth--;
	}
	const lines: string[] = [];
	let start = 0;
	while (emWidth(tex.slice(start)) > maxEm) {
		const fit = cuts.filter((c) => c.at > start && emWidth(tex.slice(start, c.at)) <= maxEm);
		if (!fit.length) break;
		const long = fit.filter((c) => emWidth(tex.slice(start, c.at)) >= maxEm / 2);
		const pool = long.length ? long : fit;
		const least = Math.min(...pool.map((c) => c.depth));
		const cut = pool.filter((c) => c.depth === least).at(-1)!;
		lines.push(tex.slice(start, cut.at));
		start = cut.at + 1;
	}
	lines.push(tex.slice(start));
	return lines;
}

/** One line if it fits, otherwise an aligned block: a new line before an operator, as present.ts lays it out. */
export const alignedLines = (lines: string[]): string => (lines.length === 1 ? lines[0] : `\\begin{aligned}&${lines.join(' \\\\ &\\quad ')}\\end{aligned}`);

/** The problem as the student sees it. */
export const problemLatex = (x: Node): string => alignedLines(phoneLines(latex(x)));

/** Parses the ASCII form back into a tree; the bracket kinds come from the symbols. */
export function parseAscii(s: string): Sum {
	let i = 0;
	const peek = () => s[i] ?? '';
	const sum = (): Sum => {
		const terms: Term[] = [];
		let sg: 1 | -1 = 1;
		if (peek() === '-') {
			i++;
			sg = -1;
		}
		terms.push(T(sg, term()));
		while (peek() === '+' || peek() === '-') {
			const o = s[i++];
			terms.push(T(o === '-' ? -1 : 1, term()));
		}
		return S(...terms);
	};
	const term = (): Node => {
		const f = [factor()];
		const ops: MulOp[] = [];
		while (peek() === '*' || peek() === ':') {
			ops.push(s[i++] as MulOp);
			f.push(factor());
		}
		return f.length === 1 ? f[0] : { t: 'prod', f, ops };
	};
	const factor = (): Node => {
		const c = peek();
		const d = /^\d+/.exec(s.slice(i));
		if (d) {
			i += d[0].length;
			return L(Number(d[0]));
		}
		const k = AOPEN.indexOf(c);
		if (k < 0 || c === '') throw new Error(`parseAscii: unexpected "${c}" at ${i} in ${s}`);
		const m = k === 0 ? /^\(([+-])(\d+)\)/.exec(s.slice(i)) : null;
		if (m) {
			i += m[0].length;
			return L(m[1] === '-' ? -Number(m[2]) : Number(m[2]), true);
		}
		i++;
		const inner = sum();
		if (s[i++] !== ACLOSE[k]) throw new Error(`parseAscii: unbalanced ${c} in ${s}`);
		return { t: 'g', c: inner, k };
	};
	const out = sum();
	if (i !== s.length) throw new Error(`parseAscii: trailing text in ${s}`);
	return out;
}

// ---------------------------------------------------------------------------
// Evaluation, with the students' mistakes

/**
 * ltr: every chain of operations done left to right, ignoring the priorities.
 * flat: brackets dropped as if they were not there, so a minus before a bracket changes the sign
 * of its first term only (the mistake the lesson warns about).
 * keepSign: a minus before a bracket ignored, the bracket added.
 */
export interface Mode {
	ltr?: boolean;
	flat?: boolean;
	keepSign?: boolean;
}
export interface OpTrace {
	op: '+' | '-' | '*' | ':';
	a: number;
	b: number;
	r: number;
}
class OutOfZ extends Error {}
type Tok = number | '+' | '-' | '*' | ':';

function applyOp(op: Tok, a: number, b: number, tr?: OpTrace[]): number {
	let r: number;
	if (op === '+') r = a + b;
	else if (op === '-') r = a - b;
	else if (op === '*') r = a * b;
	else {
		if (b === 0 || a % b !== 0) throw new OutOfZ(`${a} : ${b}`);
		r = a / b;
	}
	r = r + 0; // no -0
	if (!Number.isSafeInteger(r)) throw new OutOfZ('overflow');
	tr?.push({ op: op as OpTrace['op'], a, b, r });
	return r;
}

function evalTokens(toks: Tok[], ltr: boolean, tr?: OpTrace[]): number {
	if (ltr) {
		let acc = toks[0] as number;
		for (let i = 1; i < toks.length; i += 2) acc = applyOp(toks[i], acc, toks[i + 1] as number, tr);
		return acc;
	}
	// multiplications and divisions first, left to right
	const rest: Tok[] = [toks[0]];
	for (let i = 1; i < toks.length; i += 2) {
		const op = toks[i];
		const b = toks[i + 1] as number;
		if (op === '*' || op === ':') rest[rest.length - 1] = applyOp(op, rest[rest.length - 1] as number, b, tr);
		else rest.push(op, b);
	}
	let acc = rest[0] as number;
	for (let i = 1; i < rest.length; i += 2) acc = applyOp(rest[i], acc, rest[i + 1] as number, tr);
	return acc;
}

function stream(x: Node, m: Mode, tr?: OpTrace[]): Tok[] {
	switch (x.t) {
		case 'n':
			return [x.v];
		case 'g':
			return m.flat ? stream(x.c, m, tr) : [evalNode(x.c, m, tr)];
		case 'prod': {
			const out: Tok[] = [];
			x.f.forEach((f, i) => {
				if (i > 0) out.push(x.ops[i - 1]);
				out.push(...stream(f, m, tr));
			});
			return out;
		}
		case 'sum': {
			const out: Tok[] = [];
			x.terms.forEach((tm, i) => {
				const s = m.keepSign && tm.x.t === 'g' ? 1 : tm.s;
				const ts = stream(tm.x, m, tr);
				if (i === 0) {
					if (s < 0) ts[0] = -(ts[0] as number) + 0;
				} else out.push(s < 0 ? '-' : '+');
				out.push(...ts);
			});
			return out;
		}
	}
}

function evalNode(x: Node, m: Mode, tr?: OpTrace[]): number {
	return evalTokens(stream(x, m, tr), !!m.ltr, tr);
}

/** Exact value, or null if a division is not exact (or the mistake leaves ℤ). */
export function evaluate(x: Node, m: Mode = {}, tr?: OpTrace[]): number | null {
	try {
		return evalNode(x, m, tr);
	} catch (e) {
		if (e instanceof OutOfZ) return null;
		throw e;
	}
}

function trace(x: Node): OpTrace[] {
	const tr: OpTrace[] = [];
	evaluate(x, {}, tr);
	return tr;
}

/** Signed values of the terms of a sum whose terms are numbers. */
function termValues(x: Sum): number[] {
	return x.terms.map((tm) => tm.s * (evaluate(tm.x) as number) + 0);
}

// ---------------------------------------------------------------------------
// Steps

/** An algebraic sum of these signed values, written without double signs: -4 + 9 - 12. */
function plainSum(vals: number[]): string {
	return vals.map((v, i) => (i === 0 ? fmt(v) : `${v < 0 ? '-' : '+'} ${Math.abs(v)}`)).join(' ');
}

/** Positives together and negatives together, as in the lesson. */
function groupingSteps(vals: number[]): string[] {
	const pos = vals.filter((v) => v > 0);
	const neg = vals.filter((v) => v < 0).map((v) => -v);
	const P = pos.reduce((a, b) => a + b, 0);
	const Nn = neg.reduce((a, b) => a + b, 0);
	const side = (xs: number[], tot: number) => (xs.length === 1 ? `${tot}` : `${xs.join(' + ')} = ${tot}`);
	if (!neg.length) return [`${pos.join(' + ')} = ${P}`];
	if (!pos.length) return [`${plainSum(vals)} = -(${neg.join(' + ')}) = ${-Nn}`];
	return [`${t('Positivi: ')}${side(pos, P)},\\quad ${t('negativi: ')}${side(neg, Nn)}`, `${P} - ${Nn} = ${fmt(P - Nn)}`];
}

const BRACKET_NAME = ['Tonde', 'Quadre', 'Graffe'];

/** Replaces every bracket of kind k by its value. */
function resolveKind(x: Node, k: number): Node {
	switch (x.t) {
		case 'n':
			return x;
		case 'sum':
			return S(...x.terms.map((tm) => T(tm.s, resolveKind(tm.x, k))));
		case 'prod':
			return { t: 'prod', f: x.f.map((y) => resolveKind(y, k)), ops: [...x.ops] };
		case 'g':
			return x.k === k ? L(evaluate(x.c) as number) : { t: 'g', c: resolveKind(x.c, k) as Sum, k: x.k };
	}
}

/**
 * Steps of an expression: the brackets from the inside (tonde, quadre, graffe), each with its
 * value and what is left; then the multiplications and divisions; then the algebraic sum, with the
 * double signs reduced.
 */
function exprSteps(root: Sum): string[] {
	const out: string[] = [];
	let cur: Sum = root;
	for (let k = 0; k <= 2; k++) {
		const gs = groups(cur).filter((g) => g.k === k);
		if (!gs.length) continue;
		const lines = gs.map((g) => `${latex(g.c)} = ${fmt(evaluate(g.c) as number)}`);
		cur = resolveKind(cur, k) as Sum;
		out.push(`${t(`${BRACKET_NAME[k]}: `)}${lines.join(',\\quad ')}${t('; resta ')}${latex(cur)}`);
	}
	const prods = cur.terms.filter((tm) => tm.x.t === 'prod');
	if (prods.length) {
		const lines = prods.map((tm) => `${latex(tm.x)} = ${fmt(evaluate(tm.x) as number)}`);
		cur = S(...cur.terms.map((tm) => (tm.x.t === 'prod' ? T(tm.s, L(evaluate(tm.x) as number)) : tm)));
		out.push(`${t('Moltiplicazioni e divisioni: ')}${lines.join(',\\quad ')}${t('; resta ')}${latex(cur)}`);
	}
	if (cur.terms.length > 1 || cur.terms[0].s < 0) {
		const vals = termValues(cur);
		const plain = plainSum(vals);
		const v = vals.reduce((a, b) => a + b, 0);
		const mid = plain === latex(cur) || plain === fmt(v) ? '' : ` = ${plain}`;
		out.push(`${latex(cur)}${mid} = ${fmt(v)}`);
	}
	return out;
}

/** Removes the brackets of kind k with the two rules; the content of each is only numbers. */
function removeKind(x: Sum, k: number): Sum {
	const terms: Term[] = [];
	for (const tm of x.terms) {
		const y = tm.x;
		if (y.t === 'g' && y.k === k) {
			for (const it of y.c.terms) {
				const v = it.s * tm.s * (evaluate(it.x) as number);
				terms.push(T(v < 0 ? -1 : 1, L(Math.abs(v))));
			}
		} else if (y.t === 'g') terms.push(T(tm.s, { t: 'g', c: removeKind(y.c, k), k: y.k }));
		else terms.push(tm);
	}
	return S(...terms);
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: two integers

type Case = string;

function twoTerms(rng: Rng, level: 1 | 2): { x: Sum; c: Case } {
	// level 1: about 4 in 10 concordi (a quarter of them positive), 6 in 10 discordi
	const u = rng.next();
	const want = u < 0.1 ? 'pp' : u < 0.4 ? 'nn' : 'd';
	for (;;) {
		const a = rng.int(1, 25) * (rng.int(0, 1) ? -1 : 1);
		const b = rng.int(1, 25) * (rng.int(0, 1) ? -1 : 1);
		if (level === 1) {
			const got = a > 0 && b > 0 ? 'pp' : a < 0 && b < 0 ? 'nn' : 'd';
			if (want !== got || Math.abs(a) === Math.abs(b)) continue;
			return { x: S(T(1, L(a, true)), T(1, L(b, true))), c: got === 'd' ? 'discordi' : 'concordi' };
		}
		if (a === b) continue;
		return { x: S(T(1, L(a, true)), T(-1, L(b, true))), c: b < 0 ? 'meno-meno' : 'meno-piu' };
	}
}

function additionSteps(a: number, b: number): string[] {
	const A = Math.abs(a), B = Math.abs(b);
	const r = a + b;
	if (a * b > 0) {
		return [`${t('Gli addendi sono concordi: la somma ha il loro segno e per valore assoluto ')}${A} + ${B} = ${A + B}`, `(${fmtS(a)}) + (${fmtS(b)}) = ${fmtS(r)}`];
	}
	const big = A > B ? a : b;
	return [
		`${t('Gli addendi sono discordi: il segno è quello di ')}${fmtS(big)}${t(', che ha il valore assoluto maggiore')}`,
		`${t('Valore assoluto: ')}${Math.max(A, B)} - ${Math.min(A, B)} = ${Math.abs(r)}`,
		`(${fmtS(a)}) + (${fmtS(b)}) = ${fmtS(r)}`,
	];
}

// ---------------------------------------------------------------------------
// Level 3: algebraic sums

function level3(rng: Rng): { x: Sum; c: Case } {
	const c = rng.next() < 0.4 ? 'semplice' : 'segni-doppi';
	for (;;) {
		const n = rng.int(4, 6);
		const vals = Array.from({ length: n }, () => rng.int(1, 20) * (rng.int(0, 1) ? -1 : 1));
		const neg = vals.filter((v) => v < 0).length;
		const sum = vals.reduce((a, b) => a + b, 0);
		if (neg < 2 || neg === n || sum === 0 || Math.abs(sum) > 40) continue;
		const terms = vals.map((v, i) => (i === 0 ? T(1, L(v)) : T(v < 0 ? -1 : 1, L(Math.abs(v)))));
		if (c === 'segni-doppi') {
			// one "- (-a)" on a positive term, sometimes a second double sign anywhere
			const posIdx = vals.map((v, i) => (i > 0 && v > 0 ? i : -1)).filter((i) => i > 0);
			if (!posIdx.length) continue;
			const i1 = rng.pick(posIdx);
			terms[i1] = T(-1, L(-vals[i1], true));
			if (rng.int(0, 1)) {
				const others = vals.map((_, i) => i).filter((i) => i > 0 && i !== i1);
				const i2 = rng.pick(others);
				const v = vals[i2];
				terms[i2] = v > 0 ? T(-1, L(-v, true)) : rng.next() < 0.7 ? T(1, L(v, true)) : T(-1, L(-v, true));
			}
		}
		return { x: S(...terms), c };
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 6: expressions built at random, kept when every rule holds

interface ExprLevel {
	products: boolean;
	/** Share of each bracket height 1..3 (tonde, quadre, graffe). */
	depths: [number, number][];
	maxLit: number;
	maxVal: number;
	result: number;
	minNumbers: number;
	maxNumbers: number;
	maxGroups: number;
}

export const EXPR_LEVELS: Record<number, ExprLevel> = {
	4: { products: false, depths: [[1, 0.5], [2, 0.5]], maxLit: 20, maxVal: 100, result: 30, minNumbers: 4, maxNumbers: 8, maxGroups: 2 },
	6: { products: true, depths: [[1, 0.3], [2, 0.4], [3, 0.3]], maxLit: 20, maxVal: 200, result: 50, minNumbers: 5, maxNumbers: 11, maxGroups: 4 },
};

const CASE_BY_HEIGHT = ['tonde', 'quadre', 'graffe'];

class Retry extends Error {}

function buildSum(rng: Rng, depth: number, o: ExprLevel, top: boolean): Sum {
	const n = top ? rng.int(2, o.products ? 3 : 4) : rng.next() < 0.65 ? 2 : 3;
	const deep = depth > 0 ? rng.int(0, n - 1) : -1;
	const terms: Term[] = [];
	for (let i = 0; i < n; i++) {
		let x: Node;
		if (i === deep) x = groupTerm(rng, depth, o);
		else {
			const u = rng.next();
			if (o.products && u < (top ? 0.45 : 0.3)) x = product(rng, depth > 1 && rng.next() < 0.3 ? depth - 1 : 0, o, top);
			else if (depth > 1 && u < 0.55) x = G(buildSum(rng, rng.int(0, depth - 2), o, false));
			else {
				const a = rng.int(1, o.maxLit);
				x = L(i === 0 ? (rng.next() < 0.35 ? -a : a) : rng.next() < 0.12 ? -a : a);
			}
		}
		// a minus before the first term only at the start of the expression, and only before a bracket
		const s: 1 | -1 = i === 0 ? (top && x.t === 'g' && rng.next() < 0.3 ? -1 : 1) : rng.int(0, 1) ? -1 : 1;
		terms.push(T(s, x));
	}
	return S(...terms);
}

function groupTerm(rng: Rng, depth: number, o: ExprLevel): Node {
	if (o.products && rng.next() < 0.5) return product(rng, depth, o, false);
	return G(buildSum(rng, depth - 1, o, false));
}

/** A product or quotient; with depth > 0 one factor is a bracket of that height. Divisions exact. */
function product(rng: Rng, depth: number, o: ExprLevel, top: boolean): Node {
	const n = top && rng.next() < 0.2 ? 3 : 2;
	const gi = depth > 0 ? rng.int(0, n - 1) : -1;
	const lit = () => rng.int(2, 10) * (rng.int(0, 1) ? -1 : 1);
	const f: Node[] = [];
	const ops: MulOp[] = [];
	let acc = 0;
	for (let i = 0; i < n; i++) {
		if (i === gi) {
			const g = G(buildSum(rng, depth - 1, o, false));
			const v = evaluate(g);
			if (v === null) throw new Retry();
			if (i > 0) ops.push('*');
			f.push(g);
			acc = i === 0 ? v : acc * v;
			continue;
		}
		if (i === 0) {
			const v = lit();
			f.push(L(v));
			acc = v;
			continue;
		}
		const divs = [2, 3, 4, 5, 6, 7, 8, 9, 10].filter((d) => acc !== 0 && acc % d === 0 && Math.abs(acc) / d >= 2);
		if (divs.length && rng.next() < 0.45) {
			const d = rng.pick(divs) * (rng.int(0, 1) ? -1 : 1);
			ops.push(':');
			f.push(L(d));
			acc = acc / d;
		} else {
			const v = lit();
			ops.push('*');
			f.push(L(v));
			acc *= v;
		}
	}
	return { t: 'prod', f, ops };
}

/** Violations of the size and shape rules for an expression of level 4 or 6. */
function exprViolations(x: Sum, level: number): string[] {
	const o = EXPR_LEVELS[level];
	const v: string[] = [];
	const value = evaluate(x);
	if (value === null) return ['una divisione non è esatta'];
	if (value === 0) v.push('risultato nullo');
	if (Math.abs(value) > o.result) v.push(`risultato ${value} oltre ±${o.result}`);
	const tr = trace(x);
	for (const s of tr) {
		if (Math.abs(s.r) > o.maxVal) v.push(`risultato intermedio ${s.r} oltre ±${o.maxVal}`);
		if (s.op === '*' && (Math.min(Math.abs(s.a), Math.abs(s.b)) < 2 || Math.min(Math.abs(s.a), Math.abs(s.b)) > 10)) v.push(`prodotto ${s.a} · ${s.b} fuori misura`);
		if (s.op === ':' && (Math.abs(s.b) < 2 || Math.abs(s.b) > 10 || s.a === 0)) v.push(`divisione ${s.a} : ${s.b} fuori misura`);
	}
	const lits = literals(x);
	if (lits.some((l) => l.v === 0 || Math.abs(l.v) > o.maxLit)) v.push('numero nel testo fuori misura');
	if (lits.some((l) => l.signed && l.v > 0)) v.push('segno + esplicito');
	if (lits.length < o.minNumbers || lits.length > o.maxNumbers) v.push(`numeri nel testo: ${lits.length}, attesi da ${o.minNumbers} a ${o.maxNumbers}`);
	const gs = groups(x);
	if (gs.length > o.maxGroups) v.push(`${gs.length} parentesi, al massimo ${o.maxGroups}`);
	for (const g of gs) {
		if (g.c.terms.length < 2) v.push('parentesi senza una somma dentro');
		if (g.c.terms[0].x.t === 'g') v.push('parentesi subito dopo una parentesi aperta');
		if (g.k !== height(g.c) + 1) v.push('parentesi nell’ordine sbagliato (tonde, quadre, graffe)');
	}
	const h = height(x);
	if (!o.depths.some(([d]) => d - 1 === h)) v.push(`parentesi fino al tipo ${h}`);
	let prods = 0, signedProd = false, minusGroup = false;
	walk(x, (y) => {
		if (y.t === 'prod') {
			prods++;
			if (y.f.some((f) => f.t === 'n' && f.v < 0)) signedProd = true;
		}
		if (y.t === 'sum' && y.terms.some((tm) => tm.s < 0 && tm.x.t === 'g')) minusGroup = true;
	});
	if (!o.products && prods) v.push('moltiplicazioni al livello 4');
	if (o.products && !prods) v.push('nessuna moltiplicazione o divisione');
	if (o.products && !signedProd) v.push('nessun prodotto con un fattore negativo scritto');
	if (!o.products && !minusGroup) v.push('nessuna parentesi preceduta da −');
	if (!tr.some((s) => s.op === '+' || s.op === '-')) v.push('nessuna addizione o sottrazione');
	if (evaluate(x, { flat: true }) === value) v.push('togliere male le parentesi non cambia il risultato');
	if (o.products && evaluate(x, { ltr: true }) === value) v.push('le priorità non cambiano il risultato');
	return v;
}

function exprSample(rng: Rng, level: number): { x: Sum; c: Case } {
	const o = EXPR_LEVELS[level];
	const u = rng.next();
	let acc = 0;
	let depth = o.depths[o.depths.length - 1][0];
	for (const [d, w] of o.depths) {
		acc += w;
		if (u < acc) {
			depth = d;
			break;
		}
	}
	for (let attempt = 0; attempt < 20000; attempt++) {
		let x: Sum;
		try {
			x = withBrackets(buildSum(rng, depth, o, true));
		} catch (e) {
			if (e instanceof Retry) continue;
			throw e;
		}
		if (height(x) !== depth - 1) continue;
		if (exprViolations(x, level).length) continue;
		return { x, c: CASE_BY_HEIGHT[depth - 1] };
	}
	throw new Error(`${ID}: no expression for level ${level}, seed ${rng.seed}`);
}

// ---------------------------------------------------------------------------
// Level 5: rule of signs

function level5(rng: Rng): { x: Sum; c: Case } {
	const c = rng.next() < 0.6 ? 'prodotto' : 'quoziente';
	for (;;) {
		if (c === 'prodotto') {
			const n = rng.int(3, 4);
			const abs = Array.from({ length: n }, () => rng.int(1, 9));
			if (abs.filter((a) => a === 1).length > 1) continue;
			const p = abs.reduce((a, b) => a * b, 1);
			if (p > 300 || p < 12) continue;
			const f = abs.map((a) => L(rng.int(0, 1) ? -a : a, true));
			if (!f.some((l) => l.v < 0)) continue;
			return { x: S(T(1, { t: 'prod', f, ops: f.slice(1).map(() => '*' as MulOp) })), c };
		}
		const b = rng.int(2, 12) * (rng.int(0, 1) ? -1 : 1);
		const q = rng.int(2, 15) * (rng.int(0, 1) ? -1 : 1);
		if (b > 0 && q > 0) continue;
		return { x: S(T(1, { t: 'prod', f: [L(b * q, true), L(b, true)], ops: [':'] })), c };
	}
}

function signSteps(x: Prod): string[] {
	const vals = x.f.map((f) => (f as Lit).v);
	const r = evaluate(x) as number;
	if (x.ops[0] === ':') {
		const [a, b] = vals;
		return [
			`${t(a * b > 0 ? 'Dividendo e divisore sono concordi: il quoziente è positivo' : 'Dividendo e divisore sono discordi: il quoziente è negativo')}`,
			`${t('Valore assoluto: ')}${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(r)}`,
			`${latex(x)} = ${fmtS(r)}`,
		];
	}
	const neg = vals.filter((v) => v < 0).length;
	return [
		`${t('Fattori negativi: ')}${neg}${t(neg % 2 === 0 ? ', in numero pari: il prodotto è positivo' : ', in numero dispari: il prodotto è negativo')}`,
		`${t('Valore assoluto: ')}${vals.map((v) => Math.abs(v)).join(' \\cdot ')} = ${Math.abs(r)}`,
		`${latex(x)} = ${fmtS(r)}`,
	];
}

// ---------------------------------------------------------------------------
// Check

const SIGNED_LEVELS = [1, 2, 5];

/** The case of a level from the tree, or a list of violations. */
function levelCase(x: Sum, level: number): { c: Case | null; v: string[] } {
	const v: string[] = [];
	const lits = literals(x);
	const allLits = x.terms.every((tm) => tm.x.t === 'n');
	if (level === 1 || level === 2) {
		if (x.terms.length !== 2 || !allLits || !lits.every((l) => l.signed)) return { c: null, v: ['servono due numeri con il segno tra parentesi'] };
		const [a, b] = lits.map((l) => l.v);
		if (a === 0 || b === 0 || Math.abs(a) > 25 || Math.abs(b) > 25) v.push('numeri fuori misura');
		if (x.terms[0].s !== 1) v.push('primo termine con un segno davanti');
		if (level === 1) {
			if (x.terms[1].s !== 1) v.push('non è un’addizione');
			if (a * b < 0 && Math.abs(a) === Math.abs(b)) v.push('addendi opposti');
			return { c: a * b > 0 ? 'concordi' : 'discordi', v };
		}
		if (x.terms[1].s !== -1) v.push('non è una sottrazione');
		if (a === b) v.push('differenza nulla');
		return { c: b < 0 ? 'meno-meno' : 'meno-piu', v };
	}
	if (level === 3) {
		if (x.terms.length < 4 || x.terms.length > 6 || !allLits) return { c: null, v: ['servono da 4 a 6 numeri senza parentesi'] };
		if (lits[0].signed || (x.terms[0].s < 0 && lits[0].v < 0)) v.push('primo termine scritto male');
		if (lits.some((l) => l.v === 0 || Math.abs(l.v) > 20)) v.push('numeri fuori misura');
		if (lits.some((l, i) => i > 0 && !l.signed && l.v < 0)) v.push('negativo non tra parentesi');
		const doubles = lits.filter((l, i) => i > 0 && l.signed).length;
		if (doubles > 2) v.push('troppi segni doppi');
		const vals = termValues(x);
		const neg = vals.filter((w) => w < 0).length;
		if (neg < 2 || neg === vals.length) v.push('servono almeno due termini negativi e uno positivo');
		const r = vals.reduce((a, b) => a + b, 0);
		if (r === 0 || Math.abs(r) > 40) v.push(`risultato ${r} fuori misura`);
		return { c: doubles ? 'segni-doppi' : 'semplice', v };
	}
	if (level === 5) {
		const p = x.terms.length === 1 && x.terms[0].s === 1 ? x.terms[0].x : null;
		if (!p || p.t !== 'prod' || !p.f.every((f) => f.t === 'n' && f.signed)) return { c: null, v: ['serve un prodotto o un quoziente di numeri con il segno'] };
		const vals = p.f.map((f) => (f as Lit).v);
		if (!vals.some((w) => w < 0)) v.push('nessun fattore negativo');
		if (p.ops.every((op) => op === '*')) {
			if (vals.length < 3 || vals.length > 4) v.push('servono 3 o 4 fattori');
			if (vals.some((w) => w === 0 || Math.abs(w) > 9)) v.push('fattori fuori misura');
			if (vals.filter((w) => Math.abs(w) === 1).length > 1) v.push('più di un fattore ±1');
			const r = Math.abs(vals.reduce((a, b) => a * b, 1));
			if (r > 300 || r < 12) v.push(`prodotto ${r} fuori misura`);
			return { c: 'prodotto', v };
		}
		if (vals.length !== 2) return { c: null, v: ['un quoziente ha due numeri'] };
		const [a, b] = vals;
		if (Math.abs(b) < 2 || Math.abs(b) > 12 || a % b !== 0 || Math.abs(a / b) < 2 || Math.abs(a / b) > 15) v.push('divisione fuori misura o non esatta');
		return { c: 'quoziente', v };
	}
	if (EXPR_LEVELS[level]) {
		v.push(...exprViolations(x, level));
		return { c: CASE_BY_HEIGHT[height(x)] ?? null, v };
	}
	return { c: null, v: [`livello sconosciuto ${level}`] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	let x: Sum;
	try {
		x = parseAscii(String(p.expr));
	} catch (e) {
		return [`params.expr non valido: ${(e as Error).message}`];
	}
	if (problemLatex(x) !== sample.problem) v.push('il testo non corrisponde a params.expr');
	if (phoneLines(latex(x)).some((l) => emWidth(l) > PROBLEM_EM)) v.push('riga troppo larga per il telefono');
	const value = evaluate(x);
	if (value === null) return [...v, 'una divisione non è esatta'];
	if (sample.answer.kind !== 'number' || sample.answer.value !== String(value)) v.push('risposta diversa dal valore');
	if (String(p.value) !== String(value)) v.push('params.value diverso dal valore');
	const { c, v: lv } = levelCase(x, sample.level);
	v.push(...lv);
	if (c !== p.case) v.push(`params.case ${p.case}, ma l’esercizio è ${c}`);
	if (sample.choice) {
		const ch = sample.choice;
		const keys = ch.options.map((o) => o.values.join('|'));
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		if (new Set(keys).size !== keys.length) v.push('opzioni ripetute');
		if (keys[ch.correct] !== String(value)) v.push('opzione corretta sbagliata');
		if (keys.filter((k) => k === String(value)).length !== 1) v.push('più di una opzione corretta');
		if (keys.some((k) => !/^-?\d+$/.test(k))) v.push('opzione che non è un intero');
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const x = parseAscii(String(sample.params.expr));
	const value = evaluate(x) as number;
	const lvl = sample.level;
	const show = SIGNED_LEVELS.includes(lvl) ? fmtS : fmt;
	const opt = (w: number | null): ChoiceOption | null => (w === null || !Number.isSafeInteger(w) ? null : { latex: show(w), values: [String(w)] });
	const cands: (number | null)[] = [];
	if (lvl === 1 || lvl === 2) {
		const [a, b0] = literals(x).map((l) => l.v);
		const b = lvl === 2 ? -b0 : b0; // the addend after taking the opposite
		const A = Math.abs(a), B = Math.abs(b);
		const big = A > B ? Math.sign(a) : Math.sign(b);
		if (lvl === 2) cands.push(a + b0); // the opposite not taken
		if (a * b > 0) cands.push(-value, Math.sign(a) * Math.abs(A - B), -Math.sign(a) * Math.abs(A - B));
		else cands.push(-value, big * (A + B), -big * (A + B));
		if (lvl === 2) cands.push(-(a + b0));
	} else if (lvl === 3) {
		const vals = termValues(x);
		const lits = literals(x);
		const flips = vals.map((w, i) => ({ w, i, pri: i > 0 && lits[i].signed ? 0 : i === 0 && w < 0 ? 1 : w < 0 ? 2 : 3 }));
		flips.sort((p, q) => p.pri - q.pri);
		cands.push(...flips.slice(0, 2).map((f) => value - 2 * f.w), -value, ...flips.slice(2).map((f) => value - 2 * f.w));
	} else if (lvl === 5) {
		const p = x.terms[0].x as Prod;
		const vals = p.f.map((f) => (f as Lit).v);
		cands.push(-value);
		if (p.ops[0] === '*') {
			for (const i of shuffle(rng, vals.map((_, i) => i))) {
				if (Math.abs(vals[i]) >= 2) cands.push(value / vals[i]); // a factor forgotten
			}
			cands.push(-value / vals[vals.length - 1]);
		}
	} else {
		cands.push(evaluate(x, { flat: true }), evaluate(x, { keepSign: true }), evaluate(x, { ltr: true }), -value);
	}
	const steps = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 4, -4, 6, -6, 7, -7];
	return buildChoice(
		rng,
		opt(value)!,
		cands.map((w) => (w === null || w === value || Math.abs(w) > 200 ? null : opt(w))),
		(i) => (i < steps.length ? opt(value + steps[i]) : null),
	);
}

// ---------------------------------------------------------------------------
// Generator

function build(rng: Rng, level: number): Sample {
	let x: Sum, c: Case;
	if (level === 1 || level === 2) ({ x, c } = twoTerms(rng, level));
	else if (level === 3) ({ x, c } = level3(rng));
	else if (level === 5) ({ x, c } = level5(rng));
	else if (EXPR_LEVELS[level]) ({ x, c } = exprSample(rng, level));
	else throw new Error(`${ID}: unknown level ${level}`);
	const value = evaluate(x) as number;
	let prompt = "Calcola il valore dell'espressione.";
	let steps: string[];
	if (level === 1 || level === 2) {
		const [a, b] = literals(x).map((l) => l.v);
		prompt = level === 1 ? 'Calcola la somma.' : 'Calcola la differenza.';
		steps = level === 1 ? additionSteps(a, b) : [`${t('Sottrarre un numero vuol dire sommare il suo opposto: ')}${latex(x)} = (${fmtS(a)}) + (${fmtS(-b)})`, ...additionSteps(a, -b)];
	} else if (level === 3) {
		const vals = termValues(x);
		steps = [];
		const plain = plainSum(vals);
		if (plain !== latex(x)) steps.push(`${t('Si riducono i segni doppi: ')}${latex(x)} = ${plain}`);
		steps.push(...groupingSteps(vals));
	} else if (level === 4) {
		steps = [];
		let cur = x;
		for (let k = 0; k <= 1; k++) {
			if (!groups(cur).some((g) => g.k === k)) continue;
			cur = removeKind(cur, k);
			steps.push(`${t(`Si tolgono le ${k === 0 ? 'tonde' : 'quadre'} (dove davanti c'è un `)}-${t(', si cambia segno a tutti i termini dentro): ')}${latex(cur)}`);
		}
		steps.push(...groupingSteps(termValues(cur)));
	} else if (level === 5) {
		prompt = 'Calcola con la regola dei segni.';
		steps = signSteps(x.terms[0].x as Prod);
	} else steps = exprSteps(x);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt,
		problem: problemLatex(x),
		solution: SIGNED_LEVELS.includes(level) ? fmtS(value) : fmt(value),
		steps,
		answer: { kind: 'number', value: String(value) },
		params: { expr: ascii(x), value: String(value), case: c },
	};
}

export const numeriInteriOperazioni: Generator = {
	id: ID,
	title: 'Operazioni in ℤ',
	levels: {
		1: { label: 'Addizione di due interi', constraints: ['due numeri con il segno tra parentesi, valore assoluto da 1 a 25', 'circa 4 su 10 concordi, 6 su 10 discordi', 'mai due opposti'] },
		2: { label: 'Sottrazione di due interi', constraints: ['due numeri con il segno tra parentesi, valore assoluto da 1 a 25', 'metà con il sottraendo negativo (meno meno)', 'differenza mai nulla'] },
		3: { label: 'Somma algebrica', constraints: ['da 4 a 6 termini, valore assoluto da 1 a 20', 'almeno due termini negativi e uno positivo', 'circa 6 su 10 con uno o due segni doppi, come − (−5)', 'risultato non nullo, fino a ±40'] },
		4: { label: 'Togliere le parentesi', constraints: ['solo + e −, al più due parentesi', 'almeno una parentesi preceduta da −', 'metà con le sole tonde, metà con una quadra', 'cambiare segno solo al primo termine dà un altro risultato'] },
		5: { label: 'Regola dei segni', constraints: ['6 su 10 prodotti di 3 o 4 fattori, 4 su 10 divisioni esatte', 'numeri con il segno tra parentesi, almeno un negativo'] },
		6: { label: 'Espressioni', constraints: ['le quattro operazioni con tonde, quadre o graffe', 'divisioni esatte, divisori da 2 a 10', 'priorità e parentesi cambiano il risultato', 'risultato non nullo, fino a ±50'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!this.levels[level]) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const s = build(rng, level);
			if (check(s).length === 0) return s;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriInteriOperazioni;
