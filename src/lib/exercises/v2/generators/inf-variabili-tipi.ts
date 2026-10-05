/**
 * Variabili, assegnamento e tipi di dato. Spec: specs/exercises/inf-variabili-tipi.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/53-inf-variabili-tipi.md). The programs are
 * sequences of readings, assignments and writings, written once in the language of the flowcharts
 * (v2/inf-programmi.ts).
 *
 * 1. the value of a variable after two or three assignments; 2. two variables swapped, with and without the third
 * one; 3. the type of a datum; 4. `+` between numbers and between texts; 5. build the flowchart of a calculation in
 * sequence; 6. write its program.
 */
import { chartAnswer, chartOption, choose, codeOption, codes, lines, makeGenerator, output, programAnswer, textOption, type Built } from '../inf-programmi';
import { NAMES, mistakes, said, sound } from '../inf-primi';
import type { Rng, Sample } from '../types';

export const ID = 'inf-variabili-tipi';

// ---------------------------------------------------------------------------
// Level 1: one variable, two or three assignments

const COUNTERS = ['punti', 'saldo', 'livello', 'monete', 'passi', 'vite'];
type Op = { sign: '+' | '-' | '*'; k: number };
const apply = (x: number, { sign, k }: Op) => (sign === '+' ? x + k : sign === '-' ? x - k : x * k);
const show = (x: number, { sign, k }: Op) => `$${x} ${sign === '*' ? '\\cdot' : sign} ${k} = ${apply(x, { sign, k })}$`;

