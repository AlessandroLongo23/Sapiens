/**
 * Potenze in ℤ. Spec: specs/exercises/numeri-interi-potenze.md
 *
 * Six levels in the order of the lesson: the power of a negative integer (the sign from the parity
 * of the exponent); the minus outside the base and powers of -1; one property with a negative base;
 * opposite bases or the same exponent; expressions without brackets with the minus outside the base;
 * expressions with tonde, quadre and graffe and several properties. The expression is a small tree
 * in params.expr, evaluated exactly in ℤ (every division exact); the LaTeX, the steps and the answer
 * all come from the tree. The checker parses the LaTeX again on its own.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { buildChoice, weighted } from '../razionali';

export const ID = 'numeri-interi-potenze';

export type Op = '+' | '-' | '*' | ':';
export type Node =
	| { t: 'n'; v: number }
	/** b is a number (any sign) or a power (a power of a power). */
	| { t: 'pow'; b: Node; e: number }
	/** Unary minus, only in front of a whole term: -2^4, -(-2)^3. */
	| { t: 'neg'; x: Node }
	| { t: 'op'; op: Op; l: Node; r: Node }
	/** A bracket around a sum; k is 0 (tonde), 1 (quadre), 2 (graffe). */
	| { t: 'g'; c: Node; k: number };

const N = (v: number): Node => ({ t: 'n', v });
const P = (b: number | Node, e: number): Node => ({ t: 'pow', b: typeof b === 'number' ? N(b) : b, e });
const O = (op: Op, l: Node, r: Node): Node => ({ t: 'op', op, l, r });
const NEG = (x: Node): Node => ({ t: 'neg', x });

/** Nothing larger than this in absolute value is ever computed. */
const LIMIT = 10_000_000;

// ---------------------------------------------------------------------------
// Arithmetic

export function pw(b: number, e: number): number | null {
	if (b === 0 && e === 0) return null;
	let r = 1;
	for (let i = 0; i < e; i++) {
		r *= b;
		if (Math.abs(r) > LIMIT) return null;
	}
	return r;
}

/** The mistakes students make, as evaluation modes (for the distractors). */
export interface Mode {
	/** -a^n read as (-a)^n. */
	minusIntoBase?: boolean;
	/** A negative base with an odd exponent gives a positive result. */
	oddSignLost?: boolean;
	/** a^0 taken as 0. */
	zeroExp?: boolean;
	/** a^n computed as a \cdot n. */
	powTimes?: boolean;
	/** (a^m)^n computed as a^(m+n). */
	powSumExp?: boolean;
	/** Left to right, ignoring the priority of \cdot and : over + and -. */
	leftToRight?: boolean;
}

function applyOp(op: Op, a: number, b: number): number | null {
	let r: number;
	if (op === '+') r = a + b;
	else if (op === '-') r = a - b;
	else if (op === '*') r = a * b;
	else {
		if (b === 0 || a % b !== 0) return null;
		r = a / b;
	}
	if (Object.is(r, -0)) r = 0;
	return Math.abs(r) <= LIMIT ? r : null;
}

export function evaluate(x: Node, m: Mode = {}): number | null {
	switch (x.t) {
		case 'n':
			return x.v;
		case 'g':
			return evaluate(x.c, m);
		case 'neg': {
			if (m.minusIntoBase && x.x.t === 'pow' && x.x.b.t === 'n' && x.x.b.v > 0) return powMode(-x.x.b.v, x.x.e, m);
			const v = evaluate(x.x, m);
			return v === null ? null : v === 0 ? 0 : -v;
		}
		case 'pow': {
			if (x.b.t === 'pow' && m.powSumExp) {
				const b0 = evaluate(x.b.b, m);
				return b0 === null ? null : powMode(b0, x.b.e + x.e, m);
			}
			const b = evaluate(x.b, m);
			return b === null ? null : powMode(b, x.e, m);
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
				const v = evaluate(y, m);
				if (v === null) return false;
				vals.push(v);
				return true;
			};
			if (!flat(x)) return null;
			const prec = (o: Op) => (m.leftToRight ? 1 : o === '*' || o === ':' ? 2 : 1);
			while (ops.length) {
				const top = Math.max(...ops.map(prec));
				const i = ops.findIndex((o) => prec(o) === top);
				const r = applyOp(ops[i], vals[i], vals[i + 1]);
				if (r === null) return null;
				vals.splice(i, 2, r);
				ops.splice(i, 1);
			}
			return vals[0];
		}
	}
}

function powMode(b: number, e: number, m: Mode): number | null {
	if (m.zeroExp && e === 0) return 0;
	if (m.powTimes && e >= 2) return b * e;
	if (m.oddSignLost && b < 0 && e % 2 === 1) return pw(-b, e);
	return pw(b, e);
}

