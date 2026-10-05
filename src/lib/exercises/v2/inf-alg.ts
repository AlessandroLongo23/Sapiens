/**
 * Shared pieces of the generators of the chapter "Algoritmi e diagrammi di flusso" of informatica (lessons 45-50:
 * algoritmi, inf-problema-algoritmo, diagrammi-flusso, inf-pseudocodice, inf-bohm-jacopini, scratch).
 *
 * The chapter comes before the programming languages, so its tool is the flowchart. Every exercise that shows or
 * asks for one starts from an `Algo`: a small algorithm of a family (a total with a fixed fee, a threshold, a
 * countdown), with the numbers of its story drawn each time, written once in the language of the `diagramma`
 * blocks, with the mistakes a student makes on it and the inputs it is tried on. The levels of the six generators
 * are built on the same families with different questions: what the chart writes, which chart solves the problem,
 * build the chart.
 *
 * The independent check (scripts/exercises/checkers/_inf_alg.py) has its own table of what every family must write,
 * worked out from `k`, the numbers of the story.
 */
import { parseProgram } from '../../diagramma/blocco';
import { buildChart } from '../../diagramma/disegno';
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { chartAnswer, chartOption, choose, lines, needing, output, plain, shuffle, structure, textOption, writtenOption, wrongPrograms, type Built } from './inf-programmi';

export type Structure = 'sequenza' | 'selezione' | 'iterazione';

export interface Algo {
	/** The family, which is the case of the exercise. */
	family: string;
	structure: Structure;
	/** The numbers and the words of the story: what the check works the answers out from. */
	k: Record<string, number | string>;
	/** The problem as a person would say it, one or two sentences; empty when the task says it all. */
	story: string;
	/** What the algorithm does, to follow "un algoritmo che": what it reads, in order, and what it writes. */
	task: string;
	/** The idea of the solution, in a sentence, for the worked steps. */
	idea: string;
	source: string;
	/** The same algorithm with a mistake a student makes, each a different one, by the name of the mistake. */
	wrong: [string, string][];
	/** The inputs it is tried on: the first is an ordinary case, the others reach the other branches and the edges. */
	tests: number[][];
	/** The same algorithm written with jumps, as numbered steps (lesson 49). */
	jumps?: string;
	/** The same algorithm as a program made of blocks, said in words (lesson 50). */
	blocks?: string;
}

const body = (rows: string[]) => rows.map((row) => `    ${row}`);

// ---------------------------------------------------------------------------
// Sequences

const FEES = [
	{ id: 'concerto', story: (p: number, f: number) => `Per un concerto ogni biglietto costa ${p} euro, e sull'acquisto intero si pagano ${f} euro di prevendita, una volta sola.`, what: 'il numero di biglietti', one: 'un biglietto' },
	{ id: 'pizze', story: (p: number, f: number) => `Una pizzeria fa pagare ${p} euro ogni pizza, più ${f} euro per la consegna, una volta sola.`, what: 'il numero di pizze', one: 'una pizza' },
	{ id: 'foto', story: (p: number, f: number) => `Un negozio stampa le foto a ${p} euro l'una, e aggiunge ${f} euro di spedizione su tutto l'ordine.`, what: 'il numero di foto', one: 'una foto' },
	{ id: 'kart', story: (p: number, f: number) => `Su una pista di kart ogni giro costa ${p} euro, e il casco si noleggia per ${f} euro, una volta sola.`, what: 'il numero di giri', one: 'un giro' }
] as const;

/** A price for each, plus a fee paid once (the tickets of lesson 45). */
export function fee(rng: Rng): Algo {
	const ctx = rng.pick(FEES);
	const p = rng.int(5, 12);
	const f = rng.int(2, 4);
	const make = (...rows: string[]) => lines('leggi n', ...rows);
	return {
		family: 'quota',
		structure: 'sequenza',
		k: { ctx: ctx.id, p, f },
		story: ctx.story(p, f),
		task: `legge ${ctx.what} e scrive il totale da pagare, in euro`,
		idea: `Il totale è ${ctx.what} per ${p}, più ${f} una volta sola: prima la moltiplicazione, poi l'addizione, e solo alla fine la scrittura.`,
		source: make(`t = n * ${p}`, `t = t + ${f}`, 'scrivi t'),
		wrong: [
			['scrive prima', make(`t = n * ${p}`, 'scrivi t', `t = t + ${f}`)],
			['somma prima', make(`t = n + ${f}`, `t = t * ${p}`, 'scrivi t')],
			['sovrascrive', make(`t = n * ${p}`, `t = ${f}`, 'scrivi t')],
			['toglie', make(`t = n * ${p}`, `t = t - ${f}`, 'scrivi t')],
			['scambia i numeri', make(`t = n * ${f}`, `t = t + ${p}`, 'scrivi t')],
			['somma tutto', make(`t = n + ${p}`, `t = t + ${f}`, 'scrivi t')]
		],
		tests: [[rng.int(3, 6)], [1], [rng.int(8, 12)]]
	};
}

/** A fixed cost shared out, plus a price for each (the school trip of lesson 46). The first input is a multiple of the third. */
export function trip(rng: Rng): Algo {
	const b = rng.int(4, 12);
	const make = (expr: string) => lines('leggi c', 'leggi b', 'leggi n', `q = ${expr}`, 'scrivi q');
	const run = (n: number, q: number, ticket = b) => [n * q, ticket, n];
	return {
		family: 'gita',
		structure: 'sequenza',
		k: {},
		story: 'Una classe va in gita: il costo del pullman si divide in parti uguali tra gli studenti, e in più ognuno paga il proprio biglietto del museo. Nei casi di prova il costo del pullman è un multiplo del numero di studenti.',
		task: 'legge il costo del pullman, poi il prezzo del biglietto, poi il numero di studenti, e scrive la quota a testa',
		idea: 'La quota è il costo del pullman diviso per il numero di studenti, più il biglietto: prima la divisione, poi la somma. Il biglietto non si divide, perché ognuno paga il suo.',
		source: make('c // n + b'),
		wrong: [
			['divide anche il biglietto', make('(c + b) // n')],
			['dimentica il biglietto', make('c // n')],
			['non divide', make('c + b')],
			['divide per il biglietto', make('c // b + n')],
			['moltiplica il biglietto', make('c // n + b * n')],
			['toglie', make('c // n - b')]
		],
		tests: [run(rng.int(18, 26), 5 * rng.int(3, 6)), run(rng.int(10, 16), 10 * rng.int(2, 4), 0), run(1, 100 * rng.int(2, 5))]
	};
}

const UNITS = [
	{ id: 'ore', art: 'le', big: 'ore', small: 'minuti', per: 60, story: 'La durata di un film è data in ore e minuti.', out: 'la durata in minuti' },
	{ id: 'minuti', art: 'i', big: 'minuti', small: 'secondi', per: 60, story: 'Il tempo di una gara è dato in minuti e secondi.', out: 'il tempo in secondi' },
	{ id: 'settimane', art: 'le', big: 'settimane', small: 'giorni', per: 7, story: 'La durata di un viaggio è data in settimane e giorni.', out: 'la durata in giorni' },
	{ id: 'anni', art: 'gli', big: 'anni', small: 'mesi', per: 12, story: "L'età di un cucciolo è data in anni e mesi.", out: "l'età in mesi" },
	{ id: 'metri', art: 'i', big: 'metri', small: 'centimetri', per: 100, story: 'Un salto in lungo è misurato in metri e centimetri.', out: 'la misura in centimetri' },
	{ id: 'euro', art: 'gli', big: 'euro', small: 'centesimi', per: 100, story: 'Un prezzo è dato in euro e centesimi.', out: 'il prezzo in centesimi' }
] as const;

/** Two units into the smaller one (the hours and minutes of lesson 45). */
export function units(rng: Rng): Algo {
	const u = rng.pick(UNITS);
	const make = (expr: string) => lines('leggi a', 'leggi b', `t = ${expr}`, 'scrivi t');
	const small = () => rng.int(1, Math.min(u.per - 1, 45));
	return {
		family: 'unita',
		structure: 'sequenza',
		k: { ctx: u.id, per: u.per },
		story: u.story,
		task: `legge ${u.art} ${u.big}, poi i ${u.small}, e scrive ${u.out}`,
		idea: `Ogni unità grande ne vale ${u.per} piccole: si moltiplica il primo valore per ${u.per} e si aggiunge il secondo.`,
		source: make(`a * ${u.per} + b`),
		wrong: [
			['moltiplica il secondo', make(`a + b * ${u.per}`)],
			['moltiplica la somma', make(`(a + b) * ${u.per}`)],
			['dimentica il secondo', make(`a * ${u.per}`)],
			['somma soltanto', make('a + b')],
			['moltiplica tutto', make(`a * ${u.per} * b`)],
			['toglie', make(`a * ${u.per} - b`)]
		],
		tests: [[rng.int(2, 5), small()], [1, small()], [rng.int(6, 9), 0]]
	};
}

