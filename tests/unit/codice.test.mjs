// The programs of a lesson: a ```codice block read into the editor's program, solution and tests, and the Python
// runner the editor uses (public/codice/sapiens.py), here in Node. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import { loadPyodide } from 'pyodide';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { codeFences, parseCodeBlock, parseCodeFence, tidy } = await jiti.import('../../src/lib/codice/blocco.ts');

test('a block is read into its program, its solution and its tests', () => {
	const { variant, tests, errors } = parseCodeFence('python', ['n = int(input())', '# scrivi qui', '', '%% soluzione', 'n = int(input())', 'print(n * 2)', '%% prova', '4', '%% stampa', '8', '%% prova', '%% stampa', 'ciao', ''].join('\n'));
	assert.deepEqual(errors, []);
	assert.equal(variant.language, 'python');
	assert.equal(variant.code, 'n = int(input())\n# scrivi qui\n');
	assert.equal(variant.solution, 'n = int(input())\nprint(n * 2)\n');
	assert.deepEqual(tests, [
		{ input: '4\n', output: '8\n' },
		{ input: '', output: 'ciao\n' }
	]);
});

test('the indentation of a program survives, and c++ is a name for cpp', () => {
	const { variant } = parseCodeFence('C++', 'int main() {\n    return 0;\n}');
	assert.equal(variant.language, 'cpp');
	assert.equal(variant.code, 'int main() {\n    return 0;\n}\n');
});

test('what cannot be read is said', () => {
	const said = (info, body) => parseCodeFence(info, body).errors.join(' | ');
	assert.match(said('java', 'x'), /linguaggio "java" non riconosciuto/);
	assert.match(said('python', '%% prova\n1'), /senza la sua "%% stampa"/);
	assert.match(said('python', 'x\n%% stampa\n1'), /senza la sua "%% prova"/);
	assert.match(said('python', 'x\n%% test\n1'), /parte sconosciuta/);
	assert.match(said('python', '\n%% soluzione\nx'), /non ha un programma/);
});

test('fences one after the other are one program in more languages, with the tests written once', () => {
	const text = ['Testo.', '', '```codice python', 'print(1)', '%% prova', '%% stampa', '1', '```', '', '```codice c', 'int main(void) { return 0; }', '```', '', 'Altro testo.', '', '```codice python', 'print(2)', '```'].join('\n');
	const groups = codeFences(text);
	assert.equal(groups.length, 2);
	assert.equal(groups[0].fences.length, 2);
	const { block, errors } = parseCodeBlock(groups[0].fences);
	assert.deepEqual(errors, []);
	assert.deepEqual(block.variants.map((v) => v.language), ['python', 'c']);
	assert.equal(block.tests.length, 1);
	assert.equal(text.slice(groups[1].index, groups[1].index + groups[1].length), '```codice python\nprint(2)\n```');

	const twice = parseCodeBlock([{ info: 'python', body: 'x' }, { info: 'py', body: 'y' }]);
	assert.match(twice.errors.join(), /compare due volte/);
	assert.equal(twice.block, null);
});

test('printed text is compared without the spaces at the end', () => {
	assert.equal(tidy('7  \n8\n\n\n'), tidy('7\n8'));
	assert.notEqual(tidy(' 7'), tidy('7'));
});

const pyodide = await loadPyodide();
pyodide.FS.mkdirTree('/sapiens');
for (const name of ['sapiens.py', 'turtle.py']) pyodide.FS.writeFile(`/sapiens/${name}`, readFileSync(new URL(`../../public/codice/${name}`, import.meta.url), 'utf8'));
pyodide.runPython('import sys; sys.path.insert(0, "/sapiens")');
const esegui = pyodide.pyimport('sapiens').esegui;

/** Runs a program as the worker does and gathers what it sends. */
function run(source, inputs = [], batch = false) {
	const sent = [];
	const status = esegui(source, inputs, 7, (kind, text) => (sent.push([kind, text]), true), batch);
	const of = (kind) => sent.filter(([k]) => k === kind).map(([, text]) => text).join('');
	return { status, out: of('out'), err: of('err'), typed: of('in'), sent };
}

test('a program that asks for a line stops there, and goes on when run again with the line', () => {
	const source = 'nome = input("Nome? ")\nprint("Ciao", nome)\n';
	const first = run(source);
	assert.equal(first.status, 'input');
	assert.equal(first.out, 'Nome? ');
	const second = run(source, ['Ada']);
	assert.equal(second.status, 'ok');
	assert.equal(second.out, 'Nome? Ciao Ada\n');
	assert.equal(second.typed, 'Ada\n');
});

test('random numbers are the same in every rerun of a run', () => {
	const source = 'import random\nprint(random.randint(1, 10**9))\ninput()\n';
	assert.equal(run(source).out, run(source, ['x']).out);
});

test('without a keyboard the questions are not printed and the input ends', () => {
	assert.equal(run('a = int(input("Primo: "))\nb = int(input("Secondo: "))\nprint(a + b)\n', ['3', '4'], true).out, '7\n');
	const over = run('input()\ninput()\n', ['1'], true);
	assert.equal(over.status, 'error');
	assert.match(over.err, /EOFError/);
});

test('an error shows the lines of the program and nothing of the runner', () => {
	const { status, err } = run('def f():\n    return 1 / 0\n\nf()\n');
	assert.equal(status, 'error');
	assert.match(err, /File "programma.py", line 4, in <module>/);
	assert.match(err, /ZeroDivisionError: division by zero/);
	assert.doesNotMatch(err, /sapiens\.py|esegui/);
});

test('the turtle sends its drawing as operations', () => {
	const { status, sent } = run('import turtle\nturtle.forward(100)\nturtle.left(90)\nprint(turtle.pos())\n');
	assert.equal(status, 'ok');
	const ops = sent.filter(([kind]) => kind === 'turtle').flatMap(([, text]) => JSON.parse(text));
	assert.deepEqual(ops, [['new', 0], ['move', 0, 100, 0, true], ['turn', 0, 90]]);
});
