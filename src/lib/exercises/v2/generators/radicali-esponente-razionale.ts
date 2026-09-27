/**
 * Potenze con esponente razionale. Spec: specs/exercises/radicali-esponente-razionale.md
 *
 * Seven levels in the order of the lesson: from a power to a radical and back, powers with a perfect
 * base, negative, fractional and decimal exponents, one radical from two with different indices,
 * three powers brought to the same base, letters (integer part out, nested radicals), awkward cases
 * (negative radicand, a result to rationalise, true or false on negative bases).
 *
 * Every value is a power of one base with a rational exponent, built backwards from the answer: the
 * exponent arithmetic is exact (Rational), the LaTeX and the SymPy strings are written from it.
 * Letters stand for positive numbers, as in the lesson.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, shuffle, weighted } from '../razionali';

export const ID = 'radicali-esponente-razionale';

type Base = number | 'a';

/** A wrong (or right) option: LaTeX, SymPy value, and a float (letters at a = A_TEST) to keep options distinct. */
interface Opt {
	latex: string;
	value: string;
	num: number;
}

const A_TEST = 2.37;
const ipow = (b: number, k: number): number => b ** k;
const numOf = (B: Base, e: Rational): number => (B === 'a' ? A_TEST : B) ** (e.num / e.den);

// ---------------------------------------------------------------------------
// LaTeX

/** An exponent: 2, -3, \frac{2}{3}, -\frac{1}{2}. */
const expTex = (e: Rational): string => e.toLatex();

/** B^{e}; the exponent 1 is not written. */
export function powTex(B: Base, e: Rational): string {
	return e.isOne() ? `${B}` : `${B}^{${expTex(e)}}`;
}

export const rootTex = (n: number, rad: string): string => (n === 2 ? `\\sqrt{${rad}}` : `\\sqrt[${n}]{${rad}}`);

/** The radicand B^j: the number itself when `expand` (2^5 -> 32), otherwise B^{j}. */
function radicand(B: Base, j: number, expand: boolean): string {
	if (j === 1) return `${B}`;
	if (B !== 'a' && expand) return `${ipow(B, j)}`;
	return `${B}^{${j}}`;
}

/**
 * B^e as the lesson writes a result: a radical with the smallest index, the integer part of the
 * exponent outside (a^{17/12} = a\sqrt[12]{a^5}), 1/(...) for a negative exponent.
 */
export function radTex(B: Base, e: Rational, expand = true): string {
	if (e.sign() < 0) return `\\frac{1}{${radTex(B, e.neg(), expand)}}`;
	if (e.isZero()) return '1';
	const k = Math.floor(e.num / e.den);
	const f = e.sub(q(k));
	let out = '';
	if (k >= 1) out = B === 'a' ? powTex('a', q(k)) : `${ipow(B, k)}`;
	if (f.isZero()) return out;
	return out + rootTex(f.den, radicand(B, f.num, expand));
}

/** B^e in SymPy. */
const sym = (B: Base, e: Rational): string => (e.isOne() ? `${B}` : `${B}**(${e.toString()})`);

const powOpt = (B: Base, e: Rational): Opt => ({ latex: radTex(B, e), value: sym(B, e), num: numOf(B, e) });
const ratOpt = (r: Rational): Opt => ({ latex: r.toLatex(), value: r.toString(), num: r.num / r.den });

/** A decimal exponent as the lesson writes it: 0{,}4, -1{,}5. */
function decTex(e: Rational): string {
	const d = e.den === 2 ? 10 : e.den === 5 ? 10 : 100;
	const n = Math.abs(e.num) * (d / e.den);
	const int = Math.floor(n / d);
	const frac = String(n % d).padStart(d === 10 ? 1 : 2, '0');
	return `${e.sign() < 0 ? '-' : ''}${int}{,}${frac}`;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	/** Mistakes for the multiple choice, most typical first. */
	wrong: Opt[];
	data: Record<string, unknown>;
}

const reduced = (m: number, n: number) => gcd(m, n) === 1;

/** Perfect powers A = c^n with A <= 256 and the exponent m/n (reduced, not an integer), c^m <= 256. */
interface Perfect {
	c: number;
	n: number;
	m: number;
}
const PERFECT: Perfect[] = [];
for (let n = 2; n <= 6; n++)
	for (let c = 2; ipow(c, n) <= 256 && c <= 15; c++)
		for (let m = 1; m <= 6; m++) if (m !== n && reduced(m, n) && m % n !== 0 && ipow(c, m) <= 256) PERFECT.push({ c, n, m });

// Level 1 ----------------------------------------------------------------

const L1_BASES: Base[] = [2, 3, 5, 6, 7, 10, 11, 'a', 'a'];

