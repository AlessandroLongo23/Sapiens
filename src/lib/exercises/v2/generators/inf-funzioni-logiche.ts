/**
 * Condizioni e funzioni logiche. Spec: specs/exercises/inf-funzioni-logiche.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/26-inf-funzioni-logiche.md): which comparison is
 * true; the value of a SE; nested SE (bands); E, O, NON inside a SE; CONTA.SE; SOMMA.SE. Every formula is built as a
 * small tree, written in the Italian syntax (`;` between arguments) and evaluated on a generated sheet. The last two
 * levels also ask which formula gives a result.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Cell, COLS, NAMES, block, choose, commonViolations, formulaOpt, numOpt, numberChoice, pickDistinct, raw, sheet, shuffle, textOpt, ttIn, ttLine } from '../inf-foglio-dati';

export const ID = 'inf-funzioni-logiche';

/** Longest formula line of a problem and longest formula option that fit a phone. */
const MAX_LINE = 33;
const MAX_OPTION = 27;

// ---------------------------------------------------------------------------
// Formulas

type Op = '=' | '<>' | '<' | '<=' | '>' | '>=';
const OPS: Op[] = ['=', '<>', '<', '<=', '>', '>='];
const OP_TEX: Record<Op, string> = { '=': '=', '<>': '\\neq', '<': '<', '<=': '\\leq', '>': '>', '>=': '\\geq' };
const OP_WORDS: Record<Op, string> = { '=': 'uguale a', '<>': 'diverso da', '<': 'minore di', '<=': 'minore o uguale a', '>': 'maggiore di', '>=': 'maggiore o uguale a' };

type Val = number | string | boolean;
type Expr =
	| { k: 'num'; v: number }
	| { k: 'str'; v: string }
	| { k: 'ref'; a: string }
	| { k: 'cmp'; op: Op; l: Expr; r: Expr }
	| { k: 'bin'; op: '+' | '-' | '*'; l: Expr; r: Expr }
	| { k: 'fn'; name: 'SE' | 'E' | 'O' | 'NON'; args: Expr[] };

const num = (v: number): Expr => ({ k: 'num', v });
const str = (v: string): Expr => ({ k: 'str', v });
const ref = (a: string): Expr => ({ k: 'ref', a });
const cmp = (l: Expr, op: Op, r: Expr): Expr => ({ k: 'cmp', op, l, r });
const fn = (name: 'SE' | 'E' | 'O' | 'NON', ...args: Expr[]): Expr => ({ k: 'fn', name, args });

function show(e: Expr): string {
	switch (e.k) {
		case 'num':
			return String(e.v);
		case 'str':
			return `"${e.v}"`;
		case 'ref':
			return e.a;
		case 'cmp':
		case 'bin':
			return `${show(e.l)}${e.op}${show(e.r)}`;
		case 'fn':
			return `${e.name}(${e.args.map(show).join(';')})`;
	}
}

type Cells = Record<string, Cell>;

function compare(op: Op, a: number, b: number): boolean {
	return op === '=' ? a === b : op === '<>' ? a !== b : op === '<' ? a < b : op === '<=' ? a <= b : op === '>' ? a > b : a >= b;
}

function evalExpr(e: Expr, cells: Cells): Val {
	switch (e.k) {
		case 'num':
		case 'str':
			return e.v;
		case 'ref':
			return cells[e.a];
		case 'cmp': {
			const a = evalExpr(e.l, cells);
			const b = evalExpr(e.r, cells);
			if (typeof a !== 'number' || typeof b !== 'number') throw new Error('confronto tra valori non numerici');
			return compare(e.op, a, b);
		}
		case 'bin': {
			const a = evalExpr(e.l, cells) as number;
			const b = evalExpr(e.r, cells) as number;
			return e.op === '+' ? a + b : e.op === '-' ? a - b : a * b;
		}
		case 'fn': {
			if (e.name === 'SE') return evalExpr(e.args[0], cells) === true ? evalExpr(e.args[1], cells) : evalExpr(e.args[2], cells);
			const vs = e.args.map((x) => evalExpr(x, cells));
			if (e.name === 'E') return vs.every((v) => v === true);
			if (e.name === 'O') return vs.some((v) => v === true);
			return vs[0] !== true;
		}
	}
}

const logic = (b: boolean) => (b ? 'VERO' : 'FALSO');
const valOpt = (v: Val): ChoiceOption => (typeof v === 'number' ? numOpt(v) : textOpt(typeof v === 'boolean' ? logic(v) : v));
const valTex = (v: Val): string => valOpt(v).latex;

