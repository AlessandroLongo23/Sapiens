/**
 * Disequazioni di secondo grado. Spec: specs/exercises/disequazioni-secondo-grado.md
 *
 * Seven levels in the order of lesson 88 (docs/lezioni/riscritte/88-disequazioni-secondo-grado.md): a = 1 with
 * integer zeros, a > 1 with fractional zeros, a negative or terms on both sides, irrational zeros, Δ = 0,
 * Δ < 0, incomplete inequalities (pure and spurie).
 *
 * Built backwards from the zeros of the trinomial (or from its vertex, when Δ ≤ 0): the problem is written
 * from them, and the solution comes from the sign rule of the lesson (with a > 0, outside the zeros for > and
 * inside for <; with Δ = 0 and Δ < 0 the table). The answer is a union of intervals, which no answer type of
 * today holds: it is a multiple choice from the start, written either as inequalities joined by "oppure" or
 * as intervals with reversed brackets (\mathopen{]} and \mathclose{[}), as the lesson writes them. The wrong
 * options are the solutions of the mistakes named in the lesson's warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd, sqrtParts } from '../surd';
import { polyToLatex, type Poly } from '../latex';
import { forbidden, shuffle } from '../monomi';

export const ID = 'disequazioni-secondo-grado';

// ---------------------------------------------------------------------------
// Signs, trinomials, intervals

type Op = '<' | '>' | '<=' | '>=';
const OPS: Op[] = ['<', '>', '<=', '>='];
const OP_LATEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const large = (o: Op) => o === '<=' || o === '>=';
const positive = (o: Op) => o === '>' || o === '>=';

/** a x^2 + b x + c with integer coefficients. */
interface Tri {
	a: number;
	b: number;
	c: number;
}

const triPoly = (t: Tri): Poly => [q(t.c), q(t.b), q(t.a)];
const triLatex = (t: Tri) => polyToLatex(triPoly(t));
const negTri = (t: Tri): Tri => ({ a: -t.a, b: -t.b, c: -t.c });
const disc = (t: Tri) => t.b * t.b - 4 * t.a * t.c;
const vertex = (t: Tri) => q(-t.b, 2 * t.a);

/** Real zeros of a trinomial, ascending and distinct (one for Δ = 0). */
function zerosOf(t: Tri): Surd[] {
	const d = disc(t);
	if (d < 0) return [];
	if (d === 0) return [Surd.rational(vertex(t))];
	const zs = [Surd.of(-t.b, -1, d, 2 * t.a), Surd.of(-t.b, 1, d, 2 * t.a)];
	return zs.sort((u, v) => u.compare(v));
}

/** An interval as written; null is -∞ at the left and +∞ at the right. lo = hi, both closed, is a point. */
interface Iv {
	lo: Surd | null;
	hi: Surd | null;
	loC: boolean;
	hiC: boolean;
}

/**
 * Maximal runs of the selected regions and points of the line, left to right: regions R0 P0 R1 P1 … Rn,
 * with sel[j] for region j and inc[i] for the point zs[i].
 */
