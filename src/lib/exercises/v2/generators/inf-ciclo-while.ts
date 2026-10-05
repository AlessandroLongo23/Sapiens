/**
 * Il ciclo while. Spec: specs/exercises/inf-ciclo-while.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/60-inf-ciclo-while.md). The loop of every exercise
 * is one of three families (a countdown, a count upwards with a step, a sum of the values of a counter), with the
 * numbers drawn each time. It is written once, in the language of the flowcharts, and shown as a chart, as a
 * program in Python and in C++, or left to the student to build or to write (v2/inf-programmi.ts).
 *
 * 1. what a program writes; 2. how many times the body runs; 3. the program of a flowchart; 4. the flowchart of
 * a program; 5. build the flowchart; 6. write the program.
 *
 * In the two open levels the loop reads the number it stops at (`asked`), and is tried on two of them: what it
 * writes cannot be typed by hand, one line after the other. The answer must also have a loop, and in level 6 a
 * `while`, which is what the exercise names (v2/costrutti.ts).
 */
import type { Rng } from '../types';
import { chartAnswer, chartOption, choose, codeOption, codes, lines, makeGenerator, needing, output, plain, programAnswer, textOption, writtenOption, wrongPrograms, type Built } from '../inf-programmi';

export const ID = 'inf-ciclo-while';

/** A loop with a counter: where it starts, the condition that keeps it going, what the body does, how the counter moves. */
interface Loop {
	family: 'rovescia' | 'salita' | 'somma';
	/** What the loop is for, as the exercise says it. */
	task: string;
	start: number;
	limit: number;
	step: number;
	source: string;
	/** The same loop with a mistake a student makes, each a different one. */
	wrong: string[];
}

const countdown = (start: number, step: number): Loop => {
	const make = (from: number, cond: string, body: string[]) => lines(`i = ${from}`, `finché ${cond}`, ...body.map((row) => `    ${row}`), 'scrivi "via"');
	const move = `i = i - ${step}`;
	return {
		family: 'rovescia',
		task: `scrive i numeri da ${start} in giù, di ${step} in ${step}, finché restano maggiori di zero, e poi scrive "via"`,
		start,
		limit: 0,
		step,
		source: make(start, 'i > 0', ['scrivi i', move]),
		wrong: [make(start, 'i >= 0', ['scrivi i', move]), make(start, 'i > 0', [move, 'scrivi i']), make(start - step, 'i > 0', ['scrivi i', move]), make(start, 'i > 1', ['scrivi i', move]), make(start, 'i > 0', ['scrivi i', `i = i - ${step + 1}`])]
	};
};

const climb = (start: number, limit: number, step: number): Loop => {
	const make = (from: number, cond: string, body: string[]) => lines(`i = ${from}`, `finché ${cond}`, ...body.map((row) => `    ${row}`));
	const move = `i = i + ${step}`;
	return {
		family: 'salita',
		task: `scrive i numeri da ${start} a ${limit}, di ${step} in ${step}`,
		start,
		limit,
		step,
		source: make(start, `i <= ${limit}`, ['scrivi i', move]),
		wrong: [make(start, `i < ${limit}`, ['scrivi i', move]), make(start, `i <= ${limit}`, [move, 'scrivi i']), make(start + step, `i <= ${limit}`, ['scrivi i', move]), make(start, `i <= ${limit + step}`, ['scrivi i', move]), make(start, `i <= ${limit}`, ['scrivi i', `i = i + ${step + 1}`])]
	};
};

