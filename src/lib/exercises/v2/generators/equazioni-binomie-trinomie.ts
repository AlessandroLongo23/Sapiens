/**
 * Equazioni binomie, trinomie e scomponibili. Spec: specs/exercises/equazioni-binomie-trinomie.md
 *
 * Seven levels in the order of lesson 90 (docs/lezioni/riscritte/90-equazioni-binomie-trinomie.md): a total
 * common factor, a partial grouping, Ruffini's rule, binomial equations x^n = k, biquadratic equations,
 * trinomial equations of degree six with t = x^3, and inequalities of degree three or four.
 *
 * Built backwards from the solutions (the factors, the values of t, the root k): the problem is written from
 * them and the steps follow the lesson's procedure. The equations answer with the set S of their real
 * solutions (`set`, with a multiple-choice form whose wrong options are the lesson's mistakes, chosen at
 * generation time and stored in `params.distractors`); the inequalities answer with a union of intervals and
 * are a multiple choice from the start, as in disequazioni-secondo-grado.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd } from '../surd';
import { polyToLatex, type Poly } from '../latex';
import { forbidden, shuffle } from '../monomi';

export const ID = 'equazioni-binomie-trinomie';

// ---------------------------------------------------------------------------
// Exact values: rationals, square roots (a + b√r)/d, and ±ⁿ√k with k square-free

interface Val {
	tex: string;
	/** SymPy-parsable: "2", "-1/2", "2*sqrt(2)", "(-1+sqrt(2))", "-5**(1/3)". */
	str: string;
	num: number;
}

const vq = (r: Rational): Val => ({ tex: r.toLatex(), str: r.toString(), num: r.num / r.den });
const vi = (n: number): Val => vq(q(n));
const vs = (s: Surd): Val => ({ tex: s.toLatex(), str: s.toString(), num: s.value() });

/** The integer m >= 0 with m^n = k, or null. */
function iroot(k: number, n: number): number | null {
	const m = Math.round(Math.pow(k, 1 / n));
	for (const c of [m - 1, m, m + 1]) if (c >= 0 && c ** n === k) return c;
	return null;
}

function squarefree(k: number): boolean {
	for (let p = 2; p * p <= k; p++) if (k % (p * p) === 0) return false;
	return true;
}

/**
 * The real solutions of x^n = K, ascending: two opposite ones, one, none or zero. Null when a solution would be
 * a radical this generator does not write (index at least 3 with a radicand that is not a square-free integer).
 */
function binomialSols(K: Rational, n: number): Val[] | null {
	if (K.isZero()) return [vi(0)];
	const neg = K.sign() < 0;
	if (n % 2 === 0 && neg) return [];
	const N = Math.abs(K.num);
	const D = K.den;
	let pos: Val;
	const m = iroot(N, n);
	const d = iroot(D, n);
	if (m !== null && d !== null) pos = vq(q(m, d));
	else if (n === 2) pos = vs(Surd.of(0, 1, N * D, D));
	else if (D === 1 && squarefree(N)) pos = { tex: `\\sqrt[${n}]{${N}}`, str: `${N}**(1/${n})`, num: Math.pow(N, 1 / n) };
	else return null;
	if (n % 2 === 0) return [negVal(pos), pos];
	return [neg ? negVal(pos) : pos];
}

/** The opposite of a value of the forms above (rational, k√r, ⁿ√k: never a sum). */
function negVal(v: Val): Val {
	if (v.str === '0') return v;
	const flip = (s: string) => (s.startsWith('-') ? s.slice(1) : `-${s}`);
	return { tex: flip(v.tex), str: flip(v.str), num: -v.num };
}

/** Distinct values, ascending. */
function uniq(vals: Val[]): Val[] {
	const seen = new Set<string>();
	const out: Val[] = [];
	for (const v of [...vals].sort((a, b) => a.num - b.num)) {
		if (seen.has(v.str)) continue;
		seen.add(v.str);
		out.push(v);
	}
	return out;
}

const setKey = (vals: Val[]) =>
	uniq(vals)
		.map((v) => v.str)
		.join('|');

/** S = \{-2, 0, 2\}, S = \left\{-1, \frac{1}{2}, 2\right\}, S = \emptyset: as the lesson writes them. */
function setTex(vals: Val[]): string {
	if (!vals.length) return 'S = \\emptyset';
	const body = vals.map((v) => v.tex).join(', ');
	return vals.every((v) => /^-?\d+$/.test(v.tex)) ? `S = \\{${body}\\}` : `S = \\left\\{${body}\\right\\}`;
}

// ---------------------------------------------------------------------------
// Polynomials with integer coefficients, by ascending degree

const P = (...cs: number[]): Poly => cs.map((c) => q(c));
const mulInt = (a: number[], b: number[]): number[] => {
	const out = Array.from({ length: a.length + b.length - 1 }, () => 0);
	a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
	return out;
};
const tex = (cs: number[], v = 'x') => polyToLatex(P(...cs), v);
/** (x - 2), (2x + 1): a factor in brackets. */
const factor = (cs: number[]) => `(${tex(cs)})`;
/** a x - r as coefficients. */
const lin = (a: number, r: number) => [-r, a];

function evalAt(cs: number[], x: Rational): Rational {
	let v = q(0);
	for (let i = cs.length - 1; i >= 0; i--) v = v.mul(x).add(q(cs[i]));
	return v;
}

const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};

/** "x = 0\text{, oppure } x = 2\text{, oppure } x = -2" for the factors equal to zero. */
const orList = (xs: string[]) => xs.map((s, i) => (i === 0 ? s : `\\text{, oppure } ${s}`)).join('');

/** "\Delta = 25 - 16 = 9": b², then -4ac with its sign. */
function deltaLine(a: number, b: number, c: number): string {
	const b2 = b * b;
	const m = -4 * a * c;
	const d = b2 + m;
	const body = b2 === 0 ? `${m}` : `${b2} ${m < 0 ? '-' : '+'} ${Math.abs(m)}`;
	return body === `${d}` ? `\\Delta = ${d}` : `\\Delta = ${body} = ${d}`;
}

// ---------------------------------------------------------------------------
// Inequalities (level 7): unions of intervals with integer ends

type Op = '<' | '>' | '<=' | '>=';
const OPS: Op[] = ['<', '>', '<=', '>='];
const OP_LATEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const large = (o: Op) => o === '<=' || o === '>=';
const positive = (o: Op) => o === '>' || o === '>=';

