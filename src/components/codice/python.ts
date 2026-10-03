/** The page's side of the Python worker (python.worker.ts): starts it, runs a program, ends it when it takes too long. */

/** What the worker sends while a program runs: printed text, an error's text, a line typed at an `input()`, a matplotlib figure (PNG in base64), turtle operations (JSON). */
export type ChunkKind = 'out' | 'err' | 'in' | 'image' | 'turtle';

/** A piece of the console: what the worker sent, or a note from Sapiens. */
export interface Chunk {
	kind: ChunkKind | 'note';
	text: string;
}

/** How the worker says a run ended: finished, raised an error, waiting for a line, printed too much. */
export type RunStatus = 'ok' | 'error' | 'input' | 'overflow';
/** Plus the ends the page decides: out of time, stopped by the student, Python not loaded. */
export type Outcome = RunStatus | 'timeout' | 'stopped' | 'failed';

export interface ToWorker {
	id: number;
	source: string;
	inputs: string[];
	seed: number;
}

export type FromWorker =
	| { type: 'ready' }
	| { type: 'failed'; message: string }
	| { type: 'status'; id: number; text: string }
	| { type: 'started'; id: number }
	| { type: 'chunk'; id: number; kind: ChunkKind; text: string }
	| { type: 'done'; id: number; status: RunStatus; ms: number };

/** A program still running after this long is taken for a loop that never ends. */
export const TIME_LIMIT = 10_000;

export interface Listeners {
	onChunk: (chunk: Chunk) => void;
	/** What the worker is doing before the program starts, like loading numpy. */
	onStatus?: (text: string) => void;
	/** The program has started, its packages loaded. */
	onStart?: () => void;
}

interface Run extends Listeners {
	id: number;
	finish: (result: { outcome: Outcome; ms: number }) => void;
	timer?: ReturnType<typeof setTimeout>;
}

export class Python {
	private worker: Worker | null = null;
	private loading: Promise<boolean> | null = null;
	private up = false;
	private current: Run | null = null;
	private ids = 0;

	/** Starts the worker and Pyodide's download, once; false when it could not load. */
	load(): Promise<boolean> {
		if (this.loading) return this.loading;
		const worker = new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
		this.worker = worker;
		this.loading = new Promise((resolve) => {
			worker.addEventListener('message', ({ data }: MessageEvent<FromWorker>) => {
				if (data.type === 'ready') {
					this.up = worker === this.worker;
					resolve(true);
				} else if (data.type === 'failed') resolve(false);
				else this.receive(data);
			});
			worker.addEventListener('error', () => resolve(false));
		});
		return this.loading;
	}

	/** Python is loaded: a run starts at once. */
	get ready() {
		return this.up;
	}

	/** Runs a program with the lines typed so far; one run at a time. The time limit starts with the program, after Python and its packages have loaded. */
	async run(source: string, inputs: string[], seed: number, listeners: Listeners): Promise<{ outcome: Outcome; ms: number }> {
		this.stop();
		const id = ++this.ids;
		return new Promise((finish) => {
			const run: Run = { id, ...listeners, finish };
			this.current = run;
			void this.load().then((ok) => {
				if (this.current !== run) return;
				if (!ok) {
					this.discard();
					this.end('failed');
					return;
				}
				this.worker?.postMessage({ id, source, inputs, seed } satisfies ToWorker);
			});
		});
	}

	/** Ends the program by ending the worker: the next run loads Python again, from the browser's cache. */
	stop(outcome: Outcome = 'stopped') {
		if (!this.current) return;
		this.discard();
		this.end(outcome);
	}

	dispose() {
		this.discard();
		this.end('stopped');
	}

	private receive(data: Extract<FromWorker, { id: number }>) {
		const run = this.current;
		if (!run || run.id !== data.id) return;
		if (data.type === 'chunk') run.onChunk({ kind: data.kind, text: data.text });
		else if (data.type === 'status') run.onStatus?.(data.text);
		else if (data.type === 'started') {
			run.timer = setTimeout(() => this.stop('timeout'), TIME_LIMIT);
			run.onStart?.();
		}
		else this.end(data.status, data.ms);
	}

	private end(outcome: Outcome, ms = 0) {
		const run = this.current;
		if (!run) return;
		this.current = null;
		clearTimeout(run.timer);
		run.finish({ outcome, ms });
	}

	private discard() {
		this.worker?.terminate();
		this.worker = null;
		this.loading = null;
		this.up = false;
	}
}
