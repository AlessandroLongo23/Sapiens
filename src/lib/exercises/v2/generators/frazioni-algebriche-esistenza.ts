/**
 * Frazioni algebriche e condizioni di esistenza. Spec: specs/exercises/frazioni-algebriche-esistenza.md
 *
 * Seven levels in the order of lesson 46: the value of a fraction at a given point (or "non esiste"),
 * then the C.E. with a first-degree denominator, a monomial or a common factor, a difference of squares
 * or a square, a trinomial, factorizations in more steps (a factor that never vanishes, two letters),
 * and an expression with several fractions.
 *
 * Built backwards: the factors of every denominator are chosen first, so the excluded values are known
 * and rational by construction; the denominator shown is their product. A quadratic factor is either
 * split into linear factors or a sum of even powers with positive coefficients plus a positive number,
 * which never vanishes (no irrational zeros, as the lesson asks). The answer is the set of excluded
 * values (`set`, empty for "nessuna condizione"), the value of the fraction (`number`), or, when it
 * cannot be a set of numbers (two letters, "non esiste"), a multiple choice.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { type Mono, collect, forbidden, mono, monoFromJSON, monoJSON, monoLatex, mul, polyLatex, shuffle } from '../monomi';

export const ID = 'frazioni-algebriche-esistenza';

const MAX_COEF = 100;

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials, denominators as products of factors

type P = Mono[];

/** A factor of the denominator, `k` times; `rev` writes it by increasing powers (3 - 2x). */
interface Fac {
	p: P;
	k: number;
	rev?: boolean;
}

/** pre * product of the factors; `pre` is a positive integer times letters (1, 2, 3x, 2xy). `rev`: the expanded denominator by increasing powers. */
interface Den {
	pre: Mono;
	fs: Fac[];
	rev?: boolean;
}

interface Frac {
	num: P;
	den: Den;
	sign: 1 | -1;
}

/** u ≠ s·w, or u ≠ 0 when w is absent: the condition given by a factor with two letters. */
interface Cond {
	u: string;
	w?: string;
	s?: 1 | -1;
}

interface Build {
	case: string;
	fracs: Frac[];
	/** Level 1: the values of the letters. */
	at?: Record<string, number>;
	/** A finer label inside the case, for the review and the checker. */
	sub?: string;
}

const M = (c: number | Rational, e: Record<string, number> = {}): Mono => mono(c, e);
const ONE_M = M(1);
const XM = (v = 'x', n = 1) => M(1, { [v]: n });

function pmul(a: P, b: P): P {
	const out: Mono[] = [];
	for (const s of a) for (const t of b) out.push(mul(s, t));
	return collect(out);
}

/** a·v + b */
const lin = (a: number, b: number, v = 'x'): P => collect([M(a, { [v]: 1 }), M(b)]);
/** c·u + d·w */
const lin2 = (c: number, u: string, d: number, w: string): P => collect([M(c, { [u]: 1 }), M(d, { [w]: 1 })]);

const tdeg = (m: Mono) => Object.values(m.e).reduce((s, n) => s + n, 0);
const mainLetter = (p: P) => [...new Set(p.flatMap((m) => Object.keys(m.e)))].sort()[0] ?? 'x';
const lettersOf = (p: P) => [...new Set(p.flatMap((m) => Object.keys(m.e)))].sort();

/** Decreasing powers of the first letter (alphabetically), then decreasing total degree; `rev` the other way round. */
function order(p: P, rev = false): P {
	const v = mainLetter(p);
	const s = [...collect(p)].sort((a, b) => (b.e[v] ?? 0) - (a.e[v] ?? 0) || tdeg(b) - tdeg(a));
	return rev ? s.reverse() : s;
}

const pl = (p: P, rev = false) => polyLatex(order(p, rev));

function denPoly(d: Den): P {
	let out: P = [d.pre];
	for (const f of d.fs) for (let i = 0; i < f.k; i++) out = pmul(out, f.p);
	return collect(out);
}

const denLatex = (d: Den) => pl(denPoly(d), d.rev);
const fracLatex = (f: Frac) => `\\frac{${pl(f.num)}}{${denLatex(f.den)}}`;

const isOneM = (m: Mono) => m.c.isOne() && Object.keys(m.e).length === 0;
const preLatex = (pre: Mono) => (isOneM(pre) ? '' : monoLatex(pre));
const facLatex = (f: Fac) => `(${pl(f.p, f.rev)})${f.k > 1 ? `^${f.k}` : ''}`;

function factoredLatex(d: Den): string {
	if (d.fs.length === 0) return monoLatex(d.pre);
	return preLatex(d.pre) + d.fs.map(facLatex).join('');
}

function evalP(p: P, at: Record<string, Rational>): Rational {
	let s = q(0);
	for (const m of p) {
		let t = m.c;
		for (const [v, n] of Object.entries(m.e)) for (let i = 0; i < n; i++) t = t.mul(at[v]);
		s = s.add(t);
	}
	return s;
}

/** The same with the classic slip on (-3)^2 written without parentheses: an even power of a negative number comes out negative. */
function evalWrongSquare(p: P, at: Record<string, Rational>): Rational {
	let s = q(0);
	for (const m of p) {
		let t = m.c;
		for (const [v, n] of Object.entries(m.e)) {
			let pw = q(1);
			for (let i = 0; i < n; i++) pw = pw.mul(at[v].abs());
			t = t.mul(at[v].sign() < 0 ? pw.neg() : pw);
		}
		s = s.add(t);
	}
	return s;
}

/** A number in a substitution: negative numbers in parentheses, fractions in parentheses under a power. */
function subValue(r: Rational, n: number): string {
	const s = r.toLatex();
	const paren = r.sign() < 0 || (!r.isInteger() && n > 1);
	const w = paren ? (r.isInteger() ? `(${s})` : `\\left(${s}\\right)`) : s;
	return n > 1 ? `${w}^${n}` : w;
}

/** The polynomial with the numbers in place of the letters, as the lesson writes it: "1 + 2 \cdot (-2)", "(-3)^2 - 1". */
function subLatex(p: P, at: Record<string, Rational>, rev = false): string {
	return order(p, rev)
		.map((m, i) => {
			const vs = Object.keys(m.e).sort();
			const abs = m.c.abs();
			const vals = vs.map((v) => subValue(at[v], m.e[v]));
			let body: string;
			if (vs.length === 0) body = abs.toLatex();
			else if (abs.isOne()) body = vals.join(' \\cdot ');
			else body = [abs.toLatex(), ...vals].join(' \\cdot ');
			if (i === 0) return m.c.sign() < 0 ? `-${body}` : body;
			return m.c.sign() < 0 ? ` - ${body}` : ` + ${body}`;
		})
		.join('');
}

// ---------------------------------------------------------------------------
// Zeros and conditions

const degIn = (p: P, v: string) => Math.max(0, ...p.map((m) => m.e[v] ?? 0));

/** Root of a linear polynomial a·v + b in one letter. */
function linRoot(p: P): Rational {
	const v = mainLetter(p);
	const a = p.find((m) => (m.e[v] ?? 0) === 1)!.c;
	const b = p.find((m) => Object.keys(m.e).length === 0)?.c ?? q(0);
	return b.neg().div(a);
}

/** Even powers, positive coefficients and a positive constant: never zero (the lesson's argument). */
function neverZero(p: P): boolean {
	const hasConst = p.some((m) => Object.keys(m.e).length === 0 && m.c.sign() > 0);
	return hasConst && p.every((m) => m.c.sign() > 0 && Object.values(m.e).every((n) => n % 2 === 0));
}

