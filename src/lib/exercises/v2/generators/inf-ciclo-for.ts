/**
 * Il ciclo for. Spec: specs/exercises/inf-ciclo-for.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/61-inf-ciclo-for.md). Every loop is written once in
 * the language of the flowcharts, as a counter with its start, its condition and its step (v2/inf-iter.ts): from
 * there come the flowchart, the program with `while` and the program with `for` in Python and in C++.
 *
 * 1. what a for with a step of one writes; 2. with another step, or backwards; 3. how many turns; 4. the for of a
 * while; 5. build the flowchart of a for; 6. write the for.
 */
import type { Rng, Sample } from '../types';
import { chartAnswer, chartOption, codes, lines, makeGenerator, needing, output, plain, programAnswer, textOption, writtenOption, type Built } from '../inf-programmi';
import { counted, cppOf, fits, forCodes, forOption, inside, options, rangeOf, Retry, retrying, stopOf, wrongOnes, type Count, type Op } from '../inf-iter';

export const ID = 'inf-ciclo-for';

type Form = 'uno' | 'due' | 'passo' | 'indietro';

/** A for that writes something at every turn: the way its `range` is written, the counter, what the body writes. */
interface Shape {
	form: Form;
	c: Count;
	body: string;
}

const sourceOf = (s: Shape) => lines(...counted('i', s.c, [`scrivi ${s.body}`]));

function shape(rng: Rng, forms: readonly Form[]): Shape {
	const form = rng.pick(forms);
	const body = rng.int(0, 2) === 0 ? `${rng.int(2, 5)} * i` : 'i';
	const strict = rng.int(0, 1) === 1;
	if (form === 'uno') return { form, body, c: { from: 0, op: '<', to: rng.int(3, 7), step: 1 } };
	if (form === 'due') {
		const from = rng.int(1, 9);
		const last = from + rng.int(2, 5);
		return { form, body, c: strict ? { from, op: '<', to: last + 1, step: 1 } : { from, op: '<=', to: last, step: 1 } };
	}
	if (form === 'passo') {
		const step = rng.int(2, 4);
		const from = rng.int(0, 6);
		const last = from + step * rng.int(2, 5);
		return { form, body, c: strict ? { from, op: '<', to: last + rng.int(1, step), step } : { from, op: '<=', to: last + rng.int(0, step - 1), step } };
	}
	const step = rng.int(1, 3);
	const to = rng.int(0, 3);
	const last = strict ? to + rng.int(1, step) : to + rng.int(0, step - 1);
	return { form, body, c: { from: last + step * rng.int(2, 5), op: strict ? '>' : '>=', to, step: -step } };
}

const FLIP: Record<Op, Op> = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };

/** The same loop read wrongly, each a different mistake: the arrival taken as included, the start moved, the step ignored. */
function slips(s: Shape): Shape[] {
	const { c } = s;
	const from = Number(c.from);
	const to = Number(c.to);
	const way = Math.sign(c.step);
	const counts: Count[] = [
		{ ...c, to: to + c.step },
		{ ...c, from: from + c.step },
		{ ...c, to: to - c.step },
		...(s.form === 'uno' ? [{ ...c, from: 1, op: '<=' as Op }] : []),
		{ ...c, op: FLIP[c.op] },
		{ ...c, step: Math.abs(c.step) > 1 ? way : 2 * way },
		{ ...c, step: c.step + way },
		{ ...c, from: from - c.step }
	];
	return counts.map((count) => ({ ...s, c: count }));
}

const turnsOf = (s: Shape) => (output(sourceOf(s)) ?? []).length;

/** How the counter of a loop moves, in the words of the two languages. */
function explain(s: Shape): string[] {
	const { c } = s;
	const written = output(sourceOf(s))!;
	const last = Number(c.from) + c.step * (written.length - 1);
	return [
		`Il contatore i parte da ${c.from} e a ogni giro ${c.step > 0 ? 'aumenta' : 'diminuisce'} di ${Math.abs(c.step)}.`,
		`In Python ${rangeOf(c)} si ferma prima di ${stopOf(c)}, che è escluso; in C++ si fa un altro giro finché i ${c.op} ${c.to}. L'ultimo valore di i è ${last}.`,
		`Il corpo viene eseguito ${written.length} volte${s.body === 'i' ? '' : `, e ogni volta scrive ${s.body.replace('*', '·')}`}.`
	];
}

const params = (s: Shape, extra: Record<string, unknown> = {}) => ({ case: s.form, source: sourceOf(s), tests: [[]], ...extra });

