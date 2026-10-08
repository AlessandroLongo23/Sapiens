/**
 * Elenchi e tabelle. Spec: specs/exercises/inf-html-elenchi-tabelle.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/90-inf-html-elenchi-tabelle.md), all multiple
 * choice. Every question shows a fragment of HTML or offers fragments as options, and asks to foresee or to tell
 * apart: 1. a bulleted or a numbered list; 2. a list inside another; 3. rows, columns and cells of a table;
 * 4. a table written well, with its caption; 5. `colspan`, with the count of the columns; 6. `rowspan`, with the
 * cells that are no longer written in the row below.
 *
 * Fragments are indented by two spaces and keep one element per row, so that they fit a phone. The wrong options
 * are the mistakes of the lesson's warnings: numbers typed by hand, text outside the items, the inner list after
 * `</li>`, a cell outside its row, a cell joined without deleting its neighbour.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, listingOption, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';

export const ID = 'inf-html-elenchi-tabelle';

const rows = (...parts: (string | readonly string[])[]) => parts.flat().join('\n') + '\n';
const some = <T>(rng: Rng, xs: readonly T[], n: number) => shuffle(rng, xs).slice(0, n);
/** `n` elements of a list, in the order they have in it. */
const inOrder = <T>(rng: Rng, xs: readonly T[], n: number) => {
	const kept = new Set(some(rng, xs.map((_, i) => i), n));
	return xs.filter((_, i) => kept.has(i));
};
const quote = (text: string) => `"${text}"`;
/** Words in a row as a sentence lists them: `Luogo, Ingresso e Ora`. */
const listed = (words: readonly string[]) => (words.length > 1 ? `${words.slice(0, -1).join(', ')} e ${words[words.length - 1]}` : words[0]);

/**
 * Four numbers: the right one, then the wrong ones in the order given (each the result of a mistake), then its
 * neighbours when the mistakes give too few different numbers.
 */
function numbers(rng: Rng, right: number, mistakes: readonly number[]) {
	const others = [...mistakes, right + 1, right - 1, right + 2, right + 3].filter((n) => n > 0 && n !== right);
	return choose(
		rng,
		textOption(String(right)),
		others.map((n) => textOption(String(n)))
	);
}

/** A multiple choice of fragments: the right one, and three of the wrong ones, those of `first` before the others. */
function fragments(rng: Rng, right: string, wrong: Record<string, string>, first: readonly string[] = []) {
	const keys = [...first, ...shuffle(rng, Object.keys(wrong).filter((k) => !first.includes(k)))];
	const taken: string[] = [];
	const options: ChoiceOption[] = [];
	const seen = new Set([right]);
	for (const key of keys) {
		if (options.length === 3) break;
		if (seen.has(wrong[key])) continue;
		seen.add(wrong[key]);
		taken.push(key);
		options.push(listingOption(wrong[key]));
	}
	return { answer: choose(rng, listingOption(right), options), wrong: taken };
}

// ---------------------------------------------------------------------------
// Level 1: a bulleted or a numbered list

interface Elenco {
	what: string;
	kind: 'ul' | 'ol';
	items: readonly string[];
}

const LISTS: readonly Elenco[] = [
	{ what: 'i componenti di un gruppo musicale', kind: 'ul', items: ['Sara', 'Marta', 'Dario', 'Leo'] },
	{ what: 'gli ingredienti di una macedonia', kind: 'ul', items: ['mele', 'pere', 'kiwi', 'fragole'] },
	{ what: 'le cose da mettere nello zaino', kind: 'ul', items: ['astuccio', 'diario', 'merenda', 'quaderno'] },
	{ what: 'gli strumenti che ci sono in sala prove', kind: 'ul', items: ['chitarra', 'basso', 'batteria', 'tastiera'] },
	{ what: 'i gusti di una gelateria', kind: 'ul', items: ['limone', 'fragola', 'nocciola', 'pistacchio'] },
	{ what: 'i colori in cui si può avere la felpa del gruppo', kind: 'ul', items: ['rosso', 'verde', 'blu', 'nero'] },
	{ what: 'i passi di una ricetta, dal primo all’ultimo', kind: 'ol', items: ['sbuccia', 'taglia', 'mescola', 'servi'] },
	{ what: 'la classifica di un torneo, dal primo posto in giù', kind: 'ol', items: ['Leoni', 'Falchi', 'Lupi', 'Orsi'] },
	{ what: 'la scaletta di un concerto, nell’ordine in cui si suona', kind: 'ol', items: ['Controtempo', 'Ora buca', 'Ultimo banco', 'Rientro'] },
	{ what: 'le tappe di una gita, nell’ordine del viaggio', kind: 'ol', items: ['Pisa', 'Lucca', 'Siena', 'Arezzo'] },
	{ what: 'l’ordine di arrivo di una gara di corsa', kind: 'ol', items: ['Marta', 'Luca', 'Irene', 'Paolo'] },
	{ what: 'le istruzioni per accendere il proiettore, in ordine', kind: 'ol', items: ['collega', 'accendi', 'scegli HDMI', 'spegni la luce'] }
];