function uniqSorted(vals: Rational[]): Rational[] {
	const out: Rational[] = [];
	for (const r of [...vals].sort((a, b) => a.compare(b))) if (!out.some((t) => t.equals(r))) out.push(r);
	return out;
}

/** Excluded values of a denominator in one letter. */
function denZeros(d: Den): Rational[] {
	const out: Rational[] = [];
	if (Object.keys(d.pre.e).length) out.push(q(0));
	for (const f of d.fs) {
		const ls = lettersOf(f.p);
		if (ls.length !== 1) throw new Error('factor with more than one letter');
		const dg = degIn(f.p, ls[0]);
		if (dg === 1) out.push(linRoot(f.p));
		else if (!neverZero(f.p)) throw new Error(`factor ${pl(f.p)} is neither linear nor never zero`);
	}
	return uniqSorted(out);
}

/** Conditions of a denominator in two letters: one per letter of `pre`, one per linear factor u ± w. */
function denConds(d: Den): Cond[] {
	const out: Cond[] = Object.keys(d.pre.e)
		.sort()
		.map((u) => ({ u }));
	for (const f of d.fs) {
		const [u, w] = lettersOf(f.p);
		const cu = f.p.find((m) => m.e[u])!.c.num;
		const cw = f.p.find((m) => m.e[w])!.c.num;
		out.push({ u, w, s: (-cw / cu > 0 ? 1 : -1) as 1 | -1 });
	}
	return out;
}

/** "x \neq 0", "x \neq \pm 3", in order of absolute value, opposite values together. */
function ceParts(vals: Rational[], v = 'x'): string[] {
	const s = uniqSorted(vals);
	const used = new Set<string>();
	const parts: string[] = [];
	for (const r of [...s].sort((a, b) => a.abs().compare(b.abs()) || a.compare(b))) {
		if (used.has(r.toString())) continue;
		used.add(r.toString());
		const o = r.neg();
		if (!r.isZero() && s.some((t) => t.equals(o))) {
			used.add(o.toString());
			parts.push(`${v} \\neq \\pm ${r.abs().toLatex()}`);
		} else parts.push(`${v} \\neq ${r.toLatex()}`);
	}
	return parts;
}

const NONE = '\\text{nessuna condizione}';
const ceLine = (vals: Rational[]) => (vals.length ? ceParts(vals).join(',\\ ') : NONE);

/** On a phone button: more than three conditions go on two lines. */
function ceOptionLatex(vals: Rational[]): string {
	const parts = ceParts(vals);
	if (!parts.length) return NONE;
	if (parts.length <= 3) return parts.join(',\\ ');
	return `\\begin{gathered} ${parts.slice(0, 2).join(',\\ ')}, \\\\ ${parts.slice(2).join(',\\ ')} \\end{gathered}`;
}

const condFactor = (c: Cond) => (c.w ? `${c.u} ${c.s! > 0 ? '-' : '+'} ${c.w}` : c.u);
const condOne = (c: Cond) => (c.w ? `${c.u} \\neq ${c.s! < 0 ? '-' : ''}${c.w}` : `${c.u} \\neq 0`);

function condsLatex(cs: Cond[]): string {
	if (!cs.length) return NONE;
	const parts: string[] = [];
	const done = new Set<number>();
	cs.forEach((c, i) => {
		if (done.has(i)) return;
		const j = c.w ? cs.findIndex((d, k) => k !== i && d.u === c.u && d.w === c.w && d.s === -c.s!) : -1;
		if (j >= 0) {
			done.add(j);
			parts.push(`${c.u} \\neq \\pm ${c.w}`);
		} else parts.push(condOne(c));
	});
	return parts.join(',\\ ');
}

// ---------------------------------------------------------------------------
// Options of the multiple choice

interface Opt {
	latex: string;
	values: string[];
	key: string;
}

function setOpt(vals: Rational[]): Opt {
	const s = uniqSorted(vals);
	return { latex: ceOptionLatex(s), values: s.length ? s.map((r) => r.toString()) : ['nessuna'], key: `S:${s.map((r) => r.toString()).join(';')}` };
}

function condOpt(given: Cond[]): Opt {
	// letters first (alphabetically), then the binomials, as the lesson writes them
	const cs = [...given].sort((a, b) => Number(!!a.w) - Number(!!b.w) || a.u.localeCompare(b.u));
	const vals = cs.map(condFactor).sort();
	if (!cs.length) return setOpt([]);
	return { latex: condsLatex(cs), values: vals, key: `C:${vals.join(';')}` };
}

function oppureOpt(cs: Cond[]): Opt {
	return { latex: cs.map(condOne).join(' \\text{ oppure } '), values: ['oppure', ...cs.map(condFactor)], key: `O:${cs.map(condFactor).join(';')}` };
}

const numOptR = (r: Rational): Opt => ({ latex: r.toLatex(), values: [r.toString()], key: `N:${r.toString()}` });
const NE_OPT: Opt = { latex: '\\text{non esiste}', values: ['non esiste'], key: 'NE' };

function choose(correct: Opt, cands: (Opt | null | undefined)[], fallback: (i: number) => Opt | null, rng: Rng): ChoiceAnswer {
	const seen = new Set([correct.key]);
	const options: Opt[] = [correct];
	const add = (o: Opt | null | undefined) => {
		if (o && options.length < 4 && !seen.has(o.key)) {
			seen.add(o.key);
			options.push(o);
		}
	};
	cands.forEach(add);
	for (let i = 1; options.length < 4 && i < 200; i++) add(fallback(i));
	if (options.length < 4) throw new Error('not enough distinct options');
	const idx = shuffle(
		rng,
		options.map((_, i) => i),
	);
	const out: ChoiceOption[] = idx.map((i) => ({ latex: options[i].latex, values: options[i].values }));
	return { kind: 'choice', options: out, correct: idx.indexOf(0) };
}

/** Wrong sets near the truth: one value moved by ±1, ±2, ... */
function nearSet(truth: Rational[], i: number): Opt | null {
	const d = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
	if (!truth.length) return setOpt([q(d)]);
	const j = i % truth.length;
	const moved = truth.map((r, k) => (k === j ? r.add(q(d)) : r));
	if (uniqSorted(moved).length !== moved.length) return null;
	return setOpt(moved);
}

// ---------------------------------------------------------------------------
// Random pieces

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const n = rng.int(a, b);
		if (n !== 0) return n;
	}
};

/** Numerator of a C.E. exercise: a number, x, or a first-degree binomial. */
function randomNum(rng: Rng, v = 'x'): P {
	const u = rng.next();
	if (u < 0.3) return [M(rng.int(1, 9))];
	if (u < 0.5) return [XM(v)];
	if (u < 0.85) return lin(1, nz(rng, -9, 9), v);
	const a = rng.int(2, 3);
	let c = nz(rng, -9, 9);
	while (gcd(a, Math.abs(c)) !== 1) c = nz(rng, -9, 9);
	return lin(a, c, v);
}

function randomNum2(rng: Rng, u: string, w: string): P {
	return rng.pick([lin2(1, u, 1, w), lin2(1, u, -1, w), lin2(1, u, 2, w), lin2(2, u, -1, w), lin2(1, u, -3, w), lin2(3, u, 1, w)]);
}

const oneFrac = (num: P, den: Den): Frac[] => [{ num, den, sign: 1 }];
const den = (pre: Mono, fs: Fac[], rev = false): Den => ({ pre, fs, rev });
const F = (p: P, k = 1, rev = false): Fac => ({ p, k, rev });