const writes = (forms: readonly Form[]) => (rng: Rng): Built =>
	retrying(() => {
		const s = shape(rng, forms);
		const source = sourceOf(s);
		const written = output(source)!;
		const wrong = wrongOnes(source, slips(s).map(sourceOf), [[]])
			.map((w) => output(w) ?? [])
			.filter((w) => w.length > 0 && w.length <= 8);
		return {
			prompt: 'Segui il contatore un giro alla volta.',
			problem: 'Che cosa scrive questo programma?',
			code: forCodes(source),
			solution: written.join(', '),
			steps: explain(s),
			answer: options(rng, writtenOption(written), wrong.map(writtenOption)),
			params: params(s)
		};
	});

function level3(rng: Rng): Built {
	return retrying(() => {
		const s = shape(rng, ['uno', 'due', 'passo', 'indietro']);
		const n = turnsOf(s);
		const span = Math.abs(Number(s.c.to) - Number(s.c.from));
		const others = [n + 1, n - 1, span, span + 1, Number(s.c.to), n + 2].filter((k) => k > 0 && k !== n);
		return {
			prompt: 'Conta i giri del ciclo for.',
			problem: 'Quante volte viene eseguito il corpo del ciclo?',
			code: forCodes(sourceOf(s)),
			solution: `${n} volte`,
			steps: explain(s),
			answer: options(
				rng,
				textOption(`${n} volte`, String(n)),
				others.map((k) => textOption(`${k} volte`, String(k)))
			),
			params: params(s, { turns: n })
		};
	});
}

function level4(rng: Rng): Built {
	return retrying(() => {
		const s = shape(rng, ['uno', 'due', 'passo', 'indietro']);
		const source = sourceOf(s);
		if (!fits(forCodes(source))) throw new Retry('the for is too wide');
		const wrong = wrongOnes(
			source,
			slips(s)
				.map(sourceOf)
				.filter((w) => fits(forCodes(w))),
			[[]]
		).slice(0, 3);
		return {
			prompt: 'Riscrivi il ciclo while con un for.',
			problem: 'Quale programma con il ciclo for fa quello che fa questo programma?',
			code: codes(source),
			solution: `Il for con il contatore che parte da ${s.c.from}: in Python ${rangeOf(s.c)}, in C++ for (${cppOf('i', s.c)}).`,
			steps: [
				'Il valore dato al contatore prima del while è la partenza del for.',
				'La condizione del while dice dove fermarsi: in C++ resta la stessa, in Python il valore di arrivo di range è il primo che la condizione rifiuta, ed è escluso.',
				"L'ultima riga del corpo è il passo: nel for sta nella riga del ciclo e nel corpo non si scrive più."
			],
			solutionCode: forCodes(source),
			answer: options(
				rng,
				forOption(source),
				wrong.map((w) => forOption(w))
			),
			params: params(s)
		};
	});
}

/** A program that reads n and makes a number of turns that depends on it: the task of the two open levels. */
interface Task {
	kind: 'multipli' | 'fino' | 'indietro' | 'somma' | 'quadrati';
	/** What the program does, as the exercise says it after "un programma che". */
	says: string;
	source: string;
	/** The same program with a mistake in the counter or in the body, each a different one. */
	wrong: string[];
	/** The mistake a flowchart can have and a for cannot: the step before the body. */
	early: string;
	tests: number[][];
	/** The numbers of the task, for the independent check. */
	data: Record<string, number>;
}

