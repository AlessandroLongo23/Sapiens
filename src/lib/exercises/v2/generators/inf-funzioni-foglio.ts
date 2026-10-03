/**
 * Le funzioni del foglio di calcolo. Spec: specs/exercises/inf-funzioni-foglio.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/25-inf-funzioni-foglio.md): SOMMA and
 * MEDIA on a range; MIN, MAX and CONTA.NUMERI; ranges with empty cells and texts; several arguments and rectangular
 * ranges; ARROTONDA; nested functions. Every exercise is a formula on a small generated sheet; the value comes from
 * the evaluator of inf-foglio.ts and the distractors from the formula a typical mistake would compute.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Sheet,
	BANNED,
	addr,
	cellValue,
	choiceViolations,
	code,
	decimalsOf,
	isTerminating,
	n$,
	numTex,
	numberChoice,
	numberOf,
	parseRef,
	problemTex,
	rangeCells,
	roundTo,
	step,
	tableTex,
	truncTo,
} from '../inf-foglio';

export const ID = 'inf-funzioni-foglio';

interface Built {
	formula: string;
	sheet: Sheet;
	cols: number;
	rows: number;
	steps: string[];
	/** Formulas (or numbers) a mistake would compute. */
	mistakes: (string | Rational | null)[];
	case: string;
	/** The sample is not usable (the rounding changes nothing). */
	skip?: boolean;
	/** The first mistake may give the right value (then it is just left out). */
	free?: boolean;
}

const TEXTS = ['assente', 'n.d.', 'rinviato'];

function grid(rng: Rng, cols: number, rows: number, lo: number, hi: number): Sheet {
	const s: Sheet = {};
	for (let c = 0; c < cols; c++) for (let r = 1; r <= rows; r++) s[addr(c, r)] = String(rng.int(lo, hi));
	return s;
}

/** A piece of a column (at least `min` cells) or a whole row of the table. */
function segment(rng: Rng, cols: number, rows: number, min = 3, rowToo = true): { range: string; cells: string[]; whole: string } {
	if (rowToo && rng.next() < 0.25) {
		const r = rng.int(1, rows);
		const range = `${addr(0, r)}:${addr(cols - 1, r)}`;
		return { range, cells: cellsOf(range), whole: range };
	}
	const c = rng.int(0, cols - 1);
	const len = rng.int(min, rows);
	const r1 = rng.int(1, rows - len + 1);
	const range = `${addr(c, r1)}:${addr(c, r1 + len - 1)}`;
	return { range, cells: cellsOf(range), whole: `${addr(c, 1)}:${addr(c, rows)}` };
}

function cellsOf(range: string): string[] {
	const [a, b] = range.split(':').map(parseRef);
	return rangeCells(a, b);
}

const ends = (range: string): string => range.replace(':', ';');
const numbersIn = (sheet: Sheet, cells: string[]): Rational[] => cells.map((c) => cellValue(sheet, c)).flatMap((v) => (v.k === 'num' ? [v.v] : []));
const guard = (r: Rational): string => (r.sign() < 0 ? `(${numTex(r)})` : numTex(r));
const sumTex = (xs: Rational[]): string => xs.map((x, i) => (i === 0 ? numTex(x) : guard(x))).join(' + ');
const total = (xs: Rational[]): Rational => xs.reduce((s, x) => s.add(x), q(0));
const listTex = (xs: Rational[]): string => xs.map((x) => `$${numTex(x)}$`).join(', ');

/** How a function works on the numbers of its range, in words and numbers. */
function explain(name: string, xs: Rational[]): string {
	const s = total(xs);
	if (name === 'SOMMA') return `${code('SOMMA')} li addiziona: $${sumTex(xs)} = ${numTex(s)}$.`;
	if (name === 'MEDIA') return `${code('MEDIA')} li addiziona e divide per quanti sono: $${numTex(s)} : ${xs.length} = ${approx(s.div(q(xs.length)))}$.`;
	if (name === 'CONTA.NUMERI') return `${code('CONTA.NUMERI')} conta quanti sono: $${xs.length}$.`;
	const m = xs.reduce((a, b) => ((name === 'MIN' ? b.compare(a) < 0 : b.compare(a) > 0) ? b : a));
	return `${code(name)} prende il più ${name === 'MIN' ? 'piccolo' : 'grande'}: $${numTex(m)}$.`;
}

