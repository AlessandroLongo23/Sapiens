import { OVERFLOW, WAIT, environment, random } from './js-environment';
import { emitter, type ChunkKind, type FromRunner, type Job, type RunStatus } from './runtime';

/**
 * Runs one JavaScript program and ends: a program with a console, not a page (the pages are in WebBench.tsx). The
 * sandbox makes a new worker for every run and ends it when the program takes too long (javascript.ts).
 *
 * The program is a script of its own, so an error says its line. It is over when its last line has run and no
 * timer is waiting. prompt() reads a line the way input() does in Python: when none has been typed yet the run
 * stops, and it is repeated from the start with the line (js-environment.ts).
 */

export type ToJavascript = Job & { id: number };

const post = (message: FromRunner) => self.postMessage(message);
/** Output is sent in pieces, not line by line: a loop that prints would flood the page with messages. */
const PIECE = 30;

self.onmessage = ({ data }: MessageEvent<ToJavascript>) => {
	const { id, source, inputs, seed, batch = false } = data;
	let pieces: { kind: ChunkKind; text: string }[] = [];
	let sent = performance.now();
	const flush = () => {
		for (const { kind, text } of pieces) post({ type: 'chunk', id, kind, text });
		pieces = [];
		sent = performance.now();
	};
	const emit = emitter(batch ? 0 : inputs.length, (kind, text) => {
		const last = pieces[pieces.length - 1];
		if (last?.kind === kind) last.text += text;
		else pieces.push({ kind, text });
		if (performance.now() - sent > PIECE) flush();
	});
	/** Why the run is being stopped from inside. Not every browser hands the thrown value to the error's listener. */
	let stopping: RunStatus | null = null;
	const stop = (status: RunStatus, signal: unknown): never => {
		stopping = status;
		throw signal;
	};
	const write = (kind: ChunkKind, text: string) => {
		if (!emit(kind, text)) stop('overflow', OVERFLOW);
	};

	let over = false;
	const started = performance.now();
	const finish = (status: RunStatus) => {
		if (over) return;
		over = true;
		flush();
		post({ type: 'done', id, status, ms: performance.now() - started });
	};

	// the program is over when nothing is left to run: its timers are counted
	let waiting = 0;
	const timers = new Set<number>();
	const settle = () => waiting === 0 && finish(stopping ?? 'ok');
	const { setTimeout: later, setInterval: every, clearTimeout: cancel, clearInterval: cancelEvery } = self;
	const scope = self as unknown as Record<string, unknown>;
	scope.setTimeout = (callback: (...values: unknown[]) => void, delay?: number, ...values: unknown[]) => {
		waiting++;
		const timer = later(() => {
			timers.delete(timer);
			waiting--;
			try {
				callback(...values);
			} finally {
				later(settle);
			}
		}, delay);
		timers.add(timer);
		return timer;
	};
	scope.clearTimeout = (timer: number) => {
		if (timers.delete(timer)) waiting--;
		cancel(timer);
		later(settle);
	};
	const intervals = new Set<number>();
	scope.setInterval = (callback: (...values: unknown[]) => void, delay?: number, ...values: unknown[]) => {
		waiting++;
		const timer = every(callback, delay, ...values);
		intervals.add(timer);
		return timer;
	};
	scope.clearInterval = (timer: number) => {
		if (intervals.delete(timer)) waiting--;
		cancelEvery(timer);
		later(settle);
	};

	Object.assign(
		scope,
		environment(inputs, batch, write, () => stop('input', WAIT))
	);
	Math.random = random(seed);

	// An error nobody caught ends the program. It is read here and not in a `catch`, because only here the browser
	// says the line, also for a program that cannot be read at all.
	self.addEventListener('error', (event) => {
		event.preventDefault();
		const error = event.error as unknown;
		if (stopping) return finish(stopping);
		// a program that cannot be read: the browser's words for it come wrapped in those for the call that loaded it
		const text = (error instanceof Error ? `${error.name}: ${error.message}` : event.message.replace(/^Uncaught /, '')).replace(/Failed to execute 'importScripts'[^:]*: /, '');
		const line = event.lineno ? `\n    alla riga ${event.lineno}` : '';
		try {
			emit('err', `${text}${line}\n`);
		} catch {
			// printed too much already: the error is the last thing lost
		}
		finish('error');
	});
	self.addEventListener('unhandledrejection', (event) => {
		event.preventDefault();
		const reason = event.reason as unknown;
		emit('err', `${reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason)}\n`);
		finish('error');
	});

	const script = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
	post({ type: 'started', id });
	later(() => {
		(self as unknown as { importScripts(url: string): void }).importScripts(script);
		later(settle);
	});
};

post({ type: 'ready' });
