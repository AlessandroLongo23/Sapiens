// The table with joined cells of the lesson on lists and tables (src/lib/informatica/celle-unite.ts), on cases
// counted by hand. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { tabella, accanto, unisci, separa, scritte, daSopra, codice, html, tag } = await jiti.import('../../src/lib/informatica/celle-unite.ts');

const TESTI = [
	['Data', 'Luogo', 'Ingresso'],
	['12 aprile', 'Aula magna', 'gratuito'],
	['3 maggio', 'Aula magna', 'gratuito'],
	['7 giugno', 'da definire', 'da definire']
];
/** Every place of the grid is covered by one cell and no more. */
function covered(t) {
	const seen = Array.from({ length: t.righe }, () => Array(t.colonne).fill(0));
	for (const c of t.celle) for (let r = c.riga; r < c.riga + c.righe; r++) for (let k = c.colonna; k < c.colonna + c.colonne; k++) seen[r][k]++;
	assert.ok(seen.flat().every((n) => n === 1), 'each place is covered once');
	// the rule of the lesson: in every row, the colspans written plus the places taken from above make the columns
	for (let r = 0; r < t.righe; r++) assert.equal(scritte(t, r).reduce((n, c) => n + c.colonne, 0) + daSopra(t, r), t.colonne);
}

test('a new table has one cell per text', () => {
	const t = tabella(TESTI);
	assert.equal(t.celle.length, 12);
	assert.equal(t.celle.filter((c) => c.intestazione).length, 3);
	covered(t);
	assert.equal(html(t).split('\n').length - 1, 2 + 4 * 5);
	assert.throws(() => tabella([['a', 'b'], ['c']]));
});

test('joining to the right writes colspan and takes a cell out of the row', () => {
	const t = unisci(tabella(TESTI), 10, 'destra');
	covered(t);
	assert.equal(scritte(t, 3).length, 2);
	assert.equal(tag(t.celle.find((c) => c.id === 10)), '<td colspan="2">da definire</td>');
	assert.ok(!html(t).includes('<td>da definire</td>'));
	// the line of the cell taken is still listed, marked with who took it
	assert.deepEqual(codice(t).filter((riga) => riga.tolta !== undefined).map((riga) => riga.tolta), [10]);
});

test('joining downwards writes rowspan and takes a cell out of the row below', () => {
	const t = unisci(tabella(TESTI), 4, 'basso');
	covered(t);
	assert.equal(scritte(t, 1).length, 3);
	assert.equal(scritte(t, 2).length, 2);
	assert.equal(daSopra(t, 2), 1);
	assert.equal(tag(t.celle.find((c) => c.id === 4)), '<td rowspan="2">Aula magna</td>');
});

test('only rectangles, and never a heading with a data cell', () => {
	let t = tabella(TESTI);
	assert.equal(accanto(t, 1, 'basso'), null, 'th over td');
	assert.equal(accanto(t, 5, 'destra'), null, 'nothing to the right of the last column');
	assert.equal(accanto(t, 10, 'basso'), null, 'nothing under the last row');
	t = unisci(t, 4, 'basso');
	assert.equal(accanto(t, 3, 'destra'), null, 'the neighbour is two rows tall');
	assert.equal(accanto(t, 4, 'destra')?.id, undefined, 'a cell two rows tall beside one of one row');
	t = unisci(t, 5, 'basso');
	assert.equal(accanto(t, 4, 'destra')?.id, 5, 'two cells of two rows make a rectangle');
	t = unisci(t, 4, 'destra');
	covered(t);
	assert.equal(tag(t.celle.find((c) => c.id === 4)), '<td colspan="2" rowspan="2">Aula magna</td>');
	assert.equal(scritte(t, 2).length, 1);
	assert.equal(unisci(t, 0, 'basso'), t, 'a join that cannot be done changes nothing');
});

test('splitting gives back the cells and their texts', () => {
	const start = tabella(TESTI);
	let t = unisci(unisci(unisci(start, 4, 'basso'), 5, 'basso'), 4, 'destra');
	t = separa(t, 4);
	assert.deepEqual(t.celle, start.celle);
	assert.equal(separa(start, 4), start);
	assert.equal(html(t), html(start));
});
