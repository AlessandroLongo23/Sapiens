/**
 * What the three generators of the chemistry chapter on the nucleus share (chemistry, third year, group C:
 * chim-radioattivita, chim-tempo-dimezzamento, chim-fissione-fusione).
 *
 * Notation of the lessons 54-56 (docs/lezioni/chimica/riscritte/): a nuclide is {}^{238}_{\ 92}\mathrm{U}, with the
 * atomic number padded under the mass number; the particles are {}^{4}_{2}\mathrm{He}, {}^{\ 0}_{-1}e, {}^{\ 0}_{+1}e,
 * {}^{1}_{0}n and \gamma; decimal comma, a \cdot 10^{n}, units upright after a thin space. Element symbols and names
 * are those of src/lib/tools/elementi.json, the site's periodic table, up to curium.
 *
 * A level's answer is a multiple choice with four options; where the answer is a pure number a level may also give
 * it as a number (`open`), and the multiple choice then travels as the sample's `choice`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { BANNED } from './fis-grandezze';

export { textBlock } from './insiemi';
export { sig } from './fis-calore';
export { choose, decTex, texOpt, textOpt, tx } from './chim-atomo';

export const SYMBOLS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm'.split(' ');
export const NAMES =
	'idrogeno elio litio berillio boro carbonio azoto ossigeno fluoro neon sodio magnesio alluminio silicio fosforo zolfo cloro argon potassio calcio scandio titanio vanadio cromo manganese ferro cobalto nichel rame zinco gallio germanio arsenico selenio bromo kripton rubidio stronzio ittrio zirconio niobio molibdeno tecnezio rutenio rodio palladio argento cadmio indio stagno antimonio tellurio iodio xeno cesio bario lantanio cerio praseodimio neodimio promezio samario europio gadolinio terbio disprosio olmio erbio tulio itterbio lutezio afnio tantalio tungsteno renio osmio iridio platino oro mercurio tallio piombo bismuto polonio astato radon francio radio attinio torio protoattinio uranio nettunio plutonio americio curio'.split(
		' ',
	);

export const sym = (Z: number) => SYMBOLS[Z - 1];
/** "radio-226". */
export const isoName = (Z: number, A: number) => `${NAMES[Z - 1]}-${A}`;

/** The two indices of a nuclide or a particle, the lower one padded to the width of the upper one. */
function indices(top: string, bottom: string) {
	const pad = Math.max(0, top.replace('\\mathrm{m}', 'm').length - bottom.length);
	return `{}^{${top}}_{${'\\ '.repeat(pad)}${bottom}}`;
}

/** {}^{238}_{\ 92}\mathrm{U}; with `m`, the excited nucleus {}^{99\mathrm{m}}_{\ 43}\mathrm{Tc}. */
export const nuc = (Z: number, A: number, m = false) => `${indices(m ? `${A}\\mathrm{m}` : String(A), String(Z))}\\mathrm{${sym(Z)}}`;
/** The nuclide without its atomic number: {}^{14}\mathrm{C}. */
export const nucA = (Z: number, A: number) => `{}^{${A}}\\mathrm{${sym(Z)}}`;

export const ALPHA = '{}^{4}_{2}\\mathrm{He}';
export const ELECTRON = '{}^{\\ 0}_{-1}e';
export const POSITRON = '{}^{\\ 0}_{+1}e';
export const NEUTRON = '{}^{1}_{0}n';

export type Decay = 'alfa' | 'beta-' | 'beta+' | 'cattura' | 'gamma';
/** How a decay changes Z and A. */
export const SHIFT: Record<Decay, { dZ: number; dA: number }> = {
	alfa: { dZ: -2, dA: -4 },
	'beta-': { dZ: 1, dA: 0 },
	'beta+': { dZ: -1, dA: 0 },
	cattura: { dZ: -1, dA: 0 },
	gamma: { dZ: 0, dA: 0 },
};

/** A nuclide as an option: its symbol with A and Z, and "A/Z" for the checker. */
export const nucOpt = (Z: number, A: number): ChoiceOption => ({ latex: nuc(Z, A), values: [`${A}/${Z}`] });
/** A bare integer as an option. */
export const intOpt = (x: number): ChoiceOption => ({ latex: String(x), values: [String(x)] });
/** Keeps the candidates that are there (a rounding refused, a nuclide outside the table). */
export const some = <T,>(xs: (T | null | undefined)[]) => xs.filter((x): x is T => x !== null && x !== undefined);

/** A plain number that ends with a zero nobody can tell is significant (40, 1200): the generators redraw. */
export const ambiguousZero = (value: string) => /^\d*0$/.test(value);

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
