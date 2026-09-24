/**
 * Equazioni di primo grado intere. Spec: specs/exercises/equazioni-primo-grado.md
 *
 * Six levels in the order of the lesson, each adding one difficulty: ax + b = c, the unknown on
 * both sides, parentheses, a fractional solution, numeric denominators, impossible and
 * indeterminate equations; a seventh level of word problems that lead to such an equation. Built backwards: the solution is chosen first and one constant is
 * computed so that it holds. Each side is a list of terms k·(a·x + b)/d.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { numberChoice, textBlock } from '../insiemi';

export const ID = 'equazioni-primo-grado';
const MAX_COEF = 60;

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'fattore 1 davanti a una parentesi', re: /(?<![\d.])1\(/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
];

/** k·(a·x + b)/d. A term with k = 1 and d = 1 is a single monomial: a = 0 or b = 0. */
export interface Term {
	k: number;
	a: number;
	b: number;
	d: number;
}
type Case = 'determinata' | 'impossibile' | 'indeterminata';

const T = (k: number, a: number, b: number, d = 1): Term => ({ k, a, b, d });
const X = (a: number): Term => T(1, a, 0);
const C = (b: number): Term => T(1, 0, b);

// ---------------------------------------------------------------------------
// Algebra

/** A side as a·x + b, exactly. */
function linearOf(side: Term[]): { a: Rational; b: Rational } {
	let a = q(0), b = q(0);
	for (const t of side) {
		a = a.add(q(t.k * t.a, t.d));
		b = b.add(q(t.k * t.b, t.d));
	}
	return { a, b };
}

function evaluate(side: Term[], x: Rational): Rational {
	const { a, b } = linearOf(side);
	return a.mul(x).add(b);
}

interface Solved {
	case: Case;
	solution: Rational | null;
}

function solve(lhs: Term[], rhs: Term[]): Solved {
	const l = linearOf(lhs), r = linearOf(rhs);
	const A = l.a.sub(r.a), B = r.b.sub(l.b);
	if (!A.isZero()) return { case: 'determinata', solution: B.div(A) };
	return { case: B.isZero() ? 'indeterminata' : 'impossibile', solution: null };
}

// ---------------------------------------------------------------------------
// LaTeX

const inner = (t: Term) => polyToLatex(poly(t.b, t.a));

function termBody(t: Term): { sign: 1 | -1; body: string } {
	if (t.d !== 1 && t.a === 0) return { sign: t.k * t.b < 0 ? -1 : 1, body: `\\frac{${Math.abs(t.b)}}{${t.d}}` };
	if (t.d !== 1) return { sign: t.k < 0 ? -1 : 1, body: `\\frac{${inner(t)}}{${t.d}}` };
	if (t.k !== 1) return { sign: t.k < 0 ? -1 : 1, body: `${Math.abs(t.k) === 1 ? '' : Math.abs(t.k)}(${inner(t)})` };
	// After multiplying by the lcm a fraction can end up with factor 1: keep its parentheses.
	if (t.a !== 0 && t.b !== 0) return { sign: 1, body: `(${inner(t)})` };
	const c = t.a !== 0 ? t.a : t.b;
	const abs = Math.abs(c);
	const body = t.a !== 0 ? `${abs === 1 ? '' : abs}x` : `${abs}`;
	return { sign: c < 0 ? -1 : 1, body };
}

