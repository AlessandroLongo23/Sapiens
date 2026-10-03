/**
 * The spreadsheet of the informatics lessons "Il foglio di calcolo" (excel, inf-riferimenti-celle, inf-funzioni-foglio).
 *
 * A sheet is a map from an address ("B2") to what was typed in the cell, as the lessons write it: a number with the
 * decimal comma ("12,5"), a text ("Pane") or a formula ("=A1*$D$1"). Formulas use the Italian function names and the
 * semicolon between arguments (docs/lezioni/informatica/README.md). Here: addresses and ranges, a parser and an exact
 * evaluator for formulas with the errors of the lesson, the copy of a formula with relative, absolute and mixed
 * references, and the LaTeX of formulas (monospace), tables and prose for the exercise page.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { Rational, q } from './rational';

// ---------------------------------------------------------------------------
// Addresses

/** A reference: column 0-based (A = 0), row 1-based, each part relative or fixed with $. */
export interface Ref {
	col: number;
	row: number;
	absCol: boolean;
	absRow: boolean;
}

export const colName = (c: number): string => (c < 26 ? String.fromCharCode(65 + c) : colName(Math.floor(c / 26) - 1) + String.fromCharCode(65 + (c % 26)));
export const addr = (col: number, row: number): string => `${colName(col)}${row}`;
export const refStr = (r: Ref): string => `${r.absCol ? '$' : ''}${colName(r.col)}${r.absRow ? '$' : ''}${r.row}`;
export const rel = (col: number, row: number): Ref => ({ col, row, absCol: false, absRow: false });
export const abs = (col: number, row: number): Ref => ({ col, row, absCol: true, absRow: true });

export function parseRef(s: string): Ref {
	const m = /^(\$?)([A-Z]{1,2})(\$?)(\d+)$/.exec(s);
	if (!m) throw new Error(`parseRef: "${s}"`);
	let col = 0;
	for (const ch of m[2]) col = col * 26 + (ch.charCodeAt(0) - 64);
	return { col: col - 1, row: Number(m[4]), absCol: m[1] === '$', absRow: m[3] === '$' };
}

/** The addresses of a rectangular range, row by row. */
export function rangeCells(a: Ref, b: Ref): string[] {
	const out: string[] = [];
	for (let r = Math.min(a.row, b.row); r <= Math.max(a.row, b.row); r++) for (let c = Math.min(a.col, b.col); c <= Math.max(a.col, b.col); c++) out.push(addr(c, r));
	return out;
}

// ---------------------------------------------------------------------------
// Numbers with the decimal comma

/** A terminating decimal as it is typed in a cell or a formula: "12,5", "-3". */
export function numStr(r: Rational): string {
	const digits = decimalsOf(r);
	const scaled = Math.round((Math.abs(r.num) * 10 ** digits) / r.den);
	const s = String(scaled).padStart(digits + 1, '0');
	const whole = s.slice(0, s.length - digits);
	const frac = s.slice(s.length - digits);
	return `${r.num < 0 ? '-' : ''}${whole}${digits ? `,${frac}` : ''}`;
}

/** Number of decimals of a terminating decimal; throws for a periodic one. */
export function decimalsOf(r: Rational): number {
	let d = r.den;
	let two = 0;
	let five = 0;
	while (d % 2 === 0) {
		d /= 2;
		two++;
	}
	while (d % 5 === 0) {
		d /= 5;
		five++;
	}
	if (d !== 1) throw new Error(`decimalsOf: ${r} is not a terminating decimal`);
	return Math.max(two, five);
}

export const isTerminating = (r: Rational): boolean => {
	let d = r.den;
	while (d % 2 === 0) d /= 2;
	while (d % 5 === 0) d /= 5;
	return d === 1;
};

/** "12,5" -> 25/2. */
export function parseNum(s: string): Rational {
	const m = /^(-?)(\d+)(?:,(\d+))?$/.exec(s);
	if (!m) throw new Error(`parseNum: "${s}"`);
	const frac = m[3] ?? '';
	const v = q(Number(m[2] + frac), 10 ** frac.length);
	return m[1] ? v.neg() : v;
}

/** The number in a formula of the page: 12{,}5. */
export const numTex = (r: Rational): string => numStr(r).replace(',', '{,}');

