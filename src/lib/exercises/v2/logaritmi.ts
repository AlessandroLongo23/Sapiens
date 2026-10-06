/**
 * Common pieces of the generators of the chapter "Esponenziali e logaritmi", lessons 124-127 (logaritmi-proprieta,
 * funzioni-logaritmiche, equazioni-logaritmiche, disequazioni-logaritmiche).
 *
 * - Writing: a logarithm as the lessons write it (\log for base 10, \log_2, \log_{\frac{1}{2}}), a binomial with
 *   the positive term first (5 - x), points with the comma.
 * - Values: a rational, or a logarithm with a rational added (\log_3 7 - 1), with the string the checker reads:
 *   "3/2", "log(7,3)-1" (SymPy's log(argument, base)).
 * - Sets of real numbers as unions of intervals whose ends are such values, with intersection, the writing of the
 *   lessons (S = \mathopen{]}2, 4\mathclose{[}) and the string of each interval: "(2;4)", "[-1;0)", "(-oo;oo)".
 *   The ends are separated by a semicolon, because a logarithm has a comma of its own.
 * - Multiple choice: the right option and the mistakes that give the wrong ones, each with its tag.
 *
 * The independent check of all this is scripts/exercises/checkers/_logaritmi.py.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, LevelSpec, NumberAnswer, Rng, Sample, SetAnswer } from './types';
import { Rational, q } from './rational';
import { polyToLatex } from './latex';
import { forbidden, shuffle } from './monomi';

// ---------------------------------------------------------------------------
// Numbers

/** base^n for an integer n, exact. */
export function rpow(base: Rational, n: number): Rational {
	let out = q(1);
	for (let i = 0; i < Math.abs(n); i++) out = out.mul(base);
	return n < 0 ? q(1).div(out) : out;
}

/** n with base^n = v for an integer n in [-12, 12], or null. */
export function intLog(base: Rational, v: Rational): number | null {
	for (let n = -12; n <= 12; n++) if (rpow(base, n).equals(v)) return n;
	return null;
}

export const float = (r: Rational) => r.num / r.den;
export const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};

// ---------------------------------------------------------------------------
// Writing

/** \log for base 10, \log_2, \log_{12}, \log_{\frac{1}{2}}. */
export function logHead(base: Rational): string {
	if (base.equals(q(10))) return '\\log';
	return base.isInteger() && base.num < 10 ? `\\log_${base.num}` : `\\log_{${base.toLatex()}}`;
}

/** \log_2 x, \log_3 \frac{1}{9}; with `paren` the argument goes in brackets: \log_2 (x + 1). */
export const logTex = (base: Rational, arg: string, paren = false) => `${logHead(base)} ${paren ? `(${arg})` : arg}`;

/** m x + n as the lessons write it: 2x + 1, x - 3, 5 - x (the positive term first), -2x. */
export function lin(m: number, n: number): string {
	if (m < 0 && n > 0) return `${n} - ${m === -1 ? '' : -m}x`;
	return polyToLatex([q(n), q(m)]);
}

/** a x^2 + b x + c by decreasing powers. */
export const quad = (a: number, b: number, c: number) => polyToLatex([q(c), q(b), q(a)]);

/** A point with the comma, as in the lessons: (2, -1), \left(\frac{1}{2}, 0\right). */
export function pointTex(x: Rational, y: Rational): string {
	const tall = !x.isInteger() || !y.isInteger();
	return tall ? `\\left(${x.toLatex()}, ${y.toLatex()}\\right)` : `(${x.toLatex()}, ${y.toLatex()})`;
}

/** A power a^n written out: 2^3, 10^{-2}, \left(\frac{1}{2}\right)^{-2}. */
export function powTex(base: Rational, n: number): string {
	const b = base.isInteger() ? `${base.num}` : `\\left(${base.toLatex()}\\right)`;
	return n >= 0 && n < 10 ? `${b}^${n}` : `${b}^{${n}}`;
}

export const text = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Values: p, or p + log_base(arg)

export interface Val {
	p: Rational;
	base?: Rational;
	arg?: Rational;
}

