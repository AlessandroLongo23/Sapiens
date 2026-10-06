/**
 * What the four generators of the chapter "La dinamica e la relatività galileiana" share (physics, third year, group
 * 31: fis-sistemi-non-inerziali, fis-trasformazioni-galileo, fis-principio-relativita-galileo, fis-forze-apparenti):
 * answers rounded to two significant figures and refused near a rounding boundary or when they would end with an
 * ambiguous zero (40 N), options that carry the unit, exact answers written as decimals, options that are words, and
 * the common checks. Numbers are written as vettori.ts and fis-moti-piano.ts write them (decimal comma, the unit
 * after a thin space, a squared unit with the exponent outside the text).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { BANNED, choiceOf, decTex, roundSig } from './vettori';
import { qOptU } from './fis-moti-piano';
import { shuffle } from './insiemi';

export { type Built, generateWith, degOpt, lab } from './fisica-equilibrio';
export { choiceOf, decTex, t, roundDeg, scene, type SceneVec } from './vettori';
export { dec2, qu, pqU, qOptU, cut, cutQ, rel, res, r3 } from './fis-moti-piano';

export const G = 9.8;
export const RAD = 180 / Math.PI;

/** x rounded to two significant figures, or null: near a rounding boundary, 100 or more, or ending with an ambiguous zero (40). */
export function r2(x: number): string | null {
	if (!(x > 0)) return null;
	const s = roundSig(x, 2);
	return s !== null && /^[1-9]0$/.test(s) ? null : s;
}

/** Options in a unit from numbers (the ones that cannot be written with two clean figures are skipped). */
export const uOpts = (unit: string, xs: number[]): ChoiceOption[] => xs.map(r2).filter((s): s is string => s !== null).map((s) => qOptU(s, unit));

/** A mistake is an option only if it is at least 8% away from the answer: closer than that it reads as a rounding of it. */
const far = (exact: number) => (x: number) => Math.abs(x / exact - 1) >= 0.08;

/** The four options of a quantity with two significant figures: the answer, the mistakes, then values 20% to 50% off. */
export function pick2(rng: Rng, ans: string, unit: string, exact: number, mistakes: number[]): ChoiceAnswer {
	return choiceOf(rng, qOptU(ans, unit), uOpts(unit, mistakes.filter(far(exact))), uOpts(unit, [exact * 1.2, exact * 0.8, exact * 1.4, exact * 0.6, exact * 1.6, exact * 0.5]));
}

/** A decimal string without useless zeros ("12.50" → "12.5", "7.0" → "7"). */
export const trim = (s: string) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);

/** An exact value with at most `places` decimals, as a decimal string without useless zeros. */
export const exactDec = (x: number, places = 2) => trim(x.toFixed(places));

/** The four options of an exact quantity: the answer and the mistakes, all written with `places` decimals at most. */
export function pickExact(rng: Rng, ans: number, unit: string, mistakes: number[], places = 1): ChoiceAnswer {
	const o = (x: number) => qOptU(exactDec(x, places), unit);
	const usable = mistakes.filter((x) => x > 0);
	return choiceOf(rng, o(ans), usable.map(o), [ans + 2, ans + 5, ans * 2, ans + 9, ans + 13].map(o));
}

/** An option that is a few words: the text in \text{}, its key in `values`. */
export const wordOpt = (key: string, text: string): ChoiceOption => ({ latex: `\\text{${text}}`, values: [key], text });

/** Options that are words, shuffled; `right` is the key of the correct one. */
export function pickWords(rng: Rng, right: string, all: [string, string][]): ChoiceAnswer {
	const order = shuffle(rng, all.map((_, i) => i));
	const options = order.map((i) => wordOpt(all[i][0], all[i][1]));
	return { kind: 'choice', options, correct: options.findIndex((o) => o.values[0] === right) };
}

/** Common checks: steps, banned words, four options with distinct texts and keys, a valid index. */
export function checkBasic(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values[0])).size !== 4) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** The four options of a pure number with two significant figures (a coefficient). */
export function pickNum(rng: Rng, ans: string, exact: number, mistakes: number[]): ChoiceAnswer {
	const o = (x: number[]) => x.map(r2).filter((s): s is string => s !== null).map((s): ChoiceOption => ({ latex: decTex(s), values: [s] }));
	return choiceOf(rng, { latex: decTex(ans), values: [ans] }, o(mistakes.filter(far(exact))), o([exact * 1.2, exact * 0.8, exact * 1.4, exact * 0.6]));
}

/** A number in LaTeX with its sign: "-3{,}0", "4{,}5". */
export const signed = (s: string) => decTex(s);
