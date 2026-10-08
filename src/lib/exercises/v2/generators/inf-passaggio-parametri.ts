/**
 * Exercises of the lesson "Passaggio dei parametri per valore e per riferimento" (informatica, third year).
 * Spec: specs/exercises/inf-passaggio-parametri.md
 *
 * 1. a function changes its parameter and the caller's variables stay as they were; 2. the change reaches the
 * caller for one variable and not for the other; 3. a function changes an element of the vector it receives, and
 * not the number beside it; 4. which function changes the caller's variables as asked (options that are programs,
 * shown by their function alone); 5. write the function and its call (open answer).
 *
 * The two texts of a program are often different here, and write the same: where C++ passes by reference
 * (`void f(int &x)` and `f(a);`), Python gives the new value back (`return x` and `a = f(a)`). The independent
 * check runs both.
 */
import type { CodeText, Rng } from '../types';
import { choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, shuffle, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-passaggio-parametri';

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers. The family is drawn once, before:
 * drawn again with the numbers, the families that fail more often would come out less.
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

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options are left. */
const pick = (rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) => {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`${ID}: only ${keys.size} wrong options`);
	return choose(rng, right, others);
};

/** `count` different whole numbers from `lo` to `hi`. */
function different(rng: Rng, count: number, lo: number, hi: number): number[] {
	const out: number[] = [];
	while (out.length < count) {
		const x = rng.int(lo, hi);
		if (!out.includes(x)) out.push(x);
	}
	return out;
}

const indented = (rows: readonly string[]) => rows.map((row) => `    ${row}`).join('\n');
/** A function in Python and a `void` function in C++, from the rows of their bodies. */
const def = (name: string, params: string, rows: readonly string[]) => `def ${name}(${params}):\n${indented(rows)}\n`;
const voidFn = (name: string, params: string, rows: readonly string[]) => `void ${name}(${params}) {\n${indented(rows)}\n}\n`;
/** The parameters of a C++ function, each by value or by reference. */
const cppParams = (names: readonly string[], byReference: readonly boolean[]) => names.map((name, i) => `int ${byReference[i] ? '&' : ''}${name}`).join(', ');
const spaced = (values: readonly (string | number)[]) => values.join(' ');
const cout = (names: readonly string[]) => `cout << ${names.join(' << " " << ')} << endl;`;

/** The pairs of names of the caller's variables: numbers without a meaning have one letter. */
const PAIRS = [
	['a', 'b'],
	['m', 'n'],
	['p', 'q'],
	['c', 'd']
] as const;

/* ------------------------------------------------------------------------------------------------------------ */
/* Levels 1 and 2: what a number becomes                                                                         */
/* ------------------------------------------------------------------------------------------------------------ */

type OpId = 'raddoppia' | 'triplica' | 'aumenta' | 'riduci' | 'azzera';

/** What a function does to its parameter: its name is the name of the function. */
interface Op {
	id: OpId;
	k: number;
	expr: (x: string) => string;
	of: (n: number) => number;
	/** "diventa il doppio", for the steps. */
	says: string;
}

function op(id: OpId, k = 0): Op {
	if (id === 'raddoppia') return { id, k: 0, expr: (x) => `${x} * 2`, of: (n) => n * 2, says: 'viene raddoppiato' };
	if (id === 'triplica') return { id, k: 0, expr: (x) => `${x} * 3`, of: (n) => n * 3, says: 'viene moltiplicato per 3' };
	if (id === 'aumenta') return { id, k, expr: (x) => `${x} + ${k}`, of: (n) => n + k, says: `aumenta di ${k}` };
	if (id === 'riduci') return { id, k, expr: (x) => `${x} - ${k}`, of: (n) => n - k, says: `diminuisce di ${k}` };
	return { id, k: 0, expr: () => '0', of: () => 0, says: 'viene azzerato' };
}

type Copy = 'raddoppia' | 'azzera' | 'aumenta' | 'scambia';
const COPIES: readonly Copy[] = ['raddoppia', 'azzera', 'aumenta', 'scambia'];

