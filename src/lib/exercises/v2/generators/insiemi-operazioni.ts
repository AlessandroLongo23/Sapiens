/**
 * Operazioni tra insiemi. Spec: specs/exercises/insiemi-operazioni.md
 *
 * The lesson is now titled "Proprietà delle operazioni tra insiemi" and still covers every
 * operation. Six levels in its order: intersection, difference (A \ B against B \ A), complement
 * in a universe, Cartesian product (pairs, or how many), expressions with parentheses and De
 * Morgan's laws, problems with the Euler-Venn diagram (only one set, exactly one, neither).
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import { type El, assembleChoice, diff, fitSetChoice, inter, lines, listTex, norm, numberChoice, pickDistinct, range, sameSet, setOption, setTex, shuffle, subsetEq, textBlock, union } from '../insiemi';

export const ID = 'insiemi-operazioni';

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

// ---------------------------------------------------------------------------
// Expressions (level 5)

export type Ex = { t: 'set'; name: string } | { t: 'bin'; op: 'cup' | 'cap' | 'minus'; l: Ex; r: Ex } | { t: 'comp'; x: Ex };

const S = (name: string): Ex => ({ t: 'set', name });
const cup = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'cup', l, r });
const cap = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'cap', l, r });
const minus = (l: Ex, r: Ex): Ex => ({ t: 'bin', op: 'minus', l, r });
const comp = (x: Ex): Ex => ({ t: 'comp', x });
const A = S('A'),
	B = S('B'),
	C = S('C');

const OP_TEX = { cup: '\\cup', cap: '\\cap', minus: '\\setminus' };

export function exTex(e: Ex): string {
	if (e.t === 'set') return e.name;
	if (e.t === 'comp') return `\\overline{${exTex(e.x)}}`;
	const wrap = (x: Ex) => (x.t === 'bin' ? `(${exTex(x)})` : exTex(x));
	return `${wrap(e.l)} ${OP_TEX[e.op]} ${wrap(e.r)}`;
}

function exEval(e: Ex, sets: Record<string, El[]>): El[] {
	if (e.t === 'set') return sets[e.name];
	if (e.t === 'comp') return diff(sets.U, exEval(e.x, sets));
	const l = exEval(e.l, sets),
		r = exEval(e.r, sets);
	return e.op === 'cup' ? union(l, r) : e.op === 'cap' ? inter(l, r) : diff(l, r);
}

/** One step per operation, innermost first: "B \ C = {3, 5}". */
function exSteps(e: Ex, sets: Record<string, El[]>, out: string[] = []): string[] {
	if (e.t === 'set') return out;
	if (e.t === 'comp') exSteps(e.x, sets, out);
	else {
		exSteps(e.l, sets, out);
		exSteps(e.r, sets, out);
	}
	out.push(`${exTex(e)} = ${setTex(exEval(e, sets))}`);
	return out;
}

/** Expression templates: the expression, then the wrong ones a student computes instead. */
const TEMPLATES: { ex: Ex; wrong: Ex[]; universe: boolean }[] = [
	{ ex: minus(minus(A, B), C), wrong: [minus(A, minus(B, C)), minus(A, B), minus(A, C)], universe: false },
	{ ex: minus(A, minus(B, C)), wrong: [minus(minus(A, B), C), minus(A, B), minus(A, C)], universe: false },
	{ ex: cap(A, cup(B, C)), wrong: [cup(cap(A, B), C), cap(A, B), cap(A, C)], universe: false },
	{ ex: cup(A, cap(B, C)), wrong: [cap(cup(A, B), C), cap(B, C), cup(A, B)], universe: false },
	{ ex: minus(cup(A, B), C), wrong: [cup(A, minus(B, C)), minus(A, C), cup(minus(A, C), B)], universe: false },
	{ ex: comp(cup(A, B)), wrong: [cup(comp(A), comp(B)), cup(A, B), cap(comp(A), B)], universe: true },
	{ ex: comp(cap(A, B)), wrong: [cap(comp(A), comp(B)), cap(A, B), cup(comp(A), B)], universe: true },
	{ ex: cap(comp(A), B), wrong: [cap(A, comp(B)), comp(cap(A, B)), minus(A, B)], universe: true },
];

