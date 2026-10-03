/**
 * Ordinare, filtrare e riassumere i dati. Spec: specs/exercises/inf-analisi-dati.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/28-inf-analisi-dati.md), all on a small generated
 * sheet with a header row: a sort on one column; a sort on two levels; a filter; two filters together; subtotals at
 * each change of a category; a cell of a pivot table. The answer is a row number, a count or a sum (a number), or
 * the content of a cell (a choice among the labels of the table).
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { type Cell, NAMES, block, choose, commonViolations, numberChoice, pickDistinct, sheet, shuffle, textOpt, ttIn } from '../inf-foglio-dati';

export const ID = 'inf-analisi-dati';

interface Theme {
	head: [string, string, string];
	what: string;
	labels: readonly string[];
	groups: [string, string, string];
	lo: number;
	hi: number;
	step: number;
}

const PRODUCTS = ['Penne', 'Quaderni', 'Gomme', 'Matite', 'Zaini', 'Colla', 'Righelli', 'Astucci', 'Diari', 'Forbici'];

const THEMES: Theme[] = [
	{ head: ['Nome', 'Classe', 'Punti'], what: 'i punti di un torneo tra classi', labels: NAMES, groups: ['1A', '1B', '1C'], lo: 5, hi: 30, step: 1 },
	{ head: ['Prodotto', 'Negozio', 'Pezzi'], what: 'i pezzi venduti in tre negozi', labels: PRODUCTS, groups: ['Centro', 'Lido', 'Porto'], lo: 10, hi: 60, step: 2 },
	{ head: ['Atleta', 'Squadra', 'Gol'], what: 'i gol segnati in un torneo', labels: NAMES, groups: ['Blu', 'Rossi', 'Verdi'], lo: 0, hi: 15, step: 1 },
	{ head: ['Cliente', 'Città', 'Euro'], what: 'gli acquisti di un negozio, in euro', labels: NAMES, groups: ['Bari', 'Pisa', 'Roma'], lo: 5, hi: 95, step: 5 },
];

interface Table {
	theme: number;
	T: Theme;
	rows: [string, string, number][];
}

const cmpText = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** `n` rows: different labels, different numbers, every group at least once (and no group more than n - 2 times). */
function table(rng: Rng, n: number): Table {
	const theme = rng.int(0, THEMES.length - 1);
	const T = THEMES[theme];
	const labels = pickDistinct(rng, T.labels, n);
	const grid = Array.from({ length: (T.hi - T.lo) / T.step + 1 }, (_, i) => T.lo + i * T.step);
	const values = pickDistinct(rng, grid, n);
	const groups = shuffle(rng, [...T.groups, ...Array.from({ length: n - 3 }, () => rng.pick(T.groups))]);
	return { theme, T, rows: labels.map((l, i) => [l, groups[i], values[i]]) };
}

const show = (tb: Table) => sheet([...tb.T.head], tb.rows as Cell[][]);
const para = (text: string): string => block([text]);

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

type Row = [string, string, number];

// ---------------------------------------------------------------------------
// Levels 1 and 2: sorting

interface Key {
	col: 0 | 1 | 2;
	desc: boolean;
}

const byKey =
	(k: Key) =>
	(a: Row, b: Row): number => {
		const c = k.col === 2 ? a[2] - b[2] : cmpText(a[k.col], b[k.col]);
		return k.desc ? -c : c;
	};

/** A stable sort on the keys, the first one being the most important. */
function sortRows(rows: Row[], keys: Key[]): Row[] {
	return rows
		.map((r, i) => ({ r, i }))
		.sort((x, y) => {
			for (const k of keys) {
				const c = byKey(k)(x.r, y.r);
				if (c) return c;
			}
			return x.i - y.i;
		})
		.map((x) => x.r);
}

