/** What the editor asks of a language: load it, run a program with the lines typed so far, stop it. python.ts and clang.ts implement it. */

import type { Language } from '@/lib/codice/blocco';

export type { Language };

/** What a worker sends while a program runs: printed text, an error's text, a line typed at an input, a matplotlib figure (PNG in base64), turtle operations (JSON). */
export type ChunkKind = 'out' | 'err' | 'in' | 'image' | 'turtle';

/** A piece of the console: what the worker sent, or a note from Sapiens. */
export interface Chunk {
	kind: ChunkKind | 'note';
	text: string;
}

/** How a worker says a run ended: finished, failed, waiting for a line, printed too much. */
export type RunStatus = 'ok' | 'error' | 'input' | 'overflow';
/** Plus the ends the page decides: out of time, stopped by the student, the language not loaded. */
export type Outcome = RunStatus | 'timeout' | 'stopped' | 'failed';

export interface Result {
	outcome: Outcome;
	ms: number;
}

/**
 * One run. A program that reads from the keyboard is run again from the start for every line typed (`inputs` grows),
 * and `seed` and `clock` make each rerun repeat the one before: the same random numbers, the same time of day.
 */
export interface Job {
	language: Language;
	source: string;
	inputs: string[];
	seed: number;
	/** The time the first run started, in milliseconds. */
	clock: number;
	/** No keyboard: when the lines are over the program reads the end of the input. For the tests of an exercise. */
	batch?: boolean;
}

export interface Listeners {
	onChunk: (chunk: Chunk) => void;
	/** What is happening before the program starts, like loading numpy or compiling. */
	onStatus?: (text: string) => void;
	/** The program has started. */
	onStart?: () => void;
}

export interface Runtime {
	/** Starts the download, once; false when it could not load. */
	load(): Promise<boolean>;
	/** Loaded: a run starts at once. */
	readonly ready: boolean;
	/** One run at a time; the time limit starts with the program, after everything it needs has loaded. */
	run(job: Job, listeners: Listeners): Promise<Result>;
	stop(): void;
	dispose(): void;
}

/** A program still running after this long is taken for a loop that never ends. */
export const TIME_LIMIT = 10_000;

export const LANGUAGES: Record<Language, string> = { python: 'Python', c: 'C', cpp: 'C++', javascript: 'JavaScript' };
/** A program printing in a loop is stopped here; the page would not survive much more. */
export const OUTPUT_LIMIT = 100_000;

/** The messages of the workers that run a program (python.worker.ts, wasi.worker.ts). */
export type ToRunner = Job & { id: number };
export type FromRunner =
	| { type: 'ready' }
	| { type: 'failed'; message: string }
	| { type: 'status'; id: number; text: string }
	| { type: 'started'; id: number }
	| { type: 'chunk'; id: number; kind: ChunkKind; text: string }
	| { type: 'done'; id: number; status: RunStatus; ms: number };

/**
 * What a worker sends to the console, behind the two rules every language shares: the lines already typed were
 * echoed by the runs before, so nothing is sent until the last of them has gone by; and printed text stops at
 * OUTPUT_LIMIT (the function then answers false). Images and drawings have their own limits.
 */
export function emitter(replayed: number, post: (kind: ChunkKind, text: string) => void) {
	let sent = 0;
	return (kind: ChunkKind, text: string): boolean => {
		if (replayed > 0) {
			if (kind === 'in') replayed--;
			return true;
		}
		if (kind === 'out' || kind === 'err' || kind === 'in') {
			sent += text.length;
			if (sent > OUTPUT_LIMIT) return false;
		}
		post(kind, text);
		return true;
	};
}
