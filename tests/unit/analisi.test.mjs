// Limits, asymptotes, slope fields: what the plotter finds by trying numbers.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { parse } from '@cortex-js/compute-engine/latex-syntax';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { cleanLatex, readEntry } = await jiti.import('../../src/lib/grafico/formula.ts');

const read = (latex) => readEntry(parse(cleanLatex(latex)));
const value = (latex, scope = {}) => {
	const entry = read(latex);
	assert.equal(entry.kind, 'function', `${latex}: ${entry.message}`);
	return entry.f({ x: 0, ...scope });
};
const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);

test('a limit at a point is the number the values come close to', () => {
	close(value('\\lim_{x\\to 2}\\frac{x^2-4}{x-2}'), 4);
	close(value('\\lim_{x\\to 0}\\frac{\\sin x}{x}'), 1);
	close(value('\\lim_{x\\to 0}\\frac{1-\\cos x}{x^2}'), 0.5);
	close(value('\\lim_{x\\to 0}\\frac{e^x-1}{x}'), 1);
	close(value('\\lim_{x\\to 3}\\left(x^2+1\\right)'), 10);
	// at the edge of the domain, the side where the function is
	close(value('\\lim_{x\\to 0}\\sqrt{x}'), 0);
	// a row that is a limit is a number, the same for every x
	assert.equal(read('\\lim_{x\\to 2}x^2').constant, true);
	assert.equal(read('x^2').constant, undefined);
	assert.equal(read('2+3').constant, true);
});

test('a limit from one side, and one that is not there', () => {
	assert.equal(value('\\lim_{x\\to 0^+}\\frac{1}{x}'), Infinity);
	assert.equal(value('\\lim_{x\\to 0^-}\\frac{1}{x}'), -Infinity);
	assert.ok(Number.isNaN(value('\\lim_{x\\to 0}\\frac{1}{x}')));
	assert.equal(value('\\lim_{x\\to 0}\\frac{1}{x^2}'), Infinity);
	close(value('\\lim_{x\\to 0^+}\\frac{\\left|x\\right|}{x}'), 1);
	close(value('\\lim_{x\\to 0^-}\\frac{\\left|x\\right|}{x}'), -1);
	assert.ok(Number.isNaN(value('\\lim_{x\\to 0}\\frac{\\left|x\\right|}{x}')));
	assert.ok(Number.isNaN(value('\\lim_{x\\to 0}\\sin\\frac{1}{x}')));
});

test('a limit at infinity', () => {
	close(value('\\lim_{x\\to+\\infty}\\frac{1}{x}'), 0);
	close(value('\\lim_{x\\to -\\infty}e^x'), 0);
	close(value('\\lim_{x\\to\\infty}\\frac{2x^2+1}{x^2-3}'), 2);
	close(value('\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n'), Math.E, 1e-5);
	assert.equal(value('\\lim_{x\\to\\infty}x^2'), Infinity);
	assert.equal(value('\\lim_{x\\to -\\infty}x^3'), -Infinity);
	assert.ok(Number.isNaN(value('\\lim_{x\\to\\infty}\\sin x')));
});

test('a limit can depend on the x of the plane and on a parameter', () => {
	// the derivative, from its definition
	const slope = read('\\lim_{h\\to 0}\\frac{\\left(x+h\\right)^2-x^2}{h}');
	assert.equal(slope.kind, 'function');
	assert.equal(slope.constant, undefined);
	close(slope.f({ x: 3 }), 6);
	close(value('\\lim_{x\\to a}\\frac{x^2-a^2}{x-a}', { a: 5 }), 10);
	assert.deepEqual(read('\\lim_{x\\to a}\\frac{x^2-a^2}{x-a}').params, ['a']);
	assert.equal(read('\\lim_{x\\to 2}').kind, 'error');
});

