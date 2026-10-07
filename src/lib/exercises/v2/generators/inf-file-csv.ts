/**
 * Exercises for the lesson "File di dati in formato CSV" (informatica, third year, lesson 80).
 * Spec: specs/exercises/inf-file-csv.md
 *
 * 1. the fields of one row, cut at a separator; 2. reading a CSV file as a table (header, rows, columns); 3. what a
 * program that computes on a column writes; 4. which program does what is asked (options that are programs);
 * 5. what a CSV file written by a program holds; 6. write a program that cuts the rows typed (open answer).
 *
 * The programs are written by hand in the two languages (v2/inf-codice.ts), in the forms of the lesson: `split` in
 * Python, `getline` with the separator in C++. The CSV file a program reads is in `params.files`.
 */
import type { Rng } from '../types';
import { cppProgram, makeCodeGenerator, needing, program, programAnswer, programOption, reader, reference, texts, textOption, written, writtenOption, wrongPrograms, type CodeBuilt, type Program } from '../inf-codice';
import { TooFew, contentOption, drawn, fileOf, opened, pick, rowsOf, some } from '../inf-file';

export const ID = 'inf-file-csv';

const FILE = ['fstream', 'string'] as const;
const NAMES = ['Anna', 'Luca', 'Sara', 'Marco', 'Elena', 'Dario', 'Marta', 'Piero', 'Irene', 'Fabio'] as const;
const SHORT_NAMES = ['Ada', 'Leo', 'Zoe', 'Ugo', 'Eva', 'Lia', 'Teo', 'Mia'] as const;

/** A table of three columns: a name, a label of at most six letters, a whole number. */
interface Schema {
	file: string;
	cols: [string, string, string];
	labels: readonly string[];
	range: [number, number];
	/** How the question calls the number of a row and the rows with a label: "i voti", "di fisica". */
	numbers: string;
	of: (label: string) => string;
}
const SCHEMAS: readonly Schema[] = [
	{ file: 'voti.csv', cols: ['nome', 'materia', 'voto'], labels: ['fisica', 'storia', 'arte', 'latino'], range: [4, 10], numbers: 'i voti', of: (l) => `di ${l}` },
	{ file: 'gare.csv', cols: ['nome', 'sport', 'punti'], labels: ['nuoto', 'corsa', 'salto', 'judo'], range: [2, 12], numbers: 'i punti', of: (l) => `delle gare di ${l}` },
	{ file: 'soci.csv', cols: ['nome', 'citta', 'eta'], labels: ['Roma', 'Bari', 'Pisa', 'Lodi'], range: [14, 19], numbers: 'le età', of: (l) => `dei soci di ${l}` },
	{ file: 'gite.csv', cols: ['nome', 'meta', 'euro'], labels: ['Torino', 'Siena', 'Lecce', 'Parma'], range: [10, 30], numbers: 'gli euro', of: (l) => `delle gite a ${l}` }
];

interface Table {
	schema: Schema;
	rows: [string, string, number][];
	/** The label the questions ask about: on at least two rows, and not on all. */
	label: string;
	text: string;
}

function table(rng: Rng): Table {
	const schema = rng.pick(SCHEMAS);
	for (;;) {
		const n = rng.int(4, 5);
		const names = some(rng, NAMES, n);
		const labels = some(rng, schema.labels, 2);
		const pool = Array.from({ length: schema.range[1] - schema.range[0] + 1 }, (_, i) => schema.range[0] + i);
		const values = some(rng, pool, n);
		const rows = names.map((name, i): [string, string, number] => [name, rng.pick(labels), values[i]]);
		const label = labels[0];
		const with_ = rows.filter((r) => r[1] === label).length;
		// the row with the label is neither only the first nor only the last, so the mistakes give different numbers
		if (with_ >= 2 && with_ <= n - 1) return { schema, rows, label, text: fileOf([schema.cols.join(','), ...rows.map((r) => r.join(','))]) };
	}
}

// ---------------------------------------------------------------- level 1: the fields of a row

