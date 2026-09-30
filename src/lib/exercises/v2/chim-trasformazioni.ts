/**
 * What the four generators of the chemistry chapter "Dalle trasformazioni chimiche alla teoria atomica" share (first
 * year, group 25: chim-legge-proporzioni-multiple, chim-teoria-atomica-dalton, chim-atomi-molecole-ioni,
 * chim-formula-chimica): formulas written as the lessons write them (\mathrm{Al_2(SO_4)_3}, ions with the charge up,
 * hydrates with \cdot), a formula read back into its atoms, options that are words (on two lines when too wide for a
 * phone), numbers or ratios, and the common checks.
 *
 * Formulas travel as plain strings in the lessons' order of symbols: "Al2(SO4)3", "CuSO4.5H2O", ions as "SO4^2-".
 * Atomic masses from the table of lesson 01 (docs/lezioni/chimica/riscritte/01-mole-massa-molare.md).
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from './types';
import { choiceOf } from './vettori';
import { BANNED } from './fis-grandezze';

export { type Built, generateWith } from './fisica-equilibrio';
export { textBlock, shuffle } from './insiemi';
export { BANNED };

export const MASS: Record<string, number> = { H: 1.01, C: 12.01, N: 14.01, O: 16.0, Na: 22.99, Mg: 24.31, P: 30.97, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08, Fe: 55.85 };

export const t = (s: string) => `\\text{${s}}`;

/** "Al2(SO4)3" → Al_2(SO_4)_3; "CuSO4.5H2O" → CuSO_4 \cdot 5H_2O; "SO4^2-" → SO_4^{2-}. Without \mathrm. */
export function formulaBody(f: string): string {
	const [main, charge] = f.split('^');
	const parts = main.split('.').map((p, i) => {
		const m = i ? /^(\d*)(.*)$/.exec(p)! : ['', '', p];
		const body = m[2].replace(/([A-Za-z)])(\d+)/g, (_, a, n) => `${a}_${n.length > 1 ? `{${n}}` : n}`);
		return (m[1] ?? '') + body;
	});
	let out = parts.join(' \\cdot ');
	if (charge) out += `^{${charge}}`;
	return out;
}
/** A formula in LaTeX: \mathrm{H_2SO_4}. */
export const fx = (f: string) => `\\mathrm{${formulaBody(f)}}`;
/** The same inside prose. */
export const pf = (f: string) => `$${fx(f)}$`;
/** A coefficient and a formula: 3\,\mathrm{H_2O}. */
export const cfx = (k: number, f: string) => (k === 1 ? fx(f) : `${k}\\,${fx(f)}`);

/** The atoms of a formula (no charge, no coefficient in front): "Ca(OH)2" → {Ca: 1, O: 2, H: 2}. */
export function atomsOf(f: string): Record<string, number> {
	const out: Record<string, number> = {};
	const add = (el: string, n: number) => (out[el] = (out[el] ?? 0) + n);
	for (const [i, part] of f.split('^')[0].split('.').entries()) {
		const m = /^(\d*)(.*)$/.exec(part)!;
		const k = i && m[1] ? Number(m[1]) : 1;
		const body = i ? m[2] : part;
		const stack: Record<string, number>[] = [{}];
		const re = /([A-Z][a-z]?|\(|\))(\d*)/g;
		let r: RegExpExecArray | null;
		while ((r = re.exec(body))) {
			const n = r[2] ? Number(r[2]) : 1;
			if (r[1] === '(') stack.push({});
			else if (r[1] === ')') {
				const inner = stack.pop()!;
				for (const [e, c] of Object.entries(inner)) stack[stack.length - 1][e] = (stack[stack.length - 1][e] ?? 0) + c * n;
			} else stack[stack.length - 1][r[1]] = (stack[stack.length - 1][r[1]] ?? 0) + n;
		}
		for (const [e, c] of Object.entries(stack[0])) add(e, c * k);
	}
	return out;
}
export const totalAtoms = (f: string) => Object.values(atomsOf(f)).reduce((s, n) => s + n, 0);

/** Italian names of the elements, with the article for "atomi di …". */
export const NAME: Record<string, string> = {
	H: 'idrogeno', C: 'carbonio', N: 'azoto', O: 'ossigeno', F: 'fluoro', Na: 'sodio', Mg: 'magnesio', Al: 'alluminio', P: 'fosforo', S: 'zolfo', Cl: 'cloro', K: 'potassio', Ca: 'calcio', Fe: 'ferro', Cu: 'rame', Zn: 'zinco', Ba: 'bario', Br: 'bromo', I: 'iodio', Co: 'cobalto', He: 'elio', Ne: 'neon', Ar: 'argon',
};

// ---------------------------------------------------------------------------
// Options

/** An option that is a whole number. */
export const intOpt = (n: number): ChoiceOption => ({ latex: String(n), values: [String(n)] });

/** An option that is words: one \\text line, or lines of a gathered of at most `width` characters each. */
export function textOpt(label: string, value = label, width = 26): ChoiceOption {
	const len = (x: string) => x.replace(/\$[^$]*\$/g, 'xxx').length;
	if (len(label) <= width) return { latex: t(label), values: [value] };
	const words = label.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	// as many lines as needed, then balanced: each line close to the total over the lines
	const n = Math.ceil(len(label) / width);
	const target = len(label) / n;
	const lines: string[] = [];
	let cur = '';
	for (const w of words) {
		const next = cur ? `${cur} ${w}` : w;
		if (cur && (len(next) > width || (lines.length < n - 1 && len(cur) >= target))) {
			lines.push(cur);
			cur = w;
		} else cur = next;
	}
	lines.push(cur);
	return { latex: `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

/** An option that is a formula. */
export const formulaOpt = (f: string): ChoiceOption => ({ latex: fx(f), values: [f] });

/** An option that is a ratio a : b. */
export const ratioOpt = (a: number, b: number): ChoiceOption => ({ latex: `${a} : ${b}`, values: [`${a}:${b}`] });

/** Four options, the right one first before shuffling; throws when there are not enough distinct ones. */
export function choose(rng: Rng, right: ChoiceOption, mistakes: ChoiceOption[], fallback: ChoiceOption[] = []): ChoiceAnswer {
	const seen = new Set([right.values[0]]);
	const ms = [...mistakes, ...fallback].filter((o) => (seen.has(o.values[0]) ? false : (seen.add(o.values[0]), true)));
	return choiceOf(rng, right, ms);
}

/** The common checks: steps, banned words, four options different in writing and in value, a valid index. */
export function checkCommon(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => o.values.join('|'))).size !== 4) v.push('due opzioni con lo stesso valore');
	if (!(a.correct >= 0 && a.correct < a.options.length)) v.push("indice dell'opzione giusta fuori dai limiti");
	return v;
}

/** Greatest common divisor. */
export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Decimal comma for LaTeX: "1.33" → 1{,}33. */
export const dc = (s: string) => s.replace('.', '{,}');

/** x with n significant figures, as a string with a point ("4.00", "0.996", "15.8"). */
export function sig(x: number, n: number): string {
	const e = Math.floor(Math.log10(Math.abs(x)));
	const d = Math.max(0, n - 1 - e);
	return x.toFixed(d);
}

/** Is x within `eps` (relative) of a tie when rounded to n significant figures? */
export function nearTie(x: number, n: number, eps = 1e-6): boolean {
	const e = Math.floor(Math.log10(Math.abs(x)));
	const y = x / 10 ** (e - n + 1);
	return Math.abs(y - Math.floor(y) - 0.5) < eps * 10 ** n;
}
