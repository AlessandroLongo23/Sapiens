/**
 * Scomposizione con la regola di Ruffini. Spec: specs/exercises/scomposizione-ruffini.md
 *
 * Six levels in the order of lesson 37: recognising a zero or a factor; a cubic with the zero 1 or
 * -1 and a trinomial quotient; a cubic with a missing power; a fractional zero; a quartic (Ruffini
 * twice, often a repeated zero); total collection first, then Ruffini and the trinomial.
 *
 * Built backwards: the zeros (integers, then fractions, then repeated ones) and the final factors
 * are chosen first, then the polynomial is expanded. The steps come from running the lesson's
 * procedure on that polynomial (candidates 1, -1, 2, -2, ... then fractions, the zero just found
 * retried first, rejected candidates never retried), and `check()` requires the procedure to land
 * on the chosen factors. The answer is the complete factorisation over the integers.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, ZERO, gcd, q } from '../rational';
import { type Poly, poly, polyDegree, polyMul, polyToLatex } from '../latex';
import { type Opt, buildChoice, forbidden, shuffle } from '../monomi';

export const ID = 'scomposizione-ruffini';

// ---------------------------------------------------------------------------
// Polynomials (coefficients by degree, exact rationals)

/** qx - p, with q > 0 and gcd(p, q) = 1; never p = 0 (the factor x is collected apart). */
interface Lin {
	q: number;
	p: number;
}

/** k x^m (lins, in the order the procedure finds them) (x^2 + bx + c, irreducible). */
interface Factored {
	k: number;
	m: number;
	lins: Lin[];
	quad: [number, number] | null;
}

const linPoly = (l: Lin): Poly => poly(-l.p, l.q);
const quadPoly = (b: number, c: number): Poly => poly(c, b, 1);
const trim = (p: Poly): Poly => p.slice(0, polyDegree(p) + 1);
const prod = (ps: Poly[]): Poly => ps.reduce((a, b) => polyMul(a, b), poly(1));

function expandF(f: Factored): Poly {
	const xs: Poly = Array.from({ length: f.m + 1 }, (_, i) => (i === f.m ? q(f.k) : ZERO));
	const parts = [xs, ...f.lins.map(linPoly)];
	if (f.quad) parts.push(quadPoly(...f.quad));
	return trim(prod(parts));
}

function evalAt(p: Poly, x: Rational): Rational {
	let v = ZERO;
	for (let i = p.length - 1; i >= 0; i--) v = v.mul(x).add(p[i]);
	return v;
}

/** Synthetic division by x - a: the three rows of the table and the quotient. */
function ruffini(p: Poly, a: Rational): { products: Rational[]; bottom: Rational[]; quotient: Poly; rest: Rational } {
	const n = polyDegree(p);
	const top = Array.from({ length: n + 1 }, (_, i) => p[n - i]);
	const bottom: Rational[] = [top[0]];
	const products: Rational[] = [];
	for (let i = 1; i <= n; i++) {
		const pr = bottom[i - 1].mul(a);
		products.push(pr);
		bottom.push(top[i].add(pr));
	}
	const quotient = bottom.slice(0, n).reverse();
	return { products, bottom, quotient, rest: bottom[n] };
}

const isInt = (p: Poly) => p.every((c) => c.isInteger());
const maxAbs = (p: Poly) => Math.max(...p.map((c) => Math.abs(c.num)));
const zeroCoefs = (p: Poly) => p.slice(0, polyDegree(p)).filter((c) => c.isZero()).length;

function divisors(n: number): number[] {
	const out: number[] = [];
	for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) out.push(d);
	return out;
}

/** Candidates of the lesson, in the order it tries them: integers by size, 1 before -1, then fractions. */
function candidates(p: Poly): Rational[] {
	const c0 = p[0].num;
	const lead = p[polyDegree(p)].num;
	const out: Rational[] = [];
	for (const d of divisors(c0)) out.push(q(d), q(-d));
	const fr: Rational[] = [];
	for (const den of divisors(lead)) {
		if (den === 1) continue;
		for (const num of divisors(c0)) if (gcd(num, den) === 1) fr.push(q(num, den));
	}
	fr.sort((a, b) => a.compare(b));
	for (const f of fr) out.push(f, f.neg());
	return out;
}

// ---------------------------------------------------------------------------
// LaTeX and SymPy strings

const factorWrap = (s: string) => (s.includes('\\frac') ? `\\left(${s}\\right)` : `(${s})`);
const xPow = (m: number) => (m === 0 ? '' : m === 1 ? 'x' : `x^${m}`);
const monoKx = (k: number, m: number) => (k === 1 ? '' : `${k}`) + xPow(m);