type Cut = 'quanti' | 'quale' | 'separatore';
const CUTS: readonly Cut[] = ['quanti', 'quale', 'separatore'];
const SEPARATOR = { ',': 'virgola', ';': 'punto e virgola' } as const;
const PIECES = [['3B', '2A', '4C', '1D'], ['nuoto', 'corsa', 'judo', 'salto'], ['Roma', 'Bari', 'Pisa', 'Lodi'], ['12', '7', '25', '9', '18'], ['si', 'no']] as const;

function level1(rng: Rng, family: Cut): CodeBuilt {
	if (family === 'separatore') {
		// a row written with one separator and cut at the other: with semicolons, a decimal comma is cut in two
		const decimal = rng.int(0, 1) === 1;
		const real = decimal || rng.int(0, 1) === 1 ? ';' : ',';
		const used = real === ';' ? ',' : ';';
		const fields = [rng.pick(NAMES), rng.pick(PIECES[1]), decimal ? `${rng.int(4, 9)},${rng.pick(['5', '25', '75'])}` : String(rng.int(4, 10))];
		const row = fields.join(real);
		const got = row.split(used);
		return {
			prompt: 'Cerca nella riga il carattere a cui il programma taglia.',
			problem: `Un programma legge questa riga di un file CSV e la taglia a ogni ${SEPARATOR[used]}. Quanti campi ottiene?`,
			listing: row + '\n',
			solution: String(got.length),
			steps: [
				`Nella riga i campi sono separati dal ${SEPARATOR[real]}, ma il programma taglia a ogni ${SEPARATOR[used]}.`,
				got.length === 1 ? `Nella riga non c'è nemmeno ${used === ',' ? 'una virgola' : 'un punto e virgola'}: non c'è niente da tagliare, e tutta la riga resta in un campo solo.` : `L'unica virgola è quella del numero ${fields[2]}: il programma taglia lì e ottiene 2 campi, ${got.join(' e ')}.`
			],
			answer: pick(rng, textOption(String(got.length)), [3, 2, 1, 4, 0].map((x) => textOption(String(x)))),
			params: { case: family, row, separator: used }
		};
	}
	const n = rng.int(3, 5);
	const fields = [rng.pick(NAMES), ...some(rng, PIECES, n - 1).map((pool) => rng.pick(pool))];
	const separator = rng.pick([',', ';'] as const);
	const row = fields.join(separator);
	if (family === 'quanti')
		return {
			prompt: 'Conta i pezzi, non i separatori.',
			problem: `Un programma legge questa riga di un file CSV e la taglia a ogni ${SEPARATOR[separator]}. Quanti campi ottiene?`,
			listing: row + '\n',
			solution: String(n),
			steps: [`Nella riga ci sono ${n - 1} separatori, e ogni separatore sta tra due campi.`, `I campi sono uno in più dei separatori: ${n}, cioè ${fields.join(', ')}.`],
			answer: pick(rng, textOption(String(n)), [n - 1, n + 1, 1, n - 2, row.length].map((x) => textOption(String(x)))),
			params: { case: family, row, separator }
		};
	const at = rng.int(1, n - 1);
	return {
		prompt: 'I campi si contano da 0, come gli elementi di un vettore.',
		problem: `Un programma legge questa riga di un file CSV e la taglia a ogni ${SEPARATOR[separator]}. Qual è il campo ${at}, contando da 0?`,
		listing: row + '\n',
		solution: fields[at],
		steps: [`Tagliando a ogni ${SEPARATOR[separator]} si ottengono ${n} campi: ${fields.join(', ')}.`, `Il primo è il campo 0, quindi il campo ${at} è ${fields[at]}.`],
		answer: pick(rng, textOption(fields[at]), [fields[at - 1], ...(at + 1 < n ? [fields[at + 1]] : []), fields[0], fields[n - 1], row].map((x) => textOption(x))),
		params: { case: family, row, separator, at }
	};
}

// ---------------------------------------------------------------- level 2: the file as a table

type Read = 'valore' | 'righe' | 'campo';
const READS: readonly Read[] = ['valore', 'righe', 'campo'];

