/**
 * Selection sort (informatica, third year, lesson 75). Spec: specs/exercises/inf-selection-sort.md
 *
 * 1. the index of the minimum from a place on (what the program writes); 2. the swap of two elements, right and
 * wrong (what the program writes); 3. the vector after the first turns (text); 4. comparisons and swaps (text);
 * 5. which body of the turn is right (options that are programs, shown by the body of the outer loop alone);
 * 6. write the function (open answer, graded on what it writes and on the function).
 *
 * The programs are those of the lesson: `i` for the turn, `j` for the inner loop, `imin` for the index of the
 * minimum, `temp` for the swap, which is made only when `imin != i`. A sort is built from a `Shape`, the right one
 * or one with a mistake a student makes, and `runSort` says here what vector it leaves.
 */
import type { Rng } from '../types';
import { shuffle, START_WIDTH, choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-selection-sort';

// ---------------------------------------------------------------- numbers

/** `size` different whole numbers from `min` to `max`, in the order they are drawn. */
function distinct(rng: Rng, size: number, min: number, max: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(min, max);
		if (!v.includes(x)) v.push(x);
	}
	return v;
}

const said = (v: readonly number[]) => v.join(', ');
const same = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((x, i) => x === b[i]);

class TooFew extends Error {}

/** A level whose numbers are drawn again when they leave too few wrong answers; the case is drawn once, before. */
const drawn =
	<F>(cases: readonly F[], build: (rng: Rng, kind: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const kind = rng.pick(cases);
		for (let i = 1; ; i++) {
			try {
				return build(rng, kind);
			} catch (e) {
				if (i >= 80 || !(e instanceof TooFew)) throw e;
			}
		}
	};

const pick = (rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) => {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`${ID}: only ${keys.size} wrong options`);
	return choose(rng, right, others);
};

// ---------------------------------------------------------------- the sort, and its mistakes

interface Shape {
	/** The comparison that moves the index: `<` looks for the minimum, `>` for the maximum. */
	sign: '<' | '>';
	/** The name of the index: `imin`, or `imax` where the order asked for is decreasing. */
	index: 'imin' | 'imax';
	/** What an element is compared with: the minimum so far, or (a mistake) the element of the turn. */
	against: 'index' | 'i';
	/** Where the index starts: at i, or (a mistake) at 0. */
	start: 'i' | '0';
	/** Where the inner loop starts: after i, or (a mistake) at 0. */
	from: 'i + 1' | '0';
	/** The swap: with `temp`, or (a mistake) with two assignments. */
	swap: 'temp' | 'senza';
}

const UP: Shape = { sign: '<', index: 'imin', against: 'index', start: 'i', from: 'i + 1', swap: 'temp' };
const DOWN: Shape = { ...UP, sign: '>', index: 'imax' };

/** One turn of a shape on v, in place: the search of the index from place i and the swap. */
function turn(shape: Shape, v: number[], i: number): { index: number; swapped: boolean } {
	const n = v.length;
	let index = shape.start === 'i' ? i : 0;
	for (let j = shape.from === '0' ? 0 : i + 1; j < n; j++) {
		const other = shape.against === 'index' ? v[index] : v[i];
		if (shape.sign === '<' ? v[j] < other : v[j] > other) index = j;
	}
	if (index === i) return { index, swapped: false };
	if (shape.swap === 'temp') [v[i], v[index]] = [v[index], v[i]];
	else v[i] = v[index];
	return { index, swapped: true };
}

/** The vector a shape leaves after its first `turns` turns (all of them, when left out). */
function runSort(shape: Shape, values: readonly number[], turns = values.length - 1): number[] {
	const v = [...values];
	for (let i = 0; i < Math.min(turns, v.length - 1); i++) turn(shape, v, i);
	return v;
}

/** The body of the outer loop, which is what an option shows: from the index that starts to the swap. */
function body(shape: Shape): { python: string[]; cpp: string[] } {
	const k = shape.index;
	const other = shape.against === 'index' ? `v[${k}]` : 'v[i]';
	return {
		python: [
			`${k} = ${shape.start}`,
			shape.from === '0' ? 'for j in range(n):' : 'for j in range(i + 1, n):',
			`    if v[j] ${shape.sign} ${other}:`,
			`        ${k} = j`,
			`if ${k} != i:`,
			...(shape.swap === 'temp' ? ['    temp = v[i]', `    v[i] = v[${k}]`, `    v[${k}] = temp`] : [`    v[i] = v[${k}]`, `    v[${k}] = v[i]`])
		],
		cpp: [
			`int ${k} = ${shape.start};`,
			`for (int j = ${shape.from}; j < n; j++) {`,
			`    if (v[j] ${shape.sign} ${other}) {`,
			`        ${k} = j;`,
			'    }',
			'}',
			`if (${k} != i) {`,
			...(shape.swap === 'temp' ? ['    int temp = v[i];', `    v[i] = v[${k}];`, `    v[${k}] = temp;`] : [`    v[i] = v[${k}];`, `    v[${k}] = v[i];`]),
			'}'
		]
	};
}

