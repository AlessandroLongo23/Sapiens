/**
 * Condizioni e operatori di confronto. Spec: specs/exercises/inf-condizioni.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/56-inf-condizioni.md). The lesson is about the
 * value of a condition, which the two languages write differently (True and 1), so most levels are multiple
 * choices of text, written by hand and not through `codes`: conditions are the same in Python and in C++, and are
 * set in typewriter type. The selections of levels 3 and 5 are flowcharts (v2/inf-sel.ts): the lesson shows a
 * rhombus, and leaves `if` to the next one. The program of level 6 is the one of the lesson's "Prova tu": a
 * boolean variable to give the right condition to, printed as 1 or 0 in both languages.
 *
 * 1. which condition is true; 2. the words that decide the boundary; 3. the rhombus in a flowchart; 4. comparisons
 * that mislead (= and ==, texts, decimals, True and 1); 5. build the flowchart; 6. write the condition.
 */
import type { ChoiceOption, ProgramAnswer, Rng } from '../types';
import { chartAnswer, chartOption, choose, makeGenerator, needing, output, shuffle, textOption, type Built } from '../inf-programmi';
import { FLIP, MIRROR, NEG, OPS, QUESTION_WIDTH, SCENES, chartWidth, fits, followed, holds, inputOption, mistakes, oneWay, orderOf, paramsOf, reading, rule, said, sound, tariff, threshold, trueOrFalse, tt, ttOption, twoWay, type Op, type Sel } from '../inf-sel';

export const ID = 'inf-condizioni';

const plural = (value: boolean) => (value ? 'vere' : 'false');

/** Two values compared with each other: what they are, the boolean variable that keeps the answer, the rule in words. */
interface Duo {
	a: string;
	b: string;
	what: string;
	flag: string;
	says: Partial<Record<Op, string>>;
}

const DUOS: Duo[] = [
	{ a: 'punti', b: 'record', what: 'i punti di una partita e il record da battere', flag: 'nuovo_record', says: { '>': 'i punti superano il record', '>=': 'i punti raggiungono o superano il record' } },
	{ a: 'monete', b: 'prezzo', what: 'le monete di un giocatore e il prezzo di una spada', flag: 'bastano', says: { '>=': 'le monete sono almeno quanto il prezzo', '>': 'le monete sono più del prezzo' } },
	{ a: 'peso', b: 'limite', what: 'il peso di una valigia e il limite della compagnia', flag: 'ammessa', says: { '<=': 'il peso non supera il limite', '<': 'il peso è sotto il limite' } },
	{ a: 'tentativo', b: 'segreto', what: 'un tentativo e il numero segreto di un gioco', flag: 'indovinato', says: { '==': 'il tentativo è uguale al numero segreto' } },
	{ a: 'vecchio', b: 'nuovo', what: 'il prezzo vecchio e il prezzo nuovo di un gioco', flag: 'cambiato', says: { '!=': 'i due prezzi sono diversi' } }
];

/** The wrong ways of writing a comparison, the typical one first: the boundary on the other side, a writing that does not exist, = for ==. */
function miswritten(l: string, op: Op, r: string | number): string[] {
	const c = (o: string) => `${l} ${o} ${r}`;
	if (op === '==') return [c('='), c('!='), c('>='), c('=>')];
	if (op === '!=') return [c('<>'), c('=='), c('=!'), c('<')];
	if (op === '>=' || op === '<=') return [c(FLIP[op]), c(op[1] + op[0]), c(MIRROR[op]), c('==')];
	return [c(FLIP[op]), c(MIRROR[op]), c(NEG[op]), c('!=')];
}

/** Four of `pool` of which exactly one has the value asked for; `must` says whether the four are acceptable. */
function oneOfFour<T>(rng: Rng, pool: T[], value: (x: T) => boolean, ask: boolean, must: (four: T[]) => boolean = () => true): { right: T; others: T[] } | null {
	const hits = pool.filter((x) => value(x) === ask);
	const misses = pool.filter((x) => value(x) !== ask);
	if (!hits.length || misses.length < 3) return null;
	for (let i = 0; i < 20; i++) {
		const right = rng.pick(hits);
		const others = shuffle(rng, misses).slice(0, 3);
		if (must([right, ...others])) return { right, others };
	}
	return null;
}

