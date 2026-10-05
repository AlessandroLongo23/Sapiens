/**
 * Contatori e accumulatori. Spec: specs/exercises/inf-contatori-accumulatori.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/62-inf-contatori-accumulatori.md). Every program
 * reads its data one at a time and keeps a count, a sum or a product of them. It is written once in the language of
 * the flowcharts and shown with a `for`, as the lesson does (v2/inf-iter.ts); the data it is given are in
 * `params.tests`.
 *
 * 1. what a counter under a condition ends up as; 2. a sum; 3. a product; 4. what a program with one of the
 * mistakes of the lesson writes; 5. build the flowchart of a total; 6. write the program that counts or adds up.
 */
import type { Rng, Sample } from '../types';
import { chartAnswer, chartOption, lines, makeGenerator, output, plain, programAnswer, writtenOption, type Built } from '../inf-programmi';
import { counted, fits, forCodes, forOption, inside, listed, options, Retry, retrying, wrongOnes, type Count } from '../inf-iter';

export const ID = 'inf-contatori-accumulatori';

/** What the data are and which of them a program picks out. */
interface Ctx {
	key: 'voti' | 'gradi' | 'punti' | 'eta' | 'costo' | 'pari' | 'multipli';
	/** The variable a datum is read into. */
	v: string;
	cond: string;
	/** The condition with its boundary moved (`>=` for `>`), and the opposite one. */
	flip: string;
	opposite: string;
	holds(x: number): boolean;
	draw(rng: Rng): number;
	/** The value on the boundary of the condition, when it has one. */
	edge: number | null;
	/** "$n$ voti": what is read after n. */
	reads: string;
	/** "quanti sono sufficienti, cioè almeno 6": what a counter under the condition answers. */
	count: string;
	/** The sum of the data that satisfy the condition, and of all of them. */
	part: string;
	total: string;
}

function context(rng: Rng): Ctx {
	const key = rng.pick(['voti', 'gradi', 'punti', 'eta', 'costo', 'pari', 'multipli'] as const);
	switch (key) {
		case 'voti':
			return { key, v: 'voto', cond: 'voto >= 6', flip: 'voto > 6', opposite: 'voto < 6', holds: (x) => x >= 6, draw: (r) => r.int(3, 10), edge: 6, reads: '$n$ voti', count: 'quanti sono sufficienti, cioè almeno 6', part: 'la somma dei soli voti sufficienti, cioè almeno 6', total: 'la somma dei voti' };
		case 'gradi':
			return { key, v: 'gradi', cond: 'gradi < 0', flip: 'gradi <= 0', opposite: 'gradi >= 0', holds: (x) => x < 0, draw: (r) => r.int(-8, 12), edge: 0, reads: '$n$ temperature', count: 'quante sono sotto zero', part: 'la somma delle sole temperature sotto zero', total: 'la somma delle temperature' };
		case 'punti': {
			const t = rng.pick([50, 80, 100, 120]);
			return { key, v: 'punti', cond: `punti > ${t}`, flip: `punti >= ${t}`, opposite: `punti <= ${t}`, holds: (x) => x > t, draw: (r) => 10 * r.int(2, 20), edge: t, reads: 'i punti di $n$ partite', count: `in quante partite i punti sono più di ${t}`, part: `la somma dei soli punteggi maggiori di ${t}`, total: 'il totale dei punti' };
		}
		case 'eta':
			return { key, v: 'eta', cond: 'eta >= 18', flip: 'eta > 18', opposite: 'eta < 18', holds: (x) => x >= 18, draw: (r) => r.int(12, 25), edge: 18, reads: 'le età di $n$ persone', count: 'quante sono maggiorenni, cioè hanno almeno 18 anni', part: 'la somma delle sole età da 18 anni in su', total: 'la somma delle età' };
		case 'costo': {
			const t = rng.pick([5, 10, 20]);
			return { key, v: 'costo', cond: `costo <= ${t}`, flip: `costo < ${t}`, opposite: `costo > ${t}`, holds: (x) => x <= t, draw: (r) => r.int(1, 2 * t + 5), edge: t, reads: 'i prezzi in euro di $n$ prodotti', count: `quanti prodotti costano al più ${t} euro`, part: `la somma dei soli prezzi fino a ${t} euro`, total: 'il totale della spesa' };
		}
		case 'pari':
			return { key, v: 'x', cond: 'x % 2 == 0', flip: 'x % 2 == 1', opposite: 'x % 2 == 1', holds: (x) => x % 2 === 0, draw: (r) => r.int(1, 30), edge: null, reads: '$n$ numeri interi positivi', count: 'quanti sono pari', part: 'la somma dei soli numeri pari', total: 'la somma dei numeri' };
		default: {
			const k = rng.int(3, 5);
			return { key, v: 'x', cond: `x % ${k} == 0`, flip: `x % ${k} != 0`, opposite: `x % ${k} != 0`, holds: (x) => x % k === 0, draw: (r) => (r.int(0, 2) === 0 ? k * r.int(1, 8) : r.int(1, 40)), edge: null, reads: '$n$ numeri interi positivi', count: `quanti sono multipli di ${k}`, part: `la somma dei soli multipli di ${k}`, total: 'la somma dei numeri' };
		}
	}
}

