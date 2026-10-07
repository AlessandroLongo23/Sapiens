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
 * A test can also say what a file must hold when the program has ended: `%% file uscita.txt` after the `%% prova`,
 * followed by the text of the file. A test has its `%% stampa`, its files, or both; without `%% stampa` what the
 * program prints is not compared.
 *
 *     %% prova
 *     3
 *     %% stampa
 *     Fatto
 *     %% file uscita.txt
 *     1
 *     2
 *     3
 *
 * Blocks named as files of data (`codice dati.txt`, `codice voti.csv`) after the blocks of the languages are the
 * files the program finds beside it, the same for every language: the page shows them with a tab each, after the
 * program's.
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
 *
 * Before its rules a check may have actions, lines that begin with `>` (see parseAction): they are done on the
 * student's page, loaded anew for that check, and the rules are read on what the page has become.
 *
 *     %% controllo Dopo due clic il contatore segna 2
 *     > clic #piu
 *     > clic #piu
 *     #conta | testo = 2
 */

import { isImage, kindOf, pathProblem, targetOf, type ProjectFiles } from './progetto';

export type Language = 'python' | 'c' | 'cpp' | 'javascript';

/** The files of a web page, in the order of their tabs. */
export const PAGE_FILES = ['html', 'css', 'js'] as const;
export type PageFile = (typeof PAGE_FILES)[number];
export type Page = Record<PageFile, string>;

/**
 * A test of an exercise: the lines the program reads, what it must print (null when that is not compared) and what
 * the files it writes must hold at its end, by path.
 */
export interface Test {
	input: string;
	output: string | null;
	files?: Record<string, string>;
}

/** What must be true of the elements a selector finds. `@avviso` in the selector's place is the messages of alert(), confirm() and prompt(). */
export type Rule = { selector: string } & (
	| { kind: 'exists' }
	| { kind: 'absent' }
	| { kind: 'count'; count: number }
	| { kind: 'text'; text: string; exact: boolean }
	| { kind: 'attribute'; name: string; value: string | null }
	| { kind: 'style'; property: string; value: string }
	| { kind: 'visible'; visible: boolean }
	| { kind: 'class'; name: string; has: boolean }
	| { kind: 'value'; value: string }
	| { kind: 'checked'; checked: boolean }
	| { kind: 'sent'; sent: boolean }
);

/** The selector that stands for the dialogs the page opened. */
export const DIALOGS = '@avviso';

/** What a check does on the page before its rules are read, as a student would. */
export type Action =
	| { kind: 'click' | 'check' | 'uncheck' | 'submit'; selector: string }
	| { kind: 'type' | 'select' | 'key'; selector: string; text: string }
	| { kind: 'wait'; ms: number }
	| { kind: 'width'; width: number };

/** The widths a check can give to the preview, in pixels. */
export const WIDTHS = [200, 2000];

/** The longest a check waits, all its `aspetta` together. */
export const MAX_WAIT = 3000;

/** A check of a page's exercise: what the student reads, the rules behind it, and the actions done before them. */
export interface Check {
	description: string;
	rules: Rule[];
	actions?: Action[];
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
	/** The files of data every variant finds beside it, by path. */
	data?: ProjectFiles;
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
 *     attributo href = pagina.html   for `href`, `src` and `action` two paths to the same file are the same
 *     stile color = red             the style the browser computes for the first; the value is read as CSS
 *     non esiste                    the selector finds nothing
 *     visibile / nascosto           the first takes room on the page and is not `visibility: hidden`, or the opposite
 *     classe errore / senza classe errore
 *     valore = Anna                 what is written in the first, a field
 *     spuntato / non spuntato       the first, a checkbox or a radio button
 *     inviato / non inviato         the first, a form: a `submit` that nothing prevented has happened, or not
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
	if (condition === 'non esiste') return { selector, kind: 'absent' };
	if (condition === 'visibile' || condition === 'nascosto') return { selector, kind: 'visible', visible: condition === 'visibile' };
	if ((m = /^(senza\s+)?classe\s+(\S+)$/.exec(condition))) return { selector, kind: 'class', name: m[2].replace(/^\./, ''), has: !m[1] };
	if ((m = /^valore\s*=\s*(.*)$/.exec(condition))) return { selector, kind: 'value', value: m[1].trim() };
	if ((m = /^(non\s+)?spuntat[oa]$/.exec(condition))) return { selector, kind: 'checked', checked: !m[1] };
	if ((m = /^(non\s+)?inviato$/.exec(condition))) return { selector, kind: 'sent', sent: !m[1] };
	return `condizione non riconosciuta: "${condition}" (quanti, testo, attributo, stile, non esiste, visibile, nascosto, classe, valore, spuntato, inviato)`;
}