/** Level 1: a polynomial of the lesson's size, x + c, ax + c, x^2 + c, x^2 + bx, x^2 + bx + c or a number. */
function randomPoly(rng: Rng, forDen: boolean): P {
	switch (rng.int(0, forDen ? 3 : 5)) {
		case 0:
			return lin(1, nz(rng, -9, 9));
		case 1: {
			const a = rng.int(2, 3);
			let c = nz(rng, -9, 9);
			while (gcd(a, Math.abs(c)) !== 1) c = nz(rng, -9, 9);
			return lin(a, c);
		}
		case 2:
			return collect([XM('x', 2), M(nz(rng, -9, 9))]);
		case 3:
			return collect([XM('x', 2), M(nz(rng, -6, 6), { x: 1 })]);
		case 4:
			return collect([XM('x', 2), M(nz(rng, -5, 5), { x: 1 }), M(nz(rng, -9, 9))]);
		default:
			return [M(rng.int(1, 9))];
	}
}

/** Level 1: a polynomial that vanishes at x0: x - x0 or (x - x0)(x - t). */
function polyWithRoot(rng: Rng, x0: number): P {
	if (rng.next() < 0.5) return lin(1, -x0);
	return pmul(lin(1, -x0), lin(1, -rng.int(-6, 6)));
}

const samePoly = (a: P, b: P) => pl(a) === pl(b);

// ---------------------------------------------------------------------------
// Construction, level by level

function build(rng: Rng, level: number): Build {
	switch (level) {
		case 1:
			return build1(rng);
		case 2: {
			const u = rng.next();
			const num = randomNum(rng);
			if (u < 0.35) return { case: 'x + b', fracs: oneFrac(num, den(ONE_M, [F(lin(1, nz(rng, -9, 9)))])) };
			if (u < 0.7) {
				const a = rng.int(2, 5);
				return { case: 'ax + b', fracs: oneFrac(num, den(ONE_M, [F(lin(a, nz(rng, -9, 9)))])) };
			}
			// b - ax, with the constant first: 3 - x, 3 - 2x
			const a = rng.next() < 0.35 ? 1 : rng.int(2, 4);
			return { case: 'b - ax', fracs: oneFrac(num, den(ONE_M, [F(lin(-a, rng.int(1, 9)), 1, true)], true)) };
		}
		case 3: {
			const u = rng.next();
			if (u < 0.25) {
				const k = rng.int(1, 9);
				const n = k === 1 ? rng.int(2, 4) : rng.int(1, 4);
				return { case: 'monomio', fracs: oneFrac(lin(rng.int(1, 3), nz(rng, -9, 9)), den(M(k, { x: n }), [])) };
			}
			if (u < 0.45) {
				const [a, b] = rng.next() < 0.6 ? ['x', 'y'] : ['a', 'b'];
				const k = rng.int(1, 9);
				return { case: 'monomio in due lettere', fracs: oneFrac(randomNum2(rng, a, b), den(M(k, { [a]: rng.int(1, 3), [b]: rng.int(1, 3) }), [])) };
			}
			const k = rng.pick([1, 1, 2, 3, 4, 5, 6]);
			const j = rng.next() < 0.75 ? 1 : 2;
			const a = rng.pick([1, 1, 1, 2, 3]);
			let b = nz(rng, -9, 9);
			while (gcd(a, Math.abs(b)) !== 1) b = nz(rng, -9, 9);
			return { case: 'raccoglimento', fracs: oneFrac(randomNum(rng), den(M(k, { x: j }), [F(lin(a, b))])) };
		}
		case 4: {
			const p = rng.pick([1, 1, 1, 1, 2, 3]);
			let qq = rng.int(1, 9);
			while (gcd(p, qq) !== 1 || p * p > 9 || qq * qq > MAX_COEF) qq = rng.int(1, 9);
			if (rng.next() < 0.55) {
				const rev = rng.next() < 0.25;
				const fs = rev ? [F(lin(-p, qq), 1, true), F(lin(p, qq), 1, true)] : [F(lin(p, -qq)), F(lin(p, qq))];
				return { case: 'differenza di quadrati', fracs: oneFrac(randomNum(rng), den(ONE_M, fs, rev)) };
			}
			let q2 = rng.int(1, 7);
			while (gcd(p, q2) !== 1) q2 = rng.int(1, 7);
			const s = rng.next() < 0.5 ? 1 : -1;
			return { case: 'quadrato di binomio', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(lin(p, s * q2), 2)])) };
		}
		case 5: {
			if (rng.next() < 0.7) {
				const r1 = nz(rng, -9, 9);
				const r2 = nz(rng, -9, 9);
				return { case: 'primo coefficiente 1', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(lin(1, -r1)), F(lin(1, -r2))])) };
			}
			const p = rng.int(2, 3);
			let s = nz(rng, -7, 7);
			while (gcd(p, Math.abs(s)) !== 1) s = nz(rng, -7, 7);
			const r = nz(rng, -6, 6);
			return { case: 'primo coefficiente diverso da 1', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(lin(p, -s)), F(lin(1, -r))])) };
		}
		case 6:
			return build6(rng);
		case 7:
			return build7(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function build1(rng: Rng): Build {
	const u = rng.next();
	const kase = u < 0.5 ? 'esiste' : u < 0.7 ? 'numeratore nullo' : 'non esiste';
	if (rng.next() < 0.25) {
		// two letters, as in the lesson's example 2
		const [a, b] = rng.next() < 0.7 ? ['a', 'b'] : ['x', 'y'];
		const k = nz(rng, -3, 3);
		const m = nz(rng, -3, 3);
		const num = lin2(1, a, k, b);
		const dn = lin2(1, a, m, b);
		const b0 = nz(rng, -4, 4);
		let a0: number;
		if (kase === 'non esiste') a0 = -m * b0;
		else if (kase === 'numeratore nullo') a0 = -k * b0;
		else a0 = nz(rng, -5, 5);
		return { case: kase, sub: 'due lettere', fracs: oneFrac(num, den(ONE_M, [F(dn)])), at: { [a]: a0, [b]: b0 } };
	}
	const x0 = rng.int(-5, 5);
	let num: P;
	let dn: P;
	let sub = 'una lettera';
	if (kase === 'non esiste') {
		dn = polyWithRoot(rng, x0);
		if (rng.next() < 0.3) {
			num = polyWithRoot(rng, x0);
			sub = 'zero su zero';
		} else num = randomPoly(rng, false);
	} else if (kase === 'numeratore nullo') {
		num = polyWithRoot(rng, x0);
		dn = randomPoly(rng, true);
	} else {
		num = randomPoly(rng, false);
		dn = randomPoly(rng, true);
	}
	return { case: kase, sub, fracs: oneFrac(num, den(ONE_M, [F(dn)])), at: { x: x0 } };
}

function build6(rng: Rng): Build {
	const u = rng.next();
	if (u < 0.2) {
		const k = rng.pick([1, 1, 2, 3]);
		const p = rng.pick([1, 1, 2, 3]);
		let qq = rng.int(1, 6);
		while (gcd(p, qq) !== 1) qq = rng.int(1, 6);
		const rev = rng.next() < 0.5;
		const fs = rev ? [F(lin(-p, qq), 1, true), F(lin(p, qq), 1, true)] : [F(lin(p, -qq)), F(lin(p, qq))];
		return { case: 'raccoglimento e differenza di quadrati', fracs: oneFrac(randomNum(rng), den(M(k, { x: 1 }), fs, rev)) };
	}
	if (u < 0.35) {
		const k = rng.pick([1, 1, 2, 3]);
		const r1 = nz(rng, -6, 6);
		const r2 = nz(rng, -6, 6);
		return { case: 'raccoglimento e trinomio', fracs: oneFrac(randomNum(rng), den(M(k, { x: 1 }), [F(lin(1, -r1)), F(lin(1, -r2))])) };
	}
	if (u < 0.55) {
		const s = rng.int(1, 3);
		const sq = collect([XM('x', 2), M(s * s)]);
		if (rng.next() < 0.6) {
			const r = nz(rng, -5, 5);
			return { case: 'un fattore mai zero', sub: 'raccoglimento parziale', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(lin(1, -r)), F(sq)])) };
		}
		return { case: 'un fattore mai zero', sub: 'raccoglimento totale', fracs: oneFrac(randomNum(rng), den(M(rng.pick([1, 1, 2, 3]), { x: 1 }), [F(sq)])) };
	}
	if (u < 0.7) {
		const t = rng.int(1, 6);
		const v = rng.int(0, 3);
		if (v === 0) return { case: 'nessuna condizione', sub: 'x^2 + t^2', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(collect([XM('x', 2), M(t * t)]))])) };
		if (v === 1) {
			const k = rng.int(2, 4);
			const t2 = rng.int(1, 4);
			return { case: 'nessuna condizione', sub: 'k(x^2 + t^2)', fracs: oneFrac(randomNum(rng), den(M(k), [F(collect([XM('x', 2), M(t2 * t2)]))])) };
		}
		if (v === 2) {
			const t3 = rng.int(1, 3);
			return { case: 'nessuna condizione', sub: 'x^4 + bx^2 + t^2', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(collect([XM('x', 4), M(rng.int(1, 4), { x: 2 }), M(t3 * t3)]))])) };
		}
		const p = rng.int(2, 3);
		let qq = rng.int(1, 7);
		while (gcd(p, qq) !== 1) qq = rng.int(1, 7);
		return { case: 'nessuna condizione', sub: 'p^2x^2 + q^2', fracs: oneFrac(randomNum(rng), den(ONE_M, [F(collect([M(p * p, { x: 2 }), M(qq * qq)]))])) };
	}
	const [a, b] = rng.next() < 0.6 ? ['a', 'b'] : ['x', 'y'];
	const s = rng.next() < 0.5 ? 1 : -1;
	const num = randomNum2(rng, a, b);
	const v = rng.int(0, 3);
	const k = rng.pick([1, 1, 2, 3]);
	if (v === 0) return { case: 'due lettere', sub: 'u(u ± w)', fracs: oneFrac(num, den(M(k, { [a]: 1 }), [F(lin2(1, a, s, b))])) };
	if (v === 1) return { case: 'due lettere', sub: 'w(u ± w)', fracs: oneFrac(num, den(M(k, { [b]: 1 }), [F(lin2(1, a, s, b))])) };
	if (v === 2) return { case: 'due lettere', sub: 'u^2 - w^2', fracs: oneFrac(num, den(ONE_M, [F(lin2(1, a, -1, b)), F(lin2(1, a, 1, b))])) };
	return { case: 'due lettere', sub: 'uw(u ± w)', fracs: oneFrac(num, den(M(1, { [a]: 1, [b]: 1 }), [F(lin2(1, a, s, b))])) };
}

