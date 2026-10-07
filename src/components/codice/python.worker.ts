import type { PyodideInterface } from 'pyodide';
import type { PyCallable } from 'pyodide/ffi';
import { emitter, type Changes, type FromRunner, type RunStatus, type ToRunner } from './runtime';

/**
 * Python in the browser: Pyodide in a worker, so a program that never ends cannot freeze the page (the page ends the
 * worker). The runtime and the packages come from /pyodide on the site (scripts/codice/pyodide.mjs); the runner,
 * the turtle and matplotlib's backend are Python files in /codice (public/codice/sapiens.py explains the runner).
 *
 * The packages a program imports (numpy, matplotlib) load before it starts, outside its time limit: the page starts
 * the clock at 'started'.
 */

const MODULES = ['sapiens.py', 'turtle.py', 'sapiens_grafici.py'];
/** Where the modules are written in Pyodide's file system; it goes first on sys.path. */
const HOME = '/sapiens';

const post = (message: FromRunner) => self.postMessage(message);

const loading: Promise<{ pyodide: PyodideInterface; runner: { esegui: PyCallable; colloca: PyCallable; raccogli: PyCallable } }> = (async () => {
	// the worker starts from a blob of the sandbox: the site is where this script comes from
	const origin = new URL(import.meta.url).origin;
	const base = `${origin}/pyodide/`;
	const { loadPyodide } = (await import(/* webpackIgnore: true */ `${base}pyodide.mjs`)) as typeof import('pyodide');
	const [pyodide, sources] = await Promise.all([
		loadPyodide({ indexURL: base }),
		Promise.all(
			MODULES.map(async (name) => {
				const response = await fetch(`${origin}/codice/${name}`);
				if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
				return response.text();
			})
		)
	]);
	pyodide.FS.mkdirTree(HOME);
	MODULES.forEach((name, i) => pyodide.FS.writeFile(`${HOME}/${name}`, sources[i]));
	pyodide.runPython(`import sys; sys.path.insert(0, ${JSON.stringify(HOME)})`);
	return { pyodide, runner: pyodide.pyimport('sapiens') };
})();

loading.then(
	() => post({ type: 'ready' }),
	(error: unknown) => post({ type: 'failed', message: String(error) })
);

/** The packages of Pyodide's distribution that the program imports, loaded once; matplotlib also builds its font cache here. */
async function packages(pyodide: PyodideInterface, id: number, source: string) {
	await pyodide.loadPackagesFromImports(source, {
		messageCallback: (message) => {
			const names = /^Loading (.+)$/.exec(message)?.[1];
			if (names) post({ type: 'status', id, text: `Carico ${names.split(', ').filter((n) => n === 'numpy' || n === 'matplotlib').join(' e ') || 'le librerie'}…` });
		},
		errorCallback: () => {}
	});
	if (pyodide.loadedPackages.matplotlib && !pyodide.globals.has('_pyplot_ready')) {
		pyodide.runPython('import matplotlib.pyplot\n_pyplot_ready = True');
	}
}

self.onmessage = async ({ data }: MessageEvent<ToRunner>) => {
	const ready = await loading.catch(() => null);
	if (!ready) return;
	const { pyodide, runner } = ready;
	const { id, source, inputs, seed, batch = false, files = {} } = data;
	// the modules of the project import packages too
	const sources = [source, ...Object.entries(files).filter(([path]) => path.endsWith('.py')).map(([, text]) => text)];
	await packages(pyodide, id, sources.join('\n')).catch(() => {});
	// the files of the project where the program runs, in place of those of the run before (sapiens.py)
	runner.colloca(JSON.stringify(files));
	post({ type: 'started', id });
	const emit = emitter(batch ? 0 : inputs.length, (kind, text) => post({ type: 'chunk', id, kind, text }));
	const started = performance.now();
	const status = runner.esegui(source, inputs, seed, emit, batch) as RunStatus;
	const ms = performance.now() - started;
	// a run that waits for a line starts again from the same files: what it wrote so far is not the project's yet
	const changes = status === 'input' ? undefined : (JSON.parse(runner.raccogli() as string) as Changes);
	post({ type: 'done', id, status, ms, changes });
};
