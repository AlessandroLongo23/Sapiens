/**
 * Prodotti notevoli. Spec: specs/exercises/polinomi-prodotti-notevoli.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/30-polinomi-prodotti-notevoli.md):
 * sum times difference with a number, then with monomials; square of a binomial with a number, then
 * with two monomials; square of a trinomial; cube of a binomial; power of a binomial with Pascal's
 * triangle. The terms of the product are chosen first; the answer is their expansion, collected and
 * ordered by decreasing powers of the first letter (lexicographic order on the alphabetical letters),
 * as in the lesson. The student expands; the multiple-choice distractors are the mistakes named in the
 * lesson's warnings: (a + b)^2 = a^2 + b^2, the coefficient not squared, the terms swapped in the sum
 * times difference, a double product forgotten, (a + b)^3 = a^3 + b^3, (a - b)^3 taken for (b - a)^3.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	buildChoice,
	collect,
	factorLatex,
	forbidden,
	letters,
	mono,
	monoFromJSON,
	monoJSON,
	monoLatex,
	monoOpt,
	mul,
	neg,
	pickLetters,
	polyLatex,
	polySympy,
	pow,
	scale,
	sumLatex,
	wrap,
} from '../monomi';

export const ID = 'polinomi-prodotti-notevoli';

type Kind = 'sd' | 'sq' | 'tri' | 'cube' | 'pow';

interface Built {
	kind: Kind;
	/** Terms of the binomial or trinomial raised to a power (sq, tri, cube, pow). */
	terms: Mono[];
	/** Sum times difference: the two factors as written. */
	factors?: [Mono[], Mono[]];
	/** Sum times difference: the term equal in both factors and the one that changes sign. */
	same?: Mono;
	change?: Mono;
	n: number;
	case: string;
}

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials

function mulPoly(a: Mono[], b: Mono[]): Mono[] {
	return collect(a.flatMap((x) => b.map((y) => mul(x, y))));
}

function powPoly(a: Mono[], n: number): Mono[] {
	let out: Mono[] = [mono(1)];
	for (let i = 0; i < n; i++) out = mulPoly(out, a);
	return out;
}

/** Decreasing powers of the first letter, then of the next one (letters in alphabetical order). */
function sortLex(terms: Mono[]): Mono[] {
	const ls = [...new Set(terms.flatMap(letters))].sort();
	const cmp = (x: Mono, y: Mono) => {
		for (const v of ls) {
			const d = (y.e[v] ?? 0) - (x.e[v] ?? 0);
			if (d !== 0) return d;
		}
		return 0;
	};
	return [...terms].sort(cmp);
}

const tidy = (terms: Mono[]): Mono[] => sortLex(collect(terms));

function row(n: number): number[] {
	let r = [1];
	for (let i = 0; i < n; i++) r = [1, ...r.slice(1).map((v, j) => v + r[j]), 1];
	return r;
}

function expansion(b: Built): Mono[] {
	if (b.kind === 'sd') return tidy(mulPoly(b.factors![0], b.factors![1]));
	return tidy(powPoly(b.terms, b.n));
}

// ---------------------------------------------------------------------------
// LaTeX

const isBareLetter = (m: Mono) => m.c.isOne() && letters(m).length === 1 && m.e[letters(m)[0]] === 1;
const isPosInt = (m: Mono) => letters(m).length === 0 && m.c.isInteger() && m.c.sign() > 0;

/** m^k as written in the steps: x^2, 5^2, (3x)^2, (-2)^3, \left(\frac{1}{2}a\right)^2. */
function pw(m: Mono, k: number): string {
	if (k === 1) return factorLatex(m);
	const base = isBareLetter(m) || isPosInt(m) ? monoLatex(m) : wrap(monoLatex(m));
	return `${base}^${k}`;
}

const fac = (m: Mono) => factorLatex(m);

function problemLatex(b: Built): string {
	if (b.kind === 'sd') return b.factors!.map((f) => wrap(sumLatex(f))).join('');
	return `${wrap(sumLatex(b.terms))}^${b.n}`;
}

// ---------------------------------------------------------------------------
// Steps

