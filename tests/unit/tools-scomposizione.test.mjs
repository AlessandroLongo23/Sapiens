// The prime factorisation tool: results, the lesson's division column, and a brute-force check.
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
	assert.equal(o.result, '$360 = 2^3 \\cdot 3^2 \\cdot 5$');
	assert.match(o.steps[0], /\$\$\\begin\{array\}\{r\|l\} 360 & 2/);
	assert.match(o.steps.join(' '), /Il fattore 3 compare 2 volte/);
	assert.match(o.steps.at(-1), /8 \\cdot 9 \\cdot 5 = 360/);
	assert.equal(scomposizione('1024').copy, '1024 = 2^10');
	assert.equal(scomposizione('1.000.000').copy, '1 000 000 = 2^6 · 5^6');
	assert.equal(scomposizione('600851475143').copy, '600 851 475 143 = 71 · 839 · 1471 · 6857');
	assert.equal(scomposizione('1000000000000').copy, '1 000 000 000 000 = 2^12 · 5^12');
});

test('primes, 1 and 0', () => {
	const p = scomposizione('97');
	assert.equal(p.ok, true);
	assert.match(p.result, /numero primo/);
	assert.match(p.steps[0], /2, 3, 5, 7: nessuno/);
	assert.match(scomposizione('999999999989').result, /numero primo/);
	assert.match(scomposizione('2').result, /numero primo/);
	const one = scomposizione('1');
	assert.equal(one.ok, true);
	assert.match(one.result, /non ha fattori primi/);
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
			assert.match(o.result, /numero primo/, String(n));
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

test('every formula typesets', () => {
	for (const n of ['1', '2', '97', '360', '1024', '600851475143', '999999999989', '1000000000000', '2310']) assertTypesets(scomposizione(n));
});
