import type { ToJavascript } from './javascript.worker';
import { TIME_LIMIT, type FromRunner, type Job, type Listeners, type Outcome, type Result, type Runtime } from './runtime';
import { spawn } from './sandbox-worker';

/**
 * JavaScript as a program with a console: the sandbox's side of javascript.worker.ts. Nothing to download; every
 * run has a new worker, ended when the program is over or takes too long.
 */

interface Run extends Listeners {
	id: number;
	finish: (result: Result) => void;
	timer?: ReturnType<typeof setTimeout>;
	worker?: Worker;
}

export class Javascript implements Runtime {
	private current: Run | null = null;
	private ids = 0;
	readonly ready = true;

	load() {
		return Promise.resolve(true);
	}

	async run(job: Job, listeners: Listeners): Promise<Result> {
		this.stop();
		const id = ++this.ids;
		return new Promise((finish) => {
			const run: Run = { id, ...listeners, finish };
			this.current = run;
			const worker = spawn('javascript');
			run.worker = worker;
			worker.addEventListener('message', ({ data }: MessageEvent<FromRunner>) => {
				if (this.current !== run) return;
				if (data.type === 'ready') worker.postMessage({ id, ...job } satisfies ToJavascript);
				if (!('id' in data)) return;
				if (data.type === 'chunk') run.onChunk({ kind: data.kind, text: data.text });
				else if (data.type === 'started') {
					run.timer = setTimeout(() => this.stop('timeout'), TIME_LIMIT);
					run.onStart?.();
				} else if (data.type === 'done') this.end(data.status, data.ms);
			});
		});
	}

	stop(outcome: Outcome = 'stopped') {
		this.end(outcome);
	}

	dispose() {
		this.end('stopped');
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
