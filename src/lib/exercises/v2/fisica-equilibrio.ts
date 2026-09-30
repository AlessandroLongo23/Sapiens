/**
 * What the two generators of the equilibrium of a point share (physics, first year, group 6: fis-equilibrio-punto,
 * fis-equilibrio-piano-inclinato): the weight m·g written exactly, masses and forces with two significant figures,
 * options in degrees or without unit, and the loop that resamples a level until it gives a valid sample. Numbers are
 * written as src/lib/exercises/v2/vettori.ts writes them (decimal comma, unit after a thin space); results that need
 * sine and cosine are floats rounded with vettori.roundSig, which refuses values too close to a rounding boundary.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from './types';
import { BANNED, decTex, roundDeg, roundSig } from './vettori';

export const DEG = Math.PI / 180;
export const sinD = (a: number) => Math.sin(a * DEG);
export const cosD = (a: number) => Math.cos(a * DEG);
export const tanD = (a: number) => Math.tan(a * DEG);

/** Digits after the point of a decimal string. */
const places = (s: string) => (s.includes('.') ? s.length - s.indexOf('.') - 1 : 0);

/** The exact product of two decimal strings ("4.5" · "9.8" = "44.1"), without trailing zeros. */
export function mulDec(a: string, b: string): string {
	const k = places(a) + places(b);
	const n = Math.round(Number(a.replace('.', '')) * Number(b.replace('.', '')));
	const s = String(n).padStart(k + 1, '0');
	const out = k ? `${s.slice(0, s.length - k)}.${s.slice(s.length - k)}` : s;
	return out.includes('.') ? out.replace(/0+$/, '').replace(/\.$/, '') : out;
}

/** The weight of a mass in kg, exactly: m · 9,8 N/kg. */
export const weight = (m: string) => mulDec(m, '9.8');

/** A value with two significant figures and no ambiguous trailing zero: 1,1 to 9,9 (`small`) or 11 to 99. */
export function two(rng: Rng, small: boolean): string {
	for (;;) {
		const k = rng.int(11, 99);
		if (k % 10) return small ? (k / 10).toFixed(1) : String(k);
	}
}

/** A coefficient with two decimals between lo and hi hundredths, as a string ("0.45"). */
export const coeff = (rng: Rng, lo: number, hi: number) => (rng.int(lo, hi) / 100).toFixed(2);

/** A number rounded to two significant figures, as a string, or null (too close to a boundary, or 100 or more). */
export const r2 = (x: number) => roundSig(x, 2);

/** An option in degrees (values: the whole number). */
export const degOpt = (s: string): ChoiceOption => ({ latex: `${s}^\\circ`, values: [s] });
/** An option that is a bare number (a coefficient). */
export const numOpt = (s: string): ChoiceOption => ({ latex: decTex(s), values: [s] });

/** Options from values that may be missing (a rounding refused): the missing ones are skipped. */
export const opts = <T>(xs: (T | null)[], make: (x: T) => ChoiceOption) => xs.filter((x): x is T => x !== null).map(make);

export { roundDeg };

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

/** The common checks: steps, banned words, four distinct options with distinct values. */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => Number(o.values[0]))).size !== 4) v.push('due opzioni con lo stesso numero');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** generate(): a level's builder may throw to ask for another draw; the sample must pass check(). */
export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]): Generator['generate'] {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: Built;
			try {
				b = make(rng);
			} catch {
				continue;
			}
			const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			if (b.scene) sample.scene = b.scene;
			if (b.solutionScene) sample.solutionScene = b.solutionScene;
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** A value for a drawing's label: decimal comma. */
export const lab = (s: string) => s.replace('.', ',');
