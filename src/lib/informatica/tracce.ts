/**
 * The traces behind the interactive figures of computer science (docs/lezioni/informatica/README.md, "Figure
 * interattive"). An algorithm is run once, from its input, into the list of its steps: what each cell of the array
 * looks like, where the pointers are, what the counters say, and a sentence in Italian that tells the step. The
 * figure only shows one step of the list at a time, so going back, running and starting again are all an index.
 *
 * No React here: a trace is data, and tests/unit/informatica-tracce.test.mjs checks its result and its counts.
 */

/**
 * How a cell is drawn in a step.
 * - `normale`: nothing is happening to it.
 * - `esame`: the cell the algorithm is on (the element being looked at, the minimum so far).
 * - `confronto`: the other cell of a comparison.
 * - `scambio`: it has just been moved by a swap or a shift.
 * - `ordinata`: it is in its final place.
 * - `trovata`: it is what was being looked for.
 * - `scartata`: it cannot be the answer any more.
 * - `sollevata`: taken out of the row and held above its place, which stays empty (the key of an insertion).
 */
export type Stato = 'normale' | 'esame' | 'confronto' | 'scambio' | 'ordinata' | 'trovata' | 'scartata' | 'sollevata';

/** A cell: `id` is the element's place at the start, and follows the element when it moves (so a swap can be animated). */
export type Cella = { id: number; valore: number | string; stato: Stato };

/** A name under (or above) the cell of index `su`: i, j, min, sinistra, centro, destra. */
export type Puntatore = { nome: string; su: number; lato?: 'sopra' | 'sotto' };

/** One step: the cells in the order they are in now, the pointers, the counters so far, and what happened. */
export type Passo = {
	celle: Cella[];
	puntatori: Puntatore[];
	contatori: Record<string, number>;
	frase: string;
};

/** A whole run: its steps and what tests and figures ask of it at the end. */
export type Traccia = {
	passi: Passo[];
	/** The values at the end, in order. */
	valori: number[];
	confronti: number;
	/** Swaps, or the shifts of an insertion sort. */
	scambi: number;
};
export type TracciaRicerca = Traccia & { /** The index where the value is, or -1. */ posizione: number };

/** The limits of what a figure can show: a row of cells that fits a phone, with values of at most two digits. */
export const MIN_CELLE = 2;
export const MAX_CELLE = 12;

const celle = (valori: readonly number[]): Cella[] => valori.map((valore, id) => ({ id, valore, stato: 'normale' }));
/** A copy of the cells with their states set by `stato(index, cell)`. */
const dipinte = (row: readonly Cella[], stato: (i: number, cella: Cella) => Stato): Cella[] => row.map((cella, i) => ({ ...cella, stato: stato(i, cella) }));
const numeri = (row: readonly Cella[]) => row.map((cella) => Number(cella.valore));
const quanti = (n: number, uno: string, tanti: string) => `${n} ${n === 1 ? uno : tanti}`;
const confrontiDi = (n: number) => quanti(n, 'confronto', 'confronti');
const scambiDi = (n: number) => (n === 0 ? 'nessuno scambio' : quanti(n, 'scambio', 'scambi'));

/**
 * Linear search: the elements are compared with `cercato` one after the other from index 0, and the run stops at
 * the first that is equal. One comparison per element looked at.
 */
