/**
 * Exercises for the lesson "Leggere e scrivere un file di testo" (informatica, third year, lesson 79).
 * Spec: specs/exercises/inf-file-testo.md
 *
 * 1. what a program that reads the rows of a text file writes; 2. the same with numbers, which are converted;
 * 3. what a file holds after a program has written or appended to it; 4. which program does what is asked
 * (options that are programs); 5. write a program that writes a file and reads it back (open answer).
 *
 * The programs are written by hand in the two languages (v2/inf-codice.ts); the files they find beside them are in
 * `params.files`.
 */
import type { Rng } from '../types';
import { cppProgram, makeCodeGenerator, needing, printedOption, program, programAnswer, programOption, reader, reference, texts, textOption, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';
import { TooFew, contentOption, drawn, fileOf, opened, pick, some } from '../inf-file';

export const ID = 'inf-file-testo';

const FILE = ['fstream', 'string'] as const;
const NAMES = ['Anna', 'Luca', 'Sara', 'Marco', 'Giulia', 'Paolo', 'Elena', 'Dario', 'Marta', 'Piero', 'Irene', 'Fabio'] as const;
/** Files of names, each with a misspelling of its name a student could type. */
const NAME_FILES = [
	['iscritti.txt', 'iscriti.txt'],
	['squadra.txt', 'squadre.txt'],
	['invitati.txt', 'invitato.txt'],
	['classe.txt', 'clase.txt'],
	['turni.txt', 'turno.txt']
] as const;
/** Files with a name short enough for the row that opens one for appending in C++. */
const SHORT_FILES = ['classe.txt', 'turni.txt', 'gita.txt', 'coro.txt', 'gruppo.txt'] as const;
const NUMBER_FILES = ['voti.txt', 'punti.txt', 'gol.txt', 'tempi.txt', 'dati.txt'] as const;

// ---------------------------------------------------------------- level 1: the rows of a file

type Rows = 'conta' | 'ultima' | 'seconda' | 'numerate' | 'manca';
const ROWS: readonly Rows[] = ['conta', 'ultima', 'seconda', 'numerate', 'manca'];

/** A program that reads the file of names `name` (opened as `as`, which may be misspelled) in one of the ways of level 1. */
function rowsProgram(family: Rows, name: string, as = name): Program {
	const read = (files: Record<string, string>) => opened(files, name);
	if (family === 'conta')
		return program(
			`
			n = 0
			with open("${name}") as file:
			    for riga in file:
			        n = n + 1
			print(n)
			`,
			cppProgram(`ifstream file("${name}");\nstring riga;\nint n = 0;\nwhile (getline(file, riga)) {\n    n = n + 1;\n}\nfile.close();\ncout << n << endl;`, '', FILE),
			(_, files) => [String(read(files).length)]
		);
	if (family === 'ultima')
		return program(
			`
			nome = ""
			with open("${name}") as file:
			    for riga in file:
			        nome = riga.strip()
			print(nome)
			`,
			cppProgram(`ifstream file("${name}");\nstring riga, nome;\nwhile (getline(file, riga)) {\n    nome = riga;\n}\nfile.close();\ncout << nome << endl;`, '', FILE),
			(_, files) => [read(files)[read(files).length - 1]]
		);
	if (family === 'seconda')
		return program(
			`
			with open("${name}") as file:
			    a = file.readline().strip()
			    b = file.readline().strip()
			print(b)
			`,
			cppProgram(`ifstream file("${name}");\nstring a, b;\ngetline(file, a);\ngetline(file, b);\nfile.close();\ncout << b << endl;`, '', FILE),
			(_, files) => [read(files)[1]]
		);
	if (family === 'numerate')
		return program(
			`
			i = 0
			with open("${name}") as file:
			    for riga in file:
			        i = i + 1
			        print(i, riga.strip())
			`,
			cppProgram(`ifstream file("${name}");\nstring riga;\nint i = 0;\nwhile (getline(file, riga)) {\n    i = i + 1;\n    cout << i << " " << riga << endl;\n}\nfile.close();`, '', FILE),
			(_, files) => read(files).map((row, i) => `${i + 1} ${row}`)
		);
	return program(
		`
		try:
		    with open("${as}") as file:
		        riga = file.readline().strip()
		        print(riga)
		except FileNotFoundError:
		    print("non trovato")
		`,
		cppProgram(`ifstream file("${as}");\nstring riga;\nif (!file) {\n    cout << "non trovato" << endl;\n} else {\n    getline(file, riga);\n    cout << riga << endl;\n    file.close();\n}`, '', FILE),
		(_, files) => (as in files ? [opened(files, as)[0]] : ['non trovato'])
	);
}

function level1(rng: Rng, family: Rows): CodeBuilt {
	const [name, misspelled] = rng.pick(NAME_FILES);
	const rows = some(rng, NAMES, rng.int(3, 5));
	const missing = family === 'manca' && rng.int(0, 2) > 0;
	const as = missing ? misspelled : name;
	const files = { [name]: fileOf(rows) };
	const shown = rowsProgram(family, name, as);
	const out = written(shown, [], files)!;
	const n = rows.length;
	const last = rows[n - 1];
	const others = {
		conta: [[String(n + 1)], [String(n - 1)], [last], ['1'], [rows[0]]],
		ultima: [[rows[0]], rows, [rows[n - 2]], [String(n)], []],
		seconda: [[rows[0]], [rows[2]], [rows[0], rows[1]], [last], [String(2)]],
		numerate: [rows.map((row, i) => `${i} ${row}`), rows, [`${n} ${last}`], rows.map((_, i) => String(i + 1)), [`1 ${rows[0]}`]],
		manca: [missing ? [rows[0]] : ['non trovato'], [], [last], [as], rows]
	}[family];
	const option = family === 'numerate' ? printedOption : writtenOption;
	const steps = {
		conta: [`Il ciclo fa un giro per ogni riga del file ${name}, e a ogni giro n aumenta di 1.`, `Le righe sono ${n}: alla fine n vale ${n}.`],
		ultima: ['A ogni giro la variabile nome prende la riga appena letta, e quella di prima va persa.', `Finito il file, in nome resta l'ultima riga: ${last}.`],
		seconda: [`La prima lettura prende la prima riga, ${rows[0]}, e il segnaposto del file passa alla riga dopo.`, `La seconda lettura riparte da lì: b è ${rows[1]}, ed è quello che viene scritto.`],
		numerate: ['A ogni giro i aumenta di 1 prima della scrittura, quindi la prima riga porta il numero 1.', `Il programma scrive una riga per ogni riga del file: ${out.join(', ')}.`],
		manca: missing
			? [`Il programma apre ${as}, ma accanto a lui c'è solo ${name}: i due nomi non sono uguali.`, 'Il file non esiste, e il programma lo scopre: scrive "non trovato" e non legge niente.']
			: [`Il file ${name} esiste, quindi l'apertura riesce e la parte che scrive "non trovato" viene saltata.`, `Il programma legge una riga sola, la prima: ${rows[0]}.`]
	}[family];
	return {
		prompt: 'Segui il programma una riga del file alla volta.',
		problem: `Accanto al programma c'è ${family === 'manca' ? 'solo ' : ''}il file ${name}, che vedi sotto il programma. Che cosa scrive il programma?`,
		code: texts(shown),
		listing: files[name],
		solution: out.join(', '),
		steps,
		answer: pick(rng, option(out), others.map(option)),
		params: reference(shown, [[]], { ask: 'output', case: family, files, file: name, opened: as, rows })
	};
}

// ---------------------------------------------------------------- level 2: numbers in a file

type Numbers = 'somma' | 'conta' | 'massimo';
const NUMBERS: readonly Numbers[] = ['somma', 'conta', 'massimo'];

function numbersProgram(family: Numbers, name: string, k: number): Program {
	const read = (files: Record<string, string>) => opened(files, name).map(Number);
	if (family === 'somma')
		return program(
			`
			somma = 0
			with open("${name}") as file:
			    for riga in file:
			        somma = somma + int(riga)
			print(somma)
			`,
			cppProgram(`ifstream file("${name}");\nstring riga;\nint somma = 0;\nwhile (getline(file, riga)) {\n    somma = somma + stoi(riga);\n}\nfile.close();\ncout << somma << endl;`, '', FILE),
			(_, files) => [String(read(files).reduce((s, x) => s + x, 0))]
		);
	if (family === 'conta')
		return program(
			`
			quanti = 0
			with open("${name}") as file:
			    for riga in file:
			        if int(riga) >= ${k}:
			            quanti = quanti + 1
			print(quanti)
			`,
			cppProgram(`ifstream file("${name}");\nstring riga;\nint quanti = 0;\nwhile (getline(file, riga)) {\n    if (stoi(riga) >= ${k}) {\n        quanti = quanti + 1;\n    }\n}\nfile.close();\ncout << quanti << endl;`, '', FILE),
			(_, files) => [String(read(files).filter((x) => x >= k).length)]
		);
	return program(
		`
		with open("${name}") as file:
		    massimo = int(file.readline())
		    for riga in file:
		        if int(riga) > massimo:
		            massimo = int(riga)
		print(massimo)
		`,
		cppProgram(`ifstream file("${name}");\nstring riga;\ngetline(file, riga);\nint massimo = stoi(riga);\nwhile (getline(file, riga)) {\n    if (stoi(riga) > massimo) {\n        massimo = stoi(riga);\n    }\n}\nfile.close();\ncout << massimo << endl;`, '', FILE),
		(_, files) => [String(Math.max(...read(files)))]
	);
}

/** Four or five different numbers from 2 to 14, the largest neither first nor last, and one of the others as `k`. */
function numbers(rng: Rng): { values: number[]; k: number } {
	for (;;) {
		const values = some(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], rng.int(4, 5));
		const top = values.indexOf(Math.max(...values));
		const k = rng.pick(values);
		const above = values.filter((x) => x > k).length;
		if (top > 0 && top < values.length - 1 && above >= 1 && above < values.length - 1) return { values, k };
	}
}

