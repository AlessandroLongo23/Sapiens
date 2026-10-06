/**
 * Equazioni esponenziali. Spec: specs/exercises/equazioni-esponenziali.md
 *
 * Seven levels in the order of lesson 122 (docs/lezioni/riscritte/122-equazioni-esponenziali.md): the elementary
 * equation, the same base with an exponent of first degree, bases that are powers of the same number, an exponent
 * of second degree, the common power taken out of a sum, the substitution t = a^x, and opposite exponents.
 *
 * Built backwards from the solutions: every equation is a sum of terms c · a^(p · e(x)) on each side, with one
 * prime base a, and `params` carries those terms. No equation needs a logarithm: every value of a power that
 * appears is a power of the base with an integer exponent. The answer is the set of the solutions; the wrong
 * options of the multiple choice are the solutions of the mistakes named in the lesson's warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, q } from '../rational';
import { polyToLatex } from '../latex';
import { forbidden } from '../monomi';
import { intNot, linLatex, numPow, powLatex, ratPow, setKey, setOption, shuffled, solLatex, sortRat } from '../esponenziali';

export const ID = 'equazioni-esponenziali';

/** c · a^(p · e(x)), with e a polynomial by rising degree; p = 0 is the number c. */
interface Term {
	c: number;
	p: number;
	e: number[];
}

interface Build {
	case: string;
	a: number;
	lhs: Term[];
	rhs: Term[];
	problem: string;
	sol: Rational[];
	steps: string[];
	/** Wrong answers, in order of preference. */
	cands: Rational[][];
}

const BASES = [2, 3, 5];
/** The exponents n for which a^n is shown as a number. */
const N_RANGE: Record<number, [number, number]> = { 2: [-4, 6], 3: [-3, 4], 5: [-2, 3], 10: [-3, 3] };
const num = (a: number, n: number) => ratPow(q(a), n);
const numL = (a: number, n: number) => num(a, n).toLatex();
const text = (s: string) => `\\text{${s}}`;

/** A x + B = C x + D, or null when there is no single solution. */
function solveLin(A: number, B: number, C: number, D: number): Rational | null {
	return A === C ? null : q(D - B, A - C);
}

/** The distinct rational roots of x^2 + b x + c, ascending, or null. */
function roots(b: number, c: number): Rational[] | null {
	const d = b * b - 4 * c;
	const s = Math.round(Math.sqrt(Math.max(d, 0)));
	if (d <= 0 || s * s !== d) return null;
	return [q(-b - s, 2), q(-b + s, 2)];
}

const one = (r: Rational | null): Rational[][] => (r ? [[r]] : []);
const ints = (...xs: number[]) => xs.map((v) => q(v));

// ---------------------------------------------------------------------------
// Levels

/** a^x = b, with b a power of a, or b ≤ 0. */
function level1(rng: Rng): Build {
	const a = rng.pick([2, 3, 5, 10]);
	const [lo, hi] = N_RANGE[a];
	const lhs: Term[] = [{ c: 1, p: 1, e: [0, 1] }];
	const left = powLatex(q(a), 'x');
	if (rng.next() < 0.2) {
		const zero = rng.next() < 0.25;
		const n = rng.int(0, Math.min(hi, 3));
		const b = zero ? q(0) : num(a, n).neg();
		return {
			case: 'impossibile',
			a,
			lhs,
			rhs: [{ c: zero ? 0 : -1, p: 1, e: [n] }],
			problem: `${left} = ${b.toLatex()}`,
			sol: [],
			steps: [`${left} > 0 ${text(' per ogni ')} x`, text(`Una potenza con la base positiva non vale mai ${zero ? 'zero' : 'un numero negativo'}: l'equazione è impossibile.`)],
			cands: zero ? [ints(0), ints(1), ints(-1)] : [ints(-n), ints(n), [num(a, n).div(q(a)).neg()], ints(0), ints(1), ints(-1)],
		};
	}
	const n = rng.int(lo, hi);
	const b = num(a, n);
	const cands: Rational[][] =
		n < 0 ? [ints(-n), [], [q(1, n)], ints(n - 1), ints(n + 1)] : n === 0 ? [ints(1), [], [q(1, a)], ints(a), ints(-1)] : [[b.div(q(a))], ints(-n), ints(n + 1), ints(n - 1), [q(1, n)]];
	return {
		case: n < 0 ? 'esponente negativo' : n === 0 ? 'esponente zero' : 'esponente positivo',
		a,
		lhs,
		rhs: [{ c: 1, p: 1, e: [n] }],
		problem: `${left} = ${b.toLatex()}`,
		sol: ints(n),
		steps: [`${b.toLatex()} = ${numPow(q(a), n)}`, `${left} = ${numPow(q(a), n)}`, `x = ${n}`],
		cands,
	};
}

