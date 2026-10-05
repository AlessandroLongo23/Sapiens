/**
 * Massimo, minimo e media di una sequenza. Spec: specs/exercises/inf-massimo-minimo-media.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/64-inf-massimo-minimo-media.md). A sequence is
 * read one datum at a time, with its length first or with a value that closes it; the data of every run are in
 * `params.tests`. The programs are written once in the language of the flowcharts; those with the length first are
 * shown with a `for`, as the lesson does (v2/inf-iter.ts).
 *
 * 1. the maximum or the minimum, from the first datum; 2. the mistake of starting from 0; 3. a sequence closed by
 * a value; 4. the mean, as a count on paper or with a quotient without remainder; 5. build the flowchart of the
 * maximum or of the minimum; 6. write the program for a sequence closed by a value.
 */
import type { Rng, Sample } from '../types';
import { chartAnswer, codeOption, codes, lines, makeGenerator, output, plain, programAnswer, textOption, writtenOption, type Built } from '../inf-programmi';
import { counted, distinct, fits, forCodes, forOption, inside, listed, options, Retry, retrying, wrongOnes, type Count } from '../inf-iter';

export const ID = 'inf-massimo-minimo-media';

type Which = 'massimo' | 'minimo';

/** What the data of a sequence are. */
interface Ctx {
	key: string;
	/** The variable a datum is read into. */
	v: string;
	low: number;
	high: number;
	/** Every datum is this many times a whole number (scores go ten by ten). */
	unit: number;
	/** "$n$ temperature": what is read after n; "delle temperature": what a sequence closed by a value is made of. */
	reads: string;
	some: string;
	best: Record<Which, string>;
	/** The value that closes a sequence: one that cannot be a datum. */
	end: number;
}

const CONTEXTS: Ctx[] = [
	{ key: 'gradi', v: 'gradi', low: -9, high: 15, unit: 1, reads: '$n$ temperature', some: 'delle temperature', best: { massimo: 'la temperatura più alta', minimo: 'la temperatura più bassa' }, end: 999 },
	{ key: 'voti', v: 'voto', low: 3, high: 10, unit: 1, reads: '$n$ voti', some: 'dei voti', best: { massimo: 'il voto più alto', minimo: 'il voto più basso' }, end: 0 },
	{ key: 'punti', v: 'punti', low: 2, high: 20, unit: 10, reads: 'i punti di $n$ partite', some: 'i punti di alcune partite', best: { massimo: 'il punteggio più alto', minimo: 'il punteggio più basso' }, end: 0 },
	{ key: 'altezze', v: 'cm', low: 150, high: 195, unit: 1, reads: 'le altezze in centimetri di $n$ persone', some: 'le altezze in centimetri di alcune persone', best: { massimo: "l'altezza maggiore", minimo: "l'altezza minore" }, end: 0 },
	{ key: 'tempi', v: 'tempo', low: 48, high: 75, unit: 1, reads: 'i tempi in secondi di $n$ nuotatori', some: 'i tempi in secondi di alcuni nuotatori', best: { massimo: 'il tempo più lungo', minimo: 'il tempo più breve' }, end: 0 },
	{ key: 'prezzi', v: 'costo', low: 1, high: 60, unit: 1, reads: 'i prezzi in euro di $n$ prodotti', some: 'i prezzi in euro di alcuni prodotti', best: { massimo: 'il prezzo più alto', minimo: 'il prezzo più basso' }, end: 0 }
];

/** Data that can be above and below zero: where starting from 0 shows. */
const SIGNED: Ctx[] = [
	CONTEXTS[0],
	{ key: 'quiz', v: 'punti', low: -6, high: 9, unit: 1, reads: 'i punti di $n$ quiz, dove gli errori tolgono punti', some: '', best: { massimo: 'il punteggio più alto', minimo: 'il punteggio più basso' }, end: 999 },
	{ key: 'quote', v: 'metri', low: -40, high: 60, unit: 1, reads: '$n$ quote in metri rispetto al livello del mare', some: '', best: { massimo: 'la quota più alta', minimo: 'la quota più bassa' }, end: 999 },
	{ key: 'saldi', v: 'euro', low: -30, high: 30, unit: 1, reads: '$n$ movimenti in euro di un salvadanaio, positivi i versamenti e negativi le spese', some: '', best: { massimo: 'il movimento più alto', minimo: 'il movimento più basso' }, end: 999 }
];

