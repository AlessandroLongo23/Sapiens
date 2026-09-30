/**
 * What the three generators of the fluids at rest share (physics, first year, group 8: fis-pressione,
 * fis-legge-pascal, fis-legge-stevino). Built on the forces' module (fisica-forze.ts: significant figures, the Sample
 * with a number answer, the common check), with two things it lacks: units with an exponent (cm², m², kg/m³), written
 * `\text{cm}^2` as the lessons write them, and the multiple choice made with those units.
 *
 * Numbers as the physics lessons write them (docs/lezioni/fisica/README.md): decimal comma, thin space before the
 * unit, results with the significant figures of the data (two, usually), scientific notation with \cdot from 10^s up.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { shuffle } from './insiemi';
import { Rational, q } from './rational';
import { type Format, type R, decimals, dec, exponent, formatValue, roundSig, isTie, sig } from './fisica-forze';

export { type Built, type R, assemble, commonCheck, dec, exponent, fixed, generateWith, isTie, n, roundSig, sig, t } from './fisica-forze';

/** g in N/kg, as lesson 17 and the lessons of the fluids write it. */
export const G = q(98, 10);
export const G_TEX = '9{,}8\\,\\text{N/kg}';
/** The atmospheric pressure at sea level of lesson 28, in Pa: 1,01 · 10^5 Pa. */
export const P0 = q(101000);
export const P0_TEX = '1{,}01 \\cdot 10^{5}\\,\\text{Pa}';

/** A unit upright, with its exponent outside the \text: cm^2 → \text{cm}^2, kg/m^3 → \text{kg/m}^3. */
export function unitTex(u: string): string {
	const m = /^(.*?)(\^\d)?$/.exec(u)!;
	return `\\text{${m[1]}}${m[2] ?? ''}`;
}
/** A number and its unit, with the thin space. */
export const withU = (num: string, u: string) => `${num}\\,${unitTex(u)}`;
/** The same between dollars, for prose. */
export const pu = (num: string, u: string) => `$${withU(num, u)}$`;
/** A value with s significant figures and its unit, between dollars. */
export const ps = (r: R, s: number, u: string) => pu(sig(r, s), u);

/** 10^k as a rational. */
export const p10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** A number with two significant figures: lo..hi are integers from 10 to 99, times 10^k. */
export const two = (rng: Rng, k: number, lo = 10, hi = 99): R => q(rng.int(lo, hi)).mul(p10(k - 1));

/** The options: the answer, the mistakes first, then values near it, all written with the answer's format and unit. */
export function optionsFor(rng: Rng, value: R, mistakes: R[], unit: string, f: Format): ChoiceAnswer {
	const seen = new Set([value.toString()]);
	const opts: ChoiceOption[] = [{ latex: withU(formatValue(value, f), unit), values: [value.toString()] }];
	const step = f.kind === 'sig' ? p10(exponent(value) - f.s + 1) : f.kind === 'exact' ? p10(-decimals(value)) : q(1);
	const near = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((k) => [value.add(step.mul(q(k))), value.sub(step.mul(q(k)))]);
	for (const c0 of [...mistakes, ...near]) {
		if (opts.length >= 4) break;
		if (c0.sign() <= 0) continue;
		const c = f.kind === 'sig' ? roundSig(c0, f.s) : c0;
		if (f.kind !== 'sig' && decimals(c) > Math.max(2, decimals(value))) continue;
		if (seen.has(c.toString())) continue;
		seen.add(c.toString());
		opts.push({ latex: withU(formatValue(c, f), unit), values: [c.toString()] });
	}
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** The Generator's toChoice for these samples. */
export function choiceOf(sample: Sample, rng: Rng, id: string): ChoiceAnswer {
	if (sample.answer.kind !== 'number') throw new Error(`${id}: no choice for ${sample.answer.kind}`);
	const mistakes = ((sample.params.mistakes ?? []) as string[]).map((s) => Rational.parse(s));
	return optionsFor(rng, Rational.parse(sample.answer.value), mistakes, sample.params.unit as string, sample.params.format as Format);
}

/** Rounds to s significant figures, or null when the exact value sits half way (an ambiguous rounding). */
export function round2(r: R, s = 2): R | null {
	return isTie(r, s) ? null : roundSig(r, s);
}

/** The exact value, then ≈ the rounded one when they differ: "= 588\,\text{N}" or "\approx 1{,}5 \cdot 10^{4}\,\text{Pa}". */
export function approx(exact: R, s: number, u: string): string {
	const r = roundSig(exact, s);
	const ex = Number.isFinite(decimals(exact)) && decimals(exact) <= 4 ? dec(exact) : null;
	if (r.equals(exact)) return `= ${withU(sig(r, s), u)}`;
	return ex && ex.replace(/\\,/g, '').length <= 9 ? `= ${withU(ex, u)} \\approx ${withU(sig(r, s), u)}` : `\\approx ${withU(sig(r, s), u)}`;
}

/**
 * A datum with two significant figures as the lessons write data: an integer from 100 up as it is (200 N, 1200 kg,
 * 500 cm², the trailing zeros standing for placeholders), anything else with its two figures (4{,}5, 0{,}030, 12).
 */
export function datum(r: R): string {
	return r.isInteger() && r.compare(q(100)) >= 0 ? dec(r) : sig(r, 2);
}
/** A datum with its unit, between dollars. */
export const pd = (r: R, u: string) => pu(datum(r), u);

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
/** A LaTeX number and unit as plain text for the labels of a scene: 1{,}2 \cdot 10^{3} → 1,2 · 10³; cm^2 → cm². */
export function plain(num: string, u = ''): string {
	const n0 = num
		.replace(/\{,\}/g, ',')
		.replace(/\\,/g, ' ')
		.replace(/ \\cdot 10\^\{?(-?\d+)\}?/, (_, e: string) => ` · 10${[...e].map((c) => SUP[c]).join('')}`);
	const u0 = u.replace(/\^(\d)/, (_, e: string) => SUP[e]);
	return u0 ? `${n0} ${u0}` : n0;
}
