/**
 * Regola di Ruffini e teorema del resto. Spec: specs/exercises/polinomi-ruffini.md
 *
 * Seven levels in the order of lesson 33, each adding one difficulty: division by x - a with a
 * positive integer and a complete dividend; incomplete dividend (zeros to insert); a negative
 * (divisor x + b); a fractional; the remainder theorem (the remainder as a number); Ruffini's
 * theorem (which binomial divides the polynomial); the value of a parameter k that makes the
 * division exact. The divisor ax - b is left out (the lesson note marks it as removable).
 *
 * Levels 1-4 ask for quotient and remainder together: the answer is a choice among four pairs
 * "Q(x) = ..., R = ...", like the division with remainder of the naturals. Level 5 and 7 answer
 * with a number, level 6 with a choice among four binomials.
 *
 * Everything is built backwards: for a division the quotient is chosen first, coefficient by
 * coefficient, and the dividend follows; for level 6 the zero; for level 7 the value of k.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, ZERO, q } from '../rational';
import { forbidden, nonZero, shuffle } from '../monomi';

export const ID = 'polinomi-ruffini';

// ---------------------------------------------------------------------------
// Polynomials as coefficient lists, highest degree FIRST (the order of the Ruffini table)

type Desc = Rational[];

const t = (s: string) => `\\text{${s}}`;

function pow(x: Rational, n: number): Rational {
	let out = q(1);
	for (let i = 0; i < n; i++) out = out.mul(x);
	return out;
}

/** Bottom row of the Ruffini table (quotient coefficients, then the remainder) and the products row. */
function ruffini(p: Desc, a: Rational): { bottom: Rational[]; products: Rational[] } {
	const bottom: Rational[] = [p[0]];
	const products: Rational[] = [];
	for (let i = 1; i < p.length; i++) {
		const prod = bottom[i - 1].mul(a);
		products.push(prod);
		bottom.push(p[i].add(prod));
	}
	return { bottom, products };
}

function divide(p: Desc, a: Rational): { Q: Desc; R: Rational } {
	const { bottom } = ruffini(p, a);
	return { Q: bottom.slice(0, -1), R: bottom[bottom.length - 1] };
}

function evalAt(p: Desc, a: Rational): Rational {
	const n = p.length - 1;
	return p.reduce((s, c, i) => s.add(c.mul(pow(a, n - i))), ZERO);
}

function xPow(deg: number): string {
	if (deg === 0) return '';
	if (deg === 1) return 'x';
	return deg < 10 ? `x^${deg}` : `x^{${deg}}`;
}

/** LaTeX, highest degree first, signs folded, no zero terms, no coefficient 1. */
function descLatex(p: Desc): string {
	const n = p.length - 1;
	let out = '';
	p.forEach((c, i) => {
		const deg = n - i;
		if (c.isZero()) return;
		const abs = c.abs();
		const body = deg === 0 ? abs.toLatex() : (abs.isOne() ? '' : abs.toLatex()) + xPow(deg);
		if (out === '') out = (c.sign() < 0 ? '-' : '') + body;
		else out += (c.sign() < 0 ? ' - ' : ' + ') + body;
	});
	return out === '' ? '0' : out;
}

function descSympy(p: Desc): string {
	const n = p.length - 1;
	const terms = p
		.map((c, i) => ({ c, deg: n - i }))
		.filter(({ c }) => !c.isZero())
		.map(({ c, deg }) => (deg === 0 ? `(${c.toString()})` : `(${c.toString()})*x**${deg}`));
	return terms.length === 0 ? '0' : terms.join(' + ');
}

