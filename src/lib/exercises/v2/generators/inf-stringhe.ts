/**
 * Exercises for the lesson "Le stringhe" (informatica, third year, lesson 73). Spec: specs/exercises/inf-stringhe.md
 *
 * 1. the length of a string and one of its characters; 2. a loop that counts characters; 3. a loop that builds a
 * new string; 4. two strings compared with `<` and with `==`; 5. which function does what is asked (options that
 * are programs, shown by their function alone); 6. write the loop (open answer: the word is read, and the answer
 * must have a loop).
 *
 * Every program is written by hand in Python and in C++ (v2/inf-codice.ts): `string` in C++, `n` for the length,
 * `i` for the index, a character between double quotes in Python and between single ones in C++, as in the lesson.
 */
import type { Rng } from '../types';
import { OPTION_WIDTH, choose, shuffle, cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, quoted, reader, reference, texts, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';

export const ID = 'inf-stringhe';

class TooFew extends Error {}

/** A level whose words are drawn again when they leave too few wrong answers; the family is drawn once, before. */
const drawn =
	<F>(families: readonly F[], build: (rng: Rng, family: F) => CodeBuilt) =>
	(rng: Rng): CodeBuilt => {
		const family = rng.pick(families);
		for (let i = 1; ; i++) {
			try {
				return build(rng, family);
			} catch (e) {
				if (i >= 60 || !(e instanceof TooFew)) throw e;
			}
		}
	};

/** The multiple choice of `choose`, or `TooFew` where fewer than three wrong options are left. */
const pick = (rng: Rng, right: Parameters<typeof choose>[1], others: Parameters<typeof choose>[2]) => {
	const key = (o: { values: string[] }) => o.values.join('|');
	const wrong = others.filter((o) => key(o) !== key(right));
	if (new Set(wrong.map(key)).size < 3) throw new TooFew(`${ID}: too few wrong options`);
	return choose(rng, right, wrong);
};

/** Words without accents and without capitals, from 4 to 9 letters. */
const WORDS = [
	'libro', 'banco', 'scuola', 'zaino', 'matita', 'gomma', 'penna', 'quaderno', 'registro', 'lavagna', 'finestra', 'porta', 'sedia', 'tavolo', 'tastiera', 'schermo', 'numero', 'lettera', 'parola', 'frase',
	'codice', 'ciclo', 'vettore', 'matrice', 'stringa', 'banana', 'mamma', 'tetto', 'palla', 'gatto', 'cane', 'mare', 'sole', 'luna', 'stella', 'fiore', 'albero', 'montagna', 'fiume', 'strada',
	'treno', 'aereo', 'nave', 'pane', 'latte', 'pizza', 'pasta', 'torta', 'mela', 'pera', 'limone', 'arancia', 'fragola', 'musica', 'chitarra', 'tamburo', 'calcio', 'tennis', 'nuoto', 'corsa',
	'salto', 'amico', 'classe', 'voto', 'media', 'storia', 'scienze', 'disegno', 'inglese', 'roma', 'milano', 'torino', 'napoli', 'bari', 'genova', 'verona', 'pisa', 'casa', 'sasso', 'cassa',
	'nonno', 'panno', 'carro', 'terra', 'bello', 'rosso', 'giallo', 'azzurro', 'ragazzo', 'cappello', 'occhio', 'pioggia', 'cavallo', 'coccola', 'ananas', 'cocomero', 'patata', 'carota', 'tromba', 'violino'
] as const;
/** The wrong answers in the order they are offered: the mistake made most often first, the others as they are drawn. */
const mixed = <T>(rng: Rng, xs: T[]): T[] => (xs.length ? [xs[0], ...shuffle(rng, xs.slice(1))] : xs);
const different = (word: string) => new Set(word).size === word.length;
const NAMES = ['parola', 'nome', 'testo'] as const;

/** A character as each language writes it: a text of one letter in Python, a `char` in C++. */
const char = (c: string) => ({ python: `"${c}"`, cpp: `'${c}'` });
type Lang = 'python' | 'cpp';

// ---------------------------------------------------------------- one loop over a string

/** The turns of the loop: which indices `i` takes on a string of length n, as the two languages write them. */
const RANGES = {
	tutti: { python: 'range(n)', cpp: 'int i = 0; i < n; i++', of: (n: number) => Array.from({ length: n }, (_, i) => i) },
	senzaPrimo: { python: 'range(1, n)', cpp: 'int i = 1; i < n; i++', of: (n: number) => Array.from({ length: Math.max(0, n - 1) }, (_, i) => i + 1) },
	senzaUltimo: { python: 'range(n - 1)', cpp: 'int i = 0; i < n - 1; i++', of: (n: number) => Array.from({ length: Math.max(0, n - 1) }, (_, i) => i) },
	pari: { python: 'range(0, n, 2)', cpp: 'int i = 0; i < n; i += 2', of: (n: number) => Array.from({ length: Math.ceil(n / 2) }, (_, i) => 2 * i) },
	dispari: { python: 'range(1, n, 2)', cpp: 'int i = 1; i < n; i += 2', of: (n: number) => Array.from({ length: Math.floor(n / 2) }, (_, i) => 2 * i + 1) },
	indietro: { python: 'range(n - 1, -1, -1)', cpp: 'int i = n - 1; i >= 0; i--', of: (n: number) => Array.from({ length: n }, (_, i) => n - 1 - i) },
	indietroSenzaPrimo: { python: 'range(n - 1, 0, -1)', cpp: 'int i = n - 1; i > 0; i--', of: (n: number) => Array.from({ length: Math.max(0, n - 1) }, (_, i) => n - 1 - i) },
	indietroSenzaUltimo: { python: 'range(n - 2, -1, -1)', cpp: 'int i = n - 2; i >= 0; i--', of: (n: number) => Array.from({ length: Math.max(0, n - 1) }, (_, i) => n - 2 - i) }
} as const;
type RangeKey = keyof typeof RANGES;

type Value = number | string;
/** What a row says, for a string called `s` and in a language (a character is written differently in the two). */
type Text = (s: string, lang: Lang) => string;
/** A condition on the character of index i, and what it is worth. */
interface Test {
	text: Text;
	of: (s: string, i: number) => boolean;
}
/** An assignment to the value the loop keeps, and what the value becomes. */
interface Step {
	text: Text;
	of: (acc: Value, s: string, i: number) => Value;
}

/** One loop over the characters of a string that keeps one value, a number or a new string. */
interface Scan {
	acc: string;
	type: 'int' | 'string';
	init: Value;
	range: RangeKey;
	when?: Test;
	then: Step;
	otherwise?: Step;
}

const scanValue = (scan: Scan, s: string): Value => {
	let acc = scan.init;
	for (const i of RANGES[scan.range].of(s.length)) {
		if (i < 0 || i >= s.length) throw new Error('index out of the string');
		if (!scan.when || scan.when.of(s, i)) acc = scan.then.of(acc, s, i);
		else if (scan.otherwise) acc = scan.otherwise.of(acc, s, i);
	}
	return acc;
};

const literal = (v: Value) => (typeof v === 'number' ? String(v) : quoted(v));

/** The rows of the loop for a string called `name`, from the length to the end of the loop. */
function scanRows(scan: Scan, name: string): { python: string[]; cpp: string[] } {
	const body = (lang: Lang) => {
		const end = lang === 'cpp' ? ';' : '';
		if (!scan.when) return [`${scan.then.text(name, lang)}${end}`];
		const test = scan.when.text(name, lang);
		return lang === 'python'
			? [`if ${test}:`, `    ${scan.then.text(name, lang)}`, ...(scan.otherwise ? ['else:', `    ${scan.otherwise.text(name, lang)}`] : [])]
			: [`if (${test}) {`, `    ${scan.then.text(name, lang)};`, ...(scan.otherwise ? ['} else {', `    ${scan.otherwise.text(name, lang)};`] : []), '}'];
	};
	return {
		python: [`n = len(${name})`, `${scan.acc} = ${literal(scan.init)}`, `for i in ${RANGES[scan.range].python}:`, ...body('python').map((row) => `    ${row}`)],
		cpp: [`int n = ${name}.length();`, `${scan.type} ${scan.acc} = ${literal(scan.init)};`, `for (${RANGES[scan.range].cpp}) {`, ...body('cpp').map((row) => `    ${row}`), '}']
	};
}

/** The loop and the writing of its value: what an option shows of a program whose word is given or read. */
function inlineShown(scan: Scan, name: string) {
	const rows = scanRows(scan, name);
	return { python: [...rows.python, `print(${scan.acc})`].join('\n') + '\n', cpp: [...rows.cpp, `cout << ${scan.acc} << endl;`].join('\n') + '\n' };
}

/** A whole program: the word written in it, the loop, the value written. */
function inlineProgram(scan: Scan, name: string, word: string): Program {
	const shown = inlineShown(scan, name);
	return program(`${name} = ${quoted(word)}\n${shown.python}`, cppProgram(`string ${name} = ${quoted(word)};\n${shown.cpp}`, '', ['string']), () => [String(scanValue(scan, word))]);
}

/** A whole program: the word read from the keyboard, the loop, the value written. */
function readingProgram(scan: Scan, name: string): Program {
	const shown = inlineShown(scan, name);
	return program(`${name} = input()\n${shown.python}`, cppProgram(`string ${name};\ncin >> ${name};\n${shown.cpp}`, '', ['string']), (input) => [String(scanValue(scan, reader(input)()))]);
}

/** The loop as a function `name(s)` or `name(s, c)` that gives back its value. */
function functionShown(scan: Scan, name: string, withChar: boolean) {
	const rows = scanRows(scan, 's');
	return {
		python: [`def ${name}(s${withChar ? ', c' : ''}):`, ...rows.python.map((row) => `    ${row}`), `    return ${scan.acc}`].join('\n') + '\n',
		cpp: [`${scan.type} ${name}(string s${withChar ? ', char c' : ''}) {`, ...rows.cpp.map((row) => `    ${row}`), `    return ${scan.acc};`, '}'].join('\n') + '\n'
	};
}

/** A whole program: the function, tried on some words (with a letter each, when it takes one). */
function functionProgram(scan: Scan, name: string, calls: readonly { word: string; letter?: string }[], run: (word: string, letter?: string) => Value): Program {
	const shown = functionShown(scan, name, calls[0].letter !== undefined);
	const call = (c: { word: string; letter?: string }, lang: Lang) => `${name}(${quoted(c.word)}${c.letter === undefined ? '' : `, ${char(c.letter)[lang]}`})`;
	return program(`${shown.python}\n${calls.map((c) => `print(${call(c, 'python')})`).join('\n')}\n`, cppProgram(calls.map((c) => `cout << ${call(c, 'cpp')} << endl;`).join('\n'), shown.cpp, ['string']), () => calls.map((c) => String(run(c.word, c.letter))));
}

const fits = (shown: { python: string; cpp: string }) => `${shown.python}${shown.cpp}`.split('\n').every((row) => row.length <= OPTION_WIDTH);

// the pieces the loops are made of. `x` is the letter: a literal, or the parameter `c` of a function (null)
const el: Text = (s) => `${s}[i]`;
const letterText = (x: string | null, lang: Lang) => (x === null ? 'c' : char(x)[lang]);
const equal = (x: string | null, letter: (s: string) => string): Test => ({ text: (s, lang) => `${el(s, lang)} == ${letterText(x, lang)}`, of: (s, i) => s[i] === letter(s) });
const unequal = (x: string | null, letter: (s: string) => string): Test => ({ text: (s, lang) => `${el(s, lang)} != ${letterText(x, lang)}`, of: (s, i) => s[i] !== letter(s) });
const plusOne = (acc: string): Step => ({ text: () => `${acc} = ${acc} + 1`, of: (a) => Number(a) + 1 });
const plusIndex = (acc: string): Step => ({ text: () => `${acc} = ${acc} + i`, of: (a, _s, i) => Number(a) + i });
const setOne = (acc: string): Step => ({ text: () => `${acc} = 1`, of: () => 1 });
const append = (acc: string): Step => ({ text: (s) => `${acc} = ${acc} + ${s}[i]`, of: (a, s, i) => String(a) + s[i] });
const prepend = (acc: string): Step => ({ text: (s) => `${acc} = ${s}[i] + ${acc}`, of: (a, s, i) => s[i] + String(a) });
const overwrite = (acc: string): Step => ({ text: (s) => `${acc} = ${s}[i]`, of: (_a, s, i) => s[i] });
const star = (acc: string): Step => ({ text: () => `${acc} = ${acc} + "*"`, of: (a) => String(a) + '*' });
const twice = (acc: string): Step => ({ text: (s) => `${acc} = ${acc} + ${s}[i] + ${s}[i]`, of: (a, s, i) => String(a) + s[i] + s[i] });

type Task = { right: Scan; wrong: Scan[] };

/** How many times a letter is in the string. The letter of a function is its parameter, worked out by `letter`. */
function counting(acc: string, x: string | null, letter: (s: string) => string): Task {
	const right: Scan = { acc, type: 'int', init: 0, range: 'tutti', when: equal(x, letter), then: plusOne(acc) };
	return {
		right,
		wrong: [{ ...right, when: unequal(x, letter) }, { ...right, init: 1 }, { ...right, then: plusIndex(acc) }, { ...right, range: 'senzaPrimo' }, { ...right, then: setOne(acc) }, { ...right, when: undefined }, { ...right, range: 'senzaUltimo' }]
	};
}

/** The string written backwards: forwards with every character put in front, or backwards with every one put at the end. */
function reversing(acc: string, how: 'davanti' | 'indietro'): Task {
	if (how === 'davanti') {
		const right: Scan = { acc, type: 'string', init: '', range: 'tutti', then: prepend(acc) };
		return { right, wrong: [{ ...right, then: append(acc) }, { ...right, range: 'senzaPrimo' }, { ...right, then: overwrite(acc) }, { ...right, range: 'senzaUltimo' }, { ...right, range: 'senzaPrimo', then: append(acc) }] };
	}
	const right: Scan = { acc, type: 'string', init: '', range: 'indietro', then: append(acc) };
	return { right, wrong: [{ ...right, range: 'tutti' }, { ...right, range: 'indietroSenzaPrimo' }, { ...right, range: 'indietroSenzaUltimo' }, { ...right, then: overwrite(acc) }, { ...right, range: 'senzaPrimo' }] };
}

/** The string without a letter. */
function removing(acc: string, x: string | null, letter: (s: string) => string): Task {
	const right: Scan = { acc, type: 'string', init: '', range: 'tutti', when: unequal(x, letter), then: append(acc) };
	return { right, wrong: [{ ...right, when: equal(x, letter) }, { ...right, then: prepend(acc) }, { ...right, range: 'senzaPrimo' }, { ...right, then: overwrite(acc) }, { ...right, when: undefined }, { ...right, range: 'senzaUltimo' }] };
}

/** The string with an asterisk in place of a letter. */
function replacing(acc: string, x: string): Task {
	const right: Scan = { acc, type: 'string', init: '', range: 'tutti', when: equal(x, () => x), then: star(acc), otherwise: append(acc) };
	return {
		right,
		wrong: [{ ...right, when: unequal(x, () => x) }, { ...right, otherwise: undefined }, { ...right, range: 'senzaPrimo' }, { ...right, range: 'senzaUltimo' }, { ...right, when: undefined, otherwise: undefined, then: append(acc) }, { ...right, otherwise: prepend(acc) }]
	};
}

// ---------------------------------------------------------------- level 1

type FirstCase = 'lunghezza' | 'carattere' | 'dalla-fine';

function level1(rng: Rng, family: FirstCase): CodeBuilt {
	const word = rng.pick(WORDS.filter((w) => different(w) && w.length >= 5));
	const name = rng.pick(NAMES);
	const n = word.length;
	const whole = (python: string[], cpp: string[], out: string) => program([`${name} = ${quoted(word)}`, ...python].join('\n') + '\n', cppProgram([`string ${name} = ${quoted(word)};`, ...cpp].join('\n'), '', ['string']), () => [out]);
	if (family === 'lunghezza') {
		const shown = whole([`print(len(${name}))`], [`cout << ${name}.length() << endl;`], String(n));
		return {
			prompt: 'Conta i caratteri uno per uno.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: String(n),
			steps: [`La lunghezza di una stringa è il numero dei suoi caratteri.`, `"${word}" ha ${n} caratteri: ${[...word].join(', ')}.`, `${n - 1} è l'indice dell'ultimo carattere, non la lunghezza: gli indici partono da 0.`],
			answer: pick(rng, writtenOption([String(n)]), [n - 1, n + 1, n - 2].map((x) => writtenOption([String(x)]))),
			params: reference(shown, [[]], { ask: 'output', case: family, word })
		};
	}
	if (family === 'carattere') {
		const k = rng.int(1, n - 2);
		const shown = whole([`print(${name}[${k}])`], [`cout << ${name}[${k}] << endl;`], word[k]);
		return {
			prompt: 'Gli indici dei caratteri partono da 0.',
			problem: 'Che cosa scrive questo programma?',
			code: texts(shown),
			solution: word[k],
			steps: [`${name}[${k}] è il carattere di indice ${k}.`, `Gli indici partono da 0: ${[...word].map((c, i) => `la ${c} ha indice ${i}`).slice(0, k + 1).join(', ')}.`, `Il carattere di indice ${k} è la ${word[k]}; la ${word[k - 1]} è quello che trova chi conta da 1.`],
			answer: pick(rng, writtenOption([word[k]]), [word[k - 1], word[k + 1], word[0], word[n - 1]].map((c) => writtenOption([c]))),
			params: reference(shown, [[]], { ask: 'output', case: family, word, k })
		};
	}
	// n - 1 is the last character, n - 2 the one before
	const back = rng.int(1, 2);
	const shown = whole([`n = len(${name})`, `print(${name}[n - ${back}])`], [`int n = ${name}.length();`, `cout << ${name}[n - ${back}] << endl;`], word[n - back]);
	return {
		prompt: "Calcola prima n, poi l'indice.",
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: word[n - back],
		steps: [`"${word}" ha ${n} caratteri, quindi n vale ${n}.`, `n - ${back} fa ${n - back}: il programma scrive il carattere di indice ${n - back}.`, `Gli indici vanno da 0 a ${n - 1}: il carattere di indice ${n - back} è ${word[n - back]}, ${back === 1 ? "l'ultimo" : 'il penultimo'}.`],
		answer: pick(rng, writtenOption([word[n - back]]), [word[n - back - 1], word[n - back + 1] ?? word[0], word[back], word[back - 1], word[n - 3]].map((c) => writtenOption([c]))),
		params: reference(shown, [[]], { ask: 'output', case: family, word, back })
	};
}

// ---------------------------------------------------------------- level 2

type CountCase = 'lettera' | 'prima' | 'doppie';

function level2(rng: Rng, family: CountCase): CodeBuilt {
	const name = rng.pick(NAMES);
	const acc = 'conta';
	let word: string;
	let task: Task;
	let why: string;
	let letter: string | undefined;
	if (family === 'lettera') {
		word = rng.pick(WORDS.filter((w) => !different(w)));
		const x = rng.pick([...new Set(word)].filter((c) => [...word].filter((d) => d === c).length >= 2));
		letter = x;
		task = counting(acc, x, () => x);
		why = `conta sale di 1 a ogni carattere uguale a ${x}`;
	} else if (family === 'prima') {
		word = rng.pick(WORDS.filter((w) => w.length >= 5));
		const x = rng.pick(['f', 'g', 'h', 'l', 'm', 'n', 'p']);
		letter = x;
		const before: Test = { text: (s, lang) => `${s}[i] < ${char(x)[lang]}`, of: (s, i) => s[i] < x };
		const right: Scan = { acc, type: 'int', init: 0, range: 'tutti', when: before, then: plusOne(acc) };
		task = {
			right,
			wrong: [
				{ ...right, when: { text: (s, lang) => `${s}[i] > ${char(x)[lang]}`, of: (s, i) => s[i] > x } },
				{ ...right, when: { text: (s, lang) => `${s}[i] <= ${char(x)[lang]}`, of: (s, i) => s[i] <= x } },
				{ ...right, init: 1 },
				{ ...right, range: 'senzaPrimo' },
				{ ...right, when: undefined },
				{ ...right, range: 'senzaUltimo' }
			]
		};
		why = `conta sale di 1 a ogni lettera che nell'alfabeto viene prima della ${x}: tra due caratteri, < confronta i codici, che per le minuscole seguono l'ordine alfabetico`;
	} else {
		// three times out of four a word with a double letter
		word = rng.int(0, 3) ? rng.pick(WORDS.filter((w) => /(.)\1/.test(w))) : rng.pick(WORDS);
		const twin: Test = { text: (s) => `${s}[i] == ${s}[i + 1]`, of: (s, i) => s[i] === s[i + 1] };
		const right: Scan = { acc, type: 'int', init: 0, range: 'senzaUltimo', when: twin, then: plusOne(acc) };
		task = {
			right,
			wrong: [{ ...right, when: { text: (s) => `${s}[i] != ${s}[i + 1]`, of: (s, i) => s[i] !== s[i + 1] } }, { ...right, init: 1 }, { ...right, then: plusIndex(acc) }, { ...right, when: undefined }, { ...right, then: { text: () => `${acc} = ${acc} + 2`, of: (a) => Number(a) + 2 } }]
		};
		why = `conta sale di 1 ogni volta che un carattere è uguale a quello che lo segue: il ciclo si ferma a n - 2 perché l'ultimo carattere non ha un successivo`;
	}
	const shown = inlineProgram(task.right, name, word);
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		task.wrong.map((scan) => inlineProgram(scan, name, word)),
		[[]]
	).map((p) => written(p)!);
	// what a student answers without following the loop: the length of the word
	const guesses = [[String(word.length)], [String(Number(rows[0]) + 1)]];
	return {
		prompt: 'Segui il ciclo un carattere alla volta.',
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps: [`"${word}" ha ${word.length} caratteri, con gli indici da 0 a ${word.length - 1}.`, `Il ciclo li guarda uno alla volta, e ${why}.`, `Alla fine conta vale ${rows[0]}.`],
		answer: pick(rng, writtenOption(rows), [...others, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, word, ...(letter ? { letter } : {}) })
	};
}

