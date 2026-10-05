/**
 * Operatori ed espressioni. Spec: specs/exercises/inf-espressioni.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/54-inf-espressioni.md). The programs are sequences
 * with whole numbers that are never negative, `+ - *`, `//` and `%`, written once in the language of the flowcharts
 * (v2/inf-programmi.ts). The division `/`, the decimals and the powers print different things in Python and in C++:
 * level 4, which is about them, is a choice of text options that says which language it speaks of, and its
 * instructions are written by hand, not by `codes`.
 *
 * 1. the order of the calculations; 2. quotient or remainder; 3. a program that splits a number with the two;
 * 4. the division in the two languages; 5. build the flowchart; 6. write the program.
 */
import { chartAnswer, chartOption, choose, codeOption, codes, lines, makeGenerator, output, programAnswer, textOption, type Built } from '../inf-programmi';
import { mistakes, said, sound } from '../inf-primi';
import type { Rng, Sample } from '../types';

export const ID = 'inf-espressioni';

// ---------------------------------------------------------------------------
// Level 1: the order of the calculations

const VARS: [string, string][] = [
	['a', 'b'],
	['x', 'y'],
	['base', 'altezza'],
	['m', 'n']
];

/** An expression of two variables and a number, its value, the value with the other grouping, and how it is worked out. */
interface Shape {
	brackets: boolean;
	/** A, B, K are in order the two variables and the number. */
	ok(A: number, B: number, K: number): boolean;
	text(a: string, b: string, K: number): string;
	value(A: number, B: number, K: number): number;
	other(A: number, B: number, K: number): number;
	why(A: number, B: number, K: number): string;
}

const first = 'La moltiplicazione viene prima';
const SHAPES: Shape[] = [
	{ brackets: false, ok: () => true, text: (a, b, K) => `${K} * ${a} + ${b}`, value: (A, B, K) => K * A + B, other: (A, B, K) => K * (A + B), why: (A, B, K) => `${first} dell'addizione: $${K} \\cdot ${A} = ${K * A}$, poi $${K * A} + ${B} = ${K * A + B}$.` },
	{ brackets: false, ok: () => true, text: (a, b, K) => `${a} + ${b} * ${K}`, value: (A, B, K) => A + B * K, other: (A, B, K) => (A + B) * K, why: (A, B, K) => `${first} dell'addizione, anche se è scritta dopo: $${B} \\cdot ${K} = ${B * K}$, poi $${A} + ${B * K} = ${A + B * K}$.` },
	{ brackets: false, ok: (A, B, K) => A > B * K, text: (a, b, K) => `${a} - ${b} * ${K}`, value: (A, B, K) => A - B * K, other: (A, B, K) => (A - B) * K, why: (A, B, K) => `${first} della sottrazione: $${B} \\cdot ${K} = ${B * K}$, poi $${A} - ${B * K} = ${A - B * K}$.` },
	{ brackets: false, ok: (A, B, K) => A > B + K, text: (a, b, K) => `${a} - ${b} + ${K}`, value: (A, B, K) => A - B + K, other: (A, B, K) => A - (B + K), why: (A, B, K) => `Addizione e sottrazione sono dello stesso livello: si va da sinistra a destra. $${A} - ${B} = ${A - B}$, poi $${A - B} + ${K} = ${A - B + K}$.` },
	{ brackets: true, ok: () => true, text: (a, b, K) => `${K} * (${a} + ${b})`, value: (A, B, K) => K * (A + B), other: (A, B, K) => K * A + B, why: (A, B, K) => `Le parentesi si calcolano per prime: $${A} + ${B} = ${A + B}$, poi $${K} \\cdot ${A + B} = ${K * (A + B)}$.` },
	{ brackets: true, ok: (A, B) => A > B, text: (a, b, K) => `(${a} - ${b}) * ${K}`, value: (A, B, K) => (A - B) * K, other: (A, B, K) => A - B * K, why: (A, B, K) => `Le parentesi si calcolano per prime: $${A} - ${B} = ${A - B}$, poi $${A - B} \\cdot ${K} = ${(A - B) * K}$.` },
	{ brackets: true, ok: (A, B, K) => B > K && A > B, text: (a, b, K) => `${a} - (${b} - ${K})`, value: (A, B, K) => A - (B - K), other: (A, B, K) => A - B - K, why: (A, B, K) => `Le parentesi si calcolano per prime: $${B} - ${K} = ${B - K}$, poi $${A} - ${B - K} = ${A - (B - K)}$.` }
];

