/**
 * Sistemi di secondo grado. Spec: specs/exercises/sistemi-secondo-grado.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/93-sistemi-secondo-grado.md): substitution
 * with xy = p, substitution into squares, line and parabola (secant, tangent, external), symmetric systems
 * x + y = s, xy = p, symmetric systems with the sum of squares, and rectangle problems.
 *
 * Built backwards: the solutions are chosen first (the roots of the resolvent), then the coefficients.
 *
 * Answer: always multiple choice, because the answer is a set of pairs. Option values:
 * - a set of pairs: ["(x,y)", ...], sorted by x then y; [] for the empty set;
 * - a set of numbers (the mistake "the solutions are numbers"): ["-3/2", "1"];
 * - level 3: the position of the line first, then its common points: ["secante", "(0,-3)", "(3,0)"];
 * - level 6: the two sides, ascending: ["3", "4"]; [] when the figure does not exist.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, exactSqrt, gcd, q } from '../rational';
import { paren } from '../latex';

export const ID = 'sistemi-secondo-grado';

type V = 'x' | 'y';
type Pair = [Rational, Rational];
/** a x + b y = c */
interface Lin {
	a: Rational;
	b: Rational;
	c: Rational;
}
/** xx x^2 + yy y^2 + xy xy + x x + y y = c */
interface Quad {
	xx: Rational;
	yy: Rational;
	xy: Rational;
	x: Rational;
	y: Rational;
	c: Rational;
}

const R = (n: number | Rational) => (typeof n === 'number' ? q(n) : n);
const lin = (a: number | Rational, b: number | Rational, c: number | Rational): Lin => ({ a: R(a), b: R(b), c: R(c) });
const quad = (o: Partial<Record<keyof Quad, number | Rational>>): Quad => ({
	xx: R(o.xx ?? 0),
	yy: R(o.yy ?? 0),
	xy: R(o.xy ?? 0),
	x: R(o.x ?? 0),
	y: R(o.y ?? 0),
	c: R(o.c ?? 0),
});
const other = (v: V): V => (v === 'x' ? 'y' : 'x');
const nice = (r: Rational, den = 10, num = 30) => r.den <= den && Math.abs(r.num) <= num;

// ---------------------------------------------------------------------------
// Algebra

/** The unknown with coefficient ±1 in the linear equation (y first), or null. */
function unitVar(l: Lin): V | null {
	if (l.b.abs().isOne()) return 'y';
	if (l.a.abs().isOne()) return 'x';
	return null;
}

/** v = e1 u + e0 from the linear equation. */
function express(l: Lin, v: V): { e1: Rational; e0: Rational } {
	const cv = v === 'x' ? l.a : l.b;
	const cu = v === 'x' ? l.b : l.a;
	return { e1: cu.neg().div(cv), e0: l.c.div(cv) };
}

/** The resolvent A u^2 + B u + C = 0 after v = e1 u + e0 goes into the quadratic equation. */
function resolvent(Q: Quad, v: V, e1: Rational, e0: Rational): [Rational, Rational, Rational] {
	// kv v^2 + ku u^2 + kxy uv + lv v + lu u = c
	const kv = v === 'y' ? Q.yy : Q.xx;
	const ku = v === 'y' ? Q.xx : Q.yy;
	const lv = v === 'y' ? Q.y : Q.x;
	const lu = v === 'y' ? Q.x : Q.y;
	const A = ku.add(kv.mul(e1).mul(e1)).add(Q.xy.mul(e1));
	const B = q(2).mul(kv).mul(e1).mul(e0).add(Q.xy.mul(e0)).add(lu).add(lv.mul(e1));
	const C = kv.mul(e0).mul(e0).add(lv.mul(e0)).sub(Q.c);
	return [A, B, C];
}

/** Rational roots of A u^2 + B u + C = 0 (A may be 0), ascending; null if irrational or indeterminate. */
function ratRoots(A: Rational, B: Rational, C: Rational): Rational[] | null {
	if (A.isZero()) {
		if (B.isZero()) return C.isZero() ? null : [];
		return [C.neg().div(B)];
	}
	const D = B.mul(B).sub(q(4).mul(A).mul(C));
	if (D.sign() < 0) return [];
	const s = exactSqrt(D);
	if (!s) return null;
	if (s.isZero()) return [B.neg().div(A.mul(q(2)))];
	const r = [B.neg().sub(s).div(A.mul(q(2))), B.neg().add(s).div(A.mul(q(2)))];
	return r.sort((m, n) => m.compare(n));
}

/** The real solutions of the system, sorted; null if they are not rational. */
function solveSystem(l: Lin, Q: Quad): Pair[] | null {
	const v = unitVar(l) ?? (l.b.isZero() ? 'x' : 'y');
	const { e1, e0 } = express(l, v);
	const [A, B, C] = resolvent(Q, v, e1, e0);
	const roots = ratRoots(A, B, C);
	if (!roots) return null;
	return sortPairs(roots.map((u) => (v === 'y' ? [u, e1.mul(u).add(e0)] : [e1.mul(u).add(e0), u]) as Pair));
}

const sortPairs = (ps: Pair[]) => [...ps].sort((m, n) => m[0].compare(n[0]) || m[1].compare(n[1]));

// ---------------------------------------------------------------------------
// LaTeX

