/**
 * Espressioni con frazioni. Spec: specs/exercises/numeri-razionali-espressioni.md
 *
 * Six levels in the order of the lesson: two operations with priorities; one round bracket with a
 * minus in front or a negative factor; powers with negative base and negative or zero exponent;
 * fractions of fractions; decimals and negative exponents in a fraction of fractions; round,
 * square and curly brackets with a property of powers. The expression is a tree in params.expr,
 * evaluated exactly; the LaTeX, the steps, the answer and the distractors all come from the tree.
 * The distractors are the same tree evaluated with one of the students' mistakes.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, ratOption, weighted } from '../razionali';

export const ID = 'numeri-razionali-espressioni';

export type Op = '*' | ':';
export type Node =
	| { t: 'n'; v: string }
	| { t: 'd'; s: string }
	| { t: 'pow'; b: Node; e: number }
	| { t: 'g'; k: 1 | 2 | 3; x: Node }
	| { t: 'sum'; terms: { s: 1 | -1; x: Node }[] }
	| { t: 'ch'; items: Node[]; ops: Op[] }
	| { t: 'fr'; n: Node; d: Node };

/** Bound for every intermediate value (numerator and denominator). */
const MID = 36;
/** Bound for the result. */
const END = 30;

// ---------------------------------------------------------------------------
// Constructors

const N = (r: Rational): Node => ({ t: 'n', v: r.toString() });
const D = (s: string): Node => ({ t: 'd', s });
const Pw = (b: Node, e: number): Node => ({ t: 'pow', b, e });
const Gr = (k: 1 | 2 | 3, x: Node): Node => ({ t: 'g', k, x });
const Sm = (...terms: [1 | -1, Node][]): Node => ({ t: 'sum', terms: terms.map(([s, x]) => ({ s, x })) });
const Ch = (items: Node[], ops: Op[]): Node => ({ t: 'ch', items, ops });
const Fr = (n: Node, d: Node): Node => ({ t: 'fr', n, d });

// ---------------------------------------------------------------------------
// Arithmetic, with the students' mistakes as variants

export type Mistake =
	| 'none'
	| 'order' // operations from left to right ignoring priorities; in a chain, from right to left
	| 'recip' // a quotient done as a product, without the reciprocal
	| 'recipwrong' // a quotient done with the reciprocal of the dividend: a : b -> 1/a · b
	| 'meno' // the minus in front of a bracket changes only its first term
	| 'dsign' // "- (-x)" taken as "-x"
	| 'signlost' // the minus in front of a product or quotient lost
	| 'sumnaive' // numerators added together and denominators added together
	| 'sumden' // common denominator taken, numerators not rescaled
	| 'powsign' // negative base: the sign stays whatever the exponent
	| 'negexp' // negative exponent: reciprocal forgotten
	| 'zeroexp' // x^0 taken as 0
	| 'frac' // main fraction line read upside down
	| 'prop'; // same base: exponents multiplied (product) or subtracted the wrong way (quotient)

export function decimalValue(s: string): Rational {
	const [i, f = ''] = s.split(',');
	return q(Number(i + f), 10 ** f.length);
}

export function power(r: Rational, e: number): Rational {
	if (r.isZero() && e <= 0) throw new Error('0 to a non-positive exponent');
	const base = e < 0 ? q(1).div(r) : r;
	let out = q(1);
	for (let i = 0; i < Math.abs(e); i++) out = out.mul(base);
	return out;
}

function applyOp(a: Rational, op: Op, b: Rational, mk: Mistake): Rational {
	if (op === '*') return a.mul(b);
	if (mk === 'recip') return a.mul(b);
	if (mk === 'recipwrong') return b.div(a);
	return a.div(b);
}

function evalChain(n: Extract<Node, { t: 'ch' }>, mk: Mistake): Rational {
	let items = n.items, ops = n.ops;
	let vals = items.map((it) => evaluate(it, mk));
	if (mk === 'prop') {
		const v2: Rational[] = [], o2: Op[] = [];
		for (let i = 0; i < items.length; i++) {
			const a = items[i], b = items[i + 1];
			if (b && a.t === 'pow' && b.t === 'pow' && (i === 0 || ops[i - 1] === '*')) {
				const ba = evaluate(a.b, mk), bb = evaluate(b.b, mk);
				if (ba.equals(bb)) {
					v2.push(power(ba, ops[i] === '*' ? a.e * b.e : b.e - a.e));
					if (i + 1 < ops.length) o2.push(ops[i + 1]);
					i++;
					continue;
				}
			}
			v2.push(vals[i]);
			if (i < ops.length) o2.push(ops[i]);
		}
		vals = v2;
		ops = o2;
		items = [];
	}
	if (mk === 'order' && ops.length >= 2) {
		let acc = vals[vals.length - 1];
		for (let i = ops.length - 1; i >= 0; i--) acc = applyOp(vals[i], ops[i], acc, mk);
		return acc;
	}
	let acc = vals[0];
	ops.forEach((op, i) => (acc = applyOp(acc, op, vals[i + 1], mk)));
	return acc;
}