function level2(rng: Rng, family: Numbers): CodeBuilt {
	const name = rng.pick(NUMBER_FILES);
	const { values, k } = numbers(rng);
	const files = { [name]: fileOf(values) };
	const shown = numbersProgram(family, name, k);
	const out = written(shown, [], files)!;
	const sum = values.reduce((s, x) => s + x, 0);
	const n = values.length;
	const others = {
		// the rows stuck one to the other is what `+` does with texts, the mistake of who forgets the conversion
		somma: [values.join(''), n, values[n - 1], sum - values[0], Math.max(...values)],
		conta: [values.filter((x) => x > k).length, n, values.filter((x) => x >= k).reduce((s, x) => s + x, 0), k, values.filter((x) => x < k).length],
		massimo: [Math.min(...values), values[n - 1], values[0], sum, n]
	}[family].map((x) => [String(x)]);
	const steps = {
		somma: ['Ogni riga letta è un testo: int in Python e stoi in C++ la convertono in un numero.', `I numeri sono ${values.join(', ')}, e la somma parte da 0: alla fine vale ${sum}.`],
		conta: [`Ogni riga viene convertita in un numero e confrontata con ${k}: quanti aumenta solo quando il numero è maggiore o uguale a ${k}.`, `Succede con ${values.filter((x) => x >= k).join(', ')}: alla fine quanti vale ${out[0]}.`],
		massimo: [`La prima riga, letta prima del ciclo, dà a massimo il valore di partenza: ${values[0]}.`, `Il ciclo legge le altre righe, e massimo cambia solo quando arriva un numero più grande: alla fine vale ${out[0]}.`]
	}[family];
	return {
		prompt: 'Segui il programma una riga del file alla volta.',
		problem: `Accanto al programma c'è il file ${name}, che vedi sotto il programma. Che cosa scrive il programma?`,
		code: texts(shown),
		listing: files[name],
		solution: out[0],
		steps,
		answer: pick(rng, writtenOption(out), others.map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, files, file: name, numbers: values, k })
	};
}