const order = (k: Key): string => (k.col === 2 ? (k.desc ? 'in ordine decrescente' : 'in ordine crescente') : k.desc ? 'in ordine alfabetico dalla Z alla A' : 'in ordine alfabetico dalla A alla Z');
const colName = (T: Theme, k: Key): string => `la colonna ${ttIn('ABC'[k.col])} (${T.head[k.col]})`;
const listOf = (xs: (string | number)[]): string => xs.map((x) => (typeof x === 'number' ? `$${x}$` : x)).join(', ');

function sortLevel(rng: Rng, level: 1 | 2): Built {
	const tb = table(rng, level === 1 ? 5 : 6);
	const { T, rows } = tb;
	const n = rows.length;
	const keys: Key[] = level === 1 ? [rng.next() < 0.65 ? { col: 2, desc: rng.next() < 0.5 } : { col: 0, desc: rng.next() < 0.35 }] : [{ col: 1, desc: rng.next() < 0.2 }, rng.next() < 0.75 ? { col: 2, desc: rng.next() < 0.6 } : { col: 0, desc: false }];
	const sorted = sortRows(rows, keys);
	// what the common mistakes give: the opposite direction on the last key, one level only, no sort at all
	const flipLast = sortRows(rows, [...keys.slice(0, -1), { ...keys.at(-1)!, desc: !keys.at(-1)!.desc }]);
	const lastOnly = sortRows(rows, [keys.at(-1)!]);
	const firstOnly = sortRows(rows, [keys[0]]);
	const how =
		level === 1
			? `Si ordina la tabella secondo ${colName(T, keys[0])}, ${order(keys[0])}.`
			: `Si ordina la tabella su due livelli: prima secondo ${colName(T, keys[0])}, ${order(keys[0])}; poi secondo ${colName(T, keys[1])}, ${order(keys[1])}.`;
	const head = [`Il foglio contiene ${T.what}.`, show(tb), how];
	const kTex = (k: Key) => (k.col === 2 ? listOf(sortRows(rows, [k]).map((r) => r[2])) : listOf(sortRows(rows, [k]).map((r) => r[k.col])));
	const steps: string[] = [];
	if (level === 1) steps.push(para(`Si ordinano i valori della colonna ${ttIn('ABC'[keys[0].col])} ${order(keys[0])}: ${kTex(keys[0])}. Ogni riga si sposta intera, con tutte le sue celle.`));
	else {
		steps.push(para(`Primo livello: le righe si raggruppano per ${T.head[1]}, ${order(keys[0])}.`));
		steps.push(para(`Secondo livello: dentro ogni gruppo le righe si ordinano secondo ${T.head[keys[1].col]}, ${order(keys[1])}. La colonna ${ttIn('A')} diventa: ${listOf(sorted.map((r) => r[0]))}.`));
	}
	const askWho = rng.next() < 0.55;
	if (askWho) {
		const pos = rng.int(0, n - 1);
		const right = sorted[pos][0];
		const wrong = [flipLast[pos][0], lastOnly[pos][0], firstOnly[pos][0], rows[pos][0], ...shuffle(rng, rows.map((r) => r[0]))];
		// with two levels, the answer must change if the first level is forgotten
		if (level === 2 && lastOnly[pos][0] === right) throw new Error('retry');
		if (level === 1 && rows[pos][0] === right) throw new Error('retry');
		steps.push(para(`I dati cominciano dalla riga $2$, sotto l'intestazione: nella cella ${ttIn(`A${pos + 2}`)} c'è ${right}.`));
		return {
			prompt: "Trova la cella dopo l'ordinamento.",
			problem: block([...head, `Dopo l'ordinamento, che cosa c'è nella cella ${ttIn(`A${pos + 2}`)}?`]),
			solution: textOpt(right).latex,
			steps,
			answer: choose(rng, textOpt(right), wrong.map((x) => textOpt(x))),
			params: { case: 'cella', theme: tb.theme, keys },
		};
	}
	const who = rng.pick(rows)[0];
	const at = (rs: Row[]) => rs.findIndex((r) => r[0] === who) + 2;
	const v = at(sorted);
	if (level === 2 && at(lastOnly) === v) throw new Error('retry');
	if (level === 1 && at(rows) === v) throw new Error('retry');
	steps.push(para(`${who} è al posto $${v - 1}$ tra i dati, che cominciano dalla riga $2$ sotto l'intestazione: si trova nella riga $${v}$.`));
	return {
		prompt: "Trova la riga dopo l'ordinamento.",
		problem: block([...head, `Dopo l'ordinamento, in quale riga del foglio si trova ${who}?`]),
		solution: String(v),
		steps,
		answer: { kind: 'number', value: String(v) },
		params: { case: 'riga', theme: tb.theme, keys, mistakes: [v - 1, at(flipLast), at(lastOnly), at(firstOnly), at(rows)] },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: filters

type NumOp = 'maggiore di' | 'minore di' | 'maggiore o uguale a' | 'minore o uguale a';
type Cond = { col: 2; op: NumOp; n: number } | { col: 1; op: 'uguale a' | 'diverso da'; g: string };

const NUM_OPS: NumOp[] = ['maggiore di', 'minore di', 'maggiore o uguale a', 'minore o uguale a'];
const holds = (c: Cond, r: Row): boolean =>
	c.col === 1 ? (c.op === 'uguale a') === (r[1] === c.g) : c.op === 'maggiore di' ? r[2] > c.n : c.op === 'minore di' ? r[2] < c.n : c.op === 'maggiore o uguale a' ? r[2] >= c.n : r[2] <= c.n;
const condText = (T: Theme, c: Cond): string => (c.col === 1 ? `${T.head[1]} è ${c.op} ${c.g}` : `${T.head[2]} è ${c.op} $${c.n}$`);
const strictSwap = (c: Cond): Cond =>
	c.col === 1 ? c : { ...c, op: ({ 'maggiore di': 'maggiore o uguale a', 'maggiore o uguale a': 'maggiore di', 'minore di': 'minore o uguale a', 'minore o uguale a': 'minore di' } as Record<NumOp, NumOp>)[c.op] };

/** A numeric condition whose threshold is one of the values of the table (so that > and >= differ). */
function numCond(rng: Rng, rows: Row[]): Cond {
	const sorted = rows.map((r) => r[2]).sort((a, b) => a - b);
	return { col: 2, op: rng.pick(NUM_OPS), n: sorted[rng.int(1, sorted.length - 2)] };
}
const groupCond = (rng: Rng, T: Theme): Cond => ({ col: 1, op: rng.next() < 0.75 ? 'uguale a' : 'diverso da', g: rng.pick(T.groups) });
const rowList = (ix: number[]): string => (ix.length === 0 ? 'nessuna riga' : ix.length === 1 ? `la riga $${ix[0]}$` : `le righe $${ix.slice(0, -1).join('$, $')}$ e $${ix.at(-1)}$`);
const hits = (rows: Row[], conds: Cond[]): number[] => rows.map((r, i) => (conds.every((c) => holds(c, r)) ? i + 2 : 0)).filter(Boolean);

function level3(rng: Rng): Built {
	const tb = table(rng, 6);
	const { T, rows } = tb;
	const c = rng.next() < 0.6 ? numCond(rng, rows) : groupCond(rng, T);
	const vis = hits(rows, [c]);
	const head = [`Il foglio contiene ${T.what}.`, show(tb), `Si applica un filtro che mostra solo le righe in cui ${condText(T, c)}.`];
	const step1 = para(`La condizione è vera per ${rowList(vis)}; le altre righe vengono nascoste, non cancellate.`);
	const hidden = rows.filter((r) => !holds(c, r));
	if (rng.next() < 0.4 && vis.length >= 1 && hidden.length >= 3) {
		const right = rows[rng.pick(vis) - 2][0];
		return {
			prompt: 'Applica il filtro.',
			problem: block([...head, 'Quale di queste righe resta visibile?']),
			solution: textOpt(right).latex,
			steps: [step1, para(`Tra le quattro proposte resta visibile solo la riga di ${right}.`)],
			answer: choose(rng, textOpt(right), shuffle(rng, hidden).map((r) => textOpt(r[0]))),
			params: { case: 'quale', theme: tb.theme, cond: c },
		};
	}
	const v = vis.length;
	return {
		prompt: 'Applica il filtro.',
		problem: block([...head, "Quante righe di dati restano visibili, senza contare l'intestazione?"]),
		solution: String(v),
		steps: [step1, para(v === 1 ? `Resta visibile $1$ riga di dati su $${rows.length}$.` : `Restano visibili $${v}$ righe di dati su $${rows.length}$.`)],
		answer: { kind: 'number', value: String(v) },
		params: { case: 'quante', theme: tb.theme, cond: c, mistakes: [hits(rows, [strictSwap(c)]).length, rows.length - v, v + 1, rows.length] },
	};
}

function level4(rng: Rng): Built {
	const tb = table(rng, 7);
	const { T, rows } = tb;
	const a: Cond = { col: 1, op: 'uguale a', g: rng.pick(T.groups) };
	const b = numCond(rng, rows);
	const both = hits(rows, [a, b]);
	const onlyA = hits(rows, [a]);
	const onlyB = hits(rows, [b]);
	const either = rows.filter((r) => holds(a, r) || holds(b, r)).length;
	// the two filters must both matter: fewer rows than with either one alone
	if (both.length === onlyA.length || both.length === onlyB.length) throw new Error('retry');
	const v = both.length;
	// no row left is a fair answer, but not every third time
	if (v === 0 && rng.next() < 0.7) throw new Error('retry');
	return {
		prompt: 'Applica i due filtri.',
		problem: block([`Il foglio contiene ${T.what}.`, show(tb), `Si applicano due filtri insieme: ${condText(T, a)} e ${condText(T, b)}.`, "Quante righe di dati restano visibili, senza contare l'intestazione?"]),
		solution: String(v),
		steps: [
			para(`Primo filtro, ${condText(T, a)}: ${rowList(onlyA)}.`),
			para(`Secondo filtro, ${condText(T, b)}: ${rowList(onlyB)}.`),
			para(`Due filtri insieme mostrano solo le righe che rispettano tutte e due le condizioni: ${rowList(both)}. ${v === 1 ? 'Resta $1$ riga' : `Restano $${v}$ righe`}.`),
		],
		answer: { kind: 'number', value: String(v) },
		params: { case: v === 0 ? 'nessuna' : 'alcune', theme: tb.theme, conds: [a, b], mistakes: [either, onlyA.length, onlyB.length, hits(rows, [a, strictSwap(b)]).length] },
	};
}

// ---------------------------------------------------------------------------
// Level 5: subtotals

const total = (rows: Row[]): number => rows.reduce((s, r) => s + r[2], 0);

function level5(rng: Rng): Built {
	const tb = table(rng, 7);
	const { T, rows } = tb;
	const r = rng.next();
	const kind = r < 0.55 ? 'somma' : r < 0.8 ? 'conteggio' : 'totale';
	const fn = kind === 'conteggio' ? 'il conteggio delle righe' : `la somma della colonna ${ttIn('C')} (${T.head[2]})`;
	const g = rng.pick(T.groups);
	const mine = rows.filter((x) => x[1] === g);
	const sums = T.groups.map((x) => total(rows.filter((y) => y[1] === x)));
	const counts = T.groups.map((x) => rows.filter((y) => y[1] === x).length);
	const head = [`Il foglio contiene ${T.what}.`, show(tb), `Si ordina la tabella secondo la colonna ${ttIn('B')} (${T.head[1]}) e si inseriscono i subtotali, che a ogni cambio di ${T.head[1]} calcolano ${fn}.`];
	const groupsStep = para(`Dopo l'ordinamento le righe con lo stesso valore di ${T.head[1]} sono vicine: ${T.groups.map((x, i) => `${x} ($${counts[i]}$ ${counts[i] === 1 ? 'riga' : 'righe'})`).join(', ')}.`);
	if (kind === 'totale') {
		const v = total(rows);
		return {
			prompt: 'Calcola il totale.',
			problem: block([...head, 'Quanto vale il totale complessivo, in fondo alla tabella?']),
			solution: String(v),
			steps: [groupsStep, para(`I subtotali dei gruppi sono ${listOf(sums)}; il totale complessivo è la loro somma, cioè la somma di tutta la colonna: $${sums.join(' + ')} = ${v}$.`)],
			answer: { kind: 'number', value: String(v) },
			params: { case: kind, theme: tb.theme, mistakes: [...sums, rows.length, v - sums[0]] },
		};
	}
	const v = kind === 'somma' ? total(mine) : mine.length;
	const vals = mine.map((x) => x[2]);
	return {
		prompt: 'Calcola il subtotale.',
		problem: block([...head, `Quanto vale il subtotale del gruppo ${g}?`]),
		solution: String(v),
		steps: [
			groupsStep,
			para(kind === 'somma' ? (vals.length > 1 ? `Il gruppo ${g} ha i valori ${listOf(vals)}: il subtotale è $${vals.join(' + ')} = ${v}$.` : `Il gruppo ${g} ha una sola riga, con il valore $${v}$: il subtotale è $${v}$.`) : `Il gruppo ${g} ha $${v}$ ${v === 1 ? 'riga' : 'righe'}: il subtotale, che conta le righe, è $${v}$.`),
		],
		answer: { kind: 'number', value: String(v) },
		params: { case: kind, theme: tb.theme, group: g, mistakes: kind === 'somma' ? [...sums, total(rows), mine.length] : [...counts, rows.length, total(mine)] },
	};
}

// ---------------------------------------------------------------------------
// Level 6: a pivot table

interface PivotTheme {
	head: [string, string, string];
	what: string;
	rowsOf: [string, string];
	colsOf: [string, string, string];
}

const PIVOTS: PivotTheme[] = [
	{ head: ['Negozio', 'Mese', 'Incasso'], what: 'gli incassi di due negozi, in euro', rowsOf: ['Centro', 'Porto'], colsOf: ['gen', 'feb', 'mar'] },
	{ head: ['Classe', 'Prodotto', 'Euro'], what: 'gli incassi di un mercatino scolastico, in euro', rowsOf: ['1A', '1B'], colsOf: ['torte', 'bibite', 'panini'] },
	{ head: ['Squadra', 'Gara', 'Punti'], what: 'i punti di due squadre ai giochi di istituto', rowsOf: ['Blu', 'Rossi'], colsOf: ['corsa', 'salto', 'nuoto'] },
	{ head: ['Sede', 'Giorno', 'Iscritti'], what: 'gli iscritti ai corsi di due sedi', rowsOf: ['Nord', 'Sud'], colsOf: ['lun', 'mer', 'ven'] },
];

function level6(rng: Rng): Built {
	const p = rng.int(0, PIVOTS.length - 1);
	const P = PIVOTS[p];
	const combos = P.rowsOf.flatMap((a) => P.colsOf.map((b) => [a, b] as [string, string]));
	// eight rows: every combination once, two of them twice (a pivot cell then sums two rows)
	const pairs = shuffle(rng, [...combos, ...pickDistinct(rng, combos, 2)]);
	const rows: Row[] = pairs.map(([a, b]) => [a, b, 10 * rng.int(1, 9)]);
	const a = rng.pick(P.rowsOf);
	const b = rng.pick(P.colsOf);
	const cell = rows.filter((r) => r[0] === a && r[1] === b);
	const inRow = rows.filter((r) => r[0] === a);
	const inCol = rows.filter((r) => r[1] === b);
	const r = rng.next();
	const kind = r < 0.6 ? 'incrocio' : r < 0.8 ? 'totale-riga' : 'totale-colonna';
	if (kind === 'incrocio' && cell.length < 2 && rng.next() < 0.6) throw new Error('retry');
	const picked = kind === 'incrocio' ? cell : kind === 'totale-riga' ? inRow : inCol;
	const v = total(picked);
	const question =
		kind === 'incrocio' ? `Quale numero c'è all'incrocio tra la riga ${a} e la colonna ${b}?` : kind === 'totale-riga' ? `Quale numero c'è nel totale della riga ${a}?` : `Quale numero c'è nel totale della colonna ${b}?`;
	const which = kind === 'incrocio' ? `${P.head[0]} uguale a ${a} e ${P.head[1]} uguale a ${b}` : kind === 'totale-riga' ? `${P.head[0]} uguale a ${a}, qualunque sia ${P.head[1]}` : `${P.head[1]} uguale a ${b}, qualunque sia ${P.head[0]}`;
	const ix = rows.map((x, i) => (picked.includes(x) ? i + 2 : 0)).filter(Boolean);
	const vals = picked.map((x) => x[2]);
	return {
		prompt: 'Leggi la tabella pivot.',
		problem: block([
			`Il foglio contiene ${P.what}.`,
			sheet([...P.head], rows as Cell[][]),
			`Dal foglio si costruisce una tabella pivot con ${P.head[0]} nelle righe, ${P.head[1]} nelle colonne e la somma di ${P.head[2]} nei valori.`,
			question,
		]),
		solution: String(v),
		steps: [para(`In quella cella della tabella pivot finiscono le righe del foglio con ${which}: ${rowList(ix)}.`), para(vals.length > 1 ? `La tabella pivot ne somma i valori: $${vals.join(' + ')} = ${v}$.` : `È una riga sola: il valore è $${v}$.`)],
		answer: { kind: 'number', value: String(v) },
		params: { case: kind, theme: p, row: a, col: b, mistakes: [total(inRow), total(inCol), cell[0][2], total(cell), total(rows), picked.length] },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: (r) => sortLevel(r, 1), 2: (r) => sortLevel(r, 2), 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 300; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			if ((e as Error).message === 'retry' || (e as Error).message.startsWith('choose:')) continue;
			throw e;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer`);
	return numberChoice(rng, Number(sample.answer.value), (sample.params.mistakes as number[]) ?? []);
}

function check(sample: Sample): string[] {
	const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	const v = commonViolations(sample.problem, sample.steps, sample.solution, ch);
	if (sample.answer.kind !== 'choice' && sample.answer.kind !== 'number') v.push('la risposta deve essere una scelta o un numero');
	if (sample.answer.kind === 'number' && !/^\d+$/.test(sample.answer.value)) v.push('il numero deve essere un intero non negativo');
	return v;
}

export const infAnalisiDati: Generator = {
	id: ID,
	title: 'Ordinare, filtrare e riassumere i dati',
	levels: {
		1: { label: 'Ordinare su una colonna', constraints: ["tabella di cinque righe; ordinamento crescente o decrescente di una colonna di numeri, o alfabetico; la cella dopo l'ordinamento o la riga di un dato"] },
		2: { label: 'Ordinare su due livelli', constraints: ['tabella di sei righe; primo livello la categoria, secondo i numeri o i nomi; la risposta cambia se si dimentica il primo livello'] },
		3: { label: 'Filtrare', constraints: ['tabella di sei righe; un filtro su un numero (soglia presa dalla tabella) o su una categoria; quante righe restano, o quale resta'] },
		4: { label: 'Due filtri insieme', constraints: ['tabella di sette righe; una categoria e una soglia; meno righe che con ciascun filtro da solo'] },
		5: { label: 'I subtotali', constraints: ['tabella di sette righe e tre gruppi; subtotale di un gruppo (somma o conteggio) o totale complessivo'] },
		6: { label: 'La tabella pivot', constraints: ['otto righe, due categorie per tre; il valore di un incrocio (somma di una o due righe), di un totale di riga o di colonna'] },
	},
	generate,
	check,
	toChoice,
};

export default infAnalisiDati;