function task(rng: Rng): Task {
	const kind = rng.pick(['multipli', 'fino', 'indietro', 'somma', 'quadrati'] as const);
	// a program that writes at every turn, and one that adds up and writes at the end
	const writing = (count: Count, body: string) => lines('leggi n', ...counted('i', count, [`scrivi ${body}`]));
	const early = (count: Count, body: string[], before: string[] = ['leggi n'], after: string[] = []) => lines(...before, `i = ${count.from}`, `finché i ${count.op} ${count.to}`, ...inside([`i = i ${count.step > 0 ? '+' : '-'} ${Math.abs(count.step)}`, ...body]), ...after);
	if (kind === 'multipli') {
		const m = rng.int(3, 6);
		const count: Count = { from: 1, op: '<=', to: m, step: 1 };
		const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
		return {
			kind,
			says: `legge un numero $n$ e scrive i suoi primi ${m} multipli, da $n \\cdot 1$ a $n \\cdot ${m}$, uno per riga`,
			source: writing(count, 'n * i'),
			wrong: [writing({ ...count, op: '<' }, 'n * i'), writing({ ...count, from: 0, op: '<' }, 'n * i'), writing({ ...count, to: 'n' }, 'n * i'), writing(count, 'n + i'), writing(count, 'i'), writing({ ...count, step: 2 }, 'n * i')],
			early: early(count, ['scrivi n * i']),
			tests: [[a], [b === a ? a + 1 : b]],
			data: { m }
		};
	}
	if (kind === 'fino') {
		const from = rng.int(1, 3);
		const step = rng.int(1, 3);
		const count: Count = { from, op: '<=', to: 'n', step };
		const hit = from + step * rng.int(2, 5);
		return {
			kind,
			says: step === 1 ? `legge un numero $n$ e scrive i numeri da ${from} a $n$, uno per riga` : `legge un numero $n$ e scrive i numeri da ${from} in su, di ${step} in ${step}, senza superare $n$`,
			source: writing(count, 'i'),
			wrong: [writing({ ...count, op: '<' }, 'i'), writing({ ...count, from: from + 1 }, 'i'), writing({ ...count, from: from - 1 }, 'i'), writing({ ...count, step: step + 1 }, 'i'), writing({ ...count, to: 'n + 1' }, 'i'), writing({ ...count, to: 'n - 1' }, 'i')],
			early: early(count, ['scrivi i']),
			tests: [[hit], [hit + step * rng.int(1, 2) + (step > 1 ? rng.int(1, step - 1) : 0)]],
			data: { from, step }
		};
	}
	if (kind === 'indietro') {
		const to = rng.int(0, 2);
		const step = rng.int(1, 2);
		const count: Count = { from: 'n', op: '>=', to, step: -step };
		const hit = to + step * rng.int(2, 5);
		return {
			kind,
			says: step === 1 ? `legge un numero $n$ e scrive i numeri da $n$ a ${to}, dal più grande al più piccolo` : `legge un numero $n$ e scrive i numeri da $n$ in giù, di 2 in 2, finché non scendono sotto ${to}`,
			source: writing(count, 'i'),
			wrong: [writing({ ...count, op: '>' }, 'i'), writing({ from: to, op: '<=', to: 'n', step }, 'i'), writing({ ...count, from: 'n - 1' }, 'i'), writing({ ...count, to: to + 1 }, 'i'), writing({ ...count, step: step === 1 ? -2 : -1 }, 'i'), writing({ ...count, to: to + 2 }, 'i')],
			early: early(count, ['scrivi i']),
			tests: [[hit], [hit + step * rng.int(1, 2) + (step > 1 ? 1 : 0)]],
			data: { to, step }
		};
	}
	if (kind === 'somma') {
		const step = rng.int(2, 5);
		const odd = step === 2 && rng.int(0, 1) === 1;
		const from = odd ? 1 : step;
		const count: Count = { from, op: '<=', to: 'n', step };
		const adding = (sum: number, k: Count, body: string[], last = true) => lines('leggi n', `somma = ${sum}`, ...counted('i', k, body), ...(last ? ['scrivi somma'] : []));
		const what = odd ? 'dei numeri dispari da 1 a $n$' : step === 2 ? 'dei numeri pari da 2 a $n$' : `dei multipli di ${step} da ${step} a $n$`;
		const hit = from + step * rng.int(2, 4);
		return {
			kind,
			says: `legge un numero $n$ e scrive la somma ${what} (con $n$ compreso, quando è uno di questi)`,
			source: adding(0, count, ['somma = somma + i']),
			wrong: [
				adding(0, { ...count, op: '<' }, ['somma = somma + i']),
				adding(0, { ...count, step: 1 }, ['somma = somma + i']),
				adding(0, { ...count, from: odd ? 2 : 1 }, ['somma = somma + i']),
				adding(1, count, ['somma = somma + i']),
				adding(0, count, ['somma = i']),
				adding(0, count, [`somma = somma + ${step}`]),
				adding(0, count, ['somma = somma + i', 'scrivi somma'], false)
			],
			early: early(count, ['somma = somma + i'], ['leggi n', 'somma = 0'], ['scrivi somma']),
			tests: [[hit], [hit + step + rng.int(1, step - 1)]],
			data: { from, step }
		};
	}
	const count: Count = { from: 1, op: '<=', to: 'n', step: 1 };
	const a = rng.int(3, 6);
	return {
		kind,
		says: 'legge un numero $n$ e scrive i quadrati dei numeri da 1 a $n$, uno per riga',
		source: writing(count, 'i * i'),
		wrong: [writing({ ...count, op: '<' }, 'i * i'), writing({ ...count, from: 0 }, 'i * i'), writing(count, 'i * 2'), writing(count, 'i * n'), writing({ ...count, from: 2 }, 'i * i'), writing(count, 'i')],
		early: early(count, ['scrivi i * i']),
		tests: [[a], [a + rng.int(1, 2)]],
		data: {}
	};
}