function buildL1(rng: Rng): Built | null {
	const B = rng.pick(L1_BASES);
	const n = rng.int(2, 7);
	const m = rng.int(1, 5);
	if (m === n || !reduced(m, n)) return null;
	const e = q(m, n);
	const toRadical = rng.next() < 0.5;
	const rad = rootTex(n, radicand(B, m, false));
	const pow = powTex(B, e);
	const letter = B === 'a' ? ', con a > 0' : '';
	const wrong: Opt[] = [];
	if (toRadical) {
		if (m >= 2) wrong.push({ latex: rootTex(m, radicand(B, n, false)), value: sym(B, q(n, m)), num: numOf(B, q(n, m)) });
		else wrong.push({ latex: powTex(B, q(n)), value: sym(B, q(n)), num: numOf(B, q(n)) });
		wrong.push({ latex: `\\frac{1}{${rad}}`, value: `1/(${sym(B, e)})`, num: 1 / numOf(B, e) });
		if (m >= 2) wrong.push({ latex: rootTex(n, `${m} \\cdot ${B}`), value: `(${m}*${B})**(1/${n})`, num: ((B === 'a' ? A_TEST : B) * m) ** (1 / n) });
		else wrong.push({ latex: `\\frac{${B}}{${n}}`, value: `${B}/${n}`, num: (B === 'a' ? A_TEST : B) / n });
		wrong.push({ latex: powTex(B, q(m * n)), value: sym(B, q(m * n)), num: numOf(B, q(m * n)) });
	} else {
		const sw = q(n, m);
		wrong.push({ latex: powTex(B, sw), value: sym(B, sw), num: numOf(B, sw) });
		wrong.push({ latex: powTex(B, e.neg()), value: sym(B, e.neg()), num: numOf(B, e.neg()) });
		if (m >= 2) wrong.push({ latex: powTex(B, q(1, n)), value: sym(B, q(1, n)), num: numOf(B, q(1, n)) });
		else wrong.push({ latex: `\\frac{${B}}{${n}}`, value: `${B}/${n}`, num: (B === 'a' ? A_TEST : B) / n });
		wrong.push({ latex: powTex(B, q(m * n)), value: sym(B, q(m * n)), num: numOf(B, q(m * n)) });
	}
	const step = toRadical
		? `\\text{Il denominatore } ${n} \\text{ diventa l'indice, il numeratore } ${m} \\text{ l'esponente del radicando: } ${pow} = ${rad}`
		: `\\text{L'indice } ${n} \\text{ diventa il denominatore, l'esponente } ${m} \\text{ del radicando il numeratore: } ${rad} = ${pow}`;
	return {
		case: toRadical ? 'radicale' : 'potenza',
		prompt: toRadical ? `Scrivi la potenza come radicale${letter}.` : `Scrivi il radicale come potenza${letter}.`,
		problem: toRadical ? pow : rad,
		solution: toRadical ? `${pow} = ${rad}` : `${rad} = ${pow}`,
		steps: [step],
		answer: { kind: 'expression', value: sym(B, e), latex: toRadical ? rad : pow, form: toRadical ? 'radical' : 'power' },
		wrong,
		data: { base: String(B), exp: e.toString(), dir: toRadical ? 'radicale' : 'potenza' },
	};
}

// Level 2 ----------------------------------------------------------------

/** Steps for A^{m/n} = (root)^m with A = c^n, m/n possibly negative. */
function perfectSteps(A: number, c: number, n: number, e: Rational): string[] {
	const m = Math.abs(e.num);
	const v = powValue(c, e);
	const head = `${A}^{${expTex(e)}}`;
	const root = `\\sqrt${n === 2 ? '' : `[${n}]`}{${A}} = ${c}`;
	if (e.sign() > 0) {
		if (m === 1) return [`${head} = ${root}`];
		return [`\\text{Prima la radice: } ${root}`, `\\text{Poi la potenza: } ${head} = ${c}^{${m}} = ${v.toLatex()}`];
	}
	const pos = e.neg();
	return [
		`\\text{L'esponente negativo dà il reciproco: } ${head} = \\frac{1}{${A}^{${expTex(pos)}}}`,
		`${root}${m === 1 ? '' : `\\text{, e } ${c}^{${m}} = ${ipow(c, m)}`}`,
		`${head} = ${v.toLatex()}`,
	];
}

function powValue(c: number, e: Rational): Rational {
	// c^(m) where e = m/n is applied to A = c^n: the value is c^m.
	const m = e.num;
	return m >= 0 ? q(ipow(c, m)) : q(1, ipow(c, -m));
}

function buildL2(rng: Rng): Built | null {
	const { c, n, m } = rng.pick(PERFECT);
	const A = ipow(c, n);
	const e = q(m, n);
	const v = q(ipow(c, m));
	const wrong = [q(A).mul(e), ...(m >= 2 ? [q(c), q(c * m)] : []), q(1).div(v), v.neg(), q(A)].map(ratOpt);
	const problem = `${A}^{${expTex(e)}}`;
	return {
		case: m === 1 ? 'numeratore 1' : 'numeratore maggiore di 1',
		prompt: 'Calcola.',
		problem,
		solution: `${problem} = ${v.toLatex()}`,
		steps: perfectSteps(A, c, n, e),
		answer: { kind: 'number', value: v.toString() },
		wrong,
		data: { A, c, n, exp: e.toString() },
	};
}

// Level 3 ----------------------------------------------------------------

const DECIMALS = [q(1, 2), q(3, 2), q(5, 2), q(1, 4), q(3, 4), q(5, 4), q(1, 5), q(2, 5), q(3, 5), q(4, 5), q(-1, 2), q(-3, 2), q(-1, 4), q(-3, 4), q(-2, 5)];

/** Draws the case once and retries inside it, so that rejections do not change the shares. */
function withCase(rng: Rng, cases: [string, number][], make: (rng: Rng, kind: string) => Built | null): Built | null {
	const kind = weighted(rng, cases);
	for (let i = 0; i < 2000; i++) {
		const b = make(rng, kind);
		if (b && enoughWrong(b)) return b;
	}
	return null;
}

/** The typical mistakes alone must give three wrong options distinct in value: no filler. */
function enoughWrong(b: Built): boolean {
	if (b.answer.kind === 'choice') return true;
	return distinctWrong(answerNum({ answer: b.answer } as Sample), b.wrong).length >= 3;
}

