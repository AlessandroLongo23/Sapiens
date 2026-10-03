import { Clang } from './clang';
import { Python } from './python';
import type { Language, Runtime } from './runtime';

/**
 * One runtime per language for the whole page, shared by every editor on it: a lesson with five programs loads
 * Python once. C and C++ share the compiler. They are kept while an editor is on the page and ended with the last one.
 */
let python: Python | null = null;
let clang: Clang | null = null;
let editors = 0;

export function runtimeFor(language: Language): Runtime {
	return language === 'python' ? (python ??= new Python()) : (clang ??= new Clang());
}

/** An editor is on the page; the function it returns says it has left. */
export function retain(): () => void {
	editors++;
	return () => {
		if (--editors > 0) return;
		python?.dispose();
		clang?.dispose();
		python = clang = null;
	};
}
