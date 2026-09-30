/**
 * What the four generators of the chemistry chapter "Misure e grandezze" share (chemistry, first year, group 21:
 * chim-grandezze-si, chim-massa-volume-densita, chim-temperatura-calore, chim-errori-cifre-significative).
 *
 * Numbers as the lessons 10-13 write them (docs/lezioni/chimica/riscritte/): decimal comma {,}, thousands with \, from
 * five digits, scientific notation a \cdot 10^{n}, units upright after a thin space (25{,}0\,\text{mL},
 * 0{,}789\,\text{g/mL}, 4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)}). Arithmetic on exact rationals. A result with n
 * significant figures is written as the physics lesson "Le cifre significative" writes it: in decimal form, unless its
 * last significant figure is left of the units, or is a zero in the units (1{,}0 \cdot 10^1, not 10), or the number is
 * below 0,001; then in scientific notation. Every answer is a four-option choice with the unit in the option.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { type Rational, q } from './rational';
import { BANNED, choose, dec, decimals, pow10, pow10Tex, sciParts, t, unitTex } from './fis-grandezze';

export { BANNED, choose, dec, decimals, pow10, pow10Tex, q, t };
export type R = Rational;

// ---------------------------------------------------------------------------
// Units

/** Units that unitTex (fis-grandezze) does not write: degrees Celsius and the specific heat per gram. */
const SPECIAL: Record<string, string> = {
	'°C': '^\\circ\\text{C}',
	'J/(g·°C)': '\\text{J/(g}\\cdot{}^\\circ\\text{C)}',
};

/** A unit in LaTeX: \text{mL}, \mu\text{g}, \text{kg/m}^3, ^\circ\text{C}. */
export const U = (u: string) => SPECIAL[u] ?? unitTex(u);
/** A number (already LaTeX) with its unit. */
export const wu = (num: string, u: string) => `${num}\\,${U(u)}`;
/** The same between dollars, for prose. */
export const pu = (num: string, u: string) => `$${wu(num, u)}$`;

// ---------------------------------------------------------------------------
// Rounding and writing

function floorR(r: R): number {
	return Math.floor(r.num / r.den);
}

/** Exponent of the first significant digit of r > 0. */
export function sigPos(r: R): number {
	if (r.sign() <= 0) throw new Error(`sigPos: ${r} is not positive`);
	return sciParts(r).n;
}

/** r > 0 rounded half up to a multiple of 10^p; `half` when what is dropped is exactly half a unit. */
export function roundAt(r: R, p: number): { v: R; half: boolean } {
	const x = r.div(pow10(p));
	const f = floorR(x);
	const c = x.sub(q(f)).compare(q(1, 2));
	return { v: q(f + (c >= 0 ? 1 : 0)).mul(pow10(p)), half: c === 0 };
}

/** r truncated at 10^p. */
export const truncAt = (r: R, p: number): R => q(floorR(r.div(pow10(p)))).mul(pow10(p));

/** A number written with n significant figures: value, the position of its last figure, and the LaTeX. */
export interface Written {
	v: R;
	n: number;
	tex: string;
}

/**
 * The writing of v (already rounded) with n significant figures (trailing zeros kept): decimal, or scientific when
 * the last figure is left of the units, is a zero in the units, or v < 0,001.
 */
export function writeSig(v: R, n: number): Written {
	const p = sigPos(v);
	const last = p - n + 1;
	if (decimals(v) > Math.max(0, -last)) throw new Error(`writeSig: ${v} has more figures than ${n}`);
	const unitsZero = last === 0 && floorR(v) % 10 === 0;
	if (last > 0 || unitsZero || p < -3) {
		// the mantissa, with n - 1 decimals
		const m = v.div(pow10(p));
		return { v, n, tex: p === 0 ? dec(m, n - 1) : `${dec(m, n - 1)} \\cdot ${pow10Tex(p)}` };
	}
	return { v, n, tex: dec(v, Math.max(0, -last)) };
}

/** x rounded to n significant figures and written, or null when the rounding falls exactly at half. */
export function sig(x: R, n: number): Written | null {
	const r = roundAt(x, sigPos(x) - n + 1);
	if (r.half) return null;
	return writeSig(r.v, n); // a carry (9,97 → 10) keeps n figures: 1,0 · 10
}

/** Like sig, but refusing values closer than 1/1000 of the last unit to half (built data that almost tie). */
export function sigSafe(x: R, n: number): Written | null {
	const p = sigPos(x) - n + 1;
	const frac = x.div(pow10(p)).sub(q(floorR(x.div(pow10(p)))));
	if (frac.sub(q(1, 2)).abs().compare(q(1, 1000)) < 0) return null;
	return sig(x, n);
}

/** Significant figures of a decimal written as data ("0.0250" → 3, "25.00" → 4, "1500" → 4). */
export function sigOfData(s: string): number {
	return s.replace('.', '').replace(/^0+/, '').length;
}

/** A decimal string (with a point, as in params) → exact rational. */
export function R_(s: string): R {
	const [i, f = ''] = s.split('.');
	return q(Number(i + f), 10 ** f.length);
}

/** A decimal datum with d decimals from an integer count (k = 1973, d = 2 → 19{,}73). */
export const datum = (k: number, d: number): R => q(k, 10 ** d);

// ---------------------------------------------------------------------------
// Options

/** A quantity option: the writing with its unit; the value is the exact rounded value. */
export const qOpt = (w: Written, u: string): ChoiceOption => ({ latex: wu(w.tex, u), values: [w.v.toString()] });

/** Options from exact values rounded like the answer; values that tie are skipped. */
export function qOpts(xs: (R | null)[], n: number, u: string): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (const x of xs) {
		if (!x || x.sign() <= 0) continue;
		const w = sig(x, n);
		if (w) out.push(qOpt(w, u));
	}
	return out;
}

/** The answer's option and the mistakes' (then fallbacks) in a shuffled four-option choice. */
export function answerOf(rng: Rng, right: Written, u: string, mistakes: (R | null)[], fallback: (R | null)[] = []): ChoiceAnswer {
	return choose(rng, qOpt(right, u), [...qOpts(mistakes, right.n, u), ...qOpts(fallback, right.n, u)]);
}

/** Fallback values near x: ±10%, ±20%, ±30%. */
export const around = (x: R) => [q(11, 10), q(9, 10), q(12, 10), q(8, 10), q(13, 10), q(7, 10)].map((k) => x.mul(k));

// ---------------------------------------------------------------------------
// Samples

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** Steps, banned words, four options with different writings and different values, a valid index. */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map((o) => o.latex)).size !== a.options.length) v.push('opzioni scritte uguali');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** generate(): a level may throw to ask for another draw; the sample must pass check(). */
export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]) {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: Built;
			try {
				b = make(rng);
			} catch {
				continue;
			}
			const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** Prose with inline $…$ as one LaTeX line (for steps). */
export function tx(prose: string): string {
	return prose
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((p) => (p.startsWith('$') ? p.slice(1, -1) : t(p)))
		.join('');
}
