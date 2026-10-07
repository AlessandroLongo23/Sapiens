/**
 * Exercises of the lesson "Confrontare gli algoritmi contando le operazioni" (informatica, third year).
 * Spec: specs/exercises/inf-confronto-algoritmi.md
 *
 * 1. what a program writes whose `ordina` counts comparisons or swaps; 2. best and worst case, as a count and as a
 * vector to recognise; 3. what happens to the count when n doubles; 4. where the counter goes (options that are
 * programs, shown by the body of their function); 5. how much work and how much time; 6. write a program that
 * counts (open answer).
 *
 * The programs are not typed twice. A function is a small tree of statements (`Stmt`), whose expressions carry
 * their text in the two languages and what they are worth; the Python, the C++ and what the program writes all come
 * from the same tree, and a mistake of a distractor is the same tree with the counter somewhere else.
 *
 * Widths. In C++ the inner loop of the bubble sort, `for (int j = 0; j < n - 1 - i; j++) {`, is 37 characters and
 * sits at 8 spaces: 45, more than the 42 of a program under the question. So `j` is declared before the loops
 * (`int i, j;`, or `int i = 0, j;` with the flag) and the loop is `for (j = 0; …`. The options of level 4 show the
 * body of the function without its first row, and those of level 6 the loop that changes, because a counter three
 * levels deep does not fit in 34 characters.
 */
