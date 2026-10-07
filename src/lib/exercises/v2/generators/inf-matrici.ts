/**
 * Exercises for the lesson "Le matrici" (informatica, third year, lesson 72). Spec: specs/exercises/inf-matrici.md
 *
 * 1. what `m[a][b]` is, read or written; 2. the sum of one row or of one column, with one loop; 3. what two nested
 * loops write (sums by rows, by columns, counts by rows); 4. which loops do what is asked (options that are
 * programs, shown by their loops alone); 5. the diagonals of a square matrix; 6. write the loops (open answer: the
 * matrix is read from the keyboard, the reading is given).
 *
 * Every program is written by hand in Python and in C++ (v2/inf-codice.ts), with `m[i][j]` always row first, `R`
 * and `C` for the sizes and `N` for a square matrix, as in the lesson.
 */
import type { Rng } from '../types';
import { OPTION_WIDTH, choose, shuffle, cppProgram, makeCodeGenerator, program, programAnswer, programOption, pyList, cppList, reader, reference, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-matrici';

type Matrix = number[][];

class TooFew extends Error {}

/** A level whose numbers are drawn again when they leave too few wrong answers; the family is drawn once, before. */
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
	return choose(
		rng,
		right,
		others.filter((o) => o.values.join('|') !== right.values.join('|'))
	);
};

/** A matrix of R rows and C columns with numbers from `low` to `high`; all different when `different`. */
function matrix(rng: Rng, R: number, C: number, low: number, high: number, different = false): Matrix {
	const seen = new Set<number>();
	return Array.from({ length: R }, () =>
		Array.from({ length: C }, () => {
			for (;;) {
				const x = rng.int(low, high);
				if (different && seen.has(x)) continue;
				seen.add(x);
				return x;
			}
		})
	);
}

