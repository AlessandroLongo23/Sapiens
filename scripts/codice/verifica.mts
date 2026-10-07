/**
 * Runs the exercises of lesson files: every ```codice block with tests has its solutions run on them, in each
 * language, with the same Python and the same Clang the site gives the student (Pyodide and @yowasp/clang, here in
 * Node); JavaScript runs in Node's own engine. A project of more files is run with its files around it, as in the
 * editor, and a test's `%% file` is compared with what the program wrote. The checks of a web page need a browser
 * and are not run. An error (exit code 1) is a solution that does not pass a test, or a block that cannot be read;
 * a warning is a starting program that already passes every test, or an exercise with no solution to check.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/*.md
 */
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { MAIN, codeFences, grade, parseCodeBlock, tidy, type Language, type Test } from '../../src/lib/codice/blocco';
import { kindOf, targetOf, type ProjectFiles } from '../../src/lib/codice/progetto';
import type { Changes } from '../../src/components/codice/runtime';
import { OUTPUT, compileArgs, compileFiles } from '../../src/components/codice/clang-args';
import { runWasi } from '../../src/components/codice/wasi';
import { environment, random } from '../../src/components/codice/js-environment';

/** A program and, when it is in a project, the files of the project (the program is one of them). */
interface Program {
	source: string;
	files?: ProjectFiles;
}

type Run = (program: Program, test: Test) => Promise<{ printed: string; failure: string | null; changes?: Changes }>;

const lines = (input: string) => (input === '' ? [] : input.replace(/\n$/, '').split('\n'));

let python: Promise<Run> | null = null;
function loadPython(): Promise<Run> {
	return (python ??= (async () => {
		const { loadPyodide } = await import('pyodide');
		const pyodide = await loadPyodide();
		pyodide.FS.mkdirTree('/sapiens');
		for (const name of ['sapiens.py', 'turtle.py', 'sapiens_grafici.py']) pyodide.FS.writeFile(`/sapiens/${name}`, readFileSync(`public/codice/${name}`, 'utf8'));
		pyodide.runPython('import sys; sys.path.insert(0, "/sapiens")');
		const { esegui, colloca, raccogli } = pyodide.pyimport('sapiens');
		return async ({ source, files }, test) => {
			let printed = '';
			let errors = '';
			colloca(JSON.stringify(files ?? {}));
			const status = esegui(source, lines(test.input), 1, (kind: string, text: string) => {
				if (kind === 'out') printed += text;
				else if (kind === 'err') errors += text;
				return true;
			}, true) as string;
			return { printed, failure: status === 'ok' ? null : errors.trim().split('\n').pop() || status, changes: JSON.parse(raccogli()) as Changes };
		};
	})());
}

let clang: Promise<(language: 'c' | 'cpp') => Run> | null = null;
function loadClang(): Promise<(language: 'c' | 'cpp') => Run> {
	return (clang ??= (async () => {
		const { runClang } = await import('@yowasp/clang');
		const built = new Map<string, { module: WebAssembly.Module | null; diagnostics: string }>();
		return (language) => async ({ source, files }, test) => {
			const key = `${language}\n${source}\n${files ? JSON.stringify(files) : ''}`;
			if (!built.has(key)) {
				let diagnostics = '';
				const collect = (bytes: Uint8Array | null) => {
					if (bytes) diagnostics += new TextDecoder().decode(bytes);
				};
				try {
					const made = (await runClang(compileArgs(language, files), compileFiles(language, source, files), { stdout: collect, stderr: collect, fetchProgress: () => {} })) as Record<string, Uint8Array>;
					built.set(key, { module: await WebAssembly.compile(made[OUTPUT] as BufferSource), diagnostics });
				} catch {
					built.set(key, { module: null, diagnostics });
				}
			}
			const { module, diagnostics } = built.get(key)!;
			if (!module) return { printed: '', failure: `non compila: ${diagnostics.trim().split('\n')[0]}` };
			let printed = '';
			let errors = '';
			const { status, changes } = runWasi(module, { inputs: lines(test.input), seed: 1, clock: 0, batch: true, files }, (kind, text) => {
				if (kind === 'out') printed += text;
				else if (kind === 'err') errors += text;
				return true;
			});
			return { printed, failure: status === 'ok' ? null : errors.trim() || status, changes };
		};
	})());
}

