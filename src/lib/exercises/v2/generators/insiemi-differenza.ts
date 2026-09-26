/**
 * Differenza e complementare. Spec: specs/exercises/insiemi-differenza.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/64-insiemi-differenza.md): the
 * difference of two listed sets, of two sets described by a property in ℕ, how many elements a
 * difference or a complement has, the complement in a listed universe and A \ B as A ∩ B̄, De Morgan's
 * laws, word problems with two sets (also backwards, from "neither" to "both"), word problems with
 * three sets filled from the centre outwards.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import {
	type Prop,
	type El,
	assembleChoice,
	diff,
	fitSetChoice,
	inter,
	lines,
	norm,
	numberChoice,
	pickDistinct,
	propElements,
	propFromJSON,
	propJSON,
	propTex,
	range,
	range2,
	sameSet,
	setOption,
	setTex,
	shuffle,
	subsetEq,
	symDiff,
	textBlock,
	union,
} from '../insiemi';

export const ID = 'insiemi-differenza';

const strs = (xs: readonly El[]) => xs.map(String);
const nums = (xs: unknown): number[] => (xs as string[]).map(Number);

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: SetAnswer | NumberAnswer | ChoiceAnswer;
	params: Record<string, unknown>;
}

const setAnswer = (name: string, xs: El[]): SetAnswer => ({ kind: 'set', values: strs(norm(xs)), latex: `${name} = ${setTex(xs)}` });
const numAnswer = (n: number): NumberAnswer => ({ kind: 'number', value: String(n) });
/** "3 sta" or "3, 5 stanno". */
const verb = (xs: readonly El[], one: string, many: string) => (xs.length === 1 ? one : many);

// ---------------------------------------------------------------------------
// Expressions with complement (levels 4 and 5)

export type Ex = { t: 'set'; name: string } | { t: 'comp'; x: Ex } | { t: 'bin'; op: 'cup' | 'cap' | 'minus'; l: Ex; r: Ex };

const S = (name: string): Ex => ({ t: 'set', name });
const comp = (x: Ex): Ex => ({ t: 'comp', x });
const cup = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'cup', l, r });
const cap = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'cap', l, r });
const minus = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'minus', l, r });
const A = S('A'),
	B = S('B'),
	cA = comp(A),
	cB = comp(B);

const OP_TEX = { cup: '\\cup', cap: '\\cap', minus: '\\setminus' };

export function exTex(e: Ex): string {
	if (e.t === 'set') return e.name;
	if (e.t === 'comp') return `\\overline{${exTex(e.x)}}`;
	const wrap = (x: Ex) => (x.t === 'bin' ? `(${exTex(x)})` : exTex(x));
	return `${wrap(e.l)} ${OP_TEX[e.op]} ${wrap(e.r)}`;
}

/** Compact code of an expression, for params and choice values: c(u(A,B)) is the complement of A ∪ B. */
export function exCode(e: Ex): string {
	if (e.t === 'set') return e.name;
	if (e.t === 'comp') return `c(${exCode(e.x)})`;
	return `${e.op === 'cup' ? 'u' : e.op === 'cap' ? 'i' : 'm'}(${exCode(e.l)},${exCode(e.r)})`;
}

export function exEval(e: Ex, sets: Record<string, El[]>): El[] {
	if (e.t === 'set') return sets[e.name];
	if (e.t === 'comp') return diff(sets.U, exEval(e.x, sets));
	const l = exEval(e.l, sets),
		r = exEval(e.r, sets);
	return e.op === 'cup' ? union(l, r) : e.op === 'cap' ? inter(l, r) : diff(l, r);
}

/** De Morgan identities: the left side, the right side, the wrong right sides a student writes. */
const IDENTITIES: { lhs: Ex; rhs: Ex; wrong: Ex[]; why: string }[] = [
	{
		lhs: comp(cup(A, B)),
		rhs: cap(cA, cB),
		wrong: [cup(cA, cB), cap(A, B), cap(cA, B)],
		why: '\\text{Passando al complementare, } \\cup \\text{ diventa } \\cap \\text{ e ogni insieme diventa il suo complementare}',
	},
	{
		lhs: comp(cap(A, B)),
		rhs: cup(cA, cB),
		wrong: [cap(cA, cB), cup(A, B), cup(cA, B)],
		why: '\\text{Passando al complementare, } \\cap \\text{ diventa } \\cup \\text{ e ogni insieme diventa il suo complementare}',
	},
	{
		lhs: comp(cup(cA, B)),
		rhs: cap(A, cB),
		wrong: [cup(A, cB), cap(cA, cB), cap(cA, B)],
		why: '\\text{Il } \\cup \\text{ diventa } \\cap\\text{, e il complementare di } \\overline{A} \\text{ è } A',
	},
	{
		lhs: comp(cap(A, cB)),
		rhs: cup(cA, B),
		wrong: [cap(cA, B), cup(cA, cB), cup(A, cB)],
		why: '\\text{Il } \\cap \\text{ diventa } \\cup\\text{, e il complementare di } \\overline{B} \\text{ è } B',
	},
	{
		lhs: minus(A, B),
		rhs: cap(A, cB),
		wrong: [cap(cA, B), cup(A, cB), comp(cap(A, B))],
		why: '\\text{Un elemento di } A \\setminus B \\text{ sta in } A \\text{ e non sta in } B\\text{, cioè sta in } A \\text{ e in } \\overline{B}',
	},
];

const exOption = (e: Ex): ChoiceOption => ({ latex: exTex(e), values: [exCode(e)] });

