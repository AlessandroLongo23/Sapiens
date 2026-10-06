/**
 * What the four generators of the chemistry chapter on the electronic structure share (chemistry, third year,
 * group A: chim-luce-spettri, chim-modello-bohr, chim-livelli-energia, chim-onda-particella), and the data the
 * interactive figure of lesson 50 draws.
 *
 * Constants as the lessons 48-51 round them (docs/lezioni/chimica/brief-terzo-anno.md): c = 3,00 · 10⁸ m/s,
 * h = 6,63 · 10⁻³⁴ J·s, N_A = 6,02 · 10²³ mol⁻¹, hydrogen levels E_n = -2,18 · 10⁻¹⁸ J / n², electron mass
 * 9,11 · 10⁻³¹ kg. Numbers are written as the lessons write them: decimal comma, a \cdot 10^{n}, units upright after
 * a thin space.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { choose, textOpt } from './chim-atomo';
import { shuffle } from './insiemi';

export { choose, texOpt, textOpt, tx } from './chim-atomo';
export { textBlock } from './insiemi';

export const C_LIGHT = 3.0e8;
export const H_PLANCK = 6.63e-34;
export const N_AVOGADRO = 6.02e23;
export const RYDBERG = 2.18e-18;
export const M_ELECTRON = 9.11e-31;

/**
 * Successive ionisation energies of the first twenty elements, in kJ/mol, rounded to the unit: IONIZATION[Z - 1][k - 1]
 * is the k-th of element Z. From the table "Molar ionization energies of the elements" (values of the CRC Handbook
 * and NIST), written from memory: to be checked (see docs/lezioni/chimica/note/50-chim-livelli-energia.md). The first
 * of each row agrees with src/lib/tools/elementi.json within 1 kJ/mol.
 */
export const IONIZATION: number[][] = [
	[1312],
	[2372, 5250],
	[520, 7298, 11815],
	[900, 1757, 14849, 21007],
	[801, 2427, 3660, 25026, 32827],
	[1086, 2353, 4620, 6223, 37831, 47277],
	[1402, 2856, 4578, 7475, 9445, 53267, 64360],
	[1314, 3388, 5300, 7469, 10990, 13327, 71330, 84078],
	[1681, 3374, 6050, 8408, 11023, 15164, 17868, 92038, 106434],
	[2081, 3952, 6122, 9371, 12177, 15238, 19999, 23070, 115380, 131432],
	[496, 4562, 6910, 9543, 13354, 16613, 20117, 25496, 28932, 141362, 159076],
	[738, 1451, 7733, 10543, 13630, 18020, 21711, 25661, 31653, 35458, 169988, 189368],
	[578, 1817, 2745, 11577, 14842, 18379, 23326, 27465, 31853, 38473, 42647, 201266, 222316],
	[786, 1577, 3232, 4356, 16091, 19805, 23780, 29287, 33878, 38726, 45962, 50502, 235196, 257923],
	[1012, 1907, 2914, 4964, 6274, 21267, 25431, 29872, 35905, 40950, 46261, 54110, 59024, 271791, 296195],
	[1000, 2252, 3357, 4556, 7004, 8496, 27107, 31719, 36621, 43177, 48710, 54460, 62930, 68216, 311048, 337138],
	[1251, 2298, 3822, 5159, 6542, 9362, 11018, 33604, 38600, 43961, 51068, 57119, 63363, 72341, 78095, 352994, 380760],
	[1521, 2666, 3931, 5771, 7238, 8781, 11995, 13842, 40760, 46186, 52002, 59653, 66199, 72918, 82473, 88576, 397605, 427066],
	[419, 3052, 4420, 5877, 7975, 9590, 11343, 14944, 16964, 48610, 54490, 60730, 68950, 75900, 83080, 93400, 99710, 444880, 476063],
	[590, 1145, 4912, 6491, 8153, 10496, 12270, 14206, 18191, 20385, 57110, 63410, 70110, 78890, 86310, 94000, 104900, 111711, 494850, 527762]
];

/** The electrons of the first twenty elements level by level, from the nucleus: 11 → [2, 8, 1]. */
export function shells(z: number): number[] {
	const out: number[] = [];
	let left = z;
	for (const cap of [2, 8, 8, 2]) {
		if (left <= 0) break;
		out.push(Math.min(cap, left));
		left -= cap;
	}
	return out;
}

/** The sublevels in order of increasing energy, as lesson 50 lists them. */
export const SUBLEVEL_ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
export const SUBLEVEL_CAPACITY: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 };

// ---------------------------------------------------------------------------
// Numbers