// ---------------------------------------------------------------- level 3

type BuildCase = 'rovescia' | 'davanti' | 'salta' | 'sostituisce' | 'raddoppia';
const BUILDS: readonly BuildCase[] = ['rovescia', 'davanti', 'salta', 'sostituisce', 'raddoppia'];

function level3(rng: Rng, family: BuildCase): CodeBuilt {
	const name = rng.pick(NAMES);
	// a short name where two characters are added in one row, which would not fit the C++ otherwise
	const acc = family === 'raddoppia' ? 'r' : 'nuova';
	let word = rng.pick(WORDS.filter((w) => w.length >= 4 && w.length <= 7));
	let task: Task;
	let steps: string[];
	let letter: string | undefined;
	if (family === 'rovescia' || family === 'davanti') {
		task = reversing(acc, family === 'rovescia' ? 'indietro' : 'davanti');
		steps =
			family === 'rovescia'
				? [`i parte da n - 1, l'indice dell'ultimo carattere, e scende fino a 0.`, `A ogni giro il carattere ${name}[i] viene attaccato in fondo a ${acc}: prima ${word[word.length - 1]}, poi ${word[word.length - 2]}, e così via.`]
				: [`i va da 0 a n - 1, ma ogni carattere viene messo davanti a quelli già presi.`, `Dopo due giri ${acc} vale "${word[1]}${word[0]}": il carattere arrivato per ultimo sta per primo.`];
	} else if (family === 'salta') {
		const right: Scan = { acc, type: 'string', init: '', range: 'pari', then: append(acc) };
		task = { right, wrong: [{ ...right, range: 'dispari' }, { ...right, range: 'tutti' }, { ...right, range: 'senzaPrimo' }, { ...right, then: prepend(acc) }, { ...right, then: overwrite(acc) }] };
		steps = [`Il passo del ciclo è 2: i vale ${RANGES.pari.of(word.length).join(', ')}.`, `Vengono presi solo i caratteri con indice pari, a partire dal primo, che ha indice 0.`];
	} else if (family === 'sostituisce') {
		word = rng.pick(WORDS.filter((w) => w.length >= 4 && w.length <= 7 && !different(w)));
		const x = rng.pick([...new Set(word)].filter((c) => [...word].filter((d) => d === c).length >= 2));
		letter = x;
		task = replacing(acc, x);
		steps = [`Il ciclo guarda tutti i caratteri, dal primo all'ultimo.`, `Quando il carattere è ${x} attacca un asterisco, altrimenti attacca il carattere com'è.`];
	} else {
		word = rng.pick(WORDS.filter((w) => w.length === 4));
		const right: Scan = { acc, type: 'string', init: '', range: 'tutti', then: twice(acc) };
		task = { right, wrong: [{ ...right, then: append(acc) }, { ...right, range: 'senzaPrimo' }, { ...right, then: { text: (s) => `${acc} = ${s}[i] + ${s}[i]`, of: (_a, s, i) => s[i] + s[i] } }, { ...right, range: 'senzaUltimo' }] };
		steps = [`A ogni giro vengono attaccati due caratteri uguali, ${name}[i] e ancora ${name}[i].`, `Dopo il primo giro ${acc} vale "${word[0]}${word[0]}", dopo il secondo "${word[0]}${word[0]}${word[1]}${word[1]}".`];
	}
	const shown = inlineProgram(task.right, name, word);
	const rows = written(shown)!;
	const others = wrongPrograms(
		shown,
		task.wrong.map((scan) => inlineProgram(scan, name, word)),
		[[]]
	)
		.map((p) => written(p)!)
		.filter((out) => out[0] !== '');
	// the word as it is, the word twice: what is answered without following the loop
	const guesses = [[word], ...(family === 'raddoppia' ? [[word + word]] : [])];
	return {
		prompt: `Scrivi quanto vale ${acc} dopo ogni giro.`,
		problem: 'Che cosa scrive questo programma?',
		code: texts(shown),
		solution: rows[0],
		steps: [`${acc} parte dalla stringa vuota, e "${word}" ha ${word.length} caratteri.`, ...steps, `Alla fine ${acc} vale "${rows[0]}".`],
		answer: pick(rng, writtenOption(rows), [...others, ...guesses].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, word, ...(letter ? { letter } : {}) })
	};
}

