/**
 * What the four generators of the first half of the chemistry chapter "Dalle trasformazioni chimiche alla teoria
 * atomica" share (first year, group 24: chim-trasformazioni-fisiche-chimiche, chim-elementi-composti,
 * chim-legge-lavoisier, chim-legge-proust): options that are words (on two or three lines when too wide for a phone),
 * masses in grams with a fixed number of decimals, pure numbers, the four options and the common checks.
 *
 * Masses are handled as whole numbers of hundredths of a gram, so sums and differences are exact; they are written as
 * the lessons write them (decimal comma {,}, the unit after a thin space: 7{,}87\,\text{g}). Values in the options are
 * plain decimal strings ("7.87"), so the checkers can read them back.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { BANNED } from './fis-grandezze';
import { shuffle } from './insiemi';

export { type Built, generateWith } from './fisica-equilibrio';
export { textBlock, shuffle, pickDistinct } from './insiemi';
export { BANNED };

export const t = (s: string) => `\\text{${s}}`;
export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'];

/** A label split into lines of at most `width` characters, as a LaTeX option: one \text, or a gathered block. */
export function wrapText(label: string, width = 26): string {
	const words = label.split(' ');
	const lines: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && cur.length + 1 + w.length > width) {
			lines.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) lines.push(cur);
	return lines.length === 1 ? t(lines[0]) : `\\begin{gathered}${lines.map(t).join(' \\\\ ')}\\end{gathered}`;
}

/** An option that is words; its value is the label itself unless given. */
export const textOpt = (label: string, value = label): ChoiceOption => ({ latex: wrapText(label), values: [value] });

/** A whole number as an option. */
export const intOpt = (n: number): ChoiceOption => ({ latex: String(n), values: [String(n)] });

/**
 * The four options: the right one, then the mistakes in order of preference, then the fallbacks; two options with the
 * same value or the same text count once. Throws if fewer than four remain (the level draws again).
 */
export function choose(rng: Rng, right: ChoiceOption, mistakes: ChoiceOption[], fallback: ChoiceOption[] = []): ChoiceAnswer {
	const keys = new Set([right.values.join('|')]);
	const texts = new Set([right.latex]);
	const opts = [right];
	for (const o of [...mistakes, ...fallback]) {
		if (opts.length >= 4) break;
		const k = o.values.join('|');
		if (keys.has(k) || texts.has(o.latex)) continue;
		keys.add(k);
		texts.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error('not enough distinct options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Masses in hundredths of a gram

/** Hundredths of a gram as a decimal string with `d` decimals (2 or fewer): 787 → "7.87"; 4400, d = 1 → "44.0". */
export function cg(n: number, d = 2): string {
	if (!Number.isInteger(n)) throw new Error(`cg: ${n} is not a whole number of hundredths`);
	const s = (n / 100).toFixed(d);
	if (Math.abs(Number(s) * 100 - n) > 1e-6) throw new Error(`cg: ${n} has more than ${d} decimals`);
	return s;
}
/** A decimal string in LaTeX: "7.87" → 7{,}87. */
export const dt = (s: string) => s.replace('.', '{,}');
/** A mass in grams in LaTeX, and inside prose. */
export const gq = (s: string) => `${dt(s)}\\,\\text{g}`;
export const pg = (s: string) => `$${gq(s)}$`;
/** An option that is a mass in grams; `extra` adds words after it (2{,}26\,\text{g di zolfo}). */
export const gOpt = (s: string, extra = ''): ChoiceOption => ({ latex: `${dt(s)}\\,\\text{g${extra ? ` ${extra}` : ''}}`, values: [extra ? `${s} ${extra}` : s] });
/** An option that is a pure number. */
export const numOpt = (s: string): ChoiceOption => ({ latex: dt(s), values: [s] });

/** Is x within `eps` of a rounding tie at the digit 10^k? */
function tieAt(x: number, k: number, eps = 1e-6) {
	const y = Math.abs(x) / 10 ** k;
	return Math.abs(y - Math.floor(y) - 0.5) < eps;
}

/**
 * x > 0 rounded to n significant figures, as a plain decimal string ("3.96", "0.253", "15.7", "28.0"), or null near a
 * tie, below 0,001 or from 10^n up (where the zeros would be ambiguous).
 */
export function sig(x: number, n: number): string | null {
	if (!Number.isFinite(x) || x < 0.001) return null;
	let e = Math.floor(Math.log10(x));
	if (10 ** e > x) e -= 1;
	if (10 ** (e + 1) <= x) e += 1;
	if (e >= n || tieAt(x, e - n + 1)) return null;
	let m = Math.round(x / 10 ** (e - n + 1));
	if (m >= 10 ** n) {
		m /= 10;
		e += 1;
		if (e >= n) return null;
	}
	const k = n - 1 - e;
	return (m / 10 ** k).toFixed(Math.max(0, k));
}

/** x rounded to `d` decimals as a string, or null near a tie. */
export function fixed(x: number, d: number): string | null {
	if (!Number.isFinite(x) || x <= 0 || tieAt(x, -d)) return null;
	return x.toFixed(d);
}

/** The checks every sample of the group passes: steps, no banned words, four distinct options, a valid index. */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== 4) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}
