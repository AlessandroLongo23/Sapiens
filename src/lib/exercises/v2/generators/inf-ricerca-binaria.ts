/**
 * Binary search (informatica, third year, lesson 74). Spec: specs/exercises/inf-ricerca-binaria.md
 *
 * 1. one turn of the search: the centre and the half that is kept (text); 2. what a program with `cerca` writes;
 * 3. how many elements the search looks at, on a vector and at most on n elements (text); 4. which body of the
 * loop is right (options that are programs, shown by the body of the loop alone); 5. write the function (open
 * answer, graded on what it writes and on the function).
 *
 * The programs are those of the lesson: `sinistra`, `destra`, `centro`, the equality first, then the two halves.
 * A program is built from a `Shape`, which is the right search or one with a mistake a student makes, and the same
 * shape is run here by `runSearch` to say what it writes.
 */
import type { Rng } from '../types';
import { shuffle, START_WIDTH, choose, cppList, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, pyList, reader, reference, textOption, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-ricerca-binaria';

// ---------------------------------------------------------------- the search, and its mistakes

/** Which half a branch keeps: `destra` is `sinistra = centro + 1`, `sinistra` is `destra = centro - 1`. */
type Half = 'destra' | 'sinistra';

interface Shape {
	/** The order of the vector: in a decreasing one the comparison of the second branch is turned. */
	order: 'crescente' | 'decrescente';
	/** What is compared with x: the element in the middle, or (a mistake) its index. */
	key: 'v[centro]' | 'centro';
	/** What is given back when x is found: the index, or (a mistake) the element. */
	give: 'centro' | 'v[centro]';
	/** The half kept by the second branch (the element is before x in the order) and by the third. */
	second: Half;
	third: Half;
	/** How the middle is worked out: the mean of the two indices, or (a mistake) half their distance. */
	mid: 'media' | 'distanza';
	/** A function that counts the elements looked at: where the counter grows, or false for the search of the index. */
	counting: false | 'ogni giro' | 'nei rami';
}

const RIGHT: Shape = { order: 'crescente', key: 'v[centro]', give: 'centro', second: 'destra', third: 'sinistra', mid: 'media', counting: false };

/** What the function of a shape gives back for x; it throws where the program would never end or leave the vector. */
function runSearch(shape: Shape, v: readonly number[], x: number): number {
	let sinistra = 0;
	let destra = v.length - 1;
	let quanti = 0;
	for (let turns = 0; sinistra <= destra; turns++) {
		if (turns > 50) throw new Error('never ends');
		const centro = Math.floor(shape.mid === 'media' ? (sinistra + destra) / 2 : (destra - sinistra) / 2);
		if (centro < 0 || centro >= v.length) throw new Error('out of the vector');
		if (shape.counting === 'ogni giro') quanti++;
		const key = shape.key === 'centro' ? centro : v[centro];
		if (key === x) return shape.counting ? quanti : shape.give === 'centro' ? centro : v[centro];
		const before = shape.order === 'crescente' ? key < x : key > x;
		if ((before ? shape.second : shape.third) === 'destra') sinistra = centro + 1;
		else destra = centro - 1;
		if (shape.counting === 'nei rami') quanti++;
	}
	return shape.counting ? quanti : -1;
}

const nameOf = (shape: Shape) => (shape.counting ? 'confronti' : 'cerca');
const move = (half: Half) => (half === 'destra' ? 'sinistra = centro + 1' : 'destra = centro - 1');

/** The body of the loop, which is what an option shows: from the middle to the end of the selection. */
function body(shape: Shape): { python: string[]; cpp: string[] } {
	const sign = shape.order === 'crescente' ? '<' : '>';
	const back = shape.counting ? 'quanti' : shape.give;
	const count = 'quanti = quanti + 1';
	const middle = shape.mid === 'media' ? '(sinistra + destra)' : '(destra - sinistra)';
	const top = shape.counting === 'ogni giro';
	const low = shape.counting === 'nei rami';
	return {
		python: [
			`centro = ${middle} // 2`,
			...(top ? [count] : []),
			`if ${shape.key} == x:`,
			`    return ${back}`,
			`elif ${shape.key} ${sign} x:`,
			`    ${move(shape.second)}`,
			...(low ? [`    ${count}`] : []),
			'else:',
			`    ${move(shape.third)}`,
			...(low ? [`    ${count}`] : [])
		],
		cpp: [
			`centro = ${middle} / 2;`,
			...(top ? [`${count};`] : []),
			`if (${shape.key} == x) {`,
			`    return ${back};`,
			`} else if (${shape.key} ${sign} x) {`,
			`    ${move(shape.second)};`,
			...(low ? [`    ${count};`] : []),
			'} else {',
			`    ${move(shape.third)};`,
			...(low ? [`    ${count};`] : []),
			'}'
		]
	};
}

const indent = (rows: string[], by: number) => rows.map((row) => ' '.repeat(by) + row);
const shownBody = (shape: Shape) => ({ python: body(shape).python.join('\n') + '\n', cpp: body(shape).cpp.join('\n') + '\n' });

/** The whole function in the two languages. */
function functionOf(shape: Shape): { python: string; cpp: string } {
	const rows = body(shape);
	const name = nameOf(shape);
	const end = shape.counting ? 'quanti' : '-1';
	return {
		python: [`def ${name}(v, x):`, '    sinistra = 0', '    destra = len(v) - 1', ...(shape.counting ? ['    quanti = 0'] : []), '    while sinistra <= destra:', ...indent(rows.python, 8), `    return ${end}`].join('\n') + '\n',
		cpp:
			[`int ${name}(int v[], int n, int x) {`, '    int sinistra = 0;', '    int destra = n - 1;', '    int centro;', ...(shape.counting ? ['    int quanti = 0;'] : []), '    while (sinistra <= destra) {', ...indent(rows.cpp, 8), '    }', `    return ${end};`, '}'].join('\n') + '\n'
	};
}

/** A program that tries the function on each of `xs` and writes one row for each: it reads nothing. */
function callsProgram(shape: Shape, v: readonly number[], xs: readonly number[], vector = 'v'): Program {
	const f = functionOf(shape);
	const name = nameOf(shape);
	return program(
		`${f.python}\n${vector} = ${pyList(v)}\n${xs.map((x) => `print(${name}(${vector}, ${x}))`).join('\n')}\n`,
		cppProgram(`int ${vector}[${v.length}] = ${cppList(v)};\n${xs.map((x) => `cout << ${name}(${vector}, ${v.length}, ${x}) << endl;`).join('\n')}`, f.cpp),
		() => xs.map((x) => String(runSearch(shape, v, x)))
	);
}

/** A program that reads x and writes what the function gives back for it. */
function readingProgram(shape: Shape, v: readonly number[]): Program {
	const f = functionOf(shape);
	const name = nameOf(shape);
	return program(`${f.python}\nv = ${pyList(v)}\nx = int(input())\nprint(${name}(v, x))\n`, cppProgram(`int v[${v.length}] = ${cppList(v)};\nint x;\ncin >> x;\ncout << ${name}(v, ${v.length}, x) << endl;`, f.cpp), (input) => {
		const next = reader(input);
		return [String(runSearch(shape, v, Number(next())))];
	});
}

/** The same search with one mistake, each a different one a student makes. */
function mistakes(right: Shape): Shape[] {
	const other = (half: Half): Half => (half === 'destra' ? 'sinistra' : 'destra');
	return [
		// the two halves exchanged: the search goes on where the value cannot be
		{ ...right, second: other(right.second), third: other(right.third) },
		// the index compared with the value, not the element
		{ ...right, key: 'centro' },
		// the element given back, not its place
		...(right.counting ? [] : [{ ...right, give: 'v[centro]' as const }]),
		// the counter that grows only when a half is thrown away
		...(right.counting ? [{ ...right, counting: 'nei rami' as const }] : []),
		// one branch copied onto the other
		{ ...right, third: right.second },
		{ ...right, second: right.third },
		// the middle without `sinistra`: half the distance between the two indices
		{ ...right, mid: 'distanza' }
	];
}

// ---------------------------------------------------------------- numbers

/** `size` different whole numbers from 1 to `max`, in increasing order. */
function sorted(rng: Rng, size: number, max: number): number[] {
	const v = new Set<number>();
	while (v.size < size) v.add(rng.int(1, max));
	return [...v].sort((a, b) => a - b);
}

/** A number from 1 to `max` that is not in v. */
function absent(rng: Rng, v: readonly number[], max: number): number {
	for (;;) {
		const x = rng.int(1, max);
		if (!v.includes(x)) return x;
	}
}

/** The turns of the right search of x in an increasing vector: the two indices at the start of each, and the middle. */
function turns(v: readonly number[], x: number): { sinistra: number; destra: number; centro: number }[] {
	const out = [];
	let sinistra = 0;
	let destra = v.length - 1;
	while (sinistra <= destra) {
		const centro = Math.floor((sinistra + destra) / 2);
		out.push({ sinistra, destra, centro });
		if (v[centro] === x) break;
		if (v[centro] < x) sinistra = centro + 1;
		else destra = centro - 1;
	}
	return out;
}

/** A vector with its indices above it, in fixed width: what the question shows where there is no program. */
const table = (v: readonly number[]) => `indice${v.map((_, i) => String(i).padStart(3)).join('')}\nvalore${v.map((x) => String(x).padStart(3)).join('')}\n`;

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave too few wrong answers (two mistakes that give the same on
 * those numbers). The case is drawn once, before, so that the shares of the cases do not depend on how often each
 * fails.
 */
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

// ---------------------------------------------------------------- level 1: one turn

type Turn = 'destra' | 'sinistra' | 'trovato';
// two turns in five keep the right half, two the left one, one finds the value
const TURNS: readonly Turn[] = ['destra', 'destra', 'sinistra', 'sinistra', 'trovato'];

/** What happens in a turn that looks at `centro`: the option says it, and `values` hold it for the check. */
function outcome(centro: number, what: 'trovato' | { name: 'sinistra' | 'destra'; value: number }) {
	if (what === 'trovato') return textOption(`centro vale ${centro}: il valore è trovato`, `${centro}|trovato`);
	return textOption(`centro vale ${centro}, poi ${what.name} diventa ${what.value}`, `${centro}|${what.name}|${what.value}`);
}

/** What a turn does when it looks, rightly or not, at the index `centro`. */
function honest(v: readonly number[], x: number, centro: number) {
	if (v[centro] === x) return outcome(centro, 'trovato');
	return v[centro] < x ? outcome(centro, { name: 'sinistra', value: centro + 1 }) : outcome(centro, { name: 'destra', value: centro - 1 });
}

function level1(rng: Rng, kind: Turn): CodeBuilt {
	for (;;) {
		const v = sorted(rng, rng.int(7, 11), 60);
		const x = kind === 'trovato' || rng.int(0, 2) > 0 ? rng.pick(v) : absent(rng, v, 60);
		const fit = turns(v, x).filter((t) => t.destra - t.sinistra >= 2 && (v[t.centro] === x ? 'trovato' : v[t.centro] < x ? 'destra' : 'sinistra') === kind);
		if (!fit.length) continue;
		const { sinistra, destra, centro } = rng.pick(fit);
		const right = honest(v, x, centro);
		const others = [
			// the right middle and the wrong half, or the middle looked at again
			...(kind === 'destra' ? [outcome(centro, { name: 'destra', value: centro - 1 }), outcome(centro, { name: 'sinistra', value: centro })] : []),
			...(kind === 'sinistra' ? [outcome(centro, { name: 'sinistra', value: centro + 1 }), outcome(centro, { name: 'destra', value: centro })] : []),
			...(kind === 'trovato' ? [outcome(centro, { name: 'sinistra', value: centro + 1 }), outcome(centro, { name: 'destra', value: centro - 1 })] : []),
			// a wrong middle: half the distance, the mean rounded up, the middle of the whole vector
			...[Math.floor((destra - sinistra) / 2), Math.ceil((sinistra + destra) / 2), Math.floor((v.length - 1) / 2)].filter((c) => c !== centro).map((c) => honest(v, x, c)),
			...(kind === 'trovato' ? [] : [outcome(centro, 'trovato')])
		];
		const value = v[centro];
		return {
			prompt: 'Calcola centro, poi confronta.',
			problem: `La ricerca binaria cerca ${x} in questo vettore ordinato. All'inizio di un giro sinistra vale ${sinistra} e destra vale ${destra}. Che cosa succede in questo giro?`,
			listing: table(v),
			solution: right.text!,
			steps: [
				`centro è la media di sinistra e destra senza la parte dopo la virgola: ${sinistra} + ${destra} fa ${sinistra + destra}, diviso 2 fa ${centro}.`,
				`L'elemento di indice ${centro} vale ${value}, e il valore cercato è ${x}.`,
				kind === 'trovato'
					? `Sono uguali: la ricerca ha trovato ${x} all'indice ${centro} e finisce.`
					: kind === 'destra'
						? `${value} è minore di ${x}: il valore può stare solo a destra, quindi sinistra diventa centro + 1, cioè ${centro + 1}.`
						: `${value} è maggiore di ${x}: il valore può stare solo a sinistra, quindi destra diventa centro - 1, cioè ${centro - 1}.`
			],
			answer: pick(rng, right, others),
			params: { case: kind, vector: v, x, sinistra, destra }
		};
	}
}

// ---------------------------------------------------------------- level 2: what the program writes

const VECTORS = ['v', 'dati', 'anni', 'pesi', 'eta'] as const;
type Second = 'presente' | 'assente';

/** A vector of 6 or 7 numbers with a name short enough for its row in C++ to fit under the question. */
function shownVector(rng: Rng): { v: number[]; name: string } {
	for (;;) {
		const v = sorted(rng, rng.int(6, 7), 60);
		const name = rng.pick(VECTORS);
		if (`    int ${name}[${v.length}] = ${cppList(v)};`.length <= 42) return { v, name };
	}
}

/** How the right search of x goes, in a sentence. */
function told(v: readonly number[], x: number): string {
	const seen = turns(v, x).map((t) => `${v[t.centro]} all'indice ${t.centro}`);
	const at = v.indexOf(x);
	return `Per ${x} la ricerca guarda ${seen.join(', poi ')}: ${at >= 0 ? `lo trova e restituisce ${at}` : 'a quel punto sinistra supera destra e la funzione restituisce -1'}.`;
}

function level2(rng: Rng, kind: Second): CodeBuilt {
	const { v, name } = shownVector(rng);
	// a value that is not the first one looked at, then one that is there or not
	const first = rng.pick(v.filter((x) => turns(v, x).length >= 2));
	const second = kind === 'presente' ? rng.pick(v.filter((x) => x !== first)) : absent(rng, v, 60);
	const xs = [first, second];
	const shown = callsProgram(RIGHT, v, xs, name);
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		mistakes(RIGHT).map((shape) => callsProgram(shape, v, xs, name)),
		[[]]
	).map((p) => written(p)!);
	// what a student answers without following the loop: the places counted from 1, the values themselves
	const at = xs.map((x) => v.indexOf(x));
	const guesses = [at.map((i) => String(i < 0 ? -1 : i + 1)), at.map((i, k) => String(i < 0 ? -1 : xs[k])), at.map((i) => String(i < 0 ? 0 : i))];
	return {
		prompt: 'Segui sinistra, destra e centro un giro alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [`La funzione cerca restituisce l'indice a cui si trova x nel vettore, oppure -1. Gli indici partono da 0.`, told(v, first), told(v, second)],
		answer: pick(rng, writtenOption(rows), [...others, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, vector: v, xs })
	};
}

// ---------------------------------------------------------------- level 3: how many comparisons

type Count = 'trovato' | 'assente' | 'massimo';
const COUNTS: readonly Count[] = ['trovato', 'trovato', 'assente', 'assente', 'massimo'];
const SIZES = [7, 8, 15, 16, 20, 31, 32, 50, 63, 64, 100, 127, 128, 200, 255, 256, 500, 511, 512, 1000, 1023, 1024, 2000, 4000, 5000, 10000, 100000, 1000000] as const;

/** A number as Italian writes it in a sentence: 1000000 is "1 000 000". */
const spaced = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ');

function level3(rng: Rng, kind: Count): CodeBuilt {
	if (kind === 'massimo') {
		const n = rng.pick(SIZES);
		const chain: number[] = [];
		for (let m: number = n; m >= 1; m = Math.floor(m / 2)) chain.push(m);
		const most = chain.length;
		const wrong = [most - 1, most + 1, Math.floor(n / 2), n, most + 2, most - 2].filter((k) => k >= 1);
		return {
			prompt: 'Dimezza finché resta un solo elemento.',
			problem: `Un vettore ordinato ha ${spaced(n)} elementi. Quanti confronti servono al massimo alla ricerca binaria per trovare un valore, o per sapere che non c'è?`,
			solution: `${most}`,
			steps: [
				'Ogni confronto che non trova il valore lascia da esaminare al massimo la metà degli elementi, senza il resto.',
				`Gli elementi ancora da esaminare sono via via ${chain.map(spaced).join(', ')}.`,
				`Sono ${most} numeri, uno per ogni confronto: al massimo ${most} confronti.`
			],
			answer: pick(
				rng,
				textOption(String(most)),
				wrong.map((k) => textOption(spaced(k), String(k)))
			),
			params: { case: kind, n }
		};
	}
	for (;;) {
		const v = sorted(rng, rng.int(7, 12), 60);
		const x = kind === 'trovato' ? rng.pick(v) : absent(rng, v, 60);
		const seen = turns(v, x);
		const count = seen.length;
		const at = v.indexOf(x);
		const linear = at >= 0 ? at + 1 : v.length;
		// a value the linear search would find with as many comparisons tells nothing
		if (linear === count) continue;
		const wrong = [linear, count + 1, count - 1, v.length, Math.floor(v.length / 2), count + 2].filter((k) => k >= 1 && k !== count);
		return {
			prompt: 'Conta gli elementi che finiscono al centro.',
			problem: `Quanti elementi di questo vettore ordinato guarda la ricerca binaria quando cerca ${x}? Ogni elemento guardato è un confronto.`,
			listing: table(v),
			solution: `${count}`,
			steps: [
				`La ricerca parte con sinistra uguale a 0 e destra uguale a ${v.length - 1}, e a ogni giro guarda l'elemento di indice centro.`,
				`Guarda ${seen.map((t) => `${v[t.centro]} (indice ${t.centro})`).join(', poi ')}.`,
				at >= 0 ? `L'ultimo è ${x}: trovato, dopo ${count} ${count === 1 ? 'confronto' : 'confronti'}. La ricerca sequenziale ne avrebbe fatti ${linear}.` : `Poi sinistra supera destra: ${x} non c'è, e sono serviti ${count} confronti. La ricerca sequenziale ne avrebbe fatti ${linear}.`
			],
			answer: pick(
				rng,
				textOption(String(count)),
				wrong.map((k) => textOption(String(k)))
			),
			params: { case: kind, vector: v, x }
		};
	}
}

