/**
 * Shared pieces of the generators of the first computer science chapter, "Informatica e informazione"
 * (inf-informazione-dati, hardware-software, inf-bit-byte).
 *
 * Numbers as the lessons write them (docs/lezioni/informatica/README.md): decimal comma {,}, thousands with \, from
 * five digits in the integer part, units upright after a thin space (3{,}5\,\text{MB}, 100\,\text{Mbit/s}). Text
 * options are wrapped at 24 characters, the width of an answer button on a phone.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';
import { Rational, q } from './rational';
import { shuffle } from './insiemi';

export const BANNED = /—|piuttosto che/;

export const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'] as const;

export const t = (s: string) => `\\text{${s}}`;

/** A terminating decimal in LaTeX: 3{,}5, 4096, 65\,536, 0{,}25. */
export function dec(r: Rational): string {
	let k = 0;
	let scaled = r.abs();
	while (!scaled.isInteger()) {
		scaled = scaled.mul(q(10));
		k++;
		if (k > 12) throw new Error(`dec: ${r} is not a terminating decimal`);
	}
	const digits = String(scaled.num).padStart(k + 1, '0');
	let int = digits.slice(0, digits.length - k);
	const frac = digits.slice(digits.length - k);
	if (int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return (r.sign() < 0 ? '-' : '') + (frac ? `${int}{,}${frac}` : int);
}

/** An integer in LaTeX: 4096, 65\,536. */
export const int = (n: number) => dec(q(n));

/** A number with its unit: 3{,}5\,\text{MB}. */
export const withUnit = (num: string, u: string) => `${num}\\,\\text{${u}}`;
/** The same in prose, between dollars. */
export const pw = (num: string, u: string) => `$${withUnit(num, u)}$`;

/** Plain text as an option label: one \text line, or a gathered of lines of at most `width` characters. */
export function wrapText(label: string, width = 24): string {
	if (label.length <= width) return t(label);
	const out: string[] = [];
	for (const w of label.split(' ')) {
		const last = out.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) out[out.length - 1] = `${last} ${w}`;
		else out.push(w);
	}
	return `\\begin{gathered} ${out.map(t).join(' \\\\ ')} \\end{gathered}`;
}

/** A text option; `value` identifies it for the checker (the id of the piece it comes from). */
export const textOpt = (label: string, value = label): ChoiceOption => ({ latex: wrapText(label), values: [value] });

/** A number option, with its unit when there is one: 3500\,\text{kB}; the value is the exact rational. */
export const numOpt = (r: Rational, u?: string): ChoiceOption => ({ latex: u ? withUnit(dec(r), u) : dec(r), values: [r.toString()] });

/**
 * A multiple choice: the right option, then the others in order of preference; the first three that differ from
 * every option before them (by values and by writing) are kept, then all four are shuffled.
 */
export function choose(rng: Rng, right: ChoiceOption, others: readonly (ChoiceOption | null)[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const seen = new Set([key(right)]);
	const latexSeen = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (!o || seen.has(key(o)) || latexSeen.has(o.latex)) continue;
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

/** Checks every generator of the chapter shares: steps, banned words, four distinct options. */
export function checkChoice(ch: ChoiceAnswer | undefined, v: string[]): void {
	if (!ch) return;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
}
