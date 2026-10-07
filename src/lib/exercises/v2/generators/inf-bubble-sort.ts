/**
 * Exercises of the lesson "L'ordinamento a bolle" (informatica, third year, lesson 76). Spec:
 * specs/exercises/inf-bubble-sort.md
 *
 * 1. the vector after the first pass; 2. how many comparisons and how many swaps; 3. what a whole program writes
 * (the passes done with the flag, the swaps counted); 4. which inner loop completes `ordina` (options that are
 * programs, shown by their inner loop alone); 5. write the program (open answer, graded on what it writes, on the
 * function and on the nested loops).
 *
 * The names are those of the lesson: `v`, `n`, `i` for the passes, `j` for the pairs, `temp`, `scambiato`. In C++
 * the vectors are arrays. The bound of the inner loop is written `n-1-i` in C++, without the spaces of the lesson:
 * with them the row is 45 characters long inside a function, and a program under the question holds 42.
 */
import type { Rng } from '../types';
import { choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, shuffle, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-bubble-sort';

type Order = 'crescente' | 'decrescente';

/** The comparison that tells two neighbours are in the wrong order. */
const WRONG_WAY: Record<Order, '>' | '<'> = { crescente: '>', decrescente: '<' };
const SAYS: Record<Order, string> = { crescente: 'dal più basso al più alto', decrescente: 'dal più alto al più basso' };
const ORDINALS = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo'];

/** The vectors of the exercises: the name of the variable and what its numbers are (all masculine plurals). */
const NAMES = [
	{ name: 'tempi', what: 'tempi' },
	{ name: 'punti', what: 'punteggi' },
	{ name: 'voti', what: 'voti' },
	{ name: 'prezzi', what: 'prezzi' },
	{ name: 'pesi', what: 'pesi' }
] as const;

/** "3, 1, 0 e 0". */
const listed = (xs: readonly (string | number)[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}` : String(xs[0]));

function distinct(rng: Rng, size: number, low: number, high: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(low, high);
		if (!v.includes(x)) v.push(x);
	}
	return v;
}

const sorted = (v: readonly number[], order: Order = 'crescente') => [...v].sort((a, b) => (order === 'crescente' ? a - b : b - a));
const same = (a: readonly number[], b: readonly number[]) => a.join() === b.join();

/**
 * The inner loop of `ordina`, right or with the mistake of a student: where `j` starts and stops, which two
 * elements are compared, how they are swapped, and where a counter is raised.
 */
interface Inner {
	cmp: '>' | '<';
	/** `j` from 0 (as it must) or from `i`. */
	from: 'zero' | 'i';
	/** `j` up to n - 2 - i (as it must) or one pair less. */
	stop: 'full' | 'short';
	/** `v[j]` with `v[j + 1]` (as it must), `v[i]` with `v[j]`, or no comparison at all. */
	test: 'vicini' | 'vi-vj' | 'sempre';
	/** With `temp` (as it must), without it, or with the last two assignments in the wrong order. */
	swap: 'temp' | 'senza-temp' | 'ordine';
	/** `scambi = scambi + 1` at every swap, at every comparison, or nowhere. */
	count: 'no' | 'if' | 'for';
}

/** The function `ordina` around an inner loop. */
interface Shape {
	inner: Inner;
	/** The passes of the outer loop, when they are not all the n - 1. */
	passes?: number;
	/** What the counter starts from (0 when left out). */
	first?: number;
	/** The counter raised once for every pass, after the inner loop. */
	perPass?: boolean;
}

const bubble = (cmp: '>' | '<', more: Partial<Inner> = {}): Inner => ({ cmp, from: 'zero', stop: 'full', test: 'vicini', swap: 'temp', count: 'no', ...more });
const counting = (s: Shape) => s.inner.count !== 'no' || s.perPass === true;

/** What `ordina` leaves in the vector and in its counter. It throws where an index would leave the vector. */
function sort(s: Shape, start: readonly number[]): { v: number[]; count: number } {
	const x = s.inner;
	const v = [...start];
	const n = v.length;
	let count = s.first ?? 0;
	const at = (k: number) => {
		if (k < 0 || k >= n) throw new Error('index out of the vector');
		return k;
	};
	for (let i = 0; i < (s.passes ?? n - 1); i++) {
		const end = x.from === 'i' ? n - 1 : x.stop === 'short' ? n - 2 - i : n - 1 - i;
		for (let j = x.from === 'i' ? i : 0; j < end; j++) {
			const [a, b] = x.test === 'vi-vj' ? [at(i), at(j)] : [at(j), at(j + 1)];
			if (x.test === 'sempre' || (x.cmp === '>' ? v[a] > v[b] : v[a] < v[b])) {
				if (x.swap === 'temp') [v[a], v[b]] = [v[b], v[a]];
				else if (x.swap === 'senza-temp') v[a] = v[b];
				else v[b] = v[a];
				if (x.count === 'if') count++;
			}
			if (x.count === 'for') count++;
		}
		if (s.perPass) count++;
	}
	return { v, count };
}

const indent = (rows: readonly string[], by: number) => rows.map((row) => ' '.repeat(by) + row);

function innerRows(x: Inner, language: 'python' | 'cpp'): string[] {
	const py = language === 'python';
	const end = py ? '' : ';';
	const [a, b] = x.test === 'vi-vj' ? ['v[i]', 'v[j]'] : ['v[j]', 'v[j + 1]'];
	const temp = `${py ? '' : 'int '}temp = ${a}${end}`;
	const swap = x.swap === 'temp' ? [temp, `${a} = ${b}${end}`, `${b} = temp${end}`] : x.swap === 'senza-temp' ? [`${a} = ${b}${end}`, `${b} = ${a}${end}`] : [temp, `${b} = temp${end}`, `${a} = ${b}${end}`];
	const raise = `scambi = scambi + 1${end}`;
	const then = [...swap, ...(x.count === 'if' ? [raise] : [])];
	const body = [...(x.test === 'sempre' ? then : [py ? `if ${a} ${x.cmp} ${b}:` : `if (${a} ${x.cmp} ${b}) {`, ...indent(then, 4), ...(py ? [] : ['}'])]), ...(x.count === 'for' ? [raise] : [])];
	if (py) return [`for j in range(${x.from === 'i' ? 'i, n - 1' : x.stop === 'short' ? 'n - 2 - i' : 'n - 1 - i'}):`, ...indent(body, 4)];
	return [`for (int j = ${x.from === 'i' ? 'i' : '0'}; j < ${x.from === 'i' ? 'n - 1' : x.stop === 'short' ? 'n-2-i' : 'n-1-i'}; j++) {`, ...indent(body, 4), '}'];
}

/** The inner loop alone, which is what an option shows of the program. */
const innerShown = (x: Inner) => ({ python: innerRows(x, 'python').join('\n') + '\n', cpp: innerRows(x, 'cpp').join('\n') + '\n' });

function ordinaPython(s: Shape): string {
	const count = counting(s);
	return [
		'def ordina(v):',
		'    n = len(v)',
		...(count ? [`    scambi = ${s.first ?? 0}`] : []),
		`    for i in range(${s.passes ?? 'n - 1'}):`,
		...indent(innerRows(s.inner, 'python'), 8),
		...(s.perPass ? ['        scambi = scambi + 1'] : []),
		...(count ? ['    return scambi'] : [])
	].join('\n');
}

function ordinaCpp(s: Shape): string {
	const count = counting(s);
	return [
		`${count ? 'int' : 'void'} ordina(int v[], int n) {`,
		...(count ? [`    int scambi = ${s.first ?? 0};`] : []),
		`    for (int i = 0; i < ${s.passes ?? 'n - 1'}; i++) {`,
		...indent(innerRows(s.inner, 'cpp'), 8),
		...(s.perPass ? ['        scambi = scambi + 1;'] : []),
		'    }',
		...(count ? ['    return scambi;'] : []),
		'}'
	].join('\n');
}

const STAMPA_PYTHON = 'def stampa(v):\n    for x in v:\n        print(x, end=" ")\n    print()';
const STAMPA_CPP = 'void stampa(int v[], int n) {\n    for (int i = 0; i < n; i++) {\n        cout << v[i] << " ";\n    }\n    cout << endl;\n}';

/** A program that sorts each of `vectors` with `ordina` and writes it on one row, as `stampa` of the lesson does. */
function tryingProgram(s: Shape, vectors: readonly number[][], names: readonly string[]): Program {
	const sizes = ['N', 'M'];
	const python = vectors.flatMap((v, k) => [`${names[k]} = ${pyList(v)}`, `ordina(${names[k]})`, `stampa(${names[k]})`]);
	const cpp = vectors.flatMap((v, k) => [`const int ${sizes[k]} = ${v.length};`, `int ${names[k]}[${sizes[k]}] = ${cppList(v)};`, `ordina(${names[k]}, ${sizes[k]});`, `stampa(${names[k]}, ${sizes[k]});`]);
	// `stampa` leaves a space after the last number: the checks compare the rows without the spaces at their end
	return program(`${STAMPA_PYTHON}\n\n${ordinaPython(s)}\n\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), `${STAMPA_CPP}\n\n${ordinaCpp(s)}`), () => vectors.map((v) => sort(s, v).v.join(' ')));
}

/** A program with a vector written in it that writes what `ordina` gives back: the level that asks what it writes. */
function countingProgram(s: Shape, v: readonly number[], name: string): Program {
	return program(`${ordinaPython(s)}\n\n${name} = ${pyList(v)}\nprint(ordina(${name}))\n`, cppProgram(`const int N = ${v.length};\nint ${name}[N] = ${cppList(v)};\ncout << ordina(${name}, N) << endl;`, ordinaCpp(s)), () => [String(sort(s, v).count)]);
}

/** The version with the flag, which writes the passes it has done; `reset`, `raised` and `from` are where a student goes wrong. */
interface Flag {
	/** The flag lowered at the start of every pass. */
	reset: boolean;
	/** The flag up before the first pass. */
	raised: boolean;
	/** What `i` starts from. */
	from: number;
}

function flagPasses(f: Flag, start: readonly number[]): { passes: number; swaps: number[] } {
	const v = [...start];
	const n = v.length;
	const swaps: number[] = [];
	let i = f.from;
	let flag = f.raised;
	while (i < n - 1 && flag) {
		if (f.reset) flag = false;
		let done = 0;
		for (let j = 0; j < n - 1 - i; j++) {
			if (v[j] > v[j + 1]) {
				[v[j], v[j + 1]] = [v[j + 1], v[j]];
				flag = true;
				done++;
			}
		}
		swaps.push(done);
		i++;
	}
	return { passes: i, swaps };
}

function flagProgram(f: Flag, v: readonly number[], name: string): Program {
	const python = [
		'def ordina(v):',
		'    n = len(v)',
		`    i = ${f.from}`,
		`    scambiato = ${f.raised ? 'True' : 'False'}`,
		'    while i < n - 1 and scambiato:',
		...(f.reset ? ['        scambiato = False'] : []),
		'        for j in range(n - 1 - i):',
		'            if v[j] > v[j + 1]:',
		'                temp = v[j]',
		'                v[j] = v[j + 1]',
		'                v[j + 1] = temp',
		'                scambiato = True',
		'        i = i + 1',
		'    print("giri fatti:", i)',
		'',
		`${name} = ${pyList(v)}`,
		`ordina(${name})`
	];
	const before = [
		'void ordina(int v[], int n) {',
		`    int i = ${f.from};`,
		`    bool scambiato = ${f.raised};`,
		'    while (i < n - 1 && scambiato) {',
		...(f.reset ? ['        scambiato = false;'] : []),
		'        for (int j = 0; j < n-1-i; j++) {',
		'            if (v[j] > v[j + 1]) {',
		'                int temp = v[j];',
		'                v[j] = v[j + 1];',
		'                v[j + 1] = temp;',
		'                scambiato = true;',
		'            }',
		'        }',
		'        i = i + 1;',
		'    }',
		'    cout << "giri fatti: " << i << endl;',
		'}'
	];
	return program(python.join('\n'), cppProgram(`const int N = ${v.length};\nint ${name}[N] = ${cppList(v)};\nordina(${name}, N);`, before.join('\n')), () => [`giri fatti: ${flagPasses(f, v).passes}`]);
}

/** Whether the row of C++ that declares the vector with its elements fits under the question. */
const fits = (name: string, v: readonly number[]) => `    int ${name}[N] = ${cppList(v)};`.length <= 42;

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one, or a
 * vector that does not show what the level is about. The family is drawn once, before: drawn again with the
 * numbers, the families that fail more often would come out less.
 */
const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 200 || !(e instanceof TooFew)) throw e;
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

/** The swaps of each of the n - 1 passes of the plain version, in increasing order. */
function passSwaps(v: readonly number[]): number[] {
	const w = [...v];
	const swaps: number[] = [];
	for (let i = 0; i < w.length - 1; i++) {
		let done = 0;
		for (let j = 0; j < w.length - 1 - i; j++) {
			if (w[j] > w[j + 1]) {
				[w[j], w[j + 1]] = [w[j + 1], w[j]];
				done++;
			}
		}
		swaps.push(done);
	}
	return swaps;
}

const total = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

function level1(rng: Rng, n: number): CodeBuilt {
	const v = distinct(rng, n, 2, 30);
	const top = Math.max(...v);
	const after = sort({ inner: bubble('>'), passes: 1 }, v).v;
	const swaps = passSwaps(v)[0];
	// a pass that moves more than one pair and does not finish the job, with the largest element not yet at its place
	if (swaps < 2 || same(after, sorted(v)) || v[n - 1] === top) throw new TooFew('a pass that tells little');
	// only the first pair out of order is swapped
	const once = [...v];
	const k = once.findIndex((x, j) => j < n - 1 && x > once[j + 1]);
	[once[k], once[k + 1]] = [once[k + 1], once[k]];
	// the largest swapped with the last, as the selection sort would do
	const selected = [...v];
	[selected[v.indexOf(top)], selected[n - 1]] = [selected[n - 1], top];
	// the pass done from right to left: the smallest reaches the front
	const backwards = [...v];
	for (let j = n - 2; j >= 0; j--) if (backwards[j] > backwards[j + 1]) [backwards[j], backwards[j + 1]] = [backwards[j + 1], backwards[j]];
	// the pass done with the comparison the other way
	const falling = sort({ inner: bubble('<'), passes: 1 }, v).v;
	const option = (w: readonly number[]) => textOption(w.join(', '));
	return {
		prompt: 'Confronta i vicini da sinistra a destra, una coppia alla volta.',
		problem: `Il vettore v contiene, nell'ordine, ${v.join(', ')}. L'ordinamento a bolle lo mette in ordine crescente. Com'è il vettore alla fine del primo giro?`,
		solution: after.join(', '),
		steps: [
			'Il primo giro confronta v[0] con v[1], poi v[1] con v[2], e così fino agli ultimi due: scambia i due vicini ogni volta che quello di sinistra è più grande.',
			`Qui gli scambi sono ${swaps}. Da quando entra in un confronto il ${top}, che è il più grande, viene scambiato ogni volta e arriva all'ultimo posto.`,
			`Alla fine del giro il vettore è ${after.join(', ')}: gli altri elementi non sono ancora in ordine, e ci pensano i giri dopo.`
		],
		answer: pick(rng, option(after), [sorted(v), once, selected, backwards, falling].map(option)),
		params: { case: n === 5 ? 'cinque' : 'sei', vector: v }
	};
}

function level2(rng: Rng, family: 'confronti' | 'scambi'): CodeBuilt {
	const number = (x: number) => textOption(String(x));
	if (family === 'confronti') {
		const n = rng.int(5, 8);
		const v = distinct(rng, n, 2, 30);
		const swaps = total(passSwaps(v));
		if (swaps === 0) throw new TooFew('a vector already in order');
		const all = (n * (n - 1)) / 2;
		const sum = Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(' + ');
		return {
			prompt: 'I confronti si contano giro per giro.',
			problem: `L'ordinamento a bolle, nella versione che fa tutti i giri, mette in ordine crescente il vettore ${v.join(', ')}. Quanti confronti fa in tutto?`,
			solution: `${all} confronti`,
			steps: [`I confronti non dipendono dai valori ma solo dal numero di elementi, che qui è ${n}.`, `Il primo giro confronta ${n - 1} coppie e ogni giro ne confronta una in meno del precedente: ${sum} = ${all}.`, `È il numero che dà la formula n(n - 1)/2 con n = ${n}; gli scambi invece qui sono ${swaps}.`],
			// the pairs counted twice, n giri of n confronti, one comparison for each pass, the swaps, the elements
			answer: pick(rng, number(all), [n * (n - 1), n * n, n - 1, swaps, n].map(number)),
			params: { case: family, vector: v }
		};
	}
	const n = rng.int(4, 5);
	const v = distinct(rng, n, 2, 30);
	const each = passSwaps(v);
	const swaps = total(each);
	const all = (n * (n - 1)) / 2;
	// neither in order nor reversed, and more than one pass with swaps: the count is not that of the first pass
	if (swaps < 2 || swaps === all || each[1] === 0) throw new TooFew('a vector whose swaps tell little');
	const misplaced = v.filter((x, i) => x !== sorted(v)[i]).length;
	const last = each.length - 1 - [...each].reverse().findIndex((x) => x > 0);
	const made = each.slice(0, last + 1);
	return {
		prompt: 'Esegui i giri uno alla volta e conta solo gli scambi.',
		problem: `L'ordinamento a bolle, nella versione che fa tutti i giri, mette in ordine crescente il vettore ${v.join(', ')}. Quanti scambi fa in tutto?`,
		solution: `${swaps} scambi`,
		steps: [
			'Gli scambi dipendono dai valori: in ogni giro conti le coppie di vicini in cui quello di sinistra è più grande, e le scambi prima di passare alla coppia dopo.',
			`Giro per giro gli scambi sono ${listed(each)}.`,
			`In tutto ${made.join(' + ')} = ${swaps} scambi. I confronti invece sono ${all}, uno per ogni coppia guardata.`
		],
		// the comparisons, one swap for each pass, the swaps of the first pass alone, the elements out of place, one more
		answer: pick(rng, number(swaps), [all, n - 1, each[0], misplaced, swaps + 1].map(number)),
		params: { case: family, vector: v }
	};
}

function level3(rng: Rng, family: 'giri' | 'scambi'): CodeBuilt {
	const n = rng.int(5, 6);
	const v = distinct(rng, n, 1, 20);
	const { name } = rng.pick(NAMES);
	if (!fits(name, v)) throw new TooFew('the vector is too wide for the row that declares it');
	if (family === 'giri') {
		const right: Flag = { reset: true, raised: true, from: 0 };
		const { passes, swaps } = flagPasses(right, v);
		// the flag stops the passes early, after one pass at least that swaps
		if (passes < 2 || passes > n - 2) throw new TooFew('the flag does not show');
		const shown = flagProgram(right, v, name);
		const rows = written(shown)!;
		// the flag never lowered, the flag down from the start, the passes counted from 1
		const slips = wrongPrograms(
			shown,
			[
				{ ...right, reset: false },
				{ ...right, raised: false },
				{ ...right, from: 1 }
			].map((f) => flagProgram(f, v, name)),
			[[]]
		).map((p) => written(p)!);
		// the pass without swaps left out of the count, and the number of elements
		const guesses = [passes - 1, n].map((x) => [`giri fatti: ${x}`]);
		return {
			prompt: 'Segui la funzione un giro alla volta, e a ogni giro guarda la bandierina.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: rows.join(', '),
			steps: [
				`A ogni giro scambiato torna falso e si rialza al primo scambio. Gli scambi dei giri sono ${listed(swaps)}.`,
				`Il ${ORDINALS[passes - 1]} giro non scambia niente: scambiato resta falso e il while si ferma. Quel giro però è stato fatto, e i è già aumentata.`,
				`Il programma scrive giri fatti: ${passes}, e non ${n - 1} come la versione che fa tutti i giri.`
			],
			answer: pick(rng, writtenOption(rows), [slips[0], guesses[0], ...slips.slice(1), guesses[1]].map(writtenOption)),
			params: reference(shown, [[]], { ask: 'output', case: family, vector: v })
		};
	}
	const right: Shape = { inner: bubble('>', { count: 'if' }) };
	const each = passSwaps(v);
	const swaps = total(each);
	if (swaps < 2 || swaps === (n * (n - 1)) / 2) throw new TooFew('a vector whose swaps tell little');
	const shown = countingProgram(right, v, name);
	const rows = written(shown)!;
	// the counter raised at every comparison, once for every pass, and started from 1
	const slips = wrongPrograms(
		shown,
		[{ inner: bubble('>', { count: 'for' }) }, { inner: bubble('>'), perPass: true }, { ...right, first: 1 }].map((s) => countingProgram(s, v, name)),
		[[]]
	).map((p) => written(p)!);
	// the swaps of the first pass alone, and the number of elements
	const guesses = [each[0], n].map((x) => [String(x)]);
	return {
		prompt: 'Segui la funzione un giro alla volta, e guarda dove aumenta il contatore.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [
			"La funzione fa tutti i giri, e scambi aumenta di 1 solo dentro l'if: conta gli scambi, non i confronti.",
			`Giro per giro gli scambi sono ${listed(each)}.`,
			`La funzione restituisce ${swaps}, ed è quello che il programma scrive; i confronti sarebbero ${(n * (n - 1)) / 2}.`
		],
		answer: pick(rng, writtenOption(rows), [...slips, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, vector: v })
	};
}

