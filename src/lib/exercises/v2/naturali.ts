/**
 * Shared machinery for the natural-number generators (numeri-naturali-operazioni,
 * numeri-naturali-mcm-mcd, numeri-naturali-potenze).
 *
 * - Expression trees in ℕ: LaTeX (\cdot, ":" and brackets tonde, quadre, graffe from the inside
 *   out), an ASCII form for the independent checker, evaluation that refuses anything outside ℕ.
 * - Evaluation with the mistakes students make (left to right ignoring priorities, brackets
 *   ignored, 2^3 = 6, (a + b)^2 = a^2 + b^2), for the distractors.
 * - Solution steps in the order of the lesson: tonde, quadre, graffe; inside each, powers, then
 *   multiplications and divisions, then additions and subtractions.
 * - A backwards builder of expressions: the value is chosen first and split into terms and
 *   factors, so every intermediate result is a natural number and every division is exact.
 * - Prime factorisation and multiple-choice helpers.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

// ---------------------------------------------------------------------------
// Trees

export type Op = '+' | '-' | '*' | ':';
export type Node =
	| { t: 'n'; v: number }
	| { t: 'op'; op: Op; l: Node; r: Node }
	| { t: 'pow'; b: Node; e: Node }
	/** A bracket; k is 0 (tonde), 1 (quadre) or 2 (graffe), fixed by withBrackets(). */
	| { t: 'g'; c: Node; k: number };

export const N = (v: number): Node => ({ t: 'n', v });
export const O = (op: Op, l: Node, r: Node): Node => ({ t: 'op', op, l, r });
export const P = (b: Node | number, e: Node | number): Node => ({ t: 'pow', b: typeof b === 'number' ? N(b) : b, e: typeof e === 'number' ? N(e) : e });
export const G = (c: Node): Node => ({ t: 'g', c, k: -1 });

/** Left-associative chain: chain([a, b, c], ['+', '-']) is (a + b) - c. */
export function chain(items: Node[], ops: Op[]): Node {
	if (items.length !== ops.length + 1) throw new Error('chain: items and ops do not match');
	return items.slice(1).reduce((acc, it, i) => O(ops[i], acc, it), items[0]);
}

/**
 * Sets the kind of every bracket from how many brackets it contains: tonde contain none, quadre
 * contain tonde, graffe contain quadre. The kinds stay fixed while the steps resolve the inner ones.
 */
export function withBrackets(x: Node): Node {
	const rec = (y: Node): [Node, number] => {
		switch (y.t) {
			case 'n':
				return [y, -1];
			case 'op': {
				const [l, hl] = rec(y.l), [r, hr] = rec(y.r);
				return [O(y.op, l, r), Math.max(hl, hr)];
			}
			case 'pow': {
				const [b, hb] = rec(y.b), [e, he] = rec(y.e);
				return [{ t: 'pow', b, e }, Math.max(hb, he)];
			}
			case 'g': {
				const [c, hc] = rec(y.c);
				const k = hc + 1;
				if (k > 2) throw new Error('withBrackets: more than three levels of brackets');
				return [{ t: 'g', c, k }, k];
			}
		}
	};
	return rec(x)[0];
}

/** Highest bracket kind in the tree, -1 without brackets. */
export function bracketHeight(x: Node): number {
	switch (x.t) {
		case 'n':
			return -1;
		case 'op':
			return Math.max(bracketHeight(x.l), bracketHeight(x.r));
		case 'pow':
			return Math.max(bracketHeight(x.b), bracketHeight(x.e));
		case 'g':
			return x.k;
	}
}

/**
 * Throws unless the tree is exactly what its LaTeX says under the usual priorities: no hidden
 * brackets. The right operand of + and - is not a sum; operands of \cdot and : are not sums, and
 * the right one is a single factor; a power has a number or a bracket as base.
 */
