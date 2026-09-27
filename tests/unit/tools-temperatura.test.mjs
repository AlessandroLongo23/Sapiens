// Temperatures between Celsius, Fahrenheit and Kelvin, in exact arithmetic.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { temperatura, convertTemperature } = await jiti.import('../../src/lib/tools/temperatura.ts');
const { parseDecimal } = await jiti.import('../../src/lib/tools/numbers.ts');
const { assertReadable, stepText } = await import('./converters-check.mjs');

const copy = (v, a, b) => {
	const o = temperatura(v, a, b);
	assert.ok(o.ok, o.error);
	return o.copy;
};

test('known values', () => {
	assert.equal(copy('100', 'C', 'F'), '212 °F');
	assert.equal(copy('0', 'C', 'F'), '32 °F');
	assert.equal(copy('-40', 'C', 'F'), '-40 °F');
	assert.equal(copy('-40', 'F', 'C'), '-40 °C');
	assert.equal(copy('37', 'C', 'F'), '98,6 °F');
	assert.equal(copy('98,6', 'F', 'C'), '37 °C');
	assert.equal(copy('0', 'K', 'C'), '-273,15 °C');
	assert.equal(copy('0', 'K', 'F'), '-459,67 °F');
	assert.equal(copy('-273,15', 'C', 'K'), '0 K');
	assert.equal(copy('20', 'C', 'K'), '293,15 K');
	assert.equal(copy('212', 'F', 'K'), '373,15 K');
	assert.equal(copy('100', 'F', 'C'), '37,78 °C');
	assert.equal(copy('25', 'C', 'C'), '25 °C');
	assert.match(temperatura('100', 'F', 'C').rows[0].value, /\\approx/);
});

test('steps use the formulas', () => {
	const o = temperatura('100', 'C', 'F');
	const s = stepText(o);
	assert.match(s, /T_F = T_C \\cdot \\dfrac\{9\}\{5\} \+ 32/);
	assert.match(s, /T_F = \\hl\{180\} \+ 32/);
	assert.match(s, /T_F = \\hl\{212\}/);
	assert.match(s, /373\{,\}15/);
	// One row per scale: the one asked for first, then the third.
	assert.deepEqual(
		o.rows.map((r) => r.label),
		['100 °C in gradi Fahrenheit', '100 °C in kelvin']
	);
	assert.equal(o.rows[1].value, '$373{,}15\\,\\text{K}$');
	const fk = temperatura('212', 'F', 'K');
	assert.match(fk.steps[0].say, /Passa per i gradi Celsius/);
	assert.deepEqual(
		fk.steps.filter((x) => x.group).map((x) => x.group),
		['Da Fahrenheit a Celsius', 'Da Celsius a Kelvin']
	);
	assert.equal(temperatura('25', 'C', 'C').rows.length, 1);
});

test('every string typesets and every sentence is short', () => {
	for (const v of ['100', '-40', '0', '36,6', '98,6', '-273,15', '1000000', '0,01'])
		for (const a of ['C', 'F', 'K']) for (const b of ['C', 'F', 'K']) assertReadable(temperatura(v, a, b), `${v} ${a} → ${b}`);
	for (const bad of [temperatura('abc', 'C', 'F'), temperatura('-300', 'C', 'F'), temperatura('10', 'C', 'X')]) assertReadable(bad);
});

test('below absolute zero is an error in words', () => {
	for (const [v, s] of [['-273,16', 'C'], ['-1', 'K'], ['-460', 'F']]) {
		const o = temperatura(v, s, 'C');
		assert.equal(o.ok, false);
		assert.match(o.error, /zero assoluto/);
	}
	assert.equal(temperatura('-459,67', 'F', 'K').copy, '0 K');
	assert.equal(temperatura('abc', 'C', 'F').ok, false);
	assert.equal(temperatura('10', 'C', 'X').ok, false);
});

test('round trips on every pair of scales are exact', () => {
	const scales = ['C', 'F', 'K'];
	for (let i = 0; i < 300; i++) {
		const v = `${Math.floor(Math.random() * 2000)},${Math.floor(Math.random() * 100)}`;
		const x = parseDecimal(v);
		for (const a of scales)
			for (const b of scales) {
				const back = convertTemperature(convertTemperature(x, a, b), b, a);
				assert.ok(back.equals(x), `${v} ${a} → ${b} → ${a}`);
				// Against floating point.
				const c = a === 'C' ? x.num / x.den : a === 'K' ? x.num / x.den - 273.15 : ((x.num / x.den - 32) * 5) / 9;
				const want = b === 'C' ? c : b === 'K' ? c + 273.15 : (c * 9) / 5 + 32;
				const got = convertTemperature(x, a, b);
				assert.ok(Math.abs(got.num / got.den - want) < 1e-9);
			}
	}
});
