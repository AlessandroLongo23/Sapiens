/**
 * Celle, valori e formule. Spec: specs/exercises/excel.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/23-excel.md): cells and ranges; a formula
 * with two references; precedence of the operations; brackets and powers; automatic recalculation; the errors of a
 * formula. Every exercise is built on a small generated sheet; the value comes from the evaluator of inf-foglio.ts
 * and the checker recomputes it with its own.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Node,
	type Sheet,
	BANNED,
	addr,
	cellValue,
	choiceViolations,
	choose,
	code,
	codeOpt,
	colName,
	decimalsOf,
	isTerminating,
	n$,
	numTex,
	numberChoice,
	numberOf,
	parseFormula,
	parseRef,
	problemTex,
	rangeCells,
	shuffle,
	step,
	tableTex,
	textOpt,
} from '../inf-foglio';

export const ID = 'excel';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	value?: Rational;
	choice?: ChoiceAnswer;
	mistakes?: (Rational | null)[];
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Arithmetic shown in the steps

type NumNode = Exclude<Node, { t: 'ref' | 'range' | 'name' | 'call' }>;

function numeric(n: Node, sheet: Sheet): NumNode {
	switch (n.t) {
		case 'num':
			return n;
		case 'ref': {
			const v = cellValue(sheet, addr(n.ref.col, n.ref.row));
			return { t: 'num', v: v.k === 'num' ? v.v : q(0) };
		}
		case 'bin':
			return { ...n, l: numeric(n.l, sheet), r: numeric(n.r, sheet) };
		case 'neg':
		case 'par':
			return { ...n, x: numeric(n.x, sheet) };
		default:
			throw new Error('numeric: only arithmetic');
	}
}

const OP_TEX = { '+': '+', '-': '-', '*': '\\cdot', '/': ':' } as const;

function tex(n: NumNode, guard = false): string {
	switch (n.t) {
		case 'num':
			return guard && n.v.sign() < 0 ? `(${numTex(n.v)})` : numTex(n.v);
		case 'par':
			return `(${tex(n.x as NumNode)})`;
		case 'neg':
			return `-${tex(n.x as NumNode, true)}`;
		default:
			if (n.op === '^') return `${tex(n.l as NumNode, true)}^{${tex(n.r as NumNode)}}`;
			return `${tex(n.l as NumNode)} ${OP_TEX[n.op]} ${tex(n.r as NumNode, true)}`;
	}
}

const apply = (op: string, a: Rational, b: Rational): Rational => {
	if (op === '+') return a.add(b);
	if (op === '-') return a.sub(b);
	if (op === '*') return a.mul(b);
	if (op === '/') return a.div(b);
	let acc = q(1);
	for (let i = 0; i < b.num; i++) acc = acc.mul(a);
	return acc;
};

/** One step of the calculation: the first operation, in the order of the tree, whose operands are numbers. */
function reduce(n: NumNode): NumNode | null {
	if (n.t === 'num') return null;
	if (n.t === 'par' || n.t === 'neg') {
		const x = n.x as NumNode;
		if (x.t === 'num') return { t: 'num', v: n.t === 'neg' ? x.v.neg() : x.v };
		const r = reduce(x);
		// a bracket left around a single number is dropped at once: (7 + 7)^2 = 14^2
		if (r && r.t === 'num' && n.t === 'par') return r;
		return r ? { ...n, x: r } : null;
	}
	const l = reduce(n.l as NumNode);
	if (l) return { ...n, l };
	const r = reduce(n.r as NumNode);
	if (r) return { ...n, r };
	return { t: 'num', v: apply(n.op, (n.l as { v: Rational }).v, (n.r as { v: Rational }).v) };
}

/** 8 + 3 \cdot 4 = 8 + 12 = 20 */
function chain(formula: string, sheet: Sheet): string {
	let cur: NumNode | null = numeric(parseFormula(formula), sheet);
	const out: string[] = [];
	while (cur) {
		// a bracket around a single number is dropped at once
		const shown = tex(cur);
		if (out.at(-1) !== shown) out.push(shown);
		cur = reduce(cur);
	}
	return out.join(' = ');
}