function buildL3(rng: Rng): Built | null {
	return withCase(
		rng,
		[
			['negativo', 4],
			['frazione', 3],
			['decimale', 3],
		],
		buildL3Case,
	);
}

function buildL3Case(rng: Rng, kind: string): Built | null {
	if (kind === 'negativo') {
		const { c, n, m } = rng.pick(PERFECT);
		const A = ipow(c, n);
		const e = q(-m, n);
		const v = q(1, ipow(c, m));
		const problem = `${A}^{${expTex(e)}}`;
		return {
			case: kind,
			prompt: 'Calcola.',
			problem,
			solution: `${problem} = ${v.toLatex()}`,
			steps: perfectSteps(A, c, n, e),
			answer: { kind: 'number', value: v.toString() },
			wrong: [q(-ipow(c, m)), q(ipow(c, m)), v.neg(), q(A).mul(e)].map(ratOpt),
			data: { A, c, n, exp: e.toString() },
		};
	}
	if (kind === 'frazione') {
		const n = weighted(rng, [
			[2, 6],
			[3, 3],
			[4, 1],
		] as [number, number][]);
		const max = n === 2 ? 9 : n === 3 ? 4 : 3;
		const u = rng.int(1, max), w = rng.int(2, max);
		if (u === w || !reduced(u, w)) return null;
		const m = rng.int(1, 3);
		if (m === n || !reduced(m, n)) return null;
		const s = rng.next() < 0.7 ? -1 : 1;
		const e = q(s * m, n);
		const P = ipow(u, n), Q = ipow(w, n);
		const v = s > 0 ? q(ipow(u, m), ipow(w, m)) : q(ipow(w, m), ipow(u, m));
		if (v.num > 216 || v.den > 216) return null;
		const base = q(P, Q);
		const problem = `\\left(${base.toLatex()}\\right)^{${expTex(e)}}`;
		const steps: string[] = [];
		let cur = base;
		if (s < 0) {
			cur = q(Q, P);
			const curTex = cur.isInteger() ? `${cur.num}` : `\\left(${cur.toLatex()}\\right)`;
			steps.push(`\\text{L'esponente negativo scambia numeratore e denominatore: } ${problem} = ${curTex}^{${expTex(e.neg())}}`);
		}
		const r = s > 0 ? q(u, w) : q(w, u);
		const root = `${rootTex(n, cur.toLatex())} = ${r.toLatex()}`;
		steps.push(m === 1 ? root : `\\text{Prima la radice: } ${root}\\text{, poi la potenza: } \\left(${r.toLatex()}\\right)^{${m}} = ${v.toLatex()}`);
		const wrong = [q(1).div(v), v.neg(), ...(m >= 2 ? [r, q(1).div(r)] : []), base.mul(e.abs())].map(ratOpt);
		return {
			case: kind,
			prompt: 'Calcola.',
			problem,
			solution: `${problem} = ${v.toLatex()}`,
			steps,
			answer: { kind: 'number', value: v.toString() },
			wrong,
			data: { base: base.toString(), exp: e.toString() },
		};
	}
	const e = rng.pick(DECIMALS);
	const n = e.den;
	const m = Math.abs(e.num);
	const cs = PERFECT.filter((p) => p.n === n && p.m === m);
	if (!cs.length) return null;
	const { c } = rng.pick(cs);
	const A = ipow(c, n);
	const v = powValue(c, e);
	const d = decTex(e);
	const problem = `${A}^{${d}}`;
	const dd = e.den === 4 ? 100 : 10;
	const raw = `\\frac{${Math.abs(e.num) * (dd / e.den)}}{${dd}}`;
	const conv = `${d} = ${e.sign() < 0 ? '-' : ''}${raw} = ${expTex(e)}`;
	const steps = [`\\text{Scrivi l'esponente come frazione: } ${conv}`, ...perfectSteps(A, c, n, e)];
	const wrong = [q(A).mul(e), ...(m >= 2 ? [q(c)] : []), v.neg(), q(1).div(v), q(c * m)].map(ratOpt);
	return {
		case: kind,
		prompt: 'Calcola.',
		problem,
		solution: `${problem} = ${A}^{${expTex(e)}} = ${v.toLatex()}`,
		steps,
		answer: { kind: 'number', value: v.toString() },
		wrong,
		data: { A, c, n, exp: e.toString(), decimal: d },
	};
}

// Level 4 ----------------------------------------------------------------

interface Rad {
	k: number;
	n: number;
}
const RAD_PRIMES: Record<number, number> = { 2: 6, 3: 4, 5: 2, 7: 2 };

function pickRad(rng: Rng, p: number): Rad | null {
	const n = rng.int(2, 8);
	const k = rng.int(1, Math.min(n - 1, RAD_PRIMES[p]));
	return reduced(k, n) ? { k, n } : null;
}

const radE = (r: Rad) => q(r.k, r.n);
const radLatex = (p: number, r: Rad, sign = '') => rootTex(r.n, `${sign}${ipow(p, r.k)}`);

/** Exponent fits as a result: positive, index up to 12, radicand up to 1000. */
function fits(p: number, e: Rational, maxDen = 12): boolean {
	if (e.sign() <= 0 || e.isInteger() || e.den > maxDen) return false;
	const f = e.num % e.den;
	return ipow(p, f) <= 1000 && ipow(p, Math.floor(e.num / e.den)) <= 100;
}