/** An element, or an error where the indices leave the matrix: what stops Python, and is not defined in C++. */
function at(m: Matrix, i: number, j: number): number {
	if (!Number.isInteger(i) || !Number.isInteger(j) || i < 0 || j < 0 || i >= m.length || j >= m[i].length) throw new Error('index out of the matrix');
	return m[i][j];
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const column = (m: Matrix, j: number) => m.map((row) => row[j]);

/** What comes after the matrix in a program: its rows in the two languages, and what it writes on a matrix. */
interface Body {
	python: string[];
	cpp: string[];
	out: (m: Matrix) => string[];
}

/** Whether the rows of a body fit an option. */
const fits = (body: Body) => [...body.python, ...body.cpp].every((row) => row.length <= OPTION_WIDTH);

const indent = (rows: string[], by = 1) => rows.map((row) => (row ? '    '.repeat(by) + row : row));

/** The sizes as the two languages name them: R and C, or N alone for a square matrix. */
const sizes = (m: Matrix, square: boolean) =>
	square
		? { python: ['N = len(m)'], cpp: [`const int N = ${m.length};`], dims: 'N][N' }
		: { python: ['R = len(m)', 'C = len(m[0])'], cpp: [`const int R = ${m.length};`, `const int C = ${m[0].length};`], dims: 'R][C' };

/** A whole program around a body, with the matrix written in it. */
function withMatrix(m: Matrix, body: Body, square = false): Program {
	const s = sizes(m, square);
	const python = ['m = [', ...m.map((row, i) => `    ${pyList(row)}${i < m.length - 1 ? ',' : ''}`), ']', ...s.python, ...body.python].join('\n') + '\n';
	const main = [`int m[${s.dims}] = {`, ...m.map((row, i) => `    ${cppList(row)}${i < m.length - 1 ? ',' : ''}`), '};', ...body.cpp].join('\n');
	return program(python, cppProgram(main, s.cpp.join('\n') + '\n'), () => body.out(m));
}

/** The reading of a matrix of whole numbers typed one per line, as the lesson writes it, in the two languages. */
function reading(R: number, C: number, square: boolean) {
	const [r, c] = square ? ['N', 'N'] : ['R', 'C'];
	return {
		python: [...(square ? [`N = ${R}`] : [`R = ${R}`, `C = ${C}`]), 'm = []', `for i in range(${r}):`, '    riga = []', `    for j in range(${c}):`, '        riga.append(int(input()))', '    m.append(riga)'],
		before: (square ? [`const int N = ${R};`] : [`const int R = ${R};`, `const int C = ${C};`]).join('\n') + '\n',
		cpp: [`int m[${r}][${c}];`, `for (int i = 0; i < ${r}; i++) {`, `    for (int j = 0; j < ${c}; j++) {`, '        cin >> m[i][j];', '    }', '}']
	};
}

/** A whole program around a body, with the matrix read from the keyboard. */
function withReading(R: number, C: number, body: Body, square = false): Program {
	const read = reading(R, C, square);
	return program([...read.python, ...body.python].join('\n') + '\n', cppProgram([...read.cpp, ...body.cpp].join('\n'), read.before), (input) => {
		const next = reader(input);
		const m = Array.from({ length: R }, () => Array.from({ length: C }, () => Number(next())));
		return body.out(m);
	});
}

// ---------------------------------------------------------------- two nested loops

/**
 * Two nested loops that keep one value: which index the outer loop moves, where the value is set to 0, where it is
 * written, what is added (the element, or 1 when `when` holds), and whether the indices are written the wrong way.
 */
interface Loops {
	acc: string;
	outer: 'i' | 'j';
	reset: 'before' | 'outer' | 'inner';
	print: 'inner' | 'outer' | 'after';
	add: 'element' | 'one';
	when?: { op: '>=' | '>' | '<'; k: number };
	swapped?: boolean;
}

const holds = (x: number, when: NonNullable<Loops['when']>) => (when.op === '>=' ? x >= when.k : when.op === '>' ? x > when.k : x < when.k);

function loops(l: Loops): Body {
	const inner = l.outer === 'i' ? 'j' : 'i';
	const bound = (index: string) => (index === 'i' ? 'R' : 'C');
	const element = l.swapped ? 'm[j][i]' : 'm[i][j]';
	const step = `${l.acc} = ${l.acc} + ${l.add === 'one' ? '1' : element}`;
	const python = [
		...(l.reset === 'before' ? [`${l.acc} = 0`] : []),
		`for ${l.outer} in range(${bound(l.outer)}):`,
		...indent([
			...(l.reset === 'outer' ? [`${l.acc} = 0`] : []),
			`for ${inner} in range(${bound(inner)}):`,
			...indent([...(l.reset === 'inner' ? [`${l.acc} = 0`] : []), ...(l.when ? [`if ${element} ${l.when.op} ${l.when.k}:`, `    ${step}`] : [step]), ...(l.print === 'inner' ? [`print(${l.acc})`] : [])]),
			...(l.print === 'outer' ? [`print(${l.acc})`] : [])
		]),
		...(l.print === 'after' ? [`print(${l.acc})`] : [])
	];
	// in C++ the variable is declared where it is set to 0 when everything that uses it is inside that block
	const local = l.reset === 'outer' && l.print !== 'after';
	const head = (index: string) => `for (int ${index} = 0; ${index} < ${bound(index)}; ${index}++) {`;
	const cpp = [
		...(local ? [] : [`int ${l.acc} = 0;`]),
		head(l.outer),
		...indent([
			...(l.reset === 'outer' ? [`${local ? 'int ' : ''}${l.acc} = 0;`] : []),
			head(inner),
			...indent([...(l.reset === 'inner' ? [`${l.acc} = 0;`] : []), ...(l.when ? [`if (${element} ${l.when.op} ${l.when.k}) {`, `    ${step};`, '}'] : [`${step};`]), ...(l.print === 'inner' ? [`cout << ${l.acc} << endl;`] : [])]),
			'}',
			...(l.print === 'outer' ? [`cout << ${l.acc} << endl;`] : [])
		]),
		'}',
		...(l.print === 'after' ? [`cout << ${l.acc} << endl;`] : [])
	];
	const out = (m: Matrix) => {
		const R = m.length;
		const C = m[0].length;
		const rows: string[] = [];
		let acc = 0;
		const [outerTurns, innerTurns] = l.outer === 'i' ? [R, C] : [C, R];
		for (let a = 0; a < outerTurns; a++) {
			if (l.reset === 'outer') acc = 0;
			for (let b = 0; b < innerTurns; b++) {
				if (l.reset === 'inner') acc = 0;
				const [i, j] = l.outer === 'i' ? [a, b] : [b, a];
				const x = l.swapped ? at(m, j, i) : at(m, i, j);
				if (!l.when || holds(x, l.when)) acc += l.add === 'one' ? 1 : x;
				if (l.print === 'inner') rows.push(String(acc));
			}
			if (l.print === 'outer') rows.push(String(acc));
		}
		if (l.print === 'after') rows.push(String(acc));
		return rows;
	};
	return { python, cpp, out };
}

type NestedFamily = 'righe' | 'colonne' | 'conta';

/** The right loops of a family, and the same loops with a mistake a student makes, each a different one. */
type Op = NonNullable<Loops['when']>['op'];
const OPS: readonly Op[] = ['>=', '>', '<'];
const SAID: Record<Op, string> = { '>=': 'maggiori o uguali a', '>': 'maggiori di', '<': 'minori di' };

function nested(family: NestedFamily, acc: string, k: number, op: Op = '>='): { right: Loops; wrong: Loops[]; gives: string } {
	if (family === 'conta') {
		const right: Loops = { acc, outer: 'i', reset: 'outer', print: 'outer', add: 'one', when: { op, k } };
		const [near, far] = OPS.filter((o) => o !== op);
		return {
			right,
			gives: `per ogni riga, quanti elementi sono ${SAID[op]} ${k}`,
			wrong: [
				{ ...right, when: { op: near, k } },
				{ ...right, reset: 'before' },
				{ ...right, add: 'element' },
				{ ...right, outer: 'j' },
				{ ...right, when: { op: far, k } },
				{ ...right, print: 'after' },
				{ ...right, when: undefined }
			]
		};
	}
	const outer = family === 'righe' ? 'i' : 'j';
	const right: Loops = { acc, outer, reset: 'outer', print: 'outer', add: 'element' };
	return {
		right,
		gives: family === 'righe' ? 'la somma di ogni riga' : 'la somma di ogni colonna',
		wrong: [{ ...right, outer: outer === 'i' ? 'j' : 'i' }, { ...right, reset: 'before' }, { ...right, reset: 'inner' }, { ...right, print: 'inner' }, { ...right, print: 'after' }, { ...right, add: 'one' }, { ...right, swapped: true }]
	};
}

// ---------------------------------------------------------------- one loop

/** One loop over a square matrix of N rows that keeps one value: which element it takes at each turn. */
interface Line {
	acc: string;
	/** The two indices of the element, written with `i`: `i` and `i`, `i` and `N - 1 - i`. */
	row: string;
	col: string;
	of: (i: number, N: number) => [number, number];
	add: 'element' | 'one';
	/** The turns: all N of them, or one fewer. */
	short?: boolean;
}

function line(l: Line): Body {
	const turns = l.short ? 'N - 1' : 'N';
	const step = `${l.acc} = ${l.acc} + ${l.add === 'one' ? '1' : `m[${l.row}][${l.col}]`}`;
	return {
		python: [`${l.acc} = 0`, `for i in range(${turns}):`, `    ${step}`, `print(${l.acc})`],
		cpp: [`int ${l.acc} = 0;`, `for (int i = 0; i < ${turns}; i++) {`, `    ${step};`, '}', `cout << ${l.acc} << endl;`],
		out: (m) => {
			const N = m.length;
			let acc = 0;
			for (let i = 0; i < (l.short ? N - 1 : N); i++) {
				const [r, c] = l.of(i, N);
				acc += l.add === 'one' ? 1 : at(m, r, c);
			}
			return [String(acc)];
		}
	};
}

type Diagonal = 'principale' | 'secondaria';

function diagonal(which: Diagonal, acc: string): { right: Line; wrong: Line[] } {
	const main: Line = { acc, row: 'i', col: 'i', of: (i) => [i, i], add: 'element' };
	const other: Line = { acc, row: 'i', col: 'N - 1 - i', of: (i, N) => [i, N - 1 - i], add: 'element' };
	const right = which === 'principale' ? main : other;
	return {
		right,
		wrong: [
			which === 'principale' ? other : main,
			{ acc, row: '0', col: 'i', of: (i) => [0, i], add: 'element' },
			{ acc, row: 'i', col: '0', of: (i) => [i, 0], add: 'element' },
			{ acc, row: 'i', col: 'N - 1', of: (i, N) => [i, N - 1], add: 'element' },
			{ ...right, short: true },
			{ ...right, add: 'one' },
			// the index that forgets the 1: it leaves the matrix at the first turn, and is thrown away as an option
			{ acc, row: 'i', col: 'N - i', of: (i, N) => [i, N - i], add: 'element' }
		]
	};
}

// ---------------------------------------------------------------- levels

const ACCS = ['somma', 'totale', 's'] as const;
const SHAPES: readonly [number, number][] = [
	[2, 3],
	[3, 2],
	[2, 4],
	[3, 4]
];
const numbers = (rows: string[]) => rows.join(', ');
/** The wrong answers in the order they are offered: the mistake made most often first, the others as they are drawn. */
const mixed = <T>(rng: Rng, xs: T[]): T[] => (xs.length ? [xs[0], ...shuffle(rng, xs.slice(1))] : xs);

type ElementCase = 'legge' | 'scrive';

function level1(rng: Rng, family: ElementCase): CodeBuilt {
	const [R, C] = rng.pick(SHAPES);
	const m = matrix(rng, R, C, 1, 30, true);
	const a = rng.int(0, R - 1);
	const b = rng.int(0, C - 1);
	const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < R && j < C;
	if (family === 'legge') {
		if (a === b) throw new TooFew('the two indices tell nothing apart');
		const shown = withMatrix(m, { python: [`print(m[${a}][${b}])`], cpp: [`cout << m[${a}][${b}] << endl;`], out: (x) => [String(at(x, a, b))] });
		// the indices the wrong way round, counted from 1, and the neighbours of who miscounts one of the two
		const places: [number, number][] = [
			[b, a],
			[a - 1, b - 1],
			[a + 1, b],
			[a, b + 1],
			[a - 1, b],
			[a, b - 1]
		];
		const others = places.filter(([i, j]) => inside(i, j)).map(([i, j]) => [String(m[i][j])]);
		return {
			prompt: 'Il primo indice è la riga, il secondo la colonna, e tutti e due partono da 0.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: String(m[a][b]),
			steps: [`m[${a}][${b}] è l'elemento della riga di indice ${a} e della colonna di indice ${b}.`, `La riga di indice ${a} è ${m[a].join(', ')}: gli indici partono da 0, quindi è la ${['prima', 'seconda', 'terza'][a]} riga.`, `In quella riga l'elemento di indice ${b} è ${m[a][b]}.`],
			answer: pick(rng, writtenOption([String(m[a][b])]), others.map(writtenOption)),
			params: reference(shown, [[]], { ask: 'output', case: family, matrix: m, a, b })
		};
	}
	// m[a][b] takes the value of another element plus k, and is written
	const c = rng.int(0, R - 1);
	const d = rng.int(0, C - 1);
	const k = rng.int(1, 5);
	if ((a === c && b === d) || c === d) throw new TooFew('the element read is the one written');
	if (m[c][d] + k === m[a][b]) throw new TooFew('the assignment changes nothing');
	const shown = withMatrix(m, {
		python: [`m[${a}][${b}] = m[${c}][${d}] + ${k}`, `print(m[${a}][${b}])`],
		cpp: [`m[${a}][${b}] = m[${c}][${d}] + ${k};`, `cout << m[${a}][${b}] << endl;`],
		out: (x) => [String(at(x, c, d) + k)]
	});
	const others = [[m[a][b] + k], [m[a][b]], [m[c][d]], ...(inside(d, c) ? [[m[d][c] + k]] : []), ...(inside(c - 1, d - 1) ? [[m[c - 1][d - 1] + k]] : [])].map((v) => v.map(String));
	return {
		prompt: "Prima si calcola quello che sta a destra dell'uguale, poi il risultato va nell'elemento a sinistra.",
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: String(m[c][d] + k),
		steps: [`A destra dell'uguale c'è m[${c}][${d}], l'elemento della riga ${c} e della colonna ${d}: vale ${m[c][d]}.`, `${m[c][d]} + ${k} fa ${m[c][d] + k}, e questo valore prende il posto di ${m[a][b]} in m[${a}][${b}].`, `Il programma scrive il nuovo valore di m[${a}][${b}], cioè ${m[c][d] + k}.`],
		answer: pick(rng, writtenOption([String(m[c][d] + k)]), others.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, matrix: m, a, b, c, d, k })
	};
}