export const num = (r: Rational | number): Val => ({ p: typeof r === 'number' ? q(r) : r });
export const logVal = (base: Rational, arg: Rational, plus: Rational | number = 0): Val => ({ p: typeof plus === 'number' ? q(plus) : plus, base, arg });
export const isLog = (v: Val) => !!v.base;
export const valFloat = (v: Val) => float(v.p) + (v.base && v.arg ? Math.log(float(v.arg)) / Math.log(float(v.base)) : 0);

/** "3/2", "log(7,3)", "log(7,3)-1": what the checker reads. */
export function valStr(v: Val): string {
	if (!v.base || !v.arg) return v.p.toString();
	const head = `log(${v.arg.toString()},${v.base.toString()})`;
	return v.p.isZero() ? head : `${head}${v.p.sign() > 0 ? '+' : '-'}${v.p.abs().toString()}`;
}

/** \frac{3}{2}, \log_3 7, \log_3 7 - 1. */
export function valTex(v: Val): string {
	if (!v.base || !v.arg) return v.p.toLatex();
	const head = logTex(v.base, v.arg.toLatex());
	return v.p.isZero() ? head : `${head} ${v.p.sign() > 0 ? '+' : '-'} ${v.p.abs().toLatex()}`;
}

/** A set of solutions: S = \{-1, 3\}, S = \emptyset; with the string of each value, ascending. */
export function solutionSet(vals: Val[]): { values: string[]; latex: string; sorted: Val[] } {
	const sorted = [...vals].sort((a, b) => valFloat(a) - valFloat(b));
	const latex = sorted.length ? `S = \\left\\{${sorted.map(valTex).join(', ')}\\right\\}` : 'S = \\emptyset';
	return { values: sorted.map(valStr), latex, sorted };
}

// ---------------------------------------------------------------------------
// Intervals

/** An interval; null is -∞ at the left and +∞ at the right. */
export interface Iv {
	lo: Val | null;
	hi: Val | null;
	loC: boolean;
	hiC: boolean;
}

export type Op = '<' | '>' | '<=' | '>=';
export const OPS: Op[] = ['<', '>', '<=', '>='];
export const OP_TEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
export const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
export const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
export const large = (o: Op) => o === '<=' || o === '>=';
export const greater = (o: Op) => o === '>' || o === '>=';

export const ALL: Iv[] = [{ lo: null, hi: null, loC: false, hiC: false }];
export const above = (v: Val, closed = false): Iv[] => [{ lo: v, hi: null, loC: closed, hiC: false }];
export const below = (v: Val, closed = false): Iv[] => [{ lo: null, hi: v, loC: false, hiC: closed }];
export const between = (a: Val, b: Val, ca = false, cb = false): Iv[] => [{ lo: a, hi: b, loC: ca, hiC: cb }];
export const outside = (a: Val, b: Val, closed = false): Iv[] => [...below(a, closed), ...above(b, closed)];
/** x op v. */
export const ray = (op: Op, v: Val): Iv[] => (greater(op) ? above(v, large(op)) : below(v, large(op)));

const EPS = 1e-9;
const lower = (iv: Iv) => (iv.lo ? valFloat(iv.lo) : -Infinity);
const upper = (iv: Iv) => (iv.hi ? valFloat(iv.hi) : Infinity);

/** The common part of two unions of intervals, each sorted and disjoint. */
export function intersect(A: Iv[], B: Iv[]): Iv[] {
	const out: Iv[] = [];
	for (const a of A) {
		for (const b of B) {
			const la = lower(a);
			const lb = lower(b);
			const ua = upper(a);
			const ub = upper(b);
			// the larger lower end, open if either interval is open there
			const lo = Math.abs(la - lb) < EPS ? { v: a.lo, c: a.loC && b.loC } : la > lb ? { v: a.lo, c: a.loC } : { v: b.lo, c: b.loC };
			const hi = Math.abs(ua - ub) < EPS ? { v: a.hi, c: a.hiC && b.hiC } : ua < ub ? { v: a.hi, c: a.hiC } : { v: b.hi, c: b.hiC };
			const l = lo.v ? valFloat(lo.v) : -Infinity;
			const u = hi.v ? valFloat(hi.v) : Infinity;
			if (l > u + EPS) continue;
			if (Math.abs(l - u) < EPS && !(lo.c && hi.c)) continue;
			out.push({ lo: lo.v, hi: hi.v, loC: lo.c, hiC: hi.c });
		}
	}
	return out.sort((u, v) => lower(u) - lower(v));
}

