/**
 * Lo pseudocodice. Spec: specs/exercises/inf-pseudocodice.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/48-inf-pseudocodice.md). An option or a question
 * of an exercise is one paragraph of text: a pseudocode of several lines, with its indentation, cannot be shown as
 * such. So the lines of pseudocode appear one at a time (levels 1 and 3), the indentation is counted and reasoned
 * on from the flowchart of the same algorithm (levels 4 and 5), and in level 6 the pseudocode to turn into a chart
 * is written on one line, with a mark on the indented lines (v2/inf-alg.ts).
 */
import type { Rng } from '../types';
import { chartAnswer, chartOption, choose, makeGenerator, output, shuffle, textOption, type Built } from '../inf-programmi';
import { byAdding, cheaper, countdown, delivery, discount, divisible, euclid, firstTest, fizz, given, goal, halvings, mistakes, multiples, paramsOf, passes, quiz, repeat, said, savings, sound, sumTo, threshold, writtenChoice, type Algo } from '../inf-alg';

export const ID = 'inf-pseudocodice';

/** A line of a chart's program as the lesson writes it in pseudocode: the arrow, and the signs of the blocks. */
export function pseudo(row: string): string {
	const text = row.trim();
	const signs = (s: string) =>
		s
			.split(/("[^"]*")/)
			.map((part, i) => (i % 2 ? part : part.replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠').replace(/==/g, '=').replace(/\*/g, '·').replace(/\/\//g, 'div').replace(/%/g, 'mod').replace(/-/g, '−')))
			.join('');
	if (/^(leggi|scrivi|se|finché|altrimenti)(?=\s|$)/.test(text)) return signs(text);
	const [name, ...rest] = text.split(' = ');
	return `${name} ← ${signs(rest.join(' = '))}`;
}

// ---------------------------------------------------------------------------
// Level 1: the words of pseudocode

const VARS = ['n', 'a', 'b', 'p', 's', 't', 'x', 'c', 'voto', 'prezzo', 'somma', 'punti', 'totale', 'età'];
const WORDS = ['ciao', 'fatto', 'via', 'pari', 'sufficiente', 'fine', 'errore', 'ridotto'];
const COMPARE: [op: string, said: string][] = [
	['>', 'è maggiore di'],
	['<', 'è minore di'],
	['≥', 'è maggiore o uguale a'],
	['≤', 'è minore o uguale a'],
	['=', 'è uguale a'],
	['≠', 'è diverso da']
];

const WHY = {
	assegna: 'Un calcolo si scrive con la freccia: a destra quello che si calcola, a sinistra la variabile in cui va il risultato. Il segno = da solo è un confronto, cioè una domanda.',
	leggi: 'La parola per chiedere un valore è "leggi", seguita dal nome della variabile in cui il valore va a finire.',
	'scrivi testo': 'La parola per mostrare qualcosa è "scrivi". Un testo va tra virgolette: senza, sarebbe il nome di una variabile.',
	'scrivi valore': 'La parola per mostrare qualcosa è "scrivi". Il nome di una variabile va senza virgolette: con le virgolette si scriverebbe la lettera, non il suo valore.',
	selezione: 'Una scelta si scrive con "se" seguito dalla condizione, e le righe che ne dipendono sono rientrate sotto. In una condizione il confronto di uguaglianza è il segno =, non la freccia.',
	ripetizione: 'Una ripetizione si scrive con "finché" seguito dalla condizione: le righe rientrate si ripetono finché la condizione è vera. Con "se" verrebbero eseguite al più una volta.'
} as const;
type Word = keyof typeof WHY;

function level1(rng: Rng): Built {
	const kind = rng.pick(Object.keys(WHY) as Word[]);
	const v = rng.pick(VARS);
	const k = rng.int(1, 20);
	const w = rng.pick(WORDS);
	const [op, opSaid] = rng.pick(COMPARE);
	const sign = rng.pick([
		['+', 'più'],
		['−', 'meno'],
		['·', 'per']
	] as const);
	const plain = rng.next() < 0.3;
	let action: string;
	let right: string;
	let wrong: string[];
	if (kind === 'assegna') {
		const expr = plain ? String(k) : `${v} ${sign[0]} ${k}`;
		action = plain ? `mettere ${k} nella variabile ${v}` : `calcolare ${v} ${sign[1]} ${k} e mettere il risultato in ${v}`;
		right = `${v} ← ${expr}`;
		wrong = [`${v} = ${expr}`, `${expr} ← ${v}`, `scrivi ${expr}`, `leggi ${v}`];
	} else if (kind === 'leggi') {
		action = `chiedere un valore e metterlo nella variabile ${v}`;
		right = `leggi ${v}`;
		wrong = [`scrivi ${v}`, `${v} ← leggi`, `leggi "${v}"`, `se ${v}`];
	} else if (kind === 'scrivi testo') {
		action = `mostrare la parola ${w}`;
		right = `scrivi "${w}"`;
		wrong = [`scrivi ${w}`, `leggi "${w}"`, `"${w}" ← scrivi`, `${w} ← scrivi`];
	} else if (kind === 'scrivi valore') {
		action = `mostrare il valore della variabile ${v}`;
		right = `scrivi ${v}`;
		wrong = [`scrivi "${v}"`, `leggi ${v}`, `${v} ← scrivi`, `mostra ${v}`];
	} else if (kind === 'selezione') {
		action = `eseguire le righe rientrate sotto solo se ${v} ${opSaid} ${k}, e una volta sola`;
		right = `se ${v} ${op} ${k}`;
		wrong = [`finché ${v} ${op} ${k}`, `se ${v} ← ${k}`, `${v} ${op} ${k}`, `scrivi ${v} ${op} ${k}`];
	} else {
		action = `ripetere le righe rientrate sotto finché ${v} ${opSaid} ${k}`;
		right = `finché ${v} ${op} ${k}`;
		wrong = [`se ${v} ${op} ${k}`, `ripeti ${v} ${op} ${k}`, `finché ${v} ← ${k}`, `altrimenti ${v} ${op} ${k}`];
	}
	return {
		prompt: 'Scegli la riga di pseudocodice.',
		problem: `Quale riga di pseudocodice dice di ${action}?`,
		solution: right,
		steps: ['Lo pseudocodice usa poche parole fisse: leggi, scrivi, la freccia per i calcoli, se e altrimenti per scegliere, finché per ripetere.', WHY[kind]],
		answer: choose(rng, textOption(right), [wrong[0], ...shuffle(rng, wrong.slice(1))].map((x) => textOption(x))),
		// only the pieces the line is made of: the others would make two equal exercises look different
		params: {
			case: kind,
			...(kind === 'scrivi testo' ? { w } : { v }),
			...(kind === 'assegna' ? { k, plain, ...(plain ? {} : { sign: sign[0] }) } : {}),
			...(kind === 'selezione' || kind === 'ripetizione' ? { k, op } : {})
		}
	};
}

// ---------------------------------------------------------------------------
// Level 2: div and mod

function level2(rng: Rng): Built {
	const b = rng.int(2, 9);
	const q = rng.int(2, 9);
	const r = rng.int(1, b - 1);
	const a = b * q + r;
	const op = rng.pick(['div', 'mod'] as const);
	const value = op === 'div' ? q : r;
	return {
		prompt: 'Calcola il quoziente o il resto.',
		problem: `In uno pseudocodice c'è la riga «x ← ${a} ${op} ${b}». Quanto vale x dopo questa riga?`,
		solution: String(value),
		steps: [`Il ${b} sta nel ${a} per ${q} volte, perché ${b} · ${q} = ${b * q}, e avanza ${r}.`, `"div" è il quoziente della divisione tra interi e "mod" è il resto: ${a} div ${b} vale ${q} e ${a} mod ${b} vale ${r}.`],
		answer: choose(
			rng,
			textOption(String(value)),
			[op === 'div' ? r : q, a - b, q + 1, b, r + 1, 0].map((x) => textOption(String(x)))
		),
		params: { case: op, a, b }
	};
}

// ---------------------------------------------------------------------------
// Level 3: from a block to its line

const pickOne = (rng: Rng, makers: ((rng: Rng) => Algo)[]) => rng.pick(makers)(rng);
const rowsOf = (source: string) => source.split('\n').filter((row) => row.trim());

function level3(rng: Rng): Built {
	const a = pickOne(rng, [discount, delivery, cheaper, quiz, divisible, countdown, sumTo, multiples, savings, halvings, goal]);
	const rows = rowsOf(a.source);
	const assign = rows.find((row) => !/^\s*(leggi|scrivi|se|finché|altrimenti)(?=\s|$)/.test(row));
	const ask = assign && rng.next() < 0.4 ? 'rettangolo' : 'rombo';
	if (ask === 'rombo') {
		const row = rows.find((r) => /^(se|finché)(?=\s|$)/.test(r))!;
		const right = pseudo(row);
		const [word, ...rest] = right.split(' ');
		const cond = rest.join(' ');
		const other = word === 'se' ? 'finché' : 'se';
		return {
			prompt: 'Passa dal diagramma allo pseudocodice.',
			problem: 'Nello pseudocodice di questo diagramma, quale riga corrisponde al rombo?',
			chart: a.source,
			solution: right,
			steps: [
				word === 'se' ? 'Dopo i rami di questo rombo le frecce si riuniscono e si prosegue in avanti: è una selezione, che si scrive con "se".' : 'Dal fondo del giro una freccia risale sopra il rombo: è una ripetizione, che si scrive con "finché".',
				'Dopo la parola va la condizione, con gli stessi segni che ha nel rombo e senza il punto di domanda.'
			],
			answer: choose(rng, textOption(right), [`${other} ${cond}`, ...shuffle(rng, [`${cond}?`, `ripeti ${cond}`, `altrimenti ${cond}`, `scrivi ${cond}`])].map((x) => textOption(x))),
			params: paramsOf(a, { ask })
		};
	}
	const right = pseudo(assign!);
	const [name, expr] = right.split(' ← ');
	return {
		prompt: 'Passa dal diagramma allo pseudocodice.',
		problem: "Nello pseudocodice di questo diagramma, quale riga corrisponde al primo rettangolo dall'alto?",
		chart: a.source,
		solution: right,
		steps: ['Un rettangolo è un calcolo: la sua riga ha la variabile, la freccia e quello che si calcola, scritti come nel blocco.', 'Con il segno = al posto della freccia la riga sarebbe una domanda, non un ordine.'],
		answer: choose(rng, textOption(right), [`${name} = ${expr}`, ...shuffle(rng, [`${expr} ← ${name}`, `scrivi ${expr}`, `leggi ${name}`, `se ${name} = ${expr}`])].map((x) => textOption(x))),
		params: paramsOf(a, { ask })
	};
}

// ---------------------------------------------------------------------------
// Level 4: the indentation, counted

function level4(rng: Rng): Built {
	const a = pickOne(rng, [discount, delivery, threshold, cheaper, countdown, sumTo, multiples, goal, repeat, fizz, passes, euclid]);
	const rows = rowsOf(a.source);
	const indented = rows.filter((row) => row.startsWith(' ')).length;
	const total = rows.length + 2;
	const hasElse = rows.some((row) => row.trim() === 'altrimenti');
	const ask = rng.pick(['rientrate', 'righe'] as const);
	const note = hasElse ? ' La parola "altrimenti" è una riga dello pseudocodice anche se nel diagramma non ha un blocco suo.' : '';
	if (ask === 'rientrate') {
		return {
			prompt: 'Conta le righe rientrate.',
			problem: 'Scrivi su un foglio lo pseudocodice di questo diagramma, una riga per blocco. Quante righe sono rientrate?',
			chart: a.source,
			solution: `${indented} righe`,
			steps: [`Sono rientrate le righe che stanno dentro un ramo o dentro un giro: qui sono ${indented}.${note}`, 'Le righe con "se" e "finché" di primo livello, e tutto quello che viene prima e dopo, cominciano al margine.'],
			answer: choose(
				rng,
				textOption(`${indented}`),
				[indented + 1, indented - 1, rows.length, indented + 2, total, 0].filter((x) => x >= 0).map((x) => textOption(`${x}`))
			),
			params: paramsOf(a, { ask })
		};
	}
	return {
		prompt: 'Conta le righe dello pseudocodice.',
		problem: 'Scrivi su un foglio lo pseudocodice di questo diagramma. Quante righe ha, contando anche "inizio" e "fine"?',
		chart: a.source,
		solution: `${total} righe`,
		steps: [`Ogni blocco è una riga: i due ovali sono le righe "inizio" e "fine", e in mezzo ce ne sono ${rows.length}.${note}`, `In tutto le righe sono ${total}.`],
		answer: choose(
			rng,
			textOption(`${total}`),
			[rows.length, total - 1, total + 1, total + 2, indented].filter((x) => x > 0).map((x) => textOption(`${x}`))
		),
		params: paramsOf(a, { ask })
	};
}

// ---------------------------------------------------------------------------
// Level 5: a line indented by mistake

/** The same program with its last line indented like the one above it. */
export function misindented(source: string): string {
	const rows = rowsOf(source);
	const above = rows[rows.length - 2];
	const indent = above.slice(0, above.length - above.trimStart().length);
	return [...rows.slice(0, -1), indent + rows[rows.length - 1].trim()].join('\n') + '\n';
}

function level5(rng: Rng): Built {
	// two loops for every selection: with a selection the copy can only write nothing
	const a = pickOne(rng, [countdown, sumTo, goal, savings, halvings, byAdding, countdown, sumTo, goal, savings, halvings, byAdding, discount, cheaper, quiz]);
	const copy = misindented(a.source);
	const differs = (t: number[]) => {
		const w = output(copy, t);
		return w !== null && w.length <= 9 && w.join() !== output(a.source, t)!.join();
	};
	const inputs = shuffle(rng, a.tests).find(differs);
	if (!inputs) throw new Error(`${ID}: the indentation does not change ${a.family}`);
	const written = output(copy, inputs)!;
	const last = pseudo(rowsOf(a.source).at(-1)!);
	const loop = a.structure === 'iterazione';
	return {
		prompt: 'Il rientro cambia l\'algoritmo.',
		problem: `Questo è il diagramma di uno pseudocodice. Chi lo ricopia sbaglia il rientro dell'ultima riga prima di "fine": scrive «${last}» rientrata come la riga sopra. Che cosa scrive lo pseudocodice ricopiato ${given(inputs)}?`,
		chart: a.source,
		solution: written.length ? `Scrive ${said(written)}.` : 'Non scrive niente.',
		steps: [
			`Rientrata, la riga «${last}» non sta più dopo ${loop ? 'il giro' : 'la selezione'}: finisce dentro ${loop ? 'il giro, e viene eseguita a ogni giro' : 'il ramo "sì", e viene eseguita solo quando la condizione è vera'}.`,
			`${given(inputs)[0].toUpperCase()}${given(inputs).slice(1)} lo pseudocodice ricopiato ${written.length ? `scrive ${said(written)}` : 'non scrive niente'}, mentre quello giusto scrive ${said(output(a.source, inputs)!)}.`
		],
		answer: writtenChoice(
			rng,
			copy,
			inputs,
			a.wrong.map(([, s]) => s),
			[output(a.source, inputs)!]
		),
		params: paramsOf(a, { inputs, tests: firstTest(a, inputs) })
	};
}

// ---------------------------------------------------------------------------
// Level 6: from the pseudocode to the chart

/** A pseudocode on one line: the lines parted by a bar, a mark before those that are indented. */
export const inline = (source: string) => ['inizio', ...rowsOf(source).map((row) => (row.startsWith(' ') ? '► ' : '') + pseudo(row)), 'fine'].join(' / ');

function level6(rng: Rng): Built {
	const a = pickOne(rng, [divisible, countdown, multiples, discount, sumTo, threshold, halvings, delivery]);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di questo pseudocodice. Qui le righe sono separate da una barra, e il segno ► davanti a una riga dice che è rientrata: ${inline(a.source)}`,
		solution: 'Un diagramma con un blocco per ogni riga, nello stesso ordine, e con dentro il ramo o il giro i blocchi delle righe rientrate.',
		steps: [
			'Ogni riga diventa un blocco: "leggi" e "scrivi" un parallelogramma, la riga con la freccia un rettangolo, "se" una selezione, "finché" un ciclo.',
			'Le righe rientrate vanno dentro il ramo o dentro il giro; la prima riga che torna al margine sta dopo, fuori.',
			'Scrivendo dentro un blocco, ≤ si batte <=, ≠ si batte !=, e il confronto di uguaglianza vuole due segni, ==.'
		],
		solutionChart: a.source,
		answer: chartAnswer(a.source, a.tests),
		choice: choose(rng, chartOption(a.source), mistakes(a, ['parola nel giro', 'scrive nel ramo', 'il no fuori dal ramo', 'selezione', 'senza altrimenti']).map(chartOption)),
		params: paramsOf(a)
	};
}

export default makeGenerator(ID, 'Lo pseudocodice', {
	1: { label: 'Le parole dello pseudocodice', constraints: ['an action in words, four lines of pseudocode', 'the first distractor is the mistake of the lesson: = for the arrow, se for finché, a text without quotes'], build: level1 },
	2: { label: 'Quoziente e resto: div e mod', constraints: ['a divisor from 2 to 9, a remainder that is not zero', 'four different numbers'], build: level2 },
	3: { label: 'Dal blocco alla riga', constraints: ['a chart with one selection or one loop', 'the line of its rhombus, or of its first rectangle'], build: level3, check: sound },
	4: { label: 'Contare il rientro', constraints: ['a chart, also with one structure inside another', 'the indented lines of its pseudocode, or all its lines'], build: level4, check: sound },
	5: { label: 'Un rientro sbagliato', constraints: ['the last line indented by mistake', 'on the inputs asked the copy writes something else than the original, at most 9 lines'], build: level5, check: sound },
	6: { label: 'Dallo pseudocodice al diagramma', constraints: ['the pseudocode on one line, with a mark on the indented lines', 'graded by running the chart on at least two tests'], build: level6, check: sound }
});
