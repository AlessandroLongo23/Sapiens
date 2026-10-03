/**
 * Struttura di un documento elettronico. Spec: specs/exercises/word.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/29-word.md): what a change touches (content, or the
 * formatting of characters, paragraphs, page); the size of the text area from the sheet and its margins; which
 * non-printing character does a job; where a title ends up after pushing it down with empty paragraphs or with a page
 * break; which file format fits a use.
 */
import type { Rng } from '../types';
import { type Built, NAMES, choose, frac, makeGenerator, num, numTex, opt, shuffle, wrongs } from '../inf-documenti';

export const ID = 'word';

const DOCS = ['la relazione di scienze', 'la ricerca di storia', 'il tema di italiano', 'la tesina di geografia', 'il curriculum', 'la relazione di laboratorio', 'il giornalino di classe', 'la lettera al preside'];

// ---------------------------------------------------------------------------
// Level 1: content, or the formatting of characters, paragraphs, page

const TOUCHES = {
	carattere: 'La formattazione dei caratteri',
	paragrafo: 'La formattazione del paragrafo',
	pagina: 'Le impostazioni della pagina',
	contenuto: 'Il contenuto',
} as const;
type Touch = keyof typeof TOUCHES;

const CHANGES: Record<Touch, string[]> = {
	carattere: ['mettere in grassetto una parola', 'scrivere in corsivo il titolo di un libro', 'colorare di rosso una parola', 'portare da 11 a 12 punti le lettere di una frase', 'cambiare il tipo di carattere di una parola', 'sottolineare un nome'],
	paragrafo: ['centrare il titolo', 'giustificare il testo delle conclusioni', "aumentare l'interlinea dell'introduzione", 'rientrare la prima riga di un capoverso', 'aggiungere spazio prima di un titolo', 'allineare a destra la data'],
	pagina: ['allargare i margini', 'girare il foglio in orizzontale', 'passare dal formato A4 al formato A5', 'ridurre il margine superiore', 'stringere il margine sinistro'],
	contenuto: ['correggere una parola scritta male', 'aggiungere una frase alle conclusioni', 'cancellare un periodo ripetuto', 'sostituire una data sbagliata', 'aggiungere una riga alla bibliografia', 'correggere il nome di una città'],
};

const WHY: Record<Touch, string> = {
	carattere: 'Grassetto, corsivo, colore, dimensione e tipo di carattere si scelgono per i singoli caratteri: è formattazione dei caratteri.',
	paragrafo: 'Allineamento, interlinea, rientri e spazi prima e dopo riguardano un paragrafo intero: è formattazione del paragrafo.',
	pagina: 'Formato, orientamento e margini sono impostazioni della pagina.',
	contenuto: 'Dopo la modifica il documento dice una cosa diversa: è cambiato il contenuto, non il suo aspetto.',
};

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const doc = rng.pick(DOCS);
	const touch = rng.pick(Object.keys(TOUCHES) as Touch[]);
	const change = rng.pick(CHANGES[touch]);
	const others = (Object.keys(TOUCHES) as Touch[]).filter((k) => k !== touch);
	return {
		prompt: 'Scegli che cosa cambia nel documento.',
		problem: `${N} sta sistemando ${doc} e decide di ${change}. Che cosa sta cambiando?`,
		steps: [WHY[touch]],
		choice: choose(
			rng,
			opt(TOUCHES[touch], touch),
			others.map((k) => opt(TOUCHES[k], k)),
		),
		params: { case: touch },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the text area

/** Sheet formats, sides in tenths of a centimetre, as they are when the sheet is upright. */
const SHEETS: [string, number, number][] = [
	['A4', 210, 297],
	['A5', 148, 210],
	['A3', 297, 420],
];
const MARGINS = [10, 15, 20, 25, 30, 35];
const cm = (tenths: number) => num(frac(tenths, 10), 'cm');

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [name, w, h] = rng.pick(SHEETS);
	const landscape = rng.next() < 0.5;
	const askWidth = rng.next() < 0.5;
	const [left, right, top, bottom] = [rng.pick(MARGINS), rng.pick(MARGINS), rng.pick(MARGINS), rng.pick(MARGINS)];
	const width = landscape ? h : w;
	const height = landscape ? w : h;
	const side = askWidth ? width : height;
	const otherSide = askWidth ? height : width;
	const [m1, m2] = askWidth ? [left, right] : [top, bottom];
	const [o1, o2] = askWidth ? [top, bottom] : [left, right];
	const value = side - m1 - m2;
	const wrong = wrongs(
		frac(value, 10),
		[otherSide - m1 - m2, side - m1, side - o1 - o2, side + m1 + m2, side - m2, side - 2 * m1, otherSide - o1 - o2].map((x) => frac(x, 10)),
	);
	const what = askWidth ? 'larga' : 'alta';
	const dim = askWidth ? 'larghezza' : 'altezza';
	const names = askWidth ? 'sinistro e destro' : 'superiore e inferiore';
	return {
		prompt: "Calcola la dimensione dell'area del testo.",
		problem: `${N} usa un foglio ${name}, che in verticale è largo ${cm(w)} e alto ${cm(h)}, e lo imposta in ${landscape ? 'orizzontale' : 'verticale'}. I margini sinistro e destro sono di ${cm(left)} e di ${cm(right)}, quelli superiore e inferiore di ${cm(top)} e di ${cm(bottom)}. Quanti centimetri è ${what} l'area del testo?`,
		steps: [
			landscape ? `In orizzontale i lati si scambiano: il foglio è largo ${cm(h)} e alto ${cm(w)}.` : `In verticale il foglio è largo ${cm(w)} e alto ${cm(h)}.`,
			`${askWidth ? 'Dalla larghezza' : "Dall'altezza"} del foglio si tolgono i margini ${names}: $${[side, m1, m2].map((x) => numTex(frac(x, 10))).join(' - ')} = ${numTex(frac(value, 10))}$.`,
			`L'area del testo è ${what} ${cm(value)}.`,
		],
		number: { value: frac(value, 10), wrong, unit: 'cm' },
		params: { case: `${landscape ? 'orizzontale' : 'verticale'}-${dim}` },
	};
}