// ---------------------------------------------------------------------------
// Level 2: sets described by a property in ℕ

const PROPS_FINITE = {
	lt: (n: number): Prop => ({ dom: 'N', conds: [range2(null, false, n, true)] }),
	le: (n: number): Prop => ({ dom: 'N', conds: [range2(null, false, n, false)] }),
	div: (n: number): Prop => ({ dom: 'N', conds: [{ t: 'div', n }] }),
};
const DIVISOR_PAIRS: [number, number][] = [
	[6, 12],
	[4, 12],
	[10, 20],
	[6, 18],
	[9, 18],
	[12, 24],
	[8, 24],
	[15, 30],
	[10, 30],
	[4, 20],
];

/** Elements of a property from 0 to `top` (the property may be infinite, like the even numbers). */
function elementsUpTo(p: Prop, top: number): number[] {
	return propElements({ dom: 'N', conds: [...p.conds, range2(null, false, top, false)] });
}

/** Listed elements of a property for the steps: all of them, or those up to `upTo` and then dots. */
function listedTex(p: Prop, upTo: number): string {
	const finite = p.conds.every((c) => c.t === 'div' || (c.t === 'range' && c.hi !== null));
	if (finite) return setTex(propElements(p));
	const xs = propElements({ dom: 'N', conds: [...p.conds, range2(null, false, Math.max(upTo, 1), false)] });
	return `\\{${xs.join(', ')}, \\dots\\}`;
}

// ---------------------------------------------------------------------------
// Word problems (levels 3, 6 and 7)

interface Ctx2 {
	group: string;
	place: string;
	people: string;
	a: string;
	b: string;
	both: string;
	onlyA: string;
	onlyB: string;
	one: string;
	none: string;
	A: string;
	B: string;
}

export const CONTEXTS2: Ctx2[] = [
	{
		group: 'In una classe di',
		place: 'In una classe',
		people: 'studenti',
		a: 'giocano a calcio',
		b: 'fanno nuoto',
		both: 'fanno tutti e due gli sport',
		onlyA: 'giocano a calcio ma non fanno nuoto',
		onlyB: 'fanno nuoto ma non giocano a calcio',
		one: 'fanno un solo sport',
		none: 'non fanno nessuno dei due sport',
		A: 'C',
		B: 'N',
	},
	{
		group: 'In una classe di',
		place: 'In una classe',
		people: 'studenti',
		a: 'suonano uno strumento',
		b: 'cantano nel coro',
		both: 'fanno tutte e due le cose',
		onlyA: 'suonano ma non cantano',
		onlyB: 'cantano ma non suonano',
		one: 'fanno una sola delle due cose',
		none: 'non fanno nessuna delle due cose',
		A: 'S',
		B: 'K',
	},
	{
		group: 'In un gruppo di',
		place: 'In un quartiere',
		people: 'ragazzi',
		a: 'hanno un cane',
		b: 'hanno un gatto',
		both: 'hanno sia un cane sia un gatto',
		onlyA: 'hanno un cane ma non un gatto',
		onlyB: 'hanno un gatto ma non un cane',
		one: 'hanno uno solo dei due animali',
		none: 'non hanno né un cane né un gatto',
		A: 'K',
		B: 'G',
	},
	{
		group: 'In una scuola di lingue con',
		place: 'In una scuola di lingue',
		people: 'iscritti',
		a: 'studiano inglese',
		b: 'studiano tedesco',
		both: 'studiano tutte e due le lingue',
		onlyA: 'studiano inglese ma non tedesco',
		onlyB: 'studiano tedesco ma non inglese',
		one: 'studiano una sola delle due lingue',
		none: 'non studiano nessuna delle due lingue',
		A: 'I',
		B: 'T',
	},
];

interface Ctx3 {
	group: string;
	people: string;
	/** What the members of each set do, as the first sentence says it. */
	sets: [string, string, string];
	/** The verb before the pairs ("fanno calcio e nuoto") and the three nouns. */
	pairVerb: string;
	names: [string, string, string];
	all: string;
	only: [string, string, string];
	one: string;
	two: string;
	none: string;
	letters: [string, string, string];
}

export const CONTEXTS3: Ctx3[] = [
	{
		group: 'In una classe di',
		people: 'studenti',
		sets: ['giocano a calcio', 'fanno nuoto', 'giocano a pallavolo'],
		pairVerb: 'fanno',
		names: ['calcio', 'nuoto', 'pallavolo'],
		all: 'fanno tutti e tre gli sport',
		only: ['fanno solo calcio', 'fanno solo nuoto', 'fanno solo pallavolo'],
		one: 'fanno un solo sport',
		two: 'fanno esattamente due sport',
		none: 'non fanno nessuno dei tre sport',
		letters: ['C', 'N', 'P'],
	},
	{
		group: 'In una scuola di lingue con',
		people: 'iscritti',
		sets: ['studiano inglese', 'studiano francese', 'studiano spagnolo'],
		pairVerb: 'studiano',
		names: ['inglese', 'francese', 'spagnolo'],
		all: 'studiano tutte e tre le lingue',
		only: ['studiano solo inglese', 'studiano solo francese', 'studiano solo spagnolo'],
		one: 'studiano una sola lingua',
		two: 'studiano esattamente due lingue',
		none: 'non studiano nessuna delle tre lingue',
		letters: ['I', 'F', 'S'],
	},
	{
		group: 'In una scuola di musica con',
		people: 'allievi',
		sets: ['suonano la chitarra', 'suonano il pianoforte', 'suonano la batteria'],
		pairVerb: 'suonano',
		names: ['chitarra', 'pianoforte', 'batteria'],
		all: 'suonano tutti e tre gli strumenti',
		only: ['suonano solo la chitarra', 'suonano solo il pianoforte', 'suonano solo la batteria'],
		one: 'suonano un solo strumento',
		two: 'suonano esattamente due strumenti',
		none: 'non suonano nessuno dei tre strumenti',
		letters: ['C', 'P', 'B'],
	},
];

