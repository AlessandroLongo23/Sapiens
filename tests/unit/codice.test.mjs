// The programs of a lesson: a ```codice block read into the editor's program, solution and tests, and the Python
// runner the editor uses (public/codice/sapiens.py), here in Node. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import { loadPyodide } from 'pyodide';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { codeFences, grade, parseAction, parseCodeBlock, parseCodeFence, parseRule, tidy } = await jiti.import('../../src/lib/codice/blocco.ts');
const { disk, ROOT, MAX_FILE } = await jiti.import('../../src/components/codice/wasi-files.ts');
const { assemble, hasScript } = await jiti.import('../../src/components/codice/web-assemble.ts');
const { guardLoops, guardInline } = await jiti.import('../../src/components/codice/loop-guard.ts');
const { environment, format, random } = await jiti.import('../../src/components/codice/js-environment.ts');
const { readProgramFiles } = await jiti.import('../../src/lib/codice/salvati.ts');
const { folderProblem, pathProblem, readProject, resolvePath, samePath, sortedPaths, targetOf } = await jiti.import('../../src/lib/codice/progetto.ts');
const { reindent } = await jiti.import('../../src/components/codice/settings.ts');

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

test('a check may act on the page before its rules: the actions, the rules on what the page has become', () => {
	assert.deepEqual(parseAction(' clic #piu'), { kind: 'click', selector: '#piu' });
	assert.deepEqual(parseAction('scrivi form input[name=email] | anna@esempio.it'), { kind: 'type', selector: 'form input[name=email]', text: 'anna@esempio.it' });
	assert.deepEqual(parseAction('scrivi #nome | a | b'), { kind: 'type', selector: '#nome', text: 'a | b' });
	assert.deepEqual(parseAction('scrivi #nome |'), { kind: 'type', selector: '#nome', text: '' });
	assert.deepEqual(parseAction('scegli #classe | Terza'), { kind: 'select', selector: '#classe', text: 'Terza' });
	assert.deepEqual(parseAction('spunta #accetto'), { kind: 'check', selector: '#accetto' });
	assert.deepEqual(parseAction('togli #accetto'), { kind: 'uncheck', selector: '#accetto' });
	assert.deepEqual(parseAction('invia form'), { kind: 'submit', selector: 'form' });
	assert.deepEqual(parseAction('premi #cerca | Enter'), { kind: 'key', selector: '#cerca', text: 'Enter' });
	assert.deepEqual(parseAction('aspetta 500'), { kind: 'wait', ms: 500 });
	assert.match(parseAction('tocca #piu'), /azione non riconosciuta/);
	assert.match(parseAction('clic'), /senza selettore/);
	assert.match(parseAction('scrivi #nome'), /vuole il selettore e, dopo " \| ", il testo/);
	assert.match(parseAction('premi #cerca |'), /vuole il selettore/);
	assert.match(parseAction('clic #piu | due volte'), /vuole solo il selettore/);
	assert.match(parseAction('aspetta 60000'), /al più 3000/);

	assert.deepEqual(parseRule('#msg | non esiste'), { selector: '#msg', kind: 'absent' });
	assert.deepEqual(parseRule('.errore | visibile'), { selector: '.errore', kind: 'visible', visible: true });
	assert.deepEqual(parseRule('.errore | nascosto'), { selector: '.errore', kind: 'visible', visible: false });
	assert.deepEqual(parseRule('#msg | classe ok'), { selector: '#msg', kind: 'class', name: 'ok', has: true });
	assert.deepEqual(parseRule('#msg | senza classe .ok'), { selector: '#msg', kind: 'class', name: 'ok', has: false });
	assert.deepEqual(parseRule('#nome | valore = Anna'), { selector: '#nome', kind: 'value', value: 'Anna' });
	assert.deepEqual(parseRule('#nome | valore ='), { selector: '#nome', kind: 'value', value: '' });
	assert.deepEqual(parseRule('#accetto | non spuntato'), { selector: '#accetto', kind: 'checked', checked: false });
	assert.deepEqual(parseRule('form | inviato'), { selector: 'form', kind: 'sent', sent: true });
	assert.deepEqual(parseRule('form | non inviato'), { selector: 'form', kind: 'sent', sent: false });
	assert.deepEqual(parseRule('@avviso | testo contiene nome'), { selector: '@avviso', kind: 'text', text: 'nome', exact: false });

	const page = (checks) => parseCodeBlock([{ info: 'html', body: `<button id="piu"></button>\n${checks}` }]);
	const { block, errors } = page('%% controllo Fermo\n#conta | testo = 0\n%% controllo Due clic\n> clic #piu\n>clic #piu\n\n#conta | testo = 2');
	assert.deepEqual(errors, []);
	// a check that only looks is as it was, without actions
	assert.deepEqual(block.page.checks[0], { description: 'Fermo', rules: [{ selector: '#conta', kind: 'text', text: '0', exact: true }] });
	assert.deepEqual(block.page.checks[1].actions, [{ kind: 'click', selector: '#piu' }, { kind: 'click', selector: '#piu' }]);
	assert.equal(block.page.checks[1].rules.length, 1);
	assert.match(page('%% controllo A\n#a\n> clic #piu').errors.join(), /le azioni vanno prima delle regole/);
	assert.match(page('%% controllo A\n> clic #piu').errors.join(), /non ha regole/);
	assert.match(page('%% controllo A\n> salta #piu\n#a').errors.join(), /azione non riconosciuta/);
	assert.match(page('%% controllo A\n> aspetta 2000\n> aspetta 2000\n#a').errors.join(), /aspetta più di 3000/);
});