function body(c: Rational, v: string): string {
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
/** Monomials in order, zero ones left out: "2y^2 + y - 3". */
function seq(items: [Rational, string][]): string {
	return joinTerms(items.filter(([c]) => !c.isZero()).map(([c, v]) => ({ neg: c.sign() < 0, tex: body(c, v) })));
}
const linLatex = (l: Lin) => `${seq([
	[l.a, 'x'],
	[l.b, 'y'],
])} = ${l.c.toLatex()}`;
const quadLatex = (Q: Quad) =>
	`${seq([
		[Q.xx, 'x^2'],
		[Q.yy, 'y^2'],
		[Q.xy, 'xy'],
		[Q.x, 'x'],
		[Q.y, 'y'],
	])} = ${Q.c.toLatex()}`;
const casesLatex = (lines: string[]) => `\\begin{cases} ${lines.join(' \\\\ ')} \\end{cases}`;

/** v = e1 u + e0, written "5 - x" when e1 < 0 < e0 (as the lessons do), else "2y + 1". */
function exprLatex(e1: Rational, e0: Rational, u: string): { tex: string; constFirst: boolean } {
	if (e1.sign() < 0 && e0.sign() > 0) return { tex: `${e0.toLatex()} - ${body(e1, u)}`, constFirst: true };
	return {
		tex: seq([
			[e1, u],
			[e0, ''],
		]),
		constFirst: false,
	};
}
function prodTerm(k: Rational, val: Rational, first: boolean): Term {
	const a = k.abs();
	if (a.isOne()) return { neg: k.sign() < 0, tex: first && k.sign() > 0 ? val.toLatex() : paren(val) };
	return { neg: k.sign() < 0, tex: `${a.toLatex()} \\cdot ${paren(val)}` };
}
/** e1 · val + e0 in the order of the expression: "2 \cdot 1 + 1", "5 - 3". */
function plugLatex(e1: Rational, e0: Rational, val: Rational, constFirst: boolean): string {
	const e0t: Term = { neg: e0.sign() < 0, tex: e0.abs().toLatex() };
	if (constFirst) return joinTerms([e0t, prodTerm(e1, val, false)]);
	const ts = [prodTerm(e1, val, true)];
	if (!e0.isZero()) ts.push(e0t);
	return joinTerms(ts);
}

const hasFrac = (rs: Rational[]) => rs.some((r) => !r.isInteger());
const pairLatex = (p: Pair) => (hasFrac(p) ? `\\left(${p[0].toLatex()}, ${p[1].toLatex()}\\right)` : `(${p[0].toLatex()}, ${p[1].toLatex()})`);
function setLatex(items: string[], frac: boolean): string {
	if (items.length === 0) return 'S = \\emptyset';
	return frac ? `S = \\left\\{${items.join(', ')}\\right\\}` : `S = \\{${items.join(', ')}\\}`;
}
const pairsSetLatex = (ps: Pair[]) => setLatex(sortPairs(ps).map(pairLatex), ps.some((p) => hasFrac(p)));
const numsSetLatex = (rs: Rational[]) => setLatex([...rs].sort((m, n) => m.compare(n)).map((r) => r.toLatex()), hasFrac(rs));

// ---------------------------------------------------------------------------
// Options

interface Opt {
	values: string[];
	latex: string;
}
const pairVal = (p: Pair) => `(${p[0].toString()},${p[1].toString()})`;
const optPairs = (ps: Pair[]): Opt => {
	const s = sortPairs(ps);
	return { values: s.map(pairVal), latex: pairsSetLatex(s) };
};
const optNums = (rs: Rational[]): Opt => {
	const s = [...rs].sort((m, n) => m.compare(n));
	return { values: s.map((r) => r.toString()), latex: numsSetLatex(s) };
};
type Pos = 'secante' | 'tangente' | 'esterna';
function optLine(pos: Pos, ps: Pair[]): Opt {
	const s = sortPairs(ps);
	const latex = pos === 'esterna' ? '\\text{esterna, nessun punto comune}' : `\\begin{gathered} \\text{${pos}} \\\\ ${s.map(pairLatex).join(',\\ ')} \\end{gathered}`;
	return { values: [pos, ...s.map(pairVal)], latex };
}
function optSides(a: number, b: number): Opt {
	const [m, n] = a <= b ? [a, b] : [b, a];
	return { values: [String(m), String(n)], latex: `${m}\\ \\text{cm e } ${n}\\ \\text{cm}` };
}
const optNone = (fig: string): Opt => ({ values: [], latex: `\\text{Il ${fig} non esiste}` });
const optKey = (o: { values: string[] }) => o.values.join('|');

/** Correct option first, then the candidates in order, distinct, up to four. Null when fewer than four. */
function pickOptions(correct: Opt, cands: (Opt | null)[]): Opt[] | null {
	const out = [correct];
	const seen = new Set([optKey(correct)]);
	for (const c of cands) {
		if (!c || out.length >= 4) continue;
		const k = optKey(c);
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(c);
	}
	return out.length === 4 ? out : null;
}

function shuffle(rng: Rng, opts: Opt[]): ChoiceAnswer {
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: opts[i].latex, values: opts[i].values }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** Pairs usable as a distractor: small rationals. */
const okPairs = (ps: Pair[] | null): ps is Pair[] => !!ps && ps.length > 0 && ps.every((p) => nice(p[0], 10, 60) && nice(p[1], 10, 60));

// ---------------------------------------------------------------------------
// The resolvent, as in the lesson

/** Integer coefficients with A > 0 and no common factor; the steps that get there. */
function normalize(A: Rational, B: Rational, C: Rational, u: string, out: string[], lead: string): [Rational, Rational, Rational] {
	let [a, b, c] = [A, B, C];
	const flip = a.sign() < 0;
	if (flip) [a, b, c] = [a.neg(), b.neg(), c.neg()];
	const eq = (x: Rational, y: Rational, z: Rational) =>
		`${seq([
			[x, `${u}^2`],
			[y, u],
			[z, ''],
		])} = 0`;
	out.push(`\\text{${lead}${flip ? ' e cambia segno' : ''}: } ${eq(a, b, c)}`);
	const g = gcd(gcd(a.num, b.num), c.num);
	if (g > 1) {
		[a, b, c] = [a, b, c].map((r) => r.div(q(g)));
		out.push(`\\text{Dividi per } ${g}\\text{: } ${eq(a, b, c)}`);
	}
	return [a, b, c];
}

/** Solves A u^2 + B u + C = 0 (integers, A > 0) as the lesson does; the roots, ascending. */
function quadSteps(A: Rational, B: Rational, C: Rational, u: string, out: string[]): Rational[] {
	if (C.isZero()) {
		out.push(
			`\\text{Raccogli } ${u}\\text{: } ${u}(${seq([
				[A, u],
				[B, ''],
			])}) = 0`,
		);
		const r = [q(0), B.neg().div(A)].sort((m, n) => m.compare(n));
		out.push(`${u}_1 = ${r[0].toLatex()}, \\quad ${u}_2 = ${r[1].toLatex()}`);
		return r;
	}
	if (B.isZero()) {
		const k = C.neg().div(A);
		if (!A.isOne()) out.push(`${seq([[A, `${u}^2`]])} = ${C.neg().toLatex()}`);
		out.push(`${u}^2 = ${k.toLatex()}`);
		if (k.sign() < 0) {
			out.push(`\\text{Un quadrato non è mai negativo: nessuna soluzione}`);
			return [];
		}
		const s = exactSqrt(k);
		if (!s) throw new Error(`${ID}: irrational pure root`);
		out.push(`${u} = \\pm ${s.toLatex()}`);
		return [s.neg(), s];
	}
	const b2 = B.mul(B);
	const m4 = q(-4).mul(A).mul(C);
	const D = b2.add(m4);
	out.push(`\\Delta = ${b2.toLatex()} ${m4.sign() < 0 ? '-' : '+'} ${m4.abs().toLatex()} = ${D.toLatex()}`);
	if (D.sign() < 0) {
		out.push(`\\Delta < 0\\text{: la risolvente non ha soluzioni}`);
		return [];
	}
	if (D.isZero()) {
		const r = B.neg().div(A.mul(q(2)));
		out.push(`\\Delta = 0\\text{: una sola soluzione, } ${u} = \\frac{${B.neg().toLatex()}}{${A.mul(q(2)).toLatex()}} = ${r.toLatex()}`);
		return [r];
	}
	const s = exactSqrt(D);
	if (!s) throw new Error(`${ID}: irrational roots`);
	out.push(`${u}_{1,2} = \\frac{${B.neg().toLatex()} \\pm ${s.toLatex()}}{${A.mul(q(2)).toLatex()}}`);
	const r = [B.neg().sub(s).div(A.mul(q(2))), B.neg().add(s).div(A.mul(q(2)))].sort((m, n) => m.compare(n));
	out.push(`${u}_1 = ${r[0].toLatex()}, \\quad ${u}_2 = ${r[1].toLatex()}`);
	return r;
}

/** "Per ogni valore di u ricava v": one step per root. */
function backSteps(v: V, u: V, e1: Rational, e0: Rational, roots: Rational[], out: string[]): Pair[] {
	const ex = exprLatex(e1, e0, u);
	out.push(`\\text{Per ogni valore di } ${u} \\text{ ricava } ${v} \\text{ da } ${v} = ${ex.tex}`);
	return roots.map((val) => {
		const vv = e1.mul(val).add(e0);
		const plug = plugLatex(e1, e0, val, ex.constFirst);
		out.push(`${u} = ${val.toLatex()}\\text{: } ${v} = ${plug === vv.toLatex() ? plug : `${plug} = ${vv.toLatex()}`}`);
		return (v === 'y' ? [val, vv] : [vv, val]) as Pair;
	});
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	problem: string;
	/** The linear equation and the second-degree one (level 3: the line and the parabola). */
	lin: Lin;
	quad: Quad;
	/** Order of the two equations in the problem: true when the second-degree one comes first. */
	quadFirst: boolean;
	kind: string | null;
	steps: string[];
	solution: string;
	correct: Opt;
	cands: (Opt | null)[];
	extra?: Record<string, unknown>;
}

function nz(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

/** Substitution steps shared by levels 1 and 2: isolate v, the lines given by `middle`, the resolvent, back. */
function substitution(l: Lin, Q: Quad, v: V, middle: (e1: Rational, e0: Rational, ex: string) => string[]): { steps: string[]; pairs: Pair[]; roots: Rational[] } {
	const u = other(v);
	const cv = v === 'x' ? l.a : l.b;
	const { e1, e0 } = express(l, v);
	const ex = exprLatex(e1, e0, u).tex;
	const steps = [`\\text{Nella prima equazione } ${v} \\text{ ha coefficiente } ${cv.toLatex()}\\text{: ricavala, } ${v} = ${ex}`, ...middle(e1, e0, ex)];
	const [A, B, C] = resolvent(Q, v, e1, e0);
	const [a, b, c] = normalize(A, B, C, u, steps, 'Porta tutto a primo membro');
	const roots = quadSteps(a, b, c, u, steps);
	const pairs = backSteps(v, u, e1, e0, roots, steps);
	return { steps, pairs, roots };
}

/** Level 1: substitution into xy = p (example 1). */
function level1(rng: Rng): Built | null {
	const v: V = rng.next() < 0.5 ? 'x' : 'y';
	const u = other(v);
	const eps = v === 'x' ? 1 : rng.pick([1, 1, -1]);
	const k = nz(rng, -3, 3);
	const u1 = nz(rng, -5, 5), n = nz(rng, -9, 9);
	// roots of the resolvent: u1 and n / k; v = eps (h - k u)
	const h = k * u1 + n, p = eps * u1 * n;
	if (Math.abs(h) > 12 || Math.abs(p) > 30) return null;
	const u2 = q(n, k);
	if (u2.equals(q(u1))) return null;
	const L = v === 'x' ? lin(1, k, h) : lin(k, eps, h);
	if (L.a.sign() < 0 && L.b.sign() < 0) return null;
	if (!nice(u2, 3, 9)) return null;
	const Q = quad({ xy: 1, c: p });
	const sub = substitution(L, Q, v, (e1, e0, ex) => {
		const prod = v === 'x' ? `(${ex})y` : `x(${ex})`;
		return [
			`\\text{Sostituisci nella seconda, tra parentesi: } ${prod} = ${p}`,
			`${seq([
				[e1, `${u}^2`],
				[e0, u],
			])} = ${p}`,
		];
	});
	const pairs = sub.pairs;
	if (pairs.length !== 2) return null;
	const steps = [...sub.steps, pairsSetLatex(pairs)];
	const intPair = pairs.find((pp) => !hasFrac(pp)) ?? pairs[0];
	const { e1, e0 } = express(L, v);
	// Vieta with the sign of the sum wrong: the roots changed in sign
	const flipped = sub.roots.map((r) => r.neg()).map((uu) => (v === 'y' ? [uu, e1.mul(uu).add(e0)] : [e1.mul(uu).add(e0), uu]) as Pair);
	const cands = [
		optPairs([intPair]),
		optPairs(pairs.map(([x, y]) => [y, x] as Pair)),
		optNums(sub.roots),
		okPairs(flipped) ? optPairs(flipped) : null,
		optPairs([]),
	];
	return { problem: casesLatex([linLatex(L), quadLatex(Q)]), lin: L, quad: Q, quadFirst: false, kind: v, steps, solution: pairsSetLatex(pairs), correct: optPairs(pairs), cands };
}

const SQUARES: [number, number][] = [
	[1, 1],
	[1, 1],
	[1, 1],
	[1, -1],
	[2, 1],
	[1, 2],
];

/** Level 2: substitution into a x^2 + b y^2 = r, the square of a binomial (example 2). */
function level2(rng: Rng): Built | null {
	const v: V = rng.next() < 0.7 ? 'y' : 'x';
	const u = other(v);
	const [xx, yy] = rng.pick(SQUARES);
	const K = v === 'y' ? yy : xx; // coefficient of v^2
	const Lc = v === 'y' ? xx : yy; // coefficient of u^2
	const m = nz(rng, -3, 3), qq = nz(rng, -4, 4);
	const u1 = rng.int(-3, 3);
	const A = Lc + K * m * m;
	if (A === 0) return null;
	const u2 = q(-2 * K * m * qq, A).sub(q(u1));
	if (u2.equals(q(u1)) || !nice(u2, 10, 20)) return null;
	const r = Lc * u1 * u1 + K * (m * u1 + qq) ** 2;
	if (r === 0 || Math.abs(r) > 80) return null;
	// v = m u + qq in normal form, first coefficient positive
	let L = v === 'y' ? lin(m, -1, -qq) : lin(1, -m, qq);
	if (L.a.sign() < 0) L = lin(L.a.neg(), L.b.neg(), L.c.neg());
	const Q = quad({ xx, yy, c: r });
	const sub = substitution(L, Q, v, (e1, e0, ex) => {
		const sq: Term = { neg: K < 0, tex: `${Math.abs(K) === 1 ? '' : Math.abs(K)}(${ex})^2` };
		const uT: Term = { neg: Lc < 0, tex: body(q(Lc), `${u}^2`) };
		const first = v === 'y' ? [uT, sq] : [sq, uT];
		const devTex = seq([
			[e1.mul(e1), `${u}^2`],
			[q(2).mul(e1).mul(e0), u],
			[e0.mul(e0), ''],
		]);
		const out = [`\\text{Sostituisci nella seconda: } ${joinTerms(first)} = ${r}`];
		const devItems: [Rational, string][] = [
			[q(K).mul(e1).mul(e1), `${u}^2`],
			[q(K).mul(q(2)).mul(e1).mul(e0), u],
			[q(K).mul(e0).mul(e0), ''],
		];
		const all: [Rational, string][] = v === 'y' ? [[q(Lc), `${u}^2`], ...devItems] : [...devItems, [q(Lc), `${u}^2`]];
		if (K !== 1) {
			const dev: Term = { neg: K < 0, tex: `${Math.abs(K) === 1 ? '' : Math.abs(K)}(${devTex})` };
			out.push(`\\text{Sviluppa il quadrato del binomio: } ${joinTerms(v === 'y' ? [uT, dev] : [dev, uT])} = ${r}`);
			out.push(`${seq(all)} = ${r}`);
		} else {
			out.push(`\\text{Sviluppa il quadrato del binomio: } ${seq(all)} = ${r}`);
		}
		return out;
	});
	const pairs = sub.pairs;
	if (pairs.length !== 2) return null;
	const steps = [...sub.steps, pairsSetLatex(pairs)];
	const { e1, e0 } = express(L, v);
	const toPair = (uu: Rational): Pair => (v === 'y' ? [uu, e1.mul(uu).add(e0)] : [e1.mul(uu).add(e0), uu]);
	// the other unknown taken from the second-degree equation: the sign of v changed in one pair
	const vOf = (p: Pair) => (v === 'y' ? p[1] : p[0]);
	const flipV = (p: Pair): Pair => (v === 'y' ? [p[0], p[1].neg()] : [p[0].neg(), p[1]]);
	const order = [...pairs].sort((m1, m2) => Number(hasFrac(m1)) - Number(hasFrac(m2)));
	const which = order.find((p) => !vOf(p).isZero());
	const wrongSign = which ? pairs.map((p) => (p === which ? flipV(p) : p)) : null;
	// the square without the double product: A u^2 + K e0^2 - r = 0
	const k2 = q(r).sub(q(K).mul(e0).mul(e0)).div(q(A));
	const w = exactSqrt(k2);
	const noDouble = w && !w.isZero() ? [w.neg(), w].map(toPair) : null;
	const cands = [
		wrongSign && okPairs(wrongSign) ? optPairs(wrongSign) : null,
		okPairs(noDouble) ? optPairs(noDouble) : null,
		optPairs([order[0]]),
		optNums(sub.roots),
		optPairs(pairs.map(([x, y]) => [y, x] as Pair)),
	];
	return { problem: casesLatex([linLatex(L), quadLatex(Q)]), lin: L, quad: Q, quadFirst: false, kind: v, steps, solution: pairsSetLatex(pairs), correct: optPairs(pairs), cands };
}

/** Level 3: line and parabola, secant 4 in 10, tangent 3 in 10, external 3 in 10. */
function level3(rng: Rng, pick: number): Built | null {
	const pos: Pos = pick < 0.4 ? 'secante' : pick < 0.7 ? 'tangente' : 'esterna';
	const a = rng.pick([1, 1, 1, -1, -1, 2]);
	const b = rng.int(-5, 5), c = rng.int(-8, 8);
	// resolvent a(x^2 + B x + C) = (a x^2 + b x + c) - (m x + qq)
	let B: number, C: number;
	if (pos === 'esterna') {
		B = rng.int(-4, 4);
		C = Math.floor((B * B) / 4) + rng.int(1, 5);
	} else {
		const x1 = rng.int(-4, 4);
		const x2 = pos === 'tangente' ? x1 : rng.int(-4, 4);
		if (pos === 'secante' && x1 === x2) return null;
		B = -(x1 + x2);
		C = x1 * x2;
	}
	const m = b - a * B, qq = c - a * C;
	if (m === 0 || Math.abs(m) > 6 || Math.abs(qq) > 15) return null;
	const parab = (x: Rational) => q(a).mul(x).mul(x).add(q(b).mul(x)).add(q(c));
	const line = (x: Rational) => q(m).mul(x).add(q(qq));
	const parTex = `y = ${seq([
		[q(a), 'x^2'],
		[q(b), 'x'],
		[q(c), ''],
	])}`;
	// the line as the lesson writes it: y = x - 3, y = 3 - x
	const lineTex = `y = ${exprLatex(q(m), q(qq), 'x').tex}`;
	const steps: string[] = [`\\text{Le due equazioni danno } y\\text{: uguaglia i secondi membri, } ${parTex.slice(4)} = ${lineTex.slice(4)}`];
	const [A2, B2, C2] = normalize(q(a), q(b - m), q(c - qq), 'x', steps, 'Porta tutto a primo membro');
	const roots = quadSteps(A2, B2, C2, 'x', steps);
	const got: Pos = roots.length === 2 ? 'secante' : roots.length === 1 ? 'tangente' : 'esterna';
	if (got !== pos) return null;
	const pts = roots.map((x) => [x, line(x)] as Pair);
	if (pts.some((p) => Math.abs(p[1].num) > 30)) return null;
	const what = { secante: 'ha due soluzioni: la retta è secante', tangente: 'ha una sola soluzione: la retta è tangente', esterna: 'non ha soluzioni: la retta è esterna' }[pos];
	steps.push(`\\text{La risolvente ${what}}`);
	if (pts.length) {
		steps.push(`\\text{Ricava } y \\text{ da } ${lineTex}`);
		const ex = exprLatex(q(m), q(qq), 'x');
		for (const [x, y] of pts) {
			const plug = plugLatex(q(m), q(qq), x, ex.constFirst);
			steps.push(`x = ${x.toLatex()}\\text{: } y = ${plug === y.toLatex() ? plug : `${plug} = ${y.toLatex()}`}`);
		}
	}
	const S = pairsSetLatex(pts);
	steps.push(S);
	const cap = pos[0].toUpperCase() + pos.slice(1);
	// distractors
	const xs = q(-B, 2);
	const wrongY = (x: Rational): Pair => [x, qq !== 0 ? q(m).mul(x).sub(q(qq)) : line(x).add(q(1))];
	// the known term carried across with the wrong sign: x^2 + B x - C
	const wr = ratRoots(q(1), q(B), q(-C));
	const wrongRes = wr && wr.length === 2 ? wr.map((x) => [x, line(x)] as Pair) : null;
	const pt = (ps: Pair[]) => ps.every((p) => nice(p[0], 2, 20) && nice(p[1], 2, 40));
	const cands: (Opt | null)[] = [];
	if (pos === 'secante') {
		cands.push(optLine('tangente', [pts[0]]), optLine('esterna', []), optLine('secante', pts.map((p) => wrongY(p[0]))));
	} else if (pos === 'tangente') {
		cands.push(optLine('esterna', []), optLine('tangente', [wrongY(pts[0][0])]));
		if (wrongRes && pt(wrongRes)) cands.push(optLine('secante', wrongRes));
		cands.push(optLine('secante', [pts[0], [pts[0][0].neg(), line(pts[0][0].neg())]]), optLine('tangente', [[pts[0][1], pts[0][0]]]));
	} else {
		cands.push(optLine('tangente', [[xs, line(xs)]]));
		if (wrongRes && pt(wrongRes)) cands.push(optLine('secante', wrongRes));
		cands.push(optLine('tangente', [[xs, parab(xs)]]), optLine('secante', [xs.sub(q(1)), xs.add(q(1))].map((x) => [x, line(x)] as Pair)));
	}
	return {
		problem: casesLatex([parTex, lineTex]),
		lin: lin(-m, 1, qq),
		quad: quad({ xx: -a, x: -b, y: 1, c }),
		quadFirst: true,
		kind: pos,
		steps,
		solution: `\\text{${cap}: } ${S}`,
		correct: optLine(pos, pts),
		cands,
		extra: { parabola: [String(a), String(b), String(c)], line: [String(m), String(qq)] },
	};
}

/** Level 4: x + y = s, xy = p; two pairs 6 in 10, one pair 2 in 10, impossible 2 in 10. */
function level4(rng: Rng, pick: number): Built | null {
	const kind = pick < 0.6 ? 'due coppie' : pick < 0.8 ? 'una coppia' : 'impossibile';
	let s: number, p: number;
	let wrongT: Rational[] | null = null; // roots of t^2 - s t - p = 0 (the sign of p), for the impossible case
	if (kind === 'due coppie') {
		const t1 = nz(rng, -10, 10), t2 = nz(rng, -10, 10, [t1]);
		s = t1 + t2;
		p = t1 * t2;
	} else if (kind === 'una coppia') {
		const t = nz(rng, -6, 6);
		s = 2 * t;
		p = t * t;
	} else {
		// built from the wrong equation t^2 - s t - p = 0 with roots r1 > 0 > r2
		const r1 = rng.int(1, 9), r2 = -rng.int(1, 9);
		s = r1 + r2;
		p = -r1 * r2;
		if (s * s - 4 * p >= 0) return null;
		wrongT = [q(r2), q(r1)];
	}
	if (s === 0 || Math.abs(p) > 60) return null;
	const quadFirst = rng.next() < 0.25;
	const L = lin(1, 1, s), Q = quad({ xy: 1, c: p });
	const steps = [`\\text{Il sistema è simmetrico, con } s = ${s} \\text{ e } p = ${p}`];
	const tEq = `${seq([
		[q(1), 't^2'],
		[q(-s), 't'],
		[q(p), ''],
	])} = 0`;
	steps.push(`\\text{Le incognite sono le soluzioni di } t^2 - st + p = 0\\text{: } ${tEq}`);
	const roots = quadSteps(q(1), q(-s), q(p), 't', steps);
	const pairs = symPairs(roots, steps);
	const S = pairsSetLatex(pairs);
	steps.push(S);
	const correct = optPairs(pairs);
	const sw = (ts: Rational[]) => symPairsQuiet(ts);
	const cands: (Opt | null)[] = [];
	if (kind === 'due coppie') {
		cands.push(optPairs([pairs[0]]), optPairs(sw(roots.map((t) => t.neg()))), optNums(roots), optPairs([]));
	} else if (kind === 'una coppia') {
		cands.push(optPairs(sw([roots[0].neg()])), optPairs([]), optNums(roots), optPairs([[roots[0], roots[0]], [roots[0].neg(), roots[0].neg()]]));
	} else {
		const w = wrongT!;
		cands.push(optPairs(sw(w)), optPairs([[w[0], w[1]]]), optNums(w), optPairs(sw(w.map((t) => t.neg()))));
	}
	const lines = [linLatex(L), quadLatex(Q)];
	return { problem: casesLatex(quadFirst ? lines.reverse() : lines), lin: L, quad: Q, quadFirst, kind, steps, solution: kind === 'impossibile' ? `\\text{Sistema impossibile: } ${S}` : S, correct, cands };
}

/** The pairs (t1, t2), (t2, t1) of a symmetric system, with the step that says so. */
function symPairs(roots: Rational[], out: string[]): Pair[] {
	if (roots.length === 2) {
		out.push(`\\text{Le coppie sono } ${pairLatex([roots[0], roots[1]])} \\text{ e } ${pairLatex([roots[1], roots[0]])}`);
	} else if (roots.length === 1) {
		out.push(`\\text{Le due incognite sono uguali: la coppia è } ${pairLatex([roots[0], roots[0]])}`);
	} else {
		out.push(`\\text{Nessuna coppia di numeri reali ha questa somma e questo prodotto: il sistema è impossibile}`);
	}
	return symPairsQuiet(roots);
}
function symPairsQuiet(roots: Rational[]): Pair[] {
	if (roots.length === 2) return sortPairs([[roots[0], roots[1]], [roots[1], roots[0]]]);
	if (roots.length === 1) return [[roots[0], roots[0]]];
	return [];
}

/** Level 5: x + y = s, x^2 + y^2 = k (example 7). */
function level5(rng: Rng): Built | null {
	const t1 = rng.int(-9, 10), t2 = rng.int(-9, 10);
	if (t1 === t2) return null;
	const s = t1 + t2, k = t1 * t1 + t2 * t2, p = t1 * t2;
	if (s === 0 || p === 0 || k > 130) return null;
	const L = lin(1, 1, s), Q = quad({ xx: 1, yy: 1, c: k });
	const quadFirst = rng.next() < 0.25;
	const steps = [
		`\\text{Il sistema è simmetrico. Dal quadrato del binomio: } x^2 + y^2 = (x + y)^2 - 2xy`,
		`\\text{Sostituisci i valori noti: } ${k} = ${s * s} - 2xy`,
		`2xy = ${s * s - k}`,
		`xy = ${p}`,
	];
	const tEq = `${seq([
		[q(1), 't^2'],
		[q(-s), 't'],
		[q(p), ''],
	])} = 0`;
	steps.push(`\\text{Ora } x + y = ${s} \\text{ e } xy = ${p}\\text{: le incognite sono le soluzioni di } ${tEq}`);
	const roots = quadSteps(q(1), q(-s), q(p), 't', steps);
	const pairs = symPairs(roots, steps);
	if (pairs.length !== 2) return null;
	const S = pairsSetLatex(pairs);
	steps.push(S);
	const sym = (A: number, Bq: number) => {
		const r = ratRoots(q(1), q(-A), q(Bq));
		return r && r.length === 2 && r.every((t) => t.isInteger() && Math.abs(t.num) <= 20) ? symPairsQuiet(r) : null;
	};
	// the 2 of 2xy forgotten: xy = s^2 - k; the sign of the product: xy = (k - s^2) / 2
	const forgot2 = sym(s, s * s - k);
	const signP = sym(s, -p);
	const cands = [
		forgot2 ? optPairs(forgot2) : null,
		signP ? optPairs(signP) : null,
		optPairs([pairs[0]]),
		optPairs(symPairsQuiet(roots.map((t) => t.neg()))),
		optNums(roots),
	];
	const lines = [linLatex(L), quadLatex(Q)];
	return { problem: casesLatex(quadFirst ? lines.reverse() : lines), lin: L, quad: Q, quadFirst, kind: null, steps, solution: S, correct: optPairs(pairs), cands, extra: { p: String(p) } };
}

// Level 6 ----------------------------------------------------------------------

type Story = 'area' | 'diagonale' | 'triangolo' | 'impossibile';

/** Pythagorean triples with legs a < b and hypotenuse up to 50. */
const TRIPLES: [number, number, number][] = (() => {
	const out: [number, number, number][] = [];
	for (let c = 5; c <= 50; c++)
		for (let a = 3; a < c; a++) {
			const b2 = c * c - a * a;
			const b = Math.round(Math.sqrt(b2));
			if (b * b === b2 && a < b) out.push([a, b, c]);
		}
	return out;
})();

function textLines(lines: string[]): string {
	return `\\begin{array}{l} ${lines.map((t) => `\\text{${t}}`).join(' \\\\ ')} \\end{array}`;
}

function level6(rng: Rng, pick: number): Built | null {
	const story: Story = pick < 0.4 ? 'area' : pick < 0.7 ? 'diagonale' : pick < 0.85 ? 'triangolo' : 'impossibile';
	let s: number; // x + y
	let a = 0, b = 0; // the sides, a < b
	let P: number, A = 0, d = 0;
	let Q: Quad;
	if (story === 'area') {
		a = rng.int(1, 12);
		b = rng.int(a + 1, 20);
		s = a + b;
		P = 2 * s;
		A = a * b;
		Q = quad({ xy: 1, c: A });
	} else if (story === 'impossibile') {
		s = rng.int(4, 15);
		A = Math.floor((s * s) / 4) + rng.int(1, 12);
		P = 2 * s;
		Q = quad({ xy: 1, c: A });
	} else {
		[a, b, d] = rng.pick(TRIPLES);
		s = a + b;
		P = story === 'diagonale' ? 2 * s : a + b + d;
		Q = quad({ xx: 1, yy: 1, c: d * d });
	}
	if (P > 120) return null;
	const L = lin(1, 1, s);
	const fig = story === 'triangolo' ? 'triangolo' : 'rettangolo';
	const cm2 = '$\\text{cm}^2$';
	let lines: string[];
	if (story === 'area' || story === 'impossibile') {
		lines = rng.pick([
			[`Un rettangolo ha il perimetro di ${P} cm e l'area`, `di ${A} ${cm2}. Quanto misurano i lati?`],
			[`Il perimetro di un rettangolo è ${P} cm e la sua`, `area è ${A} ${cm2}. Quanto misurano i lati?`],
		]);
	} else if (story === 'diagonale') {
		lines = [`Un rettangolo ha il perimetro di ${P} cm e la`, `diagonale di ${d} cm. Quanto misurano i lati?`];
	} else {
		lines = [`Un triangolo rettangolo ha il perimetro di ${P} cm`, `e l'ipotenusa di ${d} cm. Quanto misurano i cateti?`];
	}
	const who = story === 'triangolo' ? 'i cateti' : 'i lati';
	const steps = [`\\text{Chiama } x \\text{ e } y \\text{ le misure de${story === 'triangolo' ? 'i cateti' : 'i lati'}, in cm, con } x > 0 \\text{ e } y > 0`];
	let p: number;
	if (story === 'area' || story === 'impossibile') {
		steps.push(`\\text{La somma dei lati è metà del perimetro e il prodotto è l'area: } x + y = ${s},\\quad xy = ${A}`);
		p = A;
	} else {
		if (story === 'diagonale') {
			steps.push(`\\text{La somma dei lati è metà del perimetro: } x + y = ${s}`);
			steps.push(`\\text{Per il teorema di Pitagora: } x^2 + y^2 = ${d}^2 = ${d * d}`);
		} else {
			steps.push(`\\text{La somma dei cateti è il perimetro meno l'ipotenusa: } x + y = ${P} - ${d} = ${s}`);
			steps.push(`\\text{Per il teorema di Pitagora: } x^2 + y^2 = ${d}^2 = ${d * d}`);
		}
		steps.push(`\\text{Da } x^2 + y^2 = (x + y)^2 - 2xy\\text{: } ${d * d} = ${s * s} - 2xy`);
		p = (s * s - d * d) / 2;
		steps.push(`xy = ${p}`);
	}
	const tEq = `${seq([
		[q(1), 't^2'],
		[q(-s), 't'],
		[q(p), ''],
	])} = 0`;
	steps.push(`\\text{Il sistema è simmetrico: } ${tEq}`);
	const roots = quadSteps(q(1), q(-s), q(p), 't', steps);
	let correct: Opt;
	let solution: string;
	if (story === 'impossibile') {
		if (roots.length) return null;
		steps.push(`\\text{Il sistema è impossibile: il rettangolo non esiste}`);
		correct = optNone(fig);
		solution = `\\text{Il rettangolo non esiste}`;
	} else {
		if (roots.length !== 2 || !roots[0].equals(q(a)) || !roots[1].equals(q(b))) return null;
		steps.push(
			`\\text{Le coppie } (${a}, ${b}) \\text{ e } (${b}, ${a}) \\text{ rispettano le limitazioni e descrivono lo stesso ${fig}${story === 'triangolo' ? '' : ', con la base e l\'altezza scambiate'}}`,
		);
		solution = `\\text{${who[0].toUpperCase()}${who.slice(1)} misurano } ${a}\\ \\text{cm e } ${b}\\ \\text{cm}`;
		steps.push(solution);
		correct = optSides(a, b);
	}
	// distractors: sides with integer lengths from the mistakes of the lesson
	const sides = (A1: number, B1: number): Opt | null => {
		const r = ratRoots(q(1), q(-A1), q(B1));
		return r && r.length === 2 && r.every((t) => t.isInteger() && t.sign() > 0 && t.num <= 99) ? optSides(r[0].num, r[1].num) : null;
	};
	const cands: (Opt | null)[] = [];
	if (story === 'area' || story === 'impossibile') {
		// the sum of the sides equal to the perimeter
		cands.push(sides(P, A));
	} else {
		// the 2 of 2xy forgotten, and the sum of the sides equal to the perimeter
		cands.push(sides(s, s * s - d * d));
		if (story === 'diagonale' && (P * P - d * d) % 2 === 0) cands.push(sides(P, (P * P - d * d) / 2));
	}
	if (story === 'impossibile') {
		// the square with that perimeter, the largest area; two sides with that area
		if (s % 2 === 0) cands.push(optSides(s / 2, s / 2));
		for (let k = Math.floor(Math.sqrt(A)); k >= 1 && cands.length < 6; k--) if (A % k === 0) cands.push(optSides(k, A / k));
	} else {
		// the same sum, a side one longer; then the figure that does not exist
		if (a > 1) cands.push(optSides(a - 1, b + 1));
		if (a + 1 < b - 1) cands.push(optSides(a + 1, b - 1));
		cands.push(optNone(fig));
		cands.push(optSides(a + 1, b + 1));
	}
	return {
		problem: textLines(lines),
		lin: L,
		quad: Q,
		quadFirst: false,
		kind: story,
		steps,
		solution,
		correct,
		cands,
		extra: { story, P: String(P), ...(A ? { A: String(A) } : {}), ...(d ? { d: String(d) } : {}) },
	};
}

// ---------------------------------------------------------------------------
// Sample

const PROMPTS: Record<number, string> = {
	1: 'Risolvi il sistema con il metodo di sostituzione.',
	2: 'Risolvi il sistema con il metodo di sostituzione.',
	3: 'Stabilisci se la retta è secante, tangente o esterna alla parabola e trova i punti comuni.',
	4: 'Risolvi il sistema simmetrico.',
	5: 'Risolvi il sistema simmetrico.',
	6: 'Risolvi il problema con un sistema di secondo grado.',
};

function build(rng: Rng, level: number, u: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng, u);
		case 4:
			return level4(rng, u);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng, u);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const linJSON = (l: Lin) => [l.a, l.b, l.c].map(String);
const quadJSON = (Q: Quad) => [Q.xx, Q.yy, Q.xy, Q.x, Q.y, Q.c].map(String);

function assemble(b: Built, level: number, rng: Rng): Sample | null {
	const opts = pickOptions(b.correct, b.cands);
	if (!opts) return null;
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: PROMPTS[level],
		problem: b.problem,
		solution: b.solution,
		steps: b.steps.filter((t, i, all) => i === 0 || t !== all[i - 1]),
		answer: shuffle(rng, opts),
		params: {
			lin: linJSON(b.lin),
			quad: quadJSON(b.quad),
			quadFirst: b.quadFirst,
			kind: b.kind,
			...(b.extra ?? {}),
		},
	};
}

