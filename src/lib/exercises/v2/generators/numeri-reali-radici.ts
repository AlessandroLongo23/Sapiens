/**
 * Radicali e loro proprietà. Spec: specs/exercises/numeri-reali-radici.md
 *
 * Seven levels in the order of the lesson: computing a root (or seeing that it does not exist in R),
 * conditions of existence, the root of a power (|x|), simplifying numeric radicals, simplifying with
 * letters (when the absolute value is needed), reducing to the same index, comparing and ordering.
 * Everything is built backwards: the root first, then the radicand; the reduced radical first, then
 * the one to simplify; the order first, then the numbers.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, shuffle, weighted } from '../razionali';

export const ID = 'numeri-reali-radici';

// ---------------------------------------------------------------------------
// Shared helpers

/** \sqrt{body} for index 2, \sqrt[n]{body} otherwise. */
export const rt = (n: number, body: string): string => (n === 2 ? `\\sqrt{${body}}` : `\\sqrt[${n}]{${body}}`);
/** The same radical for SymPy: sqrt(body) or root(body, n) (a principal root: only for radicands >= 0). */
const symRoot = (n: number, body: string): string => (n === 2 ? `sqrt(${body})` : `root(${body}, ${n})`);
/** A real root for SymPy, also of a negative radicand with odd index. */
const symReal = (n: number, body: string): string => (n === 2 ? `sqrt(${body})` : `real_root(${body}, ${n})`);

const gcdAll = (xs: number[]): number => xs.reduce((a, b) => gcd(a, b), 0);
const lcmAll = (xs: number[]): number => xs.reduce((a, b) => lcm(a, b), 1);
const ipow = (b: number, e: number): number => {
	let o = 1;
	for (let i = 0; i < e; i++) o *= b;
	return o;
};
function rpow(r: Rational, e: number): Rational {
	let o = q(1);
	for (let i = 0; i < e; i++) o = o.mul(r);
	return o;
}
const divisors = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
/** "10, 6 e 4" */
const listIt = (xs: (number | string)[]): string => (xs.length === 1 ? `${xs[0]}` : `${xs.slice(0, -1).join(', ')} \\text{ e } ${xs[xs.length - 1]}`);
const coef = (a: number): string => (a === 1 ? '' : a === -1 ? '-' : `${a}`);

/** A denominator with only the prime factors 2 and 5: the number has a finite decimal expansion. */
const isDecimal = (d: number): boolean => {
	while (d % 2 === 0) d /= 2;
	while (d % 5 === 0) d /= 5;
	return d === 1;
};
/** 3/100 -> 0{,}03, 4/5 -> 0{,}8 (the denominator must have only the factors 2 and 5). */
function decTex(r: Rational): string {
	let k = 0;
	while (ipow(10, k) % r.den !== 0) k++;
	const s = String((Math.abs(r.num) * ipow(10, k)) / r.den).padStart(k + 1, '0');
	const sign = r.num < 0 ? '-' : '';
	return k === 0 ? `${sign}${s}` : `${sign}${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

type Style = 'int' | 'frac' | 'dec';
const numTex = (r: Rational, style: Style): string => (style === 'dec' && isDecimal(r.den) ? decTex(r) : r.toLatex());
/** A radicand as written under the root: 144, \dfrac{1}{32}, 0{,}09, with its sign. */
function radicandTex(r: Rational, style: Style): string {
	if (style === 'dec') return decTex(r);
	if (r.isInteger()) return `${r.num}`;
	return `${r.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
}
/** A positive base under an exponent: 3, \left(\frac{1}{2}\right), 0{,}3. */
function baseTex(r: Rational, style: Style): string {
	if (style === 'dec') return decTex(r);
	if (r.isInteger()) return `${r.num}`;
	return `\\left(${r.toLatex()}\\right)`;
}

/** Positive fraction a/b in lowest terms, not an integer, a and b at most max. */
function fraction(rng: Rng, max: number): Rational | null {
	const a = rng.int(1, max), b = rng.int(2, max);
	if (a === b || gcd(a, b) !== 1) return null;
	return q(a, b);
}

/** buildChoice, or null when the mistakes do not give three distinct wrong options (the sample is then drawn again). */
function tryChoice(rng: Rng, correct: ChoiceOption, wrong: ChoiceOption[]): ChoiceAnswer | null {
	try {
		return buildChoice(rng, correct, wrong);
	} catch {
		return null;
	}
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'] | null;
	params: Record<string, unknown>;
	/** Option of the correct answer and the distractors, most typical mistake first (absent when the answer is a choice). */
	correct?: ChoiceOption;
	wrong?: ChoiceOption[];
}

// ---------------------------------------------------------------------------
// Level 1: compute a root

type L1Case = 'quadrata' | 'indice' | 'frazione' | 'decimale' | 'negativo' | 'non esiste';

function l1Option(tag: string, style: Style): ChoiceOption {
	if (tag === 'none') return { latex: '\\text{non esiste in } \\mathbb{R}', values: ['none'] };
	if (tag.startsWith('pm:')) return { latex: `\\pm ${numTex(Rational.parse(tag.slice(3)), style)}`, values: [tag] };
	const r = Rational.parse(tag);
	return { latex: numTex(r, style), values: [r.toString()] };
}

function buildL1(rng: Rng, c: L1Case): Built | null {
	let n: number, b: Rational, style: Style = 'int';
	let sign = 1;
	if (c === 'quadrata') {
		n = 2;
		b = q(rng.int(2, 20));
	} else if (c === 'indice') {
		n = weighted(rng, [
			[3, 3],
			[4, 2],
			[5, 1],
		]);
		b = q(rng.int(2, n === 3 ? 10 : n === 4 ? 5 : 3));
	} else if (c === 'frazione') {
		n = weighted(rng, [
			[2, 3],
			[3, 2],
			[4, 1],
			[5, 1],
		]);
		const f = fraction(rng, n === 2 ? 12 : n === 3 ? 5 : 3);
		if (!f || (n === 5 && f.num > 2) || rpow(f, n).den > 1000) return null;
		b = f;
		style = 'frac';
	} else if (c === 'decimale') {
		n = rng.next() < 0.7 ? 2 : 3;
		const k = n === 2 ? rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]) : rng.int(1, 9);
		b = q(k, 10);
		style = 'dec';
	} else if (c === 'negativo') {
		n = rng.next() < 0.75 ? 3 : 5;
		style = weighted<Style>(rng, [
			['int', 6],
			['frac', 2.5],
			['dec', 1.5],
		]);
		if (style === 'int') b = q(rng.int(1, n === 3 ? 6 : 3));
		else if (style === 'frac') {
			const f = fraction(rng, n === 3 ? 5 : 3);
			if (!f || (n === 5 && f.num > 2)) return null;
			b = f;
		} else {
			if (n === 5) return null;
			b = q(rng.int(1, 5), 10);
		}
		sign = -1;
	} else {
		n = weighted(rng, [
			[2, 3],
			[4, 2],
			[6, 0.5],
		]);
		if (rng.next() < 0.25) {
			const f = fraction(rng, n === 2 ? 9 : 3);
			if (!f || n === 6) return null;
			b = f;
			style = 'frac';
		} else b = q(rng.int(n === 2 ? 1 : 2, n === 2 ? 12 : n === 4 ? 4 : 2));
		sign = -1;
	}
	if (b.isOne() && c !== 'negativo') return null;
	const pw = rpow(b, n);
	const rad = sign < 0 ? pw.neg() : pw;
	const radT = radicandTex(rad, style);
	const head = rt(n, radT);
	const exists = c !== 'non esiste';
	const value = exists ? (sign < 0 ? b.neg() : b) : null;
	const powStep = `${baseTex(b, style)}^{${n}} = ${radicandTex(pw, style)}`;
	const steps: string[] = [];
	const wrong: string[] = [];
	const pm = `pm:${b}`;
	if (c === 'non esiste') {
		steps.push(`\\text{L'indice } ${n} \\text{ è pari e il radicando è negativo.}`);
		steps.push(`\\text{Una potenza con esponente pari non è mai negativa: nessun numero reale elevato alla } ${n} \\text{ dà } ${radT}\\text{.}`);
		wrong.push(b.neg().toString(), b.toString(), pm);
	} else if (c === 'negativo') {
		steps.push(`\\text{L'indice } ${n} \\text{ è dispari: la radice esiste e ha il segno del radicando.}`);
		steps.push(`${head} = -${rt(n, radicandTex(pw, style))}`);
		steps.push(`\\text{Perché } ${powStep}\\text{, } ${rt(n, radicandTex(pw, style))} = ${numTex(b, style)}`);
		steps.push(`${head} = ${numTex(b.neg(), style)}`);
		wrong.push(b.toString(), 'none', pm);
		if (style === 'dec') wrong.push(b.neg().div(q(10)).toString());
		if (style === 'frac') wrong.push(q(-b.num, b.den ** n).toString());
		if (style === 'int' && b.num > 1 && pw.num % n === 0 && pw.num / n !== b.num) wrong.push(q(-pw.num / n).toString());
		wrong.push(b.neg().add(q(-1)).toString());
	} else {
		steps.push(`\\text{Cerca il numero maggiore o uguale a zero che elevato alla } ${n} \\text{ dà } ${radT}\\text{.}`);
		steps.push(`${powStep}\\text{, quindi } ${head} = ${numTex(b, style)}`);
		if (n % 2 === 0) steps.push(`\\text{Anche } ${style === 'int' ? `(${numTex(b.neg(), style)})` : `\\left(${numTex(b.neg(), style)}\\right)`}^{${n}} = ${radicandTex(pw, style)}\\text{, ma la radice è il numero positivo.}`);
		wrong.push(pm);
		if (style === 'dec') {
			wrong.push(b.div(q(10)).toString(), b.mul(q(10)).toString());
		} else if (style === 'frac') {
			wrong.push(q(b.num, b.den ** n).toString(), q(b.num ** n, b.den).toString(), q(b.den, b.num).toString());
		} else {
			if (pw.num % n === 0 && pw.num / n !== b.num) wrong.push(q(pw.num / n).toString());
			const s = Math.round(Math.sqrt(pw.num));
			if (n > 2 && s * s === pw.num && s !== b.num) wrong.push(q(s).toString());
			if (n === 2 && pw.num <= 1000) wrong.push(q(pw.num).toString());
		}
		wrong.push(b.neg().toString(), b.add(q(1)).toString());
	}
	const solution = value ? `${head} = ${numTex(value, style)}` : `${head} \\text{ non esiste in } \\mathbb{R}`;
	const correct = l1Option(value ? value.toString() : 'none', style);
	const wrongOpts = wrong.map((t) => l1Option(t, style));
	const params = { index: n, radicand: rad.toString(), style, case: c, wrong };
	const prompt = 'Calcola la radice, se esiste tra i numeri reali.';
	if (!value) {
		return { case: c, prompt, problem: head, solution, steps, answer: tryChoice(rng, correct, wrongOpts), params };
	}
	return { case: c, prompt, problem: head, solution, steps, answer: { kind: 'number', value: value.toString() }, params, correct, wrong: wrongOpts };
}

