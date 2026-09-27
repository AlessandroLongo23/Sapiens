// The fraction calculator: the four operations and the simplification, checked case by case and against exact
// BigInt arithmetic on every small fraction.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { frazioni } = await jiti.import('../../src/lib/tools/frazioni.ts');

const run = (op, an, ad, bn = '', bd = '') => frazioni({ op, an, ad, bn, bd });
/** Everything a result shows, as one string: the rows, then every field of every step. */
const steps = (o) => [...o.rows.map((r) => `${r.label}: ${r.value}`), ...o.steps.flatMap(stepTexts)].join('\n');
const stepTexts = (s) => [s.group ?? '', s.say, ...(s.math ?? []), ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? ''];

test('sums and differences with the mcm of the denominators', () => {
	const o = run('piu', '3', '4', '1', '6');
	assert.equal(o.copy, '11/12');
	assert.match(steps(o), /2\^2 \\cdot 3 = \\hl\{12\}/);
	assert.match(steps(o), /\\dfrac\{3 \\cdot 3\}\{4 \\cdot 3\} = \\hl\{\\dfrac\{9\}\{12\}\}/);
	assert.match(steps(o), /\\dfrac\{9 \+ 2\}\{12\}/);
	assert.deepEqual(o.rows.map((r) => r.label), ['Risultato', 'In decimali']);
	assert.equal(o.rows[0].value, '$\\dfrac{11}{12}$');
	const def = run('piu', '3', '4', '5', '6');
	assert.deepEqual(def.rows.map((r) => r.value), ['$\\dfrac{19}{12}$', '$1 + \\dfrac{7}{12}$', '$1{,}58\\overline{3}$']);
	assert.ok(def.steps.length <= 5 && def.steps.every((s) => !s.group));
	assert.equal(run('meno', '1', '2', '1', '3').copy, '1/6');
	assert.equal(run('meno', '1', '3', '1', '2').copy, '-1/6');
	assert.equal(run('piu', '1', '6', '1', '3').copy, '1/2');
	assert.match(steps(run('piu', '1', '6', '1', '3')), /Semplifica il risultato/);
	assert.equal(run('piu', '2', '5', '1', '5').copy, '3/5');
	assert.match(steps(run('piu', '2', '5', '1', '5')), /stesso denominatore/);
	assert.equal(run('meno', '4', '6', '-5', '8').copy, '31/24');
	assert.match(steps(run('meno', '4', '6', '-5', '8')), /Riduci la frazione ai minimi termini/);
	assert.equal(run('piu', '3', '', '-4', '').copy, '-1');
	assert.equal(run('piu', '2', '', '1', '3').copy, '7/3');
	assert.equal(run('meno', '1', '2', '1', '2').copy, '0');
});

test('products simplified crosswise, quotients by the reciprocal', () => {
	const p = run('per', '4', '9', '-15', '8');
	assert.equal(p.copy, '-5/6');
	assert.match(steps(p), /in croce/);
	assert.match(steps(p), /Più per meno dà meno/);
	assert.equal(run('per', '-2', '3', '-3', '4').copy, '1/2');
	assert.match(steps(run('per', '-2', '3', '-3', '4')), /Meno per meno dà più/);
	assert.equal(run('per', '0', '5', '7', '3').copy, '0');
	assert.equal(run('per', '2', '3', '5', '7').copy, '10/21');
	assert.match(steps(run('per', '2', '3', '5', '7')), /Non si può semplificare in croce/);
	const d = run('diviso', '3', '4', '-9', '10');
	assert.equal(d.copy, '-5/6');
	assert.match(steps(d), /reciproco/);
	assert.match(steps(d), /\\left\(-\\dfrac\{10\}\{9\}\\right\)/);
	assert.equal(run('diviso', '2', '', '4', '').copy, '1/2');
	assert.equal(run('diviso', '0', '3', '4', '5').copy, '0');
});

test('simplification by the MCD', () => {
	const s = run('semplifica', '84', '36');
	assert.equal(s.copy, '7/3');
	assert.deepEqual(s.steps[0].table.rows[0], ['$84$', '$2^2 \\cdot 3 \\cdot 7$']);
	assert.match(steps(s), /\\text\{MCD\}\(84, 36\) = 2\^2 \\cdot 3\n= \\hl\{12\}/);
	assert.equal(s.rows[0].label, 'Ridotta ai minimi termini');
	assert.match(steps(s), /numero misto/);
	assert.match(steps(s), /2\{,\}\\overline\{3\}/);
	assert.equal(run('semplifica', '-12', '18').copy, '-2/3');
	assert.equal(run('semplifica', '12', '-18').copy, '-2/3');
	assert.match(steps(run('semplifica', '12', '-18')), /Porta il segno/);
	assert.equal(run('semplifica', '8', '15').copy, '8/15');
	assert.match(steps(run('semplifica', '8', '15')), /già ridotta/);
	assert.equal(run('semplifica', '20', '4').copy, '5');
	assert.equal(run('semplifica', '0', '7').copy, '0');
	assert.equal(run('semplifica', '1', '3').copy, '1/3');
	assert.equal(run('semplifica', '7', '').copy, '7');
});

