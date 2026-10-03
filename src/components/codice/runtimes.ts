import type { Language, Runtime } from './runtime';
import { Sandboxed, close, type Engine } from './sandbox';

/**
 * One runtime per language for the whole page, shared by every editor on it: a lesson with five programs loads
 * Python once. C and C++ share the compiler. They live in the sandbox (sandbox.ts), which is kept while an editor
 * is on the page and removed with the last one.
 */
const ENGINE: Record<Language, Engine> = { python: 'python', c: 'clang', cpp: 'clang', javascript: 'javascript' };
const engines = new Map<Engine, Sandboxed>();
let editors = 0;

export function runtimeFor(language: Language): Runtime {
	const engine = ENGINE[language];
	let runtime = engines.get(engine);
	if (!runtime) engines.set(engine, (runtime = new Sandboxed(engine)));
	return runtime;
}

/** An editor is on the page; the function it returns says it has left. */
export function retain(): () => void {
	editors++;
	return () => {
		if (--editors > 0) return;
		engines.forEach((runtime) => runtime.dispose());
		engines.clear();
		close();
	};
}
