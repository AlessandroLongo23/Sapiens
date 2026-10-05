// The flowcharts of a lesson: a ```diagramma block read into its program, drawn and run. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { loadPyodide } from 'pyodide';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseChartBlock, parseProgram, programText, labelOf } = await jiti.import('../../src/lib/diagramma/blocco.ts');
const { codeOf, codeText, typesOf } = await jiti.import('../../src/lib/diagramma/codice.ts');
const { blockAt, insertBlock, newBlock, removeBlock, replaceBlock, rewriteBlock } = await jiti.import('../../src/lib/diagramma/modifica.ts');
const { buildChart, chartSvg } = await jiti.import('../../src/lib/diagramma/disegno.ts');
const { advance, runAll, startRun, MAX_STEPS } = await jiti.import('../../src/lib/diagramma/esecuzione.ts');
const { evaluate, parseExpression, readValue, showExpression, showValue, textOf, tokenize } = await jiti.import('../../src/lib/diagramma/espressione.ts');

const HEAD = ['% nome: prova', '% alt: Un diagramma di prova'];
const read = (lines, inputs = '') => parseChartBlock([...HEAD, ...(inputs ? [`% ingresso: ${inputs}`] : []), ...lines].join('\n'));
const chartOf = (lines) => buildChart(read(lines).block.program);
const value = (source, variables = {}) => evaluate(parseExpression(tokenize(source)), variables);

test('an expression follows the usual precedence', () => {
	assert.equal(value('2 + 3 * 4'), 14);
	assert.equal(value('(2 + 3) * 4'), 20);
	assert.equal(value('-n + 1', { n: 5 }), -4);
	assert.equal(value('7 / 2'), 3.5);
	assert.equal(value('7 // 2'), 3);
	assert.equal(value('7 % 2'), 1);
	assert.equal(value('-7 // 2'), -4);
	assert.equal(value('7 div 2 + 7 mod 2'), 4);
	assert.equal(value('"ab" + "c"'), 'abc');
});

test('conditions give true or false, with E, O and NON', () => {
	assert.equal(value('i <= n', { i: 6, n: 5 }), false);
	assert.equal(value('a > 0 E a < 10', { a: 4 }), true);
	assert.equal(value('a < 0 O a > 10', { a: 4 }), false);
	assert.equal(value('NON a == 4', { a: 4 }), false);
	assert.equal(value('not (a < 0) and vero', { a: 4 }), true);
	assert.equal(value('"b" > "a"'), true);
	// the right side of "e" is not reached when the left is false
	assert.equal(value('n != 0 E 10 / n > 1', { n: 0 }), false);
});

test('a mistake in an expression is told in words', () => {
	assert.throws(() => value('x + 1'), /la variabile x non ha ancora un valore/);
	assert.throws(() => value('1 / 0'), /dividere per zero/);
	assert.throws(() => value('"a" + 1'), /lavora sui numeri/);
	assert.throws(() => value('1 == "1"'), /non si confrontano/);
	assert.throws(() => tokenize('a = 1'), /si scrive ==/);
	assert.throws(() => parseExpression(tokenize('(1 + 2')), /parentesi/);
	assert.throws(() => parseExpression(tokenize('1 +')), /incompleta/);
});

test('an expression is shown with the signs of a chart, and with values in place of names', () => {
	const tokens = tokenize('i<=n*2');
	assert.equal(textOf(showExpression(tokens)), 'i ≤ n · 2');
	assert.equal(textOf(showExpression(tokens, { i: 6, n: 2.5 })), '6 ≤ 2,5 · 2');
	assert.equal(textOf(showExpression(tokenize('-(a+1)'))), '−(a + 1)');
	// e and o are names; the words that join two conditions are capitals
	assert.equal(textOf(showExpression(tokenize('e < 14 and NON o'))), 'e < 14 E NON o');
	assert.equal(textOf(showExpression(tokenize('a - -1'))), 'a − −1');
	assert.deepEqual(showExpression(tokenize('s + 1')), [{ text: 's', name: true }, { text: ' + 1' }]);
	assert.equal(showValue(0.1 + 0.2), '0,3');
	assert.equal(showValue(-3), '−3');
	assert.equal(readValue(' 3,5 '), 3.5);
	assert.equal(readValue('-2'), -2);
	assert.equal(readValue('Anna'), 'Anna');
});

