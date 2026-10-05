// The constructs an exercise asks its answer for: read from a chart and from a program. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { bare, chartConstructs, codeConstructs, missing } = await jiti.import('../../src/lib/exercises/v2/costrutti.ts');
const { parseProgram } = await jiti.import('../../src/lib/diagramma/blocco.ts');
const { needing, programAnswer, structure } = await jiti.import('../../src/lib/exercises/v2/inf-programmi.ts');

const found = (code, language) => [...codeConstructs(code, language)].sort();
const chart = (source) => [...chartConstructs(parseProgram(source, true).program)].sort();

test('a program is read for its loops and selections', () => {
	assert.deepEqual(found('i = 3\nwhile i > 0:\n    i = i - 1\n', 'python'), ['ciclo', 'while']);
	assert.deepEqual(found('for i in range(3):\n    print(i)\n', 'python'), ['ciclo', 'for']);
	assert.deepEqual(found('if a > b:\n    print(a)\nelse:\n    print(b)\n', 'python'), ['selezione']);
	assert.deepEqual(found('print("multa" if v > 30 else "in regola")\n', 'python'), ['selezione']);
	assert.deepEqual(found('match n:\n    case 1:\n        print("uno")\n', 'python'), ['selezione']);
	assert.deepEqual(found('print(1)\nprint(2)\n', 'python'), []);
	assert.deepEqual(found('for (int i = 0; i < 3; i++) {\n    cout << i << endl;\n}', 'cpp'), ['ciclo', 'for']);
	assert.deepEqual(found('do {\n    i--;\n} while (i > 0);', 'cpp'), ['ciclo', 'while']);
	assert.deepEqual(found('switch (n) {\n    case 1: break;\n}', 'cpp'), ['selezione']);
	assert.deepEqual(found('cout << (v > 30 ? "multa" : "in regola") << endl;', 'cpp'), ['selezione']);
});

test('a word in a comment or in a text is not a construct', () => {
	assert.deepEqual(found('# while\nprint("for if while")\nprint(\'if\')\n', 'python'), []);
	assert.deepEqual(found('"""\nwhile True:\n"""\nprint(1)\n', 'python'), []);
	assert.deepEqual(found('// while (true)\n/* for (;;)\n if */\ncout << "while ?" << endl;', 'cpp'), []);
	assert.deepEqual(found('print("a \\" while")\nwhile_ = 1\nformat = 2\n', 'python'), []);
	// a text left open ends with its line: the loop after it is still seen
	assert.deepEqual(found('print("ciao)\nwhile True:\n    pass\n', 'python'), ['ciclo', 'while']);
	assert.equal(bare('a = 1  # uno\n', 'python'), 'a = 1  \n');
});

test('a chart is read for its loops and selections, also inside one another', () => {
	assert.deepEqual(chart('leggi n\nscrivi n\n'), []);
	assert.deepEqual(chart('leggi n\nfinché n > 0\n    n = n - 1\n'), ['ciclo', 'while']);
	assert.deepEqual(chart('leggi n\nfinché n > 0\n    se n > 2\n        scrivi n\n    n = n - 1\n'), ['ciclo', 'selezione', 'while']);
	assert.deepEqual(structure('leggi n\nfinché n > 0\n    se n > 2\n        scrivi n\n    n = n - 1\n').sort(), ['ciclo', 'selezione']);
});

test('what is missing is the first construct asked for that is not there', () => {
	assert.equal(missing(['while'], codeConstructs('for i in range(3):\n    print(i)\n', 'python')), 'while');
	assert.equal(missing(['ciclo'], codeConstructs('for i in range(3):\n    print(i)\n', 'python')), null);
	assert.equal(missing(['ciclo', 'selezione'], codeConstructs('while True:\n    break\n', 'python')), 'selezione');
	assert.equal(missing(undefined, new Set()), null);
});

test('an answer keeps what it asks for', () => {
	const source = 'leggi n\nfinché n > 0\n    scrivi n\n    n = n - 1\n';
	const answer = needing(programAnswer(source, [[3], [5]], 'leggi n\n'), 'while');
	assert.deepEqual(answer.needs, ['while']);
	assert.equal(missing(answer.needs, codeConstructs(answer.solution.python, 'python')), null);
	assert.equal(missing(answer.needs, codeConstructs(answer.solution.cpp, 'cpp')), null);
	// what the editor opens with has no loop yet
	assert.equal(missing(answer.needs, codeConstructs(answer.start.python, 'python')), 'while');
	assert.equal('needs' in needing(programAnswer(source, [[3], [5]])), false);
});