/** The zones of a three-set diagram: only 0, only 1, only 2, exactly 01, 02, 12, all three, none. */
interface Zones3 {
	o: [number, number, number];
	p01: number;
	p02: number;
	p12: number;
	t: number;
	none: number;
}

function data3(z: Zones3) {
	const n0 = z.o[0] + z.p01 + z.p02 + z.t,
		n1 = z.o[1] + z.p01 + z.p12 + z.t,
		n2 = z.o[2] + z.p02 + z.p12 + z.t;
	const i01 = z.p01 + z.t,
		i02 = z.p02 + z.t,
		i12 = z.p12 + z.t;
	const inside = z.o[0] + z.o[1] + z.o[2] + z.p01 + z.p02 + z.p12 + z.t;
	return { n: [n0, n1, n2], i01, i02, i12, total: inside + z.none, inside };
}

export function prose3(c: Ctx3, z: Zones3, question: string): string {
	const d = data3(z);
	const [x, y, w] = c.names;
	return (
		`${c.group} ${d.total} ${c.people}, ${d.n[0]} ${c.sets[0]}, ${d.n[1]} ${c.sets[1]} e ${d.n[2]} ${c.sets[2]}. ` +
		`${d.i01} ${c.pairVerb} ${x} e ${y}, ${d.i02} ${x} e ${w}, ${d.i12} ${y} e ${w}, e ${z.t} ${c.all}. Quanti ${c.people} ${question}?`
	);
}

// ---------------------------------------------------------------------------
// Construction

/** Two listed sets of 1..12 with 1-3 common elements, each with elements of its own. */
function overlapping(rng: Rng): [number[], number[]] {
	const U = range(1, 12);
	const common = pickDistinct(rng, U, rng.int(1, 3));
	const rest = pickDistinct(rng, diff(U, common) as number[], rng.int(3, 6));
	const cut = rng.int(1, rest.length - 1);
	return [norm([...common, ...rest.slice(0, cut)]) as number[], norm([...common, ...rest.slice(cut)]) as number[]];
}

/** Two overlapping sets of at most 6 elements inside {1, ..., n}, leaving something of it outside. */
function inUniverse(rng: Rng, n: number): [number[], number[]] {
	for (;;) {
		const [a, b] = overlapping(rng);
		const ab = union(a, b);
		if (a.length <= 6 && b.length <= 6 && subsetEq(ab, range(1, n)) && ab.length < n) return [a, b];
	}
}

function level1(rng: Rng): Built | null {
	const U = range(1, 12);
	const u = rng.next();
	const kind = u < 0.7 ? 'in comune' : u < 0.85 ? 'disgiunti' : 'incluso';
	let a: number[], b: number[], ab: boolean;
	if (kind === 'in comune') {
		[a, b] = inUniverse(rng, 13);
		ab = rng.int(0, 1) === 1;
	} else if (kind === 'disgiunti') {
		const all = pickDistinct(rng, U, rng.int(6, 9));
		const cut = rng.int(3, all.length - 3);
		a = norm(all.slice(0, cut)) as number[];
		b = norm(all.slice(cut)) as number[];
		ab = rng.int(0, 1) === 1;
	} else {
		const big = norm(pickDistinct(rng, U, rng.int(4, 6))) as number[];
		const small = norm(pickDistinct(rng, big, rng.int(2, big.length - 1))) as number[];
		ab = rng.int(0, 1) === 1;
		[a, b] = ab ? [small, big] : [big, small];
	}
	if ([a, b].some((s) => s.length < 2 || s.length > 6)) return null;
	const [X, Y, xn, yn] = ab ? [a, b, 'A', 'B'] : [b, a, 'B', 'A'];
	const res = diff(X, Y);
	const common = inter(X, Y);
	const name = `${xn} \\setminus ${yn}`;
	const steps = [`\\text{Si parte da } ${xn} \\text{ e si tolgono gli elementi che stanno anche in } ${yn}`];
	if (kind === 'disgiunti') steps.push(`\\text{Nessun elemento di } ${xn} \\text{ sta in } ${yn}\\text{: non si toglie niente, e } ${name} = ${xn}`);
	else if (kind === 'incluso') steps.push(`\\text{Ogni elemento di } ${xn} \\text{ sta anche in } ${yn}\\text{: si tolgono tutti e non resta niente}`);
	else steps.push(`\\text{Si ${verb(common, 'toglie', 'tolgono')} } ${common.join(', ')}\\text{; gli elementi di } ${yn} \\text{ che non stanno in } ${xn} \\text{ non contano}`);
	steps.push(`${name} = ${setTex(res)}`);
	const wrong = res.length ? [diff(Y, X), symDiff(X, Y), common, Y] : [[0], diff(Y, X), X, Y];
	return {
		prompt: 'Scrivi la differenza per elencazione.',
		problem: lines([`A = ${setTex(a)} \\qquad B = ${setTex(b)}`, `${name} = \\ ?`]),
		solution: `${name} = ${setTex(res)}`,
		steps,
		answer: setAnswer(name, res),
		params: { A: strs(a), B: strs(b), asked: ab ? 'A-B' : 'B-A', case: kind, wrong: wrong.map(strs) },
	};
}

