// The proportions tool: the unknown in each place, decimals and fractions, zeros, and a brute-force check.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { proporzione } = await jiti.import('../../src/lib/tools/proporzioni.ts');

const P = (a, b, c, d) => proporzione({ a, b, c, d });

test('the unknown in each of the four places', () => {
	assert.equal(P('x', '6', '10', '15').copy, '4');
	assert.equal(P('4', 'x', '10', '15').copy, '6');
	assert.equal(P('4', '6', 'x', '15').copy, '10');
	assert.equal(P('4', '6', '10', '').copy, '15');
	assert.equal(P('4', '6', '10', 'X').copy, '15');
	const o = P('4', '6', 'x', '15');
	assert.deepEqual(o.rows, [
		{ label: 'Termine incognito', value: '$x = 10$' },
		{ label: 'La proporzione completa', value: '$4 : 6 = 10 : 15$' }
	]);
	assert.match(o.steps[0].then, /x\$ è un medio/);
	assert.deepEqual(o.steps[0].math, ['4 : 6 = \\hl{x} : 15']);
	assert.deepEqual(o.steps[0].table.rows[2], ['terzo', '$x$', 'medio']);
	assert.deepEqual(o.steps[1].math, ['6 \\cdot x = 4 \\cdot 15', '6 \\cdot x = \\hl{60}']);
	assert.deepEqual(o.steps[2].math, ['x = \\dfrac{60}{6}', 'x = \\hl{10}']);
	assert.deepEqual(o.steps[3].math, ['4 : 6 = \\dfrac{2}{3} \\approx 0{,}6667', '\\hl{10} : 15 = \\dfrac{2}{3} \\approx 0{,}6667']);
	assert.deepEqual(P('x', '6', '10', '15').steps[1].math, ['6 \\cdot 10 = x \\cdot 15', '\\hl{60} = x \\cdot 15']);
});

test('decimals, fractions and periodic results', () => {
	assert.equal(P('2,5', '', '1/3', '4').copy, '30');
	assert.equal(P('1,2', '0,4', 'x', '2').copy, '6');
	const third = P('3', '7', '2', 'x');
	assert.equal(third.copy, '14/3');
	assert.match(third.rows[0].value, /\\dfrac\{14\}\{3\} \\approx 4\{,\}6667/);
	assert.deepEqual(third.steps[2].math.slice(1), ['x = \\hl{\\dfrac{14}{3}}', 'x \\approx 4{,}6667']);
	assert.equal(P('-2', '5', 'x', '10').copy, '-4');
	assert.equal(P('0', '5', 'x', '7').copy, '0');
});

test('four terms: a check', () => {
	const yes = P('3', '5', '6', '10');
	assert.match(yes.rows[0].label, /formano una proporzione/);
	assert.deepEqual(yes.steps[1].math, ['5 \\cdot 6 = \\hl{30}', '3 \\cdot 10 = \\hl{30}']);
	const no = P('3', '5', '6', '11');
	assert.match(no.rows[0].label, /non formano/);
	assert.match(no.rows[0].value, /\\neq/);
});

test('zeros and wrong inputs', () => {
	assert.equal(P('3', '0', 'x', '4').ok, false);
	assert.equal(P('3', '4', 'x', '0').ok, false);
	assert.equal(P('0', '5', '3', 'x').ok, false);
	assert.equal(P('3', '5', '0', 'x').ok, false);
	assert.equal(P('0', 'x', '3', '4').ok, false);
	assert.equal(P('x', '', '3', '4').ok, false);
	assert.equal(P('a', '5', '3', 'x').ok, false);
	assert.equal(P('2/0', '5', '3', 'x').ok, false);
});

test('brute force: x makes the products of means and extremes equal', () => {
	const vals = [-3, -1, 1, 2, 3, 5, 7, 12];
	const places = ['a', 'b', 'c', 'd'];
	for (const a of vals)
		for (const b of vals)
			for (const c of vals)
				for (const place of places) {
					const [x, y, z] = [a, b, c];
					const input = {};
					const others = places.filter((p) => p !== place);
					input[others[0]] = String(x);
					input[others[1]] = String(y);
					input[others[2]] = String(z);
					input[place] = 'x';
					const o = proporzione(input);
					assert.equal(o.ok, true, JSON.stringify(input));
					const [num, den = '1'] = o.copy.includes('/') ? o.copy.split('/') : [o.copy.replace(',', '.')];
					const v = { ...input, [place]: Number(num) / Number(den) };
					const [A, B, C, D] = places.map((p) => Number(v[p]));
					assert.ok(Math.abs(B * C - A * D) < 1e-9 * Math.max(1, Math.abs(B * C)), JSON.stringify({ input, copy: o.copy }));
				}
});

test('readable: every string typesets, every sentence is short', () => {
	for (const t of [['4', '6', 'x', '15'], ['x', '6', '10', '15'], ['2,5', '', '1/3', '4'], ['3', '7', '2', 'x'], ['-2', '5', 'x', '10'], ['3', '5', '6', '10'], ['3', '5', '6', '11'], ['1/2', 'x', '3/4', '0,2'], ['x', 'x', '1', '2'], ['3', '0', 'x', '4']]) assertReadable(P(...t), t.join(' '));
	const vals = ['-3', '1/2', '2,5', '7', '0'];
	for (const a of vals) for (const b of vals) for (const c of vals) for (const place of ['a', 'b', 'c', 'd']) {
		const t = { a, b, c, d: '4' };
		t[place] = 'x';
		assertReadable(proporzione(t), JSON.stringify(t));
	}
});