function level1(rng: Rng): Built {
	for (;;) {
		const ask = rng.next() < 0.6;
		if (rng.next() < 0.65) {
			const scene = rng.pick(SCENES);
			const x = threshold(rng, scene) + rng.int(-2, 2);
			const pool = OPS.flatMap((op) => [-2, -1, 0, 1, 2].map((d) => ({ op, c: x + d })));
			// one of the four compares the variable with the very value it has: the boundary decides
			const four = oneOfFour(
				rng,
				pool,
				(p) => holds(x, p.op, p.c),
				ask,
				(f) => f.some((p) => p.c === x) && new Set(f.map((p) => p.op)).size >= 3
			);
			if (!four) continue;
			const text = (p: { op: Op; c: number }) => `${scene.v} ${p.op} ${p.c}`;
			return {
				prompt: 'Metti il valore al posto del nome e leggi il confronto.',
				problem: `In un programma ${scene.v} vale ${x}. Quale di queste condizioni è ${trueOrFalse(ask)}?`,
				solution: `${text(four.right)} è ${trueOrFalse(ask)}; le altre tre sono ${plural(!ask)}.`,
				steps: [`Con ${x} al posto di ${scene.v}, la condizione ${tt(text(four.right))} diventa ${tt(`${x} ${four.right.op} ${four.right.c}`)}: è ${trueOrFalse(ask)}.`, `Le altre tre, lette allo stesso modo, sono ${plural(!ask)}.`, 'Attenzione al valore di confine: tra un numero e se stesso sono veri ==, <= e >=, e sono falsi !=, < e >.'],
				answer: choose(
					rng,
					ttOption(text(four.right)),
					four.others.map((p) => ttOption(text(p)))
				),
				params: { case: 'una', ask, env: { [scene.v]: x } }
			};
		}
		const duo = rng.pick(DUOS);
		const a = rng.int(1, 60);
		const b = rng.next() < 0.35 ? a : rng.int(1, 60);
		const four = oneOfFour(rng, OPS, (op) => holds(a, op, b), ask);
		if (!four) continue;
		const text = (op: Op) => `${duo.a} ${op} ${duo.b}`;
		return {
			prompt: 'Metti i valori al posto dei nomi e leggi il confronto.',
			problem: `In un programma ${duo.a} vale ${a} e ${duo.b} vale ${b}. Quale di queste condizioni è ${trueOrFalse(ask)}?`,
			solution: `${text(four.right)} è ${trueOrFalse(ask)}; le altre tre sono ${plural(!ask)}.`,
			steps: [`Con i valori al posto dei nomi, la condizione ${tt(text(four.right))} diventa ${tt(`${a} ${four.right} ${b}`)}: è ${trueOrFalse(ask)}.`, `Le altre tre, lette allo stesso modo, sono ${plural(!ask)}.`, a === b ? 'I due valori sono uguali: sono veri ==, <= e >=, e sono falsi !=, < e >.' : 'I due valori sono diversi: != è vero, == è falso, e tra < e > è vero quello che guarda dalla parte giusta.'],
			answer: choose(
				rng,
				ttOption(text(four.right)),
				four.others.map((op) => ttOption(text(op)))
			),
			params: { case: 'due', ask, env: { [duo.a]: a, [duo.b]: b } }
		};
	}
}