function level2(rng: Rng): Built | null {
	const empty = rng.next() < 0.15;
	let X: Prop, Y: Prop;
	if (empty) {
		if (rng.int(0, 1) === 0) {
			const n = rng.int(3, 7);
			X = rng.int(0, 1) ? PROPS_FINITE.lt(n) : PROPS_FINITE.le(n - 1);
			const m = rng.int(n + 2, n + 6);
			Y = rng.int(0, 1) ? PROPS_FINITE.lt(m) : PROPS_FINITE.le(m - 1);
		} else {
			const [d, m] = rng.pick(DIVISOR_PAIRS);
			X = PROPS_FINITE.div(d);
			Y = PROPS_FINITE.div(m);
		}
	} else {
		const xk = rng.pick(['lt', 'le', 'div'] as const);
		X = xk === 'lt' ? PROPS_FINITE.lt(rng.int(7, 13)) : xk === 'le' ? PROPS_FINITE.le(rng.int(6, 12)) : PROPS_FINITE.div(rng.pick([12, 18, 20, 24, 30, 36]));
		const yk = rng.pick(['pari', 'dispari', 'mult', 'mult', 'lt', 'div'] as const);
		Y =
			yk === 'pari'
				? { dom: 'N', conds: [{ t: 'pari' }] }
				: yk === 'dispari'
					? { dom: 'N', conds: [{ t: 'dispari' }] }
					: yk === 'mult'
						? { dom: 'N', conds: [{ t: 'mult', k: rng.pick([3, 4, 5]) }] }
						: yk === 'lt'
							? PROPS_FINITE.lt(rng.int(3, 8))
							: PROPS_FINITE.div(rng.pick([6, 8, 10, 12, 15, 16, 20]));
	}
	const xs = propElements(X);
	const ys = elementsUpTo(Y, Math.max(...xs, 0));
	const res = diff(xs, ys) as number[];
	const common = inter(xs, ys) as number[];
	if (empty !== (res.length === 0)) return null;
	if (!empty && (common.length === 0 || res.length > 9 || res.length < 2)) return null;
	const ab = rng.int(0, 1) === 1; // the finite set is A (asked A \ B) or B (asked B \ A)
	const [xn, yn] = ab ? ['A', 'B'] : ['B', 'A'];
	const [pa, pb] = ab ? [X, Y] : [Y, X];
	const name = `${xn} \\setminus ${yn}`;
	const top = Math.max(...xs);
	// the mistakes: 0 forgotten (or kept although it is in Y), the last element of x < n kept, the common part
	const wrong: El[][] = [common];
	if (xs.includes(0)) wrong.push(res.includes(0) ? res.filter((v) => v !== 0) : norm([0, ...res]));
	const c0 = X.conds[0];
	if (c0.t === 'range' && c0.hi !== null) {
		const edge = c0.hiStrict ? c0.hi : c0.hi + 1;
		if (!ys.includes(edge)) wrong.push(norm([...res, edge]));
	}
	if (res.length > 1) wrong.push(res.slice(0, -1));
	return {
		prompt: 'Scrivi la differenza per elencazione.',
		problem: lines([`A = ${propTex(pa)} \\qquad B = ${propTex(pb)}`, `${name} = \\ ?`]),
		solution: `${name} = ${setTex(res)}`,
		steps: [
			`\\text{Per elencazione, ricordando che } 0 \\in \\mathbb{N}\\text{: } ${xn} = ${setTex(xs)}\\text{, } ${yn} = ${listedTex(Y, top)}`,
			res.length
				? `\\text{Da } ${xn} \\text{ si ${verb(common, 'toglie', 'tolgono')} } ${common.join(', ')}\\text{, che ${verb(common, 'sta', 'stanno')} anche in } ${yn}`
				: `\\text{Ogni elemento di } ${xn} \\text{ sta in } ${yn}\\text{: } ${xn} \\subseteq ${yn} \\text{ e non resta niente}`,
			`${name} = ${setTex(res)}`,
		],
		answer: setAnswer(name, res),
		params: { A: propJSON(pa), B: propJSON(pb), asked: ab ? 'A-B' : 'B-A', case: empty ? 'vuota' : 'non vuota', wrong: wrong.map(strs) },
	};
}

