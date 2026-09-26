/**
 * Scomposizione con i prodotti notevoli. Spec: specs/exercises/scomposizione-prodotti-notevoli.md
 *
 * Six levels in the order of lesson 35, each adding one difficulty: difference of squares, square
 * of a binomial, sum or difference of cubes, cube of a binomial or square of a trinomial, a common
 * factor collected first, several steps or binomial bases. Built backwards: the factors are chosen
 * first (primitive, irreducible in Z by construction) and the problem is their expanded product.
 * The answer is the factorization carried to the end; the multiple-choice variant mixes wrong
 * products with products that are equal to the polynomial but not factored to the end.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { gcd, q } from '../rational';
import {
	type Mono,
	FAMILIES,
	collect,
	forbidden,
	letters,
	mono,
	monoFromJSON,
	monoJSON,
	monoKey,
	monoLatex,
	monoSympy,
	mul,
	neg,
	pow,
	shuffle,
	sumLatex,
} from '../monomi';

export const ID = 'scomposizione-prodotti-notevoli';

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials, and factorizations

type Poly = Mono[];

interface Factor {
	terms: Poly;
	exp: number;
}

/** k · f1^e1 · f2^e2 ... with k an integer monomial (1 and -1 are written as nothing and "-"). */
interface Fact {
	k: Mono;
	fs: Factor[];
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const deg = (m: Mono) => Object.values(m.e).reduce((s, n) => s + n, 0);

/** Graded lexicographic order: higher total degree first, then higher power of the earlier letter. */
function cmpMono(a: Mono, b: Mono): number {
	const d = deg(b) - deg(a);
	if (d !== 0) return d;
	for (const v of ALPHA) {
		const x = (b.e[v] ?? 0) - (a.e[v] ?? 0);
		if (x !== 0) return x;
	}
	return 0;
}

const ord = (p: Poly): Poly => collect(p).sort(cmpMono);
const polyMul = (a: Poly, b: Poly): Poly => ord(a.flatMap((s) => b.map((t) => mul(s, t))));
function polyPow(a: Poly, n: number): Poly {
	let out: Poly = [mono(1)];
	for (let i = 0; i < n; i++) out = polyMul(out, a);
	return out;
}
const polyKey = (p: Poly): string => ord(p).map(monoKey).join('+') || '0';

function expand(f: Fact): Poly {
	let out: Poly = [f.k];
	for (const fa of f.fs) out = polyMul(out, polyPow(fa.terms, fa.exp));
	return out;
}

const fac = (terms: Poly, exp = 1): Factor => ({ terms: ord(terms), exp });
const F1 = (k: Mono, ...fs: Factor[]): Fact => ({ k, fs });

function kLatex(k: Mono): string {
	if (k.c.isOne() && letters(k).length === 0) return '';
	if (k.c.equals(q(-1)) && letters(k).length === 0) return '-';
	return monoLatex(k);
}

function factLatex(f: Fact): string {
	return kLatex(f.k) + f.fs.map((x) => `(${sumLatex(x.terms)})${x.exp > 1 ? `^${x.exp}` : ''}`).join('');
}

function factSympy(f: Fact): string {
	const parts = f.fs.map((x) => `(${x.terms.map((t) => `(${monoSympy(t)})`).join(' + ')})${x.exp > 1 ? `**${x.exp}` : ''}`);
	const isOne = f.k.c.isOne() && letters(f.k).length === 0;
	return isOne ? parts.join('*') : [`(${monoSympy(f.k)})`, ...parts].join('*');
}

/** A monomial's power as the lesson writes it: "(3x)^2", "4^2", "(-3b)^3", "x^2" for x squared. */
function powLatex(b: Mono, n: number): string {
	const ls = letters(b);
	if (ls.length === 0) return b.c.sign() < 0 ? `(${b.c.toLatex()})^${n}` : `${b.c.toLatex()}^${n}`;
	if (b.c.isOne() && ls.length === 1 && b.e[ls[0]] === 1) return `${ls[0]}^${n}`;
	return `(${monoLatex(b)})^${n}`;
}

/** "9x^2 = (3x)^2", or null when the equality says nothing (x^2 = x^2). */
function powEq(b: Mono, n: number): string | null {
	const p = monoLatex(pow(b, n));
	const r = powLatex(b, n);
	return p === r ? null : `${p} = ${r}`;
}

/** A monomial as a factor after \cdot: in parentheses when negative. */
const fl = (m: Mono) => (m.c.sign() < 0 ? `(${monoLatex(m)})` : monoLatex(m));

// ---------------------------------------------------------------------------
// Specs: the chosen bases, JSON-safe, from which everything else is rebuilt

type Case = 'dq' | 'qb' | 'cubi' | 'cubo' | 'qt' | 'quarta' | 'binomia' | 'sesta' | 'parziale';

interface Spec {
	case: Case;
	k: Mono;
	a: Mono;
	b: Mono;
	c?: Mono;
}

const ONE_M = mono(1);

function answerOf(s: Spec): Fact {
	const { k, a, b } = s;
	const c = s.c ?? ONE_M;
	switch (s.case) {
		case 'dq':
			return F1(k, fac([a, b]), fac([a, neg(b)]));
		case 'qb':
			return F1(k, fac([a, b], 2));
		case 'cubi':
			return F1(k, fac([a, b]), fac([pow(a, 2), neg(mul(a, b)), pow(b, 2)]));
		case 'cubo':
			return F1(k, fac([a, b], 3));
		case 'qt':
			return F1(k, fac([a, b, c], 2));
		case 'quarta':
			return F1(k, fac([pow(a, 2), pow(b, 2)]), fac([a, b]), fac([a, neg(b)]));
		case 'binomia':
			return F1(k, fac([a, b, c]), fac([a, b, neg(c)]));
		case 'sesta':
			return F1(k, fac([a, b]), fac([pow(a, 2), neg(mul(a, b)), pow(b, 2)]), fac([a, neg(b)]), fac([pow(a, 2), mul(a, b), pow(b, 2)]));
		case 'parziale':
			return F1(k, fac([a, b], 2), fac([a, neg(b)]));
	}
}

/** The problem: the expanded product, ordered; with binomial bases, the square trinomial first and then -c^2, as in the lesson. */
function problemOf(s: Spec): Poly {
	if (s.case === 'binomia') return [...polyPow(ord([s.a, s.b]), 2), neg(pow(s.c!, 2))];
	return expand(answerOf(s));
}

// ---------------------------------------------------------------------------
// Construction

const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));
const coprime = (...xs: number[]) => xs.reduce((g, x) => gcd(g, x), 0) === 1;