type LineCase = 'riga' | 'colonna';

function level2(rng: Rng, family: LineCase): CodeBuilt {
	const [R, C] = rng.pick(SHAPES);
	const m = matrix(rng, R, C, 1, 9);
	const acc = rng.pick(ACCS);
	const byRow = family === 'riga';
	const at0 = byRow ? rng.int(0, R - 1) : rng.int(0, C - 1);
	const element = byRow ? `m[${at0}][j]` : `m[i][${at0}]`;
	const [index, bound] = byRow ? ['j', 'C'] : ['i', 'R'];
	const values = byRow ? m[at0] : column(m, at0);
	const shown = withMatrix(m, {
		python: [`${acc} = 0`, `for ${index} in range(${bound}):`, `    ${acc} = ${acc} + ${element}`, `print(${acc})`],
		cpp: [`int ${acc} = 0;`, `for (int ${index} = 0; ${index} < ${bound}; ${index}++) {`, `    ${acc} = ${acc} + ${element};`, '}', `cout << ${acc} << endl;`],
		out: (x) => [String(sum(byRow ? x[at0] : column(x, at0)))]
	});
	const right = sum(values);
	// the other line with the same index, the line counted from 1, the whole matrix, one element too few, the count
	const others = [
		byRow ? (at0 < C ? sum(column(m, at0)) : null) : at0 < R ? sum(m[at0]) : null,
		byRow ? (at0 + 1 < R ? sum(m[at0 + 1]) : null) : at0 + 1 < C ? sum(column(m, at0 + 1)) : null,
		byRow ? (at0 > 0 ? sum(m[at0 - 1]) : null) : at0 > 0 ? sum(column(m, at0 - 1)) : null,
		sum(m.flat()),
		right - values[values.length - 1],
		values.length
	].filter((x): x is number => x !== null);
	const what = byRow ? `riga di indice ${at0}` : `colonna di indice ${at0}`;
	return {
		prompt: 'Guarda quale dei due indici resta fermo e quale cambia a ogni giro.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: String(right),
		steps: [
			`Nell'elemento ${element} l'indice di ${byRow ? 'riga' : 'colonna'} è sempre ${at0}, mentre ${index} va da 0 a ${values.length - 1}: il ciclo percorre la ${what}.`,
			`Gli elementi della ${what} sono ${values.join(', ')}.`,
			`${acc} parte da 0 e li somma tutti: ${values.join(' + ')} = ${right}.`
		],
		answer: pick(rng, writtenOption([String(right)]), others.map((x) => writtenOption([String(x)]))),
		params: reference(shown, [[]], { ask: 'output', case: family, matrix: m, index: at0 })
	};
}

