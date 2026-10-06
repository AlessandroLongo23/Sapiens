/**
 * Disequazioni esponenziali. Spec: specs/exercises/disequazioni-esponenziali.md
 *
 * Seven levels in the order of lesson 123 (docs/lezioni/riscritte/123-disequazioni-esponenziali.md): the
 * elementary inequality with a base greater than 1, a base between 0 and 1, a second member that is negative or
 * zero, the same base with an exponent of first degree, an exponent of second degree, the common power taken out
 * of a sum, and the substitution t = a^x.
 *
 * Built backwards from the ends of the solution: every inequality is a sum of terms c · a^(p · e(x)) on each side
 * (p = -1 writes the base 1/a), and `params` carries them. No inequality needs a logarithm. The answer is a union
 * of intervals, which no answer type of today holds: it is a multiple choice from the start, as in
 * disequazioni-secondo-grado, written either as inequalities joined by "oppure" or as intervals with reversed
 * brackets. The wrong options are the solutions of the mistakes named in the lesson's warnings: the sign not
 * turned with a base smaller than 1, or turned when it should not be, the ends included or left out, the values
 * of t given as the answer.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { polyToLatex } from '../latex';
import { forbidden } from '../monomi';
import {
	ALL,
	FLIP,
	OPS,
	OP_LATEX,
	TOGGLE,
	between,
	intNot,
	isAll,
	ivOption,
	ivValue,
	ivsKey,
	large,
	lastStep,
	linLatex,
	numPow,
	points,
	positive,
	powLatex,
	ratPow,
	ray,
	setLatex,
	shuffled,
	type Iv,
	type Notation,
	type Op,
} from '../esponenziali';

export const ID = 'disequazioni-esponenziali';

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
	op: Op;
	problem: string;
	truth: Iv[];
	steps: string[];
	/** Wrong answers, in order of preference. */
	cands: Iv[][];
}

const BASES = [2, 3, 5];
const N_RANGE: Record<number, [number, number]> = { 2: [-4, 6], 3: [-3, 4], 5: [-2, 3], 10: [-3, 3] };
const num = (a: number, n: number) => ratPow(q(a), n);
const numL = (a: number, n: number) => num(a, n).toLatex();
const text = (s: string) => `\\text{${s}}`;
const tex = (o: Op) => OP_LATEX[o];
const KEEP = text('La base è maggiore di 1: il verso resta.');
const TURN = text('La base è tra 0 e 1: il verso si inverte.');

/** ± body, with the sign folded in and no coefficient 1. */
function signed(c: number, body: string, first: boolean): string {
	const k = Math.abs(c) === 1 && body ? '' : `${Math.abs(c)}${body ? ' \\cdot ' : ''}`;
	if (first) return `${c < 0 ? '-' : ''}${k}${body}`;
	return ` ${c < 0 ? '-' : '+'} ${k}${body}`;
}

// ---------------------------------------------------------------------------
// Levels