/** Rounds half away from zero to n decimals, as ARROTONDA does. */
export function roundTo(r: Rational, n: number): Rational {
	const scale = q(10 ** Math.abs(n));
	const x = n >= 0 ? r.abs().mul(scale) : r.abs().div(scale);
	const floor = Math.floor(x.num / x.den);
	const up = x.sub(q(floor)).compare(q(1, 2)) >= 0 ? floor + 1 : floor;
	const v = n >= 0 ? q(up).div(scale) : q(up).mul(scale);
	return r.sign() < 0 ? v.neg() : v;
}

/** Cuts the decimals after the n-th, without rounding (the mistake of ARROTONDA read as a cut). */
export function truncTo(r: Rational, n: number): Rational {
	const scale = q(10 ** n);
	const x = r.abs().mul(scale);
	const v = q(Math.floor(x.num / x.den)).div(scale);
	return r.sign() < 0 ? v.neg() : v;
}

// ---------------------------------------------------------------------------
// Formulas

export type Node =
	| { t: 'num'; v: Rational }
	| { t: 'ref'; ref: Ref }
	| { t: 'range'; a: Ref; b: Ref }
	| { t: 'name'; name: string }
	| { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; l: Node; r: Node }
	| { t: 'neg'; x: Node }
	| { t: 'par'; x: Node }
	| { t: 'call'; name: string; args: Node[] };

type Tok = { k: 'num' | 'ref' | 'name' | 'sym'; s: string };

function tokens(src: string): Tok[] {
	const out: Tok[] = [];
	const re = /(\d+(?:,\d+)?)|(\$?[A-Z]{1,2}\$?\d+)(?![A-Za-z0-9.])|([A-Za-z][A-Za-z.]*)|([-+*/^():;])/y;
	let i = 0;
	while (i < src.length) {
		re.lastIndex = i;
		const m = re.exec(src);
		if (!m) throw new Error(`formula: unexpected "${src[i]}" in "${src}"`);
		out.push(m[1] ? { k: 'num', s: m[1] } : m[2] ? { k: 'ref', s: m[2] } : m[3] ? { k: 'name', s: m[3] } : { k: 'sym', s: m[4] });
		i = re.lastIndex;
	}
	return out;
}

/** Parses "=A1+B1*2". Precedence: ^, then * and /, then + and -; equal operators from left to right. */
export function parseFormula(src: string): Node {
	if (!src.startsWith('=')) throw new Error(`formula without =: "${src}"`);
	const ts = tokens(src.slice(1));
	let p = 0;
	const peek = (s: string) => ts[p]?.k === 'sym' && ts[p].s === s;
	const eat = (s: string) => {
		if (!peek(s)) throw new Error(`formula: expected "${s}" in "${src}"`);
		p++;
	};
	const atom = (): Node => {
		const tk = ts[p++];
		if (!tk) throw new Error(`formula: unexpected end of "${src}"`);
		if (tk.k === 'num') return { t: 'num', v: parseNum(tk.s) };
		if (tk.k === 'ref') {
			const a = parseRef(tk.s);
			if (peek(':')) {
				p++;
				const b = ts[p++];
				if (b?.k !== 'ref') throw new Error(`formula: bad range in "${src}"`);
				return { t: 'range', a, b: parseRef(b.s) };
			}
			return { t: 'ref', ref: a };
		}
		if (tk.k === 'name') {
			if (!peek('(')) return { t: 'name', name: tk.s };
			p++;
			const args: Node[] = [expr()];
			while (peek(';')) {
				p++;
				args.push(expr());
			}
			eat(')');
			return { t: 'call', name: tk.s, args };
		}
		if (tk.s === '(') {
			const x = expr();
			eat(')');
			return { t: 'par', x };
		}
		if (tk.s === '-') return { t: 'neg', x: power() };
		throw new Error(`formula: unexpected "${tk.s}" in "${src}"`);
	};
	const power = (): Node => {
		let l = atom();
		while (peek('^')) {
			p++;
			l = { t: 'bin', op: '^', l, r: atom() };
		}
		return l;
	};
	const term = (): Node => {
		let l = power();
		while (peek('*') || peek('/')) {
			const op = ts[p++].s as '*' | '/';
			l = { t: 'bin', op, l, r: power() };
		}
		return l;
	};
	function expr(): Node {
		let l = term();
		while (peek('+') || peek('-')) {
			const op = ts[p++].s as '+' | '-';
			l = { t: 'bin', op, l, r: term() };
		}
		return l;
	}
	const x = expr();
	if (p !== ts.length) throw new Error(`formula: trailing "${ts[p].s}" in "${src}"`);
	return x;
}