/** `n` data: some that satisfy the condition and some that do not, often with the value on its boundary; or none that does. */
function sequence(rng: Rng, x: Ctx, n: number, none = false): number[] {
	for (;;) {
		const data = Array.from({ length: n }, () => x.draw(rng));
		if (none) {
			for (let k = 0; k < n; k++) while (x.holds(data[k])) data[k] = x.draw(rng);
			return data;
		}
		if (x.edge !== null && rng.int(0, 1) === 1) data[rng.int(0, n - 1)] = x.edge;
		const hits = data.filter(x.holds).length;
		if (hits >= 1 && hits <= n - 1) return data;
	}
}

const N: Count = { from: 1, op: '<=', to: 'n', step: 1 };
const SHORT: Count = { ...N, op: '<' };

/** A program that reads n and then makes n turns. */
const reading = (before: string[], body: string[], after: string[], count: Count = N) => lines('leggi n', ...before, ...counted('i', count, body), ...after);
const when = (cond: string | null | undefined, row: string) => (cond ? [`se ${cond}`, `    ${row}`] : [row]);

/** A count, a sum or a product of the data read: where it starts, how a turn changes it, and the mistakes it may have. */
interface Tally {
	acc: string;
	start: number | string;
	update: string;
	cond?: string | null;
	/** The first value given inside the body, at every turn. */
	reset?: boolean;
	count?: Count;
	/** Written at every turn, and not after the loop. */
	early?: boolean;
}

const tally = (v: string, t: Tally) =>
	reading(t.reset ? [] : [`${t.acc} = ${t.start}`], [...(t.reset ? [`${t.acc} = ${t.start}`] : []), `leggi ${v}`, ...when(t.cond, t.update), ...(t.early ? [`scrivi ${t.acc}`] : [])], t.early ? [] : [`scrivi ${t.acc}`], t.count ?? N);

const counting = (x: Ctx): Tally => ({ acc: 'quanti', start: 0, update: 'quanti = quanti + 1', cond: x.cond });
const countingWrong = (x: Ctx): Tally[] => {
	const right = counting(x);
	return [{ ...right, cond: null }, { ...right, cond: x.flip }, { ...right, start: 1 }, { ...right, reset: true }, { ...right, cond: x.opposite }, { ...right, update: `quanti = quanti + ${x.v}` }, { ...right, count: SHORT }];
};

const adding = (x: Ctx, part: boolean): Tally => ({ acc: 'somma', start: 0, update: `somma = somma + ${x.v}`, cond: part ? x.cond : null });
const addingWrong = (x: Ctx, part: boolean): Tally[] => {
	const right = adding(x, part);
	return [
		{ ...right, start: 1 },
		...(part ? [{ ...right, cond: null }] : []),
		{ ...right, reset: true },
		...(part ? [{ ...right, cond: x.flip }] : []),
		{ ...right, update: 'somma = somma + 1' },
		{ ...right, update: `somma = ${x.v}` },
		{ ...right, start: 'n' },
		{ ...right, count: SHORT },
		{ ...right, early: true }
	];
};

