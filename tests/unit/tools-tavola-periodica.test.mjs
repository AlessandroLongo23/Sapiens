// The periodic table: the data file against the molar mass tool, the grid, the states and the trends.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ELEMENTS } = await jiti.import('../../src/lib/tools/chimica.ts');
const { ELEMENTI, FAMILIES, TRENDS, ZERO_CELSIUS, SERIES_CELLS, celsius, configParts, elementBySymbol, gridPlace, num, stateAt, trendRange, trendRanks, trendText, withUnit } = await jiti.import(
	'../../src/lib/tools/tavola-periodica.ts'
);

const el = (symbol) => elementBySymbol(symbol);
const ROOM = 25 + ZERO_CELSIUS;

test('the table has the 118 elements of the molar mass tool, with the same names and masses', () => {
	assert.equal(ELEMENTI.length, 118);
	ELEMENTI.forEach((e, i) => {
		const own = ELEMENTS[i];
		assert.equal(e.z, i + 1);
		assert.equal(e.symbol, own.symbol);
		assert.equal(e.name, own.name);
		const mass = own.radioactive ? `[${own.mass.n}]` : (Number(own.mass.n) / Number(own.mass.d)).toFixed(2).replace('.', ',');
		assert.equal(e.mass, mass, e.symbol);
	});
});

test('every element has its own cell, and none falls on the cells of the two series', () => {
	const seen = new Set();
	for (const e of ELEMENTI) {
		const { row, col } = gridPlace(e);
		assert.ok(col >= 1 && col <= 18 && row >= 1 && row <= 10 && row !== 8, e.symbol);
		const key = `${row}:${col}`;
		assert.ok(!seen.has(key), `${e.symbol} on ${key}`);
		seen.add(key);
	}
	for (const cell of SERIES_CELLS) assert.ok(!seen.has(`${cell.row}:${cell.col}`));
});

test('groups, periods and blocks of known elements', () => {
	const place = (s) => [el(s).period, el(s).group, el(s).block];
	assert.deepEqual(place('H'), [1, 1, 's']);
	assert.deepEqual(place('He'), [1, 18, 's']);
	assert.deepEqual(place('C'), [2, 14, 'p']);
	assert.deepEqual(place('Al'), [3, 13, 'p']);
	assert.deepEqual(place('Fe'), [4, 8, 'd']);
	assert.deepEqual(place('Zn'), [4, 12, 'd']);
	assert.deepEqual(place('Br'), [4, 17, 'p']);
	assert.deepEqual(place('Ba'), [6, 2, 's']);
	assert.deepEqual(place('La'), [6, null, 'd']);
	assert.deepEqual(place('Ce'), [6, null, 'f']);
	assert.deepEqual(place('Ac'), [7, null, 'd']);
	assert.deepEqual(place('Lu'), [6, null, 'f']);
	assert.deepEqual(place('Hf'), [6, 4, 'd']);
	assert.deepEqual(place('Au'), [6, 11, 'd']);
	assert.deepEqual(place('Rn'), [6, 18, 'p']);
	assert.deepEqual(place('U'), [7, null, 'f']);
	assert.deepEqual(place('Rf'), [7, 4, 'd']);
	assert.deepEqual(place('Og'), [7, 18, 'p']);
	assert.deepEqual(gridPlace(el('La')), { row: 9, col: 3 });
	assert.deepEqual(gridPlace(el('Lr')), { row: 10, col: 17 });
});

test('families: six alkali metals, six halogens, seven noble gases, fifteen in each series', () => {
	const count = (id) => ELEMENTI.filter((e) => e.family === id).length;
	assert.equal(count('alcalini'), 6);
	assert.equal(count('alogeni'), 6);
	assert.equal(count('gas-nobili'), 7);
	assert.equal(count('lantanidi'), 15);
	assert.equal(count('attinidi'), 15);
	assert.equal(FAMILIES.reduce((n, f) => n + count(f.id), 0), 118);
});

test('at 25 °C mercury and bromine are the only liquids, and eleven elements are gases', () => {
	const at = (id) => ELEMENTI.filter((e) => stateAt(e, ROOM) === id).map((e) => e.symbol);
	assert.deepEqual(at('l'), ['Br', 'Hg']);
	assert.deepEqual(at('g').sort(), ['Ar', 'Cl', 'F', 'H', 'He', 'Kr', 'N', 'Ne', 'O', 'Rn', 'Xe']);
	// Where both points are known, the state worked out agrees with the one in the data.
	for (const e of ELEMENTI) if (e.melting !== null && e.boiling !== null) assert.equal(stateAt(e, ROOM), e.state, e.symbol);
});