/** A number inside a sum or as a factor: negative numbers in parentheses. */
function paren(r: Rational): string {
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

/** x - a, with the sign folded: "x - 3", "x + 2", "x - \frac{1}{2}". */
function binomial(a: Rational): string {
	return a.sign() > 0 ? `x - ${a.toLatex()}` : `x + ${a.abs().toLatex()}`;
}

function wrapped(s: string): string {
	return s.includes('\\frac') ? `\\left(${s}\\right)` : `(${s})`;
}

/** "3", or "x + 2 = x - (-2)" style explanation of a. */
function aStep(a: Rational): string {
	if (a.sign() > 0) return `${t('Il divisore è ')}${binomial(a)}${t(', quindi ')}a = ${a.toLatex()}`;
	return `${t('Il divisore è ')}${binomial(a)} = x - ${paren(a)}${t(', quindi ')}a = ${a.toLatex()}`;
}

function tableLatex(p: Desc, a: Rational): string {
	const { bottom, products } = ruffini(p, a);
	const inner = 'r'.repeat(p.length - 1);
	const top = ['', ...p.map((c) => c.toLatex())].join(' & ');
	const mid = [a.toLatex(), '', ...products.map((c) => c.toLatex())].join(' & ');
	const bot = ['', ...bottom.map((c) => c.toLatex())].join(' & ');
	return `\\begin{array}{r|${inner}|r} ${top} \\\\ ${mid} \\\\ \\hline ${bot} \\end{array}`;
}

/** "P(3) = 54 - 45 + 3 + 7 = 19": the value term by term (zero terms left out). */
function valueStep(p: Desc, a: Rational): string {
	const n = p.length - 1;
	const terms = p.map((c, i) => c.mul(pow(a, n - i))).filter((c) => !c.isZero());
	const sum = terms
		.map((c, i) => (i === 0 ? c.toLatex() : c.sign() < 0 ? ` - ${c.abs().toLatex()}` : ` + ${c.toLatex()}`))
		.join('');
	const v = evalAt(p, a);
	return terms.length > 1 ? `P${wrapped(a.toLatex())} = ${sum} = ${v.toLatex()}` : `P${wrapped(a.toLatex())} = ${v.toLatex()}`;
}

/** "P(-1) = (-1)^5 - 3 \cdot (-1)^3 + 2 \cdot (-1) - 1": the substitution, before the arithmetic. */
function substitutionLatex(p: Desc, a: Rational, kSlot = -1): string {
	const n = p.length - 1;
	const pa = paren(a);
	let out = '';
	p.forEach((c, i) => {
		const deg = n - i;
		const isK = i === kSlot;
		if (!isK && c.isZero()) return;
		const power = deg === 0 ? '' : deg === 1 ? pa : `${pa}^${deg}`;
		let body: string;
		let neg = false;
		if (isK) body = deg === 0 ? 'k' : `k \\cdot ${power}`;
		else {
			neg = c.sign() < 0;
			const abs = c.abs();
			body = deg === 0 ? abs.toLatex() : abs.isOne() ? power : `${abs.toLatex()} \\cdot ${power}`;
		}
		if (out === '') out = (neg ? '-' : '') + body;
		else out += (neg ? ' - ' : ' + ') + body;
	});
	return out;
}

// ---------------------------------------------------------------------------
// Levels 1-4: division with the table

interface Division {
	P: Desc;
	a: Rational;
}

/**
 * Quotient chosen first, from the top. `zeros` are the positions (degrees) of the dividend that
 * must be missing; `den` > 1 asks every quotient coefficient but the last to be a multiple of den,
 * so that with a = n/den the dividend has integer coefficients.
 */
function buildDivision(rng: Rng, a: Rational, n: number, zeros: number[], exact: boolean, lead: number, den = 1): Division | null {
	// quotient coefficients by degree: qd[k] for x^k, k = 0..n-1
	const qd: Rational[] = new Array(n).fill(ZERO);
	qd[n - 1] = q(lead);
	for (let k = n - 1; k >= 1; k--) {
		// dividend coefficient of x^k is qd[k-1] - a qd[k]
		if (zeros.includes(k)) qd[k - 1] = a.mul(qd[k]);
		else {
			const step = k - 1 >= 1 ? den : 1;
			let c: Rational;
			let guard = 0;
			do {
				c = q(step * rng.int(Math.ceil(-6 / step), Math.floor(6 / step)));
				if (++guard > 50) return null;
			} while (c.equals(a.mul(qd[k])));
			qd[k - 1] = c;
		}
		if (!qd[k - 1].isInteger()) return null;
	}
	// constant term of the dividend: p0 = R - a q0
	let p0: Rational;
	if (zeros.includes(0)) p0 = ZERO;
	else if (exact) {
		p0 = a.mul(qd[0]).neg();
		if (p0.isZero()) return null;
	} else p0 = q(nonZero(rng, -9, 9));
	const coeffs: Desc = [qd[n - 1]];
	for (let k = n - 1; k >= 1; k--) coeffs.push(qd[k - 1].sub(a.mul(qd[k])));
	coeffs.push(p0);
	if (!coeffs.every((c) => c.isInteger())) return null;
	return { P: coeffs, a };
}

const FRACTIONS = [q(1, 2), q(-1, 2), q(1, 3), q(-1, 3), q(2, 3), q(-2, 3), q(3, 2), q(-3, 2)];

function buildLevelDivision(rng: Rng, level: number): Division | null {
	const exact = rng.next() < 0.25;
	switch (level) {
		case 1: {
			const n = rng.next() < 0.3 ? 2 : 3;
			return buildDivision(rng, q(rng.int(1, 5)), n, [], exact, rng.pick([1, 1, 2, 3]));
		}
		case 2: {
			const n = rng.next() < 0.5 ? 3 : 4;
			const k = n === 4 && rng.next() < 0.35 ? 2 : 1;
			const pool = shuffle(rng, Array.from({ length: n - 1 }, (_, i) => i + 1)).slice(0, k);
			if (rng.next() < 0.15) pool[0] = 0; // missing constant term, sometimes
			return buildDivision(rng, q(rng.int(1, 4)), n, pool, exact, rng.pick([1, 1, 2]));
		}
		case 3: {
			const n = rng.next() < 0.5 ? 3 : 4;
			const k = rng.next() < 0.5 ? 0 : 1;
			const zeros = shuffle(rng, Array.from({ length: n - 1 }, (_, i) => i + 1)).slice(0, k);
			return buildDivision(rng, q(-rng.int(1, 5)), n, zeros, exact, rng.pick([1, 1, 2, 3]));
		}
		case 4: {
			const a = rng.pick(FRACTIONS);
			const n = rng.next() < 0.35 ? 2 : 3;
			const d = a.den;
			return buildDivision(rng, a, n, [], exact && rng.next() < 0.6, d * rng.pick([1, 1, 2]), d);
		}
	}
	throw new Error(`${ID}: level ${level} is not a division`);
}

interface Pair {
	Q: Desc;
	R: Rational;
}

const pairKey = (p: Pair) => `${descSympy(p.Q)}|${p.R.toString()}`;

/**
 * Rough width in px of a formula at 16 px (KaTeX metrics), with a 10% margin: digits 8 px, letters 9.2,
 * a single-digit exponent 5.6, "+" and "-" with their spaces 19.6, "=" 21.3, a fraction its wider line.
 */
function texWidth(latex: string): number {
	let w = 0;
	const s = latex
		.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a: string, b: string) => '0'.repeat(Math.max(a.length, b.length)))
		.replace(/\^(\d)/g, () => {
			w += 5.6;
			return '';
		});
	for (const c of s) {
		if (c === ' ') continue;
		if (c === '+' || c === '-') w += 19.6;
		else if (c === '=') w += 21.3;
		else if (c === '(' || c === ')') w += 6.2;
		else if (/\d/.test(c)) w += 8;
		else if (c === ',') w += 4.4;
		else w += c === 'Q' ? 12.6 : 9.2;
	}
	return w * 1.1;
}