function level2(rng: Rng, family: Read): CodeBuilt {
	const t = table(rng);
	const { cols } = t.schema;
	const n = t.rows.length;
	const base = { prompt: 'La prima riga dà i nomi delle colonne.', listing: t.text };
	if (family === 'righe')
		return {
			...base,
			problem: `Questo è il file ${t.schema.file}. Quante righe di dati contiene, senza contare l'intestazione?`,
			solution: String(n),
			steps: [`Il file ha ${n + 1} righe in tutto.`, `La prima, ${cols.join(',')}, è l'intestazione: dà i nomi delle colonne e non è un dato. Le righe di dati sono ${n}.`],
			answer: pick(rng, textOption(String(n)), [n + 1, n - 1, 3, 3 * n, n + 2].map((x) => textOption(String(x)))),
			params: { case: family, file: t.text }
		};
	const column = rng.int(1, 2);
	if (family === 'campo')
		return {
			...base,
			problem: `Questo è il file ${t.schema.file}. Un programma taglia ogni riga alle virgole. In quale campo, contando da 0, trova la colonna ${cols[column]}?`,
			solution: `Nel campo ${column}.`,
			steps: [`L'intestazione dice l'ordine delle colonne: ${cols.join(', ')}.`, `Contando da 0, ${cols[0]} è il campo 0 e ${cols[column]} è il campo ${column}.`],
			answer: pick(rng, textOption(`nel campo ${column}`, String(column)), [column + 1, column - 1, 3 - column, 3, 0].filter((x) => x >= 0).map((x) => textOption(`nel campo ${x}`, String(x)))),
			params: { case: family, file: t.text, column: cols[column] }
		};
	const at = rng.int(0, n - 1);
	const row = t.rows[at];
	const cell = String(row[column]);
	const others = [String(row[3 - column]), ...t.rows.filter((_, i) => i !== at).map((r) => String(r[column])), cols[column], row[0]];
	return {
		...base,
		problem: `Questo è il file ${t.schema.file}. Che cosa c'è nella colonna ${cols[column]} sulla riga di ${row[0]}?`,
		solution: cell,
		steps: [`L'intestazione dice che ${cols[column]} è il campo ${column}, contando da 0.`, `La riga di ${row[0]} è ${row.join(',')}: il suo campo ${column} è ${cell}.`],
		answer: pick(
			rng,
			textOption(cell),
			others.map((x) => textOption(x))
		),
		params: { case: family, file: t.text, column: cols[column], name: row[0] }
	};
}

// ---------------------------------------------------------------- levels 3 and 4: computing on a column

/** A loop over the rows of the table that keeps one value in `s`. */
interface Fold {
	/** Whether the header is read before the loop. */
	skip: boolean;
	/** The rows that count: those whose field `field` is (or is not) `value`; all of them when left out. */
	when?: { field: 0 | 1; equal: boolean; value: string };
	/** What a row that counts does: one more, its number added, its number kept. */
	then: 'uno' | 'numero' | 'tieni';
	start: 0 | 1;
}

const THEN = {
	uno: { python: () => 's + 1', cpp: () => 's + 1', of: (s: number) => s + 1 },
	numero: { python: () => 's + int(campi[2])', cpp: (c: string) => `s + stoi(${c})`, of: (s: number, x: number) => s + x },
	tieni: { python: () => 'int(campi[2])', cpp: (c: string) => `stoi(${c})`, of: (_: number, x: number) => x }
} as const;

