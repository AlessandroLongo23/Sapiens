/**
 * What the five generators of the chemistry chapter on the atom share (chemistry, second year, group 28:
 * chim-natura-elettrica, particelle-fondamentali, chim-thomson-rutherford, numero-massa, chim-tavola-mendeleev).
 *
 * Numbers as the lessons 39-43 write them (docs/lezioni/chimica/riscritte/): decimal comma, scientific notation
 * a \cdot 10^{n}, units upright after a thin space (\,\text{C}, \,\text{nC}, \,\text{u}), chemical symbols in
 * \mathrm. Every answer is a multiple choice with four options; text options longer than a phone button are split on
 * more lines with \begin{gathered}. Constants of the lessons: e = 1,60 · 10⁻¹⁹ C; masses of the particles in u
 * 0,000549, 1,007, 1,009.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { shuffle } from './insiemi';
import { BANNED } from './fis-grandezze';

export { textBlock } from './insiemi';
export { sig } from './fis-calore';
export { type Built, generateWith } from './fisica-equilibrio';

export const E_CHARGE = 1.6e-19;

export const t = (s: string) => `\\text{${s}}`;

/** A text option: its label, split on lines of at most `width` characters when longer (the answer button is 252 px). */
export function textOpt(label: string, value = label, width = 24): ChoiceOption {
	if (label.length <= width || label.includes('$')) return { latex: label.includes('$') ? tx(label) : t(label), values: [value] };
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return { latex: `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

/** Prose with inline $…$ as one LaTeX line: \text{…} around the words, the formulas as they are. */
export function tx(prose: string): string {
	return prose
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`))
		.join('');
}

/** An option that is a formula or a number already in LaTeX, with the value the checker reads. */
export const texOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });

/**
 * A multiple choice: the right option, then the others in order of preference; the first three whose value and
 * LaTeX differ from every option before them are kept, then all four are shuffled.
 */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[]): ChoiceAnswer {
	const seenV = new Set([right.values.join('|')]);
	const seenL = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= 4) break;
		const k = o.values.join('|');
		if (seenV.has(k) || seenL.has(o.latex)) continue;
		seenV.add(k);
		seenL.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** The checks every sample of these generators passes: steps, banned words, four options with distinct values. */
export function checkChoice(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(a.options.map((o) => o.latex)).size !== a.options.length) v.push('due opzioni scritte uguali');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** A decimal string ("3.20", "-1.5") in LaTeX: 3{,}20, -1{,}5. */
export const decTex = (s: string) => s.replace('.', '{,}');

/** An integer multiple of 10^-k as a fixed decimal string: (1234, 2) → "12.34". */
export const fixed = (k: number, d: number) => (k / 10 ** d).toFixed(d);

/** The first 36 elements, by Z (lesson 43 draws the first four periods). */
export const ELEMENTS: { sym: string; nome: string }[] = [
	{ sym: 'H', nome: 'idrogeno' },
	{ sym: 'He', nome: 'elio' },
	{ sym: 'Li', nome: 'litio' },
	{ sym: 'Be', nome: 'berillio' },
	{ sym: 'B', nome: 'boro' },
	{ sym: 'C', nome: 'carbonio' },
	{ sym: 'N', nome: 'azoto' },
	{ sym: 'O', nome: 'ossigeno' },
	{ sym: 'F', nome: 'fluoro' },
	{ sym: 'Ne', nome: 'neon' },
	{ sym: 'Na', nome: 'sodio' },
	{ sym: 'Mg', nome: 'magnesio' },
	{ sym: 'Al', nome: 'alluminio' },
	{ sym: 'Si', nome: 'silicio' },
	{ sym: 'P', nome: 'fosforo' },
	{ sym: 'S', nome: 'zolfo' },
	{ sym: 'Cl', nome: 'cloro' },
	{ sym: 'Ar', nome: 'argon' },
	{ sym: 'K', nome: 'potassio' },
	{ sym: 'Ca', nome: 'calcio' },
	{ sym: 'Sc', nome: 'scandio' },
	{ sym: 'Ti', nome: 'titanio' },
	{ sym: 'V', nome: 'vanadio' },
	{ sym: 'Cr', nome: 'cromo' },
	{ sym: 'Mn', nome: 'manganese' },
	{ sym: 'Fe', nome: 'ferro' },
	{ sym: 'Co', nome: 'cobalto' },
	{ sym: 'Ni', nome: 'nichel' },
	{ sym: 'Cu', nome: 'rame' },
	{ sym: 'Zn', nome: 'zinco' },
	{ sym: 'Ga', nome: 'gallio' },
	{ sym: 'Ge', nome: 'germanio' },
	{ sym: 'As', nome: 'arsenico' },
	{ sym: 'Se', nome: 'selenio' },
	{ sym: 'Br', nome: 'bromo' },
	{ sym: 'Kr', nome: 'kripton' },
];

/** The full symbol of a nuclide or an ion: {}^{23}_{11}\mathrm{Na}, {}^{24}_{12}\mathrm{Mg^{2+}}. */
export function nuclide(A: number, Z: number, charge = 0, showZ = true): string {
	const sym = ELEMENTS[Z - 1].sym;
	const q = charge === 0 ? '' : `^{${Math.abs(charge) === 1 ? '' : Math.abs(charge)}${charge > 0 ? '+' : '-'}}`;
	return `{}^{${A}}${showZ ? `_{${Z}}` : ''}\\mathrm{${sym}${q}}`;
}
