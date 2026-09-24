/**
 * Operazioni tra monomi. Spec: specs/exercises/monomi-operazioni.md
 *
 * Six levels in the order of the lesson, each adding one difficulty: algebraic sum of similar
 * monomials with integer coefficients, with fractional coefficients, a sum with monomials that
 * are not all similar (reduce only the similar ones), product, quotient, power. The answer is a
 * monomial (a polynomial at level 3) in normal form.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, ONE, lcm, q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	addSimilar,
	buildChoice,
	collect,
	div,
	expOf,
	factorLatex,
	forbidden,
	letters,
	literalKey,
	literalLatex,
	mono,
	monoFromJSON,
	monoJSON,
	monoLatex,
	monoOpt,
	mul,
	nearMono,
	neg,
	nonZero,
	numFactor,
	numSumLatex,
	pickLetters,
	polyLatex,
	polySympy,
	pow,
	randomFraction,
	shuffle,
	similar,
	wrap,
} from '../monomi';

export const ID = 'monomi-operazioni';

/** A term of an algebraic sum: `op` is the sign written before it, `m` the monomial. */
interface Term {
	op: 1 | -1;
	m: Mono;
}

interface Built {
	level: number;
	case: string;
	/** Levels 1-3. */
	terms?: Term[];
	/** Levels 4-6: factors of a product, dividend and divisor, base of a power. */
	factors?: Mono[];
	n?: number;
}

const MAX_EXP = 16;

// ---------------------------------------------------------------------------
// Random pieces

function randomExps(rng: Rng, ls: string[], lo: number, hi: number): Record<string, number> {
	const e: Record<string, number> = {};
	for (const v of ls) e[v] = rng.int(lo, hi);
	return e;
}

function randomLiteral(rng: Rng, fam: readonly string[], kMin = 1, kMax = 3, hi = 4): Record<string, number> {
	return randomExps(rng, pickLetters(rng, fam, rng.int(kMin, kMax)), 1, hi);
}

/** A literal part not similar to `e` but close to it: exponents swapped, a letter dropped or added, one exponent changed. */
function nearLiteral(rng: Rng, fam: readonly string[], e: Record<string, number>): Record<string, number> {
	const ls = Object.keys(e);
	const out = { ...e };
	const u = rng.next();
	if (u < 0.3 && ls.length >= 2 && e[ls[0]] !== e[ls[1]]) {
		[out[ls[0]], out[ls[1]]] = [e[ls[1]], e[ls[0]]];
	} else if (u < 0.55 && ls.length >= 2) {
		delete out[rng.pick(ls)];
	} else if (u < 0.75 && ls.length < fam.length) {
		out[rng.pick(fam.filter((v) => !ls.includes(v)))] = rng.int(1, 3);
	} else {
		const v = rng.pick(ls);
		out[v] = e[v] + (e[v] > 1 && rng.int(0, 1) ? -1 : 1);
	}
	return out;
}

const intCoef = (rng: Rng, max = 9) => q(nonZero(rng, -max, max));

// ---------------------------------------------------------------------------
// Construction

