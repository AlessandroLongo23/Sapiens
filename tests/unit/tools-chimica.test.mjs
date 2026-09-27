// Chemistry tools: the formula parser and molar masses, grams to moles and particles, molarity, dilution.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ELEMENTS, parseFormula, massaMolare, moli, molarita, diluizione } = await jiti.import('../../src/lib/tools/chimica.ts');

const ok = (o) => {
	assert.ok(o.ok, o.error);
	assertReadable(o);
	return o;
};
const mm = (f) => ok(massaMolare(f)).copy;

test('the table of the elements', () => {
	assert.equal(ELEMENTS.length, 118);
	assert.equal(new Set(ELEMENTS.map((e) => e.symbol)).size, 118);
	const by = Object.fromEntries(ELEMENTS.map((e) => [e.symbol, e]));
	assert.equal(by.H.z, 1);
	assert.equal(by.Fe.z, 26);
	assert.equal(by.Au.z, 79);
	assert.equal(by.U.z, 92);
	assert.equal(by.Og.z, 118);
	// Two decimals, as in the table of the Sapiens lesson on the mole.
	const lesson = { H: 1.01, C: 12.01, N: 14.01, O: 16, Na: 22.99, Mg: 24.31, P: 30.97, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08, Fe: 55.85 };
	for (const [sym, m] of Object.entries(lesson)) assert.equal(by[sym].mass.toNumber(), m, sym);
	// Every mass increases roughly with Z, and radioactive ones are whole mass numbers.
	for (const e of ELEMENTS) {
		const m = e.mass.toNumber();
		assert.ok(m > e.z && m < 3 * e.z + 5, `${e.symbol} ${m}`);
		if (e.radioactive) assert.equal(e.mass.d, 1n);
	}
});

test('molar masses as in the books', () => {
	assert.equal(mm('H2O'), '18,02 g/mol');
	assert.equal(mm('CO2'), '44,01 g/mol');
	assert.equal(mm('NaCl'), '58,44 g/mol');
	assert.equal(mm('CH4'), '16,05 g/mol');
	assert.equal(mm('C6H12O6'), '180,18 g/mol');
	assert.equal(mm('C2H6O'), '46,08 g/mol');
	assert.equal(mm('C8H10N4O2'), '194,22 g/mol');
	assert.equal(mm('Ca(OH)2'), '74,10 g/mol');
	assert.equal(mm('H2SO4'), '98,09 g/mol');
	assert.equal(mm('CaCO3'), '100,09 g/mol');
	assert.equal(mm('Al2(SO4)3'), '342,17 g/mol');
	assert.equal(mm('CuSO4·5H2O'), '249,72 g/mol');
	assert.equal(mm('CuSO4.5H2O'), '249,72 g/mol');
	assert.equal(mm('CuSO4*5H2O'), '249,72 g/mol');
	assert.equal(mm('CuSO₄·5H₂O'), '249,72 g/mol');
	assert.equal(mm('[Cu(NH3)4]SO4'), '227,78 g/mol');
	assert.equal(mm('Fe'), '55,85 g/mol');
	assert.equal(mm('O2'), '32,00 g/mol');
	assert.equal(mm('Tc'), '98,00 g/mol');
	assert.equal(mm('Co'), '58,93 g/mol');
	assert.equal(mm('CO'), '28,01 g/mol');
	assert.equal(mm(' Mg ( OH ) 2 '), '58,33 g/mol');
	const o = ok(massaMolare('Ca(OH)2'));
	assert.equal(o.rows[0].label, 'Massa molare di Ca(OH)₂');
	assert.match(JSON.stringify(o.steps), /parentesi/);
	assert.match(JSON.stringify(ok(massaMolare('CuSO4·5H2O')).steps), /dopo il punto/);
	assert.equal(ok(massaMolare('Fe')).rows[1].label, 'Massa atomica');
	assert.match(JSON.stringify(ok(massaMolare('UO2')).steps), /tavola periodica/);
	assert.match(JSON.stringify(ok(massaMolare('PuO2')).steps), /isotopo/);
});

test('formulas that are not formulas', () => {
	const bad = ['', 'h2o', 'H2O)', 'Ca(OH', '()2', '2H2O', 'Xx', 'Hx2', 'H0', 'SO4^2-', 'Na+', 'H2O·', 'H2O·H2O·H2O·H2O·H2O·H2O', 'H2O!', 'C1000', 'CuSO4·0H2O', 'A'.repeat(61)];
	for (const f of bad) {
		const o = massaMolare(f);
		assert.equal(o.ok, false, f);
		assertReadable(o);
	}
	assert.match(massaMolare('h2o').error, /maiuscola/);
	assert.match(massaMolare('Xx').error, /Xx/);
	assert.match(massaMolare('2H2O').error, /dopo il simbolo/);
	assert.match(massaMolare('Ca(OH').error, /parentesi chiusa/);
});

