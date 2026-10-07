/**
 * The traces of the figures of the lessons on matrices and on strings (informatica, third year, lessons 72 and 73),
 * beside those of the arrays in tracce.ts and made the same way: the program is run once into the list of its steps,
 * and the figure shows one step at a time. No React here; tests/unit/informatica-tracce-matrici-stringhe.test.mjs
 * checks results and counts.
 */
import type { Cella, Passo, Stato } from './tracce';

// ---------------------------------------------------------------- matrices

/** One step of a walk through a matrix with two nested loops. */
export type PassoMatrice = {
	/** The row index `i` and the column index `j`, or null while the loop that owns it has not set it. */
	i: number | null;
	j: number | null;
	/** The state of each cell, row by row. */
	stati: Stato[][];
	/** The accumulator, or null before it gets its first value. */
	somma: number | null;
	/** Which of the three variables the step has just written. */
	scritta: 'i' | 'j' | 'somma' | null;
	/** What the program has written so far, one sum per line. */
	uscita: number[];
	frase: string;
};

export type TracciaMatrice = { passi: PassoMatrice[]; somme: number[] };

/**
 * The sums of a matrix by rows or by columns, as the two nested loops of lesson 72 compute them: the outer loop
 * chooses a row (or a column) and sets `somma` to 0, the inner one adds its elements one by one, and after it the
 * sum is written. `m[i][j]` has `i` for the row and `j` for the column in both directions: by columns it is the
 * outer loop that moves `j`. `nome` is the name of the matrix in the sentences.
 */
export function sommeMatrice(valori: readonly (readonly number[])[], verso: 'righe' | 'colonne', nome = 'm'): TracciaMatrice {
	const R = valori.length;
	const C = valori[0]?.length ?? 0;
	const perRighe = verso === 'righe';
	const fuori = perRighe ? R : C; // the turns of the outer loop
	const dentro = perRighe ? C : R;
	const [esterno, interno] = perRighe ? (['i', 'j'] as const) : (['j', 'i'] as const);
	const [linea, linee] = perRighe ? ['riga', 'righe'] : ['colonna', 'colonne'];
	const cella = (a: number, b: number) => (perRighe ? { r: a, c: b } : { r: b, c: a });
	// a cell seen from the loops: `a` is the turn of the outer loop it belongs to, `b` that of the inner one
	const stati = (stato: (a: number, b: number) => Stato): Stato[][] => valori.map((row, r) => row.map((_, c) => (perRighe ? stato(r, c) : stato(c, r))));
	const indici = (a: number | null, b: number | null) => (perRighe ? { i: a, j: b } : { i: b, j: a });

	const passi: PassoMatrice[] = [];
	const uscita: number[] = [];
	passi.push({
		...indici(null, null),
		stati: stati(() => 'normale'),
		somma: null,
		scritta: null,
		uscita: [],
		frase: `La matrice ha ${R} righe e ${C} colonne. Sommo per ${linee}: il ciclo esterno sceglie la ${linea} con ${esterno}, quello interno la percorre con ${interno}.`
	});
	for (let a = 0; a < fuori; a++) {
		passi.push({
			...indici(a, null),
			stati: stati((x) => (x < a ? 'ordinata' : 'normale')),
			somma: 0,
			scritta: 'somma',
			uscita: [...uscita],
			frase: `${esterno} vale ${a}: comincia la ${linea} ${a}, e somma riparte da 0.`
		});
		let somma = 0;
		for (let b = 0; b < dentro; b++) {
			const { r, c } = cella(a, b);
			const prima = somma;
			somma += valori[r][c];
			passi.push({
				...indici(a, b),
				stati: stati((x, y) => (x < a ? 'ordinata' : x > a ? 'normale' : y < b ? 'confronto' : y === b ? 'esame' : 'normale')),
				somma,
				scritta: 'somma',
				uscita: [...uscita],
				frase: `${interno} vale ${b}: aggiungo ${nome}[${r}][${c}], che vale ${valori[r][c]}. somma passa da ${prima} a ${somma}.`
			});
		}
		uscita.push(somma);
		passi.push({
			...indici(a, null),
			stati: stati((x) => (x <= a ? 'ordinata' : 'normale')),
			somma,
			scritta: null,
			uscita: [...uscita],
			frase: `Il ciclo interno è finito: la ${linea} ${a} è stata percorsa tutta e il programma scrive ${somma}.`
		});
	}
	passi.push({
		...indici(null, null),
		stati: stati(() => 'ordinata'),
		somma: null,
		scritta: null,
		uscita: [...uscita],
		frase: `Finite le ${linee}. Il corpo del ciclo interno è stato eseguito ${fuori} · ${dentro} = ${fuori * dentro} volte, una per elemento.`
	});
	return { passi, somme: uscita };
}

/** The step of `sommeMatrice` in which the element of row r and column c is added, to jump there from a click. */
export const passoDi = (passi: readonly PassoMatrice[], r: number, c: number) => passi.findIndex((p) => p.i === r && p.j === c);

// ---------------------------------------------------------------- strings

/** The limits of a word a figure can show: cells that fit a phone. */
export const MIN_LETTERE = 2;
export const MAX_LETTERE = 12;

