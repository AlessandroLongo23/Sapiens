/**
 * Razionalizzazione del denominatore. Spec: specs/exercises/radicali-razionalizzazione.md
 * Lesson: docs/lezioni/riscritte/74-radicali-razionalizzazione.md
 *
 * Seven levels in the lesson's order: a square root, a radicand to simplify first (or letters), a root of
 * index n of a prime power, a root of index n with two factors (or letters), a binomial with the conjugate,
 * the awkward conjugates (a number in front of the radical, a negative denominator, a radical in the
 * numerator too), the conjugate with letters.
 *
 * Built backwards: the denominator and the numerator are chosen so that the result is nice (the rational
 * part of the denominator divides the numerator, or the result of a binomial numerator is chosen first).
 * The answer is an expression in SymPy form with form "rationalized": no radical in a denominator, every
 * radical simplified, the fraction reduced.
 *
 * Radicals of index n > 2 and radicands with letters are handled here (surd.ts only knows square roots).
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { type Opt, buildChoice } from '../monomi';

export const ID = 'radicali-razionalizzazione';

const PROMPT = 'Razionalizza il denominatore e semplifica il risultato.';
const PROMPT_LETTERS = 'Razionalizza il denominatore e semplifica il risultato. Le lettere indicano numeri positivi.';

/** Values of the letters for the numeric comparison of options (the checker compares exactly). */
const LV: Record<string, number> = { a: 2.371913, b: 5.117341, x: 3.441729, y: 1.733107 };

// ---------------------------------------------------------------------------
// Factorisations: base (a prime as a string, or a letter) -> exponent

type Fac = Record<string, number>;

const isLetter = (b: string) => /^[a-z]$/.test(b);

function factor(n: number): Fac {
	const f: Fac = {};
	for (let p = 2; p * p <= n; p++) {
		while (n % p === 0) {
			f[`${p}`] = (f[`${p}`] ?? 0) + 1;
			n /= p;
		}
	}
	if (n > 1) f[`${n}`] = (f[`${n}`] ?? 0) + 1;
	return f;
}

function clean(f: Fac): Fac {
	const out: Fac = {};
	for (const [b, e] of Object.entries(f)) if (e !== 0) out[b] = e;
	return out;
}

/** Numeric part of a factorisation with non-negative exponents. */
function facNum(f: Fac): number {
	let v = 1;
	for (const [b, e] of Object.entries(f)) if (!isLetter(b)) v *= Number(b) ** e;
	return v;
}

const facLetters = (f: Fac) =>
	Object.keys(f)
		.filter(isLetter)
		.sort();

const litLatex = (l: string, e: number) => (e === 1 ? l : `${l}^${e}`);

/** "18", "a^3b", "3xy". */
function facLatex(f: Fac): string {
	const n = facNum(f);
	const lets = facLetters(f)
		.map((l) => litLatex(l, f[l]))
		.join('');
	if (!lets) return `${n}`;
	return n === 1 ? lets : `${n}${lets}`;
}

function facSympy(f: Fac): string {
	const parts = [`${facNum(f)}`, ...facLetters(f).map((l) => (f[l] === 1 ? l : `${l}**${f[l]}`))];
	return parts.filter((p) => p !== '1').join('*') || '1';
}

function facValue(f: Fac): number {
	let v = facNum(f);
	for (const l of facLetters(f)) v *= LV[l] ** f[l];
	return v;
}

const rootLatex = (n: number, f: Fac) => (n === 2 ? `\\sqrt{${facLatex(f)}}` : `\\sqrt[${n}]{${facLatex(f)}}`);
const rootSympy = (n: number, f: Fac) => (n === 2 ? `sqrt(${facSympy(f)})` : `(${facSympy(f)})**(1/${n})`);

// ---------------------------------------------------------------------------
// A monomial with one radical: c · letters · root_n(rad), letters with exponents of any sign

interface RM {
	c: Rational;
	lit: Record<string, number>;
	n: number;
	rad: Fac;
}

const hasRoot = (m: RM) => Object.keys(m.rad).length > 0;

/**
 * LaTeX of c·letters·root over the denominator. With `raw` the numbers are written as given, unreduced
 * (an intermediate step, or an option that is right but not simplified).
 */
function fracLatex(numC: number, numLit: string, root: string, den: number, denLit: string, neg = false): string {
	const top = `${numC === 1 && (numLit || root) ? '' : numC}${numLit}${root}`;
	const bottom = `${den === 1 && denLit ? '' : den}${denLit}`;
	const sign = neg ? '-' : '';
	return bottom === '1' ? `${sign}${top}` : `${sign}\\frac{${top}}{${bottom}}`;
}

function litParts(lit: Record<string, number>): { pos: string; neg: string } {
	const ls = Object.keys(lit)
		.filter((l) => lit[l] !== 0)
		.sort();
	return {
		pos: ls
			.filter((l) => lit[l] > 0)
			.map((l) => litLatex(l, lit[l]))
			.join(''),
		neg: ls
			.filter((l) => lit[l] < 0)
			.map((l) => litLatex(l, -lit[l]))
			.join(''),
	};
}

function rmLatex(m: RM): string {
	const { pos, neg } = litParts(m.lit);
	const root = hasRoot(m) ? rootLatex(m.n, m.rad) : '';
	return fracLatex(Math.abs(m.c.num), pos, root, m.c.den, neg, m.c.num < 0);
}

function rmSympy(m: RM): string {
	const parts = [`(${m.c.toString()})`];
	for (const l of Object.keys(m.lit).sort()) if (m.lit[l] !== 0) parts.push(m.lit[l] === 1 ? l : `${l}**(${m.lit[l]})`);
	if (hasRoot(m)) parts.push(rootSympy(m.n, m.rad));
	return parts.join('*');
}

function rmValue(m: RM): number {
	let v = m.c.num / m.c.den;
	for (const l of Object.keys(m.lit)) v *= LV[l] ** m.lit[l];
	if (hasRoot(m)) v *= facValue(m.rad) ** (1 / m.n);
	return v;
}

const keyOf = (v: number, tag = '') => `${v.toPrecision(12)}${tag}`;

const rmOpt = (m: RM): Opt => ({ latex: rmLatex(m), value: rmSympy(m), key: keyOf(rmValue(m)) });

/** An option equal in value to `m` but not in the required form (written by hand). */
const rawOpt = (latex: string, m: RM): Opt => ({ latex, value: rmSympy(m), key: keyOf(rmValue(m), '|forma') });

// ---------------------------------------------------------------------------
// Levels 1-4: numerator b·letters over k·root_n(rad)