function runs(zs: Surd[], sel: boolean[], inc: boolean[]): Iv[] {
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

/**
 * Solutions of a trinomial with the sign of `sa` in front and the zeros zs (two distinct, one double, or none)
 * compared with zero: the sign rule of the lesson.
 */
function solveSign(sa: number, zs: Surd[], op: Op): Iv[] {
	const want = positive(op) ? 1 : -1;
	const signs = zs.length === 2 ? [sa, -sa, sa] : zs.length === 1 ? [sa, sa] : [sa];
	return runs(
		zs,
		signs.map((s) => s === want),
		zs.map(() => large(op)),
	);
}

const solveTri = (t: Tri, op: Op) => solveSign(Math.sign(t.a), zerosOf(t), op);
const points = (zs: Surd[]): Iv[] => zs.map((z) => ({ lo: z, hi: z, loC: true, hiC: true }));

/** Solutions of m x + n op 0, m ≠ 0: x op -n/m, with the sign turned when m < 0. */
function solveLinear(m: number, n: number, op: Op): Iv[] {
	const z = Surd.rational(q(-n, m));
	const o = m > 0 ? op : FLIP[op];
	return positive(o) ? [{ lo: z, hi: null, loC: large(o), hiC: false }] : [{ lo: null, hi: z, loC: false, hiC: large(o) }];
}

const endKey = (r: Surd | null, inf: string) => (r ? r.toString() : inf);
/** "(-oo,-3)", "[1,oo)", "[2,2]" for a point: the values of an option, one per interval. */
const ivValue = (iv: Iv) => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
const ivsKey = (ivs: Iv[]) => ivs.map(ivValue).join('|');

const isPoint = (iv: Iv) => !!iv.lo && !!iv.hi && iv.lo.equals(iv.hi);
const isAll = (ivs: Iv[]) => ivs.length === 1 && !ivs[0].lo && !ivs[0].hi;
/** ℝ without one point: ]-∞, r[ ∪ ]r, +∞[. */
const allBut = (ivs: Iv[]) => ivs.length === 2 && !ivs[0].lo && !ivs[1].hi && !!ivs[0].hi && !!ivs[1].lo && ivs[0].hi.equals(ivs[1].lo) && !ivs[0].hiC && !ivs[1].loC;
/** ∅, ℝ, ℝ minus a point, one point: the answers of the columns Δ = 0 and Δ < 0 of the table. */
const special = (ivs: Iv[]) => !ivs.length || isAll(ivs) || allBut(ivs) || (ivs.length === 1 && isPoint(ivs[0]));

// ---------------------------------------------------------------------------
// Writing the solutions

type Notation = 'disequazioni' | 'intervalli';

const irrational = (r: Surd | null) => !!r && !r.isRational();
const nonInteger = (r: Surd | null) => !!r && !(r.isRational() && r.toRational().isInteger());

/** One interval with the brackets of the lesson: ]-1, 4[ as \mathopen{]}-1, 4\mathclose{[}, \left] \right[ around fractions and radicals. */
function intervalLatex(iv: Iv): string {
	const lo = iv.lo ? iv.lo.toLatex() : '-\\infty';
	const hi = iv.hi ? iv.hi.toLatex() : '+\\infty';
	if (nonInteger(iv.lo) || nonInteger(iv.hi)) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** Two intervals with a fraction or a radical do not fit a phone line: one per line, as the lesson does. */
const wide = (ivs: Iv[]) => ivs.length === 2 && ivs.some((iv) => nonInteger(iv.lo) || nonInteger(iv.hi));
const wideDis = (ivs: Iv[]) => ivs.length === 2 && ivs.some((iv) => irrational(iv.lo) || irrational(iv.hi));

/** S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}, spaced as in the lesson. */
function setLatex(ivs: Iv[]): string {
	if (!ivs.length) return 'S = \\emptyset';
	if (isAll(ivs)) return 'S = \\mathbb{R}';
	if (allBut(ivs)) return `S = \\mathbb{R} \\setminus \\{${ivs[0].hi!.toLatex()}\\}`;
	if (ivs.every(isPoint)) return `S = \\{${ivs.map((iv) => iv.lo!.toLatex()).join(', ')}\\}`;
	const parts = ivs.map((iv, i) => {
		const t = intervalLatex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}') && !wide(ivs)) s += '\\,';
		return s;
	});
	if (wide(ivs)) return `\\begin{gathered} S = ${parts[0]} \\\\ \\cup ${parts[1]} \\end{gathered}`;
	return `S = ${parts.join(' \\cup ')}`;
}

/** x < -3, x \geq 1, -1 < x \leq 4, x = 2. */
function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (isPoint(iv)) return `x = ${iv.lo!.toLatex()}`;
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi!.toLatex()}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo.toLatex()}`;
	return `${iv.lo.toLatex()} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi.toLatex()}`;
}

const OPPURE = ' \\ \\text{ oppure } \\ ';
const disLatex = (ivs: Iv[]) => ivs.map(pieceLatex).join(OPPURE);

function disOption(ivs: Iv[]): string {
	if (wideDis(ivs)) return `\\begin{gathered} ${pieceLatex(ivs[0])} \\\\ \\text{oppure} \\ ${pieceLatex(ivs[1])} \\end{gathered}`;
	return disLatex(ivs);
}

/** Options of the special sets are always written as sets. */
const optionLatex = (ivs: Iv[], n: Notation) => (n === 'intervalli' || special(ivs) ? setLatex(ivs) : disOption(ivs));

/** The last step: the solution in words or inequalities. */
function lastStep(ivs: Iv[]): string {
	if (!ivs.length) return '\\text{Nessun } x \\text{ è soluzione.}';
	if (isAll(ivs)) return '\\text{Ogni } x \\text{ è soluzione.}';
	if (allBut(ivs)) return `x \\neq ${ivs[0].hi!.toLatex()}`;
	return disLatex(ivs);
}

// ---------------------------------------------------------------------------
// Steps

const num = (n: number) => `${n}`;
/** "1 + 24", "9 - 8": b² and then -4ac with its sign. */
function deltaLine(t: Tri): string {
	const b2 = t.b * t.b;
	const m = -4 * t.a * t.c;
	const body = b2 === 0 ? `${m}` : m === 0 ? `${b2}` : `${b2} ${m < 0 ? '-' : '+'} ${Math.abs(m)}`;
	const d = disc(t);
	return body === `${d}` ? `\\Delta = ${d}` : `\\Delta = ${body} = ${d}`;
}

/** 2,24 → "2{,}24", with the decimal comma of the lesson. */
function approx(z: Surd): string {
	const s = z.value().toFixed(2).replace('-0.00', '0.00');
	return s.replace('.', '{,}');
}

/** How the zeros of the (positive) trinomial are found: Δ, the formula, x1 and x2. */
function zeroSteps(t: Tri): string[] {
	const d = disc(t);
	const out = [deltaLine(t)];
	if (d < 0) {
		out.push(`\\text{Il discriminante è negativo: l'equazione associata non ha soluzioni e la parabola non incontra l'asse } x\\text{.}`);
		return out;
	}
	if (d === 0) {
		out.push(`x_1 = x_2 = -\\frac{b}{2a} = ${vertex(t).toLatex()}`);
		return out;
	}
	const zs = zerosOf(t);
	const { k, r } = sqrtParts(d);
	const den = 2 * t.a;
	if (r === 1) {
		out.push(`x_{1,2} = \\frac{${num(-t.b)} \\pm ${k}}{${den}}`);
		out.push(`x_1 = ${zs[0].toLatex()}, \\quad x_2 = ${zs[1].toLatex()}`);
		return out;
	}
	const root = `${k === 1 ? '' : k}\\sqrt{${r}}`;
	if (k > 1) out.push(`\\sqrt{${d}} = ${root}`);
	const first = `x_{1,2} = \\frac{${num(-t.b)} \\pm ${root}}{${den}}`;
	// the simplified form: (A ± K√r)/D
	const g = gcd(gcd(t.b, k), den);
	if (g > 1) {
		const A = -t.b / g;
		const K = k / g;
		const D = den / g;
		const rt = `${K === 1 ? '' : K}\\sqrt{${r}}`;
		const body = `${A} \\pm ${rt}`;
		out.push(`${first} = ${D === 1 ? body : `\\frac{${body}}{${D}}`}`);
	} else out.push(first);
	out.push(`x_1 = ${zs[0].toLatex()} \\approx ${approx(zs[0])}, \\quad x_2 = ${zs[1].toLatex()} \\approx ${approx(zs[1])}`);
	return out;
}

/** The choice of the lesson for a > 0 and two distinct zeros. */
function pickLine(op: Op): string {
	const where = positive(op) ? 'valori esterni' : 'valori interni';
	const ends = large(op) ? 'estremi compresi' : 'estremi esclusi';
	return `\\text{Il verso è } ${OP_LATEX[op]}\\text{: ${where}, ${ends}.}`;
}

/** Δ = 0 with a > 0: the four rows of the table (example 5). */
function doubleLine(op: Op, r: Rational): string {
	const z = r.toLatex();
	switch (op) {
		case '>':
			return `\\text{Il trinomio è positivo per ogni } x \\text{ tranne } ${z}\\text{, dove vale zero: il verso è } >\\text{.}`;
		case '>=':
			return `\\text{Il trinomio non è mai negativo: il verso è } \\geq\\text{ e va bene ogni } x\\text{.}`;
		case '<':
			return `\\text{Il trinomio non è mai negativo: il verso è } <\\text{ e nessun } x \\text{ va bene.}`;
		case '<=':
			return `\\text{Il trinomio non è mai negativo e vale zero solo per } x = ${z}\\text{: il verso è } \\leq\\text{.}`;
	}
}

/** Δ < 0 with a > 0 (example 6). */
function noZeroLine(op: Op): string {
	const head = `\\text{La parabola sta tutta sopra l'asse } x\\text{: il trinomio è positivo per ogni } x\\text{. Il verso è } ${OP_LATEX[op]}`;
	return positive(op) ? `${head}\\text{: la disequazione è sempre verificata.}` : `${head}\\text{: la disequazione è impossibile.}`;
}

