// The traces of the figures on files (src/lib/informatica/file-righe.ts, csv-campi.ts): results on cases counted by hand.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { letturaRighe, A_CAPO } = await jiti.import('../../src/lib/informatica/file-righe.ts');
const { dividi, tracciaCsv } = await jiti.import('../../src/lib/informatica/csv-campi.ts');

test('reading rows: the file of the lesson', () => {
	const { passi, somma, quanti } = letturaRighe('8\n10\n6\n7\n');
	assert.equal(somma, 31);
	assert.equal(quanti, 4);
	assert.equal(passi.length, 6, 'the start, one step per row, the end');
	// nine characters and the cell of the end of the file
	for (const passo of passi) assert.equal(passo.celle.length, 10);
	assert.deepEqual(passi[0].celle.map((c) => c.valore), ['8', A_CAPO, '1', '0', A_CAPO, '6', A_CAPO, '7', A_CAPO, '']);
	assert.deepEqual(passi.map((p) => p.puntatori[0].su), [0, 2, 5, 7, 9, 9], 'the placeholder stops after each line break');
	assert.deepEqual(passi.slice(1, 5).map((p) => p.variabili.find((v) => v.nome === 'riga').valore), ['"8"', '"10"', '"6"', '"7"']);
	assert.deepEqual(passi.slice(1, 5).map((p) => p.variabili.find((v) => v.nome === 'somma').valore), [8, 18, 24, 31]);
	// in the second step the row "10" is being read and the first row is behind
	assert.deepEqual(passi[2].celle.map((c) => c.stato), ['ordinata', 'ordinata', 'esame', 'esame', 'esame', 'normale', 'normale', 'normale', 'normale', 'scartata']);
	assert.match(passi[5].frase, /31 : 4 = 7,75/);
	for (const passo of passi) assert.ok(passo.frase.length > 20 && !/undefined|NaN|—/.test(passo.frase), passo.frase);
});

test('reading rows: what is not rows of digits is refused', () => {
	assert.throws(() => letturaRighe('8\n10'));
	assert.throws(() => letturaRighe(''));
	assert.throws(() => letturaRighe('otto\n'));
});

test('splitting a row at a separator', () => {
	assert.deepEqual(dividi('Anna,matematica,8', ','), ['Anna', 'matematica', '8']);
	assert.deepEqual(dividi('Anna,matematica,8', ';'), ['Anna,matematica,8'], 'the wrong separator leaves one field');
	assert.deepEqual(dividi('Sara;fisica;7,5', ';'), ['Sara', 'fisica', '7,5']);
	assert.deepEqual(dividi('Sara,fisica,7,5', ','), ['Sara', 'fisica', '7', '5'], 'a decimal comma is cut too');
	assert.deepEqual(dividi('a,,b', ','), ['a', '', 'b'], 'an empty field is still a field');
});

test('the steps of a CSV file', () => {
	const testo = 'nome,materia,voto\nAnna,matematica,8\nLuca,fisica,6\n';
	const { passi, colonne, righe } = tracciaCsv(testo, ',');
	assert.deepEqual(colonne, ['nome', 'materia', 'voto']);
	assert.deepEqual(righe, [
		['Anna', 'matematica', '8'],
		['Luca', 'fisica', '6']
	]);
	// the start, then for each of the three rows: the row is read, the row is cut
	assert.equal(passi.length, 1 + 3 * 2);
	assert.equal(passi[0].riga, -1);
	assert.deepEqual(passi.map((p) => p.riga), [-1, 0, 0, 1, 1, 2, 2]);
	assert.deepEqual(passi.map((p) => p.tagliata), [false, false, true, false, true, false, true]);
	assert.deepEqual(passi.map((p) => p.righeInTabella), [0, 0, 0, 0, 1, 1, 2], 'the header fills the names of the columns, each other row a row of the table');
	assert.deepEqual(passi[2].campi, ['nome', 'materia', 'voto']);
	assert.deepEqual(passi[4].campi, ['Anna', 'matematica', '8']);
	for (const passo of passi) assert.ok(passo.frase.length > 20 && !/undefined|NaN|—/.test(passo.frase), passo.frase);
	// with the wrong separator every row is one field, and the sentence says so
	const sbagliato = tracciaCsv(testo, ';');
	assert.deepEqual(sbagliato.colonne, ['nome,materia,voto']);
	assert.match(sbagliato.passi[4].frase, /un solo campo/);
	// a row with more fields than the header is told apart
	const virgola = tracciaCsv('nome,voto\nSara,7,5\n', ',');
	assert.match(virgola.passi[4].frase, /3 campi/);
	assert.equal(virgola.passi[4].storta, true);
});