const CMP: Record<Which, string> = { massimo: '>', minimo: '<' };
const other = (which: Which): Which => (which === 'massimo' ? 'minimo' : 'massimo');
const bestOf = (which: Which, data: number[]) => (which === 'massimo' ? Math.max(...data) : Math.min(...data));

/** `n` different data of a context, with the largest or the smallest where asked: 'first', 'last', or anywhere. */
function sequence(rng: Rng, x: Ctx, n: number, which: Which, at: 'first' | 'last' | 'any' = 'any', low = x.low, high = x.high): number[] {
	const data = distinct(rng, n, low, high).map((d) => d * x.unit);
	if (at === 'any') return data;
	const best = bestOf(which, data);
	const rest = data.filter((d) => d !== best);
	return at === 'first' ? [best, ...rest] : [...rest, best];
}

const REST: Count = { from: 2, op: '<=', to: 'n', step: 1 };
const ALL: Count = { from: 1, op: '<=', to: 'n', step: 1 };

/** The largest or the smallest of n data, the first read before the loop: the program of the lesson, and its mistakes. */
const known = {
	right: (v: string, w: Which, cmp = CMP[w], count: Count = REST, last = w as string) => lines('leggi n', `leggi ${v}`, `${w} = ${v}`, ...counted('i', count, [`leggi ${v}`, `se ${v} ${cmp} ${w}`, `    ${w} = ${v}`]), `scrivi ${last}`),
	/** Starting from 0, and reading all the data in the loop. */
	zero: (v: string, w: Which) => lines('leggi n', `${w} = 0`, ...counted('i', ALL, [`leggi ${v}`, `se ${v} ${CMP[w]} ${w}`, `    ${w} = ${v}`]), `scrivi ${w}`),
	/** No selection: every datum takes the place of the one before. */
	always: (v: string, w: Which) => lines('leggi n', `leggi ${v}`, `${w} = ${v}`, ...counted('i', REST, [`leggi ${v}`, `${w} = ${v}`]), `scrivi ${w}`),
	/** No reading in the loop: the first datum is compared with itself. */
	once: (v: string, w: Which) => lines('leggi n', `leggi ${v}`, `${w} = ${v}`, ...counted('i', REST, [`se ${v} ${CMP[w]} ${w}`, `    ${w} = ${v}`]), `scrivi ${w}`)
};

const knownWrong = (v: string, w: Which) => [known.right(v, w, CMP[other(w)]), known.zero(v, w), known.always(v, w), known.right(v, w, CMP[w], { ...REST, op: '<' }), known.once(v, w), known.right(v, w, CMP[w], REST, v), known.right(v, w, `${CMP[w]}=`, REST, 'n')];

/** The same for a sequence closed by the value `end`: the reading at the bottom of the body. */
const closed = {
	right: (v: string, w: Which, end: number, cmp = CMP[w], last = w as string) => lines(`leggi ${v}`, `${w} = ${v}`, `finché ${v} != ${end}`, ...inside([`se ${v} ${cmp} ${w}`, `    ${w} = ${v}`, `leggi ${v}`]), `scrivi ${last}`),
	/** The reading at the top of the body: the closing value is compared as a datum. */
	top: (v: string, w: Which, end: number) => lines(`leggi ${v}`, `${w} = ${v}`, `finché ${v} != ${end}`, ...inside([`leggi ${v}`, `se ${v} ${CMP[w]} ${w}`, `    ${w} = ${v}`]), `scrivi ${w}`),
	always: (v: string, w: Which, end: number) => lines(`leggi ${v}`, `${w} = ${v}`, `finché ${v} != ${end}`, ...inside([`${w} = ${v}`, `leggi ${v}`]), `scrivi ${w}`),
	zero: (v: string, w: Which, end: number) => lines(`leggi ${v}`, `${w} = 0`, `finché ${v} != ${end}`, ...inside([`se ${v} ${CMP[w]} ${w}`, `    ${w} = ${v}`, `leggi ${v}`]), `scrivi ${w}`)
};