/** a^x op b, with a > 1 and b a power of a. */
function level1(rng: Rng): Build {
	const a = rng.pick([2, 3, 5, 10]);
	const [lo, hi] = N_RANGE[a];
	const n = rng.int(lo, hi);
	const op = rng.pick(OPS);
	const left = powLatex(q(a), 'x');
	const r = q(n);
	return {
		case: n < 0 ? 'esponente negativo' : 'esponente non negativo',
		a,
		lhs: [{ c: 1, p: 1, e: [0, 1] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		op,
		problem: `${left} ${tex(op)} ${numL(a, n)}`,
		truth: ray(r, op),
		steps: [`${numL(a, n)} = ${numPow(q(a), n)}`, `${left} ${tex(op)} ${numPow(q(a), n)}`, KEEP],
		cands: [ray(r, FLIP[op]), ray(r, TOGGLE[op]), ...(n !== 0 ? [ray(r.neg(), op)] : []), ray(num(a, n), op), ray(r, TOGGLE[FLIP[op]]), ray(q(n + 1), op), ray(q(n - 1), op)],
	};
}

/** (1/a)^x op b, with b a power of a: the sign turns. */
function level2(rng: Rng): Build {
	const a = rng.pick([2, 3, 5, 10]);
	const [lo, hi] = N_RANGE[a];
	const n = intNot(rng, lo, hi, [0]);
	const op = rng.pick(OPS);
	const base = q(1, a);
	const left = powLatex(base, 'x');
	const r = q(-n);
	return {
		case: n < 0 ? 'secondo membro frazione' : 'secondo membro intero',
		a,
		lhs: [{ c: 1, p: -1, e: [0, 1] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		op,
		problem: `${left} ${tex(op)} ${numL(a, n)}`,
		truth: ray(r, FLIP[op]),
		steps: [`${numL(a, n)} = ${numPow(base, -n)}`, `${left} ${tex(op)} ${numPow(base, -n)}`, TURN],
		cands: [ray(r, op), ray(r.neg(), FLIP[op]), ray(r.neg(), op), ray(r, TOGGLE[FLIP[op]]), ray(r, TOGGLE[op])],
	};
}

/** A second member that is negative or zero, mixed with a positive one: ℝ, ∅ or a half-line. */
function level3(rng: Rng): Build {
	const a = rng.pick([2, 3, 5, 10]);
	const small = rng.next() < 0.5;
	const p = small ? -1 : 1;
	const base = small ? q(1, a) : q(a);
	const left = powLatex(base, 'x');
	const op = rng.pick(OPS);
	const eff = small ? FLIP[op] : op;
	const lhs: Term[] = [{ c: 1, p, e: [0, 1] }];
	const u = rng.next();
	if (u < 0.3) {
		// positive second member: an ordinary elementary inequality among the same four options
		const n = intNot(rng, 1, Math.min(N_RANGE[a][1], 4), []);
		const r = q(small ? -n : n);
		return {
			case: 'secondo membro positivo',
			a,
			lhs,
			rhs: [{ c: 1, p: 1, e: [n] }],
			op,
			problem: `${left} ${tex(op)} ${numL(a, n)}`,
			truth: ray(r, eff),
			steps: [`${numL(a, n)} = ${numPow(base, small ? -n : n)}`, small ? TURN : KEEP],
			cands: [ALL, [], ray(r, FLIP[eff])],
		};
	}
	const zero = u < 0.45;
	const n = rng.int(0, Math.min(N_RANGE[a][1], 3));
	const b = zero ? q(0) : num(a, n).neg();
	const always = positive(op);
	const k = q(zero ? 0 : small ? n : -n);
	return {
		case: always ? 'sempre vera' : 'impossibile',
		a,
		lhs,
		rhs: [{ c: zero ? 0 : -1, p: 1, e: [n] }],
		op,
		problem: `${left} ${tex(op)} ${b.toLatex()}`,
		truth: always ? ALL : [],
		steps: [`${left} > 0 ${text(' per ogni ')} x`, text(always ? `Una potenza con la base positiva è sempre maggiore di ${zero ? 'zero' : 'un numero negativo'}.` : `Una potenza con la base positiva non è mai ${zero ? 'negativa né nulla' : 'minore di un numero negativo'}.`)],
		cands: [always ? [] : ALL, ray(k, eff), ray(k, FLIP[eff])],
	};
}

/** B^(m x + k) op a^n, with B = a or 1/a. */
function level4(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const p = rng.pick([1, -1]);
	const base = p === 1 ? q(a) : q(1, a);
	const m = intNot(rng, -3, 4, [0]);
	const k = rng.int(-5, 5);
	if (m === 1 && k === 0) return null;
	const [lo, hi] = N_RANGE[a];
	const n = rng.int(lo, hi);
	const op = rng.pick(OPS);
	// p (m x + k) op n
	const x0 = q(p * n - k, m);
	if (Math.abs(x0.num) > 9 || x0.den > 4) return null;
	const mid = p === 1 ? op : FLIP[op];
	const eff = m > 0 ? mid : FLIP[mid];
	const expL = linLatex(m, k);
	const left = powLatex(base, expL);
	const e = p * n;
	const steps = [`${numL(a, n)} = ${numPow(base, e)}`, `${left} ${tex(op)} ${numPow(base, e)}`, p === 1 ? KEEP : TURN, `${expL} ${tex(mid)} ${e}`];
	if (m < 0) steps.push(text('Dividi per ') + `${m}` + text(', che è negativo: il verso cambia.'));
	return {
		case: `${p === 1 ? 'base maggiore di 1' : 'base tra 0 e 1'}, ${m > 0 ? 'm positivo' : 'm negativo'}`,
		a,
		lhs: [{ c: 1, p, e: [k, m] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		op,
		problem: `${left} ${tex(op)} ${numL(a, n)}`,
		truth: ray(x0, eff),
		steps,
		cands: [ray(x0, FLIP[eff]), ray(x0, TOGGLE[eff]), ray(q(n - k, m), p === 1 ? FLIP[eff] : eff), ray(q(p * n + k, m), eff), ray(x0.neg(), eff), ray(x0, TOGGLE[FLIP[eff]]), ray(x0.add(q(1)), eff)],
	};
}

/** B^(x^2 + b x + c) op a^n: the exponents give an inequality of second degree. */
function level5(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const p = rng.pick([1, -1]);
	const base = p === 1 ? q(a) : q(1, a);
	const r1 = rng.int(-5, 4);
	const r2 = rng.int(r1 + 1, 5);
	const n = rng.int(-2, 3);
	const op = rng.pick(OPS);
	const e = p * n;
	const b = -(r1 + r2);
	const c = r1 * r2 + e;
	if ((b === 0 && c === 0) || Math.abs(c) > 20) return null;
	const mid = p === 1 ? op : FLIP[op];
	const expL = polyToLatex([q(c), q(b), q(1)]);
	const left = powLatex(base, expL);
	const tri = polyToLatex([q(c - e), q(b), q(1)]);
	const inside = !positive(mid);
	const steps = [`${numL(a, n)} = ${numPow(base, e)}`, p === 1 ? KEEP : TURN, `${expL} ${tex(mid)} ${e}`];
	if (e !== 0) steps.push(`${tri} ${tex(mid)} 0`);
	steps.push(`x_1 = ${r1}, \\quad x_2 = ${r2}`, text(`Il verso è `) + tex(mid) + text(`: valori ${inside ? 'interni' : 'esterni'}, estremi ${large(mid) ? 'compresi' : 'esclusi'}.`));
	const R1 = q(r1);
	const R2 = q(r2);
	return {
		case: `${p === 1 ? 'base maggiore di 1' : 'base tra 0 e 1'}, valori ${inside ? 'interni' : 'esterni'}`,
		a,
		lhs: [{ c: 1, p, e: [c, b, 1] }],
		rhs: [{ c: 1, p: 1, e: [n] }],
		op,
		problem: `${left} ${tex(op)} ${numL(a, n)}`,
		truth: between(R1, R2, inside, large(mid)),
		steps,
		cands: [between(R1, R2, !inside, large(mid)), between(R1, R2, inside, !large(mid)), points([R1, R2]), between(R1, R2, !inside, !large(mid))],
	};
}

/** ± a^(x + k1) ± a^(x + k2) op N: the common power is taken out, and its factor may be negative. */
function level6(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const k2 = rng.int(-2, 2);
	const k1 = rng.int(k2 + 1, 3);
	const first = rng.pick([1, -1]);
	const s = rng.pick([1, -1]);
	const d = k1 - k2;
	const F = first * a ** d + s;
	const m = rng.int(-2, 4);
	if (m + k2 < 0) return null;
	const N = F * a ** (m + k2);
	if (Math.abs(N) > 2000) return null;
	const op = rng.pick(OPS);
	const eff = F > 0 ? op : FLIP[op];
	const e1 = linLatex(1, k1);
	const e2 = linLatex(1, k2);
	const p1 = powLatex(q(a), e1);
	const p2 = powLatex(q(a), e2);
	const fL = `${first < 0 ? '-' : ''}${a ** d} ${s < 0 ? '-' : '+'} 1`;
	const steps = [`${p1} = ${a ** d} \\cdot ${p2}`, `${p2} \\left(${fL}\\right) ${tex(op)} ${N}`];
	if (F < 0) steps.push(text('Dividi per ') + `${F}` + text(', che è negativo: il verso cambia.'));
	steps.push(`${p2} ${tex(eff)} ${N / F}`, `${N / F} = ${numPow(q(a), m + k2)}`, KEEP);
	if (k2 !== 0) steps.push(`${e2} ${tex(eff)} ${m + k2}`);
	const M = q(m);
	return {
		case: F < 0 ? 'fattore negativo' : 'fattore positivo',
		a,
		lhs: [
			{ c: first, p: 1, e: [k1, 1] },
			{ c: s, p: 1, e: [k2, 1] },
		],
		rhs: [{ c: N, p: 0, e: [0] }],
		op,
		problem: `${signed(first, p1, true)}${signed(s, p2, false)} ${tex(op)} ${N}`,
		truth: ray(M, eff),
		steps,
		cands: [ray(M, FLIP[eff]), ray(M, TOGGLE[eff]), ...(k2 !== 0 ? [ray(q(m + k2), eff)] : [ray(q(m + k1), eff)]), ray(M, TOGGLE[FLIP[eff]]), ray(q(m + 1), eff), ray(q(m - 1), eff)],
	};
}

const M_MAX: Record<number, number> = { 2: 3, 3: 3, 5: 2 };

/** (a^2)^x + s a^x + p op 0, of second degree in t = a^x. */
function level7(rng: Rng): Build | null {
	const a = rng.pick(BASES);
	const A = a * a;
	const op = rng.pick(OPS);
	const inside = !positive(op);
	const closed = large(op);
	const ends = closed ? 'compresi' : 'esclusi';
	let t1: number, t2: number, truth: Iv[], cands: Iv[][], kase: string;
	const back: string[] = [];
	if (rng.next() < 0.55) {
		const m1 = rng.int(0, M_MAX[a] - 1);
		const m2 = rng.int(m1 + 1, M_MAX[a]);
		t1 = a ** m1;
		t2 = a ** m2;
		kase = `due valori positivi, valori ${inside ? 'interni' : 'esterni'}`;
		truth = between(q(m1), q(m2), inside, closed);
		cands = [between(q(t1), q(t2), inside, closed), between(q(m1), q(m2), !inside, closed), between(q(m1), q(m2), inside, !closed), points([q(m1), q(m2)]), between(q(m1), q(m2), !inside, !closed)];
		if (inside) back.push(`${t1} ${tex(op)} ${a}^x ${tex(op)} ${t2}`, `${numPow(q(a), m1)} ${tex(op)} ${a}^x ${tex(op)} ${numPow(q(a), m2)}`, KEEP);
		else back.push(`${a}^x ${tex(FLIP[op])} ${t1} \\ \\Rightarrow \\ x ${tex(FLIP[op])} ${m1}`, `${a}^x ${tex(op)} ${t2} \\ \\Rightarrow \\ x ${tex(op)} ${m2}`);
	} else {
		const c = rng.int(1, 9);
		const m = rng.int(0, M_MAX[a]);
		t1 = -c;
		t2 = a ** m;
		if (t2 === c) return null;
		kase = `un valore negativo, valori ${inside ? 'interni' : 'esterni'}`;
		// inside: -c < a^x < a^m, the first always true; outside: a^x < -c never, or a^x > a^m
		truth = ray(q(m), op);
		cands = [inside ? [] : ALL, ray(q(m), FLIP[op]), ray(q(t2), op), ray(q(m), TOGGLE[op]), between(q(-c), q(m), inside, closed), ray(q(m), TOGGLE[FLIP[op]])];
		if (inside) back.push(`${a}^x ${tex(FLIP[op])} ${t1} ${text(' è vera per ogni ')} x`, `${a}^x ${tex(op)} ${t2} \\ \\Rightarrow \\ x ${tex(op)} ${m}`);
		else back.push(`${a}^x ${tex(FLIP[op])} ${t1} ${text(' è impossibile.')}`, `${a}^x ${tex(op)} ${t2} \\ \\Rightarrow \\ x ${tex(op)} ${m}`);
	}
	const S = t1 + t2;
	const P = t1 * t2;
	const tPoly = polyToLatex([q(P), q(-S), q(1)], 't');
	const steps = [
		`t = ${a}^x`,
		`${tPoly} ${tex(op)} 0`,
		`t_1 = ${t1}, \\quad t_2 = ${t2}`,
		text(`Il verso è `) + tex(op) + text(`: valori ${inside ? 'interni' : 'esterni'}, estremi ${ends}.`),
		inside ? `${t1} ${tex(op)} t ${tex(op)} ${t2}` : `t ${tex(FLIP[op])} ${t1} \\ \\text{ oppure } \\ t ${tex(op)} ${t2}`,
		...back,
	];
	return {
		case: kase,
		a,
		lhs: [
			{ c: 1, p: 2, e: [0, 1] },
			{ c: -S, p: 1, e: [0, 1] },
			{ c: P, p: 0, e: [0] },
		],
		rhs: [{ c: 0, p: 0, e: [0] }],
		op,
		problem: `${A}^x${signed(-S, `${a}^x`, false)}${signed(P, '', false)} ${tex(op)} 0`,
		truth,
		steps,
		cands,
	};
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly and check

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const notation: Notation = rng.next() < 0.5 ? 'disequazioni' : 'intervalli';
	const picked: Iv[][] = [b.truth];
	const seen = new Set([ivsKey(b.truth)]);
	for (const c of b.cands) {
		if (picked.length === 4) break;
		if (seen.has(ivsKey(c))) continue;
		seen.add(ivsKey(c));
		picked.push(c);
	}
	if (picked.length < 4) return null;
	const order = shuffled(
		rng,
		picked.map((_, i) => i),
	);
	const answer: ChoiceAnswer = { kind: 'choice', options: order.map((i) => ivOption(picked[i], notation)), correct: order.indexOf(0) };
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Risolvi la disequazione.',
		problem: b.problem,
		solution: setLatex(b.truth),
		steps: [...b.steps, lastStep(b.truth)],
		answer,
		params: { case: b.case, a: b.a, op: b.op, lhs: b.lhs, rhs: b.rhs, notation, truth: b.truth.map(ivValue) },
	};
}

/** The value of a side at x, in floating point. */
function sideValue(a: number, ts: Term[], x: number): number {
	return ts.reduce((acc, t) => acc + t.c * Math.pow(a, t.p * t.e.reduce((u, c, i) => u + c * x ** i, 0)), 0);
}

const holds = (d: number, op: Op) => (op === '<' ? d < 0 : op === '>' ? d > 0 : op === '<=' ? d <= 0 : d >= 0);

function inside(ivs: Iv[], x: number): boolean {
	return ivs.some((iv) => {
		const lo = iv.lo ? iv.lo.num / iv.lo.den : -Infinity;
		const hi = iv.hi ? iv.hi.num / iv.hi.den : Infinity;
		return x > lo && x < hi;
	});
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { case: string; a: number; op: Op; lhs: Term[]; rhs: Term[]; notation: Notation; truth: string[] };
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	const ans = s.answer;
	if (ans.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== p.truth.join('|')) errs.push('opzione giusta sbagliata');
	// the truth, read back from its values
	const ivs: Iv[] = p.truth.map((v) => {
		const m = /^([[(])(-oo|[^,]+),(oo|[^\])]+)([\])])$/.exec(v)!;
		return { lo: m[2] === '-oo' ? null : Rational.parse(m[2]), hi: m[3] === 'oo' ? null : Rational.parse(m[3]), loC: m[1] === '[', hiC: m[4] === ']' };
	});
	const f = (x: number) => sideValue(p.a, p.lhs, x) - sideValue(p.a, p.rhs, x);
	const ends = ivs.flatMap((iv) => [iv.lo, iv.hi]).filter((r): r is Rational => !!r);
	const cuts = [...new Set(ends.map((r) => r.num / r.den))].sort((u, v) => u - v);
	// one point in each region the ends cut the line into
	const probes = cuts.length ? [cuts[0] - 0.7, ...cuts.slice(1).map((c, i) => (c + cuts[i]) / 2), cuts[cuts.length - 1] + 0.7] : [-1.3, 0.4, 2.1];
	for (const x of probes) if (holds(f(x), p.op) !== inside(ivs, x)) errs.push(`la soluzione sbaglia in x = ${x}`);
	for (const iv of ivs) {
		for (const [e, c] of [
			[iv.lo, iv.loC],
			[iv.hi, iv.hiC],
		] as [Rational | null, boolean][]) {
			if (!e) continue;
			const v = e.num / e.den;
			if (Math.abs(f(v)) > 1e-9 * Math.max(1, Math.abs(sideValue(p.a, p.lhs, v)))) errs.push('un estremo non annulla la differenza dei due membri');
			if (c !== large(p.op)) errs.push('estremo incluso o escluso contro il verso');
		}
	}
	if (s.level !== 3 && (isAll(ivs) || !ivs.length)) errs.push('soluzione vuota o tutto ℝ fuori dal livello 3');
	errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const disequazioniEsponenziali: Generator = {
	id: ID,
	title: 'Disequazioni esponenziali',
	levels: {
		1: { label: 'Elementare, base maggiore di 1', constraints: ['a^x op b con b potenza di a a esponente intero', 'tutti i versi'] },
		2: { label: 'Base tra 0 e 1', constraints: ['(1/a)^x op b con b potenza di a', 'il verso si inverte'] },
		3: { label: 'Secondo membro negativo o nullo', constraints: ['a^x op b oppure (1/a)^x op b', 'b ≤ 0 in sette casi su dieci: ℝ oppure ∅'] },
		4: { label: 'Stessa base, esponente di primo grado', constraints: ['B^(mx + k) op a^n con B = a oppure 1/a', 'estremo razionale con denominatore fino a 4'] },
		5: { label: 'Esponente di secondo grado', constraints: ['B^(x^2 + bx + c) op a^n', 'due zeri interi distinti: valori interni o esterni'] },
		6: { label: 'Raccoglimento', constraints: ['± a^(x + k1) ± a^(x + k2) op N', 'il fattore raccolto è negativo in metà dei casi'] },
		7: { label: 'Sostituzione', constraints: ['(a^2)^x + s a^x + p op 0', 'due valori positivi di t, oppure uno negativo'] },
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
	toChoice: (sample: Sample) => {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: the answer is always a choice`);
		return sample.answer;
	},
};

export default disequazioniEsponenziali;
