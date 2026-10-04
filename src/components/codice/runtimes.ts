import type { Language, Runtime } from './runtime';
import { Sandboxed, close } from './sandbox';

/**
 * One runtime per language for the whole page, shared by every editor on it: a lesson with five programs loads
 * Python once. C and C++ share the compiler. They live in the sandbox (sandbox.ts), which is kept while an editor
 * is on the page and removed with the last one.
 */
let python: Sandboxed | null = null;
let clang: Sandboxed | null = null;
let editors = 0;

export function runtimeFor(language: Language): Runtime {
	return language === 'python' ? (python ??= new Sandboxed('python')) : (clang ??= new Sandboxed('clang'));
}

/** An editor is on the page; the function it returns says it has left. */
export function retain(): () => void {
	editors++;
	return () => {
		if (--editors > 0) return;
		python?.dispose();
		clang?.dispose();
		python = clang = null;
		close();
	};
}
