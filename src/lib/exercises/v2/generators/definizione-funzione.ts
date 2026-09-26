/**
 * Definizione di funzione. Spec: specs/exercises/definizione-funzione.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/42-definizione-funzione.md):
 * recognising a function in a list of pairs, with the reason; the value of a first-degree function
 * at an integer; of a second-degree function at a negative integer; at a fraction; a table of
 * values; the value at a letter expression (f(a + 1), f(-a), f(2a)). Level 1 picks the case first
 * (function, an element with two images, an element with none) and builds the relation from it; the
 * other levels pick the function and the point, and the answer follows exactly.
 */
import type { ChoiceAnswer, ChoiceOption, ExpressionAnswer, Generator, NumberAnswer, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { assembleChoice, pickDistinct, range, shuffle } from '../insiemi';

export const ID = 'definizione-funzione';

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*[xa]\b/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xa]\b/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
];

// ---------------------------------------------------------------------------
// Small helpers

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

/** "a", "a e b", "a, b e c". */
function andList(xs: string[]): string {
	if (xs.length === 1) return xs[0];
	return `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`;
}

const listSet = (xs: (number | string)[]) => `\\{${xs.join(',\\ ')}\\}`;

// ---------------------------------------------------------------------------
// Level 1: is the relation a function?

export type RelCase = 'funzione' | 'due-immagini' | 'senza-immagine';
const REL_CASES: RelCase[] = ['funzione', 'due-immagini', 'senza-immagine'];
const LETTERS = ['a', 'b', 'c', 'd'];

type Pair = [number, string];

interface RelBuilt {
	A: number[];
	B: string[];
	pairs: Pair[];
	case: RelCase;
	/** The element of A with two images or with none. */
	culprit: number | null;
}

/** Elements of A paired with y. */
const preimages = (pairs: Pair[], y: string): number[] => [...new Set(pairs.filter((p) => p[1] === y).map((p) => p[0]))];
/** Images of x. */
const images = (pairs: Pair[], x: number): string[] => pairs.filter((p) => p[0] === x).map((p) => p[1]);

function buildRel(rng: Rng, kind: RelCase): RelBuilt {
	const n = rng.int(3, 5);
	const A = pickDistinct(rng, range(0, 6), n).sort((a, b) => a - b);
	const B = LETTERS.slice(0, rng.int(3, 4));
	let pairs: Pair[] = A.map((x) => [x, rng.pick(B)]);
	let culprit: number | null = null;
	if (kind === 'due-immagini') {
		culprit = rng.pick(A);
		const first = images(pairs, culprit)[0];
		pairs.push([culprit, rng.pick(B.filter((y) => y !== first))]);
	} else if (kind === 'senza-immagine') {
		culprit = rng.pick(A);
		pairs = pairs.filter((p) => p[0] !== culprit);
	}
	pairs.sort((p, r) => p[0] - r[0] || (p[1] < r[1] ? -1 : 1));
	return { A, B, pairs, case: kind, culprit };
}

const pairTex = (p: Pair) => `(${p[0]}, ${p[1]})`;

/** R = {…} on one line, or with five pairs or more on two lines inside the braces. */
function relTex(pairs: Pair[]): string {
	const items = pairs.map(pairTex);
	if (items.length <= 4) return `R = \\{${items.join(',\\ ')}\\}`;
	const k = Math.ceil(items.length / 2);
	return `R = \\left\\{ \\begin{gathered} ${items.slice(0, k).join(',\\ ')}, \\\\ ${items.slice(k).join(',\\ ')} \\end{gathered} \\right\\}`;
}

function relProblem(b: RelBuilt): string {
	return `\\begin{gathered} A = ${listSet(b.A)} \\quad B = ${listSet(b.B)} \\\\ ${relTex(b.pairs)} \\end{gathered}`;
}

