/**
 * The traces of the figures of two lessons of the third year (group 05): "La ricerca binaria" (74) and
 * "L'ordinamento per selezione" (75). They sit beside tracce.ts, which they build on, and follow its model: an
 * algorithm is run once into the list of its steps, and the figure shows one step at a time.
 *
 * - `ordinamentoPerSelezioneImin`: selection sort as the program of lesson 75 writes it, with the names `i`, `j`
 *   and `imin` and one step per row of the program that does something.
 * - `confrontoRicerche`: linear and binary search of the same value in the same sorted array, side by side, one
 *   comparison each per step.
 *
 * No React here. Tests: tests/unit/informatica-tracce-ricerca-selezione.test.mjs
 */
import { ricercaBinaria, ricercaSequenziale, type Cella, type Passo, type Puntatore, type Stato, type Traccia } from './tracce';

const quanti = (n: number, uno: string, tanti: string) => `${n} ${n === 1 ? uno : tanti}`;
const confrontiDi = (n: number) => quanti(n, 'confronto', 'confronti');
const dipinte = (row: readonly Cella[], stato: (i: number) => Stato): Cella[] => row.map((cella, i) => ({ ...cella, stato: stato(i) }));

/**
 * Selection sort, step by step as the program of the lesson runs it:
 *
 *     for i in range(n - 1):
 *         imin = i
 *         for j in range(i + 1, n):
 *             if v[j] < v[imin]:
 *                 imin = j
 *         if imin != i:
 *             (swap v[i] and v[imin] through temp)
 *
 * The two loop variables `i` and `j` are named above the cells, where they never meet, and `imin` below, so the
 * three names never pile up under one cell.
 *
 * One comparison is counted for every `v[j] < v[imin]`, so n(n − 1)/2 whatever the order; a swap only when
 * `imin != i`, so at most n − 1.
 */
export function ordinamentoPerSelezioneImin(valori: readonly number[]): Traccia {
	let row: Cella[] = valori.map((valore, id) => ({ id, valore, stato: 'normale' }));
	const n = row.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let scambi = 0;
	const conta = () => ({ confronti, scambi });
	passi.push({
		celle: dipinte(row, () => 'normale'),
		puntatori: [],
		contatori: conta(),
		frase: 'Per ogni posto, da sinistra, cerco il più piccolo degli elementi che restano e lo scambio con quello che occupa il posto.'
	});
	for (let i = 0; i < n - 1; i++) {
		let imin = i;
		const sopra: Puntatore = { nome: 'i', su: i, lato: 'sopra' };
		passi.push({
			celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === i ? 'esame' : 'normale')),
			puntatori: [sopra, { nome: 'imin', su: imin }],
			contatori: conta(),
			frase: `Giro con i = ${i}: imin parte da ${i}. Per ora il più piccolo è v[${i}], che vale ${row[i].valore}.`
		});
		for (let j = i + 1; j < n; j++) {
			confronti++;
			const prima = imin;
			const minore = Number(row[j].valore) < Number(row[imin].valore);
			if (minore) imin = j;
			passi.push({
				celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === imin ? 'esame' : k === j || k === prima ? 'confronto' : 'normale')),
				puntatori: [sopra, { nome: 'j', su: j, lato: 'sopra' }, { nome: 'imin', su: imin }],
				contatori: conta(),
				frase: minore
					? `j = ${j}: v[${j}] vale ${row[j].valore}, che è minore di ${row[prima].valore}. Quindi imin diventa ${j}.`
					: `j = ${j}: v[${j}] vale ${row[j].valore}, che non è minore di ${row[imin].valore}. imin resta ${imin}.`
			});
		}
		if (imin !== i) {
			const a = row[i];
			const b = row[imin];
			const dove = imin;
			row = row.map((cella, k) => (k === i ? b : k === dove ? a : cella));
			scambi++;
			passi.push({
				celle: dipinte(row, (k) => (k < i ? 'ordinata' : k === i || k === dove ? 'scambio' : 'normale')),
				puntatori: [sopra, { nome: 'imin', su: imin }],
				contatori: conta(),
				frase: `Il giro è finito con imin = ${imin}, diverso da i: scambio v[${i}] e v[${imin}], cioè ${a.valore} e ${b.valore}. Ora ${b.valore} è al suo posto.`
			});
		} else
			passi.push({
				celle: dipinte(row, (k) => (k <= i ? 'ordinata' : 'normale')),
				puntatori: [sopra, { nome: 'imin', su: imin }],
				contatori: conta(),
				frase: `Il giro è finito con imin = ${imin}, uguale a i: ${row[i].valore} è già al suo posto, e non scambio niente.`
			});
	}
	passi.push({
		celle: dipinte(row, () => 'ordinata'),
		puntatori: [],
		contatori: conta(),
		frase: `${n > 1 ? "L'ultimo elemento rimasto è il più grande, quindi è già al suo posto. " : ''}Il vettore è ordinato: ${confrontiDi(confronti)} e ${scambi === 0 ? 'nessuno scambio' : quanti(scambi, 'scambio', 'scambi')}.`
	});
	return { passi, valori: row.map((cella) => Number(cella.valore)), confronti, scambi };
}

