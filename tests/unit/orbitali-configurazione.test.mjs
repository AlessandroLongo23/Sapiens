// The electron configuration on the table of sublevels: the filling order, the electrons of each element, Hund's rule.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ELEMENTI, elementBySymbol } = await jiti.import('../../src/lib/tools/tavola-periodica.ts');
const { FILLING_ORDER, boxOccupation, capacity, diagonalConfiguration, electronsBySublevel, isException, unpaired } = await jiti.import('../../src/lib/orbitali/configurazione.ts');

const el = (s) => elementBySymbol(s);
const total = (map) => [...map.values()].reduce((a, b) => a + b, 0);

test('the rule of the diagonal gives the order of the books, and room for 118 electrons', () => {
	assert.deepEqual(
		FILLING_ORDER.map((s) => s.name),
		['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']
	);
	assert.deepEqual([0, 1, 2, 3].map(capacity), [2, 6, 10, 14]);
	assert.equal(FILLING_ORDER.reduce((n, s) => n + capacity(s.l), 0), 118);
});

test('the electrons of every element add up to its atomic number, and no sublevel is overfull', () => {
	for (const e of ELEMENTI) {
		const map = electronsBySublevel(e);
		assert.equal(total(map), e.z, e.symbol);
		for (const [name, count] of map) {
			assert.ok(FILLING_ORDER.some((s) => s.name === name), `${e.symbol}: ${name} is not in the table`);
			assert.ok(count >= 1 && count <= capacity('spdf'.indexOf(name[1])), `${e.symbol}: ${name}${count}`);
		}
		assert.equal(total(diagonalConfiguration(e.z)), e.z);
	}
	assert.deepEqual([...electronsBySublevel(el('Fe'))], [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 6]]);
	assert.deepEqual(Object.fromEntries(diagonalConfiguration(26)), { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 6 });
});

test('the exceptions to the rule are the known ones', () => {
	// The first 20 elements follow the rule; chromium and copper are the first that do not.
	for (const e of ELEMENTI.slice(0, 20)) assert.ok(!isException(e), e.symbol);
	for (const s of ['Cr', 'Cu', 'Nb', 'Mo', 'Ru', 'Rh', 'Pd', 'Ag', 'La', 'Ce', 'Gd', 'Pt', 'Au']) assert.ok(isException(el(s)), s);
	for (const s of ['Fe', 'Zn', 'Br', 'Kr', 'Sr', 'I', 'Xe', 'Hg', 'Pb']) assert.ok(!isException(el(s)), s);
	assert.equal(electronsBySublevel(el('Cr')).get('3d'), 5);
	assert.equal(electronsBySublevel(el('Cr')).get('4s'), 1);
	assert.equal(electronsBySublevel(el('Cu')).get('3d'), 10);
});

test("Hund's rule: one electron per box first, then the pairs", () => {
	assert.deepEqual(boxOccupation(1, 0), [0, 0, 0]);
	assert.deepEqual(boxOccupation(1, 2), [1, 1, 0]);
	assert.deepEqual(boxOccupation(1, 3), [1, 1, 1]);
	assert.deepEqual(boxOccupation(1, 4), [2, 1, 1]);
	assert.deepEqual(boxOccupation(1, 6), [2, 2, 2]);
	assert.deepEqual(boxOccupation(0, 1), [1]);
	assert.deepEqual(boxOccupation(2, 6), [2, 1, 1, 1, 1]);
	for (let l = 0; l <= 3; l++) for (let e = 0; e <= capacity(l); e++) assert.equal(boxOccupation(l, e).reduce((a, b) => a + b, 0), e);
	// Unpaired electrons: nitrogen 3, oxygen 2, iron 4, chromium 6, neon 0.
	assert.deepEqual(['N', 'O', 'Fe', 'Cr', 'Ne', 'H'].map((s) => unpaired(el(s))), [3, 2, 4, 6, 0, 1]);
});
