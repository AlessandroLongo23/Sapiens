// Fattoriale e calcolo combinatorio: the calculators' pure logic.
// Run with `node --test tests/unit/tools-combinatoria.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { fattoriale, combinatoria, binomial, factorial, falling, sciBig, bigTex, productLine } = await jiti.import('../../src/lib/tools/combinatoria.ts');

const digits = (o) => o.copy.replace(/ /g, '');
const all = (o) => o.steps.flatMap((s) => [s.say, ...(s.math ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? '']).join(' ');

/** Brute force: count arrangements by listing them. */
function count(n, k, { order, repeat }) {
	let c = 0;
	const walk = (chosen, start) => {
		if (chosen.length === k) return void c++;
		for (let i = order ? 0 : start; i < n; i++) {
			if (!repeat && chosen.includes(i)) continue;
			walk([...chosen, i], repeat ? i : i + 1);
		}
	};
	walk([], 0);
	return c;
}

test('factorial', () => {
	assert.equal(fattoriale('0').copy, '1');
	assert.match(all(fattoriale('0')), /convenzione/);
	assert.equal(fattoriale('1').copy, '1');
	const five = fattoriale('5');
	assert.equal(five.copy, '120');
	assert.deepEqual(five.steps[0].math, ['5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1', '= \\hl{120}']);
	// Ten factors: shortened with dots, then a table one factor at a time.
	const ten = fattoriale('10');
	assert.equal(ten.copy, '3 628 800');
	assert.equal(ten.steps[0].math[0], '10! = 10 \\cdot 9 \\cdot 8 \\cdot \\ldots \\cdot 2 \\cdot 1');
	const rows = ten.steps[1].table.rows;
	assert.deepEqual(rows[0], ['$1$', '$1$']);
	assert.deepEqual(rows[2], ['$3$', '$2 \\cdot 3 = 6$']);
	assert.deepEqual(rows.at(-1), ['$10$', '$362\\,880 \\cdot 10 = \\hl{3\\,628\\,800}$']);
	// Big ones: scientific notation and digits.
	const f52 = fattoriale('52');
	assert.equal(f52.rows.find((r) => r.label === 'Numero di cifre').value, '$68$');
	assert.equal(f52.rows.find((r) => r.label === 'In notazione scientifica').value, '$\\approx 8{,}0658 \\cdot 10^{67}$');
	assert.equal(digits(fattoriale('400')).length, 869);
	assert.equal(digits(fattoriale('20')), '2432902008176640000');
	for (const n of [0, 1, 2, 5, 7, 10, 20, 30, 31, 52, 400]) assertReadable(fattoriale(String(n)), `${n}!`);
});

test('factorial: wrong inputs', () => {
	for (const s of ['', '-1', '2,5', 'abc', '401']) {
		const o = fattoriale(s);
		assert.equal(o.ok, false, s);
		assert.match(o.error, /per esempio/, o.error);
	}
	assert.match(fattoriale('401').error, /Al massimo 400/);
});

test('helpers', () => {
	assert.equal(binomial(90, 6), 622614630n);
	assert.equal(binomial(10, 0), 1n);
	assert.equal(binomial(10, 11), 0n);
	assert.equal(falling(7, 3), 210n);
	assert.equal(factorial(0), 1n);
	assert.equal(bigTex(1234n), '1234');
	assert.equal(bigTex(12345n), '12\\,345');
	assert.equal(productLine(7, 3), '7 \\cdot 6 \\cdot 5');
	assert.deepEqual(sciBig(3628800n), { tex: '3{,}6288 \\cdot 10^{6}', text: '3,6288 · 10^6' });
	// Rounding carries into the exponent.
	assert.equal(sciBig(9999960n).tex, '1 \\cdot 10^{7}');
	assert.equal(sciBig(12n).tex, '1{,}2 \\cdot 10^{1}');
	// Pascal's rule on every row up to 60.
	for (let n = 1; n <= 60; n++) for (let k = 1; k < n; k++) assert.equal(binomial(n, k), binomial(n - 1, k - 1) + binomial(n - 1, k));
});

test('the six counts, with their steps', () => {
	assert.equal(combinatoria('perm', '5', '').copy, '120');
	assert.match(all(combinatoria('perm', '5', '')), /P_\{5\} = 5!/);
	const d = combinatoria('disp', '7', '3');
	assert.equal(d.copy, '210');
	assert.deepEqual(d.steps[1].math, ['D_{7,3} = 7 \\cdot 6 \\cdot 5', '= \\hl{210}']);
	const dr = combinatoria('disprip', '10', '4');
	assert.equal(dr.copy, '10 000');
	assert.deepEqual(dr.steps[1].math, ["D'_{10,4} = 10 \\cdot 10 \\cdot 10 \\cdot 10", '= \\hl{10\\,000}']);
	assert.equal(combinatoria('disprip', '3', '14').copy, '4 782 969');
	const c = combinatoria('comb', '90', '6');
	assert.equal(c.copy, '622 614 630');
	assert.deepEqual(c.steps.at(-1).math, ['C_{90,6} = \\dfrac{448\\,282\\,533\\,600}{720}', '= \\hl{622\\,614\\,630}']);
	// Symmetry: 10 choose 8 is worked as 10 choose 2.
	const sym = combinatoria('comb', '10', '8');
	assert.equal(sym.copy, '45');
	assert.match(all(sym), /\\binom\{10\}\{8\} = \\binom\{10\}\{2\}/);
	const cr = combinatoria('combrip', '4', '3');
	assert.equal(cr.copy, '20');
	assert.match(all(cr), /4 \+ 3 - 1 = 6/);
	assert.ok(!cr.steps[0].group);
	// More than five steps: grouped.
	const long = combinatoria('combrip', '10', '8');
	assert.equal(long.copy, '24 310');
	assert.deepEqual(long.steps.map((s) => s.group).filter(Boolean), ['La formula', 'Il calcolo']);
	// Anagrams.
	const w = combinatoria('permrip', '', '', 'MATEMATICA');
	assert.equal(w.copy, '151 200');
	assert.equal(w.rows[0].label, 'Anagrammi di MATEMATICA, anche senza senso');
	assert.deepEqual(w.steps[0].table.rows[1], ['A', '$\\hl{3}$']);
	assert.match(all(w), /P = \\dfrac\{10!\}\{2! \\cdot 3! \\cdot 2!\}/);
	assert.equal(combinatoria('permrip', '', '', 'anna').copy, '6');
	assert.equal(combinatoria('permrip', '', '', "l'amo").copy, '24');
	assert.equal(combinatoria('permrip', '', '', 'ROMA').copy, '24');
	assert.match(all(combinatoria('permrip', '', '', 'ROMA')), /permutazioni semplici/);
	assert.equal(combinatoria('permrip', '', '', '3 2 2').copy, '210');
	assert.equal(combinatoria('permrip', '', '', 'x').copy, '1');
});

test('limits', () => {
	assert.equal(combinatoria('comb', '5', '0').copy, '1');
	assert.equal(combinatoria('comb', '5', '5').copy, '1');
	assert.equal(combinatoria('disp', '5', '0').copy, '1');
	assert.equal(combinatoria('disp', '5', '5').copy, '120');
	assert.equal(combinatoria('disprip', '5', '0').copy, '1');
	assert.equal(combinatoria('combrip', '1', '5').copy, '1');
	assert.equal(combinatoria('combrip', '3', '0').copy, '1');
	assert.equal(combinatoria('perm', '1', '').copy, '1');
	// Repetition lets k pass n.
	assert.equal(combinatoria('disprip', '2', '10').copy, '1024');
	assert.equal(combinatoria('combrip', '2', '10').copy, '11');
	const big = combinatoria('comb', '400', '200');
	assert.equal(big.ok, true);
	assert.equal(big.rows.find((r) => r.label === 'Numero di cifre').value, '$120$');
});

test('checked by listing every arrangement', () => {
	for (let n = 1; n <= 6; n++)
		for (let k = 0; k <= 6; k++) {
			const num = (mode) => Number(digits(combinatoria(mode, String(n), String(k))));
			assert.equal(num('disprip'), count(n, k, { order: true, repeat: true }), `D' ${n} ${k}`);
			assert.equal(num('combrip'), count(n, k, { order: false, repeat: true }), `C' ${n} ${k}`);
			if (k <= n) {
				assert.equal(num('disp'), count(n, k, { order: true, repeat: false }), `D ${n} ${k}`);
				assert.equal(num('comb'), count(n, k, { order: false, repeat: false }), `C ${n} ${k}`);
			}
		}
	// Anagrams against a set of all the orderings.
	const perms = (s) => (s.length <= 1 ? [s] : [...s].flatMap((c, i) => perms(s.slice(0, i) + s.slice(i + 1)).map((p) => c + p)));
	for (const w of ['ANNA', 'MAMMA', 'CARTA', 'BANANA', 'ABCDE', 'AAAA']) assert.equal(Number(digits(combinatoria('permrip', '', '', w))), new Set(perms(w)).size, w);
});

test('every example reads well and typesets', () => {
	const cases = [
		['perm', '5', ''],
		['perm', '8', ''],
		['perm', '12', ''],
		['disp', '8', '3'],
		['disp', '20', '12'],
		['disp', '50', '40'],
		['disprip', '10', '4'],
		['disprip', '3', '14'],
		['comb', '90', '6'],
		['comb', '10', '3'],
		['comb', '10', '8'],
		['comb', '40', '20'],
		['comb', '5', '0'],
		['combrip', '4', '3'],
		['combrip', '6', '2'],
		['combrip', '1', '1']
	];
	for (const [m, n, k] of cases) assertReadable(combinatoria(m, n, k), `${m} ${n} ${k}`);
	for (const r of ['MATEMATICA', 'ANNA', '3 2 2', 'ROMA', 'precipitevolissimevolmente', '1 1 1']) assertReadable(combinatoria('permrip', '', '', r), r);
});

test('wrong inputs fail with a sentence', () => {
	for (const o of [
		combinatoria('comb', '', '3'),
		combinatoria('comb', '0', '3'),
		combinatoria('comb', '5', '7'),
		combinatoria('disp', '5', '7'),
		combinatoria('disp', '5', '-1'),
		combinatoria('disp', '5', '2,5'),
		combinatoria('disprip', '400', '400'),
		combinatoria('disprip', '10', '1000'),
		combinatoria('perm', '401', ''),
		combinatoria('permrip', '', '', ''),
		combinatoria('permrip', '', '', '3 0 2'),
		combinatoria('permrip', '', '', '300 300')
	]) {
		assert.equal(o.ok, false);
		assert.match(o.error, /per esempio|Al massimo/, o.error);
	}
	assert.match(combinatoria('comb', '5', '7').error, /con ripetizione/);
});
