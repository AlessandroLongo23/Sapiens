/**
 * Shared pieces of the generators of the chapter "La selezione" of informatica (lessons 56-59: inf-condizioni,
 * inf-selezione-due-vie, inf-operatori-logici, inf-selezione-multipla).
 *
 * A selection of an exercise is a `Sel`: the program, written once in the language of the flowcharts, what it is
 * for in words, the same program with the mistakes students make, and the inputs it is tried on (both branches and
 * the boundary value). The families: a two-way selection on a threshold, a one-way selection that changes a value,
 * even or odd, the larger of two numbers, a compound condition (E, O, an interval), a cascade of two or three
 * selections. Everything else (charts, Python, C++, what is written) comes from v2/inf-programmi.ts.
 */
import { parseProgram } from '../../diagramma/blocco';
import { buildChart } from '../../diagramma/disegno';
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { choose, lines, output, plain, shuffle, writtenOption, wrongPrograms } from './inf-programmi';

export type Op = '==' | '!=' | '<' | '<=' | '>' | '>=';
type Order = '<' | '<=' | '>' | '>=';
export const OPS: Op[] = ['==', '!=', '<', '<=', '>', '>='];
/** The opposite comparison: true exactly when the other is false. */
export const NEG: Record<Op, Op> = { '==': '!=', '!=': '==', '<': '>=', '<=': '>', '>': '<=', '>=': '<' };
/** The same comparison with the boundary value on the other side. */
export const FLIP: Record<Order, Order> = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };
/** The comparison turned the other way, the boundary value where it was. */
export const MIRROR: Record<Order, Order> = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
/** The words of the lesson that decide the boundary. */
export const WORDS: Record<Order, string> = { '>=': 'almeno', '>': 'più di', '<': 'meno di', '<=': 'al massimo' };

export const holds = (a: number, op: Op, b: number): boolean => (op === '==' ? a === b : op === '!=' ? a !== b : op === '<' ? a < b : op === '<=' ? a <= b : op === '>' ? a > b : a >= b);

/** A piece of code inside the prose, in typewriter type. */
export const tt = (code: string) => `$\\texttt{${code.replace(/([{}_%&#])/g, '\\$1')}}$`;
/** An option that is a piece of code: a condition, a line. */
export const ttOption = (code: string, value = code): ChoiceOption => ({ latex: tt(code), values: [value], text: code });

/** The width of the flowchart of a program, in px, as the page draws it. */
export const chartWidth = (source: string) => buildChart(parseProgram(source, true).program).width;
/**
 * On a phone (390 px) an option has about 330 px and a chart under a question 347 px. A wider chart is cut on both
 * sides, and the part cut on the left cannot be scrolled to.
 */
export const OPTION_WIDTH = 330;
export const QUESTION_WIDTH = 345;
/** Whether the chart of a program fits an option. */
export const fits = (source: string) => chartWidth(source) <= OPTION_WIDTH;

const indent = (rows: string[]) => rows.map((row) => `    ${row}`);
/** The rows of a selection: `se`, the block of the yes and, when there is one, `altrimenti` with the block of the no. */
export const se = (cond: string, yes: string[], no: string[] = []) => [`se ${cond}`, ...indent(yes), ...(no.length ? ['altrimenti', ...indent(no)] : [])];
export const say = (text: string | number) => (typeof text === 'number' ? `scrivi ${text}` : `scrivi "${text}"`);
export const program = (reads: string[], body: string[]) => lines(...reads.map((name) => `leggi ${name}`), ...body);

/** A condition with the values in place of the names: `eta >= 18` with eta 17 is `17 >= 18`. */
export const filled = (cond: string, reads: string[], inputs: number[]) => reads.reduce((text, name, i) => text.replace(new RegExp(`\\b${name}\\b`, 'g'), String(inputs[i])), cond);
/** Whether a condition is true with the given inputs, worked out by running it. */
export const truth = (cond: string, reads: string[], inputs: number[]) => output(program(reads, se(cond, [say(1)], [say(0)])), inputs)?.[0] === '1';
/** "quando legge 7", "quando legge 130 e poi 7". */
export const reading = (inputs: number[]) => `quando legge ${inputs.join(' e poi ')}`;
export const trueOrFalse = (value: boolean) => (value ? 'vera' : 'falsa');

/** A value read and compared with a threshold: who it is about, the words of the rule, what is written in the two cases. */
export interface Scene {
	v: string;
	/** What the variable holds: "l'età di una persona". */
	what: string;
	/** The rule, with `{q}` where "almeno 18" goes. */
	when: string;
	dir: 'up' | 'down';
	from: number;
	step: number;
	count: number;
	yes: string;
	no: string;
	/** The name of a boolean variable that keeps the answer. */
	flag: string;
}

