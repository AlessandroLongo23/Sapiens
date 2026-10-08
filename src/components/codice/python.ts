import { spawn } from './sandbox-worker';
import { TIME_LIMIT, type Changes, type FromRunner, type Job, type Listeners, type Outcome, type Result, type Runtime, type ToRunner } from './runtime';

/** The sandbox's side of the Python worker (python.worker.ts): starts it, runs a program, ends it when it takes too long. */

interface Run extends Listeners {
	id: number;
	finish: (result: Result) => void;
	timer?: ReturnType<typeof setTimeout>;
}

export class Python implements Runtime {
	private worker: Worker | null = null;
	private loading: Promise<boolean> | null = null;
	private up = false;
	private current: Run | null = null;
	private ids = 0;

	load(): Promise<boolean> {
		if (this.loading) return this.loading;
		const worker = spawn('python');
		this.worker = worker;
		this.loading = new Promise((resolve) => {
			worker.addEventListener('message', ({ data }: MessageEvent<FromRunner>) => {
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

	get ready() {
		return this.up;
	}

	async run(job: Job, listeners: Listeners): Promise<Result> {
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
				this.worker?.postMessage({ id, ...job } satisfies ToRunner);
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

	private receive(data: Extract<FromRunner, { id: number }>) {
		const run = this.current;
		if (!run || run.id !== data.id) return;
		if (data.type === 'chunk') run.onChunk({ kind: data.kind, text: data.text });
		else if (data.type === 'status') run.onStatus?.(data.text);
		else if (data.type === 'started') {
			run.timer = setTimeout(() => this.stop('timeout'), TIME_LIMIT);
			run.onStart?.();
		} else this.end(data.status, data.ms, data.changes);
	}

	private end(outcome: Outcome, ms = 0, changes?: Changes) {
		const run = this.current;
		if (!run) return;
		this.current = null;
		clearTimeout(run.timer);
		run.finish({ outcome, ms, changes });
	}

	private discard() {
		this.worker?.terminate();
		this.worker = null;
		this.loading = null;
		this.up = false;
	}
}