/** null is -∞ at the left and +∞ at the right; lo = hi, both closed, is a point. */
interface Iv {
	lo: number | null;
	hi: number | null;
	loC: boolean;
	hiC: boolean;
}

/** Maximal runs of selected regions and points, left to right: R0 P0 R1 P1 … Rn. */
function runs(zs: number[], sel: boolean[], inc: boolean[]): Iv[] {
	const n = zs.length;
	const on = (i: number) => (i % 2 === 0 ? sel[i / 2] : inc[(i - 1) / 2]);
	const out: Iv[] = [];
	let i = 0;
	while (i <= 2 * n) {
		if (!on(i)) {
			i++;
			continue;
		}
		let j = i;
		while (j + 1 <= 2 * n && on(j + 1)) j++;
		const lo = i % 2 === 0 ? (i === 0 ? null : zs[i / 2 - 1]) : zs[(i - 1) / 2];
		const hi = j % 2 === 0 ? (j === 2 * n ? null : zs[j / 2]) : zs[(j - 1) / 2];
		out.push({ lo, hi, loC: i % 2 === 1, hiC: j % 2 === 1 });
		i = j + 1;
	}
	return out;
}

/** Signs of the polynomial in the regions between its (integer, distinct) zeros, left to right. */
function regionSigns(cs: number[], zs: number[]): number[] {
	const tests = [q(zs[0] - 1), ...zs.slice(1).map((z, i) => q(zs[i] + z, 2)), q(zs[zs.length - 1] + 1)];
	return tests.map((t) => evalAt(cs, t).sign());
}

/** cs op 0, with zs the real zeros of cs (integers, ascending, every one where the sign changes or not). */
function solveIneq(cs: number[], zs: number[], op: Op): Iv[] {
	const want = positive(op) ? 1 : -1;
	return runs(
		zs,
		regionSigns(cs, zs).map((s) => s === want),
		zs.map(() => large(op)),
	);
}

const points = (zs: number[]): Iv[] => zs.map((z) => ({ lo: z, hi: z, loC: true, hiC: true }));
const endKey = (r: number | null, inf: string) => (r === null ? inf : `${r}`);
const ivValue = (iv: Iv) => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
const ivsKey = (ivs: Iv[]) => ivs.map(ivValue).join('|');
const isPoint = (iv: Iv) => iv.lo !== null && iv.lo === iv.hi;
const isAll = (ivs: Iv[]) => ivs.length === 1 && ivs[0].lo === null && ivs[0].hi === null;

function intervalLatex(iv: Iv): string {
	const lo = iv.lo === null ? '-\\infty' : `${iv.lo}`;
	const hi = iv.hi === null ? '+\\infty' : `${iv.hi}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** S = \,\mathopen{]}-2, 1\mathclose{[}\, \cup [2, +\infty\mathclose{[}; three intervals on two lines. */
function ivSetLatex(ivs: Iv[]): string {
	if (!ivs.length) return 'S = \\emptyset';
	if (isAll(ivs)) return 'S = \\mathbb{R}';
	if (ivs.every(isPoint)) return `S = \\{${ivs.map((iv) => iv.lo).join(', ')}\\}`;
	const parts = ivs.map((iv, i) => {
		const t = intervalLatex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}')) s += '\\,';
		return s;
	});
	if (parts.length >= 3) return `\\begin{gathered} S = ${parts.slice(0, -1).join(' \\cup ')} \\\\ \\cup ${parts[parts.length - 1]} \\end{gathered}`;
	return `S = ${parts.join(' \\cup ')}`;
}

function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (isPoint(iv)) return `x = ${iv.lo}`;
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo}`;
	return `${iv.lo} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi}`;
}

const OPPURE = ' \\ \\text{ oppure } \\ ';

// ---------------------------------------------------------------------------
// Builds

interface Cand {
	tag: string;
	vals: Val[];
}

interface IvCand {
	tag: string;
	ivs: Iv[];
}

interface Build {
	form: string;
	/** lhs = rhs, or lhs op rhs at level 7; integer coefficients by ascending degree. */
	lhs: number[];
	rhs: number[];
	steps: string[];
	/** Equations: the solutions, ascending, and the lesson's mistakes in order of preference. */
	truth?: Val[];
	cands?: Cand[];
	/** Inequalities. */
	op?: Op;
	ivTruth?: Iv[];
	ivCands?: IvCand[];
	extra?: Record<string, unknown>;
}

/** The same form drawn again until it gives a sample, so that rejections do not change the share of the forms. */
function retry(f: () => Build | null): Build | null {
	for (let i = 0; i < 2000; i++) {
		const b = f();
		if (b) return b;
	}
	return null;
}

const Z = [0];

// Level 1: total common factor ------------------------------------------------

function level1(rng: Rng): Build | null {
	const u = rng.next();
	if (u < 0.4) return retry(() => l1Squares(rng));
	if (u < 0.75) return retry(() => l1Trinomial(rng));
	return retry(() => l1Fourth(rng));
}

function l1Squares(rng: Rng): Build | null {
	const a = rng.pick([1, 1, 1, 2, 3]);
	const k = rng.int(2, 9);
	if (a * k * k > 100) return null;
	const moved = rng.next() < 1 / 3;
	const cs = [0, -a * k * k, 0, a];
	const g = a === 1 ? 'x' : `${a}x`;
	const steps: string[] = [];
	if (moved) steps.push(`\\text{Porta tutto a primo membro: } ${tex(cs)} = 0`);
	steps.push(`\\text{Raccogli } ${g}\\text{: } ${g}(x^2 - ${k * k}) = 0`);
	steps.push(`\\text{Scomponi la differenza di quadrati: } ${g}(x - ${k})(x + ${k}) = 0`);
	steps.push(`\\text{Il prodotto vale zero se } ${orList(['x = 0', `x = ${k}`, `x = ${-k}`])}\\text{.}`);
	return {
		form: 'differenza di quadrati',
		lhs: moved ? [0, 0, 0, a] : cs,
		rhs: moved ? [0, a * k * k] : Z,
		steps,
		truth: uniq([vi(-k), vi(0), vi(k)]),
		cands: [
			{ tag: 'dividi', vals: [vi(-k), vi(k)] },
			{ tag: 'radice', vals: [vi(0), vi(k * k)] },
			{ tag: 'positive', vals: [vi(0), vi(k)] },
		],
	};
}