// ---------------------------------------------------------------------------
// Check

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito', re: /(?<![\d.])1\s*[xy]/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xy]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

function parseParams(p: Record<string, unknown>): { l: Lin; Q: Quad } | null {
	try {
		const l = (p.lin as string[]).map((t) => Rational.parse(t));
		const Qv = (p.quad as string[]).map((t) => Rational.parse(t));
		if (l.length !== 3 || Qv.length !== 6) return null;
		return { l: lin(l[0], l[1], l[2]), Q: { xx: Qv[0], yy: Qv[1], xy: Qv[2], x: Qv[3], y: Qv[4], c: Qv[5] } };
	} catch {
		return null;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const pp = parseParams(sample.params);
	if (!pp) return ['params non validi'];
	const { l, Q } = pp;
	if (sample.level !== 6) for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const a = sample.answer;
	if (a.kind !== 'choice') return [...v, 'la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map(optKey)).size !== a.options.length) v.push('opzioni ripetute');
	const pairs = solveSystem(l, Q);
	if (!pairs) return [...v, 'soluzioni non razionali'];
	if (!unitVar(l)) v.push("l'equazione di primo grado non ha un coefficiente ±1");
	const lvl = sample.level;
	const kind = sample.params.kind;
	let truth: Opt;
	switch (lvl) {
		case 1:
			if (!(Q.xy.isOne() && Q.xx.isZero() && Q.yy.isZero() && Q.x.isZero() && Q.y.isZero())) v.push('livello 1: la seconda equazione è xy = p');
			if (pairs.length !== 2) v.push('livello 1: servono due coppie');
			truth = optPairs(pairs);
			break;
		case 2:
			if (!Q.xy.isZero() || Q.xx.isZero() || Q.yy.isZero()) v.push('livello 2: la seconda equazione ha x^2 e y^2');
			if (pairs.length !== 2) v.push('livello 2: servono due coppie');
			truth = optPairs(pairs);
			break;
		case 3: {
			const pos: Pos = pairs.length === 2 ? 'secante' : pairs.length === 1 ? 'tangente' : 'esterna';
			if (kind !== pos) v.push(`livello 3: caso ${String(kind)} ma la retta è ${pos}`);
			if (Q.xx.isZero() || !Q.yy.isZero() || !Q.xy.isZero() || !Q.y.isOne() || !l.b.isOne()) v.push('livello 3: una parabola y = ax^2 + bx + c e una retta y = mx + q');
			if (pairs.some((p) => hasFrac(p))) v.push('livello 3: punti a coordinate intere');
			truth = optLine(pos, pairs);
			break;
		}
		case 4: {
			const k = pairs.length === 2 ? 'due coppie' : pairs.length === 1 ? 'una coppia' : 'impossibile';
			if (kind !== k) v.push(`livello 4: caso ${String(kind)} ma il sistema ha ${k}`);
			if (!l.a.isOne() || !l.b.isOne() || !Q.xy.isOne() || !Q.xx.isZero() || !Q.yy.isZero()) v.push('livello 4: x + y = s, xy = p');
			truth = optPairs(pairs);
			break;
		}
		case 5:
			if (!l.a.isOne() || !l.b.isOne() || !Q.xx.isOne() || !Q.yy.isOne() || !Q.xy.isZero()) v.push('livello 5: x + y = s, x^2 + y^2 = k');
			if (pairs.length !== 2) v.push('livello 5: servono due coppie');
			truth = optPairs(pairs);
			break;
		case 6: {
			const pos = pairs.filter((p) => p[0].sign() > 0 && p[1].sign() > 0);
			const fig = kind === 'triangolo' ? 'triangolo' : 'rettangolo';
			if (kind === 'impossibile' ? pos.length !== 0 : pos.length !== 2 || hasFrac(pos[0])) v.push(`livello 6: caso ${String(kind)} non coerente`);
			truth = pos.length ? optSides(pos[0][0].num, pos[0][1].num) : optNone(fig);
			break;
		}
		default:
			return [...v, `livello sconosciuto ${lvl}`];
	}
	if (optKey(a.options[a.correct] ?? { values: ['?'] }) !== optKey(truth)) v.push("l'opzione giusta non è la soluzione");
	if (!sample.steps.length) v.push('nessun passaggio');
	return v;
}

const sistemiSecondoGrado: Generator = {
	id: ID,
	title: 'Sistemi di secondo grado',
	levels: {
		1: { label: 'Sostituzione con xy = p', constraints: ['x o y con coefficiente ±1', 'due coppie, anche con frazioni'] },
		2: { label: 'Sostituzione con i quadrati', constraints: ['ax^2 + by^2 = r', 'quadrato di un binomio', 'due coppie, anche con frazioni'] },
		3: { label: 'Retta e parabola', constraints: ['4 su 10 secante, 3 su 10 tangente, 3 su 10 esterna', 'punti a coordinate intere'] },
		4: { label: 'Sistemi simmetrici', constraints: ['x + y = s, xy = p', '6 su 10 due coppie, 2 su 10 una coppia, 2 su 10 impossibile'] },
		5: { label: 'Somma dei quadrati', constraints: ['x + y = s, x^2 + y^2 = k', 'due coppie intere'] },
		6: { label: 'Problemi', constraints: ['rettangolo con perimetro e area o diagonale, triangolo rettangolo con perimetro e ipotenusa', 'a volte il rettangolo non esiste'] },
	},
	generate(rng: Rng, level: number): Sample {
		const u = rng.next();
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = build(rng, level, u);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample): ChoiceAnswer {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: answer is always a choice`);
		return sample.answer;
	},
};

export default sistemiSecondoGrado;