import type { CodeText, Rng } from '../types';
import { choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, shuffle, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-confronto-algoritmi';

// ---------------------------------------------------------------------------------------------------------------
// A program as a tree
// ---------------------------------------------------------------------------------------------------------------

type Lang = 'python' | 'cpp';

/** What a function has while it runs: the vector, its whole variables (a truth value is 1 or 0) and the turns done. */
interface Run {
	v: number[];
	x: Record<string, number>;
	steps: number;
}

interface Expr {
	python: string;
	cpp: string;
	of: (r: Run) => number | boolean;
}

type Stmt =
	| { kind: 'set'; name: string; value: Expr; type?: 'int' | 'bool'; cpp?: string }
	| { kind: 'put'; index: Expr; value: Expr }
	| { kind: 'for'; name: string; from?: Expr; to: Expr; body: Stmt[]; bare?: boolean }
	| { kind: 'while'; cond: Expr; body: Stmt[] }
	| { kind: 'if'; cond: Expr; then: Stmt[]; else?: Stmt[] }
	| { kind: 'return'; value: Expr }
	| { kind: 'print'; value: Expr }
	| { kind: 'only'; python?: string; cpp?: string };

const toCpp = (python: string) =>
	python
		.replace(/ and /g, ' && ')
		.replace(/\bnot /g, '!')
		.replace(/\/\//g, '/')
		.replace(/\bTrue\b/g, 'true')
		.replace(/\bFalse\b/g, 'false')
		.replace(/len\(v\)/g, 'n');

const ex = (python: string, of: Expr['of'], cpp = toCpp(python)): Expr => ({ python, cpp, of });
const num = (k: number) => ex(String(k), () => k);
const va = (name: string) => ex(name, (r) => r.x[name]);

/** An element of the vector: outside it the program stops, in the two languages alike as far as an exercise goes. */
function at(r: Run, i: number): number {
	if (!Number.isInteger(i) || i < 0 || i >= r.v.length) throw new Error('outside the vector');
	return r.v[i];
}
const el = (index: Expr) => ex(`v[${index.python}]`, (r) => at(r, Number(index.of(r))), `v[${index.cpp}]`);
const plus = (name: string, what: Expr) => ex(`${name} + ${what.python}`, (r) => r.x[name] + Number(what.of(r)), `${name} + ${what.cpp}`);

type Sign = '>' | '<' | '==' | '!=';
const cmp = (a: Expr, sign: Sign, b: Expr) =>
	ex(
		`${a.python} ${sign} ${b.python}`,
		(r) => {
			const p = Number(a.of(r));
			const q = Number(b.of(r));
			return sign === '>' ? p > q : sign === '<' ? p < q : sign === '==' ? p === q : p !== q;
		},
		`${a.cpp} ${sign} ${b.cpp}`
	);

const set = (name: string, value: Expr, type?: 'int' | 'bool', cpp?: string): Stmt => ({ kind: 'set', name, value, type, cpp });
const put = (index: Expr, value: Expr): Stmt => ({ kind: 'put', index, value });
const loop = (name: string, to: Expr, body: Stmt[], o: { from?: Expr; bare?: boolean } = {}): Stmt => ({ kind: 'for', name, to, body, ...o });
const during = (cond: Expr, body: Stmt[]): Stmt => ({ kind: 'while', cond, body });
const when = (cond: Expr, then: Stmt[], otherwise?: Stmt[]): Stmt => ({ kind: 'if', cond, then, else: otherwise });
const give = (value: Expr): Stmt => ({ kind: 'return', value });
const say = (value: Expr): Stmt => ({ kind: 'print', value });
const only = (row: { python?: string; cpp?: string }): Stmt => ({ kind: 'only', ...row });

/** The rows of some statements in one language, indented by `depth` levels of four spaces. */
function rows(stmts: Stmt[], lang: Lang, depth = 0): string[] {
	const pad = '    '.repeat(depth);
	const py = lang === 'python';
	const out: string[] = [];
	const block = (python: string, cpp: string, body: Stmt[], closed = true) => {
		out.push(pad + (py ? `${python}:` : `${cpp} {`), ...rows(body, lang, depth + 1));
		if (!py && closed) out.push(`${pad}}`);
	};
	for (const s of stmts) {
		if (s.kind === 'set') out.push(pad + (py ? `${s.name} = ${s.value.python}` : (s.cpp ?? `${s.type ? `${s.type} ` : ''}${s.name} = ${s.value.cpp};`)));
		else if (s.kind === 'put') out.push(pad + (py ? `v[${s.index.python}] = ${s.value.python}` : `v[${s.index.cpp}] = ${s.value.cpp};`));
		else if (s.kind === 'for') block(`for ${s.name} in range(${s.from ? `${s.from.python}, ` : ''}${s.to.python})`, `for (${s.bare ? '' : 'int '}${s.name} = ${s.from?.cpp ?? '0'}; ${s.name} < ${s.to.cpp}; ${s.name}++)`, s.body);
		else if (s.kind === 'while') block(`while ${s.cond.python}`, `while (${s.cond.cpp})`, s.body);
		else if (s.kind === 'if') {
			block(`if ${s.cond.python}`, `if (${s.cond.cpp})`, s.then, !s.else);
			if (s.else) block('else', '} else', s.else);
		} else if (s.kind === 'return') out.push(pad + (py ? `return ${s.value.python}` : `return ${s.value.cpp};`));
		else if (s.kind === 'print') out.push(pad + (py ? `print(${s.value.python})` : `cout << ${s.value.cpp} << endl;`));
		else if (s[lang] !== undefined) out.push(pad + s[lang]);
	}
	return out;
}

const text = (stmts: Stmt[], depth = 0): CodeText => ({ python: rows(stmts, 'python', depth).join('\n') + '\n', cpp: rows(stmts, 'cpp', depth).join('\n') + '\n' });

/** Runs some statements: what a `return` gives back, or null when none was met. A loop that never ends throws. */
function exec(stmts: Stmt[], r: Run, out: string[]): number | null {
	const turn = () => {
		if (++r.steps > 100_000) throw new Error('never ends');
	};
	for (const s of stmts) {
		if (s.kind === 'set') r.x[s.name] = Number(s.value.of(r));
		else if (s.kind === 'put') {
			const i = Number(s.index.of(r));
			const value = Number(s.value.of(r));
			at(r, i);
			r.v[i] = value;
		} else if (s.kind === 'for') {
			const to = Number(s.to.of(r));
			for (let k = s.from ? Number(s.from.of(r)) : 0; k < to; k++) {
				turn();
				r.x[s.name] = k;
				const got = exec(s.body, r, out);
				if (got !== null) return got;
			}
		} else if (s.kind === 'while') {
			while (s.cond.of(r)) {
				turn();
				const got = exec(s.body, r, out);
				if (got !== null) return got;
			}
		} else if (s.kind === 'if') {
			const got = exec(s.cond.of(r) ? s.then : (s.else ?? []), r, out);
			if (got !== null) return got;
		} else if (s.kind === 'return') return Number(s.value.of(r));
		else if (s.kind === 'print') out.push(String(Number(s.value.of(r))));
	}
	return null;
}

/** A function that gives back a whole number. With a vector, C++ receives its length too, and Python reads it. */
interface Fn {
	name: string;
	params: CodeText;
	body: Stmt[];
}

const fnText = (f: Fn): CodeText => ({
	python: [`def ${f.name}(${f.params.python}):`, ...rows(f.body, 'python', 1)].join('\n') + '\n',
	cpp: [`int ${f.name}(${f.params.cpp}) {`, ...rows(f.body, 'cpp', 1), '}'].join('\n') + '\n'
});

function call(f: Fn, v: readonly number[], x: Record<string, number> = {}): number {
	const got = exec(f.body, { v: [...v], x: { n: v.length, ...x }, steps: 0 }, []);
	if (got === null) throw new Error(`${f.name} gives nothing back`);
	return got;
}

/** One call of a function in the program that tries it: the vector, the value looked for, or the number alone. */
interface Call {
	v?: number[];
	x?: number;
	n?: number;
}

const given = (c: Call): Record<string, number> => ({ ...(c.x === undefined ? {} : { x: c.x }), ...(c.n === undefined ? {} : { n: c.n }) });

/** The whole program around a function: one row written for each call. In C++ each vector is an array with a name. */
function trial(f: Fn, calls: Call[]): Program {
	const arrays: number[][] = [];
	const nameOf = (v: number[]) => {
		let k = arrays.findIndex((a) => a.join() === v.join());
		if (k < 0) k = arrays.push(v) - 1;
		return 'abc'[k];
	};
	const rest = (c: Call) => [c.x, c.n].filter((value) => value !== undefined);
	const python = calls.map((c) => `print(${f.name}(${[...(c.v ? [pyList(c.v)] : []), ...rest(c)].join(', ')}))`);
	const couts = calls.map((c) => `cout << ${f.name}(${[...(c.v ? [nameOf(c.v), c.v.length] : []), ...rest(c)].join(', ')}) << endl;`);
	const cpp = [...arrays.map((a, k) => `int ${'abc'[k]}[${a.length}] = ${cppList(a)};`), ...couts];
	const shown = fnText(f);
	return program(`${shown.python}\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), shown.cpp), () => calls.map((c) => String(call(f, c.v ?? [], given(c)))));
}

// ---------------------------------------------------------------------------------------------------------------
// The algorithms of the chapter, each with a counter that can be put in the wrong place
// ---------------------------------------------------------------------------------------------------------------

const TRUE = ex('True', () => true);
const FALSE = ex('False', () => false);
const J = va('j');
const J1 = ex('j + 1', (r) => r.x.j + 1);
const I = va('i');
const swap = (a: Expr, b: Expr): Stmt[] => [set('temp', el(a), 'int'), put(a, el(b)), put(b, va('temp'))];

/** The counter of an algorithm: its name, where it goes up (one place or more), by how much, and where it starts. */
interface Counter<Spot extends string> {
	name: string;
	at: Spot | Spot[];
	by?: Expr;
	start?: number;
	/** set back to zero at every turn of the loop that counts */
	reset?: boolean;
}

function counting<Spot extends string>(c: Counter<Spot>) {
	const up = set(c.name, plus(c.name, c.by ?? num(1)));
	return {
		first: set(c.name, num(c.start ?? 0), 'int'),
		here: (spot: Spot): Stmt[] => ((Array.isArray(c.at) ? c.at : [c.at]).includes(spot) ? [up] : []),
		reset: c.reset ? [set(c.name, num(0))] : [],
		value: va(c.name)
	};
}

type BubbleSpot = 'before' | 'inside' | 'else' | 'outer';

interface Bubble extends Counter<BubbleSpot> {
	flag: boolean;
	/** the flag never goes up, or goes up at every comparison */
	raise?: 'never' | 'always';
	sign?: Sign;
}

/** The bubble sort with all its turns, or with the flag that stops it at the first turn without a swap. */
function bubble(o: Bubble): Stmt[] {
	const c = counting(o);
	const raise = set('scambiato', TRUE);
	const then = [...swap(J, J1), ...c.here('inside'), ...(o.flag && !o.raise ? [raise] : [])];
	const otherwise = c.here('else');
	const inner = loop(
		'j',
		ex('n - 1 - i', (r) => r.x.n - 1 - r.x.i),
		[...c.here('before'), when(cmp(el(J), o.sign ?? '>', el(J1)), then, otherwise.length ? otherwise : undefined), ...(o.flag && o.raise === 'always' ? [raise] : [])],
		{ bare: true }
	);
	if (!o.flag) {
		const turns = loop(
			'i',
			ex('n - 1', (r) => r.x.n - 1),
			[...c.here('outer'), inner],
			{ bare: true }
		);
		return [c.first, only({ cpp: 'int i, j;' }), turns];
	}
	const more = ex('i < n - 1 and scambiato', (r) => r.x.i < r.x.n - 1 && r.x.scambiato === 1);
	return [c.first, set('i', num(0), 'int', 'int i = 0, j;'), set('scambiato', TRUE, 'bool'), during(more, [set('scambiato', FALSE), ...c.here('outer'), inner, set('i', plus('i', num(1)))])];
}

type SelectionSpot = 'inner' | 'update' | 'swap' | 'outer';

function selection(o: Counter<SelectionSpot>): Stmt[] {
	const c = counting(o);
	const imin = va('imin');
	const search = loop('j', va('n'), [...c.here('inner'), when(cmp(el(J), '<', el(imin)), [set('imin', J), ...c.here('update')])], { from: ex('i + 1', (r) => r.x.i + 1) });
	return [
		c.first,
		loop(
			'i',
			ex('n - 1', (r) => r.x.n - 1),
			[set('imin', I, 'int'), search, when(cmp(imin, '!=', I), [...swap(I, imin), ...c.here('swap')]), ...c.here('outer')]
		)
	];
}

type InsertionSpot = 'before' | 'shift' | 'after';

function insertion(o: Counter<InsertionSpot>): Stmt[] {
	const c = counting(o);
	const larger = ex('j >= 0 and v[j] > x', (r) => r.x.j >= 0 && at(r, r.x.j) > r.x.x);
	const shifts = during(larger, [put(J1, el(J)), set('j', ex('j - 1', (r) => r.x.j - 1)), ...c.here('shift')]);
	const body = [
		set('x', el(I), 'int'),
		set(
			'j',
			ex('i - 1', (r) => r.x.i - 1),
			'int'
		),
		...c.here('before'),
		shifts,
		put(J1, va('x')),
		...c.here('after')
	];
	return [c.first, loop('i', va('n'), body, { from: num(1) })];
}

/** `ordina(v)`: a sort that gives back its counter. */
const sorter = (body: Stmt[], counter: string): Fn => ({ name: 'ordina', params: { python: 'v', cpp: 'int v[], int n' }, body: [only({ python: 'n = len(v)' }), ...body, give(va(counter))] });

type GiroSpot = 'before' | 'inside' | 'else' | 'after';

/** `giro(v)`: one turn of the bubble sort over the whole vector, which gives back its counter (or `gives`). */
function giro(o: Counter<GiroSpot> & { gives?: Expr }): Fn {
	const c = counting(o);
	const otherwise = c.here('else');
	const pairs = loop(
		'j',
		ex('n - 1', (r) => r.x.n - 1),
		[...c.reset, ...c.here('before'), when(cmp(el(J), '>', el(J1)), [...swap(J, J1), ...c.here('inside')], otherwise.length ? otherwise : undefined)]
	);
	return { name: 'giro', params: { python: 'v', cpp: 'int v[], int n' }, body: [only({ python: 'n = len(v)' }), c.first, pairs, ...c.here('after'), give(o.gives ?? c.value)] };
}

type SearchSpot = 'before' | 'inside' | 'afterif' | 'afterloop';

/** `cerca(v, x)`: the sequential search, which gives back the comparisons made until it finds x or reaches the end. */
function search(o: Omit<Counter<SearchSpot>, 'name'>): Fn {
	const c = counting({ ...o, name: 'confronti' });
	const all = loop(
		'i',
		ex('len(v)', (r) => r.x.n),
		[...c.here('before'), when(cmp(el(I), '==', va('x')), [...c.here('inside'), give(c.value)]), ...c.here('afterif')]
	);
	return { name: 'cerca', params: { python: 'v, x', cpp: 'int v[], int n, int x' }, body: [c.first, all, ...c.here('afterloop'), give(c.value)] };
}

type HalvingSpot = 'in' | 'after';

interface Halving extends Omit<Counter<HalvingSpot>, 'name'> {
	/** the loop goes on while n is above this: 0, or 1 for who stops one halving early */
	above?: number;
	gives?: Expr;
}

/** How many times n can be halved before it gets to 0: the statements, closed by `end` (a `return` or a `print`). */
function halving(o: Halving, end: (value: Expr) => Stmt): Stmt[] {
	const c = counting({ ...o, name: 'confronti' });
	const above = o.above ?? 0;
	const halve = set(
		'n',
		ex('n // 2', (r) => Math.floor(r.x.n / 2))
	);
	return [c.first, during(cmp(va('n'), '>', num(above)), [...c.reset, ...c.here('in'), halve]), ...c.here('after'), end(o.gives ?? c.value)];
}

const halver = (o: Halving): Fn => ({ name: 'confronti_binaria', params: { python: 'n', cpp: 'int n' }, body: halving(o, give) });

// ---------------------------------------------------------------------------------------------------------------
// Numbers, vectors and words
// ---------------------------------------------------------------------------------------------------------------

/** How many times n can be halved, with the whole division, before it gets to 0. */
function halvings(n: number): number {
	let count = 0;
	for (let k = n; k > 0; k = Math.floor(k / 2)) count++;
	return count;
}

const pairsOf = (n: number) => (n * (n - 1)) / 2;

/** A whole number as the lessons write it: the thousands apart from five digits on. */
const digits = (n: number) => (n >= 10_000 ? String(n).replace(/\B(?=(\d{3})+$)/g, '\\,') : String(n));
const big = (n: number) => `$${digits(n)}$`;
const numberOption = (n: number, label = big(n)) => textOption(label, String(n));

const listed = (xs: readonly (string | number)[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}` : String(xs[0]));
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** `size` different numbers between `lo` and `hi`, in rising order. */
function distinct(rng: Rng, size: number, lo: number, hi: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(lo, hi);
		if (!v.includes(x)) v.push(x);
	}
	return v.sort((a, b) => a - b);
}

type Order = 'ordine' | 'rovescio' | 'quasi' | 'caso';

const sorted = (v: readonly number[]) => v.every((x, i) => i === 0 || v[i - 1] < x);
const reversed = (v: readonly number[]) => v.every((x, i) => i === 0 || v[i - 1] > x);

/** The same values in one of the orders of the lesson: rising, falling, rising but for two neighbours, or any other. */
function arranged(rng: Rng, order: Order, values: readonly number[]): number[] {
	const v = [...values];
	if (order === 'rovescio') return v.reverse();
	if (order === 'quasi') {
		const k = rng.int(0, v.length - 2);
		[v[k], v[k + 1]] = [v[k + 1], v[k]];
		return v;
	}
	if (order === 'ordine') return v;
	for (;;) {
		const mixed = shuffle(rng, v);
		if (!sorted(mixed) && !reversed(mixed)) return mixed;
	}
}

function weighted<T>(rng: Rng, shares: readonly (readonly [T, number])[]): T {
	let left = rng.next() * shares.reduce((sum, [, share]) => sum + share, 0);
	for (const [value, share] of shares) {
		left -= share;
		if (left < 0) return value;
	}
	return shares[shares.length - 1][0];
}

/** The turns of the bubble sort on a vector, each with its comparisons and its swaps: for the worked steps. */
function turnsOf(vector: readonly number[], flag: boolean): { confronti: number; scambi: number }[] {
	const v = [...vector];
	const turns: { confronti: number; scambi: number }[] = [];
	for (let i = 0; i < v.length - 1; i++) {
		const turn = { confronti: 0, scambi: 0 };
		for (let j = 0; j < v.length - 1 - i; j++) {
			turn.confronti++;
			if (v[j] > v[j + 1]) {
				[v[j], v[j + 1]] = [v[j + 1], v[j]];
				turn.scambi++;
			}
		}
		turns.push(turn);
		if (flag && turn.scambi === 0) break;
	}
	return turns;
}

/** The turns of the selection sort that end with a swap. */
function swapsOf(vector: readonly number[]): number[] {
	const v = [...vector];
	const at: number[] = [];
	for (let i = 0; i < v.length - 1; i++) {
		const imin = v.indexOf(Math.min(...v.slice(i)), i);
		if (imin !== i) {
			[v[i], v[imin]] = [v[imin], v[i]];
			at.push(i);
		}
	}
	return at;
}

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one. The
 * family is drawn once, before, so that the shares of the families do not move. After forty draws the error is the
 * generator's.
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

const SUM = '$\\frac{n(n - 1)}{2}$';
const sumOf = (n: number) => `$\\frac{${n} \\cdot ${n - 1}}{2} = ${pairsOf(n)}$`;

// ---------------------------------------------------------------------------------------------------------------
// Level 1: what a program that counts writes
// ---------------------------------------------------------------------------------------------------------------

type Counted = 'bolle-confronti' | 'bolle-scambi' | 'bandierina-confronti' | 'selezione-confronti' | 'selezione-scambi';
const COUNTED: readonly Counted[] = ['bolle-confronti', 'bolle-scambi', 'bandierina-confronti', 'selezione-confronti', 'selezione-scambi'];

const ORDERS_FLAG = [
	['ordine', 25],
	['quasi', 30],
	['caso', 35],
	['rovescio', 10]
] as const;
const ORDERS_PLAIN = [
	['caso', 50],
	['rovescio', 20],
	['ordine', 15],
	['quasi', 15]
] as const;

function level1(rng: Rng, family: Counted): CodeBuilt {
	const order = weighted<Order>(rng, family === 'bandierina-confronti' ? ORDERS_FLAG : ORDERS_PLAIN);
	const v = arranged(rng, order, distinct(rng, rng.int(4, 6), 2, 29));
	const n = v.length;
	const [algorithm, what] = family.split('-') as ['bolle' | 'bandierina' | 'selezione', 'confronti' | 'scambi'];
	const bubbled = (at: BubbleSpot, flag = algorithm === 'bandierina') => sorter(bubble({ name: what, at, flag }), what);
	const selected = (at: SelectionSpot) => sorter(selection({ name: what, at }), what);
	const right = algorithm === 'selezione' ? selected(what === 'confronti' ? 'inner' : 'swap') : bubbled(what === 'confronti' ? 'before' : 'inside');
	const shown = trial(right, [{ v }]);
	const written1 = written(shown)!;
	const answer = Number(written1[0]);
	const turns = turnsOf(v, algorithm === 'bandierina');
	// what the same function gives with the counter somewhere else, and what a student says without following it
	const guesses: number[] =
		family === 'bolle-confronti'
			? [call(bubbled('inside'), v), n - 1, (n - 1) * (n - 1), n * n, n]
			: family === 'bolle-scambi'
				? [call(bubbled('before'), v), n - 1, call(bubbled('else'), v), n, answer + 1]
				: family === 'bandierina-confronti'
					? [pairsOf(n), call(bubbled('inside'), v), call(bubbled('outer'), v), n - 1, n]
					: family === 'selezione-confronti'
						? [call(selected('swap'), v), n - 1, call(selected('update'), v), n * n, (n - 1) * (n - 1)]
						: [n - 1, pairsOf(n), call(selected('update'), v), call(bubbled('inside', false), v), n];
	const down = Array.from({ length: n - 1 }, (_, i) => n - 1 - i);
	const steps =
		family === 'bolle-confronti' || family === 'selezione-confronti'
			? [
					`Il contatore aumenta nel ciclo interno, prima della selezione: conta ogni confronto${algorithm === 'selezione' ? ' tra v[j] e v[imin]' : ', anche quando lo scambio non c’è'}.`,
					`Con ${n} elementi i giri del ciclo esterno fanno ${listed(down)} confronti: in tutto ${answer}.`,
					`Il conto non dipende dall’ordine dei valori: è ${SUM} con $n = ${n}$.`
				]
			: family === 'bolle-scambi'
				? ['Il contatore è dentro la selezione, accanto allo scambio: aumenta solo quando due vicini sono fuori ordine.', `Giro per giro gli scambi sono ${listed(turns.map((t) => t.scambi))}: in tutto ${answer}.`]
				: family === 'bandierina-confronti'
					? [
							'Il contatore aumenta nel ciclo interno, prima della selezione: conta ogni confronto.',
							turns[turns.length - 1].scambi === 0
								? `${turns.length === 1 ? `Il primo giro fa ${turns[0].confronti} confronti e nessuno scambio` : `I giri fanno ${listed(turns.map((t) => t.confronti))} confronti e l’ultimo non scambia niente`}: la bandierina resta falsa e il ciclo si ferma.`
								: `I giri fanno ${listed(turns.map((t) => t.confronti))} confronti: in ognuno c’è almeno uno scambio, e la bandierina non ferma mai il ciclo.`,
							`In tutto ${answer} confronti.`
						]
					: ['Il contatore è nella selezione imin != i: aumenta solo quando il minimo trovato non è già al posto i.', answer ? `Succede nei giri con i uguale a ${listed(swapsOf(v))}: ${answer === 1 ? 'uno scambio' : `${answer} scambi`}.` : 'Il vettore è già in ordine e non succede mai: 0 scambi.'];
	return {
		prompt: 'Guarda dove aumenta il contatore.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: written1.join(', '),
		steps,
		answer: pick(
			rng,
			writtenOption(written1),
			guesses.map((g) => writtenOption([String(g)]))
		),
		params: reference(shown, [[]], { ask: 'output', case: family, vector: v })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 2: best case and worst case
// ---------------------------------------------------------------------------------------------------------------

type Sort = 'selezione' | 'bolle' | 'bandierina' | 'inserimento';
type Quantity = 'confronti' | 'scambi' | 'spostamenti';

const SORTS: Record<Sort, string> = {
	selezione: 'l’ordinamento per selezione',
	bolle: 'l’ordinamento a bolle senza bandierina',
	bandierina: 'l’ordinamento a bolle con la bandierina',
	inserimento: 'l’ordinamento per inserimento'
};

/** What a sort counts on a vector, by running the function of level 1 with the counter in its place. */
function counted(sort: Sort, quantity: Quantity, v: readonly number[]): number {
	if (sort === 'selezione') return call(sorter(selection({ name: 'c', at: quantity === 'confronti' ? 'inner' : 'swap' }), 'c'), v);
	if (sort === 'inserimento') {
		if (quantity === 'spostamenti') return call(sorter(insertion({ name: 'c', at: 'shift' }), 'c'), v);
		// a comparison for each shift, and one more when an element that is not larger stops the search
		let count = 0;
		const w = [...v];
		for (let i = 1; i < w.length; i++) {
			const x = w[i];
			let j = i - 1;
			while (j >= 0) {
				count++;
				if (w[j] <= x) break;
				w[j + 1] = w[j];
				j--;
			}
			w[j + 1] = x;
		}
		return count;
	}
	return call(sorter(bubble({ name: 'c', at: quantity === 'confronti' ? 'before' : 'inside', flag: sort === 'bandierina' }), 'c'), v);
}

interface Tally {
	sort: Sort;
	quantity: Quantity;
	order: 'ordine' | 'rovescio';
	of: (n: number) => number;
	why: (n: number) => string[];
}

const turnsSum = (n: number) => `I giri fanno $${n - 1}$, $${n - 2}$ e così via fino a $1$: in tutto ${sumOf(n)}.`;

const TALLIES: readonly Tally[] = (['ordine', 'rovescio'] as const).flatMap((order): Tally[] => {
	const up = order === 'ordine';
	const all = (sort: Sort, first: string): Tally => ({ sort, quantity: 'confronti', order, of: pairsOf, why: (n) => [first, turnsSum(n)] });
	const none = (sort: Sort, quantity: Quantity, first: string): Tally => ({ sort, quantity, order, of: () => 0, why: () => [first, `Il contatore resta a 0: nessuno ${quantity === 'scambi' ? 'scambio' : 'spostamento'}.`] });
	const each = (sort: Sort, quantity: Quantity, first: string): Tally => ({ sort, quantity, order, of: pairsOf, why: (n) => [first, `I confronti sono ${sumOf(n)}, e ${quantity === 'scambi' ? 'gli scambi' : 'gli spostamenti'} altrettanti.`] });
	return [
		all('selezione', 'L’ordinamento per selezione cerca il minimo tra gli elementi rimasti qualunque sia l’ordine di partenza: fa sempre gli stessi confronti.'),
		all('bolle', 'Senza bandierina l’ordinamento a bolle fa tutti i giri, qualunque sia l’ordine di partenza.'),
		up
			? { sort: 'bandierina', quantity: 'confronti', order, of: (n) => n - 1, why: (n) => [`Il primo giro confronta le $${n - 1}$ coppie di vicini e non scambia niente.`, `La bandierina resta falsa e non ci sono altri giri: $${n - 1}$ confronti. È il caso migliore.`] }
			: all('bandierina', 'In un vettore rovesciato ogni giro fa almeno uno scambio, e la bandierina non ferma mai i giri: è il caso peggiore.'),
		up
			? {
					sort: 'inserimento',
					quantity: 'confronti',
					order,
					of: (n) => n - 1,
					why: (n) => ['Ogni elemento, dal secondo in poi, viene confrontato una volta sola: con il vicino di sinistra, che non è più grande.', `Gli elementi dal secondo in poi sono $${n - 1}$: $${n - 1}$ confronti. È il caso migliore.`]
				}
			: { sort: 'inserimento', quantity: 'confronti', order, of: pairsOf, why: (n) => ['Ogni elemento è più piccolo di tutti quelli alla sua sinistra: quello di indice i fa i confronti.', `In tutto $1 + 2 + \\dots + ${n - 1}$, cioè ${sumOf(n)}. È il caso peggiore.`] },
		...(up
			? [
					none('selezione', 'scambi', 'In un vettore in ordine il minimo della parte rimasta è già al suo posto a ogni giro: imin resta uguale a i.'),
					none('bolle', 'scambi', 'In un vettore in ordine nessuna coppia di vicini è fuori ordine.'),
					none('bandierina', 'scambi', 'In un vettore in ordine nessuna coppia di vicini è fuori ordine.'),
					none('inserimento', 'spostamenti', 'In un vettore in ordine nessun elemento ha alla sua sinistra un elemento più grande.')
				]
			: [
					each('bolle', 'scambi', 'In un vettore rovesciato ogni confronto trova due vicini fuori ordine: uno scambio per ogni confronto.'),
					each('bandierina', 'scambi', 'In un vettore rovesciato ogni confronto trova due vicini fuori ordine: uno scambio per ogni confronto.'),
					each('inserimento', 'spostamenti', 'In un vettore rovesciato ogni elemento fa spostare tutti quelli alla sua sinistra, e li confronta tutti.')
				])
	];
});

type Where = 'primo' | 'ultimo' | 'assente' | 'binaria';
const SEARCHES: readonly Where[] = ['primo', 'ultimo', 'assente', 'binaria'];

const chain = (n: number) => {
	const xs: number[] = [];
	for (let k = Math.floor(n / 2); k > 0; k = Math.floor(k / 2)) xs.push(k);
	return [n, ...xs, 0];
};

function tally(rng: Rng): CodeBuilt {
	const k = rng.int(0, TALLIES.length + SEARCHES.length - 1);
	if (k >= TALLIES.length) {
		const where = SEARCHES[k - TALLIES.length];
		if (where === 'binaria') {
			const n = rng.int(20, 1000);
			const right = halvings(n);
			return {
				prompt: 'Pensa a che cosa scarta ogni confronto.',
				problem: `Un vettore ordinato ha ${n} elementi. Quanti confronti fa, al massimo, la ricerca binaria per cercare un valore?`,
				solution: `${right} confronti`,
				steps: ['A ogni confronto la ricerca binaria scarta metà di quello che resta.', `Con la divisione intera $n$ si dimezza così: ${chain(n).join(', ')}. Sono ${right} dimezzamenti prima di arrivare a 0, quindi al massimo ${right} confronti.`],
				answer: pick(
					rng,
					numberOption(right),
					[n, Math.floor(n / 2), 1, right * 2].map((x) => numberOption(x))
				),
				params: { case: 'conto', algorithm: 'binaria', quantity: 'confronti', order: 'peggiore', n }
			};
		}
		const n = rng.int(10, 200);
		const right = where === 'primo' ? 1 : n;
		const says = { primo: 'è il primo elemento', ultimo: 'è l’ultimo elemento', assente: 'nel vettore non c’è' }[where];
		return {
			prompt: 'Pensa a quali elementi guarda la ricerca, e in che ordine.',
			problem: `In un vettore di ${n} elementi diversi cerchi con la ricerca sequenziale un valore che ${says}. Quanti confronti servono?`,
			solution: right === 1 ? 'Un confronto' : `${right} confronti`,
			steps:
				where === 'primo'
					? ['La ricerca sequenziale guarda gli elementi uno alla volta, a partire dal primo.', 'Il valore è proprio il primo: lo trova al primo confronto. È il caso migliore.']
					: ['La ricerca sequenziale guarda gli elementi uno alla volta, a partire dal primo.', `Per ${where === 'ultimo' ? 'arrivare all’ultimo' : 'accorgersi che il valore non c’è'} li deve confrontare tutti: ${n} confronti. È il caso peggiore.`],
			answer: pick(
				rng,
				numberOption(right),
				(where === 'primo' ? [n, halvings(n), 0, n - 1] : where === 'ultimo' ? [1, halvings(n), n - 1, 0] : [0, halvings(n), 1, n - 1]).map((x) => numberOption(x))
			),
			params: { case: 'conto', algorithm: 'sequenziale', quantity: 'confronti', order: where, n }
		};
	}
	const t = TALLIES[k];
	const n = rng.int(6, 30);
	const right = t.of(n);
	const others = right === 0 ? [n - 1, pairsOf(n), n, 1] : right === n - 1 ? [pairsOf(n), 0, n, 1] : [n - 1, n * n, n, 0];
	return {
		prompt: 'Pensa a come lavora l’algoritmo su un vettore fatto così.',
		problem: `Un vettore di ${n} elementi diversi è ${t.order === 'ordine' ? 'già in ordine crescente' : 'rovesciato, cioè in ordine decrescente'}. Quanti ${t.quantity} fa su questo vettore ${SORTS[t.sort]}?`,
		solution: `${right} ${t.quantity}`,
		steps: t.why(n),
		answer: pick(
			rng,
			numberOption(right),
			others.map((x) => numberOption(x))
		),
		params: { case: 'conto', algorithm: t.sort, quantity: t.quantity, order: t.order, n }
	};
}

interface Extreme {
	sort: Sort;
	quantity: Quantity;
	direction: 'meno' | 'più';
	/** why, when the three vectors do not count the same */
	why?: string;
}

const EXTREMES: readonly Extreme[] = [
	{ sort: 'selezione', quantity: 'confronti', direction: 'meno' },
	{ sort: 'selezione', quantity: 'confronti', direction: 'più' },
	{ sort: 'bolle', quantity: 'confronti', direction: 'meno' },
	{ sort: 'bolle', quantity: 'confronti', direction: 'più' },
	{ sort: 'bandierina', quantity: 'confronti', direction: 'meno', why: 'Sul vettore già in ordine il primo giro non scambia niente e la bandierina ferma tutto: è il caso migliore.' },
	{ sort: 'bandierina', quantity: 'confronti', direction: 'più', why: 'Sul vettore rovesciato ogni giro fa almeno uno scambio e la bandierina non ferma mai i giri: è il caso peggiore.' },
	{ sort: 'bolle', quantity: 'scambi', direction: 'meno', why: 'Sul vettore già in ordine nessuna coppia di vicini è fuori ordine: nessuno scambio.' },
	{ sort: 'bolle', quantity: 'scambi', direction: 'più', why: 'Sul vettore rovesciato ogni confronto trova due vicini fuori ordine: uno scambio per ogni confronto.' },
	{ sort: 'inserimento', quantity: 'confronti', direction: 'meno', why: 'Sul vettore già in ordine ogni elemento fa un solo confronto, con il vicino di sinistra, e resta dov’è: è il caso migliore.' },
	{ sort: 'inserimento', quantity: 'confronti', direction: 'più', why: 'Sul vettore rovesciato ogni elemento è più piccolo di tutti quelli alla sua sinistra e viene confrontato con tutti: è il caso peggiore.' },
	{ sort: 'inserimento', quantity: 'spostamenti', direction: 'meno', why: 'Sul vettore già in ordine nessun elemento ha a sinistra un elemento più grande: niente si sposta.' },
	{ sort: 'inserimento', quantity: 'spostamenti', direction: 'più', why: 'Sul vettore rovesciato ogni elemento fa spostare tutti quelli alla sua sinistra.' },
	{ sort: 'selezione', quantity: 'scambi', direction: 'meno', why: 'Sul vettore già in ordine il minimo della parte rimasta è sempre già al suo posto: nessuno scambio.' }
];

const SAME = 'uguali';

function extreme(rng: Rng): CodeBuilt {
	const e = rng.pick(EXTREMES);
	const values = distinct(rng, rng.int(5, 6), 1, 30);
	const up = [...values];
	const down = [...values].reverse();
	for (let tries = 0; tries < 60; tries++) {
		const mixed = arranged(rng, 'caso', values);
		const counts = [up, down, mixed].map((v) => counted(e.sort, e.quantity, v));
		const best = e.direction === 'meno' ? Math.min(...counts) : Math.max(...counts);
		const same = counts.every((c) => c === counts[0]);
		// one vector alone at the extreme, and never the mixed one: its count would have to be worked out by hand
		if (!same && (counts.filter((c) => c === best).length > 1 || counts[2] === best)) continue;
		if (same !== !e.why) throw new Error(`${ID}: ${e.sort} ${e.quantity} is not what the lesson says`);
		const option = (v: number[]) => textOption(v.join(', '));
		const tie = textOption('Ne fa lo stesso numero su tutti e tre', SAME);
		const options = [option(up), option(down), option(mixed), tie];
		const right = same ? 3 : counts.indexOf(best);
		return {
			prompt: 'Pensa a come lavora l’algoritmo su ognuno dei tre vettori.',
			problem: `Su quale di questi vettori ${SORTS[e.sort]} fa ${e.direction} ${e.quantity}?`,
			solution: same ? 'Ne fa lo stesso numero su tutti e tre.' : `Sul vettore ${right === 0 ? 'già in ordine' : 'rovesciato'}: ${options[right].latex}.`,
			steps: same
				? [`${cap(SORTS[e.sort])} fa sempre gli stessi confronti, qualunque sia l’ordine dei valori.`, `Con ${values.length} elementi sono ${sumOf(values.length)} su tutti e tre i vettori.`]
				: [e.why!, `Sul vettore in ordine ${e.quantity === 'confronti' ? 'i' : 'gli'} ${e.quantity} sono ${counts[0]}, su quello rovesciato ${counts[1]}, sul terzo ${counts[2]}.`],
			answer: choose(
				rng,
				options[right],
				options.filter((_, i) => i !== right)
			),
			params: { case: 'riconosci', algorithm: e.sort, quantity: e.quantity, direction: e.direction, vectors: [up, down, mixed] }
		};
	}
	throw new TooFew(`${ID}: no vector with one extreme for ${e.sort}`);
}

const level2 = drawn(['conto', 'riconosci'] as const, (rng, family) => (family === 'conto' ? tally(rng) : extreme(rng)));

// ---------------------------------------------------------------------------------------------------------------
// Level 3: when n doubles
// ---------------------------------------------------------------------------------------------------------------

type Growth = 'lineare' | 'logaritmo' | 'quadrato';
const GROWTHS: readonly Growth[] = ['lineare', 'logaritmo', 'quadrato'];
const QUADRATIC = ['l’ordinamento per selezione', 'l’ordinamento a bolle', 'l’ordinamento per inserimento'] as const;
const ROUND = [50, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1500, 2000, 3000, 5000] as const;

function scaled(rng: Rng): CodeBuilt {
	const growth = rng.pick(GROWTHS);
	const prompt = 'Chiediti come cresce il conto quando crescono i dati.';
	if (growth === 'lineare') {
		const n = rng.pick(ROUND);
		const k = rng.pick([2, 4, 10]);
		const right = k * n;
		return {
			prompt,
			problem: `Nel caso peggiore la ricerca sequenziale fa ${big(n)} confronti su un vettore di ${big(n)} elementi. Quanti ne fa su un vettore di ${big(k * n)} elementi?`,
			solution: `${big(right)} confronti`,
			steps: [`Da ${big(n)} a ${big(k * n)} gli elementi sono diventati ${k} volte tanti.`, `La ricerca sequenziale cresce come $n$: anche i confronti diventano ${k} volte tanti.`, `$${digits(n)} \\cdot ${k} = ${digits(right)}$.`],
			answer: pick(
				rng,
				numberOption(right),
				[k * k * n, n + Math.log2(k === 10 ? 2 : k), n + k, k === 2 ? 3 * n : 2 * n].map((x) => numberOption(x))
			),
			params: { case: 'scala', growth, n, k, given: n }
		};
	}
	if (growth === 'logaritmo') {
		const n = rng.int(20, 5000);
		const k = rng.pick([2, 4, 8]);
		const x = halvings(n);
		const more = Math.log2(k);
		return {
			prompt,
			problem: `Nel caso peggiore la ricerca binaria fa ${x} confronti su un vettore ordinato di ${big(n)} elementi. Quanti ne fa su un vettore ordinato di ${big(k * n)} elementi?`,
			solution: `${x + more} confronti`,
			steps: [
				`Da ${big(n)} a ${big(k * n)} elementi $n$ raddoppia ${more === 1 ? 'una volta' : `${more} volte`}.`,
				'La ricerca binaria cresce come $\\log_2 n$: a ogni raddoppio di $n$ serve un solo confronto in più, quello che scarta la metà aggiunta.',
				`$${x} + ${more} = ${x + more}$.`
			],
			answer: pick(
				rng,
				numberOption(x + more),
				[k * x, k * k * x, x + k, x].map((y) => numberOption(y))
			),
			params: { case: 'scala', growth, n, k, given: x }
		};
	}
	const n = rng.pick([50, 100, 200, 300, 400, 500, 1000, 2000]);
	const k = rng.pick([2, 4, 10]);
	const x = pairsOf(n);
	const right = k * k * x;
	const sort = rng.pick(QUADRATIC);
	return {
		prompt,
		problem: `Nel caso peggiore ${sort} fa ${big(x)} confronti su un vettore di ${big(n)} elementi. Quanti ne fa, circa, su un vettore di ${big(k * n)} elementi?`,
		solution: `Circa ${big(right)} confronti`,
		steps: [
			`Da ${big(n)} a ${big(k * n)} gli elementi sono diventati ${k} volte tanti.`,
			`Questo ordinamento cresce come $n^2$: i confronti diventano circa $${k} \\cdot ${k} = ${k * k}$ volte tanti.`,
			`$${digits(x)} \\cdot ${k * k} = ${digits(right)}$; il conto esatto, con la formula ${SUM}, dà ${big(pairsOf(k * n))}.`
		],
		answer: pick(
			rng,
			numberOption(right),
			[k * x, (k === 2 ? 8 : 2 * k) * x, x + k].map((y) => numberOption(y))
		),
		params: { case: 'scala', growth, n, k, given: x, algorithm: sort }
	};
}

/** The counts of an algorithm of each growth while n doubles: the rows of the table of the lesson. */
function doubling(rng: Rng, growth: Growth): [number, number][] {
	const c = growth === 'lineare' ? rng.int(1, 3) : 1;
	const n0 = growth === 'lineare' ? rng.pick([10, 20, 25, 50, 100, 125, 200, 250, 500, 1000]) : growth === 'logaritmo' ? rng.int(10, 600) : rng.pick([10, 20, 25, 30, 40, 50, 100, 200]);
	return [1, 2, 4, 8].map((k) => [k * n0, growth === 'lineare' ? c * k * n0 : growth === 'logaritmo' ? halvings(k * n0) : pairsOf(k * n0)]);
}

const table = (lines: (readonly [number, number | string])[]) => ['n'.padEnd(8) + 'confronti', ...lines.map(([n, count]) => String(n).padEnd(8) + count)].join('\n') + '\n';

const COUNTED_BY = 'Un programma ha contato i confronti che un algoritmo fa nel caso peggiore, raddoppiando $n$ ogni volta.';

function tabled(rng: Rng, asked: 'tabella' | 'crescita'): CodeBuilt {
	const growth = rng.pick(GROWTHS);
	const lines = doubling(rng, growth);
	const counts = lines.map(([, count]) => count);
	const how = {
		lineare: `A ogni raddoppio di $n$ i confronti raddoppiano: ${counts.slice(0, asked === 'tabella' ? 3 : 4).join(', ')}.`,
		logaritmo: `A ogni raddoppio di $n$ i confronti aumentano di 1: ${counts.slice(0, asked === 'tabella' ? 3 : 4).join(', ')}.`,
		quadrato: `A ogni raddoppio di $n$ i confronti diventano circa il quadruplo: ${counts.slice(0, asked === 'tabella' ? 3 : 4).join(', ')}.`
	}[growth];
	if (asked === 'crescita') {
		const options = { lineare: textOption('Come $n$', 'lineare'), logaritmo: textOption('Come $\\log_2 n$', 'logaritmo'), quadrato: textOption('Come $n^2$', 'quadrato'), costante: textOption('Non cresce: resta uguale', 'costante') };
		return {
			prompt: 'Guarda che cosa succede ai confronti a ogni raddoppio di n.',
			problem: `${COUNTED_BY} Come cresce il numero di confronti?`,
			listing: table(lines),
			solution: { lineare: 'Cresce come $n$.', logaritmo: 'Cresce come $\\log_2 n$.', quadrato: 'Cresce come $n^2$.' }[growth],
			steps: [
				how,
				{
					lineare: 'Un conto che raddoppia quando raddoppiano i dati cresce come $n$, come la ricerca sequenziale.',
					logaritmo: 'Un conto che aumenta di 1 quando raddoppiano i dati cresce come $\\log_2 n$, come la ricerca binaria.',
					quadrato: 'Un conto che diventa il quadruplo quando raddoppiano i dati cresce come $n^2$, come un quadrato quando raddoppia il lato: è quello che fanno i tre ordinamenti.'
				}[growth]
			],
			answer: choose(
				rng,
				options[growth],
				Object.values(options).filter((o) => o.values[0] !== growth)
			),
			params: { case: 'crescita', growth, table: lines }
		};
	}
	const [prev, last, right] = counts.slice(1);
	const others = growth === 'lineare' ? [last + (last - prev), last + 1, 4 * last] : growth === 'logaritmo' ? [2 * last, last + 2, 4 * last] : [2 * last, last + (last - prev), 8 * last, last + 1];
	return {
		prompt: 'Guarda che cosa succede ai confronti a ogni raddoppio di n.',
		problem: `${COUNTED_BY} Quale numero va al posto del punto interrogativo?`,
		listing: table([...lines.slice(0, 3), [lines[3][0], '?']]),
		solution: big(right),
		steps: [
			how,
			growth === 'lineare'
				? `Il conto cresce come $n$: nella riga che manca raddoppia ancora, $${digits(last)} \\cdot 2 = ${digits(right)}$.`
				: growth === 'logaritmo'
					? `Il conto cresce come $\\log_2 n$: nella riga che manca aumenta ancora di 1, $${last} + 1 = ${right}$.`
					: `Il conto cresce come $n^2$: nella riga che manca è circa $${digits(last)} \\cdot 4 = ${digits(4 * last)}$. Tra le risposte il numero più vicino è ${big(right)}, che è il conto esatto con ${SUM}.`
		],
		answer: pick(
			rng,
			numberOption(right),
			others.map((x) => numberOption(x))
		),
		params: { case: 'tabella', growth, table: lines.slice(0, 3), asked: lines[3][0] }
	};
}

const level3 = drawn(['scala', 'scala', 'scala', 'scala', 'tabella', 'tabella', 'tabella', 'crescita', 'crescita', 'crescita'] as const, (rng, family) => (family === 'scala' ? scaled(rng) : tabled(rng, family)));

// ---------------------------------------------------------------------------------------------------------------
// Level 4: where the counter goes
// ---------------------------------------------------------------------------------------------------------------

type Placed = 'giro-confronti' | 'giro-scambi' | 'cerca' | 'dimezza';
const PLACED: readonly Placed[] = ['giro-confronti', 'giro-scambi', 'cerca', 'dimezza'];

/** The body of a function, without its first row: what an option shows. */
const bodyOf = (f: Fn) => text(f.body);

interface Placing {
	asks: string;
	solution: string;
	steps: string[];
	right: Fn;
	/** the mistake of the lesson first, then the others in any order */
	wrong: Fn[];
	calls: Call[];
}

function placing(rng: Rng, family: Placed): Placing {
	if (family === 'giro-confronti' || family === 'giro-scambi') {
		const name = family === 'giro-confronti' ? 'confronti' : 'scambi';
		const make = (at: GiroSpot | GiroSpot[], more: Partial<Counter<GiroSpot>> & { gives?: Expr } = {}) => giro({ name, at, ...more });
		// two vectors of different lengths, neither in order nor with its largest element first: every mistake shows
		const vector = (size: number) => {
			for (;;) {
				const v = arranged(rng, 'caso', distinct(rng, size, 2, 29));
				if (v[0] !== Math.max(...v)) return v;
			}
		};
		const calls = [{ v: vector(5) }, { v: vector(6) }];
		const asks = `La funzione giro riceve un vettore v di n elementi e fa un solo giro dell’ordinamento a bolle. Quale corpo le fa restituire il numero di ${name} fatti?`;
		if (family === 'giro-confronti')
			return {
				asks,
				solution: 'Il corpo con confronti = confronti + 1 nel ciclo, prima della selezione.',
				steps: [
					'Un confronto si fa a ogni giro del ciclo, che ci sia lo scambio oppure no: il contatore aumenta nel ciclo, prima della selezione.',
					'Dentro la selezione conterebbe solo i confronti finiti con uno scambio, cioè gli scambi.',
					'Il contatore parte da 0, prima del ciclo, e la funzione restituisce lui.'
				],
				right: make('before'),
				wrong: [make('inside'), ...shuffle(rng, [make('after'), make('before', { reset: true }), make('before', { start: 1 }), make('before', { by: J }), make('else'), make('before', { gives: va('n') })])],
				calls
			};
		return {
			asks,
			solution: 'Il corpo con scambi = scambi + 1 dentro la selezione, accanto allo scambio.',
			steps: [
				'Uno scambio c’è solo quando la condizione v[j] > v[j + 1] è vera: il contatore aumenta dentro la selezione.',
				'Prima della selezione aumenterebbe a ogni giro del ciclo, e conterebbe i confronti.',
				'Il contatore parte da 0, prima del ciclo, e la funzione restituisce lui.'
			],
			right: make('inside'),
			wrong: [make('before'), ...shuffle(rng, [make('after'), make('else'), make('inside', { start: 1 }), make('inside', { by: J }), make('inside', { reset: true }), make(['before', 'inside'])])],
			calls
		};
	}
	if (family === 'cerca') {
		const values = distinct(rng, 7, 2, 40);
		const absent = rng.pick(values);
		const v = arranged(
			rng,
			'caso',
			values.filter((x) => x !== absent)
		);
		const found = v[rng.int(2, 4)];
		return {
			asks: 'La funzione cerca riceve un vettore v di n elementi e un valore x, e cerca x con la ricerca sequenziale. Quale corpo le fa restituire il numero di confronti fatti, fino a quando trova x o arriva in fondo?',
			solution: 'Il corpo con confronti = confronti + 1 nel ciclo, prima della selezione.',
			steps: [
				'A ogni giro del ciclo la funzione confronta un elemento con x: il contatore aumenta nel ciclo, prima della selezione.',
				'Dentro la selezione conterebbe solo il confronto riuscito; dopo la selezione salterebbe proprio quello, perché il return esce prima.',
				'I due return restituiscono il contatore: quello nel ciclo quando x c’è, quello in fondo quando non c’è.'
			],
			right: search({ at: 'before' }),
			wrong: [search({ at: 'inside' }), ...shuffle(rng, [search({ at: 'afterif' }), search({ at: 'afterloop' }), search({ at: 'before', start: 1 }), search({ at: 'before', by: I }), search({ at: ['before', 'inside'] })])],
			calls: [
				{ v, x: found },
				{ v, x: absent }
			]
		};
	}
	const first = rng.int(5, 60);
	let second = rng.int(100, 5000);
	while (halvings(second) === halvings(first) + 1) second = rng.int(100, 5000);
	return {
		asks: 'La funzione confronti_binaria riceve un numero n. Quale corpo le fa restituire quante volte n si può dimezzare prima di arrivare a 0, cioè i confronti della ricerca binaria nel caso peggiore?',
		solution: 'Il corpo con confronti = confronti + 1 nel ciclo, che continua finché n > 0.',
		steps: ['A ogni giro del ciclo n viene dimezzato una volta: il contatore aumenta nel ciclo, di 1.', 'Il ciclo continua finché n > 0: con n > 1 si fermerebbe un dimezzamento prima.', 'Il contatore parte da 0 e la funzione restituisce lui, non n, che alla fine vale 0.'],
		right: halver({ at: 'in' }),
		wrong: [halver({ at: 'after' }), ...shuffle(rng, [halver({ at: 'in', above: 1 }), halver({ at: 'in', start: 1 }), halver({ at: 'in', by: va('n') }), halver({ at: 'in', gives: va('n') }), halver({ at: 'in', reset: true })])],
		calls: [{ n: first }, { n: second }]
	};
}

function level4(rng: Rng, family: Placed): CodeBuilt {
	const p = placing(rng, family);
	const right = trial(p.right, p.calls);
	const wrong = p.wrong.map((f) => ({ f, whole: trial(f, p.calls) }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong bodies for ${family}`);
	const option = (whole: Program) => programOption(whole, bodyOf(whole === right ? p.right : wrong.find((w) => w.whole === whole)!.f));
	return {
		prompt: 'Ogni risposta è il corpo della funzione, senza la sua prima riga. Guarda dove aumenta il contatore.',
		problem: p.asks,
		solution: p.solution,
		steps: p.steps,
		solutionCode: fnText(p.right),
		answer: choose(
			rng,
			option(right),
			shuffle(rng, kept).map((whole) => option(whole))
		),
		params: reference(right, [[]], { case: family, calls: p.calls })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 5: how much work, how much time
// ---------------------------------------------------------------------------------------------------------------

const SPEEDS = [
	[1_000_000, '$1$ milione'],
	[10_000_000, '$10$ milioni'],
	[100_000_000, '$100$ milioni']
] as const;
const MANY = [10, 20, 50, 100, 200, 500, 1000] as const;

const seconds = (s: number, about = false) => numberOption(s, `${about ? 'circa ' : ''}${big(s)} second${s === 1 ? 'o' : 'i'}`);
const whole = (x: number) => Number.isInteger(x) && x >= 1;
/** A time in seconds said in a unit a person can picture. */
const human = (s: number) => (s >= 7200 ? ` (più di ${Math.floor(s / 3600)} ore)` : s >= 120 ? ` (${s % 60 ? 'circa ' : ''}${Math.round(s / 60)} minuti)` : '');
const round2 = (x: number) => {
	const unit = 10 ** Math.max(0, Math.floor(Math.log10(x)) - 1);
	return Math.round(x / unit) * unit;
};

type Work = 'ordinamento' | 'ricerche' | 'binaria' | 'ripaga';
const WORKS: readonly Work[] = ['ordinamento', 'ricerche', 'binaria', 'ripaga'];

function level5(rng: Rng, family: Work): CodeBuilt {
	const [speed, speedSaid] = rng.pick(SPEEDS);
	if (family === 'ordinamento') {
		const n = rng.pick([1, 2, 3, 4, 5, 6, 8]) * 10 ** rng.int(4, 6);
		const work = (n * n) / 2;
		const s = work / speed;
		if (!whole(s) || s < 2 || s > 500_000) throw new TooFew(`${ID}: ${s} seconds`);
		const sort = rng.pick(QUADRATIC);
		return {
			prompt: 'Conta prima i confronti, poi il tempo.',
			problem: `Nel caso peggiore ${sort} fa circa $\\frac{n^2}{2}$ confronti su $n$ elementi. Un computer esegue ${speedSaid} di confronti al secondo. Quanto impiega, circa, per ordinare ${big(n)} elementi nel caso peggiore?`,
			solution: `Circa ${big(s)} secondi${human(s)}`,
			steps: [`I confronti sono circa metà di $n^2$: $\\frac{${digits(n)} \\cdot ${digits(n)}}{2} = ${digits(work)}$.`, `Il computer ne esegue ${big(speed)} al secondo: $${digits(work)} : ${digits(speed)} = ${digits(s)}$ secondi${human(s)}.`],
			answer: pick(
				rng,
				seconds(s, true),
				[2 * s, n / speed, 10 * s, s / 10, s / 2, 5 * s].filter(whole).map((x) => seconds(x, true))
			),
			params: { case: family, n, speed, algorithm: sort }
		};
	}
	if (family === 'ricerche') {
		const n = rng.int(1, 9) * 10 ** rng.int(5, 7);
		const k = rng.pick(MANY);
		const s = (k * n) / speed;
		if (!whole(s) || s < 2 || s > 100_000) throw new TooFew(`${ID}: ${s} seconds`);
		return {
			prompt: 'Conta prima i confronti, poi il tempo.',
			problem: `Su un vettore di ${big(n)} elementi fai ${k} ricerche sequenziali, tutte nel caso peggiore. Un computer esegue ${speedSaid} di confronti al secondo. Quanto tempo serve in tutto?`,
			solution: `${big(s)} secondi${human(s)}`,
			steps: [
				`Nel caso peggiore una ricerca sequenziale fa un confronto per elemento: ${big(n)}.`,
				`Le ricerche sono ${k}: $${k} \\cdot ${digits(n)} = ${digits(k * n)}$ confronti.`,
				`Il computer ne esegue ${big(speed)} al secondo: $${digits(k * n)} : ${digits(speed)} = ${digits(s)}$ secondi${human(s)}.`
			],
			answer: pick(
				rng,
				seconds(s),
				[n / speed, 10 * s, s / 10, 2 * s, s / 2, 5 * s].filter(whole).map((x) => seconds(x))
			),
			params: { case: family, n, k, speed }
		};
	}
	if (family === 'binaria') {
		const n = rng.pick([1000, 2000, 5000, 10_000, 20_000, 50_000, 100_000, 500_000, 1_000_000]);
		const k = rng.pick(MANY);
		const x = halvings(n);
		return {
			prompt: 'Conta prima i confronti di una ricerca sola.',
			problem: `Un vettore ordinato ha ${big(n)} elementi. Fai ${k} ricerche binarie, tutte nel caso peggiore. Quanti confronti servono in tutto?`,
			solution: `${big(k * x)} confronti`,
			steps: [
				`Nel caso peggiore la ricerca binaria fa tanti confronti quante volte $n$ si può dimezzare prima di arrivare a 0: ${chain(n).slice(0, 4).map(big).join(', ')} e così via fino a 1 e a 0, cioè ${x} volte.`,
				`Le ricerche sono ${k}: $${k} \\cdot ${x} = ${digits(k * x)}$ confronti.`,
				`Con la ricerca sequenziale sarebbero stati $${k} \\cdot ${digits(n)} = ${digits(k * n)}$.`
			],
			answer: pick(
				rng,
				numberOption(k * x),
				[k * n, x, k + x, (k * n) / 2].map((y) => numberOption(y))
			),
			params: { case: family, n, k }
		};
	}
	const n = rng.pick([500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10_000]);
	const sort = rng.pick(QUADRATIC);
	const cost = pairsOf(n);
	const b = halvings(n);
	const about = (x: number) => numberOption(x, `circa ${big(x)}`);
	return {
		prompt: 'Conta quanti confronti risparmia ogni ricerca.',
		problem: `Per ordinare un vettore di ${big(n)} elementi ${sort} fa, nel caso peggiore, ${big(cost)} confronti. Poi ogni ricerca costa al massimo ${b} confronti con la ricerca binaria, al posto di ${big(n)} con la sequenziale. Dopo circa quante ricerche l’ordinamento è ripagato?`,
		solution: `Dopo circa ${big(n / 2)} ricerche`,
		steps: [
			`Ogni ricerca fatta con la binaria risparmia $${digits(n)} - ${b} = ${digits(n - b)}$ confronti.`,
			`L’ordinamento è ripagato quando i risparmi arrivano a ${big(cost)}: $${digits(cost)} : ${digits(n - b)} \\approx ${digits(Math.round(cost / (n - b)))}$, cioè circa ${big(n / 2)} ricerche.`
		],
		answer: pick(
			rng,
			about(n / 2),
			[round2(cost / b), n, 2 * n].map((x) => about(x))
		),
		params: { case: family, n, cost, binary: b, algorithm: sort }
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Level 6: write a program that counts
// ---------------------------------------------------------------------------------------------------------------

type Writing = 'bandierina-confronti' | 'bolle-scambi' | 'selezione-scambi' | 'inserimento-spostamenti' | 'sequenziale' | 'dimezzamenti';
const WRITINGS: readonly Writing[] = ['bandierina-confronti', 'bolle-scambi', 'selezione-scambi', 'inserimento-spostamenti', 'sequenziale', 'dimezzamenti'];

interface Reading {
	/** the numbers go in the vector v; without, the program reads n alone */
	vector: boolean;
	/** a value x is read after the vector */
	x?: boolean;
	/** `int n, v[100];` on one row, where the C++ would not fit in its 28 rows */
	compact?: boolean;
}

/** A program that reads its numbers, one for each row, and then does `after`; `before` is its function, if it has one. */
function reading(o: Reading, after: Stmt[], before?: Fn): { whole: Program; start: CodeText } {
	const python = ['n = int(input())', ...(o.vector ? ['v = []', 'for k in range(n):', '    v.append(int(input()))'] : []), ...(o.x ? ['x = int(input())'] : [])];
	const cpp = [...(o.vector ? (o.compact ? ['int n, v[100];'] : ['int v[100];', 'int n;']) : ['int n;']), 'cin >> n;', ...(o.vector ? ['for (int k = 0; k < n; k++) {', '    cin >> v[k];', '}'] : []), ...(o.x ? ['int x;', 'cin >> x;'] : [])];
	const fn = before ? fnText(before) : null;
	const whole = program(`${fn ? `${fn.python}\n` : ''}${[...python, ...rows(after, 'python')].join('\n')}\n`, cppProgram([...cpp, ...rows(after, 'cpp')].join('\n'), fn?.cpp ?? ''), (input) => {
		const next = reader(input);
		const n = Number(next());
		const v = o.vector ? Array.from({ length: n }, () => Number(next())) : [];
		const out: string[] = [];
		exec(after, { v, x: { n, ...(o.x ? { x: Number(next()) } : {}) }, steps: 0 }, out);
		return out;
	});
	// the editor of a phone shows about 38 characters beside the numbers of its rows: the comment stays short
	const here = before ? 'scrivi qui chiamata e stampa' : 'scrivi qui il resto';
	const start = {
		python: `${before ? `# scrivi qui la funzione ${before.name}\n\n` : ''}${python.join('\n')}\n# ${here}\n`,
		cpp: cppProgram([...cpp, `// ${here}`].join('\n'), before ? `// scrivi qui la funzione ${before.name}\n` : '')
	};
	return { whole, start };
}

/** The first statement, at any depth, that `is`. */
function find(stmts: Stmt[], is: (s: Stmt) => boolean): Stmt | null {
	for (const s of stmts) {
		if (is(s)) return s;
		const inside = s.kind === 'for' || s.kind === 'while' ? find(s.body, is) : s.kind === 'if' ? (find(s.then, is) ?? find(s.else ?? [], is)) : null;
		if (inside) return inside;
	}
	return null;
}

const loopOn = (name: string) => (s: Stmt) => s.kind === 'for' && s.name === name;
const bodyOfLoop = (stmts: Stmt[], name: string) => (find(stmts, loopOn(name)) as Extract<Stmt, { kind: 'for' }>).body;

interface Task {
	problem: string;
	solution: string;
	steps: string[];
	needs: 'annidati' | 'funzione' | 'while';
	/** what the options show of each program */
	shows: string;
	right: { whole: Program; start: CodeText; shown: CodeText };
	wrong: { whole: Program; shown: CodeText }[];
	tests: string[][];
}

const READS = 'Il programma legge n e poi n numeri interi, uno per riga, che mette nel vettore v.';
const GIVEN = 'La lettura c’è già.';
const NESTED = 'Servono due cicli, uno dentro l’altro.';

/** A test of a program that sorts: n and the n numbers, one for each row. */
const typed = (v: readonly number[], x?: number) => [String(v.length), ...v.map(String), ...(x === undefined ? [] : [String(x)])];

function task(rng: Rng, family: Writing): Task {
	const vector = (order: Order, size = rng.int(4, 7)) => arranged(rng, order, distinct(rng, size, 1, 50));
	if (family === 'dimezzamenti') {
		const make = (o: Halving) => {
			const after = halving(o, say);
			return { ...reading({ vector: false }, after), shown: text(after) };
		};
		// three numbers that halve a different number of times, one of them a power of 2
		const power = 2 ** rng.int(3, 9);
		const tests = [[String(rng.int(3, 7))], [String(power)], [String(rng.int(2 * power + 1, 100_000))]];
		return {
			problem: `Il programma legge n, il numero di elementi di un vettore ordinato. Scrivi quanti confronti fa la ricerca binaria nel caso peggiore: conta quante volte n si può dimezzare, con la divisione intera, prima di arrivare a 0. Usa un ciclo while. ${GIVEN}`,
			solution: 'Un ciclo while che continua finché n > 0, dimezza n e aumenta il contatore di 1.',
			steps: ['Il contatore parte da 0, prima del ciclo.', 'Il ciclo continua finché n > 0: a ogni giro aumenta il contatore di 1 e dimezza n con la divisione intera.', 'Dopo il ciclo scrivi il contatore: con 1000 esce 10.'],
			needs: 'while',
			shows: 'la parte che viene dopo la lettura',
			right: make({ at: 'in' }),
			wrong: [make({ at: 'after' }), ...shuffle(rng, [make({ at: 'in', above: 1 }), make({ at: 'in', start: 1 }), make({ at: 'in', by: va('n') }), make({ at: 'in', gives: va('n') }), make({ at: 'in', reset: true })])],
			tests
		};
	}
	if (family === 'sequenziale') {
		const make = (o: Omit<Counter<SearchSpot>, 'name'>) => {
			const f = search(o);
			const after = [say(ex('cerca(v, x)', (r) => call(f, r.v, { x: r.x.x }), 'cerca(v, n, x)'))];
			return { ...reading({ vector: true, x: true }, after, f), shown: bodyOf(f) };
		};
		// the value in the middle, the value that is not there, the value at the end: three different counts
		const tests = [0, 1, 2].map((k) => {
			const values = distinct(rng, 5 + k, 1, 50);
			const absent = rng.pick(values);
			const v = arranged(
				rng,
				'caso',
				values.filter((x) => x !== absent)
			);
			return typed(v, k === 0 ? v[rng.int(1, 2)] : k === 1 ? absent : v[v.length - 1]);
		});
		return {
			problem: `Il programma legge n, poi n numeri interi, uno per riga, che mette nel vettore v, e alla fine un valore x. Scrivi una funzione cerca che cerca x nel vettore con la ricerca sequenziale e restituisce il numero di confronti fatti, fino a quando lo trova o arriva in fondo. Poi chiamala e scrivi il risultato. ${GIVEN}`,
			solution: 'Una funzione cerca con confronti = confronti + 1 nel ciclo, prima della selezione, e il contatore nei due return.',
			steps: [
				'Nella funzione il contatore parte da 0 e aumenta a ogni giro del ciclo, prima della selezione che confronta v[i] con x.',
				'Quando l’elemento è x la funzione restituisce subito il contatore; se il ciclo finisce senza trovarlo lo restituisce dopo il ciclo.',
				'Dopo la lettura chiama la funzione e scrivi quello che restituisce.'
			],
			needs: 'funzione',
			shows: 'il corpo della funzione, senza la sua prima riga',
			right: make({ at: 'before' }),
			wrong: [make({ at: 'inside' }), ...shuffle(rng, [make({ at: 'afterif' }), make({ at: 'afterloop' }), make({ at: 'before', start: 1 }), make({ at: 'before', by: I }), make({ at: ['before', 'inside'] })])],
			tests
		};
	}
	if (family === 'bandierina-confronti') {
		const make = (o: Partial<Bubble> & { at: BubbleSpot | BubbleSpot[] }) => {
			const after = [...bubble({ name: 'confronti', flag: true, ...o }), say(va('confronti'))];
			return { ...reading({ vector: true, compact: true }, after), shown: text([find(after, loopOn('j'))!]) };
		};
		return {
			problem: `${READS} Ordina v con l’ordinamento a bolle con la bandierina, in cui ogni giro si ferma un posto prima del precedente, e scrivi quanti confronti ha fatto. ${NESTED} ${GIVEN}`,
			solution: 'Le bolle con la bandierina, con confronti = confronti + 1 nel ciclo interno, prima della selezione.',
			steps: [
				'Il contatore parte da 0, prima dei due cicli.',
				'Il ciclo esterno è un while che continua finché restano giri da fare e scambiato è vero; nel ciclo interno il contatore aumenta a ogni confronto, prima della selezione.',
				'Dopo i cicli scrivi il contatore: su un vettore già in ordine di n elementi esce n - 1.'
			],
			needs: 'annidati',
			shows: 'il ciclo interno',
			right: make({ at: 'before' }),
			wrong: [make({ at: 'inside' }), ...shuffle(rng, [make({ at: 'else' }), make({ at: 'before', by: J }), make({ at: 'before', raise: 'never' }), make({ at: 'before', raise: 'always' }), make({ at: ['before', 'inside'] })])],
			tests: [typed(vector('ordine')), typed(vector('quasi')), typed(vector('caso'))]
		};
	}
	if (family === 'bolle-scambi') {
		const make = (o: Partial<Bubble> & { at: BubbleSpot | BubbleSpot[] }) => {
			const after = [...bubble({ name: 'scambi', flag: false, ...o }), say(va('scambi'))];
			return { ...reading({ vector: true }, after), shown: text([find(after, loopOn('j'))!]) };
		};
		return {
			problem: `${READS} Ordina v con l’ordinamento a bolle, senza bandierina, e scrivi quanti scambi ha fatto. ${NESTED} ${GIVEN}`,
			solution: 'Le bolle con scambi = scambi + 1 dentro la selezione, accanto allo scambio.',
			steps: ['Il contatore parte da 0, prima dei due cicli.', 'Nel ciclo interno il contatore aumenta dentro la selezione, dove c’è lo scambio: prima della selezione conterebbe i confronti.', 'Dopo i cicli scrivi il contatore: su un vettore già in ordine esce 0.'],
			needs: 'annidati',
			shows: 'il ciclo interno',
			right: make({ at: 'inside' }),
			wrong: [make({ at: 'before' }), ...shuffle(rng, [make({ at: 'else' }), make({ at: ['before', 'inside'] }), make({ at: 'inside', by: J }), make({ at: 'inside', sign: '<' })])],
			tests: [typed(vector('caso')), typed(vector('caso')), typed(vector('quasi'))]
		};
	}
	if (family === 'selezione-scambi') {
		const make = (o: Omit<Counter<SelectionSpot>, 'name'>) => {
			const after = [...selection({ name: 'scambi', ...o }), say(va('scambi'))];
			return { ...reading({ vector: true }, after), shown: text(bodyOfLoop(after, 'i')) };
		};
		return {
			problem: `${READS} Ordina v con l’ordinamento per selezione e scrivi quanti scambi ha fatto: quando il minimo è già al suo posto lo scambio non si fa e non si conta. ${NESTED} ${GIVEN}`,
			solution: 'La selezione con scambi = scambi + 1 dentro la selezione imin != i, accanto allo scambio.',
			steps: [
				'Il contatore parte da 0, prima dei due cicli.',
				'Il ciclo interno cerca solo l’indice del minimo; lo scambio viene dopo, dentro la selezione imin != i, ed è lì che aumenta il contatore.',
				'Dopo i cicli scrivi il contatore: non supera mai n - 1.'
			],
			needs: 'annidati',
			shows: 'il corpo del ciclo esterno',
			right: make({ at: 'swap' }),
			wrong: [make({ at: 'outer' }), ...shuffle(rng, [make({ at: 'update' }), make({ at: 'inner' }), make({ at: ['update', 'swap'] }), make({ at: 'swap', by: I })])],
			tests: [typed(vector('caso')), typed(vector('caso')), typed(vector('rovescio'))]
		};
	}
	const make = (o: Omit<Counter<InsertionSpot>, 'name'>) => {
		const after = [...insertion({ name: 'spostamenti', ...o }), say(va('spostamenti'))];
		return { ...reading({ vector: true }, after), shown: text(bodyOfLoop(after, 'i')) };
	};
	return {
		problem: `${READS} Ordina v con l’ordinamento per inserimento e scrivi quanti spostamenti ha fatto. ${NESTED} ${GIVEN}`,
		solution: 'L’inserimento con spostamenti = spostamenti + 1 nel ciclo while, dove un elemento passa nella cella alla sua destra.',
		steps: [
			'Il contatore parte da 0, prima dei due cicli.',
			'Uno spostamento è v[j + 1] = v[j], nel ciclo while: il contatore aumenta lì. L’inserimento finale di x non è uno spostamento.',
			'Dopo i cicli scrivi il contatore: su un vettore già in ordine esce 0.'
		],
		needs: 'annidati',
		shows: 'il corpo del ciclo esterno',
		right: make({ at: 'shift' }),
		wrong: [make({ at: 'after' }), ...shuffle(rng, [make({ at: 'before' }), make({ at: ['shift', 'after'] }), make({ at: 'shift', by: J }), make({ at: 'after', by: I })])],
		tests: [typed(vector('caso')), typed(vector('caso')), typed(vector('quasi'))]
	};
}

function level6(rng: Rng, family: Writing): CodeBuilt {
	const t = task(rng, family);
	const solution = t.right.whole;
	const kept = wrongPrograms(
		solution,
		t.wrong.map((w) => w.whole),
		t.tests
	);
	// three runs that write three different numbers: none of them can be typed in place of the count
	if (kept.length < 3 || new Set(t.tests.map((typedRows) => written(solution, typedRows)?.join(' '))).size < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	return {
		prompt: `Scrivi il programma. Nelle risposte da scegliere vedi solo ${t.shows}.`,
		problem: t.problem,
		solution: t.solution,
		steps: t.steps,
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, t.right.start, t.tests), t.needs),
		choice: choose(
			rng,
			programOption(solution, t.right.shown),
			kept.map((p) => programOption(p, t.wrong.find((w) => w.whole === p)!.shown))
		),
		params: reference(solution, t.tests, { case: family })
	};
}

/** The levels of words and numbers have no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of words has no program'] : []);

export default makeCodeGenerator(ID, 'Confrontare gli algoritmi contando le operazioni', {
	1: { label: 'Contare i confronti', constraints: ['a sort over a vector of 4 to 6 different numbers that gives back its counter', 'four different outputs'], build: drawn(COUNTED, level1) },
	2: { label: 'Caso migliore e caso peggiore', constraints: ['a count on a vector in order or reversed, or three vectors with the same values', 'four different options'], build: level2, check: worded },
	3: { label: 'Quando n raddoppia', constraints: ['a count given for n and asked for a multiple of n, or a table where n doubles', 'four different options'], build: level3, check: worded },
	4: { label: 'Dove va il contatore', constraints: ['four bodies of the same function that give back different numbers', 'each option shows the body alone'], build: drawn(PLACED, level4) },
	5: { label: 'Quanto lavoro, quanto tempo', constraints: ['round numbers built backwards', 'whole results'], build: drawn(WORKS, level5), check: worded },
	6: { label: 'Scrivere un programma che conta', constraints: ['the reading is given', 'graded by running it on three inputs that write three different counts', 'needs what the exercise names'], build: drawn(WRITINGS, level6) }
});