function l1Trinomial(rng: Rng): Build | null {
	const r1 = intIn(rng, -8, 8, [0]);
	const r2 = intIn(rng, -8, 8, [0, r1]);
	if (r1 + r2 === 0 || Math.abs(r1 * r2) > 48) return null;
	const [s, p] = [r1 + r2, r1 * r2];
	const cs = [0, p, -s, 1];
	const [x1, x2] = r1 < r2 ? [r1, r2] : [r2, r1];
	return {
		form: 'trinomio',
		lhs: cs,
		rhs: Z,
		steps: [
			`\\text{Raccogli } x\\text{: } x(${tex([p, -s, 1])}) = 0`,
			`\\text{Due numeri con somma } ${s} \\text{ e prodotto } ${p} \\text{ sono } ${x1} \\text{ e } ${x2}\\text{: } x${factor(lin(1, x1))}${factor(lin(1, x2))} = 0`,
			`\\text{Il prodotto vale zero se } ${orList(['x = 0', `x = ${x1}`, `x = ${x2}`])}\\text{.}`,
		],
		truth: uniq([vi(0), vi(r1), vi(r2)]),
		cands: [
			{ tag: 'dividi', vals: [vi(r1), vi(r2)] },
			{ tag: 'segno', vals: [vi(0), vi(-r1), vi(-r2)] },
			{ tag: 'positive', vals: [vi(0), ...[r1, r2].filter((r) => r > 0).map(vi)] },
		],
	};
}

function l1Fourth(rng: Rng): Build | null {
	const k = rng.int(2, 7);
	const moved = rng.next() < 0.5;
	const cs = [0, 0, -k * k, 0, 1];
	const steps: string[] = [];
	if (moved) steps.push(`\\text{Porta tutto a primo membro: } ${tex(cs)} = 0`);
	steps.push(`\\text{Raccogli } x^2\\text{: } x^2(x^2 - ${k * k}) = 0`);
	steps.push(`\\text{Scomponi la differenza di quadrati: } x^2(x - ${k})(x + ${k}) = 0`);
	steps.push(`\\text{Il prodotto vale zero se } x^2 = 0\\text{, cioè } ${orList(['x = 0', `x = ${k}`, `x = ${-k}`])}\\text{.}`);
	return {
		form: 'x^2 raccolto',
		lhs: moved ? [0, 0, 0, 0, 1] : cs,
		rhs: moved ? [0, 0, k * k] : Z,
		steps,
		truth: uniq([vi(-k), vi(0), vi(k)]),
		cands: [
			{ tag: 'dividi', vals: [vi(-k), vi(k)] },
			{ tag: 'radice', vals: [vi(0), vi(k * k)] },
			{ tag: 'positive', vals: [vi(0), vi(k)] },
		],
	};
}

// Level 2: partial grouping ----------------------------------------------------

function level2(rng: Rng): Build | null {
	const diff = rng.next() < 0.65;
	return retry(() => l2(rng, diff));
}

function l2(rng: Rng, diff: boolean): Build | null {
	const a = rng.pick([1, 1, 1, 2, 3]);
	const r = intIn(rng, -6, 6, [0]);
	if (gcd(a, Math.abs(r)) !== 1) return null;
	const k = rng.int(1, diff ? 7 : 5);
	const K = diff ? k * k : -k * k; // the second factor is x^2 - K
	const z = q(r, a);
	if (diff && (z.equals(q(k)) || z.equals(q(-k)))) return null;
	// (a x - r)(x^2 - K) = a x^3 - r x^2 - aK x + rK
	if (Math.abs(r * K) > 60 || Math.abs(a * K) > 40) return null;
	const cs = [r * K, -a * K, -r, a];
	const L = factor(lin(a, r));
	const sq = tex([-K, 0, 1]);
	// with K = ±1 the second group is ±(ax - r) itself: nothing to write in front of the bracket
	const head = K === -1 ? `\\text{Raccogli } x^2 \\text{ dai primi due termini: }` : `\\text{Raccogli } x^2 \\text{ dai primi due termini e } ${-K} \\text{ dagli ultimi due: }`;
	const steps = [
		`${head} x^2${L} ${K > 0 ? '-' : '+'} ${Math.abs(K) === 1 ? '' : Math.abs(K)}${L} = 0`,
		`\\text{Raccogli il fattore comune } ${L}\\text{: } ${L}(${sq}) = 0`,
	];
	const zv = vq(z);
	if (diff) {
		steps.push(`\\text{Scomponi la differenza di quadrati: } ${L}(x - ${k})(x + ${k}) = 0`);
		steps.push(`\\text{Il prodotto vale zero se } ${orList([`x = ${z.toLatex()}`, `x = ${k}`, `x = ${-k}`])}\\text{.}`);
		return {
			form: 'differenza di quadrati',
			lhs: cs,
			rhs: Z,
			steps,
			truth: uniq([vi(-k), zv, vi(k)]),
			cands: [
				{ tag: 'dimentica', vals: [zv, vi(k)] },
				{ tag: 'segno', vals: [vi(-k), vq(z.neg()), vi(k)] },
				{ tag: 'radice', vals: [vi(-K), zv, vi(K)] },
				{ tag: 'solo quadrato', vals: [vi(-k), vi(k)] },
			],
		};
	}
	steps.push(`\\text{Il fattore } ${sq} \\text{ è sempre positivo e non si annulla mai.}`);
	steps.push(`\\text{Resta } ${tex(lin(a, r))} = 0\\text{, cioè } x = ${z.toLatex()}\\text{.}`);
	return {
		form: 'somma di quadrati',
		lhs: cs,
		rhs: Z,
		steps,
		truth: [zv],
		cands: [
			{ tag: 'differenza', vals: [vi(-k), zv, vi(k)] },
			{ tag: 'segno', vals: [vq(z.neg())] },
			{ tag: 'nessuna', vals: [] },
		],
	};
}

// Level 3: Ruffini's rule ---------------------------------------------------------

function divisors(n: number): number[] {
	const out: number[] = [];
	for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) out.push(d);
	return out;
}

/** Candidates in the lesson's order: integers by size, 1 before -1, then the fractions. */
function candidates(cs: number[]): Rational[] {
	const c0 = cs[0];
	const lead = cs[cs.length - 1];
	const out: Rational[] = [];
	for (const d of divisors(c0)) out.push(q(d), q(-d));
	const fr: Rational[] = [];
	for (const den of divisors(lead)) {
		if (den === 1) continue;
		for (const num of divisors(c0)) if (gcd(num, den) === 1) fr.push(q(num, den));
	}
	fr.sort((u, v) => u.compare(v));
	for (const f of fr) out.push(f, f.neg());
	return out;
}