function level1(rng: Rng): Built {
	const name = rng.pick(COUNTERS);
	const start = rng.int(2, 12);
	const count = rng.pick([2, 3]);
	const ops: Op[] = [];
	let value = start;
	while (ops.length < count) {
		// two operations in a row are never of the same kind: swapping them would change nothing
		const sign = rng.pick((['+', '-', '*'] as const).filter((s) => s !== ops[ops.length - 1]?.sign && (s !== '-' || value >= 3)));
		const op: Op = { sign, k: sign === '*' ? rng.int(2, 3) : sign === '+' ? rng.int(2, 9) : rng.int(1, Math.min(9, value - 1)) };
		ops.push(op);
		value = apply(value, op);
	}
	const row = (op: Op) => `${name} = ${name} ${op.sign} ${op.k}`;
	const source = lines(`${name} = ${start}`, ...ops.map(row), `scrivi ${name}`);
	const values = ops.reduce<number[]>((seen, op) => [...seen, apply(seen[seen.length - 1], op)], [start]);
	const last = ops[ops.length - 1];
	const swapped = [...ops.slice(0, -2), last, ops[ops.length - 2]].reduce(apply, start);
	const others = [swapped, apply(start, last), values[values.length - 2], start, apply(start, ops[0]), value + 1, value - 1, value + 2].filter((x) => x >= 0);
	const o = (x: number) => textOption(String(x));
	return {
		prompt: 'Segui il valore della variabile con una tabella di traccia.',
		problem: 'Che cosa scrive questo programma?',
		code: codes(source),
		solution: String(value),
		steps: [`La variabile ${name} parte da ${start}.`, `Ogni assegnamento calcola prima il conto a destra, con il valore che ${name} ha in quel momento, e poi mette il risultato in ${name}: ${ops.map((op, i) => show(values[i], op)).join(', poi ')}.`, `Alla fine ${name} vale ${value}.`],
		answer: choose(rng, o(value), others.map(o)),
		params: { case: count === 2 ? 'due' : 'tre', source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// Level 2: swapping two variables

const PAIRS: [string, string, string][] = [
	['a', 'b', 'temp'],
	['x', 'y', 'temp'],
	['primo', 'secondo', 'appoggio'],
	['sinistra', 'destra', 'temp']
];

function level2(rng: Rng): Built {
	const [a, b, t] = rng.pick(PAIRS);
	const va = rng.int(1, 20);
	const vb = ((va - 1 + rng.int(1, 19)) % 20) + 1;
	const kind = rng.pick(['scambio', 'senza appoggio', 'al contrario'] as const);
	const middle = kind === 'scambio' ? [`${t} = ${a}`, `${a} = ${b}`, `${b} = ${t}`] : kind === 'senza appoggio' ? [`${a} = ${b}`, `${b} = ${a}`] : [`${b} = ${a}`, `${a} = ${b}`];
	const source = lines(`${a} = ${va}`, `${b} = ${vb}`, ...middle, `scrivi ${a}`, `scrivi ${b}`);
	const written = output(source)!;
	const all = [
		[vb, va],
		[vb, vb],
		[va, va],
		[va, vb]
	].map((pair) => pair.map(String));
	const o = (rows: string[]) => textOption(said(rows), rows.join('\n'));
	const steps =
		kind === 'scambio'
			? [`La prima istruzione mette da parte in ${t} il valore di ${a}, cioè ${va}.`, `Poi ${a} prende il valore di ${b}, ${vb}: il ${va} che c'era viene cancellato, ma è al sicuro in ${t}.`, `Infine ${b} prende il valore di ${t}, ${va}: i due valori sono scambiati.`]
			: kind === 'senza appoggio'
				? [`La prima istruzione copia in ${a} il valore di ${b}: ora valgono tutte e due ${vb}, e il ${va} è perso.`, `La seconda copia in ${b} il valore di ${a}, che è già ${vb}: non cambia niente.`, 'Per scambiare due variabili serve una terza variabile di appoggio.']
				: [`La prima istruzione copia in ${b} il valore di ${a}: ora valgono tutte e due ${va}, e il ${vb} è perso.`, `La seconda copia in ${a} il valore di ${b}, che è già ${va}: non cambia niente.`, 'Per scambiare due variabili serve una terza variabile di appoggio.'];
	return {
		prompt: 'Segui i valori delle due variabili, una istruzione alla volta.',
		problem: `Che cosa scrive questo programma? Nelle risposte il primo numero è ${a} e il secondo è ${b}.`,
		code: codes(source),
		solution: said(written),
		steps,
		answer: choose(
			rng,
			o(written),
			all.filter((rows) => rows.join() !== written.join()).map(o)
		),
		params: { case: kind, source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the type of a datum

export const TYPES = { intero: 'Numero intero', virgola: 'Numero con la virgola', testo: 'Testo (stringa)', booleano: 'Booleano' } as const;
type Type = keyof typeof TYPES;

const TYPE_WHY: Record<Type, string> = {
	intero: 'È una quantità che si conta, senza cifre dopo la virgola: è un numero intero.',
	virgola: 'È una misura che può avere cifre dopo la virgola: serve un numero con la virgola.',
	testo: 'È una fila di caratteri, non una quantità su cui fare conti: è un testo, cioè una stringa.',
	booleano: 'Può essere solo vero o falso: è un valore booleano.'
};

const DATA: [Type, string][] = [
	['intero', 'il numero di studenti di una classe'],
	['intero', 'quanti gol ha segnato una squadra'],
	['intero', "l'anno di nascita di una persona"],
	['intero', 'il numero di pagine di un libro'],
	['intero', 'quante vite restano in un gioco'],
	['intero', 'il numero di piani di un palazzo'],
	['intero', 'quanti messaggi sono arrivati oggi'],
	['intero', 'il numero di giri di pista completati'],
	['virgola', "l'altezza di una persona in metri"],
	['virgola', 'il prezzo di un quaderno in euro'],
	['virgola', 'la media dei voti di una materia'],
	['virgola', 'la temperatura in gradi, con i decimi'],
	['virgola', 'il peso di un pacco in chilogrammi'],
	['virgola', 'la distanza in chilometri tra due città'],
	['virgola', 'il tempo sui 100 metri in secondi'],
	['virgola', 'la capacità di una bottiglia in litri'],
	['testo', 'il nome di uno studente'],
	['testo', 'il titolo di una canzone'],
	['testo', "l'indirizzo di una casa"],
	['testo', 'il colore preferito di una persona'],
	['testo', 'la targa di una macchina'],
	['testo', 'il nome di una città'],
	['testo', 'il messaggio scritto in una chat'],
	['testo', 'il codice fiscale di una persona'],
	['booleano', 'se uno studente è promosso oppure no'],
	['booleano', 'se la luce è accesa oppure spenta'],
	['booleano', 'se la partita è finita oppure no'],
	['booleano', "se l'utente ha accettato le condizioni oppure no"],
	['booleano', 'se un numero è pari oppure no'],
	['booleano', 'se la porta è aperta oppure chiusa'],
	['booleano', 'se il livello è stato superato oppure no'],
	['booleano', 'se oggi è festa oppure no']
];

const WORDS = ['Giulia', 'Lecce', 'ciao', 'rosso', 'lunedì', 'pizza'];

/** A value as it is written in a program, with its type and why. */
function literal(rng: Rng): [Type, string, string] {
	const r = rng.int(0, 7);
	const whole = rng.int(0, 200);
	const decimal = `${rng.int(0, 40)}.${rng.pick(['5', '25', '75', '0', '2', '8'])}`;
	if (r === 0) return ['intero', String(whole), 'Sono solo cifre, senza punto e senza virgolette: è un numero intero.'];
	if (r === 1) return ['intero', `-${rng.int(1, 60)}`, 'Sono cifre con il segno meno, senza punto e senza virgolette: è un numero intero.'];
	if (r === 2) return ['virgola', decimal, 'Nei programmi la virgola dei decimali è un punto: è un numero con la virgola, anche quando dopo il punto c\'è uno zero.'];
	if (r === 3) return ['virgola', `-${decimal}`, 'Nei programmi la virgola dei decimali è un punto: è un numero con la virgola.'];
	if (r === 4) return ['testo', `"${rng.pick(WORDS)}"`, 'È scritto tra virgolette: è un testo, cioè una stringa.'];
	if (r === 5) return ['testo', `"${whole}"`, 'Le virgolette ne fanno un testo: è una fila di cifre, non un numero su cui fare conti.'];
	if (r === 6) return ['testo', `"${decimal}"`, 'Le virgolette ne fanno un testo: è una fila di caratteri, non un numero su cui fare conti.'];
	const value = rng.pick([
		['vero', 'True', 'true'],
		['falso', 'False', 'false']
	]);
	return ['booleano', `${value[0]} (${value[1]} in Python, ${value[2]} in C++)`, 'Vero e falso sono i due soli valori del tipo booleano.'];
}

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const described = rng.next() < 0.55;
	const o = (t: Type) => textOption(TYPES[t], t);
	const others = (type: Type) => (Object.keys(TYPES) as Type[]).filter((t) => t !== type).map(o);
	if (described) {
		const d = rng.int(0, DATA.length - 1);
		const [type, datum] = DATA[d];
		return {
			prompt: 'Scegli il tipo adatto al dato.',
			problem: `Nel programma di ${N} una variabile tiene ${datum}. Qual è il tipo giusto per quella variabile?`,
			solution: TYPES[type],
			steps: [TYPE_WHY[type], 'Il tipo dice che genere di dato è e quali operazioni si possono fare con lui.'],
			answer: choose(rng, o(type), others(type)),
			params: { case: 'descrizione', type, datum: d, name: N }
		};
	}
	const [type, value, why] = literal(rng);
	return {
		prompt: 'Riconosci il tipo da come è scritto il valore.',
		problem: `Nel programma di ${N} una variabile riceve il valore ${value}. Di che tipo è quel valore?`,
		solution: TYPES[type],
		steps: [why, 'I tipi di base sono quattro: numero intero, numero con la virgola, testo e booleano.'],
		answer: choose(rng, o(type), others(type)),
		params: { case: 'valore', type, value, name: N }
	};
}

// ---------------------------------------------------------------------------
// Level 4: + between numbers, + between texts

function level4(rng: Rng): Built {
	const texts = rng.next() < 0.5;
	const same = rng.next() < 0.3;
	const x = rng.int(1, 30);
	const y = same ? x : rng.int(1, 30);
	const lit = (v: number) => (texts ? `"${v}"` : String(v));
	const [a, b] = texts ? ['s', 't'] : ['a', 'b'];
	const source = same ? lines(`${a} = ${lit(x)}`, `scrivi ${a} + ${a}`) : lines(`${a} = ${lit(x)}`, `${b} = ${lit(y)}`, `scrivi ${a} + ${b}`);
	const sum = String(x + y);
	const joined = `${x}${y}`;
	const right = texts ? joined : sum;
	return {
		prompt: 'Guarda il tipo dei valori prima di fare il conto.',
		problem: 'Che cosa scrive questo programma?',
		code: codes(source),
		solution: right,
		steps: texts
			? [`I valori sono scritti tra virgolette: sono testi, non numeri.`, `Tra due testi il segno + li attacca uno dopo l'altro: esce ${joined}, non ${sum}.`]
			: ['I valori sono scritti senza virgolette: sono numeri interi.', `Tra due numeri il segno + è l'addizione: $${x} + ${y} = ${sum}$.`],
		answer: choose(
			rng,
			textOption(right),
			[texts ? sum : joined, `${x} + ${y}`, same ? `${a} + ${a}` : `${a} + ${b}`, `${y}${x}`, String(x + y + 1)].map((v) => textOption(v))
		),
		params: { case: texts ? 'testi' : 'numeri', source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: a calculation in sequence

interface Calc {
	family: 'prodotto' | 'aggiorna' | 'costante' | 'due passi' | 'scambio';
	/** What the program does, as the exercise says it after "un programma che". */
	task: string;
	source: string;
	wrong: string[];
	/** The readings, which the program to write starts from. */
	given: string;
	tests: number[][];
}

/** Two tests of `n` different whole numbers each, the first of small numbers; with `falling`, each in decreasing order. */
function inputs(rng: Rng, n: number, falling = false): number[][] {
	const draw = (lo: number, hi: number) => {
		const out: number[] = [];
		while (out.length < n) {
			const v = rng.int(lo, hi);
			if (!out.includes(v)) out.push(v);
		}
		return falling ? out.sort((p, q) => q - p) : out;
	};
	return [draw(3, 9), draw(10, 20)];
}

const PRODUCTS: [string, string, string, string, string][] = [
	['prezzo', 'quantita', 'totale', 'il prezzo di un quaderno e quanti quaderni compri', 'il totale da pagare'],
	['base', 'altezza', 'area', "la base e l'altezza di un rettangolo", "l'area"],
	['ore', 'paga', 'guadagno', 'le ore di lavoro e la paga per ogni ora', 'il guadagno'],
	['file', 'posti', 'totale', 'il numero di file di una sala e i posti di ogni fila', 'il numero di posti della sala']
];

function product(rng: Rng): Calc {
	const [a, b, r, what, result] = rng.pick(PRODUCTS);
	const reads = [`leggi ${a}`, `leggi ${b}`];
	const make = (...rows: string[]) => lines(...reads, ...rows);
	return {
		family: 'prodotto',
		task: `legge ${what}, due numeri interi, mette nella variabile ${r} ${result} e scrive il valore di ${r}`,
		source: make(`${r} = ${a} * ${b}`, `scrivi ${r}`),
		wrong: [make(`${r} = ${a} + ${b}`, `scrivi ${r}`), make(`${r} = ${a} * ${b}`, `scrivi ${a}`), make(`${r} = ${a} * ${b}`, `scrivi "${r}"`), make(`${r} = ${a} * ${a}`, `scrivi ${r}`), make(`${r} = ${b}`, `scrivi ${r}`), make(`scrivi ${r}`, `${r} = ${a} * ${b}`)],
		given: lines(...reads),
		tests: inputs(rng, 2)
	};
}

const UPDATES: [string, string, '+' | '-', string, string][] = [
	['punti', 'bonus', '+', "i punti che hai e il bonus dell'ultima partita", 'aggiunge il bonus ai punti'],
	['saldo', 'spesa', '-', 'il saldo di una carta e una spesa', 'toglie la spesa dal saldo'],
	['monete', 'premio', '+', 'le monete che hai e quelle di un premio', 'aggiunge il premio alle monete'],
	['pagine', 'lette', '-', 'le pagine di un libro e quelle che hai già letto', 'toglie dalle pagine quelle lette']
];

function update(rng: Rng): Calc {
	const [v, d, op, what, how] = rng.pick(UPDATES);
	const reads = [`leggi ${v}`, `leggi ${d}`];
	const make = (...rows: string[]) => lines(...reads, ...rows);
	const other = op === '+' ? '*' : '+';
	return {
		family: 'aggiorna',
		task: `legge ${what}, due numeri interi, ${how} e scrive il nuovo valore di ${v}`,
		source: make(`${v} = ${v} ${op} ${d}`, `scrivi ${v}`),
		wrong: [make(`${d} = ${v} ${op} ${d}`, `scrivi ${v}`), make(`${v} = ${d}`, `scrivi ${v}`), make(`${v} = ${v} ${other} ${d}`, `scrivi ${v}`), make(`${v} = ${d} ${op} ${v}`, `scrivi ${v}`), make(`${v} = ${v} ${op} ${v}`, `scrivi ${v}`), make(`${v} = ${v} ${op} ${d}`, `scrivi "${v}"`)],
		given: lines(...reads),
		tests: inputs(rng, 2, true)
	};
}

function constant(rng: Rng): Calc {
	const sides = rng.pick([
		[3, 'triangolo equilatero'],
		[4, 'quadrato'],
		[5, 'pentagono regolare'],
		[6, 'esagono regolare']
	] as const);
	const k = rng.int(2, 9);
	const [x, y, op, c, what, result] = rng.pick<[string, string, '+' | '-' | '*', number, string, string]>([
		['eta', 'futura', '+', k, "l'età di una persona", `l'età che avrà tra ${k} anni`],
		['lato', 'perimetro', '*', sides[0], `il lato di un ${sides[1]}`, 'il perimetro'],
		['settimane', 'giorni', '*', 7, 'un numero di settimane', 'il numero di giorni corrispondente'],
		['ore', 'minuti', '*', 60, 'un numero di ore', 'il numero di minuti corrispondente'],
		['prezzo', 'scontato', '-', Math.min(k, 3), 'il prezzo di un oggetto', `il prezzo con uno sconto di ${Math.min(k, 3)} euro`]
	]);
	const read = `leggi ${x}`;
	const make = (...rows: string[]) => lines(read, ...rows);
	const other = op === '*' ? '+' : '*';
	return {
		family: 'costante',
		task: `legge ${what}, un numero intero, mette nella variabile ${y} ${result} e scrive il valore di ${y}`,
		source: make(`${y} = ${x} ${op} ${c}`, `scrivi ${y}`),
		wrong: [make(`${y} = ${x} ${op} ${c}`, `scrivi ${x}`), make(`${y} = ${x} ${other} ${c}`, `scrivi ${y}`), make(`${y} = ${x} ${op} ${c}`, `scrivi "${y}"`), make(`${y} = ${c}`, `scrivi ${y}`), make(`${y} = ${x} ${op} ${x}`, `scrivi ${y}`), make(`scrivi ${y}`, `${y} = ${x} ${op} ${c}`)],
		given: lines(read),
		tests: inputs(rng, 1)
	};
}

function twoSteps(rng: Rng): Calc {
	if (rng.next() < 0.5) {
		const reads = ['leggi base', 'leggi altezza'];
		const make = (...rows: string[]) => lines(...reads, ...rows);
		return {
			family: 'due passi',
			task: "legge la base e l'altezza di un rettangolo, due numeri interi, mette in somma la loro somma, in perimetro il doppio di somma e scrive il valore di perimetro",
			source: make('somma = base + altezza', 'perimetro = somma * 2', 'scrivi perimetro'),
			wrong: [
				make('somma = base + altezza', 'perimetro = somma * 2', 'scrivi somma'),
				make('somma = base + altezza', 'perimetro = base * 2', 'scrivi perimetro'),
				make('somma = base + altezza', 'perimetro = somma + 2', 'scrivi perimetro'),
				make('somma = base * altezza', 'perimetro = somma * 2', 'scrivi perimetro'),
				make('perimetro = somma * 2', 'somma = base + altezza', 'scrivi perimetro'),
				make('somma = base + altezza', 'somma = somma * 2', 'scrivi perimetro')
			],
			given: lines(...reads),
			tests: inputs(rng, 2)
		};
	}
	const k = rng.int(3, 9);
	const reads = ['leggi prezzo', 'leggi quantita'];
	const make = (...rows: string[]) => lines(...reads, ...rows);
	return {
		family: 'due passi',
		task: `legge il prezzo di un libro e quanti libri compri, due numeri interi, mette in totale la spesa per i libri, poi aggiunge a totale ${k} euro di spedizione e scrive il valore di totale`,
		source: make('totale = prezzo * quantita', `totale = totale + ${k}`, 'scrivi totale'),
		wrong: [
			make('totale = prezzo * quantita', `totale = ${k}`, 'scrivi totale'),
			make('totale = prezzo * quantita', 'scrivi totale', `totale = totale + ${k}`),
			make('totale = prezzo + quantita', `totale = totale + ${k}`, 'scrivi totale'),
			make('totale = prezzo * quantita', `totale = totale * ${k}`, 'scrivi totale'),
			make('totale = prezzo * quantita', `prezzo = totale + ${k}`, 'scrivi totale'),
			make(`totale = totale + ${k}`, 'totale = prezzo * quantita', 'scrivi totale')
		],
		given: lines(...reads),
		tests: inputs(rng, 2)
	};
}

function swap(rng: Rng): Calc {
	const [a, b, t] = rng.pick(PAIRS);
	const reads = [`leggi ${a}`, `leggi ${b}`];
	const make = (...rows: string[]) => lines(...reads, ...rows, `scrivi ${a}`, `scrivi ${b}`);
	return {
		family: 'scambio',
		task: `legge due numeri interi in ${a} e in ${b}, scambia i valori delle due variabili e scrive prima ${a} e poi ${b}`,
		source: make(`${t} = ${a}`, `${a} = ${b}`, `${b} = ${t}`),
		wrong: [make(`${a} = ${b}`, `${b} = ${a}`), make(`${b} = ${a}`, `${a} = ${b}`), make(`${t} = ${a}`, `${t} = ${b}`), make(`${t} = ${a}`, `${b} = ${t}`, `${a} = ${b}`), make(`${t} = ${b}`, `${a} = ${b}`, `${b} = ${t}`), make(`${t} = ${a}`, `${a} = ${b}`), make(`${t} = ${a}`, `${a} = ${t}`, `${b} = ${a}`)],
		given: lines(...reads),
		tests: inputs(rng, 2)
	};
}

const calc = (rng: Rng): Calc => rng.pick([product, update, constant, twoSteps, swap])(rng);
const wrongOf = (c: Calc) => mistakes(ID, c.source, c.wrong, c.tests);
const params = (c: Calc) => ({ case: c.family, source: c.source, tests: c.tests });
const example = (c: Calc) => `Con ${c.tests[0].join(' e ')} deve scrivere ${said(output(c.source, c.tests[0]))}.`;
const HOW = 'Le letture, poi gli assegnamenti nell\'ordine in cui servono i valori, e in fondo la scrittura.';

function level5(rng: Rng): Built {
	const c = calc(rng);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${c.task}. ${example(c)}`,
		solution: HOW,
		steps: ['Metti un blocco "leggi" per ogni dato, nell\'ordine in cui arrivano.', 'Ogni conto è un blocco "assegna": a sinistra la variabile che riceve il valore, a destra il conto.', 'Un assegnamento usa i valori che le variabili hanno in quel momento: controlla l\'ordine dei blocchi con una tabella di traccia.'],
		solutionChart: c.source,
		answer: chartAnswer(c.source, c.tests),
		choice: choose(rng, chartOption(c.source), wrongOf(c).map(chartOption)),
		params: params(c)
	};
}

function level6(rng: Rng): Built {
	const c = calc(rng);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${c.task}. ${example(c)}`,
		solution: HOW,
		steps: ['Le letture sono già scritte: aggiungi sotto gli assegnamenti e la stampa.', 'In un assegnamento la variabile che riceve il valore sta a sinistra del segno =, il conto a destra.', 'Stampa la variabile senza virgolette: con le virgolette esce il suo nome.'],
		solutionCode: codes(c.source, c.tests[0]),
		answer: programAnswer(c.source, c.tests, c.given),
		choice: choose(
			rng,
			codeOption(c.source, c.tests[0]),
			wrongOf(c).map((source) => codeOption(source, c.tests[0]))
		),
		params: params(c)
	};
}

/** No program of this lesson has a selection or a loop. */
const sequence = (sample: Sample) => {
	const errors = sound(sample);
	if (/^\s*(se|finché|altrimenti)\b/m.test(String(sample.params.source ?? ''))) errors.push('the program is not a sequence');
	return errors;
};

export default makeGenerator(ID, 'Variabili, assegnamento e tipi di dato', {
	1: { label: 'Seguire gli assegnamenti', constraints: ['one variable, a first value and two or three assignments that use its own value', 'never a negative value'], build: level1, check: sequence },
	2: { label: 'Scambiare due variabili', constraints: ['two different values', 'the swap with a third variable, the two assignments without it, the two the other way round, about a third each'], build: level2, check: sequence },
	3: { label: 'Il tipo giusto per un dato', constraints: ['a datum said in words (about 55 in 100) or a value as a program writes it', 'the four basic types as options'], build: level3 },
	4: { label: 'Sommare numeri, unire testi', constraints: ['+ between two whole numbers or between two texts of digits, about half each'], build: level4, check: sequence },
	5: { label: 'Costruire il diagramma di un calcolo', constraints: ['graded by running the chart on two tests', 'five families, about a fifth each'], build: level5, check: sequence },
	6: { label: 'Scrivere il programma di un calcolo', constraints: ['graded by running the program on two tests', 'the readings are given'], build: level6, check: sequence }
});
