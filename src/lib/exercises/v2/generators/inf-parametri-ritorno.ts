/**
 * Exercises of lesson 66, "Parametri e valore di ritorno" (informatica, third year). Programs written by hand in
 * the two languages (v2/inf-codice.ts). Spec: specs/exercises/inf-parametri-ritorno.md
 *
 * 1. which argument goes into which parameter; 2. the returned value inside an expression; 3. printing against
 * returning; 4. a function that calls another and answers true or false; 5. which function gives back what is
 * asked (options that are programs, shown by their function alone); 6. write a function that returns a value (open
 * answer, graded on what the program writes and on the function).
 */
import type { Rng } from '../types';
import { shuffle, choose, cppProgram, makeCodeGenerator, needing, printedOption, program, programAnswer, programOption, reader, reference, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-parametri-ritorno';

/** A function of two whole numbers whose result changes when the two are swapped. */
interface Fun {
	fn: string;
	a: string;
	b: string;
	/** The number in the formula, where the family has one. */
	k: number;
	/** The expression returned, the same text in the two languages. */
	text: string;
	of: (a: number, b: number) => number;
	/** Two arguments that make sense for the function, different from each other. */
	draw: (rng: Rng) => [number, number];
}

type Name = 'punti' | 'durata' | 'voto' | 'netto';
const NAMES: readonly Name[] = ['punti', 'durata', 'voto', 'netto'];

function fun(rng: Rng, name: Name): Fun {
	const apart = (draw: () => [number, number]) => (): [number, number] => {
		for (;;) {
			const pair = draw();
			if (pair[0] !== pair[1]) return pair;
		}
	};
	if (name === 'punti') {
		const k = rng.int(2, 3);
		return { fn: 'punti', a: 'vinte', b: 'pareggi', k, text: `${k} * vinte + pareggi`, of: (a, b) => k * a + b, draw: apart(() => [rng.int(1, 6), rng.int(0, 5)]) };
	}
	if (name === 'durata') return { fn: 'durata', a: 'ore', b: 'minuti', k: 60, text: '60 * ore + minuti', of: (a, b) => 60 * a + b, draw: () => [rng.int(1, 3), 5 * rng.int(2, 11)] };
	if (name === 'voto') {
		const k = rng.int(2, 3);
		return { fn: 'voto', a: 'giuste', b: 'errori', k, text: `${k} * giuste - errori`, of: (a, b) => k * a - b, draw: apart(() => [rng.int(4, 9), rng.int(1, 3)]) };
	}
	return { fn: 'netto', a: 'prezzo', b: 'sconto', k: 1, text: 'prezzo - sconto', of: (a, b) => a - b, draw: () => [rng.int(10, 40), rng.int(1, 9)] };
}

const pyDef = (f: Fun, body = [`return ${f.text}`]) => [`def ${f.fn}(${f.a}, ${f.b}):`, ...body.map((row) => `    ${row}`)].join('\n');
const cppDef = (f: Fun, body = [`return ${f.text};`], type = 'int') => [`${type} ${f.fn}(int ${f.a}, int ${f.b}) {`, ...body.map((row) => `    ${row}`), '}'].join('\n');

/** A program from the definitions and the rows of the main program, in the two languages, and what it writes. */
const made = (defs: { python: string; cpp: string }[], main: { python: string[]; cpp: string[] }, run: Program['run']): Program =>
	program(`${defs.map((d) => d.python).join('\n\n')}\n\n${main.python.join('\n')}\n`, cppProgram(main.cpp.join('\n'), defs.map((d) => d.cpp).join('\n\n')), run);

const defOf = (f: Fun) => ({ python: pyDef(f), cpp: cppDef(f) });
const call = (f: Fun, x: number | string, y: number | string) => `${f.fn}(${x}, ${y})`;

class TooFew extends Error {}

/** A level whose numbers are drawn again when they leave fewer than three wrong options; the case is drawn once. */
const drawn =
	<F>(cases: readonly F[], build: (rng: Rng, kind: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const kind = rng.pick(cases);
		for (let i = 1; ; i++) {
			try {
				return build(rng, kind);
			} catch (e) {
				if (i >= 60 || !(e instanceof TooFew)) throw e;
			}
		}
	};

const pick = (rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) => {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`${ID}: only ${keys.size} wrong options`);
	return choose(rng, right, others);
};

const number = (n: number) => writtenOption([String(n)]);

// ---------------------------------------------------------------- 1: arguments and parameters

type Passed = 'numeri' | 'variabili' | 'espressione';
const PAIRS = [
	['x', 'y'],
	['m', 'n'],
	['p', 'q']
] as const;

function level1(rng: Rng, kind: Passed): CodeBuilt {
	const f = fun(rng, rng.pick(NAMES));
	const [a, b] = f.draw(rng);
	// the two values the call passes, in order, and the rows of the main program
	let passed: [number, number] = [a, b];
	let python: string[];
	let cpp: string[];
	let how: string;
	let tempting: number;
	if (kind === 'numeri') {
		python = [`print(${call(f, a, b)})`];
		cpp = [`cout << ${call(f, a, b)} << endl;`];
		how = `Gli argomenti sono ${a} e ${b}`;
		tempting = f.of(b, a);
	} else if (kind === 'variabili') {
		const [x, y] = rng.pick(PAIRS);
		const swapped = rng.int(0, 2) > 0;
		passed = swapped ? [b, a] : [a, b];
		const args = swapped ? [y, x] : [x, y];
		python = [`${x} = ${a}`, `${y} = ${b}`, `print(${call(f, args[0], args[1])})`];
		cpp = [`int ${x} = ${a};`, `int ${y} = ${b};`, `cout << ${call(f, args[0], args[1])} << endl;`];
		how = `Gli argomenti sono i valori di ${args[0]} e di ${args[1]}, cioè ${passed[0]} e ${passed[1]}`;
		tempting = f.of(passed[1], passed[0]);
	} else {
		const [x] = rng.pick(PAIRS);
		const d = rng.int(1, 3);
		passed = [a + d, b];
		python = [`${x} = ${a}`, `print(${call(f, `${x} + ${d}`, b)})`];
		cpp = [`int ${x} = ${a};`, `cout << ${call(f, `${x} + ${d}`, b)} << endl;`];
		how = `Il primo argomento è ${x} + ${d}, che viene calcolato prima della chiamata e vale ${a + d}; il secondo è ${b}`;
		// the expression not worked out: the variable alone
		tempting = f.of(a, b);
	}
	const [A, B] = passed;
	const right = f.of(A, B);
	if (right === f.of(B, A)) throw new TooFew('the order of the arguments does not matter');
	const shown = made([defOf(f)], { python, cpp }, () => [String(right)]);
	const wrong = [tempting, f.of(B, A), A + B, f.k * (A + B), f.of(A, B) + 1, f.of(A, 0), A, B];
	return {
		prompt: 'Guarda in che ordine sono scritti gli argomenti.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: String(right),
		steps: [
			`${how}.`,
			`Il primo argomento va nel primo parametro, ${f.a}, e il secondo nel secondo, ${f.b}: ${f.a} vale ${A} e ${f.b} vale ${B}. Conta il posto, non il nome.`,
			`La funzione restituisce ${f.text}, cioè ${right}, ed è quello che viene scritto.`
		],
		answer: pick(rng, number(right), wrong.map(number)),
		params: reference(shown, [[]], { ask: 'output', case: kind, fn: f.fn, k: f.k, passed })
	};
}

// ---------------------------------------------------------------- 2: the returned value in an expression

type Used = 'somma' | 'variabile' | 'annidata';

function level2(rng: Rng, kind: Used): CodeBuilt {
	if (kind === 'annidata') {
		const f: Fun = { fn: 'diff', a: 'a', b: 'b', k: 1, text: 'a - b', of: (a, b) => a - b, draw: () => [0, 0] };
		const a = rng.int(9, 20);
		const b = rng.int(2, 6);
		const c = rng.int(1, 5);
		const inner = a - b;
		const right = inner - c;
		const shown = made([defOf(f)], { python: [`t = diff(diff(${a}, ${b}), ${c})`, 'print(t)'], cpp: [`int t = diff(diff(${a}, ${b}), ${c});`, 'cout << t << endl;'] }, () => [String(right)]);
		return {
			prompt: 'Parti dalla chiamata più interna.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: String(right),
			steps: [
				`La chiamata interna diff(${a}, ${b}) viene eseguita per prima e restituisce ${a} - ${b} = ${inner}.`,
				`Il valore ${inner} prende il posto della chiamata interna: resta diff(${inner}, ${c}).`,
				`La chiamata esterna restituisce ${inner} - ${c} = ${right}, che finisce in t e viene scritto.`
			],
			answer: pick(rng, number(right), [a - (b - c), inner, c - inner, inner + c, a - c, b - c].map(number)),
			params: reference(shown, [[]], { ask: 'output', case: kind, fn: 'diff', k: 1, calls: [[a, b]], extra: c })
		};
	}
	const f = fun(rng, rng.pick(NAMES));
	const [a, b] = f.draw(rng);
	const r1 = f.of(a, b);
	if (kind === 'somma') {
		const [c, d] = f.draw(rng);
		if (c === a && d === b) throw new TooFew('the same call twice');
		const r2 = f.of(c, d);
		const right = r1 + r2;
		const shown = made([defOf(f)], { python: [`t = ${call(f, a, b)} + ${call(f, c, d)}`, 'print(t)'], cpp: [`int t = ${call(f, a, b)} + ${call(f, c, d)};`, 'cout << t << endl;'] }, () => [String(right)]);
		return {
			prompt: 'Ogni chiamata vale il numero che restituisce.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: String(right),
			steps: [`La prima chiamata restituisce ${r1}, la seconda ${r2}: le chiamate non scrivono niente, consegnano un valore.`, `Ogni valore prende il posto della sua chiamata: l’espressione diventa ${r1} + ${r2}.`, `La somma, ${right}, finisce in t e viene scritta una volta sola.`],
			// each call taken to write its value, one call only, the arguments swapped, everything added up
			answer: pick(rng, number(right), [writtenOption([String(r1), String(r2)]), number(r1), number(f.of(b, a) + f.of(d, c)), number(r2), number(a + b + c + d), number(right + 1)]),
			params: reference(shown, [[]], {
				ask: 'output',
				case: kind,
				fn: f.fn,
				k: f.k,
				calls: [
					[a, b],
					[c, d]
				],
				extra: 0
			})
		};
	}
	const e = rng.int(2, 5);
	const times = rng.int(0, 1) === 0;
	const right = times ? r1 * 2 + e : r1 - e;
	const row = times ? `t * 2 + ${e}` : `t - ${e}`;
	const shown = made([defOf(f)], { python: [`t = ${call(f, a, b)}`, `print(${row})`], cpp: [`int t = ${call(f, a, b)};`, `cout << ${row} << endl;`] }, () => [String(right)]);
	const swapped = f.of(b, a);
	return {
		prompt: 'Trova prima quanto vale t.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: String(right),
		steps: [`La chiamata ${call(f, a, b)} restituisce ${r1}.`, `Il valore restituito prende il posto della chiamata: t vale ${r1}.`, `Il programma scrive ${row.replace('t', String(r1))}, cioè ${right}.`],
		answer: pick(rng, number(right), [number(r1), number(times ? swapped * 2 + e : swapped - e), writtenOption([String(r1), String(right)]), number(times ? r1 * (2 + e) : r1 + e), number(right + 1), number(right - 1)]),
		params: reference(shown, [[]], { ask: 'output', case: kind, fn: f.fn, k: f.k, calls: [[a, b]], extra: e, times })
	};
}

// ---------------------------------------------------------------- 3: printing against returning

type Told = 'perso' | 'stampa-dentro' | 'entrambe' | 'dopo-return';

function level3(rng: Rng, kind: Told): CodeBuilt {
	const f = fun(rng, rng.pick(NAMES));
	const [a, b] = f.draw(rng);
	const [c, d] = f.draw(rng);
	const r1 = String(f.of(a, b));
	const r2 = String(f.of(c, d));
	const sum = String(f.of(a, b) + f.of(c, d));
	if (r1 === r2) throw new TooFew('the two calls give the same number');
	let shown: Program;
	let right: string[];
	let wrong: string[][];
	let steps: string[];
	if (kind === 'perso') {
		right = ['Fine'];
		shown = made([defOf(f)], { python: [call(f, a, b), 'print("Fine")'], cpp: [`${call(f, a, b)};`, 'cout << "Fine" << endl;'] }, () => right);
		wrong = [[r1, 'Fine'], [r1], [], ['Fine', r1]];
		steps = [`La chiamata ${call(f, a, b)} viene eseguita e restituisce ${r1}.`, 'La chiamata è da sola su una riga: nessuno raccoglie il valore restituito, che va perso senza comparire sullo schermo.', 'L’unica istruzione che scrive è l’ultima: sullo schermo c’è solo Fine.'];
	} else if (kind === 'stampa-dentro') {
		right = [r1, r2];
		shown = made([{ python: pyDef(f, [`print(${f.text})`]), cpp: cppDef(f, [`cout << ${f.text} << endl;`], 'void') }], { python: [call(f, a, b), call(f, c, d)], cpp: [`${call(f, a, b)};`, `${call(f, c, d)};`] }, () => right);
		wrong = [[sum], [r1], [], [r2, r1], [String(f.of(b, a)), String(f.of(d, c))]];
		steps = [`Questa funzione non restituisce niente: il suo corpo scrive il risultato sullo schermo.`, `Il programma principale non ha stampe, ma ogni chiamata esegue quella del corpo.`, `Le chiamate sono due: prima viene scritto ${r1}, poi ${r2}.`];
	} else if (kind === 'entrambe') {
		right = ['Calcolo', 'Calcolo', sum];
		shown = made(
			[{ python: pyDef(f, ['print("Calcolo")', `return ${f.text}`]), cpp: cppDef(f, ['cout << "Calcolo" << endl;', `return ${f.text};`]) }],
			{ python: [`t = ${call(f, a, b)} + ${call(f, c, d)}`, 'print(t)'], cpp: [`int t = ${call(f, a, b)} + ${call(f, c, d)};`, 'cout << t << endl;'] },
			() => right
		);
		wrong = [[sum], ['Calcolo', sum], ['Calcolo', r1, 'Calcolo', r2], [r1, r2], ['Calcolo', 'Calcolo', r1, r2]];
		steps = [`A ogni chiamata il corpo scrive Calcolo e poi restituisce un numero: scrivere e restituire sono due cose diverse.`, `Le chiamate sono due, quindi Calcolo compare due volte; i valori restituiti, ${r1} e ${r2}, non vengono scritti ma sommati.`, `Alla fine il programma principale scrive t, che vale ${sum}.`];
	} else {
		right = [r1];
		shown = made([{ python: pyDef(f, [`return ${f.text}`, 'print("Fatto")']), cpp: cppDef(f, [`return ${f.text};`, 'cout << "Fatto" << endl;']) }], { python: [`print(${call(f, a, b)})`], cpp: [`cout << ${call(f, a, b)} << endl;`] }, () => right);
		wrong = [[r1, 'Fatto'], ['Fatto', r1], ['Fatto'], []];
		steps = [`La chiamata ${call(f, a, b)} esegue il corpo, che comincia con return.`, 'return restituisce il valore e chiude la funzione: la stampa di Fatto sta sotto, nello stesso blocco, e non viene mai eseguita.', `Il programma principale scrive il valore restituito, ${r1}.`];
	}
	return {
		prompt: 'Distingui quello che una funzione scrive da quello che restituisce.',
		problem: 'Che cosa scrive questo programma, una riga sotto l’altra?',
		code: texts(shown),
		solution: right.join(', '),
		steps,
		answer: pick(rng, printedOption(right), wrong.map(printedOption)),
		params: reference(shown, [[]], {
			ask: 'output',
			case: kind,
			fn: f.fn,
			k: f.k,
			calls: [
				[a, b],
				[c, d]
			]
		})
	};
}

// ---------------------------------------------------------------- 4: a function that calls another, true or false

interface Rule {
	inner: Fun;
	test: string;
	op: '>=' | '>';
	limits: readonly number[];
	yes: string;
	no: string;
}

const RULES: readonly ((rng: Rng) => Rule)[] = [
	(rng) => ({ inner: { fn: 'punti', a: 'vinte', b: 'pareggi', k: 3, text: '3 * vinte + pareggi', of: (a, b) => 3 * a + b, draw: () => [rng.int(1, 4), rng.int(0, 4)] }, test: 'qualificata', op: '>=', limits: [8, 9, 10, 11], yes: 'passa', no: 'fuori' }),
	(rng) => ({ inner: { fn: 'totale', a: 'scritto', b: 'orale', k: 1, text: 'scritto + orale', of: (a, b) => a + b, draw: () => [rng.int(3, 9), rng.int(3, 9)] }, test: 'promosso', op: '>=', limits: [11, 12, 13], yes: 'promosso', no: 'rimandato' }),
	(rng) => ({ inner: { fn: 'durata', a: 'ore', b: 'minuti', k: 60, text: '60 * ore + minuti', of: (a, b) => 60 * a + b, draw: () => [rng.int(1, 2), 10 * rng.int(0, 5)] }, test: 'lungo', op: '>', limits: [90, 100, 110, 120], yes: 'lungo', no: 'corto' })
];

type Verdicts = 'vero-vero' | 'vero-falso' | 'falso-vero' | 'falso-falso';

function level4(rng: Rng, kind: Verdicts): CodeBuilt {
	const rule = rng.pick(RULES)(rng);
	const f = rule.inner;
	const limit = rng.pick(rule.limits);
	const holds = (x: number) => (rule.op === '>=' ? x >= limit : x > limit);
	const wanted = kind.split('-').map((w) => w === 'vero');
	// one pair for each verdict; half of the times one of them sits right on the limit
	const edge = rng.int(0, 1) === 0;
	const pairs: [number, number][] = [];
	for (const [i, want] of wanted.entries()) {
		let found: [number, number] | null = null;
		for (let tries = 0; tries < 200 && !found; tries++) {
			const pair = f.draw(rng);
			const value = f.of(...pair);
			if (holds(value) !== want) continue;
			if (edge && i === 0 && value !== limit && tries < 150) continue;
			if (pairs.some((p) => p[0] === pair[0] && p[1] === pair[1])) continue;
			found = pair;
		}
		if (!found) throw new TooFew('no pair for the verdict');
		pairs.push(found);
	}
	const word = (pair: [number, number]) => (holds(f.of(...pair)) ? rule.yes : rule.no);
	const right = pairs.map(word);
	const selection = (pair: [number, number]) => ({
		python: [`if ${rule.test}(${pair[0]}, ${pair[1]}):`, `    print("${rule.yes}")`, 'else:', `    print("${rule.no}")`],
		cpp: [`if (${rule.test}(${pair[0]}, ${pair[1]})) {`, `    cout << "${rule.yes}" << endl;`, '} else {', `    cout << "${rule.no}" << endl;`, '}']
	});
	const outer = {
		python: [`def ${rule.test}(${f.a}, ${f.b}):`, `    return ${f.fn}(${f.a}, ${f.b}) ${rule.op} ${limit}`].join('\n'),
		cpp: [`bool ${rule.test}(int ${f.a}, int ${f.b}) {`, `    return ${f.fn}(${f.a}, ${f.b}) ${rule.op} ${limit};`, '}'].join('\n')
	};
	const shown = made([defOf(f), outer], { python: pairs.flatMap((p) => selection(p).python), cpp: pairs.flatMap((p) => selection(p).cpp) }, () => right);
	const values = pairs.map((p) => f.of(...p));
	const says = (i: number) => `${values[i]} ${rule.op} ${limit} è ${holds(values[i]) ? 'vero' : 'falso'}`;
	return {
		prompt: 'Per ogni chiamata calcola prima il valore della funzione interna.',
		problem: 'Che cosa scrive questo programma, una riga sotto l’altra?',
		code: texts(shown),
		solution: right.join(', '),
		steps: [
			`${rule.test} chiama ${f.fn} con gli stessi argomenti e restituisce il risultato del confronto con ${limit}: vero oppure falso.`,
			`Prima selezione: ${call(f, ...pairs[0])} vale ${values[0]}, e ${says(0)}: il programma scrive ${right[0]}.`,
			`Seconda selezione: ${call(f, ...pairs[1])} vale ${values[1]}, e ${says(1)}: il programma scrive ${right[1]}.`
		],
		answer: choose(
			rng,
			printedOption(right),
			[
				[rule.yes, rule.yes],
				[rule.yes, rule.no],
				[rule.no, rule.yes],
				[rule.no, rule.no]
			].map(printedOption)
		),
		params: reference(shown, [[]], { ask: 'output', case: kind, fn: f.fn, k: f.k, test: rule.test, op: rule.op, limit, pairs, words: [rule.yes, rule.no] })
	};
}

// ---------------------------------------------------------------- 5 and 6: which function, and write the function

/** A function to recognise or to write, with short parameters so that it fits an option. */
interface Formula {
	family: 'punti' | 'durata' | 'voto' | 'resto' | 'maggiore';
	fn: string;
	a: string;
	b: string;
	reads: string;
	gives: string;
	/** The rows of the body, in Python and in C++. */
	python: string[];
	cpp: string[];
	of: (a: number, b: number) => number;
}

type Family = Formula['family'];

const one = (base: Omit<Formula, 'python' | 'cpp' | 'of'>, text: string, of: Formula['of']): Formula => ({ ...base, python: [`return ${text}`], cpp: [`return ${text};`], of });

function formulas(rng: Rng, family: Family): { right: Formula; wrong: Formula[]; pair: () => [number, number]; k: number } {
	if (family === 'punti') {
		const k = rng.int(2, 5);
		const base = { family, fn: 'punti', a: 'v', b: 'p', reads: 'le partite vinte v e i pareggi p di una squadra', gives: `i punti della squadra: ${k} per ogni partita vinta e 1 per ogni pareggio` };
		return {
			k,
			right: one(base, `${k} * v + p`, (v, p) => k * v + p),
			wrong: [one(base, `${k} * p + v`, (v, p) => k * p + v), one(base, `${k} * (v + p)`, (v, p) => k * (v + p)), one(base, 'v + p', (v, p) => v + p), one(base, `${k} * v`, (v) => k * v), one(base, `${k} + v + p`, (v, p) => k + v + p)],
			pair: () => [rng.int(2, 9), rng.int(1, 6)]
		};
	}
	if (family === 'durata') {
		const base = { family, fn: 'durata', a: 'h', b: 'm', reads: 'le ore h e i minuti m che dura un film', gives: 'la durata del film in minuti' };
		return {
			k: 60,
			right: one(base, '60 * h + m', (h, m) => 60 * h + m),
			wrong: [one(base, '60 * m + h', (h, m) => 60 * m + h), one(base, '60 * (h + m)', (h, m) => 60 * (h + m)), one(base, 'h + m', (h, m) => h + m), one(base, '60 * h', (h) => 60 * h), one(base, '100 * h + m', (h, m) => 100 * h + m)],
			pair: () => [rng.int(1, 3), rng.int(5, 55)]
		};
	}
	if (family === 'voto') {
		const k = rng.int(2, 4);
		const base = { family, fn: 'voto', a: 'g', b: 's', reads: 'le risposte giuste g e quelle sbagliate s di un test', gives: `il punteggio del test: ${k} punti per ogni risposta giusta, meno 1 per ogni risposta sbagliata` };
		return {
			k,
			right: one(base, `${k} * g - s`, (g, s) => k * g - s),
			wrong: [one(base, `${k} * s - g`, (g, s) => k * s - g), one(base, `${k} * (g - s)`, (g, s) => k * (g - s)), one(base, `${k} * g + s`, (g, s) => k * g + s), one(base, 'g - s', (g, s) => g - s), one(base, `${k} * g`, (g) => k * g)],
			pair: () => [rng.int(5, 12), rng.int(1, 4)]
		};
	}
	if (family === 'resto') {
		const k = rng.int(2, 6);
		const base = { family, fn: 'resto', a: 's', b: 'n', reads: 'i soldi s che hai e il numero n di quaderni che compri', gives: `i soldi che ti restano, se un quaderno costa ${k} euro` };
		return {
			k,
			right: one(base, `s - ${k} * n`, (s, n) => s - k * n),
			wrong: [one(base, `${k} * n - s`, (s, n) => k * n - s), one(base, 's - n', (s, n) => s - n), one(base, `(s - ${k}) * n`, (s, n) => (s - k) * n), one(base, `s + ${k} * n`, (s, n) => s + k * n), one(base, `${k} * s - n`, (s, n) => k * s - n)],
			pair: () => [rng.int(40, 60), rng.int(1, 6)]
		};
	}
	const largest = rng.int(0, 1) === 0;
	const base = { family, fn: largest ? 'maggiore' : 'minore', a: 'a', b: 'b', reads: 'due numeri interi a e b', gives: largest ? 'il più grande dei due' : 'il più piccolo dei due' };
	const branches = (test: string, first: string, second: string, of: Formula['of']): Formula => ({
		...base,
		python: [`if ${test}:`, `    return ${first}`, 'else:', `    return ${second}`],
		cpp: [`if (${test}) {`, `    return ${first};`, '} else {', `    return ${second};`, '}'],
		of
	});
	const sign = largest ? '>' : '<';
	const best = (a: number, b: number) => (largest ? Math.max(a, b) : Math.min(a, b));
	const worst = (a: number, b: number) => (largest ? Math.min(a, b) : Math.max(a, b));
	return {
		k: largest ? 1 : 0,
		right: branches(`a ${sign} b`, 'a', 'b', best),
		wrong: [branches(`a ${sign} b`, 'b', 'a', worst), one(base, 'a', (a) => a), one(base, 'b', (_, b) => b), one(base, 'a - b', (a, b) => a - b), branches(`a ${sign} b`, 'a', 'a + b', (a, b) => (best(a, b) === a && a !== b ? a : a + b))],
		pair: () => [rng.int(2, 30), rng.int(2, 30)]
	};
}

const formulaShown = (f: Formula) => ({ python: [`def ${f.fn}(${f.a}, ${f.b}):`, ...f.python.map((row) => `    ${row}`)].join('\n') + '\n', cpp: [`int ${f.fn}(int ${f.a}, int ${f.b}) {`, ...f.cpp.map((row) => `    ${row}`), '}'].join('\n') + '\n' });

/** Different pairs with different first and second numbers, and never two equal numbers in a pair. */
function pairsOf(pair: () => [number, number], count: number): [number, number][] {
	const pairs: [number, number][] = [];
	for (let tries = 0; pairs.length < count && tries < 500; tries++) {
		const p = pair();
		if (p[0] !== p[1] && !pairs.some((q) => q[0] === p[0] || q[1] === p[1])) pairs.push(p);
	}
	if (pairs.length < count) throw new TooFew('not enough pairs');
	return pairs;
}

function level5(rng: Rng, family: Family): CodeBuilt {
	const { right, wrong, pair, k } = formulas(rng, family);
	const pairs = pairsOf(pair, 2);
	const whole = (f: Formula): Program => {
		const shown = formulaShown(f);
		return program(`${shown.python}\n${pairs.map((p) => `print(${f.fn}(${p[0]}, ${p[1]}))`).join('\n')}\n`, cppProgram(pairs.map((p) => `cout << ${f.fn}(${p[0]}, ${p[1]}) << endl;`).join('\n'), shown.cpp), () => pairs.map((p) => String(f.of(...p))));
	};
	const reference_ = whole(right);
	const others = wrong.map((f) => ({ formula: f, whole: whole(f) }));
	const kept = wrongPrograms(
		reference_,
		others.map((o) => o.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	return {
		prompt: 'Leggi che cosa restituisce ogni funzione, e in che ordine usa i parametri.',
		problem: `Una funzione riceve ${right.reads}. Quale funzione restituisce ${right.gives}?`,
		solution: `La funzione che restituisce ${right.python.join(' ').replace(/return /g, '').replace(/:/g, '')}.`,
		steps: [`I parametri sono ${right.a} e ${right.b}, in quest’ordine: ${right.reads}.`, `Il valore da restituire è ${right.gives}.`, `Nelle altre funzioni i due parametri sono scambiati, oppure il conto è un altro: prova ogni funzione con ${right.a} = ${pairs[0][0]} e ${right.b} = ${pairs[0][1]}, deve dare ${right.of(...pairs[0])}.`],
		solutionCode: formulaShown(right),
		answer: choose(
			rng,
			programOption(reference_, formulaShown(right)),
			shuffle(rng, kept).map((p) => programOption(p, formulaShown(others.find((o) => o.whole === p)!.formula)))
		),
		params: reference(reference_, [[]], { case: family, fn: right.fn, k, pairs })
	};
}

function level6(rng: Rng, family: Family): CodeBuilt {
	const { right, wrong, pair, k } = formulas(rng, family);
	const whole = (f: Formula): Program => {
		const shown = formulaShown(f);
		return program(`${shown.python}\n${f.a} = int(input())\n${f.b} = int(input())\nprint(${f.fn}(${f.a}, ${f.b}))\n`, cppProgram(`int ${f.a}, ${f.b};\ncin >> ${f.a} >> ${f.b};\ncout << ${f.fn}(${f.a}, ${f.b}) << endl;`, shown.cpp), (input) => {
			const next = reader(input);
			return [String(f.of(Number(next()), Number(next())))];
		});
	};
	const solution = whole(right);
	const pairs = pairsOf(pair, 3);
	// with the larger of two numbers, one run where it is the first and one where it is the second
	if (family === 'maggiore' && new Set(pairs.map((p) => p[0] > p[1])).size < 2) throw new TooFew('the larger is always on the same side');
	const tests = pairs.map((p) => p.map(String));
	const others = wrong.map((f) => ({ formula: f, whole: whole(f) }));
	const kept = wrongPrograms(
		solution,
		others.map((o) => o.whole),
		tests
	);
	if (kept.length < 3 || new Set(tests.map((t) => written(solution, t)![0])).size < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	const start = {
		python: `# scrivi qui la funzione ${right.fn}\n\n${right.a} = int(input())\n${right.b} = int(input())\n# scrivi qui il resto\n`,
		cpp: cppProgram(`int ${right.a}, ${right.b};\ncin >> ${right.a} >> ${right.b};\n// scrivi qui il resto`, `// scrivi qui la funzione ${right.fn}\n`)
	};
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge ${right.reads}. Scrivi una funzione ${right.fn}(${right.a}, ${right.b}) che restituisce ${right.gives}. Poi chiamala e scrivi il risultato. La lettura c’è già.`,
		solution: `Una funzione ${right.fn} con i parametri ${right.a} e ${right.b} che restituisce il risultato con return, chiamata con i due numeri letti.`,
		steps: [
			`Sopra il resto del programma definisci la funzione ${right.fn} con i due parametri ${right.a} e ${right.b}.`,
			family === 'maggiore' ? 'Nel corpo una selezione confronta i due parametri, e ogni ramo ha il suo return.' : 'Nel corpo calcola il risultato e restituiscilo con return: la funzione non scrive niente.',
			`Dopo la lettura chiama ${right.fn}(${right.a}, ${right.b}) e scrivi il valore che restituisce.`
		],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'funzione'),
		choice: choose(
			rng,
			programOption(solution, formulaShown(right)),
			kept.map((p) => programOption(p, formulaShown(others.find((o) => o.whole === p)!.formula)))
		),
		params: reference(solution, tests, { case: family, fn: right.fn, k })
	};
}

export default makeCodeGenerator(ID, 'Parametri e valore di ritorno', {
	1: { label: 'Argomenti e parametri', constraints: ['a function of two parameters whose result changes when they are swapped', 'four different numbers'], build: drawn(['numeri', 'variabili', 'espressione'] as const, level1) },
	2: { label: 'Il risultato in un conto', constraints: ['the returned value is added, kept in a variable or passed to another call', 'four different outputs'], build: drawn(['somma', 'variabile', 'annidata'] as const, level2) },
	3: { label: 'Stampare o restituire', constraints: ['a value returned and dropped, printed inside, printed and returned, a print after return', 'four different outputs'], build: drawn(['perso', 'stampa-dentro', 'entrambe', 'dopo-return'] as const, level3) },
	4: { label: 'Una funzione ne chiama un’altra', constraints: ['a function that returns true or false and calls another', 'two selections, the four pairs of answers as options'], build: drawn(['vero-vero', 'vero-falso', 'falso-vero', 'falso-falso'] as const, level4) },
	5: { label: 'Quale funzione restituisce questo', constraints: ['four functions that give back different numbers', 'each option shows the function alone'], build: drawn(['punti', 'durata', 'voto', 'resto'] as const, level5) },
	6: { label: 'Scrivere una funzione con return', constraints: ['the program reads two numbers', 'graded by running it on three pairs', 'needs a function of its own'], build: drawn(['punti', 'durata', 'voto', 'maggiore'] as const, level6) }
});
