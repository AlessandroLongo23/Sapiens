// Distribuzione binomiale: the calculator's pure logic.
// Run with `node --test tests/unit/tools-binomiale.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { binomiale } = await jiti.import('../../src/lib/tools/binomiale.ts');

const all = (o) => o.steps.flatMap((s) => [s.say, ...(s.math ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? '']).join(' ');
const num = (o) => Number(o.copy.replace(',', '.'));

/** Floating-point reference. */
function pmf(n, p, k) {
	let c = 1;
	for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
	return c * p ** k * (1 - p) ** (n - k);
}
const cdf = (n, p, from, to) => {
	let s = 0;
	for (let i = from; i <= to; i++) s += pmf(n, p, i);
	return s;
};

test('exactly k: a die thrown ten times', () => {
	const o = binomiale('uguale', '10', '1/6', '3');
	assert.equal(o.ok, true);
	// 120 · 5^7 / 6^10 = 9375000/60466176 = 390625/2519424.
	assert.deepEqual(o.rows[0], { label: 'Probabilità di esattamente 3 successi su 10 prove', value: '$\\dfrac{390\\,625}{2\\,519\\,424}$' });
	assert.deepEqual(o.rows[1], { label: 'In decimali', value: '$\\approx 0{,}155$' });
	assert.deepEqual(o.rows[2], { label: 'In percentuale', value: '$\\approx 15{,}5\\%$' });
	assert.equal(o.copy, '0,155');
	assert.deepEqual(o.steps[1].math[1], 'P(X = 3) = \\binom{10}{3} \\cdot \\left(\\dfrac{1}{6}\\right)^{3} \\cdot \\left(\\dfrac{5}{6}\\right)^{7}');
	assert.deepEqual(o.steps[2].math, ['\\binom{10}{3} = \\dfrac{10 \\cdot 9 \\cdot 8}{3 \\cdot 2 \\cdot 1}', '= \\dfrac{720}{6}', '= \\hl{120}']);
	assert.deepEqual(o.steps[3].math, ['\\left(\\dfrac{1}{6}\\right)^{3} = \\dfrac{1}{216}', '\\left(\\dfrac{5}{6}\\right)^{7} = \\dfrac{78\\,125}{279\\,936}']);
	assert.deepEqual(o.steps[4].math, ['P(X = 3) = 120 \\cdot \\dfrac{1}{216} \\cdot \\dfrac{78\\,125}{279\\,936}', '= \\dfrac{390\\,625}{2\\,519\\,424}', '\\approx \\hl{0{,}155}']);
	// A decimal p gives decimals, and the symmetry of the coefficient.
	const d = binomiale('uguale', '10', '0,3', '8');
	assert.equal(d.rows.length, 2);
	assert.equal(d.copy, '0,0014');
	assert.match(all(d), /\\binom\{10\}\{8\} = \\binom\{10\}\{2\}/);
	assert.match(all(d), /0\{,\}3\^\{8\} = 0\{,\}00006561/);
	// A percentage is read as a decimal.
	assert.equal(binomiale('uguale', '10', '30%', '8').copy, '0,0014');
	// An exact decimal: 2 · 0,5 · 0,5.
	const coin = binomiale('uguale', '2', '0,5', '1');
	assert.equal(coin.copy, '0,5');
	assert.equal(coin.rows[0].value, '$0{,}5$');
	assert.equal(binomiale('uguale', '2', '1/2', '1').rows[0].value, '$\\dfrac{1}{2}$');
});

test('at least and at most, through the complementary event when shorter', () => {
	const o = binomiale('minimo', '10', '1/6', '2');
	assert.match(all(o), /evento contrario/);
	assert.deepEqual(o.steps[1].math, ['P(X \\geq 2) = 1 - P(X < 2)', '= 1 - [P(X = 0) + P(X = 1)]']);
	assert.deepEqual(o.steps[2].table.head, ['$i$', '$\\binom{10}{i}$', '$P(X = i)$']);
	assert.deepEqual(o.steps[2].table.rows[0], ['$0$', '$1$', '$\\dfrac{9\\,765\\,625}{60\\,466\\,176} \\approx 0{,}161506$']);
	assert.deepEqual(o.steps.at(-1).math, ['P(X \\geq 2) \\approx 1 - 0{,}484517', '= \\hl{0{,}515483}']);
	assert.equal(o.rows[0].value, '$\\dfrac{10\\,389\\,767}{20\\,155\\,392}$');
	assert.equal(o.copy, '0,5155');
	// At least one: 1 - P(X = 0), one term, no sum step.
	const one = binomiale('minimo', '5', '1/2', '1');
	assert.equal(one.rows[0].value, '$\\dfrac{31}{32}$');
	assert.equal(one.copy, '0,9688');
	assert.deepEqual(one.steps[1].math, ['P(X \\geq 1) = 1 - P(X < 1)', '= 1 - P(X = 0)']);
	assert.ok(!one.steps.some((s) => s.say === 'Somma i termini.'));
	// At most, directly.
	const most = binomiale('massimo', '8', '30%', '2');
	assert.ok(!all(most).includes('evento contrario'));
	assert.equal(most.steps[2].table.rows.length, 3);
	assert.ok(Math.abs(num(most) - cdf(8, 0.3, 0, 2)) < 1e-4);
	// At most 9 of 10: through P(X = 10).
	const nine = binomiale('massimo', '10', '1/2', '9');
	assert.equal(nine.rows[0].value, '$\\dfrac{1023}{1024}$');
	assert.match(all(nine), /P\(X > 9\)/);
});

test('certain events and tiny probabilities', () => {
	for (const o of [binomiale('minimo', '6', '1/3', '0'), binomiale('massimo', '6', '1/3', '6')]) {
		assert.equal(o.copy, '1');
		assert.match(all(o), /evento certo/);
		assertReadable(o);
	}
	// (1/6)^20: scientific notation, never 0.
	const tiny = binomiale('uguale', '20', '1/6', '20');
	assert.match(tiny.rows[0].value, /\\approx 2\{,\}74 \\cdot 10\^\{-16\}/);
	assert.ok(!tiny.rows.some((r) => r.label === 'In percentuale'));
	// A fraction too long to read gives decimals only.
	const long = binomiale('uguale', '100', '1/3', '30');
	assert.equal(long.rows.length, 2);
	assert.ok(Math.abs(num(long) - pmf(100, 1 / 3, 30)) < 1e-4);
	assertReadable(long);
});

test('checked against floating point', () => {
	for (const [n, p, ps] of [
		[10, 1 / 6, '1/6'],
		[12, 0.3, '0,3'],
		[7, 0.5, '1/2'],
		[25, 0.12, '12%'],
		[40, 2 / 7, '2/7'],
		[100, 0.05, '0,05']
	])
		for (let k = 0; k <= n; k += Math.max(1, Math.floor(n / 9))) {
			for (const [mode, ref] of [
				['uguale', pmf(n, p, k)],
				['massimo', cdf(n, p, 0, k)],
				['minimo', cdf(n, p, k, n)]
			]) {
				const o = binomiale(mode, String(n), ps, String(k));
				assert.equal(o.ok, true);
				assertReadable(o, `${mode} ${n} ${ps} ${k}`);
				// The copy has four decimals, or scientific notation for tiny values.
				if (ref >= 1e-4) assert.ok(Math.abs(num(o) - ref) < 5.1e-5, `${mode} ${n} ${ps} ${k}: ${o.copy} vs ${ref}`);
			}
		}
});

test('wrong inputs fail with a sentence', () => {
	for (const [n, p, k] of [
		['', '1/6', '2'],
		['0', '1/6', '2'],
		['101', '1/6', '2'],
		['10', '', '2'],
		['10', '0', '2'],
		['10', '1', '2'],
		['10', '7/6', '2'],
		['10', '1/0', '2'],
		['10', '30', '2'],
		['10', 'abc', '2'],
		['10', '1/6', '11'],
		['10', '1/6', '-1'],
		['10', '1/6', '2,5']
	]) {
		const o = binomiale('uguale', n, p, k);
		assert.equal(o.ok, false, `${n} ${p} ${k}`);
		assert.match(o.error, /per esempio/, o.error);
	}
	assert.match(binomiale('uguale', '10', '30', '2').error, /30%/);
});
