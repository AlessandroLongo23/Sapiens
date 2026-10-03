// The programs of a lesson: a ```codice block read into the editor's program, solution and tests, and the Python
// runner the editor uses (public/codice/sapiens.py), here in Node. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import { loadPyodide } from 'pyodide';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { codeFences, parseCodeBlock, parseCodeFence, parseRule, tidy } = await jiti.import('../../src/lib/codice/blocco.ts');
const { assemble, hasScript } = await jiti.import('../../src/components/codice/web-assemble.ts');
const { guardLoops, guardInline } = await jiti.import('../../src/components/codice/loop-guard.ts');
const { environment, format, random } = await jiti.import('../../src/components/codice/js-environment.ts');
const { readProgramFiles } = await jiti.import('../../src/lib/codice/salvati.ts');

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

test('a group with an html block is a web page: its files, its solution, its checks', () => {
	const { block, errors } = parseCodeBlock([
		{ info: 'html', body: ['<h1></h1>', '%% soluzione', '<h1>Ciao</h1>', '%% controllo Il titolo dice "Ciao"', 'h1 | testo = Ciao', '%% controllo Il titolo è rosso e c\'è un elenco', 'h1 | stile color = red', 'ul'].join('\n') },
		{ info: 'css', body: 'h1 { color: black; }\n%% soluzione\nh1 { color: red; }' },
		{ info: 'js', body: 'console.log(1);' }
	]);
	assert.deepEqual(errors, []);
	assert.deepEqual(block.variants, []);
	assert.deepEqual(block.page.files, { html: '<h1></h1>\n', css: 'h1 { color: black; }\n', js: 'console.log(1);\n' });
	// a file without a solution of its own is the same in the solution
	assert.deepEqual(block.page.solution, { html: '<h1>Ciao</h1>\n', css: 'h1 { color: red; }\n', js: 'console.log(1);\n' });
	assert.deepEqual(block.page.checks, [
		{ description: 'Il titolo dice "Ciao"', rules: [{ selector: 'h1', kind: 'text', text: 'Ciao', exact: true }] },
		{ description: "Il titolo è rosso e c'è un elenco", rules: [{ selector: 'h1', kind: 'style', property: 'color', value: 'red' }, { selector: 'ul', kind: 'exists' }] }
	]);
});

test('javascript alone is a program; with html it is the script of the page', () => {
	const alone = parseCodeBlock([{ info: 'js', body: 'console.log(1);\n%% prova\n%% stampa\n1' }]);
	assert.deepEqual(alone.errors, []);
	assert.equal(alone.block.variants[0].language, 'javascript');
	assert.equal(alone.block.page, undefined);

	const said = (fences) => parseCodeBlock(fences).errors.join(' | ');
	assert.match(said([{ info: 'css', body: 'h1 {}' }]), /va dopo il blocco html/);
	assert.match(said([{ info: 'html', body: '<p></p>' }, { info: 'python', body: 'x' }]), /non è tra questi/);
	assert.match(said([{ info: 'html', body: '<p></p>\n%% prova\n%% stampa\n1' }]), /si controlla con "%% controllo"/);
	assert.match(said([{ info: 'python', body: 'x\n%% controllo C\'è\np' }]), /vale per le pagine web/);
	assert.match(said([{ info: 'html', body: '<p></p>\n%% controllo\np' }]), /senza la frase/);
	assert.match(said([{ info: 'html', body: '<p></p>\n%% controllo Vuoto' }]), /non ha regole/);
	assert.match(said([{ info: 'html', body: '<p></p>\n%% soluzione\n<p>a</p>' }]), /soluzione senza controlli/);
});

test('a rule is a selector and what must be true of what it finds', () => {
	assert.deepEqual(parseRule('ul > li'), { selector: 'ul > li', kind: 'exists' });
	assert.deepEqual(parseRule('ul > li | quanti = 3'), { selector: 'ul > li', kind: 'count', count: 3 });
	assert.deepEqual(parseRule('p.nota | testo contiene due parole'), { selector: 'p.nota', kind: 'text', text: 'due parole', exact: false });
	assert.deepEqual(parseRule('a | attributo href'), { selector: 'a', kind: 'attribute', name: 'href', value: null });
	assert.deepEqual(parseRule('a | attributo href = pagina.html'), { selector: 'a', kind: 'attribute', name: 'href', value: 'pagina.html' });
	assert.deepEqual(parseRule('h1 | stile font-size = 20px'), { selector: 'h1', kind: 'style', property: 'font-size', value: '20px' });
	assert.match(parseRule('h1 | colore rosso'), /condizione non riconosciuta/);
});

