/**
 * Linguaggi, compilatori e interpreti. Spec: specs/exercises/inf-linguaggi-programmazione.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/51-inf-linguaggi-programmazione.md), all multiple
 * choice with text options, made of interchangeable pieces: what is true of machine language and of a high-level
 * language; the word for a thing a student does; which translator a fact tells of; how many lines a program with a
 * misspelled name prints with each translator; true and false statements.
 */
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, statementLevel, type Statement } from '../inf-primi';
import type { Rng } from '../types';

export const ID = 'inf-linguaggi-programmazione';

// ---------------------------------------------------------------------------
// Level 1: machine language, high-level language

const MACHINE: [string, string][] = [
	['m1', 'Ogni istruzione è una sequenza di bit'],
	['m2', "Cambia da una famiglia di CPU all'altra"],
	['m3', 'La CPU lo esegue direttamente, senza traduzione'],
	['m4', 'Per sommare due prezzi servono tre o quattro istruzioni'],
	['m5', 'Chi lo scrive deve sapere in quale cella di memoria sta ogni dato'],
	['m6', 'Un programma scritto così per un portatile va riscritto da capo per un telefono'],
	['m7', 'È fatto delle poche istruzioni elementari che la CPU sa eseguire'],
	['m8', "Un solo bit sbagliato cambia un'istruzione in un'altra"]
];
const HIGH: [string, string][] = [
	['h1', "Usa parole prese dall'inglese, come print e while"],
	['h2', 'Un conto si scrive in una riga, con i segni della matematica'],
	['h3', "Non chiede di sapere com'è fatta la CPU"],
	['h4', 'Per essere eseguito ha bisogno di un traduttore'],
	['h5', 'Il testo di un programma scritto così si chiama codice sorgente'],
	['h6', 'È pensato per chi scrive e non per la macchina'],
	['h7', 'I dati hanno nomi scelti da chi scrive il programma'],
	['h8', 'Una riga di programma si legge quasi come una frase']
];

