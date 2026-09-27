/**
 * Coefficiente angolare e retta per due punti (lesson slug il-coefficiente-angolare). Spec:
 * specs/exercises/il-coefficiente-angolare.md
 *
 * Seven levels in the order of lesson 82: the slope from two points with integer coordinates (with the
 * horizontal line, m = 0, and the vertical one, which has no slope); the same with fractional coordinates;
 * the slope from an equation not in explicit form (m = -a/b); the line through a point with an integer slope,
 * in explicit form; the same with a fractional slope, in implicit form with integer coefficients; the line
 * through two points (vertical and horizontal included); three aligned points (which point is aligned with A
 * and B, or the missing abscissa k).
 *
 * Everything is built backwards: the slope and the points (or the line) are chosen first, then the text. A
 * slope or k is a `number`, a line in explicit form an `expression` (`value` the right-hand side for SymPy,
 * `latex` the whole equation), a line in implicit form, the vertical line, a missing slope and a point are
 * `choice`. The distractors are the mistakes the lesson warns about: Δx/Δy, the order mixed above and below,
 * the sign of x₀, the coefficient read before dividing, m = 0 for the vertical line.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { joinSigned, paren, polyToLatex } from '../latex';
import { assembleChoice } from '../insiemi';
import { weighted } from '../razionali';

export const ID = 'il-coefficiente-angolare';

type R = Rational;
const ZERO = q(0);
const R_ = (s: unknown): R => Rational.parse(String(s));

// ---------------------------------------------------------------------------
// Small helpers

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};

/** "2x", "-x", "x", "" (zero), for integer or rational coefficients. */
function term(c: R, v: string): string {
	if (c.isZero()) return '';
	if (c.isOne()) return v;
	if (c.neg().isOne()) return `-${v}`;
	return `${c.toLatex()}${v}`;
}

/** Terms already written with their own sign, joined without "+ -". */
function join(terms: string[]): string {
	let out = '';
	for (const t of terms) {
		if (!t) continue;
		if (!out) out = t;
		else if (t.startsWith('-')) out += ` - ${t.slice(1)}`;
		else out += ` + ${t}`;
	}
	return out || '0';
}

/** A(-1, 3), or A\left(\frac{1}{2}, 1\right) when a coordinate is a fraction. */
function pointLatex(name: string, x: R, y: R): string {
	const frac = !x.isInteger() || !y.isInteger();
	return frac ? `${name}\\left(${x.toLatex()}, ${y.toLatex()}\\right)` : `${name}(${x.toLatex()}, ${y.toLatex()})`;
}

/** "m(x - x₀)" with the coefficient written as in the lesson: 3(x - 2), -(x + 3), \frac{2}{3}(x + 4), x - 2. */
function mTimes(m: R, x0: R): string {
	const inner = joinSigned('x', x0.neg());
	if (m.isOne()) return inner;
	if (m.neg().isOne()) return `-(${inner})`;
	return `${m.toLatex()}(${inner})`;
}

// ---------------------------------------------------------------------------
// Lines: ax + by + c = 0 with integer coefficients, gcd 1, a > 0 (or a = 0 and b > 0)

interface Line {
	a: number;
	b: number;
	c: number;
}

function normLine(a: R, b: R, c: R): Line {
	const den = [a, b, c].reduce((acc, r) => (acc * r.den) / gcd(acc, r.den), 1);
	let [A, B, C] = [a, b, c].map((r) => r.mul(q(den)).num);
	const g = gcd(gcd(A, B), C) || 1;
	[A, B, C] = [A / g, B / g, C / g];
	if (A < 0 || (A === 0 && B < 0)) [A, B, C] = [-A, -B, -C];
	return { a: A + 0, b: B + 0, c: C + 0 };
}

/** y = mx + q. */
const lineMQ = (m: R, qq: R): Line => normLine(m, q(-1), qq);
/** Through (x0, y0) with slope m. */
const lineThrough = (x0: R, y0: R, m: R): Line => lineMQ(m, y0.sub(m.mul(x0)));
const lineVertical = (h: R): Line => normLine(q(1), ZERO, h.neg());
const sameLine = (l: Line, k: Line) => l.a === k.a && l.b === k.b && l.c === k.c;

const slopeOf = (l: Line): R | null => (l.b === 0 ? null : q(-l.a, l.b));
const interceptOf = (l: Line): R => q(-l.c, l.b);

/** y = mx + q, or x = h for a vertical line. */
function explicitLatex(l: Line): string {
	if (l.b === 0) return `x = ${q(-l.c, l.a).toLatex()}`;
	return `y = ${polyToLatex([interceptOf(l), slopeOf(l) as R])}`;
}

/** The right-hand side of y = mx + q for SymPy: "2*x - 3", "-x/3 + 5/3", "4". */
function explicitSympy(l: Line): string {
	const m = slopeOf(l) as R;
	const qq = interceptOf(l);
	const parts: string[] = [];
	if (!m.isZero()) {
		const a = m.abs();
		const body = a.isOne() ? 'x' : a.isInteger() ? `${a.num}*x` : a.num === 1 ? `x/${a.den}` : `${a.num}*x/${a.den}`;
		parts.push(m.sign() < 0 ? `-${body}` : body);
	}
	if (!qq.isZero() || parts.length === 0) {
		if (parts.length === 0) parts.push(qq.toString());
		else parts.push(qq.sign() < 0 ? `- ${qq.abs().toString()}` : `+ ${qq.toString()}`);
	}
	return parts.join(' ');
}