test('the page takes its style and its script through the tags that link them', () => {
	const page = { html: '<head><link rel="stylesheet" href="style.css"></head><body><script src="./script.js" defer></script></body>', css: 'h1 { color: red; }', js: 'x()' };
	const { html, notes } = assemble(page, 'blob:1');
	assert.equal(html, '<head><style>h1 { color: red; }</style></head><body><script src="blob:1" defer></script></body>');
	assert.deepEqual(notes, []);

	const loose = assemble({ html: '<h1>Ciao</h1>', css: 'h1 {}', js: 'x()' }, 'blob:1');
	assert.equal(loose.html, '<h1>Ciao</h1>');
	assert.equal(loose.notes.length, 2);
	assert.deepEqual(assemble({ html: '<h1>Ciao</h1>', css: ' ', js: '' }, 'blob:1').notes, []);

	assert.equal(hasScript({ html: '<p>a</p>', css: '', js: '' }), false);
	assert.equal(hasScript({ html: '<p onclick="x()">a</p>', css: '', js: '' }), true);
	assert.equal(hasScript({ html: '<p>a</p>', css: '', js: 'x()' }), true);
});

test('every loop of a page\'s script calls the guard, and no line moves', () => {
	const source = 'for (let i = 0; i < 3; i++) {\n  a();\n}\nwhile (x) b();\ndo { c(); } while (y);\nfor (const k of list) for (;;) d();\n';
	const guarded = guardLoops(source);
	assert.equal(guarded.split('\n').length, source.split('\n').length);
	assert.equal(guarded, 'for (let i = 0; i < 3; i++) {__ciclo();\n  a();\n}\nwhile (x) {__ciclo();b();}\ndo {__ciclo(); c(); } while (y);\nfor (const k of list) {__ciclo();for (;;) {__ciclo();d();}}\n');
	// the guarded script does what the script did
	const calls = [];
	new Function('__ciclo', 'calls', guardLoops('let n = 0;\nwhile (n < 3) n++;\nfor (const x of [1, 2]) calls.push(x * n);'))(() => {}, calls);
	assert.deepEqual(calls, [3, 6]);
	// a script that cannot be read is left as it is
	assert.equal(guardLoops('while (x {'), 'while (x {');
	assert.equal(guardInline('<script>while (a) b();</script><script src="script.js"></script>'), '<script>while (a) {__ciclo();b();}</script><script src="script.js"></script>');
});

test('javascript as a program: the console prints, prompt() reads a line or stops the run', () => {
	const run = (inputs, batch) => {
		const sent = [];
		const scope = environment(inputs, batch, (kind, text) => sent.push([kind, text]), () => {
			throw 'wait';
		});
		let stopped = false;
		try {
			const name = scope.prompt('Nome?');
			scope.console.log('Ciao', name, [1, 'a', { x: null }]);
		} catch (signal) {
			stopped = signal === 'wait';
		}
		return { sent, stopped };
	};
	assert.deepEqual(run([], false), { sent: [['out', 'Nome? ']], stopped: true });
	assert.deepEqual(run(['Ada'], false).sent, [['out', 'Nome? '], ['in', 'Ada\n'], ['out', 'Ciao Ada [1, "a", { x: null }]\n']]);
	// the tests of an exercise: no question, and null when the lines are over
	assert.deepEqual(run(['Ada'], true).sent, [['out', 'Ciao Ada [1, "a", { x: null }]\n']]);
	assert.deepEqual(run([], true).sent, [['out', 'Ciao null [1, "a", { x: null }]\n']]);
	assert.equal(format(new Map([['a', 1]])), 'Map(1) {"a" => 1}');
	assert.equal(random(5)(), random(5)());
});

test('a saved program has exactly the files of its language', () => {
	assert.deepEqual(readProgramFiles('python', { main: 'print(1)' }), { main: 'print(1)' });
	assert.deepEqual(readProgramFiles('web', { html: '<p></p>' }), { html: '<p></p>', css: '', js: '' });
	assert.equal(readProgramFiles('python', { main: 'x', html: 'y' }), null);
	assert.equal(readProgramFiles('web', { html: 1 }), null);
	assert.equal(readProgramFiles('c', { main: 'x'.repeat(200_001) }), null);
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