const NESTED: readonly NestedFamily[] = ['righe', 'colonne', 'conta'];

function level3(rng: Rng, family: NestedFamily): CodeBuilt {
	const [R, C] = rng.pick(SHAPES);
	const m = family === 'conta' ? matrix(rng, R, C, 3, 9) : matrix(rng, R, C, 1, 9);
	const k = rng.int(5, 7);
	const t = nested(family, family === 'conta' ? 'conta' : rng.pick(ACCS), k);
	const shown = withMatrix(m, loops(t.right));
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		t.wrong.map((l) => withMatrix(m, loops(l))),
		[[]]
	)
		.map((p) => written(p)!)
		// an output of a dozen numbers is told apart by its length alone
		.filter((out) => out.length <= Math.max(R, C));
	const byRows = t.right.outer === 'i';
	return {
		prompt: 'Segui i due cicli: quello esterno sceglie la riga o la colonna, quello interno la percorre.',
		problem: 'Che cosa scrive questo programma? Le righe scritte sono separate da virgole.',
		code: texts(shown),
		solution: numbers(rows),
		steps: [
			`Il ciclo esterno muove ${t.right.outer}, quindi sceglie una ${byRows ? 'riga' : 'colonna'} alla volta; quello interno la percorre tutta.`,
			family === 'conta' ? `${t.right.acc} riparte da 0 a ogni riga e sale di 1 per ogni elemento maggiore o uguale a ${k}.` : `${t.right.acc} riparte da 0 a ogni ${byRows ? 'riga' : 'colonna'} e somma i suoi elementi.`,
			`La stampa è dentro il ciclo esterno e fuori da quello interno: una riga scritta per ogni ${byRows ? 'riga' : 'colonna'} della matrice, cioè ${numbers(rows)}.`
		],
		answer: pick(rng, writtenOption(rows), mixed(rng, others).map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, matrix: m, k })
	};
}

