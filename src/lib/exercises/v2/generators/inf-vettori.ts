/**
 * Exercises for the lesson "I vettori" (informatica, third year). Spec: specs/exercises/inf-vettori.md
 *
 * 1. indices and elements, in words; 2. what a program that reads and writes single elements prints; 3. what a loop
 * over a vector prints; 4. which loop does what is asked (options that are programs, shown by their loop alone);
 * 5. what a program prints when a vector goes to a function; 6. write a program that needs a vector (open answer).
 *
 * The programs are written by hand in the two languages (v2/inf-codice.ts): lists in Python, arrays whose size is
 * the constant N in C++, as in the lesson.
 */
import type { Rng } from '../types';
import { TooFew, choose, cppList, cppProgram, drawn, makeCodeGenerator, needing, pick, program, programAnswer, programOption, pyList, reader, reference, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-vettori';

const NAMES = ['voti', 'punti', 'passi', 'tempi', 'pesi', 'gol'] as const;
const ORDINALS = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo'] as const;

/** `size` different whole numbers from `lo` to `hi`, in the order drawn. */
function distinct(rng: Rng, size: number, lo: number, hi: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(lo, hi);
		if (!v.includes(x)) v.push(x);
	}
	return v;
}

// ---------------------------------------------------------------- level 1: indices, in words

const WORDS = ['ultimo', 'dimensione', 'fuori', 'posto'] as const;

function level1(rng: Rng): CodeBuilt {
	const kind = rng.pick(WORDS);
	const name = rng.pick(NAMES);
	const numbers = (right: number, wrong: number[]) => choose(rng, textOption(String(right)), wrong.map((x) => textOption(String(x))));
	const elements = (right: number, wrong: number[]) => choose(rng, textOption(`${name}[${right}]`), wrong.map((x) => textOption(`${name}[${x}]`)));
	if (kind === 'ultimo') {
		const n = rng.int(4, 60);
		return {
			prompt: 'Gli indici di un vettore partono da 0.',
			problem: `Il vettore ${name} ha dimensione ${n}. Qual è l'indice del suo ultimo elemento?`,
			solution: String(n - 1),
			steps: [`Il primo elemento ha indice 0, quindi gli ${n} elementi hanno gli indici da 0 a ${n - 1}.`, `L'ultimo indice è la dimensione meno 1: ${n} - 1 = ${n - 1}.`, `${n} è la dimensione, non un indice: ${name}[${n}] non esiste.`],
			answer: numbers(n - 1, [n, n + 1, n - 2]),
			params: { case: kind, name, n }
		};
	}
	if (kind === 'dimensione') {
		const last = rng.int(3, 59);
		return {
			prompt: "Conta anche l'elemento di indice 0.",
			problem: `Gli indici del vettore ${name} vanno da 0 a ${last}. Qual è la sua dimensione?`,
			solution: String(last + 1),
			steps: [`Gli indici partono da 0: da 0 a ${last} i numeri sono ${last + 1}.`, `La dimensione è l'ultimo indice più 1: ${last} + 1 = ${last + 1}.`],
			answer: numbers(last + 1, [last, last - 1, last + 2]),
			params: { case: kind, name, n: last + 1 }
		};
	}
	if (kind === 'fuori') {
		const n = rng.int(4, 40);
		const inside = rng.int(1, n - 2);
		return {
			prompt: "Trova l'indice che il vettore non ha.",
			problem: `Il vettore ${name} ha dimensione ${n}. Quale di questi elementi non esiste?`,
			solution: `${name}[${n}]`,
			steps: [`Con ${n} elementi gli indici vanno da 0 a ${n - 1}.`, `${name}[0] è il primo elemento e ${name}[${n - 1}] è l'ultimo.`, `${name}[${n}] chiede un indice uguale alla dimensione: quell'elemento non c'è.`],
			answer: elements(n, [0, n - 1, inside]),
			params: { case: kind, name, n, inside }
		};
	}
	const place = rng.int(2, 8);
	const n = rng.int(place + 2, place + 12);
	return {
		prompt: 'Il primo elemento ha indice 0.',
		problem: `Il vettore ${name} ha dimensione ${n}. Come si scrive il suo ${ORDINALS[place - 1]} elemento?`,
		solution: `${name}[${place - 1}]`,
		steps: [`Il primo elemento è ${name}[0], il secondo è ${name}[1]: l'indice è sempre il posto meno 1.`, `Il ${ORDINALS[place - 1]} elemento ha indice ${place} - 1 = ${place - 1}.`],
		answer: elements(place - 1, [place, place + 1, place - 2]),
		params: { case: kind, name, n, place }
	};
}