const numbered = (items: readonly string[]) => items.map((item, i) => `${i + 1}. ${item}`);
const list = (outer: string, inner: string, items: readonly string[]) => rows(`<${outer}>`, items.map((item) => `  <${inner}>${item}</${inner}>`), `</${outer}>`);
/** What the browser shows of a list, row by row: a number or a bullet, then the text of the item as it is written. */
const shown = (tag: 'ul' | 'ol', items: readonly string[]) => rows(items.map((item, i) => `${tag === 'ol' ? `${i + 1}.` : '•'} ${item}`));

function level1(rng: Rng): CodeBuilt {
	const kind = rng.pick(['scegli', 'vede'] as const);
	const e = rng.pick(LISTS);
	// an ordered list keeps the order its items have: the steps of a recipe do not come shuffled
	const items = e.kind === 'ol' ? inOrder(rng, e.items, 3) : some(rng, e.items, 3);
	if (kind === 'scegli') {
		const other = e.kind === 'ul' ? 'ol' : 'ul';
		const wrong: Record<string, string> = {
			altro: list(other, 'li', items),
			senzaLi: rows(`<${e.kind}>`, items.map((item) => `  ${item}`), `</${e.kind}>`),
			inventati: list('list', 'item', items),
			paragrafi: list(e.kind, 'p', items),
			...(e.kind === 'ol' ? { numeri: list('ol', 'li', numbered(items)), numeriUl: list('ul', 'li', numbered(items)) } : { soloLi: rows(items.map((item) => `<li>${item}</li>`)) })
		};
		const { answer, wrong: taken } = fragments(rng, list(e.kind, 'li', items), wrong, ['altro']);
		return {
			prompt: 'Chiediti se scambiando due voci cambia il significato.',
			problem: `In una pagina devi mettere ${e.what}: ${items.join(', ')}${e.kind === 'ol' ? ', in quest’ordine' : ''}. Quale frammento HTML va bene?`,
			solution: `Il frammento con <${e.kind}> intorno e un <li> per ogni voce.`,
			steps: [
				e.kind === 'ol' ? 'Qui l’ordine delle voci conta: serve un elenco numerato, che si scrive con <ol>.' : 'Qui le voci si possono scambiare senza cambiare il significato: serve un elenco puntato, che si scrive con <ul>.',
				'Ogni voce sta in un suo elemento <li>: dentro l’elenco non c’è altro, né testo sciolto né paragrafi.',
				e.kind === 'ol' ? 'I numeri non si scrivono: li mette il browser, e scritti a mano comparirebbero due volte.' : 'Un <li> ha senso solo dentro un elenco, e tag come <list> o <item> non esistono.'
			],
			solutionListing: list(e.kind, 'li', items),
			answer,
			params: { case: 'scegli', kind: e.kind, items, what: LISTS.indexOf(e), wrong: taken }
		};
	}
	const tag = rng.pick(['ul', 'ol'] as const);
	const typed = rng.int(0, 2) === 0;
	const texts = typed ? numbered(items) : items;
	const right = shown(tag, texts);
	const others = [shown(tag === 'ol' ? 'ul' : 'ol', texts), shown(tag, typed ? items : numbered(items)), ...shuffle(rng, [rows(items.join(' ')), rows(items), shown(tag === 'ol' ? 'ul' : 'ol', typed ? items : numbered(items))])];
	return {
		prompt: 'Guarda il tag dell’elenco e che cosa c’è scritto in ogni voce.',
		problem: 'Che cosa mostra il browser?',
		listing: list(tag, 'li', texts),
		solution: right.trimEnd().split('\n').join(', '),
		steps: [
			tag === 'ol' ? 'L’elenco è un <ol>: il browser mette un numero davanti a ogni voce, e li conta lui.' : 'L’elenco è un <ul>: il browser mette un pallino davanti a ogni voce.',
			typed ? `Dopo il ${tag === 'ol' ? 'numero' : 'pallino'} compare il testo della voce così com’è scritto, compresi i numeri battuti a mano${tag === 'ol' ? ': per questo ogni numero si legge due volte' : ''}.` : 'Dopo il segno compare il testo della voce, e ogni voce va a capo.'
		],
		answer: choose(
			rng,
			listingOption(right),
			others.map((text) => listingOption(text))
		),
		params: { case: 'vede', tag, typed, items }
	};
}

// ---------------------------------------------------------------------------
// Level 2: a list inside another

interface Voce {
	text: string;
	inner?: { tag: 'ul' | 'ol'; items: string[] };
}