/** The options: codes in `values`, the reason in words. */
export const relOption = {
	funzione: (): ChoiceOption => ({ latex: '\\text{Sì, è una funzione}', values: ['funzione'] }),
	due: (x: number): ChoiceOption => ({ latex: `\\text{No: } ${x} \\text{ ha due immagini}`, values: ['due-immagini', String(x)] }),
	senza: (x: number): ChoiceOption => ({ latex: `\\text{No: } ${x} \\text{ non ha immagine}`, values: ['senza-immagine', String(x)] }),
	arrivoPiu: (y: string): ChoiceOption => ({
		latex: `\\begin{gathered} \\text{No: } ${y} \\text{ è immagine} \\\\ \\text{di più elementi} \\end{gathered}`,
		values: ['arrivo-piu', y],
	}),
	arrivoNessuno: (y: string): ChoiceOption => ({
		latex: `\\begin{gathered} \\text{No: } ${y} \\text{ non è immagine} \\\\ \\text{di nessun elemento} \\end{gathered}`,
		values: ['arrivo-nessuno', y],
	}),
};

/** The mistake of the lesson's warning: looking at the arrows that reach B. A true statement about B, the wrong reason. */
function arrivalMistake(rng: Rng, b: RelBuilt): ChoiceOption | null {
	const many = b.B.filter((y) => preimages(b.pairs, y).length >= 2);
	const none = b.B.filter((y) => preimages(b.pairs, y).length === 0);
	const cands = [...many.map(relOption.arrivoPiu), ...none.map(relOption.arrivoNessuno)];
	return cands.length ? rng.pick(cands) : null;
}

function relChoice(rng: Rng, b: RelBuilt): ChoiceAnswer | null {
	const arrival = arrivalMistake(rng, b);
	if (!arrival) return null;
	const others = (x: number | null) => b.A.filter((a) => a !== x);
	let correct: ChoiceOption;
	let distractors: ChoiceOption[];
	if (b.case === 'funzione') {
		const [x1, x2] = pickDistinct(rng, b.A, 2);
		correct = relOption.funzione();
		distractors = [relOption.due(x1), relOption.senza(x2), arrival];
	} else if (b.case === 'due-immagini') {
		correct = relOption.due(b.culprit!);
		distractors = [relOption.funzione(), relOption.senza(rng.pick(others(b.culprit))), arrival];
	} else {
		correct = relOption.senza(b.culprit!);
		distractors = [relOption.funzione(), relOption.due(rng.pick(others(b.culprit))), arrival];
	}
	return assembleChoice(rng, correct, distractors);
}

function relSteps(b: RelBuilt): string[] {
	const out = [`\\text{Una relazione da } A \\text{ a } B \\text{ è una funzione se ogni elemento di } A \\text{ compare come primo elemento in una e una sola coppia.}`];
	if (b.case === 'funzione') {
		out.push(`\\text{Gli elementi } ${andList(b.A.map(String))} \\text{ compaiono ciascuno in una sola coppia: ognuno ha una e una sola immagine.}`);
		const many = b.B.filter((y) => preimages(b.pairs, y).length >= 2);
		const none = b.B.filter((y) => preimages(b.pairs, y).length === 0);
		if (many.length) out.push(`\\text{Che } ${many[0]} \\text{ sia immagine di più elementi non conta: sugli elementi di } B \\text{ la definizione non chiede niente.}`);
		else if (none.length) out.push(`\\text{Che } ${none[0]} \\text{ non sia immagine di nessun elemento non conta: sugli elementi di } B \\text{ la definizione non chiede niente.}`);
		out.push(`\\text{Quindi } R \\text{ è una funzione.}`);
	} else if (b.case === 'due-immagini') {
		const x = b.culprit!;
		const two = b.pairs.filter((p) => p[0] === x).map(pairTex);
		out.push(`${x} \\text{ compare in due coppie, } ${two[0]} \\text{ e } ${two[1]}\\text{: ha due immagini.}`);
		out.push(`\\text{Quindi } R \\text{ non è una funzione.}`);
	} else {
		const x = b.culprit!;
		out.push(`${x} \\text{ non compare come primo elemento in nessuna coppia: non ha immagine.}`);
		out.push(`\\text{Quindi } R \\text{ non è una funzione.}`);
	}
	return out;
}

const relSolution: Record<RelCase, (x: number | null) => string> = {
	funzione: () => `R \\text{ è una funzione}`,
	'due-immagini': (x) => `R \\text{ non è una funzione: } ${x} \\text{ ha due immagini}`,
	'senza-immagine': (x) => `R \\text{ non è una funzione: } ${x} \\text{ non ha immagine}`,
};

// ---------------------------------------------------------------------------
// Levels 2-5: the value of f(x) = a x^2 + b x + c (a = 0 for a first-degree function)

export interface Fn {
	a: number;
	b: number;
	c: number;
}

