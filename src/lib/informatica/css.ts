/**
 * The CSS that the lessons on style sheets teach (informatica, third year: "Regole e selettori CSS"), as pure
 * functions without React: reading a selector, saying which elements of a small document it takes, weighing it, and
 * finding the rule that wins on an element. The figures of the lesson show what these return, and the exercise
 * generator builds its answers on them.
 *
 * Only the selectors of the lesson are read: the name of an element, a class, an id, the three joined (`li.prossimo`),
 * a descendant (`nav a`), a child (`ul > li`) and a list with commas. Anything else is an error with a sentence.
 */

/** An element of the small document: its tag, id and classes, the text it holds directly, and its children. */
export type Nodo = { tag: string; id?: string; classi?: readonly string[]; testo?: string; figli?: readonly Nodo[] };

/** One piece of a selector without spaces: `li`, `.prossimo`, `#date`, `li.prossimo`. */
export type Semplice = { tag?: string; id?: string; classi: string[] };

/** A selector: its pieces from the outermost to the one that names the element, and what joins each to the next. */
export type Selettore = { parti: Semplice[]; legami: (' ' | '>')[]; testo: string };

/** How much a selector weighs: how many ids, classes and element names it has, compared in this order. */
export type Peso = readonly [id: number, classi: number, elementi: number];

const NOME = '[A-Za-z_][\\w-]*';
const PEZZO = new RegExp(`^(${NOME}|\\*)?((?:[.#]${NOME})*)$`);