// ---------------------------------------------------------------- level 3: what the file holds

type Writing = 'scrive' | 'accoda' | 'attaccati' | 'nuovo' | 'due volte';
const WRITING: readonly Writing[] = ['scrive', 'accoda', 'attaccati', 'nuovo', 'due volte'];

/** A program that writes two texts in `name`: `append` for the mode, `glued` when the first has no line break after it. */
function writingProgram(name: string, [first, second]: string[], append: boolean, glued: boolean): Program {
	return program(
		`
		with open("${name}"${append ? ', "a"' : ', "w"'}) as file:
		    file.write("${first}${glued ? '' : '\\n'}")
		    file.write("${second}\\n")
		`,
		cppProgram(`ofstream file("${name}"${append ? ', ios::app' : ''});\nfile << "${first}"${glued ? '' : ' << endl'};\nfile << "${second}" << endl;\nfile.close();`, '', ['fstream']),
		() => []
	);
}

function level3(rng: Rng, family: Writing): CodeBuilt {
	const name = rng.pick(SHORT_FILES);
	const all = some(rng, NAMES, 5);
	const old = family === 'nuovo' ? [] : all.slice(0, rng.int(2, 3));
	const added = all.slice(3);
	const append = family === 'accoda' || (family !== 'scrive' && rng.int(0, 1) === 1);
	const glued = family === 'attaccati';
	const runs = family === 'due volte' ? 2 : 1;
	const shown = writingProgram(name, added, append, glued);
	const once = glued ? [added.join('')] : added;
	const after = append ? [...old, ...Array.from({ length: runs }, () => once).flat()] : once;
	const files: Record<string, string> = family === 'nuovo' ? {} : { [name]: fileOf(old) };
	const stopped = textOption('niente: il programma si ferma con un errore', 'errore');
	const others = [
		contentOption([...old, ...once]),
		contentOption(once),
		contentOption([...old, ...once, ...once]),
		contentOption([...once, ...once]),
		contentOption(glued ? added : [added.join('')]),
		contentOption(glued ? [...old, ...added] : [...old, added.join('')]),
		contentOption(old),
		contentOption([...once, ...old]),
		...(family === 'nuovo' ? [stopped, contentOption([])] : []),
		contentOption([added[1]])
	];
	const mode = append ? 'in accodamento' : 'in scrittura';
	const steps = [
		family === 'nuovo'
			? `Il file ${name} non esiste, e il programma lo apre ${mode}: non è un errore, il file viene creato vuoto.`
			: append
				? `Il file è aperto ${mode}: le righe che c'erano restano, e quello che il programma scrive va in fondo.`
				: `Il file è aperto ${mode}: viene svuotato appena aperto, e le righe che c'erano vanno perse.`,
		glued ? `Dopo ${added[0]} il programma non va a capo, quindi ${added[1]} finisce sulla stessa riga: ${once[0]}.` : `Il programma scrive due righe: ${added.join(' e ')}.`,
		...(runs === 2 ? [append ? `La seconda esecuzione trova il file come lo ha lasciato la prima e aggiunge di nuovo le due righe: in tutto ${after.length}.` : 'La seconda esecuzione svuota di nuovo il file e riscrive le stesse due righe.'] : [])
	];
	return {
		prompt: 'Guarda come viene aperto il file, poi che cosa viene scritto.',
		problem: `${family === 'nuovo' ? `Accanto al programma non c'è nessun file.` : `Accanto al programma c'è il file ${name}, che vedi sotto il programma.`} ${runs === 2 ? 'Il programma viene eseguito due volte di seguito. ' : ''}Che cosa contiene il file ${name} alla fine?`,
		code: texts(shown),
		...(family === 'nuovo' ? {} : { listing: files[name] }),
		solution: after.join(', '),
		steps,
		answer: pick(rng, contentOption(after), others),
		params: reference(shown, [[]], { case: family, files, file: name, old, added, append, glued, runs })
	};
}