function candidatesLine(cs: number[]): string {
	const list = candidates(cs)
		.filter((_, i) => i % 2 === 0)
		.map((c) => `\\pm ${c.toLatex()}`)
		.join(',\\ ');
	return `\\text{Candidati: } ${list}`;
}

function evalLine(cs: number[], a: Rational): string {
	const call = a.isInteger() ? `P(${a.num})` : `P\\left(${a.toLatex()}\\right)`;
	const v = evalAt(cs, a);
	if (a.isOne() || a.equals(q(-1))) {
		const terms: number[] = [];
		for (let d = cs.length - 1; d >= 0; d--) if (cs[d] !== 0) terms.push(d % 2 === 1 && a.sign() < 0 ? -cs[d] : cs[d]);
		const sum = terms.map((t, i) => (i === 0 ? `${t}` : t < 0 ? ` - ${-t}` : ` + ${t}`)).join('');
		return `${call} = ${sum} = ${v.toLatex()}`;
	}
	return `${call} = ${v.toLatex()}`;
}

/** Synthetic division by x - z (z integer): the table and the quotient. */
function ruffini(cs: number[], z: number): { table: string; quotient: number[] } {
	const n = cs.length - 1;
	const top = Array.from({ length: n + 1 }, (_, i) => cs[n - i]);
	const bottom = [top[0]];
	const products: number[] = [];
	for (let i = 1; i <= n; i++) {
		products.push(bottom[i - 1] * z);
		bottom.push(top[i] + products[i - 1]);
	}
	const table =
		`\\begin{array}{r|${'r'.repeat(n)}|r} & ${top.join(' & ')} \\\\ ` +
		`${z} & & ${products.join(' & ')} \\\\ \\hline ` +
		`& ${bottom.join(' & ')} \\end{array}`;
	return { table, quotient: bottom.slice(0, n).reverse() };
}

function level3(rng: Rng): Build | null {
	const two = rng.next() < 0.6;
	return retry(() => l3(rng, two));
}

function l3(rng: Rng, two: boolean): Build | null {
	const z = intIn(rng, -3, 3, [0]);
	let Q: number[];
	if (two) {
		const d = rng.pick([1, 1, 2, 3]);
		const n1 = intIn(rng, -5, 5, [0]);
		const n2 = intIn(rng, -5, 5, [0]);
		if (gcd(d, Math.abs(n2)) !== 1) return null;
		const roots = [q(z), q(n1), q(n2, d)];
		if (roots[0].equals(roots[1]) || roots[0].equals(roots[2]) || roots[1].equals(roots[2])) return null;
		Q = mulInt(lin(1, n1), lin(d, n2));
	} else {
		const a = rng.pick([1, 1, 2]);
		const b = intIn(rng, -4, 4, [0]);
		const c = rng.int(1, 9);
		if (b * b - 4 * a * c >= 0 || gcd(gcd(a, Math.abs(b)), c) !== 1) return null;
		Q = [c, b, a];
	}
	const cs = mulInt(lin(1, z), Q);
	if (cs.some((c) => Math.abs(c) > 30) || cs[0] === 0) return null;
	// no partial grouping: a3·a0 ≠ a2·a1
	if (cs[3] * cs[0] === cs[2] * cs[1]) return null;
	// the procedure of the lesson: the first candidate that is a zero
	const steps = [`\\text{Non ci sono raccoglimenti: cerca uno zero di } P(x) \\text{ con la regola di Ruffini.}`, candidatesLine(cs)];
	let z0: Rational | null = null;
	let tried = 0;
	for (const c of candidates(cs)) {
		tried++;
		steps.push(evalLine(cs, c));
		if (evalAt(cs, c).isZero()) {
			z0 = c;
			break;
		}
	}
	if (!z0 || !z0.isInteger() || tried > 6) return null;
	const zz = z0.num;
	const { table, quotient } = ruffini(cs, zz);
	steps.push(`\\text{Lo zero è } ${zz}\\text{: dividi per } ${tex(lin(1, zz))}\\text{.}`);
	steps.push(table);
	const [c, b, a] = quotient;
	const qt = tex(quotient);
	steps.push(`\\text{L'equazione diventa } ${factor(lin(1, zz))}(${qt}) = 0\\text{. Il primo fattore dà } x = ${zz}\\text{.}`);
	const D = b * b - 4 * a * c;
	let qRoots: Val[] = [];
	if (D < 0) {
		steps.push(`\\text{Il fattore } ${qt} \\text{ ha } ${deltaLine(a, b, c)} \\text{ e non si annulla mai.}`);
	} else if (b === 0) {
		const K = q(-c, a);
		qRoots = binomialSols(K, 2) ?? [];
		steps.push(`x^2 = ${K.toLatex()} \\ \\Rightarrow \\ x = \\pm ${qRoots[1].tex}`);
	} else {
		const s = Math.round(Math.sqrt(D));
		if (s * s !== D) return null;
		qRoots = uniq([vq(q(-b - s, 2 * a)), vq(q(-b + s, 2 * a))]);
		steps.push(deltaLine(a, b, c));
		steps.push(`x = \\frac{${-b} \\pm ${s}}{${2 * a}} \\ \\Rightarrow \\ x = ${qRoots[0].tex}, \\ x = ${qRoots[1].tex}`);
	}
	const zv = vi(zz);
	const truth = uniq([zv, ...qRoots]);
	if (truth.length !== (two ? 3 : 1)) return null;
	let cands: Cand[];
	if (two) {
		cands = [
			{ tag: 'segno', vals: [vi(-zz), ...qRoots] },
			{ tag: 'quoziente', vals: [zv] },
			{ tag: 'segno quoziente', vals: [zv, ...qRoots.map(negVal)] },
		];
	} else {
		const s = Surd.of(-b, -1, -D, 2 * a);
		const t = Surd.of(-b, 1, -D, 2 * a);
		cands = [
			{ tag: 'nessuna', vals: [] },
			{ tag: 'segno', vals: [vi(-zz)] },
			{ tag: 'delta assoluto', vals: [zv, vs(s), vs(t)] },
		];
	}
	return { form: two ? 'quoziente con due soluzioni' : 'quoziente senza soluzioni', lhs: cs, rhs: Z, steps, truth, cands, extra: { zero: `${zz}` } };
}

