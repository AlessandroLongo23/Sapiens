/**
 * Errori e debug. Spec: specs/exercises/inf-errori-debug.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/55-inf-errori-debug.md).
 *
 * 1. the kind of an error from what happens (syntax, at run time, logical, or no error at all); 2. reading an error
 * message: what happened, or which line it points to; 3. a program with a logical mistake, and four programs of which
 * one corrects it; 4. the same with flowcharts; 5. correct the flowchart, starting from the wrong one; 6. correct the
 * program, starting from the wrong one.
 *
 * The programs of levels 3 to 6 are written once in the language of the flowcharts (v2/inf-programmi.ts). Most are
 * sequences; as in the lesson, a mistake can also sit in the condition of a selection or of a simple loop.
 */
import { chartAnswer, chartOption, choose, codeOption, codes, lines, makeGenerator, output, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, exposing, fixAnswer, mistakes, said, sound, type Inputs } from '../inf-primi';
import type { Rng } from '../types';

export const ID = 'inf-errori-debug';

// ---------------------------------------------------------------------------
// Level 1: the kind of an error

export const KINDS = { sintassi: 'Un errore di sintassi', esecuzione: 'Un errore in esecuzione', logico: 'Un errore logico', nessuno: 'Nessuno dei tre: non è un errore' } as const;
type Kind = keyof typeof KINDS;

const KIND_WHY: Record<Kind, string> = {
	sintassi: 'Il testo del programma non rispetta le regole di scrittura del linguaggio: il traduttore non lo esegue, e il programma non parte nemmeno. È un errore di sintassi.',
	esecuzione: "Il programma è scritto secondo le regole e parte, ma a un certo punto incontra un'operazione impossibile e si ferma lì: è un errore in esecuzione, e dipende dai dati.",
	logico: 'Il programma parte e arriva in fondo senza messaggi, ma il risultato non è quello giusto: è un errore logico, e nessuno lo segnala.',
	nessuno: 'Il programma parte, arriva in fondo e dà il risultato giusto: non c\'è nessun errore da correggere.'
};

