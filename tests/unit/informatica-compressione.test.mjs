// The compressions of the computer science figures (src/lib/informatica/compressione.ts), on cases counted by hand.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { sequenze, codificaRle, decodificaRle, pesoRle, passiQuantizzazione, comprimiCanale, comprimiImmagine } = await jiti.import('../../src/lib/informatica/compressione.ts');

test('the runs of a row', () => {
	assert.deepEqual(sequenze([...'BBBBBNNNBB']), [
		{ simbolo: 'B', quanti: 5, da: 0 },
		{ simbolo: 'N', quanti: 3, da: 5 },
		{ simbolo: 'B', quanti: 2, da: 8 }
	]);
	assert.deepEqual(sequenze([]), []);
	assert.equal(sequenze([...'BNBN']).length, 4);
});

test('run-length encoding as the lesson writes it', () => {
	assert.equal(codificaRle('BBBBBNNNBB'), '5B3N2B');
	assert.equal(codificaRle('BNBNBN'), '1B1N1B1N1B1N');
	assert.equal(codificaRle(''), '');
	assert.equal(codificaRle('A'.repeat(12)), '12A');
	// encoding a code makes it longer: the lesson's example of compressing twice
	assert.equal(codificaRle('5B3N2B'), '151B131N121B');
});

test('decoding gives the text back', () => {
	assert.equal(decodificaRle('5B3N2B'), 'BBBBBNNNBB');
	assert.equal(decodificaRle('12A'), 'A'.repeat(12));
	assert.equal(decodificaRle(''), '');
	assert.equal(decodificaRle('B5'), null);
	for (const text of ['RRRRBBNNNNNNRB', 'N', 'BNBNBNBN', 'VVVVVVVVVVVVVVVV']) assert.equal(decodificaRle(codificaRle(text)), text);
});

test('the weight of a row and of its code', () => {
	assert.deepEqual(pesoRle([...'BBBBBBBBNNNNRRRR']), { originale: 16, compressa: 6, sequenze: 3 });
	// eight runs in sixteen pixels: no gain; more, and the code is longer than the row
	assert.deepEqual(pesoRle([...'BBNNBBNNBBNNBBNN']), { originale: 16, compressa: 16, sequenze: 8 });
	assert.deepEqual(pesoRle([...'BNBNBNBNBNBNBNBN']), { originale: 16, compressa: 32, sequenze: 16 });
});

test('the quantisation steps', () => {
	// at quality 50 the table of the standard, at 100 every step is 1
	assert.equal(passiQuantizzazione(50)[0][0], 16);
	assert.equal(passiQuantizzazione(50)[7][7], 99);
	assert.ok(passiQuantizzazione(100).flat().every((s) => s === 1));
	assert.ok(passiQuantizzazione(10)[0][0] > passiQuantizzazione(90)[0][0]);
});

const flat = Array.from({ length: 16 }, () => new Array(16).fill(200));
const noisy = Array.from({ length: 16 }, (_, r) => Array.from({ length: 16 }, (_, c) => (r * 37 + c * 91 + ((r * c) % 7) * 23) % 256));
const error = (a, b) => Math.max(...a.flatMap((row, r) => row.map((x, c) => Math.abs(x - b[r][c]))));

test('a flat channel keeps one number per block and comes back as it was', () => {
	const out = comprimiCanale(flat, 50);
	assert.equal(out.diversiDaZero, 4);
	assert.equal(out.numeri, 256);
	assert.deepEqual(out.valori, flat);
});

test('lower quality keeps fewer numbers and is further from the original', () => {
	const high = comprimiCanale(noisy, 95), low = comprimiCanale(noisy, 10);
	assert.ok(low.diversiDaZero < high.diversiDaZero);
	assert.ok(error(low.valori, noisy) > error(high.valori, noisy));
	// at quality 100 only the rounding is lost
	assert.ok(error(comprimiCanale(noisy, 100).valori, noisy) <= 2);
	for (const row of low.valori) for (const x of row) assert.ok(Number.isInteger(x) && x >= 0 && x <= 255);
});

test('an image is three channels', () => {
	const image = noisy.map((row, r) => row.map((x, c) => [x, flat[r][c], 255 - x]));
	const out = comprimiImmagine(image, 50);
	assert.equal(out.numeri, 3 * 256);
	assert.equal(out.immagine.length, 16);
	assert.deepEqual(out.immagine.map((row) => row.map((p) => p[1])), flat);
	assert.throws(() => comprimiCanale([[1, 2, 3]], 50));
});
