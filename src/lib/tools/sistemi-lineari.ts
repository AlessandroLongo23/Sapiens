import { Rational, ZERO, ONE, q, gcd, lcm } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { nodeLatex, parseConstant, parseEquation } from './equazione';
import { equazionePrimoGrado, solveLinear } from './equazioni-primo-grado';

/**
 * Linear systems of two equations in x, y and of three in x, y, z, from the coefficients or typed in full, solved as
 * in the lessons (sistemi-lineari/sistemi-di-equazioni and sistemi-cramer): normal form with integer coefficients,
 * then substitution, reduction or Cramer's rule (Sarrus for the 3 × 3 determinants). Exact fractions throughout;
 * the determined, impossible and indeterminate cases are told apart by exact Gaussian elimination, so a method's
 * steps can never contradict the answer.
 *
 * The equation parser of `equazione.ts` knows only x, so the typed equations of a system are read by a small parser
 * here, with the same grammar minus powers. The substitution method reuses the first-degree equation tool for the
 * equation in one unknown it produces.
 */

export type Method2 = 'sostituzione' | 'riduzione' | 'cramer';
export type Method3 = 'cramer' | 'riduzione';

export interface SystemInput<M extends string> {
	mode: 'coef' | 'eq';
	method: M;
	/** Coefficients row by row: a, b, (c,) and the known term of each equation. */
	coef?: string[];
	/** The equations as typed. */
	eqs?: string[];
}

export type SystemCase = 'determinato' | 'impossibile' | 'indeterminato';

const DIGITS = 4;
const GROUP_OVER = 5;
const MAX_LENGTH = 120;
const ORDINAL = ['prima', 'seconda', 'terza'];
const ORDINAL_F = ['la prima', 'la seconda', 'la terza'];

// ---------------------------------------------------------------------------
// The parser of a linear equation in x, y (and z)

type LNode =
	| { k: 'num'; v: Rational; raw: string }
	| { k: 'var'; i: number }
	| { k: 'sum'; terms: { neg: boolean; n: LNode }[] }
	| { k: 'neg'; n: LNode }
	| { k: 'mul'; f: LNode[]; explicit: boolean[] }
	| { k: 'div'; a: LNode; b: LNode }
	| { k: 'group'; n: LNode; open: string };

type Tok = { t: 'num'; v: Rational; raw: string } | { t: 'var'; i: number } | { t: 'op'; v: string };

class LinError extends Error {}

const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };

function example(vars: string[]): string {
	return vars.length === 2 ? '2x + 3y = 7' : 'x + 2y - z = 4';
}

function tokenize(input: string, vars: string[]): Tok[] {
	const out: Tok[] = [];
	const s = input.replace(/[−–]/g, '-').replace(/[·×⋅]/g, '*').replace(/÷/g, '/');
	let i = 0;
	while (i < s.length) {
		const ch = s[i];
		if (/\s/.test(ch)) {
			i++;
			continue;
		}
		const num = /^(\d+(?:[.,]\d+)*|[.,]\d+)/.exec(s.slice(i));
		if (num) {
			const v = parseDecimal(num[1]);
			if (!v) throw new LinError(`Il numero ${num[1]} non è scritto bene: per i decimali usa una virgola sola, per esempio 1,5.`);
			out.push({ t: 'num', v, raw: num[1] });
			i += num[1].length;
			continue;
		}
		const v = vars.indexOf(ch.toLowerCase());
		if (v >= 0) {
			out.push({ t: 'var', i: v });
			i++;
			continue;
		}
		if (ch === '^' || ch === '²' || ch === '³') throw new LinError(`In un sistema lineare le incognite non hanno esponenti. Scrivi per esempio ${example(vars)}.`);
		if ('+-*/:()[]{}='.includes(ch)) {
			out.push({ t: 'op', v: ch });
			i++;
			continue;
		}
		if (/\p{L}/u.test(ch)) throw new LinError(vars.length === 2 ? `Usa come incognite x e y: la lettera ${ch} non si può usare.` : `Usa come incognite x, y e z: la lettera ${ch} non si può usare.`);
		throw new LinError(`Il simbolo ${ch} non si può usare in un'equazione.`);
	}
	return out;
}

class Parser {
	private i = 0;
	constructor(
		private readonly tokens: Tok[],
		private readonly vars: string[]
	) {}
	private peek(): Tok | undefined {
		return this.tokens[this.i];
	}
	private isOp(v: string): boolean {
		const t = this.peek();
		return !!t && t.t === 'op' && t.v === v;
	}
	done(): boolean {
		return this.i >= this.tokens.length;
	}
	expr(): LNode {
		const terms: { neg: boolean; n: LNode }[] = [];
		let neg = false;
		if (this.isOp('+') || this.isOp('-')) {
			neg = (this.peek() as { v: string }).v === '-';
			this.i++;
		}
		terms.push({ neg, n: this.term() });
		while (this.isOp('+') || this.isOp('-')) {
			neg = (this.peek() as { v: string }).v === '-';
			this.i++;
			terms.push({ neg, n: this.term() });
		}
		return terms.length === 1 && !terms[0].neg ? terms[0].n : { k: 'sum', terms };
	}
	private term(): LNode {
		let node = this.factor();
		for (;;) {
			const t = this.peek();
			if (!t) break;
			if (t.t === 'op' && (t.v === '/' || t.v === ':')) {
				this.i++;
				node = { k: 'div', a: node, b: this.factor() };
			} else if (t.t === 'op' && t.v === '*') {
				this.i++;
				node = this.times(node, this.factor(), true);
			} else if (t.t === 'var' || (t.t === 'op' && t.v in CLOSE)) {
				node = this.times(node, this.factor(), false);
			} else if (t.t === 'num') {
				throw new LinError('Tra due numeri scrivi un segno: 2 · 3, oppure 2 + 3.');
			} else break;
		}
		return node;
	}
	private times(a: LNode, b: LNode, explicit: boolean): LNode {
		if (a.k === 'mul') return { k: 'mul', f: [...a.f, b], explicit: [...a.explicit, explicit] };
		return { k: 'mul', f: [a, b], explicit: [false, explicit] };
	}
	private factor(): LNode {
		if (this.isOp('-')) {
			this.i++;
			return { k: 'neg', n: this.factor() };
		}
		if (this.isOp('+')) {
			this.i++;
			return this.factor();
		}
		return this.atom();
	}
	private atom(): LNode {
		const t = this.peek();
		const ex = example(this.vars);
		if (!t) throw new LinError(`L'equazione è incompleta: manca qualcosa alla fine di un membro. Scrivi per esempio ${ex}.`);
		if (t.t === 'num') {
			this.i++;
			return { k: 'num', v: t.v, raw: t.raw };
		}
		if (t.t === 'var') {
			this.i++;
			return { k: 'var', i: t.i };
		}
		if (t.v in CLOSE) {
			this.i++;
			const n = this.expr();
			if (!this.isOp(CLOSE[t.v])) throw new LinError(`Controlla le parentesi: manca una ${CLOSE[t.v]}. Chiudi ogni parentesi che apri.`);
			this.i++;
			return { k: 'group', n, open: t.v };
		}
		if (t.v === ')' || t.v === ']' || t.v === '}') throw new LinError(`Controlla le parentesi: c'è una ${t.v} di troppo o vuota.`);
		throw new LinError(`Controlla i segni: prima di ${t.v} manca un numero o un'incognita. Scrivi per esempio ${ex}.`);
	}
}

