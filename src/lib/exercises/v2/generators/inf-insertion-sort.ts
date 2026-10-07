/**
 * Insertion sort (informatica, third year, lesson 77 "L'ordinamento per inserimento"). Spec:
 * specs/exercises/inf-insertion-sort.md
 *
 * 1. the vector after one insertion; 2. how many comparisons and shifts, for one insertion or for the whole vector;
 * 3. what a program with `ordina` writes; 4. which loop sorts (options that are programs, shown by the outer loop of
 * `ordina`); 5. write the function (open answer, graded on what it writes and on the function).
 *
 * As the lesson counts: one comparison each time `x` is compared with an element `v[j]` (the test `j >= 0` is not
 * one), one shift for each element copied one place to the right.
 *
 * Every `ordina` of levels 3 to 5, the right one and the wrong ones, comes from one description (`Sort`): its two
 * texts and what it does to a vector (`sortRun`), which stops with an error at any index outside the vector, so
 * that no wrong option is a program that C++ would not define.
 */
import type { Rng } from '../types';
import { choose, cppList, cppProgram, makeCodeGenerator, needing, printedOption, program, programAnswer, programOption, pyList, reader, reference, shuffle, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-insertion-sort';

// ---------------------------------------------------------------------------------------------------------------
// numbers and words

/** `size` different whole numbers from `low` to `high`, in the order they are drawn. */
function distinct(rng: Rng, size: number, low: number, high: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(low, high);
		if (!v.includes(x)) v.push(x);
	}
	return v;
}

const ascending = (v: readonly number[]) => [...v].sort((a, b) => a - b);
const same = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const row = (v: readonly number[]) => v.join(', ');

/** A number with its article: "il 5", "l'8", "l'11". */
const the = (x: number) => ([1, 8, 11].includes(x) ? `l'${x}` : `il ${x}`);
const The = (x: number) => ([1, 8, 11].includes(x) ? `L'${x}` : `Il ${x}`);
const comparisonsOf = (k: number) => `${k} ${k === 1 ? 'confronto' : 'confronti'}`;
const shiftsOf = (k: number) => `${k} ${k === 1 ? 'spostamento' : 'spostamenti'}`;

/** The insertion of the element of index `k` among the ones before it, which are in order: as the lesson counts it. */
function insertion(v: readonly number[], k: number) {
	const after = [...v];
	const x = v[k];
	const compared: number[] = [];
	const moved: number[] = [];
	let j = k - 1;
	while (j >= 0) {
		compared.push(after[j]);
		if (!(after[j] > x)) break;
		moved.push(after[j]);
		after[j + 1] = after[j];
		j = j - 1;
	}
	after[j + 1] = x;
	return { x, after, compared, moved, place: j + 1 };
}

/** The whole sort, one insertion after the other. */
function insertions(v: readonly number[]) {
	const all: ReturnType<typeof insertion>[] = [];
	let now = [...v];
	for (let i = 1; i < v.length; i++) {
		const one = insertion(now, i);
		all.push(one);
		now = one.after;
	}
	return all;
}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers that differ from the right one. The
 * case is drawn once, before: drawn again with the numbers, the cases that fail more often would come out less.
 * (As `drawn` of v2/inf-codice.ts.)
 */
class TooFew extends Error {}
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

// ---------------------------------------------------------------------------------------------------------------
// level 1: the vector after one insertion

type Where = 'inizio' | 'mezzo' | 'fermo';
const WHERE: readonly Where[] = ['inizio', 'mezzo', 'mezzo', 'fermo'];

/** A vector of 5 or 6 different numbers whose first `k` are in order, and where the element of index `k` ends. */
function partly(rng: Rng, where: Where): { v: number[]; k: number } {
	for (;;) {
		const n = rng.int(5, 6);
		const k = rng.int(2, n - 1);
		const all = distinct(rng, n, 1, 20);
		const v = [...ascending(all.slice(0, k)), ...all.slice(k)];
		const { place } = insertion(v, k);
		if ((place === 0 ? 'inizio' : place === k ? 'fermo' : 'mezzo') === where) return { v, k };
	}
}

