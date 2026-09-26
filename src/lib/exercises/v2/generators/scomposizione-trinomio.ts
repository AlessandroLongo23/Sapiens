/**
 * Trinomio di secondo grado. Spec: specs/exercises/scomposizione-trinomio.md
 *
 * Seven levels in the order of lesson 36, each adding one difficulty: x^2 + sx + p with both
 * numbers positive, the other sign cases, a common factor or the minus sign collected first,
 * "factor if possible" (some trinomials are irreducible), a != 1 (splitting the middle term and
 * grouping), two letters, x^4 + sx^2 + p with the factors split again.
 *
 * Built backwards: the two numbers (or the two linear factors) are chosen first, the trinomial is
 * their product. The answer is factored completely over the integers: every factor is primitive
 * and irreducible. In the multiple choice, a product equal to the trinomial but not factored to the
 * end (a trinomial left in parentheses, x^2 - 4 not split, 4x + 2 with its factor 2) is a
 * distractor, never a second right answer.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { gcd } from '../rational';
import { type Mono, type Opt, buildChoice, collect, forbidden, mono, monoLatex, monoSympy, mul, polyLatex, polySympy, sumLatex } from '../monomi';

export const ID = 'scomposizione-trinomio';

const MAX_COEF = 100;

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials, and factored forms

type P = Mono[];

interface Fac {
	p: P;
	k: number;
}

/** pre * product of factors; `pre` is an integer times letters (1, -1, 2, 3x, ...). */
interface Factored {
	pre: Mono;
	fs: Fac[];
}

const M = (c: number, e: Record<string, number> = {}): Mono => mono(c, e);
const ONE_M = M(1);

function pmul(a: P, b: P): P {
	const out: Mono[] = [];
	for (const s of a) for (const t of b) out.push(mul(s, t));
	return collect(out);
}

const totalDeg = (m: Mono) => Object.values(m.e).reduce((s, n) => s + n, 0);
const mainLetter = (p: P) => [...new Set(p.flatMap((m) => Object.keys(m.e)))].sort()[0] ?? 'x';

/** Decreasing powers of the first letter (alphabetically), then decreasing total degree. */
function order(p: P): P {
	const v = mainLetter(p);
	return [...collect(p)].sort((a, b) => (b.e[v] ?? 0) - (a.e[v] ?? 0) || totalDeg(b) - totalDeg(a));
}

function expand(F: Factored): P {
	let out: P = [F.pre];
	for (const f of F.fs) for (let i = 0; i < f.k; i++) out = pmul(out, f.p);
	return order(out);
}

const isOneM = (m: Mono) => m.c.isOne() && Object.keys(m.e).length === 0;
const isMinusOneM = (m: Mono) => m.c.num === -1 && m.c.den === 1 && Object.keys(m.e).length === 0;

function preLatex(pre: Mono): string {
	if (isOneM(pre)) return '';
	if (isMinusOneM(pre)) return '-';
	return monoLatex(pre);
}

function factoredLatex(F: Factored): string {
	if (F.fs.length === 0) return monoLatex(F.pre);
	return preLatex(F.pre) + F.fs.map((f) => `(${polyLatex(order(f.p))})${f.k > 1 ? `^${f.k}` : ''}`).join('');
}

function factoredSympy(F: Factored): string {
	const parts = isOneM(F.pre) ? [] : [`(${monoSympy(F.pre)})`];
	for (const f of F.fs) parts.push(`(${polySympy(order(f.p))})${f.k > 1 ? `**${f.k}` : ''}`);
	return parts.join('*') || '1';
}

/** Same factors in any order give the same key. */
const formKey = (F: Factored) => `${monoLatex(F.pre)}|${F.fs.map((f) => `${polyLatex(order(f.p))}^${f.k}`).sort().join(',')}`;

const factoredOpt = (F: Factored): Opt => ({ latex: factoredLatex(F), value: factoredSympy(F), key: formKey(F) });
const IRR_OPT: Opt = { latex: '\\text{irriducibile}', value: 'irriducibile', key: 'irriducibile' };