function level2(rng: Rng): Built {
	const scene = rng.pick(SCENES);
	const k = threshold(rng, scene);
	const op = orderOf(rng, scene.dir);
	const cond = `${scene.v} ${op} ${k}`;
	const inclusive = op === '>=' || op === '<=';
	const r = rng.next();
	if (r < 0.45) {
		const words = rule(scene.when, op, k);
		return {
			prompt: 'Cerca le parole che decidono il confine.',
			problem: `La variabile ${scene.v} contiene ${scene.what}. Quale condizione è vera quando ${words}, e solo allora?`,
			solution: cond,
			steps: [`Le parole che contano sono quelle davanti al numero: ${inclusive ? `con ${k} la frase è vera, quindi il ${k} va compreso` : `con ${k} la frase è falsa, quindi il ${k} resta fuori`}.`, `La condizione è ${tt(cond)}.`, inclusive ? "L'operatore si scrive nell'ordine in cui si legge, con l'uguale per secondo: >= e <=." : `Con ${tt(`${scene.v} ${FLIP[op]} ${k}`)} anche il ${k} darebbe vero.`],
			answer: choose(
				rng,
				ttOption(cond),
				miswritten(scene.v, op, k).map((c) => ttOption(c))
			),
			params: { case: 'frase', name: scene.v, k }
		};
	}
	if (r < 0.7) {
		const other = `${scene.v} ${FLIP[op]} ${k}`;
		const number = (n: number) => textOption(String(n));
		return {
			prompt: 'Prova i valori vicini al numero della condizione.',
			problem: `Per quale valore di ${scene.v} le condizioni ${tt(cond)} e ${tt(other)} danno due risultati diversi?`,
			solution: String(k),
			steps: [`Le due condizioni cambiano solo per l'uguale: danno lo stesso risultato per tutti i valori tranne quello di confine.`, `Con ${k}: ${tt(`${k} ${op} ${k}`)} è ${trueOrFalse(inclusive)}, ${tt(`${k} ${FLIP[op]} ${k}`)} è ${trueOrFalse(!inclusive)}.`, `Con ${k - 1} e con ${k + 1} le due condizioni sono d'accordo.`],
			answer: choose(rng, number(k), [number(k + 1), number(k - 1), textOption('per nessun valore', 'nessuno'), number(0)]),
			params: { case: 'confine', name: scene.v, conditions: [cond, other] }
		};
	}
	const ask = rng.next() < 0.5;
	const near = [0, 1, -1, 2, -2, 3, -3].map((d) => k + d);
	const right = near.find((n) => holds(n, op, k) === ask)!;
	const misses = near.filter((n) => holds(n, op, k) !== ask);
	const number = (n: number) => textOption(String(n));
	return {
		prompt: 'Metti ogni valore al posto del nome.',
		problem: `Per quale di questi valori di ${scene.v} la condizione ${tt(cond)} è ${trueOrFalse(ask)}?`,
		solution: String(right),
		steps: [`Con ${right} la condizione diventa ${tt(`${right} ${op} ${k}`)}: è ${trueOrFalse(ask)}.`, `Con gli altri tre valori è ${trueOrFalse(!ask)}.`, `Il valore su cui si sbaglia è il confine, ${k}: lì ${tt(cond)} è ${trueOrFalse(inclusive)}.`],
		answer: choose(rng, number(right), [number(misses[0]), number(misses[1]), number(rng.pick(misses.slice(2)))]),
		params: { case: 'valori', name: scene.v, condition: cond, ask }
	};
}

/** A selection whose chart fits the column of a phone under the question. */
function drawn(rng: Rng): Sel {
	for (;;) {
		// a selection with a text on each branch is tried too, but its chart seldom fits
		const r = rng.next();
		const s = r < 0.15 ? twoWay(rng) : r < 0.7 ? tariff(rng) : oneWay(rng);
		if (chartWidth(s.source) <= QUESTION_WIDTH) return s;
	}
}

function level3(rng: Rng): Built {
	const s = drawn(rng);
	const k = s.edge[0][0];
	if (s.family !== 'una-via' && rng.next() < 0.45) {
		// the text one side of the boundary gives: the nearest input on that side, and the three nearest on the other
		const near = [0, 1, -1, 2, -2, 3, -3].map((d) => [k + d]);
		const target = output(s.source, rng.pick(s.tests))![0];
		const hit = near.find((t) => output(s.source, t)![0] === target)!;
		const misses = near.filter((t) => output(s.source, t)![0] !== target).slice(0, 3);
		return {
			prompt: 'Prova gli ingressi uno alla volta sul rombo.',
			problem: `Con quale di questi ingressi il diagramma scrive ${/^\d+$/.test(target) ? target : `"${target}"`}?`,
			chart: s.source,
			solution: String(hit[0]),
			steps: [...followed(s, hit), `Con gli altri tre ingressi la condizione ha l'altro valore e il diagramma prende l'altro ramo.`, `Il valore da guardare con più attenzione è quello di confine, ${k}.`],
			answer: choose(rng, inputOption(hit), misses.map(inputOption)),
			params: paramsOf(s, { ask: 'ingresso', target })
		};
	}
	const inputs = rng.next() < 0.6 ? s.edge[0] : rng.pick(s.tests);
	const written = output(s.source, inputs)!;
	const trace = followed(s, inputs);
	const yes = trace.at(-1)!.endsWith('vera.');
	return {
		prompt: 'Arrivato al rombo, metti il valore al posto del nome.',
		problem: `Che cosa scrive questo diagramma ${reading(inputs)}?`,
		chart: s.source,
		solution: said(written),
		steps: [...trace, `Dal rombo si esce dal ramo del ${yes ? 'sì' : 'no'}.`, `Il diagramma scrive ${said(written)}.`],
		answer: choose(rng, textOption(said(written), written.join('\n')), wrongWritten(rng, s, inputs, written)),
		params: paramsOf(s, { ask: 'scrive', tests: [inputs], input: inputs })
	};
}