function evalSum(n: Extract<Node, { t: 'sum' }>, mk: Mistake): Rational {
	if (mk === 'order') {
		// strictly left to right: a + b · c read as (a + b) · c
		type Tok = { op: '+' | '-' | Op; v: Rational };
		const toks: Tok[] = [];
		n.terms.forEach((t) => {
			const sop = t.s < 0 ? '-' : '+';
			if (t.x.t === 'ch') {
				const vals = t.x.items.map((it) => evaluate(it, mk));
				toks.push({ op: sop, v: vals[0] });
				t.x.ops.forEach((op, i) => toks.push({ op, v: vals[i + 1] }));
			} else toks.push({ op: sop, v: evaluate(t.x, mk) });
		});
		let acc = q(0);
		for (const { op, v } of toks) {
			if (op === '+') acc = acc.add(v);
			else if (op === '-') acc = acc.sub(v);
			else acc = applyOp(acc, op, v, mk);
		}
		return acc;
	}
	const contribs = n.terms.map((t) => {
		if (mk === 'meno' && t.s < 0 && t.x.t === 'g' && t.x.x.t === 'sum') {
			const inner = t.x.x.terms.map((u) => (u.s < 0 ? evaluate(u.x, mk).neg() : evaluate(u.x, mk)));
			return inner.reduce((acc, v, i) => (i === 0 ? acc.sub(v) : acc.add(v)), q(0));
		}
		const v = evaluate(t.x, mk);
		if (mk === 'dsign' && t.s < 0 && v.sign() < 0) return v;
		if (mk === 'signlost' && t.s < 0 && t.x.t === 'ch') return v;
		return t.s < 0 ? v.neg() : v;
	});
	if ((mk === 'sumnaive' || mk === 'sumden') && contribs.length >= 2 && contribs.some((c) => c.den > 1)) {
		const num = contribs.reduce((s, c) => s + c.num, 0);
		const den = mk === 'sumnaive' ? contribs.reduce((s, c) => s + c.den, 0) : contribs.reduce((m, c) => lcm(m, c.den), 1);
		return q(num, den);
	}
	return contribs.reduce((a, b) => a.add(b), q(0));
}

export function evaluate(n: Node, mk: Mistake = 'none'): Rational {
	switch (n.t) {
		case 'n':
			return Rational.parse(n.v);
		case 'd':
			return decimalValue(n.s);
		case 'pow': {
			const b = evaluate(n.b, mk);
			if (mk === 'zeroexp' && n.e === 0) return q(0);
			if (mk === 'negexp' && n.e < 0) return power(b, -n.e);
			if (mk === 'powsign' && b.sign() < 0) return power(b, n.e).abs().neg();
			return power(b, n.e);
		}
		case 'g':
			return evaluate(n.x, mk);
		case 'sum':
			return evalSum(n, mk);
		case 'ch':
			return evalChain(n, mk);
		case 'fr': {
			const a = evaluate(n.n, mk), b = evaluate(n.d, mk);
			if (mk === 'frac') return b.div(a);
			if (mk === 'recip') return a.mul(b);
			return a.div(b);
		}
	}
}

export function children(n: Node): Node[] {
	switch (n.t) {
		case 'pow':
			return [n.b];
		case 'g':
			return [n.x];
		case 'sum':
			return n.terms.map((t) => t.x);
		case 'ch':
			return n.items;
		case 'fr':
			return [n.n, n.d];
		default:
			return [];
	}
}

export function nodes(n: Node): Node[] {
	return [n, ...children(n).flatMap(nodes)];
}

/** Nesting height of the brackets: 1 for a round bracket with no bracket inside. */
export function height(n: Node): number {
	const h = Math.max(0, ...children(n).map(height));
	return n.t === 'g' ? h + 1 : h;
}

const small = (r: Rational, max: number) => Math.abs(r.num) <= max && r.den <= max;

// ---------------------------------------------------------------------------
// LaTeX

function fracTex(r: Rational): string {
	const a = Math.abs(r.num);
	const body = r.isInteger() ? `${a}` : `\\dfrac{${a}}{${r.den}}`;
	if (r.sign() >= 0) return body;
	return r.isInteger() ? `(-${a})` : `\\left(-${body}\\right)`;
}

