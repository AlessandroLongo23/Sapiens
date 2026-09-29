/**
 * What the four generators of the forces (physics, first year, group 5) share: numbers written as the physics
 * lessons write them (docs/lezioni/fisica/README.md: decimal comma, thin space before the unit, significant figures,
 * scientific notation with \cdot), rounding to significant figures, the multiple-choice options with the unit inside,
 * and the common part of check() and of the assembly of a Sample.
 *
 * Used by generators/forze.ts, fis-forza-peso.ts, fis-forza-elastica.ts, fis-attrito.ts.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample, SceneRef } from './types';
import { shuffle } from './insiemi';
import { Rational, q } from './rational';

export type R = Rational;
export const n = (x: number) => q(x);
export const t = (s: string) => `\\text{${s}}`;

/** Number of decimal digits of r, or Infinity if its decimal expansion does not end. */
export function decimals(r: R): number {
	let d = r.den;
	let k2 = 0;
	let k5 = 0;
	while (d % 2 === 0) {
		d /= 2;
		k2++;
	}
	while (d % 5 === 0) {
		d /= 5;
		k5++;
	}
	return d === 1 ? Math.max(k2, k5) : Infinity;
}

const pow10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** The exponent e with 10^e <= r < 10^(e+1), for r > 0. */
export function exponent(r: R): number {
	let e = Math.floor(Math.log10(r.num / r.den));
	while (r.compare(pow10(e)) < 0) e--;
	while (r.compare(pow10(e + 1)) >= 0) e++;
	return e;
}

/** r rounded to s significant figures, half up. */
export function roundSig(r: R, s: number): R {
	if (r.sign() <= 0) throw new Error(`roundSig: ${r} is not positive`);
	const scale = pow10(s - 1 - exponent(r));
	const x = r.mul(scale);
	const k = Math.floor((2 * x.num + x.den) / (2 * x.den));
	return q(k).div(scale);
}

/** True when r lies exactly half way between two values with s significant figures (an ambiguous rounding). */
export function isTie(r: R, s: number): boolean {
	const x = r.mul(pow10(s - 1 - exponent(r)));
	return x.sub(q(Math.floor(x.num / x.den))).equals(q(1, 2));
}

/** Digits of a non-negative terminating decimal with exactly d decimals (trailing zeros kept), comma and thin spaces. */
export function fixed(r: R, d: number): string {
	if (decimals(r) > d) throw new Error(`fixed: ${r} has more than ${d} decimals`);
	const scaled = String(r.num * (10 ** d / r.den)).padStart(d + 1, '0');
	let int = scaled.slice(0, scaled.length - d);
	const frac = scaled.slice(scaled.length - d);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return frac ? `${int}{,}${frac}` : int;
}

/** A terminating decimal with no trailing zeros: 9{,}6, 5400, 35\,000. */
export function dec(r: R): string {
	const d = decimals(r);
	if (!Number.isFinite(d) || r.sign() < 0) throw new Error(`dec: ${r} is not a non-negative terminating decimal`);
	return fixed(r, d);
}

/**
 * r written with exactly s significant figures: 59, 2{,}9, 0{,}36, 5{,}0. When the integer part would need more
 * digits than s, or r < 0,001, in scientific notation: 2{,}9 \cdot 10^{3}.
 */
export function sig(r: R, s: number): string {
	const v = roundSig(r, s);
	const e = exponent(v);
	if (e >= s || e < -3) {
		const m = v.div(pow10(e));
		return `${fixed(m, s - 1)} \\cdot 10^{${e}}`;
	}
	return fixed(v, Math.max(0, s - 1 - e));
}

/** A number and its unit, with the thin space: 12\,\text{N}. No unit: the number alone (a coefficient). */
export const withUnit = (num: string, unit: string) => (unit ? `${num}\\,\\text{${unit}}` : num);

// ---------------------------------------------------------------------------
// Multiple choice: the mistakes first, then values near the answer, all written the same way

/** How the answer and the options are written: `sig` rounded to s significant figures, `int` an integer, `exact` a terminating decimal as it is. */
export type Format = { kind: 'sig'; s: number } | { kind: 'int' } | { kind: 'exact' };