const NESTED: readonly { name: string; groups: readonly (readonly [string, readonly string[]])[] }[] = [
	{
		name: 'scaletta',
		groups: [
			['Primo tempo', ['Controtempo', 'Ora buca', 'Sottovoce']],
			['Secondo tempo', ['Ultimo banco', 'Rientro', 'Campanella']],
			['Bis', ['Fuori orario', 'Ricreazione', 'Sveglia']]
		]
	},
	{
		name: 'spesa',
		groups: [
			['Frutta', ['mele', 'pere', 'kiwi']],
			['Verdura', ['carote', 'zucchine', 'patate']],
			['Bibite', ['acqua', 'succo', 'aranciata']]
		]
	},
	{
		name: 'gita',
		groups: [
			['Primo giorno', ['Pisa', 'Lucca', 'Livorno']],
			['Secondo giorno', ['Siena', 'Arezzo', 'Cortona']],
			['Terzo giorno', ['Firenze', 'Prato', 'Pistoia']]
		]
	},
	{
		name: 'gruppo',
		groups: [
			['Voci', ['Giulia', 'Sara', 'Lea']],
			['Chitarre', ['Karim', 'Ivan', 'Noemi']],
			['Ritmo', ['Tommaso', 'Aldo', 'Rita']]
		]
	}
];

const voce = (v: Voce) => (v.inner ? [`  <li>${v.text}`, `    <${v.inner.tag}>`, ...v.inner.items.map((item) => `      <li>${item}</li>`), `    </${v.inner.tag}>`, '  </li>'] : [`  <li>${v.text}</li>`]);
const nested = (tag: string, voci: readonly Voce[]) => rows(`<${tag}>`, voci.flatMap(voce), `</${tag}>`);

/** A list of two or three items, at least one of them with a list inside, in at most 18 rows. */
function nest(rng: Rng, outer: 'ul' | 'ol', inner: () => 'ul' | 'ol'): Voce[] {
	const theme = rng.pick(NESTED);
	for (;;) {
		const groups = inOrder(rng, theme.groups, rng.int(2, 3));
		const voci: Voce[] = groups.map(([text, pool]) => (rng.int(0, 2) > 0 ? { text, inner: { tag: inner(), items: inOrder(rng, pool, rng.int(2, 3)) } } : { text }));
		if (voci.some((v) => v.inner) && nested(outer, voci).trimEnd().split('\n').length <= 18) return voci;
	}
}

const NESTED_CASES = ['esterne', 'interne', 'tutte', 'numeri', 'bene'] as const;