/** Perimeter or area of a rectangle (the sequence of lesson 47). */
export function rectangle(rng: Rng): Algo {
	const what = rng.pick(['perimetro', 'area'] as const);
	const make = (expr: string) => lines('leggi b', 'leggi h', `r = ${expr}`, 'scrivi r');
	const b = rng.int(3, 9);
	return {
		family: 'rettangolo',
		structure: 'sequenza',
		k: { what },
		story: '',
		task: `legge la base e poi l'altezza di un rettangolo e scrive ${what === 'area' ? "l'area" : 'il perimetro'}`,
		idea: what === 'area' ? "L'area è la base per l'altezza." : 'Il perimetro è il doppio della somma di base e altezza: le parentesi fanno fare prima la somma.',
		source: make(what === 'area' ? 'b * h' : '2 * (b + h)'),
		wrong:
			what === 'area'
				? [
						['perimetro', make('2 * (b + h)')],
						['somma', make('b + h')],
						['quadrato', make('b * b')],
						['doppio', make('2 * b * h')],
						['semiperimetro per due lati', make('2 * b + h')],
						['solo la base', make('b')]
					]
				: [
						['senza parentesi', make('2 * b + h')],
						['somma', make('b + h')],
						['area', make('b * h')],
						['doppio prodotto', make('2 * b * h')],
						['raddoppia la seconda', make('b + 2 * h')],
						['quadruplo', make('4 * (b + h)')]
					],
		tests: [
			[b, rng.int(2, b - 1)],
			[rng.int(2, 6), rng.int(7, 12)],
			[rng.int(4, 8), 1]
		]
	};
}

/** Assignments one after the other, with nothing read: the arrow is not an equals sign (lesson 47). */
export function order(rng: Rng): Algo {
	const tpl = rng.pick(['riusa', 'catena', 'scambio', 'scambio con appoggio'] as const);
	const a = rng.int(2, 9);
	const c = rng.int(2, 4);
	if (tpl === 'riusa') {
		const b = rng.int(1, 6);
		const make = (...rows: string[]) => lines(`x = ${a}`, ...rows, 'scrivi x', 'scrivi y');
		return {
			family: 'ordine',
			structure: 'sequenza',
			k: { tpl, a, b, c },
			story: '',
			task: `mette ${a} in x, mette in y il valore di x più ${b}, poi moltiplica x per ${c}, e scrive x e y`,
			idea: `Quando y viene calcolata, x vale ancora ${a}: il blocco dopo cambia x, non y, che resta ${a + b}.`,
			source: make(`y = x + ${b}`, `x = x * ${c}`),
			wrong: [
				['ordine scambiato', make(`x = x * ${c}`, `y = x + ${b}`)],
				['x non cambia', make(`y = x + ${b}`, `y = y * ${c}`)],
				['somma al posto del prodotto', make(`y = x + ${b}`, `x = x + ${c}`)],
				['x sovrascritta', make(`y = x + ${b}`, `x = ${c}`)],
				['y sovrascritta', make(`y = ${b}`, `x = x * ${c}`)],
				['y segue x', make(`y = x + ${b}`, `x = x * ${c}`, `y = x + ${b}`)]
			],
			tests: [[], []]
		};
	}
	if (tpl === 'catena') {
		const b = rng.int(1, 4);
		const start = b * c + rng.int(2, 9);
		const make = (...rows: string[]) => lines(`n = ${start}`, ...rows, 'scrivi n');
		return {
			family: 'ordine',
			structure: 'sequenza',
			k: { tpl, a: start, b, c },
			story: '',
			task: `mette ${start} in n, toglie ${b} a n, poi moltiplica n per ${c}, e scrive n`,
			idea: `Ogni blocco lavora sul valore lasciato dal blocco prima: ${start} meno ${b} fa ${start - b}, e ${start - b} per ${c} fa ${(start - b) * c}.`,
			source: make(`n = n - ${b}`, `n = n * ${c}`),
			wrong: [
				['ordine scambiato', make(`n = n * ${c}`, `n = n - ${b}`)],
				['solo il primo', make(`n = n - ${b}`)],
				['solo il secondo', make(`n = n * ${c}`)],
				['sovrascrive', make(`n = n - ${b}`, `n = ${c}`)],
				['somma', make(`n = n - ${b}`, `n = n + ${c}`)],
				['niente', make()]
			],
			tests: [[], []]
		};
	}
	const b = a + rng.int(1, 6);
	const make = (...rows: string[]) => lines(`a = ${a}`, `b = ${b}`, ...rows, 'scrivi a', 'scrivi b');
	const naive = make('a = b', 'b = a');
	const swap = make('c = a', 'a = b', 'b = c');
	const others: [string, string][] = [
		['niente', make()],
		['al contrario', make('b = a', 'a = b')],
		['somma', make('a = a + b', 'b = a')],
		['solo il primo', make('a = b', `b = ${a + b}`)]
	];
	return {
		family: 'ordine',
		structure: 'sequenza',
		k: { tpl, a, b, c: 0 },
		story: '',
		task: tpl === 'scambio' ? `mette ${a} in a e ${b} in b, poi copia b in a e subito dopo a in b, e scrive a e b` : `mette ${a} in a e ${b} in b, li scambia passando per una terza variabile c, e scrive a e b`,
		idea: tpl === 'scambio' ? `Dopo il primo blocco il ${a} che stava in a è perso: il secondo blocco copia in b il valore nuovo di a, e le due variabili valgono ${b}.` : `Il valore di a viene messo da parte in c prima di essere coperto: così alla fine a vale ${b} e b vale ${a}.`,
		source: tpl === 'scambio' ? naive : swap,
		wrong: [['scambio', tpl === 'scambio' ? swap : naive], ...others],
		tests: [[], []]
	};
}

// ---------------------------------------------------------------------------
// Selections

type Op = '>=' | '>' | '<' | '<=';
const NEAR: Record<Op, Op> = { '>=': '>', '>': '>=', '<': '<=', '<=': '<' };
const THRESHOLDS: { id: string; op: Op; v: string; pick: (rng: Rng) => number; story: (t: number) => string; read: string; yes: string }[] = [
	{ id: 'giostra', op: '>=', v: 'h', pick: (r) => 10 * r.int(10, 14), story: (t) => `Su una giostra sale chi è alto almeno ${t} centimetri.`, read: "l'altezza di una persona in centimetri", yes: 'se può salire' },
	{ id: 'verifica', op: '>=', v: 'p', pick: (r) => r.pick([6, 12, 18, 30, 36, 60]), story: (t) => `Una verifica è sufficiente con almeno ${t} punti.`, read: 'i punti di una verifica', yes: 'se è sufficiente' },
	{ id: 'ridotto', op: '<', v: 'e', pick: (r) => r.pick([6, 10, 12, 14, 16]), story: (t) => `In un museo paga il biglietto ridotto chi ha meno di ${t} anni.`, read: "l'età di un visitatore", yes: 'se paga il ridotto' },
	{ id: 'gioco', op: '>=', v: 'e', pick: (r) => r.pick([7, 12, 16, 18]), story: (t) => `Un videogioco è vietato a chi ha meno di ${t} anni.`, read: "l'età di una persona", yes: 'se può giocare' },
	{ id: 'buono', op: '>', v: 's', pick: (r) => 10 * r.int(2, 9), story: (t) => `Un negozio regala un buono a chi spende più di ${t} euro.`, read: 'la spesa in euro', yes: 'se il cliente riceve il buono' },
	{ id: 'bagaglio', op: '<=', v: 'p', pick: (r) => r.pick([8, 10, 12, 15, 20, 23]), story: (t) => `Su un aereo il bagaglio a mano può pesare al massimo ${t} chili.`, read: 'il peso di un bagaglio in chili', yes: 'se può salire a bordo' },
	{ id: 'febbre', op: '>', v: 't', pick: (r) => r.pick([37, 38]), story: (t) => `Un termometro segnala la febbre quando la temperatura supera i ${t} gradi (si misurano solo gradi interi).`, read: 'la temperatura in gradi', yes: "se c'è la febbre" },
	{ id: 'velocita', op: '<=', v: 'v', pick: (r) => 10 * r.int(3, 13), story: (t) => `Su una strada il limite è di ${t} chilometri all'ora: è in regola chi va a ${t} o meno.`, read: "la velocità di un'auto in chilometri all'ora", yes: 'se è in regola' }
];

