/**
 * What the four generators of the chapter on the mole share (chemistry, second year, group 27: chim-formula-minima,
 * chim-volume-molare, gas-ideali, chim-pressioni-parziali): the atomic masses of lesson 01 in hundredths (so molar
 * masses are exact integers of hundredths), formulas read and written as the lessons write them (\mathrm{C_6H_{12}O_6},
 * carbon first for the compounds of carbon, the traditional order for the others), numbers with the decimal comma and
 * the unit after a thin space, results rounded to n significant figures and refused near a rounding tie, and options
 * that carry their unit. Values in the options are plain decimal strings ("30.4", "0.0308", "2.69e22").
 *
 * Constants of the biennio (docs/lezioni/chimica/README.md, "Il biennio"): V_m = 22,4 L/mol at 0 °C and 1 atm,
 * R = 0,0821 L·atm/(mol·K) = 8,31 J/(mol·K), N_A = 6,02 · 10^23 mol^-1, T = t + 273, 1 atm = 760 mmHg.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { BANNED, choiceOf, decTex } from './vettori';

export { choiceOf, decTex };
export { type Built, generateWith } from './fisica-equilibrio';
export { textBlock } from './insiemi';

/** Atomic masses of lesson 01, in hundredths of u. */
export const MASS100: Record<string, number> = { H: 101, C: 1201, N: 1401, O: 1600, Na: 2299, Mg: 2431, P: 3097, S: 3207, Cl: 3545, K: 3910, Ca: 4008, Fe: 5585 };
export const VM = 22.4;
export const R_ATM = 0.0821;
export const R_SI = 8.31;
export const NA = 6.02e23;

export type Formula = [string, number][];

/** "C6H12O6" → [["C", 6], ["H", 12], ["O", 6]]. */
export function parseFormula(s: string): Formula {
	const out: Formula = [];
	for (const m of s.matchAll(/([A-Z][a-z]?)(\d*)/g)) if (m[1]) out.push([m[1], m[2] ? Number(m[2]) : 1]);
	return out;
}
/** [["C", 6], ...] → "C6H12O6". */
export const formulaStr = (f: Formula) => f.map(([e, k]) => (k === 1 ? e : `${e}${k}`)).join('');
/** The formula in LaTeX: \mathrm{C_6H_{12}O_6}. */
export const formulaTex = (f: Formula | string) => {
	const ff = typeof f === 'string' ? parseFormula(f) : f;
	return `\\mathrm{${ff.map(([e, k]) => (k === 1 ? e : k < 10 ? `${e}_${k}` : `${e}_{${k}}`)).join('')}}`;
};
/** The molar mass in hundredths of g/mol (an integer). */
export const molar100 = (f: Formula | string) => (typeof f === 'string' ? parseFormula(f) : f).reduce((s, [e, k]) => s + MASS100[e] * k, 0);
/** The molar mass as a decimal string with two decimals ("44.01"). */
export const molarStr = (f: Formula | string) => (molar100(f) / 100).toFixed(2);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** The empirical formula: every index divided by their greatest common divisor. */
export function minimal(f: Formula): { f: Formula; n: number } {
	const n = f.map(([, k]) => k).reduce(gcd);
	return { f: f.map(([e, k]) => [e, k / n]), n };
}
/** The formula with every index multiplied by k. */
export const times = (f: Formula, k: number): Formula => f.map(([e, x]) => [e, x * k]);

/** The option of a formula. */
export const formulaOpt = (f: Formula): ChoiceOption => ({ latex: formulaTex(f), values: [formulaStr(f)] });

// ---------------------------------------------------------------------------
// Numbers

/** Units as the lessons write them. */
export const UNIT: Record<string, string> = {
	g: '\\text{g}',
	gmol: '\\text{g/mol}',
	mol: '\\text{mol}',
	L: '\\text{L}',
	mL: '\\text{mL}',
	atm: '\\text{atm}',
	kPa: '\\text{kPa}',
	mmHg: '\\text{mmHg}',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	gL: '\\text{g/L}',
	pct: '\\%',
	molecole: '\\text{molecole}',
};