/** One row of cells of a step: the array as one of the two searches sees it. */
export type Riga = { celle: Cella[]; puntatori: Puntatore[] };

/** One step of the two searches run together. */
export type PassoDoppio = {
	sequenziale: Riga;
	binaria: Riga;
	/** The comparisons made so far by each: `{ sequenziale: 4, binaria: 3 }`. */
	contatori: { sequenziale: number; binaria: number };
	frase: string;
};

export type Confronto = {
	passi: PassoDoppio[];
	/** The index where the value is, or -1. */
	posizione: number;
	/** The comparisons each search needs in all. */
	sequenziale: number;
	binaria: number;
};

/**
 * Linear and binary search of `cercato` in the same array, sorted in increasing order (the caller sorts it), run
 * side by side: step 0 is the start, then at step k each search makes its k-th comparison, and the one that has
 * finished waits where it stopped. The last step says who needed how many.
 *
 * The two runs are those of tracce.ts: one comparison per element looked at. Of the pointers only `i` and
 * `centro` are kept, both under their cell, so the two rows read the same way.
 */
export function confrontoRicerche(valori: readonly number[], cercato: number): Confronto {
	const s = ricercaSequenziale(valori, cercato);
	const b = ricercaBinaria(valori, cercato);
	const n = valori.length;
	const riga = (passo: Passo, nome: string): Riga => ({ celle: passo.celle, puntatori: passo.puntatori.filter((p) => p.nome === nome).map((p) => ({ nome, su: p.su })) });
	// in the traces of tracce.ts step k is the k-th comparison, and a value that is not there has one step more
	const dopo = (traccia: Traccia, k: number, nome: string) => riga(traccia.passi[Math.min(k, traccia.confronti)], nome);
	const trovato = s.posizione >= 0;
	const lungo = Math.max(s.confronti, b.confronti);
	const passi: PassoDoppio[] = [
		{
			sequenziale: dopo(s, 0, 'i'),
			binaria: riga({ ...b.passi[0], puntatori: [] }, 'centro'),
			contatori: { sequenziale: 0, binaria: 0 },
			frase: `Cerco ${cercato} nello stesso vettore ordinato di ${n} elementi, in due modi: sopra un elemento dopo l'altro, sotto guardando ogni volta al centro.`
		}
	];
	for (let k = 1; k <= lungo; k++) {
		const parti: string[] = [];
		if (k <= s.confronti) {
			const i = k - 1;
			const fine = k === s.confronti && trovato;
			parti.push(`La sequenziale guarda l'indice ${i}, che vale ${valori[i]}: ${fine ? 'trovato' : `non è ${cercato}`}.`);
		} else parti.push(`La sequenziale ha finito con ${confrontiDi(s.confronti)}.`);
		if (k <= b.confronti) {
			const centro = b.passi[k].puntatori.find((p) => p.nome === 'centro')!.su;
			const valore = valori[centro];
			parti.push(`La binaria guarda il centro, l'indice ${centro}, che vale ${valore}: ${valore === cercato ? 'trovato' : valore < cercato ? 'scarta la metà di sinistra' : 'scarta la metà di destra'}.`);
		} else parti.push(`La binaria ha già finito con ${confrontiDi(b.confronti)}.`);
		passi.push({
			sequenziale: dopo(s, k, 'i'),
			binaria: dopo(b, k, 'centro'),
			contatori: { sequenziale: Math.min(k, s.confronti), binaria: Math.min(k, b.confronti) },
			frase: parti.join(' ')
		});
	}
	const ultimo = (traccia: Traccia, nome: string) => riga(traccia.passi[traccia.passi.length - 1], nome);
	passi.push({
		sequenziale: ultimo(s, 'i'),
		binaria: ultimo(b, 'centro'),
		contatori: { sequenziale: s.confronti, binaria: b.confronti },
		frase: trovato
			? `${cercato} è all'indice ${s.posizione}. Per trovarlo la sequenziale ha fatto ${confrontiDi(s.confronti)}, la binaria ${b.confronti}.`
			: `${cercato} non c'è. Per saperlo la sequenziale ha guardato tutti i ${n} elementi, la binaria ne ha guardati ${b.confronti}.`
	});
	return { passi, posizione: s.posizione, sequenziale: s.confronti, binaria: b.confronti };
}