const closedWrong = (v: string, w: Which, end: number) => [closed.top(v, w, end), closed.right(v, w, end, CMP[other(w)]), closed.zero(v, w, end), closed.always(v, w, end), closed.right(v, w, end, CMP[w], v)];

/** What the wrong programs write on some data, as the lines of an option. */
const writtenBy = (sources: string[], inputs: number[]) => sources.map((source) => output(source, inputs)).filter((w): w is string[] => !!w && w.length > 0 && w.length <= 3);
const near = (written: string[]) => (written.length === 1 && /^-?\d+$/.test(written[0]) ? [1, -1, 2].map((d) => [String(Number(written[0]) + d)]) : []);
const given = (inputs: number[]) => (inputs.length === 1 ? `Il programma riceve soltanto il valore ${inputs[0]}.` : `Il programma riceve questi valori, uno alla volta: ${listed(inputs)}.`);
/** The closing value with its article: "lo 0", "il 999". */
const the = (end: number) => (end === 0 ? 'lo 0' : `il ${end}`);
const bigger = (w: Which) => (w === 'massimo' ? 'più grande' : 'più piccolo');

function level1(rng: Rng): Built {
	return retrying(() => {
		const x = rng.pick(CONTEXTS);
		const which = rng.pick(['massimo', 'minimo'] as const);
		const n = rng.int(4, 6);
		const data = sequence(rng, x, n, which, rng.pick(['first', 'last', 'any', 'any'] as const));
		const inputs = [n, ...data];
		const source = known.right(x.v, which);
		const written = output(source, inputs)!;
		// the data that take the place of the one remembered, in the order they arrive
		const changes: number[] = [];
		let held = data[0];
		for (const d of data.slice(1))
			if (which === 'massimo' ? d > held : d < held) {
				held = d;
				changes.push(d);
			}
		return {
			prompt: `Segui ${which} un dato alla volta.`,
			problem: `Questo programma legge un numero $n$ e poi ${x.reads}. ${given(inputs)} Che cosa scrive?`,
			code: forCodes(source, inputs),
			solution: written.join(', '),
			steps: [
				`Il primo valore letto è n, cioè ${n}. Il primo dato, ${data[0]}, viene letto prima del ciclo e diventa il valore di partenza di ${which}.`,
				changes.length ? `Il ciclo legge gli altri ${n - 1} dati: ${which} cambia solo quando arriva un dato ${bigger(which)}. Succede con ${listed(changes)}.` : `Il ciclo legge gli altri ${n - 1} dati: nessuno è ${bigger(which)} di ${data[0]}, e ${which} non cambia.`,
				`Alla fine ${which} vale ${held}.`
			],
			answer: options(rng, writtenOption(written), [...writtenBy(knownWrong(x.v, which), inputs), ...near(written)].map(writtenOption)),
			params: { case: which, context: x.key, source, tests: [inputs] }
		};
	});
}