export function assertWellFormed(x: Node): void {
	const isSum = (y: Node) => y.t === 'op' && (y.op === '+' || y.op === '-');
	switch (x.t) {
		case 'n':
			if (!Number.isSafeInteger(x.v) || x.v < 0) throw new Error(`not a natural number: ${x.v}`);
			return;
		case 'op':
			if (x.op === '+' || x.op === '-') {
				if (isSum(x.r)) throw new Error('sum on the right of + or - without brackets');
			} else if (isSum(x.l) || x.r.t === 'op') throw new Error('product or quotient with a hidden bracket');
			assertWellFormed(x.l);
			assertWellFormed(x.r);
			return;
		case 'pow':
			if (x.b.t !== 'n' && x.b.t !== 'g') throw new Error('power base must be a number or a bracket');
			assertWellFormed(x.b);
			assertWellFormed(x.e);
			return;
		case 'g':
			if (x.k < 0) throw new Error('bracket kind not set: call withBrackets');
			assertWellFormed(x.c);
			return;
	}
}

// ---------------------------------------------------------------------------
// Formatting

/** Natural number in LaTeX, with a thin space every three digits from 10 000 up, as in the lessons. */
export function fmt(v: number): string {
	const s = String(v);
	if (v < 10000) return s;
	return s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
}

const SYM: Record<Op, string> = { '+': '+', '-': '-', '*': '\\cdot', ':': ':' };
const OPEN = ['(', '[', '\\{'];
const CLOSE = [')', ']', '\\}'];
const AOPEN = ['(', '[', '{'];
const ACLOSE = [')', ']', '}'];

/** Exponent in LaTeX: "^3", or "^{12}", "^{5 + 3}" when it is more than one digit. */
export function expLatex(e: Node | number): string {
	const n = typeof e === 'number' ? N(e) : e;
	return n.t === 'n' && n.v < 10 ? `^${n.v}` : `^{${latex(n)}}`;
}

export function latex(x: Node): string {
	switch (x.t) {
		case 'n':
			return fmt(x.v);
		case 'op':
			return `${latex(x.l)} ${SYM[x.op]} ${latex(x.r)}`;
		case 'pow':
			return `${latex(x.b)}${expLatex(x.e)}`;
		case 'g':
			return `${OPEN[x.k]}${latex(x.c)}${CLOSE[x.k]}`;
	}
}

// Widths in em of a formula, fitted on 600 expressions of these generators as KaTeX draws them in
// display (spacing around the operators included); KaTeX sets its formulas at 1.21 times the text.
const W_DIGIT = 0.5;
const W_THIN = 0.167;
const W_OP: Record<Op, number> = { '+': 1.01, '-': 1.01, '*': 0.885, ':': 0.835 };
const W_OPEN = [0.333, 0.335, 0.48];
/** A digit of an exponent. */
const W_SCRIPT_DIGIT = 0.4;
const KATEX_SCALE = 1.21;

/** A piece of the expression as it is written: a break may come before an operator. */
interface Piece {
	tex: string;
	em: number;
	/** How many brackets are open around it. */
	depth: number;
	op: boolean;
}

function numEm(v: number): number {
	const s = String(v);
	return s.length * W_DIGIT + (v >= 10000 ? Math.floor((s.length - 1) / 3) * W_THIN : 0);
}

/** Width in em of the formula font of the expression as latex() writes it, in one line. */
export function widthEm(x: Node): number {
	return pieces(x).reduce((a, p) => a + p.em, 0);
}

function pieces(x: Node, depth = 0): Piece[] {
	switch (x.t) {
		case 'n':
			return [{ tex: fmt(x.v), em: numEm(x.v), depth, op: false }];
		case 'op':
			return [...pieces(x.l, depth), { tex: SYM[x.op], em: W_OP[x.op], depth, op: true }, ...pieces(x.r, depth)];
		case 'pow': {
			// base and exponent stay together
			const b = pieces(x.b, depth);
			const last = b[b.length - 1];
			b[b.length - 1] = { ...last, tex: `${last.tex}${expLatex(x.e)}`, em: last.em + (W_SCRIPT_DIGIT / W_DIGIT) * widthEm(x.e) };
			return b;
		}
		case 'g':
			return [
				{ tex: OPEN[x.k], em: W_OPEN[x.k], depth, op: false },
				...pieces(x.c, depth + 1),
				{ tex: CLOSE[x.k], em: W_OPEN[x.k], depth, op: false },
			];
	}
}

/**
 * The widest line, in em of the formula font, that fits a phone: the exercise page gives a problem
 * formula 350 px at 18 px, that is 16.07 em once KaTeX has scaled it by 1.21. On the expressions of
 * these generators the estimate is between 0 and 2 px over what the browser draws, never under.
 */
export const LINE_EM = 350 / 18 / KATEX_SCALE;

