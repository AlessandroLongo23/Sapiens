// Varianza e deviazione standard: the calculator's pure logic.
// Run with `node --test tests/unit/tools-varianza.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { varianza, spread, sqrtDecimal } = await jiti.import('../../src/lib/tools/varianza.ts');
const { parseDecimal } = await jiti.import('../../src/lib/tools/numbers.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));
const all = (o) => o.steps.flatMap((s) => [s.say, ...(s.math ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? '']).join(' ');

test('the lesson examples', () => {
	// Esempio 1 of "Indici di variabilità": σ² = 32/8 = 4, σ = 2.
	const o = varianza('2 4 4 4 5 5 7 9');
	assert.equal(o.ok, true);
	assert.equal(rows(o)['Varianza'], '$4$');
	assert.equal(rows(o)['Deviazione standard (scarto quadratico medio)'], '$2$');
	assert.equal(rows(o)['Coefficiente di variazione'], '$40\\%$');
	// Sample variance 32/7.
	assert.equal(rows(o)['Varianza campionaria (divisore n − 1)'], '$\\approx 4{,}5714$');
	const table = o.steps.find((s) => s.table).table;
	assert.deepEqual(table.head, ['$x_i$', '$x_i - \\bar{x}$', '$(x_i - \\bar{x})^2$']);
	assert.deepEqual(table.rows[0], ['$2$', '$-3$', '$9$']);
	assert.deepEqual(table.rows.at(-1), ['somma', '$0$', '$\\hl{32}$']);
	// Esempio 4: mean 5,5, σ² = 3,25, σ ≈ 1,80.
	const bus = varianza('3 5 6 8');
	assert.equal(bus.copy, 'media 5,5; varianza 3,25; deviazione standard 1,8028; coefficiente di variazione 32,78 %; varianza campionaria 4,3333');
	assert.deepEqual(bus.steps.find((s) => s.table).table.rows[0], ['$3$', '$-2{,}5$', '$6{,}25$']);
	assert.match(all(bus), /\\sigma = \\sqrt\{3\{,\}25\}/);
	// Marta and Luca.
	assert.equal(rows(varianza('6 7 7 7 8'))['Varianza'], '$0{,}4$');
	assert.equal(rows(varianza('4 6 7 9 9'))['Varianza'], '$3{,}6$');
	assert.equal(rows(varianza('4 6 7 9 9'))['Deviazione standard (scarto quadratico medio)'], '$\\approx 1{,}8974$');
	// Esempio 3, negative data: σ = 2.
	const cold = varianza('-2 -1 0 1 3 4 2');
	assert.equal(rows(cold)['Deviazione standard (scarto quadratico medio)'], '$2$');
	assert.match(all(cold), /dati negativi/);
});

test('a periodic mean keeps fractions', () => {
	const o = varianza('1 2 4');
	assert.equal(o.ok, true);
	assert.match(all(o), /tienila come frazione/);
	assert.deepEqual(o.steps[1].math, ['\\bar{x} = \\hl{\\dfrac{7}{3}}', '\\approx 2{,}3333']);
	const table = o.steps.find((s) => s.table).table;
	assert.deepEqual(table.rows[0], ['$1$', '$-\\dfrac{4}{3}$', '$\\dfrac{16}{9}$']);
	assert.deepEqual(table.rows.at(-1), ['somma', '$0$', '$\\hl{\\dfrac{42}{9}}$']);
	assert.equal(rows(o)['Varianza'], '$\\approx 1{,}5556$');
	// 14/9 and its root.
	assert.equal(rows(o)['Deviazione standard (scarto quadratico medio)'], '$\\approx 1{,}2472$');
	// A mean reduced from the sum: 6 data summing to 14.
	const r = varianza('1 2 3 3 2 3');
	assert.equal(r.steps[1].math[0], '\\bar{x} = \\dfrac{14}{6}');
	assert.equal(r.steps[1].math[1], '= \\hl{\\dfrac{7}{3}}');
});

test('limits: equal data, zero mean, decimals', () => {
	const same = varianza('5 5 5');
	assert.equal(rows(same)['Varianza'], '$0$');
	assert.equal(rows(same)['Coefficiente di variazione'], '$0\\%$');
	const zero = varianza('-3 3');
	assert.equal(rows(zero)['Coefficiente di variazione'], 'non si calcola: la media è $0$');
	assert.equal(rows(zero)['Varianza'], '$9$');
	const dec = varianza('1,5; 2,5; 4');
	assert.equal(dec.ok, true);
	assertReadable(dec, '1,5 2,5 4');
	assert.equal(varianza('0,1 0,2').copy, 'media 0,15; varianza 0,0025; deviazione standard 0,05; coefficiente di variazione 33,33 %; varianza campionaria 0,005');
});

test('square roots to four decimals', () => {
	const q = (s) => parseDecimal(s);
	assert.deepEqual(sqrtDecimal(q('4')), { tex: '2', text: '2', exact: true });
	assert.equal(sqrtDecimal(q('2')).text, '1,4142');
	assert.equal(sqrtDecimal(q('3,25')).text, '1,8028');
	assert.equal(sqrtDecimal(q('3,24')).text, '1,8');
	assert.equal(sqrtDecimal(q('1000000000')).text, '31 622,7766');
	for (let i = 1; i < 2000; i += 7) {
		const s = sqrtDecimal(q(String(i)));
		const expected = Math.round(Math.sqrt(i) * 1e4) / 1e4;
		assert.ok(Math.abs(Number(s.text.replace(/ /g, '').replace(',', '.')) - expected) < 1e-9, `sqrt ${i}`);
	}
});

test('wrong inputs fail with a sentence', () => {
	for (const input of ['', '5', '3 x 4', Array.from({ length: 101 }, () => '1').join(' ')]) {
		const o = varianza(input);
		assert.equal(o.ok, false, input);
		assert.match(o.error, /per esempio|Al massimo/, o.error);
	}
	assert.equal(varianza('0,1234567 0,7654321 0,1111113 0,98765432109').ok, false);
});

test('checked against floating point on random lists, and readable', () => {
	let seed = 11;
	const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	for (let i = 0; i < 300; i++) {
		const n = 2 + Math.floor(rnd() * 14);
		const xs = Array.from({ length: n }, () => Math.floor(rnd() * 41) - 10 + (rnd() < 0.3 ? 0.5 : 0) + (rnd() < 0.1 ? 0.25 : 0));
		const mean = xs.reduce((a, b) => a + b, 0) / n;
		const ss = xs.reduce((a, x) => a + (x - mean) ** 2, 0);
		const s = spread(xs.map((x) => parseDecimal(String(x))));
		const num = (r) => r.num / r.den;
		assert.ok(Math.abs(num(s.variance) - ss / n) < 1e-9);
		assert.ok(Math.abs(num(s.sampleVariance) - ss / (n - 1)) < 1e-9);
		assert.ok(s.deviations.reduce((a, d) => a.add(d)).isZero());
		const o = varianza(xs.map((x) => String(x).replace('.', ',')).join(' '));
		assert.equal(o.ok, true, xs.join(' '));
		assertReadable(o, xs.join(' '));
		const sd = Number(o.copy.match(/deviazione standard ([\d ,]+);/)[1].replace(/ /g, '').replace(',', '.'));
		assert.ok(Math.abs(sd - Math.sqrt(ss / n)) < 6e-5, `${xs.join(' ')}: ${sd}`);
	}
	for (const n of ['3 5 6 8', '2 4 4 4 5 5 7 9', '6 7 7 7 8', '1 2 4', '-2 -1 0 1 3 4 2', '1,5; 2,5; 4', '5 5 5', '-3 3'])
		assertReadable(varianza(n), n);
	// A hundred data with a periodic mean still work exactly.
	const hundred = varianza(Array.from({ length: 100 }, (_, i) => String((i * 7) % 23)).join(' '));
	assert.equal(hundred.ok, true);
	assertReadable(hundred, 'hundred');
	// 97 data with two decimals: the common denominator passes the safe integers on Rational, not on BigInt.
	const cents = Array.from({ length: 97 }, (_, i) => (((i * 37) % 1000) / 100).toFixed(2).replace('.', ','));
	const c = varianza(cents.join(' '));
	assert.equal(c.ok, true);
	assertReadable(c, 'cents');
	const cx = cents.map((x) => Number(x.replace(',', '.')));
	const cm = cx.reduce((a, b) => a + b, 0) / 97;
	const cv = cx.reduce((a, x) => a + (x - cm) ** 2, 0) / 97;
	assert.match(c.copy, new RegExp(`varianza ${cv.toFixed(4).replace('.', ',')};`));
});
