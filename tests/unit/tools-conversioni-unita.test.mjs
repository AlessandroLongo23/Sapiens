// Conversions by a factor: speed, energy, power, pressure, inches and centimetres, in exact arithmetic.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { conversione, convertFloat, routeOf, CONV_QUANTITIES } = await jiti.import('../../src/lib/tools/conversioni-unita.ts');
const { assertReadable, stepText } = await import('./converters-check.mjs');
const { assertReadable: assertDsa } = await import('./readable-outcome.mjs');

const run = (quantity, value, from, to) => conversione({ quantity, value, from, to });
const copy = (quantity, value, from, to) => {
	const o = run(quantity, value, from, to);
	assert.ok(o.ok, o.error);
	return o.copy;
};

test('speed', () => {
	assert.equal(copy('velocita', '90', 'km/h', 'm/s'), '25 m/s');
	assert.equal(copy('velocita', '100', 'km/h', 'm/s'), '27,78 m/s');
	assert.equal(copy('velocita', '10', 'm/s', 'km/h'), '36 km/h');
	assert.equal(copy('velocita', '1', 'kn', 'km/h'), '1,852 km/h');
	assert.equal(copy('velocita', '100', 'mph', 'km/h'), '160,9344 km/h');
	assert.equal(copy('velocita', '1', 'mph', 'm/s'), '0,44704 m/s');
	assert.equal(copy('velocita', '30', 'kn', 'm/s'), '15,43 m/s');
	// The key step: divide by 3,6.
	const o = run('velocita', '90', 'km/h', 'm/s');
	assert.match(stepText(o), /dividi per \$3\{,\}6\$/);
	assert.match(stepText(o), /90 : 3\{,\}6 = 25/);
	assert.match(stepText(o), /1\\ \\text\{m\/s\} = \\hl\{3\{,\}6\}\\ \\text\{km\/h\}/);
});

test('energy', () => {
	assert.equal(copy('energia', '1', 'kcal', 'J'), '4184 J');
	assert.equal(copy('energia', '250', 'kcal', 'kJ'), '1046 kJ');
	assert.equal(copy('energia', '1', 'kWh', 'J'), '3 600 000 J');
	assert.equal(copy('energia', '1', 'kWh', 'kJ'), '3600 kJ');
	assert.equal(copy('energia', '500', 'J', 'cal'), '119,5 cal');
	assert.equal(copy('energia', '1', 'eV', 'J'), '1,602176634 · 10⁻¹⁹ J');
	assert.equal(copy('energia', '1', 'J', 'eV'), '6,2415 · 10¹⁸ eV');
	assert.equal(copy('energia', '1', 'eV', 'kWh'), '4,45049065 · 10⁻²⁶ kWh');
	assert.equal(copy('energia', '2000', 'kcal', 'kWh'), '2,324 kWh');
	// Through the joule, never by 4,45 · 10^-26.
	assert.deepEqual(routeOf('energia', 'kWh', 'eV'), ['kWh', 'J', 'eV']);
	assert.deepEqual(routeOf('energia', 'kcal', 'kJ'), ['kcal', 'kJ']);
	assert.deepEqual(routeOf('energia', 'cal', 'Wh'), ['cal', 'J', 'Wh']);
	assert.match(run('energia', '1', 'kWh', 'eV').steps[0].say, /Passa per/);
});

test('power', () => {
	assert.equal(copy('potenza', '100', 'CV', 'kW'), '73,549875 kW');
	assert.equal(copy('potenza', '1', 'CV', 'W'), '735,49875 W');
	assert.equal(copy('potenza', '1', 'kW', 'CV'), '1,36 CV');
	assert.equal(copy('potenza', '110', 'kW', 'CV'), '149,56 CV');
	assert.equal(copy('potenza', '1', 'HP', 'W'), '745,7 W');
	assert.equal(copy('potenza', '1', 'HP', 'CV'), '1,014 CV');
	// kW → CV divides by the exact 0,73549875.
	const o = run('potenza', '110', 'kW', 'CV');
	assert.match(stepText(o), /dividi per \$0\{,\}73549875\$/);
	assert.match(o.rows[0].value, /\\approx/);
	assert.equal(o.rows[0].label, '110 kW in cavalli vapore');
});

test('pressure', () => {
	assert.equal(copy('pressione', '1', 'atm', 'Pa'), '101 325 Pa');
	assert.equal(copy('pressione', '1', 'atm', 'mmHg'), '760 mmHg');
	assert.equal(copy('pressione', '1', 'atm', 'hPa'), '1013,25 hPa');
	assert.equal(copy('pressione', '1', 'atm', 'bar'), '1,01325 bar');
	assert.equal(copy('pressione', '1', 'bar', 'mbar'), '1000 mbar');
	assert.equal(copy('pressione', '1013', 'mbar', 'hPa'), '1013 hPa');
	assert.equal(copy('pressione', '760', 'mmHg', 'Pa'), '101 325 Pa');
	assert.equal(copy('pressione', '1', 'psi', 'Pa'), '6894,76 Pa');
	assert.equal(copy('pressione', '32', 'psi', 'bar'), '2,206 bar');
	assert.deepEqual(routeOf('pressione', 'mmHg', 'hPa'), ['mmHg', 'atm', 'hPa']);
	// A rounded value on the way is said.
	assert.match(stepText(run('pressione', '750', 'mmHg', 'hPa')), /non arrotondato/);
	assert.doesNotMatch(stepText(run('pressione', '760', 'mmHg', 'Pa')), /non arrotondato/);
});

