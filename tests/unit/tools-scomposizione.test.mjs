// The prime factorisation tool: results, the lesson's division column, and a brute-force check.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { scomposizione } = await jiti.import('../../src/lib/tools/scomposizione.ts');

/** "360 = 2^3 · 3^2 · 5" → [[2, 3], [3, 2], [5, 1]]. */
const parse = (copy) =>
	copy
		.split(' = ')[1]
		.split(' · ')
		.map((f) => f.replace(/ /g, '').split('^').map(Number))
		.map(([p, e = 1]) => [p, e]);
const isPrime = (n) => {
	if (n < 2) return false;
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
	return true;
};

test('factorisation in powers, with the division column', () => {
	const o = scomposizione('360');
	assert.equal(o.ok, true);
	assert.equal(o.copy, '360 = 2^3 · 3^2 · 5');
	assert.deepEqual(o.rows, [{ label: 'Scomposizione di 360', value: '$360 = 2^3 \\cdot 3^2 \\cdot 5$' }]);
	assert.deepEqual(o.steps[0].math, ['360 : 2 = \\hl{180}', '180 : 2 = \\hl{90}', '90 : 2 = \\hl{45}']);
	assert.match(o.steps[0].say, /è pari/);
	assert.match(o.steps[1].say, /somma delle cifre di \$45\$ è \$9\$/);
	assert.match(o.steps[1].then, /Il fattore \$3\$ compare \$2\$ volte/);
	// The division column, one row per division, down to 1.
	const column = o.steps.find((s) => s.table);
	assert.deepEqual(column.table.head, ['Numero', 'Divisore primo']);
	assert.deepEqual(column.table.rows.map((r) => r.join(' ')), ['$360$ $2$', '$180$ $2$', '$90$ $2$', '$45$ $3$', '$15$ $3$', '$5$ $5$', '$1$ ']);
	assert.deepEqual(o.steps.at(-1).math, ['2^3 \\cdot 3^2 \\cdot 5 = 8 \\cdot 9 \\cdot 5', '= 72 \\cdot 5', '= \\hl{360}']);
	assert.equal(o.steps[0].group, 'Le divisioni');
	// Long runs of the same factor are shortened.
	assert.ok(scomposizione('1024').steps[0].math.includes('\\vdots'));
	assert.equal(scomposizione('1024').copy, '1024 = 2^10');
	assert.equal(scomposizione('1.000.000').copy, '1 000 000 = 2^6 · 5^6');
	assert.equal(scomposizione('600851475143').copy, '600 851 475 143 = 71 · 839 · 1471 · 6857');
	assert.equal(scomposizione('1000000000000').copy, '1 000 000 000 000 = 2^12 · 5^12');
});

test('primes, 1 and 0', () => {
	const p = scomposizione('97');
	assert.equal(p.ok, true);
	assert.match(p.rows[0].label, /numero primo/);
	assert.deepEqual(p.steps[1].table.rows, [['$2$', '$1$'], ['$3$', '$1$'], ['$5$', '$2$'], ['$7$', '$6$']]);
	assert.match(p.steps[0].math[0], /9\{,\}8/);
	const big = scomposizione('999999999989');
	assert.match(big.rows[0].label, /numero primo/);
	assert.match(big.steps[1].then, /Continua così/);
	assert.match(scomposizione('2').rows[0].label, /numero primo/);
	const one = scomposizione('1');
	assert.equal(one.ok, true);
	assert.match(one.rows[0].value, /non si scompone/);
	assert.equal(scomposizione('0').ok, false);
});

test('wrong inputs', () => {
	for (const s of ['', '  ', '-12', '12,5', 'abc', '1000000000001']) assert.equal(scomposizione(s).ok, false, s);
});

test('the product of the factors is the number, the factors are prime (1..5000)', () => {
	for (let n = 2; n <= 5000; n++) {
		const o = scomposizione(String(n));
		assert.equal(o.ok, true);
		if (isPrime(n)) {
			assert.match(o.rows[0].label, /numero primo/, String(n));
			continue;
		}
		const fs = parse(o.copy);
		assert.equal(fs.reduce((acc, [p, e]) => acc * p ** e, 1), n, String(n));
		for (let i = 0; i < fs.length; i++) {
			assert.ok(isPrime(fs[i][0]), `${n}: ${fs[i][0]}`);
			if (i) assert.ok(fs[i][0] > fs[i - 1][0], String(n));
		}
	}
});

test('readable: every string typesets, every sentence is short (1..3000 and large numbers)', () => {
	for (const n of ['0', '', '1', '2', '97', '360', '1024', '1001', '600851475143', '999999999989', '1000000000000', '2310', '2520']) assertReadable(scomposizione(n), n);
	for (let n = 1; n <= 3000; n++) assertReadable(scomposizione(String(n)), String(n));
});