const BR: Record<1 | 2 | 3, [string, string]> = {
	1: ['\\left(', '\\right)'],
	2: ['\\left[', '\\right]'],
	3: ['\\left\\{', '\\right\\}'],
};

export function tex(n: Node): string {
	switch (n.t) {
		case 'n':
			return fracTex(Rational.parse(n.v));
		case 'd':
			return n.s.replace(',', '{,}');
		case 'pow': {
			let b: string;
			if (n.b.t === 'n') {
				const r = Rational.parse(n.b.v);
				b = r.sign() > 0 && r.isInteger() ? `${r.num}` : r.sign() > 0 ? `\\left(${fracTex(r)}\\right)` : fracTex(r);
			} else b = tex(n.b);
			return `${b}^{${n.e}}`;
		}
		case 'g':
			return `${BR[n.k][0]}${tex(n.x)}${BR[n.k][1]}`;
		case 'sum':
			return n.terms.map((t, i) => (i === 0 ? (t.s < 0 ? '-' : '') : t.s < 0 ? ' - ' : ' + ') + tex(t.x)).join('');
		case 'ch':
			return n.items.map((it, i) => (i === 0 ? '' : n.ops[i - 1] === '*' ? ' \\cdot ' : ' : ') + tex(it)).join('');
		case 'fr':
			return `\\dfrac{${tex(n.n)}}{${tex(n.d)}}`;
	}
}

// ---------------------------------------------------------------------------
// Steps: the innermost bracket first, then the fractions of fractions, then the rest.

/** Map over a tree, bottom-up. */
function mapTree(n: Node, f: (x: Node) => Node): Node {
	let out: Node;
	switch (n.t) {
		case 'pow':
			out = { ...n, b: mapTree(n.b, f) };
			break;
		case 'g':
			out = { ...n, x: mapTree(n.x, f) };
			break;
		case 'sum':
			out = { ...n, terms: n.terms.map((t) => ({ s: t.s, x: mapTree(t.x, f) })) };
			break;
		case 'ch':
			out = { ...n, items: n.items.map((it) => mapTree(it, f)) };
			break;
		case 'fr':
			out = { ...n, n: mapTree(n.n, f), d: mapTree(n.d, f) };
			break;
		default:
			out = n;
	}
	return f(out);
}

function replace(tree: Node, target: Node, by: Node): Node {
	if (tree === target) return by;
	switch (tree.t) {
		case 'pow':
			return { ...tree, b: replace(tree.b, target, by) };
		case 'g':
			return { ...tree, x: replace(tree.x, target, by) };
		case 'sum':
			return { ...tree, terms: tree.terms.map((t) => ({ s: t.s, x: replace(t.x, target, by) })) };
		case 'ch':
			return { ...tree, items: tree.items.map((it) => replace(it, target, by)) };
		case 'fr':
			return { ...tree, n: replace(tree.n, target, by), d: replace(tree.d, target, by) };
		default:
			return tree;
	}
}

const isLit = (n: Node) => n.t === 'n';
const litVal = (n: Node) => Rational.parse((n as { v: string }).v);

/** In a sum, a term that became a negative number takes its sign outside: + (-x) -> - x. */
function normalizeSum(n: Node): Node {
	if (n.t !== 'sum') return n;
	return {
		...n,
		terms: n.terms.map((t) => {
			if (!isLit(t.x) || litVal(t.x).sign() >= 0) return t;
			return { s: (t.s < 0 ? 1 : -1) as 1 | -1, x: N(litVal(t.x).abs()) };
		}),
	};
}

/** A chain or a power that became a number: in a sum, the sign goes outside. */
function collapse(pred: (x: Node) => boolean) {
	return (n: Node): Node => {
		if (n.t === 'sum') {
			return {
				...n,
				terms: n.terms.map((t) => {
					if (!pred(t.x)) return t;
					const v = evaluate(t.x);
					return v.sign() < 0 ? { s: (t.s < 0 ? 1 : -1) as 1 | -1, x: N(v.abs()) } : { s: t.s, x: N(v) };
				}),
			};
		}
		return {
			...n,
			...(n.t === 'ch' ? { items: n.items.map((it) => (pred(it) ? N(evaluate(it)) : it)) } : {}),
			...(n.t === 'g' && pred(n.x) ? { x: N(evaluate(n.x)) } : {}),
			...(n.t === 'fr' ? { n: pred(n.n) ? N(evaluate(n.n)) : n.n, d: pred(n.d) ? N(evaluate(n.d)) : n.d } : {}),
		} as Node;
	};
}