test('a block is read into its program', () => {
	const { block, errors } = read(['leggi n', 's = 0', 'finché n != 0', '    se n > 0', '        s = s + n', '    altrimenti', '        scrivi "negativo", n', '    leggi n', 'scrivi s'], '3, -1, 0');
	assert.deepEqual(errors, []);
	assert.deepEqual(block.inputs, ['3', '-1', '0']);
	assert.deepEqual(
		block.program.map((s) => s.kind),
		['input', 'assign', 'while', 'output']
	);
	const loop = block.program[2];
	assert.deepEqual(
		loop.body.map((s) => s.kind),
		['if', 'input']
	);
	assert.equal(loop.body[0].else.length, 1);
	assert.equal(textOf(labelOf(loop)), 'n ≠ 0?');
	assert.equal(textOf(labelOf(block.program[1])), 's ← 0');
	assert.equal(textOf(labelOf(loop.body[0].else[0])), 'scrivi “negativo”, n');
});

test('a block that cannot be read says where', () => {
	assert.deepEqual(parseChartBlock('leggi n').errors, ['manca "% nome:"', 'manca "% alt:"']);
	assert.match(read(['se n > 0', 'scrivi n']).errors[0], /riga 3: sotto "se" servono/);
	assert.match(read(['leggi 3']).errors[0], /riga 3: dopo "leggi"/);
	assert.match(read(['altrimenti', '    scrivi 1']).errors[0], /"altrimenti" senza un "se"/);
	assert.match(read(['salta 3']).errors[0], /non è un'istruzione/);
	assert.match(read(['se = 3']).errors[0], /riga 3/);
	assert.match(read(['x = 1', '    y = 2']).errors[0], /riga 4: il rientro/);
	assert.deepEqual(read([]).errors, ['il diagramma è vuoto']);
});

test('a chart runs to its end and keeps what it wrote', () => {
	const run = runAll(chartOf(['leggi n', 's = 0', 'i = 1', 'finché i <= n', '    s = s + i', '    i = i + 1', 'scrivi "Somma:", s']), ['4']);
	assert.equal(run.error, null);
	assert.equal(run.done, true);
	assert.deepEqual(run.output, ['Somma: 10']);
	assert.deepEqual(run.variables, { n: 4, s: 10, i: 5 });
});

test('the two branches of a selection, and the selection with one', () => {
	const two = chartOf(['leggi v', 'se v >= 6', '    scrivi "promosso"', 'altrimenti', '    scrivi "bocciato"']);
	assert.deepEqual(runAll(two, ['7']).output, ['promosso']);
	assert.deepEqual(runAll(two, ['5,5']).output, ['bocciato']);
	const one = chartOf(['leggi p', 'se p > 50', '    p = p - 10', 'scrivi p']);
	assert.deepEqual(runAll(one, ['80']).output, ['70']);
	assert.deepEqual(runAll(one, ['50']).output, ['50']);
});

test('each step tells what it did and which variables it touched', () => {
	const chart = chartOf(['leggi n', 'se n > 3', '    n = n * 2', 'scrivi n']);
	let run = advance(chart, startRun());
	assert.equal(run.waiting, true);
	assert.deepEqual(run.event, { kind: 'ask', name: 'n' });
	// a "leggi" waits until something is typed
	assert.equal(advance(chart, run, '  '), run);
	run = advance(chart, run, '5');
	assert.deepEqual(run.event, { kind: 'input', name: 'n', value: 5 });
	assert.equal(run.written, 'n');
	run = advance(chart, run);
	assert.deepEqual(run.event, { kind: 'cond', shown: '5 > 3', value: true });
	assert.deepEqual(run.reads, ['n']);
	run = advance(chart, run);
	assert.deepEqual(run.event, { kind: 'assign', name: 'n', shown: '5 · 2', value: 10 });
	assert.equal(run.taken, `${chart.nodes.find((n) => n.shape === 'decision').id}-yes`);
	run = advance(chart, advance(chart, run));
	assert.equal(run.done, true);
	assert.equal(advance(chart, run), run);
});

test('a run stops at a mistake and at a loop that never ends', () => {
	const wrong = runAll(chartOf(['leggi d', 'q = 10 / d', 'scrivi q']), ['0']);
	assert.match(wrong.error, /dividere per zero/);
	assert.deepEqual(wrong.output, []);
	const endless = runAll(chartOf(['i = 1', 'finché i > 0', '    i = i + 1']), []);
	assert.match(endless.error, /non è ancora finito/);
	assert.equal(endless.steps, MAX_STEPS + 1);
	assert.match(runAll(chartOf(['leggi a']), []).error, /mancano dei valori/);
	assert.match(runAll(chartOf(['se 3', '    scrivi 1']), []).error, /vera o falsa/);
});

test('every block of the drawing leads somewhere, and nothing overlaps', () => {
	const chart = chartOf(['leggi n', 'i = 1', 'finché i <= n', '    se i % 2 == 0', '        scrivi i, "è pari"', '    altrimenti', '        se i > 100', '            scrivi "grande"', '        scrivi i', '    i = i + 1', 'scrivi "fine"']);
	for (const node of chart.nodes) {
		if (node.shape === 'decision') assert.ok(node.yes !== undefined && node.no !== undefined);
		else if (node.id !== chart.nodes.length - 1) assert.ok(node.next !== undefined);
		assert.ok(node.x - node.w / 2 >= 0 && node.x + node.w / 2 <= chart.width && node.y + node.h <= chart.height);
	}
	chart.nodes.forEach((a, i) =>
		chart.nodes.slice(i + 1).forEach((b) => {
			const apart = Math.abs(a.x - b.x) >= (a.w + b.w) / 2 || a.y + a.h <= b.y || b.y + b.h <= a.y;
			assert.ok(apart, `${textOf(a.label)} e ${textOf(b.label)} si sovrappongono`);
		})
	);
	for (const edge of chart.edges) for (const [x, y] of edge.points) assert.ok(x >= 0 && x <= chart.width && y >= 0 && y <= chart.height);
	// lines are drawn straight: every stretch is horizontal or vertical
	for (const edge of chart.edges) edge.points.slice(1).forEach(([x, y], i) => assert.ok(x === edge.points[i][0] || y === edge.points[i][1]));
});

test('the drawing marks the block of the run and the line it came by, and escapes what it shows', () => {
	const chart = chartOf(['scrivi "<b>"', 'x = 1']);
	const svg = chartSvg(chart, 'Un "diagramma"', { at: 1, taken: '0-next' });
	assert.match(svg, /aria-label="Un &quot;diagramma&quot;"/);
	assert.match(svg, /“&lt;b&gt;”/);
	assert.equal(svg.match(/fc-on/g).length, 1);
	assert.match(svg, /class="fc-line fc-taken" data-edge="0-next"/);
	assert.match(svg, /<tspan font-style="italic">x<\/tspan> ← 1/);
});

const programOf = (lines) => parseProgram(lines.join('\n'), true).program;
const code = (lines, language, samples) => codeText(codeOf(programOf(lines), language, samples));

test('a "leggi" can say what it takes, and refuses the rest', () => {
	const chart = buildChart(programOf(['leggi n: intero', 'leggi nome: testo', 'scrivi nome, n']));
	let run = advance(chart, startRun());
	const refused = advance(chart, run, '2,5');
	assert.equal(refused.waiting, true);
	assert.match(refused.refused, /n vuole un numero intero/);
	run = advance(chart, advance(chart, refused, '2'));
	assert.equal(run.refused, null);
	// a text stays a text, even when it reads as a number
	run = advance(chart, run, '12');
	assert.equal(run.variables.nome, '12');
	assert.match(read(['leggi n: lungo']).errors[0], /intero, decimale o testo/);
	assert.match(runAll(chart, ['x', 'y']).error, /numero intero/);
});

test('a chart is written back as the lines it was read from', () => {
	const lines = ['leggi n: intero', 's = 0', 'finché n != 0 E NON (s > 100)', '    se n % 2 == 0', '        s = s + -n * 2.5', '    altrimenti', '        scrivi "dispari", n', '    leggi n', 'scrivi s'];
	const text = programText(programOf(lines));
	assert.equal(text, lines.join('\n') + '\n');
	// a body with nothing in it yet is read back loosely
	const empty = programOf(['se x > 0', 'altrimenti', 'finché x > 0']);
	assert.deepEqual([empty[0].then, empty[0].else, empty[1].body], [[], [], []]);
	assert.equal(programText(empty), 'se x > 0\naltrimenti\nfinché x > 0\n');
	assert.match(read(['finché x > 0']).errors[0], /servono delle istruzioni rientrate/);
	assert.equal(parseChartBlock('% nome: a\n% alt: b\n% modifica: sì').block.edit, true);
});

test('a block is added, rewritten and removed where its place says', () => {
	const program = programOf(['leggi n', 'finché n > 0', '    se n > 5', '        scrivi "grande"', '    n = n - 1']);
	const added = insertBlock(program, '1b.0t:1', programOf(['scrivi n'])[0]);
	assert.equal(programText(added), 'leggi n\nfinché n > 0\n    se n > 5\n        scrivi "grande"\n        scrivi n\n    n = n - 1\n');
	// the program given is left as it was
	assert.equal(program[1].body[0].then.length, 1);
	assert.equal(blockAt(added, '1b.0t:1').kind, 'output');
	assert.equal(blockAt(added, '1b.0e:0'), null);
	const loop = rewriteBlock(blockAt(program, ':1'), 'finché n >= 1');
	assert.equal(loop.error, null);
	assert.equal(programText(replaceBlock(program, ':1', loop.stmt)).split('\n')[1], 'finché n >= 1');
	assert.equal(loop.stmt.body.length, 2);
	assert.match(rewriteBlock(blockAt(program, ':1'), 'finché n >').error, /incompleta/);
	assert.equal(programText(removeBlock(program, '1b:0')), 'leggi n\nfinché n > 0\n    n = n - 1\n');
	assert.equal(programText(insertBlock([], ':0', newBlock('while', []))), 'finché x > 0\n');
	// a new block starts from the names the chart has
	assert.equal(programText([newBlock('input', program)]), 'leggi x\n');
	assert.equal(programText([newBlock('output', program)]), 'scrivi n\n');
});

test('the gaps of a chart being changed are where a block can go', () => {
	const chart = buildChart(programOf(['leggi n', 'se n > 0', 'altrimenti', 'finché n > 0']), true);
	assert.deepEqual(chart.slots.map((slot) => slot.place).sort(), [':0', ':1', ':2', ':3', '1e:0', '1t:0', '2b:0'].sort());
	assert.equal(chart.nodes.find((node) => node.shape === 'data').place, ':0');
	const svg = chartSvg(chart, 'x', { picked: { kind: 'slot', place: '2b:0' } });
	assert.match(svg, /class="fc-slot fc-picked" data-slot="2b:0"/);
	assert.match(svg, /data-place=":1" role="button"/);
	assert.equal(buildChart(programOf(['leggi n'])).slots.length, 0);
	// a chart with empty branches still runs
	assert.equal(runAll(buildChart(programOf(['leggi n', 'se n > 0', 'altrimenti', 'finché n > 3', 'scrivi n'])), ['2']).output[0], '2');
});

test('the chart is written in Python', () => {
	assert.equal(
		code(['leggi n', 's = 0', 'finché n != 0 E NON (s > 100)', '    se n % 2 == 0', '        s = s + n // 2', '    altrimenti', '        scrivi "dispari", n', '    leggi n', 'scrivi s, vero'], 'python'),
		['n = int(input())', 's = 0', 'while n != 0 and not s > 100:', '    if n % 2 == 0:', '        s = s + n // 2', '    else:', '        print("dispari", n)', '    n = int(input())', 'print(s, True)', ''].join('\n')
	);
	assert.equal(code(['se x > 0', 'finché x > 0'], 'python'), 'if x > 0:\n    pass\nwhile x > 0:\n    pass\n');
	assert.equal(code(['x = (a + b) * -(c - 1) - (d - e)'], 'python'), 'x = (a + b) * -(c - 1) - (d - e)\n');
	assert.equal(code(['leggi nome', 'se nome == "Anna"', '    scrivi "ciao"'], 'python').split('\n')[0], 'nome = input()');
	assert.equal(code(['leggi p'], 'python', ['2.5']), 'p = float(input())\n');
	assert.equal(code([], 'python'), '\n');
});

test('the chart is written in C++, with a type for every variable', () => {
	assert.deepEqual(typesOf(programOf(['leggi n', 'leggi nome: testo', 'm = n / 2', 'k = n // 2', 'ok = n > 0', 't = 0', 'finché n > 0', '    t = t + m'])), { n: 'int', nome: 'str', m: 'float', k: 'int', ok: 'bool', t: 'float' });
	assert.equal(
		code(['leggi n', 's = 0', 'finché n > 0 O NON (s == 0)', '    q = n / 2', '    se q > 1.5', '        s = s + n', '    n = n - 1', 'scrivi "Somma:", s, n + 1'], 'cpp'),
		[
			'#include <iostream>',
			'using namespace std;',
			'',
			'int main() {',
			'    double q;',
			'    int n;',
			'    cin >> n;',
			'    int s = 0;',
			'    while (n > 0 || !(s == 0)) {',
			'        q = (double) n / 2;',
			'        if (q > 1.5) {',
			'            s = s + n;',
			'        }',
			'        n = n - 1;',
			'    }',
			'    cout << "Somma:" << " " << s << " " << n + 1 << endl;',
			'    return 0;',
			'}',
			''
		].join('\n')
	);
	const text = code(['leggi nome', 'leggi x', 'scrivi nome == "Anna", x % 2', 'se x > 0', 'altrimenti'], 'cpp', ['Anna', '2,5']);
	assert.match(text, /#include <string>\n#include <cmath>/);
	assert.match(text, /string nome;\n    cin >> nome;\n    double x;/);
	assert.match(text, /cout << \(nome == "Anna"\) << " " << fmod\(x, 2\) << endl;/);
	assert.match(text, /if \(x > 0\) {\n    } else {\n    }/);
});

test('each line of the code knows its block', () => {
	const program = programOf(['leggi n', 'finché n > 0', '    n = n - 1']);
	const lines = codeOf(program, 'cpp');
	assert.equal(lines.find((line) => line.text.includes('while')).stmt, program[1]);
	assert.equal(lines.find((line) => line.text.includes('cin')).stmt, program[0]);
	assert.equal(lines.find((line) => line.text === '    int n;').stmt, undefined);
	assert.equal(codeOf(program, 'python')[2].stmt, program[1].body[0]);
});

test('the Python written from a chart prints what the chart prints', async () => {
	const pyodide = await loadPyodide();
	const cases = [
		[['leggi n', 's = 0', 'i = 1', 'finché i <= n', '    s = s + i', '    i = i + 1', 'scrivi "Somma:", s'], ['10']],
		[['leggi n', 'finché n > 0', '    se n % 3 == 0 O n == 7', '        scrivi n, "sì"', '    altrimenti', '        se NON (n > 4) E n != 2', '            scrivi n, -n // 2, -n % 3', '    n = n - 1', 'scrivi "via!"'], ['9']],
		[
			['leggi nome', 'leggi anni', 'se nome == "Anna" E anni >= 18', '    scrivi "ciao " + nome', 'altrimenti', '    scrivi (anni + 2) * 3 - (anni - 1)'],
			['Anna', '15']
		]
	];
	for (const [lines, inputs] of cases) {
		const program = programOf(lines);
		const expected = runAll(buildChart(program), inputs);
		assert.equal(expected.error, null);
		const printed = [];
		const typed = [...inputs];
		pyodide.setStdin({ stdin: () => typed.shift() });
		pyodide.setStdout({ batched: (line) => printed.push(line) });
		pyodide.runPython(codeText(codeOf(program, 'python', inputs)));
		// the chart writes the minus of a negative number as a typographic sign
		assert.deepEqual(
			printed,
			expected.output.map((line) => line.replaceAll('−', '-'))
		);
	}
});