/** A linear expression: a coefficient per unknown and a known term. */
interface Lin {
	c: Rational[];
	k: Rational;
}

const constLin = (n: number, k: Rational): Lin => ({ c: Array.from({ length: n }, () => ZERO), k });
const isConst = (l: Lin) => l.c.every((c) => c.isZero());
const scaleLin = (l: Lin, s: Rational): Lin => ({ c: l.c.map((c) => c.mul(s)), k: l.k.mul(s) });
const addLin = (a: Lin, b: Lin, sign = 1): Lin => ({ c: a.c.map((c, i) => (sign > 0 ? c.add(b.c[i]) : c.sub(b.c[i]))), k: sign > 0 ? a.k.add(b.k) : a.k.sub(b.k) });

function evalLin(n: LNode, size: number): Lin {
	switch (n.k) {
		case 'num':
			return constLin(size, n.v);
		case 'var': {
			const l = constLin(size, ZERO);
			l.c[n.i] = ONE;
			return l;
		}
		case 'group':
			return evalLin(n.n, size);
		case 'neg':
			return scaleLin(evalLin(n.n, size), q(-1));
		case 'sum':
			return n.terms.reduce<Lin>((acc, t) => addLin(acc, evalLin(t.n, size), t.neg ? -1 : 1), constLin(size, ZERO));
		case 'mul':
			return n.f.reduce<Lin>((acc, f) => {
				const v = evalLin(f, size);
				if (isConst(acc)) return scaleLin(v, acc.k);
				if (isConst(v)) return scaleLin(acc, v.k);
				throw new LinError('In un sistema lineare le incognite non si moltiplicano tra loro: un prodotto come xy non si può usare.');
			}, constLin(size, ONE));
		case 'div': {
			const b = evalLin(n.b, size);
			if (!isConst(b)) throw new LinError("Un'incognita non può stare in un denominatore: il sistema non sarebbe lineare.");
			if (b.k.isZero()) throw new LinError("Nell'equazione c'è una divisione per zero.");
			return scaleLin(evalLin(n.a, size), ONE.div(b.k));
		}
	}
}

const numLatex = (raw: string) => raw.replace(/,/g, '{,}');
const unwrap = (n: LNode): LNode => (n.k === 'group' ? unwrap(n.n) : n);

/** The LaTeX of a typed side, as written; with `sub`, each unknown is replaced by its value, for the check. */
function lnodeLatex(n: LNode, vars: string[], sub?: Rational[]): string {
	const rec = (m: LNode) => lnodeLatex(m, vars, sub);
	switch (n.k) {
		case 'num':
			return numLatex(n.raw);
		case 'var': {
			if (!sub) return vars[n.i];
			const v = sub[n.i];
			return v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex();
		}
		case 'group': {
			const [o, c] = n.open === '(' ? ['(', ')'] : n.open === '[' ? ['[', ']'] : ['\\{', '\\}'];
			return `\\left${o} ${rec(n.n)} \\right${c}`;
		}
		case 'neg':
			return `-${n.n.k === 'sum' ? `(${rec(n.n)})` : rec(n.n)}`;
		case 'sum':
			return n.terms.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : t.neg ? ' - ' : ' + ') + (t.n.k === 'neg' ? `(${rec(t.n)})` : rec(t.n))).join('');
		case 'mul':
			return n.f
				.map((f, i) => {
					const body = f.k === 'sum' || f.k === 'neg' ? `(${rec(f)})` : rec(f);
					if (i === 0) return body;
					const juxtapose = !n.explicit[i] && (sub ? f.k === 'group' : f.k === 'var' || f.k === 'group');
					return juxtapose ? body : ` \\cdot ${body}`;
				})
				.join('');
		case 'div':
			return `\\dfrac{${rec(unwrap(n.a))}}{${rec(unwrap(n.b))}}`;
	}
}

interface Typed {
	lhs: LNode;
	rhs: LNode;
	latex: string;
	row: Row;
}

type ParsedLinear = { ok: true; eq: Typed } | { ok: false; error: string };