// Level 4: binomial equations -------------------------------------------------

const SQUAREFREE = [2, 3, 5, 6, 7, 10];

function level4(rng: Rng): Build | null {
	const u = rng.next();
	const form = u < 0.3 ? 'pari positivo' : u < 0.5 ? 'pari negativo' : u < 0.8 ? 'dispari' : 'irrazionale';
	return retry(() => l4(rng, form));
}

/** A positive root m/d of x^n = (m/d)^n with small powers. */
function perfect(rng: Rng, n: number): [number, number] | null {
	const m = n === 3 ? rng.int(1, 5) : n === 4 ? rng.int(1, 3) : rng.int(1, 2);
	const d = rng.pick(n === 3 ? [1, 1, 1, 2, 3] : n === 4 ? [1, 1, 1, 2, 3] : [1, 1, 2]);
	// x^n = 1 only with an odd exponent: with an even one the lesson's mistakes give the same sets
	if (gcd(m, d) !== 1 || (m === 1 && d === 1 && (n % 2 === 0 || rng.next() < 0.7))) return null;
	return [m, d];
}

function l4(rng: Rng, form: string): Build | null {
	let n: number;
	let K: Rational;
	let a: number;
	if (form === 'irrazionale' || (form === 'pari negativo' && rng.next() < 0.4)) {
		n = form === 'pari negativo' ? rng.pick([4, 6]) : rng.pick([3, 4, 5, 6]);
		const k = rng.pick(SQUAREFREE);
		const sign = form === 'pari negativo' ? -1 : n % 2 === 0 ? 1 : rng.pick([1, -1]);
		K = q(sign * k);
		a = rng.pick([1, 1, 2, 3]);
	} else {
		n = form === 'dispari' ? rng.pick([3, 3, 5]) : rng.pick([4, 4, 6]);
		const md = perfect(rng, n);
		if (!md) return null;
		const [m, d] = md;
		const sign = form === 'pari positivo' ? 1 : form === 'pari negativo' ? -1 : rng.next() < 0.6 ? -1 : 1;
		K = q(sign * m ** n, d ** n);
		a = d === 1 ? rng.pick([1, 1, 2, 3]) : 1;
	}
	// a·d^n x^n - a·m^n = 0, that is A x^n + B = 0 with x^n = K
	const A = a * K.den;
	const B = -a * K.num;
	if (Math.abs(B) > 250 || A > 81) return null;
	const truth = binomialSols(K, n);
	if (!truth) return null;
	const cs = Array.from({ length: n + 1 }, (_, i) => (i === 0 ? B : i === n ? A : 0));
	const xn = `x^${n}`;
	const steps: string[] = [];
	steps.push(A === 1 ? `${xn} = ${-B}` : `${A}${xn} = ${-B} \\ \\Rightarrow \\ ${xn} = ${K.toLatex()}`);
	const even = n % 2 === 0;
	const rad = (k: Rational) => `\\sqrt[${n}]{${k.toLatex()}}`;
	if (even && K.sign() < 0) {
		steps.push(`\\text{L'esponente } ${n} \\text{ è pari e il secondo membro è negativo: una potenza con esponente pari non è mai negativa.}`);
	} else if (even) {
		steps.push(`\\text{L'esponente } ${n} \\text{ è pari e il secondo membro è positivo: due soluzioni opposte.}`);
		const r = truth[1].tex;
		steps.push(r === rad(K) ? `x = \\pm ${r}` : `x = \\pm ${rad(K)} = \\pm ${r}`);
	} else {
		steps.push(`\\text{L'esponente } ${n} \\text{ è dispari: una soluzione, con il segno del secondo membro.}`);
		const r = truth[0].tex;
		steps.push(r === rad(K) ? `x = ${r}` : `x = ${rad(K)} = ${r}`);
	}
	const absK = K.abs();
	const cands: Cand[] = [];
	const add = (tag: string, vals: Val[] | null) => {
		if (vals) cands.push({ tag, vals });
	};
	const posRoot = binomialSols(absK, n);
	if (even && K.sign() > 0) {
		add('solo positiva', [truth[1]]);
		add('quadrata', binomialSols(K, 2));
		add('impossibile', []);
	} else if (even) {
		add('assoluto', posRoot);
		add('dispari', posRoot && [negVal(posRoot[1])]);
		add('positiva', posRoot && [posRoot[1]]);
	} else {
		if (K.sign() < 0) add('impossibile', []);
		add('pari', posRoot && [negVal(posRoot[0]), posRoot[0]]);
		add('segno', [negVal(truth[0])]);
		if (K.sign() > 0) add('impossibile', []);
	}
	return { form, lhs: cs, rhs: Z, steps, truth, cands, extra: { n } };
}

// Levels 5 and 6: trinomial equations with t = x^n --------------------------------

