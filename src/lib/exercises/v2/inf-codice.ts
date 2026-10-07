/**
 * Shared pieces of the generators whose programs are written by hand in the two languages (informatica, third year:
 * functions, vectors, matrices and texts, searching and sorting, files, HTML, CSS, JavaScript in the page).
 *
 * The language of the `diagramma` blocks has no functions, lists, texts to take apart or files, so here a program
 * is not translated from one source (v2/inf-programmi.ts): it is three things written side by side,
 *
 *     { python, cpp, run }
 *
 * the two texts and a function in TypeScript that says what the program writes for the lines typed at its keyboard,
 * because nothing runs Python while an exercise is generated. The three must agree, and nothing here can tell: the
 * independent check does, by running the Python with Python and, when asked, the C++ with the compiler of the
 * machine (scripts/exercises/checkers/_inf_codice.py). A generator writes a program as a function of its
 * parameters (names, numbers, the elements of a vector) and gets hundreds of variants from it.
 *
 * What a sample carries in `params` for that check (`reference` builds it):
 * - `program`: the reference program in full, `{ python, cpp }`: the one shown, the one of the right option, the
 *   solution of the open answer;
 * - `tests`: the lines typed at the keyboard, one list of texts per run (`[[]]` when the program reads nothing);
 * - `expected`: what `run` says the reference writes on each test, line by line;
 * - `ask`: `'output'` when the right option is what the reference writes on the first test;
 * - `files`: the files the programs find beside them, name to content, when they read any;
 * - `case`: which case of the level the sample is, for the shares.
 *
 * Widths, checked on every sample by `makeCodeGenerator`: a program or a fragment that is an option has rows of at
 * most 34 characters (four of them share a phone 390 px wide); one shown under the question or with the solution,
 * of at most 42, which is what fits there without scrolling sideways; the program an open answer starts from, of at
 * most 38, because the editor gives 36 px to the numbers of its rows (measured in the browser at 390 px on 7 October
 * 2026: a row of 39 characters scrolls).
 *
 * Samples are written as text (`format: 'text'`), as in v2/inf-programmi.ts, whose general helpers are used as
 * they are and exported again from here.
 */
import { BANNED, choose, lines, makeGenerator, needing, shuffle, textOption, writtenOption, type Built, type LevelDef } from './inf-programmi';
import type { ChoiceOption, CodeText, Generator, ProgramAnswer, Rng, Sample } from './types';

export { BANNED, choose, lines, needing, shuffle, textOption, writtenOption };

/** The longest row of a program or of a fragment that is an option, and of one shown under the question. */
export const OPTION_WIDTH = 34;
export const SHOWN_WIDTH = 42;
/** The longest row of the program an open answer starts from: the editor is narrower, it numbers its rows. */
export const START_WIDTH = 38;
/** The most rows of a program that is an option, as it is shown, and of one under the question. */
export const OPTION_ROWS = { python: 10, cpp: 16 } as const;
export const SHOWN_ROWS = { python: 18, cpp: 28 } as const;
/** The most rows of a fragment that is an option, and of one under the question. */
export const LISTING_OPTION_ROWS = 10;
export const LISTING_ROWS = 18;

const LANGUAGES = ['python', 'cpp'] as const;

/**
 * A text of code as it is shown: tabs become four spaces, the indentation common to every row is taken away, and so
 * are the empty rows around it and the spaces at the end of a row. A generator can then write a program in a
 * template literal indented with the code around it.
 */
export function tidy(source: string): string {
	const rows = source
		.replace(/\t/g, '    ')
		.split('\n')
		.map((row) => row.trimEnd());
	while (rows.length && !rows[0]) rows.shift();
	while (rows.length && !rows[rows.length - 1]) rows.pop();
	const indent = Math.min(...rows.filter((row) => row).map((row) => row.length - row.trimStart().length));
	return rows.map((row) => row.slice(Number.isFinite(indent) ? indent : 0)).join('\n') + '\n';
}