/** A situation: N is the student, r draws its numbers. The numbers go in the text. */
const HAPPENINGS: [Kind, (N: string, r: Rng) => string][] = [
	['sintassi', (N, r) => `${N} dimentica di chiudere una parentesi nella riga ${r.int(2, 9)}. Il programma non parte, e compare un messaggio che indica quella riga.`],
	['sintassi', (N) => `${N} dimentica il punto e virgola in fondo a un'istruzione in C++. Il compilatore lo segnala con un messaggio e non produce l'eseguibile.`],
	['sintassi', (N, r) => `${N} apre le virgolette di un testo nella riga ${r.int(2, 9)} e non le chiude. Non viene eseguita nemmeno la prima istruzione.`],
	['sintassi', (N, r) => `Nel programma Python di ${N} la riga ${r.int(2, 9)} comincia con degli spazi che non dovrebbe avere. Il programma non parte.`],
	['sintassi', (N) => `${N} dimentica di chiudere una parentesi graffa in C++. Il compilatore lo segnala con un messaggio e il programma non parte.`],
	['esecuzione', (N, r) => `Il programma di ${N} divide una spesa di ${r.int(3, 12) * 10} euro tra più persone. Con ${r.int(2, 6)} persone funziona; con 0 persone parte, e poi si blocca a metà con un messaggio.`],
	['esecuzione', (N, r) => `Il programma Python di ${N} parte e chiede un numero intero. ${N} risponde con la parola "${r.pick(['quattro', 'dieci', 'sette', 'venti'])}", e il programma si blocca con un messaggio.`],
	['esecuzione', (N, r) => `Il programma di ${N} parte, stampa le prime ${r.int(2, 6)} righe e poi si blocca con il messaggio "division by zero".`],
	['esecuzione', (N, r) => `Il programma di ${N} è scritto secondo le regole, e con quasi tutti i dati arriva in fondo. Quando il divisore letto è 0 si blocca alla riga ${r.int(3, 9)} con un messaggio.`],
	[
		'logico',
		(N, r) => {
			const a = r.int(4, 9);
			const b = 2 * r.int(2, 5);
			return `Il programma di ${N} deve calcolare la media di ${a} e ${b}. Parte, arriva in fondo senza messaggi e scrive ${a + b / 2}.`;
		}
	],
	[
		'logico',
		(N, r) => {
			const p = r.int(4, 9) * 10;
			const s = r.int(1, 3) * 5;
			return `Il programma di ${N} deve scrivere il prezzo di un oggetto da ${p} euro con uno sconto di ${s} euro. Parte, arriva in fondo senza messaggi e scrive ${p + s}.`;
		}
	],
	[
		'logico',
		(N, r) => {
			const n = r.int(4, 8);
			return `Il programma di ${N} deve sommare i numeri da 1 a ${n}. Parte, arriva in fondo senza messaggi e scrive ${((n - 1) * n) / 2}, non ${(n * (n + 1)) / 2}.`;
		}
	],
	[
		'logico',
		(N, r) => {
			const a = r.int(4, 9);
			const b = r.int(2, 3);
			return `Il programma di ${N} deve scrivere il perimetro di un rettangolo di base ${a} e altezza ${b}. Parte, arriva in fondo senza messaggi e scrive ${2 * a + b}.`;
		}
	],
	[
		'logico',
		(N, r) => {
			const q = r.int(2, 5);
			// a remainder from 1 to 5 that is never the quotient
			const u = 6 * q + ((q + r.int(0, 3)) % 5) + 1;
			return `Il programma di ${N} deve scrivere quante scatole da 6 si riempiono con ${u} uova. Parte, arriva in fondo senza messaggi e scrive ${u % 6}, non ${Math.floor(u / 6)}.`;
		}
	],
	[
		'nessuno',
		(N, r) => {
			const a = r.int(4, 9);
			const b = r.int(2, 9);
			return `Il programma di ${N} deve scrivere il perimetro di un rettangolo di base ${a} e altezza ${b}. Parte, arriva in fondo e scrive ${2 * (a + b)}, proprio il risultato che ${N} aveva calcolato a mano.`;
		}
	],
	['nessuno', (N) => `Il compilatore C++ avvisa ${N} che una variabile non è mai usata (warning: unused variable). Il programma parte lo stesso, arriva in fondo e scrive il risultato giusto.`],
	['nessuno', (N, r) => `${N} mette il segno del commento davanti alla stampa di controllo della riga ${r.int(3, 9)}. Il programma parte, salta quella riga, arriva in fondo e scrive il risultato giusto.`]
];

function level1(rng: Rng): Built {
	const r = rng.next();
	const kind: Kind = r < 0.3 ? 'sintassi' : r < 0.55 ? 'esecuzione' : r < 0.85 ? 'logico' : 'nessuno';
	const pool = HAPPENINGS.map((h, i) => [h, i] as const).filter(([h]) => h[0] === kind);
	const [[, text], index] = rng.pick(pool);
	const N = rng.pick(NAMES);
	const situation = text(N, rng);
	const o = (k: Kind) => textOption(KINDS[k], k);
	return {
		prompt: 'Riconosci il tipo di errore da quando si scopre.',
		problem: `${situation} Che tipo di errore è?`,
		solution: KINDS[kind],
		steps: [KIND_WHY[kind], 'Per distinguere i tre tipi chiediti quando si scopre: prima che il programma parta, mentre gira, oppure solo guardando il risultato.'],
		answer: choose(
			rng,
			o(kind),
			(Object.keys(KINDS) as Kind[]).filter((k) => k !== kind).map(o)
		),
		params: { case: kind, situation: index, name: N, text: situation }
	};
}

// ---------------------------------------------------------------------------
// Level 2: reading an error message

export const MEANINGS = {
	parentesi: 'Una parentesi tonda aperta non è stata chiusa',
	virgolette: 'Le virgolette di un testo non sono state chiuse',
	rientro: 'Una riga comincia con degli spazi che non dovrebbe avere',
	nome: 'Un nome è scritto male, oppure la variabile non esiste ancora',
	zero: 'Il programma ha provato a dividere per zero',
	conversione: 'Un testo letto dalla tastiera non si può trasformare in un numero',
	puntoevirgola: 'Manca un punto e virgola',
	graffa: 'Una parentesi graffa aperta non è stata chiusa'
} as const;
type Meaning = keyof typeof MEANINGS;

