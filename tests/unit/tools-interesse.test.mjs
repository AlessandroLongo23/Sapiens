// Simple and compound interest: montante, capital and rate, rounded to the cent, checked against the formulas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { interesse } = await jiti.import('../../src/lib/tools/interesse.ts');

const run = (regime, cerca, { c = '', m = '', r = '', anni = '', mesi = '' }) => interesse({ regime, cerca, c, m, r, anni, mesi });
/** "1 159,27 €" → 1159.27 */
const euros = (s) => Number(s.replace(/[ €]/g, '').replace(',', '.'));

test('simple interest', () => {
	const o = run('semplice', 'montante', { c: '1000', r: '3', anni: '2', mesi: '6' });
	assertReadable(o, 'simple');
	assert.equal(o.copy, '1075 €');
	assert.deepEqual(o.rows, [
		{ label: 'Montante', value: '$1075\\ \\text{€}$' },
		{ label: 'Interesse', value: '$75\\ \\text{€}$' }
	]);
	assert.deepEqual(o.steps[0].math, ['t = 2 + \\frac{6}{12} = \\hl{2{,}5}']);
	// Four months are a third of a year: the time stays a fraction.
	const third = run('semplice', 'montante', { c: '1500', r: '2,5', anni: '1', mesi: '4' });
	assert.equal(third.copy, '1550 €');
	assert.deepEqual(third.steps[0].math, ['t = 1 + \\frac{4}{12} = 1 + \\frac{1}{3} = \\hl{\\frac{4}{3}}']);
	// Rounded to the cent, and said.
	const cents = run('semplice', 'montante', { c: '1234,56', r: '3,7', mesi: '7' });
	assertReadable(cents, 'cents');
	assert.equal(cents.copy, '1261,21 €');
	assert.equal(cents.rows[1].value, '$\\approx 26{,}65\\ \\text{€}$');
	assert.match(cents.steps[1].then, /centesimo/);
	assert.equal(run('semplice', 'capitale', { m: '1075', r: '3', anni: '2', mesi: '6' }).copy, '1000 €');
	assert.equal(run('semplice', 'tasso', { c: '1000', m: '1075', anni: '2', mesi: '6' }).copy, '3 %');
});

test('compound interest', () => {
	const o = run('composto', 'montante', { c: '1000', r: '3', anni: '5' });
	assertReadable(o, 'compound');
	assert.equal(o.copy, '1159,27 €');
	assert.equal(o.steps[1].table.rows.length, 5);
	assert.deepEqual(o.steps[1].table.rows[1], ['$2$', '$1030\\ \\text{€}$', '$30{,}90\\ \\text{€}$', '$1060{,}90\\ \\text{€}$']);
	// Long durations: the table skips the middle years.
	const long = run('composto', 'montante', { c: '5000', r: '4', anni: '20' });
	assertReadable(long, 'long');
	assert.equal(long.copy, '10 955,62 €');
	assert.equal(long.steps[1].table.rows.length, 14);
	// Months: the exponent is not whole.
	const months = run('composto', 'montante', { c: '1000', r: '3', anni: '2', mesi: '6' });
	assertReadable(months, 'months');
	assert.equal(months.copy, '1076,70 €');
	assert.match(months.steps[3].then, /esponente non è intero/);
	// The capital and the rate, back.
	assert.equal(run('composto', 'capitale', { m: '1159,27', r: '3', anni: '5' }).copy, '1000,00 €');
	const rate = run('composto', 'tasso', { c: '1000', m: '1060,90', anni: '2' });
	assertReadable(rate, 'rate');
	assert.equal(rate.copy, '3 %');
	assert.equal(rate.rows[0].value, '$3\\%$');
	const approx = run('composto', 'tasso', { c: '1000', m: '1100', anni: '1', mesi: '6' });
	assertReadable(approx, 'approx');
	assert.equal(approx.copy, '6,5602 %');
	const oneYear = run('composto', 'tasso', { c: '200', m: '210', anni: '1' });
	assertReadable(oneYear, 'one year');
	assert.equal(oneYear.copy, '5 %');
});

test('wrong inputs', () => {
	const bad = [
		['semplice', 'montante', { c: 'x', r: '3', anni: '2' }],
		['semplice', 'montante', { c: '1000,555', r: '3', anni: '2' }],
		['semplice', 'montante', { c: '1000', r: '0', anni: '2' }],
		['semplice', 'montante', { c: '1000', r: '3', anni: '0', mesi: '0' }],
		['semplice', 'montante', { c: '1000', r: '3', anni: '2', mesi: '12' }],
		['semplice', 'montante', { c: '1000', r: '3', anni: '2,5' }],
		['composto', 'montante', { c: '1000', r: '3', anni: '101' }],
		['composto', 'tasso', { c: '1000', m: '900', anni: '2' }],
		['semplice', 'capitale', { m: '-5', r: '3', anni: '2' }]
	];
	for (const [regime, cerca, v] of bad) {
		const o = run(regime, cerca, v);
		assert.equal(o.ok, false, JSON.stringify(v));
		assertReadable(o, JSON.stringify(v));
	}
});

test('against the formulas, and back', () => {
	for (const c of [100, 1000, 2500, 12345.67])
		for (const r of [0.5, 1, 2.5, 3, 4.75, 10])
			for (const n of [1, 2, 3, 7, 10, 30]) {
				const input = { c: String(c).replace('.', ','), r: String(r).replace('.', ','), anni: String(n) };
				const s = run('semplice', 'montante', input);
				assert.ok(Math.abs(euros(s.copy) - c * (1 + (r * n) / 100)) <= 0.005 + 1e-9, `simple ${c} ${r} ${n}`);
				const k = run('composto', 'montante', input);
				const expected = c * (1 + r / 100) ** n;
				assert.ok(Math.abs(euros(k.copy) - expected) <= 0.005 + 1e-6, `compound ${c} ${r} ${n}: ${k.copy} vs ${expected}`);
				// The rate from the montante rounded to the cent: off by at most what a cent is worth.
				const m = k.copy.replace(/[ €]/g, '');
				const back = run('composto', 'tasso', { c: input.c, m, anni: input.anni });
				assert.ok(Math.abs(Number(back.copy.replace(' %', '').replace(',', '.')) - r) < 0.6 / (c * n) + 1e-4, `rate ${c} ${r} ${n}: ${back.copy}`);
				const cap = run('composto', 'capitale', { m, r: input.r, anni: input.anni });
				assert.ok(Math.abs(euros(cap.copy) - c) < 0.01, `capital ${c} ${r} ${n}: ${cap.copy}`);
				if (n === 7) [s, k, back, cap].forEach((o) => assertReadable(o, `${c} ${r} ${n}`));
			}
});