/** The Python of a fold: with `narrow` the cut is on two rows, to fit an option. */
function foldPython(f: Fold, s: Schema, narrow: boolean): string {
	const cut = narrow ? ['        riga = riga.strip()', '        campi = riga.split(",")'] : ['        campi = riga.strip().split(",")'];
	const then = `s = ${THEN[f.then].python()}`;
	const body = f.when ? [`        if campi[${f.when.field}] ${f.when.equal ? '==' : '!='} "${f.when.value}":`, `            ${then}`] : [`        ${then}`];
	return [`s = ${f.start}`, `with open("${s.file}") as file:`, ...(f.skip ? ['    file.readline()'] : []), '    for riga in file:', ...cut, ...body, 'print(s)'].join('\n') + '\n';
}
function foldCpp(f: Fold, s: Schema): string {
	const [a, b, c] = s.cols;
	const then = `s = ${THEN[f.then].cpp(c)};`;
	const body = f.when ? [`    if (${s.cols[f.when.field]} ${f.when.equal ? '==' : '!='} "${f.when.value}") {`, `        ${then}`, '    }'] : [`    ${then}`];
	return [`ifstream file("${s.file}");`, `string riga, ${a}, ${b}, ${c};`, `int s = ${f.start};`, ...(f.skip ? ['getline(file, riga);'] : []), `while (getline(file, ${a}, ',')) {`, `    getline(file, ${b}, ',');`, `    getline(file, ${c});`, ...body, '}', 'file.close();', 'cout << s << endl;'].join('\n') + '\n';
}
function foldProgram(f: Fold, s: Schema, narrow: boolean): Program {
	return program(foldPython(f, s, narrow), cppProgram(foldCpp(f, s), '', FILE), (_, files) => {
		const rows = opened(files, s.file).map((row) => row.split(','));
		let acc: number = f.start;
		for (const row of f.skip ? rows.slice(1) : rows) {
			if (f.when && (row[f.when.field] === f.when.value) !== f.when.equal) continue;
			if (f.then !== 'uno' && !/^\d+$/.test(row[2])) throw new Error('a text converted into a number');
			acc = THEN[f.then].of(acc, Number(row[2]));
		}
		return [String(acc)];
	});
}

type Column = 'somma' | 'conta' | 'somma filtrata' | 'intestazione';

/** What a level asks of the table, and the same loop with a mistake a student makes, each a different one. */
function folds(family: Column, t: Table): { gives: string; right: Fold; wrong: Fold[] } {
	const is = { field: 1 as const, equal: true, value: t.label };
	const not = { ...is, equal: false };
	const name = { field: 0 as const, equal: true, value: t.label };
	const f = (then: Fold['then'], when?: Fold['when'], start: 0 | 1 = 0, skip = true): Fold => ({ skip, when, then, start });
	const { numbers, of, cols } = t.schema;
	if (family === 'somma') return { gives: `la somma di tutti ${numbers}`, right: f('numero'), wrong: [f('uno'), f('tieni'), f('numero', undefined, 1), f('numero', is), f('uno', undefined, 0, false)] };
	if (family === 'conta') return { gives: `quante righe hanno ${t.label} nella colonna ${cols[1]}`, right: f('uno', is), wrong: [f('uno', not), f('numero', is), f('uno'), f('uno', is, 1), f('uno', name), f('uno', undefined, 0, false)] };
	if (family === 'somma filtrata') return { gives: `la somma ${numbers.replace(/^(i|le|gli) /, (m) => ({ 'i ': 'dei ', 'le ': 'delle ', 'gli ': 'degli ' })[m]!)} ${of(t.label)}`, right: f('numero', is), wrong: [f('numero'), f('numero', not), f('uno', is), f('numero', is, 1), f('tieni', is), f('numero', name)] };
	// the header is not skipped and every row is counted: one more than the rows of data
	return { gives: 'quante righe legge', right: f('uno', undefined, 0, false), wrong: [f('uno'), f('uno', is), f('uno', undefined, 1, false), f('numero'), f('uno', not)] };
}

const SHOWN: readonly Column[] = ['somma', 'conta', 'somma filtrata', 'intestazione'];

