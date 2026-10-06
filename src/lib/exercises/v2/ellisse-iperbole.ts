/**
 * Common pieces of the generators of lessons 118-120 (ellisse, iperbole, iperbole-equilatera): the canonical
 * equation as the lessons write it, a square root in simplest form, foci and vertices as "(\pm c, 0)", lines,
 * the multiple choice with distinct options, and the assembly of a generator from its level builders.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, Rng, Sample } from './types';
import { Rational } from './rational';
import { sqrtParts } from './surd';
import { poly, polyToLatex } from './latex';

/** Patterns that must never appear in a problem (mirrored in the Python checkers). */
export const FORBIDDEN: RegExp[] = [/(?<!\d)1\s*x/, /(?<!\d)0\s*x/, /\+\s*-/, /-\s*-/, /\+\s*\+/, /\^\{1\}|\^1(?!\d)/, /\^\{0\}|\^0(?!\d)/, /[+-]\s*0(?!\d)/];

export const t = (s: string) => `\\text{${s}}`;

export type Axis = 'x' | 'y';
export const other = (a: Axis): Axis => (a === 'x' ? 'y' : 'x');

export function shuffle<T>(rng: Rng, xs: T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

export function nonZero(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

/** √n in simplest form: "4", "\sqrt{5}", "2\sqrt{3}". */
export function rootLatex(n: number): string {
	const { k, r } = sqrtParts(n);
	if (r === 1) return String(k);
	return `${k === 1 ? '' : k}\\sqrt{${r}}`;
}

/** One term of a canonical equation: "\frac{x^2}{25}", or "x^2" when the denominator is 1. */
const term = (v: Axis, den: number) => (den === 1 ? `${v}^2` : `\\frac{${v}^2}{${den}}`);

/** "\frac{x^2}{A} + \frac{y^2}{B} = 1" (ellipse, `minus` false) or "\frac{x^2}{A} - \frac{y^2}{B} = \pm 1". */
export function conicLatex(A: number, B: number, minus = false, rhs: 1 | -1 = 1): string {
	return `${term('x', A)} ${minus ? '-' : '+'} ${term('y', B)} = ${rhs}`;
}

/** "px^2 + qy^2 = r", coefficients 1 left out: the equation before it is brought to the canonical form. */
export function quadLatex(p: number, q: number, r: number): string {
	const co = (k: number) => (Math.abs(k) === 1 ? '' : String(Math.abs(k)));
	return `${p < 0 ? '-' : ''}${co(p)}x^2 ${q < 0 ? '-' : '+'} ${co(q)}y^2 = ${r}`;
}

/** A pair of coordinates: "(3, 0)", or with \left( \right) when one is a fraction. */
export function pair(x: Rational, y: Rational): string {
	return x.isInteger() && y.isInteger() ? `(${x.num}, ${y.num})` : `\\left(${x.toLatex()}, ${y.toLatex()}\\right)`;
}

/** The two points at distance √d2 from the centre on an axis: "(\pm 4, 0)", "(0, \pm 2\sqrt{3})". */
export const onAxis = (axis: Axis, d2: number): string => (axis === 'x' ? `(\\pm ${rootLatex(d2)}, 0)` : `(0, \\pm ${rootLatex(d2)})`);

/** The option "F(\pm c, 0)" with c = √c2; `values` are the axis and c squared. */
export const axisOption = (letter: string, axis: Axis, d2: number): ChoiceOption => ({ latex: `${letter}${onAxis(axis, d2)}`, values: [axis, String(d2)] });

/** "y = mx + q" as the lessons write it. */
export const lineLatex = (m: Rational, k: Rational): string => `y = ${polyToLatex(poly(k, m))}`;

/** "px + qy = r", coefficients 1 left out. */
export function implicitLatex(p: number, q: number, r: number): string {
	const co = (k: number) => (Math.abs(k) === 1 ? '' : String(Math.abs(k)));
	if (p === 0) return `${q < 0 ? '-' : ''}${co(q)}y = ${r}`;
	if (q === 0) return `${p < 0 ? '-' : ''}${co(p)}x = ${r}`;
	return `${p < 0 ? '-' : ''}${co(p)}x ${q < 0 ? '-' : '+'} ${co(q)}y = ${r}`;
}

/** The correct option and the first distinct distractors, up to `n` options, shuffled. */
export function choiceOf(id: string, rng: Rng, correct: ChoiceOption, distractors: ChoiceOption[], n = 4): ChoiceAnswer {
	const opts: ChoiceOption[] = [correct];
	const keyOf = (o: ChoiceOption) => o.values.join('|');
	for (const d of distractors) {
		if (opts.length === n) break;
		if (opts.some((o) => keyOf(o) === keyOf(d) || o.latex === d.latex)) continue;
		opts.push(d);
	}
	if (opts.length < n) throw new Error(`${id}: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Options in a fixed order (the positions of a line), the correct one by its key. */
export function fixedChoice(options: ChoiceOption[], key: string): ChoiceAnswer {
	return { kind: 'choice', options, correct: options.findIndex((o) => o.values[0] === key) };
}

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	choice?: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** What every sample of these generators must respect, whatever its level. */
export function baseCheck(s: Sample): string[] {
	const v: string[] = [];
	for (const re of FORBIDDEN) if (re.test(s.problem)) v.push(`problema con ${re}: ${s.problem}`);
	if (!s.steps.length) v.push('passaggi mancanti');
	if (!s.solution) v.push('soluzione mancante');
	if (/—|piuttosto che/.test(s.problem + s.solution + s.steps.join(' '))) v.push('parole vietate');
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	if (!ch) v.push('manca la scelta multipla');
	else {
		if (ch.options.length < 3 || ch.options.length > 4) v.push('numero di opzioni sbagliato');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		if (!ch.options[ch.correct]) v.push('indice della risposta giusta fuori intervallo');
	}
	return v;
}

/** A generator from its level builders: a sample is built again until it respects `check`. */
export function assemble(id: string, title: string, levels: Record<number, LevelSpec>, builders: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]): Generator {
	const fullCheck = (s: Sample) => [...baseCheck(s), ...check(s)];
	return {
		id,
		title,
		levels,
		generate(rng: Rng, level: number): Sample {
			const build = builders[level];
			if (!build) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 1000; attempt++) {
				const b = build(rng);
				const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
				if (b.choice) sample.choice = b.choice;
				if (fullCheck(sample).length === 0) return sample;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check: fullCheck,
		toChoice(s: Sample): ChoiceAnswer {
			if (s.answer.kind === 'choice') return s.answer;
			if (s.choice) return s.choice;
			throw new Error(`${id}: no choice for level ${s.level}`);
		},
	};
}
