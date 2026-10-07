// The traces of the figures on matrices and strings (src/lib/informatica/tracce-matrici-stringhe.ts): results and
// counts on cases worked out by hand. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { sommeMatrice, passoDi, contaVocali, controllaPalindroma, leggiParola } = await jiti.import('../../src/lib/informatica/tracce-matrici-stringhe.ts');

const VOTI = [
	[7, 8, 6, 9],
	[5, 6, 7, 6],
	[8, 9, 9, 10]
];
const last = (trace) => trace.passi[trace.passi.length - 1];
const clean = (trace) => trace.passi.forEach((p) => assert.ok(p.frase.length > 10 && !/undefined|NaN|null|—|piuttosto che/.test(p.frase), p.frase));

test('sums by rows of the marks of the lesson', () => {
	const t = sommeMatrice(VOTI, 'righe');
	assert.deepEqual(t.somme, [30, 24, 36]);
	// the opening, then for each of 3 rows: the reset, 4 additions, the writing; then the end
	assert.equal(t.passi.length, 1 + 3 * (1 + 4 + 1) + 1);
	assert.deepEqual(last(t).uscita, [30, 24, 36]);
	clean(t);
});

test('sums by columns: j is the outer index, i the inner one', () => {
	const t = sommeMatrice(VOTI, 'colonne');
	assert.deepEqual(t.somme, [20, 23, 22, 25]);
	assert.equal(t.passi.length, 1 + 4 * (1 + 3 + 1) + 1);
	const added = t.passi.filter((p) => p.i !== null && p.j !== null).map((p) => [p.i, p.j]);
	assert.deepEqual(added.slice(0, 4), [[0, 0], [1, 0], [2, 0], [0, 1]]);
	clean(t);
});

test('every element is added once, and its cell is the one in exam', () => {
	for (const verso of ['righe', 'colonne']) {
		const t = sommeMatrice(VOTI, verso);
		for (let r = 0; r < 3; r++)
			for (let c = 0; c < 4; c++) {
				const k = passoDi(t.passi, r, c);
				assert.ok(k > 0);
				assert.equal(t.passi.filter((p) => p.i === r && p.j === c).length, 1);
				assert.equal(t.passi[k].stati[r][c], 'esame');
				assert.equal(t.passi[k].stati.flat().filter((s) => s === 'esame').length, 1);
			}
		assert.ok(last(t).stati.flat().every((s) => s === 'ordinata'));
	}
});

test('the running sum of a row', () => {
	const t = sommeMatrice(VOTI, 'righe');
	assert.deepEqual(t.passi.filter((p) => p.i === 1 && p.j !== null).map((p) => p.somma), [5, 11, 18, 24]);
});

test('a square matrix and a single row', () => {
	assert.deepEqual(sommeMatrice([[1, 2], [3, 4]], 'colonne').somme, [4, 6]);
	assert.deepEqual(sommeMatrice([[1, 2, 3]], 'righe').somme, [6]);
});

test('counting vowels', () => {
	const t = contaVocali('aiuola');
	assert.equal(t.vocali, 5);
	assert.equal(t.passi.length, 6 + 2);
	assert.deepEqual(t.passi.map((p) => p.contatori.vocali), [0, 1, 2, 3, 4, 4, 5, 5]);
	assert.equal(contaVocali('informatica').vocali, 5);
	assert.equal(contaVocali('gnr').vocali, 0);
	assert.deepEqual(last(contaVocali('casa')).celle.map((c) => c.stato), ['scartata', 'ordinata', 'scartata', 'ordinata']);
	clean(t);
	clean(contaVocali('re'));
});

test('palindromes: comparisons are half the length, rounded down', () => {
	const cases = { anna: 2, radar: 2, ossesso: 3, aa: 1, kayak: 2, ingegni: 3 };
	for (const [word, n] of Object.entries(cases)) {
		const t = controllaPalindroma(word);
		assert.equal(t.palindroma, true, word);
		assert.equal(t.confronti, n, word);
		assert.equal(t.passi.length, n + 2, word);
		assert.ok(last(t).celle.every((c) => c.stato === 'ordinata'));
		clean(t);
	}
});

test('not a palindrome: it stops at the first pair that differs', () => {
	const t = controllaPalindroma('casa');
	assert.equal(t.palindroma, false);
	assert.equal(t.confronti, 1);
	const u = controllaPalindroma('radio');
	assert.equal(u.confronti, 1);
	const v = controllaPalindroma('abcxba');
	assert.equal(v.palindroma, false);
	assert.equal(v.confronti, 3);
	assert.deepEqual(last(v).celle.map((c) => c.stato), ['ordinata', 'ordinata', 'scambio', 'scambio', 'ordinata', 'ordinata']);
	clean(v);
});

test('the two indices stay on the word', () => {
	for (const word of ['anna', 'radar', 'casa', 'ab', 'aa', 'otto', 'abcdefghijkl']) {
		for (const p of controllaPalindroma(word).passi) for (const q of p.puntatori) assert.ok(q.su >= 0 && q.su < word.length, `${word}: ${q.nome}`);
		for (const p of contaVocali(word).passi) for (const q of p.puntatori) assert.ok(q.su >= 0 && q.su < word.length, `${word}: ${q.nome}`);
	}
});

test('reading a word', () => {
	assert.equal(leggiParola(' Radar ').parola, 'radar');
	assert.equal(leggiParola('a').parola, null);
	assert.equal(leggiParola('due parole').parola, null);
	assert.equal(leggiParola('città').parola, null);
	assert.equal(leggiParola('abcdefghijklm').parola, null);
});