function level3(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.35) {
		const a = rng.int(6, 30),
			b = rng.int(6, 30);
		const i = rng.int(1, Math.min(a, b) - 1);
		const ab = rng.int(0, 1) === 1;
		const [x, y, xn, yn] = ab ? [a, b, 'A', 'B'] : [b, a, 'B', 'A'];
		const value = x - i;
		if ([a, b, i].includes(value)) return null;
		return {
			prompt: 'Calcola il numero di elementi della differenza.',
			problem: lines([`|A| = ${a} \\qquad |B| = ${b} \\qquad |A \\cap B| = ${i}`, `|${xn} \\setminus ${yn}| = \\ ?`]),
			solution: `|${xn} \\setminus ${yn}| = ${value}`,
			steps: [
				`\\text{Gli elementi di } ${xn} \\text{ o stanno anche in } ${yn} \\text{ o no: } |${xn}| = |${xn} \\setminus ${yn}| + |A \\cap B|`,
				`|${xn} \\setminus ${yn}| = |${xn}| - |A \\cap B| = ${x} - ${i} = ${value}`,
				`\\text{Non si toglie } |${yn}|\\text{: in } ${yn} \\text{ ci sono anche elementi che non stanno in } ${xn}`,
			],
			answer: numAnswer(value),
			params: { variant: 'formula', a: String(a), b: String(b), i: String(i), asked: ab ? 'A-B' : 'B-A', mistakes: strs([x - y, y - i, a + b - i]) },
		};
	}
	if (u < 0.6) {
		const n = rng.int(15, 40);
		const a = rng.int(3, n - 3);
		if (2 * a === n) return null;
		return {
			prompt: 'Calcola il numero di elementi del complementare.',
			problem: lines([`|U| = ${n} \\qquad |A| = ${a}`, '|\\overline{A}| = \\ ?']),
			solution: `|\\overline{A}| = ${n - a}`,
			steps: [
				'\\text{Il complementare è } U \\setminus A\\text{, e } A \\text{ è contenuto in } U',
				`|\\overline{A}| = |U| - |A| = ${n} - ${a} = ${n - a}`,
			],
			answer: numAnswer(n - a),
			params: { variant: 'complementare', u: String(n), a: String(a), mistakes: strs([a, n + a, n - a - 1]) },
		};
	}
	const c = rng.pick(CONTEXTS2);
	const both = rng.int(2, 9);
	const a = both + rng.int(2, 14),
		b = both + rng.int(2, 14);
	const which = rng.int(0, 1) === 0 ? 'A' : 'B';
	const [x, y, X, Y] = which === 'A' ? [a, b, c.A, c.B] : [b, a, c.B, c.A];
	const value = x - both;
	if (value < 2 || [a, b, both].includes(value)) return null;
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${c.place} ${a} ${c.people} ${c.a}, ${b} ${c.b} e ${both} ${c.both}. Quanti ${c.people} ${which === 'A' ? c.onlyA : c.onlyB}?`),
		solution: `\\text{${value} ${c.people}}`,
		steps: [
			`${c.A} = \\text{quelli che ${c.a}}\\text{, } ${c.B} = \\text{quelli che ${c.b}}`,
			`\\text{Si cercano gli elementi di } ${X} \\setminus ${Y}\\text{, e chi fa tutte e due le cose sta in } ${c.A} \\cap ${c.B}`,
			`|${X} \\setminus ${Y}| = |${X}| - |${c.A} \\cap ${c.B}| = ${x} - ${both} = ${value}`,
		],
		answer: numAnswer(value),
		params: {
			variant: 'problema',
			context: String(CONTEXTS2.indexOf(c)),
			which,
			a: String(a),
			b: String(b),
			both: String(both),
			mistakes: strs([x - y, y - both, a + b - both].filter((m) => m >= 0)),
		},
	};
}

function level4(rng: Rng): Built | null {
	const n = rng.int(8, 12);
	const U = range(1, n);
	if (rng.next() < 0.55) {
		const a = norm(pickDistinct(rng, U, rng.int(2, n - 4))) as number[];
		const res = diff(U, a);
		const top = Math.max(...a);
		// the complement in a universe that stops at the largest element of A (the universe not looked at)
		const wrong = [a, diff(range(1, top), a), res.slice(1), res.slice(0, -1), U];
		return {
			prompt: 'Scrivi il complementare per elencazione.',
			problem: lines([`U = ${setTex(U)}`, `A = ${setTex(a)}`, '\\overline{A} = \\ ?']),
			solution: `\\overline{A} = ${setTex(res)}`,
			steps: [
				`\\text{Il complementare dipende dall'universo: si prendono gli elementi di } U \\text{ che non stanno in } A`,
				`\\overline{A} = U \\setminus A = ${setTex(res)}`,
				`\\text{Controllo: } |\\overline{A}| = |U| - |A| = ${n} - ${a.length} = ${res.length}`,
			],
			answer: setAnswer('\\overline{A}', res),
			params: { variant: 'complementare', U: strs(U), A: strs(a), case: 'complementare', wrong: wrong.map(strs) },
		};
	}
	const [a, b] = inUniverse(rng, n);
	const cb = diff(U, b);
	const res = inter(a, cb);
	if (!subsetEq(union(a, b), U) || res.length === 0) return null;
	const wrong = [cb, diff(b, a), inter(a, b), diff(U, inter(a, b))];
	return {
		prompt: "Calcola l'intersezione per elencazione.",
		problem: lines([`U = ${setTex(U)}`, `A = ${setTex(a)} \\qquad B = ${setTex(b)}`, 'A \\cap \\overline{B} = \\ ?']),
		solution: `A \\cap \\overline{B} = ${setTex(res)}`,
		steps: [
			`\\text{Prima il complementare di } B\\text{: } \\overline{B} = ${setTex(cb)}`,
			`\\text{Poi gli elementi comuni ad } A \\text{ e } \\overline{B}\\text{: } A \\cap \\overline{B} = ${setTex(res)}`,
			`\\text{È la differenza } A \\setminus B\\text{: da } A \\text{ si tolgono gli elementi che stanno in } B`,
		],
		answer: setAnswer('A \\cap \\overline{B}', res),
		params: { variant: 'intersezione', U: strs(U), A: strs(a), B: strs(b), case: 'intersezione', wrong: wrong.map(strs) },
	};
}