const sum = (limit: number): Loop => {
	const make = (total: number, from: number, cond: string, body: string[]) => lines(`somma = ${total}`, `i = ${from}`, `finché ${cond}`, ...body.map((row) => `    ${row}`), 'scrivi somma');
	return {
		family: 'somma',
		task: `somma i numeri da 1 a ${limit} e scrive il risultato`,
		start: 1,
		limit,
		step: 1,
		source: make(0, 1, `i <= ${limit}`, ['somma = somma + i', 'i = i + 1']),
		wrong: [make(0, 1, `i < ${limit}`, ['somma = somma + i', 'i = i + 1']), make(0, 1, `i <= ${limit}`, ['i = i + 1', 'somma = somma + i']), make(1, 1, `i <= ${limit}`, ['somma = somma + i', 'i = i + 1']), make(0, 0, `i < ${limit}`, ['somma = somma + i', 'i = i + 1']), make(0, 1, `i <= ${limit}`, ['somma = i', 'i = i + 1'])]
	};
};

function loop(rng: Rng): Loop {
	const family = rng.pick(['rovescia', 'salita', 'somma'] as const);
	if (family === 'rovescia') {
		const step = rng.int(1, 3);
		return countdown(step * rng.int(3, 5) + rng.int(0, step - 1), step);
	}
	if (family === 'salita') {
		const step = rng.int(2, 4);
		const start = rng.int(1, 5);
		return climb(start, start + step * rng.int(2, 4), step);
	}
	return sum(rng.int(4, 7));
}

/** A loop of the same family that reads the number it stops at: what the open levels ask for. */
interface Asked {
	task: string;
	source: string;
	wrong: string[];
	/** Two runs, on different numbers. */
	tests: number[][];
}

function asked(l: Loop): Asked {
	const { step } = l;
	if (l.family === 'rovescia') {
		const make = (cond: string, body: string[], after = ['scrivi "via"']) => lines('leggi n', `finché ${cond}`, ...body.map((row) => `    ${row}`), ...after);
		const move = `n = n - ${step}`;
		return {
			task: `legge un numero n e scrive i numeri da n in giù${step > 1 ? `, di ${step} in ${step},` : ''} finché restano maggiori di zero, e poi scrive "via"`,
			source: make('n > 0', ['scrivi n', move]),
			wrong: [make('n >= 0', ['scrivi n', move]), make('n > 0', [move, 'scrivi n']), make('n > 0', ['scrivi n', `n = n - ${step + 1}`]), make('n > 0', ['scrivi n', move, 'scrivi "via"'], []), make('n > 1', ['scrivi n', move])],
			// the second number is a multiple of the step, where a loop that goes on to zero writes one line too many
			tests: [[l.start], [step * (Math.floor(l.start / step) + 1)]]
		};
	}
	if (l.family === 'salita') {
		const make = (from: number, cond: string, body: string[]) => lines('leggi n', `i = ${from}`, `finché ${cond}`, ...body.map((row) => `    ${row}`));
		const move = `i = i + ${step}`;
		return {
			task: `legge un numero n e scrive i numeri da ${l.start} in su, di ${step} in ${step}, finché non superano n`,
			source: make(l.start, 'i <= n', ['scrivi i', move]),
			wrong: [make(l.start, 'i < n', ['scrivi i', move]), make(l.start, 'i <= n', [move, 'scrivi i']), make(l.start + step, 'i <= n', ['scrivi i', move]), make(l.start, 'i <= n', ['scrivi i', `i = i + ${step + 1}`]), make(0, 'i <= n', ['scrivi i', move])],
			// one number the counter lands on, one it jumps over
			tests: [[l.limit], [l.limit + step + 1]]
		};
	}
	const make = (total: number, from: number, cond: string, body: string[]) => lines('leggi n', `somma = ${total}`, `i = ${from}`, `finché ${cond}`, ...body.map((row) => `    ${row}`), 'scrivi somma');
	return {
		task: 'legge un numero n e scrive la somma dei numeri da 1 a n, calcolata aggiungendo un numero alla volta',
		source: make(0, 1, 'i <= n', ['somma = somma + i', 'i = i + 1']),
		wrong: [make(0, 1, 'i < n', ['somma = somma + i', 'i = i + 1']), make(0, 1, 'i <= n', ['i = i + 1', 'somma = somma + i']), make(1, 1, 'i <= n', ['somma = somma + i', 'i = i + 1']), make(0, 1, 'i <= n', ['somma = i', 'i = i + 1']), make(0, 0, 'i < n', ['somma = somma + i', 'i = i + 1'])],
		tests: [[l.limit], [l.limit + 3]]
	};
}

