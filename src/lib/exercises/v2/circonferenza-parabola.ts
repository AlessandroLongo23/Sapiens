/**
 * What the four generators of lessons 114-117 share (circonferenza-equazione, circonferenza-rette,
 * parabola-equazione, parabola-rette): the LaTeX of points, lines, circles and parabolas as the lessons write
 * them, the options of the multiple choice, and the frame of a generator.
 *
 * A level builds a `Built`: the right option, the wrong ones in the order of the mistakes the lesson warns
 * about, and, where the answer is a number, a set of numbers or an expression, the open answer. The frame keeps
 * the first distinct options (the right one first) in `params.options`, so `toChoice` can shuffle them again from
 * the sample alone, and so the Python checker reads what the student reads.
 *
 * Every equation is written from a list of terms, so "1x", "+ -" and zero terms cannot appear.
 */
import type { ChoiceAnswer, ChoiceOption, ExpressionAnswer, Generator, LevelSpec, NumberAnswer, Rng, Sample, SetAnswer } from './types';
import { Rational, q } from './rational';
import { Surd } from './surd';
import { shuffle } from './insiemi';

export type Num = number | Rational;
export const R = (n: Num): Rational => (typeof n === 'number' ? q(n) : n);
export const t = (s: string): string => `\\text{${s}}`;