/** One equation of the system, as typed: "3(x - 1) = 2y + 1". */
export function parseLinear(input: string, vars: string[]): ParsedLinear {
	const text = input.trim();
	const ex = example(vars);
	if (!text) return { ok: false, error: `Scrivi l'equazione, per esempio ${ex}.` };
	if (text.length > MAX_LENGTH) return { ok: false, error: `L'equazione è troppo lunga: al massimo ${MAX_LENGTH} caratteri.` };
	try {
		const tokens = tokenize(text, vars);
		const eqs = tokens.filter((t) => t.t === 'op' && t.v === '=').length;
		if (eqs !== 1) return { ok: false, error: eqs === 0 ? `Manca il segno =: scrivi per esempio ${ex}.` : `C'è più di un segno =: scrivi un solo =, per esempio ${ex}.` };
		const split = tokens.findIndex((t) => t.t === 'op' && t.v === '=');
		const parts = [tokens.slice(0, split), tokens.slice(split + 1)];
		if (!parts[0].length || !parts[1].length) return { ok: false, error: `Scrivi qualcosa prima e dopo il segno =, per esempio ${ex}.` };
		const [lhs, rhs] = parts.map((ts) => {
			const p = new Parser(ts, vars);
			const n = p.expr();
			if (!p.done()) throw new LinError('Controlla le parentesi e i segni: qualcosa è di troppo.');
			return n;
		});
		if (!tokens.some((t) => t.t === 'var')) return { ok: false, error: `Nell'equazione non c'è nessuna incognita: scrivi per esempio ${ex}.` };
		const L = evalLin(lhs, vars.length);
		const R = evalLin(rhs, vars.length);
		const row: Row = { c: L.c.map((c, i) => c.sub(R.c[i])), d: R.k.sub(L.k) };
		return { ok: true, eq: { lhs, rhs, latex: `${lnodeLatex(lhs, vars)} = ${lnodeLatex(rhs, vars)}`, row } };
	} catch (e) {
		if (e instanceof LinError) return { ok: false, error: e.message };
		return { ok: false, error: 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.' };
	}
}

/** The LaTeX of a typed equation, for the preview, or null. */
export function previewLinear(input: string, vars: string[]): string | null {
	const r = parseLinear(input, vars);
	return r.ok ? r.eq.latex : null;
}

// ---------------------------------------------------------------------------
// Rows: a normal-form equation, coefficients and known term

export interface Row {
	c: Rational[];
	d: Rational;
}

const par = (r: Rational) => (r.sign() < 0 ? `(${r.toLatex()})` : r.toLatex());

/** "2x + 3y - z = 7"; `hl` marks the term of one unknown. All coefficients zero: "0 = 7". */
function lhsLatex(row: Row, vars: string[], hl = -1): string {
	let out = '';
	row.c.forEach((c, i) => {
		if (c.isZero()) return;
		const abs = c.abs();
		const body = `${abs.isOne() ? '' : abs.toLatex()}${vars[i]}`;
		const sign = out === '' ? (c.sign() < 0 ? '-' : '') : c.sign() < 0 ? ' - ' : ' + ';
		out += sign + (i === hl ? `\\hl{${body}}` : body);
	});
	return out || '0';
}

const rowLatex = (row: Row, vars: string[], hl = -1) => `${lhsLatex(row, vars, hl)} = ${row.d.toLatex()}`;

const casesLatex = (lines: string[]) => `\\begin{cases} ${lines.join(' \\\\ ')} \\end{cases}`;

const systemLatex = (rows: Row[], vars: string[], hl = -1) => casesLatex(rows.map((r) => rowLatex(r, vars, hl)));

const isZeroRow = (r: Row) => r.c.every((c) => c.isZero());

/** A row times a number. */
const scaleRow = (r: Row, s: Rational): Row => ({ c: r.c.map((c) => c.mul(s)), d: r.d.mul(s) });

/** Divides a row of integers by the gcd of its entries, with the sign that makes its first coefficient positive. */
function simplest(r: Row): { row: Row; by: number } {
	const g = [...r.c, r.d].reduce((acc, x) => gcd(acc, x.num), 0);
	if (g === 0) return { row: r, by: 1 };
	const lead = r.c.find((c) => !c.isZero()) ?? r.d;
	const by = lead.sign() < 0 ? -g : g;
	return { row: by === 1 ? r : scaleRow(r, q(1, by)), by };
}

// ---------------------------------------------------------------------------
// Exact classification, the ground truth for every method

export interface Classified {
	case: SystemCase;
	/** The solution of a determined system. */
	x?: Rational[];
}

/** Gaussian elimination over the rationals, with no steps. */
export function classify(rows: Row[]): Classified {
	const n = rows[0].c.length;
	const R = rows.map((r) => ({ c: [...r.c], d: r.d }));
	const pivots: number[] = [];
	let top = 0;
	for (let col = 0; col < n && top < R.length; col++) {
		const p = R.findIndex((r, i) => i >= top && !r.c[col].isZero());
		if (p < 0) continue;
		[R[top], R[p]] = [R[p], R[top]];
		const piv = R[top];
		const inv = ONE.div(piv.c[col]);
		R[top] = scaleRow(piv, inv);
		for (let i = 0; i < R.length; i++) {
			if (i === top || R[i].c[col].isZero()) continue;
			const f = R[i].c[col];
			R[i] = { c: R[i].c.map((c, j) => c.sub(f.mul(R[top].c[j]))), d: R[i].d.sub(f.mul(R[top].d)) };
		}
		pivots.push(col);
		top++;
	}
	if (R.slice(top).some((r) => !r.d.isZero())) return { case: 'impossibile' };
	if (top < n) return { case: 'indeterminato' };
	const x = Array.from({ length: n }, () => ZERO);
	pivots.forEach((col, i) => (x[col] = R[i].d));
	return { case: 'determinato', x };
}

// ---------------------------------------------------------------------------
// Steps

type Part = 'forma' | 'primo' | 'secondo' | 'terzo' | 'determinanti' | 'dD' | 'dx' | 'dy' | 'dz' | 'soluzioni' | 'riduzione' | 'indietro' | 'verifica';
/** A step with the part of the working it belongs to, and the part's name when it depends on the method. */
type PartStep = Step & { part: Part; name?: string };

function partNames(vars: string[]): Record<Part, string> {
	return {
		forma: 'La forma normale',
		primo: `Il valore di ${vars[0]}`,
		secondo: `Il valore di ${vars[1]}`,
		terzo: `Il valore di ${vars[2] ?? ''}`,
		determinanti: 'I determinanti',
		dD: 'Il determinante del sistema',
		dx: 'Il determinante per la x',
		dy: 'Il determinante per la y',
		dz: 'Il determinante per la z',
		soluzioni: 'Le soluzioni',
		riduzione: 'La riduzione',
		indietro: 'Le incognite, dal basso',
		verifica: 'La verifica'
	};
}

/** Where the check substitutes: the equations as typed, or as given by their coefficients. */
interface Source {
	rows: Row[];
	typed?: Typed[];
}

/** A normal-form side with numbers in place of the unknowns: "2 \cdot 3 - (-1)". */
function rowSubLatex(row: Row, vals: Rational[]): string {
	let out = '';
	row.c.forEach((c, i) => {
		if (c.isZero()) return;
		const abs = c.abs();
		const body = abs.isOne() ? par(vals[i]) : `${abs.toLatex()} \\cdot ${par(vals[i])}`;
		out += (out === '' ? (c.sign() < 0 ? '-' : '') : c.sign() < 0 ? ' - ' : ' + ') + body;
	});
	return out || '0';
}

const evalRow = (row: Row, vals: Rational[]) => row.c.reduce((s, c, i) => s.add(c.mul(vals[i])), ZERO);

function checkStep(src: Source, vars: string[], x: Rational[]): PartStep {
	const lines: string[] = [];
	src.rows.forEach((row, i) => {
		const t = src.typed?.[i];
		if (t) {
			const l = evalLin(t.lhs, vars.length);
			const r = evalLin(t.rhs, vars.length);
			const lv = l.c.reduce((s, c, j) => s.add(c.mul(x[j])), l.k);
			const rv = r.c.reduce((s, c, j) => s.add(c.mul(x[j])), r.k);
			const ls = lnodeLatex(t.lhs, vars, x);
			const rs = lnodeLatex(t.rhs, vars, x);
			if (ls !== lv.toLatex()) lines.push(`${ls} = ${lv.toLatex()}`);
			if (rs !== rv.toLatex()) lines.push(`${rs} = ${rv.toLatex()}`);
			if (ls === lv.toLatex() && rs === rv.toLatex()) lines.push(`${lv.toLatex()} = ${rv.toLatex()}`);
		} else lines.push(`${rowSubLatex(row, x)} = ${evalRow(row, x).toLatex()}`);
	});
	return {
		say: src.rows.length === 2 ? 'Controlla: sostituisci la soluzione nelle due equazioni.' : 'Controlla: sostituisci la soluzione nelle tre equazioni.',
		math: lines,
		then: src.typed ? 'In ogni equazione i due membri hanno lo stesso valore: la soluzione è giusta.' : 'Ogni primo membro vale quanto il suo termine noto: la soluzione è giusta.',
		part: 'verifica'
	};
}

/** A value for a row of the answer, with its decimal when it is a fraction. */
function valueTex(name: string, x: Rational): string {
	if (x.isInteger()) return `$${name} = ${x.toLatex()}$`;
	const d = decimal(x, DIGITS);
	return `$${name} = ${x.toLatex()}$ $${d.exact ? '=' : '\\approx'} ${d.tex}$`;
}

function finish(steps: PartStep[], vars: string[], rows: ResultRow[], copy: string): Outcome {
	const names = partNames(vars);
	const grouped = steps.length > GROUP_OVER;
	return {
		ok: true,
		rows,
		copy,
		steps: steps.map(({ part, name, ...step }, i) => (grouped && (i === 0 || steps[i - 1].part !== part) ? { group: name ?? names[part], ...step } : step))
	};
}

function determined(steps: PartStep[], vars: string[], x: Rational[]): Outcome {
	return finish(
		steps,
		vars,
		x.map((v, i) => ({ label: `Valore di ${vars[i]}`, value: valueTex(vars[i], v) })),
		x.map((v, i) => `${vars[i]} = ${v.toString()}`).join('; ')
	);
}

/** The equations an indeterminate system's solutions satisfy, each in its simplest form, duplicates dropped. */
function remaining(rows: Row[], vars: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const r of rows) {
		if (isZeroRow(r)) continue;
		const s = rowLatex(simplest(integerRow(r).row).row, vars);
		if (!seen.has(s)) {
			seen.add(s);
			out.push(s);
		}
	}
	return out;
}

