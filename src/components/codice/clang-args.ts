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

export const OUTPUT = 'programma.wasm';

export const compileArgs = (language: 'c' | 'cpp') => [DRIVER[language], FILE[language], '-o', OUTPUT, '-include', 'sapiens.h', '-Wall', ...FLAGS[language]];
export const compileFiles = (language: 'c' | 'cpp', source: string) => ({ [FILE[language]]: source, 'sapiens.h': PRELUDE });
