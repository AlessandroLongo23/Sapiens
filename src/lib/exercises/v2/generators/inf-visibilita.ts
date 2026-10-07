/**
 * Exercises for the lesson "Variabili locali e globali" (informatica, third year, lesson 67).
 * Spec: specs/exercises/inf-visibilita.md
 *
 * 1. where a variable exists (text options under a program); 2. two variables with the same name, what the program
 * writes; 3. a global variable, what the program writes; 4. which function works from its parameters alone
 * (options that are programs, shown by their function); 5. write the function (open answer, graded on what the
 * program writes and on the function).
 *
 * Every program is written by hand in the two languages (v2/inf-codice.ts). Globals are declared above the
 * functions, so that Python and C++ agree on what is global; the questions of level 1 ask about the locals of a
 * function and about globals, never about the variables of the main program, which are global in Python and local
 * to `main` in C++.
 */
import type { CodeText, Rng } from '../types';
import { choose, cppProgram, lines, makeCodeGenerator, needing, program, programAnswer, programOption, reader, reference, shuffle, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-visibilita';

type Pair = [number, number];

/** A function of two whole numbers that keeps `k * a + b` or `k * a - b` in a local variable and returns it. */
interface Calc {
	family: 'paga' | 'spesa' | 'tempo' | 'punti';
	fn: string;
	a: string;
	b: string;
	local: string;
	sign: 1 | -1;
	/** The ranges the coefficient and the two arguments are drawn from. */
	k: Pair;
	as: Pair;
	bs: Pair;
	/** The global that holds the coefficient, where a level makes it one. */
	coef: string;
	/** A global a careless function reads where its second parameter should be. */
	spare: string;
	/** Three variables of the main program: two results and their sum. */
	vars: [string, string, string];
	/** What the program reads and what the function gives back, as an exercise says it. */
	reads: string;
	gives: (k: number) => string;
}

const CALCS: Record<Calc['family'], Calc> = {
	paga: {
		family: 'paga',
		fn: 'paga',
		a: 'ore',
		b: 'premio',
		local: 'soldi',
		sign: 1,
		k: [6, 9],
		as: [2, 8],
		bs: [1, 9],
		coef: 'tariffa',
		spare: 'bonus',
		vars: ['lunedi', 'sabato', 'settimana'],
		reads: 'le ore di lavoro e il premio',
		gives: (k) => `i soldi guadagnati: ${k} euro per ogni ora, più il premio`
	},
	spesa: {
		family: 'spesa',
		fn: 'spesa',
		a: 'kg',
		b: 'sconto',
		local: 'conto',
		sign: -1,
		k: [3, 6],
		as: [3, 9],
		bs: [1, 6],
		coef: 'prezzo',
		spare: 'buono',
		vars: ['mele', 'pere', 'frutta'],
		reads: 'i chili di frutta e lo sconto',
		gives: (k) => `il conto della frutta: ${k} euro per ogni chilo, meno lo sconto`
	},
	tempo: {
		family: 'tempo',
		fn: 'tempo',
		a: 'giri',
		b: 'pausa',
		local: 'minuti',
		sign: 1,
		k: [2, 5],
		as: [2, 9],
		bs: [1, 9],
		coef: 'durata',
		spare: 'sosta',
		vars: ['mattina', 'sera', 'giorno'],
		reads: 'i giri di pista e i minuti di pausa',
		gives: (k) => `i minuti di allenamento: ${k} minuti per ogni giro di pista, più la pausa`
	},
	punti: {
		family: 'punti',
		fn: 'punti',
		a: 'vinte',
		b: 'pari',
		local: 'totale',
		sign: 1,
		k: [2, 5],
		as: [2, 9],
		bs: [0, 6],
		coef: 'valore',
		spare: 'extra',
		vars: ['andata', 'ritorno', 'stagione'],
		reads: 'le partite vinte e le partite pari di una squadra',
		gives: (k) => `i punti in classifica: ${k} per ogni vittoria e 1 per ogni pari`
	}
};

/** The functions of the levels to read: `punti` is the example of the lesson, and is kept for the level to write. */
const PLAIN = [CALCS.paga, CALCS.spesa, CALCS.tempo] as const;
const PLAIN_FAMILIES = ['paga', 'spesa', 'tempo'] as const;

/** What a function gives back, inside a longer sentence: the rule goes between round brackets. */
const aside = (gives: string) => `${gives.replace(': ', ' (')})`;

const op = (sign: number) => (sign > 0 ? '+' : '-');
const linear = (k: string | number, a: string, sign: number, b: string | number) => `${k} * ${a} ${op(sign)} ${b}`;
/** The same sum as a formula of the text: `$9 \cdot 4 + 5 = 41$`. */
const worked = (k: number, a: number, sign: number, b: number) => `$${k} \\cdot ${a} ${op(sign)} ${b} = ${k * a + sign * b}$`;

/** The body of a `Calc`: what goes in the local variable, what is returned and the number that comes back. */
interface Variant {
	expr: string;
	ret: string;
	of: (a: number, b: number) => number;
}

function variants(c: Calc, k: number): { right: Variant; wrong: Variant[] } {
	const s = c.sign;
	const right: Variant = { expr: linear(k, c.a, s, c.b), ret: c.local, of: (a, b) => k * a + s * b };
	return {
		right,
		wrong: [
			// the parameters exchanged
			{ expr: linear(k, c.b, s, c.a), ret: c.local, of: (a, b) => k * b + s * a },
			// the wrong operation
			{ expr: linear(k, c.a, -s, c.b), ret: c.local, of: (a, b) => k * a - s * b },
			// the coefficient forgotten
			{ expr: `${c.a} ${op(s)} ${c.b}`, ret: c.local, of: (a, b) => a + s * b },
			// the coefficient added, not multiplied
			{ expr: `${k} + ${c.a} ${op(s)} ${c.b}`, ret: c.local, of: (a, b) => k + a + s * b },
			// the result worked out and left there: a parameter is what comes back
			{ expr: right.expr, ret: c.a, of: (a) => a }
		]
	};
}

const calcShown = (c: Calc, v: Variant): CodeText => ({
	python: lines(`def ${c.fn}(${c.a}, ${c.b}):`, `    ${c.local} = ${v.expr}`, `    return ${v.ret}`),
	cpp: lines(`int ${c.fn}(int ${c.a}, int ${c.b}) {`, `    int ${c.local} = ${v.expr};`, `    return ${v.ret};`, '}')
});

const called = (c: Calc, [x, y]: Pair) => `${c.fn}(${x}, ${y})`;
const say = (what: string) => `cout << ${what} << endl;`;

/** `count` pairs of arguments for `c`, with different first numbers, different second numbers and different results. */
function pairs(rng: Rng, c: Calc, k: number, count: number): Pair[] {
	const value = ([a, b]: Pair) => k * a + c.sign * b;
	for (;;) {
		const out: Pair[] = [];
		while (out.length < count) {
			const p: Pair = [rng.int(...c.as), rng.int(...c.bs)];
			if (p[0] !== p[1] && !out.some((q) => q[0] === p[0] || q[1] === p[1])) out.push(p);
		}
		if (new Set(out.map(value)).size === count) return out;
	}
}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one. The
 * family is drawn once, before: drawn again with the numbers, the families that fail more often would come out
 * less. After forty draws the error is the generator's.
 */
const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 40 || !(e instanceof TooFew)) throw e;
			}
		}
	};
