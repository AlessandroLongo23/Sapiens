// The divisors of a number: the list, their number from the prime factors, their sum, checked by brute force.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { divisori, divisorsOf } = await jiti.import('../../src/lib/tools/divisori.ts');

const brute = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

test('the divisors of 360', () => {
	const o = divisori('360');
	assertReadable(o, '360');
	assert.equal(o.rows[1].value, '$24$');
	assert.equal(o.rows[2].value, '$1170$');
	assert.equal(o.copy.split('; ').length, 24);
	assert.deepEqual(o.steps[1].math, ['(3 + 1) \\cdot (2 + 1) \\cdot (1 + 1) = 4 \\cdot 3 \\cdot 2', '= \\hl{24}']);
	assert.equal(o.steps[2].table.rows.length, 12);
	assert.deepEqual(o.steps[2].table.rows[11], ['$18$', '$20$', '$18 \\cdot 20 = 360$']);
	assert.deepEqual(o.steps[4].math, ['(1 + 2 + 2^{2} + 2^{3}) \\cdot (1 + 3 + 3^{2}) \\cdot (1 + 5)', '= 15 \\cdot 13 \\cdot 6', '= \\hl{1170}']);
});

test('squares, primes, perfect numbers, 1', () => {
	const sq = divisori('36');
	assertReadable(sq, '36');
	assert.match(sq.steps[2].then, /quadrato perfetto/);
	assert.equal(sq.rows[1].value, '$9$');
	const p = divisori('97');
	assertReadable(p, '97');
	assert.equal(p.copy, '1; 97');
	assert.match(p.steps[0].then, /numero primo/);
	assert.match(divisori('28').steps[4].then, /numero perfetto/);
	const one = divisori('1');
	assertReadable(one, '1');
	assert.equal(one.copy, '1');
	// Many divisors: the tables are cut, the result row gives the number only.
	const big = divisori('735134400');
	assertReadable(big, 'big');
	assert.equal(big.rows[1].value, '$1344$');
	assert.ok(!big.rows[0].value.includes('$'));
	// A large prime: the sum does not overflow.
	assert.equal(divisori('999999937').rows[2].value, '$999\\,999\\,938$');
});

test('wrong inputs', () => {
	for (const x of ['', '0', '-4', '2,5', 'abc', '2000000000']) {
		const o = divisori(x);
		assert.equal(o.ok, false, x);
		assertReadable(o, x);
	}
});

test('brute force on 1 to 2000', () => {
	for (let n = 1; n <= 2000; n++) {
		const ds = brute(n);
		assert.deepEqual(divisorsOf(n), ds, String(n));
		const o = divisori(String(n));
		assert.equal(o.copy, ds.join('; '), String(n));
		assert.equal(o.rows[1].value, `$${ds.length}$`, String(n));
		const sum = ds.reduce((a, b) => a + b, 0);
		assert.equal(o.rows[2].value.replace(/\\,/g, ''), `$${sum}$`, String(n));
		if (n % 97 === 0) assertReadable(o, String(n));
	}
});
