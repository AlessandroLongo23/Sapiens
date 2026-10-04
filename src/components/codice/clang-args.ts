/** How Clang is called for a student's program: the same in the browser (clang.worker.ts) and in Node (scripts/codice/verifica.mts). */

/**
 * Included before every program: stdout is not buffered, so a question printed without a newline is on the screen
 * when the program stops to read the answer.
 */
const PRELUDE = `#include <stdio.h>
__attribute__((constructor)) static void sapiens_init(void) { setvbuf(stdout, NULL, _IONBF, 0); }
`;

const FILE = { c: 'programma.c', cpp: 'programma.cpp' };
const DRIVER = { c: 'clang', cpp: 'clang++' };
/** C++ without exceptions: the C++ library of this toolchain is built without them. */
const FLAGS = { c: ['-std=gnu17'], cpp: ['-std=gnu++20', '-fno-exceptions'] };
/** The files of a project that are compiled with the program: the others are there to be included or opened. */
const SOURCE = { c: /\.c$/i, cpp: /\.cpp$/i };

export const OUTPUT = 'programma.wasm';

/** Clang's files are a tree: a folder is an object of files. */
type Tree = { [name: string]: string | Tree };

/** The sources of a program: the one in the editor alone, or every source of its project. */
const sources = (language: 'c' | 'cpp', files?: Record<string, string>) => (files ? Object.keys(files).filter((path) => SOURCE[language].test(path)) : [FILE[language]]);

export const compileArgs = (language: 'c' | 'cpp', files?: Record<string, string>) => [DRIVER[language], ...sources(language, files), '-o', OUTPUT, '-include', 'sapiens.h', '-Wall', ...FLAGS[language]];

/** With `files` the program is one of them, under its own name; pictures are left out. */
export function compileFiles(language: 'c' | 'cpp', source: string, files?: Record<string, string>): Tree {
	const tree: Tree = { 'sapiens.h': PRELUDE };
	if (!files) return { ...tree, [FILE[language]]: source };
	for (const [path, text] of Object.entries(files)) {
		if (text.startsWith('data:')) continue;
		const parts = path.split('/');
		let folder = tree;
		for (const part of parts.slice(0, -1)) folder = (folder[part] ??= {}) as Tree;
		folder[parts[parts.length - 1]] = text;
	}
	return tree;
}
