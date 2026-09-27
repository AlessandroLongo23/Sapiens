/**
 * Relazioni tra soluzioni e coefficienti. Spec: specs/exercises/equazioni-secondo-grado-relazioni.md
 *
 * Seven levels in the order of lesson 77: sum and product read on the coefficients (with the
 * discriminant checked first), the other solution from a known one, the equation with given
 * solutions, two numbers with given sum and product, the factorisation a(x - x1)(x - x2), the
 * signs of the solutions without solving (Descartes), symmetric expressions of the solutions.
 *
 * Built backwards: the solutions (or the sum and the product) are chosen first and the equation is
 * expanded from them, so every number is small and exact. Irrational solutions are always m ± √n,
 * or come from small coefficients at levels 1 and 7, where the point is not to compute them.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { Surd } from '../surd';
import { type Poly, joinSigned, paren, poly, polyMul, polyPad, polyScale, polyToLatex, polyToStrings } from '../latex';
import { assembleChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'equazioni-secondo-grado-relazioni';
const MAX_COEF = 100;

/** Patterns that must never appear in a problem (as in equazioni-secondo-grado). */
export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

// ---------------------------------------------------------------------------
// Small helpers

const t = (s: string) => `\\text{${s}}`;
const R = (s: unknown): Rational => Rational.parse(String(s));

