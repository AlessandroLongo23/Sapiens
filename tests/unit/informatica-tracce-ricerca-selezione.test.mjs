// The traces of lessons 74 and 75 (src/lib/informatica/tracce-ricerca-selezione.ts): results and counts on cases
// counted by hand. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ordinamentoPerSelezioneImin, confrontoRicerche } = await jiti.import('../../src/lib/informatica/tracce-ricerca-selezione.ts');
const { ordinamentoPerSelezione, casuale } = await jiti.import('../../src/lib/informatica/tracce.ts');

const sorted = (xs) => [...xs].sort((a, b) => a - b);
const last = (trace) => trace.passi[trace.passi.length - 1];
const valuesOf = (cells) => cells.map((c) => c.valore);
const pointer = (step, name) => step.puntatori.find((p) => p.nome === name)?.su;

test('selection sort of the lesson: the trace of 15 12 19 13 17 14', () => {
	const v = [15, 12, 19, 13, 17, 14];
	const trace = ordinamentoPerSelezioneImin(v);
	assert.deepEqual(trace.valori, [12, 13, 14, 15, 17, 19]);
	assert.equal(trace.confronti, 15); // 5 + 4 + 3 + 2 + 1
	assert.equal(trace.scambi, 3); // the turns with i = 0, 1 and 2
	assert.deepEqual(last(trace).contatori, { confronti: 15, scambi: 3 });
	// the start, then for each of the 5 turns: imin = i, one step per comparison, the swap or its absence; the end
	assert.equal(trace.passi.length, 1 + 5 * 2 + 15 + 1);

	// the vector after each turn, as the table of the lesson has it
	const afterTurn = trace.passi.filter((s) => /^Il giro è finito/.test(s.frase)).map((s) => valuesOf(s.celle));
	assert.deepEqual(afterTurn, [
		[12, 15, 19, 13, 17, 14],
		[12, 13, 19, 15, 17, 14],
		[12, 13, 14, 15, 17, 19],
		[12, 13, 14, 15, 17, 19],
		[12, 13, 14, 15, 17, 19]
	]);
	// imin at the end of each turn
	assert.deepEqual(trace.passi.filter((s) => /^Il giro è finito/.test(s.frase)).map((s) => pointer(s, 'imin')), [1, 3, 5, 3, 4]);

	// the names are those of the program, and every step keeps the elements
	const names = new Set(trace.passi.flatMap((s) => s.puntatori.map((p) => p.nome)));
	assert.deepEqual([...names].sort(), ['i', 'imin', 'j']);
	let before = { confronti: 0, scambi: 0 };
	for (const step of trace.passi) {
		assert.deepEqual(sorted(valuesOf(step.celle)), sorted(v));
		for (const c of step.celle) assert.equal(c.valore, v[c.id], 'an id keeps its value');
		for (const p of step.puntatori) assert.ok(p.su >= 0 && p.su < v.length);
		assert.ok(step.contatori.confronti >= before.confronti && step.contatori.scambi >= before.scambi);
		before = step.contatori;
		assert.ok(step.frase.length > 10 && !/undefined|NaN|—|piuttosto che/.test(step.frase), step.frase);
	}
	// in a comparison step the minimum so far is marked, and i stays above
	const first = trace.passi[2];
	assert.match(first.frase, /^j = 1: v\[1\] vale 12, che è minore di 15\. Quindi imin diventa 1\./);
	assert.equal(first.celle[1].stato, 'esame');
	assert.equal(first.celle[0].stato, 'confronto');
	assert.deepEqual(first.puntatori.map((p) => [p.nome, p.su, p.lato]), [['i', 0, 'sopra'], ['j', 1, 'sopra'], ['imin', 1, undefined]]);
});

