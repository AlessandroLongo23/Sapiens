/**
 * Shared pieces of the generators of the chapter "Sicurezza e cittadinanza digitale" of informatica (second year):
 * virus-malware, password-sicure, inf-phishing, inf-privacy, inf-diritto-autore.
 *
 * The lessons have no programming: every level is a multiple choice of texts, made of interchangeable pieces. Each
 * piece has an id, which goes in the `values` of its option, so that the checker (scripts/exercises/checkers/
 * _inf_sic.py) can rebuild the answer from its own tables. Samples are written as text, through `makeGenerator` of
 * inf-programmi.ts.
 */
import { choose, shuffle, textOption, type Built } from './inf-programmi';
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export const NAMES = ['Anna', 'Luca', 'Sara', 'Marco', 'Giulia', 'Davide', 'Chiara', 'Matteo', 'Elena', 'Tommaso', 'Marta', 'Pietro'] as const;

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A piece of a question: its id and its text. */
export type Piece = readonly [id: string, text: string];
export const pieceOption = ([id, text]: Piece): ChoiceOption => textOption(text, id);

/** The label of the right option of a choice: the `solution` of every sample of these generators. */
export const rightLabel = (answer: ChoiceAnswer) => answer.options[answer.correct].latex;

/** A level whose answer is a choice: `solution` is the right option. */
export function asked(prompt: string, problem: string, answer: ChoiceAnswer, steps: string[], params: Record<string, unknown>): Built {
	return { prompt, problem, solution: rightLabel(answer), steps, answer, params };
}

/** One piece of `rights` among three of `wrongs`. */
export function oneAmong(rng: Rng, rights: readonly Piece[], wrongs: readonly Piece[]): { right: Piece; others: Piece[]; answer: ChoiceAnswer } {
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	return { right, others, answer: choose(rng, pieceOption(right), others.map(pieceOption)) };
}

/** A statement with the reason why it is true, or false. */
export interface Statement {
	id: string;
	text: string;
	why: string;
}

/** "Which of these statements is true?" (one true, three false) or "… is false?" (one false, three true), half each. */
export function statementLevel(rng: Rng, prompt: string, about: string, TRUE: readonly Statement[], FALSE: readonly Statement[]): Built {
	const wantTrue = rng.next() < 0.5;
	const [rights, wrongs] = wantTrue ? [TRUE, FALSE] : [FALSE, TRUE];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const o = (s: Statement) => textOption(s.text, s.id);
	const answer = choose(rng, o(right), others.map(o));
	const steps = wantTrue ? [right.why, `Le altre tre affermazioni sono false. Per esempio: ${others[0].why.charAt(0).toLowerCase()}${others[0].why.slice(1)}`] : [right.why, 'Le altre tre affermazioni sono vere.'];
	return asked(prompt, `Quale di queste affermazioni ${about} è ${wantTrue ? 'vera' : 'falsa'}?`, answer, steps, { case: wantTrue ? 'vera' : 'falsa', ids: [right.id, ...others.map((s) => s.id)] });
}

/** A situation, the right thing to do and the wrong ones a student would choose (at least three). */
export interface Situation {
	id: string;
	text: (name: string) => string;
	/** The question after the situation; "Che cosa conviene fare?" when left out. */
	ask?: string;
	right: string;
	wrong: string[];
	why: string[];
}

/** A situation with a name drawn, the right choice and three of the wrong ones. Option ids: `<id>.ok`, `<id>.w<n>`. */
export function situationLevel(rng: Rng, prompt: string, situations: readonly Situation[]): Built {
	const s = rng.pick(situations);
	const name = rng.pick(NAMES);
	const wrong = shuffle(
		rng,
		s.wrong.map((text, i) => textOption(text, `${s.id}.w${i + 1}`))
	).slice(0, 3);
	const answer = choose(rng, textOption(s.right, `${s.id}.ok`), wrong);
	return asked(prompt, `${s.text(name)} ${s.ask ?? 'Che cosa conviene fare?'}`, answer, s.why, { case: s.id, name, options: wrong.map((o) => o.values[0]).sort() });
}

/** A text with a name drawn, to be sorted into one of the categories of `labels`: the options are the categories. */
export function sortLevel<K extends string>(rng: Rng, prompt: string, ask: string, labels: Record<K, string>, texts: readonly (readonly [K, (name: string) => string])[], why: Record<K, string>, count = 4): Built {
	const index = rng.int(0, texts.length - 1);
	const [kind, text] = texts[index];
	const name = rng.pick(NAMES);
	const others = shuffle(
		rng,
		(Object.keys(labels) as K[]).filter((k) => k !== kind)
	);
	const answer = choose(
		rng,
		textOption(labels[kind], kind),
		others.map((k) => textOption(labels[k], k)),
		count
	);
	return asked(prompt, `${text(name)} ${ask}`, answer, [why[kind]], { case: kind, text: index, name, options: answer.options.map((o) => o.values[0]).sort() });
}
