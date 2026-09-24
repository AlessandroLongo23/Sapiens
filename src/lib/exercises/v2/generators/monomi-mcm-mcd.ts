/**
 * MCD e MCM tra monomi. Spec: specs/exercises/monomi-mcm-mcd.md
 *
 * Five levels in the order of the lesson, each adding one difficulty: two monomials with the
 * same letters, letters that are not common, negative coefficients, three monomials,
 * fractional coefficients. Each exercise asks for the MCD or the MCM (about half each).
 *
 * Coefficient convention of the lesson: with all integer coefficients, the MCD (MCM) of their
 * absolute values; with at least one fraction, 1. Always positive. Letters: common ones with the
 * lowest exponent for the MCD, all of them with the highest exponent for the MCM.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	buildChoice,
	expOf,
	forbidden,
	letters,
	mono,
	monoEquals,
	monoFromJSON,
	monoJSON,
	monoLatex,
	monoOpt,
	monoSympy,
	nearMono,
	neg,
	pickLetters,
	randomFraction,
	similar,
} from '../monomi';

export const ID = 'monomi-mcm-mcd';

type Kind = 'MCD' | 'MCM';

interface Built {
	kind: Kind;
	ms: Mono[];
}

// ---------------------------------------------------------------------------
// The rule of the lesson

const allLetters = (ms: Mono[]) => [...new Set(ms.flatMap(letters))].sort();
const common = (ms: Mono[]) => allLetters(ms).filter((v) => ms.every((m) => expOf(m, v) > 0));
const intCoefs = (ms: Mono[]) => ms.every((m) => m.c.isInteger());

function coefOf(ms: Mono[], kind: Kind): Rational {
	if (!intCoefs(ms)) return q(1);
	const abs = ms.map((m) => Math.abs(m.c.num));
	return q(kind === 'MCD' ? abs.reduce(gcd) : abs.reduce(lcm));
}

function mcd(ms: Mono[]): Mono {
	const e: Record<string, number> = {};
	for (const v of common(ms)) e[v] = Math.min(...ms.map((m) => expOf(m, v)));
	return mono(coefOf(ms, 'MCD'), e);
}

function mcm(ms: Mono[]): Mono {
	const e: Record<string, number> = {};
	for (const v of allLetters(ms)) e[v] = Math.max(...ms.map((m) => expOf(m, v)));
	return mono(coefOf(ms, 'MCM'), e);
}

const resultOf = (b: Built) => (b.kind === 'MCD' ? mcd(b.ms) : mcm(b.ms));

// ---------------------------------------------------------------------------
// Construction

function randomExps(rng: Rng, ls: string[]): Record<string, number> {
	const e: Record<string, number> = {};
	for (const v of ls) e[v] = rng.int(1, 6);
	return e;
}

/** Positive integer coefficients with a common factor g, each at most 40 (30 with three monomials), MCM at most 360. */
function intCoefList(rng: Rng, k: number, gMin = 1): number[] {
	for (;;) {
		const g = rng.int(gMin, 6);
		const max = k === 2 ? 40 : 30;
		const cs = Array.from({ length: k }, () => g * rng.int(1, Math.min(6, Math.floor(max / g))));
		if (cs.reduce(lcm) <= 360) return cs;
	}
}

/** Letter sets for k monomials, not all equal; `disjoint` asks for no letter common to all. */
function letterSets(rng: Rng, fam: readonly string[], k: number, disjoint: boolean): string[][] {
	for (;;) {
		const sets = Array.from({ length: k }, () => pickLetters(rng, fam, rng.int(1, 3)));
		const keys = new Set(sets.map((s) => s.join('')));
		if (keys.size === 1) continue;
		const inAll = fam.filter((v) => sets.every((s) => s.includes(v)));
		if (disjoint === (inAll.length === 0)) return sets;
	}
}

