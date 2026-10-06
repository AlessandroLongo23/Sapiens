/**
 * What the three generators of the chemistry chapter on bonds share (chemistry, third year, group E:
 * chim-regola-ottetto, legame-covalente, chim-legame-covalente-polare).
 *
 * Data as the lessons 62-64 give them (docs/lezioni/chimica/riscritte/): bond lengths in pm and bond energies in
 * kJ/mol from the tables of the lessons, Pauling electronegativities with two decimals from
 * src/lib/tools/elementi.json. Formulas in \mathrm, bonds as \mathrm{H{-}Cl}, \mathrm{C{=}C}, \mathrm{N{\equiv}N}.
 *
 * A level is multiple choice, or asks for a whole number: then the sample's answer is the number, for the open
 * answer, and `params.options` lists the right value and three wrong ones, from which toChoice() builds the multiple
 * choice.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { checkChoice } from './chim-atomo';
import { shuffle } from './insiemi';
import { BANNED } from './fis-grandezze';

export { textBlock } from './insiemi';
export { choose, decTex, t, texOpt, textOpt, tx } from './chim-atomo';

/** What a level builds: a multiple choice, or a whole number with three wrong ones. */
export interface BuiltE {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	params: Record<string, unknown>;
	answer?: ChoiceAnswer;
	/** The right number first, then wrong ones in order of preference: the first three that differ are kept. */
	numbers?: number[];
}

/** The options of a number level: the right value and the first three wrong ones that differ from it and from each other. */
export function numberOptions(numbers: number[]): string[] {
	const out: string[] = [];
	for (const n of numbers) {
		const s = String(n);
		if (!Number.isInteger(n) || n < 0 || out.includes(s)) continue;
		out.push(s);
		if (out.length === 4) break;
	}
	if (out.length < 4) throw new Error(`numberOptions: only ${out.length} distinct numbers`);
	return out;
}

export function checkE(sample: Sample): string[] {
	const a = sample.answer;
	if (a.kind === 'choice') return checkChoice(sample);
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	if (a.kind !== 'number') return [...v, 'la risposta deve essere un numero o una scelta'];
	const options = sample.params.options;
	if (!Array.isArray(options) || options.length !== 4 || new Set(options).size !== 4) v.push('servono quattro numeri diversi');
	else if (options[0] !== a.value) v.push('il primo numero non è la risposta');
	if (!/^\d+$/.test(a.value)) v.push('la risposta non è un intero');
	return v;
}

/** The multiple choice of a sample: its own answer, or the four numbers of `params.options`, shuffled. */
export function toChoiceE(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const options = sample.params.options as string[];
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i): ChoiceOption => ({ latex: options[i], values: [options[i]] })), correct: order.indexOf(0) };
}