test('y′ = f(x; y) is a field of slopes', () => {
	for (const latex of ["y'=x-y", '\\frac{dy}{dx}=x-y']) {
		const field = read(latex);
		assert.equal(field.kind, 'field', latex);
		assert.equal(field.f({ x: 3, y: 1 }), 2);
	}
	assert.deepEqual(read("y'=ky").params, ['k']);
});

const { asymptotes } = await jiti.import('../../src/lib/grafico/notevoli.ts');
const { limit } = await jiti.import('../../src/lib/grafico/formula.ts');
const asy = (latex, x0 = -10, x1 = 10) => {
	const entry = read(latex);
	return asymptotes((x) => entry.f({ x }), x0, x1, limit);
};

test('the asymptotes of a function', () => {
	assert.deepEqual(asy('\\frac{1}{x-2}'), { vertical: [2], lines: [{ m: 0, q: 0, side: 0 }] });
	// an oblique one: (x² + 1)/(x − 1) comes close to y = x + 1
	assert.deepEqual(asy('\\frac{x^2+1}{x-1}'), { vertical: [1], lines: [{ m: 1, q: 1, side: 0 }] });
	assert.deepEqual(asy('\\frac{2x^2+1}{x^2-4}'), { vertical: [-2, 2], lines: [{ m: 0, q: 2, side: 0 }] });
	// at the end of the domain, and with no line far away
	assert.deepEqual(asy('\\ln x'), { vertical: [0], lines: [] });
	// one side only
	assert.deepEqual(asy('e^x'), { vertical: [], lines: [{ m: 0, q: 0, side: -1 }] });
	const turn = asy('\\arctan x');
	assert.equal(turn.vertical.length, 0);
	close(turn.lines[0].q, -Math.PI / 2, 1e-6);
	close(turn.lines[1].q, Math.PI / 2, 1e-6);
	// even poles, and many of them
	assert.deepEqual(asy('\\frac{1}{x^2}').vertical, [0]);
	const tan = asy('\\tan x', -5, 5).vertical;
	assert.equal(tan.length, 4);
	close(tan[2], Math.PI / 2, 1e-6);
	// none: a parabola, a wave, a hole that can be filled
	assert.deepEqual(asy('x^2'), { vertical: [], lines: [] });
	assert.deepEqual(asy('\\sin x'), { vertical: [], lines: [] });
	assert.deepEqual(asy('\\frac{x^2-1}{x-1}').vertical, []);
	assert.deepEqual(asy('\\sqrt{x}'), { vertical: [], lines: [] });
});

test('a recurrence in one step gives its rule as a function, for the cobweb', async () => {
	const { sequences } = await jiti.import('../../src/lib/grafico/formula.ts');
	const rows = ['a_{n+1}=\\frac{a_n}{2}+1', 'a_0=6'].map((l) => parse(cleanLatex(l)));
	const entry = readEntry(rows[0], {}, { sequences: sequences(rows) });
	assert.equal(entry.kind, 'sequence');
	assert.equal(entry.step({ x: 6 }), 4);
	assert.equal(entry.f({ n: 2 }), 3);
	// a rule with the index in it, or in two steps, has no curve of its own
	const withIndex = ['b_{n+1}=b_n+n', 'b_0=1'].map((l) => parse(cleanLatex(l)));
	assert.equal(readEntry(withIndex[0], {}, { sequences: sequences(withIndex) }).step, undefined);
	const fib = ['F_{n+2}=F_{n+1}+F_n', 'F_0=0', 'F_1=1'].map((l) => parse(cleanLatex(l)));
	assert.equal(readEntry(fib[0], {}, { sequences: sequences(fib) }).step, undefined);
});

const { construct, lineEquation, circleEquation, conicEquation, regression, fromImplicit } = await jiti.import('../../src/lib/grafico/geometria.ts');
const { makeWritten } = await jiti.import('../../src/lib/grafico/comandi.ts');
const P = (x, y) => ({ kind: 'point', x, y });
const plane = (objects) => {
	const get = (id) => (objects[id].type ? construct(objects[id], get) : objects[id]);
	return get;
};