interface MonoProblem {
	b: number;
	numLit: Record<string, number>;
	k: number;
	n: number;
	/** Radicand as written in the problem (may still have factors to take out). */
	rad: Fac;
}

interface MonoSolved {
	/** Factor taken out of the radical: numeric and letters. */
	outNum: number;
	outLit: Record<string, number>;
	/** Radicand after taking out. */
	rad1: Fac;
	/** Rationalising factor (radicand). */
	F: Fac;
	/** Denominator after the product: k·outNum·(numeric of rad1) and letters. */
	denNum: number;
	denLit: Record<string, number>;
	result: RM;
}

function solveMono(p: MonoProblem): MonoSolved {
	let outNum = 1;
	const outLit: Record<string, number> = {};
	const rad1: Fac = {};
	for (const [b, e] of Object.entries(p.rad)) {
		const o = Math.floor(e / p.n);
		if (o > 0) {
			if (isLetter(b)) outLit[b] = o;
			else outNum *= Number(b) ** o;
		}
		if (e % p.n) rad1[b] = e % p.n;
	}
	const F: Fac = {};
	for (const [b, e] of Object.entries(rad1)) F[b] = p.n - e;
	const denLit: Record<string, number> = { ...outLit };
	let denNum = p.k * outNum;
	for (const b of Object.keys(rad1)) {
		if (isLetter(b)) denLit[b] = (denLit[b] ?? 0) + 1;
		else denNum *= Number(b);
	}
	const lit: Record<string, number> = { ...p.numLit };
	for (const [l, e] of Object.entries(denLit)) lit[l] = (lit[l] ?? 0) - e;
	return { outNum, outLit, rad1, F, denNum, denLit, result: { c: q(p.b, denNum), lit: clean(lit), n: p.n, rad: F } };
}

const litStr = (lit: Record<string, number>) => litParts(lit).pos;

function monoProblemLatex(p: MonoProblem): string {
	const top = `${p.b === 1 && Object.keys(p.numLit).length ? '' : p.b}${litStr(p.numLit)}`;
	return `\\frac{${top}}{${p.k === 1 ? '' : p.k}${rootLatex(p.n, p.rad)}}`;
}

function monoSteps(p: MonoProblem, s: MonoSolved): string[] {
	const steps: string[] = [];
	const n = p.n;
	const top = `${p.b === 1 && Object.keys(p.numLit).length ? '' : p.b}${litStr(p.numLit)}`;
	const took = s.outNum !== 1 || Object.keys(s.outLit).length > 0;
	const outL = `${s.outNum === 1 && Object.keys(s.outLit).length ? '' : s.outNum}${litStr(s.outLit)}`;
	const kOut = `${p.k * s.outNum === 1 && Object.keys(s.outLit).length === 0 ? '' : p.k * s.outNum}${litStr(s.outLit)}`;
	const k1 = kOut === '1' ? '' : kOut;
	if (took) {
		steps.push(`\\text{Semplifica il radicale: } ${rootLatex(n, p.rad)} = ${outL}${rootLatex(n, s.rad1)}`);
	}
	const den1 = `${k1}${rootLatex(n, s.rad1)}`;
	const Froot = rootLatex(n, s.F);
	if (n === 2) {
		steps.push(`\\text{Il fattore razionalizzante è } ${Froot} \\text{, perché } ${Froot} \\cdot ${Froot} = ${facLatex(s.F)}`);
	} else {
		const full: Fac = {};
		for (const b of Object.keys(s.rad1)) full[b] = n;
		steps.push(
			`\\text{Completa gli esponenti fino a } ${n} \\text{: il fattore razionalizzante è } ${Froot} \\text{, perché } ${rootLatex(n, s.rad1)} \\cdot ${Froot} = ${rootLatex(n, full)} = ${facLatex(fromRad1(s.rad1))}`,
		);
	}
	const unNum = `${top === '1' ? '' : top}${Froot}`;
	const unDen = `${s.denNum === 1 && litStr(s.denLit) ? '' : s.denNum}${litStr(s.denLit)}`;
	const unreduced = unDen === '1' ? unNum : `\\frac{${unNum}}{${unDen}}`;
	const result = rmLatex(s.result);
	const chain = [`\\frac{${top}}{${den1}}`, `\\frac{${top === '1' ? '' : top}${Froot}}{${den1} \\cdot ${Froot}}`, unreduced];
	if (unreduced !== result) chain.push(result);
	steps.push(chain.join(' = '));
	return steps;
}

/** The product of the bases of rad1, each once: root_n(rad1 · F) = that. */
function fromRad1(rad1: Fac): Fac {
	const f: Fac = {};
	for (const b of Object.keys(rad1)) f[b] = 1;
	return f;
}

// ---------------------------------------------------------------------------
// Levels 5-6: sums of square roots over an integer, c·√r with r square-free (r = 1: a number)

interface Term {
	c: number;
	r: number;
}

interface RS {
	terms: Term[];
	d: number;
}

function sqrtSplit(n: number): { k: number; r: number } {
	let k = 1;
	let r = n;
	for (let i = 2; i * i <= r; i++) {
		while (r % (i * i) === 0) {
			r /= i * i;
			k *= i;
		}
	}
	return { k, r };
}

function mulTerms(a: Term, b: Term): Term {
	const { k, r } = sqrtSplit(a.r * b.r);
	return { c: a.c * b.c * k, r };
}

/** Collects like radicals (first appearance order), reduces by the gcd, makes the denominator positive. */
function rsNorm(terms: Term[], d: number): RS {
	const out: Term[] = [];
	for (const t of terms) {
		const same = out.find((o) => o.r === t.r);
		if (same) same.c += t.c;
		else out.push({ ...t });
	}
	let ts = out.filter((t) => t.c !== 0);
	if (d < 0) {
		ts = ts.map((t) => ({ c: -t.c, r: t.r }));
		d = -d;
	}
	const g = ts.reduce((acc, t) => gcd(acc, t.c), d);
	return { terms: ts.map((t) => ({ c: t.c / g, r: t.r })), d: d / g };
}

function mulSum(a: Term[], b: Term[]): Term[] {
	const out: Term[] = [];
	for (const x of a) for (const y of b) out.push(mulTerms(x, y));
	return out;
}

function termLatex(t: Term, first: boolean): string {
	const a = Math.abs(t.c);
	const body = t.r === 1 ? `${a}` : `${a === 1 ? '' : a}\\sqrt{${t.r}}`;
	if (first) return `${t.c < 0 ? '-' : ''}${body}`;
	return `${t.c < 0 ? ' - ' : ' + '}${body}`;
}

const sumLatex = (ts: Term[]) => (ts.length ? ts.map((t, i) => termLatex(t, i === 0)).join('') : '0');

