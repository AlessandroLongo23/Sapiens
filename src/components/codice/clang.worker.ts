/**
 * The C and C++ compiler in the browser: Clang and LLD built for WebAssembly (@yowasp/clang), served from /clang on
 * the site (scripts/codice/clang.mjs). It only compiles, to a WebAssembly program for WASI; wasi.worker.ts runs
 * the program, so a loop that never ends is stopped without losing the compiler, which is slow to load.
 *
 * C++ is compiled without exceptions: the C++ library of this toolchain is built without them, so try, catch and
 * throw are compile errors (clang.ts says so in Italian).
 */

import { OUTPUT, compileArgs, compileFiles } from './clang-args';

export type ToCompiler = { id: number; language: 'c' | 'cpp'; source: string; files?: Record<string, string> };
export type FromCompiler =
	| { type: 'ready' }
	| { type: 'failed'; message: string }
	| { type: 'progress'; percent: number }
	| { type: 'compiled'; id: number; wasm: Uint8Array | null; diagnostics: string; ms: number };

interface Clang {
	runClang(
		args: string[],
		files: unknown,
		options: { stdout: (bytes: Uint8Array | null) => void; stderr: (bytes: Uint8Array | null) => void; fetchProgress?: (event: { totalLength: number; doneLength: number }) => void }
	): Promise<Record<string, Uint8Array | string>>;
}

const post = (message: FromCompiler) => self.postMessage(message);
const progress = ({ totalLength, doneLength }: { totalLength: number; doneLength: number }) => post({ type: 'progress', percent: Math.round((100 * doneLength) / totalLength) });

async function compile(clang: Clang, language: 'c' | 'cpp', source: string, project?: Record<string, string>) {
	let diagnostics = '';
	const decoder = new TextDecoder();
	const collect = (bytes: Uint8Array | null) => {
		if (bytes) diagnostics += decoder.decode(bytes, { stream: true });
	};
	try {
		const files = await clang.runClang(compileArgs(language, project), compileFiles(language, source, project), { stdout: collect, stderr: collect, fetchProgress: progress });
		return { wasm: files[OUTPUT] as Uint8Array, diagnostics };
	} catch (error) {
		// a compile error ends Clang with an exit code, and its messages are in `diagnostics`
		return { wasm: null, diagnostics: diagnostics || String(error) };
	}
}

const loading: Promise<Clang> = (async () => {
	const clang = (await import(/* webpackIgnore: true */ `${new URL(import.meta.url).origin}/clang/bundle.js`)) as Clang;
	// the first compilation downloads the compiler and its headers: done here, so that 'ready' means ready
	const { wasm, diagnostics } = await compile(clang, 'c', 'int main(void) { return 0; }\n');
	if (!wasm) throw new Error(diagnostics);
	return clang;
})();

loading.then(
	() => post({ type: 'ready' }),
	(error: unknown) => post({ type: 'failed', message: String(error) })
);

self.onmessage = async ({ data }: MessageEvent<ToCompiler>) => {
	const clang = await loading.catch(() => null);
	if (!clang) return;
	const started = performance.now();
	const { wasm, diagnostics } = await compile(clang, data.language, data.source, data.files);
	post({ type: 'compiled', id: data.id, wasm, diagnostics, ms: performance.now() - started });
};