// ---------------------------------------------------------------------------
// Level 2: conditions of existence

type Rel = 'ge' | 'le' | 'gt' | 'lt' | 'ne' | 'eq';
type Bound = { rel: Rel; r: Rational };
type Cond = Bound | { rel: 'all' | 'none' };

const condKey = (c: Cond): string => ('r' in c ? `${c.rel}:${c.r}` : c.rel);
const REL_TEX: Record<Rel, string> = { ge: '\\ge', le: '\\le', gt: '>', lt: '<', ne: '\\neq', eq: '=' };
function condTex(c: Cond): string {
	if (!('r' in c)) return c.rel === 'all' ? '\\text{ogni } x \\in \\mathbb{R}' : '\\text{nessun } x \\in \\mathbb{R}';
	return `x ${REL_TEX[c.rel]} ${c.r.toLatex()}`;
}
const condOption = (c: Cond): ChoiceOption => ({ latex: condTex(c), values: [condKey(c)] });
const cond = (rel: Rel, r: Rational): Bound => ({ rel, r });

/** ax + b, with the constant first when only it is positive, as in the lesson ("5 - x"). */
export function linTex(a: number, b: number, v = 'x'): string {
	if (a > 0) return b === 0 ? `${coef(a)}${v}` : `${coef(a)}${v} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
	if (b > 0) return `${b} - ${coef(-a)}${v}`;
	return b === 0 ? `-${coef(-a)}${v}` : `-${coef(-a)}${v} - ${-b}`;
}

type L2Case = 'pari' | 'dispari' | 'sempre' | 'nulla' | 'denominatore pari' | 'denominatore dispari';

function buildL2(rng: Rng, c: L2Case): Built | null {
	const even = () =>
		weighted(rng, [
			[2, 4],
			[4, 2],
			[6, 1],
		]);
	const odd = () => (rng.next() < 0.75 ? 3 : 5);
	const steps: string[] = [];
	let n: number, body: string, form: string, a: number, b: number, answer: Cond;
	let k: number | undefined;
	const wrong: Cond[] = [];
	if (c === 'pari' || c === 'dispari') {
		n = c === 'pari' ? even() : odd();
		let r: Rational;
		if (rng.next() < 0.7) {
			a = rng.pick([1, 2, 3, 4, 5]) * (rng.next() < 0.35 ? -1 : 1);
			r = q(rng.int(-9, 9));
		} else {
			const d = rng.pick([2, 3, 4, 5]);
			a = d * (rng.next() < 0.35 ? -1 : 1);
			const p = rng.int(-9, 9);
			if (gcd(p, d) !== 1) return null;
			r = q(p, d);
		}
		if (r.isZero()) return null;
		b = r.mul(q(-a)).num;
		if (Math.abs(b) > 30) return null;
		form = 'lin';
		body = linTex(a, b);
		const main = a > 0 ? cond('ge', r) : cond('le', r);
		if (c === 'pari') {
			answer = main;
			steps.push(`\\text{L'indice } ${n} \\text{ è pari: il radicando deve essere maggiore o uguale a zero.}`);
			steps.push(`${body} \\ge 0`);
			if (b !== 0) steps.push(`${coef(a)}x \\ge ${-b}`);
			if (a < 0) steps.push(`\\text{Dividi per } ${a}\\text{: il numero è negativo e il verso cambia.}`);
			else if (a > 1) steps.push(`\\text{Dividi per } ${a}\\text{.}`);
			wrong.push(a > 0 ? cond('le', r) : cond('ge', r), cond(main.rel, r.neg()), cond(a > 0 ? 'gt' : 'lt', r), { rel: 'all' });
		} else {
			answer = { rel: 'all' };
			steps.push(`\\text{L'indice } ${n} \\text{ è dispari e non ci sono denominatori: il radicale esiste per ogni valore di } x\\text{.}`);
			wrong.push(main, a > 0 ? cond('le', r) : cond('ge', r), cond(a > 0 ? 'gt' : 'lt', r), cond('ne', r));
		}
	} else if (c === 'sempre') {
		n = even();
		form = 'quad';
		a = rng.pick([1, 1, 1, 2, 3]);
		b = rng.int(1, 9);
		body = `${coef(a)}x^2 + ${b}`;
		answer = { rel: 'all' };
		steps.push(`\\text{Un quadrato non è mai negativo: } ${coef(a)}x^2 \\ge 0\\text{, quindi } ${body} \\ge ${b}\\text{.}`);
		steps.push(`\\text{Il radicando è sempre positivo: il radicale esiste per ogni valore di } x\\text{.}`);
		wrong.push(cond('ge', q(0)), cond('ge', q(-b, a)), { rel: 'none' }, cond('ne', q(0)));
	} else if (c === 'nulla') {
		n = even();
		form = 'negsq';
		if (rng.next() < 0.5) {
			a = rng.pick([1, 1, 2, 3, 4]);
			b = 0;
			body = `-${coef(a)}x^2`;
		} else {
			a = 1;
			b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
			body = `-(${linTex(1, -b)})^2`;
		}
		answer = cond('eq', q(b));
		const sq = b === 0 ? `${coef(a)}x^2` : `(${linTex(1, -b)})^2`;
		steps.push(`\\text{L'indice } ${n} \\text{ è pari: serve } ${body} \\ge 0\\text{, cioè } ${sq} \\le 0\\text{.}`);
		steps.push(`\\text{Un quadrato è minore o uguale a zero solo quando vale zero: } ${b === 0 ? 'x' : linTex(1, -b)} = 0\\text{.}`);
		wrong.push({ rel: 'none' }, cond('le', q(b)), { rel: 'all' });
		if (b !== 0) wrong.push(cond('eq', q(-b)));
		else wrong.push(cond('ge', q(0)));
	} else if (c === 'denominatore pari') {
		n = rng.next() < 0.8 ? 2 : 4;
		form = 'frac';
		k = rng.int(1, 9);
		const cc = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
		// k / (x - cc) or k / (cc - x)
		const flip = rng.next() < 0.35;
		a = flip ? -1 : 1;
		b = flip ? cc : -cc;
		const den = linTex(a, b);
		body = `\\dfrac{${k}}{${den}}`;
		answer = flip ? cond('lt', q(cc)) : cond('gt', q(cc));
		steps.push(`\\text{L'indice } ${n} \\text{ è pari: la frazione deve essere maggiore o uguale a zero, e il denominatore diverso da zero.}`);
		steps.push(`\\text{Il numeratore } ${k} \\text{ è positivo, quindi serve } ${den} > 0\\text{.}`);
		wrong.push(flip ? cond('le', q(cc)) : cond('ge', q(cc)), cond('ne', q(cc)), flip ? cond('gt', q(cc)) : cond('lt', q(cc)), flip ? cond('lt', q(-cc)) : cond('gt', q(-cc)));
	} else {
		n = odd();
		form = 'frac';
		k = rng.int(1, 9);
		const cc = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
		a = 1;
		b = cc;
		const den = linTex(1, cc);
		body = `\\dfrac{${k}}{${den}}`;
		answer = cond('ne', q(-cc));
		steps.push(`\\text{L'indice } ${n} \\text{ è dispari: resta solo la condizione sul denominatore.}`);
		steps.push(`${den} \\neq 0`);
		wrong.push(cond('gt', q(-cc)), cond('ne', q(cc)), { rel: 'all' }, cond('ge', q(-cc)));
	}
	steps.push(`\\text{C.E.: } ${condTex(answer)}`);
	const problem = rt(n, body);
	const correct = condOption(answer);
	return {
		case: c,
		prompt: 'Scrivi le condizioni di esistenza del radicale.',
		problem,
		solution: `\\text{C.E.: } ${condTex(answer)}`,
		steps,
		answer: tryChoice(rng, correct, wrong.map(condOption)),
		params: { index: n, form, a, b, k, case: c },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the root of a power, sqrt(x^2) = |x|

/** px + s as LaTeX and SymPy. */
const binTex = (p: number, s: number, v: string): string => linTex(p, s, v);
const binSym = (p: number, s: number, v: string): string => `${p}*${v} + (${s})`;
const exprOption = (latex: string, sym: string): ChoiceOption => ({ latex, values: [sym] });

type L3Case = 'binomio pari' | 'monomio' | 'binomio dispari' | 'trinomio';

function buildL3(rng: Rng, c: L3Case): Built | null {
	const steps: string[] = [];
	const wrong: ChoiceOption[] = [];
	let problem: string, ansTex: string, ansSym: string, n: number;
	let v = 'x', p = 1, s = 0;
	if (c === 'monomio') {
		v = rng.pick(['x', 'a']);
		n = rng.next() < 0.6 ? 2 : 4;
		p = n === 2 ? rng.int(2, 9) : rng.int(1, 3);
		const cn = ipow(p, n);
		problem = rt(n, `${coef(cn)}${v}^${n}`);
		ansTex = `${coef(p)}|${v}|`;
		ansSym = `${p}*Abs(${v})`;
		if (p > 1) steps.push(`${coef(cn)}${v}^${n} = (${p}${v})^${n}`);
		steps.push(`\\text{L'indice } ${n} \\text{ è pari: la radice di una potenza con esponente } ${n} \\text{ è il valore assoluto della base.}`);
		steps.push(p > 1 ? `${rt(n, `(${p}${v})^${n}`)} = |${p}${v}| = ${ansTex}` : `${problem} = ${ansTex}`);
		wrong.push(exprOption(`${coef(p)}${v}`, `${p}*${v}`), exprOption(`-${coef(p)}${v}`, `-${p}*${v}`));
		if (p > 1) wrong.push(exprOption(`${cn}|${v}|`, `${cn}*Abs(${v})`));
		wrong.push(exprOption(`${coef(p)}${v}^${n}`, `${p}*${v}**${n}`));
	} else {
		p = c === 'trinomio' ? rng.pick([1, 1, 1, 2, 3]) : rng.pick([1, 1, 1, 1, 2, 3]);
		s = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		if (gcd(p, s) !== 1) return null;
		const B = binTex(p, s, v), Bs = binSym(p, s, v);
		const minusB = linTex(-p, -s, v), minusBs = `-(${Bs})`;
		const flipB = binTex(p, -s, v), flipBs = binSym(p, -s, v);
		if (c === 'binomio pari' || c === 'trinomio') {
			ansTex = `|${B}|`;
			ansSym = `Abs(${Bs})`;
			if (c === 'binomio pari') {
				n = rng.next() < 0.75 ? 2 : 4;
				problem = rt(n, `(${B})^${n}`);
				steps.push(`\\text{L'indice } ${n} \\text{ è pari: la radice di una potenza con esponente } ${n} \\text{ è il valore assoluto della base.}`);
				steps.push(`${problem} = ${ansTex}`);
			} else {
				n = 2;
				if (p * p * 1 > 9 || s * s > 81) return null;
				const tri = `${coef(p * p)}${v}^2 ${s < 0 ? '-' : '+'} ${2 * p * Math.abs(s)}${v} + ${s * s}`;
				problem = rt(2, tri);
				steps.push(`\\text{Il radicando è il quadrato di un binomio: } ${tri} = (${B})^2`);
				steps.push(`${rt(2, `(${B})^2`)} = ${ansTex}`);
				wrong.push(exprOption(`${coef(p)}|${v}| + ${Math.abs(s)}`, `${p}*Abs(${v}) + ${Math.abs(s)}`));
			}
			wrong.unshift(exprOption(B, Bs));
			wrong.push(exprOption(minusB, minusBs), exprOption(`|${flipB}|`, `Abs(${flipBs})`), exprOption(flipB, flipBs));
		} else {
			n = rng.next() < 0.75 ? 3 : 5;
			problem = rt(n, `(${B})^${n}`);
			ansTex = B;
			ansSym = Bs;
			steps.push(`\\text{L'indice } ${n} \\text{ è dispari: la radice conserva il segno, e il valore assoluto non serve.}`);
			steps.push(`${problem} = ${ansTex}`);
			wrong.push(exprOption(`|${B}|`, `Abs(${Bs})`), exprOption(minusB, minusBs), exprOption(flipB, flipBs), exprOption(`|${flipB}|`, `Abs(${flipBs})`));
		}
	}
	return {
		case: c,
		prompt: 'Scrivi senza radice.',
		problem,
		solution: `${problem} = ${ansTex}`,
		steps,
		answer: { kind: 'expression', value: ansSym, latex: ansTex },
		params: { index: n, variable: v, p, s, case: c },
		correct: exprOption(ansTex, ansSym),
		wrong,
	};
}

// ---------------------------------------------------------------------------
// Level 4: simplify a numeric radical

interface PF {
	p: number;
	e: number;
}
const pfValue = (fs: PF[]): number => fs.reduce((acc, f) => acc * ipow(f.p, f.e), 1);
const pfTex = (fs: PF[]): string => fs.map((f) => (f.e === 1 ? `${f.p}` : `${f.p}^{${f.e}}`)).join(' \\cdot ');
/** The radicand as a number up to 2000, as a product of powers beyond. */
const pfShow = (fs: PF[]): string => (pfValue(fs) <= 2000 ? `${pfValue(fs)}` : pfTex(fs));
const numRadOption = (k: number, fs: PF[], show = pfShow(fs)): ChoiceOption => ({ latex: rt(k, show), values: [symRoot(k, String(pfValue(fs)))] });

type L4Case = 'numero' | 'fattori' | 'irriducibile';

function buildL4(rng: Rng, c: L4Case): Built | null {
	const PR = [2, 3, 5, 7];
	const steps: string[] = [];
	const wrong: ChoiceOption[] = [];
	if (c === 'irriducibile') {
		const n = rng.pick([4, 6, 8, 9, 10, 12]);
		const [p1, p2] = shuffle(rng, PR).slice(0, 2);
		const E1 = rng.int(2, n - 1), E2 = rng.int(1, n - 1);
		const g1 = gcd(n, E1);
		if (g1 === 1 || gcd(g1, E2) !== 1) return null;
		const fs: PF[] = [
			{ p: Math.min(p1, p2), e: p1 < p2 ? E1 : E2 },
			{ p: Math.max(p1, p2), e: p1 < p2 ? E2 : E1 },
		];
		const P = pfValue(fs);
		if (P > 5000) return null;
		const numeric = P <= 2000 && rng.next() < 0.5;
		const show = numeric ? `${P}` : pfTex(fs);
		const problem = rt(n, show);
		if (numeric) steps.push(`\\text{Scomponi il radicando: } ${P} = ${pfTex(fs)}`);
		steps.push(`\\text{Il MCD tra } ${listIt([n, ...fs.map((f) => f.e)])} \\text{ è } 1\\text{: il radicale è già irriducibile.}`);
		// the mistakes: divide by g1 only the index and the exponent that allows it
		const i1 = fs.findIndex((f) => f.e === E1 && gcd(n, f.e) === g1);
		const half = fs.map((f, i) => (i === i1 ? { p: f.p, e: f.e / g1 } : f));
		wrong.push(numRadOption(n / g1, half), numRadOption(n / g1, fs), numRadOption(n, half), numRadOption(n / g1, [half[i1]]));
		const correct: ChoiceOption = { latex: problem, values: [symRoot(n, String(P))] };
		return {
			case: c,
			prompt: 'Semplifica il radicale, se si può.',
			problem,
			solution: `${problem} \\text{ è irriducibile}`,
			steps,
			answer: { kind: 'expression', value: symRoot(n, String(P)), latex: problem, form: 'irreducible' },
			params: { index: n, factors: fs, shown: numeric ? 'numero' : 'fattori', case: c },
			correct,
			wrong,
		};
	}
	const m = weighted(rng, [
		[2, 4],
		[3, 3],
		[4, 1],
		[5, 1],
	]);
	const g = weighted(rng, [
		[2, 4],
		[3, 3],
		[4, 1.5],
		[5, 1],
	]);
	const n = m * g;
	if (n > 20) return null;
	const count = c === 'fattori' ? 2 : rng.next() < 0.6 ? 1 : 2;
	const ps = shuffle(rng, PR)
		.slice(0, count)
		.sort((x, y) => x - y);
	const red: PF[] = ps.map((p) => ({ p, e: rng.int(1, m - 1 || 1) }));
	if (gcdAll([m, ...red.map((f) => f.e)]) !== 1) return null;
	const N = pfValue(red);
	if (N > 500) return null;
	const orig: PF[] = red.map((f) => ({ p: f.p, e: f.e * g }));
	const P = pfValue(orig);
	if (c === 'numero' && P > 5000) return null;
	if (c === 'fattori' && P <= 200) return null;
	if (P > 1e7) return null;
	const show = c === 'numero' ? `${P}` : pfTex(orig);
	const problem = rt(n, show);
	const ansTex = rt(m, `${N}`);
	if (c === 'numero') steps.push(`\\text{Scomponi il radicando: } ${P} = ${pfTex(orig)}`);
	steps.push(`\\text{Il MCD tra } ${listIt([n, ...orig.map((f) => f.e)])} \\text{ è } ${g}\\text{: dividi l'indice e gli esponenti per } ${g}\\text{.}`);
	const divided = orig.map((f) => `${f.p}^{${f.e} : ${g}}`).join(' \\cdot ');
	steps.push(`${rt(n, pfTex(orig))} = \\sqrt[${n} : ${g}]{${divided}} = ${rt(m, pfTex(red))}${red.length > 1 || red[0].e > 1 ? ` = ${ansTex}` : ''}`);
	// mistakes
	wrong.push(numRadOption(m, orig));
	wrong.push(numRadOption(n, red));
	if (orig.length === 2) {
		wrong.push(numRadOption(m, [red[0], orig[1]], pfTex([red[0], orig[1]])), numRadOption(m, [orig[0], red[1]], pfTex([orig[0], red[1]])));
	}
	for (const d of divisors(g).filter((d) => d > 1 && d < g)) wrong.push(numRadOption(n / d, orig.map((f) => ({ p: f.p, e: f.e / d }))));
	// divided by a divisor of the index that does not divide the exponents
	for (const d of divisors(n).filter((d) => d > 1 && d < n && d !== g && gcdAll(orig.map((f) => f.e)) % d !== 0)) wrong.push(numRadOption(n / d, red));
	return {
		case: c,
		prompt: 'Semplifica il radicale, se si può.',
		problem,
		solution: `${problem} = ${ansTex}`,
		steps,
		answer: { kind: 'expression', value: symRoot(m, String(N)), latex: ansTex, form: 'irreducible' },
		params: { index: n, factors: orig, shown: c === 'numero' ? 'numero' : 'fattori', case: c },
		correct: { latex: ansTex, values: [symRoot(m, String(N))] },
		wrong,
	};
}

// ---------------------------------------------------------------------------
// Level 5: simplify with letters

interface LF {
	v: string;
	/** the base is v + c */
	c: number;
	e: number;
	abs: boolean;
}
interface LRad {
	k: number;
	fs: LF[];
}
const lbase = (f: LF): string => (f.c === 0 ? f.v : linTex(1, f.c, f.v));
function lfTex(f: LF): string {
	const b = lbase(f);
	if (f.abs) return f.e === 1 ? `|${b}|` : `|${b}|^{${f.e}}`;
	if (f.c === 0) return f.e === 1 ? b : `${b}^{${f.e}}`;
	return f.e === 1 ? b : `(${b})^{${f.e}}`;
}
function lfSym(f: LF): string {
	const b = f.c === 0 ? f.v : `(${f.v} + (${f.c}))`;
	const x = f.abs ? `Abs(${b})` : b;
	return f.e === 1 ? x : `${x}**${f.e}`;
}
const lradTex = (r: LRad): string => rt(r.k, r.fs.map(lfTex).join(' '));
const lradSym = (r: LRad): string => symReal(r.k, r.fs.map(lfSym).join('*'));
const lradOption = (r: LRad): ChoiceOption => ({ latex: lradTex(r), values: [lradSym(r)] });
/** Value at an assignment of the letters; NaN where the radical does not exist. */
function lradEval(r: LRad, at: Record<string, number>): number {
	let R = 1;
	for (const f of r.fs) {
		const b = at[f.v] + f.c;
		R *= (f.abs ? Math.abs(b) : b) ** f.e;
	}
	if (r.k % 2 === 0 && R < 0) return NaN;
	return Math.sign(R) * Math.abs(R) ** (1 / r.k);
}
const irreducible = (r: LRad): boolean => gcdAll([r.k, ...r.fs.map((f) => f.e)]) === 1;
const TEST = [-7, -5, -3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3, 5, 7];
function points(vars: string[]): Record<string, number>[] {
	if (vars.length === 1) return TEST.map((t) => ({ [vars[0]]: t }));
	const out: Record<string, number>[] = [];
	for (const s of TEST) for (const t of TEST) out.push({ [vars[0]]: s, [vars[1]]: t });
	return out;
}
/** Same value wherever the original radical exists. */
function sameValue(a: LRad, orig: LRad): boolean {
	const vars = [...new Set(orig.fs.map((f) => f.v))];
	return points(vars).every((at) => {
		const t = lradEval(orig, at);
		if (Number.isNaN(t)) return true;
		const x = lradEval(a, at);
		return !Number.isNaN(x) && Math.abs(x - t) < 1e-9 * Math.max(1, Math.abs(t));
	});
}

type L5Case = 'valore assoluto' | 'senza valore assoluto' | 'indice dispari' | 'condizioni';

function buildL5(rng: Rng, c: L5Case): Built | null {
	let m: number, g: number;
	if (c === 'valore assoluto') {
		g = rng.next() < 0.8 ? 2 : 4;
		m = g === 4 ? rng.pick([2, 3]) : weighted(rng, [
			[2, 3],
			[3, 3],
			[5, 1],
		]);
	} else if (c === 'senza valore assoluto') {
		m = rng.next() < 0.6 ? 3 : 5;
		g = m === 3 && rng.next() < 0.3 ? 4 : 2;
	} else if (c === 'indice dispari') {
		[m, g] = rng.pick([
			[3, 3],
			[3, 5],
			[5, 3],
		]);
	} else {
		[m, g] = rng.pick([
			[2, 3],
			[2, 5],
			[4, 3],
		]);
	}
	const n = m * g;
	// the bases
	const shape = c === 'condizioni' ? (rng.next() < 0.5 ? 'lettera' : 'binomio') : weighted(rng, [
		['lettera', 3],
		['binomio', 2],
		['due lettere', 3],
	]);
	const vars = shape === 'due lettere' ? ['a', 'b'] : [rng.pick(['x', 'a'])];
	const cs = shape === 'binomio' ? [rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])] : vars.map(() => 0);
	if (shape === 'binomio') vars[0] = 'x';
	const es = vars.map(() => rng.int(1, Math.max(1, m - 1)));
	if (gcdAll([m, ...es]) !== 1) return null;
	if (c === 'valore assoluto' && !es.some((e) => e % 2 === 1)) return null;
	if (c === 'senza valore assoluto' && es.some((e) => e % 2 === 1)) return null;
	if (c === 'condizioni' && es[0] % 2 === 0) return null;
	if (shape === 'due lettere' && es[0] === es[1] && m > 2) return null;
	const needAbs = n % 2 === 0 && c !== 'condizioni';
	const orig: LRad = { k: n, fs: vars.map((v, i) => ({ v, c: cs[i], e: es[i] * g, abs: false })) };
	const ans: LRad = { k: m, fs: vars.map((v, i) => ({ v, c: cs[i], e: es[i], abs: needAbs && es[i] % 2 === 1 })) };
	if (orig.fs.some((f) => f.e > 12)) return null;
	const problem = lradTex(orig);
	const ansTex = lradTex(ans);
	const steps: string[] = [];
	if (c === 'condizioni') {
		const f = orig.fs[0];
		steps.push(`\\text{L'indice } ${n} \\text{ è pari: C.E.: } ${lfTex(f)} \\ge 0\\text{, cioè } ${f.v} \\ge ${-f.c}`);
	} else if (n % 2 === 0) steps.push(`\\text{Gli esponenti sono pari: il radicando non è mai negativo e il radicale esiste per ogni valore ${vars.length > 1 ? 'delle lettere' : `di } ${vars[0]} \\text{`}.}`);
	else steps.push(`\\text{L'indice } ${n} \\text{ è dispari: il radicale esiste per ogni valore ${vars.length > 1 ? 'delle lettere' : `di } ${vars[0]} \\text{`}.}`);
	steps.push(`\\text{Il MCD tra } ${listIt([n, ...orig.fs.map((f) => f.e)])} \\text{ è } ${g}\\text{: dividi l'indice e gli esponenti per } ${g}\\text{.}`);
	if (c === 'indice dispari') steps.push(`\\text{L'indice di partenza è dispari: il valore assoluto non serve.}`);
	else if (c === 'condizioni') steps.push(`\\text{Con le C.E. la base non è negativa: il valore assoluto non serve.}`);
	else
		for (const f of ans.fs)
			steps.push(
				f.e % 2 === 1
					? `\\text{L'indice di partenza è pari e l'esponente di } ${lbase(f)} \\text{ diventa } ${f.e}\\text{, dispari: serve il valore assoluto.}`
					: `\\text{L'esponente di } ${lbase(f)} \\text{ diventa } ${f.e}\\text{, pari: il valore assoluto non serve.}`,
			);
	steps.push(`${problem} = ${ansTex}`);
	// mistakes
	const cands: LRad[] = [];
	const noAbs = (r: LRad): LRad => ({ k: r.k, fs: r.fs.map((f) => ({ ...f, abs: false })) });
	if (ans.fs.some((f) => f.abs)) cands.push(noAbs(ans));
	if (c === 'indice dispari' && ans.fs.some((f) => f.e % 2 === 1)) cands.push({ k: m, fs: ans.fs.map((f) => ({ ...f, abs: f.e % 2 === 1 })) });
	cands.push({ k: m, fs: orig.fs }, { k: n, fs: ans.fs.map((f) => ({ ...f, abs: false })) });
	if (ans.fs.length === 2) {
		cands.push({ k: m, fs: [ans.fs[0], orig.fs[1]] }, { k: m, fs: [orig.fs[0], ans.fs[1]] });
		if (ans.fs.some((f) => f.abs)) cands.push({ k: m, fs: ans.fs.map((f) => ({ ...f, abs: !f.abs })) });
	}
	for (const d of divisors(g).filter((d) => d > 1 && d < g)) cands.push({ k: n / d, fs: orig.fs.map((f) => ({ ...f, e: f.e / d })) });
	for (const d1 of divisors(n).filter((d) => d > 1))
		for (const d2 of divisors(gcdAll(orig.fs.map((f) => f.e))))
			if (d1 !== d2) cands.push({ k: n / d1, fs: orig.fs.map((f) => ({ ...f, e: f.e / d2, abs: false })) });
	const wrong = cands
		.filter((r) => r.k >= 2 && (!sameValue(r, orig) || !irreducible(r)))
		.map(lradOption)
		.slice(0, 8);
	if (!sameValue(ans, orig) || !irreducible(ans)) throw new Error(`${ID}: level 5 answer is wrong`);
	return {
		case: c,
		prompt: 'Semplifica il radicale. Le lettere possono avere qualunque valore reale per cui il radicale esiste.',
		problem,
		solution: `${problem} = ${ansTex}`,
		steps,
		answer: { kind: 'expression', value: lradSym(ans), latex: ansTex, form: 'irreducible' },
		params: { index: n, factors: orig.fs.map((f) => ({ v: f.v, c: f.c, e: f.e })), case: c },
		correct: lradOption(ans),
		wrong,
	};
}