// ---------------------------------------------------------------- level 2: single elements

/** An index written in the program: a number, or the last one (`len(v) - 1` in Python, `N - 1` in C++). */
type Ix = number | 'last';
/** One row of a program on single elements: print the sum of some elements, or give an element the value of another plus a number. */
type Op = { op: 'print'; terms: Ix[] } | { op: 'set'; at: Ix; from: Ix; plus: number };

/**
 * How a student misreads the program: the indices counted from 1 or one too far, the index taken for the element,
 * the assignment skipped, turned round or done without the number added, the rows written from the last to the first.
 */
type Misread = { shift?: number; indices?: boolean; skip?: boolean; turned?: boolean; bare?: boolean; backwards?: boolean };

/** What the rows print on `v`; it throws where an index falls outside the vector. */
function elementsOutput(v: readonly number[], ops: readonly Op[], misread: Misread = {}): string[] {
	const w = [...v];
	const index = (ix: Ix) => {
		const i = (ix === 'last' ? w.length - 1 : ix) + (misread.shift ?? 0);
		if (i < 0 || i >= w.length) throw new Error('index out of the vector');
		return i;
	};
	const rows: string[] = [];
	for (const o of ops) {
		if (o.op === 'print') rows.push(String(o.terms.reduce<number>((s, ix) => s + (misread.indices ? index(ix) : w[index(ix)]), 0)));
		else if (misread.turned) w[index(o.from)] = w[index(o.at)] + o.plus;
		else if (!misread.skip) w[index(o.at)] = w[index(o.from)] + (misread.bare ? 0 : o.plus);
	}
	return misread.backwards ? rows.reverse() : rows;
}

function elementsProgram(name: string, v: readonly number[], ops: readonly Op[]): Program {
	const el = (ix: Ix, last: string) => `${name}[${ix === 'last' ? last : ix}]`;
	const rows = (last: string, print: (what: string) => string, end: string) =>
		ops.map((o) =>
			o.op === 'print'
				? print(o.terms.map((ix) => el(ix, last)).join(' + '))
				: `${el(o.at, last)} = ${el(o.from, last)} + ${o.plus}${end}`
		);
	const python = [`${name} = ${pyList(v)}`, ...rows(`len(${name}) - 1`, (what) => `print(${what})`, '')];
	const cpp = [`int ${name}[N] = ${cppList(v)};`, ...rows('N - 1', (what) => `cout << ${what} << endl;`, ';')];
	return program(python.join('\n'), cppProgram(cpp.join('\n'), `const int N = ${v.length};`), () => elementsOutput(v, ops));
}

const ELEMENTS = ['leggi', 'scrivi', 'ultimo'] as const;

function level2(rng: Rng, family: (typeof ELEMENTS)[number]): CodeBuilt {
	const n = rng.int(4, 5);
	const v = distinct(rng, n, 2, 9);
	const name = rng.pick(NAMES);
	const [a, b, c] = distinct(rng, 3, 0, n - 1);
	const plus = rng.int(1, 4);
	// an assignment that leaves the element as it was would not tell who followed it from who skipped it
	if ((family === 'scrivi' && v[b] + plus === v[a]) || (family === 'ultimo' && v[n - 1] + plus === v[0])) throw new TooFew(`${ID}: the assignment changes nothing`);
	const ops: Op[] =
		family === 'leggi'
			? [
					{ op: 'print', terms: [a] },
					{ op: 'print', terms: [b, c] }
				]
			: family === 'scrivi'
				? [
						{ op: 'set', at: a, from: b, plus },
						{ op: 'print', terms: [a] },
						{ op: 'print', terms: [a, c] }
					]
				: [
						{ op: 'set', at: 0, from: 'last', plus },
						{ op: 'print', terms: [0] },
						{ op: 'print', terms: ['last'] }
					];
	const shown = elementsProgram(name, v, ops);
	const rows = written(shown)!;
	const misreads: Misread[] = [{ skip: true }, { shift: -1 }, { indices: true }, { shift: 1 }, { turned: true }, { bare: true }, { backwards: true }];
	const others = misreads.flatMap((m) => {
		try {
			return [elementsOutput(v, ops, m)];
		} catch {
			return [];
		}
	});
	const first = ops[0];
	const steps =
		first.op === 'print'
			? [`Gli indici partono da 0: ${name}[${a}] è l'elemento al posto ${a + 1} della fila e vale ${v[a]}.`, `${name}[${b}] vale ${v[b]} e ${name}[${c}] vale ${v[c]}: la loro somma è ${v[b] + v[c]}.`, `Il programma scrive ${rows.join(' e poi ')}.`]
			: family === 'scrivi'
				? [`${name}[${b}] vale ${v[b]}: l'assegnamento mette ${v[b]} + ${plus} = ${v[b] + plus} nell'elemento di indice ${a}, che prima valeva ${v[a]}.`, `Gli altri elementi non cambiano: ${name}[${c}] vale ancora ${v[c]}.`, `Il programma scrive ${rows[0]} e poi ${v[b] + plus} + ${v[c]} = ${rows[1]}.`]
				: [`L'ultimo elemento ha indice ${n - 1} e vale ${v[n - 1]}.`, `L'assegnamento mette ${v[n - 1]} + ${plus} = ${v[n - 1] + plus} nel primo elemento, quello di indice 0.`, `L'ultimo elemento non è cambiato: il programma scrive ${rows.join(' e poi ')}.`];
	return {
		prompt: 'Ricorda che gli indici partono da 0.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps,
		answer: pick(rng, writtenOption(rows), others.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, name, vector: v, ops })
	};
}

