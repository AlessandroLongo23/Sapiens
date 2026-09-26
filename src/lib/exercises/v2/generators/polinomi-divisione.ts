/**
 * Divisione tra polinomi. Spec: specs/exercises/polinomi-divisione.md
 *
 * Six levels in the order of the lesson's examples: first-degree divisor with a second-degree
 * dividend, then a third-degree one (example 1); incomplete dividend (example 2); second-degree
 * divisor (example 3); dividend in disorder and a quotient with fractions (example 4); incomplete
 * divisor (example 5).
 *
 * Built backwards: divisor B, quotient Q and remainder R (deg R < deg B) come first, and the
 * dividend is A = B·Q + R. The answer is the pair (Q, R), as a multiple choice: the lesson's
 * mistakes (stopping one step early, a wrong sign in the product, no room for a missing power)
 * all give a wrong pair, and a quotient alone would hide the remainder.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, ZERO, q } from '../rational';
import { type Poly, polyDegree, polyMul, polyAdd, polySub, polyScale, polyToLatex } from '../latex';
import { forbidden, nonZero, shuffle, wrap } from '../monomi';

export const ID = 'polinomi-divisione';

const PROMPT = 'Trova il quoziente e il resto della divisione.';

// ---------------------------------------------------------------------------
// Polynomials as coefficient arrays (index = degree)

const trim = (p: Poly): Poly => p.slice(0, Math.max(polyDegree(p) + 1, 0));
const P = (...byDegree: (number | Rational)[]): Poly => trim(byDegree.map((c) => (typeof c === 'number' ? q(c) : c)));
const coef = (p: Poly, i: number): Rational => p[i] ?? ZERO;
const lead = (p: Poly): Rational => coef(p, polyDegree(p));
const eqPoly = (a: Poly, b: Poly): boolean => {
	const n = Math.max(a.length, b.length);
	for (let i = 0; i < n; i++) if (!coef(a, i).equals(coef(b, i))) return false;
	return true;
};
/** c·x^k */
const term = (c: Rational, k: number): Poly => trim([...Array.from({ length: k }, () => ZERO), c]);
const latexOf = (p: Poly): string => polyToLatex(trim(p));

function sympyOf(p: Poly): string {
	const t = trim(p);
	if (t.length === 0) return '0';
	const parts: string[] = [];
	for (let i = t.length - 1; i >= 0; i--) {
		if (t[i].isZero()) continue;
		parts.push(i === 0 ? `(${t[i].toString()})` : `(${t[i].toString()})*x**${i}`);
	}
	return parts.join(' + ');
}

/** A monomial c·x^k in LaTeX, as a single term. */
const monoLatex = (c: Rational, k: number): string => polyToLatex(term(c, k));

// ---------------------------------------------------------------------------
// Long division with its trace

interface Step {
	t: Rational;
	k: number;
	before: Poly;
	product: Poly;
	after: Poly;
}

interface Division {
	q: Poly;
	r: Poly;
	steps: Step[];
}

/** Long division as in the lesson; `wrongSign` makes the mistake of the warning on the given steps. */
function divide(A: Poly, B: Poly, wrongSign: (i: number) => boolean = () => false): Division {
	const m = polyDegree(B);
	let cur = trim(A);
	let Q: Poly = [];
	const steps: Step[] = [];
	for (let i = 0; polyDegree(cur) >= m && i < 20; i++) {
		const k = polyDegree(cur) - m;
		const t = lead(cur).div(lead(B));
		const product = polyMul(term(t, k), B);
		let sub = product;
		if (wrongSign(i)) {
			// only the first term of the product changes sign
			sub = product.map((c, j) => (j === polyDegree(product) ? c : c.neg()));
		}
		const after = trim(polySub(cur, sub));
		steps.push({ t, k, before: cur, product, after });
		Q = polyAdd(Q, term(t, k));
		cur = after;
	}
	return { q: trim(Q), r: cur, steps };
}

// ---------------------------------------------------------------------------
// Construction

type Case =
	| 'secondo grado'
	| 'terzo grado'
	| 'divisibile'
	| 'con resto'
	| 'quoziente di primo grado'
	| 'quoziente di secondo grado'
	| 'frazioni e disordine'
	| 'x^2 + c'
	| 'x^2 + bx';