// ---------------------------------------------------------------------------
// Level 6: same index

/** A radicand at the common index: a number or x^e. */
type Term = { k: number; a: number } | { k: number; e: number };
const termBody = (t: Term): string => ('a' in t ? `${t.a}` : t.e === 1 ? 'x' : `x^{${t.e}}`);
const termTex = (t: Term): string => rt(t.k, termBody(t));
const listTex = (ts: Term[]): string => ts.map(termTex).join(',\\ ');
const listKey = (L: number, bodies: (number | string)[]): string => `${L}|${bodies.join('|')}`;

type L6Case = 'due' | 'tre' | 'lettere';

function buildL6(rng: Rng, c: L6Case): Built | null {
	const count = c === 'tre' ? 3 : c === 'due' ? 2 : rng.next() < 0.6 ? 2 : 3;
	const idx = shuffle(rng, [2, 3, 4, 5, 6]).slice(0, count);
	const L = lcmAll(idx);
	if (L > 12 || L === Math.max(...idx)) return null;
	const fac = idx.map((k) => L / k);
	const steps: string[] = [];
	let items: Term[];
	let target: Term[];
	const opt = (ts: Term[], L2 = L): ChoiceOption => ({ latex: listTex(ts.map((t) => ({ ...t, k: L2 }))), values: [listKey(L2, ts.map(termBody))] });
	const wrongOpts: ChoiceOption[] = [];
	if (c === 'lettere') {
		const es = idx.map((k) => rng.int(1, k - 1));
		if (idx.some((k, i) => gcd(k, es[i]) !== 1)) return null;
		items = idx.map((k, i) => ({ k, e: es[i] }));
		target = idx.map((k, i) => ({ k: L, e: es[i] * fac[i] }));
		steps.push(`\\text{C'è un radicale con indice pari: C.E.: } x \\ge 0\\text{. Così tutti i radicandi sono positivi o nulli.}`);
		wrongOpts.push(
			opt(es.map((e) => ({ k: L, e }))),
			opt(es.map((e, i) => ({ k: L, e: e + fac[i] }))),
			opt(es.map((e, i) => ({ k: L, e: e * idx[i] }))),
		);
		es.forEach((_, j) => wrongOpts.push(opt(es.map((e, i) => ({ k: L, e: i === j ? e : e * fac[i] })))));
		const prod = idx.reduce((a, b) => a * b, 1);
		if (prod !== L && prod <= 60) wrongOpts.push(opt(es.map((e, i) => ({ k: prod, e: (e * prod) / idx[i] })), prod));
	} else {
		const as = idx.map(() => rng.pick([2, 3, 5, 6, 7, 10]));
		if (new Set(as).size < as.length) return null;
		const vals = as.map((a, i) => ipow(a, fac[i]));
		if (vals.some((v) => v > 2000)) return null;
		items = idx.map((k, i) => ({ k, a: as[i] }));
		target = idx.map((k, i) => ({ k: L, a: vals[i] }));
		wrongOpts.push(opt(as.map((a) => ({ k: L, a }))), opt(as.map((a, i) => ({ k: L, a: a * fac[i] }))));
		const own = as.map((a, i) => ipow(a, idx[i]));
		if (own.every((v) => v <= 5000)) wrongOpts.push(opt(own.map((a) => ({ k: L, a }))));
		const prod = idx.reduce((a, b) => a * b, 1);
		const pv = as.map((a, i) => ipow(a, prod / idx[i]));
		if (prod !== L && pv.every((v) => v <= 5000)) wrongOpts.push(opt(pv.map((a) => ({ k: prod, a })), prod));
		// one radical left as it was
		as.forEach((_, j) => wrongOpts.push(opt(as.map((a, i) => ({ k: L, a: i === j ? a : vals[i] })))));
		const rev = [...fac].reverse();
		const sw = as.map((a, i) => ipow(a, rev[i]));
		if (sw.every((v) => v <= 5000)) wrongOpts.push(opt(sw.map((a) => ({ k: L, a }))));
	}
	steps.push(`\\text{Il MCM tra } ${listIt(idx)} \\text{ è } ${L}\\text{: è il nuovo indice.}`);
	items.forEach((t, i) => {
		const why = `\\quad (${L} : ${t.k} = ${fac[i]})`;
		if ('e' in t && t.e === 1) steps.push(`${termTex(t)} = ${termTex(target[i])} ${why}`);
		else steps.push(`${termTex(t)} = ${rt(L, 'a' in t ? `${t.a}^{${fac[i]}}` : `x^{${t.e} \\cdot ${fac[i]}}`)} = ${termTex(target[i])} ${why}`);
	});
	const correct = opt(target);
	const sortedBodies = (o: ChoiceOption) => o.values[0].split('|').slice(1).sort().join('|') + '@' + o.values[0].split('|')[0];
	const perm = sortedBodies(correct);
	return {
		case: c,
		prompt: 'Riduci i radicali allo stesso indice, il più piccolo possibile.',
		problem: items.map(termTex).join(' \\quad '),
		solution: listTex(target),
		steps,
		answer: tryChoice(rng, correct, wrongOpts.filter((o) => sortedBodies(o) !== perm)),
		params: { items, index: L, case: c },
	};
}