test('random formulas against an independent count', () => {
	const pick = (a) => a[Math.floor(Math.random() * a.length)];
	const stable = ELEMENTS.filter((e) => !e.radioactive);
	for (let i = 0; i < 300; i++) {
		const counts = new Map();
		const piece = (k) => {
			const e = pick(stable);
			const n = 1 + Math.floor(Math.random() * 4);
			counts.set(e.symbol, (counts.get(e.symbol) ?? 0) + n * k);
			return `${e.symbol}${n === 1 ? '' : n}`;
		};
		let f = piece(1) + piece(1);
		const g = 2 + Math.floor(Math.random() * 3);
		if (Math.random() < 0.5) f += `(${piece(g)}${piece(g)})${g}`;
		const w = 1 + Math.floor(Math.random() * 7);
		if (Math.random() < 0.3) {
			f += `·${w === 1 ? '' : w}H2O`;
			counts.set('H', (counts.get('H') ?? 0) + 2 * w);
			counts.set('O', (counts.get('O') ?? 0) + w);
		}
		const r = parseFormula(f);
		assert.equal(typeof r, 'object', `${f}: ${r}`);
		const got = Object.fromEntries(r.atoms.map(([e, n]) => [e.symbol, n]));
		assert.deepEqual(got, Object.fromEntries(counts), f);
		const cents = [...counts].reduce((acc, [s, n]) => acc + Math.round(ELEMENTS.find((e) => e.symbol === s).mass.toNumber() * 100) * n, 0);
		const copy = massaMolare(f).copy;
		assert.equal(Number(copy.replace(/ g\/mol$/, '').replace(/ /g, '').replace(',', '.')), cents / 100, f);
	}
});

test('grams, moles and particles', () => {
	const g = ok(moli({ f: 'H2O', da: 'g', x: '36', u: 'g' }));
	assert.equal(g.copy, '1,998 mol');
	assert.equal(g.rows[1].value, '$\\approx 1{,}203 \\cdot 10^{24}$');
	assert.equal(ok(moli({ f: 'H2O', da: 'g', x: '18,02', u: 'g' })).rows[1].value, '$6{,}022 \\cdot 10^{23}$');
	assert.equal(ok(moli({ f: 'NaCl', da: 'mol', x: '0,25', u: 'mol' })).copy, '14,61 g');
	assert.equal(ok(moli({ f: 'NaCl', da: 'mol', x: '250', u: 'mmol' })).copy, '14,61 g');
	assert.equal(ok(moli({ f: 'CaCO3', da: 'g', x: '1', u: 'kg' })).copy, '9,991 mol');
	assert.equal(ok(moli({ f: 'C6H12O6', da: 'g', x: '900,9', u: 'g' })).copy, '5 mol');
	const n = ok(moli({ f: 'Fe', da: 'N', x: '3,011e23', u: 'n' }));
	assert.equal(n.copy, '0,5 mol');
	assert.equal(n.rows[1].value, '$27{,}925\\ \\text{g}$');
	assert.equal(ok(moli({ f: 'Fe', da: 'g', x: '55,85', u: 'g' })).rows[1].label, 'Numero di atomi');
	assert.equal(ok(moli({ f: 'O2', da: 'g', x: '16', u: 'g' })).rows[1].label, 'Numero di particelle');
	assert.equal(moli({ f: 'H2O', da: 'g', x: '0', u: 'g' }).ok, false);
	assert.equal(moli({ f: 'H2O', da: 'g', x: '', u: 'g' }).ok, false);
	assert.equal(moli({ f: 'h2o', da: 'g', x: '1', u: 'g' }).ok, false);
	// A unit left over from another mode falls back to the right one.
	assert.equal(ok(moli({ f: 'H2O', da: 'mol', x: '2', u: 'g' })).copy, '36,04 g');
	// Round trips.
	for (const f of ['H2O', 'NaCl', 'CuSO4·5H2O', 'Al2(SO4)3']) {
		for (const grams of ['1', '12,5', '250']) {
			const mol = moli({ f, da: 'g', x: grams, u: 'g' });
			const back = moli({ f, da: 'mol', x: mol.copy.replace(' mol', ''), u: 'mol' });
			const x = Number(grams.replace(',', '.'));
			assert.ok(Math.abs(Number(back.copy.replace(' g', '').replace(',', '.')) - x) <= 1e-3 * x + 0.01, `${f} ${grams}: ${back.copy}`);
		}
	}
});

