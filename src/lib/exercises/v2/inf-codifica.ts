/**
 * Shared pieces of the generators of the chapter "La codifica dell'informazione" (first year of computer science):
 * inf-interi-segno, inf-virgola-mobile, inf-codifica-caratteri, inf-codifica-immagini, inf-codifica-suoni.
 *
 * Text as `\text{…}` lines a phone can wrap, numbers written as the lessons write them (decimal comma, thin space
 * every three digits from 10 000, bits in groups of four), exact rationals as "p/q" strings, a multiple choice
 * with four distinct options, and `defineGenerator`, which assembles a Generator from one maker per level.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';

export const BANNED = /—|piuttosto che/;
export const t = (s: string) => `\\text{${s}}`;

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** True with probability p. */
export const chance = (rng: Rng, p: number) => rng.next() < p;

/** About how many characters a line shows: inline formulas count without their commands and braces. */
const visible = (s: string) => s.replace(/\$([^$]*)\$/g, (_, m: string) => m.replace(/\\[a-zA-Z]+|[{}\\,]/g, '')).length;

/**
 * Italian prose as `\text{…}` lines of about `width` characters inside an array, so the page reads it as a paragraph
 * (src/lib/exercises/present.ts). Inline maths goes between dollars, inside the `\text{}`, and is never split across lines. Extra LaTeX
 * lines (a bit string, a formula) can follow.
 */