const multiplying: Tally = { acc: 'prodotto', start: 1, update: 'prodotto = prodotto * x' };
const multiplyingWrong: Tally[] = [{ ...multiplying, start: 0 }, { ...multiplying, update: 'prodotto = prodotto + x' }, { ...multiplying, reset: true }, { ...multiplying, update: 'prodotto = x' }, { ...multiplying, count: SHORT }, { ...multiplying, start: 0, update: 'prodotto = prodotto + x' }, { ...multiplying, early: true }];

/** The factorial of n and the power of a to n: products that read no data in the loop. */
const factorial = (start: number, update: string, count: Count = N, early = false) => lines('leggi n', `fattoriale = ${start}`, ...counted('i', count, [update, ...(early ? ['scrivi fattoriale'] : [])]), ...(early ? [] : ['scrivi fattoriale']));
const power = (start: number | string, update: string, count: Count = N, early = false) => lines('leggi a', 'leggi n', `potenza = ${start}`, ...counted('i', count, [update, ...(early ? ['scrivi potenza'] : [])]), ...(early ? [] : ['scrivi potenza']));
const FACT = 'fattoriale = fattoriale * i';
const POW = 'potenza = potenza * a';
const factorialWrong = () => [factorial(0, FACT), factorial(1, 'fattoriale = fattoriale + i'), factorial(1, FACT, SHORT), factorial(1, 'fattoriale = i'), factorial(0, 'fattoriale = fattoriale + i'), factorial(1, 'fattoriale = fattoriale * n'), factorial(1, FACT, N, true)];
const powerWrong = () => [power(0, POW), power(1, 'potenza = potenza + a'), power(1, POW, SHORT), power('a', POW), power(1, 'potenza = a * i'), power(1, 'potenza = potenza * n'), power(1, POW, N, true)];

/** What a program writes on its data, as the lines of an option; an error or no end is not an option. */
const writtenBy = (sources: string[], inputs: number[]) => sources.map((source) => output(source, inputs)).filter((w): w is string[] => !!w && w.length > 0 && w.length <= 6);
/** Numbers close to the one a program writes, to fill the options when the mistakes give too few. */
const near = (written: string[]) => (written.length === 1 && /^-?\d+$/.test(written[0]) ? [1, -1, 2, -2, 3].map((d) => [String(Number(written[0]) + d)]) : []);

const given = (inputs: number[]) => (inputs.length === 1 ? `Il programma riceve il valore ${inputs[0]}.` : `Il programma riceve questi valori, uno alla volta: ${listed(inputs)}.`);
const terms = (data: number[], sign: string) => data.map((d) => (d < 0 ? `(${d})` : String(d))).join(` ${sign} `);

/** A level that shows a program and its data and asks what it writes. */
function asks(rng: Rng, source: string, wrong: string[], inputs: number[], steps: string[], params: Record<string, unknown>, intro = ''): Built {
	const written = output(source, inputs)!;
	return {
		prompt: 'Segui il programma un giro alla volta.',
		problem: `${intro}${given(inputs)} Che cosa scrive?`,
		code: forCodes(source, inputs),
		solution: written.join(', '),
		steps,
		answer: options(rng, writtenOption(written), [...writtenBy(wrong, inputs), ...near(written)].map(writtenOption)),
		params: { ...params, source, tests: [inputs] }
	};
}

function level1(rng: Rng): Built {
	return retrying(() => {
		const x = context(rng);
		const n = rng.int(4, 6);
		const data = sequence(rng, x, n);
		const hits = data.filter(x.holds);
		const steps = [`Il primo valore letto è n, cioè ${n}: i dati sono i ${n} valori che seguono.`, `Il contatore quanti parte da 0 e aumenta di 1 solo nei giri in cui ${x.cond} è vera: succede con ${listed(hits)}.`, `Alla fine quanti vale ${hits.length}.`];
		return asks(rng, tally(x.v, counting(x)), countingWrong(x).map((t) => tally(x.v, t)), [n, ...data], steps, { case: x.key, v: x.v, cond: x.cond }, `Questo programma legge un numero $n$ e poi ${x.reads}. `);
	});
}

