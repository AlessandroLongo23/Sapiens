/**
 * I diagrammi di flusso. Spec: specs/exercises/diagrammi-flusso.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/47-diagrammi-flusso.md): the four blocks and the
 * arrows, then a chart to read for each of the three structures, the program a chart becomes (the lesson shows it
 * in Python and in C++), and the chart to build (v2/inf-alg.ts).
 */
import type { Rng } from '../types';
import { choose, codeOption, codes, makeGenerator, output, textOption, type Built } from '../inf-programmi';
import { countdown, delivery, discount, divisible, fee, halvings, idOption, larger, mistakes, multiples, order, paramsOf, rectangle, buildLevel, sound, sumTo, threshold, traceLevel, units, type Algo } from '../inf-alg';

export const ID = 'diagrammi-flusso';

// ---------------------------------------------------------------------------
// Level 1: the four blocks and the arrows

const SHAPES = {
	ovale: ['Un ovale', "L'ovale è il blocco di inizio e di fine: dentro c'è solo la parola \"inizio\" oppure \"fine\"."],
	parallelogramma: ['Un parallelogramma', 'Il parallelogramma è il blocco di ingresso e di uscita: dentro c\'è un dato da leggere ("leggi") o da scrivere ("scrivi").'],
	rettangolo: ['Un rettangolo', "Il rettangolo è il blocco di un'istruzione: un calcolo, con la freccia che porta il risultato nella variabile a sinistra."],
	rombo: ['Un rombo', 'Il rombo è il blocco di una condizione: una domanda a cui si risponde sì oppure no.']
} as const;
type Shape = keyof typeof SHAPES;

const CONTENTS: Record<Shape, string> = {
	ovale: 'La parola "inizio" oppure "fine"',
	parallelogramma: 'Un dato da leggere o da scrivere',
	rettangolo: 'Un calcolo, con il nome a cui va il risultato',
	rombo: 'Una domanda a cui si risponde sì oppure no'
};

const ARROWS: [id: string, from: string, count: number, why: string][] = [
	['rombo', 'un rombo', 2, 'Da un rombo escono due frecce, una con scritto "sì" e una con scritto "no": con una sola, chi legge non saprebbe dove andare quando la risposta è l\'altra.'],
	['rettangolo', 'un rettangolo', 1, 'Da un rettangolo esce una sola freccia: dopo un calcolo la strada è una.'],
	['parallelogramma', 'un parallelogramma', 1, 'Da un parallelogramma esce una sola freccia: dopo una lettura o una scrittura la strada è una.'],
	['fine', "l'ovale con scritto \"fine\"", 0, "Dall'ovale di fine non esce niente: lì l'esecuzione termina."],
	['inizio', "l'ovale con scritto \"inizio\"", 1, "Dall'ovale di inizio esce una sola freccia, verso il primo blocco da eseguire."]
];
const COUNTS = ['Nessuna', 'Una', 'Due', 'Tre'];

const VARS = ['n', 'a', 'b', 'p', 's', 't', 'x', 'i', 'k', 'h'];

/** The text of a block of each shape, with names and numbers drawn. */
function block(rng: Rng, shape: Shape): string {
	const v = rng.pick(VARS);
	const u = rng.pick(VARS.filter((x) => x !== v));
	const k = rng.int(1, 20);
	if (shape === 'ovale') return rng.pick(['inizio', 'fine']);
	if (shape === 'parallelogramma') return rng.pick([`leggi ${v}`, `scrivi ${v}`, `scrivi "${rng.pick(['ciao', 'via', 'fatto', 'pari', 'ridotto'])}"`]);
	if (shape === 'rettangolo') return rng.pick([`${v} ← ${v} + ${k}`, `${v} ← ${u} · ${k}`, `${v} ← ${k}`, `${v} ← ${v} − 1`, `${v} ← ${u} + ${v}`]);
	return rng.pick([`${v} > ${k}?`, `${v} ≤ ${u}?`, `${v} = ${k}?`, `${v} < ${k}?`, `${v} ≠ ${u}?`]);
}