// ---------------------------------------------------------------------------
// Cartesian product (level 4)

type Pair = [El, El];
/** "1:a" for the pair (1, a); "~1:a" for the set {1, a} written by mistake. */
const pairKey = (p: Pair, braces = false) => `${braces ? '~' : ''}${p[0]}:${p[1]}`;
const pairTex = (p: Pair, braces = false) => (braces ? `\\{${p[0]}, ${p[1]}\\}` : `(${p[0]}, ${p[1]})`);
const product = (X: El[], Y: El[]): Pair[] => X.flatMap((x) => Y.map((y) => [x, y] as Pair));
/** The pairs on one line, for the solution and the steps. */
const pairsTex = (ps: Pair[]) => listTex(ps.map((p) => pairTex(p)));
/** Six pairs are 294-337 px wide at 16 px, over the 252 px of an answer button: more than four go on two lines. */
const pairsOption = (ps: Pair[], braces = false): ChoiceOption => ({
	latex: ps.length
		? listTex(
				ps.map((p) => pairTex(p, braces)),
				ps.length > 4,
			)
		: '\\emptyset',
	values: ps.map((p) => pairKey(p, braces)),
});

// ---------------------------------------------------------------------------
// Word problems (level 6)

interface Ctx {
	group: string;
	people: string;
	a: string;
	b: string;
	both: string;
	onlyA: string;
	onlyB: string;
	exactlyOne: string;
	none: string;
	A: string;
	B: string;
}

export const CONTEXTS: Ctx[] = [
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'giocano a calcio',
		b: 'fanno nuoto',
		both: 'fanno tutti e due gli sport',
		onlyA: 'giocano solo a calcio',
		onlyB: 'fanno solo nuoto',
		exactlyOne: 'fanno uno solo dei due sport',
		none: 'non fanno nessuno dei due sport',
		A: 'C',
		B: 'N',
	},
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'studiano francese',
		b: 'studiano tedesco',
		both: 'studiano tutte e due le lingue',
		onlyA: 'studiano solo francese',
		onlyB: 'studiano solo tedesco',
		exactlyOne: 'studiano una sola delle due lingue',
		none: 'non studiano nessuna delle due lingue',
		A: 'F',
		B: 'T',
	},
	{
		group: 'In un gruppo di',
		people: 'ragazzi',
		a: 'leggono fumetti',
		b: 'guardano serie TV',
		both: 'fanno tutte e due le cose',
		onlyA: 'leggono solo fumetti',
		onlyB: 'guardano solo serie TV',
		exactlyOne: 'fanno una sola delle due cose',
		none: 'non fanno nessuna delle due cose',
		A: 'F',
		B: 'S',
	},
	{
		group: 'In una palestra con',
		people: 'iscritti',
		a: 'fanno yoga',
		b: 'fanno pesi',
		both: 'fanno tutte e due le attività',
		onlyA: 'fanno solo yoga',
		onlyB: 'fanno solo pesi',
		exactlyOne: 'fanno una sola delle due attività',
		none: 'non fanno nessuna delle due attività',
		A: 'Y',
		B: 'P',
	},
];

// ---------------------------------------------------------------------------
// Construction

function twoSets(rng: Rng, U: number[], disjoint: boolean): [number[], number[]] {
	if (disjoint) {
		const all = pickDistinct(rng, U, rng.int(5, 8));
		const cut = rng.int(2, all.length - 2);
		return [norm(all.slice(0, cut)) as number[], norm(all.slice(cut)) as number[]];
	}
	const small = U.length <= 8;
	const common = pickDistinct(rng, U, rng.int(1, small ? 2 : 3));
	const rest = pickDistinct(rng, diff(U, common) as number[], rng.int(2, small ? 4 : 6));
	const cut = rng.int(1, rest.length - 1);
	return [norm([...common, ...rest.slice(0, cut)]) as number[], norm([...common, ...rest.slice(cut)]) as number[]];
}