test('the image of a point, a line and a circle under a transformation', () => {
	const circle = fromImplicit((x, y) => (x - 2) ** 2 + (y - 1) ** 2 - 4);
	const get = plane([
		P(3, 1), // 0
		P(0, 0), // 1
		{ type: 'line', of: [1, 2] }, // 2 is defined below: y = x
		P(2, 2),
		{ type: 'reflect', of: [0, 4] }, // 4: about the line 5
		{ type: 'line', of: [1, 3] }, // 5: y = x
		{ type: 'reflect', of: [0, 5] }, // 6
		{ type: 'reflect', of: [0, 3] }, // 7: about the point (2; 2)
		{ type: 'translate', of: [0, 1, 3] }, // 8: by (2; 2)
		{ type: 'rotate', of: [0, 1], at: 90 }, // 9
		{ type: 'dilate', of: [0, 3], at: 3 }, // 10
		circle, // 11
		{ type: 'reflect', of: [11, 5] }, // 12
		{ type: 'dilate', of: [11, 1], at: 2 }, // 13
		{ type: 'segment', of: [0, 3] }, // 14
		{ type: 'rotate', of: [14, 1], at: 180 }, // 15
		{ type: 'translate', of: [5, 1, 0] }, // 16: y = x moved by (3; 1)
		{ type: 'vector', of: [1, 3] }, // 17
		{ type: 'translate', of: [0, 17] } // 18
	]);
	const at = (id, x, y) => {
		const g = get(id);
		assert.equal(g.kind, 'point', `${id}: ${g.why}`);
		close(g.x, x, 1e-9);
		close(g.y, y, 1e-9);
	};
	at(6, 1, 3);
	at(7, 1, 3);
	at(8, 5, 3);
	at(9, -1, 3);
	at(10, 5, -1);
	at(18, 5, 3);
	close(get(12).circle.c.x, 1);
	close(get(12).circle.c.y, 2);
	close(get(12).circle.r, 2);
	// the dust of the square roots does not reach the equation
	assert.equal(circleEquation(get(12).circle), 'x^2+y^2-2x-4y+1=0');
	close(get(13).circle.r, 4);
	assert.equal(circleEquation(get(13).circle), 'x^2+y^2-8x-4y+4=0');
	const turned = get(15);
	assert.equal(turned.segment, true);
	close(turned.p.x, -3);
	close(turned.p.y, -1);
	assert.equal(lineEquation(get(16)), 'y=x-2');
	// a parabola is a conic too, and its image has an equation
	const parabola = fromImplicit((x, y) => y - x * x);
	const up = construct({ type: 'translate', of: [0, 1, 2] }, (id) => [parabola, P(0, 0), P(1, 2)][id]);
	assert.equal(conicEquation(up.q), 'x^2-2x-y+3=0');
	// a size has no image
	assert.equal(construct({ type: 'rotate', of: [0, 1], at: 90 }, (id) => [{ kind: 'measure', value: 1, from: P(0, 0), to: P(1, 0) }, P(0, 0)][id]).kind, 'none');
});

test('the line of least squares, and how well it fits', () => {
	const fit = regression([P(1, 2), P(2, 4.1), P(3, 5.9), P(4, 8.2)]);
	close(fit.m, 2.04, 1e-9);
	close(fit.q, -0.05, 1e-9);
	assert.ok(fit.r > 0.998 && fit.r < 1);
	const line = construct({ type: 'regression', of: [0, 1, 2] }, (id) => [P(0, 1), P(1, 3), P(2, 5)][id]);
	assert.equal(lineEquation(line), 'y=2x+1');
	close(line.fit, 1);
	assert.equal(construct({ type: 'regression', of: [0, 1] }, (id) => [P(1, 0), P(1, 3)][id]).kind, 'none');
});

