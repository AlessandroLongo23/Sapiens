/**
 * What the three generators of the gravitational field, of satellites and of gravitational energy share (physics,
 * third year, group 37: fis-campo-gravitazionale, fis-satelliti, fis-energia-gravitazionale): numbers with three
 * significant figures written as the lessons 95-97 write them, in scientific notation with `\cdot` when they are
 * large or small ($5{,}97 \cdot 10^{24}\,\text{kg}$), options with the unit inside, G = 6,67·10⁻¹¹ N·m²/kg², and the
 * scene of a planet with a point or a satellite at a height (type `orbita-pianeta`,
 * src/components/content/exercises/scenes/OrbitaPianeta.tsx).
 *
 * A number is written without the power of ten when it is between 0,1 and 1000 (9,81; 24,8; 274; 0,613), unless it
 * is a whole number of hundreds or tens that would end with an ambiguous zero (270 becomes 2,70 · 10²).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { choiceOf, decTex } from './vettori';

export const G = 6.67e-11;
export const G_TEX = '6{,}67 \\cdot 10^{-11}';

/** A number as it is written (`tex`), as the checker reads it (`value`: "5.97e24", "9.81"), and as a float. */
export type Sci = { tex: string; value: string; x: number };

/**
 * x with n significant figures. `strict` refuses (null) a value too close to a rounding boundary to trust floating
 * point: answers and options are strict, the values shown in the steps are not.
 */
export function sci(x: number, n = 3, strict = true): Sci | null {
	if (!Number.isFinite(x) || x === 0) return null;
	const a = Math.abs(x);
	let e = Math.floor(Math.log10(a));
	const y = (a / 10 ** e) * 10 ** (n - 1);
	const frac = y - Math.floor(y);
	if (strict && Math.abs(frac - 0.5) < 1e-6) return null;
	let r = Math.round(y);
	if (r >= 10 ** n) {
		r /= 10;
		e += 1;
	}
	const d = String(r);
	const sign = x < 0 ? '-' : '';
	const plain = e >= -1 && e <= 2 && n === 3 && !(e === 2 && r % 10 === 0);
	if (plain) {
		const s = e === 2 ? d : e === 1 ? `${d.slice(0, 2)}.${d[2]}` : e === 0 ? `${d[0]}.${d.slice(1)}` : `0.${d}`;
		return { tex: sign + decTex(s), value: sign + s, x: Number(sign + s) };
	}
	const m = `${d[0]}.${d.slice(1)}`;
	return { tex: `${sign}${decTex(m)} \\cdot 10^{${e}}`, value: `${sign}${m}e${e}`, x: Number(`${sign}${m}e${e}`) };
}

/** A value for a step: four significant figures, always in scientific notation outside 0,1-1000, never refused. */
export const step4 = (x: number): string => {
	const a = Math.abs(x);
	if (a >= 0.1 && a < 1000) return decTex(Number(x.toPrecision(4)).toString());
	return (sci(x, 4, false) as Sci).tex;
};

const UNIT_TEX: Record<string, string> = {
	'N/kg': '\\text{N/kg}',
	N: '\\text{N}',
	kg: '\\text{kg}',
	m: '\\text{m}',
	'm/s': '\\text{m/s}',
	s: '\\text{s}',
	J: '\\text{J}',
};
export type Unit = keyof typeof UNIT_TEX;

/** A quantity in LaTeX: 5{,}97 \cdot 10^{24}\,\text{kg}. */
export const q = (s: Sci, u: Unit) => `${s.tex}\\,${UNIT_TEX[u]}`;
/** The same inside the prose of a textBlock line. */
export const pq = (s: Sci, u: Unit) => `$${q(s, u)}$`;
/** An option that is a quantity. */
export const opt = (s: Sci, u: Unit): ChoiceOption => ({ latex: q(s, u), values: [s.value] });

/**
 * A datum with three significant figures, mantissa 1,01 to 9,99 without a final zero, times ten to the `e`
 * (an exponent drawn between e0 and e1).
 */