export function ricercaSequenziale(valori: readonly number[], cercato: number): TracciaRicerca {
	const row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	passi.push({ celle: dipinte(row, () => 'normale'), puntatori: n ? [{ nome: 'i', su: 0 }] : [], contatori: { confronti }, frase: `Cerco ${cercato}. Parto dal primo elemento, quello di indice 0, e li guardo uno alla volta.` });
	let posizione = -1;
	for (let i = 0; i < n; i++) {
		confronti++;
		const uguale = valori[i] === cercato;
		passi.push({
			celle: dipinte(row, (k) => (k < i ? 'scartata' : k === i ? (uguale ? 'trovata' : 'esame') : 'normale')),
			puntatori: [{ nome: 'i', su: i }],
			contatori: { confronti },
			frase: uguale
				? `Confronto l'elemento di indice ${i}, che vale ${valori[i]}, con ${cercato}: sono uguali. Trovato all'indice ${i}, dopo ${confrontiDi(confronti)}.`
				: `Confronto l'elemento di indice ${i}, che vale ${valori[i]}, con ${cercato}: sono diversi, passo al successivo.`
		});
		if (uguale) {
			posizione = i;
			break;
		}
	}
	if (posizione < 0)
		passi.push({
			celle: dipinte(row, () => 'scartata'),
			puntatori: [],
			contatori: { confronti },
			frase: `Ho guardato tutti gli elementi e nessuno vale ${cercato}: nel vettore non c'è. Per saperlo sono serviti ${confrontiDi(confronti)}, uno per elemento.`
		});
	return { passi, valori: [...valori], confronti, scambi: 0, posizione };
}

/**
 * Binary search in an array sorted in increasing order (the caller sorts it: the function does not check). At every
 * turn the element in the middle of what is left, at index ⌊(sinistra + destra) / 2⌋, is compared with `cercato`,
 * and the half that cannot hold it is thrown away. One comparison per element looked at.
 */
export function ricercaBinaria(valori: readonly number[], cercato: number): TracciaRicerca {
	const row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let sinistra = 0;
	let destra = n - 1;
	const dentro = (extra: Puntatore[] = []): Puntatore[] => [...(sinistra < n ? [{ nome: 'sinistra', su: sinistra }] : []), ...extra, ...(destra >= 0 ? [{ nome: 'destra', su: destra }] : [])];
	passi.push({
		celle: dipinte(row, () => 'normale'),
		puntatori: dentro(),
		contatori: { confronti },
		frase: `Cerco ${cercato} in un vettore ordinato. All'inizio può essere ovunque: sinistra è l'indice 0, destra l'indice ${n - 1}.`
	});
	let posizione = -1;
	while (sinistra <= destra) {
		const centro = Math.floor((sinistra + destra) / 2);
		const valore = valori[centro];
		confronti++;
		const s = sinistra, d = destra;
		const stato = (k: number, special: Stato): Stato => (k === centro ? special : k < s || k > d ? 'scartata' : 'normale');
		const dove = `Il centro tra ${s} e ${d} è l'indice ${centro}, che vale ${valore}`;
		if (valore === cercato) {
			passi.push({
				celle: dipinte(row, (k) => stato(k, 'trovata')),
				puntatori: dentro([{ nome: 'centro', su: centro, lato: 'sopra' }]),
				contatori: { confronti },
				frase: `${dove}: è proprio ${cercato}. Trovato all'indice ${centro}, dopo ${confrontiDi(confronti)}.`
			});
			posizione = centro;
			break;
		}
		const aDestra = valore < cercato;
		passi.push({
			celle: dipinte(row, (k) => stato(k, 'esame')),
			puntatori: dentro([{ nome: 'centro', su: centro, lato: 'sopra' }]),
			contatori: { confronti },
			frase: aDestra
				? `${dove}: ${cercato} è più grande, quindi può stare solo a destra. Scarto il centro e tutto quello che ha a sinistra.`
				: `${dove}: ${cercato} è più piccolo, quindi può stare solo a sinistra. Scarto il centro e tutto quello che ha a destra.`
		});
		if (aDestra) sinistra = centro + 1;
		else destra = centro - 1;
	}
	if (posizione < 0)
		passi.push({
			celle: dipinte(row, () => 'scartata'),
			puntatori: dentro(),
			contatori: { confronti },
			frase: `Ora sinistra vale ${sinistra} e destra vale ${destra}: sinistra ha superato destra, non resta niente da guardare. ${cercato} non c'è, e sono bastati ${confrontiDi(confronti)}.`
		});
	return { passi, valori: [...valori], confronti, scambi: 0, posizione };
}

