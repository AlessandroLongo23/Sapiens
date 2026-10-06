/**
 * Shared pieces of the generators of the chapter "Funzioni e loro proprietà" (lessons 105-109):
 * funzioni-reali-di-variabile-reale, funzioni-dispari-pari, funzioni-monotone, funzioni-periodiche,
 * grafici-trasformazioni.
 *
 * - a formula written twice, in LaTeX for the student and as a SymPy string for the checker (`Fx`), built from
 *   polynomials, fractions, square roots and absolute values;
 * - unions of intervals with rational ends, written with the reversed brackets of the lessons, and their
 *   multiple choice;
 * - options that are a word, a number, a point or a formula;
 * - the common checks of a sample.
 *
 * The independent checks are in scripts/exercises/checkers/_funzioni.py.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { assembleChoice, textBlock } from './insiemi';
import { type Poly, poly, polyDegree, polyToLatex } from './latex';
import { Rational, q } from './rational';

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.,}])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.,}])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
];

export function forbidden(tex: string): string[] {
	return FORBIDDEN_PATTERNS.filter((p) => p.re.test(tex)).map((p) => `scrittura vietata: ${p.name}`);
}

// ---------------------------------------------------------------------------
// Formulas

/** A formula in x: LaTeX and SymPy. `sum` says that it needs brackets inside a product or after a minus. */
export interface Fx {
	tex: string;
	py: string;
	sum: boolean;
}

const ratPy = (r: Rational) => (r.isInteger() ? `${r.num}` : `Rational(${r.num},${r.den})`);

/** SymPy string of a polynomial: "x**2 - 5*x + 6". */
export function polyPy(p: Poly): string {
	const parts: string[] = [];
	for (let d = p.length - 1; d >= 0; d--) {
		const c = p[d];
		if (c.isZero()) continue;
		parts.push(`(${ratPy(c)})${d === 0 ? '' : d === 1 ? '*x' : `*x**${d}`}`);
	}
	return parts.length ? parts.join(' + ') : '0';
}

const terms = (p: Poly) => p.filter((c) => !c.isZero()).length;

/** A polynomial by degree: P(6, -5, 1) is x^2 - 5x + 6. */
export const P = (...byDegree: number[]): Fx => fromPoly(poly(...byDegree));
export const fromPoly = (p: Poly): Fx => ({ tex: polyToLatex(p), py: polyPy(p), sum: terms(p) > 1 || (polyDegree(p) >= 0 && p[polyDegree(p)].sign() < 0) });

const br = (f: Fx) => (f.sum ? `(${f.tex})` : f.tex);

export const frac = (n: Fx, d: Fx): Fx => ({ tex: `\\dfrac{${n.tex}}{${d.tex}}`, py: `(${n.py})/(${d.py})`, sum: false });
export const sqrt = (a: Fx): Fx => ({ tex: `\\sqrt{${a.tex}}`, py: `sqrt(${a.py})`, sum: false });
export const abs = (a: Fx): Fx => ({ tex: `\\lvert ${a.tex} \\rvert`, py: `Abs(${a.py})`, sum: false });
/** A product written side by side: (x + 2)\sqrt{x - 1}. */
export const mul = (a: Fx, b: Fx): Fx => ({ tex: `${br(a)}${b.tex.startsWith('\\lvert') && !a.sum ? ' \\cdot ' : ''}${br(b)}`, py: `(${a.py})*(${b.py})`, sum: false });
export const neg = (a: Fx): Fx => ({ tex: `-${br(a)}`, py: `-(${a.py})`, sum: true });
/** k·a with an integer k that is not 0: 2\sqrt{x}, -\sqrt{x}, 3\lvert x \rvert. */
export function times(k: number, a: Fx): Fx {
	const head = k === 1 ? '' : k === -1 ? '-' : `${k}`;
	return { tex: `${head}${br(a)}`, py: `(${k})*(${a.py})`, sum: k < 0 };
}
/** a + k with an integer k: \sqrt{x} + 3, \lvert x \rvert - 2; k = 0 leaves a. */
export function plus(a: Fx, k: number): Fx {
	if (k === 0) return a;
	return { tex: `${a.tex} ${k < 0 ? '-' : '+'} ${Math.abs(k)}`, py: `(${a.py}) + (${k})`, sum: true };
}
export const power = (a: Fx, n: number): Fx => ({ tex: `${a.sum || a.tex.length > 1 ? `(${a.tex})` : a.tex}^${n}`, py: `(${a.py})**${n}`, sum: false });

