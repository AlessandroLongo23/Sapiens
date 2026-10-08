/**
 * The trace behind the figure of lesson 79 (inf-file-lettura-righe): a text file of whole numbers, one per row,
 * read row by row and summed. One step per row: the characters up to the line break become `riga`, its number
 * `voto`, and `somma` grows. No React here; tests/unit/informatica-file.test.mjs checks it.
 */
import type { Cella, Puntatore, Variabile } from './tracce';

/** How the line break is drawn in a cell. */
export const A_CAPO = '↵';

export type PassoFile = {
	/** One cell per character of the file, the line break included, and a last empty one that stands for its end. */
	celle: Cella[];
	puntatori: Puntatore[];
	variabili: Variabile[];
	frase: string;
};

export type TracciaFile = { passi: PassoFile[]; somma: number; quanti: number };

const virgola = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',');

/**
 * The steps of reading `testo` (rows of digits, each closed by a line break) and summing its numbers. Rows already
 * read are `ordinata`, the row of the step is `esame`, the end of the file is a `scartata` cell without a value.
 */
export function letturaRighe(testo: string): TracciaFile {
	if (!/^(\d+\n)+$/.test(testo)) throw new Error('letturaRighe: rows of digits, each closed by a line break');
	const caratteri = [...testo];
	const fine = caratteri.length;
	const celle = (da: number, a: number): Cella[] => [
		...caratteri.map((c, id): Cella => ({ id, valore: c === '\n' ? A_CAPO : c, stato: id < da ? 'ordinata' : id < a ? 'esame' : 'normale' })),
		{ id: fine, valore: '', stato: 'scartata' }
	];
	const segnaposto = (su: number): Puntatore[] => [{ nome: 'segnaposto', su }];
	const passi: PassoFile[] = [
		{
			celle: celle(0, 0),
			puntatori: segnaposto(0),
			variabili: [{ nome: 'somma', valore: 0, stato: 'nuova' }],
			frase: 'Il file è aperto in lettura: il segnaposto sta sul primo carattere e la somma parte da 0.'
		}
	];
	let da = 0;
	let somma = 0;
	let quanti = 0;
	while (da < fine) {
		const a = testo.indexOf('\n', da) + 1;
		const riga = testo.slice(da, a - 1);
		const voto = Number(riga);
		const prima = somma;
		somma += voto;
		quanti++;
		passi.push({
			celle: celle(da, a),
			puntatori: segnaposto(a),
			variabili: [
				{ nome: 'riga', valore: `"${riga}"`, stato: 'nuova' },
				{ nome: 'voto', valore: voto, stato: 'nuova' },
				{ nome: 'somma', valore: somma, stato: 'scritta' }
			],
			frase: `Leggo dal segnaposto fino all'a capo: riga è il testo "${riga}", di ${riga.length === 1 ? 'un carattere' : `${riga.length} caratteri`}. Convertito, è il numero ${voto}: la somma passa da ${prima} a ${somma}. Il segnaposto si ferma dopo l'a capo.`
		});
		da = a;
	}
	passi.push({
		celle: celle(fine, fine),
		puntatori: segnaposto(fine),
		variabili: [
			{ nome: 'somma', valore: somma, stato: 'letta' },
			{ nome: 'quanti', valore: quanti, stato: 'letta' }
		],
		frase: `Il segnaposto è alla fine del file: non c'è più niente da leggere e il ciclo finisce. I voti letti sono ${quanti} e la media è ${somma} : ${quanti} = ${virgola(somma / quanti)}.`
	});
	return { passi, somma, quanti };
}