/**
 * Selection sort: for every place i from the left, the smallest of the elements from i on is found by comparing
 * them one by one with the minimum so far, and is swapped with the element at i. n(n − 1)/2 comparisons whatever
 * the order; a swap is counted only when the minimum is not already at i.
 */
export function ordinamentoPerSelezione(valori: readonly number[]): Traccia {
	let row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let scambi = 0;
	const conta = () => ({ confronti, scambi });
	passi.push({ celle: dipinte(row, () => 'normale'), puntatori: [], contatori: conta(), frase: 'Cerco il più piccolo di tutto il vettore per metterlo al primo posto, poi il più piccolo dei rimanenti per il secondo, e così via.' });
	for (let i = 0; i < n - 1; i++) {
		let min = i;
		passi.push({
			celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === i ? 'esame' : 'normale')),
			puntatori: [{ nome: 'i', su: i }, { nome: 'min', su: min }],
			contatori: conta(),
			frase: `Posto ${i}: per ora il minimo è l'elemento che c'è già, ${row[i].valore}. Lo confronto con tutti quelli alla sua destra.`
		});
		for (let j = i + 1; j < n; j++) {
			confronti++;
			const prima = min;
			const minore = Number(row[j].valore) < Number(row[min].valore);
			if (minore) min = j;
			passi.push({
				celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === min ? 'esame' : k === j || k === prima ? 'confronto' : 'normale')),
				puntatori: [{ nome: 'i', su: i }, { nome: 'min', su: min }, { nome: 'j', su: j }],
				contatori: conta(),
				frase: minore
					? `Confronto ${row[j].valore} con il minimo ${row[prima].valore}: ${row[j].valore} è più piccolo, diventa il nuovo minimo.`
					: `Confronto ${row[j].valore} con il minimo ${row[min].valore}: non è più piccolo, il minimo resta ${row[min].valore}.`
			});
		}
		if (min !== i) {
			const a = row[i], b = row[min];
			row = row.map((cella, k) => (k === i ? b : k === min ? a : cella));
			scambi++;
			passi.push({
				celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === i || k === min ? 'scambio' : 'normale')),
				puntatori: [{ nome: 'i', su: i }, { nome: 'min', su: min }],
				contatori: conta(),
				frase: `Il minimo è ${b.valore}: lo scambio con ${a.valore}, che occupava il posto ${i}. Ora ${b.valore} è al suo posto.`
			});
		} else
			passi.push({
				celle: dipinte(row, (k) => (k <= i ? 'ordinata' : 'normale')),
				puntatori: [{ nome: 'i', su: i }, { nome: 'min', su: min }],
				contatori: conta(),
				frase: `Il minimo è ${row[i].valore}, che è già al posto ${i}: nessuno scambio.`
			});
	}
	passi.push({
		celle: dipinte(row, () => 'ordinata'),
		puntatori: [],
		contatori: conta(),
		frase: `${n > 1 ? "L'ultimo elemento rimasto è il più grande, quindi è già al suo posto. " : ''}Il vettore è ordinato: ${confrontiDi(confronti)} e ${scambiDi(scambi)}.`
	});
	return { passi, valori: numeri(row), confronti, scambi };
}

/**
 * Bubble sort: in every pass the neighbours are compared from the left and swapped when the left one is larger,
 * so the largest of what is left ends at the right. With `bandierina` the run stops after a pass without swaps
 * (the array is sorted already); without it, it always makes n − 1 passes and n(n − 1)/2 comparisons.
 */