function body(n: Node): string {
	switch (n.t) {
		case 'num':
			return numStr(n.v);
		case 'ref':
			return refStr(n.ref);
		case 'range':
			return `${refStr(n.a)}:${refStr(n.b)}`;
		case 'name':
			return n.name;
		case 'bin':
			return `${body(n.l)}${n.op}${body(n.r)}`;
		case 'neg':
			return `-${body(n.x)}`;
		case 'par':
			return `(${body(n.x)})`;
		default:
			return `${n.name}(${n.args.map(body).join(';')})`;
	}
}

export const formulaStr = (n: Node): string => `=${body(n)}`;

function mapRefs(n: Node, f: (r: Ref) => Ref): Node {
	switch (n.t) {
		case 'ref':
			return { t: 'ref', ref: f(n.ref) };
		case 'range':
			return { t: 'range', a: f(n.a), b: f(n.b) };
		case 'bin':
			return { ...n, l: mapRefs(n.l, f), r: mapRefs(n.r, f) };
		case 'neg':
		case 'par':
			return { ...n, x: mapRefs(n.x, f) };
		case 'call':
			return { ...n, args: n.args.map((a) => mapRefs(a, f)) };
		default:
			return n;
	}
}

export function refsOf(n: Node): Ref[] {
	const out: Ref[] = [];
	mapRefs(n, (r) => {
		out.push(r);
		return r;
	});
	return out;
}

/** How a copy moves the parts of a reference. `true`: the correct rule (only the parts without $ move). */
export type ShiftRule = (r: Ref, dCol: number, dRow: number) => Ref;
export const COPY: ShiftRule = (r, dc, dr) => ({ ...r, col: r.absCol ? r.col : r.col + dc, row: r.absRow ? r.row : r.row + dr });

/**
 * The formula after a copy that moves it by dCol columns and dRow rows. Null when a reference would leave the sheet
 * (the program shows an error there; the exercises never ask it).
 */
export function copyFormula(src: string, dCol: number, dRow: number, rule: ShiftRule = COPY): string | null {
	let ok = true;
	const moved = mapRefs(parseFormula(src), (r) => {
		const s = rule(r, dCol, dRow);
		if (s.col < 0 || s.row < 1) ok = false;
		return s;
	});
	return ok ? formulaStr(moved) : null;
}

// ---------------------------------------------------------------------------
// Evaluation

export type Sheet = Record<string, string>;
export type ErrorName = '#DIV/0!' | '#VALORE!' | '#NOME?' | 'circolare';
export type Value = { k: 'num'; v: Rational } | { k: 'text'; s: string } | { k: 'empty' } | { k: 'err'; e: ErrorName };

export const FUNCTIONS = ['SOMMA', 'MEDIA', 'MIN', 'MAX', 'CONTA.NUMERI', 'ARROTONDA'] as const;
const NUM_RE = /^-?\d+(,\d+)?$/;
const err = (e: ErrorName): Value => ({ k: 'err', e });
const num = (v: Rational): Value => ({ k: 'num', v });

/** The value a cell shows. */
export function cellValue(sheet: Sheet, a: string, visiting: Set<string> = new Set()): Value {
	const raw = sheet[a];
	if (raw === undefined || raw === '') return { k: 'empty' };
	if (raw.startsWith('=')) {
		if (visiting.has(a)) return err('circolare');
		visiting.add(a);
		const v = evalNode(parseFormula(raw), sheet, visiting);
		visiting.delete(a);
		return v;
	}
	return NUM_RE.test(raw) ? num(parseNum(raw)) : { k: 'text', s: raw };
}