const MISSPELT = ['prezo', 'totle', 'punteggo', 'nmoe', 'risulato', 'sconot', 'altezaz', 'meida'];
const TYPED = ['quattro', 'dieci', 'sette', 'ciao', 'tre'];

/** The messages of the lesson: the language, the message (x is a name, w a word typed), what it means, and how to read it. */
const MESSAGES: ['Python' | 'C++', (x: string, w: string) => string, Meaning, string][] = [
	['Python', () => "SyntaxError: '(' was never closed", 'parentesi', 'Il messaggio dice che la parentesi aperta non è mai stata chiusa ("was never closed").'],
	['Python', () => 'SyntaxError: unterminated string literal', 'virgolette', 'Una "string" è un testo: "unterminated" vuol dire che non è stato terminato, cioè che mancano le virgolette di chiusura.'],
	['Python', () => 'IndentationError: unexpected indent', 'rientro', '"Unexpected indent" è un rientro inatteso: la riga comincia con degli spazi che lì non ci vogliono.'],
	['Python', (x) => `NameError: name '${x}' is not defined`, 'nome', 'Il computer ha trovato un nome che non conosce ("is not defined"): è scritto male, oppure la variabile non ha ancora ricevuto un valore.'],
	['Python', () => 'ZeroDivisionError: division by zero', 'zero', '"Division by zero" è la divisione per zero: il programma è partito e si è fermato su un\'operazione impossibile.'],
	['Python', (_x, w) => `ValueError: invalid literal for int() with base 10: '${w}'`, 'conversione', 'Il programma ha chiesto a int() di trasformare in un numero intero un testo che non è fatto di cifre.'],
	['C++', () => "error: expected ';' at end of declaration", 'puntoevirgola', '"Expected" vuol dire "mi aspettavo": il compilatore si aspettava un punto e virgola in fondo all\'istruzione.'],
	['C++', (x) => `error: use of undeclared identifier '${x}'`, 'nome', 'Un "undeclared identifier" è un nome non dichiarato: è scritto male, oppure la variabile non è stata dichiarata.'],
	['C++', () => "error: expected '}'", 'graffa', '"Expected" vuol dire "mi aspettavo": il compilatore si aspettava la parentesi graffa che chiude.']
];

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const m = rng.int(0, MESSAGES.length - 1);
	const [language, text, meaning, why] = MESSAGES[m];
	const message = text(rng.pick(MISSPELT), rng.pick(TYPED));
	if (rng.next() < 0.6) {
		const others = shuffle(
			rng,
			(Object.keys(MEANINGS) as Meaning[]).filter((k) => k !== meaning)
		);
		return {
			prompt: 'Leggi il messaggio di errore.',
			problem: `${N} esegue un programma in ${language} e legge questo messaggio: «${message}». Che cosa è successo?`,
			solution: MEANINGS[meaning],
			steps: [why, 'In un messaggio di errore si cercano tre cose: la riga, il punto esatto e la descrizione di che cosa è successo.'],
			answer: choose(
				rng,
				textOption(MEANINGS[meaning], meaning),
				others.map((k) => textOption(MEANINGS[k], k))
			),
			params: { case: 'significato', message: m, name: N, text: message }
		};
	}
	const row = rng.int(3, 12);
	const column = rng.int(13, 40);
	const o = (k: number) => textOption(`Nella riga ${k}`, String(k));
	if (language === 'Python')
		return {
			prompt: 'Leggi il messaggio di errore.',
			problem: `${N} esegue un programma in Python e legge un messaggio che comincia con «File "programma.py", line ${row}» e finisce con «${message}». In quale riga del programma il computer si è accorto dell'errore?`,
			solution: `Nella riga ${row}`,
			steps: [`In Python il numero della riga è scritto dopo la parola "line": qui è ${row}.`, "È la riga in cui il computer se ne accorge: se ti sembra giusta, guarda le righe che la precedono."],
			answer: choose(rng, o(row), [row - 1, row + 1, 1, 10, row + 2].map(o)),
			params: { case: 'riga', message: m, name: N, row, text: message }
		};
	return {
		prompt: 'Leggi il messaggio di errore.',
		problem: `${N} compila un programma in C++ e legge questo messaggio: «programma.cpp:${row}:${column}: ${message}». In quale riga del programma il compilatore si è accorto dell'errore?`,
		solution: `Nella riga ${row}`,
		steps: [`In C++ dopo il nome del file ci sono due numeri: il primo è la riga, il secondo il carattere dentro la riga. Qui la riga è ${row} e il carattere è ${column}.`, "È la riga in cui il compilatore se ne accorge: se ti sembra giusta, guarda le righe che la precedono."],
		answer: choose(rng, o(row), [column, row + column, row - 1, row + 1, 1].map(o)),
		params: { case: 'riga', message: m, name: N, row, column, text: message }
	};
}