export const SCENES: Scene[] = [
	{ v: 'eta', what: "l'età di una persona", when: 'la persona ha {q} anni', dir: 'up', from: 12, step: 1, count: 10, yes: 'entra', no: 'resta fuori', flag: 'entra' },
	{ v: 'punti', what: 'il punteggio di uno studente in una verifica', when: 'lo studente ha preso {q} punti', dir: 'up', from: 50, step: 5, count: 5, yes: 'superata', no: 'da rifare', flag: 'superata' },
	{ v: 'spesa', what: 'la spesa di un cliente in euro', when: 'il cliente ha speso {q} euro', dir: 'up', from: 30, step: 10, count: 6, yes: 'sconto', no: 'prezzo pieno', flag: 'sconto' },
	{ v: 'monete', what: 'le monete di un giocatore', when: 'il giocatore ha {q} monete', dir: 'up', from: 20, step: 5, count: 15, yes: 'comprata', no: 'non bastano', flag: 'bastano' },
	{ v: 'velocita', what: "la velocità di un'auto in chilometri all'ora", when: "l'auto fa {q} chilometri all'ora", dir: 'up', from: 30, step: 10, count: 11, yes: 'multa', no: 'in regola', flag: 'multa' },
	{ v: 'altezza', what: "l'altezza di un bambino in centimetri", when: 'il bambino è alto {q} centimetri', dir: 'up', from: 100, step: 5, count: 9, yes: 'puoi salire', no: 'a terra', flag: 'sale' },
	{ v: 'minuti', what: 'i minuti di ritardo di un treno', when: 'il treno ha {q} minuti di ritardo', dir: 'up', from: 10, step: 5, count: 11, yes: 'rimborso', no: 'niente', flag: 'rimborso' },
	{ v: 'gradi', what: 'la temperatura di una stanza in gradi', when: 'nella stanza ci sono {q} gradi', dir: 'down', from: 15, step: 1, count: 7, yes: 'accendi', no: 'spegni', flag: 'freddo' },
	{ v: 'litri', what: 'i litri di benzina in un serbatoio', when: 'nel serbatoio ci sono {q} litri', dir: 'down', from: 5, step: 1, count: 11, yes: 'fai benzina', no: 'puoi partire', flag: 'riserva' },
	{ v: 'peso', what: 'il peso di una valigia in chili', when: 'la valigia pesa {q} chili', dir: 'down', from: 8, step: 1, count: 16, yes: 'a bordo', no: 'in stiva', flag: 'leggera' }
];

export const threshold = (rng: Rng, s: { from: number; step: number; count: number }) => s.from + s.step * rng.int(0, s.count - 1);
export const orderOf = (rng: Rng, dir: 'up' | 'down'): Order => rng.pick(dir === 'up' ? (['>=', '>'] as const) : (['<', '<='] as const));
export const rule = (when: string, op: Order, k: number) => when.replace('{q}', `${WORDS[op]} ${k}`);
/** Why a threshold in words is that comparison: which side the boundary value falls on. */
export const boundary = (op: Order, k: number, cond: string) => `"${WORDS[op]} ${k}" ${op === '>=' || op === '<=' ? 'comprende' : 'lascia fuori'} il ${k}: la condizione è ${tt(cond)}.`;

/** A program with a selection, and what an exercise needs around it. */
export interface Sel {
	family: string;
	/** What the program is for, as the exercise says it: "legge ... e scrive ...". */
	task: string;
	reads: string[];
	source: string;
	/** The conditions of its selections, in the order they are met. */
	conds: string[];
	/** How the condition comes out of the task, in a sentence. */
	why: string;
	/** The same program with a mistake a student makes, each a different one; the typical one first. */
	wrong: string[];
	/** The inputs it is tried on: every branch and the boundary values. */
	tests: number[][];
	/** The inputs that sit on a boundary. */
	edge: number[][];
}

/** A two-way selection on a threshold: one text if the condition holds, another if it does not. */
export function twoWay(rng: Rng, scene: Scene = rng.pick(SCENES)): Sel {
	const s = scene;
	const k = threshold(rng, s);
	const op = orderOf(rng, s.dir);
	const yes = [say(s.yes)];
	const no = [say(s.no)];
	const cond = `${s.v} ${op} ${k}`;
	const make = (c: string, a: string[], b: string[]) => program([s.v], se(c, a, b));
	return {
		family: 'due-vie',
		task: `legge ${s.what} e scrive "${s.yes}" se ${rule(s.when, op, k)}, altrimenti scrive "${s.no}"`,
		reads: [s.v],
		source: make(cond, yes, no),
		conds: [cond],
		why: boundary(op, k, cond),
		wrong: [
			make(`${s.v} ${FLIP[op]} ${k}`, yes, no),
			make(cond, no, yes),
			make(`${s.v} ${MIRROR[op]} ${k}`, yes, no),
			program([s.v], [...se(cond, yes), ...no]),
			make(`${s.v} == ${k}`, yes, no),
			program([s.v], se(cond, yes))
		],
		tests: [[k - 1], [k], [k + 1]],
		edge: [[k]]
	};
}

interface Tariff {
	v: string;
	dir: 'up' | 'down';
	from: number;
	step: number;
	count: number;
	/** The amount written when the condition holds, and when it does not. */
	yes: number[];
	no: number[];
	task: (q: string, yes: number, no: number) => string;
}

const TARIFFS: Tariff[] = [
	{ v: 'eta', dir: 'down', from: 6, step: 1, count: 13, yes: [0, 2, 3, 4], no: [6, 7, 8, 9], task: (q, a, b) => `legge l'età di un visitatore e scrive il prezzo del biglietto in euro: ${a} se il visitatore ha ${q} anni, altrimenti ${b}` },
	{ v: 'spesa', dir: 'up', from: 30, step: 5, count: 11, yes: [0, 1, 2], no: [5, 6, 7, 8], task: (q, a, b) => `legge la spesa di un cliente e scrive il costo della spedizione in euro: ${a} se il cliente ha speso ${q} euro, altrimenti ${b}` },
	{ v: 'punti', dir: 'up', from: 50, step: 5, count: 7, yes: [10, 15, 20], no: [3, 5, 8], task: (q, a, b) => `legge i punti di uno studente in una verifica e scrive la paghetta della settimana in euro: ${a} se lo studente ha preso ${q} punti, altrimenti ${b}` },
	{ v: 'ore', dir: 'up', from: 2, step: 1, count: 7, yes: [9, 10, 12], no: [3, 4, 5, 6], task: (q, a, b) => `legge le ore di sosta di un'auto e scrive il costo del parcheggio in euro: ${a} se l'auto è rimasta ${q} ore, altrimenti ${b}` },
	{ v: 'km', dir: 'down', from: 5, step: 5, count: 8, yes: [2, 3, 4], no: [6, 7, 9], task: (q, a, b) => `legge i chilometri di una corsa in autobus e scrive il prezzo del biglietto in euro: ${a} se la corsa è di ${q} chilometri, altrimenti ${b}` }
];