/** The numbers of an argument of a function: a range or a reference skips texts and empty cells. */
function numbersOf(n: Node, sheet: Sheet, visiting: Set<string>): Rational[] | ErrorName {
	const cells = n.t === 'range' ? rangeCells(n.a, n.b) : n.t === 'ref' ? [addr(n.ref.col, n.ref.row)] : null;
	if (cells) {
		const out: Rational[] = [];
		for (const c of cells) {
			const v = cellValue(sheet, c, visiting);
			if (v.k === 'err') return v.e;
			if (v.k === 'num') out.push(v.v);
		}
		return out;
	}
	const v = evalNode(n, sheet, visiting);
	if (v.k === 'err') return v.e;
	if (v.k === 'num') return [v.v];
	return v.k === 'empty' ? [] : '#VALORE!';
}

function scalar(n: Node, sheet: Sheet, visiting: Set<string>): Rational | ErrorName {
	const v = evalNode(n, sheet, visiting);
	if (v.k === 'err') return v.e;
	if (v.k === 'text') return '#VALORE!';
	return v.k === 'empty' ? q(0) : v.v;
}

export function evalNode(n: Node, sheet: Sheet, visiting: Set<string> = new Set()): Value {
	switch (n.t) {
		case 'num':
			return num(n.v);
		case 'ref':
			return cellValue(sheet, addr(n.ref.col, n.ref.row), visiting);
		case 'range':
			return err('#VALORE!');
		case 'name':
			return err('#NOME?');
		case 'par':
			return evalNode(n.x, sheet, visiting);
		case 'neg': {
			const x = scalar(n.x, sheet, visiting);
			return typeof x === 'string' ? err(x) : num(x.neg());
		}
		case 'bin': {
			const l = scalar(n.l, sheet, visiting);
			if (typeof l === 'string') return err(l);
			const r = scalar(n.r, sheet, visiting);
			if (typeof r === 'string') return err(r);
			if (n.op === '+') return num(l.add(r));
			if (n.op === '-') return num(l.sub(r));
			if (n.op === '*') return num(l.mul(r));
			if (n.op === '/') return r.isZero() ? err('#DIV/0!') : num(l.div(r));
			if (!r.isInteger() || r.num < 0 || r.num > 6) throw new Error('formula: exponent out of range');
			let acc = q(1);
			for (let i = 0; i < r.num; i++) acc = acc.mul(l);
			return num(acc);
		}
		default: {
			if (!(FUNCTIONS as readonly string[]).includes(n.name)) return err('#NOME?');
			if (n.name === 'ARROTONDA') {
				if (n.args.length !== 2) throw new Error('ARROTONDA: two arguments');
				const x = scalar(n.args[0], sheet, visiting);
				if (typeof x === 'string') return err(x);
				const d = scalar(n.args[1], sheet, visiting);
				if (typeof d === 'string') return err(d);
				if (!d.isInteger()) throw new Error('ARROTONDA: digits must be an integer');
				return num(roundTo(x, d.num));
			}
			const xs: Rational[] = [];
			for (const a of n.args) {
				const part = numbersOf(a, sheet, visiting);
				if (typeof part === 'string') return err(part);
				xs.push(...part);
			}
			if (n.name === 'CONTA.NUMERI') return num(q(xs.length));
			const sum = xs.reduce((s, x) => s.add(x), q(0));
			if (n.name === 'SOMMA') return num(sum);
			if (n.name === 'MEDIA') return xs.length ? num(sum.div(q(xs.length))) : err('#DIV/0!');
			if (!xs.length) return num(q(0));
			return num(xs.reduce((m, x) => ((n.name === 'MIN' ? x.compare(m) < 0 : x.compare(m) > 0) ? x : m)));
		}
	}
}

export const evalFormula = (src: string, sheet: Sheet): Value => evalNode(parseFormula(src), sheet);

