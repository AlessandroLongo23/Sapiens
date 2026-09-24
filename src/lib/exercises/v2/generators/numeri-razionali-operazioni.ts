/**
 * Operazioni in Q. Spec: specs/exercises/numeri-razionali-operazioni.md
 *
 * Seven levels in the order of the lesson: sum or difference with the same denominator, with
 * different denominators, with signs or an integer, product with cross simplification, quotient,
 * two operations, word problems. Levels 1-6: the expression is a small tree in params.expr (leaves
 * are exact rationals), evaluated exactly; the LaTeX, the steps and the answer all come from the
 * tree. Level 7 is a story with two fractions (see the section "Level 7" below).
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, ratOption, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'numeri-razionali-operazioni';

export type Op = 'add' | 'sub' | 'mul' | 'div';
export type Node = { t: 'n'; v: string } | { t: Op; a: Node; b: Node };

const MAX_NUM = 150;
const MAX_DEN = 72;

// ---------------------------------------------------------------------------
// Tree

const leaf = (r: Rational): Node => ({ t: 'n', v: r.toString() });
const bin = (t: Op, a: Node, b: Node): Node => ({ t, a, b });
const isSum = (n: Node) => n.t === 'add' || n.t === 'sub';
const isProd = (n: Node) => n.t === 'mul' || n.t === 'div';

function apply(op: Op, x: Rational, y: Rational): Rational {
	switch (op) {
		case 'add':
			return x.add(y);
		case 'sub':
			return x.sub(y);
		case 'mul':
			return x.mul(y);
		case 'div':
			return x.div(y);
	}
}

export function evaluate(n: Node): Rational {
	if (n.t === 'n') return Rational.parse(n.v);
	return apply(n.t, evaluate(n.a), evaluate(n.b));
}

function leaves(n: Node): Rational[] {
	return n.t === 'n' ? [Rational.parse(n.v)] : [...leaves(n.a), ...leaves(n.b)];
}

/** Every intermediate value, root included. */
function values(n: Node): Rational[] {
	return n.t === 'n' ? [Rational.parse(n.v)] : [...values(n.a), ...values(n.b), evaluate(n)];
}

// ---------------------------------------------------------------------------
// LaTeX

/** A rational as written alone: 3, -3, \frac{2}{5}, -\frac{2}{5}. */
const numLatex = (r: Rational) => r.toLatex();

/** A negative number in parentheses: (-3), \left(-\frac{2}{5}\right). */
function wrapped(r: Rational): string {
	if (r.sign() >= 0) return numLatex(r);
	return r.isInteger() ? `(${r.num})` : `\\left(${numLatex(r)}\\right)`;
}

const OP_LATEX: Record<Op, string> = { add: '+', sub: '-', mul: '\\cdot', div: ':' };

/**
 * `bare`: a negative leaf may be written without parentheses. Only the first term of a sum is
 * bare; factors, divisors and the second term of a sum go in parentheses when negative, as in the
 * lesson. A sum inside a product or a quotient goes in parentheses.
 */
export function latex(n: Node, bare = true): string {
	if (n.t === 'n') {
		const r = Rational.parse(n.v);
		return bare ? numLatex(r) : wrapped(r);
	}
	if (isSum(n)) return `${latex(n.a, bare)} ${OP_LATEX[n.t]} ${latex(n.b, false)}`;
	const side = (m: Node) => (isSum(m) ? `\\left(${latex(m, true)}\\right)` : latex(m, false));
	return `${side(n.a)} ${OP_LATEX[n.t]} ${side(n.b)}`;
}

/** "a op b" for two values, written like the tree with those two leaves. */
const pairLatex = (op: Op, x: Rational, y: Rational) => latex(bin(op, leaf(x), leaf(y)));