/** A number as the steps show it: exact when short, otherwise cut with dots. */
function approx(v: Rational, keep = 4): string {
	return isTerminating(v) && decimalsOf(v) <= keep ? numTex(v) : `${numTex(truncTo(v, keep))}\\ldots`;
}

function roundingText(v: Rational, n: number): string {
	const shifted = v.abs().mul(q(10 ** (n + 1)));
	const digit = Math.floor(shifted.num / shifted.den) % 10;
	const where = n === 0 ? 'Senza cifre decimali si guarda la prima cifra dopo la virgola' : n === 1 ? 'Con $1$ cifra decimale si guarda la seconda cifra dopo la virgola' : 'Con $2$ cifre decimali si guarda la terza cifra dopo la virgola';
	return `${where}: è $${digit}$, ${digit >= 5 ? "quindi l'ultima cifra tenuta aumenta di uno" : "quindi l'ultima cifra tenuta non cambia"}. Il risultato è $${numTex(roundTo(v, n))}$.`;
}

const rangeIntro = (sheet: Sheet, range: string): string => `L'intervallo ${code(range)} contiene ${listTex(numbersIn(sheet, cellsOf(range)))}.`;

// ---------------------------------------------------------------------------
// Levels

function level1(rng: Rng): Built {
	const [cols, rows] = [3, rng.int(4, 5)];
	const sheet = grid(rng, cols, rows, 1, 20);
	const { range, cells, whole } = segment(rng, cols, rows);
	const name = rng.pick(['SOMMA', 'MEDIA']);
	const xs = numbersIn(sheet, cells);
	return {
		formula: `=${name}(${range})`,
		sheet,
		cols,
		rows,
		steps: [step(rangeIntro(sheet, range)), step(explain(name, xs))],
		mistakes: name === 'SOMMA' ? [`=SOMMA(${ends(range)})`, whole !== range ? `=SOMMA(${whole})` : null, `=MEDIA(${range})`, `=SOMMA(${range})-${cells[cells.length - 1]}`] : [`=SOMMA(${range})`, `=MEDIA(${ends(range)})`, `=SOMMA(${range})/${cells.length - 1}`, whole !== range ? `=MEDIA(${whole})` : null],
		case: name,
	};
}

function level2(rng: Rng): Built {
	const [cols, rows] = [3, rng.int(4, 5)];
	const sheet = rng.next() < 0.35 ? grid(rng, cols, rows, -9, 12) : grid(rng, cols, rows, 1, 30);
	const { range, cells, whole } = segment(rng, cols, rows);
	const name = rng.pick(['MIN', 'MAX', 'CONTA.NUMERI']);
	const xs = numbersIn(sheet, cells);
	const other = name === 'MIN' ? 'MAX' : 'MIN';
	const smallestAbs = xs.reduce((a, b) => (b.abs().compare(a.abs()) < 0 ? b : a));
	return {
		formula: `=${name}(${range})`,
		sheet,
		cols,
		rows,
		steps: [step(rangeIntro(sheet, range)), step(explain(name, xs))],
		mistakes:
			name === 'CONTA.NUMERI'
				? [`=SOMMA(${range})`, q(2), `=MAX(${range})`, q(cells.length - 1), q(cols * rows)]
				: [`=${other}(${range})`, name === 'MIN' ? smallestAbs : null, `=${cells[0]}`, `=${cells[cells.length - 1]}`, whole !== range ? `=${name}(${whole})` : null, `=${name}(${ends(range)})`],
		case: name,
	};
}

