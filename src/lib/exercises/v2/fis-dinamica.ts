/**
 * What the four generators of the principles of dynamics share (physics, second year, group 15: fis-primo-principio,
 * leggi-newton, fis-terzo-principio, fis-diagramma-corpo-libero): accelerations written as the lessons write them
 * ($2{,}4\,\text{m/s}^2$), results in scientific notation with the unit, options that are words, the common part of
 * check() and the scenes of forces on a block or a point (types `blocco-forze` and `punto-forze`, already registered).
 *
 * Numbers follow src/lib/exercises/v2/vettori.ts (decimal comma, unit after a thin space) and are rounded with
 * vettori.roundSig, which refuses values too close to a rounding boundary.
 */
import type { ChoiceAnswer, ChoiceOption, Sample, SceneRef } from './types';
import { BANNED, choiceOf, decTex, qOpt, qty } from './vettori';
import { sciParts, sciTex } from './raggi-specchi';
import { r2 as r2any } from './fisica-equilibrio';

export const G = 9.8;

/**
 * x rounded to two significant figures ("8.7", "43", "0.52"), or null: too close to a rounding boundary, 100 or more,
 * or a whole number ending in zero ("40"), whose zero would be ambiguous (the lessons write it 4,0 · 10).
 */
export function r2(x: number): string | null {
	const s = r2any(x);
	return s !== null && /^[1-9]0$/.test(s) ? null : s;
}

/** An acceleration: 2{,}4\,\text{m/s}^2. */
export const acc = (s: string) => `${decTex(s)}\\,\\text{m/s}^2`;
/** The same between dollars, for prose. */
export const pacc = (s: string) => `$${acc(s)}$`;
/** An option that is an acceleration; `extra` is a direction written after it ("verso l'alto"). */
export const accOpt = (s: string, extra = ''): ChoiceOption => ({ latex: acc(s) + (extra ? `\\ \\text{${extra}}` : ''), values: [extra ? `${s} ${extra}` : s] });
/** The values that can be options: the roundings not refused, and positive (these are all moduli). */
const usable = (xs: (string | null)[]) => xs.filter((x): x is string => x !== null && !x.startsWith('-'));
/** Options of forces in newton, of accelerations, of masses in kg. */
export const nOpts = (xs: (string | null)[]) => usable(xs).map((s) => qOpt(s, 'N'));
export const aOpts = (xs: (string | null)[]) => usable(xs).map((s) => accOpt(s));
export const kgOpts = (xs: (string | null)[]) => usable(xs).map((s) => qOpt(s, 'kg'));
/** The usual fallback options: the answer 20% and 40% off. */
export const around = (x: number) => [r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)];

/** A value in scientific notation with two significant figures, as [latex, value string "3.3e-25"], or null. */
export function sci2(x: number): { tex: string; value: string } | null {
	const p = sciParts(x, 2);
	if (!p) return null;
	return { tex: sciTex(p[0], p[1]), value: `${p[0]}e${p[1]}` };
}
/** An option in scientific notation with a unit ("N", or "m/s^2" written as an acceleration). */
export function sciOpt(x: number, unit: 'N' | 'm/s^2'): ChoiceOption | null {
	const s = sci2(x);
	if (!s) return null;
	return { latex: `${s.tex}\\,${unit === 'N' ? '\\text{N}' : '\\text{m/s}^2'}`, values: [s.value] };
}
export const sciOpts = (xs: number[], unit: 'N' | 'm/s^2') => xs.map((x) => sciOpt(x, unit)).filter((o): o is ChoiceOption => o !== null);

/** An option that is a sentence: the text in \text{}, its key in `values`. */
export const wordOpt = (key: string, text: string): ChoiceOption => ({ latex: `\\text{${text}}`, values: [key], text });

/** A mass, a force or a time in a problem: $2{,}5\,\text{kg}$. */
export { qty };

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}

/** Common checks: steps, banned words, four options with distinct texts, a valid index. */
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

/** The same, and the numbers of the options are distinct too (options that are quantities). */
export function checkNumeric(sample: Sample): string[] {
	const v = checkBasic(sample);
	const a = sample.answer;
	if (a.kind === 'choice' && new Set(a.options.map((o) => Number(o.values[0]))).size !== 4) v.push('due opzioni con lo stesso numero');
	return v;
}

export { choiceOf };

/** One force of a scene: name, subscript, modulus in newton, direction in degrees from the x axis. */
export type SceneForce = { nome: string; sub?: string; modulo: number; angolo: number };

/** The scale that makes the longest arrow about `longest` centimetres. */
const scaleFor = (forces: SceneForce[], longest: number) => Math.round((longest / Math.max(...forces.map((F) => F.modulo))) * 10000) / 10000;
const clean = (forces: SceneForce[]) => forces.map((F) => ({ ...F, modulo: Math.round(F.modulo * 1000) / 1000, angolo: Math.round(F.angolo * 1000) / 1000 }));

/** A block on the floor with the given forces at its centre (`blocco-forze`). */
export const blockScene = (alt: string, forces: SceneForce[], longest = 1.8): SceneRef => ({ type: 'blocco-forze', data: { forze: clean(forces), scala: scaleFor(forces, longest) }, alt });
/** Forces on a point, a body seen from above (`punto-forze`). */
export const pointScene = (alt: string, forces: SceneForce[], longest = 1.8): SceneRef => ({ type: 'punto-forze', data: { forze: clean(forces), scala: scaleFor(forces, longest) }, alt });

/** A float for a step, with three decimals cut ("2{,}065"), or exact when it has fewer. */
export function f3(x: number): string {
	const r = Math.round(x * 1000);
	const s = String((Math.abs(x * 1000 - r) < 1e-6 ? r : Math.trunc(x * 1000)) / 1000);
	return decTex(s);
}