// ---------------------------------------------------------------- levels 3, 4 and 5: a loop over a vector

/** A loop that goes through a vector and keeps one value. The element of the turn is written `el` and the value `acc`. */
interface Loop {
	acc: string;
	start: 'zero' | 'one' | 'first';
	/** The first index of the loop. */
	from: number;
	/** The loop stops one element before the end. */
	short?: boolean;
	when?: { text: (el: string, acc: string) => string; of: (x: number, acc: number) => boolean };
	then: { text: (el: string, acc: string) => string; of: (x: number, acc: number, i: number) => number };
}

const loopValue = (l: Loop, v: readonly number[]) => {
	let acc = l.start === 'zero' ? 0 : l.start === 'one' ? 1 : v[0];
	for (let i = l.from; i < v.length - (l.short ? 1 : 0); i++) if (!l.when || l.when.of(v[i], acc)) acc = l.then.of(v[i], acc, i);
	return acc;
};

/** The rows of the loop in each language, on the vector `name` whose size is written `size` (`N`, or `n` in a function). */
function loopRows(l: Loop, name: string, size: { python: string; cpp: string }) {
	const el = `${name}[i]`;
	const start = l.start === 'zero' ? '0' : l.start === 'one' ? '1' : `${name}[0]`;
	const end = (text: string) => (l.short ? `${text} - 1` : text);
	const set = `${l.acc} = ${l.then.text(el, l.acc)}`;
	const python = [`${l.acc} = ${start}`, `for i in range(${l.from ? `${l.from}, ` : ''}${end(size.python)}):`, ...(l.when ? [`    if ${l.when.text(el, l.acc)}:`, `        ${set}`] : [`    ${set}`])];
	const cpp = [`int ${l.acc} = ${start};`, `for (int i = ${l.from}; i < ${end(size.cpp)}; i++) {`, ...(l.when ? [`    if (${l.when.text(el, l.acc)}) {`, `        ${set};`, '    }'] : [`    ${set};`]), '}'];
	return { python, cpp };
}

/** The loop alone, which is what an option shows of the program. */
const loopShown = (l: Loop, name: string) => {
	const rows = loopRows(l, name, { python: `len(${name})`, cpp: 'N' });
	return { python: rows.python.join('\n'), cpp: rows.cpp.join('\n') };
};

/** The whole program: the vector with its values, the loop, and the value written at the end. */
function loopProgram(l: Loop, name: string, v: readonly number[]): Program {
	const rows = loopRows(l, name, { python: `len(${name})`, cpp: 'N' });
	return program([`${name} = ${pyList(v)}`, ...rows.python, `print(${l.acc})`].join('\n'), cppProgram([`int ${name}[N] = ${cppList(v)};`, ...rows.cpp, `cout << ${l.acc} << endl;`].join('\n'), `const int N = ${v.length};`), () => [String(loopValue(l, v))]);
}

type Family = 'somma' | 'conta' | 'massimo';
const FAMILIES: readonly Family[] = ['somma', 'conta', 'massimo'];

interface Task {
	/** What the loop works out, as the exercise says it. */
	gives: string;
	right: Loop;
	/** The same loop with a mistake a student makes, each a different one. */
	wrong: Loop[];
}

