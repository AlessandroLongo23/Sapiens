// The plotter: reading a formula, sampling its curve, finding its notable points.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { parse } from '@cortex-js/compute-engine/latex-syntax';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { cleanLatex, definitions, readEntry } = await jiti.import('../../src/lib/grafico/formula.ts');
const { sampleFunction, tickStep, ticks } = await jiti.import('../../src/lib/grafico/curva.ts');
const { extrema, notablePoints, zeros } = await jiti.import('../../src/lib/grafico/notevoli.ts');

const read = (latex) => readEntry(parse(cleanLatex(latex)));
const fn = (latex, scope = {}) => {
	const entry = read(latex);
	assert.equal(entry.kind, 'function', `${latex}: ${entry.message ?? entry.kind}`);
	return (x) => entry.f({ ...scope, x });
};
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
const VIEW = { x0: -10, x1: 10, y0: -7, y1: 7 };
const sample = (latex, view = VIEW) => sampleFunction(fn(latex), view, 800, 560);

test('a formula is read as a function of x', () => {
	close(fn('x^2-3x+2')(5), 12);
	close(fn('y=2x+1')(3), 7);
	close(fn('f(x)=x^3')(2), 8);
	close(fn('\\frac{x^2-1}{x-1}')(3), 4);
	close(fn('\\sin\\left(2x\\right)+\\ln x')(1), Math.sin(2));
	close(fn('3\\sin x\\cos x')(1), 3 * Math.sin(1) * Math.cos(1));
	close(fn('\\sin^2 x')(1), Math.sin(1) ** 2);
	close(fn('e^{-x^2}')(1), Math.exp(-1));
	close(fn('2^x')(3), 8);
	close(fn('\\left|x-1\\right|')(-2), 3);
	close(fn('x(x-1)')(3), 6);
	close(fn('\\pi x')(2), 2 * Math.PI);
	close(fn('\\log x')(1000), 3);
	close(fn('\\log_2 x')(8), 3);
	close(fn('\\log_3 x')(81), 4);
	close(fn('\\sqrt{x}')(9), 3);
	close(fn('\\arctan x')(1), Math.PI / 4);
});

test('the decimal comma of MathLive is a decimal point', () => {
	close(fn('2{,}5x')(2), 5);
	close(fn('0{,}1+x')(1), 1.1);
});

test('an odd root of a negative number is negative', () => {
	close(fn('\\sqrt[3]{x}')(-8), -2);
	assert.ok(Number.isNaN(fn('\\sqrt[4]{x}')(-16)));
});

test('the Italian names of the functions', () => {
	close(fn('\\operatorname{sen}\\left(x\\right)')(1), Math.sin(1));
	close(fn('\\tg x')(1), Math.tan(1));
	close(fn('\\operatorname{arctg}\\left(x\\right)')(1), Math.PI / 4);
});

test('the letters other than x are parameters', () => {
	const entry = read('ax^2+bx+c');
	assert.equal(entry.kind, 'function');
	assert.deepEqual(entry.params, ['a', 'b', 'c']);
	close(entry.f({ a: 1, b: -3, c: 2, x: 5 }), 12);
	assert.deepEqual(read('e^x+\\pi').params, []);
});

test('the kind of an entry', () => {
	assert.equal(read('x^2+y^2=4').kind, 'implicit');
	assert.equal(read('x=3').kind, 'implicit');
	close(read('x^2+y^2=4').f({ x: 2, y: 0 }), 0);
	const half = read('y>2x+1');
	assert.equal(half.kind, 'inequality');
	assert.equal(half.strict, true);
	assert.ok(half.f({ x: 0, y: 5 }) < 0);
	assert.equal(read('y\\le x').strict, false);
	const circle = read('\\left(\\cos t,\\sin t\\right)');
	assert.equal(circle.kind, 'parametric');
	close(circle.x({ t: 0 }), 1);
	close(circle.y({ t: Math.PI / 2 }), 1);
	assert.equal(read('').kind, 'empty');
});

test('what cannot be drawn says why', () => {
	for (const latex of ['x+', '\\frac{1}{}', 'x+y', '\\left(x,y,t\\right)', "f'(x)", "y'", 'x+\\infty', '\\sum_{x=1}^{3}x']) {
		const entry = read(latex);
		assert.equal(entry.kind, 'error', latex);
		assert.ok(entry.message.length > 10);
	}
});

test('a smooth curve is one line across the view', () => {
	for (const latex of ['x^2', '\\sin x', 'e^x', 'x^3-3x', '\\left|x\\right|']) {
		const paths = sample(latex);
		assert.equal(paths.length, 1, latex);
		close(paths[0][0].x, -10);
		close(paths[0].at(-1).x, 10);
	}
});

test('a very steep line is still one line', () => {
	assert.equal(sample('5000x').length, 1);
	assert.equal(sample('x^{15}').length, 1);
});