function polySym(p: Poly): string {
	let out = '';
	for (let d = polyDegree(p); d >= 0; d--) {
		const c = p[d];
		if (c.isZero()) continue;
		const a = c.abs();
		const lit = d === 0 ? '' : d === 1 ? 'x' : `x**${d}`;
		const body = d === 0 ? a.toString() : a.isOne() ? lit : `${a.toString()}*${lit}`;
		out += out === '' ? (c.sign() < 0 ? '-' : '') + body : (c.sign() < 0 ? ' - ' : ' + ') + body;
	}
	return out || '0';
}

/** A product shown to the student: k x^m (factor)^exp ... */
interface Disp {
	k: number;
	m: number;
	fs: { p: Poly; exp: number }[];
}

function polyKey(p: Poly): string {
	return trim(p)
		.map((c) => c.toString())
		.join(',');
}

function dispOf(f: Factored): Disp {
	const fs: { p: Poly; exp: number }[] = [];
	const add = (p: Poly) => {
		const i = fs.findIndex((g) => polyKey(g.p) === polyKey(p));
		if (i >= 0) fs[i].exp++;
		else fs.push({ p, exp: 1 });
	};
	f.lins.forEach((l) => add(linPoly(l)));
	if (f.quad) add(quadPoly(...f.quad));
	return { k: f.k, m: f.m, fs };
}

function dispLatex(d: Disp): string {
	const head = d.fs.length === 0 ? `${d.k}${xPow(d.m)}` : monoKx(d.k, d.m);
	return head + d.fs.map((g) => factorWrap(polyToLatex(g.p)) + (g.exp > 1 ? `^${g.exp}` : '')).join('');
}

function dispSym(d: Disp): string {
	const parts: string[] = [];
	if (d.k !== 1) parts.push(`${d.k}`);
	if (d.m > 0) parts.push(d.m === 1 ? 'x' : `x**${d.m}`);
	for (const g of d.fs) parts.push(`(${polySym(g.p)})` + (g.exp > 1 ? `**${g.exp}` : ''));
	return parts.join('*') || '1';
}

function dispOpt(d: Disp): Opt {
	const key = `${d.k}|${d.m}|` + d.fs.map((g) => `${polyKey(g.p)}^${g.exp}`).sort().join(';');
	return { latex: dispLatex(d), value: dispSym(d), key };
}

const linLatex = (l: Lin) => polyToLatex(linPoly(l));

// ---------------------------------------------------------------------------
// The lesson's procedure, run on the polynomial: steps and factors found

interface Run {
	steps: string[];
	lins: Lin[];
	quad: [number, number] | null;
	tried: number;
	/** The first zero found (for the level constraints). */
	first: Rational | null;
	/** Degrees of the polynomials divided with Ruffini. */
	divisions: number;
}

const NAMES = ['Q', 'Q_2', 'Q_3', 'Q_4'];

function candidatesLine(p: Poly): string {
	const c0 = Math.abs(p[0].num);
	const lead = p[polyDegree(p)].num;
	const ints = divisors(c0)
		.map((d) => `\\pm ${d}`)
		.join(',\\ ');
	if (lead === 1) return `\\text{Candidati: i divisori di } ${c0}\\text{: } ${ints}`;
	const cands = candidates(p).filter((_, i) => i % 2 === 0);
	const list = cands.map((c) => `\\pm ${c.toLatex()}`).join(',\\ ');
	return `\\text{Termine noto } ${p[0].toLatex()}\\text{, coefficiente direttore } ${lead}\\text{. Candidati: } ${list}`;
}

function evalLatex(name: string, p: Poly, a: Rational): string {
	const call = a.isInteger() ? `${name}(${a.num})` : `${name}\\left(${a.toLatex()}\\right)`;
	const v = evalAt(p, a);
	if (a.isOne() || a.equals(q(-1))) {
		const terms: Rational[] = [];
		for (let d = polyDegree(p); d >= 0; d--) if (!p[d].isZero()) terms.push(d % 2 === 1 && a.sign() < 0 ? p[d].neg() : p[d]);
		const sum = terms.map((t, i) => (i === 0 ? t.toLatex() : t.sign() < 0 ? ` - ${t.abs().toLatex()}` : ` + ${t.toLatex()}`)).join('');
		return `${call} = ${sum} = ${v.toLatex()}`;
	}
	return `${call} = ${v.toLatex()}`;
}