/** A fraction as written, not reduced; integers without the bar. */
const fracRaw = (n: number, d: number) => (d === 1 ? `${n}` : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`);

/** "-25 + 8", "14 - 9": a list of signed integers as a numerator. */
function numSeq(nums: number[]): string {
	return nums.map((x, i) => (i === 0 ? `${x}` : x < 0 ? ` - ${-x}` : ` + ${x}`)).join('');
}

// ---------------------------------------------------------------------------
// Steps

function reduceTail(n: number, d: number): string {
	const r = q(n, d);
	return r.num === n && r.den === d ? '' : ` = ${r.toLatex()}`;
}

/** Steps of x ± y. */
function sumSteps(op: 'add' | 'sub', x: Rational, y: Rational): string[] {
	const out: string[] = [];
	let o: 'add' | 'sub' = op, yy = y;
	if (op === 'sub' && y.sign() < 0) {
		out.push(`\\text{Sottrarre } ${numLatex(y)} \\text{ vuol dire sommare } ${numLatex(y.neg())}\\text{: } ${pairLatex('sub', x, y)} = ${pairLatex('add', x, y.neg())}`);
		o = 'add';
		yy = y.neg();
	}
	const head = pairLatex(o, x, yy);
	const s = o === 'add' ? 1 : -1;
	const v = apply(o, x, yy);
	if (x.den === yy.den) {
		const d = x.den;
		const nums = [x.num, s * yy.num];
		const N = x.num + s * yy.num;
		if (d === 1) {
			out.push(`${head} = ${v.toLatex()}`);
			return out;
		}
		out.push(`\\text{Stesso denominatore: ${o === 'add' ? 'somma' : 'sottrai'} i numeratori. } ${head} = \\frac{${numSeq(nums)}}{${d}} = ${fracRaw(N, d)}`);
		if (gcd(N, d) > 1) out.push(`\\text{Riduci ai minimi termini dividendo per } ${gcd(N, d)}\\text{: } ${fracRaw(N, d)} = ${v.toLatex()}`);
		return out;
	}
	const m = lcm(x.den, yy.den);
	const [xi, yi] = [x, yy].map((r) => r.isInteger());
	if (xi || yi) {
		const n = xi ? x : yy;
		out.push(`\\text{Un intero è una frazione con denominatore } 1\\text{: } ${n.num} = \\frac{${n.num * m}}{${m}}`);
	} else {
		out.push(`\\text{MCM}(${x.den}, ${yy.den}) = ${m}\\text{; } ${m} : ${x.den} = ${m / x.den}\\text{, } ${m} : ${yy.den} = ${m / yy.den}`);
	}
	const n1 = x.num * (m / x.den), n2 = s * yy.num * (m / yy.den);
	const N = n1 + n2;
	out.push(`${head} = \\frac{${numSeq([n1, n2])}}{${m}} = ${fracRaw(N, m)}${reduceTail(N, m)}`);
	return out;
}

/** Steps of x · y (or of a quotient already turned into a product: `what` says which). */
function prodSteps(x: Rational, y: Rational, what: 'prodotto' | 'quoziente', head: string): string[] {
	const out: string[] = [];
	const v = x.mul(y);
	if (x.sign() < 0 || y.sign() < 0) {
		const [p, s] = what === 'prodotto' ? ['I fattori sono', 'il prodotto'] : ['Dividendo e divisore sono', 'il quoziente'];
		out.push(v.sign() < 0 ? `\\text{${p} discordi, quindi ${s} è negativo}` : `\\text{${p} concordi, quindi ${s} è positivo}`);
	}
	const a = Math.abs(x.num), b = x.den, c = Math.abs(y.num), d = y.den;
	const g1 = gcd(a, d), g2 = gcd(c, b);
	const sign = v.sign() < 0 ? '-' : '';
	const f = (n: number, m: number) => fracRaw(n, m);
	if (g1 > 1 || g2 > 1) {
		const parts: string[] = [];
		if (g1 > 1) parts.push(`${a} \\text{ e } ${d} \\text{ per } ${g1}`);
		if (g2 > 1) parts.push(`${c} \\text{ e } ${b} \\text{ per } ${g2}`);
		out.push(`\\text{Semplifica in croce: } ${parts.join('\\text{, }')}`);
		out.push(`${head} = ${sign}${f(a / g1, b / g2)} \\cdot ${f(c / g2, d / g1)} = ${v.toLatex()}`);
	} else {
		out.push(`${head} = ${sign}\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = ${v.toLatex()}`);
	}
	return out;
}

function divSteps(x: Rational, y: Rational): string[] {
	const r = q(1).div(y);
	const asProd = pairLatex('mul', x, r);
	const out = [`\\text{Moltiplica per il reciproco del divisore: } ${pairLatex('div', x, y)} = ${asProd}`];
	return [...out, ...prodSteps(x, r, 'quoziente', asProd)];
}

function opSteps(op: Op, x: Rational, y: Rational): string[] {
	if (op === 'add' || op === 'sub') return sumSteps(op, x, y);
	if (op === 'mul') return prodSteps(x, y, 'prodotto', pairLatex('mul', x, y));
	return divSteps(x, y);
}

const OP_NAME: Record<Op, string> = { add: "l'addizione", sub: 'la sottrazione', mul: 'la moltiplicazione', div: 'la divisione' };

/** Steps of the whole tree: inner operation first (parentheses or precedence), then the outer one. */
function treeSteps(n: Node): string[] {
	if (n.t === 'n') return [];
	const aLeaf = n.a.t === 'n', bLeaf = n.b.t === 'n';
	if (aLeaf && bLeaf) return opSteps(n.t, evaluate(n.a), evaluate(n.b));
	const inner = aLeaf ? n.b : n.a;
	const why = isSum(inner) ? 'Prima la parentesi' : `Prima ${OP_NAME[inner.t as Op]}, che precede ${OP_NAME[n.t]}`;
	const out = [`\\text{${why}.}`, ...treeSteps(inner)];
	const x = evaluate(n.a), y = evaluate(n.b);
	out.push(`\\text{Poi ${OP_NAME[n.t]}: } ${latex(n)} = ${pairLatex(n.t, x, y)}`);
	out.push(...opSteps(n.t, x, y));
	return out;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	expr: Node;
	case: string;
	/** Values of the distractors, most typical mistakes first. */
	wrong: (Rational | null)[];
}

/** Positive reduced fraction a/b, b from 2 to maxDen, a up to about 1.5·b. */
function frac(rng: Rng, maxDen: number, minDen = 2): Rational | null {
	const b = rng.int(minDen, maxDen);
	const a = rng.int(1, Math.floor(1.5 * b));
	return gcd(a, b) === 1 ? q(a, b) : null;
}

const safe = (f: () => Rational | null): Rational | null => {
	try {
		return f();
	} catch {
		return null;
	}
};

/** (n1 ± n2)/(d1 + d2): numerators with numerators and denominators with denominators. */
const addAcross = (op: 'add' | 'sub', x: Rational, y: Rational) => safe(() => q(op === 'add' ? x.num + y.num : x.num - y.num, x.den + y.den));
/** Common denominator under the line, numerators left as they are. */
const keepNums = (op: 'add' | 'sub', x: Rational, y: Rational) => safe(() => q(op === 'add' ? x.num + y.num : x.num - y.num, lcm(x.den, y.den)));

function buildL1(rng: Rng, op: 'add' | 'sub'): Built | null {
	const d = rng.int(3, 16);
	// Numerators drawn from a fixed range, so that every (d, a, b) is equally likely and the few
	// exercises with a small denominator do not come back too often.
	const a = rng.int(1, 24), b = rng.int(1, 24);
	if (a > 1.5 * d || b > 1.5 * d || gcd(a, d) !== 1 || gcd(b, d) !== 1) return null;
	const N = op === 'add' ? a + b : a - b;
	// Reducible, but not to an integer: that would be a different exercise (1/3 + 2/3 = 1).
	if (N === 0 || gcd(N, d) === 1 || N % d === 0) return null;
	const x = q(a, d), y = q(b, d);
	const g = gcd(N, d);
	return {
		expr: bin(op, leaf(x), leaf(y)),
		case: op === 'add' ? 'somma' : 'differenza',
		wrong: [
			q(N, 2 * d), // denominators added too
			q(N / g, d), // only the numerator reduced
			q(N, d).neg(),
			op === 'add' ? q(a - b, d) : q(a + b, d),
		],
	};
}

function buildL2(rng: Rng, op: 'add' | 'sub'): Built | null {
	const x = frac(rng, 15), y = frac(rng, 15);
	if (!x || !y || x.den === y.den || lcm(x.den, y.den) > 60) return null;
	if (op === 'sub' && x.compare(y) <= 0) return null;
	const v = apply(op, x, y);
	const m = lcm(x.den, y.den);
	return {
		expr: bin(op, leaf(x), leaf(y)),
		case: op === 'add' ? 'somma' : 'differenza',
		wrong: [
			addAcross(op, x, y),
			keepNums(op, x, y),
			safe(() => q(op === 'add' ? x.num * (m / x.den) + y.num : x.num * (m / x.den) - y.num, m)), // only the first numerator scaled
			v.neg(),
		],
	};
}

function buildL3(rng: Rng, kind: string): Built | null {
	if (kind === 'intero') {
		const n = q(rng.int(1, 5));
		const f = frac(rng, 9);
		if (!f) return null;
		const form = rng.int(0, 2); // n + f, n - f, f - n
		const [x, y, op]: [Rational, Rational, 'add' | 'sub'] = form === 0 ? [n, f, 'add'] : form === 1 ? [n, f, 'sub'] : [f, n, 'sub'];
		const v = apply(op, x, y);
		const s = op === 'add' ? 1 : -1;
		return {
			expr: bin(op, leaf(x), leaf(y)),
			case: kind,
			wrong: [
				safe(() => q(x.isInteger() ? x.num + s * f.num : f.num + s * y.num, f.den)), // integer added to the numerator
				addAcross(op, x, y),
				v.neg(),
			],
		};
	}
	const a = frac(rng, 15), b = frac(rng, 15);
	if (!a || !b || a.den === b.den || lcm(a.den, b.den) > 60) return null;
	if (kind === 'frazione negativa') {
		const x = a.neg(), y = b;
		const op = rng.next() < 0.6 ? 'add' : 'sub';
		const v = apply(op, x, y);
		return {
			expr: bin(op, leaf(x), leaf(y)),
			case: kind,
			wrong: [
				apply(op, a, y).neg(), // the minus extended to the whole sum
				apply(op, a, y), // the minus forgotten
				addAcross(op, x, y),
				v.neg(),
			],
		};
	}
	const x = a, y = b.neg();
	const v = x.sub(y);
	return {
		expr: bin('sub', leaf(x), leaf(y)),
		case: kind,
		wrong: [
			x.sub(b), // minus a negative taken as a plain subtraction
			addAcross('add', x, b),
			v.neg(),
			x.sub(b).neg(),
		],
	};
}

/**
 * x · y with at least one cross simplification, built backwards: x = p1·k1 / q1·k2 and
 * y = p2·k2 / q2·k1, so the pairs (numerator of x, denominator of y) and (numerator of y,
 * denominator of x) share k1 and k2.
 */
function crossPair(rng: Rng, maxN: number): [Rational, Rational] | null {
	const p1 = rng.int(1, 9), q1 = rng.int(1, 9), p2 = rng.int(1, 9), q2 = rng.int(1, 9);
	const k1 = rng.int(1, 7), k2 = rng.int(1, 7);
	if (k1 === 1 && k2 === 1) return null;
	const a = p1 * k1, b = q1 * k2, c = p2 * k2, d = q2 * k1;
	if ([a, b, c, d].some((n) => n > maxN)) return null;
	if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(p1 * p2, q1 * q2) !== 1) return null;
	return [q(a, b), q(c, d)];
}

const SIGNS: [string, number][] = [
	['discordi', 5],
	['negativi', 3],
	['positivi', 2],
];

function signed(rng: Rng, kind: string): [1 | -1, 1 | -1] {
	if (kind === 'positivi') return [1, 1];
	if (kind === 'negativi') return [-1, -1];
	return rng.int(0, 1) ? [-1, 1] : [1, -1];
}

const sgn = (r: Rational, s: 1 | -1) => (s < 0 ? r.neg() : r);

function buildL4(rng: Rng, kind: string): Built | null {
	const pair = crossPair(rng, 40);
	if (!pair) return null;
	const [a, b] = pair;
	if (a.isInteger() || b.isInteger()) return null;
	const [s1, s2] = signed(rng, kind);
	const x = sgn(a, s1), y = sgn(b, s2);
	const v = x.mul(y);
	if (v.abs().isOne() || v.isInteger()) return null;
	const across = safe(() => q(x.num * y.den, x.den * y.num)); // multiplied in cross
	return {
		expr: bin('mul', leaf(x), leaf(y)),
		case: kind,
		wrong: [v.neg(), across, q(1).div(v), across && across.neg()],
	};
}

function buildL5(rng: Rng, want: string): Built | null {
	const pair = crossPair(rng, 40);
	if (!pair) return null;
	const [a, r] = pair; // a · r after the divisor is turned upside down
	const b = q(1).div(r); // the divisor
	const kind = a.isInteger() || b.isInteger() ? 'intero' : 'frazioni';
	if (kind !== want) return null;
	if (a.isInteger() && b.isInteger()) return null;
	if (b.abs().isOne()) return null;
	const [s1, s2] = signed(rng, weighted(rng, SIGNS));
	const x = sgn(a, s1), y = sgn(b, s2);
	const v = x.div(y);
	if (v.abs().isOne() || v.isInteger()) return null;
	// Cross simplification before turning the divisor upside down: x.num with y.den, y.num with x.den.
	const g1 = gcd(Math.abs(x.num), y.den), g2 = gcd(Math.abs(y.num), x.den);
	const early = g1 !== g2 ? v.mul(q(g2 * g2, g1 * g1)) : null;
	return {
		expr: bin('div', leaf(x), leaf(y)),
		case: want,
		wrong: [
			q(1).div(v), // the dividend turned upside down
			x.mul(y), // multiplied without the reciprocal
			early,
			v.neg(),
		],
	};
}

function buildL6(rng: Rng, kind: string): Built | null {
	return kind === 'parentesi' ? buildParen(rng) : buildPrecedence(rng);
}

function fits(e: Node): boolean {
	try {
		const vs = values(e);
		const v = evaluate(e);
		if (v.isZero() || Math.abs(v.num) > MAX_NUM || v.den > 60) return false;
		return vs.every((r) => Math.abs(r.num) <= MAX_NUM && r.den <= MAX_DEN);
	} catch {
		return false;
	}
}

/** (x ± y) op z or z op (x ± y). */
function buildParen(rng: Rng): Built | null {
	const x0 = rng.next() < 0.2 ? q(rng.int(1, 3)) : frac(rng, 12);
	const y = frac(rng, 12);
	const z0 = rng.next() < 0.2 ? q(rng.int(2, 6)) : frac(rng, 10);
	if (!x0 || !y || !z0) return null;
	const x = rng.next() < 0.25 ? x0.neg() : x0;
	const z = rng.next() < 0.2 ? z0.neg() : z0;
	if (x.den === y.den && x.den > 1) return null;
	const so = rng.next() < 0.5 ? 'add' : 'sub';
	const po = rng.next() < 0.5 ? 'mul' : 'div';
	const sum = bin(so, leaf(x), leaf(y));
	const s = safe(() => apply(so, x, y));
	if (!s || s.isZero()) return null;
	const first = rng.next() < 0.7;
	const expr = first ? bin(po, sum, leaf(z)) : bin(po, leaf(z), sum);
	const v = safe(() => evaluate(expr));
	if (!v) return null;
	// Parentheses ignored: the product or quotient is done first.
	const noParen = safe(() => (first ? apply(so, x, apply(po, y, z)) : apply(so, apply(po, z, x), y)));
	const across = addAcross(so, x, y);
	const withAcross = safe(() => (across ? (first ? apply(po, across, z) : apply(po, z, across)) : null));
	const flipped = po === 'div' ? safe(() => (first ? s.mul(z) : z.mul(s))) : null;
	return { expr, case: 'parentesi', wrong: [noParen, withAcross, flipped, v.neg(), q(1).div(v)] };
}

/** x ± y op z or y op z ± x: the product or the quotient first. */
function buildPrecedence(rng: Rng): Built | null {
	const x = rng.next() < 0.35 ? q(rng.int(1, 4)) : frac(rng, 12);
	const y0 = frac(rng, 10);
	const z = rng.next() < 0.2 ? q(rng.int(2, 5)) : frac(rng, 10);
	if (!x || !y0 || !z) return null;
	const y = rng.next() < 0.25 ? y0.neg() : y0;
	const so = rng.next() < 0.5 ? 'add' : 'sub';
	const po = rng.next() < 0.5 ? 'mul' : 'div';
	const prod = bin(po, leaf(y), leaf(z));
	const p = safe(() => apply(po, y, z));
	if (!p) return null;
	const first = rng.next() < 0.7; // x ± y op z
	const expr = first ? bin(so, leaf(x), prod) : bin(so, prod, leaf(x));
	const v = safe(() => evaluate(expr));
	if (!v) return null;
	// Left to right: the sum first.
	const ltr = safe(() => (first ? apply(po, apply(so, x, y), z) : null));
	const across = safe(() => (first ? addAcross(so, x, p) : addAcross(so, p, x)));
	const flipped = po === 'div' ? safe(() => (first ? apply(so, x, y.mul(z)) : apply(so, y.mul(z), x))) : null;
	return { expr, case: 'precedenza', wrong: [ltr, across, flipped, v.neg()] };
}

const small = (r: Rational) => Math.abs(r.num) <= 999 && r.den <= 999;

function cleanWrong(b: Built): Rational[] {
	const v = evaluate(b.expr);
	const seen = new Set<string>();
	const out: Rational[] = [];
	for (const w of b.wrong) {
		if (!w || !small(w) || w.equals(v) || seen.has(w.toString())) continue;
		seen.add(w.toString());
		out.push(w);
	}
	return out;
}

const SUMS: ['add' | 'sub', number][] = [
	['add', 6],
	['sub', 4],
];

/** The case of each level with its weight, and the builder for one case. */
const LEVELS: Record<number, { cases: [string, number][]; build: (rng: Rng, c: string) => Built | null }> = {
	1: { cases: SUMS, build: (rng, c) => buildL1(rng, c as 'add' | 'sub') },
	2: { cases: SUMS, build: (rng, c) => buildL2(rng, c as 'add' | 'sub') },
	3: {
		cases: [
			['frazione negativa', 4],
			['meno una negativa', 3],
			['intero', 3],
		],
		build: buildL3,
	},
	4: { cases: SIGNS, build: buildL4 },
	5: {
		cases: [
			['frazioni', 7],
			['intero', 3],
		],
		build: buildL5,
	},
	6: {
		cases: [
			['parentesi', 5],
			['precedenza', 5],
		],
		build: buildL6,
	},
};

/**
 * The case is drawn once, then the builder runs until it gives a valid exercise of that case, so
 * that rejections do not change the shares. Valid: small numbers and three distinct typical mistakes.
 */
function build(rng: Rng, level: number): Built | null {
	const spec = LEVELS[level];
	if (!spec) throw new Error(`${ID}: unknown level ${level}`);
	const c = weighted(rng, spec.cases);
	for (let i = 0; i < 5000; i++) {
		const b = spec.build(rng, c);
		if (b && fits(b.expr) && cleanWrong(b).length >= 3) return b;
	}
	return null;
}

// ---------------------------------------------------------------------------
// Checks

function parseNode(x: unknown): Node | null {
	if (!x || typeof x !== 'object') return null;
	const n = x as Record<string, unknown>;
	if (n.t === 'n') return typeof n.v === 'string' && /^-?\d+(\/\d+)?$/.test(n.v) ? { t: 'n', v: n.v } : null;
	if (n.t === 'add' || n.t === 'sub' || n.t === 'mul' || n.t === 'div') {
		const a = parseNode(n.a), b = parseNode(n.b);
		return a && b ? { t: n.t, a, b } : null;
	}
	return null;
}

function check(sample: Sample): string[] {
	if (sample.level === 7) return checkProblem(sample);
	const v: string[] = [];
	const expr = parseNode(sample.params.expr);
	if (!expr || expr.t === 'n') return ['params.expr non valido'];
	let value: Rational;
	try {
		value = evaluate(expr);
	} catch (e) {
		return [`espressione non valida: ${(e as Error).message}`];
	}
	if (sample.problem !== latex(expr)) v.push('il testo non corrisponde a params.expr');
	if (sample.answer.kind !== 'number' || sample.answer.value !== value.toString()) v.push('risposta diversa dal valore');
	if (!fits(expr)) v.push('numeri troppo grandi o risultato nullo');
	if (/\+\s*-|-\s*-|\+\s*\+/.test(sample.problem)) v.push('segni doppi nel testo');
	const ls = leaves(expr);
	if (ls.some((r) => r.isZero())) v.push('operando nullo');
	const fracs = ls.filter((r) => !r.isInteger());
	const a = ls[0], b = ls[1];
	const shape2 = expr.a.t === 'n' && expr.b.t === 'n';
	switch (sample.level) {
		case 1:
			if (!shape2 || !isSum(expr) || fracs.length !== 2 || a.den !== b.den || ls.some((r) => r.sign() < 0)) v.push('servono due frazioni positive con lo stesso denominatore');
			else if (gcd(expr.t === 'add' ? a.num + b.num : a.num - b.num, a.den) === 1) v.push('il risultato deve essere da ridurre');
			else if (value.isInteger()) v.push('risultato intero');
			break;
		case 2:
			if (!shape2 || !isSum(expr) || fracs.length !== 2 || a.den === b.den || ls.some((r) => r.sign() < 0)) v.push('servono due frazioni positive con denominatori diversi');
			if (value.sign() <= 0) v.push('risultato non positivo');
			if (lcm(a.den, b.den) > 60) v.push('MCM oltre 60');
			break;
		case 3: {
			if (!shape2 || !isSum(expr)) {
				v.push('serve una somma o una differenza di due termini');
				break;
			}
			const c = sample.params.case;
			const ok =
				(c === 'frazione negativa' && fracs.length === 2 && a.sign() < 0 && b.sign() > 0 && a.den !== b.den) ||
				(c === 'meno una negativa' && expr.t === 'sub' && fracs.length === 2 && a.sign() > 0 && b.sign() < 0 && a.den !== b.den) ||
				(c === 'intero' && fracs.length === 1 && ls.every((r) => r.sign() > 0));
			if (!ok) v.push(`forma diversa dal caso ${String(c)}`);
			break;
		}
		case 4:
		case 5: {
			const op = sample.level === 4 ? 'mul' : 'div';
			if (!shape2 || expr.t !== op) {
				v.push(`serve ${op === 'mul' ? 'un prodotto' : 'un quoziente'} di due numeri`);
				break;
			}
			const y = op === 'mul' ? b : q(1).div(b);
			if (gcd(Math.abs(a.num), y.den) === 1 && gcd(Math.abs(y.num), a.den) === 1) v.push('manca la semplificazione in croce');
			if (sample.level === 4 && fracs.length !== 2) v.push('servono due frazioni');
			if (sample.level === 5 && fracs.length === 0) v.push('serve almeno una frazione');
			if (sample.level === 5 && b.abs().isOne()) v.push('divisore 1 o -1');
			if (value.isInteger()) v.push('risultato intero');
			break;
		}
		case 6:
			if (shape2) v.push('servono due operazioni');
			else {
				const inner = expr.a.t === 'n' ? expr.b : expr.a;
				const ok = (isSum(inner) && isProd(expr)) || (isProd(inner) && isSum(expr));
				if (!ok) v.push('serve una somma e un prodotto o quoziente');
			}
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const value = Rational.parse((sample.answer as { value: string }).value);
	const wrong = ((sample.params.wrong as string[]) ?? []).map((w) => Rational.parse(w));
	const cands: ChoiceOption[] = wrong.map(ratOption);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		return ratOption(q(value.num + (i % 2 ? -k : k), value.den));
	};
	return buildChoice(rng, ratOption(value), cands, fallback);
}

// ---------------------------------------------------------------------------
// Level 7: word problems with two fractions
//
// Two fractions x and y of a story. "somma": both are fractions of the whole, and the question is
// what is left (1 - (x + y)). "resto": y is a fraction of what is left after x, and the question is
// either the second part (y · (1 - x)) or what is left at the end ((1 - x) - y · (1 - x)). Four
// times in ten the text gives the total, and the answer is that fraction of it, an integer.

type ProbKind = 'somma' | 'resto';
type Ask = 'resta' | 'seconda';

interface Person {
	name: string;
	f: boolean;
}

const PEOPLE: Person[] = [
	{ name: 'Marta', f: true },
	{ name: 'Giulia', f: true },
	{ name: 'Chiara', f: true },
	{ name: 'Sara', f: true },
	{ name: 'Elena', f: true },
	{ name: 'Sofia', f: true },
	{ name: 'Luca', f: false },
	{ name: 'Marco', f: false },
	{ name: 'Davide', f: false },
	{ name: 'Matteo', f: false },
	{ name: 'Andrea', f: false },
	{ name: 'Francesco', f: false },
];

const FAMILIES = ['Esposito', 'Russo', 'Colombo', 'Ferrari', 'Bianchi', 'Romano', 'Ricci', 'Greco'];

/** "$\frac{2}{5}$" inside a \text{} line. */
const fr = (r: Rational) => `$\\frac{${r.num}}{${r.den}}$`;
/** "i 2/5" or "1/4" (read "un quarto"). */
const the = (r: Rational) => (r.num === 1 ? fr(r) : `i ${fr(r)}`);
/** "sui 2/5" or "su 1/4". */
const onThe = (r: Rational) => (r.num === 1 ? `su ${fr(r)}` : `sui ${fr(r)}`);
/** Verb agreeing with "1/3 degli studenti arriva", "i 2/5 degli studenti arrivano". */
const verb = (r: Rational, one: string, many: string) => (r.num === 1 ? one : many);

interface StoryCtx {
	who: string;
	/** Pronoun: "le" or "gli". */
	le: string;
	x: Rational;
	y: Rational;
	kind: ProbKind;
}

interface Story {
	id: string;
	/** Who acts: a person, a family, nobody. */
	who: 'persona' | 'famiglia' | 'nessuno';
	/** The situation with the two fractions. */
	text(c: StoryCtx): string;
	/** Question without the total. */
	askFraction(c: StoryCtx, ask: Ask): string;
	/** Range and step of the total. */
	total: [number, number, number];
	totalText(c: StoryCtx, t: number): string;
	askNumber(c: StoryCtx, ask: Ask): string;
	/** Unit of the answer with the total, for the solution. */
	unit: string;
}

const STORIES: Story[] = [
	{
		id: 'stipendio',
		who: 'persona',
		text: ({ who, le, x, y, kind }) =>
			`Ogni mese ${who} spende ${the(x)} dello stipendio per l'affitto e ${the(y)} ${kind === 'resto' ? `di quello che ${le} rimane ` : ''}per la spesa.`,
		askFraction: ({ le }, ask) => (ask === 'resta' ? `Che frazione dello stipendio ${le} resta?` : 'Che frazione dello stipendio spende per la spesa?'),
		total: [1200, 2400, 50],
		totalText: (_, t) => `Lo stipendio è di ${t} euro.`,
		askNumber: ({ le }, ask) => (ask === 'resta' ? `Quanti euro ${le} restano?` : 'Quanti euro spende per la spesa?'),
		unit: 'euro',
	},
	{
		id: 'libro',
		who: 'persona',
		text: ({ who, x, y, kind }) =>
			`${who} legge ${the(x)} di un libro il primo giorno e ${the(y)} ${kind === 'resto' ? 'delle pagine che restano ' : ''}il secondo giorno.`,
		askFraction: ({ le }, ask) => (ask === 'resta' ? `Che frazione del libro ${le} resta da leggere?` : 'Che frazione del libro legge il secondo giorno?'),
		total: [96, 480, 1],
		totalText: (_, t) => `Il libro ha ${t} pagine.`,
		askNumber: ({ le }, ask) => (ask === 'resta' ? `Quante pagine ${le} restano da leggere?` : 'Quante pagine legge il secondo giorno?'),
		unit: 'pagine',
	},
	{
		id: 'viaggio',
		who: 'famiglia',
		text: ({ who, x, y, kind }) =>
			`${who} parte in auto per le vacanze. Il primo giorno percorre ${the(x)} del viaggio, il secondo giorno ${the(y)}${kind === 'resto' ? ' della strada che manca' : ''}.`,
		askFraction: (_, ask) => (ask === 'resta' ? 'Che frazione del viaggio resta da fare?' : 'Che frazione del viaggio percorre il secondo giorno?'),
		total: [300, 1200, 10],
		totalText: (_, t) => `Il viaggio è lungo ${t} km.`,
		askNumber: (_, ask) => (ask === 'resta' ? 'Quanti km restano da fare?' : 'Quanti km percorre il secondo giorno?'),
		unit: 'km',
	},
	{
		id: 'risparmi',
		who: 'persona',
		text: ({ who, le, x, y, kind }) =>
			`${who} ha dei risparmi nel salvadanaio: ne spende ${the(x)} per un paio di scarpe da calcio e ${the(y)} ${kind === 'resto' ? `di quello che ${le} rimane ` : ''}per un videogioco.`,
		askFraction: ({ le }, ask) => (ask === 'resta' ? `Che frazione dei risparmi ${le} resta?` : 'Che frazione dei risparmi spende per il videogioco?'),
		total: [60, 360, 5],
		totalText: (_, t) => `Nel salvadanaio ci sono ${t} euro.`,
		askNumber: ({ le }, ask) => (ask === 'resta' ? `Quanti euro ${le} restano?` : 'Quanti euro costa il videogioco?'),
		unit: 'euro',
	},
	{
		id: 'figurine',
		who: 'persona',
		text: ({ who, x, y, kind }) =>
			`${who} fa la raccolta delle figurine. A settembre attacca nell'album ${the(x)} delle figurine, a ottobre ${the(y)}${kind === 'resto' ? ' di quelle che mancano' : ''}.`,
		askFraction: (_, ask) => (ask === 'resta' ? "Che frazione dell'album è ancora vuota?" : "Che frazione dell'album riempie a ottobre?"),
		total: [240, 720, 1],
		totalText: (_, t) => `L'album ha ${t} figurine.`,
		askNumber: (_, ask) => (ask === 'resta' ? 'Quante figurine mancano ancora?' : 'Quante figurine attacca a ottobre?'),
		unit: 'figurine',
	},
	{
		id: 'orto',
		who: 'persona',
		text: ({ who, x, y, kind }) =>
			`Il nonno di ${who} ha un orto: pianta i pomodori ${onThe(x)} del terreno e le zucchine ${onThe(y)}${kind === 'resto' ? ' della parte rimasta' : ''}.`,
		askFraction: (_, ask) => (ask === 'resta' ? "Che frazione dell'orto resta libera?" : "Che frazione dell'orto è piantata a zucchine?"),
		total: [60, 360, 1],
		totalText: (_, t) => `L'orto misura ${t} metri quadrati.`,
		askNumber: (_, ask) => (ask === 'resta' ? 'Quanti metri quadrati restano liberi?' : 'Quanti metri quadrati sono piantati a zucchine?'),
		unit: 'metri quadrati',
	},
	{
		id: 'nuoto',
		who: 'persona',
		text: ({ who, x, y, kind }) =>
			`In allenamento ${who} nuota ${the(x)} della distanza a stile libero e ${the(y)} ${kind === 'resto' ? 'della distanza rimasta ' : ''}a dorso; il resto lo fa a rana.`,
		askFraction: (_, ask) => (ask === 'resta' ? 'Che frazione della distanza nuota a rana?' : 'Che frazione della distanza nuota a dorso?'),
		total: [1000, 3000, 50],
		totalText: (_, t) => `L'allenamento è di ${t} metri.`,
		askNumber: (_, ask) => (ask === 'resta' ? 'Quanti metri nuota a rana?' : 'Quanti metri nuota a dorso?'),
		unit: 'metri',
	},
	{
		id: 'scuola',
		who: 'nessuno',
		text: ({ x, y, kind }) =>
			kind === 'somma'
				? `In una scuola ${the(x)} degli studenti ${verb(x, 'arriva', 'arrivano')} in autobus e ${the(y)} in bicicletta; gli altri vengono a piedi.`
				: `In una scuola ${the(x)} degli studenti ${verb(x, 'arriva', 'arrivano')} in autobus; degli altri, ${the(y)} ${verb(y, 'viene', 'vengono')} in bicicletta e il resto a piedi.`,
		askFraction: (_, ask) => (ask === 'resta' ? 'Che frazione degli studenti va a piedi?' : 'Che frazione degli studenti va in bicicletta?'),
		total: [300, 1200, 1],
		totalText: (_, t) => `La scuola ha ${t} studenti.`,
		askNumber: (_, ask) => (ask === 'resta' ? 'Quanti studenti vanno a piedi?' : 'Quanti studenti vanno in bicicletta?'),
		unit: 'studenti',
	},
];