test('an asymptote breaks the line', () => {
	assert.equal(sample('\\frac{1}{x}').length, 2);
	// tan x has poles at ±π/2, ±3π/2, ±5π/2 in (−10, 10): seven branches
	assert.equal(sample('\\tan x').length, 7);
	assert.equal(sample('\\frac{1}{x^2-1}').length, 3);
	// no segment joins the two sides of the pole
	for (const path of sample('\\frac{1}{x}')) for (let i = 1; i < path.length; i++) assert.ok(path[i - 1].x < 0 === path[i].x < 0 || path[i - 1].x === 0);
});

test('a jump breaks the line', () => {
	assert.equal(sample('\\lfloor x\\rfloor', { x0: -2.5, x1: 2.5, y0: -4, y1: 4 }).length, 6);
	assert.equal(sample('\\frac{\\left|x\\right|}{x}').length, 2);
});

test('the curve reaches the edge of its domain', () => {
	const root = sample('\\sqrt{x}');
	assert.equal(root.length, 1);
	close(root[0][0].x, 0, 1e-9);
	close(root[0][0].y, 0, 1e-4);
	const log = sample('\\ln x');
	assert.equal(log.length, 1);
	assert.ok(log[0][0].x > 0 && log[0][0].x < 1e-9);
	assert.ok(log[0][0].y < VIEW.y0, 'ln x leaves the view downwards');
	const arc = sample('\\sqrt{4-x^2}');
	assert.equal(arc.length, 1);
	close(arc[0][0].x, -2, 1e-9);
	close(arc[0].at(-1).x, 2, 1e-9);
});

test('a removable hole does not open the line by more than a hair', () => {
	const paths = sample('\\frac{x^2-1}{x-1}');
	const gap = paths.length === 1 ? 0 : paths[1][0].x - paths[0].at(-1).x;
	assert.ok(gap < 1e-6);
});

test('a thin piece of domain between two samples is found', () => {
	// defined only on [0.005, 0.02], between the samples at −0.0015 and 0.0235
	const paths = sampleFunction((x) => Math.sqrt(x - 0.005) + Math.sqrt(0.02 - x), { x0: -10.003, x1: 10, y0: -1, y1: 1 }, 800, 400);
	assert.equal(paths.length, 1);
});

test('the line follows the curve within a third of a pixel', () => {
	const view = { x0: -10, x1: 10, y0: -7, y1: 7 };
	for (const latex of ['\\sin\\left(5x\\right)', 'x^3-3x', '\\frac{1}{x}', 'e^x']) {
		const f = fn(latex);
		for (const path of sampleFunction(f, view, 800, 560))
			for (let i = 1; i < path.length; i++) {
				const [p, q] = [path[i - 1], path[i]];
				if (p.y > view.y1 || p.y < view.y0 || q.y > view.y1 || q.y < view.y0) continue;
				const mid = f((p.x + q.x) / 2);
				assert.ok(Math.abs(mid - (p.y + q.y) / 2) * 40 <= 0.31, `${latex} at x = ${(p.x + q.x) / 2}`);
			}
	}
});

test('the points stay in a bounded band around the view', () => {
	for (const path of sample('\\tan x')) for (const p of path) assert.ok(Math.abs(p.y) <= 7 + 3 * 14 + 1e-9);
});

test('the marks of an axis are 1, 2 or 5 times a power of ten', () => {
	assert.equal(tickStep(20 / 800), 2);
	assert.equal(tickStep(1 / 80), 1);
	assert.equal(tickStep(0.0004), 0.02);
	assert.equal(tickStep(0.0006), 0.05);
	assert.deepEqual(ticks(-0.25, 0.35, 0.1), [-0.2, -0.1, 0, 0.1, 0.2, 0.3]);
	assert.deepEqual(ticks(-4, 4, 2), [-4, -2, 0, 2, 4]);
});

test('zeros: crossings, touches, and not the poles', () => {
	assert.deepEqual(zeros(fn('x^2-3x+2'), -10, 10), [1, 2]);
	assert.deepEqual(zeros(fn('x^2'), -10, 10), [0]);
	assert.deepEqual(zeros(fn('\\left(x-1{,}5\\right)^2'), -10, 10), [1.5]);
	assert.deepEqual(zeros(fn('\\frac{1}{x}'), -10, 10), []);
	assert.deepEqual(zeros(fn('x^2+1'), -10, 10), []);
	const tan = zeros(fn('\\tan x'), -4, 4);
	assert.equal(tan.length, 3);
	close(tan[2], Math.PI, 1e-8);
	const sqrt2 = zeros(fn('x^2-2'), 0, 10);
	close(sqrt2[0], Math.SQRT2, 1e-7);
});

test('maxima and minima, away from the edges of the domain', () => {
	const cubic = extrema(fn('x^3-3x'), -10, 10);
	assert.deepEqual(cubic, [
		{ x: -1, kind: 'max' },
		{ x: 1, kind: 'min' }
	]);
	assert.deepEqual(extrema(fn('x^2-4x+1'), -10, 10), [{ x: 2, kind: 'min' }]);
	assert.deepEqual(extrema(fn('2x+1'), -10, 10), []);
	assert.deepEqual(extrema(fn('3'), -10, 10), []);
	assert.deepEqual(extrema(fn('\\sqrt{x}'), -10, 10), []);
	assert.deepEqual(extrema(fn('\\frac{1}{x}'), -10, 10), []);
	assert.deepEqual(extrema(fn('\\left|x\\right|'), -10, 10), [{ x: 0, kind: 'min' }]);
});