class TooFew extends Error {}

/**
 * What a program writes as a multiple choice: the right rows, the wrong answers that must be there (each a mistake
 * the lesson warns about) and others to fill up, shuffled. `TooFew` where two of them are the same.
 */
function outputs(rng: Rng, right: number[], must: number[][], rest: number[][]) {
	const key = (rows: number[]) => rows.join('|');
	const needed = new Set([right, ...must].map(key));
	if (needed.size !== must.length + 1) throw new TooFew(`${ID}: a mistake writes what the program does`);
	const others = [...must, ...shuffle(rng, rest).filter((rows) => !needed.has(key(rows)))];
	if (new Set(others.map(key)).size < 3) throw new TooFew(`${ID}: fewer than three wrong outputs`);
	const option = (rows: number[]) => writtenOption(rows.map(String));
	return choose(rng, option(right), others.map(option));
}

// ---------------------------------------------------------------------------------------------------------------
// Level 1: where a variable exists
// ---------------------------------------------------------------------------------------------------------------

/** The second function of the programs with a global: one parameter and one local, with names of its own. */
const SECOND: Record<(typeof PLAIN_FAMILIES)[number], { fn: string; p: string; local: string }> = {
	paga: { fn: 'festivo', p: 'turni', local: 'extra' },
	spesa: { fn: 'cesto', p: 'pezzi', local: 'somma' },
	tempo: { fn: 'gara', p: 'prove', local: 'attesa' }
};

const KINDS1 = ['locali', 'fuori', 'dove'] as const;

