/**
 * What the four generators of chemistry group 29 share (lessons 44-47, la chimica dell'acqua: chim-acqua-molecola,
 * chim-acqua-proprieta, chim-acqua-solvente, chim-acqua-acidi-basi): options written as plain text (on two or three
 * lines when long, in a gathered block, as width.mts asks) or as quantities with their unit; a multiple choice built
 * from the right option and the mistakes; the generate() loop and the common checks. Values in the options are plain
 * strings the checkers read back: decimal numbers ("818", "0.0905", "1.7e5") or labels.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { shuffle, textBlock } from './insiemi';
import { decTex } from './vettori';
import { sig } from './fis-calore';

export { decTex, shuffle, sig, textBlock };

export const t = (s: string) => `\\text{${s}}`;
export const BANNED = /—|piuttosto che/;

/** Splits a label into lines of at most `width` characters (formulas $…$ count as their source), at spaces. */
export function wrap(label: string, width = 27): string[] {
	const words = label.match(/(?:\$[^$]*\$|[^\s$])+/g) ?? [];
	const visible = (w: string) => w.replace(/\$([^$]*)\$/g, (_, f: string) => f.replace(/\\mathrm\{([^}]*)\}/g, '$1').replace(/[{}^_\\]/g, '')).length;
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && visible(cur) + 1 + visible(w) > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return out;
}

/** A plain-text option (formulas inside $…$ allowed): one \text{} line, or a gathered block when the label is long. */
export function textOpt(label: string, value = label, width = 27): ChoiceOption {
	const lines = wrap(label, width);
	const latex = lines.length === 1 ? t(lines[0]) : `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`;
	return { latex, values: [value] };
}

/** A formula option (an equation): LaTeX as it is, the value a label for the checker. */
export const texOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });

/** Units as the lessons write them. */
export const UNIT: Record<string, string> = {
	C: '^\\circ\\text{C}',
	f: '^\\circ\\text{f}',
	g: '\\text{g}',
	mg: '\\text{mg}',
	kg: '\\text{kg}',
	mL: '\\text{mL}',
	L: '\\text{L}',
	cm3: '\\text{cm}^3',
	J: '\\text{J}',
	kJ: '\\text{kJ}',
	mol: '\\text{mol}',
	gmL: '\\text{g/mL}',
	gcm3: '\\text{g/cm}^3',
	mgL: '\\text{mg/L}',
	cJ: '\\text{J/(g}\\cdot{}^\\circ\\text{C)}',
};
/** A quantity: 818\,\text{mL}. */
export const q = (num: string, u: string) => `${decTex(num)}\\,${UNIT[u]}`;
/** The same inside prose. */
export const pq = (num: string, u: string) => `$${q(num, u)}$`;

/** The option (or the solution) of a rounded result from sig(): 1{,}18 \cdot 10^{3}\,\text{g}, value "1.18e3". */
export const rq = (r: { tex: string; value: string }, u: string) => `${r.tex}\\,${UNIT[u]}`;
export const rOpt = (r: { tex: string; value: string }, u: string): ChoiceOption => ({ latex: rq(r, u), values: [r.value] });

/** A quantity option: the value string is what the checker reads. */
export const qOpt = (value: string, u: string): ChoiceOption => ({ latex: q(value, u), values: [value] });

/** Options of rounded quantities from exact values; values refused by the rounding (near a tie, not positive) are skipped. */
export function sigOpts(xs: number[], n: number, u: string): ChoiceOption[] {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => ({ latex: `${r.tex}\\,${UNIT[u]}`, values: [r.value] }));
}

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

/** A decimal string with `d` decimals from an integer count of units (k = 35, d = 2 → "0.35"). */
export const dec = (k: number, d: number) => (k / 10 ** d).toFixed(d);

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** The common checks: steps, banned words, four options with distinct values and texts, the index in range. */
export function checkCommon(sample: Sample): string[] {
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
			const sample: Sample = { generatorId: id, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
	};
}

/** A rounded result whose last written digit is a zero of a whole number (120, 400) is ambiguous: refused. */
export const ambiguous = (r: { value: string } | null) => !r || /^\d*0$/.test(r.value);

/** Prose steps: each sentence a \text{} block, wrapped like the problem. */
export const say = (s: string) => textBlock(s);
