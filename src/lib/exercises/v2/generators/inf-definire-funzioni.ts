/**
 * Exercises of lesson 65, "Definire e chiamare una funzione" (informatica, third year). Programs written by hand in
 * the two languages (v2/inf-codice.ts). Spec: specs/exercises/inf-definire-funzioni.md
 *
 * 1. what a program with a function called once or twice writes; 2. how many times the body of a function runs,
 * with calls in a loop; 3. which program writes the rows shown (options that are programs); 4. what a function with
 * one parameter writes; 5. write a function and call it (open answer, graded on what it writes and on the function).
 */
import type { Rng } from '../types';
import { choose, cppProgram, makeCodeGenerator, needing, printedOption, program, programAnswer, programOption, reader, reference, textOption, texts, written, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-definire-funzioni';

/** A function without parameters that writes one or two rows, and the words the main program writes around it. */
interface Theme {
	fn: string;
	body: readonly [string, string];
	words: readonly string[];
	/** A word short enough for a row inside a loop of an option. */
	short: string;
}

const THEMES: readonly Theme[] = [
	{ fn: 'linea', body: ['-------', '======='], words: ['Classifica', 'Tigri', 'Lupi', 'Falchi'], short: 'Squadra' },
	{ fn: 'saluta', body: ['Ciao!', 'Benvenuto'], words: ['Inizio', 'Anna', 'Luca', 'Sara'], short: 'Ospite' },
	{ fn: 'applauso', body: ['Clap clap', 'Bravi!'], words: ['Concerto', 'Assolo', 'Duetto', 'Bis'], short: 'Canzone' },
	{ fn: 'ritornello', body: ['La la la', 'Oh oh oh'], words: ['Titolo', 'Strofa 1', 'Strofa 2', 'Coda'], short: 'Strofa' },
	{ fn: 'stelle', body: ['* * *', '*****'], words: ['Diario', 'Mattina', 'Sera', 'Notte'], short: 'Giorno' },
	{ fn: 'avviso', body: ['Attenzione', 'Leggi bene'], words: ['Orario', 'Entrata', 'Uscita', 'Pausa'], short: 'Turno' }
];

/** How many turns a loop makes: a number, or the number read, exact or one off. */
type Count = number | 'n' | 'n+1' | 'n-1';

/** An instruction of the main program: a row written, a call (`bare` without its brackets, which calls nothing) or a loop. */
type Stmt = { print: string } | { call: true; bare?: boolean } | { loop: Count; body: Stmt[] };

const say = (text: string): Stmt => ({ print: text });
const CALL: Stmt = { call: true };

const pyCount = (c: Count) => (c === 'n+1' ? 'n + 1' : c === 'n-1' ? '1, n' : String(c));
const cppLoop = (c: Count) => (c === 'n+1' ? 'int i = 0; i <= n; i++' : c === 'n-1' ? 'int i = 1; i < n; i++' : `int i = 0; i < ${c}; i++`);
const turns = (c: Count, n: number) => (typeof c === 'number' ? c : c === 'n' ? n : c === 'n+1' ? n + 1 : Math.max(0, n - 1));

const pyRows = (stmts: Stmt[], fn: string, indent = ''): string[] => stmts.flatMap((s) => ('print' in s ? [`${indent}print("${s.print}")`] : 'call' in s ? [`${indent}${fn}${s.bare ? '' : '()'}`] : [`${indent}for i in range(${pyCount(s.loop)}):`, ...pyRows(s.body, fn, `${indent}    `)]));
const cppRows = (stmts: Stmt[], fn: string, indent = ''): string[] =>
	stmts.flatMap((s) => ('print' in s ? [`${indent}cout << "${s.print}" << endl;`] : 'call' in s ? [`${indent}${fn}${s.bare ? '' : '()'};`] : [`${indent}for (${cppLoop(s.loop)}) {`, ...cppRows(s.body, fn, `${indent}    `), `${indent}}`]));

function exec(stmts: Stmt[], body: readonly string[], n: number, out: string[] = []): string[] {
	for (const s of stmts) {
		if ('print' in s) out.push(s.print);
		else if ('call' in s) {
			if (!s.bare) out.push(...body);
		} else for (let i = 0; i < turns(s.loop, n); i++) exec(s.body, body, n, out);
	}
	return out;
}

const pyDef = (fn: string, body: readonly string[]) => [`def ${fn}():`, ...body.map((row) => `    print("${row}")`)].join('\n');
const cppDef = (fn: string, body: readonly string[]) => [`void ${fn}() {`, ...body.map((row) => `    cout << "${row}" << endl;`), '}'].join('\n');

/** The whole program: the function, then the main program, which with `reads` begins by reading the number n. */
function whole(fn: string, body: readonly string[], stmts: Stmt[], reads = false): Program {
	const python = `${pyDef(fn, body)}\n\n${reads ? 'n = int(input())\n' : ''}${pyRows(stmts, fn).join('\n')}\n`;
	const cpp = cppProgram(`${reads ? 'int n;\ncin >> n;\n' : ''}${cppRows(stmts, fn).join('\n')}`, cppDef(fn, body));
	return program(python, cpp, (input) => exec(stmts, body, reads ? Number(reader(input)()) : 0));
}

/** What an option shows of a program: all of the Python, and the C++ from the function down, without its first rows. */
const shownOf = (p: Program) => ({ python: p.python, cpp: p.cpp.split('\n').slice(3).join('\n') });

class TooFew extends Error {}

/**
 * A level whose numbers are drawn again when they leave fewer than three wrong options. The case is drawn once,
 * before, so that the cases that fail more often do not come out less.
 */
const drawn =
	<F>(cases: readonly F[], build: (rng: Rng, kind: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const kind = rng.pick(cases);
		for (let i = 1; ; i++) {
			try {
				return build(rng, kind);
			} catch (e) {
				if (i >= 40 || !(e instanceof TooFew)) throw e;
			}
		}
	};

const pick = (rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) => {
	const keys = new Set(others.map((o) => o.values.join('|')));
	keys.delete(right.values.join('|'));
	if (keys.size < 3) throw new TooFew(`${ID}: only ${keys.size} wrong options`);
	return choose(rng, right, others);
};

const rowsOf = (theme: Theme, rng: Rng) => theme.body.slice(0, rng.int(1, 2));
const quote = (rows: readonly string[]) => rows.join(', ');

// ---------------------------------------------------------------- 1: one or two calls

type Calls = 'una' | 'due';

function level1(rng: Rng, kind: Calls): CodeBuilt {
	const theme = rng.pick(THEMES);
	const body = rowsOf(theme, rng);
	const prints = [...theme.words.slice(0, rng.int(2, 3)), 'Fine'];
	// a call goes after the print of that index: never first, so that the order of the rows tells the answers apart
	const first = rng.int(0, prints.length - 2);
	const second = kind === 'due' ? rng.int(first + 1, prints.length - 1) : -1;
	const at = kind === 'due' ? [first, second] : [first];
	const stmts = prints.flatMap((word, i) => (at.includes(i) ? [say(word), CALL] : [say(word)]));
	const shown = whole(theme.fn, body, stmts);
	const right = written(shown)!;
	const moved = prints.flatMap((word, i) => (i === first + 1 ? [word, ...body] : [word]));
	const wrong = [
		// the body is run where it is defined, and the calls do nothing
		[...body, ...prints],
		// the function is never run
		prints,
		// the body is run where it is defined and at every call
		[...body, ...right],
		// only the first call counts
		prints.flatMap((word, i) => (i === first ? [word, ...body] : [word])),
		// the body is run after the row that follows the call
		moved,
		// the function is run at the end
		[...prints, ...body]
	];
	return {
		prompt: 'Segui il programma una riga alla volta.',
		problem: 'Che cosa scrive questo programma, una riga sotto l’altra?',
		code: texts(shown),
		solution: quote(right),
		steps: [
			`La definizione di ${theme.fn} non scrive niente: dice che cosa fare quando la funzione verrà chiamata.`,
			`A ogni chiamata ${theme.fn}() il flusso salta al corpo, che scrive ${quote(body)}, e poi torna alla riga dopo la chiamata.`,
			`Le chiamate sono ${at.length === 1 ? 'una' : 'due'}: in tutto il programma scrive ${quote(right)}.`
		],
		answer: pick(rng, printedOption(right), wrong.map(printedOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, fn: theme.fn, body, calls: at.length })
	};
}

// ---------------------------------------------------------------- 2: calls in a loop

type Loop = 'solo-ciclo' | 'anche-fuori' | 'due-nel-ciclo';

function level2(rng: Rng, kind: Loop): CodeBuilt {
	const theme = rng.pick(THEMES);
	const body = rowsOf(theme, rng);
	const k = rng.int(2, 5);
	const before = kind === 'anche-fuori' && rng.int(0, 1) === 0;
	const inside: Stmt[] = kind === 'due-nel-ciclo' ? [CALL, say(theme.short), CALL] : rng.int(0, 1) === 0 ? [say(theme.short), CALL] : [CALL, say(theme.short)];
	const stmts: Stmt[] = [say(theme.words[0]), ...(before ? [CALL] : []), { loop: k, body: inside }, ...(kind === 'anche-fuori' && !before ? [CALL] : []), say('Fine')];
	const shown = whole(theme.fn, body, stmts);
	const count = written(shown)!.filter((row) => row === body[0]).length;
	const inLoop = kind === 'due-nel-ciclo' ? 2 : 1;
	const outside = kind === 'anche-fuori' ? 1 : 0;
	// how many times the call is written in the program, the number of turns, the definition counted as a run
	const guesses = [inLoop + outside, k, 1, count + 1, k + 1, 2 * k, count - 1, k - 1].filter((x) => x !== count && x >= 0);
	return {
		prompt: 'Conta le chiamate che vengono eseguite, non quelle che sono scritte.',
		problem: `Quante volte viene eseguito il corpo della funzione ${theme.fn}?`,
		code: texts(shown),
		solution: `${count} volte.`,
		steps: [
			`Il corpo di ${theme.fn} viene eseguito una volta per ogni chiamata eseguita; la definizione da sola non lo esegue.`,
			`Il ciclo fa ${k} giri e in ogni giro ${inLoop === 1 ? 'c’è una chiamata' : 'ci sono due chiamate'}: ${k * inLoop} chiamate.`,
			outside ? `C’è poi una chiamata fuori dal ciclo, eseguita una volta sola: in tutto ${k * inLoop} + 1 = ${count}.` : `Fuori dal ciclo non ci sono altre chiamate: in tutto ${count}.`
		],
		answer: pick(
			rng,
			textOption(String(count)),
			guesses.map((x) => textOption(String(x)))
		),
		params: reference(shown, [[]], { case: kind, fn: theme.fn, body, turns: k, count })
	};
}

// ---------------------------------------------------------------- 3: which program writes this

function level3(rng: Rng, kind: Calls): CodeBuilt {
	const theme = rng.pick(THEMES);
	const body = rowsOf(theme, rng);
	// three of the four words, in their order
	const left = rng.int(0, 3);
	const prints = theme.words.filter((_, i) => i !== left);
	const first = rng.int(0, 1);
	const at = kind === 'due' ? [first, 2] : [rng.int(0, 2)];
	const laid = (calls: number[], bare = false) => prints.flatMap((word, i): Stmt[] => (calls.includes(i) ? [say(word), bare ? { call: true, bare: true } : CALL] : [say(word)]));
	const right = whole(theme.fn, body, laid(at));
	const target = written(right)!;
	// the function defined and never called, with the calls taken away or written without brackets: one of the two
	const never = rng.int(0, 1) === 0 ? whole(theme.fn, body, laid([])) : whole(theme.fn, body, laid(at, true));
	const shifted = at.map((i) => (i + 1) % 3);
	const candidates = [
		never,
		// the calls one row too late, or back at the start
		whole(theme.fn, body, laid(shifted)),
		// the call before the row it should follow
		whole(
			theme.fn,
			body,
			prints.flatMap((word, i): Stmt[] => (at.includes(i) ? [CALL, say(word)] : [say(word)]))
		),
		// one call too many, or one too few
		kind === 'due' ? whole(theme.fn, body, laid([at[0]])) : whole(theme.fn, body, laid([at[0], (at[0] + 1) % 3])),
		kind === 'due' ? whole(theme.fn, body, laid([at[1]])) : whole(theme.fn, body, laid([0, 1, 2])),
		// the function called first, as if its definition ran it
		whole(theme.fn, body, [CALL, ...prints.map(say)])
	];
	const kept = wrongPrograms(right, candidates, [[]]);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs`);
	return {
		prompt: 'Guarda dove sono le chiamate, e se hanno le parentesi.',
		problem: 'Quale programma scrive, in quest’ordine, le righe mostrate qui sotto?',
		listing: `${target.join('\n')}\n`,
		solution: `Il programma che chiama ${theme.fn}() ${at.length === 1 ? `dopo aver scritto ${prints[at[0]]}` : `dopo ${prints[at[0]]} e dopo ${prints[at[1]]}`}.`,
		steps: [
			`Il corpo di ${theme.fn} scrive ${quote(body)}: nelle righe da ottenere compare ${at.length === 1 ? 'una volta' : 'due volte'}, quindi ${at.length === 1 ? 'serve una chiamata' : 'servono due chiamate'}.`,
			`Ogni chiamata sta subito dopo la riga che precede ${body[0]} sullo schermo.`,
			`Una chiamata ha sempre le parentesi: il nome ${theme.fn} da solo non fa eseguire la funzione, e una funzione definita e mai chiamata non scrive niente.`
		],
		solutionCode: shownOf(right),
		answer: choose(
			rng,
			programOption(right, shownOf(right)),
			kept.map((p) => programOption(p, shownOf(p)))
		),
		params: reference(right, [[]], { case: kind, fn: theme.fn, body, target })
	};
}

// ---------------------------------------------------------------- 4: one parameter

const SYMBOLS = [
	{ fn: 'linea', symbol: '-' },
	{ fn: 'stelle', symbol: '*' },
	{ fn: 'barra', symbol: '#' },
	{ fn: 'riga', symbol: '=' }
] as const;

type Argument = 'numeri' | 'variabile' | 'espressione';

function level4(rng: Rng, kind: Argument): CodeBuilt {
	const { fn, symbol } = rng.pick(SYMBOLS);
	const a = rng.int(1, 5);
	let b = rng.int(2, 6);
	if (b === a) b = a + 1;
	// each call as it is written, its value, and what a student who misreads it would take the value to be
	let calls: { text: string; value: number; misread: number }[];
	let setup: string[] = [];
	let variable = '';
	if (kind === 'numeri') {
		const c = rng.int(1, 6);
		calls = [
			{ text: String(a), value: a, misread: a },
			{ text: String(b), value: b, misread: a },
			...(rng.int(0, 1) === 0 ? [{ text: String(c), value: c, misread: a }] : [])
		];
	} else if (kind === 'variabile') {
		variable = rng.pick(['k', 'm', 'lato']);
		const d = rng.int(1, 3);
		setup = [`${variable} = ${a}`];
		calls = [
			{ text: variable, value: a, misread: a },
			{ text: `${variable} + ${d}`, value: a + d, misread: a }
		];
	} else {
		const x = rng.int(2, 3);
		const y = rng.int(2, 3);
		const d = rng.int(1, 4);
		calls = [
			{ text: String(a), value: a, misread: a },
			rng.int(0, 1) === 0 ? { text: `${x} * ${y}`, value: x * y, misread: x } : { text: `${b} + ${d}`, value: b + d, misread: b }
		];
	}
	const python = `def ${fn}(n):\n    for i in range(n):\n        print("${symbol}", end="")\n    print()\n\n${[...setup, ...calls.map((c) => `${fn}(${c.text})`)].join('\n')}\n`;
	const cpp = cppProgram([...setup.map((row) => `int ${row};`), ...calls.map((c) => `${fn}(${c.text});`)].join('\n'), `void ${fn}(int n) {\n    for (int i = 0; i < n; i++) {\n        cout << "${symbol}";\n    }\n    cout << endl;\n}`);
	const row = (n: number) => symbol.repeat(n);
	const values = calls.map((c) => c.value);
	const shown = program(python, cpp, () => values.map(row));
	const right = values.map(row);
	const wrong = [
		// the expression or the variable read wrongly: only its first number counts
		calls.map((c) => row(c.misread)),
		// one symbol too many, or one too few, in every row
		values.map((n) => row(n + 1)),
		values.map((n) => row(Math.max(1, n - 1))),
		// everything on one row, without the new line at the end of the body
		[row(values.reduce((s, n) => s + n, 0))],
		// the rows in the opposite order
		[...values].reverse().map(row),
		// the body run once, for the first call only
		[row(values[0])],
		// one symbol per call: the parameter forgotten
		values.map(() => symbol)
	];
	return {
		prompt: 'A ogni chiamata guarda quanto vale il parametro n.',
		problem: 'Che cosa scrive questo programma, una riga sotto l’altra?',
		code: texts(shown),
		solution: quote(right),
		steps: [
			`A ogni chiamata il valore tra le parentesi viene calcolato e messo nel parametro n${variable ? `: la variabile ${variable} vale ${a}` : ''}.`,
			`Il ciclo del corpo scrive n volte il carattere ${symbol} sulla stessa riga, poi l’ultima istruzione va a capo.`,
			`I valori di n sono, nell’ordine, ${values.join(', ')}: le righe hanno ${values.join(', ')} caratteri.`
		],
		answer: pick(rng, printedOption(right), wrong.map(printedOption)),
		params: reference(shown, [[]], { ask: 'output', case: kind, fn, symbol, values })
	};
}

// ---------------------------------------------------------------- 5: write the function

type Task = 'ripeti' | 'cornice' | 'alterna';

function level5(rng: Rng, kind: Task): CodeBuilt {
	const theme = rng.pick(THEMES);
	const body = rowsOf(theme, rng);
	const word = theme.short;
	const loop = (count: Count, inside: Stmt[]): Stmt => ({ loop: count, body: inside });
	const plan = (count: Count): Stmt[] => (kind === 'ripeti' ? [loop(count, [CALL])] : kind === 'cornice' ? [CALL, loop(count, [say(word)]), CALL] : [loop(count, [say(word), CALL])]);
	const solution = whole(theme.fn, body, plan('n'), true);
	const tests: string[][] = [];
	while (tests.length < 3) {
		const n = String(rng.int(1, 4));
		if (!tests.some((t) => t[0] === n)) tests.push([n]);
	}
	const candidates = [
		// one turn too many, one too few
		whole(theme.fn, body, plan('n+1'), true),
		whole(theme.fn, body, plan('n-1'), true),
		// the call left out of the loop, or put in it, or made once only
		kind === 'ripeti' ? whole(theme.fn, body, [CALL], true) : kind === 'cornice' ? whole(theme.fn, body, [CALL, loop('n', [say(word)])], true) : whole(theme.fn, body, [loop('n', [say(word)]), CALL], true),
		kind === 'cornice' ? whole(theme.fn, body, [loop('n', [CALL, say(word)]), CALL], true) : whole(theme.fn, body, [CALL, loop('n', kind === 'ripeti' ? [CALL] : [say(word), CALL])], true),
		// the function defined and never called
		whole(
			theme.fn,
			body,
			plan('n').flatMap((s): Stmt[] => ('call' in s ? [] : 'loop' in s ? [loop(s.loop, s.body.some((x) => 'print' in x) ? s.body.filter((x) => 'print' in x) : [say(word)])] : [s])),
			true
		),
		// the rows of the body in the other order
		...(body.length === 2 ? [whole(theme.fn, [body[1], body[0]], plan('n'), true)] : [])
	];
	const kept = wrongPrograms(solution, candidates, tests);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs`);
	const writes = body.length === 1 ? `la riga ${body[0]}` : `le due righe ${body[0]} e ${body[1]}`;
	const task = kind === 'ripeti' ? `chiamala n volte` : kind === 'cornice' ? `chiamala una volta, scrivi n volte la riga ${word} e chiamala di nuovo` : `per n volte scrivi la riga ${word} e subito dopo chiamala`;
	const start = {
		python: `# scrivi qui la funzione ${theme.fn}\n\nn = int(input())\n# scrivi qui il resto\n`,
		cpp: cppProgram('int n;\ncin >> n;\n// scrivi qui il resto', `// scrivi qui la funzione ${theme.fn}\n`)
	};
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge un numero intero n. Scrivi una funzione ${theme.fn}() che scrive ${writes}; poi, nel programma principale, ${task}. La lettura c’è già.`,
		solution: `Una funzione ${theme.fn} senza parametri, definita sopra il programma principale e chiamata ${kind === 'cornice' ? 'prima e dopo il ciclo' : 'dentro il ciclo'}.`,
		steps: [
			`Sopra il programma principale definisci ${theme.fn}: il corpo scrive ${writes}.`,
			`Dopo la lettura scrivi un ciclo che fa n giri${kind === 'ripeti' ? ` e in ogni giro chiama ${theme.fn}()` : kind === 'cornice' ? ` e scrive ${word}, con una chiamata di ${theme.fn}() prima del ciclo e una dopo` : `: in ogni giro scrive ${word} e poi chiama ${theme.fn}()`}.`,
			'Ogni chiamata ha le parentesi, anche se dentro non c’è niente.'
		],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'funzione'),
		choice: choose(
			rng,
			programOption(solution, shownOf(solution)),
			kept.map((p) => programOption(p, shownOf(p)))
		),
		params: reference(solution, tests, { case: kind, fn: theme.fn, body, word })
	};
}

export default makeCodeGenerator(ID, 'Definire e chiamare una funzione', {
	1: { label: 'Seguire una chiamata', constraints: ['a function without parameters called once or twice', 'never as the first instruction', 'four different outputs'], build: drawn(['una', 'due'] as const, level1) },
	2: { label: 'Contare le chiamate', constraints: ['a call in a loop of 2 to 5 turns', 'at most one call outside the loop', 'four different numbers'], build: drawn(['solo-ciclo', 'anche-fuori', 'due-nel-ciclo'] as const, level2) },
	3: { label: 'Quale programma scrive questo', constraints: ['four programs that write different rows', 'one of them never calls its function'], build: drawn(['una', 'due'] as const, level3) },
	4: { label: 'Una funzione con un parametro', constraints: ['one parameter, the number of symbols in a row', 'arguments from 1 to 10', 'four different outputs'], build: drawn(['numeri', 'variabile', 'espressione'] as const, level4) },
	5: { label: 'Scrivere una funzione', constraints: ['the program reads n', 'graded by running it on three values of n', 'needs a function of its own'], build: drawn(['ripeti', 'cornice', 'alterna'] as const, level5) }
});
