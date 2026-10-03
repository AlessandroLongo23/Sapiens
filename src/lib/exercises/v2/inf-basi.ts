/**
 * Shared helpers of the generators of the chapter "I sistemi di numerazione" (informatica, first year):
 * inf-sistemi-posizionali, inf-binario-decimale, inf-esadecimale, inf-aritmetica-binaria.
 *
 * Numbers are written as docs/lezioni/informatica/README.md says: the base as a subscript, binary digits grouped
 * by four from the right with a thin space, hexadecimal digits upright. In the exercises the upright digits are
 * `\mathrm{2F}` and not `\text{2F}`: the exercise page reads every top-level `\text{}` of a step as prose.
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export const t = (s: string) => `\\text{${s}}`;

/** Prose with inline `$…$` formulas as one LaTeX line: the prose in `\text{}`, the formulas as they are. */
export function tx(prose: string): string {
	return prose
		.split('$')
		.map((p, i) => (i % 2 === 0 ? (p ? `\\text{${p}}` : '') : p))
		.join('');
}

/** The digits of n in a base, upper case, padded with zeros on the left to `width`. */
export function toBase(n: number, base: number, width = 0): string {
	if (!Number.isInteger(n) || n < 0) throw new Error(`toBase: ${n}`);
	return n.toString(base).toUpperCase().padStart(width, '0');
}

/** Digits in groups of `size` from the right, separated by a thin space. */
export function grouped(digits: string, size: number): string {
	const out: string[] = [];
	for (let end = digits.length; end > 0; end -= size) out.unshift(digits.slice(Math.max(0, end - size), end));
	return out.join('\\,');
}

/** The digits as the lessons write them, without the base: binary in fours, letters upright. */
export function digitsTex(digits: string, base: number): string {
	if (base === 2) return digits.length > 4 ? grouped(digits, 4) : digits;
	return /[A-F]/.test(digits) ? `\\mathrm{${digits}}` : digits;
}

export const sub = (base: number) => (base > 9 ? `_{${base}}` : `_${base}`);

/** A number with its base as a subscript: `1011\,0110_2`, `17_8`, `\mathrm{2F}_{16}`, `13_{10}`. */
export const numTex = (digits: string, base: number) => `${digitsTex(digits, base)}${sub(base)}`;

export const binTex = (n: number, width = 0) => numTex(toBase(n, 2, width), 2);
export const hexTex = (n: number, width = 0) => numTex(toBase(n, 16, width), 16);

/** One hexadecimal digit (or a decimal number) as a cell of a table. */
export const cell = (d: string) => (/[A-F]/.test(d) ? `\\mathrm{${d}}` : d);

/** A table as a LaTeX array; no `\text{}` inside, labels go in `\mathrm{}`. */
export function table(cols: string, rows: string[][], rulesAfter: number[] = [0]): string {
	const body = rows.map((r, i) => r.join(' & ') + (i < rows.length - 1 ? ` \\\\${rulesAfter.includes(i) ? ' \\hline' : ''} ` : '')).join('');
	return `\\begin{array}{${cols}} ${body} \\end{array}`;
}

/** The weights of the positions over the digits: `8 & 4 & 2 & 1` over `1 & 0 & 1 & 1`. */
export function weightsTable(digits: string, base: number): string {
	const n = digits.length;
	const weights = [...digits].map((_, i) => String(base ** (n - 1 - i)));
	return table('c'.repeat(n), [weights, [...digits].map(cell)]);
}

/** The successive divisions of n by the base: one row per division, `45 : 2 & 22 & 1`. */
export function divisions(n: number, base: number): { n: number; q: number; r: number }[] {
	const rows = [];
	let cur = n;
	do {
		rows.push({ n: cur, q: Math.floor(cur / base), r: cur % base });
		cur = Math.floor(cur / base);
	} while (cur > 0);
	return rows;
}

export function divisionTable(n: number, base: number): string {
	const rows = divisions(n, base).map(({ n: m, q, r }) => [`${m} : ${base}`, String(q), base > 10 && r > 9 ? `${r} = \\mathrm{${toBase(r, base)}}` : String(r)]);
	return table('r|c|c', [['\\mathrm{divisione}', '\\mathrm{quoziente}', '\\mathrm{resto}'], ...rows]);
}

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

export type Opt = ChoiceOption | null | undefined;

/**
 * Four options, the right one and the first distinct distractors, shuffled. Two options are the same when their
 * values or their text are the same; `same` adds a rule of its own (two binary strings with the same value).
 */
export function choose(rng: Rng, right: ChoiceOption, others: Opt[], same?: (a: ChoiceOption, b: ChoiceOption) => boolean): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const opts = [right];
	for (const o of others) {
		if (opts.length >= 4) break;
		if (!o) continue;
		if (opts.some((p) => key(p) === key(o) || p.latex === o.latex || (same?.(p, o) ?? false))) continue;
		opts.push(o);
	}
	if (opts.length < 4) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** A natural number as an option. */
export const numOpt = (n: number | null | undefined): Opt => (n == null || !Number.isInteger(n) || n < 0 ? null : { latex: String(n), values: [String(n)] });

/** A number in a base as an option; the value is its digits. */
export const baseOpt = (digits: string | null | undefined, base: number): Opt => (digits ? { latex: numTex(digits, base), values: [digits] } : null);

/** A natural number in a base as an option, without leading zeros. */
export const valueOpt = (n: number | null | undefined, base: number): Opt => (n == null || !Number.isInteger(n) || n < 0 ? null : baseOpt(toBase(n, base), base));

/** Numbers around v, for filling a choice when the mistakes are not enough. */
export function near(rng: Rng, v: number): number[] {
	const out = shuffle(rng, [1, -1, 2, -2, 3, 10, -10, 4, -3, 5]).map((d) => v + d);
	return out.filter((x) => x >= 0);
}

/** Same numeric value in a base: two strings that differ only by leading zeros. */
export const sameValue = (base: number) => (a: ChoiceOption, b: ChoiceOption) => parseInt(a.values[0], base) === parseInt(b.values[0], base);

/** What every sample's choice must satisfy; `key` is the values of the right option joined by `|`. */
export function choiceViolations(ch: ChoiceAnswer | undefined, key: string): string[] {
	if (!ch) return [];
	const v: string[] = [];
	const keys = ch.options.map((o) => o.values.join('|'));
	if (keys.length !== 4 || new Set(keys).size !== 4 || new Set(ch.options.map((o) => o.latex)).size !== 4) v.push('servono 4 opzioni distinte');
	if (keys[ch.correct] !== key || keys.filter((k) => k === key).length !== 1) v.push('opzione corretta sbagliata');
	return v;
}

export const BANNED = /—|piuttosto che/;
