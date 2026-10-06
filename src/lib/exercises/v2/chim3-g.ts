/**
 * What the three generators of chemistry, third year, group G share (chim-polarita-molecole, chim-legame-valenza,
 * chim-ibridazione; lessons 69-71 in docs/lezioni/chimica/riscritte/).
 *
 * Every exercise is a multiple choice with four options, written as the generators of the second year write them
 * (chim-atomo.ts). A level whose answer is a pure number (how many sigma bonds) can also be asked as an open answer:
 * its builder gives the number in `number`, the sample's answer is then that number and the multiple choice travels
 * in `sample.choice`.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from './types';
import { type Built, checkChoice } from './chim-atomo';

export { textBlock, t, tx, textOpt, texOpt, choose, type Built } from './chim-atomo';

/** A built exercise; `number` is the answer as a whole number, for the levels that can take an open answer. */
export interface BuiltG extends Built {
	number?: number;
}

/** The multiple choice of a sample: its answer, or its choice variant when the answer is a number. */
export function choiceOf(sample: Sample): ChoiceAnswer | undefined {
	return sample.answer.kind === 'choice' ? sample.answer : sample.choice;
}

/** The common checks: steps, banned words, four distinct options, and the number equal to the right option. */
export function checkG(sample: Sample): string[] {
	const ch = choiceOf(sample);
	if (!ch) return ['manca la scelta multipla'];
	const v = checkChoice({ ...sample, answer: ch });
	if (sample.answer.kind === 'number' && ch.options[ch.correct]?.values[0] !== sample.answer.value) v.push("il numero non è quello dell'opzione giusta");
	return v;
}

/** generate(): a level's builder may throw to ask for another draw; the sample must pass check(). */
export function generateG(id: string, levels: Record<number, (rng: Rng) => BuiltG>, check: (s: Sample) => string[]): Generator['generate'] {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: BuiltG;
			try {
				b = make(rng);
			} catch {
				continue;
			}
			const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			if (b.number !== undefined) {
				sample.answer = { kind: 'number', value: String(b.number) };
				sample.choice = b.answer;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** toChoice(): the choice built with the sample. */
export function toChoiceG(sample: Sample): ChoiceAnswer {
	const ch = choiceOf(sample);
	if (!ch) throw new Error(`${sample.generatorId}: sample without a choice`);
	return ch;
}

export const shuffled = <T,>(rng: Rng, xs: readonly T[]): T[] => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** A decimal number as the lessons write it: 1.5 → 1{,}5, with `d` decimals. */
export const dec = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
