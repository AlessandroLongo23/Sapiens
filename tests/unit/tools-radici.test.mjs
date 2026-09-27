// The square and cube root tool: perfect powers, simplified radicals, decimals, and brute-force checks.
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
const { radice, simplifyRoot } = await jiti.import('../../src/lib/tools/radici.ts');

test('square roots', () => {
	const o = radice('72', 2);
	assert.equal(o.result, '$\\sqrt{72} = 6\\sqrt{2} \\approx 8{,}4853$');
	assert.equal(o.copy, '6√2 ≈ 8,4853');
	assert.match(o.steps.join(' '), /72 = 2\^3 \\cdot 3\^2/);
	assert.match(o.steps.join(' '), /\(6\\sqrt\{2\}\)\^2 = 6\^2 \\cdot 2 = 36 \\cdot 2 = 72/);
	assert.equal(radice('144', 2).result, '$\\sqrt{144} = 12$');
	assert.equal(radice('7', 2).copy, '√7 ≈ 2,6458');
	assert.match(radice('7', 2).steps.join(' '), /non si semplifica/);
	assert.equal(radice('1000000000000', 2).copy, '1 000 000');
	assert.equal(radice('0', 2).copy, '0');
	assert.equal(radice('1', 2).copy, '1');
	assert.equal(radice('50', 2).copy, '5√2 ≈ 7,0711');
	assert.equal(radice('20', 2).copy, '2√5 ≈ 4,4721');
});

test('cube roots', () => {
	assert.equal(radice('27', 3).result, '$\\sqrt[3]{27} = 3$');
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

test('every formula typesets', () => {
	for (const n of ['0', '1', '7', '72', '144', '-54', '-8', '360', '1000000000000', '999999999989']) for (const i of [2, 3]) assertTypesets(radice(n, i));
});