function steps(b: Built, result: Mono[]): string[] {
	const out: string[] = [];
	const prob = problemLatex(b);
	const res = polyLatex(result);
	switch (b.kind) {
		case 'sd': {
			const A = b.same!;
			const B = b.change!.c.sign() > 0 ? b.change! : neg(b.change!);
			out.push(`\\text{Termine uguale: } ${monoLatex(A)} \\qquad \\text{termine che cambia segno: } ${monoLatex(B)}`);
			const raw = [pow(A, 2), neg(pow(B, 2))];
			const chain = [prob, `${pw(A, 2)} - ${pw(B, 2)}`, sumLatex(raw)];
			if (sumLatex(raw) !== res) chain.push(res);
			out.push(`\\text{Quadrato del termine uguale meno quadrato dell'altro: } ${chain.join(' = ')}`);
			break;
		}
		case 'sq': {
			const [A, B] = b.terms;
			const sign = A.c.sign() === B.c.sign() ? 'stesso segno: doppio prodotto positivo' : 'segni diversi: doppio prodotto negativo';
			out.push(`\\text{Termini: } ${monoLatex(A)} \\text{ e } ${monoLatex(B)} \\text{, ${sign}}`);
			const raw = [pow(A, 2), scale(mul(A, B), q(2)), pow(B, 2)];
			const chain = [prob, `${pw(A, 2)} + 2 \\cdot ${fac(A)} \\cdot ${fac(B)} + ${pw(B, 2)}`, sumLatex(raw)];
			if (sumLatex(raw) !== res) chain.push(res);
			out.push(`\\text{Quadrato del primo, doppio prodotto, quadrato del secondo: } ${chain.join(' = ')}`);
			break;
		}
		case 'tri': {
			const [A, B, C] = b.terms;
			out.push(`\\text{Quadrati: } ${[A, B, C].map((m) => `${pw(m, 2)} = ${monoLatex(pow(m, 2))}`).join(' \\qquad ')}`);
			const pairs: [Mono, Mono][] = [
				[A, B],
				[A, C],
				[B, C],
			];
			out.push(`\\text{Doppi prodotti: } ${pairs.map(([x, y]) => `2 \\cdot ${fac(x)} \\cdot ${fac(y)} = ${monoLatex(scale(mul(x, y), q(2)))}`).join(' \\qquad ')}`);
			const raw = [pow(A, 2), pow(B, 2), pow(C, 2), ...pairs.map(([x, y]) => scale(mul(x, y), q(2)))];
			const chain = [prob, sumLatex(raw)];
			if (sumLatex(raw) !== res) chain.push(res);
			const label = collect(raw).length < raw.length ? 'Somma, riduci i termini simili e ordina' : 'Somma e ordina';
			out.push(`\\text{${label}: } ${chain.join(' = ')}`);
			break;
		}
		case 'cube':
		case 'pow': {
			const [A, B] = b.terms;
			const n = b.n;
			const r = row(n);
			if (b.kind === 'pow') out.push(`\\text{Riga } ${n} \\text{ del triangolo di Tartaglia: } ${r.join(',\\ ')}`);
			else out.push(`\\text{Termini: } ${monoLatex(A)} \\text{ e } ${monoLatex(B)} \\text{; coefficienti } 1,\\ 3,\\ 3,\\ 1`);
			const parts: string[] = [];
			const raw: Mono[] = [];
			for (let k = 0; k <= n; k++) {
				const f: string[] = [];
				if (r[k] !== 1) f.push(`${r[k]}`);
				if (n - k > 0) f.push(pw(A, n - k));
				if (k > 0) f.push(pw(B, k));
				parts.push(f.join(' \\cdot '));
				raw.push(scale(mul(pow(A, n - k), pow(B, k)), q(r[k])));
			}
			const chain = [prob, parts.join(' + '), sumLatex(raw)];
			if (sumLatex(raw) !== res) chain.push(res);
			const label = b.kind === 'pow' ? 'Esponenti del primo da ' + n + ' a 0, del secondo da 0 a ' + n : 'Cubo, triplo prodotto, triplo prodotto, cubo';
			out.push(`\\text{${label}: } ${chain.join(' = ')}`);
			break;
		}
	}
	return out;
}

// ---------------------------------------------------------------------------
// Construction

const lit = (v: string, e = 1): Record<string, number> => ({ [v]: e });
const FRACS = [q(1, 2), q(1, 3), q(2, 3), q(3, 2), q(1, 4), q(3, 4)];
const sgn = (rng: Rng, pNeg: number) => (rng.next() < pNeg ? -1 : 1);
const expW = (rng: Rng) => rng.pick([1, 1, 1, 1, 2, 2, 2, 3]);