function build(rng: Rng, level: number): Built | null {
	const fam = rng.pick(FAMILIES);
	switch (level) {
		case 1: {
			const lit = randomExps(rng, pickLetters(rng, fam, rng.pick([1, 2, 2, 3])), 1, 4);
			const u = rng.next();
			if (u < 0.1) {
				const c = nonZero(rng, 1, 12);
				const a = mono(rng.int(0, 1) ? c : -c, lit);
				return { level, case: 'opposti', terms: [{ op: 1, m: a }, { op: 1, m: neg(a) }] };
			}
			const k = rng.next() < 0.6 ? 2 : 3;
			const terms: Term[] = [];
			for (let i = 0; i < k; i++) terms.push({ op: 1, m: mono(intCoef(rng, 12), lit) });
			if (u < 0.3) {
				// "3x - (-2x)": a negative monomial subtracted
				const i = rng.int(1, k - 1);
				if (terms[i].m.c.sign() > 0) terms[i] = { op: 1, m: neg(terms[i].m) };
				terms[i] = { op: -1, m: terms[i].m };
				return { level, case: 'meno davanti a un negativo', terms };
			}
			return { level, case: 'somma', terms };
		}
		case 2: {
			const lit = randomExps(rng, pickLetters(rng, fam, rng.pick([1, 2, 2, 3])), 1, 4);
			const k = rng.next() < 0.65 ? 2 : 3;
			const terms: Term[] = [];
			for (let i = 0; i < k; i++) {
				const c = rng.next() < 0.7 ? randomFraction(rng, 9, 6) : i === 0 ? intCoef(rng, 5) : rng.pick([q(1), q(-1), intCoef(rng, 5)]);
				terms.push({ op: 1, m: mono(c, lit) });
			}
			if (terms.every((t) => t.m.c.isInteger())) return null;
			return { level, case: k === 2 ? 'due termini' : 'tre termini', terms };
		}
		case 3: {
			const lit1 = randomLiteral(rng, fam, 1, 2, 3);
			const lit2 = nearLiteral(rng, fam, lit1);
			if (literalKey(lit1) === literalKey(lit2) || Object.keys(lit2).length === 0) return null;
			const k = rng.next() < 0.5 ? 3 : 4;
			// k terms, each literal part at least once, one of them at least twice
			const lits = [lit1, lit2, rng.int(0, 1) ? lit1 : lit2];
			if (k === 4) lits.push(rng.int(0, 1) ? lit1 : lit2);
			const terms: Term[] = shuffle(rng, lits).map((l) => ({ op: 1 as const, m: mono(intCoef(rng, 9), l) }));
			return { level, case: k === 3 ? 'tre termini' : 'quattro termini', terms };
		}
		case 4: {
			const k = rng.next() < 0.6 ? 2 : 3;
			const factors: Mono[] = [];
			for (let i = 0; i < k; i++) {
				const c = rng.next() < 0.3 ? randomFraction(rng, 9, 6) : intCoef(rng, k === 2 ? 9 : 5);
				factors.push(mono(c, randomExps(rng, pickLetters(rng, fam, rng.pick(k === 2 ? [1, 2, 2, 3] : [1, 1, 2])), 1, 4)));
			}
			return { level, case: k === 2 ? 'due fattori' : 'tre fattori', factors };
		}
		case 5: {
			// dividend = divisor · quotient, built backwards
			const frac = rng.next() < 0.35;
			const bl = pickLetters(rng, fam, rng.int(1, 3));
			const B = mono(frac ? randomFraction(rng, 5, 5) : q(nonZero(rng, -9, 9, [1, -1])), randomExps(rng, bl, 1, 4));
			const vanish = rng.next() < 0.4;
			const eQ: Record<string, number> = {};
			for (const v of fam) eQ[v] = bl.includes(v) || rng.next() < 0.4 ? rng.int(0, 4) : 0;
			if (vanish) eQ[rng.pick(bl)] = 0;
			else for (const v of bl) if (eQ[v] === 0) eQ[v] = rng.int(1, 3);
			const Q = mono(frac ? rng.pick([intCoef(rng, 6), randomFraction(rng, 5, 4)]) : intCoef(rng, 9), eQ);
			if (letters(Q).length === 0) return null;
			const A = mul(Q, B);
			return { level, case: vanish ? 'una lettera sparisce' : 'nessuna lettera sparisce', factors: [A, B] };
		}
		case 6: {
			const u = rng.next();
			const c = u < 0.3 ? randomFraction(rng, 3, 5) : u < 0.4 ? q(rng.pick([1, -1])) : q(nonZero(rng, -5, 5, [1, -1]));
			const small = c.abs().equals(q(2)) || c.abs().isOne() || c.abs().equals(q(1, 2));
			const n = small ? rng.pick([2, 3, 4]) : rng.pick([2, 3]);
			const base = mono(c, randomExps(rng, pickLetters(rng, fam, rng.pick([1, 2, 2, 3])), 1, 4));
			return { level, case: n % 2 === 0 ? 'esponente pari' : 'esponente dispari', factors: [base], n };
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Semantics and LaTeX

const termValue = (t: Term): Mono => (t.op === 1 ? t.m : neg(t.m));

/** The result, collected; a single monomial except at level 3. */
function result(b: Built): Mono[] {
	if (b.terms) return collect(b.terms.map(termValue));
	const f = b.factors!;
	if (b.level === 4) return collect([f.reduce((acc, m) => mul(acc, m), mono(1))]);
	if (b.level === 5) {
		const r = div(f[0], f[1]);
		if (!r) throw new Error(`${ID}: quotient is not a monomial`);
		return collect([r]);
	}
	return collect([pow(f[0], b.n!)]);
}

function sumProblemLatex(terms: Term[]): string {
	return terms
		.map((t, i) => {
			const s = monoLatex(t.m);
			const negM = t.m.c.sign() < 0;
			if (i === 0) return s;
			if (t.op === -1) return negM ? ` - ${factorLatex(t.m)}` : ` - ${s}`;
			return negM ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

function problemLatex(b: Built): string {
	if (b.terms) return sumProblemLatex(b.terms);
	const f = b.factors!;
	if (b.level === 4) return f.map((m) => factorLatex(m, true)).join('\\cdot');
	if (b.level === 5) return `${factorLatex(f[0], true)} : ${factorLatex(f[1], true)}`;
	return `${wrap(monoLatex(f[0]))}^${b.n}`;
}

const PROMPTS: Record<number, string> = {
	1: 'Calcola la somma algebrica dei monomi.',
	2: 'Calcola la somma algebrica dei monomi.',
	3: 'Riduci i monomi simili.',
	4: 'Calcola il prodotto.',
	5: 'Calcola il quoziente.',
	6: 'Calcola la potenza.',
};

/** "(3 - 5)\,x^2y": the coefficients in parentheses, then the literal part. */
function coefGroup(cs: Rational[], lit: string): string {
	const inner = numSumLatex(cs);
	return `${wrap(inner)}\\,${lit}`;
}

/** Fractions written over a common denominator, not reduced: \frac{8}{12}. */
function overDen(c: Rational, L: number, first: boolean): string {
	const n = (c.num * L) / c.den;
	const body = `\\frac{${Math.abs(n)}}{${L}}`;
	if (first) return (n < 0 ? '-' : '') + body;
	return n < 0 ? ` - ${body}` : ` + ${body}`;
}

function sumSteps(b: Built, res: Mono[]): string[] {
	const out: string[] = [];
	const terms = b.terms!;
	const values = terms.map(termValue);
	let current = sumProblemLatex(terms);
	if (terms.some((t) => t.op === -1)) {
		const plain = sumProblemLatex(values.map((m) => ({ op: 1, m })));
		out.push(`\\text{Sottrarre un monomio vuol dire sommare il suo opposto: } ${current} = ${plain}`);
		current = plain;
	}
	if (b.level === 3) {
		// group the similar terms, in order of first appearance
		const groups: Mono[][] = [];
		for (const m of values) {
			const g = groups.find((gr) => similar(gr[0], m));
			if (g) g.push(m);
			else groups.push([m]);
		}
		const grouped = groups.flat();
		if (grouped.some((m, i) => m !== values[i])) {
			const g = sumProblemLatex(grouped.map((m) => ({ op: 1, m })));
			out.push(`\\text{Metti vicini i monomi simili: } ${current} = ${g}`);
			current = g;
		}
		const middle = groups
			.map((g, i) => {
				if (g.length === 1) {
					const s = monoLatex(g[0]);
					return i === 0 ? s : g[0].c.sign() < 0 ? ` - ${s.slice(1)}` : ` + ${s}`;
				}
				const s = coefGroup(
					g.map((m) => m.c),
					literalLatex(g[0].e),
				);
				return i === 0 ? s : ` + ${s}`;
			})
			.join('');
		out.push(`\\text{Somma i coefficienti dei monomi simili: } ${current} = ${middle} = ${polyLatex(res)}`);
		const lits = groups.map((g) => literalLatex(g[0].e));
		out.push(`\\text{I monomi } ${lits[0]} \\text{ e } ${lits[1]} \\text{ non sono simili: il risultato resta un polinomio}`);
		return out;
	}
	const cs = values.map((m) => m.c);
	const lit = literalLatex(values[0].e);
	const r = res.length ? monoLatex(res[0]) : '0';
	if (cs.every((c) => c.isInteger())) {
		out.push(`\\text{Somma i coefficienti, la parte letterale resta uguale: } ${current} = ${coefGroup(cs, lit)} = ${r}`);
	} else {
		const L = cs.reduce((acc, c) => lcm(acc, c.den), 1);
		const common = wrap(cs.map((c, i) => overDen(c, L, i === 0)).join(''));
		out.push(`\\text{Somma i coefficienti, la parte letterale resta uguale: } ${current} = ${coefGroup(cs, lit)}`);
		out.push(`\\text{Riduci allo stesso denominatore, } ${L}\\text{: } ${coefGroup(cs, lit)} = ${common}\\,${lit} = ${r}`);
	}
	if (res.length === 0) out.push(`\\text{I monomi sono opposti: il risultato è il monomio nullo}`);
	return out;
}

/** "x^{3+1}y^{1+2}": for each letter the exponents of the factors that contain it, joined by `sep`. */
function exponentLatex(ms: Mono[], sep: string, keepZero = false): string {
	const ls = [...new Set(ms.flatMap(letters))].sort();
	return ls
		.map((v) => {
			const es = ms.map((m) => expOf(m, v)).filter((e, i) => e > 0 || (keepZero && i > 0 && expOf(ms[0], v) > 0));
			if (es.length === 1) return literalLatex({ [v]: es[0] });
			return `${v}^{${es.join(sep)}}`;
		})
		.join('');
}

function opSteps(b: Built, res: Mono): string[] {
	const f = b.factors!;
	const out: string[] = [];
	const problem = problemLatex(b);
	if (b.level === 4) {
		const cs = f.map((m) => m.c);
		const inner = cs.map((c, i) => (i === 0 ? c.toLatex() : numFactor(c))).join(' \\cdot ');
		out.push(
			`\\text{Moltiplica i coefficienti e somma gli esponenti di ogni lettera: } ${problem} = ${wrap(inner)}\\,${exponentLatex(f, '+')} = ${monoLatex(res)}`,
		);
		const neg = cs.filter((c) => c.sign() < 0).length;
		if (neg > 0) out.push(`\\text{I segni meno sono } ${neg}\\text{: il coefficiente è ${neg % 2 === 0 ? 'positivo' : 'negativo'}}`);
		return out;
	}
	if (b.level === 5) {
		const [A, B] = f;
		const frac = !A.c.isInteger() || !B.c.isInteger();
		if (frac) out.push(`\\text{Dividere per } ${B.c.toLatex()} \\text{ equivale a moltiplicare per il reciproco } ${ONE.div(B.c).toLatex()}`);
		const coef = frac ? wrap(`${A.c.toLatex()}\\cdot${numFactor(ONE.div(B.c))}`) : wrap(`${A.c.toLatex()} : ${numFactor(B.c)}`);
		out.push(`\\text{Dividi i coefficienti e sottrai gli esponenti di ogni lettera: } ${problem} = ${coef}\\,${exponentLatex([A, B], '-', true)} = ${monoLatex(res)}`);
		const gone = letters(A).filter((v) => expOf(res, v) === 0);
		for (const v of gone) out.push(`\\text{La lettera } ${v} \\text{ sparisce, perché } ${v}^{${A.e[v]}-${B.e[v]}} = ${v}^0 = 1`);
		return out;
	}
	const [base] = f;
	const n = b.n!;
	const c = base.c;
	const coefPart = c.isOne() ? '' : `${c.sign() < 0 || !c.isInteger() ? wrap(c.toLatex()) : c.toLatex()}^${n}`;
	const lits = letters(base)
		.map((v) => `${v}^{${base.e[v]}\\cdot ${n}}`)
		.join('');
	out.push(`\\text{Eleva il coefficiente e moltiplica ogni esponente per } ${n}\\text{: } ${problemLatex(b)} = ${coefPart}${coefPart ? ' ' : ''}${lits} = ${monoLatex(res)}`);
	if (c.sign() < 0) out.push(`\\text{L'esponente } ${n} \\text{ è ${n % 2 === 0 ? 'pari: il risultato è positivo' : 'dispari: il risultato è negativo'}}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

function assemble(b: Built, seed: number): Sample {
	const res = result(b);
	const latex = polyLatex(res);
	return {
		generatorId: ID,
		level: b.level,
		seed,
		prompt: PROMPTS[b.level],
		problem: problemLatex(b),
		solution: `${problemLatex(b)} = ${latex}`,
		steps: b.terms ? sumSteps(b, res) : opSteps(b, res[0]),
		answer: { kind: 'expression', value: polySympy(res), latex },
		params: {
			case: b.case,
			...(b.terms ? { terms: b.terms.map((t) => ({ op: t.op, m: monoJSON(t.m) })) } : {}),
			...(b.factors ? { factors: b.factors.map(monoJSON) } : {}),
			...(b.n ? { n: b.n } : {}),
			result: res.map(monoJSON),
		},
	};
}

function parseBuilt(level: number, p: Record<string, unknown>): Built | null {
	const out: Built = { level, case: String(p.case) };
	if (Array.isArray(p.terms)) {
		const terms = p.terms.map((t: { op?: number; m?: unknown }) => ({ op: t.op === -1 ? -1 : 1, m: monoFromJSON(t.m) }));
		if (terms.some((t) => !t.m)) return null;
		out.terms = terms as Term[];
	}
	if (Array.isArray(p.factors)) {
		const fs = p.factors.map(monoFromJSON);
		if (fs.some((m) => !m)) return null;
		out.factors = fs as Mono[];
	}
	if (typeof p.n === 'number') out.n = p.n;
	return out.terms || out.factors ? out : null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.level, sample.params);
	if (!b) return ['params non validi'];
	v.push(...forbidden(sample.problem));
	let res: Mono[];
	try {
		res = result(b);
	} catch (e) {
		return [(e as Error).message];
	}
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== polySympy(res) || a.latex !== polyLatex(res)) v.push('risposta diversa dal risultato');
	v.push(...forbidden(polyLatex(res)).map((s) => `risposta: ${s}`));
	const all = [...(b.terms?.map((t) => t.m) ?? []), ...(b.factors ?? []), ...res];
	for (const m of all) {
		if (Math.max(0, ...Object.values(m.e)) > MAX_EXP) v.push('esponente troppo grande');
	}
	for (const m of [...(b.terms?.map((t) => t.m) ?? []), ...(b.factors ?? [])]) {
		if (m.c.isZero()) v.push('monomio nullo nel testo');
		if (Math.abs(m.c.num) > 100 || m.c.den > 12) v.push(`coefficiente fuori intervallo: ${m.c}`);
		if (letters(m).length === 0) v.push('monomio senza lettere nel testo');
	}
	for (const m of res) if (Math.abs(m.c.num) > 1000 || m.c.den > 125) v.push(`coefficiente del risultato fuori intervallo: ${m.c}`);
	const terms = b.terms ?? [];
	const sameLit = terms.length > 0 && terms.every((t) => similar(t.m, terms[0].m));
	switch (b.level) {
		case 1:
			if (!sameLit || terms.length < 2 || terms.length > 3 || terms.some((t) => !t.m.c.isInteger())) v.push('servono 2 o 3 monomi simili a coefficienti interi');
			if (b.case === 'opposti' ? res.length !== 0 : res.length !== 1) v.push('case non coerente con il risultato');
			if ((b.case === 'meno davanti a un negativo') !== terms.some((t) => t.op === -1 && t.m.c.sign() < 0)) v.push('case non coerente');
			break;
		case 2:
			if (!sameLit || terms.length < 2 || terms.length > 3 || terms.every((t) => t.m.c.isInteger())) v.push('servono 2 o 3 monomi simili, almeno un coefficiente frazionario');
			if (res.length !== 1) v.push('il risultato deve essere un monomio non nullo');
			break;
		case 3: {
			if (terms.length < 3 || sameLit) v.push('servono 3 o 4 monomi non tutti simili');
			const lits = new Set(terms.map((t) => literalKey(t.m.e)));
			if (lits.size !== 2 || res.length !== 2) v.push('servono due gruppi di monomi simili, entrambi con somma non nulla');
			if (terms.some((t) => !t.m.c.isInteger())) v.push('coefficienti interi al livello 3');
			break;
		}
		case 4:
			if (!b.factors || b.factors.length < 2 || b.factors.length > 3) v.push('servono 2 o 3 fattori');
			break;
		case 5: {
			const f = b.factors;
			if (!f || f.length !== 2) {
				v.push('servono dividendo e divisore');
				break;
			}
			if (f[1].c.abs().isOne()) v.push('divisore con coefficiente 1');
			if (letters(res[0]).length === 0) v.push('il quoziente deve avere almeno una lettera');
			const vanish = letters(f[0]).some((l) => expOf(res[0], l) === 0);
			if ((b.case === 'una lettera sparisce') !== vanish) v.push('case non coerente');
			break;
		}
		case 6:
			if (!b.factors || b.factors.length !== 1 || !b.n || b.n < 2 || b.n > 4) v.push('serve una potenza con esponente da 2 a 4');
			if (b.case !== (b.n! % 2 === 0 ? 'esponente pari' : 'esponente dispari')) v.push('case non coerente');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

/** Wrong answers from the mistakes in the lesson. */
function mistakes(b: Built, res: Mono[]): (Opt | null)[] {
	const out: (Opt | null)[] = [];
	const r = res[0];
	if (b.terms) {
		const values = b.terms.map(termValue);
		// exponents summed as in a product
		const summedExps = (ms: Mono[]) => {
			const s = addSimilar(ms);
			if (!s || s.c.isZero()) return null;
			return monoOpt(mono(s.c, Object.fromEntries(letters(ms[0]).map((v) => [v, ms.reduce((t, m) => t + expOf(m, v), 0)]))));
		};
		if (b.level === 3) {
			const all = values.reduce((acc, m) => acc.add(m.c), q(0));
			if (!all.isZero()) {
				out.push(monoOpt(mono(all, { ...values[0].e }))); // everything reduced to one monomial
				out.push(monoOpt(mono(all, { ...mul(res[0], res[1]).e }))); // "3x + 2y = 5xy"
			}
			out.push(monoOpt([res[0], neg(res[1])]));
			out.push(monoOpt([neg(res[0]), res[1]]));
			return out;
		}
		// sign of a subtracted negative monomial not changed
		if (b.terms.some((t) => t.op === -1)) out.push(monoOpt(collect(b.terms.map((t) => t.m))));
		out.push(summedExps(values));
		if (b.level === 2) {
			// numerators and denominators added
			const n = values.reduce((s, m) => s + m.c.num, 0);
			const d = values.reduce((s, m) => s + m.c.den, 0);
			if (n !== 0) out.push(monoOpt(mono(q(n, d), { ...values[0].e })));
		}
		if (res.length === 0) {
			out.push(monoOpt(mono(values[0].c.mul(q(2)), { ...values[0].e })));
			out.push(monoOpt(mono(values[1].c.mul(q(2)), { ...values[0].e })));
		} else {
			out.push(monoOpt(neg(r)));
			// sign of the last term flipped
			const last = values.length - 1;
			out.push(monoOpt(collect(values.map((m, i) => (i === last ? neg(m) : m)))));
		}
		return out;
	}
	const f = b.factors!;
	if (b.level === 4) {
		const expsMul: Record<string, number> = {};
		for (const v of letters(r)) {
			const es = f.map((m) => expOf(m, v)).filter((e) => e > 0);
			expsMul[v] = es.reduce((p, e) => p * e, 1);
		}
		out.push(monoOpt(mono(r.c, expsMul))); // exponents multiplied
		out.push(monoOpt(mono(f.reduce((s, m) => s.add(m.c), q(0)), { ...r.e }))); // coefficients added
		out.push(monoOpt(neg(r)));
		const common = letters(r).filter((v) => f.every((m) => expOf(m, v) > 0));
		if (common.length && common.length < letters(r).length) out.push(monoOpt(mono(r.c, Object.fromEntries(common.map((v) => [v, r.e[v]]))))); // letters of one factor lost
		return out;
	}
	if (b.level === 5) {
		const [A, B] = f;
		const gone = letters(A).filter((v) => expOf(r, v) === 0);
		if (gone.length) out.push(monoOpt(mono(0))); // a^0 read as 0
		out.push(monoOpt(mono(A.c.mul(B.c), { ...r.e }))); // coefficients multiplied, reciprocal forgotten
		const added: Record<string, number> = { ...A.e };
		for (const v of letters(B)) added[v] = (added[v] ?? 0) + B.e[v];
		out.push(monoOpt(mono(r.c, added))); // exponents added
		if (letters(B).every((v) => A.e[v] % B.e[v] === 0)) {
			const divided: Record<string, number> = { ...A.e };
			for (const v of letters(B)) divided[v] = A.e[v] / B.e[v];
			out.push(monoOpt(mono(r.c, divided))); // exponents divided
		}
		if (gone.length) out.push(monoOpt(mono(r.c, { ...r.e, ...Object.fromEntries(gone.map((v) => [v, 1])) }))); // a^0 read as a
		out.push(monoOpt(neg(r)));
		return out;
	}
	const [base] = f;
	const n = b.n!;
	out.push(monoOpt(mono(base.c, { ...r.e }))); // coefficient not raised
	out.push(monoOpt(mono(r.c, Object.fromEntries(letters(base).map((v) => [v, base.e[v] + n]))))); // exponents added
	out.push(monoOpt(mono(base.c.mul(q(n)), { ...r.e }))); // coefficient multiplied by n
	out.push(monoOpt(neg(r))); // sign
	return out;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.level, sample.params)!;
	const res = result(b);
	const correct = monoOpt(res);
	const base = res.length ? res[0] : mono(1, { ...b.terms![0].m.e });
	const fallback = (i: number): Opt | null => {
		if (res.length === 2) {
			const alt = nearMonoMono(res[1], i);
			return alt.c.isZero() ? null : monoOpt([res[0], alt]);
		}
		return nearMono(base, i);
	};
	return buildChoice(correct, mistakes(b, res), fallback, rng);
}

/** nearMono as a Mono, for polynomial fallbacks. */
function nearMonoMono(m: Mono, i: number): Mono {
	const ls = letters(m);
	if (i % 2 === 1) return mono(m.c.add(q(Math.ceil(i / 2))), { ...m.e });
	const v = ls[(i / 2) % ls.length];
	return mono(m.c, { ...m.e, [v]: m.e[v] + Math.ceil(i / (2 * ls.length)) });
}

export const monomiOperazioni: Generator = {
	id: ID,
	title: 'Operazioni tra monomi',
	levels: {
		1: { label: 'Somma algebrica di monomi simili', constraints: ['2 o 3 monomi simili a coefficienti interi', 'circa 2 su 10 con un monomio negativo sottratto, 1 su 10 opposti (risultato 0)'] },
		2: { label: 'Somma con coefficienti frazionari', constraints: ['2 o 3 monomi simili, almeno un coefficiente frazionario', 'si riduce allo stesso denominatore'] },
		3: { label: 'Somma con monomi non simili', constraints: ['3 o 4 monomi con due parti letterali diverse', 'si riducono solo i monomi simili: il risultato è un polinomio di due termini'] },
		4: { label: 'Prodotto', constraints: ['2 o 3 fattori, circa 3 coefficienti su 10 frazionari', 'si moltiplicano i coefficienti e si sommano gli esponenti'] },
		5: { label: 'Quoziente', constraints: ['divisore diverso da zero che divide il dividendo', 'circa 4 su 10 con una lettera che sparisce (esponente 0)', 'circa 1 su 3 con coefficienti frazionari'] },
		6: { label: 'Potenza', constraints: ['esponente da 2 a 4, coefficienti negativi e frazionari', 'si eleva il coefficiente e si moltiplicano gli esponenti'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample = assemble(b, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default monomiOperazioni;