const fnLatex = (f: Fn) => polyToLatex(poly(f.c, f.b, f.a));

function evalFn(f: Fn, x: Rational): Rational {
	return q(f.a).mul(x).mul(x).add(q(f.b).mul(x)).add(q(f.c));
}

/** x written after f: f(-2), f\left(-\frac{1}{3}\right). */
function argOfF(x: Rational): string {
	return x.isInteger() ? `f(${x.toLatex()})` : `f\\left(${x.toLatex()}\\right)`;
}

/** x as substituted: between parentheses if negative, and if it is a fraction under a power. */
function subst(x: Rational, power: boolean): string {
	if (x.sign() < 0) return x.isInteger() ? `(${x.toLatex()})` : `\\left(${x.toLatex()}\\right)`;
	if (power && !x.isInteger()) return `\\left(${x.toLatex()}\\right)`;
	return x.toLatex();
}

/** a·x^2 + b·x + c with x substituted, before any computing: "2 \cdot (-2)^2 - 3 \cdot (-2) + 1". */
function substituted(f: Fn, x: Rational): string {
	const terms: [number, string][] = [];
	if (f.a !== 0) terms.push([f.a, `${subst(x, true)}^2`]);
	if (f.b !== 0) terms.push([f.b, subst(x, false)]);
	let out = '';
	for (const [k, body] of terms) {
		const abs = Math.abs(k);
		const t = abs === 1 ? body : `${abs} \\cdot ${body}`;
		out += out === '' ? `${k < 0 ? '-' : ''}${t}` : ` ${k < 0 ? '-' : '+'} ${t}`;
	}
	if (f.c !== 0) out += out === '' ? String(f.c) : ` ${f.c < 0 ? '-' : '+'} ${Math.abs(f.c)}`;
	return out;
}

/** The terms computed, before adding them: "8 + 6 + 1". Zero terms are left out. */
function termsLine(f: Fn, x: Rational): string {
	const ts = [q(f.a).mul(x).mul(x), q(f.b).mul(x), q(f.c)].filter((t, i) => [f.a, f.b, f.c][i] !== 0 && !t.isZero());
	if (ts.length === 0) return '0';
	return ts.map((t, i) => (i === 0 ? t.toLatex() : `${t.sign() < 0 ? '-' : '+'} ${t.abs().toLatex()}`)).join(' ');
}

/** f(x0) = substituted = terms = value, skipping repeated members; `split` puts the computing on a second line. */
function valueSteps(f: Fn, x: Rational, split: boolean): string[] {
	const v = evalFn(f, x).toLatex();
	// With a coefficient -1, x = 0 would be written "-0": f(0) is then just the constant term.
	if (x.isZero() && /^-0/.test(substituted(f, x))) return [`${argOfF(x)} = ${v}`];
	const members = [substituted(f, x), termsLine(f, x), v].filter((m, i, all) => i === 0 || m !== all[i - 1]);
	if (!split || members.length < 3) return [`${argOfF(x)} = ${members.join(' = ')}`];
	return [`${argOfF(x)} = ${members[0]}`, `= ${members.slice(1).join(' = ')}`];
}

/** The mistakes a student makes computing f(x0), by name; null when the mistake does not apply. */
export function mistakes(f: Fn, x: Rational): Record<string, Rational | null> {
	const X2 = x.mul(x);
	const neg = x.sign() < 0;
	const A = q(f.a), B = q(f.b), C = q(f.c);
	return {
		// -2^2 = -4: the square of a negative number taken as negative
		'segno-quadrato': neg && f.a !== 0 ? A.mul(X2).neg().add(B.mul(x)).add(C) : null,
		// -3 · (-2) = -6: the product with a negative number without the sign rule
		'segno-prodotto': neg && f.b !== 0 ? A.mul(X2).sub(B.mul(x)).add(C) : null,
		'due-segni': neg && f.a !== 0 && f.b !== 0 ? A.mul(X2).neg().sub(B.mul(x)).add(C) : null,
		// 2 · (-2)^2 = (-4)^2 = 16: the coefficient squared with x
		'coefficiente-al-quadrato': f.a !== 0 && Math.abs(f.a) !== 1 ? A.mul(A).mul(X2).add(B.mul(x)).add(C) : null,
		// (1/3)^2 = 1/3: only the numerator squared
		'solo-numeratore': f.a !== 0 && !x.isInteger() ? A.mul(q(x.num * x.num, x.den)).add(B.mul(x)).add(C) : null,
		// 3x with x = -1 read as 3 - 1: the product written as a sum
		somma: f.a === 0 && x.isInteger() ? B.add(x).add(C) : null,
		// 3 · 1/3 = 3/9: numerator and denominator both multiplied
		'numeratore-e-denominatore': f.a === 0 && !x.isInteger() ? x.add(C) : null,
		// the constant term with the sign changed
		'segno-termine-noto': f.c !== 0 ? A.mul(X2).add(B.mul(x)).sub(C) : null,
	};
}