/** The value read from left to right, ignoring precedence and brackets, or from right to left. */
function flat(formula: string, sheet: Sheet, order: 'ltr' | 'rtl'): Rational | null {
	const parts = formula.slice(1).replace(/[()]/g, '').split(/([-+*/^])/);
	const vals = parts.filter((_, i) => i % 2 === 0).map((s) => numberOf(`=${s}`, sheet));
	const ops = parts.filter((_, i) => i % 2 === 1);
	if (vals.some((v) => v === null)) return null;
	const xs = vals as Rational[];
	try {
		if (order === 'ltr') return xs.slice(1).reduce((acc, x, i) => apply(ops[i], acc, x), xs[0]);
		let acc = xs[xs.length - 1];
		for (let i = xs.length - 2; i >= 0; i--) acc = apply(ops[i], xs[i], acc);
		return acc;
	} catch {
		return null;
	}
}

const safeNumber = (f: string, sheet: Sheet): Rational | null => {
	try {
		return numberOf(f, sheet);
	} catch {
		return null;
	}
};

const refsList = (formula: string): string[] => [...new Set(formula.match(/[A-Z]\d+/g) ?? [])];
const values = (formula: string, sheet: Sheet): string => refsList(formula).map((a) => `${code(a)} vale ${n$(numberOf(`=${a}`, sheet)!)}`).join(', ');

// ---------------------------------------------------------------------------
// Level 1: cells and ranges

function level1(rng: Rng): Built {
	const c1 = rng.int(0, 5);
	const r1 = rng.int(1, 12);
	const w = rng.int(1, 4);
	const h = rng.int(1, 6);
	if (w * h < 2) return level1(rng);
	const c2 = c1 + w - 1;
	const r2 = r1 + h - 1;
	const range = `${addr(c1, r1)}:${addr(c2, r2)}`;
	const colsTxt = w === 1 ? `una sola colonna, la ${code(colName(c1))}` : `le colonne da ${code(colName(c1))} a ${code(colName(c2))}, che sono $${w}$`;
	const rowsTxt = h === 1 ? `una sola riga, la $${r1}$` : `le righe da $${r1}$ a $${r2}$, che sono $${r2} - ${r1} + 1 = ${h}$`;
	if (rng.next() < 0.5) {
		return {
			prompt: "Rispondi alla domanda sull'intervallo.",
			problem: problemTex([`Quante celle contiene l'intervallo ${code(range)}?`]),
			solution: String(w * h),
			steps: [step(`L'intervallo prende ${colsTxt}, e ${rowsTxt}.`), step(`Le celle sono $${w} \\cdot ${h} = ${w * h}$.`)],
			value: q(w * h),
			mistakes: [(w - 1) * (h - 1) > 0 ? q((w - 1) * (h - 1)) : null, q(2), q(w + h), h > 1 ? q(w * (h - 1)) : null, w > 1 ? q((w - 1) * h) : null, q(w * h + 1)],
			params: { case: 'conta', range },
		};
	}
	const inside = rng.pick(rangeCells(parseRef(addr(c1, r1)), parseRef(addr(c2, r2))));
	const col = rng.int(c1, c2);
	const row = rng.int(r1, r2);
	const outside = shuffle(rng, [addr(c2 + 1, row), addr(col, r2 + 1), c1 > 0 ? addr(c1 - 1, row) : null, r1 > 1 ? addr(col, r1 - 1) : null, addr(c2 + 1, r2 + 1), addr(c2 + 2, row), addr(col, r2 + 2)]);
	const ins = parseRef(inside);
	return {
		prompt: "Rispondi alla domanda sull'intervallo.",
		problem: problemTex([`Quale di queste celle appartiene all'intervallo ${code(range)}?`]),
		solution: `\\texttt{${inside}}`,
		steps: [
			step(`L'intervallo prende ${colsTxt.replace(/, che sono .*/, '')}, e ${rowsTxt.replace(/, che sono .*/, '')}.`),
			step(`${code(inside)} sta nella colonna ${code(colName(ins.col))} e nella riga $${ins.row}$: è dentro l'intervallo. Le altre celle hanno la colonna o la riga fuori.`),
		],
		choice: choose(
			rng,
			codeOpt(inside),
			outside.map((a) => (a ? codeOpt(a) : null)),
		),
		params: { case: 'appartiene', range },
	};
}

