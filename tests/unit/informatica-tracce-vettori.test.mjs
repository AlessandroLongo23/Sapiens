// The traces of the lessons on vectors and on linear search (src/lib/informatica/tracce-vettori.ts): results and
// counts on cases worked out by hand. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { scorriVettore, ricercaConPosizione, confrontiPerTrovare, confrontiInMedia } = await jiti.import('../../src/lib/informatica/tracce-vettori.ts');

const last = (trace) => trace.passi[trace.passi.length - 1];
const variable = (step, name) => step.variabili.find((v) => v.nome === name)?.valore;
const VOTI = [7, 5, 8, 6, 10];

function wellSaid(trace) {
	for (const step of trace.passi) {
		assert.ok(step.frase.length > 10 && !/undefined|NaN|—|piuttosto che/.test(step.frase), step.frase);
		for (const p of step.puntatori) assert.ok(p.su >= 0 && p.su < step.celle.length, `pointer ${p.nome} is on a cell`);
	}
}

test('the sum goes through every element once, from index 0', () => {
	const t = scorriVettore(VOTI, { calcolo: 'somma' });
	assert.equal(t.risultato, 36);
	assert.equal(t.giri, 5);
	assert.equal(t.fuori, -1);
	assert.equal(t.passi.length, 7); // before the loop, five turns, the end
	assert.deepEqual(t.passi.map((s) => variable(s, 'somma')), [0, 7, 12, 20, 26, 36, 36]);
	assert.deepEqual(t.passi.slice(1, 6).map((s) => variable(s, 'i')), [0, 1, 2, 3, 4]);
	assert.equal(variable(last(t), 'i'), 5);
	assert.ok(last(t).celle.every((c) => c.stato === 'ordinata'));
	assert.equal(t.passi[0].celle.length, 5);
	wellSaid(t);
});

test('the largest starts from the first element and the loop from index 1', () => {
	const t = scorriVettore(VOTI, { calcolo: 'massimo' });
	assert.equal(t.risultato, 10);
	assert.equal(t.giri, 4);
	assert.deepEqual(t.passi.map((s) => variable(s, 'massimo')), [7, 7, 8, 8, 10, 10]);
	assert.equal(t.passi[0].celle[0].stato, 'esame');
	// the variable is marked as written only where it changes
	assert.deepEqual(t.passi.slice(1, 5).map((s) => s.variabili.find((v) => v.nome === 'massimo').stato), ['normale', 'scritta', 'normale', 'scritta']);
	assert.equal(scorriVettore([-3, -7, -1, -5], { calcolo: 'massimo' }).risultato, -1);
	assert.equal(scorriVettore([9, 2, 4], { calcolo: 'massimo' }).risultato, 9);
	wellSaid(t);
});

test('with i <= n the loop runs once more and asks for the element of index n', () => {
	for (const calcolo of ['somma', 'massimo']) {
		const t = scorriVettore(VOTI, { calcolo, oltre: true });
		assert.equal(t.risultato, null);
		assert.equal(t.fuori, 5);
		assert.equal(t.giri, calcolo === 'somma' ? 6 : 5);
		assert.ok(t.passi.every((s) => s.celle.length === 6), 'the cell outside the vector is there at every step');
		assert.equal(last(t).celle[5].stato, 'esame');
		assert.deepEqual(last(t).puntatori, [{ nome: 'i', su: 5 }]);
		assert.equal(variable(last(t), calcolo), '?');
		assert.match(last(t).frase, /voti\[5\], che non esiste/);
		assert.match(last(t).frase, /i <= 5/);
		wellSaid(t);
	}
});

test('the search that stops finds the first occurrence', () => {
	const v = [12, 7, 25, 3, 18, 9, 31, 14];
	const found = ricercaConPosizione(v, 18);
	assert.equal(found.posizione, 4);
	assert.equal(found.confronti, 5);
	assert.equal(found.passi.length, 6); // the start and five comparisons
	assert.equal(last(found).celle[4].stato, 'trovata');
	assert.deepEqual(found.passi.map((s) => s.contatori.posizione), [-1, -1, -1, -1, -1, 4]);
	assert.match(last(found).frase, /5 confronti/);
	wellSaid(found);

	const first = ricercaConPosizione(v, 12);
	assert.equal(first.posizione, 0);
	assert.equal(first.confronti, 1);
	assert.match(last(first).frase, /1 confronto\b/);

	const absent = ricercaConPosizione(v, 50);
	assert.equal(absent.posizione, -1);
	assert.equal(absent.confronti, 8);
	assert.ok(last(absent).celle.every((c) => c.stato === 'scartata'));
	assert.match(last(absent).frase, /non c'è/);
	assert.match(last(absent).frase, /8 confronti/);
	wellSaid(absent);

	const twice = ricercaConPosizione([4, 9, 2, 9, 5], 9);
	assert.equal(twice.posizione, 1);
	assert.equal(twice.confronti, 2);
});

test('the search that goes on looks at every element and keeps the last occurrence', () => {
	const twice = ricercaConPosizione([4, 9, 2, 9, 5], 9, { ferma: false });
	assert.equal(twice.posizione, 3);
	assert.equal(twice.confronti, 5);
	assert.equal(twice.passi.length, 7); // the start, five comparisons, the end
	assert.deepEqual(last(twice).celle.map((c) => c.stato), ['scartata', 'trovata', 'scartata', 'trovata', 'scartata']);
	assert.match(last(twice).frase, /ultimo 9/);
	wellSaid(twice);

	const absent = ricercaConPosizione([4, 9, 2], 7, { ferma: false });
	assert.equal(absent.posizione, -1);
	assert.equal(absent.confronti, 3);
});

test('comparisons by place: one more than the index, n when the value is not there', () => {
	assert.equal(confrontiPerTrovare(8, 0), 1);
	assert.equal(confrontiPerTrovare(8, 7), 8);
	assert.equal(confrontiPerTrovare(8, -1), 8);
	for (let k = 0; k < 8; k++) assert.equal(confrontiPerTrovare(8, k), ricercaConPosizione([10, 11, 12, 13, 14, 15, 16, 17], 10 + k).confronti);
	assert.equal(confrontiInMedia(8), 4.5);
	assert.equal(confrontiInMedia(9), 5);
	// the mean of 1, 2, ..., n
	assert.equal(confrontiInMedia(6), (1 + 2 + 3 + 4 + 5 + 6) / 6);
});
