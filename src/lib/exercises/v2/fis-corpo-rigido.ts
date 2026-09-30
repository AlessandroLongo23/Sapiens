/**
 * What the four generators of rigid bodies and levers share (physics, first year, group 7: fis-momento-forza,
 * fis-equilibrio-corpo-rigido, fis-leve, fis-baricentro). Built on fisica-forze.ts (numbers written as the physics
 * lessons write them, rounding to significant figures), with the units of these lessons (N·m, degrees), answers that
 * are a value or a choice between words (the kind of a lever, the kind of equilibrium, a moment with its sense of
 * rotation), and the scene `asta-forze` (src/components/content/exercises/scenes/AstaForze.tsx).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample, SceneRef } from './types';
import { shuffle } from './insiemi';
import { Rational, q } from './rational';
import { dec, exponent, roundSig, sig, isTie } from './fisica-forze';

export type R = Rational;
export { q, dec, sig, roundSig, isTie };
export const n = (x: number) => q(x);
export const t = (s: string) => `\\text{${s}}`;

export type Unit = 'N' | 'm' | 'cm' | 'kg' | 'Nm' | 'deg';
const UNIT: Record<Unit, string> = { N: '\\,\\text{N}', m: '\\,\\text{m}', cm: '\\,\\text{cm}', kg: '\\,\\text{kg}', Nm: '\\,\\text{N} \\cdot \\text{m}', deg: '^\\circ' };
/** The unit as the scene writes it, in plain text. */
export const UNIT_TEXT: Record<Unit, string> = { N: 'N', m: 'm', cm: 'cm', kg: 'kg', Nm: 'N·m', deg: '°' };

/**
 * How a value is written. `sig`: rounded to s significant figures, except that an integer with at least s digits is
 * written whole (600 N, not 6{,}0 \cdot 10^{2}, as the lessons write weights); `int`: an integer.
 */
export type Format = { kind: 'sig'; s: number } | { kind: 'int' };

/** A positive value written with its format: 1{,}0, 0{,}60, 16, 525, 1200. */
export function fmt(r: R, f: Format): string {
	if (f.kind === 'int') return dec(r);
	if (r.isInteger() && exponent(r) >= f.s - 1) return dec(r);
	return sig(r, f.s);
}
/** The value the written form stands for (a rounded r, or r itself when it is written whole). */
export function shown(r: R, f: Format): R {
	if (f.kind === 'int') return r;
	if (r.isInteger() && exponent(r) >= f.s - 1) return r;
	return roundSig(r, f.s);
}
/** A value that would be written ambiguously (exactly half way at the last figure kept). */
export function ambiguous(r: R, f: Format): boolean {
	if (f.kind === 'int') return !r.isInteger();
	if (r.isInteger() && exponent(r) >= f.s - 1) return false;
	return isTie(r, f.s);
}

export const qty = (num: string, u: Unit) => `${num}${UNIT[u]}`;
/** A value with its unit, in LaTeX: 16\,\text{N} \cdot \text{m}. */
export const vq = (r: R, u: Unit, f: Format) => qty(fmt(r, f), u);
/** The same between dollars, for prose. */
export const pv = (r: R, u: Unit, f: Format) => `$${vq(r, u, f)}$`;
/** A decimal as the scene writes it: "0,40 m", "45 N". */
export const sceneText = (r: R, u: Unit, f: Format) => `${fmt(r, f).replace('{,}', ',').replace(/\\,/g, ' ')} ${UNIT_TEXT[u]}`.replace(' °', '°');
/** A number of the drawing: the rational as a float, rounded to 4 decimals. */
export const num = (r: R) => Math.round((r.num / r.den) * 10000) / 10000;
/** Significant figures of a terminating decimal, trailing zeros of an integer not counted: 440 → 2, 0,75 → 2, 105 → 3. */
export function figs(r: R): number {
	const d = dec(r.abs()).replace(/\\,/g, '').replace('{,}', '');
	return (r.isInteger() ? d.replace(/0+$/, '') : d).replace(/^0+/, '').length;
}
/** A float of the drawing rounded to 3 decimals. */
export const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** A decimal in steps of `step` between lo and hi (inclusive), exactly: pickStep(rng, 1, 9, q(5, 100)) → 0,05 … 0,45. */
export function pickStep(rng: Rng, lo: number, hi: number, step: R): R {
	return step.mul(q(rng.int(lo, hi)));
}

// ---------------------------------------------------------------------------
// What a level builds

interface Common {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}
/** A value: the exact truth, how it is written, the mistakes for the options. */
export interface ValueBuilt extends Common {
	kind: 'value';
	truth: R;
	unit: Unit;
	format: Format;
	mistakes: R[];
}
/** A choice between words or signed values, built by the level: the right option first. */
export interface ChoiceBuilt extends Common {
	kind: 'choice';
	right: ChoiceOption;
	others: ChoiceOption[];
}
export type Built = ValueBuilt | ChoiceBuilt;

/** Four options (or all of `others` + 1 when there are fewer, as in a choice of three words), shuffled. */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const seen = new Set([right.values.join('|')]);
	const texts = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (seen.has(o.values.join('|')) || texts.has(o.latex)) continue;
		seen.add(o.values.join('|'));
		texts.add(o.latex);
		opts.push(o);
	}
	if (opts.length < Math.min(count, others.length + 1)) throw new Error('choose: not enough distinct options');
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Whether a value is written whole (an integer with at least s digits) and not rounded. */
export const whole = (r: R, f: Format) => f.kind === 'int' || (r.isInteger() && exponent(r) >= f.s - 1);