// ---------------------------------------------------------------------------
// Levels 3 to 6: a program with a logical mistake

interface Fix {
	family: 'sconto' | 'scatole' | 'perimetro' | 'resto' | 'scambio' | 'somma' | 'soglia';
	/** What the program should do, after "dovrebbe". */
	should: string;
	right: string;
	/** The program with the mistake, and what the mistake is. */
	bug: string;
	why: string;
	/** Other corrections a student tries, each wrong in its own way. */
	wrong: string[];
	tests: Inputs[];
}

/** One of the mistakes of a family is the one shown; the others join the wrong corrections. */
function fix(rng: Rng, family: Fix['family'], should: string, right: string, bugs: [string, string][], wrong: string[], tests: Inputs[]): Fix {
	const i = rng.int(0, bugs.length - 1);
	const [bug, why] = bugs[i];
	return { family, should, right, bug, why, wrong: [...wrong, ...bugs.filter((_, j) => j !== i).map((b) => b[0])], tests: exposing(right, bug, tests) };
}

function discount(rng: Rng): Fix {
	const reads = ['leggi prezzo', 'leggi sconto'];
	const make = (saving: string, final: string, write = 'scrivi finale') => lines(...reads, `risparmio = ${saving}`, `finale = ${final}`, write);
	const good = 'prezzo * sconto // 100';
	const pairs: number[][] = [
		[80, 25],
		[60, 50],
		[40, 20],
		[120, 30],
		[200, 15],
		[50, 10],
		[90, 40]
	];
	return fix(
		rng,
		'sconto',
		'leggere un prezzo in euro e uno sconto in percentuale, e scrivere il prezzo scontato',
		make(good, 'prezzo - risparmio'),
		[
			[make(good, 'prezzo - sconto'), 'La riga di finale sottrae la percentuale, non gli euro risparmiati: deve togliere risparmio.'],
			[make('prezzo // 100 * sconto', 'prezzo - risparmio'), 'La divisione intera per 100 è fatta prima della moltiplicazione e butta via le cifre che servono: prima si moltiplica, poi si divide.']
		],
		[make(good, 'prezzo + risparmio'), make(good, 'prezzo - risparmio', 'scrivi risparmio'), make('prezzo * 100 // sconto', 'prezzo - risparmio'), make(good, 'sconto - risparmio'), make('prezzo * sconto', 'prezzo - risparmio')],
		shuffle(rng, pairs).slice(0, 2)
	);
}

function boxes(rng: Rng): Fix {
	const [total, k, what] = rng.pick([
		['uova', 6, 'uova'],
		['pastelli', 12, 'pastelli'],
		['bottiglie', 6, 'bottiglie'],
		['figurine', 10, 'figurine']
	] as const);
	const read = `leggi ${total}`;
	const make = (q: string, r: string, order = ['scatole', 'avanzo']) => lines(read, `scatole = ${q}`, `avanzo = ${r}`, ...order.map((v) => `scrivi ${v}`));
	const q = rng.int(2, 6);
	const r = ((q + rng.int(0, k - 3)) % (k - 1)) + 1;
	return fix(
		rng,
		'scatole',
		`leggere un numero di ${what} e scrivere quante scatole da ${k} si riempiono e, nella riga sotto, quante ${what} avanzano`,
		make(`${total} // ${k}`, `${total} % ${k}`),
		[
			[make(`${total} % ${k}`, `${total} // ${k}`), 'I due segni sono scambiati: le scatole piene sono il quoziente, che si calcola con //, e quello che avanza è il resto, con %.'],
			[make(`${total} // ${k}`, `${total} - ${k}`), `La riga di avanzo toglie una sola scatola: quello che avanza è il resto della divisione per ${k}.`]
		],
		[make(`${total} // ${k}`, `${total} // ${k}`), make(`${total} % ${k}`, `${total} % ${k}`), make(`${total} // ${k}`, `${total} % ${k}`, ['avanzo', 'scatole']), make(`${total} // ${k}`, `scatole % ${k}`), make(`${total} * ${k}`, `${total} % ${k}`)],
		[[k * q + r], [k], [rng.int(1, k - 1)]]
	);
}