function level1(rng: Rng): Built {
	const names = Object.keys(SHAPES) as Shape[];
	const kind = rng.pick(['forma', 'forma', 'forma', 'contenuto', 'frecce'] as const);
	if (kind === 'forma') {
		const shape = rng.pick(names);
		const text = block(rng, shape);
		return {
			prompt: 'Riconosci il blocco dalla sua forma.',
			problem: `In un diagramma di flusso c'è un blocco con scritto dentro «${text}». Che forma ha?`,
			solution: SHAPES[shape][0],
			steps: ['La forma di un blocco dice che tipo di passo è: ovale per inizio e fine, parallelogramma per leggere e scrivere, rettangolo per un calcolo, rombo per una domanda.', SHAPES[shape][1]],
			answer: choose(
				rng,
				idOption(SHAPES[shape][0], shape),
				names.filter((s) => s !== shape).map((s) => idOption(SHAPES[s][0], s))
			),
			params: { case: 'forma', shape, text }
		};
	}
	if (kind === 'contenuto') {
		const shape = rng.pick(names);
		return {
			prompt: 'Riconosci il blocco dalla sua forma.',
			problem: `Che cosa si scrive dentro ${SHAPES[shape][0].toLowerCase()}?`,
			solution: CONTENTS[shape],
			steps: [SHAPES[shape][1]],
			answer: choose(
				rng,
				idOption(CONTENTS[shape], shape),
				names.filter((s) => s !== shape).map((s) => idOption(CONTENTS[s], s))
			),
			params: { case: 'contenuto', shape }
		};
	}
	const [id, from, count, why] = rng.pick(ARROWS);
	return {
		prompt: 'Ricorda le regole delle frecce.',
		problem: `Quante frecce escono da ${from}?`,
		solution: COUNTS[count],
		steps: [why],
		answer: choose(
			rng,
			textOption(COUNTS[count], String(count)),
			[0, 1, 2, 3].filter((c) => c !== count).map((c) => textOption(COUNTS[c], String(c)))
		),
		params: { case: 'frecce', from: id }
	};
}

// ---------------------------------------------------------------------------
// Levels 2 to 4: read a chart

const pickOne = (rng: Rng, makers: ((rng: Rng) => Algo)[]) => rng.pick(makers)(rng);

function level2(rng: Rng): Built {
	return traceLevel(rng, pickOne(rng, [order, order, fee, units, rectangle]));
}

function level3(rng: Rng): Built {
	const a = pickOne(rng, [threshold, discount, delivery, larger, divisible]);
	return traceLevel(rng, a, rng.pick(a.tests));
}

/** How many times the body of the loop of `source` runs on `inputs`: the lines a copy with a mark in its body writes. */
function turns(source: string, inputs: number[]): number {
	const marked = source.replace(/^(finché .*\n)/m, '$1    scrivi "@"\n');
	return output(marked, inputs)!.filter((row) => row === '@').length;
}

function level4(rng: Rng): Built {
	const a = pickOne(rng, [countdown, sumTo, multiples, halvings]);
	const inputs = a.tests[0];
	if (rng.next() < 0.65) return { ...traceLevel(rng, a, inputs), params: paramsOf(a, { inputs, tests: [inputs, ...a.tests.slice(1)], ask: 'scrive' }) };
	const n = turns(a.source, inputs);
	return {
		prompt: 'Segui il giro con una tabella.',
		problem: `Con ${inputs[0]} in ingresso, quante volte viene attraversato il rombo di questo diagramma?`,
		chart: a.source,
		solution: `${n + 1} volte`,
		steps: [`Con ${inputs[0]} in ingresso i blocchi del giro vengono eseguiti ${n} volte: sono ${n} passaggi dal rombo con risposta "sì".`, `Poi c'è un ultimo passaggio, con risposta "no", che fa uscire dal giro: in tutto ${n + 1}.`],
		answer: choose(
			rng,
			textOption(`${n + 1} volte`, String(n + 1)),
			[n, n + 2, n - 1, 1, n + 3].filter((x) => x > 0).map((x) => textOption(`${x} volte`, String(x)))
		),
		params: paramsOf(a, { inputs, tests: [inputs, ...a.tests.slice(1)], ask: 'rombo', turns: n })
	};
}

