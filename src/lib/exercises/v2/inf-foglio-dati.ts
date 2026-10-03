/**
 * Shared helpers of the generators of the second half of the spreadsheet chapter (computer science, first year):
 * inf-funzioni-logiche, inf-grafici-dati, inf-analisi-dati. Conventions: docs/lezioni/informatica/README.md.
 *
 * A problem is a stack of lines: Italian prose in `\text{…}` (inline `$…$` allowed), a sheet as an `array` with the
 * column letters in the first row and the row numbers in the first column, a formula in `\small\texttt{…}`. Formulas
 * are never maths: they are typewriter text, with the Italian function names, `;` between arguments.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export const BANNED = /—|piuttosto che/;

export const NAMES = ['Anna', 'Luca', 'Sara', 'Marco', 'Giulia', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Pietro', 'Irene', 'Matteo', 'Marta', 'Simone', 'Nadia', 'Omar'] as const;

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

export const pickDistinct = <T>(rng: Rng, pool: readonly T[], k: number): T[] => {
	if (k > pool.length) throw new Error(`pickDistinct: ${k} > ${pool.length}`);
	return shuffle(rng, pool).slice(0, k);
};

// ---------------------------------------------------------------------------
// Text

export const t = (s: string): string => `\\text{${s}}`;

/** Typewriter text for KaTeX: the characters TeX reads as commands are escaped. */
export function ttRaw(s: string): string {
	return `\\texttt{${s.replace(/[\\{}$%&#_^~]/g, (c) => (c === '\\' ? '\\textbackslash{}' : c === '^' || c === '~' ? `\\${c}{}` : `\\${c}`))}}`;
}

/** A cell reference or a short formula inside prose: `$\texttt{B2}$`. */
export const ttIn = (s: string): string => `$${ttRaw(s)}$`;

/** A formula on its own line, or as an option: a size smaller, so 33 characters fit a phone (27 in an option). */
export const ttLine = (s: string): string => `\\small${ttRaw(s)}`;

/** Visible length of a piece of prose: a LaTeX command counts as one character. */
const visible = (s: string): number => s.replace(/\\[a-zA-Z]+\s?/g, 'x').replace(/[${}]/g, '').length;

/** Italian prose as `\text{…}` lines of about `width` visible characters; inline `$…$` is never split. */
export function prose(text: string, width = 46): string[] {
	if (/[%&#_]/.test(text.replace(/\$[^$]*\$/g, ''))) throw new Error(`prose: special character in "${text}"`);
	const words = text.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out.map(t);
}

/** Raw LaTeX line of a block (a sheet, a formula), as opposed to prose. */
export interface Raw {
	raw: string;
}
export const raw = (s: string): Raw => ({ raw: s });

/** Prose and raw lines stacked and left-aligned. */
export function block(parts: (string | Raw)[]): string {
	const ls = parts.flatMap((p) => (typeof p === 'string' ? prose(p) : [p.raw]));
	return ls.length === 1 ? ls[0] : `\\begin{array}{l} ${ls.join(' \\\\ ')} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Sheets

export type Cell = number | string;

export const COLS = ['A', 'B', 'C', 'D', 'E'] as const;

const cellTex = (c: Cell): string => (typeof c === 'number' ? String(c) : t(c));

/**
 * A sheet: the row of column letters, then `header` in row 1 and `rows` from row 2. Text columns are left-aligned,
 * number columns centred.
 */
export function sheet(header: string[], rows: Cell[][]): Raw {
	const align = header.map((_, j) => (typeof rows[0][j] === 'number' ? 'c' : 'l'));
	const letters = `& ${header.map((_, j) => t(COLS[j])).join(' & ')}`;
	const body = [header, ...rows].map((r, i) => `${i + 1} & ${r.map(cellTex).join(' & ')}`);
	return raw(`\\begin{array}{c|${align.join('|')}} ${letters} \\\\ \\hline ${body.join(' \\\\ ')} \\end{array}`);
}

// ---------------------------------------------------------------------------
// Options

export const textOpt = (label: string, value = label): ChoiceOption => ({ latex: t(label), values: [value] });
export const numOpt = (n: number): ChoiceOption => ({ latex: String(n), values: [String(n)] });
export const formulaOpt = (f: string): ChoiceOption => ({ latex: ttLine(f), values: [f] });

/** A long text option on more lines of at most `width` characters (an answer button on a phone is 252 px wide). */
export function wrapOpt(label: string, value = label, width = 24): ChoiceOption {
	if (label.length <= width) return textOpt(label, value);
	const ls: string[] = [];
	for (const w of label.split(' ')) {
		const last = ls.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) ls[ls.length - 1] = `${last} ${w}`;
		else ls.push(w);
	}
	return { latex: `\\begin{gathered} ${ls.map(t).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

/**
 * A multiple choice: the right option, then the others in order of preference; the first ones whose values differ
 * from every option before them are kept up to `count`, then all are shuffled.
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

/** Number options: the right value, the mistakes in order, then the nearest non-negative integers. */
export function numberChoice(rng: Rng, value: number, mistakes: number[]): ChoiceAnswer {
	const cands = mistakes.filter((n) => Number.isInteger(n) && n >= 0);
	for (let d = 1; d < 30; d++) {
		cands.push(value + d);
		if (value - d >= 0) cands.push(value - d);
	}
	return choose(rng, numOpt(value), cands.map(numOpt));
}

/** The checks every sample of these generators must pass. */
export function commonViolations(problem: string, steps: string[], solution: string, choice: ChoiceAnswer | undefined): string[] {
	const v: string[] = [];
	if (!steps.length) v.push('nessun passaggio');
	if (BANNED.test(problem + steps.join(' ') + solution)) v.push('parole vietate');
	// a number answer gets its choice from toChoice(), after generate(): nothing to check until then
	if (!choice) return v;
	if (choice.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(choice.options.map((o) => o.values.join('|'))).size !== choice.options.length) v.push('opzioni ripetute');
	if (!(choice.correct >= 0 && choice.correct < choice.options.length)) v.push('opzione giusta fuori dai limiti');
	return v;
}
