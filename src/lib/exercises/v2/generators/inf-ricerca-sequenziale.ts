/**
 * Exercises for the lesson "La ricerca sequenziale" (informatica, third year).
 * Spec: specs/exercises/inf-ricerca-sequenziale.md
 *
 * 1. how many comparisons a search makes on a vector given in words; 2. what a search program prints (the first
 * occurrence, the last, none, how many); 3. which function searches as asked (options that are programs, shown by
 * their function alone); 4. best, worst and average case, in words; 5. write a search (open answer, needs a vector).
 *
 * The programs are written by hand in the two languages (v2/inf-codice.ts), with the names of the lesson:
 * `posizione` from -1, `trovato`, `volte`, the function `cerca(v, x)`.
 */
import type { Rng } from '../types';
import { OPTION_WIDTH, shuffle, choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-ricerca-sequenziale';

const NAMES = ['voti', 'punti', 'passi', 'tempi', 'pesi', 'gol'] as const;

/** `size` different whole numbers from `lo` to `hi`, in the order drawn. */
function distinct(rng: Rng, size: number, lo: number, hi: number): number[] {
	const v: number[] = [];
	while (v.length < size) {
		const x = rng.int(lo, hi);
		if (!v.includes(x)) v.push(x);
	}
	return v;
}

/**
 * A vector of `size` numbers from 2 to 12 (from 1 to `hi` when `hi` is of one digit) where `x` is at `times` places (0: it is not there) and every other
 * number is there once. With `inner` no occurrence is the first element or the last.
 */
function repeated(rng: Rng, size: number, times: number, inner = false, hi = 12): { v: number[]; x: number; places: number[] } {
	const [x, ...rest] = distinct(rng, size + 1, hi < 10 ? 1 : 2, hi);
	const v = rest.slice(0, size);
	const places = distinct(rng, times, inner ? 1 : 0, size - (inner ? 2 : 1)).sort((a, b) => a - b);
	for (const p of places) v[p] = x;
	return { v, x, places };
}

/** A level whose numbers are drawn again when they leave too few wrong answers; the family is drawn once, before. */
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

const numbers = (rng: Rng, right: number, wrong: number[]) => pick(rng, textOption(String(right)), wrong.map((x) => textOption(String(x))));
const confronti = (n: number) => `${n} ${n === 1 ? 'confronto' : 'confronti'}`;

// ---------------------------------------------------------------- level 1: how many comparisons

const COUNTS = ['presente', 'assente', 'ripetuto'] as const;

function level1(rng: Rng, family: (typeof COUNTS)[number]): CodeBuilt {
	const n = rng.int(6, 8);
	const name = rng.pick(NAMES);
	const { v, x, places } = repeated(rng, n, family === 'presente' ? 1 : family === 'assente' ? 0 : 2);
	const first = places.length ? places[0] : -1;
	const right = first < 0 ? n : first + 1;
	if (family === 'presente' && first === 0 && rng.int(0, 2) > 0) throw new TooFew('the first place comes out less often');
	const said = `Il vettore ${name} contiene, in ordine, i valori ${v.join(', ')}. La ricerca sequenziale cerca il valore ${x} partendo dal primo elemento e si ferma appena lo trova.`;
	return {
		prompt: 'Conta un confronto per ogni elemento guardato.',
		problem: `${said} Quanti confronti fa?`,
		solution: confronti(right),
		steps:
			first < 0
				? [`Il valore ${x} non è nel vettore: nessun confronto riesce.`, `Per saperlo la ricerca deve confrontare tutti gli elementi, uno alla volta.`, `Gli elementi sono ${n}: ${confronti(n)}. È il caso peggiore.`]
				: [`Il primo elemento uguale a ${x} è ${name}[${first}], quello di indice ${first}.`, first === 0 ? 'È il primo elemento guardato: la ricerca si ferma subito.' : first === 1 ? `Prima di lui la ricerca confronta solo ${name}[0], che è diverso.` : `Prima di lui la ricerca confronta gli elementi dagli indici 0 a ${first - 1}, che sono ${first}, e nessuno è uguale.`, `In tutto ${first} + 1 = ${confronti(first + 1)}${places.length > 1 ? `: il secondo ${x}, all'indice ${places[1]}, non viene guardato` : ''}.`],
		answer: numbers(rng, right, first < 0 ? [n - 1, n + 1, 1, 0] : [first, ...(places.length > 1 ? [places[1] + 1] : []), n, first + 2, n - first, 1]),
		params: { case: family, name, vector: v, x }
	};
}

// ---------------------------------------------------------------- level 2: what a search prints

const SEARCHES = ['prima', 'ultima', 'assente', 'conta'] as const;
/** How the program searches: it stops at the first element found, it goes on to the end, it counts. */
type Way = 'ferma' | 'avanti' | 'conta';

const searchValue = (way: Way, v: readonly number[], x: number) => (way === 'ferma' ? v.indexOf(x) : way === 'avanti' ? v.lastIndexOf(x) : v.filter((y) => y === x).length);

function searchProgram(way: Way, name: string, v: readonly number[], x: number): Program {
	const el = `${name}[i]`;
	const python =
		way === 'ferma'
			? ['posizione = -1', 'i = 0', `while i < len(${name}) and posizione == -1:`, `    if ${el} == x:`, '        posizione = i', '    i = i + 1', 'print(posizione)']
			: way === 'avanti'
				? ['posizione = -1', `for i in range(len(${name})):`, `    if ${el} == x:`, '        posizione = i', 'print(posizione)']
				: ['volte = 0', `for i in range(len(${name})):`, `    if ${el} == x:`, '        volte = volte + 1', 'print(volte)'];
	const cpp =
		way === 'ferma'
			? ['int posizione = -1;', 'int i = 0;', 'while (i < N && posizione == -1) {', `    if (${el} == x) {`, '        posizione = i;', '    }', '    i = i + 1;', '}', 'cout << posizione << endl;']
			: way === 'avanti'
				? ['int posizione = -1;', 'for (int i = 0; i < N; i++) {', `    if (${el} == x) {`, '        posizione = i;', '    }', '}', 'cout << posizione << endl;']
				: ['int volte = 0;', 'for (int i = 0; i < N; i++) {', `    if (${el} == x) {`, '        volte = volte + 1;', '    }', '}', 'cout << volte << endl;'];
	return program([`${name} = ${pyList(v)}`, `x = ${x}`, ...python].join('\n'), cppProgram([`int ${name}[N] = ${cppList(v)};`, `int x = ${x};`, ...cpp].join('\n'), `const int N = ${v.length};`), () => [String(searchValue(way, v, x))]);
}

function level2(rng: Rng, family: (typeof SEARCHES)[number]): CodeBuilt {
	const n = rng.int(6, 7);
	const name = rng.pick(NAMES);
	const way: Way = family === 'prima' ? 'ferma' : family === 'ultima' ? 'avanti' : family === 'conta' ? 'conta' : rng.pick(['ferma', 'avanti'] as const);
	// numbers of one digit, so that the row that declares the vector fits under the question
	const { v, x, places } = repeated(rng, n, family === 'assente' ? 0 : family === 'conta' ? rng.int(2, 3) : 2, false, 9);
	const shown = searchProgram(way, name, v, x);
	const rows = written(shown)!;
	const first = places[0] ?? -1;
	const last = places[places.length - 1] ?? -1;
	// the other occurrence, the place counted from 1, "not found", how many there are, the value itself, the size
	const others = (family === 'assente' ? [0, n, n - 1, x, 1] : family === 'conta' ? [1, last, first, places.length + 1, x, n] : [family === 'prima' ? last : first, Number(rows[0]) + 1, -1, places.length, x]).map((y) => [String(y)]);
	const steps =
		family === 'assente'
			? [`Il ciclo confronta ogni elemento di ${name} con x, che vale ${x}: nessuno è uguale.`, 'La variabile posizione non viene mai cambiata e resta al valore di partenza.', 'Il programma scrive -1, che vuol dire "non trovato".']
			: family === 'conta'
				? [`Il ciclo guarda tutti gli elementi e aumenta volte di 1 ogni volta che ${name}[i] è uguale a ${x}.`, `Succede agli indici ${places.join(', ').replace(/, (\d+)$/, ' e $1')}.`, `Il programma scrive ${rows[0]}.`]
				: family === 'prima'
					? [`Il valore ${x} compare agli indici ${first} e ${last}.`, `Quando i vale ${first} il confronto riesce e posizione diventa ${first}: la condizione posizione == -1 diventa falsa e il ciclo si ferma.`, `Il secondo ${x} non viene guardato: il programma scrive ${first}.`]
					: [`Il valore ${x} compare agli indici ${first} e ${last}.`, `Il ciclo for non si ferma: quando i vale ${first} posizione diventa ${first}, poi quando i vale ${last} diventa ${last}.`, `Resta l'indice dell'ultimo ${x} incontrato: il programma scrive ${last}.`];
	return {
		prompt: family === 'conta' ? 'Segui il ciclo un giro alla volta.' : 'Guarda se il ciclo si ferma quando trova il valore.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps,
		answer: pick(rng, writtenOption(rows), others.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, name, vector: v, x, way })
	};
}

// ---------------------------------------------------------------- level 3: which function searches as asked

/** A function `name(v, x)` with one loop: its rows in the two languages, and what it gives back. */
interface Fn {
	python: string[];
	cpp: string[];
	of: (v: readonly number[], x: number) => number;
}

/** The shape every function of this level has: a variable before the loop, a test on each element, what is done when it holds and when it does not, and what is given back at the end. */
interface Shape {
	init?: string;
	from?: number;
	test?: string;
	then: string;
	otherwise?: string;
	final: string;
}

function fn(name: string, s: Shape, of: Fn['of']): Fn {
	const test = s.test ?? 'v[i] == x';
	return {
		python: [`def ${name}(v, x):`, ...(s.init ? [`    ${s.init}`] : []), `    for i in range(${s.from ? `${s.from}, ` : ''}len(v)):`, `        if ${test}:`, `            ${s.then}`, ...(s.otherwise ? ['        else:', `            ${s.otherwise}`] : []), `    return ${s.final}`],
		cpp: [`int ${name}(int v[], int n, int x) {`, ...(s.init ? [`    int ${s.init};`] : []), `    for (int i = ${s.from ?? 0}; i < n; i++) {`, `        if (${test}) {`, `            ${s.then};`, ...(s.otherwise ? ['        } else {', `            ${s.otherwise};`, '        }'] : ['        }']), '    }', `    return ${s.final};`, '}'],
		of
	};
}

type Asked = 'prima' | 'ultima' | 'conta';
const ASKED: readonly Asked[] = ['prima', 'ultima', 'conta'];

const times = (v: readonly number[], x: number) => v.filter((y) => y === x).length;

function functions(family: Asked): { name: string; gives: string; right: Fn; wrong: Fn[]; why: string[] } {
	if (family === 'prima') {
		const name = 'cerca';
		return {
			name,
			gives: "l'indice del primo elemento di v uguale a x, oppure -1 se x non c'è",
			right: fn(name, { then: 'return i', final: '-1' }, (v, x) => v.indexOf(x)),
			wrong: [
				fn(name, { then: 'return i', otherwise: 'return -1', final: '-1' }, (v, x) => (v[0] === x ? 0 : -1)),
				fn(name, { init: 'posizione = -1', then: 'posizione = i', final: 'posizione' }, (v, x) => v.lastIndexOf(x)),
				fn(name, { then: 'return v[i]', final: '-1' }, (v, x) => (v.includes(x) ? x : -1)),
				fn(name, { from: 1, then: 'return i', final: '-1' }, (v, x) => v.indexOf(x, 1)),
				fn(name, { then: 'return i + 1', final: '-1' }, (v, x) => (v.includes(x) ? v.indexOf(x) + 1 : -1)),
				fn(name, { test: 'i == x', then: 'return i', final: '-1' }, (v, x) => (x >= 0 && x < v.length ? x : -1))
			],
			why: ['Appena un elemento è uguale a x la funzione restituisce il suo indice, i: return chiude la funzione, quindi quello trovato è il primo.', 'Un elemento diverso non dice niente: nel ciclo non ci va un else.', 'Solo dopo il ciclo, quando tutti gli elementi sono stati guardati, si può restituire -1.']
		};
	}
	if (family === 'ultima') {
		const name = 'cerca';
		const keep = { init: 'posizione = -1', then: 'posizione = i', final: 'posizione' };
		return {
			name,
			gives: "l'indice dell'ultimo elemento di v uguale a x, oppure -1 se x non c'è",
			right: fn(name, keep, (v, x) => v.lastIndexOf(x)),
			wrong: [
				fn(name, { then: 'return i', final: '-1' }, (v, x) => v.indexOf(x)),
				fn(name, { ...keep, otherwise: 'posizione = -1' }, (v, x) => (v[v.length - 1] === x ? v.length - 1 : -1)),
				fn(name, { ...keep, then: 'posizione = v[i]' }, (v, x) => (v.includes(x) ? x : -1)),
				fn(name, { ...keep, init: 'posizione = 0' }, (v, x) => Math.max(0, v.lastIndexOf(x))),
				fn(name, { ...keep, then: 'posizione = posizione + 1' }, (v, x) => times(v, x) - 1),
				fn(name, { ...keep, from: 1 }, (v, x) => (v.lastIndexOf(x) >= 1 ? v.lastIndexOf(x) : -1))
			],
			why: ["Per trovare l'ultimo il ciclo non si deve fermare: guarda tutti gli elementi fino in fondo.", "A ogni elemento uguale a x la variabile posizione prende il suo indice, e quello che resta alla fine è l'ultimo.", "posizione parte da -1 e un elemento diverso non la tocca: se x non c'è resta -1."]
		};
	}
	const name = 'conta';
	const add = { init: 'volte = 0', then: 'volte = volte + 1', final: 'volte' };
	const run = (v: readonly number[], x: number) => {
		let k = 0;
		for (const y of v) k = y === x ? k + 1 : 0;
		return k;
	};
	return {
		name,
		gives: 'quante volte x compare nel vettore v',
		right: fn(name, add, times),
		wrong: [
			fn(name, { ...add, then: 'return 1' }, (v, x) => (v.includes(x) ? 1 : 0)),
			fn(name, { ...add, then: 'volte = volte + v[i]' }, (v, x) => times(v, x) * x),
			fn(name, { ...add, test: 'v[i] != x' }, (v, x) => v.length - times(v, x)),
			fn(name, { ...add, otherwise: 'volte = 0' }, run),
			fn(name, { ...add, init: 'volte = 1' }, (v, x) => times(v, x) + 1),
			fn(name, { ...add, then: 'volte = i' }, (v, x) => Math.max(0, v.lastIndexOf(x))),
			fn(name, { ...add, from: 1 }, (v, x) => times(v.slice(1), x))
		],
		why: ['Per contare non ci si può fermare al primo: il ciclo guarda tutti gli elementi.', 'Il contatore volte parte da 0 e aumenta di 1 a ogni elemento uguale a x.', 'Un elemento diverso non cambia il conto, e il risultato si restituisce dopo il ciclo.']
	};
}

/** The whole program: the function, a vector `dati`, and the function tried on each of `xs`, one row written for each. */
function tryingProgram(name: string, f: Fn, v: readonly number[], xs: readonly number[]): Program {
	const python = [...f.python, '', `dati = ${pyList(v)}`, ...xs.map((x) => `print(${name}(dati, ${x}))`)];
	const cpp = [`int dati[N] = ${cppList(v)};`, ...xs.map((x) => `cout << ${name}(dati, N, ${x}) << endl;`)];
	return program(python.join('\n'), cppProgram(cpp.join('\n'), [`const int N = ${v.length};`, '', ...f.cpp].join('\n')), () => xs.map((x) => String(f.of(v, x))));
}

function level3(rng: Rng, family: Asked): CodeBuilt {
	const n = rng.int(6, 7);
	// a value that is there twice, in the middle; then one that is not there, the first element and the last
	const { v, x, places } = repeated(rng, n, 2, true);
	const absent = distinct(rng, 12, 2, 13).find((y) => !v.includes(y))!;
	const xs = [x, absent, v[0], v[n - 1]];
	const { name, gives, right, wrong, why } = functions(family);
	const whole = tryingProgram(name, right, v, xs);
	const others = wrong.map((f) => ({ f, whole: tryingProgram(name, f, v, xs) }));
	const kept = wrongPrograms(
		whole,
		others.map((o) => o.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	const shownOf = (f: Fn) => ({ python: f.python.join('\n'), cpp: f.cpp.join('\n') });
	const option = (p: Program) => programOption(p, shownOf(p === whole ? right : others.find((o) => o.whole === p)!.f));
	return {
		prompt: 'Guarda che cosa fa il ciclo quando il confronto riesce.',
		problem: `Quale funzione restituisce ${gives}?`,
		solution: family === 'prima' ? 'La funzione che restituisce i dentro il ciclo e -1 dopo il ciclo.' : family === 'ultima' ? 'La funzione che mette i in posizione a ogni elemento uguale e restituisce posizione dopo il ciclo.' : 'La funzione che aumenta volte di 1 a ogni elemento uguale e restituisce volte dopo il ciclo.',
		steps: why,
		solutionCode: option(whole).code,
		answer: choose(
			rng,
			option(whole),
			shuffle(
				rng,
				// a wrong function with a row too long for an option stays out
				kept.map((p) => option(p)).filter((o) => `${o.code!.python}${o.code!.cpp}`.split('\n').every((row) => row.length <= OPTION_WIDTH))
			)
		),
		params: reference(whole, [[]], { case: family, vector: v, xs, places })
	};
}

// ---------------------------------------------------------------- level 4: best, worst and average case

const CASES = ['migliore', 'peggiore', 'medio', 'indice', 'doppio'] as const;

function level4(rng: Rng, family: (typeof CASES)[number]): CodeBuilt {
	const search = 'la ricerca sequenziale, che si ferma appena trova il valore';
	if (family === 'migliore') {
		const n = rng.int(5, 400);
		return {
			prompt: 'Pensa a dove deve stare il valore perché la ricerca finisca prima possibile.',
			problem: `Un vettore ha ${n} elementi. Quanti confronti fa ${search}, nel caso migliore?`,
			solution: '1 confronto',
			steps: ['Il caso migliore è quello in cui il valore cercato è il primo elemento del vettore.', 'Il primo confronto riesce e la ricerca si ferma.', `È 1 confronto qualunque sia la dimensione: i ${n} elementi non contano.`],
			answer: numbers(rng, 1, [0, n, Math.floor(n / 2), n - 1]),
			params: { case: family, n }
		};
	}
	if (family === 'peggiore') {
		const n = rng.int(5, 400);
		return {
			prompt: 'Pensa a dove deve stare il valore perché la ricerca guardi più elementi possibile.',
			problem: `Un vettore ha ${n} elementi. Quanti confronti fa ${search}, nel caso peggiore?`,
			solution: `${n} confronti`,
			steps: ["Il caso peggiore è quello in cui il valore è l'ultimo elemento, oppure non c'è.", 'In tutti e due i casi la ricerca confronta ogni elemento del vettore.', `Un confronto per elemento: ${n} confronti.`],
			answer: numbers(rng, n, [n - 1, n + 1, Math.floor(n / 2), 1]),
			params: { case: family, n }
		};
	}
	if (family === 'medio') {
		const n = 2 * rng.int(2, 150) + 1;
		const mean = (n + 1) / 2;
		return {
			prompt: 'Fai la media tra i confronti del caso migliore e quelli del caso peggiore.',
			problem: `Un vettore ha ${n} elementi. Il valore cercato c'è, e può stare in ogni posto con la stessa probabilità. Quanti confronti fa in media ${search}?`,
			solution: `${mean} confronti`,
			steps: [`Se il valore è al primo posto serve 1 confronto, se è all'ultimo ne servono ${n}.`, `La media dei numeri da 1 a ${n} è (${n} + 1) : 2.`, `In media servono ${mean} confronti, circa la metà degli elementi.`],
			answer: numbers(rng, mean, [n, (n - 1) / 2, n + 1, 1, n - 1]),
			params: { case: family, n }
		};
	}
	if (family === 'indice') {
		const n = rng.int(8, 60);
		const made = rng.int(2, n - 1);
		return {
			prompt: "Il primo confronto è con l'elemento di indice 0.",
			problem: `In un vettore di ${n} elementi ${search}, ha trovato il valore dopo ${made} confronti. Qual è l'indice dell'elemento trovato?`,
			solution: String(made - 1),
			steps: ["Il primo confronto è con l'elemento di indice 0, il secondo con quello di indice 1.", `Il confronto numero ${made} è con l'elemento di indice ${made} - 1 = ${made - 1}.`, "I confronti sono sempre uno più dell'indice a cui la ricerca si ferma."],
			answer: numbers(rng, made - 1, [made, made + 1, n - made, made - 2]),
			params: { case: family, n, made }
		};
	}
	const n = rng.int(5, 400);
	return {
		prompt: 'Nel caso peggiore la ricerca confronta tutti gli elementi.',
		problem: `In un vettore di ${n} elementi ${search}, fa nel caso peggiore ${n} confronti. Quanti ne fa, nel caso peggiore, in un vettore con il doppio degli elementi?`,
		solution: `${2 * n} confronti`,
		steps: [`Il doppio degli elementi sono ${2 * n} elementi.`, 'Nel caso peggiore la ricerca li confronta tutti, uno alla volta.', `Servono ${2 * n} confronti: se gli elementi raddoppiano, raddoppiano anche i confronti.`],
		answer: numbers(rng, 2 * n, [n + 1, n + 2, 4 * n, n]),
		params: { case: family, n }
	};
}

// ---------------------------------------------------------------- level 5: write a search

/** What a program does once the numbers are in the vector `v` and the value is in `x`: its rows, and what it writes. */
interface After {
	python: string[];
	cpp: string[];
	of: (v: number[], x: number) => (string | number)[];
}

const WRITING = ['posizione', 'conta', 'presente'] as const;
type Writing = (typeof WRITING)[number];

function afters(family: Writing, n: number): { asks: string; says: string; how: string; end: string; right: After; wrong: After[] } {
	if (family === 'posizione') {
		const stopping = (start: number, set: string, shown: string, of: After['of']): After => ({
			python: ['posizione = -1', `i = ${start}`, `while i < ${n} and posizione == -1:`, '    if v[i] == x:', `        posizione = ${set}`, '    i = i + 1', `print(${shown})`],
			cpp: ['int posizione = -1;', `int i = ${start};`, 'while (i < N && posizione == -1) {', '    if (v[i] == x) {', `        posizione = ${set};`, '    }', '    i = i + 1;', '}', `cout << ${shown} << endl;`],
			of
		});
		const going = (otherwise: boolean, of: After['of']): After => ({
			python: ['posizione = -1', `for i in range(${n}):`, '    if v[i] == x:', '        posizione = i', ...(otherwise ? ['    else:', '        posizione = -1'] : []), 'print(posizione)'],
			cpp: ['int posizione = -1;', 'for (int i = 0; i < N; i++) {', '    if (v[i] == x) {', '        posizione = i;', ...(otherwise ? ['    } else {', '        posizione = -1;', '    }'] : ['    }']), '}', 'cout << posizione << endl;'],
			of
		});
		return {
			asks: "scrivi l'indice del primo elemento del vettore uguale a x, oppure -1 se x non c'è",
			says: "Un ciclo che va avanti finché ci sono elementi e posizione vale ancora -1, e mette in posizione l'indice dell'elemento uguale a x.",
			how: 'La variabile posizione parte da -1. Il ciclo while ha due condizioni, i < N e posizione == -1: così si ferma al primo elemento uguale a x, e anche quando gli elementi finiscono.',
			end: 'Se il ciclo finisce senza trovare x, posizione vale ancora -1, ed è quello che il programma scrive.',
			right: stopping(0, 'i', 'posizione', (v, x) => [v.indexOf(x)]),
			wrong: [
				going(false, (v, x) => [v.lastIndexOf(x)]),
				going(true, (v, x) => [v[n - 1] === x ? n - 1 : -1]),
				stopping(0, 'i', 'posizione + 1', (v, x) => [v.indexOf(x) + 1]),
				stopping(0, 'v[i]', 'posizione', (v, x) => [v.includes(x) ? x : -1]),
				stopping(1, 'i', 'posizione', (v, x) => [v.indexOf(x, 1)])
			]
		};
	}
	if (family === 'conta') {
		const counting = (s: { init?: number; from?: number; test?: string; then?: string; otherwise?: boolean }, of: (v: number[], x: number) => number): After => {
			const test = s.test ?? 'v[i] == x';
			const then = s.then ?? 'volte + 1';
			return {
				python: [`volte = ${s.init ?? 0}`, `for i in range(${s.from ? `${s.from}, ` : ''}${n}):`, `    if ${test}:`, `        volte = ${then}`, ...(s.otherwise ? ['    else:', '        volte = 0'] : []), 'print(volte)'],
				cpp: [`int volte = ${s.init ?? 0};`, `for (int i = ${s.from ?? 0}; i < N; i++) {`, `    if (${test}) {`, `        volte = ${then};`, ...(s.otherwise ? ['    } else {', '        volte = 0;', '    }'] : ['    }']), '}', 'cout << volte << endl;'],
				of: (v, x) => [of(v, x)]
			};
		};
		return {
			asks: 'scrivi quante volte x compare nel vettore',
			says: 'Un ciclo che guarda tutti gli elementi e aumenta un contatore di 1 a ogni elemento uguale a x.',
			how: 'Il contatore volte parte da 0. Il ciclo for non si ferma al primo elemento uguale: li guarda tutti, e a ogni v[i] uguale a x aggiunge 1.',
			end: 'Il conto si scrive dopo il ciclo, una volta sola: se x non compare mai, resta 0.',
			right: counting({}, times),
			wrong: [
				counting({ then: '1' }, (v, x) => (v.includes(x) ? 1 : 0)),
				counting({ then: 'volte + v[i]' }, (v, x) => times(v, x) * x),
				counting({ test: 'v[i] != x' }, (v, x) => v.length - times(v, x)),
				counting({ otherwise: true }, (v, x) => {
					let k = 0;
					for (const y of v) k = y === x ? k + 1 : 0;
					return k;
				}),
				counting({ from: 1 }, (v, x) => times(v.slice(1), x)),
				counting({ init: 1 }, (v, x) => times(v, x) + 1)
			]
		};
	}
	const said = (found: boolean) => (found ? 'presente' : 'assente');
	const flag = (s: { from?: number; test?: string; otherwise?: boolean; swapped?: boolean }, of: (v: number[], x: number) => boolean): After => {
		const test = s.test ?? 'v[i] == x';
		const [yes, no] = s.swapped ? ['assente', 'presente'] : ['presente', 'assente'];
		return {
			python: ['trovato = False', `for i in range(${s.from ? `${s.from}, ` : ''}${n}):`, `    if ${test}:`, '        trovato = True', ...(s.otherwise ? ['    else:', '        trovato = False'] : []), 'if trovato:', `    print("${yes}")`, 'else:', `    print("${no}")`],
			cpp: ['bool trovato = false;', `for (int i = ${s.from ?? 0}; i < N; i++) {`, `    if (${test}) {`, '        trovato = true;', ...(s.otherwise ? ['    } else {', '        trovato = false;', '    }'] : ['    }']), '}', 'if (trovato) {', `    cout << "${yes}" << endl;`, '} else {', `    cout << "${no}" << endl;`, '}'],
			of: (v, x) => [said(of(v, x) !== Boolean(s.swapped))]
		};
	};
	return {
		asks: "scrivi la parola presente se x è nel vettore, la parola assente se non c'è",
		says: 'Una variabile trovato che parte da falso e diventa vera quando un elemento è uguale a x; la parola si scrive dopo il ciclo.',
		how: 'La variabile trovato parte da falso. Nel ciclo, se v[i] è uguale a x diventa vera, e un elemento diverso non la tocca: niente else. Dopo il ciclo una selezione scrive presente o assente.',
		end: "Che x non c'è si può dire solo dopo il ciclo, quando tutti gli elementi sono stati guardati.",
		right: flag({}, (v, x) => v.includes(x)),
		wrong: [flag({ otherwise: true }, (v, x) => v[n - 1] === x), flag({ swapped: true }, (v, x) => v.includes(x)), flag({ from: 1 }, (v, x) => v.slice(1).includes(x)), flag({ test: 'i == x' }, (v, x) => x >= 0 && x < n), flag({ test: 'v[i] != x' }, (v, x) => v.some((y) => y !== x))]
	};
}

/** The whole program: `n` numbers read into the vector `v`, the value read into `x`, and what comes after. */
function readingProgram(n: number, after: After): Program {
	const python = ['v = []', `for i in range(${n}):`, '    v.append(int(input()))', 'x = int(input())', ...after.python];
	const cpp = ['int v[N];', 'for (int i = 0; i < N; i++) {', '    cin >> v[i];', '}', 'int x;', 'cin >> x;', ...after.cpp];
	return program(python.join('\n'), cppProgram(cpp.join('\n'), `const int N = ${n};`), (input) => {
		const next = reader(input);
		const v = Array.from({ length: n }, () => Number(next()));
		return after.of(v, Number(next())).map(String);
	});
}

function level5(rng: Rng, family: Writing): CodeBuilt {
	const n = rng.int(5, 6);
	const { asks, says, how, end, right, wrong } = afters(family, n);
	const solution = readingProgram(n, right);
	const others = wrong.map((after) => ({ after, whole: readingProgram(n, after) }));
	// three runs: the value twice in the middle, the value that is not there, the value only at the first place
	const twice = repeated(rng, n, 2, true);
	const none = repeated(rng, n, 0);
	const once = repeated(rng, n, 1);
	once.v[once.places[0]] = once.v[0];
	once.v[0] = once.x;
	const tests = [twice, none, once].map((t) => [...t.v, t.x].map(String));
	const kept = wrongPrograms(
		solution,
		others.map((o) => o.whole),
		tests
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const shownOf = (after: After) => ({ python: after.python.join('\n'), cpp: after.cpp.join('\n') });
	const start = { python: '# scrivi qui il programma\n', cpp: cppProgram('// scrivi qui il programma', `const int N = ${n};`) };
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge ${n} numeri interi, uno per riga, e poi un altro numero intero, x. Metti i primi ${n} in un vettore v, poi ${asks}.`,
		solution: says,
		steps: [`Leggi i ${n} numeri con un ciclo e mettili nel vettore v, poi leggi x: il valore da cercare arriva per ultimo, quindi gli altri vanno conservati.`, how, end],
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

/** A level in words has no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level in words has no program'] : []);

export default makeCodeGenerator(ID, 'La ricerca sequenziale', {
	1: { label: 'Contare i confronti', constraints: ['a vector of 6 to 8 numbers written in the question', 'one comparison per element looked at'], build: drawn(COUNTS, level1), check: worded },
	2: { label: 'Che cosa scrive la ricerca', constraints: ['a search on a vector of 6 or 7 numbers', 'four different outputs'], build: drawn(SEARCHES, level2) },
	3: { label: 'Quale funzione cerca bene', constraints: ['four functions that give back different things', 'each option shows the function alone'], build: drawn(ASKED, level3) },
	4: { label: 'Caso migliore, peggiore e medio', constraints: ['1, n and (n + 1) / 2 comparisons', 'four different numbers'], build: drawn(CASES, level4), check: worded },
	5: { label: 'Scrivere la ricerca', constraints: ['the program reads 5 or 6 numbers and then the value', 'graded by running it on three lists', 'needs a vector'], build: drawn(WRITING, level5) }
});
