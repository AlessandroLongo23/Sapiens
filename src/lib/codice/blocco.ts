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
 *
 * A group with an `html` block is a web page: its blocks are the page's files (`html`, `css`, `js`), shown together
 * with the page they make. A page prints nothing, so its exercise is checked on what the page is:
 *
 *     ```codice html
 *     <h1></h1>
 *     %% soluzione
 *     <h1>Ciao</h1>
 *     %% controllo Il titolo dice "Ciao"
 *     h1 | testo = Ciao
 *     ```
 *
 * A group whose blocks are named as files (`codice main.py`, `codice geometria.py`) is a project: more files, one
 * of them in the editor, with a tab each. The first block is the file the editor opens. Its exercise is checked as a
 * program's (`%% prova`, `%% stampa`) when "Esegui" runs a program, as a page's (`%% controllo`) when it shows a page.
 * `%% crea`, alone on its line in any block, lets the student make, rename and delete files.
 *
 * `%% controllo` is followed by what the student reads, and its lines are rules: a CSS selector and, after ` | `,
 * what must be true of the elements it finds (see parseRule). A check passes when all its rules do.
 */

import { isImage, kindOf, pathProblem, targetOf, type ProjectFiles } from './progetto';

export type Language = 'python' | 'c' | 'cpp' | 'javascript';

/** The files of a web page, in the order of their tabs. */
export const PAGE_FILES = ['html', 'css', 'js'] as const;
export type PageFile = (typeof PAGE_FILES)[number];
export type Page = Record<PageFile, string>;

/** A test of an exercise: the lines the program reads and what it must print. */
export interface Test {
	input: string;
	output: string;
}

/** What must be true of the elements a selector finds. */
export type Rule = { selector: string } & (
	| { kind: 'exists' }
	| { kind: 'count'; count: number }
	| { kind: 'text'; text: string; exact: boolean }
	| { kind: 'attribute'; name: string; value: string | null }
	| { kind: 'style'; property: string; value: string }
);

/** A check of a page's exercise: what the student reads, and the rules behind it. */
export interface Check {
	description: string;
	rules: Rule[];
}

export interface CodeVariant {
	language: Language;
	code: string;
	solution: string | null;
}

export interface PageBlock {
	files: Page;
	solution: Page | null;
	checks: Check[];
}

export interface ProjectBlock {
	files: ProjectFiles;
	solution: ProjectFiles | null;
	/** The file the editor opens. */
	open: string;
	/** The student can make, rename and delete files. */
	create: boolean;
	tests: Test[];
	checks: Check[];
}

/** A program in one or more languages, with its tests; or a web page, or a project (then `variants` is empty). */
export interface CodeBlock {
	variants: CodeVariant[];
	tests: Test[];
	page?: PageBlock;
	project?: ProjectBlock;
}

const NAMES: Record<string, Language | 'html' | 'css'> = { python: 'python', py: 'python', c: 'c', cpp: 'cpp', 'c++': 'cpp', javascript: 'javascript', js: 'javascript', html: 'html', css: 'css' };

/** A part's text: no empty lines at its ends, one newline to close it. */
const part = (lines: string[]) => {
	const text = lines.join('\n').replace(/^\n+/, '').trimEnd();
	return text ? `${text}\n` : '';
};

/**
 * A rule of a check: `selector`, or `selector | condition`, where the condition is one of
 *
 *     quanti = 3                    how many elements the selector finds
 *     testo = Ciao                  the text of the first, spaces collapsed
 *     testo contiene Ciao
 *     attributo href                the first has the attribute
 *     attributo href = pagina.html
 *     stile color = red             the style the browser computes for the first; the value is read as CSS
 *
 * Without a condition the selector must find something. An error is a sentence.
 */