// ---------------------------------------------------------------- level 4

type OrderCase = 'ordine' | 'prefisso' | 'maiuscola';
const PREFIXES: readonly [string, string][] = [
	['casa', 'casale'],
	['mare', 'marea'],
	['porta', 'portale'],
	['cane', 'canestro'],
	['pesca', 'pescatore'],
	['sole', 'soleggiato'],
	['carta', 'cartaccia'],
	['fiore', 'fiorellino'],
	['banco', 'bancone'],
	['libro', 'librone']
];
const capital = (w: string) => w[0].toUpperCase() + w.slice(1);

function level4(rng: Rng, family: OrderCase): CodeBuilt {
	let a: string;
	let b: string;
	let why: string;
	if (family === 'prefisso') {
		[a, b] = rng.pick(PREFIXES);
		why = `"${a}" è l'inizio di "${b}": i primi ${a.length} caratteri sono uguali e poi "${a}" finisce, quindi viene prima la più corta`;
	} else {
		a = rng.pick(WORDS);
		b = rng.pick(WORDS.filter((w) => w[0] !== a[0]));
		if (a > b) [a, b] = [b, a];
		if (family === 'maiuscola') {
			// the word that comes later in the dictionary gets the capital, and so comes first
			[a, b] = [capital(b), a];
			why = `${a[0]} è maiuscola, e le maiuscole hanno tutte un codice più piccolo delle minuscole: "${a}" viene prima di "${b}", anche se nel dizionario è il contrario`;
		} else {
			const k = [...a].findIndex((c, i) => c !== b[i]);
			why = `${k === 0 ? 'già il primo carattere è diverso' : k === 1 ? 'il primo carattere è uguale e il secondo no' : `i primi ${k} caratteri sono uguali e il successivo no`}: ${a[k]} viene prima di ${b[k]}, quindi "${a}" viene prima di "${b}"`;
		}
	}
	const smaller = a;
	if (rng.int(0, 1) === 1) [a, b] = [b, a];
	// the third string: the first one again, or with the other case in front, or without its last letter
	const kind = rng.pick(['identica', 'iniziale', 'lettera'] as const);
	const c = kind === 'identica' ? a : kind === 'iniziale' ? (a[0] === a[0].toUpperCase() ? a[0].toLowerCase() + a.slice(1) : capital(a)) : a.slice(0, -1);
	const same = c === a;
	const rows = [smaller, same ? 'uguali' : 'diverse'];
	const shown = program(
		[`a = ${quoted(a)}`, `b = ${quoted(b)}`, `c = ${quoted(c)}`, 'if a < b:', '    print(a)', 'else:', '    print(b)', 'if a == c:', '    print("uguali")', 'else:', '    print("diverse")'].join('\n') + '\n',
		cppProgram(
			[`string a = ${quoted(a)};`, `string b = ${quoted(b)};`, `string c = ${quoted(c)};`, 'if (a < b) {', '    cout << a << endl;', '} else {', '    cout << b << endl;', '}', 'if (a == c) {', '    cout << "uguali" << endl;', '} else {', '    cout << "diverse" << endl;', '}'].join('\n'),
			'',
			['string']
		),
		() => rows
	);
	const other = smaller === a ? b : a;
	const options = [
		[other, rows[1]],
		[smaller, same ? 'diverse' : 'uguali'],
		[other, same ? 'diverse' : 'uguali']
	];
	return {
		prompt: 'Due stringhe si confrontano un carattere alla volta, dal primo, guardando i codici dei caratteri.',
		problem: 'Che cosa scrive questo programma? Le due righe scritte sono separate da una virgola.',
		code: texts(shown),
		solution: rows.join(', '),
		steps: [
			`La prima selezione scrive la stringa che viene prima tra a e b. ${why[0].toUpperCase()}${why.slice(1)}.`,
			same ? `La seconda selezione confronta "${a}" con "${c}": hanno gli stessi caratteri nello stesso ordine, quindi sono uguali.` : kind === 'iniziale' ? `La seconda selezione confronta "${a}" con "${c}": la prima lettera è maiuscola in una e minuscola nell'altra, e sono due caratteri diversi.` : `La seconda selezione confronta "${a}" con "${c}": la seconda ha un carattere in meno, quindi sono diverse.`,
			`Il programma scrive ${rows.join(', ')}.`
		],
		answer: pick(rng, writtenOption(rows), options.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, a, b, c })
	};
}