test('the state follows the temperature', () => {
	assert.equal(stateAt(el('Fe'), 1500 + ZERO_CELSIUS), 's');
	assert.equal(stateAt(el('Fe'), 1600 + ZERO_CELSIUS), 'l');
	assert.equal(stateAt(el('Fe'), 3000 + ZERO_CELSIUS), 'g');
	assert.equal(stateAt(el('N'), -200 + ZERO_CELSIUS), 'l');
	assert.equal(stateAt(el('N'), -215 + ZERO_CELSIUS), 's');
	assert.equal(stateAt(el('Ga'), 35 + ZERO_CELSIUS), 'l');
	// Arsenic and carbon sublime: never liquid at 1 atm.
	for (let t = 0; t < 6000; t += 50) {
		assert.notEqual(stateAt(el('As'), t), 'l');
		assert.notEqual(stateAt(el('C'), t), 'l');
	}
	assert.equal(stateAt(el('C'), 3700 + ZERO_CELSIUS), 's');
	assert.equal(stateAt(el('C'), 3900 + ZERO_CELSIUS), 'g');
	assert.equal(stateAt(el('As'), 600 + ZERO_CELSIUS), 's');
	assert.equal(stateAt(el('As'), 620 + ZERO_CELSIUS), 'g');
	assert.equal(stateAt(el('Og'), ROOM), '?');
	// Helium never freezes at 1 atm; at absolute zero nothing else with a known point is a gas or a liquid.
	assert.equal(stateAt(el('He'), 0), 'l');
	assert.equal(stateAt(el('He'), 5), 'g');
	for (const e of ELEMENTI) if (e.symbol !== 'He') assert.ok(['s', '?'].includes(stateAt(e, 0)), e.symbol);
	// Each block holds what its sublevel can: 14 per row in f, 10 per row in d.
	assert.equal(ELEMENTI.filter((e) => e.block === 'f').length, 28);
	assert.equal(ELEMENTI.filter((e) => e.block === 'd').length, 40);
	// Sublevels in the order they fill.
	assert.equal(el('Cr').config, '[Ar] 4s1 3d5');
	assert.equal(el('Cu').config, '[Ar] 4s1 3d10');
	assert.equal(el('Fe').config, '[Ar] 4s2 3d6');
	assert.equal(el('Pb').config, '[Xe] 6s2 4f14 5d10 6p2');
});

test('the trends have the extremes the books give', () => {
	const top = (id) => {
		const trend = TRENDS.find((t) => t.id === id);
		return ELEMENTI.filter((e) => trend.value(e) !== null).sort((a, b) => trend.value(b) - trend.value(a))[0].symbol;
	};
	assert.equal(top('elettronegativita'), 'F');
	assert.equal(top('ionizzazione'), 'He');
	for (const trend of TRENDS) {
		const range = trendRange(trend);
		assert.ok(range.min < range.max);
		const ranks = trendRanks(trend);
		const withValue = ELEMENTI.filter((e) => trend.value(e) !== null);
		assert.equal(ranks.size, withValue.length);
		// The rank follows the value: 0 for the lowest, 1 for the highest, equal values the same.
		for (const a of withValue) for (const b of withValue) assert.equal(Math.sign(ranks.get(a.z) - ranks.get(b.z)), Math.sign(trend.value(a) - trend.value(b)));
		assert.equal(Math.min(...ranks.values()), 0);
		assert.equal(Math.max(...ranks.values()), 1);
	}
	const en = TRENDS.find((t) => t.id === 'elettronegativita');
	assert.equal(trendText(en, 2), '2,00');
	assert.equal(trendText(en, 1.9), '1,90');
	assert.equal(withUnit(TRENDS[0], 116), '116\u00a0pm');
	// The radius grows down group 1 and shrinks along period 2 up to oxygen.
	const r = (s) => el(s).radius;
	assert.ok(r('Li') < r('Na') && r('Na') < r('K') && r('K') < r('Rb') && r('Rb') < r('Cs'));
	assert.ok(r('Li') > r('Be') && r('Be') > r('B') && r('B') > r('C') && r('C') > r('N') && r('N') > r('O'));
	// First ionisation energies as in the books, within 1 kJ/mol.
	assert.ok(Math.abs(el('H').ionization - 1312) < 1);
	assert.ok(Math.abs(el('Na').ionization - 496) < 1);
});

test('isotopes: abundances add up to 100, and elements with no stable isotope have none', () => {
	for (const e of ELEMENTI) {
		if (!e.isotopes.length) continue;
		const sum = e.isotopes.reduce((n, [, share]) => n + share, 0);
		assert.ok(Math.abs(sum - 100) < 0.02, `${e.symbol}: ${sum}`);
	}
	assert.deepEqual(el('Cl').isotopes.map(([a]) => a), [35, 37]);
	assert.equal(el('Sn').isotopes.length, 10);
	assert.equal(el('Tc').isotopes.length, 0);
	assert.equal(el('F').isotopes.length, 1);
});

test('numbers and configurations are written the Italian way', () => {
	assert.equal(num(1.83), '1,83');
	assert.equal(num(1312), '1312');
	assert.equal(num(12345), '12 345');
	assert.equal(num(-39), '−39');
	assert.equal(celsius(1811), '1538');
	assert.equal(celsius(234.32), '−39');
	assert.deepEqual(configParts('[Ar] 4s2 3d6'), [{ text: '[Ar]' }, { text: '4s', electrons: '2' }, { text: '3d', electrons: '6' }]);
	assert.deepEqual(configParts('1s1'), [{ text: '1s', electrons: '1' }]);
	for (const e of ELEMENTI) for (const part of configParts(e.config)) assert.ok(part.electrons || /^\[[A-Z][a-z]?\]$/.test(part.text), `${e.symbol}: ${e.config}`);
	// The electrons of a configuration add up to the atomic number.
	const core = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 };
	for (const e of ELEMENTI) {
		const total = configParts(e.config).reduce((n, p) => n + (p.electrons ? Number(p.electrons) : core[p.text.slice(1, -1)]), 0);
		assert.equal(total, e.z, `${e.symbol}: ${e.config}`);
	}
});
