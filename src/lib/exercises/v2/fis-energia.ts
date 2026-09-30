/**
 * What the three generators of energy (physics, second year, group 18: fis-energia-potenziale, energia,
 * fis-energia-totale) share: data with two significant figures, g = 9,8 m/s², results rounded to two significant
 * figures with vettori.roundSig (which refuses values too close to a rounding boundary), options with the unit inside,
 * the scene of a track between two points (type `pista-energia`, src/components/content/exercises/scenes/PistaEnergia.tsx),
 * and the loop of fisica-equilibrio.ts that resamples a level until it passes check().
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { choiceOf, decTex, qOpt, qty } from './vettori';
import { opts, r2 } from './fisica-equilibrio';

export const G = 9.8;

/** A value with two significant figures between lo and hi (inclusive), no ambiguous trailing zero, as a string. */
export function data2(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const e = rng.int(Math.floor(Math.log10(lo)), Math.floor(Math.log10(hi)));
		const k = rng.int(11, 99);
		if (k % 10 === 0) continue;
		const x = (k / 10) * 10 ** e;
		if (x < lo - 1e-9 || x > hi + 1e-9) continue;
		// written with the decimals it needs: 0.45, 4.5, 45
		const d = Math.max(0, 1 - e);
		return x.toFixed(d);
	}
}

/** A three-figure integer between lo and hi that does not end in zero (a spring constant, 365 N/m). */
export function int3(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return String(k);
	}
}

/** Options in a unit from values that may be missing (a rounding refused). */
export const uOpts = (xs: (string | null)[], unit: string) => opts(xs, (s) => qOpt(s, unit));
/** Values rounded to two significant figures, for options in a unit; negative and zero values allowed through r2. */
export const r2s = (xs: number[]) => xs.map((x) => (Number.isFinite(x) && x !== 0 ? r2(x) : null));
/** The usual fallback options: the answer scaled up and down. */
export const fallback = (x: number, unit: string) => uOpts(r2s([x * 1.2, x * 0.8, x * 1.4, x * 0.6]), unit);

/**
 * The four options: the answer, then the mistakes and the fallback, leaving out those within 8% of the answer (a
 * mistake that rounds to almost the same number is no mistake to spot).
 */
export function choose(rng: Rng, answer: ChoiceOption, mistakes: ChoiceOption[], extra: ChoiceOption[]): ChoiceAnswer {
	const a = Number(answer.values[0]);
	const far = (o: ChoiceOption) => Math.abs(Number(o.values[0]) - a) > 0.08 * Math.abs(a);
	return choiceOf(rng, answer, mistakes.filter(far), extra.filter(far));
}

/** A float for a step, cut after three significant decimals ("7{,}91"), exact values as they are. */
export function cut(x: number, sig = 3): string {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	const d = Math.max(0, sig - 1 - e);
	const p = 10 ** d;
	const r = Math.round(x * p);
	const exact = Math.abs(x * p - r) < 1e-6;
	const v = (exact ? r : Math.trunc(x * p)) / p;
	const txt = v.toFixed(d);
	return decTex(exact && txt.includes('.') ? txt.replace(/\.?0+$/, '') : txt) + (exact ? '' : '\\ldots');
}

export const J = (s: string) => qty(s, 'J');

/** A label value with the decimal comma, for scenes. */
export const lab = (s: string) => s.replace('.', ',');

/**
 * The scene of a track from A (left, height hA) down to B (right, height hB), both in metres; `vA` is the text of the
 * speed at A, if it is given ('4,0 m/s'). Heights are written beside the quotes; the scene never shows the answer.
 */
export function pista(alt: string, d: { hA: string; hB: string; vA?: string; nomeB?: string }): SceneRef {
	const data: Record<string, unknown> = { hA: Number(d.hA), hB: Number(d.hB), testoA: `${lab(d.hA)} m` };
	if (Number(d.hB) > 0) data.testoB = `${lab(d.hB)} m`;
	if (d.vA) data.vA = d.vA;
	if (d.nomeB) data.nomeB = d.nomeB;
	return { type: 'pista-energia', data, alt };
}