function task(family: Family, k: number): Task {
	if (family === 'somma') {
		const add: Loop['then'] = { text: (el, acc) => `${acc} + ${el}`, of: (x, s) => s + x };
		const loop = (change: Partial<Loop> = {}): Loop => ({ acc: 'somma', start: 'zero', from: 0, then: add, ...change });
		return {
			gives: 'la somma di tutti gli elementi',
			right: loop(),
			wrong: [loop({ from: 1 }), loop({ short: true }), loop({ then: { text: (_, acc) => `${acc} + i`, of: (_, s, i) => s + i } }), loop({ then: { text: (el) => el, of: (x) => x } }), loop({ start: 'one' }), loop({ then: { text: (_, acc) => `${acc} + 1`, of: (_, s) => s + 1 } })]
		};
	}
	if (family === 'conta') {
		const more: Loop['when'] = { text: (el) => `${el} > ${k}`, of: (x) => x > k };
		const one: Loop['then'] = { text: (_, acc) => `${acc} + 1`, of: (_, q) => q + 1 };
		const loop = (change: Partial<Loop> = {}): Loop => ({ acc: 'conta', start: 'zero', from: 0, when: more, then: one, ...change });
		return {
			gives: `quanti elementi sono maggiori di ${k}`,
			right: loop(),
			wrong: [
				loop({ when: { text: (el) => `${el} >= ${k}`, of: (x) => x >= k } }),
				loop({ when: { text: (el) => `${el} < ${k}`, of: (x) => x < k } }),
				loop({ then: { text: (el, acc) => `${acc} + ${el}`, of: (x, q) => q + x } }),
				loop({ from: 1 }),
				loop({ short: true }),
				loop({ start: 'one' })
			]
		};
	}
	const larger: Loop['when'] = { text: (el, acc) => `${el} > ${acc}`, of: (x, m) => x > m };
	const take: Loop['then'] = { text: (el) => el, of: (x) => x };
	const loop = (change: Partial<Loop> = {}): Loop => ({ acc: 'massimo', start: 'first', from: 1, when: larger, then: take, ...change });
	return {
		gives: "l'elemento più grande",
		right: loop(),
		wrong: [
			loop({ when: { text: (el, acc) => `${el} < ${acc}`, of: (x, m) => x < m } }),
			loop({ then: { text: () => 'i', of: (_, __, i) => i } }),
			loop({ when: undefined }),
			loop({ short: true }),
			loop({ then: { text: (_, acc) => `${acc} + 1`, of: (_, m) => m + 1 } }),
			loop({ start: 'zero', from: 0, when: { text: (el, acc) => `${el} < ${acc}`, of: (x, m) => x < m } })
		]
	};
}

/** A vector for a loop: different numbers, the largest neither first nor last, and `k` one of them with some above and some below. */
function loopVector(rng: Rng, size: number): { v: number[]; k: number } {
	for (;;) {
		const v = distinct(rng, size, 2, 12);
		const top = v.indexOf(Math.max(...v));
		const k = rng.pick(v);
		const above = v.filter((x) => x > k).length;
		if (top > 0 && top < size - 1 && above >= 1 && above <= size - 2) return { v, k };
	}
}

const describe = (l: Loop, name: string, v: readonly number[]) => {
	const last = v.length - 1 - (l.short ? 1 : 0);
	return `Il ciclo fa passare i da ${l.from} a ${last}: guarda gli elementi da ${name}[${l.from}] a ${name}[${last}], cioè ${v.slice(l.from, last + 1).join(', ')}.`;
};

function level3(rng: Rng, family: Family): CodeBuilt {
	const { v, k } = loopVector(rng, rng.int(5, 6));
	const name = rng.pick(NAMES);
	const t = task(family, k);
	// the loop shown is not always the usual one: it may start from 1 or stop one element early, and must be read
	const twist = rng.int(0, 2);
	const loop: Loop = family === 'massimo' ? t.right : { ...t.right, from: twist === 1 ? 1 : 0, short: twist === 2 };
	const shown = loopProgram(loop, name, v);
	const rows = written(shown)!;
	const variants = [t.right, ...t.wrong, { ...t.right, from: 1 }, { ...t.right, short: true }, { ...t.right, from: 1, short: true }];
	const others = wrongPrograms(
		shown,
		variants.map((l) => loopProgram(l, name, v)),
		[[]]
	).map((p) => written(p)!);
	// what a student answers without following the loop: how many elements there are, the last index
	const guesses = [[String(v.length)], [String(v.length - 1)]];
	const value = loopValue(loop, v);
	return {
		prompt: 'Segui il ciclo un giro alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [
			describe(loop, name, v),
			family === 'somma'
				? `La variabile somma parte da 0 e a ogni giro aumenta dell'elemento ${name}[i].`
				: family === 'conta'
					? `La variabile conta parte da 0 e aumenta di 1 solo nei giri in cui ${name}[i] è maggiore di ${k}.`
					: `La variabile massimo parte da ${name}[0], che vale ${v[0]}, e prende il valore di ${name}[i] quando questo è più grande.`,
			`Dopo l'ultimo giro ${loop.acc} vale ${value}, ed è quello che il programma scrive.`
		],
		answer: pick(rng, writtenOption(rows), [...others, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, name, vector: v, k, from: loop.from, short: Boolean(loop.short) })
	};
}

