/**
 * Grado di un monomio. Spec: specs/exercises/monomi-grado.md
 *
 * Six levels in the order of the lesson, each adding one difficulty: degree with respect to a
 * letter, total degree, the zero cases (missing letter, constant), an exponent that belongs to
 * the coefficient (2^3x^2), a monomial not yet in normal form (3a^2b · a), and the degree of the
 * result of a product, a quotient or a power. The answer is a natural number.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Mono,
	FAMILIES,
	buildChoice,
	degree,
	div,
	expOf,
	factorLatex,
	forbidden,
	letters,
	literalLatex,
	mono,
	monoFromJSON,
	monoJSON,
	monoLatex,
	mul,
	nonZero,
	numOpt,
	pickLetters,
	pow,
	ratPow,
	wrap,
} from '../monomi';

export const ID = 'monomi-grado';

type Op = 'prodotto' | 'quoziente' | 'potenza';

interface Built {
	/** "totale" or the letter asked for. */
	ask: string;
	case: string;
	/** Level 1-3: one monomial; level 5: the factors of the product. */
	factors: Mono[];
	/** Level 4: the coefficient is written as base^n. */
	coefPow?: { base: Rational; n: number };
	/** Level 6. */
	op?: Op;
	n?: number;
}

const prep = (v: string) => (v === 'a' ? 'ad' : 'a');

function randomCoef(rng: Rng, fracShare: number): Rational {
	const u = rng.next();
	if (u < fracShare) {
		for (;;) {
			const r = q(nonZero(rng, -9, 9), rng.int(2, 7));
			if (!r.isInteger()) return r;
		}
	}
	if (u < fracShare + 0.1) return q(rng.pick([1, -1]));
	return q(nonZero(rng, -15, 15, [1, -1]));
}

function randomExps(rng: Rng, ls: string[], lo: number, hi: number): Record<string, number> {
	const e: Record<string, number> = {};
	for (const v of ls) e[v] = rng.int(lo, hi);
	return e;
}

// ---------------------------------------------------------------------------
// Construction

