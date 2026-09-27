// The Pythagorean theorem: hypotenuse and legs, exact radicals, triples, and wrong inputs.
// Run with `node --test tests/unit/tools-pitagora.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { pitagora } = await jiti.import('../../src/lib/tools/pitagora.ts');

/** The number in the copy text: the decimal after "≈" when there is one. */
const value = (copy) => {
	const last = copy.includes('≈') ? copy.slice(copy.lastIndexOf('≈') + 1) : copy.slice(copy.indexOf('=') + 1);
	return Number(last.replace(/ (mm|cm|dm|m|km)$/, '').replace(/\s/g, '').replace(',', '.'));
};
const close = (a, b) => assert.ok(Math.abs(a - b) <= 1e-4 * Math.max(1, b), `${a} ≠ ${b}`);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

test('hypotenuse from the legs, and back to a leg', () => {
	for (let a = 1; a <= 30; a++)
		for (let b = 1; b <= 30; b++) {
			const res = pitagora({ mode: 'ipotenusa', a: String(a), b: String(b) });
			assert.ok(res.outcome.ok);
			const i = Math.hypot(a, b);
			close(value(res.outcome.copy), i);
			const whole = Number.isInteger(i);
			assert.equal(/terna pitagorica/.test(res.outcome.steps.join(' ')), whole, `${a}, ${b}`);
			if (whole) {
				assert.equal(res.outcome.copy, `i = ${i}`);
				assert.equal(/primitiva, perché/.test(res.outcome.steps.join(' ')), gcd(gcd(a, b), i) === 1);
				const back = pitagora({ mode: 'cateto', a: String(i), b: String(a) });
				assert.equal(back.outcome.copy, `c2 = ${b}`);
			} else {
				// The hypotenuse rounded to four decimals gives the leg back to within a hundredth.
				const leg = value(pitagora({ mode: 'cateto', a: i.toFixed(4).replace('.', ','), b: String(a) }).outcome.copy);
				assert.ok(Math.abs(leg - b) < 1e-2, `${leg} ≠ ${b}`);
			}
		}
});

test('exact forms: simplified radicals and decimals', () => {
	const r = pitagora({ mode: 'ipotenusa', a: '5', b: '5', unit: 'cm' }).outcome;
	assert.equal(r.copy, 'i = 5√2 cm ≈ 7,0711 cm');
	assert.match(r.steps.join(' '), /\\sqrt\{5\^2 \\cdot 2\}/);
	assert.equal(pitagora({ mode: 'ipotenusa', a: '1,5', b: '2' }).outcome.copy, 'i = 2,5');
	assert.equal(pitagora({ mode: 'ipotenusa', a: '1', b: '0,5' }).outcome.copy, 'i = √5/2 ≈ 1,118');
	assert.equal(pitagora({ mode: 'cateto', a: '3', b: '2' }).outcome.copy, 'c2 = √5 ≈ 2,2361');
	assert.equal(pitagora({ mode: 'cateto', a: '6', b: '3' }).outcome.copy, 'c2 = 3√3 ≈ 5,1962');
	assert.match(pitagora({ mode: 'ipotenusa', a: '6', b: '8' }).outcome.steps.join(' '), /multipla per 2 della terna primitiva \$3, 4, 5\$/);
});

test('the hypotenuse must be the longest side; wrong inputs', () => {
	assert.match(pitagora({ mode: 'cateto', a: '5', b: '7' }).outcome.error, /lato più lungo/);
	assert.match(pitagora({ mode: 'cateto', a: '5', b: '5' }).outcome.error, /uguale/);
	assert.equal(pitagora({ mode: 'ipotenusa', a: '0', b: '4' }).outcome.ok, false);
	assert.equal(pitagora({ mode: 'ipotenusa', a: '-3', b: '4' }).outcome.ok, false);
	assert.equal(pitagora({ mode: 'ipotenusa', a: '3', b: '' }).outcome.ok, false);
	assert.equal(pitagora({ mode: 'ipotenusa', a: 'x', b: '4' }).outcome.ok, false);
	assert.ok(pitagora({ mode: 'ipotenusa', a: '99999,9999', b: '99999,9997' }).outcome.ok);
});