function level2(rng: Rng): Built {
	return retrying(() => {
		const x = rng.pick(SIGNED);
		const which = rng.pick(['massimo', 'minimo'] as const);
		const kind = rng.pick(['quale', 'scrive'] as const);
		const source = known.zero(x.v, which);
		const n = rng.int(3, 4);
		// the data where 0 is wrong: all below it for the maximum, all above it for the minimum
		const broken = which === 'massimo' ? sequence(rng, x, n, which, 'any', x.low, -1) : sequence(rng, x, n, which, 'any', 1, x.high);
		const should = `Questo programma dovrebbe leggere un numero $n$ e poi ${x.reads}, e scrivere ${x.best[which]}. Ma ${which} parte da 0.`;
		const idea = `Con ${which} che parte da 0, il programma si comporta come se tra i dati ci fosse anche uno 0.`;
		const why = which === 'massimo' ? 'Se i dati sono tutti negativi nessuno supera lo 0: il programma scrive 0, che non è un dato. Basta un dato positivo perché il risultato sia giusto.' : 'Se i dati sono tutti positivi nessuno è più piccolo di 0: il programma scrive 0, che non è un dato. Basta un dato negativo perché il risultato sia giusto.';
		const fix = `Con ${listed(broken)} scrive 0, mentre ${x.best[which]} è ${bestOf(which, broken)}: per questo ${which} deve partire dal primo dato.`;
		if (kind === 'scrive') {
			const inputs = [n, ...broken];
			const written = output(source, inputs)!;
			return {
				prompt: `Guarda da quale valore parte ${which}.`,
				problem: `${should} ${given(inputs)} Che cosa scrive?`,
				code: forCodes(source, inputs),
				solution: written.join(', '),
				steps: [idea, why, fix],
				answer: options(
					rng,
					writtenOption(written),
					[bestOf(which, broken), bestOf(other(which), broken), broken[n - 1], broken[0], n].map((d) => writtenOption([String(d)]))
				),
				params: { case: kind, which, context: x.key, source, tests: [inputs] }
			};
		}
		// three sequences where 0 does no harm: at least one datum on the other side of it
		const fine = [0, 1, 2].map(() => {
			for (;;) {
				const data = sequence(rng, x, n, which);
				if (which === 'massimo' ? Math.max(...data) > 0 : Math.min(...data) < 0) return data;
			}
		});
		const option = (data: number[]) => textOption(listed(data), data.join(','));
		return {
			prompt: `Guarda da quale valore parte ${which}.`,
			problem: `${should} Con quale di queste sequenze di ${n} dati scrive un risultato sbagliato?`,
			code: forCodes(source, [n, ...broken]),
			solution: listed(broken),
			steps: [idea, why, fix],
			answer: options(rng, option(broken), fine.map(option)),
			params: { case: kind, which, context: x.key, source, tests: [broken, ...fine].map((data) => [n, ...data]) }
		};
	});
}

function level3(rng: Rng): Built {
	return retrying(() => {
		const top = rng.int(0, 9) < 3;
		// the reading at the top shows only when the closing value wins the comparison: 0 for a minimum, 999 for a maximum
		const x = rng.pick(CONTEXTS);
		const which: Which = top ? (x.end === 0 ? 'minimo' : 'massimo') : rng.pick(['massimo', 'minimo'] as const);
		const data = sequence(rng, x, rng.int(3, 5), which, rng.pick(['first', 'last', 'any', 'any'] as const));
		const inputs = [...data, x.end];
		const right = closed.right(x.v, which, x.end);
		const source = top ? closed.top(x.v, which, x.end) : right;
		const written = output(source, inputs)!;
		const closing = `Il valore ${x.end} chiude la sequenza: serve solo a fermare il ciclo e non è un dato.`;
		const start = `Il primo dato, ${data[0]}, viene letto prima del ciclo e dà a ${which} il valore di partenza.`;
		const wrong = [...writtenBy(top ? [right, ...closedWrong(x.v, which, x.end)] : closedWrong(x.v, which, x.end), inputs), [String(data[0])], [String(data[data.length - 1])], ...near(written)];
		return {
			prompt: 'Segui il programma fino al valore che chiude la sequenza.',
			problem: top
				? `Questo programma dovrebbe leggere ${x.some}, fino al valore ${x.end} che chiude la sequenza, e scrivere ${x.best[which]}, ma contiene un errore. ${given(inputs)} Che cosa scrive?`
				: `Questo programma legge ${x.some} e si ferma quando arriva il valore ${x.end}. ${given(inputs)} Che cosa scrive?`,
			code: codes(source, inputs),
			solution: written.join(', '),
			steps: top
				? [closing, `Qui però la lettura sta in cima al corpo, prima della selezione: anche ${the(x.end)} viene confrontato con ${which}, come un dato qualunque, e lo sostituisce.`, `Il programma scrive ${written[0]}; con la lettura in fondo al corpo scriverebbe ${bestOf(which, data)}.`]
				: [start, `La lettura sta in fondo al corpo: ogni dato passa dal controllo della condizione prima di essere confrontato, e quando arriva ${x.end} il ciclo finisce senza confrontarlo.`, `Tra ${listed(data)} il ${bigger(which)} è ${bestOf(which, data)}.`],
			answer: options(rng, writtenOption(written), wrong.map(writtenOption)),
			params: { case: top ? 'in-cima' : 'giusto', which, context: x.key, end: x.end, source, ...(top ? { intended: right } : {}), tests: [inputs] }
		};
	});
}