function level3(rng: Rng): Built {
	const [cols, rows] = [3, rng.int(4, 5)];
	const sheet = grid(rng, cols, rows, 2, 20);
	const { range, cells } = segment(rng, cols, rows, 4, false);
	const holes = rng.int(1, cells.length >= 5 ? 2 : 1);
	const text = rng.pick(TEXTS);
	const kinds: string[] = [];
	for (let i = 0; i < holes; i++) {
		const c = cells[rng.int(0, cells.length - 1)];
		if (!/^\d+$/.test(sheet[c] ?? '')) return level3(rng);
		if (rng.next() < 0.5) {
			delete sheet[c];
			kinds.push('vuota');
		} else {
			sheet[c] = text;
			kinds.push('testo');
		}
	}
	const name = rng.pick(['MEDIA', 'MEDIA', 'CONTA.NUMERI', 'MIN', 'SOMMA']);
	const xs = numbersIn(sheet, cells);
	const what = holes === 1 ? (kinds[0] === 'vuota' ? 'una cella vuota' : 'una cella con un testo') : kinds[0] === kinds[1] ? (kinds[0] === 'vuota' ? 'due celle vuote' : 'due celle con un testo') : 'una cella vuota e una con un testo';
	const skip = `Nell'intervallo ${code(range)} c'è ${what}: la funzione ${holes === 1 ? 'la salta' : 'le salta'}. I numeri sono ${listTex(xs)}.`;
	const n = cells.length;
	return {
		formula: `=${name}(${range})`,
		sheet,
		cols,
		rows,
		steps: [step(skip), step(explain(name, xs))],
		mistakes: name === 'MEDIA' ? [`=SOMMA(${range})/${n}`, `=SOMMA(${range})`, `=SOMMA(${range})/${n - holes - 1 || 1}`] : name === 'CONTA.NUMERI' ? [q(n), `=SOMMA(${range})`, q(holes), q(n + 1)] : name === 'MIN' ? [q(0), `=MAX(${range})`, q(xs.length)] : [q(xs.length), `=MEDIA(${range})`, `=SOMMA(${range})+${holes}`],
		case: name,
	};
}

function level4(rng: Rng): Built {
	const [cols, rows] = [3, rng.int(3, 4)];
	const sheet = grid(rng, cols, rows, 1, 15);
	const name = rng.pick(['SOMMA', 'SOMMA', 'MAX', 'MIN', 'MEDIA', 'CONTA.NUMERI']);
	const kind = rng.pick(['rettangolo', 'due', 'numero'] as const);
	let args: string, steps: string[], mistakes: (string | Rational | null)[];
	if (kind === 'rettangolo') {
		const c1 = rng.int(0, 1);
		const r1 = rng.int(1, rows - 1);
		const r2 = rng.int(r1 + 1, rows);
		const range = `${addr(c1, r1)}:${addr(c1 + 1, r2)}`;
		args = range;
		const firstCol = `${addr(c1, r1)}:${addr(c1, r2)}`;
		steps = [step(`${code(range)} è un rettangolo di $2$ colonne e $${r2 - r1 + 1}$ righe: contiene ${listTex(numbersIn(sheet, cellsOf(range)))}.`), step(explain(name, numbersIn(sheet, cellsOf(range))))];
		mistakes = [`=${name}(${ends(range)})`, `=${name}(${firstCol})`, `=${name}(${addr(c1 + 1, r1)}:${addr(c1 + 1, r2)})`];
	} else if (kind === 'due') {
		const len = rng.int(2, rows);
		const r1 = rng.int(1, rows - len + 1);
		const a = `A${r1}:A${r1 + len - 1}`;
		const b = `C${r1}:C${r1 + len - 1}`;
		args = `${a};${b}`;
		const xs = [...numbersIn(sheet, cellsOf(a)), ...numbersIn(sheet, cellsOf(b))];
		steps = [step(`Gli argomenti sono due intervalli, separati dal punto e virgola: ${code(a)} contiene ${listTex(numbersIn(sheet, cellsOf(a)))}; ${code(b)} contiene ${listTex(numbersIn(sheet, cellsOf(b)))}. La colonna ${code('B')} resta fuori.`), step(explain(name, xs))];
		mistakes = [`=${name}(A${r1}:C${r1 + len - 1})`, `=${name}(${a})`, `=${name}(${b})`];
	} else {
		const { range } = segment(rng, cols, rows, 2);
		const extra = String(rng.int(2, 20));
		args = `${range};${extra}`;
		const xs = [...numbersIn(sheet, cellsOf(range)), q(Number(extra))];
		steps = [step(`Gli argomenti sono due: l'intervallo ${code(range)}, che contiene ${listTex(numbersIn(sheet, cellsOf(range)))}, e il numero $${extra}$.`), step(explain(name, xs))];
		mistakes = [`=${name}(${range})`, `=${name}(${range})+${extra}`, `=${name}(${range})*${extra}`, `=${name}(${ends(range)};${extra})`];
	}
	return { formula: `=${name}(${args})`, sheet, cols, rows, steps, mistakes, case: kind, free: kind === 'numero' };
}