function level1(rng: Rng, family: Copy): CodeBuilt {
	const [u, w] = rng.pick(PAIRS);
	const [a, b] = different(rng, 2, 2, 9);
	// the pair of the lesson's own example
	if (family === 'scambia' && a === 3 && b === 8) throw new TooFew(`${ID}: the example of the lesson`);
	const which = rng.int(0, 1);
	const k = rng.int(2, 9);
	const o = family === 'scambia' ? null : op(family, k);
	const arg = [u, w][which];
	const call = o ? `${o.id}(${arg})` : `scambia(${u}, ${w})`;
	const python = o ? def(o.id, 'x', [`x = ${o.expr('x')}`]) : def('scambia', 'x, y', ['temp = x', 'x = y', 'y = temp']);
	const cpp = o ? voidFn(o.id, 'int x', [`x = ${o.expr('x')};`]) : voidFn('scambia', 'int x, int y', ['int temp = x;', 'x = y;', 'y = temp;']);
	const shown = program(`${python}\n${u} = ${a}\n${w} = ${b}\n${call}\nprint(${u}, ${w})\n`, cppProgram(`int ${u} = ${a};\nint ${w} = ${b};\n${call};\n${cout([u, w])}`, cpp), () => [spaced([a, b])]);
	const rows = written(shown)!;
	// what who believes that the caller's variable has changed answers, then the other slips
	const changed = o ? (which === 0 ? [o.of(a), b] : [a, o.of(b)]) : [b, a];
	const slips = o ? [which === 0 ? [a, o.of(b)] : [o.of(a), b], [o.of(a), o.of(b)], [b, a]] : [[b, b], [a, a]];
	const steps = o
		? [
				`La chiamata ${call} consegna alla funzione il valore di ${arg}, cioè ${[a, b][which]}: è un passaggio per valore, e il parametro x è una variabile della funzione.`,
				`Dentro la funzione x ${o.says} e vale ${o.of([a, b][which])}, ma l'assegnamento cambia solo x, che sparisce quando la funzione finisce.`,
				`Nel programma principale ${u} e ${w} non sono mai state toccate: il programma scrive ${rows[0]}.`
			]
		: [
				`La chiamata consegna alla funzione i valori ${a} e ${b}: è un passaggio per valore, e i parametri x e y sono variabili della funzione.`,
				`Dentro la funzione lo scambio avviene davvero, con temp: x diventa ${b} e y diventa ${a}. Poi la funzione finisce e x, y e temp spariscono.`,
				`Nel programma principale ${u} e ${w} non sono mai state toccate: il programma scrive ${rows[0]}.`
			];
	return {
		prompt: 'Segui il programma una riga alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps,
		answer: pick(rng, writtenOption(rows), [changed, ...shuffle(rng, slips)].map((v) => writtenOption([spaced(v)]))),
		params: reference(shown, [[]], { ask: 'output', case: family, names: [u, w], values: [a, b], k: o ? o.k : 0, which })
	};
}

type Reach = 'due' | 'una';
const REACHES: readonly Reach[] = ['due', 'una'];
const OPS: readonly OpId[] = ['raddoppia', 'triplica', 'aumenta', 'riduci', 'azzera'];

