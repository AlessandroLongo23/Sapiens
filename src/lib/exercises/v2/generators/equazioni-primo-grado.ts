/**
 * Equazioni di primo grado intere. Spec: specs/exercises/equazioni-primo-grado.md
 *
 * Six levels in the order of the lesson, each adding one difficulty: ax + b = c, the unknown on
 * both sides, parentheses, a fractional solution, numeric denominators, impossible and
 * indeterminate equations. Built backwards: the solution is chosen first and one constant is
 * computed so that it holds. Each side is a list of terms k·(a·x + b)/d.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { poly, polyToLatex } from '../latex';

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
	},
	generate(rng: Rng, level: number): Sample {
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