/** The number a formula gives, or null when it gives a text or an error. */
export function numberOf(src: string, sheet: Sheet): Rational | null {
	try {
		const v = evalFormula(src, sheet);
		return v.k === 'num' ? v.v : v.k === 'empty' ? q(0) : null;
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// LaTeX for the page

const TT_ESCAPES: Record<string, string> = { $: '\\textdollar ', '#': '\\#', '^': '\\textasciicircum ', '%': '\\%', '&': '\\&', _: '\\_' };

/** Monospace text (a formula, an address, an error name): the body of a \texttt. No $ survives, so the page can split inline maths. */
export const ttBody = (s: string): string => s.replace(/[$#^%&_]/g, (c) => TT_ESCAPES[c]);
/** Monospace as a formula of its own (an option, a solution). */
export const tt = (s: string): string => `\\texttt{${ttBody(s)}}`;
/** Monospace inside prose. */
export const code = (s: string): string => `$${tt(s)}$`;
/** A number inside prose. */
export const n$ = (r: Rational): string => `$${numTex(r)}$`;

const cellTex = (raw: string | undefined): string => (raw === undefined || raw === '' ? '' : raw.startsWith('=') ? tt(raw) : NUM_RE.test(raw) ? raw.replace(',', '{,}') : `\\text{${raw}}`);

/** The sheet as a table with the column letters on top and the row numbers on the left. */
export function tableTex(sheet: Sheet, cols: number, rows: number, firstCol = 0, firstRow = 1): string {
	const head = ['', ...Array.from({ length: cols }, (_, c) => tt(colName(firstCol + c)))].join(' & ');
	const lines = Array.from({ length: rows }, (_, r) => [tt(String(firstRow + r)), ...Array.from({ length: cols }, (_, c) => cellTex(sheet[addr(firstCol + c, firstRow + r)]))].join(' & '));
	return `\\begin{array}{c|${Array(cols).fill('c').join('|')}} ${head} \\\\ \\hline ${lines.join(' \\\\ \\hline ')} \\end{array}`;
}

const visible = (s: string): number => s.replace(/\\[a-zA-Z]+\s?/g, '').replace(/\\(.)/g, '$1').replace(/[${}]/g, '').length;

/** Prose as \text lines of about `width` characters; inline $…$ pieces are never split. */
export function proseLines(prose: string, width = 46): string[] {
	const words = prose.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out.map((l) => `\\text{${l}}`);
}

/** A problem: paragraphs of prose and tables (strings that start with \begin), one under the other. */
export function problemTex(parts: string[]): string {
	const lines = parts.flatMap((p) => (p.startsWith('\\begin') ? [p] : proseLines(p)));
	return lines.length === 1 ? lines[0] : `\\begin{array}{l} ${lines.join(' \\\\ ')} \\end{array}`;
}

/** A step of the solution: prose with inline formulas, one \text. */
export const step = (prose: string): string => `\\text{${prose}}`;

export const BANNED = /—|piuttosto che/;

// ---------------------------------------------------------------------------
// Choices

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const a = [...xs];
	for (let i = a.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export const numOpt = (r: Rational): ChoiceOption => ({ latex: numTex(r), values: [r.toString()] });
export const codeOpt = (s: string): ChoiceOption => ({ latex: tt(s), values: [s] });
export const textOpt = (s: string): ChoiceOption => ({ latex: `\\text{${s}}`, values: [s] });

/** The right option, then the first three distractors that differ from every option before them; shuffled. */
export function choose(rng: Rng, right: ChoiceOption, others: (ChoiceOption | null)[]): ChoiceAnswer {
	const opts = [right];
	for (const o of others) {
		if (opts.length >= 4) break;
		if (!o || opts.some((x) => x.values.join('|') === o.values.join('|') || x.latex === o.latex)) continue;
		opts.push(o);
	}
	if (opts.length < 4) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Numbers near v, for filling a choice: v ± k units of its last decimal. */
export function near(rng: Rng, v: Rational): Rational[] {
	const unit = q(1, 10 ** decimalsOf(v));
	const ks = shuffle(rng, [1, 2, 3, -1, -2, -3, 10, -10]);
	return ks.map((k) => v.add(unit.mul(q(k))));
}

/** A number choice: the value, the mistakes that are numbers different from it, then near numbers. */
export function numberChoice(rng: Rng, value: Rational, mistakes: (Rational | null)[]): ChoiceAnswer {
	const ok = mistakes.filter((m): m is Rational => m !== null && isTerminating(m) && decimalsOf(m) <= 3);
	return choose(rng, numOpt(value), [...ok, ...near(rng, value)].map(numOpt));
}

/** Common checks on a sample's choice. */
export function choiceViolations(ch: ChoiceAnswer | undefined): string[] {
	if (!ch) return ['manca la scelta multipla'];
	const v: string[] = [];
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
	return v;
}