function tableLatex(p: Poly, a: Rational): string {
	const n = polyDegree(p);
	const top = Array.from({ length: n + 1 }, (_, i) => p[n - i].toLatex());
	const r = ruffini(p, a);
	const cols = 'r|' + 'r'.repeat(n) + '|r';
	return (
		`\\begin{array}{${cols}} & ${top.join(' & ')} \\\\ ` +
		`${a.toLatex()} & & ${r.products.map((x) => x.toLatex()).join(' & ')} \\\\ \\hline ` +
		`& ${r.bottom.map((x) => x.toLatex()).join(' & ')} \\end{array}`
	);
}

/** Two integers with sum b and product c, the larger first; null if there are none. */
function trinomialPair(b: number, c: number): [number, number] | null {
	for (let u = Math.abs(c); u >= -Math.abs(c); u--) {
		if (u === 0) continue;
		if (c % u === 0 && u + c / u === b && u >= c / u) return [u, c / u];
	}
	return null;
}

function run(start: Poly, name0: string): Run {
	const steps: string[] = [candidatesLine(start)];
	const lins: Lin[] = [];
	let quad: [number, number] | null = null;
	const rejected = new Set<string>();
	let last: Rational | null = null;
	let first: Rational | null = null;
	let cur = start;
	let name = name0;
	let tried = 0;
	let divisions = 0;
	for (let iter = 0; iter < 6; iter++) {
		const d = polyDegree(cur);
		const lead = cur[d];
		if (d === 1) {
			lins.push({ q: lead.num, p: -cur[0].num });
			break;
		}
		if (d === 2 && lead.isOne()) {
			const b = cur[1].num;
			const c = cur[0].num;
			const pair = trinomialPair(b, c);
			if (pair && b === 0) {
				steps.push(`\\text{Differenza di quadrati: } ${polyToLatex(cur)} = x^2 - ${pair[0]}^2`);
				lins.push({ q: 1, p: -pair[0] }, { q: 1, p: -pair[1] });
				steps.push(`${polyToLatex(cur)} = ${pair.map((u) => factorWrap(polyToLatex(poly(u, 1)))).join('')}`);
			} else if (pair) {
				steps.push(
					`\\text{Trinomio } ${polyToLatex(cur)}\\text{: i numeri con somma } ${b} \\text{ e prodotto } ${c} \\text{ sono } ${pair[0]} \\text{ e } ${pair[1]}`,
				);
				steps.push(`${polyToLatex(cur)} = ${pair.map((u) => factorWrap(polyToLatex(poly(u, 1)))).join('')}`);
				lins.push({ q: 1, p: -pair[0] }, { q: 1, p: -pair[1] });
			} else {
				steps.push(
					`\\text{Trinomio } ${polyToLatex(cur)}\\text{: nessuna coppia di interi ha somma } ${b} \\text{ e prodotto } ${c}\\text{, quindi non si scompone}`,
				);
				quad = [b, c];
			}
			break;
		}
		const cands = candidates(cur).filter((c) => !rejected.has(c.toString()));
		if (last && cands.some((c) => c.equals(last!))) {
			const i = cands.findIndex((c) => c.equals(last!));
			cands.unshift(...cands.splice(i, 1));
		}
		let found: Rational | null = null;
		const evals: string[] = [];
		for (const c of cands) {
			tried++;
			evals.push(evalLatex(name, cur, c));
			if (evalAt(cur, c).isZero()) {
				found = c;
				break;
			}
			rejected.add(c.toString());
		}
		for (let i = 0; i < evals.length; i += 3) steps.push(evals.slice(i, i + 3).join(' \\qquad '));
		if (!found) {
			steps.push(`\\text{Nessun candidato è uno zero: } ${polyToLatex(cur)} \\text{ non si scompone}`);
			quad = null;
			throw new Error('run: no rational zero found');
		}
		first = first ?? found;
		divisions++;
		const zl = found.isInteger() ? `${found.num}` : found.toLatex();
		const lin: Lin = { q: found.den, p: found.num };
		const monic = polyToLatex(poly(found.neg(), 1));
		steps.push(`\\text{Lo zero è } ${zl}\\text{: divido } ${name}(x) \\text{ per } ${monic} \\text{ con la regola di Ruffini}`);
		steps.push(tableLatex(cur, found));
		const r = ruffini(cur, found);
		const next = NAMES[divisions - 1];
		if (found.isInteger()) {
			steps.push(`${name}(x) = ${factorWrap(monic)}(${polyToLatex(r.quotient)})`);
			cur = r.quotient;
		} else {
			const reduced = r.quotient.map((c) => c.div(q(found!.den)));
			steps.push(
				`${name}(x) = ${factorWrap(monic)}(${polyToLatex(r.quotient)}) = ${factorWrap(linLatex(lin))}${polyDegree(reduced) === 0 ? '' : `(${polyToLatex(reduced)})`}`,
			);
			steps.push(`\\text{Il } ${found.den} \\text{ raccolto dal quoziente va nel primo fattore: allo zero } ${zl} \\text{ corrisponde } ${linLatex(lin)}`);
			cur = reduced;
		}
		lins.push(lin);
		last = found;
		if (polyDegree(cur) === 0) break;
		if (polyDegree(cur) >= 2) steps.push(`${next}(x) = ${polyToLatex(cur)}`);
		name = next;
	}
	return { steps, lins, quad, tried, first, divisions };
}