export function parseRule(line: string): Rule | string {
	const cut = line.lastIndexOf(' | ');
	const selector = (cut < 0 ? line : line.slice(0, cut)).trim();
	const condition = cut < 0 ? '' : line.slice(cut + 3).trim();
	if (!selector) return `regola senza selettore: "${line.trim()}"`;
	if (!condition) return { selector, kind: 'exists' };
	let m: RegExpExecArray | null;
	if ((m = /^quanti\s*=\s*(\d+)$/.exec(condition))) return { selector, kind: 'count', count: Number(m[1]) };
	if ((m = /^testo\s*=\s*(.*)$/.exec(condition))) return { selector, kind: 'text', text: m[1].trim(), exact: true };
	if ((m = /^testo\s+contiene\s+(.+)$/.exec(condition))) return { selector, kind: 'text', text: m[1].trim(), exact: false };
	if ((m = /^attributo\s+([^\s=]+)(?:\s*=\s*(.*))?$/.exec(condition))) return { selector, kind: 'attribute', name: m[1], value: m[2] === undefined ? null : m[2].trim() };
	if ((m = /^stile\s+([a-z-]+)\s*=\s*(.+)$/i.exec(condition))) return { selector, kind: 'style', property: m[1].toLowerCase(), value: m[2].trim() };
	return `condizione non riconosciuta: "${condition}" (quanti, testo, attributo, stile)`;
}

interface Parts {
	code: string;
	solution: string | null;
	tests: Test[];
	checks: Check[];
	/** `%% crea` was written. */
	create: boolean;
	errors: string[];
}

/** The parts of one fence's body. */
function readParts(body: string): Parts {
	const errors: string[] = [];
	const parts: { name: string; argument: string; lines: string[] }[] = [{ name: 'programma', argument: '', lines: [] }];
	for (const line of body.replace(/\n$/, '').split('\n')) {
		const directive = /^%%\s*(\S+)(?:\s+(.*\S))?\s*$/.exec(line);
		if (directive) parts.push({ name: directive[1], argument: directive[2] ?? '', lines: [] });
		else parts[parts.length - 1].lines.push(line);
	}

	const code = part(parts[0].lines);
	let solution: string | null = null;
	const tests: Test[] = [];
	const checks: Check[] = [];
	let input: string | null = null;
	let create = false;
	for (const { name, argument, lines } of parts.slice(1)) {
		if (name !== 'controllo' && argument) errors.push(`"%% ${name}" va da solo sulla riga`);
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
		} else if (name === 'controllo') {
			if (!argument) errors.push('un "%% controllo" senza la frase che lo descrive');
			const rules: Rule[] = [];
			for (const line of lines.filter((l) => l.trim())) {
				const rule = parseRule(line);
				if (typeof rule === 'string') errors.push(rule);
				else rules.push(rule);
			}
			if (rules.length === 0) errors.push(`il controllo "${argument}" non ha regole`);
			checks.push({ description: argument, rules });
		} else if (name === 'crea') {
			create = true;
			if (lines.some((l) => l.trim())) errors.push('"%% crea" va da solo, in fondo al blocco');
		} else errors.push(`parte sconosciuta "%% ${name}" (soluzione, prova, stampa, controllo, crea)`);
	}
	if (input !== null) errors.push('una "%% prova" senza la sua "%% stampa"');
	return { code, solution, tests, checks, create, errors };
}

/** One fence of a program: `info` is what follows ```codice on its line. */
export function parseCodeFence(info: string, body: string): { variant: CodeVariant | null; tests: Test[]; errors: string[] } {
	const name = NAMES[info.trim().toLowerCase()];
	const language = name === 'html' || name === 'css' ? undefined : name;
	const { code, solution, tests, checks, create, errors } = readParts(body);
	if (create) errors.push('"%% crea" vale per i progetti, i blocchi con il nome di un file');
	if (name === 'css') errors.unshift('un blocco css va dopo il blocco html della sua pagina');
	else if (!language) errors.unshift(`linguaggio "${info.trim()}" non riconosciuto (python, c, cpp, javascript, html, css)`);
	if (!code) errors.push('il blocco non ha un programma');
	if (checks.length) errors.push('"%% controllo" vale per le pagine web: un programma si prova con "%% prova" e "%% stampa"');
	return { variant: language && code ? { language, code, solution } : null, tests, errors };
}