function level1(rng: Rng): Built {
	const [a, b] = rng.pick(VARS);
	for (;;) {
		const shape = rng.pick(SHAPES);
		const A = rng.int(2, 19);
		const B = rng.int(2, 9);
		const K = rng.int(2, 5);
		if (!shape.ok(A, B, K) || A === B) continue;
		const value = shape.value(A, B, K);
		const other = shape.other(A, B, K);
		if (other === value) continue;
		const source = lines(`${a} = ${A}`, `${b} = ${B}`, `scrivi ${shape.text(a, b, K)}`);
		const o = (x: number) => textOption(String(x));
		return {
			prompt: "Calcola rispettando l'ordine delle operazioni.",
			problem: 'Che cosa scrive questo programma?',
			code: codes(source),
			solution: String(value),
			steps: [`Con ${a} = ${A} e ${b} = ${B} l'espressione è $${shape.text(String(A), String(B), K).replaceAll('*', '\\cdot')}$.`, shape.why(A, B, K), 'Le precedenze sono quelle della matematica; solo le parentesi cambiano l\'ordine.'],
			answer: choose(rng, o(value), [other, A + B + K, A * B + K, A + B * K, (A + B) * K, value + K, value + 1, value - 1].filter((x) => x >= 0).map(o)),
			params: { case: shape.brackets ? 'con parentesi' : 'senza parentesi', source, tests: [[]] }
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: quotient or remainder

const SHARES: [string, string][] = [
	['caramelle', 'amici'],
	['figurine', 'pagine'],
	['studenti', 'squadre'],
	['biscotti', 'sacchetti'],
	['euro', 'persone'],
	['carte', 'giocatori']
];

/** A decimal as a program prints it, when it has at most two digits after the point; otherwise nothing. */
const decimal = (n: number, d: number) => ((n * 100) % d === 0 ? String(n / d) : null);

function level2(rng: Rng): Built {
	const [what, among] = rng.pick(SHARES);
	const d = rng.int(3, 9);
	const r = rng.int(1, d - 1);
	// a quotient equal to the remainder would not tell which of the two the program writes
	const q = ((r - 2 + rng.int(1, 7) + 8) % 8) + 2;
	const n = d * q + r;
	const rest = rng.next() < 0.5;
	const source = lines(`${what} = ${n}`, `${among} = ${d}`, `scrivi ${what} ${rest ? '%' : '//'} ${among}`);
	const right = rest ? r : q;
	const others = [String(rest ? q : r), decimal(n, d), String(q + 1), String(d - r), String(n - d), String(d), String(right + 2)].filter((x): x is string => x !== null);
	return {
		prompt: 'Distingui il quoziente dal resto.',
		problem: 'Che cosa scrive questo programma?',
		code: codes(source),
		solution: String(right),
		steps: [`La divisione intera di ${n} per ${d} dà due numeri: $${n} = ${d} \\cdot ${q} + ${r}$.`, `Il quoziente è ${q} e il resto è ${r}.`, rest ? 'Il programma calcola il resto, con il segno %.' : 'Il programma calcola il quoziente intero: scarta quello che avanza e non scrive cifre dopo la virgola.'],
		answer: choose(
			rng,
			textOption(String(right)),
			others.map((x) => textOption(x))
		),
		params: { case: rest ? 'resto' : 'quoziente', source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// Splitting a number in parts: levels 3, 5 and 6

/** A total split by a divisor: the names of the variables and how the exercise says the three things. */
const PARTS: { total: string; k: number; q: string; r: string; a: string; qs: string; rs: string }[] = [
	{ total: 'minuti', k: 60, q: 'ore', r: 'resto', a: 'una durata in minuti', qs: 'le ore intere', rs: 'i minuti che avanzano' },
	{ total: 'uova', k: 6, q: 'scatole', r: 'avanzo', a: 'un numero di uova', qs: 'quante scatole da 6 si riempiono', rs: 'quante uova avanzano' },
	{ total: 'giorni', k: 7, q: 'settimane', r: 'resto', a: 'un numero di giorni', qs: 'le settimane intere', rs: 'i giorni che avanzano' },
	{ total: 'secondi', k: 60, q: 'minuti', r: 'resto', a: 'una durata in secondi', qs: 'i minuti interi', rs: 'i secondi che avanzano' },
	{ total: 'centesimi', k: 100, q: 'euro', r: 'resto', a: 'una somma in centesimi', qs: 'gli euro interi', rs: 'i centesimi che avanzano' },
	{ total: 'pastelli', k: 12, q: 'scatole', r: 'avanzo', a: 'un numero di pastelli', qs: 'quante scatole da 12 si riempiono', rs: 'quanti pastelli avanzano' }
];

/** A total with a quotient of at least 2 and a remainder that is neither zero nor the quotient. */
function total(rng: Rng, k: number): number {
	for (;;) {
		const q = rng.int(2, 9);
		const r = rng.int(1, k - 1);
		if (q !== r) return k * q + r;
	}
}

function level3(rng: Rng): Built {
	if (rng.next() < 0.4) {
		const tens = rng.int(1, 9);
		const units = ((tens - 1 + rng.int(1, 8)) % 9) + 1;
		const n = tens * 10 + units;
		const turned = rng.next() < 0.5;
		const source = lines(`n = ${n}`, 'decine = n // 10', 'unita = n % 10', turned ? 'scrivi unita * 10 + decine' : 'scrivi decine + unita');
		const right = turned ? units * 10 + tens : tens + units;
		const o = (x: number) => textOption(String(x));
		return {
			prompt: 'Segui il programma con una tabella di traccia.',
			problem: 'Che cosa scrive questo programma?',
			code: codes(source),
			solution: String(right),
			steps: [`Il quoziente di ${n} diviso 10 toglie l'ultima cifra: decine vale ${tens}.`, `Il resto di ${n} diviso 10 è l'ultima cifra: unita vale ${units}.`, turned ? `Il programma scrive $${units} \\cdot 10 + ${tens} = ${right}$: il numero con le cifre scambiate.` : `Il programma scrive $${tens} + ${units} = ${right}$: la somma delle cifre.`],
			answer: choose(rng, o(right), [turned ? tens + units : units * 10 + tens, n, tens * units, units * (10 + tens), tens, units, right + 1].map(o)),
			params: { case: 'cifre', source, tests: [[]] }
		};
	}
	const p = rng.pick(PARTS);
	const n = total(rng, p.k);
	const q = Math.floor(n / p.k);
	const r = n % p.k;
	const source = lines(`${p.total} = ${n}`, `${p.q} = ${p.total} // ${p.k}`, `${p.r} = ${p.total} % ${p.k}`, `scrivi ${p.q}`, `scrivi ${p.r}`);
	const o = (pair: number[]) => textOption(said(pair.map(String)), pair.join('\n'));
	return {
		prompt: 'Segui il programma con una tabella di traccia.',
		problem: 'Che cosa scrive questo programma? Nelle risposte la virgola separa una riga dalla successiva.',
		code: codes(source),
		solution: said([String(q), String(r)]),
		steps: [`La divisione intera di ${n} per ${p.k} è $${n} = ${p.k} \\cdot ${q} + ${r}$.`, `Il quoziente, ${q}, finisce in ${p.q}; il resto, ${r}, finisce in ${p.r}.`, `Il programma scrive prima ${p.q} e poi ${p.r}.`],
		answer: choose(
			rng,
			o([q, r]),
			[
				[r, q],
				[q + 1, r],
				[q, n - p.k],
				[q, q],
				[r, r],
				[q, p.k - r]
			].map(o)
		),
		params: { case: 'parti', source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the division in the two languages

function level4(rng: Rng): Built {
	const kind = rng.pick(['py-divisione', 'py-esatta', 'py-quoziente', 'cpp-interi', 'cpp-virgola', 'cpp-esatta', 'py-potenza'] as const);
	const python = kind.startsWith('py');
	const say = (expr: string) => (python ? `In Python, che cosa stampa l'istruzione «print(${expr})»?` : `In C++, che cosa stampa l'istruzione «cout << ${expr} << endl;»?`);
	const built = (expr: string, right: string, others: string[], steps: string[]): Built => ({
		prompt: 'Attenzione al linguaggio: qui Python e C++ non fanno la stessa cosa.',
		problem: say(expr),
		solution: right,
		steps,
		answer: choose(
			rng,
			textOption(right),
			others.map((x) => textOption(x))
		),
		params: { case: kind, language: python ? 'python' : 'cpp', expression: expr }
	});
	if (kind === 'py-potenza') {
		const base = rng.int(2, 5);
		const exp = rng.int(base === 2 ? 3 : 2, 4);
		const value = base ** exp;
		return built(
			`${base} ** ${exp}`,
			String(value),
			[String(base * exp), String(exp ** base), String(base + exp), `${base}${exp}`, String(value + base)],
			[`In Python il segno ** è la potenza: $${base}^{${exp}}$ è ${base} moltiplicato per se stesso ${exp} volte.`, `Il risultato è ${value}, e non $${base} \\cdot ${exp} = ${base * exp}$.`, 'In C++ questo segno non esiste: si usa pow(base, esponente).']
		);
	}
	const b = rng.pick([2, 4, 5]);
	const q = rng.int(2, 9);
	const exact = kind === 'py-esatta' || kind === 'cpp-esatta';
	const r = exact ? 0 : rng.int(1, b - 1);
	const a = b * q + r;
	const dec = String(a / b);
	if (kind === 'py-esatta')
		return built(
			`${a} / ${b}`,
			`${q}.0`,
			[String(q), '0', `${q}.5`, '0.0', String(q + 1)],
			['In Python il segno / dà sempre un numero con la virgola, anche quando la divisione non ha resto.', `Python stampa almeno una cifra dopo il punto: esce ${q}.0, non ${q}.`]
		);
	if (kind === 'cpp-esatta')
		return built(
			`${a}.0 / ${b}`,
			String(q),
			[`${q}.0`, '0', `${q}.5`, String(q + 1), String(a)],
			[`In C++ ${a}.0 è un numero con la virgola: la divisione dà il risultato con la virgola, che qui è ${q} esatto.`, `Il cout del C++ toglie gli zeri finali: stampa ${q}, non ${q}.0.`]
		);
	if (kind === 'py-divisione') return built(`${a} / ${b}`, dec, [String(q), String(r), String(q + 1), `${q}.0`, String(a)], ['In Python il segno / dà sempre il risultato con la virgola.', `$${a} : ${b}$ fa ${dec}: Python stampa ${dec}. Per il quoziente intero, ${q}, il segno è //.`]);
	if (kind === 'py-quoziente') return built(`${a} // ${b}`, String(q), [dec, String(r), String(q + 1), `${q}.0`, String(a)], ['In Python il segno // dà il quoziente della divisione intera.', `$${a} = ${b} \\cdot ${q} + ${r}$: il quoziente è ${q}. Il resto, ${r}, si calcola con %.`]);
	if (kind === 'cpp-interi') return built(`${a} / ${b}`, String(q), [dec, String(r), String(q + 1), `${q}.0`, String(a)], ['In C++ la divisione tra due interi dà un intero: il quoziente, senza le cifre dopo la virgola.', `$${a} = ${b} \\cdot ${q} + ${r}$: esce ${q}, non ${dec}. Per avere ${dec} almeno uno dei due numeri deve essere con la virgola.`]);
	return built(`${a}.0 / ${b}`, dec, [String(q), String(r), String(q + 1), `${q}.0`, String(a)], [`In C++ ${a}.0 è un numero con la virgola: basta questo perché la divisione dia il risultato con la virgola.`, `$${a} : ${b}$ fa ${dec}: esce ${dec}, non ${q}.`]);
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: build the chart, write the program

interface Calc {
	family: 'parti' | 'cifre' | 'perimetro' | 'resto' | 'sconto';
	task: string;
	source: string;
	wrong: string[];
	given: string;
	tests: number[][];
}

function parts(rng: Rng): Calc {
	const p = rng.pick(PARTS);
	const read = `leggi ${p.total}`;
	const make = (q: string, r: string, ...write: string[]) => lines(read, `${p.q} = ${q}`, `${p.r} = ${r}`, ...write);
	const both = [`scrivi ${p.q}`, `scrivi ${p.r}`];
	const far = p.k === 60 ? 100 : p.k === 100 ? 10 : 10;
	return {
		family: 'parti',
		task: `legge ${p.a}, un numero intero, e scrive su due righe ${p.qs} e ${p.rs}`,
		source: make(`${p.total} // ${p.k}`, `${p.total} % ${p.k}`, ...both),
		wrong: [
			make(`${p.total} % ${p.k}`, `${p.total} // ${p.k}`, ...both),
			make(`${p.total} // ${p.k}`, `${p.total} - ${p.k}`, ...both),
			make(`${p.total} // ${far}`, `${p.total} % ${far}`, ...both),
			make(`${p.total} // ${p.k}`, `${p.total} % ${p.k}`, both[1], both[0]),
			make(`${p.total} // ${p.k}`, `${p.total} // ${p.k}`, ...both),
			make(`${p.total} % ${p.k}`, `${p.total} % ${p.k}`, ...both),
			make(`${p.total} // ${p.k}`, `${p.q} % ${p.k}`, ...both)
		],
		given: lines(read),
		tests: [[total(rng, p.k)], [total(rng, p.k)], [rng.int(1, p.k - 1)]]
	};
}

function digits(rng: Rng): Calc {
	const kind = rng.pick(['somma', 'scambio', 'righe'] as const);
	const write = kind === 'somma' ? ['scrivi decine + unita'] : kind === 'scambio' ? ['scrivi unita * 10 + decine'] : ['scrivi decine', 'scrivi unita'];
	const make = (t: string, u: string, ...rows: string[]) => lines('leggi n', `decine = ${t}`, `unita = ${u}`, ...rows);
	const number = () => {
		const tens = rng.int(1, 9);
		return tens * 10 + ((tens - 1 + rng.int(1, 8)) % 9) + 1;
	};
	return {
		family: 'cifre',
		task: `legge un numero intero n di due cifre e scrive ${kind === 'somma' ? 'la somma delle sue cifre' : kind === 'scambio' ? 'il numero con le due cifre scambiate di posto' : 'su due righe la cifra delle decine e quella delle unità'}`,
		source: make('n // 10', 'n % 10', ...write),
		wrong: [
			make('n % 10', 'n // 10', ...write),
			make('n // 10', 'n - 10', ...write),
			make('n // 10', 'n // 10', ...write),
			make('n % 10', 'n % 10', ...write),
			make('n // 10', 'n % 10', kind === 'somma' ? 'scrivi decine * unita' : kind === 'scambio' ? 'scrivi unita + 10 * decine' : 'scrivi decine + unita'),
			make('n // 100', 'n % 100', ...write),
			make('n // 10', 'n % 10', 'scrivi decine')
		],
		given: lines('leggi n'),
		tests: [[number()], [number()], [rng.int(1, 9) * 10]]
	};
}

function perimeter(rng: Rng): Calc {
	const reads = ['leggi base', 'leggi altezza'];
	const make = (expr: string) => lines(...reads, `perimetro = ${expr}`, 'scrivi perimetro');
	const A = rng.int(3, 9);
	return {
		family: 'perimetro',
		task: "legge la base e l'altezza di un rettangolo, due numeri interi, e scrive il perimetro",
		source: make('2 * (base + altezza)'),
		wrong: [make('2 * base + altezza'), make('base + altezza * 2'), make('base + altezza'), make('2 * base * altezza'), make('base * altezza'), make('2 + base + altezza')],
		given: lines(...reads),
		tests: [
			[A, ((A - 3 + rng.int(1, 6)) % 7) + 3],
			[rng.int(10, 20), rng.int(1, 2)]
		]
	};
}

function change(rng: Rng): Calc {
	const k = rng.int(2, 6);
	const reads = ['leggi pagato', 'leggi prezzo'];
	const make = (expr: string) => lines(...reads, `resto = ${expr}`, 'scrivi resto');
	const price = () => {
		const p = rng.int(2, 9);
		return [p * k + rng.int(1, 9), p];
	};
	return {
		family: 'resto',
		task: `legge quanti euro hai dato alla cassa e il prezzo di un quaderno, due numeri interi, e scrive il resto che ricevi dopo aver comprato ${k} quaderni`,
		source: make(`pagato - prezzo * ${k}`),
		wrong: [make(`(pagato - prezzo) * ${k}`), make(`pagato * ${k} - prezzo`), make('pagato - prezzo'), make(`pagato - prezzo + ${k}`), make(`pagato + prezzo * ${k}`), make(`pagato - (prezzo + ${k})`)],
		given: lines(...reads),
		tests: [price(), price()]
	};
}

function discount(rng: Rng): Calc {
	const k = rng.int(2, 6);
	const reads = ['leggi prezzo', 'leggi sconto'];
	const make = (expr: string) => lines(...reads, `totale = ${expr}`, 'scrivi totale');
	const pair = () => {
		const s = rng.int(1, 5);
		return [s + rng.int(3, 12), s];
	};
	return {
		family: 'sconto',
		task: `legge il prezzo di un biglietto e lo sconto in euro su ogni biglietto, due numeri interi, e scrive quanto si paga per ${k} biglietti scontati`,
		source: make(`(prezzo - sconto) * ${k}`),
		wrong: [make(`prezzo - sconto * ${k}`), make(`prezzo * ${k} - sconto`), make(`(prezzo + sconto) * ${k}`), make('prezzo - sconto'), make(`prezzo * ${k}`), make(`(sconto - prezzo) * ${k}`)],
		given: lines(...reads),
		tests: [pair(), pair()]
	};
}

function calc(rng: Rng): Calc {
	for (;;) {
		const c = rng.pick([parts, parts, digits, perimeter, change, discount])(rng);
		// two tests that are the same would be one
		if (new Set(c.tests.map((t) => t.join())).size === c.tests.length) return c;
	}
}

const wrongOf = (c: Calc) => mistakes(ID, c.source, c.wrong, c.tests);
const params = (c: Calc) => ({ case: c.family, source: c.source, tests: c.tests });
const example = (c: Calc) => `Con ${c.tests[0].join(' e ')} deve scrivere ${said(output(c.source, c.tests[0]))}.`;
const how = (c: Calc) => (c.family === 'parti' || c.family === 'cifre' ? 'Il quoziente con //, il resto con %, e poi la scrittura.' : 'Le parentesi dove un\'addizione o una sottrazione va fatta prima della moltiplicazione.');
const hints = (c: Calc) =>
	c.family === 'parti' || c.family === 'cifre'
		? ['Il quoziente della divisione intera dice quante volte il divisore ci sta per intero; il resto dice che cosa avanza.', 'Nei blocchi e in Python il quoziente si scrive // e il resto %; in C++ il quoziente tra interi si scrive /.', 'Prova con un numero più piccolo del divisore: il quoziente deve essere 0.']
		: ['Scrivi il conto come lo faresti a mano, poi guarda quale operazione va fatta per prima.', 'La moltiplicazione viene prima di addizione e sottrazione: dove serve il contrario, metti le parentesi.', 'Controlla il risultato con i numeri dell\'esempio.'];

function level5(rng: Rng): Built {
	const c = calc(rng);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${c.task}. ${example(c)}`,
		solution: how(c),
		steps: hints(c),
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
		solution: how(c),
		steps: hints(c),
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

/** A sequence of whole numbers: no selection, no loop, and every value read is positive. */
const sequence = (sample: Sample) => {
	const errors = sound(sample);
	if (/^\s*(se|finché|altrimenti)\b/m.test(String(sample.params.source ?? ''))) errors.push('the program is not a sequence');
	for (const inputs of (sample.params.tests as number[][] | undefined) ?? []) if (inputs.some((v) => !Number.isInteger(v) || v < 0)) errors.push('a value read is not a whole number');
	return errors;
};

export default makeGenerator(ID, 'Operatori ed espressioni', {
	1: { label: "L'ordine dei calcoli", constraints: ['two variables and a number, two operations', 'with brackets in about 3 out of 7', 'the other grouping gives another value'], build: level1, check: sequence },
	2: { label: 'Quoziente o resto', constraints: ['a division between whole numbers with a remainder', 'the quotient or the remainder, about half each'], build: level2, check: sequence },
	3: { label: 'Spezzare un numero in parti', constraints: ['the digits of a number of two figures (about 4 in 10) or a total split by 6, 7, 12, 60, 100'], build: level3, check: sequence },
	4: { label: 'La divisione in Python e in C++', constraints: ['text options, the language is said', '/ and // in Python, / between integers and with a decimal in C++, ** in Python'], build: level4 },
	5: { label: 'Costruire il diagramma di un conto', constraints: ['graded by running the chart on two or three tests', '// and % only between numbers that are never negative'], build: level5, check: sequence },
	6: { label: 'Scrivere il programma di un conto', constraints: ['graded by running the program on two or three tests', 'the readings are given'], build: level6, check: sequence }
});
