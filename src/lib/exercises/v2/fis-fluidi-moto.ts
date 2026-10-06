/**
 * What the four generators of the fluids in motion share (physics, third year, group 38: fis-portata-continuita,
 * fis-bernoulli, fis-torricelli-venturi, fis-viscosita). Built on the float family of the physics generators
 * (vettori.ts, fisica-equilibrio.ts, fis-energia.ts), because every answer goes through π or a square root.
 *
 * Numbers as the lessons 98-101 write them: decimal comma, thin space before the unit, units with an exponent written
 * outside the \text (\text{cm}^2, \text{kg/m}^3). Answers have two significant figures in a unit that needs no
 * scientific notation (L/s, kPa, mm/s, mN), or are a whole number of kPa where the lesson rounds a sum of pressures
 * to the kilopascal. A value within a tenth of a unit of the last figure from a rounding boundary is refused: a
 * student who uses π = 3,14 or keeps three figures in a step must land on the same answer. No answer ends with an
 * ambiguous zero.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { decTex, roundSig } from './vettori';
import { choose } from './fis-energia';

export { t } from './vettori';
export { type Built, checkCommon, generateWith } from './fisica-equilibrio';
export { cut } from './fis-energia';
export { textBlock } from './insiemi';

export const G = 9.8;
/** Water and air, as the lessons write them. */
export const D_ACQUA = 1000;
export const D_ARIA = 1.2;

/** The units of these generators, in LaTeX. */
export const UNIT: Record<string, string> = {
	L: '\\text{L}',
	s: '\\text{s}',
	min: '\\text{min}',
	'L/s': '\\text{L/s}',
	'L/min': '\\text{L/min}',
	'm/s': '\\text{m/s}',
	'cm/s': '\\text{cm/s}',
	'mm/s': '\\text{mm/s}',
	'm/s2': '\\text{m/s}^2',
	m: '\\text{m}',
	cm: '\\text{cm}',
	mm: '\\text{mm}',
	um: '\\mu\\text{m}',
	cm2: '\\text{cm}^2',
	m2: '\\text{m}^2',
	Pa: '\\text{Pa}',
	kPa: '\\text{kPa}',
	N: '\\text{N}',
	kN: '\\text{kN}',
	mN: '\\text{mN}',
	g: '\\text{g}',
	kg: '\\text{kg}',
	'kg/m3': '\\text{kg/m}^3',
	'Pa s': '\\text{Pa} \\cdot \\text{s}',
};

/** A number (a decimal string with a point) and its unit: 4{,}5\,\text{cm}^2. */
export const qu = (s: string, unit: string) => `${decTex(s)}\\,${UNIT[unit]}`;
/** The same between dollars, for prose. */
export const pq = (s: string, unit: string) => `$${qu(s, unit)}$`;
/** An option in a unit. */
export const opt = (s: string, unit: string): ChoiceOption => ({ latex: qu(s, unit), values: [s] });

const endsWithAmbiguousZero = (s: string) => !s.includes('.') && s.endsWith('0');

/**
 * x rounded to n significant figures as a string, or null: when it would need scientific notation (roundSig), when it
 * sits within 0,1 of a unit of the last figure from a rounding boundary, when it ends with an ambiguous zero.
 */
export function rs(x: number, n = 2): string | null {
	const s = roundSig(x, n);
	if (s === null || endsWithAmbiguousZero(s)) return null;
	const e = Math.floor(Math.log10(Math.abs(x)));
	const y = Math.abs(x) * 10 ** (n - 1 - e);
	const frac = y - Math.floor(y);
	return Math.abs(frac - 0.5) < 0.1 + 1e-6 ? null : s;
}

/** x rounded to a whole number from 11 up, as a string, or null near a boundary or with a final zero (kilopascal). */
export function ri(x: number): string | null {
	if (!(x >= 10.5)) return null;
	const frac = x - Math.floor(x);
	if (Math.abs(frac - 0.5) < 0.1 + 1e-6) return null;
	const s = String(Math.round(x));
	return s.endsWith('0') ? null : s;
}

/** Distractors in a unit, rounded like the answer but without the guards; those that cannot be written are dropped. */
export const opts = (xs: number[], unit: string, n = 2): ChoiceOption[] => xs.map((x) => (x > 0 ? roundSig(x, n) : null)).filter((s): s is string => s !== null).map((s) => opt(s, unit));
/** Distractors that are whole numbers (kilopascal). */
export const iopts = (xs: number[], unit: string): ChoiceOption[] => xs.filter((x) => x >= 1).map((x) => opt(String(Math.round(x)), unit));

/** The four options: the answer, the mistakes that differ from it by more than 8%, then the answer scaled. */
export function pick4(rng: Rng, answer: string, unit: string, mistakes: number[], whole = false): ChoiceAnswer {
	const x = Number(answer);
	const make = whole ? (xs: number[]) => iopts(xs, unit) : (xs: number[]) => opts(xs, unit);
	return choose(rng, opt(answer, unit), make(mistakes), make([x * 1.25, x * 0.75, x * 1.5, x * 0.6, x * 2, x * 0.4]));
}

/** A value with two significant figures between lo and hi, no trailing zero, written with the decimals it needs. */
export function d2(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const e = rng.int(Math.floor(Math.log10(lo)), Math.floor(Math.log10(hi)));
		const k = rng.int(11, 99);
		if (k % 10 === 0) continue;
		const x = (k / 10) * 10 ** e;
		if (x < lo - 1e-9 || x > hi + 1e-9) continue;
		return x.toFixed(Math.max(0, 1 - e));
	}
}

/** A label for a scene, as plain text with the decimal comma: "D_1 = 4,0 cm". */
export const lab = (name: string, s: string, unit: string) => `${name} = ${s.replace('.', ',')} ${unit}`;

/**
 * The scene of a pipe with two stretches (src/components/content/exercises/scenes/TuboSezioni.tsx): `rapporto` is the
 * second diameter over the first, `salita` whether the second stretch is higher, `etichette` the data to write
 * (`uno` and `due` under the stretches, `v1` and `v2` beside the arrows, `h` beside the rise).
 */
export function tubo(alt: string, d: { rapporto: number; salita?: boolean; etichette: Record<string, string> }): SceneRef {
	const data: Record<string, unknown> = { rapporto: Math.round(d.rapporto * 1000) / 1000, etichette: d.etichette };
	if (d.salita) data.salita = true;
	return { type: 'tubo-sezioni', data, alt };
}

/**
 * The scene of an open tank with a hole in its wall (scenes/SerbatoioForo.tsx): `livello` the height of the water and
 * `foro` the height of the hole, both from the ground and in the same unit; `etichette` may name `h` (surface to
 * hole), `H` (the whole water) and `y` (ground to hole); `getto` draws where the jet starts, never where it lands.
 */
export function serbatoio(alt: string, d: { livello: number; foro: number; etichette: Record<string, string>; suolo?: boolean }): SceneRef {
	const data: Record<string, unknown> = { livello: d.livello, foro: d.foro, etichette: d.etichette };
	if (d.suolo) data.suolo = true;
	return { type: 'serbatoio-foro', data, alt };
}