function level5(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.3) {
		const id = rng.pick(IDENTITIES);
		const ch = assembleChoice(rng, exOption(id.rhs), shuffle(rng, id.wrong).map(exOption));
		if (!ch) return null;
		const lhs = exTex(id.lhs);
		return {
			prompt: 'Quale espressione è uguale a questa, qualunque siano gli insiemi A e B?',
			problem: `${lhs} = \\ ?`,
			solution: `${lhs} = ${exTex(id.rhs)}`,
			steps: [id.why, `${lhs} = ${exTex(id.rhs)}`],
			answer: ch,
			params: { variant: 'identità', case: 'identità', lhs: exCode(id.lhs), rhs: exCode(id.rhs) },
		};
	}
	const n = rng.int(8, 12);
	const U = range(1, n);
	const [a, b] = inUniverse(rng, n);
	const sets: Record<string, El[]> = { U, A: a, B: b };
	const isUnion = u < 0.65;
	const ex = isUnion ? comp(cup(A, B)) : comp(cap(A, B));
	const law = isUnion ? cap(cA, cB) : cup(cA, cB);
	const inner = isUnion ? cup(A, B) : cap(A, B);
	const wrongEx = isUnion ? [cup(cA, cB), inner, cap(cA, B)] : [cap(cA, cB), inner, cup(cA, B)];
	const res = exEval(ex, sets);
	const name = exTex(ex);
	return {
		prompt: 'Calcola e scrivi il risultato per elencazione.',
		problem: lines([`U = ${setTex(U)}`, `A = ${setTex(a)} \\qquad B = ${setTex(b)}`, `${name} = \\ ?`]),
		solution: `${name} = ${setTex(res)}`,
		steps: [
			`\\text{Prima quello che sta sotto la sbarra: } ${exTex(inner)} = ${setTex(exEval(inner, sets))}`,
			`\\text{Poi gli elementi di } U \\text{ che restano fuori: } ${name} = ${setTex(res)}`,
			`\\text{Controllo con De Morgan: } \\overline{A} = ${setTex(exEval(cA, sets))}\\text{, } \\overline{B} = ${setTex(exEval(cB, sets))}\\text{, } ${exTex(law)} = ${setTex(exEval(law, sets))}`,
		],
		answer: setAnswer(name, res),
		params: {
			variant: isUnion ? 'unione' : 'intersezione',
			case: isUnion ? 'unione' : 'intersezione',
			U: strs(U),
			A: strs(a),
			B: strs(b),
			wrong: wrongEx.map((w) => strs(exEval(w, sets))),
		},
	};
}

function level6(rng: Rng): Built | null {
	const c = rng.pick(CONTEXTS2);
	const both = rng.int(2, 9);
	const a = both + rng.int(2, 14),
		b = both + rng.int(2, 14);
	const none = rng.int(2, 8);
	const union2 = a + b - both;
	const total = union2 + none;
	const u = rng.next();
	const variant = u < 0.25 ? 'solo' : u < 0.45 ? 'uno solo' : u < 0.65 ? 'nessuno' : u < 0.85 ? 'entrambi' : 'solo con nessuno';
	const which = rng.int(0, 1) === 0 ? 'A' : 'B';
	const [x, y, X, Y] = which === 'A' ? [a, b, c.A, c.B] : [b, a, c.B, c.A];
	const onlyQ = which === 'A' ? c.onlyA : c.onlyB;
	const backwards = variant === 'entrambi' || variant === 'solo con nessuno';
	let question: string, value: number, mistakes: number[];
	switch (variant) {
		case 'solo':
			question = onlyQ;
			value = x - both;
			mistakes = [x, x - y, y - both];
			break;
		case 'uno solo':
			question = c.one;
			value = a + b - 2 * both;
			mistakes = [union2, a + b, total - both];
			break;
		case 'nessuno':
			question = c.none;
			value = none;
			mistakes = [total - a - b, union2, total - (a + b - 2 * both)];
			break;
		case 'entrambi':
			question = c.both;
			value = both;
			mistakes = [a + b - total, both + none, none];
			break;
		default:
			question = onlyQ;
			value = x - both;
			mistakes = [total - y, x - both - none, x];
	}
	const given = backwards ? [total, a, b, none] : [total, a, b, both];
	if (value < 2 || given.includes(value) || total > 60) return null;
	const prose = backwards
		? `${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${none} ${c.none}. Quanti ${c.people} ${question}?`
		: `${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${both} ${c.both}. Quanti ${c.people} ${question}?`;
	const steps = [`${c.A} = \\text{quelli che ${c.a}}\\text{, } ${c.B} = \\text{quelli che ${c.b}}`];
	if (backwards) {
		steps.push(
			`\\text{Chi non fa nessuna delle due cose sta in } \\overline{${c.A} \\cup ${c.B}}\\text{, gli altri nell'unione: } |${c.A} \\cup ${c.B}| = ${total} - ${none} = ${union2}`,
			`${union2} = ${a} + ${b} - |${c.A} \\cap ${c.B}|\\text{, quindi } |${c.A} \\cap ${c.B}| = ${a + b} - ${union2} = ${both}`,
		);
		if (variant === 'solo con nessuno') steps.push(`|${X} \\setminus ${Y}| = ${x} - ${both} = ${value}`);
	} else {
		steps.push(
			`\\text{Si parte dalla zona comune: } |${c.A} \\cap ${c.B}| = ${both}`,
			`\\text{solo } ${c.A}\\text{, cioè } ${c.A} \\setminus ${c.B}\\text{: } ${a} - ${both} = ${a - both}\\text{; solo } ${c.B}\\text{, cioè } ${c.B} \\setminus ${c.A}\\text{: } ${b} - ${both} = ${b - both}`,
			`\\text{nessuno dei due, cioè } \\overline{${c.A} \\cup ${c.B}}\\text{: } ${total} - (${a - both} + ${both} + ${b - both}) = ${none}`,
		);
		if (variant === 'uno solo') steps.push(`\\text{Una sola delle due cose: } ${a - both} + ${b - both} = ${value}`);
	}
	steps.push(`\\text{Controllo: } ${a - both} + ${both} + ${b - both} + ${none} = ${total}`);
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(prose),
		solution: `\\text{${value} ${c.people}}`,
		steps,
		answer: numAnswer(value),
		params: {
			variant,
			context: String(CONTEXTS2.indexOf(c)),
			which,
			total: String(total),
			a: String(a),
			b: String(b),
			both: String(both),
			none: String(none),
			mistakes: strs(mistakes.filter((m) => m >= 0)),
		},
	};
}

