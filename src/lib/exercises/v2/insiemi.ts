/**
 * Shared machinery for the generators of the chapter "Insiemi e logica": finite sets of small
 * integers or letters, their LaTeX, the operations, true or false statements with ∈ and ⊆, and
 * multiple-choice assembly. Used by prime-definizioni, insiemi-rappresentazione,
 * sottoinsiemi-ugualianza, insiemi-unione and insiemi-operazioni.
 *
 * Conventions of the rewritten lessons: ℕ contains 0; ⊆ is inclusion and ⊂ strict inclusion;
 * A \setminus B for the difference; \overline{A} for the complement; |A| for the cardinality;
 * sets written as \{1, 2, 3\}, the empty set as \emptyset.
 *
 * Elements are numbers (integers), letters, or fractions written "p/q" (only for membership in
 * ℕ, ℤ, ℚ). In params and choice values every element is a string: "3", "-2", "a", "1/2".
 */
import type { ChoiceAnswer, ChoiceOption, Rng } from './types';

export type El = number | string;

const FRACTION = /^-?\d+\/\d+$/;

// ---------------------------------------------------------------------------
// Elements and sets

export function elStr(e: El): string {
	return typeof e === 'number' ? String(e) : e;
}

export function elTex(e: El): string {
	if (typeof e === 'number') return String(e);
	if (FRACTION.test(e)) {
		const [p, qq] = e.split('/');
		return p.startsWith('-') ? `-\\frac{${p.slice(1)}}{${qq}}` : `\\frac{${p}}{${qq}}`;
	}
	return e;
}

function cmp(a: El, b: El): number {
	if (typeof a === 'number' && typeof b === 'number') return a - b;
	if (typeof a === 'number') return -1;
	if (typeof b === 'number') return 1;
	return a < b ? -1 : a > b ? 1 : 0;
}

/** Distinct elements, numbers ascending, then letters in alphabetical order. */
export function norm(xs: readonly El[]): El[] {
	const seen = new Set<string>();
	const out: El[] = [];
	for (const x of xs) {
		const k = `${typeof x}:${x}`;
		if (!seen.has(k)) {
			seen.add(k);
			out.push(x);
		}
	}
	return out.sort(cmp);
}

export const setKey = (xs: readonly El[]): string => norm(xs).map(elStr).join(',');
export const sameSet = (a: readonly El[], b: readonly El[]): boolean => setKey(a) === setKey(b);
export const has = (xs: readonly El[], e: El): boolean => xs.some((x) => x === e);
export const union = (a: readonly El[], b: readonly El[]): El[] => norm([...a, ...b]);
export const inter = (a: readonly El[], b: readonly El[]): El[] => norm(a.filter((x) => has(b, x)));
export const diff = (a: readonly El[], b: readonly El[]): El[] => norm(a.filter((x) => !has(b, x)));
export const symDiff = (a: readonly El[], b: readonly El[]): El[] => union(diff(a, b), diff(b, a));
export const subsetEq = (a: readonly El[], b: readonly El[]): boolean => a.every((x) => has(b, x));
export const properSubset = (a: readonly El[], b: readonly El[]): boolean => subsetEq(a, b) && !subsetEq(b, a);

/** `\{1, 2, 3\}`, sorted unless `keepOrder`; the empty set is `\emptyset`. */
export function setTex(xs: readonly El[], keepOrder = false): string {
	const list = keepOrder ? [...xs] : norm(xs);
	if (list.length === 0) return '\\emptyset';
	return `\\{${list.map(elTex).join(', ')}\\}`;
}

/**
 * Listed items between braces, on one line or, with `split`, on two lines of a gathered: the first half
 * (rounded up) on the first line, ending with its comma, and \Big braces so the two lines read as one
 * set. For an answer option too wide for the phone's answer button.
 */
export function listTex(items: readonly string[], split = false): string {
	if (!split) return `\\{${items.join(', ')}\\}`;
	const k = Math.ceil(items.length / 2);
	return `\\begin{gathered} \\Big\\{${items.slice(0, k).join(', ')}, \\\\ ${items.slice(k).join(', ')}\\Big\\} \\end{gathered}`;
}