function pickCase<T extends string>(rng: Rng, cases: [T, number][]): T {
	let u = rng.next();
	for (const [c, w] of cases) {
		if (u < w) return c;
		u -= w;
	}
	return cases[cases.length - 1][0];
}

function build(rng: Rng, level: number): Built | null {
	const fam = rng.pick(FAMILIES);
	switch (level) {
		case 1: {
			// (kx + n)(kx - n), the equal term first
			const [v] = pickLetters(rng, fam, 1);
			const A = mono(rng.next() < 0.65 ? 1 : rng.int(2, 5), lit(v));
			const B = mono(rng.int(1, 12));
			const f: [Mono[], Mono[]] = rng.next() < 0.5 ? [[A, B], [A, neg(B)]] : [[A, neg(B)], [A, B]];
			return { kind: 'sd', terms: [], factors: f, same: A, change: B, n: 2, case: A.c.isOne() ? 'lettera' : 'coefficiente' };
		}
		case 2: {
			const [u, w] = pickLetters(rng, fam, 2);
			const c = pickCase(rng, [
				['termine uguale primo', 0.45],
				['termine uguale negativo', 0.25],
				['termine uguale secondo', 0.3],
			]);
			const frac = rng.next() < 0.3;
			const mk = (vs: string[]) => {
				const e: Record<string, number> = {};
				for (const v of vs) e[v] = expW(rng);
				return e;
			};
			// the equal term: a monomial, or (1 time in 5) a number
			let A: Mono;
			if (c !== 'termine uguale negativo' && rng.next() < 0.2) A = mono(rng.int(2, 9));
			else A = mono(rng.int(1, 5), mk(rng.next() < 0.3 ? [u, w] : [u]));
			let B = mono(rng.int(1, 5), mk(rng.next() < 0.25 && letters(A).length < 2 ? [u, w] : [letters(A).length === 1 ? w : rng.pick([u, w])]));
			if (frac) {
				const fr = rng.pick(FRACS);
				if (rng.next() < 0.5 && letters(A).length > 0) A = mono(fr, { ...A.e });
				else B = mono(fr, { ...B.e });
			}
			if (c === 'termine uguale negativo') A = neg(A);
			if (collect([A, B]).length < 2 || collect([A, neg(B)]).length < 2) return null;
			// nothing like level 1: some coefficient, exponent or second letter
			const simple = (m: Mono) => m.c.abs().isOne() && letters(m).length <= 1 && Object.values(m.e).every((k) => k === 1);
			if (simple(A) && simple(B)) return null;
			let f: [Mono[], Mono[]];
			if (c === 'termine uguale secondo') f = [[neg(B), A], [B, A]];
			else f = rng.next() < 0.5 ? [[A, B], [A, neg(B)]] : [[A, neg(B)], [A, B]];
			return { kind: 'sd', terms: [], factors: f, same: A, change: B, n: 2, case: c };
		}
		case 3: {
			// (kx ± n)^2
			const [v] = pickLetters(rng, fam, 1);
			const A = mono(rng.pick([1, 1, 1, 2, 3, 4]), lit(v));
			const N = mono(rng.int(1, 9));
			const c = pickCase(rng, [
				['somma', 0.35],
				['differenza', 0.35],
				['numero primo', 0.15],
				['due negativi', 0.15],
			]);
			const terms = c === 'somma' ? [A, N] : c === 'differenza' ? [A, neg(N)] : c === 'numero primo' ? [N, neg(A)] : [neg(A), neg(N)];
			return { kind: 'sq', terms, n: 2, case: c };
		}
		case 4: {
			const [u, w] = pickLetters(rng, fam, 2);
			const c = pickCase(rng, [
				['interi', 0.6],
				['frazione', 0.4],
			]);
			let A: Mono;
			let B: Mono;
			if (c === 'interi') {
				A = mono(rng.int(1, 5), lit(u, expW(rng)));
				B = mono(rng.int(1, 5), lit(w, expW(rng)));
				const simple = (m: Mono) => m.c.isOne() && Object.values(m.e).every((k) => k === 1);
				if (simple(A) && simple(B)) return null;
			} else if (rng.next() < 0.4) {
				// (x - 1/3)^2: a letter and a fraction
				A = mono(rng.pick([1, 1, 2, 3]), lit(u, rng.pick([1, 1, 2])));
				B = mono(rng.pick(FRACS));
			} else {
				// (1/2 a^2 + 4b)^2: a fractional coefficient
				const fr = rng.pick(FRACS);
				const other = rng.next() < 0.6 ? fr.den * rng.int(1, 2) : rng.int(1, 4);
				const fa = rng.next() < 0.5;
				A = mono(fa ? fr : q(other), lit(u, expW(rng)));
				B = mono(fa ? q(other) : fr, lit(w, expW(rng)));
			}
			if (rng.next() < 0.55) B = neg(B);
			if (rng.next() < 0.15) A = neg(A);
			return { kind: 'sq', terms: [A, B], n: 2, case: c };
		}
		case 5: {
			const c = pickCase(rng, [
				['tre termini diversi', 0.4],
				['termini simili', 0.35],
				['frazione', 0.25],
			]);
			if (c === 'termini simili') {
				// (x^2 - 3x + 1)^2
				const [v] = pickLetters(rng, fam, 1);
				const A = mono(rng.pick([1, 1, 1, 2]), lit(v, 2));
				const B = mono(rng.int(1, 4) * sgn(rng, 0.6), lit(v));
				const C = mono(rng.int(1, 5) * sgn(rng, 0.5));
				return { kind: 'tri', terms: [A, B, C], n: 2, case: c };
			}
			const [u, w] = pickLetters(rng, fam, 2);
			const A = mono(rng.pick([1, 1, 2, 3]), lit(u, rng.pick([1, 1, 1, 2])));
			let B = mono(rng.pick([1, 1, 2, 3]) * sgn(rng, 0.5), lit(w));
			let C = mono(rng.int(1, 5) * sgn(rng, 0.5));
			if (c === 'frazione') {
				const fr = rng.pick([q(1, 2), q(1, 3), q(2, 3), q(3, 2)]);
				if (rng.next() < 0.7) C = mono(fr.mul(q(sgn(rng, 0.6))));
				else B = mono(fr.mul(q(sgn(rng, 0.5))), lit(w));
			}
			return { kind: 'tri', terms: [A, B, C], n: 2, case: c };
		}
		case 6: {
			const c = pickCase(rng, [
				['con un numero', 0.4],
				['due lettere', 0.25],
				['segni', 0.2],
				['frazione', 0.15],
			]);
			const [u, w] = pickLetters(rng, fam, 2);
			if (c === 'con un numero') {
				const k = rng.pick([1, 1, 1, 2, 2, 3]);
				const n = rng.int(1, k === 1 ? 5 : k === 2 ? 3 : 2) * sgn(rng, 0.5);
				return { kind: 'cube', terms: [mono(k, lit(u)), mono(n)], n: 3, case: c };
			}
			if (c === 'due lettere') {
				const A = mono(rng.pick([1, 1, 2, 3]), lit(u, rng.pick([1, 1, 2])));
				const B = mono(rng.pick([1, 1, 2, 3]) * sgn(rng, 0.6), lit(w, rng.pick([1, 1, 2])));
				if (A.c.abs().compare(q(3)) === 0 && B.c.abs().compare(q(3)) === 0) return null;
				if (A.c.isOne() && B.c.abs().isOne() && Object.values({ ...A.e, ...B.e }).every((k) => k === 1)) return null;
				return { kind: 'cube', terms: [A, B], n: 3, case: c };
			}
			if (c === 'segni') {
				// (1 - x)^3, (2 - x)^3 or (-x - 1)^3
				const k = rng.pick([1, 1, 2]);
				const n = rng.int(1, k === 1 ? 3 : 2);
				const X = mono(k, lit(u));
				const terms = rng.next() < 0.55 ? [mono(n), neg(X)] : [neg(X), mono(-n)];
				return { kind: 'cube', terms, n: 3, case: c };
			}
			// (1/3 a - 3b^2)^3, (x + 1/2)^3
			const fr = rng.pick([q(1, 2), q(1, 3), q(2, 3), q(3, 2)]);
			let A: Mono;
			let B: Mono;
			if (rng.next() < 0.5) {
				A = mono(rng.pick([1, 1, 2]), lit(u));
				B = mono(fr);
			} else {
				A = mono(fr, lit(u));
				B = mono(rng.pick([1, 2, 3]), lit(w, rng.pick([1, 2])));
			}
			if (rng.next() < 0.6) B = neg(B);
			return { kind: 'cube', terms: [A, B], n: 3, case: c };
		}
		case 7: {
			const c = pickCase(rng, [
				['con un numero', 0.55],
				['due lettere', 0.3],
				['numero primo', 0.15],
			]);
			const n = rng.pick([4, 4, 4, 4, 5, 5, 5, 6]);
			const [u, w] = pickLetters(rng, fam, 2);
			if (c === 'due lettere') {
				const k = n === 4 ? rng.pick([1, 1, 1, 2]) : 1;
				const A = mono(1, lit(u));
				const B = mono(sgn(rng, 0.6), lit(w));
				return { kind: 'pow', terms: rng.next() < 0.5 ? [scale(A, q(k)), B] : [A, scale(B, q(k))], n, case: c };
			}
			const maxN = n === 4 ? 3 : n === 5 ? 2 : 1;
			const N = mono(rng.int(1, maxN));
			let A = mono(1, lit(u, n === 4 && rng.next() < 0.15 ? 2 : 1));
			if (n === 4 && N.c.isOne() && rng.next() < 0.4) A = scale(A, q(2));
			if (c === 'numero primo') return { kind: 'pow', terms: [N, neg(A)], n, case: c };
			return { kind: 'pow', terms: [A, rng.next() < 0.65 ? neg(N) : N], n, case: c };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function coefStats(terms: Mono[]): { num: number; den: number; exp: number } {
	return {
		num: Math.max(...terms.map((t) => Math.abs(t.c.num))),
		den: Math.max(...terms.map((t) => t.c.den)),
		exp: Math.max(0, ...terms.flatMap((t) => Object.values(t.e))),
	};
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = fromParams(sample.params);
	if (!b) return ['params non validi'];
	v.push(...forbidden(sample.problem));
	const r = expansion(b);
	if (problemLatex(b) !== sample.problem) v.push('problema diverso dai parametri');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== polySympy(r) || a.latex !== polyLatex(r) || a.form !== 'expanded') v.push('risposta diversa dallo sviluppo');
	v.push(...forbidden(polyLatex(r)));
	const inputs = b.kind === 'sd' ? b.factors!.flat() : b.terms;
	const si = coefStats(inputs);
	if (si.num > 12 || si.den > 4) v.push('coefficiente del testo fuori intervallo');
	const sr = coefStats(r);
	if (sr.num > 250 || sr.den > 81 || sr.exp > 12) v.push('risultato fuori intervallo');
	const want: Record<number, [Kind, number[]]> = { 1: ['sd', [2]], 2: ['sd', [2]], 3: ['sq', [2]], 4: ['sq', [2]], 5: ['tri', [2]], 6: ['cube', [3]], 7: ['pow', [4, 5, 6]] };
	const w = want[sample.level];
	if (!w) return [...v, `livello sconosciuto ${sample.level}`];
	if (b.kind !== w[0] || !w[1].includes(b.n)) v.push('tipo di prodotto sbagliato per il livello');
	if (b.kind !== 'sd' && collect(b.terms).length !== b.terms.length) v.push('termini simili nel testo');
	if (sample.level === 1 && (!b.same || b.same.c.sign() < 0 || !b.same.c.isInteger() || letters(b.same).length !== 1)) v.push('livello 1: termine uguale kx');
	return v;
}

// ---------------------------------------------------------------------------
// Serialisation, sample, choice

function fromParams(p: Record<string, unknown>): Built | null {
	try {
		const ms = (x: unknown) => (x as unknown[]).map((m) => monoFromJSON(m)!);
		const kind = p.kind as Kind;
		const out: Built = { kind, terms: p.terms ? ms(p.terms) : [], n: p.n as number, case: p.case as string };
		if (kind === 'sd') {
			const f = p.factors as unknown[];
			out.factors = [ms(f[0]), ms(f[1])];
			out.same = monoFromJSON(p.same)!;
			out.change = monoFromJSON(p.change)!;
		}
		if ([...out.terms, ...(out.factors?.flat() ?? [])].some((m) => !m)) return null;
		return out;
	} catch {
		return null;
	}
}

function assemble(b: Built, level: number, seed: number): Sample {
	const r = expansion(b);
	const params: Record<string, unknown> = { kind: b.kind, case: b.case, n: b.n, result: r.map(monoJSON) };
	if (b.kind === 'sd') {
		params.factors = b.factors!.map((f) => f.map(monoJSON));
		params.same = monoJSON(b.same!);
		params.change = monoJSON(b.change!);
	} else params.terms = b.terms.map(monoJSON);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: 'Sviluppa il prodotto notevole.',
		problem: problemLatex(b),
		solution: polyLatex(r),
		steps: steps(b, r),
		answer: { kind: 'expression', value: polySympy(r), latex: polyLatex(r), form: 'expanded' },
		params,
	};
}

const noCoefPow = (m: Mono, k: number): Mono => (k === 0 ? mono(1) : mono(m.c, Object.fromEntries(letters(m).map((v) => [v, m.e[v] * k]))));
const absM = (m: Mono): Mono => mono(m.c.abs(), { ...m.e });

/** The expansions a student gets with the mistakes of the lesson, most common first. */
export function mistakes(b: Built): Mono[][] {
	const two = q(2);
	const out: Mono[][] = [];
	if (b.kind === 'sd') {
		const A = b.same!;
		const B = b.change!;
		out.push([neg(pow(A, 2)), pow(B, 2)]); // terms swapped
		out.push([pow(A, 2), pow(B, 2)]); // + instead of -
		out.push([noCoefPow(A, 2), neg(noCoefPow(B, 2))]); // coefficient not squared
		out.push([pow(A, 2), scale(mul(A, B), q(-2)), pow(B, 2)]); // taken for a square
		return out;
	}
	const [A, B] = b.terms;
	if (b.kind === 'sq') {
		const AB = mul(A, B);
		out.push([pow(A, 2), pow(B, 2)]); // no double product
		out.push([noCoefPow(A, 2), scale(AB, two), noCoefPow(B, 2)]); // coefficient not squared
		out.push([pow(A, 2), scale(AB, q(-2)), pow(B, 2)]); // sign of the double product
		if (AB.c.sign() < 0) out.push([pow(A, 2), neg(pow(B, 2))]); // (x - 3)^2 = x^2 - 9
		out.push([pow(A, 2), AB, pow(B, 2)]); // product not doubled
		return out;
	}
	if (b.kind === 'tri') {
		const C = b.terms[2];
		const sq = [A, B, C].map((m) => pow(m, 2));
		const dp = [mul(A, B), mul(A, C), mul(B, C)].map((m) => scale(m, two));
		out.push([...sq, dp[0], dp[1]]); // last double product forgotten
		out.push([...sq, dp[0], dp[2]]); // middle double product forgotten
		out.push(sq); // sum of the squares
		out.push([...sq, dp[0], dp[1], neg(dp[2])]); // sign of a double product
		out.push([...[A, B, C].map((m) => noCoefPow(m, 2)), ...dp]); // coefficient not squared
		out.push([...sq, ...dp.map((m) => scale(m, q(1, 2)))]); // products not doubled
		return out;
	}
	const n = b.n;
	const r = row(n);
	const termsWith = (f: (k: number) => Mono) => Array.from({ length: n + 1 }, (_, k) => f(k));
	const right = termsWith((k) => scale(mul(pow(A, n - k), pow(B, k)), q(r[k])));
	const s = B.c.sign();
	const signs = [right[0], ...right.slice(1).map((m) => scale(absM(m), q(s)))];
	if (b.kind === 'cube') {
		out.push([pow(A, 3), pow(B, 3)]); // sum of the cubes
		if (A.c.sign() < 0 || B.c.sign() < 0) out.push(right.map(neg)); // (a - b)^3 taken for (b - a)^3
		out.push(signs); // sign of b on every term
		out.push(termsWith((k) => scale(mul(noCoefPow(A, n - k), noCoefPow(B, k)), q(r[k])))); // coefficients not raised
		out.push(termsWith((k) => mul(pow(A, n - k), pow(B, k)))); // 1, 1, 1, 1 instead of 1, 3, 3, 1
		return out;
	}
	out.push(signs); // signs not alternated
	out.push([pow(A, n), pow(B, n)]); // sum of the powers
	out.push(termsWith((k) => scale(mul(pow(A, n - k), pow(B, Math.min(k, 1))), q(r[k])))); // powers of the second term forgotten
	out.push(termsWith((k) => scale(mul(noCoefPow(A, n - k), noCoefPow(B, k)), q(r[k])))); // coefficients not raised
	out.push(termsWith((k) => mul(pow(A, n - k), pow(B, k)))); // coefficients all 1
	return out;
}

const optOf = (terms: Mono[]): Opt => monoOpt(tidy(terms));

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = fromParams(sample.params)!;
	const r = expansion(b);
	const cands = mistakes(b)
		.map(tidy)
		.filter((t) => t.length > 0 && coefStats(t).num <= 5000)
		.map(optOf);
	const fallback = (i: number): Opt | null => {
		const idx = i % r.length;
		const d = q(Math.ceil(i / r.length) * (i % 2 === 0 ? 1 : -1));
		const t = r.map((m, j) => (j === idx ? mono(m.c.add(d), { ...m.e }) : m));
		return t.some((m) => m.c.isZero()) ? null : optOf(t);
	};
	const ch = buildChoice(optOf(r), cands, fallback, rng);
	return { ...ch, options: ch.options.map((o) => ({ ...o, latex: breakLines(o.latex) })) };
}