// ---------------------------------------------------------------------------
// Pieces of the lesson: the two numbers, the sign table, the pairs to try

/** X + m*Y, e.g. x - 3, x^2 + 4, x + 2y, xy - 5. */
const lin = (X: Mono, m: number, Y: Mono = ONE_M): P => [X, mul(M(m), Y)];
/** p*X + q*Y. */
const lin2 = (p: number, X: Mono, q: number, Y: Mono = ONE_M): P => [mul(M(p), X), mul(M(q), Y)];

const nl = (n: number) => (n < 0 ? `(${n})` : `${n}`);
const sgn = (n: number) => (n > 0 ? 1 : -1);

/** Divisor pairs [a, b] of |p|, a <= b. */
function absPairs(p: number): [number, number][] {
	const P = Math.abs(p);
	const out: [number, number][] = [];
	for (let a = 1; a * a <= P; a++) if (P % a === 0) out.push([a, P / a]);
	return out;
}

/** Pairs with product p and the signs of the lesson's table for sum s (smaller absolute value first). */
function signedPairs(p: number, s: number): [number, number][] {
	return absPairs(p).map(([a, b]) => (p > 0 ? [sgn(s) * a, sgn(s) * b] : [-sgn(s) * a, sgn(s) * b]));
}

function signDesc(p: number, s: number): string {
	if (p > 0) return s > 0 ? 'tutti e due positivi' : 'tutti e due negativi';
	return `di segno opposto, e quello con il valore assoluto maggiore è ${s > 0 ? 'positivo' : 'negativo'}`;
}

/** "Two numbers with sum s and product p", the pairs tried (up to the right one), the pair found. */
function pairSteps(s: number, p: number, found: boolean): string[] {
	const list = signedPairs(p, s);
	const idx = list.findIndex(([a, b]) => a + b === s);
	const shown = found ? list.slice(0, idx + 1) : list;
	return [
		`\\text{Servono due numeri con somma } ${s} \\text{ e prodotto } ${p}\\text{: sono ${signDesc(p, s)}}`,
		`\\text{Coppie con prodotto } ${p}\\text{: } ${shown.map(([a, b]) => `${nl(a)} + ${nl(b)} = ${a + b}`).join(',\\quad ')}`,
	];
}

// ---------------------------------------------------------------------------
// Parameters and construction

interface Params {
	case: string;
	v: string;
	w?: string;
	/** pre = k * v^j */
	k: number;
	j: number;
	/** the two numbers (levels 1-4, 6 with a = 1, 7) */
	pair?: [number, number];
	/** level 4, irreducible: s, p and the pair used to build s (sum off by 1 or 2) */
	sp?: [number, number];
	/** a != 1: factors (p x + q y)(r x + t y), split p*t and q*r */
	lin?: [number, number, number, number];
	mode?: 'a1' | 'a' | 'xy';
}

interface Derived {
	problem: P;
	ans: Factored | null;
	steps: string[];
	cands: (Factored | 'irr' | null)[];
	near: (i: number) => Factored | null;
}

const X1 = (v: string) => M(1, { [v]: 1 });

/** Pairs [m, n] with 1 <= m < n, mn <= maxP, n <= maxN. */
function posPair(rng: Rng, maxP: number, maxN: number): [number, number] {
	for (;;) {
		const m = rng.int(1, Math.min(9, maxN - 1));
		const n = rng.int(m + 1, maxN);
		if (m * n <= maxP) return [m, n];
	}
}

/** Pair with p < 0: opposite signs, different absolute values; `bigSign` is the sign of s. */
function oppPair(rng: Rng, maxP: number, maxN: number, bigSign: number): [number, number] {
	const [a, b] = posPair(rng, maxP, maxN);
	return [-bigSign * a, bigSign * b];
}

function anyPair(rng: Rng, maxP: number, maxN: number): [number, number] {
	const u = rng.int(0, 3);
	const [a, b] = posPair(rng, maxP, maxN);
	if (u === 0) return [a, b];
	if (u === 1) return [-a, -b];
	return oppPair(rng, maxP, maxN, u === 2 ? 1 : -1);
}

