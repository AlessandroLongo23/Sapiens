/**
 * What the three generators of the chapter on the periodic properties share (chemistry, third year, group D:
 * proprieta-periodiche, chim-affinita-elettronegativita, chim-metalli-non-metalli).
 *
 * The elements' data are those of the site's periodic table (src/lib/tools/elementi.json), as in lessons 59-61:
 * covalent radius in pm, first ionisation energy in kJ/mol, Pauling electronegativity, family, configuration. What that
 * file does not have is here, with the values of the lessons: electron affinities (energy released, kJ/mol), ionic
 * radii (pm) and successive ionisation energies (kJ/mol).
 *
 * Every exercise has a multiple choice with four options. Where the answer is a pure number the sample's answer is a
 * `number` and the choice is kept in `params.choice`, which `toChoice` hands back: those levels can take an open answer.
 */
import data from '../../tools/elementi.json';
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { BANNED } from './fis-grandezze';
import { shuffle } from './insiemi';

export { textBlock, shuffle } from './insiemi';
export { t, tx, textOpt, texOpt, choose, decTex } from './chim-atomo';

export interface El {
	z: number;
	sym: string;
	/** Lower case, as in a sentence: "sodio". */
	nome: string;
	period: number;
	group: number | null;
	family: string;
	config: string;
	chi: number | null;
	radius: number | null;
	ei: number | null;
}

export const ELS: El[] = (data as { z: number; symbol: string; name: string; period: number; group: number | null; family: string; config: string; electronegativity: number | null; radius: number | null; ionization: number | null }[]).map((e) => ({
	z: e.z,
	sym: e.symbol,
	nome: e.name.toLowerCase(),
	period: e.period,
	group: e.group,
	family: e.family,
	config: e.config,
	chi: e.electronegativity,
	radius: e.radius,
	ei: e.ionization,
}));
export const EL: Record<string, El> = Object.fromEntries(ELS.map((e) => [e.sym, e]));
export const at = (period: number, group: number): El | undefined => ELS.find((e) => e.period === period && e.group === group);

/** Electron affinity, kJ/mol released (lesson 60); null where the anion is not stable. */
export const AFFINITY: Record<string, number | null> = {
	H: 73, Li: 60, Be: null, B: 27, C: 122, N: null, O: 141, F: 328, Ne: null,
	Na: 53, Mg: null, Al: 42, Si: 134, P: 72, S: 200, Cl: 349, Ar: null, K: 48, Br: 325, I: 295,
};

/** The most common ion of an element: charge and ionic radius in pm (lesson 59). */
export const IONS: Record<string, { q: number; r: number }> = {
	Li: { q: 1, r: 76 }, Na: { q: 1, r: 102 }, K: { q: 1, r: 138 }, Mg: { q: 2, r: 72 }, Ca: { q: 2, r: 100 }, Al: { q: 3, r: 54 },
	O: { q: -2, r: 140 }, S: { q: -2, r: 184 }, F: { q: -1, r: 133 }, Cl: { q: -1, r: 181 }, Br: { q: -1, r: 196 },
};

/** Successive ionisation energies, kJ/mol, rounded to the unit (lesson 59 has those of Na, Mg and Al). */
export const SUCCESSIVE: Record<string, number[]> = {
	Li: [520, 7298, 11815],
	Be: [900, 1757, 14849, 21007],
	B: [801, 2427, 3660, 25026],
	C: [1086, 2353, 4621, 6223, 37831],
	Na: [496, 4562, 6910, 9543],
	Mg: [738, 1451, 7733, 10543],
	Al: [578, 1817, 2745, 11577],
	Si: [787, 1577, 3232, 4356, 16091],
	K: [419, 3052, 4420, 5877],
	Ca: [590, 1145, 4912, 6491],
};