// ---------------------------------------------------------------------------
// Level 7: compare and order

/** s·root(a, k), or the integer a when k = 1. */
interface Item {
	s: 1 | -1;
	k: number;
	a: number;
}
function itemTex(t: Item): string {
	if (t.k === 1) return `${t.s * t.a}`;
	if (t.a < 0) return rt(t.k, `${t.a}`);
	return `${t.s < 0 ? '-' : ''}${rt(t.k, `${t.a}`)}`;
}
const itemValue = (t: Item): number => t.s * Math.sign(t.a) * Math.abs(t.a) ** (1 / t.k);
/** |value| as root(k) of a positive integer */
const absK = (t: Item): number => (t.k === 1 ? 1 : t.k);
const absA = (t: Item): number => Math.abs(t.a);

type L7Case = 'positivi' | 'intero' | 'negativi';

function orderOption(items: Item[], ord: number[]): ChoiceOption {
	return { latex: ord.map((i) => itemTex(items[i])).join(' < '), values: [`ord:${ord.join(',')}`] };
}
const PERMS = [
	[0, 1, 2],
	[0, 2, 1],
	[1, 0, 2],
	[1, 2, 0],
	[2, 0, 1],
	[2, 1, 0],
];

function buildL7(rng: Rng, c: L7Case): Built | null {
	let items: Item[];
	if (c === 'positivi') {
		const ks = [rng.pick([2, 3, 4, 6]), rng.pick([2, 3, 4, 6]), rng.pick([2, 3, 4, 6])];
		if (new Set(ks).size < 2) return null;
		items = ks.map((k) => ({ s: 1, k, a: rng.int(2, 12) }));
	} else if (c === 'intero') {
		const k0 = rng.pick([2, 3]);
		const ks = shuffle(rng, [2, 3, 4]).slice(0, 2);
		items = [{ s: 1, k: 1, a: k0 }, ...ks.map((k): Item => ({ s: 1, k, a: ipow(k0, k) + rng.pick([-3, -2, -1, 1, 2, 3]) }))];
		items = shuffle(rng, items);
	} else {
		const ks = [rng.pick([2, 3, 4, 5]), rng.pick([2, 3, 4, 5]), rng.pick([2, 3, 4, 5])];
		if (new Set(ks).size < 2) return null;
		items = ks.map((k) => {
			const a = rng.int(2, 10);
			// odd index: sometimes the minus sign under the root
			return k % 2 === 1 && rng.next() < 0.6 ? { s: 1, k, a: -a } : { s: -1, k, a };
		});
		if (!items.some((t) => t.a < 0) || !items.some((t) => t.s < 0)) return null;
	}
	// no radical that is an integer: each radicand is not a perfect power for its index
	for (const t of items) {
		if (t.k === 1) continue;
		const r = Math.round(Math.abs(t.a) ** (1 / t.k));
		if (ipow(r, t.k) === Math.abs(t.a) || ipow(r + 1, t.k) === Math.abs(t.a) || (r > 1 && ipow(r - 1, t.k) === Math.abs(t.a))) return null;
	}
	const L = lcmAll(items.map(absK));
	if (L > 12) return null;
	const conv = items.map((t) => ipow(absA(t), L / absK(t)));
	if (conv.some((v) => v > 5000) || new Set(conv).size < 3) return null;
	const truth = [0, 1, 2].sort((i, j) => itemValue(items[i]) - itemValue(items[j]));
	// the trap: ordering by the radicands shown (their absolute values) gives another order
	const byRad = [0, 1, 2].sort((i, j) => absA(items[i]) - absA(items[j]) || i - j);
	if (c !== 'negativi' && byRad.join() === truth.join()) return null;
	const steps: string[] = [];
	if (c === 'negativi') {
		const outs = items.filter((t) => t.a < 0);
		steps.push(`\\text{Porta fuori il segno meno: } ${outs.map((t) => `${itemTex(t)} = -${rt(t.k, `${-t.a}`)}`).join(',\\ ')}`);
		steps.push(`\\text{Confronta i radicali aritmetici, senza il segno meno.}`);
	}
	steps.push(`\\text{Il MCM tra gli indici } ${listIt([...new Set(items.filter((t) => t.k > 1).map((t) => t.k))])} \\text{ è } ${L}\\text{.}`);
	items.forEach((t, i) => {
		const k = absK(t);
		const plain = t.k === 1 ? `${t.a}` : rt(t.k, `${absA(t)}`);
		if (L === k) steps.push(`${plain} \\text{ ha già indice } ${L}`);
		else steps.push(`${plain} = ${rt(L, `${absA(t)}^{${L / k}}`)} = ${rt(L, `${conv[i]}`)}`);
	});
	const absOrder = [0, 1, 2].sort((i, j) => conv[i] - conv[j]);
	steps.push(`\\text{I radicandi in ordine crescente: } ${absOrder.map((i) => conv[i]).join(' < ')}`);
	if (c === 'negativi') steps.push(`\\text{Tra gli opposti l'ordine si rovescia, come tra } -3 \\text{ e } -2\\text{.}`);
	const sol = truth.map((i) => itemTex(items[i])).join(' < ');
	steps.push(sol);
	const byIndex = [0, 1, 2].sort((i, j) => absK(items[j]) - absK(items[i]) || i - j);
	const rev = [...truth].reverse();
	const candidates = [byRad, rev, byIndex, ...shuffle(rng, PERMS)].filter((o) => o.join() !== truth.join()).map((o) => orderOption(items, o));
	return {
		case: c,
		prompt: 'Scrivi i numeri in ordine crescente.',
		problem: items.map(itemTex).join(' \\quad '),
		solution: sol,
		steps,
		answer: tryChoice(rng, orderOption(items, truth), candidates),
		params: { items, case: c },
	};
}

