/**
 * How a browser makes a tree of an HTML file, for the figure of the lesson on the structure of a page
 * (components/content/interactive/informatica/AlberoDocumento.tsx). No React here: the lines of the file go in, the
 * elements and the steps of the reading come out.
 *
 * The rules are the part of HTML's tree construction a first lesson meets. The file is read from the top. A start
 * tag makes an element, child of the last element still open, and leaves it open (an element that has no end tag,
 * like `meta` or `br`, is closed at once). An end tag closes its element and, with it, whatever was left open
 * inside: the browser does that without a word. An end tag of an element that is not open is skipped. A heading
 * cannot be inside a heading and a paragraph cannot be inside a paragraph: the open one is closed first. At the end
 * of the file everything still open is closed. Text belongs to the last element open.
 *
 * Comments, the doctype, attributes with a `>` in their value and text outside `html` are not handled: the figure
 * writes its own file.
 */

/** An element of the tree. `id` is its place in `nodi`, in the order the elements are met. */
export interface Nodo {
	id: number;
	tag: string;
	genitore: number | null;
	/** What it holds, in order: a text, or the id of a child. */
	contenuto: (string | number)[];
	/** The line of its start tag and the line where it is closed, from 0. */
	riga: number;
	fine: number;
	/** `tag`: closed by its own end tag; `browser`: closed because its parent was, or because the file ended; `vuoto`: it has no end tag. */
	chiuso: 'tag' | 'browser' | 'vuoto';
}

/** The reading after a line: how many elements exist, which are open (from the root), and what happened. */
export interface PassoAlbero {
	/** The line just read, from 0; null before the first and after the last. */
	riga: number | null;
	/** The elements met so far are those with `id` below this. */
	nati: number;
	/** The elements still open, from the root to the innermost. */
	aperti: number[];
	/** The element the line is about: the one it opened or closed. */
	corrente: number | null;
	frase: string;
}

export interface Lettura {
	nodi: Nodo[];
	passi: PassoAlbero[];
}

const VUOTI = new Set(['meta', 'link', 'br', 'hr', 'img', 'input']);
const TITOLI = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const PEZZO = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)[^>]*>|[^<]+/g;

const figli = (nodo: Nodo) => nodo.contenuto.filter((c): c is number => typeof c === 'number');
export const figliDi = figli;

/** Whether `id` is `antenato` or inside it. */
export function dentro(nodi: readonly Nodo[], id: number, antenato: number): boolean {
	for (let at: number | null = id; at !== null; at = nodi[at].genitore) if (at === antenato) return true;
	return false;
}

/** The text an element holds itself, not through its children. */
export const testoDi = (nodo: Nodo) =>
	nodo.contenuto
		.filter((c): c is string => typeof c === 'string')
		.join(' ')
		.trim();