function level3(rng: Rng, family: Column): CodeBuilt {
	const t = table(rng);
	const files = { [t.schema.file]: t.text };
	const { right, wrong } = folds(family, t);
	const shown = foldProgram(right, t.schema, false);
	const out = written(shown, [], files)!;
	const others = wrong.map((f) => written(foldProgram(f, t.schema, false), [], files)).filter((rows): rows is string[] => rows !== null);
	const n = t.rows.length;
	const numbers = t.rows.map((r) => r[2]);
	const withLabel = t.rows.filter((r) => r[1] === t.label);
	const steps = {
		somma: [`La prima lettura salta l'intestazione. Poi ogni riga viene tagliata alle virgole, e il campo 2 è ${t.schema.cols[2]}.`, `Il programma converte il campo 2 in un numero e lo somma: ${numbers.join(' + ')} = ${out[0]}.`],
		conta: [`Saltata l'intestazione, ogni riga viene tagliata alle virgole: il campo 1 è ${t.schema.cols[1]}.`, `s aumenta di 1 solo sulle righe in cui il campo 1 è ${t.label}: quelle di ${withLabel.map((r) => r[0]).join(', ')}. Alla fine s vale ${out[0]}.`],
		'somma filtrata': [`Saltata l'intestazione, ogni riga viene tagliata alle virgole: il campo 1 è ${t.schema.cols[1]} e il campo 2 è ${t.schema.cols[2]}.`, `Il campo 2 viene sommato solo sulle righe in cui il campo 1 è ${t.label}: ${withLabel.map((r) => r[2]).join(' + ')} = ${out[0]}.`],
		intestazione: ["Il programma non salta l'intestazione: il ciclo comincia dalla prima riga del file.", `Conta quindi tutte le righe, intestazione compresa: ${n} righe di dati più una, cioè ${out[0]}.`]
	}[family];
	return {
		prompt: 'Segui il programma una riga del file alla volta.',
		problem: `Accanto al programma c'è il file ${t.schema.file}, che vedi sotto il programma. Che cosa scrive il programma?`,
		code: texts(shown),
		listing: t.text,
		solution: out[0],
		steps,
		answer: pick(rng, writtenOption(out), [...others, [String(n)], [String(n + 1)], [String(numbers[0])]].map(writtenOption)),
		params: reference(shown, [[]], { ask: 'output', case: family, files, file: t.schema.file, label: t.label })
	};
}

const ASKED: readonly Column[] = ['somma', 'conta', 'somma filtrata'];

function level4(rng: Rng, family: Column): CodeBuilt {
	const t = table(rng);
	const files = { [t.schema.file]: t.text };
	const { gives, right, wrong } = folds(family, t);
	const whole = foldProgram(right, t.schema, true);
	const others = wrong.map((f) => ({ fold: f, whole: foldProgram(f, t.schema, true) }));
	const kept = wrongPrograms(
		whole,
		others.map((o) => o.whole),
		[[]],
		files
	);
	if (kept.length < 3) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const shownOf = (f: Fold) => ({ python: foldPython(f, t.schema, true), cpp: foldCpp(f, t.schema) });
	const option = (p: Program) => programOption(p, shownOf(p === whole ? right : others.find((o) => o.whole === p)!.fold));
	const out = written(whole, [], files)!;
	return {
		prompt: 'Guarda quale campo usa ogni programma, e che cosa ne fa.',
		problem: `Questo è il file ${t.schema.file}. Quale programma scrive ${gives}? Del C++ è mostrato solo il contenuto di main.`,
		listing: t.text,
		solution: `Il programma che salta l'intestazione e${right.when ? `, sulle righe con ${t.label} nel campo 1,` : ''} ${right.then === 'uno' ? 'aumenta s di 1' : 'somma il campo 2 convertito in numero'}: con questo file scrive ${out[0]}.`,
		steps: [
			`Tagliando una riga alle virgole, il campo 0 è ${t.schema.cols[0]}, il campo 1 è ${t.schema.cols[1]} e il campo 2 è ${t.schema.cols[2]}: in C++ sono le tre variabili con questi nomi.`,
			right.when ? `Contano solo le righe in cui ${t.schema.cols[1]} è uguale a ${t.label}: serve una selezione sul campo 1.` : "Contano tutte le righe di dati, quindi non serve una selezione; l'intestazione va saltata prima del ciclo.",
			right.then === 'uno' ? 'Per contare, s aumenta di 1 a ogni riga che conta, e parte da 0.' : 'Per sommare, il campo 2 va convertito in un numero e aggiunto a s, che parte da 0.'
		],
		solutionCode: shownOf(right),
		answer: pick(
			rng,
			option(whole),
			kept.map((p) => option(p))
		),
		params: reference(whole, [[]], { case: family, files, file: t.schema.file, label: t.label })
	};
}

// ---------------------------------------------------------------- level 5: writing a CSV file

