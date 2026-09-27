/**
 * Espressioni con i radicali. Spec: specs/exercises/numeri-reali-espressioni.md
 *
 * Seven levels in the order of lesson 75: sums of radicals to simplify first, notable products,
 * quotients with a monomial denominator, denominators with a binomial (the conjugate), radicals
 * with different indices, first-degree equations with irrational coefficients, inequalities whose
 * coefficient has a sign to be found.
 *
 * Built backwards: the pieces are chosen small and the answer is computed exactly in Q(√r)
 * (numbers a + b√r with rational a, b, class Q2 below) or, at level 5, as a product of prime powers
 * with rational exponents. A draw whose answer is not nice (denominator too large, coefficients too
 * big, zero) is thrown away and drawn again.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { Surd } from '../surd';

export const ID = 'numeri-reali-espressioni';

/** Patterns that must never appear in a problem. Mirrored in the Python checker. */
export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito', re: /(?<!\d)1\s*(?:x|\\sqrt)/ },
	{ name: 'termine nullo (0x)', re: /(?<!\d)0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

// ---------------------------------------------------------------------------
// Numbers a + b√r with a, b rational and r square-free (fixed per exercise)

class Q2 {
	constructor(
		readonly a: Rational,
		readonly b: Rational,
		readonly r: number,
	) {}

	static of(a: number | Rational, b: number | Rational, r: number): Q2 {
		return new Q2(typeof a === 'number' ? q(a) : a, typeof b === 'number' ? q(b) : b, r);
	}

	add(o: Q2): Q2 {
		return new Q2(this.a.add(o.a), this.b.add(o.b), this.r);
	}

	sub(o: Q2): Q2 {
		return new Q2(this.a.sub(o.a), this.b.sub(o.b), this.r);
	}

	mul(o: Q2): Q2 {
		const r = q(this.r);
		return new Q2(this.a.mul(o.a).add(this.b.mul(o.b).mul(r)), this.a.mul(o.b).add(this.b.mul(o.a)), this.r);
	}

	scale(k: Rational): Q2 {
		return new Q2(this.a.mul(k), this.b.mul(k), this.r);
	}

	neg(): Q2 {
		return this.scale(q(-1));
	}

	norm(): Rational {
		return this.a.mul(this.a).sub(this.b.mul(this.b).mul(q(this.r)));
	}

	inv(): Q2 {
		const n = this.norm();
		if (n.isZero()) throw new Error('Q2: division by zero');
		return new Q2(this.a.div(n), this.b.neg().div(n), this.r);
	}

	div(o: Q2): Q2 {
		return this.mul(o.inv());
	}

	isZero(): boolean {
		return this.a.isZero() && this.b.isZero();
	}

	/** Exact sign: with a and b of opposite signs, compare a² with b²r. */
	sign(): number {
		const sa = this.a.sign();
		const sb = this.b.sign();
		if (sb === 0) return sa;
		if (sa === 0 || sa === sb) return sb;
		return this.a.mul(this.a).compare(this.b.mul(this.b).mul(q(this.r))) > 0 ? sa : sb;
	}

	surd(): Surd {
		const d = lcm(this.a.den, this.b.den);
		return Surd.of(this.a.num * (d / this.a.den), this.b.num * (d / this.b.den), this.r, d);
	}

	tex(): string {
		return this.surd().toLatex();
	}

	str(): string {
		return this.surd().toString();
	}
}

/** A number is nice when its reduced denominator and coefficients are small. */
function nice(x: Q2 | Surd, maxDen: number, maxCoef: number): boolean {
	const s = x instanceof Q2 ? x.surd() : x;
	return s.d <= maxDen && Math.abs(s.a) <= maxCoef && Math.abs(s.b) <= maxCoef;
}

// ---------------------------------------------------------------------------
// LaTeX helpers

const sq = (n: number): string => `\\sqrt{${n}}`;
const rt = (n: number, radicand: number): string => (n === 2 ? sq(radicand) : `\\sqrt[${n}]{${radicand}}`);

/** k·body with 1 and -1 left implicit: kr(2, "\sqrt{3}") = "2\sqrt{3}". */
function kr(k: number, body: string): string {
	if (k === 1) return body;
	if (k === -1) return `-${body}`;
	return `${k}${body}`;
}

/** Joins signed terms: a leading "-" of a term becomes the operator. */
function join(terms: string[]): string {
	return terms
		.filter((t) => t !== '')
		.map((t, i) => {
			if (i === 0) return t;
			return t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`;
		})
		.join('');
}

/** "a + b√r" written without reduction (a, b integers). */
function rawLin(a: number, b: number, r: number): string {
	const terms: string[] = [];
	if (a !== 0) terms.push(`${a}`);
	if (b !== 0) terms.push(kr(b, sq(r)));
	return terms.length ? join(terms) : '0';
}

/** raw/den as a fraction, or raw alone when den is 1. */
const over = (raw: string, den: number): string => (den === 1 ? raw : `\\frac{${raw}}{${den}}`);

/** Parentheses around a value when it has more than one term or a sign. */
function par(t: string): string {
	if (t.startsWith('\\frac')) return t;
	return /^-|\s[+-]\s/.test(t) ? `(${t})` : t;
}

/** k(body) with k = 1 left implicit. */
function times(k: number, body: string): string {
	if (k === 1) return `(${body})`;
	if (k === -1) return `-(${body})`;
	return `${k}(${body})`;
}

function nz(rng: Rng, a: number, b: number): number {
	let v = 0;
	while (v === 0) v = rng.int(a, b);
	return v;
}

/**
 * A binomial α + β√r (α, β integers, both non-zero) with the order it is written in. Its conjugate
 * flips the sign of the second written term; the product with it is first² − second².
 */
interface Lin {
	alpha: number;
	beta: number;
	radFirst: boolean;
	r: number;
}

const linVal = (l: Lin): Q2 => Q2.of(l.alpha, l.beta, l.r);
const linTex = (l: Lin): string => (l.radFirst ? join([kr(l.beta, sq(l.r)), `${l.alpha}`]) : join([`${l.alpha}`, kr(l.beta, sq(l.r))]));
const conj = (l: Lin): Lin => (l.radFirst ? { ...l, alpha: -l.alpha } : { ...l, beta: -l.beta });
/** first² − second², written and as a number. */
function normOf(l: Lin): { tex: string; value: number } {
	const rad = l.beta * l.beta * l.r;
	const num = l.alpha * l.alpha;
	const [f, s] = l.radFirst ? [rad, num] : [num, rad];
	return { tex: `${f} - ${s}`, value: f - s };
}

// ---------------------------------------------------------------------------
// Options

interface Opt {
	latex: string;
	/** Exact value (SymPy syntax); for level 7, the relation and the bound. */
	values: string[];
	/** Same value as the answer but not a finished result (radical not simplified). */
	unfinished?: boolean;
}

const optKey = (o: Opt): string => o.values.join('|') + (o.unfinished ? '#u' : '');

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	/** The answer as an option (the right one). */
	right: Opt;
	/** Distractors in order of preference; the named mistakes first, then fallbacks. */
	named: Opt[];
	fallback: Opt[];
	/** Level 1-5: the answer expression; 6: the solution; 7: none. */
	answerKind: 'expression' | 'set' | 'choice';
	answerLatex: string;
	form?: 'simplified' | 'rationalized';
	params: Record<string, unknown>;
}

const PROMPT_SIMPLE = 'Calcola e scrivi il risultato nella forma più semplice.';
const PROMPT_RATIONAL = 'Calcola e scrivi il risultato nella forma più semplice, con il denominatore razionale.';

const q2opt = (x: Q2, prefix = ''): Opt => ({ latex: `${prefix}${x.tex()}`, values: [x.str()] });

// ---------------------------------------------------------------------------
// Level 1: sums of radicals that become similar after simplification

/** K·ⁿ√r as SymPy. */
function radStr(k: number, n: number, r: number): string {
	if (n === 2) return Surd.of(0, k, r, 1).toString();
	const body = `${r}**(1/${n})`;
	return k === 1 ? body : k === -1 ? `-${body}` : `${k}*${body}`;
}

function level1(rng: Rng): Built {
	const cube = rng.next() < 0.25;
	const n = cube ? 3 : 2;
	for (;;) {
		const r = cube ? rng.pick([2, 3, 5]) : rng.pick([2, 3, 5, 6, 7]);
		const count = cube ? rng.pick([2, 2, 3]) : rng.pick([2, 3, 3, 3]);
		const terms = Array.from({ length: count }, (_, i) => ({
			s: i === 0 ? 1 : rng.pick([1, -1]),
			c: cube ? rng.pick([1, 1, 1, 2]) : rng.pick([1, 1, 1, 2, 3]),
			m: rng.int(1, cube ? 3 : 5),
		}));
		const R = (t: { m: number }) => t.m ** n * r;
		if (terms.some((t) => R(t) > (cube ? 250 : 200))) continue;
		if (terms.filter((t) => t.m >= 2).length < 2) continue;
		if (new Set(terms.map(R)).size !== count) continue;
		const K = terms.reduce((acc, t) => acc + t.s * t.c * t.m, 0);
		if (K === 0 || Math.abs(K) > 15) continue;

		const rad = rt(n, r);
		const problem = join(terms.map((t) => kr(t.s * t.c, rt(n, R(t)))));
		const steps: string[] = [];
		const out = terms.filter((t) => t.m >= 2).map((t) => `${rt(n, R(t))} = ${kr(t.m, rad)}`);
		steps.push(`\\text{Porta fuori dal segno di radice i fattori ${cube ? 'cubi' : 'quadrati'}: } ${out.join(',\\ ')}`);
		const subst = join(
			terms.map((t) => (t.c > 1 && t.m > 1 ? `${t.s < 0 ? '-' : ''}${t.c} \\cdot ${t.m}${rad}` : kr(t.s * t.c * t.m, rad))),
		);
		const multiplied = join(terms.map((t) => kr(t.s * t.c * t.m, rad)));
		steps.push(`\\text{Sostituisci: } ${subst}${subst === multiplied ? '' : ` = ${multiplied}`}`);
		const answerTex = kr(K, rad);
		steps.push(`\\text{Somma i radicali simili: } (${join(terms.map((t) => `${t.s * t.c * t.m}`))})${rad} = ${answerTex}`);

		const mk = (k: number): Opt => ({ latex: kr(k, rad), values: [radStr(k, n, r)] });
		const named: Opt[] = [];
		const k1 = terms.reduce((acc, t) => acc + t.s * t.c, 0);
		if (k1 !== 0) named.push(mk(k1)); // extracted factors forgotten
		if (terms.some((t) => t.c > 1 && t.m > 1)) {
			const k2 = terms.reduce((acc, t) => acc + t.s * (t.c > 1 && t.m > 1 ? t.c + t.m : t.c * t.m), 0);
			if (k2 !== 0) named.push(mk(k2)); // coefficient and extracted factor added
		}
		const last = terms[count - 1];
		const k3 = K - 2 * last.s * last.c * last.m;
		if (k3 !== 0) named.push(mk(k3)); // sign of the last term
		const big = Math.abs(K) ** n * r;
		if (Math.abs(K) >= 2 && big <= 1000 && rng.next() < 0.5) {
			named.push({ latex: kr(Math.sign(K), rt(n, big)), values: [radStr(K, n, r)], unfinished: true });
		}
		const fallback = [K + 1, K - 1, K + 2, K - 2, -K, 2 * K].filter((k) => k !== 0).map(mk);
		return {
			prompt: PROMPT_SIMPLE,
			problem,
			steps,
			solution: `${problem} = ${answerTex}`,
			right: mk(K),
			named,
			fallback,
			answerKind: 'expression',
			answerLatex: answerTex,
			form: 'simplified',
			params: { case: cube ? 'cubiche' : 'quadratiche', index: n, r, terms, k: K },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: products and notable products, result a + b√r

interface Piece {
	tex: string;
	val: Q2;
	step: string;
	/** The value with the typical mistake of this piece. */
	wrong: Q2;
	kind: string;
}

function squarePiece(rng: Rng, r: number): Piece {
	const k = rng.pick([1, 1, 1, 2]);
	const a = rng.int(1, 5);
	const s = rng.pick([1, -1]);
	const radFirst = rng.next() < 0.7;
	const rad = kr(k, sq(r));
	const op = s > 0 ? '+' : '-';
	const tex = radFirst ? `(${rad} ${op} ${a})^2` : `(${a} ${op} ${rad})^2`;
	const [f2, s2] = radFirst ? [k * k * r, a * a] : [a * a, k * k * r];
	const val = Q2.of(k * k * r + a * a, 2 * s * k * a, r);
	return {
		tex,
		val,
		step: `\\text{Quadrato di un binomio: } ${tex} = ${f2} ${op} ${kr(2 * k * a, sq(r))} + ${s2} = ${val.tex()}`,
		wrong: Q2.of(k * k * r + a * a, 0, r),
		kind: 'quadrato',
	};
}

function sumDiffPiece(rng: Rng, r: number): Piece {
	for (;;) {
		const k = rng.pick([1, 1, 2]);
		const b = rng.int(1, 5);
		if (k * k * r === b * b) continue;
		const rad = kr(k, sq(r));
		const v = rng.int(0, 2);
		const tex = v === 0 ? `(${rad} - ${b})(${rad} + ${b})` : v === 1 ? `(${rad} + ${b})(${rad} - ${b})` : `(${b} - ${rad})(${b} + ${rad})`;
		const [f2, s2] = v < 2 ? [k * k * r, b * b] : [b * b, k * k * r];
		const val = Q2.of(f2 - s2, 0, r);
		return {
			tex,
			val,
			step: `\\text{Somma per differenza: } ${tex} = ${f2} - ${s2} = ${val.tex()}`,
			wrong: Q2.of(f2 + s2, 0, r),
			kind: 'somma per differenza',
		};
	}
}

function distPiece(rng: Rng, r: number): Piece {
	const c = rng.int(1, 3);
	const a = rng.int(1, 5);
	const s = rng.pick([1, -1]);
	const tex = `${kr(c, sq(r))}(${sq(r)} ${s > 0 ? '+' : '-'} ${a})`;
	const val = Q2.of(c * r, s * c * a, r);
	return {
		tex,
		val,
		step: `\\text{Proprietà distributiva: } ${tex} = ${val.tex()}`,
		wrong: Q2.of(c * r + s * a, 0, r),
		kind: 'distributiva',
	};
}

function productPiece(rng: Rng, r: number): Piece {
	for (;;) {
		const a = nz(rng, -5, 5);
		const c = nz(rng, -5, 5);
		if (a === c || a === -c) continue;
		const tex = `(${join([sq(r), `${a}`])})(${join([sq(r), `${c}`])})`;
		const val = Q2.of(r + a * c, a + c, r);
		const four = join([`${r}`, kr(c, sq(r)), kr(a, sq(r)), `${a * c}`]);
		return {
			tex,
			val,
			step: `\\text{Moltiplica ogni termine per ogni termine: } ${tex} = ${four} = ${val.tex()}`,
			wrong: Q2.of(r + a * c, 0, r),
			kind: 'prodotto',
		};
	}
}

function level2(rng: Rng): Built {
	for (;;) {
		const r = rng.pick([2, 3, 5, 6, 7]);
		const t1 = squarePiece(rng, r);
		const u = rng.next();
		const t2 = u < 0.4 ? sumDiffPiece(rng, r) : u < 0.6 ? squarePiece(rng, r) : u < 0.8 ? distPiece(rng, r) : productPiece(rng, r);
		const minus = t2.kind === 'somma per differenza' ? rng.next() < 0.7 : rng.next() < 0.5;
		const res = minus ? t1.val.sub(t2.val) : t1.val.add(t2.val);
		if (res.isZero() || !nice(res, 1, 80) || Math.abs(res.surd().b) > 30) continue;
		const op = minus ? '-' : '+';
		const problem = `${t1.tex} ${op} ${t2.tex}`;
		const comb = (x: Q2, y: Q2) => (minus ? x.sub(y) : x.add(y));
		const steps = [t1.step, t2.step, `\\text{Sostituisci i risultati: } ${par(t1.val.tex())} ${op} ${par(t2.val.tex())} = ${res.tex()}`];

		const named: Opt[] = [comb(t1.wrong, t2.val), comb(t1.val, t2.wrong)].map((v) => q2opt(v));
		if (minus) {
			// the minus changes only the first term of what follows
			const t2b = t2.val.b.isZero() ? t2.val.neg() : Q2.of(t2.val.a, t2.val.b.neg(), r);
			named.push(q2opt(t1.val.sub(t2b)));
		}
		const s = res.surd();
		if (s.a !== 0 && s.b !== 0) named.push(q2opt(Q2.of(0, s.a + s.b, r))); // unlike terms added
		const fallback = [Q2.of(1, 0, r), Q2.of(-1, 0, r), Q2.of(0, 1, r), Q2.of(0, -1, r), Q2.of(2, 0, r)].map((d) => q2opt(res.add(d)));
		return {
			prompt: PROMPT_SIMPLE,
			problem,
			steps,
			solution: `${problem} = ${res.tex()}`,
			right: q2opt(res),
			named,
			fallback,
			answerKind: 'expression',
			answerLatex: res.tex(),
			form: 'simplified',
			params: { case: t2.kind, r, value: res.str() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: quotients, denominator a monomial

/** Candidate distractors "only one term divided": (A + B√r)/D becomes A/D + B√r or A + (B/D)√r. */
function oneTermOnly(A: number, B: number, D: number, r: number): Q2[] {
	if (D === 1 || D === -1 || A === 0 || B === 0) return [];
	return [Q2.of(q(A, D), B, r), Q2.of(A, q(B, D), r)];
}

function level3(rng: Rng): Built {
	for (;;) {
		const u = rng.next();
		if (u < 0.4) {
			// (k√(rs) ± c√s)/√s ± m/√r
			const [r, s] = rng.pick([
				[2, 3],
				[3, 2],
				[2, 5],
				[5, 2],
				[3, 5],
				[5, 3],
				[7, 2],
				[2, 7],
				[7, 3],
				[3, 7],
			]);
			const k = rng.pick([1, 1, 2]);
			const c = nz(rng, -4, 4);
			const m = rng.int(1, 12);
			const minus = rng.next() < 0.6;
			const num = join([kr(k, sq(r * s)), kr(c, sq(s))]);
			const frac1 = `\\frac{${num}}{${sq(s)}}`;
			const frac2 = `\\frac{${m}}{${sq(r)}}`;
			const first = Q2.of(c, k, r);
			const second = Q2.of(0, q(m, r), r);
			const res = minus ? first.sub(second) : first.add(second);
			if (res.isZero() || !nice(res, 6, 30)) continue;
			const op = minus ? '-' : '+';
			const problem = `${frac1} ${op} ${frac2}`;
			const steps = [
				`\\text{Dividi ogni termine del numeratore per } ${sq(s)}\\text{: } ${frac1} = ${join([kr(k, sq(r)), `${c}`])}`,
				`\\text{Razionalizza: } ${frac2} = \\frac{${kr(m, sq(r))}}{${r}}${m % r === 0 ? ` = ${second.tex()}` : ''}`,
				`\\text{Somma: } ${par(join([kr(k, sq(r)), `${c}`]))} ${op} ${second.tex()} = ${res.tex()}`,
			];
			const comb = (x: Q2, y: Q2) => (minus ? x.sub(y) : x.add(y));
			const named = [comb(first, Q2.of(0, m, r)), minus ? first.add(second) : first.sub(second), Q2.of(0, res.a.add(res.b), r)];
			return l3built(problem, steps, res, named, r, 'numeratore da dividere');
		}
		if (u < 0.7) {
			// A√(j²r) ± m/(v√r), sometimes ± e
			const r = rng.pick([2, 3, 5, 6, 7]);
			const A = rng.pick([1, 1, 2]);
			const j = rng.int(2, 4);
			if (j * j * r > 150) continue;
			const v = rng.pick([1, 1, 2]);
			const m = rng.int(1, 12);
			const minus = rng.next() < 0.5;
			const e = rng.next() < 0.4 ? nz(rng, -9, 9) : 0;
			const frac = `\\frac{${m}}{${kr(v, sq(r))}}`;
			const second = Q2.of(0, q(m, v * r), r);
			const firstV = Q2.of(0, A * j, r);
			const op = minus ? '-' : '+';
			let res = minus ? firstV.sub(second) : firstV.add(second);
			res = res.add(Q2.of(e, 0, r));
			if (res.isZero() || !nice(res, 6, 30)) continue;
			const problem = `${kr(A, sq(j * j * r))} ${op} ${frac}${e === 0 ? '' : e > 0 ? ` + ${e}` : ` - ${-e}`}`;
			const steps = [
				`\\text{Porta fuori dal segno di radice: } ${sq(j * j * r)} = ${kr(j, sq(r))}`,
				`\\text{Razionalizza: } ${frac} = \\frac{${kr(m, sq(r))}}{${v * r}}${gcd(m, v * r) > 1 ? ` = ${second.tex()}` : ''}`,
				`\\text{Somma i radicali simili: } ${join([kr(A * j, sq(r)), (minus ? '-' : '') + second.tex(), e === 0 ? '' : `${e}`])} = ${res.tex()}`,
			];
			const wrongSecond = Q2.of(0, q(m, v), r); // forgot to divide by r
			const named = [
				(minus ? firstV.sub(wrongSecond) : firstV.add(wrongSecond)).add(Q2.of(e, 0, r)),
				(minus ? firstV.add(second) : firstV.sub(second)).add(Q2.of(e, 0, r)),
			];
			if (e !== 0) named.push(Q2.of(0, res.a.add(res.b), r));
			return l3built(problem, steps, res, named, r, 'radicale e frazione');
		}
		// (a + b√r)/(v√r)
		const r = rng.pick([2, 3, 5, 6, 7]);
		const a = nz(rng, -12, 12);
		const b = nz(rng, -5, 5);
		const v = rng.pick([1, 1, 2]);
		const num = rng.next() < 0.5 ? join([`${a}`, kr(b, sq(r))]) : join([kr(b, sq(r)), `${a}`]);
		const den = kr(v, sq(r));
		const res = Q2.of(q(b, v), q(a, v * r), r);
		if (!nice(res, 6, 30)) continue;
		const problem = `\\frac{${num}}{${den}}`;
		const rawNum = rawLin(b * r, a, r);
		const steps = [
			`\\text{Moltiplica numeratore e denominatore per } ${sq(r)}\\text{: } \\frac{(${num})${sq(r)}}{${v * r}} = \\frac{${rawNum}}{${v * r}}`,
			`\\text{Semplifica: } \\frac{${rawNum}}{${v * r}} = ${res.tex()}`,
		];
		const named = [...oneTermOnly(b * r, a, v * r, r), Q2.of(0, res.a.add(res.b), r), Q2.of(q(a, v), q(b, v), r)];
		return l3built(problem, steps, res, named, r, 'binomio su monomio');
	}
}

function l3built(problem: string, steps: string[], res: Q2, named: Q2[], r: number, kase: string): Built {
	const fallback = [Q2.of(1, 0, r), Q2.of(-1, 0, r), Q2.of(0, 1, r), Q2.of(0, -1, r), Q2.of(0, q(1, 2), r)].map((d) => q2opt(res.add(d)));
	return {
		prompt: PROMPT_RATIONAL,
		problem,
		steps,
		solution: `${problem} = ${res.tex()}`,
		right: q2opt(res),
		named: named.filter((x) => !x.isZero() && nice(x, 12, 60)).map((x) => q2opt(x)),
		fallback,
		answerKind: 'expression',
		answerLatex: res.tex(),
		form: 'rationalized',
		params: { case: kase, r, value: res.str() },
	};
}

// ---------------------------------------------------------------------------
// Level 4: denominators with a binomial, the conjugate

const L4_R = [2, 3, 5, 6, 7, 10, 11, 13];

function level4(rng: Rng): Built {
	for (;;) {
		const u = rng.next();
		const r = rng.pick(L4_R);
		if (u < 0.35) {
			// m/(√r - b) ± n/(√r + b)
			const b = rng.int(1, 4);
			if (b * b === r || Math.abs(r - b * b) > 9) continue;
			const m = rng.int(1, 6);
			const n = rng.int(1, 6);
			const minus = rng.next() < 0.4;
			const lm: Lin = { alpha: -b, beta: 1, r, radFirst: true };
			const lp: Lin = { alpha: b, beta: 1, r, radFirst: true };
			const f1 = `\\frac{${m}}{${linTex(lm)}}`;
			const f2 = `\\frac{${n}}{${linTex(lp)}}`;
			const op = minus ? '-' : '+';
			const v1 = Q2.of(m, 0, r).div(linVal(lm));
			const v2 = Q2.of(n, 0, r).div(linVal(lp));
			const res = minus ? v1.sub(v2) : v1.add(v2);
			if (res.isZero() || !nice(res, 6, 40)) continue;
			const D = r - b * b;
			const sgn = minus ? -1 : 1;
			const A = m * b - sgn * n * b; // rational part of the numerator
			const B = m + sgn * n;
			const problem = `${f1} ${op} ${f2}`;
			const rawNum = rawLin(A, B, r);
			const steps = [
				`\\text{Denominatore comune: } (${linTex(lm)})(${linTex(lp)}) = ${r} - ${b * b} = ${D}`,
				`\\text{Numeratore: } ${times(m, linTex(lp))} ${op} ${times(n, linTex(lm))} = ${rawNum}`,
				`\\text{Il risultato è } ${over(rawNum, D)}${over(rawNum, D) === res.tex() ? '' : ` = ${res.tex()}`}`,
			];
			const wrongConj = Q2.of(-m * b + sgn * n * b, m - sgn * n, r).scale(q(1, D));
			const named = [
				wrongConj,
				Q2.of(A, B, r).scale(q(1, r + b * b)),
				minus ? v1.add(v2) : v1.sub(v2),
				...oneTermOnly(A, B, D, r),
			];
			return l4built(problem, steps, res, named, r, 'due frazioni');
		}
		if (u < 0.65) {
			// m/(k√r ± b) ± t
			const k = rng.pick([1, 1, 2]);
			const b = nz(rng, -4, 4);
			const l: Lin = rng.next() < 0.75 ? { alpha: b, beta: k, r, radFirst: true } : { alpha: Math.abs(b), beta: k * (b < 0 ? -1 : 1), r, radFirst: false };
			const nm = normOf(l);
			if (nm.value === 0) continue;
			const m = rng.int(1, 8) * (rng.next() < 0.5 ? 1 : Math.abs(nm.value));
			if (m > 30) continue;
			const tRad = rng.next() < 0.5;
			const t = nz(rng, -5, 5);
			const tv = tRad ? Q2.of(0, t, r) : Q2.of(t, 0, r);
			const frac = `\\frac{${m}}{${linTex(l)}}`;
			const fv = Q2.of(m, 0, r).div(linVal(l));
			const res = fv.add(tv);
			if (res.isZero() || !nice(res, 6, 40)) continue;
			const tTex = tRad ? kr(t, sq(r)) : `${t}`;
			const problem = join([frac, tTex]);
			const c = conj(l);
			const cv = linVal(c).scale(q(m));
			const rawA = cv.a.num;
			const rawB = cv.b.num;
			const steps = [
				`\\text{Moltiplica numeratore e denominatore per il coniugato } ${linTex(c)}\\text{: } ${frac} = \\frac{${times(m, linTex(c))}}{${nm.tex}} = ${over(rawLin(rawA, rawB, r), nm.value)}${
					fv.tex() === rawLin(rawA, rawB, r) && nm.value === 1 ? '' : ` = ${fv.tex()}`
				}`,
				`\\text{Somma: } ${join([par(fv.tex()), tTex])} = ${res.tex()}`,
			];
			const wrongConj = linVal(l).scale(q(m, nm.value)).add(tv);
			const named = [
				wrongConj,
				Q2.of(m, 0, r).mul(linVal(c)).scale(q(1, l.alpha * l.alpha + l.beta * l.beta * r)).add(tv),
				fv.sub(tv),
				...oneTermOnly(rawA, rawB, nm.value, r).map((x) => x.add(tv)),
			];
			return l4built(problem, steps, res, named, r, 'frazione e termine');
		}
		// (√r + c)/(√r + d)
		const c = nz(rng, -5, 5);
		const d = nz(rng, -5, 5);
		if (c === d || d * d === r) continue;
		const numL: Lin = { alpha: c, beta: 1, r, radFirst: rng.next() < 0.7 };
		const denL: Lin = { alpha: d, beta: 1, r, radFirst: true };
		const nm = normOf(denL);
		const res = linVal(numL).div(linVal(denL));
		if (res.isZero() || !nice(res, 6, 40)) continue;
		const cj = conj(denL);
		const raw = linVal(numL).mul(linVal(cj));
		const frac = `\\frac{${linTex(numL)}}{${linTex(denL)}}`;
		const problem = frac;
		const steps = [
			`\\text{Moltiplica numeratore e denominatore per il coniugato } ${linTex(cj)}\\text{: } \\frac{(${linTex(numL)})(${linTex(cj)})}{${nm.tex}} = ${over(rawLin(raw.a.num, raw.b.num, r), nm.value)}`,
			`\\text{Semplifica: } ${over(rawLin(raw.a.num, raw.b.num, r), nm.value)} = ${res.tex()}`,
		];
		const named = [
			linVal(numL).mul(linVal(denL)).scale(q(1, nm.value)), // multiplied by the same binomial
			raw.scale(q(1, r + d * d)), // r + d² in the denominator
			...oneTermOnly(raw.a.num, raw.b.num, nm.value, r),
			Q2.of(0, res.a.add(res.b), r),
		];
		return l4built(problem, steps, res, named, r, 'binomio su binomio');
	}
}

function l4built(problem: string, steps: string[], res: Q2, named: Q2[], r: number, kase: string): Built {
	const b = l3built(problem, steps, res, named, r, kase);
	return b;
}

// ---------------------------------------------------------------------------
// Level 5: different indices. Values are products of prime powers with rational exponents.

type PE = Map<number, Rational>;
const PRIMES = [2, 3, 5];

function peFinished(e: PE): { c: number; m: number; N: number } {
	let c = 1;
	let m = 1;
	const fr: [number, Rational][] = [];
	for (const p of PRIMES) {
		const E = e.get(p);
		if (!E || E.isZero()) continue;
		const k = Math.floor(E.num / E.den);
		const f = E.sub(q(k));
		c *= p ** k;
		if (!f.isZero()) {
			fr.push([p, f]);
			m = lcm(m, f.den);
		}
	}
	let N = 1;
	for (const [p, f] of fr) N *= p ** (f.num * (m / f.den));
	return { c, m, N };
}

function peLatex(e: PE): string {
	const { c, m, N } = peFinished(e);
	if (m === 1) return `${c}`;
	return `${c === 1 ? '' : c}${rt(m, N)}`;
}

function peStr(e: PE): string {
	const parts: string[] = [];
	for (const p of PRIMES) {
		const E = e.get(p);
		if (!E || E.isZero()) continue;
		parts.push(E.isInteger() ? `${p}**${E.num}` : `${p}**(${E.num}/${E.den})`);
	}
	return parts.length ? parts.join('*') : '1';
}

const pw = (p: number, k: number): string => (k === 1 ? `${p}` : k < 10 ? `${p}^${k}` : `${p}^{${k}}`);

interface RadTerm {
	p: number;
	e: number;
	n: number;
	/** +1 multiplied, -1 divided. */
	s: number;
}

const COPRIME: Record<number, number[]> = { 2: [1], 3: [1, 2], 4: [1, 3], 6: [1, 5] };

function level5(rng: Rng): Built {
	for (;;) {
		const two = rng.next() < 0.3;
		const count = rng.pick([2, 3, 3]);
		const bases = two ? [2, 3] : [rng.pick([2, 2, 3, 3, 5])];
		const terms: RadTerm[] = [];
		for (let i = 0; i < count; i++) {
			const n = rng.pick([2, 3, 4, 6]);
			const p = two ? bases[i % 2] : bases[0];
			terms.push({ p, n, e: rng.pick(COPRIME[n]), s: i === 0 ? 1 : two ? (rng.next() < 0.2 ? -1 : 1) : rng.next() < 0.4 ? -1 : 1 });
		}
		if (terms.some((t) => t.p ** t.e > 250)) continue;
		if (new Set(terms.map((t) => t.n)).size < 2) continue;
		if (new Set(terms.map((t) => `${t.p},${t.n},${t.e}`)).size !== count) continue;
		const E: PE = new Map();
		for (const t of terms) E.set(t.p, (E.get(t.p) ?? q(0)).add(q(t.s * t.e, t.n)));
		if ([...E.values()].some((x) => x.sign() <= 0)) continue;
		const fin = peFinished(E);
		if (fin.c > 30 || fin.N > 1000) continue;
		const M = terms.reduce((acc, t) => lcm(acc, t.n), 1);

		const tex = (t: RadTerm) => rt(t.n, t.p ** t.e);
		const problem = terms.map((t, i) => (i === 0 ? tex(t) : `${t.s > 0 ? '\\cdot' : ':'} ${tex(t)}`)).join(' ');
		const answerTex = peLatex(E);
		const steps: string[] = [];
		steps.push(`\\text{Gli indici sono } ${[...new Set(terms.map((t) => t.n))].join(',\\ ')}\\text{: il loro minimo comune multiplo è } ${M}`);
		const radM = (body: string) => (M === 2 ? `\\sqrt{${body}}` : `\\sqrt[${M}]{${body}}`);
		const conv = terms.filter((t) => t.n !== M).map((t) => `${tex(t)} = ${radM(pw(t.p, (t.e * M) / t.n))}`);
		steps.push(`\\text{Porta ogni radicale all'indice } ${M}\\text{: } ${conv.join(',\\ ')}`);
		const under = terms.map((t, i) => (i === 0 ? '' : t.s > 0 ? ' \\cdot ' : ' : ') + pw(t.p, (t.e * M) / t.n)).join('');
		const combined = PRIMES.filter((p) => E.has(p))
			.map((p) => pw(p, E.get(p)!.num * (M / E.get(p)!.den)))
			.join(' \\cdot ');
		steps.push(`\\text{Sotto un'unica radice: } ${radM(under)}${under === combined ? '' : ` = ${radM(combined)}`}`);
		const what = [fin.c > 1 ? 'porta fuori i fattori' : '', fin.m !== M ? "semplifica l'indice" : ''].filter(Boolean).join(' e ') || 'calcola il radicando';
		steps.push(`\\text{${what[0].toUpperCase()}${what.slice(1)}: } ${radM(combined)} = ${answerTex}`);

		const mk = (e: PE): Opt => ({ latex: peLatex(e), values: [peStr(e)] });
		const named: Opt[] = [];
		// same index without raising the exponents: ⁿ√a · ᵐ√b = ᴹ√(a·b)
		const same: PE = new Map();
		for (const t of terms) same.set(t.p, (same.get(t.p) ?? q(0)).add(q(t.s * t.e, M)));
		if ([...same.values()].every((x) => x.sign() >= 0)) named.push(mk(same));
		if (terms.some((t) => t.s < 0)) {
			const plus: PE = new Map();
			for (const t of terms) plus.set(t.p, (plus.get(t.p) ?? q(0)).add(q(t.e, t.n)));
			named.push(mk(plus)); // ":" read as "·"
		}
		let big = 1;
		for (const p of PRIMES) if (E.has(p)) big *= p ** (E.get(p)!.num * (M / E.get(p)!.den));
		if (big <= 5000 && rt(M, big) !== answerTex) named.push({ latex: rt(M, big), values: [peStr(E)], unfinished: true });
		const fallback: Opt[] = [];
		for (const d of [q(1, M), q(-1, M), q(1), q(1, 2), q(-1)]) {
			const p0 = bases[0];
			const f: PE = new Map(E);
			f.set(p0, (f.get(p0) ?? q(0)).add(d));
			if ([...f.values()].every((x) => x.sign() >= 0) && ![...f.values()].every((x) => x.isZero())) fallback.push(mk(f));
		}
		return {
			prompt: PROMPT_SIMPLE,
			problem,
			steps,
			solution: `${problem} = ${answerTex}`,
			right: mk(E),
			named,
			fallback,
			answerKind: 'expression',
			answerLatex: answerTex,
			form: 'simplified',
			params: { case: two ? 'due basi' : 'una base', terms, value: peStr(E) },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 6 and 7: first degree with irrational coefficients

/** The x term k·√r·x or m·x as LaTeX. */
const xRad = (k: number, r: number): string => `${kr(k, sq(r))}\\,x`;
const xNum = (m: number): string => kr(m, 'x');

/** Steps from A x (rel) C to the value, A a binomial. Returns the steps and the value. */
function divideSteps(A: Lin, C: Q2, rel: string, flip: boolean): { steps: string[]; x: Q2; conjTex: string } {
	const c = conj(A);
	const nm = normOf(A);
	const x = C.div(linVal(A));
	const Ctex = C.tex();
	const steps: string[] = [];
	const rel2 = flip ? FLIP[rel] : rel;
	steps.push(`\\text{Dividi per il coefficiente: } x ${REL_TEX[rel2]} \\frac{${Ctex}}{${linTex(A)}}`);
	const numer = !C.b.isZero() ? `(${Ctex})(${linTex(c)})` : C.a.num === 1 ? linTex(c) : times(C.a.num, linTex(c));
	steps.push(`\\text{Razionalizza con il coniugato } ${linTex(c)}\\text{: } x ${REL_TEX[rel2]} \\frac{${numer}}{${nm.tex}} = ${x.tex()}`);
	return { steps, x, conjTex: linTex(c) };
}

const REL_TEX: Record<string, string> = { '=': '=', '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' };
const FLIP: Record<string, string> = { '=': '=', '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

interface Linear {
	problem: string;
	/** The coefficient of x after collecting, and the constant on the right. */
	A: Lin;
	C: Q2;
	steps: string[];
	layout: string;
}

/** k√r x + u (rel) m x + w, or with the radical on the right; or the collected form (A) x (rel) C. */
function linearProblem(rng: Rng, r: number, k: number, m: number, rel: string, collected: boolean, radLeft: boolean): Linear | null {
	const R = REL_TEX[rel];
	if (collected) {
		const A: Lin = radLeft ? { alpha: -m, beta: k, r, radFirst: true } : { alpha: m, beta: -k, r, radFirst: false };
		const c0 = nz(rng, -9, 9);
		const c1 = rng.next() < 0.35 ? nz(rng, -3, 3) : 0;
		const C = Q2.of(c0, c1, r);
		return { problem: `(${linTex(A)})\\,x ${R} ${C.tex()}`, A, C, steps: [], layout: 'raccolto' };
	}
	const u = rng.int(-9, 9);
	const w = rng.int(-9, 9);
	if (u === w) return null;
	const left = radLeft ? [xRad(k, r), u === 0 ? '' : `${u}`] : [xNum(m), u === 0 ? '' : `${u}`];
	const rightParts = radLeft ? [xNum(m), w === 0 ? '' : `${w}`] : [xRad(k, r), w === 0 ? '' : `${w}`];
	if (rng.next() < 0.3 && w !== 0) rightParts.reverse();
	const problem = `${join(left)} ${R} ${join(rightParts)}`;
	const A: Lin = radLeft ? { alpha: -m, beta: k, r, radFirst: true } : { alpha: m, beta: -k, r, radFirst: false };
	const C = Q2.of(w - u, 0, r);
	const moved = radLeft ? join([xRad(k, r), xNum(-m)]) : join([xNum(m), xRad(-k, r)]);
	const consts = join([w === 0 ? '' : `${w}`, u === 0 ? '' : `${-u}`]);
	const steps = [
		`\\text{Porta i termini con } x \\text{ a primo membro e i numeri a secondo membro: } ${moved} ${R} ${consts}`,
		`\\text{Raccogli } x\\text{: } (${linTex(A)})\\,x ${R} ${w - u}`,
	];
	return { problem, A, C, steps, layout: radLeft ? 'radicale a sinistra' : 'radicale a destra' };
}

function linearDistractors(A: Lin, C: Q2, x: Q2): Q2[] {
	const nm = normOf(A);
	const out: Q2[] = [];
	out.push(C.mul(linVal(A)).scale(q(1, nm.value))); // multiplied by the same binomial
	out.push(C.mul(linVal(conj(A))).scale(q(1, A.alpha * A.alpha + A.beta * A.beta * A.r))); // first² + second²
	out.push(x.neg());
	if (!C.isZero()) out.push(C.scale(q(1, nm.value))); // numerator not multiplied by the conjugate
	return out;
}

function level6(rng: Rng): Built {
	for (;;) {
		const u = rng.next();
		const r = rng.pick([2, 3, 5, 6, 7]);
		if (u < 0.25) {
			// similar radicals: √(a²r) x - √(b²r) x = c
			const a = rng.int(1, 4);
			const b = rng.int(1, 4);
			if (a === b || Math.max(a, b) < 2 || a * a * r > 150 || b * b * r > 150) continue;
			const c = nz(rng, -12, 12);
			const j = a - b;
			const x = Q2.of(c, 0, r).div(Q2.of(0, j, r));
			if (!nice(x, 4, 30)) continue;
			const ta = `${sq(a * a * r)}\\,x`;
			const tb = `${sq(b * b * r)}\\,x`;
			const moved = rng.next() < 0.5;
			const problem = moved ? `${ta} = ${tb} ${c > 0 ? '+' : '-'} ${Math.abs(c)}` : `${ta} - ${tb} = ${c}`;
			const ex = [a, b].filter((t) => t >= 2).map((t) => `${sq(t * t * r)} = ${kr(t, sq(r))}`);
			const steps = [
				`\\text{Porta fuori i fattori: } ${ex.join(',\\ ')}`,
				`${moved ? `\\text{Porta } ${kr(b, sq(r))}\\,x \\text{ a primo membro: } ` : ''}${xRad(a, r)} - ${xRad(b, r)} = ${c}`,
				`\\text{Somma i radicali simili: } ${xRad(j, r)} = ${c}`,
				`\\text{Dividi e razionalizza: } x = ${c * j < 0 ? '-' : ''}\\frac{${Math.abs(c)}}{${kr(Math.abs(j), sq(r))}} = ${c * j < 0 ? '-' : ''}\\frac{${kr(Math.abs(c), sq(r))}}{${Math.abs(j) * r}} = ${x.tex()}`,
			];
			const named = [
				Q2.of(0, q(c, j), r), // forgot to divide by r
				Q2.of(c, 0, r).div(Q2.of(0, a + b, r)), // √a - √b read as a sum
				x.neg(),
			];
			if (a > b) {
				const n = (a * a - b * b) * r; // √(a²r) - √(b²r) = √((a² - b²)r)
				const s = Surd.of(0, c, n, n);
				return l6built(problem, steps, x, named, r, 'radicali simili', [{ latex: `x = ${s.toLatex()}`, values: [s.toString()] }]);
			}
			return l6built(problem, steps, x, named, r, 'radicali simili', []);
		}
		const k = rng.pick([1, 1, 2]);
		const m = rng.int(1, 4);
		if (k * k * r === m * m) continue;
		const collected = u < 0.45;
		const lp = linearProblem(rng, r, k, m, '=', collected, rng.next() < 0.7);
		if (!lp) continue;
		const d = divideSteps(lp.A, lp.C, '=', false);
		const x = d.x;
		if (x.isZero() || !nice(x, 4, 30)) continue;
		const steps = [...lp.steps, ...d.steps];
		steps[lp.steps.length] = `\\text{Il coefficiente non è zero: dividi per } ${linTex(lp.A)}\\text{: } x = \\frac{${lp.C.tex()}}{${linTex(lp.A)}}`;
		return l6built(lp.problem, steps, x, linearDistractors(lp.A, lp.C, x), r, collected ? 'raccolto' : 'binomio', []);
	}
}

function l6built(problem: string, steps: string[], x: Q2, named: Q2[], r: number, kase: string, extra: Opt[]): Built {
	const xs = (v: Q2) => q2opt(v, 'x = ');
	const fallback = [Q2.of(1, 0, r), Q2.of(-1, 0, r), Q2.of(0, 1, r), Q2.of(0, -1, r), Q2.of(2, 0, r)].map((d) => xs(x.add(d)));
	return {
		prompt: "Risolvi l'equazione.",
		problem,
		steps,
		solution: `x = ${x.tex()}`,
		right: xs(x),
		named: [...named.filter((v) => nice(v, 12, 60)).map(xs), ...extra],
		fallback,
		answerKind: 'set',
		answerLatex: `S = \\left\\{ ${x.tex()} \\right\\}`,
		params: { case: kase, r, x: x.str() },
	};
}

function intervalTex(rel: string, b: string): string {
	switch (rel) {
		case '<':
			return `\\mathopen{]}-\\infty, ${b}\\mathclose{[}`;
		case '<=':
			return `\\mathopen{]}-\\infty, ${b}]`;
		case '>':
			return `\\mathopen{]}${b}, +\\infty\\mathclose{[}`;
		default:
			return `[${b}, +\\infty\\mathclose{[}`;
	}
}

function level7(rng: Rng): Built {
	const wantNeg = rng.next() < 0.55;
	for (;;) {
		const r = rng.pick([2, 3, 5, 6, 7]);
		const k = rng.pick([1, 1, 2]);
		const m = rng.int(1, 4);
		if (k * k * r === m * m) continue;
		const rel = rng.pick(['<', '>', '<=', '>=']);
		const collected = rng.next() < 0.4;
		const lp = linearProblem(rng, r, k, m, rel, collected, rng.next() < 0.6);
		if (!lp) continue;
		const sign = linVal(lp.A).sign();
		if ((sign < 0) !== wantNeg) continue;
		const flip = sign < 0;
		const d = divideSteps(lp.A, lp.C, rel, flip);
		const x = d.x;
		if (x.isZero() || !nice(x, 4, 30)) continue;
		const rel2 = flip ? FLIP[rel] : rel;
		const A = lp.A;
		const radSq = A.beta * A.beta * r;
		const numSq = A.alpha * A.alpha;
		const radT = `(${kr(Math.abs(A.beta), sq(r))})^2 = ${radSq}`;
		const numT = `${Math.abs(A.alpha)}^2 = ${numSq}`;
		const [big, small] = radSq > numSq ? [radT, numT] : [numT, radT];
		const why = `${big} > ${small}`;
		const steps = [
			...lp.steps,
			`\\text{Il coefficiente } ${linTex(A)} \\text{ è ${flip ? 'negativo' : 'positivo'}, perché } ${why}\\text{: dividendo, il verso ${flip ? 'cambia' : 'resta'}}`,
			...d.steps,
			`S = ${intervalTex(rel2, x.tex())}`,
		];
		const opt = (rl: string, v: Q2): Opt => ({ latex: `x ${REL_TEX[rl]} ${v.tex()}`, values: [rl, v.str()] });
		const strict: Record<string, string> = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };
		const named: Opt[] = [opt(FLIP[rel2], x)]; // direction not changed (or changed without reason)
		for (const v of linearDistractors(A, lp.C, x)) if (nice(v, 12, 60)) named.push(opt(rel2, v));
		const fallback = [opt(FLIP[rel2], x.neg()), opt(strict[rel2], x), opt(rel2, x.add(Q2.of(1, 0, r))), opt(rel2, x.add(Q2.of(-1, 0, r)))];
		return {
			prompt: 'Risolvi la disequazione.',
			problem: lp.problem,
			steps,
			solution: `x ${REL_TEX[rel2]} ${x.tex()}`,
			right: opt(rel2, x),
			named,
			fallback,
			answerKind: 'choice',
			answerLatex: `x ${REL_TEX[rel2]} ${x.tex()}`,
			params: { case: flip ? 'coefficiente negativo' : 'coefficiente positivo', layout: lp.layout, r, rel: rel2, bound: x.str() },
		};
	}
}

// ---------------------------------------------------------------------------
// Assembly

function build(rng: Rng, level: number): Built {
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

function shuffle<T>(xs: T[], rng: Rng): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** Four options: the right one, then named mistakes (shuffled), then fallbacks; distinct by value. */
function makeChoice(right: Opt, named: Opt[], fallback: Opt[], rng: Rng): ChoiceAnswer {
	const seen = new Set<string>([optKey(right)]);
	const latexSeen = new Set<string>([right.latex]);
	const chosen: Opt[] = [right];
	for (const o of [...shuffle(named, rng), ...fallback]) {
		if (chosen.length >= 4) break;
		const k = optKey(o);
		if (seen.has(k) || latexSeen.has(o.latex)) continue;
		seen.add(k);
		latexSeen.add(o.latex);
		chosen.push(o);
	}
	if (chosen.length < 4) throw new Error(`${ID}: not enough distractors`);
	const order = shuffle(
		chosen.map((_, i) => i),
		rng,
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: chosen[i].latex, values: chosen[i].values }));
	return { kind: 'choice', options, correct: order.indexOf(0) };
}

/** Drops a final "= X" that repeats the side before it, and then a step left without any equality. */
function tidyStep(step: string): string | null {
	const parts = step.split(' = ');
	if (parts.length < 2 || parts[parts.length - 1].trim() !== parts[parts.length - 2].replace(/^.*\\text\{[^}]*\}\s*/, '').trim()) return step;
	if (parts.length === 2) return null;
	return parts.slice(0, -1).join(' = ');
}

function assemble(b: Built, level: number, rng: Rng): Sample {
	const params = { ...b.params, right: b.right, named: b.named, fallback: b.fallback };
	let answer: Sample['answer'];
	if (b.answerKind === 'expression') {
		answer = { kind: 'expression', value: b.right.values[0], latex: b.answerLatex, ...(b.form ? { form: b.form } : {}) };
	} else if (b.answerKind === 'set') {
		answer = { kind: 'set', values: [b.right.values[0]], latex: b.answerLatex };
	} else {
		answer = makeChoice(b.right, b.named, b.fallback, rng);
	}
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps.map(tidyStep).filter((t): t is string => t !== null),
		answer,
		params,
	};
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params as { right: Opt; named: Opt[]; fallback: Opt[] };
	return makeChoice(p.right, p.named, p.fallback, rng);
}

/** The denominators of the \\frac groups of a LaTeX string (braces balanced). */
function fracDens(tex: string): string[] {
	const out: string[] = [];
	const group = (i: number): number => {
		let depth = 0;
		for (let j = i; j < tex.length; j++) {
			if (tex[j] === '{') depth++;
			else if (tex[j] === '}' && --depth === 0) return j;
		}
		return tex.length;
	};
	for (let i = tex.indexOf('\\frac'); i >= 0; i = tex.indexOf('\\frac', i + 1)) {
		const e1 = group(i + 5);
		const e2 = group(e1 + 1);
		out.push(tex.slice(e1 + 2, e2));
	}
	return out;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const p = sample.params as { right?: Opt; named?: Opt[]; fallback?: Opt[]; case?: string };
	if (!p.right || !p.named || !p.fallback) return [...v, 'params.right/named/fallback mancanti'];
	if (!sample.steps.length) v.push('nessun passaggio');
	const a = sample.answer;
	const lvl = sample.level;
	if (lvl <= 5) {
		if (a.kind !== 'expression') v.push('risposta: serve expression');
		else {
			if (a.value !== p.right.values[0] || a.latex !== p.right.latex) v.push('risposta diversa da params.right');
			if (a.form !== (lvl === 3 || lvl === 4 ? 'rationalized' : 'simplified')) v.push(`form sbagliata: ${a.form}`);
			if (a.latex.includes('\\frac') && /\\frac\{[^}]*\}\{[^}]*\\sqrt/.test(a.latex)) v.push('radicale al denominatore');
		}
	} else if (lvl === 6) {
		if (a.kind !== 'set' || a.values.length !== 1 || a.values[0] !== p.right.values[0]) v.push('risposta: serve un insieme con la soluzione');
	} else if (lvl === 7) {
		if (a.kind !== 'choice' || a.options.length !== 4) v.push('risposta: servono quattro opzioni');
		else if (a.options[a.correct].latex !== p.right.latex) v.push('opzione giusta sbagliata');
	}
	const cases: Record<number, string[]> = {
		1: ['quadratiche', 'cubiche'],
		2: ['somma per differenza', 'quadrato', 'distributiva', 'prodotto'],
		3: ['numeratore da dividere', 'radicale e frazione', 'binomio su monomio'],
		4: ['due frazioni', 'frazione e termine', 'binomio su binomio'],
		5: ['una base', 'due basi'],
		6: ['radicali simili', 'raccolto', 'binomio'],
		7: ['coefficiente negativo', 'coefficiente positivo'],
	};
	if (!cases[lvl]?.includes(String(p.case))) v.push(`caso ${String(p.case)} non previsto al livello ${lvl}`);
	if (lvl === 1 && (sample.problem.match(/\\sqrt/g) ?? []).length < 2) v.push('servono almeno due radicali');
	const dens = fracDens(sample.problem);
	if (lvl === 3 && (!dens.some((d) => /^\d*\\sqrt\{\d+\}$/.test(d)) || dens.some((d) => / [+-] /.test(d)))) v.push('serve un denominatore monomio con la radice');
	if (lvl === 4 && !dens.some((d) => / [+-] /.test(d) && d.includes('\\sqrt'))) v.push('serve un denominatore binomio');
	if (lvl === 5) {
		const idx = new Set([...sample.problem.matchAll(/\\sqrt(?:\[(\d+)\])?/g)].map((m) => m[1] ?? '2'));
		if (idx.size < 2) v.push('servono almeno due indici diversi');
	}
	return v;
}

export const numeriRealiEspressioni: Generator = {
	id: ID,
	title: 'Espressioni con i radicali',
	levels: {
		1: {
			label: 'Semplificare prima di sommare',
			constraints: [
				'da 2 a 4 radicali dello stesso indice che diventano simili dopo aver portato fuori i fattori (almeno due da semplificare)',
				'radici quadrate con radicando fino a 200, circa una volta su quattro radici cubiche con radicando fino a 250',
				'risultato k·ⁿ√r con k intero non nullo, |k| <= 15',
			],
		},
		2: {
			label: 'Prodotti notevoli con i radicali',
			constraints: [
				'un quadrato di binomio più o meno un secondo prodotto (somma per differenza, quadrato, distributiva, prodotto di binomi) con lo stesso radicale',
				'risultato a + b√r intero, |a| <= 80, |b| <= 30, non nullo',
			],
		},
		3: {
			label: 'Razionalizzare un denominatore monomio',
			constraints: [
				'almeno una frazione con un radicale (monomio) al denominatore',
				'risultato (a + b√r)/d con d <= 6, non nullo',
			],
		},
		4: {
			label: 'Denominatore binomio: il coniugato',
			constraints: ['almeno una frazione con un binomio √r ± b al denominatore', 'risultato (a + b√r)/d con d <= 6, |a|, |b| <= 40, non nullo'],
		},
		5: {
			label: 'Radicali con indici diversi',
			constraints: [
				'da 2 a 3 radicali di indice 2, 3, 4 o 6 di potenze di 2, 3 o 5, almeno due indici diversi, moltiplicati o divisi',
				'risultato c·ᵐ√N semplificato, con esponenti non negativi, c <= 30, N <= 1000',
			],
		},
		6: {
			label: 'Equazioni con coefficienti irrazionali',
			constraints: [
				'equazione di primo grado con coefficiente di x irrazionale (binomio k√r − m, oppure radicali simili)',
				'soluzione (a + b√r)/d con d <= 4 e |a|, |b| <= 30',
			],
		},
		7: {
			label: 'Disequazioni: il segno del coefficiente',
			constraints: [
				'coefficiente di x del tipo k√r − m o m − k√r, negativo circa una volta su due',
				'estremo (a + b√r)/d con d <= 4 e |a|, |b| <= 30; risposta a scelta multipla',
			],
		},
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = assemble(build(rng, level), level, rng);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRealiEspressioni;
