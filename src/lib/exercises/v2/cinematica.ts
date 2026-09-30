/**
 * What the kinematics generators of group 12 share (physics, second year: fis-punto-materiale, velocita,
 * fis-moto-rettilineo-uniforme, fis-accelerazione): exact decimals written as the lessons write them (decimal comma,
 * a minus sign, the unit upright after a thin space: -2{,}5\,\text{m/s}, 3{,}5\,\text{m/s}^2), options with the unit,
 * values rounded to significant figures (vettori.roundSig, which refuses values too close to a boundary), a
 * horizontal table of times and positions, and the `strada-posizioni` scene
 * (src/components/content/exercises/scenes/StradaPosizioni.tsx).
 *
 * Values are decimal strings with a point ("-2.5", "140"); `Rational` does the exact arithmetic when a result must
 * be exact.
 */
import type { ChoiceOption, Rng, SceneRef } from './types';
import { Rational, q } from './rational';
import { decTex, roundSig } from './vettori';

export type R = Rational;

/** An exact rational from a decimal string: "-2.5" → -5/2. */
export function dr(s: string | number): R {
	const str = String(s);
	const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(str);
	if (!m) throw new Error(`cinematica: not a decimal "${str}"`);
	const frac = m[3] ?? '';
	return q(Number(`${m[1]}${m[2]}${frac}`), 10 ** frac.length);
}

/** A terminating rational as a decimal string with a point, without trailing zeros ("-2.5", "140", "0.04"); throws if it never ends. */
export function ds(r: R): string {
	let k = 0;
	let x = r;
	while (!x.isInteger()) {
		x = x.mul(q(10));
		if (++k > 8) throw new Error(`cinematica: ${r.toString()} is not a short decimal`);
	}
	const neg = x.sign() < 0;
	const digits = String(Math.abs(x.num)).padStart(k + 1, '0');
	const out = k ? `${digits.slice(0, digits.length - k)}.${digits.slice(digits.length - k)}` : digits;
	return (neg ? '-' : '') + out;
}

/** Units in LaTeX: m/s2 is metres per second squared. */
const UNIT: Record<string, string> = { 'm/s2': '\\text{m/s}^2' };
export const unitTex = (u: string) => UNIT[u] ?? `\\text{${u}}`;

/** A decimal string in LaTeX with its unit: -2{,}5\,\text{m/s}. */
export const qt = (s: string, unit: string) => `${decTex(s)}\\,${unitTex(unit)}`;
/** The same in the prose of a \text{} line. */
export const pqt = (s: string, unit: string) => `$${qt(s, unit)}$`;
/** An option that is a quantity: its value is the decimal string. */
export const opt = (s: string, unit: string): ChoiceOption => ({ latex: qt(s, unit), values: [s] });

/** x rounded to n significant figures (null near a boundary, or with ambiguous trailing zeros). */
export const sig = (x: number, n: number) => roundSig(x, n);
/** x rounded to d decimals as a string, or null within 1e-6 of a half. */
export function fixed(x: number, d: number): string | null {
	const y = x * 10 ** d;
	if (Math.abs(Math.abs(y - Math.trunc(y)) - 0.5) < 1e-6) return null;
	const r = Math.round(y) / 10 ** d;
	return ds(dr(r.toFixed(d)));
}

/**
 * The value of a step before rounding, in LaTeX: exact when it has at most three decimals ("= 2{,}6"), otherwise cut
 * after three decimals with dots ("= 2{,}708\\ldots"); then "\\approx" and the rounded answer, unless they are equal.
 */
export function thenRound(x: number, ans: string, unit: string): string {
	const r = Math.round(x * 1000);
	const exact = Math.abs(x * 1000 - r) < 1e-6;
	const shown = exact ? ds(dr((r / 1000).toFixed(3))) : ds(dr((Math.trunc(x * 1000) / 1000).toFixed(3)));
	if (exact && Number(shown) === Number(ans)) return `= ${qt(ans, unit)}`;
	return `= ${decTex(shown)}${exact ? '' : '\\ldots'}\\,${unitTex(unit)} \\approx ${qt(ans, unit)}`;
}

/** Options from values that may be missing: the missing ones are skipped. */
export const opts = (xs: (string | null | undefined)[], unit: string) => xs.filter((x): x is string => typeof x === 'string').map((s) => opt(s, unit));

/** A multiple of `step` (an integer) between lo and hi, not zero unless allowed. */
export function stepInt(rng: Rng, lo: number, hi: number, step: number, zero = false): number {
	for (;;) {
		const x = rng.int(Math.ceil(lo / step), Math.floor(hi / step)) * step;
		if (zero || x !== 0) return x;
	}
}

/** A table of times and positions in two columns, one row per reading (narrow enough for a phone). */
export function tableTS(ts: string[], ss: string[], tUnit = 's', sUnit = 'm'): string {
	const rows = ts.map((x, i) => `${decTex(x)} & ${decTex(ss[i])}`).join(' \\\\ ');
	return `\\begin{array}{c|c} t\\ (${unitTex(tUnit)}) & s\\ (${unitTex(sUnit)}) \\\\ \\hline ${rows} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Scene

export type ScenePt = { s: number; nome?: string; etichetta?: string };
export function roadScene(alt: string, d: { unita?: string; punti?: ScenePt[]; tratti?: { da: number; a: number }[]; velocita?: { s: number; verso: 1 | -1; nome: string; sub?: string }[]; spostamento?: { da: number; a: number } }): SceneRef {
	const data: Record<string, unknown> = { unita: d.unita ?? 'm' };
	if (d.punti?.length) data.punti = d.punti;
	if (d.tratti?.length) data.tratti = d.tratti;
	if (d.velocita?.length) data.velocita = d.velocita;
	if (d.spostamento) data.spostamento = d.spostamento;
	return { type: 'strada-posizioni', data, alt };
}

/** A value for a drawing's label: decimal comma, a real minus sign. */
export const lab = (s: string) => s.replace('.', ',').replace('-', '−');
/** The same for the alt text, read aloud: "meno 15". */
export const say = (s: string) => (s.startsWith('-') ? `meno ${s.slice(1)}` : s).replace('.', ',');

/** Moving things on a straight road, all masculine ("Un ciclista passa..."). */
export const MOVERS = ['Un ciclista', 'Un pedone', 'Un carrello', 'Un cane', 'Un monopattino'];

/** Something that plausibly moves at |v| metres per second (a pedestrian does not run at 12 m/s). */
export function moverFor(rng: Rng, v: number): string {
	const a = Math.abs(v);
	if (a <= 2.5) return rng.pick(['Un pedone', 'Un carrello', 'Un cane']);
	if (a <= 8) return rng.pick(['Un ciclista', 'Un cane', 'Un monopattino', 'Un carrello']);
	if (a <= 15) return rng.pick(['Un ciclista', 'Un motorino']);
	return rng.pick(["Un'auto", 'Un treno']);
}
