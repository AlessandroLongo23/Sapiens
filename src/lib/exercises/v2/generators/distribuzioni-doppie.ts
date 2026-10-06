/**
 * Distribuzioni doppie. Spec: specs/exercises/distribuzioni-doppie.md
 *
 * Six levels in the order of the lesson, all on a two-way table of two rows and two or three columns: a
 * marginal total, a joint relative frequency, a conditional relative frequency (exact, or rounded to the
 * tenth), a conditional mean, a theoretical frequency of independence, a contingency. The table is drawn
 * first and kept only if the number the level asks for comes out as the level wants it.
 * The wrong options are the mistakes the lesson warns about: the wrong denominator (n, the row, the column),
 * the theoretical frequency rounded to a whole number, the observed frequency in its place, the sign of the
 * contingency swapped, a mean taken over all the units or without the frequencies.
 */
import type { Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { weighted } from '../razionali';
import { textBlock } from '../insiemi';
import { type Mistake, canChoose, choiceFromParams, choiceViolations, dec, finite, fixed, isum, numberChoice, roundTo, t } from '../bivariata';

export const ID = 'distribuzioni-doppie';

// ---------------------------------------------------------------------------
// Stories

interface Mod {
	/** As the table writes it; `one` and `many` contain it. */
	label: string;
	/** "abita in centro": after "che percentuale…", "tra chi…". */
	one: string;
	/** "abitano in centro": after "quanti studenti…". */
	many: string;
}

interface Ctx {
	key: string;
	intro: string;
	rows: Mod[];
	cols: Mod[];
}

const CTX: Ctx[] = [
	{
		key: 'scuola',
		intro: 'A un gruppo di studenti si chiede dove abitano e come vengono a scuola.',
		rows: [
			{ label: 'centro', one: 'abita in centro', many: 'abitano in centro' },
			{ label: 'periferia', one: 'abita in periferia', many: 'abitano in periferia' },
		],
		cols: [
			{ label: 'a piedi', one: 'viene a scuola a piedi', many: 'vengono a scuola a piedi' },
			{ label: 'autobus', one: 'viene a scuola in autobus', many: 'vengono a scuola in autobus' },
			{ label: 'moto', one: 'viene a scuola in moto', many: 'vengono a scuola in moto' },
		],
	},
	{
		key: 'gita',
		intro: 'Gli studenti di due classi votano la meta della gita.',
		rows: [
			{ label: '3A', one: 'è della 3A', many: 'sono della 3A' },
			{ label: '3B', one: 'è della 3B', many: 'sono della 3B' },
		],
		cols: [
			{ label: 'mare', one: 'ha votato il mare', many: 'hanno votato il mare' },
			{ label: 'monti', one: 'ha votato i monti', many: 'hanno votato i monti' },
			{ label: 'lago', one: 'ha votato il lago', many: 'hanno votato il lago' },
		],
	},
	{
		key: 'torneo',
		intro: 'Gli studenti di una scuola si iscrivono al torneo di istituto, ognuno a uno sport.',
		rows: [
			{ label: 'biennio', one: 'è del biennio', many: 'sono del biennio' },
			{ label: 'triennio', one: 'è del triennio', many: 'sono del triennio' },
		],
		cols: [
			{ label: 'calcio', one: 'si è iscritto a calcio', many: 'si sono iscritti a calcio' },
			{ label: 'basket', one: 'si è iscritto a basket', many: 'si sono iscritti a basket' },
			{ label: 'nuoto', one: 'si è iscritto a nuoto', many: 'si sono iscritti a nuoto' },
		],
	},
];

interface Table {
	ctx: Ctx;
	rows: Mod[];
	cols: Mod[];
	cells: number[][];
}

const rowTot = (tb: Table) => tb.cells.map(isum);
const colTot = (tb: Table) => tb.cols.map((_, j) => isum(tb.cells.map((r) => r[j])));
const total = (tb: Table) => isum(rowTot(tb));

/** The table as the lesson draws it, with or without the totals; with three columns and the totals it is set in \\small, to stay in the width of a phone. */
function tableTex(tb: Table, totals: boolean): string {
	const head = ['', ...tb.cols.map((c) => t(c.label)), ...(totals ? [t('tot.')] : [])].join(' & ');
	const rt = rowTot(tb);
	const body = tb.rows.map((r, i) => [t(r.label), ...tb.cells[i], ...(totals ? [rt[i]] : [])].join(' & '));
	const foot = totals ? ` \\\\ \\hline ${[t('tot.'), ...colTot(tb), total(tb)].join(' & ')}` : '';
	return `${totals && tb.cols.length === 3 ? '\\small ' : ''}\\begin{array}{l|${'c'.repeat(tb.cols.length)}${totals ? '|c' : ''}} ${head} \\\\ \\hline ${body.join(' \\\\ ')}${foot} \\end{array}`;
}

/** `total` split into `k` parts of at least `min`, uniformly among the compositions. */
function composition(rng: Rng, tot: number, k: number, min: number): number[] | null {
	const free = tot - k * min;
	if (free < 0) return null;
	const cuts = Array.from({ length: k - 1 }, () => rng.int(0, free)).sort((a, b) => a - b);
	const parts: number[] = [];
	let prev = 0;
	for (const c of [...cuts, free]) {
		parts.push(c - prev + min);
		prev = c;
	}
	return parts;
}

function pickMods(rng: Rng): { ctx: Ctx; cols: Mod[] } {
	const ctx = rng.pick(CTX);
	const k = weighted(rng, [
		[2, 40],
		[3, 60],
	]);
	const drop = k === 2 ? rng.int(0, 2) : -1;
	return { ctx, cols: ctx.cols.filter((_, j) => j !== drop) };
}

/** A table with total n, two rows of different size, every cell at least 1. */
function tableWithTotal(rng: Rng, n: number): Table | null {
	const { ctx, cols } = pickMods(rng);
	if (cols.length === 3 && n >= 100) return null; // three-digit totals do not fit a phone with three columns
	const r1 = rng.int(Math.ceil(0.3 * n), Math.floor(0.7 * n));
	if (2 * r1 === n) return null;
	const a = composition(rng, r1, cols.length, 1), b = composition(rng, n - r1, cols.length, 1);
	if (!a || !b) return null;
	const tb = { ctx, rows: ctx.rows, cols, cells: [a, b] };
	if (new Set(colTot(tb)).size !== cols.length) return null;
	return tb;
}

const tableParams = (tb: Table) => ({ context: tb.ctx.key, rows: tb.rows.map((r) => r.label), cols: tb.cols.map((c) => c.label), cells: tb.cells.map((r) => r.map(String)) });
const pct = (num: number, den: number) => q(num * 100, den);
const N_PERCENT = [20, 25, 40, 50, 100];
const N_THEORY = [20, 25, 30, 40, 50, 60, 80, 100];

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: a marginal total, from a table without totals

function level1(rng: Rng, c: 'riga' | 'colonna'): Built | null {
	const { ctx, cols } = pickMods(rng);
	const cells = ctx.rows.map(() => cols.map(() => rng.int(2, 18)));
	const tb: Table = { ctx, rows: ctx.rows, cols, cells };
	const rt = rowTot(tb), ct = colTot(tb), n = total(tb);
	if (new Set([...rt, ...ct]).size !== rt.length + ct.length) return null;
	if (new Set(cells.flat()).size !== cells.flat().length) return null;
	const i = c === 'riga' ? rng.int(0, 1) : rng.int(0, cols.length - 1);
	const mod = c === 'riga' ? tb.rows[i] : cols[i];
	const line = c === 'riga' ? cells[i] : cells.map((r) => r[i]);
	const right = isum(line);
	const mistakes: Mistake[] = [
		{ value: q(n), why: 'totale generale' },
		{ value: q(c === 'riga' ? ct[0] : rt[0]), why: "totale dell'altro carattere" },
		{ value: q(Math.max(...line)), why: 'una sola casella' },
		{ value: q(c === 'riga' ? rt[1 - i] : ct[(i + 1) % cols.length]), why: 'riga o colonna sbagliata' },
	];
	return {
		prompt: `Quanti studenti in tutto ${mod.many}?`,
		problem: textBlock(ctx.intro, 46, [tableTex(tb, false)]),
		steps: [
			t(`Servono tutte le caselle della ${c} ${mod.label}, qualunque sia l'altro carattere.`),
			`${line.join(' + ')} = ${right}`,
			t(`È una frequenza della distribuzione marginale: il totale di ${c}.`),
		],
		solution: `${right}`,
		answer: { kind: 'number', value: String(right) },
		params: { ...tableParams(tb), case: c, target: i, ...numberChoice(q(right), mistakes, { min: q(0) }) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: a joint relative frequency, as a percentage of all the units

function level2(rng: Rng): Built | null {
	const tb = tableWithTotal(rng, rng.pick(N_PERCENT));
	if (!tb) return null;
	const rt = rowTot(tb), ct = colTot(tb), n = total(tb);
	const i = rng.int(0, 1), j = rng.int(0, tb.cols.length - 1);
	const f = tb.cells[i][j];
	const right = pct(f, n);
	if (right.equals(q(f))) return null;
	const mistakes: Mistake[] = [
		{ value: roundTo(pct(f, rt[i]), 1), why: 'diviso per il totale di riga' },
		{ value: roundTo(pct(f, ct[j]), 1), why: 'diviso per il totale di colonna' },
		{ value: q(f), why: 'la frequenza assoluta' },
	];
	return {
		prompt: `Che percentuale di tutti gli studenti ${tb.rows[i].one} e ${tb.cols[j].one}?`,
		problem: textBlock(tb.ctx.intro, 46, [tableTex(tb, true)]),
		steps: [
			`${t(`La casella (${tb.rows[i].label}, ${tb.cols[j].label}) ha frequenza congiunta `)} ${f}`,
			`${t('La domanda parla di tutti gli studenti: si divide per ')} n = ${n}`,
			`\\frac{${f}}{${n}} = ${dec(q(f, n))} = ${dec(right)}\\%`,
		],
		solution: `${dec(right)}\\%`,
		answer: { kind: 'number', value: right.toString() },
		params: { ...tableParams(tb), case: `${tb.cols.length} colonne`, target: [i, j], ...numberChoice(right, mistakes, { suffix: '\\%', min: q(0), max: q(100) }) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a conditional relative frequency

function level3(rng: Rng, c: 'esatta' | 'arrotondata'): Built | null {
	const tb = tableWithTotal(rng, rng.pick(N_PERCENT));
	if (!tb) return null;
	const rt = rowTot(tb), ct = colTot(tb), n = total(tb);
	const dir = rng.int(0, 1) ? 'riga' : 'colonna';
	const i = rng.int(0, 1), j = rng.int(0, tb.cols.length - 1);
	const f = tb.cells[i][j];
	const T = dir === 'riga' ? rt[i] : ct[j];
	const other = dir === 'riga' ? ct[j] : rt[i];
	const exact = pct(f, T);
	if (T < 8 || finite(exact, 1) !== (c === 'esatta')) return null;
	if (c === 'esatta' && exact.equals(q(100))) return null;
	const right = c === 'esatta' ? exact : roundTo(exact, 1);
	const given = dir === 'riga' ? tb.rows[i] : tb.cols[j], asked = dir === 'riga' ? tb.cols[j] : tb.rows[i];
	const mistakes: Mistake[] = [
		{ value: pct(f, n), why: 'diviso per n' },
		{ value: roundTo(pct(f, other), 1), why: "diviso per il totale dell'altro carattere" },
		{ value: q(f), why: 'la frequenza assoluta' },
	];
	const digits = c === 'arrotondata' ? 1 : undefined;
	const shown = c === 'arrotondata' ? fixed(right, 1) : dec(right);
	return {
		prompt: `Tra chi ${given.one}, che percentuale ${asked.one}?${c === 'arrotondata' ? ' Arrotonda al decimo.' : ''}`,
		problem: textBlock(tb.ctx.intro, 46, [tableTex(tb, true)]),
		steps: [
			`${t(`La domanda parla solo di chi ${given.one}: il totale della ${dir} ${given.label} è `)} ${T}`,
			`${t(`Tra questi, quelli della casella (${tb.rows[i].label}, ${tb.cols[j].label}) sono `)} ${f}`,
			c === 'esatta' ? `\\frac{${f}}{${T}} = ${dec(q(f, T))} = ${shown}\\%` : `\\frac{${f}}{${T}} \\approx ${shown}\\%`,
			`${t('Non si divide per ')} n = ${n}${t(': quella sarebbe la percentuale su tutti gli studenti.')}`,
		],
		solution: `${c === 'esatta' ? '' : '\\approx '}${shown}\\%`,
		answer: { kind: 'number', value: right.toString() },
		params: { ...tableParams(tb), case: c, direction: dir, target: [i, j], ...numberChoice(right, mistakes, { digits, suffix: '\\%', min: q(0), max: q(100) }) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a conditional mean

interface MeanCtx {
	key: string;
	intro: string;
	rows: string[];
	of: (label: string) => string;
}
const MEAN_CTX: MeanCtx[] = [
	{ key: 'studio', intro: 'Per un gruppo di studenti si conoscono le ore di studio al giorno e il voto di una verifica.', rows: ['1 ora', '2 ore', '3 ore'], of: (l) => `di chi studia ${l} al giorno` },
	{ key: 'classi', intro: 'Questi sono i voti di due classi nella stessa verifica.', rows: ['3A', '3B'], of: (l) => `della ${l}` },
];

/** `tot` units thrown at random into `k` cells. */
function scatter(rng: Rng, tot: number, k: number): number[] {
	const cells = Array.from({ length: k }, () => 0);
	for (let u = 0; u < tot; u++) cells[rng.int(0, k - 1)]++;
	return cells;
}

function level4(rng: Rng): Built | null {
	const mc = rng.pick(MEAN_CTX);
	const drop = mc.rows.length === 3 ? rng.int(0, 2) : -1;
	const rows = mc.rows.filter((_, i) => i !== drop);
	const start = rng.int(4, 6);
	const ys = [0, 1, 2, 3].map((k) => start + k);
	const tots = [rng.pick([5, 8, 10, 20]), rng.pick([5, 8, 10, 20])];
	if (tots[0] === tots[1]) return null;
	const cells = tots.map((T) => scatter(rng, T, 4));
	if (cells.some((r) => r.filter((f) => f > 0).length < 3 || Math.max(...r) > 9)) return null;
	const sums = cells.map((r) => isum(r.map((f, k) => f * ys[k])));
	const means = sums.map((s, i) => q(s, tots[i]));
	if (means.some((m) => !finite(m, 2)) || means[0].equals(means[1])) return null;
	const i = rng.int(0, 1);
	const n = tots[0] + tots[1];
	const right = means[i];
	const mistakes: Mistake[] = [
		{ value: q(sums[0] + sums[1], n), why: 'media di tutti' },
		{ value: q(sums[i], n), why: 'diviso per n' },
		{ value: q(isum(ys), 4), why: 'media dei voti senza le frequenze' },
		{ value: means[1 - i], why: "l'altra riga" },
	];
	const head = [t('voto'), ...ys, t('tot.')].join(' & ');
	const body = rows.map((r, k) => [t(r), ...cells[k], tots[k]].join(' & '));
	const table = `\\begin{array}{l|cccc|c} ${head} \\\\ \\hline ${body.join(' \\\\ ')} \\end{array}`;
	const prods = cells[i].map((f, k) => `${ys[k]} \\cdot ${f}`).join(' + ');
	return {
		prompt: `Calcola il voto medio ${mc.of(rows[i])}.`,
		problem: textBlock(mc.intro, 46, [table]),
		steps: [
			`${t(`Si usa solo la riga ${rows[i]} e si divide per il suo totale, `)} ${tots[i]}`,
			`\\bar{y} = \\frac{${prods}}{${tots[i]}} = \\frac{${sums[i]}}{${tots[i]}} = ${dec(right)}`,
			t('È una media condizionata: riguarda solo le unità di quella riga.'),
		],
		solution: `\\bar{y} = ${dec(right)}`,
		answer: { kind: 'number', value: right.toString() },
		params: { context: mc.key, rows, ys: ys.map(String), cells: cells.map((r) => r.map(String)), case: mc.key, target: i, ...numberChoice(right, mistakes, { min: q(0) }) },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: theoretical frequency and contingency

/** Two proportional rows: every theoretical frequency equals the observed one. */
function independentTable(rng: Rng): Table | null {
	const { ctx, cols } = pickMods(rng);
	const base = cols.map(() => rng.int(1, 6));
	const k1 = rng.int(1, 5), k2 = rng.int(1, 5);
	if (k1 === k2 || new Set(base).size === 1) return null;
	const tb = { ctx, rows: ctx.rows, cols, cells: [base.map((b) => b * k1), base.map((b) => b * k2)] };
	if (total(tb) < 15 || total(tb) > 100) return null;
	return tb;
}

function theorySteps(tb: Table, i: number, j: number): { steps: string[]; theory: Rational } {
	const rt = rowTot(tb), ct = colTot(tb), n = total(tb);
	const theory = q(rt[i] * ct[j], n);
	return {
		theory,
		steps: [
			`${t(`Il totale della riga ${tb.rows[i].label} è `)} ${rt[i]}${t(`, quello della colonna ${tb.cols[j].label} è `)} ${ct[j]}${t(', e ')} n = ${n}`,
			`${t('Frequenza teorica: ')} \\frac{${rt[i]} \\cdot ${ct[j]}}{${n}} = \\frac{${rt[i] * ct[j]}}{${n}} = ${dec(theory)}`,
		],
	};
}

function level5(rng: Rng, c: 'intera' | 'con la virgola'): Built | null {
	const tb = tableWithTotal(rng, rng.pick(N_THEORY));
	if (!tb) return null;
	const rt = rowTot(tb), ct = colTot(tb);
	const i = rng.int(0, 1), j = rng.int(0, tb.cols.length - 1);
	const f = tb.cells[i][j];
	const theory = q(rt[i] * ct[j], total(tb));
	if (!finite(theory, 2) || theory.isInteger() !== (c === 'intera') || theory.equals(q(f))) return null;
	const mistakes: Mistake[] = [
		{ value: q(f), why: 'frequenza osservata' },
		...(c === 'intera' ? [] : [{ value: roundTo(theory, 0), why: 'arrotondata' }]),
		{ value: q(ct[j]), why: 'totale di colonna' },
		{ value: q(rt[i]), why: 'totale di riga' },
	];
	const ts = theorySteps(tb, i, j);
	return {
		prompt: `Calcola la frequenza teorica di indipendenza della casella (${tb.rows[i].label}, ${tb.cols[j].label}).`,
		problem: textBlock(tb.ctx.intro, 46, [tableTex(tb, true)]),
		steps: [...ts.steps, t(c === 'intera' ? `La frequenza osservata, ${f}, è diversa: i due caratteri sono dipendenti.` : 'Non si arrotonda: è un valore di confronto, non un conteggio.')],
		solution: dec(theory),
		answer: { kind: 'number', value: theory.toString() },
		params: { ...tableParams(tb), case: c, target: [i, j], ...numberChoice(theory, mistakes, { min: q(0) }) },
	};
}

function level6(rng: Rng, c: 'positiva' | 'negativa' | 'zero'): Built | null {
	const tb = c === 'zero' ? independentTable(rng) : tableWithTotal(rng, rng.pick(N_THEORY));
	if (!tb) return null;
	const i = rng.int(0, 1), j = rng.int(0, tb.cols.length - 1);
	const f = tb.cells[i][j];
	const ts = theorySteps(tb, i, j);
	const cont = q(f).sub(ts.theory);
	if (!finite(cont, 2)) return null;
	if ((c === 'positiva' && cont.sign() <= 0) || (c === 'negativa' && cont.sign() >= 0) || (c === 'zero' && cont.sign() !== 0)) return null;
	const mistakes: Mistake[] = [
		{ value: cont.neg(), why: 'teorica meno osservata' },
		{ value: ts.theory, why: 'frequenza teorica' },
		{ value: q(f), why: 'frequenza osservata' },
	];
	const meaning =
		c === 'zero'
			? 'In questa casella la frequenza osservata è uguale a quella teorica.'
			: `La coppia compare ${c === 'positiva' ? 'più' : 'meno'} spesso di quanto succederebbe con caratteri indipendenti.`;
	return {
		prompt: `Calcola la contingenza della casella (${tb.rows[i].label}, ${tb.cols[j].label}).`,
		problem: textBlock(tb.ctx.intro, 46, [tableTex(tb, true)]),
		steps: [...ts.steps, `${t('Contingenza, osservata meno teorica: ')} ${f} - ${dec(ts.theory)} = ${dec(cont)}`, t(meaning)],
		solution: dec(cont),
		answer: { kind: 'number', value: cont.toString() },
		params: { ...tableParams(tb), case: c, target: [i, j], ...numberChoice(cont, mistakes) },
	};
}

// ---------------------------------------------------------------------------

/** Cases with a fixed share: drawn once per exercise, before the retries, so a case that is rejected more often keeps its share. */
const CASES: Record<number, [string, number][]> = {
	1: [
		['riga', 50],
		['colonna', 50],
	],
	3: [
		['esatta', 60],
		['arrotondata', 40],
	],
	5: [
		['intera', 40],
		['con la virgola', 60],
	],
	6: [
		['positiva', 40],
		['negativa', 40],
		['zero', 20],
	],
};

function build(rng: Rng, level: number, c: string): Built | null {
	switch (level) {
		case 1:
			return level1(rng, c as 'riga' | 'colonna');
		case 2:
			return level2(rng);
		case 3:
			return level3(rng, c as 'esatta' | 'arrotondata');
		case 4:
			return level4(rng);
		case 5:
			return level5(rng, c as 'intera' | 'con la virgola');
		case 6:
			return level6(rng, c as 'positiva' | 'negativa' | 'zero');
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v = choiceViolations(sample);
	const p = sample.params;
	const ans = sample.answer;
	if (ans.kind !== 'number') return [...v, 'la risposta deve essere un numero'];
	const num = Rational.parse(ans.value);
	const cells = (p.cells as string[][]).map((r) => r.map(Number));
	const rt = cells.map(isum);
	const ct = cells[0].map((_, j) => isum(cells.map((r) => r[j])));
	const n = isum(rt);
	if (cells.length !== 2 || cells[0].length !== cells[1].length) v.push('servono due righe della stessa lunghezza');
	if (sample.level === 4) {
		const i = p.target as number;
		const ys = (p.ys as string[]).map(Number);
		if (!num.equals(q(isum(cells[i].map((f, k) => f * ys[k])), rt[i]))) v.push('media condizionata sbagliata');
		if (!finite(num, 2)) v.push('media con più di due decimali');
		return v;
	}
	if (cells[0].length < 2 || cells[0].length > 3) v.push('servono due o tre colonne');
	if (sample.level === 1) {
		const i = p.target as number;
		if (!num.equals(q(p.case === 'riga' ? rt[i] : ct[i]))) v.push('totale marginale sbagliato');
		return v;
	}
	const [i, j] = p.target as [number, number];
	const f = cells[i][j];
	const theory = q(rt[i] * ct[j], n);
	switch (sample.level) {
		case 2:
			if (!N_PERCENT.includes(n)) v.push('totale non ammesso');
			if (!num.equals(pct(f, n))) v.push('percentuale sul totale sbagliata');
			break;
		case 3: {
			if (!N_PERCENT.includes(n)) v.push('totale non ammesso');
			const exact = pct(f, p.direction === 'riga' ? rt[i] : ct[j]);
			if (finite(exact, 1) !== (p.case === 'esatta')) v.push('caso sbagliato');
			if (!num.equals(p.case === 'esatta' ? exact : roundTo(exact, 1))) v.push('percentuale condizionata sbagliata');
			break;
		}
		case 5:
			if (!N_THEORY.includes(n)) v.push('totale non ammesso');
			if (!num.equals(theory) || !finite(theory, 2)) v.push('frequenza teorica sbagliata');
			if (theory.isInteger() !== (p.case === 'intera')) v.push('caso sbagliato');
			if (theory.equals(q(f))) v.push('teorica uguale a osservata');
			break;
		case 6: {
			const cont = q(f).sub(theory);
			if (!num.equals(cont) || !finite(cont, 2)) v.push('contingenza sbagliata');
			if ((p.case === 'positiva') !== cont.sign() > 0 || (p.case === 'negativa') !== cont.sign() < 0) v.push('caso sbagliato');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export const distribuzioniDoppie: Generator = {
	id: ID,
	title: 'Distribuzioni doppie',
	levels: {
		1: { label: 'Totali marginali', constraints: ['tabella 2×2 o 2×3 senza totali, caselle da 2 a 18 tutte diverse', 'si chiede il totale di una riga o di una colonna'] },
		2: { label: 'Percentuale sul totale', constraints: ['tabella con i totali, n tra 20, 25, 40, 50, 100', 'percentuale esatta con al massimo un decimale'] },
		3: { label: 'Percentuale condizionata', constraints: ['si divide per il totale di una riga o di una colonna', 'esatta con al massimo un decimale, oppure arrotondata al decimo'] },
		4: { label: 'Media condizionata', constraints: ['due righe con totali diversi tra 5, 8, 10, 20 e quattro voti consecutivi', 'media con al massimo due decimali'] },
		5: { label: 'Frequenza teorica', constraints: ['n tra 20, 25, 30, 40, 50, 60, 80, 100', 'frequenza teorica intera o con al massimo due decimali, diversa da quella osservata'] },
		6: { label: 'Contingenza', constraints: ['contingenza positiva, negativa o zero', 'al massimo due decimali'] },
	},
	generate(rng: Rng, level: number): Sample {
		const c = CASES[level] ? weighted(rng, CASES[level]) : '';
		for (let attempt = 0; attempt < 50_000; attempt++) {
			let b: Built | null;
			try {
				b = build(rng, level, c);
			} catch (e) {
				if (/unknown level/.test(String(e))) throw e;
				b = null;
			}
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length > 0) continue;
			if (!canChoose(sample)) continue; // fewer than four distinct options: draw again
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: choiceFromParams,
};

export default distribuzioniDoppie;