export function ordinamentoABolle(valori: readonly number[], { bandierina = false }: { bandierina?: boolean } = {}): Traccia {
	let row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let scambi = 0;
	const conta = () => ({ confronti, scambi });
	passi.push({
		celle: dipinte(row, () => 'normale'),
		puntatori: [],
		contatori: conta(),
		frase: `Confronto gli elementi vicini a due a due, da sinistra, e li scambio quando sono nell'ordine sbagliato.${bandierina ? ' Se in un giro non scambio niente, mi fermo.' : ''}`
	});
	let fermato = false;
	for (let giro = 0; giro < n - 1 && !fermato; giro++) {
		const fine = n - 1 - giro; // the last index of the part still to sort
		let scambiato = false;
		for (let j = 0; j < fine; j++) {
			confronti++;
			const a = row[j], b = row[j + 1];
			const scambia = Number(a.valore) > Number(b.valore);
			if (scambia) {
				row = row.map((cella, k) => (k === j ? b : k === j + 1 ? a : cella));
				scambi++;
				scambiato = true;
			}
			passi.push({
				celle: dipinte(row, (k) => (k > fine ? 'ordinata' : k === j || k === j + 1 ? (scambia ? 'scambio' : 'confronto') : 'normale')),
				puntatori: [{ nome: 'j', su: j }, { nome: 'j+1', su: j + 1 }],
				contatori: conta(),
				frase: scambia ? `Giro ${giro + 1}. Confronto ${a.valore} e ${b.valore}: ${a.valore} è più grande, li scambio.` : `Giro ${giro + 1}. Confronto ${a.valore} e ${b.valore}: sono già nell'ordine giusto, li lascio dove sono.`
			});
		}
		fermato = bandierina && !scambiato;
		const ultimoGiro = giro === n - 2;
		if (fermato)
			passi.push({ celle: dipinte(row, () => 'ordinata'), puntatori: [], contatori: conta(), frase: `Nel giro ${giro + 1} non ho scambiato niente: gli elementi sono tutti in ordine, e mi fermo senza fare gli altri giri.` });
		else if (!ultimoGiro)
			passi.push({
				celle: dipinte(row, (k) => (k >= fine ? 'ordinata' : 'normale')),
				puntatori: [],
				contatori: conta(),
				frase: `Fine del giro ${giro + 1}: ${row[fine].valore} è salito fino al suo posto, l'indice ${fine}. Il prossimo giro si ferma un elemento prima.`
			});
	}
	passi.push({ celle: dipinte(row, () => 'ordinata'), puntatori: [], contatori: conta(), frase: `Il vettore è ordinato: ${confrontiDi(confronti)} e ${scambiDi(scambi)}.` });
	return { passi, valori: numeri(row), confronti, scambi };
}

/**
 * Insertion sort: the element at i is taken out, the larger ones on its left move one place to the right, and it
 * goes into the place left free. A comparison is counted every time the element taken out is compared with one on
 * its left; `scambi` counts the shifts, which are as many as the pairs out of order at the start (the counter is
 * called `spostamenti`).
 */