function rsLatex(s: RS): string {
	if (s.d === 1) return sumLatex(s.terms);
	if (s.terms.length === 1 && s.terms[0].c < 0) return `-\\frac{${sumLatex([{ c: -s.terms[0].c, r: s.terms[0].r }])}}{${s.d}}`;
	return `\\frac{${sumLatex(s.terms)}}{${s.d}}`;
}

function rsSympy(s: RS): string {
	const num = s.terms.map((t) => (t.r === 1 ? `(${t.c})` : `(${t.c})*sqrt(${t.r})`)).join('+') || '0';
	return s.d === 1 ? num : `(${num})/${s.d}`;
}

const rsValue = (s: RS) => s.terms.reduce((v, t) => v + t.c * Math.sqrt(t.r), 0) / s.d;

/** Puts the terms in the order of `order` (radicands), the others after. */
function orderLike(s: RS, order: number[]): RS {
	const idx = (r: number) => (order.includes(r) ? order.indexOf(r) : 99);
	return { terms: [...s.terms].sort((a, b) => idx(a.r) - idx(b.r)), d: s.d };
}

/** As written in a result: a negative term before a positive one goes second, -√5 + √15 is √15 - √5. */
function display(s: RS): RS {
	const [t1, t2] = s.terms;
	return s.terms.length === 2 && t1.c < 0 && t2.c > 0 ? { terms: [t2, t1], d: s.d } : s;
}

// ---------------------------------------------------------------------------
// Parameters

type Case =
	| 'radice sola'
	| 'numero davanti'
	| 'radicando da semplificare'
	| 'lettere'
	| 'indice 3'
	| 'indice 4'
	| 'indice 5'
	| 'due fattori primi'
	| 'numero e radicale'
	| 'due radicali'
	| 'coefficiente davanti al radicale'
	| 'denominatore negativo'
	| 'radicale al numeratore'
	| 'cx/(√(x+k²) ∓ k)'
	| '(x-k²)/(√x ∓ k)'
	| '(a-b)/(√a ∓ √b)'
	| 'c/(√a ∓ √b)'
	| 'c/(√x ∓ k)';

interface BinProblem {
	/** Numerator: an integer (one term, r = 1) or a binomial. */
	num: Term[];
	/** Denominator, in the order written. */
	den: [Term, Term];
}

interface LetterProblem {
	t: 1 | 2 | 3 | 4 | 5;
	c: number;
	k: number;
	/** +1: the denominator has a minus (√ - k), the result a plus; -1 the other way. */
	s: 1 | -1;
	v: string;
	w: string;
}

interface Params {
	case: Case;
	mono?: MonoProblem;
	bin?: BinProblem;
	let?: LetterProblem;
}

const SQUARE_FREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
const PAIRS: [string, string][] = [
	['x', 'y'],
	['a', 'b'],
];