/** A two-way selection on a threshold that writes one of two numbers: its chart is narrow enough for an option. */
export function tariff(rng: Rng): Sel {
	const s = rng.pick(TARIFFS);
	const k = threshold(rng, s);
	const op = orderOf(rng, s.dir);
	const yes = [say(rng.pick(s.yes))];
	const no = [say(rng.pick(s.no))];
	const cond = `${s.v} ${op} ${k}`;
	const make = (c: string, a: string[], b: string[]) => program([s.v], se(c, a, b));
	return {
		family: 'tariffa',
		task: s.task(`${WORDS[op]} ${k}`, Number(yes[0].slice(7)), Number(no[0].slice(7))),
		reads: [s.v],
		source: make(cond, yes, no),
		conds: [cond],
		why: boundary(op, k, cond),
		wrong: [make(`${s.v} ${FLIP[op]} ${k}`, yes, no), make(cond, no, yes), make(`${s.v} ${MIRROR[op]} ${k}`, yes, no), program([s.v], [...se(cond, yes), ...no]), make(`${s.v} == ${k}`, yes, no), program([s.v], se(cond, yes))],
		tests: [[k - 1], [k], [k + 1]],
		edge: [[k]]
	};
}

interface OneWay {
	v: string;
	dir: 'up' | 'down';
	from: number;
	step: number;
	count: number;
	message: string;
	deltas: number[];
	task: (q: string, delta: number) => string;
}

const ONE_WAY: OneWay[] = [
	{ v: 'spesa', dir: 'up', from: 30, step: 10, count: 6, message: 'sconto', deltas: [-5, -10, -15, -20], task: (q, d) => `legge la spesa di un cliente; se il cliente ha speso ${q} euro scrive "sconto" e toglie ${-d} euro dalla spesa; alla fine, in tutti i casi, scrive la spesa` },
	{ v: 'spesa', dir: 'down', from: 20, step: 5, count: 7, message: '', deltas: [3, 4, 5, 6, 7], task: (q, d) => `legge la spesa di un ordine; se il cliente ha speso ${q} euro aggiunge ${d} euro di spedizione; alla fine, in tutti i casi, scrive il totale` },
	{ v: 'punti', dir: 'up', from: 50, step: 10, count: 5, message: 'bonus', deltas: [5, 10, 20, 25], task: (q, d) => `legge i punti di un giocatore; se il giocatore ha fatto ${q} punti scrive "bonus" e ne aggiunge ${d}; alla fine, in tutti i casi, scrive i punti` },
	{ v: 'energia', dir: 'down', from: 10, step: 5, count: 5, message: 'pozione', deltas: [20, 30, 40, 50], task: (q, d) => `legge l'energia di un personaggio; se gli restano ${q} punti di energia scrive "pozione" e ne aggiunge ${d}; alla fine, in tutti i casi, scrive l'energia` }
];

/** A one-way selection: when the condition holds a value changes (and a message is written), then the value is written. */
export function oneWay(rng: Rng): Sel {
	const s = rng.pick(ONE_WAY);
	const k = threshold(rng, s);
	const op = orderOf(rng, s.dir);
	const delta = rng.pick(s.deltas);
	const change = (d: number) => `${s.v} = ${s.v} ${d < 0 ? '-' : '+'} ${Math.abs(d)}`;
	const message = s.message ? [say(s.message)] : [];
	const end = `scrivi ${s.v}`;
	const cond = `${s.v} ${op} ${k}`;
	const make = (c: string, d = delta) => program([s.v], [...se(c, [...message, change(d)]), end]);
	return {
		family: 'una-via',
		task: s.task(`${WORDS[op]} ${k}`, delta),
		reads: [s.v],
		source: make(cond),
		conds: [cond],
		why: boundary(op, k, cond),
		wrong: [
			make(`${s.v} ${FLIP[op]} ${k}`),
			// the change left out of the block, or the last line pulled into it
			message.length ? program([s.v], [...se(cond, message), change(delta), end]) : program([s.v], se(cond, [change(delta), end])),
			make(`${s.v} ${MIRROR[op]} ${k}`),
			program([s.v], se(cond, [...message, change(delta), end])),
			make(cond, -delta),
			...(message.length ? [program([s.v], [change(delta), ...se(cond, message), end]), program([s.v], [...se(cond, message, [change(delta)]), end])] : [program([s.v], [...se(cond, [end], [change(delta)]), end])])
		],
		tests: [[k - 1], [k], [k + 1]],
		edge: [[k]]
	};
}

/** Even or odd, a multiple of k or not: the remainder compared with zero. */
export function parity(rng: Rng): Sel {
	const v = rng.pick(['n', 'numero', 'k']);
	const d = rng.pick([2, 2, 3, 4, 5, 10]);
	const [yes, no] = d === 2 ? ['pari', 'dispari'] : ['multiplo', 'non multiplo'];
	const make = (c: string, a = yes, b = no) => program([v], se(c, [say(a)], [say(b)]));
	const cond = `${v} % ${d} == 0`;
	const m = rng.int(2, 9);
	return {
		family: 'resto',
		task: d === 2 ? 'legge un numero intero e scrive "pari" se è pari, "dispari" se è dispari' : `legge un numero intero e scrive "multiplo" se è un multiplo di ${d}, altrimenti scrive "non multiplo"`,
		reads: [v],
		source: make(cond),
		conds: [cond],
		why: `Un numero è ${d === 2 ? 'pari' : `un multiplo di ${d}`} quando il resto della divisione per ${d} è zero: la condizione è ${tt(cond)}.`,
		wrong: [make(cond, no, yes), make(`${v} // ${d} == 0`), make(`${v} == ${d}`), make(`${v} % ${d} == 1`), make(`${v} % ${d + 1} == 0`), program([v], [...se(cond, [say(yes)]), say(no)])],
		tests: [[m * d], [m * d + 1], [d], [d + 1], [m * d + d - 1]].filter((t, i, all) => all.findIndex((u) => u[0] === t[0]) === i),
		edge: [[d], [m * d]]
	};
}

