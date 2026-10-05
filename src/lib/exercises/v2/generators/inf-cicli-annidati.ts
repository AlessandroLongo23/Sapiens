/**
 * Cicli annidati. Spec: specs/exercises/inf-cicli-annidati.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/63-inf-cicli-annidati.md). Two loops, one in the
 * body of the other, written once in the language of the flowcharts and shown with two `for` (v2/inf-iter.ts). A
 * drawing of characters is built there a row at a time in a text, because a flowchart cannot write without going
 * to a new line; the program shown draws it as the lesson does (`drawCodes`).
 *
 * 1. how many times the inner body runs; 2. what a small double loop writes; 3. an inner loop that depends on the
 * outer counter; 4. the rows of a drawing; 5. the two loops of a task, as programs to choose from or as a flowchart
 * to build; 6. write the two loops.
 */
import type { Rng, Sample } from '../types';
import { chartAnswer, codeOption, lines, makeGenerator, needing, output, plain, programAnswer, textOption, writtenOption, type Built } from '../inf-programmi';
import { counted, drawCodes, fits, forCodes, inside, options, Retry, retrying, wrongOnes, type Count } from '../inf-iter';
import type { ChoiceOption, CodeText } from '../types';

export const ID = 'inf-cicli-annidati';

const upTo = (from: number | string, to: number | string): Count => ({ from, op: '<=', to, step: 1 });
/** Two loops, the one with j in the body of the one with i. */
const double = (outer: Count, inner: Count, body: string[], before: string[] = [], after: string[] = []) => lines(...counted('i', outer, [...before, ...counted('j', inner, body), ...after]));
/** The inner counter set once, before the outer loop: the inner loop runs only in the first outer turn. */
const stale = (outer: Count, inner: Count, body: string[]) => lines(`i = ${outer.from}`, `j = ${inner.from}`, `finché i ${outer.op} ${outer.to}`, ...inside([`finché j ${inner.op} ${inner.to}`, ...inside([...body, 'j = j + 1']), 'i = i + 1']));
/** The step of the outer counter in the body of the inner loop. */
const hasty = (outer: Count, inner: Count, body: string[]) => lines(`i = ${outer.from}`, `finché i ${outer.op} ${outer.to}`, ...inside([`j = ${inner.from}`, `finché j ${inner.op} ${inner.to}`, ...inside([...body, 'j = j + 1', 'i = i + 1'])]));
/** The two loops one inside the other the other way round: j outside. */
const turned = (outer: Count, inner: Count, body: string[]) => lines(...counted('j', inner, counted('i', outer, body)));

const values = (c: Count) => Array.from({ length: Number(c.to) - Number(c.from) + (c.op === '<=' ? 1 : 0) }, (_, k) => Number(c.from) + k);
const BODIES = ['scrivi i, j', 'scrivi i * j', 'scrivi "*"'] as const;

function level1(rng: Rng): Built {
	return retrying(() => {
		const [m, n] = [rng.int(2, 9), rng.int(2, 9)];
		const zero = rng.int(0, 1) === 1;
		const body = rng.pick(BODIES);
		const loop = (turns: number): Count => (zero ? { from: 0, op: '<', to: turns, step: 1 } : upTo(1, turns));
		const source = double(loop(m), loop(n), [body]);
		const right = m * n;
		const others = [m + n, n, (m + 1) * (n + 1), m, m * (n + 1), (m - 1) * n].filter((k) => k !== right);
		return {
			prompt: 'Conta i giri dei due cicli.',
			problem: 'Quante volte viene eseguito il corpo del ciclo interno?',
			code: forCodes(source),
			solution: `${right} volte`,
			steps: [`Il ciclo esterno fa ${m} giri: i va da ${zero ? 0 : 1} a ${zero ? m - 1 : m}.`, `A ogni giro esterno il ciclo interno viene eseguito tutto, e fa ${n} giri: j va da ${zero ? 0 : 1} a ${zero ? n - 1 : n}.`, `I giri si moltiplicano: ${m} · ${n} = ${right}.`],
			answer: options(
				rng,
				textOption(`${right} volte`, String(right)),
				others.map((k) => textOption(`${k} volte`, String(k)))
			),
			params: { case: zero ? 'da-zero' : 'da-uno', m, n, body, source, tests: [[]] }
		};
	});
}