// ---------------------------------------------------------------------------
// Assembly

/** The case of each level with its weight: drawn once per exercise, so that rejections do not change the shares. */
const CASES: Record<number, [string, number][]> = {
	1: [
		['quadrata', 2],
		['indice', 2],
		['frazione', 1.5],
		['decimale', 1.5],
		['negativo', 2],
		['non esiste', 1.5],
	],
	2: [
		['pari', 3],
		['dispari', 1.5],
		['sempre', 1],
		['nulla', 1],
		['denominatore pari', 1.5],
		['denominatore dispari', 1],
	],
	3: [
		['binomio pari', 3],
		['monomio', 2],
		['binomio dispari', 2],
		['trinomio', 3],
	],
	4: [
		['numero', 4.5],
		['fattori', 3.5],
		['irriducibile', 2],
	],
	5: [
		['valore assoluto', 3.5],
		['senza valore assoluto', 2],
		['indice dispari', 2],
		['condizioni', 2.5],
	],
	6: [
		['due', 3.5],
		['tre', 4],
		['lettere', 2.5],
	],
	7: [
		['positivi', 6],
		['intero', 2],
		['negativi', 2],
	],
};

function build(rng: Rng, level: number, c: string): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng, c as L1Case);
		case 2:
			return buildL2(rng, c as L2Case);
		case 3:
			return buildL3(rng, c as L3Case);
		case 4:
			return buildL4(rng, c as L4Case);
		case 5:
			return buildL5(rng, c as L5Case);
		case 6:
			return buildL6(rng, c as L6Case);
		case 7:
			return buildL7(rng, c as L7Case);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length || !sample.solution) v.push('passaggi o soluzione mancanti');
	if (/\+\s*-|-\s*-|\+\s*\+|\^\{1\}|\d\.\d/.test(sample.problem)) v.push('segni doppi, esponente 1 o punto decimale');
	const ans = sample.answer;
	if (lvl === 1) {
		const n = p.index as number;
		const rad = Rational.parse(p.radicand as string);
		if (ans.kind === 'number') {
			const r = Rational.parse(ans.value);
			if (!rpow(r, n).equals(rad) || (n % 2 === 0 && r.sign() < 0)) v.push('la radice non torna');
		} else if (ans.kind !== 'choice' || n % 2 !== 0 || rad.sign() >= 0) v.push('"non esiste" solo con indice pari e radicando negativo');
	} else if (lvl === 2) {
		if (ans.kind !== 'choice') v.push('serve una scelta');
	} else if (lvl === 3 || lvl === 4 || lvl === 5) {
		if (ans.kind !== 'expression') v.push('serve un’espressione');
		if (lvl === 3 && ans.kind === 'expression' && ans.latex.includes('sqrt')) v.push('la risposta ha ancora la radice');
	} else if (lvl === 6 || lvl === 7) {
		if (ans.kind !== 'choice') v.push('serve una scelta');
	} else v.push(`livello sconosciuto ${lvl}`);
	if (lvl === 6) {
		const items = p.items as Term[];
		if (p.index !== lcmAll(items.map((t) => t.k))) v.push('indice comune diverso dal MCM');
	}
	if (lvl === 7) {
		const items = p.items as Item[];
		const vals = items.map(itemValue);
		if (new Set(vals.map((x) => x.toFixed(9))).size !== 3) v.push('valori non distinti');
	}
	if (ans.kind === 'choice' && ans.options.length !== 4) v.push('servono quattro opzioni');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const extra = sample.params.options as { correct: ChoiceOption; wrong: ChoiceOption[] } | undefined;
	if (!extra) throw new Error(`${ID}: no options in params`);
	return buildChoice(rng, extra.correct, extra.wrong);
}

