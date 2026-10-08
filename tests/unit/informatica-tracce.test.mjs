// The traces of the computer science figures (src/lib/informatica/tracce.ts): results and counts on known cases.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ricercaSequenziale, ricercaBinaria, ordinamentoPerSelezione, ordinamentoABolle, ordinamentoPerInserimento, leggiValori, mescola, casuale, MAX_CELLE } = await jiti.import('../../src/lib/informatica/tracce.ts');

const sorted = (xs) => [...xs].sort((a, b) => a - b);
const inversions = (xs) => xs.reduce((s, x, i) => s + xs.slice(i + 1).filter((y) => y < x).length, 0);
const random = casuale(2026);
const randomArray = () => Array.from({ length: 2 + Math.floor(random() * 11) }, () => Math.floor(random() * 30));
const last = (trace) => trace.passi[trace.passi.length - 1];
const valuesOf = (step) => step.celle.map((c) => c.valore);

/** What every trace must keep at every step: the same elements, counters that never go down, a sentence. */
function wellFormed(trace, input) {
	let before = {};
	for (const step of trace.passi) {
		assert.deepEqual(sorted(valuesOf(step)), sorted(input), 'a step has the elements of the input');
		assert.deepEqual(step.celle.map((c) => c.id).sort((a, b) => a - b), input.map((_, i) => i), 'ids are the starting places');
		for (const c of step.celle) assert.equal(c.valore, input[c.id], 'an id keeps its value');
		for (const p of step.puntatori) assert.ok(p.su >= 0 && p.su < input.length, `pointer ${p.nome} is on a cell`);
		for (const [name, n] of Object.entries(step.contatori)) assert.ok(n >= (before[name] ?? 0), `${name} never goes down`);
		before = step.contatori;
		assert.ok(step.frase.length > 10 && !/undefined|NaN|—/.test(step.frase), step.frase);
	}
	assert.deepEqual(valuesOf(trace.passi[0]), input, 'the first step is the input');
	assert.deepEqual(valuesOf(last(trace)), trace.valori, 'the last step is the result');
}