test('the notable points of two curves', () => {
	const [line, parabola] = notablePoints([fn('x+2'), fn('x^2')], VIEW);
	assert.deepEqual(line, [
		{ x: -2, y: 0, kind: 'zero' },
		{ x: 0, y: 2, kind: 'intercept' }
	]);
	assert.deepEqual(parabola, [
		{ x: 0, y: 0, kind: 'zero' },
		{ x: -1, y: 1, kind: 'meet' },
		{ x: 2, y: 4, kind: 'meet' }
	]);
});

test('a curve that oscillates across the view shows no crowd of points', () => {
	const [points] = notablePoints([fn('\\sin\\left(50x\\right)')], VIEW);
	assert.deepEqual(points, []);
});

/** The rows of a plotter read together, so that a named function is known to the others. */
function rows(...latex) {
	const jsons = latex.map((l) => parse(cleanLatex(l)));
	const defs = definitions(jsons);
	return jsons.map((j) => {
		const entry = readEntry(j, defs);
		return entry.kind === 'function' ? (x, scope = {}) => entry.f({ ...scope, x }) : entry;
	});
}

test('a sum over an index', () => {
	close(fn('\\sum_{n=1}^{5}\\frac{x^n}{n}')(1), 1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5);
	close(fn('\\sum_{k=1}^{3}\\sin\\left(kx\\right)')(1), Math.sin(1) + Math.sin(2) + Math.sin(3));
	close(fn('\\sum_{n=0}^{4}\\frac{x^n}{n!}')(1), 1 + 1 + 1 / 2 + 1 / 6 + 1 / 24);
	close(fn('\\prod_{n=1}^{3}\\left(x-n\\right)')(5), 24);
	// the index is not a parameter, the upper end can be one
	const series = read('\\sum_{n=1}^{a}\\frac{1}{n}x^n');
	assert.deepEqual(series.params, ['a']);
	close(series.f({ a: 3, x: 2 }), 2 + 2 + 8 / 3);
	close(series.f({ a: 3.7, x: 2 }), 2 + 2 + 8 / 3);
	// a term that is not a number makes the whole sum one: 1/0 at n = 0
	assert.ok(!Number.isFinite(read('\\sum_{n=0}^{a}\\frac{1}{n}x^n').f({ a: 3, x: 2 })));
});

test('a named function is known to the other rows', () => {
	const [f, g, h] = rows('f(x)=x^2', 'g\\left(x\\right)=f\\left(x\\right)+1', 'f\\left(2x\\right)^2-xf(x)');
	close(f(3), 9);
	close(g(3), 10);
	close(h(1), 16 - 1);
	const [, nested] = rows('f(x)=x+1', 'f\\left(f\\left(x\\right)\\right)');
	close(nested(1), 3);
	const [withParam] = rows('f(x)=ax', 'f(x)+1');
	close(withParam(2, { a: 5 }), 10);
});

test('a function that uses itself is refused', () => {
	const [loop] = rows('f(x)=f(x)+1');
	assert.equal(loop.kind, 'error');
	const [a, b] = rows('f(x)=g(x)', 'g(x)=f(x)');
	assert.equal(a.kind, 'error');
	assert.equal(b.kind, 'error');
	const [, bare] = rows('f(x)=x', 'f+1');
	assert.equal(bare.kind, 'error');
});

test('the derivative of a named function', () => {
	const [, d1, d2, d3, alone, scaled] = rows('f(x)=x^3-3x', "f'(x)", "f''(x)", "f'''(x)", "f'", "f'\\left(2x\\right)+1");
	close(d1(2), 9);
	close(d2(2), 12);
	close(d3(2), 6);
	close(alone(2), 9);
	close(scaled(1), 10);
	const [, line] = rows('f\\left(x\\right)=x', 'f^{\\prime}');
	close(line(7), 1);
});

test('the rules of derivation agree with the slope', () => {
	const formulas = ['x^3-3x', '\\frac{x^2-1}{x+3}', '\\sin\\left(2x\\right)\\cos x', 'e^{-x^2}', '\\ln\\left(x^2+1\\right)', '\\sqrt{x^2+1}', '\\sqrt[3]{x}', 'x^x', '2^x', '\\tan x', '\\arctan\\left(3x\\right)',
		'\\left|x-2\\right|', '\\log x', '\\log_2 x', '\\arcsin\\left(\\frac{x}{3}\\right)', '\\sum_{n=1}^{4}\\frac{x^n}{n}', '\\prod_{n=2}^{4}\\left(x+n\\right)', 'x\\sin x\\ln x', '\\frac{1}{x}'];
	for (const latex of formulas) {
		const [f, df] = rows(`f(x)=${latex}`, "f'(x)");
		for (const x of [0.4, 0.9, 1.3]) {
			const h = 1e-5;
			const slope = (f(x + h) - f(x - h)) / (2 * h);
			close(df(x), slope, 1e-6 * Math.max(1, Math.abs(slope)));
		}
	}
	// the rule of powers holds left of zero, where the logarithm does not exist
	const [, cube] = rows('f(x)=x^3', "f'(x)");
	close(cube(-2), 12);
	const [, cbrt] = rows('f(x)=\\sqrt[3]{x}', "f'(x)");
	close(cbrt(-8), 1 / 12);
});

