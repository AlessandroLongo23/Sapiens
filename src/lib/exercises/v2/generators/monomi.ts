/**
 * Monomi: riconoscere un monomio, coefficiente e parte letterale, forma normale, valore numerico.
 * Spec: specs/exercises/monomi.md. Lesson: docs/lezioni/riscritte/27-monomi.md.
 *
 * Six levels in the order of the lesson: coefficient and literal part of a monomial in normal
 * form; whether an expression is a monomial (and why not); normal form of a product with integer
 * coefficients; normal form with fractions or a power of a number in the coefficient; numerical
 * value with integers; numerical value with fractions. Degree and operations between monomials
 * have their own generators (monomi-grado, monomi-operazioni).
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	buildChoice,
	expOf,
	forbidden,
	letters,
	literalKey,
	literalLatex,
	mono,
	monoFromJSON,
	monoJSON,
	monoLatex,
	monoOpt,
	monoSympy,
	mul,
	nearMono,
	neg,
	nonZero,
	pickLetters,
	randomFraction,
	ratPow,
	wrap,
} from '../monomi';

export const ID = 'monomi';

const PROMPTS = {
	coefficiente: 'Qual è il coefficiente del monomio?',
	parte: 'Qual è la parte letterale del monomio?',
	riconosci: "L'espressione è un monomio? Se non lo è, scegli il motivo.",
	forma: 'Riduci il monomio a forma normale.',
	valore: 'Calcola il valore numerico del monomio.',
} as const;

// ---------------------------------------------------------------------------
// Small helpers

const ratOpt = (r: Rational): Opt => ({ latex: r.toLatex(), value: r.toString(), key: r.toString() });

function randomExps(rng: Rng, ls: string[], lo: number, hi: number): Record<string, number> {
	const e: Record<string, number> = {};
	for (const v of ls) e[v] = rng.int(lo, hi);
	return e;
}

const sumExps = (e: Record<string, number>): number => Object.values(e).reduce((s, n) => s + n, 0);

/** A rational as a base: in parentheses when negative or a fraction. */
function baseLatex(r: Rational): string {
	return r.sign() < 0 || !r.isInteger() ? wrap(r.toLatex()) : r.toLatex();
}

function powLatex(base: Rational, n: number): string {
	return `${baseLatex(base)}^${n}`;
}

// ---------------------------------------------------------------------------
// Level 1: coefficient and literal part

interface L1 {
	case: 'parte letterale' | 'coefficiente intero' | 'coefficiente 1 o -1' | 'coefficiente frazionario';
	ask: 'coefficiente' | 'parte';
	m: Mono;
	/** "frazione": written as \frac{3x^2y}{5}, letters in the numerator. */
	written: 'normale' | 'frazione';
}

function mixedCoef(rng: Rng): Rational {
	const u = rng.next();
	if (u < 0.6) return q(nonZero(rng, -12, 12, [1, -1]));
	if (u < 0.75) return q(rng.pick([1, -1]));
	return randomFraction(rng, 7, 7);
}

function buildL1(rng: Rng): L1 {
	const fam = rng.pick(FAMILIES);
	const ls = pickLetters(rng, fam, rng.pick([1, 2, 2, 3]));
	const e: Record<string, number> = {};
	for (const v of ls) e[v] = rng.pick([1, 1, 2, 3, 4, 5]);
	const u = rng.next();
	if (u < 0.35) return { case: 'parte letterale', ask: 'parte', m: mono(mixedCoef(rng), e), written: 'normale' };
	if (u < 0.55) return { case: 'coefficiente intero', ask: 'coefficiente', m: mono(q(nonZero(rng, -12, 12, [1, -1])), e), written: 'normale' };
	if (u < 0.75) return { case: 'coefficiente 1 o -1', ask: 'coefficiente', m: mono(q(rng.pick([1, -1])), e), written: 'normale' };
	return { case: 'coefficiente frazionario', ask: 'coefficiente', m: mono(randomFraction(rng, 7, 7), e), written: rng.next() < 0.5 ? 'frazione' : 'normale' };
}

/** \frac{3x^2y}{5} with the sign outside. */
function fracWritten(m: Mono): string {
	const n = Math.abs(m.c.num);
	return `${m.c.sign() < 0 ? '-' : ''}\\frac{${n === 1 ? '' : n}${literalLatex(m.e)}}{${m.c.den}}`;
}

function l1Problem(b: L1): string {
	return b.written === 'frazione' ? fracWritten(b.m) : monoLatex(b.m);
}

function l1Sample(b: L1): Pick<Sample, 'prompt' | 'problem' | 'solution' | 'steps' | 'answer'> {
	const problem = l1Problem(b);
	const lit = mono(1, { ...b.m.e });
	const steps: string[] = [];
	if (b.ask === 'parte') {
		steps.push(`\\text{Il coefficiente è il numero davanti: } ${b.m.c.toLatex()}`);
		steps.push(`\\text{La parte letterale sono le lettere con i loro esponenti: } ${monoLatex(lit)}`);
		return {
			prompt: PROMPTS.parte,
			problem,
			solution: `\\text{Parte letterale: } ${monoLatex(lit)}`,
			steps,
			answer: { kind: 'expression', value: monoSympy(lit), latex: monoLatex(lit) },
		};
	}
	const c = b.m.c;
	if (b.written === 'frazione') {
		steps.push(`\\text{Dividere per } ${c.den} \\text{ vuol dire moltiplicare per } \\frac{1}{${c.den}}\\text{: } ${problem} = ${monoLatex(b.m)}`);
	}
	if (c.abs().isOne()) {
		steps.push(`\\text{Davanti alle lettere non c'è un numero: } ${problem} = ${c.sign() < 0 ? '-1' : '1'} \\cdot ${monoLatex(lit)}`);
		if (c.sign() < 0) steps.push(`\\text{Del coefficiente } -1 \\text{ si scrive solo il segno meno}`);
	} else {
		steps.push(`\\text{Il coefficiente è il numero davanti alle lettere, con il suo segno: } ${c.toLatex()}`);
	}
	return {
		prompt: PROMPTS.coefficiente,
		problem,
		solution: `\\text{Coefficiente: } ${c.toLatex()}`,
		steps,
		answer: { kind: 'number', value: c.toString() },
	};
}