function notDetermined(steps: PartStep[], vars: string[], c: SystemCase, rest: Row[] = []): Outcome {
	if (c === 'impossibile')
		return finish(
			steps,
			vars,
			[
				{ label: 'Soluzioni', value: 'Nessuna: il sistema è impossibile' },
				{ label: 'Insieme delle soluzioni', value: '$S = \\emptyset$' }
			],
			'Sistema impossibile: nessuna soluzione'
		);
	const eqs = remaining(rest, vars);
	const all = vars.length === 2 ? 'coppia' : 'terna';
	if (!eqs.length)
		return finish(
			steps,
			vars,
			[
				{ label: 'Soluzioni', value: `Ogni ${all} di numeri: il sistema è indeterminato` },
				{ label: 'Insieme delle soluzioni', value: `$S = \\mathbb{R}^${vars.length}$` }
			],
			`Sistema indeterminato: ogni ${all} di numeri è una soluzione`
		);
	return finish(
		steps,
		vars,
		[
			{ label: 'Soluzioni', value: 'Infinite: il sistema è indeterminato' },
			{ label: vars.length === 2 ? 'Le coppie che rispettano' : 'Le terne che rispettano', value: `$${eqs.length === 1 ? eqs[0] : casesLatex(eqs)}$` }
		],
		'Sistema indeterminato: infinite soluzioni'
	);
}

/** A row with integer entries: multiplied by the lcm of its denominators. */
function integerRow(r: Row): { row: Row; by: number } {
	const m = [...r.c, r.d].reduce((acc, x) => lcm(acc, x.den), 1);
	return { row: m === 1 ? r : scaleRow(r, q(m)), by: m };
}

// ---------------------------------------------------------------------------
// Input: from the coefficients or the typed equations to integer rows

interface Prepared {
	rows: Row[];
	src: Source;
	steps: PartStep[];
}

function prepare(input: SystemInput<string>, vars: string[]): Prepared | { error: string } {
	const n = vars.length;
	const steps: PartStep[] = [];
	let rows: Row[];
	let src: Source;
	if (input.mode === 'coef') {
		const cells = (input.coef ?? []).slice(0, n * (n + 1));
		while (cells.length < n * (n + 1)) cells.push('');
		if (cells.every((c) => !c.trim())) return { error: 'Scrivi i coefficienti delle equazioni: un campo vuoto vale 0.' };
		const values = cells.map(parseConstant);
		if (values.some((v) => v === 'error')) return { error: 'Scrivi i coefficienti come numeri: interi, decimali con la virgola o frazioni. Per esempio 1,5 oppure 2/3.' };
		const nums = values.map((v) => (v === null || v === 'error' ? ZERO : v));
		rows = Array.from({ length: n }, (_, i) => ({ c: nums.slice(i * (n + 1), i * (n + 1) + n), d: nums[i * (n + 1) + n] }));
		src = { rows };
		steps.push({ say: 'Scrivi il sistema in forma normale.', math: [systemLatex(rows, vars)], part: 'forma' });
	} else {
		const typed: Typed[] = [];
		const texts = (input.eqs ?? []).slice(0, n);
		for (let i = 0; i < n; i++) {
			const r = parseLinear(texts[i] ?? '', vars);
			if (!r.ok) return { error: `${n === 2 ? (i === 0 ? 'Prima' : 'Seconda') : ['Prima', 'Seconda', 'Terza'][i]} equazione. ${r.error}` };
			typed.push(r.eq);
		}
		rows = typed.map((t) => t.row);
		src = { rows, typed };
		const before = casesLatex(typed.map((t) => t.latex));
		const after = systemLatex(rows, vars);
		if (before !== after)
			steps.push({ say: 'Porta ogni equazione in forma normale.', math: [before, after], then: 'Le incognite vanno a sinistra, in ordine, e i numeri a destra.', part: 'forma' });
		else steps.push({ say: 'Scrivi il sistema: è già in forma normale.', math: [after], part: 'forma' });
	}
	const cleared = rows.map(integerRow);
	if (cleared.some((r) => r.by > 1)) {
		rows = cleared.map((r) => r.row);
		const which = cleared.flatMap((r, i) => (r.by > 1 ? [`${ORDINAL_F[i]} per $${r.by}$`] : []));
		steps.push({
			say: 'Moltiplica ogni equazione per il mcm dei suoi denominatori.',
			math: [systemLatex(rows, vars)],
			then: `${which.join(', ').replace(/^l/, 'L')}.`,
			part: 'forma'
		});
	}
	return { rows, src, steps };
}

// ---------------------------------------------------------------------------
// Two equations: prechecks shared by substitution and reduction

/** An equation with no unknowns left (0 = k), or an unknown missing from both: handled before any method. */
function degenerate2(rows: Row[], vars: string[], steps: PartStep[], method: Method2): Outcome | null {
	const zero = rows.map(isZeroRow);
	const bad = rows.findIndex((r, i) => zero[i] && !r.d.isZero());
	if (bad >= 0) {
		steps.push({ say: `Guarda ${ORDINAL_F[bad]} equazione.`, math: [rowLatex(rows[bad], vars)], then: "Non ci sono incognite e l'uguaglianza è falsa: il sistema è impossibile.", part: 'soluzioni' });
		return notDetermined(steps, vars, 'impossibile');
	}
	if (zero[0] && zero[1]) {
		steps.push({ say: 'Guarda le due equazioni.', math: rows.map((r) => rowLatex(r, vars)), then: 'Sono sempre vere: ogni coppia di numeri risolve il sistema.', part: 'soluzioni' });
		return notDetermined(steps, vars, 'indeterminato');
	}
	if (zero[0] || zero[1]) {
		const z = zero[0] ? 0 : 1;
		steps.push({ say: `Guarda ${ORDINAL_F[z]} equazione.`, math: [rowLatex(rows[z], vars)], then: `È sempre vera: resta solo ${ORDINAL_F[1 - z]} equazione, e il sistema è indeterminato.`, part: 'soluzioni' });
		return notDetermined(steps, vars, 'indeterminato', rows);
	}
	if (method === 'cramer') return null;
	const absent = [0, 1].find((j) => rows[0].c[j].isZero() && rows[1].c[j].isZero());
	if (absent === undefined) return null;
	const other = 1 - absent;
	const vals = rows.map((r) => r.d.div(r.c[other]));
	const same = vals[0].equals(vals[1]);
	steps.push({
		say: `Ricava $${vars[other]}$ da ciascuna equazione.`,
		math: vals.map((v) => `${vars[other]} = \\hl{${v.toLatex()}}`),
		then: same
			? `La $${vars[absent]}$ non compare e i due valori coincidono: il sistema è indeterminato.`
			: `La $${vars[absent]}$ non compare e i due valori sono diversi: il sistema è impossibile.`,
		part: 'soluzioni'
	});
	return notDetermined(steps, vars, same ? 'indeterminato' : 'impossibile', rows);
}