function level1(rng: Rng): Built {
	const machine = rng.next() < 0.5;
	const [rights, wrongs] = machine ? [MACHINE, HIGH] : [HIGH, MACHINE];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const o = ([id, text]: [string, string]) => textOption(text, id);
	return {
		prompt: 'Distingui il linguaggio della macchina dai linguaggi ad alto livello.',
		problem: machine ? 'Quale di queste frasi descrive il linguaggio macchina?' : 'Quale di queste frasi descrive un linguaggio ad alto livello?',
		solution: right[1],
		steps: machine
			? ['Il linguaggio macchina è fatto delle istruzioni elementari di una CPU, scritte in bit: è di basso livello, perché ricalca quello che la macchina sa fare.', 'Le altre tre frasi descrivono un linguaggio ad alto livello, pensato per chi scrive.']
			: ['Un linguaggio ad alto livello è pensato per chi scrive: usa parole, segni della matematica e nomi scelti da te, e va tradotto per la CPU.', 'Le altre tre frasi descrivono il linguaggio macchina, fatto di bit e diverso per ogni famiglia di CPU.'],
		answer: choose(rng, o(right), others.map(o)),
		params: { case: machine ? 'macchina' : 'alto livello', ids: [right[0], ...others.map((x) => x[0])] }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the word for a thing

export const TERMS = {
	sorgente: 'Il codice sorgente',
	compilatore: 'Il compilatore',
	interprete: "L'interprete",
	eseguibile: 'Il programma eseguibile',
	macchina: 'Il linguaggio macchina',
	sintassi: 'La sintassi'
} as const;
type Term = keyof typeof TERMS;

const TERM_WHY: Record<Term, string> = {
	sorgente: 'Il testo di un programma scritto in un linguaggio ad alto livello è il codice sorgente: un file di testo, che si apre, si legge e si corregge.',
	compilatore: 'Il compilatore legge tutto il sorgente e lo traduce in linguaggio macchina una volta per tutte: ne esce un programma eseguibile.',
	interprete: "L'interprete legge il sorgente un'istruzione alla volta: la traduce, la fa eseguire e passa alla successiva, senza produrre nessun file.",
	eseguibile: 'Il programma eseguibile è il risultato della compilazione: un file in linguaggio macchina, che la CPU esegue senza il sorgente e senza il compilatore.',
	macchina: "Il linguaggio macchina è l'insieme delle istruzioni elementari che una CPU sa eseguire, scritte in bit.",
	sintassi: 'La sintassi è l\'insieme delle regole di scrittura di un linguaggio: sono rigide, e un testo che non le rispetta non viene tradotto.'
};

/** The programs a student works on: with the article, and after "di". */
const THINGS: [string, string][] = [
	['il suo gioco', 'del suo gioco'],
	['la sua calcolatrice', 'della sua calcolatrice'],
	['il suo quiz', 'del suo quiz'],
	['il suo programma per i voti', 'del suo programma per i voti'],
	['la sua agenda', 'della sua agenda'],
	['il suo convertitore di valute', 'del suo convertitore di valute'],
	['il suo cronometro', 'del suo cronometro'],
	['la sua rubrica', 'della sua rubrica']
];

const SITUATIONS: [Term, (N: string, il: string, del: string) => string][] = [
	['sorgente', (N, il) => `${N} scrive ${il} in un file di testo, con parole come print e while. Come si chiama quello che ha scritto?`],
	['sorgente', (N, _il, del) => `${N} apre il file con le istruzioni ${del}, le rilegge e ne corregge una. Come si chiama quel testo?`],
	['sorgente', (N, _il, del) => `Un traduttore riceve il testo ${del}, che ${N} ha scritto in un linguaggio ad alto livello. Come si chiama quel testo?`],
	['compilatore', (N, _il, del) => `${N} usa un programma che legge tutto il testo ${del} e ne ricava un file che la CPU esegue direttamente. Che programma è?`],
	['compilatore', (N, il) => `Prima che ${N} possa avviare ${il}, un programma lo traduce tutto in linguaggio macchina, una volta sola. Che programma è?`],
	['compilatore', (N, _il, del) => `Un programma controlla tutto il testo ${del} scritto da ${N}: trova un errore nell'ultima riga e non produce nessun file. Che programma è?`],
	['interprete', (N, _il, del) => `${N} usa un programma che legge il testo ${del} un'istruzione alla volta: la traduce, la fa eseguire e passa alla successiva. Che programma è?`],
	['interprete', (N, il) => `Ogni volta che ${N} avvia ${il}, un programma rifà la traduzione mentre lo esegue e non lascia nessun file. Che programma è?`],
	['interprete', (N, _il, del) => `Un programma esegue le prime righe ${del} scritto da ${N} e si ferma solo quando arriva a una riga con un nome scritto male. Che programma è?`],
	['eseguibile', (N, _il, del) => `Dalla traduzione ${del} ${N} ottiene un file che la CPU esegue senza più bisogno del testo di partenza. Che cos'è quel file?`],
	['eseguibile', (N, il) => `${N} dà a un'amica ${il} già tradotto in linguaggio macchina: lei lo avvia senza avere il testo scritto da ${N} e senza traduttori. Che cosa ha ricevuto?`],
	['eseguibile', (N, il) => `${N} compila ${il} e sul disco compare un file nuovo, fatto solo di istruzioni per la CPU. Che cos'è quel file?`],
	['macchina', (N, il) => `Quando ${N} avvia ${il}, la CPU esegue istruzioni elementari fatte solo di bit. Come si chiama l'insieme delle istruzioni che una CPU sa eseguire?`],
	['macchina', (N, il) => `Un traduttore trasforma ${il} di ${N} nelle sole istruzioni che la CPU capisce, diverse per ogni famiglia di CPU. Come si chiama l'insieme di quelle istruzioni?`],
	['sintassi', (N, _il, del) => `Nel testo ${del} ${N} dimentica una parentesi, e il traduttore non va avanti: il testo non rispetta le regole di scrittura del linguaggio. Come si chiamano quelle regole?`],
	['sintassi', (N, il) => `Per scrivere ${il} ${N} deve mettere parentesi, virgolette e due punti dove il linguaggio li vuole, senza eccezioni. Come si chiama l'insieme di queste regole?`]
];

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const s = rng.int(0, SITUATIONS.length - 1);
	const thing = rng.int(0, THINGS.length - 1);
	const [term, text] = SITUATIONS[s];
	const others = shuffle(
		rng,
		(Object.keys(TERMS) as Term[]).filter((t) => t !== term)
	);
	return {
		prompt: 'Usa la parola giusta.',
		problem: text(N, THINGS[thing][0], THINGS[thing][1]),
		solution: TERMS[term],
		steps: [TERM_WHY[term]],
		answer: choose(
			rng,
			textOption(TERMS[term], term),
			others.map((t) => textOption(TERMS[t], t))
		),
		params: { case: term, situation: s, thing, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 3: which translator

export const TRANSLATORS = {
	compilatore: 'Un compilatore',
	interprete: 'Un interprete',
	entrambi: 'Non si può dire: vale per tutti e due',
	nessuno: 'Nessun traduttore: la CPU esegue il sorgente da sola'
} as const;
type Translator = keyof typeof TRANSLATORS;

const FACTS: [Exclude<Translator, 'nessuno'>, string, string][] = [
	['compilatore', 'Il traduttore legge tutto il sorgente prima che il programma parta.', 'Leggere tutto il sorgente prima di cominciare è il lavoro del compilatore.'],
	['compilatore', 'Dalla traduzione esce un file eseguibile, che resta sul disco.', 'Solo il compilatore produce un programma eseguibile da conservare.'],
	['compilatore', "Un nome scritto male nell'ultima riga impedisce al programma di partire.", "Il compilatore controlla tutto il sorgente prima di tradurre: con un errore, anche nell'ultima riga, non produce l'eseguibile."],
	['compilatore', 'Chi riceve il programma tradotto lo esegue senza avere il sorgente e senza il traduttore.', "L'eseguibile prodotto dal compilatore si esegue da solo, senza sorgente e senza compilatore."],
	['compilatore', 'La traduzione si fa una volta sola, e poi il programma si esegue quante volte si vuole.', 'Il compilatore traduce una volta per tutte: a ogni esecuzione si usa la traduzione già fatta.'],
	['compilatore', "Per un errore di scrittura in fondo al sorgente non viene eseguita nemmeno la prima istruzione.", "Il compilatore non produce l'eseguibile se il sorgente ha un errore: il programma non parte nemmeno."],
	['interprete', "Il traduttore legge un'istruzione, la traduce, la fa eseguire e passa alla successiva.", "Tradurre ed eseguire un'istruzione alla volta è il lavoro dell'interprete."],
	['interprete', "Finita l'esecuzione non resta nessun file tradotto: c'è solo il sorgente.", "L'interprete non produce nessun file da conservare."],
	['interprete', "Un nome scritto male nell'ultima riga viene scoperto solo quando l'esecuzione arriva lì.", "L'interprete traduce mentre esegue: si accorge di un nome scritto male solo quando arriva a quella riga."],
	['interprete', 'La traduzione si rifà a ogni esecuzione.', "Con l'interprete la traduzione avviene durante l'esecuzione, ogni volta."],
	['interprete', 'Per eseguire il programma su un altro computer servono il sorgente e il traduttore.', "Con l'interprete non c'è un eseguibile: servono il sorgente e un interprete per quel computer."],
	['interprete', "Le prime istruzioni vengono eseguite anche se più avanti nel sorgente c'è un nome scritto male.", "L'interprete esegue le istruzioni una alla volta e si ferma alla prima che non capisce: quelle prima sono già state eseguite."],
	['entrambi', 'Il traduttore è a sua volta un programma.', 'Compilatore e interprete sono tutti e due programmi.'],
	['entrambi', 'Alla fine la CPU esegue istruzioni in linguaggio macchina.', 'La CPU esegue solo linguaggio macchina, con un traduttore o con l\'altro: cambia quando avviene la traduzione.'],
	['entrambi', 'Il sorgente è scritto in un linguaggio ad alto livello, che la CPU non capisce.', 'Nessun linguaggio ad alto livello è capito dalla CPU: serve un traduttore, compilatore o interprete che sia.'],
	['entrambi', 'Il sorgente è un file di testo, che si può aprire e correggere.', 'Il sorgente è un file di testo in tutti e due i casi: cambia chi lo traduce, e quando.'],
	['entrambi', 'Se il sorgente non rispetta le regole del linguaggio, il traduttore lo segnala con un messaggio.', 'Compilatore e interprete segnalano tutti e due un sorgente scritto male: cambia il momento in cui se ne accorgono.']
];

function level3(rng: Rng): Built {
	const r = rng.next();
	const kind = r < 0.4 ? 'compilatore' : r < 0.8 ? 'interprete' : 'entrambi';
	const pool = FACTS.map((f, i) => [f, i] as const).filter(([f]) => f[0] === kind);
	const [[, fact, why], index] = rng.pick(pool);
	const N = rng.pick(NAMES);
	const thing = rng.int(0, THINGS.length - 1);
	const o = (t: Translator) => textOption(TRANSLATORS[t], t);
	return {
		prompt: 'Riconosci il traduttore da quello che fa.',
		problem: `${N} lavora al testo ${THINGS[thing][1]}. ${fact} Quale traduttore sta usando?`,
		solution: TRANSLATORS[kind],
		steps: [why, 'In nessun caso la CPU esegue il sorgente da sola: tra il sorgente e la CPU serve sempre un traduttore.'],
		answer: choose(
			rng,
			o(kind),
			(Object.keys(TRANSLATORS) as Translator[]).filter((t) => t !== kind).map(o)
		),
		params: { case: kind, fact: index, thing, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 4: a misspelled name, and how many lines come out

const LANGUAGES: [string, 'interprete' | 'compilatore'][] = [
	['in Python', 'interprete'],
	['in un linguaggio interpretato', 'interprete'],
	['in C++', 'compilatore'],
	['in un linguaggio compilato', 'compilatore']
];

const rows = (k: number) => (k === 0 ? 'Nessuna riga' : k === 1 ? '1 riga' : `${k} righe`);

function level4(rng: Rng): Built {
	const [language, kind] = rng.pick(LANGUAGES);
	const n = rng.int(4, 9);
	const k = rng.int(2, n);
	const N = rng.pick(NAMES);
	const right = kind === 'interprete' ? k - 1 : 0;
	const others = kind === 'interprete' ? [0, k, n, n - 1, k - 2, k + 1, 1, 2] : [k - 1, k, n, n - 1, 1, 2];
	const o = (x: number) => textOption(rows(x), String(x));
	return {
		prompt: 'Pensa a come lavora il traduttore.',
		problem: `${N} scrive ${language} un programma di ${n} istruzioni, ognuna delle quali stampa una riga. Nell'istruzione numero ${k} il nome del comando che stampa è scritto male. Quante righe vengono stampate prima del messaggio di errore?`,
		solution: rows(right),
		steps:
			kind === 'interprete'
				? [`Un interprete traduce ed esegue un'istruzione alla volta: le prime ${k - 1} sono scritte bene e stampano la loro riga.`, `All'istruzione numero ${k} trova un nome che non conosce e si ferma: quelle dopo non vengono eseguite.`]
				: ['Un compilatore legge tutto il sorgente prima di cominciare.', `Trova il nome scritto male nell'istruzione numero ${k} e non produce l'eseguibile: il programma non parte, e non esce nessuna riga.`],
		answer: choose(
			rng,
			o(right),
			others.filter((x) => x >= 0 && x <= n).map(o)
		),
		params: { case: kind, language, n, k, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 5: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Un compilatore è a sua volta un programma', why: 'Compilatore e interprete sono programmi: traducono il sorgente per la CPU.' },
	{ id: 't2', text: 'Dopo aver corretto il sorgente di un programma compilato bisogna compilare di nuovo', why: "L'eseguibile è la traduzione del testo di prima e non cambia da solo: dopo una correzione si compila di nuovo." },
	{ id: 't3', text: 'Su un computer senza interprete, un file di Python resta un file di testo', why: 'Senza un interprete installato nessuno traduce il sorgente: il file resta un testo.' },
	{ id: 't4', text: 'Un eseguibile fatto per un tipo di computer non parte su un computer di un altro tipo', why: "L'eseguibile è in linguaggio macchina, che cambia da una famiglia di CPU all'altra: serve una versione per ogni tipo di computer." },
	{ id: 't5', text: 'Con un interprete si prova in fretta: si scrivono due righe e si eseguono subito', why: "Con l'interprete non c'è una traduzione da rifare prima di eseguire: si scrive, si esegue e si guarda che cosa succede." },
	{ id: 't6', text: 'Un programma compilato è di solito più veloce dello stesso programma interpretato', why: 'Con il compilatore la traduzione è già fatta quando il programma parte: di solito gira più veloce.' },
	{ id: 't7', text: 'Chi riceve un eseguibile lo può usare senza avere il sorgente', why: "L'eseguibile si esegue da solo: non servono né il sorgente né il compilatore." },
	{ id: 't8', text: 'Ogni famiglia di CPU ha il suo linguaggio macchina', why: "Il linguaggio macchina di un portatile non è quello di un telefono: ogni famiglia di CPU ha il suo." },
	{ id: 't9', text: 'Un linguaggio ad alto livello ha regole di scrittura rigide', why: 'Ogni linguaggio ha la sua sintassi, e sono regole rigide: una virgola fuori posto basta a fermare il traduttore.' },
	{ id: 't10', text: 'Alcuni linguaggi vengono prima tradotti in una forma intermedia, che poi viene interpretata', why: 'Molti linguaggi stanno a metà: il sorgente diventa una forma intermedia, che poi viene interpretata.' },
	{ id: 't11', text: 'Le stesse idee, come la variabile e il ciclo, si ritrovano in linguaggi diversi', why: 'Tra un linguaggio e un altro cambia il modo di scrivere, non le idee: la variabile, la scelta e il ciclo sono le stesse.' },
	{ id: 't12', text: 'Con un interprete la traduzione si rifà a ogni esecuzione', why: "L'interprete non conserva la traduzione: la rifà ogni volta che il programma viene eseguito." }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'La CPU capisce direttamente il codice sorgente', why: 'La CPU esegue solo il suo linguaggio macchina: il sorgente va tradotto.' },
	{ id: 'f2', text: "Dopo aver corretto il sorgente, l'eseguibile compilato prima si aggiorna da solo", why: "L'eseguibile di prima è la traduzione del testo di prima: per aggiornarlo bisogna compilare di nuovo." },
	{ id: 'f3', text: 'Un interprete produce un file eseguibile da conservare', why: "L'interprete non produce nessun file: traduce mentre esegue, e alla fine resta solo il sorgente." },
	{ id: 'f4', text: 'Un compilatore traduce il sorgente una riga alla volta, mentre il programma gira', why: "Il compilatore traduce tutto il sorgente prima dell'esecuzione; tradurre mentre si esegue è il lavoro dell'interprete." },
	{ id: 'f5', text: 'Lo stesso eseguibile funziona su qualunque tipo di computer', why: "Un eseguibile è fatto per un tipo di computer: su un altro tipo non parte." },
	{ id: 'f6', text: 'Per usare un programma compilato serve sempre anche il suo sorgente', why: "L'eseguibile si esegue senza il sorgente e senza il compilatore." },
	{ id: 'f7', text: 'Il linguaggio macchina è lo stesso per tutte le CPU', why: 'Ogni famiglia di CPU ha il suo linguaggio macchina.' },
	{ id: 'f8', text: 'Un linguaggio ad alto livello è pensato per la macchina e non per chi scrive', why: 'È il contrario: un linguaggio ad alto livello è pensato per chi scrive, e per questo va tradotto.' },
	{ id: 'f9', text: 'Un programma interpretato è di solito più veloce dello stesso programma compilato', why: "Con l'interprete si traduce mentre si esegue: di solito il programma è più lento di quello compilato." },
	{ id: 'f10', text: "Con un compilatore, un nome scritto male nell'ultima riga viene scoperto solo quando l'esecuzione arriva lì", why: 'Il compilatore controlla tutto il sorgente prima di tradurre: il nome scritto male viene segnalato prima di partire.' },
	{ id: 'f11', text: 'Un file di Python si esegue anche su un computer senza interprete', why: 'Senza interprete un file di Python resta un file di testo.' },
	{ id: 'f12', text: "Compilatore e interprete sono componenti dell'hardware", why: 'Compilatore e interprete sono programmi, cioè software.' }
];

export default makeGenerator(ID, 'Linguaggi, compilatori e interpreti', {
	1: { label: 'Linguaggio macchina e alto livello', constraints: ['one sentence about machine language among three about a high-level language, or the reverse, about half each'], build: level1 },
	2: { label: 'Le parole della traduzione', constraints: ['a situation with a name and a program: the word among sorgente, compilatore, interprete, eseguibile, linguaggio macchina, sintassi'], build: level2 },
	3: { label: 'Compilatore o interprete', constraints: ['a fact about the translator: compiler (about 4 in 10), interpreter (4 in 10) or both (2 in 10)'], build: level3 },
	4: { label: 'Un nome scritto male', constraints: ['a program of 4 to 9 printing instructions with a misspelled name at instruction k >= 2', 'k - 1 lines with an interpreter, none with a compiler'], build: level4 },
	5: { label: 'Vero o falso sui traduttori', constraints: ['the true statement among three false ones, or the false one among three true, about half each'], build: (rng) => statementLevel(rng, TRUE, FALSE, 'su linguaggi e traduttori') }
});