/** The inner loops a student writes in place of `right`, each with a different mistake. */
function mistakes(right: Inner): Inner[] {
	const other = right.cmp === '>' ? '<' : '>';
	return [
		{ ...right, cmp: other },
		{ ...right, swap: 'senza-temp' },
		{ ...right, stop: 'short' },
		{ ...right, from: 'i' },
		{ ...right, test: 'vi-vj' },
		{ ...right, swap: 'ordine' },
		// without the comparison every pair is swapped; with a counter it would count what `count: 'for'` counts
		right.count === 'if' ? { ...right, count: 'for' } : { ...right, test: 'sempre' }
	];
}

function level4(rng: Rng, order: Order): CodeBuilt {
	const cmp = WRONG_WAY[order];
	const vectors = [distinct(rng, 5, 2, 30), distinct(rng, 6, 2, 30)];
	const [first, second] = shuffle(rng, NAMES);
	const names = [first.name, second.name];
	const right = bubble(cmp);
	const whole = (x: Inner) => tryingProgram({ inner: x }, vectors, names);
	const reference4 = whole(right);
	const wrong = shuffle(rng, mistakes(right)).map((x) => ({ inner: x, whole: whole(x) }));
	const kept = wrongPrograms(
		reference4,
		wrong.map((w) => w.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong loops`);
	const option = (p: Program) => programOption(p, innerShown(p === reference4 ? right : wrong.find((w) => w.whole === p)!.inner));
	return {
		prompt: 'Guarda da dove parte j, dove si ferma, il confronto e lo scambio.',
		problem: `La funzione ordina deve mettere il vettore v, di n elementi, in ordine ${order} con l'ordinamento a bolle. Il ciclo esterno c'è già e conta i giri con i, da 0 a n - 2. Quale ciclo interno la completa?`,
		solution: `Il ciclo con j da 0 a n - 2 - i che scambia v[j] e v[j + 1], con temp, quando v[j] ${cmp} v[j + 1].`,
		steps: [
			'Nel giro i gli ultimi i elementi sono già al loro posto: j parte da 0 e si ferma a n - 2 - i, e a ogni giro guarda tutte le coppie che restano.',
			`Per l'ordine ${order} (${SAYS[order]}) due vicini sono fuori posto quando v[j] ${cmp} v[j + 1]: il confronto è tra v[j] e v[j + 1], non con v[i].`,
			'Lo scambio passa da temp, con le tre assegnazioni in questo ordine: senza, la prima assegnazione cancella un valore e i due elementi diventano uguali.'
		],
		solutionCode: innerShown(right),
		answer: choose(
			rng,
			option(reference4),
			kept.map((p) => option(p))
		),
		params: reference(reference4, [[]], { case: order, vectors })
	};
}

