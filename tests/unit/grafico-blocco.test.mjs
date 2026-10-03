// The plane of a lesson: a ```grafico block of the lesson's markdown, read into the formulas, sliders and window of
// the plotter's plane. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { parse } from '@cortex-js/compute-engine/latex-syntax';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { cleanLatex, definitions, readEntry } = await jiti.import('../../src/lib/grafico/formula.ts');
const { parsePlotBlock, readPlotBlock } = await jiti.import('../../src/lib/grafico/blocco.ts');

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);

test('the plane of a lesson is read from its block', async () => {
	const block = [
		'% nome: parabola-coefficienti',
		'% alt: La parabola con i suoi cursori',
		'curva: y=ax^2+bx+c | nome',
		'curva: y=x^2 | tratteggiata | grigio',
		'scelta: > 0 :: ax^2+bx+c>0',
		'scelta: \\le 0 :: ax^2+bx+c\\le0 | rosso',
		'cursore: a = 1 da -3 a 3 passo 0,5',
		'cursore: b = -2 da -6 a 6 passo 1 anima',
		'cursore: c = 0 da -6 a 6',
		'finestra: x da -6 a 6, y da -4 a 8',
		'forma: 3:2',
		'valore: \\Delta = b^2-4ac',
		'valore: V = \\left(-\\frac{b}{2a};c-\\frac{b^2}{4a}\\right)',
		'assi: t, s (m)',
		'sposta: sì',
		'domanda: Porta $a$ sotto zero.'
	].join('\n');
	const { plot, errors } = parsePlotBlock(block);
	assert.deepEqual(errors, []);
	assert.equal(plot.rows.length, 3);
	assert.deepEqual([plot.rows[0].label, plot.rows[1].dash, plot.rows[1].color], [true, 'dashed', '#808080']);
	// the grey curve of comparison does not take a colour of the palette
	assert.deepEqual([plot.rows[0].color, plot.rows[2].color], ['#0000ff', '#ff0000']);
	assert.deepEqual(plot.rows[2].options.map((o) => o.label), ['> 0', '\\le 0']);
	assert.deepEqual(plot.rows[2].options.map((o) => o.color), [undefined, '#ff0000']);
	assert.deepEqual(plot.sliders[1], { name: 'b', value: -2, min: -6, max: 6, step: 1, play: true });
	assert.equal(plot.sliders[2].step, 0.1);
	assert.deepEqual(plot.window, { x0: -6, x1: 6, y0: -4, y1: 8 });
	assert.equal(plot.shape, 1.5);
	assert.deepEqual(plot.axes, ['t', 's (m)']);
	assert.equal(plot.free, true);
	const { read, errors: unread } = readPlotBlock(plot, parse, cleanLatex);
	assert.deepEqual(unread, []);
	// the page carries the formulas already parsed
	const defs = definitions(read.rows.map((r) => r.json));
	close(readEntry(read.rows[0].json, defs).f({ x: 2, a: 1, b: -2, c: 0 }), 0);
	close(readEntry(read.values[0].json, defs).f({ x: 0, a: 1, b: -2, c: 0 }), 4);
	assert.equal(readEntry(read.rows[2].options[1].json, defs).kind, 'inequality');
});

test('a block that cannot be drawn says what is wrong', async () => {
	const head = '% nome: prova\n% alt: Prova\n';
	assert.match(parsePlotBlock('curva: y=x').errors.join(), /nome.*alt/);
	assert.match(parsePlotBlock(head + 'curva: y=x\ncursore: a = 5 da 0 a 3').errors[0], /cursore non letto/);
	assert.match(parsePlotBlock(head + 'curva: y=x | storta').errors[0], /aspetto/);
	assert.match(parsePlotBlock(head + 'curva: y=x\nfinestra: x da 3 a 1, y da 0 a 1').errors[0], /finestra/);
	assert.match(parsePlotBlock(head + 'curva: y=x\nscelta: y=2x').errors[0], /almeno due/);
	assert.match(parsePlotBlock(head + 'grafo: y=x').errors.join(), /sconosciuta/);
	const errorsOf = (text) => readPlotBlock(parsePlotBlock(head + text).plot, parse, cleanLatex).errors;
	assert.match(errorsOf('curva: y=ax')[0], /manca il cursore di a/);
	assert.match(errorsOf('curva: y=\\frac{x}{')[0], /y=/);
	assert.match(errorsOf('curva: y=x\nvalore: k = x+1')[0], /dipende da x/);
	assert.match(errorsOf('curva: y=x\nvalore: k = 2b')[0], /manca il cursore di b/);
	assert.deepEqual(errorsOf('curva: y=mx\ncursore: m = 1 da -2 a 2\nvalore: k = 2m'), []);
});