/** One number against a threshold: "sì" or "no" (the reduced ticket of lesson 47). */
export function threshold(rng: Rng): Algo {
	const ctx = rng.pick(THRESHOLDS);
	const t = ctx.pick(rng);
	const v = ctx.v;
	const two = (cond: string, yes: string, no: string) => lines(`leggi ${v}`, `se ${cond}`, `    scrivi "${yes}"`, 'altrimenti', `    scrivi "${no}"`);
	const edge = ctx.op === '>=' || ctx.op === '<=' ? 'il valore di confine dà "sì"' : 'il valore di confine dà "no"';
	return {
		family: 'soglia',
		structure: 'selezione',
		k: { ctx: ctx.id, op: ctx.op, t },
		story: ctx.story(t),
		task: `legge ${ctx.read} e scrive "sì" ${ctx.yes}, "no" altrimenti`,
		idea: `La domanda del rombo è ${v} ${ctx.op.replace('>=', '≥').replace('<=', '≤')} ${t}: con ${t} in ingresso ${edge}.`,
		source: two(`${v} ${ctx.op} ${t}`, 'sì', 'no'),
		wrong: [
			['confine', two(`${v} ${NEAR[ctx.op]} ${t}`, 'sì', 'no')],
			['rami scambiati', two(`${v} ${ctx.op} ${t}`, 'no', 'sì')],
			['confine e rami scambiati', two(`${v} ${NEAR[ctx.op]} ${t}`, 'no', 'sì')],
			['senza altrimenti', lines(`leggi ${v}`, `se ${v} ${ctx.op} ${t}`, '    scrivi "sì"')],
			['il no fuori dal ramo', lines(`leggi ${v}`, `se ${v} ${ctx.op} ${t}`, '    scrivi "sì"', 'scrivi "no"')],
			['uguale', two(`${v} == ${t}`, 'sì', 'no')]
		],
		tests: [[t + rng.int(2, 9)], [t], [t - rng.int(1, 5)], [t + 1], [t - 1]]
	};
}

/** A discount only above a price: a selection with one branch (the first exercise of lesson 47). */
export function discount(rng: Rng): Algo {
	const t = 10 * rng.int(3, 9);
	const d = rng.pick([5, 10, 15, 20].filter((x) => x < t));
	const make = (...rows: string[]) => lines('leggi p', ...rows);
	return {
		family: 'sconto',
		structure: 'selezione',
		k: { t, d },
		story: `Un negozio toglie ${d} euro ai prezzi maggiori di ${t} euro, e lascia gli altri come sono.`,
		task: 'legge un prezzo e scrive quanto si paga',
		idea: `Lo sconto si fa solo sul ramo "sì" della domanda p > ${t}; la scrittura sta dopo la selezione, perché si fa in tutti e due i casi.`,
		source: make(`se p > ${t}`, `    p = p - ${d}`, 'scrivi p'),
		wrong: [
			['confine', make(`se p >= ${t}`, `    p = p - ${d}`, 'scrivi p')],
			['scrive nel ramo', make(`se p > ${t}`, `    p = p - ${d}`, '    scrivi p')],
			['sempre', make(`p = p - ${d}`, 'scrivi p')],
			['al contrario', make(`se p < ${t}`, `    p = p - ${d}`, 'scrivi p')],
			['sovrascrive', make(`se p > ${t}`, `    p = ${d}`, 'scrivi p')],
			['aggiunge', make(`se p > ${t}`, `    p = p + ${d}`, 'scrivi p')]
		],
		tests: [[t + 10 * rng.int(1, 4)], [t], [t - rng.int(2, 9)], [t + 1]]
	};
}

/** A fee waived from a spending on (the free delivery of lesson 46, with its mistake on the edge). */
export function delivery(rng: Rng): Algo {
	const t = 10 * rng.int(2, 6);
	const f = rng.int(3, 7);
	const two = (cond: string, yes: string, no: string) => lines('leggi s', `se ${cond}`, `    t = ${yes}`, 'altrimenti', `    t = ${no}`, 'scrivi t');
	return {
		family: 'spedizione',
		structure: 'selezione',
		k: { t, f },
		story: `Un negozio in rete aggiunge ${f} euro di spedizione, e la regala a chi spende almeno ${t} euro.`,
		task: 'legge la spesa e scrive il totale da pagare',
		idea: `"Almeno ${t}" comprende ${t}: la domanda è s ≥ ${t}, e con una spesa di ${t} euro la spedizione non si paga.`,
		source: two(`s >= ${t}`, 's', `s + ${f}`),
		wrong: [
			['confine', two(`s > ${t}`, 's', `s + ${f}`)],
			['rami scambiati', two(`s >= ${t}`, `s + ${f}`, 's')],
			['sempre', lines('leggi s', `t = s + ${f}`, 'scrivi t')],
			['confine e rami scambiati', two(`s <= ${t}`, `s + ${f}`, 's')],
			['solo la spedizione', two(`s >= ${t}`, 's', `${f}`)],
			['toglie', two(`s >= ${t}`, `s - ${f}`, 's')]
		],
		tests: [[t - rng.int(3, 12)], [t + rng.int(5, 25)], [t], [t - 1]]
	};
}

/** The larger or the smaller of two numbers (lesson 45). */
export function larger(rng: Rng): Algo {
	const what = rng.pick(['maggiore', 'minore'] as const);
	const op = what === 'maggiore' ? '>' : '<';
	const head = ['leggi a', 'leggi b'];
	const two = (cond: string, yes: string, no: string) => lines(...head, `se ${cond}`, `    scrivi ${yes}`, 'altrimenti', `    scrivi ${no}`);
	const x = rng.int(2, 20);
	const y = x + rng.int(1, 15);
	const same = rng.int(3, 12);
	// the second pair is in the other order and on other numbers, so that the tests do not all write the same
	const u = x + rng.int(1, 6);
	return {
		family: 'due numeri',
		structure: 'selezione',
		k: { what },
		story: '',
		task: `legge due numeri e scrive il ${what} dei due (se sono uguali, quel valore)`,
		idea: `Il rombo chiede se a ${op} b: sul ramo "sì" si scrive a, sul ramo "no" si scrive b. A ogni esecuzione si percorre un ramo solo.`,
		source: two(`a ${op} b`, 'a', 'b'),
		wrong: [
			["l'altro", two(`a ${op === '>' ? '<' : '>'} b`, 'a', 'b')],
			['sempre il primo', lines(...head, 'scrivi a')],
			['sempre il secondo', lines(...head, 'scrivi b')],
			['senza altrimenti', lines(...head, `se a ${op} b`, '    scrivi a')],
			['il secondo fuori dal ramo', lines(...head, `se a ${op} b`, '    scrivi a', 'scrivi b')],
			['la differenza', two(`a ${op} b`, 'a - b', 'b - a')]
		],
		tests: [
			[x, y],
			[y + u, u],
			[same, same]
		]
	};
}

/** Is a number divisible by another one: the remainder first, then the question (the third exercise of lesson 47). */
export function divisible(rng: Rng): Algo {
	const d = rng.int(2, 9);
	const two = (rest: string, cond: string, yes: string, no: string) => lines('leggi n', `r = ${rest}`, `se ${cond}`, `    scrivi "${yes}"`, 'altrimenti', `    scrivi "${no}"`);
	const q = rng.int(2, 9);
	return {
		family: 'divisibile',
		structure: 'selezione',
		k: { d },
		story: '',
		task: `legge un numero intero positivo e scrive "sì" se è divisibile per ${d}, "no" altrimenti`,
		idea: `Un numero è divisibile per ${d} quando il resto della divisione per ${d} è zero: si calcola il resto, n mod ${d}, e il rombo chiede se vale 0.`,
		source: two(`n % ${d}`, 'r == 0', 'sì', 'no'),
		wrong: [
			['rami scambiati', two(`n % ${d}`, 'r == 0', 'no', 'sì')],
			['quoziente', two(`n // ${d}`, 'r == 0', 'sì', 'no')],
			['resto uguale al divisore', two(`n % ${d}`, `r == ${d}`, 'sì', 'no')],
			['senza altrimenti', lines('leggi n', `r = n % ${d}`, 'se r == 0', '    scrivi "sì"')],
			['il no fuori dal ramo', lines('leggi n', `r = n % ${d}`, 'se r == 0', '    scrivi "sì"', 'scrivi "no"')],
			['resto uno', two(`n % ${d}`, 'r == 1', 'sì', 'no')]
		],
		tests: [[d * q], [d * q + rng.int(1, d - 1)], [d], [rng.int(1, d - 1)], [d * rng.int(2, 5) + 1]]
	};
}

