/**
 * A table whose cells the student joins, for the figure of the lesson on lists and tables
 * (components/content/interactive/informatica/CelleUnite.tsx). No React here: the table, what joining two cells
 * does to it, and the HTML that writes it, row by row.
 *
 * A cell is known by the place it starts from (its row and column in the grid, both from 0) and by how many rows
 * and columns it takes: `rowspan` and `colspan`, written only when they are more than 1. A cell that takes the place
 * of another is the only one written: the other is no longer in the HTML, which is the point of the figure.
 */

export interface CellaTabella {
	/** The place it starts from, `riga * colonne + colonna`: it does not change when the cell grows. */
	id: number;
	riga: number;
	colonna: number;
	/** How many rows and columns it takes: its `rowspan` and its `colspan`. */
	righe: number;
	colonne: number;
	testo: string;
	/** A heading cell, `<th>`: the others are `<td>`. */
	intestazione: boolean;
}

export interface Tabella {
	righe: number;
	colonne: number;
	celle: CellaTabella[];
	/** The texts the table began with, row by row: what a cell goes back to when it is split. */
	testi: readonly (readonly string[])[];
	/** How many rows at the top are headings. */
	intestazioni: number;
}

export type Verso = 'destra' | 'basso';

/** A table with one cell for each text; the first `intestazioni` rows are headings. */
export function tabella(testi: readonly (readonly string[])[], intestazioni = 1): Tabella {
	const colonne = testi[0]?.length ?? 0;
	if (!colonne || testi.some((riga) => riga.length !== colonne)) throw new Error('celle-unite: every row must have the same number of cells');
	const celle = testi.flatMap((riga, r) => riga.map((testo, c) => ({ id: r * colonne + c, riga: r, colonna: c, righe: 1, colonne: 1, testo, intestazione: r < intestazioni })));
	return { righe: testi.length, colonne, celle, testi, intestazioni };
}

const cella = (t: Tabella, id: number) => t.celle.find((c) => c.id === id);

/**
 * The cell that `id` would take in if it were joined that way, or null when the two together would not be a
 * rectangle (the neighbour starts higher, or is wider), when there is nothing on that side, or when one is a heading
 * and the other is not.
 */
export function accanto(t: Tabella, id: number, verso: Verso): CellaTabella | null {
	const a = cella(t, id);
	if (!a) return null;
	const b = t.celle.find((c) => (verso === 'destra' ? c.riga === a.riga && c.colonna === a.colonna + a.colonne && c.righe === a.righe : c.colonna === a.colonna && c.riga === a.riga + a.righe && c.colonne === a.colonne));
	return b && b.intestazione === a.intestazione ? b : null;
}

/** The table with `id` joined to its neighbour: it takes its rows or columns, and the neighbour is no longer written. */
export function unisci(t: Tabella, id: number, verso: Verso): Tabella {
	const b = accanto(t, id, verso);
	if (!b) return t;
	return { ...t, celle: t.celle.filter((c) => c.id !== b.id).map((c) => (c.id !== id ? c : verso === 'destra' ? { ...c, colonne: c.colonne + b.colonne } : { ...c, righe: c.righe + b.righe })) };
}

/** The table with `id` split again into the cells it began as, each with the text it had. */
export function separa(t: Tabella, id: number): Tabella {
	const a = cella(t, id);
	if (!a || (a.righe === 1 && a.colonne === 1)) return t;
	const back: CellaTabella[] = [];
	for (let r = a.riga; r < a.riga + a.righe; r++) for (let c = a.colonna; c < a.colonna + a.colonne; c++) back.push({ id: r * t.colonne + c, riga: r, colonna: c, righe: 1, colonne: 1, testo: t.testi[r][c], intestazione: r < t.intestazioni });
	return { ...t, celle: [...t.celle.filter((c) => c.id !== id), ...back].sort((x, y) => x.id - y.id) };
}

/** The cells written in a row of the HTML, from left to right: those that start in it. */
export const scritte = (t: Tabella, riga: number) => t.celle.filter((c) => c.riga === riga).sort((a, b) => a.colonna - b.colonna);

/** How many places of a row are taken by cells that come down from the rows above. */
export const daSopra = (t: Tabella, riga: number) => t.celle.filter((c) => c.riga < riga && c.riga + c.righe > riga).reduce((n, c) => n + c.colonne, 0);

/** The cell that covers a place of the grid. */
export const sopra = (t: Tabella, riga: number, colonna: number) => t.celle.find((c) => c.riga <= riga && riga < c.riga + c.righe && c.colonna <= colonna && colonna < c.colonna + c.colonne)!;

/** The tag of a cell as the HTML writes it: `<td colspan="2">Aula magna</td>`. */
export function tag(c: Pick<CellaTabella, 'righe' | 'colonne' | 'testo' | 'intestazione'>): string {
	const nome = c.intestazione ? 'th' : 'td';
	return `<${nome}${c.colonne > 1 ? ` colspan="${c.colonne}"` : ''}${c.righe > 1 ? ` rowspan="${c.righe}"` : ''}>${c.testo}</${nome}>`;
}

/**
 * One line of the HTML of the table. `cella` is the cell the line writes; a line with `tolta` is a cell the table
 * began with and no longer has, because `tolta` (the id of another cell) has taken its place: the figure shows it
 * struck through, and it is not part of the HTML.
 */
export interface RigaCodice {
	testo: string;
	rientro: number;
	riga?: number;
	cella?: number;
	tolta?: number;
}

/** The HTML of the table, with a line for every cell it began with: written, or taken by another. */
export function codice(t: Tabella): RigaCodice[] {
	const out: RigaCodice[] = [{ testo: '<table>', rientro: 0 }];
	for (let r = 0; r < t.righe; r++) {
		out.push({ testo: '<tr>', rientro: 1, riga: r });
		for (let c = 0; c < t.colonne; c++) {
			const own = cella(t, r * t.colonne + c);
			if (own) out.push({ testo: tag(own), rientro: 2, riga: r, cella: own.id });
			else out.push({ testo: tag({ righe: 1, colonne: 1, testo: t.testi[r][c], intestazione: r < t.intestazioni }), rientro: 2, riga: r, tolta: sopra(t, r, c).id });
		}
		out.push({ testo: '</tr>', rientro: 1, riga: r });
	}
	out.push({ testo: '</table>', rientro: 0 });
	return out;
}

/** The HTML as a text, without the cells that are no longer written. */
export const html = (t: Tabella, spazi = 4) =>
	codice(t)
		.filter((riga) => riga.tolta === undefined)
		.map((riga) => ' '.repeat(spazi * riga.rientro) + riga.testo)
		.join('\n') + '\n';