/** What the wrong programs write, as options that are texts; one that writes nothing, or too much, is left out. */
const writtenBy = (sources: string[], most = 12) => sources.map((source) => output(source)).filter((w): w is string[] => !!w && w.length > 0 && w.length <= most && w.every((row) => row !== ''));

function level2(rng: Rng): Built {
	return retrying(() => {
		const [m, n] = [rng.int(2, 3), rng.int(2, 3)];
		const [a, b] = [rng.int(1, 3), rng.int(1, 3)];
		const expr = rng.pick(['i, j', 'i * j', 'i + j', '10 * i + j']);
		const body = [`scrivi ${expr}`];
		const outer = upTo(a, a + m - 1);
		const inner = upTo(b, b + n - 1);
		const source = double(outer, inner, body);
		const written = output(source)!;
		const wrong = [
			turned(outer, inner, body),
			stale(outer, inner, body),
			lines(`i = ${a}`, `j = ${b}`, `finché i <= ${a + m - 1}`, ...inside([...body, 'i = i + 1', 'j = j + 1'])),
			double(outer, { ...inner, to: b + n }, body),
			double({ ...outer, op: '<' }, inner, body),
			double(outer, { ...inner, op: '<' }, body),
			double(upTo(a, a + n - 1), upTo(b, b + m - 1), body)
		];
		return {
			prompt: 'Segui i due contatori: quello interno cambia più in fretta.',
			problem: 'Che cosa scrive questo programma?',
			code: forCodes(source),
			solution: written.join(', '),
			steps: [
				`Il contatore esterno i prende i valori ${values(outer).join(', ')}. Per ognuno il ciclo interno riparte da capo, e j prende i valori ${values(inner).join(', ')}.`,
				`Finché i resta fermo cambia solo j: con i = ${a} il programma scrive ${written.slice(0, n).join(', ')}.`,
				`In tutto le righe sono ${m} · ${n} = ${m * n}.`
			],
			answer: options(rng, writtenOption(written), writtenBy(wrong).map(writtenOption)),
			params: { case: `${m}x${n}`, a, m, b, n, expr, source, tests: [[]] }
		};
	});
}

function level3(rng: Rng): Built {
	return retrying(() => {
		const kind = rng.pick(['fino-a-i', 'sotto-i', 'da-i'] as const);
		const a = rng.int(1, 4);
		const turns = rng.int(2, 5);
		const last = a + turns - 1;
		const body = rng.pick(BODIES);
		const inner: Count = kind === 'fino-a-i' ? upTo(1, 'i') : kind === 'sotto-i' ? { from: 0, op: '<', to: 'i', step: 1 } : upTo('i', last);
		const source = double(upTo(a, last), inner, [body]);
		const each = Array.from({ length: turns }, (_, k) => (kind === 'da-i' ? last - (a + k) + 1 : a + k));
		const right = each.reduce((x, y) => x + y, 0);
		const most = Math.max(...each);
		const others = [turns * most, turns + most, most, right + turns, turns * turns, right - 1].filter((k) => k !== right && k > 0);
		return {
			prompt: 'Conta i giri del ciclo interno, un giro esterno alla volta.',
			problem: 'Quante volte viene eseguito il corpo del ciclo interno?',
			code: forCodes(source),
			solution: `${right} volte`,
			steps: [
				`Il ciclo esterno fa ${turns} giri: i va da ${a} a ${last}.`,
				`Il numero dei giri interni dipende da i: ${each.map((k, at) => `con i = ${a + at} ${k === 1 ? 'è 1' : `sono ${k}`}`).join(', ')}.`,
				`Quando il ciclo interno dipende da quello esterno i giri si sommano: ${each.join(' + ')} = ${right}.`
			],
			answer: options(
				rng,
				textOption(`${right} volte`, String(right)),
				others.map((k) => textOption(`${k} volte`, String(k)))
			),
			params: { case: kind, a, turns, body, source, tests: [[]] }
		};
	});
}

/** A drawing of characters: the rows it has, as the two loops that build them. */
interface Drawing {
	kind: 'rettangolo' | 'triangolo' | 'rovesciato' | 'scala';
	outer: Count;
	inner: Count;
	data: Record<string, number>;
	/** The same drawing with a mistake in one of the two counters. */
	wrong: [Count, Count][];
	rows: string;
	columns: string;
}

const rowsOf = (outer: Count, inner: Count, mark: string) => double(outer, inner, [`riga = riga + "${mark}"`], ['riga = ""'], ['scrivi riga']);