function build(rng: Rng, level: number): Built | null {
	const U12 = range(1, 12);
	switch (level) {
		case 1: {
			const disjoint = rng.next() < 0.15;
			const [a, b] = twoSets(rng, U12, disjoint);
			const res = inter(a, b);
			return {
				prompt: "Scrivi l'intersezione per elencazione.",
				problem: lines([`A = ${setTex(a)} \\qquad B = ${setTex(b)}`, 'A \\cap B = \\ ?']),
				solution: `A \\cap B = ${setTex(res)}`,
				steps: [
					`\\text{Si prendono gli elementi che stanno sia in } A \\text{ sia in } B`,
					res.length
						? `${res.join(', ')} \\text{ ${res.length === 1 ? 'sta' : 'stanno'} in tutti e due}`
						: '\\text{Nessun elemento sta in tutti e due: gli insiemi sono disgiunti}',
					`A \\cap B = ${setTex(res)}`,
				],
				answer: setAnswer('A \\cap B', res),
				params: { A: strs(a), B: strs(b), case: disjoint ? 'disgiunti' : 'in comune', wrong: [union(a, b), diff(a, b), diff(b, a)].map(strs) },
			};
		}
		case 2: {
			const u = rng.next();
			const kind = u < 0.75 ? 'in comune' : u < 0.87 ? 'disgiunti' : 'incluso';
			let a: number[], b: number[];
			if (kind === 'incluso') {
				b = norm(pickDistinct(rng, U12, rng.int(4, 6))) as number[];
				a = norm(pickDistinct(rng, b, rng.int(2, b.length - 1))) as number[];
			} else [a, b] = twoSets(rng, U12, kind === 'disgiunti');
			const ab = rng.int(0, 1) === 1; // A \ B or B \ A
			const [X, Y, xn, yn] = ab ? [a, b, 'A', 'B'] : [b, a, 'B', 'A'];
			const res = diff(X, Y);
			const common = inter(X, Y);
			const name = `${xn} \\setminus ${yn}`;
			return {
				prompt: 'Scrivi la differenza per elencazione.',
				problem: lines([`A = ${setTex(a)} \\qquad B = ${setTex(b)}`, `${name} = \\ ?`]),
				solution: `${name} = ${setTex(res)}`,
				steps: [
					`\\text{Si parte da } ${xn} \\text{ e si tolgono gli elementi che stanno anche in } ${yn}`,
					common.length ? `\\text{Si tolgono } ${common.join(', ')}` : `\\text{Nessun elemento di } ${xn} \\text{ sta in } ${yn}\\text{: non si toglie niente}`,
					`${name} = ${setTex(res)}`,
				],
				answer: setAnswer(name, res),
				params: { A: strs(a), B: strs(b), asked: ab ? 'A-B' : 'B-A', case: kind, wrong: [diff(Y, X), inter(a, b), Y, union(a, b)].map(strs) },
			};
		}
		case 3: {
			const n = rng.int(8, 12);
			const U = range(1, n);
			const twoAsked = rng.next() < 0.3;
			const a = norm(pickDistinct(rng, U, rng.int(2, n - 3))) as number[];
			if (!twoAsked) {
				const res = diff(U, a);
				return {
					prompt: 'Scrivi il complementare per elencazione.',
					problem: lines([`U = ${setTex(U)}`, `A = ${setTex(a)}`, '\\overline{A} = \\ ?']),
					solution: `\\overline{A} = ${setTex(res)}`,
					steps: ['\\text{Si prendono gli elementi di } U \\text{ che non stanno in } A', `\\overline{A} = U \\setminus A = ${setTex(res)}`],
					answer: setAnswer('\\overline{A}', res),
					params: { U: strs(U), A: strs(a), asked: 'A', wrong: [a, res.slice(0, -1), diff(range(1, n - 1), a), U].map(strs) },
				};
			}
			const b = norm(pickDistinct(rng, U, rng.int(2, n - 3))) as number[];
			if (sameSet(a, b)) return null;
			const res = diff(U, b);
			return {
				prompt: 'Scrivi il complementare per elencazione.',
				problem: lines([`U = ${setTex(U)}`, `A = ${setTex(a)} \\qquad B = ${setTex(b)}`, '\\overline{B} = \\ ?']),
				solution: `\\overline{B} = ${setTex(res)}`,
				steps: ['\\text{Si prendono gli elementi di } U \\text{ che non stanno in } B', `\\overline{B} = U \\setminus B = ${setTex(res)}`],
				answer: setAnswer('\\overline{B}', res),
				params: { U: strs(U), A: strs(a), B: strs(b), asked: 'B', wrong: [diff(U, a), b, diff(a, b), res.slice(0, -1)].map(strs) },
			};
		}
		case 4: {
			const P = norm(pickDistinct(rng, range(1, 5), rng.int(2, 3)));
			const Q = norm(pickDistinct(rng, 'abcdefg'.split(''), rng.int(2, 3)));
			if (P.length * Q.length > 6) return null;
			if (rng.next() < 0.3) {
				// how many pairs, with bigger sets
				const X = norm(pickDistinct(rng, range(1, 9), rng.int(2, 5))),
					Y = norm(pickDistinct(rng, 'abcdefghilm'.split(''), rng.int(2, 6)));
				const m = X.length,
					k = Y.length;
				return {
					prompt: 'Quanti elementi ha il prodotto cartesiano?',
					problem: lines([`A = ${setTex(X)} \\qquad B = ${setTex(Y)}`, '|A \\times B| = \\ ?']),
					solution: `|A \\times B| = ${m * k}`,
					steps: [`\\text{Ogni elemento di } A \\text{ si abbina con ogni elemento di } B`, `|A \\times B| = ${m} \\cdot ${k} = ${m * k}`],
					answer: { kind: 'number', value: String(m * k) },
					params: { variant: 'quante', A: strs(X), B: strs(Y), mistakes: strs([m + k, m * k - 1, 2 * m * k]) },
				};
			}
			const flip = rng.int(0, 1) === 1; // ask Q × P
			const [X, Y, xn, yn] = flip ? [Q, P, 'Q', 'P'] : [P, Q, 'P', 'Q'];
			const good = product(X, Y);
			const reversed = product(Y, X);
			const zipped = X.slice(0, Math.min(X.length, Y.length)).map((x, i) => [x, Y[i]] as Pair);
			const firstOnly = Y.map((y) => [X[0], y] as Pair);
			const cands = shuffle(rng, [pairsOption(reversed), pairsOption(zipped), pairsOption(good, true), pairsOption(firstOnly)]);
			const ch = assembleChoice(rng, pairsOption(good), cands);
			if (!ch) return null;
			const name = `${xn} \\times ${yn}`;
			return {
				prompt: 'Scegli la risposta corretta.',
				problem: lines([`P = ${setTex(P)} \\qquad Q = ${setTex(Q)}`, `${name} = \\ ?`]),
				solution: `${name} = ${pairsTex(good)}`,
				steps: [
					`\\text{Si abbina ogni elemento di } ${xn} \\text{ con ogni elemento di } ${yn}\\text{, con quello di } ${xn} \\text{ al primo posto}`,
					`\\text{Le coppie sono } ${X.length} \\cdot ${Y.length} = ${good.length}\\text{ e si scrivono con le parentesi tonde}`,
					`${name} = ${pairsTex(good)}`,
				],
				answer: ch,
				params: { variant: 'coppie', P: strs(P), Q: strs(Q), asked: flip ? 'QxP' : 'PxQ' },
			};
		}
		case 5: {
			const tpl = rng.pick(TEMPLATES);
			const sets: Record<string, El[]> = {};
			let rows: string[];
			if (tpl.universe) {
				const U = range(1, 8);
				sets.U = U;
				[sets.A, sets.B] = twoSets(rng, U, false);
				if (union(sets.A, sets.B).length === 8) return null;
				rows = [`U = ${setTex(U)}`, `A = ${setTex(sets.A)} \\qquad B = ${setTex(sets.B)}`];
			} else {
				for (const k of ['A', 'B', 'C']) sets[k] = norm(pickDistinct(rng, range(1, 8), rng.int(3, 4)));
				rows = [`A = ${setTex(sets.A)} \\qquad B = ${setTex(sets.B)}`, `C = ${setTex(sets.C)}`];
			}
			const res = exEval(tpl.ex, sets);
			const wrongSets = tpl.wrong.map((w) => exEval(w, sets));
			// the expression must be worth computing: a non-empty result, and the main mistake gives something else
			if (res.length === 0 || sameSet(wrongSets[0], res)) return null;
			const name = exTex(tpl.ex);
			return {
				prompt: 'Calcola e scrivi il risultato per elencazione.',
				problem: lines([...rows, `${name} = \\ ?`]),
				solution: `${name} = ${setTex(res)}`,
				steps: [tpl.universe ? '\\text{Si calcola prima quello che sta sotto la linea del complementare}' : '\\text{Si calcola prima la parentesi}', ...exSteps(tpl.ex, sets)],
				answer: setAnswer(name, res),
				params: { expr: tpl.ex, sets: Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, strs(v)])), wrong: wrongSets.map(strs) },
			};
		}
		case 6: {
			const c = rng.pick(CONTEXTS);
			const both = rng.int(2, 9);
			const a = both + rng.int(2, 14),
				b = both + rng.int(2, 14);
			const none = rng.int(1, 9);
			const total = a + b - both + none;
			const u = rng.next();
			let question: string, value: number, variant: string, mistakes: number[];
			if (u < 0.3) {
				variant = 'solo A';
				question = c.onlyA;
				value = a - both;
				mistakes = [a, a - 2 * both, b - both];
			} else if (u < 0.5) {
				variant = 'solo B';
				question = c.onlyB;
				value = b - both;
				mistakes = [b, b - 2 * both, a - both];
			} else if (u < 0.75) {
				variant = 'uno solo';
				question = c.exactlyOne;
				value = a + b - 2 * both;
				mistakes = [a + b - both, a + b, total - none];
			} else {
				variant = 'nessuno';
				question = c.none;
				value = none;
				mistakes = [total - a - b, a + b - both, total - (a - both) - (b - both)].filter((m) => m >= 0);
			}
			const X = c.A,
				Y = c.B;
			return {
				prompt: 'Risolvi il problema.',
				problem: textBlock(`${c.group} ${total} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${both} ${c.both}. Quanti ${c.people} ${question}?`),
				solution: `\\text{${value} ${c.people}}`,
				steps: [
					`${X} = \\text{quelli che ${c.a}}\\text{, } ${Y} = \\text{quelli che ${c.b}}\\text{; l'universo è formato da tutti gli ${c.people}}`,
					`\\text{Si parte dalla zona comune: } |${X} \\cap ${Y}| = ${both}`,
					`\\text{solo } ${X}\\text{, cioè } ${X} \\setminus ${Y}\\text{: } ${a} - ${both} = ${a - both}`,
					`\\text{solo } ${Y}\\text{, cioè } ${Y} \\setminus ${X}\\text{: } ${b} - ${both} = ${b - both}`,
					`${X} \\cup ${Y}\\text{: } ${a - both} + ${b - both} + ${both} = ${a + b - both}\\text{; nessuno dei due, cioè } \\overline{${X} \\cup ${Y}}\\text{: } ${total} - ${a + b - both} = ${none}`,
					variant === 'uno solo' ? `\\text{Uno solo dei due: } ${a - both} + ${b - both} = ${value}` : `\\text{La risposta è } ${value}`,
				],
				answer: { kind: 'number', value: String(value) },
				params: {
					variant,
					context: String(CONTEXTS.indexOf(c)),
					total: String(total),
					a: String(a),
					b: String(b),
					both: String(both),
					none: String(none),
					mistakes: strs(mistakes),
				},
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const a = sample.answer;
	const setIs = (xs: El[]) => a.kind === 'set' && sameSet(a.values.map(Number), xs);
	switch (sample.level) {
		case 1:
			if (!setIs(inter(nums(p.A), nums(p.B)))) v.push('intersezione sbagliata');
			break;
		case 2: {
			const [X, Y] = p.asked === 'A-B' ? [nums(p.A), nums(p.B)] : [nums(p.B), nums(p.A)];
			if (!setIs(diff(X, Y))) v.push('differenza sbagliata');
			break;
		}
		case 3: {
			const U = nums(p.U);
			if (!setIs(diff(U, nums(p.asked === 'A' ? p.A : p.B)))) v.push('complementare sbagliato');
			if (!subsetEq(nums(p.A), U)) v.push('A non è contenuto in U');
			break;
		}
		case 4:
			if (p.variant === 'quante') {
				if (a.kind !== 'number' || Number(a.value) !== (p.A as string[]).length * (p.B as string[]).length) v.push('conteggio sbagliato');
			} else {
				if (a.kind !== 'choice') return ['serve una scelta'];
				const [X, Y] = p.asked === 'PxQ' ? [nums(p.P), p.Q as string[]] : [p.Q as string[], nums(p.P)];
				const truth = product(X, Y)
					.map((q) => pairKey(q))
					.sort()
					.join('|');
				const t = a.options.map((o) => [...o.values].sort().join('|') === truth);
				if (t.filter(Boolean).length !== 1 || !t[a.correct]) v.push('non c’è una sola risposta giusta');
			}
			break;
		case 5: {
			const sets = Object.fromEntries(Object.entries(p.sets as Record<string, string[]>).map(([k, xs]) => [k, xs.map(Number)]));
			const res = exEval(p.expr as Ex, sets);
			if (!setIs(res) || res.length === 0) v.push('espressione sbagliata o vuota');
			break;
		}
		case 6: {
			const total = Number(p.total),
				x = Number(p.a),
				y = Number(p.b),
				both = Number(p.both),
				none = Number(p.none);
			if (x + y - both + none !== total || both > Math.min(x, y)) v.push('numeri incoerenti');
			const value = { 'solo A': x - both, 'solo B': y - both, 'uno solo': x + y - 2 * both, nessuno: none }[p.variant as string];
			if (a.kind !== 'number' || Number(a.value) !== value) v.push('risposta sbagliata');
			if ([total, x, y, both].includes(value as number)) v.push('la risposta è già un numero del testo');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
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
	// last resort: one element dropped, or one element of the given sets added
	const given = Object.values((sample.params.sets ?? { A: sample.params.A ?? [], B: sample.params.B ?? [] }) as Record<string, string[]>).flatMap((xs) => xs.map(Number));
	const fallback = shuffle(rng, [...truth.map((x) => truth.filter((y) => y !== x)), ...diff(given, truth).map((x) => norm([...truth, x]) as number[])]);
	const ch = assembleChoice(rng, setOption(truth), [...wrong, ...fallback].map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return fitSetChoice(ch);
}

export const insiemiOperazioni: Generator = {
	id: ID,
	title: 'Operazioni tra insiemi',
	levels: {
		1: { label: 'Intersezione', constraints: ['A e B elencati, numeri da 1 a 12', 'circa 15% disgiunti: A ∩ B = ∅'] },
		2: { label: 'Differenza', constraints: ['A \\ B oppure B \\ A', 'a volte disgiunti (niente da togliere) o A ⊆ B'] },
		3: { label: 'Complementare', constraints: ['U = {1, ..., n} con n da 8 a 12', 'a volte si chiede il complementare di B con A e B dati'] },
		4: { label: 'Prodotto cartesiano', constraints: ['P numeri, Q lettere, al massimo 6 coppie; P × Q oppure Q × P', 'circa 30%: quante coppie'] },
		5: {
			label: 'Espressioni e leggi di De Morgan',
			constraints: ['parentesi con ∪, ∩, \\ oppure complementari in U = {1, ..., 8}', 'risultato non vuoto, diverso da quello dell’errore principale'],
		},
		6: { label: 'Problemi con il diagramma', constraints: ['solo uno dei due, uno solo, nessuno', 'le quattro zone danno il totale'] },
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

export default insiemiOperazioni;