function level2(rng: Rng): CodeBuilt {
	const kind = rng.pick(NESTED_CASES);
	if (kind === 'bene') {
		const theme = rng.pick(NESTED);
		const [a, b] = inOrder(rng, theme.groups, 2);
		const outer = rng.pick(['ul', 'ol'] as const);
		const inner = rng.pick(['ul', 'ol'] as const);
		const first = rng.int(0, 1) === 0;
		const items = inOrder(rng, (first ? a : b)[1], 2);
		const target = (first ? a : b)[0];
		const plain = (first ? b : a)[0];
		const innerRows = (n: number) => [`${' '.repeat(n)}<${inner}>`, ...items.map((item) => `${' '.repeat(n + 2)}<li>${item}</li>`), `${' '.repeat(n)}</${inner}>`];
		const around = (middle: string[]) => rows(`<${outer}>`, ...(first ? [middle, [`  <li>${plain}</li>`]] : [[`  <li>${plain}</li>`], middle]), `</${outer}>`);
		const right = around([`  <li>${target}`, ...innerRows(4), '  </li>']);
		const wrong: Record<string, string> = {
			// the inner list after the item is closed: between two items, where only <li> can be
			dopo: around([`  <li>${target}</li>`, ...innerRows(2)]),
			// items inside an item, with no list around them
			senzaElenco: around([`  <li>${target}`, ...items.map((item) => `    <li>${item}</li>`), '  </li>']),
			// the inner list after the whole outer list
			fuori: rows(`<${outer}>`, ...(first ? [`  <li>${target}</li>`, `  <li>${plain}</li>`] : [`  <li>${plain}</li>`, `  <li>${target}</li>`]), `</${outer}>`, innerRows(0)),
			// the text of the item left loose in the outer list
			sciolto: around([`  ${target}`, ...innerRows(2)])
		};
		const { answer, wrong: taken } = fragments(rng, right, wrong, ['dopo']);
		return {
			prompt: 'Cerca dove si apre e dove si chiude la voce che contiene l’elenco interno.',
			problem: `Quale frammento mette l’elenco con ${items.join(' e ')} dentro la voce ${quote(target)}?`,
			solution: `Il frammento in cui <${inner}> si apre dopo il testo ${quote(target)} e si chiude prima del suo </li>.`,
			steps: ['Un elenco annidato si scrive dentro la voce a cui appartiene: dopo il suo testo e prima del suo </li>.', 'Chiudere la voce con </li> e aprire l’elenco dopo lo lascia tra una voce e l’altra, dove possono stare solo dei <li>.', `Le voci interne vogliono il loro elenco intorno: <${inner}> e </${inner}>.`],
			solutionListing: right,
			answer,
			params: { case: 'bene', outer, inner, target, plain, items, first, wrong: taken }
		};
	}
	if (kind === 'numeri') {
		const inner = rng.pick(['ol', 'ol', 'ul'] as const);
		let voci: Voce[];
		do voci = nest(rng, 'ol', () => inner);
		while (voci.filter((v) => v.inner).length !== 1 || voci.find((v) => v.inner)!.inner!.items.length !== 2);
		const k = voci.findIndex((v) => v.inner) + 1;
		const [a, b] = voci[k - 1].inner!.items;
		const restart = textOption('1 e 2');
		const bullets = textOption('nessun numero: hanno un pallino');
		const others = [textOption(`${voci.length + 1} e ${voci.length + 2}`), textOption(`${k}.1 e ${k}.2`), textOption(`${k + 1} e ${k + 2}`), textOption('a e b')];
		return {
			prompt: 'Ogni elenco conta le sue voci per conto suo.',
			problem: `Che numeri mette il browser davanti alle voci ${quote(a)} e ${quote(b)}?`,
			listing: nested('ol', voci),
			solution: inner === 'ol' ? '1 e 2: la numerazione ricomincia in ogni elenco.' : 'Nessun numero: l’elenco interno è un <ul> e le sue voci hanno un pallino.',
			steps: [`Le due voci stanno nell’elenco annidato dentro ${quote(voci[k - 1].text)}, che è un <${inner}>.`, inner === 'ol' ? 'Un <ol> numera le sue voci da 1, senza guardare l’elenco che lo contiene: la numerazione non prosegue e non diventa 1.1.' : 'Un <ul> mette un pallino davanti alle sue voci, anche quando sta dentro un elenco numerato.'],
			answer: choose(rng, inner === 'ol' ? restart : bullets, [inner === 'ol' ? bullets : restart, ...others]),
			params: { case: 'numeri', inner, k, voci }
		};
	}
	const outer = rng.pick(['ul', 'ol'] as const);
	const voci = nest(rng, outer, () => rng.pick(['ul', 'ol'] as const));
	const withInner = voci.filter((v) => v.inner);
	const inside = withInner.reduce((n, v) => n + v.inner!.items.length, 0);
	const all = voci.length + inside;
	const base = { listing: nested(outer, voci), prompt: 'Segui i rientri: ogni elenco ha le sue voci.' };
	if (kind === 'esterne')
		return {
			...base,
			problem: 'Quante voci ha l’elenco più esterno?',
			solution: `${voci.length}: ${voci.map((v) => v.text).join(', ')}.`,
			steps: [`L’elenco più esterno è il <${outer}> della prima riga: le sue voci sono i <li> rientrati di un solo livello.`, `Sono ${voci.length}: ${voci.map((v) => v.text).join(', ')}. Le altre voci appartengono agli elenchi annidati.`],
			answer: numbers(rng, voci.length, [all, inside, withInner[0].inner!.items.length, voci.length + withInner.length]),
			params: { case: 'esterne', outer, voci }
		};
	if (kind === 'interne') {
		const target = rng.pick(withInner);
		const n = target.inner!.items.length;
		return {
			...base,
			problem: `Quante voci ha l’elenco annidato dentro la voce ${quote(target.text)}?`,
			solution: `${n}: ${target.inner!.items.join(', ')}.`,
			steps: [`Dentro la voce ${quote(target.text)}, prima del suo </li>, si apre un <${target.inner!.tag}>.`, `Le sue voci sono ${n}: ${target.inner!.items.join(', ')}.`],
			answer: numbers(rng, n, [voci.length, all, inside, n + 1]),
			params: { case: 'interne', outer, voci, target: target.text }
		};
	}
	return {
		...base,
		problem: 'Quanti elementi <li> ci sono in tutto nel frammento?',
		solution: `${all}: ${voci.length} dell’elenco esterno e ${inside} degli elenchi annidati.`,
		steps: [`L’elenco esterno ha ${voci.length} voci.`, `Gli elenchi annidati ne hanno in tutto ${inside}.`, `In tutto ${voci.length} + ${inside} = ${all}.`],
		answer: numbers(rng, all, [voci.length, inside, all + withInner.length, all - 1]),
		params: { case: 'tutte', outer, voci }
	};
}

// ---------------------------------------------------------------------------
// Tables

interface Theme {
	name: string;
	caption: string;
	headers: readonly string[];
	data: readonly (readonly string[])[];
}

