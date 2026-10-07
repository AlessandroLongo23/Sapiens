// The traces of the figures on functions (src/lib/informatica/tracce-funzioni.ts): the rows a step points at, the
// stack and what is written, on the two programs of lessons 65 and 66. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { classificaConLinea, puntiConRitorno, rigaDi } = await jiti.import('../../src/lib/informatica/tracce-funzioni.ts');

const LANGUAGES = ['python', 'cpp'];
const rows = (trace) => trace.codice.split('\n');
const row = (trace, n) => rows(trace)[n - 1];

/** What every trace keeps at every step: a row of the program, a stack from the main program, a screen that only grows. */
function wellFormed(trace) {
	let before = [];
	for (const step of trace.passi) {
		assert.ok(step.riga >= 1 && step.riga <= rows(trace).length, 'the row is in the program');
		assert.ok(row(trace, step.riga).trim(), 'the row that runs is not empty');
		assert.ok(step.pila.length >= 1 && ['main', 'programma'].includes(step.pila[0].nome), 'the main program is at the bottom');
		assert.equal(step.attesa.length, step.pila.length - 1, 'one waiting row for each function called');
		assert.deepEqual(step.uscita.slice(0, before.length), before, 'what is written stays');
		before = step.uscita;
		assert.ok(step.frase.length > 10 && !/undefined|NaN|—|piuttosto che/.test(step.frase), step.frase);
	}
	assert.equal(trace.passi[0].uscita.length, 0, 'nothing is written at the start');
}

test('rigaDi finds a row by its text, and says when it is not there', () => {
	assert.equal(rigaDi('a\nb\na', 'a'), 1);
	assert.equal(rigaDi('a\nb\na', 'a', 2), 3);
	assert.throws(() => rigaDi('a\nb', 'c'));
});

test('lesson 65: the body runs twice and the flow goes back after each call', () => {
	for (const language of LANGUAGES) {
		const trace = classificaConLinea(language);
		wellFormed(trace);
		const last = trace.passi[trace.passi.length - 1];
		// counted by hand: what the program of the lesson writes
		assert.deepEqual(last.uscita, ['Classifica', '------------', '1. Tigri 12', '2. Lupi 9', '------------', 'Fine']);
		const inside = trace.passi.filter((p) => p.pila.length === 2);
		assert.equal(inside.length, 2, 'the function runs twice');
		assert.equal(inside[0].riga, inside[1].riga, 'on the same row');
		assert.match(row(trace, inside[0].riga), /------------/);
		assert.notEqual(inside[0].attesa[0], inside[1].attesa[0], 'from two different calls');
		for (const step of inside) assert.match(row(trace, step.attesa[0]), /^\s*linea\(\);?$/);
		// the step after the function is on a row after its call
		for (const step of inside) assert.ok(trace.passi[trace.passi.indexOf(step) + 1].riga > step.attesa[0]);
		assert.equal(trace.passi.length, 9);
	}
	// the order of the rows in Python, written by hand from the program
	assert.deepEqual(
		classificaConLinea('python').passi.map((p) => p.riga),
		[1, 4, 5, 2, 6, 7, 8, 2, 9]
	);
	assert.deepEqual(
		classificaConLinea('cpp').passi.map((p) => p.riga),
		[8, 9, 10, 5, 11, 12, 13, 5, 14]
	);
});

test('lesson 66: arguments go into the parameters by place and the returned value takes the place of the call', () => {
	for (const language of LANGUAGES) {
		for (const [swapped, vinte, pareggi, total] of [
			[false, 4, 2, 14],
			[true, 2, 4, 10]
		]) {
			const trace = puntiConRitorno(language, swapped);
			wellFormed(trace);
			assert.ok(trace.codice.includes(swapped ? 'punti(p, v)' : 'punti(v, p)'));
			const inside = trace.passi.filter((p) => p.pila.length === 2);
			assert.equal(inside.length, 2);
			const value = (step, name) => step.pila[step.pila.length - 1].variabili.find((x) => x.nome === name)?.valore;
			assert.equal(value(inside[0], 'vinte'), vinte);
			assert.equal(value(inside[0], 'pareggi'), pareggi);
			assert.equal(value(inside[1], 'return'), total);
			assert.match(row(trace, inside[1].riga), /return 3 \* vinte \+ pareggi/);
			for (const step of inside) assert.match(row(trace, step.attesa[0]), /punti\([vp], [vp]\)/);
			const back = trace.passi[trace.passi.indexOf(inside[1]) + 1];
			assert.equal(back.pila.length, 1);
			assert.equal(value(back, 't'), total);
			// the variables of the main program never change: the function works on its own parameters
			for (const step of trace.passi.slice(3)) assert.deepEqual(step.pila[0].variabili.slice(0, 2).map((x) => x.valore), [4, 2]);
			assert.deepEqual(trace.passi[trace.passi.length - 1].uscita, [`Punti: ${total}`]);
		}
	}
});