/** A number as the lesson writes it: the decimal comma, at most three decimals. */
const shown = (value: number) => String(Number(value.toFixed(3))).replace('.', ',');
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** A fraction in lowest terms, as the independent check reads it: "15/2", "7". */
const exact = (p: number, q: number) => (p % q === 0 ? String(p / q) : `${p / gcd(p, q)}/${q / gcd(p, q)}`);

/** The sum, the count and the mean of a sequence closed by a value, with the quotient of whole numbers. */
const mean = {
	right: (v: string, end: number, o: { top?: boolean; count?: number; write?: string } = {}) =>
		lines(
			'somma = 0',
			`quanti = ${o.count ?? 0}`,
			`leggi ${v}`,
			`finché ${v} != ${end}`,
			...inside(o.top ? [`leggi ${v}`, `somma = somma + ${v}`, 'quanti = quanti + 1'] : [`somma = somma + ${v}`, 'quanti = quanti + 1', `leggi ${v}`]),
			'se quanti > 0',
			`    scrivi ${o.write ?? 'somma // quanti'}`,
			'altrimenti',
			'    scrivi "nessun dato"'
		)
};

function level4(rng: Rng): Built {
	// drawn once: the data are drawn again until the mean comes out well, and that must not change how often each case comes
	const program = rng.int(0, 1) === 1;
	const empty = rng.int(0, 9) === 0;
	return retrying(() => {
		const x = rng.pick(CONTEXTS.filter((c) => c.end === 0));
		if (!program) {
			const n = rng.int(2, 5);
			const data = Array.from({ length: n }, () => rng.int(x.low, x.high) * x.unit);
			const sum = data.reduce((a, b) => a + b, 0);
			if ((sum * 100) % n !== 0 || new Set(data).size < 2) throw new Retry('the mean has too many decimals');
			const ends = rng.int(0, 1) === 1;
			// the mean corrected datum by datum, as the lesson warns not to do: (media + dato) / 2
			const running = data.slice(1).reduce((m, d) => (m + d) / 2, data[0]);
			const option = (p: number, q: number) => textOption(shown(p / q), exact(p, q));
			const others = [
				...(Number.isInteger(running * 8) ? [textOption(shown(running), exact(running * 8, 8))] : []),
				option(sum, 1),
				...(ends && (sum * 100) % (n + 1) === 0 ? [option(sum, n + 1)] : []),
				option(Math.max(...data) + Math.min(...data), 2),
				...((sum * 100) % (n - 1 || 1) === 0 && n > 2 ? [option(sum, n - 1)] : []),
				option(Math.max(...data), 1),
				option(n, 1)
			];
			return {
				prompt: 'La media è la somma divisa per il numero dei dati.',
				problem: `Un programma legge ${x.some}: ${listed(data)}${ends ? ', e poi lo 0 che chiude la sequenza' : ''}. Tiene la somma e il conto dei dati e, dopo il ciclo, calcola la media. Quanto vale la media?`,
				solution: shown(sum / n),
				steps: [`La somma dei dati è ${data.join(' + ')} = ${sum}.`, `I dati sono ${n}${ends ? ': lo 0 chiude la sequenza, non si somma e non si conta' : ''}.`, `La media è ${sum} : ${n} = ${shown(sum / n)}. La divisione si fa una volta sola, dopo il ciclo.`],
				answer: options(rng, option(sum, n), others),
				params: { case: 'calcolo', context: x.key, data, closed: ends }
			};
		}
		const n = rng.int(2, 5);
		const data = empty ? [] : Array.from({ length: n }, () => rng.int(x.low, x.high) * x.unit);
		const sum = data.reduce((a, b) => a + b, 0);
		if (!empty && (sum % n !== 0 || new Set(data).size < 2)) throw new Retry('the mean is not a whole number');
		const inputs = [...data, 0];
		const source = mean.right(x.v, 0);
		const written = output(source, inputs)!;
		const wrong = empty ? [['0'], ['errore: divisione per zero'], ['1']] : [...writtenBy([mean.right(x.v, 0, { write: 'somma' }), mean.right(x.v, 0, { top: true }), mean.right(x.v, 0, { count: 1 }), mean.right(x.v, 0, { write: 'quanti' })], inputs), [String(Math.max(...data))], ...near(written)];
		return {
			prompt: 'Segui la somma e il conto, poi la divisione dopo il ciclo.',
			problem: `Questo programma legge ${x.some} e si ferma quando arriva uno 0. Scrive la media con la divisione tra interi${empty ? '' : ', che con questi dati non ha resto'}. ${given(inputs)} Che cosa scrive?`,
			code: codes(source, inputs),
			solution: written.join(', '),
			steps: empty
				? ['Il primo valore letto è lo 0 che chiude la sequenza: il ciclo non fa nessun giro.', 'Il contatore quanti resta 0: non ci sono dati, e la media sarebbe 0 : 0, che non esiste.', 'La selezione dopo il ciclo evita la divisione per zero e fa scrivere "nessun dato".']
				: [`A ogni giro il dato letto si aggiunge a somma e quanti aumenta di 1: alla fine somma vale ${data.join(' + ')} = ${sum} e quanti vale ${n}.`, 'Lo 0 chiude la sequenza: non si somma e non si conta.', `Dopo il ciclo il programma divide: ${sum} : ${n} = ${sum / n}.`],
			answer: options(rng, writtenOption(written), wrong.map(writtenOption)),
			params: { case: empty ? 'vuota' : 'programma', context: x.key, source, tests: [inputs] }
		};
	});
}