/** The larger (or the smaller) of two numbers. */
export function larger(rng: Rng): Sel {
	const [a, b] = rng.pick([
		['a', 'b'],
		['x', 'y'],
		['m', 'n'],
		['p', 'q']
	]);
	const max = rng.next() < 0.6;
	const op = max ? '>' : '<';
	const make = (c: string, first: string, second: string) => program([a, b], se(c, [`scrivi ${first}`], [`scrivi ${second}`]));
	const cond = `${a} ${op} ${b}`;
	const low = rng.int(1, 9);
	const high = low + rng.int(1, 9);
	const same = high + rng.int(1, 5);
	return {
		family: 'maggiore',
		task: `legge due numeri interi e scrive il ${max ? 'maggiore' : 'minore'} dei due (se sono uguali, scrive quel valore)`,
		reads: [a, b],
		source: make(cond, a, b),
		conds: [cond],
		why: `Quando ${tt(cond)} è vera il ${max ? 'maggiore' : 'minore'} è ${a}; in tutti gli altri casi, anche con due numeri uguali, va bene scrivere ${b}.`,
		wrong: [make(cond, b, a), program([a, b], [...se(cond, [`scrivi ${a}`]), `scrivi ${b}`]), make(cond, `"${a}"`, `"${b}"`), make(`${a} ${op} 0`, a, b), make(cond, a, `${a} + ${b}`), make(`${a} == ${b}`, a, b)],
		tests: [
			[high, low],
			[low, high],
			[same, same]
		],
		edge: [[same, same]]
	};
}

/** A comparison between a name and a number, as a piece of a compound condition. */
export interface Cmp {
	l: string | number;
	op: Op;
	r: string | number;
}
export const show = (c: Cmp) => `${c.l} ${c.op} ${c.r}`;
export const withOp = (c: Cmp, op: Op): Cmp => ({ ...c, op });
/** The same comparison with the name on the left: `1 > voto` is `voto < 1`. */
export const named = (c: Cmp): Cmp => (typeof c.l === 'number' && c.op !== '==' && c.op !== '!=' ? { l: c.r, op: MIRROR[c.op], r: c.l } : c);
const flipped = (c: Cmp) => (c.op === '==' || c.op === '!=' ? null : withOp(c, FLIP[c.op]));

/** A two-way selection whose condition is two comparisons joined by E or by O. */
export interface Compound extends Sel {
	parts: [string, string];
	cmps: [Cmp, Cmp];
	join: 'E' | 'O';
	yes: string;
	no: string;
}

/** The two operators as the two languages write them, for a sentence. */
export const JOINS = { E: 'E (and in Python, && in C++)', O: 'O (or in Python, || in C++)' };

function compound(family: string, task: string, reads: string[], c1: Cmp, c2: Cmp, join: 'E' | 'O', yes: string, no: string, tests: number[][], edge: number[][]): Compound {
	const make = (cond: string, a = yes, b = no) => program(reads, se(cond, [say(a)], [say(b)]));
	const other = join === 'E' ? 'O' : 'E';
	const both = (a: Cmp, b: Cmp, j: string = join) => `${show(a)} ${j} ${show(b)}`;
	const f1 = flipped(c1);
	const f2 = flipped(c2);
	return {
		family,
		task,
		reads,
		source: make(both(c1, c2)),
		conds: [both(c1, c2)],
		why: `${family === 'intervallo' ? 'Un intervallo sono due confronti che devono essere veri insieme' : join === 'E' ? 'Le due richieste devono essere vere insieme' : 'Basta che sia vera una delle due richieste'}: i confronti ${tt(show(c1))} e ${tt(show(c2))} si uniscono con ${JOINS[join]}.`,
		parts: [show(c1), show(c2)],
		cmps: [c1, c2],
		join,
		yes,
		no,
		wrong: [
			make(both(c1, c2, other)),
			...(f1 ? [make(both(f1, c2))] : []),
			...(f2 ? [make(both(c1, f2))] : []),
			make(both(c1, c2), no, yes),
			// the pieces negated and the operator left as it was, with the two texts exchanged
			make(both(withOp(c1, NEG[c1.op]), withOp(c2, NEG[c2.op])), no, yes),
			make(show(c1)),
			make(show(c2)),
			...(f1 && f2 ? [make(both(f1, f2))] : [])
		],
		tests,
		edge
	};
}

interface Pair {
	a: string;
	b: string;
	join: 'E' | 'O';
	ra: [number, number, number];
	rb: [number, number, number];
	yes: string;
	no: string;
	task: (p: number, q: number) => string;
}