type Kind7 = 'x' | 'lin' | 'diff' | 'racc' | 'never';

/** A denominator of level 7, with the value it is built around. */
function den7(rng: Rng, kind: Kind7, r: number): Den {
	switch (kind) {
		case 'x':
			return den(M(rng.pick([1, 1, 2, 3]), { x: 1 }), []);
		case 'lin':
			return den(ONE_M, [F(lin(1, -r))]);
		case 'diff':
			return den(ONE_M, [F(lin(1, -Math.abs(r))), F(lin(1, Math.abs(r)))]);
		case 'racc':
			return den(M(1, { x: 1 }), [F(lin(1, -r))]);
		case 'never':
			return den(ONE_M, [F(collect([XM('x', 2), M(r * r)]))]);
	}
}

function build7(rng: Rng): Build {
	const u = rng.next();
	const dens: Den[] = [];
	let kase: string;
	if (u < 0.3) {
		kase = 'valore in comune';
		const r = nz(rng, -5, 5);
		const quad: Kind7 = rng.next() < 0.6 ? 'diff' : 'racc';
		dens.push(den7(rng, quad, r));
		dens.push(den7(rng, 'lin', quad === 'diff' ? rng.pick([r, -r]) : r));
		if (rng.next() < 0.4) dens.push(rng.next() < 0.5 ? den7(rng, 'x', 0) : den7(rng, 'lin', nz(rng, -6, 6)));
	} else if (u < 0.57) {
		kase = 'un denominatore mai zero';
		dens.push(den7(rng, 'never', rng.int(1, 3)));
		const n = rng.next() < 0.5 ? 1 : 2;
		for (let i = 0; i < n; i++) dens.push(den7(rng, rng.pick(['x', 'lin', 'lin', 'diff'] as Kind7[]), nz(rng, -6, 6)));
	} else {
		kase = 'valori tutti diversi';
		dens.push(den7(rng, rng.pick(['diff', 'racc'] as Kind7[]), nz(rng, -5, 5)));
		const n = rng.next() < 0.5 ? 1 : 2;
		for (let i = 0; i < n; i++) dens.push(den7(rng, rng.pick(['x', 'lin', 'lin'] as Kind7[]), nz(rng, -6, 6)));
	}
	const fracs: Frac[] = shuffle(rng, dens).map((d, i) => ({ num: randomNum7(rng), den: d, sign: i === 0 ? 1 : rng.next() < 0.5 ? 1 : -1 }));
	return { case: kase, fracs };
}

function randomNum7(rng: Rng): P {
	const u = rng.next();
	if (u < 0.5) return [M(rng.int(1, 5))];
	if (u < 0.7) return [XM()];
	return lin(1, nz(rng, -5, 5));
}

// ---------------------------------------------------------------------------
// Params (JSON-safe)

type MJ = ReturnType<typeof monoJSON>;
interface FracJ {
	num: MJ[];
	den: { pre: MJ; fs: { p: MJ[]; k: number; rev?: boolean }[]; rev?: boolean };
	sign: 1 | -1;
}

function toParams(b: Build): Record<string, unknown> {
	const fracs: FracJ[] = b.fracs.map((f) => ({
		num: f.num.map(monoJSON),
		den: { pre: monoJSON(f.den.pre), fs: f.den.fs.map((g) => ({ p: g.p.map(monoJSON), k: g.k, ...(g.rev ? { rev: true } : {}) })), ...(f.den.rev ? { rev: true } : {}) },
		sign: f.sign,
	}));
	return { case: b.case, ...(b.sub ? { sub: b.sub } : {}), fracs, ...(b.at ? { at: b.at } : {}) };
}

function monoOf(x: unknown): Mono {
	const m = monoFromJSON(x);
	if (!m) throw new Error('bad monomial in params');
	return m;
}

function fromParams(p: Record<string, unknown>): Build {
	const fr = p.fracs as FracJ[];
	return {
		case: String(p.case),
		sub: p.sub === undefined ? undefined : String(p.sub),
		at: p.at as Record<string, number> | undefined,
		fracs: fr.map((f) => ({
			num: f.num.map(monoOf),
			den: { pre: monoOf(f.den.pre), fs: f.den.fs.map((g) => ({ p: g.p.map(monoOf), k: g.k, rev: g.rev })), rev: f.den.rev },
			sign: f.sign,
		})),
	};
}

// ---------------------------------------------------------------------------
// Derivation: problem, answer, steps and distractors

interface Derived {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** Level 1 with a value: the number; otherwise null. */
	value: Rational | null;
	/** One letter: the excluded values; null for two letters and for level 1. */
	truth: Rational[] | null;
	conds: Cond[] | null;
	correct: Opt;
	cands: (Opt | null)[];
	near: (i: number) => Opt | null;
}

