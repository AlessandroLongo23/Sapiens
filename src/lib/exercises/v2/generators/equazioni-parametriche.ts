/**
 * Equazioni parametriche. Spec: specs/exercises/equazioni-parametriche.md
 *
 * Six levels in the order of lesson 78: the value of k for which the equation is of first degree; real,
 * distinct or coincident solutions with a discriminant of first degree in k; a given solution; opposite,
 * reciprocal or zero solutions; a given sum or product (a fractional equation in k); the sum of the
 * squares (a quadratic equation in k, one value to discard).
 *
 * The equation is a·x² + b·x + c = 0 where a, b, c are polynomials of first degree in k with small integer
 * coefficients. Every level is built backwards: the value of k (or the double root, the other solution, the
 * two values of the quadratic in k) is chosen or filtered first, then the coefficients around it. Every
 * answer is a `choice`: a pair (k and a solution), a condition on k, or the accepted values of k, which may
 * be none. The distractors are the mistakes the lesson names: the check of a and Δ skipped, the minus in
 * front of a·c, (−1)² taken as −1, −b/a written b/a, the sum of the squares taken as the square of the sum.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, exactSqrt, q } from '../rational';
import { type Poly, paren, poly, polyAdd, polyDegree, polyMul, polyPad, polyScale, polySub, polyToLatex } from '../latex';

export const ID = 'equazioni-parametriche';
const MAX_COEF = 12;

type Case =
	| 'distinte'
	| 'coincidenti'
	| 'opposte'
	| 'opposte scartato'
	| 'reciproche'
	| 'reciproche scartato'
	| 'reciproche impossibile'
	| 'nulla'
	| 'somma'
	| 'somma scartato'
	| 'prodotto'
	| 'prodotto scartato'
	| 'uno scartato'
	| 'due accettati'
	| 'nessuno';

// ---------------------------------------------------------------------------
// Polynomials in k (Poly from latex.ts, index = power of k)

const lin = (c0: number, c1: number): Poly => polyPad(poly(c0, c1), 2);
const at = (p: Poly, k: Rational): Rational => p.reduce((acc, c, i) => acc.add(c.mul(powR(k, i))), q(0));
const powR = (r: Rational, n: number): Rational => {
	let out = q(1);
	for (let i = 0; i < n; i++) out = out.mul(r);
	return out;
};
const kLatex = (p: Poly): string => polyToLatex(p, 'k');
const neg = (p: Poly): Poly => polyScale(p, q(-1));
const nonZeroTerms = (p: Poly): number => p.filter((c) => !c.isZero()).length;

function nonZeroInt(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

const nice = (r: Rational, maxDen: number, maxNum: number) => r.den <= maxDen && Math.abs(r.num) <= maxNum;

/** Root of the linear polynomial m·k + n, or null when m = 0. */
function linRoot(p: Poly): Rational | null {
	const [n, m] = polyPad(p, 2);
	if (m.isZero()) return null;
	return n.neg().div(m);
}

/**
 * One coefficient in front of x^2 or x, as the lesson writes it: "(k - 1)x^2", "-2kx", "3x", "-(k + 1)x".
 * `mon` is the power of x; with `sub` it is a number substituted for x and a "\cdot" separates it.
 */
function coefTerm(p: Poly, mon: string, first: boolean, sub = false): string {
	if (polyDegree(p) < 0) return '';
	let sign: '+' | '-';
	let body: string;
	const joined = (coefBody: string) => (sub ? (coefBody === '' ? mon : `${coefBody} \\cdot ${mon}`) : `${coefBody}${mon}`);
	if (nonZeroTerms(p) === 1) {
		const d = polyDegree(p);
		const c = p[d];
		sign = c.sign() < 0 ? '-' : '+';
		const a = c.abs();
		const coefBody = d === 0 ? (a.isOne() ? '' : a.toLatex()) : `${a.isOne() ? '' : a.toLatex()}k`;
		body = joined(coefBody);
	} else {
		const lead = p[polyDegree(p)];
		const inner = lead.sign() < 0 ? neg(p) : p;
		sign = lead.sign() < 0 ? '-' : '+';
		body = joined(`(${kLatex(inner)})`);
	}
	if (first) return sign === '-' ? `-${body}` : body;
	return ` ${sign} ${body}`;
}

/** The constant term (a polynomial in k), joined with its sign: " + k + 3", " - 2k - 4". */
function constTerm(p: Poly, first: boolean): string {
	if (polyDegree(p) < 0) return '';
	const s = kLatex(p);
	if (first) return s;
	return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
}

function equationLatex(a: Poly, b: Poly, c: Poly): string {
	const t1 = coefTerm(a, 'x^2', true);
	const t2 = coefTerm(b, 'x', t1 === '');
	const t3 = constTerm(c, t1 === '' && t2 === '');
	return `${t1}${t2}${t3} = 0`;
}

/** a·x0^2 + b·x0 + c with the number substituted, as in example 3. */
function substitutedLatex(a: Poly, b: Poly, c: Poly, x0: Rational): string {
	const t1 = coefTerm(a, `${paren(x0)}^2`, true, true);
	const t2 = coefTerm(b, paren(x0), false, true);
	return `${t1}${t2}${constTerm(c, false)} = 0`;
}

/** A polynomial as a factor of a product: "(k - 1)", "k", "2k", "3". */
function factor(p: Poly): string {
	return nonZeroTerms(p) === 1 && p[polyDegree(p)].sign() > 0 ? kLatex(p) : `(${kLatex(p)})`;
}