function pickLetter(rng: Rng): string {
	return rng.next() < 0.75 ? 'x' : rng.pick(['a', 'y', 't']);
}

const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
/** Integer m such that x^2 + m splits over Z: m = -a^2. */
const splits = (m: number) => m < 0 && isSquare(-m);

function build(rng: Rng, level: number): Params {
	const v = pickLetter(rng);
	switch (level) {
		case 1:
			return { case: 'positivi', v, k: 1, j: 0, pair: posPair(rng, 72, 15) };
		case 2: {
			const u = rng.int(0, 2);
			if (u === 0) {
				const [a, b] = posPair(rng, 72, 15);
				return { case: 'negativi', v, k: 1, j: 0, pair: [-a, -b] };
			}
			const sign = u === 1 ? 1 : -1;
			return { case: sign > 0 ? 'p negativo, s positivo' : 'p negativo, s negativo', v, k: 1, j: 0, pair: oppPair(rng, 72, 15, sign) };
		}
		case 3: {
			const u = rng.int(0, 2);
			const pair = anyPair(rng, 45, 9);
			if (u === 0) return { case: 'fattore numerico', v, k: rng.int(2, 5), j: 0, pair };
			if (u === 1) return { case: 'fattore con la lettera', v, k: rng.int(1, 5), j: rng.next() < 0.8 ? 1 : 2, pair };
			return { case: 'segno meno', v, k: -1, j: 0, pair: anyPair(rng, 72, 15) };
		}
		case 4: {
			if (rng.next() < 0.6) return { case: 'scomponibile', v, k: 1, j: 0, pair: anyPair(rng, 60, 12) };
			for (;;) {
				const [m, n] = anyPair(rng, 40, 10);
				const d = rng.pick([-2, -1, 1, 2]);
				const s = m + n + d;
				const p = m * n;
				if (s === 0 || Math.abs(s) > 15 || isSquare(s * s - 4 * p)) continue;
				return { case: 'irriducibile', v, k: 1, j: 0, pair: [m, n], sp: [s, p] };
			}
		}
		case 5: {
			const u = rng.next();
			const kase = u < 0.7 ? 'a positivo' : u < 0.85 ? 'a negativo' : 'fattore comune';
			const k = kase === 'a positivo' ? 1 : kase === 'a negativo' ? -1 : rng.int(2, 3);
			return { case: kase, v, k, j: 0, lin: linPair(rng, 12, 7) };
		}
		case 6: {
			const [x, y] = rng.pick([
				['x', 'y'],
				['x', 'y'],
				['a', 'b'],
			]);
			const u = rng.next();
			if (u < 0.45) return { case: 'primo coefficiente 1', v: x, w: y, k: 1, j: 0, mode: 'a1', pair: anyPair(rng, 40, 9) };
			if (u < 0.8) return { case: 'primo coefficiente diverso da 1', v: x, w: y, k: 1, j: 0, mode: 'a', lin: linPair(rng, 6, 5) };
			return { case: 'monomio al posto della lettera', v: x, w: y, k: 1, j: 0, mode: 'xy', pair: anyPair(rng, 40, 9) };
		}
		case 7: {
			const u = rng.next();
			const nonSq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, -2, -3, -5, -6, -7, -8, -10, -11, -12];
			for (;;) {
				let m: number;
				let n: number;
				let kase: string;
				if (u < 0.35) {
					const a = rng.int(1, 4);
					const b = rng.int(a + 1, 6);
					[m, n] = [-a * a, -b * b];
					kase = 'due differenze di quadrati';
				} else if (u < 0.8) {
					m = -(rng.int(1, 5) ** 2);
					n = rng.pick(nonSq);
					kase = 'una differenza di quadrati';
				} else {
					m = rng.pick(nonSq);
					n = rng.pick(nonSq);
					kase = 'nessun fattore si scompone';
				}
				if (m === n || m + n === 0 || Math.abs(m * n) > MAX_COEF || Math.abs(m + n) > 30) continue;
				const pair: [number, number] = Math.abs(m) <= Math.abs(n) ? [m, n] : [n, m];
				return { case: kase, v, k: 1, j: 0, pair };
			}
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** (p x + q)(r x + t) with p r >= 2, primitive factors, not equal, b != 0. */
function linPair(rng: Rng, maxA: number, maxC: number): [number, number, number, number] {
	for (;;) {
		const p = rng.int(1, 6);
		const r = rng.int(1, 6);
		if (p * r < 2 || p * r > maxA) continue;
		const q = rng.int(-maxC, maxC);
		const t = rng.int(-maxC, maxC);
		if (q === 0 || t === 0 || gcd(p, q) !== 1 || gcd(r, t) !== 1) continue;
		if (p === r && q === t) continue;
		const b = p * t + q * r;
		if (b === 0 || Math.abs(b) > 25 || Math.abs(q * t) > 35) continue;
		return [p, q, r, t];
	}
}

// ---------------------------------------------------------------------------
// Derivation: problem, answer, steps and distractors from the parameters

const monic = (X: Mono, pair: [number, number], Y: Mono = ONE_M): Factored => ({
	pre: ONE_M,
	fs: [
		{ p: lin(X, pair[0], Y), k: 1 },
		{ p: lin(X, pair[1], Y), k: 1 },
	],
});

const withPre = (pre: Mono, F: Factored): Factored => ({ pre: mul(pre, F.pre), fs: F.fs });

/** Other pairs with product p (the table's signs) whose sum is wrong: the pairs a student tries. */
function otherPairs(p: number, s: number): [number, number][] {
	return signedPairs(p, s).filter(([a, b]) => a + b !== s);
}

function nearPair(pair: [number, number], i: number): [number, number] | null {
	const d = Math.ceil(i / 2);
	const out: [number, number] = i % 2 ? [pair[0] + d, pair[1] - d] : [pair[0] - d, pair[1] + d];
	if (out[0] === 0 || out[1] === 0) return null;
	return out;
}

function numbersStep(m: number, n: number, Y: Mono = ONE_M): string {
	if (isOneM(Y)) return `\\text{I due numeri sono } ${m} \\text{ e } ${n}`;
	return `\\text{I due numeri sono } ${m} \\text{ e } ${n}\\text{, i due termini } ${monoLatex(mul(M(m), Y))} \\text{ e } ${monoLatex(mul(M(n), Y))}`;
}

/** Steps of the a != 1 method on p r X^2 + (pt + qr) X Y + q t Y^2; the answer is (rX + tY)(pX + qY). */
function splitSteps(L: [number, number, number, number], X: Mono, Y: Mono): string[] {
	const [p, q, r, t] = L;
	const a = p * r;
	const c = q * t;
	const b = p * t + q * r;
	const X2 = mul(X, X);
	const XY = mul(X, Y);
	const Y2 = mul(Y, Y);
	const tri = order(collect([mul(M(a), X2), mul(M(b), XY), mul(M(c), Y2)]));
	const split = sumLatex([mul(M(a), X2), mul(M(p * t), XY), mul(M(q * r), XY), mul(M(c), Y2)]);
	const B = polyLatex(lin2(r, X, t, Y));
	const g1 = monoLatex(mul(M(p), X));
	const g2m = mul(M(q), Y);
	const g2 = isOneM(g2m) ? ` + (${B})` : isMinusOneM(g2m) ? ` - (${B})` : ` ${q > 0 ? '+' : '-'} ${monoLatex(mul(M(Math.abs(q)), Y))}(${B})`;
	return [
		`\\text{Prodotto del primo coefficiente per il termine noto: } ${a} \\cdot ${nl(c)} = ${a * c}`,
		`\\text{Due numeri con somma } ${b} \\text{ e prodotto } ${a * c}\\text{: } ${p * t} \\text{ e } ${q * r}`,
		`\\text{Spezza il termine di primo grado: } ${polyLatex(tri)} = ${split}`,
		`\\text{Raccogli a gruppi: } ${split} = ${g1}(${B})${g2}`,
		`\\text{Raccogli il binomio comune: } ${g1}(${B})${g2} = (${B})(${polyLatex(lin2(p, X, q, Y))})`,
	];
}

function linFactored(L: [number, number, number, number], X: Mono, Y: Mono = ONE_M): Factored {
	const [p, q, r, t] = L;
	return {
		pre: ONE_M,
		fs: [
			{ p: lin2(r, X, t, Y), k: 1 },
			{ p: lin2(p, X, q, Y), k: 1 },
		],
	};
}

/** x^2 + m split over Z when m = -a^2, as the lesson does with the difference of squares. */
function splitQuad(X: Mono, m: number): Fac[] {
	if (splits(m)) {
		const a = Math.round(Math.sqrt(-m));
		return [
			{ p: lin(X, -a), k: 1 },
			{ p: lin(X, a), k: 1 },
		];
	}
	return [{ p: lin(mul(X, X), m), k: 1 }];
}

function quarticFull(X: Mono, pair: [number, number], fake = false): Factored {
	// fake: also "splits" a sum of two squares x^2 + b^2 into (x - b)(x + b), a real mistake
	const f = (m: number) => (fake && m > 0 && isSquare(m) ? splitQuad(X, -m) : splitQuad(X, m));
	return { pre: ONE_M, fs: [...f(pair[0]), ...f(pair[1])] };
}

function derive(level: number, pr: Params): Derived {
	const X = X1(pr.v);
	const pre = M(pr.k, pr.j ? { [pr.v]: pr.j } : {});
	switch (level) {
		case 1:
		case 2:
		case 4: {
			if (pr.case === 'irriducibile') {
				const [s, p] = pr.sp!;
				const problem = order([mul(X, X), mul(M(s), X), M(p)]);
				const PL = polyLatex(problem);
				const pair = pr.pair!;
				return {
					problem,
					ans: null,
					steps: [...pairSteps(s, p, false), `\\text{Nessuna coppia ha somma } ${s}\\text{: } ${PL} \\text{ è irriducibile}`],
					cands: [monic(X, pair), monic(X, [-pair[0], -pair[1]]), ...otherPairs(p, s).map((q) => monic(X, q)), monic(X, [pair[0], -pair[1]])],
					near: (i) => {
						const q = nearPair(pair, i);
						return q ? monic(X, q) : null;
					},
				};
			}
			const pair = pr.pair!;
			const [m, n] = pair;
			const F = monic(X, pair);
			const problem = expand(F);
			return {
				problem,
				ans: F,
				steps: [...pairSteps(m + n, m * n, true), numbersStep(m, n), `\\text{Scomposizione: } ${polyLatex(problem)} = ${factoredLatex(F)}`],
				cands: [
					monic(X, [-m, -n]),
					...(level === 4 ? ['irr' as const] : []),
					...otherPairs(m * n, m + n).map((q) => monic(X, q)),
					monic(X, [m, -n]),
					monic(X, [-m, n]),
				],
				near: (i) => {
					const q = nearPair(pair, i);
					return q ? monic(X, q) : null;
				},
			};
		}
		case 3: {
			const pair = pr.pair!;
			const [m, n] = pair;
			const inner = expand(monic(X, pair));
			const F = withPre(pre, monic(X, pair));
			const problem = expand(F);
			const PL = polyLatex(problem);
			const collected = factoredLatex({ pre, fs: [{ p: inner, k: 1 }] });
			const what = pr.case === 'segno meno' ? 'il segno meno' : 'il fattore comune';
			const numOnly = M(pr.k);
			const cands: (Factored | null)[] = [
				{ pre, fs: [{ p: inner, k: 1 }] },
				withPre(pre, monic(X, [-m, -n])),
				monic(X, pair),
				pr.j > 0 && pr.k > 1 ? withPre(numOnly, monic(X, pair)) : null,
				pr.j > 0 ? withPre(M(1, { [pr.v]: pr.j }), monic(X, pair)) : null,
				...otherPairs(m * n, m + n).map((q) => withPre(pre, monic(X, q))),
				withPre(pre, monic(X, [m, -n])),
			];
			return {
				problem,
				ans: F,
				steps: [
					`\\text{Raccogli ${what}: } ${PL} = ${collected}`,
					...pairSteps(m + n, m * n, true),
					numbersStep(m, n),
					`\\text{Scomposizione: } ${PL} = ${factoredLatex(F)}`,
				],
				cands,
				near: (i) => {
					const q = nearPair(pair, i);
					return q ? withPre(pre, monic(X, q)) : null;
				},
			};
		}
		case 5:
		case 6: {
			const Y = pr.w && pr.mode !== 'xy' ? X1(pr.w) : ONE_M;
			if (level === 6 && pr.mode !== 'a') {
				const XX = pr.mode === 'xy' ? mul(X, X1(pr.w!)) : X;
				const pair = pr.pair!;
				const [m, n] = pair;
				const F = monic(XX, pair, Y);
				const problem = expand(F);
				const first =
					pr.mode === 'xy'
						? [`\\text{Il primo termine è } (${monoLatex(XX)})^2\\text{: si scompone come } t^2 + st + p \\text{ con } t = ${monoLatex(XX)}`]
						: [`\\text{Pensa } ${pr.w} \\text{ come un numero fisso: i due termini sono della forma } m${pr.w} \\text{ e } n${pr.w}`];
				const cands: (Factored | null)[] =
					pr.mode === 'xy'
						? [
								monic(XX, [-m, -n]),
								{
									pre: ONE_M,
									fs: [
										{ p: lin(X, m), k: 1 },
										{ p: lin(X1(pr.w!), n), k: 1 },
									],
								},
								...otherPairs(m * n, m + n).map((q) => monic(XX, q)),
								monic(XX, [m, -n]),
							]
						: [monic(X, pair), monic(XX, [-m, -n], Y), ...otherPairs(m * n, m + n).map((q) => monic(XX, q, Y)), monic(XX, [m, -n], Y)];
				return {
					problem,
					ans: F,
					steps: [...first, ...pairSteps(m + n, m * n, true), numbersStep(m, n, Y), `\\text{Scomposizione: } ${polyLatex(problem)} = ${factoredLatex(F)}`],
					cands,
					near: (i) => {
						const q = nearPair(pair, i);
						return q ? monic(XX, q, Y) : null;
					},
				};
			}
			const L = pr.lin!;
			const [p, q, r, t] = L;
			const inner = linFactored(L, X, Y);
			const F = withPre(pre, inner);
			const problem = expand(F);
			const PL = polyLatex(problem);
			const steps: string[] = [];
			if (!isOneM(pre)) {
				const what = pr.k < 0 ? 'il segno meno' : 'il fattore comune';
				steps.push(`\\text{Raccogli ${what}: } ${PL} = ${factoredLatex({ pre, fs: [{ p: expand(inner), k: 1 }] })}`);
			}
			steps.push(...splitSteps(L, X, Y), `\\text{Scomposizione: } ${PL} = ${factoredLatex(F)}`);
			const cands: (Factored | null)[] = [
				withPre(pre, monic(X, Math.abs(p * t) <= Math.abs(q * r) ? [p * t, q * r] : [q * r, p * t], Y)), // the two numbers used as if a = 1
				withPre(pre, linFactored([p, t, r, q], X, Y)), // constants swapped
				withPre(pre, linFactored([p, q, r, -t], X, Y)), // sign in the second group
				withPre(pre, linFactored([p, -q, r, t], X, Y)),
			];
			if (pr.k < 0) cands.splice(1, 0, inner); // minus sign forgotten
			if (pr.k > 1) cands.splice(1, 0, { pre: ONE_M, fs: [{ p: lin2(pr.k * r, X, pr.k * t, Y), k: 1 }, inner.fs[1]] }); // factor k left inside
			if (Y !== ONE_M) cands.splice(1, 0, linFactored(L, X)); // second letter forgotten
			return {
				problem,
				ans: F,
				steps,
				cands,
				near: (i) => {
					const d = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
					if (q + d === 0) return null;
					return withPre(pre, linFactored([p, q + d, r, t], X, Y));
				},
			};
		}
		case 7: {
			const pair = pr.pair!;
			const [m, n] = pair;
			const X2 = mul(X, X);
			const F = quarticFull(X, pair);
			const stage = monic(X2, pair);
			const problem = expand(stage);
			const PL = polyLatex(problem);
			const steps = [
				...pairSteps(m + n, m * n, true),
				numbersStep(m, n),
				`\\text{Con } ${monoLatex(X2)} \\text{ al posto della } ${pr.v}\\text{: } ${PL} = ${factoredLatex(stage)}`,
			];
			for (const mm of pair) {
				const fl = polyLatex(lin(X2, mm));
				if (splits(mm)) steps.push(`\\text{Differenza di quadrati: } ${fl} = ${factoredLatex({ pre: ONE_M, fs: splitQuad(X, mm) })}`);
				else steps.push(`\\text{Il fattore } ${fl} \\text{ è irriducibile}`);
			}
			if (splits(m) || splits(n)) steps.push(`\\text{Scomposizione completa: } ${PL} = ${factoredLatex(F)}`);
			else steps.push(`\\text{Nessun fattore si scompone ancora: } ${PL} = ${factoredLatex(F)}`);
			const cands: (Factored | null)[] = [
				splits(m) || splits(n) ? stage : null, // stopped too early
				splits(m) && splits(n) ? { pre: ONE_M, fs: [...splitQuad(X, m), { p: lin(X2, n), k: 1 }] } : null,
				splits(m) && splits(n) ? { pre: ONE_M, fs: [{ p: lin(X2, m), k: 1 }, ...splitQuad(X, n)] } : null,
				quarticFull(X, pair, true), // x^2 + 4 "split" as (x - 2)(x + 2)
				quarticFull(X, [-m, -n]),
				...otherPairs(m * n, m + n).map((q) => quarticFull(X, q)),
				quarticFull(X, [m, -n]),
			];
			return {
				problem,
				ans: F,
				steps,
				cands,
				near: (i) => {
					const q = nearPair(pair, i);
					return q ? quarticFull(X, q) : null;
				},
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

function assemble(pr: Params, level: number, seed: number): Sample {
	const d = derive(level, pr);
	const PL = polyLatex(d.problem);
	const irr = d.ans === null;
	return {
		generatorId: ID,
		level,
		seed,
		prompt: level === 4 ? 'Scomponi in fattori, se possibile.' : 'Scomponi in fattori.',
		problem: PL,
		solution: irr ? `${PL} \\text{ è irriducibile}` : `${PL} = ${factoredLatex(d.ans!)}`,
		steps: d.steps,
		answer: irr
			? { kind: 'expression', value: polySympy(d.problem), latex: PL, form: 'factored' }
			: { kind: 'expression', value: factoredSympy(d.ans!), latex: factoredLatex(d.ans!), form: 'factored' },
		params: { ...pr, irreducible: irr },
	};
}

function readParams(p: Record<string, unknown>): Params {
	return p as unknown as Params;
}

const coefsOk = (p: P) => p.every((m) => m.c.isInteger() && Math.abs(m.c.num) <= MAX_COEF);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const pr = readParams(sample.params);
	let d: Derived;
	try {
		d = derive(sample.level, pr);
	} catch (e) {
		return [`params non validi: ${(e as Error).message}`];
	}
	const PL = polyLatex(d.problem);
	if (sample.problem !== PL) v.push('testo diverso dai parametri');
	v.push(...forbidden(sample.problem));
	const a = sample.answer;
	if (a.kind !== 'expression' || a.form !== 'factored') v.push('risposta non di tipo espressione scomposta');
	else if (d.ans) {
		if (a.latex !== factoredLatex(d.ans) || a.value !== factoredSympy(d.ans)) v.push('risposta diversa dalla scomposizione');
		if (polyLatex(expand(d.ans)) !== PL) v.push('la scomposizione non dà il trinomio');
		v.push(...forbidden(a.latex));
	} else if (a.latex !== PL) v.push('risposta di un trinomio irriducibile diversa dal trinomio');
	if (!coefsOk(d.problem)) v.push('coefficiente fuori intervallo');
	if (d.problem.length !== 3) v.push(`il testo ha ${d.problem.length} termini, non è un trinomio`);
	const pair = pr.pair;
	if (pair && (pair[0] === pair[1] || pair[0] === 0 || pair[1] === 0 || pair[0] + pair[1] === 0)) v.push('coppia di numeri non valida');
	const lvlCase: Record<number, string[]> = {
		1: ['positivi'],
		2: ['negativi', 'p negativo, s positivo', 'p negativo, s negativo'],
		3: ['fattore numerico', 'fattore con la lettera', 'segno meno'],
		4: ['scomponibile', 'irriducibile'],
		5: ['a positivo', 'a negativo', 'fattore comune'],
		6: ['primo coefficiente 1', 'primo coefficiente diverso da 1', 'monomio al posto della lettera'],
		7: ['due differenze di quadrati', 'una differenza di quadrati', 'nessun fattore si scompone'],
	};
	if (!lvlCase[sample.level]?.includes(pr.case)) v.push(`caso ${pr.case} fuori dal livello ${sample.level}`);
	if (pair && (sample.level <= 2 || (sample.level === 4 && pr.case === 'scomponibile'))) {
		const [m, n] = pair;
		const kind = m > 0 && n > 0 ? 'positivi' : m < 0 && n < 0 ? 'negativi' : m + n > 0 ? 'p negativo, s positivo' : 'p negativo, s negativo';
		if (sample.level <= 2 && kind !== pr.case) v.push(`caso ${pr.case} ma i numeri sono ${m} e ${n}`);
	}
	if (sample.level === 7 && pair) {
		const k = (splits(pair[0]) ? 1 : 0) + (splits(pair[1]) ? 1 : 0);
		const want = ['nessun fattore si scompone', 'una differenza di quadrati', 'due differenze di quadrati'][k];
		if (want !== pr.case) v.push(`caso ${pr.case} ma ${k} fattori si scompongono`);
	}
	if (pr.case === 'irriducibile') {
		const [s, p] = pr.sp!;
		if (isSquare(s * s - 4 * p)) v.push('il trinomio dichiarato irriducibile si scompone');
	}
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const pr = readParams(sample.params);
	const d = derive(sample.level, pr);
	const correct = d.ans ? factoredOpt(d.ans) : IRR_OPT;
	const cands = d.cands.map((c) => (c === 'irr' ? IRR_OPT : c ? factoredOpt(c) : null));
	return buildChoice(
		correct,
		cands,
		(i) => {
			const f = d.near(i);
			return f ? factoredOpt(f) : null;
		},
		rng,
	);
}

export const scomposizioneTrinomio: Generator = {
	id: ID,
	title: 'Trinomio di secondo grado',
	levels: {
		1: { label: 'x² + sx + p, numeri positivi', constraints: ['due numeri interi positivi diversi, prodotto fino a 72', 'coefficiente di x² uguale a 1'] },
		2: {
			label: 'x² + sx + p, gli altri segni',
			constraints: ['circa un terzo con due numeri negativi, un terzo con p < 0 e s > 0, un terzo con p < 0 e s < 0'],
		},
		3: {
			label: 'Prima raccogli, poi scomponi',
			constraints: ['un fattore numerico, un fattore con la lettera o il segno meno davanti al trinomio, circa un terzo ciascuno'],
		},
		4: { label: 'Si scompone o è irriducibile?', constraints: ['circa 4 su 10 irriducibili, costruiti con una somma sbagliata di 1 o 2'] },
		5: { label: 'ax² + bx + c con a diverso da 1', constraints: ['spezzamento del termine di primo grado e raccoglimento parziale', 'a volte con il segno meno o un fattore comune'] },
		6: { label: 'Trinomi in due lettere', constraints: ['x² + sxy + py², ax² + bxy + cy², oppure un monomio (xy) al posto della x'] },
		7: { label: 'x⁴ + sx² + p', constraints: ['scomposizione completa: i fattori x² - a² si scompongono ancora, gli altri sono irriducibili'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const pr = build(rng, level);
			const sample = assemble(pr, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default scomposizioneTrinomio;