function perimeter(rng: Rng): Fix {
	const reads = ['leggi base', 'leggi altezza'];
	const make = (expr: string) => lines(...reads, `perimetro = ${expr}`, 'scrivi perimetro');
	const a = rng.int(4, 9);
	return fix(
		rng,
		'perimetro',
		"leggere la base e l'altezza di un rettangolo e scrivere il perimetro",
		make('2 * (base + altezza)'),
		[
			[make('2 * base + altezza'), 'Senza parentesi la moltiplicazione viene prima e raddoppia solo la base: servono le parentesi attorno alla somma.'],
			[make('base + altezza * 2'), "Senza parentesi la moltiplicazione viene prima e raddoppia solo l'altezza: servono le parentesi attorno alla somma."]
		],
		[make('base + altezza'), make('2 * base * altezza'), make('base * altezza'), make('2 + (base + altezza)'), make('(2 * base) + altezza')],
		[
			[a, ((a - 2 + rng.int(1, 5)) % 6) + 2],
			[rng.int(10, 20), 1]
		]
	);
}

function change(rng: Rng): Fix {
	const k = rng.int(2, 5);
	const reads = ['leggi pagato', 'leggi prezzo'];
	const make = (expr: string) => lines(...reads, `resto = ${expr}`, 'scrivi resto');
	const price = (lo: number, hi: number) => {
		const p = rng.int(lo, hi);
		return [p * k + rng.int(1, 9), p];
	};
	return fix(
		rng,
		'resto',
		`leggere quanti euro hai dato alla cassa e il prezzo di un quaderno, e scrivere il resto dopo aver comprato ${k} quaderni`,
		make(`pagato - prezzo * ${k}`),
		[
			[make(`(pagato - prezzo) * ${k}`), `Le parentesi fanno fare prima la sottrazione: così si moltiplica per ${k} il resto di un solo quaderno. Prima va calcolata la spesa, prezzo per ${k}.`],
			[make(`pagato - prezzo + ${k}`), `La spesa per ${k} quaderni è il prezzo moltiplicato per ${k}, non il prezzo più ${k}.`]
		],
		[make(`pagato * ${k} - prezzo`), make('pagato - prezzo'), make(`pagato + prezzo * ${k}`), make(`pagato - (prezzo + ${k})`), make(`prezzo * ${k}`)],
		[price(2, 5), price(6, 9)]
	);
}

function swap(rng: Rng): Fix {
	const reads = ['leggi a', 'leggi b'];
	const make = (...rows: string[]) => lines(...reads, ...rows, 'scrivi a', 'scrivi b');
	const a = rng.int(2, 9);
	return fix(
		rng,
		'scambio',
		'leggere due numeri in a e in b, scambiare i valori delle due variabili e scrivere prima a e poi b',
		make('temp = a', 'a = b', 'b = temp'),
		[
			[make('a = b', 'b = a'), 'La prima istruzione cancella il valore di a, e da lì nessuno lo può più recuperare: serve una variabile di appoggio che lo metta da parte.'],
			[make('temp = a', 'a = b', 'b = a'), "L'ultima istruzione copia in b il valore di a, che ormai è quello di b: deve prendere il valore messo da parte in temp."],
			[make('temp = a', 'b = temp', 'a = b'), 'Il valore di b viene cancellato prima di essere copiato in a: dopo aver messo da parte a, prima si copia b in a e solo dopo temp in b.']
		],
		[make('b = a', 'a = b'), make('temp = a', 'temp = b'), make('temp = 0', 'a = b', 'b = temp'), make('a = b', 'b = temp'), make('temp = b', 'a = b', 'b = temp'), make('temp = a', 'a = temp', 'b = a')],
		[
			[a, a + rng.int(1, 9)],
			[rng.int(11, 20), rng.int(1, 9)]
		]
	);
}