test('two paths to the same file are the same link, and a check can ask for a width of the preview', () => {
	assert.equal(samePath('index.html', './scaletta.html', 'scaletta.html'), true);
	assert.equal(samePath('index.html', 'scaletta.html ', 'scaletta.html'), true);
	assert.equal(samePath('pagine/chi.html', '../img/a.png', '/img/a.png'), true);
	assert.equal(samePath('pagine/chi.html', 'a.html', 'pagine/a.html'), false);
	assert.equal(samePath('index.html', './concerti.html#giugno', 'concerti.html#giugno'), true);
	assert.equal(samePath('index.html', 'concerti.html#giugno', 'concerti.html'), false);
	assert.equal(samePath('index.html', 'altra.html', 'scaletta.html'), false);
	// a web address and a point of the page are the same only as they are written
	assert.equal(samePath('index.html', 'https://esempio.it/a', 'https://esempio.it/a'), true);
	assert.equal(samePath('index.html', 'https://esempio.it/a/', 'https://esempio.it/a'), false);
	assert.equal(samePath('index.html', '#contatti', '#contatti'), true);
	assert.equal(samePath('index.html', '#contatti', '#Contatti'), false);
	assert.equal(samePath('index.html', '../fuori.html', 'fuori.html'), false);

	assert.deepEqual(parseAction('larghezza 400'), { kind: 'width', width: 400 });
	assert.match(parseAction('larghezza 50'), /da 200 a 2000/);
	assert.match(parseAction('larghezza stretta'), /vuole i pixel/);
});

test('a page takes its styles, scripts and pictures from the files of its project, by their path', () => {
	const files = {
		'index.html': '<head><link rel="stylesheet" href="css/stile.css"></head><body><img src="img/a.png"><script src="./script.js" defer></script><a href="chi.html">chi</a></body>',
		'css/stile.css': 'h1 { color: red; background: url("../img/a.png"); }',
		'script.js': 'x()',
		'img/a.png': 'data:image/png;base64,AAAA',
		'chi.html': '<link rel="stylesheet" href="css/stile.css"><h1>chi</h1>'
	};
	const { html, notes } = assemble(files, 'index.html', files['index.html'], (path) => `blob:${path}`);
	assert.equal(html, '<head><style>h1 { color: red; background: url("data:image/png;base64,AAAA"); }</style></head><body><img src="data:image/png;base64,AAAA"><script src="blob:script.js" defer></script><a href="chi.html">chi</a></body>');
	assert.deepEqual(notes, []);

	// what is not linked does nothing, and what is linked and is not there is said
	const loose = assemble({ 'index.html': '<h1>Ciao</h1><img src="foto.png"><img src="https://example.com/a.png">', 'style.css': 'h1 {}', 'script.js': 'x()' }, 'index.html', '<h1>Ciao</h1><img src="foto.png"><img src="https://example.com/a.png">', () => '');
	assert.deepEqual(loose.notes.map((note) => note.split(':')[0]), ['foto.png non esiste nel progetto', 'style.css non è collegato alla pagina', 'script.js non è collegato alla pagina']);
	assert.deepEqual(assemble({ 'index.html': '<h1>Ciao</h1>', 'style.css': ' ' }, 'index.html', '<h1>Ciao</h1>', () => '').notes, []);
	// from a page in a folder the tag to write climbs out of it
	assert.match(assemble({ 'pagine/a.html': '<p></p>', 'stile.css': 'p {}' }, 'pagine/a.html', '<p></p>', () => '').notes[0], /href="\.\.\/stile\.css"/);

	assert.equal(hasScript({ 'index.html': '<p>a</p>', 'style.css': 'p {}' }), false);
	assert.equal(hasScript({ 'index.html': '<p onclick="x()">a</p>' }), true);
	assert.equal(hasScript({ 'index.html': '<p>a</p>', 'script.js': 'x()' }), true);
});