function drawing(rng: Rng): Drawing {
	const kind = rng.pick(['rettangolo', 'triangolo', 'rovesciato', 'scala'] as const);
	if (kind === 'rettangolo') {
		const [r, c] = [rng.int(2, 4), rng.int(2, 7)];
		const [outer, inner] = [upTo(1, r), upTo(1, c)];
		return { kind, outer, inner, data: { r, c }, wrong: [[upTo(1, c), upTo(1, r)], [outer, upTo(1, 'i')], [outer, { ...inner, op: '<' }], [{ ...outer, op: '<' }, inner], [outer, upTo(0, c)], [upTo(1, r + 1), inner]], rows: `Il ciclo esterno conta le righe: sono ${r}.`, columns: `Il ciclo interno fa ${c} giri a ogni riga, senza dipendere da i: tutte le righe hanno ${c} caratteri.` };
	}
	if (kind === 'scala') {
		const n = rng.int(2, 4);
		const [outer, inner] = [upTo(1, n), upTo(1, '2 * i')];
		return { kind, outer, inner, data: { n }, wrong: [[outer, upTo(1, 'i')], [outer, upTo(1, 2 * n)], [{ ...outer, op: '<' }, inner], [outer, upTo(1, 'i + 2')], [outer, upTo(0, '2 * i')], [upTo(1, n + 1), inner]], rows: `Il ciclo esterno conta le righe: sono ${n}.`, columns: 'Il ciclo interno arriva a 2 · i: la riga i ha il doppio di i caratteri, cioè 2, 4, 6 e così via.' };
	}
	const a = rng.int(1, 2);
	const b = a + rng.int(2, 4);
	const up = upTo(a, b);
	const down: Count = { from: b, op: '>=', to: a, step: -1 };
	const [outer, other] = kind === 'triangolo' ? [up, down] : [down, up];
	const inner = upTo(1, 'i');
	return {
		kind,
		outer,
		inner,
		data: { a, b },
		wrong: [[other, inner], [outer, upTo(1, b)], [kind === 'triangolo' ? upTo(a, b - 1) : { ...down, to: a + 1 }, inner], [outer, upTo(0, 'i')], [kind === 'triangolo' ? upTo(a + 1, b) : { ...down, from: b - 1 }, inner], [outer, upTo(1, 'i + 1')]],
		rows: `Il ciclo esterno conta le righe: i ${kind === 'triangolo' ? `sale da ${a} a ${b}` : `scende da ${b} a ${a}`}, quindi le righe sono ${b - a + 1}.`,
		columns: `Il ciclo interno arriva a i: ogni riga ha tanti caratteri quanto vale i in quel giro, quindi le righe ${kind === 'triangolo' ? 'si allungano' : 'si accorciano'} di uno alla volta.`
	};
}

function level4(rng: Rng): Built {
	return retrying(() => {
		const d = drawing(rng);
		const mark = rng.pick(['*', '#', 'o', '+']);
		const add = [`riga = riga + "${mark}"`];
		const source = rowsOf(d.outer, d.inner, mark);
		const written = output(source)!;
		const wrong = [
			...d.wrong.slice(0, 2).map(([outer, inner]) => rowsOf(outer, inner, mark)),
			// the new line left out: everything on one row; the new line in the inner body: one character per row
			lines('riga = ""', ...counted('i', d.outer, counted('j', d.inner, add)), 'scrivi riga'),
			double(d.outer, d.inner, [`scrivi "${mark}"`]),
			...d.wrong.slice(2).map(([outer, inner]) => rowsOf(outer, inner, mark))
		];
		return {
			prompt: 'Il ciclo esterno conta le righe, quello interno i caratteri di ogni riga.',
			problem: 'Che cosa disegna questo programma? Nelle risposte le righe del disegno sono scritte una dopo l’altra, separate da una virgola.',
			code: drawCodes(forCodes(source)),
			solution: written.join(', '),
			steps: [d.rows, d.columns, 'Il programma va a capo una volta per riga, dopo il ciclo interno e dentro quello esterno.'],
			answer: options(rng, writtenOption(written), writtenBy(wrong, 14).map(writtenOption)),
			params: { case: d.kind, mark, ...d.data, source, tests: [[]] }
		};
	});
}

/**
 * A table of two dimensions and the number written for each of its places: a product or a sum, because the row
 * that writes two numbers is too wide for an option in C++, inside two loops.
 */