const end = (v: Val | null, inf: string) => (v ? valStr(v) : inf);
/** "(-oo;-3)", "[1;oo)", "(log(7,3)-1;oo)". */
export const ivStr = (iv: Iv) => `${iv.loC ? '[' : '('}${end(iv.lo, '-oo')};${end(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
export const ivsKey = (ivs: Iv[]) => ivs.map(ivStr).join('|');
export const isAll = (ivs: Iv[]) => ivs.length === 1 && !ivs[0].lo && !ivs[0].hi;

const plain = (v: Val | null) => !v || (!v.base && v.p.isInteger());

/** One interval with the brackets of the lessons; \left] \right[ around fractions and logarithms. */
export function ivTex(iv: Iv): string {
	const lo = iv.lo ? valTex(iv.lo) : '-\\infty';
	const hi = iv.hi ? valTex(iv.hi) : '+\\infty';
	if (!plain(iv.lo) || !plain(iv.hi)) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** Two intervals with a fraction or a logarithm go on two lines, the second beginning with \cup. */
const wide = (ivs: Iv[]) => ivs.length === 2 && ivs.some((iv) => !plain(iv.lo) || !plain(iv.hi));

/** S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}; `name` is S, or D for a domain. */
export function setTex(ivs: Iv[], name = 'S'): string {
	if (!ivs.length) return `${name} = \\emptyset`;
	if (isAll(ivs)) return `${name} = \\mathbb{R}`;
	const parts = ivs.map((iv, i) => {
		const t = ivTex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}') && !wide(ivs)) s += '\\,';
		return s;
	});
	if (wide(ivs)) return `\\begin{gathered} ${name} = ${parts[0]} \\\\ \\cup ${parts[1]} \\end{gathered}`;
	return `${name} = ${parts.join(' \\cup ')}`;
}

/** x < -3, x \geq 1, -1 < x \leq 4, joined by "oppure": the last step of a solution. */
export function disTex(ivs: Iv[]): string {
	if (!ivs.length) return text('Nessun ') + 'x' + text(' è soluzione.');
	if (isAll(ivs)) return text('Ogni ') + 'x' + text(' è soluzione.');
	const le = (c: boolean) => (c ? '\\leq' : '<');
	return ivs
		.map((iv) => {
			if (iv.lo === null) return `x ${le(iv.hiC)} ${valTex(iv.hi!)}`;
			if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${valTex(iv.lo)}`;
			return `${valTex(iv.lo)} ${le(iv.loC)} x ${le(iv.hiC)} ${valTex(iv.hi)}`;
		})
		.join(' \\ \\text{ oppure } \\ ');
}

// ---------------------------------------------------------------------------
// Multiple choice

/** An option: what it shows, the strings of its values, and the mistake it comes from (`giusta` for the right one). */
export interface Cand {
	tag: string;
	latex: string;
	values: string[];
}

export const ivCand = (tag: string, ivs: Iv[], name = 'S'): Cand => ({ tag, latex: setTex(ivs, name), values: ivs.map(ivStr) });
export const setCand = (tag: string, vals: Val[]): Cand => {
	const s = solutionSet(vals);
	return { tag, latex: s.latex, values: s.values };
};
export const numCand = (tag: string, r: Rational | number): Cand => {
	const v = typeof r === 'number' ? q(r) : r;
	return { tag, latex: v.toLatex(), values: [v.toString()] };
};

/**
 * The right option and the first three mistakes that differ from it and from each other, in this order; null when
 * the mistakes are not enough. They go in `params.cands`, so that the choice can be built again from the sample
 * and the checker knows which mistake each option comes from.
 */
export function fourCands(right: Cand, cands: (Cand | null | undefined)[], count = 4): Cand[] | null {
	const key = (c: Cand) => c.values.join('|');
	const picked: Cand[] = [right];
	const seen = new Set([key(right)]);
	const shown = new Set([right.latex]);
	for (const c of cands) {
		if (picked.length === count) break;
		if (!c || seen.has(key(c)) || shown.has(c.latex)) continue;
		seen.add(key(c));
		shown.add(c.latex);
		picked.push(c);
	}
	return picked.length < count ? null : picked;
}