// ---------------------------------------------------------------- level 4: which program

/** A loop over the numbers of a file that keeps one value: where it starts, when a number counts, what it becomes. */
interface Fold {
	acc: string;
	start: number;
	when?: { text: string; of: (x: number) => boolean };
	then: { text: string; of: (x: number, acc: number) => number };
}

const foldPython = (f: Fold, name: string) =>
	[`${f.acc} = ${f.start}`, `with open("${name}") as file:`, '    for riga in file:', '        x = int(riga)', ...(f.when ? [`        if ${f.when.text}:`, `            ${f.acc} = ${f.then.text}`] : [`        ${f.acc} = ${f.then.text}`]), `print(${f.acc})`].join('\n') + '\n';
const foldCpp = (f: Fold, name: string) =>
	[`ifstream file("${name}");`, 'string riga;', `int ${f.acc} = ${f.start};`, 'while (getline(file, riga)) {', '    int x = stoi(riga);', ...(f.when ? [`    if (${f.when.text}) {`, `        ${f.acc} = ${f.then.text};`, '    }'] : [`    ${f.acc} = ${f.then.text};`]), '}', 'file.close();', `cout << ${f.acc} << endl;`].join('\n') + '\n';
const foldProgram = (f: Fold, name: string): Program =>
	program(foldPython(f, name), cppProgram(foldCpp(f, name), '', FILE), (_, files) => [
		String(
			opened(files, name)
				.map(Number)
				.reduce((acc, x) => (!f.when || f.when.of(x) ? f.then.of(x, acc) : acc), f.start)
		)
	]);