function level1(rng: Rng, where: Where): CodeBuilt {
	const { v, k } = partly(rng, where);
	const { x, after, moved, place } = insertion(v, k);
	const swapped = (a: number, b: number) => {
		const w = [...v];
		[w[a], w[b]] = [w[b], w[a]];
		return w;
	};
	// the mistakes of the lesson: the element exchanged and not inserted, the element lost, everything sorted
	const wrong = [
		swapped(k - 1, k),
		swapped(place, k),
		v.map((y, i) => (i === k ? v[k - 1] : y)),
		after.map((y, i) => (i === place ? after[Math.min(place + 1, v.length - 1)] : y)),
		[x, ...v.slice(0, k), ...v.slice(k + 1)],
		ascending(v),
		[...v]
	];
	const steps =
		where === 'fermo'
			? [`Tieni da parte ${the(x)} e confrontalo con l'elemento alla sua sinistra, ${the(v[k - 1])}: non è più grande, quindi nessun elemento si sposta.`, `${The(x)} rientra nel posto libero, che è quello da cui è partito: il vettore resta ${row(after)}.`]
			: [
					`Tieni da parte ${the(x)} e confrontalo con gli elementi alla sua sinistra, da destra verso sinistra: ${moved.length === 1 ? `${the(moved[0])} è più grande e si sposta` : `${row(moved)} sono più grandi e si spostano`} di un posto a destra.`,
					place === 0 ? `Arrivato all'inizio del vettore, ${the(x)} entra nel posto rimasto libero, quello di indice 0.` : `${The(v[place - 1])} non è più grande e ferma la ricerca: ${the(x)} entra nel posto libero subito dopo, quello di indice ${place}.`,
					k === v.length - 1 ? `Era l'ultimo elemento: adesso il vettore è tutto in ordine, ${row(after)}.` : `Gli elementi dopo l'indice ${k} non sono ancora stati toccati: il vettore è ${row(after)}.`
				];
	return {
		prompt: "Inserisci l'elemento al posto giusto tra quelli alla sua sinistra.",
		problem: `I primi ${k} elementi del vettore ${row(v)} sono già in ordine tra loro. Com'è il vettore dopo l'inserimento dell'elemento di indice ${k}, cioè ${the(x)}?`,
		solution: row(after),
		steps,
		answer: pick(
			rng,
			textOption(row(after)),
			shuffle(rng, wrong).map((w) => textOption(row(w)))
		),
		params: { case: where, vector: v, k }
	};
}

// ---------------------------------------------------------------------------------------------------------------
// level 2: comparisons and shifts

type Counted = 'confronti' | 'spostamenti';
type Count = `${'inserimento' | 'vettore'}: ${Counted}`;
const COUNTS: readonly Count[] = ['inserimento: confronti', 'inserimento: spostamenti', 'vettore: confronti', 'vettore: spostamenti'];

function level2(rng: Rng, family: Count): CodeBuilt {
	const what = family.endsWith('confronti') ? 'confronti' : 'spostamenti';
	const numbers = (right: number, others: number[]) =>
		pick(
			rng,
			textOption(String(right)),
			others.filter((y) => y >= 0).map((y) => textOption(String(y)))
		);
	if (family.startsWith('inserimento')) {
		const { v, k } = partly(rng, rng.pick(WHERE));
		const { x, compared, moved, place } = insertion(v, k);
		const [c, s] = [compared.length, moved.length];
		const right = what === 'confronti' ? c : s;
		const other = what === 'confronti' ? s : c;
		return {
			prompt: "Segui l'inserimento: un confronto ogni volta che l'elemento tenuto da parte incontra un elemento alla sua sinistra.",
			problem: `I primi ${k} elementi del vettore ${row(v)} sono già in ordine tra loro. Quanti ${what} servono per inserire l'elemento di indice ${k}, cioè ${the(x)}?`,
			solution: what === 'confronti' ? comparisonsOf(c) : shiftsOf(s),
			steps: [
				`${The(x)} viene confrontato con ${row(compared)}${c > 1 ? ', da destra verso sinistra' : ''}: ${comparisonsOf(c)}.`,
				s === 0 ? 'Nessuno di questi elementi è più grande, quindi nessuno si sposta: 0 spostamenti.' : `Si spostano di un posto a destra solo gli elementi più grandi, cioè ${row(moved)}: ${shiftsOf(s)}.`,
				place === 0 ? "Arrivato all'inizio del vettore non c'è un elemento che ferma la ricerca: i confronti sono quanti gli spostamenti." : `Il confronto con ${the(v[place - 1])}, che non è più grande, ferma la ricerca e non sposta niente: è il confronto in più.`
			],
			answer: numbers(right, [other, right + 1, right - 1, k, k + 1, right + 2, k - 1]),
			params: { case: family, what, vector: v, k }
		};
	}
	const n = rng.int(4, 6);
	const v = distinct(rng, n, 1, 20);
	const all = insertions(v);
	const cs = all.map((one) => one.compared.length);
	const ss = all.map((one) => one.moved.length);
	const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
	const [c, s] = [sum(cs), sum(ss)];
	const right = what === 'confronti' ? c : s;
	const other = what === 'confronti' ? s : c;
	return {
		prompt: 'Inserisci un elemento alla volta, dal secondo in poi, e conta.',
		problem: `Quanti ${what} fa in tutto l'ordinamento per inserimento per mettere in ordine crescente il vettore ${row(v)}?`,
		solution: what === 'confronti' ? comparisonsOf(c) : shiftsOf(s),
		steps: [
			`Per ogni elemento inserito: ${all.map((one, i) => `${the(one.x)} chiede ${comparisonsOf(cs[i])} e ${shiftsOf(ss[i])}`).join('; ')}.`,
			`In tutto ${what === 'confronti' ? 'i confronti' : 'gli spostamenti'} sono ${(what === 'confronti' ? cs : ss).join(' + ')} = ${right}.`,
			"In ogni inserimento i confronti sono quanti gli spostamenti, oppure uno in più: quello con l'elemento che ferma la ricerca."
		],
		answer: numbers(right, [other, (n * (n - 1)) / 2, n - 1, right + 1, right - 1, right + n - 1, n, right + 2]),
		params: { case: family, what, vector: v }
	};
}

