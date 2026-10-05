/**
 * Il primo programma: input e output. Spec: specs/exercises/inf-input-output.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/52-inf-input-output.md). The programs are
 * sequences of writings and readings, with texts of one word typed at the keyboard; each is written once, in the
 * language of the flowcharts, and shown in Python and in C++, as a chart, or left to the student (v2/inf-programmi.ts).
 *
 * 1. what a program of writings prints (a text is printed as it is, a calculation is worked out); 2. what a program
 * prints after a reading; 3. the program that prints a given thing; 4. build the flowchart; 5. write the program.
 */
import { chartAnswer, chartOption, choose, codeOption, codes, lines, makeGenerator, output, programAnswer, textOption, wrongPrograms, type Built } from '../inf-programmi';
import { mistakes, quoted, said, sound, typed } from '../inf-primi';
import type { Rng, Sample } from '../types';

export const ID = 'inf-input-output';

// ---------------------------------------------------------------------------
// Level 1: writings only

const ITEMS = ['Biglietti', 'Pizze', 'Libri', 'Panini', 'Quaderni', 'Penne', 'Gelati', 'Posti'];

function level1(rng: Rng): Built {
	const item = rng.pick(ITEMS);
	const op = rng.pick(['*', '*', '+', '-'] as const);
	const b = rng.int(2, 9);
	const a = op === '-' ? b + rng.int(2, 9) : rng.int(2, 9);
	const value = op === '*' ? a * b : op === '+' ? a + b : a - b;
	// what a student gets with the other operation: the sum for a product, the product for a sum or a difference
	const other = op === '*' ? a + b : a * b;
	const conto = `${a} ${op} ${b}`;
	const kind = rng.pick(['calcolo', 'testo', 'misto'] as const);
	const first = `${item}: ${a}`;
	const second = kind === 'calcolo' ? `scrivi "Totale:", ${conto}` : kind === 'testo' ? `scrivi "Totale:", "${conto}"` : `scrivi "${conto} =", ${conto}`;
	const source = lines(`scrivi "${item}:", ${a}`, second);
	const written = output(source)!;
	const wrong: string[][] =
		kind === 'calcolo'
			? [[first, `Totale: ${conto}`], [`${first} Totale: ${value}`], [first, `Totale: ${other}`], [first, `"Totale:" ${value}`]]
			: kind === 'testo'
				? [[first, `Totale: ${value}`], [first, `Totale: "${conto}"`], [`${first} Totale: ${conto}`], [first, `Totale: ${other}`]]
				: [[first, `${value} = ${value}`], [first, `${conto} = ${conto}`], [`${first} ${conto} = ${value}`], [first, `"${conto} =" ${value}`]];
	const steps = ['Ogni istruzione che scrive va a capo alla fine: le righe sono due.', 'Un testo tra virgolette viene scritto così com\'è, carattere per carattere, senza le virgolette.'];
	steps.push(
		kind === 'calcolo'
			? `Il conto ${conto} è senza virgolette: viene prima calcolato, e si scrive il risultato, ${value}.`
			: kind === 'testo'
				? `Qui anche ${conto} è tra virgolette: è un testo, e viene scritto senza fare il conto.`
				: `Il primo ${conto} è dentro le virgolette e resta com'è; il secondo è fuori, viene calcolato e diventa ${value}.`
	);
	return {
		prompt: 'Distingui i testi dai conti.',
		problem: 'Che cosa scrive questo programma? Nelle risposte la virgola separa una riga dalla successiva.',
		code: codes(source),
		solution: said(written),
		steps,
		answer: choose(
			rng,
			textOption(said(written), written.join('\n')),
			wrong.map((rows) => textOption(said(rows), rows.join('\n')))
		),
		params: { case: kind, source, tests: [[]] }
	};
}

// ---------------------------------------------------------------------------
// The programs that read: three families