function whereUsable(rng: Rng): CodeBuilt {
	const c = rng.pick(PLAIN);
	const second = SECOND[c.family as (typeof PLAIN_FAMILIES)[number]];
	const g = rng.int(...c.k);
	const x = rng.int(...c.as);
	const y = rng.int(2, 6);
	const plus = rng.int(1, 9);
	const shown = program(
		lines(`${c.coef} = ${g}`, '', `def ${c.fn}(${c.a}):`, `    ${c.local} = ${c.coef} * ${c.a}`, `    return ${c.local}`, '', `def ${second.fn}(${second.p}):`, `    ${second.local} = ${c.coef} * ${second.p} + ${plus}`, `    return ${second.local}`, '', `print(${c.fn}(${x}))`, `print(${second.fn}(${y}))`),
		cppProgram(
			lines(say(`${c.fn}(${x})`), say(`${second.fn}(${y})`)),
			lines(`int ${c.coef} = ${g};`, '', `int ${c.fn}(int ${c.a}) {`, `    int ${c.local} = ${c.coef} * ${c.a};`, `    return ${c.local};`, '}', '', `int ${second.fn}(int ${second.p}) {`, `    int ${second.local} = ${c.coef} * ${second.p} + ${plus};`, `    return ${second.local};`, '}')
		),
		() => [String(g * x), String(g * y + plus)]
	);
	const places: Record<string, string> = {
		[`funzione:${c.fn}`]: `solo nella funzione ${c.fn}`,
		[`funzione:${second.fn}`]: `solo nella funzione ${second.fn}`,
		funzioni: 'nelle due funzioni, ma non nel programma principale',
		principale: 'solo nel programma principale',
		tutto: 'nelle due funzioni e nel programma principale'
	};
	const option = (place: string) => textOption(places[place], place);
	const what = rng.pick(['globale', 'parametro', 'locale'] as const);
	const first = rng.int(0, 1) === 0;
	const [home, other] = first ? [c.fn, second.fn] : [second.fn, c.fn];
	const name = what === 'globale' ? c.coef : what === 'parametro' ? (first ? c.a : second.p) : first ? c.local : second.local;
	const right = what === 'globale' ? 'tutto' : `funzione:${home}`;
	const wrong = Object.keys(places).filter((place) => place !== right);
	// who mistakes a local for a global answers "everywhere": that option is always there
	const others = what === 'globale' ? shuffle(rng, wrong) : ['tutto', ...shuffle(rng, wrong.filter((place) => place !== 'tutto'))];
	return {
		prompt: 'Guarda dove nasce la variabile: dentro una funzione o fuori da tutte.',
		problem: `In quale parte del programma puoi usare la variabile ${name}?`,
		code: texts(shown),
		solution: what === 'globale' ? `In tutto il programma: ${name} è una variabile globale.` : `Solo nella funzione ${home}: ${name} è una sua variabile locale.`,
		steps:
			what === 'globale'
				? [`La variabile ${name} è creata fuori da ogni funzione, sopra tutte: è una variabile globale.`, `Una variabile globale vive fino alla fine del programma e si può usare nelle funzioni che la seguono, qui ${c.fn} e ${second.fn}, e nel programma principale.`]
				: [
						what === 'parametro' ? `La variabile ${name} è un parametro della funzione ${home}, e i parametri sono variabili locali.` : `La variabile ${name} nasce dentro la funzione ${home}: è una sua variabile locale.`,
						`La visibilità di una variabile locale è la sua funzione: né ${other} né il programma principale la possono usare.`,
						`Nasce quando ${home} viene chiamata e sparisce quando ${home} ritorna.`
					],
		answer: choose(rng, option(right), others.map(option)),
		params: reference(shown, [[]], { case: 'dove', name, what })
	};
}