// ---------------------------------------------------------------- level 5

// one character every two is left to level 3: inside a function the row of its C++ loop is too wide for an option
type FunctionCase = 'conta' | 'rovescia' | 'senza' | 'raddoppia';
const FUNCTIONS: readonly FunctionCase[] = ['conta', 'rovescia', 'senza', 'raddoppia'];

function level5(rng: Rng, family: FunctionCase): CodeBuilt {
	// two words to try the function on; with a letter, one that the first has twice and the second somewhere
	const first = rng.pick(WORDS.filter((w) => w.length >= 4 && w.length <= 6 && !different(w)));
	const x = rng.pick([...new Set(first)].filter((c) => [...first].filter((d) => d === c).length >= 2));
	const second = rng.pick(WORDS.filter((w) => w.length >= 4 && w.length <= 6 && w !== first && w.includes(x)));
	const withChar = family === 'conta' || family === 'senza';
	const calls = [first, second].map((word) => ({ word, letter: withChar ? x : undefined }));
	// a short name where a row adds two characters, which would not fit an option otherwise
	const acc = rng.pick(family === 'conta' ? (['q', 'k', 'conta'] as const) : family === 'raddoppia' ? (['r', 't'] as const) : (['r', 't', 'nuova'] as const));
	let task: Task;
	if (family === 'conta') task = counting(acc, null, () => x);
	else if (family === 'rovescia') task = reversing(acc, 'davanti');
	else if (family === 'senza') task = removing(acc, null, () => x);
	else {
		const right: Scan = { acc, type: 'string', init: '', range: 'tutti', then: twice(acc) };
		// `r = s[i] + s[i]` is left out: in C++ two characters added to each other are a number, not a string
		task = { right, wrong: [{ ...right, then: append(acc) }, { ...right, then: overwrite(acc) }, { ...right, range: 'senzaPrimo' }, { ...right, range: 'pari' }, { ...right, then: prepend(acc) }] };
	}
	const whole = (scan: Scan) => ({ scan, program: functionProgram(scan, family, calls, (word) => scanValue(scan, word)) });
	const right = whole(task.right);
	const wrong = task.wrong.filter((scan) => fits(functionShown(scan, family, withChar))).map(whole);
	const kept = wrongPrograms(
		right.program,
		wrong.map((w) => w.program),
		[[]]
	).filter((p) => !written(p)!.includes(''));
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong functions for ${family}`);
	const option = (p: Program) => programOption(p, functionShown(p === right.program ? task.right : wrong.find((w) => w.program === p)!.scan, family, withChar));
	const result = scanValue(task.right, first);
	const told: Record<FunctionCase, { gives: string; solution: string; steps: string[] }> = {
		conta: {
			gives: 'quante volte il carattere c compare nella stringa s',
			solution: `La funzione in cui ${acc} parte da 0, il ciclo guarda tutti i caratteri e ${acc} sale di 1 quando s[i] == c.`,
			steps: [`Il contatore ${acc} parte da 0, e il ciclo deve guardare tutti i caratteri, dall'indice 0 a n - 1.`, `${acc} sale di 1, e solo quando il carattere è uguale a c: la condizione è s[i] == c.`, `Con "${first}" e la lettera ${x} la funzione giusta restituisce ${result}.`]
		},
		rovescia: {
			gives: "la stringa s rovesciata, dall'ultimo carattere al primo",
			solution: `La funzione in cui ${acc} parte dalla stringa vuota e ogni carattere viene messo davanti: ${acc} = s[i] + ${acc}.`,
			steps: [`${acc} parte dalla stringa vuota, e il ciclo guarda tutti i caratteri da sinistra a destra.`, `Per rovesciare, ogni carattere nuovo va davanti a quelli già presi: ${acc} = s[i] + ${acc}. Con ${acc} = ${acc} + s[i] si ottiene una copia.`, `Con "${first}" la funzione giusta restituisce "${result}".`]
		},
		senza: {
			gives: 'la stringa s senza i caratteri uguali a c',
			solution: `La funzione in cui ${acc} parte dalla stringa vuota e riceve in fondo i caratteri con s[i] != c.`,
			steps: [`${acc} parte dalla stringa vuota, e il ciclo guarda tutti i caratteri.`, 'Un carattere va tenuto quando è diverso da c: la condizione è s[i] != c, e il carattere si attacca in fondo.', `Con "${first}" e la lettera ${x} la funzione giusta restituisce "${result}".`]
		},
		raddoppia: {
			gives: 'la stringa s con ogni carattere scritto due volte di seguito',
			solution: `La funzione in cui il ciclo guarda tutti i caratteri e a ogni giro attacca s[i] due volte in fondo a ${acc}.`,
			steps: [`${acc} parte dalla stringa vuota, e il ciclo guarda tutti i caratteri, dal primo.`, `A ogni giro ${acc} tiene quello che aveva e riceve in fondo due volte lo stesso carattere: ${acc} = ${acc} + s[i] + s[i].`, `Con "${first}" la funzione giusta restituisce "${result}".`]
		}
	};
	return {
		prompt: 'Leggi il corpo di ogni funzione e provalo a mente su una parola corta.',
		problem: `Quale funzione restituisce ${told[family].gives}?`,
		solution: told[family].solution,
		steps: told[family].steps,
		solutionCode: functionShown(task.right, family, withChar),
		answer: choose(
			rng,
			option(right.program),
			mixed(rng, kept).map((p) => option(p))
		),
		params: reference(right.program, [[]], { case: family, words: [first, second], letter: x })
	};
}