function l1Choice(b: L1, rng: Rng): ChoiceAnswer {
	const c = b.m.c;
	const ls = letters(b.m);
	if (b.ask === 'parte') {
		const lit = mono(1, { ...b.m.e });
		const cands: (Opt | null)[] = [];
		cands.push(c.isOne() ? null : monoOpt(b.m)); // the whole monomial
		if (c.sign() < 0) cands.push(monoOpt(mono(-1, { ...b.m.e }))); // the sign in the literal part
		const flat: Record<string, number> = {};
		for (const v of ls) flat[v] = 1;
		cands.push(monoOpt(mono(1, flat))); // exponents dropped
		if (ls.length > 1) cands.push(monoOpt(mono(1, { [ls[0]]: b.m.e[ls[0]] }))); // only the first letter
		const fallback = (i: number) => {
			const v = ls[i % ls.length];
			return monoOpt(mono(1, { ...b.m.e, [v]: b.m.e[v] + Math.ceil(i / ls.length) }));
		};
		return buildChoice(monoOpt(lit), cands, fallback, rng);
	}
	const cands: Opt[] = [];
	if (b.written === 'frazione') {
		cands.push(ratOpt(q(c.den))); // the denominator read as the coefficient
		cands.push(ratOpt(q(c.num)));
	}
	if (c.abs().isOne()) cands.push(ratOpt(q(0))); // "x has coefficient 0"
	if (c.sign() < 0) cands.push(ratOpt(c.abs())); // sign dropped
	if (!c.isInteger()) cands.push(ratOpt(q(c.den, c.num))); // reciprocal
	cands.push(ratOpt(c.neg()));
	const maxE = Math.max(...Object.values(b.m.e));
	if (maxE > 1) cands.push(ratOpt(q(maxE))); // an exponent read as the coefficient
	const fallback = (i: number) => ratOpt(c.add(q(i % 2 === 1 ? Math.ceil(i / 2) : -Math.ceil(i / 2))));
	return buildChoice(ratOpt(c), cands, fallback, rng);
}

// ---------------------------------------------------------------------------
// Level 2: monomial or not

type Verdict = 'monomio' | 'somma' | 'denominatore' | 'esponente' | 'numero' | 'ordine';

const VERDICT_LATEX: Record<Verdict, string> = {
	monomio: '\\text{È un monomio}',
	somma: '\\begin{gathered}\\text{No: una somma}\\\\ \\text{di termini non simili}\\end{gathered}',
	denominatore: '\\begin{gathered}\\text{No: una lettera}\\\\ \\text{al denominatore}\\end{gathered}',
	esponente: '\\begin{gathered}\\text{No: un esponente}\\\\ \\text{non naturale}\\end{gathered}',
	numero: '\\begin{gathered}\\text{No: un numero}\\\\ \\text{al denominatore}\\end{gathered}',
	ordine: '\\begin{gathered}\\text{No: le lettere}\\\\ \\text{non sono in ordine}\\end{gathered}',
};
const VERDICT_ORDER: Verdict[] = ['monomio', 'somma', 'denominatore', 'esponente', 'numero', 'ordine'];

type L2Case = 'monomio' | 'somma' | 'lettera al denominatore' | 'esponente negativo' | 'esponente non naturale';

interface L2 {
	case: L2Case;
	/** Kind of monomial or of defect, for the steps. */
	sub: string;
	verdict: Verdict;
	expr: string;
	/** For a monomial: its normal form. */
	normal?: Mono;
	/** Verdicts shown, in the fixed order. */
	shown: Verdict[];
}