test('inches, feet and centimetres', () => {
	assert.equal(copy('lunghezza', '1', 'in', 'cm'), '2,54 cm');
	assert.equal(copy('lunghezza', '55', 'in', 'cm'), '139,7 cm');
	assert.equal(copy('lunghezza', '1', 'ft', 'cm'), '30,48 cm');
	assert.equal(copy('lunghezza', '1', 'in', 'm'), '0,0254 m');
	assert.equal(copy('lunghezza', '100', 'cm', 'in'), '39,37 in');
	assert.equal(copy('lunghezza', `5'11"`, 'in', 'cm'), '180,34 cm');
	assert.equal(copy('lunghezza', `6'`, 'in', 'cm'), '182,88 cm');
	assert.equal(copy('lunghezza', `5' 11,5''`, 'cm', 'mm'), '1816,1 mm');
	assert.equal(copy('lunghezza', '5 ft 11 in', 'in', 'cm'), '180,34 cm');
	const o = run('lunghezza', '180', 'cm', 'in');
	assert.equal(o.rows[1].label, 'In piedi e pollici');
	assert.equal(o.rows[1].value, "$\\approx 5'\\ 10{,}9''$");
	assert.equal(run('lunghezza', '72', 'in', 'in').rows[1].value, "$6'\\ 0''$");
	assert.equal(run('lunghezza', '10', 'in', 'cm').rows.length, 1);
	assert.equal(run('lunghezza', '6', 'ft', 'ft').rows[1].value, "$6'\\ 0''$");
	// 11,96 inches round to 12,0: one more foot, not 0' 12''.
	assert.equal(run('lunghezza', '23,96', 'in', 'in').rows[1].value, "$\\approx 2'\\ 0''$");
});

test('same unit, zero, bad input', () => {
	assert.equal(copy('velocita', '50', 'km/h', 'km/h'), '50 km/h');
	assert.equal(copy('energia', '0', 'J', 'eV'), '0 eV');
	for (const [q, v, a, b] of [
		['velocita', 'abc', 'km/h', 'm/s'],
		['velocita', '', 'km/h', 'm/s'],
		['velocita', '-5', 'km/h', 'm/s'],
		['velocita', '10', 'km/h', 'XX'],
		['energia', '10', 'km/h', 'J'],
		['boh', '10', 'J', 'J'],
		['velocita', '1e5', 'km/h', 'm/s'],
		['velocita', '2000000000000000', 'km/h', 'm/s'],
		['pressione', `5'11"`, 'Pa', 'bar']
	]) {
		const o = run(q, v, a, b);
		assert.equal(o.ok, false, `${q} ${v} ${a} ${b}`);
		assertReadable(o);
	}
});

test('every string typesets and every sentence is short', () => {
	for (const [q, def] of Object.entries(CONV_QUANTITIES))
		for (const v of ['1', '0', '90', '2,5', '0,001', '123456789', '0,000000001', '999999999999999'])
			for (const a of def.units)
				for (const b of def.units) {
					const o = run(q, v, a.id, b.id);
					assert.ok(o.ok, `${q} ${v} ${a.id} → ${b.id}: ${o.error}`);
					assertReadable(o, `${q} ${v} ${a.id} → ${b.id}`);
					assertDsa(o, `${q} ${v} ${a.id} → ${b.id}`);
					assert.ok(o.steps.length <= 6, `${q} ${a.id} → ${b.id}: ${o.steps.length} steps`);
				}
	for (const v of [`5'11"`, `6'`, `0' 3"`]) assertDsa(run('lunghezza', v, 'in', 'cm'), v);
});

/** The value of a shown number, from its copy text ("6,2415 · 10¹⁸ eV", "3 600 000 J"). */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const valueOf = (text) => {
	const [num] = text.split(/ (?=[^\d·])/);
	const m = /^([\d ,]+?)(?: · 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))?$/.exec(num.trim());
	const power = m[2] ? Number([...m[2]].map((c) => (c === '⁻' ? '-' : SUP.indexOf(c))).join('')) : 0;
	return Number(m[1].replace(/ /g, '').replace(',', '.')) * 10 ** power;
};

test('every pair agrees with floating point, within the rounding shown', () => {
	for (const [q, def] of Object.entries(CONV_QUANTITIES))
		for (let i = 0; i < 60; i++) {
			const x = Math.round(Math.random() * 10 ** (1 + (i % 7))) / 100;
			const v = String(x).replace('.', ',');
			for (const a of def.units)
				for (const b of def.units) {
					const o = run(q, v, a.id, b.id);
					const want = convertFloat(q, x, a.id, b.id);
					const got = valueOf(o.copy);
					const tol = Math.max(Math.abs(want) * 5e-4, 0.005 + 1e-9);
					assert.ok(Math.abs(got - want) <= tol, `${q} ${v} ${a.id} → ${b.id}: ${o.copy} vs ${want}`);
				}
		}
});

test('round trips through the exact factors come back exact', () => {
	let checked = 0;
	for (const [q, def] of Object.entries(CONV_QUANTITIES))
		for (const a of def.units)
			for (const b of def.units) {
				const there = run(q, '12,5', a.id, b.id);
				if (!/^\$\d/.test(there.rows[0].value) || there.copy.includes('·')) continue;
				const back = run(q, there.copy.split(' ').slice(0, -1).join(''), b.id, a.id);
				assert.equal(back.copy, `12,5 ${a.text}`, `${q} ${a.id} → ${b.id} → ${a.id}`);
				checked++;
			}
	assert.ok(checked > 60, `only ${checked} round trips`);
});
