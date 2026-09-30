/**
 * Shared pieces of the chemistry generators of group 23 (matter 2: chim-separazione-miscugli, chim-passaggi-stato,
 * chim-curve-riscaldamento). Group 22's helpers are in chim-materia.ts. Mostly multiple choice on short situations,
 * with the data drawn for each exercise.
 *
 * Numbers as the lessons write them: decimal comma {,}, temperatures $56\,^\circ\text{C}$, lengths
 * $2{,}4\,\text{cm}$. Options are plain text (\text{...}), on more lines (gathered) when longer than 24 characters,
 * so that an answer button on a phone holds them (scripts/exercises/width.mts).
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, Rng, Sample, SceneRef } from './types';
import { choose, t, BANNED } from './fis-grandezze';

export { choose, t, BANNED };
export { textBlock, shuffle, pickDistinct } from './insiemi';

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
}

/** A label on lines of at most `width` characters, as \text{} lines stacked in a gathered. */
export function wrapText(label: string, width = 24): string {
	if (label.length <= width) return t(label);
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`;
}

/** An option in words; its value is the label itself unless given. */
export const opt = (label: string, value = label): ChoiceOption => ({ latex: wrapText(label), values: [value] });

/** An option made of numbered lines (the steps of a procedure). */
export const optLines = (lines: string[], value: string): ChoiceOption => ({
	latex: `\\begin{gathered} ${lines.map((l, i) => t(`${i + 1}. ${l}`)).join(' \\\\ ')} \\end{gathered}`,
	values: [value],
});

/** An integer n divided by 10^d, the Italian way for LaTeX: dec(24, 1) → 2{,}4, dec(30, 2) → 0{,}30. */
export function dec(n: number, d: number): string {
	const neg = n < 0;
	const s = String(Math.abs(n)).padStart(d + 1, '0');
	const int = s.slice(0, s.length - d);
	const frac = s.slice(s.length - d);
	return (neg ? '-' : '') + (d ? `${int}{,}${frac}` : int);
}

/** A temperature in prose: $-114\,^\circ\text{C}$. */
export const deg = (T: number) => `$${T}\\,^\\circ\\text{C}$`;
/** A temperature as an option. */
export const degOpt = (T: number): ChoiceOption => ({ latex: `${T}\\,^\\circ\\text{C}`, values: [String(T)] });

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The checks every sample of these generators passes. */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
	return v;
}

/** A generator from its levels: each level builds a sample, retried until `extra` finds nothing wrong. */
export function makeGenerator(id: string, title: string, levels: Record<number, LevelSpec>, build: Record<number, (rng: Rng) => Built>, extra: (s: Sample) => string[] = () => []): Generator {
	const check = (s: Sample) => [...checkCommon(s), ...extra(s)];
	return {
		id,
		title,
		levels,
		generate(rng: Rng, level: number): Sample {
			const make = build[level];
			if (!make) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 300; attempt++) {
				const b = make(rng);
				const sample: Sample = {
					generatorId: id,
					level,
					seed: rng.seed,
					prompt: b.prompt,
					problem: b.problem,
					solution: b.solution,
					steps: b.steps,
					answer: b.choice,
					params: b.params,
					...(b.scene ? { scene: b.scene } : {}),
				};
				if (check(sample).length === 0) return sample;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check,
	};
}