function level2(rng: Rng): Built {
	return retrying(() => {
		const x = context(rng);
		const part = rng.int(0, 1) === 1;
		const n = rng.int(3, 5);
		const data = sequence(rng, x, n);
		const taken = part ? data.filter(x.holds) : data;
		const sum = taken.reduce((a, b) => a + b, 0);
		const steps = [
			`Il primo valore letto è n, cioè ${n}: i dati sono i ${n} valori che seguono.`,
			part ? `L'accumulatore somma parte da 0 e aumenta del dato letto solo nei giri in cui ${x.cond} è vera: succede con ${listed(taken)}.` : "L'accumulatore somma parte da 0 e a ogni giro aumenta del dato appena letto.",
			taken.length > 1 ? `Alla fine somma vale ${terms(taken, '+')} = ${sum}.` : `Alla fine somma vale ${sum}.`
		];
		return asks(rng, tally(x.v, adding(x, part)), addingWrong(x, part).map((t) => tally(x.v, t)), [n, ...data], steps, { case: part ? 'parte' : 'tutto', context: x.key, v: x.v, cond: part ? x.cond : null }, `Questo programma legge un numero $n$ e poi ${x.reads}. `);
	});
}

function level3(rng: Rng): Built {
	return retrying(() => {
		const kind = rng.pick(['fattoriale', 'potenza', 'prodotto'] as const);
		const one = 'Il prodotto parte da 1, che moltiplicato per un numero dà quel numero: partendo da 0 resterebbe sempre 0.';
		if (kind === 'fattoriale') {
			const n = rng.int(3, 10);
			const values = Array.from({ length: n }, (_, k) => k + 1);
			const steps = [one, `A ogni giro fattoriale viene moltiplicato per il contatore i, che va da 1 a ${n}.`, `Alla fine fattoriale vale ${terms(values, '·')} = ${values.reduce((a, b) => a * b, 1)}.`];
			return asks(rng, factorial(1, FACT), factorialWrong(), [n], steps, { case: kind });
		}
		if (kind === 'potenza') {
			const a = rng.int(2, 9);
			const n = rng.int(2, 6);
			if (a ** n > 1_000_000) throw new Retry('the power is too large');
			const steps = [one, `Il ciclo fa ${n} giri, e a ogni giro potenza viene moltiplicata per a, che vale ${a}.`, `Alla fine potenza vale ${terms(Array(n).fill(a), '·')} = ${a ** n}.`];
			return asks(rng, power(1, POW), powerWrong(), [a, n], steps, { case: kind });
		}
		const n = rng.int(3, 4);
		const data = Array.from({ length: n }, () => rng.int(2, 9));
		const steps = [one, `Il primo valore letto è n, cioè ${n}; a ogni giro prodotto viene moltiplicato per il dato appena letto.`, `Alla fine prodotto vale ${terms(data, '·')} = ${data.reduce((a, b) => a * b, 1)}.`];
		return asks(
			rng,
			tally('x', multiplying),
			multiplyingWrong.map((t) => tally('x', t)),
			[n, ...data],
			steps,
			{ case: kind }
		);
	});
}

/** A program with one of the mistakes of the lesson: what it should do, what it does, and why. */
interface Bug {
	kind: 'azzerato' | 'fuori' | 'zero' | 'uno' | 'sovrascritto';
	should: string;
	source: string;
	intended: string;
	others: string[];
	inputs: number[];
	why: string;
}