const STORY_BY_ID = new Map(STORIES.map((st) => [st.id, st]));
const ONE = q(1);
const PROB_DENS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
/** No part above 3/4: "spends 11/12 of the salary on rent" is not a real situation. */
const MAX_PART = q(3, 4);

/** The fraction the question asks for, from the two fractions of the story. */
function problemValue(kind: ProbKind, ask: Ask, x: Rational, y: Rational): Rational {
	if (kind === 'somma') return ONE.sub(x.add(y));
	const rest = ONE.sub(x);
	const second = y.mul(rest);
	return ask === 'seconda' ? second : rest.sub(second);
}

/** Typical mistakes, as fractions of the whole: most typical first. */
function problemWrong(kind: ProbKind, ask: Ask, x: Rational, y: Rational): (Rational | null)[] {
	const rest = ONE.sub(x);
	if (kind === 'somma')
		return [
			x.add(y), // the part spent: answer to another question
			safe(() => ONE.sub(q(x.num + y.num, x.den + y.den))), // numerators and denominators added
			ONE.sub(x.mul(y)), // multiplied the parts
			ONE.sub(x), // the second fraction forgotten
			ONE.sub(y),
		];
	if (ask === 'resta')
		return [
			ONE.sub(x.add(y)), // the fraction of the rest taken on the whole
			y.mul(rest), // the second part: answer to another question
			ONE.sub(y.mul(rest)), // the first part not subtracted
			x.mul(ONE.sub(y)),
			rest.sub(y),
		];
	return [
		y, // the fraction of the rest taken on the whole
		x.mul(y), // taken of the first part
		rest.mul(ONE.sub(y)), // what is left: answer to another question
		ONE.sub(x.add(y)),
		ONE.sub(y),
	];
}