/** Same base, adjacent, at the start of a chain or after a product: one power. */
function mergePowers(n: Node): Node {
	if (n.t !== 'ch') return n;
	const items: Node[] = [], ops: Op[] = [];
	for (let i = 0; i < n.items.length; i++) {
		const a = n.items[i], b = n.items[i + 1];
		if (b && a.t === 'pow' && b.t === 'pow' && isLit(a.b) && isLit(b.b) && litVal(a.b).equals(litVal(b.b)) && (i === 0 || n.ops[i - 1] === '*')) {
			items.push(Pw(a.b, n.ops[i] === '*' ? a.e + b.e : a.e - b.e));
			if (i + 1 < n.ops.length) ops.push(n.ops[i + 1]);
			i++;
			continue;
		}
		items.push(a);
		if (i < n.ops.length) ops.push(n.ops[i]);
	}
	return items.length === 1 ? items[0] : Ch(items, ops);
}

/** a : b -> a · 1/b, for numbers. */
function reciprocals(n: Node): Node {
	if (n.t !== 'ch' || !n.ops.includes(':') || !n.items.every(isLit)) return n;
	return Ch(
		n.items.map((it, i) => (i > 0 && n.ops[i - 1] === ':' ? N(q(1).div(litVal(it))) : it)),
		n.ops.map(() => '*'),
	);
}

/** The steps of a part with no bracket and no fraction of fractions, as "a = b = c". */
/** A number standing alone, with its sign and no parentheses: -\dfrac{8}{9}. */
function bare(r: Rational): string {
	return (r.sign() < 0 ? '-' : '') + fracTex(r.abs());
}

const show = (t: Node) => (isLit(t) ? bare(litVal(t)) : tex(t));

function flatSeq(x: Node): string[] {
	const seq = [show(x)];
	const push = (t: Node) => {
		const s = show(t);
		if (s !== seq[seq.length - 1]) seq.push(s);
	};
	let t = mapTree(x, (n) => (n.t === 'd' ? N(decimalValue(n.s)) : n));
	push(t);
	t = mapTree(t, mergePowers);
	push(t);
	t = mapTree(t, collapse((n) => n.t === 'pow'));
	t = t.t === 'pow' ? N(evaluate(t)) : t;
	push(t);
	t = mapTree(t, reciprocals);
	push(t);
	t = mapTree(t, collapse((n) => n.t === 'ch'));
	t = t.t === 'ch' ? N(evaluate(t)) : t;
	push(t);
	t = normalizeSum(t);
	push(t);
	if (t.t === 'sum') {
		const vals = t.terms.map((u) => (u.s < 0 ? litVal(u.x).neg() : litVal(u.x)));
		const m = vals.reduce((acc, v) => lcm(acc, v.den), 1);
		if (m > 1 && new Set(vals.map((v) => v.den)).size > 1) {
			const nums = vals.map((v) => v.num * (m / v.den));
			seq.push(`\\dfrac{${nums.map((k, i) => (i === 0 ? `${k}` : k < 0 ? ` - ${-k}` : ` + ${k}`)).join('')}}{${m}}`);
		}
		push(N(evaluate(t)));
	}
	return seq;
}

const BR_NAME: Record<1 | 2 | 3, string> = { 1: 'Nella tonda', 2: 'Nella quadra', 3: 'Nella graffa' };

function isFlat(n: Node): boolean {
	return nodes(n).every((m) => m.t !== 'g' && m.t !== 'fr');
}

export function buildSteps(expr: Node): string[] {
	const steps: string[] = [];
	if (nodes(expr).some((n) => n.t === 'd')) steps.push(`\\text{Scrivi i decimali come frazioni: } ${nodes(expr).filter((n) => n.t === 'd').map((n) => `${tex(n)} = ${fracTex(evaluate(n))}`).join(', \\; ')}`);
	let tree = expr;
	for (let guard = 0; guard < 20 && !isLit(tree); guard++) {
		const g = nodes(tree).find((n) => n.t === 'g' && isFlat(n.x)) as Extract<Node, { t: 'g' }> | undefined;
		if (g) {
			steps.push(`\\text{${BR_NAME[g.k]}: } ${flatSeq(g.x).join(' = ')}`);
			tree = replace(tree, g, N(evaluate(g.x)));
			if (!isLit(tree)) steps.push(`\\text{L'espressione diventa } ${tex(tree)}`);
			continue;
		}
		const f = nodes(tree).find((n) => n.t === 'fr' && isFlat(n.n) && isFlat(n.d)) as Extract<Node, { t: 'fr' }> | undefined;
		if (f) {
			const a = evaluate(f.n), b = evaluate(f.d);
			if (!isLit(f.n)) steps.push(`\\text{Numeratore: } ${flatSeq(f.n).join(' = ')}`);
			if (!isLit(f.d)) steps.push(`\\text{Denominatore: } ${flatSeq(f.d).join(' = ')}`);
			steps.push(`\\text{La linea principale è una divisione: } ${flatSeq(Ch([N(a), N(b)], [':'])).join(' = ')}`);
			tree = replace(tree, f, N(a.div(b)));
			if (!isLit(tree)) steps.push(`\\text{L'espressione diventa } ${tex(tree)}`);
			continue;
		}
		const seq = flatSeq(tree);
		steps.push(seq.join(' = '));
		tree = N(evaluate(tree));
	}
	return steps;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	expr: Node;
	case: string;
}

