/**
 * The commands of the Simple editor's slash menu: `/` at the start of a line
 * or after a space opens them, and what is typed after it filters them, as in
 * Notion. Pure data and a filter, with no TipTap, so the filter can be tested
 * alone; SimpleEditor runs the commands.
 */

export type SlashId =
	| 'p'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'ul'
	| 'ol'
	| 'quote'
	| 'hr'
	| 'math'
	| 'block-math'
	| 'link'
		| 'sticker'
	| 'plot'
	| 'page'
	| 'guide';

export type SlashGroup = 'Testo' | 'Formule' | 'Inserisci' | 'Aiuto';

export interface SlashItem {
	id: SlashId;
	title: string;
	description: string;
	group: SlashGroup;
	/** What does the same while typing, shown beside the name so the shortcut is learnt too. */
	hint?: string;
	/** Other words that find it: English names, Markdown, the words a student would try. */
	aliases: string[];
}

export const SLASH_ITEMS: SlashItem[] = [
	{ id: 'p', title: 'Testo normale', description: 'Un paragrafo semplice', group: 'Testo', aliases: ['paragrafo', 'text', 'plain', 'normale'] },
	{ id: 'h1', title: 'Titolo', description: 'Il titolo della nota', group: 'Testo', hint: '#', aliases: ['h1', 'titolo 1', 'heading', 'intestazione', '#'] },
	{ id: 'h2', title: 'Sottotitolo', description: 'Il titolo di una sezione', group: 'Testo', hint: '##', aliases: ['h2', 'titolo 2', 'sezione', 'heading', '##'] },
	{ id: 'h3', title: 'Titoletto', description: 'Un titolo piccolo', group: 'Testo', hint: '###', aliases: ['h3', 'titolo 3', 'heading', '###'] },
	{ id: 'ul', title: 'Elenco puntato', description: 'Un elenco con i pallini', group: 'Testo', hint: '-', aliases: ['lista', 'punti', 'bullet', 'list', 'ul', '-'] },
	{ id: 'ol', title: 'Elenco numerato', description: 'Un elenco con i numeri', group: 'Testo', hint: '1.', aliases: ['lista', 'numeri', 'ordered', 'list', 'ol', '1.'] },
	{ id: 'quote', title: 'Citazione', description: 'Una definizione o una frase da ricordare', group: 'Testo', hint: '>', aliases: ['quote', 'definizione', 'blockquote', '>'] },
	{ id: 'hr', title: 'Linea di separazione', description: 'Una riga orizzontale', group: 'Testo', hint: '---', aliases: ['divisore', 'separatore', 'riga', 'divider', 'hr', '---'] },
	{ id: 'math', title: 'Formula nel testo', description: 'Una formula dentro la frase', group: 'Formule', hint: '$…$', aliases: ['matematica', 'equazione', 'latex', 'math', 'katex', '$'] },
	{ id: 'block-math', title: 'Formula su una riga a parte', description: 'Una formula grande, centrata', group: 'Formule', hint: '$$…$$', aliases: ['matematica', 'equazione', 'latex', 'math', 'blocco', 'display', '$$'] },
	{ id: 'link', title: 'Collegamento', description: 'Un link a una pagina', group: 'Inserisci', aliases: ['link', 'url', 'indirizzo', 'sito'] },
	{ id: 'plot', title: 'Grafico', description: 'Un piano cartesiano con funzioni e geometria', group: 'Inserisci', aliases: ['grafico', 'funzione', 'plotter', 'piano cartesiano', 'geometria', 'plot', 'geogebra'] },
	{ id: 'sticker', title: 'Adesivo', description: 'Scegli un adesivo da attaccare', group: 'Inserisci', aliases: ['adesivi', 'sticker', 'figurina'] },
	{ id: 'page', title: 'Nuova pagina', description: 'Una pagina dopo questa', group: 'Inserisci', aliases: ['pagina', 'page', 'interruzione', 'foglio'] },
	{ id: 'guide', title: 'Guida alle formule', description: 'Come si scrivono formule e testo', group: 'Aiuto', aliases: ['aiuto', 'help', 'latex', 'markdown', 'guida'] }
];

/** Lower case and without accents, so "citta" finds "città". */
const fold = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();

/**
 * The commands that match what was typed after the slash, best first: a name
 * that starts with it, then a word of the name, then another name for it,
 * then a name or description that contains it. Ties keep the menu's order.
 */
export function filterSlash(query: string, items: SlashItem[] = SLASH_ITEMS): SlashItem[] {
	const q = fold(query);
	if (!q) return items;
	const rank = (item: SlashItem): number => {
		const title = fold(item.title);
		if (title.startsWith(q)) return 0;
		if (title.split(/\s+/).some((w) => w.startsWith(q))) return 1;
		if (item.aliases.some((a) => fold(a).startsWith(q))) return 2;
		if (title.includes(q) || fold(item.description).includes(q)) return 3;
		return -1;
	};
	return items
		.map((item, order) => ({ item, order, score: rank(item) }))
		.filter((r) => r.score >= 0)
		.sort((a, b) => a.score - b.score || a.order - b.order)
		.map((r) => r.item);
}
