/**
 * The program of a lesson: a ```codice block of the lesson's markdown, read into what the editor needs
 * (components/codice). The language is on the fence's line; the block is the program the student starts from, and
 * lines beginning with `%%` open its other parts:
 *
 *     ```codice python
 *     a = int(input())
 *     # scrivi qui
 *     %% soluzione
 *     a = int(input())
 *     print(a * 2)
 *     %% prova
 *     4
 *     %% stampa
 *     8
 *     ```
 *
 * `%% prova` starts the lines a test gives to the program and `%% stampa` what the program must print for them:
 * with tests the block is an exercise. `%% soluzione` is a program that passes them. Blocks one after the other,
 * each in a different language, are the same program in more languages: the page shows one, with a tab for each,
 * and the tests are written once, in any of them.
 */

export type Language = 'python' | 'c' | 'cpp';

/** A test of an exercise: the lines the program reads and what it must print. */
export interface Test {
	input: string;
	output: string;
}

export interface CodeVariant {
	language: Language;
	code: string;
	solution: string | null;
}

export interface CodeBlock {
	variants: CodeVariant[];
	tests: Test[];
}

const NAMES: Record<string, Language> = { python: 'python', py: 'python', c: 'c', cpp: 'cpp', 'c++': 'cpp' };

/** A part's text: no empty lines at its ends, one newline to close it. */
const part = (lines: string[]) => {
	const text = lines.join('\n').replace(/^\n+/, '').trimEnd();
	return text ? `${text}\n` : '';
};

/** One fence: `info` is what follows ```codice on its line. */
export function parseCodeFence(info: string, body: string): { variant: CodeVariant | null; tests: Test[]; errors: string[] } {
	const errors: string[] = [];
	const language = NAMES[info.trim().toLowerCase()];
	if (!language) errors.push(`linguaggio "${info.trim()}" non riconosciuto (python, c, cpp)`);

	const parts: { name: string; lines: string[] }[] = [{ name: 'programma', lines: [] }];
	for (const line of body.replace(/\n$/, '').split('\n')) {
		const directive = /^%%\s*(\S+)\s*$/.exec(line);
		if (directive) parts.push({ name: directive[1], lines: [] });
		else parts[parts.length - 1].lines.push(line);
	}

	const code = part(parts[0].lines);
	if (!code) errors.push('il blocco non ha un programma');
	let solution: string | null = null;
	const tests: Test[] = [];
	let input: string | null = null;
	for (const { name, lines } of parts.slice(1)) {
		if (name === 'soluzione') {
			if (solution !== null) errors.push('due parti "%% soluzione"');
			solution = part(lines);
			if (!solution) errors.push('"%% soluzione" vuota');
		} else if (name === 'prova') {
			if (input !== null) errors.push('una "%% prova" senza la sua "%% stampa"');
			input = part(lines);
		} else if (name === 'stampa') {
			if (input === null) errors.push('una "%% stampa" senza la sua "%% prova"');
			else tests.push({ input, output: part(lines) });
			input = null;
		} else errors.push(`parte sconosciuta "%% ${name}" (soluzione, prova, stampa)`);
	}
	if (input !== null) errors.push('una "%% prova" senza la sua "%% stampa"');
	return { variant: language && code ? { language, code, solution } : null, tests, errors };
}

/** The fences of one program, in the order they are written. */
export function parseCodeBlock(fences: { info: string; body: string }[]): { block: CodeBlock | null; errors: string[] } {
	const errors: string[] = [];
	const variants: CodeVariant[] = [];
	let tests: Test[] = [];
	for (const fence of fences) {
		const read = parseCodeFence(fence.info, fence.body);
		errors.push(...read.errors);
		if (read.variant) {
			if (variants.some((v) => v.language === read.variant!.language)) errors.push(`il linguaggio ${read.variant.language} compare due volte nello stesso programma`);
			else variants.push(read.variant);
		}
		if (read.tests.length) {
			if (tests.length) errors.push('le prove sono scritte in più di un blocco: bastano in uno, valgono per tutti i linguaggi');
			else tests = read.tests;
		}
	}
	if (tests.length === 0 && variants.some((v) => v.solution !== null)) errors.push('una soluzione senza prove');
	return { block: errors.length === 0 && variants.length ? { variants, tests } : null, errors };
}

/** What a program printed, as a test compares it: spaces at the end of a line and empty lines at the end do not count. */
export const tidy = (text: string) =>
	text
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trimEnd();

/** The ```codice fences of a text, grouped: fences with only blank lines between them are one program. */
export function codeFences(text: string): { index: number; length: number; fences: { info: string; body: string }[] }[] {
	const groups: { index: number; length: number; fences: { info: string; body: string }[] }[] = [];
	const fence = /```codice[ \t]*([^\n]*)\n([\s\S]*?)\n```[ \t]*(?=\n|$)/g;
	for (const match of text.matchAll(fence)) {
		const last = groups[groups.length - 1];
		const entry = { info: match[1], body: match[2] };
		if (last && /^\s*$/.test(text.slice(last.index + last.length, match.index))) {
			last.fences.push(entry);
			last.length = match.index + match[0].length - last.index;
		} else groups.push({ index: match.index, length: match[0].length, fences: [entry] });
	}
	return groups;
}