// ---------------------------------------------------------------------------
// Intervals

/** An interval as written; null is -∞ at the left and +∞ at the right. */
export interface Iv {
	lo: Rational | null;
	hi: Rational | null;
	loC: boolean;
	hiC: boolean;
}

export const ALL: Iv[] = [{ lo: null, hi: null, loC: false, hiC: false }];
export const from = (a: Rational, closed: boolean): Iv => ({ lo: a, hi: null, loC: closed, hiC: false });
export const upTo = (a: Rational, closed: boolean): Iv => ({ lo: null, hi: a, loC: false, hiC: closed });
export const between = (a: Rational, aC: boolean, b: Rational, bC: boolean): Iv => ({ lo: a, hi: b, loC: aC, hiC: bC });

/** ℝ without the given points, sorted: ]-∞, a[ ∪ ]a, b[ ∪ ]b, +∞[. */
export function without(points: Rational[]): Iv[] {
	const ps = [...points].sort((a, b) => a.compare(b));
	const out: Iv[] = [];
	let lo: Rational | null = null;
	for (const p of ps) {
		out.push({ lo, hi: p, loC: false, hiC: false });
		lo = p;
	}
	out.push({ lo, hi: null, loC: false, hiC: false });
	return out;
}

const endKey = (r: Rational | null, inf: string) => (r ? r.toString() : inf);
/** "(-oo,-3)", "[1,oo)", "[-2,5/2)": the values of an option, one per interval. */
export const ivValue = (iv: Iv) => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
export const ivsKey = (ivs: Iv[]) => ivs.map(ivValue).join('|');

const isAll = (ivs: Iv[]) => ivs.length === 1 && !ivs[0].lo && !ivs[0].hi;
/** ℝ without some points: the points, or null. */
function missingPoints(ivs: Iv[]): Rational[] | null {
	if (ivs.length < 2 || ivs[0].lo || ivs[ivs.length - 1].hi) return null;
	const out: Rational[] = [];
	for (let i = 0; i + 1 < ivs.length; i++) {
		const a = ivs[i].hi;
		const b = ivs[i + 1].lo;
		if (!a || !b || !a.equals(b) || ivs[i].hiC || ivs[i + 1].loC) return null;
		out.push(a);
	}
	return out;
}

const fractional = (r: Rational | null) => !!r && !r.isInteger();