function expOpts(B: Base, exps: Rational[], ok: (e: Rational) => boolean): Opt[] {
	return exps.filter(ok).map((e) => powOpt(B, e));
}

/** Sum or difference of two exponents with the common denominator, as the lesson writes it. */
function expSum(a: Rational, b: Rational, op: '+' | '-'): string {
	const d = lcm(a.den, b.den);
	const r = op === '+' ? a.add(b) : a.sub(b);
	const na = a.num * (d / a.den), nb = b.num * (d / b.den);
	const mid = a.den === d && b.den === d ? '' : ` = \\frac{${na}}{${d}} ${op} \\frac{${nb}}{${d}}`;
	return `${expTex(a)} ${op} ${expTex(b)}${mid} = ${expTex(r)}`;
}

function buildL4(rng: Rng): Built | null {
	return withCase(
		rng,
		[
			['prodotto', 6],
			['quoziente', 4],
		],
		(r, kind) => buildL4Case(r, kind === 'quoziente'),
	);
}

function buildL4Case(rng: Rng, div: boolean): Built | null {
	const p = weighted(rng, [
		[2, 5],
		[3, 3],
		[5, 1],
		[7, 1],
	] as [number, number][]);
	const r1 = pickRad(rng, p), r2 = pickRad(rng, p);
	if (!r1 || !r2 || r1.n === r2.n) return null;
	const e1 = radE(r1), e2 = radE(r2);
	const e = div ? e1.sub(e2) : e1.add(e2);
	if (!fits(p, e) || e.compare(q(1)) >= 0) return null;
	const op = div ? ':' : '\\cdot';
	const problem = `${radLatex(p, r1)} ${op} ${radLatex(p, r2)}`;
	const asPow = `${powTex(p, e1)} ${op} ${powTex(p, e2)}`;
	const steps = [
		`\\text{Scrivi i radicali come potenze di } ${p}\\text{: } ${problem} = ${asPow}`,
		`\\text{${div ? 'Sottrai' : 'Somma'} gli esponenti: } ${expSum(e1, e2, div ? '-' : '+')}`,
		e.num === 1 ? `${powTex(p, e)} = ${radTex(p, e)}` : `${powTex(p, e)} = ${rootTex(e.den, radicand(p, e.num, false))} = ${radTex(p, e)}`,
	];
	const ok = (x: Rational) => !x.isZero() && x.den <= 30 && ipow(p, Math.abs(x.num) % x.den) <= 1000 && ipow(p, Math.floor(Math.abs(x.num) / x.den)) <= 100;
	const cands = div
		? [e1.add(e2), e1.mul(e2), r1.n !== r2.n && r1.k !== r2.k ? q(r1.k - r2.k, r1.n - r2.n) : null, e2.sub(e1), e1.div(e2)]
		: [e1.mul(e2), q(r1.k + r2.k, r1.n + r2.n), e1.sub(e2).abs(), e1.div(e2)];
	return {
		case: div ? 'quoziente' : 'prodotto',
		prompt: 'Scrivi come un solo radicale.',
		problem,
		solution: `${problem} = ${radTex(p, e)}`,
		steps,
		answer: { kind: 'expression', value: sym(p, e), latex: radTex(p, e), form: 'simplified' },
		wrong: expOpts(p, cands.filter((x): x is Rational => x !== null), ok),
		data: { p, rads: [r1, r2], op: div ? 'div' : 'mul' },
	};
}

// Level 5 ----------------------------------------------------------------

/** Exponents of the bases: 4 to 64 as powers of 2, 9, 27, 81 as powers of 3. */
const L5_BASES: Record<number, number[]> = { 2: [2, 3, 4, 5, 6], 3: [2, 3, 4] };

function buildL5(rng: Rng): Built | null {
	const p = rng.next() < 0.7 ? 2 : 3;
	const as = shuffle(rng, L5_BASES[p]).slice(0, 3);
	if (as.length < 3) return null;
	const ts = as.map(() => rng.int(-3, 3));
	if (ts.some((t, i) => t === 0 || t % as[i] === 0)) return null;
	if (!ts.some((t) => t < 0)) return null;
	const order: ('mul' | 'div')[] = rng.next() < 0.5 ? ['mul', 'div'] : ['div', 'mul'];
	const signs = [1, order[0] === 'mul' ? 1 : -1, order[1] === 'mul' ? 1 : -1];
	const k = ts.reduce((s, t, i) => s + signs[i] * t, 0);
	if (Math.abs(k) > 3 || ipow(p, Math.abs(k)) > 125) return null;
	const val = (x: number) => (x >= 0 ? q(ipow(p, x)) : q(1, ipow(p, -x)));
	const v = val(k);
	const rs = ts.map((t, i) => q(t, as[i]));
	const terms = as.map((a, i) => `${ipow(p, a)}^{${expTex(rs[i])}}`);
	const problem = `${terms[0]} ${order[0] === 'mul' ? '\\cdot' : ':'} ${terms[1]} ${order[1] === 'mul' ? '\\cdot' : ':'} ${terms[2]}`;
	const steps = [
		`\\text{Le basi sono potenze di } ${p}\\text{: } ${as.map((a) => `${ipow(p, a)} = ${p}^{${a}}`).join(',\\ ')}`,
		...as.map((a, i) => `${terms[i]} = \\left(${p}^{${a}}\\right)^{${expTex(rs[i])}} = ${powTex(p, q(ts[i]))}`),
	];
	const kSeq = ts.map((t, i) => (i === 0 ? `${t}` : `${signs[i] > 0 ? (t < 0 ? '-' : '+') : t < 0 ? '+' : '-'} ${Math.abs(t)}`)).join(' ');
	const pk = k === 1 ? '' : ` = ${p}^{${k}}`;
	steps.push(`${p}^{${kSeq}}${pk} = ${v.toLatex()}`);
	const allSum = ts.reduce((s, t) => s + t, 0);
	const noNeg = ts.reduce((s, t, i) => s + signs[i] * Math.abs(t), 0);
	const flipped = ts.reduce((s, t, i) => s + (i === 0 ? t : -signs[i] * t), 0);
	const cands = [allSum, -k, noNeg, flipped].filter((x) => Math.abs(x) <= 6 && ipow(p, Math.abs(x)) <= 5000).map(val);
	cands.push(v.neg());
	return {
		case: order[0] === 'mul' ? 'prodotto e quoziente' : 'quoziente e prodotto',
		prompt: 'Calcola.',
		problem,
		solution: `${problem}${pk} = ${v.toLatex()}`,
		steps,
		answer: { kind: 'number', value: v.toString() },
		wrong: cands.map(ratOpt),
		data: { p, powers: as, ts, ops: order },
	};
}