function bug(rng: Rng): Bug {
	const kind = rng.pick(['azzerato', 'fuori', 'zero', 'uno', 'sovrascritto'] as const);
	const x = context(rng);
	const n = rng.int(3, 5);
	const data = sequence(rng, x, n);
	const inputs = [n, ...data];
	const counts = rng.int(0, 1) === 1;
	const part = rng.int(0, 1) === 1;
	const right = counts ? counting(x) : adding(x, part);
	const should = `leggere $n$, poi ${x.reads}, e scrivere ${counts ? x.count : part ? x.part : x.total}`;
	const others = (counts ? countingWrong(x) : addingWrong(x, part)).map((t) => tally(x.v, t));
	const name = right.acc;
	if (kind === 'azzerato')
		return { kind, should, source: tally(x.v, { ...right, reset: true }), intended: tally(x.v, right), others, inputs, why: `La riga che dà a ${name} il valore 0 sta dentro il corpo: a ogni giro ${name} ricomincia da capo, e alla fine conta solo l'ultimo dato.` };
	if (kind === 'uno') return { kind, should, source: tally(x.v, { ...right, start: 1 }), intended: tally(x.v, right), others, inputs, why: `La variabile ${name} parte da 1 e non da 0: il risultato ha 1 in più del dovuto.` };
	if (kind === 'sovrascritto') {
		const adds = adding(x, part);
		return {
			kind,
			should: `leggere $n$, poi ${x.reads}, e scrivere ${part ? x.part : x.total}`,
			source: tally(x.v, { ...adds, update: `somma = ${x.v}` }),
			intended: tally(x.v, adds),
			others: addingWrong(x, part).map((t) => tally(x.v, t)),
			inputs,
			why: `L'istruzione somma = ${x.v} non aggiunge il dato a quello che c'era: lo mette al posto del valore di prima. Alla fine in somma resta solo l'ultimo dato ${part ? 'che soddisfa la condizione' : 'letto'}.`
		};
	}
	if (kind === 'zero') {
		const which = rng.pick(['fattoriale', 'potenza', 'prodotto'] as const);
		const why = 'Il prodotto parte da 0, e 0 moltiplicato per qualunque numero fa 0: il risultato resta 0 a ogni giro. Un prodotto parte da 1.';
		if (which === 'fattoriale') return { kind, should: 'leggere $n$ e scrivere il suo fattoriale, cioè il prodotto dei numeri da 1 a $n$', source: factorial(0, FACT), intended: factorial(1, FACT), others: factorialWrong(), inputs: [rng.int(3, 8)], why };
		if (which === 'potenza') return { kind, should: 'leggere la base $a$ e l’esponente $n$ e scrivere la potenza $a^n$', source: power(0, POW), intended: power(1, POW), others: powerWrong(), inputs: [rng.int(2, 6), rng.int(2, 5)], why };
		return { kind, should: 'leggere $n$, poi $n$ numeri, e scrivere il loro prodotto', source: tally('x', { ...multiplying, start: 0 }), intended: tally('x', multiplying), others: multiplyingWrong.map((t) => tally('x', t)), inputs: [3, rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)], why };
	}
	// a count and a sum of the same data: the counter is left out of the selection, and counts every datum
	const both = (out: boolean) => reading(['quanti = 0', 'somma = 0'], [`leggi ${x.v}`, `se ${x.cond}`, ...inside([`somma = somma + ${x.v}`, ...(out ? [] : ['quanti = quanti + 1'])]), ...(out ? ['quanti = quanti + 1'] : [])], ['scrivi quanti', 'scrivi somma']);
	const hits = data.filter(x.holds);
	const sum = hits.reduce((a, b) => a + b, 0);
	return {
		kind,
		should: `leggere $n$, poi ${x.reads}, e scrivere ${x.count} e, sulla riga dopo, ${x.part}`,
		source: both(true),
		intended: both(false),
		others: [],
		inputs,
		why: `L'istruzione quanti = quanti + 1 è fuori dalla selezione: viene eseguita a ogni giro, e quanti conta tutti i ${n} dati, mentre quelli che soddisfano la condizione sono ${hits.length}. La somma è giusta: ${sum}.`
	};
}