function buildL2(rng: Rng): L2 {
	const fam = rng.pick(FAMILIES);
	const u = rng.next();
	if (u < 0.4) {
		const w = rng.next();
		if (w < 0.45) {
			// \frac{x^2y}{5}: a number at the denominator
			const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
			const e = randomExps(rng, ls, 1, 3);
			let c: Rational;
			do c = q(rng.pick([1, 1, 2, 3, 5]) * rng.pick([1, -1]), rng.int(2, 7));
			while (c.isInteger() || c.den === 1);
			const m = mono(c, e);
			return { case: 'monomio', sub: 'frazione numerica', verdict: 'monomio', expr: fracWritten(m), normal: m, shown: [] };
		}
		if (w < 0.8) {
			// 4 \cdot a \cdot b \cdot a: a product not yet in normal form
			const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
			const seq = [...ls, rng.pick(ls)];
			if (rng.next() < 0.4) seq.push(rng.pick(ls));
			// shuffle the letters, keeping at least one repetition
			for (let i = seq.length - 1; i > 0; i--) {
				const j = rng.int(0, i);
				[seq[i], seq[j]] = [seq[j], seq[i]];
			}
			const c = nonZero(rng, -9, 9, [1, -1]);
			const e: Record<string, number> = {};
			for (const v of seq) e[v] = (e[v] ?? 0) + 1;
			const expr = [`${c}`, ...seq].join(' \\cdot ');
			return { case: 'monomio', sub: 'prodotto', verdict: 'monomio', expr, normal: mono(c, e), shown: [] };
		}
		const c = rng.next() < 0.5 ? randomFraction(rng, 9, 9) : q(nonZero(rng, -20, 20, [1, -1]));
		return { case: 'monomio', sub: 'costante', verdict: 'monomio', expr: c.toLatex(), normal: mono(c), shown: [] };
	}
	if (u < 0.55) {
		// two terms with different literal parts
		const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
		const a = mono(nonZero(rng, -6, 6), randomExps(rng, ls, 1, 3));
		let b: Mono;
		do {
			const lb = rng.next() < 0.2 ? [] : pickLetters(rng, fam, rng.pick([1, 1, 2]));
			b = mono(nonZero(rng, -6, 6), randomExps(rng, lb, 1, 3));
		} while (literalKey(b.e) === literalKey(a.e));
		const expr = `${monoLatex(a)} ${b.c.sign() < 0 ? '-' : '+'} ${monoLatex(b.c.sign() < 0 ? neg(b) : b)}`;
		return { case: 'somma', sub: 'somma', verdict: 'somma', expr, shown: [] };
	}
	if (u < 0.7) {
		// \frac{3}{x}, \frac{2a^2}{b}: letters in the denominator, none cancels
		const all = pickLetters(rng, fam, 3);
		const nd = rng.int(1, 2);
		const den = pickLetters(rng, all, nd);
		const numLs = rng.next() < 0.5 ? [] : pickLetters(rng, all.filter((v) => !den.includes(v)), 1);
		const top = mono(q(rng.next() < 0.3 && numLs.length ? 1 : rng.int(2, 9)), randomExps(rng, numLs, 1, 2));
		const bottom = literalLatex(randomExps(rng, den, 1, 3));
		const sign = rng.next() < 0.3 ? '-' : '';
		return { case: 'lettera al denominatore', sub: 'denominatore', verdict: 'denominatore', expr: `${sign}\\frac{${monoLatex(top)}}{${bottom}}`, shown: [] };
	}
	if (u < 0.85) {
		// 3a^2b^{-1}
		const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
		const e = randomExps(rng, ls, 1, 3);
		const t = rng.pick(ls);
		const k = rng.int(1, 3);
		const c = nonZero(rng, -9, 9, [1, -1]);
		const body = ls.map((v) => (v === t ? `${v}^{-${k}}` : e[v] === 1 ? v : `${v}^${e[v]}`)).join('');
		return { case: 'esponente negativo', sub: 'negativo', verdict: 'esponente', expr: `${c}${body}`, shown: [] };
	}
	if (rng.next() < 0.5) {
		// x^{\frac{1}{2}}y
		const ls = pickLetters(rng, fam, rng.pick([1, 2]));
		const t = rng.pick(ls);
		const fr = rng.pick([q(1, 2), q(1, 3), q(2, 3), q(3, 2)]);
		const e = randomExps(rng, ls, 1, 3);
		const c = rng.next() < 0.3 ? '' : `${nonZero(rng, -9, 9, [1, -1])}`;
		const body = ls.map((v) => (v === t ? `${v}^{\\frac{${fr.num}}{${fr.den}}}` : e[v] === 1 ? v : `${v}^${e[v]}`)).join('');
		return { case: 'esponente non naturale', sub: 'frazionario', verdict: 'esponente', expr: `${c}${body}`, shown: [] };
	}
	// 2^x, 3 \cdot 5^a
	const v = rng.pick(fam);
	const base = rng.pick([2, 3, 5, 10]);
	const c = rng.next() < 0.5 ? '' : `${nonZero(rng, -9, 9, [1, -1])} \\cdot `;
	return { case: 'esponente non naturale', sub: 'lettera', verdict: 'esponente', expr: `${c}${base}^${v}`, shown: [] };
}

/** The four verdicts shown: the right one, "monomio", and never an ambiguous pair. */
function l2Shown(b: L2, rng: Rng): Verdict[] {
	const hasNumDen = b.sub === 'frazione numerica' || (b.sub === 'costante' && !b.normal!.c.isInteger());
	let set: Verdict[];
	if (b.sub === 'negativo') set = ['monomio', 'somma', 'esponente', 'ordine']; // b^{-1} = 1/b: "denominatore" would also be right
	else if (b.sub === 'prodotto') set = ['monomio', 'somma', 'denominatore', 'ordine'];
	else if (hasNumDen) set = ['monomio', rng.pick(['somma', 'esponente'] as Verdict[]), 'denominatore', 'numero'];
	else set = ['monomio', 'somma', 'denominatore', 'esponente'];
	return VERDICT_ORDER.filter((v) => set.includes(v));
}

function l2Answer(b: L2): ChoiceAnswer {
	const options: ChoiceOption[] = b.shown.map((v) => ({ latex: VERDICT_LATEX[v], values: [v] }));
	return { kind: 'choice', options, correct: b.shown.indexOf(b.verdict) };
}