// ---------------------------------------------------------------------------
// Substitution

/** A monomial of the equation handed to the first-degree tool: "3x", "-x", "7". */
function term(c: number, body: string, first: boolean): string {
	if (c === 0) return '';
	const abs = Math.abs(c);
	const coef = body && abs === 1 ? '' : String(abs);
	const sign = first ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + ';
	return `${sign}${coef}${body}`;
}

/**
 * The isolated unknown as a string in "x" for the equation parser: v = (c - r·w)/p, with the w-term first when the
 * constant would lead with a minus ("2x - 7", not "-7 + 2x").
 */
function isolatedText(p: number, r: number, c: number): { text: string; frac: boolean } {
	// v = (c - r w) / p, with the sign of p moved to the numerator.
	const s = p < 0 ? -1 : 1;
	const [k, m, den] = [c * s, -r * s, Math.abs(p)];
	const wFirst = k < 0 && m > 0;
	const parts = wFirst ? [term(m, 'x', true), term(k, '', false)] : [term(k, '', true), term(m, 'x', k === 0)];
	const numer = parts.join('') || '0';
	if (den === 1) return { text: numer, frac: false };
	const single = k === 0 || m === 0;
	return { text: single ? `${numer}/${den}` : `(${numer})/${den}`, frac: true };
}

/** Replaces the unknown x of the first-degree tool's steps by another letter: "x" alone, not inside a command. */
function renameX(s: string, to: string): string {
	return to === 'x' ? s : s.replace(/(?<![A-Za-z\\])x(?![A-Za-z])/g, to);
}

function substitution(rows: Row[], vars: string[], steps: PartStep[]): Rational[] | Outcome {
	const coefs = rows.map((r) => r.c.map((c) => c.num));
	// Which unknown to isolate, and from which equation: coefficient ±1 first, then one that divides the others.
	const options: { i: number; v: number; score: number }[] = [];
	for (let i = 0; i < 2; i++)
		for (let v = 0; v < 2; v++) {
			const p = coefs[i][v];
			if (p === 0) continue;
			const clean = coefs[i][1 - v] % p === 0 && rows[i].d.num % p === 0;
			options.push({ i, v, score: (Math.abs(p) === 1 ? 0 : clean ? 1 : 2) * 1e6 + Math.abs(p) * 10 + i * 2 + v });
		}
	options.sort((a, b) => a.score - b.score);
	const { i, v } = options[0];
	const w = 1 - v;
	const o = 1 - i;
	const [V, W] = [vars[v], vars[w]];
	const p = coefs[i][v];
	const r = coefs[i][w];
	const c = rows[i].d.num;

	// The isolated unknown, as a string in x for the equation parser, and in LaTeX with the real letter.
	const iso = isolatedText(p, r, c);
	const isoParsed = r === 0 ? null : parseEquation(`${iso.text} = 0`);
	if (isoParsed && !isoParsed.ok) return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	const isoNode = isoParsed && isoParsed.ok ? isoParsed.eq.lhs : null;
	const isoLatex = isoNode ? renameX(nodeLatex(isoNode), W) : q(c, p).toLatex();

	const pv: Row = { c: [ZERO, ZERO], d: ZERO };
	pv.c[v] = q(p);
	const lines = [rowLatex(rows[i], vars)];
	if (r !== 0 && p !== 1) lines.push(`${lhsLatex(pv, vars)} = ${[term(c, '', true), term(-r, W, c === 0)].join('') || '0'}`);
	const last = `${V} = \\hl{${isoLatex}}`;
	if (lines[lines.length - 1] === `${V} = ${isoLatex}` || (p === 1 && r !== 0)) lines[lines.length - 1] = last;
	else lines.push(last);
	if (p === 1 && r !== 0) lines.unshift(rowLatex(rows[i], vars));
	steps.push({
		say: `Ricava $${V}$ dalla ${ORDINAL[i]} equazione.`,
		math: lines,
		...(p === -1 ? { then: 'Poi cambia segno a tutti i termini.' } : Math.abs(p) > 1 ? { then: `Poi dividi i due membri per $${p}$.` } : {}),
		part: 'primo',
		name: `L'espressione di ${V}`
	});

	// Substitute in the other equation: an equation in W alone, solved by the first-degree tool with W written as x.
	const a = coefs[o][w];
	const b = coefs[o][v];
	const d = rows[o].d.num;
	const plainFrac = iso.frac && !iso.text.startsWith('-') && Math.abs(b) === 1;
	const body = plainFrac ? iso.text : `(${iso.text})`;
	const pieces: { coef: number; body: string }[] = [];
	if (a !== 0) pieces.push({ coef: a, body: 'x' });
	if (b !== 0) pieces.push({ coef: b, body });
	if (v === 0) pieces.reverse();
	const lhs = pieces.map((t, k) => `${k === 0 ? (t.coef < 0 ? '-' : '') : t.coef < 0 ? ' - ' : ' + '}${Math.abs(t.coef) === 1 ? '' : Math.abs(t.coef)}${t.body}`).join('');
	const text = `${lhs} = ${d}`;
	const solved = equazionePrimoGrado(text);
	const parsed = parseEquation(text);
	const lin = solveLinear(text);
	if (!solved.ok || !parsed.ok || !lin || 'degree' in lin) return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	const typedLatex = renameX(parsed.eq.latex, W);
	steps.push({ say: `Sostituisci l'espressione di $${V}$ nella ${ORDINAL[o]} equazione.`, math: [typedLatex], then: `Resta un'equazione nella sola $${W}$.`, part: 'secondo', name: `Il valore di ${W}` });
	solved.steps
		.filter((s) => !s.say.startsWith('Controlla'))
		.forEach((s, k) => {
			const math = (s.math ?? []).map((l) => renameX(l, W));
			if (k === 0 && math[0] === typedLatex) math.shift();
			steps.push({ say: renameX(s.say, W), ...(math.length ? { math } : {}), ...(s.table ? { table: s.table } : {}), ...(s.then ? { then: renameX(s.then, W) } : {}), part: 'secondo', name: `Il valore di ${W}` });
		});
	if (lin.case !== 'determinata') {
		const end = steps[steps.length - 1];
		const impossible = lin.case === 'impossibile';
		end.then = `${end.then ?? ''} ${impossible ? 'Anche il sistema è impossibile.' : 'Anche il sistema è indeterminato.'}`.trim();
		return notDetermined(steps, vars, impossible ? 'impossibile' : 'indeterminato', rows);
	}
	const wVal = lin.x as Rational;
	const vVal = q(c).sub(q(r).mul(wVal)).div(q(p));
	if (isoNode) {
		const withValue = renameX(nodeLatex(isoNode, wVal), W);
		const math = [`${V} = ${withValue}`];
		if (withValue !== vVal.toLatex()) math.push(`= \\hl{${vVal.toLatex()}}`);
		steps.push({ say: `Metti $${W} = ${wVal.toLatex()}$ nell'espressione di $${V}$.`, math, part: 'terzo', name: `Il valore di ${V}` });
	}
	return v === 0 ? [vVal, wVal] : [wVal, vVal];
}