/** From the problem to a x^2 + b x + c op 0 with a > 0. */
function leadSteps(written: Tri, op: Op, moved: boolean): { t: Tri; op: Op; steps: string[] } {
	const steps: string[] = [];
	if (moved) steps.push(`\\text{Porta tutto a primo membro: } ${triLatex(written)} ${OP_LATEX[op]} 0`);
	if (written.a < 0) {
		const t = negTri(written);
		steps.push(`\\text{Il coefficiente di } x^2 \\text{ è negativo: moltiplica per } -1 \\text{ e cambia il verso: } ${triLatex(t)} ${OP_LATEX[FLIP[op]]} 0`);
		return { t, op: FLIP[op], steps };
	}
	return { t: written, op, steps };
}

// ---------------------------------------------------------------------------
// Levels

interface Cand {
	tag: string;
	ivs: Iv[];
}

interface Build {
	form: string;
	/** The problem: lhs op rhs. */
	lhs: Tri;
	rhs: Tri;
	op: Op;
	steps: string[];
	/** Wrong answers from the lesson's warnings, in order of preference; `quartet` for the four answers of the table. */
	cands: Cand[];
	quartet?: Rational;
	extra: Record<string, unknown>;
}

const ZERO_TRI: Tri = { a: 0, b: 0, c: 0 };
const sub = (u: Tri, v: Tri): Tri => ({ a: u.a - v.a, b: u.b - v.b, c: u.c - v.c });
const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};
/** k (x - r1)(x - r2) expanded. */
const fromRoots = (k: number, r1: number, r2: number): Tri => ({ a: k, b: -k * (r1 + r2), c: k * r1 * r2 });