const TABLES = {
	tavola: { sum: false, says: (m: number, n: number) => `Serve un algoritmo che scrive una tavola pitagorica ridotta: per ogni $i$ da 1 a ${m} e, per ognuno, per ogni $j$ da 1 a ${n}, il prodotto $i \\cdot j$, una riga per prodotto.` },
	aree: { sum: false, says: (m: number, n: number) => `Serve un algoritmo che scrive le aree di tutti i rettangoli con la base $i$ da 1 a ${m} e, per ogni base, l'altezza $j$ da 1 a ${n}: una riga per area, cioè per prodotto $i \\cdot j$.` },
	dadi: { sum: true, says: (m: number, n: number) => `Si lanciano un dado con le facce da 1 a ${m} e uno con le facce da 1 a ${n}. Serve un algoritmo che scrive tutte le somme possibili: per ogni faccia $i$ del primo e, per ognuna, per ogni faccia $j$ del secondo, la somma $i + j$, una riga per somma.` },
	menu: { sum: true, says: (m: number, n: number) => `Un menù ha ${m} primi, che costano da 1 a ${m} gettoni, e ${n} secondi, che costano da 1 a ${n} gettoni. Serve un algoritmo che scrive il costo di tutti i pasti: per ogni primo $i$ e, per ognuno, per ogni secondo $j$, la somma $i + j$, una riga per pasto.` }
};

function level5(rng: Rng, build: boolean): Built {
	return retrying(() => {
		const table = rng.pick(['tavola', 'aree', 'dadi', 'menu'] as const);
		const m = rng.int(2, 7);
		const n = rng.int(2, 7);
		if (m === n) throw new Retry('the two sizes are the same');
		const body = [TABLES[table].sum ? 'scrivi i + j' : 'scrivi i * j'];
		const [outer, inner] = [upTo(1, m), upTo(1, n)];
		const source = double(outer, inner, body);
		const candidates = [stale(outer, inner, body), double(upTo(1, n), upTo(1, m), body), hasty(outer, inner, body), double(outer, inner, [], [], [body[0]]), double(outer, inner, [TABLES[table].sum ? 'scrivi i * j' : 'scrivi i + j']), turned(outer, inner, body), double(outer, { ...inner, op: '<' }, body)];
		const wrong = wrongOnes(
			source,
			candidates.filter((w) => fits(codeOf(w))),
			[[]]
		).slice(0, 3);
		const choice = options(
			rng,
			codeOption(source),
			wrong.map((w) => codeOption(w))
		);
		return {
			prompt: build ? 'Costruisci il diagramma di flusso, o riconosci il programma che fa lo stesso.' : 'Scegli i due cicli giusti.',
			problem: `${TABLES[table].says(m, n)} I due cicli vanno scritti come nel diagramma di flusso, cioè con while: la partenza, la condizione e il passo di ogni contatore sono separati.`,
			solution: `Il ciclo esterno con i da 1 a ${m}; nel suo corpo j riparte da 1 e il ciclo interno arriva a ${n}; la scrittura sta nel corpo interno.`,
			steps: [
				`Il ciclo esterno scorre la prima dimensione: i va da 1 a ${m}. Quello interno scorre la seconda: j va da 1 a ${n}.`,
				'Il valore di partenza di j si dà dentro il ciclo esterno, prima del ciclo interno: così j riparte da 1 a ogni giro esterno.',
				'La scrittura sta nel corpo interno, il passo di j in fondo al corpo interno, il passo di i in fondo al corpo esterno, dopo il ciclo interno.'
			],
			solutionCode: forCodes(source),
			...(build ? { solutionChart: source, answer: needing(chartAnswer(source, [[]]), 'ciclo'), choice } : { answer: choice }),
			params: { case: table, sum: TABLES[table].sum, m, n, source, tests: [[]] }
		};
	});
}

const codeOf = (source: string): CodeText => codeOption(source).code!;

/** Two loops whose number of turns is read: the task of the open level. */
interface Task {
	kind: 'prodotti' | 'somme' | 'rettangolo' | 'triangolo' | 'quadrato';
	says: string;
	reads: string[];
	draws: boolean;
	source: string;
	wrong: string[];
	tests: number[][];
	data: Record<string, number>;
}

