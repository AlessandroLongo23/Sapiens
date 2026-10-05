// The flowcharts of a lesson: a ```diagramma block read into its program, drawn and run. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseChartBlock, labelOf } = await jiti.import('../../src/lib/diagramma/blocco.ts');
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