/** What a student who takes the other branch, or both, would say the chart writes. */
function wrongWritten(rng: Rng, s: Sel, inputs: number[], written: string[]): ChoiceOption[] {
	const key = (w: string[]) => w.join('\n');
	const elsewhere = s.tests.map((t) => output(s.source, t)!).filter((w) => key(w) !== key(written));
	const byMistake = s.wrong.map((w) => output(w, inputs)).filter((w): w is string[] => !!w && key(w) !== key(written));
	const other = elsewhere[0] ?? [];
	return [...shuffle(rng, [...byMistake, ...elsewhere]), [...written, ...other], []].map((w) => textOption(said(w), key(w)));
}

const WORDS_OF_TEXT = ['ape', 'Zebra', 'cane', 'casa', 'Anna', 'anna', 'sole', 'luna', 'Roma', 'mare', 'Zucca', 'bici'];
const DIGITS = ['10', '9', '25', '100', '7', '30'];

function texts(rng: Rng): Built {
	for (;;) {
		const digits = rng.next() < 0.3;
		const list = digits ? DIGITS : WORDS_OF_TEXT;
		const name = digits ? 'codice' : rng.pick(['parola', 'nome', 'risposta']);
		const w = rng.pick(list);
		const swapped = w[0] === w[0].toUpperCase() ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1);
		const others = list.filter((x) => x !== w);
		type Test = { text: string; value: boolean };
		const quote = (x: string) => `"${x}"`;
		const pool: Test[] = [
			{ text: `${name} == ${quote(w)}`, value: true },
			{ text: `${name} != ${quote(w)}`, value: false },
			...(digits ? [] : [{ text: `${name} == ${quote(swapped)}`, value: false }]),
			...others.flatMap((x) => [
				{ text: `${name} < ${quote(x)}`, value: w < x },
				{ text: `${name} > ${quote(x)}`, value: w > x }
			])
		];
		const ask = rng.next() < 0.6;
		const four = oneOfFour(
			rng,
			pool,
			(t) => t.value,
			ask,
			(f) => f.filter((t) => /[<>]/.test(t.text)).length >= 2
		);
		if (!four) continue;
		return {
			prompt: 'I testi si confrontano un carattere alla volta, con i codici dei caratteri.',
			problem: `In un programma ${name} è una variabile di testo che vale "${w}". Quale di queste condizioni è ${trueOrFalse(ask)}?`,
			solution: `${four.right.text} è ${trueOrFalse(ask)}; le altre tre sono ${plural(!ask)}.`,
			steps: [
				'Due testi sono uguali solo se hanno gli stessi caratteri nello stesso ordine: una maiuscola e la sua minuscola sono caratteri diversi.',
				digits ? 'Con < e > i testi si confrontano dal primo carattere, anche quando sono fatti di cifre: "10" viene prima di "9", perché la cifra 1 viene prima della cifra 9.' : "Con < e > vale l'ordine del dizionario, ma secondo i codici dei caratteri: tutte le maiuscole vengono prima di tutte le minuscole.",
				`${four.right.text} è ${trueOrFalse(ask)}.`
			],
			answer: choose(
				rng,
				ttOption(four.right.text),
				four.others.map((t) => ttOption(t.text))
			),
			params: { case: 'testi', ask, env: { [name]: w } }
		};
	}
}