/** The mistakes every level with two distinct zeros can make. */
function commonCands(t: Tri, op: Op): Cand[] {
	return [
		{ tag: 'scambiati', ivs: solveTri(t, FLIP[op]) },
		{ tag: 'estremi', ivs: solveTri(t, TOGGLE[op]) },
		{ tag: 'equazione', ivs: points(zerosOf(t)) },
		{ tag: 'scambiati ed estremi', ivs: solveTri(t, TOGGLE[FLIP[op]]) },
	];
}

/** Steps for a trinomial with a > 0 compared with zero, from Δ to the choice. */
function solveSteps(t: Tri, op: Op): string[] {
	const out = zeroSteps(t);
	const d = disc(t);
	if (d > 0) out.push(pickLine(op));
	else if (d === 0) out.push(doubleLine(op, vertex(t)));
	else out.push(noZeroLine(op));
	return out;
}

function level1(rng: Rng): Build | null {
	const r1 = rng.int(-9, 9);
	const r2 = intIn(rng, -9, 9, [r1]);
	if (r1 + r2 === 0 || r1 * r2 === 0) return null;
	const t = fromRoots(1, r1, r2);
	if (Math.abs(t.c) > 40) return null;
	const op = rng.pick(OPS);
	return {
		form: 'a = 1',
		lhs: t,
		rhs: ZERO_TRI,
		op,
		steps: [`\\text{Il coefficiente } a = 1 \\text{ è positivo. Risolvi l'equazione associata:}`, ...solveSteps(t, op)],
		cands: commonCands(t, op),
		extra: {},
	};
}

function level2(rng: Rng): Build | null {
	// zeros n1/d1 and n2/d2, at least one fractional: (d1 x - n1)(d2 x - n2)
	const d1 = rng.pick([1, 2, 3]);
	const d2 = rng.pick([2, 3]);
	const n1 = rng.int(-7, 7);
	const n2 = rng.int(-7, 7);
	if (gcd(d1, Math.abs(n1)) !== 1 || gcd(d2, Math.abs(n2)) !== 1) return null;
	const z1 = q(n1, d1);
	const z2 = q(n2, d2);
	if (z1.equals(z2)) return null;
	const t: Tri = { a: d1 * d2, b: -(d1 * n2 + d2 * n1), c: n1 * n2 };
	if (t.b === 0 || t.c === 0 || Math.abs(t.b) > 20 || Math.abs(t.c) > 20 || disc(t) > 400) return null;
	const op = rng.pick(OPS);
	const zs = zerosOf(t);
	// the formula with 2 at the denominator in place of 2a: the zeros come out a times too big
	const wrong = zs.map((z) => Surd.rational(z.toRational().mul(q(t.a)))).sort((u, v) => u.compare(v));
	return {
		form: 'a > 1',
		lhs: t,
		rhs: ZERO_TRI,
		op,
		steps: [`\\text{Il coefficiente } a = ${t.a} \\text{ è positivo. Risolvi l'equazione associata, con il denominatore } 2a = ${2 * t.a}\\text{:}`, ...solveSteps(t, op)],
		cands: [{ tag: 'denominatore', ivs: solveSign(1, wrong, op) }, ...commonCands(t, op)],
		extra: {},
	};
}