interface Task {
	family: 'saluto' | 'frase' | 'etichette';
	/** What the program does, as the exercise says it after "un programma che". */
	task: string;
	source: string;
	/** The same program with the name of the variable in quotes: it writes the name, not what was read. */
	quotes: string;
	/** Other mistakes a student makes, each a different one. */
	wrong: string[];
	/** The first reading, which the program to write starts from. */
	given: string;
	tests: string[][];
	/** How the solution is said in a line. */
	how: string;
}

const PEOPLE = ['Sara', 'Luca', 'Anna', 'Marco', 'Elena', 'Pietro', 'Chiara', 'Davide', 'Irene', 'Matteo'];
const GREETINGS = ['Ciao', 'Salve', 'Buongiorno', 'Buonasera', 'Piacere', 'Auguri'];
const CLOSINGS = ['Buona giornata', 'Buono studio', 'A presto', 'Buon lavoro', 'Buona lettura'];

/** The second thing read: the variable, how the exercise names it, the verb of the sentence, the label, the values. */
const SECONDS: { name: string; a: string; the: string; from: string; verb: string; label: string; values: string[] }[] = [
	{ name: 'citta', a: 'una città', the: 'la città', from: 'dalla città', verb: 'abita a', label: 'Città:', values: ['Lecce', 'Torino', 'Bari', 'Pisa', 'Genova', 'Parma', 'Udine', 'Siena'] },
	{ name: 'materia', a: 'una materia', the: 'la materia', from: 'dalla materia', verb: 'studia', label: 'Materia:', values: ['storia', 'fisica', 'latino', 'arte', 'musica', 'chimica'] },
	{ name: 'sport', a: 'uno sport', the: 'lo sport', from: 'dallo sport', verb: 'gioca a', label: 'Sport:', values: ['calcio', 'tennis', 'basket', 'rugby', 'pallavolo', 'golf'] },
	{ name: 'animale', a: 'un animale', the: "l'animale", from: "dall'animale", verb: 'ha un', label: 'Animale:', values: ['gatto', 'cane', 'criceto', 'pappagallo', 'coniglio', 'pesce'] }
];

function two<T>(rng: Rng, xs: readonly T[]): [T, T] {
	const i = rng.int(0, xs.length - 1);
	const j = (i + rng.int(1, xs.length - 1)) % xs.length;
	return [xs[i], xs[j]];
}

function greeting(rng: Rng): Task {
	const g = rng.pick(GREETINGS);
	const c = rng.pick(CLOSINGS);
	const read = 'leggi nome: testo';
	const greet = `scrivi "${g}", nome`;
	const close = `scrivi "${c}"`;
	const [n1, n2] = two(rng, PEOPLE);
	return {
		family: 'saluto',
		task: `legge un nome e scrive due righe: nella prima "${g}" seguito dal nome letto, nella seconda "${c}"`,
		source: lines(read, greet, close),
		quotes: lines(read, `scrivi "${g}", "nome"`, close),
		wrong: [lines(read, close, greet), lines(read, `scrivi nome, "${g}"`, close), lines(read, `scrivi "${g}"`, 'scrivi nome', close), lines(read, greet), lines(read, 'scrivi nome', close), lines(read, `scrivi "${g}"`, close)],
		given: lines(read),
		tests: [[n1], [n2]],
		how: 'Una lettura e due scritture: la prima con il testo e la variabile, la seconda con il solo testo.'
	};
}

function sentence(rng: Rng): Task {
	const s = rng.pick(SECONDS);
	const reads = ['leggi nome: testo', `leggi ${s.name}: testo`];
	const [n1, n2] = two(rng, PEOPLE);
	const [v1, v2] = two(rng, s.values);
	return {
		family: 'frase',
		task: `legge un nome e ${s.a}, e scrive in una sola riga il nome, il testo "${s.verb}" e ${s.the}`,
		source: lines(...reads, `scrivi nome, "${s.verb}", ${s.name}`),
		quotes: lines(...reads, `scrivi "nome", "${s.verb}", "${s.name}"`),
		wrong: [
			lines(...reads, `scrivi ${s.name}, "${s.verb}", nome`),
			lines(...reads, `scrivi nome, ${s.name}`),
			lines(...reads, 'scrivi nome', `scrivi "${s.verb}", ${s.name}`),
			lines(...reads, `scrivi nome, "${s.verb}"`),
			lines(...reads, `scrivi "${s.verb}", nome, ${s.name}`),
			lines(...reads, `scrivi nome, ${s.name}, "${s.verb}"`)
		],
		given: lines(reads[0]),
		tests: [
			[n1, v1],
			[n2, v2]
		],
		how: 'Due letture, una dopo l\'altra, e una sola scrittura con tre pezzi: la variabile, il testo tra virgolette, l\'altra variabile.'
	};
}