/** Single entries or a season ticket, whichever costs less (the third exercise of lesson 46, with a number as result). */
export function cheaper(rng: Rng): Algo {
	const p = rng.int(4, 9);
	const cap = p * rng.int(4, 8) + rng.int(0, p - 1);
	const make = (...rows: string[]) => lines('leggi n', ...rows);
	const edge = Math.floor(cap / p);
	return {
		family: 'tetto',
		structure: 'selezione',
		k: { p, cap },
		story: `In una palestra l'ingresso singolo costa ${p} euro e l'abbonamento del mese ${cap} euro. Chi in un mese spenderebbe di più con gli ingressi singoli prende l'abbonamento.`,
		task: 'legge quante volte una persona va in palestra in un mese e scrive quanto spende',
		idea: `Prima si calcola il costo degli ingressi singoli, n per ${p}; se supera ${cap} lo si sostituisce con ${cap}, altrimenti resta com'è.`,
		source: make(`c = n * ${p}`, `se c > ${cap}`, `    c = ${cap}`, 'scrivi c'),
		wrong: [
			['al contrario', make(`c = n * ${p}`, `se c < ${cap}`, `    c = ${cap}`, 'scrivi c')],
			['confronta gli ingressi', make(`c = n * ${p}`, `se n > ${cap}`, `    c = ${cap}`, 'scrivi c')],
			['scrive nel ramo', make(`c = n * ${p}`, `se c > ${cap}`, `    c = ${cap}`, '    scrivi c')],
			['sempre', make(`c = n * ${p}`, `c = ${cap}`, 'scrivi c')],
			['senza controllo', make(`c = n * ${p}`, 'scrivi c')],
			['toglie', make(`c = n * ${p}`, `se c > ${cap}`, `    c = c - ${cap}`, 'scrivi c')]
		],
		tests: [[edge - rng.int(1, 2)], [edge + rng.int(2, 6)], [edge], [edge + 1]]
	};
}

/** Points only for the right answer (the quiz of lesson 50). */
export function quiz(rng: Rng): Algo {
	const x = rng.int(3, 9);
	const y = rng.int(3, 9);
	const g = rng.pick([5, 10, 20]);
	const r = x * y;
	const make = (...rows: string[]) => lines('p = 0', 'leggi r', ...rows);
	return {
		family: 'quiz',
		structure: 'selezione',
		k: { x, y, g },
		story: `In un quiz il personaggio chiede quanto fa ${x} per ${y}: chi risponde bene guadagna ${g} punti, chi sbaglia resta a zero.`,
		task: 'parte da 0 punti, legge la risposta e scrive i punti',
		idea: `I punti cambiano solo sul ramo "sì" della domanda r = ${r}; la scrittura sta dopo la selezione, così esce anche lo zero di chi sbaglia.`,
		source: make(`se r == ${r}`, `    p = p + ${g}`, 'scrivi p'),
		wrong: [
			['scrive nel ramo', make(`se r == ${r}`, `    p = p + ${g}`, '    scrivi p')],
			['al contrario', make(`se r != ${r}`, `    p = p + ${g}`, 'scrivi p')],
			['sempre', make(`p = p + ${g}`, 'scrivi p')],
			['somma al posto del prodotto', make(`se r == ${x + y}`, `    p = p + ${g}`, 'scrivi p')],
			['mette la risposta', make(`se r == ${r}`, '    p = r', 'scrivi p')],
			['toglie a chi sbaglia', make(`se r == ${r}`, `    p = p + ${g}`, 'altrimenti', `    p = p + 1`, 'scrivi p')]
		],
		tests: [[r], [r + rng.int(1, 4)], [x + y], [r - 1]],
		blocks: `porta p a 0; chiedi la risposta e mettila in r; se r = ${r} allora (cambia p di ${g}); dì p`
	};
}

// ---------------------------------------------------------------------------
// Iterations

/** A countdown with a word at the end (lessons 47 and 50). */
export function countdown(rng: Rng): Algo {
	const step = rng.pick([1, 1, 2, 3]);
	// short words: in C++, inside a loop, the line that writes one must stay within 34 characters
	const word = rng.pick(['via', 'auguri', 'tombola', 'decollo']);
	const make = (cond: string, rows: string[], after = [`scrivi "${word}"`]) => lines('leggi n', `finché ${cond}`, ...body(rows), ...after);
	const move = `n = n - ${step}`;
	const turns = rng.int(3, 5);
	return {
		family: 'rovescia',
		structure: 'iterazione',
		k: { step, word },
		story: '',
		task: `legge un numero n e scrive i numeri da n in giù${step > 1 ? `, di ${step} in ${step},` : ''} finché sono maggiori di zero, e poi scrive "${word}"`,
		idea: `Nel giro prima si scrive n e poi gli si toglie ${step}: è questo blocco che avvicina il "no" alla domanda n > 0. La parola finale sta fuori dal giro, sul ramo "no".`,
		source: make('n > 0', ['scrivi n', move]),
		wrong: [
			['ordine scambiato', make('n > 0', [move, 'scrivi n'])],
			['selezione', lines('leggi n', 'se n > 0', '    scrivi n', `    ${move}`, `scrivi "${word}"`)],
			['parola nel giro', make('n > 0', ['scrivi n', move, `scrivi "${word}"`], [])],
			['confine', make('n >= 0', ['scrivi n', move])],
			['si ferma prima', make('n > 1', ['scrivi n', move])],
			['passo sbagliato', make('n > 0', ['scrivi n', `n = n - ${step + 1}`])]
		],
		tests: [[step * turns - rng.int(0, step - 1)], [step * 2], [0], [1]],
		jumps: `1. Leggi n. 2. Se n è minore o uguale a 0, vai al passo 6. 3. Scrivi n. 4. Togli ${step} a n. 5. Vai al passo 2. 6. Scrivi "${word}".`
	};
}

/** The sum of the numbers from 1 to n (the second exercise of lesson 47). */
export function sumTo(rng: Rng): Algo {
	const make = (s: number, i: number, cond: string, rows: string[]) => lines('leggi n', `s = ${s}`, `i = ${i}`, `finché ${cond}`, ...body(rows), 'scrivi s');
	return {
		family: 'somma',
		structure: 'iterazione',
		k: {},
		story: '',
		task: 'legge un numero n e scrive la somma dei numeri interi da 1 a n',
		idea: 'La somma s parte da 0 e il numero da aggiungere i parte da 1; a ogni giro si aggiunge i a s e poi i cresce di uno, finché i non supera n.',
		source: make(0, 1, 'i <= n', ['s = s + i', 'i = i + 1']),
		wrong: [
			['confine', make(0, 1, 'i < n', ['s = s + i', 'i = i + 1'])],
			['ordine scambiato', make(0, 1, 'i <= n', ['i = i + 1', 's = s + i'])],
			['somma che parte da uno', make(1, 1, 'i <= n', ['s = s + i', 'i = i + 1'])],
			['sovrascrive', make(0, 1, 'i <= n', ['s = i', 'i = i + 1'])],
			['selezione', lines('leggi n', 's = 0', 'i = 1', 'se i <= n', '    s = s + i', '    i = i + 1', 'scrivi s')],
			['somma n', make(0, 1, 'i <= n', ['s = s + n', 'i = i + 1'])]
		],
		tests: [[rng.int(4, 6)], [1], [rng.int(7, 9)], [3]]
	};
}