/** The fences of a web page: `html`, then `css` and `js` in any order. */
function parsePage(fences: { info: string; body: string }[]): { block: CodeBlock | null; errors: string[] } {
	const errors: string[] = [];
	const files: Page = { html: '', css: '', js: '' };
	const solutions: Partial<Page> = {};
	const checks: Check[] = [];
	const seen = new Set<PageFile>();
	for (const fence of fences) {
		const name = NAMES[fence.info.trim().toLowerCase()];
		const file: PageFile | null = name === 'html' || name === 'css' ? name : name === 'javascript' ? 'js' : null;
		if (!file) {
			errors.push(`una pagina web ha blocchi html, css e js: "${fence.info.trim()}" non è tra questi`);
			continue;
		}
		if (seen.has(file)) errors.push(`il file ${file} compare due volte nella stessa pagina`);
		seen.add(file);
		const read = readParts(fence.body);
		errors.push(...read.errors);
		if (read.tests.length) errors.push('"%% prova" vale per i programmi: una pagina si controlla con "%% controllo"');
		files[file] = read.code;
		if (read.solution !== null) solutions[file] = read.solution;
		checks.push(...read.checks);
	}
	if (!files.html) errors.push('la pagina non ha html');
	const solved = Object.keys(solutions).length > 0;
	if (solved && checks.length === 0) errors.push('una soluzione senza controlli');
	// a file without a solution of its own is the same in the solution
	const solution = solved ? { ...files, ...solutions } : null;
	return { block: errors.length === 0 ? { variants: [], tests: [], page: { files, solution, checks } } : null, errors };
}

/** A fence named as a file: `main.py`, `css/style.css`. */
const isFile = (info: string) => /\.[A-Za-z0-9]+$/.test(info.trim()) && !Object.hasOwn(NAMES, info.trim().toLowerCase());

/** The fences of a project: each is a file, the first the one the editor opens. */
function parseProject(fences: { info: string; body: string }[]): { block: CodeBlock | null; errors: string[] } {
	const errors: string[] = [];
	const files: ProjectFiles = {};
	const solutions: ProjectFiles = {};
	const tests: Test[] = [];
	const checks: Check[] = [];
	let create = false;
	for (const fence of fences) {
		const path = fence.info.trim();
		if (!isFile(path)) {
			errors.push(`in un progetto ogni blocco ha il nome di un file: "${path}" non lo è`);
			continue;
		}
		const problem = pathProblem(path);
		if (problem) errors.push(`${path}: ${problem}`);
		else if (isImage(path)) errors.push(`${path}: un'immagine non si scrive in un blocco`);
		if (path in files) errors.push(`il file ${path} compare due volte nello stesso progetto`);
		const read = readParts(fence.body);
		errors.push(...read.errors.map((e) => `${path}: ${e}`));
		files[path] = read.code;
		if (read.solution !== null) solutions[path] = read.solution;
		tests.push(...read.tests);
		checks.push(...read.checks);
		create ||= read.create;
	}
	const paths = Object.keys(files);
	const open = paths[0] ?? '';
	const target = targetOf(open, paths) ? open : paths.find((path) => targetOf(path, paths));
	const kind = target ? targetOf(target, paths) : null;
	if (tests.length && kind !== 'program') errors.push('"%% prova" vale quando Esegui avvia un programma: qui il primo file eseguibile è una pagina');
	if (checks.length && kind !== 'page') errors.push('"%% controllo" vale quando Esegui mostra una pagina: qui il primo file eseguibile è un programma');
	if (target && kindOf(target) === 'markdown' && checks.length) errors.push('i controlli valgono per le pagine html');
	const solved = Object.keys(solutions).length > 0;
	if (solved && tests.length === 0 && checks.length === 0) errors.push('una soluzione senza prove né controlli');
	return { block: errors.length === 0 ? { variants: [], tests: [], project: { files, solution: solved ? { ...files, ...solutions } : null, open, create, tests, checks } } : null, errors };
}

/** The fences of one program, in the order they are written. */
export function parseCodeBlock(fences: { info: string; body: string }[]): { block: CodeBlock | null; errors: string[] } {
	if (fences.some((fence) => isFile(fence.info))) return parseProject(fences);
	if (fences.some((fence) => fence.info.trim().toLowerCase() === 'html')) return parsePage(fences);
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