const indent = (rows: string[], by: number) => rows.map((row) => ' '.repeat(by) + row);
const shownBody = (shape: Shape) => ({ python: body(shape).python.join('\n') + '\n', cpp: body(shape).cpp.join('\n') + '\n' });

/** The whole function `ordina` in the two languages. */
function functionOf(shape: Shape): { python: string; cpp: string } {
	const rows = body(shape);
	return {
		python: ['def ordina(v):', '    n = len(v)', '    for i in range(n - 1):', ...indent(rows.python, 8)].join('\n') + '\n',
		cpp: ['void ordina(int v[], int n) {', '    for (int i = 0; i < n - 1; i++) {', ...indent(rows.cpp, 8), '    }', '}'].join('\n') + '\n'
	};
}

/** A program that sorts a vector written in it and writes every element, one per row: it reads nothing. */
function sortingProgram(shape: Shape, v: readonly number[]): Program {
	const f = functionOf(shape);
	const n = v.length;
	return program(`${f.python}\nv = ${pyList(v)}\nordina(v)\nfor x in v:\n    print(x)\n`, cppProgram(`int v[${n}] = ${cppList(v)};\nordina(v, ${n});\nfor (int k = 0; k < ${n}; k++) {\n    cout << v[k] << endl;\n}`, f.cpp), () => runSort(shape, v).map(String));
}

/** A program that sorts a vector written in it, reads an index k and writes the element at k. */
function placeProgram(shape: Shape, v: readonly number[]): Program {
	const f = functionOf(shape);
	const n = v.length;
	return program(`${f.python}\nv = ${pyList(v)}\nk = int(input())\nordina(v)\nprint(v[k])\n`, cppProgram(`int v[${n}] = ${cppList(v)};\nint k;\ncin >> k;\nordina(v, ${n});\ncout << v[k] << endl;`, f.cpp), (input) => {
		const k = Number(reader(input)());
		if (!Number.isInteger(k) || k < 0 || k >= n) throw new Error('out of the vector');
		return [String(runSort(shape, v)[k])];
	});
}

/** The same sort with one mistake, each a different one a student makes. */
const mistakes = (right: Shape): Shape[] => [
	// the comparison turned: the other order
	{ ...right, sign: right.sign === '<' ? '>' : '<' },
	// compared with the element of the turn, not with the minimum so far
	{ ...right, against: 'i' },
	// the swap without the third variable
	{ ...right, swap: 'senza' },
	// the index that starts from 0 at every turn
	{ ...right, start: '0' },
	// the inner loop that starts from 0 and goes back over the elements in place
	{ ...right, from: '0' }
];

// ---------------------------------------------------------------- level 1: the index of the minimum

type From = 'inizio' | 'da i';

/** The search of the index of the minimum from place i on, as a program without functions that writes index and value. */
function searchProgram(shape: Shape, v: readonly number[], i: number): Program {
	const n = v.length;
	const other = shape.against === 'index' ? 'v[imin]' : 'v[i]';
	return program(
		`v = ${pyList(v)}\ni = ${i}\nimin = ${shape.start}\nfor j in range(${shape.from === '0' ? '' : 'i + 1, '}len(v)):\n    if v[j] ${shape.sign} ${other}:\n        imin = j\nprint(imin)\nprint(v[imin])\n`,
		cppProgram(`int v[${n}] = ${cppList(v)};\nint i = ${i};\nint imin = ${shape.start};\nfor (int j = ${shape.from}; j < ${n}; j++) {\n    if (v[j] ${shape.sign} ${other}) {\n        imin = j;\n    }\n}\ncout << imin << endl;\ncout << v[imin] << endl;`),
		() => {
			const copy = [...v];
			// the index a turn finds, without its swap
			let index = shape.start === 'i' ? i : 0;
			for (let j = shape.from === '0' ? 0 : i + 1; j < n; j++) {
				const than = shape.against === 'index' ? copy[index] : copy[i];
				if (shape.sign === '<' ? copy[j] < than : copy[j] > than) index = j;
			}
			return [String(index), String(copy[index])];
		}
	);
}