function sum(rng: Rng): Fix {
	const [s, i] = rng.pick([
		['s', 'i'],
		['somma', 'i'],
		['totale', 'k']
	]);
	const make = (from: number, start: number, cond: string, ...body: string[]) => lines('leggi n', `${s} = ${from}`, `${i} = ${start}`, `finché ${cond}`, ...body.map((row) => `    ${row}`), `scrivi ${s}`);
	const add = `${s} = ${s} + ${i}`;
	const next = `${i} = ${i} + 1`;
	return fix(
		rng,
		'somma',
		'leggere un numero n e scrivere la somma dei numeri da 1 a n',
		make(0, 1, `${i} <= n`, add, next),
		[
			[make(0, 1, `${i} < n`, add, next), `La condizione ${i} < n fa uscire dal ciclo un giro prima: l'ultimo numero, n, non viene sommato. Serve ${i} <= n.`],
			[make(0, 1, `${i} <= n`, `${s} = ${i}`, next), `Nel corpo ${s} viene sostituita, non aggiornata: a ogni giro deve prendere il suo valore più ${i}.`],
			[make(0, 1, `${i} <= n`, next, add), `Il contatore aumenta prima della somma: così si sommano i numeri da 2 a n + 1. Prima si somma, poi si aumenta ${i}.`]
		],
		[make(0, 1, `${i} <= n + 1`, add, next), make(1, 1, `${i} < n`, add, next), make(0, 1, `${i} <= n`, `${s} = ${s} + 1`, next), make(0, 1, `${i} <= n`, `${s} = ${s} + n`, next), make(1, 1, `${i} <= n`, add, next)],
		[[rng.int(4, 6)], [rng.int(2, 3)], [rng.int(7, 9)]]
	);
}

function threshold(rng: Rng): Fix {
	const euro = 10 * rng.int(3, 6);
	const goal = 50 * rng.int(1, 3);
	const [v, k, yes, no, should] = rng.pick<[string, number, string, string, string]>([
		['voto', 6, 'promosso', 'rimandato', 'leggere un voto e scrivere "promosso" se è almeno 6, altrimenti "rimandato"'],
		['eta', 18, 'maggiorenne', 'minorenne', 'leggere un\'età e scrivere "maggiorenne" se è almeno 18, altrimenti "minorenne"'],
		['spesa', euro, 'gratis', 'a pagamento', `leggere una spesa in euro e scrivere "gratis" se è almeno ${euro}, altrimenti "a pagamento"`],
		['punti', goal, 'vinto', 'riprova', `leggere un punteggio e scrivere "vinto" se è almeno ${goal}, altrimenti "riprova"`]
	]);
	const make = (cond: string, a = yes, b = no) => lines(`leggi ${v}`, `se ${cond}`, `    scrivi "${a}"`, 'altrimenti', `    scrivi "${b}"`);
	return fix(
		rng,
		'soglia',
		should,
		make(`${v} >= ${k}`),
		[
			[make(`${v} > ${k}`), `Con ${v} > ${k} il valore ${k} finisce nel ramo sbagliato: "almeno ${k}" comprende ${k}, e si scrive ${v} >= ${k}.`],
			[make(`${v} >= ${k}`, no, yes), 'I due rami sono scambiati: quando la condizione è vera si scrive il testo che andava nel ramo "altrimenti".'],
			[make(`${v} <= ${k}`), `Il confronto è girato: "almeno ${k}" vuol dire ${k} o di più, cioè ${v} >= ${k}.`]
		],
		[make(`${v} == ${k}`), make(`${v} >= ${k + 1}`), make(`${v} >= ${k - 1}`), make(`${v} > ${k}`, no, yes), make(`${v} != ${k}`)],
		[[k], [k - 1], [k + rng.int(2, 5)], [k - rng.int(2, 5)]]
	);
}

