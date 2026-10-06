/**
 * What the three generators of group B of the third year of chemistry share (chim-configurazione-elettronica,
 * gruppi-periodi, chim-simboli-lewis): the elements with the data of the periodic table of the site
 * (src/lib/tools/elementi.json), configurations as lists of sublevels in the order they fill, their LaTeX as the
 * lessons 53, 57 and 58 write it ($1s^2\,2s^2\,2p^6$, $[\text{Ne}]\,3s^1$), Italian articles, and the frame of a
 * sample: every answer is a multiple choice with four options, and where it is a pure number the sample's answer is
 * that number and the choice is kept in `params.choice`, which `toChoice` hands back, so the level can take an open
 * answer.
 */
import data from '../../tools/elementi.json';
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from './types';
import { BANNED } from './fis-grandezze';
import { shuffle } from './insiemi';

export { textBlock } from './insiemi';

// ---------------------------------------------------------------------------
// Elements and configurations

/** A sublevel with its electrons: ["3d", 6]. */
export type Sub = [string, number];

export interface El {
	z: number;
	sym: string;
	/** Lower case, as the lessons write it: "ferro", "kripton". */
	name: string;
	period: number;
	group: number | null;
	block: string;
	/** The real configuration after the noble gas, in the order the sublevels fill: [["4s", 2], ["3d", 6]]. */
	outer: Sub[];
	/** The noble gas in brackets, or null in the first period. */
	core: string | null;
}

/** Names the lessons write differently from the table of the site. */
const NAMES: Record<string, string> = { Kr: 'kripton' };

export const ELS: El[] = (data as { z: number; symbol: string; name: string; period: number; group: number | null; block: string; config: string }[]).map((e) => {
	const parts = e.config.split(' ');
	const core = /^\[(\w+)\]$/.exec(parts[0])?.[1] ?? null;
	const outer = (core ? parts.slice(1) : parts).map((p): Sub => [p.slice(0, 2), Number(p.slice(2))]);
	return { z: e.z, sym: e.symbol, name: NAMES[e.symbol] ?? e.name.toLowerCase(), period: e.period, group: e.group, block: e.block, outer, core };
});
export const EL: Record<string, El> = Object.fromEntries(ELS.map((e) => [e.sym, e]));
export const byZ = (z: number): El => ELS[z - 1];
export const at = (period: number, group: number): El | undefined => ELS.find((e) => e.period === period && e.group === group);

export const LETTERS = 'spdf';
/** How many electrons a sublevel holds: "3d" → 10. */
export const capacity = (name: string) => 2 * (2 * LETTERS.indexOf(name[1]) + 1);

/** The order the sublevels fill, by the rule of the diagonal: growing n + l, then growing n. */
export const ORDER: string[] = (() => {
	const all: [number, number][] = [];
	for (let n = 1; n <= 7; n++) for (let l = 0; l < Math.min(n, 4); l++) if (n + l <= 8) all.push([n, l]);
	return all.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[0] - b[0]).map(([n, l]) => `${n}${LETTERS[l]}`);
})();

/** The configuration the rule of the diagonal gives for a number of electrons, written in full. */
export function diagonal(electrons: number): Sub[] {
	const out: Sub[] = [];
	let left = electrons;
	for (const name of ORDER) {
		if (left <= 0) break;
		const k = Math.min(left, capacity(name));
		out.push([name, k]);
		left -= k;
	}
	return out;
}

/** The real configuration of an element written in full. */
export function full(el: El): Sub[] {
	return [...(el.core ? full(EL[el.core]) : []), ...el.outer];
}

export const NOBLE = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];

/**
 * A full configuration split into the noble gas that fits inside it and the rest. A configuration that is exactly a
 * noble gas's is written with the gas before ($[\text{Ne}]\,3s^2\,3p^6$), or as the gas itself with `whole`.
 */
export function abbreviate(subs: Sub[], whole = false): { core: string | null; outer: Sub[] } {
	let best: { core: string | null; outer: Sub[] } = { core: null, outer: subs };
	for (const g of NOBLE) {
		const c = full(EL[g]);
		if ((whole ? c.length <= subs.length : c.length < subs.length) && c.every(([n, k], i) => subs[i][0] === n && subs[i][1] === k)) best = { core: g, outer: subs.slice(c.length) };
	}
	return best;
}