/** Up to 252 px fit in the answer button; beyond this estimate the quotient is broken. */
const LINE_PX = 240;

/** "Q(x) = ..." on one line, or on two, broken before the + or - nearest to the middle. */
function quotientLines(Q: Desc): string[] {
	const line = `Q(x) = ${descLatex(Q)}`;
	if (texWidth(line) <= LINE_PX) return [line];
	const cuts = [...line.matchAll(/ [+-] /g)].map((m) => m.index!);
	// the last cut that leaves the first line within the limit
	const fit = cuts.filter((i) => texWidth(line.slice(0, i)) <= LINE_PX);
	const at = fit.length ? fit[fit.length - 1] : cuts[0];
	return [line.slice(0, at), `\\quad ${line.slice(at + 1)}`];
}

function pairOption(p: Pair): ChoiceOption {
	// always at least two lines, Q(x) and R: a quotient of degree 3 or 4 and its remainder do not fit the
	// 252 px of the answer button on one line, and the four options of a level keep the same shape
	const lines = [...quotientLines(p.Q), `R = ${p.R.toLatex()}`];
	return { latex: `\\begin{gathered} ${lines.join(' \\\\ ')} \\end{gathered}`, values: [descSympy(p.Q), p.R.toString()] };
}

/** Dividend with the zero coefficients dropped, as a student who forgets them would write it. */
const dropZeros = (p: Desc): Desc => p.filter((c) => !c.isZero());