export function textBlock(prose: string, extra: string[] = [], width = 46): string {
	if (/[%&#_{}\\]/.test(prose.replace(/\$[^$]*\$/g, ''))) throw new Error(`textBlock: special character in "${prose}"`);
	const words = prose.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	const all = [...out.map((l) => `\\text{${l}}`), ...extra];
	return all.length === 1 ? all[0] : `\\begin{array}{l} ${all.join(' \\\\ ')} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Numbers

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** The exact rational p/q in lowest terms, as the string a NumberAnswer carries: "p" or "p/q". */
export function ratStr(p: number, q = 1): string {
	if (!Number.isSafeInteger(p) || !Number.isSafeInteger(q) || q === 0) throw new Error(`ratStr: ${p}/${q}`);
	if (q < 0) [p, q] = [-p, -q];
	const g = gcd(p, q) || 1;
	return q / g === 1 ? String(p / g) : `${p / g}/${q / g}`;
}

export function parseRat(s: string): [number, number] {
	const m = /^(-?\d+)(?:\/(\d+))?$/.exec(s);
	if (!m) throw new Error(`parseRat: ${s}`);
	return [Number(m[1]), m[2] ? Number(m[2]) : 1];
}

/** Digits in groups of three with a thin space, from 10 000 on. */
const group = (digits: string) => (digits.length >= 5 ? digits.replace(/\B(?=(\d{3})+$)/g, '\\,') : digits);

/** An integer as the lessons write it: 9600, 10\,000, -128. */
export function fmtInt(n: number): string {
	if (!Number.isSafeInteger(n)) throw new Error(`fmtInt: ${n}`);
	return (n < 0 ? '-' : '') + group(String(Math.abs(n)));
}

/** The terminating decimal p/q with the decimal comma: 2{,}25, -0{,}375, 44{,}1. Throws if it does not terminate within 8 digits. */
export function decTex(p: number, q = 1): string {
	const [a, b] = parseRat(ratStr(p, q));
	for (let d = 0, scale = 1; d <= 8; d++, scale *= 10) {
		if ((Math.abs(a) * scale) % b !== 0) continue;
		const digits = String((Math.abs(a) * scale) / b).padStart(d + 1, '0');
		const int = group(digits.slice(0, digits.length - d));
		return (a < 0 ? '-' : '') + int + (d ? `{,}${digits.slice(digits.length - d)}` : '');
	}
	throw new Error(`decTex: ${p}/${q} is not a short decimal`);
}

/** A number with its unit in upright type: 4\,\text{GB}. */
export const withUnit = (num: string, unit: string) => (unit ? `${num}\\,\\text{${unit}}` : num);

// ---------------------------------------------------------------------------
// Bits

/** The unsigned binary digits of n on `width` bits. */
export function bits(n: number, width: number): string {
	if (!Number.isInteger(n) || n < 0 || n >= 2 ** width) throw new Error(`bits: ${n} on ${width} bits`);
	return n.toString(2).padStart(width, '0');
}

/** Binary digits in groups of four from the right, with thin spaces: 1011\,0110. */
export const bitsTex = (s: string) => s.replace(/\B(?=(\d{4})+$)/g, '\\,');

// ---------------------------------------------------------------------------
// Options and choices

export const texOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });

/** A number as an option, with its unit if it has one; the value is the exact rational. */
export const numOpt = (p: number, q = 1, unit = ''): ChoiceOption => texOpt(withUnit(decTex(p, q), unit), ratStr(p, q));

/** A bit string as an option. */
export const bitOpt = (s: string): ChoiceOption => texOpt(bitsTex(s), s);

/** Words as an option, on lines of at most 24 characters (the answer button of a phone is 252 px wide). */
export function textOpt(label: string, value = label): ChoiceOption {
	const out: string[] = [];
	let cur = '';
	for (const w of label.split(' ')) {
		if (cur && cur.length + 1 + w.length > 24) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	const latex = out.length === 1 ? t(out[0]) : `\\begin{gathered} ${out.map(t).join(' \\\\ ')} \\end{gathered}`;
	return { latex, values: [value] };
}

/**
 * A multiple choice: the right option, then the wrong ones in order of preference. The first three that differ
 * (in value and in writing) from the options before them are kept, then the four are shuffled.
 */
export function choose(rng: Rng, right: ChoiceOption, others: ChoiceOption[], count = 4): ChoiceAnswer {
	const key = (o: ChoiceOption) => o.values.join('|');
	const keys = new Set([key(right)]);
	const texts = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= count) break;
		if (keys.has(key(o)) || texts.has(o.latex)) continue;
		keys.add(key(o));
		texts.add(o.latex);
		opts.push(o);
	}
	if (opts.length < count) throw new Error(`choose: only ${opts.length} distinct options`);
	const order = shuffle(rng, opts);
	return { kind: 'choice', options: order, correct: order.indexOf(right) };
}

// ---------------------------------------------------------------------------
// Assembly

/** What a level's maker returns. A number answer carries its wrong values (params.wrong, "p/q" strings) for the choice. */
export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	params: Record<string, unknown>;
}

/** A number answer p/q with at least three wrong values, the most likely mistakes first; `unit` goes on the options. */
export function numberBuilt(b: Omit<Built, 'answer' | 'solution'>, p: number, q: number, wrong: (number | [number, number])[], unit = ''): Built {
	const value = ratStr(p, q);
	const seen = new Set([value]);
	const list: string[] = [];
	for (const w of wrong) {
		const [a, c] = typeof w === 'number' ? [w, 1] : w;
		if (!Number.isFinite(a) || !Number.isSafeInteger(a) || !Number.isSafeInteger(c)) continue;
		const s = ratStr(a, c);
		if (seen.has(s)) continue;
		seen.add(s);
		list.push(s);
	}
	if (list.length < 3) throw new Error('numberBuilt: fewer than three wrong values');
	return {
		...b,
		solution: withUnit(decTex(p, q), unit),
		answer: { kind: 'number', value },
		params: { ...b.params, wrong: list.slice(0, 6), unit },
	};
}

export interface LevelDef {
	label: string;
	constraints: string[];
	make(rng: Rng): Built;
	/** Violations of the level's constraints, read from the sample's params. */
	check?(sample: Sample): string[];
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error('toChoice: unexpected answer');
	const unit = String(sample.params.unit ?? '');
	const [p, q] = parseRat(sample.answer.value);
	const wrong = (sample.params.wrong as string[]).map((w) => {
		const [a, b] = parseRat(w);
		return numOpt(a, b, unit);
	});
	return choose(rng, numOpt(p, q, unit), wrong);
}

export function defineGenerator(id: string, title: string, levels: Record<number, LevelDef>): Generator {
	const check = (sample: Sample): string[] => {
		const v: string[] = [];
		if (!sample.steps.length) v.push('nessun passaggio');
		if (!sample.solution) v.push('nessuna soluzione');
		if (BANNED.test(sample.prompt + sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
		const a = sample.answer;
		if (a.kind === 'choice') {
			if (a.options.length !== 4) v.push('servono quattro opzioni');
			if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni ripetute');
			if (!(a.correct >= 0 && a.correct < a.options.length)) v.push('opzione giusta fuori dai limiti');
		} else if (a.kind === 'number') {
			const wrong = sample.params.wrong;
			if (!Array.isArray(wrong) || wrong.length < 3) v.push('meno di tre risposte sbagliate');
			else if (wrong.includes(a.value) || new Set(wrong).size !== wrong.length) v.push('risposte sbagliate ripetute o uguali alla giusta');
		} else v.push('tipo di risposta non previsto');
		return [...v, ...(levels[sample.level]?.check?.(sample) ?? [])];
	};
	return {
		id,
		title,
		levels: Object.fromEntries(Object.entries(levels).map(([n, l]) => [n, { label: l.label, constraints: l.constraints }])),
		generate(rng: Rng, level: number): Sample {
			const def = levels[level];
			if (!def) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 300; attempt++) {
				let b: Built;
				try {
					b = def.make(rng);
				} catch (e) {
					// a draw without four distinct options: draw again
					if (/^(choose|numberBuilt):/.test((e as Error).message)) continue;
					throw e;
				}
				const sample: Sample = { generatorId: id, level, seed: rng.seed, ...b };
				if (check(sample).length === 0) return sample;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check,
		toChoice,
	};
}

/** A worked step: prose with inline `$…$` formulas as one LaTeX line, `\text{…}` around the words. */
export function tx(prose: string): string {
	return prose
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`))
		.join('');
}