// Level 6 ----------------------------------------------------------------

function buildL6(rng: Rng): Built | null {
	return withCase(
		rng,
		[
			['prodotto', 1],
			['annidati', 1],
		],
		buildL6Case,
	);
}

function buildL6Case(rng: Rng, kind: string): Built | null {
	if (kind === 'prodotto') {
		const count = rng.next() < 0.5 ? 2 : 3;
		const idx = shuffle(rng, [2, 3, 4, 5, 6]).slice(0, count);
		const rads: Rad[] = idx.map((n) => ({ n, k: rng.int(1, n - 1) }));
		if (rads.some((r) => !reduced(r.k, r.n))) return null;
		const d = rads.reduce((s, r) => lcm(s, r.n), 1);
		if (d > 12) return null;
		const es = rads.map(radE);
		const e = es.reduce((s, x) => s.add(x), q(0));
		if (e.compare(q(1)) <= 0 || e.isInteger() || e.compare(q(3)) > 0) return null;
		const problem = rads.map((r) => rootTex(r.n, radicand('a', r.k, false))).join(' \\cdot ');
		const intPart = Math.floor(e.num / e.den);
		const frac = e.sub(q(intPart));
		const nums = es.map((x) => `\\frac{${x.num * (d / x.den)}}{${d}}`).join(' + ');
		const steps = [
			`\\text{Scrivi i radicali come potenze: } ${problem} = ${es.map((x) => powTex('a', x)).join(' \\cdot ')}`,
			`\\text{Somma gli esponenti: } ${nums} = ${expTex(e)}`,
			`\\text{L'esponente è maggiore di } 1\\text{: } ${expTex(e)} = ${intPart} + ${expTex(frac)}`,
			`${powTex('a', e)} = ${powTex('a', q(intPart))} \\cdot ${powTex('a', frac)} = ${radTex('a', e)}`,
		];
		const wrong: Opt[] = [
			powOpt('a', frac),
			{ latex: `a${rootTex(e.den, radicand('a', e.num, false))}`, value: `a*a**(${e.toString()})`, num: A_TEST ** (1 + e.num / e.den) },
			powOpt('a', q(rads.reduce((s, r) => s + r.k, 0), rads.reduce((s, r) => s + r.n, 0))),
			powOpt('a', es.reduce((s, x) => s.mul(x), q(1))),
		];
		return {
			case: 'prodotto',
			prompt: 'Scrivi come un solo radicale, con a > 0.',
			problem,
			solution: `${problem} = ${radTex('a', e)}`,
			steps,
			answer: { kind: 'expression', value: sym('a', e), latex: radTex('a', e), form: 'simplified' },
			wrong,
			data: { kind: 'prodotto', rads },
		};
	}
	const n = rng.int(2, 4);
	const u = rng.next() < 0.7 ? 1 : 2;
	const m = rng.int(2, 5);
	const v = rng.int(1, m - 1);
	if (!reduced(v, m)) return null;
	const inner = q(u).add(q(v, m));
	const e = inner.div(q(n));
	if (e.isInteger() || e.den > 20) return null;
	const problem = rootTex(n, `${powTex('a', q(u))}${rootTex(m, radicand('a', v, false))}`);
	const steps = [
		`\\text{Dentro la radice: } ${powTex('a', q(u))} \\cdot ${powTex('a', q(v, m))} = a^{${u} + ${expTex(q(v, m))}} = ${powTex('a', inner)}`,
		`\\text{La radice esterna è l'esponente } ${expTex(q(1, n))}\\text{: } \\left(${powTex('a', inner)}\\right)^{${expTex(q(1, n))}} = ${powTex('a', e)}`,
		`${powTex('a', e)} = ${radTex('a', e)}`,
	];
	const cands = [q(u).add(q(v, m * n)), q(u, n).add(q(v, m)), q(v, m * n), inner.add(q(1, n))];
	return {
		case: 'annidati',
		prompt: 'Scrivi come un solo radicale, con a > 0.',
		problem,
		solution: `${problem} = ${radTex('a', e)}`,
		steps,
		answer: { kind: 'expression', value: sym('a', e), latex: radTex('a', e), form: 'simplified' },
		wrong: cands.map((x) => powOpt('a', x)),
		data: { kind: 'annidati', n, u, m, v },
	};
}