/** The first multiples of a number (lesson 48). */
export function multiples(rng: Rng): Algo {
	const count = rng.int(3, 6);
	const make = (i: number, cond: string, rows: string[]) => lines('leggi n', `i = ${i}`, `finché ${cond}`, ...body(rows));
	return {
		family: 'multipli',
		structure: 'iterazione',
		k: { count },
		story: '',
		task: `legge un numero n e scrive i suoi primi ${count} multipli, da n in su`,
		idea: `Il contatore i va da 1 a ${count}: a ogni giro si scrive n · i e poi i cresce di uno.`,
		source: make(1, `i <= ${count}`, ['scrivi n * i', 'i = i + 1']),
		wrong: [
			['confine', make(1, `i < ${count}`, ['scrivi n * i', 'i = i + 1'])],
			['parte da zero', make(0, `i <= ${count}`, ['scrivi n * i', 'i = i + 1'])],
			['ordine scambiato', make(1, `i <= ${count}`, ['i = i + 1', 'scrivi n * i'])],
			['somma', make(1, `i <= ${count}`, ['scrivi n + i', 'i = i + 1'])],
			['selezione', lines('leggi n', 'i = 1', `se i <= ${count}`, '    scrivi n * i', '    i = i + 1')],
			['scrive il contatore', make(1, `i <= ${count}`, ['scrivi i', 'i = i + 1'])],
			['condizione di uscita', make(1, `i > ${count}`, ['scrivi n * i', 'i = i + 1'])]
		],
		tests: [[rng.int(3, 9)], [rng.int(10, 12)], [2]],
		jumps: `1. Leggi n. 2. Metti 1 in i. 3. Se i è maggiore di ${count}, vai al passo 7. 4. Scrivi n per i. 5. Aggiungi 1 a i. 6. Vai al passo 3. 7. Fine.`
	};
}

/** A product made of additions (the first exercise of lesson 45). */
export function byAdding(rng: Rng): Algo {
	const make = (p: string, cond: string, rows: string[]) => lines('leggi a', 'leggi b', `p = ${p}`, `finché ${cond}`, ...body(rows), 'scrivi p');
	return {
		family: 'addizioni',
		structure: 'iterazione',
		k: {},
		story: '',
		task: 'legge due numeri interi a e b, con b non negativo, e scrive il prodotto di a per b usando solo addizioni: aggiunge a per b volte',
		idea: "Il risultato p parte da 0; a ogni giro si aggiunge a e si toglie 1 a b, che conta i giri che mancano: quando b arriva a 0 le addizioni fatte sono tante quante diceva b all'inizio.",
		source: make('0', 'b > 0', ['p = p + a', 'b = b - 1']),
		wrong: [
			['confine', make('0', 'b >= 0', ['p = p + a', 'b = b - 1'])],
			['parte da a', make('a', 'b > 0', ['p = p + a', 'b = b - 1'])],
			['aggiunge b', make('0', 'b > 0', ['p = p + b', 'b = b - 1'])],
			['selezione', lines('leggi a', 'leggi b', 'p = 0', 'se b > 0', '    p = p + a', '    b = b - 1', 'scrivi p')],
			['si ferma prima', make('0', 'b > 1', ['p = p + a', 'b = b - 1'])],
			['sovrascrive', make('0', 'b > 0', ['p = a', 'b = b - 1'])]
		],
		tests: [[rng.int(3, 9), rng.int(3, 5)], [rng.int(4, 12), 1], [rng.int(2, 9), 0], [2, 6]]
	};
}

const SAVINGS = [
	{ id: 'cuffie', story: (w: number) => `Vuoi comprare un paio di cuffie e ogni settimana metti da parte ${w} euro.`, read: 'il prezzo delle cuffie' },
	{ id: 'bici', story: (w: number) => `Vuoi comprare una bicicletta usata e ogni settimana metti da parte ${w} euro.`, read: 'il prezzo della bicicletta' },
	{ id: 'scarpe', story: (w: number) => `Vuoi comprare un paio di scarpe e ogni settimana metti da parte ${w} euro.`, read: 'il prezzo delle scarpe' }
] as const;

/** How many weeks of savings to reach a price (lesson 46). */
export function savings(rng: Rng): Algo {
	const ctx = rng.pick(SAVINGS);
	const w = rng.pick([5, 6, 8, 10, 12, 15, 20]);
	const make = (s: number, cond: string, rows: string[], out = 'scrivi s') => lines('leggi p', 'r = 0', `s = ${s}`, `finché ${cond}`, ...body(rows), out);
	const weeks = rng.int(3, 7);
	return {
		family: 'risparmio',
		structure: 'iterazione',
		k: { ctx: ctx.id, w },
		story: ctx.story(w),
		task: `legge ${ctx.read} in euro e scrive tra quante settimane avrai abbastanza soldi`,
		idea: `I risparmi r e le settimane s partono da 0; finché i risparmi sono meno del prezzo si aggiungono ${w} euro e si conta una settimana. Quando i risparmi arrivano giusti al prezzo il giro si ferma.`,
		source: make(0, 'r < p', [`r = r + ${w}`, 's = s + 1']),
		wrong: [
			['confine', make(0, 'r <= p', [`r = r + ${w}`, 's = s + 1'])],
			['settimane che partono da uno', make(1, 'r < p', [`r = r + ${w}`, 's = s + 1'])],
			['scrive i risparmi', make(0, 'r < p', [`r = r + ${w}`, 's = s + 1'], 'scrivi r')],
			['selezione', lines('leggi p', 'r = 0', 's = 0', 'se r < p', `    r = r + ${w}`, '    s = s + 1', 'scrivi s')],
			['conta gli euro', make(0, 'r < p', [`r = r + ${w}`, `s = s + ${w}`])],
			['confronta le settimane', make(0, 's < p', [`r = r + ${w}`, 's = s + 1'])],
			['condizione di uscita', make(0, 'r >= p', [`r = r + ${w}`, 's = s + 1'])]
		],
		tests: [[w * weeks - rng.int(1, w - 1)], [w * (weeks - 1)], [rng.int(1, w - 1)], [w * 2 + 1]],
		blocks: `chiedi il prezzo e mettilo in p; porta r a 0; porta s a 0; ripeti fino a quando r ≥ p (cambia r di ${w}, cambia s di 1); dì s`
	};
}

/** How many halvings bring a number down to 1 (the first exercise of lesson 48). */
export function halvings(rng: Rng): Algo {
	const d = rng.pick([2, 2, 3]);
	const make = (c: number, cond: string, rows: string[], out = 'scrivi c') => lines('leggi n', `c = ${c}`, `finché ${cond}`, ...body(rows), out);
	const div = `n = n // ${d}`;
	return {
		family: 'divisioni',
		structure: 'iterazione',
		k: { d },
		story: '',
		task: `legge un numero intero positivo n e conta quante volte lo si può dividere per ${d}, tenendo ogni volta il quoziente intero, prima che diventi 1 o meno; scrive il conteggio`,
		idea: `A ogni giro n diventa il quoziente intero di n diviso ${d} e il contatore c cresce di uno; il giro si ripete finché n è maggiore di 1.`,
		source: make(0, 'n > 1', [div, 'c = c + 1']),
		wrong: [
			['confine', make(0, 'n > 0', [div, 'c = c + 1'])],
			['contatore che parte da uno', make(1, 'n > 1', [div, 'c = c + 1'])],
			['scrive il numero', make(0, 'n > 1', [div, 'c = c + 1'], 'scrivi n')],
			['selezione', lines('leggi n', 'c = 0', 'se n > 1', `    ${div}`, '    c = c + 1', 'scrivi c')],
			['resto', make(0, 'n > 1', [`n = n - ${d}`, 'c = c + 1'])],
			['si ferma prima', make(0, `n > ${d}`, [div, 'c = c + 1'])]
		],
		tests: [[rng.int(17, 40)], [d ** rng.int(3, 4)], [1], [rng.int(5, 15)]]
	};
}