const ratOption = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });

function valueChoice(rng: Rng, f: Fn, x: Rational): ChoiceAnswer {
	const v = evalFn(f, x);
	const m = mistakes(f, x);
	// The two sign slips of the lesson first, so they are always among the options; the others shuffled.
	const first = ['segno-quadrato', 'segno-prodotto'];
	const rest = Object.keys(m).filter((k) => !first.includes(k));
	const named = [...first, ...shuffle(rng, rest)].map((k) => m[k]).filter((r): r is Rational => r !== null);
	const near: Rational[] = [];
	for (let d = 1; d <= 6; d++) near.push(v.add(q(d)), v.sub(q(d)));
	if (!x.isInteger()) near.unshift(v.add(q(1, x.den * x.den)), v.sub(q(1, x.den)));
	const ch = assembleChoice(rng, ratOption(v), [...named, ...near].map(ratOption));
	if (!ch) throw new Error(`${ID}: not enough options`);
	return ch;
}

// Level 2: first degree at an integer
function buildLevel2(rng: Rng): { f: Fn; x: Rational } {
	const f: Fn = { a: 0, b: nonZero(rng, -6, 6, [1, -1]), c: nonZero(rng, -9, 9) };
	const x = rng.next() < 0.6 ? rng.int(-5, -1) : rng.int(1, 5);
	return { f, x: q(x) };
}

// Level 3: second degree at a negative integer
function buildLevel3(rng: Rng): { f: Fn; x: Rational } | null {
	const a = rng.pick([1, 1, 2, 2, 3, -1, -2]);
	const b = rng.next() < 0.85 ? nonZero(rng, -5, 5) : 0;
	const c = rng.next() < 0.75 ? nonZero(rng, -6, 6) : 0;
	if (b === 0 && c === 0) return null;
	const x = q(rng.pick([-1, -2, -2, -3, -3]));
	const v = evalFn({ a, b, c }, x);
	if (Math.abs(v.num) > 60) return null;
	return { f: { a, b, c }, x };
}

// Level 4: at a fraction, positive or negative
function buildLevel4(rng: Rng): { f: Fn; x: Rational } | null {
	const lin = rng.next() < 0.3;
	const den = lin ? rng.pick([2, 3, 4, 5]) : rng.pick([2, 2, 3, 3, 4]);
	const num = rng.pick(den === 2 ? [1, 3] : den === 4 ? [1, 3] : den === 3 ? [1, 2] : [1, 2, 3]);
	const x = q(rng.next() < 0.6 ? -num : num, den);
	const f: Fn = lin
		? { a: 0, b: nonZero(rng, -6, 6, [1, -1]), c: nonZero(rng, -5, 5) }
		: { a: rng.pick([1, 2, 2, 3, -1]), b: nonZero(rng, -4, 4), c: rng.next() < 0.8 ? nonZero(rng, -4, 4) : 0 };
	const v = evalFn(f, x);
	if (v.den > 25 || Math.abs(v.num) > 60) return null;
	return { f, x };
}

// Level 5: table of values
interface TableBuilt {
	f: Fn;
	xs: number[];
}

function buildTable(rng: Rng): TableBuilt | null {
	const s = rng.pick([-3, -2, -2, -1]);
	const xs = range(s, s + 4);
	const lin = rng.next() < 0.4;
	const f: Fn = lin
		? { a: 0, b: nonZero(rng, -4, 4), c: rng.int(-5, 5) }
		: { a: rng.pick([1, 1, 1, 2, -1]), b: rng.next() < 0.5 ? 0 : nonZero(rng, -3, 3), c: rng.int(-5, 5) };
	if (f.a !== 0 && f.b === 0 && f.c === 0 && rng.next() < 0.7) return null;
	const vals = xs.map((x) => evalFn(f, q(x)).num);
	if (vals.some((v) => Math.abs(v) > 30)) return null;
	// At least one negative x where a mistake shows: a nonzero square or product.
	if (!xs.some((x) => x < 0)) return null;
	return { f, xs };
}