export function nonZero(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

/** A number in parentheses when negative, for substitutions. */
export function par(n: Num): string {
	const r = R(n);
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

/** "(3, 0)" or "\left(\frac{3}{2}, -\frac{5}{4}\right)", with the name in front if given. */
export function pt(name: string, x: Num, y: Num): string {
	const [a, b] = [R(x), R(y)];
	return a.isInteger() && b.isInteger() ? `${name}(${a.num}, ${b.num})` : `${name}\\left(${a.toLatex()}, ${b.toLatex()}\\right)`;
}

/** A term of a polynomial in x and y: coefficient and monomial ('x^2', 'y^2', 'x', 'y', ''). */
export type Term = [Num, string];

const PY: Record<string, string> = { 'x^2': 'x**2', 'y^2': 'y**2', x: 'x', y: 'y', '': '' };

/** LaTeX of a sum of terms: never "1x", "+ -", a zero term; "0" when nothing is left. */
export function sum(terms: Term[]): string {
	let out = '';
	for (const [k, m] of terms) {
		const c = R(k);
		if (c.isZero()) continue;
		const a = c.abs();
		const body = m === '' ? a.toLatex() : (a.isOne() ? '' : a.toLatex()) + m;
		out += out === '' ? (c.sign() < 0 ? '-' : '') + body : (c.sign() < 0 ? ' - ' : ' + ') + body;
	}
	return out === '' ? '0' : out;
}

/** The same sum as a SymPy expression: "(1/4)*x**2 - 1*x + 2". */
export function sumPy(terms: Term[]): string {
	const parts = terms.filter(([k]) => !R(k).isZero()).map(([k, m]) => {
		const c = R(k);
		const n = c.isInteger() ? `${c.num}` : `(${c.num}/${c.den})`;
		return PY[m] === '' ? n : `${n}*${PY[m]}`;
	});
	return parts.length ? parts.join(' + ') : '0';
}

export const circleTerms = (a: Num, b: Num, c: Num): Term[] => [[1, 'x^2'], [1, 'y^2'], [a, 'x'], [b, 'y'], [c, '']];
/** x² + y² + ax + by + c = 0. */
export const circleGeneral = (a: Num, b: Num, c: Num): string => `${sum(circleTerms(a, b, c))} = 0`;

const shifted = (v: string, k: number): string => (k === 0 ? `${v}^2` : `(${v} ${k > 0 ? '-' : '+'} ${Math.abs(k)})^2`);
/** (x - α)² + (y - β)² = r², with integer centre. */
export const circleCentre = (al: number, be: number, r2: Num): string => `${shifted('x', al)} + ${shifted('y', be)} = ${R(r2).toLatex()}`;

/** The circle of centre (α, β) and squared radius r² in general form, as an option. */
export function circleOption(a: Num, b: Num, c: Num): ChoiceOption {
	return { latex: circleGeneral(a, b, c), values: [sumPy(circleTerms(a, b, c))] };
}

export const lineImplicit = (a: Num, b: Num, c: Num): string => `${sum([[a, 'x'], [b, 'y'], [c, '']])} = 0`;
export const lineExplicit = (m: Num, k: Num): string => `y = ${sum([[m, 'x'], [k, '']])}`;
export const parY = (a: Num, b: Num, c: Num): string => `y = ${sum([[a, 'x^2'], [b, 'x'], [c, '']])}`;
export const parX = (a: Num, b: Num, c: Num): string => `x = ${sum([[a, 'y^2'], [b, 'y'], [c, '']])}`;

const coefPy = (x: Rational): string => (x.isInteger() ? String(x.num) : `(${x.num}/${x.den})`);
/** The right-hand side of y = ax² + bx + c for SymPy, as funzioni-quadratiche writes it. */
export const quadPy = (a: Num, b: Num, c: Num): string => `${coefPy(R(a))}*x**2 + ${coefPy(R(b))}*x + ${coefPy(R(c))}`;
export const linPy = (m: Num, k: Num): string => `${coefPy(R(m))}*x + ${coefPy(R(k))}`;

// ---------------------------------------------------------------------------
// Options

export const numOption = (v: Num | Surd): ChoiceOption => (v instanceof Surd ? { latex: v.toLatex(), values: [v.toString()] } : { latex: R(v).toLatex(), values: [R(v).toString()] });
export const pointOption = (x: Num, y: Num, name = ''): ChoiceOption => ({ latex: pt(name, x, y), values: [R(x).toString(), R(y).toString()] });
export const textOption = (s: string): ChoiceOption => ({ latex: t(s), values: [s] });
/** y = mx + k as an option (and x = h, y = k for the lines parallel to the axes). */
export const lineOption = (m: Num, k: Num): ChoiceOption => ({ latex: lineExplicit(m, k), values: [`y = ${linPy(m, k)}`] });
export const verticalOption = (h: Num): ChoiceOption => ({ latex: `x = ${R(h).toLatex()}`, values: [`x = ${R(h)}`] });
export const parYOption = (a: Num, b: Num, c: Num): ChoiceOption => ({ latex: parY(a, b, c), values: [quadPy(a, b, c)] });
export const parXOption = (a: Num, b: Num, c: Num): ChoiceOption => ({ latex: parX(a, b, c), values: [`x = ${quadPy(a, b, c).replace(/x/g, 'y')}`] });

/** A set of rationals, ascending: \left\{ -3,\ -\frac{1}{3} \right\}. */
export function setOption(vs: Rational[]): ChoiceOption {
	const s = [...vs].sort((a, b) => a.compare(b));
	return { latex: `\\left\\{ ${s.map((v) => v.toLatex()).join(',\\ ')} \\right\\}`, values: s.map(String) };
}

/** The same, or null when two of the values coincide (a wrong answer that is not a pair). */
export const pairOption = (vs: Rational[]): ChoiceOption | null => (vs.some((v, i) => vs.some((w, j) => j > i && v.equals(w))) ? null : setOption(vs));

/** Tries `f` until it builds something: for a case chosen first, so that rejections do not change its share. */
export function until<T>(f: () => T | null, tries = 500): T | null {
	for (let i = 0; i < tries; i++) {
		const v = f();
		if (v !== null) return v;
	}
	return null;
}

export const numberAnswer = (v: Rational): NumberAnswer => ({ kind: 'number', value: v.toString() });
/** A length: a number when rational, a simplified radical otherwise. */
export const surdAnswer = (v: Surd): NumberAnswer | ExpressionAnswer => (v.isRational() ? numberAnswer(v.toRational()) : { kind: 'expression', value: v.toString(), latex: v.toLatex(), form: 'simplified' });
export function setAnswer(vs: Rational[]): SetAnswer {
	const o = setOption(vs);
	return { kind: 'set', values: o.values, latex: o.latex };
}

/** √n as an exact value. */
export const root = (n: number): Surd => Surd.of(0, 1, n, 1);
/** The lattice points (dx, dy) with dx² + dy² = r2. */
export function lattice(r2: number): [number, number][] {
	const out: [number, number][] = [];
	const m = Math.floor(Math.sqrt(r2));
	for (let dx = -m; dx <= m; dx++) for (let dy = -m; dy <= m; dy++) if (dx * dx + dy * dy === r2) out.push([dx, dy]);
	return out;
}

// ---------------------------------------------------------------------------
// The frame of a generator

export interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	correct: ChoiceOption;
	/** In the order of the mistakes of the lesson: the first distinct ones are kept. */
	distractors: (ChoiceOption | null)[];
	/** Number of options, 4 unless the level has only three possible answers. */
	n?: number;
	/** The open answer, where the level has one; without it the answer is the choice. */
	open?: NumberAnswer | ExpressionAnswer | SetAnswer;
	params: Record<string, unknown>;
}

const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: '1x', re: /(?<![\d}_])1\s*[xy]/ },
	{ name: '0x', re: /(?<![\d}_])0\s*[xy]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo', re: /[+-]\s*0(?![\d])/ },
];