/**
 * An action of a check, the line after its `>`:
 *
 *     clic #piu                     a click on the first element the selector finds
 *     scrivi #nome | Anna           the text in the place of what the field holds, with `input` and `change`
 *     scegli #classe | Terza        the option of a select, by its text or its value
 *     spunta #accetto / togli #accetto
 *     invia form                    the form is sent as its button would (the fields are validated first)
 *     premi #nome | Enter           `keydown` and `keyup` of a key on the element
 *     aspetta 500                   milliseconds, for a page that answers after a while
 *     larghezza 400                 the preview is made this wide, in pixels, for the rest of the check
 *
 * An error is a sentence.
 */
export function parseAction(line: string): Action | string {
	const [, verb = '', rest = ''] = /^(\S+)\s*(.*)$/.exec(line.trim()) ?? [];
	const cut = rest.indexOf(' | ');
	const selector = (cut < 0 ? rest.replace(/\s*\|$/, '') : rest.slice(0, cut)).trim();
	const text = cut < 0 ? null : rest.slice(cut + 3).trim();
	if (verb === 'aspetta') return /^\d+$/.test(rest) && Number(rest) <= MAX_WAIT ? { kind: 'wait', ms: Number(rest) } : `"aspetta" vuole i millisecondi, al più ${MAX_WAIT}: "${line.trim()}"`;
	if (verb === 'larghezza') return /^\d+$/.test(rest) && Number(rest) >= WIDTHS[0] && Number(rest) <= WIDTHS[1] ? { kind: 'width', width: Number(rest) } : `"larghezza" vuole i pixel, da ${WIDTHS[0]} a ${WIDTHS[1]}: "${line.trim()}"`;
	const plain = { clic: 'click', spunta: 'check', togli: 'uncheck', invia: 'submit' } as const;
	const worded = { scrivi: 'type', scegli: 'select', premi: 'key' } as const;
	if (!Object.hasOwn(plain, verb) && !Object.hasOwn(worded, verb)) return `azione non riconosciuta: "${line.trim()}" (clic, scrivi, scegli, spunta, togli, invia, premi, aspetta, larghezza)`;
	if (!selector) return `azione senza selettore: "${line.trim()}"`;
	if (Object.hasOwn(plain, verb)) return text === null ? { kind: plain[verb as keyof typeof plain], selector } : `"${verb}" vuole solo il selettore: "${line.trim()}"`;
	// a field is emptied by writing nothing in it: `scrivi #nome |`
	if (text === null && !(verb === 'scrivi' && /\|$/.test(rest))) return `"${verb}" vuole il selettore e, dopo " | ", ${verb === 'scrivi' ? 'il testo' : verb === 'scegli' ? "l'opzione" : 'il tasto'}: "${line.trim()}"`;
	if (verb !== 'scrivi' && !text) return `"${verb}" senza ${verb === 'scegli' ? "l'opzione" : 'il tasto'}: "${line.trim()}"`;
	return { kind: worded[verb as keyof typeof worded], selector, text: text ?? '' };
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
	/** The test being read: it is closed by the next `%% prova`, or by the end of the block. */
	let test: Test | null = null;
	const close = () => {
		if (!test) return;
		if (test.output === null && !test.files) errors.push('una "%% prova" senza la sua "%% stampa" (o un "%% file")');
		else tests.push(test);
		test = null;
	};
	let create = false;
	for (const { name, argument, lines } of parts.slice(1)) {
		if (name !== 'controllo' && name !== 'file' && argument) errors.push(`"%% ${name}" va da solo sulla riga`);
		if (name === 'soluzione') {
			if (solution !== null) errors.push('due parti "%% soluzione"');
			solution = part(lines);
			if (!solution) errors.push('"%% soluzione" vuota');
		} else if (name === 'prova') {
			close();
			test = { input: part(lines), output: null };
		} else if (name === 'stampa') {
			if (!test || test.output !== null) errors.push('una "%% stampa" senza la sua "%% prova"');
			else test.output = part(lines);
		} else if (name === 'file') {
			const problem = argument ? pathProblem(argument) : null;
			if (!argument) errors.push('un "%% file" senza il nome del file');
			else if (problem) errors.push(`%% file ${argument}: ${problem}`);
			else if (isImage(argument)) errors.push(`%% file ${argument}: un'immagine non si confronta`);
			else if (!test) errors.push(`"%% file ${argument}" senza la sua "%% prova"`);
			else if (test.files && argument in test.files) errors.push(`il file ${argument} compare due volte nella stessa prova`);
			else (test.files ??= {})[argument] = part(lines);
		} else if (name === 'controllo') {
			if (!argument) errors.push('un "%% controllo" senza la frase che lo descrive');
			const rules: Rule[] = [];
			const actions: Action[] = [];
			let waited = 0;
			for (const line of lines.filter((l) => l.trim())) {
				const read = line.startsWith('>') ? parseAction(line.slice(1)) : parseRule(line);
				if (typeof read === 'string') errors.push(read);
				else if ('selector' in read && !line.startsWith('>')) rules.push(read as Rule);
				else if (rules.length) errors.push(`nel controllo "${argument}" le azioni vanno prima delle regole`);
				else {
					actions.push(read as Action);
					if (read.kind === 'wait' && (waited += read.ms) > MAX_WAIT) errors.push(`il controllo "${argument}" aspetta più di ${MAX_WAIT} millisecondi`);
				}
			}
			if (rules.length === 0) errors.push(`il controllo "${argument}" non ha regole`);
			checks.push({ description: argument, rules, ...(actions.length > 0 && { actions }) });
		} else if (name === 'crea') {
			create = true;
			if (lines.some((l) => l.trim())) errors.push('"%% crea" va da solo, in fondo al blocco');
		} else errors.push(`parte sconosciuta "%% ${name}" (soluzione, prova, stampa, file, controllo, crea)`);
	}
	close();
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

/** The name a variant's program has among the files of data beside it. */
export const MAIN: Record<Language, string> = { python: 'main.py', c: 'main.c', cpp: 'main.cpp', javascript: 'main.js' };

/** A fence named as a file of data: text a program reads, which "Esegui" could not run or show. */
const isData = (info: string) => isFile(info) && ['text', 'json'].includes(kindOf(info.trim()) ?? '');

/** The fences of one program, in the order they are written. */
export function parseCodeBlock(fences: { info: string; body: string }[]): { block: CodeBlock | null; errors: string[] } {
	// a program in more languages with its files of data: the fences of the languages, then those of the files
	const withData = fences.some((fence) => isData(fence.info)) && fences.some((fence) => !isFile(fence.info)) && fences.every((fence) => !isFile(fence.info) || isData(fence.info));
	if (!withData && fences.some((fence) => isFile(fence.info))) return parseProject(fences);
	if (fences.some((fence) => fence.info.trim().toLowerCase() === 'html')) return parsePage(fences);
	const errors: string[] = [];
	const variants: CodeVariant[] = [];
	let tests: Test[] = [];
	const data: ProjectFiles = {};
	for (const fence of fences) {
		if (isData(fence.info)) {
			const path = fence.info.trim();
			const problem = pathProblem(path);
			if (problem) errors.push(`${path}: ${problem}`);
			if (path in data || Object.values(MAIN).includes(path)) errors.push(`il file ${path} compare due volte nello stesso programma`);
			if (/^%%/m.test(fence.body)) errors.push(`${path}: un file di dati non ha parti "%%"`);
			// a file of data is kept as it is written, with its empty lines
			data[path] = `${fence.body.replace(/\n+$/, '')}\n`;
			continue;
		}
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
	if (withData && variants.length === 0 && errors.length === 0) errors.push('i file di dati vanno dopo il blocco del programma');
	return { block: errors.length === 0 && variants.length ? { variants, tests, ...(withData && { data }) } : null, errors };
}

/** What a program printed, as a test compares it: spaces at the end of a line and empty lines at the end do not count. */
export const tidy = (text: string) =>
	text
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trimEnd();

/** How a file of a test went: `got` is what the file holds at the end of the run, null when there is no such file of text. */
export interface FileVerdict {
	path: string;
	expected: string;
	got: string | null;
	passed: boolean;
}

/**
 * A run against its test. `printed` is what the program printed, `files` the files it started with and `changes`
 * what it did to them (see Changes in components/codice/runtime.ts). A file is compared as printed text is.
 */
export function grade(test: Test, printed: string, files?: Record<string, string>, changes?: { written: Record<string, string | null>; removed: string[] }): { passed: boolean; printed: boolean; files: FileVerdict[] } {
	const right = test.output === null || tidy(printed) === tidy(test.output);
	const verdicts = Object.entries(test.files ?? {}).map(([path, expected]): FileVerdict => {
		const got = changes && path in changes.written ? changes.written[path] : changes?.removed.includes(path) ? null : (files?.[path] ?? null);
		return { path, expected: tidy(expected), got: got === null ? null : tidy(got), passed: got !== null && tidy(got) === tidy(expected) };
	});
	return { passed: right && verdicts.every((verdict) => verdict.passed), printed: right, files: verdicts };
}

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