export function sideLatex(side: Term[]): string {
	if (side.length === 0) return '0';
	return side
		.map((t, i) => {
			const { sign, body } = termBody(t);
			if (i === 0) return (sign < 0 ? '-' : '') + body;
			return (sign < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}

/** A sequence of monomials, not reduced: [{c, x}] → "3x - 6 - 4x - 2". */
function monoSeq(items: { c: Rational; x: boolean }[]): string {
	const nz = items.filter((m) => !m.c.isZero());
	if (nz.length === 0) return '0';
	return nz
		.map((m, i) => {
			const abs = m.c.abs();
			const body = m.x ? (abs.isOne() ? 'x' : `${abs.toLatex()}x`) : abs.toLatex();
			if (i === 0) return (m.c.sign() < 0 ? '-' : '') + body;
			return (m.c.sign() < 0 ? ' - ' : ' + ') + body;
		})
		.join('');
}

const expanded = (side: Term[], mult = 1) =>
	side.flatMap((t) => [
		{ c: q(t.k * t.a * mult, t.d), x: true },
		{ c: q(t.k * t.b * mult, t.d), x: false },
	]);

// ---------------------------------------------------------------------------
// Construction

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

const shuffle2 = <U>(rng: Rng, xs: U[]): U[] => (rng.int(0, 1) ? [...xs].reverse() : xs);

interface Built {
	lhs: Term[];
	rhs: Term[];
	case: Case;
	solution: Rational | null;
}

/** Appends to `side` the constant that makes lhs = rhs hold at x = s. */
function closeWithConstant(lhs: Term[], rhs: Term[], s: Rational, onRight = true): Rational {
	const need = evaluate(lhs, s).sub(evaluate(rhs, s));
	return onRight ? need : need.neg();
}

function build(rng: Rng, level: number): Built | null {
	const intSol = () => q(rng.int(-12, 12));
	switch (level) {
		case 1: {
			const s = intSol();
			const lhs = shuffle2(rng, [X(nonZero(rng, -9, 9, [1])), C(nonZero(rng, -30, 30))]);
			const c = closeWithConstant(lhs, [], s);
			return { lhs, rhs: c.isZero() ? [] : [C(c.num)], case: 'determinata', solution: s };
		}
		case 2:
		case 4: {
			const s = level === 2 ? intSol() : q(nonZero(rng, -30, 30), rng.int(2, 9));
			if (level === 4 && s.isInteger()) return null;
			const A = level === 2 ? nonZero(rng, -6, 6) : s.den * nonZero(rng, -2, 2);
			if (level === 4 && rng.next() < 0.4) {
				// k(a1 x + b1) = c x + d
				const k = nonZero(rng, -4, 4, [1]);
				const a1 = rng.int(1, 3);
				const c = k * a1 - A;
				if (c === 0) return null;
				const lhs = [T(k, a1, nonZero(rng, -9, 9))];
				const rhs = [X(c)];
				const d = closeWithConstant(lhs, rhs, s);
				if (!d.isInteger()) return null;
				if (!d.isZero()) rhs.push(C(d.num));
				return { lhs, rhs: shuffle2(rng, rhs), case: 'determinata', solution: s };
			}
			const c = nonZero(rng, -9, 9);
			const a = c + A;
			if (a === 0) return null;
			const lhs = shuffle2(rng, [X(a), C(nonZero(rng, -20, 20))]);
			const rhs: Term[] = [X(c)];
			const d = closeWithConstant(lhs, rhs, s);
			if (!d.isInteger()) return null;
			if (!d.isZero()) rhs.push(C(d.num));
			return { lhs, rhs: shuffle2(rng, rhs), case: 'determinata', solution: s };
		}
		case 3: {
			const s = intSol();
			const variant = rng.int(1, 3);
			let lhs: Term[], rhs: Term[];
			if (variant === 1) {
				// k(ax + b) + e = cx + f
				lhs = [T(nonZero(rng, -5, 5, [1]), rng.int(1, 3), nonZero(rng, -9, 9))];
				if (rng.int(0, 1)) lhs.push(C(nonZero(rng, -9, 9)));
				rhs = [X(nonZero(rng, -9, 9))];
			} else if (variant === 2) {
				// k1(a1 x + b1) + k2(a2 x + b2) = cx + f
				lhs = [T(nonZero(rng, -5, 5, [1]), rng.int(1, 3), nonZero(rng, -9, 9)), T(nonZero(rng, -5, 5, [1]), rng.int(1, 3), nonZero(rng, -9, 9))];
				rhs = [X(nonZero(rng, -9, 9))];
			} else {
				// k1(a1 x + b1) = k2(a2 x + b2) + f
				lhs = [T(nonZero(rng, -5, 5, [1]), rng.int(1, 3), nonZero(rng, -9, 9))];
				rhs = [T(nonZero(rng, -5, 5, [1]), rng.int(1, 3), nonZero(rng, -9, 9))];
			}
			const f = closeWithConstant(lhs, rhs, s);
			if (!f.isZero()) rhs.push(C(f.num));
			return { lhs, rhs, case: 'determinata', solution: s };
		}
		case 5: {
			const s = rng.next() < 0.6 ? q(rng.int(-9, 9)) : q(nonZero(rng, -9, 9), rng.pick([2, 3, 4, 5]));
			const den = () => rng.int(2, 6);
			const frac = (sign: 1 | -1, d: number) => T(sign, rng.int(1, 4), nonZero(rng, -9, 9), d);
			const d1 = den(), d2 = den(), d3 = den();
			if (new Set([d1, d2, d3]).size < 2) return null;
			const lhs = [frac(1, d1), frac(rng.int(0, 1) ? 1 : -1, d2)];
			// Right side: k3·(a3·x + b3)/d3 with or without x; b3 is computed, k3 = ±1 carries the sign.
			const a3 = rng.next() < 0.5 ? 0 : rng.int(1, 4);
			let k3: 1 | -1 = rng.int(0, 1) ? 1 : -1;
			let b3 = evaluate(lhs, s).mul(q(k3 * d3)).sub(q(a3).mul(s));
			if (!b3.isInteger() || b3.isZero() || Math.abs(b3.num) > 30) return null;
			if (a3 === 0 && b3.sign() < 0) {
				k3 = k3 === 1 ? -1 : 1;
				b3 = b3.neg();
			}
			const rhs = [T(k3, a3, b3.num, d3)];
			return { lhs, rhs, case: 'determinata', solution: s };
		}
		case 6: {
			const u = rng.next();
			if (u < 0.2) {
				const b = build(rng, 3);
				return b;
			}
			const k = nonZero(rng, -5, 5, [1]);
			const a = rng.int(1, 3);
			const lhs: Term[] = [T(k, a, nonZero(rng, -9, 9))];
			if (rng.int(0, 1)) lhs.push(C(nonZero(rng, -9, 9)));
			const rhs: Term[] = [X(k * a)];
			const { b: lb } = linearOf(lhs);
			const f = u < 0.6 ? lb.add(q(nonZero(rng, -5, 5))) : lb;
			if (!f.isZero()) rhs.push(C(f.num));
			const solved = solve(lhs, rhs);
			return { lhs, rhs: shuffle2(rng, rhs), case: solved.case, solution: solved.solution };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Steps

function steps(lhs: Term[], rhs: Term[], solved: Solved): string[] {
	const out: string[] = [];
	const dens = [...lhs, ...rhs].map((t) => t.d);
	const m = dens.reduce((acc, d) => lcm(acc, d), 1);
	let L = lhs, R = rhs;
	if (m > 1) {
		const clear = (t: Term) => (t.a === 0 ? C(t.k * (m / t.d) * t.b) : T(t.k * (m / t.d), t.a, t.b));
		L = lhs.map(clear);
		R = rhs.map(clear);
		out.push(`\\text{Moltiplica tutti i termini per il mcm dei denominatori, } ${m}\\text{: } ${sideLatex(L)} = ${sideLatex(R)}`);
	}
	if ([...L, ...R].some((t) => t.k !== 1 || (t.a !== 0 && t.b !== 0))) {
		out.push(`\\text{Togli le parentesi: } ${monoSeq(expanded(L))} = ${monoSeq(expanded(R))}`);
	}
	const lx = expanded(L).filter((e) => e.x), lc = expanded(L).filter((e) => !e.x);
	const rx = expanded(R).filter((e) => e.x), rc = expanded(R).filter((e) => !e.x);
	const moveX = [...lx, ...rx.map((e) => ({ c: e.c.neg(), x: true }))];
	const moveC = [...rc, ...lc.map((e) => ({ c: e.c.neg(), x: false }))];
	out.push(`\\text{Porta i termini con la } x \\text{ a primo membro e i numeri a secondo membro: } ${monoSeq(moveX)} = ${monoSeq(moveC)}`);
	const A = moveX.reduce((s, e) => s.add(e.c), q(0));
	const B = moveC.reduce((s, e) => s.add(e.c), q(0));
	const axLatex = A.isZero() ? '0x' : A.isOne() ? 'x' : A.equals(q(-1)) ? '-x' : `${A.toLatex()}x`;
	out.push(`\\text{Riduci i termini simili: } ${axLatex} = ${B.toLatex()}`);
	if (solved.case === 'determinata') {
		if (!A.isOne()) out.push(`\\text{Dividi entrambi i membri per } ${A.sign() < 0 ? `(${A.toLatex()})` : A.toLatex()}\\text{: } x = ${solved.solution!.toLatex()}`);
	} else if (solved.case === 'impossibile') {
		out.push(`\\text{Nessun numero moltiplicato per } 0 \\text{ dà } ${B.toLatex()}\\text{: l'equazione è impossibile}`);
	} else {
		out.push(`\\text{Ogni numero moltiplicato per } 0 \\text{ dà } 0\\text{: l'equazione è indeterminata}`);
	}
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

const termStr = (t: Term) => ({ k: String(t.k), a: String(t.a), b: String(t.b), d: String(t.d) });
function parseTerms(x: unknown): Term[] | null {
	if (!Array.isArray(x)) return null;
	try {
		return x.map((t) => T(Number(t.k), Number(t.a), Number(t.b), Number(t.d)));
	} catch {
		return null;
	}
}

function answerOf(solved: Solved): SetAnswer {
	if (solved.case === 'determinata') return { kind: 'set', values: [solved.solution!.toString()], latex: `S = \\left\\{ ${solved.solution!.toLatex()} \\right\\}` };
	if (solved.case === 'impossibile') return { kind: 'set', values: [], latex: 'S = \\emptyset' };
	return { kind: 'set', values: [], universal: true, latex: 'S = \\mathbb{R}' };
}

function assemble(b: Built, level: number, seed: number): Sample {
	const solved = solve(b.lhs, b.rhs);
	if (solved.case !== b.case || (b.solution && !solved.solution?.equals(b.solution))) {
		throw new Error(`${ID}: internal mismatch at level ${level}`);
	}
	const solution =
		solved.case === 'determinata' ? `x = ${solved.solution!.toLatex()}` : solved.case === 'impossibile' ? '\\text{Equazione impossibile: } S = \\emptyset' : '\\text{Equazione indeterminata: } S = \\mathbb{R}';
	return {
		generatorId: ID,
		level,
		seed,
		prompt: "Risolvi l'equazione.",
		problem: `${sideLatex(b.lhs)} = ${sideLatex(b.rhs)}`,
		solution,
		steps: steps(b.lhs, b.rhs, solved),
		answer: answerOf(solved),
		params: {
			lhs: b.lhs.map(termStr),
			rhs: b.rhs.map(termStr),
			case: solved.case,
			solution: solved.case === 'determinata' ? solved.solution!.toString() : solved.case,
		},
	};
}

function check(sample: Sample): string[] {
	if (sample.level === 7) return checkProblem(sample);
	const v: string[] = [];
	const lhs = parseTerms(sample.params.lhs), rhs = parseTerms(sample.params.rhs);
	if (!lhs || !rhs) return ['params.lhs/params.rhs non validi'];
	for (const t of [...lhs, ...rhs]) {
		if (![t.k, t.a, t.b, t.d].every(Number.isInteger) || t.d < 1) v.push('termine con valori non interi');
		if (Math.abs(t.k * t.a) > MAX_COEF || Math.abs(t.k * t.b) > MAX_COEF) v.push('coefficiente troppo grande');
		if (t.k === 1 && t.d === 1 && t.a !== 0 && t.b !== 0) v.push('termine piatto con due monomi');
		if (t.a === 0 && t.b === 0) v.push('termine nullo');
		if (t.d > 1 && gcd(gcd(t.a, t.b), t.d) > 1) v.push('frazione non ridotta');
	}
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	const solved = solve(lhs, rhs);
	const expected = answerOf(solved);
	const ans = sample.answer;
	if (ans.kind !== 'set' || ans.values.join(',') !== expected.values.join(',') || !!ans.universal !== !!expected.universal) v.push('risposta diversa dalla soluzione');
	const hasX = (s: Term[]) => s.some((t) => t.a !== 0);
	const hasParen = [...lhs, ...rhs].some((t) => t.k !== 1 && t.d === 1);
	const dens = new Set([...lhs, ...rhs].map((t) => t.d).filter((d) => d > 1));
	const s = solved.solution;
	const intIn = (r: Rational | null) => !!r && r.isInteger() && Math.abs(r.num) <= 12;
	switch (sample.level) {
		case 1:
			if (hasX(rhs) || lhs.filter((t) => t.a !== 0).length !== 1 || hasParen || dens.size) v.push('forma diversa da ax + b = c');
			if (!intIn(s)) v.push('soluzione non intera o fuori intervallo');
			break;
		case 2:
			if (!hasX(lhs) || !hasX(rhs) || hasParen || dens.size) v.push('serve la x in entrambi i membri, senza parentesi');
			if (!intIn(s)) v.push('soluzione non intera o fuori intervallo');
			break;
		case 3:
			if (!hasParen || dens.size) v.push('servono parentesi, senza denominatori');
			if (!intIn(s)) v.push('soluzione non intera o fuori intervallo');
			break;
		case 4:
			if (dens.size) v.push('niente denominatori al livello 4');
			if (!s || s.isInteger() || s.den > 9 || Math.abs(s.num) > 30) v.push('serve una soluzione frazionaria p/q con q ≤ 9');
			break;
		case 5:
			if (dens.size < 2 || [...dens].some((d) => d > 6)) v.push('servono almeno due denominatori diversi, fino a 6');
			if (solved.case !== 'determinata') v.push('deve essere determinata');
			break;
		case 6:
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.level <= 5 && solved.case !== 'determinata') v.push('deve essere determinata');
	return v;
}

const optLatex = (o: { values: string[]; universal?: boolean }) =>
	o.universal ? '\\text{Ogni numero reale}' : o.values.length === 0 ? '\\text{Nessuna soluzione}' : `x = ${Rational.parse(o.values[0]).toLatex()}`;

export function toChoice(sample: Sample, rng: Rng, count = 4): ChoiceAnswer {
	if (sample.level === 7) return problemChoice(sample, rng);
	const lhs = parseTerms(sample.params.lhs)!, rhs = parseTerms(sample.params.rhs)!;
	const solved = solve(lhs, rhs);
	const m = [...lhs, ...rhs].map((t) => t.d).reduce((acc, d) => lcm(acc, d), 1);
	const scale = (s: Term[]) => s.map((t) => T(t.k * (m / t.d), t.a, t.b));
	const L = linearOf(scale(lhs)), R = linearOf(scale(rhs));
	type Opt = { values: string[]; universal?: boolean };
	const key = (o: Opt) => (o.universal ? 'R' : o.values.join(','));
	const correct: Opt = solved.case === 'determinata' ? { values: [solved.solution!.toString()] } : solved.case === 'impossibile' ? { values: [] } : { values: [], universal: true };
	const num = (r: Rational | null): Opt | null => (r && r.den <= 20 && Math.abs(r.num) <= 200 ? { values: [r.toString()] } : null);
	const div = (a: Rational, b: Rational) => (b.isZero() ? null : a.div(b));
	const cands: (Opt | null)[] = [];
	const A = L.a.sub(R.a), B = R.b.sub(L.b);
	if (solved.case === 'determinata') {
		const s = solved.solution!;
		cands.push(num(s.neg()));
		cands.push(num(div(R.b.add(L.b), A))); // transport without changing sign
		cands.push(num(div(A, B))); // division the wrong way round
		// minus in front of a parenthesis applied to the first term only
		const wrong = (side: Term[]) => linearOf(scale(side).flatMap((t) => (t.k < 0 && t.d === 1 && t.b !== 0 ? [T(t.k, t.a, 0), T(1, 0, t.b)] : [t])));
		const wl = wrong(lhs), wr = wrong(rhs);
		cands.push(num(div(wr.b.sub(wl.b), wl.a.sub(wr.a))));
		cands.push({ values: [] }, { values: [], universal: true });
	} else {
		cands.push(solved.case === 'impossibile' ? { values: [], universal: true } : { values: [] });
		cands.push({ values: ['0'] });
		if (!B.isZero()) cands.push(num(B));
	}
	const seen = new Set([key(correct)]);
	const options: Opt[] = [correct];
	const add = (o: Opt | null) => {
		if (o && options.length < count && !seen.has(key(o))) {
			seen.add(key(o));
			options.push(o);
		}
	};
	cands.forEach(add);
	const base = solved.solution ?? q(1);
	for (let d = 1; options.length < count && d < 50; d++) {
		add(num(base.add(q(d))));
		add(num(base.sub(q(d))));
	}
	const order = options.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	const shuffled: ChoiceOption[] = order.map((i) => ({ latex: optLatex(options[i]), values: options[i].universal ? ['R'] : options[i].values }));
	return { kind: 'choice', options: shuffled, correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Level 7: word problems, solved as in the lesson: choose the unknown, translate the text into
// an equation, solve it, check it against the text, answer the question. Every story is built
// backwards from the value of x; params hold the data of the story and nothing derived from it,
// so the checker can redo the count on its own.

const NAMES_F = ['Giulia', 'Sara', 'Chiara', 'Marta', 'Anna', 'Elena', 'Sofia', 'Laura', 'Francesca', 'Alice', 'Beatrice', 'Irene'];
const NAMES_M = ['Luca', 'Marco', 'Paolo', 'Pietro', 'Davide', 'Matteo', 'Tommaso', 'Giorgio', 'Lorenzo', 'Filippo', 'Riccardo', 'Nicola'];
const NUM_WORD: Record<number, string> = { 2: 'due', 3: 'tre' };
const TIMES_WORD: Record<number, string> = { 2: 'doppio', 3: 'triplo', 4: 'quadruplo' };

export const STORIES = ['consecutivi', 'eta', 'divisione', 'rettangolo', 'biglietti', 'monete', 'spesa', 'risparmi', 'tariffe'] as const;
type Story = (typeof STORIES)[number];

/** Euros from cents, as LaTeX: 37 or 37{,}50. */
export function euroLatex(cents: number): string {
	const e = Math.floor(cents / 100), c = cents % 100;
	return c === 0 ? String(e) : `${e}{,}${String(c).padStart(2, '0')}`;
}
/** Euros from cents inside prose: plain when whole, as $…$ when it has a decimal comma. */
const euroProse = (cents: number) => (cents % 100 === 0 ? String(cents / 100) : `$${euroLatex(cents)}$`);

/** k·x as LaTeX: "x" for k = 1, never "1x". */
const kx = (k: number) => (k === 1 ? 'x' : `${k}x`);

interface Problem {
	story: Story;
	data: Record<string, string | number>;
	prose: string;
	/** Step that says what x is, and an optional remark after it. */
	unknown: string;
	pre?: string;
	/** The translation of the text, then (optionally) the same without parentheses. */
	equation: string;
	expanded?: string;
	/** Normal form a·x = b reached by the solution. */
	a: number;
	b: number;
	x: number;
	answer: number;
	/** Step from x to the answer, when the question does not ask for x itself. */
	toAnswer?: string;
	check: string;
	solution: string;
	/** Numbers written in the text: the answer must not be one of them. */
	given: number[];
	/** Wrong answers from real mistakes, in order of preference. */
	mistakes: number[];
}

const t = (s: string) => `\\text{${s}}`;
const intDiv = (n: number, d: number) => (d !== 0 && n % d === 0 ? n / d : NaN);

function consecutivi(rng: Rng): Problem {
	const n = rng.pick([2, 3]);
	const x = rng.int(n === 2 ? 12 : 8, 99);
	const shift = (n * (n - 1)) / 2;
	const S = n * x + shift;
	const asked = rng.pick(['piccolo', 'grande']);
	const answer = asked === 'piccolo' ? x : x + n - 1;
	const others = n === 2 ? `${t("l'altro è ")} x + 1` : `${t('gli altri sono ')} x + 1 \\text{ e } x + 2`;
	return {
		story: 'consecutivi',
		data: { n, S, asked },
		prose: `La somma di ${NUM_WORD[n]} numeri naturali consecutivi è ${S}. Qual è il più ${asked} dei ${NUM_WORD[n]} numeri?`,
		unknown: `${t('Chiama ')} x ${t(' il numero più piccolo: ')} ${others}`,
		equation: n === 2 ? `x + (x + 1) = ${S}` : `x + (x + 1) + (x + 2) = ${S}`,
		expanded: n === 2 ? `x + x + 1 = ${S}` : `x + x + 1 + x + 2 = ${S}`,
		a: n,
		b: S - shift,
		x,
		answer,
		toAnswer: asked === 'grande' ? `${t('Il più grande è ')} x + ${n - 1} = ${answer}` : undefined,
		check: Array.from({ length: n }, (_, i) => x + i).join(' + ') + ` = ${S}`,
		solution: `${t(`Il numero più ${asked} è `)} ${answer}`,
		given: [S],
		mistakes: [asked === 'piccolo' ? x + n - 1 : x, n === 3 ? x + 1 : NaN, intDiv(S + shift, n), S - shift],
	};
}

function eta(rng: Rng): Problem {
	for (;;) {
		const k = rng.pick([2, 3, 4]);
		const c = rng.int(2, 14), n = rng.int(1, 12);
		const p = k * (c + n) - n;
		if (p - c < 20 || p - c > 45 || p > 65) continue;
		const parentF = rng.int(0, 1) === 1, childF = rng.int(0, 1) === 1;
		const P = rng.pick(parentF ? NAMES_F : NAMES_M);
		const C = rng.pick(childF ? NAMES_F : NAMES_M);
		if (P === C) continue;
		const rel = childF ? 'sua figlia' : 'suo figlio';
		return {
			story: 'eta',
			data: { k, parent: p, child: c, P, C },
			prose: `Oggi ${P} ha ${p} anni e ${rel} ${C} ne ha ${c}. Tra quanti anni ${P} avrà il ${TIMES_WORD[k]} degli anni di ${C}?`,
			unknown: `${t('Chiama ')} x ${t(` il numero di anni che passano: allora ${P} avrà `)} ${p} + x ${t(` anni e ${C} `)} ${c} + x`,
			equation: `${p} + x = ${k}(${c} + x)`,
			expanded: `${p} + x = ${k * c} + ${k}x`,
			a: 1 - k,
			b: k * c - p,
			x: n,
			answer: n,
			check: `${t(`tra ${n} anni ${P} avrà `)} ${p + n} ${t(` anni e ${C} `)} ${c + n}\\text{, e } ${k} \\cdot ${c + n} = ${k * (c + n)}`,
			solution: `${t(`Tra ${n} ann${n === 1 ? 'o' : 'i'}`)}`,
			given: [p, c],
			// the parent does not age; the child does not age; the sign lost in the transport; a different question
			mistakes: [intDiv(p - k * c, k), k * c - p, intDiv(p + k * c, k - 1), c + n, p + n],
		};
	}
}

interface ShareCtx {
	two: (A: string, B: string, T: number, d: number) => string;
	three: (A: string, B: string, C: string, T: number, d: number) => string;
	question: (Q: string) => string;
	of: string;
	ofOther: string;
	unit: string;
	maxEach: number;
}
const SHARE_CTX: ShareCtx[] = [
	{
		two: (A, B, T, d) => `${A} e ${B} hanno in tutto ${T} figurine, e ${B} ne ha ${d} più di ${A}.`,
		three: (A, B, C, T, d) => `${A}, ${B} e ${C} hanno in tutto ${T} figurine: ${B} ne ha ${d} più di ${A} e ${C} ne ha il doppio di ${A}.`,
		question: (Q) => `Quante figurine ha ${Q}?`,
		of: 'le figurine di',
		ofOther: 'quelle di',
		unit: 'figurine',
		maxEach: 150,
	},
	{
		two: (A, B, T, d) => `In una partita di basket ${A} e ${B} hanno segnato in tutto ${T} punti, e ${B} ne ha segnati ${d} più di ${A}.`,
		three: (A, B, C, T, d) => `In una partita di basket ${A}, ${B} e ${C} hanno segnato in tutto ${T} punti: ${B} ne ha segnati ${d} più di ${A} e ${C} il doppio di ${A}.`,
		question: (Q) => `Quanti punti ha segnato ${Q}?`,
		of: 'i punti di',
		ofOther: 'quelli di',
		unit: 'punti',
		maxEach: 35,
	},
	{
		two: (A, B, T, d) => `${A} e ${B} si dividono un premio di ${T} euro, e ${B} riceve ${d} euro più di ${A}.`,
		three: (A, B, C, T, d) => `${A}, ${B} e ${C} si dividono un premio di ${T} euro: ${B} riceve ${d} euro più di ${A} e ${C} il doppio di ${A}.`,
		question: (Q) => `Quanti euro riceve ${Q}?`,
		of: 'gli euro di',
		ofOther: 'quelli di',
		unit: 'euro',
		maxEach: 400,
	},
];

/** k different names; with `sameGender` all from one list (players of one basketball team). */
function distinctNames(rng: Rng, k: number, sameGender = false): string[] {
	const out: string[] = [];
	const list = rng.int(0, 1) ? NAMES_F : NAMES_M;
	while (out.length < k) {
		const n = rng.pick(sameGender ? list : rng.int(0, 1) ? NAMES_F : NAMES_M);
		if (!out.includes(n)) out.push(n);
	}
	return out;
}

function divisione(rng: Rng): Problem {
	const ci = rng.int(0, SHARE_CTX.length - 1);
	const ctx = SHARE_CTX[ci];
	const people = rng.pick([2, 3]);
	for (;;) {
		const x = rng.int(4, 60), d = rng.int(2, 30);
		const shares = people === 2 ? [x, x + d] : [x, x + d, 2 * x];
		if (Math.max(...shares) > ctx.maxEach || new Set(shares).size < people) continue;
		const T = shares.reduce((s, v) => s + v, 0);
		const names = distinctNames(rng, people, ctx.unit === 'punti');
		const qi = rng.int(0, people - 1);
		const answer = shares[qi];
		const [A, B, C] = names;
		const prose = (people === 2 ? ctx.two(A, B, T, d) : ctx.three(A, B, C, T, d)) + ' ' + ctx.question(names[qi]);
		const a = people === 2 ? 2 : 4;
		const toAnswer = qi === 0 ? undefined : qi === 1 ? `${t(`${B}: `)} x + ${d} = ${x} + ${d} = ${answer}` : `${t(`${C}: `)} 2x = 2 \\cdot ${x} = ${answer}`;
		const others = shares.filter((_, i) => i !== qi);
		return {
			story: 'divisione',
			data: { context: ci, people, T, d, asked: qi, names: names.join(',') },
			prose,
			unknown: `${t(`Chiama `)} x ${t(` ${ctx.of} ${A}: ${ctx.ofOther} ${B} sono `)} x + ${d}${people === 3 ? ` ${t(` e ${ctx.ofOther} ${C} sono `)} 2x` : ''}`,
			equation: people === 2 ? `x + (x + ${d}) = ${T}` : `x + (x + ${d}) + 2x = ${T}`,
			expanded: people === 2 ? `x + x + ${d} = ${T}` : `x + x + ${d} + 2x = ${T}`,
			a,
			b: T - d,
			x,
			answer,
			toAnswer,
			check: `${shares.join(' + ')} = ${T}`,
			solution: `${t(`${names[qi]}: ${answer} ${ctx.unit}`)}`,
			given: [T, d],
			// another person's share; equal shares; sign lost in the transport; 2x counted once
			mistakes: [...others, intDiv(T, people), intDiv(T + d, a), people === 3 ? intDiv(T - d, 3) : NaN],
		};
	}
}

interface RectCtx {
	intro: (P: number) => string;
	unit: string;
	short: [number, number];
	maxLong: number;
}
const RECT_CTX: RectCtx[] = [
	{ intro: (P) => `Il nonno ha recintato un orto rettangolare con ${P} m di rete.`, unit: 'm', short: [3, 20], maxLong: 40 },
	{ intro: (P) => `Una cornice rettangolare ha il perimetro di ${P} cm.`, unit: 'cm', short: [10, 40], maxLong: 90 },
	{ intro: (P) => `Il perimetro di un campo da calcetto rettangolare è di ${P} m.`, unit: 'm', short: [15, 25], maxLong: 45 },
];

function rettangolo(rng: Rng): Problem {
	const ci = rng.int(0, RECT_CTX.length - 1);
	const ctx = RECT_CTX[ci];
	const rel = rng.pick(['piu', 'volte']);
	for (;;) {
		const s = rng.int(ctx.short[0], ctx.short[1]);
		const k = rng.pick([2, 3]), d = rng.int(2, 20);
		const long = rel === 'piu' ? s + d : k * s;
		if (long > ctx.maxLong) continue;
		const P = 2 * (s + long);
		const asked = rng.pick(['corto', 'lungo']);
		const answer = asked === 'corto' ? s : long;
		const u = ctx.unit;
		const relText = rel === 'piu' ? `Il lato lungo supera il lato corto di ${d} ${u}.` : `Il lato lungo è il ${TIMES_WORD[k]} del lato corto.`;
		const longX = rel === 'piu' ? `x + ${d}` : `${k}x`;
		return {
			story: 'rettangolo',
			data: rel === 'piu' ? { context: ci, P, rel, d, asked } : { context: ci, P, rel, k, asked },
			prose: `${ctx.intro(P)} ${relText} Quanto misura il lato ${asked}?`,
			unknown: `${t(`Chiama `)} x ${t(` il lato corto, in ${u}: il lato lungo è `)} ${longX}`,
			equation: rel === 'piu' ? `2x + 2(x + ${d}) = ${P}` : `2x + 2 \\cdot ${k}x = ${P}`,
			expanded: rel === 'piu' ? `2x + 2x + ${2 * d} = ${P}` : `2x + ${2 * k}x = ${P}`,
			a: rel === 'piu' ? 4 : 2 + 2 * k,
			b: rel === 'piu' ? P - 2 * d : P,
			x: s,
			answer,
			toAnswer: asked === 'lungo' ? `${t('Il lato lungo è ')} ${longX} = ${long}` : undefined,
			check: `2 \\cdot ${s} + 2 \\cdot ${long} = ${2 * s} + ${2 * long} = ${P}`,
			solution: `${t(`Il lato ${asked} misura ${answer} ${u}`)}`,
			given: rel === 'piu' ? [P, d] : [P],
			// the other side; the perimeter taken as the sum of two sides; four equal sides
			mistakes: [asked === 'corto' ? long : s, rel === 'piu' ? intDiv(P / 2 - d, 2) : intDiv(P / 2, 1 + k), intDiv(P, 4), rel === 'piu' ? intDiv(P + 2 * d, 4) : NaN],
		};
	}
}

interface TicketCtx {
	prose: (N: number, p1: number, p2: number, T: number, asked: string) => string;
	hi: string;
	lo: string;
	N: [number, number];
	p1: [number, number];
}
const TICKET_CTX: TicketCtx[] = [
	{
		prose: (N, p1, p2, T, asked) => `Per la gita al museo una classe compra ${N} biglietti, alcuni interi da ${p1} euro e gli altri ridotti da ${p2} euro, e spende in tutto ${T} euro. Quanti biglietti ${asked} ha comprato?`,
		hi: 'interi',
		lo: 'ridotti',
		N: [18, 28],
		p1: [6, 14],
	},
	{
		prose: (N, p1, p2, T, asked) => `Per lo spettacolo di fine anno la scuola ha venduto ${N} biglietti, alcuni da ${p1} euro per gli adulti e gli altri da ${p2} euro per i ragazzi, e ha incassato ${T} euro. Quanti biglietti per ${asked} ha venduto?`,
		hi: 'gli adulti',
		lo: 'i ragazzi',
		N: [40, 90],
		p1: [5, 10],
	},
];

function biglietti(rng: Rng): Problem {
	const ci = rng.int(0, TICKET_CTX.length - 1);
	const ctx = TICKET_CTX[ci];
	const N = rng.int(ctx.N[0], ctx.N[1]);
	const p1 = rng.int(ctx.p1[0], ctx.p1[1]);
	const p2 = rng.int(2, p1 - 2);
	const x = rng.int(2, N - 2), y = N - x;
	const T = p1 * x + p2 * y;
	const askHi = rng.int(0, 1) === 1;
	const answer = askHi ? x : y;
	return {
		story: 'biglietti',
		data: { context: ci, N, p1, p2, T, asked: askHi ? 'hi' : 'lo' },
		prose: ctx.prose(N, p1, p2, T, askHi ? ctx.hi : ctx.lo),
		unknown: `${t(`Chiama `)} x ${t(` il numero dei biglietti da ${p1} euro: quelli da ${p2} euro sono `)} ${N} - x`,
		equation: `${kx(p1)} + ${p2}(${N} - x) = ${T}`,
		expanded: `${kx(p1)} + ${p2 * N} - ${kx(p2)} = ${T}`,
		a: p1 - p2,
		b: T - p2 * N,
		x,
		answer,
		toAnswer: askHi ? undefined : `${t(`Biglietti da ${p2} euro: `)} ${N} - ${x} = ${y}`,
		check: `${p1} \\cdot ${x} + ${p2} \\cdot ${y} = ${p1 * x} + ${p2 * y} = ${T}`,
		solution: `${t(`${answer} biglietti`)}`,
		given: [N, p1, p2, T],
		// the other kind; x·(p1 + p2) = T; divided by p1 instead of p1 - p2; half of the tickets
		mistakes: [askHi ? y : x, intDiv(T, p1 + p2), intDiv(T - p2 * N, p1), intDiv(N, 2)],
	};
}

/** Coin pairs in cents, smaller first. */
const COINS: [number, number][] = [
	[100, 200],
	[20, 50],
	[10, 50],
	[50, 100],
	[50, 200],
];
const coinName = (c: number) => (c >= 100 ? `${c / 100} euro` : `${c} centesimi`);

function monete(rng: Rng): Problem {
	const pi = rng.int(0, COINS.length - 1);
	const [lo, hi] = COINS[pi];
	const N = rng.int(12, 40);
	const x = rng.int(2, N - 2), y = N - x; // x coins of the larger value
	const T = hi * x + lo * y; // cents
	const euros = lo >= 100;
	const u = euros ? 100 : 1;
	const [h, l, TT] = [hi / u, lo / u, T / u];
	const askHi = rng.int(0, 1) === 1;
	const answer = askHi ? x : y;
	const name = rng.pick(rng.int(0, 1) ? NAMES_F : NAMES_M);
	return {
		story: 'monete',
		data: { name, coins: pi, N, T, asked: askHi ? 'hi' : 'lo' },
		prose: `Nel salvadanaio ${name} ha ${N} monete, alcune da ${coinName(lo)} e le altre da ${coinName(hi)}, per un totale di ${euroProse(T)} euro. Quante sono le monete da ${coinName(askHi ? hi : lo)}?`,
		unknown: `${t('Chiama ')} x ${t(` il numero delle monete da ${coinName(hi)}: quelle da ${coinName(lo)} sono `)} ${N} - x`,
		pre: euros ? undefined : `${t('Conta in centesimi: ')} ${euroLatex(T)} ${t(' euro sono ')} ${T} ${t(' centesimi')}`,
		equation: `${kx(h)} + ${l === 1 ? '' : l}(${N} - x) = ${TT}`,
		expanded: `${kx(h)} + ${l * N} - ${kx(l)} = ${TT}`,
		a: h - l,
		b: TT - l * N,
		x,
		answer,
		toAnswer: askHi ? undefined : `${t(`Monete da ${coinName(lo)}: `)} ${N} - ${x} = ${y}`,
		check: `${h} \\cdot ${x} + ${l} \\cdot ${y} = ${h * x} + ${l * y} = ${TT}`,
		solution: `${t(`${answer} monete`)}`,
		given: [N, lo, hi, lo / 100, hi / 100, T, T / 100, Math.floor(T / 100)],
		mistakes: [askHi ? y : x, intDiv(TT, h + l), intDiv(TT - l * N, h), intDiv(N, 2)],
	};
}

interface ShopCtx {
	items: string;
	one: string;
	extra: string;
	price: [number, number];
	extraCents: [number, number];
}
const SHOP_CTX: ShopCtx[] = [
	{ items: 'magliette uguali', one: 'una maglietta', extra: 'un cappellino', price: [8, 25], extraCents: [550, 1490] },
	{ items: 'biglietti del cinema', one: 'un biglietto', extra: 'un sacchetto di pop-corn', price: [6, 10], extraCents: [350, 650] },
	{ items: 'libri uguali', one: 'un libro', extra: 'una penna', price: [10, 22], extraCents: [120, 390] },
	{ items: 'pizze uguali', one: 'una pizza', extra: 'una bottiglia di acqua', price: [6, 11], extraCents: [110, 290] },
];

function spesa(rng: Rng): Problem {
	const ci = rng.int(0, SHOP_CTX.length - 1);
	const ctx = SHOP_CTX[ci];
	const name = rng.pick(rng.int(0, 1) ? NAMES_F : NAMES_M);
	const n = rng.int(2, 6);
	const x = rng.int(ctx.price[0], ctx.price[1]);
	let extra: number;
	do extra = rng.int(ctx.extraCents[0] / 10, ctx.extraCents[1] / 10) * 10;
	while (extra % 100 === 0);
	const T = n * x * 100 + extra;
	return {
		story: 'spesa',
		data: { context: ci, name, n, extra, T },
		prose: `${name} compra ${n} ${ctx.items} e ${ctx.extra} da ${euroProse(extra)} euro, e spende in tutto ${euroProse(T)} euro. Quanto costa ${ctx.one}?`,
		unknown: `${t('Chiama ')} x ${t(` il prezzo di ${ctx.one}, in euro`)}`,
		equation: `${n}x + ${euroLatex(extra)} = ${euroLatex(T)}`,
		a: n,
		b: n * x,
		x,
		answer: x,
		check: `${n} \\cdot ${x} + ${euroLatex(extra)} = ${n * x} + ${euroLatex(extra)} = ${euroLatex(T)}`,
		solution: `${t(`${ctx.one[0].toUpperCase()}${ctx.one.slice(1)} costa ${x} euro`)}`,
		given: [n],
		// the whole spending of the n items; the extra item counted as one more of them
		mistakes: [n * x, intDiv(T - extra, (n + 1) * 100), intDiv(T + extra, n * 100)],
	};
}

function risparmi(rng: Rng): Problem {
	for (;;) {
		const spends = rng.int(0, 1) === 1;
		const n = rng.int(2, 20);
		const r1 = rng.int(3, 15);
		const r2 = spends ? rng.int(2, 10) : rng.int(1, r1 - 1);
		const a0 = rng.int(0, 16) * 5;
		const b0 = a0 + (spends ? r1 + r2 : r1 - r2) * n;
		if (b0 > 300 || (spends && b0 - r2 * n < 10)) continue;
		const [A, B] = distinctNames(rng, 2);
		const asked = rng.pick(['settimane', 'somma']);
		const sum = a0 + r1 * n;
		const answer = asked === 'settimane' ? n : sum;
		const first = a0 === 0 ? `${A} non ha risparmi e ogni settimana mette da parte ${r1} euro.` : `${A} ha ${a0} euro nel salvadanaio e ogni settimana ne aggiunge ${r1}.`;
		const second = `${B} ha ${b0} euro e ogni settimana ne ${spends ? 'spende' : 'aggiunge'} ${r2}.`;
		const question = asked === 'settimane' ? 'Tra quante settimane avranno la stessa somma?' : 'Quando avranno la stessa somma, quanti euro avrà ciascuno dei due?';
		const lhs = a0 === 0 ? kx(r1) : `${a0} + ${kx(r1)}`;
		const rhs = `${b0} ${spends ? '-' : '+'} ${kx(r2)}`;
		return {
			story: 'risparmi',
			data: { A, B, a0, r1, b0, r2, spends: spends ? 1 : 0, asked },
			prose: `${first} ${second} ${question}`,
			unknown: `${t('Chiama ')} x ${t(' il numero di settimane: allora ')} ${t(`${A} avrà `)} ${lhs} ${t(` euro e ${B} `)} ${rhs}`,
			equation: `${lhs} = ${rhs}`,
			a: spends ? r1 + r2 : r1 - r2,
			b: b0 - a0,
			x: n,
			answer,
			toAnswer: asked === 'somma' ? `${t(`Dopo ${n} settimane ${A} ha `)} ${lhs.replace('x', ` \\cdot ${n}`)} = ${sum} ${t(' euro')}` : undefined,
			check: `${a0 === 0 ? '' : `${a0} + `}${r1} \\cdot ${n} = ${sum} \\text{ e } ${b0} ${spends ? '-' : '+'} ${r2} \\cdot ${n} = ${spends ? b0 - r2 * n : b0 + r2 * n}`,
			solution: asked === 'settimane' ? t(`Tra ${n} settimane`) : t(`${sum} euro ciascuno`),
			given: [a0, r1, b0, r2],
			// the other question; the difference divided by one rate only; the rates added instead of subtracted (or vice versa)
			mistakes: asked === 'settimane' ? [sum, intDiv(b0 - a0, r1), intDiv(b0 - a0, spends ? r1 - r2 : r1 + r2), b0 - a0] : [n, b0, b0 - a0, a0 + r1 * (n + 1)],
		};
	}
}

interface RateCtx {
	prose: (F1: number, m1: number, F2: number, m2: number) => string;
	unit: string;
	n: [number, number];
	m2: [number, number];
	gap: [number, number];
	F1: [number, number];
	maxF2: number;
}
const RATE_CTX: RateCtx[] = [
	{
		prose: (F1, m1, F2, m2) => `Una palestra propone due abbonamenti. Con il primo paghi ${F1} euro di iscrizione e ${m1} euro al mese, con il secondo ${F2} euro di iscrizione e ${m2} euro al mese. Dopo quanti mesi i due abbonamenti costano uguale?`,
		unit: 'mesi',
		n: [2, 12],
		m2: [20, 40],
		gap: [2, 10],
		F1: [10, 50],
		maxF2: 150,
	},
	{
		prose: (F1, m1, F2, m2) => `Per noleggiare una bicicletta un negozio chiede ${F1} euro fissi più ${m1} euro all'ora, un altro ${F2} euro fissi più ${m2} euro all'ora. Dopo quante ore di noleggio i due prezzi sono uguali?`,
		unit: 'ore',
		n: [2, 8],
		m2: [1, 4],
		gap: [1, 3],
		F1: [2, 8],
		maxF2: 40,
	},
];

function tariffe(rng: Rng): Problem {
	const ci = rng.int(0, RATE_CTX.length - 1);
	const ctx = RATE_CTX[ci];
	for (;;) {
		const n = rng.int(ctx.n[0], ctx.n[1]);
		const m2 = rng.int(ctx.m2[0], ctx.m2[1]);
		const m1 = m2 + rng.int(ctx.gap[0], ctx.gap[1]);
		const F1 = rng.int(ctx.F1[0], ctx.F1[1]);
		const F2 = F1 + (m1 - m2) * n;
		if (F2 > ctx.maxF2) continue;
		const cost = F1 + m1 * n;
		return {
			story: 'tariffe',
			data: { context: ci, F1, m1, F2, m2 },
			prose: ctx.prose(F1, m1, F2, m2),
			unknown: `${t('Chiama ')} x ${t(` il numero di ${ctx.unit}: la prima tariffa costa `)} ${F1} + ${kx(m1)} ${t(', la seconda ')} ${F2} + ${kx(m2)}`,
			equation: `${F1} + ${kx(m1)} = ${F2} + ${kx(m2)}`,
			a: m1 - m2,
			b: F2 - F1,
			x: n,
			answer: n,
			check: `${F1} + ${m1} \\cdot ${n} = ${cost} \\text{ e } ${F2} + ${m2} \\cdot ${n} = ${cost}`,
			solution: t(`Dopo ${n} ${ctx.unit}`),
			given: [F1, m1, F2, m2],
			// the cost instead of the time; one rate only; rates added; the difference of the fixed parts
			mistakes: [cost, intDiv(F2 - F1, m1), intDiv(F2 - F1, m1 + m2), F2 - F1],
		};
	}
}

const BUILDERS: Record<Story, (rng: Rng) => Problem> = { consecutivi, eta, divisione, rettangolo, biglietti, monete, spesa, risparmi, tariffe };

function problemSteps(p: Problem): string[] {
	const steps = [p.unknown, ...(p.pre ? [p.pre] : []), `${t('Traduci il testo in un\'equazione: ')} ${p.equation}`];
	if (p.expanded) steps.push(`${t('Togli le parentesi: ')} ${p.expanded}`);
	const ax = p.a === 1 ? 'x' : p.a === -1 ? '-x' : `${p.a}x`;
	steps.push(`${t('Porta i termini con la ')} x ${t(' a primo membro e i numeri a secondo membro, poi riduci: ')} ${ax} = ${p.b}`);
	if (p.a !== 1) steps.push(`${t('Dividi entrambi i membri per ')} ${p.a < 0 ? `(${p.a})` : p.a}\\text{: } x = ${p.x}`);
	if (p.toAnswer) steps.push(p.toAnswer);
	steps.push(`${t('Controllo: ')} ${p.check}`);
	return steps;
}

function generateProblem(rng: Rng): Sample {
	for (let attempt = 0; attempt < 1000; attempt++) {
		const story = rng.pick(STORIES);
		const p = BUILDERS[story](rng);
		if (p.given.includes(p.answer) || p.a * p.x !== p.b) continue;
		const sample: Sample = {
			generatorId: ID,
			level: 7,
			seed: rng.seed,
			prompt: 'Risolvi il problema con un\'equazione.',
			problem: textBlock(p.prose),
			solution: p.solution,
			steps: problemSteps(p),
			answer: { kind: 'number', value: String(p.answer) },
			params: {
				story: p.story,
				...Object.fromEntries(Object.entries(p.data).map(([k, v]) => [k, String(v)])),
				equation: p.equation,
				x: String(p.x),
				normal: { a: String(p.a), b: String(p.b) },
				mistakes: p.mistakes.filter((m) => Number.isInteger(m) && m > 0 && m !== p.answer).map(String),
			},
		};
		if (checkProblem(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid word problem, seed ${rng.seed}`);
}

/** Recomputes the answer from the data of the story, as the text states it. */
function problemTruth(p: Record<string, unknown>): number | null {
	const n = (k: string) => Number(p[k]);
	const search = (ok: (x: number) => boolean, from = 0, to = 2000) => {
		const xs: number[] = [];
		for (let x = from; x <= to; x++) if (ok(x)) xs.push(x);
		return xs.length === 1 ? xs[0] : null;
	};
	switch (p.story) {
		case 'consecutivi': {
			const k = n('n');
			const x = search((x) => k * x + (k * (k - 1)) / 2 === n('S'));
			return x === null ? null : p.asked === 'piccolo' ? x : x + k - 1;
		}
		case 'eta':
			return search((y) => n('parent') + y === n('k') * (n('child') + y), 1);
		case 'divisione': {
			const shares = (x: number) => (n('people') === 2 ? [x, x + n('d')] : [x, x + n('d'), 2 * x]);
			const x = search((x) => shares(x).reduce((s, v) => s + v, 0) === n('T'), 1);
			return x === null ? null : shares(x)[n('asked')];
		}
		case 'rettangolo': {
			const long = (s: number) => (p.rel === 'piu' ? s + n('d') : n('k') * s);
			const s = search((s) => 2 * (s + long(s)) === n('P'), 1);
			return s === null ? null : p.asked === 'corto' ? s : long(s);
		}
		case 'biglietti': {
			const x = search((x) => n('p1') * x + n('p2') * (n('N') - x) === n('T'), 0, n('N'));
			return x === null ? null : p.asked === 'hi' ? x : n('N') - x;
		}
		case 'monete': {
			const [lo, hi] = COINS[n('coins')];
			const x = search((x) => hi * x + lo * (n('N') - x) === n('T'), 0, n('N'));
			return x === null ? null : p.asked === 'hi' ? x : n('N') - x;
		}
		case 'spesa':
			return search((x) => n('n') * x * 100 + n('extra') === n('T'), 1);
		case 'risparmi': {
			const w = search((w) => n('a0') + n('r1') * w === n('b0') + (n('spends') ? -1 : 1) * n('r2') * w, 1);
			return w === null ? null : p.asked === 'settimane' ? w : n('a0') + n('r1') * w;
		}
		case 'tariffe':
			return search((h) => n('F1') + n('m1') * h === n('F2') + n('m2') * h, 1);
		default:
			return null;
	}
}

function checkProblem(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	if (!STORIES.includes(p.story as Story)) return [`storia sconosciuta ${String(p.story)}`];
	const truth = problemTruth(p);
	if (truth === null || truth <= 0) return ['il problema non ha una sola soluzione intera positiva'];
	const ans = sample.answer;
	if (ans.kind !== 'number' || ans.value !== String(truth)) v.push('risposta diversa da quella del problema');
	const a = Number((p.normal as { a: string }).a), b = Number((p.normal as { b: string }).b), x = Number(p.x);
	if (a === 0 || a * x !== b) v.push('forma normale sbagliata');
	if (!sample.problem.includes('\\text{')) v.push('testo mancante');
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(String(p.equation))) v.push(`equazione con ${name}: ${String(p.equation)}`);
	if (/—|piuttosto che/.test(sample.problem)) v.push('parole vietate nel testo');
	return v;
}

function problemChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const value = Number((sample.answer as { value: string }).value);
	const mistakes = ((sample.params.mistakes as string[]) ?? []).map(Number).filter((m) => m > 0);
	// Near values after the mistakes, never 0: "0 years" or "0 tickets" is no answer to these stories.
	for (let d = 1; d < 40; d++) mistakes.push(value + d, ...(value - d > 0 ? [value - d] : []));
	return numberChoice(rng, value, mistakes);
}

export const equazioniPrimoGrado: Generator = {
	id: ID,
	title: 'Equazioni di primo grado',
	levels: {
		1: { label: 'Un solo termine con la x', constraints: ['ax + b = c, a diverso da 0 e da 1', 'soluzione intera tra -12 e 12'] },
		2: { label: 'Incognita in entrambi i membri', constraints: ['ax + b = cx + d con a diverso da c', 'soluzione intera tra -12 e 12'] },
		3: { label: 'Con le parentesi', constraints: ['almeno un termine k(ax + b) con k diverso da 1', 'soluzione intera tra -12 e 12'] },
		4: { label: 'Soluzione frazionaria', constraints: ['come i livelli 2 e 3', 'soluzione p/q non intera, q fino a 9'] },
		5: { label: 'Con i denominatori', constraints: ['termini (ax + b)/d con d da 2 a 6, almeno due denominatori diversi', 'si moltiplica per il mcm'] },
		6: { label: 'Impossibili e indeterminate', constraints: ['circa 4 su 10 impossibili, 4 su 10 indeterminate, 2 su 10 determinate'] },
		7: { label: 'Problemi', constraints: ['un testo da tradurre in un\'equazione ax + b = c o con la x in entrambi i membri', 'nove storie; risposta intera e positiva, sensata nel contesto'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (level === 7) return generateProblem(rng);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			// The x terms of a random construction can cancel out: that draw is discarded.
			if (!b || solve(b.lhs, b.rhs).case !== b.case) continue;
			const sample = assemble(b, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioniPrimoGrado;