const PROMPT_CE = 'Scrivi le condizioni di esistenza della frazione.';

/** The step that factors the denominator, as a chain the checker can read back. */
function factorChain(d: Den, label: string, middle?: string, what?: string): string {
	const D = denLatex(d);
	const head = what ? `\\text{${label} } ${what}\\text{: }` : `\\text{${label}: }`;
	return `${head} ${D}${middle ? ` = ${middle}` : ''} = ${factoredLatex(d)}`;
}

/** One line per factor: numbers are never zero, letters vanish at 0, x - r at r, x^2 + c never. */
function factorSteps(d: Den): string[] {
	const out: string[] = [];
	if (!d.pre.c.isOne() && (d.fs.length > 0 || Object.keys(d.pre.e).length > 0)) out.push(`\\text{Il fattore numerico } ${d.pre.c.toLatex()} \\text{ non è mai zero}`);
	for (const v of Object.keys(d.pre.e).sort()) {
		const n = d.pre.e[v];
		out.push(n > 1 ? `\\text{Il fattore } ${v}^${n} \\text{ si annulla solo per } ${v} = 0` : `\\text{Il fattore } ${v} \\text{ si annulla per } ${v} = 0`);
	}
	for (const f of d.fs) {
		const fl = pl(f.p, f.rev);
		const ls = lettersOf(f.p);
		if (ls.length === 2) {
			const [c] = denConds(den(ONE_M, [f]));
			out.push(`\\text{Il fattore } ${fl} \\text{ vale zero quando } ${c.u} = ${c.s! < 0 ? '-' : ''}${c.w}`);
		} else if (degIn(f.p, ls[0]) === 1) {
			const r = linRoot(f.p).toLatex();
			out.push(f.k > 1 ? `\\text{Il fattore } ${fl} \\text{ compare ${f.k === 2 ? 'due' : `${f.k}`} volte, ma si annulla solo per } x = ${r}` : `\\text{Il fattore } ${fl} \\text{ si annulla per } x = ${r}`);
		} else out.push(`\\text{Il fattore } ${fl} \\text{ è positivo e non si annulla mai}`);
	}
	return out;
}

/** The expanded denominator before the last split, for the chains of level 6: kx(x^2 - 9), kx(x^2 - 5x + 6). */
function partial(d: Den): string {
	const rest = d.fs.reduce<P>((acc, f) => {
		let out = acc;
		for (let i = 0; i < f.k; i++) out = pmul(out, f.p);
		return out;
	}, [ONE_M]);
	return `${preLatex(d.pre)}(${pl(rest, d.rev)})`;
}

function numRoots(num: P): Rational[] {
	const ls = lettersOf(num);
	if (ls.length !== 1 || degIn(num, ls[0]) !== 1) return [];
	return [linRoot(num)];
}

const without = (vals: Rational[], drop: Rational[]) => vals.filter((r) => !drop.some((d) => d.equals(r)));
const R = (n: number, d = 1) => q(n, d);