/**
 * A distractor written like the answer: rounded to the answer's significant figures (at least two, or s; more when
 * the answer is an integer with more figures, as 525), and to a whole number for `int`.
 */
export function likeAnswer(m: R, answer: R, f: Format): R {
	const digits = answer.isInteger() ? String(answer.num).replace(/0+$/, '').length : 0;
	if (f.kind === 'int') {
		const r = roundSig(m, Math.max(2, digits));
		return r.isInteger() ? r : q(Math.floor((2 * r.num + r.den) / (2 * r.den)));
	}
	return roundSig(m, Math.max(f.s, digits));
}

/** The options of a value: the answer, the mistakes written the same way, then values near it. */
export function valueOptions(rng: Rng, answer: R, mistakes: R[], unit: Unit, f: Format): ChoiceAnswer {
	const opt = (r: R): ChoiceOption => ({ latex: vq(r, unit, f), values: [r.toString()] });
	const digits = answer.isInteger() ? String(answer.num).replace(/0+$/, '').length : 0;
	const s = f.kind === 'int' ? Math.max(2, digits) : Math.max(f.s, digits);
	const e = whole(answer, f) ? Math.max(0, exponent(answer) - s + 1) : exponent(answer) - s + 1;
	const step = e >= 0 ? q(10 ** e) : q(1, 10 ** -e);
	const near: R[] = [];
	for (let k = 1; k <= 8; k++) near.push(answer.add(step.mul(q(k))), answer.sub(step.mul(q(k))));
	const others = [...mistakes, ...near]
		.filter((m) => m.sign() > 0)
		.map((m) => likeAnswer(m, answer, f))
		.filter((m) => m.sign() > 0 && !m.equals(answer));
	return choose(rng, opt(answer), others.map(opt));
}

/** The assembled Sample; for a value, `answer` is a number (the written, rounded value) and the options go in `choice`. */
export function assemble(id: string, level: number, rng: Rng, b: Built): Sample {
	const base = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps };
	let sample: Sample;
	if (b.kind === 'value') {
		const answer = shown(b.truth, b.format);
		sample = {
			...base,
			answer: { kind: 'number', value: answer.toString() },
			params: { ...b.params, unit: b.unit, format: b.format, truth: b.truth.toString(), mistakes: b.mistakes.filter((m) => m.sign() > 0).map(String) },
		};
	} else {
		sample = { ...base, answer: choose(rng, b.right, b.others, Math.min(4, b.others.length + 1)), params: { ...b.params } };
	}
	if (b.scene) sample.scene = b.scene;
	if (b.solutionScene) sample.solutionScene = b.solutionScene;
	return sample;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'number') {
		const p = sample.params;
		return valueOptions(
			rng,
			Rational.parse(a.value),
			((p.mistakes ?? []) as string[]).map((s) => Rational.parse(s)),
			p.unit as Unit,
			p.format as Format,
		);
	}
	if (a.kind === 'choice') {
		const right = a.options[a.correct];
		return choose(rng, right, a.options.filter((_, i) => i !== a.correct), a.options.length);
	}
	throw new Error(`no choice for ${a.kind}`);
}

export const BANNED = /—|piuttosto che/;

export function commonCheck(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind === 'number') {
		const p = sample.params;
		const f = p.format as Format;
		const truth = Rational.parse(p.truth as string);
		if (truth.sign() <= 0) v.push('risposta non positiva');
		if (ambiguous(truth, f)) v.push('arrotondamento ambiguo');
		if (!shown(truth, f).equals(Rational.parse(a.value))) v.push('risposta diversa dal valore arrotondato');
		const ans = Rational.parse(a.value);
		if (new Set(((p.mistakes as string[]) ?? []).map((m) => likeAnswer(Rational.parse(m), ans, f).toString()).filter((m) => m !== a.value)).size < 2) v.push('meno di due errori tipici');
	} else if (a.kind === 'choice') {
		if (a.options.length < 3) v.push('servono almeno tre opzioni');
	} else v.push('tipo di risposta inatteso');
	const ch = sample.choice;
	if (ch) {
		const k = ch.options.length;
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== k || new Set(ch.options.map((o) => o.latex)).size !== k) v.push('scelta: opzioni ripetute');
		if (a.kind === 'number' && (k !== 4 || ch.options[ch.correct]?.values[0] !== a.value)) v.push("scelta: l'opzione giusta non è la risposta");
		if (a.kind === 'choice' && ch.options[ch.correct]?.values.join('|') !== a.options[a.correct].values.join('|')) v.push("scelta: l'opzione giusta non è la risposta");
	}
	if (sample.scene && JSON.stringify(sample.scene).includes('"soluzione"')) v.push('la scena del problema mostra la soluzione');
	return v;
}

export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]) {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: Built;
			try {
				b = make(rng);
			} catch (e) {
				if ((e as Error).message === 'resample') continue;
				throw e;
			}
			const sample = assemble(id, level, rng, b);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

export const RESAMPLE = () => new Error('resample');

/** Words joined as a list: "a, b e c". */
export const joinList = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs.at(-1)}`);

/** A word option (the kind of a lever, of an equilibrium): its value is the key. */
export const wordOpt = (key: string, text: string): ChoiceOption => ({ latex: `\\text{${text}}`, values: [key] });