function assign(rng: Rng): Built {
	const [a, b] = rng.pick([
		['a', 'b'],
		['x', 'y'],
		['punti', 'record'],
		['prima', 'dopo']
	]);
	const compare = rng.next() < 0.5;
	const p = rng.int(1, 30);
	const drawn = rng.int(1, 30);
	const q = drawn === p ? p + 1 : drawn;
	const line = `${a} ${compare ? '==' : '='} ${b}`;
	const state = (x: number, y: number, tag: string) => textOption(`${a} vale ${x} e ${b} vale ${y}`, `${x},${y},${tag}`);
	const still = (v: boolean) => textOption(`non cambia niente, e la riga vale ${v ? 'vero' : 'falso'}`, `${p},${q},${v ? 'vero' : 'falso'}`);
	const copied = state(q, q, '-');
	const options = compare ? [still(p === q), still(p !== q), copied, state(p, p, '-'), state(q, p, '-')] : [copied, still(false), state(p, p, '-'), state(q, p, '-'), still(true)];
	return {
		prompt: 'Un solo = assegna, due confrontano.',
		problem: `In un programma ${a} vale ${p} e ${b} vale ${q}. Che cosa succede quando il programma esegue ${tt(line)}?`,
		solution: options[0].text!,
		steps: compare
			? [`${tt('==')} è un confronto: chiede se i due valori sono uguali e risponde vero o falso.`, `${p} e ${q} ${p === q ? 'sono uguali: il confronto vale vero' : 'sono diversi: il confronto vale falso'}.`, 'Un confronto non cambia nessuna variabile.']
			: [`${tt('=')} è un assegnamento: copia nella variabile di sinistra il valore di quella di destra.`, `${a} prende il valore di ${b}, cioè ${q}; ${b} resta com'era.`, `Dopo la riga ${a} vale ${q} e ${b} vale ${q}.`],
		answer: choose(rng, options[0], options.slice(1)),
		params: { case: 'assegna', line, names: [a, b], env: { [a]: p, [b]: q } }
	};
}