function level4(rng: Rng, family: NestedFamily): CodeBuilt {
	const [R, C] = rng.pick(SHAPES);
	const m = family === 'conta' ? matrix(rng, R, C, 3, 9) : matrix(rng, R, C, 1, 9);
	const k = rng.int(5, 7);
	const op = family === 'conta' ? rng.pick(OPS) : '>=';
	const t = nested(family, family === 'conta' ? 'conta' : rng.pick(['somma', 's', 'tot'] as const), k, op);
	const whole = (l: Loops) => ({ loops: loops(l), program: withMatrix(m, loops(l)) });
	const right = whole(t.right);
	// a mistake whose rows are too wide for an option is left out (conta = conta + m[i][j], inside an if)
	const wrong = t.wrong.map(whole).filter((w) => fits(w.loops));
	const kept = wrongPrograms(
		right.program,
		wrong.map((w) => w.program),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong loops for ${family}`);
	const shownOf = (w: { loops: Body }) => ({ python: w.loops.python.join('\n') + '\n', cpp: w.loops.cpp.join('\n') + '\n' });
	const option = (p: Program) => programOption(p, shownOf(p === right.program ? right : wrong.find((w) => w.program === p)!));
	const byRows = t.right.outer === 'i';
	return {
		prompt: "Guarda quale indice muove il ciclo esterno, e dove stanno l'azzeramento e la stampa.",
		problem: `La matrice m ha R righe e C colonne. Quali cicli scrivono ${t.gives}, un numero per riga dello schermo?`,
		solution: `I cicli con ${t.right.outer} nel ciclo esterno, ${t.right.acc} = 0 e la stampa dentro il ciclo esterno e fuori da quello interno.`,
		steps: [
			`Il ciclo esterno sceglie la ${byRows ? 'riga' : 'colonna'}, quindi muove ${t.right.outer}; quello interno muove ${byRows ? 'j' : 'i'}. L'elemento si scrive sempre m[i][j], prima la riga e poi la colonna.`,
			`${t.right.acc} deve ripartire da 0 per ogni ${byRows ? 'riga' : 'colonna'}: l'azzeramento sta nel ciclo esterno, prima di quello interno.`,
			`La stampa va dopo il ciclo interno, ancora dentro quello esterno: così esce un numero per ${byRows ? 'riga' : 'colonna'}.`
		],
		solutionCode: shownOf(right),
		answer: choose(
			rng,
			option(right.program),
			mixed(rng, kept).map((p) => option(p))
		),
		params: reference(right.program, [[]], { case: family, matrix: m, k, op })
	};
}