/** Integer totals in the story's range for which every part is a whole number. */
function totalsFor(st: Story, kind: ProbKind, x: Rational, y: Rational): number[] {
	const [lo, hi, step] = st.total;
	const out: number[] = [];
	for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) {
		const parts = kind === 'somma' ? [x.mul(q(t)), y.mul(q(t))] : [x.mul(q(t)), y.mul(ONE.sub(x)).mul(q(t))];
		if (parts.every((r) => r.isInteger())) out.push(t);
	}
	return out;
}

function properFrac(rng: Rng): Rational | null {
	const d = rng.pick(PROB_DENS);
	const n = rng.int(1, d - 1);
	return gcd(n, d) === 1 ? q(n, d) : null;
}

interface Problem {
	story: Story;
	kind: ProbKind;
	ask: Ask;
	x: Rational;
	y: Rational;
	total: number | null;
	who: string;
	le: string;
	value: Rational;
	wrong: Rational[];
}

function tryProblem(rng: Rng, kind: ProbKind, ask: Ask, withTotal: boolean): Problem | null {
	const story = rng.pick(STORIES);
	const x = properFrac(rng), y = properFrac(rng);
	if (!x || !y || x.equals(y) || x.compare(MAX_PART) > 0 || y.compare(MAX_PART) > 0) return null;
	if (kind === 'somma' && (x.den === y.den || lcm(x.den, y.den) > 40 || x.add(y).compare(ONE) >= 0)) return null;
	const value = problemValue(kind, ask, x, y);
	if (value.sign() <= 0 || value.den > 60) return null;
	let total: number | null = null;
	if (withTotal) {
		const ts = totalsFor(story, kind, x, y);
		if (!ts.length) return null;
		total = rng.pick(ts);
	}
	const scale = (r: Rational) => (total == null ? r : r.mul(q(total)));
	const answer = scale(value);
	const seen = new Set<string>([answer.toString()]);
	const wrong: Rational[] = [];
	for (const w0 of problemWrong(kind, ask, x, y)) {
		if (!w0 || w0.sign() <= 0) continue;
		const w = scale(w0);
		if ((total != null && !w.isInteger()) || w.den > 99 || seen.has(w.toString())) continue;
		seen.add(w.toString());
		wrong.push(w);
	}
	if (wrong.length < 3) return null;
	let who = '', le = 'gli';
	if (story.who === 'famiglia') who = `La famiglia ${rng.pick(FAMILIES)}`;
	else if (story.who === 'persona') {
		const p = rng.pick(PEOPLE);
		who = p.name;
		le = p.f ? 'le' : 'gli';
	}
	return { story, kind, ask, x, y, total, who, le, value, wrong };
}