type Kind = 'vettore' | 'scambi' | 'giri';
interface Task {
	kind: Kind;
	order: Order;
	/** The passes to do, for `giri`. */
	k?: number;
}

/** Each kind four times, so that the three come out in the same shares. */
const TASKS: readonly Task[] = (['crescente', 'decrescente'] as const).flatMap((order): Task[] => [
	{ kind: 'vettore', order },
	{ kind: 'vettore', order },
	{ kind: 'scambi', order },
	{ kind: 'scambi', order },
	{ kind: 'giri', order, k: 2 },
	{ kind: 'giri', order, k: 3 }
]);

/** The whole program of the open answer: `ordina`, the reading of n and of the n numbers, the call and what is written. */
function readingProgram(s: Shape, name: string): Program {
	const count = counting(s);
	const python = ['n = int(input())', `${name} = []`, 'for i in range(n):', `    ${name}.append(int(input()))`, ...(count ? [`print(ordina(${name}))`] : [`ordina(${name})`, `for x in ${name}:`, '    print(x)'])];
	const cpp = [`int ${name}[100];`, 'int n;', 'cin >> n;', 'for (int i = 0; i < n; i++) {', `    cin >> ${name}[i];`, '}', ...(count ? [`cout << ordina(${name}, n) << endl;`] : [`ordina(${name}, n);`, 'for (int i = 0; i < n; i++) {', `    cout << ${name}[i] << endl;`, '}'])];
	return program(`${ordinaPython(s)}\n\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), ordinaCpp(s)), (input) => {
		const next = reader(input);
		const n = Number(next());
		const v = Array.from({ length: n }, () => Number(next()));
		const done = sort(s, v);
		return count ? [String(done.count)] : done.v.map(String);
	});
}

function level5(rng: Rng, task: Task): CodeBuilt {
	const { kind, order, k } = task;
	const { name, what } = rng.pick(NAMES);
	const right: Shape = { inner: bubble(WRONG_WAY[order], { count: kind === 'scambi' ? 'if' : 'no' }), ...(k ? { passes: k } : {}) };
	const solution = readingProgram(right, name);

	// three runs on vectors of 6, 4 and 5 numbers
	const a = distinct(rng, 6, 1, 30);
	let b = distinct(rng, 4, 1, 30);
	const c = distinct(rng, 5, 1, 30);
	if (kind === 'vettore') {
		// a number that comes twice, as in the lesson
		b[rng.int(1, 3)] = b[0];
		b = shuffle(rng, b);
	}
	if (kind === 'scambi') {
		// a vector already in order, which asks for no swap, and two with different counts
		b = sorted(b, order);
		const [sa, sc] = [sort(right, a).count, sort(right, c).count];
		if (sa < 3 || sc < 1 || sa === sc) throw new TooFew('swaps that tell little');
	}
	// with only some passes the first vector must not come out in order: sorting it all would then pass
	if (kind === 'giri' && same(sort(right, a).v, sorted(a, order))) throw new TooFew('the passes asked for sort it all');
	if (kind !== 'scambi' && [a, c].some((v) => same(v, sorted(v, order)))) throw new TooFew('a vector already in order');
	const tests = [a, b, c].map((v) => [String(v.length), ...v.map(String)]);
	if (new Set(tests.map((t) => written(solution, t)!.join(' '))).size < 3) throw new TooFew('runs that write the same');

	const wrong = shuffle(rng, mistakes(right.inner)).map((x) => ({ inner: x, whole: readingProgram({ ...right, inner: x }, name) }));
	const kept = wrongPrograms(
		solution,
		wrong.map((w) => w.whole),
		tests
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong loops`);

	const cmp = WRONG_WAY[order];
	const reads = `Il programma legge un numero intero n e poi n ${what} interi, uno per riga.`;
	const nested = "(due cicli, uno dentro l'altro)";
	const asks =
		kind === 'vettore'
			? `Scrivi una funzione ordina che li mette in ordine ${order} con l'ordinamento a bolle ${nested}, poi chiamala e scrivi i ${what} ordinati, uno per riga.`
			: kind === 'scambi'
				? `Scrivi una funzione ordina che li mette in ordine ${order} con l'ordinamento a bolle ${nested} e restituisce il numero di scambi che ha fatto, poi chiamala e scrivi quel numero.`
				: `Scrivi una funzione ordina che fa solo i primi ${k} giri dell'ordinamento a bolle in ordine ${order} ${nested}, poi chiamala e scrivi i ${what} come sono rimasti, uno per riga.`;
	const start = {
		python: `# scrivi qui la funzione ordina\n\nn = int(input())\n${name} = []\nfor i in range(n):\n    ${name}.append(int(input()))\n# scrivi qui il resto\n`,
		cpp: cppProgram(`int ${name}[100];\nint n;\ncin >> n;\nfor (int i = 0; i < n; i++) {\n    cin >> ${name}[i];\n}\n// scrivi qui il resto`, '// scrivi qui la funzione ordina\n')
	};
	const outer = kind === 'giri' ? `Il ciclo esterno fa solo ${k} giri, con i da 0 a ${k! - 1}` : 'Il ciclo esterno conta i giri con i, da 0 a n - 2';
	return {
		prompt: 'Scrivi il programma. Nelle risposte da scegliere vedi solo il ciclo interno di ordina.',
		problem: `${reads} ${asks} La lettura c'è già.`,
		solution:
			kind === 'scambi'
				? `Una funzione ordina con due cicli annidati che scambia v[j] e v[j + 1] quando v[j] ${cmp} v[j + 1], conta gli scambi e li restituisce.`
				: `Una funzione ordina con due cicli annidati${kind === 'giri' ? `, quello esterno di ${k} giri,` : ''} che scambia v[j] e v[j + 1] quando v[j] ${cmp} v[j + 1].`,
		steps: [
			`Sopra il resto del programma definisci ordina. ${outer}; quello interno scorre le coppie con j, da 0 a n - 2 - i.`,
			kind === 'scambi'
				? `Dentro confronta i due vicini: se v[j] ${cmp} v[j + 1] scambiali con temp e aumenta di 1 il contatore scambi, che parte da 0 e alla fine va restituito con return.`
				: `Dentro confronta i due vicini: per l'ordine ${order} (${SAYS[order]}) li scambi, con temp, quando v[j] ${cmp} v[j + 1].`,
			kind === 'scambi' ? 'Dopo la lettura chiama ordina sul vettore e scrivi il numero che restituisce.' : 'Dopo la lettura chiama ordina sul vettore e scrivi gli elementi con un ciclo, uno per riga.'
		],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'funzione', 'annidati'),
		choice: choose(
			rng,
			programOption(solution, innerShown(right.inner)),
			kept.map((p) => programOption(p, innerShown(wrong.find((w) => w.whole === p)!.inner)))
		),
		params: reference(solution, tests, { case: kind, order, ...(k ? { k } : {}) })
	};
}

export default makeCodeGenerator(ID, "L'ordinamento a bolle", {
	1: { label: 'Un giro delle bolle', constraints: ['a vector of 5 or 6 different numbers', 'the first pass makes at least two swaps and does not sort it all'], build: drawn([5, 6], level1) },
	2: { label: 'Confronti e scambi', constraints: ['the version that does every pass', 'comparisons on 5 to 8 numbers, swaps on 4 or 5'], build: drawn(['confronti', 'scambi'] as const, level2) },
	3: { label: 'Che cosa scrive il programma', constraints: ['a whole program in the two languages', 'the passes done with the flag, or the swaps counted'], build: drawn(['giri', 'scambi'] as const, level3) },
	4: { label: 'Quale ciclo interno ordina', constraints: ['four inner loops that leave different vectors', 'each option shows the inner loop alone', 'no option leaves the vector'], build: drawn(['crescente', 'decrescente'] as const, level4) },
	5: { label: "Scrivere l'ordinamento a bolle", constraints: ['the program reads n and then n numbers', 'graded by running it on three vectors', 'needs a function of its own and two nested loops'], build: drawn(TASKS, level5) }
});
