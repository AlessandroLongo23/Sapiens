/**
 * The traces of the figures of the lessons "I vettori" and "La ricerca sequenziale" (computer science, third year,
 * group 03), beside the shared ones of tracce.ts and made the same way: an algorithm is run once into the list of
 * its steps, and the figure shows one step at a time. Names and sentences are those of the programs of the two
 * lessons (docs/lezioni/informatica/riscritte/70-inf-vettori.md and 71-inf-ricerca-sequenziale.md).
 *
 * No React here. Tests: tests/unit/informatica-tracce-vettori.test.mjs.
 */
import type { Cella, Passo, Stato, TracciaRicerca, Variabile } from './tracce';

const celle = (valori: readonly number[]): Cella[] => valori.map((valore, id) => ({ id, valore, stato: 'normale' }));
const quanti = (n: number, uno: string, tanti: string) => `${n} ${n === 1 ? uno : tanti}`;
const confrontiDi = (n: number) => quanti(n, 'confronto', 'confronti');

// ---------------------------------------------------------------- going through a vector

/** What the loop of the lesson works out: the sum of the elements, or the largest. */
export type Calcolo = 'somma' | 'massimo';

/** A step of a loop over a vector: the cells and the pointer of a `Passo`, and the variables of the program. */
export type PassoScorri = Pick<Passo, 'celle' | 'puntatori' | 'frase'> & { variabili: Variabile[] };

export type TracciaScorri = {
	passi: PassoScorri[];
	/** The sum or the largest element; null when the loop asks for an element that is not there. */
	risultato: number | null;
	/** How many times the body of the loop is run. */
	giri: number;
	/** The index that falls outside the vector, or -1. */
	fuori: number;
};

/**
 * The loop `for i from 0 while i < n` over `valori` (named `voti` in the sentences), with the variable that changes
 * beside it. With `oltre` the condition is the mistaken `i <= n`: the loop runs once more and asks for the element
 * of index n, which is not there; the row then has one more cell, drawn as what lies outside the vector.
 *
 * The sum starts from 0 and the loop from index 0; the largest starts from the first element and the loop from 1,
 * as in the lesson.
 */
export function scorriVettore(valori: readonly number[], { calcolo = 'somma', oltre = false }: { calcolo?: Calcolo; oltre?: boolean } = {}): TracciaScorri {
	const n = valori.length;
	const fila: Cella[] = [...celle(valori), ...(oltre ? [{ id: n, valore: '?', stato: 'scartata' as Stato }] : [])];
	// the cells already gone through are settled, the one of index `at` is under examination
	const dipinte = (at: number, fatte: number): Cella[] => fila.map((cella, k) => ({ ...cella, stato: k >= n ? (k === at ? 'esame' : 'scartata') : k === at ? 'esame' : k < fatte ? 'ordinata' : 'normale' }));
	const passi: PassoScorri[] = [];
	const nome = calcolo;
	const condizione = oltre ? `i <= ${n}` : `i < ${n}`;
	let valore = calcolo === 'somma' ? 0 : valori[0];
	const primo = calcolo === 'somma' ? 0 : 1;

	passi.push({
		celle: dipinte(calcolo === 'massimo' ? 0 : -1, 0),
		puntatori: [],
		variabili: [{ nome, valore, stato: 'nuova' }],
		frase: calcolo === 'somma' ? `Prima del ciclo somma vale 0: non ho ancora aggiunto nessun elemento.` : `Prima del ciclo massimo prende il primo elemento, voti[0], che vale ${valori[0]}. Il ciclo parte dall'indice 1.`
	});

	let giri = 0;
	for (let i = primo; i < n; i++) {
		giri++;
		const x = valori[i];
		let frase: string;
		let cambia = true;
		if (calcolo === 'somma') {
			frase = `i vale ${i}: aggiungo a somma l'elemento voti[${i}], che vale ${x}. ${valore} + ${x} fa ${valore + x}.`;
			valore += x;
		} else if (x > valore) {
			frase = `i vale ${i}: voti[${i}] vale ${x}, più di massimo, che vale ${valore}. massimo diventa ${x}.`;
			valore = x;
		} else {
			frase = `i vale ${i}: voti[${i}] vale ${x}, che non supera massimo. massimo resta ${valore}.`;
			cambia = false;
		}
		passi.push({
			celle: dipinte(i, i),
			puntatori: [{ nome: 'i', su: i }],
			variabili: [
				{ nome: 'i', valore: i, stato: 'letta' },
				{ nome, valore, stato: cambia ? 'scritta' : 'normale' }
			],
			frase
		});
	}

	if (oltre) {
		giri++;
		passi.push({
			celle: dipinte(n, n),
			puntatori: [{ nome: 'i', su: n }],
			variabili: [
				{ nome: 'i', valore: n, stato: 'letta' },
				{ nome, valore: '?', stato: 'scritta' }
			],
			frase: `i vale ${n} e ${condizione} è ancora vera: il ciclo fa un giro in più e chiede voti[${n}], che non esiste. Python si ferma con un errore; in C++ arriva un numero qualunque.`
		});
		return { passi, risultato: null, giri, fuori: n };
	}

	passi.push({
		celle: dipinte(-1, n),
		puntatori: [],
		variabili: [
			{ nome: 'i', valore: n, stato: 'letta' },
			{ nome, valore }
		],
		frase: `i vale ${n} e la condizione ${condizione} è falsa: il ciclo finisce dopo ${quanti(giri, 'giro', 'giri')}, senza chiedere voti[${n}]. ${calcolo === 'somma' ? 'La somma' : 'Il massimo'} è ${valore}.`
	});
	return { passi, risultato: valore, giri, fuori: -1 };
}

