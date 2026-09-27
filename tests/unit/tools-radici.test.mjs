// The square and cube root tool: perfect powers, simplified radicals, decimals, and brute-force checks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { radice, simplifyRoot } = await jiti.import('../../src/lib/tools/radici.ts');

test('square roots', () => {
	const o = radice('72', 2);
	assert.deepEqual(o.rows, [
		{ label: 'Radice quadrata di 72', value: '$6\\sqrt{2}$' },
		{ label: 'Valore decimale, arrotondato', value: '$\\approx 8{,}4853$' }
	]);
	assert.equal(o.copy, '6√2 ≈ 8,4853');
	assert.deepEqual(o.steps[0].math, ['72 = \\hl{2^3 \\cdot 3^2}']);
	assert.deepEqual(o.steps[1].math, ['72 = \\hl{2^2} \\cdot 2 \\cdot \\hl{3^2}']);
	assert.deepEqual(o.steps[2].math, ['\\sqrt{72} = \\sqrt{\\hl{2^2} \\cdot 2 \\cdot \\hl{3^2}}', '= 2 \\cdot 3\\sqrt{2}', '= \\hl{6\\sqrt{2}}']);
	assert.deepEqual(o.steps[3].math, ['(6\\sqrt{2})^2 = 6^2 \\cdot 2', '= 36 \\cdot 2', '= 72']);
	assert.deepEqual(o.steps[4].math, ['8^2 = 64', '9^2 = 81']);
	assert.equal(o.steps[0].group, 'La forma semplificata');
	assert.equal(o.steps[4].group, 'Il valore decimale');
	assert.deepEqual(radice('144', 2).rows, [{ label: 'Radice quadrata di 144', value: '$12$' }]);
	assert.deepEqual(radice('144', 2).steps[1].math, ['\\sqrt{144} = \\sqrt{2^4 \\cdot 3^2}', '= 2^2 \\cdot 3', '= \\hl{12}']);
	assert.equal(radice('7', 2).copy, '√7 ≈ 2,6458');
	assert.match(radice('7', 2).steps[1].say, /non si semplifica/);
	assert.match(radice('7', 2).rows[0].label, /non si semplifica/);
	assert.equal(radice('1000000000000', 2).copy, '1 000 000');
	assert.equal(radice('0', 2).copy, '0');
	assert.equal(radice('1', 2).copy, '1');
	assert.equal(radice('50', 2).copy, '5√2 ≈ 7,0711');
	assert.equal(radice('20', 2).copy, '2√5 ≈ 4,4721');
});

test('cube roots', () => {
	assert.deepEqual(radice('27', 3).rows, [{ label: 'Radice cubica di 27', value: '$3$' }]);
	const minus = radice('-54', 3);
	assert.match(minus.steps[0].say, /segno meno/);
	assert.deepEqual(minus.steps.at(-1).math, ['\\sqrt[3]{-54} = \\hl{-3\\sqrt[3]{2}}', '\\approx -3{,}7798']);
	assert.deepEqual(radice('-8', 3).rows, [{ label: 'Radice cubica di -8', value: '$-2$' }]);
	assert.equal(radice('54', 3).copy, '3∛2 ≈ 3,7798');
	assert.equal(radice('-54', 3).copy, '-3∛2 ≈ -3,7798');
	assert.equal(radice('-8', 3).copy, '-2');
	assert.equal(radice('-1', 3).copy, '-1');
	assert.equal(radice('16', 3).copy, '2∛2 ≈ 2,5198');
	assert.equal(radice('36', 3).copy, '∛36 ≈ 3,3019');
	assert.equal(radice('1000000000000', 3).copy, '10 000');
});

test('wrong inputs', () => {
	const neg = radice('-4', 2);
	assert.equal(neg.ok, false);
	assert.match(neg.error, /numero negativo/);
	for (const s of ['', 'abc', '2,5', '1000000000001']) {
		assert.equal(radice(s, 2).ok, false, s);
		assert.equal(radice(s, 3).ok, false, s);
	}
});

test('brute force: k^i · r = n, r free of i-th powers, decimals right (1..5000)', () => {
	for (const index of [2, 3]) {
		for (let n = 1; n <= 5000; n++) {
			const { k, r } = simplifyRoot(n, index);
			assert.equal(k ** index * r, n, `${index} ${n}`);
			for (let p = 2; p ** index <= r; p++) assert.notEqual(r % p ** index, 0, `${index} ${n}`);
			const o = radice(String(n), index);
			assert.equal(o.ok, true);
			const root = index === 2 ? Math.sqrt(n) : Math.cbrt(n);
			if (r === 1) {
				assert.equal(o.copy, String(k).replace(/\B(?=(\d{3})+(?!\d))/g, k >= 10000 ? ' ' : ''));
				assert.equal(k, Math.round(root));
			} else {
				const approx = Number(o.copy.split('≈ ')[1].replace(/ /g, '').replace(',', '.'));
				assert.ok(Math.abs(approx - root) <= 0.00005 + 1e-9, `${index} ${n}: ${o.copy}`);
				assert.notEqual(Math.round(root) ** index, n);
			}
		}
	}
});

test('readable: every string typesets, every sentence is short', () => {
	for (const n of ['0', '1', '-1', '7', '72', '144', '-54', '-8', '-4', '360', '1000000000000', '999999999989', '', '2,5']) for (const i of [2, 3]) assertReadable(radice(n, i), `${i} ${n}`);
	for (const i of [2, 3]) for (let n = -1000; n <= 2000; n++) assertReadable(radice(String(n), i), `${i} ${n}`);
});

test('the whole numbers around the root are right', () => {
	for (const i of [2, 3])
		for (let n = 2; n <= 3000; n++) {
			const o = radice(String(n), i);
			const around = o.steps.find((s) => s.say.startsWith('Trova tra quali'));
			if (!around) continue;
			const [lo, hi] = around.math.map((l) => Number(l.split('^')[0]));
			assert.equal(hi, lo + 1);
			assert.ok(lo ** i < n && n < hi ** i, `${i} ${n}`);
		}
});
