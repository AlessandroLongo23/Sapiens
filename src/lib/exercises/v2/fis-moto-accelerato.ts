/**
 * What the three generators of the uniformly accelerated motion share (physics, second year, group 13:
 * moto-uniforme-accelerato, fis-grafico-velocita-tempo, fis-caduta-libera): data with two significant figures drawn
 * from a range, options with the unit (m/s² written as \text{m/s}^2, which \text{} alone cannot hold), an exact decimal
 * for values read on a graph, and a step value cut after three decimals. Rounding of results is vettori.roundSig
 * (through fisica-equilibrio.r2), which refuses values too close to a rounding boundary.
 */
import type { ChoiceOption, Rng } from './types';
import { decTex, qOpt, qty } from './vettori';

/** A datum with two significant figures and no ambiguous trailing zero, between lo and hi: 1,1 to 9,9 or 11 to 99. */
export function two(rng: Rng, lo: number, hi: number): string {
	const all: string[] = [];
	for (let k = 11; k <= 99; k++) {
		if (!(k % 10)) continue;
		for (const s of [(k / 10).toFixed(1), String(k)]) if (Number(s) >= lo - 1e-9 && Number(s) <= hi + 1e-9) all.push(s);
	}
	if (!all.length) throw new Error(`two: empty range ${lo}-${hi}`);
	return rng.pick(all);
}

/** An option in m/s². */
export const accOpt = (s: string): ChoiceOption => ({ latex: `${decTex(s)}\\,\\text{m/s}^2`, values: [s] });
/** A quantity in m/s² for the text and the steps. */
export const acc = (s: string) => `${decTex(s)}\\,\\text{m/s}^2`;
export const ms = (s: string) => qty(s, 'm/s');
export const mOpt = (s: string) => qOpt(s, 'm');
export const msOpt = (s: string) => qOpt(s, 'm/s');
export const sOpt = (s: string) => qOpt(s, 's');

/** A float for a step, cut after three decimals (exact values stay as they are). */
export const f3 = (x: number) => {
	const r = Math.round(x * 1000);
	return decTex(String((Math.abs(x * 1000 - r) < 1e-6 ? r : Math.trunc(x * 1000)) / 1000));
};

/** An exact decimal (a value read on a graph: a multiple of 1/8 at most) as a string, or null if it needs more than 3 decimals. */
export function exact(x: number): string | null {
	for (let d = 0; d <= 3; d++) {
		const y = x * 10 ** d;
		if (Math.abs(y - Math.round(y)) < 1e-9) return (Math.round(y) / 10 ** d).toFixed(d);
	}
	return null;
}

/** g in the steps. */
export const G = 9.8;
export const gTex = '9{,}8\\,\\text{m/s}^2';