const DENS = [2, 3, 4, 5, 6, 8, 9, 10, 12];

/** Positive fraction in lowest terms (sometimes an integer), never 1. */
function frac(rng: Rng, maxN = 9, intP = 0, maxInt = 3): Rational {
	for (;;) {
		if (rng.next() < intP) {
			const k = rng.int(1, maxInt);
			return q(k);
		}
		const a = rng.int(1, maxN), b = rng.pick(DENS);
		if (gcd(a, b) === 1) return q(a, b);
	}
}

const sgn = (rng: Rng, pNeg: number): 1 | -1 => (rng.next() < pNeg ? -1 : 1);

function buildL1(rng: Rng, kind: string): Built {
	if (kind === 'priorità') {
		const A = N(frac(rng, 9, 0.2)), B = N(frac(rng)), C = N(frac(rng));
		const op: Op = rng.next() < 0.5 ? '*' : ':';
		const chain = Ch([B, C], [op]);
		const s = sgn(rng, 0.4);
		const expr = rng.next() < 0.6 ? Sm([1, A], [s, chain]) : Sm([1, chain], [s, A]);
		return { expr, case: kind };
	}
	const ops: Op[] = rng.next() < 0.7 ? [':', '*'] : [':', ':'];
	return { expr: Ch([N(frac(rng, 9, 0.15)), N(frac(rng)), N(frac(rng))], ops), case: kind };
}

function buildL2(rng: Rng, kind: string): Built {
	const A = N(frac(rng, 9, 0.2));
	const G = Gr(1, Sm([1, N(frac(rng, 9, 0.15))], [sgn(rng, 0.6), N(frac(rng))]));
	const dv = frac(rng, 9, 0.15, 4);
	const Dn = N(kind === 'meno' ? dv : dv.neg());
	const op: Op = rng.next() < 0.5 ? '*' : ':';
	const chain = rng.next() < 0.6 ? Ch([G, Dn], [op]) : Ch([Dn, G], [op]);
	const s: 1 | -1 = kind === 'fattore negativo' ? 1 : -1;
	return { expr: Sm([1, A], [s, chain]), case: kind };
}

const EXPS3 = [-2, -1, 2, 3];

function powLit(rng: Rng, e: number, pNeg: number): Node {
	const r = rng.next() < 0.3 ? q(rng.int(2, e === 3 || e === -2 ? 3 : 4)) : frac(rng, e === 3 || e === -2 ? 3 : 5);
	return Pw(N(rng.next() < pNeg ? r.neg() : r), e);
}

function buildL3(rng: Rng, kind: string): Built {
	const exps: number[] = [];
	for (let i = 0; i < 4; i++) exps.push(rng.pick(EXPS3));
	if (kind === 'esponente zero') exps[rng.int(0, 3)] = 0;
	const plain = rng.next() < 0.5 ? rng.int(0, 3) : -1; // at most one plain number
	const items = exps.map((e, i) => (i === plain && e !== 0 ? N(frac(rng, 9, 0.3, 9)) : powLit(rng, e, 0.5)));
	const t1 = Ch([items[0], items[1]], [rng.next() < 0.6 ? '*' : ':']);
	const t2 = Ch([items[2], items[3]], [rng.next() < 0.6 ? ':' : '*']);
	return { expr: Sm([1, t1], [sgn(rng, 0.6), t2]), case: kind };
}

function buildL4(rng: Rng): Built {
	const side = () => Sm([1, N(frac(rng, 7, 0.35))], [sgn(rng, 0.5), N(frac(rng, 7, 0.2))]);
	return { expr: Fr(side(), side()), case: 'somme' };
}

const DECIMALS = ['0,5', '0,25', '0,75', '0,2', '0,4', '0,6', '0,8', '1,2', '1,5', '2,5', '0,1'];