/** ax + by + c = 0. */
function implicitLatex(l: Line): string {
	return `${join([term(q(l.a), 'x'), term(q(l.b), 'y'), l.c === 0 ? '' : `${l.c}`])} = 0`;
}

/** a·x₀ + b·y₀ + c with the numbers in, for the check of an implicit equation. */
function implicitSubst(l: Line, x0: R, y0: R): string {
	const times = (k: number, v: R) => (k === 0 ? '' : k === 1 ? paren(v) : k === -1 ? `-${paren(v)}` : `${k} \\cdot ${paren(v)}`);
	return join([times(l.a, x0), times(l.b, y0), l.c === 0 ? '' : `${l.c}`]);
}

const lineValues = (l: Line): string[] => ['line', `${l.a}`, `${l.b}`, `${l.c}`];
const explicitOption = (l: Line): ChoiceOption => ({ latex: explicitLatex(l), values: lineValues(l) });
const implicitOption = (l: Line): ChoiceOption => ({ latex: implicitLatex(l), values: lineValues(l) });
const numberOption = (v: R): ChoiceOption => ({ latex: v.toLatex(), values: [v.toString()] });
const NONE: ChoiceOption = { latex: '\\text{non esiste}', values: ['none'] };
const pointOption = (x: R, y: R): ChoiceOption => ({ latex: `\\left(${x.toLatex()}, ${y.toLatex()}\\right)`, values: [x.toString(), y.toString()] });

function mustChoice(rng: Rng, correct: ChoiceOption, cands: (ChoiceOption | null)[], near: ChoiceOption[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, [...cands, ...near]);
	if (!ch) throw new Error(`${ID}: not enough distinct options`);
	return ch;
}

function nearNumbers(v: R): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (let d = 1; d < 20; d++) out.push(numberOption(v.add(q(d))), numberOption(v.sub(q(d))));
	return out;
}

/** Lines next to l (the intercept moved by 1, 2, ...), written like `write`. */
function nearLines(l: Line, write: (l: Line) => ChoiceOption): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (let d = 1; d < 12; d++) {
		out.push(write(normLine(q(l.a), q(l.b), q(l.c + d))), write(normLine(q(l.a), q(l.b), q(l.c - d))));
	}
	return out;
}

/** "\frac{dy}{dx} = m", without the second half when the fraction already is m. */
function quotient(dy: R, dx: R): string {
	const m = dy.div(dx);
	const f = dy.isInteger() && dx.isInteger() ? `\\frac{${dy.toLatex()}}{${dx.toLatex()}}` : `${dy.toLatex()} : ${paren(dx)}`;
	return dx.isOne() || f === m.toLatex() ? m.toLatex() : `${f} = ${m.toLatex()}`;
}