test('a project is files with paths: what a path may be, how it is found from another file, what Esegui does with it', () => {
	assert.equal(pathProblem('css/stile.css'), null);
	assert.match(pathProblem('virus.exe'), /estensione/);
	assert.match(pathProblem('../fuori.py'), /solo lettere/);
	assert.match(pathProblem('a/b/c/d/e.py'), /Troppe cartelle/);
	assert.equal(resolvePath('pagine/chi.html', '../img/a.png'), 'img/a.png');
	assert.equal(resolvePath('index.html', 'chi.html#su'), 'chi.html');
	assert.equal(resolvePath('index.html', '../fuori.html'), null);
	assert.equal(resolvePath('index.html', 'https://example.com/a.css'), null);
	assert.deepEqual(sortedPaths({ 'main.py': '', 'css/b.css': '', 'a.py': '', 'css/a.css': '' }), ['css/a.css', 'css/b.css', 'a.py', 'main.py']);
	assert.equal(targetOf('main.py', ['main.py']), 'program');
	assert.equal(targetOf('index.html', ['index.html', 'script.js']), 'page');
	assert.equal(targetOf('script.js', ['index.html', 'script.js']), null);
	assert.equal(targetOf('script.js', ['script.js']), 'program');
	assert.equal(targetOf('dati.txt', ['dati.txt']), null);
	assert.deepEqual(readProject({ 'main.py': 'print(1)', 'foto.png': 'data:image/png;base64,AAAA' }), { 'main.py': 'print(1)', 'foto.png': 'data:image/png;base64,AAAA' });
	assert.equal(readProject({ 'foto.png': '<script>' }), null);
	assert.equal(readProject({ 'a.exe': '' }), null);
	assert.equal(readProject({}), null);
	assert.deepEqual(readProgramFiles('project', { 'a.py': 'x' }), { 'a.py': 'x' });
	// a folder with nothing in it yet is a path that ends with a slash
	assert.deepEqual(readProject({ 'main.py': 'x', 'img/': '' }), { 'main.py': 'x', 'img/': '' });
	assert.equal(readProject({ 'img/': '' }), null);
	assert.equal(readProject({ 'main.py': 'x', 'la mia/': '' }), null);
	assert.equal(readProject({ 'main.py': 'x', 'img/': 'testo' }), null);
	assert.deepEqual(sortedPaths({ 'main.py': '', 'img/': '' }), ['main.py']);
	assert.match(folderProblem('a.b'), /solo lettere/);
	assert.equal(folderProblem('css/temi'), null);
});

