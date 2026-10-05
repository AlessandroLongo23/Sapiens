/**
 * Shared pieces of the generators of the programming lessons of informatica (second year: algorithms and
 * flowcharts, first programs, selection, iteration).
 *
 * A program of an exercise is written once, in the language of the `diagramma` blocks of the lessons
 * (src/lib/diagramma/blocco.ts): `leggi`, `scrivi`, assignment, `se` / `altrimenti`, `finché`. From those lines
 * come its flowchart, the same program in Python and in C++ (src/lib/diagramma/codice.ts) and, by running it with
 * the interpreter of the lessons, what it writes. So an exercise can show a program and ask for its flowchart, show
 * a flowchart and ask what it writes, or ask the student to build the chart or to write the program, with the tests
 * worked out here.
 *
 * Samples are written as text (`format: 'text'`): prose with inline `$…$`, no `\text{}`.
 *
 * What a program may use, so that the chart, Python and C++ write the same thing (checked by `plain`): whole
 * numbers and texts; `+ - *`, `//` and `%` between numbers that are never negative; comparisons, `E`, `O`, `NON`.
 * No `/`, no decimals, no truth value written out.
 */
import { parseProgram, type Stmt } from '../../diagramma/blocco';
import { codeOf, codeText, typesOf } from '../../diagramma/codice';
import { buildChart } from '../../diagramma/disegno';
import { runAll } from '../../diagramma/esecuzione';
import type { ChartAnswer, ChoiceAnswer, ChoiceOption, CodeText, Generator, LevelSpec, ProgramAnswer, Rng, Sample } from './types';

export const BANNED = /—|piuttosto che/;

/** The lines of a program, joined: `lines('leggi n', 'finché n > 0', '    n = n - 1')`. */
export const lines = (...rows: string[]) => rows.join('\n') + '\n';

function read(source: string): Stmt[] {
	const { program, errors } = parseProgram(source, true);
	if (errors.length) throw new Error(`inf-programmi: ${errors[0]} in\n${source}`);
	return program;
}

/** What a program writes for the given answers to its "leggi", line by line; null when it stops for an error or never ends. */
export function output(source: string, inputs: (string | number)[] = []): string[] | null {
	const run = runAll(buildChart(read(source)), inputs.map(String));
	// the chart writes the minus of a negative number as a typographic sign; a program prints a hyphen
	return run.error ? null : run.output.map((line) => line.replaceAll('−', '-'));
}

/** The program in the two languages of the lessons. */
export function codes(source: string, samples: (string | number)[] = []): CodeText {
	const program = read(source);
	return { python: codeText(codeOf(program, 'python', samples.map(String))), cpp: codeText(codeOf(program, 'cpp', samples.map(String))) };
}

/**
 * Why a program would not write the same in the chart, in Python and in C++, or null when it would. A generator's
 * `check()` calls it on every program it shows or asks for.
 */
