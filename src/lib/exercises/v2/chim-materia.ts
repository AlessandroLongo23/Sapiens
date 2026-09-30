/**
 * What the four generators of chemistry group 22 share (lessons 14-17: chim-stati-aggregazione,
 * chim-modello-particellare, chim-sostanze-miscugli, chim-soluzioni-percentuale): options written as plain text (on
 * two lines when long, in a gathered block, as width.mts asks), quantities with their unit, and a multiple choice
 * built from the right option and the mistakes. Values in the options are plain strings the checkers read back:
 * decimal numbers ("545", "1.7", "26.5") or labels.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { shuffle, textBlock } from './insiemi';
import { decTex } from './vettori';
import { sig } from './fis-calore';

export { decTex, shuffle, sig, textBlock };

export const t = (s: string) => `\\text{${s}}`;
export const BANNED = /—|piuttosto che/;

/** Splits a label into lines of at most `width` characters, at spaces. */
export function wrap(label: string, width = 27): string[] {
	const out: string[] = [];
	let cur = '';
	for (const w of label.split(' ')) {
		if (cur && cur.length + 1 + w.length > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out;
}

/** A plain-text option: one \text{} line, or a gathered block of lines when the label is long. */
export function textOpt(label: string, value = label, width = 27): ChoiceOption {
	const lines = wrap(label, width);
	const latex = lines.length === 1 ? t(lines[0]) : `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`;
	return { latex, values: [value], text: label };
}

/** Units as the lessons write them. */
export const UNIT: Record<string, string> = {
	C: '^\\circ\\text{C}',
	K: '\\text{K}',
	g: '\\text{g}',
	kg: '\\text{kg}',
	mL: '\\text{mL}',
	L: '\\text{L}',
	gmL: '\\text{g/mL}',
	gL: '\\text{g/L}',
	pct: '\\%',
};
/** A quantity: 545\,\text{mL}; the percentage without the thin space, 26{,}5\%. */
export const q = (num: string, u: string) => (u === 'pct' ? `${decTex(num)}\\%` : `${decTex(num)}\\,${UNIT[u]}`);
/** The same inside prose. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;
/** A signed whole number for LaTeX: -114 → -114 (KaTeX draws the minus). */
export const int = (n: number) => String(n);

/** A quantity option: the value string is what the checker reads. */
export const qOpt = (value: string, u: string): ChoiceOption => ({ latex: q(value, u), values: [value] });

/**
 * A multiple choice: the right option, then the others in order of preference; the first three whose value and text
 * differ from every option before them are kept, then all four are shuffled. Throws when fewer than four remain.
 */
export function choose(rng: Rng, right: ChoiceOption, others: (ChoiceOption | null)[]): ChoiceAnswer {
	const seen = new Set([right.values.join('|')]);
	const seenLatex = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (!o || opts.length >= 4) continue;
		const k = o.values.join('|');
		if (seen.has(k) || seenLatex.has(o.latex)) continue;
		seen.add(k);
		seenLatex.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error('choose: not enough distinct options');
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** Options of rounded quantities from exact values; values refused by the rounding (near a tie, not positive) are skipped. */
export function sigOpts(xs: number[], n: number, u: string): ChoiceOption[] {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => ({ latex: `${r.tex}${u === 'pct' ? '\\%' : `\\,${UNIT[u]}`}`, values: [r.value] }));
}

/** k distinct elements of xs, in random order. */
export function sample<T>(rng: Rng, xs: readonly T[], k: number): T[] {
	return shuffle(rng, xs).slice(0, k);
}

/** A table for a problem: an array with a header row and a rule under it. */
export function table(cols: string, head: string[], rows: string[][]): string {
	return `\\begin{array}{${cols}} ${head.join(' & ')} \\\\ \\hline ${rows.map((r) => r.join(' & ')).join(' \\\\ ')} \\end{array}`;
}