function labels(rng: Rng): Task {
	const s = rng.pick(SECONDS);
	const reads = ['leggi nome: testo', `leggi ${s.name}: testo`];
	const [n1, n2] = two(rng, PEOPLE);
	const [v1, v2] = two(rng, s.values);
	const one = 'scrivi "Nome:", nome';
	const other = `scrivi "${s.label}", ${s.name}`;
	return {
		family: 'etichette',
		task: `legge un nome e ${s.a}, e scrive due righe: nella prima "Nome:" seguito dal nome, nella seconda "${s.label}" seguito ${s.from}`,
		source: lines(...reads, one, other),
		quotes: lines(...reads, 'scrivi "Nome:", "nome"', `scrivi "${s.label}", "${s.name}"`),
		wrong: [
			lines(...reads, `scrivi "Nome:", ${s.name}`, `scrivi "${s.label}", nome`),
			lines(...reads, other, one),
			lines(...reads, 'scrivi nome', `scrivi ${s.name}`),
			lines(...reads, 'scrivi nome, "Nome:"', `scrivi ${s.name}, "${s.label}"`),
			lines(...reads, one),
			lines(...reads, `scrivi "Nome:", nome, ${s.name}`)
		],
		given: lines(reads[0]),
		tests: [
			[n1, v1],
			[n2, v2]
		],
		how: 'Due letture e due scritture, ognuna con il suo testo tra virgolette e la sua variabile.'
	};
}

const task = (rng: Rng): Task => rng.pick([greeting, sentence, labels])(rng);

const wrongOf = (t: Task) => mistakes(ID, t.source, [t.quotes, ...t.wrong], t.tests);
const params = (t: Task, extra: Record<string, unknown> = {}) => ({ case: t.family, source: t.source, tests: t.tests, ...extra });

// ---------------------------------------------------------------------------

function level2(rng: Rng): Built {
	const t = task(rng);
	const inputs = t.tests[0];
	// in four exercises out of ten the program shown is the one with the quotes around the name of the variable
	const trap = rng.next() < 0.4;
	const shown = trap ? t.quotes : t.source;
	const written = output(shown, inputs)!;
	const others = wrongPrograms(shown, trap ? [t.source, ...t.wrong] : [t.quotes, ...t.wrong], [inputs]).map((source) => output(source, inputs)!);
	return {
		prompt: 'Segui il programma una istruzione alla volta.',
		problem: `Alla tastiera si scrive ${typed(inputs)}. Che cosa scrive questo programma? Nelle risposte la virgola separa una riga dalla successiva.`,
		code: codes(shown, inputs),
		solution: said(written),
		steps: [
			`Ogni lettura mette in una variabile quello che è stato scritto alla tastiera: ${inputs.length === 1 ? `nome contiene ${inputs[0]}` : `prima ${inputs[0]}, poi ${inputs[1]}`}.`,
			trap ? 'Nelle scritture i nomi delle variabili sono tra virgolette: sono testi, e vengono scritti così come sono, senza guardare che cosa è stato letto.' : 'Dove una scrittura ha il nome di una variabile, senza virgolette, il computer mette il valore letto; i testi tra virgolette restano come sono.',
			'I pezzi di una stessa scrittura sono separati da uno spazio, e ogni scrittura finisce andando a capo.'
		],
		answer: choose(
			rng,
			textOption(said(written), written.join('\n')),
			others.map((rows) => textOption(said(rows), rows.join('\n')))
		),
		params: { case: trap ? 'virgolette' : 'variabile', family: t.family, source: shown, tests: [inputs] }
	};
}

