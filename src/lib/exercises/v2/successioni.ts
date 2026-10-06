/**
 * Shared pieces of the generators of the chapter "Successioni e progressioni" (successioni-numeriche,
 * progressioni-aritmetiche, progressioni-geometriche, principio-induzione): options, the multiple-choice
 * variant of a numeric answer, lists of terms, and the assembly of a Generator from its level builders.
 * The independent checks share scripts/exercises/checkers/_successioni.py.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, Rng, Sample } from './types';
import { Rational, q } from './rational';
import { poly, polyToLatex } from './latex';

export const t = (s: string) => `\\text{${s}}`;

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
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

/** What a level builder returns; `generate` adds id, level and seed. */
export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	choice?: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** Four distinct options (by values and by text), the correct one given first, then shuffled. */
export function choiceOf(id: string, rng: Rng, correct: ChoiceOption, distractors: ChoiceOption[]): ChoiceAnswer {
	const opts: ChoiceOption[] = [correct];
	const keyOf = (o: ChoiceOption) => o.values.join('|');
	for (const d of distractors) {
		if (opts.length === 4) break;
		if (opts.some((o) => keyOf(o) === keyOf(d) || o.latex === d.latex)) continue;
		opts.push(d);
	}
	if (opts.length < 4) throw new Error(`${id}: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

export const numOption = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });

/** The multiple choice of a numeric answer: the mistakes given, then neighbours of the value until there are four. */
export function numberChoice(id: string, rng: Rng, value: Rational, wrong: Rational[]): ChoiceAnswer {
	const pool = wrong.filter((w) => !w.equals(value)).map(numOption);
	for (let d = 1; d <= 4; d++) pool.push(numOption(value.add(q(d))), numOption(value.sub(q(d))));
	return choiceOf(id, rng, numOption(value), pool);
}

export const numberAnswer = (value: Rational): Sample['answer'] => ({ kind: 'number', value: value.toString() });

/** "3,\ 7,\ 11,\ 15,\ \dots" */
export const termList = (xs: Rational[]): string => `${xs.map((x) => x.toLatex()).join(',\\ ')},\\ \\dots`;

/** "pn + q" without "1n", "+ -" or zero terms. */
export const lin = (p: number | Rational, c: number | Rational, v = 'n'): string => polyToLatex(poly(c, p), v);

/** A number inside a product or after an operator: negative ones in parentheses. */
export function par(r: Rational): string {
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

/** Integer power of a rational, exact. */
export function pow(base: Rational, e: number): Rational {
	let out = q(1);
	for (let i = 0; i < e; i++) out = out.mul(base);
	return out;
}

/** "base^e" with the base in parentheses when it is negative or a fraction: 2^7, (-3)^5, \left(\frac{1}{2}\right)^5. */
export function powLatex(base: Rational, e: number | string): string {
	const exp = String(e).length > 1 ? `{${e}}` : `${e}`;
	if (base.isInteger() && base.sign() >= 0) return `${base.num}^${exp}`;
	return base.isInteger() ? `(${base.num})^${exp}` : `\\left(${base.toLatex()}\\right)^${exp}`;
}

/** Checks every sample of the chapter shares: steps, four distinct options, no banned words or broken signs. */
export function baseCheck(s: Sample): string[] {
	const v: string[] = [];
	if (!s.steps.length) v.push('passaggi mancanti');
	if (!s.solution) v.push('soluzione mancante');
	const text = [s.prompt, s.problem, s.solution, ...s.steps].join(' ');
	if (/—|piuttosto che/.test(text)) v.push('parole vietate');
	for (const re of [/(?<![\d.])1\s*n(?![a-z_])/, /\+\s*-/, /-\s*-/, /\+\s*\+/, /\^\{1\}|\^1(?![\d}])/, /[+-]\s*0(?![\d{,])/]) if (re.test(s.problem)) v.push(`problema con ${re}: ${s.problem}`);
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	if (!ch) v.push('manca la scelta multipla');
	else {
		if (ch.options.length !== 4) v.push('non quattro opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		if (!ch.options[ch.correct]) v.push('indice della risposta giusta fuori intervallo');
	}
	return v;
}

/** The values of the option marked correct. */
export const correctValues = (s: Sample): string[] | undefined => {
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	return ch?.options[ch.correct]?.values;
};

/** A number answer and its correct option must both be `value`. */
export function numberCheck(s: Sample, value: Rational): string[] {
	const v: string[] = [];
	if (s.answer.kind !== 'number' || s.answer.value !== value.toString()) v.push(`risposta diversa da ${value}`);
	if (correctValues(s)?.join('|') !== value.toString()) v.push("l'opzione giusta non è la risposta");
	return v;
}

/** A Generator from its level builders: each sample is rebuilt until it passes `check`. */
export function chapterGenerator(def: {
	id: string;
	title: string;
	levels: Record<number, LevelSpec>;
	builders: Record<number, (rng: Rng) => Built>;
	check: (s: Sample) => string[];
}): Generator {
	const check = (s: Sample) => [...baseCheck(s), ...def.check(s)];
	return {
		id: def.id,
		title: def.title,
		levels: def.levels,
		check,
		generate(rng: Rng, level: number): Sample {
			const build = def.builders[level];
			if (!build) throw new Error(`${def.id}: unknown level ${level}`);
			let last: string[] = [];
			for (let attempt = 0; attempt < 400; attempt++) {
				let b: Built;
				try {
					b = build(rng);
				} catch (e) {
					last = [String((e as Error).message)];
					continue;
				}
				const sample: Sample = { generatorId: def.id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
				if (b.choice) sample.choice = b.choice;
				last = check(sample);
				if (last.length === 0) return sample;
			}
			throw new Error(`${def.id}: no valid sample for level ${level}, seed ${rng.seed}: ${last.join('; ')}`);
		},
		toChoice(s: Sample): ChoiceAnswer {
			if (s.answer.kind === 'choice') return s.answer;
			if (s.choice) return s.choice;
			throw new Error(`${def.id}: no choice for level ${s.level}`);
		},
	};
}