/** The options of `cands` (the right one first) in a random order. */
export function choiceOf(cands: Cand[], rng: Rng): ChoiceAnswer {
	const order = shuffle(
		rng,
		cands.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: cands[i].latex, values: cands[i].values }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// A generator from its levels

/** What a level builds: the text, the steps, the right option and the mistakes. Without `answer` the exercise is a choice. */
export interface Build {
	form: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer?: NumberAnswer | SetAnswer;
	right: Cand;
	cands: (Cand | null | undefined)[];
	extra: Record<string, unknown>;
}

/** The same form drawn again until it gives a sample, so that rejections do not change the share of the forms. */
export function retry<T>(f: () => T | null): T | null {
	for (let i = 0; i < 2000; i++) {
		const b = f();
		if (b) return b;
	}
	return null;
}

const same = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** The checks every sample of these generators shares: four distinct options, the right one first in `params.cands`. */
function commonErrors(s: Sample): string[] {
	const errs: string[] = [];
	const cands = (s.params.cands ?? []) as Cand[];
	if (cands.length !== 4) return ['servono quattro opzioni in params.cands'];
	if (cands[0].tag !== 'giusta' || cands.slice(1).some((c) => c.tag === 'giusta')) errs.push('la prima opzione deve essere la sola giusta');
	if (new Set(cands.map((c) => c.values.join('|'))).size !== 4) errs.push('opzioni uguali');
	if (new Set(cands.map((c) => c.latex)).size !== 4) errs.push('opzioni scritte uguali');
	const right = cands[0];
	const ans = s.answer;
	if (ans.kind === 'number' && ans.value !== right.values[0]) errs.push('la risposta non è la prima opzione');
	if (ans.kind === 'set' && !same(ans.values, right.values)) errs.push('la risposta non è la prima opzione');
	for (const ch of [ans.kind === 'choice' ? ans : undefined, s.choice]) {
		if (!ch) continue;
		if (ch.options.length !== 4) errs.push('la scelta non ha quattro opzioni');
		const o = ch.options[ch.correct];
		if (!o || o.latex !== right.latex || !same(o.values, right.values)) errs.push('opzione giusta sbagliata');
		if (ch.options.some((x) => !cands.some((c) => c.latex === x.latex && same(c.values, x.values)))) errs.push('opzione fuori da params.cands');
	}
	errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution || !s.prompt) errs.push('mancano consegna, passaggi o soluzione');
	return errs;
}

/**
 * A generator from the builders of its levels. Each sample keeps its four options in `params.cands`, the right one
 * first: a level with a number or a set as its answer builds the choice from them (`toChoice`), a level that is a
 * choice from the start shuffles them when it is generated. `levelErrors` are the constraints of the specification.
 */
export function makeGenerator(id: string, title: string, levels: Record<number, LevelSpec>, builders: Record<number, (rng: Rng) => Build | null>, levelErrors: (s: Sample) => string[]): Generator {
	const check = (s: Sample) => (builders[s.level] ? [...commonErrors(s), ...levelErrors(s)] : [`livello ${s.level} sconosciuto`]);
	return {
		id,
		title,
		levels,
		generate(rng: Rng, level: number): Sample {
			const build = builders[level];
			if (!build) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 5000; attempt++) {
				const b = build(rng);
				if (!b) continue;
				const cands = fourCands(b.right, b.cands);
				if (!cands) continue;
				const sample: Sample = {
					generatorId: id,
					level,
					seed: rng.seed,
					prompt: b.prompt,
					problem: b.problem,
					solution: b.solution,
					steps: b.steps,
					answer: b.answer ?? choiceOf(cands, rng),
					params: { form: b.form, ...b.extra, cands },
				};
				if (check(sample).length === 0) return sample;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check,
		toChoice: (s: Sample, rng: Rng) => (s.answer.kind === 'choice' ? s.answer : choiceOf(s.params.cands as Cand[], rng)),
	};
}
