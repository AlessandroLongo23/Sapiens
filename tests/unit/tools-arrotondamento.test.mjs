// Rounding to a place or to significant figures, half up on the absolute value, checked against BigInt arithmetic.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { arrotondamento } = await jiti.import('../../src/lib/tools/arrotondamento.ts');

const posto = (n, p) => arrotondamento('posto', { n, p: String(p) });
const cifre = (n, k) => arrotondamento('cifre', { n, k: String(k) });

/** "−12 345,678" → [negative, BigInt of all digits, decimals]. */
function parse(text) {
	const neg = text.startsWith('-');
	const [int, frac = ''] = text.replace(/[-\s]/g, '').split(',');
	return [neg, BigInt(int + frac), frac.length];
}
/** The expected text of `text` rounded half up to p decimals (p < 0: tens…), with p decimals shown when p > 0. */
function reference(text, p) {
	const [neg, n, f] = parse(text);
	const ten = (k) => 10n ** BigInt(k);
	// |x| · 10^p = n · 10^(p - f), rounded half up.
	const r = p - f >= 0 ? n * ten(p - f) : (2n * n + ten(f - p)) / (2n * ten(f - p));
	let s = p >= 0 ? r.toString().padStart(p + 1, '0') : (r * ten(-p)).toString();
	if (p > 0) s = `${s.slice(0, -p)},${s.slice(-p)}`;
	const [int, frac] = s.split(',');
	const intText = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
	const zero = r === 0n;
	return `${neg && !zero ? '-' : ''}${intText}${frac ? `,${frac}` : ''}`;
}

test('to a place', () => {
	const o = posto('12,3456', 2);
	assert.equal(o.copy, '12,35');
	assert.equal(o.rows[0].label, '12,3456 arrotondato ai centesimi');
	assert.deepEqual(o.steps[0].math, ['12{,}3\\hl{4}56']);
	assert.deepEqual(o.steps[1].math, ['12{,}34\\hl{5}6']);
	assert.match(o.steps[1].then, /proprio \$5\$.*per eccesso/);
	assert.deepEqual(o.steps[2].math, ['12{,}3456 \\approx \\hl{12{,}35}']);
	assert.equal(posto('3,14159', 3).copy, '3,142');
	assert.match(posto('3,14159', 1).steps[1].then, /per difetto/);
	assert.equal(posto('1234', -2).copy, '1200');
	assert.equal(posto('1250', -2).copy, '1300');
	assert.equal(posto('567', -3).copy, '1000');
	assert.match(posto('567', -3).steps[0].then, /non arriva alle migliaia/);
	assert.equal(posto('49', -3).copy, '0');
	assert.equal(posto('2,997', 2).copy, '3,00');
	assert.match(posto('2,997', 2).steps[2].then, /porta|aggiungi \$1\$/);
	assert.equal(posto('-2,35', 1).copy, '-2,4');
	assert.equal(posto('-0,004', 2).copy, '0,00');
	assert.equal(posto('9,99', 0).copy, '10');
	assert.equal(posto('12,30', 1).copy, '12,3');
	assert.equal(posto('12,30', 1).steps[2].math[0], '12{,}30 = \\hl{12{,}3}');
	assert.equal(posto('1 234 567,89', -3).copy, '1 235 000');
	// Nothing after the place: nothing to round.
	assert.equal(posto('2,5', 2).copy, '2,50');
	assert.match(posto('2,5', 2).steps[0].say, /non c’è niente da arrotondare/);
	assert.equal(posto('17', 0).copy, '17');
});

test('to significant figures', () => {
	const o = cifre('0,0049967', 3);
	assert.equal(o.copy, '0,00500');
	assert.equal(o.rows[1].value, '$5{,}00 \\cdot 10^{-3}$');
	assert.deepEqual(o.steps[1].math, ['0{,}00\\hl{499}67']);
	assert.match(o.steps[1].then, /centomillesimi/);
	assert.equal(cifre('123456', 2).copy, '120 000');
	assert.equal(cifre('123456', 2).rows[1].value, '$1{,}2 \\cdot 10^{5}$');
	assert.match(cifre('123456', 2).steps.at(-1).then, /non sono significativi/);
	assert.equal(cifre('999', 2).copy, '1000');
	assert.equal(cifre('999', 2).rows[1].value, '$1{,}0 \\cdot 10^{3}$');
	assert.equal(cifre('3,14159', 1).copy, '3');
	assert.equal(cifre('2,5', 4).copy, '2,500');
	assert.equal(cifre('0,0001234', 2).copy, '0,00012');
	assert.equal(cifre('-6,6743', 3).copy, '-6,67');
	assert.equal(cifre('0,000000000000000000031415926', 3).copy, '0,0000000000000000000314');
});

test('wrong inputs', () => {
	for (const n of ['', 'abc', '1,2,3']) assert.equal(posto(n, 2).ok, false, n);
	for (const p of ['7', '-7', 'x', '1,5']) assert.equal(arrotondamento('posto', { n: '12,5', p }).ok, false, p);
	for (const k of ['0', '21', '', '2,5', 'x']) assert.equal(cifre('12,5', k).ok, false, k);
	assert.equal(cifre('0', 3).ok, false);
	assert.equal(cifre('0,000', 3).ok, false);
});

test('against BigInt arithmetic (random numbers)', () => {
	let seed = 11;
	const rnd = (k) => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), seed % k);
	for (let i = 0; i < 4000; i++) {
		const int = rnd(3) === 0 ? '0' : String(rnd(10 ** (1 + rnd(7))));
		const frac = rnd(4) ? String(rnd(10 ** (1 + rnd(6)))).padStart(1 + rnd(7), '0') : '';
		const text = `${rnd(4) === 0 ? '-' : ''}${int}${frac ? `,${frac}` : ''}`;
		const p = rnd(13) - 6;
		const o = posto(text, p);
		assert.equal(o.ok, true, text);
		// With no digit after the place the number is only padded with zeros, which the reference also does.
		assert.equal(o.copy, reference(text, p), `${text} to ${p}`);
		const k = 1 + rnd(8);
		const c = cifre(text, k);
		const [, n] = parse(text);
		if (n === 0n) {
			assert.equal(c.ok, false);
			continue;
		}
		// The place of the k-th significant figure, from the digits: decimals minus (digits − k).
		const q = parse(text)[2] - (n.toString().length - k);
		assert.equal(c.copy, reference(text, q), `${text} with ${k} figures`);
		if (i % 4 === 0) {
			assertReadable(o, `${text} ${p}`);
			assertReadable(c, `${text} ${k}`);
		}
	}
});

test('readable', () => {
	for (const [n, p] of [['12,3456', 2], ['567', -3], ['2,997', 2], ['2,5', 2], ['1 234 567,89', -6], ['', 2]]) assertReadable(posto(n, p), `${n} ${p}`);
	for (const [n, k] of [['0,0049967', 3], ['123456', 2], ['999', 2], ['2,5', 4], ['0', 3]]) assertReadable(cifre(n, k), `${n} ${k}`);
});