function derive(level: number, b: Build): Derived {
	if (level === 1) return derive1(b);
	if (level === 7) return derive7(b);
	const f = b.fracs[0];
	const d = f.den;
	const problem = fracLatex(f);
	const D = denLatex(d);
	const nr = numRoots(f.num);
	const steps: string[] = [];
	if (lettersOf(denPoly(d)).length === 2) {
		const conds = denConds(d);
		const cands: (Opt | null)[] = [];
		const [u, w] = lettersOf(denPoly(d));
		const binom = conds.filter((c) => c.w);
		const single = conds.filter((c) => !c.w);
		const termByTerm: Cond[] = [{ u }, { u: w }];
		if (level === 3) {
			steps.push(`\\text{Il denominatore è un prodotto: } ${D} = ${monoProduct(d.pre)}`);
			steps.push(...factorSteps(d));
			const nc = numCond(f.num);
			cands.push(condOpt([{ u }]), condOpt([{ u: w }]), oppureOpt(conds), nc ? condOpt([...conds, nc]) : null, setOpt([]));
		} else {
			steps.push(factorChain(d, 'Scomponi il denominatore'));
			steps.push(...factorSteps(d));
			const flip = conds.map((c) => (c.w ? { ...c, s: -c.s! as 1 | -1 } : c));
			if (b.sub === 'u^2 - w^2') cands.push(condOpt([binom[0]]), condOpt(termByTerm), oppureOpt(conds), setOpt([]));
			else if (b.sub === 'uw(u ± w)') cands.push(condOpt(single), condOpt(flip), condOpt([...binom, { u: w }]), condOpt([...binom, { u }]));
			else cands.push(condOpt(termByTerm), condOpt(flip), oppureOpt(conds), condOpt(binom), condOpt(single));
		}
		const cl = condsLatex(conds);
		steps.push(`\\text{C.E.: } ${cl}`);
		return {
			prompt: PROMPT_CE,
			problem,
			solution: `\\text{C.E.: } ${cl}`,
			steps,
			value: null,
			truth: null,
			conds,
			correct: condOpt(conds),
			cands,
			near: () => null,
		};
	}

	const truth = denZeros(d);
	const cands: (Opt | null)[] = [];
	const fs = d.fs;
	switch (level) {
		case 2: {
			const g = fs[0].p;
			const r = truth[0];
			const a = g.find((m) => m.e.x)!.c;
			const c = g.find((m) => !m.e.x)!.c;
			if (b.case === 'b - ax') {
				steps.push(a.neg().isOne() ? `\\text{Il denominatore } ${D} \\text{ vale zero per } x = ${r.toLatex()}` : `\\text{Il denominatore } ${D} \\text{ vale zero quando } ${monoLatex(M(a.neg(), { x: 1 }))} = ${c.toLatex()}\\text{, cioè per } x = ${r.toLatex()}`);
				steps.push(`\\text{Controllo: } ${subLatex(g, { x: r }, true)} = 0`);
			} else {
				steps.push(`${D} \\neq 0`);
				if (!a.isOne()) steps.push(`${monoLatex(M(a, { x: 1 }))} \\neq ${c.neg().toLatex()}`);
				steps.push(`x \\neq ${r.toLatex()}`);
				steps.push(`\\text{Controllo: } ${subLatex(g, { x: r })} = 0`);
			}
			cands.push(setOpt([r.neg()]));
			if (!a.abs().isOne()) cands.push(setOpt([c.neg().mul(a.sign() < 0 ? R(-1) : R(1))]), c.isZero() ? null : setOpt([a.neg().div(c)]));
			cands.push(...nr.map((t) => setOpt([t])), setOpt([R(0)]), setOpt([]));
			break;
		}
		case 3: {
			if (b.case === 'monomio') {
				steps.push(`\\text{Il denominatore è un prodotto: } ${D} = ${monoProduct(d.pre)}`);
				steps.push(...factorSteps(d));
				cands.push(setOpt([]), ...nr.map((t) => setOpt([t])), ...nr.map((t) => setOpt([R(0), t])));
			} else {
				steps.push(factorChain(d, 'Raccogli', undefined, monoLatex(d.pre)));
				steps.push(...factorSteps(d));
				const r = linRoot(fs[0].p);
				cands.push(setOpt([r]), setOpt([R(0), r.neg()]), setOpt([R(0)]), ...nr.map((t) => setOpt([...truth, t])), r.isInteger() ? null : setOpt([R(0), R(1).div(r)]));
			}
			break;
		}
		case 4: {
			if (b.case === 'differenza di quadrati') {
				steps.push(factorChain(d, 'Differenza di quadrati'));
				steps.push(...factorSteps(d));
				const s = truth[1];
				cands.push(setOpt([s]), setOpt([s.mul(s)]), s.isInteger() ? setOpt([s.neg()]) : setOpt([R(-s.num), R(s.num)]), setOpt([]));
			} else {
				steps.push(factorChain(d, 'Quadrato di un binomio'));
				steps.push(...factorSteps(d));
				const r = truth[0];
				cands.push(setOpt([r.neg()]), setOpt([r, r.neg()]), setOpt([]), setOpt([r.mul(r)]));
			}
			break;
		}
		case 5: {
			const [r1, r2] = fs.map((g) => linRoot(g.p));
			const P2 = order(denPoly(d));
			if (b.case === 'primo coefficiente 1') {
				const sm = r1.add(r2).neg();
				const pr = r1.mul(r2);
				steps.push(`\\text{Due numeri con somma } ${sm.toLatex()} \\text{ e prodotto } ${pr.toLatex()}\\text{: } ${r1.neg().toLatex()} \\text{ e } ${r2.neg().toLatex()}`);
				steps.push(factorChain(d, 'Scomponi il denominatore'));
				steps.push(...factorSteps(d));
				cands.push(setOpt([r1.neg(), r2.neg()]), setOpt([r1, r2.neg()]), setOpt([r1.neg(), r2]), setOpt([]));
			} else {
				// (px - s)(x - r): split the middle term into -prx and -sx, then group
				const p = fs[0].p.find((m) => m.e.x)!.c.num;
				const s = -fs[0].p.find((m) => !m.e.x)!.c.num;
				const r = r2.num;
				const split = polyLatex([P2[0], M(-p * r, { x: 1 }), M(-s, { x: 1 }), P2[P2.length - 1]]);
				const g2 = Math.abs(s) === 1 ? '' : `${Math.abs(s)}`;
				const grouped = `${monoLatex(M(p, { x: 1 }))}(${pl(lin(1, -r))}) ${s > 0 ? '-' : '+'} ${g2}(${pl(lin(1, -r))})`;
				steps.push(`\\text{Prodotto del primo coefficiente per il termine noto: } ${P2[0].c.toLatex()} \\cdot ${wrapNum(P2[P2.length - 1].c)} = ${P2[0].c.mul(P2[P2.length - 1].c).toLatex()}`);
				steps.push(`\\text{Spezza il termine di primo grado e raccogli a gruppi: } ${D} = ${split} = ${grouped} = (${pl(lin(1, -r))})(${pl(lin(p, -s))})`);
				steps.push(...factorSteps(d));
				cands.push(setOpt([R(s), R(r)]), setOpt([r1.neg(), r2.neg()]), setOpt([r1.neg(), r2]), setOpt([r1, r2.neg()]));
			}
			break;
		}
		case 6: {
			if (b.case === 'nessuna condizione') {
				const g = fs[0].p;
				const c = g.find((m) => !Object.keys(m.e).length)!.c;
				const lead = g.find((m) => m.e.x === 2 || m.e.x === 4)!;
				if (!d.pre.c.isOne()) steps.push(factorChain(d, 'Raccogli il fattore numerico'));
				steps.push(`\\text{Ogni termine con la } x \\text{ ha esponente pari e coefficiente positivo, quindi non è mai negativo}`);
				steps.push(`\\text{Il fattore } ${pl(g)} \\text{ vale almeno } ${c.toLatex()} \\text{ e non si annulla mai}`);
				// the "fake" zero: x^2 + t^2 read as x^2 - t^2
				const t = b.sub === 'p^2x^2 + q^2' ? R(Math.round(Math.sqrt(c.num)), Math.round(Math.sqrt(lead.c.num))) : R(Math.round(Math.sqrt(c.num)));
				cands.push(setOpt([t.neg(), t]), setOpt([t.neg()]), setOpt([R(0)]), setOpt([c.neg()]));
			} else if (b.case === 'un fattore mai zero') {
				const sq = fs.find((g) => neverZero(g.p))!.p;
				const t = R(Math.round(Math.sqrt(sq.find((m) => !Object.keys(m.e).length)!.c.num)));
				if (b.sub === 'raccoglimento parziale') {
					const lf = fs[0].p;
					const c2 = t.mul(t);
					steps.push(
						`\\text{Raccogli a gruppi: } ${D} = x^2(${pl(lf)}) + ${c2.toLatex()}(${pl(lf)}) = ${factoredLatex(d)}`.replace(/ \+ 1\(/, ' + ('),
					);
				} else steps.push(factorChain(d, 'Raccogli', undefined, monoLatex(d.pre)));
				steps.push(...factorSteps(d));
				const r = truth[0];
				cands.push(setOpt([...truth, t, t.neg()]), setOpt([r.neg()]), setOpt([]), setOpt([r.neg(), t, t.neg()]), setOpt([t.neg(), t]));
			} else if (b.case === 'raccoglimento e differenza di quadrati') {
				steps.push(factorChain(d, 'Raccogli, poi scomponi la differenza di quadrati', partial(d)));
				steps.push(...factorSteps(d));
				const s = truth[truth.length - 1];
				cands.push(setOpt([s.neg(), s]), setOpt([R(0), s]), setOpt([R(0), s.mul(s)]), s.isInteger() ? setOpt([R(0), s.neg()]) : setOpt([R(0), R(-s.num), R(s.num)]));
			} else {
				steps.push(factorChain(d, 'Raccogli, poi scomponi il trinomio', partial(d)));
				steps.push(...factorSteps(d));
				const [r1, r2] = fs.map((g) => linRoot(g.p));
				cands.push(setOpt([r1, r2]), setOpt([R(0), r1.neg(), r2.neg()]), setOpt([R(0), r1, r2.neg()]), setOpt([r1.neg(), r2.neg()]));
			}
			break;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
	const cl = ceLine(truth);
	steps.push(`\\text{C.E.: } ${cl}`);
	return {
		prompt: PROMPT_CE,
		problem,
		solution: `\\text{C.E.: } ${cl}`,
		steps,
		value: null,
		truth,
		conds: null,
		correct: setOpt(truth),
		cands,
		near: (i) => nearSet(truth, i),
	};
}

const wrapNum = (r: Rational) => (r.sign() < 0 ? `(${r.toLatex()})` : r.toLatex());

/** 3x^2y as "3 \cdot x \cdot x \cdot y" (the number first, then each letter as many times as its exponent). */
function monoProduct(m: Mono): string {
	const parts: string[] = m.c.isOne() ? [] : [m.c.toLatex()];
	for (const v of Object.keys(m.e).sort()) for (let i = 0; i < m.e[v]; i++) parts.push(v);
	return parts.join(' \\cdot ');
}

/** A numerator u ± w read as a condition (the mistake of looking at the numerator). */
function numCond(num: P): Cond | null {
	const ls = lettersOf(num);
	if (ls.length !== 2 || num.length !== 2 || !num.every((m) => m.c.abs().isOne())) return null;
	return denConds(den(ONE_M, [F(num)]))[0];
}

function derive1(b: Build): Derived {
	const f = b.fracs[0];
	const D = denPoly(f.den);
	const at: Record<string, Rational> = Object.fromEntries(Object.entries(b.at!).map(([k, v]) => [k, R(v)]));
	const n = evalP(f.num, at);
	const dv = evalP(D, at);
	const where = Object.keys(at)
		.sort()
		.map((k) => `${k} = ${at[k].toLatex()}`);
	const whereText = where.join(' \\text{ e } ');
	// "Numeratore: 6", not "6 = 6", when there is nothing to compute
	const subStep = (label: string, p: P, val: Rational) => {
		const sub = subLatex(p, at);
		return sub === val.toLatex() ? `\\text{${label}: } ${sub}` : `\\text{${label}: } ${sub} = ${val.toLatex()}`;
	};
	const steps = [subStep('Numeratore', f.num, n), subStep('Denominatore', D, dv)];
	const wn = evalWrongSquare(f.num, at);
	const wd = evalWrongSquare(D, at);
	const wrong = !wd.isZero() && (!wn.equals(n) || !wd.equals(dv)) ? numOptR(wn.div(wd)) : null;
	if (dv.isZero()) {
		steps.push(n.isZero() ? `\\text{Anche } \\frac{0}{0} \\text{ non è un numero: la frazione non esiste}` : `\\text{Il denominatore vale } 0\\text{: la frazione non esiste}`);
		return {
			prompt: 'Calcola il valore della frazione algebrica, se esiste.',
			problem: `${fracLatex(f)} \\quad ${where.join(' \\quad ')}`,
			solution: `\\text{Per } ${whereText} \\text{ il denominatore vale } 0\\text{: la frazione non esiste}`,
			steps,
			value: null,
			truth: null,
			conds: null,
			correct: NE_OPT,
			cands: n.isZero() ? [numOptR(R(0)), numOptR(R(1)), wrong] : [numOptR(R(0)), wrong, numOptR(n), numOptR(n.neg())],
			near: (i) => numOptR(R(Math.ceil(i / 2) * (i % 2 ? 1 : -1))),
		};
	}
	const v = n.div(dv);
	if (n.isZero()) steps.push(`\\text{Il numeratore vale } 0 \\text{ e il denominatore no: } \\frac{0}{${dv.toLatex()}} = 0`);
	else {
		const raw = `\\frac{${n.toLatex()}}{${dv.toLatex()}}`;
		steps.push(raw === v.toLatex() ? `\\text{La frazione vale } ${raw}` : `${raw} = ${v.toLatex()}`);
	}
	const cands = n.isZero() ? [NE_OPT, wrong, numOptR(R(1).div(dv))] : [wrong, numOptR(dv.div(n)), numOptR(v.neg()), NE_OPT, numOptR(n)];
	return {
		prompt: 'Calcola il valore della frazione algebrica, se esiste.',
		problem: `${fracLatex(f)} \\quad ${where.join(' \\quad ')}`,
		solution: `\\text{Per } ${whereText} \\text{ la frazione vale } ${v.toLatex()}`,
		steps,
		value: v,
		truth: null,
		conds: null,
		correct: numOptR(v),
		cands,
		near: (i) => numOptR(v.add(R(Math.ceil(i / 2) * (i % 2 ? 1 : -1)))),
	};
}

function derive7(b: Build): Derived {
	const problem = b.fracs.map((f, i) => `${i === 0 ? (f.sign < 0 ? '-' : '') : f.sign < 0 ? ' - ' : ' + '}${fracLatex(f)}`).join('');
	const steps: string[] = [];
	const zs = b.fracs.map((f) => denZeros(f.den));
	for (const f of b.fracs) {
		const d = f.den;
		const D = denLatex(d);
		const z = denZeros(d);
		const needs = d.fs.length > 1 || (d.fs.length === 1 && Object.keys(d.pre.e).length > 0);
		if (needs) steps.push(factorChain(d, 'Scomponi'));
		if (d.fs.length === 1 && neverZero(d.fs[0].p)) steps.push(`\\text{Il denominatore } ${D} \\text{ non si annulla mai}`);
		else steps.push(`\\text{Il denominatore } ${D} \\text{ dà } ${ceLine(z)}`);
	}
	const truth = uniqSorted(zs.flat());
	const repeated = truth.filter((r) => zs.filter((z) => z.some((t) => t.equals(r))).length > 1);
	if (repeated.length) steps.push(`\\text{Il valore } ${repeated.map((r) => r.toLatex()).join(', ')} \\text{ compare in più denominatori: si scrive una volta sola}`);
	const cl = ceLine(truth);
	steps.push(`\\text{C.E., tutte le condizioni insieme: } ${cl}`);

	const cands: (Opt | null)[] = [];
	const diffIdx = b.fracs.findIndex((f) => f.den.fs.length === 2);
	const onlyPositive = diffIdx >= 0 ? setOpt(without(truth, zs[diffIdx].filter((r) => r.sign() < 0 && !zs.some((z, j) => j !== diffIdx && z.some((t) => t.equals(r)))))) : null;
	if (b.case === 'valore in comune') cands.push(repeated.length ? setOpt(repeated) : null, onlyPositive);
	if (b.case === 'un denominatore mai zero') {
		const nv = b.fracs.find((f) => f.den.fs.length === 1 && neverZero(f.den.fs[0].p))!;
		const t = R(Math.round(Math.sqrt(nv.den.fs[0].p.find((m) => !Object.keys(m.e).length)!.c.num)));
		cands.push(setOpt([...truth, t, t.neg()]));
	}
	if (b.case === 'valori tutti diversi') cands.push(onlyPositive);
	// one denominator forgotten, the first fraction only, a numerator read as a denominator, a sign slip
	zs.forEach((z, i) => cands.push(z.length ? setOpt(without(truth, z.filter((r) => !zs.some((w, j) => j !== i && w.some((t) => t.equals(r)))))) : null));
	for (const f of b.fracs) for (const r of numRoots(f.num)) cands.push(setOpt([...truth, r]));
	const lone = truth.find((r) => !r.isZero() && !truth.some((t) => t.equals(r.neg())));
	if (lone) cands.push(setOpt([...without(truth, [lone]), lone.neg()]));
	return {
		prompt: "Scrivi le condizioni di esistenza dell'espressione.",
		problem,
		solution: `\\text{C.E.: } ${cl}`,
		steps,
		value: null,
		truth,
		conds: null,
		correct: setOpt(truth),
		cands,
		near: (i) => nearSet(truth, i),
	};
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

function answerOf(d: Derived, rng: Rng | null): Answer {
	if (d.value) return { kind: 'number', value: d.value.toString() };
	if (d.truth) return { kind: 'set', values: d.truth.map((r) => r.toString()), latex: ceLine(d.truth) };
	if (!rng) throw new Error('a choice answer needs the rng');
	return choose(d.correct, d.cands, d.near, rng);
}

function assemble(b: Build, level: number, rng: Rng): Sample {
	const d = derive(level, b);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: d.prompt,
		problem: d.problem,
		solution: d.solution,
		steps: d.steps,
		answer: answerOf(d, rng),
		params: toParams(b),
	};
}

const LEVEL_CASES: Record<number, string[]> = {
	1: ['esiste', 'numeratore nullo', 'non esiste'],
	2: ['x + b', 'ax + b', 'b - ax'],
	3: ['monomio', 'monomio in due lettere', 'raccoglimento'],
	4: ['differenza di quadrati', 'quadrato di binomio'],
	5: ['primo coefficiente 1', 'primo coefficiente diverso da 1'],
	6: ['raccoglimento e differenza di quadrati', 'raccoglimento e trinomio', 'un fattore mai zero', 'nessuna condizione', 'due lettere'],
	7: ['valore in comune', 'un denominatore mai zero', 'valori tutti diversi'],
};

const coefsOk = (p: P, max = MAX_COEF) => p.every((m) => m.c.isInteger() && Math.abs(m.c.num) <= max);

function check(sample: Sample): string[] {
	const v: string[] = [];
	let b: Build;
	let d: Derived;
	try {
		b = fromParams(sample.params);
		d = derive(sample.level, b);
	} catch (e) {
		return [`params non validi: ${(e as Error).message}`];
	}
	const lvl = sample.level;
	if (!LEVEL_CASES[lvl]?.includes(b.case)) v.push(`caso ${b.case} fuori dal livello ${lvl}`);
	if (sample.problem !== d.problem) v.push('testo diverso dai parametri');
	if (sample.prompt !== d.prompt) v.push('consegna diversa');
	v.push(...forbidden(sample.problem));
	for (const f of b.fracs) {
		const D = denPoly(f.den);
		if (!coefsOk(D) || !coefsOk(f.num)) v.push('coefficiente fuori intervallo');
		if (!lettersOf(D).length) v.push('denominatore senza lettere');
		if (samePoly(f.num, D)) v.push('numeratore uguale al denominatore');
		for (const g of lvl === 1 ? [] : f.den.fs) {
			const ls = lettersOf(g.p);
			if (ls.length === 1 && degIn(g.p, ls[0]) > 1 && !neverZero(g.p)) v.push(`fattore ${pl(g.p)} né lineare né mai nullo`);
			if (ls.length === 1 && degIn(g.p, ls[0]) === 1) {
				const cs = g.p.map((m) => Math.abs(m.c.num));
				if (gcd(cs[0], cs[1] ?? 0) !== 1) v.push(`fattore ${pl(g.p)} non primitivo`);
			}
		}
		const fl = f.den.fs.map((g) => pl(g.p));
		if (new Set(fl).size !== fl.length) v.push('due fattori uguali: vanno scritti come potenza');
	}
	const a = sample.answer;
	if (d.value) {
		if (a.kind !== 'number' || a.value !== d.value.toString()) v.push('valore sbagliato');
	} else if (d.truth) {
		if (a.kind !== 'set' || a.values.join(',') !== d.truth.map((r) => r.toString()).join(',') || a.latex !== ceLine(d.truth)) v.push('condizioni di esistenza sbagliate');
	} else if (a.kind !== 'choice' || a.options[a.correct]?.latex !== d.correct.latex) v.push('opzione giusta sbagliata');

	switch (lvl) {
		case 1: {
			const f = b.fracs[0];
			const at = Object.fromEntries(Object.entries(b.at ?? {}).map(([k, x]) => [k, R(x)]));
			const n = evalP(f.num, at);
			const dv = evalP(denPoly(f.den), at);
			const kind = dv.isZero() ? 'non esiste' : n.isZero() ? 'numeratore nullo' : 'esiste';
			if (kind !== b.case) v.push(`caso ${b.case} ma la frazione ${kind}`);
			if (Math.abs(n.num) > 60 || Math.abs(dv.num) > 60) v.push('numeratore o denominatore troppo grande');
			if (d.value && (Math.abs(d.value.num) > 40 || d.value.den > 20)) v.push('valore troppo grande');
			if (b.sub === 'zero su zero' && !(n.isZero() && dv.isZero())) v.push('zero su zero senza 0/0');
			if (b.sub === 'due lettere' && Object.values(b.at ?? {}).some((x) => x === 0 || Math.abs(x) > 9)) v.push('valori delle lettere fuori intervallo');
			if (!coefsOk(f.num, 40) || !coefsOk(denPoly(f.den), 40)) v.push('coefficiente oltre 40');
			break;
		}
		case 2: {
			const t = d.truth!;
			if (t.length !== 1 || t[0].den > 5) v.push('livello 2: un valore escluso con denominatore fino a 5');
			if (b.case === 'x + b' && t[0].den !== 1) v.push('x + b con valore frazionario');
			break;
		}
		case 5: {
			const t = d.truth!;
			if (t.length !== 2 || t.some((r) => r.isZero()) || t[0].add(t[1]).isZero()) v.push('livello 5: due valori diversi, non nulli, non opposti');
			const P2 = order(denPoly(b.fracs[0].den));
			if (P2.length !== 3) v.push('livello 5: il denominatore deve essere un trinomio');
			if (Math.abs(P2[1]?.c.num ?? 0) > 15 && b.case === 'primo coefficiente 1') v.push('somma troppo grande');
			if (Math.abs(P2[2]?.c.num ?? 0) > 60) v.push('prodotto troppo grande');
			if (b.case === 'primo coefficiente 1' && !P2[0].c.isOne()) v.push('primo coefficiente non 1');
			if (b.case === 'primo coefficiente diverso da 1' && (P2[0].c.isOne() || t.every((r) => r.isInteger()))) v.push('serve a diverso da 1 e un valore frazionario');
			break;
		}
		case 6: {
			if (b.case === 'raccoglimento e trinomio') {
				const [r1, r2] = b.fracs[0].den.fs.map((g) => linRoot(g.p));
				if (r1.equals(r2) || r1.add(r2).isZero()) v.push('trinomio con valori uguali o opposti');
			}
			if (b.case === 'un fattore mai zero' && d.truth!.length !== 1) v.push('un fattore mai zero: un solo valore escluso');
			if (b.case === 'nessuna condizione' && d.truth!.length) v.push('nessuna condizione con valori esclusi');
			break;
		}
		case 7: {
			const t = d.truth!;
			if (b.fracs.length < 2 || b.fracs.length > 3) v.push('livello 7: due o tre frazioni');
			if (!t.length || ceParts(t).length > 3 || t.length > 4) v.push('livello 7: da una a tre condizioni');
			const zs = b.fracs.map((f) => denZeros(f.den));
			const shared = t.some((r) => zs.filter((z) => z.some((x) => x.equals(r))).length > 1);
			const never = b.fracs.some((f) => f.den.fs.length === 1 && neverZero(f.den.fs[0].p));
			const kind = never ? 'un denominatore mai zero' : shared ? 'valore in comune' : 'valori tutti diversi';
			if (kind !== b.case) v.push(`caso ${b.case} ma l'espressione è ${kind}`);
			if (never && shared) v.push('mai zero e valore in comune insieme');
			if (!b.fracs.some((f) => denPoly(f.den).some((m) => (m.e.x ?? 0) >= 2))) v.push('livello 7: serve un denominatore di secondo grado');
			break;
		}
	}
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const d = derive(sample.level, fromParams(sample.params));
	return choose(d.correct, d.cands, d.near, rng);
}

export const frazioniAlgebricheEsistenza: Generator = {
	id: ID,
	title: 'Frazioni algebriche e condizioni di esistenza',
	levels: {
		1: {
			label: 'Il valore di una frazione algebrica',
			constraints: ['una o due lettere con valori interi tra -5 e 5', 'circa metà esiste, due su dieci con numeratore zero, tre su dieci non esiste (a volte 0/0)'],
		},
		2: { label: 'C.E. con un denominatore di primo grado', constraints: ['x + b, ax + b o b - ax, circa un terzo ciascuno', 'valore escluso intero o frazionario con denominatore fino a 5'] },
		3: { label: 'C.E. con un monomio o un raccoglimento', constraints: ['monomio in x, monomio in due lettere, raccoglimento totale kx^j(ax + b)'] },
		4: { label: 'C.E. con differenza di quadrati o quadrato', constraints: ['p²x² - q² (a volte scritto q² - p²x²) oppure (px ± q)²'] },
		5: { label: 'C.E. con un trinomio di secondo grado', constraints: ['(x - r₁)(x - r₂) con r₁, r₂ non nulli e non opposti, oppure (px - s)(x - r)'] },
		6: {
			label: 'C.E. con scomposizioni in più passi',
			constraints: ['raccoglimento e differenza di quadrati, raccoglimento e trinomio, un fattore mai zero, nessuna condizione, due lettere'],
		},
		7: { label: "C.E. di un'espressione con più frazioni", constraints: ['due o tre frazioni, almeno un denominatore di secondo grado, al massimo tre condizioni'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			let sample: Sample;
			try {
				sample = assemble(b, level, rng);
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

export default frazioniAlgebricheEsistenza;
