/**
 * Stili, titoli, tabelle e indici automatici. Spec: specs/exercises/inf-stili-indici.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/30-inf-stili-indici.md): the style a piece of a
 * document gets; how many titles change when a style is modified; how many entries an automatic index has; what the
 * index shows after a title and its page change, updated or not; the number of a figure, table or note after one is
 * inserted or removed; the cells of a table, with a header row or with merged cells.
 */
import type { Rng } from '../types';
import { type Built, NAMES, choose, makeGenerator, opt, shuffle, wrongs } from '../inf-documenti';

export const ID = 'inf-stili-indici';

// ---------------------------------------------------------------------------
// Level 1: the right style

/** A document, one of its chapters, a part of that chapter, a part of that part. */
const OUTLINES: [string, string, string, string][] = [
	["L'acqua", "Il ciclo dell'acqua", 'Le precipitazioni', 'La neve'],
	['I vulcani', 'Le eruzioni', 'Le eruzioni esplosive', 'Le nubi di cenere'],
	["L'Impero romano", "L'esercito", 'Le legioni', 'I centurioni'],
	['Il sistema solare', 'I pianeti', 'I pianeti rocciosi', 'Marte'],
	['Le piante', 'La foglia', 'La fotosintesi', 'La clorofilla'],
	['Lo sport a scuola', 'Gli sport di squadra', 'La pallavolo', 'Il servizio'],
	["L'energia", 'Le fonti rinnovabili', "L'energia solare", 'I pannelli fotovoltaici'],
	['Il Medioevo', 'La città medievale', 'Le corporazioni', 'Gli apprendisti'],
	['La musica', 'Gli strumenti', 'Gli strumenti a corda', 'Il violino'],
	['Il computer', "L'hardware", 'Le memorie', 'La memoria centrale'],
];

const STYLES = ['Titolo 1', 'Titolo 2', 'Titolo 3', 'Corpo del testo', 'Didascalia'] as const;
type Style = (typeof STYLES)[number];

const STYLE_WHY: Record<Style, string> = {
	'Titolo 1': 'È il titolo di un capitolo: i capitoli hanno lo stile Titolo 1.',
	'Titolo 2': 'È il titolo di una parte di un capitolo: un livello sotto, quindi Titolo 2.',
	'Titolo 3': 'È il titolo di una parte di una parte: due livelli sotto il capitolo, quindi Titolo 3.',
	'Corpo del testo': 'Non è un titolo: il testo normale ha lo stile Corpo del testo, a qualunque livello si trovi il titolo che lo precede.',
	Didascalia: 'La riga che accompagna una figura con il suo numero è una didascalia, e ha lo stile Didascalia.',
};

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [doc, C, P, S] = rng.pick(OUTLINES);
	const style = rng.pick(STYLES);
	const under = rng.pick([C, P, S]);
	const target = style === 'Titolo 1' ? `al titolo "${C}"` : style === 'Titolo 2' ? `al titolo "${P}"` : style === 'Titolo 3' ? `al titolo "${S}"` : style === 'Corpo del testo' ? `al testo normale scritto sotto il titolo "${under}"` : `alla riga con il numero e la descrizione di una figura, sotto il titolo "${under}"`;
	const others = shuffle(
		rng,
		STYLES.filter((s) => s !== style),
	);
	return {
		prompt: 'Scegli lo stile giusto.',
		problem: `Nella ricerca "${doc}" di ${N}, "${C}" è un capitolo, "${P}" è una parte di quel capitolo e "${S}" è una parte di "${P}". Quale stile dà ${N} ${target}?`,
		steps: [STYLE_WHY[style]],
		choice: choose(
			rng,
			opt(style),
			others.map((s) => opt(s)),
		),
		params: { case: style },
	};
}

// ---------------------------------------------------------------------------
// Level 2: modifying a style