// ---------------------------------------------------------------------------------------------------------------
// the function `ordina`, right and wrong

/** One `ordina`: the lesson's when every field has its first value, and one mistake for every other value. */
interface Sort {
	/** `v[j] > x` puts the vector in increasing order, `v[j] < x` in decreasing order. */
	order: '>' | '<';
	/** `x = v[i]` and `x` used after; `late`: `x` is there, but the last row writes `v[i]`; `none`: no `x` at all. */
	keep: 'x' | 'late' | 'none';
	loop: 'while' | 'if';
	guard: 'j >= 0' | 'j > 0';
	/** `v[j + 1] = v[j]`; missing; written backwards, `v[j] = v[j + 1]`. */
	shift: 'right' | 'none' | 'back';
	/** Where the element goes in at the end. */
	put: 'j + 1' | 'i';
	from: 1 | 2;
	to: 'n' | 'n - 1';
	/** A counter `s` that the function gives back: of the shifts, or (wrong) of the turns of the outer loop. */
	count: 'none' | 'shift' | 'turn';
	first: 0 | 1;
	/** What is written after each insertion: the index where the element went in, `j`, the whole vector on a row. */
	trace: 'none' | 'place' | 'j' | 'vector';
}

const SORT: Sort = { order: '>', keep: 'x', loop: 'while', guard: 'j >= 0', shift: 'right', put: 'j + 1', from: 1, to: 'n', count: 'none', first: 0, trace: 'none' };

/** The mistakes a student makes in the loops, each a different one; none reads or writes outside the vector. */
const mistakes = (right: Sort): Sort[] => [
	{ ...right, keep: 'late' },
	{ ...right, put: 'i' },
	{ ...right, order: right.order === '>' ? '<' : '>' },
	{ ...right, guard: 'j > 0' },
	{ ...right, loop: 'if' },
	{ ...right, from: 2 },
	{ ...right, to: 'n - 1' },
	{ ...right, shift: 'none' },
	{ ...right, shift: 'back' }
];

/** The rows of the function after its first one, without indentation: what an option shows. */
function loopPython(s: Sort): string[] {
	const held = s.keep === 'none' ? 'v[i]' : 'x';
	const counted = s.count !== 'none';
	return [
		...(counted ? [`s = ${s.first}`] : []),
		`for i in range(${s.from}, ${s.to}):`,
		...(s.keep === 'none' ? [] : ['    x = v[i]']),
		'    j = i - 1',
		`    ${s.loop} ${s.guard} and v[j] ${s.order} ${held}:`,
		...(s.shift === 'right' ? ['        v[j + 1] = v[j]'] : s.shift === 'back' ? ['        v[j] = v[j + 1]'] : []),
		'        j = j - 1',
		...(s.count === 'shift' ? ['        s = s + 1'] : []),
		`    v[${s.put}] = ${s.keep === 'x' ? 'x' : 'v[i]'}`,
		...(s.count === 'turn' ? ['    s = s + 1'] : []),
		...(s.trace === 'place' ? ['    print(j + 1)'] : s.trace === 'j' ? ['    print(j)'] : s.trace === 'vector' ? ['    for k in range(n):', '        print(v[k], end=" ")', '    print()'] : []),
		...(counted ? ['return s'] : [])
	];
}

function loopCpp(s: Sort): string[] {
	const held = s.keep === 'none' ? 'v[i]' : 'x';
	const counted = s.count !== 'none';
	return [
		...(counted ? [`int s = ${s.first};`] : []),
		`for (int i = ${s.from}; i < ${s.to}; i++) {`,
		...(s.keep === 'none' ? [] : ['    int x = v[i];']),
		'    int j = i - 1;',
		`    ${s.loop} (${s.guard} && v[j] ${s.order} ${held}) {`,
		...(s.shift === 'right' ? ['        v[j + 1] = v[j];'] : s.shift === 'back' ? ['        v[j] = v[j + 1];'] : []),
		'        j = j - 1;',
		...(s.count === 'shift' ? ['        s = s + 1;'] : []),
		'    }',
		`    v[${s.put}] = ${s.keep === 'x' ? 'x' : 'v[i]'};`,
		...(s.count === 'turn' ? ['    s = s + 1;'] : []),
		...(s.trace === 'place' ? ['    cout << j + 1 << endl;'] : s.trace === 'j' ? ['    cout << j << endl;'] : s.trace === 'vector' ? ['    for (int k = 0; k < n; k++) {', '        cout << v[k] << " ";', '    }', '    cout << endl;'] : []),
		'}',
		...(counted ? ['return s;'] : [])
	];
}

