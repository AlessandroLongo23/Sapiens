/**
 * Shared pieces of the vector generators of physics (group 4: fis-scalari-vettori, fis-operazioni-vettori,
 * fis-seno-coseno): numbers written as the physics lessons write them (decimal comma, unit after a thin space,
 * significant figures), multiple-choice answers whose options carry the unit, and the scene of vectors in the plane
 * (type `vettori-piano`, src/components/content/exercises/scenes/VettoriPiano.tsx).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { shuffle } from './insiemi';

export const t = (s: string) => `\\text{${s}}`;

/** A decimal string ("-6.9", "43", "0.52") in LaTeX: -6{,}9. */
export const decTex = (s: string) => s.replace('.', '{,}');

/** A quantity: 43\,\text{N}; a unit like "m/s" stays upright. */
export const qty = (s: string, unit: string) => `${decTex(s)}\\,\\text{${unit}}`;

/** The same for the prose of a \text{} line: $43\,\text{N}$. */
export const pq = (s: string, unit: string) => `$${qty(s, unit)}$`;

/**
 * x rounded to n significant figures, as a decimal string without exponent ("8.7", "43", "201", "0.52"). Null when x
 * is too close to a rounding boundary to trust floating point, or when the rounding would need trailing zeros before
 * the decimal point (2 significant figures of 150), which the lessons would write in scientific notation.
 */
export function roundSig(x: number, n: number): string | null {
	if (!Number.isFinite(x)) return null;
	if (x === 0) return null;
	const e = Math.floor(Math.log10(Math.abs(x)));
	const k = n - 1 - e;
	if (k < 0) return null;
	const y = Math.abs(x) * 10 ** k;
	const frac = y - Math.floor(y);
	if (Math.abs(frac - 0.5) < 1e-6) return null;
	const r = Math.round(y);
	// 9.96 with 2 figures becomes 10: one figure too many after the carry, but still n significant figures ("10").
	const s = (r / 10 ** k).toFixed(k);
	const digits = s.replace('-', '').replace('.', '').replace(/^0+/, '');
	if (digits.length !== n) return null;
	return (x < 0 ? '-' : '') + s;
}

/** Whole degrees, half up; null too close to a half. */
export function roundDeg(x: number): string | null {
	const frac = x - Math.floor(x);
	if (Math.abs(frac - 0.5) < 1e-6) return null;
	return String(Math.round(x));
}

export const DEG = Math.PI / 180;

/** Significant figures of a datum written as a decimal string ("45" → 2, "4.5" → 2, "245" → 3). */
export function sigOf(s: string): number {
	return s.replace('-', '').replace('.', '').replace(/^0+/, '').length;
}

/** A modulus with n significant figures and no ambiguous trailing zero: 2 figures 11..99 (not 20, 30...), or 1.1..9.9. */
export function modulus(rng: Rng, n: 2 | 3, small = false): string {
	for (;;) {
		if (n === 2) {
			if (small) {
				const k = rng.int(11, 99);
				if (k % 10) return (k / 10).toFixed(1);
			} else {
				const k = rng.int(11, 99);
				if (k % 10) return String(k);
			}
		} else {
			const k = rng.int(101, 999);
			if (k % 10) return String(k);
		}
	}
}

/**
 * The four options of a quantity: the answer first in `opts`, then the mistakes. Two options with the same text
 * count once; missing ones are taken from `fallback`. Throws if fewer than four remain (the caller resamples).
 */
export function choiceOf(rng: Rng, answer: ChoiceOption, mistakes: ChoiceOption[], fallback: ChoiceOption[] = []): ChoiceAnswer {
	const seen = new Set([answer.latex]);
	const opts: ChoiceOption[] = [answer];
	for (const o of [...mistakes, ...fallback]) {
		if (opts.length >= 4) break;
		if (seen.has(o.latex)) continue;
		seen.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error('not enough distinct options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** An option that is a quantity: its value is the decimal string, and the unit is in the text. */
export const qOpt = (s: string, unit: string, extra = ''): ChoiceOption => ({ latex: qty(s, unit) + (extra ? `\\ \\text{${extra}}` : ''), values: [extra ? `${s} ${extra}` : s] });

// ---------------------------------------------------------------------------
// Scene

export type SceneVec = { da: [number, number]; a: [number, number]; sopra?: boolean; nome?: string; sub?: string; meno?: boolean; colore?: 'vettore' | 'forza' | 'risultante' | 'velocita'; etichetta?: string; tratteggiato?: boolean };
export type SceneAng = { vettore: number; rif: 'x' | '-x' | 'y' | '-y'; testo: string; antiorario?: boolean };
export type Box = { x0: number; x1: number; y0: number; y1: number };

export function scene(alt: string, d: { u: number; griglia?: Box; assi?: boolean | Box; vettori: SceneVec[]; angoli?: SceneAng[]; punti?: { at: [number, number]; nome: string }[] }): SceneRef {
	const round = (x: number) => Math.round(x * 1000) / 1000;
	const vettori = d.vettori.map((w) => ({ ...w, da: [round(w.da[0]), round(w.da[1])] as [number, number], a: [round(w.a[0]), round(w.a[1])] as [number, number] }));
	const data: Record<string, unknown> = { u: d.u, vettori };
	if (d.griglia) data.griglia = d.griglia;
	if (d.assi) data.assi = d.assi;
	if (d.angoli?.length) data.angoli = d.angoli;
	if (d.punti?.length) data.punti = d.punti;
	return { type: 'vettori-piano', data, alt };
}

/** The smallest box of whole grid units around the points, with a margin. */
export function boxAround(points: [number, number][], margin = 1): Box {
	const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
	return { x0: Math.floor(Math.min(...xs)) - margin, x1: Math.ceil(Math.max(...xs)) + margin, y0: Math.floor(Math.min(...ys)) - margin, y1: Math.ceil(Math.max(...ys)) + margin };
}

/** Banned in every text: the long dash and "piuttosto che". */
export const BANNED = /—|piuttosto che/;
