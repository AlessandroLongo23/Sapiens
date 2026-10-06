/**
 * What the four generators of collisions and centre of mass share (physics, third year, group 33:
 * fis-conservazione-quantita-moto, fis-urti-anelastici, fis-urti-elastici, fis-centro-massa). Data have two
 * significant figures and no ambiguous trailing zero; results are rounded to two significant figures, never within
 * 1e-6 of a rounding boundary, and never written as a whole number of tens ("40", "-20"), which would leave the
 * second figure in doubt. Velocities along a line may be negative: the option carries the sign. Results from 100 up
 * are written in scientific notation with fis-lavoro.ts. The checker's side is scripts/exercises/checkers/_fis_urti.py.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { choiceOf, qOpt, scene, type SceneVec } from './vettori';
import { r2 } from './fisica-equilibrio';
import { q2, qOpt2, some } from './fis-lavoro';
import { cut } from './fis-energia';

/** A whole number of tens with two figures: its zero is ambiguous. */
const tens = (s: string) => /^-?[1-9]0$/.test(s);

/** x rounded to two significant figures, or null: zero, a rounding boundary, 100 or more, a whole number of tens. */
export function two(x: number): string | null {
	if (!Number.isFinite(x) || x === 0) return null;
	const s = r2(x);
	return s === null || tens(s) ? null : s;
}

/** The answer rounded, or a throw that makes the level draw again. */
export function need(x: number): string {
	const s = two(x);
	if (s === null) throw new Error('answer cannot be rounded cleanly');
	return s;
}

const far = (a: number) => (o: ChoiceOption) => Math.abs(Number(o.values[0]) - a) > 0.08 * Math.abs(a);

/**
 * The four options of a quantity with two significant figures: the answer, the mistakes that round cleanly and are
 * at least 8% away from it, then the answer scaled (1,3 and 0,7 times, 1,6 and 0,5 times) to fill the gaps.
 */
export function options(rng: Rng, exact: number, unit: string, mistakes: number[]): ChoiceAnswer {
	const answer = qOpt(need(exact), unit);
	const make = (xs: number[]) => xs.map(two).filter((s): s is string => s !== null).map((s) => qOpt(s, unit));
	const a = Number(answer.values[0]);
	return choiceOf(rng, answer, make(mistakes).filter(far(a)), make([exact * 1.3, exact * 0.7, exact * 1.6, exact * 0.5]).filter(far(a)));
}

/** The same for results that may reach the hundreds, written like fis-lavoro.ts writes them ("3{,}1 \cdot 10^2"). */
export function optionsSci(rng: Rng, exact: number, unit: string, mistakes: number[]): ChoiceAnswer {
	const answer = qOpt2(exact, unit);
	if (!answer || tens(answer.values[0])) throw new Error('answer cannot be rounded cleanly');
	const a = Number(answer.values[0]);
	const make = (xs: number[]) => some(xs.map((x) => (Number.isFinite(x) && x !== 0 ? qOpt2(x, unit) : null))).filter((o) => !tens(o.values[0]));
	return choiceOf(rng, answer, make(mistakes).filter(far(a)), make([exact * 1.3, exact * 0.7, exact * 1.6, exact * 0.5]).filter(far(a)));
}

/** A whole datum with two figures that does not end in zero, between lo and hi (a person's mass, an angle). */
export function whole(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return String(k);
	}
}

/** A signed number in a step, in brackets when negative: (-4{,}0\,\text{m/s}). */
export const signed = (latex: string) => (latex.startsWith('-') ? `(${latex})` : latex);

/**
 * Two perpendicular velocities drawn from the origin on Cartesian axes (scene `vettori-piano`): the first along x
 * and the second along y, each with its speed written beside it. `u` is chosen so that the longer arrow is 4 grid
 * units long. The scene shows the data only; `extra` adds the answer for the solution's scene, and `back` opens the
 * axes to the negative side when that arrow points there.
 */
export function crossScene(alt: string, v1: number, v2: number, l1: string, l2: string, extra: SceneVec[] = [], back = extra.length > 0): SceneRef {
	const k = 4 / Math.max(v1, v2);
	const vettori: SceneVec[] = [
		{ da: [0, 0], a: [v1 * k, 0], colore: 'velocita', etichetta: l1 },
		{ da: [0, 0], a: [0, v2 * k], colore: 'velocita', etichetta: l2 },
		...extra,
	];
	const neg = back ? -5 : -1; // room for an arrow in the third quadrant
	return scene(alt, { u: 0.5, assi: { x0: neg, x1: 5, y0: neg, y1: 5 }, vettori });
}

/** The end of a step: "= 1{,}66\ldots\,\text{m/s} \approx 1{,}7\,\text{m/s}", or just the value when it is exact. */
export function result(exact: number, unit: string, cutTex: string, ansTex: string): string {
	return cutTex.includes('\\ldots') || Math.abs(Number(ansTex.replace('{,}', '.')) - exact) > 1e-9 * Math.abs(exact) ? `${cutTex}\\,\\text{${unit}} \\approx ${ansTex}\\,\\text{${unit}}` : `${ansTex}\\,\\text{${unit}}`;
}

/** The same for a result written like fis-lavoro.ts writes it: "830{,}4\ldots\,\text{m/s} \approx 8{,}3 \cdot 10^2\,\text{m/s}". */
export function resultSci(exact: number, unit: string): string {
	const c = cut(exact, 4);
	const same = Math.abs(Number(qOpt2(exact, unit)?.values[0]) - exact) <= 1e-9 * Math.abs(exact);
	return same ? q2(exact, unit) : `${c}\\,\\text{${unit}} \\approx ${q2(exact, unit)}`;
}