function problemSteps(p: Problem): string[] {
	const { kind, ask, x, y, value, total } = p;
	const out: string[] = [];
	if (kind === 'somma') {
		out.push('\\text{Le due frazioni sono dello stesso intero: le parti si sommano.}');
		out.push(...sumSteps('add', x, y));
		out.push("\\text{Quello che resta è l'intero, cioè } 1\\text{, meno le due parti.}");
		out.push(...sumSteps('sub', ONE, x.add(y)));
	} else {
		const rest = ONE.sub(x);
		const second = y.mul(rest);
		out.push("\\text{La seconda frazione è di quello che resta, non dell'intero.}");
		out.push('\\text{Dopo la prima parte resta:}');
		out.push(...sumSteps('sub', ONE, x));
		out.push(`\\text{La seconda parte è } ${y.toLatex()} \\text{ di } ${rest.toLatex()}\\text{:}`);
		out.push(...prodSteps(y, rest, 'prodotto', pairLatex('mul', y, rest)));
		if (ask === 'resta') {
			out.push('\\text{Alla fine resta:}');
			out.push(...sumSteps('sub', rest, second));
		}
	}
	if (total != null) {
		const n = value.mul(q(total));
		out.push(`${value.toLatex()} \\text{ di } ${total} = ${total} : ${value.den} \\cdot ${value.num} = ${n.toString()}`);
	}
	return out;
}