const TABLES: readonly Theme[] = [
	{
		name: 'concerti',
		caption: 'Concerti',
		headers: ['Data', 'Luogo', 'Ingresso', 'Ora'],
		data: [
			['12 aprile', 'Aula magna', 'gratis', '18:00'],
			['3 maggio', 'Parco Verdi', 'gratis', '17:00'],
			['7 giugno', 'Teatro Lux', '5 euro', '21:00']
		]
	},
	{
		name: 'classifica',
		caption: 'Classifica',
		headers: ['Squadra', 'Punti', 'Vinte', 'Perse'],
		data: [
			['Leoni', '18', '6', '1'],
			['Falchi', '15', '5', '2'],
			['Lupi', '9', '3', '4']
		]
	},
	{
		name: 'prove',
		caption: 'Prove',
		headers: ['Giorno', 'Inizio', 'Aula', 'Durata'],
		data: [
			['lunedì', '14:30', 'Aula 12', '2 ore'],
			['mercoledì', '16:00', 'Aula 7', '1 ora'],
			['giovedì', '15:00', 'Palestra', '3 ore']
		]
	},
	{
		name: 'mensa',
		caption: 'Mensa',
		headers: ['Giorno', 'Primo', 'Secondo', 'Frutta'],
		data: [
			['lunedì', 'pasta', 'pollo', 'mela'],
			['martedì', 'riso', 'pesce', 'pera'],
			['venerdì', 'zuppa', 'uova', 'kiwi']
		]
	},
	{
		name: 'voti',
		caption: 'Voti',
		headers: ['Materia', 'Scritto', 'Orale', 'Pratico'],
		data: [
			['Storia', '7', '8', '9'],
			['Fisica', '6', '7', '8'],
			['Arte', '9', '8', '7']
		]
	}
];

/** One cell as it is written: `<td colspan="2">testo</td>`. */
const cell = (tag: string, text: string, attributes = '') => `<${tag}${attributes ? ` ${attributes}` : ''}>${text}</${tag}>`;
const tr = (cells: readonly string[], indent = 2) => [`${' '.repeat(indent)}<tr>`, ...cells.map((c) => `${' '.repeat(indent + 2)}${c}`), `${' '.repeat(indent)}</tr>`];
const table = (...trs: readonly string[][]) => rows('<table>', ...trs, '</table>');

// ---------------------------------------------------------------------------
// Level 3: rows, columns and cells

const SIZES: readonly (readonly [number, number])[] = [
	[2, 1],
	[2, 2],
	[2, 3],
	[3, 1],
	[3, 2],
	[4, 1]
];
const GRID_CASES = ['righe', 'colonne', 'celle', 'intestazione'] as const;

function level3(rng: Rng): CodeBuilt {
	const kind = rng.pick(GRID_CASES);
	// the case is drawn once: a table that cannot be asked about is drawn again, and the shares stay even
	for (;;) {
		const built = grid(rng, kind);
		if (built) return built;
	}
}

function grid(rng: Rng, kind: (typeof GRID_CASES)[number]): CodeBuilt | null {
	const theme = rng.pick(TABLES);
	const [c, r] = rng.pick(SIZES);
	const headers = theme.headers.slice(0, c);
	const data = some(rng, theme.data, r).map((row) => row.slice(0, c));
	const listing = table(tr(headers.map((h) => cell('th', h))), ...data.map((row) => tr(row.map((d) => cell('td', d)))));
	const base = { listing, prompt: 'Una tabella si scrive una riga alla volta: conta i <tr> e le celle di una riga.' };
	const params = { theme: theme.name, headers, data };
	if (kind === 'righe')
		return {
			...base,
			problem: 'Quante righe ha la tabella, contando anche quella delle intestazioni?',
			solution: `${r + 1}: una riga per ogni <tr>.`,
			steps: ['Ogni <tr> è una riga della tabella.', `Nel frammento i <tr> sono ${r + 1}: quello delle intestazioni e ${r === 1 ? 'uno di dati' : `${r} di dati`}.`],
			answer: numbers(rng, r + 1, [c, r, r * c, (r + 1) * c]),
			params: { case: 'righe', ...params }
		};
	if (kind === 'colonne')
		return {
			...base,
			problem: 'Quante colonne ha la tabella?',
			solution: `${c}: tante quante le celle di una riga.`,
			steps: ['Le colonne non hanno un loro elemento: una colonna è fatta dalle celle che occupano lo stesso posto nelle righe.', `Ogni riga ha ${c} celle, quindi le colonne sono ${c}.`],
			answer: numbers(rng, c, [r + 1, r, (r + 1) * c, r * c]),
			params: { case: 'colonne', ...params }
		};
	if (kind === 'celle')
		return {
			...base,
			problem: 'Quante celle di dati, cioè quanti <td>, ha la tabella?',
			solution: r === 1 ? `${c}: una sola riga di dati, con ${c} celle.` : `${r * c}: ${r} righe di dati con ${c} celle ciascuna.`,
			steps: ['Le celle della prima riga sono <th>, intestazioni: non contano.', r === 1 ? `Resta una riga, con ${c} <td>.` : `Restano ${r} righe con ${c} <td> ciascuna: ${r} · ${c} = ${r * c}.`],
			answer: numbers(rng, r * c, [(r + 1) * c, c, r + 1, r + c]),
			params: { case: 'celle', ...params }
		};
	// a datum that is written once in the table, and not in the first column, which is read without counting
	const once = data.flatMap((cells, y) => cells.map((d, x) => ({ d, y, x }))).filter(({ d, x }) => x > 0 && data.flat().filter((other) => other === d).length === 1);
	if (!once.length) return null;
	const { y: row, x: column, d: datum } = rng.pick(once);
	const others = [...shuffle(rng, headers.filter((_, i) => i !== column)), ...shuffle(rng, theme.headers.slice(c)), data[row][0], 'sotto nessuna'];
	return {
		...base,
		prompt: 'Conta a che posto sta la cella nella sua riga.',
		problem: `Sotto quale intestazione compare ${quote(datum)}?`,
		solution: `Sotto ${quote(headers[column])}: è la cella numero ${column + 1} della sua riga.`,
		steps: [`${quote(datum)} è la cella numero ${column + 1} della sua riga.`, `Finisce nella colonna numero ${column + 1}, quella che nella prima riga ha l’intestazione ${quote(headers[column])}.`],
		answer: choose(
			rng,
			textOption(headers[column]),
			others.filter((o) => o !== datum).map((o) => textOption(o))
		),
		params: { case: 'intestazione', ...params, datum }
	};
}

