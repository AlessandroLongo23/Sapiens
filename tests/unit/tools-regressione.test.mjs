// Retta di regressione e correlazione: the calculator's pure logic.
// Run with `node --test tests/unit/tools-regressione.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { regressione } = await jiti.import('../../src/lib/tools/regressione.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));
const LINE = 'Retta di regressione';
const R = 'Coefficiente di correlazione di Pearson';

test('hours of study and grades', () => {
	const { outcome: o, plot } = regressione('1 2 3 4 5', '5 5,5 6,5 7 8,5');
	assert.equal(o.ok, true);
	assert.equal(rows(o)[LINE], '$y = 0{,}85x + 3{,}95$');
	assert.equal(rows(o)[R], '$\\approx 0{,}9815$: correlazione forte e positiva');
	assert.equal(o.copy, 'y = 0,85x + 3,95; r = 0,9815');
	const table = o.steps[0].table;
	assert.deepEqual(table.head, ['', '$x$', '$y$', '$x^2$', '$y^2$', '$x \\cdot y$']);
	assert.deepEqual(table.rows.at(-1), ['somma', '$\\hl{15}$', '$\\hl{32{,}5}$', '$\\hl{55}$', '$\\hl{218{,}75}$', '$\\hl{106}$']);
	assert.deepEqual(o.steps[2].math.slice(1), ['= \\dfrac{5 \\cdot 106 - 15 \\cdot 32{,}5}{5 \\cdot 55 - 15^2}', '= \\dfrac{42{,}5}{50}', '= \\hl{0{,}85}']);
	assert.deepEqual(plot.points[1], [2, 5.5]);
	assert.equal(plot.m, 0.85);
});

test('fractions, negative and perfect correlations', () => {
	const f = regressione('1 2 4', '3 1 2').outcome;
	assert.equal(rows(f)[LINE], '$y = -\\dfrac{3}{14}x + 2{,}5$, cioè $y \\approx -0{,}2143x + 2{,}5$');
	assert.equal(rows(f)[R], '$\\approx -0{,}3273$: correlazione moderata e negativa');
	assert.equal(f.steps[1].math[0], '\\bar{x} = \\dfrac{7}{3} \\approx 2{,}3333');
	const perfect = regressione('1 2 3', '2 4 6').outcome;
	assert.equal(rows(perfect)[LINE], '$y = 2x$');
	assert.equal(rows(perfect)[R], '$1$: correlazione perfetta e positiva, con i punti tutti sulla retta');
	assert.equal(rows(regressione('1 2 3', '3 2 1').outcome)[LINE], '$y = -x + 4$');
	assert.equal(rows(regressione('1 2 3', '3 2 1').outcome)[R], '$-1$: correlazione perfetta e negativa, con i punti tutti sulla retta');
	// Two points: the line passes through both.
	assert.equal(rows(regressione('0 2', '1 5').outcome)[LINE], '$y = 2x + 1$');
	// No linear correlation.
	assert.equal(rows(regressione('-1 0 1', '1 0 1').outcome)[R], '$0$: nessuna correlazione lineare');
	// Equal y: a horizontal line, r not computed.
	const flat = regressione('1 2 3', '5 5 5').outcome;
	assert.equal(rows(flat)[LINE], '$y = 5$');
	assert.match(rows(flat)[R], /non si calcola/);
	// A weak one.
	assert.match(rows(regressione('1 2 3 4 5 6', '2 5 1 6 2 4').outcome)[R], /debole e positiva/);
});

test('wrong inputs fail with a sentence', () => {
	for (const [x, y] of [
		['', '1 2'],
		['1 2', ''],
		['1 2 3', '1 2'],
		['1', '2'],
		['2 2 2', '1 2 3'],
		['1 a', '1 2'],
		[Array.from({ length: 51 }, (_, i) => String(i)).join(' '), Array.from({ length: 51 }, (_, i) => String(i)).join(' ')]
	]) {
		const { outcome, plot } = regressione(x, y);
		assert.equal(outcome.ok, false, `${x} | ${y}`);
		assert.equal(plot, null);
		assert.ok(outcome.error.length > 20, outcome.error);
	}
});

test('checked against floating point on random pairs, and readable', () => {
	let seed = 9;
	const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	const num = (s) => Number(s.replace(/ /g, '').replace(',', '.'));
	for (let i = 0; i < 300; i++) {
		const n = 2 + Math.floor(rnd() * 15);
		const xs = Array.from({ length: n }, () => Math.floor(rnd() * 30) - 5 + (rnd() < 0.2 ? 0.5 : 0));
		const ys = xs.map((x) => Math.round((0.7 * x + 3 + (rnd() - 0.5) * 20) * 10) / 10);
		const { outcome: o, plot } = regressione(xs.map((v) => String(v).replace('.', ',')).join(' '), ys.map((v) => String(v).replace('.', ',')).join(' '));
		if (new Set(xs).size === 1) {
			assert.equal(o.ok, false);
			continue;
		}
		assert.equal(o.ok, true, `${xs} | ${ys}`);
		assertReadable(o, `${xs} | ${ys}`);
		const mx = xs.reduce((a, b) => a + b) / n;
		const my = ys.reduce((a, b) => a + b) / n;
		const sxy = xs.reduce((a, x, k) => a + (x - mx) * (ys[k] - my), 0);
		const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
		const syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
		const m = sxy / sxx;
		assert.ok(Math.abs(plot.m - m) < 1e-9 && Math.abs(plot.q - (my - m * mx)) < 1e-9);
		if (syy > 0) {
			const r = num(o.copy.match(/r = (\S+)$/)[1]);
			assert.ok(Math.abs(r - sxy / Math.sqrt(sxx * syy)) < 6e-5, `${r}`);
		}
	}
});