test('selection sort of the lesson counts as the one of the kit', () => {
	assert.deepEqual(
		[ordinamentoPerSelezioneImin([1, 2, 3, 4, 5, 6]).confronti, ordinamentoPerSelezioneImin([1, 2, 3, 4, 5, 6]).scambi],
		[15, 0]
	);
	assert.match(last(ordinamentoPerSelezioneImin([1, 2, 3])).frase, /nessuno scambio/);
	assert.equal(ordinamentoPerSelezioneImin([5, 4, 3, 2, 1]).scambi, 2);
	assert.equal(ordinamentoPerSelezioneImin([2, 1]).passi.length, 5);
	const random = casuale(75);
	for (let k = 0; k < 200; k++) {
		const v = Array.from({ length: 2 + Math.floor(random() * 11) }, () => Math.floor(random() * 30));
		const mine = ordinamentoPerSelezioneImin(v);
		const kit = ordinamentoPerSelezione(v);
		assert.deepEqual(mine.valori, sorted(v));
		assert.equal(mine.confronti, (v.length * (v.length - 1)) / 2);
		assert.equal(mine.confronti, kit.confronti);
		assert.equal(mine.scambi, kit.scambi);
		assert.ok(mine.scambi <= v.length - 1);
		assert.equal(mine.passi.length, kit.passi.length);
	}
});

test('the two searches side by side on the twelve lockers of the lesson', () => {
	const v = [3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63];
	// 59 is at index 10: eleven elements one after the other, or the centres 5, 8 and 10
	const found = confrontoRicerche(v, 59);
	assert.equal(found.posizione, 10);
	assert.equal(found.sequenziale, 11);
	assert.equal(found.binaria, 3);
	assert.equal(found.passi.length, 1 + 11 + 1);
	assert.deepEqual(found.passi[0].contatori, { sequenziale: 0, binaria: 0 });
	assert.deepEqual(found.passi.slice(1, 4).map((s) => s.binaria.puntatori[0].su), [5, 8, 10]);
	assert.deepEqual(found.passi[3].contatori, { sequenziale: 3, binaria: 3 });
	assert.equal(found.passi[3].binaria.celle[10].stato, 'trovata');
	// from the fourth comparison on the binary search waits where it stopped
	assert.deepEqual(found.passi[7].contatori, { sequenziale: 7, binaria: 3 });
	assert.equal(found.passi[7].binaria.celle[10].stato, 'trovata');
	assert.match(found.passi[7].frase, /La binaria ha già finito con 3 confronti/);
	assert.equal(found.passi[7].sequenziale.puntatori[0].su, 6);
	assert.deepEqual(last(found).contatori, { sequenziale: 11, binaria: 3 });
	assert.match(last(found).frase, /11 confronti, la binaria 3/);

	// 30 is not there: twelve comparisons against three (centres 5, 8, 6)
	const absent = confrontoRicerche(v, 30);
	assert.equal(absent.posizione, -1);
	assert.equal(absent.sequenziale, 12);
	assert.equal(absent.binaria, 3);
	assert.equal(absent.passi.length, 1 + 12 + 1);
	assert.deepEqual(absent.passi.slice(1, 4).map((s) => s.binaria.puntatori[0].su), [5, 8, 6]);
	assert.ok(last(absent).sequenziale.celle.every((c) => c.stato === 'scartata'));
	assert.ok(last(absent).binaria.celle.every((c) => c.stato === 'scartata'));
	assert.match(last(absent).frase, /30 non c'è/);

	// the first element: the linear search wins, one comparison against three
	const first = confrontoRicerche(v, 3);
	assert.deepEqual([first.sequenziale, first.binaria], [1, 3]);
	assert.match(first.passi[2].frase, /La sequenziale ha finito con 1 confronto\./);

	// only i and centro are shown, both under their cells, and the two rows keep the values
	for (const trace of [found, absent, first])
		for (const step of trace.passi) {
			assert.ok(step.sequenziale.puntatori.every((p) => p.nome === 'i' && !p.lato));
			assert.ok(step.binaria.puntatori.every((p) => p.nome === 'centro' && !p.lato));
			assert.deepEqual(valuesOf(step.sequenziale.celle), v);
			assert.deepEqual(valuesOf(step.binaria.celle), v);
			assert.ok(!/undefined|NaN|—|piuttosto che/.test(step.frase), step.frase);
		}
});

test('the two searches agree with indexOf on every value', () => {
	for (let n = 2; n <= 12; n++) {
		const xs = Array.from({ length: n }, (_, i) => 3 * i + 1);
		for (let value = 0; value <= 3 * n + 1; value++) {
			const both = confrontoRicerche(xs, value);
			const at = xs.indexOf(value);
			assert.equal(both.posizione, at);
			assert.equal(both.sequenziale, at < 0 ? n : at + 1);
			assert.ok(both.binaria <= Math.floor(Math.log2(n)) + 1);
			assert.equal(both.passi.length, Math.max(both.sequenziale, both.binaria) + 2);
		}
	}
});
