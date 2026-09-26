/**
 * Prodotto cartesiano. Spec: specs/exercises/insiemi-prodotto-cartesiano.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/39-insiemi-prodotto-cartesiano.md):
 * ordered pairs (equal pairs, a pair in A × B), listing A × B, B × A and A × A, counting the pairs,
 * changing representation (a cell of the double-entry table, A and B from the product), sets given by a
 * property (the empty set too), the pairs that satisfy a condition and the pairs common to A × B and B × A.
 *
 * Option values: a pair is "1:a", a pair written by mistake with braces "~1:a", a plain element "=1";
 * the values x and y of level 1 are "x=3", "y=2"; the two sets of level 4 are "A=2,5,7", "B=p,q".
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import {
	type El,
	type Prop,
	assembleChoice,
	diff,
	elStr,
	elTex,
	has,
	inter,
	lines,
	listTex,
	norm,
	numberChoice,
	pickDistinct,
	propElements,
	propFromJSON,
	propJSON,
	propTex,
	range,
	range2,
	setTex,
	shuffle,
	textBlock,
	union,
} from '../insiemi';

export const ID = 'insiemi-prodotto-cartesiano';

// ---------------------------------------------------------------------------
// Pairs

type Pair = [El, El];

const cmpEl = (a: El, b: El): number =>
	typeof a === 'number' && typeof b === 'number' ? a - b : typeof a === 'number' ? -1 : typeof b === 'number' ? 1 : a < b ? -1 : a > b ? 1 : 0;
const sortPairs = (ps: readonly Pair[]): Pair[] => {
	const seen = new Set<string>();
	return [...ps]
		.filter((p) => {
			const k = pairKey(p);
			if (seen.has(k)) return false;
			seen.add(k);
			return true;
		})
		.sort((p, q) => cmpEl(p[0], q[0]) || cmpEl(p[1], q[1]));
};
const pairKey = (p: Pair, braces = false) => `${braces ? '~' : ''}${elStr(p[0])}:${elStr(p[1])}`;
const pairTex = (p: Pair, braces = false) => (braces ? `\\{${elTex(p[0])}, ${elTex(p[1])}\\}` : `(${elTex(p[0])}, ${elTex(p[1])})`);
const product = (X: readonly El[], Y: readonly El[]): Pair[] => X.flatMap((x) => Y.map((y) => [x, y] as Pair));
const inProduct = (p: Pair, X: readonly El[], Y: readonly El[]) => has(X, p[0]) && has(Y, p[1]);
const strs = (xs: readonly El[]) => xs.map(elStr);
const parseEl = (s: string): El => (/^-?\d+$/.test(s) ? Number(s) : s);
const els = (xs: unknown): El[] => (xs as string[]).map(parseEl);

/**
 * An answer button is 252 px wide at 16 px: more than four pairs, or more than three with a minus sign,
 * go on two lines (measured with scripts/exercises/width.mts).
 */
const splitPairs = (ps: readonly Pair[]) => ps.length > 4 || (ps.length > 3 && ps.some((p) => String(p[0]).startsWith('-') || String(p[1]).startsWith('-')));

/** The pairs in one line, for the solution and the steps. */
const pairsTex = (ps: readonly Pair[]) => (ps.length ? listTex(sortPairs(ps).map((p) => pairTex(p))) : '\\emptyset');

function pairsOption(ps: readonly Pair[], braces = false): ChoiceOption {
	const s = sortPairs(ps);
	return {
		latex: s.length
			? listTex(
					s.map((p) => pairTex(p, braces)),
					splitPairs(s),
				)
			: '\\emptyset',
		values: s.map((p) => pairKey(p, braces)),
	};
}
const pairOption = (p: Pair): ChoiceOption => ({ latex: pairTex(p), values: [pairKey(p)] });
const elemsOption = (xs: readonly El[]): ChoiceOption => ({ latex: setTex(xs), values: norm(xs).map((x) => `=${elStr(x)}`) });

function choose(rng: Rng, correct: ChoiceOption, distractors: (ChoiceOption | null)[]): ChoiceAnswer | null {
	return assembleChoice(rng, correct, distractors);
}

// ---------------------------------------------------------------------------
// Level 1: equal pairs

/** a·v + b written in v: "2x - 1", "x + 3", "3y". */
function linTex(a: number, b: number, v: string): string {
	const av = a === 1 ? v : `${a}${v}`;
	return b === 0 ? av : b > 0 ? `${av} + ${b}` : `${av} - ${-b}`;
}

const xyOption = (x: number, y: number): ChoiceOption => ({ latex: `x = ${x},\\ y = ${y}`, values: [`x=${x}`, `y=${y}`] });

// ---------------------------------------------------------------------------
// Level 3: word problems

interface Story {
	/** The problem, with {m} and {n}. */
	text: string;
	/** What the answer counts. */
	what: string;
	/** The two sets, for the steps. */
	sets: [string, string];
}

