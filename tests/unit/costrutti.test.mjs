// The constructs an exercise asks its answer for: read from a chart and from a program. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { bare, chartConstructs, codeConstructs, missing, neededText } = await jiti.import('../../src/lib/exercises/v2/costrutti.ts');
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

test('a loop in the body of another is told from two loops in a row', () => {
	const nested = (code, language) => codeConstructs(code, language).has('annidati');
	assert.equal(nested('for i in range(3):\n    for j in range(2):\n        print(i, j)\n', 'python'), true);
	assert.equal(nested('i = 0\nwhile i < 3:\n    if i > 0:\n        for j in range(i):\n            print(j)\n    i = i + 1\n', 'python'), true);
	assert.equal(nested('for i in range(3):\n    print(i)\nfor j in range(2):\n    print(j)\n', 'python'), false);
	assert.equal(nested('for i in range(3):\n    print("*" * i)\n', 'python'), false);
	// a comment between the two does not close the outer loop
	assert.equal(nested('for i in range(3):\n# righe\n    for j in range(2):\n        print(j)\n', 'python'), true);
	assert.equal(nested('for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 2; j++) {\n        cout << j;\n    }\n}', 'cpp'), true);
	assert.equal(nested('for (int i = 0; i < 3; i++)\n    for (int j = 0; j < 2; j++)\n        cout << j;', 'cpp'), true);
	assert.equal(nested('while (i < 3) {\n    if (i > 0) {\n        do { j++; } while (j < i);\n    }\n    i++;\n}', 'cpp'), true);
	assert.equal(nested('for (int i = 0; i < 3; i++) {\n    cout << i;\n}\nfor (int j = 0; j < 2; j++) {\n    cout << j;\n}', 'cpp'), false);
	assert.equal(nested('for (int i = 0; i < 3; i++) cout << i;\nfor (int j = 0; j < 2; j++) cout << j;', 'cpp'), false);
	// the while that closes a do is not a second loop
	assert.equal(nested('do {\n    i++;\n} while (i < 3);', 'cpp'), false);
	assert.deepEqual(chart('i = 1\nfinché i < 3\n    j = 1\n    finché j < 3\n        j = j + 1\n    i = i + 1\n').includes('annidati'), true);
	assert.deepEqual(chart('i = 1\nfinché i < 3\n    i = i + 1\nfinché i < 6\n    i = i + 1\n').includes('annidati'), false);
});

test('a program is told beforehand what it must contain', () => {
	assert.equal(neededText(['while']), 'Nel programma deve esserci un ciclo while.');
	assert.equal(neededText(['ciclo', 'selezione']), 'Nel programma devono esserci un ciclo e una selezione.');
	assert.equal(neededText(['annidati']), 'Nel programma devono esserci due cicli, uno dentro l’altro.');
	assert.equal(neededText([]), null);
	assert.equal(neededText(undefined), null);
});