function printed(rng: Rng): Built {
	const scene = rng.pick(SCENES);
	const k = threshold(rng, scene);
	const op = rng.pick(OPS);
	const x = k + rng.pick([0, 0, 1, -1, 3, -3]);
	const cond = `${scene.v} ${op} ${k}`;
	const value = holds(x, op, k);
	const both = (py: string, cpp: string) => textOption(`${py} in Python, ${cpp} in C++`, `${py}|${cpp}`);
	return {
		prompt: 'Calcola la condizione, poi ricorda come ogni linguaggio scrive vero e falso.',
		problem: 'Che cosa scrive questo programma? Scegli la riga giusta per tutti e due i linguaggi.',
		code: { python: `${scene.v} = ${x}\nprint(${cond})\n`, cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int ${scene.v} = ${x};\n    cout << (${cond}) << endl;\n    return 0;\n}\n` },
		solution: value ? 'True in Python, 1 in C++' : 'False in Python, 0 in C++',
		steps: [`Con ${scene.v} che vale ${x} la condizione ${tt(cond)} diventa ${tt(`${x} ${op} ${k}`)}: è ${trueOrFalse(value)}.`, "Python scrive True e False, con l'iniziale maiuscola.", 'Il C++ scrive 1 per vero e 0 per falso.'],
		answer: choose(rng, value ? both('True', '1') : both('False', '0'), [value ? both('False', '0') : both('True', '1'), value ? both('true', 'true') : both('false', 'false'), value ? both('1', 'True') : both('0', 'False'), both('vero', 'vero'), both('falso', 'falso')]),
		params: { case: 'stampa', condition: cond, env: { [scene.v]: x } }
	};
}

const SUMS: [string, string, string][] = [
	['0.1', '0.2', '0.3'],
	['0.1', '0.7', '0.8'],
	['0.2', '0.4', '0.6'],
	['0.3', '0.6', '0.9'],
	['0.7', '0.2', '0.9']
];

function decimals(rng: Rng): Built {
	const [a, b] = rng.pick([
		['a', 'b'],
		['x', 'y'],
		['misura', 'atteso'],
		['somma', 'totale']
	]);
	if (rng.next() < 0.5) {
		const [p, q, r] = rng.pick(SUMS);
		const tag = (label: string, value: string) => textOption(label, value);
		return {
			prompt: 'I numeri con la virgola stanno in memoria in binario.',
			problem: `Un programma mette in ${a} il risultato di ${tt(`${p} + ${q}`)}. Quanto vale la condizione ${tt(`${a} == ${r}`)}, e perché?`,
			solution: 'falso, perché i due valori in memoria sono vicinissimi ma non identici',
			steps: ['I numeri con la virgola stanno in memoria in binario, con un numero finito di cifre: quello che il computer conserva è un valore vicinissimo, non sempre quello esatto.', `La somma si porta dietro questi piccoli errori, e ${tt('==')} pretende due valori identici: dà falso.`, 'Per questo due numeri con la virgola si confrontano chiedendo se la loro distanza è più piccola di una soglia.'],
			answer: choose(rng, tag('falso, perché i due valori in memoria sono vicinissimi ma non identici', 'falso:memoria'), [
				tag(`vero, perché ${p.replace('.', ',')} più ${q.replace('.', ',')} fa proprio ${r.replace('.', ',')}`, 'vero:conto'),
				tag('falso, perché == non si può usare con i numeri', 'falso:vietato'),
				tag('vero in Python e falso in C++', 'dipende'),
				tag('è un errore: il programma si ferma', 'errore')
			]),
			params: { case: 'virgola', ask: 'valore', sum: [p, q, r] }
		};
	}
	const [name, digits] = rng.pick([
		['un millesimo', '0.001'],
		['un decimillesimo', '0.0001'],
		['un milionesimo', '0.000001']
	]);
	const tag = (label: string, value: string) => textOption(label, value);
	return {
		prompt: 'Con i numeri con la virgola == pretende troppo.',
		problem: `In un programma ${a} e ${b} sono due numeri con la virgola, usciti da due calcoli. Come si controlla nel modo giusto se sono uguali?`,
		solution: `Si chiede se la distanza tra ${a} e ${b} è minore di una soglia piccola, come ${name}.`,
		steps: ['Due calcoli che sulla carta danno lo stesso numero, in memoria possono dare due valori vicinissimi ma non identici.', `${tt('==')} darebbe falso anche per una differenza piccolissima.`, `Si calcola la distanza, cioè il valore assoluto della differenza, e si chiede se è minore di una soglia scelta da te, per esempio ${name} (${digits}).`],
		answer: choose(rng, tag(`si chiede se il valore assoluto di ${a} - ${b} è minore di una soglia piccola, come ${digits}`, 'distanza'), shuffle(rng, [tag(`con la condizione ${a} == ${b}`, 'uguale'), tag(`con la riga ${a} = ${b}`, 'assegna'), tag(`si chiede se ${a} - ${b} == 0`, 'zero'), tag(`si chiede se ${a} - ${b} è minore di ${digits}, senza valore assoluto`, 'segno')])),
		params: { case: 'virgola', ask: 'modo', names: [a, b] }
	};
}

function level4(rng: Rng): Built {
	const r = rng.next();
	return r < 0.3 ? texts(rng) : r < 0.55 ? assign(rng) : r < 0.8 ? printed(rng) : decimals(rng);
}

function level5(rng: Rng): Built {
	const s = tariff(rng);
	const edge = s.edge[0];
	return {
		prompt: 'Costruisci il diagramma di flusso.',
		problem: `Costruisci il diagramma di un algoritmo che ${s.task}.`,
		solution: `Un diagramma con la lettura e un rombo che chiede ${tt(s.conds[0])}, con uno "scrivi" su ogni ramo.`,
		steps: [s.why, `Controlla con una prova sul confine: ${reading(edge)} il diagramma giusto scrive ${said(output(s.source, edge)!)}.`, 'Sul ramo del sì va quello che si scrive quando la condizione è vera, sul ramo del no l\'altro valore.'],
		solutionChart: s.source,
		answer: needing(chartAnswer(s.source, s.tests), 'selezione'),
		choice: choose(rng, chartOption(s.source), mistakes(rng, s, 3, fits).map(chartOption)),
		params: paramsOf(s)
	};
}

/** The program of the lesson's "Prova tu": the readings, a boolean variable, and its value written as 1 or 0. */
function flagProgram(reads: string[], flag: string, cond: string | null): { python: string; cpp: string } {
	const python = [...reads.map((name) => `${name} = int(input())`), ...(cond ? [`${flag} = ${cond}`] : ['# scrivi qui la condizione al posto di False', `${flag} = False`]), '', `print(int(${flag}))`];
	const cpp = ['#include <iostream>', 'using namespace std;', '', 'int main() {', `    int ${reads.join(', ')};`, `    cin >> ${reads.join(' >> ')};`, ...(cond ? [`    bool ${flag} = ${cond};`] : ['    // scrivi qui la condizione al posto di false', `    bool ${flag} = false;`]), '', `    cout << ${flag} << endl;`, '    return 0;', '}'];
	return { python: python.join('\n') + '\n', cpp: cpp.join('\n') + '\n' };
}

function level6(rng: Rng): Built {
	const two = rng.next() < 0.4;
	const duo = rng.pick(DUOS);
	const scene = rng.pick(SCENES);
	const k = threshold(rng, scene);
	const duoOp = rng.pick(Object.keys(duo.says) as Op[]);
	const op: Op = two ? duoOp : orderOf(rng, scene.dir);
	const reads = two ? [duo.a, duo.b] : [scene.v];
	const flag = two ? duo.flag : scene.flag;
	const right = two ? duo.b : k;
	const cond = `${reads[0]} ${op} ${right}`;
	const low = rng.int(5, 40);
	const high = low + rng.int(1, 30);
	const same = rng.int(5, 60);
	const tests = two
		? [
				[high, low],
				[low, high],
				[same, same]
			]
		: [[k - 1], [k], [k + 1]];
	const value = (t: number[]) => holds(t[0], op, two ? t[1] : k);
	const answer: ProgramAnswer = {
		kind: 'program',
		solution: flagProgram(reads, flag, cond),
		start: flagProgram(reads, flag, null),
		tests: tests.map((t) => ({ input: t.join('\n') + '\n', output: `${value(t) ? 1 : 0}\n` }))
	};
	const words = two ? duo.says[op]! : rule(scene.when, op as '<', k);
	const line = (c: string) => ({ ...ttOption(`${flag} = ${c}`), values: [c] });
	return {
		prompt: 'Scrivi la condizione.',
		problem: `Il programma legge ${two ? duo.what : scene.what}. Completa la riga della variabile ${tt(flag)}: deve valere vero quando ${words}, e falso in tutti gli altri casi. L'ultima riga scrive 1 per vero e 0 per falso: non toccarla.`,
		solution: `${flag} = ${cond}`,
		steps: [
			two ? `La condizione confronta le due variabili: ${tt(cond)}.` : `Le parole davanti al numero decidono se il ${k} è compreso: la condizione è ${tt(cond)}.`,
			`A destra dell'assegnamento va il confronto: prima si calcola ${tt(cond)}, poi il suo valore va in ${tt(flag)}.`,
			`Controlla sul confine: ${reading(tests[two ? 2 : 1])} la variabile deve valere ${value(tests[two ? 2 : 1]) ? 'vero, e il programma scrive 1' : 'falso, e il programma scrive 0'}.`
		],
		solutionCode: answer.solution,
		answer,
		choice: choose(rng, line(cond), miswritten(reads[0], op, right).map(line)),
		params: { case: two ? 'due' : 'una', names: reads, flag, tests, ...(two ? { words } : { k }) }
	};
}

export default makeGenerator(ID, 'Condizioni e operatori di confronto', {
	1: { label: 'Vera o falsa', constraints: ['four conditions, exactly one with the value asked for', 'a comparison with the very value of the variable among them'], build: level1 },
	2: { label: 'Le parole del confine', constraints: ['a threshold in words, or the value where > and >= differ, or the value that makes a condition true'], build: level2 },
	3: { label: 'Il rombo in un diagramma', constraints: ['a chart with one selection, at most 345 px wide', 'the input is the boundary value more than half of the times'], build: level3, check: sound },
	4: { label: 'Confronti che ingannano', constraints: ['= and ==, texts, decimals, True and 1: options written by hand for the two languages'], build: level4 },
	5: { label: 'Costruire il diagramma con una condizione', constraints: ['graded by running the chart on both branches and on the boundary value', 'four charts at most 330 px wide'], build: level5, check: sound },
	6: { label: 'Scrivere la condizione', constraints: ['a boolean variable printed as 1 or 0, graded by running the program on both sides and on the boundary value'], build: level6, check: sound }
});