/**
 * Where the lines of the expression begin (indices of operator pieces), each line within LINE_EM.
 * A break before + or - inside d brackets costs 2d. A break before \cdot or : costs 2d + 1 when the
 * term it splits begins the line ("2 \cdot 3" / "\cdot [4 + 5]"), 2d + 2 when the term began after a
 * + or a - on the same line: "36 + 2" / "\cdot [...]" reads as (36 + 2) \cdot [...].
 * The choice: as few lines as possible; then the smallest highest cost; then fewer lines with just a
 * number on them ("2", "\cdot 15", under an eighth of the width); then the smallest total cost; then
 * the shortest line as long as possible.
 */
function breaks(ps: Piece[]): number[] {
	const sum = [0];
	for (const p of ps) sum.push(sum[sum.length - 1] + p.em);
	const width = (a: number, b: number) => sum[b] - sum[a];
	if (width(0, ps.length) <= LINE_EM) return [0];
	const ops = ps.map((p, i) => (p.op ? i : -1)).filter((i) => i > 0);
	type Plan = { starts: number[]; key: number[] };
	let best: Plan | null = null;
	const better = (x: number[], y: number[]) => {
		for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i];
		return false;
	};
	const visit = (starts: number[], left: number) => {
		const s = starts[starts.length - 1];
		if (width(s, ps.length) <= LINE_EM) {
			const cuts = starts.slice(1);
			const lines = starts.map((a, i) => width(a, starts[i + 1] ?? ps.length));
			const cost = (i: number, from: number) => {
				const d = ps[i].depth;
				if (ps[i].tex === '+' || ps[i].tex === '-') return 2 * d;
				for (let j = i - 1; j > from && ps[j].depth >= d; j--) if (ps[j].depth === d && (ps[j].tex === '+' || ps[j].tex === '-')) return 2 * d + 2;
				return 2 * d + 1;
			};
			const costs = cuts.map((i, k) => cost(i, starts[k]));
			const key = [
				starts.length,
				Math.max(...costs),
				lines.filter((w) => w < LINE_EM / 8).length,
				costs.reduce((a, b) => a + b, 0),
				-Math.min(...lines),
			];
			if (!best || better(key, best.key)) best = { starts, key };
			return;
		}
		if (!left) return;
		for (const i of ops) if (i > s && width(s, i) <= LINE_EM) visit([...starts, i], left - 1);
	};
	for (let n = 1; n <= 4 && !best; n++) visit([0], n);
	if (!best) throw new Error(`problemLatex: no way to break ${ps.map((p) => p.tex).join(' ')}`);
	return (best as Plan).starts;
}

/**
 * The expression as the problem shows it: latex() when it fits a phone, otherwise an aligned
 * expression broken before a +, -, \cdot or : as breaks() chooses, each line within LINE_EM.
 * Every continuation line begins with the operator; brackets are plain, so a break may fall inside them.
 */
export function problemLatex(x: Node): string {
	const ps = pieces(x);
	const starts = breaks(ps);
	if (starts.length === 1) return latex(x);
	const lines = starts.map((a, i) =>
		ps
			.slice(a, starts[i + 1] ?? ps.length)
			.map((p) => p.tex)
			.join(' ')
			.replace(/([([]|\\\{) /g, '$1')
			.replace(/ ([)\]]|\\\})/g, '$1'),
	);
	return `\\begin{aligned}&${lines.join(' \\\\ &\\quad ')}\\end{aligned}`;
}

/** ASCII for the checker: * and :, brackets ( [ {, exponent "^3" or "^(12)". */
export function ascii(x: Node): string {
	switch (x.t) {
		case 'n':
			return String(x.v);
		case 'op':
			return `${ascii(x.l)}${x.op}${ascii(x.r)}`;
		case 'pow':
			return `${ascii(x.b)}^${x.e.t === 'n' && x.e.v < 10 ? x.e.v : `(${ascii(x.e)})`}`;
		case 'g':
			return `${AOPEN[x.k]}${ascii(x.c)}${ACLOSE[x.k]}`;
	}
}

/** a^e as a node, for the power generators. */
export const powLatex = (a: number, e: number | Node): string => `${fmt(a)}${expLatex(e)}`;

// ---------------------------------------------------------------------------
// Evaluation in ℕ