test('the transformations written as commands', () => {
	const rows = [P(3, 1), P(0, 0), P(2, 2), { type: 'line', of: [1, 2] }, fromImplicit((x, y) => x * x + y * y - 1)];
	const get = (id) => (rows[id].type ? construct(rows[id], get) : rows[id]);
	const arg = (id) => ({ id, name: 'ABCDEFG'[id] });
	const make = (word, ...args) => makeWritten(word, args.map((a) => (typeof a === 'number' ? arg(a) : a)), get);
	assert.deepEqual(make('simmetria', 0, 3), [{ build: { type: 'reflect', of: [0, 3] }, name: 'point', label: true }]);
	assert.deepEqual(make('simmetria', 4, 2)[0], { build: { type: 'reflect', of: [4, 2] }, name: 'circle', label: true });
	assert.deepEqual(make('traslazione', 3, 1, 2)[0], { build: { type: 'translate', of: [3, 1, 2] }, name: 'line', label: true });
	assert.deepEqual(make('rotazione', 0, 1, { value: 90 })[0].build, { type: 'rotate', of: [0, 1], at: 90 });
	assert.deepEqual(make('omotetia', 0, 1, { value: -0.5 })[0].build, { type: 'dilate', of: [0, 1], at: -0.5 });
	assert.match(make('omotetia', 0, 1, { value: 0 }), /non è zero/);
	assert.match(make('rotazione', 0, 1), /^Scrivi/);
	assert.deepEqual(make('regressione', 0, 1, 2)[0], { build: { type: 'regression', of: [0, 1, 2] }, name: 'line', label: true });
	assert.match(make('regressione', 0, 3), /^Scrivi/);
});

test('the functions of statistics', () => {
	close(value('\\operatorname{media}\\left(2;4;9\\right)'), 5);
	close(value('\\operatorname{mediana}\\left(9;2;4\\right)'), 4);
	close(value('\\operatorname{mediana}\\left(9;2;4;6\\right)'), 5);
	close(value('\\operatorname{varianza}\\left(2;4;4;4;5;5;7;9\\right)'), 4);
	close(value('\\operatorname{devstandard}\\left(2;4;4;4;5;5;7;9\\right)'), 2);
	// the bell: its height at the mean, and the area under it
	const bell = read('\\operatorname{normale}\\left(x;1;2\\right)');
	close(bell.f({ x: 1 }), 1 / (2 * Math.sqrt(2 * Math.PI)));
	close(bell.d({ x: 1 }), 0);
	close(value('\\int_{-20}^{20}\\operatorname{normale}\\left(t;1;2\\right)\\,dt'), 1, 1e-4);
	close(value('\\operatorname{distbinomiale}\\left(2;4;0{,}5\\right)'), 0.375);
	close(value('\\sum_{k=0}^{10}\\operatorname{distbinomiale}\\left(k;10;0{,}3\\right)'), 1);
	assert.equal(read('\\operatorname{normale}\\left(x;1\\right)').kind, 'error');
});

test('a number by chance: between two numbers, or one of those given', async () => {
	const { reseed } = await jiti.import('../../src/lib/grafico/formula.ts');
	const draw = (latex, scope = {}) => read(latex).f({ x: 0, ...scope });
	const many = (latex) => Array.from({ length: 400 }, (_, n) => draw(latex, { n }));
	// the same call at the same place is the same number: a graph does not change while it is looked at
	assert.equal(draw('\\operatorname{casuale}\\left(\\right)', { n: 3 }), draw('\\operatorname{casuale}\\left(\\right)', { n: 3 }));
	assert.equal(read('\\operatorname{casuale}\\left(\\right)').constant, true);
	const unit = many('\\operatorname{casuale}\\left(\\right)');
	assert.ok(unit.every((v) => v >= 0 && v < 1));
	assert.ok(new Set(unit).size > 390);
	const mean = unit.reduce((s, v) => s + v, 0) / unit.length;
	assert.ok(mean > 0.42 && mean < 0.58, `mean ${mean}`);
	assert.ok(many('\\operatorname{casuale}\\left(5\\right)').every((v) => v >= 0 && v < 5));
	const between = many('\\operatorname{casuale}\\left(2;3\\right)');
	assert.ok(between.every((v) => v >= 2 && v < 3));
	// three or more, or a set in braces: one of them, each about as often
	for (const latex of ['\\operatorname{casuale}\\left(1;5;9\\right)', '\\operatorname{casuale}\\left(\\left\\lbrace 1;5;9\\right\\rbrace\\right)', '\\operatorname{random}\\left(1,5,9\\right)']) {
		const picks = many(latex);
		assert.deepEqual([...new Set(picks)].sort(), [1, 5, 9], latex);
		for (const v of [1, 5, 9]) assert.ok(picks.filter((p) => p === v).length > 90, `${latex}: ${v}`);
	}
	assert.deepEqual([...new Set(many('\\operatorname{casuale}\\left(\\left\\lbrace 4;7\\right\\rbrace\\right)'))].sort(), [4, 7]);
	// a parameter in it is a parameter of the row
	assert.deepEqual(read('\\operatorname{casuale}\\left(a\\right)').params, ['a']);
	// drawn again on request
	const before = unit.slice(0, 20);
	reseed();
	assert.notDeepEqual(many('\\operatorname{casuale}\\left(\\right)').slice(0, 20), before);
});

