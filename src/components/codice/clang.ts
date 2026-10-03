import type { FromCompiler, ToCompiler } from './clang.worker';
import { TIME_LIMIT, type FromRunner, type Job, type Listeners, type Outcome, type Result, type Runtime } from './runtime';
import type { ToWasi } from './wasi.worker';

/**
 * C and C++: the page's side of the compiler (clang.worker.ts) and of the worker that runs a compiled program
 * (wasi.worker.ts). The compiler stays loaded for the whole visit; every run has a new worker, ended when the
 * program is over or takes too long. A program that waits for the keyboard is run again for every line typed, and
 * the compiled program is kept, so only the first of those runs compiles.
 */

interface Run extends Listeners {
	id: number;
	finish: (result: Result) => void;
	timer?: ReturnType<typeof setTimeout>;
	worker?: Worker;
}

/** Clang's own words for a C++ feature this compiler does not have, and what to tell the student. */
const NO_EXCEPTIONS = /cannot use '(try|throw)' with exceptions disabled/;

export class Clang implements Runtime {
	private compiler: Worker | null = null;
	private loading: Promise<boolean> | null = null;
	private up = false;
	private current: Run | null = null;
	private ids = 0;
	/** The last program compiled, and what the compiler said about it. */
	private built: { language: string; source: string; module: WebAssembly.Module | null; diagnostics: string } | null = null;
	private compiled: ((message: Extract<FromCompiler, { type: 'compiled' }>) => void) | null = null;
	private onProgress: ((percent: number) => void) | null = null;

	load(): Promise<boolean> {
		if (this.loading) return this.loading;
		const worker = new Worker(new URL('./clang.worker.ts', import.meta.url), { type: 'module' });
		this.compiler = worker;
		this.loading = new Promise((resolve) => {
			worker.addEventListener('message', ({ data }: MessageEvent<FromCompiler>) => {
				if (data.type === 'ready') {
					this.up = true;
					resolve(true);
				} else if (data.type === 'failed') resolve(false);
				else if (data.type === 'progress') this.onProgress?.(data.percent);
				else this.compiled?.(data);
			});
			worker.addEventListener('error', () => resolve(false));
		});
		return this.loading;
	}

	get ready() {
		return this.up;
	}

	async run(job: Job, listeners: Listeners): Promise<Result> {
		this.stop();
		const id = ++this.ids;
		return new Promise((finish) => {
			const run: Run = { id, ...listeners, finish };
			this.current = run;
			void this.start(run, job);
		});
	}

	private async start(run: Run, job: Job) {
		if (!this.up) {
			this.onProgress = (percent) => this.current === run && run.onStatus?.(percent < 100 ? `Scarico il compilatore… ${percent}%` : 'Preparo il compilatore…');
			run.onStatus?.('Carico il compilatore…');
		}
		const ok = await this.load();
		this.onProgress = null;
		if (this.current !== run) return;
		if (!ok) {
			this.compiler?.terminate();
			this.compiler = null;
			this.loading = null;
			return this.end('failed');
		}
		const language = job.language === 'c' ? 'c' : 'cpp';
		if (this.built?.source !== job.source || this.built.language !== language) {
			run.onStatus?.('Compilo…');
			const message = await new Promise<Extract<FromCompiler, { type: 'compiled' }>>((resolve) => {
				this.compiled = (data) => data.id === run.id && resolve(data);
				this.compiler!.postMessage({ id: run.id, language, source: job.source } satisfies ToCompiler);
			});
			const program = message.wasm ? await WebAssembly.compile(message.wasm as BufferSource) : null;
			this.built = { language, source: job.source, module: program, diagnostics: message.diagnostics };
			if (this.current !== run) return;
		}
		const { module: program, diagnostics } = this.built;
		// the compiler's warnings and errors come before the program's output, and only on the first of the reruns
		if (diagnostics && (job.batch || job.inputs.length === 0)) {
			run.onChunk({ kind: 'err', text: diagnostics });
			if (NO_EXCEPTIONS.test(diagnostics)) run.onChunk({ kind: 'note', text: 'Nell’editor di Sapiens il C++ non ha le eccezioni: try, catch e throw non si possono usare.' });
		}
		if (!program) return this.end('error');

		const worker = new Worker(new URL('./wasi.worker.ts', import.meta.url), { type: 'module' });
		run.worker = worker;
		worker.addEventListener('message', ({ data }: MessageEvent<FromRunner>) => {
			if (this.current !== run || !('id' in data)) return;
			if (data.type === 'chunk') run.onChunk({ kind: data.kind, text: data.text });
			else if (data.type === 'started') {
				run.timer = setTimeout(() => this.stop('timeout'), TIME_LIMIT);
				run.onStart?.();
			} else if (data.type === 'done') this.end(data.status, data.ms);
		});
		worker.addEventListener('error', () => this.current === run && this.end('failed'));
		worker.postMessage({ id: run.id, module: program, ...job } satisfies ToWasi);
	}

	/** Ends the program; the compiler stays. */
	stop(outcome: Outcome = 'stopped') {
		this.end(outcome);
	}

	dispose() {
		this.end('stopped');
		this.compiler?.terminate();
		this.compiler = null;
		this.loading = null;
		this.up = false;
	}

	private end(outcome: Outcome, ms = 0) {
		const run = this.current;
		if (!run) return;
		this.current = null;
		clearTimeout(run.timer);
		run.worker?.terminate();
		run.finish({ outcome, ms });
	}
}
