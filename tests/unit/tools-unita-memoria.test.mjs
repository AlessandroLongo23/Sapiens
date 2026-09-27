// Units of memory: bit, byte, the decimal multiples (1000) and the binary ones (1024), exact where they can be.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { unitaMemoria, MEM_UNITS } = await jiti.import('../../src/lib/tools/unita-memoria.ts');

const BITS = { bit: 1, B: 8, kB: 8e3, MB: 8e6, GB: 8e9, TB: 8e12, KiB: 8 * 2 ** 10, MiB: 8 * 2 ** 20, GiB: 8 * 2 ** 30, TiB: 8 * 2 ** 40 };
/** "1,13687 · 10⁻¹³ GiB" → a number. */
function read(copy) {
	const [num] = copy.split(/ (?=[a-zA-Z]+$)/);
	const sup = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
	const m = /^(.*) · 10(.*)$/.exec(num);
	const plain = (s) => Number(s.replace(/ /g, '').replace(',', '.'));
	if (!m) return plain(num);
	return plain(m[1]) * 10 ** Number([...m[2]].map((c) => sup[c]).join(''));
}

test('within a family, and across', () => {
	const cases = [
		['2,5', 'GB', 'MB', '2500 MB'],
		['8', 'bit', 'B', '1 B'],
		['1', 'GiB', 'bit', '8 589 934 592 bit'],
		['100', 'MiB', 'MB', '104,8576 MB'],
		['5', 'KB', 'KiB', '4,8828125 KiB'],
		['1', 'TiB', 'B', '1 099 511 627 776 B'],
		['500', 'GB', 'GiB', '465,661 GiB'],
		['1', 'TB', 'GiB', '931,323 GiB'],
		['1', 'bit', 'TiB', '1,13687 · 10⁻¹³ TiB'],
		['0', 'GB', 'MB', '0 MB'],
		['3', 'MB', 'MB', '3 MB']
	];
	for (const [n, a, b, copy] of cases) {
		const o = unitaMemoria(n, a, b);
		assert.equal(o.copy, copy, `${n} ${a} → ${b}`);
		assertReadable(o, `${n} ${a} → ${b}`);
	}
	const cross = unitaMemoria('500', 'GB', 'GiB');
	assert.equal(cross.steps.length, 5);
	assert.match(cross.steps[0].then, /1024/);
	assert.equal(cross.rows[0].value, '$\\approx 465{,}661\\ \\text{GiB}$');
	assert.match(unitaMemoria('1', 'MiB', 'KiB').steps[0].then, /IEC/);
});

test('wrong inputs', () => {
	for (const [n, a, b] of [
		['abc', 'GB', 'MB'],
		['-3', 'GB', 'MB'],
		['1', 'PB', 'MB'],
		['1e20', 'GB', 'MB'],
		['10000000000000000', 'GB', 'MB']
	]) {
		const o = unitaMemoria(n, a, b);
		assert.equal(o.ok, false, n);
		assertReadable(o, n);
	}
});

test('every pair of units, against floating point', () => {
	for (const a of MEM_UNITS)
		for (const b of MEM_UNITS)
			for (const n of ['1', '3', '2,5', '1024', '0,125', '750']) {
				const o = unitaMemoria(n, a.id, b.id);
				const x = Number(n.replace(',', '.'));
				const expected = (x * BITS[a.id]) / BITS[b.id];
				const got = read(o.copy);
				assert.ok(Math.abs(got - expected) <= Math.abs(expected) * 1e-5, `${n} ${a.id} → ${b.id}: ${o.copy} vs ${expected}`);
				if (n === '3') assertReadable(o, `${a.id} → ${b.id}`);
			}
});