function level1(rng: Rng, kind: From): CodeBuilt {
	const n = rng.int(5, 6);
	const v = distinct(rng, n, 2, 40);
	const i = kind === 'inizio' ? 0 : rng.int(1, n - 3);
	const least = v.indexOf(Math.min(...v));
	const rest = v.slice(i);
	const at = i + rest.indexOf(Math.min(...rest));
	// from a place on, the smallest of all is before it: who forgets where the search starts gets another answer
	if (kind === 'da i' && least >= i) throw new TooFew('the smallest of all is not before i');
	// the minimum is neither where the search starts nor the first smaller element met
	if (at === i || v.slice(i + 1, at).some((x) => x < v[i])) throw new TooFew('the minimum is found at once');
	const shown = searchProgram(UP, v, i);
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		mistakes(UP)
			.filter((s) => s.swap === 'temp')
			.map((s) => searchProgram(s, v, i)),
		[[]]
	).map((p) => written(p)!);
	// what a student answers without following the loop: the place counted from 1, the value twice, the two exchanged
	const guesses = [
		[String(at + 1), String(v[at])],
		[String(v[at]), String(v[at])],
		[String(v[at]), String(at)]
	];
	return {
		prompt: 'Segui imin un giro alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [
			`imin parte da ${i} e j scorre gli indici da ${i + 1} a ${n - 1}: gli elementi guardati sono ${said(v.slice(i))}.`,
			`imin cambia ogni volta che v[j] è minore di v[imin]. Il più piccolo di quegli elementi è ${v[at]}, che ha indice ${at}.`,
			`Il programma scrive prima l'indice, ${at}, poi il valore, ${v[at]}. Gli indici partono da 0.`
		],
		answer: pick(rng, writtenOption(rows), [...others, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, vector: v, i })
	};
}

// ---------------------------------------------------------------- level 2: the swap

type Swap = 'con temp' | 'senza temp' | 'ordine sbagliato';
// half of the samples swap rightly, the others show one of the two mistakes
const SWAPS: readonly Swap[] = ['con temp', 'con temp', 'senza temp', 'ordine sbagliato'];

/** The three ways the rows of a swap are written, and what each leaves in the two places. */
function swapRows(kind: Swap, a: number, b: number): { python: string[]; cpp: string[]; of: (v: number[]) => number[] } {
	const A = `v[${a}]`;
	const B = `v[${b}]`;
	const rows = kind === 'con temp' ? [`temp = ${A}`, `${A} = ${B}`, `${B} = temp`] : kind === 'senza temp' ? [`${A} = ${B}`, `${B} = ${A}`] : [`temp = ${A}`, `${B} = temp`, `${A} = ${B}`];
	return {
		python: rows,
		cpp: rows.map((row) => `${row.startsWith('temp') ? 'int ' : ''}${row};`),
		of: (v) => {
			const out = [...v];
			if (kind === 'con temp') [out[a], out[b]] = [v[b], v[a]];
			else if (kind === 'senza temp') out[a] = v[b];
			else out[b] = v[a];
			return out;
		}
	};
}

function swapProgram(kind: Swap, v: readonly number[], a: number, b: number): Program {
	const rows = swapRows(kind, a, b);
	const n = v.length;
	return program(`v = ${pyList(v)}\n${rows.python.join('\n')}\nfor x in v:\n    print(x)\n`, cppProgram(`int v[${n}] = ${cppList(v)};\n${rows.cpp.join('\n')}\nfor (int k = 0; k < ${n}; k++) {\n    cout << v[k] << endl;\n}`), () => rows.of([...v]).map(String));
}