/** generate(): a level's builder may throw to ask for another draw; the sample must pass checkE(). */
export function generateE(id: string, levels: Record<number, (rng: Rng) => BuiltE>): Generator['generate'] {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: BuiltE;
			try {
				b = make(rng);
			} catch {
				continue;
			}
			let sample: Sample;
			if (b.answer) sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			else if (b.numbers) {
				let options: string[];
				try {
					options = numberOptions(b.numbers);
				} catch {
					continue;
				}
				sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: { kind: 'number', value: options[0] }, params: { ...b.params, options } };
			} else throw new Error(`${id}: level ${level} built neither a choice nor a number`);
			if (checkE(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

// ---------------------------------------------------------------------------
// Words

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "il sodio", "l'azoto", "lo zolfo", "lo iodio", "lo stronzio" */
export function art(name: string): string {
	if (name === 'iodio' || /^(z|x|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
/** "del sodio", "dell'azoto", "dello zolfo" */
export const di = (name: string) => art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");

// ---------------------------------------------------------------------------
// Elements

export interface El {
	sym: string;
	nome: string;
	z: number;
	/** Group, 1 to 18. */
	group: number;
	/** Pauling electronegativity in hundredths (316 for 3,16). */
	chi: number;
	metal: boolean;
}

/** The elements the three generators use, with the data of src/lib/tools/elementi.json. */
export const ELEMENTS: El[] = [
	{ sym: 'H', nome: 'idrogeno', z: 1, group: 1, chi: 220, metal: false },
	{ sym: 'Li', nome: 'litio', z: 3, group: 1, chi: 98, metal: true },
	{ sym: 'Be', nome: 'berillio', z: 4, group: 2, chi: 157, metal: true },
	{ sym: 'C', nome: 'carbonio', z: 6, group: 14, chi: 255, metal: false },
	{ sym: 'N', nome: 'azoto', z: 7, group: 15, chi: 304, metal: false },
	{ sym: 'O', nome: 'ossigeno', z: 8, group: 16, chi: 344, metal: false },
	{ sym: 'F', nome: 'fluoro', z: 9, group: 17, chi: 398, metal: false },
	{ sym: 'Na', nome: 'sodio', z: 11, group: 1, chi: 93, metal: true },
	{ sym: 'Mg', nome: 'magnesio', z: 12, group: 2, chi: 131, metal: true },
	{ sym: 'Al', nome: 'alluminio', z: 13, group: 13, chi: 161, metal: true },
	{ sym: 'Si', nome: 'silicio', z: 14, group: 14, chi: 190, metal: false },
	{ sym: 'P', nome: 'fosforo', z: 15, group: 15, chi: 219, metal: false },
	{ sym: 'S', nome: 'zolfo', z: 16, group: 16, chi: 258, metal: false },
	{ sym: 'Cl', nome: 'cloro', z: 17, group: 17, chi: 316, metal: false },
	{ sym: 'K', nome: 'potassio', z: 19, group: 1, chi: 82, metal: true },
	{ sym: 'Ca', nome: 'calcio', z: 20, group: 2, chi: 100, metal: true },
	{ sym: 'Se', nome: 'selenio', z: 34, group: 16, chi: 255, metal: false },
	{ sym: 'Br', nome: 'bromo', z: 35, group: 17, chi: 296, metal: false },
	{ sym: 'Rb', nome: 'rubidio', z: 37, group: 1, chi: 82, metal: true },
	{ sym: 'Sr', nome: 'stronzio', z: 38, group: 2, chi: 95, metal: true },
	{ sym: 'I', nome: 'iodio', z: 53, group: 17, chi: 266, metal: false },
];

export const el = (sym: string): El => {
	const e = ELEMENTS.find((x) => x.sym === sym);
	if (!e) throw new Error(`chim3-e: no element ${sym}`);
	return e;
};

/** Valence electrons of a main-group element: the group, or the group minus ten from group 13 on. */
export const valence = (e: El) => (e.group <= 2 ? e.group : e.group - 10);

/** A number of hundredths as LaTeX with two decimals: 316 → 3{,}16, 35 → 0{,}35. */
export const hund = (k: number) => `${k < 0 ? '-' : ''}${Math.floor(Math.abs(k) / 100)}{,}${String(Math.abs(k) % 100).padStart(2, '0')}`;

// ---------------------------------------------------------------------------
// Bonds

export interface Bond {
	a: string;
	b: string;
	order: 1 | 2 | 3;
	/** Length in pm and energy in kJ/mol, from the tables of lessons 62 and 63. */
	length: number;
	energy: number;
}

/** The single bonds of the table of lesson 62. */
export const BONDS_62: Bond[] = [
	{ a: 'H', b: 'H', order: 1, length: 74, energy: 436 },
	{ a: 'F', b: 'F', order: 1, length: 141, energy: 159 },
	{ a: 'Cl', b: 'Cl', order: 1, length: 199, energy: 243 },
	{ a: 'Br', b: 'Br', order: 1, length: 228, energy: 193 },
	{ a: 'I', b: 'I', order: 1, length: 267, energy: 151 },
	{ a: 'H', b: 'F', order: 1, length: 92, energy: 567 },
	{ a: 'H', b: 'Cl', order: 1, length: 127, energy: 431 },
	{ a: 'H', b: 'Br', order: 1, length: 141, energy: 366 },
	{ a: 'H', b: 'I', order: 1, length: 161, energy: 298 },
];

/** The bonds of the table of lesson 63, by order. */
export const BONDS_63: Bond[] = [
	{ a: 'C', b: 'C', order: 1, length: 154, energy: 348 },
	{ a: 'C', b: 'C', order: 2, length: 134, energy: 614 },
	{ a: 'C', b: 'C', order: 3, length: 120, energy: 839 },
	{ a: 'N', b: 'N', order: 1, length: 145, energy: 163 },
	{ a: 'N', b: 'N', order: 2, length: 125, energy: 418 },
	{ a: 'N', b: 'N', order: 3, length: 110, energy: 945 },
];

const DASH = { 1: '{-}', 2: '{=}', 3: '{\\equiv}' } as const;

/** A bond in LaTeX: \mathrm{H{-}Cl}, \mathrm{C{=}C}. */
export const bondTex = (a: string, b: string, order: 1 | 2 | 3 = 1) => `\\mathrm{${a}${DASH[order]}${b}}`;