// ---------------------------------------------------------------------------
// Construction

type Case = string;

interface Built {
	f: Factored;
	case: Case;
}

const intIn = (rng: Rng, a: number, b: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
};
const lin1 = (zero: number): Lin => ({ q: 1, p: zero });

/** A monic x^2 + bx + c with no integer zeros (irreducible over the integers). */
function irreducibleQuad(rng: Rng, bMax: number, cMax: number): [number, number] {
	for (;;) {
		const b = rng.int(-bMax, bMax);
		const c = intIn(rng, -cMax, cMax);
		if (!trinomialPair(b, c)) return [b, c];
	}
}

/** Distinct integer triples with a+b+c = 0 or ab+bc+ca = 0 (level 3, three linear factors). */
const L3_TRIPLES: number[][] = (() => {
	const out: number[][] = [];
	for (let a = -6; a <= 6; a++)
		for (let b = a + 1; b <= 6; b++)
			for (let c = b + 1; c <= 6; c++) {
				if (a * b * c === 0) continue;
				const s1 = a + b + c;
				const s2 = a * b + b * c + c * a;
				if ((s1 === 0) !== (s2 === 0)) out.push([a, b, c]);
			}
	return out;
})();

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1: {
			const kind = rng.next() < 0.5 ? 'zero' : 'fattore';
			const a = intIn(rng, -4, 4);
			return { case: kind, f: { k: 1, m: 0, lins: [lin1(a)], quad: [rng.int(-5, 5), intIn(rng, -8, 8)] } };
		}
		case 2: {
			const one = rng.pick([1, -1]);
			const z = [one, intIn(rng, -7, 7, [one]), 0];
			z[2] = intIn(rng, -7, 7, [z[0], z[1]]);
			return { case: 'intero', f: { k: 1, m: 0, lins: z.map(lin1), quad: null } };
		}
		case 3: {
			if (rng.next() < 0.5) return { case: 'tre fattori', f: { k: 1, m: 0, lins: shuffle(rng, rng.pick(L3_TRIPLES)).map(lin1), quad: null } };
			const a = intIn(rng, -5, 5);
			const quad: [number, number] =
				rng.next() < 0.5 ? [a, intIn(rng, -9, 9)] : ((b) => [b, a * b] as [number, number])(intIn(rng, -4, 4));
			return { case: 'trinomio irriducibile', f: { k: 1, m: 0, lins: [lin1(a)], quad } };
		}
		case 4: {
			const den = rng.pick([2, 2, 3, 3, 4]);
			let num = intIn(rng, -5, 5);
			while (gcd(num, den) !== 1) num = intIn(rng, -5, 5);
			const frac: Lin = { q: den, p: num };
			if (rng.next() < 0.5) return { case: 'trinomio irriducibile', f: { k: 1, m: 0, lins: [frac], quad: irreducibleQuad(rng, 3, 4) } };
			const r = intIn(rng, -4, 4);
			const s = intIn(rng, -4, 4, [r]);
			return { case: 'tre fattori', f: { k: 1, m: 0, lins: [lin1(r), lin1(s), frac], quad: null } };
		}
		case 5: {
			if (rng.next() < 0.55) {
				const a = intIn(rng, -3, 3);
				const shape = rng.int(0, 3);
				if (shape === 0) return { case: 'zero ripetuto', f: { k: 1, m: 0, lins: [a, a, a, intIn(rng, -4, 4, [a])].map(lin1), quad: null } };
				if (shape === 1) {
					const b = intIn(rng, -4, 4, [a]);
					return { case: 'zero ripetuto', f: { k: 1, m: 0, lins: [a, a, b, b].map(lin1), quad: null } };
				}
				if (shape === 2) return { case: 'zero ripetuto', f: { k: 1, m: 0, lins: [a, a].map(lin1), quad: irreducibleQuad(rng, 3, 5) } };
				const b = intIn(rng, -4, 4, [a]);
				return { case: 'zero ripetuto', f: { k: 1, m: 0, lins: [a, a, b, intIn(rng, -4, 4, [a, b])].map(lin1), quad: null } };
			}
			const a = intIn(rng, -4, 4);
			const b = intIn(rng, -4, 4, [a]);
			if (rng.next() < 0.35) return { case: 'zeri distinti', f: { k: 1, m: 0, lins: [a, b].map(lin1), quad: irreducibleQuad(rng, 3, 5) } };
			const c = intIn(rng, -4, 4, [a, b]);
			return { case: 'zeri distinti', f: { k: 1, m: 0, lins: [a, b, c, intIn(rng, -4, 4, [a, b, c])].map(lin1), quad: null } };
		}
		case 6: {
			const k = rng.pick([1, 1, 2, 2, 3, 3, 4, 5]);
			const m = k === 1 ? rng.int(1, 2) : rng.int(0, 2);
			const quartic = m <= 1 && k <= 3 && rng.next() < 0.3;
			const a = intIn(rng, -4, 4);
			const b = intIn(rng, -4, 4);
			if (!quartic && rng.next() < 0.2) return { case: 'raccoglimento', f: { k, m, lins: [lin1(a)], quad: irreducibleQuad(rng, 3, 5) } };
			const zs = [a, b, intIn(rng, -4, 4)];
			if (quartic) zs.push(intIn(rng, -4, 4));
			return { case: 'raccoglimento', f: { k, m, lins: zs.map(lin1), quad: null } };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Sample

const PROMPT = 'Scomponi in fattori il polinomio.';
const PROMPT_ZERO = 'Quale di questi numeri è uno zero del polinomio?';
const PROMPT_FACTOR = 'Quale di questi binomi è un fattore del polinomio?';

/** The factors in the order the procedure finds them (the run decides the order). */
function answerFactored(f: Factored, r: Run): Factored {
	return { k: f.k, m: f.m, lins: r.lins, quad: r.quad };
}

function assembleLevel1(b: Built, seed: number, rng: Rng): Sample {
	const P = expandF(b.f);
	const zero = b.f.lins[0].p;
	const cands = candidates(P)
		.map((c) => c.num)
		.filter((c) => c !== zero && c !== -zero && !evalAt(P, q(c)).isZero());
	const others = shuffle(rng, cands).slice(0, 2);
	const nums = [zero, -zero, ...others];
	const asFactor = b.case === 'fattore';
	const optOf = (n: number) =>
		asFactor
			? { latex: polyToLatex(poly(-n, 1)), values: [polySym(poly(-n, 1))] }
			: { latex: `${n}`, values: [`${n}`] };
	const order = shuffle(rng, [0, 1, 2, 3]);
	const choice: ChoiceAnswer = { kind: 'choice', options: order.map((i) => optOf(nums[i])), correct: order.indexOf(0) };
	const steps: string[] = [candidatesLine(P)];
	const evs = nums.map((n) => evalLatex('P', P, q(n)));
	steps.push(evs.slice(0, 2).join(' \\qquad '), evs.slice(2).join(' \\qquad '));
	const fl = polyToLatex(poly(-zero, 1));
	steps.push(
		asFactor
			? `\\text{Solo } P(${zero}) = 0\\text{: il fattore è } x - (${zero}) = ${fl}`
			: `\\text{Solo } P(${zero}) = 0\\text{: lo zero è } ${zero}`,
	);
	if (asFactor && zero > 0) steps[steps.length - 1] = `\\text{Solo } P(${zero}) = 0\\text{: il fattore è } ${fl}`;
	return {
		generatorId: ID,
		level: 1,
		seed,
		prompt: asFactor ? PROMPT_FACTOR : PROMPT_ZERO,
		problem: polyToLatex(P),
		solution: asFactor ? fl : `${zero}`,
		steps,
		answer: choice,
		params: { case: b.case, coeffs: P.map((c) => c.toString()), zero: `${zero}`, options: nums.map(String) },
	};
}

function assemble(b: Built, level: number, seed: number): Sample {
	const P = expandF(b.f);
	const Pl = polyToLatex(P);
	let steps: string[] = [];
	let inner = P;
	let name = 'P';
	if (b.f.k !== 1 || b.f.m > 0) {
		inner = trim(P.slice(b.f.m).map((c) => c.div(q(b.f.k))));
		const xs = b.f.m === 1 ? 'x' : `x^${b.f.m}`;
		const what =
			b.f.k !== 1 && b.f.m > 0
				? `\\text{Raccolgo il MCD dei coefficienti, } ${b.f.k}\\text{, e } ${xs}\\text{: }`
				: b.f.k !== 1
					? `\\text{Raccolgo il MCD dei coefficienti, } ${b.f.k}\\text{: }`
					: `\\text{Raccolgo } ${xs}\\text{: }`;
		steps.push(`${what} ${Pl} = ${monoKx(b.f.k, b.f.m)}(${polyToLatex(inner)})`);
		steps.push(`A(x) = ${polyToLatex(inner)}`);
		name = 'A';
	}
	const r = run(inner, name);
	steps = [...steps, ...r.steps];
	const ans = dispOf(answerFactored(b.f, r));
	const al = dispLatex(ans);
	steps.push(`${Pl} = ${al}`);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: PROMPT,
		problem: Pl,
		solution: `${Pl} = ${al}`,
		steps,
		answer: { kind: 'expression', value: dispSym(ans), latex: al, form: 'factored' },
		params: {
			case: b.case,
			coeffs: P.map((c) => c.toString()),
			k: b.f.k,
			m: b.f.m,
			lins: r.lins.map((l) => [l.q, l.p]),
			quad: r.quad,
			tried: r.tried,
			first: r.first?.toString() ?? null,
		},
	};
}