function trinomial(n: number, t1: number, t2: number, form: string): Build | null {
	const b = -(t1 + t2);
	const c = t1 * t2;
	const cs = Array.from({ length: 2 * n + 1 }, (_, i) => (i === 0 ? c : i === n ? b : i === 2 * n ? 1 : 0));
	const xn = `x^${n}`;
	const steps = [
		`\\text{Poni } t = ${xn}\\text{: } ${tex([c, b, 1], 't')} = 0`,
		`\\text{Due numeri con somma } ${t1 + t2} \\text{ e prodotto } ${c} \\text{ sono } ${t1} \\text{ e } ${t2}\\text{: } t_1 = ${t1}, \\ t_2 = ${t2}`,
	];
	const sols: Val[] = [];
	for (const t of [t1, t2]) {
		const s = binomialSols(q(t), n);
		if (!s) return null;
		sols.push(...s);
		const rad = n === 2 ? `\\sqrt{${t}}` : `\\sqrt[${n}]{${t}}`;
		if (!s.length) steps.push(`${xn} = ${t} \\ \\Rightarrow \\ \\text{nessuna soluzione}`);
		else if (s.length === 2) steps.push(s[1].tex === rad ? `${xn} = ${t} \\ \\Rightarrow \\ x = \\pm ${rad}` : `${xn} = ${t} \\ \\Rightarrow \\ x = \\pm ${rad} = \\pm ${s[1].tex}`);
		else steps.push(s[0].tex === rad ? `${xn} = ${t} \\ \\Rightarrow \\ x = ${rad}` : `${xn} = ${t} \\ \\Rightarrow \\ x = ${rad} = ${s[0].tex}`);
	}
	if (n === 2 && t1 < 0 && t2 < 0) steps.push(`\\text{Tutti e due i valori di } t \\text{ sono negativi e nessuno dà soluzioni.}`);
	const truth = uniq(sols);
	const ts = [vi(t1), vi(t2)];
	const cands: Cand[] = [];
	const add = (tag: string, vals: (Val[] | null)[]) => {
		if (vals.every((v) => v)) cands.push({ tag, vals: vals.flat() as Val[] });
	};
	if (n === 2) {
		add('valori di t', [ts]);
		add('assoluto', [binomialSols(q(Math.abs(t1)), 2), binomialSols(q(Math.abs(t2)), 2)]);
		add('solo positive', [binomialSols(q(Math.abs(t1)), 2)?.slice(1) ?? null, binomialSols(q(Math.abs(t2)), 2)?.slice(1) ?? null]);
		add('piu meno t', [[vi(-t1), vi(t1), vi(-t2), vi(t2)]]);
	} else {
		const pos = [t1, t2].filter((t) => t > 0);
		if (pos.length < 2) add('scarta negativo', pos.map((t) => binomialSols(q(t), 3)));
		add('valori di t', [ts]);
		add(
			'pari',
			pos.map((t) => {
				const r = binomialSols(q(t), 3);
				return r && [negVal(r[0]), r[0]];
			}),
		);
		add('come biquadratica', pos.map((t) => binomialSols(q(t), 2)));
		add('segno', [binomialSols(q(-t1), 3), binomialSols(q(-t2), 3)]);
	}
	return { form, lhs: cs, rhs: Z, steps, truth, cands, extra: { n, t: [`${t1}`, `${t2}`] } };
}

function level5(rng: Rng): Build | null {
	const u = rng.next();
	const form = u < 0.35 ? 'quattro soluzioni intere' : u < 0.5 ? 'soluzioni irrazionali' : u < 0.85 ? 't di segno opposto' : 't negativi';
	return retry(() => {
		let t1: number;
		let t2: number;
		if (form === 'quattro soluzioni intere') {
			t1 = rng.pick([1, 4, 9, 16, 25, 36]);
			t2 = rng.pick([1, 4, 9, 16, 25, 36]);
		} else if (form === 'soluzioni irrazionali') {
			t1 = rng.int(1, 12);
			t2 = rng.int(1, 12);
			if (iroot(t1, 2) !== null && iroot(t2, 2) !== null) return null;
		} else if (form === 't di segno opposto') {
			t1 = -rng.int(1, 9);
			t2 = rng.next() < 0.8 ? rng.pick([1, 4, 9, 16, 25]) : rng.pick([2, 3, 5, 6, 7]);
		} else {
			t1 = -rng.int(1, 9);
			t2 = -rng.int(1, 9);
		}
		if (t1 === t2 || t1 + t2 === 0 || Math.abs(t1 * t2) > 150 || Math.abs(t1 + t2) > 50) return null;
		return trinomial(2, Math.min(t1, t2), Math.max(t1, t2), form);
	});
}

function level6(rng: Rng): Build | null {
	const u = rng.next();
	const form = u < 0.5 ? 't di segno opposto' : u < 0.75 ? 't positivi' : 't negativi';
	// how many values of t are not cubes: none (60%), one (30%), two (10%)
	const v = rng.next();
	const irr = v < 0.6 ? 0 : v < 0.9 ? 1 : 2;
	return retry(() => {
		const pick = (sign: number, other: boolean) => sign * (other ? rng.pick([2, 3, 5, 6, 7, 10]) : rng.pick([1, 8, 27, 64]));
		const [s1, s2] = form === 't di segno opposto' ? [-1, 1] : form === 't positivi' ? [1, 1] : [-1, -1];
		const which = rng.int(0, 1);
		const t1 = pick(s1, irr === 2 || (irr === 1 && which === 0));
		const t2 = pick(s2, irr === 2 || (irr === 1 && which === 1));
		if (t1 === t2 || t1 + t2 === 0 || Math.abs(t1 * t2) > 200 || Math.abs(t1 + t2) > 40) return null;
		return trinomial(3, Math.min(t1, t2), Math.max(t1, t2), form);
	});
}

// Level 7: inequalities --------------------------------------------------------

function level7(rng: Rng): Build | null {
	const u = rng.next();
	const v = rng.next();
	return retry(() => l7(rng, u, v));
}