/** A text between double quotes, as Python and C++ both write it. */
export const quoted = (text: string) => `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const literal = (value: string | number) => (typeof value === 'number' ? String(value) : quoted(value));
/** The elements of a vector as Python writes a list, `[3, 1, 4]`, and as C++ writes them between braces, `{3, 1, 4}`. */
export const pyList = (values: readonly (string | number)[]) => `[${values.map(literal).join(', ')}]`;
export const cppList = (values: readonly (string | number)[]) => `{${values.map(literal).join(', ')}}`;

/**
 * A C++ program around the rows of its `main`: `#include <iostream>` and the other headers named, `using namespace
 * std;`, what comes before `main` (the functions), and `return 0;` at the end.
 */
export function cppProgram(main: string, before = '', include: readonly string[] = []): string {
	const head = ['iostream', ...include].map((name) => `#include <${name}>`).join('\n');
	const body = tidy(main)
		.trimEnd()
		.split('\n')
		.map((row) => (row ? `    ${row}` : row))
		.join('\n');
	return `${head}\nusing namespace std;\n\n${before.trim() ? `${tidy(before)}\n` : ''}int main() {\n${body}\n    return 0;\n}\n`;
}

/**
 * A program written by hand in the two languages, with what it writes. `run` takes the lines typed at the
 * keyboard, in order, and the files beside the program; it returns the lines written, and throws where the program
 * would stop for an error or never end.
 */
export interface Program extends CodeText {
	run: (input: string[], files: Record<string, string>) => string[];
}

export const program = (python: string, cpp: string, run: Program['run']): Program => ({ python: tidy(python), cpp: tidy(cpp), run });

/** The two texts of a program, without `run`: what a sample can carry. */
export const texts = (p: CodeText): CodeText => ({ python: p.python, cpp: p.cpp });

/** For a `run`: the lines typed, one at each call; it throws when the program reads more than it is given. */
export function reader(input: readonly string[]): () => string {
	let at = 0;
	return () => {
		if (at >= input.length) throw new Error('reads past the end of the input');
		return input[at++];
	};
}

/** What a program writes for the lines typed, line by line; null where it stops for an error. */
export function written(p: Program, input: readonly string[] = [], files: Record<string, string> = {}): string[] | null {
	try {
		return p.run([...input], { ...files }).map(String);
	} catch {
		return null;
	}
}

/**
 * The wrong programs among `candidates` that really are wrong: each ends on every test and, on at least one, writes
 * something else than `right` does. Two that write the same on every test count once. A candidate that stops for an
 * error is left out: in C++ what it does would not even be defined.
 */
export function wrongPrograms(right: Program, candidates: readonly Program[], tests: readonly (readonly string[])[], files: Record<string, string> = {}): Program[] {
	const behaviour = (p: Program) => tests.map((input) => written(p, input, files));
	const seen = new Set([JSON.stringify(behaviour(right))]);
	const sources = new Set([right.python]);
	return candidates.filter((p) => {
		const b = behaviour(p);
		const key = JSON.stringify(b);
		if (b.includes(null) || seen.has(key) || sources.has(p.python)) return false;
		seen.add(key);
		sources.add(p.python);
		return true;
	});
}

/**
 * An option that is a program. `values` hold the program in full, in the two languages, which is what the check
 * runs; `shown` is the part of it the option shows when the whole would be too long (only the function, without the
 * `main` that tries it): rows of the program, one after the other, in each language.
 */
export const programOption = (p: Program, shown?: CodeText): ChoiceOption => ({
	latex: '',
	values: [p.python, p.cpp],
	code: shown ? { python: tidy(shown.python), cpp: tidy(shown.cpp) } : texts(p),
	text: 'un programma'
});

/**
 * An option that is a fragment in fixed width, of one row or of many: HTML, CSS, JavaScript, JSON, CSV. `value` is
 * what tells it from the others for the check, when the text itself is not what the check reads.
 */
export function listingOption(text: string, value?: string): ChoiceOption {
	const listing = tidy(text);
	return { latex: '', values: [value ?? listing], listing, text: listing.trimEnd() };
}

