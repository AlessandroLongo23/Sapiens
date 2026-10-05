import type { PyodideInterface } from 'pyodide';
import type { PyCallable } from 'pyodide/ffi';
import { emitter, type FromRunner, type RunStatus, type ToRunner } from './runtime';

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

const loading: Promise<{ pyodide: PyodideInterface; esegui: PyCallable }> = (async () => {
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
	const esegui = pyodide.pyimport('sapiens').esegui as PyCallable;
	return { pyodide, esegui };
})();

loading.then(
	() => post({ type: 'ready' }),
	(error: unknown) => post({ type: 'failed', message: String(error) })
);

/** Where a run's files are, and where the program runs: `open("dati.txt")` and `import modulo` look here. */
const PROJECT = '/progetto';

/**
 * Puts the files of the program's project where the program runs, in place of those of the run before. The modules
 * imported from there are forgotten, so a module that was changed is read again.
 */
function place(pyodide: PyodideInterface, files: Record<string, string>) {
	pyodide.runPython(`import os, shutil\nos.chdir("/")\nshutil.rmtree(${JSON.stringify(PROJECT)}, ignore_errors=True)\nos.makedirs(${JSON.stringify(PROJECT)})`);
	for (const [path, text] of Object.entries(files)) {
		const folder = path.split('/').slice(0, -1).join('/');
		if (folder) pyodide.FS.mkdirTree(`${PROJECT}/${folder}`);
		// a folder with nothing in it yet
		if (path.endsWith('/')) continue;
		// a picture is the data URL of its bytes
		const data = /^data:[^,]*;base64,(.*)$/.exec(text);
		pyodide.FS.writeFile(`${PROJECT}/${path}`, data ? Uint8Array.from(atob(data[1]), (c) => c.charCodeAt(0)) : text);
	}
	// after the runner's own modules: a file called turtle.py does not take the turtle's place
	pyodide.runPython(`import importlib, os, sys
os.chdir(${JSON.stringify(PROJECT)})
if ${JSON.stringify(PROJECT)} not in sys.path:
    sys.path.insert(1, ${JSON.stringify(PROJECT)})
for _name, _module in list(sys.modules.items()):
    if (getattr(_module, "__file__", None) or "").startswith(${JSON.stringify(`${PROJECT}/`)}):
        del sys.modules[_name]
importlib.invalidate_caches()`);
}

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
	const { pyodide, esegui } = ready;
	const { id, source, inputs, seed, batch = false, files = {} } = data;
	// the modules of the project import packages too
	const sources = [source, ...Object.entries(files).filter(([path]) => path.endsWith('.py')).map(([, text]) => text)];
	await packages(pyodide, id, sources.join('\n')).catch(() => {});
	place(pyodide, files);
	post({ type: 'started', id });
	const emit = emitter(batch ? 0 : inputs.length, (kind, text) => post({ type: 'chunk', id, kind, text }));
	const started = performance.now();
	const status = esegui(source, inputs, seed, emit, batch) as RunStatus;
	post({ type: 'done', id, status, ms: performance.now() - started });
};