// Level 7 ----------------------------------------------------------------

const MEANINGLESS = '\\text{Non ha significato}';

function buildNegRadicand(rng: Rng): Built | null {
	const p = rng.next() < 0.7 ? 2 : 3;
	const n1 = rng.pick([3, 5]);
	const k1 = rng.int(1, Math.min(n1 - 1, RAD_PRIMES[p]));
	const r2 = pickRad(rng, p);
	if (!r2 || r2.n === n1 || !reduced(k1, n1)) return null;
	const r1 = { k: k1, n: n1 };
	const e1 = radE(r1), e2 = radE(r2);
	const e = e1.add(e2);
	if (!fits(p, e) || e.compare(q(1)) >= 0) return null;
	const first = rng.next() < 0.6;
	const neg = radLatex(p, r1, '-');
	const pos = radLatex(p, r2);
	const problem = first ? `${neg} \\cdot ${pos}` : `${pos} \\cdot ${neg}`;
	const res = `-${radTex(p, e)}`;
	const steps = [
		`\\text{L'indice } ${n1} \\text{ è dispari: porta fuori il segno meno, } ${neg} = -${radLatex(p, r1)} = -${powTex(p, e1)}`,
		`\\text{Somma gli esponenti: } ${expSum(e1, e2, '+')}`,
		`-${powTex(p, e)} = ${res}`,
		`\\text{Il risultato è negativo: un numero negativo per uno positivo.}`,
	];
	const neg1 = (x: Rational): Opt => ({ latex: `-${radTex(p, x)}`, value: `-(${sym(p, x)})`, num: -numOf(p, x) });
	const wrong: Opt[] = [powOpt(p, e), { latex: MEANINGLESS, value: 'nonsense', num: Number.NaN }, neg1(e1.mul(e2)), neg1(q(r1.k + r2.k, r1.n + r2.n))];
	return {
		case: 'radicando negativo',
		prompt: 'Scrivi come un solo radicale.',
		problem,
		solution: `${problem} = ${res}`,
		steps,
		answer: { kind: 'expression', value: `-(${sym(p, e)})`, latex: res, form: 'simplified' },
		wrong,
		data: { p, neg: r1, pos: r2, first },
	};
}

function buildRationalize(rng: Rng): Built | null {
	const B = rng.pick([2, 3, 5, 6, 7, 10]);
	const n = weighted(rng, [
		[2, 5],
		[3, 3],
		[4, 2],
	] as [number, number][]);
	const m = rng.int(1, n - 1);
	if (!reduced(m, n) || ipow(B, n - m) > 1000) return null;
	const e = q(-m, n);
	const decimal = (n === 2 || n === 4) && rng.next() < 0.4;
	const problem = `${B}^{${decimal ? decTex(e) : expTex(e)}}`;
	const den = rootTex(n, radicand(B, m, true));
	const num = rootTex(n, radicand(B, n - m, true));
	const res = `\\frac{${num}}{${B}}`;
	const steps: string[] = [];
	if (decimal) steps.push(`\\text{Scrivi l'esponente come frazione: } ${decTex(e)} = ${expTex(e)}`);
	steps.push(`\\text{L'esponente negativo dà il reciproco: } ${B}^{${expTex(e)}} = \\frac{1}{${B}^{${expTex(e.neg())}}} = \\frac{1}{${den}}`);
	steps.push(`\\text{Razionalizza moltiplicando per } ${num}\\text{: } \\frac{1}{${den}} = \\frac{${num}}{${rootTex(n, radicand(B, n, false))}} = ${res}`);
	const wrong: Opt[] = [
		{ latex: `-${res}`, value: `-(${sym(B, e)})`, num: -numOf(B, e) },
		{ latex: den, value: sym(B, e.neg()), num: numOf(B, e.neg()) },
	];
	if (n >= 3) wrong.push({ latex: `\\frac{${den}}{${B}}`, value: `${B}**(${q(m, n).sub(q(1)).toString()})`, num: numOf(B, q(m, n).sub(q(1))) });
	if (B !== n) wrong.push({ latex: `\\frac{${num}}{${n}}`, value: `${B}**(${q(n - m, n).toString()})/${n}`, num: numOf(B, q(n - m, n)) / n });
	wrong.push({ latex: `\\frac{${B}}{${num}}`, value: `${B}**(${q(m, n).toString()})`, num: numOf(B, q(m, n)) });
	return {
		case: 'razionalizzare',
		prompt: 'Calcola e razionalizza il risultato.',
		problem,
		solution: `${problem} = ${res}`,
		steps,
		answer: { kind: 'expression', value: sym(B, e), latex: res, form: 'rationalized' },
		wrong,
		data: { B, exp: e.toString(), decimal },
	};
}

/** A statement of the true-or-false case: LaTeX, whether it is true, the values the checker reads. */
interface Statement {
	latex: string;
	truth: boolean;
	values: string[];
	why: string;
}

const TRIPLES = [
	[3, 4, 5],
	[6, 8, 10],
	[5, 12, 13],
	[8, 15, 17],
	[9, 12, 15],
];

