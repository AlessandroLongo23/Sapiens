/**
 * Runs the exercises of lesson files: every ```codice block with tests has its solutions run on them, in each
 * language, with the same Python and the same Clang the site gives the student (Pyodide and @yowasp/clang, here in
 * Node); JavaScript runs in Node's own engine. The checks of a web page need a browser and are not run. An error (exit code 1) is a solution that does not pass a test, or a block that cannot be read; a warning is
 * a starting program that already passes every test, or an exercise with no solution to check.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/*.md
 */
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { codeFences, parseCodeBlock, tidy, type Language, type Test } from '../../src/lib/codice/blocco';
import { OUTPUT, compileArgs, compileFiles } from '../../src/components/codice/clang-args';
import { runWasi } from '../../src/components/codice/wasi';
import { environment, random } from '../../src/components/codice/js-environment';

type Run = (source: string, test: Test) => Promise<{ printed: string; failure: string | null }>;

const lines = (input: string) => (input === '' ? [] : input.replace(/\n$/, '').split('\n'));

let python: Promise<Run> | null = null;
function loadPython(): Promise<Run> {
	return (python ??= (async () => {
		const { loadPyodide } = await import('pyodide');
		const pyodide = await loadPyodide();
		pyodide.FS.mkdirTree('/sapiens');
		for (const name of ['sapiens.py', 'turtle.py', 'sapiens_grafici.py']) pyodide.FS.writeFile(`/sapiens/${name}`, readFileSync(`public/codice/${name}`, 'utf8'));
		pyodide.runPython('import sys; sys.path.insert(0, "/sapiens")');
		const esegui = pyodide.pyimport('sapiens').esegui;
		return async (source, test) => {
			let printed = '';
			let errors = '';
			const status = esegui(source, lines(test.input), 1, (kind: string, text: string) => {
				if (kind === 'out') printed += text;
				else if (kind === 'err') errors += text;
				return true;
			}, true) as string;
			return { printed, failure: status === 'ok' ? null : errors.trim().split('\n').pop() || status };
		};
	})());
}

let clang: Promise<(language: 'c' | 'cpp') => Run> | null = null;
function loadClang(): Promise<(language: 'c' | 'cpp') => Run> {
	return (clang ??= (async () => {
		const { runClang } = await import('@yowasp/clang');
		const built = new Map<string, { module: WebAssembly.Module | null; diagnostics: string }>();
		return (language) => async (source, test) => {
			const key = `${language}\n${source}`;
			if (!built.has(key)) {
				let diagnostics = '';
				const collect = (bytes: Uint8Array | null) => {
					if (bytes) diagnostics += new TextDecoder().decode(bytes);
				};
				try {
					const files = (await runClang(compileArgs(language), compileFiles(language, source), { stdout: collect, stderr: collect, fetchProgress: () => {} })) as Record<string, Uint8Array>;
					built.set(key, { module: await WebAssembly.compile(files[OUTPUT] as BufferSource), diagnostics });
				} catch {
					built.set(key, { module: null, diagnostics });
				}
			}
			const { module, diagnostics } = built.get(key)!;
			if (!module) return { printed: '', failure: `non compila: ${diagnostics.trim().split('\n')[0]}` };
			let printed = '';
			let errors = '';
			const { status } = runWasi(module, { inputs: lines(test.input), seed: 1, clock: 0, batch: true }, (kind, text) => {
				if (kind === 'out') printed += text;
				else if (kind === 'err') errors += text;
				return true;
			});
			return { printed, failure: status === 'ok' ? null : errors.trim() || status };
		};
	})());
}

/** JavaScript with the console and the prompt() the editor gives it; timers are not waited for. */
const javascript: Run = async (source, test) => {
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
		if (block?.project && (block.project.tests.length || block.project.checks.length)) out.push(`  avviso ${where}: progetto a più file, le prove e i controlli si provano nel browser`);
		if (block?.page?.checks.length) out.push(`  avviso ${where}: pagina web, i controlli si provano nel browser`);
		if (!block || block.tests.length === 0) continue;
		exercises++;
		for (const variant of block.variants) {
			const run = await runner(variant.language);
			const passes = async (source: string) => {
				for (const [i, test] of block.tests.entries()) {
					const { printed, failure } = await run(source, test);
					if (failure) return `prova ${i + 1}: ${failure}`;
					if (tidy(printed) !== tidy(test.output)) return `prova ${i + 1}: atteso "${tidy(test.output)}", ottenuto "${tidy(printed)}"`;
				}
				return null;
			};
			if (variant.solution === null) out.push(`  avviso ${where} (${variant.language}): esercizio senza soluzione da controllare`);
			else {
				const wrong = await passes(variant.solution);
				if (wrong) err(`${where} (${variant.language}): la soluzione non supera la ${wrong}`);
			}
			if ((await passes(variant.code)) === null) out.push(`  avviso ${where} (${variant.language}): il programma di partenza supera già tutte le prove`);
		}
	}
	if (out.length) console.log(`${file}\n${out.join('\n')}`);
}
console.log(`${exercises} esercizi controllati, ${errors} errori`);
process.exit(errors ? 1 : 0);