const DIAGONALS: readonly Diagonal[] = ['principale', 'secondaria'];

function level5(rng: Rng, family: Diagonal): CodeBuilt {
	const N = rng.int(3, 4);
	const m = matrix(rng, N, N, 1, 9);
	const t = diagonal(family, rng.pick(ACCS));
	const shown = withMatrix(m, line(t.right), true);
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		t.wrong.map((l) => withMatrix(m, line(l), true)),
		[[]]
	).map((p) => written(p)!);
	const cells = Array.from({ length: N }, (_, i) => t.right.of(i, N));
	return {
		prompt: 'Scrivi i due indici per ogni valore di i, da 0 a N - 1.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps: [
			`Il ciclo fa ${N} giri, e a ogni giro prende l'elemento m[${t.right.row}][${t.right.col}]: ${cells.map(([r, c]) => `m[${r}][${c}]`).join(', ')}.`,
			`Sono gli elementi della diagonale ${family}, quella che scende dall'angolo in alto a ${family === 'principale' ? 'sinistra' : 'destra'}: ${cells.map(([r, c]) => m[r][c]).join(', ')}.`,
			`La somma è ${cells.map(([r, c]) => m[r][c]).join(' + ')} = ${rows[0]}.`
		],
		answer: pick(rng, writtenOption(rows), mixed(rng, others).map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, matrix: m })
	};
}