function parseF(p: Record<string, unknown>): Factored | null {
	if (typeof p.k !== 'number' || typeof p.m !== 'number' || !Array.isArray(p.lins)) return null;
	return {
		k: p.k,
		m: p.m,
		lins: (p.lins as [number, number][]).map(([qq, pp]) => ({ q: qq, p: pp })),
		quad: (p.quad as [number, number] | null) ?? null,
	};
}

// ---------------------------------------------------------------------------
// Checks

const sameMultiset = (a: Lin[], b: Lin[]) => {
	const k = (ls: Lin[]) =>
		ls
			.map((l) => `${l.q},${l.p}`)
			.sort()
			.join(';');
	return k(a) === k(b);
};

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!Array.isArray(p.coeffs)) return ['params non validi'];
	const P = (p.coeffs as string[]).map((s) => Rational.parse(s));
	const d = polyDegree(P);
	v.push(...forbidden(sample.problem));
	if (sample.problem !== polyToLatex(P)) v.push('testo diverso dal polinomio');
	if (!isInt(P)) v.push('coefficienti non interi');
	if (P[0].isZero() && sample.level !== 6) v.push('termine noto nullo');
	if (P[d].sign() <= 0) v.push('coefficiente direttore non positivo');
	const lim = sample.level === 6 ? 60 : sample.level === 1 ? 30 : 40;
	if (maxAbs(P) > lim) v.push(`coefficiente oltre ${lim}`);

	if (sample.level === 1) {
		const a = sample.answer;
		if (a.kind !== 'choice' || a.options.length !== 4) return [...v, 'serve una scelta tra quattro'];
		if (d !== 3 || !P[3].isOne()) v.push('livello 1: terzo grado con coefficiente direttore 1');
		if (Math.abs(P[0].num) > 30) v.push('termine noto oltre 30');
		const nums = (p.options as string[]).map(Number);
		if (new Set(nums).size !== 4) v.push('opzioni ripetute');
		const zeros = nums.filter((n) => evalAt(P, q(n)).isZero());
		if (zeros.length !== 1 || zeros[0] !== nums[0]) v.push('esattamente una opzione deve essere uno zero, la prima');
		if (nums[1] !== -nums[0]) v.push('manca lo zero con il segno cambiato');
		if (nums.some((n) => P[0].num % n !== 0)) v.push('opzione che non divide il termine noto');
		const correct = a.options[a.correct];
		const want = p.case === 'fattore' ? polyToLatex(poly(-nums[0], 1)) : `${nums[0]}`;
		if (correct.latex !== want) v.push('opzione giusta sbagliata');
		for (const o of a.options) v.push(...forbidden(o.latex));
		return v;
	}

	const f = parseF(p);
	if (!f) return [...v, 'params non validi'];
	if (polyKey(expandF(f)) !== polyKey(P)) v.push('i fattori non danno il polinomio');
	for (const l of f.lins) if (l.q < 1 || gcd(l.p, l.q) !== 1 || l.p === 0) v.push(`fattore non primitivo: ${l.q}x - ${l.p}`);
	if (f.quad && trinomialPair(...f.quad)) v.push('trinomio finale scomponibile');
	const a = sample.answer;
	const disp = dispOf(f);
	if (a.kind !== 'expression' || a.form !== 'factored' || a.latex !== dispLatex(disp) || a.value !== dispSym(disp)) v.push('risposta diversa dalla scomposizione');
	if (a.kind === 'expression') v.push(...forbidden(a.latex));
	if (typeof p.tried !== 'number' || p.tried > 8) v.push('troppi candidati da provare');
	const inner = trim(P.slice(f.m).map((c) => c.div(q(f.k))));
	const content = inner.reduce((g, c) => gcd(g, c.num), 0);
	if (!isInt(inner) || content !== 1 || inner[0].isZero()) v.push('raccoglimento non totale');
	const nLin = f.lins.length;
	const distinct = new Set(f.lins.map((l) => `${l.q},${l.p}`)).size === nLin;
	const allMonic = f.lins.every((l) => l.q === 1);
	const first = typeof p.first === 'string' ? Rational.parse(p.first) : null;
	const lvl = sample.level;
	if (lvl >= 2 && lvl <= 5 && (f.k !== 1 || f.m !== 0)) v.push('niente da raccogliere prima del livello 6');
	switch (lvl) {
		case 2:
			if (d !== 3 || !P[3].isOne() || zeroCoefs(P) !== 0 || nLin !== 3 || !distinct || !allMonic) v.push('livello 2: terzo grado completo, monico, tre zeri interi distinti');
			if (!first || Math.abs(first.num) !== 1 || !first.isInteger()) v.push('livello 2: il primo zero è 1 o -1');
			break;
		case 3:
			if (d !== 3 || !P[3].isOne() || zeroCoefs(P) !== 1 || !distinct || !allMonic) v.push('livello 3: terzo grado monico con una potenza mancante');
			if (!first || first.isOne()) v.push('livello 3: il primo zero non è 1');
			if (p.case !== (f.quad ? 'trinomio irriducibile' : 'tre fattori')) v.push('caso sbagliato');
			break;
		case 4:
			if (d !== 3 || P[3].num < 2 || !distinct || f.lins.filter((l) => l.q > 1).length !== 1) v.push('livello 4: terzo grado con uno zero frazionario');
			if (Math.abs(P[0].num) > 24) v.push('livello 4: termine noto oltre 24');
			if (p.case !== (f.quad ? 'trinomio irriducibile' : 'tre fattori')) v.push('caso sbagliato');
			break;
		case 5:
			if (d !== 4 || !P[4].isOne() || !allMonic) v.push('livello 5: quarto grado monico');
			if (Math.abs(P[0].num) > 48) v.push('livello 5: termine noto oltre 48');
			if (p.case !== (distinct ? 'zeri distinti' : 'zero ripetuto')) v.push('caso sbagliato');
			break;
		case 6:
			if (f.k === 1 && f.m === 0) v.push('livello 6: serve un raccoglimento');
			if (d > 5 || polyDegree(inner) < 3 || !allMonic) v.push('livello 6: parentesi di grado 3 o 4, totale al massimo 5');
			break;
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const f = parseF(sample.params)!;
	const ok = dispOpt(dispOf(f));
	const cands: (Opt | null)[] = [];
	const rest = (from: number): Poly => {
		const parts = f.lins.slice(from).map(linPoly);
		if (f.quad) parts.push(quadPoly(...f.quad));
		return trim(prod(parts));
	};
	const partial = (j: number): Opt | null => {
		// stopped after j factors: the rest left expanded (only when it still splits)
		const nRest = f.lins.length - j + (f.quad ? 1 : 0);
		if (nRest < 2) return null;
		const d = dispOf({ ...f, lins: f.lins.slice(0, j), quad: null });
		d.fs.push({ p: rest(j), exp: 1 });
		return dispOpt(d);
	};
	const flip = (ls: Lin[]) => ls.map((l) => ({ q: l.q, p: -l.p }));
	const n = f.lins.length;
	// 1. sign of the factor: zero a written as x + a
	cands.push(dispOpt(dispOf({ ...f, lins: flip(f.lins) })));
	// 2. stopped after the first division (or, at level 6, right after collecting)
	if (sample.level === 6) {
		const d: Disp = { k: f.k, m: f.m, fs: [{ p: rest(0), exp: 1 }] };
		cands.push(dispOpt(d));
	}
	cands.push(partial(1));
	// 3. level-specific
	if (sample.level === 4) {
		const fr = f.lins.find((l) => l.q > 1)!;
		const d = dispOf({ ...f, lins: f.lins.filter((l) => l !== fr) });
		d.fs.unshift({ p: [q(-fr.p, fr.q), q(1)], exp: 1 });
		cands.push(dispOpt(d)); // lost coefficient
		cands.push(dispOpt(dispOf({ ...f, lins: f.lins.map((l) => (l === fr ? { q: l.q, p: -l.p } : l)) })));
	}
	if (sample.level === 6) {
		if (f.k > 1) cands.push(dispOpt(dispOf({ ...f, k: 1 }))); // the number collected is lost
		if (f.m > 0) cands.push(dispOpt(dispOf({ ...f, m: f.m - 1 })));
	}
	const disp = dispOf(f);
	const rep = disp.fs.findIndex((g) => g.exp > 1);
	if (rep >= 0) {
		const d = dispOf(f);
		d.fs[rep].exp--;
		cands.push(dispOpt(d)); // a repeated zero counted once less
	}
	// trinomial with the signs swapped
	if (n >= 2 && !f.quad) cands.push(dispOpt(dispOf({ ...f, lins: [...f.lins.slice(0, n - 2), ...flip(f.lins.slice(n - 2))] })));
	cands.push(partial(2));
	if (f.quad) {
		// the irreducible trinomial with a sign changed
		const [b, c] = f.quad;
		if (b !== 0) cands.push(dispOpt(dispOf({ ...f, quad: [-b, c] })));
		cands.push(dispOpt(dispOf({ ...f, quad: [b, -c] })));
	}
	const fr = f.lins.find((l) => l.q > 1);
	if (fr) {
		// stopped before collecting the denominator: (x - p/q)(q x^2 + ...)
		const d = dispOf({ ...f, lins: f.lins.filter((l) => l !== fr) });
		d.fs = [{ p: [q(-fr.p, fr.q), q(1)], exp: 1 }, { p: trim(polyMul(poly(fr.q), prodOthers(f, fr))), exp: 1 }];
		cands.push(dispOpt(d));
	}
	const lead = cands.slice(0, 2);
	const tail = shuffle(rng, cands.slice(2));
	return buildChoice(
		ok,
		[...lead, ...tail],
		(i) => {
			const j = i % n;
			const delta = Math.ceil(i / n) * (i % 2 ? 1 : -1);
			const l = f.lins[j];
			const p2 = l.p + delta * (l.q === 1 ? 1 : 2);
			if (p2 === 0 || gcd(p2, l.q) !== 1) return null;
			return dispOpt(dispOf({ ...f, lins: f.lins.map((x, t) => (t === j ? { q: l.q, p: p2 } : x)) }));
		},
		rng,
	);
}