const taskParams = (t: Task) => ({ case: t.kind, source: t.source, tests: t.tests, ...t.data });

function level5(rng: Rng): Built {
	return retrying(() => {
		const t = task(rng);
		const wrong = wrongOnes(t.source, [t.early, ...t.wrong], t.tests).slice(0, 3);
		return {
			prompt: 'Costruisci il diagramma di flusso.',
			problem: 'Costruisci il diagramma di flusso di questo programma. Nel diagramma il for non ha un blocco suo: partenza, condizione e passo sono tre blocchi separati.',
			code: forCodes(t.source, t.tests[0]),
			solution: 'Un diagramma con il contatore che prende il valore di partenza, un rombo con la condizione e, in fondo al giro, il blocco del passo.',
			steps: ['La partenza del contatore è un blocco prima del ciclo.', 'La condizione per fare un altro giro va nel rombo: in Python è il valore di arrivo di range, che è escluso; in C++ è la seconda parte del for.', 'Nel giro vanno prima le istruzioni del corpo e per ultimo il passo, che nel for non si vede nel corpo ma viene eseguito lo stesso.'],
			solutionChart: t.source,
			answer: needing(chartAnswer(t.source, t.tests), 'ciclo'),
			choice: options(rng, chartOption(t.source), wrong.map(chartOption)),
			params: taskParams(t)
		};
	});
}

function level6(rng: Rng): Built {
	return retrying(() => {
		const t = task(rng);
		const wrong = wrongOnes(
			t.source,
			t.wrong.filter((w) => fits(forCodes(w, t.tests[0]))),
			t.tests
		).slice(0, 3);
		return {
			prompt: 'Scrivi il programma.',
			problem: `Scrivi un programma che ${t.says}. Usa un ciclo for.`,
			solution: 'Un programma con un for: la partenza, il valore di arrivo e il passo del contatore stanno nella riga del ciclo.',
			steps: ['Chiediti qual è il primo valore del contatore, qual è l’ultimo e di quanto cambia a ogni giro.', 'Scrivi la riga del for: in Python il valore di arrivo di range è escluso, quindi per arrivare a un valore compreso si va un passo oltre; in C++ la condizione dice fino a quando si fa un altro giro.', 'Nel corpo metti solo quello che si fa a ogni giro: il passo lo fa il for.'],
			solutionCode: forCodes(t.source, t.tests[0]),
			answer: needing({ ...programAnswer(t.source, t.tests, 'leggi n\n'), solution: forCodes(t.source, t.tests[0]) }, 'for'),
			choice: options(
				rng,
				forOption(t.source, t.tests[0]),
				wrong.map((w) => forOption(w, t.tests[0]))
			),
			params: taskParams(t)
		};
	});
}

/** Every loop shown or asked for writes the same in the chart, in Python and in C++, and ends on its tests. */
function sound(sample: Sample): string[] {
	const source = String(sample.params.source);
	const tests = sample.params.tests as number[][];
	const errors: string[] = [];
	const why = plain(source, tests[0]);
	if (why) errors.push(`the loop ${why}`);
	for (const inputs of tests) {
		const written = output(source, inputs);
		if (!written) errors.push('the loop does not end');
		else if (written.length < 1 || written.length > 12) errors.push(`the program writes ${written.length} lines`);
	}
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const o of choice?.options ?? []) if (o.code && !fits(o.code)) errors.push('an option is too wide or too long');
	return errors;
}

export default makeGenerator(ID, 'Il ciclo for', {
	1: { label: 'Che cosa scrive un for', constraints: ['a for with a step of one, from 0 or from a given start', 'from 3 to 7 turns', 'four different outputs'], build: writes(['uno', 'due']), check: sound },
	2: { label: 'Il passo e il conto alla rovescia', constraints: ['a for with a step from 2 to 4, or backwards', 'from 3 to 6 turns', 'four different outputs'], build: writes(['passo', 'indietro']), check: sound },
	3: { label: 'Quanti giri fa un for', constraints: ['any of the four ways of writing the counter', 'four different numbers'], build: level3, check: sound },
	4: { label: 'Dal while al for', constraints: ['four programs with a for that write different things'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma di un for', constraints: ['a program that reads n', 'graded by running the chart on two values of n'], build: level5, check: sound },
	6: { label: 'Scrivere un ciclo for', constraints: ['a program that reads n', 'graded by running the program on two values of n'], build: level6, check: sound }
});