type Made = 'giusto' | 'senza intestazione' | 'attaccate' | 'senza separatore';
const MADE: readonly Made[] = ['giusto', 'senza intestazione', 'attaccate', 'senza separatore'];
const WRITTEN = [
	['gara.csv', 'punti'],
	['voti.csv', 'voti'],
	['soci.csv', 'eta'],
	['gol.csv', 'gol']
] as const;

/** What the program of level 5 leaves in its file, row by row. */
function made(names: string[], values: number[], column: string, header: boolean, newline: boolean, separator: boolean): string[] {
	const text = (header ? `nome,${column}\n` : '') + names.map((name, i) => `${name}${separator ? ',' : ''}${values[i]}${newline ? '\n' : ''}`).join('');
	return rowsOf(text);
}

function level5(rng: Rng, family: Made): CodeBuilt {
	const [file, column] = rng.pick(WRITTEN);
	const names = some(rng, SHORT_NAMES, 3);
	const values = some(rng, [2, 3, 4, 5, 6, 7, 8, 9], 3);
	const header = family !== 'senza intestazione';
	const newline = family !== 'attaccate';
	const separator = family !== 'senza separatore';
	const shown = program(
		[`nomi = ["${names.join('", "')}"]`, `${column} = [${values.join(', ')}]`, `with open("${file}", "w") as file:`, ...(header ? [`    file.write("nome,${column}\\n")`] : []), '    for i in range(3):', `        file.write(nomi[i]${separator ? ' + ","' : ''})`, `        file.write(str(${column}[i])${newline ? ' + "\\n"' : ''})`].join('\n'),
		cppProgram([`string nomi[] = {"${names.join('", "')}"};`, `int ${column}[] = {${values.join(', ')}};`, `ofstream file("${file}");`, ...(header ? [`file << "nome,${column}" << endl;`] : []), 'for (int i = 0; i < 3; i++) {', `    file << nomi[i]${separator ? ' << ","' : ''};`, `    file << ${column}[i]${newline ? ' << endl' : ''};`, '}', 'file.close();'].join('\n'), '', FILE),
		() => []
	);
	const after = made(names, values, column, header, newline, separator);
	const others = [
		made(names, values, column, true, true, true),
		made(names, values, column, false, true, true),
		made(names, values, column, header, false, separator),
		made(names, values, column, header, newline, false),
		[...(header ? [`nome,${column}`] : []), ...names, ...values.map(String)],
		made(names, values, column, !header, newline, separator)
	];
	const steps = [
		header ? `Prima del ciclo il programma scrive l'intestazione, nome,${column}, e va a capo.` : "Il programma non scrive nessuna intestazione: il file comincia subito con i dati.",
		separator ? 'A ogni giro scrive un nome seguito dalla virgola, e sulla stessa riga il numero che gli corrisponde.' : 'A ogni giro scrive un nome e, subito attaccato, il numero: tra i due manca la virgola, quindi la riga ha un campo solo.',
		newline ? "Dopo il numero va a capo, quindi ogni coppia sta su una riga sua." : "Dopo il numero non va a capo: le tre coppie finiscono una di seguito all'altra, sulla stessa riga."
	];
	return {
		prompt: 'Segui che cosa viene scritto a ogni giro, carattere per carattere.',
		problem: `Che cosa contiene il file ${file} dopo l'esecuzione di questo programma?`,
		code: texts(shown),
		solution: after.join(' / '),
		steps,
		answer: pick(
			rng,
			contentOption(after),
			others.map((rows) => contentOption(rows))
		),
		params: reference(shown, [[]], { case: family, file, column, names, values })
	};
}

// ---------------------------------------------------------------- level 6: write the program

type Typed = 'somma' | 'conta' | 'filtro';
const TYPED: readonly Typed[] = ['somma', 'conta', 'filtro'];
const SPORTS = ['nuoto', 'corsa', 'judo'] as const;

/** How the program of level 6 treats the rows typed: which count, what each does, where it starts, how many it reads. */
interface Way {
	when?: { python: string; cpp: string; of: (fields: string[]) => boolean };
	then: 'uno' | 'numero' | 'tieni';
	start: 0 | 1;
	/** By mistake the loop makes one turn less. */
	short: boolean;
}