const MODS = ['sceglie il colore blu', 'sceglie il colore verde', 'passa al carattere di 18 punti', 'aggiunge il corsivo'];

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const a = rng.int(3, 9);
	let b = rng.int(4, 14);
	if (b === a) b = a + 5;
	const m = rng.int(1, 4);
	const j = rng.pick([1, 2]);
	const value = j === 1 ? a : b;
	const other = j === 1 ? b : a;
	return {
		prompt: 'Conta i titoli che cambiano.',
		problem: `Nel documento di ${N} ci sono $${a}$ titoli con lo stile Titolo 1, $${b}$ con lo stile Titolo 2 e $${m}$ titoli formattati a mano, senza stile, che somigliano ai Titolo ${j}. ${N} modifica lo stile Titolo ${j}: ${rng.pick(MODS)}. Quanti titoli cambiano aspetto?`,
		steps: [
			`Cambiano tutti i paragrafi che hanno lo stile Titolo ${j}, e solo quelli: sono $${value}$.`,
			`I titoli con lo stile Titolo ${3 - j} hanno un altro stile. I $${m}$ formattati a mano gli somigliano, ma non hanno lo stile Titolo ${j}: restano com'erano.`,
		],
		number: { value: String(value), wrong: wrongs(String(value), [value + m, a + b, a + b + m, other, m]) },
		params: { case: `titolo${j}` },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the entries of the index

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const counts = [rng.int(2, 6), rng.int(4, 12), rng.int(3, 10)];
	const [a, b, c] = counts;
	const L = rng.pick([1, 2, 3]);
	const hand = rng.next() < 0.5;
	const m = rng.int(1, 3);
	const value = counts.slice(0, L).reduce((x, y) => x + y, 0);
	const sum = counts.slice(0, L).join(' + ');
	const steps = [`Entrano nell'indice i paragrafi con uno stile di titolo fino al livello $${L}$: ${L === 1 ? `i $${a}$ Titolo 1` : `$${sum} = ${value}$`}.`];
	if (L < 3) steps.push(`I titoli di livello più basso sono oltre il livello scelto e restano fuori.`);
	if (hand) steps.push(`I $${m}$ titoli in grassetto non hanno uno stile di titolo: per il programma sono testo normale, e non entrano.`);
	return {
		prompt: "Conta le voci dell'indice.",
		problem: `Il documento di ${N} ha $${a}$ titoli con lo stile Titolo 1, $${b}$ con lo stile Titolo 2 e $${c}$ con lo stile Titolo 3${hand ? `, più $${m}$ titoli scritti in grassetto senza uno stile di titolo` : ''}. L'indice automatico mostra i titoli fino al livello $${L}$. Quante voci ha l'indice?`,
		steps,
		number: { value: String(value), wrong: wrongs(String(value), [...(hand ? [value + m] : []), a + b + c, a + b, counts[L - 1], a, b + c, a + b + c + m, value + 1]) },
		params: { case: `livello${L}` },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the index after a change

/** A chapter title and the title it is changed into. */
const RENAMES: [string, string][] = [
	['Le eruzioni', 'Come erutta un vulcano'],
	["L'esercito", 'Le legioni di Roma'],
	['I pianeti', 'Gli otto pianeti'],
	['La foglia', 'Come è fatta una foglia'],
	['Il nucleo', 'Il nucleo della cellula'],
	['Gli strumenti', 'Gli strumenti musicali'],
	['Le fonti', 'Le fonti di energia'],
	['La città', 'La città medievale'],
	['Il ciclo', "Il ciclo dell'acqua"],
	['Le regole', 'Le regole del gioco'],
];

function level4(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [A, B] = rng.pick(RENAMES);
	const p = rng.int(3, 12);
	const k = rng.int(1, 4);
	const updated = rng.next() < 0.5;
	const entry = (title: string, page: number, key: string) => opt(`${title}, pagina ${page}`, key);
	const all = [entry(A, p, 'vecchio|vecchia'), entry(B, p + k, 'nuovo|nuova'), entry(B, p, 'nuovo|vecchia'), entry(A, p + k, 'vecchio|nuova')];
	const right = updated ? 1 : 0;
	return {
		prompt: "Scegli che cosa mostra l'indice.",
		problem: `Nell'indice del documento di ${N}, alla voce "${A}" corrisponde la pagina $${p}$. ${N} cambia quel titolo in "${B}" e aggiunge $${k}$ ${k === 1 ? 'pagina' : 'pagine'} prima di quel capitolo. ${updated ? "Poi aggiorna l'indice" : "Non aggiorna l'indice"}. Che cosa si legge ora nell'indice per quel capitolo?`,
		steps: updated
			? [`Con l'aggiornamento il programma rilegge i titoli e ricalcola le pagine.`, `Il capitolo ora comincia $${k}$ ${k === 1 ? 'pagina' : 'pagine'} più avanti: $${p} + ${k} = ${p + k}$. L'indice mostra il titolo nuovo e la pagina $${p + k}$.`]
			: [`L'indice è un campo: resta com'era finché non viene aggiornato.`, `Mostra ancora il titolo vecchio e la pagina $${p}$, anche se nel documento sono cambiati tutti e due.`],
		choice: choose(
			rng,
			all[right],
			all.filter((_, i) => i !== right),
		),
		params: { case: updated ? 'aggiornato' : 'non-aggiornato' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: automatic numbering

const NUMBERED: [string, string][] = [
	['figure', 'Figura'],
	['tabelle', 'Tabella'],
	['note a piè di pagina', 'nota'],
];

function level5(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [plural, one] = rng.pick(NUMBERED);
	const n = rng.int(5, 12);
	const kind = rng.pick(['sale', 'sale', 'resta', 'scende'] as const);
	const insert = kind === 'sale' || (kind === 'resta' && rng.next() < 0.5);
	const j = rng.int(1, 3);
	let x: number;
	let action: string;
	let value: number;
	let steps: string[];
	if (insert) {
		const i = rng.int(kind === 'sale' ? 1 : 2, n - 1);
		x = kind === 'sale' ? rng.int(i + 1, n) : rng.int(1, i);
		value = kind === 'sale' ? x + j : x;
		action = `${N} ne inserisce ${j === 1 ? 'una nuova' : `$${j}$ nuove`} tra la ${one} $${i}$ e la ${one} $${i + 1}$`;
		steps =
			kind === 'sale'
				? [`La ${one} $${x}$ viene dopo il punto di inserimento: davanti a lei ora ${j === 1 ? "ce n'è una in più" : `ce ne sono $${j}$ in più`}.`, `Il suo numero sale di $${j}$: $${x} + ${j} = ${x + j}$.`]
				: [`La ${one} $${x}$ viene prima del punto di inserimento: davanti a lei non è cambiato niente.`, `Resta la ${one} $${x}$.`];
	} else {
		const d = kind === 'scende' ? rng.int(1, n - 1) : rng.int(2, n);
		x = kind === 'scende' ? rng.int(d + 1, n) : rng.int(1, d - 1);
		value = kind === 'scende' ? x - 1 : x;
		action = `${N} elimina la ${one} $${d}$`;
		steps =
			kind === 'scende'
				? [`La ${one} $${x}$ viene dopo quella eliminata: davanti a lei ora ce n'è una in meno.`, `Il suo numero scende di $1$: $${x} - 1 = ${x - 1}$.`]
				: [`La ${one} $${x}$ viene prima di quella eliminata: davanti a lei non è cambiato niente.`, `Resta la ${one} $${x}$.`];
	}
	return {
		prompt: 'Trova il nuovo numero.',
		problem: `Nel documento di ${N} ci sono $${n}$ ${plural} numerate in automatico. ${action}. Che numero ha ora quella che era la ${one} $${x}$?`,
		steps,
		number: { value: String(value), wrong: wrongs(String(value), [x, insert ? x + j : x - 1, x + 1, x - 1, x + j + 1, x + 2, insert ? n + j : n - 1]) },
		params: { case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the cells of a table

const ROWS_FOR = ['per ciascuno dei $R$ compagni', 'per ciascuno dei $R$ libri', 'per ciascuna delle $R$ materie', 'per ciascuno dei $R$ giorni', 'per ciascuna delle $R$ squadre', 'per ciascuno dei $R$ esperimenti'];

function level6(rng: Rng): Built {
	const N = rng.pick(NAMES);
	if (rng.next() < 0.5) {
		const r = rng.int(3, 9);
		const c = rng.int(2, 6);
		const value = (r + 1) * c;
		return {
			prompt: 'Conta le celle della tabella.',
			problem: `${N} prepara una tabella con una riga di intestazione e una riga ${rng.pick(ROWS_FOR).replace('R', String(r))}; le colonne sono $${c}$. Quante celle ha la tabella?`,
			steps: [`Le righe sono $${r} + 1 = ${r + 1}$, perché c'è anche la riga di intestazione.`, `Le celle sono righe per colonne: $${r + 1} \\cdot ${c} = ${value}$.`],
			number: { value: String(value), wrong: wrongs(String(value), [r * c, (r + 1) * (c + 1), r + 1 + c, r * (c + 1), value + 1]) },
			params: { case: 'intestazione' },
		};
	}
	const R = rng.int(3, 8);
	const C = rng.int(3, 6);
	const m = rng.int(2, C);
	const value = R * C - (m - 1);
	return {
		prompt: 'Conta le celle della tabella.',
		problem: `Una tabella di ${N} ha $${R}$ righe e $${C}$ colonne. ${N} unisce in una sola cella $${m}$ celle vicine della prima riga. Quante celle ha ora la tabella?`,
		steps: [`Prima dell'unione le celle sono $${R} \\cdot ${C} = ${R * C}$.`, `Al posto di $${m}$ celle ne resta una: il totale diminuisce di $${m} - 1 = ${m - 1}$.`, `Ora le celle sono $${R * C} - ${m - 1} = ${value}$.`],
		number: { value: String(value), wrong: wrongs(String(value), [R * C - m, R * C, R * C - 1, R * C - m - 1, (R - 1) * C, value + 2]) },
		params: { case: 'unione' },
	};
}

export const infStiliIndici = makeGenerator(
	ID,
	'Stili, titoli, tabelle e indici automatici',
	{
		1: { label: 'Lo stile giusto', constraints: ['un pezzo di una ricerca: Titolo 1, Titolo 2, Titolo 3, Corpo del testo, Didascalia, circa 1 su 5 ciascuno'] },
		2: { label: 'Modificare uno stile', constraints: ['da 3 a 9 Titolo 1, da 4 a 14 Titolo 2, da 1 a 4 titoli fatti a mano', 'cambiano solo i paragrafi con lo stile modificato'] },
		3: { label: "Le voci dell'indice", constraints: ['titoli di tre livelli, indice fino al livello 1, 2 o 3', 'in metà dei casi ci sono titoli senza stile, che non entrano'] },
		4: { label: "L'indice dopo una modifica", constraints: ['titolo e pagina cambiano tutti e due; indice aggiornato o no, metà ciascuno', 'opzioni: le quattro combinazioni di titolo e pagina'] },
		5: { label: 'La numerazione automatica', constraints: ['da 5 a 12 figure, tabelle o note; da 1 a 3 inserite, oppure una eliminata', 'il numero sale, resta o scende'] },
		6: { label: 'Le celle di una tabella', constraints: ['righe per colonne con la riga di intestazione, oppure celle unite nella prima riga, metà ciascuno'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
);

export default infStiliIndici;