/** Product of all the factors except the linear one `skip`, expanded. */
function prodOthers(f: Factored, skip: Lin): Poly {
	const parts = f.lins.filter((l) => l !== skip).map(linPoly);
	if (f.quad) parts.push(quadPoly(...f.quad));
	return trim(prod(parts));
}

// ---------------------------------------------------------------------------

export const scomposizioneRuffini: Generator = {
	id: ID,
	title: 'Scomposizione con la regola di Ruffini',
	levels: {
		1: { label: 'Riconoscere uno zero o un fattore', constraints: ['terzo grado, coefficiente direttore 1, termine noto fino a 30', 'quattro opzioni tra i divisori del termine noto, una sola è uno zero'] },
		2: { label: 'Zero 1 o -1, poi il trinomio', constraints: ['terzo grado completo, coefficiente direttore 1', 'tre zeri interi distinti tra -7 e 7, uno è 1 o -1'] },
		3: { label: 'Una potenza mancante', constraints: ['terzo grado con il termine in x^2 o in x nullo', 'il primo zero non è 1; il trinomio finale a volte non si scompone'] },
		4: { label: 'Uno zero frazionario', constraints: ['coefficiente direttore 2, 3 o 4', 'uno zero p/q, fattore qx - p'] },
		5: { label: 'Quarto grado, Ruffini due volte', constraints: ['quarto grado, coefficiente direttore 1', 'circa metà con uno zero ripetuto'] },
		6: { label: 'Raccoglimento, Ruffini e trinomio', constraints: ['prima si raccoglie il MCD dei coefficienti o una potenza di x', 'grado al massimo 5'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			let sample: Sample;
			try {
				if (level === 1) sample = assembleLevel1(b, rng.seed, rng);
				else {
					sample = assemble(b, level, rng.seed);
					const f = parseF(sample.params)!;
					if (!sameMultiset(f.lins, b.f.lins) || JSON.stringify(f.quad) !== JSON.stringify(b.f.quad)) continue;
				}
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

export default scomposizioneRuffini;