// ---------------------------------------------------------------------------
// Reduction (two equations)

/** Two equations combined so that unknown j cancels; the combined row. */
function combine(e1: Row, e2: Row, j: number, vars: string[], steps: PartStep[], part: Part): Row {
	const p = e1.c[j].num;
	const o = e2.c[j].num;
	const L = lcm(Math.abs(p), Math.abs(o));
	const [f1, f2] = [L / Math.abs(p), L / Math.abs(o)];
	const s1 = scaleRow(e1, q(f1));
	const s2 = scaleRow(e2, q(f2));
	const V = vars[j];
	if (f1 !== 1 || f2 !== 1) {
		const say = f1 !== 1 && f2 !== 1 ? `Moltiplica la prima equazione per $${f1}$ e la seconda per $${f2}$.` : f1 !== 1 ? `Moltiplica la prima equazione per $${f1}$.` : `Moltiplica la seconda equazione per $${f2}$.`;
		steps.push({ say, math: [systemLatex([s1, s2], vars, j)], then: Math.sign(p) === Math.sign(o) ? `Così i coefficienti di $${V}$ sono uguali.` : `Così i coefficienti di $${V}$ sono opposti.`, part });
	}
	const add = Math.sign(p) !== Math.sign(o);
	const out: Row = add ? { c: s1.c.map((c, k) => c.add(s2.c[k])), d: s1.d.add(s2.d) } : { c: s1.c.map((c, k) => c.sub(s2.c[k])), d: s1.d.sub(s2.d) };
	const op = add ? '+' : '-';
	steps.push({
		say: add ? 'Somma le due equazioni membro a membro.' : 'Sottrai la seconda equazione dalla prima, membro a membro.',
		math: [`(${lhsLatex(s1, vars)}) ${op} (${lhsLatex(s2, vars)}) = ${s1.d.toLatex()} ${op} ${par(s2.d)}`, `\\hl{${rowLatex(out, vars)}}`],
		then: isZeroRow(out) ? 'Spariscono tutte e due le incognite.' : `La $${V}$ sparisce.`,
		part
	});
	return out;
}

/** Finds unknown `keep` from the two equations by removing the other one. */
function reduceFor(rows: Row[], keep: number, vars: string[], steps: PartStep[], part: Part): Rational | SystemCase {
	const drop = 1 - keep;
	const K = vars[keep];
	let row: Row;
	const lacking = rows.findIndex((r) => r.c[drop].isZero());
	if (lacking >= 0) {
		row = rows[lacking];
		steps.push({ say: `Nella ${ORDINAL[lacking]} equazione la $${vars[drop]}$ non c'è: usala.`, math: [rowLatex(row, vars)], part });
	} else row = combine(rows[0], rows[1], drop, vars, steps, part);
	if (isZeroRow(row)) {
		const last = steps[steps.length - 1];
		const zero = row.d.isZero();
		last.then = zero ? "Resta un'uguaglianza sempre vera: il sistema è indeterminato." : "Resta un'uguaglianza falsa: il sistema è impossibile.";
		return zero ? 'indeterminato' : 'impossibile';
	}
	const k = row.c[keep];
	const val = row.d.div(k);
	if (!k.isOne()) steps.push({ say: `Dividi entrambi i membri per $${k.toLatex()}$.`, math: [`${K} = \\hl{${val.toLatex()}}`], part });
	return val;
}

function reduction(rows: Row[], vars: string[], steps: PartStep[]): Rational[] | SystemCase {
	// Remove first an unknown that an equation already lacks, else one whose coefficients are equal or opposite, else y.
	const same = (j: number) => Math.abs(rows[0].c[j].num) === Math.abs(rows[1].c[j].num);
	const lacks = (j: number) => rows.some((r) => r.c[j].isZero());
	const first = lacks(1) ? 0 : lacks(0) ? 1 : same(1) || !same(0) ? 0 : 1;
	const a = reduceFor(rows, first, vars, steps, first === 0 ? 'primo' : 'secondo');
	if (!(a instanceof Rational)) return a;
	const b = reduceFor(rows, 1 - first, vars, steps, first === 0 ? 'secondo' : 'primo');
	if (!(b instanceof Rational)) return b;
	return first === 0 ? [a, b] : [b, a];
}

// ---------------------------------------------------------------------------
// Cramer

const matrixBody = (m: Rational[][]) => m.map((r) => r.map((x) => x.toLatex()).join(' & ')).join(' \\\\ ');
const vmatrix = (m: Rational[][]) => `\\begin{vmatrix} ${matrixBody(m)} \\end{vmatrix}`;

/** The matrix of the coefficients with column j replaced by the known terms (j = -1: none). */
function matrix(rows: Row[], j: number): Rational[][] {
	return rows.map((r) => r.c.map((c, k) => (k === j ? r.d : c)));
}

function det2Step(name: string, m: Rational[][], say: string, part: Part): { step: PartStep; value: Rational } {
	const p1 = m[0][0].mul(m[1][1]);
	const p2 = m[1][0].mul(m[0][1]);
	const value = p1.sub(p2);
	return {
		value,
		step: {
			say,
			math: [`${name} = ${vmatrix(m)}`, `= ${par(m[0][0])} \\cdot ${par(m[1][1])} - ${par(m[1][0])} \\cdot ${par(m[0][1])}`, `= ${p1.toLatex()} - ${par(p2)}`, `= \\hl{${value.toLatex()}}`],
			part
		}
	};
}

const RIGHT: [number, number][][] = [
	[
		[0, 0],
		[1, 1],
		[2, 2]
	],
	[
		[0, 1],
		[1, 2],
		[2, 0]
	],
	[
		[0, 2],
		[1, 0],
		[2, 1]
	]
];
const LEFT: [number, number][][] = [
	[
		[0, 2],
		[1, 1],
		[2, 0]
	],
	[
		[0, 0],
		[1, 2],
		[2, 1]
	],
	[
		[0, 1],
		[1, 0],
		[2, 2]
	]
];

export function det3(m: Rational[][]): Rational {
	const sum = (diags: [number, number][][]) => diags.reduce((s, d) => s.add(d.reduce((p, [r, c]) => p.mul(m[r][c]), ONE)), ZERO);
	return sum(RIGHT).sub(sum(LEFT));
}