// ---------------------------------------------------------------- levels 4 and 5: the body of the loop, the function

type Family = 'crescente' | 'decrescente' | 'confronti';
const FAMILIES: readonly Family[] = ['crescente', 'decrescente', 'confronti'];

const shapeOf = (family: Family): Shape => (family === 'decrescente' ? { ...RIGHT, order: 'decrescente' } : family === 'confronti' ? { ...RIGHT, counting: 'ogni giro' } : RIGHT);

/** A vector for a family, in its order, and values to try the function on: on both sides of the middle, and absent. */
function trial(rng: Rng, family: Family, size: number): { v: number[]; xs: number[] } {
	const up = sorted(rng, size, 60);
	const middle = Math.floor((size - 1) / 2);
	const low = up[rng.int(0, middle - 1)];
	const high = up[rng.int(middle + 1, size - 1)];
	const xs = [low, high, absent(rng, up, 60), rng.pick(up.filter((x) => x !== low && x !== high))];
	return { v: family === 'decrescente' ? [...up].reverse() : up, xs: rng.int(0, 1) ? xs : [xs[1], xs[0], xs[3], xs[2]] };
}

const asks = (family: Family) =>
	family === 'confronti'
		? 'La funzione confronti(v, x) cerca x con la ricerca binaria nel vettore v, ordinato in ordine crescente, e restituisce quanti elementi ha guardato.'
		: `La funzione cerca(v, x) cerca x con la ricerca binaria nel vettore v, ordinato in ordine ${family}, e restituisce l'indice a cui si trova, oppure -1.`;

