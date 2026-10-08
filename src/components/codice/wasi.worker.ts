import { emitter, type FromRunner, type Job } from './runtime';
import { runWasi } from './wasi';

/**
 * Runs one compiled C or C++ program (wasi.ts) and ends. The page makes a new worker for every run and ends it when
 * the program takes too long.
 *
 * It says 'ready' when it can listen: in the production build this file is loaded a moment after the worker is
 * made, and a program sent before that would reach nobody.
 */

export type ToWasi = Job & { id: number; module: WebAssembly.Module };

const post = (message: FromRunner) => self.postMessage(message);

self.onmessage = ({ data }: MessageEvent<ToWasi>) => {
	const { id, module, inputs, batch = false } = data;
	const emit = emitter(batch ? 0 : inputs.length, (kind, text) => post({ type: 'chunk', id, kind, text }));
	const { status, ms, changes } = runWasi(module, data, emit, () => post({ type: 'started', id }));
	post({ type: 'done', id, status, ms, changes });
};

post({ type: 'ready' });