/** Sarrus in two steps: the matrix with two columns copied and the table of the six products, then the difference. */
function sarrusSteps(name: string, note: string, m: Rational[][], part: Part): { steps: PartStep[]; value: Rational } {
	const prod = (d: [number, number][]) => d.reduce((p, [r, c]) => p.mul(m[r][c]), ONE);
	const cell = (d: [number, number][]) => `$${d.map(([r, c]) => par(m[r][c])).join(' \\cdot ')} = ${prod(d).toLatex()}$`;
	const s1 = RIGHT.reduce((s, d) => s.add(prod(d)), ZERO);
	const s2 = LEFT.reduce((s, d) => s.add(prod(d)), ZERO);
	const value = s1.sub(s2);
	const copied = `\\begin{matrix} ${m.map((r) => `${r[0].toLatex()} & ${r[1].toLatex()}`).join(' \\\\ ')} \\end{matrix}`;
	return {
		value,
		steps: [
			{
				say: `Scrivi $${name}$ e ricopia a destra le prime due colonne.`,
				math: [`${name} = ${vmatrix(m)}\\;${copied}`],
				then: note,
				table: {
					head: ['Diagonali verso destra', 'Diagonali verso sinistra'],
					rows: [...[0, 1, 2].map((k) => [cell(RIGHT[k]), cell(LEFT[k])]), [`Somma: $${s1.toLatex()}$`, `Somma: $${s2.toLatex()}$`]]
				},
				part
			},
			{ say: 'Sottrai la seconda somma dalla prima.', math: [`${name} = ${s1.toLatex()} - ${par(s2)}`, `= \\hl{${value.toLatex()}}`], part }
		]
	};
}

function cramerSolutionStep(vars: string[], dets: Rational[], D: Rational): PartStep {
	return {
		say: 'Dividi ogni determinante per $D$.',
		math: vars.map((v, i) => {
			const val = dets[i].div(D);
			const reduced = D.sign() > 0 && val.num === dets[i].num && val.den === D.num;
			return `${v} = \\dfrac{D_${v}}{D} = ${reduced ? '' : `\\dfrac{${dets[i].toLatex()}}{${D.toLatex()}} = `}\\hl{${val.toLatex()}}`;
		}),
		then: 'È la regola di Cramer: il determinante del sistema sta sempre al denominatore.',
		part: 'soluzioni'
	};
}

function cramer2(rows: Row[], vars: string[], steps: PartStep[]): Rational[] | SystemCase {
	const d = det2Step('D', matrix(rows, -1), 'Calcola $D$, il determinante dei coefficienti delle incognite.', 'determinanti');
	steps.push(d.step);
	const D = d.value;
	const dx = det2Step('D_x', matrix(rows, 0), 'Calcola $D_x$: metti i termini noti al posto della colonna di $x$.', 'determinanti');
	const dy = det2Step('D_y', matrix(rows, 1), 'Calcola $D_y$: metti i termini noti al posto della colonna di $y$.', 'determinanti');
	if (!D.isZero()) {
		d.step.then = "$D$ non è zero: il sistema ha una sola soluzione.";
		steps.push(dx.step, dy.step, cramerSolutionStep(vars, [dx.value, dy.value], D));
		return [dx.value.div(D), dy.value.div(D)];
	}
	d.step.then = '$D$ è zero: la regola di Cramer non si usa. Servono $D_x$ e $D_y$.';
	steps.push(dx.step, dy.step);
	const zero = dx.value.isZero() && dy.value.isZero();
	steps[steps.length - 1].then = zero ? 'Anche $D_x$ e $D_y$ sono zero: il sistema è indeterminato.' : "$D$ è zero, ma $D_x$ o $D_y$ no: il sistema è impossibile.";
	return zero ? 'indeterminato' : 'impossibile';
}

// ---------------------------------------------------------------------------
// Gaussian elimination with steps (three equations, and Cramer when D = 0)