export function ordinamentoPerInserimento(valori: readonly number[]): Traccia {
	let row = celle(valori);
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let spostamenti = 0;
	const conta = () => ({ confronti, spostamenti });
	passi.push({
		celle: dipinte(row, (k) => (k === 0 ? 'ordinata' : 'normale')),
		puntatori: [],
		contatori: conta(),
		frase: 'Un elemento da solo è già ordinato: parto dal primo. Poi prendo gli altri uno alla volta e inserisco ciascuno al posto giusto tra quelli alla sua sinistra.'
	});
	for (let i = 1; i < n; i++) {
		const x = row[i];
		let buco = i; // where the element taken out is held, above the free place
		const stato = (k: number, altro?: number, comeAltro: Stato = 'confronto'): Stato => (k === buco ? 'sollevata' : k === altro ? comeAltro : k <= i ? 'ordinata' : 'normale');
		passi.push({
			celle: dipinte(row, (k) => stato(k)),
			puntatori: [{ nome: 'i', su: i }],
			contatori: conta(),
			frase: `Prendo ${x.valore}, l'elemento di indice ${i}, e lo tengo da parte. Alla sua sinistra gli elementi sono già in ordine tra loro.`
		});
		let fermatoDa: Cella | null = null;
		while (buco > 0) {
			const vicino = row[buco - 1];
			confronti++;
			if (Number(vicino.valore) > Number(x.valore)) {
				// the neighbour moves right into the free place, which moves left with the element held above it
				const da = buco - 1;
				row = row.map((cella, k) => (k === buco ? vicino : k === da ? x : cella));
				spostamenti++;
				buco = da;
				passi.push({
					celle: dipinte(row, (k) => stato(k, buco + 1, 'scambio')),
					puntatori: [{ nome: 'i', su: i }, { nome: 'j', su: buco }],
					contatori: conta(),
					frase: `Confronto ${x.valore} con ${vicino.valore}: ${vicino.valore} è più grande, lo sposto di un posto a destra.`
				});
			} else {
				fermatoDa = vicino;
				passi.push({
					celle: dipinte(row, (k) => stato(k, buco - 1)),
					puntatori: [{ nome: 'i', su: i }, { nome: 'j', su: buco - 1 }],
					contatori: conta(),
					frase: `Confronto ${x.valore} con ${vicino.valore}: ${vicino.valore} non è più grande, quindi mi fermo qui.`
				});
				break;
			}
		}
		const posto = buco;
		passi.push({
			celle: dipinte(row, (k) => (k === posto ? 'scambio' : k <= i ? 'ordinata' : 'normale')),
			puntatori: [{ nome: 'i', su: i }],
			contatori: conta(),
			frase: fermatoDa ? `Inserisco ${x.valore} nel posto libero, l'indice ${posto}, subito dopo ${fermatoDa.valore}.` : `Sono arrivato all'inizio del vettore: inserisco ${x.valore} all'indice 0.`
		});
	}
	passi.push({
		celle: dipinte(row, () => 'ordinata'),
		puntatori: [],
		contatori: conta(),
		frase: `Il vettore è ordinato: ${confrontiDi(confronti)} e ${spostamenti === 0 ? 'nessuno spostamento' : quanti(spostamenti, 'spostamento', 'spostamenti')}.`
	});
	return { passi, valori: numeri(row), confronti, scambi: spostamenti };
}

// ---------------------------------------------------------------- the student's data

/**
 * The values a student typed ("7 3, 12 1"), as whole numbers from 0 to 99 separated by spaces, commas or
 * semicolons: the list, or a sentence that says what is wrong.
 */
export function leggiValori(testo: string, { min = MIN_CELLE, max = MAX_CELLE }: { min?: number; max?: number } = {}): { valori: number[]; errore: null } | { valori: null; errore: string } {
	const pezzi = testo.split(/[\s,;]+/).filter(Boolean);
	if (pezzi.some((p) => !/^\d{1,2}$/.test(p))) return { valori: null, errore: 'Scrivi numeri interi da 0 a 99, separati da uno spazio.' };
	if (pezzi.length < min) return { valori: null, errore: `Servono almeno ${min} numeri.` };
	if (pezzi.length > max) return { valori: null, errore: `Al massimo ${max} numeri, altrimenti le celle non stanno sullo schermo.` };
	return { valori: pezzi.map(Number), errore: null };
}

/** A small generator with a seed (mulberry32), for a shuffle that tests can repeat. */
export function casuale(seme: number) {
	let a = seme >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** The same values in another order (Fisher-Yates); never the order they came in, when another one exists. */
export function mescola<T>(valori: readonly T[], random: () => number = Math.random): T[] {
	const out = [...valori];
	const uguale = () => out.every((x, i) => x === valori[i]);
	for (let giro = 0; giro < 8; giro++) {
		for (let i = out.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[out[i], out[j]] = [out[j], out[i]];
		}
		if (!uguale()) break;
	}
	return out;
}

// ---------------------------------------------------------------- variables and calls

/** A variable in a box: `stato` marks the one a step reads, writes or has just created. `rif` names what a reference stands for ("a di main"). */
export type Variabile = { nome: string; valore: number | string; stato?: 'normale' | 'letta' | 'scritta' | 'nuova'; rif?: string };
/** One call on the stack: the function's name with its parameters and local variables. */
export type Chiamata = { nome: string; variabili: Variabile[] };
/** One step of a program with functions: the stack from `main` (first) to the function running now (last). */
export type PassoPila = { pila: Chiamata[]; frase: string; /** The line of the program the step is on, from 1. */ riga?: number; uscita?: string[] };