/** x rounded to `digits` significant figures, as mantissa and exponent: 5.66e14 → [5.66, 14]. A half rounds up. */
export function sciParts(x: number, digits = 3): [number, number] {
	if (x === 0) return [0, 0];
	let e = Math.floor(Math.log10(Math.abs(x)));
	let m = Number(((x / 10 ** e) * (1 + 1e-12)).toFixed(digits - 1));
	if (Math.abs(m) >= 10) {
		m /= 10;
		e += 1;
	}
	return [m, e];
}

/** x rounded to `digits` significant figures, as a number. */
export function roundSig(x: number, digits = 3): number {
	const [m, e] = sciParts(x, digits);
	return Number(`${m}e${e}`);
}

/** 5.66e14 → `5{,}66 \cdot 10^{14}`. */
export function sciTex(x: number, digits = 3): string {
	const [m, e] = sciParts(x, digits);
	return `${m.toFixed(digits - 1).replace('.', '{,}')} \\cdot 10^{${e}}`;
}

/** 5.66e14 → "5.66e14": the value the checker reads. */
export function sciValue(x: number, digits = 3): string {
	const [m, e] = sciParts(x, digits);
	return `${m.toFixed(digits - 1)}e${e}`;
}

/** A number with a unit as an option: `5{,}66 \cdot 10^{14}\,\text{Hz}`, value "5.66e14 Hz". */
export function sciOpt(x: number, unit: string, digits = 3): ChoiceOption {
	return { latex: `${sciTex(x, digits)}\\,\\text{${unit}}`, values: [`${sciValue(x, digits)} ${unit}`] };
}

/** An integer with the thin space of the thousands from 10 000 on, as the lessons write it: 13354 → `13\,354`. */
export function intTex(n: number): string {
	const s = String(Math.round(n));
	return s.length < 5 ? s : s.replace(/\B(?=(\d{3})+$)/g, '\\,');
}

/** True when x is not close to a rounding tie at `digits` significant figures: the options never hang on a last digit. */
export function clear(x: number, digits = 3): boolean {
	if (!Number.isFinite(x) || x === 0) return false;
	const e = Math.floor(Math.log10(Math.abs(x)));
	const scaled = Math.abs(x) / 10 ** (e - digits + 1);
	const frac = scaled - Math.floor(scaled + 1e-9);
	return Math.abs(frac - 0.5) > 0.08;
}

/** A quantity for the text of a problem: `5{,}66 \cdot 10^{14}\,\text{Hz}`. */
export const sciQ = (x: number, unit: string, digits = 3) => `${sciTex(x, digits)}\\,\\text{${unit}}`;
/** A plain quantity: `530\,\text{nm}` (the number already written, with a point or without). */
export const plainQ = (num: string | number, unit: string) => `${String(num).replace('.', '{,}')}\\,\\text{${unit}}`;
/** A plain number with a unit as an option: `656\,\text{nm}`, value "656 nm". */
export const plainOpt = (num: string | number, unit: string): ChoiceOption => ({ latex: plainQ(num, unit), values: [`${num} ${unit}`] });
/** A whole number as an option. */
export const intOpt = (k: number): ChoiceOption => ({ latex: String(k), values: [String(k)] });

/**
 * The options of a computed quantity: the right value and the mistakes, all written with `digits` figures in
 * scientific notation. Mistakes within 5% of the right value, or not positive, are dropped; three must remain.
 */
export function sciChoice(rng: Rng, right: number, mistakes: number[], unit: string, digits = 3): ChoiceAnswer {
	const others = mistakes.filter((m) => Number.isFinite(m) && m > 0 && Math.abs(m / right - 1) > 0.05).map((m) => sciOpt(m, unit, digits));
	return choose(rng, sciOpt(right, unit, digits), others);
}

// ---------------------------------------------------------------------------
// Statements: one true among false ones, or one false among true ones

export interface Statement {
	text: string;
	ok: boolean;
}

/** Four statements of a pool, one of which is the answer: the only true one (`want`), or the only false one. */
export function statementChoice(rng: Rng, pool: Statement[], want: boolean): { answer: ChoiceAnswer; right: Statement } {
	const right = rng.pick(pool.filter((x) => x.ok === want));
	const others = shuffle(rng, pool.filter((x) => x.ok !== want)).slice(0, 3);
	if (others.length < 3) throw new Error('statementChoice: pool too small');
	return { answer: choose(rng, textOpt(right.text), others.map((x) => textOpt(x.text))), right };
}

// ---------------------------------------------------------------------------
// The generator's loop

export const BANNED = /—|piuttosto che/;

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

/** The common checks: steps, banned words, four options with different writings and values, the right one in range. */
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