const PAIRS: Pair[] = [
	{ a: 'altezza', b: 'eta', join: 'E', ra: [100, 5, 9], rb: [6, 1, 7], yes: 'puoi salire', no: 'a terra', task: (p, q) => `legge l'altezza in centimetri e l'età di un bambino e scrive "puoi salire" se il bambino è alto almeno ${p} centimetri e ha almeno ${q} anni, altrimenti scrive "a terra"` },
	{ a: 'voto', b: 'presenze', join: 'E', ra: [5, 1, 3], rb: [15, 1, 11], yes: 'ammesso', no: 'non ammesso', task: (p, q) => `legge il voto e le presenze di uno studente e scrive "ammesso" se il voto è almeno ${p} e le presenze sono almeno ${q}, altrimenti scrive "non ammesso"` },
	{ a: 'monete', b: 'livello', join: 'E', ra: [20, 10, 8], rb: [2, 1, 8], yes: 'comprata', no: 'niente spada', task: (p, q) => `legge le monete e il livello di un giocatore e scrive "comprata" se il giocatore ha almeno ${p} monete ed è almeno al livello ${q}, altrimenti scrive "niente spada"` },
	{ a: 'eta', b: 'soldi', join: 'E', ra: [12, 1, 7], rb: [10, 5, 7], yes: 'parti', no: 'resti a casa', task: (p, q) => `legge l'età e i soldi di un ragazzo e scrive "parti" se il ragazzo ha almeno ${p} anni e almeno ${q} euro, altrimenti scrive "resti a casa"` },
	{ a: 'voto', b: 'bonus', join: 'O', ra: [7, 1, 3], rb: [10, 5, 5], yes: 'premio', no: 'niente', task: (p, q) => `legge il voto e i punti bonus di uno studente e scrive "premio" se il voto è almeno ${p} oppure i punti bonus sono almeno ${q}, altrimenti scrive "niente"` },
	{ a: 'spesa', b: 'punti', join: 'O', ra: [40, 10, 6], rb: [100, 50, 5], yes: 'sconto', no: 'prezzo pieno', task: (p, q) => `legge la spesa e i punti della tessera di un cliente e scrive "sconto" se il cliente ha speso almeno ${p} euro oppure ha almeno ${q} punti, altrimenti scrive "prezzo pieno"` },
	{ a: 'stelle', b: 'chiavi', join: 'O', ra: [3, 1, 7], rb: [2, 1, 4], yes: 'porta aperta', no: 'porta chiusa', task: (p, q) => `legge le stelle e le chiavi di un giocatore e scrive "porta aperta" se il giocatore ha almeno ${p} stelle oppure almeno ${q} chiavi, altrimenti scrive "porta chiusa"` }
];

/** Two values read, each compared with its threshold, joined by E or by O. */
export function pairOf(rng: Rng, joins: ('E' | 'O')[] = ['E', 'O']): Compound {
	const s = rng.pick(PAIRS.filter((x) => joins.includes(x.join)));
	const p = s.ra[0] + s.ra[1] * rng.int(0, s.ra[2] - 1);
	const q = s.rb[0] + s.rb[1] * rng.int(0, s.rb[2] - 1);
	const tests = [
		[p, q],
		[p - 1, q],
		[p, q - 1],
		[p - 1, q - 1],
		[p + rng.int(1, 9), q + rng.int(1, 9)]
	];
	return compound(s.join === 'E' ? 'e' : 'o', s.task(p, q), [s.a, s.b], { l: s.a, op: '>=', r: p }, { l: s.b, op: '>=', r: q }, s.join, s.yes, s.no, tests, s.join === 'E' ? tests.slice(0, 3) : tests.slice(1, 4));
}

/** One value read, too low or too high: two comparisons joined by O. */
export function outside(rng: Rng): Compound {
	if (rng.next() < 0.5) {
		const a = rng.int(10, 14);
		const b = rng.int(60, 70);
		return compound('o', `legge l'età di uno spettatore e scrive "ridotto" se lo spettatore ha meno di ${a} anni oppure ne ha almeno ${b}, altrimenti scrive "intero"`, ['eta'], { l: 'eta', op: '<', r: a }, { l: 'eta', op: '>=', r: b }, 'O', 'ridotto', 'intero', [[a - 1], [a], [b - 1], [b], [rng.int(20, 50)]], [[a], [b]]);
	}
	const a = rng.int(2, 8);
	const b = rng.int(30, 40);
	return compound('o', `legge la temperatura di una serra in gradi e scrive "allarme" se ci sono meno di ${a} gradi oppure più di ${b}, altrimenti scrive "tutto bene"`, ['gradi'], { l: 'gradi', op: '<', r: a }, { l: 'gradi', op: '>', r: b }, 'O', 'allarme', 'tutto bene', [[a - 1], [a], [b], [b + 1], [rng.int(12, 25)]], [[a], [b]]);
}

/** One value read that must be one of two: two `==` joined by O. */
export function oneOfTwo(rng: Rng): Compound {
	const d1 = rng.int(1, 6);
	const d2 = rng.int(d1 + 1, 7);
	const others = [1, 2, 3, 4, 5, 6, 7].filter((d) => d !== d1 && d !== d2);
	const o1 = rng.pick(others);
	const o2 = rng.pick(others.filter((d) => d !== o1));
	return compound('o', `legge il numero di un giorno della settimana, da 1 a 7, e scrive "chiuso" se è il giorno ${d1} oppure il giorno ${d2}, altrimenti scrive "aperto"`, ['giorno'], { l: 'giorno', op: '==', r: d1 }, { l: 'giorno', op: '==', r: d2 }, 'O', 'chiuso', 'aperto', [[d1], [d2], [o1], [o2]], [[d1], [d2]]);
}

interface Range {
	v: string;
	what: string;
	lo: [number, number];
	width: [number, number];
	yes: string;
	no: string;
}

const RANGES: Range[] = [
	{ v: 'voto', what: 'un voto', lo: [1, 1], width: [9, 9], yes: 'valido', no: 'non valido' },
	{ v: 'mese', what: 'il numero di un mese', lo: [1, 1], width: [11, 11], yes: 'valido', no: 'non valido' },
	{ v: 'ora', what: "l'ora di un orologio, da 0 a 23,", lo: [7, 10], width: [8, 12], yes: 'aperto', no: 'chiuso' },
	{ v: 'eta', what: "l'età di una persona", lo: [14, 19], width: [8, 50], yes: 'iscritto', no: 'non iscritto' },
	{ v: 'n', what: 'un numero intero', lo: [2, 20], width: [5, 40], yes: 'dentro', no: 'fuori' },
	{ v: 'gradi', what: 'la temperatura di una stanza in gradi', lo: [16, 19], width: [2, 6], yes: 'giusta', no: 'da regolare' }
];