type OpenFamily = 'righe' | 'colonne' | 'conta' | 'diagonale';
const OPEN: readonly OpenFamily[] = ['righe', 'colonne', 'conta', 'diagonale'];
const OPEN_SHAPES: readonly [number, number][] = [
	[2, 3],
	[3, 2],
	[2, 4],
	[4, 2],
	[3, 3]
];

function level6(rng: Rng, family: OpenFamily): CodeBuilt {
	const square = family === 'diagonale';
	const N = rng.int(3, 4);
	const [R, C] = square ? [N, N] : rng.pick(OPEN_SHAPES);
	const k = rng.int(4, 7);
	// `s` on a diagonal: with a longer name the row of m[i][N - 1 - i] does not fit an option
	const acc = square ? 's' : family === 'conta' ? 'conta' : 'somma';
	const which: Diagonal = square ? rng.pick(DIAGONALS) : 'principale';
	const bodies = square ? (() => { const t = diagonal(which, acc); return { right: line(t.right), wrong: t.wrong.map(line) }; })() : (() => { const t = nested(family as NestedFamily, acc, k); return { right: loops(t.right), wrong: t.wrong.map(loops) }; })();
	const whole = (body: Body) => ({ body, program: withReading(R, C, body, square) });
	const solution = whole(bodies.right);
	const wrong = bodies.wrong.filter(fits).map(whole);
	// three matrices typed one number per line; the sums of the lines of each are all different
	const tests: string[][] = [];
	for (let tries = 0; tests.length < 3; tries++) {
		if (tries > 200) throw new TooFew('no tests');
		const m = matrix(rng, R, C, 0, 9);
		const lines = [...m.map(sum), ...Array.from({ length: C }, (_, j) => sum(column(m, j))), ...(square ? [sum(m.map((row, i) => row[i])), sum(m.map((row, i) => row[R - 1 - i]))] : [])];
		if (new Set(lines).size === lines.length) tests.push(m.flat().map(String));
	}
	const kept = wrongPrograms(
		solution.program,
		wrong.map((w) => w.program),
		tests
	);
	if (kept.length < 3 || new Set(tests.map((t) => written(solution.program, t)!.join(' '))).size < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const read = reading(R, C, square);
	const here = square ? 'scrivi qui il ciclo e la stampa' : 'scrivi qui i cicli e la stampa';
	const start = { python: [...read.python, `# ${here}`].join('\n') + '\n', cpp: cppProgram([...read.cpp, `// ${here}`].join('\n'), read.before) };
	const shownOf = (w: { body: Body }) => ({ python: w.body.python.join('\n') + '\n', cpp: w.body.cpp.join('\n') + '\n' });
	const option = (p: Program) => programOption(p, shownOf(p === solution.program ? solution : wrong.find((w) => w.program === p)!));
	const asks = square ? `la somma degli elementi della diagonale ${which}` : family === 'conta' ? `quanti elementi di ogni riga della matrice sono maggiori o uguali a ${k}, un numero per riga dello schermo` : family === 'righe' ? 'la somma di ogni riga, una somma per riga dello schermo' : 'la somma di ogni colonna, una somma per riga dello schermo';
	const outer = family === 'colonne' ? 'j' : 'i';
	const lineName = family === 'colonne' ? 'colonna' : 'riga';
	const size = square ? `una matrice quadrata m di ${R} righe e ${C} colonne (N vale ${R})` : `una matrice m di ${R} righe e ${C} colonne (R vale ${R}, C vale ${C})`;
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge ${size}, un numero per riga di tastiera, una riga della matrice dopo l'altra. Scrivi le istruzioni che scrivono ${asks}. La lettura c'è già.`,
		solution: square
			? `Un ciclo con i da 0 a N - 1 che somma in s gli elementi m[${which === 'principale' ? 'i][i' : 'i][N - 1 - i'}], e la stampa dopo il ciclo.`
			: `Due cicli annidati, con ${outer} nel ciclo esterno: ${acc} riparte da 0 e viene scritta una volta per ${lineName}.`,
		steps: square
			? [
					`Gli elementi della diagonale ${which} sono ${which === 'principale' ? 'm[0][0], m[1][1], m[2][2] e così via: i due indici sono uguali' : `m[0][${R - 1}], m[1][${R - 2}], m[2][${R - 3}] e così via: i due indici hanno somma N - 1`}.`,
					`Serve un ciclo solo, con i da 0 a N - 1, che aggiunge a s l'elemento m[${which === 'principale' ? 'i][i' : 'i][N - 1 - i'}].`,
					'La variabile s parte da 0 prima del ciclo e si scrive dopo il ciclo, una volta sola.'
				]
			: [
					`Il ciclo esterno sceglie la ${outer === 'i' ? 'riga con i' : 'colonna con j'}, quello interno la percorre con ${outer === 'i' ? 'j' : 'i'}.`,
					family === 'conta' ? `Dentro il ciclo esterno, prima di quello interno, conta riparte da 0; nel ciclo interno sale di 1 quando m[i][j] >= ${k}.` : `Dentro il ciclo esterno, prima di quello interno, somma riparte da 0; il ciclo interno aggiunge m[i][j].`,
					`Dopo il ciclo interno, ancora dentro quello esterno, il programma scrive ${acc}: una riga dello schermo per ogni ${lineName} della matrice.`
				],
		solutionCode: texts(solution.program),
		answer: programAnswer(solution.program, start, tests),
		choice: choose(
			rng,
			option(solution.program),
			mixed(rng, kept).map((p) => option(p))
		),
		params: reference(solution.program, tests, { case: square ? which : family, rows: R, columns: C, ...(family === 'conta' ? { k } : {}) })
	};
}

export default makeCodeGenerator(ID, 'Le matrici', {
	1: { label: 'Un elemento, due indici', constraints: ['a matrix of different numbers, not square', 'one element read, or one written from another', 'four different outputs'], build: drawn(['legge', 'scrive'] as const, level1) },
	2: { label: 'Una riga o una colonna', constraints: ['one loop that adds one row or one column', 'four different outputs'], build: drawn(['riga', 'colonna'] as const, level2) },
	3: { label: 'Due cicli annidati', constraints: ['two nested loops: sums by rows, sums by columns, counts by rows', 'the wrong outputs are those of the same loops with a mistake'], build: drawn(NESTED, level3) },
	4: { label: 'Scegliere i cicli giusti', constraints: ['four pairs of nested loops, shown without the matrix', 'each wrong one writes something else on the matrix of the sample'], build: drawn(NESTED, level4) },
	5: { label: 'Le due diagonali', constraints: ['a square matrix of 3 or 4 rows', 'one loop on a diagonal', 'four different outputs'], build: drawn(DIAGONALS, level5) },
	6: { label: 'Scrivere i cicli', constraints: ['the matrix is read from the keyboard, and the reading is given', 'graded by running it on three matrices'], build: drawn(OPEN, level6) }
});