const example = (t: Task) => `Con ${typed(t.tests[0])} deve scrivere ${quoted(output(t.source, t.tests[0])!)}.`;

function level3(rng: Rng): Built {
	const t = task(rng);
	return {
		prompt: 'Leggi che cosa stampa ogni programma.',
		problem: `Quale programma ${t.task}? ${example(t)}`,
		solution: t.how,
		steps: ['Il nome di una variabile si scrive senza virgolette: con le virgolette viene stampato il nome, non quello che è stato letto.', 'Ogni scrittura produce una riga: conta le righe che devono uscire.', "Controlla l'ordine dei pezzi dentro ogni scrittura, e l'ordine delle letture."],
		solutionCode: codes(t.source, t.tests[0]),
		answer: choose(
			rng,
			codeOption(t.source, t.tests[0]),
			wrongOf(t).map((source) => codeOption(source, t.tests[0]))
		),
		params: params(t)
	};
}

function level4(rng: Rng): Built {
	const t = task(rng);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${t.task}. ${example(t)}`,
		solution: t.how,
		steps: ['Metti un blocco "leggi" per ogni dato che arriva dalla tastiera, nell\'ordine in cui arrivano.', 'Metti un blocco "scrivi" per ogni riga che deve uscire.', 'Dentro "scrivi" i testi vanno tra virgolette, i nomi delle variabili no, e i pezzi si separano con la virgola.'],
		solutionChart: t.source,
		answer: chartAnswer(t.source, t.tests),
		choice: choose(rng, chartOption(t.source), wrongOf(t).map(chartOption)),
		params: params(t)
	};
}

function level5(rng: Rng): Built {
	const t = task(rng);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${t.task}. ${example(t)} Leggi senza scrivere una domanda.`,
		solution: t.how,
		steps: ['La prima lettura è già scritta: aggiungi sotto quello che manca.', 'Ogni riga che deve uscire è una istruzione che stampa, con i testi tra virgolette e le variabili senza.', 'Quello che stampi viene confrontato carattere per carattere: controlla maiuscole e spazi.'],
		solutionCode: codes(t.source, t.tests[0]),
		answer: programAnswer(t.source, t.tests, t.given),
		choice: choose(
			rng,
			codeOption(t.source, t.tests[0]),
			wrongOf(t).map((source) => codeOption(source, t.tests[0]))
		),
		params: params(t)
	};
}

/** No program of this lesson has a selection or a loop, and what is read is a text of one word. */
const sequence = (sample: Sample) => {
	const errors = sound(sample);
	const source = String(sample.params.source);
	if (/^\s*(se|finché|altrimenti)\b/m.test(source)) errors.push('the program is not a sequence');
	for (const inputs of sample.params.tests as string[][]) if (inputs.some((word) => !/^\p{L}+$/u.test(word))) errors.push('a text typed is not one word');
	return errors;
};

export default makeGenerator(ID, 'Il primo programma: input e output', {
	1: { label: 'Testi e conti da stampare', constraints: ['two writings, no reading', 'a calculation, the same as a text in quotes, or both in the same line, about a third each'], build: level1, check: sequence },
	2: { label: 'Che cosa stampa dopo una lettura', constraints: ['one or two readings of one word', 'in about 4 out of 10 the names of the variables are in quotes'], build: level2, check: sequence },
	3: { label: 'Quale programma stampa', constraints: ['four programs that write different things on the two tests'], build: level3, check: sequence },
	4: { label: 'Costruire il diagramma', constraints: ['graded by running the chart on two tests'], build: level4, check: sequence },
	5: { label: 'Scrivere il programma', constraints: ['graded by running the program on two tests', 'the first reading is given'], build: level5, check: sequence }
});