function typedProgram(w: Way, three: boolean): { whole: Program; shown: { python: string; cpp: string } } {
	const at = three ? 2 : 1;
	const then = { uno: ['s + 1', 's + 1'], numero: [`s + int(campi[${at}])`, 's + stoi(punti)'], tieni: [`int(campi[${at}])`, 'stoi(punti)'] }[w.then];
	const python = [`s = ${w.start}`, `for i in range(n${w.short ? ' - 1' : ''}):`, '    campi = input().split(",")', ...(w.when ? [`    if ${w.when.python}:`, `        s = ${then[0]}`] : [`    s = ${then[0]}`]), 'print(s)'].join('\n') + '\n';
	const cpp = [`int s = ${w.start};`, `for (int i = 0; i < n${w.short ? ' - 1' : ''}; i++) {`, "    getline(cin, nome, ',');", ...(three ? ["    getline(cin, sport, ',');"] : []), '    getline(cin, punti);', ...(w.when ? [`    if (${w.when.cpp}) {`, `        s = ${then[1]};`, '    }'] : [`    s = ${then[1]};`]), '}', 'cout << s << endl;'].join('\n') + '\n';
	const head = `string riga, nome, ${three ? 'sport, ' : ''}punti;\ngetline(cin, riga);\nint n = stoi(riga);\n`;
	const whole = program(`n = int(input())\n${python}`, cppProgram(head + cpp, '', ['string']), (input) => {
		const next = reader(input);
		const n = Number(next());
		let s: number = w.start;
		for (let i = 0; i < n - (w.short ? 1 : 0); i++) {
			const fields = next().split(',');
			if (w.when && !w.when.of(fields)) continue;
			const x = Number(fields[at]);
			s = w.then === 'uno' ? s + 1 : w.then === 'numero' ? s + x : x;
		}
		return [String(s)];
	});
	return { whole, shown: { python, cpp } };
}