interface Built {
	A: Poly;
	B: Poly;
	Q: Poly;
	R: Poly;
	/** Degrees of A's terms in the order they are written in the problem. */
	order: number[];
	case: Case;
}

const dividendOf = (B: Poly, Q: Poly, R: Poly): Poly => trim(polyAdd(polyMul(B, Q), R));
const descending = (A: Poly): number[] => {
	const out: number[] = [];
	for (let i = polyDegree(A); i >= 0; i--) if (!coef(A, i).isZero()) out.push(i);
	return out;
};
const isComplete = (A: Poly): boolean => A.every((c) => !c.isZero());

function build(rng: Rng, level: number): Built | null {
	const b = buildRaw(rng, level);
	// every power of the quotient present (one step per term, as in the lesson's examples) and a
	// constant term in the dividend (never "+ 0" when completing it)
	if (!b || !isComplete(b.Q) || coef(b.A, 0).isZero()) return null;
	return b;
}

function buildRaw(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const B = P(nonZero(rng, -5, 5), 1);
			const Q = P(rng.int(-6, 6), rng.pick([1, 1, 1, 2, 3]));
			const R = P(rng.int(-9, 9));
			const A = dividendOf(B, Q, R);
			if (!isComplete(A)) return null;
			return { A, B, Q, R, order: descending(A), case: 'secondo grado' };
		}
		case 2: {
			const B = P(nonZero(rng, -4, 4), 1);
			const Q = P(rng.int(-5, 5), rng.int(-5, 5), rng.pick([1, 1, 2, 3]));
			const R = P(rng.int(-9, 9));
			const A = dividendOf(B, Q, R);
			if (!isComplete(A)) return null;
			return { A, B, Q, R, order: descending(A), case: 'terzo grado' };
		}
		case 3: {
			// x + b; a chosen set of inner powers of A vanishes: A_i = q_{i-1} + b·q_i = 0
			const b = nonZero(rng, -3, 3);
			const B = P(b, 1);
			const n = rng.next() < 0.75 ? 3 : 4;
			const qs: number[] = new Array(n).fill(0);
			qs[n - 1] = rng.pick([1, 1, 2]);
			const zeros = new Set<number>();
			for (let i = 1; i < n; i++) if (rng.next() < 0.45) zeros.add(i);
			if (zeros.size === 0) zeros.add(rng.int(1, n - 1));
			for (let i = n - 1; i >= 1; i--) qs[i - 1] = zeros.has(i) ? -b * qs[i] : rng.int(-5, 5);
			const Q = P(...qs);
			const divisibile = rng.next() < 0.35;
			const R = P(divisibile ? 0 : nonZero(rng, -9, 9));
			const A = dividendOf(B, Q, R);
			if (coef(A, 0).isZero() || isComplete(A)) return null;
			for (let i = 1; i < n; i++) if (coef(A, i).isZero() !== zeros.has(i)) return null;
			return { A, B, Q, R, order: descending(A), case: divisibile ? 'divisibile' : 'con resto' };
		}
		case 4: {
			const B = P(nonZero(rng, -4, 4), nonZero(rng, -4, 4), 1);
			const second = rng.next() < 0.6;
			const Q = second ? P(rng.int(-5, 5), rng.int(-5, 5), rng.pick([1, 1, 2])) : P(rng.int(-5, 5), rng.pick([1, 1, 2, 3]));
			const R = P(rng.int(-6, 6), nonZero(rng, -6, 6));
			const A = dividendOf(B, Q, R);
			return { A, B, Q, R, order: descending(A), case: second ? 'quoziente di secondo grado' : 'quoziente di primo grado' };
		}
		case 5: {
			// a·x + b with a = 2 or 3: only the constant term of Q is a fraction, k/a, and
			// R = m - b·k/a, so that A has integer coefficients (as in example 4)
			const a = rng.pick([2, 2, 3]);
			let b: number;
			do b = nonZero(rng, -5, 5);
			while (b % a === 0);
			let k: number;
			do k = nonZero(rng, -(2 * a - 1), 2 * a - 1);
			while (k % a === 0);
			const q0 = q(k, a);
			const Q = P(q0, rng.int(-4, 4), rng.pick([1, 1, 2, 3]));
			const R = P(q(rng.int(-6, 6)).sub(q0.mul(q(b))));
			const B = P(b, a);
			const A = dividendOf(B, Q, R);
			const terms = descending(A);
			if (terms.length < 3) return null;
			let order: number[];
			do order = shuffle(rng, terms);
			while (order.every((d, i) => d === terms[i]));
			return { A, B, Q, R, order, case: 'frazioni e disordine' };
		}
		case 6: {
			const constant = rng.next() < 0.7;
			const B = constant ? P(nonZero(rng, -5, 5), 0, 1) : P(0, nonZero(rng, -4, 4), 1);
			const Q = P(rng.int(-6, 6), rng.int(-6, 6), rng.pick([1, 1, 2, 3]));
			const R = P(rng.int(-6, 6), rng.int(-6, 6));
			if (polyDegree(R) < 0) return null;
			const A = dividendOf(B, Q, R);
			return { A, B, Q, R, order: descending(A), case: constant ? 'x^2 + c' : 'x^2 + bx' };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// LaTeX

/** A polynomial as the first addend of a sum: in parentheses only when it has more than one term. */
const addend = (p: Poly): string => (trim(p).filter((c) => !c.isZero()).length > 1 ? wrap(latexOf(p)) : latexOf(p));

/** A's terms in the given order of degrees, signs folded. */
function orderedLatex(A: Poly, order: number[]): string {
	return order
		.map((d, i) => {
			const s = monoLatex(coef(A, d), d);
			if (i === 0) return s;
			return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

/** A completed with the 0x^n placeholders, as in the column layout. */
function completedLatex(A: Poly): string {
	const n = polyDegree(A);
	const parts: string[] = [];
	for (let d = n; d >= 0; d--) {
		const c = coef(A, d);
		const body = c.isZero() ? `0${d === 0 ? '' : d === 1 ? 'x' : `x^${d}`}` : monoLatex(c.abs(), d);
		if (d === n) parts.push(c.sign() < 0 ? `-${body}` : body);
		else parts.push(c.sign() < 0 ? ` - ${body}` : ` + ${body}`);
	}
	return parts.join('');
}

/**
 * Estimated width in px of a formula rendered by KaTeX in display mode at 18 px, fitted on the
 * measured widths of these problems (error within 3 px): visible characters, one-digit
 * exponents, binary operators.
 */
function widthPx(latex: string): number {
	const exps = (latex.match(/\^\d/g) ?? []).length;
	const chars = latex.replace(/\^\d/g, '').replace(/ /g, '').length;
	const ops = (latex.match(/ [+\-:] /g) ?? []).length;
	return 11 * chars + 8.5 * exps + 10 * ops - 18;
}

/** Phone column is about 350 px; with a margin, a problem wider than this goes on two lines. */
const MAX_WIDTH = 340;

function problemLatex(b: Built): string {
	const A = `(${orderedLatex(b.A, b.order)})`;
	const B = `(${latexOf(b.B)})`;
	const one = `${A} : ${B}`;
	if (widthPx(one) <= MAX_WIDTH) return one;
	// on two lines, breaking before the ":" of the division
	return `\\begin{aligned}&${A} \\\\ &\\quad : ${B}\\end{aligned}`;
}

/**
 * An option "Q(x) = ..., R(x) = ...". The answer button has about 252 px at 16 px: from level 2 on
 * some pairs do not fit on one line, so every option of those levels puts R(x) on a second line
 * (the four answers keep the same shape). Level 1 pairs are at most about 200 px wide.
 */
const pairLatex = (Q: Poly, R: Poly, level: number): string =>
	level === 1 ? `Q(x) = ${latexOf(Q)},\\ \\ R(x) = ${latexOf(R)}` : `\\begin{gathered}Q(x) = ${latexOf(Q)} \\\\ R(x) = ${latexOf(R)}\\end{gathered}`;

/** t·(B) with t a monomial: "2x^2(x - 2)", "-(x - 2)", "\frac{1}{2}(2x - 1)". */
function timesLatex(t: Rational, k: number, B: Poly): string {
	const m = monoLatex(t, k);
	return m === '1' || m === '-1' ? `${m} \\cdot (${latexOf(B)})` : `${m}(${latexOf(B)})`;
}

function stepsOf(b: Built): string[] {
	const out: string[] = [];
	const { A, B, Q, R } = b;
	const inOrder = b.order.every((d, i) => d === descending(A)[i]);
	if (!inOrder && !isComplete(A)) out.push(`\\text{Ordina e completa il dividendo: } ${completedLatex(A)}`);
	else if (!inOrder) out.push(`\\text{Ordina il dividendo: } ${latexOf(A)}`);
	else if (!isComplete(A)) out.push(`\\text{Completa il dividendo: } ${completedLatex(A)}`);
	const d = divide(A, B);
	const m = polyDegree(B);
	d.steps.forEach((s, i) => {
		const lb = monoLatex(lead(B), m);
		const lp = monoLatex(lead(s.before), polyDegree(s.before));
		out.push(`\\text{Passo ${i + 1}: } ${lp} : ${lb} = ${monoLatex(s.t, s.k)} \\qquad ${timesLatex(s.t, s.k, B)} = ${latexOf(s.product)}`);
		out.push(`\\text{Somma l'opposto: } ${addend(s.before)} + ${wrap(latexOf(polyScale(s.product, q(-1))))} = ${latexOf(s.after)}`);
	});
	const dr = polyDegree(R);
	if (dr < 0) out.push(`\\text{Il resto è } 0\\text{: la divisione è finita e il dividendo è divisibile per } ${latexOf(B)}`);
	else out.push(`\\text{Il resto ha grado } ${dr}\\text{, minore del grado } ${m} \\text{ del divisore: la divisione è finita}`);
	const rl = latexOf(R);
	const tail = dr < 0 ? '' : rl.startsWith('-') ? ` - ${rl.slice(1)}` : ` + ${rl}`;
	out.push(`\\text{Verifica: } (${latexOf(B)})${wrap(latexOf(Q))}${tail} = ${latexOf(A)}`);
	return out;
}

// ---------------------------------------------------------------------------
// Distractors, from the lesson's warnings

interface Pair {
	Q: Poly;
	R: Poly;
}

const small = (p: Poly): boolean => p.every((c) => Math.abs(c.num) <= 60 && c.den <= 12);

/** Stopping one step early: the pair before the last step, with a remainder of degree >= deg B. */
function stopEarly(A: Poly, B: Poly): Pair | null {
	const d = divide(A, B);
	if (d.steps.length === 0) return null;
	const last = d.steps[d.steps.length - 1];
	return { Q: trim(polySub(d.q, term(last.t, last.k))), R: last.before };
}

/** Only the first term of the product changes sign, on the first step or on every step. */
function wrongSign(A: Poly, B: Poly, every: boolean): Pair {
	const d = divide(A, B, (i) => every || i === 0);
	return { Q: d.q, R: d.r };
}

/** No room left for the missing powers: the nonzero terms of A written in adjacent columns. */
function noPlaceholder(A: Poly, B: Poly): Pair | null {
	if (isComplete(A)) return null;
	const cs = descending(A).map((i) => coef(A, i));
	const n = polyDegree(A);
	// same leading degree, terms in consecutive columns
	const Ac = trim(Array.from({ length: n + 1 }, (_, i) => (i > n - cs.length ? cs[n - i] : ZERO)));
	const d = divide(Ac, B);
	return { Q: d.q, R: d.r };
}

/** Incomplete divisor x^2 + c: the "+c" of each product written in the next column (under x^{k+1}). */
function divisorShift(A: Poly, B: Poly): Pair | null {
	if (polyDegree(B) !== 2 || !coef(B, 1).isZero() || coef(B, 0).isZero()) return null;
	const d = divide(A, P(0, coef(B, 0), 1));
	return { Q: d.q, R: d.r };
}

/** Last step of a quotient with fractions: x : 2x taken as 2 (the reciprocal). */
function reciprocal(A: Poly, B: Poly): Pair | null {
	const d = divide(A, B);
	const last = d.steps[d.steps.length - 1];
	if (!last || last.t.isInteger() || last.k !== 0) return null;
	const t = q(1).div(last.t);
	const Q = trim(polyAdd(polySub(d.q, term(last.t, 0)), term(t, 0)));
	return { Q, R: trim(polySub(last.before, polyScale(B, t))) };
}

const pairKey = (p: Pair): string => `${trim(p.Q).map(String).join(',')}|${trim(p.R).map(String).join(',')}`;

function choiceOf(b: Built, rng: Rng, level: number): ChoiceAnswer {
	const { A, B, Q, R } = b;
	const cands: (Pair | null)[] = [];
	const negR: Pair | null = polyDegree(R) >= 0 ? { Q, R: polyScale(R, q(-1)) } : null;
	switch (b.case) {
		case 'secondo grado':
		case 'terzo grado':
			cands.push(wrongSign(A, B, false), stopEarly(A, B), negR, wrongSign(A, B, true));
			break;
		case 'divisibile':
		case 'con resto':
			cands.push(noPlaceholder(A, B), wrongSign(A, B, false), stopEarly(A, B), negR, wrongSign(A, B, true));
			break;
		case 'quoziente di primo grado':
		case 'quoziente di secondo grado':
			cands.push(stopEarly(A, B), wrongSign(A, B, false), noPlaceholder(A, B), negR, wrongSign(A, B, true));
			break;
		case 'frazioni e disordine':
			cands.push(reciprocal(A, B), stopEarly(A, B), wrongSign(A, B, false), negR, noPlaceholder(A, B), wrongSign(A, B, true));
			break;
		case 'x^2 + c':
		case 'x^2 + bx':
			cands.push(divisorShift(A, B), stopEarly(A, B), wrongSign(A, B, false), noPlaceholder(A, B), negR, wrongSign(A, B, true));
			break;
	}
	const correct: Pair = { Q, R };
	const seen = new Set([pairKey(correct)]);
	const options: Pair[] = [correct];
	const add = (p: Pair | null) => {
		if (!p || options.length >= 4 || !small(p.Q) || !small(p.R)) return;
		const k = pairKey(p);
		if (seen.has(k)) return;
		seen.add(k);
		options.push({ Q: trim(p.Q), R: trim(p.R) });
	};
	cands.forEach(add);
	// generic fallbacks: remainder off by i, then constant of the quotient off by i
	for (let i = 1; options.length < 4 && i < 50; i++) {
		const s = q(i % 2 === 1 ? Math.ceil(i / 2) : -Math.ceil(i / 2));
		add({ Q, R: trim(polyAdd(R, [s])) });
		add({ Q: trim(polyAdd(Q, [s])), R });
	}
	if (options.length < 4) throw new Error(`${ID}: not enough distinct options`);
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	const opts: ChoiceOption[] = order.map((i) => ({ latex: pairLatex(options[i].Q, options[i].R, level), values: [sympyOf(options[i].Q), sympyOf(options[i].R)] }));
	return { kind: 'choice', options: opts, correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Checks

const polyFromJSON = (x: unknown): Poly | null => {
	if (!Array.isArray(x) || !x.every((s) => typeof s === 'string')) return null;
	try {
		return trim((x as string[]).map((s) => Rational.parse(s)));
	} catch {
		return null;
	}
};

const maxAbs = (p: Poly): number => Math.max(0, ...p.map((c) => Math.abs(c.num)));
const maxDen = (p: Poly): number => Math.max(1, ...p.map((c) => c.den));

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const A = polyFromJSON(p.A);
	const B = polyFromJSON(p.B);
	const Q = polyFromJSON(p.Q);
	const R = polyFromJSON(p.R);
	const order = p.order as number[];
	if (!A || !B || !Q || !R || !Array.isArray(order)) return ['params non validi'];
	const b: Built = { A, B, Q, R, order, case: p.case as Case };
	if (sample.prompt !== PROMPT) v.push('consegna diversa');
	if (sample.problem !== problemLatex(b)) v.push('problema diverso dai parametri');
	v.push(...forbidden(sample.problem));
	if (!eqPoly(A, dividendOf(B, Q, R))) v.push('A diverso da B·Q + R');
	const dA = polyDegree(A);
	const dB = polyDegree(B);
	if (polyDegree(R) >= dB) v.push('resto di grado non minore del divisore');
	if ([...order].sort((x, y) => y - x).join() !== descending(A).join()) v.push('ordine dei termini non valido');
	const d = divide(A, B);
	if (!eqPoly(d.q, Q) || !eqPoly(d.r, R)) v.push('quoziente o resto diversi dalla divisione');
	if (maxAbs(A) > 40 || A.some((c) => !c.isInteger())) v.push('dividendo fuori misura o non intero');
	if (maxAbs(B) > 5 || B.some((c) => !c.isInteger())) v.push('divisore fuori misura');
	if (maxAbs(Q) > 12 || maxDen(Q) > 3 || maxAbs(R) > 30 || maxDen(R) > 3) v.push('quoziente o resto fuori misura');
	const leadB = lead(B);
	const inOrder = order.every((x, i) => x === descending(A)[i]);
	const lvl = sample.level;
	if (lvl !== 5 && (!inOrder || !leadB.isOne() || !Q.every((c) => c.isInteger()))) v.push('ordine, divisore monico e quoziente intero richiesti');
	switch (lvl) {
		case 1:
			if (dB !== 1 || dA !== 2 || !isComplete(A)) v.push('livello 1: (secondo grado completo) : (x + b)');
			break;
		case 2:
			if (dB !== 1 || dA !== 3 || !isComplete(A)) v.push('livello 2: (terzo grado completo) : (x + b)');
			break;
		case 3:
			if (dB !== 1 || dA < 3 || dA > 4 || isComplete(A) || coef(A, 0).isZero()) v.push('livello 3: dividendo incompleto di grado 3 o 4, termine noto presente');
			if ((p.case === 'divisibile') !== (polyDegree(R) < 0)) v.push('caso diverso dal resto');
			break;
		case 4:
			if (dB !== 2 || !isComplete(B) || dA < 3 || dA > 4 || polyDegree(R) !== 1) v.push('livello 4: divisore di secondo grado completo, resto di primo grado');
			break;
		case 5:
			if (dB !== 1 || ![2, 3].includes(leadB.num) || dA !== 3 || inOrder || order.length < 3) v.push('livello 5: (ax + b) con a = 2 o 3, dividendo di terzo grado in disordine');
			if (Q.every((c) => c.isInteger())) v.push('livello 5: il quoziente deve avere una frazione');
			break;
		case 6:
			if (dB !== 2 || isComplete(B) || B.filter((c) => !c.isZero()).length !== 2 || dA !== 4 || polyDegree(R) < 0) v.push('livello 6: divisore di secondo grado incompleto, dividendo di quarto grado, resto non nullo');
			break;
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	const a = sample.answer;
	if (a.kind !== 'choice' || a.options.length !== 4) v.push('risposta: quattro opzioni');
	else {
		const right = a.options[a.correct];
		if (!right || right.latex !== pairLatex(Q, R, sample.level) || right.values[0] !== sympyOf(Q) || right.values[1] !== sympyOf(R)) v.push('opzione corretta sbagliata');
		if (new Set(a.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
		for (const o of a.options) v.push(...forbidden(o.latex));
	}
	return v;
}

// ---------------------------------------------------------------------------

const toJSON = (p: Poly): string[] => trim(p).map((c) => c.toString());

function assemble(b: Built, level: number, rng: Rng): Sample {
	const choice = choiceOf(b, rng, level);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: PROMPT,
		problem: problemLatex(b),
		solution: pairLatex(b.Q, b.R, level),
		steps: stepsOf(b),
		answer: choice,
		choice,
		params: { case: b.case, A: toJSON(b.A), B: toJSON(b.B), Q: toJSON(b.Q), R: toJSON(b.R), order: b.order },
	};
}

export const polinomiDivisione: Generator = {
	id: ID,
	title: 'Divisione tra polinomi',
	levels: {
		1: { label: 'Divisore di primo grado', constraints: ['dividendo di secondo grado completo, divisore x + b', 'quoziente e resto interi'] },
		2: { label: 'Dividendo di terzo grado', constraints: ['dividendo di terzo grado completo, divisore x + b', 'come l\'esempio 1 della lezione'] },
		3: { label: 'Dividendo incompleto', constraints: ['dividendo di grado 3 o 4 senza una o più potenze intermedie', 'circa 1 su 3 divisibile (resto 0)'] },
		4: { label: 'Divisore di secondo grado', constraints: ['divisore x^2 + bx + c completo', 'resto di primo grado'] },
		5: { label: 'Dividendo in disordine, quoziente con frazioni', constraints: ['divisore 2x + b o 3x + b', 'dividendo intero scritto in disordine', 'termine noto del quoziente e resto frazionari'] },
		6: { label: 'Divisore incompleto', constraints: ['divisore x^2 + c (circa 7 su 10) o x^2 + bx', 'dividendo di quarto grado', 'resto non nullo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			let sample: Sample;
			try {
				sample = assemble(b, level, rng);
			} catch {
				continue;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
};

export default polinomiDivisione;