/** One value read that must lie between two bounds, both included: two comparisons joined by E. */
export function interval(rng: Rng): Compound {
	const s = rng.pick(RANGES);
	const lo = rng.int(s.lo[0], s.lo[1]);
	const hi = lo + rng.int(s.width[0], s.width[1]);
	return compound('intervallo', `legge ${s.what} e scrive "${s.yes}" se è compreso tra ${lo} e ${hi}, estremi inclusi, altrimenti scrive "${s.no}"`, [s.v], { l: lo, op: '<=', r: s.v }, { l: s.v, op: '<=', r: hi }, 'E', s.yes, s.no, [[lo - 1], [lo], [rng.int(lo + 1, hi - 1)], [hi], [hi + 1]], [[lo], [hi]]);
}

/** A cascade: selections one in the "no" of the other, so three or four ways. */
export interface Cascade extends Sel {
	/** What each way writes, in the order of the conditions; the last is the way of the final "altrimenti". */
	outs: (string | number)[];
	/** The same selections with a typical mistake, for "che cosa scrive davvero": the conditions in the wrong order, an `if` on every row. */
	bugs: { ordine: string; 'tanti-if': string };
}

const nest = (conds: string[], outs: (string | number)[]): string[] => (conds.length === 0 ? [say(outs[0])] : se(conds[0], [say(outs[0])], nest(conds.slice(1), outs.slice(1))));

/** The same selections without the final "altrimenti". */
const open = (conds: string[], outs: (string | number)[]): string[] => (conds.length === 1 ? se(conds[0], [say(outs[0])]) : se(conds[0], [say(outs[0])], open(conds.slice(1), outs.slice(1))));

/**
 * A cascade from its conditions and what each way writes. `last` is the condition of the final way, written out,
 * for the mistake of an `if` on every row.
 */
function cascade(family: string, task: string, reads: string[], conds: string[], last: string, outs: (string | number)[], flips: string[], tests: number[][], edge: number[][]): Cascade {
	const n = conds.length;
	const make = (cs: string[], os: (string | number)[]) => program(reads, nest(cs, os));
	const separate = program(reads, [...conds.flatMap((c, i) => se(c, [say(outs[i])])), ...se(last, [say(outs[n])])]);
	const reversed = make([...conds].reverse(), [...outs.slice(0, n).reverse(), outs[n]]);
	return {
		family,
		task,
		reads,
		source: make(conds, outs),
		conds,
		why: `Le condizioni si controllano una dopo l'altra, e la seconda solo quando la prima è falsa: prima ${tt(conds[0])}, poi ${tt(conds[1])}${n === 3 ? `, poi ${tt(conds[2])}` : ''}.`,
		outs,
		bugs: { ordine: reversed, 'tanti-if': separate },
		wrong: [
			reversed,
			separate,
			// the first selection on its own, then the rest: the "altrimenti" belongs to the second `se` only
			program(reads, [...se(conds[0], [say(outs[0])]), ...nest(conds.slice(1), outs.slice(1))]),
			...flips.map((c, i) => make(conds.map((old, j) => (i === j ? c : old)), outs)),
			make(conds, [outs[1], outs[0], ...outs.slice(2)]),
			// the last way written after the selections, for everybody
			program(reads, [...open(conds, outs), say(outs[n])])
		],
		tests,
		edge
	};
}

interface Bands {
	v: string;
	what: string;
	/** Labels from the highest band to the lowest: three and four ways. */
	three: [string, string, string];
	four: [string, string, string, string];
	/** The thresholds, from the highest down: three of them, at least two apart. */
	thresholds: (rng: Rng) => [number, number, number];
	/** The largest value that makes sense. */
	max: number;
}

const BANDS: Bands[] = [
	{ v: 'punti', what: 'i punti di un atleta', three: ['oro', 'argento', 'niente'], four: ['oro', 'argento', 'bronzo', 'niente'], thresholds: (rng) => down(rng, 5 * rng.int(16, 19), [10, 15, 20]), max: 200 },
	{ v: 'livello', what: 'il livello di un giocatore, da 1 a 50,', three: ['esperto', 'medio', 'novizio'], four: ['maestro', 'esperto', 'medio', 'novizio'], thresholds: (rng) => down(rng, rng.int(30, 42), [8, 10, 12]), max: 50 },
	{ v: 'gradi', what: 'la temperatura di una giornata in gradi', three: ['caldo', 'mite', 'freddo'], four: ['torrido', 'caldo', 'mite', 'freddo'], thresholds: (rng) => down(rng, rng.int(28, 36), [5, 6, 7, 8]), max: 45 },
	{ v: 'carica', what: 'la carica di una batteria, da 0 a 100,', three: ['piena', 'media', 'scarica'], four: ['piena', 'media', 'bassa', 'scarica'], thresholds: (rng) => down(rng, 10 * rng.int(7, 9), [20, 30]), max: 100 },
	{ v: 'media', what: 'la media di una squadra, da 0 a 100,', three: ['promossa', 'sospesa', 'bocciata'], four: ['coppa', 'promossa', 'sospesa', 'bocciata'], thresholds: (rng) => down(rng, rng.int(70, 90), [8, 12, 15, 25]), max: 100 }
];

function down(rng: Rng, top: number, gaps: number[]): [number, number, number] {
	const mid = top - rng.pick(gaps);
	return [top, mid, mid - rng.pick(gaps)];
}