const explains = (family: Family) => [
	'centro è la media di sinistra e destra, e l\'elemento da confrontare con x è v[centro], non centro.',
	family === 'decrescente'
		? 'Il vettore è decrescente: se v[centro] è maggiore di x, il valore può stare solo a destra, e sinistra diventa centro + 1.'
		: 'Il vettore è crescente: se v[centro] è minore di x, il valore può stare solo a destra, e sinistra diventa centro + 1.',
	family === 'confronti' ? 'Il contatore quanti aumenta a ogni giro, prima del confronto: così conta anche l\'elemento che viene trovato.' : 'Nell\'altro caso destra diventa centro - 1. Quando v[centro] è uguale a x la funzione restituisce centro, che è un indice.'
];

function level4(rng: Rng, family: Family): CodeBuilt {
	const { v, xs } = trial(rng, family, rng.int(7, 9));
	const shape = shapeOf(family);
	const right = callsProgram(shape, v, xs);
	const wrong = mistakes(shape).map((s) => ({ shape: s, whole: callsProgram(s, v, xs) }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]]
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong bodies for ${family}`);
	const option = (p: Program) => programOption(p, shownBody(p === right ? shape : wrong.find((w) => w.whole === p)!.shape));
	return {
		prompt: 'Leggi il confronto e i due rami di ogni opzione.',
		problem: `${asks(family)} Il ciclo continua finché sinistra <= destra. Quali istruzioni formano il corpo del ciclo?`,
		solution: `Il corpo che confronta v[centro] con x e, quando v[centro] ${family === 'decrescente' ? '>' : '<'} x, fa sinistra = centro + 1.`,
		steps: explains(family),
		solutionCode: shownBody(shape),
		answer: choose(
			rng,
			option(right),
			shuffle(rng, kept).map((p) => option(p))
		),
		params: reference(right, [[]], { case: family, vector: v, xs })
	};
}

type Order = 'crescente' | 'decrescente';
const ORDERS: readonly Order[] = ['crescente', 'decrescente'];

function level5(rng: Rng, family: Order): CodeBuilt {
	for (;;) {
		const { v, xs } = trial(rng, family, 6);
		// the row of the vector must fit in the editor in C++ too
		if (`    int v[6] = ${cppList(v)};`.length > START_WIDTH) continue;
		const shape = shapeOf(family);
		const solution = readingProgram(shape, v);
		const tests = xs.map((x) => [String(x)]);
		const wrong = mistakes(shape).map((s) => ({ shape: s, whole: readingProgram(s, v) }));
		const kept = wrongPrograms(
			solution,
			wrong.map((w) => w.whole),
			tests
		);
		if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong bodies for ${family}`);
		const start = {
			python: `# scrivi qui la funzione cerca\n\nv = ${pyList(v)}\nx = int(input())\n# scrivi qui il resto\n`,
			cpp: cppProgram(`int v[6] = ${cppList(v)};\nint x;\ncin >> x;\n// scrivi qui il resto`, '// scrivi qui la funzione cerca\n')
		};
		return {
			prompt: 'Scrivi il programma.',
			problem: `Il vettore v ha 6 numeri in ordine ${family} ed è già nel programma, che legge un numero x. Scrivi una funzione cerca che riceve il vettore e x (in C++ anche la dimensione), cerca x con la ricerca binaria e restituisce l'indice a cui si trova, oppure -1 se non c'è. Poi chiamala e scrivi il risultato. La lettura c'è già.`,
			solution: `Una funzione cerca con sinistra, destra e centro, che ${family === 'decrescente' ? 'quando v[centro] > x' : 'quando v[centro] < x'} fa sinistra = centro + 1.`,
			steps: ['Sopra il resto del programma definisci la funzione: sinistra parte da 0, destra dall\'ultimo indice, e il ciclo continua finché sinistra <= destra.', ...explains(family).slice(0, 2), 'Dopo la lettura chiama la funzione con il vettore e x, e scrivi quello che restituisce.'],
			solutionCode: texts(solution),
			answer: needing(programAnswer(solution, start, tests), 'funzione'),
			choice: choose(
				rng,
				programOption(solution, shownBody(shape)),
				kept.map((p) => programOption(p, shownBody(wrong.find((w) => w.whole === p)!.shape)))
			),
			params: reference(solution, tests, { case: family, vector: v })
		};
	}
}

/** The levels of text have no program to run. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of text has no program'] : []);

export default makeCodeGenerator(ID, 'La ricerca binaria', {
	1: { label: 'Un giro della ricerca', constraints: ['a sorted vector of 7 to 11 numbers', 'a turn with at least three elements left', 'four different outcomes'], build: drawn(TURNS, level1), check: worded },
	2: { label: 'Che cosa scrive la ricerca', constraints: ['the function of the lesson on a vector of 6 or 7 numbers', 'two calls', 'four different outputs'], build: drawn<Second>(['presente', 'assente'], level2) },
	3: { label: 'Contare i confronti', constraints: ['a sorted vector of 7 to 12 numbers, or only its size', 'the linear search would need another number of comparisons'], build: drawn(COUNTS, level3), check: worded },
	4: { label: 'Il corpo del ciclo', constraints: ['four bodies of the loop that give back different things', 'each option shows the body alone'], build: drawn(FAMILIES, level4) },
	5: { label: 'Scrivere la ricerca binaria', constraints: ['a vector of 6 numbers in the program', 'graded by running it on four values', 'needs a function of its own'], build: drawn(ORDERS, level5) }
});