/** Steps added until a goal is reached (the third exercise of lesson 50). */
export function goal(rng: Rng): Algo {
	const add = rng.pick([100, 200, 500, 1000]);
	const make = (cond: string, rows: string[], after = ['scrivi "fatto"']) => lines('leggi ob', 'p = 0', `finché ${cond}`, ...body(rows), ...after);
	const turns = rng.int(3, 5);
	return {
		family: 'traguardo',
		structure: 'iterazione',
		k: { add },
		story: '',
		task: `legge un obiettivo di passi ob, parte da 0 passi e, finché i passi sono meno dell'obiettivo, ne aggiunge ${add} e scrive a quanti è arrivato; alla fine scrive "fatto"`,
		idea: `Si resta nel giro finché p < ob: a ogni giro p cresce di ${add} e viene scritto. Quando p raggiunge l'obiettivo la risposta è "no" e si scrive "fatto".`,
		source: make('p < ob', [`p = p + ${add}`, 'scrivi p']),
		wrong: [
			['condizione di uscita', make('p >= ob', [`p = p + ${add}`, 'scrivi p'])],
			['confine', make('p <= ob', [`p = p + ${add}`, 'scrivi p'])],
			['ordine scambiato', make('p < ob', ['scrivi p', `p = p + ${add}`])],
			['selezione', lines('leggi ob', 'p = 0', 'se p < ob', `    p = p + ${add}`, '    scrivi p', 'scrivi "fatto"')],
			['parola nel giro', make('p < ob', [`p = p + ${add}`, 'scrivi p', 'scrivi "fatto"'], [])],
			['scrive solo alla fine', make('p < ob', [`p = p + ${add}`], ['scrivi p', 'scrivi "fatto"'])]
		],
		// no test with 0: the chart with the condition for leaving would never end on it
		tests: [[add * turns], [add * 2 + add / 2], [add], [1]],
		jumps: `1. Leggi ob. 2. Metti 0 in p. 3. Se p è maggiore o uguale a ob, vai al passo 7. 4. Aggiungi ${add} a p. 5. Scrivi p. 6. Vai al passo 3. 7. Scrivi "fatto".`,
		blocks: `chiedi l'obiettivo e mettilo in ob; porta p a 0; ripeti fino a quando p ≥ ob (cambia p di ${add}, dì p); dì "fatto"`
	};
}

const MOVES = [
	{ id: 'quadrato', a: 'avanti', b: 'gira' },
	{ id: 'salto', a: 'salta', b: 'atterra' },
	{ id: 'ballo', a: 'passo', b: 'battito' },
	{ id: 'disegno', a: 'penna giù', b: 'penna su' },
	{ id: 'luce', a: 'accendi', b: 'spegni' },
	{ id: 'porta', a: 'apri', b: 'chiudi' },
	{ id: 'nuoto', a: 'bracciata', b: 'respiro' },
	{ id: 'scala', a: 'sali', b: 'riposa' }
] as const;

/**
 * "Ripeti N volte" with the counter in sight (the square of lesson 50). Nothing is read, unless `asked`: then the
 * number of turns is read, for the level that asks to build the chart, so that its lines cannot be put in by hand.
 */
export function repeat(rng: Rng, asked = false): Algo {
	const m = rng.pick(MOVES);
	const n = rng.int(3, 9);
	const to = asked ? 'n' : String(n);
	const make = (i: number, cond: string, rows: string[], after = ['scrivi "fatto"']) => lines(...(asked ? ['leggi n'] : []), `i = ${i}`, `finché ${cond}`, ...body(rows), ...after);
	const moves = [`scrivi "${m.a}"`, `scrivi "${m.b}"`];
	return {
		family: 'ripeti',
		structure: 'iterazione',
		k: { ctx: m.id, n },
		story: '',
		task: `${asked ? 'legge un numero n e ripete n' : `ripete ${n}`} volte queste due mosse: scrive "${m.a}" e poi "${m.b}"; alla fine scrive "fatto", una volta sola`,
		idea: `Il blocco "ripeti ${to} volte" conta i giri da solo; nel diagramma il conto si scrive: i parte da 1, cresce di uno a ogni giro, e si resta nel giro finché i ≤ ${to}.`,
		source: make(1, `i <= ${to}`, [...moves, 'i = i + 1']),
		wrong: [
			['un giro in meno', make(1, `i < ${to}`, [...moves, 'i = i + 1'])],
			['un giro in più', make(0, `i <= ${to}`, [...moves, 'i = i + 1'])],
			['parola nel giro', make(1, `i <= ${to}`, [...moves, 'scrivi "fatto"', 'i = i + 1'], [])],
			['selezione', lines(...(asked ? ['leggi n'] : []), 'i = 1', `se i <= ${to}`, ...body([...moves, 'i = i + 1']), 'scrivi "fatto"')],
			['una mossa fuori dal giro', make(1, `i <= ${to}`, [moves[0], 'i = i + 1'], [moves[1], 'scrivi "fatto"'])],
			['mosse scambiate', make(1, `i <= ${to}`, [moves[1], moves[0], 'i = i + 1'])]
		],
		tests: asked ? [[n], [n > 5 ? n - 2 : n + 2]] : [[], []],
		blocks: `${asked ? 'chiedi quante volte e mettilo in n; ' : ''}ripeti ${to} volte (dì "${m.a}", dì "${m.b}"); dì "fatto"`
	};
}

/** A code asked again until it is the right one (lesson 49), with a word at every wrong attempt. */
export function unlock(rng: Rng): Algo {
	const code = rng.int(1000, 9999);
	const other = () => {
		let x = rng.int(1000, 9999);
		if (x === code) x = code === 9999 ? 1000 : code + 1;
		return x;
	};
	const make = (cond: string, rows: string[], after = ['scrivi "sbloccato"']) => lines('leggi pin', `finché ${cond}`, ...body(rows), ...after);
	return {
		family: 'sblocco',
		structure: 'iterazione',
		k: { code },
		story: `Il codice di sblocco di un telefono è ${code}.`,
		task: `legge un codice pin e, finché è diverso da ${code}, scrive "errato" e ne legge un altro; quando il codice è giusto scrive "sbloccato"`,
		idea: `Le istruzioni del giro devono potersi ripetere più volte, quindi serve un'iterazione: si resta nel giro finché pin ≠ ${code}, e dentro il giro si legge di nuovo.`,
		source: make(`pin != ${code}`, ['scrivi "errato"', 'leggi pin']),
		wrong: [
			['selezione', lines('leggi pin', `se pin != ${code}`, '    scrivi "errato"', '    leggi pin', 'scrivi "sbloccato"')],
			['condizione di uscita', make(`pin == ${code}`, ['scrivi "errato"', 'leggi pin'])],
			['parola nel giro', make(`pin != ${code}`, ['scrivi "errato"', 'leggi pin', 'scrivi "sbloccato"'], [])],
			['errato fuori dal giro', make(`pin != ${code}`, ['leggi pin'], ['scrivi "errato"', 'scrivi "sbloccato"'])],
			['non rilegge', lines('leggi pin', `se pin != ${code}`, '    scrivi "errato"', 'scrivi "sbloccato"')],
			['selezione a due vie', lines('leggi pin', `se pin != ${code}`, '    scrivi "errato"', 'altrimenti', '    scrivi "sbloccato"')]
		],
		tests: [[other(), other(), code], [code], [other(), code]],
		jumps: `1. Leggi pin. 2. Se pin è uguale a ${code}, vai al passo 6. 3. Scrivi "errato". 4. Leggi pin. 5. Vai al passo 2. 6. Scrivi "sbloccato".`,
		blocks: `chiedi il codice e mettilo in pin; ripeti fino a quando pin = ${code} (dì "errato", chiedi il codice e mettilo in pin); dì "sbloccato"`
	};
}

/** The sum of the numbers from n down to 1 (the algorithm with jumps of lesson 49). */
export function sumDown(rng: Rng): Algo {
	const make = (s: string, cond: string, rows: string[]) => lines('leggi n', `s = ${s}`, `finché ${cond}`, ...body(rows), 'scrivi s');
	return {
		family: 'somma in giù',
		structure: 'iterazione',
		k: {},
		story: '',
		task: 'legge un numero intero n non negativo e scrive la somma dei numeri da n fino a 1, togliendo ogni volta 1 a n finché arriva a 0',
		idea: 'La somma s parte da 0; finché n è diverso da 0 si aggiunge n a s e si toglie 1 a n.',
		source: make('0', 'n != 0', ['s = s + n', 'n = n - 1']),
		wrong: [
			['condizione di uscita', make('0', 'n == 0', ['s = s + n', 'n = n - 1'])],
			['selezione', lines('leggi n', 's = 0', 'se n != 0', '    s = s + n', '    n = n - 1', 'scrivi s')],
			['ordine scambiato', make('0', 'n != 0', ['n = n - 1', 's = s + n'])],
			['parte da n', make('n', 'n != 0', ['s = s + n', 'n = n - 1'])],
			['si ferma prima', make('0', 'n > 1', ['s = s + n', 'n = n - 1'])],
			['sovrascrive', make('0', 'n != 0', ['s = n', 'n = n - 1'])]
		],
		tests: [[rng.int(4, 6)], [1], [0], [rng.int(7, 9)]],
		jumps: '1. Leggi n. 2. Metti 0 in s. 3. Se n è uguale a 0, vai al passo 7. 4. Aggiungi n a s. 5. Togli 1 a n. 6. Vai al passo 3. 7. Scrivi s.',
		blocks: 'chiedi un numero e mettilo in n; porta s a 0; ripeti fino a quando n = 0 (cambia s di n, cambia n di −1); dì s'
	};
}

