/**
 * Shared pieces of the physics generators on graphs and proportionality (group 3: fis-tabelle-grafici,
 * fis-proporzionalita-diretta, fis-proporzionalita-inversa): measured values written as the physics lessons write them
 * (a fixed number of decimals, trailing zeros kept: 6{,}0 cm), units in upright type after a space, tables of data as a
 * two-column LaTeX array, multiple choice with the unit inside each option, and the `grafico-dati` scene
 * (src/components/content/exercises/scenes/GraficoDati.tsx).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, SceneRef } from './types';
import { Rational, q } from './rational';
import { shuffle, textBlock } from './insiemi';

export type R = Rational;

/** An exact rational from a decimal written with a point: "2.7" → 27/10. */
export function dr(s: string | number): R {
	const str = String(s);
	const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(str);
	if (!m) throw new Error(`grafici: not a decimal "${str}"`);
	const frac = m[3] ?? '';
	return q(Number(`${m[1]}${m[2]}${frac}`), 10 ** frac.length);
}

/** Digits after the comma needed to write r exactly, Infinity if it never ends. */
export function decimals(r: R): number {
	let d = r.den, k2 = 0, k5 = 0;
	while (d % 2 === 0) { d /= 2; k2++; }
	while (d % 5 === 0) { d /= 5; k5++; }
	return d === 1 ? Math.max(k2, k5) : Infinity;
}

/** r rounded to d decimals, halves away from zero. */
export function roundTo(r: R, d: number): R {
	const s = 10 ** d;
	const x = (Math.abs(r.num) * s) / r.den;
	const n = Math.floor(x + 0.5 + 1e-9);
	return q(r.sign() < 0 ? -n : n, s);
}

/** How many decimals a value rounded to `sig` significant figures needs (never negative). */
export function sigDecimals(r: R, sig: number): number {
	const x = Math.abs(r.num / r.den);
	if (x === 0) return 0;
	return Math.max(0, sig - 1 - Math.floor(Math.log10(x) + 1e-12));
}

/** r written with exactly d decimals, decimal comma, thin space in thousands from five digits: 6{,}0, 35\,000. */
export function fx(r: R, d: number): string {
	const scaled = r.mul(q(10 ** d));
	if (!scaled.isInteger()) throw new Error(`grafici: ${r} needs more than ${d} decimals`);
	const neg = scaled.num < 0;
	const s = String(Math.abs(scaled.num)).padStart(d + 1, '0');
	let int = s.slice(0, s.length - d);
	const frac = s.slice(s.length - d);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return `${neg ? '-' : ''}${int}${d ? `{,}${frac}` : ''}`;
}

/** The units of the group, in LaTeX (math mode) and in plain text for the scenes. */
export const UNITS: Record<string, { tex: string; uni: string }> = {
	g: { tex: '\\text{g}', uni: 'g' },
	cm: { tex: '\\text{cm}', uni: 'cm' },
	m: { tex: '\\text{m}', uni: 'm' },
	cm3: { tex: '\\text{cm}^3', uni: 'cm³' },
	L: { tex: '\\text{L}', uni: 'L' },
	s: { tex: '\\text{s}', uni: 's' },
	min: { tex: '\\text{min}', uni: 'min' },
	C: { tex: '^\\circ\\text{C}', uni: '°C' },
	kPa: { tex: '\\text{kPa}', uni: 'kPa' },
	'm/s': { tex: '\\text{m/s}', uni: 'm/s' },
	'L/min': { tex: '\\text{L/min}', uni: 'L/min' },
	'cm/g': { tex: '\\text{cm/g}', uni: 'cm/g' },
	'g/cm': { tex: '\\text{g/cm}', uni: 'g/cm' },
	'g/cm3': { tex: '\\text{g/cm}^3', uni: 'g/cm³' },
	'cm3/g': { tex: '\\text{cm}^3\\text{/g}', uni: 'cm³/g' },
	'min/L': { tex: '\\text{min/L}', uni: 'min/L' },
	'cm/s': { tex: '\\text{cm/s}', uni: 'cm/s' },
	's/cm': { tex: '\\text{s/cm}', uni: 's/cm' },
	'C/min': { tex: '^\\circ\\text{C/min}', uni: '°C/min' },
	'min/C': { tex: '\\text{min/}^\\circ\\text{C}', uni: 'min/°C' },
	'cm/min': { tex: '\\text{cm/min}', uni: 'cm/min' },
	'kPa*cm3': { tex: '\\text{kPa} \\cdot \\text{cm}^3', uni: 'kPa·cm³' },
	'kPa/cm3': { tex: '\\text{kPa/cm}^3', uni: 'kPa/cm³' },
	'm*s': { tex: '\\text{m} \\cdot \\text{s}', uni: 'm·s' },
	'L*min': { tex: '\\text{L} \\cdot \\text{min}', uni: 'L·min' },
	'cm/s2': { tex: '\\text{cm/s}^2', uni: 'cm/s²' },
	'm/s2': { tex: '\\text{m/s}^2', uni: 'm/s²' },
	's2': { tex: '\\text{s}^2', uni: 's²' },
	's2/m': { tex: '\\text{s}^2\\text{/m}', uni: 's²/m' },
	'min2/L': { tex: '\\text{min}^2\\text{/L}', uni: 'min²/L' },
	's2/cm': { tex: '\\text{s}^2\\text{/cm}', uni: 's²/cm' },
};