/** Nothing above this is ever computed: a result beyond it counts as "not a valid answer". */
export const LIMIT = 100_000_000;

/** Priorities for evaluation; the correct ones are STD. */
export type Prec = Record<Op, number>;
export const STD: Prec = { '+': 1, '-': 1, '*': 2, ':': 2 };

export interface Mode {
	prec?: Prec;
	/** Brackets are read as if they were not there (except around the base of a power). */
	noBrackets?: boolean;
	/** a^n computed as a \cdot n. */
	powTimes?: boolean;
	/** (a + b)^n computed as a^n + b^n. */
	powDistrib?: boolean;
}

/** The mistakes, as evaluation modes. */
export const MISTAKE = {
	/** Left to right, ignoring the priority of \cdot and : over + and -. */
	leftToRight: { prec: { '+': 1, '-': 1, '*': 1, ':': 1 } } as Mode,
	/** Multiplication before division. */
	mulFirst: { prec: { '+': 1, '-': 1, '*': 3, ':': 2 } } as Mode,
	/** Addition before subtraction. */
	addFirst: { prec: { '+': 1.5, '-': 1, '*': 2, ':': 2 } } as Mode,
	noBrackets: { noBrackets: true } as Mode,
	powTimes: { powTimes: true } as Mode,
	powDistrib: { powDistrib: true } as Mode,
};

export function applyOp(op: Op, a: number, b: number): number | null {
	let r: number;
	switch (op) {
		case '+':
			r = a + b;
			break;
		case '-':
			if (a < b) return null;
			r = a - b;
			break;
		case '*':
			r = a * b;
			break;
		case ':':
			if (b === 0 || a % b !== 0) return null;
			r = a / b;
			break;
	}
	return Number.isSafeInteger(r) && r <= LIMIT ? r : null;
}

export function power(b: number, e: number): number | null {
	if (b === 0 && e === 0) return null;
	let r = 1;
	for (let i = 0; i < e; i++) {
		r *= b;
		if (r > LIMIT) return null;
	}
	return r;
}

function evalTokens(vals: number[], ops: Op[], prec: Prec): number | null {
	vals = [...vals];
	ops = [...ops];
	while (ops.length) {
		const top = Math.max(...ops.map((o) => prec[o]));
		const i = ops.findIndex((o) => prec[o] === top);
		const r = applyOp(ops[i], vals[i], vals[i + 1]);
		if (r === null) return null;
		vals.splice(i, 2, r);
		ops.splice(i, 1);
	}
	return vals[0];
}

/** Top-level terms of a sum: a - b + c is [+a, -b, +c]. */
export function sumTerms(x: Node): { sign: '+' | '-'; node: Node }[] {
	if (x.t === 'op' && (x.op === '+' || x.op === '-')) return [...sumTerms(x.l), { sign: x.op, node: x.r }];
	return [{ sign: '+', node: x }];
}

/** Value of the tree in ℕ, or null if some step leaves ℕ (negative, inexact division, 0^0, too large). */
export function evaluate(x: Node, mode: Mode = {}): number | null {
	switch (x.t) {
		case 'n':
			return x.v;
		case 'g':
			return evaluate(x.c, mode);
		case 'pow': {
			const e = evaluate(x.e);
			if (e === null) return null;
			if (mode.powDistrib && x.b.t === 'g') {
				const terms = sumTerms(x.b.c);
				if (terms.length > 1) {
					const vals: number[] = [];
					for (const t of terms) {
						const v = evaluate(t.node, mode);
						const p = v === null ? null : power(v, e);
						if (p === null) return null;
						vals.push(p);
					}
					return evalTokens(vals, terms.slice(1).map((t) => t.sign), STD);
				}
			}
			const b = evaluate(x.b, mode);
			if (b === null) return null;
			return mode.powTimes ? applyOp('*', b, e) : power(b, e);
		}
		case 'op': {
			const vals: number[] = [];
			const ops: Op[] = [];
			const flat = (y: Node): boolean => {
				if (y.t === 'op') {
					if (!flat(y.l)) return false;
					ops.push(y.op);
					return flat(y.r);
				}
				if (y.t === 'g' && mode.noBrackets) return flat(y.c);
				const v = evaluate(y, mode);
				if (v === null) return false;
				vals.push(v);
				return true;
			};
			if (!flat(x)) return null;
			return evalTokens(vals, ops, mode.prec ?? STD);
		}
	}
}

