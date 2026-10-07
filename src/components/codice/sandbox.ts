import type { Changes, Chunk, Job, Listeners, Outcome, Result, Runtime } from './runtime';

/**
 * The page's side of the sandbox. A program is somebody's code, and code running on the site's origin can do on the
 * site what the student can: read the account, write in the Zaino. So the languages are not on the page: they are in
 * an iframe with `sandbox="allow-scripts"` (src/app/codice-sandbox/route.ts), whose origin is its own and no one
 * else's. There the site's cookies are not sent, there is no storage, and the page's policy lets it reach only the
 * files of the languages. The page sends it the program and receives what the program prints.
 *
 * sandbox-host.ts is the other side: it has the real runtimes (python.ts, clang.ts) and their workers.
 */

export const SANDBOX_PATH = '/codice-sandbox';

/** Python, the C and C++ compiler, or JavaScript as a program with a console. */
export type Engine = 'python' | 'clang' | 'javascript';

export type ToSandbox =
	| { op: 'load'; engine: Engine; request: number }
	| { op: 'run'; engine: Engine; run: number; job: Job }
	| { op: 'stop'; engine: Engine };

export type FromSandbox =
	| { type: 'ready' }
	| { type: 'loaded'; engine: Engine; request: number; ok: boolean }
	| { type: 'chunk'; run: number; chunk: Chunk }
	| { type: 'status'; run: number; text: string }
	| { type: 'start'; run: number }
	/** `ready` says whether the language is still loaded: Python is not, after a program that had to be ended. */
	| { type: 'result'; engine: Engine; run: number; result: Result; ready: boolean };

/** How long the iframe has to say it listens. */
const OPENING = 30_000;

let frame: HTMLIFrameElement | null = null;
let opening: Promise<boolean> | null = null;
const listeners = new Set<(message: FromSandbox) => void>();
let ids = 0;

function receive(event: MessageEvent<FromSandbox>) {
	if (!frame || event.source !== frame.contentWindow) return;
	for (const listener of [...listeners]) listener(event.data);
}

/** Makes the iframe, once; false when it could not load. */
function open(): Promise<boolean> {
	if (opening) return opening;
	const element = document.createElement('iframe');
	element.setAttribute('sandbox', 'allow-scripts');
	element.src = SANDBOX_PATH;
	element.hidden = true;
	element.title = 'Esecuzione dei programmi';
	frame = element;
	window.addEventListener('message', receive);
	const mine = (opening = new Promise<boolean>((resolve) => {
		const timer = setTimeout(() => done(false), OPENING);
		const done = (ok: boolean) => {
			clearTimeout(timer);
			listeners.delete(ready);
			if (!ok && opening === mine) close();
			resolve(ok);
		};
		const ready = (message: FromSandbox) => message.type === 'ready' && done(true);
		listeners.add(ready);
	}));
	document.body.append(element);
	return mine;
}

// the iframe's origin has no name to address it by; the window is the one this page made
const send = (message: ToSandbox) => frame?.contentWindow?.postMessage(message, '*');

/** Removes the iframe, and with it every worker and every program. */
export function close() {
	window.removeEventListener('message', receive);
	frame?.remove();
	frame = null;
	opening = null;
}

interface Run extends Listeners {
	id: number;
	finish: (result: Result) => void;
}

/** A language of the sandbox, as the editor sees it. */
export class Sandboxed implements Runtime {
	private up = false;
	private current: Run | null = null;
	private forget: () => void;

	constructor(private engine: Engine) {
		this.forget = listen((message) => this.receive(message));
	}

	async load(): Promise<boolean> {
		if (!(await open())) return false;
		const request = ++ids;
		return new Promise((resolve) => {
			const forget = listen((message) => {
				if (message.type !== 'loaded' || message.request !== request) return;
				forget();
				this.up = message.ok;
				resolve(message.ok);
			});
			send({ op: 'load', engine: this.engine, request });
		});
	}

	get ready() {
		return this.up;
	}

	async run(job: Job, listeners: Listeners): Promise<Result> {
		this.stop();
		const id = ++ids;
		return new Promise((finish) => {
			const run: Run = { id, ...listeners, finish };
			this.current = run;
			void open().then((ok) => {
				if (this.current !== run) return;
				if (ok) send({ op: 'run', engine: this.engine, run: id, job });
				else this.end('failed');
			});
		});
	}

	stop() {
		if (!this.current) return;
		send({ op: 'stop', engine: this.engine });
		this.end('stopped');
	}

	dispose() {
		this.stop();
		this.forget();
		this.up = false;
	}

	private receive(message: FromSandbox) {
		if (message.type === 'result' && message.engine === this.engine) this.up = message.ready;
		const run = this.current;
		if (!run || !('run' in message) || message.run !== run.id) return;
		if (message.type === 'chunk') run.onChunk(message.chunk);
		else if (message.type === 'status') run.onStatus?.(message.text);
		else if (message.type === 'start') run.onStart?.();
		else this.end(message.result.outcome, message.result.ms, message.result.changes);
	}

	private end(outcome: Outcome, ms = 0, changes?: Changes) {
		const run = this.current;
		if (!run) return;
		this.current = null;
		run.finish({ outcome, ms, changes });
	}
}

function listen(listener: (message: FromSandbox) => void) {
	listeners.add(listener);
	return () => void listeners.delete(listener);
}