/** The same form drawn again until it gives a sample, so that rejections do not change the share of the forms. */
function retry(f: () => Build | null): Build | null {
	for (let i = 0; i < 1000; i++) {
		const b = f();
		if (b) return b;
	}
	return null;
}

function level3(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => level3Form(rng, u));
}

function level3Form(rng: Rng, u: number): Build | null {
	const r1 = rng.int(-6, 6);
	const r2 = intIn(rng, -6, 6, [r1]);
	const op = rng.pick(OPS);
	if (u < 0.35) {
		// -k(x - r1)(x - r2) op 0, as -x^2 + 4x - 3 >= 0
		if (r1 + r2 === 0 || r1 * r2 === 0) return null;
		const w = fromRoots(-1, r1, r2);
		const lead = leadSteps(w, op, false);
		return {
			form: 'a negativo',
			lhs: w,
			rhs: ZERO_TRI,
			op,
			steps: [...lead.steps, ...solveSteps(lead.t, lead.op)],
			cands: [{ tag: 'verso', ivs: solveTri(lead.t, op) }, ...commonCands(lead.t, lead.op)],
			extra: {},
		};
	}
	// terms on both sides: L op R with L - R = ±(x - r1)(x - r2), and L with integer zeros too
	const sgn = u < 0.7 ? 1 : -1;
	const s1 = rng.int(-6, 6);
	const s2 = intIn(rng, -6, 6, [s1]);
	const P = fromRoots(sgn, r1, r2);
	const L = fromRoots(sgn, s1, s2);
	const R = sub(L, P);
	if (R.b === 0 && R.c === 0) return null;
	if (L.b === 0 && L.c === 0) return null;
	if (Math.abs(R.b) > 9 || Math.abs(R.c) > 20 || Math.abs(L.c) > 36) return null;
	if (P.b === 0 || P.c === 0) return null;
	const lead = leadSteps(P, op, true);
	const cands: Cand[] = [{ tag: 'senza zero', ivs: solveTri(L, op) }];
	if (sgn < 0) cands.push({ tag: 'verso', ivs: solveTri(lead.t, op) });
	return {
		form: sgn > 0 ? 'due membri' : 'due membri, a negativo',
		lhs: L,
		rhs: R,
		op,
		steps: [...lead.steps, ...solveSteps(lead.t, lead.op)],
		cands: [...cands, ...commonCands(lead.t, lead.op)],
		extra: {},
	};
}

function level4(rng: Rng): Build | null {
	// x^2 + bx + c with Δ > 0 not a square; b even three times out of four
	const even = rng.next() < 0.75;
	return retry(() => level4Form(rng, even));
}

function level4Form(rng: Rng, even: boolean): Build | null {
	const b = even ? 2 * intIn(rng, -3, 3, [0]) : rng.pick([-3, -1, 1, 3]);
	const c = intIn(rng, -9, 9, [0]);
	const t: Tri = { a: 1, b, c };
	const d = disc(t);
	if (d <= 0 || sqrtParts(d).r === 1) return null;
	const op = rng.pick(OPS);
	const zs = zerosOf(t);
	const truth = solveTri(t, op);
	// the zeros in the wrong order: the intervals written with x2 in place of x1
	const swapped = truth.map((iv) => ({ ...iv, lo: iv.lo && (iv.lo.equals(zs[0]) ? zs[1] : zs[0]), hi: iv.hi && (iv.hi.equals(zs[0]) ? zs[1] : zs[0]) }));
	return {
		form: even ? 'b pari' : 'b dispari',
		lhs: t,
		rhs: ZERO_TRI,
		op,
		steps: solveSteps(t, op),
		cands: [{ tag: 'ordine', ivs: swapped }, ...commonCands(t, op)],
		extra: {},
	};
}

