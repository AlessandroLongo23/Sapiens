/**
 * What the five generators of the chapter "I moti nel piano" share (physics, second year, group 14:
 * fis-spostamento-velocita-piano, fis-composizione-moti, fis-moto-circolare-uniforme, fis-accelerazione-centripeta,
 * fis-moto-armonico): data with two significant figures, answers rounded to two significant figures (or to the degree)
 * and refused near a rounding boundary, options that carry the unit, the steps' numbers cut after four significant
 * figures, and the loop that resamples a level (from fisica-equilibrio.ts). Numbers are written as vettori.ts writes
 * them: decimal comma, the unit after a thin space.
 */
import type { ChoiceOption, Rng, SceneRef } from './types';
import { decTex, qty } from './vettori';
import { opts, r2 } from './fisica-equilibrio';

export { type Built, checkCommon, generateWith, r2, opts, degOpt, numOpt, lab } from './fisica-equilibrio';
export { choiceOf, decTex, pq, qOpt, qty, t, roundDeg, roundSig, scene } from './vettori';

export const TWO_PI = 2 * Math.PI;
export const DEG = Math.PI / 180;

/**
 * A datum with two significant figures between lo and hi, as a decimal string: 1.1 to 9.9 with one decimal, 11 to 99,
 * 0.11 to 0.99 with two decimals. Whole numbers ending in zero (20, 350) are never drawn, because their zeros are
 * ambiguous; 2.0 and 0.80 are fine.
 */
export function dec2(rng: Rng, lo: number, hi: number): string {
	const all: string[] = [];
	for (const e of [-2, -1, 0]) {
		for (let k = 10; k <= 99; k++) {
			const x = k * 10 ** e;
			if (x < lo - 1e-9 || x > hi + 1e-9) continue;
			if (e === 0 && k % 10 === 0) continue;
			all.push(x.toFixed(-e));
		}
	}
	if (!all.length) throw new Error(`dec2: nothing between ${lo} and ${hi}`);
	return all[rng.int(0, all.length - 1)];
}

/** A unit in LaTeX: upright, with a squared unit's exponent outside the text (\\text{m/s}^2). */
const unitTex = (unit: string) => (unit.endsWith('^2') ? `\\text{${unit.slice(0, -2)}}^2` : `\\text{${unit}}`);
/** A quantity like vettori.qty, but also for squared units: 4{,}5\\,\\text{m/s}^2. */
export const qu = (s: string, unit: string) => `${decTex(s)}\\,${unitTex(unit)}`;
/** The same inside prose: $4{,}5\\,\\text{m/s}^2$. */
export const pqU = (s: string, unit: string) => `$${qu(s, unit)}$`;
/** An option that is a quantity (squared units too). */
export const qOptU = (s: string, unit: string): ChoiceOption => ({ latex: qu(s, unit), values: [s] });

/** Options for a list of values in a unit (missing ones skipped). */
export const unitOpts = (unit: string) => (xs: (string | null)[]): ChoiceOption[] => opts(xs, (s) => qOptU(s, unit));

/** Fallback options near x: 20% and 40% more and less, rounded. */
export const near = (x: number, unit: string) => unitOpts(unit)([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)]);

/** A float for a step: four significant figures, cut (not rounded), with "…" when it is not exact. */
export function cut(x: number): string {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	const k = Math.max(0, 3 - e);
	const scaled = x * 10 ** k;
	const r = Math.round(scaled);
	const exact = Math.abs(scaled - r) < 1e-6;
	const v = (exact ? r : Math.trunc(scaled)) / 10 ** k;
	const txt = v.toFixed(k);
	return exact ? decTex(txt.includes('.') ? txt.replace(/0+$/, '').replace(/\.$/, '') : txt) : `${decTex(txt)}\\ldots`;
}

/** The end of a step: "= 12{,}34…\,\text{m/s} ≈ 12\,\text{m/s}", or "= 12\,\text{m/s}" when the value is the answer exactly. */
export function res(x: number, ans: string, unit: string): string {
	return Math.abs(x - Number(ans)) < 1e-9 ? qu(ans, unit) : `${cutQ(x, unit)} \\approx ${qu(ans, unit)}`;
}

/** '=' when x is the answer exactly, '\\approx' otherwise. */
export const rel = (x: number, ans: string) => (Math.abs(x - Number(ans)) < 1e-9 ? '=' : '\\approx');

/** A step's quantity: 12{,}34…\,\text{m/s}. */
export const cutQ = (x: number, unit: string) => `${cut(x)}\\,${unitTex(unit)}`;

/** The answer written as a quantity: ≈ 12\,\text{m/s}. */
export const ansQ = (s: string, unit: string) => qty(s, unit);

/** A scene's value: decimal comma and a true minus sign ("−1,5"). */
export const sceneNum = (s: string) => s.replace('.', ',').replace('-', '−');

/** Rounds a scene's coordinate to a thousandth, so the server and the browser agree. */
export const r3 = (x: number) => Math.round(x * 1000) / 1000;

export type { SceneRef };