const FAMILIES = [discount, boxes, perimeter, change, swap, sum, threshold];
const broken = (rng: Rng): Fix => rng.pick(FAMILIES)(rng);

const wrongOf = (f: Fix) => mistakes(ID, f.right, f.wrong, f.tests, [f.bug]);
const params = (f: Fix) => ({ case: f.family, source: f.right, bug: f.bug, tests: f.tests });
const story = (f: Fix, what: string) => `Questo ${what} dovrebbe ${f.should}. Con ${f.tests[0].join(' e ')} scrive «${said(output(f.bug, f.tests[0]))}», e dovrebbe scrivere «${said(output(f.right, f.tests[0]))}».`;
const method = (f: Fix) => [`Scegli un dato con cui il risultato è sbagliato, qui ${f.tests[0].join(' e ')}, e segui i valori delle variabili con una tabella di traccia fino alla prima riga in cui un valore non è quello atteso.`, f.why, 'Correggi quella riga, e solo quella, poi riprova con altri dati.'];

function level3(rng: Rng): Built {
	const f = broken(rng);
	return {
		prompt: "Trova l'errore logico.",
		problem: `${story(f, 'programma')} Quale programma corregge l'errore?`,
		code: codes(f.bug, f.tests[0]),
		solution: f.why,
		steps: method(f),
		solutionCode: codes(f.right, f.tests[0]),
		answer: choose(
			rng,
			codeOption(f.right, f.tests[0]),
			wrongOf(f).map((source) => codeOption(source, f.tests[0]))
		),
		params: params(f)
	};
}

function level4(rng: Rng): Built {
	const f = broken(rng);
	return {
		prompt: "Trova l'errore logico.",
		problem: `${story(f, 'diagramma')} Quale diagramma corregge l'errore?`,
		chart: f.bug,
		solution: f.why,
		steps: method(f),
		solutionChart: f.right,
		answer: choose(rng, chartOption(f.right), wrongOf(f).map(chartOption)),
		params: params(f)
	};
}

function level5(rng: Rng): Built {
	const f = broken(rng);
	return {
		prompt: 'Correggi il diagramma di flusso.',
		problem: `${story(f, 'diagramma')} Correggi il blocco sbagliato.`,
		chart: f.bug,
		solution: f.why,
		steps: method(f),
		solutionChart: f.right,
		answer: chartAnswer(f.right, f.tests, f.bug),
		choice: choose(rng, chartOption(f.right), wrongOf(f).map(chartOption)),
		params: params(f)
	};
}

function level6(rng: Rng): Built {
	const f = broken(rng);
	return {
		prompt: 'Correggi il programma.',
		problem: `${story(f, 'programma')} Correggi la riga sbagliata.`,
		code: codes(f.bug, f.tests[0]),
		solution: f.why,
		steps: method(f),
		solutionCode: codes(f.right, f.tests[0]),
		answer: fixAnswer(f.right, f.bug, f.tests),
		choice: choose(
			rng,
			codeOption(f.right, f.tests[0]),
			wrongOf(f).map((source) => codeOption(source, f.tests[0]))
		),
		params: params(f)
	};
}

export default makeGenerator(ID, 'Errori e debug', {
	1: { label: 'Che tipo di errore è', constraints: ['a situation with a name: syntax (about 3 in 10), at run time (25 in 100), logical (3 in 10), no error (15 in 100)'], build: level1 },
	2: { label: 'Leggere un messaggio di errore', constraints: ['a message of the lesson, in Python or in C++', 'what happened (about 6 in 10) or the line it points to'], build: level2 },
	3: { label: "Trovare l'errore in un programma", constraints: ['the program shown is wrong on the first test', 'four programs, only one writes what it should on every test'], build: level3, check: sound },
	4: { label: "Trovare l'errore in un diagramma", constraints: ['the chart shown is wrong on the first test', 'four charts, only one writes what it should on every test'], build: level4, check: sound },
	5: { label: 'Correggere un diagramma', constraints: ['graded by running the chart', 'the chart to start from is the wrong one'], build: level5, check: sound },
	6: { label: 'Correggere un programma', constraints: ['graded by running the program', 'the program to start from is the wrong one'], build: level6, check: sound }
});