/** Bands of a value: thresholds from the highest down with `>=`, or from the lowest up with `<`. */
export function bands(rng: Rng, ways: 3 | 4): Cascade {
	const s = rng.pick(BANDS);
	const all = s.thresholds(rng);
	const labels = ways === 3 ? s.three : s.four;
	const ts = ways === 3 ? (rng.next() < 0.5 ? [all[0], all[1]] : [all[1], all[2]]) : all;
	const top = ts[0];
	const bottom = ts[ts.length - 1];
	const points = [[Math.min(top + rng.int(1, 5), s.max)], ...ts.flatMap((t) => [[t], [t - 1]]), [bottom - rng.int(2, 4)]];
	const edge = ts.map((t) => [t]);
	const middle = ts.slice(0, -1).map((t, i) => `"${labels[i + 1]}" da ${ts[i + 1]} a ${t - 1}`);
	if (rng.next() < 0.5) {
		const task = `legge ${s.what} e scrive "${labels[0]}" da ${top} in su, ${middle.join(', ')}, "${labels[ways - 1]}" sotto ${bottom}`;
		return cascade(
			'fasce',
			task,
			[s.v],
			ts.map((t) => `${s.v} >= ${t}`),
			`${s.v} < ${bottom}`,
			labels,
			ts.map((t) => `${s.v} > ${t}`),
			points,
			edge
		);
	}
	const up = [...ts].reverse();
	const task = `legge ${s.what} e scrive "${labels[ways - 1]}" sotto ${bottom}, ${[...middle].reverse().join(', ')}, "${labels[0]}" da ${top} in su`;
	return cascade(
		'fasce',
		task,
		[s.v],
		up.map((t) => `${s.v} < ${t}`),
		`${s.v} >= ${top}`,
		[...labels].reverse(),
		up.map((t) => `${s.v} <= ${t}`),
		points,
		edge
	);
}

/** The price of a ticket by age: thresholds from the lowest up with `<`, numbers written. */
export function ticket(rng: Rng): Cascade {
	const a = rng.int(4, 8);
	const b = rng.int(14, 18);
	const prices = [rng.pick([0, 2, 3]), rng.pick([5, 6, 7]), rng.pick([10, 12, 15])];
	return cascade(
		'fasce',
		`legge l'età di un visitatore e scrive il prezzo del biglietto in euro: ${prices[0]} sotto i ${a} anni, ${prices[1]} da ${a} a ${b - 1} anni, ${prices[2]} da ${b} anni in su`,
		['eta'],
		[`eta < ${a}`, `eta < ${b}`],
		`eta >= ${b}`,
		prices,
		[`eta <= ${a}`, `eta <= ${b}`],
		[[a - 1], [a], [b - 1], [b], [b + rng.int(3, 30)]],
		[[a], [b]]
	);
}

const SIGNS: { v: string; what: string; outs: [string, string, string] }[] = [
	{ v: 'gradi', what: 'una temperatura in gradi', outs: ['sopra', 'sotto', 'zero'] },
	{ v: 'saldo', what: 'il saldo di un conto in euro', outs: ['attivo', 'passivo', 'zero'] },
	{ v: 'n', what: 'un numero intero', outs: ['positivo', 'negativo', 'zero'] },
	{ v: 'quota', what: "la quota di un luogo rispetto al livello del mare, in metri,", outs: ['sopra', 'sotto', 'al mare'] }
];

/** Above zero, below zero or zero: the second selection in the "no" of the first. */
export function sign(rng: Rng): Cascade {
	const s = rng.pick(SIGNS);
	const [plus, minus, zero] = s.outs;
	const up = rng.next() < 0.5;
	const conds = up ? [`${s.v} > 0`, `${s.v} < 0`] : [`${s.v} < 0`, `${s.v} > 0`];
	const outs = up ? [plus, minus, zero] : [minus, plus, zero];
	const p = rng.int(2, 30);
	const m = -rng.int(2, 30);
	return cascade('segno', `legge ${s.what} e scrive "${plus}" se è maggiore di zero, "${minus}" se è minore di zero, "${zero}" se è proprio zero`, [s.v], conds, `${s.v} == 0`, outs, up ? [`${s.v} >= 0`, `${s.v} <= 0`] : [`${s.v} <= 0`, `${s.v} >= 0`], [[p], [m], [0], [1], [-1]], [[0]]);
}

const DUELS: { a: string; b: string; what: string; outs: [string, string, string] }[] = [
	{ a: 'a', b: 'b', what: 'due numeri interi', outs: ['primo', 'secondo', 'pari'] },
	{ a: 'x', b: 'y', what: 'due numeri interi', outs: ['primo', 'secondo', 'uguali'] },
	{ a: 'casa', b: 'ospiti', what: 'i gol della squadra di casa e quelli degli ospiti', outs: ['casa', 'ospiti', 'pareggio'] },
	{ a: 'rossi', b: 'blu', what: 'i punti della squadra rossa e quelli della squadra blu', outs: ['rossi', 'blu', 'pareggio'] }
];

/** Which of two numbers is the larger, or that they are the same. */
export function duel(rng: Rng): Cascade {
	const s = rng.pick(DUELS);
	const [first, second, same] = s.outs;
	const start = rng.next() < 0.5;
	const conds = start ? [`${s.a} > ${s.b}`, `${s.a} < ${s.b}`] : [`${s.a} < ${s.b}`, `${s.a} > ${s.b}`];
	const outs = start ? [first, second, same] : [second, first, same];
	const low = rng.int(0, 6);
	const high = low + rng.int(1, 6);
	const tie = rng.int(0, 9);
	return cascade(
		'confronto',
		`legge ${s.what} e scrive "${first}" se il maggiore è il primo numero letto, "${second}" se è il secondo, "${same}" se sono lo stesso numero`,
		[s.a, s.b],
		conds,
		`${s.a} == ${s.b}`,
		outs,
		start ? [`${s.a} >= ${s.b}`, `${s.a} <= ${s.b}`] : [`${s.a} <= ${s.b}`, `${s.a} >= ${s.b}`],
		[
			[high, low],
			[low, high],
			[tie, tie]
		],
		[[tie, tie]]
	);
}

/** Whether a selection can be offered as four charts: its own chart and those of three of its mistakes fit an option. */
export const chartable = (s: Sel) => fits(s.source) && wrongPrograms(s.source, s.wrong.filter(fits), s.tests).length >= 3;

