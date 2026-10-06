// The Cartesian plane of the exercises: a scene described by formulas (src/lib/exercises/v2/piano.ts), read and
// drawn as a still SVG on the server (v2/piano-svg.ts, lib/grafico/statico.ts). Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { piano, pianoData } = await jiti.import('../../src/lib/exercises/v2/piano.ts');
const { readPlane, drawnScene, sceneOptionHtml } = await jiti.import('../../src/lib/exercises/v2/piano-svg.ts');
const { layoutPlane, planeSvg } = await jiti.import('../../src/lib/grafico/statico.ts');
const { getGenerator } = await jiti.import('../../src/lib/exercises/v2/registry.ts');
const { createRng } = await jiti.import('../../src/lib/exercises/v2/rng.ts');

const scene = piano(
	{ finestra: [-4, 4, -2, 6], curve: [{ formula: 'y = 3^x + 1' }, { formula: 'y = 1', tratto: 'tratteggiato' }], punti: [{ x: 0, y: 2 }, { x: 1, y: 4, etichetta: '(1, 4)' }] },
	'Una curva che sale e passa per (0, 2) e (1, 4)'
);

test('the formulas of a plane are read as the plotter reads them', () => {
	const { plane, errors } = readPlane(scene);
	assert.deepEqual(errors, []);
	assert.equal(plane.curves.length, 2);
	assert.equal(plane.curves[0].f(1), 4);
	assert.equal(plane.curves[1].f(-3), 1);
	assert.deepEqual([plane.curves[0].dash, plane.curves[1].dash], ['solid', 'dashed']);
	// the first curve is blue, a dashed line with no colour is grey
	assert.deepEqual([plane.curves[0].color, plane.curves[1].color], ['#0000ff', '#808080']);
	const others = readPlane(piano({ finestra: [-3, 3, -3, 3], curve: [{ formula: 'x^2+y^2=4' }, { formula: 'x=-1', tratto: 'tratteggiato' }, { formula: 'y=\\left(\\frac{1}{2}\\right)^{x-1}' }] }, 'Una circonferenza'));
	assert.deepEqual(others.errors, []);
	assert.ok('implicit' in others.plane.curves[0] && 'implicit' in others.plane.curves[1]);
	assert.equal(others.plane.curves[2].f(0), 2);
});

test('a plane that cannot be drawn says why', () => {
	assert.match(readPlane(piano({ finestra: [-3, 3, -3, 3], curve: [{ formula: 'y=ax' }] }, 'Una retta')).errors[0], /lettere a/);
	assert.equal(readPlane(piano({ finestra: [-3, 3, -3, 3], curve: [{ formula: 'y=\\foo' }] }, 'Niente')).plane, null);
	assert.deepEqual(pianoData(piano({ finestra: [3, -3, -3, 3], curve: [] }, '')).errors, ['finestra non valida', 'manca il testo alternativo']);
	assert.deepEqual(pianoData({ type: 'righello', data: {}, alt: 'Un righello' }), { data: null, errors: [] });
});

test('the curve drawn passes through its points, and the window is the one asked', () => {
	const { plane } = readPlane(scene);
	const l = layoutPlane(plane);
	assert.equal(l.W / l.H, 1);
	assert.deepEqual([l.X(-4), l.X(4), l.Y(6), l.Y(-2)], [0, l.W, 0, l.H]);
	// every sampled point of the curve is on y = 3^x + 1
	for (const line of l.lines[0]) for (const p of line) assert.ok(Math.abs(p.y - Math.min(30, 3 ** p.x + 1)) < 1e-6 || p.y >= 30);
	const xs = l.lines[0].flat().map((p) => p.x);
	assert.ok(Math.min(...xs) <= -3.99 && Math.max(...xs) >= 1.4);
	assert.deepEqual(l.xNumbers, [-4, -3, -2, -1, 0, 1, 2, 3, 4]);
});

test('the drawing is a still SVG with its description, smaller and with fewer numbers as an option', () => {
	const { plane } = readPlane(scene);
	const full = planeSvg(plane);
	const small = planeSvg(plane, true);
	assert.match(full, /^<svg [^>]*class="plane-drawing"[^>]*role="img" aria-label="Una curva che sale e passa per \(0, 2\) e \(1, 4\)"/);
	assert.match(full, /viewBox="0 0 360 360"/);
	assert.match(small, /viewBox="0 0 176 176"/);
	assert.equal((full.match(/<circle /g) ?? []).length, 2);
	assert.ok(full.includes('>(1, 4)</text>') && full.includes('stroke-dasharray'));
	assert.ok(!/<script|on[a-z]+=/.test(full));
	const numbers = (svg) => (svg.match(/<text [^>]*>[−\d,]+<\/text>/g) ?? []).length;
	assert.ok(numbers(small) < numbers(full) && numbers(small) >= 4);
	assert.deepEqual(layoutPlane(plane, true).xNumbers, [-4, -2, 0, 2, 4]);
	assert.ok(full.length < 8000 && small.length < 8000);
});

test('the page gets the drawing, not the formulas to read', () => {
	const drawn = drawnScene(scene);
	assert.equal(drawn.type, 'piano-cartesiano');
	assert.ok(drawn.data.svg.startsWith('<svg '));
	assert.ok(sceneOptionHtml(scene).includes('plane-compact'));
	const other = { type: 'righello', data: { lunghezza: 3 }, alt: 'Un righello' };
	assert.equal(drawnScene(other), other);
});

test('the graphs of funzioni-esponenziali can all be drawn', async () => {
	const g = await getGenerator('funzioni-esponenziali');
	for (let seed = 1; seed <= 60; seed++) {
		const six = g.generate(createRng(seed), 6);
		assert.equal(six.answer.options.length, 4);
		for (const o of six.answer.options) assert.deepEqual(readPlane(o.scene).errors, []);
		assert.deepEqual(readPlane(six.solutionScene).errors, []);
		assert.deepEqual(readPlane(g.generate(createRng(seed), 7).scene).errors, []);
	}
});