export const STORIES: Story[] = [
	{
		text: 'Una mensa offre ogni giorno {m} primi e {n} secondi. Un menù è formato da un primo e da un secondo. Quanti menù diversi si possono comporre?',
		what: 'menù',
		sets: ['P', 'S'],
	},
	{
		text: 'Luca ha {m} magliette e {n} paia di pantaloni. Quanti modi diversi ha di vestirsi con una maglietta e un paio di pantaloni?',
		what: 'modi',
		sets: ['M', 'P'],
	},
	{
		text: 'Una gelateria ha {m} gusti e {n} tipi di cono. Un gelato è formato da un gusto e da un cono. Quanti gelati diversi si possono ordinare?',
		what: 'gelati',
		sets: ['G', 'C'],
	},
	{
		text: 'Un codice è formato da una lettera, scelta tra {m}, seguita da una cifra, scelta tra {n}. Quanti codici diversi si possono formare?',
		what: 'codici',
		sets: ['L', 'C'],
	},
	{
		text: 'In una battaglia navale le colonne del campo sono indicate con {m} lettere e le righe con {n} numeri. Quante caselle ha il campo?',
		what: 'caselle',
		sets: ['L', 'N'],
	},
];

export const storyText = (s: Story, m: number, n: number) => s.text.replace('{m}', String(m)).replace('{n}', String(n));

// ---------------------------------------------------------------------------
// Level 5: sets given by a property

const P = (dom: 'N' | 'Z', ...conds: Prop['conds']): Prop => ({ dom, conds });
export const PROPS: Prop[] = [
	P('N', range2(null, false, 2, true)),
	P('N', range2(null, false, 3, true)),
	P('N', range2(null, false, 1, false)),
	P('N', range2(null, false, 2, false)),
	P('N', range2(1, false, 3, false)),
	P('N', range2(0, true, 3, true)),
	P('N', range2(1, true, 4, false)),
	P('N', { t: 'lin', a: 2, b: 1, rel: '<', c: 7 }),
	P('N', { t: 'lin', a: 2, b: -1, rel: '<', c: 3 }),
	P('N', { t: 'lin', a: 1, b: 3, rel: '<=', c: 5 }),
	P('N', { t: 'sq', rel: '<', c: 5 }),
	P('N', { t: 'div', n: 4 }),
	P('N', { t: 'div', n: 9 }),
	P('Z', range2(-1, false, 1, false)),
	P('Z', range2(-2, true, 1, true)),
	P('Z', range2(-1, true, 2, false)),
	P('Z', range2(-2, false, 0, true)),
	P('Z', { t: 'sq', rel: '<', c: 4 }),
	P('Z', { t: 'sq', rel: '=', c: 4 }),
	P('Z', { t: 'sq', rel: '=', c: 1 }),
	P('Z', range2(-3, true, 0, false)),
];
export const EMPTY_PROPS: Prop[] = [
	P('N', range2(null, false, 0, true)),
	P('N', { t: 'lin', a: 2, b: 1, rel: '=', c: 4 }),
	P('N', { t: 'lin', a: 1, b: 5, rel: '<', c: 3 }),
	P('Z', { t: 'sq', rel: '<', c: 0 }),
	P('Z', { t: 'lin', a: 2, b: 0, rel: '=', c: 5 }),
	P('Z', range2(3, true, 4, true)),
	P('Z', { t: 'sq', rel: '=', c: 3 }),
];

// ---------------------------------------------------------------------------
// Construction

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

const LETTERS = 'abcdefgh'.split('');
const LETTERS_4 = 'pqrs'.split('');