const keyOf = (o: ChoiceOption): string => o.values.join('|');

function firstDistinct(correct: ChoiceOption, distractors: (ChoiceOption | null)[], n: number): ChoiceOption[] | null {
	const opts = [correct];
	for (const d of distractors) {
		if (opts.length === n) break;
		if (!d || opts.some((o) => keyOf(o) === keyOf(d) || o.latex === d.latex)) continue;
		opts.push(d);
	}
	return opts.length === n ? opts : null;
}

function shuffled(rng: Rng, opts: ChoiceOption[]): ChoiceAnswer {
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => ({ latex: opts[i].latex, values: [...opts[i].values] })), correct: order.indexOf(0) };
}

export interface Level extends LevelSpec {
	build: (rng: Rng) => Built | null;
	/** Violations of the constraints of the specification that the frame does not see. */
	check?: (s: Sample) => string[];
}

export function makeGenerator(id: string, title: string, levels: Record<number, Level>): Generator {
	function check(s: Sample): string[] {
		const v: string[] = [];
		const opts = (s.params.options ?? []) as ChoiceOption[];
		for (const f of FORBIDDEN_PATTERNS) {
			if (f.re.test(s.problem)) v.push(`problema con ${f.name}: ${s.problem}`);
			for (const o of opts) if (f.re.test(o.latex)) v.push(`opzione con ${f.name}: ${o.latex}`);
		}
		if (!s.steps.length) v.push('nessun passaggio');
		if (!s.solution) v.push('nessuna soluzione');
		if (opts.length < 3) v.push('meno di tre opzioni');
		if (new Set(opts.map(keyOf)).size !== opts.length || new Set(opts.map((o) => o.latex)).size !== opts.length) v.push('opzioni non distinte');
		const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
		if (ch && opts.length) {
			if (ch.options.length !== opts.length) v.push('scelta con un numero di opzioni diverso');
			else if (keyOf(ch.options[ch.correct]) !== keyOf(opts[0])) v.push("l'opzione giusta non è la prima di params.options");
		}
		if (s.answer.kind === 'number' && opts.length && s.answer.value !== opts[0].values[0]) v.push('risposta numerica diversa dalla prima opzione');
		if (s.answer.kind === 'set' && opts.length && s.answer.values.join('|') !== keyOf(opts[0])) v.push('insieme diverso dalla prima opzione');
		return [...v, ...(levels[s.level]?.check?.(s) ?? [])];
	}
	return {
		id,
		title,
		levels: Object.fromEntries(Object.entries(levels).map(([k, l]) => [k, { label: l.label, constraints: l.constraints }])),
		generate(rng: Rng, level: number): Sample {
			const l = levels[level];
			if (!l) throw new Error(`${id}: unknown level ${level}`);
			for (let attempt = 0; attempt < 2000; attempt++) {
				const b = l.build(rng);
				if (!b) continue;
				const opts = firstDistinct(b.correct, b.distractors, b.n ?? 4);
				if (!opts) continue;
				const options = opts.map((o) => ({ latex: o.latex, values: [...o.values] }));
				const s: Sample = {
					generatorId: id,
					level,
					seed: rng.seed,
					prompt: b.prompt,
					problem: b.problem,
					solution: b.solution,
					steps: b.steps,
					answer: b.open ?? shuffled(rng, options),
					params: { ...b.params, options },
				};
				if (check(s).length === 0) return s;
			}
			throw new Error(`${id}: no valid sample for level ${level}, seed ${rng.seed}`);
		},
		check,
		toChoice(s: Sample, rng: Rng): ChoiceAnswer {
			if (s.answer.kind === 'choice') return s.answer;
			return shuffled(rng, s.params.options as ChoiceOption[]);
		},
	};
}
