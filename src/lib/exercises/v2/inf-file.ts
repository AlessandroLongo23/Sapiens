/**
 * Shared pieces of the generators of the chapter on files (informatica, third year: inf-file-testo, inf-file-csv,
 * inf-xml-json). They sit on v2/inf-codice.ts, which is not changed: here are the text files a program finds beside
 * it, and the levels whose numbers are drawn again when they leave too few wrong answers.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { choose, textOption, type CodeBuilt } from './inf-codice';

/** The rows of a text file: its lines, without the line break that closes each. */
export const rowsOf = (text: string): string[] => (text === '' ? [] : text.replace(/\n$/, '').split('\n'));
/** A text file from its rows: each closed by a line break. */
export const fileOf = (rows: readonly (string | number)[]): string => rows.map((row) => `${row}\n`).join('');

/** For a `run`: the rows of a file a program opens for reading; it throws when the file is not there, as Python does. */
export function opened(files: Record<string, string>, name: string): string[] {
	if (!(name in files)) throw new Error(`no file ${name}`);
	return rowsOf(files[name]);
}

/**
 * What a file holds, as an option: its rows one under the other in fixed width. The value is the rows joined by a
 * line break, as for what a program prints; an empty file is said in words.
 */
export const contentOption = (rows: readonly string[]): ChoiceOption => (rows.length ? { latex: '', values: [rows.join('\n')], listing: rows.join('\n') + '\n', text: rows.join(', ') } : textOption('il file è vuoto', ''));

export class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one. The
 * family is drawn once, before: drawn again with the numbers, the families that fail more often would come out
 * less. After forty draws the error is the generator's.
 */
export const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 40 || !(e instanceof TooFew)) throw e;
			}
		}
	};

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options differ from the right one and from each other. */
export function pick(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`only ${keys.size} wrong options`);
	return choose(rng, right, others);
}

/** `count` different elements of `pool`, in a drawn order. */
export function some<T>(rng: Rng, pool: readonly T[], count: number): T[] {
	const left = [...pool];
	const out: T[] = [];
	while (out.length < count && left.length) out.push(left.splice(rng.int(0, left.length - 1), 1)[0]);
	return out;
}