// ---------------------------------------------------------------------------
// One structure inside another: shown, never an option (two rhombuses are too wide)

/** Euclid's algorithm with subtractions (lesson 45). */
export function euclid(rng: Rng): Algo {
	const g = rng.pick([1, 2, 3, 4, 5, 6]);
	const pairs = [
		[2, 3],
		[3, 2],
		[3, 5],
		[5, 3],
		[4, 3],
		[3, 4],
		[2, 5],
		[5, 2],
		[1, 3],
		[4, 1],
		[3, 1],
		[1, 4],
		[5, 4],
		[4, 5]
	];
	const [x, y] = rng.pick(pairs);
	const head = ['leggi a', 'leggi b'];
	const make = (cond: string, test: string, out = 'scrivi a') => lines(...head, `finché ${cond}`, `    se ${test}`, '        a = a - b', '    altrimenti', '        b = b - a', out);
	return {
		family: 'euclide',
		structure: 'iterazione',
		k: {},
		story: '',
		task: 'legge due numeri interi positivi a e b e scrive il loro massimo comune divisore, togliendo il minore dal maggiore finché sono diversi',
		idea: 'A ogni giro si toglie il numero minore dal maggiore: i divisori comuni non cambiano e i numeri diventano più piccoli. Quando sono uguali, quel valore è il massimo comune divisore.',
		source: make('a != b', 'a > b'),
		wrong: [
			['un giro solo', lines(...head, 'se a > b', '    a = a - b', 'altrimenti', '    b = b - a', 'scrivi a')],
			['la somma', lines(...head, 'scrivi a + b')],
			['il minore', lines(...head, 'se a < b', '    scrivi a', 'altrimenti', '    scrivi b')],
			['la differenza', lines(...head, 'se a > b', '    scrivi a - b', 'altrimenti', '    scrivi b - a')],
			['il maggiore', lines(...head, 'se a > b', '    scrivi a', 'altrimenti', '    scrivi b')],
			['il prodotto', lines(...head, 'scrivi a * b')]
		],
		tests: [[g * x, g * y], [g * 4, g * 4], [g * y, g * x]]
	};
}

/** The numbers from 1 to n, with a word at every multiple (the first exercise of lesson 49). */
export function fizz(rng: Rng): Algo {
	const d = rng.int(2, 4);
	const head = ['leggi n', 'i = 1'];
	const make = (cond: string, test: string, yes: string, no: string, start = head) => lines(...start, `finché ${cond}`, `    se ${test}`, `        scrivi ${yes}`, '    altrimenti', `        scrivi ${no}`, '    i = i + 1');
	return {
		family: 'bum',
		structure: 'iterazione',
		k: { d },
		story: '',
		task: `legge un numero n e scrive i numeri da 1 a n, ma al posto dei multipli di ${d} scrive "bum"`,
		idea: `La selezione sta dentro il giro: a ogni giro il rombo interno chiede se i è un multiplo di ${d} e sceglie che cosa scrivere, poi i cresce di uno.`,
		source: make('i <= n', `i % ${d} == 0`, '"bum"', 'i'),
		wrong: [
			['rami scambiati', make('i <= n', `i % ${d} == 0`, 'i', '"bum"')],
			['confine', make('i < n', `i % ${d} == 0`, '"bum"', 'i')],
			['parte da zero', make('i <= n', `i % ${d} == 0`, '"bum"', 'i', ['leggi n', 'i = 0'])],
			['solo il divisore', make('i <= n', `i == ${d}`, '"bum"', 'i')],
			['senza selezione', lines(...head, 'finché i <= n', '    scrivi i', '    i = i + 1')],
			['resto uno', make('i <= n', `i % ${d} == 1`, '"bum"', 'i')]
		],
		tests: [[rng.int(5, 8)], [d], [d * 2 + 1]]
	};
}

/** How many of the marks read are at least 6 (lesson 49). The first input says how many marks follow. */
export function passes(rng: Rng): Algo {
	const head = ['leggi n', 'i = 1', 'c = 0'];
	const make = (cond: string, test: string, start = head, out = 'scrivi c') => lines(...start, `finché ${cond}`, '    leggi v', `    se ${test}`, '        c = c + 1', '    i = i + 1', out);
	const marks = (n: number) => Array.from({ length: n }, () => rng.int(3, 9));
	const first = [6, ...marks(rng.int(2, 3))];
	return {
		family: 'sufficienti',
		structure: 'iterazione',
		k: {},
		story: '',
		task: 'legge quanti voti ci sono in una pagella, poi i voti uno alla volta, e scrive quanti sono sufficienti (almeno 6)',
		idea: 'A ogni giro si legge un voto; la selezione, dentro il giro, aggiunge 1 al contatore solo se il voto è almeno 6. Il 6 conta.',
		source: make('i <= n', 'v >= 6'),
		wrong: [
			['confine del voto', make('i <= n', 'v > 6')],
			['conta le insufficienze', make('i <= n', 'v < 6')],
			['conta tutti', lines(...head, 'finché i <= n', '    leggi v', '    c = c + 1', '    i = i + 1', 'scrivi c')],
			['contatore che parte da uno', make('i <= n', 'v >= 6', ['leggi n', 'i = 1', 'c = 1'])],
			['somma i voti', lines(...head, 'finché i <= n', '    leggi v', '    se v >= 6', '        c = c + v', '    i = i + 1', 'scrivi c')],
			['scrive il contatore dei giri', make('i <= n', 'v >= 6', head, 'scrivi i')]
		],
		tests: [
			[first.length, ...shuffle(rng, first)],
			[2, 5, 4],
			[3, 6, 6, 7]
		]
	};
}

// ---------------------------------------------------------------------------
// From an Algo to a level

/** "con 4 e poi 3 in ingresso", "con 7 in ingresso"; nothing when the chart reads nothing. */
export function given(inputs: readonly (number | string)[]): string {
	if (!inputs.length) return '';
	const list = inputs.length === 1 ? String(inputs[0]) : `${inputs.slice(0, -1).join(', ')} e poi ${inputs[inputs.length - 1]}`;
	return `con ${list} in ingresso`;
}

/** What a chart writes, as a sentence says it. */
export const said = (written: string[]) => (written.length ? written.join(', ') : 'non scrive niente');

/** The width of the drawing of a chart, in px (an estimate on the wide side, as the drawing makes it). */
export const chartWidth = (source: string) => buildChart(parseProgram(source, true).program).width;
/** A phone has room for about 330 px: an option that is a chart must fit, a chart under the question may scroll a little (the two rhombuses of a nested chart). */
export const OPTION_WIDTH = 332;
export const SHOWN_WIDTH = 420;

/**
 * Three wrong charts for an Algo: those of `prefer` first (the mistakes the level is about), then the others in
 * their order; only those that write something else on the tests, and that are not wider than an option may be.
 */
export function mistakes(a: Algo, prefer: string[] = [], tests: number[][] = a.tests): string[] {
	const ranked = [...prefer.flatMap((name) => a.wrong.filter(([n]) => n === name)), ...a.wrong.filter(([n]) => !prefer.includes(n))].map(([, source]) => source);
	const wrong = wrongPrograms(
		a.source,
		ranked.filter((source) => chartWidth(source) <= OPTION_WIDTH),
		tests
	);
	if (wrong.length < 3) throw new Error(`inf-alg: only ${wrong.length} wrong charts for ${a.family}`);
	return wrong.slice(0, 3);
}

/** What goes in `params` for the independent check: the family, its numbers, the reference chart, its tests. */
export const paramsOf = (a: Algo, extra: Record<string, unknown> = {}) => ({ case: a.family, family: a.family, structure: a.structure, k: a.k, source: a.source, tests: a.tests, ...extra });