const indented = (rows: string[]) => rows.map((r) => `    ${r}`);
const sortPython = (s: Sort) => ['def ordina(v):', '    n = len(v)', ...indented(loopPython(s))].join('\n');
const sortCpp = (s: Sort) => [`${s.count === 'none' ? 'void' : 'int'} ordina(int v[], int n) {`, ...indented(loopCpp(s)), '}'].join('\n');
/** The loops alone, for an option; the whole function, for the solution. */
const loopShown = (s: Sort) => ({ python: loopPython(s).join('\n'), cpp: loopCpp(s).join('\n') });
const sortShown = (s: Sort) => ({ python: sortPython(s), cpp: sortCpp(s) });

/** What `ordina` does to a vector: the vector after, the rows written, what it gives back. Throws outside the vector. */
function sortRun(s: Sort, start: readonly number[]): { v: number[]; out: string[]; count: number } {
	const v = [...start];
	const n = v.length;
	const out: string[] = [];
	const at = (k: number) => {
		if (k < 0 || k >= n) throw new Error('outside the vector');
		return v[k];
	};
	const set = (k: number, value: number) => {
		at(k);
		v[k] = value;
	};
	const beyond = (a: number, b: number) => (s.order === '>' ? a > b : a < b);
	let count: number = s.first;
	for (let i = s.from; i < (s.to === 'n' ? n : n - 1); i++) {
		const x = at(i);
		const held = () => (s.keep === 'none' ? at(i) : x);
		let j = i - 1;
		while ((s.guard === 'j >= 0' ? j >= 0 : j > 0) && beyond(at(j), held())) {
			if (s.shift === 'right') set(j + 1, at(j));
			if (s.shift === 'back') set(j, at(j + 1));
			j = j - 1;
			if (s.count === 'shift') count++;
			if (s.loop === 'if') break;
		}
		set(s.put === 'i' ? i : j + 1, s.keep === 'x' ? x : at(i));
		if (s.count === 'turn') count++;
		if (s.trace === 'place') out.push(String(j + 1));
		if (s.trace === 'j') out.push(String(j));
		if (s.trace === 'vector') out.push(v.join(' '));
	}
	return { v, out, count };
}

/** What the program does with the vector after the call: writes it one element per row, writes what `ordina` gives back, nothing. */
type Shows = 'vector' | 'count' | 'nothing';

const after = (s: Sort, values: readonly number[], shows: Shows) => {
	const run = sortRun(s, values);
	return [...run.out, ...(shows === 'vector' ? run.v.map(String) : shows === 'count' ? [String(run.count)] : [])];
};

/** The program around `ordina` with its vectors written in it. One vector has its size in `N`, as in the lesson. */
function writtenProgram(s: Sort, vectors: { name: string; values: number[] }[], shows: Shows): Program {
	const python = vectors.flatMap(({ name, values }) => [`${name} = ${pyList(values)}`, ...(shows === 'count' ? [`print(ordina(${name}))`] : [`ordina(${name})`]), ...(shows === 'vector' ? [`for x in ${name}:`, '    print(x)'] : [])]);
	const cpp = vectors.flatMap(({ name, values }) => {
		const size = vectors.length === 1 ? 'N' : String(values.length);
		return [
			...(vectors.length === 1 ? [`const int N = ${values.length};`] : []),
			`int ${name}[${size}] = ${cppList(values)};`,
			...(shows === 'count' ? [`cout << ordina(${name}, ${size}) << endl;`] : [`ordina(${name}, ${size});`]),
			...(shows === 'vector' ? [`for (int i = 0; i < ${size}; i++) {`, `    cout << ${name}[i] << endl;`, '}'] : [])
		];
	});
	return program(`${sortPython(s)}\n\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), sortCpp(s)), () => vectors.flatMap(({ values }) => after(s, values, shows)));
}

/**
 * The rows that read `n` and then `n` numbers into a vector, one per row. The array has its size written in it, without
 * the constant `MAX` of the lesson: with that row the whole C++ program would be longer than the 28 rows it may have.
 */
const readPython = (name: string) => ['n = int(input())', `${name} = []`, 'for i in range(n):', `    ${name}.append(int(input()))`];
const readCpp = (name: string, more = '') => [`int ${name}[100];`, `int n${more};`, 'cin >> n;', 'for (int i = 0; i < n; i++) {', `    cin >> ${name}[i];`, '}'];

/** The program that reads the vector, calls `ordina` and writes; and the same without the function and its call, to start from. */
function readProgram(s: Sort, name: string, shows: 'vector' | 'count'): { whole: Program; start: { python: string; cpp: string } } {
	const printPython = [`for x in ${name}:`, '    print(x)'];
	const printCpp = ['for (int i = 0; i < n; i++) {', `    cout << ${name}[i] << endl;`, '}'];
	const python = [...readPython(name), ...(shows === 'count' ? [`print(ordina(${name}))`] : [`ordina(${name})`, ...printPython])];
	const cpp = [...readCpp(name), ...(shows === 'count' ? [`cout << ordina(${name}, n) << endl;`] : [`ordina(${name}, n);`, ...printCpp])];
	const whole = program(`${sortPython(s)}\n\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), sortCpp(s)), (input) => {
		const next = reader(input);
		const n = Number(next());
		const values = Array.from({ length: n }, () => Number(next()));
		return after(s, values, shows);
	});
	const rest = shows === 'count' ? ['scrivi qui il resto'] : ['scrivi qui la chiamata a ordina'];
	const start = {
		python: ['# scrivi qui la funzione ordina', '', ...readPython(name), `# ${rest[0]}`, ...(shows === 'count' ? [] : printPython)].join('\n'),
		cpp: cppProgram([...readCpp(name), `// ${rest[0]}`, ...(shows === 'count' ? [] : printCpp)].join('\n'), '// scrivi qui la funzione ordina')
	};
	return { whole, start };
}