function nonZeroInt(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

/** A rational p/q with q in `dens` and 1 <= |p| <= maxNum, reduced. */
function randomRational(rng: Rng, maxNum: number, dens: number[]): Rational {
	return q(nonZeroInt(rng, -maxNum, maxNum), rng.pick(dens));
}

/** (den·x − num): integer coefficients, root num/den. */
const linear = (r: Rational): Poly => poly(-r.num, r.den);

const coeffs = (p: Poly): [Rational, Rational, Rational] => {
	const [c, b, a] = polyPad(p, 3);
	return [a, b, c];
};

const content = (p: Poly): number => p.reduce((g, c) => gcd(g, c.num), 0);

/** Integer coefficients, |coefficient| <= MAX_COEF. */
const smallInts = (p: Poly): boolean => p.every((c) => c.isInteger() && Math.abs(c.num) <= MAX_COEF);

/** Number with parentheses when it is negative or a fraction: for powers, (−2)^2, (3/2)^2. */
function pw(r: Rational): string {
	if (r.isInteger() && r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

/** Discriminant of an integer trinomial. */
const deltaOf = (p: Poly): Rational => {
	const [a, b, c] = coeffs(p);
	return b.mul(b).sub(q(4).mul(a).mul(c));
};

/** Real roots of a trinomial with integer coefficients, sorted; one element for a double root. */
function rootsOf(p: Poly): Surd[] {
	const [a, b] = coeffs(p);
	const D = deltaOf(p).num;
	if (D < 0) return [];
	if (D === 0) return [Surd.of(-b.num, 0, 1, 2 * a.num)];
	const rs = [Surd.of(-b.num, -1, D, 2 * a.num), Surd.of(-b.num, 1, D, 2 * a.num)];
	return rs.sort((x, y) => x.compare(y));
}

const sumOf = (p: Poly): Rational => {
	const [a, b] = coeffs(p);
	return b.neg().div(a);
};
const prodOf = (p: Poly): Rational => {
	const [a, , c] = coeffs(p);
	return c.div(a);
};

/** "Δ = b^2 − 4ac = … = D", with the substitution written out. */
function deltaStep(p: Poly): string {
	const [a, b, c] = coeffs(p);
	return `\\Delta = b^2 - 4ac = ${pw(b)}^2 - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${deltaOf(p).toLatex()}`;
}

const coeffStep = (p: Poly): string => {
	const [a, b, c] = coeffs(p);
	return `${t('I coefficienti sono ')} a = ${a.toLatex()},\\ b = ${b.toLatex()},\\ c = ${c.toLatex()}`;
};

/** s = −b/a, written as in the lesson. */
function sumStep(p: Poly): string {
	const [a, b] = coeffs(p);
	const s = sumOf(p).toLatex();
	return a.isOne() ? `s = -b = ${s}` : `s = -\\frac{b}{a} = -\\frac{${b.toLatex()}}{${a.toLatex()}} = ${s}`;
}

function prodStep(p: Poly): string {
	const [a, , c] = coeffs(p);
	const pr = prodOf(p).toLatex();
	if (a.isOne()) return `p = c = ${pr}`;
	const raw = `\\frac{${c.toLatex()}}{${a.toLatex()}}`;
	return raw === pr ? `p = \\frac{c}{a} = ${pr}` : `p = \\frac{c}{a} = ${raw} = ${pr}`;
}

/** Local shuffle of a correct option and its distractors; null if fewer than 4 distinct. */
function choose(rng: Rng, correct: ChoiceOption, distractors: (ChoiceOption | null)[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, distractors, 4);
	if (!ch) throw new Error(`${ID}: not enough distractors for ${correct.latex}`);
	return ch;
}

/** A number option; null when the number is not small enough to be a believable answer. */
function numberOption(r: Rational): ChoiceOption | null {
	if (r.den > 100 || Math.abs(r.num) > 2000) return null;
	return { latex: r.toLatex(), values: [r.toString()] };
}

/** Wrong values first, then values near the right one. */
function numberDistractors(value: Rational, mistakes: Rational[]): (ChoiceOption | null)[] {
	const out = mistakes.filter((m) => !m.equals(value)).map(numberOption);
	for (let d = 1; d <= 20; d++) out.push(numberOption(value.add(q(d))), numberOption(value.sub(q(d))));
	return out;
}

// ---------------------------------------------------------------------------
// Level 1: sum and product from the coefficients

type L1Case = 'reali' | 'delta<0';

function sumProductOption(s: Rational | null, p: Rational | null): ChoiceOption {
	if (s === null || p === null) return { latex: t('Nessuna soluzione reale'), values: ['nessuna'] };
	return { latex: `s = ${s.toLatex()},\\ p = ${p.toLatex()}`, values: [s.toString(), p.toString()] };
}

function level1(rng: Rng): Sample {
	const kind: L1Case = rng.next() < 0.2 ? 'delta<0' : 'reali';
	let P: Poly;
	for (;;) {
		const a = rng.pick([1, 1, 2, 2, 3, 4, 5]);
		const b = nonZeroInt(rng, -10, 10);
		const c = nonZeroInt(rng, -10, 10);
		P = poly(c, b, a);
		const D = deltaOf(P).num;
		if (content(P) !== 1) continue;
		if (kind === 'reali' ? D >= 0 : D < 0) break;
	}
	const [a, b, c] = coeffs(P);
	const s = sumOf(P);
	const p = prodOf(P);
	const D = deltaOf(P);
	const steps = [coeffStep(P), `${t('Prima controlla che le soluzioni esistano: ')} ${deltaStep(P)}`];
	let solution: string;
	let correct: ChoiceOption;
	let distractors: ChoiceOption[];
	const bOverA = b.div(a);
	const cOverA = c.div(a);
	if (kind === 'reali') {
		steps.push(`\\Delta ${D.isZero() ? '= 0' : '> 0'}${t(': le soluzioni esistono, e somma e prodotto si leggono sui coefficienti')}`);
		steps.push(sumStep(P), prodStep(P));
		solution = `s = ${s.toLatex()}, \\quad p = ${p.toLatex()}`;
		correct = sumProductOption(s, p);
		// the sign of the sum not changed; no solution; the sign changed on the product too; s and p swapped
		distractors = [
			sumProductOption(bOverA, cOverA),
			sumProductOption(null, null),
			sumProductOption(s, cOverA.neg()),
			sumProductOption(bOverA, cOverA.neg()),
			sumProductOption(p, s),
		];
	} else {
		steps.push(`\\Delta < 0${t(': l\'equazione non ha soluzioni reali, quindi non ci sono né una somma né un prodotto delle soluzioni')}`);
		solution = t('Nessuna soluzione reale: somma e prodotto non esistono');
		correct = sumProductOption(null, null);
		// −b/a and c/a computed anyway (the lesson's warning), and the same with the sign mistakes
		distractors = [sumProductOption(s, p), sumProductOption(bOverA, cOverA), sumProductOption(s, cOverA.neg()), sumProductOption(bOverA, cOverA.neg())];
	}
	const answer = choose(rng, correct, distractors);
	return {
		generatorId: ID,
		level: 1,
		seed: rng.seed,
		prompt: "Trova la somma s e il prodotto p delle soluzioni, senza risolvere l'equazione.",
		problem: `${polyToLatex(P)} = 0`,
		solution,
		steps,
		answer,
		params: { coeffs: polyToStrings(P), delta: D.toString(), case: kind, ...(kind === 'reali' ? { s: s.toString(), p: p.toString() } : {}) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the other solution from a known one

/** a·x0^2 + b·x0 + c with x0 substituted, as a line of the check. */
function substitution(P: Poly, x0: Rational): string {
	const [a, b, c] = coeffs(P);
	const sq = `${pw(x0)}^2`;
	let out = a.isOne() ? sq : `${a.toLatex()} \\cdot ${sq}`;
	const bx = b.abs().isOne() ? paren(x0) : `${b.abs().toLatex()} \\cdot ${paren(x0)}`;
	out += ` ${b.sign() < 0 ? '-' : '+'} ${bx}`;
	out = joinSigned(out, c);
	return `${out} = 0`;
}

function level2(rng: Rng): Sample {
	let P: Poly, x1: Rational, x2: Rational;
	for (;;) {
		x1 = q(nonZeroInt(rng, -6, 6));
		x2 = randomRational(rng, 9, [1, 1, 2, 3]);
		if (x2.equals(x1) || x2.add(x1).isZero()) continue;
		const k = rng.pick([1, 1, 1, 2]);
		P = polyScale(polyMul(linear(x1), linear(x2)), q(k));
		if (smallInts(P)) break;
	}
	const p = prodOf(P);
	const s = sumOf(P);
	const steps = [
		`${t('Verifica che ')} ${x1.toLatex()} ${t(' sia una soluzione: ')} ${substitution(P, x1)}`,
		`${t('Il prodotto delle soluzioni è ')} ${prodStep(P)}`,
		`${x1.toLatex()} \\cdot x_2 = ${p.toLatex()} \\ \\Rightarrow \\ x_2 = ${p.toLatex()} : ${paren(x1)} = ${x2.toLatex()}`,
		`${t('Controllo con la somma: ')} ${x1.toLatex()} + ${paren(x2)} = ${s.toLatex()}${t(', che è proprio ')} -\\frac{b}{a}`,
	];
	// sum with −b/a written b/a; product times x1 instead of divided; the opposite; p with the wrong sign
	const mistakes = [s.neg().sub(x1), p.mul(x1), x2.neg(), p.neg().div(x1), s.add(x1)];
	return {
		generatorId: ID,
		level: 2,
		seed: rng.seed,
		prompt: "Trova l'altra soluzione senza usare la formula risolutiva.",
		problem: textBlock(`Il numero $${x1.toLatex()}$ è una soluzione di`, 46, [`${polyToLatex(P)} = 0`]),
		solution: `${t("L'altra soluzione è ")} ${x2.toLatex()}`,
		steps,
		answer: { kind: 'number', value: x2.toString() },
		params: { coeffs: polyToStrings(P), given: x1.toString(), other: x2.toString(), mistakes: mistakes.map(String) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the equation with given solutions

type L3Case = 'intere' | 'frazionarie' | 'irrazionali';

/** ax^2 + bx + c with a > 0 and integer coefficients without common factors, from x^2 − sx + p. */
function primitive(s: Rational, p: Rational): Poly {
	const L = lcm(s.den, p.den);
	return poly(p.mul(q(L)), s.neg().mul(q(L)), L);
}

function equationOption(P: Poly): ChoiceOption {
	return { latex: `${polyToLatex(P)} = 0`, values: polyToStrings(P) };
}

function level3(rng: Rng): Sample {
	const u = rng.next();
	const kind: L3Case = u < 0.4 ? 'intere' : u < 0.75 ? 'frazionarie' : 'irrazionali';
	let x1: Surd, x2: Surd, s: Rational, p: Rational;
	let m = 0, n = 0;
	for (;;) {
		if (kind === 'irrazionali') {
			m = nonZeroInt(rng, -5, 5);
			n = rng.pick([2, 3, 5, 6, 7]);
			x1 = Surd.of(m, -1, n, 1);
			x2 = Surd.of(m, 1, n, 1);
			s = q(2 * m);
			p = q(m * m - n);
			if (p.isZero()) continue;
			break;
		}
		const r1 = kind === 'intere' ? q(nonZeroInt(rng, -9, 9)) : randomRational(rng, 7, [1, 2, 3, 4, 5]);
		const r2 = kind === 'intere' ? q(nonZeroInt(rng, -9, 9)) : randomRational(rng, 7, [1, 2, 3, 4, 5]);
		if (r1.equals(r2) || r1.add(r2).isZero()) continue;
		if (kind === 'frazionarie' && r1.isInteger() && r2.isInteger()) continue;
		s = r1.add(r2);
		p = r1.mul(r2);
		if (!smallInts(primitive(s, p))) continue;
		[x1, x2] = [Surd.rational(r1), Surd.rational(r2)].sort((a, b) => a.compare(b));
		break;
	}
	const P = primitive(s, p);
	const monic = poly(p, s.neg(), 1);
	const steps: string[] = [];
	if (kind === 'irrazionali') {
		steps.push(`${t('Nella somma i radicali si cancellano: ')} s = (${x1.toLatex()}) + (${x2.toLatex()}) = ${s.toLatex()}`);
		steps.push(`${t('Il prodotto è una differenza di quadrati: ')} p = (${x1.toLatex()})(${x2.toLatex()}) = ${m * m} - ${n} = ${p.toLatex()}`);
	} else {
		const [r1, r2] = [x1.toRational(), x2.toRational()];
		steps.push(`s = ${r1.toLatex()} + ${paren(r2)} = ${s.toLatex()}`);
		steps.push(`p = ${r1.toLatex()} \\cdot ${paren(r2)} = ${p.toLatex()}`);
	}
	steps.push(`${t("Sostituisci in ")} x^2 - sx + p = 0${t(': ')} ${polyToLatex(monic)} = 0`);
	const L = lcm(s.den, p.den);
	if (L > 1) steps.push(`${t('Moltiplica tutti i termini per ')} ${L}${t(', il denominatore comune: ')} ${polyToLatex(P)} = 0`);
	// the sign of s not changed; the sign of p changed; both; s and p exchanged; for m ± √n, (m − √n)(m + √n) = m^2 + n
	const distractors = [
		primitive(s.neg(), p),
		primitive(s, p.neg()),
		primitive(s.neg(), p.neg()),
		primitive(p, s),
		...(kind === 'irrazionali' ? [primitive(s, q(m * m + n))] : []),
	];
	const signs = shuffle(rng, distractors.slice(0, 3));
	const ordered = kind === 'irrazionali' ? [distractors[4], ...signs, distractors[3]] : [...signs, distractors[3]];
	const answer = choose(rng, equationOption(P), ordered.map(equationOption));
	return {
		generatorId: ID,
		level: 3,
		seed: rng.seed,
		prompt: "Scrivi l'equazione di secondo grado, con i coefficienti interi più piccoli, che ha queste soluzioni.",
		problem: `x_1 = ${x1.toLatex()} \\quad x_2 = ${x2.toLatex()}`,
		solution: `${polyToLatex(P)} = 0`,
		steps,
		answer,
		params: { roots: [x1.toString(), x2.toString()], case: kind, s: s.toString(), p: p.toString(), coeffs: polyToStrings(P) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: two numbers with given sum and product

type L4Case = 'numeri' | 'non esistono' | 'rettangolo';

/** "3 e 7", "5 cm e 12 cm", two lines when a value has a radical, or "Non esistono". */
function pairLatex(xs: Surd[], unit: boolean): string {
	if (xs.length === 0) return t('Non esistono');
	const u = unit ? `\\ \\text{cm}` : '';
	// Two radicals do not fit an answer button on one line: one value per line.
	if (xs.some((v) => !v.isRational())) return `\\begin{gathered} ${xs[0].toLatex()}${u} \\\\ \\text{e } ${xs[1].toLatex()}${u} \\end{gathered}`;
	return `${xs[0].toLatex()}${u} \\text{ e } ${xs[1].toLatex()}${u}`;
}

function pairOption(xs: Surd[], unit: boolean): ChoiceOption | null {
	if (xs.length === 1) return null;
	const sorted = [...xs].sort((a, b) => a.compare(b));
	return { latex: pairLatex(sorted, unit), values: sorted.map(String) };
}

/** Solutions of x^2 − sx + p = 0 as exact values. */
const pairFrom = (s: number, p: number): Surd[] => rootsOf(poly(p, -s, 1));

/** Integer pairs u < v with u·v = p and u + v ≠ s: the guess with the right product and the wrong sum. */
function divisorPairs(s: number, p: number): Surd[][] {
	const out: Surd[][] = [];
	for (let u = -Math.abs(p); u <= Math.abs(p); u++) {
		if (u === 0 || p % u !== 0) continue;
		const v = p / u;
		if (u < v && u + v !== s && Math.sign(u + v) === Math.sign(s)) out.push([Surd.rational(q(u)), Surd.rational(q(v))]);
	}
	return out.sort((a, b) => Math.abs(a[1].value() - a[0].value()) - Math.abs(b[1].value() - b[0].value()));
}

function level4(rng: Rng): Sample {
	const u = rng.next();
	const kind: L4Case = u < 0.45 ? 'numeri' : u < 0.65 ? 'non esistono' : 'rettangolo';
	let s = 0, p = 0, perimeter = 0;
	if (kind === 'numeri') {
		for (;;) {
			const a = nonZeroInt(rng, -12, 15), b = nonZeroInt(rng, -12, 15);
			if (a === b || a + b === 0) continue;
			[s, p] = [a + b, a * b];
			break;
		}
	} else if (kind === 'non esistono') {
		s = nonZeroInt(rng, -10, 10);
		p = Math.floor((s * s) / 4) + rng.int(1, 12);
	} else {
		for (;;) {
			const l = rng.int(2, 20), L = rng.int(2, 20);
			if (l >= L) continue;
			[s, p] = [l + L, l * L];
			break;
		}
		perimeter = 2 * s;
	}
	const unit = kind === 'rettangolo';
	const roots = pairFrom(s, p);
	const D = s * s - 4 * p;
	const eq = `${polyToLatex(poly(p, -s, 1))} = 0`;
	const steps: string[] = [];
	if (unit) steps.push(`${t('Il perimetro è il doppio della somma dei lati: i lati hanno somma ')} ${perimeter} : 2 = ${s} ${t(' e prodotto ')} ${p}`);
	steps.push(`${t(unit ? 'I lati sono le soluzioni di ' : 'I due numeri sono le soluzioni di ')} x^2 - sx + p = 0${t(': ')} ${eq}`);
	steps.push(`\\Delta = s^2 - 4p = ${pw(q(s))}^2 - 4 \\cdot ${paren(q(p))} = ${D}`);
	let solution: string;
	if (D < 0) {
		steps.push(`\\Delta < 0${t(': due numeri reali con questa somma e questo prodotto non esistono')}`);
		solution = t('Non esistono: il discriminante è negativo');
	} else {
		const k = Math.round(Math.sqrt(D));
		steps.push(`x_{1,2} = \\frac{${s} \\pm ${k}}{2}${t(', quindi ')} x_1 = ${roots[0].toLatex()},\\ x_2 = ${roots[1].toLatex()}`);
		const [a, b] = roots.map((r) => r.toRational());
		steps.push(`${t('Controllo: ')} ${a.toLatex()} + ${paren(b)} = ${s} ${t(' e ')} ${a.toLatex()} \\cdot ${paren(b)} = ${p}`);
		solution = unit ? `${t('I lati misurano ')} ${pairLatex(roots, true)}` : `${t('I due numeri sono ')} ${pairLatex(roots, false)}`;
	}
	const prose =
		kind === 'rettangolo'
			? `Un rettangolo ha perimetro $${perimeter}\\ \\text{cm}$ e area $${p}\\ \\text{cm}^2$. Quanto misurano i lati?`
			: `Trova, se esistono, due numeri reali che hanno somma $${s}$ e prodotto $${p}$.`;
	return {
		generatorId: ID,
		level: 4,
		seed: rng.seed,
		prompt: 'Risolvi il problema con la somma e il prodotto.',
		problem: textBlock(prose),
		solution,
		steps,
		answer: { kind: 'set', values: roots.map(String), latex: pairLatex(roots, unit) },
		params: { case: kind, s: String(s), p: String(p), ...(unit ? { perimeter: String(perimeter), area: String(p) } : {}), roots: roots.map(String) },
	};
}

function level4Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const s = Number(sample.params.s), p = Number(sample.params.p);
	const unit = sample.params.case === 'rettangolo';
	const roots = pairFrom(s, p);
	const cands: Surd[][] = [];
	if (roots.length) {
		// x^2 + sx + p (the sign of s), the perimeter used as the sum, a pair with the right product
		cands.push(roots.map((r) => r.neg()));
		if (unit) cands.push(pairFrom(2 * s, p));
		cands.push(...divisorPairs(s, p).slice(0, 2));
		cands.push([]);
		cands.push(pairFrom(s, -p));
	} else {
		// |Δ| used as if it were positive, a pair with the right product, the same with the sign of s changed
		const absD = 4 * p - s * s;
		const fake = [Surd.of(s, -1, absD, 2), Surd.of(s, 1, absD, 2)];
		cands.push(fake, ...divisorPairs(s, p).slice(0, 1), fake.map((r) => r.neg()), ...divisorPairs(s, p).slice(1, 3));
	}
	for (let d = 1; d < 10; d++) cands.push(roots.length ? roots.map((r) => r.add(q(d))) : [Surd.rational(q(d)), Surd.rational(q(d + 2))]);
	const ok = (xs: Surd[]) => xs.every((x) => x.d <= 4 && Math.abs(x.a) <= 200 && Math.abs(x.b) <= 20 && (!unit || x.value() > 0));
	const opts = cands.map((xs) => (xs.length === 0 ? { latex: t('Non esistono'), values: [] } : ok(xs) ? pairOption(xs, unit) : null));
	return choose(rng, roots.length ? pairOption(roots, unit)! : { latex: t('Non esistono'), values: [] }, opts);
}

// ---------------------------------------------------------------------------
// Level 5: factorisation with the solutions

type L5Case = 'frazionarie' | 'a negativo' | 'irrazionali' | 'delta=0' | 'irriducibile';

/** A factored form: lead · Π factor^pow, with its expansion (always a polynomial with rational coefficients). */
interface Factored {
	latex: string;
	sympy: string;
	expanded: Poly;
}

const IRR = 'irriducibile';

function leadLatex(c: Rational): string {
	if (c.isOne()) return '';
	if (c.equals(q(-1))) return '-';
	return c.isInteger() ? c.toLatex() : `${c.toLatex()} `;
}

/** (qx − p) with integer q > 0, p. */
const intFactor = (r: Rational) => ({
	latex: `(${polyToLatex(linear(r))})`,
	sympy: `(${r.den === 1 ? '' : `${r.den}*`}x${r.num < 0 ? '+' : '-'}${Math.abs(r.num)})`,
	poly: linear(r),
});

/** (x − r) with r rational, \left( \right) around a fraction. */
const rootFactor = (r: Rational) => {
	const body = polyToLatex(poly(r.neg(), 1));
	return {
		latex: r.isInteger() ? `(${body})` : `\\left(${body}\\right)`,
		sympy: `(x${r.sign() < 0 ? '+' : '-'}${r.abs().toString()})`,
		poly: poly(r.neg(), 1),
	};
};

/** (x − m ∓ k√n): the conjugate pair of factors, written in the order − then +. */
function radicalPair(m: number, k: number, n: number) {
	const root = `${k === 1 ? '' : k}\\sqrt{${n}}`;
	const rootS = `${k === 1 ? '' : `${k}*`}sqrt(${n})`;
	const head = polyToLatex(poly(-m, 1));
	const headS = m === 0 ? 'x' : `x${m < 0 ? '+' : '-'}${Math.abs(m)}`;
	return {
		latex: `(${head} - ${root})(${head} + ${root})`,
		sympy: `(${headS}-${rootS})*(${headS}+${rootS})`,
		poly: poly(m * m - k * k * n, -2 * m, 1),
	};
}

function product(lead: Rational, parts: { latex: string; sympy: string; poly: Poly }[], square = false): Factored {
	let expanded: Poly = poly(lead);
	for (const f of parts) expanded = polyMul(expanded, square ? polyMul(f.poly, f.poly) : f.poly);
	const body = parts.map((f) => f.latex).join('') + (square ? '^2' : '');
	const sym = parts.map((f) => f.sympy).join('*') + (square ? '**2' : '');
	const leadS = lead.isOne() ? '' : lead.equals(q(-1)) ? '-' : `${lead.toString().includes('/') ? `(${lead})` : lead}*`;
	return { latex: `${leadLatex(lead)}${body}`, sympy: `${leadS}${sym}`, expanded };
}

const samePoly = (a: Poly, b: Poly) => polyPad(a, 3).every((c, i) => c.equals(polyPad(b, 3)[i]));

function level5(rng: Rng): Sample {
	const u = rng.next();
	const kind: L5Case = u < 0.3 ? 'frazionarie' : u < 0.5 ? 'a negativo' : u < 0.7 ? 'irrazionali' : u < 0.85 ? 'delta=0' : 'irriducibile';
	let P: Poly, answer: Factored | null = null;
	const extra: Record<string, unknown> = {};
	const wrong: Factored[] = [];
	const steps: string[] = [];
	for (;;) {
		wrong.length = 0;
		if (kind === 'frazionarie' || kind === 'a negativo') {
			const r1 = randomRational(rng, 7, kind === 'frazionarie' ? [1, 2, 3, 4] : [1, 1, 2, 3]);
			const r2 = randomRational(rng, 7, kind === 'frazionarie' ? [1, 2, 3, 4] : [1, 1, 2, 3]);
			if (r1.equals(r2) || r1.add(r2).isZero()) continue;
			if (kind === 'frazionarie' && r1.isInteger() && r2.isInteger()) continue;
			const [x1, x2] = [r1, r2].sort((a, b) => a.compare(b));
			const sign = kind === 'a negativo' ? -1 : 1;
			const a = sign * x1.den * x2.den;
			if (Math.abs(a) < 2) continue;
			P = polyScale(polyMul(linear(x1), linear(x2)), q(sign));
			if (!smallInts(P)) continue;
			answer = product(q(sign), [intFactor(x1), intFactor(x2)]);
			// a forgotten; the signs in the parentheses changed; for a < 0, 3 in front instead of −3 (the lesson's warning)
			wrong.push(product(q(1), [rootFactor(x1), rootFactor(x2)]));
			wrong.push(product(q(sign), [intFactor(x1.neg()), intFactor(x2.neg())]));
			if (sign < 0) wrong.push(product(q(1), [intFactor(x1), intFactor(x2)]));
			wrong.push(product(q(sign), [intFactor(q(x1.num, x2.den)), intFactor(q(x2.num, x1.den))]));
			Object.assign(extra, { roots: [x1.toString(), x2.toString()] });
			break;
		}
		if (kind === 'irrazionali') {
			const m = nonZeroInt(rng, -5, 5);
			const n = rng.pick([2, 3, 5, 6, 7]);
			const pair = radicalPair(m, 1, n);
			P = pair.poly;
			if (P[0].isZero()) continue;
			answer = product(q(1), [pair]);
			// the signs in the parentheses changed; √Δ not halved (m ± 2√n)
			wrong.push(product(q(1), [radicalPair(-m, 1, n)]));
			wrong.push(product(q(1), [radicalPair(m, 2, n)]));
			wrong.push(product(q(1), [radicalPair(-m, 2, n)]));
			Object.assign(extra, { roots: [Surd.of(m, -1, n, 1).toString(), Surd.of(m, 1, n, 1).toString()], m: String(m), n: String(n) });
			break;
		}
		if (kind === 'delta=0') {
			const r = randomRational(rng, 7, [1, 2, 2, 3]);
			const sign = rng.next() < 0.25 ? -1 : 1;
			const f = intFactor(r);
			P = polyScale(polyMul(f.poly, f.poly), q(sign));
			if (!smallInts(P)) continue;
			answer = product(q(sign), [f], true);
			// the sign of the root changed; a forgotten; a difference of squares instead of a square
			wrong.push(product(q(sign), [intFactor(r.neg())], true));
			if (r.den > 1) wrong.push(product(q(sign), [rootFactor(r)], true));
			wrong.push(product(q(sign), [intFactor(r), intFactor(r.neg())]));
			wrong.push(product(q(-sign), [f], true));
			Object.assign(extra, { roots: [r.toString()] });
			break;
		}
		// irriducibile: a(x^2 + …) with c = a·m·n for a pair m, n, and |b| too small for real roots
		const a = rng.pick([1, 1, 2, 3]);
		const mm = rng.int(1, 4), nn = rng.int(mm, 6);
		const sg = rng.pick([1, -1]);
		const c = a * mm * nn;
		const bmax = Math.floor(Math.sqrt(4 * a * c - 1));
		const b = sg * rng.int(1, bmax);
		P = poly(c, b, a);
		if (deltaOf(P).sign() >= 0 || content(P) !== 1) continue;
		answer = null;
		// the right product with the wrong sum (the guess of lesson 36), with both signs
		const A = q(a);
		wrong.push(product(A, [rootFactor(q(-sg * mm)), rootFactor(q(-sg * nn))]));
		wrong.push(product(A, [rootFactor(q(sg * mm)), rootFactor(q(sg * nn))]));
		wrong.push(product(A, [rootFactor(q(-sg * mm)), rootFactor(q(sg * nn))]));
		if (mm * nn > 1) wrong.push(product(A, [rootFactor(q(-sg)), rootFactor(q(-sg * mm * nn))]));
		break;
	}
	const [a] = coeffs(P);
	const D = deltaOf(P);
	const roots = rootsOf(P);
	steps.push(`${t("Risolvi l'equazione associata ")} ${polyToLatex(P)} = 0`);
	let current = P;
	if (a.sign() < 0) {
		current = polyScale(P, q(-1));
		steps.push(`${t('Moltiplica per ')} -1${t(': ')} ${polyToLatex(current)} = 0${t(', che ha le stesse soluzioni')}`);
	}
	steps.push(deltaStep(current));
	const [ca, cb] = coeffs(current);
	if (D.sign() < 0) {
		steps.push(`\\Delta < 0${t(': il trinomio non si scompone in fattori di primo grado, è irriducibile')}`);
	} else if (D.isZero()) {
		steps.push(`\\Delta = 0${t(': una soluzione doppia, ')} x_1 = x_2 = -\\frac{b}{2a} = ${roots[0].toLatex()}`);
		steps.push(`${t('Il trinomio è ')} a(x - x_1)^2${t(': ')} ${polyToLatex(P)} = ${product(a, [rootFactor(roots[0].toRational())], true).latex}`);
		if (!roots[0].toRational().isInteger()) steps.push(`${t('Porta ')} ${a.abs().toLatex()} = ${roots[0].toRational().den}^2 ${t(' dentro la parentesi: ')} ${answer!.latex}`);
	} else if (kind === 'irrazionali') {
		const m = Number(extra.m), n = Number(extra.n);
		steps.push(`x_{1,2} = \\frac{${-cb.num} \\pm \\sqrt{${D.num}}}{${2 * ca.num}} = \\frac{${-cb.num} \\pm 2\\sqrt{${n}}}{2} = ${m} \\pm \\sqrt{${n}}`);
		steps.push(`${t('Con ')} a = 1 ${t(' e i segni cambiati dentro le parentesi: ')} ${answer!.latex}`);
	} else {
		const k = Math.round(Math.sqrt(D.num));
		const [x1, x2] = roots.map((r) => r.toRational());
		steps.push(`x_{1,2} = \\frac{${-cb.num} \\pm ${k}}{${2 * ca.num}}${t(', quindi ')} x_1 = ${x1.toLatex()},\\ x_2 = ${x2.toLatex()}`);
		const raw = product(a, [rootFactor(x1), rootFactor(x2)]);
		steps.push(`${t('Scrivi ')} a(x - x_1)(x - x_2)${t(', con ')} a = ${a.toLatex()} ${t(' del trinomio: ')} ${raw.latex}`);
		const dens = [x1.den, x2.den].filter((d) => d > 1);
		const minus = a.sign() < 0 ? '-1 \\cdot ' : '';
		if (dens.length === 2) {
			steps.push(`${t('Scrivi ')} ${a.toLatex()} = ${minus}${dens[0]} \\cdot ${dens[1]} ${t(' e porta ogni fattore nella sua parentesi: ')} ${answer!.latex}`);
		} else {
			const pre = a.sign() < 0 ? `${t('Scrivi ')} ${a.toLatex()} = -1 \\cdot ${dens[0]} ${t(' e porta il ')} ${dens[0]}` : `${t('Porta il ')} ${dens[0]}`;
			steps.push(`${pre} ${t(' nella parentesi con la frazione: ')} ${answer!.latex}`);
		}
	}
	const irrLatex = t('Il trinomio è irriducibile');
	const value = answer ? answer.sympy : polySympy(P);
	return {
		generatorId: ID,
		level: 5,
		seed: rng.seed,
		prompt: "Scomponi il trinomio in fattori di primo grado, anche con i radicali, usando le soluzioni dell'equazione associata. Se non si può, è irriducibile.",
		problem: polyToLatex(P),
		solution: answer ? `${polyToLatex(P)} = ${answer.latex}` : irrLatex,
		steps,
		answer: { kind: 'expression', value, latex: answer ? answer.latex : irrLatex, form: 'factored' },
		params: {
			case: kind,
			coeffs: polyToStrings(P),
			delta: D.toString(),
			irreducible: answer === null,
			...extra,
			wrong: wrong.filter((w) => !samePoly(w.expanded, P)).map((w) => ({ latex: w.latex, sympy: w.sympy })),
		},
	};
}

function polySympy(P: Poly): string {
	const [a, b, c] = coeffs(P);
	return `${a.toString()}*x**2${b.sign() < 0 ? '' : '+'}${b.toString()}*x${c.sign() < 0 ? '' : '+'}${c.toString()}`;
}

function level5Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const irr = sample.params.irreducible === true;
	const ans = sample.answer as { value: string; latex: string };
	const irrOption: ChoiceOption = { latex: t('Irriducibile'), values: [IRR] };
	const correct: ChoiceOption = irr ? irrOption : { latex: ans.latex, values: [ans.value] };
	const wrong = (sample.params.wrong as { latex: string; sympy: string }[]).map((w) => ({ latex: w.latex, values: [w.sympy] }));
	const ds: ChoiceOption[] = irr ? wrong : [wrong[0], irrOption, ...wrong.slice(1)];
	return choose(rng, correct, ds);
}

// ---------------------------------------------------------------------------
// Level 6: signs of the solutions without solving

type Sign = 'pp' | 'nn' | 'disc+' | 'disc-' | 'none';
const SIGN_TEXT: Record<Sign, string> = {
	pp: 'Due soluzioni positive',
	nn: 'Due soluzioni negative',
	'disc+': 'Discordi, ha valore assoluto maggiore la positiva',
	'disc-': 'Discordi, ha valore assoluto maggiore la negativa',
	none: 'Nessuna soluzione reale',
};

function signOption(sg: Sign): ChoiceOption {
	const txt = SIGN_TEXT[sg];
	if (sg === 'disc+' || sg === 'disc-') {
		return { latex: `\\begin{gathered} ${t('Discordi, ha valore assoluto')} \\\\ ${t(`maggiore la ${sg === 'disc+' ? 'positiva' : 'negativa'}`)} \\end{gathered}`, values: [sg] };
	}
	return { latex: t(txt), values: [sg] };
}

/** The sign case from s and p, assuming the solutions exist. */
function signFrom(s: Rational, p: Rational): Sign {
	if (p.sign() > 0) return s.sign() > 0 ? 'pp' : 'nn';
	return s.sign() > 0 ? 'disc+' : 'disc-';
}

const signChar = (r: Rational) => (r.sign() < 0 ? '-' : '+');

function level6(rng: Rng): Sample {
	const target: Sign = rng.pick(['pp', 'nn', 'disc+', 'disc-', 'none'] as const);
	const negA = rng.next() < 1 / 3;
	let P: Poly;
	for (;;) {
		if (target === 'none') {
			const A = rng.int(1, 4), h = nonZeroInt(rng, -5, 5), m = rng.int(1, 9);
			P = polyScale(poly(A * h * h + m, -2 * A * h, A), q(negA ? -1 : 1));
			if (content(P) !== 1 || !smallInts(P)) continue;
			break;
		}
		const r1 = randomRational(rng, 9, [1, 1, 2, 3]);
		const r2 = randomRational(rng, 9, [1, 1, 2, 3]);
		if (r1.equals(r2) || r1.add(r2).isZero()) continue;
		if (signFrom(r1.add(r2), r1.mul(r2)) !== target) continue;
		P = polyScale(polyMul(linear(r1), linear(r2)), q(negA ? -1 : 1));
		if (!smallInts(P) || Math.abs(P[2].num) > 9) continue;
		break;
	}
	const [a, b, c] = coeffs(P);
	const signs = [a, b, c].map(signChar);
	const pattern = signs.join('\\,');
	const pairs = [signs[0] === signs[1] ? 'P' : 'V', signs[1] === signs[2] ? 'P' : 'V'];
	const steps: string[] = [];
	if (a.sign() * c.sign() < 0) steps.push(`a ${t(' e ')} c ${t(' hanno segni opposti, quindi ')} \\Delta > 0 ${t(' senza fare il conto')}`);
	else steps.push(`${deltaStep(P)}${t(target === 'none' ? ', negativo' : ', positivo')}`);
	let solution: string;
	if (target === 'none') {
		steps.push(`\\Delta < 0${t(": l'equazione non ha soluzioni reali, e la regola dei segni non si applica")}`);
		solution = t(SIGN_TEXT.none);
	} else {
		const desc =
			pairs[0] === pairs[1]
				? pairs[0] === 'V'
					? 'due variazioni, quindi due soluzioni positive'
					: 'due permanenze, quindi due soluzioni negative'
				: pairs[0] === 'V'
					? 'prima una variazione, poi una permanenza: soluzioni discordi, ha valore assoluto maggiore la positiva'
					: 'prima una permanenza, poi una variazione: soluzioni discordi, ha valore assoluto maggiore la negativa';
		steps.push(`${t('I segni dei coefficienti sono ')} ${pattern}${t(`: ${desc}`)}`);
		const rs = rootsOf(P);
		steps.push(`${t('Controllo: le soluzioni sono ')} ${rs[0].toLatex()} ${t(' e ')} ${rs[1].toLatex()}`);
		solution = t(SIGN_TEXT[target]);
	}
	// Mistakes: the sign rule read without the discriminant; −b/a taken as b/a; a ignored (s = −b, p = c)
	const s = sumOf(P), p = prodOf(P);
	const mistakes: Sign[] = [];
	if (target === 'none') mistakes.push(signFrom(s, p));
	else {
		mistakes.push(signFrom(s.neg(), p));
		if (a.sign() < 0) mistakes.push(signFrom(b.neg(), c));
	}
	const rest = shuffle(rng, (['pp', 'nn', 'disc+', 'disc-', 'none'] as Sign[]).filter((x) => x !== target && !mistakes.includes(x)));
	const answer = choose(rng, signOption(target), [...mistakes, ...rest].map(signOption));
	return {
		generatorId: ID,
		level: 6,
		seed: rng.seed,
		prompt: "Senza risolvere l'equazione, stabilisci il segno delle soluzioni.",
		problem: `${polyToLatex(P)} = 0`,
		solution,
		steps,
		answer,
		params: { coeffs: polyToStrings(P), case: target, negA },
	};
}

// ---------------------------------------------------------------------------
// Level 7: symmetric expressions

type Sym = 'quadrati' | 'reciproci' | 'differenza' | 'reciproci quadrati' | 'raccoglimento' | 'cubi';
const SYM_LATEX: Record<Sym, string> = {
	quadrati: 'x_1^2 + x_2^2',
	reciproci: '\\frac{1}{x_1} + \\frac{1}{x_2}',
	differenza: '(x_1 - x_2)^2',
	'reciproci quadrati': '\\frac{1}{x_1^2} + \\frac{1}{x_2^2}',
	raccoglimento: 'x_1^2x_2 + x_1x_2^2',
	cubi: 'x_1^3 + x_2^3',
};
function symValue(e: Sym, s: Rational, p: Rational): Rational {
	const s2 = s.mul(s);
	switch (e) {
		case 'quadrati':
			return s2.sub(p.mul(q(2)));
		case 'reciproci':
			return s.div(p);
		case 'differenza':
			return s2.sub(p.mul(q(4)));
		case 'reciproci quadrati':
			return s2.sub(p.mul(q(2))).div(p.mul(p));
		case 'raccoglimento':
			return p.mul(s);
		case 'cubi':
			return s2.mul(s).sub(q(3).mul(p).mul(s));
	}
}

function symMistakes(e: Sym, s: Rational, p: Rational): Rational[] {
	const s2 = s.mul(s);
	switch (e) {
		case 'quadrati':
			return [s2, s2.add(p.mul(q(2))), s2.sub(p)];
		case 'reciproci':
			return [p.div(s), s.neg().div(p), s.mul(p)];
		case 'differenza':
			return [s2.sub(p.mul(q(2))), s2.add(p.mul(q(4))), s2];
		case 'reciproci quadrati':
			return [s2.sub(p.mul(q(2))).div(p), s2.div(p.mul(p)), s2.add(p.mul(q(2))).div(p.mul(p))];
		case 'raccoglimento':
			return [p.mul(s).neg(), p.add(s), p.mul(p).mul(s)];
		case 'cubi':
			return [s2.mul(s), s2.mul(s).add(q(3).mul(p).mul(s)), symValue('cubi', s, p).neg()];
	}
}

function symSteps(e: Sym, s: Rational, p: Rational): string[] {
	const v = symValue(e, s, p);
	const out: string[] = [];
	switch (e) {
		case 'quadrati':
			out.push(`${SYM_LATEX[e]} = (x_1 + x_2)^2 - 2x_1x_2 = s^2 - 2p`);
			out.push(`s^2 - 2p = ${pw(s)}^2 - 2 \\cdot ${paren(p)} = ${v.toLatex()}`);
			break;
		case 'reciproci':
			out.push(`${SYM_LATEX[e]} = \\frac{x_2 + x_1}{x_1x_2} = \\frac{s}{p}`);
			out.push(`\\frac{s}{p} = ${s.toLatex()} : ${paren(p)} = ${v.toLatex()}`);
			break;
		case 'differenza':
			out.push(`${SYM_LATEX[e]} = x_1^2 + x_2^2 - 2x_1x_2 = s^2 - 2p - 2p = s^2 - 4p`);
			out.push(`s^2 - 4p = ${pw(s)}^2 - 4 \\cdot ${paren(p)} = ${v.toLatex()}`);
			break;
		case 'reciproci quadrati': {
			const num = s.mul(s).sub(p.mul(q(2)));
			out.push(`${SYM_LATEX[e]} = \\frac{x_1^2 + x_2^2}{x_1^2x_2^2} = \\frac{s^2 - 2p}{p^2}`);
			out.push(`s^2 - 2p = ${pw(s)}^2 - 2 \\cdot ${paren(p)} = ${num.toLatex()}, \\quad p^2 = ${p.mul(p).toLatex()}`);
			out.push(`\\frac{s^2 - 2p}{p^2} = ${num.toLatex()} : ${pw(p.mul(p))} = ${v.toLatex()}`);
			break;
		}
		case 'raccoglimento':
			out.push(`${SYM_LATEX[e]} = x_1x_2(x_1 + x_2) = ps`);
			out.push(`ps = ${p.toLatex()} \\cdot ${paren(s)} = ${v.toLatex()}`);
			break;
		case 'cubi':
			out.push(`(x_1 + x_2)^3 = x_1^3 + x_2^3 + 3x_1x_2(x_1 + x_2)${t(', quindi ')} ${SYM_LATEX[e]} = s^3 - 3ps`);
			out.push(`s^3 - 3ps = ${pw(s)}^3 - 3 \\cdot ${paren(p)} \\cdot ${paren(s)} = ${v.toLatex()}`);
			break;
	}
	return out;
}

const SYM_WEIGHTS: Sym[] = ['quadrati', 'quadrati', 'quadrati', 'reciproci', 'reciproci', 'reciproci', 'differenza', 'differenza', 'reciproci quadrati', 'reciproci quadrati', 'raccoglimento', 'cubi'];

function level7(rng: Rng): Sample {
	const e = rng.pick(SYM_WEIGHTS);
	let P: Poly, s: Rational, p: Rational, v: Rational;
	for (;;) {
		const a = rng.pick([1, 1, 2, 3]);
		P = poly(nonZeroInt(rng, -9, 9), nonZeroInt(rng, -9, 9), a);
		if (content(P) !== 1 || deltaOf(P).sign() <= 0) continue;
		s = sumOf(P);
		p = prodOf(P);
		if (e === 'reciproci' && s.isZero()) continue;
		v = symValue(e, s, p);
		if (v.den > 81 || Math.abs(v.num) > 400 || v.isZero()) continue;
		break;
	}
	const steps = [
		`${deltaStep(P)}${t(', positivo: le soluzioni esistono')}`,
		`${sumStep(P)}, \\quad ${prodStep(P)}`,
		...symSteps(e, s, p),
	];
	return {
		generatorId: ID,
		level: 7,
		seed: rng.seed,
		prompt: "Calcola il valore dell'espressione con la somma e il prodotto delle soluzioni, senza risolvere l'equazione.",
		problem: `\\begin{array}{l} ${polyToLatex(P)} = 0 \\\\ ${SYM_LATEX[e]} = \\ ? \\end{array}`,
		solution: `${SYM_LATEX[e]} = ${v.toLatex()}`,
		steps,
		answer: { kind: 'number', value: v.toString() },
		params: { coeffs: polyToStrings(P), expr: e, s: s.toString(), p: p.toString(), mistakes: symMistakes(e, s, p).map(String) },
	};
}

// ---------------------------------------------------------------------------
// Checks

function parseCoeffs(x: unknown): Poly | null {
	if (!Array.isArray(x) || x.length !== 3) return null;
	try {
		return x.map((s) => R(s));
	} catch {
		return null;
	}
}

function choiceErrors(ch: ChoiceAnswer | undefined): string[] {
	if (!ch) return ['variante a scelta multipla mancante'];
	const v: string[] = [];
	if (ch.options.length !== 4) v.push(`servono 4 opzioni, trovate ${ch.options.length}`);
	const keys = ch.options.map((o) => o.values.join('|') + '#' + o.latex);
	if (new Set(keys).size !== keys.length) v.push('opzioni ripetute');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('indice della risposta giusta fuori intervallo');
	return v;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const pr = sample.params;
	for (const { name, re } of FORBIDDEN_PATTERNS) {
		if (re.test(sample.problem.replace(/\\text\{[^}]*\}/g, ''))) v.push(`problema contiene ${name}: ${sample.problem}`);
	}
	if (!sample.steps.length) v.push('passaggi mancanti');
	const P = parseCoeffs(pr.coeffs);
	switch (sample.level) {
		case 1: {
			if (!P || !smallInts(P) || P[2].sign() <= 0) return ['coefficienti non validi'];
			const D = deltaOf(P);
			if (sample.answer.kind !== 'choice') return ['answer.kind deve essere choice'];
			v.push(...choiceErrors(sample.answer));
			const right = sample.answer.options[sample.answer.correct].values;
			const want = D.sign() < 0 ? ['nessuna'] : [sumOf(P).toString(), prodOf(P).toString()];
			if (right.join('|') !== want.join('|')) v.push(`risposta ${right} diversa da ${want}`);
			if ((pr.case === 'delta<0') !== D.sign() < 0) v.push('case non coerente con il discriminante');
			break;
		}
		case 2: {
			if (!P || !smallInts(P)) return ['coefficienti non validi'];
			const given = R(pr.given);
			const rs = rootsOf(P);
			if (rs.length !== 2 || !rs.every((r) => r.isRational())) return ['servono due soluzioni razionali distinte'];
			const others = rs.map((r) => r.toRational()).filter((r) => !r.equals(given));
			if (others.length !== 1) v.push('il numero dato non è una soluzione');
			else if (sample.answer.kind !== 'number' || sample.answer.value !== others[0].toString()) v.push('risposta diversa dall\'altra soluzione');
			if (!given.isInteger()) v.push('la soluzione data deve essere intera');
			break;
		}
		case 3: {
			if (!P || !smallInts(P) || P[2].sign() <= 0 || content(P) !== 1) return ['equazione non primitiva'];
			const rs = rootsOf(P).map(String);
			if (rs.join(',') !== (pr.roots as string[]).join(',')) v.push(`le soluzioni ${rs} non sono quelle date ${String(pr.roots)}`);
			const ans = sample.answer;
			if (ans.kind !== 'choice') return ['answer.kind deve essere choice'];
			v.push(...choiceErrors(ans));
			if (ans.options[ans.correct].values.join('|') !== polyToStrings(P).join('|')) v.push('opzione giusta sbagliata');
			ans.options.forEach((o, i) => {
				if (i === ans.correct) return;
				const Q = parseCoeffs(o.values);
				if (!Q || rootsOf(Q).map(String).join(',') === rs.join(',')) v.push(`distrattore con le stesse soluzioni: ${o.latex}`);
			});
			break;
		}
		case 4: {
			const s = Number(pr.s), p = Number(pr.p);
			const rs = pairFrom(s, p);
			if (sample.answer.kind !== 'set' || sample.answer.values.join(',') !== rs.map(String).join(',')) v.push('risposta diversa dalle soluzioni');
			if (rs.length === 1 || rs.some((r) => !r.isRational())) v.push('soluzioni coincidenti o irrazionali');
			if ((pr.case === 'non esistono') !== (rs.length === 0)) v.push('case non coerente');
			if (pr.case === 'rettangolo' && (Number(pr.perimeter) !== 2 * s || rs.some((r) => r.value() <= 0))) v.push('rettangolo non valido');
			break;
		}
		case 5: {
			if (!P || !smallInts(P)) return ['coefficienti non validi'];
			const D = deltaOf(P);
			if ((pr.irreducible === true) !== D.sign() < 0) v.push('irriducibile non coerente con il discriminante');
			if (sample.answer.kind !== 'expression') v.push('answer.kind deve essere expression');
			if (pr.case === 'irrazionali' && (D.sign() <= 0 || rootsOf(P).some((r) => r.isRational()))) v.push('servono soluzioni irrazionali');
			if ((pr.case === 'frazionarie' || pr.case === 'a negativo') && rootsOf(P).some((r) => !r.isRational())) v.push('servono soluzioni razionali');
			if (pr.case === 'a negativo' && P[2].sign() >= 0) v.push('a deve essere negativo');
			if (pr.case === 'delta=0' && !D.isZero()) v.push('delta deve essere 0');
			if (P[0].isZero() || P[1].isZero()) v.push('trinomio incompleto');
			break;
		}
		case 6: {
			if (!P || !smallInts(P) || P.some((c) => c.isZero())) return ['coefficienti non validi (servono tutti diversi da zero)'];
			const rs = rootsOf(P);
			const truth: Sign = rs.length === 0 ? 'none' : signFrom(sumOf(P), prodOf(P));
			if (rs.length === 1) v.push('radice doppia');
			if (sample.answer.kind !== 'choice') return ['answer.kind deve essere choice'];
			v.push(...choiceErrors(sample.answer));
			if (sample.answer.options[sample.answer.correct].values[0] !== truth) v.push(`risposta diversa da ${truth}`);
			if (pr.case !== truth) v.push('case non coerente');
			break;
		}
		case 7: {
			if (!P || !smallInts(P) || deltaOf(P).sign() <= 0) return ['serve delta > 0'];
			const val = symValue(pr.expr as Sym, sumOf(P), prodOf(P));
			if (sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('risposta sbagliata');
			if (P[0].isZero()) v.push('c deve essere diverso da 0');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	switch (sample.level) {
		case 2:
		case 7: {
			const value = R((sample.answer as { value: string }).value);
			const mistakes = (sample.params.mistakes as string[]).map(R);
			return choose(rng, numberOption(value)!, numberDistractors(value, mistakes));
		}
		case 4:
			return level4Choice(sample, rng);
		case 5:
			return level5Choice(sample, rng);
		default:
			throw new Error(`${ID}: no choice for level ${sample.level}`);
	}
}

const BUILDERS: Record<number, (rng: Rng) => Sample> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

export const equazioniSecondoGradoRelazioni: Generator = {
	id: ID,
	title: 'Relazioni tra soluzioni e coefficienti',
	levels: {
		1: {
			label: 'Somma e prodotto dai coefficienti',
			constraints: ['ax^2 + bx + c = 0 con a da 1 a 5, |b|, |c| <= 10, coefficienti senza fattori comuni', 'circa uno su cinque con delta < 0: la risposta è "nessuna soluzione reale"'],
		},
		2: {
			label: "L'altra soluzione, nota una",
			constraints: ['soluzione data intera, non nulla, tra -6 e 6', "l'altra razionale p/q con q <= 3, diversa e non opposta"],
		},
		3: {
			label: "L'equazione con soluzioni date",
			constraints: ['soluzioni intere (40%), frazionarie (35%) o m ± √n (25%)', 'risposta: coefficienti interi primitivi, a > 0'],
		},
		4: {
			label: 'Due numeri di somma e prodotto dati',
			constraints: ['numeri interi (45%), numeri che non esistono (20%), lati di un rettangolo (35%)'],
		},
		5: {
			label: 'Scomporre il trinomio con le soluzioni',
			constraints: ['soluzioni frazionarie, a negativo, irrazionali m ± √n, delta = 0, irriducibile'],
		},
		6: {
			label: 'Segno delle soluzioni senza risolvere',
			constraints: ['a, b, c diversi da zero; cinque casi in parti uguali, un terzo con a < 0'],
		},
		7: {
			label: 'Espressioni simmetriche delle soluzioni',
			constraints: ['delta > 0, c != 0; x1^2 + x2^2, 1/x1 + 1/x2, (x1 - x2)^2, 1/x1^2 + 1/x2^2, x1^2 x2 + x1 x2^2, x1^3 + x2^3'],
		},
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = build(rng);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check(sample: Sample): string[] {
		const v = check(sample);
		if (sample.choice) v.push(...choiceErrors(sample.choice));
		return v;
	},
	toChoice,
};

export default equazioniSecondoGradoRelazioni;