function level5(rng: Rng): Build | null {
	// ±k (m x - n)^2, zero n/m
	const m = rng.pick([1, 1, 1, 2, 3]);
	const n = m === 1 ? intIn(rng, -9, 9, [0]) : intIn(rng, -5, 5, [0]);
	if (gcd(m, Math.abs(n)) !== 1) return null;
	const k = m === 1 ? rng.pick([1, 1, 1, 2]) : 1;
	const sgn = rng.pick([1, -1]);
	const w: Tri = { a: sgn * k * m * m, b: -2 * sgn * k * m * n, c: sgn * k * n * n };
	if (Math.abs(w.c) > 50 || Math.abs(w.b) > 36) return null;
	const op = rng.pick(OPS);
	const lead = leadSteps(w, op, false);
	const r = q(n, m);
	const steps = [...lead.steps, ...zeroSteps(lead.t)];
	const sq = `${m === 1 ? 'x' : `${m}x`} ${n < 0 ? '+' : '-'} ${Math.abs(n)}`;
	steps.push(`${triLatex(lead.t)} = ${k === 1 ? '' : k}(${sq})^2`);
	steps.push(doubleLine(lead.op, r));
	return { form: sgn > 0 ? 'a positivo' : 'a negativo', lhs: w, rhs: ZERO_TRI, op, steps, cands: [], quartet: r, extra: {} };
}

function level6(rng: Rng): Build | null {
	const a = rng.pick([1, 1, 2, 3, -1, -1, -2, -3]);
	const b = intIn(rng, -6, 6, [0]);
	const c = intIn(rng, -9, 9, [0]);
	if (gcd(gcd(a, b), c) !== 1) return null;
	const w: Tri = { a, b, c };
	if (disc(w) >= 0) return null;
	const op = rng.pick(OPS);
	const lead = leadSteps(w, op, false);
	return { form: a > 0 ? 'a positivo' : 'a negativo', lhs: w, rhs: ZERO_TRI, op, steps: [...lead.steps, ...solveSteps(lead.t, lead.op)], cands: [], quartet: vertex(w), extra: {} };
}

function level7(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => level7Form(rng, u));
}

