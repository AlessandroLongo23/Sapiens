// Percent composition, empirical and molecular formula. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { composizione, formulaMinima, parseElements } = await jiti.import('../../src/lib/tools/formula-minima.ts');

const ok = (o) => {
	assert.ok(o.ok, o.error);
	assertReadable(o);
	return o;
};
const minima = (e, M = '', u = '%') => ok(formulaMinima({ e, u, M }));
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;

test('percent composition', () => {
	const o = ok(composizione('Ca(OH)2'));
	assert.equal(o.copy, 'Ca 54,09 %; O 43,18 %; H 2,73 %');
	assert.equal(o.rows[0].label, 'Percentuale di calcio (Ca)');
	assert.equal(o.rows[0].value, '$\\approx 54{,}09\\,\\%$');
	assert.equal(row(o, 'Massa molare di Ca(OH)₂'), '$74{,}10\\ \\text{g/mol}$');
	assert.equal(ok(composizione('H2O')).copy, 'H 11,21 %; O 88,79 %');
	assert.equal(ok(composizione('NaCl')).copy, 'Na 39,34 %; Cl 60,66 %');
	assert.equal(ok(composizione('C6H12O6')).copy, 'C 39,99 %; H 6,73 %; O 53,28 %');
	assert.equal(ok(composizione('CuSO4·5H2O')).copy, 'Cu 25,45 %; S 12,84 %; O 57,66 %; H 4,04 %');
	for (const f of ['', 'h2o', 'Fe', 'O2', 'Xx2']) {
		const r = composizione(f);
		assert.equal(r.ok, false, f);
		assertReadable(r);
	}
});

test('empirical and molecular formula', () => {
	const butane = minima('C 82,63; H 17,37', '58,12');
	assert.equal(row(butane, 'Formula minima'), '$\\mathrm{C_{2}H_{5}}$');
	assert.equal(row(butane, 'Formula molecolare'), '$\\mathrm{C_{4}H_{10}}$');
	assert.equal(row(butane, 'Massa della formula minima'), '$29{,}07\\ \\text{g/mol}$');
	assert.equal(butane.copy, 'C₄H₁₀');
	assert.match(JSON.stringify(butane.steps), /circa ,5/);
	const glucose = minima('C 40; H 6,71; O 53,29', '180,18');
	assert.equal(row(glucose, 'Formula minima'), '$\\mathrm{CH_{2}O}$');
	assert.equal(glucose.copy, 'C₆H₁₂O₆');
	const iron = minima('Fe 69,94; O 30,06');
	assert.equal(iron.copy, 'Fe₂O₃');
	assert.equal(iron.rows.length, 1);
	const magnetite = minima('Fe 72,36; O 27,64');
	assert.equal(magnetite.copy, 'Fe₃O₄');
	assert.match(JSON.stringify(magnetite.steps), /,33 o ,67/);
	// Grams, and other ways of writing the data.
	assert.equal(minima('C 2,4; H 0,6', '30', 'g').copy, 'C₂H₆');
	assert.equal(minima('C: 2.4 g, H: 0.6 g', '', 'g').copy, 'CH₃');
	assert.equal(minima('Na 32,39% S 22,53% O 45,08%').copy, 'Na₂SO₄');
	assert.equal(minima('C=85,6 H=14,4').copy, 'CH₂');
	// A molar mass equal to that of the empirical formula.
	const same = minima('Fe 69,94; O 30,06', '159,7');
	assert.equal(row(same, 'Formula molecolare'), '$\\mathrm{Fe_{2}O_{3}}$');
	assert.match(JSON.stringify(same.steps), /uguale alla formula minima/);
	// A molar mass that is not a multiple.
	const off = minima('C 82,63; H 17,37', '70');
	assert.equal(row(off, 'Formula molecolare'), undefined);
	assert.match(JSON.stringify(off.steps), /controlla la massa molare/);
});

test('data that are not right', () => {
	const bad = [
		['', ''],
		['C 40', ''],
		['C 40; H 6,71; O 43,29', ''],
		['C 40; C 60', ''],
		['c 40; h 60', ''],
		['Xx 40; H 60', ''],
		['C quaranta; H 60', ''],
		['C 0; H 100', ''],
		['C 82,63; H 17,37', 'abc'],
		['C 82,63; H 17,37', '0']
	];
	for (const [e, M] of bad) {
		const o = formulaMinima({ e, u: '%', M });
		assert.equal(o.ok, false, `${e} | ${M}`);
		assertReadable(o);
	}
	assert.match(formulaMinima({ e: 'fe 50; O 50', u: '%', M: '' }).error, /Fe/);
	assert.match(formulaMinima({ e: 'C 40; H 6,71; O 43,29', u: '%', M: '' }).error, /90/);
	// Ratios that no multiplier up to 6 clears.
	const seven = formulaMinima({ e: 'C 12,01; H 1,4443', u: 'g', M: '' });
	assert.equal(seven.ok, false);
	assert.match(seven.error, /controlla i dati/);
	assert.equal(typeof parseElements('C 1; H 2; O 3; N 4; S 5; P 6; K 7; Na 8; Cl 9'), 'string');
});

test('brute force: from a formula to the percentages and back', () => {
	const pool = ['C', 'H', 'O', 'N', 'S', 'Cl', 'Na', 'K', 'Ca', 'Fe', 'Mg', 'Al', 'P'];
	const gcd = (a, b) => (b ? gcd(b, a % b) : a);
	for (let i = 0; i < 300; i++) {
		const k = 2 + Math.floor(Math.random() * 2);
		const syms = [...pool].sort(() => Math.random() - 0.5).slice(0, k);
		const counts = syms.map(() => 1 + Math.floor(Math.random() * 4));
		const formula = syms.map((s, j) => `${s}${counts[j] === 1 ? '' : counts[j]}`).join('');
		const comp = ok(composizione(formula));
		const data = comp.copy.replace(/ %/g, '');
		const g = counts.reduce(gcd);
		const want = syms.map((s, j) => `${s}${counts[j] / g === 1 ? '' : counts[j] / g}`).join('');
		const o = formulaMinima({ e: data, u: '%', M: '' });
		assert.ok(o.ok, `${formula}: ${o.error}`);
		assertReadable(o);
		const plain = o.copy.replace(/[₀-₉]/g, (c) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
		assert.equal(plain, want, `${formula} → ${data}`);
		// With the molar mass, the molecular formula is the one we started from.
		const M = comp.rows.at(-1).value.match(/\d+\{,\}\d+/)[0].replace('{,}', ',');
		const m = formulaMinima({ e: data, u: '%', M });
		assert.ok(m.ok, m.error);
		assert.equal(m.copy.replace(/[₀-₉]/g, (c) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))), formula, `${formula} with M = ${M}`);
	}
});