test('d/dx of an expression', () => {
	close(fn('\\frac{d}{dx}x^2')(3), 6);
	close(fn('\\frac{d}{dx}\\left(\\sin x\\right)')(0), 1);
});

test('a sum to infinity stops at 2000 terms, or when it has settled', () => {
	const geometric = read('\\sum_{n=0}^{\\infty}x^n');
	assert.equal(geometric.kind, 'function');
	assert.match(geometric.note, /2000 termini/);
	close(geometric.f({ x: 0.5 }), 2, 1e-12);
	close(geometric.f({ x: -0.5 }), 2 / 3, 1e-12);
	// outside the radius of convergence the partial sum leaves the numbers, and nothing is drawn
	assert.ok(!Number.isFinite(geometric.f({ x: 3 })));
	close(fn('\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}')(1), Math.E, 1e-12);
	// a slow series is the sum of its first 2000 terms
	let basel = 0;
	for (let n = 1; n <= 2000; n++) basel += 1 / (n * n);
	close(fn('\\sum_{n=1}^{\\infty}\\frac{1}{n^2}+0x')(0), basel, 1e-12);
	close(fn('\\prod_{n=1}^{\\infty}\\left(1+\\frac{x}{n^2}\\right)')(0), 1);
	assert.equal(read('\\sum_{n=1}^{5}x^n').note, undefined);
	// the derivative of a series is the series of the derivatives
	const [, d] = rows('f(x)=\\sum_{n=0}^{\\infty}x^n', "f'(x)");
	close(d(0.5), 4, 1e-9);
});

test('a function can be named in any letter', () => {
	const [f, g, d] = rows('f(t)=t+2', 'g\\left(u\\right)=f\\left(u\\right)^2', "f'(x)");
	close(f(3), 5);
	close(g(1), 9);
	close(d(10), 1);
	const [withParam] = rows('f(t)=at^2');
	close(withParam(3, { a: 2 }), 18);
	// the letter of the function is its only variable
	const [two] = rows('f(t)=t+x');
	assert.equal(two.kind, 'error');
	assert.match(two.message, /funzione di t/);
	// f(f) and f(e) are not definitions
	assert.equal(typeof rows('p(z)=z^2')[0], 'function');
});

test('the first free name for a function', async () => {
	const { freeName, isUnnamedFunction } = await jiti.import('../../src/lib/grafico/formula.ts');
	const json = (...latex) => latex.map((l) => parse(cleanLatex(l)));
	assert.equal(freeName(json('x^2')), 'f');
	assert.equal(freeName(json('f(x)=x^2', 'x+1')), 'g');
	assert.equal(freeName(json('f(x)=x^2', 'g(t)=t', 'hx')), 'p');
	// a letter used as a parameter is taken
	assert.equal(freeName(json('fx+g')), 'h');
	assert.ok(isUnnamedFunction(json('x^2-1')[0]));
	assert.ok(isUnnamedFunction(json('\\sin x+a')[0]));
	for (const latex of ['f(x)=x', 'y=x', 'x^2+y^2=4', 'y>x', 'x+', "f'", '\\left(\\cos t,\\sin t\\right)', '']) assert.ok(!isUnnamedFunction(json(latex)[0]), latex);
});

test('angles in degrees', () => {
	const deg = (latex, defs = {}) => {
		const entry = readEntry(parse(cleanLatex(latex)), defs, { degrees: true });
		return (x) => entry.f({ x });
	};
	close(deg('\\sin x')(90), 1);
	close(deg('\\cos\\left(2x\\right)')(90), -1);
	close(deg('\\operatorname{sen}\\left(x\\right)')(30), 0.5);
	close(deg('\\arcsin x')(1), 90);
	close(deg('\\arctan x')(1), 45);
	// the derivative is per degree
	const jsons = ['f(x)=\\sin x', "f'(x)"].map((l) => parse(cleanLatex(l)));
	const d = readEntry(jsons[1], definitions(jsons), { degrees: true });
	close(d.f({ x: 0 }), Math.PI / 180);
	// logarithms and powers do not change
	close(deg('\\ln x+x^2')(1), 1);
});

test('a named function carries its letter', () => {
	assert.equal(read('g(t)=t^2').name, 'g');
	assert.equal(read('y=x^2').name, undefined);
	assert.equal(read('x^2').name, undefined);
});