function statement(rng: Rng, family: string, truth: boolean): Statement | null {
	switch (family) {
		case 'radice': {
			const n = rng.pick([3, 5]);
			const c = rng.int(2, n === 3 ? 6 : 3);
			const N = ipow(c, n);
			if (truth)
				return {
					latex: `${rootTex(n, `-${N}`)} = -${N}^{${expTex(q(1, n))}}`,
					truth,
					values: ['root', `${n}`, `-${N}`, `-(${N}**(1/${n}))`],
					why: `\\text{Vera: l'indice } ${n} \\text{ è dispari, il meno si porta fuori e la base di } -${N}^{${expTex(q(1, n))}} \\text{ è } ${N}`,
				};
			return {
				latex: `(-${N})^{${expTex(q(1, n))}} = -${c}`,
				truth,
				values: ['pow', `-${N}`, `1/${n}`, `-${c}`],
				why: `\\text{Falsa: } (-${N})^{${expTex(q(1, n))}} \\text{ non ha significato, perché la base è negativa}`,
			};
		}
		case 'potenza di potenza': {
			const c = rng.int(2, 9);
			const rhs = truth ? c : -c;
			return {
				latex: `\\left[(-${c})^{2}\\right]^{\\frac{1}{2}} = ${rhs}`,
				truth,
				values: ['pp', `-${c}`, `${rhs}`],
				why: truth
					? `\\text{Vera: } (-${c})^{2} = ${c * c} \\text{ e } ${c * c}^{\\frac{1}{2}} = ${c}`
					: `\\text{Falsa: } (-${c})^{2} = ${c * c} \\text{ e } ${c * c}^{\\frac{1}{2}} = ${c}\\text{; con la base negativa non si moltiplicano gli esponenti}`,
			};
		}
		case 'somma': {
			const [x, y, z] = rng.pick(TRIPLES);
			const rhs = truth ? z : x + y;
			return {
				latex: `(${x * x} + ${y * y})^{\\frac{1}{2}} = ${rhs}`,
				truth,
				values: ['sum', `${x * x}`, `${y * y}`, `${rhs}`],
				why: truth
					? `\\text{Vera: } ${x * x} + ${y * y} = ${z * z} \\text{ e } ${z * z}^{\\frac{1}{2}} = ${z}`
					: `\\text{Falsa: } (${x * x} + ${y * y})^{\\frac{1}{2}} = ${z * z}^{\\frac{1}{2}} = ${z}\\text{; l'esponente non si distribuisce sugli addendi}`,
			};
		}
		case 'esponente negativo': {
			const { c, n, m } = rng.pick(PERFECT.filter((p) => ipow(p.c, p.m) <= 64));
			const N = ipow(c, n);
			const e = q(-m, n);
			const v = q(1, ipow(c, m));
			const rhs = truth ? v : q(-ipow(c, m));
			return {
				latex: `${N}^{${expTex(e)}} = ${rhs.toLatex()}`,
				truth,
				values: ['pow', `${N}`, e.toString(), rhs.toString()],
				why: truth
					? `\\text{Vera: } ${N}^{${expTex(e)}} = \\frac{1}{${N}^{${expTex(e.neg())}}} = ${v.toLatex()}`
					: `\\text{Falsa: } ${N}^{${expTex(e)}} = ${v.toLatex()}\\text{; l'esponente negativo dà il reciproco, non un numero negativo}`,
			};
		}
		case 'indice': {
			const cs = PERFECT.filter((p) => p.m >= 2 && p.m <= 3 && p.n <= 4 && ipow(p.c, p.n) <= 64);
			const { c, n, m } = rng.pick(cs);
			const N = ipow(c, n);
			const e = q(m, n);
			const rad = truth ? rootTex(n, `${N}^{${m}}`) : rootTex(m, `${N}^{${n}}`);
			return {
				latex: `${N}^{${expTex(e)}} = ${rad}`,
				truth,
				values: ['pow', `${N}`, e.toString(), truth ? `${N}**(${m}/${n})` : `${N}**(${n}/${m})`],
				why: truth
					? `\\text{Vera: il denominatore } ${n} \\text{ è l'indice, il numeratore } ${m} \\text{ l'esponente del radicando}`
					: `\\text{Falsa: } ${N}^{${expTex(e)}} = ${rootTex(n, `${N}^{${m}}`)} = ${ipow(c, m)}\\text{; il denominatore è l'indice}`,
			};
		}
	}
	return null;
}

const FAMILIES = ['radice', 'potenza di potenza', 'somma', 'esponente negativo', 'indice'];

function buildTrueFalse(rng: Rng): Built | null {
	const fams = shuffle(rng, FAMILIES).slice(0, 4);
	const sts = fams.map((f, i) => statement(rng, f, i === 0));
	if (sts.some((s) => !s)) return null;
	const all = sts as Statement[];
	const order = shuffle(
		rng,
		all.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: all[i].latex, values: all[i].values }));
	const answer: ChoiceAnswer = { kind: 'choice', options, correct: order.indexOf(0) };
	return {
		case: 'vero o falso',
		prompt: 'Quale uguaglianza è vera?',
		problem: '\\text{Una sola delle quattro uguaglianze è vera.}',
		solution: all[0].latex,
		steps: order.map((i) => all[i].why),
		answer,
		wrong: [],
		data: { families: order.map((i) => fams[i]) },
	};
}