test('linear search finds the first occurrence and counts one comparison per element', () => {
	const v = [7, 3, 9, 1, 9, 4];
	const found = ricercaSequenziale(v, 9);
	assert.equal(found.posizione, 2);
	assert.equal(found.confronti, 3);
	assert.equal(found.passi.length, 4); // the start and three comparisons
	assert.equal(last(found).celle[2].stato, 'trovata');
	assert.deepEqual(last(found).celle.slice(0, 2).map((c) => c.stato), ['scartata', 'scartata']);
	wellFormed(found, v);

	const first = ricercaSequenziale(v, 7);
	assert.equal(first.posizione, 0);
	assert.equal(first.confronti, 1);

	const absent = ricercaSequenziale(v, 5);
	assert.equal(absent.posizione, -1);
	assert.equal(absent.confronti, 6);
	assert.ok(last(absent).celle.every((c) => c.stato === 'scartata'));
	assert.match(last(absent).frase, /non c'è/);
	assert.match(last(absent).frase, /6 confronti/);
	wellFormed(absent, v);
});

test('binary search halves a sorted array', () => {
	const v = [2, 5, 8, 12, 16, 23, 38, 56];
	const cases = [
		// value, index, comparisons: centres 3, then 5, 4 or 1, 0 ...
		[12, 3, 1],
		[23, 5, 2],
		[16, 4, 3],
		[2, 0, 3],
		[56, 7, 4],
		[1, -1, 3],
		[60, -1, 4],
		[13, -1, 3]
	];
	for (const [value, index, comparisons] of cases) {
		const trace = ricercaBinaria(v, value);
		assert.equal(trace.posizione, index, `index of ${value}`);
		assert.equal(trace.confronti, comparisons, `comparisons for ${value}`);
		wellFormed(trace, v);
	}
	assert.match(last(ricercaBinaria(v, 13)).frase, /non c'è/);
	// never more than ⌊log2 n⌋ + 1 comparisons, and the same answer as indexOf when values are distinct
	for (let n = 1; n <= MAX_CELLE; n++) {
		const xs = Array.from({ length: n }, (_, i) => 3 * i + 1);
		for (let value = 0; value <= 3 * n + 1; value++) {
			const trace = ricercaBinaria(xs, value);
			assert.equal(trace.posizione, xs.indexOf(value));
			assert.ok(trace.confronti <= Math.floor(Math.log2(n)) + 1);
		}
	}
});

test('selection sort always makes n(n-1)/2 comparisons and swaps only what is out of place', () => {
	const v = [64, 25, 12, 22, 11];
	const trace = ordinamentoPerSelezione(v);
	assert.deepEqual(trace.valori, [11, 12, 22, 25, 64]);
	assert.equal(trace.confronti, 10);
	assert.equal(trace.scambi, 3); // 11↔64, 12↔25, 22↔25; then 25 and 64 are in place
	assert.deepEqual(last(trace).contatori, { confronti: 10, scambi: 3 });
	wellFormed(trace, v);

	const already = ordinamentoPerSelezione([1, 2, 3, 4, 5, 6]);
	assert.equal(already.confronti, 15);
	assert.equal(already.scambi, 0);
	assert.match(last(already).frase, /nessuno scambio/);

	const reversed = ordinamentoPerSelezione([5, 4, 3, 2, 1]);
	assert.equal(reversed.confronti, 10);
	assert.equal(reversed.scambi, 2);

	// a swap moves the two cells and marks them
	const swap = trace.passi.find((s) => s.celle.some((c) => c.stato === 'scambio'));
	assert.deepEqual(valuesOf(swap), [11, 25, 12, 22, 64]);
	assert.deepEqual(swap.celle.filter((c) => c.stato === 'scambio').map((c) => c.id), [4, 0]);
});

test('bubble sort with and without the flag', () => {
	const v = [5, 1, 4, 2, 8];
	const plain = ordinamentoABolle(v);
	assert.deepEqual(plain.valori, [1, 2, 4, 5, 8]);
	assert.equal(plain.confronti, 10);
	assert.equal(plain.scambi, 4);
	wellFormed(plain, v);

	// passes: 4 comparisons (3 swaps), 3 comparisons (1 swap), 2 comparisons (none): stop
	const flagged = ordinamentoABolle(v, { bandierina: true });
	assert.deepEqual(flagged.valori, [1, 2, 4, 5, 8]);
	assert.equal(flagged.confronti, 9);
	assert.equal(flagged.scambi, 4);
	wellFormed(flagged, v);

	const already = [1, 2, 3, 4, 5, 6];
	assert.equal(ordinamentoABolle(already).confronti, 15);
	assert.equal(ordinamentoABolle(already, { bandierina: true }).confronti, 5);
	assert.equal(ordinamentoABolle(already, { bandierina: true }).scambi, 0);

	const reversed = [5, 4, 3, 2, 1];
	assert.equal(ordinamentoABolle(reversed).scambi, 10);
	assert.equal(ordinamentoABolle(reversed, { bandierina: true }).confronti, 10);
});

test('insertion sort shifts once per pair out of order', () => {
	const v = [5, 2, 4, 6, 1, 3];
	const trace = ordinamentoPerInserimento(v);
	assert.deepEqual(trace.valori, [1, 2, 3, 4, 5, 6]);
	assert.equal(trace.scambi, 9);
	assert.equal(trace.confronti, 12); // 1 + 2 + 1 + 4 + 4
	assert.deepEqual(last(trace).contatori, { confronti: 12, spostamenti: 9 });
	wellFormed(trace, v);

	const already = ordinamentoPerInserimento([1, 2, 3, 4, 5]);
	assert.equal(already.confronti, 4);
	assert.equal(already.scambi, 0);

	const reversed = ordinamentoPerInserimento([5, 4, 3, 2, 1]);
	assert.equal(reversed.confronti, 10);
	assert.equal(reversed.scambi, 10);

	// the element taken out is held above the free place, one cell at a time
	for (const step of trace.passi) assert.ok(step.celle.filter((c) => c.stato === 'sollevata').length <= 1);
});

test('every sort agrees with Array.sort on random arrays, duplicates included', () => {
	for (let k = 0; k < 300; k++) {
		const v = randomArray();
		const n = v.length;
		const selection = ordinamentoPerSelezione(v);
		const bubble = ordinamentoABolle(v);
		const flagged = ordinamentoABolle(v, { bandierina: true });
		const insertion = ordinamentoPerInserimento(v);
		for (const trace of [selection, bubble, flagged, insertion]) {
			assert.deepEqual(trace.valori, sorted(v));
			wellFormed(trace, v);
		}
		assert.equal(selection.confronti, (n * (n - 1)) / 2);
		assert.ok(selection.scambi <= n - 1);
		assert.equal(bubble.confronti, (n * (n - 1)) / 2);
		assert.equal(bubble.scambi, inversions(v));
		assert.equal(flagged.scambi, inversions(v));
		assert.ok(flagged.confronti <= bubble.confronti);
		assert.equal(insertion.scambi, inversions(v));
		assert.ok(insertion.confronti >= insertion.scambi && insertion.confronti <= insertion.scambi + n - 1);

		const value = Math.floor(random() * 30);
		const linear = ricercaSequenziale(v, value);
		assert.equal(linear.posizione, v.indexOf(value));
		assert.equal(linear.confronti, linear.posizione < 0 ? n : linear.posizione + 1);
		const binary = ricercaBinaria(sorted(v), value);
		assert.equal(binary.posizione >= 0, v.includes(value));
		if (binary.posizione >= 0) assert.equal(sorted(v)[binary.posizione], value);
	}
});

test('the values a student types are read or refused with a reason', () => {
	assert.deepEqual(leggiValori('7 3, 12;1').valori, [7, 3, 12, 1]);
	assert.deepEqual(leggiValori('  4   4 ').valori, [4, 4]);
	assert.match(leggiValori('7 tre').errore, /interi/);
	assert.match(leggiValori('7 -3').errore, /interi/);
	assert.match(leggiValori('7 100').errore, /0 a 99/);
	assert.match(leggiValori('7').errore, /almeno 2/);
	assert.match(leggiValori(Array(13).fill(1).join(' ')).errore, /massimo 12/);
});

test('a shuffle keeps the elements and changes their order', () => {
	const v = [1, 2, 3, 4, 5, 6, 7, 8];
	for (let k = 0; k < 50; k++) {
		const out = mescola(v, random);
		assert.deepEqual(sorted(out), v);
		assert.notDeepEqual(out, v);
	}
	assert.deepEqual(mescola([3, 3], random), [3, 3]);
	assert.deepEqual(mescola(v, casuale(7)), mescola(v, casuale(7)));
});