function build(rng: Rng, level: number): Built | null {
	const fam = rng.pick(FAMILIES);
	const kind: Kind = rng.int(0, 1) ? 'MCD' : 'MCM';
	let ms: Mono[];
	switch (level) {
		case 1: {
			const ls = pickLetters(rng, fam, rng.int(2, 3));
			const cs = intCoefList(rng, 2, 2);
			ms = cs.map((c) => mono(c, randomExps(rng, ls)));
			break;
		}
		case 2:
		case 3: {
			const disjoint = rng.next() < 0.2;
			let sets: string[][];
			if (level === 3 && rng.next() < 0.5) {
				const s = pickLetters(rng, fam, 2);
				sets = [s, s];
			} else {
				sets = letterSets(rng, fam, 2, disjoint);
			}
			const cs = intCoefList(rng, 2, disjoint ? 2 : 1);
			ms = cs.map((c, i) => mono(c, randomExps(rng, sets[i])));
			if (level === 3) {
				const u = rng.next();
				ms = ms.map((m, i) => ((u < 0.35 && i === 0) || (u >= 0.35 && u < 0.7 && i === 1) || u >= 0.7 ? neg(m) : m));
			}
			break;
		}
		case 4: {
			const sets = letterSets(rng, fam, 3, rng.next() < 0.2);
			const cs = intCoefList(rng, 3, 2);
			ms = cs.map((c, i) => mono(rng.next() < 0.25 ? -c : c, randomExps(rng, sets[i])));
			break;
		}
		case 5: {
			const k = rng.next() < 0.5 ? 2 : 3;
			const sets = rng.next() < 0.5 ? letterSets(rng, fam, k, false) : Array.from({ length: k }, () => pickLetters(rng, fam, 2));
			ms = sets.map((s) => mono(rng.next() < 0.7 ? randomFraction(rng, 9, 8) : q(rng.int(1, 12) * (rng.next() < 0.25 ? -1 : 1)), randomExps(rng, s)));
			if (intCoefs(ms)) return null;
			break;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
	return { kind, ms };
}

// ---------------------------------------------------------------------------
// Steps

const listLatex = (xs: string[]) => (xs.length === 2 ? `${xs[0]} \\text{ e } ${xs[1]}` : `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`);

function steps(b: Built, r: Mono): string[] {
	const { ms, kind } = b;
	const out: string[] = [];
	if (intCoefs(ms)) {
		const abs = ms.map((m) => Math.abs(m.c.num));
		const negs = ms.some((m) => m.c.sign() < 0);
		out.push(
			`\\text{Coefficienti interi${negs ? ', con i valori assoluti' : ''}: } \\text{${kind}}(${abs.join(',\\ ')}) = ${coefOf(ms, kind).toLatex()}`,
		);
	} else {
		out.push(`\\text{C'è almeno un coefficiente frazionario: il coefficiente del ${kind} è } 1`);
	}
	const inAll = common(ms);
	for (const v of allLetters(ms)) {
		const with_ = ms.filter((m) => expOf(m, v) > 0);
		const es = with_.map((m) => `${m.e[v]}`);
		if (kind === 'MCD') {
			if (!inAll.includes(v)) {
				const missing = ms.find((m) => expOf(m, v) === 0)!;
				out.push(`\\text{Lettera } ${v}\\text{: manca in } ${monoLatex(missing)}\\text{, quindi non entra nel MCD}`);
			} else {
				out.push(`\\text{Lettera } ${v}\\text{: esponenti } ${listLatex(es)}\\text{, il minimo è } ${r.e[v]}`);
			}
		} else if (with_.length === 1) {
			out.push(`\\text{Lettera } ${v}\\text{: compare solo in } ${monoLatex(with_[0])} \\text{ con esponente } ${with_[0].e[v]}`);
		} else {
			out.push(`\\text{Lettera } ${v}\\text{: esponenti } ${listLatex(es)}\\text{, il massimo è } ${r.e[v]}`);
		}
	}
	if (kind === 'MCD' && inAll.length === 0) out.push(`\\text{Nessuna lettera è comune a tutti i monomi: il MCD è solo un numero}`);
	out.push(`\\text{${kind}} = ${monoLatex(r)}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

function problemLatex(ms: Mono[]): string {
	return ms.map(monoLatex).join(',\\quad ');
}

function assemble(b: Built, level: number, seed: number): Sample {
	const r = resultOf(b);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: `Calcola il ${b.kind} dei monomi.`,
		problem: problemLatex(b.ms),
		solution: `\\text{${b.kind}} = ${monoLatex(r)}`,
		steps: steps(b, r),
		answer: { kind: 'expression', value: monoSympy(r), latex: monoLatex(r) },
		params: { case: b.kind, monomials: b.ms.map(monoJSON), result: monoJSON(r) },
	};
}

function parseBuilt(p: Record<string, unknown>): Built | null {
	if ((p.case !== 'MCD' && p.case !== 'MCM') || !Array.isArray(p.monomials)) return null;
	const ms = p.monomials.map(monoFromJSON);
	if (ms.some((m) => !m)) return null;
	return { kind: p.case, ms: ms as Mono[] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.params);
	if (!b) return ['params non validi'];
	const { ms } = b;
	v.push(...forbidden(sample.problem));
	const r = resultOf(b);
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== monoSympy(r) || a.latex !== monoLatex(r)) v.push('risposta diversa dal risultato');
	for (const m of ms) {
		if (m.c.isZero() || letters(m).length === 0) v.push('monomio nullo o senza lettere');
		if (Math.abs(m.c.num) > 60 || m.c.den > 9) v.push(`coefficiente fuori intervallo: ${m.c}`);
	}
	for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) if (monoEquals(ms[i], ms[j]) || similar(ms[i], ms[j])) v.push('monomi simili nel testo');
	if (r.c.num > 360) v.push('coefficiente del risultato troppo grande');
	if (ms.some((m) => Math.abs(m.c.num) > 40)) v.push('coefficiente oltre 40');
	if (b.kind === 'MCD' && r.c.isOne() && letters(r).length === 0) v.push('MCD uguale a 1');
	if (intCoefs(ms) && new Set(ms.map((m) => Math.abs(m.c.num))).size !== ms.length) v.push('coefficienti uguali in valore assoluto');
	const sameLetters = new Set(ms.map((m) => letters(m).join(''))).size === 1;
	const pos = ms.every((m) => m.c.sign() > 0);
	switch (sample.level) {
		case 1:
			if (ms.length !== 2 || !sameLetters || !pos || !intCoefs(ms)) v.push('servono due monomi con le stesse lettere e coefficienti interi positivi');
			if (ms.some((m) => m.c.isOne())) v.push('coefficiente 1 al livello 1');
			break;
		case 2:
			if (ms.length !== 2 || sameLetters || !pos || !intCoefs(ms)) v.push('servono due monomi con lettere non tutte comuni e coefficienti interi positivi');
			break;
		case 3:
			if (ms.length !== 2 || pos || !intCoefs(ms)) v.push('servono due monomi a coefficienti interi, almeno uno negativo');
			break;
		case 4:
			if (ms.length !== 3 || !intCoefs(ms)) v.push('servono tre monomi a coefficienti interi');
			break;
		case 5:
			if (ms.length < 2 || ms.length > 3 || intCoefs(ms)) v.push('servono 2 o 3 monomi, almeno un coefficiente frazionario');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.params)!;
	const { ms, kind } = b;
	const r = resultOf(b);
	const other = kind === 'MCD' ? mcm(ms) : mcd(ms);
	const all = allLetters(ms);
	const inAll = common(ms);
	const pick = (letterList: string[], f: (xs: number[]) => number) =>
		Object.fromEntries(letterList.map((v) => [v, f(ms.map((m) => expOf(m, v)).filter((e) => e > 0))]));
	const cands: (Opt | null)[] = [monoOpt(other)];
	if (kind === 'MCD') {
		if (inAll.length < all.length) cands.push(monoOpt(mono(r.c, pick(all, (xs) => Math.min(...xs))))); // non-common letters taken
		cands.push(monoOpt(mono(r.c, pick(inAll, (xs) => Math.max(...xs))))); // max instead of min
		cands.push(monoOpt(mono(other.c, { ...r.e }))); // coefficient of the MCM
	} else {
		if (inAll.length < all.length) cands.push(monoOpt(mono(r.c, pick(inAll, (xs) => Math.max(...xs))))); // only common letters
		cands.push(monoOpt(mono(r.c, pick(all, (xs) => Math.min(...xs))))); // min instead of max
		if (intCoefs(ms)) cands.push(monoOpt(mono(ms.reduce((p, m) => p.mul(m.c.abs()), q(1)), { ...r.e }))); // product of the coefficients
	}
	if (ms.some((m) => m.c.sign() < 0)) cands.push(monoOpt(neg(r)));
	if (!intCoefs(ms)) {
		// "MCD of the fractions": gcd of numerators over lcm of denominators, and the reverse for the MCM
		const nums = ms.map((m) => Math.abs(m.c.num));
		const dens = ms.map((m) => m.c.den);
		const c = kind === 'MCD' ? q(nums.reduce(gcd), dens.reduce(lcm)) : q(nums.reduce(lcm), dens.reduce(gcd));
		cands.push(monoOpt(mono(c, { ...r.e })));
	} else if (!r.c.isOne()) {
		cands.push(monoOpt(mono(1, { ...r.e }))); // coefficient forgotten
	}
	return buildChoice(monoOpt(r), cands, (i) => nearMono(r, i), rng);
}

export const monomiMcmMcd: Generator = {
	id: ID,
	title: 'MCD e MCM tra monomi',
	levels: {
		1: { label: 'Due monomi con le stesse lettere', constraints: ['coefficienti interi positivi da 2 a 60', 'MCD o MCM, circa metà e metà'] },
		2: { label: 'Lettere non comuni', constraints: ['due monomi con lettere non tutte comuni, coefficienti interi positivi', 'circa 2 su 10 senza lettere comuni (il MCD è un numero)'] },
		3: { label: 'Segni negativi', constraints: ['due monomi a coefficienti interi, almeno uno negativo', 'il risultato ha coefficiente positivo'] },
		4: { label: 'Tre monomi', constraints: ['tre monomi a coefficienti interi, a volte negativi'] },
		5: { label: 'Coefficienti frazionari', constraints: ['2 o 3 monomi, almeno un coefficiente frazionario', 'il coefficiente del MCD e del MCM è 1'] },
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

export default monomiMcmMcd;
