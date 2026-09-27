// Media, mediana e moda: the calculator's pure logic.
// Run with `node --test tests/unit/tools-media-mediana-moda.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { medie, stats, splitList } = await jiti.import('../../src/lib/tools/media-mediana-moda.ts');
const { parseDecimal } = await jiti.import('../../src/lib/tools/numbers.ts');

const simple = (s) => medie('semplice', s);
const all = (o) => o.steps.join(' ');

test('lists as students write them', () => {
	assert.deepEqual(splitList('7,5; 8 6'), ['7,5', '8', '6']);
	assert.deepEqual(splitList('4, 5, 6'), ['4', '5', '6']);
	assert.deepEqual(splitList('  3,25 ;4  '), ['3,25', '4']);
	assert.deepEqual(splitList(''), []);
});

test('odd count: the value in the middle', () => {
	const o = simple('9 3 7 1 5');
	assert.equal(o.ok, true);
	assert.equal(o.copy, 'media 5; mediana 5; moda nessuna; campo di variazione 8');
	assert.match(all(o), /1;\\ 3;\\ 5;\\ 7;\\ 9/);
	assert.match(all(o), /dispari/);
	assert.match(all(o), /\\dfrac\{5 \+ 1\}\{2\} = 3/);
});

test('even count: the mean of the two in the middle', () => {
	const o = simple('12; 7; 15; 9; 7; 20; 11; 14');
	assert.equal(o.copy, 'media 11,875; mediana 11,5; moda 7; campo di variazione 13');
	assert.match(all(o), /pari/);
	assert.match(all(o), /\\dfrac\{11 \+ 12\}\{2\} = 11\{,\}5/);
	// Two equal values in the middle.
	const same = simple('4 6 6 9');
	assert.match(same.copy, /mediana 6;/);
	assert.match(all(same), /sono uguali/);
});

test('mode: none, one, two, many', () => {
	assert.match(simple('1 2 3 4').copy, /moda nessuna/);
	assert.match(all(simple('1 2 3 4')), /non ha moda/);
	// Every value twice: still no mode.
	assert.match(simple('2 2 5 5').copy, /moda nessuna/);
	assert.match(simple('3 5 3 8').copy, /moda 3;/);
	const bi = simple('3 5 3 5 8');
	assert.match(bi.copy, /mode 3 e 5;/);
	assert.match(all(bi), /bimodale/);
	assert.match(bi.result, /mode \$3\$ e \$5\$/);
	const tri = simple('1 1 2 2 3 3 4');
	assert.match(tri.copy, /mode 1, 2 e 3;/);
	assert.match(all(tri), /sono tutti mode/);
	// Decimal values compare by value: 2,5 and 2,50 are the same.
	assert.match(simple('2,5 2,50 3').copy, /moda 2,5;/);
});

test('decimals, negatives, periodic means', () => {
	assert.equal(simple('1,5; 2,5; 4').copy, 'media 2,6667; mediana 2,5; moda nessuna; campo di variazione 2,5');
	assert.match(simple('1,5; 2,5; 4').result, /\\bar\{x\} \\approx 2\{,\}6667/);
	const neg = simple('-3 1 0 -2 4 5 2');
	assert.equal(neg.copy, 'media 1; mediana 1; moda nessuna; campo di variazione 8');
	assert.match(all(neg), /-3 \+ 1 \+ 0 \+ \(-2\)/);
	assert.match(all(neg), /5 - \(-3\) = 8/);
	assert.equal(simple('0,1 0,2').copy, 'media 0,15; mediana 0,15; moda nessuna; campo di variazione 0,1');
	assert.equal(simple('1.000 2.000').copy, 'media 1500; mediana 1500; moda nessuna; campo di variazione 1000');
});

test('weighted mean, two fields or pairs', () => {
	const o = medie('ponderata', '6 8 5', '2 2 1');
	assert.equal(o.copy, '6,6');
	assert.match(all(o), /6 \\cdot 2 \+ 8 \\cdot 2 \+ 5 \\cdot 1 = 33/);
	assert.match(all(o), /somma dei pesi/);
	assert.equal(medie('ponderata', '6:2 8:2 5:1').copy, '6,6');
	assert.equal(medie('ponderata', '7,5; 6', '30; 70').copy, '6,45');
	assert.equal(medie('ponderata', '1 2', '1 2').copy, '1,6667');
	assert.equal(medie('ponderata', '4 10', '0,5 1,5').copy, '8,5');
	// The weights field wins over pairs; equal weights give the simple mean.
	assert.equal(medie('ponderata', '3 5 10', '2 2 2').copy, '6');
});

test('wrong inputs fail with a sentence', () => {
	for (const o of [
		simple(''),
		simple('5'),
		simple('3 x 4'),
		medie('ponderata', '6 8', ''),
		medie('ponderata', '6 8', '1'),
		medie('ponderata', '6 8', '1 0'),
		medie('ponderata', '6 8', '1 -2'),
		medie('ponderata', '6:1 8'),
		medie('ponderata', '6:1:2 8:1'),
		simple(Array.from({ length: 101 }, () => '1').join(' '))
	]) {
		assert.equal(o.ok, false);
		assert.equal(typeof o.error, 'string');
		assert.ok(o.error.length > 10);
	}
	assert.match(medie('ponderata', '6 8', '1').error, /2 valori e 1 peso/);
	// Too many digits for exact arithmetic: a sentence, not an exception.
	assert.equal(simple('0,1234567 0,7654321 0,1111113 0,98765432109').ok, false);
});

test('checked against floating point on random lists', () => {
	let seed = 7;
	const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
	for (let i = 0; i < 400; i++) {
		const n = 2 + Math.floor(rnd() * 12);
		const xs = Array.from({ length: n }, () => Math.floor(rnd() * 21) - 5 + (rnd() < 0.3 ? 0.5 : 0));
		const s = stats(xs.map((x) => parseDecimal(String(x))));
		const sorted = [...xs].sort((a, b) => a - b);
		const mean = xs.reduce((a, b) => a + b, 0) / n;
		const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
		const counts = new Map();
		for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
		const top = Math.max(...counts.values());
		const modes = [...counts.values()].every((c) => c === top) ? [] : [...counts.keys()].filter((k) => counts.get(k) === top).sort((a, b) => a - b);
		const num = (r) => r.num / r.den;
		assert.ok(Math.abs(num(s.mean) - mean) < 1e-9);
		assert.equal(num(s.median), median);
		assert.deepEqual(s.modes.map(num), modes);
		assert.equal(num(s.range), sorted[n - 1] - sorted[0]);
		// The tool's text agrees with the numbers.
		assert.equal(simple(xs.map((x) => String(x).replace('.', ',')).join(' ')).ok, true);
	}
});
