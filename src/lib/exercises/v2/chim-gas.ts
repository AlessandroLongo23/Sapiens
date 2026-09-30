/**
 * What the six generators of the gas laws share (chemistry, second year, group 26: chim-teoria-cinetica,
 * chim-pressione-gas, chim-legge-boyle, chim-legge-charles-gay-lussac, chim-equazione-generale-gas,
 * chim-principio-avogadro): quantities written as the lessons 29-34 write them (decimal comma, the unit after a thin
 * space, degrees Celsius as ^\circ\text{C}, kelvin as \text{K}, scientific notation with \cdot 10^{n}), results rounded
 * to n significant figures and refused near a rounding boundary (fis-calore.ts's `sig`), multiple choice with the
 * unit in every option, and options that are words or formulas, wrapped on a phone.
 *
 * Option values are plain strings the checkers read back: a decimal ("3.33", "1.7e5", "-18") for a quantity, a label
 * for a word or a formula. Two options never share a value.
 *
 * Data: relative molecular masses from the table of lesson 01 (H 1,01, C 12,01, N 14,01, O 16,00, S 32,07, Cl 35,45),
 * plus He 4,00, Ar 39,95 and F 19,00, which the exercises always write in the text. 1 atm = 760 mmHg = 101,3 kPa,
 * T = t + 273, as the lessons.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { choiceOf, decTex } from './vettori';
import { sig as sigCalore } from './fis-calore';

export { type Built, generateWith } from './fisica-equilibrio';
export { textBlock, shuffle } from './insiemi';
export { choiceOf, decTex };

/**
 * x rounded to n significant figures (fis-calore.ts): plain below 10^n, otherwise in scientific notation; null near a
 * rounding boundary, and null when the plain result would end with an ambiguous zero (240 with three figures, 30 with
 * two), which the physics README asks to avoid.
 */
export function sig(x: number, n: number): { tex: string; value: string } | null {
	const r = sigCalore(x, n);
	if (r && /^\d*0$/.test(r.value)) return null;
	return r;
}

export const t = (s: string) => `\\text{${s}}`;
export const tex = (s: string) => decTex(s);

/** The units, as the lessons write them after the thin space; `n` is a bare number. */
export const UNIT = {
	atm: '\\text{atm}',
	kPa: '\\text{kPa}',
	mmHg: '\\text{mmHg}',
	bar: '\\text{bar}',
	Pa: '\\text{Pa}',
	N: '\\text{N}',
	L: '\\text{L}',
	mL: '\\text{mL}',
	m3: '\\text{m}^3',
	cm3: '\\text{cm}^3',
	cm2: '\\text{cm}^2',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	ms: '\\text{m/s}',
	g: '\\text{g}',
	pct: '\\%',
	n: '',
} as const;
export type Unit = keyof typeof UNIT;

/** A quantity in LaTeX: 2{,}5\,\text{atm}; a bare number for `n`. */
export const q = (num: string, u: Unit) => (u === 'n' ? num : `${num}\\,${UNIT[u]}`);
/** The same in prose: $…$. */
export const pq = (num: string, u: Unit) => `$${q(num, u)}$`;
/** A decimal string as a quantity in prose: pqs("2.5", "atm") = $2{,}5\,\text{atm}$. */
export const pqs = (s: string, u: Unit) => pq(tex(s), u);

/** A rounded result as an option. */
export const opt = (r: { tex: string; value: string }, u: Unit): ChoiceOption => ({ latex: q(r.tex, u), values: [r.value] });

/** Options from exact values, rounded like the answer; values refused by the rounding, or not positive, are skipped. */
export function optsOf(xs: number[], n: number, u: Unit): ChoiceOption[] {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => opt(r, u));
}

/** The answer and its mistakes, with fallbacks (x·1,2, x·0,8, x·1,4, x·0,6) when mistakes coincide. */
export function answerOf(rng: Rng, right: { tex: string; value: string }, exact: number, mistakes: number[], n: number, u: Unit, fallback = [exact * 1.2, exact * 0.8, exact * 1.4, exact * 0.6]): ChoiceAnswer {
	return choiceOf(rng, opt(right, u), optsOf(mistakes, n, u), optsOf(fallback, n, u));
}

/** A whole number (maybe negative) as an option: -18\,^\circ\text{C}. */
export const intOpt = (x: number, u: Unit): ChoiceOption => ({ latex: q(String(Math.round(x)), u), values: [String(Math.round(x))] });

/** The answer and its mistakes when they are whole numbers (temperatures). */
export function intAnswer(rng: Rng, right: number, mistakes: number[], u: Unit, fallback: number[]): ChoiceAnswer {
	return choiceOf(rng, intOpt(right, u), mistakes.map((x) => intOpt(x, u)), fallback.map((x) => intOpt(x, u)));
}

/**
 * An option made of words (with $…$ formulas inside): on more lines, at most 24 visible characters each, so that it
 * fits the 252 px of an answer button on a phone.
 */
export function wordsOpt(label: string, value: string): ChoiceOption {
	const words = label.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const visible = (s: string) => s.replace(/\$([^$]*)\$/g, (_, m: string) => m.replace(/\\[a-z]+|[{}_^]/g, '')).length;
	const lines: string[] = [];
	for (const w of words) {
		const last = lines.at(-1);
		if (last !== undefined && visible(last) + 1 + visible(w) <= 24) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	const line = (l: string) =>
		l
			.split(/(\$[^$]*\$)/)
			.filter(Boolean)
			.map((p) => (p.startsWith('$') ? p.slice(1, -1) : t(p)))
			.join('');
	const latex = lines.length === 1 ? line(lines[0]) : `\\begin{gathered} ${lines.map(line).join(' \\\\ ')} \\end{gathered}`;
	return { latex, values: [value] };
}

/** An option that is a chemical formula: \mathrm{NH_3}. */
export const formulaOpt = (f: string, value: string): ChoiceOption => ({ latex: `\\mathrm{${f}}`, values: [value] });

const BANNED = /—|piuttosto che/;

/** The common checks: steps, banned words, four options with different text and different values, a valid index. */
export function checkChoice(sample: Sample): string[] {
	const out: string[] = [];
	if (!sample.steps.length) out.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) out.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) out.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values[0])).size !== 4) out.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) out.push("indice dell'opzione giusta fuori dai limiti");
	return out;
}

/** A decimal string with `d` decimals from a count of units (k = 35, d = 2 → "0.35"). */
export const dec = (k: number, d: number) => (k / 10 ** d).toFixed(d);

/** A value with two significant figures, 1,1 to 9,9 without a trailing zero, as a string. */
export function two(rng: Rng, lo = 11, hi = 99): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return dec(k, 1);
	}
}

/** A value with three significant figures from lo to hi hundredths (1,25 → k = 125), no trailing zero. */
export function three(rng: Rng, lo: number, hi: number, d = 2): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return dec(k, d);
	}
}

/** T = t + 273, as the lessons. */
export const kelvin = (tc: number) => tc + 273;