function nonzero(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

/** b such that b/(den) often simplifies: a multiple of a divisor of den, or any small number. */
function niceNumerator(rng: Rng, den: number, max: number): number {
	if (rng.next() < 0.55) {
		const ds = divisors(den).filter((d) => d > 1 && d <= max);
		if (ds.length) {
			const d = rng.pick(ds);
			return d * rng.int(1, Math.max(1, Math.floor(max / d)));
		}
	}
	return rng.int(1, max);
}

function build(rng: Rng, level: number): Params {
	switch (level) {
		case 1: {
			const withK = rng.next() < 0.5;
			const r = rng.pick(withK ? SQUARE_FREE.filter((x) => x <= 15) : SQUARE_FREE);
			const k = withK ? rng.int(2, 5) : 1;
			const b = niceNumerator(rng, k * r, withK ? 20 : 30);
			return { case: withK ? 'numero davanti' : 'radice sola', mono: { b, numLit: {}, k, n: 2, rad: { ...factor(r) } } };
		}
		case 2: {
			if (rng.next() < 0.3) {
				const [u, v] = rng.pick(PAIRS);
				const both = rng.next() < 0.65;
				const radLetters = both ? [u, v] : [rng.pick([u, v])];
				const m = rng.pick([1, 1, 1, 2, 3, 5, 6]);
				const rad: Fac = { ...(m > 1 ? factor(m) : {}) };
				for (const l of radLetters) rad[l] = 1;
				const numLetters = rng.pick([[u], [v], [u, v]]);
				const numLit: Record<string, number> = {};
				for (const l of numLetters) numLit[l] = 1;
				const b = rng.pick([1, 1, 1, 2, 3, 4, 6]);
				return { case: 'lettere', mono: { b, numLit, k: 1, n: 2, rad } };
			}
			for (;;) {
				const r = rng.pick([2, 3, 5, 6, 7, 10, 11]);
				const m = rng.int(2, 5);
				if (m * m * r > 200) continue;
				const b = niceNumerator(rng, m * r, 20);
				return { case: 'radicando da semplificare', mono: { b, numLit: {}, k: 1, n: 2, rad: factor(m * m * r) } };
			}
		}
		case 3: {
			for (;;) {
				const n = rng.pick([3, 3, 4, 5]);
				const p = rng.pick([2, 2, 3, 3, 5, 7]);
				const m = rng.int(1, n - 1);
				if (gcd(m, n) !== 1 || p ** m > 250 || p ** (n - m) > 250) continue;
				const b = rng.next() < 0.5 ? p * rng.int(1, p === 2 ? 6 : 3) : rng.int(1, 12);
				return { case: `indice ${n}` as Case, mono: { b, numLit: {}, k: 1, n, rad: { [`${p}`]: m } } };
			}
		}
		case 4: {
			if (rng.next() < 0.4) {
				for (;;) {
					const n = rng.pick([3, 3, 4, 4, 5]);
					const [u, v] = rng.pick(PAIRS);
					const i = rng.int(1, n - 1);
					const j = rng.next() < 0.2 ? 0 : rng.int(1, n - 1);
					if (gcd(gcd(i, j), n) !== 1) continue;
					const rad: Fac = clean({ [u]: i, [v]: j });
					const numLetters = rng.pick([[], [u], [u], [v], [u, v]]);
					const numLit: Record<string, number> = {};
					for (const l of numLetters) numLit[l] = 1;
					const b = numLetters.length ? rng.pick([1, 1, 1, 2, 3]) : rng.pick([1, 2, 3, 5]);
					return { case: 'lettere', mono: { b, numLit, k: 1, n, rad } };
				}
			}
			for (;;) {
				const n = rng.pick([3, 3, 4]);
				const [p, pq] = rng.pick([
					[2, 3],
					[2, 3],
					[2, 5],
					[3, 5],
				]);
				const i = rng.int(1, n - 1);
				const j = rng.int(1, n - 1);
				if (gcd(gcd(i, j), n) !== 1) continue;
				const val = p ** i * pq ** j;
				const comp = p ** (n - i) * pq ** (n - j);
				if (val > 400 || comp > 400) continue;
				const b = rng.next() < 0.5 ? p * pq * rng.int(1, 2) : rng.int(1, 12);
				return { case: 'due fattori primi', mono: { b, numLit: {}, k: 1, n, rad: { [`${p}`]: i, [`${pq}`]: j } } };
			}
		}
		case 5: {
			const twoRadicals = rng.next() < 0.45;
			for (;;) {
				let den: [Term, Term];
				if (twoRadicals) {
					const p = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]);
					const r = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]);
					if (p <= r) continue;
					den = [
						{ c: 1, r: p },
						{ c: rng.pick([1, -1]), r },
					];
				} else {
					const a = rng.int(1, 6);
					const r = rng.pick(SQUARE_FREE.filter((x) => x <= 30));
					const sgn = rng.pick([1, -1]);
					if (a * a === r) continue;
					den =
						a * a > r
							? [
									{ c: a, r: 1 },
									{ c: sgn, r },
								]
							: [
									{ c: 1, r },
									{ c: sgn * a, r: 1 },
								];
				}
				const D = den[0].c ** 2 * den[0].r - den[1].c ** 2 * den[1].r;
				if (D <= 0 || D > 30) continue;
				const c = conjNumerator(rng, D);
				if (c === null) continue;
				return { case: twoRadicals ? 'due radicali' : 'numero e radicale', bin: { num: [{ c, r: 1 }], den } };
			}
		}
		case 6: {
			const u = rng.next();
			for (;;) {
				if (u < 1 / 3) {
					// a number in front of the radical: a ± k√r or k√r ± a, positive after the product
					const a = rng.int(1, 9);
					const k = rng.int(2, 4);
					const r = rng.pick([2, 3, 5, 6, 7]);
					const sgn = rng.pick([1, -1]);
					const A = a * a;
					const B = k * k * r;
					if (A === B || Math.abs(A - B) > 30) continue;
					const den: [Term, Term] =
						A > B
							? [
									{ c: a, r: 1 },
									{ c: sgn * k, r },
								]
							: [
									{ c: k, r },
									{ c: sgn * a, r: 1 },
								];
					const D = Math.abs(A - B);
					const c = conjNumerator(rng, D);
					if (c === null) continue;
					return { case: 'coefficiente davanti al radicale', bin: { num: [{ c, r: 1 }], den } };
				}
				if (u < 2 / 3) {
					// negative after the product: a ± √r with a² < r, or √p ± √r with p < r
					let den: [Term, Term];
					if (rng.next() < 0.6) {
						const a = rng.int(1, 5);
						const r = rng.pick(SQUARE_FREE);
						if (a * a >= r) continue;
						den = [
							{ c: a, r: 1 },
							{ c: rng.pick([1, -1]), r },
						];
					} else {
						const p = rng.pick([2, 3, 5, 6, 7, 10, 11]);
						const r = rng.pick([3, 5, 6, 7, 10, 11, 13, 14, 15]);
						if (p >= r) continue;
						den = [
							{ c: 1, r: p },
							{ c: rng.pick([1, -1]), r },
						];
					}
					const D = den[0].c ** 2 * den[0].r - den[1].c ** 2 * den[1].r;
					if (D >= 0 || D < -30) continue;
					const c = conjNumerator(rng, -D);
					if (c === null) continue;
					return { case: 'denominatore negativo', bin: { num: [{ c, r: 1 }], den } };
				}
				// a radical in the numerator too: result u + v√r chosen first, numerator = result · denominator
				const r = rng.pick([2, 3, 5, 6, 7]);
				const a = rng.int(1, 4);
				const sgn = rng.pick([1, -1]);
				if (a * a === r) continue;
				const den: [Term, Term] =
					a * a > r
						? [
								{ c: a, r: 1 },
								{ c: sgn, r },
							]
						: [
								{ c: 1, r },
								{ c: sgn * a, r: 1 },
							];
				const res: Term[] = [
					{ c: nonzero(rng, -4, 4), r: 1 },
					{ c: nonzero(rng, -3, 3), r },
				];
				const N = rsNorm(mulSum(res, den), 1);
				if (N.terms.length !== 2 || N.terms.some((t) => Math.abs(t.c) > 20)) continue;
				// numerator written in the order of the denominator, first term positive
				const num = orderLike(N, den.map((t) => t.r)).terms;
				if (num[0].c < 0) continue;
				return { case: 'radicale al numeratore', bin: { num, den } };
			}
		}
		case 7: {
			const t = rng.int(1, 5) as LetterProblem['t'];
			const [v, w] = t === 3 || t === 4 ? rng.pick(PAIRS) : [rng.pick(['x', 'a']), ''];
			const s = rng.pick([1, -1] as const);
			const cases: Case[] = ['cx/(√(x+k²) ∓ k)', '(x-k²)/(√x ∓ k)', '(a-b)/(√a ∓ √b)', 'c/(√a ∓ √b)', 'c/(√x ∓ k)'];
			const c = t === 1 ? rng.int(1, 4) : t === 3 ? rng.int(1, 3) : t === 4 ? rng.int(1, 6) : t === 5 ? rng.int(1, 5) : 1;
			const k = t === 1 || t === 5 ? rng.int(1, 5) : t === 2 ? rng.int(1, 6) : 0;
			return { case: cases[t - 1], let: { t, c, k, s, v, w } };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** Numerator c = t·D/s with s a divisor of D, s <= 6, gcd(t, s) = 1: the result is t·conj/s. */
function conjNumerator(rng: Rng, D: number): number | null {
	const ss = divisors(D).filter((s) => s <= 6);
	const s = rng.pick(ss);
	const t = rng.int(1, 4);
	if (gcd(t, s) !== 1) return null;
	const c = (t * D) / s;
	return c <= 40 ? c : null;
}

// ---------------------------------------------------------------------------
// Derivation: problem, answer, steps, distractors

interface Derived {
	problem: string;
	prompt: string;
	correct: Opt;
	cands: (Opt | null)[];
	/** Right value, wrong form (not reduced, radical not simplified): used in half of the exercises. */
	raw?: Opt;
	near: (i: number) => Opt | null;
	steps: string[];
	solutionLatex: string;
}

function deriveMono(p: MonoProblem, level: number): Derived {
	const s = solveMono(p);
	const res = s.result;
	const problem = monoProblemLatex(p);
	const correct = rmOpt(res);
	const cands: (Opt | null)[] = [];
	const denNumLit = s.denLit;
	// only the denominator multiplied: the radical disappears and the numerator stays as it was
	cands.push(rmOpt({ ...res, rad: {} }));
	// forgot the denominator after the product
	cands.push(rmOpt({ ...res, c: q(p.b, p.k * s.outNum), lit: clean({ ...p.numLit, ...negLit(s.outLit, p.numLit) }) }));
	if (p.n === 2) {
		const r = facNum(res.rad);
		const g = gcd(r, res.c.den);
		// a number under the root simplified with one outside
		if (g > 1 && g < r && Object.keys(res.rad).every((b) => !isLetter(b))) {
			cands.push(rmOpt({ ...res, c: q(res.c.num, res.c.den / g), rad: factor(r / g) }));
		}
	} else {
		// the same radical: root_n(a^m)·root_n(a^m) taken for a
		cands.push(rmOpt({ ...res, rad: s.rad1 }));
		// denominator a^m instead of a
		const lit: Record<string, number> = { ...p.numLit };
		for (const [b, e] of Object.entries(s.rad1)) if (isLetter(b)) lit[b] = (lit[b] ?? 0) - e;
		for (const [l, e] of Object.entries(s.outLit)) lit[l] = (lit[l] ?? 0) - e;
		cands.push(rmOpt({ ...res, c: q(p.b, p.k * s.outNum * facNum(s.rad1)), lit: clean(lit) }));
	}
	// letters: the denominator letter swapped
	const ls = Object.keys(res.lit);
	if (ls.length === 1 && Object.keys(p.rad).filter(isLetter).length === 2) {
		const [l] = ls;
		const other = Object.keys(p.rad).find((b) => isLetter(b) && b !== l)!;
		cands.push(rmOpt({ ...res, lit: { [other]: res.lit[l] } }));
	}
	// right value, wrong form: the fraction not reduced, or the radical not simplified (level 2)
	const top = `${p.b === 1 && Object.keys(p.numLit).length ? '' : p.b}${litStr(p.numLit)}`;
	const unreduced = fracLatex(1, top === '1' ? '' : top, rootLatex(p.n, s.F), s.denNum, litStr(denNumLit));
	const raw: Opt[] = [];
	if (unreduced !== rmLatex(res) && s.denNum !== 1) raw.push(rawOpt(unreduced, res));
	if (level === 2 && Object.keys(s.outLit).length === 0 && s.outNum > 1) {
		// b·√R / R reduced, with R not simplified
		const R = facNum(p.rad);
		const cc = q(p.b, R);
		raw.push(rawOpt(fracLatex(cc.num, '', rootLatex(2, p.rad), cc.den, ''), res));
	}
	const steps = monoSteps(p, s);
	return {
		problem,
		prompt: Object.keys(p.rad).some(isLetter) || Object.keys(p.numLit).length ? PROMPT_LETTERS : PROMPT,
		correct,
		cands,
		raw: raw.at(-1),
		near: (i) => {
			const f = [q(2), q(1, 2), q(3), q(1, 3), q(4), q(3, 2), q(2, 3), q(5)][i - 1];
			return f ? rmOpt({ ...res, c: res.c.mul(f) }) : null;
		},
		steps,
		solutionLatex: `${problem} = ${rmLatex(res)}`,
	};
}

function negLit(outLit: Record<string, number>, numLit: Record<string, number>): Record<string, number> {
	const out: Record<string, number> = {};
	for (const [l, e] of Object.entries(outLit)) out[l] = (numLit[l] ?? 0) - e;
	return out;
}

const rsOpt = (s: RS, order: number[]): Opt => {
	const o = display(orderLike(s, order));
	return { latex: rsLatex(o), value: rsSympy(o), key: keyOf(rsValue(o)) };
};

function binSq(t: Term): string {
	if (t.r === 1) return `${Math.abs(t.c)}^2`;
	const a = Math.abs(t.c);
	return a === 1 ? `(\\sqrt{${t.r}})^2` : `(${a}\\sqrt{${t.r}})^2`;
}

function deriveBin(p: BinProblem, level: number, kase: Case): Derived {
	const [T1, T2] = p.den;
	const conj: Term[] = [T1, { c: -T2.c, r: T2.r }];
	const D = T1.c ** 2 * T1.r - T2.c ** 2 * T2.r;
	const P = rsNorm(mulSum(p.num, conj), 1);
	const res = rsNorm(P.terms, D);
	const numIsInt = p.num.length === 1 && p.num[0].r === 1;
	// order: the conjugate's for a number over the binomial, rational first with a radical in the numerator
	const order = numIsInt ? conj.map((t) => t.r) : [1, T1.r === 1 ? T2.r : T1.r];
	const correct = rsOpt(res, order);
	const denL = sumLatex(p.den);
	const conjL = sumLatex(conj);
	const numL = sumLatex(p.num);
	const problem = `\\frac{${numL}}{${denL}}`;
	const cands: (Opt | null)[] = [];
	// the same binomial instead of the conjugate
	cands.push(rsOpt(rsNorm(mulSum(p.num, p.den), D), order));
	if (kase === 'denominatore negativo') {
		// the minus sign only on the first term
		const ordered = orderLike(res, order);
		if (ordered.terms.length === 2) {
			cands.push(rsOpt({ terms: [ordered.terms[0], { c: -ordered.terms[1].c, r: ordered.terms[1].r }], d: ordered.d }, order));
		}
		// the sign of the denominator lost
		cands.push(rsOpt(rsNorm(P.terms, -D), order));
	}
	if (kase === 'coefficiente davanti al radicale') {
		// (k√r)^2 taken as k^2 (or the number before the radical not squared)
		const rad = T1.r === 1 ? T2 : T1;
		const rat = T1.r === 1 ? T1 : T2;
		const wrong = [rat.c ** 2 - rad.c ** 2, rat.c ** 2 - Math.abs(rad.c) * rad.r].map((x) => (T1.r === 1 ? x : -x));
		for (const Dw of wrong) if (Dw !== 0 && Dw !== D) cands.push(rsOpt(rsNorm(P.terms, Dw), order));
	}
	if (!numIsInt) {
		// the numerator divided by D only in the first term
		const ordered = orderLike(P, order);
		if (ordered.terms.length === 2 && ordered.terms[0].c % D === 0 && Math.abs(D) > 1) {
			cands.push(rsOpt({ terms: [{ c: ordered.terms[0].c / D, r: ordered.terms[0].r }, ordered.terms[1]], d: 1 }, order));
		}
	}
	if (numIsInt) {
		// the denominator split: c/T1 + c/T2, each rationalised
		const c = p.num[0].c;
		const parts = [T1, T2].map((t) => (t.r === 1 ? { terms: [{ c, r: 1 }], d: t.c } : { terms: [{ c, r: t.r }], d: t.c * t.r }));
		const L = parts.reduce((acc, x) => acc * Math.abs(x.d) / gcd(acc, Math.abs(x.d)), 1);
		const terms = parts.flatMap((x) => x.terms.map((t) => ({ c: (t.c * L) / x.d, r: t.r })));
		const split = rsNorm(terms, L);
		if (split.d <= 30 && split.terms.every((t) => Math.abs(t.c) <= 60)) cands.push(rsOpt(split, order));
	}
	// the product A² - B² with the plus sign
	const Dplus = T1.c ** 2 * T1.r + T2.c ** 2 * T2.r;
	cands.push(rsOpt(rsNorm(P.terms, Dplus), order));
	const steps: string[] = [];
	steps.push(`\\text{Il coniugato di } ${denL} \\text{ è } ${conjL}`);
	steps.push(
		`\\text{Al denominatore: } (${denL})(${conjL}) = ${binSq(T1)} - ${binSq(T2)} = ${T1.c ** 2 * T1.r} - ${T2.c ** 2 * T2.r} = ${D}`,
	);
	const resL = correct.latex;
	if (numIsInt) {
		const top = numL === '1' ? conjL : `${numL}(${conjL})`;
		const PL = sumLatex(orderLike(P, order).terms);
		const chain = [problem, D === 1 ? top : `\\frac{${top}}{${D}}`];
		const expanded = D === 1 ? PL : `\\frac{${PL}}{${D}}`;
		if (numL !== '1' && expanded !== chain[1]) chain.push(expanded);
		if (resL !== chain[chain.length - 1]) chain.push(resL);
		steps.push(chain.join(' = '));
		if (D < 0) steps.push(`\\text{Dividendo per } ${D} \\text{ cambiano segno tutti i termini}`);
	} else {
		const PL = sumLatex(orderLike(P, order).terms);
		steps.push(`\\text{Al numeratore: } (${numL})(${conjL}) = ${PL}`);
		if (D === 1) steps.push([problem, `(${numL})(${conjL})`, resL].join(' = '));
		else steps.push([problem, `\\frac{(${numL})(${conjL})}{${D}}`, `\\frac{${PL}}{${D}}`, resL].join(' = '));
	}
	const ordered = orderLike(res, order);
	return {
		problem,
		prompt: PROMPT,
		correct,
		cands,
		near: (i) => {
			const j = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
			const ts = ordered.terms.map((t, idx) => (idx === ordered.terms.length - 1 ? { c: t.c + j, r: t.r } : t));
			if (ts.some((t) => t.c === 0)) return null;
			return rsOpt(rsNorm(ts, ordered.d), order);
		},
		steps,
		solutionLatex: `${problem} = ${resL}`,
	};
}

// Level 7: templates with letters. Each option carries its value at the letters of LV.

function lopt(latex: string, value: string, num: number): Opt {
	return { latex, value, key: keyOf(num) };
}

const sg = (s: number) => (s > 0 ? '+' : '-');
const coef = (c: number) => (c === 1 ? '' : `${c}`);

function deriveLetters(p: LetterProblem): Derived {
	const { c, k, s, v, w } = p;
	const K = k * k;
	const X = LV[v];
	const Y = w ? LV[w] : 0;
	const sq = Math.sqrt;
	let problem: string;
	let correct: Opt;
	const cands: Opt[] = [];
	let near: (i: number) => Opt | null;
	const steps: string[] = [];
	// the denominator has sign -s between its terms, the conjugate +s
	switch (p.t) {
		case 1: {
			// cx / (√(x + K) - s·k) = c(√(x + K) + s·k) = c√(x + K) + s·ck
			const rootL = `\\sqrt{${v} + ${K}}`;
			const den = `${rootL} ${sg(-s)} ${k}`;
			const conj = `${rootL} ${sg(s)} ${k}`;
			problem = `\\frac{${coef(c)}${v}}{${den}}`;
			const val = (cc: number, ss: number) => cc * sq(X + K) + ss * cc * k;
			const ans = (cc: number, ss: number) =>
				lopt(`${coef(cc)}${rootL} ${sg(ss)} ${cc * k}`, `${cc}*sqrt(${v}+${K})+(${ss * cc * k})`, val(cc, ss));
			correct = ans(c, s);
			cands.push(ans(c, -s));
			cands.push(lopt(`${coef(c)}\\sqrt{${v}}`, `${c}*sqrt(${v})`, c * sq(X))); // √(x + K) split as √x + k
			cands.push(lopt(`-${coef(c)}${rootL} ${sg(-s)} ${c * k}`, `-${c}*sqrt(${v}+${K})+(${-s * c * k})`, -val(c, s)));
			cands.push(
				lopt(`\\frac{${coef(c)}${rootL} ${sg(s)} ${c * k}}{${v}}`, `(${c}*sqrt(${v}+${K})+(${s * c * k}))/${v}`, val(c, s) / X),
			);
			near = (i) => (i <= 3 ? ans(c + i, s) : null);
			steps.push(`\\text{Il coniugato di } ${den} \\text{ è } ${conj}`);
			steps.push(`\\text{Al denominatore: } (${den})(${conj}) = (${v} + ${K}) - ${K} = ${v}`);
			steps.push(`${problem} = \\frac{${coef(c)}${v}(${conj})}{${v}} = ${correct.latex}`);
			break;
		}
		case 2: {
			// (x - K) / (√x - s·k) = √x + s·k
			const den = `\\sqrt{${v}} ${sg(-s)} ${k}`;
			const conj = `\\sqrt{${v}} ${sg(s)} ${k}`;
			problem = `\\frac{${v} - ${K}}{${den}}` + (s > 0 ? ` \\quad ${v} \\neq ${K}` : '');
			const ans = (ss: number, kk: number, neg = false) =>
				lopt(`${neg ? '-' : ''}\\sqrt{${v}} ${sg(neg ? -ss : ss)} ${kk}`, `${neg ? '-' : ''}sqrt(${v})+(${(neg ? -ss : ss) * kk})`, (neg ? -1 : 1) * sq(X) + (neg ? -ss : ss) * kk);
			correct = ans(s, k);
			cands.push(ans(-s, k));
			if (K !== k) cands.push(ans(s, K));
			cands.push(lopt(`\\sqrt{${v} - ${K}}`, `sqrt(${v}-${K})`, NaN));
			cands.push(ans(s, k, true));
			near = (i) => (i <= 4 ? ans(s, k + i) : null);
			steps.push(`\\text{Il coniugato di } ${den} \\text{ è } ${conj}`);
			steps.push(`\\text{Al denominatore: } (${den})(${conj}) = ${v} - ${K}`);
			steps.push(`\\frac{${v} - ${K}}{${den}} = \\frac{(${v} - ${K})(${conj})}{${v} - ${K}} = ${correct.latex}`);
			break;
		}
		case 3: {
			// c(a - b) / (√a - s√b) = c√a + s·c√b
			const den = `\\sqrt{${v}} ${sg(-s)} \\sqrt{${w}}`;
			const conj = `\\sqrt{${v}} ${sg(s)} \\sqrt{${w}}`;
			const numL = c === 1 ? `${v} - ${w}` : `${c}(${v} - ${w})`;
			problem = `\\frac{${numL}}{${den}}` + (s > 0 ? ` \\quad ${v} \\neq ${w}` : '');
			const ans = (ss: number, sw = false, neg = false) => {
				const [A, B, a, b] = sw ? [w, v, Y, X] : [v, w, X, Y];
				const first = neg ? -1 : 1;
				const second = neg ? -ss : ss;
				return lopt(
					`${first < 0 ? '-' : ''}${coef(c)}\\sqrt{${A}} ${sg(second)} ${coef(c)}\\sqrt{${B}}`,
					`${first * c}*sqrt(${A})+(${second * c})*sqrt(${B})`,
					first * c * sq(a) + second * c * sq(b),
				);
			};
			correct = ans(s);
			cands.push(ans(-s));
			cands.push(lopt(`${coef(c)}\\sqrt{${v} - ${w}}`, `${c}*sqrt(${v}-${w})`, NaN));
			cands.push(ans(s, true));
			cands.push(ans(s, false, true));
			near = (i) => {
				const cc = c + i;
				return i <= 3 ? lopt(`${cc}\\sqrt{${v}} ${sg(s)} ${cc}\\sqrt{${w}}`, `${cc}*sqrt(${v})+(${s * cc})*sqrt(${w})`, cc * sq(X) + s * cc * sq(Y)) : null;
			};
			steps.push(`\\text{Il coniugato di } ${den} \\text{ è } ${conj}`);
			steps.push(`\\text{Al denominatore: } (${den})(${conj}) = ${v} - ${w}`);
			steps.push(`\\frac{${numL}}{${den}} = \\frac{${numL === `${v} - ${w}` ? `(${v} - ${w})` : numL}(${conj})}{${v} - ${w}} = ${correct.latex}`);
			break;
		}
		case 4: {
			// c / (√a - s√b) = (c√a + s·c√b) / (a - b)
			const den = `\\sqrt{${v}} ${sg(-s)} \\sqrt{${w}}`;
			const conj = `\\sqrt{${v}} ${sg(s)} \\sqrt{${w}}`;
			problem = `\\frac{${c}}{${den}} \\quad ${v} \\neq ${w}`;
			const f = (ss: number, dsgn: number, dplus = false) =>
				lopt(
					`\\frac{${coef(c)}\\sqrt{${v}} ${sg(ss)} ${coef(c)}\\sqrt{${w}}}{${dsgn > 0 ? `${v}` : `${w}`} ${dplus ? '+' : '-'} ${dsgn > 0 ? `${w}` : `${v}`}}`,
					`(${c}*sqrt(${v})+(${ss * c})*sqrt(${w}))/(${dsgn > 0 ? v : w}${dplus ? '+' : '-'}${dsgn > 0 ? w : v})`,
					(c * sq(X) + ss * c * sq(Y)) / (dsgn > 0 ? (dplus ? X + Y : X - Y) : dplus ? Y + X : Y - X),
				);
			correct = f(s, 1);
			cands.push(f(-s, 1));
			cands.push(f(s, 1, true));
			// split: c/√a - s·c/√b = (c·b√a - s·c·a√b) / (ab)
			cands.push(
				lopt(
					`\\frac{${coef(c)}${w}\\sqrt{${v}} ${sg(-s)} ${coef(c)}${v}\\sqrt{${w}}}{${v}${w}}`,
					`(${c}*${w}*sqrt(${v})+(${-s * c})*${v}*sqrt(${w}))/(${v}*${w})`,
					(c * Y * sq(X) - s * c * X * sq(Y)) / (X * Y),
				),
			);
			cands.push(f(s, -1));
			near = (i) => {
				const cc = c + i;
				return i <= 3
					? lopt(`\\frac{${cc}\\sqrt{${v}} ${sg(s)} ${cc}\\sqrt{${w}}}{${v} - ${w}}`, `(${cc}*sqrt(${v})+(${s * cc})*sqrt(${w}))/(${v}-${w})`, (cc * sq(X) + s * cc * sq(Y)) / (X - Y))
					: null;
			};
			steps.push(`\\text{Il coniugato di } ${den} \\text{ è } ${conj}`);
			steps.push(`\\text{Al denominatore: } (${den})(${conj}) = ${v} - ${w}`);
			steps.push(`\\frac{${c}}{${den}} = \\frac{${c === 1 ? conj : `${c}(${conj})`}}{${v} - ${w}} = ${correct.latex}`);
			break;
		}
		default: {
			// c / (√x - s·k) = (c√x + s·ck) / (x - K)
			const den = `\\sqrt{${v}} ${sg(-s)} ${k}`;
			const conj = `\\sqrt{${v}} ${sg(s)} ${k}`;
			problem = `\\frac{${c}}{${den}} \\quad ${v} \\neq ${K}`;
			const f = (ss: number, Dw: string, Dv: number) =>
				lopt(`\\frac{${coef(c)}\\sqrt{${v}} ${sg(ss)} ${c * k}}{${v} ${Dw}}`, `(${c}*sqrt(${v})+(${ss * c * k}))/(${v}${Dw.replace(/\s/g, '')})`, (c * sq(X) + ss * c * k) / (X + Dv));
			correct = f(s, `- ${K}`, -K);
			cands.push(f(-s, `- ${K}`, -K));
			cands.push(f(s, `+ ${K}`, K));
			if (k !== K) cands.push(f(s, `- ${k}`, -k));
			// split: c/√x - s·c/k = (ck√x - s·cx) / (kx), reduced by gcd(c, k)
			const g = gcd(c, k);
			const [c1, c2, k2] = [(c * k) / g, c / g, k / g];
			cands.push(
				lopt(
					`\\frac{${coef(c1)}\\sqrt{${v}} ${sg(-s)} ${coef(c2)}${v}}{${coef(k2)}${v}}`,
					`(${c1}*sqrt(${v})+(${-s * c2})*${v})/(${k2}*${v})`,
					(c1 * sq(X) - s * c2 * X) / (k2 * X),
				),
			);
			near = (i) => (i <= 4 ? f(s, `- ${K + i}`, -(K + i)) : null);
			steps.push(`\\text{Il coniugato di } ${den} \\text{ è } ${conj}`);
			steps.push(`\\text{Al denominatore: } (${den})(${conj}) = ${v} - ${K}`);
			steps.push(`\\frac{${c}}{${den}} = \\frac{${c === 1 ? conj : `${c}(${conj})`}}{${v} - ${K}} = ${correct.latex}`);
		}
	}
	// A "√(a - b)" option has no value at the chosen letters when a < b: key it by its text.
	const fix = (o: Opt): Opt => (Number.isNaN(Number(o.key)) ? { ...o, key: o.latex } : o);
	const mainL = problem.split(' \\quad ')[0];
	return {
		problem,
		prompt: PROMPT_LETTERS,
		correct,
		cands: cands.map(fix),
		near: (i) => {
			const o = near(i);
			return o ? fix(o) : null;
		},
		steps,
		solutionLatex: `${mainL} = ${correct.latex}`,
	};
}

function derive(level: number, pr: Params): Derived {
	if (pr.mono) return deriveMono(pr.mono, level);
	if (pr.bin) return deriveBin(pr.bin, level, pr.case);
	if (pr.let) return deriveLetters(pr.let);
	throw new Error(`${ID}: empty params`);
}

// ---------------------------------------------------------------------------
// Sample, check, choice

function assemble(pr: Params, level: number, seed: number): Sample {
	const d = derive(level, pr);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: d.prompt,
		problem: d.problem,
		solution: d.solutionLatex,
		steps: d.steps,
		answer: { kind: 'expression', value: d.correct.value, latex: d.correct.latex, form: 'rationalized' },
		params: pr as unknown as Record<string, unknown>,
	};
}

