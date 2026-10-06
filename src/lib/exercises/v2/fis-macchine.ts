/**
 * What the three generators of the heat engines share (physics, third year, group 43: fis-macchine-termiche,
 * fis-enunciati-kelvin-clausius, fis-ciclo-carnot): the units of lessons 114-116 (joule and kilojoule, kilowatt,
 * kelvin and degrees Celsius, minutes, moles, litres, kilopascal, and no unit at all for an efficiency), numbers
 * written as the lessons write them (decimal comma, thin space before the unit, scientific notation with \cdot),
 * the multiple choice with the unit in the option, the options that are sentences, and the scene of an engine
 * between its reservoirs (`macchina-termica`, src/components/content/exercises/scenes/MacchinaTermica.tsx). Exact
 * values are rationals; rounding, ties and the writing of a value come from fis-termologia.ts, whose Built,
 * checkCommon and generateWith are reused.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample, SceneRef } from './types';
import { shuffle } from './insiemi';
import { q } from './rational';
import { type R, exponent } from './fisica-forze';
import { type Fmt, fmt, fmtExact, plainDec, roundTo } from './fis-termologia';
import { BANNED } from './vettori';

export { type R } from './fisica-forze';
export { q } from './rational';
export { type Built, type Fmt, INT, SIG2, checkCommon, fmt, fmtExact, generateWith, roundTo, tie, two } from './fis-termologia';
export { shuffle, textBlock } from './insiemi';

export const t = (s: string) => `\\text{${s}}`;

/** The units, as the lessons write them after the thin space; `none` is a pure number (an efficiency). */
export const UNIT = {
	none: '',
	J: '\\text{J}',
	kJ: '\\text{kJ}',
	kW: '\\text{kW}',
	K: '\\text{K}',
	C: '^\\circ\\text{C}',
	min: '\\text{min}',
	mol: '\\text{mol}',
	L: '\\text{L}',
	kPa: '\\text{kPa}',
} as const;
export type Unit = keyof typeof UNIT;

export const SIG3: Fmt = { kind: 'sig', s: 3 };
/** An efficiency: two decimals, the zero kept (0,40). */
export const ETA: Fmt = { kind: 'fixed', d: 2 };

const p10 = (k: number) => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

/** A number and its unit, with the thin space; the number alone when there is no unit. */
export const wu = (num: string, u: Unit) => (u === 'none' ? num : `${num}\\,${UNIT[u]}`);
/** The same between dollars, for prose. */
export const pu = (num: string, u: Unit) => `$${wu(num, u)}$`;
/** An exact datum with its unit, between dollars. */
export const pd = (r: R, u: Unit) => pu(fmtExact(r), u);

export const option = (r: R, u: Unit, f: Fmt): ChoiceOption => {
	const v = roundTo(r, f);
	return { latex: wu(fmt(v, f), u), values: [plainDec(v)] };
};

/**
 * The four options: the answer, then the mistakes (rounded like the answer), then values near it. Values that
 * coincide are kept once and non-positive ones are dropped. `max`, when given, drops what lies above it (an
 * efficiency above 1 is kept as a mistake only where the generator asks for it). Throws when fewer than four are
 * left: the level draws again.
 */
export function options(rng: Rng, answer: R, mistakes: (R | null)[], u: Unit, f: Fmt, max?: R): ChoiceAnswer {
	const a = roundTo(answer, f);
	const seen = new Set([plainDec(a)]);
	const opts: ChoiceOption[] = [option(a, u, f)];
	const step = f.kind === 'sig' ? p10(exponent(a.abs()) - f.s + 1) : f.kind === 'int' ? q(Math.max(1, Math.round(a.num / a.den / 25))) : p10(-f.d);
	const nearby = [2, 3, 1, 5, 4, 6, 7, 8].flatMap((k) => [a.add(step.mul(q(k))), a.sub(step.mul(q(k)))]);
	for (const m of [...mistakes, ...nearby]) {
		if (opts.length >= 4) break;
		if (!m || m.sign() <= 0) continue;
		const v = roundTo(m, f);
		if (v.sign() <= 0 || (max && v.compare(max) > 0)) continue;
		const key = plainDec(v);
		if (seen.has(key)) continue;
		seen.add(key);
		opts.push(option(v, u, f));
	}
	if (opts.length < 4) throw new Error('not enough options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** An option that is a sentence: `values` is its key, which the checker reads. */
export const wordOpt = (key: string, text: string): ChoiceOption => ({ latex: `\\text{${text}}`, values: [key], text });

/** Four sentences in a random order; `right` is the key of the correct one. */
export function wordChoice(rng: Rng, all: readonly { key: string; text: string }[], right: string): ChoiceAnswer {
	const order = shuffle(rng, all);
	return { kind: 'choice', options: order.map((o) => wordOpt(o.key, o.text)), correct: order.findIndex((o) => o.key === right) };
}

/** The checks of a level whose options are sentences: steps, banned words, four different options, one of them right. */
export function checkWords(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values[0])).size !== 4) v.push('due opzioni con la stessa chiave');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/**
 * True when a rounded answer would be written with an ambiguous zero: a whole number that ends with a zero and is
 * not in scientific notation (40 kJ; 420 J when the format is an integer).
 */
export function ambiguous(r: R, f: Fmt): boolean {
	const v = roundTo(r, f).abs();
	if (v.sign() === 0) return true;
	if (f.kind === 'fixed' && f.d > 0) return false;
	if (f.kind === 'sig' && exponent(v) >= f.s) return false;
	return v.isInteger() && v.num % 10 === 0;
}

/** An integer in lo..hi that does not end with a zero. */
export function noZero(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
}

/** True when a float is too close to a rounding boundary at s significant figures to be rounded safely. */
export function nearTie(x: number, s: number): boolean {
	const a = Math.abs(x);
	if (a === 0) return true;
	const y = a / 10 ** (Math.floor(Math.log10(a)) - s + 1);
	return Math.abs(y - Math.floor(y) - 0.5) < 0.02;
}
/** A result that comes from a logarithm, as a rational to the hundred-thousandth: enough to round it to three figures. */
export const fromFloat = (x: number) => q(Math.round(x * 100000), 100000);

/** A value for the steps, cut after `d` decimals with the dots of a number that goes on: 0{,}368\ldots */
export function cut(x: number, d = 3): string {
	const k = 10 ** d;
	return `${(Math.trunc(Math.abs(x) * k + 1e-9) / k).toFixed(d).replace('.', '{,}')}\\ldots`;
}

/** A value for a drawing's label: a decimal comma, a thin space before the unit left to the caller. */
export const lab = (r: R) => fmtExact(r).replace('{,}', ',').replace(/\\,/g, ' ');

// ---------------------------------------------------------------------------
// The scene of an engine between its reservoirs

export type Flow = { verso: 'entra' | 'esce' | 'passa'; testo: string };
export type Device = { nome: string; vietato?: boolean; caldo?: Flow; freddo?: Flow; lavoro?: Flow };

export function scenaMacchine(dispositivi: Device[], alt: string, sorgenti?: { calda?: string; fredda?: string }): SceneRef {
	return { type: 'macchina-termica', data: { dispositivi, ...(sorgenti ? { sorgenti } : {}) }, alt };
}

/** A heat engine: Q_c in, Q_f out, W out. A label left out leaves its arrow without text. */
export const engine = (qc: string, qf: string, w: string): Device => ({
	nome: 'macchina',
	caldo: { verso: 'entra', testo: qc },
	freddo: { verso: 'esce', testo: qf },
	lavoro: { verso: 'esce', testo: w },
});
