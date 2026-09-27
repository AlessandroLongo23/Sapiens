// The fraction that generates a decimal: the textbook rule, the reduction, and a check by long division.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { frazioneGeneratrice } = await jiti.import('../../src/lib/tools/frazione-generatrice.ts');

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** The first `n` decimals of a/b by long division. */
function decimals(a, b, n) {
	let r = a % b;
	let out = '';
	for (let i = 0; i < n; i++) {
		r *= 10;
		out += Math.floor(r / b);
		r %= b;
	}
	return out;
}

test('the examples of the lesson', () => {
	const cases = { '0,75': '3/4', '2,35': '47/20', '1,625': '13/8', '-0,08': '-2/25', '0,(3)': '1/3', '1,(45)': '16/11', '0,1(6)': '1/6', '0,25(3)': '19/75', '2,3(18)': '51/22' };
	for (const [x, f] of Object.entries(cases)) assert.equal(frazioneGeneratrice(x).copy, f, x);
});

test('the steps of a mixed periodic number', () => {
	const o = frazioneGeneratrice('0,1(6)');
	assert.deepEqual(o.rows, [
		{ label: 'Frazione generatrice di 0,1(6)', value: '$\\frac{1}{6}$' },
		{ label: 'Tipo di numero', value: 'decimale periodico misto' }
	]);
	assert.deepEqual(o.steps[0].table.rows, [['$0$', '$1$', '$6$']]);
	assert.deepEqual(o.steps[1].math, ['16 - 1 = \\hl{15}']);
	assert.deepEqual(o.steps[2].math, ['\\text{denominatore} = \\hl{90}']);
	assert.deepEqual(o.steps[3].math, ['0{,}1\\overline{6} = \\frac{16 - 1}{90}', '= \\frac{15}{90}', '= \\frac{15 : 15}{90 : 15}', '= \\hl{\\frac{1}{6}}']);
	assert.deepEqual(o.steps[4].math, ['\\frac{1}{6} = 0{,}1666\\ldots = \\hl{0{,}1\\overline{6}}']);
	assert.match(o.steps[4].then, /Ritrovi il numero/);
	assert.equal(frazioneGeneratrice('1,(45)').rows[1].value, 'decimale periodico semplice');
	assert.equal(frazioneGeneratrice('1,(45)').steps[0].table.rows[0][1], 'nessuno');
});

test('other ways of writing, special periods, integers', () => {
	assert.equal(frazioneGeneratrice('0,1\\overline{6}').copy, '1/6');
	assert.equal(frazioneGeneratrice('0.1(6)').copy, '1/6');
	assert.equal(frazioneGeneratrice(' 0,1 (6) ').copy, '1/6');
	assert.equal(frazioneGeneratrice(',(3)').copy, '1/3');
	assert.equal(frazioneGeneratrice('−0,(3)').copy, '-1/3');
	const nine = frazioneGeneratrice('0,(9)');
	assert.equal(nine.copy, '1');
	assert.match(nine.steps.at(-1).then, /stesso numero/);
	assert.equal(frazioneGeneratrice('0,5(0)').copy, '1/2');
	assert.equal(frazioneGeneratrice('0,1(66)').copy, '1/6');
	assert.match(frazioneGeneratrice('0,1(66)').steps.at(-1).then, /altro modo/);
	assert.equal(frazioneGeneratrice('3').copy, '3/1');
	assert.equal(frazioneGeneratrice('0,(0)').copy, '0');
	assert.equal(frazioneGeneratrice('0,(142857)').copy, '1/7');
});

test('wrong inputs', () => {
	for (const s of ['', 'abc', '1/3', '0,1(6', '0,1()', '0,1(6)7', '(3)', '0,1234567890(12)', '1,2,3']) assert.equal(frazioneGeneratrice(s).ok, false, s);
});

test('every periodic number up to 3 + 3 digits (brute force)', () => {
	let seed = 5;
	const rnd = (k) => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), seed % k);
	for (let i = 0; i < 4000; i++) {
		const int = String(rnd(4) ? rnd(10) : rnd(1000));
		const ante = rnd(2) ? String(rnd(10 ** (1 + rnd(3)))).padStart(1 + rnd(3), '0') : '';
		const period = String(rnd(10 ** (1 + rnd(3)))).padStart(1 + rnd(3), '0');
		const text = `${int},${ante}(${period})`;
		const o = frazioneGeneratrice(text);
		assert.equal(o.ok, true, text);
		const [a, b = 1] = o.copy.replace(/ /g, '').split('/').map(Number);
		assert.equal(gcd(a, b), a === 0 ? b : 1, `${text}: reduced`);
		assert.equal(Math.floor(a / b) === Number(int) || /^9+$/.test(period), true, `${text}: integer part`);
		// Long division gives back the digits, except when the period is all nines (0,(9) = 1).
		if (!/^9+$/.test(period)) {
			const want = (ante + period.repeat(12)).slice(0, 12);
			assert.equal(`${Math.floor(a / b)},${decimals(a, b, 12)}`, `${Number(int)},${want}`, text);
		} else assert.ok(Math.abs(a / b - Number(`${int}.${ante}${period.repeat(6)}`)) < 1e-9, text);
		if (i % 5 === 0) assertReadable(o, text);
	}
	for (let i = 0; i < 1000; i++) {
		const ante = String(rnd(10 ** (1 + rnd(5))));
		const text = `${rnd(100)},${ante}`;
		const [a, b = 1] = frazioneGeneratrice(text).copy.replace(/ /g, '').split('/').map(Number);
		assert.ok(Math.abs(a / b - Number(text.replace(',', '.'))) < 1e-12, text);
		assert.equal(gcd(a, b), a === 0 ? b : 1);
	}
});

test('readable', () => {
	for (const s of ['0,75', '-0,08', '0,(3)', '1,(45)', '0,1(6)', '2,3(18)', '0,(9)', '0,5(0)', '3', '0,(0)', '-0,(3)', '1234,56(789)', '', 'x']) assertReadable(frazioneGeneratrice(s), s);
});