test('mistakes in the input, in words', () => {
	assert.match(run('piu', '1', '0', '1', '2').error, /denominatore della prima frazione è 0/);
	assert.match(run('piu', '1', '2', '1', '0').error, /denominatore della seconda frazione è 0/);
	assert.match(run('diviso', '1', '2', '0', '5').error, /non si può dividere per zero/);
	assert.match(run('piu', '', '2', '1', '2').error, /numeratore della prima/);
	assert.match(run('piu', '1,5', '2', '1', '2').error, /interi/);
	assert.match(run('piu', 'a', '2', '1', '2').error, /interi/);
	assert.match(run('per', '1', '2', '1000000', '3').error, /999 999/);
	assert.equal(run('semplifica', '1', '2', 'x', '0').ok, true);
	// Every message says what to write, with an example.
	for (const o of [run('piu', '1', '0', '1', '2'), run('diviso', '1', '2', '0', '5'), run('piu', '', '2', '1', '2'), run('piu', 'a', '2', '1', '2'), run('per', '1', '2', '1000000', '3')]) assert.match(o.error, /per esempio|come 3/, o.error);
	// Large but allowed: exact, or a polite error, never an exception.
	const big = run('per', '999999', '999998', '999997', '999996');
	assert.equal(typeof big.ok, 'boolean');
});

// Exact arithmetic on BigInt, independent of Rational.
const bgcd = (a, b) => {
	a = a < 0n ? -a : a;
	b = b < 0n ? -b : b;
	while (b) [a, b] = [b, a % b];
	return a;
};
const frac = (n, d) => {
	if (d < 0n) [n, d] = [-n, -d];
	const g = bgcd(n, d) || 1n;
	return { n: n / g, d: d / g };
};
const show = ({ n, d }) => (d === 1n ? `${n}` : `${n}/${d}`);

test('every small fraction, against BigInt arithmetic', () => {
	const ops = {
		piu: (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d),
		meno: (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d),
		per: (a, b) => frac(a.n * b.n, a.d * b.d),
		diviso: (a, b) => (b.n === 0n ? null : frac(a.n * b.d, a.d * b.n))
	};
	let checked = 0;
	for (let an = -7; an <= 7; an++)
		for (const ad of [1, 2, 3, 4, 6, -5])
			for (let bn = -6; bn <= 6; bn += 2)
				for (const bd of [1, 3, 4, 8, -2])
					for (const [op, f] of Object.entries(ops)) {
						const want = f(frac(BigInt(an), BigInt(ad)), frac(BigInt(bn), BigInt(bd)));
						const o = run(op, String(an), String(ad), String(bn), String(bd));
						if (!want) {
							assert.equal(o.ok, false);
							continue;
						}
						assert.equal(o.copy, show(want), `${an}/${ad} ${op} ${bn}/${bd}`);
						assert.ok(o.steps.length > 0);
						typesets(o);
						checked++;
					}
	for (let n = -60; n <= 60; n++)
		for (let d = -12; d <= 30; d++) {
			if (d === 0) continue;
			const o = run('semplifica', String(n), String(d));
			assert.equal(o.copy, show(frac(BigInt(n), BigInt(d))));
			typesets(o);
			checked++;
		}
	assert.ok(checked > 5000);
});

/**
 * Every string a result shows typesets in KaTeX without errors, with the `\\hl` of the tools: the rows, and each
 * step's sentence, lines, table and conclusion. The sentence is a sentence: no display formula, at most one "=".
 */
const KATEX = { throwOnError: true, strict: 'ignore', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };
const inline = (text) => {
	assert.equal((text.match(/\$/g) ?? []).length % 2, 0, text);
	for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => katex.renderToString(m[1], KATEX), m[1]);
};
function typesets(o) {
	assert.ok(o.rows.length > 0);
	for (const r of o.rows) {
		inline(r.label);
		inline(r.value);
		assert.match(r.value, /^\$[^$]+\$$/, r.value);
	}
	for (const s of o.steps) {
		assert.ok(!s.say.includes('$$'), s.say);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, s.say);
		inline(s.say);
		for (const m of s.math ?? []) assert.doesNotThrow(() => katex.renderToString(m, KATEX), m);
		for (const c of [...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? [])]) inline(c);
		if (s.then) inline(s.then);
	}
}

test('every string typesets, and each sentence stays a sentence', () => {
	for (const [op, an, ad, bn, bd] of [
		['piu', '3', '4', '5', '6'],
		['meno', '4', '6', '-5', '-8'],
		['per', '4', '9', '-15', '8'],
		['diviso', '3', '4', '9', '10'],
		['semplifica', '84', '36'],
		['semplifica', '1', '128'],
		['piu', '999999', '999998', '999997', '999996']
	]) {
		const o = run(op, an, ad, bn, bd);
		if (o.ok) typesets(o);
	}
	// More than five steps: grouped, the first step opens a group.
	const long = run('meno', '4', '6', '-5', '-8');
	assert.ok(long.steps.length > 5);
	assert.equal(long.steps[0].group, 'Il calcolo');
});