function level2(rng: Rng, kind: Swap): CodeBuilt {
	const n = rng.int(4, 5);
	const v = distinct(rng, n, 2, 40);
	const [a, b] = distinct(rng, 2, 0, n - 1).sort((p, q) => p - q);
	const shown = swapProgram(kind, v, a, b);
	const rows = written(shown)!;
	const others = (['con temp', 'senza temp', 'ordine sbagliato'] as const).filter((k) => k !== kind).map((k) => written(swapProgram(k, v, a, b))!);
	const why =
		kind === 'con temp'
			? [`temp tiene da parte il valore di v[${a}], che è ${v[a]}.`, `v[${a}] riceve il valore di v[${b}], ${v[b]}, e poi v[${b}] riceve quello che era in temp, ${v[a]}.`, `I due elementi si sono scambiati, e gli altri restano dove sono.`]
			: kind === 'senza temp'
				? [`La prima assegnazione copia in v[${a}] il valore di v[${b}], ${v[b]}: il ${v[a]} che c'era è cancellato.`, `La seconda copia in v[${b}] il valore che v[${a}] ha adesso, cioè ancora ${v[b]}.`, `Il ${v[b]} compare due volte e il ${v[a]} è andato perso: per scambiare serve una terza variabile.`]
				: [`temp tiene da parte il valore di v[${a}], che è ${v[a]}.`, `La seconda riga scrive subito temp in v[${b}]: il ${v[b]} che c'era è cancellato prima di essere stato copiato.`, `La terza copia in v[${a}] il valore che v[${b}] ha adesso, ${v[a]}: il ${v[a]} compare due volte.`];
	return {
		prompt: 'Esegui le assegnazioni una alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: why,
		answer: pick(rng, writtenOption(rows), [...others, v.map(String)].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, vector: v, a, b })
	};
}

// ---------------------------------------------------------------- level 3: the vector after some turns

type Turns = 'un giro' | 'due giri' | 'tre giri';
const TURNS: readonly Turns[] = ['un giro', 'due giri', 'tre giri'];

/** What other ways of moving the elements leave after k turns: the mistakes the wrong options come from. */
function otherWays(v: readonly number[], k: number): number[][] {
	// the minimum taken out and put at place i, with the others moved one place to the right
	const slid = [...v];
	for (let i = 0; i < k; i++) {
		const rest = slid.slice(i);
		const at = i + rest.indexOf(Math.min(...rest));
		slid.splice(i, 0, slid.splice(at, 1)[0]);
	}
	// the turns of the bubble sort: the largest goes to the end
	const bubbled = [...v];
	for (let i = 0; i < k; i++) for (let j = 0; j < v.length - 1 - i; j++) if (bubbled[j] > bubbled[j + 1]) [bubbled[j], bubbled[j + 1]] = [bubbled[j + 1], bubbled[j]];
	return [runSort(UP, v, k - 1), runSort(UP, v, k + 1), slid, runSort({ ...UP, swap: 'senza' }, v, k), bubbled, runSort(UP, v), runSort(DOWN, v, k)];
}

function level3(rng: Rng, kind: Turns): CodeBuilt {
	const k = TURNS.indexOf(kind) + 1;
	const v = distinct(rng, rng.int(5, 6), 2, 40);
	const before = runSort(UP, v, k - 1);
	const after = runSort(UP, v, k);
	// the last of the turns asked for moves something, and the vector is not sorted yet
	if (same(before, after) || same(after, runSort(UP, v))) throw new TooFew('the turn changes nothing, or sorts everything');
	const option = (w: readonly number[]) => textOption(said(w));
	const told: string[] = [];
	const work = [...v];
	for (let i = 0; i < k; i++) {
		const least = Math.min(...work.slice(i));
		const was = work[i];
		const { swapped } = turn(UP, work, i);
		told.push(`Giro con i = ${i}: il più piccolo da lì in poi è ${least}${swapped ? `, che si scambia con ${was}. Il vettore diventa ${said(work)}` : `, che è già al suo posto. Il vettore resta ${said(work)}`}.`);
	}
	return {
		prompt: 'Fai un giro alla volta: cerca il minimo, poi scambia.',
		problem: `L'ordinamento per selezione mette in ordine crescente il vettore ${said(v)}. Com'è il vettore dopo ${k === 1 ? 'il primo giro' : `i primi ${k === 2 ? 'due' : 'tre'} giri`}?`,
		solution: said(after),
		steps: told,
		answer: pick(rng, option(after), otherWays(v, k).map(option)),
		params: { case: kind, vector: v, turns: k }
	};
}

// ---------------------------------------------------------------- level 4: comparisons and swaps

type Count = 'confronti' | 'giro' | 'scambi';
const COUNTS: readonly Count[] = ['confronti', 'giro', 'giro', 'scambi', 'scambi'];
const SIZES = [4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 30, 40, 50, 100] as const;