/**
 * A listed set wider than the 252 px an answer button leaves. The width at 16 px, measured with KaTeX on
 * 400 sets of the generators (error under 1.1 px): 18 px for the braces, 10 per digit or letter, 11 per
 * minus sign, 8 per comma and space.
 */
export const listTooWide = (items: readonly string[]): boolean => {
	const written = items.join(', ');
	const glyphs = (written.match(/[0-9a-z]/gi) ?? []).length;
	const minus = (written.match(/-/g) ?? []).length;
	return 18 + 10 * glyphs + 11 * minus + 8 * (items.length - 1) > 252;
};

/**
 * The set options of a choice fitted to the phone: if one of them is too wide, every set option with at
 * least 4 elements goes on two lines, so the options keep the same shape and the long one does not stand
 * out. Options that are not listed sets are left as they are.
 */
export function fitSetChoice(ch: ChoiceAnswer): ChoiceAnswer {
	const lists = ch.options.map((o) => {
		const xs = o.values.map(parseEl);
		return o.values.length && o.latex === setTex(xs) ? norm(xs).map(elTex) : null;
	});
	if (!lists.some((l) => l && listTooWide(l))) return ch;
	return { ...ch, options: ch.options.map((o, i) => (lists[i] && lists[i].length >= 4 ? { ...o, latex: listTex(lists[i], true) } : o)) };
}

export const range = (a: number, b: number): number[] => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

// ---------------------------------------------------------------------------
// Randomness

export function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** k distinct elements of `pool`, in random order. */
export function pickDistinct<T>(rng: Rng, pool: readonly T[], k: number): T[] {
	if (k > pool.length) throw new Error(`pickDistinct: ${k} > ${pool.length}`);
	return shuffle(rng, pool).slice(0, k);
}

// ---------------------------------------------------------------------------
// Text

/** Visible length of a piece of prose: a LaTeX command counts as one character. */
const visible = (s: string): number => s.replace(/\\[a-zA-Z]+\s?/g, 'x').replace(/[${}]/g, '').length;

/**
 * Italian prose as LaTeX lines of about `width` visible characters, so a word problem fits a
 * phone screen: `\begin{array}{l}\text{...}\\ \text{...}\end{array}`. Inline math goes between
 * dollars (`Sia $A$ l'insieme...`) and is never split across lines. Extra LaTeX lines (a formula,
 * a set) can follow. The prose must not contain % & # _.
 */