function level5(rng: Rng): Built {
	return retrying(() => {
		const x = rng.pick(CONTEXTS);
		const which = rng.pick(['massimo', 'minimo'] as const);
		const source = known.right(x.v, which);
		const tests = [
			[4, ...sequence(rng, x, 4, which, 'first')],
			[5, ...sequence(rng, x, 5, which, 'last')],
			[3, ...sequence(rng, x, 3, which)]
		];
		const wrong = wrongOnes(
			source,
			knownWrong(x.v, which).filter((w) => fits(forCodes(w, tests[0]))),
			tests
		).slice(0, 3);
		return {
			prompt: 'Costruisci il diagramma di flusso, o riconosci il programma che fa lo stesso.',
			problem: `Un algoritmo deve leggere un numero $n$, almeno 1, poi ${x.reads}, un valore alla volta, e scrivere ${x.best[which]}.`,
			solution: `Il primo dato si legge prima del ciclo e dà a ${which} il valore di partenza; il ciclo legge gli altri e li confronta con ${which}.`,
			steps: [
				`Leggi n e poi il primo dato, e dai a ${which} il suo valore: non 0, che potrebbe non essere un dato.`,
				`Il ciclo parte dal secondo dato: i va da 2 a n. In ogni giro leggi un dato e, con una selezione, mettilo in ${which} solo se è ${bigger(which)} di quello che c'è.`,
				`Scrivi ${which} dopo il ciclo.`
			],
			solutionChart: source,
			solutionCode: forCodes(source, tests[0]),
			answer: chartAnswer(source, tests),
			choice: options(
				rng,
				forOption(source, tests[0]),
				wrong.map((w) => forOption(w, tests[0]))
			),
			params: { case: which, context: x.key, source, tests }
		};
	});
}

/** The sum and the count of a sequence closed by a value, each written on its row. */
const tally = (v: string, end: number, o: { top?: boolean; count?: number; add?: string; step?: string; swap?: boolean } = {}) => {
	const turn = [o.add ?? `somma = somma + ${v}`, o.step ?? 'quanti = quanti + 1'];
	return lines('somma = 0', `quanti = ${o.count ?? 0}`, `leggi ${v}`, `finché ${v} != ${end}`, ...inside(o.top ? [`leggi ${v}`, ...turn] : [...turn, `leggi ${v}`]), ...(o.swap ? ['scrivi quanti', 'scrivi somma'] : ['scrivi somma', 'scrivi quanti']));
};