/** A value with its unit, in math mode: 6{,}0\ \text{cm}. */
export const withUnit = (value: string, unit: string) => `${value}\\ ${UNITS[unit].tex}`;
/** The same in prose, as the lessons write it: "$6{,}0$ cm", "$18$ °C", "$5{,}0\\ \\text{cm}^3$" (a power stays in LaTeX). */
export const prose = (value: string, unit: string) => (/[²³]/.test(UNITS[unit].uni) ? `$${withUnit(value, unit)}$` : `$${value}$ ${UNITS[unit].uni}`);

/** A quantity of an experiment: its symbol (LaTeX and plain) and unit. */
export interface Qty {
	tex: string;
	uni: string;
	unit: string;
}

/** The column header "m (g)" in LaTeX. */
export const header = (x: Qty) => `${x.tex}\\ (${UNITS[x.unit].tex})`;

/** A lab table in columns, one row per measurement. */
export function table(x: Qty, y: Qty, rows: [string, string][]): string {
	return `\\begin{array}{c|c} ${header(x)} & ${header(y)} \\\\ \\hline ${rows.map(([a, b]) => `${a} & ${b}`).join(' \\\\ ')} \\end{array}`;
}

/** Prose (wrapped into \text lines) followed by the table. */
export const proseAndTable = (text: string, tab: string) => textBlock(text, 46, [tab]);

/** An option that is a number with a unit. `values` = [exact value, unit key]. */
export const numOpt = (value: R, d: number, unit: string): ChoiceOption => ({ latex: withUnit(fx(value, d), unit), values: [value.toString(), unit] });
/** An option in words. */
export const textOpt = (key: string, label: string): ChoiceOption => ({ latex: `\\text{${label}}`, values: [key] });

/**
 * Four (or `n`) options: the right one and the first wrong ones that differ from it and from each other in what they
 * show (the LaTeX), shuffled.
 */
export function makeChoice(rng: Rng, right: ChoiceOption, wrong: ChoiceOption[], n = 4): ChoiceAnswer {
	const opts = [right];
	const seen = new Set([right.latex]);
	for (const w of wrong) {
		if (opts.length >= n) break;
		if (seen.has(w.latex)) continue;
		// a number option must be positive: a zero or negative value gives itself away
		if (w.values.length === 2 && (w.values[0].startsWith('-') || w.values[0] === '0')) continue;
		seen.add(w.latex);
		opts.push(w);
	}
	if (opts.length < n) throw new Error(`grafici: only ${opts.length} distinct options`);
	const order = shuffle(rng, opts.map((_, i) => i));
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** The `grafico-dati` scene. Numbers are plain JS numbers (values of the exercise's units). */
export interface AxisSpec {
	nome: string;
	unita: string;
	passo: number;
	celle: number;
	etichette?: number;
}
export function graphScene(x: AxisSpec, y: AxisSpec, extra: { punti?: [number, number][]; barre?: number; linea?: Record<string, unknown>; evidenzia?: [number, number][] }, alt: string): SceneRef {
	return { type: 'grafico-dati', data: { x, y, ...extra }, alt };
}

/** A decimal for the scene, as a JS number. */
export const js = (r: R) => r.num / r.den;