const LEVEL_CASES: Record<number, Case[]> = {
	1: ['radice sola', 'numero davanti'],
	2: ['radicando da semplificare', 'lettere'],
	3: ['indice 3', 'indice 4', 'indice 5'],
	4: ['due fattori primi', 'lettere'],
	5: ['numero e radicale', 'due radicali'],
	6: ['coefficiente davanti al radicale', 'denominatore negativo', 'radicale al numeratore'],
	7: ['cx/(√(x+k²) ∓ k)', '(x-k²)/(√x ∓ k)', '(a-b)/(√a ∓ √b)', 'c/(√a ∓ √b)', 'c/(√x ∓ k)'],
};

function check(sample: Sample): string[] {
	const v: string[] = [];
	const pr = sample.params as unknown as Params;
	if (!LEVEL_CASES[sample.level]?.includes(pr.case)) v.push(`caso ${pr.case} fuori dal livello ${sample.level}`);
	let d: Derived;
	try {
		d = derive(sample.level, pr);
	} catch (e) {
		return [...v, `params non validi: ${(e as Error).message}`];
	}
	if (d.problem !== sample.problem) v.push('testo diverso dai parametri');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.form !== 'rationalized') v.push('risposta non di tipo espressione razionalizzata');
	else if (a.latex !== d.correct.latex) v.push('risposta diversa dal calcolo');
	if (/\\frac\{[^{}]*\}\{[^{}]*\\sqrt/.test(a.kind === 'expression' ? a.latex : '')) v.push('radicale al denominatore nella risposta');
	if (pr.mono) {
		const m = pr.mono;
		const s = solveMono(m);
		const exps = Object.values(s.rad1);
		if (m.n > 2 && exps.reduce((g, e) => gcd(g, e), m.n) !== 1) v.push('indice riducibile');
		if (sample.level === 1 && (s.outNum !== 1 || m.n !== 2)) v.push('livello 1: radicando già semplificato');
		if (sample.level === 2 && pr.case === 'radicando da semplificare' && s.outNum === 1) v.push('livello 2: niente da portare fuori');
		if (sample.level >= 3 && m.n === 2) v.push('livelli 3-4: indice maggiore di 2');
		if (s.result.c.den > 60 || Math.abs(s.result.c.num) > 60) v.push('coefficiente del risultato troppo grande');
		if (facNum(m.rad) > 400 || facNum(s.F) > 400) v.push('radicando troppo grande');
	}
	if (pr.bin) {
		const [T1, T2] = pr.bin.den;
		const D = T1.c ** 2 * T1.r - T2.c ** 2 * T2.r;
		if (D === 0) v.push('denominatore nullo');
		if (sample.level === 5 && D <= 0) v.push('livello 5: il denominatore dopo il prodotto deve essere positivo');
		if (pr.case === 'denominatore negativo' && D >= 0) v.push('caso negativo con denominatore positivo');
		if (pr.case !== 'denominatore negativo' && D < 0) v.push('denominatore negativo fuori dal suo caso');
		if (pr.case === 'coefficiente davanti al radicale' && ![T1, T2].some((t) => t.r > 1 && Math.abs(t.c) > 1)) v.push('manca il coefficiente davanti al radicale');
	}
	if (!sample.steps.length) v.push('nessun passaggio');
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const d = derive(sample.level, sample.params as unknown as Params);
	const cands = d.raw && rng.next() < 0.5 ? [...d.cands.slice(0, 2), d.raw, ...d.cands.slice(2)] : d.cands;
	return buildChoice(d.correct, cands, d.near, rng);
}

