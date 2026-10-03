/**
 * Shared pieces of the generators of the chapter "L'architettura del computer" of computer science (inf-von-neumann,
 * inf-cpu, memoria-storage, inf-bus-periferiche, inf-tipi-computer).
 *
 * Problems are Italian prose in \text{} lines, with inline $...$ numbers, sometimes followed by a table. Answers
 * are a multiple choice of short texts, or a whole number with its distractors in `params.distractors`, from
 * which `toChoice` builds the four options. Numbers follow docs/lezioni/informatica/README.md: thousands with a
 * thin space from five digits (65\,536), units upright after a thin space (64\,\text{KiB}).
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, LevelSpec, Rng, Sample } from './types';

export const BANNED = /—|piuttosto che/;
export const t = (s: string) => `\\text{${s}}`;

export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'] as const;

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** k distinct elements of `pool`, in random order. */
export function pickDistinct<T>(rng: Rng, pool: readonly T[], k: number): T[] {
	if (k > pool.length) throw new Error(`pickDistinct: ${k} > ${pool.length}`);
	return shuffle(rng, pool).slice(0, k);
}

/** Visible length of a piece of prose: a LaTeX command counts as one character. */
const visible = (s: string): number => s.replace(/\\[a-zA-Z]+\s?/g, 'x').replace(/[${}]/g, '').length;

function wrap(prose: string, width: number): string[] {
	const words = prose.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out;
}

/** Several LaTeX lines stacked and left-aligned. */
export const lines = (xs: string[]): string => (xs.length === 1 ? xs[0] : `\\begin{array}{l} ${xs.join(' \\\\ ')} \\end{array}`);

/**
 * Italian prose as \text{} lines of about 46 visible characters, with inline $...$ formulas that are never split;
 * `extra` LaTeX lines (a table) follow. The prose must not contain % & # _.
 */
export function textBlock(prose: string, extra: string[] = []): string {
	if (/[%&#_]/.test(prose.replace(/\$[^$]*\$/g, ''))) throw new Error(`textBlock: special character in "${prose}"`);
	return lines([...wrap(prose, 46).map((l) => t(l)), ...extra]);
}

/** A whole number: 4096, 65\,536, 1\,048\,576 (thin spaces from five digits). */
export function num(n: number): string {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error(`num: ${n}`);
	const s = String(n);
	return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
}

/** A number in prose: $65\,536$. */
export const nm = (n: number) => `$${num(n)}$`;

/** A power of two: 2^8, 2^{16}. */
export const pow2 = (n: number) => (n >= 0 && n < 10 ? `2^${n}` : `2^{${n}}`);

/** A text option, on lines of at most 24 characters (the answer button of a phone is 252 px wide). */
export function opt(label: string, value = label): ChoiceOption {
	const ls = wrap(label, 24);
	return { latex: ls.length === 1 ? t(ls[0]) : `\\begin{gathered} ${ls.map(t).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

/** A formula option (a number, a number with its unit). */
export const mathOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });

/** The right option and three of the others, different from it and from one another, shuffled. */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer {
	const seen = new Set([right.values.join('|')]);
	const texts = new Set([right.latex]);
	const wrong: ChoiceOption[] = [];
	for (const o of others) {
		const k = o.values.join('|');
		if (seen.has(k) || texts.has(o.latex)) continue;
		seen.add(k);
		texts.add(o.latex);
		wrong.push(o);
		if (wrong.length === 3) break;
	}
	if (wrong.length < 3) throw new Error(`choose: only ${wrong.length} distractors for ${right.latex}`);
	const options = shuffle(rng, [right, ...wrong]);
	return { kind: 'choice', options, correct: options.indexOf(right) };
}

/** What a level's maker returns. A number answer carries its distractors, the most telling mistakes first. */
export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	params: Record<string, unknown>;
}

/** A whole-number answer with the mistakes a student makes; candidates that are negative, equal to the answer or repeated are dropped. */
export function numberAnswer(value: number, mistakes: number[]): { answer: Answer; distractors: string[] } {
	const out: number[] = [];
	for (const m of [...mistakes, value + 1, value + 2, value + 3, value * 2 + 1]) {
		if (!Number.isSafeInteger(m) || m < 0 || m === value || out.includes(m)) continue;
		out.push(m);
	}
	return { answer: { kind: 'number', value: String(value) }, distractors: out.slice(0, 3).map(String) };
}

export function checkSample(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (!sample.solution) v.push('nessuna soluzione');
	if (BANNED.test(sample.prompt + sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind === 'choice') {
		if (a.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni ripetute');
		if (new Set(a.options.map((o) => o.latex)).size !== a.options.length) v.push('opzioni scritte uguali');
		if (!(a.correct >= 0 && a.correct < a.options.length)) v.push('opzione giusta fuori dai limiti');
	} else if (a.kind === 'number') {
		if (!/^\d+$/.test(a.value)) v.push('la risposta deve essere un numero naturale');
		const d = sample.params.distractors;
		if (!Array.isArray(d) || d.length !== 3 || new Set([a.value, ...d]).size !== 4) v.push('servono tre distrattori diversi dalla risposta');
	} else v.push('la risposta deve essere una scelta o un numero');
	return v;
}

export interface Level extends LevelSpec {
	make: (rng: Rng) => Built;
}

/** A generator from its levels: retries until `check` passes, and builds the choice of a number answer from its distractors. */
export function makeGenerator(id: string, title: string, levels: Record<number, Level>, extraCheck?: (sample: Sample) => string[]): Generator {
	const check = (sample: Sample) => [...checkSample(sample), ...(extraCheck?.(sample) ?? [])];
	return {
		id,
		title,
		levels: Object.fromEntries(Object.entries(levels).map(([k, l]) => [k, { label: l.label, constraints: l.constraints }])),
		generate(rng: Rng, level: number): Sample {
			const lv = levels[level];
			if (!lv) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 200; attempt++) {
				const b = lv.make(rng);
				const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
				if (check(sample).length === 0) return sample;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check,
		toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
			if (sample.answer.kind === 'choice') return sample.answer;
			if (sample.answer.kind !== 'number') throw new Error(`${id}: no choice for ${sample.answer.kind}`);
			const value = sample.answer.value;
			const o = (s: string) => mathOpt(num(Number(s)), s);
			return choose(rng, o(value), (sample.params.distractors as string[]).map(o));
		},
	};
}

/** "il" + noun joined with a preposition: di + il = del, a + la = alla, da + l' = dall'. */
export function prep(p: 'di' | 'a' | 'da' | 'in' | 'su', noun: string): string {
	const stem = { di: 'de', a: 'a', da: 'da', in: 'ne', su: 'su' }[p];
	const table: [string, string][] = [
		["l'", `${stem}ll'`],
		['lo ', `${stem}llo `],
		['la ', `${stem}lla `],
		['il ', `${stem}l `],
		['le ', `${stem}lle `],
		['gli ', `${stem}gli `],
		['i ', `${stem}i `],
	];
	for (const [art, joined] of table) if (noun.startsWith(art)) return joined + noun.slice(art.length);
	return `${p} ${noun}`;
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