// ---------------------------------------------------------------- linear search, as the lesson writes it

/**
 * Linear search with the variable `posizione` of the lesson: it starts from -1 and takes the index of the element
 * equal to `cercato`. With `ferma` (the loop `while i < n and posizione == -1`) the run stops at the first element
 * found; without, the loop goes on to the end, and `posizione` is left with the index of the last one found.
 * One comparison per element looked at. The vector is named `arrivi` in the sentences, as in the lesson.
 *
 * `posizione` is among the counters, beside `confronti`, so that the figure shows it changing.
 */
export function ricercaConPosizione(valori: readonly number[], cercato: number, { ferma = true }: { ferma?: boolean } = {}): TracciaRicerca {
	const row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let posizione = -1;
	const trovate: number[] = [];
	const dipinte = (at: number, fatte: number): Cella[] => row.map((cella, k) => ({ ...cella, stato: trovate.includes(k) ? 'trovata' : k === at ? 'esame' : k < fatte ? 'scartata' : 'normale' }));

	passi.push({
		celle: dipinte(-1, 0),
		puntatori: n ? [{ nome: 'i', su: 0 }] : [],
		contatori: { confronti, posizione },
		frase: `Cerco ${cercato}. posizione parte da -1, che vuol dire "non ancora trovato", e i parte da 0.`
	});

	for (let i = 0; i < n; i++) {
		confronti++;
		const uguale = valori[i] === cercato;
		if (uguale) {
			posizione = i;
			trovate.push(i);
		}
		const fine = uguale && ferma;
		passi.push({
			celle: dipinte(i, i),
			puntatori: [{ nome: 'i', su: i }],
			contatori: { confronti, posizione },
			frase: uguale
				? fine
					? `arrivi[${i}] vale ${valori[i]}: è uguale a ${cercato}. posizione diventa ${i} e il ciclo si ferma, dopo ${confrontiDi(confronti)}.`
					: `arrivi[${i}] vale ${valori[i]}: è uguale a ${cercato}. posizione diventa ${i}, ma il ciclo va avanti lo stesso.`
				: `arrivi[${i}] vale ${valori[i]}: è diverso da ${cercato}. posizione resta ${posizione} e i aumenta di 1.`
		});
		if (fine) return { passi, valori: [...valori], confronti, scambi: 0, posizione };
	}

	passi.push({
		celle: dipinte(-1, n),
		puntatori: [],
		contatori: { confronti, posizione },
		frase:
			posizione < 0
				? `i vale ${n}, la dimensione del vettore: gli elementi sono finiti e posizione vale ancora -1. ${cercato} non c'è, e per saperlo sono serviti ${confrontiDi(confronti)}, uno per elemento.`
				: `i vale ${n}: gli elementi sono finiti. posizione vale ${posizione}, l'indice dell'ultimo ${cercato} incontrato, e i confronti sono stati ${confronti}, uno per elemento.`
	});
	return { passi, valori: [...valori], confronti, scambi: 0, posizione };
}

/** How many comparisons the search that stops makes when the value is at index `dove`; with -1, when it is not there. */
export const confrontiPerTrovare = (n: number, dove: number) => (dove < 0 || dove >= n ? n : dove + 1);

/** The comparisons on average over the n places where the value can be, each as likely as the others: (n + 1) / 2. */
export const confrontiInMedia = (n: number) => (n + 1) / 2;