/** Three wrong loops for an open level: each writes something else than the right one on one of its two runs. */
function askedMistakes(a: Asked): string[] {
	const wrong = wrongPrograms(a.source, a.wrong, a.tests);
	if (wrong.length < 3) throw new Error(`${ID}: only ${wrong.length} wrong loops for ${a.source}`);
	return wrong.slice(0, 3);
}

/** How many times the body of a loop runs: the lines it writes inside it, counted on a copy that writes one per turn. */
const turns = (l: Loop) => (l.family === 'somma' ? l.limit : (output(l.source) ?? []).filter((row) => row !== 'via').length);

const said = (written: string[]) => written.join(', ');

/** The wrong loops of a sample: three that write something else than the right one, in the order they are listed. */
function mistakes(l: Loop): string[] {
	const wrong = wrongPrograms(l.source, l.wrong, [[]]);
	if (wrong.length < 3) throw new Error(`${ID}: only ${wrong.length} wrong loops for ${l.source}`);
	return wrong.slice(0, 3);
}

/** For the independent check (scripts/exercises/checkers): the reference loop and the runs it is compared on. */
const params = (l: Loop, extra: Record<string, unknown> = {}) => ({ family: l.family, source: l.source, tests: [[]], ...extra });

function level1(rng: Rng): Built {
	const l = loop(rng);
	const written = output(l.source)!;
	const wrong = mistakes(l).map((source) => output(source) ?? ['non finisce mai']);
	return {
		prompt: 'Segui il programma un giro alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: codes(l.source),
		solution: said(written),
		steps: [`La variabile i parte da ${l.start}.`, `A ogni giro si controlla la condizione, si esegue il corpo e i ${l.family === 'rovescia' ? 'diminuisce' : 'aumenta'} di ${l.step}.`, `Il corpo viene eseguito ${turns(l)} volte, poi la condizione è falsa e il ciclo finisce.`],
		answer: choose(rng, writtenOption(written), wrong.map(writtenOption)),
		params: params(l)
	};
}

function level2(rng: Rng): Built {
	const l = loop(rng);
	const n = turns(l);
	return {
		prompt: 'Conta i giri del ciclo.',
		problem: 'Quante volte viene eseguito il corpo del ciclo?',
		code: codes(l.source),
		solution: `${n} volte`,
		steps: [`La variabile i parte da ${l.start} e a ogni giro ${l.family === 'rovescia' ? 'diminuisce' : 'aumenta'} di ${l.step}.`, `La condizione è vera ${n} volte: il corpo viene eseguito ${n} volte.`, `La condizione viene controllata una volta in più, ${n + 1} in tutto: l'ultima è quella che fa uscire dal ciclo.`],
		answer: choose(rng, textOption(`${n} volte`, String(n)), [n + 1, n - 1, n + 2, n - 2].filter((k) => k > 0).map((k) => textOption(`${k} volte`, String(k)))),
		params: params(l, { turns: n })
	};
}

function level3(rng: Rng): Built {
	const l = loop(rng);
	return {
		prompt: 'Traduci il diagramma un blocco alla volta.',
		problem: 'Quale programma corrisponde a questo diagramma di flusso?',
		chart: l.source,
		solution: 'Il programma con la stessa condizione e le istruzioni del corpo nello stesso ordine.',
		steps: ['Il rombo con la freccia che torna indietro è la riga del while, con la stessa condizione.', 'I blocchi del giro sono le righe del corpo, nello stesso ordine in cui le frecce li attraversano.', 'I blocchi prima del rombo vengono prima del ciclo, quelli dopo il ramo "no" vengono dopo.'],
		solutionCode: codes(l.source),
		answer: choose(rng, codeOption(l.source), mistakes(l).map((source) => codeOption(source))),
		params: params(l)
	};
}