/**
 * What a program writes, one line under the other in fixed width: for the outputs where the lines matter (a table,
 * a file read back). `writtenOption` puts them on one row with commas, and is enough for a few numbers. The value
 * is the same in the two: the lines joined by a line break.
 */
export const printedOption = (rows: readonly string[]): ChoiceOption => (rows.length ? { latex: '', values: [rows.join('\n')], listing: rows.join('\n') + '\n', text: rows.join(', ') } : textOption('non scrive niente', ''));

/** Where the student writes, in the program an open answer starts from: both languages must have one. */
export const HERE = 'scrivi qui';

/**
 * A program to write: the solution, what the editor opens with (a comment with `scrivi qui` where the student
 * writes) and the lines typed in each run; what must be written comes from the `run` of the solution.
 */
export function programAnswer(solution: Program, start: CodeText, tests: readonly (readonly string[])[]): ProgramAnswer {
	return {
		kind: 'program',
		solution: texts(solution),
		start: { python: tidy(start.python), cpp: tidy(start.cpp) },
		tests: tests.map((input) => {
			const rows = written(solution, input);
			if (!rows) throw new Error(`programAnswer: the solution stops on ${input.join(', ')}`);
			return { input: input.length ? input.join('\n') + '\n' : '', output: rows.join('\n') + '\n' };
		})
	};
}

/** The `params` of a sample about `p`: the program, the runs and what it writes on each, for the independent check. */
export function reference(p: Program, tests: readonly (readonly string[])[], extra: Record<string, unknown> = {}): Record<string, unknown> {
	const files = (extra.files ?? {}) as Record<string, string>;
	const expected = tests.map((input) => {
		const rows = written(p, input, files);
		if (!rows) throw new Error(`reference: the program stops on ${input.join(', ')}`);
		return rows;
	});
	return { program: texts(p), tests: tests.map((input) => [...input]), expected, ...extra };
}

/** Thrown by a level whose numbers leave too few wrong answers: `drawn` draws the numbers again. */
export class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one (two
 * mistakes that happen to give the same number on that vector). The family is drawn once, before: drawn again with
 * the numbers, the families that fail more often would come out less. After thirty draws the error is the
 * generator's.
 */
export const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 30 || !(e instanceof TooFew)) throw e;
			}
		}
	};

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options are left. */
export function pick(rng: Rng, right: ChoiceOption, others: readonly ChoiceOption[]) {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`only ${keys.size} wrong options`);
	return choose(rng, right, [...others]);
}

/** Whether `part` is rows of `whole`, one after the other, but for the indentation they share. */
export function partOf(part: string, whole: string): boolean {
	const rows = tidy(part).trimEnd().split('\n');
	const all = whole.trimEnd().split('\n');
	for (let i = 0; i + rows.length <= all.length; i++) {
		if (tidy(all.slice(i, i + rows.length).join('\n')) === rows.join('\n') + '\n') return true;
	}
	return false;
}

const widest = (text: string) => Math.max(0, ...text.trimEnd().split('\n').map((row) => row.length));
const rowsOf = (text: string) => text.trimEnd().split('\n').length;

/** What a level builds: as in v2/inf-programmi.ts, and a fragment in fixed width under the question or with the solution. */
export type CodeBuilt = Built & Partial<Pick<Sample, 'listing' | 'solutionListing'>>;

export interface CodeLevelDef extends Omit<LevelDef, 'build'> {
	build(rng: Rng): CodeBuilt;
}

/**
 * A generator from its levels, as `makeGenerator` of v2/inf-programmi.ts makes it, with the checks of the programs
 * written by hand added to its own: the widths and the rows of every program and fragment, the part an option
 * shows against the program it stands for, and `params` against the answer (the tests, the solution, the right
 * option).
 */
