/**
 * What the three generators of the rotation of a rigid body share (physics, third year, group 34:
 * fis-cinematica-rotazionale, fis-momento-inerzia, fis-dinamica-rotazionale). Data with two significant figures,
 * answers rounded to two significant figures and refused near a rounding boundary, options that carry the unit, as in
 * fis-moti-piano.ts, from which most of this comes; what is new here is the units made of several pieces, written as
 * lessons 86-88 write them (kg·m² is \text{kg}\cdot\text{m}^2, N·m is \text{N}\cdot\text{m}, rad/s² is
 * \text{rad/s}^2).
 */
import type { ChoiceOption } from './types';
import { cut, decTex, opts, r2 } from './fis-moti-piano';

export { type Built, TWO_PI, checkCommon, choiceOf, cut, dec2, decTex, generateWith, lab, r2, r3, t } from './fis-moti-piano';
export { textBlock } from './insiemi';

export const G = 9.8;

/** A unit in LaTeX: 'kg·m^2' → \text{kg}\cdot\text{m}^2, 'rad/s^2' → \text{rad/s}^2, 'N·m' → \text{N}\cdot\text{m}. */
export const unitTex = (unit: string) =>
	unit
		.split('·')
		.map((u) => (u.endsWith('^2') ? `\\text{${u.slice(0, -2)}}^2` : `\\text{${u}}`))
		.join('\\cdot');

/** A quantity: 4{,}5\,\text{rad/s}^2. */
export const qu = (s: string, unit: string) => `${decTex(s)}\\,${unitTex(unit)}`;
/** The same inside the prose of a \text{} line. */
export const pq = (s: string, unit: string) => `$${qu(s, unit)}$`;
/** An option that is a quantity. */
export const qOpt = (s: string, unit: string): ChoiceOption => ({ latex: qu(s, unit), values: [s] });
/** Options for a list of values in a unit (missing ones skipped). */
export const unitOpts = (unit: string) => (xs: (string | null)[]): ChoiceOption[] => opts(xs, (s) => qOpt(s, unit));
/** Fallback options near x: 20% and 40% more and less, rounded. */
export const near = (x: number, unit: string) => unitOpts(unit)([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)]);
/** A step's quantity, cut after four significant figures: 12{,}34…\,\text{rad/s}. */
export const cutQ = (x: number, unit: string) => `${cut(x)}\\,${unitTex(unit)}`;
/** The end of a step: "= 12{,}34…\,u ≈ 12\,u", or "= 12\,u" when the value is the answer exactly. */
export const res = (x: number, ans: string, unit: string) => (Math.abs(x - Number(ans)) < 1e-9 ? qu(ans, unit) : `${cutQ(x, unit)} \\approx ${qu(ans, unit)}`);
/** '=' when x is the answer exactly, '\\approx' otherwise. */
export const rel = (x: number, ans: string) => (Math.abs(x - Number(ans)) < 1e-9 ? '=' : '\\approx');

/** A length that is a whole number of tenths of a metre, with two significant figures: 4 → "0.40", 12 → "1.2". */
export const tenths = (k: number) => (k < 10 ? (k / 10).toFixed(2) : (k / 10).toFixed(1));