export const radicaliRazionalizzazione: Generator = {
	id: ID,
	title: 'Razionalizzazione',
	levels: {
		1: { label: 'Denominatore con una radice quadrata', constraints: ['b/√a o b/(k√a), a senza fattori quadrati', 'metà con un numero davanti alla radice'] },
		2: {
			label: 'Prima semplifica il radicale, o con le lettere',
			constraints: ['7 su 10 con radicando m²·r da semplificare', '3 su 10 con le lettere positive, come x/√(xy)'],
		},
		3: { label: 'Radice di indice n di una potenza', constraints: ['b/ⁿ√(p^m) con p primo, n da 3 a 5, m e n primi tra loro'] },
		4: { label: 'Radice di indice n con due fattori o con le lettere', constraints: ['6 su 10 con due fattori primi, 4 su 10 con le lettere'] },
		5: { label: 'Binomio al denominatore: il coniugato', constraints: ['a ± √b o √a ± √b, denominatore positivo dopo il prodotto', 'risultato t(coniugato)/s'] },
		6: {
			label: 'Coniugato: i casi scomodi',
			constraints: ['un terzo con il numero davanti al radicale, un terzo con il denominatore negativo, un terzo con un radicale anche al numeratore'],
		},
		7: { label: 'Coniugato con le lettere', constraints: ['cinque modelli con le lettere positive, condizione scritta quando il denominatore si può annullare'] },
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

export default radicaliRazionalizzazione;