/** `B3>=6` on a cell holding 7, as a line of a worked solution: "7 ≥ 6 è vero". */
function cmpWords(e: Expr, cells: Cells): string {
	if (e.k !== 'cmp') throw new Error('cmpWords');
	const a = evalExpr(e.l, cells);
	const b = evalExpr(e.r, cells);
	return `$${a} ${OP_TEX[e.op]} ${b}$ è ${evalExpr(e, cells) === true ? 'vero' : 'falso'}`;
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	params: Record<string, unknown>;
}

const para = (text: string): string => block([text]);
const addr = (col: number, row: number) => `${COLS[col]}${row}`;
const cellsOf = (header: string[], rows: Cell[][]): Cells => {
	const out: Cells = {};
	[header, ...rows].forEach((r, i) => r.forEach((c, j) => (out[addr(j, i + 1)] = c)));
	return out;
};

// ---------------------------------------------------------------------------
// Level 1: which comparison is true

function level1(rng: Rng): Built {
	const [c1, c2] = rng.pick([
		['A1', 'B1'],
		['A2', 'B2'],
		['B3', 'C3'],
		['C1', 'D1'],
		['A4', 'B4'],
	]);
	const a = rng.int(2, 12);
	let b = a;
	if (rng.next() >= 0.3) while (b === a) b = rng.int(2, 12);
	const cells: Cells = { [c1]: a, [c2]: b };
	const want = rng.next() < 0.5;
	const near = [...new Set([a - 1, a, a + 1, b - 1, b, b + 1])];
	const pool: Expr[] = [];
	for (const op of OPS) {
		pool.push(cmp(ref(c1), op, ref(c2)), cmp(ref(c2), op, ref(c1)));
		for (const n of near) pool.push(cmp(ref(c1), op, num(n)), cmp(ref(c2), op, num(n)));
	}
	const mixed = shuffle(rng, pool);
	const right = mixed.find((e) => evalExpr(e, cells) === want)!;
	const others: Expr[] = [];
	const ops = new Set([(right as { op: Op }).op]);
	// first the formulas with an operator not used yet, so the four options show different operators
	for (const pass of [0, 1])
		for (const e of mixed) {
			if (others.length >= 3 || e.k !== 'cmp' || evalExpr(e, cells) === want || others.includes(e)) continue;
			if (pass === 0 && ops.has(e.op)) continue;
			ops.add(e.op);
			others.push(e);
		}
	const f = (e: Expr) => `=${show(e)}`;
	const choice = choose(rng, formulaOpt(f(right)), others.map((e) => formulaOpt(f(e))));
	const byFormula = new Map([right, ...others].map((e) => [f(e), e]));
	return {
		prompt: 'Scegli la formula.',
		problem: block([`In un foglio di calcolo la cella ${ttIn(c1)} contiene $${a}$ e la cella ${ttIn(c2)} contiene $${b}$. Quale di queste formule dà come risultato ${logic(want)}?`]),
		solution: ttLine(f(right)),
		steps: [
			...choice.options.map((o) => {
				const e = byFormula.get(o.values[0])!;
				return para(`${ttIn(o.values[0])}: ${cmpWords(e, cells)}, quindi la formula dà ${logic(evalExpr(e, cells) === true)}.`);
			}),
			para(`La sola formula che dà ${logic(want)} è ${ttIn(f(right))}.`),
		],
		answer: choice,
		params: { case: want ? 'vero' : 'falso', cells, formulas: choice.options.map((o) => o.values[0]) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: SE

const CITIES = ['Roma', 'Milano', 'Bari', 'Torino', 'Napoli', 'Genova', 'Pisa', 'Lecce', 'Trento', 'Parma'];

interface Theme {
	head: [string, string];
	intro: string;
	rows: readonly string[];
	lo: number;
	hi: number;
	step: number;
}

const VOTI: Theme = { head: ['Nome', 'Voto'], intro: 'i voti di una verifica', rows: NAMES, lo: 3, hi: 10, step: 1 };
const PUNTI: Theme = { head: ['Nome', 'Punti'], intro: 'i punti di un torneo', rows: NAMES, lo: 2, hi: 30, step: 1 };
const ASSENZE: Theme = { head: ['Nome', 'Assenze'], intro: 'le ore di assenza del mese', rows: NAMES, lo: 0, hi: 20, step: 1 };
const GRADI: Theme = { head: ['Città', 'Gradi'], intro: 'la temperatura a mezzogiorno, in gradi', rows: CITIES, lo: 8, hi: 36, step: 1 };
const SPESA: Theme = { head: ['Cliente', 'Spesa'], intro: 'la spesa di ogni cliente, in euro', rows: NAMES, lo: 20, hi: 90, step: 5 };

interface Se2 {
	theme: Theme;
	thresholds: number[];
	/** The operators that make sense for the theme (a mark of 6 is a pass); all four when absent. */
	ops?: Op[];
	/** Label when the value is high, label when it is low; or a numeric result built on the cell. */
	high: string | ((cell: Expr) => Expr);
	low: string | ((cell: Expr) => Expr);
}

const SE2: Se2[] = [
	{ theme: VOTI, thresholds: [6], ops: ['>=', '<'], high: 'promosso', low: 'bocciato' },
	{ theme: PUNTI, thresholds: [15, 18, 20], high: 'premio', low: 'niente' },
	{ theme: ASSENZE, thresholds: [8, 10, 12], high: 'avviso', low: 'ok' },
	{ theme: GRADI, thresholds: [20, 25, 30], high: 'caldo', low: 'mite' },
	{ theme: SPESA, thresholds: [40, 50, 60], high: (c) => ({ k: 'bin', op: '-', l: c, r: num(10) }), low: (c) => c },
	{ theme: PUNTI, thresholds: [10, 12, 20], high: (c) => ({ k: 'bin', op: '+', l: c, r: num(5) }), low: (c) => c },
];

/** A value of the theme: `at` with probability `p` (the boundary, where > and >= differ), else anywhere on the grid. */
function value(rng: Rng, th: Theme, at: number, p: number): number {
	if (rng.next() < p) return at;
	return th.lo + th.step * rng.int(0, Math.floor((th.hi - th.lo) / th.step));
}

function table(rng: Rng, th: Theme, n: number, askRow: number, at: number, p: number): { header: string[]; rows: Cell[][] } {
	const labels = pickDistinct(rng, th.rows, n);
	const rows: Cell[][] = labels.map((l, i) => [l, value(rng, th, at, i === askRow - 2 ? p : 0.15)]);
	return { header: [...th.head], rows };
}

const branch = (x: string | ((cell: Expr) => Expr), cell: Expr): Expr => (typeof x === 'string' ? str(x) : x(cell));

function level2(rng: Rng): Built {
	const s = rng.int(0, SE2.length - 1);
	const S = SE2[s];
	const thr = rng.pick(S.thresholds);
	const op = rng.pick<Op>(S.ops ?? ['>=', '>', '<', '<=']);
	const row = rng.int(2, 5);
	const { header, rows } = table(rng, S.theme, 4, row, thr, 0.35);
	const cells = cellsOf(header, rows);
	const cell = ref(addr(1, row));
	const up = op === '>=' || op === '>';
	const cond = cmp(cell, op, num(thr));
	const e = fn('SE', cond, branch(up ? S.high : S.low, cell), branch(up ? S.low : S.high, cell));
	const formula = `=${show(e)}`;
	const out = addr(2, row);
	const result = evalExpr(e, cells);
	const truth = evalExpr(cond, cells) === true;
	const thenV = evalExpr(e.k === 'fn' ? e.args[1] : e, cells);
	const elseV = evalExpr(e.k === 'fn' ? e.args[2] : e, cells);
	const choice = choose(rng, valOpt(result), [valOpt(truth ? elseV : thenV), textOpt('VERO'), textOpt('FALSO')]);
	const x = cells[addr(1, row)];
	return {
		prompt: 'Calcola il risultato della formula.',
		problem: block([`Nel foglio la colonna ${ttIn('B')} contiene ${S.theme.intro}.`, sheet(header, rows), `Nella cella ${ttIn(out)} c'è la formula`, raw(ttLine(formula)), `Che cosa compare nella cella ${ttIn(out)}?`]),
		solution: valTex(result),
		steps: [
			para(`La cella ${ttIn(addr(1, row))} contiene $${x}$. La condizione è ${ttIn(show(cond))}: ${cmpWords(cond, cells)}, quindi vale ${logic(truth)}.`),
			para(`La condizione è ${truth ? 'vera' : 'falsa'}: la funzione SE restituisce il ${truth ? 'secondo' : 'terzo'} argomento, ${ttIn(show(e.k === 'fn' ? e.args[truth ? 1 : 2] : e))}.`),
			...(typeof result === 'number' && typeof S.high !== 'string' ? [para(`Con ${ttIn(addr(1, row))} uguale a $${x}$ il risultato è $${result}$.`)] : []),
		],
		answer: choice,
		params: { case: `${typeof S.high === 'string' ? 'testo' : 'numero'}-${truth ? 'vero' : 'falso'}`, theme: s, formula, cell: out, boundary: x === thr },
	};
}

// ---------------------------------------------------------------------------
// Level 3: nested SE

interface Bands {
	theme: Theme;
	cuts: [number, number][];
	labels: [string, string, string]; // low, middle, high
}

const BANDS: Bands[] = [
	{ theme: VOTI, cuts: [[6, 8]], labels: ['scarso', 'buono', 'ottimo'] },
	{ theme: PUNTI, cuts: [[10, 20], [12, 24], [15, 25]], labels: ['bronzo', 'argento', 'oro'] },
	{ theme: GRADI, cuts: [[15, 25], [18, 28], [12, 24]], labels: ['freddo', 'mite', 'caldo'] },
	{ theme: { head: ['Nome', 'Età'], intro: "l'età di chi compra un biglietto", rows: NAMES, lo: 6, hi: 30, step: 1 }, cuts: [[14, 18], [12, 18], [10, 16]], labels: ['ridotto', 'giovani', 'intero'] },
];

type Shape3 = 'decrescente' | 'crescente' | 'trappola';

function level3(rng: Rng): Built {
	const s = rng.int(0, BANDS.length - 1);
	const B = BANDS[s];
	const [lo, hi] = rng.pick(B.cuts);
	const [L, M, H] = B.labels;
	const r = rng.next();
	const shape: Shape3 = r < 0.4 ? 'decrescente' : r < 0.8 ? 'crescente' : 'trappola';
	const row = rng.int(2, 4);
	const cell = ref(addr(1, row));
	const th = B.theme;
	// the asked value: one of five zones, the two boundaries more often; in the trap, mostly above the higher cut
	const zone = shape === 'trappola' && rng.next() < 0.7 ? rng.pick([3, 4]) : rng.pick([0, 1, 1, 2, 3, 3, 4]);
	const asked = [rng.int(th.lo, lo - 1), lo, rng.int(lo + 1, hi - 1), hi, rng.int(hi + 1, th.hi)][zone];
	const labels = pickDistinct(rng, th.rows, 3);
	const rows: Cell[][] = labels.map((l, i) => [l, i === row - 2 ? asked : value(rng, th, lo, 0.1)]);
	const header = [...th.head];
	const cells = cellsOf(header, rows);
	const inner =
		shape === 'decrescente' ? fn('SE', cmp(cell, '>=', num(lo)), str(M), str(L)) : shape === 'crescente' ? fn('SE', cmp(cell, '<', num(hi)), str(M), str(H)) : fn('SE', cmp(cell, '>=', num(hi)), str(H), str(L));
	const outer =
		shape === 'decrescente' ? fn('SE', cmp(cell, '>=', num(hi)), str(H), inner) : shape === 'crescente' ? fn('SE', cmp(cell, '<', num(lo)), str(L), inner) : fn('SE', cmp(cell, '>=', num(lo)), str(M), inner);
	if (outer.k !== 'fn' || inner.k !== 'fn') throw new Error('level3');
	const line1 = `=SE(${show(outer.args[0])};${show(outer.args[1])};`;
	const line2 = `${show(inner)})`;
	const result = evalExpr(outer, cells) as string;
	const first = evalExpr(outer.args[0], cells) === true;
	const out = addr(2, row);
	const steps = [para(`La cella ${ttIn(addr(1, row))} contiene $${asked}$. Prima condizione, ${ttIn(show(outer.args[0]))}: ${cmpWords(outer.args[0], cells)}.`)];
	if (first) steps.push(para(`La prima condizione è vera: la formula restituisce subito ${ttIn(show(outer.args[1]))} e il secondo SE non viene nemmeno guardato.`));
	else {
		const second = evalExpr(inner.args[0], cells) === true;
		steps.push(para(`La prima condizione è falsa: si passa al secondo SE, con la condizione ${ttIn(show(inner.args[0]))}: ${cmpWords(inner.args[0], cells)}.`));
		steps.push(para(`Il secondo SE restituisce il suo ${second ? 'secondo' : 'terzo'} argomento, ${ttIn(show(inner.args[second ? 1 : 2]))}.`));
	}
	return {
		prompt: 'Calcola il risultato della formula.',
		problem: block([`Nel foglio la colonna ${ttIn('B')} contiene ${th.intro}.`, sheet(header, rows), `Nella cella ${ttIn(out)} c'è la formula`, raw(ttLine(line1)), raw(ttLine(line2)), `Che cosa compare nella cella ${ttIn(out)}?`]),
		solution: valTex(result),
		steps,
		answer: choose(rng, textOpt(result), [...shuffle(rng, [L, M, H].filter((x) => x !== result)).map((x) => textOpt(x)), textOpt('VERO')]),
		params: { case: shape, theme: s, formula: line1 + line2, cell: out, zone },
	};
}

// ---------------------------------------------------------------------------
// Level 4: E, O, NON inside a SE

interface Pair {
	head: [string, string, string];
	intro: string;
	lo: number;
	hi: number;
	thresholds: number[];
}

const PAIRS: Pair[] = [
	{ head: ['Nome', 'Scritto', 'Orale'], intro: "i voti dello scritto e dell'orale", lo: 3, hi: 10, thresholds: [6, 7, 8] },
	{ head: ['Nome', 'Gara 1', 'Gara 2'], intro: 'i punti di due gare', lo: 4, hi: 20, thresholds: [10, 12, 15] },
	{ head: ['Nome', 'Andata', 'Ritorno'], intro: "i gol segnati all'andata e al ritorno", lo: 0, hi: 5, thresholds: [2, 3] },
];
const LABELS4: [string, string][] = [['premio', 'niente'], ['passa', 'no'], ['ok', 'no']];
type Shape4 = 'E' | 'O' | 'NON' | 'intervallo';

function level4(rng: Rng): Built {
	const p = rng.int(0, PAIRS.length - 1);
	const P = PAIRS[p];
	const r = rng.next();
	const shape: Shape4 = r < 0.32 ? 'E' : r < 0.64 ? 'O' : r < 0.82 ? 'NON' : 'intervallo';
	const row = rng.int(2, 5);
	const b = ref(addr(1, row));
	const c = ref(addr(2, row));
	const t1 = rng.pick(P.thresholds);
	const t2 = rng.next() < 0.6 ? t1 : rng.pick(P.thresholds);
	const op1 = rng.pick<Op>(['>=', '>=', '>', '<', '<=']);
	const op2 = rng.next() < 0.7 ? op1 : rng.pick<Op>(['>=', '>', '<', '<=']);
	let cond: Expr;
	if (shape === 'E' || shape === 'O') cond = fn(shape, cmp(b, op1, num(t1)), cmp(c, op2, num(t2)));
	else if (shape === 'NON') cond = fn('NON', cmp(b, op1, num(t1)));
	else {
		const lo = rng.pick(P.thresholds.slice(0, -1));
		const hi = rng.pick(P.thresholds.filter((x) => x > lo));
		cond = fn('E', cmp(b, '>=', num(lo)), cmp(b, '<=', num(hi)));
	}
	const fits = LABELS4.filter(([y, n]) => `=SE(${show(cond)};"${y}";"${n}")`.length <= MAX_LINE);
	const [yes, no] = rng.pick(fits.slice(0, 2));
	const e = fn('SE', cond, str(yes), str(no));
	const names = pickDistinct(rng, NAMES, 4);
	// the asked row: for each condition a truth value is drawn first (E mostly all true, O mostly all false, so that
	// neither function has a typical answer), then a value near the threshold that gives it
	const conds = cond.k === 'fn' ? cond.args : [];
	const allSame = (shape === 'E' || shape === 'O') && rng.next() < 0.45 ? shape === 'E' : null;
	const wanted = conds.map(() => allSame ?? rng.next() < 0.5);
	const around = (e: Expr, want: boolean, fallback: number): number => {
		if (e.k !== 'cmp' || e.r.k !== 'num') return fallback;
		const thr = e.r.v;
		const ok = [thr, thr, thr - 1, thr + 1, thr - 2, thr + 2, thr - 3, thr + 3].filter((x) => x >= P.lo && x <= P.hi && compare(e.op, x, thr) === want);
		return ok.length ? rng.pick(ok) : fallback;
	};
	const askedB = shape === 'intervallo' ? around(conds[rng.int(0, 1)], rng.next() < 0.6, t1) : around(conds[0], wanted[0], t1);
	const askedC = shape === 'E' || shape === 'O' ? around(conds[1], wanted[1], t2) : rng.int(P.lo, P.hi);
	const rows: Cell[][] = names.map((n, i) => (i === row - 2 ? [n, askedB, askedC] : [n, rng.int(P.lo, P.hi), rng.int(P.lo, P.hi)]));
	const header = [...P.head];
	const cells = cellsOf(header, rows);
	const out = addr(3, row);
	const formula = `=${show(e)}`;
	const truth = evalExpr(cond, cells) === true;
	const result = evalExpr(e, cells) as string;
	if (cond.k !== 'fn') throw new Error('level4');
	const parts = cond.args.map((x) => `${ttIn(show(x))}: ${cmpWords(x, cells)}`);
	const why =
		shape === 'NON'
			? `NON rovescia il valore: ${ttIn(show(cond))} vale ${logic(truth)}.`
			: cond.name === 'E'
				? `E dà VERO solo se tutte le condizioni sono vere: ${ttIn(show(cond))} vale ${logic(truth)}.`
				: `O dà VERO se almeno una condizione è vera: ${ttIn(show(cond))} vale ${logic(truth)}.`;
	return {
		prompt: 'Calcola il risultato della formula.',
		problem: block([`Nel foglio le colonne ${ttIn('B')} e ${ttIn('C')} contengono ${P.intro}.`, sheet(header, rows), `Nella cella ${ttIn(out)} c'è la formula`, raw(ttLine(formula)), `Che cosa compare nella cella ${ttIn(out)}?`]),
		solution: valTex(result),
		steps: [para(`Nella riga $${row}$: ${parts.join('; ')}.`), para(why), para(`La funzione SE restituisce quindi il ${truth ? 'secondo' : 'terzo'} argomento, ${ttIn(`"${result}"`)}.`)],
		answer: choose(rng, textOpt(result), [textOpt(truth ? no : yes), textOpt('VERO'), textOpt('FALSO')]),
		params: { case: `${shape}-${truth ? 'vero' : 'falso'}`, pair: p, formula, cell: out },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: CONTA.SE and SOMMA.SE

interface Data {
	head: [string, string, string];
	what: string; // what the number column holds
	groups: string[];
	lo: number;
	hi: number;
	step: number;
}

const DATA: Data[] = [
	{ head: ['Nome', 'Classe', 'Punti'], what: 'i punti di un torneo tra classi', groups: ['1A', '1B', '1C'], lo: 2, hi: 20, step: 1 },
	{ head: ['Nome', 'Squadra', 'Gol'], what: 'i gol segnati in un torneo', groups: ['Rossi', 'Verdi', 'Blu'], lo: 0, hi: 9, step: 1 },
	{ head: ['Cliente', 'Città', 'Euro'], what: 'gli acquisti di un negozio, in euro', groups: ['Roma', 'Bari', 'Pisa'], lo: 5, hi: 60, step: 5 },
	{ head: ['Nome', 'Sport', 'Ore'], what: 'le ore di allenamento della settimana', groups: ['nuoto', 'calcio', 'tennis'], lo: 1, hi: 12, step: 1 },
];
const N_ROWS = 6;
const RANGE_B = `B2:B${N_ROWS + 1}`;
const RANGE_C = `C2:C${N_ROWS + 1}`;

/** A criterion: on the numbers of column C (an operator and a number), or on the text of column B. */
type Crit = { on: 'C'; op: Op; n: number } | { on: 'B'; group: string };

const critText = (c: Crit): string => (c.on === 'B' ? `"${c.group}"` : c.op === '=' ? String(c.n) : `"${c.op}${c.n}"`);
const matches = (c: Crit, row: Cell[]): boolean => (c.on === 'B' ? row[1] === c.group : compare(c.op, row[2] as number, c.n));
const count = (c: Crit, rows: Cell[][]): number => rows.filter((r) => matches(c, r)).length;
const sum = (c: Crit, rows: Cell[][]): number => rows.filter((r) => matches(c, r)).reduce((a, r) => a + (r[2] as number), 0);
const contaSe = (c: Crit): string => `=CONTA.SE(${c.on === 'B' ? RANGE_B : RANGE_C};${critText(c)})`;
const sommaSe = (c: Crit): string => (c.on === 'B' ? `=SOMMA.SE(${RANGE_B};${critText(c)};${RANGE_C})` : `=SOMMA.SE(${RANGE_C};${critText(c)})`);
const critWords = (c: Crit): string => (c.on === 'B' ? `nella colonna ${ttIn('B')} c'è ${ttIn(c.group)}` : `il valore della colonna ${ttIn('C')} è ${OP_WORDS[c.op]} $${c.n}$`);
const swapStrict = (c: Crit): Crit => (c.on === 'C' && ['<', '<=', '>', '>='].includes(c.op) ? { ...c, op: ({ '<': '<=', '<=': '<', '>': '>=', '>=': '>' } as Record<string, Op>)[c.op] } : c);

function dataTable(rng: Rng, D: Data): { header: string[]; rows: Cell[][]; pivot: number } {
	const names = pickDistinct(rng, NAMES, N_ROWS);
	const grid = (D.hi - D.lo) / D.step;
	const pivot = D.lo + D.step * rng.int(Math.ceil(grid * 0.3), Math.floor(grid * 0.7));
	// every group at least once; the pivot value once or twice, so that > and >= count differently
	const groups = shuffle(rng, [...D.groups, ...Array.from({ length: N_ROWS - D.groups.length }, () => rng.pick(D.groups))]);
	const values = shuffle(rng, [pivot, rng.next() < 0.5 ? pivot : D.lo + D.step * rng.int(0, grid), ...Array.from({ length: N_ROWS - 2 }, () => D.lo + D.step * rng.int(0, grid))]);
	return { header: [...D.head], rows: names.map((n, i) => [n, groups[i], values[i]]), pivot };
}

function randomCrit(rng: Rng, D: Data, pivot: number, textShare: number): Crit {
	if (rng.next() < textShare) return { on: 'B', group: rng.pick(D.groups) };
	return { on: 'C', op: rng.pick<Op>(['>=', '>', '<', '<=', '>=', '<', '=', '<>']), n: pivot };
}

function matchingRows(c: Crit, rows: Cell[][]): string {
	const hit = rows.map((r, i) => (matches(c, r) ? i + 2 : 0)).filter(Boolean);
	return hit.length === 0 ? 'nessuna riga' : hit.length === 1 ? `la riga $${hit[0]}$` : `le righe $${hit.slice(0, -1).join('$, $')}$ e $${hit.at(-1)}$`;
}

function valueLevel(rng: Rng, level: 5 | 6): Built {
	const d = rng.int(0, DATA.length - 1);
	const D = DATA[d];
	const { header, rows, pivot } = dataTable(rng, D);
	const isSum = level === 6;
	const out = `C${N_ROWS + 3}`;
	const head = [`Il foglio contiene ${D.what}.`, sheet(header, rows)];
	if (rng.next() < 0.65) {
		const c = randomCrit(rng, D, pivot, isSum ? 0.5 : 0.3);
		const formula = isSum ? sommaSe(c) : contaSe(c);
		const v = isSum ? sum(c, rows) : count(c, rows);
		const hit = rows.filter((r) => matches(c, r)).map((r) => r[2] as number);
		const steps = [para(`Il criterio ${ttIn(critText(c))} sceglie le righe in cui ${critWords(c)}: ${matchingRows(c, rows)}.`)];
		if (isSum) steps.push(para(hit.length > 1 ? `SOMMA.SE somma i valori della colonna ${ttIn('C')} in quelle righe: $${hit.join(' + ')} = ${v}$.` : `SOMMA.SE somma i valori della colonna ${ttIn('C')} in quelle righe: il risultato è $${v}$.`));
		else steps.push(para(`CONTA.SE conta le celle che rispettano il criterio: sono $${v}$.`));
		return {
			prompt: 'Calcola il risultato della formula.',
			problem: block([...head, `Nella cella ${ttIn(out)} c'è la formula`, raw(ttLine(formula)), `Quale numero compare nella cella ${ttIn(out)}?`]),
			solution: String(v),
			steps,
			answer: { kind: 'number', value: String(v) },
			params: { case: `valore-${c.on === 'B' ? 'testo' : 'numero'}`, data: d, formula, cell: out, mistakes: mistakes(c, rows, isSum) },
		};
	}
	// which formula gives the result: four formulas with four different results
	const numeric: Crit[] = (['>=', '>', '<', '<=', '<>', '='] as Op[]).map((op) => ({ on: 'C', op, n: pivot }));
	const cands: { f: string; v: number; note: string }[] = isSum
		? [
				...numeric.map((c) => ({ f: sommaSe(c), v: sum(c, rows), note: `somma le celle in cui ${critWords(c)}` })),
				...numeric.slice(0, 4).map((c) => ({ f: contaSe(c), v: count(c, rows), note: `conta, e non somma, le celle in cui ${critWords(c)}` })),
				{ f: `=SOMMA(${RANGE_C})`, v: rows.reduce((a, r) => a + (r[2] as number), 0), note: 'somma tutti i valori, senza condizione' },
			]
		: [
				...numeric.map((c) => ({ f: contaSe(c), v: count(c, rows), note: `conta le celle in cui ${critWords(c)}` })),
				...D.groups.map((g) => ({ f: contaSe({ on: 'B', group: g }), v: count({ on: 'B', group: g }, rows), note: `conta le celle della colonna ${ttIn('B')} uguali a ${ttIn(g)}` })),
			];
	const picked: typeof cands = [];
	for (const x of shuffle(rng, cands)) if (picked.length < 4 && x.f.length <= MAX_OPTION && !picked.some((y) => y.v === x.v)) picked.push(x);
	if (picked.length < 4) throw new Error('retry');
	const right = picked[0];
	const choice = choose(rng, formulaOpt(right.f), picked.slice(1).map((x) => formulaOpt(x.f)));
	const byF = new Map(picked.map((x) => [x.f, x]));
	return {
		prompt: 'Scegli la formula.',
		problem: block([...head, `Quale di queste formule dà come risultato $${right.v}$?`]),
		solution: ttLine(right.f),
		steps: [
			...choice.options.map((o) => {
				const x = byF.get(o.values[0])!;
				return para(`${ttIn(x.f)} ${x.note}: dà $${x.v}$.`);
			}),
			para(`La formula che dà $${right.v}$ è ${ttIn(right.f)}.`),
		],
		answer: choice,
		params: { case: 'formula', data: d, target: right.v },
	};
}

/** What a student gets by counting instead of summing, by reading > as >=, by taking the other rows, or all of them. */
function mistakes(c: Crit, rows: Cell[][], isSum: boolean): number[] {
	const f = isSum ? sum : count;
	const g = isSum ? count : sum;
	const all = isSum ? rows.reduce((a, r) => a + (r[2] as number), 0) : rows.length;
	return [f(swapStrict(c), rows), g(c, rows), all - f(c, rows), all, all - f(swapStrict(c), rows)];
}

const level5 = (rng: Rng): Built => valueLevel(rng, 5);
const level6 = (rng: Rng): Built => valueLevel(rng, 6);

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
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

/** The formula lines of a problem, as they are typeset. */
const formulaLines = (problem: string): string[] => [...problem.matchAll(/\\small\\texttt\{((?:[^{}]|\\[{}])*)\}/g)].map((m) => m[1]);

function check(sample: Sample): string[] {
	const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	const v = commonViolations(sample.problem, sample.steps, sample.solution, ch);
	if (sample.answer.kind !== 'choice' && sample.answer.kind !== 'number') v.push('la risposta deve essere una scelta o un numero');
	if (sample.answer.kind === 'number' && !/^\d+$/.test(sample.answer.value)) v.push('il numero deve essere un intero non negativo');
	for (const f of formulaLines(sample.problem)) if (f.length > MAX_LINE) v.push(`formula troppo lunga per una riga: ${f}`);
	for (const o of ch?.options ?? []) if (o.latex.startsWith('\\small\\texttt') && o.values[0].length > MAX_OPTION) v.push(`formula troppo lunga per un'opzione: ${o.values[0]}`);
	if (/[àèéìòù]/.test(formulaLines(sample.problem).join(''))) v.push('lettere accentate in una formula');
	return v;
}

export const infFunzioniLogiche: Generator = {
	id: ID,
	title: 'Condizioni e funzioni logiche',
	levels: {
		1: { label: 'Confronti: VERO o FALSO', constraints: ['due celle con numeri da 2 a 12, quattro confronti con =, <>, <, <=, >, >=: uno solo dà il valore chiesto'] },
		2: { label: 'La funzione SE', constraints: ['un SE con una soglia su una cella di una tabella di quattro righe; risultato di testo o numerico; il valore sulla soglia in circa un terzo dei casi'] },
		3: { label: 'SE annidati: le fasce', constraints: ["due SE annidati, tre fasce; soglie decrescenti con >=, crescenti con <, oppure nell'ordine sbagliato (circa 1 su 5)"] },
		4: { label: 'E, O, NON', constraints: ['un SE con E, O o NON su due colonne; risultato tra due etichette, distrattori VERO e FALSO'] },
		5: { label: 'CONTA.SE', constraints: ['tabella di sei righe; il valore di CONTA.SE con criterio numerico o di testo, oppure la formula che dà un risultato'] },
		6: { label: 'SOMMA.SE', constraints: ['tabella di sei righe; il valore di SOMMA.SE a due o tre argomenti, oppure la formula che dà un risultato'] },
	},
	generate,
	check,
	toChoice,
};

export default infFunzioniLogiche;