function level4(rng: Rng): Built {
	return retrying(() => {
		const b = bug(rng);
		const written = output(b.source, b.inputs);
		const meant = output(b.intended, b.inputs);
		if (!written || !meant || written.join() === meant.join()) throw new Retry('the mistake does not show');
		const fill = written.length === 2 ? [[String(Number(meant[0]) + 1), meant[1]], [written[0], String(Number(written[1]) + Number(written[0]))], [meant[1], meant[0]], [String(Number(written[0]) - 1), written[1]]] : [];
		return {
			prompt: 'Trova che cosa fa davvero il programma.',
			problem: `Questo programma dovrebbe ${b.should}, ma contiene un errore. ${given(b.inputs)} Che cosa scrive?`,
			code: forCodes(b.source, b.inputs),
			solution: written.join(', '),
			steps: [b.why, `Con questi valori il programma scrive ${written.join(', ')}; senza l'errore scriverebbe ${meant.join(', ')}.`],
			answer: options(rng, writtenOption(written), [meant, ...writtenBy(b.others, b.inputs), ...fill, ...near(written)].map(writtenOption)),
			params: { case: b.kind, source: b.source, intended: b.intended, tests: [b.inputs] }
		};
	});
}

/** A total with one loop and no selection: the chart of level 5. */
interface Total {
	kind: 'somma' | 'prodotto' | 'potenza' | 'fattoriale';
	says: string;
	source: string;
	wrong: string[];
	tests: number[][];
}

function total(rng: Rng): Total {
	const kind = rng.pick(['somma', 'prodotto', 'potenza', 'fattoriale'] as const);
	if (kind === 'somma') {
		const right: Tally = { acc: 'somma', start: 0, update: 'somma = somma + x' };
		const wrong: Tally[] = [{ ...right, start: 1 }, { ...right, reset: true }, { ...right, update: 'somma = x' }, { ...right, early: true }, { ...right, count: SHORT }, { ...right, update: 'somma = somma + 1' }, { ...right, start: 1, update: 'somma = somma * x' }];
		const low = rng.pick([-9, 1]);
		return { kind, says: 'legge un numero $n$, poi $n$ numeri uno alla volta, e scrive la loro somma', source: tally('x', right), wrong: wrong.map((t) => tally('x', t)), tests: [3, 4].map((n) => [n, ...Array.from({ length: n }, () => rng.int(low, 20))]) };
	}
	if (kind === 'prodotto') return { kind, says: 'legge un numero $n$, poi $n$ numeri uno alla volta, e scrive il loro prodotto', source: tally('x', multiplying), wrong: multiplyingWrong.map((t) => tally('x', t)), tests: [3, 2].map((n) => [n, ...Array.from({ length: n }, () => rng.int(2, 9))]) };
	if (kind === 'potenza')
		return { kind, says: "legge la base $a$ e l'esponente $n$, mai negativo, e scrive la potenza $a^n$, calcolata moltiplicando per $a$ tante volte quante dice l'esponente", source: power(1, POW), wrong: powerWrong(), tests: [[rng.int(2, 5), rng.int(2, 5)], [rng.int(2, 9), 0], [rng.int(6, 10), rng.int(1, 3)]] };
	return { kind, says: 'legge un numero $n$ e scrive il suo fattoriale, cioè il prodotto dei numeri interi da 1 a $n$', source: factorial(1, FACT), wrong: factorialWrong(), tests: [[rng.int(4, 8)], [rng.int(0, 3)]] };
}

function level5(rng: Rng): Built {
	return retrying(() => {
		const t = total(rng);
		// two tests that write the same would let a chart that always writes that number pass
		if (new Set(t.tests.map((inputs) => String(output(t.source, inputs)))).size < t.tests.length) throw new Retry('two tests write the same');
		const wrong = wrongOnes(t.source, t.wrong, t.tests).slice(0, 3);
		const product = t.kind !== 'somma';
		return {
			prompt: 'Costruisci il diagramma di flusso.',
			problem: `Costruisci il diagramma di un algoritmo che ${t.says}.`,
			solution: `Un diagramma con l'accumulatore che parte da ${product ? 1 : 0} prima del ciclo, l'aggiornamento nel giro e la scrittura dopo il ciclo.`,
			steps: [
				`Prima del ciclo dai all'accumulatore il valore che non cambia il risultato: ${product ? '1 per un prodotto' : '0 per una somma'}. Lì parte anche il contatore dei giri.`,
				`Nel giro ${t.kind === 'somma' || t.kind === 'prodotto' ? 'leggi un dato, ' : ''}aggiorna l'accumulatore e per ultimo aumenta il contatore.`,
				'La scrittura del risultato va dopo il ciclo, sul ramo "no" del rombo: dentro il giro scriverebbe un risultato parziale a ogni giro.'
			],
			solutionChart: t.source,
			answer: chartAnswer(t.source, t.tests),
			choice: options(rng, chartOption(t.source), wrong.map(chartOption)),
			params: { case: t.kind, source: t.source, tests: t.tests }
		};
	});
}

