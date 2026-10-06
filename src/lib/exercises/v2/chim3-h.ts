/**
 * What the four generators of the chemistry chapter on intermolecular forces and condensed states share (chemistry,
 * third year, group H: chim-forze-dipolo-london, chim-legame-idrogeno, chim-stato-liquido, chim-stato-solido).
 *
 * Notation of the lessons 72-75 (docs/lezioni/chimica/riscritte/): formulas in \mathrm (\mathrm{CH_3OH},
 * \mathrm{Na^+}, \mathrm{Mg^{2+}}), decimal comma, units upright after a thin space (\,\text{mmHg}, \,\text{atm},
 * \,^\circ\text{C}). A level's answer is a multiple choice with four options; where the answer is a pure number a
 * level may also give it as a number (`open`), and the multiple choice then travels as the sample's `choice`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { BANNED } from './fis-grandezze';
import { textBlock } from './insiemi';
import { choose, textOpt } from './chim-atomo';

export { textBlock } from './insiemi';
export { choose, decTex, t, texOpt, textOpt, tx } from './chim-atomo';

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	/** The answer as a pure number, when the level can also be answered by writing it. */
	open?: string;
}

/** The common checks: steps, banned words, four options with different writings and values, a right one. */
export function checkSample(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const ch = sample.answer.kind === 'choice' ? sample.answer : sample.choice;
	if (!ch) return [...v, 'manca la scelta multipla'];
	if (sample.answer.kind !== 'choice' && sample.answer.kind !== 'number') v.push('tipo di risposta non previsto');
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('due opzioni scritte uguali');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('due opzioni con lo stesso valore');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	else if (sample.answer.kind === 'number' && ch.options[ch.correct].values[0] !== sample.answer.value) v.push('la scelta giusta non è il numero della risposta');
	return v;
}

/** generate(): a level's builder may throw to ask for another draw; the sample must pass check(). */
export function generateWith(id: string, levels: Record<number, (rng: Rng) => Built>, check: (s: Sample) => string[]): Generator['generate'] {
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
			const base = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, params: b.params };
			const sample: Sample = b.open === undefined ? { ...base, answer: b.answer } : { ...base, answer: { kind: 'number', value: b.open }, choice: b.answer };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** Asks generateWith for another draw. */
export function redraw(): never {
	throw new Error('redraw');
}

/** A bare integer as an option. */
export const intOpt = (x: number): ChoiceOption => ({ latex: String(x), values: [String(x)] });

export const shuffled = <T,>(rng: Rng, xs: readonly T[]) => xs.map((x) => ({ x, k: rng.next() })).sort((a, b) => a.k - b.k).map((o) => o.x);
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * A formula in LaTeX from its plain writing: 'CH3OH' → \mathrm{CH_3OH}, 'C5H12' → \mathrm{C_5H_{12}}, and with a
 * charge at the end 'Na+' → \mathrm{Na^+}, 'Mg2+' → \mathrm{Mg^{2+}}, 'Cl-' → \mathrm{Cl^-}.
 */
export function fx(formula: string): string {
	const m = formula.match(/^(.*?)(?:(\d?)([+-]))?$/);
	const body = (m?.[1] ?? formula).replace(/\d+/g, (d) => (d.length > 1 ? `_{${d}}` : `_${d}`));
	const charge = m?.[3] ? (m[2] ? `^{${m[2]}${m[3]}}` : `^${m[3]}`) : '';
	return `\\mathrm{${body}${charge}}`;
}

/** Atomic numbers of the elements the four lessons use (src/lib/tools/elementi.json). */
export const Z: Record<string, number> = { H: 1, He: 2, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, Br: 35, Kr: 36, I: 53, Xe: 54 };

/** The atoms of a neutral formula: 'CHCl3' → [['C', 1], ['H', 1], ['Cl', 3]]. */
export function atoms(formula: string): [string, number][] {
	return [...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)].map((m) => [m[1], Number(m[2] || 1)]);
}

/** The electrons of a neutral molecule: the sum of the atomic numbers of its atoms. */
export function electrons(formula: string): number {
	return atoms(formula).reduce((s, [el, n]) => {
		if (!(el in Z)) throw new Error(`electrons: no atomic number for ${el}`);
		return s + Z[el] * n;
	}, 0);
}

/** A question with its answer written once and for all: the levels of facts of a lesson. */
export interface Fact {
	q: string;
	a: string;
	wrong: string[];
	why: string;
}

/** One of the facts, as a multiple choice; `k` in the params tells the checker which one. */
export function factLevel(facts: Fact[], kind = 'fatto') {
	return (rng: Rng): Built => {
		const k = rng.int(0, facts.length - 1);
		const f = facts[k];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(f.q),
			solution: textOpt(f.a).latex,
			steps: [textBlock(f.why)],
			answer: choose(rng, textOpt(f.a), f.wrong.map((x) => textOpt(x))),
			params: { case: kind, k },
		};
	};
}
