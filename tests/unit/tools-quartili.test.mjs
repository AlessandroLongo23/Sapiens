// Quartili e box plot: the calculator's pure logic.
// Run with `node --test tests/unit/tools-quartili.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { quartili } = await jiti.import('../../src/lib/tools/quartili.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));

test('odd number of data: the median stays out of both halves', () => {
	const { outcome: o, box } = quartili('6 47 49 15 43 41 7 39 43 40 36');
	assert.equal(o.ok, true);
	assert.deepEqual(box, { min: 6, q1: 15, med: 40, q3: 43, max: 49 });
	assert.equal(rows(o)['Scarto interquartile'], '$28$');
	assert.equal(o.copy, 'minimo 6; Q1 15; mediana 40; Q3 43; massimo 49; scarto interquartile 28');
	const lower = o.steps.find((s) => s.group === 'Il primo quartile');
	assert.deepEqual(lower.table.rows[0], ['$6$', '$7$', '$\\hl{15}$', '$36$', '$39$']);
	assert.match(lower.then, /non entra/);
	const upper = o.steps.find((s) => s.group === 'Il terzo quartile');
	assert.deepEqual(upper.table.head, ['$7$', '$8$', '$9$', '$10$', '$11$']);
});

test('even number of data: halves of equal size, means of two', () => {
	const { outcome: o, box } = quartili('7 15 36 39 40 41');
	assert.deepEqual(box, { min: 7, q1: 15, med: 37.5, q3: 40, max: 41 });
	assert.deepEqual(o.steps[1].math, ['Q_2 = \\text{Me} = \\dfrac{36 + 39}{2}', '= \\dfrac{75}{2}', '= \\hl{37{,}5}']);
	// Eight data: halves of four, each quartile a mean of two.
	const eight = quartili('2 4 5 7 8 9 12 15');
	assert.deepEqual(eight.box, { min: 2, q1: 4.5, med: 7.5, q3: 10.5, max: 15 });
	assert.equal(rows(eight.outcome)['Scarto interquartile'], '$6$');
	// Negative data and decimals.
	const neg = quartili('-3 -1,5 0 2 4,5');
	assert.deepEqual(neg.box, { min: -3, q1: -2.25, med: 0, q3: 3.25, max: 4.5 });
	assert.match(neg.outcome.steps[3].math[0], /\(-1\{,\}5\)/);
	// Equal middle values.
	assert.equal(quartili('1 2 2 3 3 3 4 20').box.med, 3);
});

test('wrong inputs fail with a sentence', () => {
	for (const input of ['', '1 2 3', '1 2 x 4', Array.from({ length: 101 }, () => '1').join(' ')]) {
		const { outcome, box } = quartili(input);
		assert.equal(outcome.ok, false, input);
		assert.equal(box, null);
		assert.match(outcome.error, /per esempio|Al massimo/, outcome.error);
	}
});

test('checked by brute force on random lists, and readable', () => {
	let seed = 3;
	const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	const median = (v) => (v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2);
	for (let i = 0; i < 300; i++) {
		const n = 4 + Math.floor(rnd() * 40);
		const xs = Array.from({ length: n }, () => Math.floor(rnd() * 50) - 10 + (rnd() < 0.2 ? 0.5 : 0));
		const input = xs.map((x) => String(x).replace('.', ',')).join(' ');
		const { outcome, box } = quartili(input);
		assert.equal(outcome.ok, true, input);
		assertReadable(outcome, input);
		const s = [...xs].sort((a, b) => a - b);
		const h = Math.floor(n / 2);
		assert.deepEqual(box, { min: s[0], q1: median(s.slice(0, h)), med: median(s), q3: median(s.slice(n - h)), max: s[n - 1] }, input);
		// A quarter of the data at most below Q1, and the same above Q3.
		assert.ok(s.filter((x) => x < box.q1).length <= n / 4 + 0.5);
		assert.ok(s.filter((x) => x > box.q3).length <= n / 4 + 0.5);
	}
});
