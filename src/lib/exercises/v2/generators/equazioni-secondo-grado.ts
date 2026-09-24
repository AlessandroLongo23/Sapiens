/**
 * Equazioni di secondo grado. Spec: specs/exercises/equazioni-secondo-grado.md
 *
 * Six levels in textbook order, each adding one difficulty: incomplete
 * equations, a = 1 with integer roots, any a with rational roots, irrational
 * roots, terms on both sides, delta zero or negative.
 *
 * Built backwards where the roots must be nice: choose the roots, expand to a
 * polynomial with integer coefficients, then present it. Level 4 picks small
 * coefficients directly, because an irrational root is nice when its radicand
 * is small, not when it was chosen first. Either way the answer is solved
 * exactly (Surd arithmetic) and check() re-derives it.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, exactSqrt, gcd, q } from '../rational';
import { Surd, sqrtParts } from '../surd';
import {
	type Poly,
	equationLatex,
	paren,
	poly,
	polyAdd,
	polyDegree,
	polyIsZero,
	polyMul,
	polyPad,
	polyScale,
	polySub,
	polyToLatex,
	polyToStrings,
} from '../latex';

export const ID = 'equazioni-secondo-grado';
const MAX_COEF = 100;
const ROOT_MIN = -9;
const ROOT_MAX = 9;
const MAX_DEN = 5;

/** Patterns that must never appear in a problem. Mirrored in scripts/exercises/verify.py. */
export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<!\d)1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<!\d)0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
	{ name: 'esponente 0', re: /\^\{0\}|\^0(?!\d)/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

type Case = 'pura' | 'pura impossibile' | 'spuria' | 'completa' | 'delta=0' | 'delta<0';

// ---------------------------------------------------------------------------
// Algebra helpers

const linear = (root: Rational): Poly => {
	// (den x - num): integer coefficients, root num/den
	return poly(-root.num, root.den);
};

interface Solved {
	/** Normal form actually solved: leading coefficient > 0, content 1, integer coefficients. */
	normal: Poly;
	delta: Rational;
	/** Real roots, sorted ascending; one element for a double root. */
	roots: Surd[];
}

function content(p: Poly): number {
	return p.reduce((g, c) => gcd(g, c.num), 0);
}

/** Leading coefficient positive and coefficients divided by their gcd. */
function normalize(m: Poly): Poly {
	let p = polyPad(m, 3);
	if (p[2].sign() < 0) p = polyScale(p, q(-1));
	const factor = content(p);
	if (factor > 1) p = polyScale(p, q(1, factor));
	return p;
}

/** Solves A x^2 + B x + C = 0 (A != 0, integer coefficients) exactly. */
function solveQuadratic(p: Poly): Solved {
	const normal = normalize(p);
	const [C, B, A] = normal;
	if (A.isZero()) throw new Error('not a quadratic');
	if (!A.isInteger() || !B.isInteger() || !C.isInteger()) throw new Error('non-integer coefficients');
	const delta = B.mul(B).sub(q(4).mul(A).mul(C));
	const twoA = 2 * A.num;
	if (delta.sign() < 0) return { normal, delta, roots: [] };
	if (delta.isZero()) return { normal, delta, roots: [Surd.of(-B.num, 0, 1, twoA)] };
	const roots = [Surd.of(-B.num, -1, delta.num, twoA), Surd.of(-B.num, 1, delta.num, twoA)];
	return { normal, delta, roots: sortS(roots) };
}

const sortS = (xs: Surd[]): Surd[] => [...xs].sort((a, b) => a.compare(b));
const key = (xs: Surd[]): string => sortS(xs).map(String).join(',');

// ---------------------------------------------------------------------------
// Construction per level

interface Built {
	lhs: Poly;
	rhs: Poly;
	/** Roots we built in, when the level is built backwards. */
	roots?: Surd[];
	case?: Case;
}

const Z = (): Poly => poly(0);
const S = (x: Rational): Surd => Surd.rational(x);

function nonZeroInt(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

function distinctIntRoots(rng: Rng): [number, number] {
	for (;;) {
		const r1 = nonZeroInt(rng, ROOT_MIN, ROOT_MAX);
		const r2 = nonZeroInt(rng, ROOT_MIN, ROOT_MAX);
		// distinct, and b = -(r1+r2) != 0 so the equation is complete
		if (r1 !== r2 && r1 + r2 !== 0) return [r1, r2];
	}
}

/** (x - r1)(x - r2), optionally times a in [2, 5]: complete, integer roots. */
function intBase(rng: Rng, withA: boolean): { p: Poly; roots: Surd[] } {
	const a = withA ? rng.int(2, 5) : 1;
	const [r1, r2] = distinctIntRoots(rng);
	const p = polyScale(polyMul(linear(q(r1)), linear(q(r2))), q(a));
	return { p, roots: [S(q(r1)), S(q(r2))] };
}

/** k (q1 x - p1)(q2 x - p2): complete, two distinct rational roots, at least one not an integer. */
function fracBase(rng: Rng): { p: Poly; roots: Surd[] } {
	const randomRoot = (): Rational => q(nonZeroInt(rng, ROOT_MIN, ROOT_MAX), rng.int(1, MAX_DEN));
	for (;;) {
		const x1 = randomRoot();
		const x2 = randomRoot();
		if (x1.equals(x2) || (x1.isInteger() && x2.isInteger()) || x1.add(x2).isZero()) continue;
		const k = rng.pick([1, 1, 1, 2]);
		const p = polyScale(polyMul(linear(x1), linear(x2)), q(k));
		return { p, roots: [S(x1), S(x2)] };
	}
}

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1: {
			const u = rng.next();
			const t = rng.pick([1, 1, 2, 3]);
			const k = rng.pick([1, 1, 1, 2, 3]);
			if (u < 0.55) {
				// pura: k (t^2 x^2 - p^2), roots ±p/t; or k (t^2 x^2 + p^2), no real roots
				const p = rng.int(1, 9);
				if (u < 0.4) {
					return { lhs: poly(-k * p * p, 0, k * t * t), rhs: Z(), roots: [S(q(-p, t)), S(q(p, t))], case: 'pura' };
				}
				return { lhs: poly(k * p * p, 0, k * t * t), rhs: Z(), roots: [], case: 'pura impossibile' };
			}
			// spuria: k x (t x - s), roots 0 and s/t
			const s = nonZeroInt(rng, ROOT_MIN, ROOT_MAX);
			return { lhs: poly(0, -k * s, k * t), rhs: Z(), roots: [S(q(0)), S(q(s, t))], case: 'spuria' };
		}
		case 2: {
			const { p, roots } = intBase(rng, false);
			return { lhs: p, rhs: Z(), roots };
		}
		case 3: {
			const { p, roots } = rng.next() < 0.25 ? intBase(rng, true) : fracBase(rng);
			return { lhs: p, rhs: Z(), roots };
		}
		case 4: {
			if (rng.next() < 0.2) {
				// pura with irrational roots: k (t^2 x^2 - n), n not a perfect square, roots ±√n / t
				const t = rng.pick([1, 1, 2]);
				const k = rng.pick([1, 1, 2]);
				let n = 0;
				while (n === 0 || exactSqrt(q(n))) n = rng.int(2, 20);
				return { lhs: poly(-k * n, 0, k * t * t), rhs: Z(), case: 'pura' };
			}
			// complete, small coefficients, delta > 0 and not a perfect square
			for (;;) {
				const a = rng.pick([1, 1, 1, 2, 3]);
				const b = nonZeroInt(rng, -10, 10);
				const c = nonZeroInt(rng, -10, 10);
				const delta = b * b - 4 * a * c;
				if (delta > 0 && !exactSqrt(q(delta))) return { lhs: poly(c, b, a), rhs: Z(), case: 'completa' };
			}
		}
		case 5: {
			const { p, roots } = rng.next() < 0.5 ? intBase(rng, rng.next() < 0.5) : fracBase(rng);
			// Same polynomial added to both sides; must contain an x or x^2 term.
			let r: Poly = polyPad(Z(), 3);
			while (r[1].isZero() && r[2].isZero()) {
				r = poly(rng.int(-6, 6), rng.int(-6, 6), rng.pick([0, 0, rng.int(-3, 3)]));
			}
			// P + R = R, or R = P + R: lhs - rhs is +P or -P, same roots.
			const both = polyAdd(p, r);
			return rng.int(0, 1) === 1 ? { lhs: r, rhs: both, roots } : { lhs: both, rhs: r, roots };
		}
		case 6: {
			if (rng.next() < 0.5) {
				// double root: k (den x - num)^2
				const k = rng.int(1, 3);
				const root = q(nonZeroInt(rng, ROOT_MIN, ROOT_MAX), rng.pick([1, 1, 1, 2, 3]));
				const l = linear(root);
				return { lhs: polyScale(polyMul(l, l), q(k)), rhs: Z(), roots: [S(root)], case: 'delta=0' };
			}
			// no real roots: a (x - h)^2 + m with a*m > 0 and h != 0 (h = 0 would be a pura)
			const a = rng.int(1, 4);
			const h = nonZeroInt(rng, -6, 6);
			const m = rng.int(1, 9);
			let p = poly(a * h * h + m, -2 * a * h, a);
			if (rng.int(1, 4) === 1) p = polyScale(p, q(-1));
			return { lhs: p, rhs: Z(), roots: [], case: 'delta<0' };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps (Italian)

/** "\frac{a \pm k\sqrt{r}}{d}", or without the fraction when d = 1. */
function pmLatex(a: number, k: number, r: number, d: number): string {
	const root = `${k === 1 ? '' : k}\\sqrt{${r}}`;
	const numer = a === 0 ? `\\pm ${root}` : `${a} \\pm ${root}`;
	return d === 1 ? numer : `\\frac{${numer}}{${d}}`;
}

function formulaSteps(solved: Solved, steps: string[]): void {
	const [C, B, A] = solved.normal;
	steps.push(`\\text{Individua i coefficienti: } a = ${A.toLatex()},\\ b = ${B.toLatex()},\\ c = ${C.toLatex()}`);
	steps.push(
		`\\text{Calcola il discriminante: } \\Delta = b^2 - 4ac = ${paren(B)}^2 - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${solved.delta.toLatex()}`,
	);
	const minusB = -B.num;
	const twoA = 2 * A.num;
	const D = solved.delta.num;
	if (D < 0) {
		steps.push(`\\Delta < 0\\text{: l'equazione non ha soluzioni reali}`);
		return;
	}
	if (D === 0) {
		steps.push(`\\Delta = 0\\text{: due soluzioni reali coincidenti}`);
		steps.push(`\\text{Applica la formula: } x_1 = x_2 = -\\frac{b}{2a} = \\frac{${minusB}}{${twoA}} = ${solved.roots[0].toLatex()}`);
		return;
	}
	steps.push(`\\Delta > 0\\text{: due soluzioni reali distinte}`);
	steps.push(
		`\\text{Applica la formula risolutiva: } x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${minusB} \\pm \\sqrt{${D}}}{${twoA}}`,
	);
	const { k, r } = sqrtParts(D);
	if (r === 1) {
		steps.push(
			`x_1 = \\frac{${minusB} - ${k}}{${twoA}} = ${solved.roots[0].toLatex()}, \\quad x_2 = \\frac{${minusB} + ${k}}{${twoA}} = ${solved.roots[1].toLatex()}`,
		);
		return;
	}
	if (k > 1) {
		steps.push(
			`\\text{Semplifica il radicale: } \\sqrt{${D}} = ${k}\\sqrt{${r}}\\text{, quindi } x_{1,2} = ${pmLatex(minusB, k, r, twoA)}`,
		);
	}
	const g = gcd(gcd(minusB, k), twoA);
	if (g > 1) {
		steps.push(
			`\\text{Dividi numeratore e denominatore per } ${g}\\text{: } x_{1,2} = ${pmLatex(minusB / g, k / g, r, twoA / g)}`,
		);
	}
	steps.push(`x_1 = ${solved.roots[0].toLatex()}, \\quad x_2 = ${solved.roots[1].toLatex()}`);
}

function pureSteps(current: Poly, solved: Solved, steps: string[]): void {
	const [C, , A] = current;
	const x2 = C.neg().div(A);
	steps.push(`\\text{Equazione pura: porta il termine noto a secondo membro: } ${polyToLatex(poly(0, 0, A))} = ${C.neg().toLatex()}`);
	if (!A.isOne()) steps.push(`\\text{Dividi entrambi i membri per } ${A.toLatex()}\\text{: } x^2 = ${x2.toLatex()}`);
	if (x2.sign() < 0) {
		steps.push(`\\text{Un quadrato non può essere negativo: l'equazione non ha soluzioni reali}`);
		return;
	}
	const direct = `\\sqrt{${x2.toLatex()}}`;
	const root = solved.roots[1].toLatex();
	steps.push(root === direct ? `x = \\pm ${direct}` : `x = \\pm${direct} = \\pm ${root}`);
	steps.push(`x_1 = ${solved.roots[0].toLatex()}, \\quad x_2 = ${solved.roots[1].toLatex()}`);
}

function spuriaSteps(current: Poly, solved: Solved, steps: string[]): void {
	const [, B, A] = current;
	const g = gcd(A.num, B.num);
	const inner = poly(B.num / g, A.num / g);
	const factor = `${g === 1 ? '' : g}x`;
	steps.push(`\\text{Equazione spuria: raccogli } ${factor}\\text{: } ${factor}\\left(${polyToLatex(inner)}\\right) = 0`);
	steps.push(`\\text{Legge di annullamento del prodotto: } x = 0 \\text{ oppure } ${polyToLatex(inner)} = 0`);
	steps.push(`x_1 = ${solved.roots[0].toLatex()}, \\quad x_2 = ${solved.roots[1].toLatex()}`);
}

function buildSteps(lhs: Poly, rhs: Poly, solved: Solved): string[] {
	const steps: string[] = [];
	let current = polyPad(polySub(lhs, rhs), 3);
	if (!polyIsZero(rhs)) {
		steps.push(
			`\\text{Porta tutti i termini a primo membro: } ${polyToLatex(lhs)} - \\left(${polyToLatex(rhs)}\\right) = 0`,
		);
		steps.push(`\\text{Somma i termini simili: } ${polyToLatex(current)} = 0`);
	}
	if (current[2].sign() < 0) {
		current = polyScale(current, q(-1));
		steps.push(`\\text{Moltiplica entrambi i membri per } -1\\text{: } ${polyToLatex(current)} = 0`);
	}
	// Incomplete equations are solved without the formula, as in the textbook.
	if (current[1].isZero()) {
		pureSteps(current, solved, steps);
		return steps;
	}
	if (current[0].isZero()) {
		spuriaSteps(current, solved, steps);
		return steps;
	}
	const g = content(current);
	if (g > 1) {
		current = polyScale(current, q(1, g));
		steps.push(`\\text{Dividi entrambi i membri per } ${g}\\text{: } ${polyToLatex(current)} = 0`);
	}
	formulaSteps(solved, steps);
	return steps;
}

function setLatex(values: Surd[]): string {
	if (values.length === 0) return '\\emptyset';
	return `\\left\\{ ${values.map((v) => v.toLatex()).join(',\\ ')} \\right\\}`;
}

function solutionLatex(roots: Surd[]): string {
	if (roots.length === 0) return '\\text{Nessuna soluzione reale: } S = \\emptyset';
	if (roots.length === 1) return `x_1 = x_2 = ${roots[0].toLatex()}`;
	return `x_1 = ${roots[0].toLatex()}, \\quad x_2 = ${roots[1].toLatex()}`;
}

// ---------------------------------------------------------------------------
// Sample assembly and checks

function assemble(b: Built, level: number, seed: number): Sample {
	const solved = solveQuadratic(polySub(b.lhs, b.rhs));
	if (b.roots && key(solved.roots) !== key(b.roots)) {
		throw new Error(`${ID}: internal mismatch, built ${key(b.roots)} but solved ${key(solved.roots)}`);
	}
	const answer: SetAnswer = {
		kind: 'set',
		values: solved.roots.map(String),
		latex: `S = ${setLatex(solved.roots)}`,
	};
	return {
		generatorId: ID,
		level,
		seed,
		prompt: "Risolvi l'equazione.",
		problem: equationLatex(b.lhs, b.rhs),
		solution: solutionLatex(solved.roots),
		steps: buildSteps(b.lhs, b.rhs, solved),
		answer,
		params: {
			lhs: polyToStrings(b.lhs),
			rhs: polyToStrings(b.rhs),
			normal: polyToStrings(solved.normal),
			delta: solved.delta.toString(),
			roots: solved.roots.map(String),
			...(b.case ? { case: b.case } : {}),
		},
	};
}

function parsePoly(x: unknown): Poly | null {
	if (!Array.isArray(x) || x.length !== 3) return null;
	try {
		return x.map((s) => Rational.parse(String(s)));
	} catch {
		return null;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const lhs = parsePoly(sample.params.lhs);
	const rhs = parsePoly(sample.params.rhs);
	if (!lhs || !rhs) return ['params.lhs/params.rhs mancanti o non validi'];
	const m = polySub(lhs, rhs);
	if (polyDegree(m) !== 2) return [`lhs - rhs ha grado ${polyDegree(m)}, atteso 2`];

	for (const c of [...lhs, ...rhs]) {
		if (!c.isInteger()) v.push(`coefficiente non intero: ${c}`);
		else if (Math.abs(c.num) > MAX_COEF) v.push(`coefficiente troppo grande: ${c}`);
	}
	if (v.length) return v;
	for (const { name, re } of FORBIDDEN_PATTERNS) {
		if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	}

	const solved = solveQuadratic(m);
	const roots = solved.roots;
	if (sample.answer.kind !== 'set') v.push('answer.kind deve essere "set"');
	else if (sample.answer.values.join(',') !== roots.map(String).join(',')) {
		v.push(`risposta ${sample.answer.values} diversa dalle radici ${roots.map(String)}`);
	}

	const [c0, c1, c2] = m;
	const rational = roots.every((r) => r.isRational());
	const nice = (maxDen: number) =>
		roots.every((r) => {
			if (!r.isRational()) return false;
			const x = r.toRational();
			return x.den <= maxDen && Math.abs(x.num) <= ROOT_MAX;
		});
	const rhsZero = polyIsZero(rhs);
	const complete = !c1.isZero() && !c0.isZero();
	const d = solved.delta.sign();
	const caseIs = (c: Case) => sample.params.case === c;

	switch (sample.level) {
		case 1:
			if (!rhsZero) v.push('il secondo membro deve essere 0');
			if (c2.sign() < 0) v.push('a deve essere positivo');
			if (c1.isZero() === c0.isZero()) v.push('serve esattamente uno tra b = 0 e c = 0');
			if (!rational || !nice(3)) v.push(`radici fuori specifica: ${roots}`);
			if (c1.isZero() && roots.length === 2 && !caseIs('pura')) v.push('case deve essere "pura"');
			if (c1.isZero() && roots.length === 0 && !caseIs('pura impossibile')) v.push('case deve essere "pura impossibile"');
			if (c0.isZero() && !caseIs('spuria')) v.push('case deve essere "spuria"');
			break;
		case 2:
			if (!rhsZero) v.push('il secondo membro deve essere 0');
			if (!c2.isOne()) v.push(`a deve essere 1, trovato ${c2}`);
			if (!complete) v.push('equazione incompleta (b = 0 o c = 0)');
			if (roots.length !== 2 || !nice(1) || roots.some((r) => r.isZero())) v.push(`servono due radici intere distinte e non nulle in [-9, 9]: ${roots}`);
			break;
		case 3:
			if (!rhsZero) v.push('il secondo membro deve essere 0');
			if (!c2.isInteger() || c2.num < 2) v.push(`a deve essere almeno 2, trovato ${c2}`);
			if (!complete) v.push('equazione incompleta (b = 0 o c = 0)');
			if (roots.length !== 2 || !nice(MAX_DEN)) v.push(`servono due radici razionali distinte p/q, q <= 5, |p| <= 9: ${roots}`);
			if (rational && roots.every((r) => r.toRational().isInteger()) && content(m) < 2) {
				v.push('con radici intere serve un fattore comune da dividere');
			}
			break;
		case 4:
			if (!rhsZero) v.push('il secondo membro deve essere 0');
			if (c2.sign() < 0) v.push('a deve essere positivo');
			if (d <= 0 || roots.some((r) => r.isRational())) v.push(`servono due radici irrazionali: ${roots}`);
			if (caseIs('pura') ? !c1.isZero() || c0.isZero() : !caseIs('completa') || !complete) {
				v.push(`params.case ${String(sample.params.case)} non coerente con l'equazione`);
			}
			break;
		case 5:
			if (polyDegree(lhs) < 1 || polyDegree(rhs) < 1) v.push('entrambi i membri devono contenere termini in x');
			if (!complete) v.push('equazione incompleta (b = 0 o c = 0)');
			if (roots.length !== 2 || !nice(MAX_DEN) || roots.some((r) => r.isZero())) v.push(`radici fuori specifica: ${roots}`);
			break;
		case 6: {
			if (!rhsZero) v.push('il secondo membro deve essere 0');
			if (!complete) v.push('equazione incompleta (b = 0 o c = 0)');
			if (d > 0) v.push('delta deve essere <= 0');
			const expected = caseIs('delta=0') ? 0 : caseIs('delta<0') ? -1 : null;
			if (expected !== d) v.push(`params.case ${String(sample.params.case)} non coerente con delta ${solved.delta}`);
			if (d === 0 && !nice(3)) v.push(`radice doppia fuori specifica: ${roots}`);
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple-choice variant

function optionLatex(values: Surd[]): string {
	if (values.length === 0) return '\\text{Nessuna soluzione reale}';
	if (values.length === 1) return `x = ${values[0].toLatex()}`;
	return `x_1 = ${values[0].toLatex()},\\ x_2 = ${values[1].toLatex()}`;
}

function uniq(xs: Surd[]): Surd[] {
	const out: Surd[] = [];
	for (const x of sortS(xs)) if (!out.some((y) => y.equals(x))) out.push(x);
	return out;
}

/**
 * Multiple-choice variant with 4 options. Distractors model real mistakes:
 * sign-flipped roots, forgetting to divide by 2a, dividing by a instead of 2a,
 * using b^2 + 4ac as discriminant, dropping one root, answering "no solution".
 * All options are distinct as sets of values.
 */
export function toChoice(sample: Sample, rng: Rng, count = 4): ChoiceAnswer {
	const normal = parsePoly(sample.params.normal);
	if (!normal) throw new Error('toChoice: params.normal missing');
	const solved = solveQuadratic(normal);
	const [C, B, A] = solved.normal.map((c) => c.num);
	const correct = solved.roots;
	const D = B * B - 4 * A * C;
	const wrongD = B * B + 4 * A * C;
	const pm = (r: number, d: number): Surd[] => [Surd.of(-B, -1, r, d), Surd.of(-B, 1, r, d)];

	const candidates: Surd[][] = [];
	if (correct.length > 0) {
		candidates.push(correct.map((r) => r.neg()));
		if (D > 0) candidates.push(pm(D, 1), pm(D, A));
		if (wrongD >= 0) candidates.push(pm(wrongD, 2 * A));
		if (correct.length === 2) candidates.push([correct[1]], [correct[0]]);
		candidates.push([]);
	} else {
		// No real roots: treat |Delta| as if it were positive, or take the vertex.
		candidates.push(pm(-D, 2 * A));
		if (wrongD >= 0) candidates.push(pm(wrongD, 2 * A));
		candidates.push([Surd.of(-B, 0, 1, 2 * A)]);
	}

	const seen = new Set<string>([key(correct)]);
	const options: Surd[][] = [correct];
	const tryAdd = (vals: Surd[]) => {
		const u = uniq(vals);
		if (u.some((s) => s.d > 20 || Math.abs(s.a) > 200 || Math.abs(s.b) > 200)) return;
		const k = key(u);
		if (options.length < count && !seen.has(k)) {
			seen.add(k);
			options.push(u);
		}
	};
	candidates.forEach(tryAdd);
	const base = correct.length > 0 ? correct : [Surd.of(-B, 0, 1, 2 * A)];
	for (let shift = 1; options.length < count && shift < 50; shift++) {
		tryAdd(base.map((r, i) => r.add(q(i === 0 ? shift : -shift))));
		tryAdd(base.map((r) => r.add(q(shift))));
	}
	while (options.length < count) tryAdd([S(q(rng.int(-9, 9))), S(q(rng.int(-9, 9)))]);

	// Fisher-Yates with the provided rng
	const order = options.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const shuffled: ChoiceOption[] = order.map((i) => ({
		latex: optionLatex(options[i]),
		values: options[i].map(String),
	}));
	return { kind: 'choice', options: shuffled, correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------

export const equazioniSecondoGrado: Generator = {
	id: ID,
	title: 'Equazioni di secondo grado',
	levels: {
		1: {
			label: 'Equazioni incomplete: pure e spurie',
			constraints: [
				'pura ax^2 + c = 0 (radici ±p/q, oppure nessuna soluzione reale) o spuria ax^2 + bx = 0 (radici 0 e p/q)',
				'a > 0, secondo membro nullo, radici razionali con q <= 3 e |p| <= 9',
			],
		},
		2: {
			label: 'Coefficiente direttore 1, radici intere',
			constraints: [
				'forma x^2 + bx + c = 0 (a = 1)',
				'due radici intere distinte e non nulle in [-9, 9]',
				'b != 0 e c != 0 (equazione completa)',
			],
		},
		3: {
			label: 'Coefficiente direttore qualsiasi, radici razionali',
			constraints: [
				'forma ax^2 + bx + c = 0 con a >= 2, completa, secondo membro nullo',
				'due radici razionali distinte p/q ridotte, q <= 5, 1 <= |p| <= 9',
				'se le radici sono intere, i coefficienti hanno un fattore comune da dividere',
			],
		},
		4: {
			label: 'Radici irrazionali',
			constraints: [
				'delta > 0 e non quadrato perfetto: due radici irrazionali (p ± q√r)/d',
				'circa quattro su cinque complete con |b|, |c| <= 10 e a <= 3, le altre pure (x^2 = n/t^2)',
				'secondo membro nullo, a > 0',
			],
		},
		5: {
			label: 'Termini in entrambi i membri',
			constraints: [
				'stesso polinomio aggiunto ai due membri; entrambi contengono x o x^2',
				'dopo il trasporto, equazione completa con radici razionali come ai livelli 2 e 3',
				'coefficienti interi, |coefficienti| <= 100',
			],
		},
		6: {
			label: 'Delta nullo o negativo',
			constraints: [
				'circa metà con delta = 0 (radice doppia p/q, q <= 3), metà con delta < 0',
				'forma ax^2 + bx + c = 0 completa, |coefficienti| <= 100',
				'delta < 0: insieme delle soluzioni vuoto',
			],
		},
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const sample = assemble(build(rng, level), level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniSecondoGrado;