function generateProblem(rng: Rng, seed: number): Sample {
	const kind = weighted<ProbKind>(rng, [
		['somma', 4],
		['resto', 6],
	]);
	const ask: Ask = kind === 'somma' ? 'resta' : rng.next() < 0.5 ? 'resta' : 'seconda';
	const withTotal = rng.next() < 0.4;
	for (let i = 0; i < 10_000; i++) {
		const p = tryProblem(rng, kind, ask, withTotal);
		if (!p) continue;
		const c: StoryCtx = { who: p.who, le: p.le, x: p.x, y: p.y, kind };
		const prose = [p.story.text(c), p.total == null ? p.story.askFraction(c, ask) : `${p.story.totalText(c, p.total)} ${p.story.askNumber(c, ask)}`].join(' ');
		const answer = p.total == null ? p.value : p.value.mul(q(p.total));
		const sample: Sample = {
			generatorId: ID,
			level: 7,
			seed,
			prompt: 'Risolvi il problema.',
			problem: textBlock(prose),
			solution: p.total == null ? answer.toLatex() : `${answer.toString()}\\text{ ${p.story.unit}}`,
			steps: problemSteps(p),
			answer: { kind: 'number', value: answer.toString() },
			params: {
				story: p.story.id,
				case: kind,
				ask,
				x: p.x.toString(),
				y: p.y.toString(),
				total: p.total == null ? null : String(p.total),
				wrong: p.wrong.map((w) => w.toString()),
			},
		};
		if (checkProblem(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level 7, seed ${seed}`);
}

function parseRat(s: unknown): Rational | null {
	if (typeof s !== 'string' || !/^-?\d+(\/\d+)?$/.test(s)) return null;
	try {
		return Rational.parse(s);
	} catch {
		return null;
	}
}

function checkProblem(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const story = STORY_BY_ID.get(String(p.story));
	const x = parseRat(p.x), y = parseRat(p.y);
	const kind = p.case as ProbKind, ask = p.ask as Ask;
	if (!story) v.push('storia sconosciuta');
	if (kind !== 'somma' && kind !== 'resto') return [...v, 'caso sconosciuto'];
	if (ask !== 'resta' && ask !== 'seconda') return [...v, 'domanda sconosciuta'];
	if (kind === 'somma' && ask !== 'resta') v.push('con due parti dello stesso intero si chiede quello che resta');
	if (!x || !y) return [...v, 'frazioni non valide'];
	for (const r of [x, y]) {
		if (r.sign() <= 0 || r.compare(MAX_PART) > 0 || !PROB_DENS.includes(r.den)) v.push('serve una frazione fino a 3/4 con denominatore da 2 a 12');
	}
	if (x.equals(y)) v.push('due frazioni uguali');
	if (kind === 'somma') {
		if (x.den === y.den) v.push('denominatori uguali');
		if (lcm(x.den, y.den) > 40) v.push('MCM oltre 40');
		if (x.add(y).compare(ONE) >= 0) v.push('le due parti superano l\'intero');
	}
	const value = problemValue(kind, ask, x, y);
	if (value.sign() <= 0 || value.den > 60) v.push('frazione cercata nulla o con denominatore oltre 60');
	let answer = value;
	if (p.total != null) {
		const t = Number(p.total);
		if (!Number.isInteger(t) || !story || t < story.total[0] || t > story.total[1] || t % story.total[2] !== 0) v.push('totale fuori intervallo');
		else if (!totalsFor(story, kind, x, y).includes(t)) v.push('il totale non dà parti intere');
		answer = value.mul(q(t));
		if (!answer.isInteger()) v.push('risposta non intera');
		if (!sample.problem.includes(String(t))) v.push('il totale non è nel testo');
	}
	if (sample.answer.kind !== 'number' || sample.answer.value !== answer.toString()) v.push('risposta sbagliata');
	const fx = `\\frac{${x.num}}{${x.den}}`, fy = `\\frac{${y.num}}{${y.den}}`;
	const ix = sample.problem.indexOf(fx), iy = sample.problem.indexOf(fy, ix + 1);
	if (ix < 0 || iy < 0) v.push('le frazioni non sono nel testo, nell\'ordine');
	const wrong = (p.wrong as string[] | undefined) ?? [];
	if (wrong.length < 3 || wrong.some((w) => w === answer.toString()) || new Set(wrong).size !== wrong.length) v.push('distrattori non validi');
	if (!sample.steps.length) v.push('mancano i passaggi');
	return v;
}

export const numeriRazionaliOperazioni: Generator = {
	id: ID,
	title: 'Operazioni in Q',
	levels: {
		1: { label: 'Stesso denominatore', constraints: ['somma o differenza di due frazioni positive ridotte con lo stesso denominatore', 'risultato da ridurre, non intero'] },
		2: { label: 'Denominatori diversi', constraints: ['due frazioni positive ridotte con denominatori diversi, MCM fino a 60', 'risultato positivo'] },
		3: { label: 'Segni e interi', constraints: ['frazione negativa, sottrazione di una negativa o un intero, in proporzione 4, 3, 3'] },
		4: { label: 'Prodotto', constraints: ['due frazioni con almeno una semplificazione in croce', 'fattori discordi, negativi o positivi, in proporzione 5, 3, 2'] },
		5: { label: 'Quoziente', constraints: ['si semplifica dopo aver capovolto il divisore', 'circa 3 su 10 con un intero'] },
		6: { label: 'Due operazioni', constraints: ['metà con una parentesi, metà con la precedenza del prodotto o del quoziente'] },
		7: {
			label: 'Problemi con le frazioni',
			constraints: [
				'due frazioni proprie di una storia: parti dello stesso intero (4 su 10) o la seconda del resto (6 su 10)',
				'risposta: una frazione ridotta, oppure un intero quando il testo dà il totale (4 su 10)',
			],
		},
	},
	generate(rng: Rng, level: number): Sample {
		if (level === 7) return generateProblem(rng, rng.seed);
		for (let attempt = 0; attempt < 100; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const wrong = cleanWrong(b);
			const value = evaluate(b.expr);
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: 'Calcola.',
				problem: latex(b.expr),
				solution: `${latex(b.expr)} = ${value.toLatex()}`,
				steps: treeSteps(b.expr),
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

export default numeriRazionaliOperazioni;