/** Every operation done by the correct evaluation, in order, for the size checks. */
export interface OpTrace {
	op: Op | '^';
	a: number;
	b: number;
	r: number;
}

export function trace(x: Node): OpTrace[] {
	const out: OpTrace[] = [];
	const rec = (y: Node): number => {
		switch (y.t) {
			case 'n':
				return y.v;
			case 'g':
				return rec(y.c);
			case 'pow': {
				const b = rec(y.b), e = rec(y.e);
				const r = power(b, e);
				if (r === null) throw new Error('trace: power outside ℕ');
				out.push({ op: '^', a: b, b: e, r });
				return r;
			}
			case 'op': {
				const a = rec(y.l), b = rec(y.r);
				const r = applyOp(y.op, a, b);
				if (r === null) throw new Error('trace: operation outside ℕ');
				out.push({ op: y.op, a, b, r });
				return r;
			}
		}
	};
	rec(x);
	return out;
}

/** Literal numbers of the tree (exponents excluded). */
export function literals(x: Node): number[] {
	switch (x.t) {
		case 'n':
			return [x.v];
		case 'op':
			return [...literals(x.l), ...literals(x.r)];
		case 'pow':
			return literals(x.b);
		case 'g':
			return literals(x.c);
	}
}

export function countOps(x: Node, pred: (y: Node) => boolean): number {
	const self = pred(x) ? 1 : 0;
	switch (x.t) {
		case 'n':
			return self;
		case 'op':
			return self + countOps(x.l, pred) + countOps(x.r, pred);
		case 'pow':
			return self + countOps(x.b, pred) + countOps(x.e, pred);
		case 'g':
			return self + countOps(x.c, pred);
	}
}

export const isOp = (...ops: Op[]) => (y: Node) => y.t === 'op' && ops.includes(y.op);

// ---------------------------------------------------------------------------
// Parsing the ASCII back (for check() and toChoice())

/** Parses the ASCII of naturali.ascii() back into a tree (brackets kept, kinds recomputed). */
export function parseAscii(s: string): Node {
	let i = 0;
	const peek = () => s[i];
	const expr = (): Node => {
		let x = term();
		while (peek() === '+' || peek() === '-') {
			const op = s[i++] as '+' | '-';
			x = O(op, x, term());
		}
		return x;
	};
	const term = (): Node => {
		let x = factor();
		while (peek() === '*' || peek() === ':') {
			const op = s[i++] as '*' | ':';
			x = O(op, x, factor());
		}
		return x;
	};
	const factor = (): Node => {
		const b = primary();
		if (peek() === '^') {
			i++;
			if (peek() === '(') {
				i++;
				const e = expr();
				if (s[i++] !== ')') throw new Error('parse: missing ) in exponent');
				return { t: 'pow', b, e };
			}
			const d = s[i++];
			if (!/\d/.test(d)) throw new Error('parse: bad exponent');
			return { t: 'pow', b, e: N(Number(d)) };
		}
		return b;
	};
	const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
	const primary = (): Node => {
		const c = peek();
		if (c in CLOSE) {
			i++;
			const inner = expr();
			if (s[i++] !== CLOSE[c]) throw new Error(`parse: missing ${CLOSE[c]}`);
			return G(inner);
		}
		const m = /^\d+/.exec(s.slice(i));
		if (!m) throw new Error(`parse: unexpected "${c}" in ${s}`);
		i += m[0].length;
		return N(Number(m[0]));
	};
	const x = expr();
	if (i !== s.length) throw new Error(`parse: trailing text in ${s}`);
	return withBrackets(x);
}

// ---------------------------------------------------------------------------
// Steps

const BRACKET_NAME = ['Tonde', 'Quadre', 'Graffe'];

function mapTree(x: Node, f: (y: Node) => Node | null): Node {
	const r = f(x);
	if (r) return r;
	switch (x.t) {
		case 'n':
			return x;
		case 'op':
			return O(x.op, mapTree(x.l, f), mapTree(x.r, f));
		case 'pow':
			return { t: 'pow', b: mapTree(x.b, f), e: x.e };
		case 'g':
			return { t: 'g', c: mapTree(x.c, f), k: x.k };
	}
}

function value(x: Node): Node {
	const v = evaluate(x);
	if (v === null) throw new Error(`steps: ${ascii(x)} is not in ℕ`);
	return N(v);
}

