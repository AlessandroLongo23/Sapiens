/**
 * Shared pieces of the generators of the computer science chapter "Il sistema operativo" (inf-funzioni-so,
 * inf-avvio-interfacce, processi-thread, inf-gestione-memoria, inf-file-system).
 *
 * Problems are Italian prose in \text{…} lines (textBlock), sometimes followed by a table or a path on a line of its
 * own. Options are plain text, on more lines with \begin{gathered} when long (the answer button on a phone is 252 px
 * wide), or a path in \texttt{…}. A level whose answer is a number gives it as `number`, with the wrong values of the
 * multiple choice in `params.wrong` and the unit in `params.unit`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, NumberAnswer, Rng, Sample } from './types';
import { shuffle, textBlock } from './insiemi';

export { shuffle, textBlock };

export const BANNED = /—|piuttosto che/;
export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'];
export const t = (s: string) => `\\text{${s}}`;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Plain text as an option: one \text{…}, or lines of at most `width` characters in a gathered. */
export function wrapText(label: string, width = 28): string {
	if (label.length <= width) return t(label);
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`;
}

export const opt = (label: string, value = label): ChoiceOption => ({ latex: wrapText(label), values: [value] });

/** A file name or a path in typewriter type; the backslash of a Windows path is written \textbackslash{}. */
export const tt = (s: string) => `\\texttt{${s.replace(/\\/g, '\\textbackslash{}')}}`;
export const pathOpt = (path: string): ChoiceOption => ({ latex: tt(path), values: [path] });

/**
 * A multiple choice: the right option, then the others in order of preference; the first three that differ from every
 * option before them are kept, then the four are shuffled.
 */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const seen = new Set([key(right)]);
	const latexSeen = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (seen.has(key(o)) || latexSeen.has(o.latex)) continue;
		seen.add(key(o));
		latexSeen.add(o.latex);
		opts.push(o);
	}
	if (opts.length < count) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** An exact rational "p" or "p/q" with a terminating decimal, as LaTeX: 12, 7{,}5, 10\,000. */
export function numTex(value: string): string {
	const [p, q = '1'] = value.split('/');
	let num = Number(p);
	let den = Number(q);
	let digits = 0;
	while (den !== 1) {
		if (digits > 6 || (den % 2 !== 0 && den % 5 !== 0)) throw new Error(`numTex: ${value} is not a terminating decimal`);
		num *= 10;
		const g = gcd(num, den);
		num /= g;
		den /= g;
		digits++;
	}
	const s = String(Math.abs(num)).padStart(digits + 1, '0');
	let int = s.slice(0, s.length - digits);
	const frac = s.slice(s.length - digits);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return (num < 0 ? '-' : '') + (frac ? `${int}{,}${frac}` : int);
}

function gcd(a: number, b: number): number {
	return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** p/q in lowest terms as "p" or "p/q". */
export function frac(p: number, q = 1): string {
	const g = gcd(p, q);
	return q / g === 1 ? String(p / g) : `${p / g}/${q / g}`;
}

/** A number with its unit, between dollars for prose: $12\,\text{ms}$; without unit, $12$. */
export const withUnit = (value: string | number, unit: string) => `${numTex(String(value))}${unit ? `\\,\\text{${unit}}` : ''}`;
export const pw = (value: string | number, unit: string) => `$${withUnit(value, unit)}$`;

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

/** A number answer: its value, the wrong values of the multiple choice in order of preference (only positive exact values are kept), the unit. */
export function numberAnswer(value: number | string, wrong: (number | string)[], unit: string): { answer: NumberAnswer; params: Record<string, unknown> } {
	const v = String(value);
	const seen = new Set([v]);
	const ws: string[] = [];
	for (const w of wrong.map(String)) {
		if (seen.has(w) || w === '0' || !/^\d+(\/\d+)?$/.test(w)) continue;
		seen.add(w);
		ws.push(w);
	}
	return { answer: { kind: 'number', value: v }, params: { wrong: ws.slice(0, 6), unit } };
}

export interface LevelDef extends LevelSpec {
	make(rng: Rng): Built;
	/** The constraints of the spec that the common checks do not cover. */
	check?(sample: Sample): string[];
}

/** A statement of a true-or-false level: `why` says why it is true, or corrects it when it is false. */
export interface Statement {
	id: string;
	text: string;
	why: string;
}

/** "Which of these statements is true?" (one true, three false) or "… is false?" (one false, three true). */
export function statementLevel(rng: Rng, truths: Statement[], falses: Statement[], about: string): Built {
	const mode = rng.next() < 0.5 ? 'vera' : 'falsa';
	const [rights, wrongs] = mode === 'vera' ? [truths, falses] : [falses, truths];
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const steps = [textBlock(right.why)];
	if (mode === 'vera') steps.push(textBlock(`Le altre tre sono false. ${others.map((o) => o.why).join(' ')}`));
	return {
		prompt: `Scegli l'affermazione ${mode}.`,
		problem: textBlock(`Quale di queste affermazioni ${about} è ${mode}?`),
		solution: wrapText(right.text),
		steps,
		answer: choose(
			rng,
			opt(right.text, right.id),
			others.map((o) => opt(o.text, o.id)),
		),
		params: { case: mode, ids: [right.id, ...others.map((o) => o.id)] },
	};
}

/** The generator of a lesson from its levels: the generation loop, the common checks and the multiple choice of the number answers. */
export function makeGenerator(id: string, title: string, defs: Record<number, LevelDef>): Generator {
	const levels: Record<number, LevelSpec> = {};
	for (const [k, d] of Object.entries(defs)) levels[Number(k)] = { label: d.label, constraints: d.constraints };

	function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.answer.kind !== 'number') throw new Error(`${id}: no choice for ${sample.answer.kind}`);
		const unit = String(sample.params.unit ?? '');
		const o = (v: string): ChoiceOption => ({ latex: withUnit(v, unit), values: [v] });
		return choose(rng, o(sample.answer.value), (sample.params.wrong as string[]).map(o));
	}

	function check(sample: Sample): string[] {
		const v: string[] = [];
		if (!sample.steps.length) v.push('nessun passaggio');
		if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
		const a = sample.answer;
		const ch = a.kind === 'choice' ? a : sample.choice;
		if (a.kind === 'number') {
			if (!/^\d+(\/\d+)?$/.test(a.value)) v.push(`risposta non numerica: ${a.value}`);
			const wrong = (sample.params.wrong as string[] | undefined) ?? [];
			if (new Set(wrong).size < 3 || wrong.includes(a.value)) v.push('servono tre valori sbagliati diversi dalla risposta');
		} else if (a.kind !== 'choice') return ['la risposta deve essere un numero o una scelta'];
		if (ch) {
			if (ch.options.length !== 4) v.push('servono quattro opzioni');
			if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
			if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
		}
		return [...v, ...(defs[sample.level]?.check?.(sample) ?? [])];
	}

	function generate(rng: Rng, level: number): Sample {
		const def = defs[level];
		if (!def) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 300; attempt++) {
			let b: Built;
			try {
				b = def.make(rng);
			} catch {
				continue;
			}
			const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	}

	return { id, title, levels, generate, check, toChoice };
}