const subTex = ([name, k]: Sub) => `${name}^${k > 9 ? `{${k}}` : k}`;
/** $1s^2\,2s^2\,2p^6$; with a noble gas, $[\text{Ne}]\,3s^1$. */
export const cfgTex = (subs: Sub[], core: string | null = null) => [...(core ? [`[\\text{${core}}]`] : []), ...subs.map(subTex)].join('\\,');
/** A long configuration on two lines, for a button of 252 px: broken after the fifth sublevel. */
export const cfgLines = (subs: Sub[]) => (subs.length <= 6 ? cfgTex(subs) : `\\begin{gathered} ${cfgTex(subs.slice(0, 5))} \\\\ ${cfgTex(subs.slice(5))} \\end{gathered}`);
/** What the checker reads of a configuration: the electrons of each sublevel, sorted by level: "1s2 2s2 2p3". */
export const cfgKey = (subs: Sub[]) =>
	subs
		.filter(([, k]) => k > 0)
		.map(([n, k]) => `${n}${k}`)
		.sort((a, b) => Number(a[0]) - Number(b[0]) || LETTERS.indexOf(a[1]) - LETTERS.indexOf(b[1]))
		.join(' ');
export const electrons = (subs: Sub[]) => subs.reduce((n, [, k]) => n + k, 0);

/** Unpaired electrons of a sublevel filled by Hund's rule. */
export function unpairedIn([name, k]: Sub) {
	const boxes = capacity(name) / 2;
	return k <= boxes ? k : 2 * boxes - k;
}

// ---------------------------------------------------------------------------
// Words

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "il sodio", "l'argon", "lo zolfo", "lo iodio", "lo xeno" */
export function art(name: string) {
	if (/^(io|z|x|s[^aeiou])/.test(name)) return `lo ${name}`;
	if (/^[aeiou]/.test(name)) return `l'${name}`;
	return `il ${name}`;
}
/** "del sodio", "dell'argon", "dello zolfo" */
export const di = (name: string) => art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'");

export const t = (s: string) => `\\text{${s}}`;
export const symTex = (sym: string) => `\\mathrm{${sym}}`;
/** \mathrm{Fe^{3+}}, \mathrm{Cl^-} */
export function ionTex(sym: string, q: number) {
	const n = Math.abs(q) === 1 ? '' : String(Math.abs(q));
	const s = `${n}${q > 0 ? '+' : '-'}`;
	return `\\mathrm{${sym}^${s.length > 1 ? `{${s}}` : s}}`;
}

// ---------------------------------------------------------------------------
// Options and samples

export const texOpt = (latex: string, value: string): ChoiceOption => ({ latex, values: [value] });
export const numOpt = (n: number): ChoiceOption => ({ latex: String(n), values: [String(n)] });
/** A text option, on lines of at most `width` characters. */
export function textOpt(label: string, value = label, width = 24): ChoiceOption {
	if (label.length <= width) return { latex: t(label), values: [value] };
	const lines: string[] = [];
	for (const w of label.split(' ')) {
		const last = lines.at(-1);
		if (last !== undefined && last.length + 1 + w.length <= width) lines[lines.length - 1] = `${last} ${w}`;
		else lines.push(w);
	}
	return { latex: `\\begin{gathered} ${lines.map(t).join(' \\\\ ')} \\end{gathered}`, values: [value] };
}

export const again = (): never => {
	throw new Error('redraw');
};

/**
 * A multiple choice: the right option, then the others in order of preference. The first three whose value and
 * LaTeX differ from every option before them are kept, then all four are shuffled. With fewer than four, it asks for
 * another draw.
 */
export function choose(rng: Rng, right: ChoiceOption, others: (ChoiceOption | null | undefined)[]): ChoiceAnswer {
	const seenV = new Set([right.values.join('|')]);
	const seenL = new Set([right.latex]);
	const opts = [right];
	for (const o of others) {
		if (opts.length >= 4) break;
		if (!o) continue;
		const k = o.values.join('|');
		if (seenV.has(k) || seenL.has(o.latex)) continue;
		seenV.add(k);
		seenL.add(o.latex);
		opts.push(o);
	}
	if (opts.length < 4) return again();
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** A choice among whole numbers: the right one, the mistakes in order of preference (those not positive are dropped), then its neighbours. */
export function chooseNumber(rng: Rng, right: number, mistakes: number[], min = 0): ChoiceAnswer {
	const pool = [...mistakes, right + 1, right - 1, right + 2, right - 2, right + 3].filter((x) => Number.isInteger(x) && x >= min);
	return choose(rng, numOpt(right), pool.map(numOpt));
}

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	/** A whole number as the answer: the level can then take an open answer. */
	number?: number;
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
	if (!/^\d+$/.test(a.value)) v.push('il numero deve essere un intero non negativo');
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
				answer: b.number === undefined ? b.answer : { kind: 'number', value: String(b.number) },
				params: b.number === undefined ? b.params : { ...b.params, choice: b.answer }
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
