// The proportions tool: the unknown in each place, decimals and fractions, zeros, and a brute-force check.
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
const { proporzione } = await jiti.import('../../src/lib/tools/proporzioni.ts');

const P = (a, b, c, d) => proporzione({ a, b, c, d });

test('the unknown in each of the four places', () => {
	assert.equal(P('x', '6', '10', '15').copy, '4');
	assert.equal(P('4', 'x', '10', '15').copy, '6');
	assert.equal(P('4', '6', 'x', '15').copy, '10');
	assert.equal(P('4', '6', '10', '').copy, '15');
	assert.equal(P('4', '6', '10', 'X').copy, '15');
	const o = P('4', '6', 'x', '15');
	assert.equal(o.result, '$x = 10$');
	assert.match(o.steps[0], /x\$ è un medio/);
	assert.match(o.steps[1], /6 \\cdot x = 4 \\cdot 15/);
	assert.match(o.steps[2], /\\dfrac\{4 \\cdot 15\}\{6\} = \\dfrac\{60\}\{6\} = 10/);
	assert.match(P('x', '6', '10', '15').steps[1], /6 \\cdot 10 = x \\cdot 15/);
});

test('decimals, fractions and periodic results', () => {
	assert.equal(P('2,5', '', '1/3', '4').copy, '30');
	assert.equal(P('1,2', '0,4', 'x', '2').copy, '6');
	const third = P('3', '7', '2', 'x');
	assert.equal(third.copy, '14/3');
	assert.match(third.result, /\\dfrac\{14\}\{3\} \\approx 4\{,\}6667/);
	assert.equal(P('-2', '5', 'x', '10').copy, '-4');
	assert.equal(P('0', '5', 'x', '7').copy, '0');
});

test('four terms: a check', () => {
	assert.match(P('3', '5', '6', '10').result, /è una proporzione/);
	assert.match(P('3', '5', '6', '11').result, /\\neq/);
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

test('every formula typesets', () => {
	for (const t of [['4', '6', 'x', '15'], ['x', '6', '10', '15'], ['2,5', '', '1/3', '4'], ['3', '7', '2', 'x'], ['-2', '5', 'x', '10'], ['3', '5', '6', '10'], ['3', '5', '6', '11'], ['1/2', 'x', '3/4', '0,2']]) assertTypesets(P(...t));
});