function level7Form(rng: Rng, u: number): Build | null {
	const op = rng.pick(OPS);
	const o = OP_LATEX[op];
	if (u < 0.4) {
		// pure: x^2 op k^2, x^2 - k^2 op 0, or a x^2 op a k^2
		const k = rng.int(1, 9);
		const v = rng.next();
		const a = v < 0.8 ? 1 : rng.pick([2, 3]);
		const moved = v >= 0.6 && v < 0.8;
		const lhs: Tri = moved ? { a: 1, b: 0, c: -k * k } : { a, b: 0, c: 0 };
		const rhs: Tri = moved ? ZERO_TRI : { a: 0, b: 0, c: a * k * k };
		if (Math.abs(rhs.c) > 60) return null;
		const t: Tri = { a: 1, b: 0, c: -k * k };
		const steps: string[] = [];
		if (!moved) steps.push(`\\text{Porta tutto a primo membro: } ${triLatex(sub(lhs, rhs))} ${o} 0`);
		if (a > 1) steps.push(`\\text{Dividi per } ${a}\\text{, che è positivo e non cambia il verso: } ${triLatex(t)} ${o} 0`);
		steps.push(`\\text{L'equazione associata } x^2 = ${k * k} \\text{ ha le soluzioni } -${k} \\text{ e } ${k}\\text{.}`);
		steps.push(pickLine(op));
		return {
			form: 'pura',
			lhs,
			rhs,
			op,
			steps,
			cands: [{ tag: 'radice', ivs: solveLinear(1, -k, op) }, ...commonCands(t, op)],
			extra: { k },
		};
	}
	if (u < 0.6) {
		// x^2 + k op 0, x^2 op -k, -x^2 - k op 0: always positive or always negative
		const k = rng.int(1, 9);
		const v = rng.next();
		let lhs: Tri;
		let rhs = ZERO_TRI;
		if (v < 0.5) lhs = { a: 1, b: 0, c: k };
		else if (v < 0.75) {
			lhs = { a: 1, b: 0, c: 0 };
			rhs = { a: 0, b: 0, c: -k };
		} else lhs = { a: -1, b: 0, c: -k };
		const moved = rhs.c !== 0;
		const lead = leadSteps(sub(lhs, rhs), op, moved);
		const steps = [...lead.steps, `${triLatex(lead.t)} \\text{ è sempre positivo, perché } x^2 \\geq 0 \\text{: non vale mai zero.}`];
		steps.push(positive(lead.op) ? `\\text{Il verso è } ${OP_LATEX[lead.op]}\\text{: la disequazione è sempre verificata.}` : `\\text{Il verso è } ${OP_LATEX[lead.op]}\\text{: la disequazione è impossibile.}`);
		return { form: 'pura sempre o mai', lhs, rhs, op, steps, cands: [], quartet: q(0), extra: { k } };
	}
	// spuria: x^2 op kx, or a x^2 + b x op 0
	const v = rng.next();
	let lhs: Tri;
	let rhs = ZERO_TRI;
	if (v < 0.5) {
		const k = intIn(rng, -9, 9, [0]);
		lhs = { a: 1, b: 0, c: 0 };
		rhs = { a: 0, b: k, c: 0 };
	} else {
		const a = rng.pick([1, 2, 3, -1, -2]);
		const b = intIn(rng, -9, 9, [0]);
		if (gcd(a, b) !== 1 && Math.abs(a) !== 1) return null;
		lhs = { a, b, c: 0 };
	}
	const P = sub(lhs, rhs);
	const moved = rhs.b !== 0;
	const steps: string[] = [];
	if (moved) steps.push(`\\text{Porta tutto a primo membro: } ${triLatex(P)} ${o} 0`);
	const lead = leadSteps(P, op, false);
	steps.push(...lead.steps);
	const t = lead.t;
	const zs = zerosOf(t);
	const other = zs.find((z) => !z.isZero())!;
	const inner = polyToLatex([q(t.b), q(t.a)]);
	steps.push(`\\text{Raccogli } x \\text{: } x(${inner}) = 0 \\text{ dà } x = 0 \\text{ e } x = ${other.toLatex()}\\text{.}`);
	steps.push(pickLine(lead.op));
	return {
		form: 'spuria',
		lhs,
		rhs,
		op,
		steps,
		// dividing P op 0 by x as if it were positive: a x + b op 0
		cands: [{ tag: 'dividi', ivs: solveLinear(P.a, P.b, op) }, ...commonCands(t, lead.op)],
		extra: {},
	};
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly

/** The four answers of the columns Δ = 0 and Δ < 0: ℝ minus a point, ℝ, ∅, the point. */
function quartet(r: Rational): Cand[] {
	const z = Surd.rational(r);
	return [
		{ tag: 'tabella:>', ivs: solveSign(1, [z], '>') },
		{ tag: 'tabella:>=', ivs: [{ lo: null, hi: null, loC: false, hiC: false }] },
		{ tag: 'tabella:<', ivs: [] },
		{ tag: 'tabella:<=', ivs: points([z]) },
	];
}

/** A distractor must read as an answer: not empty, not all of ℝ (the swapped zeros are written as intervals). */
const usable = (c: Cand) => c.tag === 'ordine' || (c.ivs.length > 0 && !isAll(c.ivs));

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const P = sub(b.lhs, b.rhs);
	const truth = solveTri(P, b.op);
	const notation: Notation = b.quartet ? 'intervalli' : rng.next() < 0.5 ? 'disequazioni' : 'intervalli';

	let picked: Cand[];
	if (b.quartet) {
		picked = quartet(b.quartet);
		const i = picked.findIndex((c) => ivsKey(c.ivs) === ivsKey(truth));
		if (i < 0) return null;
		picked = [{ tag: 'giusta', ivs: truth }, ...picked.filter((_, j) => j !== i)];
	} else {
		if (!truth.length || isAll(truth)) return null;
		picked = [{ tag: 'giusta', ivs: truth }];
		const seen = new Set([ivsKey(truth)]);
		for (const c of b.cands) {
			if (picked.length === 4) break;
			if (!usable(c) || seen.has(ivsKey(c.ivs))) continue;
			seen.add(ivsKey(c.ivs));
			picked.push(c);
		}
		if (picked.length < 4) return null;
	}
	const order = shuffle(
		rng,
		picked.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(picked[i].ivs, notation), values: picked[i].ivs.map(ivValue) }));
	const answer: ChoiceAnswer = { kind: 'choice', options, correct: order.indexOf(0) };

	const lhsL = triLatex(b.lhs);
	const rhsL = polyToLatex(triPoly(b.rhs));
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Risolvi la disequazione.',
		problem: `${lhsL} ${OP_LATEX[b.op]} ${rhsL}`,
		solution: setLatex(truth),
		steps: [...b.steps, lastStep(truth)],
		answer,
		params: {
			form: b.form,
			op: b.op,
			lhs: [b.lhs.c, b.lhs.b, b.lhs.a],
			rhs: [b.rhs.c, b.rhs.b, b.rhs.a],
			notation,
			truth: truth.map(ivValue),
			optionTags: order.map((i) => picked[i].tag),
			...b.extra,
		},
	};
}