/** n times a polynomial: "4(k + 8)", "2 \\cdot 3k". */
function times(n: number, p: Poly): string {
	const f = factor(p);
	return f.startsWith('(') ? `${n}${f}` : `${n} \\cdot ${f}`;
}

/** Product of two factors: a monomial goes first, without a sign: "k(k + 3)", "(k - 1)(k + 3)". */
function productLatex(x: Poly, y: Poly): string {
	const fx = factor(x);
	const fy = factor(y);
	const monoX = !fx.startsWith('(');
	const monoY = !fy.startsWith('(');
	if (monoX && monoY) return `${fx} \\cdot ${fy}`;
	if (monoY && !monoX) return `${fy}${fx}`;
	return `${fx}${fy}`;
}

// ---------------------------------------------------------------------------
// Options

interface Opt {
	latex: string;
	values: string[];
}

const pairOpt = (k: Rational, x: Rational, xName: string): Opt => ({
	latex: `k = ${k.toLatex()},\\ ${xName} = ${x.toLatex()}`,
	values: [`k=${k}`, `x=${x}`],
});

const valuesOpt = (ks: Rational[]): Opt => {
	if (ks.length === 0) return { latex: '\\text{nessun valore di } k', values: ['none'] };
	const sorted = [...ks].sort((u, v) => u.compare(v));
	return { latex: sorted.map((k) => `k = ${k.toLatex()}`).join(',\\ '), values: sorted.map((k) => `k=${k}`) };
};

type Rel = '<' | '>' | '<=' | '>=';
interface Cond {
	rel: Rel;
	h: Rational;
	ex: Rational | null;
}
const REL_LATEX: Record<Rel, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const inRegion = (x: Rational, rel: Rel, h: Rational): boolean => {
	const c = x.compare(h);
	return rel === '<' ? c < 0 : rel === '>' ? c > 0 : rel === '<=' ? c <= 0 : c >= 0;
};
/** The exclusion k != r is written only when r lies in the region, so two options never mean the same set. */
const cond = (rel: Rel, h: Rational, r: Rational | null): Cond => ({ rel, h, ex: r && inRegion(r, rel, h) ? r : null });
const condOpt = (c: Cond): Opt => ({
	latex: `k ${REL_LATEX[c.rel]} ${c.h.toLatex()}${c.ex ? `,\\ k \\neq ${c.ex.toLatex()}` : ''}`,
	values: [`${c.rel}${c.h}`, ...(c.ex ? [`!=${c.ex}`] : [])],
});