/** Reads the lines of an HTML file and gives the elements and one step for each line, with one before and one after. */
export function leggi(righe: readonly string[]): Lettura {
	const nodi: Nodo[] = [];
	const aperti: number[] = [];
	const passi: PassoAlbero[] = [{ riga: null, nati: 0, aperti: [], corrente: null, frase: 'Il browser ha ricevuto il file e non ha ancora letto niente: l’albero è vuoto. Leggerà una riga alla volta, dall’alto.' }];
	const nome = (id: number) => nodi[id].tag;
	const cima = () => (aperti.length ? aperti[aperti.length - 1] : null);
	const chiudi = (id: number, riga: number, come: Nodo['chiuso']) => {
		nodi[id].fine = riga;
		nodi[id].chiuso = come;
	};

	righe.forEach((testo, riga) => {
		const frasi: string[] = [];
		let corrente: number | null = null;
		for (const pezzo of testo.matchAll(PEZZO)) {
			const tag = pezzo[2]?.toLowerCase();
			if (!tag) {
				const parole = pezzo[0].replace(/\s+/g, ' ').trim();
				const su = cima();
				if (parole && su !== null) nodi[su].contenuto.push(parole);
				continue;
			}
			if (pezzo[1]) {
				// an end tag: its element, and whatever is still open inside it
				const at = aperti.map(nome).lastIndexOf(tag);
				if (at < 0) {
					frasi.push(`</${tag}> non chiude niente, perché nessun ${tag} è aperto: il browser lo salta.`);
					continue;
				}
				const dimenticati = aperti.slice(at + 1).reverse();
				for (const id of dimenticati) chiudi(id, riga, 'browser');
				const id = aperti[at];
				chiudi(id, riga, 'tag');
				aperti.length = at;
				const su = cima();
				// closed on the line that opened it: said with the opening
				if (corrente === id && nodi[id].riga === riga && !dimenticati.length) {
					frasi[frasi.length - 1] = su === null ? `${tag} si apre e si chiude su questa riga.` : `${tag} si apre, prende il suo testo e si chiude su questa riga: è un figlio di ${nome(su)}, che resta aperto.`;
					continue;
				}
				corrente = id;
				const lasciati = dimenticati.length ? ` Dentro c’era ancora ${dimenticati.map(nome).join(' e ')} senza il suo tag di chiusura: il browser lo chiude da sé, senza avvisare.` : '';
				frasi.push(su === null ? `</${tag}> chiude la radice.${lasciati} Il file è finito.` : `</${tag}> chiude ${tag}.${lasciati} Si torna al genitore, ${nome(su)}: il prossimo elemento sarà suo figlio.`);
				continue;
			}
			// a start tag: what cannot hold it is closed first
			let su = cima();
			if (su !== null && ((TITOLI.has(tag) && TITOLI.has(nome(su))) || (tag === 'p' && nome(su) === 'p'))) {
				frasi.push(`Un ${tag} non può stare dentro ${nome(su)}: il browser chiude ${nome(su)} da sé.`);
				chiudi(su, riga, 'browser');
				aperti.pop();
				su = cima();
			}
			const id = nodi.length;
			nodi.push({ id, tag, genitore: su, contenuto: [], riga, fine: riga, chiuso: 'browser' });
			if (su !== null) nodi[su].contenuto.push(id);
			corrente = id;
			if (VUOTI.has(tag)) {
				chiudi(id, riga, 'vuoto');
				frasi.push(`${tag} non ha un tag di chiusura e non può contenere niente${su === null ? '' : `: è un figlio di ${nome(su)}, che resta aperto`}.`);
				continue;
			}
			aperti.push(id);
			frasi.push(su === null ? `Si apre ${tag}: è la radice dell’albero, e tutto quello che segue finirà al suo interno.` : `Si apre ${tag}: diventa figlio di ${nome(su)}, l’ultimo elemento ancora aperto.`);
		}
		// a start tag with its text and no end tag on the line: the element stays open, and the sentence says so
		const su = cima();
		if (corrente !== null && su === corrente && nodi[corrente].riga === riga && testoDi(nodi[corrente])) frasi[frasi.length - 1] += ` Prende il suo testo, ma su questa riga non c’è </${nome(corrente)}>: ${nome(corrente)} resta aperto.`;
		passi.push({ riga, nati: nodi.length, aperti: [...aperti], corrente, frase: frasi.join(' ') || 'Una riga senza tag: il testo va nell’elemento aperto.' });
	});

	const rimasti = [...aperti].reverse();
	for (const id of rimasti) chiudi(id, righe.length - 1, 'browser');
	const dimenticati = nodi.filter((nodo) => nodo.chiuso === 'browser').map((nodo) => nodo.tag);
	passi.push({
		riga: null,
		nati: nodi.length,
		aperti: [],
		corrente: null,
		frase: dimenticati.length
			? `Il file è finito: l’albero ha ${nodi.length} elementi. A ${dimenticati.join(', ')} mancava il tag di chiusura: lo ha chiuso il browser, e quello che era scritto dopo è finito al suo interno.`
			: `Il file è finito e ogni elemento è stato chiuso dal suo tag: l’albero ha ${nodi.length} elementi.`
	});
	return { nodi, passi };
}

/** Where each element is drawn in a tree that grows downwards: `x` in leaf widths (a leaf every 1), `y` the depth from 0. */
export function disponi(nodi: readonly Nodo[]): { x: number[]; y: number[]; foglie: number; livelli: number } {
	const x: number[] = new Array(nodi.length).fill(0);
	const y: number[] = new Array(nodi.length).fill(0);
	let foglie = 0;
	let livelli = 0;
	const posa = (id: number, profondo: number) => {
		y[id] = profondo;
		livelli = Math.max(livelli, profondo + 1);
		const suoi = figli(nodi[id]);
		if (!suoi.length) {
			x[id] = foglie++;
			return;
		}
		for (const figlio of suoi) posa(figlio, profondo + 1);
		x[id] = (x[suoi[0]] + x[suoi[suoi.length - 1]]) / 2;
	};
	nodi.forEach((nodo) => nodo.genitore === null && posa(nodo.id, 0));
	return { x, y, foglie, livelli };
}