// ---------------------------------------------------------------- level 6

type OpenCase = 'conta' | 'rovescia' | 'sostituisce';
const OPEN: readonly OpenCase[] = ['conta', 'rovescia', 'sostituisce'];

function level6(rng: Rng, family: OpenCase): CodeBuilt {
	const name = 'parola';
	const x = rng.pick(['a', 'o', 'e', 's', 't', 'r']);
	const acc = family === 'conta' ? 'conta' : 'nuova';
	const task = family === 'conta' ? counting(acc, x, () => x) : family === 'rovescia' ? reversing(acc, 'indietro') : replacing(acc, x);
	const whole = (scan: Scan) => ({ scan, program: readingProgram(scan, name) });
	const solution = whole(task.right);
	const wrong = task.wrong.filter((scan) => fits(inlineShown(scan, name))).map(whole);
	// three words: with a letter, one that has it at the start or at the end, one that has it twice, one in the middle
	const pool = WORDS.filter((w) => w.length <= 8);
	const tests: string[][] = [];
	if (family === 'rovescia') {
		while (tests.length < 3) {
			const w = rng.pick(pool);
			if (!tests.some((t) => t[0] === w) && w !== [...w].reverse().join('')) tests.push([w]);
		}
	} else {
		const edge = pool.filter((w) => w[0] === x || w[w.length - 1] === x);
		const twice = pool.filter((w) => [...w].filter((c) => c === x).length >= 2 && !edge.includes(w));
		const inside = pool.filter((w) => w.slice(1, -1).includes(x) && !edge.includes(w) && !twice.includes(w));
		if (!edge.length || !twice.length || !inside.length) throw new TooFew(`no words for ${x}`);
		tests.push([rng.pick(edge)], [rng.pick(twice)], [rng.pick(inside)]);
	}
	const kept = wrongPrograms(
		solution.program,
		wrong.map((w) => w.program),
		tests
	);
	if (kept.length < 3 || new Set(tests.map((t) => written(solution.program, t)![0])).size < 2) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const start = { python: `${name} = input()\n# scrivi qui il ciclo e la stampa\n`, cpp: cppProgram(`string ${name};\ncin >> ${name};\n// scrivi qui il ciclo e la stampa`, '', ['string']) };
	const option = (p: Program) => programOption(p, inlineShown(p === solution.program ? task.right : wrong.find((w) => w.program === p)!.scan, name));
	const asks = family === 'conta' ? `scrive quante volte compare la lettera ${x}` : family === 'rovescia' ? 'costruisce la parola rovesciata e la scrive' : `costruisce una nuova parola con un asterisco al posto di ogni lettera ${x}, e la scrive`;
	const example = tests[0][0];
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge una parola in lettere minuscole. Usa un ciclo che scorre la parola un carattere alla volta e ${asks}. Per esempio, con ${example} scrive ${written(solution.program, tests[0])![0]}. La lettura c'è già.`,
		solution: family === 'conta' ? `Un contatore che parte da 0 e sale di 1 a ogni carattere uguale a ${x}.` : family === 'rovescia' ? "Una stringa che parte vuota e riceve in fondo i caratteri della parola, letti dall'ultimo al primo." : `Una stringa che parte vuota e riceve in fondo un asterisco quando il carattere è ${x}, il carattere stesso altrimenti.`,
		steps:
			family === 'conta'
				? ['Chiedi la lunghezza della parola e metti il contatore a 0.', `Con un ciclo fai andare i da 0 a n - 1: quando parola[i] è uguale a ${x}, il contatore sale di 1.`, 'Dopo il ciclo scrivi il contatore.']
				: family === 'rovescia'
					? ['Parti dalla stringa vuota.', "Con un ciclo fai scendere i da n - 1 a 0 e attacca parola[i] in fondo alla stringa nuova.", 'Dopo il ciclo scrivi la stringa nuova.']
					: ['Parti dalla stringa vuota.', `Con un ciclo fai andare i da 0 a n - 1: se parola[i] è uguale a ${x} attacca un asterisco, altrimenti attacca parola[i].`, 'Dopo il ciclo scrivi la stringa nuova.'],
		solutionCode: texts(solution.program),
		answer: needing(programAnswer(solution.program, start, tests), 'ciclo'),
		choice: choose(
			rng,
			option(solution.program),
			mixed(rng, kept).map((p) => option(p))
		),
		params: reference(solution.program, tests, { case: family, letter: x })
	};
}

