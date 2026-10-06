/**
 * What the three generators of the second half of the chemistry chapter on bonds share (chemistry, third year,
 * group F: legame-ionico, chim-legame-metallico, chim-formule-lewis).
 *
 * Data as the lessons 65-67 give them (docs/lezioni/chimica/riscritte/): Pauling electronegativities, atomic masses
 * with two decimals and melting points from src/lib/tools/elementi.json; ionic radii in pm as in the table of
 * lesson 65 (Shannon, coordination 6); N_A = 6,02 · 10²³ mol⁻¹. Formulas in \mathrm.
 *
 * A level is a multiple choice, or asks for a whole number: then the sample's answer is the number, for the open
 * answer, and `params.options` lists the right value and three wrong ones, from which toChoiceF() builds the
 * multiple choice.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { checkChoice } from './chim-atomo';
import { shuffle } from './insiemi';
import { BANNED } from './fis-grandezze';

export { textBlock, shuffle } from './insiemi';
export { choose, decTex, t, texOpt, textOpt, tx } from './chim-atomo';

export const N_A = 6.02e23;

/** What a level builds: a multiple choice, or a whole number with three wrong ones. */
export interface BuiltF {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	params: Record<string, unknown>;
	answer?: ChoiceAnswer;
	/** The right number first, then wrong ones in order of preference: the first three that differ are kept. */
	numbers?: number[];
}

/** The options of a number level: the right value and the first three wrong ones, all different whole numbers ≥ 0. */
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

export function checkF(sample: Sample): string[] {
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
export function toChoiceF(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const options = sample.params.options as string[];
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i): ChoiceOption => ({ latex: options[i], values: [options[i]] })), correct: order.indexOf(0) };
}

