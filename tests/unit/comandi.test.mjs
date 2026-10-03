// The words of the plotter: the proposals while typing, what a word becomes, the objects of geometry written as commands.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { parse } from '@cortex-js/compute-engine/latex-syntax';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { COMMANDS, commandOf, makeWritten, readWritten, settleKey, settleTyped, track } = await jiti.import('../../src/lib/grafico/comandi.ts');
const { cleanLatex, readEntry, sequences } = await jiti.import('../../src/lib/grafico/formula.ts');
const { construct, lineEquation, circleEquation } = await jiti.import('../../src/lib/grafico/geometria.ts');

const read = (latex) => readEntry(parse(cleanLatex(latex)));
const words = (run) => (track(run)?.found ?? []).map((c) => c.word);

test('every word is one command, and no word is another word of the list', () => {
	const all = COMMANDS.flatMap((c) => [c.word, ...(c.also ?? [])]);
	assert.equal(new Set(all).size, all.length);
	for (const word of all) assert.match(word, /^[a-z]{2,}$/, word);
});

test('the letters typed bring up the words that begin with them', () => {
	assert.deepEqual(words('tra'), ['tratti', 'traslazione']);
	assert.deepEqual(words('trat'), ['tratti']);
	// the words that begin with the letters come before those with a title that does: "Retta parallela"
	assert.equal(words('ret')[0], 'retta');
	assert.ok(words('ret').includes('parallela'));
	assert.ok(words('ci').includes('circonferenza'));
	// the word itself comes first, then the shortest
	assert.deepEqual(words('sin'), ['sin', 'sinh']);
	assert.deepEqual(words('tan').slice(0, 3), ['tan', 'tanh', 'tangente']);
	// a word of the title finds it too: "valore assoluto", "parte intera"
	assert.ok(words('asso').includes('abs'));
	assert.ok(words('val').includes('abs'));
	// one letter is a parameter, and letters that begin no word bring nothing
	assert.equal(track('a'), null);
	assert.equal(track('kx'), null);
});

test('the letters before a word are parameters', () => {
	assert.equal(track('ksin').word, 'sin');
	assert.equal(track('abco').word, 'co');
	assert.deepEqual(settleTyped('asen'), { letters: 3, insert: '\\sin' });
});

test('a whole word that begins no other becomes its formula at once', () => {
	assert.deepEqual(settleTyped('sen'), { letters: 3, insert: '\\sin' });
	assert.deepEqual(settleTyped('ln'), { letters: 2, insert: '\\ln' });
	assert.deepEqual(settleTyped('pi'), { letters: 2, insert: '\\pi' });
	assert.equal(settleTyped('tratti').insert, commandOf('tratti').insert);
	assert.equal(settleTyped('retta').insert, '\\operatorname{retta}\\left(#?;#?\\right)');
	// the long Italian words can now be typed: "int" is on the way to "integrale" and to "intersezione"
	assert.equal(settleTyped('int'), null);
	assert.equal(settleTyped('integrale').insert, commandOf('int').insert);
	assert.equal(settleTyped('intersezione').insert, '\\operatorname{intersezione}\\left(#?;#?\\right)');
	// "tan" may go on to "tangente", the line
	assert.equal(settleTyped('tan'), null);
	assert.equal(settleTyped('tangente').insert, '\\operatorname{tangente}\\left(#?;#?\\right)');
	assert.equal(settleTyped('tr'), null);
});

test('a function name the next letter does not continue is that function', () => {
	assert.deepEqual(settleTyped('sinx'), { letters: 4, insert: '\\sin x' });
	assert.deepEqual(settleTyped('cost'), { letters: 4, insert: '\\cos t' });
	assert.deepEqual(settleTyped('sinh'), { letters: 4, insert: '\\sinh' });
	// "sinc" is the sine and a c, even though "inc" begins "incentro"
	assert.deepEqual(settleTyped('sinc'), { letters: 4, insert: '\\sin c' });
	// a word with holes waits to be chosen
	assert.equal(settleTyped('intx'), null);
});

test('a key that is not a letter settles the word before it', () => {
	assert.deepEqual(settleKey('sin', '('), { letters: 3, insert: '\\sin' });
	assert.deepEqual(settleKey('cos', '^'), { letters: 3, insert: '\\cos' });
	assert.deepEqual(settleKey('2ktan', 'leave'), { letters: 3, insert: '\\tan' });
	// a space asks for the whole formula, with its holes
	assert.deepEqual(settleKey('int', ' '), { letters: 3, insert: commandOf('integrale').insert, swallow: true });
	assert.deepEqual(settleKey('sin', ' '), { letters: 3, insert: '\\sin\\left(#?\\right)', swallow: true });
	assert.equal(settleKey('si', '('), null);
	assert.equal(settleKey('int', '+'), null);
});