function task(rng: Rng): Task {
	const kind = rng.pick(['prodotti', 'somme', 'rettangolo', 'triangolo', 'quadrato'] as const);
	const read = (names: string[], rows: string) => lines(...names.map((name) => `leggi ${name}`)) + rows;
	const n1 = rng.int(3, 5);
	const sizes = [[n1], [rng.pick([1, 2, 3, 4, 5, 6].filter((n) => n !== n1))]];
	if (kind === 'prodotti') {
		const k = rng.int(2, 5);
		const make = (outer: Count, inner: Count, expr: string) => read(['n'], double(outer, inner, [`scrivi ${expr}`]));
		const [outer, inner] = [upTo(1, 'n'), upTo(1, k)];
		return {
			kind,
			says: `legge un numero $n$ e scrive, per ogni $i$ da 1 a $n$ e per ogni $j$ da 1 a ${k}, il prodotto $i \\cdot j$: una riga per prodotto`,
			reads: ['n'],
			draws: false,
			source: make(outer, inner, 'i * j'),
			wrong: [make(upTo(1, k), upTo(1, 'n'), 'i * j'), make(outer, inner, 'i + j'), make(outer, { ...inner, op: '<' }, 'i * j'), make({ ...outer, op: '<' }, inner, 'i * j'), make(outer, inner, 'i * i'), make(upTo(0, 'n'), upTo(0, k), 'i * j'), make(outer, upTo(1, 'i'), 'i * j')],
			tests: sizes,
			data: { k }
		};
	}
	if (kind === 'somme') {
		const make = (outer: Count, inner: Count, expr: string) => read(['n'], double(outer, inner, [`scrivi ${expr}`]));
		const [outer, inner] = [upTo(1, 'n'), upTo(1, 'i')];
		return {
			kind,
			says: 'legge un numero $n$ e scrive, per ogni $i$ da 1 a $n$ e per ogni $j$ da 1 a $i$, la somma $i + j$: una riga per somma',
			reads: ['n'],
			draws: false,
			source: make(outer, inner, 'i + j'),
			wrong: [make(outer, upTo(1, 'n'), 'i + j'), make(outer, { ...inner, op: '<' }, 'i + j'), make(outer, inner, 'i * j'), make({ ...outer, op: '<' }, inner, 'i + j'), make(outer, upTo(0, 'i'), 'i + j'), make(outer, upTo('i', 'n'), 'i + j')],
			tests: sizes,
			data: {}
		};
	}
	const make = (names: string[], outer: Count, inner: Count) => read(names, rowsOf(outer, inner, '*'));
	if (kind === 'rettangolo') {
		const [outer, inner] = [upTo(1, 'r'), upTo(1, 'c')];
		const [r, c] = [rng.int(1, 3), rng.int(4, 6)];
		return {
			kind,
			says: 'legge il numero delle righe $r$ e poi quello delle colonne $c$, e disegna un rettangolo di asterischi con $r$ righe di $c$ asterischi',
			reads: ['r', 'c'],
			draws: true,
			source: make(['r', 'c'], outer, inner),
			wrong: [make(['r', 'c'], upTo(1, 'c'), upTo(1, 'r')), make(['r', 'c'], outer, upTo(1, 'i')), make(['r', 'c'], outer, { ...inner, op: '<' }), make(['r', 'c'], { ...outer, op: '<' }, inner), make(['r', 'c'], outer, upTo(0, 'c')), make(['r', 'c'], outer, upTo(1, 'r'))],
			tests: [[r, c], [rng.int(4, 5), rng.int(2, 3)]],
			data: {}
		};
	}
	if (kind === 'triangolo') {
		const [outer, inner] = [upTo(1, 'n'), upTo(1, 'i')];
		return {
			kind,
			says: 'legge un numero $n$ e disegna un triangolo di asterischi di $n$ righe: la prima riga ha un asterisco, la seconda due, l’ultima $n$',
			reads: ['n'],
			draws: true,
			source: make(['n'], outer, inner),
			wrong: [make(['n'], outer, upTo(1, 'n')), make(['n'], { from: 'n', op: '>=', to: 1, step: -1 }, inner), make(['n'], outer, { ...inner, op: '<' }), make(['n'], { ...outer, op: '<' }, inner), make(['n'], outer, upTo(0, 'i')), make(['n'], outer, upTo('i', 'n'))],
			tests: sizes,
			data: {}
		};
	}
	const [outer, inner] = [upTo(1, 'n'), upTo(1, 'n')];
	return {
		kind,
		says: 'legge un numero $n$ e disegna un quadrato di asterischi: $n$ righe di $n$ asterischi',
		reads: ['n'],
		draws: true,
		source: make(['n'], outer, inner),
		wrong: [make(['n'], outer, upTo(1, 'i')), make(['n'], outer, { ...inner, op: '<' }), make(['n'], { ...outer, op: '<' }, inner), make(['n'], outer, upTo(0, 'n')), make(['n'], upTo(0, 'n'), inner), make(['n'], outer, upTo(2, 'n'))],
		tests: sizes,
		data: {}
	};
}