function build(rng: Rng, level: number): Built | null {
	const fam = rng.pick(FAMILIES);
	switch (level) {
		case 1: {
			const ls = pickLetters(rng, fam, rng.pick([2, 2, 3]));
			const e = randomExps(rng, ls, 1, 7);
			const t = rng.pick(ls);
			const hidden = rng.next() < 0.35;
			e[t] = hidden ? 1 : rng.int(2, 7);
			return { ask: t, case: hidden ? 'esponente sottinteso' : 'esponente scritto', factors: [mono(randomCoef(rng, 0.25), e)] };
		}
		case 2: {
			const ls = pickLetters(rng, fam, rng.pick([2, 3, 3]));
			const withOne = rng.next() < 0.6;
			const e = randomExps(rng, ls, 2, 7);
			if (withOne) e[rng.pick(ls)] = 1;
			return { ask: 'totale', case: withOne ? 'con esponente sottinteso' : 'esponenti tutti scritti', factors: [mono(randomCoef(rng, 0.3), e)] };
		}
		case 3: {
			const u = rng.next();
			if (u < 0.4) {
				const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
				const missing = fam.filter((v) => !ls.includes(v));
				return { ask: rng.pick(missing), case: 'lettera assente', factors: [mono(randomCoef(rng, 0.25), randomExps(rng, ls, 1, 6))] };
			}
			if (u < 0.65) {
				const c = rng.next() < 0.6 ? q(nonZero(rng, -20, 20, [1, -1, 0])) : randomCoef(rng, 1);
				return { ask: 'totale', case: 'costante', factors: [mono(c)] };
			}
			// A control case, so that the answer is not always 0.
			const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
			const e = randomExps(rng, ls, 1, 6);
			const m = mono(randomCoef(rng, 0.25), e);
			return { ask: rng.next() < 0.5 ? 'totale' : rng.pick(ls), case: 'controllo', factors: [m] };
		}
		case 4: {
			const u = rng.next();
			const base = u < 0.55 ? q(rng.pick([2, 3, 5])) : u < 0.8 ? q(rng.pick([-2, -3])) : rng.pick([q(1, 2), q(2, 3), q(1, 3), q(-1, 2), q(3, 2)]);
			const n = Math.abs(base.num) === 2 && base.den === 1 ? rng.int(2, 4) : rng.int(2, 3);
			const ls = pickLetters(rng, fam, rng.pick([1, 2, 2, 3]));
			const e = randomExps(rng, ls, 1, 6);
			const total = rng.next() < 0.75;
			return { ask: total ? 'totale' : rng.pick(ls), case: total ? 'totale' : 'rispetto a una lettera', factors: [mono(ratPow(base, n), e)], coefPow: { base, n } };
		}
		case 5: {
			const k = rng.next() < 0.6 ? 2 : 3;
			const factors: Mono[] = [];
			for (let i = 0; i < k; i++) {
				const ls = pickLetters(rng, fam, rng.pick([1, 1, 2]));
				const c = i === 0 ? q(nonZero(rng, -9, 9, [1, -1])) : rng.next() < 0.5 ? q(1) : q(nonZero(rng, -5, 5));
				factors.push(mono(c, randomExps(rng, ls, 1, 4)));
			}
			const count = (v: string) => factors.filter((f) => expOf(f, v) > 0).length;
			const repeated = fam.filter((v) => count(v) >= 2);
			if (repeated.length === 0) return null;
			const total = rng.next() < 0.6;
			return { ask: total ? 'totale' : rng.pick(repeated), case: total ? 'totale' : 'rispetto a una lettera', factors };
		}
		case 6: {
			const u = rng.next();
			const op: Op = u < 0.3 ? 'prodotto' : u < 0.65 ? 'quoziente' : 'potenza';
			if (op === 'potenza') {
				const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
				const c = rng.next() < 0.2 ? rng.pick([q(1, 2), q(-1, 2), q(2, 3)]) : q(nonZero(rng, -3, 3));
				return { ask: 'totale', case: op, op, n: rng.int(2, 4), factors: [mono(c, randomExps(rng, ls, 1, 4))] };
			}
			const A = mono(q(nonZero(rng, -9, 9, [1, -1])), randomExps(rng, pickLetters(rng, fam, rng.pick([2, 2, 3])), 1, 5));
			if (op === 'prodotto') {
				const B = mono(q(nonZero(rng, -9, 9, [1, -1])), randomExps(rng, pickLetters(rng, fam, rng.pick([1, 2, 2])), 1, 5));
				return { ask: 'totale', case: op, op, factors: [A, B] };
			}
			// quotient: the divisor has exponents at most those of the dividend
			const eB: Record<string, number> = {};
			for (const v of letters(A)) eB[v] = rng.int(0, A.e[v]);
			const b = rng.pick([2, 3, -2, -3, 4, -4]);
			const Aq = mono(q(b * rng.int(1, 5) * rng.pick([1, -1])), { ...A.e });
			const B = mono(q(b), eB);
			return { ask: 'totale', case: op, op, factors: [Aq, B] };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Semantics

/** The monomial whose degree is asked, in normal form. */
function target(b: Built): Mono {
	if (b.op === 'potenza') return pow(b.factors[0], b.n!);
	if (b.op === 'quoziente') {
		const r = div(b.factors[0], b.factors[1]);
		if (!r) throw new Error(`${ID}: quotient is not a monomial`);
		return r;
	}
	return b.factors.reduce((acc, f) => mul(acc, f), mono(1));
}

function answerOf(b: Built): number {
	const m = target(b);
	return b.ask === 'totale' ? degree(m)! : expOf(m, b.ask);
}

function coefPowLatex(base: Rational, n: number): string {
	const s = base.toLatex();
	return `${base.sign() < 0 || !base.isInteger() ? wrap(s) : s}^${n}`;
}

function problemLatex(b: Built): string {
	if (b.op === 'potenza') return `${wrap(monoLatex(b.factors[0]))}^${b.n}`;
	if (b.op === 'quoziente') return `${factorLatex(b.factors[0], true)} : ${factorLatex(b.factors[1], true)}`;
	if (b.op === 'prodotto') return `${factorLatex(b.factors[0], true)}\\cdot${factorLatex(b.factors[1], true)}`;
	if (b.coefPow) return coefPowLatex(b.coefPow.base, b.coefPow.n) + literalLatex(b.factors[0].e);
	return b.factors.map((f, i) => (i === 0 ? monoLatex(f) : factorLatex(f))).join(' \\cdot ');
}

function promptOf(b: Built): string {
	if (b.op) return "Calcola il grado del risultato dell'operazione.";
	if (b.ask === 'totale') return 'Calcola il grado complessivo del monomio.';
	return `Calcola il grado del monomio rispetto alla lettera ${b.ask}.`;
}

// ---------------------------------------------------------------------------
// Steps

function degreeSteps(m: Mono, ask: string): string[] {
	const out: string[] = [];
	const ls = letters(m);
	if (ask !== 'totale') {
		const n = expOf(m, ask);
		if (n === 0) {
			out.push(`\\text{La lettera } ${ask} \\text{ non compare nel monomio, cioè compare con esponente } 0\\text{: } ${ask}^0 = 1`);
		} else if (n === 1) {
			out.push(`\\text{La lettera } ${ask} \\text{ è scritta senza esponente: il suo esponente è } 1`);
		} else {
			out.push(`\\text{Nel monomio } ${monoLatex(m)} \\text{ la lettera } ${ask} \\text{ ha esponente } ${n}`);
		}
		out.push(`\\text{Grado rispetto ${prep(ask)} } ${ask}\\text{: } ${n}`);
		return out;
	}
	if (ls.length === 0) {
		out.push(`\\text{Un numero diverso da zero è un monomio senza lettere: } ${monoLatex(m)} = ${monoLatex(m)}x^0`);
		out.push(`\\text{Grado complessivo: } 0`);
		return out;
	}
	const parts = ls.map((v, i) => `\\text{${i === 0 ? 'Grado rispetto' : 'rispetto'} ${prep(v)} } ${v}\\text{: } ${m.e[v]}`);
	if (ls.length > 1) out.push(parts.join('\\text{; }'));
	if (ls.some((v) => m.e[v] === 1)) out.push(`\\text{Una lettera scritta senza esponente ha esponente } 1`);
	if (!m.c.abs().isOne()) out.push(`\\text{Il coefficiente } ${m.c.toLatex()} \\text{ non entra nel grado}`);
	out.push(ls.length === 1 ? `\\text{Grado complessivo: } ${degree(m)}` : `\\text{Grado complessivo: } ${ls.map((v) => m.e[v]).join(' + ')} = ${degree(m)}`);
	return out;
}

function steps(b: Built): string[] {
	const m = target(b);
	if (b.op) {
		const [A, B] = b.factors;
		const dA = degree(A)!;
		const out: string[] = [];
		if (b.op === 'prodotto') {
			const dB = degree(B)!;
			out.push(`\\text{I fattori hanno grado } ${dA} \\text{ e } ${dB}`);
			out.push(`\\text{Nel prodotto i gradi si sommano: } ${dA} + ${dB} = ${dA + dB}`);
		} else if (b.op === 'quoziente') {
			const dB = degree(B)!;
			out.push(`\\text{Il dividendo ha grado } ${dA} \\text{, il divisore } ${dB}`);
			out.push(`\\text{Nel quoziente i gradi si sottraggono: } ${dA} - ${dB} = ${dA - dB}`);
		} else {
			out.push(`\\text{La base ha grado } ${dA}`);
			out.push(`\\text{Nella potenza il grado si moltiplica per l'esponente: } ${dA} \\cdot ${b.n} = ${dA * b.n!}`);
		}
		out.push(`\\text{Infatti: } ${problemLatex(b)} = ${monoLatex(m)}`);
		return out;
	}
	const out: string[] = [];
	if (b.coefPow) {
		const { base, n } = b.coefPow;
		out.push(`\\text{L'esponente } ${n} \\text{ appartiene al coefficiente: } ${coefPowLatex(base, n)} = ${ratPow(base, n).toLatex()}`);
		out.push(`\\text{Il monomio è } ${monoLatex(m)}`);
	} else if (b.factors.length > 1) {
		out.push(`\\text{Riduci a forma normale: } ${problemLatex(b)} = ${monoLatex(m)}`);
	}
	return [...out, ...degreeSteps(m, b.ask)];
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

function assemble(b: Built, level: number, seed: number): Sample {
	const d = answerOf(b);
	const what = b.ask === 'totale' ? 'Grado complessivo' : `\\text{Grado rispetto ${prep(b.ask)} } ${b.ask}`;
	return {
		generatorId: ID,
		level,
		seed,
		prompt: promptOf(b),
		problem: problemLatex(b),
		solution: b.ask === 'totale' ? `\\text{${what}: } ${d}` : `${what}\\text{: } ${d}`,
		steps: steps(b),
		answer: { kind: 'number', value: String(d) },
		params: {
			ask: b.ask,
			case: b.case,
			factors: b.factors.map(monoJSON),
			...(b.coefPow ? { coefPow: { base: b.coefPow.base.toString(), n: b.coefPow.n } } : {}),
			...(b.op ? { op: b.op } : {}),
			...(b.n ? { n: b.n } : {}),
			degree: d,
		},
	};
}

function parseBuilt(p: Record<string, unknown>): Built | null {
	if (!Array.isArray(p.factors) || typeof p.ask !== 'string') return null;
	const factors = p.factors.map(monoFromJSON);
	if (factors.some((f) => f === null)) return null;
	const cp = p.coefPow as { base?: string; n?: number } | undefined;
	return {
		ask: p.ask,
		case: String(p.case),
		factors: factors as Mono[],
		coefPow: cp && typeof cp.base === 'string' && typeof cp.n === 'number' ? { base: Rational.parse(cp.base), n: cp.n } : undefined,
		op: p.op as Op | undefined,
		n: typeof p.n === 'number' ? p.n : undefined,
	};
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.params);
	if (!b) return ['params non validi'];
	v.push(...forbidden(sample.problem));
	let d: number;
	try {
		d = answerOf(b);
	} catch (e) {
		return [(e as Error).message];
	}
	if (sample.answer.kind !== 'number' || sample.answer.value !== String(d)) v.push(`risposta diversa dal grado ${d}`);
	const m = target(b);
	if (m.c.isZero()) v.push('monomio nullo');
	const maxExp = Math.max(0, ...Object.values(m.e));
	if (maxExp > 16) v.push('esponente troppo grande');
	const single = b.factors.length === 1 && !b.op;
	switch (sample.level) {
		case 1:
			if (!single || b.coefPow || b.ask === 'totale' || expOf(m, b.ask) === 0) v.push('serve il grado rispetto a una lettera presente');
			if (b.case !== (expOf(m, b.ask) === 1 ? 'esponente sottinteso' : 'esponente scritto')) v.push('case non coerente');
			if (letters(m).length < 2) v.push('servono almeno due lettere');
			break;
		case 2:
			if (!single || b.coefPow || b.ask !== 'totale' || letters(m).length < 2) v.push('serve il grado complessivo di un monomio con almeno due lettere');
			if (b.case !== (letters(m).some((l) => m.e[l] === 1) ? 'con esponente sottinteso' : 'esponenti tutti scritti')) v.push('case non coerente');
			break;
		case 3: {
			if (!single || b.coefPow) v.push('serve un monomio in forma normale');
			const kind = letters(m).length === 0 ? 'costante' : b.ask !== 'totale' && expOf(m, b.ask) === 0 ? 'lettera assente' : 'controllo';
			if (b.case !== kind) v.push(`case ${b.case} ma l'esercizio è ${kind}`);
			break;
		}
		case 4:
			if (!b.coefPow || !single || letters(m).length === 0) v.push('serve un coefficiente scritto come potenza');
			break;
		case 5: {
			if (b.factors.length < 2 || b.op || b.coefPow) v.push('serve un prodotto da ridurre a forma normale');
			const rep = letters(m).some((l) => b.factors.filter((f) => expOf(f, l) > 0).length >= 2);
			if (!rep) v.push('serve una lettera ripetuta');
			if (b.ask !== 'totale' && b.factors.filter((f) => expOf(f, b.ask) > 0).length < 2) v.push('la lettera chiesta deve essere ripetuta');
			break;
		}
		case 6:
			if (!b.op || b.ask !== 'totale' || b.case !== b.op) v.push("serve un'operazione tra monomi");
			if (b.op === 'quoziente' && (degree(m) ?? 0) < 1) v.push('il quoziente deve avere grado almeno 1');
			if (b.op === 'quoziente' && letters(b.factors[1]).length === 0) v.push('il divisore deve avere lettere');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.params)!;
	const m = target(b);
	const d = answerOf(b);
	const c: number[] = [];
	const ls = letters(m);
	const exps = ls.map((v) => m.e[v]);
	const total = degree(m)!;
	if (b.op) {
		const [A, B] = b.factors;
		const dA = degree(A)!;
		if (b.op === 'prodotto') c.push(dA * degree(B)!, Math.max(dA, degree(B)!));
		if (b.op === 'quoziente') c.push(dA + degree(B)!, dA);
		if (b.op === 'potenza') c.push(dA + b.n!, dA, b.n!);
	} else if (b.ask === 'totale') {
		if (b.coefPow) c.push(total + b.coefPow.n);
		if (b.factors.length > 1) {
			// each letter read once, with its first exponent; or the highest exponent per letter
			const first = (v: string) => expOf(b.factors.find((f) => expOf(f, v) > 0)!, v);
			c.push(ls.reduce((s, v) => s + first(v), 0));
			c.push(ls.reduce((s, v) => s + Math.max(...b.factors.map((f) => expOf(f, v))), 0));
		}
		if (ls.length === 0) c.push(1);
		c.push(exps.filter((n) => n > 1).reduce((s, n) => s + n, 0)); // the letter without exponent counts 0
		c.push(Math.max(0, ...exps));
		c.push(ls.length);
	} else {
		const n = expOf(m, b.ask);
		if (b.factors.length > 1) {
			const fs = b.factors.map((f) => expOf(f, b.ask)).filter((k) => k > 0);
			c.push(fs[0], Math.max(...fs), fs.reduce((p, k) => p * k, 1));
		}
		if (n === 0) c.push(1, total);
		if (n === 1) c.push(0);
		c.push(total);
		for (const v of ls) if (v !== b.ask) c.push(m.e[v]);
		if (b.coefPow) c.push(n + b.coefPow.n);
	}
	const cands = c.filter((k) => Number.isInteger(k) && k >= 0).map(numOpt);
	const fallback = (i: number) => {
		const k = d + (i % 2 === 1 ? Math.ceil(i / 2) : -Math.ceil(i / 2));
		return k >= 0 ? numOpt(k) : null;
	};
	return buildChoice(numOpt(d), cands, fallback, rng);
}

export const monomiGrado: Generator = {
	id: ID,
	title: 'Grado di un monomio',
	levels: {
		1: { label: 'Grado rispetto a una lettera', constraints: ['monomio in forma normale con 2 o 3 lettere', 'la lettera chiesta compare; circa un terzo delle volte ha esponente 1 sottinteso'] },
		2: { label: 'Grado complessivo', constraints: ['monomio in forma normale con 2 o 3 lettere, coefficiente intero o frazionario', 'circa 6 su 10 hanno una lettera senza esponente'] },
		3: { label: 'Lettere assenti e costanti', constraints: ['circa 4 su 10: grado rispetto a una lettera che non compare (0)', 'circa 2,5 su 10: grado di una costante (0)', 'gli altri: grado ordinario, perché la risposta non sia sempre 0'] },
		4: { label: 'Esponente nel coefficiente', constraints: ['coefficiente scritto come potenza, come 2^3x^2', "l'esponente del coefficiente non entra nel grado"] },
		5: { label: 'Monomio non in forma normale', constraints: ['prodotto di 2 o 3 fattori con almeno una lettera ripetuta', 'si riduce a forma normale e poi si legge il grado'] },
		6: { label: "Grado del risultato di un'operazione", constraints: ['prodotto (circa 3 su 10), quoziente (3,5 su 10) o potenza (3,5 su 10)', 'si sommano, sottraggono o moltiplicano i gradi'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample = assemble(b, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default monomiGrado;