function buildL7(rng: Rng): Built | null {
	return withCase(
		rng,
		[
			['radicando negativo', 35],
			['razionalizzare', 35],
			['vero o falso', 30],
		],
		(r, kind) => (kind === 'radicando negativo' ? buildNegRadicand(r) : kind === 'razionalizzare' ? buildRationalize(r) : buildTrueFalse(r)),
	);
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng);
		case 2:
			return buildL2(rng);
		case 3:
			return buildL3(rng);
		case 4:
			return buildL4(rng);
		case 5:
			return buildL5(rng);
		case 6:
			return buildL6(rng);
		case 7:
			return buildL7(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Multiple choice

/** Numeric value of the answer, for keeping distractors distinct. */
function answerNum(sample: Sample): number {
	const a = sample.answer;
	if (a.kind === 'number') {
		const r = Rational.parse(a.value);
		return r.num / r.den;
	}
	if (a.kind === 'expression') {
		// B**(e), -(B**(e)) only.
		const m = /^(-\()?(\w+)\*\*\((-?\d+(?:\/\d+)?)\)\)?$/.exec(a.value);
		if (!m) return Number.NaN;
		const B: Base = m[2] === 'a' ? 'a' : Number(m[2]);
		const v = numOf(B, Rational.parse(m[3]));
		return m[1] ? -v : v;
	}
	return Number.NaN;
}

const close = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** Distinct mistakes, none equal in value to the answer or to each other. */
function distinctWrong(correct: number, wrong: Opt[]): Opt[] {
	const out: Opt[] = [];
	for (const w0 of wrong) {
		const w = { ...w0, num: typeof w0.num === 'number' ? w0.num : Number.NaN };
		if (!w.latex || (!Number.isNaN(w.num) && !Number.isFinite(w.num))) continue;
		if (!Number.isNaN(w.num) && close(w.num, correct)) continue;
		if (out.some((o) => (Number.isNaN(o.num) ? Number.isNaN(w.num) : close(o.num, w.num)) || o.latex === w.latex)) continue;
		out.push(w);
	}
	return out;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const wrong = distinctWrong(answerNum(sample), (sample.params.wrong as Opt[]) ?? []);
	const correct: ChoiceOption =
		sample.answer.kind === 'number'
			? { latex: Rational.parse(sample.answer.value).toLatex(), values: [sample.answer.value] }
			: { latex: (sample.answer as { latex: string }).latex, values: [(sample.answer as { value: string }).value] };
	return buildChoice(
		rng,
		correct,
		wrong.map((w) => ({ latex: w.latex, values: [w.value] })),
	);
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (typeof p.case !== 'string') v.push('params.case mancante');
	if (!sample.steps.length) v.push('passaggi mancanti');
	if (/\+\s*-|-\s*-|\\cdot\s*\\cdot/.test(sample.problem)) v.push('segni doppi nel testo');
	if (sample.answer.kind !== 'choice') {
		const wrong = distinctWrong(answerNum(sample), (p.wrong as Opt[]) ?? []);
		if (wrong.length < 3) v.push(`solo ${wrong.length} errori tipici distinti`);
		if (sample.answer.kind === 'expression' && Number.isNaN(answerNum(sample))) v.push('risposta non leggibile');
	} else {
		const a = sample.answer;
		if (a.options.length !== 4) v.push('servono quattro opzioni');
	}
	const lv = sample.level;
	const kinds: Record<number, string> = { 1: 'expression', 2: 'number', 3: 'number', 4: 'expression', 5: 'number', 6: 'expression' };
	if (kinds[lv] && sample.answer.kind !== kinds[lv]) v.push(`tipo di risposta ${sample.answer.kind} al livello ${lv}`);
	if (lv === 7 && (p.case === 'vero o falso') !== (sample.answer.kind === 'choice')) v.push('vero o falso deve essere a scelta');
	if (sample.answer.kind === 'number') {
		const r = Rational.parse(sample.answer.value);
		if (Math.abs(r.num) > 256 || r.den > 256) v.push('risultato troppo grande');
	}
	return v;
}

export const radicaliEsponenteRazionale: Generator = {
	id: ID,
	title: 'Potenze con esponente razionale',
	levels: {
		1: { label: 'Dalla potenza al radicale e ritorno', constraints: ['metà potenza → radicale, metà radicale → potenza', 'esponente m/n ridotto, n da 2 a 7, m da 1 a 5', 'basi 2, 3, 5, 6, 7, 10, 11 o la lettera a'] },
		2: { label: 'Potenze con base potenza perfetta', constraints: ['A = c^n fino a 256, esponente m/n positivo non intero', 'risultato c^m intero fino a 256'] },
		3: { label: 'Esponente negativo, base frazionaria, esponente decimale', constraints: ['4 su 10 esponente negativo, 3 su 10 base frazionaria, 3 su 10 esponente decimale'] },
		4: { label: 'Un solo radicale da due con indici diversi', constraints: ['stessa base 2, 3, 5 o 7, radicandi fino a 81', 'prodotto (6 su 10) o quoziente (4 su 10)', 'risultato con esponente tra 0 e 1, indice fino a 12'] },
		5: { label: 'Tre potenze alla stessa base', constraints: ['basi potenze diverse di 2 (da 4 a 64) o di 3 (9, 27, 81)', 'ogni potenza dà un esponente intero, almeno uno negativo', 'risultato p^k con |k| <= 3'] },
		6: { label: 'Lettere: parte intera fuori e radicali annidati', constraints: ['metà prodotti di 2 o 3 radicali con esponente tra 1 e 3', 'metà radicali annidati'] },
		7: { label: 'Radicando negativo, razionalizzazione, basi negative', constraints: ['35% radicando negativo con indice dispari', '35% esponente negativo da razionalizzare', '30% vero o falso'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params: { case: b.case, ...b.data, wrong: b.wrong.map(({ latex, value, num }) => ({ latex, value, num })) },
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

export default radicaliEsponenteRazionale;