const val = (x: Node): number => {
	const v = evaluate(x);
	if (v === null) throw new Error(`${ID}: expression outside ℤ`);
	return v;
};

// ---------------------------------------------------------------------------
// LaTeX

/** Integer in LaTeX, thin space every three digits from 10 000 up, as in the lessons. */
export function fmt(v: number): string {
	const s = String(Math.abs(v));
	const body = Math.abs(v) < 10000 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return v < 0 ? `-${body}` : body;
}

/** A number where it follows an operator: negative ones in parentheses. */
const fmtIn = (v: number) => (v < 0 ? `(${fmt(v)})` : fmt(v));
export const expLatex = (e: number | string) => (typeof e === 'number' && e >= 0 && e < 10 ? `^${e}` : `^{${e}}`);

const OPEN = ['(', '[', '\\{'];
const CLOSE = [')', ']', '\\}'];
const SYM: Record<Op, string> = { '+': '+', '-': '-', '*': '\\cdot', ':': ':' };

/** Highest kind of bracket written in the LaTeX of x: 0 tonde, 1 quadre, 2 graffe; -1 none. */
function bracketKind(x: Node): number {
	switch (x.t) {
		case 'n':
			return x.v < 0 ? 0 : -1;
		case 'pow':
			if (x.b.t === 'n') return x.b.v < 0 ? 0 : -1;
			return bracketKind(x.b) + 1;
		case 'neg':
			return bracketKind(x.x);
		case 'op':
			return Math.max(bracketKind(x.l), bracketKind(x.r));
		case 'g':
			return x.k;
	}
}

/** The base of a power as written: 3, (-3), (2^3), [(-2)^3]. */
function baseLatex(b: Node): string {
	if (b.t === 'n') return fmtIn(b.v);
	const k = bracketKind(b) + 1;
	if (k > 2) throw new Error(`${ID}: too many brackets`);
	return `${OPEN[k]}${latex(b)}${CLOSE[k]}`;
}

/** `first`: the node opens an expression or a bracket, so a negative number needs no parentheses. */
export function latex(x: Node, first = true): string {
	switch (x.t) {
		case 'n':
			return first ? fmt(x.v) : fmtIn(x.v);
		case 'pow':
			return `${baseLatex(x.b)}${expLatex(x.e)}`;
		case 'neg':
			return `-${latex(x.x, false)}`;
		case 'op':
			return `${latex(x.l, first)} ${SYM[x.op]} ${latex(x.r, false)}`;
		case 'g':
			return `${OPEN[x.k]}${latex(x.c)}${CLOSE[x.k]}`;
	}
}

const t = (s: string) => `\\text{${s}}`;
const parity = (e: number) => (e % 2 === 0 ? 'pari' : 'dispari');
const signWord = (e: number) => (e % 2 === 0 ? 'positivo' : 'negativo');
/** a^e with a number base, for the steps. */
const powL = (b: number, e: number | string) => `${fmtIn(b)}${expLatex(e)}`;

/** Why a power of an integer has its value: parity, exponent 0 or 1, base -1. */
function powerReason(b: number, e: number): string {
	const v = pw(b, e)!;
	const head = `${powL(b, e)} = ${fmt(v)}`;
	if (e === 0) return `${head}\\ ${t('(esponente 0)')}`;
	if (b > 0) return head;
	if (b === -1) return `${head}\\ ${t('(base ')}-1${t(`, esponente ${parity(e)})`)}`;
	return `${head}\\ ${t(`(base negativa, esponente ${parity(e)})`)}`;
}

// ---------------------------------------------------------------------------
// Construction

type Wrong = (number | null)[];

interface Built {
	expr: Node;
	case: string;
	steps: string[];
	/** Values of the typical mistakes, most typical first. */
	wrong: Wrong;
	/** The result as a power, when the exercise ends on one: "(-3)^2". */
	asPower?: string;
}

/** Largest |base| for each exponent at level 1. */
const L1_MAX: Record<number, number> = { 0: 30, 1: 30, 2: 15, 3: 10, 4: 10 };