function assembleChoice(rng: Rng, correct: Opt, cands: Opt[], fill: (i: number) => Opt | null): ChoiceAnswer {
	const seen = new Set([correct.values.join('|')]);
	const opts: Opt[] = [correct];
	const tryAdd = (o: Opt | null) => {
		if (!o || opts.length >= 4) return;
		const key = o.values.join('|');
		if (seen.has(key)) return;
		seen.add(key);
		opts.push(o);
	};
	cands.forEach(tryAdd);
	for (let i = 1; opts.length < 4 && i < 60; i++) tryAdd(fill(i));
	if (opts.length < 4) throw new Error(`${ID}: not enough distractors`);
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const options: ChoiceOption[] = order.map((i) => ({ latex: opts[i].latex, values: opts[i].values }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

const shift = (i: number): number => (i % 2 === 1 ? (i + 1) / 2 : -i / 2);

// ---------------------------------------------------------------------------
// Shared pieces of the steps

function coefStep(a: Poly, b: Poly, c: Poly): string {
	return `\\text{Coefficienti: } a = ${kLatex(a)},\\ b = ${kLatex(b)},\\ c = ${kLatex(c)}`;
}

function valuesAt(a: Poly, b: Poly, c: Poly, k: Rational): string {
	return `\\text{Con } k = ${k.toLatex()}\\text{: } a = ${at(a, k).toLatex()},\\ b = ${at(b, k).toLatex()},\\ c = ${at(c, k).toLatex()}`;
}

/** r^2 with the base in brackets when it is negative or a fraction. */
const squared = (r: Rational): string => (r.isInteger() ? `${paren(r)}^2` : `\\left(${r.toLatex()}\\right)^2`);

const delta = (a: Poly, b: Poly, c: Poly): Poly => polySub(polyMul(b, b), polyScale(polyMul(a, c), q(4)));
const deltaAt = (a: Poly, b: Poly, c: Poly, k: Rational): Rational => {
	const A = at(a, k);
	const B = at(b, k);
	const C = at(c, k);
	return B.mul(B).sub(q(4).mul(A).mul(C));
};

function deltaCheck(a: Poly, b: Poly, c: Poly, k: Rational): string {
	const A = at(a, k);
	const B = at(b, k);
	const C = at(c, k);
	const D = deltaAt(a, b, c, k);
	const rel = D.sign() > 0 ? '> 0' : D.sign() < 0 ? '< 0' : '= 0';
	return `\\Delta = b^2 - 4ac = ${squared(B)} - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${D.toLatex()} ${rel}`;
}

// ---------------------------------------------------------------------------
// Built exercise

interface Built {
	a: Poly;
	b: Poly;
	c: Poly;
	prompt: string;
	given?: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

const polyStr = (p: Poly): string[] => polyPad(p, 2).map(String);

/** Random linear coefficient c1·k + c0 with the bounds of the spec. */
function randLin(rng: Rng, k1: [number, number], k0: [number, number]): Poly {
	return lin(rng.int(k0[0], k0[1]), rng.int(k1[0], k1[1]));
}

const within = (...ps: Poly[]) => ps.every((p) => p.every((c) => c.isInteger() && Math.abs(c.num) <= MAX_COEF));

// ---------------------------------------------------------------------------
// Level 1: the value of k that makes a zero

function level1(rng: Rng): Built | null {
	const r = rng.int(-6, 6);
	const a1 = rng.pick([1, 1, 1, 2]);
	const a = lin(-a1 * r, a1);
	const B = nonZeroInt(rng, -6, 6);
	const qd = rng.pick([1, 1, 1, Math.abs(B)]);
	const x0 = q(nonZeroInt(rng, -6, 6), qd);
	const C = x0.mul(q(-B));
	if (!C.isInteger()) return null;
	const b1 = rng.int(-3, 3);
	const c1 = rng.int(-3, 3);
	if (b1 === 0 && c1 === 0) return null;
	const b = lin(B - b1 * r, b1);
	const c = lin(C.num - c1 * r, c1);
	if (!within(a, b, c) || polyDegree(c) < 0) return null;
	const R = q(r);
	const X = x0;

	const cands: Opt[] = [];
	const R2 = R.neg();
	if (!R2.equals(R) && !at(b, R2).isZero()) cands.push(pairOpt(R2, at(c, R2).neg().div(at(b, R2)), 'x'));
	cands.push(pairOpt(R, X.neg(), 'x'));
	if (!C.isZero()) cands.push(pairOpt(R, q(-B).div(C), 'x'));
	if (c1 !== 0) cands.push(pairOpt(R, c[0].neg().div(q(B)), 'x'));
	const choice = assembleChoice(rng, pairOpt(R, X, 'x'), cands, (i) => pairOpt(R, X.add(q(shift(i))), 'x'));

	const linear = `${polyToLatex(poly(C.num, B))} = 0`;
	const steps = [
		`\\text{Il coefficiente di } x^2 \\text{ è } a = ${kLatex(a)}\\text{, che si annulla per } k = ${R.toLatex()}`,
		`\\text{Sostituisci } k = ${R.toLatex()}\\text{: } b = ${B},\\ c = ${C.toLatex()}\\text{, e l'equazione diventa } ${linear}`,
		`x = -\\frac{c}{b} = ${X.toLatex()}`,
		`\\text{Per } k = ${R.toLatex()} \\text{ l'equazione è di primo grado, con la sola soluzione } x = ${X.toLatex()}`,
	];
	return {
		a,
		b,
		c,
		prompt: "Trova il valore di k per cui l'equazione è di primo grado e risolvila.",
		solution: `k = ${R.toLatex()},\\ x = ${X.toLatex()}`,
		steps,
		choice,
		params: { k: R.toString(), x: X.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 2: how many solutions, with Δ of first degree in k

function level2(rng: Rng, target: Case): Built | null {
	const r = rng.int(-5, 5);
	const b1 = rng.pick([2, -2]);
	const b0 = rng.pick([0, 0, rng.int(-6, 6)]);
	const c0 = rng.int(-9, 9);
	const a = lin(-r, 1);
	const b = lin(b0, b1);
	const c = lin(c0, 1);
	if (!within(a, b, c) || polyDegree(c) < 0) return null;
	const D = delta(a, b, c);
	if (polyDegree(D) !== 1) return null;
	const h = linRoot(D)!;
	const R = q(r);
	if (!nice(h, 2, 12) || h.equals(R)) return null;
	const m = D[1];
	const rel: Rel = m.sign() > 0 ? '>' : '<';
	// the lesson's warning: -(k - 1)(k + 3) developed as -k^2 + 2k - 3, only the first term negated
	const ac = polyMul(a, c);
	const wrong = polyAdd(D, polyScale(polyPad(ac, 2), q(8)));
	const wrongD = polyPad(wrong, 3);
	const hw = polyDegree(wrongD) === 1 ? linRoot(wrongD) : null;
	const reduced = b0 % 2 === 0;

	const steps: string[] = [coefStep(a, b, c), `\\text{Il coefficiente } a \\text{ si annulla per } k = ${R.toLatex()}\\text{: per quel valore l'equazione è di primo grado}`];
	const expanded = polyMul(b, b);
	if (reduced) {
		const half = polyScale(b, q(1, 2));
		steps.push(
			`\\frac{\\Delta}{4} = \\left(\\frac{b}{2}\\right)^2 - ac = ${factor(half)}^2 - ${productLatex(a, c)} = ${kLatex(polyMul(half, half))} - \\left(${kLatex(ac)}\\right) = ${kLatex(polyScale(D, q(1, 4)))}`,
		);
	} else {
		steps.push(
			`\\Delta = b^2 - 4ac = ${factor(b)}^2 - 4${productLatex(a, c)} = ${kLatex(expanded)} - 4\\left(${kLatex(ac)}\\right) = ${kLatex(D)}`,
		);
	}
	const dName = reduced ? '\\frac{\\Delta}{4}' : '\\Delta';
	const dPoly = reduced ? polyScale(D, q(1, 4)) : D;
	/** The discriminant is k itself: "k > 0, quindi k > 0" would say the same thing twice. */
	const bare = kLatex(dPoly) === 'k';

	if (target === 'distinte') {
		if (!inRegion(R, rel, h)) return null;
		const truth = cond(rel, h, R);
		const flip: Rel = rel === '<' ? '>' : '<';
		const cands: Opt[] = [condOpt(cond(rel, h, null)), condOpt(cond(rel === '<' ? '<=' : '>=', h, R)), condOpt(cond(flip, h, R))];
		if (hw && !hw.equals(h) && !hw.equals(R) && nice(hw, 4, 30)) cands.push(condOpt(cond(wrongD[1].sign() > 0 ? '>' : '<', hw, R)));
		const choice = assembleChoice(rng, condOpt(truth), cands, (i) => {
			const hh = h.add(q(shift(i)));
			return hh.equals(R) ? null : condOpt(cond(rel, hh, R));
		});
		steps.push(
			`\\text{Due soluzioni reali distinte: } ${dName} > 0\\text{, cioè } ${kLatex(dPoly)} > 0${bare ? '' : `\\text{, quindi } k ${REL_LATEX[rel]} ${h.toLatex()}`}`,
			`\\text{Togli } k = ${R.toLatex()}\\text{, per cui l'equazione è di primo grado: } k ${REL_LATEX[rel]} ${h.toLatex()},\\ k \\neq ${R.toLatex()}`,
		);
		return {
			a,
			b,
			c,
			prompt: "Per quali valori di k l'equazione ha due soluzioni reali distinte?",
			solution: condOpt(truth).latex,
			steps,
			choice,
			params: { case: target, h: h.toString(), excluded: R.toString(), rel },
		};
	}
	// coincidenti
	const A = at(a, h);
	const B = at(b, h);
	const xd = B.neg().div(A.mul(q(2)));
	if (!nice(xd, 3, 12)) return null;
	const cands: Opt[] = [pairOpt(h, xd.neg(), 'x_1 = x_2'), pairOpt(h, xd.mul(q(2)), 'x_1 = x_2')];
	if (hw && !hw.equals(h) && nice(hw, 4, 30) && !at(a, hw).isZero()) {
		cands.push(pairOpt(hw, at(b, hw).neg().div(at(a, hw).mul(q(2))), 'x_1 = x_2'));
	}
	if (!h.isZero()) cands.push(pairOpt(h.neg(), xd, 'x_1 = x_2'));
	const choice = assembleChoice(rng, pairOpt(h, xd, 'x_1 = x_2'), cands, (i) => pairOpt(h, xd.add(q(shift(i))), 'x_1 = x_2'));
	steps.push(
		`\\text{Soluzioni coincidenti: } ${dName} = 0\\text{, cioè } ${kLatex(dPoly)} = 0${bare ? '' : `\\text{, quindi } k = ${h.toLatex()}`}`,
		`\\text{Con } k = ${h.toLatex()}\\text{: } a = ${A.toLatex()} \\neq 0,\\ b = ${B.toLatex()}`,
		`x_1 = x_2 = -\\frac{b}{2a} = ${xd.toLatex()}`,
	);
	return {
		a,
		b,
		c,
		prompt: "Per quale valore di k l'equazione ha due soluzioni coincidenti? Trova anche la soluzione doppia.",
		solution: `k = ${h.toLatex()},\\ x_1 = x_2 = ${xd.toLatex()}`,
		steps,
		choice,
		params: { case: target, h: h.toString(), x: xd.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a given solution

/** The value of k for which x0 is a solution, from a·x0^2 + b·x0 + c = 0 (linear in k). */
function kFromSolution(a: Poly, b: Poly, c: Poly, x0: Rational, x2: Rational = x0.mul(x0)): Rational | null {
	const e = polyAdd(polyAdd(polyScale(a, x2), polyScale(b, x0)), c);
	return linRoot(polyPad(e, 2));
}

function otherRoot(a: Poly, c: Poly, k: Rational, x0: Rational): Rational | null {
	const A = at(a, k);
	if (A.isZero()) return null;
	return at(c, k).div(A).div(x0);
}

function level3(rng: Rng): Built | null {
	const a = lin(rng.int(-5, 5), rng.pick([1, 1, 2]));
	const b = randLin(rng, [-3, 3], [-8, 8]);
	const c = randLin(rng, [-3, 3], [-9, 9]);
	if (b[1].isZero() && c[1].isZero()) return null;
	if (polyDegree(b) < 0 || polyDegree(c) < 0) return null;
	const x0 = q(rng.pick([-1, -1, -2, -3, 1, 2, 3]));
	const e = polyAdd(polyAdd(polyScale(a, x0.mul(x0)), polyScale(b, x0)), c);
	const k0 = linRoot(polyPad(e, 2));
	if (!k0 || !nice(k0, 3, 12)) return null;
	const A = at(a, k0);
	if (A.isZero()) return null;
	const x2 = otherRoot(a, c, k0, x0)!;
	if (!nice(x2, 5, 12) || x2.equals(x0)) return null;
	const C = at(c, k0);
	const B = at(b, k0);

	const cands: Opt[] = [];
	if (x0.sign() < 0) {
		// (−1)^2 taken as −1, and the minus of b·x lost
		const kw = kFromSolution(a, b, c, x0, x0.mul(x0).neg());
		if (kw && nice(kw, 3, 12)) {
			const xw = otherRoot(a, c, kw, x0);
			if (xw && nice(xw, 6, 20)) cands.push(pairOpt(kw, xw, 'x_2'));
		}
		const kb = kFromSolution(a, polyScale(b, q(-1)), c, x0);
		if (kb && nice(kb, 3, 12)) {
			const xb = otherRoot(a, c, kb, x0);
			if (xb && nice(xb, 6, 20)) cands.push(pairOpt(kb, xb, 'x_2'));
		}
	}
	cands.push(pairOpt(k0, x2.neg(), 'x_2'));
	cands.push(pairOpt(k0, B.div(A).sub(x0), 'x_2'));
	cands.push(pairOpt(k0, C.div(A), 'x_2'));
	const choice = assembleChoice(rng, pairOpt(k0, x2, 'x_2'), cands, (i) => pairOpt(k0, x2.add(q(shift(i))), 'x_2'));

	const steps = [
		`\\text{Sostituisci } x = ${x0.toLatex()}\\text{: } ${substitutedLatex(a, b, c, x0)}`,
		`\\text{Riduci: } ${kLatex(polyPad(e, 2))} = 0\\text{, quindi } k = ${k0.toLatex()}`,
		`\\text{Con } k = ${k0.toLatex()}\\text{: } a = ${A.toLatex()} \\neq 0,\\ c = ${C.toLatex()}\\text{; il discriminante non serve, perché } ${x0.toLatex()} \\text{ è una soluzione}`,
		`\\text{Prodotto delle soluzioni: } x_1 \\cdot x_2 = \\frac{c}{a} = ${C.div(A).toLatex()}`,
		`x_2 = \\frac{c}{a} : x_1 = ${C.div(A).toLatex()} : ${paren(x0)} = ${x2.toLatex()}`,
	];
	return {
		a,
		b,
		c,
		prompt: "Trova il valore di k per cui il numero dato è una soluzione dell'equazione, e trova l'altra soluzione.",
		given: `x_1 = ${x0.toLatex()}`,
		solution: `k = ${k0.toLatex()},\\ x_2 = ${x2.toLatex()}`,
		steps,
		choice,
		params: { x1: x0.toString(), k: k0.toString(), x2: x2.toString() },
	};
}

// ---------------------------------------------------------------------------
// Levels 4-6: accepted values of k

function valueChoice(rng: Rng, truth: Rational[], cands: Rational[][]): ChoiceAnswer {
	const ok = (ks: Rational[]) => ks.every((k) => nice(k, 6, 40));
	const base = truth.length ? truth : cands.find((c) => c.length > 0) ?? [q(0)];
	return assembleChoice(
		rng,
		valuesOpt(truth),
		cands.filter(ok).map(valuesOpt),
		(i) => valuesOpt(base.map((k) => k.add(q(shift(i))))),
	);
}

const accepted = (a: Poly, b: Poly, c: Poly, k: Rational): boolean => !at(a, k).isZero() && deltaAt(a, b, c, k).sign() >= 0;

const PROMPT4: Record<string, string> = {
	opposte: 'Trova k in modo che le soluzioni siano opposte.',
	reciproche: 'Trova k in modo che le soluzioni siano reciproche.',
	nulla: 'Trova k in modo che una soluzione sia nulla.',
};

function level4(rng: Rng, target: Case): Built | null {
	const a = lin(rng.int(-6, 6), rng.pick([1, 1, 2]));
	const b = randLin(rng, [-3, 3], [-8, 8]);
	const c = randLin(rng, [-3, 3], [-9, 9]);
	if (polyDegree(b) < 0 || polyDegree(c) < 0) return null;
	const kind = target.split(' ')[0] as 'opposte' | 'reciproche' | 'nulla';
	const steps: string[] = [coefStep(a, b, c)];
	const ra = linRoot(a)!;
	steps.push(`\\text{Il coefficiente } a \\text{ si annulla per } k = ${ra.toLatex()}\\text{: quel valore non va bene}`);
	const bRoot = linRoot(b);
	const cRoot = linRoot(c);
	const caRoot = linRoot(polyPad(polySub(c, a), 2));
	const cmaRoot = linRoot(polyPad(polyAdd(c, a), 2));
	let value: Rational | null;
	const wrong: (Rational | null)[] = [];
	if (kind === 'opposte') {
		if (b[1].isZero()) return null;
		value = bRoot;
		steps.push(`\\text{Soluzioni opposte: } b = 0\\text{, cioè } ${kLatex(b)} = 0\\text{, quindi } k = ${value!.toLatex()}`);
		wrong.push(cRoot, caRoot);
	} else if (kind === 'reciproche') {
		const eq = polyPad(polySub(c, a), 2);
		if (target === 'reciproche impossibile') {
			if (!eq[1].isZero() || eq[0].isZero()) return null;
			value = null;
			steps.push(`\\text{Soluzioni reciproche: } c = a\\text{, cioè } ${kLatex(c)} = ${kLatex(a)}`);
			steps.push(`\\text{Riduci: } ${eq[0].neg().toLatex()} = 0\\text{, falso per ogni } k\\text{: nessun valore di } k \\text{ rende le soluzioni reciproche}`);
		} else {
			if (eq[1].isZero()) return null;
			value = caRoot;
			steps.push(`\\text{Soluzioni reciproche: } c = a\\text{, cioè } ${kLatex(c)} = ${kLatex(a)}\\text{, quindi } k = ${value!.toLatex()}`);
		}
		wrong.push(cmaRoot, cRoot, bRoot);
	} else {
		if (c[1].isZero()) return null;
		value = cRoot;
		steps.push(`\\text{Una soluzione nulla: } c = 0\\text{, cioè } ${kLatex(c)} = 0\\text{, quindi } k = ${value!.toLatex()}`);
		wrong.push(bRoot, caRoot, ra);
	}
	if (value && !nice(value, 3, 12)) return null;

	let truth: Rational[] = [];
	let got: Case;
	if (!value) got = 'reciproche impossibile';
	else {
		const A = at(a, value);
		const B = at(b, value);
		if (A.isZero()) return null;
		const D = deltaAt(a, b, c, value);
		if (D.isZero()) return null;
		if (kind === 'nulla') {
			if (B.isZero()) return null;
			truth = [value];
			got = 'nulla';
			steps.push(`${valuesAt(a, b, c, value)}\\text{; } a \\neq 0\\text{, e il discriminante non serve, perché } 0 \\text{ è una soluzione}`);
			steps.push(`\\text{Le soluzioni sono } 0 \\text{ e } -\\frac{b}{a} = ${B.neg().div(A).toLatex()}`);
		} else {
			steps.push(`${valuesAt(a, b, c, value)}\\text{; } a \\neq 0`);
			steps.push(deltaCheck(a, b, c, value));
			if (D.sign() > 0) {
				truth = [value];
				got = kind;
				steps.push(`\\text{Il valore } k = ${value.toLatex()} \\text{ è accettabile}`);
			} else {
				got = `${kind} scartato` as Case;
				steps.push(`\\text{Nessuna soluzione reale: } k = ${value.toLatex()} \\text{ si scarta, e nessun valore di } k \\text{ va bene}`);
			}
		}
	}
	if (got !== target) return null;

	const cands: Rational[][] = [];
	if (value && truth.length === 0) cands.push([value]);
	if (truth.length) cands.push([]);
	for (const w of wrong) if (w && !(value && w.equals(value))) cands.push([w]);
	if (value && !value.isZero()) cands.push([value.neg()]);
	const choice = valueChoice(rng, truth, cands);
	return {
		a,
		b,
		c,
		prompt: PROMPT4[kind],
		solution: valuesOpt(truth).latex,
		steps,
		choice,
		params: { case: target, condition: kind, values: truth.map(String) },
	};
}

function level5(rng: Rng, target: Case): Built | null {
	const a = lin(rng.int(-6, 6), rng.pick([1, 1, 2]));
	const b = randLin(rng, [-3, 3], [-8, 8]);
	const c = randLin(rng, [-3, 3], [-9, 9]);
	if (polyDegree(b) < 0 || polyDegree(c) < 0) return null;
	const kind = target.split(' ')[0] as 'somma' | 'prodotto';
	const given = nonZeroInt(rng, -6, 6);
	const G = q(given);
	const ra = linRoot(a)!;
	// somma: -b = s·a ; prodotto: c = p·a
	const num = kind === 'somma' ? neg(b) : c;
	const eq = polyPad(polySub(num, polyScale(a, G)), 2);
	const value = linRoot(eq);
	if (!value || !nice(value, 3, 12) || value.equals(ra)) return null;
	const D = deltaAt(a, b, c, value);
	if (D.isZero()) return null;
	const got: Case = D.sign() > 0 ? (kind as Case) : (`${kind} scartato` as Case);
	if (got !== target) return null;
	const truth = D.sign() > 0 ? [value] : [];

	const wrong: (Rational | null)[] = [];
	if (kind === 'somma') {
		wrong.push(linRoot(polyPad(polySub(b, polyScale(a, G)), 2))); // b/a = s
		wrong.push(linRoot(polyPad(polySub(neg(b), lin(given, 0)), 2))); // -b = s, a forgotten
		wrong.push(linRoot(polyPad(polySub(c, polyScale(a, G)), 2))); // c/a = s
	} else {
		wrong.push(linRoot(polyPad(polySub(neg(c), polyScale(a, G)), 2))); // -c/a = p
		wrong.push(linRoot(polyPad(polySub(c, lin(given, 0)), 2))); // c = p, a forgotten
		wrong.push(linRoot(polyPad(polySub(neg(b), polyScale(a, G)), 2))); // -b/a = p
	}
	const cands: Rational[][] = [];
	if (truth.length === 0) cands.push([value]);
	else cands.push([]);
	for (const w of wrong) if (w && !w.equals(value)) cands.push([w]);
	if (!value.isZero()) cands.push([value.neg()]);
	const choice = valueChoice(rng, truth, cands);

	const name = kind === 'somma' ? 'x_1 + x_2 = -\\frac{b}{a}' : 'x_1 \\cdot x_2 = \\frac{c}{a}';
	const steps = [
		coefStep(a, b, c),
		`${name} = \\frac{${kLatex(num)}}{${kLatex(a)}}\\text{, con C.E. } k \\neq ${ra.toLatex()}\\text{ (è la condizione } a \\neq 0\\text{)}`,
		`\\frac{${kLatex(num)}}{${kLatex(a)}} = ${given}\\text{: moltiplica per } ${kLatex(a)}\\text{: } ${kLatex(num)} = ${kLatex(polyScale(a, G))}`,
		`\\text{Quindi } k = ${value.toLatex()}\\text{, che rispetta la C.E.}`,
		valuesAt(a, b, c, value),
		deltaCheck(a, b, c, value),
		truth.length
			? `\\text{Il valore } k = ${value.toLatex()} \\text{ è accettabile}`
			: `\\text{Nessuna soluzione reale: } k = ${value.toLatex()} \\text{ si scarta, e nessun valore di } k \\text{ va bene}`,
	];
	return {
		a,
		b,
		c,
		prompt:
			kind === 'somma'
				? 'Trova k in modo che la somma delle soluzioni sia quella indicata.'
				: 'Trova k in modo che il prodotto delle soluzioni sia quello indicato.',
		given: kind === 'somma' ? `x_1 + x_2 = ${given}` : `x_1 \\cdot x_2 = ${given}`,
		solution: valuesOpt(truth).latex,
		steps,
		choice,
		params: { case: target, condition: kind, given: G.toString(), values: truth.map(String) },
	};
}

/** Rational roots of k^2 + p·k + r (monic), or null when irrational or none. */
function monicRoots(p: Rational, r: Rational): Rational[] | null {
	const disc = p.mul(p).sub(q(4).mul(r));
	const s = exactSqrt(disc);
	if (!s || s.isZero()) return null;
	return [p.neg().sub(s).div(q(2)), p.neg().add(s).div(q(2))];
}

function level6(rng: Rng, target: Case): Built | null {
	const b1 = rng.pick([1, -1]);
	let k1 = rng.int(-6, 9);
	let k2 = rng.int(-6, 9);
	if (k1 === k2 || (k1 + k2) % 2 !== 0) return null;
	if (k1 > k2) [k1, k2] = [k2, k1];
	const c1 = nonZeroInt(rng, -3, 3);
	const b0 = b1 * (c1 - (k1 + k2) / 2);
	const c0 = rng.int(-9, 9);
	const t = b0 * b0 - 2 * c0 - k1 * k2;
	if (t < 1 || t > 40) return null;
	const a = lin(1, 0);
	const b = lin(b0, b1);
	const c = lin(c0, c1);
	if (!within(b, c) || polyDegree(c) < 0) return null;
	const K1 = q(k1);
	const K2 = q(k2);
	const D1 = deltaAt(a, b, c, K1);
	const D2 = deltaAt(a, b, c, K2);
	if (D1.isZero() || D2.isZero()) return null;
	const truth = [K1, K2].filter((k) => accepted(a, b, c, k));
	const got: Case = truth.length === 1 ? 'uno scartato' : truth.length === 2 ? 'due accettati' : 'nessuno';
	if (got !== target) return null;

	const s = neg(b);
	const sq = polySub(polyMul(s, s), polyScale(c, q(2)));
	const eq = polyPad(polySub(sq, lin(t, 0)), 3);
	const cands: Rational[][] = [];
	if (truth.length !== 2) cands.push([K1, K2]);
	if (truth.length === 1) cands.push([K1, K2].filter((k) => !k.equals(truth[0])));
	if (truth.length === 2) cands.push([K1], [K2]);
	if (truth.length) cands.push([]);
	// (x1 + x2)^2 = t: the square of the sum
	const rt = exactSqrt(q(t));
	if (rt) cands.push([rt.sub(q(b0)).mul(q(b1)), rt.neg().sub(q(b0)).mul(q(b1))]);
	// s^2 + 2p = t: the sign of the double product
	const plus = polyPad(polySub(polyAdd(polyMul(s, s), polyScale(c, q(2))), lin(t, 0)), 3);
	const pr = monicRoots(plus[1], plus[0]);
	if (pr) cands.push(pr);
	const choice = valueChoice(rng, truth, cands);

	const steps = [
		`\\text{Qui } a = 1\\text{: } s = -b = ${kLatex(s)},\\ p = c = ${kLatex(c)}`,
		`x_1^2 + x_2^2 = s^2 - 2p = ${factor(s)}^2 - ${times(2, c)} = ${kLatex(sq)}`,
		`${kLatex(sq)} = ${t} \\Rightarrow ${kLatex(eq)} = 0`,
		`k_1 = ${K1.toLatex()},\\quad k_2 = ${K2.toLatex()}`,
		`\\text{Controlla il discriminante } \\Delta = b^2 - 4ac = ${factor(s)}^2 - ${times(4, c)}`,
		`k = ${K1.toLatex()}\\text{: } \\Delta = ${D1.toLatex()} ${D1.sign() > 0 ? '> 0' : '< 0'}\\text{, ${D1.sign() > 0 ? 'accettabile' : 'si scarta'}}`,
		`k = ${K2.toLatex()}\\text{: } \\Delta = ${D2.toLatex()} ${D2.sign() > 0 ? '> 0' : '< 0'}\\text{, ${D2.sign() > 0 ? 'accettabile' : 'si scarta'}}`,
	];
	return {
		a,
		b,
		c,
		prompt: 'Trova k in modo che la somma dei quadrati delle soluzioni sia quella indicata.',
		given: `x_1^2 + x_2^2 = ${t}`,
		solution: valuesOpt(truth).latex,
		steps,
		choice,
		params: { case: target, condition: 'quadrati', given: String(t), roots: [K1.toString(), K2.toString()], values: truth.map(String) },
	};
}

// ---------------------------------------------------------------------------

const pickCase = (rng: Rng, table: [Case, number][]): Case => {
	const u = rng.next();
	let acc = 0;
	for (const [c, w] of table) {
		acc += w;
		if (u < acc) return c;
	}
	return table[table.length - 1][0];
};

const CASES: Record<number, [Case, number][]> = {
	2: [
		['distinte', 0.5],
		['coincidenti', 0.5],
	],
	4: [
		['opposte', 0.2],
		['opposte scartato', 0.15],
		['reciproche', 0.2],
		['reciproche scartato', 0.15],
		['reciproche impossibile', 0.1],
		['nulla', 0.2],
	],
	5: [
		['somma', 0.3],
		['somma scartato', 0.2],
		['prodotto', 0.3],
		['prodotto scartato', 0.2],
	],
	6: [
		['uno scartato', 0.65],
		['due accettati', 0.25],
		['nessuno', 0.1],
	],
};

function build(rng: Rng, level: number, target: Case | null): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng, target!);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng, target!);
		case 5:
			return level5(rng, target!);
		case 6:
			return level6(rng, target!);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function assemble(bt: Built, level: number, seed: number): Sample {
	const eq = equationLatex(bt.a, bt.b, bt.c);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: bt.prompt,
		problem: bt.given ? `\\begin{gathered} ${eq} \\\\ ${bt.given} \\end{gathered}` : eq,
		solution: bt.solution,
		steps: bt.steps,
		answer: bt.choice,
		params: { a: polyStr(bt.a), b: polyStr(bt.b), c: polyStr(bt.c), ...bt.params },
	};
}

// ---------------------------------------------------------------------------
// check(): the spec constraints, recomputed from params

function parseLin(x: unknown): Poly | null {
	if (!Array.isArray(x) || x.length !== 2) return null;
	try {
		return x.map((s) => Rational.parse(String(s)));
	} catch {
		return null;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const a = parseLin(sample.params.a);
	const b = parseLin(sample.params.b);
	const c = parseLin(sample.params.c);
	if (!a || !b || !c) return ['params a, b, c mancanti'];
	if (!within(a, b, c)) v.push('coefficienti non interi o oltre 12');
	if (polyDegree(c) < 0) v.push('termine noto nullo');
	if (/(?<![\d.])1\s*[xk]|\+\s*-|-\s*-|\^\{?1\}?(?!\d)|[+-]\s*0(?!\d)/.test(sample.problem)) v.push(`forma vietata nel testo: ${sample.problem}`);
	const ans = sample.answer;
	if (ans.kind !== 'choice') return [...v, 'la risposta deve essere una scelta'];
	if (ans.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ans.options.map((o) => o.values.join('|'))).size !== ans.options.length) v.push('opzioni ripetute');
	const right = ans.options[ans.correct]?.values.join('|');
	const p = sample.params;
	const lvl = sample.level;
	const expect = (vals: string[]) => {
		if (right !== vals.join('|')) v.push(`opzione giusta ${right}, attesa ${vals.join('|')}`);
	};
	const vals = (xs: unknown) => (xs as string[]).map((s) => Rational.parse(s));
	if (lvl === 1) {
		if (!(a[1].sign() > 0)) v.push('a deve dipendere da k');
		const r = linRoot(a)!;
		const B = at(b, r);
		if (B.isZero()) v.push('per k = r anche b si annulla');
		else expect([`k=${r}`, `x=${at(c, r).neg().div(B)}`]);
	} else if (lvl === 2) {
		const D = delta(a, b, c);
		if (polyDegree(D) !== 1) v.push('il discriminante deve essere di primo grado in k');
		else {
			const h = linRoot(D)!;
			const r = linRoot(a)!;
			if (p.case === 'distinte') {
				const rel: Rel = D[1].sign() > 0 ? '>' : '<';
				if (!inRegion(r, rel, h)) v.push('il valore che annulla a deve stare nella regione');
				expect(condOpt(cond(rel, h, r)).values);
			} else if (p.case === 'coincidenti') {
				expect([`k=${h}`, `x=${at(b, h).neg().div(at(a, h).mul(q(2)))}`]);
			} else v.push('caso sconosciuto');
		}
	} else if (lvl === 3) {
		const x0 = Rational.parse(String(p.x1));
		const k0 = kFromSolution(a, b, c, x0);
		if (!k0 || at(a, k0).isZero()) v.push('valore di k non valido');
		else {
			const x2 = otherRoot(a, c, k0, x0)!;
			if (x2.equals(x0)) v.push('soluzione doppia');
			expect([`k=${k0}`, `x=${x2}`]);
		}
	} else if (lvl >= 4 && lvl <= 6) {
		expect(valuesOpt(vals(p.values)).values);
		for (const k of vals(p.values)) if (!accepted(a, b, c, k)) v.push(`k = ${k} non accettabile`);
		if (lvl === 6 && !(a[1].isZero() && a[0].isOne())) v.push('al livello 6 a = 1');
		if (lvl !== 6 && !(a[1].sign() > 0)) v.push('a deve dipendere da k');
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

export function toChoice(sample: Sample): ChoiceAnswer {
	if (sample.answer.kind !== 'choice') throw new Error(`${ID}: answer is always a choice`);
	return sample.answer;
}

export const equazioniParametriche: Generator = {
	id: ID,
	title: 'Equazioni parametriche',
	levels: {
		1: {
			label: 'Il caso a = 0: equazione di primo grado',
			constraints: ['a = a1(k - r) con a1 = 1 o 2', 'per k = r, b != 0 e la soluzione è un numero semplice', 'risposta: la coppia k, x'],
		},
		2: {
			label: 'Soluzioni distinte o coincidenti',
			constraints: ['a = k - r, b = ±2k + b0, c = k + c0: il discriminante è di primo grado in k', 'metà: condizione per due soluzioni distinte, con k != r da togliere', 'metà: valore di k e soluzione doppia'],
		},
		3: {
			label: 'Una soluzione assegnata',
			constraints: ['si sostituisce x1 (intero da -3 a 3, non nullo) e si ricava k', "l'altra soluzione con il prodotto c/a", 'risposta: la coppia k, x2'],
		},
		4: {
			label: 'Soluzioni opposte, reciproche, una nulla',
			constraints: ['b = 0, c = a oppure c = 0', 'controllo di a e del discriminante; a volte nessun valore'],
		},
		5: {
			label: 'Somma o prodotto assegnati',
			constraints: ['equazione fratta in k con C.E. a != 0', 'controllo del discriminante; il valore a volte si scarta'],
		},
		6: {
			label: 'Somma dei quadrati',
			constraints: ['a = 1, s^2 - 2p = t: equazione di secondo grado in k con due radici intere', 'di solito uno dei due valori si scarta'],
		},
	},
	generate(rng: Rng, level: number): Sample {
		const table = CASES[level];
		const target = table ? pickCase(rng, table) : null;
		for (let attempt = 0; attempt < 200_000; attempt++) {
			const bt = build(rng, level, target);
			if (!bt) continue;
			const sample = assemble(bt, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniParametriche;