test('what a function or a formula with holes writes is read by the plotter', () => {
	for (const c of COMMANDS) {
		if (c.group === 'oggetto') continue;
		let k = 0;
		const filled = c.insert.replace(/#\?/g, () => ['x', '3', '2', 'x'][k++ % 4]);
		const latex = c.word === 'tratti' ? '\\begin{cases}x & x<1\\\\ 2 & x\\ge 1\\end{cases}' : c.word === 'sistema' ? '\\begin{cases}y<x\\\\ y>0\\end{cases}' : c.word === 'successione' ? 'a_{n+1}=2a_n' : c.word === 'infinito' ? '\\sum_{n=1}^{\\infty}\\frac{x}{n^3}' : filled;
		const json = parse(cleanLatex(latex));
		const entry = readEntry(json, {}, { sequences: sequences([json]) });
		// a recurrence alone is read, and asks for the value it starts from
		if (c.word === 'successione') assert.match(entry.message, /manca il valore da cui parte/);
		else assert.notEqual(entry.kind, 'error', `${c.word}: ${latex}: ${entry.message}`);
		if (c.bare && c.word !== 'infinito') assert.notEqual(read(`${c.bare} x`).kind, 'error', c.bare);
	}
});

test('the functions of several numbers', () => {
	const at = (latex, x = 0) => {
		const entry = read(latex);
		assert.equal(entry.kind, 'function', `${latex}: ${entry.message}`);
		return entry.f({ x });
	};
	assert.equal(at('\\max\\left(x;2\\right)', 5), 5);
	assert.equal(at('\\max\\left(x;2\\right)', -5), 2);
	assert.equal(at('\\min\\left(x;2;-1\\right)', 5), -1);
	assert.equal(at('\\operatorname{resto}\\left(x;3\\right)', 7), 1);
	assert.equal(at('\\operatorname{resto}\\left(x;3\\right)', -1), 2);
	assert.equal(at('\\operatorname{mcd}\\left(12;18\\right)'), 6);
	assert.equal(at('\\operatorname{mcm}\\left(4;6\\right)'), 12);
	assert.equal(at('\\operatorname{\\mathrm{mcm}}\\left(4;6\\right)'), 12);
	assert.ok(Number.isNaN(at('\\operatorname{mcd}\\left(x;18\\right)', 2.5)));
	assert.equal(at('\\operatorname{binomiale}\\left(5;2\\right)'), 10);
	assert.equal(at('\\binom{6}{3}'), 20);
	assert.equal(at('\\operatorname{arrotonda}\\left(x\\right)', 2.5), 3);
	assert.equal(at('\\operatorname{arrotonda}\\left(x\\right)', -2.5), -3);
	// the slope of a maximum is the slope of the greater one
	const top = read('\\max\\left(x^2;x\\right)');
	assert.equal(top.d({ x: 3 }), 6);
	assert.equal(top.d({ x: 0.5 }), 1);
	assert.equal(read('\\operatorname{resto}\\left(x\\right)').kind, 'error');
});

test('a row that is a command of geometry is taken apart', () => {
	assert.deepEqual(readWritten('\\operatorname{retta}\\left(A;B\\right)').args, ['A', 'B']);
	const named = readWritten('r_1=\\operatorname{retta}\\left(A_{1}; B\\right)');
	assert.equal(named.name, 'r_1');
	assert.equal(named.command.word, 'retta');
	assert.deepEqual(named.args, ['A_1', 'B']);
	// a radius that is a formula keeps its own brackets and its semicolon-free inside
	assert.deepEqual(readWritten('\\operatorname{circonferenza}\\left(C;\\frac{3}{2}\\right)').args, ['C', '\\frac{3}{2}']);
	assert.deepEqual(readWritten('\\operatorname{circonferenza}\\left(C;\\left(1+2\\right)\\right)').args, ['C', '\\left(1+2\\right)']);
	// as MathLive gives it back
	assert.deepEqual(readWritten('\\operatorname{\\mathrm{retta}}\\left(A;B\\right)').args, ['A', 'B']);
	// the letters alone, as a pasted formula has them
	assert.equal(readWritten('retta\\left(A;B\\right)').command.word, 'retta');
	assert.equal(readWritten('cerchio\\left(A;B\\right)').command.word, 'circonferenza');
	assert.equal(readWritten('\\sin\\left(x\\right)'), null);
	assert.equal(readWritten('\\operatorname{mcd}\\left(4;6\\right)'), null);
	assert.equal(readWritten('y=2x+1'), null);
});

test('a written command makes the same objects as its tool', () => {
	const P = (x, y) => ({ kind: 'point', x, y });
	const rows = [P(0, 1), P(2, 5), P(4, 0)];
	const get = (id) => (rows[id].type ? construct(rows[id], get) : rows[id]);
	const arg = (id) => ({ id, name: 'ABCDEFG'[id] });
	const make = (word, ...args) => makeWritten(word, args.map((a) => (typeof a === 'number' ? arg(a) : a)), get);

	const [line] = make('retta', 0, 1);
	assert.deepEqual(line, { build: { type: 'line', of: [0, 1] }, name: 'line', label: true });
	rows.push(line.build);
	assert.equal(lineEquation(get(3)), 'y=2x+1');

	// the kinds of the arguments choose the way: centre and point, centre and radius, three points
	assert.equal(make('circonferenza', 0, 1)[0].build.type, 'circle');
	assert.deepEqual(make('circonferenza', 0, { value: 3 })[0].build, { type: 'circler', of: [0], at: 3 });
	const [through] = make('circonferenza', 0, 1, 2);
	assert.equal(through.build.type, 'circle3');
	rows.push(through.build);
	assert.match(circleEquation(get(4).circle), /x\^2/);

	// a line and a point in any order
	assert.deepEqual(make('parallela', 3, 2)[0].build, { type: 'parallel', of: [3, 2] });
	assert.deepEqual(make('perpendicolare', 2, 3)[0].build, { type: 'perpendicular', of: [3, 2] });
	// what makes more than one object
	assert.equal(make('intersezione', 3, 4).length, 2);
	// from a point of the circle one tangent, from a point outside two
	assert.equal(make('tangente', 4, 2).length, 1);
	rows.push(P(10, 10));
	assert.equal(make('tangente', 5, 4).length, 2);
	assert.deepEqual(make('tangente', 5, 4)[1].build, { type: 'tangent', of: [5, 4], index: 1 });
	assert.deepEqual(make('baricentro', 0, 1, 2)[0], { build: { type: 'centre', of: [0, 1, 2], index: 0 }, name: 'point', wish: 'G', label: true });
	assert.equal(make('poligono', 0, 1, 2)[0].build.type, 'polygon');
	assert.equal(make('pendenza', 3)[0].build.type, 'slope');

	// what is missing is said
	assert.equal(make('retta', 0), 'Scrivi retta(A; B).');
	assert.equal(make('retta', 0, 0), 'Servono oggetti diversi tra loro.');
	assert.equal(make('retta', 0, 3), 'Scrivi retta(A; B).');
	assert.match(make('circonferenza', 0, { value: -1 }), /maggiore di zero/);
	assert.match(make('pendenza', 4), /^Scrivi/);
});

test('the formulas of the menu are the same as those of the proposals', async () => {
	const { PLOT_TEMPLATES } = await jiti.import('../../src/components/math/mathlive.ts');
	for (const t of PLOT_TEMPLATES) assert.equal(commandOf(t.word)?.insert, t.insert, t.word);
});

test('a name before a colon is the name of the formula', async () => {
	const { readLabel } = await jiti.import('../../src/lib/grafico/comandi.ts');
	// y = … with no other y is the function of that name, which the other rows can use
	assert.deepEqual(readLabel('f: y=2x+1'), { name: 'f', formula: 'f\\left(x\\right)=2x+1', function: true });
	assert.deepEqual(readLabel('r:y=\\frac{x}{2}'), { name: 'r', formula: 'r\\left(x\\right)=\\frac{x}{2}', function: true });
	assert.equal(read(readLabel('f: y=2x+1').formula).name, 'f');
	// anything else keeps its formula, and the name is a label
	assert.deepEqual(readLabel('r: x=3'), { name: 'r', formula: 'x=3', function: false });
	assert.deepEqual(readLabel('\\gamma: x^2+y^2=4'), { name: '\\gamma', formula: 'x^2+y^2=4', function: false });
	assert.deepEqual(readLabel('s_{1}: y^2=x'), { name: 's_1', formula: 'y^2=x', function: false });
	assert.equal(readLabel('c: y<x').function, false);
	// t cannot name a function: the line keeps its name as a label
	assert.deepEqual(readLabel('t: y=x'), { name: 't', formula: 'y=x', function: false });
	// a division, and formulas with no name
	assert.equal(readLabel('a:b'), null);
	assert.equal(readLabel('y=2x+1'), null);
	assert.equal(readLabel('y=a:b'), null);
});