/** The question is drawn once, then the numbers until they fit, so the shares of the questions stay as drawn. */
function level7(rng: Rng): Built | null {
	const u = rng.next();
	for (let i = 0; i < 200; i++) {
		const b = level7Numbers(rng, u);
		if (b) return b;
	}
	return null;
}

function level7Numbers(rng: Rng, u: number): Built | null {
	const c = rng.pick(CONTEXTS3);
	const z: Zones3 = {
		o: [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12)],
		p01: rng.int(1, 5),
		p02: rng.int(1, 5),
		p12: rng.int(1, 5),
		t: rng.int(2, 4),
		none: rng.int(2, 8),
	};
	const d = data3(z);
	if (d.total > 70) return null;
	const variant = u < 0.3 ? 'un solo' : u < 0.55 ? 'solo' : u < 0.75 ? 'esattamente due' : 'nessuno';
	const k = rng.int(0, 2);
	const L = c.letters;
	const pairs: [number, number, number][] = [
		[0, 1, d.i01],
		[0, 2, d.i02],
		[1, 2, d.i12],
	];
	const exact = [z.p01, z.p02, z.p12];
	const ones = z.o[0] + z.o[1] + z.o[2];
	let question: string, value: number, mistakes: number[];
	switch (variant) {
		case 'un solo':
			question = c.one;
			value = ones;
			mistakes = [ones - 3 * z.t, d.inside, d.n[0] + d.n[1] + d.n[2] - d.i01 - d.i02 - d.i12];
			break;
		case 'solo': {
			question = c.only[k];
			value = z.o[k];
			const mine = pairs.filter(([p, q]) => p === k || q === k).map(([, , v]) => v);
			mistakes = [d.n[k] - mine[0] - mine[1], d.n[k] - mine[0], d.n[k] - z.t];
			break;
		}
		case 'esattamente due':
			question = c.two;
			value = z.p01 + z.p02 + z.p12;
			mistakes = [d.i01 + d.i02 + d.i12, value + z.t, d.i01 + d.i02 + d.i12 - z.t];
			break;
		default:
			question = c.none;
			value = z.none;
			mistakes = [d.total - (d.n[0] + d.n[1] + d.n[2] - d.i01 - d.i02 - d.i12), d.total - ones, d.inside];
	}
	const given = [d.total, ...d.n, d.i01, d.i02, d.i12, z.t];
	if (value < 2 || given.includes(value)) return null;
	const zoneName = (p: number, q: number) => `${L[p]} \\cap ${L[q]}`;
	const steps = [
		`${L[0]}\\text{, } ${L[1]}\\text{, } ${L[2]} \\text{ sono i tre insiemi; si parte dal centro: } |${L[0]} \\cap ${L[1]} \\cap ${L[2]}| = ${z.t}`,
		`\\text{Esattamente due insiemi: } ${pairs.map(([p, q, v], j) => `${zoneName(p, q)}\\text{: } ${v} - ${z.t} = ${exact[j]}`).join('\\text{; } ')}`,
		`\\text{Un solo insieme: } ${[0, 1, 2]
			.map((j) => {
				const mine = pairs.map(([p, q], m) => (p === j || q === j ? exact[m] : null)).filter((v): v is number => v !== null);
				return `${L[j]}\\text{: } ${d.n[j]} - ${mine[0]} - ${mine[1]} - ${z.t} = ${z.o[j]}`;
			})
			.join('\\text{; } ')}`,
		`\\text{Dentro i cerchi: } ${ones} + ${z.p01 + z.p02 + z.p12} + ${z.t} = ${d.inside}\\text{; nessuno: } ${d.total} - ${d.inside} = ${z.none}`,
		variant === 'un solo'
			? `\\text{Un solo insieme: } ${z.o.join(' + ')} = ${value}`
			: variant === 'esattamente due'
				? `\\text{Esattamente due insiemi: } ${exact.join(' + ')} = ${value}`
				: variant === 'solo'
					? `\\text{Solo } ${L[k]}\\text{: } ${value}`
					: `\\text{Nessuno dei tre: } ${value}`,
	];
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(prose3(c, z, question)),
		solution: `\\text{${value} ${c.people}}`,
		steps,
		answer: numAnswer(value),
		params: {
			variant,
			context: String(CONTEXTS3.indexOf(c)),
			which: String(k),
			only: strs(z.o),
			p01: String(z.p01),
			p02: String(z.p02),
			p12: String(z.p12),
			t: String(z.t),
			none: String(z.none),
			mistakes: strs(mistakes.filter((m) => m >= 0)),
		},
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng);
		case 7:
			return level7(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Check and choice

/** The answer recomputed from params: a set, a count, or the code of the right expression. */
function truthOf(sample: Sample): El[] | number | string {
	const p = sample.params;
	switch (sample.level) {
		case 1: {
			const [X, Y] = p.asked === 'A-B' ? [nums(p.A), nums(p.B)] : [nums(p.B), nums(p.A)];
			return diff(X, Y);
		}
		case 2: {
			const [X, Y] = p.asked === 'A-B' ? [propFromJSON(p.A), propFromJSON(p.B)] : [propFromJSON(p.B), propFromJSON(p.A)];
			const xs = propElements(X);
			return diff(xs, elementsUpTo(Y, Math.max(...xs, 0)));
		}
		case 3:
			if (p.variant === 'formula') return Number(p.asked === 'A-B' ? p.a : p.b) - Number(p.i);
			if (p.variant === 'complementare') return Number(p.u) - Number(p.a);
			return Number(p.which === 'A' ? p.a : p.b) - Number(p.both);
		case 4:
			return p.variant === 'complementare' ? diff(nums(p.U), nums(p.A)) : inter(nums(p.A), diff(nums(p.U), nums(p.B)));
		case 5: {
			if (p.variant === 'identità') return p.rhs as string;
			const sets = { U: nums(p.U), A: nums(p.A), B: nums(p.B) };
			return exEval(p.variant === 'unione' ? comp(cup(A, B)) : comp(cap(A, B)), sets);
		}
		case 6: {
			const x = Number(p.which === 'A' ? p.a : p.b);
			const both = Number(p.a) + Number(p.b) - (Number(p.total) - Number(p.none));
			return p.variant === 'uno solo' ? Number(p.a) + Number(p.b) - 2 * both : p.variant === 'nessuno' ? Number(p.none) : p.variant === 'entrambi' ? both : x - both;
		}
		case 7: {
			const o = nums(p.only);
			if (p.variant === 'un solo') return o[0] + o[1] + o[2];
			if (p.variant === 'solo') return o[Number(p.which)];
			if (p.variant === 'esattamente due') return Number(p.p01) + Number(p.p02) + Number(p.p12);
			return Number(p.none);
		}
		default:
			throw new Error(`${ID}: unknown level ${sample.level}`);
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const truth = truthOf(sample);
	const a = sample.answer;
	const p = sample.params;
	if (typeof truth === 'string') {
		if (a.kind !== 'choice' || a.options[a.correct]?.values[0] !== truth) v.push('opzione giusta sbagliata');
		else if (new Set(a.options.map((o) => o.values[0])).size !== 4) v.push('opzioni ripetute');
	} else if (typeof truth === 'number') {
		if (a.kind !== 'number' || Number(a.value) !== truth) v.push('conteggio sbagliato');
		if (truth < (sample.level >= 6 || p.variant === 'problema' ? 2 : 1)) v.push('conteggio troppo piccolo');
	} else if (a.kind !== 'set' || !sameSet(a.values.map(Number), truth)) v.push('insieme sbagliato');
	if (sample.level === 6) {
		const total = Number(p.total),
			x = Number(p.a),
			y = Number(p.b),
			both = Number(p.both),
			none = Number(p.none);
		if (x + y - both + none !== total || both > Math.min(x, y) - 2 || both < 2 || none < 2 || total > 60) v.push('numeri del problema incoerenti');
	}
	if (sample.level === 7) {
		const o = nums(p.only);
		const t = Number(p.t);
		if (o.some((z) => z < 2) || t < 2 || Number(p.none) < 2) v.push('zone troppo piccole');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	if (a.kind === 'number') return numberChoice(rng, Number(a.value), ((sample.params.mistakes ?? []) as string[]).map(Number));
	if (a.kind !== 'set') throw new Error(`${ID}: no choice for ${a.kind}`);
	const truth = a.values.map(Number);
	const wrong = ((sample.params.wrong ?? []) as string[][]).map((w) => w.map(Number));
	// last resort: one element dropped, or one element of the problem added
	const pool = sample.level === 2 ? range(0, 12) : [...nums(sample.params.U ?? []), ...nums(Array.isArray(sample.params.A) ? sample.params.A : []), ...nums(Array.isArray(sample.params.B) ? sample.params.B : [])];
	const fallback = shuffle(rng, [...truth.map((x) => truth.filter((y) => y !== x)), ...diff(pool, truth).map((x) => norm([...truth, x]) as number[])]);
	const ch = assembleChoice(rng, setOption(truth), [...wrong, ...fallback].map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return fitSetChoice(ch);
}

export const insiemiDifferenza: Generator = {
	id: ID,
	title: 'Differenza e complementare',
	levels: {
		1: { label: 'Differenza di due insiemi elencati', constraints: ['numeri da 1 a 12, insiemi di 2-6 elementi', 'A \\ B oppure B \\ A; circa 15% disgiunti, 15% con risultato vuoto'] },
		2: { label: 'Differenza di insiemi descritti da una proprietà', constraints: ['in ℕ, con 0 ∈ ℕ', 'il primo insieme è finito; circa 15% con risultato vuoto'] },
		3: { label: 'Quanti elementi ha la differenza', constraints: ['|A \\ B| = |A| − |A ∩ B|', '|Ā| = |U| − |A|', 'problema a parole senza totale'] },
		4: { label: 'Complementare e A ∩ B̄', constraints: ['U = {1, …, n} con n da 8 a 12', 'A ∩ B̄ come A \\ B'] },
		5: { label: 'Leggi di De Morgan', constraints: ['complementare di A ∪ B o di A ∩ B in U', 'circa 30%: quale espressione è uguale per tutti gli insiemi'] },
		6: { label: 'Problemi con due insiemi', constraints: ['solo uno, uno solo, nessuno', 'al contrario: da "nessuno" a "tutti e due"'] },
		7: { label: 'Problemi con tre insiemi', constraints: ['le otto zone dal centro verso l’esterno', 'un solo, solo uno, esattamente due, nessuno'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default insiemiDifferenza;