function divisionDistractors(d: Division): Pair[] {
	const { P, a } = d;
	const right = divide(P, a);
	const out: Pair[] = [];
	out.push(divide(P, a.neg())); // sign of a (the ad-warning "Il segno di a")
	if (P.some((c) => c.isZero()) && dropZeros(P).length >= 2) out.push(divide(dropZeros(P), a)); // missing terms not written
	if (!right.R.isZero()) out.push({ Q: right.Q, R: right.R.neg() }); // remainder with the sign changed
	out.push({ Q: [...right.Q, ZERO], R: right.R }); // quotient with the degree of the dividend
	return out;
}

function divisionFallback(d: Division, i: number): Pair {
	const { Q, R } = divide(d.P, d.a);
	if (i % 2 === 1) return { Q, R: R.add(q(Math.ceil(i / 2))) };
	const Q2 = [...Q];
	Q2[Q2.length - 1] = Q2[Q2.length - 1].sub(q(i / 2));
	return { Q: Q2, R };
}

function pairChoice(rng: Rng, correct: Pair, cands: Pair[], fallback: (i: number) => Pair): ChoiceAnswer {
	const seen = new Set([pairKey(correct)]);
	const opts: Pair[] = [correct];
	const add = (p: Pair) => {
		// a quotient must keep a nonzero leading coefficient
		if (opts.length < 4 && p.Q.length > 0 && !p.Q[0].isZero() && !seen.has(pairKey(p))) {
			seen.add(pairKey(p));
			opts.push(p);
		}
	};
	cands.forEach(add);
	for (let i = 1; opts.length < 4 && i < 100; i++) add(fallback(i));
	if (opts.length < 4) throw new Error(`${ID}: not enough options`);
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => pairOption(opts[i])), correct: order.indexOf(0) };
}

function missingStep(P: Desc): string {
	const n = P.length - 1;
	const missing = P.map((c, i) => ({ c, deg: n - i })).filter(({ c }) => c.isZero());
	const list = P.map((c) => c.toLatex()).join(',\\ ');
	if (missing.length === 0) return `${t('Coefficienti del dividendo: ')}${list}`;
	const names = missing.map(({ deg }) => (deg === 0 ? t('il termine noto') : `${t('il termine in ')}${xPow(deg)}`));
	const joined = names.length === 1 ? names[0] : `${names[0]}${t(' e ')}${names[1]}`;
	return `${t('Manca ')}${joined}${t(', quindi si scrive ')}0${t(': i coefficienti sono ')}${list}`;
}

function divisionSample(rng: Rng, level: number, d: Division): Sample {
	const { P, a } = d;
	const { Q, R } = divide(P, a);
	const answer = pairChoice(rng, { Q, R }, divisionDistractors(d), (i) => divisionFallback(d, i));
	const solution = `Q(x) = ${descLatex(Q)} \\qquad R = ${R.toLatex()}`;
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Dividi con la regola di Ruffini: trova il quoziente Q(x) e il resto R.',
		problem: `(${descLatex(P)}) : ${wrapped(binomial(a))}`,
		solution,
		steps: [
			missingStep(P),
			aStep(a),
			tableLatex(P, a),
			solution,
			`${t('Controllo con il teorema del resto: ')}${valueStep(P, a)}`,
		],
		answer,
		params: {
			case: R.isZero() ? 'esatta' : 'con resto',
			dividend: P.map((c) => c.toString()),
			a: a.toString(),
			quotient: Q.map((c) => c.toString()),
			remainder: R.toString(),
		},
	};
}

// ---------------------------------------------------------------------------
// Level 5: remainder theorem

interface Rest {
	P: Desc;
	a: Rational;
}