function l7(rng: Rng, u: number, v: number): Build | null {
	const op = rng.pick(OPS);
	const o = OP_LATEX[op];
	const steps: string[] = [];
	let cs: number[];
	let zs: number[];
	let form: string;
	const ivCands: IvCand[] = [];
	if (u < 0.6) {
		form = 'terzo grado';
		if (v < 0.6) {
			// (x - r)(x^2 - k^2), by partial grouping as in example 14
			const r = intIn(rng, -5, 5, [0]);
			const k = rng.int(1, 5);
			if (Math.abs(r) === k || Math.abs(r * k * k) > 60) return null;
			cs = [r * k * k, -k * k, -r, 1];
			const L = factor(lin(1, r));
			steps.push(`\\text{Scomponi con un raccoglimento parziale: } x^2${L} - ${k === 1 ? '' : k * k}${L} ${o} 0`);
			steps.push(`${L}(x^2 - ${k * k}) ${o} 0`);
			steps.push(`${L}(x - ${k})(x + ${k}) ${o} 0`);
			zs = [r, k, -k];
		} else {
			// x(x - r1)(x - r2): a total common factor and a trinomial
			const r1 = intIn(rng, -5, 5, [0]);
			const r2 = intIn(rng, -5, 5, [0, r1]);
			if (r1 + r2 === 0) return null;
			const [x1, x2] = r1 < r2 ? [r1, r2] : [r2, r1];
			cs = [0, x1 * x2, -(x1 + x2), 1];
			steps.push(`\\text{Raccogli } x \\text{ e scomponi il trinomio: } x${factor(lin(1, x1))}${factor(lin(1, x2))} ${o} 0`);
			zs = [0, x1, x2];
		}
	} else {
		form = 'biquadratica';
		const p = rng.int(1, 4);
		const qq = rng.int(2, 5);
		if (v < 2 / 3) {
			// (x^2 - p^2)(x^2 - q^2), as example 15
			if (p >= qq || p * p * qq * qq > 144) return null;
			const [t1, t2] = [p * p, qq * qq];
			cs = [t1 * t2, 0, -(t1 + t2), 0, 1];
			steps.push(`\\text{Con } t = x^2 \\text{ il trinomio } ${tex([t1 * t2, -(t1 + t2), 1], 't')} \\text{ ha gli zeri } ${t1} \\text{ e } ${t2}\\text{: } (x^2 - ${t1})(x^2 - ${t2}) ${o} 0`);
			steps.push(`\\text{Il fattore } x^2 - ${t1} \\text{ si annulla in } \\pm ${p}\\text{, il fattore } x^2 - ${t2} \\text{ in } \\pm ${qq}\\text{: tutti e due sono positivi fuori e negativi in mezzo.}`);
			zs = [-qq, -p, p, qq];
			ivCands.push({ tag: 't', ivs: solveIneq([t1 * t2, -(t1 + t2), 1], [t1, t2], op) });
		} else {
			// (x^2 + p^2)(x^2 - q^2): one factor always positive
			const [t1, t2] = [-p * p, qq * qq];
			if (t1 + t2 === 0 || p * p * qq * qq > 144) return null;
			cs = [t1 * t2, 0, -(t1 + t2), 0, 1];
			steps.push(`\\text{Con } t = x^2 \\text{ il trinomio } ${tex([t1 * t2, -(t1 + t2), 1], 't')} \\text{ ha gli zeri } ${t1} \\text{ e } ${t2}\\text{: } (x^2 + ${-t1})(x^2 - ${t2}) ${o} 0`);
			steps.push(`\\text{Il fattore } x^2 + ${-t1} \\text{ è sempre positivo: il segno è quello di } x^2 - ${t2}\\text{, che si annulla in } \\pm ${qq}\\text{.}`);
			zs = [-qq, qq];
			ivCands.push({ tag: 't', ivs: solveIneq([t1 * t2, -(t1 + t2), 1], [t1, t2], op) });
		}
	}
	zs = [...zs].sort((a, b) => a - b);
	const signs = regionSigns(cs, zs).map((s) => (s > 0 ? '+' : '-'));
	steps.push(`\\text{Il primo membro si annulla in } ${zs.join(',\\ ')}\\text{. Segno da sinistra a destra: } ${signs.join(',\\ ')}`);
	const where = positive(op) ? 'positivo' : 'negativo';
	steps.push(`\\text{Il verso è } ${o}\\text{: gli intervalli dove il prodotto è ${where}, ${large(op) ? 'zeri compresi' : 'zeri esclusi'}.}`);
	const truth = solveIneq(cs, zs, op);
	steps.push(truth.map(pieceLatex).join(OPPURE));
	ivCands.push(
		{ tag: 'scambiati', ivs: solveIneq(cs, zs, FLIP[op]) },
		{ tag: 'estremi', ivs: solveIneq(cs, zs, TOGGLE[op]) },
		{ tag: 'equazione', ivs: points(zs) },
		{ tag: 'scambiati ed estremi', ivs: solveIneq(cs, zs, TOGGLE[FLIP[op]]) },
	);
	return { form, lhs: cs, rhs: Z, steps, op, ivTruth: truth, ivCands };
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly

/** More wrong sets when the lesson's mistakes coincide: one solution dropped, 0 added, the empty set, small integers. */
function fallback(truth: Val[]): Cand[] {
	const out: Cand[] = [];
	if (truth.length > 1) truth.forEach((_, i) => out.push({ tag: 'altro', vals: truth.filter((_, j) => j !== i) }));
	if (!truth.some((v) => v.str === '0')) out.push({ tag: 'altro', vals: [...truth, vi(0)] });
	if (truth.length) out.push({ tag: 'altro', vals: [] });
	for (let i = 1; i <= 6; i++) out.push({ tag: 'altro', vals: [vi(-i), vi(i)] }, { tag: 'altro', vals: [vi(i)] });
	return out;
}

interface Distractor {
	tag: string;
	values: string[];
	latex: string;
}

function assembleEquation(b: Build, level: number, rng: Rng): Sample | null {
	const truth = b.truth!;
	const picked: Distractor[] = [];
	const seen = new Set([setKey(truth)]);
	for (const c of [...b.cands!, ...fallback(truth)]) {
		if (picked.length === 3) break;
		const vals = uniq(c.vals);
		const k = setKey(vals);
		if (seen.has(k)) continue;
		seen.add(k);
		picked.push({ tag: c.tag, values: vals.map((v) => v.str), latex: setTex(vals) });
	}
	if (picked.length < 3) return null;
	const sol = setTex(truth);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: "Risolvi l'equazione.",
		problem: `${tex(b.lhs)} = ${tex(b.rhs)}`,
		solution: sol,
		steps: [...b.steps, sol],
		answer: { kind: 'set', values: truth.map((v) => v.str), latex: sol },
		params: { form: b.form, lhs: b.lhs.map(String), rhs: b.rhs.map(String), distractors: picked, ...b.extra },
	};
}

function assembleInequality(b: Build, level: number, rng: Rng): Sample | null {
	const truth = b.ivTruth!;
	if (!truth.length || isAll(truth)) return null;
	const picked: IvCand[] = [{ tag: 'giusta', ivs: truth }];
	const seen = new Set([ivsKey(truth)]);
	for (const c of b.ivCands!) {
		if (picked.length === 4) break;
		if (!c.ivs.length || isAll(c.ivs) || seen.has(ivsKey(c.ivs))) continue;
		seen.add(ivsKey(c.ivs));
		picked.push(c);
	}
	if (picked.length < 4) return null;
	const order = shuffle(
		rng,
		picked.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: ivSetLatex(picked[i].ivs), values: picked[i].ivs.map(ivValue) }));
	const sol = ivSetLatex(truth);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Risolvi la disequazione.',
		problem: `${tex(b.lhs)} ${OP_LATEX[b.op!]} ${tex(b.rhs)}`,
		solution: sol,
		steps: b.steps,
		answer: { kind: 'choice', options, correct: order.indexOf(0) },
		params: { form: b.form, op: b.op, lhs: b.lhs.map(String), rhs: b.rhs.map(String), truth: truth.map(ivValue), optionTags: order.map((i) => picked[i].tag) },
	};
}