const { axisMarks, italian } = await jiti.import('../../src/lib/grafico/assi.ts');
const { EXAMPLES, HOME, decodeState, encodeState, newRow, nextColor, stateOf, PALETTE } = await jiti.import('../../src/lib/grafico/documento.ts');

test('the marks of an axis of numbers', () => {
	const m = axisMarks('numbers', -4.2, 4.2, 20 / 800);
	assert.deepEqual(m.major, [-4, -2, 0, 2, 4]);
	assert.equal(m.minor.length, 17);
	assert.equal(m.label(-2), '−2');
	assert.equal(axisMarks('numbers', 0, 1, 0.005).label(0.5), '0,5');
	assert.equal(italian(-0.0001, 2), '0');
});

test('the marks of an axis in fractions of π', () => {
	const half = axisMarks('pi', -7, 7, 14 / 800);
	assert.deepEqual(half.major.map(half.label), ['−2π', '−3π/2', '−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π']);
	const whole = axisMarks('pi', -20, 20, 40 / 800);
	assert.deepEqual(whole.major.map(whole.label), ['−6π', '−4π', '−2π', '0', '2π', '4π', '6π']);
	const sixth = axisMarks('pi', 0, 1.2, 1.2 / 800);
	assert.deepEqual(sixth.major.map(sixth.label), ['0', 'π/12', 'π/6', 'π/4', 'π/3']);
	// far out or far in, plain multiples of π
	const far = axisMarks('pi', 0, 400, 400 / 800);
	assert.equal(far.label(far.major[1]), '10π');
	const near = axisMarks('pi', 0, 0.02, 0.02 / 800);
	assert.match(near.label(near.major[1]), /^0,\d+π$/);
});

test('the marks of an axis in degrees', () => {
	const m = axisMarks('degrees', -360, 360, 720 / 800);
	assert.deepEqual(m.major.map(m.label), ['−360°', '−270°', '−180°', '−90°', '0°', '90°', '180°', '270°', '360°']);
	assert.deepEqual(axisMarks('degrees', 0, 90, 90 / 800).major, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
});

test('a new row takes the first colour no row has', () => {
	const state = stateOf(['x', 'x^2', 'x^3']);
	assert.deepEqual(state.rows.map((r) => r.color), PALETTE.slice(0, 3));
	assert.deepEqual(state.rows.map((r) => r.id), [0, 1, 2]);
	assert.equal(nextColor(state.rows.filter((r) => r.id !== 1)), PALETTE[1]);
	const full = stateOf(PALETTE.map(() => 'x')).rows;
	assert.equal(nextColor(full), PALETTE[0]);
	assert.equal(newRow(full).id, PALETTE.length);
});

test('a graph survives the trip through a link', () => {
	for (const { state } of EXAMPLES) {
		const back = decodeState(encodeState(state));
		assert.deepEqual(back.rows, state.rows);
		assert.deepEqual(back.sliders, state.sliders);
		assert.deepEqual(back.settings, state.settings);
		for (const key of ['cx', 'cy', 'span', 'stretch']) close(back.camera[key], state.camera[key], 1e-6);
	}
	const styled = stateOf(['f(x)=\\frac{1}{x}']);
	styled.rows[0] = { ...styled.rows[0], color: PALETTE[4], width: 'thick', dash: 'dotted', label: true, hidden: true };
	assert.deepEqual(decodeState(encodeState(styled)).rows, styled.rows);
	assert.match(encodeState(styled), /^[A-Za-z0-9_-]+$/);
});

test('a broken link is no graph', () => {
	for (const code of ['', 'x', '!!!', 'eyJ2IjoyfQ', btoa(JSON.stringify({ v: 1, r: [[1, 2]] })), btoa(JSON.stringify({ v: 1 }))]) assert.equal(decodeState(code), null, code);
	// what a link cannot be trusted with is put right
	const odd = decodeState(btoa(JSON.stringify({ v: 1, r: [['x', 'red', 9, 9, 0, 0]], s: { a: [50, 0, 10, 1, 0, 0], '<b>': [1, 0, 2, 1, 0, 0], c: [1, 5, 2, 1, 0, 0] }, c: [0, 0, -1, 1] })));
	assert.equal(odd.rows[0].color, PALETTE[0]);
	assert.equal(odd.rows[0].width, 'normal');
	assert.deepEqual(Object.keys(odd.sliders), ['a']);
	assert.equal(odd.sliders.a.value, 10);
	assert.deepEqual(odd.camera, HOME);
});

test('the examples are graphs the plotter can draw', () => {
	for (const { title, state } of EXAMPLES) {
		const jsons = state.rows.map((r) => parse(cleanLatex(r.latex)));
		const defs = definitions(jsons);
		for (const j of jsons) {
			const entry = readEntry(j, defs, { degrees: state.settings.degrees });
			assert.ok(['function', 'implicit', 'parametric', 'polar', 'inequality', 'point'].includes(entry.kind), `${title}: ${entry.message ?? entry.kind}`);
			const scope = { x: 0.7, y: 0.3, t: 0.7, theta: 0.7 };
			for (const p of entry.params) {
				assert.ok(state.sliders[p], `${title}: no slider for ${p}`);
				scope[p] = state.sliders[p].value;
			}
			for (const f of entry.kind === 'parametric' || entry.kind === 'point' ? [entry.x, entry.y] : entry.kind === 'polar' ? [entry.r] : [entry.f]) assert.ok(Number.isFinite(f(scope)), title);
		}
	}
});

const { sampleImplicit, sampleParametric } = await jiti.import('../../src/lib/grafico/curva.ts');
const SQUARE = { x0: -10, x1: 10, y0: -7, y1: 7 };
const implicit = (latex, scope = {}) => {
	const entry = read(latex);
	assert.equal(entry.kind, 'implicit', latex);
	const s = { ...scope };
	return sampleImplicit((x, y) => ((s.x = x), (s.y = y), entry.f(s)), SQUARE, 800, 560);
};
const length = (path) => path.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - path[i].x, p.y - path[i].y), 0);