function level5(rng: Rng): Built {
	const sheet: Sheet = {};
	for (let c = 0; c < 3; c++) {
		sheet[addr(c, 1)] = `${rng.int(1, 30)},${String(rng.int(1, 999)).padStart(3, '0')}`.replace(/0+$/, '').replace(/,$/, ',5');
		sheet[addr(c, 2)] = String(rng.int(2, 15));
	}
	const n = rng.int(0, 2);
	const kind = rng.pick(['cella', 'cella', 'quoziente', 'prodotto'] as const);
	const c = rng.int(0, 2);
	const d = rng.int(0, 2);
	const inner = kind === 'cella' ? addr(c, 1) : kind === 'prodotto' ? `${addr(c, 1)}*${addr(d, 2)}` : `${addr(c, 2)}/${addr((c + 1 + rng.int(0, 1)) % 3, 2)}`;
	const formula = `=ARROTONDA(${inner};${n})`;
	const v = numberOf(`=${inner}`, sheet)!;
	const steps: string[] = [];
	if (kind === 'cella') steps.push(step(`Il numero da arrotondare è quello di ${code(inner)}: ${n$(v)}.`));
	else steps.push(step(`Prima si calcola il primo argomento: ${code(inner)} vale $${approx(v)}$.`));
	steps.push(step(roundingText(v, n)));
	const r = roundTo(v, n);
	const unit = q(1, 10 ** n);
	return {
		formula,
		sheet,
		cols: 3,
		rows: 2,
		steps,
		mistakes: [truncTo(v, n), truncTo(v, n).add(unit), n > 0 ? roundTo(v, n - 1) : roundTo(v, 1), n < 2 ? roundTo(v, n + 1) : null, r.sub(unit)],
		case: kind,
		skip: r.equals(v),
		free: true,
	};
}