// ---------------------------------------------------------------------------
// Levels 2-4: the value of a formula on a 3 x 3 sheet

const CELLS = [0, 1, 2].flatMap((c) => [1, 2, 3].map((r) => addr(c, r)));

function grid(rng: Rng, lo = 1, hi = 12): Sheet {
	const s: Sheet = {};
	for (const a of CELLS) s[a] = String(rng.int(lo, hi));
	return s;
}

const TEMPLATES: Record<number, string[]> = {
	2: ['a+b', 'a-b', 'a*b', 'a/b'],
	3: ['a+b*c', 'a-b*c', 'a+b/c', 'a-b/c', 'a*b-c*d', 'a+b*c-d', 'a/b+c*d', 'a-b+c', 'a/b*c', 'a-b-c'],
	4: ['(a+b)*c', 'a*(b-c)', '(a+b)/c', '(a-b)*(c+d)', 'a^2+b', 'a*b^2', '(a+b)^2', '(a+b+c)/3', 'a-b^2', '(a+b)/2', 'a/(b+c)', '2*(a+b)', 'a^3-b', '(a-b)^2'],
};

const fill = (tpl: string, cells: string[]): string => `=${tpl.replace(/[abcd]/g, (ch) => cells['abcd'.indexOf(ch)])}`;