test('a circle is one closed line, on the circle', () => {
	const paths = implicit('x^2+y^2=4');
	assert.equal(paths.length, 1);
	const [circle] = paths;
	close(circle[0].x, circle.at(-1).x, 1e-9);
	close(circle[0].y, circle.at(-1).y, 1e-9);
	for (const p of circle) close(Math.hypot(p.x, p.y), 2, 1e-3);
	close(length(circle), 4 * Math.PI, 0.02);
});

test('the conics of the third year', () => {
	assert.equal(implicit('\\frac{x^2}{9}+\\frac{y^2}{4}=1').length, 1);
	// the two branches of a hyperbola, and no line between them
	const hyperbola = implicit('\\frac{x^2}{4}-\\frac{y^2}{9}=1');
	assert.equal(hyperbola.length, 2);
	for (const branch of hyperbola) assert.ok(branch.every((p) => p.x > 0) || branch.every((p) => p.x < 0));
	assert.equal(implicit('xy=1').length, 2);
	// a parabola with a horizontal axis, which no y = f(x) draws
	const sideways = implicit('y^2=x');
	assert.equal(sideways.length, 1);
	for (const p of sideways[0]) close(p.y * p.y, p.x, 1e-3);
});

test('a vertical line, and two lines that cross', () => {
	const [line] = implicit('x=3');
	for (const p of line) close(p.x, 3, 1e-9);
	close(length(line), 14, 0.2);
	const cross = implicit('x^2=y^2');
	close(cross.reduce((sum, path) => sum + length(path), 0), 2 * 14 * Math.SQRT2, 0.4);
});

test('the two sides of a pole are not a curve', () => {
	// y = 1/x written as an equation: the hyperbola, and nothing along x = 0
	const paths = implicit('y-\\frac{1}{x}=0');
	assert.equal(paths.length, 2);
	for (const path of paths) for (const p of path) assert.ok(Math.abs(p.x) > 0.1);
	assert.equal(implicit('y-\\tan x=0').length, 7);
});

test('an equation with a parameter', () => {
	assert.deepEqual(read('x^2+y^2=r^2').params, ['r']);
	const [circle] = implicit('x^2+y^2=r^2', { r: 3 });
	for (const p of circle) close(Math.hypot(p.x, p.y), 3, 1e-3);
	assert.equal(implicit('x^2+y^2=-1').length, 0);
});

const parametric = (latex, t0, t1, view = SQUARE) => {
	const entry = read(latex);
	assert.equal(entry.kind, 'parametric', `${latex}: ${entry.message}`);
	const s = {};
	return sampleParametric((t) => ((s.t = t), entry.x(s)), (t) => ((s.t = t), entry.y(s)), t0, t1, view, 800, 560);
};

test('a pair of coordinates in t, with a comma or a semicolon', () => {
	for (const latex of ['\\left(\\cos t,\\sin t\\right)', '\\left(\\cos t;\\sin t\\right)', '\\left(\\cos t{,}\\sin t\\right)', '\\left(2{,}5\\cos t;\\sin t\\right)']) assert.equal(read(latex).kind, 'parametric', latex);
	close(read('\\left(2{,}5\\cos t;\\sin t\\right)').x({ t: 0 }), 2.5);
	assert.equal(read('\\left(x;x^2\\right)').kind, 'error');
});

test('a parametric circle and a cycloid', () => {
	const [circle] = parametric('\\left(3\\cos t;3\\sin t\\right)', 0, 2 * Math.PI);
	for (const p of circle) close(Math.hypot(p.x, p.y), 3, 1e-9);
	close(length(circle), 6 * Math.PI, 0.01);
	close(circle[0].x, circle.at(-1).x, 1e-9);
	const [cycloid] = parametric('\\left(t-\\sin t;1-\\cos t\\right)', 0, 4 * Math.PI);
	close(cycloid.at(-1).x, 4 * Math.PI, 1e-9);
	// the arch of a cycloid is 8 times the radius long
	close(length(cycloid), 16, 0.01);
});