export const numeriRealiRadici: Generator = {
	id: ID,
	title: 'Radicali e loro proprietà',
	levels: {
		1: { label: 'Calcolare una radice', constraints: ['radici quadrate, cubiche, quarte e quinte di interi, frazioni e decimali', 'indice dispari con radicando negativo', 'indice pari con radicando negativo: non esiste'] },
		2: { label: 'Condizioni di esistenza', constraints: ['radicando di primo grado con indice pari o dispari', 'radicando sempre positivo o nullo in un punto', 'denominatore sotto radice'] },
		3: { label: 'La radice di una potenza', constraints: ['indice pari: valore assoluto', 'indice dispari: niente valore assoluto', 'trinomi quadrati di un binomio'] },
		4: { label: 'Semplificare un radicale numerico', constraints: ['MCD tra indice ed esponenti', 'radicale finale irriducibile', 'circa 2 su 10 già irriducibili'] },
		5: { label: 'Semplificare con le lettere', constraints: ['valore assoluto quando l’indice di partenza è pari e l’esponente finale dispari', 'indice dispari e C.E. senza valore assoluto'] },
		6: { label: 'Ridurre allo stesso indice', constraints: ['due o tre radicali, indice comune il MCM (al massimo 12)', 'circa 1 su 4 con la lettera x'] },
		7: { label: 'Confrontare e ordinare', constraints: ['tre numeri in ordine crescente', 'l’ordine dei radicandi non è quello giusto', 'un intero o radicali negativi in circa 2 su 10 ciascuno'] },
	},
	generate(rng: Rng, level: number): Sample {
		if (!CASES[level]) throw new Error(`${ID}: unknown level ${level}`);
		const c = weighted(rng, CASES[level]);
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = build(rng, level, c);
			if (!b || !b.answer) continue;
			const params: Record<string, unknown> = { ...b.params };
			if (b.correct && b.wrong) params.options = { correct: b.correct, wrong: b.wrong };
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params,
			};
			if (check(sample).length > 0) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRealiRadici;