function tableProblem(t: TableBuilt): string {
	const cols = 'c'.repeat(t.xs.length);
	const table = `\\begin{array}{c|${cols}} x & ${t.xs.join(' & ')} \\\\ \\hline f(x) & ${t.xs.map(() => '?').join(' & ')} \\end{array}`;
	return `\\begin{gathered} f(x) = ${fnLatex(t.f)} \\\\ ${table} \\end{gathered}`;
}

const rowTex = (vals: Rational[]) => vals.map((v) => v.toLatex()).join(',\\ ');
const rowOption = (vals: Rational[]): ChoiceOption => ({ latex: rowTex(vals), values: vals.map((v) => v.toString()) });

function tableChoice(rng: Rng, t: TableBuilt): ChoiceAnswer | null {
	const X = t.xs.map((x) => q(x));
	const right = X.map((x) => evalFn(t.f, x));
	const withMistake = (name: string) => X.map((x, i) => mistakes(t.f, x)[name] ?? right[i]);
	const named = ['segno-quadrato', 'segno-prodotto', 'due-segni', 'coefficiente-al-quadrato'].map(withMistake);
	// One cell off by a slip in the arithmetic, as a reserve.
	const slips: Rational[][] = [];
	for (const d of shuffle(rng, [1, -1, 2, -2])) {
		const i = rng.int(0, X.length - 1);
		slips.push(right.map((v, j) => (j === i ? v.add(q(d)) : v)));
	}
	return assembleChoice(rng, rowOption(right), [...named, ...slips].map(rowOption));
}

function tableSteps(t: TableBuilt): string[] {
	const out = [`\\text{Sostituisci ogni valore di } x \\text{ nella legge, tra parentesi se è negativo.}`];
	for (const x of t.xs) out.push(...valueSteps(t.f, q(x), false));
	out.push(`\\text{La riga di } f(x) \\text{ è } ${rowTex(t.xs.map((x) => evalFn(t.f, q(x))))}`);
	return out;
}

// ---------------------------------------------------------------------------
// Level 6: the value at a letter expression, f(x) = m x + k

export type LetterArg = { kind: 'shift'; k: number } | { kind: 'opposite' } | { kind: 'multiple'; k: number };

/** The argument as a first-degree polynomial in a: [constant, coefficient of a]. */
function argPoly(g: LetterArg): [number, number] {
	if (g.kind === 'shift') return [g.k, 1];
	if (g.kind === 'opposite') return [0, -1];
	return [0, g.k];
}

const linA = (c0: number, c1: number) => polyToLatex(poly(c0, c1), 'a');
const linValue = (c0: number, c1: number) => `${c1}*a + (${c0})`;

function letterSteps(m: number, k0: number, g: LetterArg): string[] {
	const [p0, p1] = argPoly(g);
	const arg = linA(p0, p1);
	const fx = `f(${arg})`;
	const r0 = m * p0 + k0, r1 = m * p1;
	const result = linA(r0, r1);
	const signed = (n: number) => ` ${n < 0 ? '-' : '+'} ${Math.abs(n)}`;
	const out: string[] = [];
	if (g.kind === 'shift') {
		out.push(`\\text{Al posto di } x \\text{ scrivi } (${arg})\\text{, poi usa la proprietà distributiva:}`);
		out.push(`${fx} = ${m}(${arg})${signed(k0)}`);
		out.push(`= ${m}a${signed(m * p0)}${signed(k0)}`);
		out.push(`= ${result}`);
	} else {
		out.push(`\\text{Al posto di } x \\text{ scrivi } (${arg})\\text{:}`);
		out.push(`${fx} = ${m} \\cdot (${arg})${signed(k0)} = ${result}`);
	}
	// Check with a = 1, as in the lesson: f at the value of the argument, and the result with a = 1.
	const at1 = p0 + p1;
	const resultAt1 = r0 === 0 ? String(r1) : `${r1}${signed(r0)}`;
	out.push(`\\text{Controllo con } a = 1\\text{: } f(${at1}) = ${m * at1 + k0} \\text{ e } ${resultAt1} = ${r0 + r1}\\text{.}`);
	return out;
}