// ---------------------------------------------------------------------------
// Options on more lines: the answer button has 252 px, KaTeX draws at 16 px (15.75 em).

/** Rough width in em of a polynomial as KaTeX draws it. */
function widthEm(latex: string): number {
	let s = latex;
	let w = 0;
	s = s.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, (_, a: string, b: string) => {
		w += Math.max(a.length, b.length) * 0.36 + 0.3;
		return '';
	});
	s = s.replace(/\^\{?(\d+)\}?/g, (_, d: string) => {
		w += d.length * 0.38 + 0.05;
		return '';
	});
	s = s.replace(/\s[+-]\s/g, () => {
		w += 1.22;
		return '';
	});
	for (const ch of s) w += /\d/.test(ch) ? 0.5 : /[a-z]/.test(ch) ? 0.55 : ch === '-' ? 0.78 : 0;
	return w;
}

/** Maximum width of one line, with a margin under the 15.75 em of the button. */
const LINE_EM = 14;

/** A long polynomial on two or three lines, broken before a + or a - of the sum, lines as even as possible. */
export function breakLines(latex: string): string {
	if (widthEm(latex) <= LINE_EM) return latex;
	const parts = latex.split(/\s(?=[+-]\s)/);
	let best: string[] | null = null;
	let bestW = Infinity;
	const tryCuts = (cuts: number[]) => {
		const bounds = [0, ...cuts, parts.length];
		const lines = bounds.slice(1).map((e, k) => parts.slice(bounds[k], e).join(' '));
		const w = Math.max(...lines.map(widthEm));
		if (w <= LINE_EM && w < bestW) {
			best = lines;
			bestW = w;
		}
	};
	for (let a = 1; a < parts.length; a++) tryCuts([a]);
	if (!best) for (let a = 1; a < parts.length; a++) for (let b = a + 1; b < parts.length; b++) tryCuts([a, b]);
	if (!best) throw new Error(`${ID}: option too wide for three lines: ${latex}`);
	return `\\begin{gathered}${(best as string[]).join(' \\\\ ')}\\end{gathered}`;
}