/** Other things a chart could be thought to write, when the mistakes do not give three: the last number moved, a line more or less. */
function near(written: string[]): string[][] {
	const last = written[written.length - 1];
	const out: string[][] = [];
	if (last !== undefined && /^-?\d+$/.test(last)) for (const d of [1, -1, 2, -2, 10]) if (Number(last) + d >= 0) out.push([...written.slice(0, -1), String(Number(last) + d)]);
	if (written.length > 1) out.push(written.slice(0, -1), written.slice(1), [...written].reverse(), [...written, written[written.length - 1]]);
	out.push(['0'], ['1'], []);
	return out;
}

/**
 * The multiple choice of "che cosa scrive": the right output, then what the mistaken charts write on the same
 * inputs (in a shuffled order, so that the same three do not always come up), then the outputs nearby.
 */
export function writtenChoice(rng: Rng, source: string, inputs: number[], others: string[], first: string[][] = []): ChoiceAnswer {
	const right = output(source, inputs);
	if (!right) throw new Error(`inf-alg: the chart does not end on ${inputs.join(', ')}:\n${source}`);
	const wrong = shuffle(rng, others)
		.map((s) => output(s, inputs))
		.filter((w): w is string[] => w !== null && w.length <= 9);
	// when the right answer is "niente" there is nothing near it: the outputs near those of `first` come before
	const nearby = right.length ? [...near(right), ...first.flatMap(near)] : [...first.flatMap(near), ...near(right)];
	return choose(rng, writtenOption(right), [...first, ...wrong, ...nearby].map(writtenOption));
}

const READING: Record<Structure, string> = {
	sequenza: "Esegui i blocchi dall'alto in basso, uno alla volta, segnando su un foglio il valore di ogni variabile che cambia.",
	selezione: 'Arrivato al rombo, rispondi alla domanda con i valori che hai sul foglio e segui solo il ramo della tua risposta.',
	iterazione: 'Segui il giro con una tabella: a ogni passaggio dal rombo rispondi alla domanda con i valori di quel momento, e quando la risposta è "no" esci dal giro.'
};

/** "Che cosa scrive questo diagramma con … in ingresso?": the chart is shown, the options are outputs. */
export function traceLevel(rng: Rng, a: Algo, inputs: number[] = a.tests[0]): Built {
	const written = output(a.source, inputs)!;
	const ask = given(inputs);
	return {
		prompt: 'Esegui il diagramma a mano, un blocco alla volta.',
		problem: `Che cosa scrive questo diagramma${ask ? ` ${ask}` : ''}?`,
		chart: a.source,
		solution: `Scrive ${said(written)}.`,
		steps: [READING[a.structure], a.idea, `${ask ? `${ask[0].toUpperCase()}${ask.slice(1)} il` : 'Il'} diagramma scrive ${said(written)}.`],
		answer: writtenChoice(
			rng,
			a.source,
			inputs,
			a.wrong.map(([, s]) => s)
		),
		params: paramsOf(a, { inputs, tests: firstTest(a, inputs) })
	};
}

/** The tests of an Algo with the inputs of the question first. */
export const firstTest = (a: Algo, inputs: number[]) => [inputs, ...a.tests.filter((t) => t.join() !== inputs.join())];

/** The problem in words, for a chart to choose or to build. */
export const asked = (a: Algo, verb: string) => `${a.story ? `${a.story} ` : ''}${verb} un algoritmo che ${a.task}.`;

const BUILDING: Record<Structure, string> = {
	sequenza: 'I blocchi vanno in fila: prima le letture, poi il calcolo, alla fine la scrittura.',
	selezione: 'Serve una selezione: un rombo con la domanda, e su ogni ramo quello che si fa solo in quel caso. Quello che si fa in tutti e due i casi sta fuori dai rami.',
	iterazione: 'Serve un ciclo: un rombo con la condizione che dice quando si resta nel giro, e nel giro un blocco che prima o poi la rende falsa. Quello che si fa una volta sola sta fuori dal giro.'
};

/** What the chart must write on its first two tests, as the steps say it. */
function tried(a: Algo): string {
	const runs = a.tests.slice(0, 2).map((t) => ({ t, w: output(a.source, t)! }));
	if (!a.tests[0].length) return `eseguito, deve scrivere ${said(runs[0].w)}`;
	return runs.map(({ t, w }) => `${given(t)} deve scrivere ${said(w)}`).join('; ');
}

/** "Quale diagramma risolve il problema?": the task in words, four charts. */
export function pickLevel(rng: Rng, a: Algo, prefer: string[] = [], problem = asked(a, 'Quale di questi diagrammi è')): Built {
	return {
		prompt: 'Scegli il diagramma giusto.',
		problem: problem.replace(/\.$/, '?'),
		solution: `Il diagramma che ${a.task}.`,
		steps: [a.idea, BUILDING[a.structure], `Per scegliere, esegui ogni diagramma su un caso di cui conosci il risultato: ${tried(a)}.`],
		solutionChart: a.source,
		answer: choose(rng, chartOption(a.source), mistakes(a, prefer).map(chartOption)),
		params: paramsOf(a)
	};
}

/** "Costruisci il diagramma": graded by running the chart on the tests; as a multiple choice, four charts. */
export function buildLevel(rng: Rng, a: Algo, prefer: string[] = [], problem = asked(a, 'Costruisci il diagramma di')): Built {
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem,
		solution: `Un diagramma che ${a.task}.`,
		steps: [a.idea, BUILDING[a.structure], `Poi prova il diagramma: ${tried(a)}.`],
		solutionChart: a.source,
		answer: needing(chartAnswer(a.source, a.tests), ...structure(a.source)),
		choice: choose(rng, chartOption(a.source), mistakes(a, prefer).map(chartOption)),
		params: paramsOf(a)
	};
}

/** A statement of a lesson: its id for the check, its text, and why it is true or what is true in its place. */
export type Statement = [id: string, text: string, why: string];

/** "Quale affermazione è vera?" with one true and three false, or "è falsa?" with one false and three true. */
export function statementLevel(rng: Rng, trues: readonly Statement[], falses: readonly Statement[], prompt: string): Built {
	const wantTrue = rng.next() < 0.5;
	const right = rng.pick(wantTrue ? trues : falses);
	const others = shuffle(rng, wantTrue ? falses : trues).slice(0, 3);
	const option = (s: Statement) => textOption(s[1], s[0]);
	return {
		prompt,
		problem: wantTrue ? 'Quale di queste affermazioni è vera?' : 'Quale di queste affermazioni è falsa?',
		solution: wantTrue ? right[1] : `È falsa questa: «${right[1]}»`,
		steps: wantTrue ? [right[2], `Le altre tre sono false. ${others.map((o) => o[2]).join(' ')}`] : [`Non è così. ${right[2]}`, 'Le altre tre affermazioni sono vere.'],
		answer: choose(rng, option(right), others.map(option)),
		params: { case: wantTrue ? 'vera' : 'falsa', ids: [right[0], ...others.map((o) => o[0])] }
	};
}

/** An option that is a text, told apart by an id the check reads. */
export const idOption = (label: string, id: string): ChoiceOption => textOption(label, id);

/**
 * What every sample that carries a chart is checked for here: the reference and every chart shown or offered are
 * written with what the chart, Python and C++ agree on; the reference ends on every test; an option that is a chart
 * is not wider than a phone; a chart to build has at least two tests.
 */
export function sound(sample: Sample): string[] {
	const errors: string[] = [];
	const source = sample.params.source;
	if (typeof source !== 'string') return errors;
	const tests = (sample.params.tests ?? [[]]) as number[][];
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	const charts = [source, ...(sample.chart ? [sample.chart] : []), ...(choice?.options.flatMap((o) => (o.chart ? [o.chart] : [])) ?? [])];
	for (const chart of charts) {
		const why = plain(chart, tests[0]);
		if (why) errors.push(`a chart ${why}`);
	}
	for (const t of tests) if (!output(source, t)) errors.push(`the reference does not end on ${t.join(', ')}`);
	for (const o of choice?.options ?? []) if (o.chart && chartWidth(o.chart) > OPTION_WIDTH) errors.push(`an option is ${chartWidth(o.chart)} px wide`);
	if (sample.chart && chartWidth(sample.chart) > SHOWN_WIDTH) errors.push(`the chart shown is ${chartWidth(sample.chart)} px wide`);
	if (sample.answer.kind === 'chart' && sample.answer.tests.length < 2) errors.push('a chart to build needs at least two tests');
	return errors;
}