/** generate(): a level's builder may throw to ask for another draw; the sample must pass checkF(). */
export function generateF(id: string, levels: Record<number, (rng: Rng) => BuiltF>): Generator['generate'] {
	return (rng: Rng, level: number): Sample => {
		const make = levels[level];
		if (!make) throw new Error(`${id}: unknown level ${level}`);
		for (let attempt = 0; attempt < 2000; attempt++) {
			let b: BuiltF;
			try {
				b = make(rng);
			} catch {
				continue;
			}
			const base = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps };
			let sample: Sample;
			if (b.answer) sample = { ...base, answer: b.answer, params: b.params };
			else if (b.numbers) {
				let options: string[];
				try {
					options = numberOptions(b.numbers);
				} catch {
					continue;
				}
				sample = { ...base, answer: { kind: 'number', value: options[0] }, params: { ...b.params, options } };
			} else throw new Error(`${id}: level ${level} built neither a choice nor a number`);
			if (checkF(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

// ---------------------------------------------------------------------------
// Words and numbers

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "il sodio", "l'azoto", "lo zolfo", "lo iodio" */
export function art(name: string): string {
	if (name === 'iodio' || /^(z|x|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
/** "del sodio", "dell'azoto", "dello zolfo" */
export const di = (name: string) => art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");
/** "di sodio", "di alluminio": the name of a compound takes "di" also before a vowel */
export const diNome = (name: string) => `di ${name}`;

/** A number of hundredths with two decimals in LaTeX: 4008 → 40{,}08. */
export const hund = (k: number) => `${Math.floor(k / 100)}{,}${String(k % 100).padStart(2, '0')}`;

/** A positive number with three significant figures: plain (11{,}1, 0{,}250, 110) or a \cdot 10^{n} from 10⁴ up. */
export function sig3(x: number): { tex: string; value: string } {
	let e = Math.floor(Math.log10(x));
	let m = Math.round(x / 10 ** (e - 2));
	if (m >= 1000) {
		m /= 10;
		e += 1;
	}
	if (e >= 4 || e < -3) {
		const digits = String(m);
		return { tex: `${digits[0]}{,}${digits.slice(1)} \\cdot 10^{${e}}`, value: `${digits[0]}.${digits.slice(1)}e${e}` };
	}
	const decimals = Math.max(0, 2 - e);
	const s = (m * 10 ** (e - 2)).toFixed(decimals);
	return { tex: s.replace('.', '{,}'), value: s };
}

/** A subscript in a formula: nothing for 1. */
export const idx = (n: number) => (n === 1 ? '' : `_${n}`);

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// ---------------------------------------------------------------------------
// Elements and ions

export interface ElF {
	sym: string;
	nome: string;
	/** Group, 1 to 18. */
	group: number;
	/** Pauling electronegativity in hundredths (316 for 3,16). */
	chi: number;
	metal: boolean;
	/** Atomic mass in hundredths (2299 for 22,99). */
	mass: number;
}

/** The elements the three generators use, with the data of src/lib/tools/elementi.json. */
export const ELEMENTS_F: ElF[] = [
	{ sym: 'H', nome: 'idrogeno', group: 1, chi: 220, metal: false, mass: 101 },
	{ sym: 'Li', nome: 'litio', group: 1, chi: 98, metal: true, mass: 694 },
	{ sym: 'Be', nome: 'berillio', group: 2, chi: 157, metal: true, mass: 901 },
	{ sym: 'B', nome: 'boro', group: 13, chi: 204, metal: false, mass: 1081 },
	{ sym: 'C', nome: 'carbonio', group: 14, chi: 255, metal: false, mass: 1201 },
	{ sym: 'N', nome: 'azoto', group: 15, chi: 304, metal: false, mass: 1401 },
	{ sym: 'O', nome: 'ossigeno', group: 16, chi: 344, metal: false, mass: 1600 },
	{ sym: 'F', nome: 'fluoro', group: 17, chi: 398, metal: false, mass: 1900 },
	{ sym: 'Na', nome: 'sodio', group: 1, chi: 93, metal: true, mass: 2299 },
	{ sym: 'Mg', nome: 'magnesio', group: 2, chi: 131, metal: true, mass: 2431 },
	{ sym: 'Al', nome: 'alluminio', group: 13, chi: 161, metal: true, mass: 2698 },
	{ sym: 'Si', nome: 'silicio', group: 14, chi: 190, metal: false, mass: 2809 },
	{ sym: 'P', nome: 'fosforo', group: 15, chi: 219, metal: false, mass: 3097 },
	{ sym: 'S', nome: 'zolfo', group: 16, chi: 258, metal: false, mass: 3207 },
	{ sym: 'Cl', nome: 'cloro', group: 17, chi: 316, metal: false, mass: 3545 },
	{ sym: 'K', nome: 'potassio', group: 1, chi: 82, metal: true, mass: 3910 },
	{ sym: 'Ca', nome: 'calcio', group: 2, chi: 100, metal: true, mass: 4008 },
	{ sym: 'Fe', nome: 'ferro', group: 8, chi: 183, metal: true, mass: 5585 },
	{ sym: 'Ni', nome: 'nichel', group: 10, chi: 191, metal: true, mass: 5869 },
	{ sym: 'Cu', nome: 'rame', group: 11, chi: 190, metal: true, mass: 6355 },
	{ sym: 'Zn', nome: 'zinco', group: 12, chi: 165, metal: true, mass: 6538 },
	{ sym: 'Br', nome: 'bromo', group: 17, chi: 296, metal: false, mass: 7990 },
	{ sym: 'Rb', nome: 'rubidio', group: 1, chi: 82, metal: true, mass: 8547 },
	{ sym: 'Sr', nome: 'stronzio', group: 2, chi: 95, metal: true, mass: 8762 },
	{ sym: 'I', nome: 'iodio', group: 17, chi: 266, metal: false, mass: 12690 },
	{ sym: 'Cs', nome: 'cesio', group: 1, chi: 79, metal: true, mass: 13291 },
	{ sym: 'Ba', nome: 'bario', group: 2, chi: 89, metal: true, mass: 13733 },
];

export const elF = (sym: string): ElF => {
	const e = ELEMENTS_F.find((x) => x.sym === sym);
	if (!e) throw new Error(`chim3-f: no element ${sym}`);
	return e;
};

/** Valence electrons of a main-group element: the group, or the group minus ten from group 13 on. */
export const valenceF = (e: ElF) => (e.group <= 2 ? e.group : e.group - 10);

/** The charge of the ion of a main-group element (lesson 65): +valence for a metal, valence − 8 for a non-metal. */
export const ionCharge = (e: ElF) => (e.metal ? valenceF(e) : valenceF(e) - 8);

/** An ion in LaTeX: \mathrm{Na^+}, \mathrm{O^{2-}}, \mathrm{Al^{3+}}. */
export function ionTex(sym: string, q: number): string {
	const n = Math.abs(q);
	const s = q > 0 ? '+' : '-';
	return `\\mathrm{${sym}^${n === 1 ? s : `{${n}${s}}`}}`;
}

/** The name of the anion of a non-metal: cloruro, ossido, solfuro, nitruro. */
export const ANION_NAME: Record<string, string> = { F: 'fluoruro', Cl: 'cloruro', Br: 'bromuro', I: 'ioduro', O: 'ossido', S: 'solfuro', N: 'nitruro' };

/** Ionic radii in pm (lesson 65, Shannon for coordination 6). */
export const IONIC_RADIUS: Record<string, number> = { Li: 76, Na: 102, K: 138, Mg: 72, Ca: 100, F: 133, Cl: 181, Br: 196, O: 140 };

/** The formula of the ionic compound of a cation and an anion, with the smallest indices: \mathrm{Al_2O_3}. */
export function ionicFormula(cation: string, qc: number, anion: string, qa: number): { tex: string; nc: number; na: number } {
	const l = (qc * qa) / gcd(qc, qa);
	const nc = l / qc, na = l / qa;
	return { tex: `\\mathrm{${cation}${idx(nc)}${anion}${idx(na)}}`, nc, na };
}