export const ORD = ['', 'primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto'];
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "il sodio", "l'argon", "lo zolfo", "lo stagno", "lo iodio", "lo xeno". */
export function art(name: string) {
	if (name === 'iodio' || /^(z|x|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
/** "del sodio", "dell'argon", "dello zolfo". */
export const di = (name: string) => art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");
/** "sul sodio", "sull'argon", "sullo zolfo". */
export const su = (name: string) => art(name).replace(/^il /, 'sul ').replace(/^lo /, 'sullo ').replace(/^l'/, "sull'");

export const symTex = (sym: string) => `\\mathrm{${sym}}`;
/** Na^+, Mg^{2+}, Cl^-, O^{2-} inside \mathrm. */
export function ionTex(sym: string, q: number) {
	const n = Math.abs(q);
	const s = q > 0 ? '+' : '-';
	return `\\mathrm{${sym}^${n === 1 ? s : `{${n}${s}}`}}`;
}
/** "[Ne] 3s2 3p5" → [\text{Ne}]\,3s^2\,3p^5 (3d10 → 3d^{10}). */
export function configTex(config: string) {
	return config
		.split(' ')
		.map((p) => {
			const core = /^\[(\w+)\]$/.exec(p);
			if (core) return `[\\text{${core[1]}}]`;
			const m = /^(\d[spdf])(\d+)$/.exec(p)!;
			return `${m[1]}^${m[2].length > 1 ? `{${m[2]}}` : m[2]}`;
		})
		.join('\\,');
}
/** 495.8 → 495{,}8; 11577 → 11\,577 (a thin space from five digits, as the lessons write). */
export function numTex(x: number, digits?: number) {
	const s = digits === undefined ? String(x) : x.toFixed(digits);
	const [whole, frac] = s.split('.');
	const w = whole.length >= 5 ? whole.replace(/\B(?=(\d{3})+$)/g, '\\,') : whole;
	return frac ? `${w}{,}${frac}` : w;
}
export const KJ = '\\,\\text{kJ/mol}';
export const PM = '\\,\\text{pm}';

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	/** A pure number as the answer ("7", "24/25"): the level can then take an open answer. */
	number?: string;
	params: Record<string, unknown>;
}

function checkChoice(a: ChoiceAnswer): string[] {
	const v: string[] = [];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map((o) => o.latex)).size !== a.options.length) v.push('due opzioni scritte uguali');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** The checks every sample passes: steps, banned words, four options with distinct values, the number among them. */
export function checkSample(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind === 'choice') return [...v, ...checkChoice(a)];
	if (a.kind !== 'number') return [...v, 'la risposta deve essere un numero o una scelta'];
	const ch = sample.params.choice as ChoiceAnswer | undefined;
	if (!ch) return [...v, 'manca la scelta multipla'];
	v.push(...checkChoice(ch));
	if (ch.options[ch.correct]?.values[0] !== a.value) v.push("l'opzione giusta non è il numero della risposta");
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
			const sample: Sample = {
				generatorId: id,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.number === undefined ? b.answer : { kind: 'number', value: b.number },
				params: b.number === undefined ? b.params : { ...b.params, choice: b.answer },
			};
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** The multiple choice of a sample: its answer, or the one kept in params for a number. */
export function toChoice(sample: Sample): ChoiceAnswer {
	return sample.answer.kind === 'choice' ? sample.answer : (sample.params.choice as ChoiceAnswer);
}

export const again = (): never => {
	throw new Error('redraw');
};

/** p/q in lowest terms from an integer number of hundredths: 96 → "24/25", 200 → "2". */
export function hundredths(k: number) {
	const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
	const d = g(k, 100);
	return 100 / d === 1 ? String(k / d) : `${k / d}/${100 / d}`;
}

/**
 * Four elements of one period or of one group, in order (left to right, or top to bottom), on which a property is
 * strictly monotonic with steps of at least `gap`: the rows the lessons' rules decide without looking at the values.
 */
export function pickRow(
	rng: Rng,
	o: { prop: (e: El) => number | null; periods: number[]; groupsInPeriod: number[]; groups: number[]; periodsInGroup: (g: number) => number[]; gap: number },
): { mode: 'periodo' | 'gruppo'; which: number; els: El[] } {
	// the mode first, then draws within it until one works: periods fail more often, and would otherwise be rarer
	const mode = rng.next() < 0.5 ? 'periodo' : 'gruppo';
	for (let attempt = 0; attempt < 400; attempt++) {
		const which = mode === 'periodo' ? rng.pick(o.periods) : rng.pick(o.groups);
		const pool = (mode === 'periodo' ? o.groupsInPeriod.map((g) => at(which, g)) : o.periodsInGroup(which).map((p) => at(p, which))).filter((e): e is El => e !== undefined && o.prop(e) !== null);
		if (pool.length < 4) continue;
		const els = shuffle(rng, pool)
			.slice(0, 4)
			.sort((a, b) => (mode === 'periodo' ? a.group! - b.group! : a.period - b.period));
		const xs = els.map((e) => o.prop(e)!);
		const steps = xs.slice(1).map((x, i) => x - xs[i]);
		if (steps.every((d) => d >= o.gap) || steps.every((d) => d <= -o.gap)) return { mode, which, els };
	}
	return again();
}

/** Options that are the symbols of elements; the first is the right one. */
export const symOpts = (right: El, others: El[]): [ChoiceOption, ChoiceOption[]] => [
	{ latex: symTex(right.sym), values: [right.sym] },
	others.map((e) => ({ latex: symTex(e.sym), values: [e.sym] })),
];