function level6(rng: Rng, family: Typed): CodeBuilt {
	const three = family === 'filtro';
	const k = rng.int(4, 7);
	const sport = rng.pick(SPORTS);
	const at = three ? 2 : 1;
	const atLeast = { python: `int(campi[1]) >= ${k}`, cpp: `stoi(punti) >= ${k}`, of: (f: string[]) => Number(f[1]) >= k };
	const more = { python: `int(campi[1]) > ${k}`, cpp: `stoi(punti) > ${k}`, of: (f: string[]) => Number(f[1]) > k };
	const less = { python: `int(campi[1]) < ${k}`, cpp: `stoi(punti) < ${k}`, of: (f: string[]) => Number(f[1]) < k };
	const is = { python: `campi[1] == "${sport}"`, cpp: `sport == "${sport}"`, of: (f: string[]) => f[1] === sport };
	const not = { python: `campi[1] != "${sport}"`, cpp: `sport != "${sport}"`, of: (f: string[]) => f[1] !== sport };
	const way = (then: Way['then'], when?: Way['when'], start: 0 | 1 = 0, short = false): Way => ({ when, then, start, short });
	const { right, wrong } = {
		somma: { right: way('numero'), wrong: [way('uno'), way('tieni'), way('numero', undefined, 1), way('numero', undefined, 0, true)] },
		conta: { right: way('uno', atLeast), wrong: [way('uno', more), way('uno', less), way('numero', atLeast), way('uno'), way('uno', atLeast, 1)] },
		filtro: { right: way('numero', is), wrong: [way('numero'), way('numero', not), way('uno', is), way('numero', is, 1), way('tieni', is)] }
	}[family];
	const tests: string[][] = [];
	while (tests.length < 3) {
		const n = rng.int(3, 4);
		const names = some(rng, SHORT_NAMES, n);
		const points = Array.from({ length: n }, () => rng.int(1, 9));
		if (family === 'conta' && !points.includes(k)) points[rng.int(0, n - 1)] = k;
		const sports = names.map(() => rng.pick(SPORTS));
		if (three) {
			sports[0] = sport;
			sports[n - 1] = SPORTS[(SPORTS.indexOf(sport) + 1) % SPORTS.length];
		}
		tests.push([String(n), ...names.map((name, i) => (three ? `${name},${sports[i]},${points[i]}` : `${name},${points[i]}`))]);
	}
	const solution = typedProgram(right, three);
	const others = wrong.map((w) => typedProgram(w, three));
	const kept = wrongPrograms(
		solution.whole,
		others.map((o) => o.whole),
		tests
	);
	const outs = tests.map((t) => written(solution.whole, t)![0]);
	if (kept.length < 3 || new Set(outs).size < 2 || outs.includes('0')) throw new TooFew(`${ID}: only ${kept.length} wrong programs for ${family}`);
	const start = {
		python: 'n = int(input())\n# scrivi qui il ciclo\n',
		cpp: cppProgram('string riga;\ngetline(cin, riga);\nint n = stoi(riga);\n// scrivi qui il ciclo', '', ['string'])
	};
	const shape = three ? 'nome,sport,punti' : 'nome,punti';
	const example = tests[0][1];
	const asks = { somma: 'la somma dei punti', conta: `quante righe hanno almeno ${k} punti`, filtro: `la somma dei punti delle righe in cui lo sport è ${sport}` }[family];
	return {
		prompt: 'Scrivi il programma.',
		problem: `Il programma legge un numero n e poi n righe scritte come in un file CSV, nella forma ${shape} (per esempio ${example}). Con un ciclo leggi le righe, dividi ciascuna nei suoi campi e stampa ${asks}. La lettura di n c'è già.`,
		solution: `Un ciclo di n giri che legge una riga, la taglia alle virgole e ${right.then === 'uno' ? 'aumenta s di 1' : `aggiunge a s il campo ${at} convertito in numero`}${right.when ? ` quando ${right.when.python}` : ''}.`,
		steps: [
			`Dentro un ciclo di n giri leggi una riga e tagliala alle virgole: in Python con split, in C++ con getline fino alla virgola. I punti sono il campo ${at}.`,
			right.when ? (three ? `Guarda il campo 1: la riga conta solo quando lo sport è ${sport}.` : `Converti i punti in un numero e confrontali con ${k}: la riga conta quando sono maggiori o uguali.`) : 'Ogni riga conta: non serve una selezione.',
			right.then === 'uno' ? 'A ogni riga che conta aumenta s di 1, e dopo il ciclo stampa s.' : 'Converti i punti in un numero e aggiungili a s, che parte da 0; dopo il ciclo stampa s.'
		],
		solutionCode: texts(solution.whole),
		answer: needing(programAnswer(solution.whole, start, tests), 'ciclo'),
		choice: pick(
			rng,
			programOption(solution.whole, solution.shown),
			kept.map((p) => programOption(p, others.find((o) => o.whole === p)!.shown))
		),
		params: reference(solution.whole, tests, { case: family, k, sport })
	};
}

/** The levels without a program have none in `params`: what they ask is read from the fragment. */
const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'File di dati in formato CSV', {
	1: { label: 'I campi di una riga', constraints: ['one row of 3 to 5 fields, cut at a comma or at a semicolon', 'fields are counted from 0'], build: drawn(CUTS, level1), check: worded },
	2: { label: 'Leggere la tabella', constraints: ['a CSV file with a header and 4 or 5 rows of three fields', 'the header is not a row of data'], build: drawn(READS, level2), check: worded },
	3: { label: 'Calcolare su una colonna', constraints: ['a program that reads the file shown', 'four different outputs'], build: drawn(SHOWN, level3) },
	4: { label: 'Quale programma', constraints: ['four programs that write different things on the file shown', 'each option shows the body of main alone in C++'], build: drawn(ASKED, level4) },
	5: { label: 'Scrivere un file CSV', constraints: ['a program that writes three rows from two vectors', 'the options are what the file holds'], build: drawn(MADE, level5) },
	6: { label: 'Leggere righe con i campi', constraints: ['the program reads n and n rows of fields separated by commas', 'graded by running it on three lists', 'needs a loop'], build: drawn(TYPED, level6) }
});
