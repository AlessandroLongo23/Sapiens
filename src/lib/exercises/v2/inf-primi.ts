/**
 * Shared pieces of the generators of the chapter "Linguaggi e primi programmi" of informatica (inf-linguaggi-
 * programmazione, inf-input-output, inf-variabili-tipi, inf-espressioni, inf-errori-debug), on top of
 * v2/inf-programmi.ts: names, the level of true and false statements, the wrong programs of a multiple choice, the
 * checks every sample with a program goes through, and the open answer that starts from a program with a mistake.
 */
import { choose, codes, output, plain, shuffle, textOption, wrongPrograms, type Built } from './inf-programmi';
import type { CodeText, ProgramAnswer, Rng, Sample } from './types';

export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'] as const;

export type Inputs = (string | number)[];

/** What a program writes, as a sentence says it: «Ciao Sara» e, sotto, «Buona giornata». */
export const quoted = (written: string[]) => (written.length ? written.map((row) => `«${row}»`).join(' e, sotto, ') : 'niente');
/** What is typed at the keyboard, as a sentence says it: Sara e poi Lecce. */
export const typed = (inputs: Inputs) => inputs.join(' e poi ');
/** An option that is what a program writes, or that it stops. */
export const said = (written: string[] | null) => (written ? written.join(', ') : 'si ferma con un errore');

/** A statement about the lesson, true or false, with the sentence that says why. */
export interface Statement {
	id: string;
	text: string;
	why: string;
}

/** The true statement among three false ones, or the false one among three true, half of the times each. */
export function statementLevel(rng: Rng, trues: Statement[], falses: Statement[], about: string): Built {
	const wantTrue = rng.next() < 0.5;
	const [rights, wrongs] = wantTrue ? [trues, falses] : [falses, trues];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const o = (s: Statement) => textOption(s.text, s.id);
	return {
		prompt: 'Scegli la frase giusta.',
		problem: `Quale di queste affermazioni ${about} è ${wantTrue ? 'vera' : 'falsa'}?`,
		solution: right.text,
		steps: wantTrue ? [right.why, `Le altre tre sono false. Per esempio: ${others[0].why.charAt(0).toLowerCase()}${others[0].why.slice(1)}`] : [right.why, 'Le altre tre affermazioni sono vere.'],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: wantTrue ? 'vera' : 'falsa', ids: [right.id, ...others.map((s) => s.id)] }
	};
}

/** On a phone a program has rows of at most 34 characters and at most 9 rows, counted on its Python. */
export const MAX_ROW = 34;
export const MAX_ROWS = 9;
export function narrow(code: CodeText): boolean {
	const rows = code.python.replace(/\n+$/, '').split('\n');
	return rows.length <= MAX_ROWS && rows.every((row) => row.length <= MAX_ROW);
}

/**
 * The wrong programs of a multiple choice: the first `count` of `candidates` that on `tests` write something else
 * than `right`, than each other and than every program of `apart` (the program with the mistake that the question
 * shows), and that are narrow enough for a phone.
 */
export function mistakes(id: string, right: string, candidates: string[], tests: Inputs[], apart: string[] = [], count = 3): string[] {
	const fits = candidates.filter((source) => narrow(codes(source, tests[0])));
	const wrong = wrongPrograms(right, [...apart, ...fits], tests).filter((source) => !apart.includes(source));
	if (wrong.length < count) throw new Error(`${id}: only ${wrong.length} wrong programs for\n${right}`);
	return wrong.slice(0, count);
}

/**
 * Checked on every sample that has programs: the reference (`params.source`), the one with the mistake
 * (`params.bug`) and every option that is a chart or a program write the same in the chart, in Python and in C++;
 * the reference ends on every test; every program shown is narrow enough for a phone.
 */
export function sound(sample: Sample): string[] {
	const errors: string[] = [];
	const params = sample.params;
	const tests = (params.tests as Inputs[] | undefined) ?? [[]];
	const programs: string[] = [];
	if (typeof params.source === 'string') {
		programs.push(params.source);
		for (const inputs of tests) if (!output(params.source, inputs)) errors.push(`the reference does not end on ${inputs.join(', ')}`);
	}
	if (typeof params.bug === 'string') programs.push(params.bug);
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	const shown: CodeText[] = [];
	for (const option of choice?.options ?? []) {
		if (option.chart !== undefined || option.code) programs.push(option.values[0]);
		if (option.code) shown.push(option.code);
	}
	for (const source of programs) {
		const why = plain(source, tests[0]);
		if (why) errors.push(`a program ${why}`);
	}
	if (sample.code) shown.push(sample.code);
	if (sample.solutionCode) shown.push(sample.solutionCode);
	if (shown.some((code) => !narrow(code))) errors.push('a program is too wide or too long for a phone');
	return errors;
}

/**
 * A program to correct: the editor opens with `wrong`, the program with the mistake, and a comment that says what
 * to do. `programAnswer` of inf-programmi.ts cannot do it: it adds "scrivi qui il resto del programma" after the
 * part given, and here nothing is missing.
 */
export function fixAnswer(solution: string, wrong: string, tests: Inputs[]): ProgramAnswer {
	const start = codes(wrong, tests[0]);
	// short enough for a phone, and with the words the common check looks for ("scrivi qui")
	const note = 'riscrivi qui la riga sbagliata';
	return {
		kind: 'program',
		solution: codes(solution, tests[0]),
		start: { python: `# ${note}\n${start.python}`, cpp: start.cpp.replace('int main() {\n', `int main() {\n    // ${note}\n`) },
		tests: tests.map((inputs) => {
			const written = output(solution, inputs);
			if (!written) throw new Error(`fixAnswer: the solution does not end on ${inputs.join(', ')}`);
			return { input: inputs.length ? inputs.join('\n') + '\n' : '', output: written.join('\n') + '\n' };
		})
	};
}

/** The tests of a program to correct, with one on which the wrong program shows its mistake put first. */
export function exposing(right: string, wrong: string, tests: Inputs[]): Inputs[] {
	const shows = (inputs: Inputs) => JSON.stringify(output(wrong, inputs)) !== JSON.stringify(output(right, inputs));
	const first = tests.findIndex(shows);
	if (first < 0) throw new Error(`exposing: no test shows the mistake of\n${wrong}`);
	return [tests[first], ...tests.filter((_, i) => i !== first)];
}