export function textBlock(prose: string, width = 46, extra: string[] = []): string {
	if (/[%&#_]/.test(prose.replace(/\$[^$]*\$/g, ''))) throw new Error(`textBlock: special character in "${prose}"`);
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
	return lines([...out.map((l) => `\\text{${l}}`), ...extra]);
}

/** Several LaTeX lines stacked and left-aligned. */
export function lines(xs: string[]): string {
	return xs.length === 1 ? xs[0] : `\\begin{array}{l} ${xs.join(' \\\\ ')} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Statements: element ∈ set, set ⊆ set, set = set

/**
 * A term of a statement, as a token (the same string goes in choice values):
 * "A" a set named in params.sets; "N", "Z", "Q" the number sets; "e:3" the element 3;
 * "s:1,2" the literal set {1, 2} ("s:" is the empty set).
 */
export type Tok = string;
export type Op = 'in' | 'notin' | 'subeq' | 'sub' | 'nsubeq' | 'eq' | 'neq';

export interface Stmt {
	op: Op;
	l: Tok;
	r: Tok;
}

const OP_TEX: Record<Op, string> = {
	in: '\\in',
	notin: '\\notin',
	subeq: '\\subseteq',
	sub: '\\subset',
	nsubeq: '\\not\\subseteq',
	eq: '=',
	neq: '\\neq',
};

export const tokEl = (e: El): Tok => `e:${elStr(e)}`;
export const tokSet = (xs: readonly El[]): Tok => `s:${norm(xs).map(elStr).join(',')}`;

function parseEl(s: string): El {
	return /^-?\d+$/.test(s) ? Number(s) : s;
}

export function tokTex(t: Tok): string {
	if (t === 'N') return '\\mathbb{N}';
	if (t === 'Z') return '\\mathbb{Z}';
	if (t === 'Q') return '\\mathbb{Q}';
	if (t.startsWith('e:')) return elTex(parseEl(t.slice(2)));
	if (t.startsWith('s:')) return setTex(t.length > 2 ? t.slice(2).split(',').map(parseEl) : []);
	return t;
}

export const stmtTex = (s: Stmt): string => `${tokTex(s.l)} ${OP_TEX[s.op]} ${tokTex(s.r)}`;
export const stmtValues = (s: Stmt): string[] => [s.op, s.l, s.r];

type Val = { kind: 'el'; e: El } | { kind: 'set'; els: El[] } | { kind: 'num'; name: 'N' | 'Z' | 'Q' };

function valueOf(t: Tok, sets: Record<string, El[]>): Val {
	if (t === 'N' || t === 'Z' || t === 'Q') return { kind: 'num', name: t };
	if (t.startsWith('e:')) return { kind: 'el', e: parseEl(t.slice(2)) };
	if (t.startsWith('s:'))
		return {
			kind: 'set',
			els: t.length > 2 ? t.slice(2).split(',').map(parseEl) : [],
		};
	if (!sets[t]) throw new Error(`statement: unknown set ${t}`);
	return { kind: 'set', els: sets[t] };
}

function inNumberSet(e: El, name: 'N' | 'Z' | 'Q'): boolean {
	if (typeof e === 'number') return name !== 'N' || e >= 0;
	if (FRACTION.test(e)) {
		const [p, qq] = e.split('/').map(Number);
		if (p % qq === 0) return inNumberSet(p / qq, name);
		return name === 'Q';
	}
	return false;
}

const NUM_ORDER = { N: 0, Z: 1, Q: 2 };

/** Truth of a statement; the sets named in it come from `sets`. */
export function evalStmt(s: Stmt, sets: Record<string, El[]>): boolean {
	const l = valueOf(s.l, sets),
		r = valueOf(s.r, sets);
	switch (s.op) {
		case 'in':
		case 'notin': {
			let t: boolean;
			if (l.kind !== 'el')
				t = false; // the sets here contain numbers or letters, never sets
			else if (r.kind === 'num') t = inNumberSet(l.e, r.name);
			else if (r.kind === 'set') t = has(r.els, l.e);
			else throw new Error('statement: ∈ needs a set on the right');
			return s.op === 'in' ? t : !t;
		}
		case 'subeq':
		case 'sub':
		case 'nsubeq':
		case 'eq':
		case 'neq': {
			if (l.kind === 'num' && r.kind === 'num') {
				const d = NUM_ORDER[l.name] - NUM_ORDER[r.name];
				const map = {
					subeq: d <= 0,
					sub: d < 0,
					nsubeq: d > 0,
					eq: d === 0,
					neq: d !== 0,
				};
				return map[s.op];
			}
			if (l.kind !== 'set' || r.kind !== 'set') throw new Error(`statement: ${s.op} needs two sets`);
			const map = {
				subeq: subsetEq(l.els, r.els),
				sub: properSubset(l.els, r.els),
				nsubeq: !subsetEq(l.els, r.els),
				eq: sameSet(l.els, r.els),
				neq: !sameSet(l.els, r.els),
			};
			return map[s.op];
		}
	}
}

// ---------------------------------------------------------------------------
// Choice

export const VERO: ChoiceOption = { latex: '\\text{Vero}', values: ['1'] };
export const FALSO: ChoiceOption = { latex: '\\text{Falso}', values: ['0'] };

/** True or false, always in the order Vero, Falso. */
export function trueFalse(truth: boolean): ChoiceAnswer {
	return { kind: 'choice', options: [VERO, FALSO], correct: truth ? 0 : 1 };
}

export const setOption = (xs: readonly El[]): ChoiceOption => ({
	latex: setTex(xs),
	values: norm(xs).map(elStr),
});
export const numberOption = (n: number): ChoiceOption => ({
	latex: String(n),
	values: [String(n)],
});
export const stmtOption = (s: Stmt): ChoiceOption => ({
	latex: stmtTex(s),
	values: stmtValues(s),
});

/**
 * The correct option plus the first distinct distractors, up to `count`, shuffled. Two options
 * are the same when their values (or, for text options, their LaTeX) coincide. Returns null if
 * there are not enough distinct distractors.
 */
export function assembleChoice(rng: Rng, correct: ChoiceOption, distractors: (ChoiceOption | null)[], count = 4): ChoiceAnswer | null {
	const key = (o: ChoiceOption) => o.values.join('|') + '#' + (o.values.length ? '' : o.latex);
	const seen = new Set([key(correct)]);
	const latexSeen = new Set([correct.latex]);
	const options = [correct];
	for (const d of distractors) {
		if (!d || options.length >= count) continue;
		if (seen.has(key(d)) || latexSeen.has(d.latex)) continue;
		seen.add(key(d));
		latexSeen.add(d.latex);
		options.push(d);
	}
	if (options.length < count) return null;
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	return {
		kind: 'choice',
		options: order.map((i) => options[i]),
		correct: order.indexOf(0),
	};
}

/** Distractors for a count: the mistakes first, then ±1, ±2, ... never negative. */
export function numberChoice(rng: Rng, value: number, mistakes: number[], count = 4): ChoiceAnswer {
	const cands = [...mistakes];
	for (let d = 1; d < 40; d++) cands.push(value + d, value - d);
	const ch = assembleChoice(rng, numberOption(value), cands.filter((n) => Number.isInteger(n) && n >= 0).map(numberOption), count);
	if (!ch) throw new Error('numberChoice: not enough distractors');
	return ch;
}

/** Nearby wrong sets for a set answer: one element removed, one added from `pool`. */
export function nearSets(rng: Rng, xs: readonly El[], pool: readonly El[]): El[][] {
	const out: El[][] = [];
	const s = norm(xs);
	if (s.length > 1) out.push(s.filter((x) => x !== rng.pick(s)));
	const extra = pool.filter((p) => !has(s, p));
	if (extra.length) out.push(norm([...s, rng.pick(extra)]));
	return out;
}

// ---------------------------------------------------------------------------
// Characteristic properties: {x ∈ ℕ | condition}

/**
 * A condition on x. `range`: lo (<, ≤) x (<, ≤) hi, either side optional; `lin`: a·x + b rel c;
 * `sq`: x^2 rel c; the others are words (x è pari, x è multiplo di k, x è un divisore di n).
 */
export type Cond =
	| {
			t: 'range';
			lo: number | null;
			loStrict: boolean;
			hi: number | null;
			hiStrict: boolean;
	  }
	| { t: 'pari' }
	| { t: 'dispari' }
	| { t: 'mult'; k: number }
	| { t: 'div'; n: number }
	| { t: 'lin'; a: number; b: number; rel: Rel; c: number }
	| { t: 'sq'; rel: Rel; c: number };
export type Rel = '<' | '<=' | '=' | '>' | '>=';
export interface Prop {
	dom: 'N' | 'Z';
	conds: Cond[];
}

const REL_TEX: Record<Rel, string> = {
	'<': '<',
	'<=': '\\le',
	'=': '=',
	'>': '>',
	'>=': '\\ge',
};
const relHolds = (l: number, rel: Rel, r: number): boolean => (rel === '<' ? l < r : rel === '<=' ? l <= r : rel === '=' ? l === r : rel === '>' ? l > r : l >= r);

export function condTex(c: Cond): string {
	switch (c.t) {
		case 'range': {
			const lo = c.lo === null ? '' : `${c.lo} ${c.loStrict ? '<' : '\\le'} `;
			const hi = c.hi === null ? '' : ` ${c.hiStrict ? '<' : '\\le'} ${c.hi}`;
			if (c.lo !== null && c.hi === null) return `x ${c.loStrict ? '>' : '\\ge'} ${c.lo}`;
			return `${lo}x${hi}`;
		}
		case 'pari':
			return 'x \\text{ è pari}';
		case 'dispari':
			return 'x \\text{ è dispari}';
		case 'mult':
			return `x \\text{ è multiplo di } ${c.k}`;
		case 'div':
			return `x \\text{ è un divisore di } ${c.n}`;
		case 'lin': {
			const ax = c.a === 1 ? 'x' : `${c.a}x`;
			const b = c.b === 0 ? '' : c.b > 0 ? ` + ${c.b}` : ` - ${-c.b}`;
			return `${ax}${b} ${REL_TEX[c.rel]} ${c.c}`;
		}
		case 'sq':
			return `x^2 ${REL_TEX[c.rel]} ${c.c}`;
	}
}

export const propTex = (p: Prop): string => `\\{x \\in \\mathbb{${p.dom}} \\mid ${p.conds.map(condTex).join(' \\text{ e } ')}\\}`;

/**
 * A property with two conditions on two lines of a gathered, broken before the "e" between them, with
 * \Big braces: `\Big\{x \in \mathbb{N} \mid x \text{ è multiplo di } 3 \\ \text{e } 1 \le x \le 12\Big\}`.
 * `before` goes in front of the first line (`A = `).
 */
export function propTexSplit(p: Prop, before = ''): string {
	if (p.conds.length !== 2) throw new Error(`propTexSplit: ${p.conds.length} conditions`);
	const [a, b] = p.conds.map(condTex);
	return `\\begin{gathered} ${before}\\Big\\{x \\in \\mathbb{${p.dom}} \\mid ${a} \\\\ \\text{e } ${b}\\Big\\} \\end{gathered}`;
}

function condHolds(c: Cond, x: number): boolean {
	switch (c.t) {
		case 'range':
			return (c.lo === null || (c.loStrict ? x > c.lo : x >= c.lo)) && (c.hi === null || (c.hiStrict ? x < c.hi : x <= c.hi));
		case 'pari':
			return x % 2 === 0;
		case 'dispari':
			return Math.abs(x % 2) === 1;
		case 'mult':
			return x % c.k === 0;
		case 'div':
			return x !== 0 && c.n % x === 0;
		case 'lin':
			return relHolds(c.a * x + c.b, c.rel, c.c);
		case 'sq':
			return relHolds(x * x, c.rel, c.c);
	}
}

/** Elements of a property, searched in [-PROP_BOUND, PROP_BOUND]; throws if the set reaches the edge. */
export const PROP_BOUND = 400;
export function propElements(p: Prop): number[] {
	const out: number[] = [];
	for (let x = p.dom === 'N' ? 0 : -PROP_BOUND; x <= PROP_BOUND; x++) if (p.conds.every((c) => condHolds(c, x))) out.push(x);
	if (out.some((x) => Math.abs(x) > PROP_BOUND - 50)) throw new Error(`propElements: unbounded ${propTex(p)}`);
	return out;
}

/** The property as JSON-safe strings, for params and choice values. */
export function propJSON(p: Prop): Record<string, unknown> {
	const str = (v: unknown) => (typeof v === 'number' ? String(v) : v);
	return {
		dom: p.dom,
		conds: p.conds.map((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, str(v)]))),
	};
}

export function propFromJSON(j: unknown): Prop {
	const o = j as { dom: 'N' | 'Z'; conds: Record<string, unknown>[] };
	const num = (v: unknown) => (v === null ? null : Number(v));
	return {
		dom: o.dom,
		conds: o.conds.map((c) => {
			const out: Record<string, unknown> = { ...c };
			for (const k of ['lo', 'hi', 'k', 'n', 'a', 'b', 'c']) if (k in c) out[k] = num(c[k]);
			return out as unknown as Cond;
		}),
	};
}

export const range2 = (lo: number | null, loStrict: boolean, hi: number | null, hiStrict: boolean): Cond => ({ t: 'range', lo, loStrict, hi, hiStrict });

/**
 * Off-by-one mistakes at the ends of a list of integers: the last or first element dropped, or
 * one more term of the progression added after the last or before the first (never below
 * `min`). For 4, 8, ..., 24 these are 4, ..., 20 and 4, ..., 28.
 */
export function endMistakes(xs: readonly number[], min = -Infinity): number[][] {
	const s = [...new Set(xs)].sort((a, b) => a - b);
	if (s.length === 0) return [];
	const steps = s.slice(1).map((x, i) => x - s[i]);
	const d = steps.length && steps.every((x) => x === steps[0]) ? steps[0] : 1;
	const out: number[][] = [];
	out.push([...s, s[s.length - 1] + d]);
	if (s.length > 1) out.push(s.slice(0, -1));
	if (s[0] - d >= min) out.push([s[0] - d, ...s]);
	if (s.length > 1) out.push(s.slice(1));
	return out;
}