test('molarity', () => {
	assert.equal(ok(molarita({ trova: 'M', n: '0,5', un: 'mol', V: '250', uV: 'mL', uM: 'M' })).copy, '2 mol/L');
	assert.equal(ok(molarita({ trova: 'M', n: '0,1', un: 'mol', V: '500', uV: 'mL', uM: 'M' })).copy, '0,2 mol/L');
	assert.equal(ok(molarita({ trova: 'n', M: '0,5', uM: 'M', V: '2', uV: 'L', un: 'mol' })).copy, '1 mol');
	assert.equal(ok(molarita({ trova: 'V', n: '0,2', un: 'mol', M: '0,8', uM: 'M', uV: 'mL' })).copy, '250 mL');
	assert.equal(ok(molarita({ trova: 'M', n: '5', un: 'mmol', V: '100', uV: 'mL', uM: 'mM' })).copy, '50 mmol/L');
	assert.equal(ok(molarita({ trova: 'M', n: '1', un: 'mol', V: '3', uV: 'L', uM: 'M' })).copy, '0,3333 mol/L');
	assert.equal(molarita({ trova: 'M', n: '1', V: '0' }).ok, false);
});

test('dilution', () => {
	const o = ok(diluizione({ trova: 'V2', M1: '2', uM1: 'M', V1: '50', uV1: 'mL', M2: '0,5', uM2: 'M', uV2: 'mL' }));
	assert.equal(o.copy, '200 mL');
	assert.equal(o.rows[1].label, 'Acqua da aggiungere');
	assert.equal(o.rows[1].value, '$150\\ \\text{mL}$');
	// Same units: no conversion step.
	assert.ok(!JSON.stringify(o.steps).includes('Porta i dati'));
	const l = ok(diluizione({ trova: 'V1', M1: '1', uM1: 'M', M2: '0,1', uM2: 'M', V2: '1', uV2: 'L', uV1: 'mL' }));
	assert.equal(l.copy, '100 mL');
	assert.equal(l.rows[1].value, '$0{,}9\\ \\text{L}$');
	assert.equal(ok(diluizione({ trova: 'M2', M1: '6', uM1: 'M', V1: '10', uV1: 'mL', V2: '250', uV2: 'mL', uM2: 'M' })).copy, '0,24 mol/L');
	assert.equal(ok(diluizione({ trova: 'M1', M2: '0,24', uM2: 'M', V1: '10', uV1: 'mL', V2: '0,25', uV2: 'L', uM1: 'M' })).copy, '6 mol/L');
	const mixed = ok(diluizione({ trova: 'V2', M1: '3', uM1: 'M', V1: '100', uV1: 'mL', M2: '1', uM2: 'M', uV2: 'L' }));
	assert.equal(mixed.copy, '0,3 L');
	assert.ok(JSON.stringify(mixed.steps).includes('Porta i dati'));
	const up = ok(diluizione({ trova: 'M2', M1: '1', uM1: 'M', V1: '500', uV1: 'mL', V2: '250', uV2: 'mL', uM2: 'M' }));
	assert.equal(up.copy, '2 mol/L');
	assert.match(JSON.stringify(up.steps), /concentrazione/);
	assert.equal(diluizione({ trova: 'V2', M1: '2', V1: '50', M2: '' }).ok, false);
	// Brute force: M1 V1 = M2 V2 for every unknown.
	for (const [M1, V1, M2] of [
		[2, 50, 0.5],
		[6, 10, 0.24],
		[1, 100, 0.1],
		[0.5, 20, 0.25]
	]) {
		const V2 = (M1 * V1) / M2;
		const s = (x) => String(Math.round(x * 1e6) / 1e6).replace('.', ',');
		const all = { M1: s(M1), V1: s(V1), M2: s(M2), V2: s(V2), uM1: 'M', uM2: 'M', uV1: 'mL', uV2: 'mL' };
		for (const [k, want] of Object.entries({ M1, V1, M2, V2 })) {
			const r = ok(diluizione({ ...all, trova: k, [k]: '' }));
			assert.ok(Math.abs(Number(r.copy.split(' ')[0].replace(',', '.')) - want) < 1e-3 * want, `${k}: ${r.copy}`);
		}
	}
});