/** Two sets of small numbers with `common` elements in common, sizes 2-3 each. */
function overlapping(rng: Rng, lo: number, hi: number, common: number, sizes: [number, number]): [number[], number[]] {
	const all = pickDistinct(rng, range(lo, hi), sizes[0] + sizes[1] - common);
	const shared = all.slice(0, common);
	return [norm([...shared, ...all.slice(common, sizes[0])]) as number[], norm([...shared, ...all.slice(sizes[0])]) as number[]];
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			if (rng.next() < 0.5) {
				// (f(x), e) = (d, g(y)) as in example 1, or (f(x), g(y)) = (d, e)
				const layout = rng.next() < 0.6 ? 'incrociata' : 'sinistra';
				const x = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
				const y = rng.pick([-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
				const a = rng.pick([1, 1, 2, 2, 3, 4]);
				const b = a === 1 ? rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]) : rng.pick([-5, -3, -2, -1, 0, 1, 2, 3, 5]);
				const yForm = rng.pick(['k', 'k', 'plus'] as const);
				const k = yForm === 'k' ? rng.int(2, 5) : rng.pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
				const [ya, yb] = yForm === 'k' ? [k, 0] : [1, k];
				const d = a * x + b,
					e = ya * y + yb;
				if (d === e && layout === 'incrociata') return null;
				const fx = linTex(a, b, 'x'),
					gy = linTex(ya, yb, 'y');
				const eq = layout === 'incrociata' ? `(${fx}, ${e}) = (${d}, ${gy})` : `(${fx}, ${gy}) = (${d}, ${e})`;
				// the answers of the mistakes: sign kept when moving b, a not divided, x and y swapped,
				// first element set equal to the second (only in the crossed layout)
				const xs: number[] = [];
				if ((d + b) % a === 0 && b !== 0) xs.push((d + b) / a);
				if (a !== 1) xs.push(d - b);
				const ys: number[] = [];
				if (yb !== 0) ys.push(e + yb);
				else ys.push(e - ya);
				const opts: ChoiceOption[] = [];
				if (layout === 'incrociata' && (e - b) % a === 0 && (d - yb) % ya === 0) opts.push(xyOption((e - b) / a, (d - yb) / ya));
				opts.push(xyOption(y, x));
				for (const x2 of xs) opts.push(xyOption(x2, y));
				for (const y2 of ys) opts.push(xyOption(x, y2));
				if (xs.length) opts.push(xyOption(xs[0], ys[0]));
				const fallback = shuffle(rng, [xyOption(x + 1, y), xyOption(x - 1, y), xyOption(x, y + 1), xyOption(x, y - 1)]);
				const ch = choose(rng, xyOption(x, y), [...shuffle(rng, opts), ...fallback]);
				if (!ch) return null;
				const [lhsX, rhsX] = [fx, String(d)];
				const [lhsY, rhsY] = layout === 'incrociata' ? [String(e), gy] : [gy, String(e)];
				const solveX = a === 1 ? `x = ${d} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${x}` : b === 0 ? `x = ${d} : ${a} = ${x}` : `${a}x = ${d} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${a * x}\\text{, quindi } x = ${x}`;
				const solveY = yb === 0 ? `y = ${e} : ${ya} = ${y}` : `y = ${e} ${yb > 0 ? '-' : '+'} ${Math.abs(yb)} = ${y}`;
				return {
					prompt: 'Trova x e y in modo che le due coppie ordinate siano uguali.',
					problem: eq,
					solution: `x = ${x},\\ y = ${y}`,
					steps: [
						'\\text{Due coppie sono uguali se hanno uguali i primi elementi e uguali i secondi elementi}',
						`${lhsX} = ${rhsX} \\quad \\text{e} \\quad ${lhsY} = ${rhsY}`,
						`\\text{Dalla prima: } ${solveX}`,
						`\\text{Dalla seconda: } ${solveY}`,
						`\\text{Controllo: le due coppie diventano } (${d}, ${e})`,
					],
					answer: ch,
					params: { variant: 'uguaglianza', layout, x: String(x), y: String(y), a: String(a), b: String(b), ya: String(ya), yb: String(yb) },
				};
			}
			// which pair belongs to A × B
			const kind = rng.next() < 0.4 ? 'lettere' : 'numeri';
			let A: El[], B: El[];
			if (kind === 'lettere') {
				A = norm(pickDistinct(rng, range(1, 6), rng.int(2, 3)));
				B = norm(pickDistinct(rng, LETTERS, rng.int(2, 3)));
			} else {
				[A, B] = overlapping(rng, -2, 5, 1, [rng.int(2, 3), rng.int(2, 3)]);
			}
			const good: Pair = [rng.pick(A), rng.pick(B)];
			const onlyB = diff(B, A),
				onlyA = diff(A, B);
			const outside = diff(range(-2, 6), union(A, B));
			const cands: Pair[] = [[good[1], good[0]]];
			if (onlyB.length) cands.push([rng.pick(onlyB), rng.pick(B)], [rng.pick(onlyB), rng.pick(A)]);
			if (onlyA.length) cands.push([rng.pick(A), rng.pick(onlyA)]);
			cands.push([rng.pick(B), rng.pick(A)], [rng.pick(outside), rng.pick(B)], [rng.pick(A), rng.pick(kind === 'lettere' ? diff(LETTERS, B) : outside)]);
			const wrong = cands.filter((p) => !inProduct(p, A, B));
			const ch = choose(rng, pairOption(good), wrong.map(pairOption));
			if (!ch) return null;
			const steps = [
				'\\text{Una coppia sta in } A \\times B \\text{ se il primo elemento sta in } A \\text{ e il secondo in } B',
				`${pairTex(good)} \\in A \\times B\\text{: } ${elTex(good[0])} \\in A \\text{ e } ${elTex(good[1])} \\in B`,
			];
			for (const o of ch.options) {
				if (o.values[0] === pairKey(good)) continue;
				const [p0, p1] = o.values[0].split(':').map(parseEl);
				steps.push(
					!has(A, p0)
						? `${pairTex([p0, p1])} \\notin A \\times B\\text{: } ${elTex(p0)} \\notin A`
						: `${pairTex([p0, p1])} \\notin A \\times B\\text{: } ${elTex(p1)} \\notin B`,
				);
			}
			return {
				prompt: 'Quale di queste coppie appartiene ad A × B?',
				problem: `A = ${setTex(A)} \\qquad B = ${setTex(B)}`,
				solution: `${pairTex(good)} \\in A \\times B`,
				steps,
				answer: ch,
				params: { variant: 'appartenenza', case: kind, A: strs(A), B: strs(B) },
			};
		}
		case 2: {
			const u = rng.next();
			const kind = u < 0.4 ? 'lettere' : u < 0.75 ? 'numeri' : 'quadrato';
			if (kind === 'quadrato') {
				const A = norm(pickDistinct(rng, range(1, 9), 2));
				const good = product(A, A);
				const square = rng.next() < 0.5;
				const name = square ? 'A^2' : 'A \\times A';
				const upper = good.filter((p) => cmpEl(p[0], p[1]) <= 0);
				const offDiag = good.filter((p) => p[0] !== p[1]);
				const diag = good.filter((p) => p[0] === p[1]);
				const ch = choose(rng, pairsOption(good), shuffle(rng, [pairsOption(upper), pairsOption(offDiag), pairsOption(diag), elemsOption(A)]));
				if (!ch) return null;
				return {
					prompt: 'Scegli l’elenco giusto.',
					problem: lines([`A = ${setTex(A)}`, `${name} = \\ ?`]),
					solution: `${name} = ${pairsTex(good)}`,
					steps: [
						`${square ? 'A^2 \\text{ è } A \\times A\\text{: si abbina' : '\\text{Si abbina'} ogni elemento di } A \\text{ con ogni elemento di } A\\text{, anche con sé stesso}`,
						`\\text{Le coppie sono } 2^2 = 4\\text{: } ${pairTex([A[0], A[1]])} \\text{ e } ${pairTex([A[1], A[0]])} \\text{ sono diverse, e ci sono anche } ${pairTex([A[0], A[0]])} \\text{ e } ${pairTex([A[1], A[1]])}`,
						`${name} = ${pairsTex(good)}`,
					],
					answer: ch,
					params: { variant: kind, A: strs(A), asked: square ? 'A2' : 'AxA' },
				};
			}
			let A: El[], B: El[];
			if (kind === 'lettere') {
				A = norm(pickDistinct(rng, range(1, 9), rng.int(2, 3)));
				B = norm(pickDistinct(rng, LETTERS, rng.int(2, 3)));
			} else [A, B] = overlapping(rng, 1, 9, 1, [rng.int(2, 3), rng.int(2, 3)]);
			if (A.length * B.length > 6) return null;
			const flip = rng.next() < 0.5;
			const [X, Y, xn, yn] = flip ? [B, A, 'B', 'A'] : [A, B, 'A', 'B'];
			const good = product(X, Y);
			const zipped = X.slice(0, Math.min(X.length, Y.length)).map((x, i) => [x, Y[i]] as Pair);
			const firstOnly = Y.map((y) => [X[0], y] as Pair);
			const hasDiag = good.some((p) => p[0] === p[1]);
			const cands = shuffle(rng, [pairsOption(product(Y, X)), pairsOption(zipped), hasDiag ? null : pairsOption(good, true), pairsOption(firstOnly), elemsOption(union(A, B))]);
			const ch = choose(rng, pairsOption(good), cands);
			if (!ch) return null;
			const name = `${xn} \\times ${yn}`;
			return {
				prompt: 'Scegli l’elenco giusto.',
				problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, `${name} = \\ ?`]),
				solution: `${name} = ${pairsTex(good)}`,
				steps: [
					`\\text{Si abbina ogni elemento di } ${xn} \\text{ con ogni elemento di } ${yn}\\text{, con quello di } ${xn} \\text{ al primo posto}`,
					`\\text{Le coppie sono } ${X.length} \\cdot ${Y.length} = ${good.length}\\text{ e si scrivono con le parentesi tonde}`,
					`${name} = ${pairsTex(good)}`,
				],
				answer: ch,
				params: { variant: kind, A: strs(A), B: strs(B), asked: flip ? 'BxA' : 'AxB' },
			};
		}
		case 3: {
			const u = rng.next();
			const variant = u < 0.2 ? 'diretto' : u < 0.5 ? 'problema' : u < 0.7 ? 'inverso' : u < 0.85 ? 'quadrato' : 'radice';
			const m = rng.int(2, 9),
				n = rng.int(2, 9);
			const k = rng.int(3, 12);
			let problem: string, value: number, mistakes: number[], steps: string[], solution: string, prompt: string;
			const params: Record<string, unknown> = { variant };
			if (variant === 'diretto') {
				value = m * n;
				prompt = 'Quanti elementi ha il prodotto cartesiano?';
				problem = lines([`|A| = ${m} \\qquad |B| = ${n}`, '|A \\times B| = \\ ?']);
				solution = `|A \\times B| = ${value}`;
				steps = ['\\text{Ogni elemento di } A \\text{ forma una coppia con ogni elemento di } B', `|A \\times B| = |A| \\cdot |B| = ${m} \\cdot ${n} = ${value}`];
				mistakes = [m + n, value + m, value - n];
				Object.assign(params, { m: String(m), n: String(n) });
			} else if (variant === 'problema') {
				const si = rng.int(0, STORIES.length - 1);
				const s = STORIES[si];
				if (m > 8 || n > 8 || m === n) return null;
				value = m * n;
				prompt = 'Risolvi il problema.';
				problem = textBlock(storyText(s, m, n));
				solution = `\\text{${value} ${s.what}}`;
				const [S1, S2] = s.sets;
				steps = [
					`\\text{Ogni elemento del primo insieme, } ${S1}\\text{, si abbina con ogni elemento del secondo, } ${S2}\\text{: si contano le coppie di } ${S1} \\times ${S2}`,
					`|${S1} \\times ${S2}| = ${m} \\cdot ${n} = ${value}`,
					`\\text{Non } ${m} + ${n} = ${m + n}\\text{: la somma conta gli oggetti, non le coppie}`,
				];
				mistakes = [m + n, value + 1, value - 1];
				Object.assign(params, { story: String(si), m: String(m), n: String(n) });
			} else if (variant === 'inverso') {
				if (m === n) return null;
				value = n;
				const tot = m * n;
				prompt = 'Quanti elementi ha B?';
				problem = lines([`|A \\times B| = ${tot} \\qquad |A| = ${m}`, '|B| = \\ ?']);
				solution = `|B| = ${n}`;
				steps = ['|A \\times B| = |A| \\cdot |B|', `${m} \\cdot |B| = ${tot}`, `|B| = ${tot} : ${m} = ${n}`];
				mistakes = [tot - m, tot * m, n + 1].filter((v) => v !== value);
				Object.assign(params, { m: String(m), total: String(tot) });
			} else if (variant === 'quadrato') {
				value = k * k;
				prompt = 'Quanti elementi ha A × A?';
				problem = lines([`|A| = ${k}`, '|A \\times A| = \\ ?']);
				solution = `|A \\times A| = ${value}`;
				steps = ['|A \\times A| = |A|^2', `|A \\times A| = ${k}^2 = ${value}`];
				mistakes = [2 * k, value - k, k];
				Object.assign(params, { k: String(k) });
			} else {
				value = k;
				prompt = 'Quanti elementi ha A?';
				problem = lines([`|A \\times A| = ${k * k}`, '|A| = \\ ?']);
				solution = `|A| = ${k}`;
				steps = ['|A \\times A| = |A|^2', `\\text{Serve un numero naturale che al quadrato dia } ${k * k}\\text{: } ${k}^2 = ${k * k}`, `|A| = ${k}`];
				mistakes = [(k * k) % 2 === 0 ? (k * k) / 2 : k + 2, k * k, k - 2];
				Object.assign(params, { square: String(k * k) });
			}
			return { prompt, problem, solution, steps, answer: { kind: 'number', value: String(value) }, params: { ...params, mistakes: mistakes.map(String) } };
		}
		case 4: {
			if (rng.next() < 0.5) {
				// the cell of the double-entry table
				const kind = rng.next() < 0.5 ? 'lettere' : 'numeri';
				const rows = rng.int(2, 4),
					cols = rng.int(2, 4);
				let R: El[], C: El[];
				if (kind === 'lettere') {
					R = norm(pickDistinct(rng, range(1, 9), rows));
					C = norm(pickDistinct(rng, LETTERS, cols));
				} else {
					[R, C] = overlapping(rng, 1, 9, rng.int(0, 1), [rows, cols]);
				}
				const flip = kind === 'lettere' && rng.next() < 0.3; // a table of B × A: the letters on the rows
				if (flip) [R, C] = [C, R];
				const i = rng.int(0, R.length - 1),
					j = rng.int(0, C.length - 1);
				const good: Pair = [R[i], C[j]];
				if (good[0] === good[1]) return null;
				const name = flip ? 'B \\times A' : 'A \\times B';
				const cands: Pair[] = [[good[1], good[0]], [R[(i + 1) % R.length], C[j]], [R[i], C[(j + 1) % C.length]], [R[(i + R.length - 1) % R.length], C[(j + 1) % C.length]]];
				const ch = choose(rng, pairOption(good), shuffle(rng, [...cands.map(pairOption), { latex: pairTex(good, true), values: [pairKey(good, true)] }]));
				if (!ch) return null;
				const body = R.map((r, a) => `${elTex(r)} & ${C.map((_, b) => (a === i && b === j ? '?' : '')).join(' & ')}`).join(' \\\\ ');
				const table = `\\begin{array}{c|${'c'.repeat(C.length)}} ${name} & ${C.map(elTex).join(' & ')} \\\\ \\hline ${body} \\end{array}`;
				return {
					prompt: `Nella tabella a doppia entrata di ${flip ? 'B × A' : 'A × B'}, quale coppia va nella casella con il punto interrogativo?`,
					problem: `\\begin{gathered} ${table} \\end{gathered}`,
					solution: pairTex(good),
					steps: [
						'\\text{Nella tabella a doppia entrata il primo elemento della coppia sta sulla riga, il secondo sulla colonna}',
						`\\text{La casella è nella riga di } ${elTex(good[0])} \\text{ e nella colonna di } ${elTex(good[1])}`,
						`\\text{La coppia è } ${pairTex(good)}\\text{, con le parentesi tonde}`,
					],
					answer: ch,
					params: { variant: 'casella', case: kind, rows: strs(R), cols: strs(C), cell: [String(i), String(j)], asked: flip ? 'BxA' : 'AxB' },
				};
			}
			// A and B from the product (example 6)
			const kind = rng.next() < 0.5 ? 'lettere' : 'numeri';
			const [ma, mb] = rng.pick([
				[2, 2],
				[2, 3],
				[3, 2],
			] as const);
			let A: El[], B: El[];
			if (kind === 'lettere') {
				A = norm(pickDistinct(rng, range(1, 9), ma));
				B = norm(pickDistinct(rng, LETTERS_4, mb));
			} else [A, B] = overlapping(rng, 1, 9, 1, [ma, mb]);
			const ps = product(A, B);
			const rowsTex: string[] = [];
			for (let r = 0; r < ps.length; r += 2) rowsTex.push(ps.slice(r, r + 2).map((p) => pairTex(p)).join(', '));
			const prodLines = rowsTex.map((l, r) => `${r === 0 ? 'A \\times B = \\{' : ''}${l}${r === rowsTex.length - 1 ? '\\}' : ','}`);
			const abOption = (X: El[], Y: El[]): ChoiceOption => ({
				latex: `\\begin{gathered} A = ${setTex(X)} \\\\ B = ${setTex(Y)} \\end{gathered}`,
				values: [`A=${strs(norm(X)).join(',')}`, `B=${strs(norm(Y)).join(',')}`],
			});
			const all = union(A, B);
			const cands = shuffle(rng, [abOption(B, A), abOption(all, all), abOption(A.slice(0, 1), B), abOption(A, B.slice(0, -1)), abOption(A, union(B, A.slice(-1)))]);
			const ch = choose(rng, abOption(A, B), cands);
			if (!ch) return null;
			return {
				prompt: 'Trova A e B.',
				problem: lines([...prodLines, 'A = \\ ? \\qquad B = \\ ?']),
				solution: `A = ${setTex(A)} \\qquad B = ${setTex(B)}`,
				steps: [
					'\\text{Gli elementi di } A \\text{ sono i primi elementi delle coppie, quelli di } B \\text{ i secondi, ognuno scritto una volta}',
					`A = ${setTex(A)} \\qquad B = ${setTex(B)}`,
					`\\text{Controllo: } |A| \\cdot |B| = ${A.length} \\cdot ${B.length} = ${ps.length}\\text{, proprio il numero di coppie date}`,
				],
				answer: ch,
				params: { variant: 'insiemi', case: kind, A: strs(A), B: strs(B) },
			};
		}
		case 5: {
			const u = rng.next();
			const variant = u < 0.4 ? 'appartenenza' : u < 0.75 ? 'elenco' : 'vuoto';
			let pa: Prop, pb: Prop;
			const emptyA = rng.next() < 0.5;
			if (variant === 'vuoto') {
				const pe = rng.pick(EMPTY_PROPS),
					pn = rng.pick(PROPS);
				[pa, pb] = emptyA ? [pe, pn] : [pn, pe];
			} else {
				pa = rng.pick(PROPS);
				pb = rng.pick(PROPS);
			}
			if (propTex(pa) === propTex(pb)) return null;
			const A = propElements(pa),
				B = propElements(pb);
			const rows = [`A = ${propTex(pa)}`, `B = ${propTex(pb)}`];
			const listStep = `\\text{Prima si elencano gli elementi: } A = ${setTex(A)}\\text{, } B = ${setTex(B)}`;
			const params = { variant, A: propJSON(pa), B: propJSON(pb) };
			if (variant === 'vuoto') {
				const other = emptyA ? B : A;
				const zero: El[] = [0];
				const ch = choose(
					rng,
					pairsOption([]),
					shuffle(rng, [elemsOption(other), pairsOption(emptyA ? product(zero, other) : product(other, zero)), pairsOption(emptyA ? product(other, zero) : product(zero, other))]),
				);
				if (!ch) return null;
				const e = emptyA ? 'A' : 'B';
				return {
					prompt: 'Scrivi il prodotto cartesiano.',
					problem: lines([...rows, 'A \\times B = \\ ?']),
					solution: 'A \\times B = \\emptyset',
					steps: [
						listStep,
						`\\text{Nessun numero rispetta la condizione di } ${e}\\text{: } ${e} = \\emptyset`,
						`\\text{Senza un elemento da mettere al ${emptyA ? 'primo' : 'secondo'} posto non si forma nessuna coppia: } A \\times B = \\emptyset`,
					],
					answer: ch,
					params,
				};
			}
			if (A.length < 2 || B.length < 2) return null;
			const good = product(A, B);
			if (variant === 'elenco') {
				if (good.length > 6) return null;
				const cands: (ChoiceOption | null)[] = [pairsOption(product(B, A))];
				const Aplus = norm([...A, Math.max(...A) + 1]),
					Bplus = norm([...B, Math.max(...B) + 1]);
				if (Aplus.length * B.length <= 6) cands.push(pairsOption(product(Aplus, B)));
				if (A.length * Bplus.length <= 6) cands.push(pairsOption(product(A, Bplus)));
				if (has(A, 0)) cands.push(pairsOption(product(diff(A, [0]), B)));
				if (has(B, 0)) cands.push(pairsOption(product(A, diff(B, [0]))));
				if (!good.some((p) => p[0] === p[1])) cands.push(pairsOption(good, true));
				cands.push(elemsOption(union(A, B)));
				const ch = choose(rng, pairsOption(good), shuffle(rng, cands));
				if (!ch) return null;
				return {
					prompt: 'Scrivi il prodotto cartesiano.',
					problem: lines([...rows, 'A \\times B = \\ ?']),
					solution: `A \\times B = ${pairsTex(good)}`,
					steps: [listStep, `\\text{Il prodotto ha } ${A.length} \\cdot ${B.length} = ${good.length} \\text{ coppie, con l'elemento di } A \\text{ al primo posto}`, `A \\times B = ${pairsTex(good)}`],
					answer: ch,
					params,
				};
			}
			// which pair belongs to A × B (example 4)
			const pick: Pair = [rng.pick(A), rng.pick(B)];
			const near = (xs: number[]) => [Math.min(...xs) - 1, Math.max(...xs) + 1];
			const cands: Pair[] = [
				[pick[1], pick[0]],
				[rng.pick(near(A)), rng.pick(B)],
				[rng.pick(A), rng.pick(near(B))],
				...diff(B, A).map((b) => [b, rng.pick(B)] as Pair),
				...diff(A, B).map((a) => [rng.pick(A), a] as Pair),
				[rng.pick(near(A)), rng.pick(near(B))],
			];
			const wrong = shuffle(
				rng,
				cands.filter((p) => !inProduct(p, A, B)),
			);
			const ch = choose(rng, pairOption(pick), wrong.map(pairOption));
			if (!ch) return null;
			const steps = [listStep, `${pairTex(pick)} \\in A \\times B\\text{: } ${pick[0]} \\in A \\text{ e } ${pick[1]} \\in B`];
			for (const o of ch.options) {
				if (o.values[0] === pairKey(pick)) continue;
				const [p0, p1] = o.values[0].split(':').map(Number);
				steps.push(!has(A, p0) ? `${pairTex([p0, p1])} \\notin A \\times B\\text{: } ${p0} \\notin A` : `${pairTex([p0, p1])} \\notin A \\times B\\text{: } ${p1} \\notin B`);
			}
			return {
				prompt: 'Quale di queste coppie appartiene ad A × B?',
				problem: lines(rows),
				solution: `${pairTex(pick)} \\in A \\times B`,
				steps,
				answer: ch,
				params,
			};
		}
		case 6: {
			const u = rng.next();
			const variant = u < 0.35 ? 'somma' : u < 0.65 ? 'minore' : 'comuni';
			if (variant === 'somma') {
				const [A, B] = overlapping(rng, 1, 7, rng.int(1, 2), [rng.int(3, 4), rng.int(3, 4)]);
				const s = rng.int(4, 11);
				const good = product(A, B).filter((p) => (p[0] as number) + (p[1] as number) === s);
				if (good.length < 1 || good.length > 3) return null;
				const U = union(A, B) as number[];
				// the pairs with sum s taken outside A × B: the order swapped, as (4, 1) in example 5
				const traps = U.map((x) => [x, s - x] as Pair).filter((p) => has(U, p[1]) && !inProduct(p, A, B));
				if (!traps.length) return null;
				const cands: (ChoiceOption | null)[] = [pairsOption([...good, ...traps]), pairsOption(good.map((p) => [p[1], p[0]] as Pair))];
				if (good.length > 1) cands.push(pairsOption(good.slice(1)));
				for (const t of [s - 1, s + 1]) {
					const other = product(A, B).filter((p) => (p[0] as number) + (p[1] as number) === t);
					if (other.length) cands.push(pairsOption(other));
				}
				const ch = choose(rng, pairsOption(good), shuffle(rng, cands));
				if (!ch) return null;
				return {
					prompt: 'Quali coppie di A × B rispettano la condizione?',
					problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, `\\{(a, b) \\in A \\times B \\mid a + b = ${s}\\} = \\ ?`]),
					solution: pairsTex(good),
					steps: [
						`\\text{Per ogni elemento } a \\text{ di } A \\text{ il secondo elemento deve essere } ${s} - a\\text{, e deve stare in } B`,
						...A.map((a) =>
							has(B, s - a) ? `a = ${a}\\text{: serve } ${s - a}\\text{, che sta in } B\\text{: } ${pairTex([a, s - a])}` : `a = ${a}\\text{: serve } ${s - a}\\text{, che non sta in } B`,
						),
						`\\text{${traps.length === 1 ? 'La coppia' : 'Le coppie'} } ${traps.map((p) => pairTex(p)).join(', ')} \\text{ ${traps.length === 1 ? 'ha' : 'hanno'} somma } ${s} \\text{ ma non ${traps.length === 1 ? 'sta' : 'stanno'} in } A \\times B`,
					],
					answer: ch,
					params: { variant, A: strs(A), B: strs(B), s: String(s) },
				};
			}
			if (variant === 'minore') {
				const [A, B] = overlapping(rng, 1, 7, rng.int(1, 2), [rng.int(2, 3), rng.int(2, 3)]);
				const all = product(A, B);
				const good = all.filter((p) => (p[0] as number) < (p[1] as number));
				if (good.length < 1 || good.length > 5) return null;
				const le = all.filter((p) => (p[0] as number) <= (p[1] as number));
				const gt = all.filter((p) => (p[0] as number) > (p[1] as number));
				const ge = all.filter((p) => (p[0] as number) >= (p[1] as number));
				const cands = [le, gt, ge, good.map((p) => [p[1], p[0]] as Pair), good.slice(1)].filter((ps) => ps.length > 0 && ps.length <= 6).map((ps) => pairsOption(ps));
				const ch = choose(rng, pairsOption(good), shuffle(rng, cands));
				if (!ch) return null;
				const eq = all.filter((p) => p[0] === p[1]);
				return {
					prompt: 'Quali coppie di A × B rispettano la condizione?',
					problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, `\\{(a, b) \\in A \\times B \\mid a < b\\} = \\ ?`]),
					solution: pairsTex(good),
					steps: [
						`A \\times B = ${pairsTex(all)}`,
						'\\text{Si tengono le coppie con il primo elemento minore del secondo}',
						...(eq.length ? [`${eq.map((p) => pairTex(p)).join(', ')} \\text{: i due elementi sono uguali, la coppia non va presa}`] : []),
						pairsTex(good),
					],
					answer: ch,
					params: { variant, A: strs(A), B: strs(B) },
				};
			}
			// common pairs of A × B and B × A (example 7)
			const common = rng.next() < 0.6 ? 1 : 2;
			const [A, B] = overlapping(rng, 1, 7, common, [rng.int(common + 1, 3), rng.int(common + 1, 3)]);
			const I = inter(A, B);
			const good = product(I, I);
			const withCommon = product(A, B).filter((p) => has(I, p[0]) || has(I, p[1]));
			const cands: (ChoiceOption | null)[] = [elemsOption(I), pairsOption([]), withCommon.length <= 6 ? pairsOption(withCommon) : null];
			if (common === 2) cands.push(pairsOption(good.filter((p) => p[0] === p[1])), pairsOption(good.filter((p) => p[0] !== p[1])));
			else {
				const c = I[0];
				const mixed = [...diff(A, I).map((a) => [a, c] as Pair), ...diff(B, I).map((b) => [c, b] as Pair)];
				cands.push(pairsOption([...good, ...mixed.slice(0, 2)]));
			}
			const ch = choose(rng, pairsOption(good), shuffle(rng, cands));
			if (!ch) return null;
			return {
				prompt: 'Trova le coppie comuni ai due prodotti.',
				problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, '(A \\times B) \\cap (B \\times A) = \\ ?']),
				solution: `(A \\times B) \\cap (B \\times A) = ${pairsTex(good)}`,
				steps: [
					`A \\times B = ${pairsTex(product(A, B))}`,
					`B \\times A = ${pairsTex(product(B, A))}`,
					'\\text{Una coppia comune ha il primo elemento sia in } A \\text{ sia in } B\\text{, e anche il secondo}',
					`A \\cap B = ${setTex(I)}\\text{, quindi } (A \\times B) \\cap (B \\times A) = ${pairsTex(good)}`,
				],
				answer: ch,
				params: { variant, A: strs(A), B: strs(B) },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Check and choice