function level4(rng: Rng): Built {
	const l = loop(rng);
	return {
		prompt: 'Riconosci nel diagramma le righe del programma.',
		problem: 'Quale diagramma di flusso corrisponde a questo programma?',
		code: codes(l.source),
		solution: 'Il diagramma con la stessa condizione nel rombo e i blocchi del giro nello stesso ordine.',
		steps: ['La riga del while diventa un rombo, con una freccia che dal fondo del corpo torna sopra il rombo.', 'Le righe del corpo sono i blocchi del giro, nello stesso ordine.', 'Controlla la condizione nel rombo e il valore da cui parte la variabile.'],
		solutionChart: l.source,
		answer: choose(rng, chartOption(l.source), mistakes(l).map(chartOption)),
		params: params(l)
	};
}

function level5(rng: Rng): Built {
	const l = loop(rng);
	const a = asked(l);
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${a.task}.`,
		solution: 'Un diagramma con la lettura di n, un rombo con la condizione e, nel giro, il blocco che fa cambiare la variabile del ciclo.',
		steps: ['Prima del ciclo leggi n e dai alle altre variabili il valore di partenza.', 'Metti un ciclo con la condizione che resta vera finché ci sono ancora giri da fare.', 'Nel giro metti prima quello che si fa a ogni giro, poi il blocco che cambia la variabile: senza, il ciclo non finisce.'],
		solutionChart: a.source,
		answer: needing(chartAnswer(a.source, a.tests), 'ciclo'),
		choice: choose(rng, chartOption(a.source), askedMistakes(a).map(chartOption)),
		params: { family: l.family, source: a.source, tests: a.tests }
	};
}

function level6(rng: Rng): Built {
	const l = loop(rng);
	const a = asked(l);
	return {
		prompt: 'Scrivi il programma.',
		problem: `Scrivi un programma che ${a.task}. Usa un ciclo while. La lettura c'è già.`,
		solution: 'Un programma con il while e la sua condizione e, nel corpo, la riga che fa cambiare la variabile del ciclo.',
		steps: ['Prima del ciclo dai alle variabili che servono il valore di partenza: n è già letto.', 'Scrivi il while con la condizione che resta vera finché ci sono ancora giri da fare.', 'Nel corpo metti prima quello che si fa a ogni giro, poi la riga che cambia la variabile.'],
		solutionCode: codes(a.source, a.tests[0]),
		answer: needing(programAnswer(a.source, a.tests, 'leggi n\n'), 'while'),
		choice: choose(rng, codeOption(a.source, a.tests[0]), askedMistakes(a).map((source) => codeOption(source, a.tests[0]))),
		params: { family: l.family, source: a.source, tests: a.tests }
	};
}

/** Every loop shown or asked for must write the same in the chart, in Python and in C++, and end. */
const sound = (sample: { params: Record<string, unknown> }) => {
	const source = String(sample.params.source);
	const errors: string[] = [];
	const tests = sample.params.tests as number[][];
	const why = plain(source, tests[0]);
	if (why) errors.push(`the loop ${why}`);
	if (tests.some((inputs) => !output(source, inputs))) errors.push('the loop does not end');
	return errors;
};

export default makeGenerator(ID, 'Il ciclo while', {
	1: { label: 'Che cosa scrive un ciclo', constraints: ['a loop of at most 6 turns', 'four different outputs'], build: level1, check: sound },
	2: { label: 'Quanti giri fa un ciclo', constraints: ['a loop of at most 6 turns'], build: level2, check: sound },
	3: { label: 'Dal diagramma al programma', constraints: ['four programs that write different things'], build: level3, check: sound },
	4: { label: 'Dal programma al diagramma', constraints: ['four charts that write different things'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma di un ciclo', constraints: ['the loop reads its number', 'graded by running the chart on two numbers', 'needs a loop'], build: level5, check: sound },
	6: { label: 'Scrivere un ciclo', constraints: ['the loop reads its number', 'graded by running the program on two numbers', 'needs a while'], build: level6, check: sound }
});