/** A tree without brackets, calculated a stage at a time: powers, \cdot and :, + and -. */
function flatStages(x: Node): { label: string; node: Node }[] {
	const out: { label: string; node: Node }[] = [];
	let cur = x;
	if (countOps(cur, (y) => y.t === 'pow') > 0) {
		cur = mapTree(cur, (y) => (y.t === 'pow' ? value(y) : null));
		out.push({ label: 'Potenze', node: cur });
	}
	if (cur.t === 'op' && countOps(cur, isOp('*', ':')) > 0 && countOps(cur, isOp('+', '-')) > 0) {
		cur = mapTree(cur, (y) => (y.t === 'op' && (y.op === '*' || y.op === ':') ? value(y) : null));
		out.push({ label: 'Moltiplicazioni e divisioni, da sinistra a destra', node: cur });
	}
	if (cur.t !== 'n') {
		const onlyMul = countOps(cur, isOp('+', '-')) === 0;
		out.push({ label: onlyMul ? 'Moltiplicazioni e divisioni, da sinistra a destra' : 'Addizioni e sottrazioni, da sinistra a destra', node: value(cur) });
	}
	return out;
}

/** "18 - 6 = 12": a bracket content calculated in one line. */
function flatChain(x: Node): string {
	return [latex(x), ...flatStages(x).map((s) => latex(s.node))].join(' = ');
}

/**
 * Worked steps of an expression in the order of the lesson: first the tonde, then the quadre, then
 * the graffe, each calculated inside with the priorities; then what is left. Each step says what it
 * does and shows the expression that remains.
 */
export function exprSteps(root: Node): string[] {
	const out: string[] = [];
	let cur = root;
	for (let k = 0; k <= 2; k++) {
		const groups: Node[] = [];
		const collect = (y: Node) => {
			if (y.t === 'g' && y.k === k) groups.push(y);
			else if (y.t === 'op') {
				collect(y.l);
				collect(y.r);
			} else if (y.t === 'pow') collect(y.b);
			else if (y.t === 'g') collect(y.c);
		};
		collect(cur);
		if (!groups.length) continue;
		const chains = groups.map((g) => flatChain((g as { c: Node }).c));
		cur = mapTree(cur, (y) => (y.t === 'g' && y.k === k ? value(y.c) : null));
		const rest = cur.t === 'n' ? '' : `\\text{; resta } ${latex(cur)}`;
		out.push(`\\text{${BRACKET_NAME[k]}: } ${chains.join(',\\quad ')}${rest}`);
	}
	if (cur.t !== 'n') {
		let before: Node = cur;
		for (const s of flatStages(cur)) {
			out.push(`\\text{${s.label}: } ${latex(before)} = ${latex(s.node)}`);
			before = s.node;
		}
	}
	return out;
}

// ---------------------------------------------------------------------------
// Backwards builder

export interface BuildOpts {
	/** Largest number written in the expression. */
	maxLit: number;
	/** Largest intermediate result. */
	maxVal: number;
	/** In a product the smaller factor is at most this; every divisor is at most this. */
	maxFactor: number;
	/** Probability that a factor that could be a bracket becomes one. */
	groupP: number;
	/** Powers allowed (potenze): a factor that is a perfect power may be written as one. */
	pow?: { p: number; maxValue: number; maxExp: number };
}