// ---------------------------------------------------------------------------
// Level 3: non-printing characters

const MARKS = {
	paragrafo: 'Un fine paragrafo',
	riga: "Un'interruzione di riga",
	tabulazione: 'Una tabulazione',
	pagina: "Un'interruzione di pagina",
} as const;
type Mark = keyof typeof MARKS;

const JOBS: Record<Mark, string[]> = {
	paragrafo: ["cominciare un nuovo capoverso dopo l'introduzione", 'chiudere il titolo e passare al testo che lo segue, che avrà un altro allineamento', "chiudere un punto dell'elenco e aprirne un altro"],
	riga: ['andare a capo dentro un indirizzo senza aprire un altro paragrafo', 'spezzare su due righe un titolo lungo, che deve restare un solo paragrafo', 'andare a capo dopo un verso restando nella stessa strofa, che è un solo paragrafo'],
	tabulazione: ['far cominciare nello stesso punto della riga i nomi scritti dopo Autore e dopo Classe', 'allineare in colonna i prezzi di un elenco', 'portare la data sempre alla stessa distanza dal margine sinistro'],
	pagina: ['far cominciare il secondo capitolo su una pagina nuova', 'tenere la bibliografia su una pagina a sé, qualunque cosa si aggiunga prima', "mandare l'indice su una pagina separata dalla copertina"],
};

const MARK_WHY: Record<Mark, string> = {
	paragrafo: 'Il fine paragrafo, che si inserisce con Invio, chiude un paragrafo e ne apre uno nuovo.',
	riga: "L'interruzione di riga manda a capo senza chiudere il paragrafo: le due righe restano un paragrafo solo.",
	tabulazione: 'La tabulazione sposta il testo fino a una posizione fissa della riga: gli spazi non garantiscono lo stesso punto.',
	pagina: "L'interruzione di pagina fa cominciare su una pagina nuova quello che segue, qualunque cosa cambi prima: una fila di Invii no.",
};

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const doc = rng.pick(DOCS);
	const mark = rng.pick(Object.keys(MARKS) as Mark[]);
	const job = rng.pick(JOBS[mark]);
	return {
		prompt: 'Scegli il carattere non stampabile che serve.',
		problem: `${N} scrive ${doc} e vuole ${job}. Che cosa inserisce in quel punto?`,
		steps: [MARK_WHY[mark]],
		choice: choose(
			rng,
			opt(MARKS[mark], mark),
			(Object.keys(MARKS) as Mark[]).filter((k) => k !== mark).map((k) => opt(MARKS[k], k)),
		),
		params: { case: mark },
	};
}

// ---------------------------------------------------------------------------
// Level 4: empty paragraphs or a page break