/** The correct answer recomputed from params, as the values of the right option (choice levels) or a number. */
function truthOf(sample: Sample): { values?: string[]; number?: number } {
	const p = sample.params;
	switch (sample.level) {
		case 1:
			if (p.variant === 'uguaglianza') return { values: [`x=${p.x}`, `y=${p.y}`] };
			return {};
		case 2: {
			const A = els(p.A);
			if (p.variant === 'quadrato') return { values: pairsOption(product(A, A)).values };
			const B = els(p.B);
			return { values: pairsOption(p.asked === 'AxB' ? product(A, B) : product(B, A)).values };
		}
		case 3: {
			const n = (k: string) => Number(p[k]);
			const v = { diretto: n('m') * n('n'), problema: n('m') * n('n'), inverso: n('total') / n('m'), quadrato: n('k') ** 2, radice: Math.sqrt(n('square')) }[p.variant as string];
			return { number: v };
		}
		case 4: {
			if (p.variant === 'casella') {
				const R = els(p.rows),
					C = els(p.cols);
				const [i, j] = (p.cell as string[]).map(Number);
				return { values: [pairKey([R[i], C[j]])] };
			}
			return { values: [`A=${(p.A as string[]).join(',')}`, `B=${(p.B as string[]).join(',')}`] };
		}
		case 5: {
			const A = propElements(propFromJSON(p.A)),
				B = propElements(propFromJSON(p.B));
			if (p.variant === 'elenco' || p.variant === 'vuoto') return { values: pairsOption(product(A, B)).values };
			return {};
		}
		case 6: {
			const A = els(p.A) as number[],
				B = els(p.B) as number[];
			const all = product(A, B) as [number, number][];
			if (p.variant === 'somma') return { values: pairsOption(all.filter(([a, b]) => a + b === Number(p.s))).values };
			if (p.variant === 'minore') return { values: pairsOption(all.filter(([a, b]) => a < b)).values };
			const I = inter(A, B);
			return { values: pairsOption(product(I, I)).values };
		}
	}
	return {};
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const a = sample.answer;
	const p = sample.params;
	const t = truthOf(sample);
	if (sample.level === 3) {
		if (a.kind !== 'number' || Number(a.value) !== t.number || !Number.isInteger(t.number)) v.push('conteggio sbagliato');
		return v;
	}
	if (a.kind !== 'choice') return ['serve una scelta'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	const key = (o: ChoiceOption) => o.values.join('|');
	if (new Set(a.options.map(key)).size !== a.options.length) v.push('opzioni ripetute');
	let right: boolean[];
	if (t.values) {
		const want = t.values.join('|');
		right = a.options.map((o) => key(o) === want);
	} else {
		// a pair that belongs to A × B
		const [A, B] = sample.level === 1 ? [els(p.A), els(p.B)] : [propElements(propFromJSON(p.A)), propElements(propFromJSON(p.B))];
		right = a.options.map((o) => o.values.length === 1 && !o.values[0].startsWith('~') && inProduct(o.values[0].split(':').map(parseEl) as Pair, A, B));
	}
	if (right.filter(Boolean).length !== 1 || !right[a.correct]) v.push('non c’è una sola risposta giusta');
	if (sample.level === 1 && p.variant === 'uguaglianza') {
		const x = Number(p.x),
			y = Number(p.y);
		if (x === 0 || y === 0) v.push('x o y nulli');
	}
	if (sample.level === 6 && p.variant === 'somma') {
		const n = t.values?.length ?? 0;
		if (n < 1 || n > 3) v.push('da una a tre coppie con la somma data');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	if (a.kind === 'number') return numberChoice(rng, Number(a.value), ((sample.params.mistakes ?? []) as string[]).map(Number));
	throw new Error(`${ID}: no choice for ${a.kind}`);
}

export const insiemiProdottoCartesiano: Generator = {
	id: ID,
	title: 'Prodotto cartesiano',
	levels: {
		1: { label: 'Coppie ordinate', constraints: ['uguaglianza di due coppie con x e y interi non nulli, oppure quale coppia appartiene ad A × B', 'metà e metà'] },
		2: { label: 'Elencare A × B, B × A e A × A', constraints: ['insiemi di 2 o 3 elementi, al massimo 6 coppie', 'A × A con A di 2 elementi'] },
		3: { label: 'Quanti elementi ha il prodotto', constraints: ['|A| · |B|, problemi con gli abbinamenti, il conto inverso, |A × A| e |A| da |A × A|'] },
		4: { label: 'Tabella a doppia entrata e insiemi dal prodotto', constraints: ['la coppia di una casella della tabella', 'A e B da A × B elencato, 4 o 6 coppie'] },
		5: { label: 'Insiemi descritti con una proprietà', constraints: ['proprietà in ℕ o ℤ con 2 o 3 elementi', 'circa 25%: uno dei due insiemi è vuoto'] },
		6: { label: 'Coppie con una condizione', constraints: ['somma data, primo elemento minore del secondo, coppie comuni ad A × B e B × A'] },
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

export default insiemiProdottoCartesiano;