// ---------------------------------------------------------------------------
// Level 5: from the chart to the program

/** The mistakes of a translation, by structure: a line that ends up inside the loop or the branch, the wrong keyword. */
const TRANSLATION = ['parola nel giro', 'scrive nel ramo', 'selezione', 'il no fuori dal ramo', 'senza altrimenti', 'scrive prima', 'ordine scambiato'];

function level5(rng: Rng): Built {
	const a = pickOne(rng, [fee, discount, threshold, countdown, sumTo, multiples]);
	const sample = a.tests[0];
	return {
		prompt: 'Traduci il diagramma un blocco alla volta.',
		problem: 'Quale programma corrisponde a questo diagramma di flusso?',
		chart: a.source,
		solution: 'Il programma con le stesse istruzioni nello stesso ordine, e con dentro il ramo o il giro le stesse righe che nel diagramma stanno dentro.',
		steps: [
			'Ogni blocco diventa una riga, nell\'ordine in cui le frecce lo attraversano: "leggi" chiede un numero, "scrivi" lo stampa, il rettangolo è la riga con il segno =.',
			a.structure === 'iterazione' ? 'Il rombo con la freccia che torna indietro è la riga del while: le righe del giro sono quelle rientrate (in C++, tra le graffe).' : a.structure === 'selezione' ? 'Il rombo con due rami che si riuniscono è la riga con if: il ramo "sì" viene subito dopo, il ramo "no" dopo else.' : 'In una sequenza le righe sono tante quanti i blocchi, tutte a margine.',
			'Una riga rientrata per sbaglio finisce dentro il giro o dentro il ramo: controlla che le righe dopo il rombo siano dentro o fuori come nel diagramma.'
		],
		solutionCode: codes(a.source, sample),
		answer: choose(
			rng,
			codeOption(a.source, sample),
			mistakes(a, TRANSLATION).map((source) => codeOption(source, sample))
		),
		params: paramsOf(a)
	};
}

/** A program as an option is at most 9 lines of Python, and its lines at most 34 characters, in both languages. */
function narrowCode(sample: { answer: Built['answer']; choice?: Built['choice'] }): string[] {
	const errors: string[] = [];
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const o of choice?.options ?? []) {
		if (!o.code) continue;
		if (o.code.python.trimEnd().split('\n').length > 9) errors.push('a program of more than 9 lines');
		for (const row of [...o.code.python.split('\n'), ...o.code.cpp.split('\n')]) if (row.length > 34) errors.push(`a line of ${row.length} characters`);
	}
	return errors;
}

export default makeGenerator(ID, 'I diagrammi di flusso', {
	1: { label: 'I blocchi e le frecce', constraints: ['the shape of a block from what is written in it, what goes in a shape, how many arrows leave a block', 'four different options'], build: level1 },
	2: { label: 'Leggere una sequenza', constraints: ['a sequence shown as a chart', 'half of them only assignments, where a variable is used and then changed'], build: level2, check: sound },
	3: { label: 'Leggere una selezione', constraints: ['a selection shown as a chart', 'the inputs are sometimes on the edge of the condition'], build: level3, check: sound },
	4: { label: 'Leggere una ripetizione', constraints: ['a loop shown as a chart, of at most 6 turns', 'what it writes, or how many times the condition is asked'], build: level4, check: sound },
	5: { label: 'Dal diagramma al programma', constraints: ['four programs that write different things on the tests', 'at most 9 lines of Python, lines of at most 34 characters'], build: level5, check: (s) => [...sound(s), ...narrowCode(s)] },
	6: { label: 'Costruire un diagramma', constraints: ['graded by running the chart on at least two tests'], build: (rng) => buildLevel(rng, pickOne(rng, [units, divisible, discount, threshold, countdown, sumTo])), check: sound }
});