function valueLevel(rng: Rng, level: 2 | 3 | 4): Built {
	for (;;) {
		const sheet = grid(rng);
		const tpl = rng.pick(TEMPLATES[level]);
		const cells = shuffle(rng, CELLS).slice(0, 4);
		const formula = fill(tpl, cells);
		const v = safeNumber(formula, sheet);
		if (v === null || !isTerminating(v) || decimalsOf(v) > 1 || Math.abs(v.num / v.den) > 200 || v.num / v.den < -50) continue;
		const ltr = flat(formula, sheet, 'ltr');
		const rtl = flat(formula, sheet, 'rtl');
		const mixed = /[-+]/.test(formula) && /[*/]/.test(formula);
		if (level === 3 && (mixed ? ltr === null || ltr.equals(v) : rtl === null || rtl.equals(v))) continue;
		const bare = safeNumber(formula.replace(/[()]/g, ''), sheet);
		if (level === 4 && formula.includes('(') && (bare === null || bare.equals(v))) continue;
		const timesTwo = formula.includes('^') ? safeNumber(formula.replace(/\^/g, '*'), sheet) : null;
		if (level === 4 && timesTwo && timesTwo.equals(v)) continue;
		// every intermediate result is a number with at most one decimal
		let shown: string;
		try {
			shown = chain(formula, sheet);
		} catch {
			continue;
		}
		if (/\{,\}\d{2,}/.test(shown)) continue;
		const target = addr(3, rng.int(1, 3));
		let mistakes: (Rational | null)[];
		if (level === 2) {
			// the other operation, a cell of the wrong row or column
			const swap = { '+': '*', '*': '+', '-': '/', '/': '-' }[tpl[1] as '+' | '-' | '*' | '/'];
			const [a, b] = cells.map(parseRef);
			const wrongCell = fill(tpl, [addr(a.row - 1, a.col + 1), cells[1]]);
			const wrongCell2 = fill(tpl, [cells[0], addr(b.row - 1, b.col + 1)]);
			mistakes = [safeNumber(fill(`a${swap}b`, cells), sheet), safeNumber(wrongCell, sheet), safeNumber(wrongCell2, sheet), tpl === 'a-b' || tpl === 'a/b' ? safeNumber(fill(`b${tpl[1]}a`, cells), sheet) : null];
		} else if (level === 3) mistakes = mixed ? [ltr, rtl] : [rtl, ltr];
		else mistakes = [bare, timesTwo, ltr, rtl];
		const how =
			level === 2
				? null
				: level === 3
					? mixed
						? 'Prima si fanno le moltiplicazioni e le divisioni, poi le addizioni e le sottrazioni.'
						: 'Le operazioni hanno la stessa precedenza: si fanno da sinistra a destra.'
					: formula.includes('(') && formula.includes('^')
						? 'Prima le parentesi, poi la potenza.'
						: formula.includes('(')
							? 'Prima si calcola quello che sta tra parentesi.'
							: 'Prima si calcola la potenza, poi le altre operazioni.';
		return {
			prompt: 'Calcola il valore della formula.',
			problem: problemTex(['In un foglio di calcolo ci sono questi numeri.', tableTex(sheet, 3, 3), `Nella cella ${code(target)} scrivi la formula ${code(formula)}. Che valore mostra la cella?`]),
			solution: numTex(v),
			steps: [step(`Leggi le celle della formula: ${values(formula, sheet)}.`), ...(how ? [step(how)] : []), shown],
			value: v,
			mistakes: mistakes.map((m) => (m && !m.equals(v) ? m : null)),
			params: { sheet, formula, target, template: tpl },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: recalculation

function level5(rng: Rng): Built {
	for (;;) {
		const sheet: Sheet = {};
		let cols: number, rows: number, asked: string, changed: string, mid: string;
		const kind = rng.next() < 0.5 ? 'catena' : 'totale';
		if (kind === 'catena') {
			sheet.A1 = String(rng.int(2, 12));
			sheet.B1 = String(rng.int(2, 12));
			sheet.C1 = `=A1${rng.pick(['+', '-', '*'])}B1`;
			sheet.D1 = rng.next() < 0.7 ? `=C1${rng.pick(['*', '+', '-'])}${rng.int(2, 10)}` : `=C1${rng.pick(['+', '-'])}${rng.pick(['A1', 'B1'])}`;
			[cols, rows, asked, mid] = [4, 1, 'D1', 'C1'];
			changed = rng.pick(['A1', 'B1']);
		} else {
			const op = rng.pick(['*', '*', '+']);
			for (let r = 1; r <= 3; r++) {
				sheet[`A${r}`] = String(rng.int(2, 9));
				sheet[`B${r}`] = String(rng.int(2, 9));
				sheet[`C${r}`] = `=A${r}${op}B${r}`;
			}
			sheet.C4 = '=C1+C2+C3';
			[cols, rows, asked] = [3, 4, 'C4'];
			const r = rng.int(1, 3);
			changed = `${rng.pick(['A', 'B'])}${r}`;
			mid = `C${r}`;
		}
		const oldRaw = sheet[changed];
		const newRaw = String(rng.int(2, 12));
		if (newRaw === oldRaw) continue;
		const before = numberOf(`=${asked}`, sheet)!;
		const midBefore = numberOf(`=${mid}`, sheet)!;
		const after: Sheet = { ...sheet, [changed]: newRaw };
		const v = numberOf(`=${asked}`, after)!;
		const midAfter = numberOf(`=${mid}`, after)!;
		if (v.equals(before) || Math.abs(v.num) > 300 || v.num < -50 || midAfter.equals(v)) continue;
		const delta = q(Number(newRaw) - Number(oldRaw));
		return {
			prompt: 'Trova il valore dopo il ricalcolo.',
			problem: problemTex([
				'In questo foglio le celle che cominciano con = contengono formule.',
				tableTex(sheet, cols, rows),
				`Nella cella ${code(changed)}, al posto di $${oldRaw}$, scrivi $${newRaw}$. Che valore mostra ora la cella ${code(asked)}?`,
			]),
			solution: numTex(v),
			steps: [
				step(`Il foglio ricalcola tutte le formule che dipendono da ${code(changed)}, una dopo l'altra.`),
				step(`${code(mid)} contiene ${code(sheet[mid])}: passa da $${numTex(midBefore)}$ a $${chainOf(sheet[mid], after)}$.`),
				step(`${code(asked)} contiene ${code(sheet[asked])} e usa il nuovo valore: $${chainOf(sheet[asked], after)}$.`),
			],
			value: v,
			// not recalculated; only the first formula; the change added to the old result
			mistakes: [before, midAfter, before.add(delta), midBefore],
			params: { sheet, changed, value: newRaw, asked, case: kind },
		};
	}
}

const chainOf = (formula: string, sheet: Sheet): string => chain(formula, sheet);

// ---------------------------------------------------------------------------
// Level 6: errors

export const ERRORS = ['#DIV/0!', '#VALORE!', '#NOME?', 'riferimento circolare'] as const;
const LABELS = ['Pane', 'Latte', 'Uova', 'Mele', 'Riso', 'Pasta', 'Olio', 'Sale', 'Pere', 'Miele', 'Farina', 'Burro'];
const WRONG_NAMES = ['SOMA', 'SOMME', 'MEDI', 'TOTALE', 'SUMMA'];
const WORDS = ['prezzo', 'iva', 'totale', 'sconto', 'costo'];

function level6(rng: Rng): Built {
	const sheet: Sheet = {};
	const labels = shuffle(rng, LABELS).slice(0, 3);
	for (let r = 1; r <= 3; r++) {
		sheet[`A${r}`] = labels[r - 1];
		sheet[`B${r}`] = String(rng.int(2, 40));
		sheet[`C${r}`] = String(rng.int(1, 9));
	}
	const kind = rng.pick(['div0', 'valore', 'nome', 'circolare'] as const);
	const [i, j, k] = shuffle(rng, [1, 2, 3]);
	const target = `D${rng.int(1, 3)}`;
	const pm = () => rng.pick(['+', '-', '*']);
	let formula: string, why: string;
	if (kind === 'div0') {
		const how = rng.int(0, 2);
		if (how === 0) {
			sheet[`C${j}`] = '0';
			formula = `=B${i}/C${j}`;
			why = `${code(`C${j}`)} vale $0$: la formula chiede una divisione per zero.`;
		} else if (how === 1) {
			delete sheet[`C${j}`];
			formula = `=B${i}/C${j}`;
			why = `${code(`C${j}`)} è vuota, e una cella vuota in un calcolo vale $0$: la formula chiede una divisione per zero.`;
		} else {
			sheet[`C${k}`] = sheet[`C${j}`];
			formula = `=B${i}/(C${j}-C${k})`;
			why = `${code(`C${j}`)} e ${code(`C${k}`)} hanno lo stesso valore, quindi la parentesi vale $0$: la formula chiede una divisione per zero.`;
		}
	} else if (kind === 'valore') {
		formula = rng.pick([`=A${i}${pm()}B${j}`, `=B${i}${pm()}A${j}`, `=A${i}*C${j}+B${k}`, `=B${i}+C${j}+A${k}`]);
		const a = /A\d/.exec(formula)![0];
		why = `${code(a)} contiene un testo (${sheet[a]}), e con un testo non si possono fare calcoli.`;
	} else if (kind === 'nome') {
		const how = rng.int(0, 2);
		if (how === 0) {
			formula = rng.next() < 0.5 ? `=B${i}${pm()}C` : `=B${pm()}C${j}`;
			why = `Nella formula c'è un riferimento senza il numero di riga: il foglio lo legge come un nome che non conosce.`;
		} else if (how === 1) {
			const name = rng.pick(WRONG_NAMES);
			formula = `=${name}(B1:B3)`;
			why = `${code(name)} non è il nome di una funzione: il foglio non lo riconosce.`;
		} else {
			const word = rng.pick(WORDS);
			formula = rng.next() < 0.5 ? `=${word}*C${j}` : `=B${i}${pm()}${word}`;
			why = `Nella formula c'è la parola ${code(word)}, che non è né un riferimento né una funzione: il foglio non la riconosce.`;
		}
	} else {
		formula = rng.pick([`=B${i}${pm()}${target}`, `=${target}*C${j}`, `=B${i}+C${j}+${target}`, `=${target}+1`]);
		why = `La formula sta nella cella ${code(target)} e usa ${code(target)}: per calcolare il valore servirebbe il valore stesso.`;
	}
	const name = kind === 'div0' ? ERRORS[0] : kind === 'valore' ? ERRORS[1] : kind === 'nome' ? ERRORS[2] : ERRORS[3];
	const opt = (e: string) => (e.startsWith('#') ? codeOpt(e) : textOpt(e));
	return {
		prompt: "Riconosci l'errore della formula.",
		problem: problemTex(['In un foglio di calcolo ci sono questi dati.', tableTex(sheet, 3, 3), `Nella cella ${code(target)} scrivi la formula ${code(formula)}. Quale errore segnala il foglio?`]),
		solution: opt(name).latex,
		steps: [step(why), step(name.startsWith('#') ? `Nella cella compare ${code(name)}.` : 'Il foglio segnala un riferimento circolare.')],
		choice: choose(
			rng,
			opt(name),
			ERRORS.filter((e) => e !== name).map(opt),
		),
		params: { sheet, formula, target, case: kind },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: (rng) => valueLevel(rng, 2),
	3: (rng) => valueLevel(rng, 3),
	4: (rng) => valueLevel(rng, 4),
	5: level5,
	6: level6,
};

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const params = { ...b.params } as Record<string, unknown>;
		if (b.value) {
			const ch = tryChoice(rng, b);
			if (!ch) continue;
			params.options = ch.options.map((o) => o.values[0]);
			params.correct = ch.correct;
		}
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.value ? { kind: 'number', value: b.value.toString() } : b.choice!,
			params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function tryChoice(rng: Rng, b: Built): ChoiceAnswer | null {
	try {
		const ch = numberChoice(rng, b.value!, b.mistakes ?? []);
		// a count of cells is a positive whole number
		if (b.params.case === 'conta' && ch.options.some((o) => !/^[1-9]\d*$/.test(o.values[0]))) return null;
		return ch;
	} catch {
		return null;
	}
}

/** The choice is fixed at generation (params.options), so that it does not depend on a second seed. */
function toChoice(sample: Sample): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const options = sample.params.options as string[];
	return { kind: 'choice', options: options.map((v) => ({ latex: numTex(Rational.parse(v)), values: [v] })), correct: sample.params.correct as number };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	v.push(...choiceViolations(toChoice(sample)));
	const p = sample.params;
	if (sample.level >= 2 && sample.level <= 4) {
		const val = numberOf(p.formula as string, p.sheet as Sheet);
		if (!val || sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('la risposta non è il valore della formula');
		else if (decimalsOf(val) > 1) v.push('più di un decimale');
	}
	if (sample.level === 5) {
		const after = { ...(p.sheet as Sheet), [p.changed as string]: p.value as string };
		const val = numberOf(`=${p.asked}`, after);
		if (!val || sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('la risposta non è il valore ricalcolato');
		if (val && numberOf(`=${p.asked}`, p.sheet as Sheet)!.equals(val)) v.push('il valore non cambia');
	}
	if (sample.level === 6) {
		const sheet = { ...(p.sheet as Sheet), [p.target as string]: p.formula as string };
		const val = cellValue(sheet, p.target as string);
		const expected = val.k === 'err' ? (val.e === 'circolare' ? 'riferimento circolare' : val.e) : null;
		if (sample.answer.kind !== 'choice' || sample.answer.options[sample.answer.correct].values[0] !== expected) v.push("l'errore indicato non è quello della formula");
	}
	return v;
}

export const excel: Generator = {
	id: ID,
	title: 'Celle, valori e formule',
	levels: {
		1: { label: 'Celle e intervalli', constraints: ['quante celle ha un intervallo (colonne da A a I, righe fino a 17), oppure quale cella gli appartiene'] },
		2: { label: 'Una formula con i riferimenti', constraints: ['due celle di un foglio 3 x 3 e una operazione tra +, -, *, /; risultato con al più un decimale'] },
		3: { label: 'Le precedenze', constraints: ['tre o quattro celle senza parentesi; leggere da sinistra a destra (o da destra a sinistra) cambia il risultato'] },
		4: { label: 'Parentesi e potenze', constraints: ['parentesi o potenze con esponente 2 o 3; togliere le parentesi o leggere ^ come * cambia il risultato'] },
		5: { label: 'Il ricalcolo', constraints: ['due formule in catena o tre prodotti con il totale; cambia una cella e il valore chiesto cambia'] },
		6: { label: 'Gli errori', constraints: ['#DIV/0!, #VALORE!, #NOME?, riferimento circolare: uno su quattro ciascuno'] },
	},
	generate,
	check,
	toChoice,
};

export default excel;