// ---------------------------------------------------------------------------
// Level 4: a table written well

function level4(rng: Rng): CodeBuilt {
	const theme = rng.pick(TABLES);
	const [i, j] = inOrder(rng, [0, 1, 2, 3], 2);
	const [h1, h2] = [theme.headers[i], theme.headers[j]];
	if (rng.int(0, 1) === 0) {
		const data = rng.pick(theme.data);
		const [d1, d2] = [data[i], data[j]];
		const right = table(tr([cell('th', h1), cell('th', h2)]), tr([cell('td', d1), cell('td', d2)]));
		const wrong: Record<string, string> = {
			// written a column at a time
			colonne: table(tr([cell('th', h1), cell('td', d1)]), tr([cell('th', h2), cell('td', d2)])),
			senzaTr: rows('<table>', [cell('th', h1), cell('th', h2), cell('td', d1), cell('td', d2)].map((c) => `  ${c}`), '</table>'),
			inventati: rows('<table>', '  <row>', `    ${cell('head', h1)}`, `    ${cell('head', h2)}`, '  </row>', '  <row>', `    ${cell('cell', d1)}`, `    ${cell('cell', d2)}`, '  </row>', '</table>'),
			scambiati: table(tr([cell('td', h1), cell('td', h2)]), tr([cell('th', d1), cell('th', d2)])),
			corta: table(tr([cell('th', h1), cell('th', h2)]), tr([cell('td', d1)])),
			sopra: table(tr([cell('td', d1), cell('td', d2)]), tr([cell('th', h1), cell('th', h2)]))
		};
		const { answer, wrong: taken } = fragments(rng, right, wrong, ['colonne']);
		return {
			prompt: 'Una riga alla volta: prima le intestazioni, poi i dati.',
			problem: `Quale frammento mostra una tabella con le celle di intestazione ${quote(h1)} e ${quote(h2)} e, sotto, le celle di dati ${quote(d1)} e ${quote(d2)}?`,
			solution: 'Il frammento con due <tr>: il primo con i due <th>, il secondo con i due <td>.',
			steps: ['La tabella si scrive una riga alla volta: ogni <tr> contiene le celle di una riga, da sinistra a destra.', 'La prima riga ha le intestazioni, in celle <th>; la seconda i dati, in celle <td>.', 'Ogni cella sta dentro un <tr>, e le due righe hanno lo stesso numero di celle.'],
			solutionListing: right,
			answer,
			params: { case: 'struttura', theme: theme.name, headers: [h1, h2], data: [d1, d2], wrong: taken }
		};
	}
	const head = tr([cell('th', h1), cell('th', h2)]);
	const caption = `  <caption>${theme.caption}</caption>`;
	const right = rows('<table>', caption, head, '</table>');
	const wrong: Record<string, string> = {
		prima: rows(caption.trim(), '<table>', head, '</table>'),
		dopo: rows('<table>', head, '</table>', caption.trim()),
		nellaRiga: rows('<table>', '  <tr>', `    <caption>${theme.caption}</caption>`, ...head.slice(1), '</table>'),
		title: rows('<table>', `  <title>${theme.caption}</title>`, head, '</table>'),
		attributo: rows(`<table caption="${theme.caption}">`, head, '</table>'),
		titolo: rows('<table>', `  <h2>${theme.caption}</h2>`, head, '</table>')
	};
	const { answer, wrong: taken } = fragments(rng, right, wrong);
	return {
		prompt: 'Cerca dove si trova la didascalia rispetto a <table> e alla prima riga.',
		problem: `Quale frammento dà alla tabella la didascalia ${quote(theme.caption)}?`,
		solution: 'Il frammento con <caption> subito dopo <table>, prima della prima riga.',
		steps: ['La didascalia di una tabella è l’elemento <caption>.', 'Si scrive dentro la tabella, subito dopo <table> e prima del primo <tr>: non dentro una riga, e non fuori dalla tabella.'],
		solutionListing: right,
		answer,
		params: { case: 'didascalia', theme: theme.name, headers: [h1, h2], caption: theme.caption, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 5: colspan

const PAIRS: readonly (readonly [string, string])[] = [
	['Sabato', 'Domenica'],
	['Mattina', 'Pomeriggio'],
	['Andata', 'Ritorno'],
	['Scritto', 'Orale'],
	['Primo tempo', 'Secondo tempo'],
	['In casa', 'Fuori casa']
];
const LEADS = ['Classe', 'Squadra', 'Giorno', 'Nome'] as const;
const WIDE = ['da definire', 'sospesa', 'chiuso', 'vacanza', 'assente'] as const;

function level5(rng: Rng): CodeBuilt {
	if (rng.int(0, 1) === 0) {
		const [a, b] = rng.pick(PAIRS);
		const lead = rng.int(0, 2) > 0 ? rng.pick(LEADS) : null;
		const [m, n] = [rng.int(2, 4), rng.int(2, 4)];
		const cells = [...(lead ? [cell('th', lead)] : []), cell('th', a, `colspan="${m}"`), cell('th', b, `colspan="${n}"`)];
		const columns = m + n + (lead ? 1 : 0);
		return {
			prompt: 'Somma i posti occupati da ogni cella: una cella senza colspan ne occupa 1.',
			problem: 'Questa è la prima riga di una tabella. Quante colonne ha la tabella?',
			listing: rows('<table>', tr(cells), '  <!-- le altre righe -->', '</table>'),
			solution: `${columns}: ${[...(lead ? ['1'] : []), m, n].join(' + ')} = ${columns}.`,
			steps: [`Una cella con colspan occupa tante colonne quante dice l’attributo: ${quote(a)} ne occupa ${m} e ${quote(b)} ne occupa ${n}.`, lead ? `${quote(lead)} non ha colspan e ne occupa 1.` : 'Nella riga non ci sono altre celle.', `Le colonne sono ${[...(lead ? ['1'] : []), m, n].join(' + ')} = ${columns}, anche se le celle scritte sono solo ${cells.length}.`],
			answer: numbers(rng, columns, [cells.length, m + n + (lead ? 0 : 1), m * n, Math.max(m, n), columns + 1]),
			params: { case: 'colonne', lead, names: [a, b], spans: [m, n] }
		};
	}
	const theme = rng.pick(TABLES);
	const c = rng.int(3, 4);
	const headers = theme.headers.slice(0, c);
	const data = rng.pick(theme.data).slice(0, c);
	const k = rng.int(2, c - 1);
	const start = rng.int(1, c - k);
	const text = rng.pick(WIDE);
	const before = data.slice(0, start).map((d) => cell('td', d));
	const after = data.slice(start + k).map((d) => cell('td', d));
	const right = rows(tr([...before, cell('td', text, `colspan="${k}"`), ...after], 0));
	const wrong: Record<string, string> = {
		// joined without deleting: the cells it took are still there
		inPiu: rows(tr([...before, cell('td', text, `colspan="${k}"`), ...data.slice(start + 1).map((d) => cell('td', d))], 0)),
		rowspan: rows(tr([...before, cell('td', text, `rowspan="${k}"`), ...after], 0)),
		troppo: rows(tr([...before, cell('td', text, `colspan="${k + 1}"`), ...after], 0)),
		corta: rows(tr([...before, cell('td', text), ...after], 0)),
		span: rows(tr([...before, cell('td', text, `span="${k}"`), ...after], 0)),
		sulTr: rows(`<tr colspan="${k}">`, [...before, cell('td', text), ...after].map((x) => `  ${x}`), '</tr>')
	};
	const { answer, wrong: taken } = fragments(rng, right, wrong, ['inPiu']);
	const taken2 = headers.slice(start, start + k);
	return {
		prompt: 'Fai il conto dei posti: i colspan della riga devono dare il numero di colonne.',
		problem: `Una tabella ha ${c} colonne: ${headers.join(', ')}. Quale riga la completa bene, con una sola cella ${quote(text)} che occupa le colonne ${listed(taken2)}?`,
		solution: `La riga con ${c - k + 1} celle, in cui ${quote(text)} ha colspan="${k}".`,
		steps: [`Per occupare ${k} colonne la cella ha colspan="${k}": rowspan la farebbe scendere sulle righe sotto.`, `Le celle di cui prende il posto non si scrivono più: nella riga restano ${c - k + 1} celle.`, `Il conto dei posti torna: ${[...before.map(() => '1'), String(k), ...after.map(() => '1')].join(' + ')} = ${c}.`],
		solutionListing: right,
		answer,
		params: { case: 'riga', theme: theme.name, columns: c, cells: [...data.slice(0, start), text, ...data.slice(start + k)], start, span: k, wrong: taken }
	};
}

// ---------------------------------------------------------------------------
// Level 6: rowspan

function level6(rng: Rng): CodeBuilt {
	const kind = rng.pick(['mancano', 'colonna'] as const);
	for (;;) {
		const built = tall(rng, kind);
		if (built) return built;
	}
}

function tall(rng: Rng, kind: 'mancano' | 'colonna'): CodeBuilt | null {
	const theme = rng.pick(TABLES);
	if (kind === 'mancano') {
		const c = rng.int(3, 4);
		const headers = theme.headers.slice(0, c);
		const data = rng.pick(theme.data).slice(0, c);
		const high = inOrder(rng, data.map((_, i) => i), rng.int(1, 2));
		const span = rng.int(2, 3);
		const listing = table(tr(headers.map((h) => cell('th', h))), tr(data.map((d, i) => cell('td', d, high.includes(i) ? `rowspan="${span}"` : ''))), ['  <tr>', '    <!-- quante celle? -->', '  </tr>']);
		const left = c - high.length;
		return {
			prompt: 'Conta i posti della riga che sono già presi dalle celle che scendono da sopra.',
			problem: 'Quante celle vanno scritte nella riga con il commento, perché la tabella sia giusta?',
			listing,
			solution: `${left}: le colonne sono ${c} e ${high.length === 1 ? 'un posto è già preso' : `${high.length} posti sono già presi`}.`,
			steps: [`La tabella ha ${c} colonne.`, `${high.length === 1 ? `La cella ${quote(data[high[0]])} ha` : `Le celle ${high.map((i) => quote(data[i])).join(' e ')} hanno`} rowspan="${span}": ${high.length === 1 ? 'scende' : 'scendono'} anche sulla riga sotto e ne ${high.length === 1 ? 'occupa un posto' : `occupano ${high.length}`}.`, `Nella riga sotto restano da scrivere ${c} − ${high.length} = ${left} celle.`],
			answer: numbers(rng, left, [c, c - span, c + high.length, span, c - 1]),
			params: { case: 'mancano', theme: theme.name, columns: c, tall: high, span }
		};
	}
	const headers = theme.headers.slice(0, 3);
	const [first, second] = some(rng, theme.data, 2).map((row) => row.slice(0, 3));
	const at = rng.int(0, 2);
	const below = second.filter((_, i) => i !== at);
	const asked = rng.int(0, 1);
	const datum = below[asked];
	// the datum asked about is written once in the table
	if ([...first, ...below].filter((d) => d === datum).length !== 1) return null;
	// the columns that are free in the second row, from the left: where its cells go
	const column = [0, 1, 2].filter((i) => i !== at)[asked];
	const listing = table(tr(headers.map((h) => cell('th', h))), tr(first.map((d, i) => cell('td', d, i === at ? 'rowspan="2"' : ''))), tr(below.map((d) => cell('td', d))));
	const none = 'sotto nessuna: la riga è sbagliata';
	return {
		prompt: 'Nella riga sotto, salta il posto già preso dalla cella che scende.',
		problem: `Sotto quale intestazione compare ${quote(datum)}?`,
		listing,
		solution: `Sotto ${quote(headers[column])}.`,
		steps: [`La cella ${quote(first[at])} ha rowspan="2": occupa il posto numero ${at + 1} anche nella riga sotto.`, `Le due celle della riga sotto si mettono nei posti rimasti liberi, da sinistra: i numeri ${[0, 1, 2].filter((i) => i !== at).map((i) => i + 1).join(' e ')}.`, `${quote(datum)} finisce nel posto numero ${column + 1}, sotto ${quote(headers[column])}.`],
		answer: choose(rng, textOption(headers[column]), [...headers.filter((_, i) => i !== column).map((h) => textOption(h)), textOption(none)]),
		params: { case: 'colonna', theme: theme.name, headers, rows: [first, below], at, datum }
	};
}

/** No level of this generator has a program to run: its fragments are read, not executed. */
const fragmentsOnly = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'Elenchi e tabelle', {
	1: { label: 'Puntato o numerato', constraints: ['a list of three items', 'the right fragment or what the browser shows', 'four different options'], build: level1, check: fragmentsOnly },
	2: { label: 'Elenchi annidati', constraints: ['a list of two or three items with a list inside', 'at most 18 rows shown'], build: level2, check: fragmentsOnly },
	3: { label: 'Righe e colonne', constraints: ['a table with a row of headings and one to three rows of data', 'two to four columns'], build: level3, check: fragmentsOnly },
	4: { label: 'Scrivere una tabella', constraints: ['options of at most 10 rows', 'one fragment written well'], build: level4, check: fragmentsOnly },
	5: { label: 'Celle larghe: colspan', constraints: ['the colspans of a row add up to the columns', 'one row written well'], build: level5, check: fragmentsOnly },
	6: { label: 'Celle alte: rowspan', constraints: ['a cell with rowspan takes a place in the row below', 'three or four columns'], build: level6, check: fragmentsOnly }
});