/** a^(m x + k) = a^n, the second member written as a number. */
function level2(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const [lo, hi] = N_RANGE[a];
	const m = intNot(rng, -3, 4, [0]);
	const k = rng.int(-5, 5);
	if (m === 1 && k === 0) return null;
	const n = rng.int(lo, hi);
	const x = q(n - k, m);
	if (Math.abs(x.num) > 9 || x.den > 4) return null;
	const expL = linLatex(m, k, rng.next() < 0.5);
	const left = powLatex(q(a), expL);
	return {
		case: x.isInteger() ? 'intera' : 'frazionaria',
		a,
		lhs: [{ c: 1, p: 1, e: [k, m] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		problem: `${left} = ${numL(a, n)}`,
		sol: [x],
		steps: [`${numL(a, n)} = ${numPow(q(a), n)}`, `${left} = ${numPow(q(a), n)}`, `${expL} = ${n}`, `x = ${x.toLatex()}`],
		cands: [[q(n + k, m)], ints(n), [q(k - n, m)], [x.neg()], [x.add(q(1))], [x.sub(q(1))]],
	};
}

const P_SET: Record<number, number[]> = { 2: [2, 3, -1, -2], 3: [2, 3, -1, -2], 5: [2, -1, -2] };

/** Bases that are different powers of the same number. */
function level3(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const p = rng.pick(P_SET[a]);
	const B1 = num(a, p);
	let m1: number, k1: number, m2: number, k2: number, r: number, right: string, rightExp: string, form: string;
	if (rng.next() < 0.5) {
		form = 'un numero a secondo membro';
		m1 = rng.pick([1, 1, 2, -1]);
		k1 = rng.int(-3, 3);
		const [lo, hi] = N_RANGE[a];
		r = intNot(rng, lo, hi, [0, p]);
		m2 = 0;
		k2 = 1;
		right = numL(a, r);
		rightExp = `${r}`;
	} else {
		form = 'due potenze';
		r = rng.pick(P_SET[a].filter((v) => v !== p));
		m1 = rng.pick([1, 1, 2, -1]);
		m2 = rng.pick([1, 1, 2, -1]);
		k1 = rng.int(-3, 3);
		k2 = rng.int(-3, 3);
		if (k1 === 0 && k2 === 0) return null;
		right = powLatex(num(a, r), linLatex(m2, k2));
		rightExp = linLatex(r * m2, r * k2);
	}
	// p (m1 x + k1) = r (m2 x + k2)
	const x = solveLin(p * m1, p * k1, r * m2, r * k2);
	if (!x || Math.abs(x.num) > 12 || x.den > 6) return null;
	const e1 = linLatex(m1, k1);
	const left = powLatex(B1, e1);
	const leftExp = linLatex(p * m1, p * k1);
	const steps = [`${B1.toLatex()} = ${numPow(q(a), p)}`];
	if (form === 'un numero a secondo membro') steps.push(`${right} = ${numPow(q(a), r)}`);
	else steps.push(`${num(a, r).toLatex()} = ${numPow(q(a), r)}`);
	steps.push(`${powLatex(q(a), leftExp)} = ${powLatex(q(a), rightExp)}`, `${leftExp} = ${rightExp}`, `x = ${x.toLatex()}`);
	const cands: Rational[][] = [
		// the exponent of the base multiplies only the term in x
		...one(solveLin(p * m1, k1, r * m2, form === 'due potenze' ? k2 : r * k2)),
		// the exponents as they are written, as if the bases were equal
		...one(form === 'due potenze' ? solveLin(m1, k1, m2, k2) : solveLin(m1, k1, 0, r)),
		// a fraction taken for a positive power
		...one(solveLin(Math.abs(p) * m1, Math.abs(p) * k1, Math.abs(r) * m2, Math.abs(r) * k2)),
		[x.neg()],
		[x.add(q(1))],
		[x.sub(q(1))],
	];
	return {
		case: form,
		a,
		lhs: [{ c: 1, p, e: [k1, m1] }],
		rhs: [{ c: 1, p: r, e: [k2, m2] }],
		problem: `${left} = ${right}`,
		sol: [x],
		steps,
		cands,
	};
}

/** a^(x^2 + b x + c) = a^n: two distinct integer solutions. */
function level4(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const r1 = rng.int(-5, 4);
	const r2 = rng.int(r1 + 1, 5);
	const n = rng.int(-2, 3);
	const b = -(r1 + r2);
	const c = r1 * r2 + n;
	if (b === 0 && c === 0) return null;
	if (Math.abs(c) > 20) return null;
	const expL = polyToLatex([q(c), q(b), q(1)]);
	const left = powLatex(q(a), expL);
	const eq = polyToLatex([q(c - n), q(b), q(1)]);
	const steps = [`${numL(a, n)} = ${numPow(q(a), n)}`, `${expL} = ${n}`];
	if (n !== 0) steps.push(`${eq} = 0`);
	steps.push(`x_1 = ${r1}, \\quad x_2 = ${r2}`);
	const other = (v: number) => roots(b, c - v);
	const cands: Rational[][] = [ints(-r2, -r1)];
	// the exponent set equal to the number as it is written, to zero, or to n with the wrong sign
	for (const alt of [other(0), other(-n), n === 0 ? other(1) : null]) if (alt) cands.push(alt);
	cands.push(ints(r1), ints(r2), ints(r1 + 1, r2 + 1), ints(r1 - 1, r2 - 1));
	return {
		case: n === 0 ? 'secondo membro 1' : n < 0 ? 'secondo membro frazione' : 'secondo membro intero',
		a,
		lhs: [{ c: 1, p: 1, e: [c, b, 1] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		problem: `${left} = ${numL(a, n)}`,
		sol: ints(r1, r2),
		steps,
		cands,
	};
}

/** ± body, with the sign folded in and no coefficient 1. */
function signed(c: number, body: string, first: boolean): string {
	const k = Math.abs(c) === 1 && body ? '' : `${Math.abs(c)}${body ? ' \\cdot ' : ''}`;
	if (first) return `${c < 0 ? '-' : ''}${k}${body}`;
	return ` ${c < 0 ? '-' : '+'} ${k}${body}`;
}

/** a^(x + k1) ± a^(x + k2) = N: the common power is taken out. */
function level5(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const k2 = rng.int(-2, 2);
	const k1 = rng.int(k2 + 1, 3);
	const s = rng.pick([1, 1, -1]);
	const first = rng.pick([1, 1, 1, -1]);
	const d = k1 - k2;
	const F = first * a ** d + s;
	const m = rng.int(-2, 4);
	if (m + k2 < 0) return null;
	const N = F * a ** (m + k2);
	if (Math.abs(N) > 2000) return null;
	const e1 = linLatex(1, k1);
	const e2 = linLatex(1, k2);
	const p1 = powLatex(q(a), e1);
	const p2 = powLatex(q(a), e2);
	const fL = `${first < 0 ? '-' : ''}${a ** d} ${s < 0 ? '-' : '+'} 1`;
	const steps = [`${p1} = ${a ** d} \\cdot ${p2}`, `${p2} \\left(${fL}\\right) = ${N}`, `${p2} = ${N / F}`];
	steps.push(`${N / F} = ${numPow(q(a), m + k2)}`);
	if (k2 !== 0) steps.push(`${e2} = ${m + k2}`);
	steps.push(`x = ${m}`);
	return {
		case: F < 0 ? 'fattore negativo' : 'fattore positivo',
		a,
		lhs: [
			{ c: first, p: 1, e: [k1, 1] },
			{ c: s, p: 1, e: [k2, 1] },
		],
		rhs: [{ c: N, p: 0, e: [0] }],
		problem: `${signed(first, p1, true)}${signed(s, p2, false)} = ${N}`,
		sol: ints(m),
		steps,
		cands: [...(k2 !== 0 ? [ints(m + k2)] : []), ints(m + k1), ints(m - k2 === m ? m + d : m - k2), ints(m + 1), ints(m - 1), ints(-m), ints(m + 2)],
	};
}

const M_MAX: Record<number, number> = { 2: 3, 3: 3, 5: 2 };

/** (a^2)^x + s a^x + p = 0, of second degree in t = a^x. */
function level6(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const A = a * a;
	let t1: number, t2: number, sol: Rational[], kase: string, cands: Rational[][];
	const steps: string[] = [`${A}^x = \\left(${a}^x\\right)^2`, `t = ${a}^x, \\quad t > 0`];
	if (rng.next() < 0.5) {
		const m1 = rng.int(0, M_MAX[a] - 1);
		const m2 = rng.int(m1 + 1, M_MAX[a]);
		t1 = a ** m1;
		t2 = a ** m2;
		kase = 'due soluzioni';
		sol = ints(m1, m2);
		cands = [ints(t1, t2), ints(m2), ints(m1), ints(-m2, -m1), ints(m1 + 1, m2 + 1), ints(m1, m2 + 1)];
	} else {
		const c = rng.int(1, 9);
		const m = rng.int(0, M_MAX[a]);
		t1 = -c;
		t2 = a ** m;
		if (t2 === c) return null;
		kase = 'un valore da scartare';
		sol = ints(m);
		let k = -1;
		for (let i = 0; i <= 3; i++) if (a ** i === c) k = i;
		cands = [...(k >= 0 ? [sortRat(ints(-k, m))] : []), sortRat(ints(-c, m)), ints(t1, t2), ints(-m), ints(m + 1), ints(m - 1)];
	}
	const S = t1 + t2;
	const P = t1 * t2;
	const tPoly = polyToLatex([q(P), q(-S), q(1)], 't');
	steps.push(`${tPoly} = 0`, `t_1 = ${t1}, \\quad t_2 = ${t2}`);
	if (t1 < 0) steps.push(`${a}^x = ${t1} ${text(' è impossibile.')}`);
	else steps.push(`${a}^x = ${t1} \\ \\Rightarrow \\ x = ${sol[0].toLatex()}`);
	steps.push(`${a}^x = ${t2} \\ \\Rightarrow \\ x = ${sol[sol.length - 1].toLatex()}`);
	return {
		case: kase,
		a,
		lhs: [
			{ c: 1, p: 2, e: [0, 1] },
			{ c: -S, p: 1, e: [0, 1] },
			{ c: P, p: 0, e: [0] },
		],
		rhs: [{ c: 0, p: 0, e: [0] }],
		problem: `${A}^x${signed(-S, `${a}^x`, false)}${signed(P, '', false)} = 0`,
		sol,
		steps,
		cands,
	};
}

/** a^x ± a^(c - x) = N: opposite exponents. With the minus one value of t is negative. */
function level7(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const top = a === 5 ? 2 : 3;
	const tail = (K: number, N: number, plus: boolean) => [
		`t = ${a}^x, \\quad t > 0`,
		`t ${plus ? '+' : '-'} \\frac{${K}}{t} = ${N}`,
		`${polyToLatex([q(plus ? K : -K), q(-N), q(1)], 't')} = 0`,
	];
	if (rng.next() < 0.5) {
		const m1 = rng.int(0, top - 1);
		const m2 = rng.int(m1 + 1, top);
		const c = m1 + m2;
		const t1 = a ** m1;
		const t2 = a ** m2;
		const N = t1 + t2;
		const K = a ** c;
		const p2 = powLatex(q(a), linLatex(-1, c, true));
		return {
			case: 'due soluzioni',
			a,
			lhs: [
				{ c: 1, p: 1, e: [0, 1] },
				{ c: 1, p: 1, e: [c, -1] },
			],
			rhs: [{ c: N, p: 0, e: [0] }],
			problem: `${a}^x + ${p2} = ${N}`,
			sol: ints(m1, m2),
			steps: [`${p2} = \\frac{${K}}{${a}^x}`, ...tail(K, N, true), `t_1 = ${t1}, \\quad t_2 = ${t2}`, `${a}^x = ${t1} \\ \\Rightarrow \\ x = ${m1}`, `${a}^x = ${t2} \\ \\Rightarrow \\ x = ${m2}`],
			cands: [ints(t1, t2), ints(m2), ints(-m2, -m1), ints(c), ints(m1), ints(m1 + 1, m2 + 1)],
		};
	}
	const m = rng.int(0, top);
	const c = rng.int(m, m + top);
	if (c === 2 * m) return null;
	const K = a ** c;
	const t1 = -(a ** (c - m));
	const t2 = a ** m;
	const N = t1 + t2;
	if (Math.abs(N) > 200) return null;
	const p2 = powLatex(q(a), linLatex(-1, c, true));
	return {
		case: 'un valore da scartare',
		a,
		lhs: [
			{ c: 1, p: 1, e: [0, 1] },
			{ c: -1, p: 1, e: [c, -1] },
		],
		rhs: [{ c: N, p: 0, e: [0] }],
		problem: `${a}^x - ${p2} = ${N}`,
		sol: ints(m),
		steps: [`${p2} = \\frac{${K}}{${a}^x}`, ...tail(K, N, false), `t_1 = ${t1}, \\quad t_2 = ${t2}`, `${a}^x = ${t1} ${text(' è impossibile.')}`, `${a}^x = ${t2} \\ \\Rightarrow \\ x = ${m}`],
		cands: [sortRat(ints(c - m, m)), ints(t1, t2), ints(c - m), ints(-m), ints(m + 1), ints(m - 1), ints(m + 2)],
	};
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly and check

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const sol = sortRat(b.sol);
	const seen = new Set([setKey(sol)]);
	const distractors: ChoiceOption[] = [];
	for (const c of b.cands) {
		if (distractors.length === 3) break;
		const k = setKey(c);
		if (seen.has(k) || new Set(c.map(String)).size !== c.length) continue;
		seen.add(k);
		distractors.push(setOption(c));
	}
	if (distractors.length < 3) return null;
	const answer: SetAnswer = { kind: 'set', values: sol.map(String), latex: solLatex(sol) };
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: "Risolvi l'equazione.",
		problem: b.problem,
		solution: solLatex(sol),
		steps: b.steps,
		answer,
		params: { case: b.case, a: b.a, lhs: b.lhs, rhs: b.rhs, distractors },
	};
}

function evalPoly(e: number[], x: Rational): Rational {
	let out = q(0);
	let pw = q(1);
	for (const c of e) {
		out = out.add(q(c).mul(pw));
		pw = pw.mul(x);
	}
	return out;
}

/** The value of a side at an integer-exponent point, or null when an exponent is not an integer. */
function sideValue(a: number, ts: Term[], x: Rational): Rational | null {
	let out = q(0);
	for (const t of ts) {
		const e = evalPoly(t.e, x).mul(q(t.p));
		if (!e.isInteger()) return null;
		out = out.add(q(t.c).mul(ratPow(q(a), e.num)));
	}
	return out;
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { case: string; a: number; lhs: Term[]; rhs: Term[]; distractors: ChoiceOption[] };
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	if (s.answer.kind !== 'set') return ['la risposta deve essere un insieme'];
	const sol = s.answer.values.map((v) => Rational.parse(v));
	if (setKey(sol) !== s.answer.values.join('|')) errs.push('soluzioni non ordinate');
	const single = p.lhs.length === 1 && p.rhs.length === 1 && p.lhs[0].c === 1 && p.rhs[0].c === 1 && p.rhs[0].p !== 0;
	for (const x of sol) {
		if (single) {
			// one power on each side: the exponents must be equal
			const l = evalPoly(p.lhs[0].e, x).mul(q(p.lhs[0].p));
			const r = evalPoly(p.rhs[0].e, x).mul(q(p.rhs[0].p));
			if (!l.equals(r)) errs.push(`${x} non è una soluzione`);
		} else {
			const l = sideValue(p.a, p.lhs, x);
			const r = sideValue(p.a, p.rhs, x);
			if (!l || !r || !l.equals(r)) errs.push(`${x} non è una soluzione`);
		}
	}
	const want: Record<number, number[]> = { 1: [0, 1], 2: [1], 3: [1], 4: [2], 5: [1], 6: [1, 2], 7: [1, 2] };
	if (!want[s.level].includes(sol.length)) errs.push(`livello ${s.level}: ${sol.length} soluzioni`);
	if (s.level === 1 && (sol.length === 0) !== (p.case === 'impossibile')) errs.push('livello 1: caso e soluzioni non corrispondono');
	if (s.level >= 4 && sol.some((x) => !x.isInteger())) errs.push('livelli 4-7: soluzioni intere');
	if (p.distractors.length !== 3) errs.push('servono tre distrattori');
	const keys = [s.answer.values.join('|'), ...p.distractors.map((d) => d.values.join('|'))];
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const equazioniEsponenziali: Generator = {
	id: ID,
	title: 'Equazioni esponenziali',
	levels: {
		1: { label: 'Equazione elementare', constraints: ['a^x = b con b potenza di a a esponente intero, oppure b ≤ 0 (impossibile)'] },
		2: { label: 'Stessa base, esponente di primo grado', constraints: ['a^(mx + k) = a^n scritto come numero', 'soluzione razionale con denominatore fino a 4'] },
		3: { label: 'Basi potenze dello stesso numero', constraints: ['(a^p)^(m1 x + k1) = a^r oppure = (a^r)^(m2 x + k2)', 'p e r tra 2, 3, -1, -2'] },
		4: { label: 'Esponente di secondo grado', constraints: ['a^(x^2 + bx + c) = a^n', 'due soluzioni intere distinte'] },
		5: { label: 'Raccoglimento', constraints: ['± a^(x + k1) ± a^(x + k2) = N', 'soluzione intera'] },
		6: { label: 'Sostituzione', constraints: ['(a^2)^x + s a^x + p = 0', 'due valori accettabili di t, oppure uno negativo da scartare'] },
		7: { label: 'Esponenti opposti', constraints: ['a^x + a^(c - x) = N con due soluzioni intere, oppure a^x - a^(c - x) = N con una'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		if (sample.answer.kind !== 'set') throw new Error(`${ID}: unexpected answer`);
		const ds = (sample.params as { distractors: ChoiceOption[] }).distractors;
		const all: ChoiceOption[] = [{ latex: sample.answer.latex, values: sample.answer.values }, ...ds];
		const order = shuffled(
			rng,
			all.map((_, i) => i),
		);
		return { kind: 'choice', options: order.map((i) => all[i]), correct: order.indexOf(0) };
	},
};

export default equazioniEsponenziali;