test('a parametric curve breaks where it has no value or runs away', () => {
	// (t, 1/t): the hyperbola, in two branches
	assert.equal(parametric('\\left(t;\\frac{1}{t}\\right)', -10, 10).length, 2);
	// (t, √t) starts at the origin
	const [root] = parametric('\\left(t;\\sqrt{t}\\right)', -5, 9);
	close(root[0].x, 0, 1e-9);
	close(root.at(-1).y, 3, 1e-9);
	for (const path of parametric('\\left(\\tan t;t\\right)', -6, 6)) for (const p of path) assert.ok(Math.abs(p.x) < 1e4);
});

test('the range of t travels with the link', () => {
	const cycloid = EXAMPLES.find((e) => e.title === 'Cicloide').state;
	close(cycloid.rows[0].t1, 4 * Math.PI);
	const back = decodeState(encodeState(cycloid));
	assert.equal(back.rows[0].t0, 0);
	close(back.rows[0].t1, 4 * Math.PI);
	assert.equal(decodeState(encodeState(stateOf(['x']))).rows[0].t0, undefined);
});

test('π in a box of numbers', async () => {
	const { readNumber, withPi } = await jiti.import('../../src/lib/grafico/assi.ts');
	assert.equal(withPi(2 * Math.PI), '2π');
	assert.equal(withPi(Math.PI / 2), 'π/2');
	assert.equal(withPi((-3 * Math.PI) / 4), '−3π/4');
	assert.equal(withPi(0), '0');
	assert.equal(withPi(2.5), '2,5');
	close(readNumber('2π'), 2 * Math.PI);
	close(readNumber('pi/2'), Math.PI / 2);
	close(readNumber('−3π/4'), (-3 * Math.PI) / 4);
	close(readNumber('1,5 π'), 1.5 * Math.PI);
	close(readNumber('-2,5'), -2.5);
	assert.ok(Number.isNaN(readNumber('')));
	assert.ok(Number.isNaN(readNumber('due')));
});

test('a curve in r and θ', () => {
	const spiral = read('r=a\\theta');
	assert.equal(spiral.kind, 'polar');
	assert.deepEqual(spiral.params, ['a']);
	close(spiral.r({ a: 2, theta: 3 }), 6);
	for (const latex of ['r=1+\\cos\\theta', 'r\\left(\\theta\\right)=2\\theta', '\\rho=\\theta', 'r=2', 'r=\\cos\\left(2\\vartheta\\right)']) assert.equal(read(latex).kind, 'polar', latex);
	// with x and y on the right, r is a parameter of an equation
	assert.equal(read('r=x^2+y^2').kind, 'implicit');
	assert.deepEqual(read('x^2+y^2=r^2').params, ['r']);
	// Greek letters are parameters like the others
	assert.deepEqual(read('A\\sin\\left(\\omega x+\\varphi\\right)').params, ['A', 'omega', 'phi']);
});

test('the polar grid travels with the link', () => {
	const spiral = EXAMPLES.find((e) => e.title === 'Spirale di Archimede').state;
	const back = decodeState(encodeState(spiral));
	assert.equal(back.settings.polar, true);
	close(back.rows[0].t1, 6 * Math.PI);
	assert.equal(decodeState(encodeState(stateOf(['x']))).settings.polar, false);
	const greek = stateOf(['\\sin\\left(\\omega x\\right)']);
	greek.sliders = { omega: { value: 2, min: 0, max: 5, step: 0.1, speed: 'normal', mode: 'bounce' } };
	assert.deepEqual(decodeState(encodeState(greek)).sliders, greek.sliders);
});

const { integral, mainRange, sampleRegion } = await jiti.import('../../src/lib/grafico/curva.ts');
const await_axis = await jiti.import('../../src/lib/grafico/documento.ts');

test('a function in pieces', () => {
	const abs = fn('\\begin{cases}x^2 & x\\ge0\\\\ -x & x<0\\end{cases}');
	close(abs(3), 9);
	close(abs(-3), 3);
	close(abs(0), 0);
	const withElse = fn('\\begin{cases}x^2 & \\text{se } x\\ge1\\\\ 1 & \\text{altrimenti}\\end{cases}');
	close(withElse(2), 4);
	close(withElse(-5), 1);
	// outside every piece the function has no value
	assert.ok(Number.isNaN(fn('\\begin{cases}x^2 & 0<x<2\\end{cases}')(3)));
	// the pieces can be named and derived
	const [f, d] = rows('f(x)=\\begin{cases}x^2 & x\\ge0\\\\ -x & x<0\\end{cases}', "f'(x)");
	close(f(-2), 2);
	close(d(3), 6);
	close(d(-3), -1);
});

test('a domain in braces', () => {
	const piece = fn('x^2\\left\\{x>0\\right\\}');
	close(piece(2), 4);
	assert.ok(Number.isNaN(piece(-2)));
	const between = fn('\\left(x+1\\right)\\left\\lbrace0<x<2\\right\\rbrace');
	close(between(1), 2);
	assert.ok(Number.isNaN(between(2)));
	assert.ok(Number.isNaN(between(0)));
	// drawn only where it has a value
	const paths = sampleFunction(between, VIEW, 800, 560);
	assert.equal(paths.length, 1);
	close(paths[0][0].x, 0, 1e-6);
	close(paths[0].at(-1).x, 2, 1e-6);
});

