/**
 * Shared by the two generators of the chapter "Statistica bivariata" (distribuzioni-doppie,
 * regressione-correlazione): decimals written as the lessons write them, exact rounding, and the multiple
 * choice of a level whose answer is a number, built from the mistakes the generator lists in `params`.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { Rational, q } from './rational';
import { buildChoice } from './razionali';

export const t = (s: string) => `\\text{${s}}`;
export const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), q(0));
export const isum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Digits after the comma of a finite decimal, or null if the decimal is periodic. */
export function decimals(r: Rational): number | null {
	for (let k = 0; k <= 8; k++) if (10 ** k % r.den === 0) return k;
	return null;
}

/** True when r is a finite decimal with at most k digits after the comma. */
export const finite = (r: Rational, k: number) => {
	const d = decimals(r);
	return d !== null && d <= k;
};

/** r with exactly k digits after the comma (r must have at most k): 1{,}90, -0{,}5, 12. */
export function fixed(r: Rational, k: number): string {
	if (!finite(r, k)) throw new Error(`fixed: ${r} has more than ${k} decimals`);
	const scaled = Math.abs(r.num) * (10 ** k / r.den);
	const s = String(scaled).padStart(k + 1, '0');
	const int = s.slice(0, s.length - k), frac = s.slice(s.length - k);
	return `${r.sign() < 0 ? '-' : ''}${int}${k ? `{,}${frac}` : ''}`;
}

/** A finite decimal without trailing zeros: 1{,}5, -2{,}25, 4. */
export function dec(r: Rational): string {
	const k = decimals(r);
	if (k === null) throw new Error(`dec: ${r} is not a finite decimal`);
	return fixed(r, k);
}

/** r rounded to k decimals, half away from zero, with integer arithmetic only. */
export function roundTo(r: Rational, k: number): Rational {
	const a = Math.abs(r.num) * 10 ** k, b = r.den;
	const n = Math.floor((2 * a + b) / (2 * b));
	return q(r.sign() < 0 ? -n : n, 10 ** k);
}

/** 100·√r rounded and truncated to an integer, for r ≥ 0, with exact integer comparisons. */
export function sqrt100(r: Rational): { round: number; trunc: number } {
	let k = Math.floor(100 * Math.sqrt(r.num / r.den));
	while (k > 0 && k * k * r.den > 10000 * r.num) k--;
	while ((k + 1) * (k + 1) * r.den <= 10000 * r.num) k++;
	const round = (2 * k + 1) ** 2 * r.den <= 40000 * r.num ? k + 1 : k;
	return { round, trunc: k };
}

/** A value with its sign in a sum: " + 3", " - 2{,}5". */
export const signed = (r: Rational) => (r.sign() < 0 ? ` - ${dec(r.neg())}` : ` + ${dec(r)}`);
/** A value in parentheses when negative, for a product: (-4). */
export const paren = (r: Rational) => (r.sign() < 0 ? `(${dec(r)})` : dec(r));

export interface Mistake {
	value: Rational;
	why: string;
}

/**
 * What a number level stores for its multiple choice: the answer as the options write it, the wrong values
 * with the mistake each comes from, how many digits every option shows (`digits`; absent: as many as the
 * value has), what follows the number (`\%`), and the interval the options must stay in.
 */
export interface NumberChoice {
	answerLatex: string;
	mistakes: { value: string; latex: string; why: string }[];
	digits?: number;
	suffix?: string;
	min?: string;
	max?: string;
}

export function numberChoice(right: Rational, mistakes: (Mistake | null)[], opts: { digits?: number; suffix?: string; min?: Rational; max?: Rational } = {}): NumberChoice {
	const { digits, suffix = '' } = opts;
	const show = (v: Rational) => `${digits === undefined ? dec(v) : fixed(v, digits)}${suffix}`;
	const inside = (v: Rational) => (!opts.min || v.compare(opts.min) >= 0) && (!opts.max || v.compare(opts.max) <= 0);
	const out: NumberChoice = { answerLatex: show(right), mistakes: [] };
	for (const m of mistakes) {
		if (!m || m.value.equals(right) || !inside(m.value)) continue;
		if (digits === undefined ? !finite(m.value, 2) : !finite(m.value, digits)) continue;
		out.mistakes.push({ value: m.value.toString(), latex: show(m.value), why: m.why });
	}
	if (digits !== undefined) out.digits = digits;
	if (suffix) out.suffix = suffix;
	if (opts.min) out.min = opts.min.toString();
	if (opts.max) out.max = opts.max.toString();
	return out;
}

/** The four options of a number level: the answer, its mistakes, then the neighbours in the last digit shown. */
export function choiceFromParams(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${sample.generatorId}: unexpected answer kind`);
	const p = sample.params as unknown as NumberChoice;
	const right = Rational.parse(sample.answer.value);
	const suffix = p.suffix ?? '';
	const k = p.digits ?? decimals(right) ?? 0;
	const show = (v: Rational) => `${p.digits === undefined ? dec(v) : fixed(v, p.digits)}${suffix}`;
	const min = p.min === undefined ? null : Rational.parse(p.min), max = p.max === undefined ? null : Rational.parse(p.max);
	const correct: ChoiceOption = { latex: p.answerLatex, values: [right.toString()] };
	const cands = p.mistakes.map((m) => ({ latex: m.latex, values: [Rational.parse(m.value).toString()] }));
	const step = q(1, 10 ** k);
	const near = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10, 4, -4, 6, -6];
	return buildChoice(rng, correct, cands, (i) => {
		if (i >= near.length) return null;
		const v = right.add(step.mul(q(near[i])));
		if ((min && v.compare(min) < 0) || (max && v.compare(max) > 0)) return null;
		return { latex: show(v), values: [v.toString()] };
	});
}

const DUMMY: Rng = { seed: 0, next: () => 0, int: (a) => a, pick: (xs) => xs[0] };

/** True when the level's number answer reaches four distinct options. */
export function canChoose(sample: Sample): boolean {
	try {
		choiceFromParams(sample, DUMMY);
		return true;
	} catch {
		return false;
	}
}

/** The checks every sample of the chapter shares: steps, four distinct options, the index in range. */
export function choiceViolations(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('mancano i passaggi');
	const choices = [sample.answer, sample.choice].filter((a): a is ChoiceAnswer => a?.kind === 'choice');
	for (const ch of choices) {
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni non distinte');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		if (ch.correct < 0 || ch.correct >= ch.options.length) v.push('indice della risposta fuori intervallo');
	}
	return v;
}