/** One interval with the brackets of the lessons: ]-1, 4] is \mathopen{]}-1, 4]. */
export function intervalLatex(iv: Iv): string {
	const lo = iv.lo ? iv.lo.toLatex() : '-\\infty';
	const hi = iv.hi ? iv.hi.toLatex() : '+\\infty';
	if (fractional(iv.lo) || fractional(iv.hi)) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/**
 * A set of real numbers as the lessons write it: \emptyset, \mathbb{R}, \mathbb{R} \setminus \{2,\ 3\}, or a
 * union of intervals; three intervals, or two with a fraction, go on two lines.
 */
export function ivsLatex(ivs: Iv[]): string {
	if (!ivs.length) return '\\emptyset';
	if (isAll(ivs)) return '\\mathbb{R}';
	const pts = missingPoints(ivs);
	if (pts) return `\\mathbb{R} \\setminus \\{${pts.map((p) => p.toLatex()).join(',\\ ')}\\}`;
	const parts = ivs.map(intervalLatex);
	const wide = ivs.length > 2 || (ivs.length === 2 && ivs.some((iv) => fractional(iv.lo) || fractional(iv.hi)));
	if (wide) return `\\begin{gathered} ${parts.slice(0, -1).join(' \\cup ')} \\\\ \\cup\\, ${parts[parts.length - 1]} \\end{gathered}`;
	return parts.join(' \\cup ');
}

export const ivOption = (ivs: Iv[]): ChoiceOption => ({ latex: ivsLatex(ivs), values: ivs.map(ivValue) });

/** Four options, the right set first in `cands` order of preference; null if the wrong ones are too few. */
export function ivChoice(rng: Rng, truth: Iv[], cands: Iv[][]): ChoiceAnswer | null {
	return assembleChoice(rng, ivOption(truth), cands.map(ivOption));
}

// ---------------------------------------------------------------------------
// Other options

export const tx = (s: string) => `\\text{${s}}`;
/** A sentence with formulas between dollars, as one LaTeX line: say('Il numero $-9$ è fuori.'). */
export const say = (s: string) =>
	s
		.split('$')
		.map((part, i) => (i % 2 ? part : part ? tx(part) : ''))
		.join('');
/** An option that is a word or a sentence: the value is its key. */
export const labelOption = (key: string, text: string): ChoiceOption => ({ latex: tx(text), values: [key] });
/** An option that is a formula: the value is its SymPy string. */
export const fxOption = (f: Fx, lead = 'y = '): ChoiceOption => ({ latex: `${lead}${f.tex}`, values: [f.py] });

/** A number written with the decimal comma when it has at most two decimals and is not an integer, else as a fraction. */
export function numTex(r: Rational, decimal = false): string {
	if (!decimal || r.isInteger()) return r.toLatex();
	for (const d of [1, 2, 3]) {
		const s = r.mul(q(10 ** d));
		if (s.isInteger()) {
			const digits = String(Math.abs(s.num)).padStart(d + 1, '0');
			return `${s.num < 0 ? '-' : ''}${digits.slice(0, -d)}{,}${digits.slice(-d)}`;
		}
	}
	return r.toLatex();
}

export const ratOption = (r: Rational, decimal = false): ChoiceOption => ({ latex: numTex(r, decimal), values: [r.toString()] });

export function ratChoice(rng: Rng, value: Rational, wrong: Rational[], decimal = false): ChoiceAnswer | null {
	return assembleChoice(
		rng,
		ratOption(value, decimal),
		wrong.map((w) => ratOption(w, decimal)),
	);
}

/** (2, -3), with \left( \right) around fractions. */
export function pointTex(x: Rational, y: Rational): string {
	return x.isInteger() && y.isInteger() ? `(${x.toLatex()}, ${y.toLatex()})` : `\\left(${x.toLatex()}, ${y.toLatex()}\\right)`;
}
export const pointOption = (x: Rational, y: Rational): ChoiceOption => ({ latex: pointTex(x, y), values: [x.toString(), y.toString()] });
export function pointChoice(rng: Rng, p: [Rational, Rational], wrong: [Rational, Rational][]): ChoiceAnswer | null {
	return assembleChoice(
		rng,
		pointOption(p[0], p[1]),
		wrong.map((w) => pointOption(w[0], w[1])),
	);
}

/** A set of numbers, \{-1,\ 3\} or \emptyset: the value is the sorted list. */
export function setOption(xs: Rational[]): ChoiceOption {
	const s = [...xs].sort((a, b) => a.compare(b));
	return { latex: s.length ? `\\{${s.map((v) => v.toLatex()).join(',\\ ')}\\}` : '\\emptyset', values: s.map(String) };
}

/** Prose of a problem on lines that fit a phone, with a formula under it if there is one. */
export const prose = (text: string, ...extra: string[]) => textBlock(text, 44, extra);

// ---------------------------------------------------------------------------
// Checks every generator of the chapter makes on its own samples

export function commonCheck(s: Sample, choice: ChoiceAnswer | undefined): string[] {
	const errs: string[] = [];
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	errs.push(...forbidden(s.problem));
	const ch = s.answer.kind === 'choice' ? s.answer : choice;
	if (ch) {
		if (ch.options.length !== 4) errs.push('servono quattro opzioni');
		const keys = ch.options.map((o) => o.values.join('|') + '#' + (o.values.length ? '' : o.latex));
		if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) errs.push('opzioni scritte uguali');
		if (ch.correct < 0 || ch.correct >= ch.options.length) errs.push('indice della risposta fuori posto');
	}
	return errs;
}

/** Tries a builder until it gives a sample: a builder returns null when its numbers do not fit. */
export function retry<T>(id: string, level: number, build: () => T | null): T {
	for (let i = 0; i < 400; i++) {
		const out = build();
		if (out) return out;
	}
	throw new Error(`${id}: livello ${level} senza un esercizio valido dopo 400 tentativi`);
}