function l2Steps(b: L2): { steps: string[]; solution: string } {
	const s: string[] = [];
	switch (b.sub) {
		case 'frazione numerica': {
			const m = b.normal!;
			s.push(`\\text{Al denominatore c'è solo un numero: dividere per } ${m.c.den} \\text{ vuol dire moltiplicare per } \\frac{1}{${m.c.den}}`);
			s.push(`\\text{Quindi } ${b.expr} = ${monoLatex(m)}\\text{, con coefficiente } ${m.c.toLatex()}`);
			break;
		}
		case 'prodotto':
			s.push(`\\text{Tra numeri e lettere c'è solo la moltiplicazione}`);
			s.push(`\\text{In forma normale: } ${b.expr} = ${monoLatex(b.normal!)}`);
			break;
		case 'costante':
			s.push(`\\text{Un numero da solo è un monomio senza parte letterale: una costante}`);
			break;
		case 'somma':
			s.push(`\\text{C'è una somma tra termini con parti letterali diverse, che non si riduce a un solo termine}`);
			s.push(`\\text{È un polinomio, non un monomio}`);
			break;
		case 'denominatore':
			s.push(`\\text{C'è una lettera al denominatore: la divisione per una lettera non è ammessa}`);
			break;
		case 'negativo': {
			const [, v, k] = /([a-z])\^\{-(\d)\}/.exec(b.expr)!;
			s.push(`\\text{Un esponente negativo porta la lettera al denominatore: } ${v}^{-${k}} = \\frac{1}{${k === '1' ? v : `${v}^${k}`}}`);
			s.push(`\\text{Gli esponenti delle lettere devono essere numeri naturali}`);
			break;
		}
		case 'frazionario':
			s.push(`\\text{Un esponente frazionario indica una radice, come } x^{\\frac{1}{2}} = \\sqrt{x}`);
			s.push(`\\text{Gli esponenti delle lettere devono essere numeri naturali}`);
			break;
		case 'lettera':
			s.push(`\\text{C'è una lettera all'esponente: l'esponente deve essere un numero naturale fissato}`);
			break;
	}
	const solution =
		b.verdict === 'monomio'
			? b.sub === 'costante'
				? `\\text{È un monomio: una costante}`
				: `\\text{È un monomio: } ${monoLatex(b.normal!)}`
			: `\\text{Non è un monomio}`;
	return { steps: s, solution };
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: normal form of a product

interface Prod {
	case: string;
	factors: Mono[];
	/** The coefficient of factor 0 is written as base^n. */
	coefPow?: { base: Rational; n: number };
}

function prodResult(b: Prod): Mono {
	return b.factors.reduce((acc, f) => mul(acc, f), mono(1));
}

function factorWritten(f: Mono, i: number, b: Prod): string {
	if (i === 0 && b.coefPow) return powLatex(b.coefPow.base, b.coefPow.n) + literalLatex(f.e);
	const s = monoLatex(f);
	if (i === 0) return s;
	return f.c.sign() < 0 ? wrap(s) : s;
}

function prodLatex(b: Prod): string {
	return b.factors.map((f, i) => factorWritten(f, i, b)).join(' \\cdot ');
}

const negCount = (b: Prod): number =>
	b.factors.filter((f, i) => (i === 0 && b.coefPow ? b.coefPow.base.sign() < 0 && b.coefPow.n % 2 === 1 : f.c.sign() < 0)).length;

function repeatedLetters(fs: Mono[]): string[] {
	const all = [...new Set(fs.flatMap(letters))].sort();
	return all.filter((v) => fs.filter((f) => expOf(f, v) > 0).length >= 2);
}

function buildL3(rng: Rng): Prod | null {
	const fam = rng.pick(FAMILIES);
	const pool = pickLetters(rng, fam, rng.pick([1, 2, 2, 3]));
	const k = rng.pick([2, 3, 3, 4]);
	const factors: Mono[] = [];
	for (let i = 0; i < k; i++) {
		const numberOnly = i === 0 && k >= 3 && rng.next() < 0.2;
		const ls = numberOnly ? [] : pickLetters(rng, pool, rng.pick([1, 1, 2]));
		const e = randomExps(rng, ls, 1, 3);
		let c: number;
		if (i === 0) c = nonZero(rng, -6, 6, numberOnly ? [1, -1] : []);
		else {
			const u = rng.next();
			c = u < 0.45 ? 1 : u < 0.75 ? -1 : nonZero(rng, -5, 5);
		}
		factors.push(mono(c, e));
	}
	const b: Prod = { case: '', factors };
	const m = prodResult(b);
	if (repeatedLetters(factors).length === 0) return null;
	const nn = negCount(b);
	if (nn === 0) return null;
	if (factors.filter((f) => f.c.abs().isOne()).length === k) return null;
	if (Math.abs(m.c.num) > 60 || Math.max(...Object.values(m.e)) > 8) return null;
	b.case = nn % 2 === 1 ? 'risultato negativo' : 'risultato positivo';
	return b;
}

const NICE_BASES: Rational[] = [q(2), q(3), q(-2), q(-3), q(1, 2), q(-1, 2), q(2, 3), q(5)];

function buildL4(rng: Rng): Prod | null {
	const fam = rng.pick(FAMILIES);
	const pool = pickLetters(rng, fam, rng.pick([2, 2, 3]));
	const lsOf = () => pickLetters(rng, pool, rng.pick([1, 2, 2]));
	if (rng.next() < 0.55) {
		const k = rng.pick([2, 3, 3]);
		const factors: Mono[] = [];
		for (let i = 0; i < k; i++) {
			const c = i < 2 ? randomFraction(rng, 9, 9) : rng.next() < 0.6 ? q(rng.pick([1, -1])) : q(nonZero(rng, -6, 6, [1, -1]));
			factors.push(mono(c, randomExps(rng, lsOf(), 1, 3)));
		}
		const b: Prod = { case: 'frazioni', factors };
		const m = prodResult(b);
		const rawDen = factors.reduce((p, f) => p * f.c.den, 1);
		if (rawDen === m.c.den) return null; // nothing to simplify in croce
		if (Math.abs(m.c.num) > 12 || m.c.den > 9 || repeatedLetters(factors).length === 0) return null;
		if (Math.max(...Object.values(m.e)) > 8) return null;
		return b;
	}
	const base = rng.pick(NICE_BASES);
	const n = base.isInteger() && Math.abs(base.num) === 2 ? rng.int(2, 4) : rng.int(2, 3);
	const k = rng.pick([2, 3]);
	const factors: Mono[] = [mono(ratPow(base, n), randomExps(rng, lsOf(), 1, 4))];
	for (let i = 1; i < k; i++) {
		const u = rng.next();
		const c = u < 0.5 ? randomFraction(rng, 5, 9) : u < 0.8 ? q(rng.pick([1, -1])) : q(nonZero(rng, -3, 3, [1, -1]));
		factors.push(mono(c, randomExps(rng, lsOf(), 1, 3)));
	}
	const b: Prod = { case: 'potenza di un numero', factors, coefPow: { base, n } };
	const m = prodResult(b);
	if (Math.abs(m.c.num) > 30 || m.c.den > 9 || repeatedLetters(factors).length === 0) return null;
	if (Math.max(...Object.values(m.e)) > 9) return null;
	return b;
}

function prodSteps(b: Prod): string[] {
	const m = prodResult(b);
	const out: string[] = [];
	if (b.coefPow) {
		const { base, n } = b.coefPow;
		out.push(`\\text{La potenza } ${powLatex(base, n)} \\text{ è un numero e va nel coefficiente: } ${powLatex(base, n)} = ${ratPow(base, n).toLatex()}`);
	}
	const nums = b.factors.map((f) => f.c).filter((c) => !c.isOne());
	if (nums.length >= 2) {
		const nn = negCount(b);
		const shown = nums.map((c, i) => (c.sign() < 0 && !(i === 0 && c.isInteger()) ? wrap(c.toLatex()) : c.toLatex()));
		out.push(`\\text{Coefficiente: } ${shown.join(' \\cdot ')} = ${m.c.toLatex()}`);
		if (nn >= 2) out.push(`\\text{I segni meno sono } ${nn}\\text{, un numero ${nn % 2 === 0 ? 'pari: il coefficiente è positivo' : 'dispari: il coefficiente è negativo'}}`);
	} else {
		out.push(`\\text{Coefficiente: } ${m.c.toLatex()}`);
	}
	const parts = letters(m).map((v) => {
		const es = b.factors.map((f) => expOf(f, v)).filter((k) => k > 0);
		return es.length > 1 ? `${v}^{${es.join('+')}} = ${literalLatex({ [v]: m.e[v] })}` : literalLatex({ [v]: m.e[v] });
	});
	out.push(`\\text{Lettere, sommando gli esponenti: } ${parts.join(' \\qquad ')}`);
	out.push(`\\text{Forma normale: } ${prodLatex(b)} = ${monoLatex(m)}`);
	return out;
}

function prodChoice(b: Prod, rng: Rng): ChoiceAnswer {
	const m = prodResult(b);
	const rep = repeatedLetters(b.factors);
	const cands: Opt[] = [monoOpt(neg(m))];
	// exponents of a repeated letter not summed: the letter read once
	const once: Record<string, number> = { ...m.e };
	for (const v of rep) once[v] = Math.max(...b.factors.map((f) => expOf(f, v)));
	cands.push(monoOpt(mono(m.c, once)));
	if (b.coefPow) {
		const { base, n } = b.coefPow;
		// the exponent of the number added to the letters (warning of the lesson)
		const ls0 = letters(b.factors[0]);
		cands.push(monoOpt(mono(m.c, { ...m.e, [ls0[0]]: m.e[ls0[0]] + n })));
		// base^n computed as base · n
		const rest = b.factors.slice(1).reduce((p, f) => p.mul(f.c), q(1));
		cands.push(monoOpt(mono(base.mul(q(n)).mul(rest), { ...m.e })));
	} else {
		// coefficients added instead of multiplied (3x · 2x = 5x^2), with integer coefficients
		const s = b.factors.reduce((p, f) => p.add(f.c), q(0));
		if (!s.isZero() && b.factors.every((f) => f.c.isInteger())) cands.push(monoOpt(mono(s, { ...m.e })));
		if (!m.c.isInteger()) cands.push(monoOpt(mono(q(m.c.den, m.c.num), { ...m.e })));
		// exponents multiplied
		const times: Record<string, number> = { ...m.e };
		for (const v of rep) times[v] = b.factors.map((f) => expOf(f, v)).filter((k) => k > 0).reduce((p, k) => p * k, 1);
		cands.push(monoOpt(mono(m.c, times)));
	}
	return buildChoice(monoOpt(m), cands, (i) => nearMono(m, i), rng);
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: numerical value

interface Val {
	case: string;
	m: Mono;
	values: Record<string, Rational>;
}

function valueOf(m: Mono, values: Record<string, Rational>): Rational {
	return letters(m).reduce((p, v) => p.mul(ratPow(values[v], m.e[v])), m.c);
}

function buildL5(rng: Rng): Val | null {
	const fam = rng.pick(FAMILIES);
	const u = rng.next();
	const kase = u < 0.25 ? 'valori positivi' : u < 0.9 ? 'valore negativo' : 'una lettera vale zero';
	const ls = pickLetters(rng, fam, kase === 'una lettera vale zero' ? rng.pick([2, 3]) : rng.pick([1, 2, 2, 3]));
	const e = randomExps(rng, ls, 1, 3);
	if (sumExps(e) > 5) return null;
	const c = rng.next() < 0.2 ? q(rng.pick([1, -1])) : q(nonZero(rng, -5, 5, [1, -1]));
	const m = mono(c, e);
	const values: Record<string, Rational> = {};
	for (const v of ls) values[v] = q(kase === 'valori positivi' ? rng.int(2, 5) : nonZero(rng, -4, 5, [1]));
	if (kase === 'valore negativo' && !ls.some((v) => values[v].sign() < 0)) return null;
	if (kase === 'una lettera vale zero') values[rng.pick(ls)] = q(0);
	const r = valueOf(m, values);
	if (kase !== 'una lettera vale zero' && (r.isZero() || Math.abs(r.num) > 300)) return null;
	return { case: kase, m, values };
}

function buildL6(rng: Rng): Val | null {
	const fam = rng.pick(FAMILIES);
	const ls = pickLetters(rng, fam, rng.pick([1, 2, 2]));
	const e = randomExps(rng, ls, 1, 3);
	if (sumExps(e) > 4) return null;
	const values: Record<string, Rational> = {};
	const fracLetter = rng.pick(ls);
	for (const v of ls) {
		if (v === fracLetter || rng.next() < 0.3) {
			let r: Rational;
			do r = q(nonZero(rng, -3, 3), rng.pick([2, 3, 4]));
			while (r.isInteger());
			values[v] = r;
		} else values[v] = q(nonZero(rng, -6, 6));
	}
	if (!ls.some((v) => values[v].sign() < 0)) return null;
	const intRes = rng.next() < 0.6;
	const target = intRes ? q(nonZero(rng, -12, 12)) : randomFraction(rng, 9, 4);
	const p = valueOf(mono(1, e), values);
	const c = target.div(p);
	if (Math.abs(c.num) > 9 || c.den > 9) return null;
	return { case: intRes ? 'risultato intero' : 'risultato frazionario', m: mono(c, e), values };
}

function valProblem(b: Val): string {
	const assign = letters(b.m)
		.map((v) => `${v} = ${b.values[v].toLatex()}`)
		.join(',\\; ');
	return `${monoLatex(b.m)} \\quad \\text{per } ${assign}`;
}

/** -2 \cdot (-1)^3 \cdot (3)^2, the lesson's substitution with every value in parentheses. */
function substituted(b: Val): string {
	const c = b.m.c;
	const fs = letters(b.m).map((v) => {
		const w = wrap(b.values[v].toLatex());
		return b.m.e[v] === 1 ? w : `${w}^${b.m.e[v]}`;
	});
	const pre = c.isOne() ? '' : c.equals(q(-1)) ? '-' : `${c.toLatex()} \\cdot `;
	return pre + fs.join(' \\cdot ');
}

function powered(b: Val): string {
	const c = b.m.c;
	const vals = letters(b.m).map((v) => ratPow(b.values[v], b.m.e[v]));
	const pre = c.isOne() ? '' : c.equals(q(-1)) ? '-' : `${c.toLatex()} \\cdot `;
	return (
		pre +
		vals
			.map((r, i) => {
				const s = r.toLatex();
				return (i > 0 || pre !== '') && r.sign() < 0 ? wrap(s) : s;
			})
			.join(' \\cdot ')
	);
}

function valSteps(b: Val): string[] {
	const r = valueOf(b.m, b.values);
	const zero = letters(b.m).find((v) => b.values[v].isZero());
	if (zero) {
		return [`\\text{La lettera } ${zero} \\text{ vale } 0\\text{: uno dei fattori è } 0`, `\\text{Un prodotto con un fattore } 0 \\text{ vale } 0`];
	}
	const out = [`\\text{Sostituisci i valori, tra parentesi: } ${substituted(b)}`];
	const noPowers = letters(b.m).every((v) => b.m.e[v] === 1);
	if (noPowers) out.push(`\\text{Moltiplica, con la regola dei segni: } ${substituted(b)} = ${r.toLatex()}`);
	else out.push(`\\text{Calcola le potenze, poi moltiplica: } ${substituted(b)} = ${powered(b)} = ${r.toLatex()}`);
	if (b.m.c.sign() < 0 && letters(b.m).some((v) => b.values[v].sign() < 0 && b.m.e[v] % 2 === 0)) {
		out.push(`\\text{L'esponente pari rende positiva la potenza; il segno meno del coefficiente resta fuori}`);
	}
	return out;
}

function valChoice(b: Val, rng: Rng): ChoiceAnswer {
	const r = valueOf(b.m, b.values);
	const ls = letters(b.m);
	const alt = (f: (v: string, x: Rational, k: number) => Rational, c = b.m.c) => ls.reduce((p, v) => p.mul(f(v, b.values[v], b.m.e[v])), c);
	const cands: Opt[] = [];
	if (r.isZero()) {
		// the letter that is 0 ignored, the coefficient, 1
		cands.push(ratOpt(alt((_, x, k) => (x.isZero() ? q(1) : ratPow(x, k)))));
		cands.push(ratOpt(b.m.c), ratOpt(q(1)));
	} else {
		// -3^2 instead of (-3)^2: the negative number without parentheses
		cands.push(ratOpt(alt((_, x, k) => (x.sign() < 0 ? ratPow(x.abs(), k).neg() : ratPow(x, k)))));
		// the minus of the coefficient taken inside the power (-x^2 read as (-x)^2)
		if (b.m.c.sign() < 0) {
			const v0 = ls[0];
			cands.push(ratOpt(alt((v, x, k) => (v === v0 ? ratPow(x.neg(), k) : ratPow(x, k)), b.m.c.abs())));
		}
		// only the numerator raised to the power
		if (ls.some((v) => !b.values[v].isInteger())) cands.push(ratOpt(alt((_, x, k) => q(ratPow(q(x.num), k).num, x.den))));
		cands.push(ratOpt(r.neg()));
		// power computed as a product: 3^2 = 6
		cands.push(ratOpt(alt((_, x, k) => x.mul(q(k)))));
		// coefficient forgotten
		if (!b.m.c.abs().isOne()) cands.push(ratOpt(alt((_, x, k) => ratPow(x, k), q(1))));
	}
	const fallback = (i: number) => ratOpt(r.add(q(i % 2 === 1 ? Math.ceil(i / 2) : -Math.ceil(i / 2))));
	return buildChoice(ratOpt(r), cands, fallback, rng);
}

// ---------------------------------------------------------------------------
// Sample assembly and parsing back

type Built = { level: 1; b: L1 } | { level: 2; b: L2 } | { level: 3 | 4; b: Prod } | { level: 5 | 6; b: Val };

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return { level, b: buildL1(rng) };
		case 2: {
			const b = buildL2(rng);
			b.shown = l2Shown(b, rng);
			return { level, b };
		}
		case 3:
		case 4: {
			const b = level === 3 ? buildL3(rng) : buildL4(rng);
			return b ? { level, b } : null;
		}
		case 5:
		case 6: {
			const b = level === 5 ? buildL5(rng) : buildL6(rng);
			return b ? { level, b } : null;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function assemble(x: Built, seed: number): Sample {
	const base = { generatorId: ID, level: x.level, seed };
	if (x.level === 1) {
		const b = x.b;
		return { ...base, ...l1Sample(b), params: { case: b.case, ask: b.ask, written: b.written, m: monoJSON(b.m) } };
	}
	if (x.level === 2) {
		const b = x.b;
		const { steps, solution } = l2Steps(b);
		return {
			...base,
			prompt: PROMPTS.riconosci,
			problem: b.expr,
			solution,
			steps,
			answer: l2Answer(b),
			params: { case: b.case, sub: b.sub, verdict: b.verdict, shown: b.shown, ...(b.normal ? { normal: monoJSON(b.normal) } : {}) },
		};
	}
	if (x.level === 3 || x.level === 4) {
		const b = x.b;
		const m = prodResult(b);
		return {
			...base,
			prompt: PROMPTS.forma,
			problem: prodLatex(b),
			solution: monoLatex(m),
			steps: prodSteps(b),
			answer: { kind: 'expression', value: monoSympy(m), latex: monoLatex(m) },
			params: {
				case: b.case,
				factors: b.factors.map(monoJSON),
				...(b.coefPow ? { coefPow: { base: b.coefPow.base.toString(), n: b.coefPow.n } } : {}),
				result: monoJSON(m),
			},
		};
	}
	const b = x.b as Val; // levels 5 and 6
	const r = valueOf(b.m, b.values);
	const values: Record<string, string> = {};
	for (const v of letters(b.m)) values[v] = b.values[v].toString();
	return {
		...base,
		prompt: PROMPTS.valore,
		problem: valProblem(b),
		solution: `\\text{Valore: } ${r.toLatex()}`,
		steps: valSteps(b),
		answer: { kind: 'number', value: r.toString() },
		params: { case: b.case, m: monoJSON(b.m), values, value: r.toString() },
	};
}

function parse(s: Sample): Built | null {
	const p = s.params;
	try {
		switch (s.level) {
			case 1: {
				const m = monoFromJSON(p.m);
				if (!m) return null;
				return { level: 1, b: { case: p.case as L1['case'], ask: p.ask as L1['ask'], written: p.written as L1['written'], m } };
			}
			case 2:
				return {
					level: 2,
					b: {
						case: p.case as L2Case,
						sub: String(p.sub),
						verdict: p.verdict as Verdict,
						expr: s.problem,
						normal: p.normal ? (monoFromJSON(p.normal) ?? undefined) : undefined,
						shown: p.shown as Verdict[],
					},
				};
			case 3:
			case 4: {
				if (!Array.isArray(p.factors)) return null;
				const fs = p.factors.map(monoFromJSON);
				if (fs.some((f) => !f)) return null;
				const cp = p.coefPow as { base?: string; n?: number } | undefined;
				return {
					level: s.level,
					b: { case: String(p.case), factors: fs as Mono[], coefPow: cp && typeof cp.base === 'string' && typeof cp.n === 'number' ? { base: Rational.parse(cp.base), n: cp.n } : undefined },
				};
			}
			case 5:
			case 6: {
				const m = monoFromJSON(p.m);
				if (!m || !p.values || typeof p.values !== 'object') return null;
				const values: Record<string, Rational> = {};
				for (const [k, v] of Object.entries(p.values as Record<string, string>)) values[k] = Rational.parse(v);
				return { level: s.level, b: { case: String(p.case), m, values } };
			}
		}
	} catch {
		return null;
	}
	return null;
}

// ---------------------------------------------------------------------------
// Check

function check(sample: Sample): string[] {
	const v: string[] = [];
	const x = parse(sample);
	if (!x) return ['params non validi'];
	v.push(...forbidden(sample.problem));
	if (x.level === 1) {
		const b = x.b;
		if (sample.problem !== l1Problem(b)) v.push('testo diverso dai params');
		const want = b.ask === 'parte' ? monoSympy(mono(1, { ...b.m.e })) : b.m.c.toString();
		const got = sample.answer.kind === 'number' ? sample.answer.value : sample.answer.kind === 'expression' ? sample.answer.value : '';
		if (got !== want) v.push(`risposta ${got} invece di ${want}`);
		if (letters(b.m).length === 0) v.push('serve almeno una lettera');
		const c = b.m.c;
		const kind = b.ask === 'parte' ? 'parte letterale' : c.abs().isOne() ? 'coefficiente 1 o -1' : c.isInteger() ? 'coefficiente intero' : 'coefficiente frazionario';
		if (b.case !== kind) v.push(`case ${b.case} ma l'esercizio è ${kind}`);
		if (b.written === 'frazione' && c.isInteger()) v.push('scrittura a frazione con coefficiente intero');
	} else if (x.level === 2) {
		const b = x.b;
		if (sample.answer.kind !== 'choice' || sample.answer.options.length !== 4) v.push('servono 4 opzioni');
		else if (sample.answer.options[sample.answer.correct]?.values[0] !== b.verdict) v.push('opzione corretta sbagliata');
		if (!b.shown.includes(b.verdict)) v.push('il verdetto giusto non è tra le opzioni');
		if (b.sub === 'negativo' && b.shown.includes('denominatore')) v.push('esponente negativo con l\'opzione "denominatore"');
		if ((b.verdict === 'monomio') !== (b.case === 'monomio') || (b.verdict === 'monomio') !== Boolean(b.normal)) v.push('verdetto non coerente');
	} else if (x.level === 3 || x.level === 4) {
		const b = x.b;
		const m = prodResult(b);
		if (sample.answer.kind !== 'expression' || sample.answer.value !== monoSympy(m)) v.push('risposta diversa dal prodotto');
		if (b.factors.length < 2) v.push('servono almeno due fattori');
		if (repeatedLetters(b.factors).length === 0) v.push('serve una lettera ripetuta');
		if (m.c.den > 9 || Math.abs(m.c.num) > 60) v.push('coefficiente troppo grande');
		if (Math.max(0, ...Object.values(m.e)) > 9) v.push('esponente troppo grande');
		const fracs = b.factors.filter((f) => !f.c.isInteger()).length;
		if (x.level === 3) {
			if (fracs > 0 || b.coefPow) v.push('livello 3: solo coefficienti interi');
			if (negCount(b) === 0) v.push('livello 3: serve almeno un segno meno');
			if (b.case !== (negCount(b) % 2 === 1 ? 'risultato negativo' : 'risultato positivo')) v.push('case non coerente');
		} else {
			if (b.case === 'frazioni' && (fracs < 2 || b.coefPow)) v.push('livello 4: servono due coefficienti frazionari');
			if (b.case === 'potenza di un numero' && !b.coefPow) v.push('livello 4: serve una potenza nel coefficiente');
			if (b.coefPow && !ratPow(b.coefPow.base, b.coefPow.n).equals(b.factors[0].c)) v.push('potenza del coefficiente sbagliata');
			if (b.case !== 'frazioni' && b.case !== 'potenza di un numero') v.push('case sconosciuto');
		}
	} else {
		const b = x.b as Val; // levels 5 and 6
		const r = valueOf(b.m, b.values);
		if (sample.answer.kind !== 'number' || sample.answer.value !== r.toString()) v.push('risposta diversa dal valore');
		if (letters(b.m).join() !== Object.keys(b.values).sort().join()) v.push('valori non assegnati a tutte le lettere');
		if (sumExps(b.m.e) > 5) v.push('grado troppo alto');
		const neg = letters(b.m).some((l) => b.values[l].sign() < 0);
		const frac = letters(b.m).some((l) => !b.values[l].isInteger());
		const zero = letters(b.m).some((l) => b.values[l].isZero());
		if (x.level === 5) {
			if (!b.m.c.isInteger() || frac) v.push('livello 5: solo interi');
			const kind = zero ? 'una lettera vale zero' : neg ? 'valore negativo' : 'valori positivi';
			if (b.case !== kind) v.push(`case ${b.case} ma l'esercizio è ${kind}`);
			if (!zero && Math.abs(r.num) > 300) v.push('valore troppo grande');
		} else {
			if (!frac || !neg || zero) v.push('livello 6: serve un valore frazionario e uno negativo, nessuno zero');
			if (b.m.c.den > 9 || Math.abs(b.m.c.num) > 9) v.push('coefficiente troppo grande');
			if (b.case !== (r.isInteger() ? 'risultato intero' : 'risultato frazionario')) v.push('case non coerente');
		}
	}
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const x = parse(sample)!;
	if (x.level === 1) return l1Choice(x.b, rng);
	if (x.level === 3 || x.level === 4) return prodChoice(x.b, rng);
	if (x.level === 5 || x.level === 6) return valChoice(x.b, rng);
	throw new Error(`${ID}: no choice for level ${sample.level}`);
}

export const monomi: Generator = {
	id: ID,
	title: 'Monomi',
	levels: {
		1: { label: 'Coefficiente e parte letterale', constraints: ['monomio in forma normale, oppure con le lettere al numeratore di una frazione', 'coefficienti interi, 1 e -1 sottintesi, frazionari'] },
		2: { label: 'Monomio o no', constraints: ['circa 4 su 10 monomi (frazione con un numero al denominatore, prodotto non ridotto, costante)', 'gli altri: somma, lettera al denominatore, esponente negativo, esponente frazionario o letterale'] },
		3: { label: 'Forma normale, coefficienti interi', constraints: ['prodotto di 2-4 fattori con una lettera ripetuta e almeno un segno meno'] },
		4: { label: 'Forma normale, frazioni e potenze', constraints: ['coefficienti frazionari che si semplificano, oppure una potenza di un numero nel coefficiente'] },
		5: { label: 'Valore numerico con gli interi', constraints: ['valori interi, di solito almeno uno negativo; circa 1 su 10 con una lettera che vale 0'] },
		6: { label: 'Valore numerico con le frazioni', constraints: ['almeno un valore frazionario e uno negativo; risultato intero o frazione semplice'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const x = build(rng, level);
			if (!x) continue;
			const sample = assemble(x, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default monomi;