function letterChoice(rng: Rng, m: number, k0: number, g: LetterArg): ChoiceAnswer {
	const [p0, p1] = argPoly(g);
	const right: [number, number] = [m * p0 + k0, m * p1];
	const cands: [number, number][] = [];
	if (g.kind === 'shift') {
		cands.push([k0 + g.k, m]); // f(a) + k, the warning of the lesson; also m(a + k) with only a multiplied
		cands.push([-m * g.k + k0, m]); // the product m·k with the sign changed
		cands.push([m * g.k + k0, 1]); // only k multiplied: a + m·k + k0
		cands.push([k0, m]); // f(a)
	} else if (g.kind === 'opposite') {
		cands.push([k0, m]); // the minus lost: f(a)
		cands.push([-k0, -m]); // the minus on the whole value: -f(a)
		cands.push([m + k0, -1]); // m·(-a) read as m - a
	} else {
		cands.push([g.k * k0, g.k * m]); // k·f(a) in place of f(k·a)
		cands.push([k0, m]); // the k lost: f(a)
		cands.push([k0, m + g.k]); // m·k·a read as (m + k)·a
		cands.push([k0 + g.k, m * g.k]); // k added to the constant
	}
	for (let d = 1; d <= 4; d++) cands.push([right[0] + d, right[1]], [right[0] - d, right[1]]);
	const opt = ([c0, c1]: [number, number]): ChoiceOption => ({ latex: linA(c0, c1), values: [linValue(c0, c1)] });
	const ch = assembleChoice(rng, opt(right), cands.filter(([, c1]) => c1 !== 0).map(opt));
	if (!ch) throw new Error(`${ID}: not enough options at level 6`);
	return ch;
}

// ---------------------------------------------------------------------------
// Assemble

const VALUE_PROMPT = 'Calcola il valore della funzione.';

function valueSample(base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, f: Fn, x: Rational, split: boolean): Sample {
	const v = evalFn(f, x);
	const answer: NumberAnswer = { kind: 'number', value: v.toString() };
	const steps = valueSteps(f, x, split);
	const inParens = x.sign() < 0 ? ', tra parentesi' : !x.isInteger() && f.a !== 0 ? ', tra parentesi dove va elevato al quadrato' : '';
	if (x.sign() < 0 || !x.isInteger()) steps.unshift(`\\text{Sostituisci } ${x.toLatex()} \\text{ al posto di } x\\text{${inParens}.}`);
	return {
		...base,
		prompt: VALUE_PROMPT,
		problem: `\\begin{gathered} f(x) = ${fnLatex(f)} \\\\ ${argOfF(x)} = \\ ? \\end{gathered}`,
		solution: `${argOfF(x)} = ${v.toLatex()}`,
		steps,
		answer,
		params: { a: String(f.a), b: String(f.b), c: String(f.c), x: x.toString(), value: v.toString(), case: f.a === 0 ? 'primo-grado' : 'secondo-grado' },
	};
}