/** A word typed by the student, in small letters: only the letters from a to z, as many as a figure can show. */
export function leggiParola(testo: string): { parola: string; errore: null } | { parola: null; errore: string } {
	const parola = testo.trim().toLowerCase();
	if (!/^[a-z]*$/.test(parola)) return { parola: null, errore: 'Scrivi una parola sola, con le lettere da a a z: niente spazi, accenti o cifre.' };
	if (parola.length < MIN_LETTERE) return { parola: null, errore: `Servono almeno ${MIN_LETTERE} lettere.` };
	if (parola.length > MAX_LETTERE) return { parola: null, errore: `Al massimo ${MAX_LETTERE} lettere, altrimenti le celle non stanno sullo schermo.` };
	return { parola, errore: null };
}

const lettere = (parola: string, stato: (i: number) => Stato): Cella[] => [...parola].map((valore, id) => ({ id, valore, stato: stato(id) }));
const VOCALI = 'aeiou';

export type TracciaVocali = { passi: Passo[]; vocali: number };

/**
 * Counting the vowels of a word: the index `i` goes from 0 to the last character, and the counter goes up by one
 * at every character that is a vowel.
 */
export function contaVocali(parola: string): TracciaVocali {
	const n = parola.length;
	const passi: Passo[] = [];
	let vocali = 0;
	const visto = (fino: number) => (k: number): Stato => (k >= fino ? 'normale' : VOCALI.includes(parola[k]) ? 'ordinata' : 'scartata');
	passi.push({
		celle: lettere(parola, () => 'normale'),
		puntatori: n ? [{ nome: 'i', su: 0 }] : [],
		contatori: { lunghezza: n, vocali },
		frase: `La parola ha ${n} caratteri, con gli indici da 0 a ${n - 1}. Il contatore parte da 0 e i dal primo carattere.`
	});
	for (let i = 0; i < n; i++) {
		const c = parola[i];
		const si = VOCALI.includes(c);
		if (si) vocali++;
		const prima = visto(i);
		passi.push({
			celle: lettere(parola, (k) => (k === i ? 'esame' : prima(k))),
			puntatori: [{ nome: 'i', su: i }],
			contatori: { lunghezza: n, vocali },
			frase: si ? `parola[${i}] è la lettera ${c}: è una vocale, il contatore sale a ${vocali}.` : `parola[${i}] è la lettera ${c}: non è una vocale, il contatore resta a ${vocali}.`
		});
	}
	passi.push({
		celle: lettere(parola, visto(n)),
		puntatori: [],
		contatori: { lunghezza: n, vocali },
		frase: `i è arrivato a ${n}, la lunghezza della parola, e il ciclo finisce: ${vocali === 1 ? 'la vocale è 1' : `le vocali sono ${vocali}`} su ${n} caratteri.`
	});
	return { passi, vocali };
}

export type TracciaPalindroma = { passi: Passo[]; palindroma: boolean; confronti: number };

/**
 * Whether a word reads the same from both ends, with two indices that walk towards each other: `i` from the first
 * character and `j` from the last. The run stops at the first pair that differs, or when the two meet.
 */
export function controllaPalindroma(parola: string): TracciaPalindroma {
	const n = parola.length;
	const passi: Passo[] = [];
	let confronti = 0;
	let i = 0;
	let j = n - 1;
	const due = (a: number, b: number) => [
		{ nome: 'i', su: a },
		{ nome: 'j', su: b, lato: 'sopra' as const }
	];
	// the pairs already found equal are the characters before i and after j
	const fatte = (a: number, b: number) => (k: number): Stato => (k < a || k > b ? 'ordinata' : 'normale');
	passi.push({
		celle: lettere(parola, () => 'normale'),
		puntatori: due(i, j),
		contatori: { confronti },
		frase: `i parte dal primo carattere, di indice 0, e j dall'ultimo, di indice ${n - 1}. A ogni giro confronto i due caratteri e avvicino gli indici.`
	});
	let palindroma = true;
	while (i < j) {
		confronti++;
		const uguali = parola[i] === parola[j];
		const prima = fatte(i, j);
		passi.push({
			celle: lettere(parola, (k) => (k === i || k === j ? (uguali ? 'esame' : 'scambio') : prima(k))),
			puntatori: due(i, j),
			contatori: { confronti },
			frase: uguali
				? `parola[${i}] è ${parola[i]} e parola[${j}] è ${parola[j]}: sono uguali. i avanza di un posto e j arretra di uno.`
				: `parola[${i}] è ${parola[i]} e parola[${j}] è ${parola[j]}: sono diversi. La parola non è palindroma, e non serve guardare gli altri caratteri.`
		});
		if (!uguali) {
			palindroma = false;
			break;
		}
		i++;
		j--;
	}
	if (palindroma)
		passi.push({
			celle: lettere(parola, () => 'ordinata'),
			puntatori: due(i, j),
			contatori: { confronti },
			frase:
				i === j
					? `i e j sono tutti e due sull'indice ${i}: resta il carattere di mezzo, che non ha un compagno. Tutte le coppie erano uguali, la parola è palindroma.`
					: `i vale ${i} e j vale ${j}: si sono scavalcati, quindi le coppie sono finite. Erano tutte uguali, la parola è palindroma.`
		});
	return { passi, palindroma, confronti };
}