function leggiSemplice(testo: string): Semplice | string {
	const m = PEZZO.exec(testo);
	if (!m || !testo) {
		if (/[.#]$/.test(testo) || /[.#][.#]/.test(testo)) return `Dopo ${testo.includes('#') && !testo.includes('.') ? 'il cancelletto' : 'il punto'} ci vuole subito un nome, senza spazi.`;
		return `"${testo}" non è un selettore di questa lezione.`;
	}
	const semplice: Semplice = { classi: [] };
	if (m[1] && m[1] !== '*') semplice.tag = m[1].toLowerCase();
	for (const [, segno, nome] of m[2].matchAll(new RegExp(`([.#])(${NOME})`, 'g'))) {
		if (segno === '.') semplice.classi.push(nome);
		else if (semplice.id) return 'Un elemento ha un solo id: due cancelletti nello stesso pezzo non prendono niente.';
		else semplice.id = nome;
	}
	return semplice;
}

/** Reads a selector as written in a style sheet. A list with commas gives one selector per item. */
export function leggiSelettore(scritto: string): { selettori: Selettore[] } | { errore: string } {
	const testo = scritto.trim();
	if (!testo) return { errore: 'Scrivi un selettore.' };
	if (/[<>]\s*\/?\s*[A-Za-z]+\s*>|^</.test(testo) || testo.includes('<')) return { errore: 'In un selettore il nome dell’elemento va senza parentesi angolari: p, non <p>.' };
	if (/[{};]/.test(testo)) return { errore: 'Qui va solo il selettore, senza graffe e senza dichiarazioni.' };
	if (/[:[\]+~()"'=]/.test(testo)) return { errore: 'Questo selettore usa una forma che la lezione non tratta.' };
	const selettori: Selettore[] = [];
	for (const voce of testo.split(',')) {
		const pulita = voce.trim().replace(/\s*>\s*/g, ' > ').replace(/\s+/g, ' ');
		if (!pulita) return { errore: 'Tra due virgole manca un selettore.' };
		const pezzi = pulita.split(' ');
		const parti: Semplice[] = [];
		const legami: (' ' | '>')[] = [];
		let atteso = true; // a piece is expected, not a `>`
		for (const pezzo of pezzi) {
			if (pezzo === '>') {
				if (atteso) return { errore: 'Il segno > sta tra due selettori.' };
				legami[legami.length - 1] = '>';
				atteso = true;
				continue;
			}
			const semplice = leggiSemplice(pezzo);
			if (typeof semplice === 'string') return { errore: semplice };
			parti.push(semplice);
			legami.push(' ');
			atteso = false;
		}
		if (atteso) return { errore: 'Il segno > sta tra due selettori.' };
		legami.pop();
		selettori.push({ parti, legami, testo: pulita });
	}
	return { selettori };
}

const combacia = (s: Semplice, nodo: Nodo) => (!s.tag || s.tag === nodo.tag.toLowerCase()) && (!s.id || s.id === nodo.id) && s.classi.every((c) => nodo.classi?.includes(c));

/**
 * Whether a selector takes the last element of `percorso`, the elements from the root of the document down to it.
 * The last piece must fit the element itself; the pieces before it are looked for among its ancestors.
 */
export function prende(selettore: Selettore, percorso: readonly Nodo[]): boolean {
	const fit = (parte: number, dove: number): boolean => {
		if (!combacia(selettore.parti[parte], percorso[dove])) return false;
		if (parte === 0) return true;
		if (selettore.legami[parte - 1] === '>') return dove > 0 && fit(parte - 1, dove - 1);
		for (let su = dove - 1; su >= 0; su--) if (fit(parte - 1, su)) return true;
		return false;
	};
	return percorso.length > 0 && fit(selettore.parti.length - 1, percorso.length - 1);
}

/** The elements of a document in the order they are written, each with the path from the root down to it. */
export function elementi(radice: Nodo): { nodo: Nodo; percorso: Nodo[] }[] {
	const tutti: { nodo: Nodo; percorso: Nodo[] }[] = [];
	const scendi = (nodo: Nodo, sopra: Nodo[]) => {
		const percorso = [...sopra, nodo];
		tutti.push({ nodo, percorso });
		for (const figlio of nodo.figli ?? []) scendi(figlio, percorso);
	};
	scendi(radice, []);
	return tutti;
}

/** Which elements of the document a selector takes: their places in `elementi(radice)`. Empty when it cannot be read. */
export function presi(radice: Nodo, scritto: string): number[] {
	const letto = leggiSelettore(scritto);
	if ('errore' in letto) return [];
	return elementi(radice).flatMap(({ percorso }, i) => (letto.selettori.some((s) => prende(s, percorso)) ? [i] : []));
}

/** The weight of a selector: ids, classes, element names. */
export function peso(selettore: Selettore): Peso {
	let id = 0, classi = 0, nomi = 0;
	for (const parte of selettore.parti) {
		if (parte.id) id++;
		classi += parte.classi.length;
		if (parte.tag) nomi++;
	}
	return [id, classi, nomi];
}

/** Positive when `a` weighs more than `b`, negative when less, 0 when they weigh the same. */
export const confronta = (a: Peso, b: Peso) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** A rule that gives one value to the property the question is about. */
export type Regola = { selettore: string; valore: string };

/** How a rule fares on an element: it does not take it, it loses to another, it wins, or it reaches it by inheritance. */
export type Esito = 'non lo prende' | 'battuta' | 'vince' | 'ereditata';

/**
 * The cascade for one inherited property (the colour of the text) on the last element of `percorso`, with the rules
 * in the order of the style sheet. Among the rules that take the element the heaviest selector wins, and of two that
 * weigh the same the one written later. When no rule takes it, the element has the value of the nearest ancestor
 * that a rule takes. `vince` is the place of the winning rule, or -1 when the value is the browser's own.
 */
export function cascata(regole: readonly Regola[], percorso: readonly Nodo[]): { vince: number; ereditata: boolean; esiti: Esito[]; pesi: (Peso | null)[] } {
	const letti = regole.map((r) => {
		const letto = leggiSelettore(r.selettore);
		return 'errore' in letto ? [] : letto.selettori;
	});
	// the heaviest of the selectors of a rule that take the element, or null
	const pesoSu = (i: number, fin: number): Peso | null => {
		const adatti = letti[i].filter((s) => prende(s, percorso.slice(0, fin + 1))).map(peso);
		return adatti.length ? adatti.reduce((a, b) => (confronta(b, a) > 0 ? b : a)) : null;
	};
	const vincitore = (fin: number) => {
		let best = -1;
		let bestPeso: Peso | null = null;
		regole.forEach((_, i) => {
			const p = pesoSu(i, fin);
			if (p && (!bestPeso || confronta(p, bestPeso) >= 0)) {
				best = i;
				bestPeso = p;
			}
		});
		return best;
	};
	const ultimo = percorso.length - 1;
	const pesi = regole.map((_, i) => pesoSu(i, ultimo));
	const diretto = vincitore(ultimo);
	const esiti: Esito[] = pesi.map((p, i) => (p ? (i === diretto ? 'vince' : 'battuta') : 'non lo prende'));
	if (diretto >= 0) return { vince: diretto, ereditata: false, esiti, pesi };
	for (let su = ultimo - 1; su >= 0; su--) {
		const sopra = vincitore(su);
		if (sopra >= 0) {
			esiti[sopra] = 'ereditata';
			return { vince: sopra, ereditata: true, esiti, pesi };
		}
	}
	return { vince: -1, ereditata: false, esiti, pesi };
}