function level6(rng: Rng): Built {
	return retrying(() => {
		const x = rng.pick(CONTEXTS);
		const kind = rng.pick(['massimo', 'minimo', 'somma-conto'] as const);
		const which: Which = kind === 'minimo' ? 'minimo' : 'massimo';
		const tests = [
			[...sequence(rng, x, 4, which, 'first'), x.end],
			[...sequence(rng, x, 5, which, 'last'), x.end],
			[...sequence(rng, x, 3, which), x.end]
		];
		const sums = kind === 'somma-conto';
		const source = sums ? tally(x.v, x.end) : closed.right(x.v, which, x.end);
		const candidates = sums ? [tally(x.v, x.end, { top: true }), tally(x.v, x.end, { count: 1 }), tally(x.v, x.end, { add: `somma = ${x.v}` }), tally(x.v, x.end, { swap: true }), tally(x.v, x.end, { step: `quanti = quanti + ${x.v}` }), tally(x.v, x.end, { add: 'somma = somma + 1' })] : closedWrong(x.v, which, x.end);
		const wrong = wrongOnes(
			source,
			candidates.filter((w) => fits(codes(w, tests[0]))),
			tests
		).slice(0, 3);
		const asked = programAnswer(source, tests, sums ? '' : `leggi ${x.v}\n`);
		const what = sums ? 'la loro somma e, sulla riga dopo, quanti sono' : x.best[which];
		return {
			prompt: 'Scrivi il programma.',
			problem: `Scrivi un programma che legge ${x.some}, un valore per riga, fino al valore ${x.end} che chiude la sequenza, e scrive ${what}. La sequenza ha almeno un dato, e ${the(x.end)} non è un dato.`,
			solution: sums ? 'Un while che continua finché il valore letto non è quello di fine: nel corpo aggiorna la somma e il conto, e per ultima cosa legge il valore seguente.' : `Il primo dato dà a ${which} il valore di partenza; un while confronta ogni dato con ${which} e per ultima cosa legge il valore seguente.`,
			steps: sums
				? ['Prima del ciclo dai 0 alla somma e al conto, e leggi il primo valore.', `Il ciclo continua finché il valore letto è diverso da ${x.end}: nel corpo aggiungi il dato alla somma e aumenta il conto di 1.`, `La lettura del valore seguente sta in fondo al corpo: così ${the(x.end)} ferma il ciclo senza essere sommato né contato.`]
				: [`Leggi il primo valore e dai a ${which} il suo valore: non 0.`, `Il ciclo continua finché il valore letto è diverso da ${x.end}: nel corpo una selezione mette il dato in ${which} solo se è ${bigger(which)}.`, `La lettura del valore seguente sta in fondo al corpo: così ${the(x.end)} ferma il ciclo senza essere confrontato.`],
			solutionCode: codes(source, tests[0]),
			// with nothing given, the editor would open on an empty row
			answer: { ...asked, start: { ...asked.start, python: asked.start.python.replace(/^\n/, '') } },
			choice: options(
				rng,
				codeOption(source, tests[0]),
				wrong.map((w) => codeOption(w, tests[0]))
			),
			params: { case: kind, context: x.key, end: x.end, source, tests }
		};
	});
}

/** Every program shown or asked for writes the same in the chart, in Python and in C++, and ends on its data. */
function sound(sample: Sample): string[] {
	if (sample.params.source === undefined) return [];
	const source = String(sample.params.source);
	const tests = sample.params.tests as number[][];
	const errors: string[] = [];
	const why = plain(source, tests[0]);
	if (why) errors.push(`the program ${why}`);
	for (const inputs of tests) if (!output(source, inputs)) errors.push('the program does not end');
	const choice = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	for (const o of choice?.options ?? []) if (o.code && !fits(o.code)) errors.push('an option is too wide or too long');
	return errors;
}

export default makeGenerator(ID, 'Massimo, minimo e media di una sequenza', {
	1: { label: 'Il più grande e il più piccolo', constraints: ['from 4 to 6 different data, the length read first', 'four different numbers'], build: level1, check: sound },
	2: { label: 'Partire da 0 è un errore', constraints: ['a program whose maximum or minimum starts from 0', 'data all below zero, or all above'], build: level2, check: sound },
	3: { label: 'Una sequenza chiusa da un valore', constraints: ['from 3 to 5 data and the value that closes them', 'three times in ten the reading is at the top of the body'], build: level3, check: sound },
	4: { label: 'La media', constraints: ['a mean with at most two decimals, or a program with a quotient without remainder'], build: level4, check: sound },
	5: { label: 'Costruire il diagramma del massimo', constraints: ['three tests: the largest first, the largest last, anywhere', 'graded by running the chart'], build: level5, check: sound },
	6: { label: 'Scrivere il programma di una sequenza', constraints: ['a sequence closed by a value', 'three tests, graded by running the program'], build: level6, check: sound }
});