function level6(rng: Rng): Built {
	return retrying(() => {
		const t = task(rng);
		const code = (source: string) => (t.draws ? drawCodes(forCodes(source, t.tests[0])) : forCodes(source, t.tests[0]));
		const option = (source: string): ChoiceOption => ({ latex: '', values: [source], code: code(source), text: 'un programma' });
		const wrong = wrongOnes(
			t.source,
			t.wrong.filter((w) => fits(code(w))),
			t.tests
		).slice(0, 3);
		return {
			prompt: 'Scrivi il programma.',
			problem: `Scrivi un programma che ${t.says}.`,
			solution: t.draws ? 'Due for annidati: quello esterno conta le righe, quello interno scrive gli asterischi di una riga senza andare a capo, e l’a capo viene dopo il ciclo interno.' : 'Due for annidati, con la scrittura nel corpo di quello interno.',
			steps: [
				t.draws ? 'Il ciclo esterno fa un giro per ogni riga del disegno: decidi da dove parte e dove arriva il suo contatore.' : 'Il ciclo esterno fa un giro per ogni valore di i: decidi da dove parte e dove arriva.',
				t.draws ? 'Il ciclo interno scrive un asterisco per giro, senza andare a capo: decidi a quale valore arriva, un numero fisso o il contatore esterno.' : 'Il ciclo interno sta nel corpo di quello esterno e ha un contatore con un altro nome: decidi a quale valore arriva, un numero fisso o il contatore esterno.',
				t.draws ? 'L’istruzione che va a capo sta dopo il ciclo interno, ma dentro quello esterno: una volta per riga.' : 'La scrittura sta nel corpo interno: viene eseguita una volta per ogni coppia di valori dei due contatori.'
			],
			solutionCode: code(t.source),
			answer: needing({ ...programAnswer(t.source, t.tests, lines(...t.reads.map((name) => `leggi ${name}`))), solution: code(t.source) }, 'ciclo'),
			choice: options(rng, option(t.source), wrong.map(option)),
			params: { case: t.kind, ...t.data, source: t.source, tests: t.tests }
		};
	});
}

/** Every program shown or asked for writes the same in the chart, in Python and in C++, and ends. */
function sound(sample: Sample): string[] {
	const source = String(sample.params.source);
	const tests = sample.params.tests as number[][];
	const errors: string[] = [];
	const why = plain(source, tests[0]);
	if (why) errors.push(`the program ${why}`);
	for (const inputs of tests) if (!output(source, inputs)) errors.push('the program does not end');
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const o of choice?.options ?? []) if (o.code && !fits(o.code)) errors.push('an option is too wide or too long');
	for (const code of [sample.code, sample.solutionCode]) if (code && /riga/.test(code.python + code.cpp)) errors.push('a drawing is shown as a text built a row at a time');
	return errors;
}

/** Whether level 5 asks to build the chart of the two loops when it is open; see the note in the spec. */
const BUILD_CHART = true;

export default makeGenerator(ID, 'Cicli annidati', {
	1: { label: 'Quante volte gira il corpo interno', constraints: ['two loops of 2 to 9 turns that do not depend on each other', 'four different numbers'], build: level1, check: sound },
	2: { label: 'Che cosa scrive un ciclo doppio', constraints: ['at most 3 turns by 3', 'four different outputs'], build: level2, check: sound },
	3: { label: 'Il ciclo interno che dipende da quello esterno', constraints: ['the inner loop stops at, or starts from, the outer counter', 'the turns add up'], build: level3, check: sound },
	4: { label: 'Le righe di un disegno', constraints: ['a rectangle, a triangle, a triangle upside down or a staircase of at most 8 characters a row', 'four different drawings'], build: level4, check: sound },
	5: { label: 'I due cicli di una tabella', constraints: ['four programs with two while that write different things', 'open: the chart, graded by running it'], build: (rng) => level5(rng, BUILD_CHART), check: sound },
	6: { label: 'Scrivere due cicli annidati', constraints: ['a program that reads its sizes', 'graded by running the program on two inputs'], build: level6, check: sound }
});