export function plain(source: string, samples: (string | number)[] = []): string | null {
	if (/(^|[^/])\/([^/]|$)/.test(source.replace(/"[^"]*"/g, ''))) return 'uses the division /';
	if (/\d\.\d/.test(source.replace(/"[^"]*"/g, ''))) return 'uses a decimal number';
	const types = Object.values(typesOf(read(source), samples.map(String)));
	if (types.includes('float')) return 'has a decimal variable';
	if (types.includes('bool')) return 'keeps a truth value in a variable';
	return null;
}

/** An option that is a text: a number, what a program writes, a sentence. */
export const textOption = (label: string, value = label): ChoiceOption => ({ latex: label, values: [value], text: label });
/** What a program writes, as an option: the lines one after the other, or "niente" for none. */
export const writtenOption = (written: string[]): ChoiceOption => textOption(written.length ? written.join(', ') : 'non scrive niente', written.join('\n'));
/** An option that is a flowchart. `values` hold the program, which is what tells two charts apart. */
export const chartOption = (source: string): ChoiceOption => ({ latex: '', values: [source], chart: source, text: 'un diagramma di flusso' });
/** An option that is a program, in the two languages. */
export const codeOption = (source: string, samples: (string | number)[] = []): ChoiceOption => ({ latex: '', values: [source], code: codes(source, samples), text: 'un programma' });

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/**
 * A multiple choice: the right option, then the others in order of preference. The first `count - 1` that differ
 * from every option kept before them are taken, then all are shuffled. Throws when there are not enough: a
 * generator must offer more wrong options than it needs.
 */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const kept = [right];
	for (const o of others) {
		if (kept.length >= count) break;
		if (!kept.some((k) => key(k) === key(o))) kept.push(o);
	}
	if (kept.length < count) throw new Error(`choose: only ${kept.length} distinct options`);
	const order = shuffle(
		rng,
		kept.map((_, i) => i)
	);
	return { kind: 'choice', options: order.map((i) => kept[i]), correct: order.indexOf(0) };
}

/**
 * The wrong programs among `candidates` that really are wrong: on at least one of `tests` each writes something
 * else than `right` does (or stops, or never ends). Two that write the same on every test count once.
 */
export function wrongPrograms(right: string, candidates: string[], tests: (string | number)[][]): string[] {
	const behaviour = (source: string) => JSON.stringify(tests.map((inputs) => output(source, inputs)));
	const seen = new Set([behaviour(right)]);
	return candidates.filter((source) => {
		const b = behaviour(source);
		if (seen.has(b)) return false;
		seen.add(b);
		return true;
	});
}

/** A flowchart to build: its tests are what `solution` writes on each of `tests`. */
export function chartAnswer(solution: string, tests: (string | number)[][], start = ''): ChartAnswer {
	return {
		kind: 'chart',
		solution,
		...(start ? { start } : {}),
		tests: tests.map((inputs) => {
			const written = output(solution, inputs);
			if (!written) throw new Error(`chartAnswer: the solution does not end on ${inputs.join(', ')}`);
			return { inputs: inputs.map(String), output: written };
		})
	};
}

/**
 * A program to write. `given` is the part the student starts from, as a program of its own (the readings, a
 * variable set to its first value); the editor opens with it and a comment where the rest goes.
 */
export function programAnswer(solution: string, tests: (string | number)[][], given = ''): ProgramAnswer {
	const start = codes(given, tests[0]);
	return {
		kind: 'program',
		solution: codes(solution, tests[0]),
		start: { python: `${start.python}# scrivi qui il resto del programma\n`, cpp: start.cpp.replace('    return 0;\n', '    // scrivi qui il resto del programma\n    return 0;\n') },
		tests: tests.map((inputs) => {
			const written = output(solution, inputs);
			if (!written) throw new Error(`programAnswer: the solution does not end on ${inputs.join(', ')}`);
			return { input: inputs.length ? inputs.join('\n') + '\n' : '', output: written.join('\n') + '\n' };
		})
	};
}

/** What a level builds: a sample without what the generator adds (id, level, seed, format). */
export type Built = Pick<Sample, 'prompt' | 'problem' | 'solution' | 'steps' | 'answer' | 'params'> & Partial<Pick<Sample, 'choice' | 'chart' | 'code' | 'solutionChart' | 'solutionCode'>>;

export interface LevelDef extends LevelSpec {
	build(rng: Rng): Built;
	/** Violations of the level's own constraints, beyond those every sample is checked for. */
	check?(sample: Sample): string[];
}

/**
 * A generator from its levels. Every sample is text; an answer that is not a choice (a chart to build, a program to
 * write) must come with its multiple choice in `choice`. Checked on every sample: four distinct options, the right
 * one among them, no banned writing, and for a chart or a program that the solution passes its own tests.
 */
export function makeGenerator(id: string, title: string, defs: Record<number, LevelDef>): Generator {
	return {
		id,
		title,
		levels: Object.fromEntries(Object.entries(defs).map(([n, d]) => [n, { label: d.label, constraints: d.constraints }])),
		generate(rng, level) {
			const def = defs[level];
			if (!def) throw new Error(`${id}: no level ${level}`);
			return { generatorId: id, level, seed: rng.seed, format: 'text', ...def.build(rng) };
		},
		toChoice(sample) {
			const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
			if (!choice) throw new Error(`${id}: level ${sample.level} has no multiple choice`);
			return choice;
		},
		check(sample) {
			const errors: string[] = [];
			const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
			if (!choice) errors.push('no multiple choice');
			else {
				if (choice.options.length !== 4) errors.push(`${choice.options.length} options`);
				if (new Set(choice.options.map((o) => o.values.join('|'))).size !== choice.options.length) errors.push('two options are the same');
				if (!choice.options[choice.correct]) errors.push('the right option is not there');
			}
			const prose = [sample.prompt, sample.problem, sample.solution, ...sample.steps].join(' ');
			if (BANNED.test(prose)) errors.push('banned writing');
			if (sample.answer.kind === 'chart') {
				const answer = sample.answer;
				for (const test of answer.tests) if (JSON.stringify(output(answer.solution, test.inputs)) !== JSON.stringify(test.output)) errors.push('the solution does not pass its test');
			}
			if (sample.answer.kind === 'program' && sample.answer.tests.length < 2) errors.push('a program needs at least two tests');
			return [...errors, ...(defs[sample.level]?.check?.(sample) ?? [])];
		}
	};
}