test('the slope of a function comes with it', () => {
	const cubic = read('x^3-3x');
	close(cubic.d({ x: 2 }), 9);
	const named = read('g(t)=\\sin t');
	close(named.d({ x: 0 }), 1);
	close(read('y=ax^2').d({ a: 3, x: 1 }), 6);
});

test('a region of the plane', () => {
	const disc = read('x^2+y^2<4');
	assert.equal(disc.kind, 'inequality');
	assert.equal(disc.strict, true);
	assert.ok(disc.f({ x: 0, y: 0 }) < 0);
	assert.ok(disc.f({ x: 3, y: 0 }) > 0);
	const above = read('y\\ge x^2');
	assert.equal(above.strict, false);
	assert.ok(above.f({ x: 0, y: 1 }) < 0);
	assert.ok(above.f({ x: 2, y: 1 }) > 0);
	// a chain is a strip, and two conditions together are their common part
	const strip = read('1\\le x\\le3');
	assert.ok(strip.f({ x: 2, y: 9 }) < 0 && strip.f({ x: 0, y: 0 }) > 0 && strip.f({ x: 4, y: 0 }) > 0);
	const quadrant = read('x>0\\land y>0');
	assert.equal(quadrant.kind, 'inequality');
	assert.ok(quadrant.f({ x: 1, y: 1 }) < 0 && quadrant.f({ x: 1, y: -1 }) > 0);
	assert.deepEqual(read('y<ax+b').params, ['a', 'b']);
});

test('the strips of a region cover it', () => {
	const disc = read('x^2+y^2<4');
	const s = {};
	const strips = sampleRegion((x, y) => ((s.x = x), (s.y = y), disc.f(s)), SQUARE, 800, 560);
	const area = strips.reduce((sum, [x0, x1, y0, y1]) => sum + (x1 - x0) * (y1 - y0), 0);
	close(area, 4 * Math.PI, 0.02);
	for (const [x0, x1] of strips) assert.ok(x0 >= -2.001 && x1 <= 2.001);
	// a half plane reaches the edge of the window
	const half = read('y>x');
	const halfStrips = sampleRegion((x, y) => ((s.x = x), (s.y = y), half.f(s)), SQUARE, 800, 560);
	close(halfStrips.reduce((sum, [x0, x1, y0, y1]) => sum + (x1 - x0) * (y1 - y0), 0), (20 * 14) / 2, 0.05);
});

test('a point, with a name or without', () => {
	const p = read('\\left(2;3\\right)');
	assert.equal(p.kind, 'point');
	assert.equal(p.free, true);
	close(p.x({}), 2);
	close(p.y({}), 3);
	const a = read('A=\\left(-1{,}5;2\\right)');
	assert.equal(a.kind, 'point');
	assert.equal(a.name, 'A');
	assert.equal(a.free, true);
	close(a.x({}), -1.5);
	// a point that follows a parameter is not dragged
	const moving = read('P=\\left(a;a^2\\right)');
	assert.equal(moving.free, false);
	assert.deepEqual(moving.params, ['a']);
	close(moving.y({ a: 3 }), 9);
	assert.equal(read('\\left(\\cos t;\\sin t\\right)').kind, 'parametric');
	assert.equal(read('A=\\left(\\cos t;\\sin t\\right)').kind, 'error');
});

test('the area under a curve and the range that matters', () => {
	close(integral((x) => x * x, 0, 3), 9, 1e-9);
	close(integral(Math.sin, 0, Math.PI), 2, 1e-9);
	close(integral((x) => x, 2, 0), -2, 1e-9);
	assert.ok(Number.isNaN(integral(Math.sqrt, -1, 1)));
	const values = Array.from({ length: 401 }, (_, i) => 1 / (i / 20 - 10));
	const [lo, hi] = mainRange(values);
	assert.ok(lo > -3 && hi < 3, `${lo} ${hi}`);
	assert.equal(mainRange([NaN, Infinity]), null);
});

test('the tools of a row and the names of the axes travel with the link', () => {
	const state = stateOf(['f(x)=x^2']);
	state.rows[0] = { ...state.rows[0], tangent: 1.5, area: [-1, 2], table: { from: -2, step: 0.5 } };
	state.settings = { ...state.settings, xName: 't', yName: 's (m)' };
	const back = decodeState(encodeState(state));
	assert.deepEqual(back.rows[0], state.rows[0]);
	assert.equal(back.settings.xName, 't');
	assert.equal(back.settings.yName, 's (m)');
	// a name that could be markup is not taken
	const { axisName } = await_axis;
	assert.equal(axisName('<b>', 'x'), 'x');
	assert.equal(axisName('  v  ', 'y'), 'v');
	assert.equal(axisName('', 'y'), 'y');
});