function buildRest(rng: Rng): Rest {
	const u = rng.next();
	const abs = u < 0.4 ? 1 : u < 0.8 ? 2 : 3;
	const a = q(rng.next() < 0.5 ? abs : -abs);
	const n = abs === 1 ? rng.int(4, 6) : abs === 2 ? rng.int(3, 4) : 3;
	const P: Desc = new Array(n + 1).fill(ZERO);
	P[0] = q(rng.pick([1, 1, 2, 3]) * (rng.next() < 0.15 ? -1 : 1));
	// a sparse polynomial for high degree (as in example 5), otherwise 3 or 4 terms
	const others = shuffle(
		rng,
		Array.from({ length: n }, (_, i) => i + 1),
	).slice(0, abs === 1 ? rng.int(2, 3) : rng.int(2, 3));
	for (const i of others) P[i] = q(nonZero(rng, -5, 5));
	return { P, a };
}

function numOption(r: Rational): ChoiceOption {
	return { latex: r.toLatex(), values: [r.toString()] };
}

function numChoice(rng: Rng, correct: Rational, cands: (Rational | null)[], fallback: (i: number) => Rational): ChoiceAnswer {
	const seen = new Set([correct.toString()]);
	const opts: Rational[] = [correct];
	const add = (r: Rational | null) => {
		if (r && opts.length < 4 && !seen.has(r.toString())) {
			seen.add(r.toString());
			opts.push(r);
		}
	};
	cands.forEach(add);
	for (let i = 1; opts.length < 4 && i < 100; i++) add(fallback(i));
	if (opts.length < 4) throw new Error(`${ID}: not enough options`);
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => numOption(opts[i])), correct: order.indexOf(0) };
}

/** P(a) computed with (-m)^k read as -(m^k): the classic sign error on even powers. */
function evenPowerError(p: Desc, a: Rational): Rational | null {
	if (a.sign() >= 0) return null;
	const n = p.length - 1;
	return p.reduce((s, c, i) => {
		const deg = n - i;
		return s.add(c.mul(deg === 0 ? q(1) : pow(a.abs(), deg).neg()));
	}, ZERO);
}