/** JavaScript with the console and the prompt() the editor gives it; timers are not waited for. */
const javascript: Run = async ({ source }, test) => {
	let printed = '';
	const scope = environment(lines(test.input), true, (kind, text) => void (kind === 'out' && (printed += text)), () => {
		throw new Error('input finito');
	});
	try {
		runInNewContext(source, { ...scope, Math: Object.assign(Object.create(Math), { random: random(1) }) }, { timeout: 10_000 });
		return { printed, failure: null };
	} catch (error) {
		return { printed, failure: String(error) };
	}
};

const runner = async (language: Language): Promise<Run> => (language === 'python' ? loadPython() : language === 'javascript' ? javascript : (await loadClang())(language));

let errors = 0;
let exercises = 0;
for (const file of process.argv.slice(2)) {
	const text = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
	const out: string[] = [];
	const err = (message: string) => {
		errors++;
		out.push(`  ERRORE ${message}`);
	};
	for (const [index, group] of codeFences(text).entries()) {
		const { block, errors: unread } = parseCodeBlock(group.fences);
		const where = `programma ${index + 1}`;
		unread.forEach((e) => err(`${where}: ${e}`));
		if (block?.project?.checks.length) out.push(`  avviso ${where}: progetto di pagine, i controlli si provano nel browser`);
		if (block?.page?.checks.length) out.push(`  avviso ${where}: pagina web, i controlli si provano nel browser`);
		if (!block) continue;

		// what is run: each language of a program, with its files of data, or the program "Esegui" starts in a project
		const programs: { language: Language; start: Program; solution: Program | null }[] = [];
		let tests = block.tests;
		const { project, data } = block;
		if (project) {
			tests = project.tests;
			const paths = Object.keys(project.files);
			const target = targetOf(project.open, paths) ? project.open : paths.find((path) => targetOf(path, paths));
			const kind = target ? kindOf(target) : null;
			if (target && (kind === 'python' || kind === 'c' || kind === 'cpp' || kind === 'javascript')) programs.push({ language: kind, start: { source: project.files[target], files: project.files }, solution: project.solution && { source: project.solution[target], files: project.solution } });
		} else {
			const among = (language: Language, source: string): Program => ({ source, files: data && { [MAIN[language]]: source, ...data } });
			for (const { language, code, solution } of block.variants) programs.push({ language, start: among(language, code), solution: solution === null ? null : among(language, solution) });
		}
		if (tests.length === 0) continue;
		exercises++;
		for (const { language, start, solution } of programs) {
			const run = await runner(language);
			const passes = async (program: Program) => {
				for (const [i, test] of tests.entries()) {
					const { printed, failure, changes } = await run(program, test);
					if (failure) return `prova ${i + 1}: ${failure}`;
					const verdict = grade(test, printed, program.files, changes);
					if (!verdict.printed) return `prova ${i + 1}: atteso "${tidy(test.output ?? '')}", ottenuto "${tidy(printed)}"`;
					const file = verdict.files.find((one) => !one.passed);
					if (file) return `prova ${i + 1}: nel file ${file.path} atteso "${file.expected}", ottenuto ${file.got === null ? 'nessun file di testo' : `"${file.got}"`}`;
				}
				return null;
			};
			if (solution === null) out.push(`  avviso ${where} (${language}): esercizio senza soluzione da controllare`);
			else {
				const wrong = await passes(solution);
				if (wrong) err(`${where} (${language}): la soluzione non supera la ${wrong}`);
			}
			if ((await passes(start)) === null) out.push(`  avviso ${where} (${language}): il programma di partenza supera già tutte le prove`);
		}
	}
	if (out.length) console.log(`${file}\n${out.join('\n')}`);
}
console.log(`${exercises} esercizi controllati, ${errors} errori`);
process.exit(errors ? 1 : 0);