function buildL5(rng: Rng): Built {
	// four terms: one or two decimals, one or two powers with negative exponent, the rest numbers
	const kinds: ('dec' | 'pow' | 'num')[] = ['dec', 'pow'];
	kinds.push(rng.pick(['dec', 'pow', 'num', 'num'] as const));
	kinds.push(rng.pick(['pow', 'num', 'num'] as const));
	for (let i = kinds.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[kinds[i], kinds[j]] = [kinds[j], kinds[i]];
	}
	const terms = kinds.map((k) => (k === 'dec' ? D(rng.pick(DECIMALS)) : k === 'pow' ? powLit(rng, rng.pick([-1, -1, -2]), 0.5) : N(frac(rng, 7, 0.35))));
	const n = Sm([1, terms[0]], [sgn(rng, 0.5), terms[1]]);
	const d = Sm([1, terms[2]], [sgn(rng, 0.5), terms[3]]);
	return { expr: Fr(n, d), case: 'decimali e potenze' };
}

function buildL6(rng: Rng, kind: string): Built | null {
	// { [ (a ± b)^m op X^n ± c ] · F ± d } op' e, with a ± b = X
	const X0 = frac(rng, 3, 0.2, 2);
	const X = rng.next() < 0.5 ? X0.neg() : X0;
	if (X.abs().isOne()) return null;
	const a = frac(rng, 5, 0.4, 2);
	const diff = a.sub(X); // a - diff = X
	if (diff.isZero()) return null;
	const G = Gr(1, diff.sign() > 0 ? Sm([1, N(a)], [-1, N(diff)]) : Sm([1, N(a)], [1, N(diff.neg())]));
	const m = rng.pick([2, 3]);
	const n = rng.pick([-2, -1, 2, 3]);
	const op1: Op = kind === 'prodotto' ? '*' : ':';
	const s = op1 === '*' ? m + n : m - n;
	if (s === 0 || Math.abs(s) > 3) return null;
	const Q = Gr(2, Sm([1, Ch([Pw(G, m), Pw(N(X), n)], [op1])], [sgn(rng, 0.5), N(frac(rng, 7, 0.3))]));
	const Y = frac(rng, 3, 0.3, 3);
	const F = rng.next() < 0.6 ? Pw(N(Y), rng.pick([-1, -2])) : N(frac(rng, 7, 0.3, 4));
	const inner = rng.next() < 0.6 ? Ch([Q, F], ['*']) : Ch([F, Q], ['*']);
	const Gg = Gr(3, Sm([1, inner], [sgn(rng, 0.5), N(frac(rng, 7, 0.3))]));
	const e = frac(rng, 7, 0.3, 4);
	const top = Ch([Gg, N(rng.next() < 0.5 ? e.neg() : e)], [rng.next() < 0.6 ? ':' : '*']);
	return { expr: top, case: kind };
}

const L1_CASES: [string, number][] = [
	['priorità', 7],
	['da sinistra', 3],
];
const L2_CASES: [string, number][] = [
	['meno', 4],
	['fattore negativo', 3],
	['entrambi', 3],
];
const L3_CASES: [string, number][] = [
	['esponente negativo', 7],
	['esponente zero', 3],
];
const L6_CASES: [string, number][] = [
	['prodotto', 5],
	['quoziente', 5],
];

const MISTAKES: Record<number, Mistake[]> = {
	1: ['order', 'recip', 'sumden', 'sumnaive', 'recipwrong'],
	2: ['meno', 'order', 'recip', 'sumden', 'sumnaive', 'recipwrong'],
	3: ['powsign', 'negexp', 'zeroexp', 'signlost', 'order', 'recip', 'dsign', 'recipwrong'],
	4: ['frac', 'recip', 'sumden', 'sumnaive'],
	5: ['negexp', 'dsign', 'powsign', 'frac', 'recip', 'sumden', 'sumnaive'],
	6: ['prop', 'powsign', 'negexp', 'order', 'recip', 'dsign', 'meno', 'sumden'],
};

/** Values of the distractors, most typical mistakes first; the opposite from level 2 on. */
function mistakes(expr: Node, level: number): Rational[] {
	const v = evaluate(expr);
	const out: Rational[] = [];
	for (const mk of MISTAKES[level]) {
		try {
			out.push(evaluate(expr, mk));
		} catch {
			/* a mistake that divides by zero gives no distractor */
		}
	}
	if (level >= 2) out.push(v.neg());
	const seen = new Set<string>([v.toString()]);
	return out.filter((w) => {
		const k = w.toString();
		if (seen.has(k) || !small(w, 999)) return false;
		seen.add(k);
		return true;
	});
}

function buildRaw(rng: Rng, level: number, kind: string): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng, kind);
		case 2:
			return buildL2(rng, kind);
		case 3:
			return buildL3(rng, kind);
		case 4:
			return buildL4(rng);
		case 5:
			return buildL5(rng);
		case 6:
			return buildL6(rng, kind);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks (the same constraints are written again, independently, in the Python checker)