type Task = 'conta' | 'somma' | 'somma grandi';
const TASKS: readonly Task[] = ['conta', 'somma', 'somma grandi'];

function task(family: Task, k: number, name: string): { gives: string; right: Fold; wrong: Fold[] } {
	const more = { text: `x > ${k}`, of: (x: number) => x > k };
	const atLeast = { text: `x >= ${k}`, of: (x: number) => x >= k };
	const less = { text: `x < ${k}`, of: (x: number) => x < k };
	const one = (acc: string) => ({ text: `${acc} + 1`, of: (_: number, a: number) => a + 1 });
	const add = (acc: string) => ({ text: `${acc} + x`, of: (x: number, a: number) => a + x });
	const keep = { text: 'x', of: (x: number) => x };
	if (family === 'conta') {
		const f = (when: Fold['when'], then = one('n'), start = 0): Fold => ({ acc: 'n', start, when, then });
		return { gives: `quanti numeri del file ${name} sono maggiori di ${k}`, right: f(more), wrong: [f(atLeast), f(less), f(more, add('n')), f(more, undefined, 1), f(undefined), f(more, keep)] };
	}
	if (family === 'somma') {
		const f = (when: Fold['when'], then = add('s'), start = 0): Fold => ({ acc: 's', start, when, then });
		return { gives: `la somma dei numeri del file ${name}`, right: f(undefined), wrong: [f(undefined, one('s')), f(undefined, keep), f(undefined, undefined, 1), f(more), f(undefined, { text: 'x + x', of: (x) => x + x })] };
	}
	const f = (when: Fold['when'], then = add('s'), start = 0): Fold => ({ acc: 's', start, when, then });
	return { gives: `la somma dei numeri del file ${name} maggiori di ${k}`, right: f(more), wrong: [f(undefined), f(atLeast), f(less), f(more, one('s')), f(more, undefined, 1), f(more, keep)] };
}