function level4(rng: Rng, family: Family): CodeBuilt {
	const { v, k } = loopVector(rng, rng.int(4, 6));
	const name = rng.pick(NAMES);
	const t = task(family, k);
	const right = loopProgram(t.right, name, v);
	const wrong = t.wrong.map((l) => ({ loop: l, whole: loopProgram(l, name, v) }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong loops for ${family}`);
	const option = (p: Program) => programOption(p, loopShown(p === right ? t.right : wrong.find((w) => w.whole === p)!.loop, name));
	const r = t.right;
	return {
		prompt: 'Guarda da dove parte la variabile e quali indici visita il ciclo.',
		problem: `Il vettore ${name} contiene, in ordine, i valori ${v.join(', ')}; in C++ la sua dimensione è la costante N. Quale pezzo di programma calcola ${t.gives} e mette il risultato nella variabile ${r.acc}?`,
		solution: `Il ciclo che parte da i = ${r.from}, arriva all'ultimo elemento e nel corpo fa ${r.acc} = ${r.then.text(`${name}[i]`, r.acc)}${r.when ? ` quando ${r.when.text(`${name}[i]`, r.acc)}` : ''}.`,
		steps: [
			`La variabile ${r.acc} parte da ${r.start === 'first' ? `${name}[0], il primo elemento` : '0'}.`,
			`Il ciclo deve visitare tutti gli elementi${r.from ? ' dopo il primo' : ''}: i va da ${r.from} a ${v.length - 1}, l'ultimo indice.`,
			`Nel corpo ${r.when ? `la condizione è ${r.when.text(`${name}[i]`, r.acc)}, e quando è vera ` : ''}l'istruzione è ${r.acc} = ${r.then.text(`${name}[i]`, r.acc)}: con questi valori ${r.acc} alla fine vale ${loopValue(r, v)}.`
		],
		solutionCode: option(right).code,
		answer: choose(
			rng,
			option(right),
			kept.map((p) => option(p))
		),
		params: reference(right, [[]], { case: family, name, vector: v, k })
	};
}

// ---------------------------------------------------------------- level 5: a vector goes to a function

const FUNCTIONS = ['modifica', 'numero', 'restituisce'] as const;

function level5(rng: Rng, family: (typeof FUNCTIONS)[number]): CodeBuilt {
	const n = rng.int(4, 5);
	const name = rng.pick(NAMES);
	if (family === 'restituisce') {
		const { v, k } = loopVector(rng, n);
		const t = task('conta', k);
		const whole = (l: Loop): Program => {
			const rows = loopRows(l, 'v', { python: 'len(v)', cpp: 'n' });
			const python = [`def sopra(v):`, ...rows.python.map((row) => `    ${row}`), `    return ${l.acc}`, '', `${name} = ${pyList(v)}`, `print(sopra(${name}))`];
			const before = [`const int N = ${n};`, '', 'int sopra(int v[], int n) {', ...rows.cpp.map((row) => `    ${row}`), `    return ${l.acc};`, '}'];
			return program(python.join('\n'), cppProgram([`int ${name}[N] = ${cppList(v)};`, `cout << sopra(${name}, N) << endl;`].join('\n'), before.join('\n')), () => [String(loopValue(l, v))]);
		};
		const shown = whole(t.right);
		const rows = written(shown)!;
		const others = wrongPrograms(
			shown,
			t.wrong.map((l) => whole(l)),
			[[]]
		).map((p) => written(p)!);
		return {
			prompt: 'Dentro la funzione il vettore si chiama v.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: rows.join(', '),
			steps: [`La chiamata passa alla funzione il vettore ${name}: dentro la funzione si chiama v, e i suoi elementi sono ${v.join(', ')}.`, `Il ciclo guarda tutti gli elementi e conta aumenta di 1 per ogni elemento maggiore di ${k}: sono ${v.filter((x) => x > k).join(', ')}.`, `La funzione restituisce ${rows[0]}, ed è quello che il programma scrive.`],
			answer: pick(rng, writtenOption(rows), [...others, [String(n)], [String(k)]].map(writtenOption)),
			params: reference(shown, [[]], { ask: 'output', case: family, name, vector: v, k })
		};
	}
	const v = distinct(rng, n, 2, 9);
	const a = rng.int(1, n - 2);
	const times = rng.int(0, 1) === 1;
	const k = times ? rng.int(2, 3) : rng.int(2, 5);
	const sign = times ? '*' : '+';
	const fname = times ? (k === 2 ? 'raddoppia' : 'triplica') : 'aumenta';
	const changed = (x: number) => (times ? x * k : x + k);
	const whole =
		family === 'modifica'
			? program(
					[`def ${fname}(v):`, '    for i in range(len(v)):', `        v[i] = v[i] ${sign} ${k}`, '', `${name} = ${pyList(v)}`, `${fname}(${name})`, `print(${name}[${a}])`].join('\n'),
					cppProgram([`int ${name}[N] = ${cppList(v)};`, `${fname}(${name}, N);`, `cout << ${name}[${a}] << endl;`].join('\n'), [`const int N = ${n};`, '', `void ${fname}(int v[], int n) {`, '    for (int i = 0; i < n; i++) {', `        v[i] = v[i] ${sign} ${k};`, '    }', '}'].join('\n')),
					() => [String(changed(v[a]))]
				)
			: program(
					[`def ${fname}(x):`, `    x = x ${sign} ${k}`, '', `${name} = ${pyList(v)}`, `${fname}(${name}[${a}])`, `print(${name}[${a}])`].join('\n'),
					cppProgram([`int ${name}[N] = ${cppList(v)};`, `${fname}(${name}[${a}]);`, `cout << ${name}[${a}] << endl;`].join('\n'), [`const int N = ${n};`, '', `void ${fname}(int x) {`, `    x = x ${sign} ${k};`, '}'].join('\n')),
					() => [String(v[a])]
				);
	const rows = written(whole)!;
	// the other reading of the call, the neighbours of the element, the number alone
	const others = [v[a], changed(v[a]), changed(v[a - 1]), changed(v[a + 1]), v[a - 1], v[a + 1], k, changed(a)].map((x) => [String(x)]);
	return {
		prompt: family === 'modifica' ? 'La funzione riceve il vettore.' : 'Guarda che cosa riceve la funzione: il vettore, o un numero.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(whole),
		solution: rows.join(', '),
		steps:
			family === 'modifica'
				? [`La funzione ${fname} riceve il vettore ${name}: dentro la funzione v è un altro nome dello stesso vettore, non una copia.`, `Il ciclo cambia ogni elemento: quello di indice ${a}, che valeva ${v[a]}, diventa ${v[a]} ${sign} ${k} = ${changed(v[a])}.`, `Dopo la chiamata il vettore del programma è cambiato: ${name}[${a}] vale ${changed(v[a])}.`]
				: [`La funzione ${fname} non riceve il vettore: riceve il numero ${name}[${a}], cioè ${v[a]}, e lo copia nel parametro x.`, `Dentro la funzione x diventa ${changed(v[a])}, ma x è una copia: il vettore non viene toccato.`, `Dopo la chiamata ${name}[${a}] vale ancora ${v[a]}.`],
		answer: pick(rng, writtenOption(rows), others.map(writtenOption)),
		params: reference(whole, [[]], { ask: 'output', case: family, name, vector: v, index: a, operation: sign, k })
	};
}

// ---------------------------------------------------------------- level 6: a program that needs a vector

/** What a program does with the numbers once they are in the vector `numeri`: its rows in the two languages, and what it writes. */
interface After {
	python: string[];
	cpp: string[];
	of: (v: number[]) => (string | number)[];
}

const WRITING = ['rovescia', 'sopra-ultimo', 'differenze'] as const;
type Writing = (typeof WRITING)[number];

const count = (v: number[], keep: (x: number, i: number) => boolean) => v.filter(keep).length;

function afters(family: Writing, n: number): { asks: string; says: string; how: string; right: After; wrong: After[] } {
	const last = n - 1;
	if (family === 'rovescia') {
		const loop = (python: string, cpp: string, what: { python: string; cpp: string }, of: After['of']): After => ({ python: [`for i in ${python}:`, `    print(${what.python})`], cpp: [`for (${cpp}) {`, `    cout << ${what.cpp} << endl;`, '}'], of });
		const element = { python: 'v[i]', cpp: 'v[i]' };
		return {
			asks: "scrivili in ordine inverso, dall'ultimo letto al primo, uno per riga",
			says: `Un ciclo con l'indice che scende da ${last} a 0 e scrive v[i].`,
			how: `L'ultimo numero letto è v[${last}] e il primo è v[0]: il ciclo parte da i = ${last} e toglie 1 a ogni giro, finché i arriva a 0 compreso.`,
			right: loop(`range(${last}, -1, -1)`, 'int i = N - 1; i >= 0; i--', element, (v) => [...v].reverse()),
			wrong: [
				loop(`range(${last}, 0, -1)`, 'int i = N - 1; i > 0; i--', element, (v) => [...v].reverse().slice(0, -1)),
				loop(`range(${n})`, 'int i = 0; i < N; i++', element, (v) => v),
				loop(`range(${last}, -1, -1)`, 'int i = N - 1; i >= 0; i--', { python: 'i', cpp: 'i' }, (v) => v.map((_, i) => last - i)),
				loop(`range(${last - 1}, -1, -1)`, 'int i = N - 2; i >= 0; i--', element, (v) => [...v].reverse().slice(1)),
				loop(`range(${n})`, 'int i = 0; i < N; i++', { python: `v[${last}]`, cpp: 'v[N - 1]' }, (v) => v.map(() => v[last]))
			]
		};
	}
	if (family === 'sopra-ultimo') {
		// the element to compare with, the comparison, and what is added when it holds
		const loop = (which: { python: string; cpp: string; of: (v: number[]) => number }, test: string, then: string, of: (x: number, i: number, ultimo: number) => number): After => ({
			python: [`ultimo = ${which.python}`, 'quanti = 0', `for i in range(${n}):`, `    if ${test}:`, `        quanti = quanti + ${then}`, 'print(quanti)'],
			cpp: [`int ultimo = ${which.cpp};`, 'int quanti = 0;', 'for (int i = 0; i < N; i++) {', `    if (${test}) {`, `        quanti = quanti + ${then};`, '    }', '}', 'cout << quanti << endl;'],
			of: (v) => [v.reduce((s, x, i) => s + of(x, i, which.of(v)), 0)]
		});
		const lastOne = { python: `v[${last}]`, cpp: 'v[N - 1]', of: (v: number[]) => v[last] };
		return {
			asks: "scrivi quanti di loro sono maggiori dell'ultimo numero letto",
			says: `Un ciclo che confronta ogni v[i] con l'ultimo elemento, v[${last}], e conta quelli più grandi.`,
			how: `L'ultimo numero letto è v[${last}], e conviene tenerlo in una variabile: un contatore parte da 0 e aumenta di 1 per ogni elemento v[i] che lo supera.`,
			right: loop(lastOne, 'v[i] > ultimo', '1', (x, _, u) => Number(x > u)),
			wrong: [
				loop({ python: 'v[0]', cpp: 'v[0]', of: (v) => v[0] }, 'v[i] > ultimo', '1', (x, _, u) => Number(x > u)),
				loop({ python: `v[${last - 1}]`, cpp: 'v[N - 2]', of: (v) => v[last - 1] }, 'v[i] > ultimo', '1', (x, _, u) => Number(x > u)),
				loop(lastOne, 'v[i] >= ultimo', '1', (x, _, u) => Number(x >= u)),
				loop(lastOne, 'v[i] < ultimo', '1', (x, _, u) => Number(x < u)),
				loop(lastOne, 'v[i] > ultimo', 'v[i]', (x, _, u) => (x > u ? x : 0)),
				loop(lastOne, 'i > ultimo', '1', (_, i, u) => Number(i > u))
			]
		};
	}
	// the difference goes in a variable of its own, so that the row that writes it fits the width of an option
	const largest = (test: string, what: string, of: After['of']): After => ({
		python: ['massimo = v[0]', `for i in range(1, ${n}):`, ...(test ? [`    if ${test}:`, '        massimo = v[i]'] : ['    massimo = v[i]']), `for i in range(${n}):`, `    d = ${what}`, '    print(d)'],
		cpp: ['int massimo = v[0];', 'for (int i = 1; i < N; i++) {', ...(test ? [`    if (${test}) {`, '        massimo = v[i];', '    }'] : ['    massimo = v[i];']), '}', 'for (int i = 0; i < N; i++) {', `    int d = ${what};`, '    cout << d << endl;', '}'],
		of
	});
	const more = 'v[i] > massimo';
	return {
		asks: "trova il più grande e scrivi, per ogni numero nell'ordine in cui è stato letto, quanto gli manca per arrivare al più grande, uno per riga",
		says: 'Un primo ciclo trova il massimo, un secondo scorre di nuovo il vettore e scrive la differenza massimo - v[i].',
		how: "Il massimo parte da v[0] e il primo ciclo lo aggiorna dall'indice 1 in poi; solo dopo, un secondo ciclo dall'indice 0 scrive per ogni elemento la differenza massimo - v[i].",
		right: largest(more, 'massimo - v[i]', (v) => v.map((x) => Math.max(...v) - x)),
		wrong: [
			largest(more, 'v[i] - massimo', (v) => v.map((x) => x - Math.max(...v))),
			largest('v[i] < massimo', 'massimo - v[i]', (v) => v.map((x) => Math.min(...v) - x)),
			largest(more, 'massimo', (v) => v.map(() => Math.max(...v))),
			largest('', 'massimo - v[i]', (v) => v.map((x) => v[last] - x)),
			largest(more, 'massimo - i', (v) => v.map((_, i) => Math.max(...v) - i))
		]
	};
}

/** The whole program: the numbers read into the vector `v`, and what comes after. */
function readingProgram(n: number, after: After): Program {
	const python = ['v = []', `for i in range(${n}):`, '    v.append(int(input()))', ...after.python];
	const cpp = ['int v[N];', 'for (int i = 0; i < N; i++) {', '    cin >> v[i];', '}', ...after.cpp];
	return program(python.join('\n'), cppProgram(cpp.join('\n'), `const int N = ${n};`), (input) => {
		const next = reader(input);
		const v = Array.from({ length: n }, () => Number(next()));
		return after.of(v).map(String);
	});
}

function level6(rng: Rng, family: Writing): CodeBuilt {
	const n = rng.int(5, 6);
	const { asks, says, how, right, wrong } = afters(family, n);
	const solution = readingProgram(n, right);
	const others = wrong.map((after) => ({ after, whole: readingProgram(n, after) }));
	// three runs on different numbers: the last one is neither the largest nor the smallest and the first is not the
	// largest, so that every mistake shows; a different count of numbers above the last in each run
	const above = (v: number[]) => count(v, (x) => x > v[n - 1]);
	const tests: string[][] = [];
	while (tests.length < 3) {
		const v = distinct(rng, n, 1, 20);
		if (above(v) >= 1 && above(v) <= 3 && v[0] !== Math.max(...v) && !tests.some((t) => above(t.map(Number)) === above(v))) tests.push(v.map(String));
	}
	const kept = wrongPrograms(
		solution,
		others.map((o) => o.whole),
		tests
	);
	if (kept.length < 3 || new Set(tests.map((t) => written(solution, t)!.join(' '))).size < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const shownOf = (after: After) => ({ python: after.python.join('\n'), cpp: after.cpp.join('\n') });
	const start = { python: '# scrivi qui il programma\n', cpp: cppProgram('// scrivi qui il programma', `const int N = ${n};`) };
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge ${n} numeri interi, uno per riga. Mettili in un vettore v e poi ${asks}.`,
		solution: says,
		steps: [`Leggi i ${n} numeri con un ciclo e mettili nel vettore: in Python con append su una lista vuota, in C++ con cin >> v[i] in un array di dimensione N.`, how, "Senza vettore non si può fare: quando arriva l'ultimo numero servono ancora quelli letti prima."],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'vettore'),
		choice: choose(
			rng,
			programOption(solution, shownOf(right)),
			kept.map((p) => programOption(p, shownOf(others.find((o) => o.whole === p)!.after)))
		),
		params: reference(solution, tests, { case: family, n })
	};
}

/** The level in words has no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level in words has no program'] : []);

export default makeCodeGenerator(ID, 'I vettori', {
	1: { label: 'Indici ed elementi', constraints: ['indices from 0 to n - 1', 'four different options'], build: level1, check: worded },
	2: { label: 'Leggere e scrivere un elemento', constraints: ['a vector of 4 or 5 different numbers', 'every index inside the vector', 'four different outputs'], build: drawn(ELEMENTS, level2) },
	3: { label: 'Scorrere un vettore', constraints: ['a loop over a vector of 5 or 6 numbers', 'four different outputs'], build: drawn(FAMILIES, level3) },
	4: { label: 'Quale ciclo fa questo', constraints: ['four loops that leave different values', 'each option shows the loop alone'], build: drawn(FAMILIES, level4) },
	5: { label: 'Un vettore in una funzione', constraints: ['a function that receives the vector, or one of its elements', 'four different outputs'], build: drawn(FUNCTIONS, level5) },
	6: { label: 'Scrivere un programma con un vettore', constraints: ['the program reads 5 or 6 numbers', 'graded by running it on three lists', 'needs a vector'], build: drawn(WRITING, level6) }
});