function restSample(rng: Rng, r: Rest): Sample {
	const { P, a } = r;
	const R = evalAt(P, a);
	const cands = [evalAt(P, a.neg()), R.neg(), evenPowerError(P, a), P[P.length - 1], evalAt(P, q(1))];
	const answer: Sample['answer'] = { kind: 'number', value: R.toString() };
	const zero = a.toLatex();
	return {
		generatorId: ID,
		level: 5,
		seed: rng.seed,
		prompt: 'Trova il resto della divisione senza eseguirla.',
		problem: `(${descLatex(P)}) : ${wrapped(binomial(a))}`,
		solution: `R = ${R.toLatex()}`,
		steps: [
			a.sign() > 0
				? `${t('Per il teorema del resto il resto è ')}P(${zero})${t(', il valore nel numero che annulla ')}${binomial(a)}`
				: `${t('Il divisore è ')}${binomial(a)} = x - ${paren(a)}${t(', quindi il resto è ')}P(${zero})`,
			`P(${zero}) = ${substitutionLatex(P, a)}`,
			valueStep(P, a),
			`R = ${R.toLatex()}`,
		],
		answer,
		params: { case: a.sign() > 0 ? 'a positivo' : 'a negativo', dividend: P.map((c) => c.toString()), a: a.toString(), remainder: R.toString(), distractors: cands.filter(Boolean).map((c) => c!.toString()) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: Ruffini's theorem, which binomial divides P

interface Divisibility {
	P: Desc;
	r: Rational;
	zeros: Rational[]; // the numbers c of the four options x - c, in display order
}

function buildDivisibility(rng: Rng): Divisibility | null {
	const r = q(nonZero(rng, -3, 3));
	// P = (x - r)(l x^2 + b x + c)
	const l = rng.pick([1, 1, 1, 2]);
	const b = rng.int(-6, 6);
	const c = nonZero(rng, -6, 6);
	const P: Desc = [q(l), q(b).sub(r.mul(q(l))), q(c).sub(r.mul(q(b))), r.mul(q(c)).neg()];
	const s = q(rng.pick([1, 2, 3].filter((v) => v !== Math.abs(r.num))));
	const zeros = shuffle(rng, [r, r.neg(), s, s.neg()]);
	for (const z of zeros) if (!z.equals(r) && evalAt(P, z).isZero()) return null;
	return { P, r, zeros };
}

function divisibilitySample(rng: Rng, d: Divisibility): Sample {
	const { P, r, zeros } = d;
	const options: ChoiceOption[] = zeros.map((z) => ({ latex: binomial(z), values: [`x - (${z.toString()})`] }));
	const correct = zeros.findIndex((z) => z.equals(r));
	const { Q } = divide(P, r);
	return {
		generatorId: ID,
		level: 6,
		seed: rng.seed,
		prompt: 'Per quale di questi binomi il polinomio è divisibile?',
		problem: `P(x) = ${descLatex(P)}`,
		solution: `${binomial(r)}`,
		steps: [
			`${t('Per il teorema di Ruffini, ')}P(x)${t(' è divisibile per ')}x - a${t(' se e solo se ')}P(a) = 0`,
			...zeros.map((z) => `${binomial(z)}${t(': ')}${valueStep(P, z)}${evalAt(P, z).isZero() ? t(', divisibile') : t(', non divisibile')}`),
			`P(x) = ${wrapped(binomial(r))}${wrapped(descLatex(Q))}`,
		],
		answer: { kind: 'choice', options, correct },
		params: { case: r.sign() > 0 ? 'zero positivo' : 'zero negativo', polynomial: P.map((c) => c.toString()), zero: r.toString(), options: zeros.map((z) => z.toString()) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the parameter k

interface Param {
	P: Desc; // coefficient at kSlot is the value of k
	kSlot: number; // index in the descending list (never 0: the leading coefficient is a number)
	a: Rational;
	k: Rational;
}

function buildParam(rng: Rng): Param | null {
	const abs = rng.pick([1, 1, 2, 2, 3]);
	const a = q(rng.next() < 0.5 ? abs : -abs);
	const n = 3;
	const kDeg = rng.pick([2, 2, 1, 1, 0]);
	const kSlot = n - kDeg;
	const P: Desc = [q(rng.pick([1, 1, 2])), q(nonZero(rng, -6, 6)), q(nonZero(rng, -6, 6)), q(nonZero(rng, -9, 9))];
	if (kDeg === 0) {
		// the constant term is k: it is what makes P(a) zero
		P[kSlot] = ZERO;
		P[kSlot] = evalAt(P, a).neg();
	} else {
		P[kSlot] = q(nonZero(rng, -6, 6));
		P[n] = ZERO;
		P[n] = evalAt(P, a).neg();
		if (P[n].isZero()) return null;
	}
	return { P, kSlot, a, k: P[kSlot] };
}

function paramLatex(p: Param): string {
	const n = p.P.length - 1;
	let out = '';
	p.P.forEach((c, i) => {
		const deg = n - i;
		if (i === p.kSlot) {
			out += ` + k${xPow(deg)}`;
			return;
		}
		if (c.isZero()) return;
		const abs = c.abs();
		const body = deg === 0 ? abs.toLatex() : (abs.isOne() ? '' : abs.toLatex()) + xPow(deg);
		if (out === '') out = (c.sign() < 0 ? '-' : '') + body;
		else out += (c.sign() < 0 ? ' - ' : ' + ') + body;
	});
	return out;
}

/** P(a) as c k + d. */
function linearIn(p: Param, at: Rational): { c: Rational; d: Rational } {
	const n = p.P.length - 1;
	const c = pow(at, n - p.kSlot);
	const rest = [...p.P];
	rest[p.kSlot] = ZERO;
	return { c, d: evalAt(rest, at) };
}

function linearLatex(c: Rational, d: Rational): string {
	const kPart = c.isOne() ? 'k' : c.equals(q(-1)) ? '-k' : `${c.toLatex()}k`;
	if (d.isZero()) return kPart;
	return d.sign() < 0 ? `${kPart} - ${d.abs().toLatex()}` : `${kPart} + ${d.toLatex()}`;
}

function paramSample(rng: Rng, p: Param): Sample {
	const { a, k } = p;
	const { c, d } = linearIn(p, a);
	const wrong = linearIn(p, a.neg()); // the sign of the zero confused
	const cands = [wrong.d.neg().div(wrong.c), k.neg(), c.isOne() ? null : d.neg()]; // zero with the wrong sign, sign of k, power of a forgotten
	const zero = a.toLatex();
	return {
		generatorId: ID,
		level: 7,
		seed: rng.seed,
		prompt: 'Trova il valore di k per cui la divisione è esatta.',
		problem: `(${paramLatex(p)}) : ${wrapped(binomial(a))}`,
		solution: `k = ${k.toLatex()}`,
		steps: [
			`${t('Per il teorema di Ruffini la divisione è esatta se e solo se ')}P(${zero}) = 0`,
			`P(${zero}) = ${substitutionLatex(p.P, a, p.kSlot)} = ${linearLatex(c, d)}`,
			`${linearLatex(c, d)} = 0 \\quad\\Rightarrow\\quad k = ${k.toLatex()}`,
		],
		answer: { kind: 'number', value: k.toString() },
		params: {
			case: p.kSlot === 3 ? 'k termine noto' : 'k coefficiente',
			polynomial: p.P.map((x, i) => (i === p.kSlot ? 'k' : x.toString())),
			a: a.toString(),
			k: k.toString(),
			distractors: cands.filter(Boolean).map((x) => x!.toString()),
		},
	};
}

// ---------------------------------------------------------------------------
// Checks

const intsIn = (xs: Rational[], lim: number) => xs.every((c) => c.isInteger() && Math.abs(c.num) <= lim);

function readDesc(x: unknown): Desc | null {
	if (!Array.isArray(x)) return null;
	try {
		return x.map((s) => Rational.parse(String(s)));
	} catch {
		return null;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	v.push(...forbidden(sample.problem));
	if (lvl >= 1 && lvl <= 4) {
		const P = readDesc(p.dividend);
		if (!P) return ['params non validi'];
		const a = Rational.parse(String(p.a));
		const { Q, R } = divide(P, a);
		const ans = sample.answer;
		if (ans.kind !== 'choice') return ['la risposta deve essere a scelta'];
		const right = ans.options[ans.correct];
		if (right.values[0] !== descSympy(Q) || right.values[1] !== R.toString()) v.push('opzione corretta diversa da quoziente e resto');
		if (new Set(ans.options.map((o) => o.values.join('|'))).size !== 4) v.push('opzioni non distinte');
		for (const o of ans.options) v.push(...forbidden(o.latex));
		const n = P.length - 1;
		const zeros = P.filter((c) => c.isZero()).length;
		if (!intsIn(P, 20)) v.push('coefficienti del dividendo oltre 20');
		if (!Q.every((c) => c.isInteger() && Math.abs(c.num) <= 30)) v.push('quoziente non intero o troppo grande');
		if (Math.abs(R.num) > 60) v.push('resto troppo grande');
		if (P[0].isZero()) v.push('coefficiente direttivo nullo');
		switch (lvl) {
			case 1:
				if (!(a.isInteger() && a.num >= 1 && a.num <= 5) || zeros > 0 || n < 2 || n > 3) v.push('livello 1: a intero da 1 a 5, dividendo completo di grado 2 o 3');
				break;
			case 2:
				if (!(a.isInteger() && a.num >= 1 && a.num <= 4) || zeros === 0 || n < 3 || n > 4 || zeros > 2) v.push('livello 2: a intero positivo, dividendo incompleto di grado 3 o 4');
				break;
			case 3:
				if (!(a.isInteger() && a.num <= -1 && a.num >= -5) || n < 3 || n > 4 || zeros > 1 || P[n].isZero()) v.push('livello 3: a intero negativo, grado 3 o 4');
				break;
			case 4:
				if (a.isInteger() || a.den > 3 || Math.abs(a.num) > 3 || zeros > 0 || n < 2 || n > 3) v.push('livello 4: a frazionario, dividendo completo');
				break;
		}
	} else if (lvl === 5) {
		const P = readDesc(p.dividend);
		if (!P) return ['params non validi'];
		const a = Rational.parse(String(p.a));
		const R = evalAt(P, a);
		if (sample.answer.kind !== 'number' || sample.answer.value !== R.toString()) v.push('risposta diversa da P(a)');
		if (!a.isInteger() || a.num === 0 || Math.abs(a.num) > 3) v.push('a intero da -3 a 3');
		if (P.length - 1 < 3 || !intsIn(P, 5)) v.push('grado almeno 3, coefficienti fino a 5');
		if (Math.abs(R.num) > 99) v.push('resto oltre 99');
		if (P.filter((c) => !c.isZero()).length < 3) v.push('meno di tre termini');
	} else if (lvl === 6) {
		const P = readDesc(p.polynomial);
		if (!P) return ['params non validi'];
		const ans = sample.answer;
		if (ans.kind !== 'choice') return ['la risposta deve essere a scelta'];
		const zs = (p.options as string[]).map((s) => Rational.parse(s));
		const good = zs.map((z, i) => (evalAt(P, z).isZero() ? i : -1)).filter((i) => i >= 0);
		if (good.length !== 1 || good[0] !== ans.correct) v.push('non esattamente un binomio divisore');
		if (new Set(zs.map((z) => z.toString())).size !== 4) v.push('opzioni non distinte');
		if (!intsIn(P, 30) || P.length !== 4) v.push('polinomio di terzo grado, coefficienti fino a 30');
	} else if (lvl === 7) {
		const a = Rational.parse(String(p.a));
		const k = Rational.parse(String(p.k));
		const poly = p.polynomial as string[];
		const slot = poly.indexOf('k');
		const P = poly.map((s, i) => (i === slot ? k : Rational.parse(s)));
		if (slot < 1 || !evalAt(P, a).isZero()) v.push('con questo k la divisione non è esatta');
		if (sample.answer.kind !== 'number' || sample.answer.value !== k.toString()) v.push('risposta diversa da k');
		if (!k.isInteger() || k.isZero() || Math.abs(k.num) > 30) v.push('k intero non nullo fino a 30');
		if (!intsIn(P, 30) || P.some((c) => c.isZero())) v.push('coefficienti non nulli fino a 30');
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	const right = Rational.parse(String((sample.answer as { value: string }).value));
	const cands = (p.distractors as string[]).map((s) => Rational.parse(s));
	return numChoice(rng, right, cands, (i) => right.add(q(i % 2 === 1 ? Math.ceil(i / 2) : -i / 2)));
}

export const polinomiRuffini: Generator = {
	id: ID,
	title: 'Regola di Ruffini e teorema del resto',
	levels: {
		1: { label: 'Ruffini con a intero positivo', constraints: ['divisore x - a con a da 1 a 5', 'dividendo completo di grado 2 o 3', 'risposta: la coppia quoziente e resto, tra quattro'] },
		2: { label: 'Dividendo incompleto', constraints: ['a da 1 a 4', 'dividendo di grado 3 o 4 con uno o due termini mancanti'] },
		3: { label: 'Divisore x + b (a negativo)', constraints: ['a da -5 a -1', 'dividendo di grado 3 o 4, completo o con un termine mancante'] },
		4: { label: 'a frazionario', constraints: ['a tra ±1/2, ±1/3, ±2/3, ±3/2', 'dividendo completo a coefficienti interi, quoziente intero', 'il resto può essere una frazione'] },
		5: { label: 'Teorema del resto', constraints: ['il resto come numero, senza dividere', 'a intero da -3 a 3, grado fino a 6 con a = ±1'] },
		6: { label: 'Teorema di Ruffini: divisibilità', constraints: ['quale tra x - r, x + r, x - s, x + s divide il polinomio', 'uno solo è un divisore'] },
		7: { label: 'Il parametro k', constraints: ['il valore di k per cui la divisione per x - a è esatta', 'k intero'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let sample: Sample | null = null;
			if (level >= 1 && level <= 4) {
				const d = buildLevelDivision(rng, level);
				if (d) sample = divisionSample(rng, level, d);
			} else if (level === 5) sample = restSample(rng, buildRest(rng));
			else if (level === 6) {
				const d = buildDivisibility(rng);
				if (d) sample = divisibilitySample(rng, d);
			} else if (level === 7) {
				const d = buildParam(rng);
				if (d) sample = paramSample(rng, d);
			} else throw new Error(`${ID}: unknown level ${level}`);
			if (sample && check(sample).length === 0) {
				delete sample.choice;
				return sample;
			}
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default polinomiRuffini;