/** p·v^m with p >= 1. */
const mv = (p: number, v: string, m = 1) => mono(p, { [v]: m });

function coprimePair(rng: Rng, pMax: number, qMax: number, pMin = 1, qMin = 1): [number, number] {
	for (;;) {
		const p = rng.int(pMin, pMax);
		const qq = rng.int(qMin, qMax);
		if (coprime(p, qq)) return [p, qq];
	}
}

/** Second term b: a number q (when `num`) or q·w. */
const second = (qq: number, num: boolean, w: string) => (num ? mono(qq) : mv(qq, w));

function build(rng: Rng, level: number): Spec {
	const fam = rng.pick(FAMILIES);
	const sgn = () => (rng.next() < 0.5 ? 1 : -1);
	switch (level) {
		case 1: {
			if (rng.next() < 0.55) {
				const v = rng.pick(fam);
				const m = rng.next() < 0.2 ? 2 : 1;
				const [p, qq] = coprimePair(rng, m === 2 ? 5 : 9, 10);
				if (m === 2 && isSquare(p) && isSquare(qq)) return build(rng, level);
				return { case: 'dq', k: ONE_M, a: mv(p, v, m), b: mono(qq) };
			}
			const [p, qq] = coprimePair(rng, 9, 9);
			return { case: 'dq', k: ONE_M, a: mv(p, fam[0]), b: mv(qq, rng.pick([fam[1], fam[2]])) };
		}
		case 2: {
			const s = sgn();
			if (rng.next() < 0.6) {
				const v = rng.pick(fam);
				const m = rng.next() < 0.15 ? 2 : 1;
				const [p, qq] = coprimePair(rng, m === 2 ? 3 : 6, 9);
				if (m === 2 && s < 0 && isSquare(p) && isSquare(qq)) return build(rng, level);
				return { case: 'qb', k: ONE_M, a: mv(p, v, m), b: mono(s * qq) };
			}
			const [p, qq] = coprimePair(rng, 6, 6);
			return { case: 'qb', k: ONE_M, a: mv(p, fam[0]), b: mono(s * qq, { [rng.pick([fam[1], fam[2]])]: 1 }) };
		}
		case 3: {
			const s = sgn();
			if (rng.next() < 0.65) {
				const [p, qq] = coprimePair(rng, 5, 5);
				return { case: 'cubi', k: ONE_M, a: mv(p, rng.pick(fam)), b: mono(s * qq) };
			}
			const [p, qq] = coprimePair(rng, 4, 4);
			return { case: 'cubi', k: ONE_M, a: mv(p, fam[0]), b: mono(s * qq, { [rng.pick([fam[1], fam[2]])]: 1 }) };
		}
		case 4: {
			if (rng.next() < 0.6) {
				const s = sgn();
				if (rng.next() < 0.65) {
					const [p, qq] = coprimePair(rng, 3, 4);
					return { case: 'cubo', k: ONE_M, a: mv(p, rng.pick(fam)), b: mono(s * qq) };
				}
				const [p, qq] = coprimePair(rng, 3, 3);
				return { case: 'cubo', k: ONE_M, a: mv(p, fam[0]), b: mono(s * qq, { [fam[1]]: 1 }) };
			}
			const sq = rng.next() < 0.3;
			const p = sq ? 1 : rng.int(1, 2);
			const qq = rng.int(1, 3);
			const r = rng.int(1, 3);
			if (!coprime(p, qq, r)) return build(rng, level);
			return { case: 'qt', k: ONE_M, a: mv(p, fam[0], sq ? 2 : 1), b: mono(sgn() * qq, { [fam[1]]: 1 }), c: mono(sgn() * r) };
		}
		case 5: {
			const u = rng.next();
			const inner: Case = u < 0.35 ? 'dq' : u < 0.7 ? 'qb' : 'cubi';
			const v = fam[0];
			const num = rng.next() < 0.65;
			const w = rng.pick([fam[1], fam[2]]);
			let a: Mono, b: Mono;
			if (inner === 'dq') {
				const [p, qq] = num ? coprimePair(rng, 5, 6) : coprimePair(rng, 4, 4);
				[a, b] = [mv(p, v), second(qq, num, w)];
			} else if (inner === 'qb') {
				const [p, qq] = num ? coprimePair(rng, 4, 5) : coprimePair(rng, 3, 3);
				[a, b] = [mv(p, v), sgn() < 0 ? neg(second(qq, num, w)) : second(qq, num, w)];
			} else {
				const [p, qq] = coprimePair(rng, 3, 3);
				[a, b] = [mv(p, v), sgn() < 0 ? neg(second(qq, num, w)) : second(qq, num, w)];
			}
			// the common factor: a number, a letter (maybe with a number), or a minus sign
			const t = rng.next();
			let k: Mono;
			if (t < 0.4) k = mono(rng.int(2, 7));
			else if (t < 0.7) k = mv(rng.next() < 0.5 ? 1 : rng.int(2, 5), v, rng.int(1, 2));
			else {
				const kk = rng.int(0, 2);
				k = kk === 0 && inner !== 'dq' ? mono(-1) : kk === 2 ? mono(-rng.int(2, 5), { [v]: 1 }) : mono(-rng.int(2, 5));
			}
			return { case: inner, k, a, b };
		}
		case 6: {
			const u = rng.next();
			if (u < 0.35) {
				const [p, qq] = coprimePair(rng, 3, 3);
				const num = rng.next() < 0.6;
				const v = num ? rng.pick(fam) : fam[0];
				const k = rng.next() < 0.35 ? rng.pick([mono(2), mono(3), mv(1, v), mv(2, v), mv(3, v)]) : ONE_M;
				return { case: 'quarta', k, a: mv(p, v), b: second(qq, num, fam[1]) };
			}
			if (u < 0.7) {
				const t = rng.next();
				const p = rng.next() < 0.75 ? 1 : 2;
				if (t < 0.45) {
					// (x ± q)^2 - r^2y^2
					const qq = rng.int(1, 4);
					const r = rng.int(1, 3);
					if (!coprime(p, qq, r)) return build(rng, level);
					return { case: 'binomia', k: ONE_M, a: mv(p, fam[0]), b: mono(sgn() * qq), c: mv(r, fam[1]) };
				}
				if (t < 0.75) {
					// (x ± qy)^2 - r^2z^2
					const qq = rng.int(1, 3);
					const r = rng.int(1, 3);
					if (!coprime(p, qq, r)) return build(rng, level);
					return { case: 'binomia', k: ONE_M, a: mv(p, fam[0]), b: mono(sgn() * qq, { [fam[1]]: 1 }), c: mv(r, fam[2]) };
				}
				// (x ± qy)^2 - r^2
				const qq = rng.int(1, 3);
				const r = rng.int(1, 4);
				if (!coprime(p, qq, r)) return build(rng, level);
				return { case: 'binomia', k: ONE_M, a: mv(p, fam[0]), b: mono(sgn() * qq, { [fam[1]]: 1 }), c: mono(r) };
			}
			if (u < 0.8) {
				const t = rng.int(0, 3);
				const v = rng.pick(fam);
				if (t === 0) return { case: 'sesta', k: ONE_M, a: mv(1, v), b: mono(1) };
				if (t === 1) return { case: 'sesta', k: ONE_M, a: mv(1, v), b: mono(2) };
				if (t === 2) return { case: 'sesta', k: ONE_M, a: mv(2, v), b: mono(1) };
				return { case: 'sesta', k: ONE_M, a: mv(1, fam[0]), b: mv(1, fam[1]) };
			}
			const num = rng.next() < 0.75;
			const [p, qq] = num ? coprimePair(rng, 3, 4) : [rng.int(1, 3), 1];
			return { case: 'parziale', k: ONE_M, a: mv(p, num ? rng.pick(fam) : fam[0]), b: sgn() < 0 ? neg(second(qq, num, fam[1])) : second(qq, num, fam[1]) };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps

const eqs = (xs: (string | null)[]) => xs.filter((x): x is string => x !== null).join(' \\qquad ');

function steps(s: Spec): string[] {
	const { k, a, b } = s;
	const P = problemOf(s);
	const out: string[] = [];
	const hasK = !(k.c.isOne() && letters(k).length === 0);
	const inner: Fact = { k: ONE_M, fs: answerOf(s).fs };
	const innerP = hasK ? expand(inner) : P;
	const pL = sumLatex(P);
	const iL = sumLatex(innerP);
	const kL = kLatex(k);
	if (hasK) {
		const why = k.c.sign() < 0 ? 'Il primo termine è negativo: raccogli il fattore comune con il segno meno' : 'Prima di tutto raccogli il fattore comune';
		out.push(`\\text{${why}: } ${pL} = ${kL}(${iL})`);
	}
	const ans = answerOf(s);
	const final = `${pL} = ${factLatex(ans)}`;
	const bases = (n: number, ...ms: Mono[]) => eqs(ms.map((m) => powEq(m, n)));
	switch (s.case) {
		case 'dq': {
			const bb = bases(2, a, b);
			out.push(`\\text{Due termini, separati da un meno, e ognuno è un quadrato${bb ? ': ' : ''}}${bb ? ` ${bb}` : ''}`);
			out.push(`\\text{Differenza di quadrati, somma per differenza delle basi: } ${iL} = ${powLatex(a, 2)} - ${powLatex(b, 2)} = ${factLatex({ k: ONE_M, fs: ans.fs })}`);
			break;
		}
		case 'qb': {
			const bb = bases(2, a, b.c.sign() < 0 ? neg(b) : b);
			const dp = mul(mono(2), mul(a, b));
			out.push(`\\text{Tre termini: due quadrati${bb ? ', ' : ''}}${bb ? ` ${bb}` : ''}`);
			out.push(`\\text{Il doppio prodotto delle basi c'è, con il segno ${b.c.sign() < 0 ? 'meno' : 'più'}: } 2 \\cdot ${fl(a)} \\cdot ${fl(b)} = ${monoLatex(dp)}`);
			out.push(`\\text{Quadrato di un binomio: } ${iL} = ${factLatex({ k: ONE_M, fs: ans.fs })}`);
			break;
		}
		case 'cubi': {
			const bb = bases(3, a, b.c.sign() < 0 ? neg(b) : b);
			const sum = b.c.sign() > 0;
			out.push(`\\text{Due termini, ognuno è un cubo${bb ? ': ' : ''}}${bb ? ` ${bb}` : ''}`);
			out.push(`\\text{${sum ? 'Somma' : 'Differenza'} di cubi: } ${iL} = ${factLatex({ k: ONE_M, fs: ans.fs })}`);
			out.push(`\\text{Il falso quadrato } ${sumLatex(ans.fs[1].terms)} \\text{ è irriducibile: la scomposizione è finita}`);
			break;
		}
		case 'cubo': {
			const bb = bases(3, a, b);
			out.push(`\\text{Quattro termini: due cubi${bb ? ', ' : ''}}${bb ? ` ${bb}` : ''}`);
			const t1 = mul(mono(3), mul(pow(a, 2), b));
			const t2 = mul(mono(3), mul(a, pow(b, 2)));
			out.push(`\\text{I tripli prodotti ci sono, con i loro segni: } 3 \\cdot ${powLatex(a, 2)} \\cdot ${fl(b)} = ${monoLatex(t1)} \\qquad 3 \\cdot ${monoLatex(a)} \\cdot ${powLatex(b, 2)} = ${monoLatex(t2)}`);
			out.push(`\\text{Cubo di un binomio: } ${final}`);
			break;
		}
		case 'qt': {
			const c = s.c!;
			const abs = (m: Mono) => (m.c.sign() < 0 ? neg(m) : m);
			const bb = bases(2, a, abs(b), abs(c));
			out.push(`\\text{Sei termini: tre quadrati${bb ? ', ' : ''}}${bb ? ` ${bb}` : ''}`);
			const dp = (x: Mono, y: Mono) => `2 \\cdot ${fl(x)} \\cdot ${fl(y)} = ${monoLatex(mul(mono(2), mul(x, y)))}`;
			out.push(`\\text{I tre doppi prodotti, con le basi scelte per avere i segni del polinomio: } ${dp(a, b)} \\qquad ${dp(a, c)} \\qquad ${dp(b, c)}`);
			out.push(`\\text{Quadrato di un trinomio: } ${final}`);
			break;
		}
		case 'quarta': {
			const a2 = pow(a, 2);
			const b2 = pow(b, 2);
			out.push(`\\text{Differenza di quadrati: } ${iL} = ${powLatex(a2, 2)} - ${powLatex(b2, 2)} = (${sumLatex(ord([a2, b2]))})(${sumLatex(ord([a2, neg(b2)]))})`);
			out.push(`\\text{Il fattore } ${sumLatex(ord([a2, b2]))} \\text{ è una somma di quadrati, irriducibile; } ${sumLatex(ord([a2, neg(b2)]))} \\text{ è ancora una differenza di quadrati}`);
			out.push(`${sumLatex(ord([a2, neg(b2)]))} = (${sumLatex(ord([a, b]))})(${sumLatex(ord([a, neg(b)]))})`);
			out.push(`\\text{Scomposizione finita: } ${final}`);
			break;
		}
		case 'binomia': {
			const c = s.c!;
			const A = ord([a, b]);
			const AL = sumLatex(A);
			out.push(`\\text{I primi tre termini sono il quadrato di un binomio: } ${sumLatex(polyPow(A, 2))} = (${AL})^2`);
			out.push(`\\text{Differenza di quadrati con basi } ${AL} \\text{ e } ${monoLatex(c)}`);
			out.push(`${pL} = (${AL})^2 - ${powLatex(c, 2)} = ${factLatex(ans)}`);
			break;
		}
		case 'sesta': {
			const a3 = pow(a, 3);
			const b3 = pow(b, 3);
			out.push(`\\text{È una differenza di quadrati e anche di cubi: parti dai quadrati}`);
			out.push(`${pL} = ${powLatex(a3, 2)} - ${powLatex(b3, 2)} = (${sumLatex(ord([a3, b3]))})(${sumLatex(ord([a3, neg(b3)]))})`);
			out.push(`\\text{Ogni fattore è una somma o una differenza di cubi, e i falsi quadrati sono irriducibili: } ${final}`);
			break;
		}
		case 'parziale': {
			const a2 = pow(a, 2);
			const b2 = pow(b, 2);
			const nb2 = neg(b2);
			const A = sumLatex(ord([a, b]));
			out.push(`\\text{Raccoglimento parziale, a coppie: } ${pL} = ${kLatex(a2)}(${A}) - ${kLatex(b2)}(${A}) = (${A})(${sumLatex(ord([a2, nb2]))})`);
			out.push(`\\text{Differenza di quadrati: } ${sumLatex(ord([a2, nb2]))} = (${sumLatex(ord([a, b]))})(${sumLatex(ord([a, neg(b)]))})`);
			out.push(`\\text{Il fattore } ${sumLatex(ord([a, b]))} \\text{ compare due volte: } ${final}`);
			break;
		}
	}
	if (hasK && s.case !== 'quarta') out.push(`\\text{Con il fattore raccolto: } ${final}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample

function specJSON(s: Spec) {
	return { case: s.case, k: monoJSON(s.k), a: monoJSON(s.a), b: monoJSON(s.b), ...(s.c ? { c: monoJSON(s.c) } : {}) };
}

function parseSpec(p: Record<string, unknown>): Spec | null {
	const cases: Case[] = ['dq', 'qb', 'cubi', 'cubo', 'qt', 'quarta', 'binomia', 'sesta', 'parziale'];
	const sp = p.spec as Record<string, unknown> | undefined;
	if (!sp || !cases.includes(sp.case as Case)) return null;
	const k = monoFromJSON(sp.k);
	const a = monoFromJSON(sp.a);
	const b = monoFromJSON(sp.b);
	const c = sp.c === undefined ? undefined : monoFromJSON(sp.c);
	if (!k || !a || !b || c === null) return null;
	return { case: sp.case as Case, k, a, b, ...(c ? { c } : {}) };
}

/** The case name the checker counts: L5 by the product inside, L1-L4 and L6 by the product. */
function caseLabel(s: Spec, level: number): string {
	if (level === 1 || level === 2 || level === 3) return letters(s.b).length ? 'due lettere' : 'lettera e numero';
	if (level === 4) return s.case === 'cubo' ? 'cubo di un binomio' : 'quadrato di un trinomio';
	if (level === 5) return s.case === 'dq' ? 'differenza di quadrati' : s.case === 'qb' ? 'quadrato di un binomio' : 'somma o differenza di cubi';
	return { quarta: 'due differenze di quadrati', binomia: 'base binomia', sesta: 'sesta potenza', parziale: 'raccoglimento parziale' }[s.case as 'quarta'] ?? s.case;
}

function assemble(s: Spec, level: number, seed: number): Sample {
	const P = problemOf(s);
	const ans = answerOf(s);
	const pL = sumLatex(P);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: 'Scomponi in fattori il polinomio.',
		problem: pL,
		solution: `${pL} = ${factLatex(ans)}`,
		steps: steps(s),
		answer: { kind: 'expression', value: factSympy(ans), latex: factLatex(ans), form: 'factored' },
		params: { case: caseLabel(s, level), spec: specJSON(s) },
	};
}

// ---------------------------------------------------------------------------
// Checks

const MAX_COEF = 250;

function primitive(p: Poly): boolean {
	const g = p.reduce((acc, t) => gcd(acc, Math.abs(t.c.num)), 0);
	if (g !== 1 || p.some((t) => !t.c.isInteger())) return false;
	return !ALPHA.split('').some((v) => p.every((t) => (t.e[v] ?? 0) > 0));
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const s = parseSpec(sample.params);
	if (!s) return ['params non validi'];
	const lvl = sample.level;
	const P = problemOf(s);
	const ans = answerOf(s);
	v.push(...forbidden(sample.problem), ...forbidden(factLatex(ans)));
	if (sample.problem !== sumLatex(P)) v.push('testo diverso dal polinomio');
	if (polyKey(expand(ans)) !== polyKey(P)) v.push('la scomposizione non ridà il polinomio');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.latex !== factLatex(ans) || a.value !== factSympy(ans) || a.form !== 'factored') v.push('risposta diversa dalla scomposizione');
	if (P.some((t) => !t.c.isInteger() || Math.abs(t.c.num) > MAX_COEF)) v.push(`coefficiente oltre ${MAX_COEF}`);
	if (collect(P).length !== P.length) v.push('termini simili nel testo');
	for (const f of ans.fs) if (!primitive(f.terms) || f.terms.length < 2) v.push(`fattore non primitivo: ${sumLatex(f.terms)}`);
	if (!s.k.c.isInteger()) v.push('fattore comune non intero');
	const hasK = !(s.k.c.isOne() && letters(s.k).length === 0);
	const n = P.length;
	const want: Record<number, { cases: Case[]; terms: number[]; k: boolean }> = {
		1: { cases: ['dq'], terms: [2], k: false },
		2: { cases: ['qb'], terms: [3], k: false },
		3: { cases: ['cubi'], terms: [2], k: false },
		4: { cases: ['cubo', 'qt'], terms: [4, 6], k: false },
		5: { cases: ['dq', 'qb', 'cubi'], terms: [2, 3], k: true },
		6: { cases: ['quarta', 'binomia', 'sesta', 'parziale'], terms: [2, 4], k: false },
	};
	const w = want[lvl];
	if (!w) return [...v, `livello sconosciuto ${lvl}`];
	if (!w.cases.includes(s.case)) v.push(`caso ${s.case} fuori dal livello`);
	if (!w.terms.includes(n)) v.push(`${n} termini nel testo`);
	if (lvl === 5 && !hasK) v.push('al livello 5 serve un fattore comune');
	if (lvl !== 5 && lvl !== 6 && hasK) v.push('fattore comune fuori dai livelli 5 e 6');
	if (lvl === 6 && hasK && s.case !== 'quarta') v.push('fattore comune solo con le quarte potenze');
	if (P[0].c.sign() < 0 && s.k.c.sign() > 0) v.push('primo termine negativo senza il meno raccolto');
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

interface Cand {
	f: Fact;
	/** Equal to the polynomial, but with a factor that still splits. */
	inc?: boolean;
}

function candidates(s: Spec): Cand[] {
	const { k, a, b } = s;
	const c = s.c ?? ONE_M;
	const nb = neg(b);
	const out: Cand[] = [];
	const W = (...fs: Factor[]) => out.push({ f: F1(k, ...fs) });
	const hasK = !(k.c.isOne() && letters(k).length === 0);
	if (hasK && (s.case === 'dq' || s.case === 'qb' || s.case === 'cubi' || s.case === 'quarta')) {
		// stopped after the common factor, or the common factor forgotten
		const innerP = expand({ k: ONE_M, fs: answerOf(s).fs });
		out.push({ f: F1(k, fac(innerP)), inc: true });
		if (k.c.sign() < 0) out.push({ f: { k: neg(k), fs: answerOf(s).fs } });
		out.push({ f: { k: ONE_M, fs: answerOf(s).fs } });
	}
	switch (s.case) {
		case 'dq':
			W(fac([a, nb], 2)); // a^2 - b^2 = (a - b)^2
			W(fac([a, b], 2));
			if (Math.abs(b.c.num) <= 4 && Math.abs(b.c.num) > 1) W(fac([a, mono(b.c.mul(b.c), b.e)]), fac([a, neg(mono(b.c.mul(b.c), b.e))])); // square root of the coefficient forgotten
			out.push({ f: F1(neg(k), fac([a, b]), fac([a, nb])) }); // bases swapped: (b + a)(b - a)
			if (hasK) W(fac([pow(a, 2), pow(b, 2)])); // sign changed inside the bracket
			break;
		case 'qb':
			W(fac([a, nb], 2));
			W(fac([a, b]), fac([a, nb]));
			W(fac([a, mul(mono(2), b)], 2)); // the double product taken as the base
			break;
		case 'cubi':
			W(fac([a, b], 3)); // a^3 + b^3 = (a + b)^3
			W(fac([a, b]), fac([a, nb], 2)); // false square written as a square
			W(fac([a, b]), fac([pow(a, 2), mul(a, b), pow(b, 2)])); // sign in the false square
			W(fac([a, nb]), fac([pow(a, 2), neg(mul(a, b)), pow(b, 2)])); // sign of the first factor
			break;
		case 'cubo':
			W(fac([a, nb], 3));
			out.push({ f: F1(neg(k), fac([a, nb], 3)) }); // the sign outside the cube
			W(fac([a, b]), fac([pow(a, 2), neg(mul(a, b)), pow(b, 2)])); // read as a sum of cubes
			W(fac([a, b], 2), fac([a, nb]));
			break;
		case 'qt':
			W(fac([a, neg(b), c], 2));
			W(fac([a, b, neg(c)], 2));
			W(fac([a, neg(b), neg(c)], 2));
			break;
		case 'quarta':
			out.unshift({ f: F1(k, fac([pow(a, 2), pow(b, 2)]), fac([pow(a, 2), neg(pow(b, 2))])), inc: true }); // stopped too early
			W(fac([pow(a, 2), pow(b, 2)]), fac([a, nb], 2)); // a^2 - b^2 read as (a - b)^2
			W(fac([a, b], 3), fac([a, nb])); // a^2 + b^2 = (a + b)^2
			W(fac([a, b], 2), fac([a, nb], 2));
			break;
		case 'binomia':
			W(fac([a, nb, c]), fac([a, nb, neg(c)])); // sign of the double product
			W(fac([a, b, c]), fac([a, nb, neg(c)])); // brackets forgotten in the second factor
			W(fac([a, b, neg(c)], 2));
			W(fac([a, b, c], 2));
			break;
		case 'sesta':
			out.push({ f: F1(k, fac([pow(a, 3), pow(b, 3)]), fac([pow(a, 3), neg(pow(b, 3))])), inc: true });
			out.push({ f: F1(k, fac([a, b]), fac([a, nb]), fac([pow(a, 4), mul(pow(a, 2), pow(b, 2)), pow(b, 4)])), inc: true });
			W(fac([a, b], 3), fac([a, nb], 3));
			W(fac([a, b], 2), fac([a, nb], 2), fac([pow(a, 2), pow(b, 2)]));
			break;
		case 'parziale':
			out.push({ f: F1(k, fac([a, b]), fac([pow(a, 2), neg(pow(b, 2))])), inc: true });
			W(fac([a, b], 3));
			W(fac([a, nb], 2), fac([a, b]));
			W(fac([a, b]), fac([pow(a, 2), pow(b, 2)]));
			break;
	}
	return out;
}

/** Generic wrong products near the right one: the constant or last term of a factor moved by ±i. */
function nearFact(f: Fact, i: number): Fact | null {
	const fi = (i - 1) % f.fs.length;
	const d = Math.ceil(i / (2 * f.fs.length)) * (i % 2 ? 1 : -1);
	const fa = f.fs[fi];
	const last = fa.terms[fa.terms.length - 1];
	const moved = mono(last.c.add(q(d)), { ...last.e });
	if (moved.c.isZero()) return null;
	const terms = [...fa.terms.slice(0, -1), moved];
	if (!primitive(terms)) return null;
	return { k: f.k, fs: f.fs.map((x, j) => (j === fi ? fac(terms, x.exp) : x)) };
}

/**
 * Estimated width of a LaTeX product at 16 px, in "characters": an exponent counts 0.7 and the caret
 * nothing. Measured with KaTeX on the widest options: about 8 px per unit, so 31 units stay under the
 * 252 px of the answer button with a margin.
 */
function widthUnits(latex: string): number {
	let w = 0;
	for (let i = 0; i < latex.length; i++) {
		if (latex[i] === '^') {
			w += 0.7;
			i++;
		} else w += 1;
	}
	return w;
}

const MAX_UNITS = 31;

/** An option too wide for the button goes on two lines, broken between two factors near the middle. */
function optionLatex(f: Fact): string {
	const one = factLatex(f);
	if (widthUnits(one) <= MAX_UNITS || f.fs.length < 2) return one;
	let best = 1;
	let bestDiff = Infinity;
	for (let cut = 1; cut < f.fs.length; cut++) {
		const l1 = factLatex({ k: f.k, fs: f.fs.slice(0, cut) });
		const l2 = factLatex({ k: ONE_M, fs: f.fs.slice(cut) });
		const d = Math.max(widthUnits(l1), widthUnits(l2));
		if (d < bestDiff) [best, bestDiff] = [cut, d];
	}
	const l1 = factLatex({ k: f.k, fs: f.fs.slice(0, best) });
	const l2 = factLatex({ k: ONE_M, fs: f.fs.slice(best) });
	return `\\begin{gathered}${l1} \\\\ ${l2}\\end{gathered}`;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const s = parseSpec(sample.params)!;
	const ans = answerOf(s);
	const truth = polyKey(problemOf(s));
	const chosen: Fact[] = [ans];
	const seenLatex = new Set([factLatex(ans)]);
	const seenWrong = new Set<string>();
	let incomplete = 0;
	const add = (cand: Cand | null) => {
		if (!cand || chosen.length >= 4) return;
		const L = factLatex(cand.f);
		if (seenLatex.has(L) || forbidden(L).length) return;
		const key = polyKey(expand(cand.f));
		if (cand.inc) {
			if (key !== truth || incomplete >= 2) return;
			incomplete++;
		} else {
			if (key === truth || seenWrong.has(key)) return;
			seenWrong.add(key);
		}
		seenLatex.add(L);
		chosen.push(cand.f);
	};
	candidates(s).forEach(add);
	for (let i = 1; chosen.length < 4 && i < 200; i++) {
		const f = nearFact(ans, i);
		add(f ? { f } : null);
	}
	if (chosen.length < 4) throw new Error(`${ID}: not enough distinct options`);
	const order = shuffle(
		rng,
		chosen.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(chosen[i]), values: [factSympy(chosen[i])] }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

export const scomposizioneProdottiNotevoli: Generator = {
	id: ID,
	title: 'Scomposizione con i prodotti notevoli',
	levels: {
		1: { label: 'Differenza di quadrati', constraints: ['a^2 - b^2 con basi monomi a coefficienti interi primi tra loro', 'b numero (circa 55%) o monomio con un’altra lettera'] },
		2: { label: 'Quadrato di un binomio', constraints: ['tre termini, doppio prodotto con il segno più o meno (metà e metà)', 'basi primitive: la parentesi non ha fattori comuni'] },
		3: { label: 'Somma o differenza di cubi', constraints: ['a^3 ± b^3, basi di primo grado o numeri, coefficienti fino a 125', 'il falso quadrato è irriducibile'] },
		4: { label: 'Cubo di un binomio o quadrato di un trinomio', constraints: ['quattro termini (circa 60%) o sei termini', 'coefficienti fino a 250'] },
		5: { label: 'Raccoglimento e poi prodotto notevole', constraints: ['fattore comune numero, lettera o segno meno', 'dentro: differenza di quadrati, quadrato di binomio o somma e differenza di cubi'] },
		6: { label: 'Più passi o basi binomie', constraints: ['a^4 - b^4, (a ± b)^2 - c^2, a^6 - b^6, raccoglimento parziale', 'ogni fattore della risposta è irriducibile in Z'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const s = build(rng, level);
			const sample = assemble(s, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default scomposizioneProdottiNotevoli;