function level6(rng: Rng): Built {
	return retrying(() => {
		const x = context(rng);
		const counts = rng.int(0, 4) < 3;
		const right = counts ? counting(x) : adding(x, true);
		const source = tally(x.v, right);
		const tests = [
			[4, ...sequence(rng, x, 4)],
			[3, ...sequence(rng, x, 3, true)],
			[5, ...sequence(rng, x, 5)]
		];
		const wrong = wrongOnes(
			source,
			(counts ? countingWrong(x) : addingWrong(x, true)).map((t) => tally(x.v, t)).filter((w) => fits(forCodes(w, tests[0]))),
			tests
		).slice(0, 3);
		const name = right.acc;
		return {
			prompt: 'Scrivi il programma.',
			problem: `Scrivi un programma che legge un numero $n$, poi ${x.reads}, un valore per riga, e scrive ${counts ? x.count : x.part}.`,
			solution: `Un programma con ${name} che parte da 0 prima del ciclo, una selezione nel corpo che ${counts ? 'lo aumenta di 1' : 'gli aggiunge il dato'} e la scrittura dopo il ciclo.`,
			steps: [
				`Prima del ciclo dai a ${name} il valore 0: una volta sola, non dentro il corpo.`,
				`Fai n giri con un for. In ogni giro leggi un dato e, con una selezione, ${counts ? `aumenta ${name} di 1` : `aggiungilo a ${name}`} solo quando ${x.cond} è vera.`,
				`Scrivi ${name} dopo il ciclo.`
			],
			solutionCode: forCodes(source, tests[0]),
			answer: { ...programAnswer(source, tests, 'leggi n\n'), solution: forCodes(source, tests[0]) },
			choice: options(
				rng,
				forOption(source, tests[0]),
				wrong.map((w) => forOption(w, tests[0]))
			),
			params: { case: counts ? 'conta' : 'somma', context: x.key, v: x.v, cond: x.cond, source, tests }
		};
	});
}

const INT_MAX = 2_147_483_647;

/** Every program shown or asked for writes the same in the chart, in Python and in C++, ends, and stays inside an `int`. */
function sound(sample: Sample): string[] {
	const source = String(sample.params.source);
	const tests = sample.params.tests as number[][];
	const errors: string[] = [];
	const why = plain(source, tests[0]);
	if (why) errors.push(`the program ${why}`);
	for (const inputs of tests) {
		const written = output(source, inputs);
		if (!written) errors.push('the program does not end');
		else if (written.some((row) => Math.abs(Number(row)) > INT_MAX)) errors.push('a number does not fit an int');
	}
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const o of choice?.options ?? []) if (o.code && !fits(o.code)) errors.push('an option is too wide or too long');
	return errors;
}

export default makeGenerator(ID, 'Contatori e accumulatori', {
	1: { label: 'Contare i dati che interessano', constraints: ['from 4 to 6 data, some that satisfy the condition and some that do not', 'four different numbers'], build: level1, check: sound },
	2: { label: 'Sommare i dati', constraints: ['from 3 to 5 data', 'the sum of all the data or of those that satisfy a condition'], build: level2, check: sound },
	3: { label: 'Il prodotto parte da 1', constraints: ['a factorial up to 10, a power up to a million, or the product of 3 or 4 data'], build: level3, check: sound },
	4: { label: 'Un errore nel programma', constraints: ['one of the mistakes of the lesson', 'the program writes something else than it should'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma di un totale', constraints: ['one loop and no selection', 'graded by running the chart'], build: level5, check: sound },
	6: { label: 'Scrivere un ciclo che conta o somma', constraints: ['three tests, one where no datum satisfies the condition', 'graded by running the program'], build: level6, check: sound }
});
