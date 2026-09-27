// Scientific notation both ways, exact on digit strings, with the order of magnitude.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { notazioneScientifica } = await jiti.import('../../src/lib/tools/notazione-scientifica.ts');

const to = (n) => notazioneScientifica('a', { n });
const from = (m, e) => notazioneScientifica('da', { m, e });

/** "-12 345,670" → [sign, significant digits without trailing zeros, power of 10]: the exact value, comparable. */
function exact(text) {
	const neg = text.startsWith('-');
	const [int, frac = ''] = text.replace(/[-\s]/g, '').split(',');
	let digits = (int + frac).replace(/^0+/, '');
	let exp = 0 - frac.length || 0;
	while (digits.endsWith('0')) {
		digits = digits.slice(0, -1);
		exp++;
	}
	return digits ? [neg, digits, exp] : [false, '', 0];
}
/** "3,45 · 10^-4" → the same. */
function exactSci(copy) {
	const [m, e] = copy.split(' · 10^');
	const [neg, digits, exp] = exact(m);
	return [neg, digits, exp + Number(e)];
}

test('decimal to scientific notation', () => {
	const o = to('0,000345');
	assert.equal(o.copy, '3,45 · 10^-4');
	assert.deepEqual(o.rows.map((r) => r.value), ['$3{,}45 \\cdot 10^{-4}$', '$10^{-4}$']);
	assert.deepEqual(o.steps[0].math, ['0{,}000\\hl{3}45']);
	assert.match(o.steps[1].then, /\$4\$ posti verso destra/);
	assert.equal(to('384 400').copy, '3,844 · 10^5');
	assert.match(to('384 400').steps[1].then, /zeri alla fine/);
	assert.equal(to('45600').copy, '4,56 · 10^4');
	assert.equal(to('1.000.000').copy, '1 · 10^6');
	assert.equal(to('7').copy, '7 · 10^0');
	assert.equal(to('7').rows[1].value, '$10^{1}$');
	assert.equal(to('0,0020').copy, '2,0 · 10^-3');
	assert.match(to('0,0020').steps[1].then, /restano/);
	assert.equal(to('-0,05').copy, '-5 · 10^-2');
	assert.match(to('-0,05').rows[1].label, /valore assoluto/);
	assert.equal(to('0,000000000000000000016').copy, '1,6 · 10^-20');
	assert.equal(to('602200000000000000000000').copy, '6,022 · 10^23');
	assert.equal(to('12,5').copy, '1,25 · 10^1');
});

test('order of magnitude: under 5 the same power, from 5 the next', () => {
	assert.equal(to('4999').rows[1].value, '$10^{3}$');
	assert.equal(to('5000').rows[1].value, '$10^{4}$');
	assert.equal(to('0,00072').rows[1].value, '$10^{-3}$');
	assert.equal(to('0,00049').rows[1].value, '$10^{-4}$');
});

test('scientific notation to decimal', () => {
	const o = from('4,56', '4');
	assert.equal(o.copy, '45 600');
	assert.deepEqual(o.steps[0].math, ['4{,}56 \\cdot 10^{4} = \\hl{45\\,600}']);
	assert.equal(from('3,45', '-4').copy, '0,000345');
	assert.equal(from('1,6', '−19').copy, '0,00000000000000000016');
	assert.equal(from('2,5', '0').copy, '2,5');
	assert.equal(from('6,02', '23').rows[2 - 1].value, '$10^{24}$');
	// Not normalised: the first factor is fixed first.
	const n = from('25', '3');
	assert.equal(n.copy, '25 000');
	assert.equal(n.rows[1].value, '$2{,}5 \\cdot 10^{4}$');
	assert.match(n.steps[0].say, /non è tra/);
	assert.equal(from('0,5', '2').rows[1].value, '$5 \\cdot 10^{1}$');
	assert.equal(from('-7,1', '2').copy, '-710');
});

test('wrong inputs', () => {
	for (const n of ['', '0', '0,000', 'abc', '1,2,3', '1'.repeat(31)]) assert.equal(to(n).ok, false, n);
	for (const [m, e] of [['', '3'], ['4', ''], ['0', '3'], ['4', '2,5'], ['4', '41'], ['x', '2']]) assert.equal(from(m, e).ok, false, `${m} ${e}`);
});

test('there and back, exact (random numbers)', () => {
	let seed = 7;
	const rnd = (k) => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), seed % k);
	for (let i = 0; i < 3000; i++) {
		const int = rnd(3) === 0 ? '0' : String(rnd(10 ** (1 + rnd(8))));
		const frac = rnd(2) ? String(rnd(10 ** (1 + rnd(7)))).padStart(1 + rnd(9), '0') : '';
		const text = `${rnd(5) === 0 ? '-' : ''}${int}${frac ? `,${frac}` : ''}`;
		const o = to(text);
		if (/^-?[0,]*$/.test(text)) {
			assert.equal(o.ok, false);
			continue;
		}
		assert.equal(o.ok, true, text);
		assert.deepEqual(exactSci(o.copy), exact(text), text);
		const [m, e] = o.copy.split(' · 10^');
		assert.ok(/^-?[1-9](,\d+)?$/.test(m), `${text} → ${m}`);
		const back = from(m, e);
		assert.deepEqual(exact(back.copy), exact(text), `${text} back`);
		assertReadable(o, text);
		assertReadable(back, `${text} back`);
	}
});

test('readable', () => {
	for (const n of ['0,000345', '384 400', '7', '5000', '0,0020', '-0,05', '', '0']) assertReadable(to(n), n);
	for (const [m, e] of [['4,56', '4'], ['25', '3'], ['0,5', '-2'], ['2,5', '0'], ['', '']]) assertReadable(from(m, e), `${m} ${e}`);
});