export const polinomiProdottiNotevoli: Generator = {
	id: ID,
	title: 'Prodotti notevoli',
	levels: {
		1: { label: 'Somma per differenza con un numero', constraints: ['(kx + n)(kx - n), k da 1 a 5, n da 1 a 12', 'il termine uguale è il primo nei due fattori'] },
		2: { label: 'Somma per differenza con monomi', constraints: ['coefficienti, due lettere, esponenti fino a 3, circa 3 su 10 con una frazione', 'termine uguale negativo (circa 1 su 4) o al secondo posto (circa 3 su 10)'] },
		3: { label: 'Quadrato di un binomio con un numero', constraints: ['(kx ± n)^2 con k da 1 a 4 e n da 1 a 9', 'anche (n - x)^2 e (-kx - n)^2'] },
		4: { label: 'Quadrato di un binomio con due monomi', constraints: ['due lettere o una lettera e una frazione, esponenti fino a 3', 'circa 4 su 10 con una frazione'] },
		5: { label: 'Quadrato di un trinomio', constraints: ['tre termini diversi, termini simili da ridurre (circa 1 su 3), una frazione (circa 1 su 4)'] },
		6: { label: 'Cubo di un binomio', constraints: ['con un numero, con due lettere, con i segni scambiati o negativi, con una frazione'] },
		7: { label: 'Potenza di un binomio con il triangolo di Tartaglia', constraints: ['esponente 4, 5 o 6', 'secondo termine un numero piccolo o una lettera'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			let sample: Sample;
			try {
				sample = assemble(b, level, rng.seed);
			} catch {
				continue;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default polinomiProdottiNotevoli;
