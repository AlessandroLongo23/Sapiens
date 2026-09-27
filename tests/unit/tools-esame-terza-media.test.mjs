// The final mark of the terza media exam: the mean of the admission mark and the unrounded mean of the four tests,
// rounded up from 0.5 (D.Lgs. 62/2017 art. 8, DM 741/2017 art. 13).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { votoTerzaMedia } = await jiti.import('../../src/lib/tools/esame-terza-media.ts');

const v = (a, i, m, l, c) => votoTerzaMedia({ ammissione: String(a), italiano: String(i), matematica: String(m), lingue: String(l), colloquio: String(c) });

test('terza media: examples', () => {
	const o = v(8, 7, 8, 7, 8);
	assert.ok(o.ok, o.error);
	assert.equal(o.rows[0].value, '$8$ su $10$');
	assert.equal(o.rows[1].value, '$7{,}5$');
	assert.equal(o.copy, '8/10');
	// 7 and 6,5 give 6,75 → 7; 7 and 6,25 give 6,625 → 7; 7 and 5,75 give 6,375 → 6.
	assert.equal(v(7, 6, 7, 6, 7).copy, '7/10');
	assert.equal(v(7, 6, 6, 6, 7).copy, '7/10');
	assert.equal(v(7, 5, 6, 6, 6).copy, '6/10');
	// Exactly x,5 goes up: 6 and 5 → 5,5 → 6, passed.
	const half = v(6, 5, 5, 5, 5);
	assert.equal(half.copy, '6/10');
	assert.ok(!half.rows.some((r) => r.label === 'Esito'));
	const fail = v(5, 5, 5, 5, 5);
	assert.equal(fail.copy, '5/10');
	assert.match(fail.rows.at(-1).value, /non superato/);
	const top = v(10, 10, 9, 10, 10);
	assert.equal(top.copy, '10/10');
	assert.equal(top.rows.at(-1).label, 'Lode');
	assert.match(v(9, 9, 9, 9, 9).steps.at(-1).say, /già intero/);
});

test('terza media: every combination against the rule', () => {
	const marks = [1, 4, 5, 6, 7, 8, 9, 10];
	let n = 0;
	for (const a of marks)
		for (const i of marks)
			for (const m of marks)
				for (const l of [4, 6, 9])
					for (const c of [5, 8, 10]) {
						const exact = (a + (i + m + l + c) / 4) / 2;
						const want = Math.floor(exact + 0.5);
						const o = v(a, i, m, l, c);
						assert.equal(o.copy, `${want}/10`, `${a} ${i} ${m} ${l} ${c}`);
						assert.equal(o.rows.some((r) => r.label === 'Lode'), want === 10);
						if (n++ % 97 === 0) assertReadable(o);
					}
});

test('terza media: wrong input', () => {
	assert.match(v('', 7, 7, 7, 7).error, /ammissione/);
	assert.match(v(7, '', 7, 7, 7).error, /italiano/);
	assert.match(v(7, 7, 7, 7, '').error, /colloquio/);
	assert.match(v(7, '6,5', 7, 7, 7).error, /mezzi voti/);
	assert.match(v(11, 7, 7, 7, 7).error, /da 1 a 10/);
	assert.match(v(7, 7, 0, 7, 7).error, /da 1 a 10/);
	assertReadable(v(0, 7, 7, 7, 7));
});