export function datum(rng: Rng, e0: number, e1 = e0): Sci {
	for (;;) {
		const k = rng.int(101, 999);
		if (k % 10 === 0) continue;
		const e = rng.int(e0, e1);
		return sci(Number(`${k}e${e - 2}`)) as Sci;
	}
}

/** x rounded to a datum with three figures and no final zero in the mantissa; null if the rounding gives one. */
export function asDatum(x: number): Sci | null {
	const s = sci(x);
	if (!s) return null;
	const digits = s.value.replace(/e.*$/, '').replace(/[-.]/g, '').replace(/^0+/, '');
	return digits.endsWith('0') ? null : s;
}

/**
 * The four options: the answer, then the mistakes (those that give a number, and not one within 3% of the answer),
 * then the answer scaled up and down. Throws when fewer than four are left, and the level draws again.
 */
export function choose(rng: Rng, answer: Sci, mistakes: number[], u: Unit): ChoiceAnswer {
	const far = (s: Sci | null): s is Sci => s !== null && Math.abs(s.x - answer.x) > 0.03 * Math.abs(answer.x);
	const wrong = mistakes.map((x) => sci(x)).filter(far);
	const extra = [1.5, 0.5, 2.5, 0.25].map((k) => sci(answer.x * k)).filter(far);
	return choiceOf(rng, opt(answer, u), wrong.map((s) => opt(s, u)), extra.map((s) => opt(s, u)));
}

/** The celestial bodies of the problems, with the article and the ending of the adjectives. */
export const BODIES = ['un pianeta', 'una luna', 'un pianeta extrasolare'] as const;
export type Body = (typeof BODIES)[number];
/** A body for a mass in kg: a moon only under 10²⁴ kg, a planet outside the Solar System only from there up. */
export const bodyFor = (rng: Rng, M: number): Body => rng.pick(M < 1e24 ? (['una luna', 'un pianeta'] as const) : (['un pianeta', 'un pianeta extrasolare'] as const));
/** "del pianeta", "della luna". */
export const of = (b: Body) => (b === 'una luna' ? 'della luna' : 'del pianeta');
/** "il pianeta", "la luna". */
export const the = (b: Body) => (b === 'una luna' ? 'la luna' : 'il pianeta');
/** "Un pianeta", "Una luna". */
export const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** The radius of a sphere of mass M (kg) and density rho (kg/m³). */
export const radiusOf = (M: number, rho: number) => Math.cbrt((3 * M) / (4 * Math.PI * rho));

/**
 * A celestial body that could exist: the mass is drawn (10²² to 10²⁷ kg), the radius is that of a sphere with a
 * density between 1000 and 6000 kg/m³, rounded to a datum. `g` is the field at its surface.
 */
export function planet(rng: Rng): { M: Sci; R: Sci; g: number } {
	for (;;) {
		const M = datum(rng, 22, 27);
		const R = asDatum(radiusOf(M.x, 1000 + rng.next() * 5000));
		if (!R) continue;
		return { M, R, g: (G * M.x) / (R.x * R.x) };
	}
}

/** A label of the scene: the letter and its value as the scene writes it ("6,37 · 10⁶ m"). */
export type SceneVal = { m: string; e?: number; u: string };
export function sceneVal(s: Sci, u: string): SceneVal {
	const [m, e] = s.value.split('e');
	return e === undefined ? { m: m.replace('.', ','), u } : { m: m.replace('.', ','), e: Number(e), u };
}

/**
 * The scene of a planet of radius R with a body at height h (so at r = R + h from the centre): `rapporto` is r/R and
 * sets the drawing, `orbita` draws the circular orbit and the velocity; R, h and r are written under the drawing
 * when they are data. The scene never shows what the exercise asks.
 */
export function orbitScene(alt: string, d: { rapporto: number; orbita: boolean; R?: SceneVal; h?: SceneVal; r?: SceneVal; lancio?: boolean }): SceneRef {
	const data: Record<string, unknown> = { rapporto: Math.round(d.rapporto * 1000) / 1000, orbita: d.orbita };
	if (d.R) data.R = d.R;
	if (d.h) data.h = d.h;
	if (d.r) data.r = d.r;
	if (d.lancio) data.lancio = true;
	return { type: 'orbita-pianeta', data, alt };
}