/** A quantity in LaTeX: 22{,}4\,\text{L}. */
export const q = (num: string, u: string) => `${num}\\,${UNIT[u]}`;
/** The same inside prose: $…$. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;
export const t = (s: string) => `\\text{${s}}`;

/** Is x within 1e-6 (relative to the digit) of a rounding tie at the digit 10^k? */
function tie(x: number, k: number) {
	const y = Math.abs(x) / 10 ** k;
	return Math.abs(y - Math.floor(y) - 0.5) < 1e-6;
}

/**
 * x rounded to n significant figures, as LaTeX and as a value string. Plain from 0,01 to below 10^n (0,0308; 48,9;
 * 731), otherwise in scientific notation (9{,}83 \cdot 10^{-3}, 2{,}69 \cdot 10^{22}). Null near a tie.
 */
export function sig(x: number, n: number): { tex: string; value: string } | null {
	if (!Number.isFinite(x) || x <= 0) return null;
	let e = Math.floor(Math.log10(x));
	if (10 ** e > x) e -= 1;
	if (10 ** (e + 1) <= x) e += 1;
	if (tie(x, e - n + 1)) return null;
	let m = Math.round(x / 10 ** (e - n + 1));
	if (m >= 10 ** n) {
		m /= 10;
		e += 1;
	}
	if (e < n && e >= -2) {
		const k = n - 1 - e;
		const s = k > 0 ? (m / 10 ** k).toFixed(k) : String(m * 10 ** -k);
		return { tex: decTex(s), value: s };
	}
	const mant = (m / 10 ** (n - 1)).toFixed(n - 1);
	return { tex: `${decTex(mant)} \\cdot 10^{${e}}`, value: `${mant}e${e}` };
}

/** A datum with n significant figures, written plain: 0.761, 5.60, 22.4 (for data between 0,01 and 10^n). */
export function datum(x: number, n: number): string {
	const r = sig(x, n);
	if (!r || r.value.includes('e')) throw new Error('datum out of range');
	return r.value;
}

/** The option of a rounded quantity. */
export const opt = (r: { tex: string; value: string }, u: string): ChoiceOption => ({ latex: q(r.tex, u), values: [r.value] });

/** Options from exact values, rounded like the answer; the ones refused are skipped. */
export function optsOf(xs: number[], n: number, u: string): ChoiceOption[] {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => opt(r, u));
}

/** The answer and its mistakes, with fallbacks (by default x·1,2, x·0,8, x·1,5, x·0,5) when two mistakes coincide. */
export function answerOf(rng: Rng, exact: number, mistakes: number[], n: number, u: string, fallback = [exact * 1.2, exact * 0.8, exact * 1.5, exact * 0.5]): ChoiceAnswer {
	const right = sig(exact, n);
	if (!right) throw new Error('answer near a tie');
	return choiceOf(rng, opt(right, u), optsOf(mistakes, n, u), optsOf(fallback, n, u));
}

/** An integer in [lo, hi] that does not end in 0 (no ambiguous trailing zero once written). */
export function noZero(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
}

/** A datum with three significant figures between lo and hi (e.g. 0.100 to 5.00), as a decimal string. */
export function three(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const e = rng.int(Math.floor(Math.log10(lo)), Math.floor(Math.log10(hi)));
		const k = rng.int(100, 999);
		const x = (k * 10 ** (e - 2));
		if (x < lo || x > hi) continue;
		const s = datum(x, 3);
		if (!s.includes('.') && s.endsWith('0')) continue;
		return s;
	}
}

/**
 * The common checks: steps, banned words, four distinct options; options that are numbers must have distinct values,
 * options that are formulas distinct formulas.
 */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	const vals = a.options.map((o) => o.values[0]);
	const numeric = vals.every((x) => Number.isFinite(Number(x)));
	if (new Set<string | number>(numeric ? vals.map(Number) : vals).size !== 4) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}