export function nonZero(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const a = [...xs];
	for (let i = a.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/** Ways of writing v as b^e with b >= 2 and 2 <= e <= maxExp. */
export function powerForms(v: number, maxExp: number): [number, number][] {
	const out: [number, number][] = [];
	for (let e = 2; e <= maxExp; e++) {
		const b = Math.round(v ** (1 / e));
		for (const c of [b - 1, b, b + 1]) if (c >= 2 && power(c, e) === v) out.push([c, e]);
	}
	return out;
}

type Built = Node | null;

/**
 * An expression worth T. `depth` is how many kinds of bracket may appear (0 none, 1 tonde, 2 up to
 * quadre, 3 up to graffe); with `force` at least one bracket of the outermost kind is there.
 */
export function buildSum(rng: Rng, T: number, depth: number, force: boolean, o: BuildOpts, top = false): Built {
	force = force && depth > 0;
	for (let attempt = 0; attempt < 20; attempt++) {
		const k = top ? rng.pick([1, 2, 2, 3, 3]) : rng.pick([2, 2, 3]);
		const signs: ('+' | '-')[] = ['+'];
		const vals: number[] = [0];
		let rest = T;
		for (let i = 1; i < k; i++) {
			const s = rng.int(0, 1) ? '+' : '-';
			const v = rng.int(2, Math.min(o.maxVal, 40));
			signs.push(s);
			vals.push(v);
			rest = s === '+' ? rest - v : rest + v;
		}
		vals[0] = rest;
		if (rest < 1 || rest > o.maxVal) continue;
		let run = 0, ok = true;
		for (let i = 0; i < k; i++) {
			run = signs[i] === '+' ? run + vals[i] : run - vals[i];
			if (run < 0 || run > o.maxVal) ok = false;
		}
		if (!ok) continue;
		const j = rng.int(0, k - 1);
		const terms: Node[] = [];
		for (let i = 0; i < k; i++) {
			const t = buildChain(rng, vals[i], depth, force && i === j, o, signs[i] === '-', k === 1);
			if (!t) {
				ok = false;
				break;
			}
			terms.push(t);
		}
		if (!ok) continue;
		return chain(terms, signs.slice(1));
	}
	return null;
}

function factorPairs(t: number, o: BuildOpts): [number, number][] {
	const out: [number, number][] = [];
	for (let a = 2; a * a <= t; a++) {
		if (t % a === 0 && a <= o.maxFactor && t / a >= 2) out.push([a, t / a]);
	}
	return out;
}

/** A product or quotient chain worth t (a single number when possible and not forced). */
function buildChain(rng: Rng, t: number, depth: number, force: boolean, o: BuildOpts, minus: boolean, alone: boolean): Built {
	type Pattern = { factors: number[]; ops: Op[] };
	const pats: Pattern[] = [];
	for (const [a, b] of factorPairs(t, o)) pats.push({ factors: rng.int(0, 1) ? [a, b] : [b, a], ops: ['*'] });
	const d = rng.int(2, o.maxFactor);
	if (t * d <= o.maxVal && t >= 2) pats.push({ factors: [t * d, d], ops: [':'] });
	const c = rng.int(2, o.maxFactor);
	// never "a \cdot b : a" or "a : b \cdot b", which undo themselves
	const pairs = t * c <= o.maxVal ? factorPairs(t * c, o).filter(([a, b]) => a !== c && b !== c) : [];
	if (pairs.length && t >= 2) {
		const [a, b] = rng.pick(pairs);
		pats.push({ factors: [a, b, c], ops: ['*', ':'] });
	}
	const divs = factorPairs(t, o).flatMap(([a, b]) => [a, b]).filter((x) => x <= o.maxFactor && t / x >= 2);
	if (divs.length) {
		const cc = rng.pick(divs);
		const b = rng.int(2, o.maxFactor);
		if ((t / cc) * b <= o.maxVal && b !== cc) pats.push({ factors: [(t / cc) * b, b, cc], ops: [':', '*'] });
	}
	const litOk = !force && !alone && t <= o.maxLit;
	// A number alone is the most common term; brackets alone only after a minus.
	const r = rng.next();
	if (litOk && (r < 0.3 || pats.length === 0)) return N(t);
	if (minus && depth > 0 && t >= 2 && (force ? r < 0.45 : r < 0.4)) {
		const inner = buildSum(rng, t, depth - 1, force, o);
		if (inner) return G(inner);
	}
	if (pats.length === 0) return litOk ? N(t) : null;
	const pat = rng.pick(pats);
	const forced = force ? rng.int(0, pat.factors.length - 1) : -1;
	const nodes: Node[] = [];
	for (let i = 0; i < pat.factors.length; i++) {
		const f = buildFactor(rng, pat.factors[i], depth, i === forced, o);
		if (!f) return null;
		nodes.push(f);
	}
	return chain(nodes, pat.ops);
}

function buildFactor(rng: Rng, f: number, depth: number, force: boolean, o: BuildOpts): Built {
	if (force) {
		const inner = buildSum(rng, f, depth - 1, true, o);
		return inner ? G(inner) : null;
	}
	if (depth > 0 && rng.next() < o.groupP) {
		const inner = buildSum(rng, f, rng.int(0, depth - 1), false, o);
		if (inner) return G(inner);
	}
	if (o.pow && f <= o.pow.maxValue && rng.next() < o.pow.p) {
		const forms = powerForms(f, o.pow.maxExp);
		if (forms.length) {
			const [b, e] = rng.pick(forms);
			if (depth > 0 && b >= 2 && rng.next() < 0.35) {
				const inner = buildSum(rng, b, rng.int(0, depth - 1), false, o);
				if (inner) return P(G(inner), e);
			}
			return P(b, e);
		}
	}
	if (f <= o.maxLit) return N(f);
	if (depth > 0) {
		const inner = buildSum(rng, f, depth - 1, false, o);
		return inner ? G(inner) : null;
	}
	return null;
}

// ---------------------------------------------------------------------------
// Prime factorisation

export function factorize(n: number): [number, number][] {
	const out: [number, number][] = [];
	for (let p = 2; p * p <= n; p++) {
		let e = 0;
		while (n % p === 0) {
			n /= p;
			e++;
		}
		if (e) out.push([p, e]);
	}
	if (n > 1) out.push([n, 1]);
	return out;
}

export const isPrime = (n: number): boolean => n >= 2 && factorize(n).length === 1 && factorize(n)[0][1] === 1;

/** "2^3 \cdot 3^2 \cdot 5"; each item is a base and an exponent (exponent 1 is not written). */
export function factorsLatex(fs: [number, number][]): string {
	return fs.map(([p, e]) => (e === 1 ? fmt(p) : powLatex(p, e))).join(' \\cdot ');
}

/** "2**3*3**2*5", parsable by SymPy and by the checker. */
export function factorsAscii(fs: [number, number][]): string {
	return fs.map(([p, e]) => (e === 1 ? `${p}` : `${p}**${e}`)).join('*');
}

/** The division column of the lesson: numbers on the left, prime divisors on the right. */
export function divisionTable(n: number): string {
	const rows: string[] = [];
	let m = n;
	for (const [p, e] of factorize(n)) {
		for (let i = 0; i < e; i++) {
			rows.push(`${fmt(m)} & ${p}`);
			m /= p;
		}
	}
	rows.push('1 &');
	return `\\begin{array}{r|l} ${rows.join(' \\\\ ')} \\end{array}`;
}

export const gcdN = (a: number, b: number): number => (b === 0 ? a : gcdN(b, a % b));
export const lcmN = (a: number, b: number): number => (a / gcdN(a, b)) * b;

// ---------------------------------------------------------------------------
// Multiple choice

export interface Opt {
	latex: string;
	values: string[];
}

export const numOpt = (v: number): Opt => ({ latex: fmt(v), values: [String(v)] });
export const textOpt = (key: string, text: string): Opt => ({ latex: `\\text{${text}}`, values: [key] });

/**
 * Four distinct options, the correct one first before shuffling: the candidates in order of
 * preference (nulls and repeats skipped), then `fill` until there are enough.
 */
export function makeChoice(rng: Rng, correct: Opt, candidates: (Opt | null | undefined)[], fill: Opt[] = [], count = 4): ChoiceAnswer {
	const key = (o: Opt) => o.values.join('|');
	const seen = new Set([key(correct)]);
	const options: Opt[] = [correct];
	for (const o of [...candidates, ...fill]) {
		if (o && options.length < count && !seen.has(key(o))) {
			seen.add(key(o));
			options.push(o);
		}
	}
	if (options.length < count) throw new Error('makeChoice: not enough distinct options');
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	const shuffled: ChoiceOption[] = order.map((i) => ({ latex: options[i].latex, values: options[i].values }));
	return { kind: 'choice', options: shuffled, correct: order.indexOf(0) };
}

/** Numbers near v, for filling: v ± 1, ± 2, ± 10, 2v, never negative. */
export function nearNumbers(rng: Rng, v: number): Opt[] {
	const c = shuffle(rng, [v + 1, v - 1, v + 2, v - 2, v + 10, v - 10, 2 * v, v + 3, v + 5]).filter((x) => x >= 0 && x !== v);
	return [...c, v + 4, v + 6, v + 7].map(numOpt);
}

/** A number option when the mistaken value exists and is not absurdly large. */
export function mistakeOpt(v: number | null, max = 100_000): Opt | null {
	return v === null || v < 0 || v > max ? null : numOpt(v);
}
