/**
 * Shared helpers of the four generators of the chapter "Documenti di testo e presentazioni" (first year of computer
 * science): word, inf-stili-indici, powerpoint, creare-slide.
 *
 * The questions are short stories in Italian prose (lines of \text{…}, written with textBlock) with four options.
 * A level whose answer is a count has a `number` answer and builds its multiple choice from the wrong values kept in
 * `params.wrong`; the other levels are a choice from the start.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, Rng, Sample } from './types';
import { shuffle, textBlock } from './insiemi';

export { shuffle, textBlock };

export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'] as const;
export const BANNED = /—|piuttosto che/;
export const t = (s: string) => `\\text{${s}}`;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Width of an option line in characters: an answer button on a phone is 252 px wide at 16 px. */
const OPTION_WIDTH = 26;

/** A text label as LaTeX: one \text{…}, or lines of at most OPTION_WIDTH characters stacked in a gathered. */
export function optionTex(label: string): string {
	if (/[%&#_$\\{}]/.test(label)) throw new Error(`optionTex: special character in "${label}"`);
	if (label.length <= OPTION_WIDTH) return t(label);
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= OPTION_WIDTH) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`;
}

/** A text option; `value` identifies it for the checker (by default the label itself). */
export const opt = (label: string, value = label): ChoiceOption => ({ latex: optionTex(label), values: [value] });

/** The right option and the first three of `others` that differ from the options before them, shuffled. */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const seen = new Set([key(right)]);
	const written = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (seen.has(key(o)) || written.has(o.latex)) continue;
		seen.add(key(o));
		written.add(o.latex);
		opts.push(o);
	}
	if (opts.length < count) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Exact numbers: tenths and halves written as "p/q", shown as decimals with the comma

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** n/d in lowest terms: "33/2", "17". */
export function frac(n: number, d = 1): string {
	if (!Number.isInteger(n) || !Number.isInteger(d) || d <= 0) throw new Error(`frac: ${n}/${d}`);
	const g = gcd(n, d) || 1;
	return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
}

/** "33/2" → "16{,}5"; "17" → "17". Only terminating decimals with at most three digits. */
export function numTex(value: string): string {
	const m = /^(-?\d+)(?:\/(\d+))?$/.exec(value);
	if (!m) throw new Error(`numTex: ${value}`);
	const n = Number(m[1]);
	const d = Number(m[2] ?? 1);
	for (let k = 0; k <= 3; k++) {
		const scaled = (n * 10 ** k) / d;
		if (Number.isInteger(scaled)) {
			const s = String(Math.abs(scaled)).padStart(k + 1, '0');
			const whole = s.slice(0, s.length - k);
			return `${scaled < 0 ? '-' : ''}${whole}${k ? `{,}${s.slice(s.length - k)}` : ''}`;
		}
	}
	throw new Error(`numTex: ${value} is not a short decimal`);
}

/** A number in the prose: `$16{,}5$`, or `$16{,}5\,\text{cm}$` with a unit. */
export const num = (value: string | number, unit = '') => `$${numTex(String(value))}${unit ? `\\,\\text{${unit}}` : ''}$`;

const numOpt = (value: string, unit: string): ChoiceOption => ({ latex: `${numTex(value)}${unit ? `\\,\\text{${unit}}` : ''}`, values: [value] });

// ---------------------------------------------------------------------------
// Assembly

export interface Built {
	prompt: string;
	/** Prose, with inline $…$ formulas: it is wrapped in lines here. */
	problem: string;
	/** One sentence of prose per step. */
	steps: string[];
	params: Record<string, unknown>;
	/** A level answered by choosing: the options, the right one included. */
	choice?: ChoiceAnswer;
	/** A level answered by a count: the exact value, the wrong values students reach, and the unit shown with them. */
	number?: { value: string; wrong: string[]; unit?: string };
}

/** The distinct wrong values, without the right one and without negatives. */
export function wrongs(value: string, candidates: (string | number)[]): string[] {
	const out: string[] = [];
	for (const c of candidates.map(String)) if (c !== value && !c.startsWith('-') && c !== '0' && !out.includes(c)) out.push(c);
	return out;
}

function numberChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind !== 'number') throw new Error('numberChoice: not a number');
	const unit = String(sample.params.unit ?? '');
	const wrong = (sample.params.wrong as string[]) ?? [];
	return choose(
		rng,
		numOpt(sample.answer.value, unit),
		wrong.map((w) => numOpt(w, unit)),
	);
}

export function makeGenerator(id: string, title: string, levels: Record<number, LevelSpec>, makers: Record<number, (rng: Rng) => Built>): Generator {
	const check = (sample: Sample): string[] => {
		const v: string[] = [];
		if (!sample.steps.length) v.push('nessun passaggio');
		if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
		const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
		if (sample.answer.kind === 'number') {
			if (!/^\d+(\/\d+)?$/.test(sample.answer.value)) v.push('il numero non è un razionale esatto positivo');
			const wrong = sample.params.wrong;
			if (!Array.isArray(wrong) || new Set(wrong).size !== wrong.length || wrong.length < 3 || wrong.includes(sample.answer.value)) v.push('servono almeno tre valori sbagliati, diversi tra loro e dal giusto');
			if (ch && ch.options[ch.correct]?.values[0] !== sample.answer.value) v.push("l'opzione giusta non è la risposta");
		} else if (sample.answer.kind !== 'choice') v.push('la risposta deve essere una scelta o un numero');
		if (ch) {
			if (ch.options.length !== 4) v.push('servono quattro opzioni');
			if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
			if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
			if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
		}
		return v;
	};
	const generate = (rng: Rng, level: number): Sample => {
		const make = makers[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 200; attempt++) {
			const b = make(rng);
			const base = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: textBlock(b.problem), steps: b.steps.map((s) => textBlock(s)) };
			let sample: Sample;
			if (b.number) {
				const unit = b.number.unit ?? '';
				sample = { ...base, solution: numOpt(b.number.value, unit).latex, answer: { kind: 'number', value: b.number.value }, params: { ...b.params, wrong: b.number.wrong, unit } };
			} else if (b.choice) {
				sample = { ...base, solution: b.choice.options[b.choice.correct].latex, answer: b.choice, params: b.params };
			} else throw new Error(`${id}: level ${level} built neither a choice nor a number`);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
	const toChoice = (sample: Sample, rng: Rng): ChoiceAnswer => (sample.answer.kind === 'choice' ? sample.answer : numberChoice(sample, rng));
	return { id, title, levels, generate, check, toChoice };
}