function gaussSteps(rows0: Row[], vars: string[], steps: PartStep[]): { x: Rational[] } | { case: SystemCase; rest: Row[] } {
	const n = vars.length;
	const bad = rows0.findIndex((r) => isZeroRow(r) && !r.d.isZero());
	if (bad >= 0) {
		steps.push({ say: `Guarda ${ORDINAL_F[bad]} equazione.`, math: [rowLatex(rows0[bad], vars)], then: "Non ci sono incognite e l'uguaglianza è falsa: il sistema è impossibile.", part: 'riduzione' });
		return { case: 'impossibile', rest: rows0 };
	}
	const empty = rows0.flatMap((r, i) => (isZeroRow(r) ? [i] : []));
	if (empty.length)
		steps.push({
			say: empty.length === 1 ? `Togli ${ORDINAL_F[empty[0]]} equazione.` : 'Togli le equazioni senza incognite.',
			math: empty.map((i) => rowLatex(rows0[i], vars)),
			then: 'È sempre vera e non dice niente sulle incognite.',
			part: 'riduzione'
		});
	let R = rows0.filter((r) => !isZeroRow(r)).map((r) => ({ c: [...r.c], d: r.d }));
	if (!R.length) return { case: 'indeterminato', rest: [] };
	let top = 0;
	for (let col = 0; col < n && top < R.length; col++) {
		const cand = R.map((r, i) => ({ i, a: Math.abs(r.c[col].num) })).filter((c) => c.i >= top && c.a !== 0);
		if (!cand.length) continue;
		cand.sort((u, v) => (u.a === 1 ? 0 : 1) - (v.a === 1 ? 0 : 1) || u.a - v.a || u.i - v.i);
		const p = cand[0].i;
		const V = vars[col];
		if (p !== top) {
			[R[top], R[p]] = [R[p], R[top]];
			steps.push({
				say: `Scambia di posto la ${ORDINAL[top]} e la ${ORDINAL[p]} equazione.`,
				math: [systemLatex(R, vars)],
				then: R[top].c[col].abs().isOne() ? `Così la ${ORDINAL[top]} equazione ha la $${V}$ con coefficiente $${R[top].c[col].toLatex()}$: è la più comoda.` : `Così la ${ORDINAL[top]} equazione contiene la $${V}$.`,
				part: 'riduzione'
			});
		}
		let changed = false;
		for (let i = top + 1; i < R.length; i++) {
			const o = R[i].c[col].num;
			if (o === 0) continue;
			changed = true;
			const pv = R[top].c[col].num;
			const L = lcm(Math.abs(o), Math.abs(pv));
			const [fo, fp] = [L / Math.abs(o), L / Math.abs(pv)];
			const add = Math.sign(o) !== Math.sign(pv);
			const op = add ? '+' : '-';
			const next: Row = { c: R[i].c.map((c, k) => c.mul(q(fo))[add ? 'add' : 'sub'](R[top].c[k].mul(q(fp)))), d: R[i].d.mul(q(fo))[add ? 'add' : 'sub'](R[top].d.mul(q(fp))) };
			const f = (k: number) => (k === 1 ? '' : `${k}`);
			const known = (k: number, d: Rational, first: boolean) => (k === 1 ? (first ? d.toLatex() : par(d)) : `${k} \\cdot ${par(d)}`);
			const lines = [`${f(fo)}(${lhsLatex(R[i], vars)}) ${op} ${f(fp)}(${lhsLatex(R[top], vars)}) = ${known(fo, R[i].d, true)} ${op} ${known(fp, R[top].d, false)}`, `\\hl{${rowLatex(next, vars)}}`];
			const s = simplest(next);
			let then: string | undefined;
			if (isZeroRow(next)) then = next.d.isZero() ? 'Resta $0 = 0$, sempre vera: questa equazione non dice più niente.' : `Resta $0 = ${next.d.toLatex()}$, che è falsa: il sistema è impossibile.`;
			else if (s.by !== 1) {
				lines.push(rowLatex(s.row, vars));
				then = s.by === -1 ? 'Poi cambia segno a tutti i termini.' : `Poi dividi i due membri per $${s.by}$, per avere numeri più piccoli.`;
			}
			R[i] = s.row;
			steps.push({ say: `Togli la $${V}$ dalla ${ORDINAL[i]} equazione.`, math: lines, ...(then ? { then } : {}), part: 'riduzione' });
			if (isZeroRow(next) && !next.d.isZero()) return { case: 'impossibile', rest: R };
		}
		if (changed && top + 1 < R.length && R.slice(top + 1).some((r) => !isZeroRow(r) || !r.d.isZero()))
			steps.push({ say: 'Scrivi il nuovo sistema.', math: [systemLatex(R.filter((r) => !isZeroRow(r) || !r.d.isZero()), vars)], part: 'riduzione' });
		R = R.filter((r, i) => i <= top || !isZeroRow(r) || !r.d.isZero());
		top++;
	}
	if (top < n) {
		steps.push({
			say: 'Conta le equazioni che restano.',
			then: `Restano ${top === 1 ? 'una equazione' : `${top} equazioni`} per ${n} incognite: il sistema è indeterminato, con infinite soluzioni.`,
			part: 'riduzione'
		});
		return { case: 'indeterminato', rest: R };
	}
	// Back substitution: row i has unknown i and the ones after it.
	const x: Rational[] = Array.from({ length: n }, () => ZERO);
	for (let i = n - 1; i >= 0; i--) {
		const row = R[i];
		const V = vars[i];
		const k = row.c[i];
		const others = row.c.map((c, j) => ({ c, j })).filter(({ c, j }) => j > i && !c.isZero());
		const rest = others.reduce((s, { c, j }) => s.add(c.mul(x[j])), ZERO);
		x[i] = row.d.sub(rest).div(k);
		const lines: string[] = [];
		if (others.length) {
			let lhs = lhsLatex({ c: row.c.map((c, j) => (j === i ? c : ZERO)), d: ZERO }, vars);
			for (const { c, j } of others) lhs += `${c.sign() < 0 ? ' - ' : ' + '}\\hl{${c.abs().isOne() ? par(x[j]) : `${c.abs().toLatex()} \\cdot ${par(x[j])}`}}`;
			lines.push(`${lhs} = ${row.d.toLatex()}`);
			const P = lhsLatex({ c: row.c.map((c, j) => (j === i ? c : ZERO)), d: ZERO }, vars);
			if (!rest.isZero() && !row.d.isZero()) lines.push(`${P} = ${row.d.toLatex()} ${rest.sign() < 0 ? '+' : '-'} ${rest.abs().toLatex()}`);
			lines.push(`${P} = ${row.d.sub(rest).toLatex()}`);
		} else lines.push(rowLatex(row, vars));
		if (!k.isOne()) lines.push(`${V} = \\hl{${x[i].toLatex()}}`);
		else lines[lines.length - 1] = lines[lines.length - 1].replace(/= (.*)$/, '= \\hl{$1}');
		const known = others.map(({ j }) => `$${vars[j]}$`);
		steps.push({
			say: others.length
				? `Sostituisci ${known.join(' e ')} nella ${ORDINAL[i]} equazione e ricava $${V}$.`
				: `Ricava $${V}$ dalla ${ORDINAL[i]} equazione.`,
			math: lines,
			part: 'indietro'
		});
	}
	return { x };
}

function cramer3(rows: Row[], vars: string[], steps: PartStep[]): Rational[] | { case: SystemCase; rest: Row[] } {
	const d = sarrusSteps('D', 'Le sue colonne sono i coefficienti delle incognite. Le diagonali verso destra hanno il più, le altre il meno.', matrix(rows, -1), 'dD');
	steps.push(...d.steps);
	const D = d.value;
	if (D.isZero()) {
		steps[steps.length - 1].then = '$D$ è zero: la regola di Cramer non si usa. Risolvi il sistema per riduzione.';
		const g = gaussSteps(rows, vars, steps);
		return 'x' in g ? g.x : g;
	}
	steps[steps.length - 1].then = '$D$ non è zero: il sistema ha una sola soluzione.';
	const parts: Part[] = ['dx', 'dy', 'dz'];
	const dets = vars.map((v, j) => {
		const s = sarrusSteps(`D_${v}`, `I termini noti prendono il posto della colonna di $${v}$.`, matrix(rows, j), parts[j]);
		steps.push(...s.steps);
		return s.value;
	});
	steps.push(cramerSolutionStep(vars, dets, D));
	return dets.map((x) => x.div(D));
}

// ---------------------------------------------------------------------------
// The tools

const VARS2 = ['x', 'y'];
const VARS3 = ['x', 'y', 'z'];

function run(fn: () => Outcome): Outcome {
	try {
		return fn();
	} catch {
		return fail('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

export function sistema2x2(input: SystemInput<Method2>): Outcome {
	return run(() => {
		const prep = prepare(input, VARS2);
		if ('error' in prep) return fail(prep.error);
		const { rows, src, steps } = prep;
		const truth = classify(rows);
		const early = degenerate2(rows, VARS2, steps, input.method);
		if (early) return early;
		let r: Rational[] | SystemCase | Outcome;
		if (input.method === 'cramer') r = cramer2(rows, VARS2, steps);
		else if (input.method === 'riduzione') r = reduction(rows, VARS2, steps);
		else {
			r = substitution(rows, VARS2, steps);
			if (!Array.isArray(r)) return r;
		}
		if (typeof r === 'string') {
			if (r !== truth.case) throw new Error('inconsistent');
			return notDetermined(steps, VARS2, r, rows);
		}
		const x = r as Rational[];
		if (truth.case !== 'determinato' || !truth.x?.every((v, i) => v.equals(x[i]))) throw new Error('inconsistent');
		steps.push(checkStep(src, VARS2, x));
		return determined(steps, VARS2, x);
	});
}

export function sistema3x3(input: SystemInput<Method3>): Outcome {
	return run(() => {
		const prep = prepare(input, VARS3);
		if ('error' in prep) return fail(prep.error);
		const { rows, src, steps } = prep;
		const truth = classify(rows);
		const r = input.method === 'cramer' ? cramer3(rows, VARS3, steps) : gaussSteps(rows, VARS3, steps);
		const x = Array.isArray(r) ? r : 'x' in r ? r.x : null;
		if (!x) {
			const c = r as { case: SystemCase; rest: Row[] };
			if (c.case !== truth.case) throw new Error('inconsistent');
			return notDetermined(steps, VARS3, c.case, c.rest);
		}
		if (truth.case !== 'determinato' || !truth.x?.every((v, i) => v.equals(x[i]))) throw new Error('inconsistent');
		steps.push(checkStep(src, VARS3, x));
		return determined(steps, VARS3, x);
	});
}