export const formatValue = (r: R, f: Format) => (f.kind === 'sig' ? sig(r, f.s) : dec(r));
/** A distractor written like the answer: rounded to the same figures, or to the nearest integer (half up). */
const normalise = (r: R, f: Format) => (f.kind === 'sig' ? roundSig(r, f.s) : f.kind === 'int' ? q(Math.floor((2 * r.num + r.den) / (2 * r.den))) : r);

export function numberOptions(rng: Rng, value: R, mistakes: R[], unit: string, f: Format): ChoiceAnswer {
	const seen = new Set([value.toString()]);
	const opts: ChoiceOption[] = [{ latex: withUnit(formatValue(value, f), unit), values: [value.toString()] }];
	const step = f.kind === 'sig' ? pow10(exponent(value) - f.s + 1) : f.kind === 'exact' ? pow10(-decimals(value)) : q(1);
	const near = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((k) => [value.add(step.mul(n(k))), value.sub(step.mul(n(k)))]);
	for (const c0 of [...mistakes, ...near]) {
		if (opts.length >= 4) break;
		if (c0.sign() <= 0) continue;
		if (f.kind === 'exact' && decimals(c0) > Math.max(2, decimals(value))) continue;
		const c = normalise(c0, f);
		if (c.sign() <= 0) continue;
		if (seen.has(c.toString())) continue;
		seen.add(c.toString());
		opts.push({ latex: withUnit(formatValue(c, f), unit), values: [c.toString()] });
	}
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Assembly and the common checks

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** The answer as it is written (already rounded when the format is 'sig'). */
	answer: R;
	unit: string;
	format: Format;
	mistakes: R[];
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}

export function assemble(id: string, level: number, seed: number, b: Built): Sample {
	const sample: Sample = {
		generatorId: id,
		level,
		seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer: { kind: 'number', value: b.answer.toString() },
		params: {
			...b.params,
			unit: b.unit,
			format: b.format,
			answer: b.answer.toString(),
			mistakes: b.mistakes.filter((m) => m.sign() > 0).map(String),
		},
	};
	if (b.scene) sample.scene = b.scene;
	if (b.solutionScene) sample.solutionScene = b.solutionScene;
	return sample;
}

export function commonCheck(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	if (sample.answer.kind !== 'number') return ['la risposta deve essere un numero'];
	const value = sample.answer.value;
	const ans = Rational.parse(value);
	if (ans.sign() <= 0) v.push('risposta non positiva');
	const f = p.format as Format;
	if (f.kind === 'sig' && !roundSig(ans, f.s).equals(ans)) v.push(`risposta ${ans} non arrotondata a ${f.s} cifre`);
	if (f.kind === 'int' && !ans.isInteger()) v.push('risposta non intera');
	if (p.answer !== value) v.push('params.answer diverso dalla risposta');
	if (sample.choice) {
		const ch = sample.choice;
		if (ch.options.length !== 4 || new Set(ch.options.map((o) => o.values[0])).size !== 4) v.push('scelta: servono quattro opzioni diverse');
		if (ch.options[ch.correct]?.values[0] !== value) v.push("scelta: l'opzione giusta non è la risposta");
	}
	return v;
}

export function choiceFor(sample: Sample, rng: Rng, id: string): ChoiceAnswer {
	if (sample.answer.kind !== 'number') throw new Error(`${id}: no choice for ${sample.answer.kind}`);
	const mistakes = ((sample.params.mistakes ?? []) as string[]).map((s) => Rational.parse(s));
	return numberOptions(rng, Rational.parse(sample.answer.value), mistakes, sample.params.unit as string, sample.params.format as Format);
}

export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]) {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = assemble(id, level, rng.seed, make(rng));
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** Two significant figures from a random integer: 1,0 to 9,9 (scale 1), 10 to 99 (scale 10), 0,10 to 0,99 (scale 0,1). */
export function twoSig(rng: Rng, lo: number, hi: number, scale: R): R {
	return q(rng.int(lo, hi)).mul(scale).div(q(10));
}