// ---------------------------------------------------------------------------
// Check

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { op: Op; lhs: number[]; rhs: number[]; notation: Notation; optionTags: string[]; form: string };
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	const L: Tri = { a: p.lhs[2], b: p.lhs[1], c: p.lhs[0] };
	const R: Tri = { a: p.rhs[2], b: p.rhs[1], c: p.rhs[0] };
	const P = sub(L, R);
	if (P.a === 0) return ['non è di secondo grado'];
	const truth = solveTri(P, p.op);
	const ans = s.answer;
	if (ans.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== ivsKey(truth)) errs.push('opzione giusta sbagliata');
	const zs = zerosOf(P);
	// the ends: included only with ≥ and ≤
	for (const iv of truth) {
		for (const [e, c] of [
			[iv.lo, iv.loC],
			[iv.hi, iv.hiC],
		] as [Surd | null, boolean][]) {
			if (e && c !== large(p.op)) errs.push('estremo incluso o escluso contro il verso');
		}
	}
	const d = disc(P);
	const lvl = s.level;
	if (lvl <= 4 && d <= 0) errs.push('livelli 1-4: servono due zeri distinti');
	if (lvl <= 3 && zs.some((z) => !z.isRational())) errs.push('livelli 1-3: zeri razionali');
	if (lvl === 1 && (P.a !== 1 || zs.some((z) => !z.toRational().isInteger()))) errs.push('livello 1: a = 1 e zeri interi');
	if (lvl === 2 && (P.a < 2 || zs.every((z) => z.toRational().isInteger()))) errs.push('livello 2: a > 1 e uno zero frazionario');
	if (lvl === 3 && !(P.a < 0 || R.a !== 0 || R.b !== 0 || R.c !== 0)) errs.push('livello 3: a negativo o termini nei due membri');
	if (lvl === 4 && zs.every((z) => z.isRational())) errs.push('livello 4: zeri irrazionali');
	if (lvl === 5 && d !== 0) errs.push('livello 5: Δ = 0');
	if (lvl === 6 && d >= 0) errs.push('livello 6: Δ < 0');
	if (lvl === 7 && P.b !== 0 && P.c !== 0) errs.push('livello 7: una disequazione incompleta');
	if (lvl < 7 && (P.b === 0 || P.c === 0)) errs.push('livelli 1-6: trinomio completo');
	// Δ = 0: the answers of the table
	if (d === 0) {
		const r = vertex(P).toString();
		const sa = Math.sign(P.a);
		const eff = sa > 0 ? p.op : FLIP[p.op];
		const want = { '>': `(-oo,${r})|(${r},oo)`, '>=': '(-oo,oo)', '<': '', '<=': `[${r},${r}]` }[eff];
		if (ivsKey(truth) !== want) errs.push('Δ = 0: risposta diversa dalla tabella');
	}
	errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const disequazioniSecondoGrado: Generator = {
	id: ID,
	title: 'Disequazioni di secondo grado',
	levels: {
		1: { label: 'Valori interni o esterni', constraints: ['x^2 + bx + c con zeri interi distinti tra -9 e 9', 'tutti i versi'] },
		2: { label: 'Coefficiente a maggiore di 1', constraints: ['(d1 x - n1)(d2 x - n2) sviluppato, almeno uno zero frazionario'] },
		3: { label: 'a negativo o termini nei due membri', constraints: ['-k(x - r1)(x - r2) op 0, oppure L op R con L - R = ±(x - r1)(x - r2)'] },
		4: { label: 'Zeri irrazionali', constraints: ['x^2 + bx + c con Δ positivo non quadrato'] },
		5: { label: 'Discriminante nullo', constraints: ['±k(mx - n)^2 op 0, le quattro risposte della tabella'] },
		6: { label: 'Discriminante negativo', constraints: ['Δ < 0, a positivo o negativo'] },
		7: { label: 'Pure e spurie', constraints: ['x^2 op k^2, x^2 + k op 0, x^2 op kx, ax^2 + bx op 0'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: (sample: Sample) => {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: the answer is always a choice`);
		return sample.answer;
	},
};

export default disequazioniSecondoGrado;