test('a sequence of points: the chaos game', async () => {
	const { sequences, pointNames } = await jiti.import('../../src/lib/grafico/formula.ts');
	const game = (rule) => {
		const rows = ['A=\\left(0;0\\right)', 'B=\\left(4;0\\right)', 'C=\\left(2;3\\right)', 'P_0=\\left(1;1\\right)', rule].map((l) => parse(cleanLatex(l)));
		const options = { sequences: sequences(rows), points: pointNames(rows) };
		return { rows, entry: readEntry(rows[4], {}, options), start: readEntry(rows[3], {}, options) };
	};
	const scope = { x: 0, y: 0, x_A: 0, y_A: 0, x_B: 4, y_B: 0, x_C: 2, y_C: 3 };
	for (const rule of ['P_{n+1}=\\operatorname{puntomedio}\\left(P_n;\\operatorname{casuale}\\left(A;B;C\\right)\\right)', 'P_{n+1}=\\frac{P_n+\\operatorname{casuale}\\left(A;B;C\\right)}{2}', 'P_{n+1}=\\operatorname{puntomedio}\\left(P_n;\\operatorname{casuale}\\left(\\left\\lbrace A;B;C\\right\\rbrace\\right)\\right)']) {
		const { entry, start } = game(rule);
		assert.equal(entry.kind, 'orbit', `${rule}: ${entry.message}`);
		assert.equal(start.kind, 'point');
		assert.equal(entry.from, 0);
		assert.deepEqual(entry.params.sort(), ['x_A', 'x_B', 'x_C', 'y_A', 'y_B', 'y_C']);
		assert.deepEqual([entry.x({ ...scope, n: 0 }), entry.y({ ...scope, n: 0 })], [1, 1]);
		// each term is half way from the one before to a vertex: the same vertex for the x and for the y
		const vertices = [[0, 0], [4, 0], [2, 3]];
		const seen = new Set();
		let [px, py] = [1, 1];
		for (let n = 1; n <= 300; n++) {
			const [x, y] = [entry.x({ ...scope, n }), entry.y({ ...scope, n })];
			const v = vertices.findIndex(([vx, vy]) => Math.abs(2 * x - px - vx) < 1e-9 && Math.abs(2 * y - py - vy) < 1e-9);
			assert.ok(v >= 0, `term ${n}: (${x}; ${y}) is not half way to a vertex`);
			seen.add(v);
			[px, py] = [x, y];
		}
		assert.equal(seen.size, 3);
	}
	// a rule with no chance in it: every point half way to A
	const { entry } = game('P_{n+1}=\\operatorname{puntomedio}\\left(P_n;A\\right)');
	assert.deepEqual([entry.x({ ...scope, n: 3 }), entry.y({ ...scope, n: 3 })], [0.125, 0.125]);
});