/** The wrong programs of a sample: `count` that write something else than the right one on its tests, the typical mistake first. */
export function mistakes(rng: Rng, s: Sel, count = 3, keep: (source: string) => boolean = () => true): string[] {
	const wrong = wrongPrograms(s.source, [s.wrong[0], ...shuffle(rng, s.wrong.slice(1))].filter(keep), s.tests);
	if (wrong.length < count) throw new Error(`inf-sel: only ${wrong.length} wrong programs for\n${s.source}`);
	return wrong.slice(0, count);
}

/**
 * "Che cosa scrive?" as a choice: what `source` writes on `inputs`, then what the wrong programs write on the same
 * inputs (the mistakes a student makes reading it), then what the program writes on its other tests, both, nothing.
 */
export function writtenChoice(rng: Rng, s: Sel, inputs: number[], source = s.source, more: string[][] = []): ChoiceAnswer {
	const right = output(source, inputs);
	if (!right) throw new Error(`inf-sel: the program does not end on ${inputs.join(', ')}\n${source}`);
	const byMistake = [s.source, ...s.wrong].map((w) => output(w, inputs)).filter((w): w is string[] => w !== null);
	const elsewhere = s.tests.map((t) => output(s.source, t)).filter((w): w is string[] => w !== null);
	const other = elsewhere.find((w) => w.join('\n') !== right.join('\n')) ?? [];
	return choose(rng, writtenOption(right), [...more, ...byMistake, ...shuffle(rng, elsewhere), [...right, ...other], [...other, ...right], []].map(writtenOption));
}

/** The label of some inputs as an option: "130 e 7". */
export const inputOption = (inputs: number[]): ChoiceOption => ({ latex: inputs.join(' e '), values: [inputs.join(',')], text: inputs.join(' e ') });

/**
 * "Con quale ingresso scrive X?": one of `pool` that makes the program write `target` and three that do not. Null
 * when the pool has no such four.
 */
export function inputChoice(rng: Rng, source: string, pool: number[][], target: string): ChoiceAnswer | null {
	const distinct = pool.filter((t, i) => pool.findIndex((u) => u.join(',') === t.join(',')) === i);
	const hits = distinct.filter((t) => (output(source, t) ?? []).join('\n') === target);
	const misses = distinct.filter((t) => (output(source, t) ?? []).join('\n') !== target);
	if (hits.length < 1 || misses.length < 3) return null;
	return choose(rng, inputOption(rng.pick(hits)), shuffle(rng, misses).map(inputOption));
}

export const MAX_COLUMNS = 34;
/** The rows of the C++ are longer (`cout << ... << endl;`): an option shows 39 columns of it without scrolling. */
export const MAX_CPP_COLUMNS = 39;
export const MAX_ROWS = 9;

/**
 * What every sample of these generators is checked for, beyond `makeGenerator`: the reference program writes the
 * same in the chart, in Python and in C++ and ends on every test; so does every option that is a program; a
 * program among the options fits a phone (rows and columns of its Python); a chart among the options has one
 * selection; the tests of an open answer do not all write the same.
 */
export function sound(sample: Sample): string[] {
	const errors: string[] = [];
	const source = sample.params.source as string | undefined;
	const tests = (sample.params.tests as number[][] | undefined) ?? [[]];
	if (source !== undefined) {
		const why = plain(source, tests[0]);
		if (why) errors.push(`the program ${why}`);
		if (tests.some((t) => !output(source, t))) errors.push('the program does not end on a test');
	}
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const option of choice?.options ?? []) {
		if (option.chart === undefined && !option.code) continue;
		const why = plain(option.values[0], tests[0]);
		if (why) errors.push(`an option ${why}`);
		if (option.code) {
			const rows = option.code.python.trimEnd().split('\n');
			if (rows.length > MAX_ROWS) errors.push(`an option of ${rows.length} rows`);
			if (rows.some((row) => row.length > MAX_COLUMNS)) errors.push(`an option with a row of ${Math.max(...rows.map((row) => row.length))} columns`);
			const wide = Math.max(...option.code.cpp.split('\n').map((row) => row.length));
			if (wide > MAX_CPP_COLUMNS) errors.push(`an option with a row of ${wide} columns in C++`);
		}
		if (option.chart !== undefined && option.chart.split('\n').filter((row) => /^\s*se\s/.test(row)).length > 1) errors.push('a chart among the options with two selections');
		if (option.chart !== undefined && !fits(option.chart)) errors.push(`a chart among the options ${chartWidth(option.chart)} px wide`);
	}
	if (sample.answer.kind === 'chart' || sample.answer.kind === 'program') {
		const written = sample.answer.tests.map((t) => JSON.stringify(t.output));
		if (written.length < 2 || new Set(written).size < 2) errors.push('the tests of the open answer do not take different branches');
	}
	return errors;
}

/** The parameters every sample with a program carries for the independent check. */
export const paramsOf = (s: Sel, extra: Record<string, unknown> = {}) => ({ case: s.family, source: s.source, tests: s.tests, edge: s.edge, ...extra });

/**
 * How a run goes through the selections of a cascade (one selection is a cascade of one): each condition with the
 * values in place of the names, down to the first that is true.
 */
export function followed(s: Sel, inputs: number[]): string[] {
	const steps: string[] = [];
	for (const [i, cond] of s.conds.entries()) {
		const value = truth(cond, s.reads, inputs);
		steps.push(`${i === 0 ? 'Con' : 'Poi, con'} ${s.reads.map((name, j) => `${name} che vale ${inputs[j]}`).join(' e ')}, la condizione ${tt(cond)} diventa ${tt(filled(cond, s.reads, inputs))}: è ${trueOrFalse(value)}.`);
		if (value) break;
	}
	return steps;
}

/** What a program writes, said in a sentence. */
export const said = (written: string[]) => (written.length ? written.join(', ') : 'non scrive niente');