/** Every value along the way is small, no divisor is zero, and the tree is well formed. */
function sizeAndShape(expr: Node): string[] {
	const v: string[] = [];
	for (const n of nodes(expr)) {
		let val: Rational;
		try {
			val = evaluate(n);
		} catch (e) {
			return [`valore non definito: ${(e as Error).message}`];
		}
		if (!small(val, MID)) v.push(`valore intermedio troppo grande: ${val.toString()}`);
		if (n.t !== 'n' && n.t !== 'd' && val.isZero()) v.push('una parte vale zero');
		if (n.t === 'n' && val.isZero()) v.push('numero zero nel testo');
		if (n.t === 'g' && n.k !== height(n)) v.push('parentesi del tipo sbagliato');
		if (n.t === 'g' && n.x.t !== 'sum') v.push('parentesi senza una somma dentro');
		if (n.t === 'g' && val.abs().isOne()) v.push('parentesi che vale 1 o -1');
		if (n.t === 'pow') {
			if (n.b.t !== 'n' && n.b.t !== 'g') v.push('base di una potenza non valida');
			if (n.e === 1) v.push('esponente 1');
			const b = evaluate(n.b);
			if (b.abs().isOne()) v.push('base 1 o -1');
			if (n.b.t === 'n' && (Math.abs(b.num) > 5 || b.den > 5)) v.push('base troppo grande');
		}
		if (n.t === 'ch') {
			if (n.items.some((it) => it.t === 'sum' || it.t === 'ch')) v.push('catena mal formata');
			if (n.items.some((it) => it.t === 'n' && evaluate(it).abs().isOne())) v.push('fattore 1 o -1');
			if (new Set(n.items.map(tex)).size < n.items.length) v.push('fattore ripetuto nella stessa catena');
		}
		if (n.t === 'sum') {
			if (n.terms.some((t) => t.x.t === 'sum')) v.push('somma mal formata');
			if (n.terms.some((t) => t.x.t === 'n' && evaluate(t.x).sign() < 0)) v.push('addendo negativo senza segno fuori');
			if (n.terms.every((t) => t.x.t === 'n' && evaluate(t.x).isInteger())) v.push('somma di soli interi');
			if (n.terms.map((t) => evaluate(t.x)).reduce((m, x) => lcm(m, x.den), 1) > MID) v.push('denominatore comune troppo grande');
		}
	}
	return v;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const expr = sample.params.expr as Node | undefined;
	if (!expr) return ['params.expr mancante'];
	let value: Rational;
	try {
		value = evaluate(expr);
	} catch (e) {
		return [`espressione non valida: ${(e as Error).message}`];
	}
	if (sample.problem !== tex(expr)) v.push('il testo non corrisponde a params.expr');
	if (sample.answer.kind !== 'number' || sample.answer.value !== value.toString()) v.push('risposta diversa dal valore');
	if (value.isZero() || Math.abs(value.num) > END || value.den > END) v.push('risultato zero o troppo grande');
	if (/\+\s*-|-\s*-|\+\s*\+|\^\{1\}|\d\.\d/.test(sample.problem)) v.push('segni doppi, esponente 1 o punto decimale');
	v.push(...sizeAndShape(expr));
	const all = nodes(expr);
	const count = (t: Node['t']) => all.filter((n) => n.t === t).length;
	const pows = all.filter((n): n is Extract<Node, { t: 'pow' }> => n.t === 'pow');
	const lits = all.filter((n) => n.t === 'n').map((n) => evaluate(n));
	switch (sample.level) {
		case 1: {
			if (count('g') || count('pow') || count('fr') || count('d') || lits.some((r) => r.sign() < 0)) v.push('livello 1: solo numeri positivi, niente parentesi');
			if (value.sign() <= 0) v.push('livello 1: risultato positivo');
			const ok =
				(expr.t === 'sum' && expr.terms.length === 2 && expr.terms.filter((t) => t.x.t === 'ch' && t.x.items.length === 2).length === 1) ||
				(expr.t === 'ch' && expr.items.length === 3 && expr.ops[0] === ':');
			if (!ok) v.push('livello 1: forma non prevista');
			break;
		}
		case 2: {
			if (count('g') !== 1 || count('pow') || count('fr') || count('d')) v.push('livello 2: una sola parentesi, niente potenze');
			if (expr.t !== 'sum' || expr.terms.length !== 2 || expr.terms[1].x.t !== 'ch') v.push('livello 2: forma non prevista');
			else if (!(expr.terms[1].s < 0 || lits.some((r) => r.sign() < 0))) v.push('livello 2: serve un meno davanti o un fattore negativo');
			break;
		}
		case 3: {
			if (count('g') || count('fr') || count('d')) v.push('livello 3: niente parentesi');
			if (pows.length < 3) v.push('livello 3: almeno tre potenze');
			if (!pows.some((p) => p.e < 0)) v.push('livello 3: serve un esponente negativo');
			if (!pows.some((p) => p.e !== 0 && evaluate(p.b).sign() < 0)) v.push('livello 3: serve una base negativa');
			if (pows.filter((p) => p.e === 0).length > 1) v.push('livello 3: al massimo un esponente 0');
			break;
		}
		case 4:
			if (expr.t !== 'fr' || expr.n.t !== 'sum' || expr.d.t !== 'sum' || count('g') || count('pow') || count('d')) v.push('livello 4: frazione di frazioni con somme');
			break;
		case 5:
			if (expr.t !== 'fr' || count('g') || count('d') < 1 || !pows.some((p) => p.e < 0) || pows.some((p) => p.e >= 0)) v.push('livello 5: frazione di frazioni con decimali ed esponenti negativi');
			break;
		case 6: {
			const ks = new Set(all.filter((n) => n.t === 'g').map((n) => (n as { k: number }).k));
			if (!ks.has(1) || !ks.has(2) || !ks.has(3)) v.push('livello 6: servono tonde, quadre e graffe');
			if (!all.some((n) => n.t === 'ch' && n.items.length === 2 && n.items.every((it) => it.t === 'pow') && evaluate((n.items[0] as { b: Node }).b).equals(evaluate((n.items[1] as { b: Node }).b))))
				v.push('livello 6: servono due potenze con la stessa base');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.level !== 3 && /\^\{0\}/.test(sample.problem)) v.push('esponente 0 fuori dal livello 3');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const value = Rational.parse((sample.answer as { value: string }).value);
	const wrong = ((sample.params.wrong as string[]) ?? []).map((w) => Rational.parse(w));
	const cands: ChoiceOption[] = wrong.map(ratOption);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		return ratOption(value.add(q(i % 2 ? -k : k, value.den)));
	};
	return buildChoice(rng, ratOption(value), cands, fallback);
}