function assemble(rng: Rng, level: number): Sample | null {
	const base = { generatorId: ID, level, seed: rng.seed };
	switch (level) {
		case 1: {
			const kind = rng.pick(REL_CASES);
			const b = buildRel(rng, kind);
			const choice = relChoice(rng, b);
			if (!choice) return null;
			return {
				...base,
				prompt: 'Stabilisci se la relazione R da A a B è una funzione, e perché.',
				problem: relProblem(b),
				solution: relSolution[kind](b.culprit),
				steps: relSteps(b),
				answer: choice,
				params: { A: b.A.map(String), B: b.B, pairs: b.pairs.map((p) => [String(p[0]), p[1]]), case: kind, culprit: b.culprit === null ? null : String(b.culprit) },
			};
		}
		case 2: {
			const { f, x } = buildLevel2(rng);
			const s = valueSample(base, f, x, false);
			s.params.case = x.sign() < 0 ? 'negativo' : 'positivo';
			return s;
		}
		case 3: {
			const built = buildLevel3(rng);
			return built && valueSample(base, built.f, built.x, true);
		}
		case 4: {
			const built = buildLevel4(rng);
			return built && valueSample(base, built.f, built.x, true);
		}
		case 5: {
			const t = buildTable(rng);
			if (!t) return null;
			const choice = tableChoice(rng, t);
			if (!choice) return null;
			const vals = t.xs.map((x) => evalFn(t.f, q(x)));
			return {
				...base,
				prompt: 'Completa la tabella di valori: scegli la riga di f(x).',
				problem: tableProblem(t),
				solution: `f(x)\\text{: } ${rowTex(vals)}`,
				steps: tableSteps(t),
				answer: choice,
				params: { a: String(t.f.a), b: String(t.f.b), c: String(t.f.c), xs: t.xs.map(String), values: vals.map(String), case: t.f.a === 0 ? 'primo-grado' : 'secondo-grado' },
			};
		}
		case 6: {
			const m = nonZero(rng, -5, 5, [1, -1]);
			const k0 = nonZero(rng, -6, 6);
			const u = rng.next();
			const g: LetterArg = u < 0.5 ? { kind: 'shift', k: nonZero(rng, -3, 3) } : u < 0.75 ? { kind: 'opposite' } : { kind: 'multiple', k: rng.pick([2, 3]) };
			const [p0, p1] = argPoly(g);
			const r0 = m * p0 + k0, r1 = m * p1;
			const answer: ExpressionAnswer = { kind: 'expression', value: linValue(r0, r1), latex: linA(r0, r1), form: 'expanded' };
			const fx = `f(${linA(p0, p1)})`;
			return {
				...base,
				prompt: 'Calcola il valore della funzione e scrivilo senza parentesi.',
				problem: `\\begin{gathered} f(x) = ${fnLatex({ a: 0, b: m, c: k0 })} \\\\ ${fx} = \\ ? \\end{gathered}`,
				solution: `${fx} = ${answer.latex}`,
				steps: letterSteps(m, k0, g),
				answer,
				params: { m: String(m), k: String(k0), arg: g.kind, argK: 'k' in g ? String(g.k) : null, argPoly: [String(p0), String(p1)], case: g.kind },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const num = (v: unknown) => Number(v);

function checkChoiceShape(ch: ChoiceAnswer | undefined, v: string[], what: string): void {
	if (!ch || ch.kind !== 'choice') {
		v.push(`${what}: manca la scelta multipla`);
		return;
	}
	if (ch.options.length !== 4) v.push(`${what}: ${ch.options.length} opzioni invece di 4`);
	const keys = ch.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) v.push(`${what}: opzioni ripetute`);
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push(`${what}: indice della risposta fuori dalle opzioni`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	if (sample.steps.length === 0) v.push('nessun passaggio');
	switch (sample.level) {
		case 1: {
			const A = (p.A as string[]).map(Number), B = p.B as string[];
			const pairs = (p.pairs as [string, string][]).map(([x, y]) => [Number(x), y] as Pair);
			if (A.length < 3 || A.length > 5 || B.length < 3 || B.length > 4) v.push('A con 3-5 elementi, B con 3-4');
			if (pairs.some(([x, y]) => !A.includes(x) || !B.includes(y))) v.push('coppia fuori da A × B');
			const counts = A.map((x) => images(pairs, x).length);
			const kind: RelCase = counts.every((c) => c === 1) ? 'funzione' : counts.some((c) => c === 0) ? 'senza-immagine' : 'due-immagini';
			if (counts.filter((c) => c !== 1).length > 1) v.push('più di un elemento difettoso');
			if (p.case !== kind) v.push(`params.case ${String(p.case)} ma la relazione è ${kind}`);
			const ans = sample.answer;
			checkChoiceShape(ans.kind === 'choice' ? ans : undefined, v, 'risposta');
			if (ans.kind === 'choice') {
				const right = ans.options[ans.correct]?.values ?? [];
				if (right[0] !== kind) v.push('la risposta giusta non dice il caso della relazione');
				if (kind !== 'funzione' && Number(right[1]) !== A[counts.findIndex((c) => c !== 1)]) v.push("la risposta giusta nomina l'elemento sbagliato");
			}
			break;
		}
		case 2:
		case 3:
		case 4: {
			const f: Fn = { a: num(p.a), b: num(p.b), c: num(p.c) };
			const x = Rational.parse(String(p.x));
			const val = evalFn(f, x);
			if (sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('risposta diversa da f(x)');
			if (sample.level === 2 && (f.a !== 0 || Math.abs(f.b) < 2 || f.c === 0 || !x.isInteger() || x.isZero() || Math.abs(x.num) > 5)) v.push('livello 2: ax + b, |a| ≥ 2, b ≠ 0, x intero non nullo');
			if (sample.level === 3 && (f.a === 0 || !x.isInteger() || x.sign() >= 0 || Math.abs(val.num) > 60)) v.push('livello 3: secondo grado in un intero negativo');
			if (sample.level === 4 && (x.isInteger() || val.den > 25 || Math.abs(val.num) > 60)) v.push('livello 4: x frazione, risultato con numeri piccoli');
			break;
		}
		case 5: {
			const f: Fn = { a: num(p.a), b: num(p.b), c: num(p.c) };
			const xs = (p.xs as string[]).map(Number);
			const vals = xs.map((x) => evalFn(f, q(x)).toString());
			if (xs.length !== 5 || xs.some((x, i) => i > 0 && x !== xs[i - 1] + 1) || !xs.includes(0) || xs[0] >= 0) v.push('cinque interi consecutivi con lo zero e almeno un negativo');
			const ans = sample.answer;
			checkChoiceShape(ans.kind === 'choice' ? ans : undefined, v, 'risposta');
			if (ans.kind === 'choice' && ans.options[ans.correct]?.values.join(',') !== vals.join(',')) v.push('la riga giusta non è quella dei valori');
			break;
		}
		case 6: {
			const m = num(p.m), k0 = num(p.k);
			const [p0, p1] = (p.argPoly as string[]).map(Number);
			if (Math.abs(m) < 2 || k0 === 0) v.push('livello 6: |m| ≥ 2 e termine noto non nullo');
			if (sample.answer.kind !== 'expression' || sample.answer.value !== linValue(m * p0 + k0, m * p1)) v.push('risposta diversa da f(argomento)');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.choice) {
		checkChoiceShape(sample.choice, v, 'scelta');
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice for levels 2, 3, 4 and 6 (levels 1 and 5 are born as multiple choice)

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	if (sample.level >= 2 && sample.level <= 4) return valueChoice(rng, { a: num(p.a), b: num(p.b), c: num(p.c) }, Rational.parse(String(p.x)));
	if (sample.level === 6) {
		const kind = p.arg as LetterArg['kind'];
		const g: LetterArg = kind === 'opposite' ? { kind } : { kind, k: num(p.argK) };
		return letterChoice(rng, num(p.m), num(p.k), g);
	}
	throw new Error(`${ID}: no multiple choice for level ${sample.level}`);
}

// ---------------------------------------------------------------------------

export const definizioneFunzione: Generator = {
	id: ID,
	title: 'Definizione di funzione',
	levels: {
		1: { label: 'Riconoscere una funzione da un elenco di coppie', constraints: ['A di 3-5 numeri tra 0 e 6, B di 3-4 lettere', 'funzione, un elemento con due immagini o un elemento senza immagine, un terzo ciascuno', 'il perché nelle opzioni, con la risposta che guarda B tra i distrattori'] },
		2: { label: 'Valore di una funzione di primo grado in un intero', constraints: ['f(x) = ax + b, 2 ≤ |a| ≤ 6, b ≠ 0, |b| ≤ 9', 'x intero tra -5 e 5, non nullo, negativo sei volte su dieci'] },
		3: { label: 'Valore di una funzione di secondo grado in un intero negativo', constraints: ['f(x) = ax^2 + bx + c con a tra -2 e 3, |b| ≤ 5, |c| ≤ 6', 'x tra -3 e -1, |f(x)| ≤ 60'] },
		4: { label: 'Valore in una frazione, anche negativa', constraints: ['x = ±p/q con q da 2 a 5', 'primo grado tre volte su dieci, secondo grado le altre', 'risultato con denominatore ≤ 25 e |numeratore| ≤ 60'] },
		5: { label: 'Tabella di valori', constraints: ['cinque interi consecutivi con lo zero e almeno un negativo', 'ax + b o ax^2 + bx + c, valori tra -30 e 30', 'si sceglie la riga giusta di f(x)'] },
		6: { label: "Valore in un'espressione con una lettera", constraints: ['f(x) = mx + k, 2 ≤ |m| ≤ 5, k ≠ 0', 'f(a + h), f(-a), f(2a), f(3a)'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = assemble(rng, level);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default definizioneFunzione;