export function makeCodeGenerator(id: string, title: string, defs: Record<number, CodeLevelDef>): Generator {
	const base = makeGenerator(id, title, defs);
	return {
		...base,
		check(sample) {
			const errors = base.check(sample);
			const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
			const params = sample.params as { program?: CodeText; tests?: string[][]; expected?: string[][]; ask?: string; files?: Record<string, string> };

			const narrow = (what: string, text: string, width: number, rows: number) => {
				if (text.includes('\t')) errors.push(`${what} has a tab`);
				if (widest(text) > width) errors.push(`${what} has a row of ${widest(text)} characters, more than ${width}`);
				if (rowsOf(text) > rows) errors.push(`${what} has ${rowsOf(text)} rows, more than ${rows}`);
			};
			for (const [i, option] of (choice?.options ?? []).entries()) {
				if (BANNED.test(`${option.latex} ${option.text ?? ''} ${option.listing ?? ''}`)) errors.push(`option ${i}: banned writing`);
				if (option.listing !== undefined) narrow(`option ${i}`, option.listing, OPTION_WIDTH, LISTING_OPTION_ROWS);
				if (!option.code) continue;
				if (option.values.length !== 2) {
					errors.push(`option ${i}: a program carries its two texts in values`);
					continue;
				}
				for (const [k, language] of LANGUAGES.entries()) {
					narrow(`option ${i} in ${language}`, option.code[language], OPTION_WIDTH, OPTION_ROWS[language]);
					if (!partOf(option.code[language], option.values[k])) errors.push(`option ${i}: what it shows in ${language} is not part of its program`);
				}
			}
			for (const [what, code] of [
				['the program shown', sample.code],
				['the program of the solution', sample.solutionCode]
			] as const) {
				if (!code) continue;
				for (const language of LANGUAGES) {
					narrow(`${what} in ${language}`, code[language], SHOWN_WIDTH, SHOWN_ROWS[language]);
					if (params.program && !partOf(code[language], params.program[language])) errors.push(`${what} in ${language} is not part of the reference program`);
				}
			}
			if (sample.listing !== undefined) narrow('the fragment shown', sample.listing, SHOWN_WIDTH, LISTING_ROWS);
			if (sample.solutionListing !== undefined) narrow('the fragment of the solution', sample.solutionListing, SHOWN_WIDTH, LISTING_ROWS);

			if (params.program) {
				const { tests, expected } = params;
				const isRows = (rows: unknown) => Array.isArray(rows) && rows.every((row) => typeof row === 'string');
				if (!Array.isArray(tests) || !tests.length || !tests.every(isRows)) errors.push('params.tests is not a list of lists of texts');
				else if (!Array.isArray(expected) || expected.length !== tests.length || !expected.every(isRows)) errors.push('params.expected does not say what is written on each test');
				else {
					if (params.ask === 'output' && choice?.options[choice.correct]?.values[0] !== expected[0].join('\n')) errors.push('the right option is not what the reference writes');
					if (sample.answer.kind === 'program') {
						const answer = sample.answer;
						if (JSON.stringify(answer.solution) !== JSON.stringify(params.program)) errors.push('the solution is not the reference program');
						const runs = tests.map((input, i) => ({ input: input.length ? input.join('\n') + '\n' : '', output: expected[i].join('\n') + '\n' }));
						if (JSON.stringify(runs) !== JSON.stringify(answer.tests)) errors.push('the tests of the answer are not those of params');
					}
				}
				const right = choice?.options[choice.correct];
				if (right?.code && (right.values[0] !== params.program.python || right.values[1] !== params.program.cpp)) errors.push('the right option is not the reference program');
			}
			if (sample.answer.kind === 'program') {
				const answer = sample.answer;
				if (!params.program) errors.push('a program to write has no reference program in params');
				if (params.files) errors.push('a program to write cannot read files: the page gives it only the lines typed');
				for (const language of LANGUAGES) {
					narrow(`the solution in ${language}`, answer.solution[language], SHOWN_WIDTH, SHOWN_ROWS[language]);
					narrow(`the ${language} to start from`, answer.start[language], START_WIDTH, SHOWN_ROWS[language]);
					if (!answer.start[language].includes(HERE)) errors.push(`the ${language} to start from has no place to write`);
				}
			}
			return errors;
		}
	};
}
