// The powers tool: integer, decimal and fractional bases, negative and zero exponents, overflow.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

/** Every `$…$` and `$$…$$` in a result or a step must typeset in KaTeX. */
function assertTypesets(o) {
	if (!o.ok) return;
	for (const text of [o.result, ...o.steps])
		for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
			const src = m[1] ?? m[2];
			assert.doesNotThrow(() => katex.renderToString(src, { displayMode: !!m[1], throwOnError: true, strict: 'ignore' }), src);
		}
}

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
	assert.equal(o.result, '$2^{10} = 1024$');
	assert.equal(potenza('-2', '3').copy, '-8');
	const even = potenza('-2', '4');
	assert.equal(even.copy, '16');
	assert.match(even.steps.join(' '), /Attento alle parentesi/);
	assert.match(even.steps.join(' '), /\(-2\) \\cdot \(-2\) \\cdot \(-2\) \\cdot \(-2\) = 16/);
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
	assert.equal(neg.result, '$\\left(\\dfrac{2}{3}\\right)^{-2} = \\dfrac{9}{4} = 2{,}25$');
	assert.match(neg.steps[0], /reciproco/);
	const third = potenza('3', '-2');
	assert.equal(third.copy, '1/9');
	assert.match(third.result, /\\approx 0\{,\}111111/);
	assert.equal(potenza('-2/3', '-3').copy, '-27/8');
	const zero = potenza('7', '0');
	assert.equal(zero.copy, '1');
	assert.match(zero.steps.join(' '), /a\^0 = 1/);
	assert.equal(potenza('-4/6', '0').copy, '1');
	assert.match(potenza('4/6', '2').steps[0], /Semplifica/);
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
	assert.doesNotMatch(tiny.result, /approx/);
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

test('every formula typesets', () => {
	for (const [b, e] of [['2', '10'], ['-2', '4'], ['-2/3', '-3'], ['1,5', '2'], ['0,5', '-3'], ['4/6', '0'], ['3', '-2'], ['0,001', '5'], ['7', '1'], ['-3', '-1']]) assertTypesets(potenza(b, e));
});