function level6(rng: Rng): Built {
	const [cols, rows] = [3, 4];
	const sheet = grid(rng, cols, rows, 2, 20);
	const kind = rng.pick(['arrotonda-media', 'escursione', 'somma-su-conta', 'max-di-somme', 'somma-meno', 'arrotonda-quoziente'] as const);
	const col = (c: number) => `${addr(c, 1)}:${addr(c, rows)}`;
	const c = rng.int(0, 2);
	const r = col(c);
	const xs = () => numbersIn(sheet, cellsOf(r));
	let formula: string, steps: string[], mistakes: (string | Rational | null)[];
	let skip = false;
	if (kind === 'arrotonda-media') {
		const n = rng.int(0, 1);
		if (rng.next() < 0.5) delete sheet[addr(c, rng.int(1, rows))];
		formula = `=ARROTONDA(MEDIA(${r});${n})`;
		const m = total(xs()).div(q(xs().length));
		steps = [step(`Si parte dalla funzione più interna. ${rangeIntro(sheet, r)} ${explain('MEDIA', xs())}`), step(`Poi ${code('ARROTONDA')} lavora su quel valore. ${roundingText(m, n)}`)];
		skip = roundTo(m, n).equals(m);
		mistakes = [truncTo(m, n), roundTo(m, n + 1), `=ARROTONDA(SOMMA(${r})/${rows};${n})`, truncTo(m, n).add(q(1, 10 ** n)), n > 0 ? roundTo(m, 0) : null];
	} else if (kind === 'escursione') {
		formula = `=MAX(${r})-MIN(${r})`;
		const hi = numberOf(`=MAX(${r})`, sheet)!;
		const lo = numberOf(`=MIN(${r})`, sheet)!;
		steps = [step(rangeIntro(sheet, r)), step(`Il più grande è ${n$(hi)}, il più piccolo è ${n$(lo)}: $${numTex(hi)} - ${numTex(lo)} = ${numTex(hi.sub(lo))}$.`)];
		mistakes = [`=MAX(${r})`, `=MAX(${r})+MIN(${r})`, `=${addr(c, 1)}-${addr(c, rows)}`, `=${addr(c, rows)}-${addr(c, 1)}`, `=MIN(${r})`];
	} else if (kind === 'somma-su-conta') {
		sheet[addr(c, rng.int(1, rows))] = rng.pick(TEXTS);
		formula = `=SOMMA(${r})/CONTA.NUMERI(${r})`;
		const s = total(xs());
		steps = [step(`Nell'intervallo ${code(r)} una cella contiene un testo e viene saltata: i numeri sono ${listTex(xs())}.`), step(`${code('SOMMA')} dà ${n$(s)}, ${code('CONTA.NUMERI')} dà $${xs().length}$: $${numTex(s)} : ${xs().length} = ${approx(s.div(q(xs().length)))}$.`)];
		mistakes = [`=SOMMA(${r})/${rows}`, `=SOMMA(${r})`, `=SOMMA(${r})/${rows - 2}`, `=CONTA.NUMERI(${r})`];
	} else if (kind === 'max-di-somme') {
		const [a, b] = [col(0), col(rng.int(1, 2))];
		const name = rng.pick(['MAX', 'MIN']);
		formula = `=${name}(SOMMA(${a});SOMMA(${b}))`;
		const [sa, sb] = [numberOf(`=SOMMA(${a})`, sheet)!, numberOf(`=SOMMA(${b})`, sheet)!];
		steps = [step(`Prima le due funzioni interne: ${code(`SOMMA(${a})`)} vale ${n$(sa)} e ${code(`SOMMA(${b})`)} vale ${n$(sb)}.`), step(`Poi ${code(name)} prende il più ${name === 'MAX' ? 'grande' : 'piccolo'} dei due: ${n$(numberOf(formula, sheet)!)}.`)];
		mistakes = [`=${name === 'MAX' ? 'MIN' : 'MAX'}(SOMMA(${a});SOMMA(${b}))`, `=${name}(${a};${b})`, `=SOMMA(${a};${b})`];
	} else if (kind === 'somma-meno') {
		const name = rng.pick(['MIN', 'MAX']);
		formula = `=SOMMA(${r})-${name}(${r})`;
		const s = total(xs());
		const m = numberOf(`=${name}(${r})`, sheet)!;
		steps = [step(rangeIntro(sheet, r)), step(`${code('SOMMA')} dà ${n$(s)} e ${code(name)} dà ${n$(m)}: $${numTex(s)} - ${numTex(m)} = ${numTex(s.sub(m))}$.`)];
		mistakes = [`=SOMMA(${r})`, `=SOMMA(${r})-${name === 'MIN' ? 'MAX' : 'MIN'}(${r})`, `=SOMMA(${r})+${name}(${r})`, `=${name}(${r})`];
	} else {
		const n = rng.int(0, 2);
		const k = rng.pick([3, 6, 7, 9, 11]);
		formula = `=ARROTONDA(SOMMA(${r})/${k};${n})`;
		const s = total(xs());
		const v = s.div(q(k));
		steps = [step(`Si parte dall'interno. ${rangeIntro(sheet, r)} ${explain('SOMMA', xs())}`), step(`Il primo argomento vale $${numTex(s)} : ${k} = ${approx(v)}$. ${roundingText(v, n)}`)];
		skip = roundTo(v, n).equals(v);
		mistakes = [truncTo(v, n), truncTo(v, n).add(q(1, 10 ** n)), n < 2 ? roundTo(v, n + 1) : roundTo(v, 1), s, n > 0 ? roundTo(v, 0) : null];
	}
	return { formula, sheet, cols, rows, steps, mistakes, case: kind, skip, free: kind.startsWith('arrotonda') };
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };
const MAX_DECIMALS = 2;

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 400; attempt++) {
		const b = make(rng);
		if (b.skip) continue;
		const v = numberOf(b.formula, b.sheet);
		if (!v || !isTerminating(v) || decimalsOf(v) > MAX_DECIMALS) continue;
		const wrong = b.mistakes.map((m) => (typeof m === 'string' ? numberOf(m, b.sheet) : m)).map((m) => (m && isTerminating(m) && decimalsOf(m) <= MAX_DECIMALS && !m.equals(v) ? m : null));
		// the typical mistake must give a different number
		if (!wrong[0] && !b.free) continue;
		let ch: ChoiceAnswer;
		try {
			ch = numberChoice(rng, v, wrong);
		} catch {
			continue;
		}
		// a count is a positive whole number, and so are its distractors
		if (b.formula.startsWith('=CONTA.NUMERI(') && ch.options.some((o) => !/^[1-9]\d*$/.test(o.values[0]))) continue;
		const target = addr(3, rng.int(1, 2));
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: 'Calcola il valore della formula.',
			problem: problemTex(['In un foglio di calcolo ci sono questi dati.', tableTex(b.sheet, b.cols, b.rows), `Nella cella ${code(target)} scrivi la formula ${code(b.formula)}. Che valore mostra la cella?`]),
			solution: numTex(v),
			steps: b.steps,
			answer: { kind: 'number', value: v.toString() },
			params: { sheet: b.sheet, formula: b.formula, target, case: b.case, options: ch.options.map((o) => o.values[0]), correct: ch.correct },
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample): ChoiceAnswer {
	const options = sample.params.options as string[];
	return { kind: 'choice', options: options.map((v) => ({ latex: numTex(Rational.parse(v)), values: [v] })), correct: sample.params.correct as number };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (sample.steps.length < 2) v.push('servono almeno due passaggi');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	v.push(...choiceViolations(toChoice(sample)));
	const p = sample.params;
	const formula = p.formula as string;
	const val = numberOf(formula, p.sheet as Sheet);
	if (!val || sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('la risposta non è il valore della formula');
	else if (decimalsOf(val) > MAX_DECIMALS) v.push('più di due decimali');
	const names = formula.match(/[A-Z.]{3,}(?=\()/g) ?? [];
	const holes = Object.values(p.sheet as Sheet).some((x) => !/^-?\d+(,\d+)?$/.test(x)) || Object.keys(p.sheet as Sheet).length % 3 !== 0;
	if (sample.level === 1 && !(names.length === 1 && ['SOMMA', 'MEDIA'].includes(names[0]))) v.push('livello 1: SOMMA o MEDIA');
	if (sample.level === 2 && !(names.length === 1 && ['MIN', 'MAX', 'CONTA.NUMERI'].includes(names[0]))) v.push('livello 2: MIN, MAX o CONTA.NUMERI');
	if (sample.level === 3 && !(names.length === 1 && holes)) v.push('livello 3: una funzione su un intervallo con celle vuote o testo');
	if (sample.level !== 3 && sample.level !== 6 && holes) v.push('celle vuote o testo fuori dai livelli 3 e 6');
	if (sample.level === 4 && !(names.length === 1 && (formula.includes(';') || /([A-Z])\d+:(?!\1)[A-Z]\d+/.test(formula)))) v.push('livello 4: più argomenti o un rettangolo');
	if (sample.level === 5 && !(names.length === 1 && names[0] === 'ARROTONDA')) v.push('livello 5: ARROTONDA');
	if (sample.level === 6 && names.length < 2) v.push('livello 6: almeno due funzioni');
	return v;
}

export const infFunzioniFoglio: Generator = {
	id: ID,
	title: 'Le funzioni del foglio di calcolo',
	levels: {
		1: { label: 'SOMMA e MEDIA', constraints: ['un intervallo in una colonna (da 3 celle) o in una riga, solo numeri interi; risultato con al più due decimali'] },
		2: { label: 'MIN, MAX e CONTA.NUMERI', constraints: ['un intervallo di soli numeri, in un caso su tre anche negativi'] },
		3: { label: 'Celle vuote e testo', constraints: ["una o due celle dell'intervallo sono vuote o contengono un testo: la funzione le salta"] },
		4: { label: 'Più argomenti', constraints: ['un rettangolo di due colonne, due intervalli separati dal punto e virgola, oppure un intervallo e un numero'] },
		5: { label: 'ARROTONDA', constraints: ['una cella con tre decimali, un prodotto o un quoziente, a 0, 1 o 2 cifre; il valore cambia con l’arrotondamento'] },
		6: { label: 'Funzioni annidate', constraints: ['una funzione dentro un’altra o due funzioni nella stessa formula'] },
	},
	generate,
	check,
	toChoice,
};

export default infFunzioniFoglio;