function level4(rng: Rng, kind: Count): CodeBuilt {
	const number = (k: number) => textOption(String(k));
	if (kind === 'confronti') {
		const n = rng.pick(SIZES);
		const all = (n * (n - 1)) / 2;
		return {
			prompt: 'Somma i confronti di ogni giro.',
			problem: `Un vettore ha ${n} elementi. Quanti confronti fa in tutto l'ordinamento per selezione per ordinarlo?`,
			solution: `${all}`,
			steps: [`Nel primo giro j passa su ${n - 1} elementi, nel secondo su ${n - 2}, nell'ultimo su uno solo.`, `La somma dei numeri da 1 a ${n - 1} è ${n} per ${n - 1} diviso 2.`, `Sono ${all} confronti, qualunque sia l'ordine di partenza.`],
			answer: pick(rng, number(all), [n * n, n * (n - 1), n - 1, (n * (n + 1)) / 2, n].map(number)),
			params: { case: kind, n }
		};
	}
	if (kind === 'giro') {
		const n = rng.int(5, 12);
		const i = rng.int(1, n - 3);
		const count = n - 1 - i;
		return {
			prompt: 'Conta gli elementi su cui passa j.',
			problem: `L'ordinamento per selezione sta ordinando un vettore di ${n} elementi. Quanti confronti fa nel giro in cui i vale ${i}?`,
			solution: `${count}`,
			steps: [`Nel giro con i uguale a ${i} l'indice j va da ${i + 1} a ${n - 1}.`, `Per ogni valore di j c'è un confronto tra v[j] e v[imin].`, `I valori di j sono ${count}, quindi i confronti sono ${count}.`],
			answer: pick(rng, number(count), [n - i, n - 1, i, count - 1, n, i + 1].filter((x) => x >= 1).map(number)),
			params: { case: kind, n, i }
		};
	}
	const v = distinct(rng, rng.int(5, 7), 2, 40);
	const n = v.length;
	const work = [...v];
	const places: number[] = [];
	for (let i = 0; i < n - 1; i++) if (turn(UP, work, i).swapped) places.push(i);
	const swaps = places.length;
	const misplaced = v.filter((x, i) => x !== work[i]).length;
	// at least one turn swaps and at least one does not: the answer is neither nothing nor one per turn
	if (swaps === 0 || swaps === n - 1) throw new TooFew('every turn swaps, or none');
	return {
		prompt: 'Per ogni giro guarda se il minimo è già al suo posto.',
		problem: `L'ordinamento per selezione, che scambia solo quando imin è diverso da i, mette in ordine crescente il vettore ${said(v)}. Quanti scambi fa?`,
		solution: `${swaps}`,
		steps: [`I giri sono ${n - 1}, e in ogni giro c'è al massimo uno scambio.`, `Lo scambio c'è solo se il più piccolo degli elementi rimasti non è già al posto i: succede ${swaps === 1 ? `nel giro con i uguale a ${places[0]}` : `nei giri con i uguale a ${said(places)}`}.`, `In tutto ${swaps === 1 ? 'uno scambio' : `${swaps} scambi`}.`],
		answer: pick(rng, number(swaps), [n - 1, misplaced, (n * (n - 1)) / 2, swaps + 1, swaps - 1, n].filter((x) => x >= 0).map(number)),
		params: { case: kind, vector: v }
	};
}

// ---------------------------------------------------------------- levels 5 and 6: the body of the turn, the function

type Order = 'crescente' | 'decrescente';
const ORDERS: readonly Order[] = ['crescente', 'decrescente'];
const shapeOf = (order: Order) => (order === 'crescente' ? UP : DOWN);

const explains = (order: Order) => {
	const k = shapeOf(order).index;
	const what = order === 'crescente' ? 'il più piccolo' : 'il più grande';
	return [
		`A ogni giro ${k} parte da i, e j scorre gli elementi da i + 1 in poi: quelli prima di i sono già al loro posto.`,
		`Il confronto è con v[${k}], ${what} trovato finora: quando v[j] è ${order === 'crescente' ? 'minore' : 'maggiore'}, ${k} diventa j.`,
		`Finito il ciclo interno, se ${k} è diverso da i i due elementi si scambiano, con temp che tiene da parte v[i].`
	];
};