function level1(rng: Rng, kind: (typeof KINDS1)[number]): CodeBuilt {
	if (kind === 'dove') return whereUsable(rng);
	const c = rng.pick(PLAIN);
	const k = rng.int(...c.k);
	const [p, q] = pairs(rng, c, k, 2);
	const { right } = variants(c, k);
	const fn = calcShown(c, right);
	const [m1, m2, m3] = c.vars;
	const shown = program(
		lines(fn.python.trimEnd(), '', `${m1} = ${called(c, p)}`, `${m2} = ${called(c, q)}`, `${m3} = ${m1} + ${m2}`, `print(${m3})`),
		cppProgram(lines(`int ${m1} = ${called(c, p)};`, `int ${m2} = ${called(c, q)};`, `int ${m3} = ${m1} + ${m2};`, say(m3)), fn.cpp),
		() => [String(right.of(...p) + right.of(...q))]
	);
	const main = `${m1}, ${m2} e ${m3}`;
	if (kind === 'locali') {
		const names = (...list: string[]) => textOption(list.join(', '));
		return {
			prompt: 'Guarda dove nasce ogni variabile.',
			problem: `Quali sono le variabili locali della funzione ${c.fn}?`,
			code: texts(shown),
			solution: `${c.a}, ${c.b} e ${c.local}.`,
			steps: [
				`È locale la variabile creata dentro la funzione: qui ${c.local}.`,
				`Anche i parametri ${c.a} e ${c.b} sono variabili locali: ricevono il loro valore dagli argomenti della chiamata.`,
				`Le variabili ${main} nascono nel programma principale, fuori da ${c.fn}.`
			],
			// who forgets that the parameters are locals comes first; then the other ways of mixing the two places
			answer: choose(rng, names(c.a, c.b, c.local), [names(c.local), ...shuffle(rng, [names(c.a, c.b), names(c.local, m1, m2, m3), names(m1, m2, m3), names(c.a, c.b, c.local, m1, m2, m3)])]),
			params: reference(shown, [[]], { case: kind, function: c.fn })
		};
	}
	const name = rng.pick([c.a, c.b, c.local]);
	return {
		prompt: 'Per ogni variabile chiediti dove è nata.',
		problem: 'In fondo al programma principale vuoi aggiungere un’istruzione che scrive una di queste variabili. Con quale il programma dà errore?',
		code: texts(shown),
		solution: `Con ${name}, che è una variabile locale di ${c.fn}.`,
		steps: [
			name === c.local ? `La variabile ${name} nasce dentro la funzione ${c.fn}: è una sua variabile locale, e si può usare solo lì.` : `La variabile ${name} è un parametro di ${c.fn}, quindi una sua variabile locale: si può usare solo lì.`,
			`Quando ${c.fn} ritorna, ${name} sparisce: dalla funzione esce solo il valore restituito da return, e nel programma principale quel nome non esiste.`,
			`Le variabili ${main} sono del programma principale, e in fondo esistono ancora.`
		],
		answer: choose(rng, textOption(name), shuffle(rng, [m1, m2, m3]).map((v) => textOption(v))),
		params: reference(shown, [[]], { case: kind, name })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 2: two variables with the same name
// ---------------------------------------------------------------------------------------------------------------

/** A function that adds its parameter to a variable which starts again at every call. */
const ADDERS = [
	{ fn: 'versa', p: 'euro', name: 'saldo' },
	{ fn: 'carica', p: 'litri', name: 'livello' },
	{ fn: 'sali', p: 'gradini', name: 'quota' },
	{ fn: 'segna', p: 'gol', name: 'reti' }
] as const;

const KINDS2 = ['nascosta', 'rinasce', 'somma'] as const;

function level2(rng: Rng, kind: (typeof KINDS2)[number]): CodeBuilt {
	const start = rng.int(20, 90);
	const base = { prompt: 'Guarda in quale parte del programma sta ogni variabile.', problem: 'Che cosa scrive questo programma?' };
	if (kind === 'rinasce') {
		const t = rng.pick(ADDERS);
		// half of the times the local starts from 0, the counter of the lesson that cannot count
		const from = rng.int(0, 1) === 0 ? 0 : rng.int(1, 9) * 10;
		const x = rng.int(2, 9);
		let y = rng.int(2, 9);
		while (y === x) y = rng.int(2, 9);
		const right = [from + x, from + y, start];
		const shown = program(
			lines(`def ${t.fn}(${t.p}):`, `    ${t.name} = ${from}`, `    ${t.name} = ${t.name} + ${t.p}`, `    return ${t.name}`, '', `${t.name} = ${start}`, `print(${t.fn}(${x}))`, `print(${t.fn}(${y}))`, `print(${t.name})`),
			cppProgram(lines(`int ${t.name} = ${start};`, say(`${t.fn}(${x})`), say(`${t.fn}(${y})`), say(t.name)), lines(`int ${t.fn}(int ${t.p}) {`, `    int ${t.name} = ${from};`, `    ${t.name} = ${t.name} + ${t.p};`, `    return ${t.name};`, '}')),
			() => right.map(String)
		);
		return {
			...base,
			code: texts(shown),
			solution: right.join(', '),
			steps: [
				`A ogni chiamata di ${t.fn} nasce una variabile locale ${t.name} nuova, che parte da ${from}: la prima chiamata restituisce ${right[0]}, la seconda ${right[1]}.`,
				`Una variabile locale non ricorda la chiamata precedente: il ${right[0]} della prima chiamata è sparito al ritorno.`,
				`La variabile ${t.name} del programma principale è un'altra variabile, e vale ancora ${start}.`
			],
			answer: outputs(
				rng,
				right,
				[
					// the local remembers the call before
					[from + x, from + x + y, start],
					// the function changes the variable of the main program
					[from + x, from + y, from + y]
				],
				[
					[from + x, from + x + y, from + x + y],
					[start + x, start + x + y, start + x + y],
					[start + x, start + y, start]
				]
			),
			params: reference(shown, [[]], { ask: 'output', case: kind, name: t.name, from, added: [x, y], start })
		};
	}
	const c = rng.pick(PLAIN);
	const k = rng.int(...c.k);
	const [p, q] = pairs(rng, c, k, 2);
	const { right: body } = variants(c, k);
	const fn = calcShown(c, body);
	const [r1, r2] = [body.of(...p), body.of(...q)];
	const [m1, m2] = c.vars;
	const params = { ask: 'output', case: kind, name: c.local, k, sign: c.sign, calls: [p, q], start };
	if (kind === 'nascosta') {
		const right = [start, r1, r2];
		const shown = program(
			lines(fn.python.trimEnd(), '', `${c.local} = ${start}`, `${m1} = ${called(c, p)}`, `${m2} = ${called(c, q)}`, `print(${c.local})`, `print(${m1})`, `print(${m2})`),
			cppProgram(lines(`int ${c.local} = ${start};`, `int ${m1} = ${called(c, p)};`, `int ${m2} = ${called(c, q)};`, say(c.local), say(m1), say(m2)), fn.cpp),
			() => right.map(String)
		);
		return {
			...base,
			code: texts(shown),
			solution: right.join(', '),
			steps: [
				`Le variabili ${c.local} sono due: una del programma principale, che vale ${start}, e una locale di ${c.fn}, che nasce a ogni chiamata e sparisce al ritorno.`,
				`La prima chiamata restituisce ${worked(k, p[0], c.sign, p[1])}, la seconda ${worked(k, q[0], c.sign, q[1])}: i due valori vanno in ${m1} e ${m2}.`,
				`La funzione non ha mai toccato la variabile ${c.local} del programma principale, che vale ancora ${start}.`
			],
			answer: outputs(
				rng,
				right,
				// the function changes the variable of the main program
				[[r2, r1, r2]],
				[
					[r1, r1, r2],
					[start + r1 + r2, r1, r2],
					[r1 + r2, r1, r2],
					[0, r1, r2]
				]
			),
			params: reference(shown, [[]], params)
		};
	}
	const right = [start + r1 + r2];
	const shown = program(
		lines(fn.python.trimEnd(), '', `${c.local} = ${start}`, `${c.local} = ${c.local} + ${called(c, p)}`, `${c.local} = ${c.local} + ${called(c, q)}`, `print(${c.local})`),
		cppProgram(lines(`int ${c.local} = ${start};`, `${c.local} = ${c.local} + ${called(c, p)};`, `${c.local} = ${c.local} + ${called(c, q)};`, say(c.local)), fn.cpp),
		() => right.map(String)
	);
	return {
		...base,
		code: texts(shown),
		solution: String(right[0]),
		steps: [
			`Dentro ${c.fn} c'è una variabile locale ${c.local}, diversa da quella del programma principale: la funzione restituisce ${worked(k, p[0], c.sign, p[1])} e poi ${worked(k, q[0], c.sign, q[1])}.`,
			`Il programma principale aggiunge i due valori di ritorno alla sua variabile ${c.local}, che parte da ${start}.`,
			`Il conto lo tiene chi chiama, nella sua variabile: $${start} + ${r1} + ${r2} = ${right[0]}$.`
		],
		answer: outputs(
			rng,
			right,
			// the variable of the main program lost at the first call, as if the function had written over it
			[[r1 + r2]],
			[[r2], [start], [start + r2], [start + r1], [2 * r2]]
		),
		params: reference(shown, [[]], params)
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 3: a global variable
// ---------------------------------------------------------------------------------------------------------------

const KINDS3 = ['cambia', 'nasconde', 'modifica'] as const;

function level3(rng: Rng, kind: (typeof KINDS3)[number]): CodeBuilt {
	const base = { prompt: 'Cerca la variabile creata fuori dalle funzioni, e chi la cambia.', problem: 'Che cosa scrive questo programma?' };
	if (kind === 'modifica') {
		const t = rng.pick(ADDERS);
		const start = rng.int(2, 9) * 10;
		const x = rng.int(2, 9);
		let y = rng.int(2, 9);
		while (y === x) y = rng.int(2, 9);
		const right = [start + x + y];
		const shown = program(
			lines(`${t.name} = ${start}`, '', `def ${t.fn}(${t.p}):`, `    global ${t.name}`, `    ${t.name} = ${t.name} + ${t.p}`, '', `${t.fn}(${x})`, `${t.fn}(${y})`, `print(${t.name})`),
			cppProgram(lines(`${t.fn}(${x});`, `${t.fn}(${y});`, say(t.name)), lines(`int ${t.name} = ${start};`, '', `void ${t.fn}(int ${t.p}) {`, `    ${t.name} = ${t.name} + ${t.p};`, '}')),
			() => right.map(String)
		);
		return {
			...base,
			code: texts(shown),
			solution: String(right[0]),
			steps: [
				`La variabile ${t.name} è globale, e ${t.fn} la modifica: non crea una variabile locale (in Python lo dice la riga global ${t.name}).`,
				`Una variabile globale vive fino alla fine del programma, quindi dopo la prima chiamata vale $${start} + ${x} = ${start + x}$.`,
				`La seconda chiamata parte da lì e aggiunge ${y}: alla fine il programma scrive ${right[0]}.`
			],
			answer: outputs(
				rng,
				right,
				[
					// the function works on a local and the global stays as it was
					[start],
					// the variable does not remember the first call
					[start + y]
				],
				[[x + y], [start + x], [y]]
			),
			params: reference(shown, [[]], { ask: 'output', case: kind, name: t.name, start, added: [x, y] })
		};
	}
	const c = rng.pick(PLAIN);
	if (kind === 'cambia') {
		const g1 = rng.int(...c.k);
		let g2 = rng.int(c.k[0] - 1, c.k[1] + 1);
		while (g2 === g1) g2 = rng.int(c.k[0] - 1, c.k[1] + 1);
		const [[a, b]] = pairs(rng, c, g1, 1);
		const [r1, r2] = [g1 * a + c.sign * b, g2 * a + c.sign * b];
		const expr = linear(c.coef, c.a, c.sign, c.b);
		const shown = program(
			lines(`${c.coef} = ${g1}`, '', `def ${c.fn}(${c.a}, ${c.b}):`, `    return ${expr}`, '', `print(${called(c, [a, b])})`, `${c.coef} = ${g2}`, `print(${called(c, [a, b])})`),
			cppProgram(lines(say(called(c, [a, b])), `${c.coef} = ${g2};`, say(called(c, [a, b]))), lines(`int ${c.coef} = ${g1};`, '', `int ${c.fn}(int ${c.a}, int ${c.b}) {`, `    return ${expr};`, '}')),
			() => [String(r1), String(r2)]
		);
		return {
			...base,
			code: texts(shown),
			solution: `${r1}, ${r2}`,
			steps: [
				`La variabile ${c.coef} è globale: ${c.fn} la legge anche se non è tra i suoi parametri.`,
				`Alla prima chiamata ${c.coef} vale ${g1}, e la funzione restituisce ${worked(g1, a, c.sign, b)}.`,
				`Poi il programma principale porta ${c.coef} a ${g2}: la stessa chiamata ora restituisce ${worked(g2, a, c.sign, b)}.`
			],
			answer: outputs(
				rng,
				[r1, r2],
				// the same call gives the same result
				[[r1, r1]],
				[
					[r2, r2],
					[r2, r1],
					[r1, g2]
				]
			),
			params: reference(shown, [[]], { ask: 'output', case: kind, name: c.coef, values: [g1, g2], sign: c.sign, call: [a, b] })
		};
	}
	const k = rng.int(...c.k);
	const a = rng.int(...c.as);
	const outer = rng.int(1, 8);
	let inner = rng.int(1, 8);
	while (inner === outer) inner = rng.int(1, 8);
	const value = (b: number) => k * a + c.sign * b;
	const expr = linear(k, c.a, c.sign, c.b);
	const shown = program(
		lines(`${c.b} = ${outer}`, '', `def ${c.fn}(${c.a}):`, `    ${c.b} = ${inner}`, `    return ${expr}`, '', `print(${c.fn}(${a}))`, `print(${c.b})`),
		cppProgram(lines(say(`${c.fn}(${a})`), say(c.b)), lines(`int ${c.b} = ${outer};`, '', `int ${c.fn}(int ${c.a}) {`, `    int ${c.b} = ${inner};`, `    return ${expr};`, '}')),
		() => [String(value(inner)), String(outer)]
	);
	return {
		...base,
		code: texts(shown),
		solution: `${value(inner)}, ${outer}`,
		steps: [
			`Dentro ${c.fn} nasce una variabile locale ${c.b}, che vale ${inner}: ha il nome della variabile globale e la nasconde.`,
			`Nella funzione il nome ${c.b} indica la locale: il valore restituito è ${worked(k, a, c.sign, inner)}.`,
			`La variabile globale ${c.b} resta com'era: l'ultima riga scrive ${outer}.`
		],
		answer: outputs(
			rng,
			[value(inner), outer],
			[
				// the assignment in the function changes the global
				[value(inner), inner],
				// the function reads the global
				[value(outer), outer]
			],
			[
				[value(outer), inner],
				[value(inner + outer), outer]
			]
		),
		params: reference(shown, [[]], { ask: 'output', case: kind, name: c.b, k, sign: c.sign, a, global: outer, local: inner })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 4: without global variables
// ---------------------------------------------------------------------------------------------------------------

function level4(rng: Rng, family: (typeof PLAIN_FAMILIES)[number]): CodeBuilt {
	const c = CALCS[family];
	const k = rng.int(...c.k);
	const calls = pairs(rng, c, k, 2);
	let g = rng.int(c.bs[0], c.bs[1] + 3);
	while (calls.some(([, y]) => y === g)) g = rng.int(c.bs[0], c.bs[1] + 3);
	const { right, wrong } = variants(c, k);
	// the function that reads the global where its second parameter should be
	const careless: Variant = { expr: linear(k, c.a, c.sign, c.spare), ret: c.local, of: (a) => k * a + c.sign * g };
	const bodies = new Map<Program, Variant>();
	const whole = (v: Variant) => {
		const fn = calcShown(c, v);
		const p = program(
			lines(`${c.spare} = ${g}`, '', fn.python.trimEnd(), '', ...calls.map((pair) => `print(${called(c, pair)})`)),
			cppProgram(lines(...calls.map((pair) => say(called(c, pair)))), lines(`int ${c.spare} = ${g};`, '', fn.cpp.trimEnd())),
			() => calls.map((pair) => String(v.of(...pair)))
		);
		bodies.set(p, v);
		return p;
	};
	const solution = whole(right);
	const global = whole(careless);
	const kept = wrongPrograms(solution, [global, ...shuffle(rng, wrong).map(whole)], [[]]);
	if (kept[0] !== global || kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	const option = (p: Program) => programOption(p, calcShown(c, bodies.get(p)!));
	return {
		prompt: 'Leggi il corpo di ogni funzione: da dove prende i suoi valori?',
		problem: `Sopra la funzione il programma ha la variabile globale ${c.spare}, che vale ${g}. Di ogni programma vedi solo la funzione. Quale funzione calcola ${aside(c.gives(k))} usando solo i suoi parametri e restituendo il risultato?`,
		solution: `La funzione che calcola ${c.local} = ${right.expr} e restituisce ${c.local}.`,
		steps: [
			`Quello che serve alla funzione arriva dagli argomenti: nel corpo devono comparire solo i parametri ${c.a} e ${c.b} e la variabile locale ${c.local}, con il calcolo ${right.expr}.`,
			`La funzione che usa ${c.spare} legge una variabile globale: il suo risultato dipende da chi ha toccato ${c.spare}, e con ${c.spare} uguale a ${g} non è quello chiesto.`,
			`Il risultato esce con return ${c.local}: dalla funzione esce solo il valore restituito.`
		],
		solutionCode: calcShown(c, right),
		answer: choose(rng, option(solution), kept.map(option)),
		params: reference(solution, [[]], { case: family, function: c.fn, k, sign: c.sign, calls, global: { name: c.spare, value: g } })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 5: write the function
// ---------------------------------------------------------------------------------------------------------------

const KINDS5 = ['punti', 'sconto', 'contatore'] as const;

/** What a level to write is made of: the function in its right and wrong forms, as whole programs, and the runs. */
interface Written {
	fn: string;
	a: string;
	b: string;
	solution: Program;
	shown: (p: Program) => CodeText;
	wrong: Program[];
	tests: string[][];
}

/** The program that reads two numbers, one per row, and writes what the function gives back for them. */
function reading(fn: string, a: string, b: string, shown: CodeText, of: (a: number, b: number) => number): Program {
	return program(lines(shown.python.trimEnd(), '', `${a} = int(input())`, `${b} = int(input())`, `print(${fn}(${a}, ${b}))`), cppProgram(lines(`int ${a}, ${b};`, `cin >> ${a};`, `cin >> ${b};`, say(`${fn}(${a}, ${b})`)), shown.cpp), (input) => {
		const next = reader(input);
		return [String(of(Number(next()), Number(next())))];
	});
}

function calcWritten(rng: Rng, c: Calc, k: number): Written {
	const { right, wrong } = variants(c, k);
	const shown = new Map<Program, CodeText>();
	const whole = (v: Variant) => {
		const text = calcShown(c, v);
		const p = reading(c.fn, c.a, c.b, text, v.of);
		shown.set(p, text);
		return p;
	};
	return { fn: c.fn, a: c.a, b: c.b, solution: whole(right), shown: (p) => shown.get(p)!, wrong: shuffle(rng, wrong).map(whole), tests: pairs(rng, c, k, 3).map((pair) => pair.map(String)) };
}

/** A counter in a local variable: how many of two marks reach `least`. */
interface Counter {
	from: number;
	test: '>=' | '>' | '<';
	then: 'uno' | 'fisso' | 'voto';
}

const COUNTED = { fn: 'sufficienti', a: 'a', b: 'b', local: 'quanti' } as const;

function counterShown(n: Counter, least: number): CodeText {
	const { fn, a, b, local } = COUNTED;
	const then = (x: string) => (n.then === 'uno' ? `${local} + 1` : n.then === 'fisso' ? '1' : `${local} + ${x}`);
	return {
		python: lines(`def ${fn}(${a}, ${b}):`, `    ${local} = ${n.from}`, ...[a, b].flatMap((x) => [`    if ${x} ${n.test} ${least}:`, `        ${local} = ${then(x)}`]), `    return ${local}`),
		cpp: lines(`int ${fn}(int ${a}, int ${b}) {`, `    int ${local} = ${n.from};`, ...[a, b].flatMap((x) => [`    if (${x} ${n.test} ${least}) {`, `        ${local} = ${then(x)};`, '    }']), `    return ${local};`, '}')
	};
}

function counterValue(n: Counter, least: number, marks: number[]): number {
	let count = n.from;
	for (const x of marks) {
		const holds = n.test === '>=' ? x >= least : n.test === '>' ? x > least : x < least;
		if (holds) count = n.then === 'uno' ? count + 1 : n.then === 'fisso' ? 1 : count + x;
	}
	return count;
}

function counterWritten(rng: Rng, least: number): Written {
	const right: Counter = { from: 0, test: '>=', then: 'uno' };
	const mistakes: Counter[] = [
		// a mark equal to the threshold left out
		{ from: 0, test: '>', then: 'uno' },
		// the counter that starts from 1
		{ from: 1, test: '>=', then: 'uno' },
		// the counter set to 1 each time, which never gets to 2
		{ from: 0, test: '>=', then: 'fisso' },
		// the marks below the threshold counted
		{ from: 0, test: '<', then: 'uno' },
		// the marks added up where they should be counted
		{ from: 0, test: '>=', then: 'voto' }
	];
	const shown = new Map<Program, CodeText>();
	const whole = (n: Counter) => {
		const text = counterShown(n, least);
		const p = reading(COUNTED.fn, COUNTED.a, COUNTED.b, text, (a, b) => counterValue(n, least, [a, b]));
		shown.set(p, text);
		return p;
	};
	const low = () => rng.int(2, least - 1);
	const high = () => rng.int(least + 1, 10);
	// two marks that pass, one of them just; one that passes and one that does not; none: 2, 1 and 0
	const tests = shuffle(rng, [shuffle(rng, [least, high()]), shuffle(rng, [high(), low()]), [low(), low()]]).map((marks) => marks.map(String));
	return { ...COUNTED, solution: whole(right), shown: (p) => shown.get(p)!, wrong: shuffle(rng, mistakes).map(whole), tests };
}

function level5(rng: Rng, kind: (typeof KINDS5)[number]): CodeBuilt {
	const c = kind === 'punti' ? CALCS.punti : CALCS.spesa;
	const k = kind === 'contatore' ? 6 : rng.int(...c.k);
	const w = kind === 'contatore' ? counterWritten(rng, k) : calcWritten(rng, c, k);
	const kept = wrongPrograms(w.solution, w.wrong, w.tests);
	// three runs that write three different numbers: none of them can be typed in place of the function
	if (kept.length < 3 || new Set(w.tests.map((t) => written(w.solution, t)![0])).size < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${kind}`);
	const start = {
		python: lines(`# scrivi qui la funzione ${w.fn}`, '', `${w.a} = int(input())`, `${w.b} = int(input())`, '# scrivi qui la chiamata'),
		cpp: cppProgram(lines(`int ${w.a}, ${w.b};`, `cin >> ${w.a};`, `cin >> ${w.b};`, '// scrivi qui la chiamata'), `// scrivi qui la funzione ${w.fn}\n`)
	};
	const local = kind === 'contatore' ? COUNTED.local : c.local;
	const worded =
		kind === 'contatore'
			? {
					problem: `Il programma legge due voti a e b, un valore per riga. Scrivi una funzione ${w.fn}(a, b) che conta in una variabile locale quanti dei due voti sono sufficienti, cioè almeno ${k}, e restituisce il conto; poi chiamala nel programma principale e scrivi quello che restituisce. La lettura c'è già.`,
					solution: `Una funzione ${w.fn} con un contatore locale ${local} che parte da 0 e che viene restituito, chiamata con i due voti letti.`,
					steps: [
						`Sopra il programma principale definisci la funzione ${w.fn} con i parametri a e b. Nel corpo crea la variabile locale ${local}, che parte da 0.`,
						`Per ognuno dei due voti, se è almeno ${k} aggiungi 1 a ${local}; alla fine restituisci ${local} con return.`,
						`Il programma principale non vede ${local}: chiama ${w.fn}(a, b) e scrive il valore restituito.`
					]
				}
			: {
					problem: `Il programma legge ${c.reads}, un valore per riga. Scrivi una funzione ${w.fn}(${w.a}, ${w.b}) che calcola in una variabile locale ${aside(c.gives(k))} e restituisce il risultato; poi chiamala nel programma principale e scrivi quello che restituisce. La lettura c'è già.`,
					solution: `Una funzione ${w.fn} che calcola ${local} = ${linear(k, c.a, c.sign, c.b)} e restituisce ${local}, chiamata con i due numeri letti.`,
					steps: [
						`Sopra il programma principale definisci la funzione ${w.fn} con i parametri ${w.a} e ${w.b}.`,
						`Nel corpo metti il risultato in una variabile locale, ${local} = ${linear(k, c.a, c.sign, c.b)}, e restituiscilo con return: la funzione non scrive niente.`,
						`Il programma principale non vede ${local}: chiama ${w.fn}(${w.a}, ${w.b}) e scrive il valore restituito.`
					]
				};
	return {
		prompt: 'Scrivi la funzione.',
		...worded,
		solutionCode: texts(w.solution),
		answer: needing(programAnswer(w.solution, start, w.tests), 'funzione'),
		choice: choose(
			rng,
			programOption(w.solution, w.shown(w.solution)),
			kept.map((p) => programOption(p, w.shown(p)))
		),
		params: reference(w.solution, w.tests, kind === 'contatore' ? { case: kind, function: w.fn, least: k } : { case: kind, function: w.fn, k, sign: c.sign })
	};
}

export default makeCodeGenerator(ID, 'Variabili locali e globali', {
	1: { label: 'Dove esiste una variabile', constraints: ['a program with one or two functions under the question', 'text options', 'the same answer in Python and in C++'], build: drawn(KINDS1, level1) },
	2: { label: 'Due variabili con lo stesso nome', constraints: ['the same name in the main program and in the function', 'two calls', 'four different outputs'], build: drawn(KINDS2, level2) },
	3: { label: 'Una variabile globale', constraints: ['the global is declared above the functions', 'four different outputs'], build: drawn(KINDS3, level3) },
	4: { label: 'Senza variabili globali', constraints: ['four functions that give back different things', 'each option shows the function alone', 'one wrong function reads the global'], build: drawn(PLAIN_FAMILIES, level4) },
	5: { label: 'Scrivi la funzione', constraints: ['the program reads two numbers, one per row', 'graded by running it on three pairs', 'needs a function of its own'], build: drawn(KINDS5, level5) }
});