function buildL1(rng: Rng): Built {
	const c = weighted(rng, [
		['pari', 4],
		['dispari', 4],
		['esponente 0', 1],
		['esponente 1', 1],
	] as [string, number][]);
	const e = c === 'pari' ? rng.pick([2, 2, 4]) : c === 'dispari' ? 3 : c === 'esponente 0' ? 0 : 1;
	const a = -rng.int(2, L1_MAX[e]);
	const v = pw(a, e)!;
	const expr = P(a, e);
	const steps: string[] = [];
	if (e === 0) steps.push(`${t('Ogni numero diverso da zero elevato a 0 fa 1, anche se è negativo: ')}${latex(expr)} = 1`);
	else if (e === 1) steps.push(`${t('Una potenza con esponente 1 è uguale alla base, segno compreso: ')}${latex(expr)} = ${fmt(a)}`);
	else {
		steps.push(`${t('La base è ')}${fmt(a)}${t(` e l'esponente ${e} è ${parity(e)}: il risultato è ${signWord(e)}`)}`);
		const factors = Array(e).fill(fmtIn(a)).join(' \\cdot ');
		steps.push(`${latex(expr)} = ${factors} = ${fmt(v)}`);
	}
	const wrong: Wrong =
		e === 0 ? [0, a, -1, -a] : e === 1 ? [-a, 1, -1, 0] : [-v, a * e, pw(a, e - 1), -a * e, pw(a, e + 1)];
	return { expr, case: c, steps, wrong };
}

function buildL2(rng: Rng): Built {
	const c = weighted(rng, [
		['meno fuori', 40],
		['meno davanti alla parentesi', 25],
		['base -1', 35],
	] as [string, number][]);
	if (c === 'base -1') {
		const n = rng.int(10, 120);
		const v = n % 2 === 0 ? 1 : -1;
		const expr = P(-1, n);
		return {
			expr,
			case: c,
			steps: [`${t('La base è ')}-1${t(` e l'esponente ${n} è ${parity(n)}: il risultato è `)}${v}${t(', senza fare moltiplicazioni')}`, `${latex(expr)} = ${v}`],
			wrong: [-v, -n, n, 0],
		};
	}
	const e = rng.next() < 0.7 ? rng.pick([2, 4]) : rng.pick([3, 5]);
	const a = rng.int(2, e === 2 ? 12 : e === 3 ? 9 : e === 4 ? 6 : 4);
	const p = pw(a, e)!;
	if (c === 'meno fuori') {
		const expr = NEG(P(a, e));
		return {
			expr,
			case: c,
			steps: [
				`${t('Senza parentesi il meno non fa parte della base: la base è ')}${a}${t('. Prima la potenza: ')}${powL(a, e)} = ${fmt(p)}`,
				`${t('Poi il segno meno davanti: ')}${latex(expr)} = ${fmt(-p)}`,
			],
			wrong: [p, -a * e, a * e, -pw(a, e - 1)!],
		};
	}
	const inner = pw(-a, e)!;
	const expr = NEG(P(-a, e));
	return {
		expr,
		case: c,
		steps: [
			`${t('Prima la potenza: la base è ')}${-a}${t(` e l'esponente ${e} è ${parity(e)}, quindi `)}${powL(-a, e)} = ${fmt(inner)}`,
			inner < 0 ? `${t("Poi l'opposto: ")}${latex(expr)} = -${fmtIn(inner)} = ${fmt(-inner)}` : `${t("Poi l'opposto: ")}${latex(expr)} = ${fmt(-inner)}`,
		],
		wrong: [inner, e % 2 === 0 ? -a * e : a * e, -pw(-a, e - 1)!, pw(a, e) === inner ? -inner : inner],
	};
}

/** Largest final exponent for each negative base at levels 3 and 4 (value at most 10 000). */
const FINAL_MAX: Record<number, number> = { 2: 10, 3: 8, 4: 6, 5: 5, 10: 4 };

function buildL3(rng: Rng, c: string): Built | null {
	const a = -rng.pick([2, 2, 3, 3, 4, 5, 10]);
	const kMax = FINAL_MAX[-a];
	let expr: Node, k: number, prop: string;
	const wrongExp: number[] = [];
	if (c === 'prodotto') {
		const m = rng.int(2, 7), n = rng.int(2, 7);
		k = m + n;
		expr = O('*', P(a, m), P(a, n));
		prop = `${t('Stessa base, si sommano gli esponenti: ')}${latex(expr)} = ${powL(a, `${m} + ${n}`)} = ${powL(a, k)}`;
		wrongExp.push(m * n);
	} else if (c === 'quoziente') {
		const n = rng.int(2, 6);
		k = rng.int(2, kMax);
		const m = k + n;
		if (m > 12) return null;
		expr = O(':', P(a, m), P(a, n));
		prop = `${t('Stessa base, si sottraggono gli esponenti: ')}${latex(expr)} = ${powL(a, `${m} - ${n}`)} = ${powL(a, k)}`;
		wrongExp.push(m + n);
		if (m % n === 0) wrongExp.push(m / n);
	} else {
		const m = rng.int(2, 4), n = rng.int(2, 3);
		k = m * n;
		expr = P(P(a, m), n);
		prop = `${t('Potenza di una potenza, si moltiplicano gli esponenti: ')}${latex(expr)} = ${powL(a, `${m} \\cdot ${n}`)} = ${powL(a, k)}`;
		wrongExp.push(m + n, m ** n);
	}
	if (k < 2 || k > kMax) return null;
	const v = pw(a, k)!;
	const steps = [
		prop,
		`${t(`La base è negativa e l'esponente ${k} è ${parity(k)}: il risultato è ${signWord(k)}. `)}${powL(-a, k)} = ${fmt(pw(-a, k)!)}${t(', quindi ')}${powL(a, k)} = ${fmt(v)}`,
	];
	const wrong: Wrong = [-v, ...wrongExp.map((w) => pw(a, w)), pw(a, k - 1), pw(a, k + 1)];
	return { expr, case: c, steps, wrong, asPower: powL(a, k) };
}

function buildL4(rng: Rng, c: string): Built | null {
	if (c === 'basi opposte') {
		const a = rng.pick([2, 2, 3, 3, 5]);
		const kMax = FINAL_MAX[a];
		const op: Op = rng.next() < 0.55 ? '*' : ':';
		const m = rng.int(2, 9), n = rng.int(2, 9);
		if (m === n) return null;
		const k = op === '*' ? m + n : m - n;
		if (k < 2 || k > kMax || pw(a, Math.max(m, n))! > 10000) return null;
		const negFirst = rng.int(0, 1) === 1;
		const [e1, e2] = [m, n];
		const neg = negFirst ? e1 : e2;
		const s = neg % 2 === 0 ? 1 : -1; // (-a)^neg = s·a^neg
		const expr = O(op, P(negFirst ? -a : a, e1), P(negFirst ? a : -a, e2));
		const v = s * pw(a, k)!;
		const conv = `${t('Le basi ')}${-a}${t(' e ')}${a}${t(` sono opposte: l'esponente ${neg} è ${parity(neg)}, quindi `)}${powL(-a, neg)} = ${s > 0 ? '' : '-'}${powL(a, neg)}`;
		// The expression rewritten with base a, and the property.
		const P1 = negFirst ? `${s > 0 ? '' : '-'}${powL(a, e1)}` : powL(a, e1);
		const P2 = negFirst ? powL(a, e2) : s > 0 ? powL(a, e2) : `(-${powL(a, e2)})`;
		const opL = SYM[op];
		const expSum = op === '*' ? `${e1} + ${e2}` : `${e1} - ${e2}`;
		const sg = s > 0 ? '' : '-';
		const prop = `${t(op === '*' ? 'Stessa base, si sommano gli esponenti: ' : 'Stessa base, si sottraggono gli esponenti: ')}${P1} ${opL} ${P2} = ${sg}${powL(a, expSum)} = ${sg}${powL(a, k)} = ${fmt(v)}`;
		// Mistake: the two bases taken as the same base (the negative one).
		const same = pw(-a, k);
		const times = op === '*' ? pw(a, e1 * e2) : null;
		const wrong: Wrong = [same, -v, times === null ? null : s * times, s * pw(a, k - 1)!, s * pw(a, k + 1)!];
		return { expr, case: c, steps: [conv, prop], wrong, asPower: `${sg}${powL(a, k)}` };
	}
	const op: Op = rng.next() < 0.5 ? '*' : ':';
	const n = weighted(rng, [
		[2, 4],
		[3, 4],
		[4, 1],
	] as [number, number][]);
	let b1: number, b2: number, r: number;
	if (op === '*') {
		b1 = rng.int(2, 6) * (rng.int(0, 1) ? -1 : 1);
		b2 = rng.int(2, 6) * (rng.int(0, 1) ? -1 : 1);
		r = b1 * b2;
	} else {
		r = rng.int(2, 5) * (rng.int(0, 1) ? -1 : 1);
		b2 = rng.int(2, 6) * (rng.int(0, 1) ? -1 : 1);
		b1 = r * b2;
	}
	if (Math.abs(b1) === Math.abs(b2) || (b1 > 0 && b2 > 0)) return null;
	const v = pw(r, n)!;
	if (Math.abs(v) > 10000 || Math.abs(pw(b1, n)!) > 20000 || Math.abs(pw(b2, n)!) > 20000) return null;
	const expr = O(op, P(b1, n), P(b2, n));
	const steps = [
		`${t(op === '*' ? 'Stesso esponente, si moltiplicano le basi: ' : 'Stesso esponente, si dividono le basi: ')}${latex(expr)} = (${fmt(b1)} ${SYM[op]} ${fmtIn(b2)})${expLatex(n)} = ${powL(r, n)}`,
		r < 0
			? `${t(`La base è negativa e l'esponente ${n} è ${parity(n)}: `)}${powL(r, n)} = ${fmt(v)}`
			: `${powL(r, n)} = ${fmt(v)}`,
	];
	const wrong: Wrong = [-v, pw(r, 2 * n), r * n, pw(r, n - 1), pw(r, n + 1)];
	return { expr, case: c, steps, wrong, asPower: powL(r, n) };
}

// ---------------------------------------------------------------------------
// Level 5: expressions without brackets

/** Powers allowed in level 5: [base, exponent], values at most 125 in absolute value. */
const L5_POWERS: [number, number][] = (() => {
	const out: [number, number][] = [];
	for (const b of [2, 3, 4, 5, 6, 10, -2, -3, -4, -5, -6, -10]) {
		for (const e of [0, 2, 3, 4]) {
			if (Math.abs(pw(b, e)!) <= 125 && !(e === 0 && b > 0)) out.push([b, e]);
		}
	}
	return out;
})();

function randomPower(rng: Rng): Node {
	if (rng.next() < 0.15) return P(-1, rng.int(2, 20));
	const [b, e] = rng.pick(L5_POWERS);
	return P(b, e);
}

interface Term {
	sign: 1 | -1;
	body: Node;
}

function sumOf(terms: Term[]): Node {
	let acc: Node = terms[0].sign < 0 ? NEG(terms[0].body) : terms[0].body;
	for (const tm of terms.slice(1)) acc = O(tm.sign < 0 ? '-' : '+', acc, tm.body);
	return acc;
}

/** Every power node of the tree, in reading order, with whether a unary minus is right in front. */
function powersOf(x: Node, underNeg = false): { p: Extract<Node, { t: 'pow' }>; neg: boolean }[] {
	switch (x.t) {
		case 'n':
			return [];
		case 'pow':
			return [{ p: x, neg: underNeg }];
		case 'neg':
			return powersOf(x.x, true);
		case 'op':
			return [...powersOf(x.l, underNeg), ...powersOf(x.r)];
		case 'g':
			return powersOf(x.c);
	}
}

function mapTree(x: Node, f: (y: Node) => Node | null): Node {
	const r = f(x);
	if (r) return r;
	switch (x.t) {
		case 'n':
			return x;
		case 'pow':
			return { t: 'pow', b: mapTree(x.b, f), e: x.e };
		case 'neg':
			return NEG(mapTree(x.x, f));
		case 'op':
			return O(x.op, mapTree(x.l, f), mapTree(x.r, f));
		case 'g':
			return { t: 'g', c: mapTree(x.c, f), k: x.k };
	}
}

const hasMulDiv = (x: Node): boolean =>
	x.t === 'op' ? x.op === '*' || x.op === ':' || hasMulDiv(x.l) || hasMulDiv(x.r) : x.t === 'neg' ? hasMulDiv(x.x) : x.t === 'g' ? hasMulDiv(x.c) : false;
const hasAddSub = (x: Node): boolean => (x.t === 'op' ? x.op === '+' || x.op === '-' || hasAddSub(x.l) || hasAddSub(x.r) : false);

/** Steps of a flat expression: each power with its reason, then \cdot and :, then + and -. */
function flatSteps(expr: Node): string[] {
	const out: string[] = [];
	for (const { p, neg } of powersOf(expr)) {
		if (p.b.t !== 'n') continue;
		const b = p.b.v;
		if (neg && b > 0) {
			const v = pw(b, p.e)!;
			out.push(`-${powL(b, p.e)} = ${fmt(-v)}\\ ${t(`(la base è ${b}: prima ${b}`)}${expLatex(p.e)} = ${fmt(v)}${t(', poi il meno davanti)')}`);
		} else out.push(powerReason(b, p.e));
	}
	let cur = mapTree(expr, (y) => (y.t === 'pow' ? N(val(y)) : null));
	out.push(`${t('Sostituisci le potenze: ')}${latex(cur)}`);
	if (hasMulDiv(cur) && hasAddSub(cur)) {
		const next = mapTree(cur, (y) => (y.t === 'op' && (y.op === '*' || y.op === ':') ? N(val(y)) : null));
		out.push(`${t('Moltiplicazioni e divisioni: ')}${latex(cur)} = ${latex(next)}`);
		cur = next;
	}
	if (cur.t !== 'n') out.push(`${t(hasAddSub(cur) ? 'Addizioni e sottrazioni: ' : 'Moltiplicazioni e divisioni: ')}${latex(cur)} = ${fmt(val(cur))}`);
	return out;
}

/** The values of the mistakes on a whole expression. */
function mistakes(expr: Node, modes: Mode[]): Wrong {
	const out: Wrong = modes.map((m) => evaluate(expr, m));
	const v = evaluate(expr);
	if (v !== null) out.push(-v);
	return out;
}

function buildL5(rng: Rng): Built | null {
	const k = rng.next() < 0.6 ? 3 : 4;
	const terms: Term[] = [];
	for (let i = 0; i < k; i++) {
		const sign: 1 | -1 = rng.next() < 0.45 ? -1 : 1;
		let body = randomPower(rng);
		if (rng.next() < 0.35) {
			const op: Op = rng.next() < 0.6 ? '*' : ':';
			const other = randomPower(rng);
			body = O(op, body, other);
			const bv = evaluate(body);
			if (bv === null || Math.abs(bv) > 150) return null;
			if (op === ':' && Math.abs(val(other)) === 1 && rng.next() < 0.7) return null;
		}
		terms.push({ sign, body });
	}
	const expr = sumOf(terms);
	const v = evaluate(expr);
	if (v === null || Math.abs(v) > 300) return null;
	// The lesson's traps: -a^n with a positive base and an even exponent, a negative base with an odd
	// exponent; exponent 0 at most once, base -1 at most twice.
	const pows = powersOf(expr);
	const lead = (tm: Term) => (tm.body.t === 'pow' ? tm.body : tm.body.t === 'op' ? (tm.body.l as Extract<Node, { t: 'pow' }>) : null);
	const trap = (tm: Term) => {
		const p = lead(tm);
		return tm.sign < 0 && !!p && p.b.t === 'n' && p.b.v > 0 && p.e % 2 === 0 && p.e > 0;
	};
	if (!terms.some(trap)) return null;
	// Most of the time the trap is the unary minus of the first term, as in the lesson (-2^4 + ...).
	if (!trap(terms[0]) && rng.next() < 0.5) return null;
	if (!pows.some(({ p }) => p.b.t === 'n' && p.b.v < -1 && p.e % 2 === 1)) return null;
	if (pows.filter(({ p }) => p.e === 0).length > 1 || pows.filter(({ p }) => p.b.t === 'n' && p.b.v === -1).length > 2) return null;
	const wrong = mistakes(expr, [{ minusIntoBase: true }, { oddSignLost: true }, { zeroExp: true }, { leftToRight: true }, { powTimes: true }]);
	return { expr, case: terms[0].sign < 0 ? 'meno in testa' : 'meno dentro', steps: flatSteps(expr), wrong };
}

// ---------------------------------------------------------------------------
// Level 6: brackets and several properties

interface Block {
	node: Node;
	value: number;
	step: string;
}

/** [(-a)^m]^n : d^k, calculated as numbers (lesson, example 4). */
function blockPowerOfPower(rng: Rng): Block | null {
	const a = rng.pick([2, 2, 3]);
	const m = rng.int(2, a === 2 ? 3 : 2), n = rng.int(2, 3);
	const d = rng.pick([-a, a, -a * a, a * a]);
	const kk = rng.int(2, 3);
	const inner = P(P(-a, m), n);
	const node = O(':', inner, P(d, kk));
	const big = pw(-a, m * n), div = pw(d, kk);
	if (big === null || div === null || Math.abs(big) > 1000 || big % div !== 0) return null;
	const value = big / div;
	if (Math.abs(value) === 1 && rng.next() < 0.7) return null;
	const step = `${latex(inner)} = ${powL(-a, `${m} \\cdot ${n}`)} = ${powL(-a, m * n)} = ${fmt(big)},\\quad ${powL(d, kk)} = ${fmt(div)},\\quad ${fmt(big)} : ${fmtIn(div)} = ${fmt(value)}`;
	return { node, value, step };
}

/** A second block: the same exponent, opposite bases, or the same base. */
function blockOther(rng: Rng): Block | null {
	const kind = rng.pick(['stesso esponente', 'basi opposte', 'stessa base']);
	if (kind === 'stesso esponente') {
		const n = rng.int(2, 3);
		const q = -rng.int(2, 4), b = rng.int(2, 4) * (rng.int(0, 1) ? -1 : 1);
		if (Math.abs(q) === Math.abs(b)) return null;
		const node = O(':', P(q * b, n), P(b, n));
		const value = pw(q, n)!;
		const step = `${latex(node)} = (${fmt(q * b)} : ${fmtIn(b)})${expLatex(n)} = ${powL(q, n)} = ${fmt(value)}`;
		return { node, value, step };
	}
	const a = rng.pick([2, 3]);
	const m = rng.int(3, 7), k = rng.int(2, m - 1);
	const e = m - k;
	if (pw(a, m)! > 1000) return null;
	if (kind === 'stessa base') {
		const node = O(':', P(-a, m), P(-a, k));
		const value = pw(-a, e)!;
		return { node, value, step: `${latex(node)} = ${powL(-a, `${m} - ${k}`)} = ${powL(-a, e)} = ${fmt(value)}` };
	}
	const node = O(':', P(-a, m), P(a, k));
	const s = m % 2 === 0 ? '' : '-';
	const value = pw(-a, m)! / pw(a, k)!;
	return {
		node,
		value,
		step: `${powL(-a, m)} = ${s}${powL(a, m)}${t(` (esponente ${parity(m)}), quindi `)}${latex(node)} = ${s}${powL(a, `${m} - ${k}`)} = ${s}${powL(a, e)} = ${fmt(value)}`,
	};
}

function buildL6(rng: Rng): Built | null {
	const b1 = blockPowerOfPower(rng), b2 = blockOther(rng);
	if (!b1 || !b2) return null;
	const swap = rng.next() < 0.3;
	const [f, s] = swap ? [b2, b1] : [b1, b2];
	const op: Op = rng.next() < 0.6 ? '-' : '+';
	const inside = O(op, f.node, s.node);
	const S = op === '-' ? f.value - s.value : f.value + s.value;
	if (S === 0 || Math.abs(S) > 100) return null;
	const [mb, me] = rng.next() < 0.6 ? [-1, rng.int(3, 15)] : rng.pick([[-2, 2], [-2, 3], [-3, 2]] as [number, number][]);
	const M = P(mb, me);
	const mv = pw(mb, me)!;
	const G: Node = { t: 'g', c: inside, k: bracketKind(inside) + 1 };
	if (G.k !== 2) return null;
	const mOp: Op = mb === -1 && rng.next() < 0.3 ? ':' : '*';
	const before = mOp === '*' && rng.next() < 0.3;
	const expr = before ? O('*', M, G) : O(mOp, G, M);
	const v = evaluate(expr);
	if (v === null || Math.abs(v) > 1000) return null;
	const gIn = (x: string) => `\\{${x}\\}`;
	const sumL = `${fmt(f.value)} ${SYM[op]} ${fmtIn(s.value)}`;
	const steps = [
		`${t('Dentro la graffa, primo termine: ')}${f.step}`,
		`${t('Secondo termine: ')}${s.step}`,
		`${t('La graffa: ')}${gIn(sumL)} = ${fmt(S)}`,
		`${powerReason(mb, me)}`,
		before ? `${fmt(mv)} \\cdot ${fmtIn(S)} = ${fmt(v)}` : `${fmt(S)} ${SYM[mOp]} ${fmtIn(mv)} = ${fmt(v)}`,
	];
	const wrong = mistakes(expr, [{ powSumExp: true }, { oddSignLost: true }, { leftToRight: true }, { powTimes: true }]);
	// The sign of (-1)^n or of the multiplier forgotten.
	wrong.push(S * Math.abs(mv));
	return { expr, case: swap ? 'potenza di potenza dopo' : 'potenza di potenza prima', steps, wrong };
}

// ---------------------------------------------------------------------------
// Assembly

/** The case is drawn once, so that rejections inside a case do not change the shares. */
function withCase(rng: Rng, c: string, f: (rng: Rng, c: string) => Built | null): Built | null {
	for (let i = 0; i < 2000; i++) {
		const b = f(rng, c);
		if (b) {
			const v = evaluate(b.expr);
			if (v !== null && goodWrong(b, v).length >= 3) return b;
		}
	}
	return null;
}

function buildRaw(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng);
		case 2:
			return buildL2(rng);
		case 3:
			return withCase(rng, rng.pick(['prodotto', 'quoziente', 'potenza di potenza']), buildL3);
		case 4:
			return withCase(rng, rng.next() < 0.5 ? 'basi opposte' : 'stesso esponente', buildL4);
		case 5:
			return buildL5(rng);
		case 6:
			return buildL6(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const MAX_WRONG = 100_000;

/** Distinct typical mistakes, different from the answer and not absurdly large. */
function goodWrong(b: Built, v: number): number[] {
	const out: number[] = [];
	for (const w of b.wrong) if (w !== null && w !== v && Math.abs(w) <= MAX_WRONG && !out.includes(w)) out.push(w);
	return out;
}

const numOption = (v: number): ChoiceOption => ({ latex: fmt(v), values: [String(v)] });

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const v = Number((sample.answer as { value: string }).value);
	const wrong = ((sample.params.wrong as string[]) ?? []).map(Number);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		return numOption(i % 2 ? v - k : v + k);
	};
	return buildChoice(rng, numOption(v), wrong.map(numOption), fallback);
}

// ---------------------------------------------------------------------------
// Checks

const allPowers = (x: Node): Extract<Node, { t: 'pow' }>[] => {
	switch (x.t) {
		case 'n':
			return [];
		case 'pow':
			return [x, ...allPowers(x.b)];
		case 'neg':
			return allPowers(x.x);
		case 'op':
			return [...allPowers(x.l), ...allPowers(x.r)];
		case 'g':
			return allPowers(x.c);
	}
};

function check(sample: Sample): string[] {
	const v: string[] = [];
	const expr = sample.params.expr as Node | undefined;
	if (!expr) return ['params.expr mancante'];
	const value = evaluate(expr);
	if (value === null) return ['espressione fuori da ℤ o divisione non esatta'];
	if (sample.problem !== latex(expr)) v.push('il testo non corrisponde a params.expr');
	if (sample.answer.kind !== 'number' || sample.answer.value !== String(value)) v.push('risposta diversa dal valore');
	if (Math.abs(value) > 10000) v.push('risultato troppo grande');
	if (/\+\s*-|-\s*-|\+\s*\+/.test(sample.problem)) v.push('segni doppi');
	const pows = allPowers(expr);
	if (pows.some((p) => p.e === 1) && !(sample.level === 1 && sample.params.case === 'esponente 1')) v.push('esponente 1 scritto nel testo');
	if (pows.some((p) => p.e === 0) && sample.level !== 1 && sample.level !== 5) v.push('esponente 0 fuori dai livelli 1 e 5');
	if (pows.some((p) => p.b.t === 'n' && p.b.v === 0)) v.push('base zero');
	const numBase = (p: Extract<Node, { t: 'pow' }>) => (p.b.t === 'n' ? p.b.v : null);
	switch (sample.level) {
		case 1:
			if (expr.t !== 'pow' || (numBase(expr) ?? 0) >= -1 || expr.e > 4) v.push('serve (-a)^n con a >= 2 e n da 0 a 4');
			break;
		case 2: {
			const ok =
				(expr.t === 'neg' && expr.x.t === 'pow' && expr.x.b.t === 'n' && expr.x.b.v !== 0 && expr.x.e >= 2) ||
				(expr.t === 'pow' && numBase(expr) === -1 && expr.e >= 10);
			if (!ok) v.push('serve -a^n, -(-a)^n oppure (-1)^n con n grande');
			break;
		}
		case 3: {
			const bases = new Set(pows.map((p) => numBase(p)).filter((b) => b !== null));
			if (bases.size !== 1 || [...bases][0]! >= 0 || pows.length < 2) v.push('serve una proprietà con una sola base negativa');
			break;
		}
		case 4: {
			if (expr.t !== 'op' || pows.length !== 2) v.push('servono due potenze');
			else {
				const [b1, b2] = pows.map((p) => numBase(p)!);
				const opposite = b1 === -b2 && pows[0].e !== pows[1].e;
				const sameExp = pows[0].e === pows[1].e && Math.abs(b1) !== Math.abs(b2) && (b1 < 0 || b2 < 0);
				if (!opposite && !sameExp) v.push('servono basi opposte o lo stesso esponente');
			}
			break;
		}
		case 5:
			if (bracketKind(expr) > 0 || !pows.some((p) => (numBase(p) ?? 0) < -1 && p.e % 2 === 1)) v.push('serve un’espressione senza parentesi con una base negativa ed esponente dispari');
			break;
		case 6:
			if (bracketKind(expr) !== 2 || pows.filter((p) => p.b.t === 'pow').length < 1) v.push('servono le graffe e una potenza di potenza');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export const numeriInteriPotenze: Generator = {
	id: ID,
	title: 'Potenze in ℤ',
	levels: {
		1: { label: 'Potenza con base negativa', constraints: ['(-a)^n con a da 2 e n da 0 a 4', 'circa 4 su 10 esponente pari, 4 su 10 dispari, 1 su 10 esponente 0, 1 su 10 esponente 1'] },
		2: { label: 'Il meno fuori dalla base e le potenze di -1', constraints: ['circa 4 su 10 -a^n, 25 su 100 -(-a)^n, 35 su 100 (-1)^n con n da 10 a 120'] },
		3: { label: 'Una proprietà con base negativa', constraints: ['prodotto, quoziente o potenza di potenza con la stessa base negativa', 'esponente finale almeno 2, valore fino a 10 000'] },
		4: { label: 'Basi opposte o stesso esponente', constraints: ['metà basi opposte da riportare alla stessa base, metà stesso esponente con una base negativa'] },
		5: { label: 'Espressioni con le potenze', constraints: ['3 o 4 termini senza parentesi', 'un -a^n con esponente pari, una base negativa con esponente dispari', 'risultato fino a 300'] },
		6: { label: 'Espressioni con le parentesi', constraints: ['{[(-a)^m]^n : d^k ± blocco} per (-1)^n o una piccola potenza', 'graffe, quadre e tonde; risultato fino a 1000'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = buildRaw(rng, level);
			if (!b) continue;
			const value = evaluate(b.expr);
			if (value === null) continue;
			const wrong = goodWrong(b, value);
			// The typical mistakes alone must give three wrong options (two at level 2 with base -1, where
			// only 1 and -1 make sense and the rest are the "exponent times base" slips).
			if (wrong.length < 3) continue;
			const problem = latex(b.expr);
			const solution = b.asPower ? `${problem} = ${b.asPower} = ${fmt(value)}` : `${problem} = ${fmt(value)}`;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: level <= 2 ? 'Calcola la potenza.' : level <= 4 ? 'Calcola usando le proprietà delle potenze.' : "Calcola il valore dell'espressione.",
				problem,
				solution,
				steps: b.steps,
				answer: { kind: 'number', value: String(value) },
				params: { expr: b.expr, case: b.case, wrong: wrong.map(String) },
			};
			if (check(sample).length > 0) continue;
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriInteriPotenze;
