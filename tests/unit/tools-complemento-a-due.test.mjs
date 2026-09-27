// Two's complement on 8, 16 and 32 bits, checked against the bitwise arithmetic of JavaScript.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { complementoADue, decimaleACompl2, compl2ADecimale, range } = await jiti.import('../../src/lib/tools/complemento-a-due.ts');

/** The n bits of x, from the machine: x & mask. */
const machine = (x, n) => (n === 32 ? (x >>> 0).toString(2) : (x & (2 ** n - 1)).toString(2)).padStart(n, '0');

test('known values', () => {
	assert.equal(decimaleACompl2('-14', 8).copy, '11110010');
	assert.equal(decimaleACompl2('14', 8).copy, '00001110');
	assert.equal(decimaleACompl2('-1', 8).copy, '11111111');
	assert.equal(decimaleACompl2('-128', 8).copy, '10000000');
	assert.equal(decimaleACompl2('127', 8).copy, '01111111');
	assert.equal(decimaleACompl2('0', 16).copy, '0'.repeat(16));
	assert.equal(decimaleACompl2('−5', 16).copy, '1111111111111011');
	assert.equal(decimaleACompl2('-2147483648', 32).copy, '1' + '0'.repeat(31));
	assert.equal(compl2ADecimale('1111 0010').copy, '-14');
	assert.equal(compl2ADecimale('0000 1110').copy, '14');
	assert.equal(compl2ADecimale('1000 0000').copy, '-128');
	assert.equal(compl2ADecimale('0b11111111').copy, '-1');
	assert.equal(compl2ADecimale('1000').copy, '-8');
	assert.deepEqual(range(8), [-128, 127]);
	assert.deepEqual(range(32), [-2147483648, 2147483647]);
	assert.equal(decimaleACompl2('-14', 8).rows[1].value, 'da $-128$ a $127$');
	assert.equal(decimaleACompl2('-14', 32).rows[1].value, 'da $-2\\,147\\,483\\,648$ a $2\\,147\\,483\\,647$');
});

test('the steps: invert the bits and add 1', () => {
	const o = decimaleACompl2('-14', 8);
	const text = JSON.stringify(o.steps);
	assert.match(text, /0000\\\\,1110\} \\\\to \\\\hl\{\\\\mathtt\{1111\\\\,0001\}\}/);
	assert.match(text, /hline \\\\hl\{\\\\mathtt\{1111\\\\,0010\}\}/);
	assert.match(text, /-128 \+ 114 = \\\\hl\{-14\}/);
	assert.equal(o.steps[0].group, 'L’intervallo');
	const back = compl2ADecimale('11110010');
	assert.match(JSON.stringify(back.steps), /mathtt\{1111\\\\,0010\} = \\\\hl\{-14\}/);
	assert.ok(back.steps[0].group);
	// Positive numbers need no inversion.
	assert.ok(!JSON.stringify(decimaleACompl2('14', 8).steps).includes('Inverti'));
	assert.ok(decimaleACompl2('14', 8).steps.length <= 5);
});

test('every string typesets and every sentence is short', () => {
	for (const n of [8, 16, 32]) {
		const [lo, hi] = range(n);
		for (const x of [lo, lo + 1, -100, -14, -1, 0, 1, 14, 100, hi]) {
			if (x < lo || x > hi) continue;
			assertReadable(decimaleACompl2(String(x), n), `${x} on ${n}`);
			assertReadable(compl2ADecimale(machine(x, n)), `${machine(x, n)}`);
		}
	}
});

test('wrong input', () => {
	assert.match(decimaleACompl2('200', 8).error, /da -128 a 127/);
	assert.match(decimaleACompl2('-129', 8).error, /più bit/);
	assert.match(decimaleACompl2('3000000000', 32).error, /più piccolo/);
	assert.match(decimaleACompl2('1,5', 8).error, /intero/);
	assert.match(decimaleACompl2('', 8).error, /per esempio/);
	assert.equal(decimaleACompl2('5', 12).ok, false);
	assert.match(compl2ADecimale('1021').error, /0 e 1/);
	assert.match(compl2ADecimale('1').error, /almeno 2 bit/);
	assert.match(compl2ADecimale('1'.repeat(33)).error, /Al massimo 32/);
	assert.match(compl2ADecimale('').error, /per esempio/);
	for (const o of [decimaleACompl2('200', 8), compl2ADecimale('12')]) assertReadable(o);
});

test('every 8-bit number and many 16- and 32-bit ones, both ways', () => {
	const cases = [];
	for (let x = -128; x <= 127; x++) cases.push([x, 8]);
	for (let i = 0; i < 300; i++) cases.push([Math.floor(Math.random() * 65536) - 32768, 16]);
	for (let i = 0; i < 300; i++) cases.push([Math.floor(Math.random() * 2 ** 32) - 2 ** 31, 32]);
	for (const [x, n] of cases) {
		const o = complementoADue(String(x), 'dec', n);
		assert.ok(o.ok, `${x}: ${o.error}`);
		assert.equal(o.copy, machine(x, n), `${x} on ${n}`);
		const back = complementoADue(o.copy, 'bin', n);
		assert.equal(back.copy, String(x), `${o.copy} back`);
	}
});