/** m = \frac{y_B - y_A}{x_B - x_A} with the numbers in. */
function slopeSubst(xA: R, yA: R, xB: R, yB: R, name = 'm'): string {
	return `${name} = \\frac{${yB.toLatex()} - ${paren(yA)}}{${xB.toLatex()} - ${paren(xA)}}`;
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: the slope from two points

type Case12 = 'generica' | 'orizzontale' | 'verticale';

function slopeSample(level: 1 | 2, seed: number, kind: Case12, xA: R, yA: R, xB: R, yB: R): Sample {
	const dx = xB.sub(xA);
	const dy = yB.sub(yA);
	const steps: string[] = [];
	let solution: string;
	let answer: Sample['answer'];
	if (kind === 'verticale') {
		steps.push(`x_B - x_A = ${xB.toLatex()} - ${paren(xA)} = 0`);
		steps.push(`\\text{Il denominatore di } \\frac{y_B - y_A}{x_B - x_A} \\text{ è zero: il coefficiente angolare non esiste}`);
		steps.push(`\\text{I due punti hanno la stessa ascissa, e la retta è la verticale } x = ${xA.toLatex()}`);
		solution = `\\text{Il coefficiente angolare non esiste: la retta è } x = ${xA.toLatex()}`;
		answer = { kind: 'choice', options: [NONE], correct: 0 };
	} else {
		const m = dy.div(dx);
		steps.push(`m = \\frac{y_B - y_A}{x_B - x_A}`);
		if (level === 1) steps.push(`${slopeSubst(xA, yA, xB, yB)} = ${quotient(dy, dx)}`);
		else {
			steps.push(`\\text{Numeratore: } y_B - y_A = ${yB.toLatex()} - ${paren(yA)} = ${dy.toLatex()}`);
			steps.push(`\\text{Denominatore: } x_B - x_A = ${xB.toLatex()} - ${paren(xA)} = ${dx.toLatex()}`);
			const inv = q(1).div(dx);
			if (dx.isInteger()) steps.push(`m = ${dy.toLatex()} : ${paren(dx)} = ${m.toLatex()}`);
			else steps.push(`m = ${dy.toLatex()} : ${paren(dx)} = ${dy.toLatex()} \\cdot ${paren(inv)} = ${m.toLatex()}`);
		}
		if (kind === 'orizzontale') steps.push(`\\text{I due punti hanno la stessa ordinata: la retta è orizzontale, } y = ${yA.toLatex()}`);
		else steps.push(m.sign() > 0 ? `m > 0\\text{: la retta sale}` : `m < 0\\text{: la retta scende}`);
		solution = `m = ${m.toLatex()}`;
		answer = { kind: 'number', value: m.toString() };
	}
	return {
		generatorId: ID,
		level,
		seed,
		prompt: 'Calcola, se esiste, il coefficiente angolare della retta che passa per i due punti.',
		problem: `${pointLatex('A', xA, yA)} \\quad ${pointLatex('B', xB, yB)}`,
		solution,
		steps,
		answer,
		params: { case: kind, A: [xA.toString(), yA.toString()], B: [xB.toString(), yB.toString()] },
	};
}

function build1(rng: Rng, seed: number, kind: Case12): Sample | null {
	const c = () => q(rng.int(-6, 6));
	const xA = c();
	const yA = c();
	let xB = c();
	let yB = c();
	if (kind === 'orizzontale') yB = yA;
	if (kind === 'verticale') xB = xA;
	if (kind !== 'verticale' && xA.equals(xB)) return null;
	if (kind !== 'orizzontale' && yA.equals(yB)) return null;
	if (![xA, yA, xB, yB].some((v) => v.sign() < 0)) return null;
	if (kind === 'generica') {
		const m = yB.sub(yA).div(xB.sub(xA));
		if (m.den > 5) return null;
	}
	return slopeSample(1, seed, kind, xA, yA, xB, yB);
}

function build2(rng: Rng, seed: number): Sample | null {
	const D = rng.pick([2, 3, 4]);
	const coord = (frac: boolean): R => {
		if (!frac) return q(rng.int(-4, 4));
		for (;;) {
			const k = rng.int(-4 * D + 1, 4 * D - 1);
			if (k % D !== 0) return q(k, D);
		}
	};
	// each point has one or two fractional coordinates
	const fr = () => {
		const r = rng.int(0, 2);
		return [r !== 1, r !== 0];
	};
	const [fa, fb] = [fr(), fr()];
	const xA = coord(fa[0]);
	const yA = coord(fa[1]);
	const xB = coord(fb[0]);
	const yB = coord(fb[1]);
	if (xA.equals(xB) || yA.equals(yB)) return null;
	const m = yB.sub(yA).div(xB.sub(xA));
	if (m.den > 6 || Math.abs(m.num) > 9) return null;
	return slopeSample(2, seed, 'generica', xA, yA, xB, yB);
}

function choice12(s: Sample, rng: Rng): ChoiceAnswer {
	const [xA, yA] = (s.params.A as string[]).map(R_);
	const [xB, yB] = (s.params.B as string[]).map(R_);
	const dx = xB.sub(xA);
	const dy = yB.sub(yA);
	if (s.params.case === 'verticale') {
		// m = 0 for the vertical line (warning), the abscissa h of x = h, Δy read as the slope
		return mustChoice(rng, NONE, [numberOption(ZERO), numberOption(xA), numberOption(dy)], nearNumbers(ZERO));
	}
	const m = dy.div(dx);
	if (s.params.case === 'orizzontale') {
		// "non esiste" (0 at the numerator mistaken for 0 at the denominator), the ordinate y = q read as m, Δx
		return mustChoice(rng, numberOption(m), [NONE, numberOption(yA), numberOption(dx)], nearNumbers(m));
	}
	const cands: ChoiceOption[] = [
		numberOption(dx.div(dy)), // Δx/Δy
		numberOption(m.neg()), // order mixed above and below
		numberOption(dx.div(dy).neg()),
	];
	// y_B - (-3) written y_B - 3: the sign of a negative coordinate lost in Δy
	if (yA.sign() < 0) cands.splice(2, 0, numberOption(yB.add(yA).div(dx)));
	else if (xA.sign() < 0) cands.splice(2, 0, numberOption(dy.div(xB.add(xA).isZero() ? dx : xB.add(xA))));
	return mustChoice(rng, numberOption(m), cands, [numberOption(m.mul(q(2))), ...nearNumbers(m)]);
}

// ---------------------------------------------------------------------------
// Level 3: the slope from an equation not in explicit form

type Case3 = 'implicita' | 'da esplicitare' | 'due membri';

function build3(rng: Rng, seed: number, kind: Case3): Sample | null {
	const steps: string[] = [];
	let problem: string;
	let m: R;
	const params: Record<string, unknown> = { case: kind };
	if (kind === 'implicita') {
		// ax + by + c = 0, a > 0
		const a = rng.int(1, 6);
		const b = nz(rng, -6, 6);
		const c = nz(rng, -9, 9);
		if (gcd(gcd(a, b), c) !== 1 || Math.abs(b) === 1) return null;
		m = q(-a, b);
		const qq = q(-c, b);
		problem = implicitLatex({ a, b, c });
		steps.push(`\\text{Nella forma } ax + by + c = 0 \\text{ il coefficiente angolare è } m = -\\frac{a}{b}`);
		steps.push(`a = ${a},\\ b = ${b}`);
		steps.push(`m = -\\frac{${a}}{${b}} = ${m.toLatex()}`);
		steps.push(`\\text{Controllo ricavando } y\\text{: } y = ${polyToLatex([qq, m])}`);
		Object.assign(params, { a, b, c });
	} else if (kind === 'da esplicitare') {
		// by = ax + c, b >= 2: the coefficient of x is not m until both sides are divided by b
		const b = rng.int(2, 6);
		const a = nz(rng, -9, 9);
		const c = rng.int(-9, 9);
		if (gcd(gcd(a, b), c) !== 1 || a % b === 0) return null;
		m = q(a, b);
		problem = `${b}y = ${polyToLatex([q(c), q(a)])}`;
		steps.push(`\\text{L'equazione non è in forma esplicita: prima si dividono per } ${b} \\text{ i due membri}`);
		steps.push(`y = ${polyToLatex([q(c, b), m])}`);
		steps.push(`\\text{Il coefficiente di } x \\text{ è il coefficiente angolare: } m = ${m.toLatex()}`);
		Object.assign(params, { a, b, c });
	} else {
		// ax = by + c: to use -a/b, everything goes to the left side first
		const a = rng.int(1, 6);
		const b = nz(rng, -6, 6);
		const c = nz(rng, -9, 9);
		if (gcd(gcd(a, b), c) !== 1 || Math.abs(b) === 1 || a === Math.abs(b)) return null;
		m = q(a, b);
		problem = `${term(q(a), 'x')} = ${join([term(q(b), 'y'), `${c}`])}`;
		const left: Line = { a, b: -b, c: -c };
		steps.push(`\\text{Tutti i termini a primo membro: } ${implicitLatex(left)}`);
		steps.push(`a = ${a},\\ b = ${-b}`);
		steps.push(`m = -\\frac{${a}}{${-b}} = ${m.toLatex()}`);
		Object.assign(params, { a, b, c });
	}
	return {
		generatorId: ID,
		level: 3,
		seed,
		prompt: 'Trova il coefficiente angolare della retta.',
		problem,
		solution: `m = ${m.toLatex()}`,
		steps,
		answer: { kind: 'number', value: m.toString() },
		params,
	};
}

function choice3(s: Sample, rng: Rng): ChoiceAnswer {
	const { a, b, c } = s.params as { a: number; b: number; c: number };
	const kind = s.params.case as Case3;
	const cands: ChoiceOption[] = [];
	let m: R;
	if (kind === 'implicita') {
		m = q(-a, b);
		cands.push(numberOption(q(a, b))); // the minus of -a/b forgotten
		cands.push(numberOption(q(-c, b))); // q instead of m
		cands.push(numberOption(q(-b, a))); // -b/a
		cands.push(numberOption(q(a))); // the coefficient of x read as m
	} else if (kind === 'da esplicitare') {
		m = q(a, b);
		cands.push(numberOption(q(a))); // 6 read in 2y = 6x + 1 (warning)
		cands.push(numberOption(q(-a, b))); // -a/b applied without moving the terms
		cands.push(numberOption(q(b, a)));
		cands.push(numberOption(q(c, b)));
	} else {
		m = q(a, b);
		cands.push(numberOption(q(-a, b))); // a and b read in 3x = 2y - 6 (warning)
		cands.push(numberOption(q(b, a)));
		cands.push(numberOption(q(a)));
		cands.push(numberOption(q(-c, b)));
	}
	return mustChoice(rng, numberOption(m), cands, nearNumbers(m));
}

/** y - y₀ = m(x - x₀) with the numbers in, expanded, then y = mx + q (the expanded line only when it differs). */
function pointSlopeSteps(x0: R, y0: R, m: R): string[] {
	const qq = y0.sub(m.mul(x0));
	const subst = `y - ${paren(y0)} = ${mTimes(m, x0)}`;
	const expanded = `${joinSigned('y', y0.neg())} = ${polyToLatex([m.mul(x0).neg(), m])}`;
	const out = [subst];
	if (expanded !== subst) out.push(expanded);
	out.push(`y = ${polyToLatex([qq, m])}`);
	return out;
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the line through a point with a given slope

function build4(rng: Rng, seed: number): Sample | null {
	const m = q(nz(rng, -4, 4));
	const x0 = q(nz(rng, -6, 6));
	const y0 = q(rng.int(-6, 6));
	if (x0.sign() > 0 && y0.sign() >= 0) return null;
	const qq = y0.sub(m.mul(x0));
	if (Math.abs(qq.num) > 20) return null;
	const l = lineMQ(m, qq);
	const steps = [
		`y - y_0 = m(x - x_0)`,
		...pointSlopeSteps(x0, y0, m),
		`\\text{Controllo con } P\\text{: } ${joinSigned(`${m.toLatex()} \\cdot ${paren(x0)}`, qq)} = ${y0.toLatex()}`,
	];
	return {
		generatorId: ID,
		level: 4,
		seed,
		prompt: "Scrivi in forma esplicita l'equazione della retta che passa per P e ha il coefficiente angolare dato.",
		problem: `${pointLatex('P', x0, y0)} \\quad m = ${m.toLatex()}`,
		solution: explicitLatex(l),
		steps,
		answer: { kind: 'expression', value: explicitSympy(l), latex: explicitLatex(l) },
		params: { P: [x0.toString(), y0.toString()], m: m.toString() },
	};
}

function choice4(s: Sample, rng: Rng): ChoiceAnswer {
	const [x0, y0] = (s.params.P as string[]).map(R_);
	const m = R_(s.params.m);
	const right = lineThrough(x0, y0, m);
	const cands = [
		lineThrough(x0.neg(), y0, m), // the sign of x0: x + x0 (warning)
		lineThrough(x0, y0.neg(), m), // the sign of y0
		lineMQ(m, y0.sub(x0)), // m not multiplied by x0: y - y0 = mx - x0
		lineThrough(x0, y0, m.neg()),
	].map(explicitOption);
	return mustChoice(rng, explicitOption(right), cands, nearLines(right, explicitOption));
}

function build5(rng: Rng, seed: number): Sample | null {
	const d = rng.pick([2, 3, 4, 5]);
	const n = nz(rng, -5, 5);
	if (gcd(n, d) !== 1) return null;
	const m = q(n, d);
	const x0 = q(nz(rng, -6, 6));
	const y0 = q(nz(rng, -6, 6));
	if (x0.sign() > 0 && y0.sign() > 0) return null;
	const l = lineThrough(x0, y0, m);
	const qq = y0.sub(m.mul(x0));
	if (Math.abs(l.c) > 40) return null;
	// d(y - y0) = n(x - x0): d·y - d·y0 = n·x - n·x0
	const lhs = joinSigned(term(q(d), 'y'), y0.mul(q(d)).neg());
	const rhs = polyToLatex([x0.mul(q(n)).neg(), q(n)]);
	const steps = [
		`y - y_0 = m(x - x_0)`,
		`y - ${paren(y0)} = ${mTimes(m, x0)}`,
		`\\text{Si moltiplicano per } ${d} \\text{ i due membri, per togliere il denominatore: } ${lhs} = ${rhs}`,
		`\\text{Tutti i termini a primo membro: } ${implicitLatex(l)}`,
		`\\text{In forma esplicita sarebbe } y = ${polyToLatex([qq, m])}`,
		`\\text{Controllo con } P\\text{: } ${implicitSubst(l, x0, y0)} = 0`,
	];
	return {
		generatorId: ID,
		level: 5,
		seed,
		prompt: "Scrivi in forma implicita, con coefficienti interi, l'equazione della retta che passa per P e ha il coefficiente angolare dato.",
		problem: `${pointLatex('P', x0, y0)} \\quad m = ${m.toLatex()}`,
		solution: implicitLatex(l),
		steps,
		answer: { kind: 'choice', options: [implicitOption(l)], correct: 0 },
		params: { P: [x0.toString(), y0.toString()], m: m.toString() },
	};
}

function choice5(s: Sample, rng: Rng): ChoiceAnswer {
	const [x0, y0] = (s.params.P as string[]).map(R_);
	const m = R_(s.params.m);
	const right = lineThrough(x0, y0, m);
	const cands = [
		lineThrough(x0.neg(), y0, m), // the sign of x0 (warning)
		lineThrough(x0, y0.neg(), m),
		lineThrough(x0, y0, m.neg()),
		lineThrough(x0, y0, q(1).div(m)), // m upside down
	].map(implicitOption);
	return mustChoice(rng, implicitOption(right), cands, nearLines(right, implicitOption));
}

// ---------------------------------------------------------------------------
// Level 6: the line through two points

function build6(rng: Rng, seed: number, kind: Case12): Sample | null {
	const c = () => q(rng.int(-6, 6));
	const xA = c();
	const yA = c();
	let xB = c();
	let yB = c();
	if (kind === 'orizzontale') yB = yA;
	if (kind === 'verticale') xB = xA;
	if (kind !== 'verticale' && xA.equals(xB)) return null;
	if (kind !== 'orizzontale' && yA.equals(yB)) return null;
	if (![xA, yA, xB, yB].some((v) => v.sign() < 0)) return null;
	const dx = xB.sub(xA);
	const dy = yB.sub(yA);
	const steps: string[] = [];
	let l: Line;
	let answer: Sample['answer'];
	if (kind === 'verticale') {
		l = lineVertical(xA);
		steps.push(`x_A = x_B = ${xA.toLatex()}\\text{: la retta è verticale e non ha coefficiente angolare}`);
		steps.push(`\\text{La sua equazione è } x = ${xA.toLatex()}`);
		answer = { kind: 'choice', options: [explicitOption(l)], correct: 0 };
	} else {
		const m = dy.div(dx);
		if (m.den > 4 || Math.abs(m.num) > 6) return null;
		const qq = yA.sub(m.mul(xA));
		l = lineMQ(m, qq);
		steps.push(`\\text{Le ascisse sono diverse: la retta non è verticale}`);
		steps.push(`${slopeSubst(xA, yA, xB, yB)} = ${quotient(dy, dx)}`);
		if (kind === 'orizzontale') {
			steps.push(`m = 0\\text{: la retta è orizzontale, e passa per } A`);
			steps.push(`y = ${yA.toLatex()}`);
		} else {
			const [first, ...rest] = pointSlopeSteps(xA, yA, m);
			steps.push(`\\text{Con il punto } A\\text{: } ${first}`, ...rest);
			steps.push(`\\text{Controllo con } B\\text{: } ${joinSigned(`${m.toLatex()} \\cdot ${paren(xB)}`, qq)} = ${yB.toLatex()}`);
		}
		answer = { kind: 'expression', value: explicitSympy(l), latex: explicitLatex(l) };
	}
	return {
		generatorId: ID,
		level: 6,
		seed,
		prompt: "Scrivi l'equazione della retta che passa per A e B, in forma esplicita se la retta non è verticale.",
		problem: `${pointLatex('A', xA, yA)} \\quad ${pointLatex('B', xB, yB)}`,
		solution: explicitLatex(l),
		steps,
		answer,
		params: { case: kind, A: [xA.toString(), yA.toString()], B: [xB.toString(), yB.toString()] },
	};
}

function choice6(s: Sample, rng: Rng): ChoiceAnswer {
	const [xA, yA] = (s.params.A as string[]).map(R_);
	const [xB, yB] = (s.params.B as string[]).map(R_);
	const kind = s.params.case as Case12;
	const horiz = (v: R) => lineMQ(ZERO, v);
	if (kind === 'verticale') {
		const right = lineVertical(xA);
		// y = h instead of x = h, the horizontal lines through A and B, x = y_A
		const cands = [horiz(xA), horiz(yA), horiz(yB), lineVertical(yA)].map(explicitOption);
		return mustChoice(rng, explicitOption(right), cands, nearLines(right, explicitOption));
	}
	if (kind === 'orizzontale') {
		const right = horiz(yA);
		// x = k instead of y = k, the vertical lines through A and B, y = x_A
		const cands = [lineVertical(yA), lineVertical(xA), lineVertical(xB), horiz(xA)].map(explicitOption);
		return mustChoice(rng, explicitOption(right), cands, nearLines(right, explicitOption));
	}
	const m = yB.sub(yA).div(xB.sub(xA));
	const right = lineThrough(xA, yA, m);
	const cands = [
		lineThrough(xA, yA, q(1).div(m)), // Δx/Δy
		lineThrough(xA, yA, m.neg()), // order mixed above and below
		lineThrough(xA.neg(), yA, m), // the sign of x_A
		lineThrough(xA, yA.neg(), m),
	].map(explicitOption);
	return mustChoice(rng, explicitOption(right), cands, nearLines(right, explicitOption));
}

// ---------------------------------------------------------------------------
// Level 7: three aligned points

type Case7 = 'quale punto' | 'coordinata';

const collinear = (ax: R, ay: R, bx: R, by: R, cx: R, cy: R) => bx.sub(ax).mul(cy.sub(ay)).equals(by.sub(ay).mul(cx.sub(ax)));

function build7(rng: Rng, seed: number, kind: Case7): Sample | null {
	const xA = q(rng.int(-5, 5));
	const yA = q(rng.int(-5, 5));
	const xB = q(rng.int(-5, 5));
	const yB = q(rng.int(-5, 5));
	if (xA.equals(xB) || yA.equals(yB)) return null;
	if (![xA, yA, xB, yB].some((v) => v.sign() < 0)) return null;
	const dx = xB.sub(xA);
	const dy = yB.sub(yA);
	const g = gcd(dx.num, dy.num);
	const [d, n] = [dx.num / g, dy.num / g];
	const [sd, sn] = d < 0 ? [-d, -n] : [d, n];
	const t = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
	const xC = xA.add(q(t * sd));
	const yC = yA.add(q(t * sn));
	if (Math.abs(xC.num) > 12 || Math.abs(yC.num) > 12) return null;
	if ((xC.equals(xA) && yC.equals(yA)) || (xC.equals(xB) && yC.equals(yB))) return null;
	const m = dy.div(dx);
	const mAB = `${slopeSubst(xA, yA, xB, yB, 'm_{AB}')} = ${quotient(dy, dx)}`;
	const base = {
		generatorId: ID,
		level: 7,
		seed,
	};
	if (kind === 'quale punto') {
		return {
			...base,
			prompt: 'Quale di questi punti è allineato con A e B?',
			problem: `${pointLatex('A', xA, yA)} \\quad ${pointLatex('B', xB, yB)}`,
			solution: `C${pointOption(xC, yC).latex}`,
			steps: [
				mAB,
				`\\text{Con } C${pointOption(xC, yC).latex}\\text{: } ${slopeSubst(xA, yA, xC, yC, 'm_{AC}')} = ${quotient(yC.sub(yA), xC.sub(xA))}`,
				`m_{AC} = m_{AB}\\text{: le rette } AB \\text{ e } AC \\text{ hanno la stessa pendenza e il punto } A \\text{ in comune, quindi } A,\\ B,\\ C \\text{ sono allineati}`,
				`\\text{Per gli altri punti } m_{AC} \\text{ è diverso da } ${m.toLatex()}`,
			],
			answer: { kind: 'choice', options: [pointOption(xC, yC)], correct: 0 },
			params: { case: kind, A: [xA.toString(), yA.toString()], B: [xB.toString(), yB.toString()], C: [xC.toString(), yC.toString()] },
		};
	}
	// the abscissa of C(k, y_C) is missing
	const k = xC;
	const dyC = yC.sub(yA);
	const lhsK = joinSigned('k', xA.neg());
	const steps = [
		`\\text{Con } k = ${xA.toLatex()} \\text{ il punto } C \\text{ starebbe sulla verticale di } A\\text{, che non passa per } B\\text{: quindi } k \\neq ${xA.toLatex()}`,
		mAB,
		`m_{AC} = \\frac{${yC.toLatex()} - ${paren(yA)}}{${lhsK}} = \\frac{${dyC.toLatex()}}{${lhsK}}`,
		`\\text{I tre punti sono allineati quando } m_{AC} = m_{AB}\\text{: } \\frac{${dyC.toLatex()}}{${lhsK}} = ${m.toLatex()}`,
		`${lhsK} = ${dyC.toLatex()} : ${paren(m)} = ${dyC.div(m).toLatex()}`,
	];
	if (!xA.isZero()) steps.push(`k = ${k.toLatex()}`);
	return {
		...base,
		prompt: 'Trova k in modo che i tre punti siano allineati.',
		problem: `${pointLatex('A', xA, yA)} \\quad ${pointLatex('B', xB, yB)} \\quad C(k, ${yC.toLatex()})`,
		solution: `k = ${k.toLatex()}`,
		steps,
		answer: { kind: 'number', value: k.toString() },
		params: { case: kind, A: [xA.toString(), yA.toString()], B: [xB.toString(), yB.toString()], C: [k.toString(), yC.toString()] },
	};
}

function choice7(s: Sample, rng: Rng): ChoiceAnswer {
	const [xA, yA] = (s.params.A as string[]).map(R_);
	const [xB, yB] = (s.params.B as string[]).map(R_);
	const [xC, yC] = (s.params.C as string[]).map(R_);
	const m = yB.sub(yA).div(xB.sub(xA));
	if (s.params.case === 'quale punto') {
		const one = q(1);
		// almost aligned points (one unit off, like C(4, -2) in example 10), the coordinates swapped,
		// the point on the line with the opposite slope
		const raw: [R, R][] = [
			[xC, yC.add(one)],
			[xC, yC.sub(one)],
			[xC.add(one), yC],
			[xC.sub(one), yC],
			[yC, xC],
			[xC, yA.sub(yC.sub(yA))],
		];
		const bad = (x: R, y: R) => Math.abs(x.num) > 13 || Math.abs(y.num) > 13 || collinear(xA, yA, xB, yB, x, y) || (x.equals(xA) && y.equals(yA)) || (x.equals(xB) && y.equals(yB));
		const cands = rng.pick([0, 1]) ? [raw[0], raw[4], raw[2], raw[5], raw[1], raw[3]] : [raw[1], raw[5], raw[3], raw[4], raw[0], raw[2]];
		const opts = cands.filter(([x, y]) => !bad(x, y)).map(([x, y]) => pointOption(x, y));
		const near: ChoiceOption[] = [];
		for (let d = 2; d < 8; d++) for (const [x, y] of [[xC, yC.add(q(d))], [xC, yC.sub(q(d))]] as [R, R][]) if (!bad(x, y)) near.push(pointOption(x, y));
		return mustChoice(rng, pointOption(xC, yC), opts, near);
	}
	const dyC = yC.sub(yA);
	const cands = [
		numberOption(xA.add(dyC.mul(m))), // m_AC = Δx/Δy: k - x_A = Δy · m
		numberOption(xA.sub(dyC.div(m))), // the sign of x_A in k - x_A
		numberOption(dyC.div(m)), // x_A forgotten: k = Δy/m
	];
	return mustChoice(rng, numberOption(xC), cands, nearNumbers(xC));
}

// ---------------------------------------------------------------------------
// Assembly

const KINDS: Record<number, [string, number][]> = {
	1: [
		['generica', 0.7],
		['orizzontale', 0.15],
		['verticale', 0.15],
	],
	3: [
		['implicita', 0.5],
		['da esplicitare', 0.25],
		['due membri', 0.25],
	],
	6: [
		['generica', 0.7],
		['orizzontale', 0.15],
		['verticale', 0.15],
	],
	7: [
		['quale punto', 0.5],
		['coordinata', 0.5],
	],
};

function buildLevel(rng: Rng, level: number, kind: string): Sample | null {
	const seed = rng.seed;
	switch (level) {
		case 1:
			return build1(rng, seed, kind as Case12);
		case 2:
			return build2(rng, seed);
		case 3:
			return build3(rng, seed, kind as Case3);
		case 4:
			return build4(rng, seed);
		case 5:
			return build5(rng, seed);
		case 6:
			return build6(rng, seed, kind as Case12);
		case 7:
			return build7(rng, seed, kind as Case7);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const ch = (() => {
		switch (sample.level) {
			case 1:
			case 2:
				return choice12(sample, rng);
			case 3:
				return choice3(sample, rng);
			case 4:
				return choice4(sample, rng);
			case 5:
				return choice5(sample, rng);
			case 6:
				return choice6(sample, rng);
			case 7:
				return choice7(sample, rng);
			default:
				throw new Error(`${ID}: no choice for level ${sample.level}`);
		}
	})();
	return ch;
}

// ---------------------------------------------------------------------------
// Check

const FORBIDDEN: [string, RegExp][] = [
	['1x', /(?<![\d}])1\s*[a-z(]/],
	['0x', /(?<![\d}])0\s*[a-z(]/],
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['+ +', /\+\s*\+/],
	['termine nullo', /[+-]\s*0(?!\d)/],
];

function checkChoice(ch: ChoiceAnswer | undefined, v: string[]) {
	if (!ch) return v.push('manca la scelta multipla');
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('indice della risposta fuori intervallo');
}

const pt = (s: unknown): R[] => (s as string[]).map(R_);
const lineFromValues = (vals: string[]): Line | null => (vals[0] === 'line' ? { a: Number(vals[1]), b: Number(vals[2]), c: Number(vals[3]) } : null);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const [name, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${name}': ${sample.problem}`);
	if (!sample.steps.length) v.push('niente passaggi');
	if (/\\begin\{(aligned|gathered|array)\}/.test(sample.solution + sample.steps.join(' '))) v.push('ambiente nella soluzione o nei passaggi');
	const a = sample.answer;
	const ch = a.kind === 'choice' ? a : sample.choice;
	const truthOption = (want: string[]) => {
		if (!ch) return;
		const hits = ch.options.filter((o) => o.values.join('|') === want.join('|')).length;
		if (hits !== 1 || ch.options[ch.correct]?.values.join('|') !== want.join('|')) v.push('l’opzione giusta non è la risposta');
	};
	const lineTruth = (l: Line) => {
		if (!ch) return;
		const lines = ch.options.map((o) => lineFromValues(o.values));
		if (lines.some((x) => !x)) v.push('opzione che non è una retta');
		if (lines.filter((x) => x && sameLine(x, l)).length !== 1) v.push('non c’è una sola retta giusta');
		truthOption(lineValues(l));
	};
	switch (sample.level) {
		case 1:
		case 2: {
			const [xA, yA] = pt(p.A);
			const [xB, yB] = pt(p.B);
			const kind = p.case as Case12;
			if (xA.equals(xB) !== (kind === 'verticale') || (yA.equals(yB) && kind !== 'orizzontale')) v.push('caso diverso dai punti');
			if (xA.equals(xB) && yA.equals(yB)) v.push('punti coincidenti');
			if (kind === 'verticale') {
				if (a.kind !== 'choice') v.push('la verticale vuole una scelta');
				truthOption(['none']);
			} else {
				const m = yB.sub(yA).div(xB.sub(xA));
				if (a.kind !== 'number' || a.value !== m.toString()) v.push('risposta diversa da m');
				truthOption([m.toString()]);
			}
			if (sample.level === 1 && [xA, yA, xB, yB].some((c) => !c.isInteger() || Math.abs(c.num) > 6)) v.push('livello 1: coordinate intere da -6 a 6');
			if (sample.level === 2 && ([xA, yA].every((c) => c.isInteger()) || [xB, yB].every((c) => c.isInteger()))) v.push('livello 2: ogni punto con una coordinata frazionaria');
			break;
		}
		case 3: {
			const { a: A, b: B, c: C } = p as { a: number; b: number; c: number };
			const m = p.case === 'implicita' ? q(-A, B) : q(A, B);
			if (a.kind !== 'number' || a.value !== m.toString()) v.push('risposta diversa da m');
			truthOption([m.toString()]);
			if (gcd(gcd(A, B), C) !== 1) v.push('coefficienti non primi tra loro');
			break;
		}
		case 4:
		case 5: {
			const [x0, y0] = pt(p.P);
			const m = R_(p.m);
			const l = lineThrough(x0, y0, m);
			if (sample.level === 4) {
				if (a.kind !== 'expression' || a.latex !== explicitLatex(l) || a.value !== explicitSympy(l)) v.push('risposta diversa dalla retta');
				if (!m.isInteger()) v.push('livello 4: m intero');
			} else {
				if (a.kind !== 'choice') v.push('serve una scelta');
				if (m.isInteger()) v.push('livello 5: m frazionario');
			}
			lineTruth(l);
			break;
		}
		case 6: {
			const [xA, yA] = pt(p.A);
			const [xB, yB] = pt(p.B);
			const l = xA.equals(xB) ? lineVertical(xA) : lineThrough(xA, yA, yB.sub(yA).div(xB.sub(xA)));
			if (xA.equals(xB) !== (p.case === 'verticale')) v.push('caso diverso dai punti');
			if (xA.equals(xB) && yA.equals(yB)) v.push('punti coincidenti');
			if (l.b !== 0 && (a.kind !== 'expression' || a.latex !== explicitLatex(l) || a.value !== explicitSympy(l))) v.push('risposta diversa dalla retta');
			if (l.b === 0 && a.kind !== 'choice') v.push('la verticale vuole una scelta');
			lineTruth(l);
			break;
		}
		case 7: {
			const [xA, yA] = pt(p.A);
			const [xB, yB] = pt(p.B);
			const [xC, yC] = pt(p.C);
			if (!collinear(xA, yA, xB, yB, xC, yC)) v.push('C non è allineato');
			if (xC.equals(xA)) v.push('C sulla verticale di A');
			if (p.case === 'quale punto') {
				if (ch) {
					const al = ch.options.filter((o) => collinear(xA, yA, xB, yB, R_(o.values[0]), R_(o.values[1])));
					if (al.length !== 1) v.push('non c’è un solo punto allineato');
				}
				truthOption([xC.toString(), yC.toString()]);
			} else {
				if (a.kind !== 'number' || a.value !== xC.toString()) v.push('risposta diversa da k');
				truthOption([xC.toString()]);
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	checkChoice(ch, v);
	return v;
}

export const ilCoefficienteAngolare: Generator = {
	id: ID,
	title: 'Coefficiente angolare e retta per due punti',
	levels: {
		1: { label: 'Coefficiente angolare da due punti', constraints: ['coordinate intere da -6 a 6, almeno una negativa', 'sette su dieci m diverso da zero, 15 su 100 orizzontale, 15 su 100 verticale'] },
		2: { label: 'Punti con le coordinate frazionarie', constraints: ['ogni punto con una o due coordinate frazionarie, denominatore 2, 3 o 4', 'm con denominatore fino a 6'] },
		3: { label: 'Coefficiente angolare dalla forma implicita', constraints: ['metà ax + by + c = 0', 'un quarto by = ax + c', 'un quarto ax = by + c'] },
		4: { label: 'Retta per un punto, m intero, forma esplicita', constraints: ['m intero da -4 a 4, non nullo', 'x₀ non nullo, una coordinata negativa', 'q fino a 20'] },
		5: { label: 'Retta per un punto, m frazionario, forma implicita', constraints: ['m = n/d con d da 2 a 5', 'coordinate non nulle, almeno una negativa', 'forma implicita con coefficienti interi primi tra loro, a > 0'] },
		6: { label: 'Retta per due punti', constraints: ['sette su dieci obliqua, m con denominatore fino a 4', '15 su 100 orizzontale, 15 su 100 verticale'] },
		7: { label: 'Tre punti allineati', constraints: ['metà: quale punto è allineato con A e B', 'metà: la coordinata k che allinea C'] },
	},
	generate(rng: Rng, level: number): Sample {
		// With consecutive seeds the first draws of rng.ts are not uniform: skip two before the case.
		rng.next();
		rng.next();
		const kind = KINDS[level] ? weighted(rng, KINDS[level]) : '';
		for (let attempt = 0; attempt < 5000; attempt++) {
			const sample = buildLevel(rng, level, kind);
			if (!sample) continue;
			sample.choice = toChoice(sample, rng);
			if (sample.answer.kind === 'choice') sample.answer = sample.choice;
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		// A choice answer is already the multiple-choice variant.
		return sample.answer.kind === 'choice' && sample.answer.options.length === 4 ? sample.answer : toChoice(sample, rng);
	},
};

export default ilCoefficienteAngolare;