const NAMES = ['carte', 'voti', 'punti', 'tempi', 'pesi', 'prezzi'] as const;
const NOUNS: Record<(typeof NAMES)[number], string> = { carte: 'i valori di alcune carte', voti: 'i voti di una classe', punti: 'i punteggi di una gara', tempi: 'i tempi di una corsa, in secondi', pesi: 'i pesi di alcuni pacchi, in chili', prezzi: 'i prezzi di alcuni libri, in euro' };

// ---------------------------------------------------------------------------------------------------------------
// level 3: what a program writes

type Shown = 'posti' | 'conta' | 'giri' | 'senza x';
const SHOWN: readonly Shown[] = ['posti', 'conta', 'giri', 'senza x'];

function level3(rng: Rng, family: Shown): CodeBuilt {
	const name = rng.pick(NAMES);
	const n = family === 'giri' ? 4 : family === 'senza x' ? rng.int(4, 5) : rng.int(5, 6);
	const v = distinct(rng, n, 1, 9);
	const all = insertions(v);
	const shifts = all.map((one) => one.moved.length);
	const total = shifts.reduce((a, b) => a + b, 0);
	if (same(v, ascending(v)) || (family === 'conta' && total < 2) || (family === 'posti' && new Set(all.map((one) => one.place)).size < 3)) throw new TooFew(`${ID}: a vector with too little to do`);

	const shows: Shows = family === 'conta' ? 'count' : family === 'senza x' ? 'vector' : 'nothing';
	const whole = (s: Sort) => writtenProgram(s, [{ name, values: v }], shows);
	const base: Sort = family === 'posti' ? { ...SORT, trace: 'place' } : family === 'conta' ? { ...SORT, count: 'shift' } : family === 'giri' ? { ...SORT, trace: 'vector' } : { ...SORT, keep: 'none' };
	// what the same program writes with one more mistake, or, for the function without x, with the mistake mended
	const variants: Sort[] =
		family === 'posti'
			? [{ ...base, trace: 'j' }, ...mistakes(base).slice(2, 6)]
			: family === 'conta'
				? [{ ...base, count: 'turn' }, { ...base, first: 1 }, ...mistakes(base).slice(2, 6)]
				: family === 'giri'
					? shuffle(rng, mistakes(base))
					: [SORT, { ...SORT, keep: 'late' }, { ...SORT, order: '<' }, { ...SORT, put: 'i' }, { ...SORT, loop: 'if' }];
	const shown = whole(base);
	const rows = written(shown)!;
	const others = wrongPrograms(shown, variants.map(whole), [[]]).map((p) => written(p)!);
	// what a student answers without following the loops
	const guesses: string[][] = family === 'posti' ? [shifts.map(String), all.map((one) => String(one.compared.length))] : family === 'conta' ? [[String(all.reduce((a, one) => a + one.compared.length, 0))], [String((n * (n - 1)) / 2)], [String(total + 1)]] : family === 'senza x' ? [v.map(String)] : [];
	const option = family === 'giri' ? printedOption : writtenOption;

	const told: Record<Shown, { prompt: string; problem: string; solution: string; steps: string[] }> = {
		posti: {
			prompt: 'Segui il ciclo interno per ogni elemento, dal secondo in poi.',
			problem: 'Che cosa scrive questo programma?',
			solution: rows.join(', '),
			steps: ["Dopo ogni inserimento la funzione scrive j + 1, cioè l'indice del posto libero in cui è entrato x: un numero per ogni elemento dal secondo in poi.", `${all.map((one, i) => `${i === 0 ? The(one.x) : the(one.x)} entra all'indice ${one.place}`).join(', ')}.`]
		},
		conta: {
			prompt: 'Guarda in quale punto della funzione aumenta la variabile s.',
			problem: 'Che cosa scrive questo programma?',
			solution: String(total),
			steps: ['La variabile s aumenta di 1 dentro il ciclo interno, cioè a ogni spostamento: la funzione restituisce il numero di spostamenti.', `Gli elementi inseriti sono ${row(all.map((one) => one.x))} e fanno spostare ${shifts.join(', ')} elementi.`, `In tutto ${shifts.join(' + ')} = ${total}.`]
		},
		giri: {
			prompt: 'Segui un inserimento alla volta.',
			problem: 'Che cosa scrive questo programma?',
			solution: rows.join('; '),
			steps: [`Dopo ogni inserimento la funzione scrive tutto il vettore su una riga: le righe sono ${n - 1}, una per ogni elemento dal secondo in poi.`, "Dopo l'inserimento dell'elemento di indice i i primi i + 1 elementi sono in ordine tra loro, e quelli dopo non sono ancora stati toccati.", `Le righe sono quindi ${rows.join('; ')}.`]
		},
		'senza x': {
			prompt: "Segui il programma così com'è scritto, non come dovrebbe essere.",
			problem: "In questa funzione ordina l'elemento da inserire non viene copiato in una variabile x prima degli spostamenti. Che cosa scrive il programma?",
			solution: rows.join(', '),
			steps: [
				"Il confronto e l'ultima istruzione usano v[i], ma il primo spostamento copia v[i - 1] sopra v[i]: il valore da inserire va perso.",
				`Ogni elemento più piccolo di quello alla sua sinistra viene quindi sostituito da una sua copia: il programma scrive ${rows.join(', ')}, con dei doppioni.`
			]
		}
	};
	return {
		...told[family],
		code: texts(shown),
		answer: pick(rng, option(rows), [...others, ...guesses].map(option)),
		params: reference(shown, [[]], { ask: 'output', case: family, vector: v })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// level 4: which loop sorts

type Order = 'crescente' | 'decrescente';
const ORDERS: readonly Order[] = ['crescente', 'decrescente'];

const sortSteps = (s: Sort) => [
	"Per prima cosa x = v[i] tiene da parte l'elemento: il primo spostamento scrive sopra v[i].",
	`Il ciclo interno parte da j = i - 1 e continua finché j >= 0 e v[j] ${s.order} x: ogni volta copia v[j] in v[j + 1] e fa tornare j indietro di uno.`,
	'Alla fine il posto libero è la cella di indice j + 1, ed è lì che entra x.'
];

function level4(rng: Rng, order: Order): CodeBuilt {
	const vectors = [
		{ name: 'a', values: distinct(rng, 5, 1, 9) },
		{ name: 'b', values: distinct(rng, 6, 1, 9) }
	];
	const base: Sort = { ...SORT, order: order === 'crescente' ? '>' : '<' };
	const right = writtenProgram(base, vectors, 'vector');
	const wrong = shuffle(rng, mistakes(base)).map((s) => ({ sort: s, whole: writtenProgram(s, vectors, 'vector') }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]]
	);
	// two vectors that tell nearly every mistake from the right function, so that any three can come out
	if (kept.length < 7) throw new TooFew(`${ID}: only ${kept.length} wrong loops`);
	return {
		prompt: 'Ogni risposta è il ciclo che sta nel corpo della funzione ordina: leggilo una riga alla volta.',
		problem: `La funzione ordina deve mettere il vettore v di n elementi in ordine ${order} con l'ordinamento per inserimento. Quale ciclo fa questo lavoro?`,
		solution: `Il ciclo che copia v[i] in x, sposta a destra con un while gli elementi con v[j] ${base.order} x e alla fine scrive x in v[j + 1].`,
		steps: sortSteps(base),
		solutionCode: sortShown(base),
		answer: choose(
			rng,
			programOption(right, loopShown(base)),
			kept.map((p) => programOption(p, loopShown(wrong.find((w) => w.whole === p)!.sort)))
		),
		params: reference(right, [[]], { case: order, vectors: vectors.map((x) => x.values) })
	};
}

// ---------------------------------------------------------------------------------------------------------------
// level 5: write the function

/** The function `inserisci` of the second exercise of the lesson: one new element into a vector already in order. */
interface Insert {
	order: '>' | '<';
	/** `none`: the element is only added at the end. */
	loop: 'while' | 'if' | 'none';
	guard: 'j >= 0' | 'j > 0';
	/** Where the element goes in at the end: the free place, or (wrong) the last cell again. */
	put: 'j + 1' | 'end';
}

const INSERT: Insert = { order: '>', loop: 'while', guard: 'j >= 0', put: 'j + 1' };
const insertMistakes: Insert[] = [
	{ ...INSERT, order: '<' },
	{ ...INSERT, loop: 'if' },
	{ ...INSERT, guard: 'j > 0' },
	{ ...INSERT, loop: 'none' },
	{ ...INSERT, put: 'end' }
];

/** The body of `inserisci`. In Python the list grows with `append`; in C++ the array has a free cell at index n. */
const insertPython = (s: Insert) => ['v.append(x)', ...(s.loop === 'none' ? [] : ['j = len(v) - 2', `${s.loop} ${s.guard} and v[j] ${s.order} x:`, '    v[j + 1] = v[j]', '    j = j - 1', s.put === 'end' ? 'v[len(v) - 1] = x' : 'v[j + 1] = x'])];
const insertCpp = (s: Insert) => (s.loop === 'none' ? ['v[n] = x;'] : ['int j = n - 1;', `${s.loop} (${s.guard} && v[j] ${s.order} x) {`, '    v[j + 1] = v[j];', '    j = j - 1;', '}', s.put === 'end' ? 'v[n] = x;' : 'v[j + 1] = x;']);
const insertShown = (s: Insert) => ({ python: insertPython(s).join('\n'), cpp: insertCpp(s).join('\n') });

/**
 * The vector after `inserisci`. The two languages start apart: in Python the last cell holds `x` from the start, in
 * C++ nothing until it is written. It throws at an index outside the vector, at a cell read before it is written,
 * and where the two would end differently.
 */
function insertRun(s: Insert, start: readonly number[], x: number): number[] {
	const one = (last: number | undefined) => {
		const v: (number | undefined)[] = [...start, last];
		const n = start.length;
		const at = (k: number) => {
			const value = v[k];
			if (k < 0 || k > n || value === undefined) throw new Error('outside the vector');
			return value;
		};
		if (s.loop === 'none') v[n] = x;
		else {
			let j = n - 1;
			while ((s.guard === 'j >= 0' ? j >= 0 : j > 0) && (s.order === '>' ? at(j) > x : at(j) < x)) {
				v[j + 1] = at(j);
				j = j - 1;
				if (s.loop === 'if') break;
			}
			v[s.put === 'end' ? n : j + 1] = x;
		}
		return v.map((_, k) => at(k));
	};
	const [python, cpp] = [one(x), one(undefined)];
	if (!same(python, cpp)) throw new Error('the two languages differ');
	return python;
}

function insertProgram(s: Insert, name: string): Program {
	const python = [...readPython(name), 'nuovo = int(input())', `inserisci(${name}, nuovo)`, `for x in ${name}:`, '    print(x)'];
	const cpp = [...readCpp(name, ', nuovo'), 'cin >> nuovo;', `inserisci(${name}, n, nuovo);`, 'for (int i = 0; i < n + 1; i++) {', `    cout << ${name}[i] << endl;`, '}'];
	return program(`${['def inserisci(v, x):', ...indented(insertPython(s))].join('\n')}\n\n${python.join('\n')}\n`, cppProgram(cpp.join('\n'), ['void inserisci(int v[], int n, int x) {', ...indented(insertCpp(s)), '}'].join('\n')), (input) => {
		const next = reader(input);
		const n = Number(next());
		const values = Array.from({ length: n }, () => Number(next()));
		return insertRun(s, values, Number(next())).map(String);
	});
}

type Task = 'crescente' | 'decrescente' | 'spostamenti' | 'inserisci';
const TASKS: readonly Task[] = ['crescente', 'decrescente', 'spostamenti', 'inserisci'];

const typed = (values: readonly number[], ...more: number[]) => [values.length, ...values, ...more].map(String);

function level5(rng: Rng, task: Task): CodeBuilt {
	const name = rng.pick(NAMES);
	if (task === 'inserisci') {
		// the new element goes in the middle after two shifts at least, before all the others, after all the others
		const tests = (['mezzo', 'inizio', 'fermo'] as const).map((where) => {
			for (;;) {
				const all = distinct(rng, rng.int(4, 6), 1, 60);
				const values = ascending(all.slice(1));
				const place = insertion([...values, all[0]], values.length).place;
				if (where === 'inizio' ? place === 0 : where === 'fermo' ? place === values.length : place >= 1 && place <= values.length - 2) return typed(values, all[0]);
			}
		});
		const solution = insertProgram(INSERT, name);
		const wrong = shuffle(rng, insertMistakes).map((s) => ({ insert: s, whole: insertProgram(s, name) }));
		const kept = wrongPrograms(
			solution,
			wrong.map((w) => w.whole),
			tests
		);
		if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions`);
		const start = {
			python: ['# scrivi qui la funzione inserisci', '', ...readPython(name), 'nuovo = int(input())', '# scrivi qui la chiamata a inserisci', `for x in ${name}:`, '    print(x)'].join('\n'),
			cpp: cppProgram([...readCpp(name, ', nuovo'), 'cin >> nuovo;', '// scrivi qui la chiamata', 'for (int i = 0; i < n + 1; i++) {', `    cout << ${name}[i] << endl;`, '}'].join('\n'), '// scrivi qui la funzione inserisci:\n// v ha un posto libero in fondo')
		};
		return {
			prompt: 'Scrivi il programma.',
			problem: `Il programma legge un numero intero n, poi n numeri interi già in ordine crescente, uno per riga (${NOUNS[name]}), e infine un numero nuovo. Scrivi una funzione inserisci che mette il numero nuovo al posto giusto spostando a destra quelli più grandi, poi chiamala: il programma scrive gli n + 1 numeri in ordine, uno per riga. La lettura e la scrittura ci sono già.`,
			solution: 'Una funzione inserisci che parte dal fondo, sposta a destra gli elementi più grandi di x e mette x nel posto libero.',
			steps: [
				"Il vettore è già in ordine, quindi basta un solo inserimento: j parte dall'ultimo elemento (in Python aggiungi prima un posto in fondo con append).",
				'Finché j >= 0 e v[j] > x, copia v[j] in v[j + 1] e fai tornare j indietro di uno; poi x entra in v[j + 1].',
				'Dopo la lettura chiama inserisci con il vettore e il numero nuovo: la scrittura degli n + 1 numeri è già nel programma.'
			],
			solutionCode: texts(solution),
			answer: needing(programAnswer(solution, start, tests), 'funzione'),
			choice: choose(
				rng,
				programOption(solution, insertShown(INSERT)),
				kept.map((p) => programOption(p, insertShown(wrong.find((w) => w.whole === p)!.insert)))
			),
			params: reference(solution, tests, { case: task, name })
		};
	}

	const base: Sort = { ...SORT, order: task === 'decrescente' ? '<' : '>', count: task === 'spostamenti' ? 'shift' : 'none' };
	const shows = task === 'spostamenti' ? 'count' : 'vector';
	const inOrder = (v: number[]) => (task === 'decrescente' ? ascending(v).reverse() : ascending(v));
	let tests: string[][];
	if (task === 'spostamenti') {
		// three vectors that ask for three different numbers of shifts
		const counts = new Set<number>();
		tests = [5, 6, 4].map((n) => {
			for (;;) {
				const v = distinct(rng, n, 1, 60);
				const count = sortRun(base, v).count;
				if (count >= 2 && !counts.has(count)) {
					counts.add(count);
					return typed(v);
				}
			}
		});
	} else {
		// a vector out of order, one with a number twice, one already in order
		const first = distinct(rng, rng.int(5, 6), 1, 60);
		const twice = distinct(rng, 3, 1, 60);
		const second = shuffle(rng, [...twice, twice[rng.int(0, 2)]]);
		const third = inOrder(distinct(rng, rng.int(3, 4), 1, 60));
		if (same(first, inOrder(first)) || same(second, inOrder(second))) throw new TooFew(`${ID}: a test already in order`);
		tests = [first, second, third].map((v) => typed(v));
	}
	const { whole: solution, start } = readProgram(base, name, shows);
	const candidates = task === 'spostamenti' ? [{ ...base, count: 'turn' as const }, { ...base, first: 1 as const }, ...mistakes(base)] : mistakes(base);
	const wrong = shuffle(rng, candidates).map((s) => ({ sort: s, whole: readProgram(s, name, shows).whole }));
	const kept = wrongPrograms(
		solution,
		wrong.map((w) => w.whole),
		tests
	);
	if (kept.length < 5) throw new TooFew(`${ID}: only ${kept.length} wrong functions`);
	const problem =
		task === 'spostamenti'
			? `Il programma legge un numero intero n e poi n numeri interi, uno per riga: sono ${NOUNS[name]}. Scrivi una funzione ordina che li mette in ordine crescente con l'ordinamento per inserimento e restituisce il numero di spostamenti fatti, poi chiamala e scrivi quel numero. La lettura c'è già.`
			: `Il programma legge un numero intero n e poi n numeri interi, uno per riga: sono ${NOUNS[name]}. Scrivi una funzione ordina che li mette in ordine ${task} con l'ordinamento per inserimento, poi chiamala: il programma scrive i numeri in ordine, uno per riga. La lettura e la scrittura ci sono già.`;
	return {
		prompt: 'Scrivi il programma.',
		problem,
		solution:
			task === 'spostamenti'
				? 'Una funzione ordina con un contatore che aumenta di 1 a ogni spostamento e viene restituito alla fine.'
				: `Una funzione ordina che tiene da parte ogni elemento in x, sposta a destra quelli con v[j] ${base.order} x e mette x nel posto libero.`,
		steps: [
			...sortSteps(base).slice(0, 2),
			task === 'spostamenti' ? 'Un contatore parte da 0 e aumenta di 1 dentro il ciclo interno, a ogni spostamento; dopo che x è entrato in v[j + 1] per tutti gli elementi, la funzione lo restituisce e il programma lo scrive.' : 'Alla fine x entra in v[j + 1]. Dopo la lettura chiama ordina sul vettore: la scrittura è già nel programma.'
		],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'funzione'),
		choice: choose(
			rng,
			programOption(solution, loopShown(base)),
			kept.map((p) => programOption(p, loopShown(wrong.find((w) => w.whole === p)!.sort)))
		),
		params: reference(solution, tests, { case: task, name })
	};
}

export default makeCodeGenerator(ID, "L'ordinamento per inserimento", {
	1: { label: 'Inserire un elemento', constraints: ['5 or 6 different numbers, the first k in order', 'the options are four different vectors'], build: drawn(WHERE, level1) },
	2: { label: 'Confronti e spostamenti', constraints: ['one insertion, or a whole vector of 4 to 6 numbers', 'counted as the lesson counts'], build: drawn(COUNTS, level2) },
	3: { label: 'Che cosa scrive il programma', constraints: ['a whole program with ordina and a vector of 4 to 6 digits', 'four different outputs'], build: drawn(SHOWN, level3) },
	4: { label: 'Quale ciclo ordina', constraints: ['four loops of ordina that leave different vectors', 'no option reads or writes outside the vector'], build: drawn(ORDERS, level4) },
	5: { label: "Scrivere l'inserimento", constraints: ['the program reads n and then n numbers', 'graded by running it on three inputs', 'needs a function of its own'], build: drawn(TASKS, level5) }
});