function level5(rng: Rng, order: Order): CodeBuilt {
	const v = distinct(rng, rng.int(6, 7), 2, 40);
	const shape = shapeOf(order);
	const right = sortingProgram(shape, v);
	const wrong = mistakes(shape).map((s) => ({ shape: s, whole: sortingProgram(s, v) }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong bodies`);
	const option = (p: Program) => programOption(p, shownBody(p === right ? shape : wrong.find((w) => w.whole === p)!.shape));
	return {
		prompt: 'Leggi da dove parte ogni ciclo, il confronto e lo scambio.',
		problem: `La funzione ordina(v) mette il vettore v, di n elementi, in ordine ${order} con l'ordinamento per selezione. Il ciclo esterno fa passare i da 0 a n - 2. Quali istruzioni formano il corpo del ciclo esterno?`,
		solution: `Il corpo in cui ${shape.index} parte da i, il confronto è v[j] ${shape.sign} v[${shape.index}] e lo scambio usa temp.`,
		steps: explains(order),
		solutionCode: shownBody(shape),
		answer: choose(
			rng,
			option(right),
			shuffle(rng, kept).map((p) => option(p))
		),
		params: reference(right, [[]], { case: order, vector: v })
	};
}

function level6(rng: Rng, order: Order): CodeBuilt {
	// the row of the vector fits the editor the answer is written in
	let v = distinct(rng, 6, 2, 40);
	while (`    int v[6] = ${cppList(v)};`.length > START_WIDTH) v = distinct(rng, 6, 2, 40);
	const shape = shapeOf(order);
	const solution = placeProgram(shape, v);
	const tests = [0, 1, 2, 3, 4, 5].map((k) => [String(k)]);
	const wrong = mistakes(shape).map((s) => ({ shape: s, whole: placeProgram(s, v) }));
	const kept = wrongPrograms(
		solution,
		wrong.map((w) => w.whole),
		tests
	);
	// the vector is not in order already, in either direction: the function has work to do
	if (kept.length < 3 || same(v, runSort(UP, v)) || same(v, runSort(DOWN, v))) throw new TooFew(`${ID}: only ${kept.length} wrong bodies`);
	const start = {
		python: `# scrivi qui la funzione ordina\n\nv = ${pyList(v)}\nk = int(input())\n# scrivi qui il resto\n`,
		cpp: cppProgram(`int v[6] = ${cppList(v)};\nint k;\ncin >> k;\n// scrivi qui il resto`, '// scrivi qui la funzione ordina\n')
	};
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il vettore v ha 6 numeri ed è già nel programma, che legge un indice k da 0 a 5. Scrivi una funzione ordina che riceve il vettore (in C++ anche la dimensione) e lo mette in ordine ${order} con l'ordinamento per selezione. Poi chiamala e scrivi l'elemento di indice k del vettore ordinato. La lettura c'è già.`,
		solution: `Una funzione ordina con due cicli annidati: ${shape.index} parte da i, il confronto è v[j] ${shape.sign} v[${shape.index}], e alla fine del giro c'è lo scambio con temp.`,
		steps: ['Sopra il resto del programma definisci la funzione ordina: il ciclo esterno fa passare i da 0 a n - 2.', ...explains(order), 'Dopo la lettura chiama ordina con il vettore e scrivi v[k].'],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'funzione'),
		choice: choose(
			rng,
			programOption(solution, shownBody(shape)),
			kept.map((p) => programOption(p, shownBody(wrong.find((w) => w.whole === p)!.shape)))
		),
		params: reference(solution, tests, { case: order, vector: v })
	};
}

/** The levels of text have no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of text has no program'] : []);

export default makeCodeGenerator(ID, "L'ordinamento per selezione", {
	1: { label: 'Trovare il minimo', constraints: ['a vector of 5 or 6 different numbers', 'the index of the minimum from place i on, and its value', 'four different outputs'], build: drawn<From>(['inizio', 'da i'], level1) },
	2: { label: 'Lo scambio', constraints: ['a vector of 4 or 5 different numbers', 'a swap with temp, or one of two wrong ones', 'four different outputs'], build: drawn(SWAPS, level2) },
	3: { label: "Un giro dell'ordinamento", constraints: ['a vector of 5 or 6 different numbers', 'the vector after 1, 2 or 3 turns', 'the last turn asked for swaps'], build: drawn(TURNS, level3), check: worded },
	4: { label: 'Confronti e scambi', constraints: ['all the comparisons on n elements, those of one turn, or the swaps on a vector', 'a swap only when imin != i'], build: drawn(COUNTS, level4), check: worded },
	5: { label: 'Il corpo del giro', constraints: ['four bodies of the outer loop that leave different vectors', 'each option shows the body alone'], build: drawn(ORDERS, level5) },
	6: { label: "Scrivere l'ordinamento", constraints: ['a vector of 6 numbers in the program', 'graded by running it on the six indices', 'needs a function of its own'], build: drawn(ORDERS, level6) }
});
