/**
 * What the five generators of "Le forze e il movimento" share (physics, second year, group 16: fis-piano-inclinato,
 * fis-corpi-collegati, fis-moto-proiettili, fis-forza-centripeta, fis-pendolo-molla): quantities with their units as
 * the lessons write them (m/s², m/s, s, m, N, N/m), options from values that may be missing, and a step value cut
 * after four significant figures with "\ldots". Results are floats rounded with fisica-equilibrio.r2 (two significant
 * figures, refused near a rounding boundary); g = 9,8 m/s².
 */
import type { ChoiceOption, Rng } from './types';
import { decTex } from './vettori';
import { r2, two } from './fisica-equilibrio';

export const G = 9.8;
export const DEG = Math.PI / 180;
export const sinD = (a: number) => Math.sin(a * DEG);
export const cosD = (a: number) => Math.cos(a * DEG);
export const tanD = (a: number) => Math.tan(a * DEG);

export type Unit = 'N' | 'm/s' | 'm/s2' | 's' | 'm' | 'kg' | 'N/m' | 'km/h' | 'g';
const UNIT_TEX: Record<Unit, string> = {
	N: '\\text{N}',
	'm/s': '\\text{m/s}',
	'm/s2': '\\text{m/s}^2',
	s: '\\text{s}',
	m: '\\text{m}',
	kg: '\\text{kg}',
	'N/m': '\\text{N/m}',
	'km/h': '\\text{km/h}',
	g: '\\text{g}',
};

/** A quantity in LaTeX: 4{,}9\,\text{m/s}^2. */
export const qu = (s: string, u: Unit) => `${decTex(s)}\\,${UNIT_TEX[u]}`;
/** The same inside the prose of a \text{} line. */
export const pu = (s: string, u: Unit) => `$${qu(s, u)}$`;
/** An option that is a quantity (its value: the decimal string). */
export const optU = (s: string, u: Unit): ChoiceOption => ({ latex: qu(s, u), values: [s] });
/** Options from values that may be missing (a rounding refused), skipping the missing ones. */
export const optsU = (xs: (string | null)[], u: Unit) => xs.filter((x): x is string => x !== null).map((x) => optU(x, u));
/** Fallback options around a value, when the mistakes give fewer than three. */
export const fallU = (x: number, u: Unit) => optsU([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)], u);
/** r2 of a positive value, null for zero, negative or non-finite ones (a mistake that gives no number). */
export const r2p = (x: number) => (Number.isFinite(x) && x > 0 ? r2(x) : null);

/** A step value: four significant figures, cut, with \ldots when something was cut ("1{,}010\ldots"). */
export function cut4(x: number): string {
	const e = Math.floor(Math.log10(Math.abs(x)));
	const d = Math.max(0, 3 - e);
	const k = 10 ** d;
	const r = Math.round(x * k);
	if (Math.abs(x * k - r) < 1e-6) return decTex((r / k).toFixed(d).replace(/\.?0+$/, ''));
	return `${decTex((Math.trunc(x * k) / k).toFixed(d))}\\ldots`;
}

/** A datum with two significant figures, 1,1 to 9,9 or (big) 11 to 99, or (tiny) 0,11 to 0,99. */
export function datum(rng: Rng, size: 'tiny' | 'small' | 'big'): string {
	if (size === 'tiny') {
		const s = two(rng, true);
		return (Number(s) / 10).toFixed(2);
	}
	return two(rng, size === 'small');
}

/** A coefficient 0,lo to 0,hi, two decimals, as a string ("0.35"). */
export const coeffOf = (rng: Rng, lo: number, hi: number) => (rng.int(lo, hi) / 100).toFixed(2);

/** A body with the ending of its adjectives: "Una cassa" + a, "Uno scatolone" + o. */
export const BODIES = [
	{ name: 'Una cassa', e: 'a' },
	{ name: 'Uno scatolone', e: 'o' },
	{ name: 'Un blocco di legno', e: 'o' },
	{ name: 'Una valigia', e: 'a' },
] as const;
