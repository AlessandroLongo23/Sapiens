/**
 * Shared pieces of the generators of the first four lessons of "Internet e il web" (internet, inf-client-server,
 * inf-indirizzi-domini, http-html). All their levels are multiple choice with text options, built on
 * v2/inf-programmi.ts: samples are plain text.
 *
 * The `solution` of every sample is the label of its right option, so the independent check can compare the two.
 */
import { choose, shuffle, textOption, type Built } from './inf-programmi';
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export const NAMES = ['Anna', 'Luca', 'Sara', 'Marco', 'Giulia', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo', 'Marta', 'Simone'] as const;

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A whole number as the lessons write it: 1500, but 3 000 000, with narrow spaces that do not break. */
export const num = (n: number) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : String(n));

/**
 * A URL or a domain name as an option: on a phone it is wider than its button, so it may go to a new line after a
 * slash or a dot (a zero-width space, which is not in the value nor in the text read aloud).
 */
export function nameOption(name: string): ChoiceOption {
	const cut = name.indexOf('/', name.indexOf('://') + 3);
	const [host, path] = cut < 0 ? [name, ''] : [name.slice(0, cut), name.slice(cut)];
	return { latex: host.replace(/\.(?=.)/g, '.\u200b') + path.replace(/\/(?=.)/g, '/\u200b'), values: [name], text: name };
}

const LONG_NAME = /(?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[A-Za-z0-9._/-]*)?/g;

/** The question and the steps of a sample, with the same places to go to a new line in every long URL or name. */
export function breakable(built: Built): Built {
	const soft = (text: string) => text.replace(LONG_NAME, (name) => (name.length > 24 ? nameOption(name).latex : name));
	return { ...built, problem: soft(built.problem), steps: built.steps.map(soft) };
}

/** The label of the right option of a choice: the `solution` of the sample. */
export const rightLabel = (answer: ChoiceAnswer) => answer.options[answer.correct].latex;

/** A piece of a question with an id the check knows: a task, a network, a situation. */
export type Item = readonly [id: string, text: string];
export const itemOption = ([id, text]: Item) => textOption(cap(text), id);

/** One item of a kind among three of the other kind. `ids` go to `params`, the right one first. */
export function oneAmong(rng: Rng, rights: readonly Item[], wrongs: readonly Item[]) {
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	return { right, others, answer: choose(rng, itemOption(right), others.map(itemOption)), ids: [right[0], ...others.map((o) => o[0])] };
}

export interface Statement {
	id: string;
	text: string;
	/** One sentence that says why it is true, or why it is false. */
	why: string;
}

/** The true statement among three false ones, or the false one among three true, half each. */
export function statementLevel(rng: Rng, trues: readonly Statement[], falses: readonly Statement[], about: string, prompt: string): Built {
	const wantTrue = rng.next() < 0.5;
	const [rights, wrongs] = wantTrue ? [trues, falses] : [falses, trues];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const answer = choose(
		rng,
		textOption(right.text, right.id),
		others.map((s) => textOption(s.text, s.id))
	);
	return {
		prompt,
		problem: `Quale di queste affermazioni ${about} è ${wantTrue ? 'vera' : 'falsa'}?`,
		solution: rightLabel(answer),
		steps: [right.why, wantTrue ? `Le altre tre sono false. ${others[0].why}` : 'Le altre tre affermazioni sono vere.'],
		answer,
		params: { case: wantTrue ? 'vera' : 'falsa', ids: [right.id, ...others.map((s) => s.id)] }
	};
}

/**
 * The step that comes just after, or just before, one of the steps of an exchange. The options are the steps
 * themselves, with their number as value.
 */
export function neighbourStep(rng: Rng, steps: readonly string[]) {
	const after = rng.next() < 0.5;
	const k = after ? rng.int(0, steps.length - 2) : rng.int(1, steps.length - 1);
	const right = after ? k + 1 : k - 1;
	const option = (i: number) => textOption(steps[i], String(i + 1));
	return {
		after,
		step: k + 1,
		right: right + 1,
		ask: `Quale passo viene subito ${after ? 'dopo' : 'prima di'} questo: «${steps[k]}»?`,
		answer: choose(
			rng,
			option(right),
			steps.map((_, i) => i).filter((i) => i !== right).map(option)
		)
	};
}

export { choose, shuffle, textOption };
export { makeGenerator, type Built } from './inf-programmi';
