/**
 * The trace behind the figure of lesson 80 (inf-csv-campi): a CSV file read row by row, each row cut into its
 * fields where the separator is, and the table that fills. Two steps per row: the row is read (still one text), then
 * it is cut. No React here; tests/unit/informatica-file.test.mjs checks it.
 */

export type Separatore = ',' | ';';

/** How a separator is called in a sentence, with its article: "ogni virgola", "nemmeno una virgola". */
const NOME: Record<Separatore, { una: string; ogni: string }> = {
	',': { una: 'una virgola', ogni: 'ogni virgola' },
	';': { una: 'un punto e virgola', ogni: 'ogni punto e virgola' }
};

/** The fields of a row: the pieces between one separator and the next. Quotes are not read, as in the lesson. */
export const dividi = (riga: string, separatore: Separatore): string[] => riga.split(separatore);

export type PassoCsv = {
	/** The row of the file the step is on, from 0 (the header); -1 before the first. */
	riga: number;
	/** Whether the row has been cut into its fields yet. */
	tagliata: boolean;
	/** The fields of the row, once cut. */
	campi: string[];
	/** Whether the names of the columns are in the table yet, and how many rows of data are. */
	intestazione: boolean;
	righeInTabella: number;
	/** The row has a number of fields that is not the header's. */
	storta: boolean;
	frase: string;
};

export type TracciaCsv = {
	passi: PassoCsv[];
	/** The rows of the file, as texts. */
	linee: string[];
	/** The names of the columns (the fields of the first row) and the fields of every other row. */
	colonne: string[];
	righe: string[][];
};

const ORDINALE = ['prima', 'seconda', 'terza', 'quarta', 'quinta', 'sesta'];

/** The steps of reading `testo` (rows closed by a line break, the first one the header) cutting at `separatore`. */
export function tracciaCsv(testo: string, separatore: Separatore): TracciaCsv {
	const linee = testo.replace(/\n$/, '').split('\n');
	if (linee.length < 2 || linee.some((l) => !l)) throw new Error('tracciaCsv: a header and at least one row, none empty');
	const { una, ogni } = NOME[separatore];
	const [colonne, ...righe] = linee.map((l) => dividi(l, separatore));
	const passi: PassoCsv[] = [
		{
			riga: -1,
			tagliata: false,
			campi: [],
			intestazione: false,
			righeInTabella: 0,
			storta: false,
			frase: `Il file ha ${linee.length} righe. Il programma le legge una alla volta, e taglia ciascuna dove trova ${una}.`
		}
	];
	linee.forEach((linea, i) => {
		const campi = dividi(linea, separatore);
		const k = campi.length;
		passi.push({
			riga: i,
			tagliata: false,
			campi: [],
			intestazione: i > 0,
			righeInTabella: Math.max(0, i - 1),
			storta: false,
			frase: i === 0 ? `Leggo la prima riga, l'intestazione. Per ora è un testo solo: "${linea}".` : `Leggo la ${ORDINALE[i] ?? `${i + 1}ª`} riga. Anche questa, appena letta, è un testo solo: "${linea}".`
		});
		const storta = k !== colonne.length;
		let frase: string;
		if (k === 1) {
			frase = i === 0 ? `Nella riga non c'è nemmeno ${una}: resta un solo campo, e la tabella avrà una colonna sola.` : `Nemmeno qui c'è ${una}: un solo campo, con dentro tutta la riga. Il separatore del file è un altro.`;
		} else if (i === 0) {
			frase = `Taglio a ${ogni}: ${k} campi. Sono i nomi delle colonne: ${campi.join(', ')}.`;
		} else if (storta) {
			const decimale = separatore === ',' && campi.some((c, j) => j > 0 && /\d$/.test(campi[j - 1]) && /^\d+$/.test(c));
			frase = `Taglio a ${ogni} e trovo ${k} campi, ma ${colonne.length === 1 ? 'la colonna è una' : `le colonne sono ${colonne.length}`}: ${decimale ? 'una virgola stava dentro un numero, era la virgola decimale, ed è stata presa per un separatore.' : "la riga non va d'accordo con l'intestazione."}`;
		} else {
			frase = `Taglio a ${ogni}: ${k} campi. Il campo 0 è ${campi[0]}, il campo ${k - 1} è ${campi[k - 1]}: ognuno finisce nella sua colonna.`;
		}
		passi.push({ riga: i, tagliata: true, campi, intestazione: true, righeInTabella: i, storta, frase });
	});
	return { passi, linee, colonne, righe };
}