function level4(rng: Rng, family: Task): CodeBuilt {
	const name = rng.pick(NUMBER_FILES);
	const { values, k } = numbers(rng);
	const files = { [name]: fileOf(values) };
	const t = task(family, k, name);
	const right = foldProgram(t.right, name);
	const wrong = t.wrong.map((f) => ({ fold: f, whole: foldProgram(f, name) }));
	const kept = wrongPrograms(
		right,
		wrong.map((w) => w.whole),
		[[]],
		files
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const shownOf = (f: Fold) => ({ python: foldPython(f, name), cpp: foldCpp(f, name) });
	const option = (p: Program) => programOption(p, shownOf(p === right ? t.right : wrong.find((w) => w.whole === p)!.fold));
	const out = written(right, [], files)!;
	return {
		prompt: 'Leggi il ciclo di ogni programma.',
		problem: `Il file ${name} contiene dei numeri interi, uno per riga: lo vedi qui sotto. Quale programma scrive ${t.gives}? Del C++ è mostrato solo il contenuto di main.`,
		listing: files[name],
		solution: `Il programma che parte da ${t.right.start} e${t.right.when ? `, quando ${t.right.when.text},` : ''} fa ${t.right.acc} = ${t.right.then.text}: con questo file scrive ${out[0]}.`,
		steps: [
			'Tutti i programmi leggono il file riga per riga e convertono ogni riga nel numero x: cambia quello che fanno con x.',
			t.right.when ? `La condizione giusta è ${t.right.when.text}, e quando è vera l'istruzione è ${t.right.acc} = ${t.right.then.text}.` : `Ogni numero va sommato, senza condizioni: l'istruzione è ${t.right.acc} = ${t.right.then.text}.`,
			`La variabile ${t.right.acc} parte da 0. Con i numeri ${values.join(', ')} il programma giusto scrive ${out[0]}.`
		],
		solutionCode: shownOf(t.right),
		answer: pick(
			rng,
			option(right),
			kept.map((p) => option(p))
		),
		params: reference(right, [[]], { case: family, files, file: name, numbers: values, k })
	};
}

// ---------------------------------------------------------------- level 5: write the program

type Keep = 'tutti' | 'grandi' | 'pari';
type Stat = 'somma' | 'quanti';
type Open = `${Keep}-${Stat}`;
const OPEN: readonly Open[] = ['tutti-somma', 'grandi-somma', 'grandi-quanti', 'pari-somma', 'pari-quanti'];
const OUT = 'num.txt';

/** How the program of level 5 writes: which numbers it keeps, what it writes for each, whether it goes to a new line. */
interface Way {
	/** The condition as the two languages write it, or none; and what it says of a number. */
	when?: { text: string; of: (x: number) => boolean };
	/** What is written for the number read: the number, or by mistake the counter or n. */
	what: 'x' | 'i' | 'n';
	newline: boolean;
	/** The first value of the counter: 1 by mistake, and one number is never read. */
	from: 0 | 1;
}

const wayPython = (w: Way) =>
	[`with open("${OUT}", "w") as file:`, `    for i in range(${w.from ? '1, ' : ''}n):`, '        x = int(input())', `        t = str(${w.what})${w.newline ? ' + "\\n"' : ''}`, ...(w.when ? [`        if ${w.when.text}:`, '            file.write(t)'] : ['        file.write(t)'])].join('\n') + '\n';
const wayCpp = (w: Way) => {
	const write = `file << ${w.what}${w.newline ? ' << endl' : ''};`;
	return [`ofstream file("${OUT}");`, `for (int i = ${w.from}; i < n; i++) {`, '    cin >> x;', ...(w.when ? [`    if (${w.when.text}) {`, `        ${write}`, '    }'] : [`    ${write}`]), '}', 'file.close();'].join('\n') + '\n';
};

function openProgram(w: Way, stat: Stat): Program {
	const step = stat === 'somma' ? 'int(riga)' : '1';
	const python = `n = int(input())\n${wayPython(w)}s = 0\nwith open("${OUT}") as file:\n    for riga in file:\n        s = s + ${step}\nprint(s)\n`;
	const cpp = cppProgram(`int n, x;\ncin >> n;\n${wayCpp(w)}ifstream letto("${OUT}");\nstring riga;\nint s = 0;\nwhile (getline(letto, riga)) {\n    s = s + ${stat === 'somma' ? 'stoi(riga)' : '1'};\n}\nletto.close();\ncout << s << endl;`, '', FILE);
	return program(python, cpp, (input) => {
		const next = reader(input);
		const n = Number(next());
		let content = '';
		for (let i = w.from; i < n; i++) {
			const x = Number(next());
			if (!w.when || w.when.of(x)) content += String({ x, i, n }[w.what]) + (w.newline ? '\n' : '');
		}
		// read back as the two languages do: rows, the last one also without its line break
		const rows = content === '' ? [] : content.replace(/\n$/, '').split('\n');
		if (stat === 'quanti') return [String(rows.length)];
		// a number too long for an int stops the C++
		if (rows.some((row) => row.length > 9)) throw new Error('a number too long');
		return [String(rows.reduce((s, row) => s + Number(row), 0))];
	});
}

function level5(rng: Rng, family: Open): CodeBuilt {
	const [keep, stat] = family.split('-') as [Keep, Stat];
	const k = rng.int(4, 7);
	const conditions = {
		tutti: undefined,
		grandi: { text: `x >= ${k}`, of: (x: number) => x >= k },
		pari: { text: 'x % 2 == 0', of: (x: number) => x % 2 === 0 }
	};
	const right: Way = { when: conditions[keep], what: 'x', newline: true, from: 0 };
	const mistakes: Way[] = [
		{ ...right, newline: false },
		...(keep === 'grandi' ? [{ ...right, when: { text: `x > ${k}`, of: (x: number) => x > k } }, { ...right, when: { text: `x < ${k}`, of: (x: number) => x < k } }] : []),
		...(keep === 'pari' ? [{ ...right, when: { text: 'x % 2 == 1', of: (x: number) => x % 2 === 1 } }] : []),
		...(keep === 'tutti' ? [] : [{ ...right, when: undefined }]),
		{ ...right, what: 'i' as const },
		{ ...right, from: 1 as const },
		{ ...right, what: 'n' as const }
	];
	// three runs of three to five numbers from 1 to 9, with k among them where the level has one
	const tests: string[][] = [];
	while (tests.length < 3) {
		const n = rng.int(3, 5);
		const xs = Array.from({ length: n }, () => rng.int(1, 9));
		if (keep === 'grandi' && !xs.includes(k)) xs[rng.int(0, n - 1)] = k;
		tests.push([String(n), ...xs.map(String)]);
	}
	const solution = openProgram(right, stat);
	const others = mistakes.map((w) => ({ way: w, whole: openProgram(w, stat) }));
	const kept = wrongPrograms(
		solution,
		others.map((o) => o.whole),
		tests
	);
	const outs = tests.map((t) => written(solution, t)![0]);
	// the runs write different things, none of them nothing kept, so the output cannot be typed by hand
	if (kept.length < 3 || new Set(outs).size < 2 || outs.includes('0')) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const start = {
		python: `n = int(input())\n# scrivi qui: i numeri nel file,\n# poi riaprilo, leggilo e stampa\n`,
		cpp: cppProgram('int n, x;\ncin >> n;\n// scrivi qui: i numeri nel file,\n// poi riaprilo, leggilo e stampa', '', FILE)
	};
	const which = { tutti: 'tutti i numeri letti', grandi: `solo i numeri maggiori o uguali a ${k}`, pari: 'solo i numeri pari' }[keep];
	const what = stat === 'somma' ? 'la somma dei numeri che contiene' : 'quante righe contiene';
	const shownOf = (w: Way) => ({ python: wayPython(w), cpp: wayCpp(w) });
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge un numero n e poi n numeri interi, uno per riga. Con un ciclo scrivi nel file ${OUT}, uno per riga, ${which}. Poi chiudi il file, riaprilo in lettura e stampa ${what}. La lettura di n c'è già.`,
		solution: `Un ciclo che legge i numeri e scrive nel file ${which}, ognuno seguito da un a capo; poi un secondo ciclo che rilegge il file e ${stat === 'somma' ? 'somma le righe convertite in numeri' : 'conta le righe'}.`,
		steps: [
			`Apri ${OUT} in scrittura e, dentro un ciclo di n giri, leggi un numero alla volta${right.when ? `: lo scrivi nel file solo quando ${right.when.text}` : ' e scrivilo nel file'}. Dopo ogni numero serve l'a capo.`,
			'Chiudi il file prima di riaprirlo: solo allora quello che hai scritto è di sicuro nel file.',
			stat === 'somma' ? 'Riapri il file in lettura, converti ogni riga in un numero e sommala; alla fine stampa la somma.' : 'Riapri il file in lettura e conta le righe con un contatore; alla fine stampa il contatore.'
		],
		solutionCode: texts(solution),
		answer: needing(programAnswer(solution, start, tests), 'ciclo'),
		choice: pick(
			rng,
			programOption(solution, shownOf(right)),
			kept.map((p) => programOption(p, shownOf(others.find((o) => o.whole === p)!.way)))
		),
		params: reference(solution, tests, { case: family, k, out: OUT })
	};
}

const showsFile = (sample: { listing?: string; params: Record<string, unknown> }) => {
	const { files, file } = sample.params as { files: Record<string, string>; file: string };
	return file in files && sample.listing !== files[file] ? ['the file shown is not the file the program finds'] : [];
};

export default makeCodeGenerator(ID, 'Leggere e scrivere un file di testo', {
	1: { label: 'Leggere le righe', constraints: ['a file of 3 to 5 names beside the program', 'four different outputs'], build: drawn(ROWS, level1), check: showsFile },
	2: { label: 'I numeri di un file', constraints: ['a file of 4 or 5 different whole numbers', 'the rows are converted before they are used'], build: drawn(NUMBERS, level2), check: showsFile },
	3: { label: 'Che cosa resta nel file', constraints: ['the file is opened for writing or for appending', 'the options are what the file holds at the end'], build: drawn(WRITING, level3), check: showsFile },
	4: { label: 'Quale programma', constraints: ['four programs that write different things on the file shown', 'each option shows the body of main alone in C++'], build: drawn(TASKS, level4), check: showsFile },
	5: { label: 'Scrivere e rileggere un file', constraints: ['the program reads n and n numbers', 'graded by running it on three lists', 'needs a loop'], build: drawn(OPEN, level5) }
});