function level2(rng: Rng, family: Reach): CodeBuilt {
	const [u, w] = rng.pick(PAIRS);
	const values = different(rng, 2, 3, 9);
	const ids = shuffle(rng, OPS).slice(0, 2);
	const ops = ids.map((id, i) => op(id, id === 'riduci' ? rng.int(1, values[i] - 1) : rng.int(2, 9)));
	// which of the two variables the change reaches
	const reaches = rng.int(0, 1);
	const names = [u, w];
	const after = values.map((v, i) => ops[i].of(v));
	const result = values.map((v, i) => (i === reaches ? after[i] : v));
	let python: string;
	let cpp: string;
	let steps: string[];
	if (family === 'due') {
		const functions = ops.map((o, i) => ({ python: def(o.id, 'x', [`x = ${o.expr('x')}`, 'return x']), cpp: voidFn(o.id, cppParams(['x'], [i === reaches]), [`x = ${o.expr('x')};`]) }));
		const calls = ops.map((o, i) => `${o.id}(${names[i]})`);
		python = `${functions.map((f) => f.python).join('\n')}\n${u} = ${values[0]}\n${w} = ${values[1]}\n${calls.map((c, i) => (i === reaches ? `${names[i]} = ${c}` : c)).join('\n')}\nprint(${u}, ${w})\n`;
		cpp = cppProgram(`int ${u} = ${values[0]};\nint ${w} = ${values[1]};\n${calls.map((c) => `${c};`).join('\n')}\n${cout(names)}`, functions.map((f) => f.cpp).join('\n'));
		const [yes, no] = [ops[reaches].id, ops[1 - reaches].id];
		steps = [
			`In C++ guarda le intestazioni: solo ${yes} ha il parametro con la &, quindi solo la sua chiamata cambia la variabile passata. In ${no} il parametro è una copia.`,
			`In Python guarda le chiamate: solo il risultato di ${yes} viene riassegnato, con ${names[reaches]} = ${calls[reaches]}. Quello di ${no} non viene raccolto e si perde.`,
			`Quindi ${names[reaches]} passa da ${values[reaches]} a ${after[reaches]} e ${names[1 - reaches]} resta ${values[1 - reaches]}: il programma scrive ${spaced(result)}.`
		];
	} else {
		const params = ['x', 'y'];
		const body = ops.map((o, i) => `${params[i]} = ${o.expr(params[i])}`);
		const call = `cambia(${u}, ${w})`;
		python = `${def('cambia', 'x, y', [...body, `return ${params[reaches]}`])}\n${u} = ${values[0]}\n${w} = ${values[1]}\n${names[reaches]} = ${call}\nprint(${u}, ${w})\n`;
		cpp = cppProgram(
			`int ${u} = ${values[0]};\nint ${w} = ${values[1]};\n${call};\n${cout(names)}`,
			voidFn(
				'cambia',
				cppParams(params, [reaches === 0, reaches === 1]),
				body.map((row) => `${row};`)
			)
		);
		steps = [
			`In C++ guarda l'intestazione: solo ${params[reaches]} ha la &, quindi è un altro nome di ${names[reaches]}. Il parametro ${params[1 - reaches]} è passato per valore, ed è una copia.`,
			`In Python guarda return e la chiamata: la funzione restituisce solo ${params[reaches]}, e il programma principale assegna quel valore a ${names[reaches]}.`,
			`Quindi ${names[reaches]} passa da ${values[reaches]} a ${after[reaches]} e ${names[1 - reaches]} resta ${values[1 - reaches]}: il programma scrive ${spaced(result)}.`
		];
	}
	const shown = program(python, cpp, () => [spaced(result)]);
	const rows = written(shown)!;
	const other = values.map((v, i) => (i === reaches ? v : after[i]));
	return {
		prompt: 'Guarda le intestazioni delle funzioni e le chiamate.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps,
		// everything changed, nothing changed, then the wrong one changed and the right numbers in the other order
		answer: pick(rng, writtenOption(rows), [after, values, ...shuffle(rng, [other, [...result].reverse()])].map((v) => writtenOption([spaced(v)]))),
		params: reference(shown, [[]], { ask: 'output', case: family, names, values, ops: ops.map((o) => ({ id: o.id, k: o.k })), reaches })
	};
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Level 3: a vector and a number                                                                                */
/* ------------------------------------------------------------------------------------------------------------ */

type Element = 'assegna' | 'aumenta' | 'raddoppia';
const ELEMENTS: readonly Element[] = ['assegna', 'aumenta', 'raddoppia'];
type Number3 = 'azzera' | 'incrementa' | 'raddoppia';
const NUMBERS: readonly Number3[] = ['azzera', 'incrementa', 'raddoppia'];
const VECTOR_FUNCTIONS = ['aggiorna', 'correggi', 'modifica', 'ritocca'] as const;
const VECTOR_PARAMS = ['voti', 'punti', 'passi', 'tempi', 'prezzi'] as const;

function level3(rng: Rng, family: Element): CodeBuilt {
	const size = rng.int(3, 4);
	const [n, ...v] = different(rng, size + 1, 2, 9);
	const i = rng.int(0, size - 1);
	const name = rng.pick(VECTOR_FUNCTIONS);
	const list = rng.pick(VECTOR_PARAMS);
	const number = rng.pick(NUMBERS);
	const at = `${list}[${i}]`;
	const element = family === 'assegna' ? 'k' : family === 'aumenta' ? `${at} + k` : `${at} * 2`;
	const fresh = family === 'assegna' ? n : family === 'aumenta' ? v[i] + n : v[i] * 2;
	const numberRow = number === 'azzera' ? 'k = 0' : number === 'incrementa' ? 'k = k + 1' : 'k = k * 2';
	const believed = number === 'azzera' ? 0 : number === 'incrementa' ? n + 1 : n * 2;
	const rowsOf = [`${at} = ${element}`, numberRow];
	const shown = program(
		`${def(name, `${list}, k`, rowsOf)}\nv = ${pyList(v)}\nn = ${n}\n${name}(v, n)\nprint(v[${i}], n)\n`,
		cppProgram(
			`int v[${size}] = ${cppList(v)};\nint n = ${n};\n${name}(v, n);\n${cout([`v[${i}]`, 'n'])}`,
			voidFn(
				name,
				`int ${list}[], int k`,
				rowsOf.map((row) => `${row};`)
			)
		),
		() => [spaced([fresh, n])]
	);
	const rows = written(shown)!;
	const neighbour = v[(i + 1) % size];
	return {
		prompt: 'Chiediti che cosa arriva alla funzione: il vettore o una copia?',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps: [
			`Il parametro ${list} è un altro nome del vettore v: l'assegnamento a ${at} cambia v[${i}], che da ${v[i]} diventa ${fresh}.`,
			`Il parametro k invece parte con il valore di n, cioè ${n}, ma è una variabile della funzione: ${numberRow} cambia solo k, e n resta ${n}.`,
			`Il programma scrive ${rows[0]}.`
		],
		// the vector taken for a copy, then the number taken for changed, both mistakes, the element beside
		answer: pick(
			rng,
			writtenOption(rows),
			[
				[v[i], n],
				...shuffle(rng, [
					[fresh, believed],
					[v[i], believed],
					[neighbour, n]
				])
			].map((x) => writtenOption([spaced(x)]))
		),
		params: reference(shown, [[]], { ask: 'output', case: family, vector: v, index: i, n, number })
	};
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Levels 4 and 5: a function that must change the caller's variables                                            */
/* ------------------------------------------------------------------------------------------------------------ */

/** A function in the two languages, and what the caller's variables hold after it is called on them. */
interface Fn extends CodeText {
	of: (values: number[]) => number[];
}

/**
 * A function with the program that calls it: the caller reads its variables, one per row, calls the function on
 * all of them and writes them on one row. In C++ the call is `name(a, b);`, in Python `a, b = name(a, b)`.
 */
interface Task {
	name: string;
	vars: readonly string[];
	right: Fn;
	/** The same function with a mistake, each one a different mistake. */
	wrong: Fn[];
	tests: string[][];
	/**
	 * Each variable written on a row of its own. The editor of an open answer shows about 38 characters of a row on
	 * a phone, and `cout << ore << " " << minuti << endl;` under `main` has 41.
	 */
	stacked?: boolean;
}

const pyCall = (t: Pick<Task, 'name' | 'vars'>) => `${t.vars.join(', ')} = ${t.name}(${t.vars.join(', ')})`;
const cppCall = (t: Pick<Task, 'name' | 'vars'>) => `${t.name}(${t.vars.join(', ')});`;
/** The call of C++ as a sentence names it, without the semicolon that would break the sentence. */
const said = (t: Pick<Task, 'name' | 'vars'>) => `${t.name}(${t.vars.join(', ')})`;

/** The caller's program in the two languages, around the row of the call. */
const caller = (t: Pick<Task, 'vars' | 'stacked'>, python: string, cpp: string): CodeText => ({
	python: `${t.vars.map((v) => `${v} = int(input())`).join('\n')}\n${python}\n${t.stacked ? t.vars.map((v) => `print(${v})`).join('\n') : `print(${t.vars.join(', ')})`}\n`,
	cpp: `int ${t.vars.join(', ')};\n${t.vars.map((v) => `cin >> ${v};`).join('\n')}\n${cpp}\n${t.stacked ? t.vars.map((v) => cout([v])).join('\n') : cout(t.vars)}`
});

function whole(t: Task, f: Fn): Program {
	const main = caller(t, pyCall(t), cppCall(t));
	return program(`${f.python}\n${main.python}`, cppProgram(main.cpp, f.cpp), (input) => {
		const next = reader(input);
		const values = f.of(t.vars.map(() => Number(next())));
		return t.stacked ? values.map(String) : [spaced(values)];
	});
}

/** What the editor opens with: the reading and the writing, and a comment where the function and its call go. */
function start(t: Task): CodeText {
	const main = caller(t, '# scrivi qui la chiamata', '// scrivi qui la chiamata');
	return { python: `# scrivi qui la funzione ${t.name}\n\n${main.python}`, cpp: cppProgram(main.cpp, `// scrivi qui la funzione ${t.name}\n`) };
}

const shownOf = (f: Fn): CodeText => ({ python: f.python, cpp: f.cpp });

/** The options of a task: the right function and the wrong ones that really write something else, each shown alone. */
function options(rng: Rng, t: Task) {
	const right = whole(t, t.right);
	const others = t.wrong.map((f) => ({ f, p: whole(t, f) }));
	const kept = wrongPrograms(
		right,
		others.map((o) => o.p),
		t.tests
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${t.name}`);
	return {
		right,
		choice: choose(
			rng,
			programOption(right, shownOf(t.right)),
			kept.map((p) => programOption(p, shownOf(others.find((o) => o.p === p)!.f)))
		)
	};
}

const SWAP = ['int temp = x;', 'x = y;', 'y = temp;'];
const under = (head: string, rows: readonly string[]) => [head, ...rows.map((row) => `    ${row}`)];
/** In C++ the rows of a body under an `if`, with its braces. */
const cppIf = (condition: string, rows: readonly string[]) => [...under(`if (${condition}) {`, rows), '}'];

/** `scambia`: after the call the two variables have each other's value. */
function swapping(rng: Rng): Pick<Task, 'right' | 'wrong'> {
	const xy = ['x', 'y'];
	const fn = (python: string[], byReference: boolean[], cpp: string[], of: Fn['of']): Fn => ({ python: def('scambia', 'x, y', python), cpp: voidFn('scambia', cppParams(xy, byReference), cpp), of });
	const both = [true, true];
	return {
		right: fn(['return y, x'], both, SWAP, ([a, b]) => [b, a]),
		wrong: [
			// the & forgotten on both; in Python the two values given back in the order they came
			fn(['return x, y'], [false, false], SWAP, (v) => v),
			// the first value lost: no temp, or the & on the first parameter alone
			fn(rng.pick([['return y, y'], ['x = y', 'y = x', 'return x, y']]), ...rng.pick<[boolean[], string[]]>([[both, ['x = y;', 'y = x;']], [[true, false], SWAP]]), ([, b]) => [b, b]),
			// the second value lost: the assignments the other way round, or the & on the second parameter alone
			fn(rng.pick([['return x, x'], ['y = x', 'x = y', 'return x, y']]), ...rng.pick<[boolean[], string[]]>([[both, ['y = x;', 'x = y;']], [[false, true], SWAP]]), ([a]) => [a, a])
		]
	};
}

/** `ordina`: after the call the first variable is not larger (`>`) or not smaller (`<`) than the second. */
function ordering(rng: Rng, sign: '>' | '<'): Pick<Task, 'right' | 'wrong'> {
	const xy = ['x', 'y'];
	const back = sign === '>' ? '<' : '>';
	const out = (s: string, a: number, b: number) => (s === '>' ? a > b : a < b);
	const fn = (python: string[], byReference: boolean[], cpp: string[], of: Fn['of']): Fn => ({ python: def('ordina', 'x, y', python), cpp: voidFn('ordina', cppParams(xy, byReference), cpp), of });
	const both = [true, true];
	const returning = (s: string, then: string) => [...under(`if x ${s} y:`, [`return ${then}`]), 'return x, y'];
	const rest: Fn[] = [
		// always swapped, without looking
		fn(['return y, x'], both, SWAP, ([a, b]) => [b, a]),
		// the comparison the other way round
		fn(returning(back, 'y, x'), both, cppIf(`x ${back} y`, SWAP), ([a, b]) => (out(back, a, b) ? [b, a] : [a, b])),
		// the first value lost
		fn(returning(sign, 'y, y'), ...rng.pick<[boolean[], string[]]>([[both, cppIf(`x ${sign} y`, ['x = y;', 'y = x;'])], [[true, false], cppIf(`x ${sign} y`, SWAP)]]), ([a, b]) => (out(sign, a, b) ? [b, b] : [a, b])),
		// the second value lost
		fn(returning(sign, 'x, x'), ...rng.pick<[boolean[], string[]]>([[both, cppIf(`x ${sign} y`, ['y = x;', 'x = y;'])], [[false, true], cppIf(`x ${sign} y`, SWAP)]]), ([a, b]) => (out(sign, a, b) ? [a, a] : [a, b]))
	];
	return {
		right: fn(returning(sign, 'y, x'), both, cppIf(`x ${sign} y`, SWAP), ([a, b]) => (out(sign, a, b) ? [b, a] : [a, b])),
		// first the & forgotten, which leaves the two variables as they were
		wrong: [fn(returning(sign, 'x, y'), [false, false], cppIf(`x ${sign} y`, SWAP), (v) => v), ...shuffle(rng, rest)]
	};
}

/** A function that gives one variable the value of an expression of it: `x * 2`, `x + 5`. */
function changing(rng: Rng, name: string, right: Op, slips: Op[]): Pick<Task, 'right' | 'wrong'> {
	const fn = (o: Op): Fn => ({ python: def(name, 'x', [`return ${o.expr('x')}`]), cpp: voidFn(name, 'int &x', [`x = ${o.expr('x')};`]), of: ([a]) => [o.of(a)] });
	return {
		right: fn(right),
		wrong: [
			// the & forgotten; in Python the new value worked out and the old one given back
			{ python: def(name, 'x', [`y = ${right.expr('x')}`, 'return x']), cpp: voidFn(name, 'int x', [`x = ${right.expr('x')};`]), of: (v) => v },
			...shuffle(rng, slips).map(fn)
		]
	};
}

const expression = (text: (x: string) => string, of: (n: number) => number): Op => ({ id: 'aumenta', k: 0, expr: text, of, says: '' });

type Which = 'scambia' | 'ordina' | 'raddoppia' | 'aumenta';
const WHICH: readonly Which[] = ['scambia', 'ordina', 'raddoppia', 'aumenta'];

function level4(rng: Rng, family: Which): CodeBuilt {
	let task: Task;
	let asks: string;
	let solution: string;
	let steps: string[];
	const extra: Record<string, unknown> = {};
	if (family === 'scambia' || family === 'ordina') {
		const vars = ['a', 'b'];
		const sign = rng.pick(['>', '<'] as const);
		const [low, high, ...more] = different(rng, 4, 2, 9).sort((p, q) => p - q);
		// one pair that must be swapped and one that must not, in either order
		const unsorted = sign === '>' ? [more[1], low] : [low, more[1]];
		const sorted = sign === '>' ? [high, more[0]] : [more[0], high];
		const tests = (family === 'ordina' ? shuffle(rng, [unsorted, sorted]) : [unsorted, sorted]).map((t) => t.map(String));
		task = { name: family, vars, tests, ...(family === 'scambia' ? swapping(rng) : ordering(rng, sign)) };
		if (family === 'scambia') {
			asks = 'a e b hanno i valori scambiati';
			solution = 'In C++ la funzione con la & su x e su y e la variabile temp; in Python quella che restituisce y, x.';
			steps = [
				'In C++ serve la & davanti a tutti e due i parametri, così x e y sono altri nomi di a e b, e serve temp, che conserva il primo valore mentre il secondo lo sovrascrive.',
				'In Python la funzione non può toccare a e b: restituisce i due valori in ordine inverso, return y, x, e la chiamata li assegna ad a e b.',
				'Le altre funzioni lasciano a e b come erano, oppure mettono lo stesso valore in tutte e due.'
			];
		} else {
			extra.sign = sign;
			asks = sign === '>' ? 'a contiene il minore dei due numeri e b il maggiore' : 'a contiene il maggiore dei due numeri e b il minore';
			solution = `In C++ la funzione con la & su x e su y che scambia con temp quando x ${sign} y; in Python quella che in quel caso restituisce y, x.`;
			steps = [
				`I due valori vanno scambiati solo quando sono nell'ordine sbagliato, cioè quando x ${sign} y: altrimenti restano dove sono.`,
				'In C++ lo scambio arriva ad a e b solo con la & davanti a tutti e due i parametri, e ha bisogno di temp. In Python la funzione restituisce y, x quando scambia e x, y quando non scambia.',
				'Le altre funzioni scambiano sempre o al contrario, perdono uno dei due valori, oppure lasciano a e b come erano.'
			];
		}
	} else {
		const k = rng.int(3, 9);
		const o = family === 'raddoppia' ? op('raddoppia') : op('aumenta', k);
		const slips =
			family === 'raddoppia'
				? [
						expression((x) => `${x} + 2`, (n) => n + 2),
						expression((x) => `${x} * ${x}`, (n) => n * n),
						expression(() => '2', () => 2)
					]
				: [
						expression((x) => `${x} * ${k}`, (n) => n * k),
						expression((x) => `${x} - ${k}`, (n) => n - k),
						expression(() => String(k), () => k)
					];
		task = { name: family, vars: ['a'], tests: different(rng, 2, 3, 9).map((a) => [String(a)]), ...changing(rng, family, o, slips) };
		if (family === 'aumenta') extra.k = k;
		asks = family === 'raddoppia' ? 'a vale il doppio di prima' : `a vale ${k} più di prima`;
		solution = `In C++ la funzione con la & che fa x = ${o.expr('x')}; in Python quella che restituisce ${o.expr('x')}.`;
		steps = [
			`Il valore nuovo è ${o.expr('x')}.`,
			`In C++ l'assegnamento x = ${o.expr('x')} arriva ad a solo se il parametro ha la &: senza, x è una copia e a resta com'era.`,
			`In Python la funzione deve restituire il valore nuovo, return ${o.expr('x')}, perché è la chiamata ad assegnarlo ad a.`
		];
	}
	const { right, choice } = options(rng, task);
	const reads = task.vars.length === 2 ? 'due numeri a e b' : 'un numero a';
	const writes = task.vars.length === 2 ? 'scrive a e b' : 'scrive a';
	return {
		prompt: 'Vedi solo la funzione: il resto del programma è descritto nella domanda.',
		problem: `Il programma principale legge ${reads}, chiama la funzione ${task.name} e ${writes}. In C++ la chiamata è ${said(task)}, in Python è ${pyCall(task)}. Con quale funzione, dopo la chiamata, ${asks}?`,
		solution,
		steps,
		solutionCode: shownOf(task.right),
		answer: choice,
		params: reference(right, task.tests, { case: family, ...extra })
	};
}

/** Two quantities where the second can be carried into the first: `per` of the small ones make one of the large. */
interface Carry {
	large: string;
	small: string;
	x: string;
	y: string;
	per: number;
	reads: string;
	rule: string;
}

const CARRIES: readonly Carry[] = [
	{ large: 'ore', small: 'minuti', x: 'h', y: 'm', per: 60, reads: 'le ore e i minuti di una durata', rule: "un'ora per ogni 60 minuti" },
	{ large: 'euro', small: 'cent', x: 'e', y: 'c', per: 100, reads: 'gli euro e i centesimi di un conto', rule: 'un euro per ogni 100 centesimi' },
	{ large: 'metri', small: 'cm', x: 'm', y: 'c', per: 100, reads: 'i metri e i centimetri di una lunghezza', rule: 'un metro per ogni 100 centimetri' },
	{ large: 'kg', small: 'grammi', x: 'k', y: 'g', per: 1000, reads: 'i chili e i grammi di un peso', rule: 'un chilo per ogni 1000 grammi' },
	{ large: 'pacchi', small: 'uova', x: 'p', y: 'u', per: 6, reads: 'i pacchi pieni e le uova sciolte di un magazzino', rule: 'un pacco per ogni 6 uova' },
	{ large: 'giorni', small: 'ore', x: 'g', y: 'h', per: 24, reads: 'i giorni e le ore di un viaggio', rule: 'un giorno per ogni 24 ore' }
];

/** `sistema`: the first variable takes what the second holds in excess, the second keeps the remainder. */
function carrying(rng: Rng, c: Carry): Pick<Task, 'right' | 'wrong'> {
	const { x, y, per } = c;
	const fn = (python: string[], byReference: boolean[], cpp: string[], of: Fn['of']): Fn => ({ python: def('sistema', `${x}, ${y}`, python), cpp: voidFn('sistema', cppParams([x, y], byReference), cpp), of });
	const both = [true, true];
	const div = (n: number) => Math.floor(n / per);
	const rightCpp = [`${x} = ${x} + ${y} / ${per};`, `${y} = ${y} % ${per};`];
	const late = [`${y} = ${y} % ${per};`, `${x} = ${x} + ${y} / ${per};`];
	return {
		right: fn([`return ${x} + ${y} // ${per}, ${y} % ${per}`], both, rightCpp, ([a, b]) => [a + div(b), b % per]),
		wrong: [
			// the & forgotten; in Python the two results worked out and the old values given back
			fn([`q = ${x} + ${y} // ${per}`, `r = ${y} % ${per}`, `return ${x}, ${y}`], [false, false], rightCpp, (v) => v),
			...shuffle(rng, [
				// the & on the first parameter alone
				fn([`return ${x} + ${y} // ${per}, ${y}`], [true, false], rightCpp, ([a, b]) => [a + div(b), b]),
				// the remainder taken first, so that nothing is left to carry; or the & on the second parameter alone
				fn([`${y} = ${y} % ${per}`, `${x} = ${x} + ${y} // ${per}`, `return ${x}, ${y}`], ...rng.pick<[boolean[], string[]]>([[both, late], [[false, true], rightCpp]]), ([a, b]) => [a, b % per]),
				// what the first variable held is thrown away
				fn([`return ${y} // ${per}, ${y} % ${per}`], both, [`${x} = ${y} / ${per};`, `${y} = ${y} % ${per};`], ([, b]) => [div(b), b % per]),
				// quotient and remainder in each other's place
				fn([`return ${x} + ${y} % ${per}, ${y} // ${per}`], both, [`${x} = ${x} + ${y} % ${per};`, `${y} = ${y} / ${per};`], ([a, b]) => [a + (b % per), div(b)])
			])
		]
	};
}

/** A quantity that takes a bonus and cannot go over a ceiling. */
interface Ceiling {
	variable: string;
	name: string;
	top: number;
	bonuses: readonly number[];
	lowest: number;
	reads: string;
}

const CEILINGS: readonly Ceiling[] = [
	{ variable: 'voto', name: 'premia', top: 10, bonuses: [1, 2], lowest: 3, reads: 'il voto di una verifica' },
	{ variable: 'punti', name: 'premia', top: 100, bonuses: [5, 10, 15, 20], lowest: 40, reads: 'i punti di un giocatore' },
	{ variable: 'carica', name: 'ricarica', top: 100, bonuses: [10, 20, 25, 30], lowest: 20, reads: 'la carica di una batteria, in percentuale' },
	{ variable: 'livello', name: 'avanza', top: 20, bonuses: [2, 3, 4], lowest: 5, reads: 'il livello di un personaggio' }
];

/** `premia`: the variable grows by `k` and stops at `top`. */
function capping(rng: Rng, c: Ceiling, k: number): Pick<Task, 'right' | 'wrong'> {
	const { name, top } = c;
	const fn = (python: string[], cpp: string[], of: (n: number) => number, byReference = true): Fn => ({ python: def(name, 'x', python), cpp: voidFn(name, cppParams(['x'], [byReference]), cpp), of: ([a]) => [of(a)] });
	const body = (first: string, condition: string) => ({ python: [`x = ${first}`, ...under(`if ${condition}:`, [`x = ${top}`]), 'return x'], cpp: [`x = ${first};`, ...cppIf(condition, [`x = ${top};`])] });
	const right = body(`x + ${k}`, `x > ${top}`);
	const backwards = body(`x + ${k}`, `x < ${top}`);
	const assigned = body(String(k), `x > ${top}`);
	return {
		right: fn(right.python, right.cpp, (n) => Math.min(n + k, top)),
		wrong: [
			// the & forgotten; in Python the new value worked out in another variable and the old one given back
			fn([`y = x + ${k}`, ...under(`if y > ${top}:`, [`y = ${top}`]), 'return x'], right.cpp, (n) => n, false),
			...shuffle(rng, [
				// no ceiling
				fn([`return x + ${k}`], [`x = x + ${k};`], (n) => n + k),
				// the comparison the other way round
				fn(backwards.python, backwards.cpp, (n) => (n + k < top ? top : n + k)),
				// the sum only looked at, never assigned
				fn([...under(`if x + ${k} > ${top}:`, [`x = ${top}`]), 'return x'], cppIf(`x + ${k} > ${top}`, [`x = ${top};`]), (n) => (n + k > top ? top : n)),
				// the bonus assigned in place of being added
				fn(assigned.python, assigned.cpp, () => Math.min(k, top))
			])
		]
	};
}

type Write = 'ordina' | 'riporto' | 'tetto';
const WRITES: readonly Write[] = ['ordina', 'riporto', 'tetto'];

function level5(rng: Rng, family: Write): CodeBuilt {
	let task: Task;
	let problem: string;
	let solution: string;
	let steps: string[];
	const extra: Record<string, unknown> = {};
	const example = (t: Task, f: Fn) => `Con ${t.tests[0].join(' e ')} il programma scrive ${f.of(t.tests[0].map(Number)).join(t.stacked ? ' e poi ' : ' ')}.`;
	if (family === 'ordina') {
		const vars = rng.pick(PAIRS);
		const sign = rng.pick(['>', '<'] as const);
		const [low, mid, high] = different(rng, 3, 0, 40).sort((p, q) => p - q);
		const same = rng.int(1, 40);
		// the pair to swap first: the program to start from must not pass it as it is
		const tests = (sign === '>' ? [[high, low], [low, mid], [same, same]] : [[low, high], [mid, low], [same, same]]).map((t) => t.map(String));
		task = { name: 'ordina', vars, tests, ...ordering(rng, sign) };
		extra.sign = sign;
		const [u, w] = vars;
		problem = `Il programma legge due numeri ${u} e ${w}, uno per riga, e li deve scrivere in ordine ${sign === '>' ? 'crescente' : 'decrescente'}. Scrivi la funzione ordina, che scambia i due valori solo quando il primo è ${sign === '>' ? 'maggiore' : 'minore'} del secondo, e chiamala dove dice il commento. In C++ la chiamata è ${said(task)} e la funzione riceve i parametri per riferimento; in Python la chiamata è ${pyCall(task)} e la funzione restituisce i due valori nell'ordine giusto. Lettura e scrittura ci sono già. ${example(task, task.right)}`;
		solution = `Una funzione ordina che scambia quando x ${sign} y: in C++ con la & sui due parametri e la variabile temp, in Python con return y, x.`;
		steps = [
			`Lo scambio serve solo quando x ${sign} y: negli altri casi i due valori sono già al loro posto.`,
			'In C++ metti la & davanti a tutti e due i parametri, così x e y sono altri nomi delle variabili di chi chiama, e scambia con una variabile temp.',
			'In Python la funzione restituisce y, x quando scambia e x, y quando non scambia: è la chiamata ad assegnare i due valori alle variabili.'
		];
	} else if (family === 'riporto') {
		const c = rng.pick(CARRIES);
		const vars = [c.large, c.small];
		const pair = (times: number) => [rng.int(1, 9), times * c.per + rng.int(1, c.per - 1)];
		// something to carry first, then nothing, then more than once
		const tests = [pair(rng.int(1, 2)), pair(0), pair(rng.int(2, 4))].map((t) => t.map(String));
		task = { name: 'sistema', vars, tests, stacked: true, ...carrying(rng, c) };
		extra.per = c.per;
		problem = `Il programma legge ${c.reads}: ${c.small} può valere ${c.per} o più. Scrivi la funzione sistema, che aggiunge a ${c.large} ${c.rule} e lascia in ${c.small} il resto, e chiamala dove dice il commento. In C++ la chiamata è ${said(task)} e la funzione riceve i parametri per riferimento; in Python la chiamata è ${pyCall(task)} e la funzione restituisce i due valori nuovi. Lettura e scrittura, un numero per riga, ci sono già. ${example(task, task.right)}`;
		solution = `Una funzione sistema che aggiunge a ${c.x} il quoziente di ${c.y} diviso ${c.per} e lascia in ${c.y} il resto: in C++ con la & sui due parametri, in Python con return dei due valori.`;
		steps = [
			`Il quoziente della divisione di ${c.y} per ${c.per} va aggiunto a ${c.x}, e il resto della stessa divisione è il nuovo valore di ${c.y}.`,
			`In C++ metti la & davanti a tutti e due i parametri e calcola prima ${c.x}: se cambi prima ${c.y}, il quoziente non c'è più.`,
			'In Python la funzione ha due risultati: li scrivi dopo return con una virgola in mezzo, e la chiamata li assegna alle due variabili.'
		];
	} else {
		const c = rng.pick(CEILINGS);
		const k = rng.pick(c.bonuses);
		const [first, third] = different(rng, 2, c.lowest, c.top - k - 1);
		const over = rng.int(c.top - k + 1, c.top);
		const tests = [[first], [over], [third]].map((t) => t.map(String));
		task = { name: c.name, vars: [c.variable], tests, ...capping(rng, c, k) };
		extra.k = k;
		extra.top = c.top;
		problem = `Il programma legge ${c.reads} e scrive il valore dopo il bonus. Scrivi la funzione ${c.name}, che aggiunge ${k} a ${c.variable} senza superare ${c.top} (un risultato più grande diventa ${c.top}), e chiamala dove dice il commento. In C++ la chiamata è ${said(task)} e la funzione riceve il parametro per riferimento; in Python la chiamata è ${pyCall(task)} e la funzione restituisce il valore nuovo. Lettura e scrittura ci sono già. ${example(task, task.right)}`;
		solution = `Una funzione ${c.name} che fa x = x + ${k} e poi, se x > ${c.top}, x = ${c.top}: in C++ con la & sul parametro, in Python con return x.`;
		steps = [
			`Prima aggiungi il bonus, x = x + ${k}; poi controlla il tetto: se x > ${c.top}, x diventa ${c.top}.`,
			`In C++ il parametro ha la &, così x è un altro nome di ${c.variable} e la modifica arriva a chi chiama.`,
			`In Python la funzione finisce con return x, e la chiamata ${pyCall(task)} assegna il valore nuovo alla variabile.`
		];
	}
	const { right, choice } = options(rng, task);
	// runs that write different things: none of them can be typed in place of the function
	if (new Set(task.tests.map((t) => written(right, t)!.join(' '))).size < task.tests.length) throw new TooFew(`${ID}: two runs write the same`);
	return {
		prompt: 'Scrivi la funzione e la sua chiamata.',
		problem,
		solution,
		steps,
		solutionCode: texts(right),
		answer: needing(programAnswer(right, start(task), task.tests), 'funzione'),
		choice,
		params: reference(right, task.tests, { case: family, name: task.name, ...extra })
	};
}

/** Levels 1 to 3 show a whole program that reads nothing and ask what it writes. */
const reads = (sample: { code?: CodeText; params: Record<string, unknown> }) => {
	const errors: string[] = [];
	if (!sample.code) errors.push('no program is shown');
	if (sample.params.ask !== 'output') errors.push('the question is not about what the program writes');
	if (JSON.stringify(sample.params.tests) !== '[[]]') errors.push('a program to read reads nothing');
	return errors;
};

export default makeCodeGenerator(ID, 'Passaggio dei parametri per valore e per riferimento', {
	1: { label: 'Il parametro è una copia', constraints: ['a function changes its parameters, passed by value', 'the caller writes its two variables, unchanged', 'four different outputs'], build: drawn(COPIES, level1), check: reads },
	2: { label: 'La variabile di chi chiama cambia', constraints: ['two variables: the change reaches one and not the other', 'in C++ one parameter with & and one without, in Python one result assigned and one not', 'four different outputs'], build: drawn(REACHES, level2), check: reads },
	3: { label: 'Una funzione che modifica un vettore', constraints: ['a vector of 3 or 4 different numbers and a number', 'the element changes for the caller, the number does not', 'single elements are written, never the whole vector'], build: drawn(ELEMENTS, level3), check: reads },
	4: { label: 'Quale funzione lo fa', constraints: ['four functions that leave different values in the caller', 'each option shows the function alone', 'the question says how the function is called in each language'], build: drawn(WHICH, level4) },
	5: { label: 'Scrivi la funzione', constraints: ['the program reads its numbers, one per row, never negative', 'graded by running it on three inputs that write different things', 'needs a function of its own'], build: drawn(WRITES, level5) }
});
