// Roman numerals both ways, 1 to 3999, checked against the greedy algorithm, and the invalid numerals rejected.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { numeriRomani } = await jiti.import('../../src/lib/tools/numeri-romani.ts');

const TABLE = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
function greedy(n) {
	let out = '';
	for (const [v, s] of TABLE) while (n >= v) {
		out += s;
		n -= v;
	}
	return out;
}

test('from a number to a Roman numeral', () => {
	const o = numeriRomani('1994');
	assert.equal(o.copy, 'MCMXCIV');
	assert.equal(o.rows[0].label, '1994 in numeri romani');
	assert.deepEqual(o.steps[0].table.rows.map((r) => r[1]), ['$1000$', '$900$', '$90$', '$4$']);
	assert.deepEqual(o.steps[1].table.head, ['Simbolo', ...'IVXCM'.split('').map((c) => `$\\mathrm{${c}}$`)]);
	assert.deepEqual(o.steps[2].table.rows[1], ['$900$', '$\\mathrm{CM}$', '$1000 - 100 = \\hl{900}$']);
	assert.match(o.steps[2].then, /\$3\$ sottrazioni/);
	assert.match(numeriRomani('2026').steps[2].then, /non ci sono sottrazioni/);
	assert.equal(numeriRomani('3999').copy, 'MMMCMXCIX');
	assert.equal(numeriRomani('1').copy, 'I');
	assert.equal(numeriRomani('3.888').copy, 'MMMDCCCLXXXVIII');
});

test('from a Roman numeral to a number', () => {
	const o = numeriRomani('mcmxciv');
	assert.equal(o.copy, '1994');
	assert.equal(o.rows[0].label, 'MCMXCIV in numeri arabi');
	assert.deepEqual(o.steps[2].math, ['\\mathrm{MCMXCIV} = 1000 + 900 + 90 + 4 = \\hl{1994}']);
	assert.equal(numeriRomani('XLII').copy, '42');
	assert.equal(numeriRomani('  dcclxxvii ').copy, '777');
});

test('numerals that break the rules', () => {
	const cases = { IIII: /tre volte.*IV/, VV: /V, L e D/, IC: /si sottraggono solo.*XCIX/, VX: /si sottraggono solo/, IIV: /dal più grande/, XM: /si sottraggono solo/, MMMM: /tre volte/ };
	for (const [s, re] of Object.entries(cases)) {
		const o = numeriRomani(s);
		assert.equal(o.ok, false, s);
		assert.match(o.error, re, s);
	}
	for (const s of ['', '0', '4000', '12a', 'ABC', 'MMMMMMMMMMMMMMMM', '-5', '2,5']) assert.equal(numeriRomani(s).ok, false, s);
});

test('both ways for every number from 1 to 3999', () => {
	const seen = new Set();
	for (let n = 1; n <= 3999; n++) {
		const r = numeriRomani(String(n));
		assert.equal(r.copy, greedy(n), String(n));
		assert.equal(numeriRomani(r.copy).copy, String(n), r.copy);
		seen.add(r.copy);
		if (n % 7 === 0) {
			assertReadable(r, String(n));
			assertReadable(numeriRomani(r.copy), r.copy);
		}
	}
	assert.equal(seen.size, 3999);
	// Every string of up to 4 symbols is accepted only if it is the canonical numeral of its value.
	const letters = 'IVXLCDM';
	const all = [''];
	for (let len = 1; len <= 4; len++)
		for (const prefix of all.filter((s) => s.length === len - 1))
			for (const c of letters) {
				const s = prefix + c;
				all.push(s);
				const o = numeriRomani(s);
				assert.equal(o.ok, seen.has(s), s);
				if (!o.ok) assertReadable(o, s);
			}
});
