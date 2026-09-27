// The powers tool: integer, decimal and fractional bases, negative and zero exponents, overflow.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { potenza, parseNumber } = await jiti.import('../../src/lib/tools/potenze.ts');

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

test('reading the base', () => {
	const str = (w) => (w && typeof w === 'object' ? `${w.kind} ${w.value.toString()}` : w);
	assert.equal(str(parseNumber('3')), 'int 3');
	assert.equal(str(parseNumber('(-2)')), 'int -2');
	assert.equal(str(parseNumber('1,5')), 'dec 3/2');
	assert.equal(str(parseNumber('2/3')), 'frac 2/3');
	assert.equal(str(parseNumber('-4/6')), 'frac -2/3');
	assert.equal(str(parseNumber('4/-6')), 'frac -2/3');
	assert.equal(str(parseNumber('-(2/3)')), 'frac -2/3');
	assert.equal(str(parseNumber('(−2/3)')), 'frac -2/3');
	assert.equal(typeof parseNumber('2/0'), 'string');
	assert.equal(typeof parseNumber('1,5/2'), 'string');
	assert.equal(parseNumber('abc'), null);
});

test('powers with steps', () => {
	const o = potenza('2', '10');
	assert.equal(o.copy, '1024');
	assert.deepEqual(o.rows, [{ label: 'Valore della potenza', value: '$1024$' }]);
	// Seven to twelve factors: a table of the successive powers, the last one marked.
	assert.equal(o.steps[0].table.rows.length, 10);
	assert.deepEqual(o.steps[0].table.rows[9], ['$2^{10}$', '$\\hl{1024}$']);
	assert.equal(potenza('-2', '3').copy, '-8');
	const even = potenza('-2', '4');
	assert.equal(even.copy, '16');
	assert.match(even.steps.at(-1).say, /Attento alle parentesi/);
	assert.deepEqual(even.steps.at(-1).math, ['(-2)^4 = 16', '-2^4 = -16']);
	assert.deepEqual(even.steps[1].math, ['(-2)^4 = (-2) \\cdot (-2) \\cdot (-2) \\cdot (-2)', '= \\hl{16}']);
	assert.match(even.steps[0].say, /pari: il risultato è positivo/);
	assert.equal(potenza('2/3', '3').copy, '8/27');
	assert.equal(potenza('1,5', '2').copy, '2,25');
	assert.equal(potenza('0,5', '-3').copy, '8');
	assert.equal(potenza('10', '12').copy, '1 000 000 000 000');
	assert.equal(potenza('0', '5').copy, '0');
	assert.equal(potenza('1', '1000').copy, '1');
	assert.equal(potenza('-1', '-999').copy, '-1');
});

test('negative and zero exponents', () => {
	const neg = potenza('2/3', '-2');
	assert.equal(neg.copy, '9/4');
	assert.deepEqual(neg.rows, [
		{ label: 'Valore della potenza', value: '$\\dfrac{9}{4}$' },
		{ label: 'In forma decimale', value: '$2{,}25$' }
	]);
	assert.match(neg.steps[0].say, /reciproco/);
	assert.deepEqual(neg.steps[0].math, ['\\left(\\dfrac{2}{3}\\right)^{-2} = \\left(\\hl{\\dfrac{3}{2}}\\right)^2']);
	assert.deepEqual(neg.steps[1].math, ['\\left(\\dfrac{3}{2}\\right)^2 = \\dfrac{3^2}{2^2}', '= \\hl{\\dfrac{9}{4}}']);
	const third = potenza('3', '-2');
	assert.equal(third.copy, '1/9');
	assert.equal(third.rows[1].value, '$\\approx 0{,}111111$');
	assert.equal(potenza('-2/3', '-3').copy, '-27/8');
	const zero = potenza('7', '0');
	assert.equal(zero.copy, '1');
	assert.deepEqual(zero.steps[0].math, ['7^0 = \\hl{1}']);
	assert.deepEqual(zero.steps[1].math, ['a^n : a^n = a^{n-n}', '= a^0']);
	assert.equal(potenza('-4/6', '0').copy, '1');
	assert.match(potenza('4/6', '2').steps[0].say, /Semplifica/);
	assert.deepEqual(potenza('1,5', '2').steps[0].math, ['1{,}5 = \\hl{\\dfrac{3}{2}}']);
});

test('errors, explained in words', () => {
	const zz = potenza('0', '0');
	assert.equal(zz.ok, false);
	assert.match(zz.error, /non ha significato/);
	const zn = potenza('0', '-2');
	assert.equal(zn.ok, false);
	assert.match(zn.error, /per zero non si divide/);
	assert.equal(potenza('2', '1,5').ok, false);
	assert.equal(potenza('2', 'x').ok, false);
	assert.equal(potenza('', '2').ok, false);
	assert.equal(potenza('2/0', '2').ok, false);
	assert.equal(potenza('2', '2000').ok, false);
	const big = potenza('2', '60');
	assert.equal(big.ok, false);
	assert.match(big.error, /troppo grande/);
	assert.equal(potenza('2', '52').ok, true);
	assert.equal(potenza('3', '-40').ok, false);
	const tiny = potenza('0,001', '5');
	assert.equal(tiny.copy, '1/1000000000000000');
	assert.equal(tiny.rows.length, 1);
	assert.equal(potenza('0,001', '6').ok, false);
});

test('brute force: every small base and exponent', () => {
	for (let p = -6; p <= 6; p++)
		for (let q = 1; q <= 6; q++)
			for (let e = -6; e <= 6; e++) {
				const base = q === 1 ? String(p) : `${p}/${q}`;
				const o = potenza(base, String(e));
				if (p === 0 && e <= 0) {
					assert.equal(o.ok, false, `${base}^${e}`);
					continue;
				}
				// Independent: reduce the base, raise numerator and denominator, flip for a negative exponent.
				const g = gcd(p, q);
				let [n, d] = [(p / g) ** Math.abs(e), (q / g) ** Math.abs(e)];
				if (e < 0) [n, d] = [d, n];
				if (d < 0) [n, d] = [-n, -d];
				const h = gcd(n, d);
				[n, d] = [n / h, d / h];
				const expected = d === 1 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, n >= 10000 || n <= -10000 ? ' ' : '') : `${n}/${d}`;
				assert.equal(o.ok, true, `${base}^${e}`);
				assert.equal(o.copy, expected, `${base}^${e}`);
			}
});

test('readable: every string typesets, every sentence is short', () => {
	for (const [b, e] of [['2', '10'], ['-2', '4'], ['-2/3', '-3'], ['1,5', '2'], ['0,5', '-3'], ['4/6', '0'], ['3', '-2'], ['0,001', '5'], ['7', '1'], ['-3', '-1'], ['2', '52'], ['-1,5', '-4'], ['0', '0'], ['2', '60']]) assertReadable(potenza(b, e), `${b}^${e}`);
	for (let p = -6; p <= 6; p++) for (const q of [1, 2, 3, 4]) for (let e = -14; e <= 14; e++) assertReadable(potenza(q === 1 ? String(p) : `${p}/${q}`, String(e)), `${p}/${q}^${e}`);
});