const LEVEL_CASES: Record<number, [string, number][]> = { 1: L1_CASES, 2: L2_CASES, 3: L3_CASES, 6: L6_CASES };

export const numeriRazionaliEspressioni: Generator = {
	id: ID,
	title: 'Espressioni con frazioni',
	levels: {
		1: { label: 'Priorità delle operazioni', constraints: ['numeri positivi, due operazioni, niente parentesi', 'circa 7 su 10 somma e prodotto o quoziente, 3 su 10 quozienti e prodotti da sinistra'] },
		2: { label: 'Una parentesi e i segni', constraints: ['una tonda con una somma', 'un meno davanti, un fattore negativo o entrambi'] },
		3: { label: 'Potenze nell’espressione', constraints: ['basi negative, esponenti negativi', 'circa 3 su 10 con un esponente 0'] },
		4: { label: 'Frazioni di frazioni', constraints: ['somme al numeratore e al denominatore'] },
		5: { label: 'Decimali ed esponenti negativi', constraints: ['frazione di frazioni', 'almeno un decimale e una potenza con esponente negativo'] },
		6: { label: 'Tonde, quadre e graffe', constraints: ['tre livelli di parentesi', 'due potenze con la stessa base da unire con le proprietà'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!MISTAKES[level]) throw new Error(`${ID}: unknown level ${level}`);
		// The case is drawn once, so that rejections do not change the shares.
		const kind = LEVEL_CASES[level] ? weighted(rng, LEVEL_CASES[level]) : '';
		for (let attempt = 0; attempt < 20_000; attempt++) {
			let b: Built | null;
			try {
				b = buildRaw(rng, level, kind);
			} catch {
				continue;
			}
			if (!b) continue;
			let value: Rational;
			try {
				value = evaluate(b.expr);
			} catch {
				continue;
			}
			if (value.isZero() || Math.abs(value.num) > END || value.den > END) continue;
			if (sizeAndShape(b.expr).length > 0) continue;
			const wrong = mistakes(b.expr, level);
			if (wrong.length < 3) continue;
			const problem = tex(b.expr);
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: 'Calcola il valore dell’espressione.',
				problem,
				solution: `${problem} = ${value.toLatex()}`,
				steps: buildSteps(b.expr),
				answer: { kind: 'number', value: value.toString() },
				params: { expr: b.expr, case: b.case, wrong: wrong.map((w) => w.toString()) },
			};
			if (check(sample).length > 0) continue;
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRazionaliEspressioni;