function level4(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const rows = rng.int(30, 45);
	const added = rng.int(2, 9);
	const first = rng.int(12, rows - added - 3);
	const empty = rows - first;
	const withBreak = rng.next() < 0.4;
	const value = withBreak ? 1 : added + 1;
	const how = withBreak ? "inserisce un'interruzione di pagina dopo il primo capitolo" : `preme Invio $${empty}$ volte dopo il primo capitolo`;
	const steps = withBreak
		? [`L'interruzione di pagina manda il titolo in cima alla pagina successiva, qualunque cosa ci sia prima.`, `Con $${first} + ${added} = ${first + added}$ righe il primo capitolo sta ancora nella pagina 1: il titolo resta sulla riga $1$ della pagina 2.`]
		: [
				`Le $${empty}$ righe vuote restano nel testo. Prima del titolo ci sono $${first} + ${added} + ${empty} = ${first + added + empty}$ righe.`,
				`Le prime $${rows}$ riempiono la pagina 1; le altre $${first + added + empty} - ${rows} = ${added}$, tutte vuote, stanno in cima alla pagina 2.`,
				`Il titolo è sulla riga $${added} + 1 = ${added + 1}$ della pagina 2.`,
			];
	return {
		prompt: 'Trova la riga su cui finisce il titolo.',
		problem: `Ogni pagina del documento di ${N} contiene $${rows}$ righe, e il primo capitolo ne occupa $${first}$. Per far cominciare il secondo capitolo in cima alla pagina 2, ${N} ${how}. Poi aggiunge $${added}$ righe al primo capitolo. Su quale riga della pagina 2 si trova ora il titolo del secondo capitolo?`,
		steps,
		number: { value: String(value), wrong: wrongs(String(value), withBreak ? [added + 1, added, added + 2] : [1, added, added + 2, empty, empty + 1]) },
		params: { case: withBreak ? 'interruzione' : 'invii' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: file formats

const FORMATS = {
	modificabile: 'Un formato modificabile: .odt o .docx',
	pdf: 'Il formato PDF (.pdf)',
	txt: 'Il testo semplice (.txt)',
} as const;
type Format = keyof typeof FORMATS;

const USES: Record<Format, string[]> = {
	modificabile: ['mandare la ricerca a un compagno che deve continuare a scriverla', 'salvare la relazione a metà, per finirla domani', 'passare il tema alla professoressa perché lo corregga scrivendoci dentro', 'lavorare allo stesso documento in tre, a turno'],
	pdf: ['consegnare la versione finale, che deve apparire uguale su ogni computer', 'mandare il documento finito in copisteria per la stampa', 'pubblicare il regolamento sul sito della scuola, senza che qualcuno lo ritocchi per sbaglio', 'allegare il curriculum finito a una domanda'],
	txt: ['salvare solo le parole, senza alcuna formattazione, per incollarle in un altro programma', 'tenere degli appunti senza grassetti né margini, da aprire con qualunque editor di testo', 'conservare soltanto i caratteri del testo, nel file più piccolo possibile'],
};

const PICTURES = ['Una foto dello schermo (.jpg)', "Un'immagine della pagina (.png)"];

const FORMAT_WHY: Record<Format, string> = {
	modificabile: 'Il documento è ancora in lavorazione: serve un formato modificabile, che conserva testo, formattazione e struttura.',
	pdf: 'Il documento è finito: il PDF fissa le pagine, che appaiono uguali su ogni dispositivo, e non è fatto per essere modificato.',
	txt: 'Il testo semplice contiene solo i caratteri: è il contenuto senza la formattazione.',
};

function level5(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const format = rng.pick(Object.keys(FORMATS) as Format[]);
	const use = rng.pick(USES[format]);
	const others = shuffle(
		rng,
		(Object.keys(FORMATS) as Format[]).filter((k) => k !== format),
	).map((k) => opt(FORMATS[k], k));
	return {
		prompt: 'Scegli il formato del file.',
		problem: `${N} deve ${use}. In quale formato salva il file?`,
		steps: [FORMAT_WHY[format], "Un'immagine della pagina non è un documento: il testo non si può più selezionare né correggere."],
		choice: choose(rng, opt(FORMATS[format], format), [...others, opt(rng.pick(PICTURES), 'immagine')]),
		params: { case: format },
	};
}

export const word = makeGenerator(
	ID,
	'Struttura di un documento elettronico',
	{
		1: { label: 'Contenuto o formattazione', constraints: ['una modifica: contenuto, formattazione dei caratteri, del paragrafo, impostazioni della pagina, circa 1 su 4 ciascuna'] },
		2: { label: "L'area del testo", constraints: ['foglio A4, A5 o A3, verticale o orizzontale, quattro margini da 1 a 3,5 cm', "larghezza o altezza dell'area del testo, in centimetri"] },
		3: { label: 'I caratteri non stampabili', constraints: ['un lavoro: fine paragrafo, interruzione di riga, tabulazione, interruzione di pagina, circa 1 su 4 ciascuna'] },
		4: { label: 'Invii o interruzione di pagina', constraints: ['pagine da 30 a 45 righe, da 2 a 9 righe aggiunte, il primo capitolo resta nella pagina 1', 'circa 6 su 10 con gli Invii, 4 su 10 con interruzione di pagina'] },
		5: { label: 'Il formato del file', constraints: ['un uso: formato modificabile, PDF, testo semplice, circa 1 su 3 ciascuno', "la quarta opzione è un'immagine della pagina, mai giusta"] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 },
);

export default word;
