// The Pythagorean theorem: hypotenuse and legs, exact radicals, triples, and wrong inputs.
// Run with `node --test tests/unit/tools-pitagora.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { checkReadable, stepsText } from './geometry-readability.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { pitagora } = await jiti.import('../../src/lib/tools/pitagora.ts');

/** The number in the copy text: the decimal after "≈" when there is one. */
const value = (copy) => {
	const last = copy.includes('≈') ? copy.slice(copy.lastIndexOf('≈') + 1) : copy.slice(copy.indexOf('=') + 1);
	return Number(last.replace(/ (mm|cm|dm|m|km)$/, '').replace(/\s/g, '').replace(',', '.'));
};
// Results are rounded to two decimals, as at school; exact forms (5√2) are checked on their own.
const close = (a, b) => assert.ok(Math.abs(a - b) <= 5e-3 + 1e-9 * b, `${a} ≠ ${b}`);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

test('hypotenuse from the legs, and back to a leg', () => {
	for (let a = 1; a <= 30; a++)
		for (let b = 1; b <= 30; b++) {
			const res = pitagora({ mode: 'ipotenusa', a: String(a), b: String(b) });
			assert.ok(res.outcome.ok);
			const i = Math.hypot(a, b);
			close(value(res.outcome.copy), i);
			const whole = Number.isInteger(i);
			assert.equal(/terna pitagorica/.test(stepsText(res.outcome)), whole, `${a}, ${b}`);
			if (whole) {
				assert.equal(res.outcome.copy, `i = ${i}`);
				assert.equal(/È una terna primitiva/.test(stepsText(res.outcome)), gcd(gcd(a, b), i) === 1);
				const back = pitagora({ mode: 'cateto', a: String(i), b: String(a) });
				assert.equal(back.outcome.copy, `c2 = ${b}`);
			} else {
				// The hypotenuse rounded to four decimals gives the leg back to within two hundredths.
				const leg = value(pitagora({ mode: 'cateto', a: i.toFixed(4).replace('.', ','), b: String(a) }).outcome.copy);
				assert.ok(Math.abs(leg - b) < 2e-2, `${leg} ≠ ${b}`);
			}
		}
});

test('exact forms: simplified radicals and decimals', () => {
	const r = pitagora({ mode: 'ipotenusa', a: '5', b: '5', unit: 'cm' }).outcome;
	assert.equal(r.copy, 'i = 5√2 cm ≈ 7,07 cm');
	assert.deepEqual(r.rows, [{ label: 'Ipotenusa', value: '$i = 5\\sqrt{2}\\,\\text{cm}$ $\\approx 7{,}07\\,\\text{cm}$' }]);
	assert.deepEqual(r.steps[2].math, ['i = \\sqrt{50}', '= \\sqrt{5^2 \\cdot 2}', '= \\hl{5\\sqrt{2}\\,\\text{cm}}', '\\approx 7{,}07\\,\\text{cm}']);
	assert.equal(pitagora({ mode: 'ipotenusa', a: '1,5', b: '2' }).outcome.copy, 'i = 2,5');
	assert.equal(pitagora({ mode: 'ipotenusa', a: '1', b: '0,5' }).outcome.copy, 'i = √5/2 ≈ 1,12');
	const five = pitagora({ mode: 'cateto', a: '3', b: '2' }).outcome;
	assert.equal(five.copy, 'c2 = √5 ≈ 2,24');
	// A root that stays a root is written once.
	assert.deepEqual(five.steps[3].math, ['c_2 = \\hl{\\sqrt{5}}', '\\approx 2{,}24']);
	assert.equal(pitagora({ mode: 'cateto', a: '6', b: '3' }).outcome.copy, 'c2 = 3√3 ≈ 5,20');
	const triple = pitagora({ mode: 'ipotenusa', a: '6', b: '8' }).outcome.steps.at(-1);
	assert.deepEqual(triple.table.rows, [
		['questa', '$6$', '$8$', '$10$'],
		['primitiva', '$3$', '$4$', '$5$']
	]);
	assert.match(triple.then, /moltiplicata per 2/);
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

test('readable: every string goes through KaTeX, one calculation per line, short sentences', () => {
	for (const mode of ['ipotenusa', 'cateto'])
		for (const [a, b] of [
			['6', '8'],
			['13', '5'],
			['5', '5'],
			['3', '2'],
			['1', '0,5'],
			['7,5', '4,5'],
			['99999,9999', '99999,9997']
		])
			for (const unit of ['cm', '']) {
				const res = pitagora({ mode, a, b, unit });
				if (res.outcome.ok) checkReadable(res.outcome, `${mode} ${a} ${b} ${unit}`);
			}
	for (const [a, b] of [
		['5', '7'],
		['5', '5']
	])
		assert.match(pitagora({ mode: 'cateto', a, b }).outcome.error, /per esempio/i);
});