export default makeCodeGenerator(ID, 'Le stringhe', {
	1: { label: 'Lunghezza e caratteri', constraints: ['a word of different letters', 'its length, a character by its index, or a character counted from the end', 'four different outputs'], build: drawn(['lunghezza', 'carattere', 'dalla-fine'] as const, level1) },
	2: { label: 'Contare con un ciclo', constraints: ['one loop over the characters with a counter', 'the wrong outputs are those of the same loop with a mistake'], build: drawn(['lettera', 'prima', 'doppie'] as const, level2) },
	3: { label: 'Costruire una stringa', constraints: ['one loop that builds a new string from the empty one', 'four different outputs'], build: drawn(BUILDS, level3) },
	4: { label: 'Confrontare due stringhe', constraints: ['two strings compared with <, and one compared with ==', 'the four options are the four pairs of answers'], build: drawn(['ordine', 'prefisso', 'maiuscola'] as const, level4) },
	5: { label: 'Scegliere la funzione giusta', constraints: ['four functions on a string, shown alone', 'each wrong one gives back something else on the two words of the sample'], build: drawn(FUNCTIONS, level5) },
	6: { label: 'Scrivere il ciclo', constraints: ['the word is read, and the reading is given', 'graded by running it on three words', 'needs a loop'], build: drawn(OPEN, level6) }
});