// ---------------------------------------------------------------------------
// Check

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { lhs: string[]; rhs: string[]; op?: Op; distractors?: Distractor[]; form: string };
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	const n = Math.max(p.lhs.length, p.rhs.length);
	const cs = Array.from({ length: n }, (_, i) => Number(p.lhs[i] ?? 0) - Number(p.rhs[i] ?? 0));
	while (cs.length && cs[cs.length - 1] === 0) cs.pop();
	const deg = cs.length - 1;
	if (deg < 3) errs.push('grado minore di 3');
	errs.push(...forbidden(s.problem));
	const nz = cs.map((c, i) => (c !== 0 ? i : -1)).filter((i) => i >= 0);
	const lvl = s.level;
	if (lvl === 1 && cs[0] !== 0) errs.push('livello 1: nessun termine noto');
	if ((lvl === 2 || lvl === 3) && (deg !== 3 || cs[0] === 0)) errs.push('livelli 2-3: terzo grado con termine noto');
	if (lvl === 2 && cs[3] * cs[0] !== cs[2] * cs[1]) errs.push('livello 2: raccoglimento parziale');
	if (lvl === 3 && cs[3] * cs[0] === cs[2] * cs[1]) errs.push('livello 3: niente raccoglimento parziale');
	if (lvl === 4 && (nz.length !== 2 || nz[0] !== 0)) errs.push('livello 4: binomia');
	if ((lvl === 5 || lvl === 6) && (nz.join() !== [0, lvl - 3, 2 * (lvl - 3)].join() || deg !== 2 * (lvl - 3))) errs.push('livelli 5-6: trinomia');
	if (lvl === 7) {
		const ans = s.answer;
		if (ans.kind !== 'choice' || ans.options.length !== 4) return [...errs, 'livello 7: quattro opzioni'];
		const keys = ans.options.map((o) => o.values.join('|'));
		if (new Set(keys).size !== 4) errs.push('opzioni uguali');
		const truth = (s.params as { truth: string[] }).truth.join('|');
		if (keys[ans.correct] !== truth) errs.push('opzione giusta sbagliata');
		return errs;
	}
	const ans = s.answer;
	if (ans.kind !== 'set') return [...errs, 'la risposta deve essere un insieme'];
	const nums = ans.values.map(approxOf);
	for (let i = 1; i < nums.length; i++) if (!(nums[i] > nums[i - 1] + 1e-9)) errs.push('soluzioni non in ordine crescente o ripetute');
	for (const v of nums) {
		const scale = cs.reduce((m, c, i) => m + Math.abs(c) * Math.abs(v) ** i, 0);
		const val = cs.reduce((m, c, i) => m + c * v ** i, 0);
		if (Math.abs(val) > 1e-9 * Math.max(1, scale)) errs.push(`${v} non è soluzione`);
	}
	// with an even exponent and a negative right-hand side, no solutions
	if (lvl === 4 && deg % 2 === 0 && -cs[0] / cs[deg] < 0 && ans.values.length) errs.push('binomia pari con secondo membro negativo: S vuoto');
	const ds = p.distractors ?? [];
	if (ds.length !== 3) errs.push('servono tre distrattori');
	const keys = new Set([ans.values.join('|'), ...ds.map((d) => d.values.join('|'))]);
	if (keys.size !== 4) errs.push('distrattori uguali tra loro o alla risposta');
	return errs;
}

/** Numeric value of a value string of this generator: "p/q", "k*sqrt(r)", "(a+b*sqrt(r))/d", "-k**(1/n)". */
function approxOf(s: string): number {
	const src = s.replace(/sqrt\((\d+)\)/g, (_, r) => `${Math.sqrt(Number(r))}`).replace(/(\d+)\*\*\(1\/(\d+)\)/g, (_, k, n) => `${Math.pow(Number(k), 1 / Number(n))}`);
	let i = 0;
	const peek = () => src[i];
	const expr = (): number => {
		let v = term();
		while (peek() === '+' || peek() === '-') v = src[i++] === '+' ? v + term() : v - term();
		return v;
	};
	const term = (): number => {
		let v = unary();
		while (peek() === '*' || peek() === '/') v = src[i++] === '*' ? v * unary() : v / unary();
		return v;
	};
	const unary = (): number => {
		if (peek() === '-') {
			i++;
			return -unary();
		}
		if (peek() === '(') {
			i++;
			const v = expr();
			i++;
			return v;
		}
		const m = /^\d+(\.\d+)?(e-?\d+)?/.exec(src.slice(i));
		if (!m) throw new Error(`approxOf: cannot read ${s}`);
		i += m[0].length;
		return Number(m[0]);
	};
	const v = expr();
	if (i !== src.length) throw new Error(`approxOf: cannot read ${s}`);
	return v;
}

const equazioniBinomieTrinomie: Generator = {
	id: ID,
	title: 'Equazioni binomie, trinomie e scomponibili',
	levels: {
		1: { label: 'Raccoglimento totale', constraints: ['x·(x^2 - k^2), x·(x - r1)(x - r2), x^2·(x^2 - k^2)'] },
		2: { label: 'Raccoglimento parziale', constraints: ['(ax - r)(x^2 ∓ k^2) sviluppato'] },
		3: { label: 'Regola di Ruffini', constraints: ['(x - z)·Q(x), Q con due soluzioni razionali o Δ < 0, senza raccoglimenti'] },
		4: { label: 'Equazioni binomie', constraints: ['a x^n + b = 0, n da 3 a 6'] },
		5: { label: 'Equazioni biquadratiche', constraints: ['x^4 + bx^2 + c = 0, t1 e t2 interi'] },
		6: { label: 'Trinomie di sesto grado', constraints: ['x^6 + bx^3 + c = 0, t1 e t2 interi'] },
		7: { label: 'Disequazioni scomponibili', constraints: ['terzo grado con tre zeri interi o biquadratica'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample = level === 7 ? assembleInequality(b, level, rng) : assembleEquation(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.answer.kind !== 'set') throw new Error(`${ID}: unexpected answer`);
		const ds = (sample.params as { distractors: Distractor[] }).distractors;
		const all: ChoiceOption[] = [{ latex: sample.answer.latex, values: sample.answer.values }, ...ds.map((d) => ({ latex: d.latex, values: d.values }))];
		const order = shuffle(
			rng,
			all.map((_, i) => i),
		);
		return { kind: 'choice', options: order.map((i) => all[i]), correct: order.indexOf(0) };
	},
};

export default equazioniBinomieTrinomie;
