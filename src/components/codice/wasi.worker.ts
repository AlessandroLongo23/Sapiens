import { emitter, type ChunkKind, type FromRunner, type Job, type RunStatus } from './runtime';

/**
 * Runs one compiled C or C++ program (a WebAssembly module for WASI, from clang.worker.ts) and ends. The page makes a
 * new worker for every run and ends it when the program takes too long.
 *
 * WASI here is the little a school program needs: the three standard streams, the clock, random numbers, exit.
 * Reading from the keyboard works as in Python (public/codice/sapiens.py): a program that asks for a line nobody has
 * typed yet stops with 'input' and is run again with every line typed so far. The time of day is the moment of the
 * first run and random bytes come from the seed, so `srand(time(0))` gives each rerun the same numbers.
 */

export type ToWasi = Job & { id: number; module: WebAssembly.Module };

const ESUCCESS = 0;
const EBADF = 8;
const ENOSYS = 52;
const ESPIPE = 70;
/** Printed text waits at most this long, so a loop of prints does not send a message per print. */
const PAUSE = 30;

class Waiting extends Error {}
class Overflow extends Error {}
class Exit extends Error {
	constructor(public code: number) {
		super(`exit ${code}`);
	}
}

const post = (message: FromRunner) => self.postMessage(message);

/** What stopped the program, in words a student can act on. The engines word the same trap differently. */
function trap(error: unknown): string {
	const text = String(error);
	if (/divi(de|sion) by zero/i.test(text)) return 'divisione intera per zero.';
	if (/out of bounds|index out of range/i.test(text)) return 'accesso alla memoria fuori dai limiti (un indice sbagliato o un puntatore non valido?).';
	if (/call stack|too much recursion|stack overflow/i.test(text)) return 'la pila delle chiamate è piena (una ricorsione che non finisce?).';
	if (/unreachable/i.test(text)) return 'il programma si è interrotto (abort).';
	if (/integer overflow|invalid conversion/i.test(text)) return 'un numero non sta nel tipo in cui è stato convertito.';
	return text;
}

self.onmessage = ({ data }: MessageEvent<ToWasi>) => {
	const { id, module, inputs, seed, clock, batch = false } = data;
	const emit = emitter(batch ? 0 : inputs.length, (kind, text) => post({ type: 'chunk', id, kind, text }));

	// printed text, gathered and sent every PAUSE
	let waiting: { kind: ChunkKind; text: string }[] = [];
	let last = 0;
	const flush = () => {
		const pieces = waiting;
		waiting = [];
		last = performance.now();
		for (const { kind, text } of pieces) if (!emit(kind, text)) throw new Overflow();
	};
	const decoders = { out: new TextDecoder(), err: new TextDecoder() };
	const print = (kind: 'out' | 'err', bytes: Uint8Array) => {
		const text = decoders[kind].decode(bytes, { stream: true });
		const tail = waiting[waiting.length - 1];
		if (tail?.kind === kind) tail.text += text;
		else waiting.push({ kind, text });
		if (performance.now() - last >= PAUSE) flush();
	};

	// the keyboard: one typed line for every read, as a terminal gives them
	const encoder = new TextEncoder();
	let next = 0;
	let line = new Uint8Array(0);

	// mulberry32, from the seed
	let state = seed >>> 0;
	const random = () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) & 0xff;
	};

	let memory: WebAssembly.Memory;
	const view = () => new DataView(memory.buffer);
	const bytes = (pointer: number, length: number) => new Uint8Array(memory.buffer, pointer, length);
	const started = performance.now();

	const wasi: Record<string, (...args: number[]) => number> = {
		fd_write(fd, iovs, count, written) {
			if (fd !== 1 && fd !== 2) return EBADF;
			let total = 0;
			for (let i = 0; i < count; i++) {
				const pointer = view().getUint32(iovs + 8 * i, true);
				const length = view().getUint32(iovs + 8 * i + 4, true);
				// copied: the decoder must not keep a view of memory that the program goes on changing
				print(fd === 1 ? 'out' : 'err', bytes(pointer, length).slice());
				total += length;
			}
			view().setUint32(written, total, true);
			return ESUCCESS;
		},
		fd_read(fd, iovs, count, read) {
			if (fd !== 0) return EBADF;
			if (!line.length) {
				flush();
				if (next < inputs.length) {
					emit('in', `${inputs[next]}\n`);
					line = encoder.encode(`${inputs[next++]}\n`);
				} else if (!batch) throw new Waiting();
			}
			let total = 0;
			for (let i = 0; i < count && line.length; i++) {
				const pointer = view().getUint32(iovs + 8 * i, true);
				const length = Math.min(view().getUint32(iovs + 8 * i + 4, true), line.length);
				bytes(pointer, length).set(line.subarray(0, length));
				line = line.subarray(length);
				total += length;
			}
			view().setUint32(read, total, true);
			return ESUCCESS;
		},
		fd_close: () => ESUCCESS,
		fd_seek: () => ESPIPE,
		fd_fdstat_get(fd, stat) {
			if (fd > 2) return EBADF;
			// a character device, like a terminal
			bytes(stat, 24).fill(0);
			view().setUint8(stat, 2);
			return ESUCCESS;
		},
		fd_fdstat_set_flags: () => ESUCCESS,
		fd_prestat_get: () => EBADF,
		fd_prestat_dir_name: () => EBADF,
		environ_sizes_get(count, size) {
			view().setUint32(count, 0, true);
			view().setUint32(size, 0, true);
			return ESUCCESS;
		},
		environ_get: () => ESUCCESS,
		args_sizes_get(count, size) {
			view().setUint32(count, 0, true);
			view().setUint32(size, 0, true);
			return ESUCCESS;
		},
		args_get: () => ESUCCESS,
		clock_res_get(_clock, resolution) {
			view().setBigUint64(resolution, BigInt(1_000_000), true);
			return ESUCCESS;
		},
		clock_time_get(which, _precision, time) {
			// the time of day stands still at the first run; the other clocks measure this run
			const ms = which === 0 ? clock : performance.now() - started;
			view().setBigUint64(time, BigInt(Math.round(ms * 1e6)), true);
			return ESUCCESS;
		},
		random_get(pointer, length) {
			const target = bytes(pointer, length);
			for (let i = 0; i < length; i++) target[i] = random();
			return ESUCCESS;
		},
		sched_yield: () => ESUCCESS,
		proc_exit(code) {
			throw new Exit(code);
		}
	};
	// whatever else the C library imports answers "not supported"
	const imports: Record<string, Record<string, (...args: number[]) => number>> = {};
	for (const { module: from, name } of WebAssembly.Module.imports(module)) (imports[from] ??= {})[name] = wasi[name] ?? (() => ENOSYS);

	let status: RunStatus = 'ok';
	const fail = (message: string) => {
		status = 'error';
		print('err', encoder.encode(message));
	};
	post({ type: 'started', id });
	try {
		const instance = new WebAssembly.Instance(module, imports);
		memory = instance.exports.memory as WebAssembly.Memory;
		(instance.exports._start as () => void)();
	} catch (error) {
		if (error instanceof Waiting) status = 'input';
		else if (error instanceof Overflow) status = 'overflow';
		else if (error instanceof Exit) {
			if (error.code !== 0) fail(`\nIl programma è uscito con il codice ${error.code}.\n`);
		} else fail(`\nErrore durante l'esecuzione: ${trap(error)}\n`);
	}
	try {
		flush();
	} catch {
		status = 'overflow';
	}
	post({ type: 'done', id, status, ms: performance.now() - started });
};
