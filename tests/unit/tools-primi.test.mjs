// The prime number tool: trial division up to the square root, the first divisor, and the sieve up to N.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { numeriPrimi, primesUpTo } = await jiti.import('../../src/lib/tools/primi.ts');

const isPrime = (n) => {
	if (n < 2) return false;
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
	return true;
};
const smallestDivisor = (n) => {
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
	return n;
};

test('a composite number: the trial divisions stop at the first remainder 0', () => {
	const o = numeriPrimi('verifica', '91');
	assert.equal(o.ok, true);
	assert.equal(o.rows[0].value, 'non è primo');
	assert.equal(o.rows[1].value, '$7$');
	assert.equal(o.rows[2].value, '$91 = 7 \\cdot 13$');
	assert.equal(o.copy, '91 non è primo: 91 = 7 · 13');
	assert.deepEqual(o.steps[0].math, ['\\sqrt{91} \\approx \\hl{9{,}5}']);
	assert.deepEqual(o.steps[1].table.rows, [['$2$', '$1$'], ['$3$', '$1$'], ['$5$', '$1$'], ['$\\hl{7}$', '$\\hl{0}$']]);
	assert.deepEqual(o.steps[2].math, ['91 : 7 = 13', '91 = 7 \\cdot 13']);
	// A perfect square: the root is exact.
	assert.deepEqual(numeriPrimi('verifica', '49').steps[0].math, ['\\sqrt{49} = \\hl{7}']);
	// A large composite with a large first divisor: the table is shortened, the last row is the divisor.
	const big = numeriPrimi('verifica', String(999983 * 999979));
	assert.equal(big.ok, true);
	assert.equal(big.rows[1].value, '$999\\,979$');
	assert.ok(big.steps[1].table.rows.some((r) => r[0] === '$\\vdots$'));
	assert.deepEqual(big.steps[1].table.rows.at(-1), ['$\\hl{999\\,979}$', '$\\hl{0}$']);
});

test('primes, 0, 1, 2 and 3', () => {
	const p = numeriPrimi('verifica', '97');
	assert.equal(p.rows[0].value, 'è primo');
	assert.equal(p.steps[1].table.rows.length, 4);
	assert.equal(numeriPrimi('verifica', '2').rows[0].value, 'è primo');
	assert.equal(numeriPrimi('verifica', '3').rows[0].value, 'è primo');
	assert.equal(numeriPrimi('verifica', '1').rows[0].value, 'non è primo');
	assert.match(numeriPrimi('verifica', '1').steps[0].then, /un solo divisore/);
	assert.equal(numeriPrimi('verifica', '0').rows[0].value, 'non è primo');
	const big = numeriPrimi('verifica', '999999999989');
	assert.equal(big.rows[0].value, 'è primo');
	assert.match(big.steps[1].then, /Sono \$78\\,498\$ divisioni/);
});

test('wrong inputs', () => {
	for (const s of ['', ' ', '-7', '7,5', 'abc', '1000000000001']) assert.equal(numeriPrimi('verifica', s).ok, false, s);
	for (const s of ['', '1', '0', '1001', '-5', 'x']) assert.equal(numeriPrimi('elenco', s).ok, false, s);
});

test('against brute force (1..5000)', () => {
	for (let n = 0; n <= 5000; n++) {
		const o = numeriPrimi('verifica', String(n));
		assert.equal(o.rows[0].value, isPrime(n) ? 'è primo' : 'non è primo', String(n));
		if (n >= 4 && !isPrime(n)) assert.equal(o.rows[1].value, `$${smallestDivisor(n)}$`, String(n));
	}
});

test('the sieve up to N', () => {
	const o = numeriPrimi('elenco', '100');
	assert.equal(o.rows[0].value, '$25$');
	assert.equal(o.rows[1].value, '$97$');
	// The crossing out stops at 7: 11² > 100.
	assert.equal(o.steps.filter((s) => /cancella i suoi multipli/.test(s.say)).length, 4);
	assert.match(o.steps.at(-2).say, /\$11\$/);
	assert.equal(o.steps[0].group, 'Il crivello di Eratostene');
	assert.equal(numeriPrimi('elenco', '1000').rows[0].value, '$168$');
	assert.equal(numeriPrimi('elenco', '2').copy, '2');
	for (let n = 2; n <= 1000; n += 37) {
		const expected = [];
		for (let k = 2; k <= n; k++) if (isPrime(k)) expected.push(k);
		assert.deepEqual(primesUpTo(n), expected);
		assert.equal(numeriPrimi('elenco', String(n)).copy, expected.join(', '));
	}
});

test('readable', () => {
	for (const n of ['0', '1', '2', '3', '4', '49', '91', '97', '561', '1001', '999999999989', String(999983 * 999979), '', 'x']) assertReadable(numeriPrimi('verifica', n), n);
	for (let n = 1; n <= 1500; n++) assertReadable(numeriPrimi('verifica', String(n)), String(n));
	for (const n of ['2', '3', '4', '10', '30', '100', '121', '500', '1000', '', '1']) assertReadable(numeriPrimi('elenco', n), `elenco ${n}`);
});