test('blocks named as files are a project: its files, the one to open, its tests or its checks', () => {
	const { block, errors } = parseCodeBlock([
		{ info: 'main.py', body: 'import conti\nprint(conti.doppio(int(input())))\n%% prova\n4\n%% stampa\n8' },
		{ info: 'conti.py', body: 'def doppio(n):\n    return n\n%% soluzione\ndef doppio(n):\n    return n * 2\n%% crea' }
	]);
	assert.deepEqual(errors, []);
	assert.equal(block.project.open, 'main.py');
	assert.equal(block.project.create, true);
	assert.deepEqual(Object.keys(block.project.files), ['main.py', 'conti.py']);
	assert.equal(block.project.solution['conti.py'], 'def doppio(n):\n    return n * 2\n');
	assert.equal(block.project.solution['main.py'], block.project.files['main.py']);
	assert.deepEqual(block.project.tests, [{ input: '4\n', output: '8\n' }]);

	const said = (fences) => parseCodeBlock(fences).errors.join(' | ');
	assert.match(said([{ info: 'main.py', body: 'x' }, { info: 'python', body: 'y' }]), /ogni blocco ha il nome di un file/);
	assert.match(said([{ info: 'a.py', body: 'x' }, { info: 'a.py', body: 'y' }]), /compare due volte/);
	assert.match(said([{ info: 'index.html', body: '<p></p>\n%% prova\n%% stampa\n1' }]), /è una pagina/);
	assert.match(said([{ info: 'main.py', body: 'x\n%% controllo C\'è\np' }]), /è un programma/);
	assert.match(said([{ info: 'virus.exe', body: 'x' }]), /estensione/);
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

test('a program takes the width of indentation that is asked, whatever it was written with', () => {
	const four = 'def f():\n    if x:\n        return 1\n\n    return 2\n';
	const two = 'def f():\n  if x:\n    return 1\n\n  return 2\n';
	assert.equal(reindent(four, 2), two);
	assert.equal(reindent(two, 4), four);
	assert.equal(reindent(reindent(four, 8), 4), four);
	assert.equal(reindent(four, 4), four);
	// nothing to go by: tabs, no indentation, lines aligned by one space
	assert.equal(reindent('a\n\tb\n', 2), 'a\n\tb\n');
	assert.equal(reindent('a\nb\n', 2), 'a\nb\n');
	assert.equal(reindent('f(a,\n  b,\n   c)\n', 4), 'f(a,\n  b,\n   c)\n');
});

test('a test says what a file must hold at the end, with or without what is printed', () => {
	const { tests, errors } = parseCodeFence('python', ['x', '%% prova', '3', '%% stampa', 'Fatto', '%% file uscita.txt', '1', '2 ', '', '%% file dati/log.csv', '%% prova', '%% file uscita.txt', 'a'].join('\n'));
	assert.deepEqual(errors, []);
	assert.deepEqual(tests, [
		{ input: '3\n', output: 'Fatto\n', files: { 'uscita.txt': '1\n2\n', 'dati/log.csv': '' } },
		{ input: '', output: null, files: { 'uscita.txt': 'a\n' } }
	]);

	const said = (body) => parseCodeFence('python', body).errors.join(' | ');
	assert.match(said('x\n%% file a.txt\n1'), /senza la sua "%% prova"/);
	assert.match(said('x\n%% prova\n%% file\n1'), /senza il nome del file/);
	assert.match(said('x\n%% prova\n%% file a.exe\n1'), /estensione/);
	assert.match(said('x\n%% prova\n%% file a.txt\n1\n%% file a.txt\n2'), /compare due volte nella stessa prova/);
	assert.match(said('x\n%% prova\n%% stampa\n1\n%% stampa\n2'), /senza la sua "%% prova"/);

	// spaces at the end of a line and empty lines at the end do not count, in a file as in what is printed
	const [first, second] = tests;
	assert.equal(grade(first, 'Fatto\n', {}, { written: { 'uscita.txt': '1  \n2\n\n', 'dati/log.csv': '' }, removed: [] }).passed, true);
	const wrong = grade(first, 'Fatto\n', {}, { written: { 'uscita.txt': '1\n3\n' }, removed: [] });
	assert.equal(wrong.passed, false);
	assert.equal(wrong.printed, true);
	assert.deepEqual(wrong.files, [
		{ path: 'uscita.txt', expected: '1\n2', got: '1\n3', passed: false },
		{ path: 'dati/log.csv', expected: '', got: null, passed: false }
	]);
	// what is printed is not compared without `%% stampa`; a file the program did not touch is the project's
	assert.equal(grade(second, 'qualcosa', { 'uscita.txt': 'a\n' }, { written: {}, removed: [] }).passed, true);
	assert.equal(grade(second, '', { 'uscita.txt': 'a\n' }, { written: {}, removed: ['uscita.txt'] }).passed, false);
	// a file that is not text is not the file asked for
	assert.equal(grade(second, '', {}, { written: { 'uscita.txt': null }, removed: [] }).passed, false);
});

test('files of data after the languages are beside the program in every language', () => {
	const { block, errors } = parseCodeBlock([
		{ info: 'python', body: 'print(open("dati.txt").read())\n%% prova\n%% stampa\n1\n\n2' },
		{ info: 'cpp', body: 'int main() {}' },
		{ info: 'dati.txt', body: '1\n\n2\n' },
		{ info: 'voti/primo.csv', body: 'a;b' }
	]);
	assert.deepEqual(errors, []);
	assert.deepEqual(block.variants.map((v) => v.language), ['python', 'cpp']);
	assert.deepEqual(block.data, { 'dati.txt': '1\n\n2\n', 'voti/primo.csv': 'a;b\n' });
	assert.equal(block.tests.length, 1);
	assert.equal(block.project, undefined);
	assert.equal(parseCodeBlock([{ info: 'python', body: 'x' }]).block.data, undefined);

	const said = (fences) => parseCodeBlock(fences).errors.join(' | ');
	assert.match(said([{ info: 'python', body: 'x' }, { info: 'a.txt', body: '1' }, { info: 'a.txt', body: '2' }]), /compare due volte/);
	assert.match(said([{ info: 'python', body: 'x' }, { info: 'a.txt', body: '1\n%% prova\n%% stampa\n1' }]), /non ha parti/);
	// a module is not data: with a language beside it the group is still a project written badly
	assert.match(said([{ info: 'python', body: 'x' }, { info: 'conti.py', body: 'y' }]), /ogni blocco ha il nome di un file/);
});

/** The calls of a program's disk (wasi-files.ts) as the C library makes them, on a memory of its own. */
function machine(files) {
	const memory = new WebAssembly.Memory({ initial: 1 });
	const { calls, changes } = disk(files, () => memory);
	const view = new DataView(memory.buffer);
	/** Writes a text in the memory and answers how many bytes it is. */
	const put = (at, text) => {
		const bytes = new TextEncoder().encode(text);
		new Uint8Array(memory.buffer, at).set(bytes);
		return bytes.length;
	};
	const [PATH, IOV, DATA, RESULT] = [0, 512, 1024, 8192];
	const READ = 2n, WRITE = 64n;
	return {
		changes,
		/** `mode` as fopen's: r, w, a, r+. Answers the descriptor, or minus the error. */
		open(path, mode = 'r') {
			const length = put(PATH, path);
			const oflags = mode === 'w' ? 1 | 8 : mode === 'a' ? 1 : 0;
			const error = calls.path_open(ROOT, 0, PATH, length, oflags, mode === 'r' ? READ : mode === 'r+' ? READ | WRITE : WRITE, 0n, mode === 'a' ? 1 : 0, RESULT);
			return error ? -error : view.getUint32(RESULT, true);
		},
		write(fd, text) {
			const length = put(DATA, text);
			view.setUint32(IOV, DATA, true);
			view.setUint32(IOV + 4, length, true);
			return calls.fd_write(fd, IOV, 1, RESULT);
		},
		read(fd, most = 4096) {
			view.setUint32(IOV, DATA, true);
			view.setUint32(IOV + 4, most, true);
			const error = calls.fd_read(fd, IOV, 1, RESULT);
			return error ? -error : new TextDecoder().decode(new Uint8Array(memory.buffer, DATA, view.getUint32(RESULT, true)));
		},
		seek: (fd, offset, whence) => calls.fd_seek(fd, BigInt(offset), whence, RESULT) || Number(view.getBigUint64(RESULT, true)),
		close: (fd) => calls.fd_close(fd),
		unlink: (path) => calls.path_unlink_file(ROOT, PATH, put(PATH, path)),
		calls
	};
}

test('a compiled program reads, writes and appends the files of its project, and what it wrote is known at the end', () => {
	const m = machine({ 'dati.txt': 'uno\ndue\n', 'main.cpp': 'int main() {}', 'voti/': '', 'vecchio.txt': 'x' });
	// the folder of the project is the one folder the program is given
	assert.equal(m.calls.fd_prestat_get(ROOT, 8192), 0);
	assert.equal(m.calls.fd_prestat_get(ROOT + 1, 8192), 8);

	const dati = m.open('dati.txt');
	assert.ok(dati > ROOT);
	assert.equal(m.read(dati, 4), 'uno\n');
	assert.equal(m.read(dati), 'due\n');
	assert.equal(m.read(dati), '');
	assert.equal(m.seek(dati, -4, 2), 4);
	assert.equal(m.read(dati), 'due\n');
	// opened to read: writing is refused
	assert.equal(m.write(dati, 'x'), 8);
	assert.equal(m.close(dati), 0);
	assert.equal(m.close(dati), 8);
	// the same file by its other names; outside the project there is nothing
	assert.ok(m.open('./dati.txt') > 0);
	assert.ok(m.open('/dati.txt') > 0);
	assert.equal(m.open('../dati.txt'), -76);

	// a file that is not there: "no such file" to read it, made to write it; a folder that is not there is not made
	assert.equal(m.open('manca.txt'), -44);
	assert.equal(m.open('nuova/a.txt', 'w'), -44);
	const out = m.open('voti/uscita.txt', 'w');
	assert.equal(m.write(out, 'a\n'), 0);
	assert.equal(m.write(out, 'b\n'), 0);
	m.close(out);
	const more = m.open('voti/uscita.txt', 'a');
	// appending writes at the end wherever the position is
	m.seek(more, 0, 0);
	assert.equal(m.write(more, 'c\n'), 0);
	m.close(more);
	assert.equal(m.read(m.open('voti/uscita.txt')), 'a\nb\nc\n');

	// written again as it was: not a change; opened to write and left empty: a change
	const again = m.open('dati.txt', 'w');
	m.write(again, 'uno\ndue\n');
	m.close(again);
	m.close(m.open('main.cpp', 'w'));
	assert.equal(m.unlink('vecchio.txt'), 0);
	assert.equal(m.unlink('vecchio.txt'), 44);
	const binary = m.open('dati.bin', 'w');
	m.write(binary, '\0\u0001');
	assert.deepEqual(m.changes(), { written: { 'main.cpp': '', 'voti/uscita.txt': 'a\nb\nc\n', 'dati.bin': null }, removed: ['vecchio.txt'] });

	// a file does not grow without end
	const big = m.open('grande.txt', 'w');
	assert.equal(m.calls.fd_filestat_set_size(big, BigInt(MAX_FILE)), 0);
	assert.equal(m.seek(big, 0, 2), MAX_FILE);
	assert.equal(m.write(big, 'x'), 22);

	// every disk starts from the project's files: nothing of the run before is left
	const next = machine({ 'dati.txt': 'uno\ndue\n' });
	assert.equal(next.open('voti/uscita.txt'), -44);
	assert.deepEqual(next.changes(), { written: {}, removed: [] });
});

const pyodide = await loadPyodide();
pyodide.FS.mkdirTree('/sapiens');
for (const name of ['sapiens.py', 'turtle.py']) pyodide.FS.writeFile(`/sapiens/${name}`, readFileSync(new URL(`../../public/codice/${name}`, import.meta.url), 'utf8'));
pyodide.runPython('import sys; sys.path.insert(0, "/sapiens")');
const { esegui, colloca, raccogli } = pyodide.pyimport('sapiens');

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

test('a Python program runs among the files of its project, and what it wrote is known at the end', () => {
	const files = { 'dati.txt': '3\n4\n', 'conti.py': 'def doppio(n):\n    return n * 2\n', 'voti/': '', 'vecchio.txt': 'x' };
	/** A run as the worker makes it: the files, the program, what it left. */
	const among = (source, inputs = [], given = files) => {
		colloca(JSON.stringify(given));
		const result = run(source, inputs);
		return { ...result, changes: result.status === 'input' ? null : JSON.parse(raccogli()) };
	};

	const read = among('import conti\nprint(sum(conti.doppio(int(riga)) for riga in open("dati.txt")))\n');
	assert.equal(read.out, '14\n');
	assert.deepEqual(read.changes, { written: {}, removed: [] });

	const missing = among('try:\n    open("manca.txt")\nexcept FileNotFoundError:\n    print("non c\'è")\n');
	assert.equal(missing.out, "non c'è\n");

	// a file never closed, a file in a folder, a file that is not text, a file removed, a new folder
	const wrote = among('import os\nf = open("uscita.txt", "w")\nf.write("ciao\\n")\nopen("voti/primo.csv", "w").write("a;b\\n")\nopen("dati.bin", "wb").write(bytes([255, 0]))\nos.remove("vecchio.txt")\nos.mkdir("nuova")\n');
	assert.equal(wrote.status, 'ok');
	assert.deepEqual(wrote.changes, { written: { 'uscita.txt': 'ciao\n', 'voti/primo.csv': 'a;b\n', 'dati.bin': null, 'nuova/': '' }, removed: ['vecchio.txt'] });

	// the next run starts from the files it is given: nothing of the run before is left
	assert.equal(among('import os\nprint(sorted(os.listdir(".")))\n').out, "['conti.py', 'dati.txt', 'vecchio.txt', 'voti']\n");

	// a program that reads from the keyboard is run again from the start: it appends once
	const source = 'nome = input()\nwith open("dati.txt", "a") as f:\n    f.write(nome + "\\n")\n';
	assert.equal(among(source).changes, null);
	assert.deepEqual(among(source, ['Ada']).changes.written, { 'dati.txt': '3\n4\nAda\n' });

	// a module that was changed is read again
	assert.equal(among('import conti\nprint(conti.doppio(1))\n', [], { 'conti.py': 'def doppio(n):\n    return 20\n' }).out, '20\n');
});
