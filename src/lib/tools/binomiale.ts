import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimalTex, parseDecimal } from './numbers';
import { sumLines } from './media-mediana-moda';
import { bigTex, binomial, factorial, falling, productLine } from './combinatoria';

/**
 * The binomial distribution (schema di Bernoulli): the probability of exactly, at most or at least k successes in n
 * independent trials with probability p each,
 * $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$. Exact with BigInt fractions: the answer is a fraction when p was written
 * as one and the fraction stays short, then a decimal and a percentage. A sum of terms takes the complementary event
 * when that has fewer terms, as the books do for "almeno uno".
 */

export type BinomialMode = 'uguale' | 'massimo' | 'minimo';

/** Most trials: the table of terms has at most 101 rows. */
export const MAX_TRIALS = 100;
/** A fraction is shown when its denominator has at most this many digits. */
const READABLE_DIGITS = 12;
/** Decimals of the answer and of the terms in a sum. */
const DIGITS = 4;
const TERM_DIGITS = 6;

// ---------------------------------------------------------------- exact fractions on BigInt

interface Frac {
	n: bigint;
	d: bigint;
}

const gcd = (a: bigint, b: bigint): bigint => {
	a = a < 0n ? -a : a;
	while (b) [a, b] = [b, a % b];
	return a;
};

function frac(n: bigint, d = 1n): Frac {
	if (d < 0n) [n, d] = [-n, -d];
	const g = gcd(n, d) || 1n;
	return { n: n / g, d: d / g };
}

const add = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
const pow = (a: Frac, e: number) => frac(a.n ** BigInt(e), a.d ** BigInt(e));
const ONE: Frac = { n: 1n, d: 1n };
const ZERO: Frac = { n: 0n, d: 1n };

const readable = (f: Frac) => f.d.toString().length <= READABLE_DIGITS;

/** "\dfrac{1}{36}", or the integer. */
function fracTex(f: Frac): string {
	if (f.d === 1n) return bigTex(f.n);
	return `${f.n < 0n ? '-' : ''}\\dfrac{${bigTex(f.n < 0n ? -f.n : f.n)}}{${bigTex(f.d)}}`;
}

/** f · 10^digits rounded half up (f ≥ 0), and whether it was exact. */
function scaled(f: Frac, digits: number): { value: bigint; exact: boolean } {
	const s = 10n ** BigInt(digits);
	return { value: (f.n * s * 2n + f.d) / (2n * f.d), exact: (f.n * s) % f.d === 0n };
}

function decimalOf(value: bigint, digits: number): { tex: string; text: string } {
	const s = 10n ** BigInt(digits);
	const int = (value / s).toString();
	const fr = (value % s).toString().padStart(digits, '0').replace(/0+$/, '');
	return { tex: `${int}${fr ? `{,}${fr}` : ''}`, text: `${int}${fr ? `,${fr}` : ''}` };
}

/** A small positive fraction in scientific notation, three significant digits: "3{,}05 \cdot 10^{-8}". */
function sci(f: Frac): { tex: string; text: string } {
	// The exponent e with 10^e ≤ f < 10^(e+1).
	let e = f.n.toString().length - f.d.toString().length;
	const ge = (k: number) => (k >= 0 ? f.n >= f.d * 10n ** BigInt(k) : f.n * 10n ** BigInt(-k) >= f.d);
	if (!ge(e)) e--;
	// Mantissa · 100, rounded.
	const shift = 2 - e;
	let m = shift >= 0 ? (f.n * 10n ** BigInt(shift) * 2n + f.d) / (2n * f.d) : (f.n * 2n + f.d * 10n ** BigInt(-shift)) / (2n * f.d * 10n ** BigInt(-shift));
	if (m >= 1000n) {
		m /= 10n;
		e++;
	}
	const ms = m.toString();
	const rest = ms.slice(1).replace(/0+$/, '');
	return { tex: `${ms[0]}${rest ? `{,}${rest}` : ''} \\cdot 10^{${e}}`, text: `${ms[0]}${rest ? `,${rest}` : ''} · 10^${e}` };
}

/**
 * A probability as a decimal: exact when it ends within `digits` decimals, else rounded; below 0,0001 in scientific
 * notation, so a tiny probability never reads as 0.
 */
function approx(f: Frac, digits = DIGITS): { tex: string; text: string; exact: boolean } {
	if (f.n === 0n) return { tex: '0', text: '0', exact: true };
	const s = scaled(f, digits);
	if (s.exact) return { ...decimalOf(s.value, digits), exact: true };
	if (f.n * 10000n < f.d) return { ...sci(f), exact: false };
	return { ...decimalOf(s.value, digits), exact: false };
}

/** "= 0{,}09" or "\approx 0{,}2907". */
const approxTex = (f: Frac, digits = DIGITS, hl = false) => {
	const a = approx(f, digits);
	return `${a.exact ? '=' : '\\approx'} ${hl ? `\\hl{${a.tex}}` : a.tex}`;
};

// ---------------------------------------------------------------- reading p

interface Probability {
	value: Frac;
	/** Written as a fraction: the answer is given as a fraction too. */
	fraction: boolean;
}

function readProbability(input: string): Probability | string {
	const s = input.trim().replace(/\s+/g, '');
	const example = 'per esempio 1/6, 0,3 oppure 30%';
	if (!s) return `Scrivi la probabilità di successo p, ${example}.`;
	let p: Probability | null = null;
	const f = /^(\d+)\/(\d+)$/.exec(s);
	if (f) {
		if (BigInt(f[2]) === 0n) return `Il denominatore non può essere 0: ${example}.`;
		if (f[1].length > 12 || f[2].length > 12) return `Numeri troppo lunghi: ${example}.`;
		p = { value: frac(BigInt(f[1]), BigInt(f[2])), fraction: true };
	} else {
		const pct = s.endsWith('%');
		const r = parseDecimal(pct ? s.slice(0, -1) : s);
		if (!r) return `"${input.trim()}" non è una probabilità: ${example}.`;
		p = { value: frac(BigInt(r.num), BigInt(r.den) * (pct ? 100n : 1n)), fraction: false };
		if (!pct && r.compare(Rational.of(1)) > 0 && r.compare(Rational.of(100)) < 0)
			return `La probabilità è un numero tra 0 e 1. Se è una percentuale, scrivi il simbolo %, per esempio ${s}%.`;
	}
	if (p.value.n <= 0n || p.value.n >= p.value.d) return `La probabilità di successo p deve stare tra 0 e 1, esclusi: ${example}.`;
	return p;
}

function readInt(input: string, lo: number, hi: number, ask: string): number | string {
	const r = parseDecimal(input);
	if (!r || !r.isInteger() || r.num < lo || r.num > hi) return ask;
	return r.num;
}

// ---------------------------------------------------------------- the tool

const ineq: Record<BinomialMode, string> = { uguale: '=', massimo: '\\leq', minimo: '\\geq' };

export function binomiale(mode: BinomialMode, nInput: string, pInput: string, kInput: string): Outcome {
	const n = readInt(nInput, 1, MAX_TRIALS, `Scrivi il numero di prove n, un intero da 1 a ${MAX_TRIALS}, per esempio 10.`);
	if (typeof n === 'string') return fail(n);
	const p = readProbability(pInput);
	if (typeof p === 'string') return fail(p);
	const k = readInt(kInput, 0, n, `Scrivi il numero di successi k, un intero da 0 a ${n}, per esempio ${Math.min(2, n)}.`);
	if (typeof k === 'string') return fail(k);

	const q = sub(ONE, p.value);
	/** p and 1 - p in a formula, and raised to a power. */
	const show = (f: Frac) => (p.fraction ? fracTex(f) : approx(f, 12).tex);
	const power = (f: Frac, e: number | string) => (p.fraction ? `\\left(${fracTex(f)}\\right)^{${e}}` : `${show(f)}^{${e}}`);
	const term = (i: number) => mul(frac(binomial(n, i)), mul(pow(p.value, i), pow(q, n - i)));

	const X = `P(X ${ineq[mode]} ${k})`;
	const what = mode === 'uguale' ? `esattamente ${k}` : mode === 'massimo' ? `al massimo ${k}` : `almeno ${k}`;
	const data: Step = {
		say: 'Scrivi i dati del problema.',
		table: {
			head: ['Dato', 'Valore'],
			rows: [
				['Numero di prove', `$n = ${n}$`],
				['Probabilità di successo', `$p = ${show(p.value)}$`],
				['Probabilità di insuccesso', `$1 - p = ${show(q)}$`],
				[`Successi, ${mode === 'uguale' ? 'esattamente' : mode === 'massimo' ? 'al massimo' : 'almeno'}`, `$k = ${k}$`]
			]
		}
	};

	// Which terms to add, and whether through the complementary event.
	let from: number;
	let to: number;
	let complement = false;
	if (mode === 'uguale') [from, to] = [k, k];
	else if (mode === 'massimo') {
		[from, to] = [0, k];
		if (n - k < k + 1) [from, to, complement] = [k + 1, n, true];
	} else {
		[from, to] = [k, n];
		if (k < n - k + 1) [from, to, complement] = [0, k - 1, true];
	}
	const count = to - from + 1;
	let total = ZERO;
	for (let i = from; i <= to; i++) total = add(total, term(i));
	const result = complement ? sub(ONE, total) : total;

	const steps: Step[] = [data];
	const formula = `P(X = k) = \\binom{n}{k} \\, p^k \\, (1-p)^{n-k}`;

	if (mode === 'uguale') {
		const j = Math.min(k, n - k);
		const coef = binomial(n, k);
		const pk = pow(p.value, k);
		const qk = pow(q, n - k);
		steps.push({ say: 'Sostituisci i dati nella formula della probabilità binomiale.', math: [formula, `${X} = \\binom{${n}}{${k}} \\cdot ${power(p.value, k)} \\cdot ${power(q, n - k)}`] });
		steps.push({
			say: 'Calcola il coefficiente binomiale.',
			math:
				j === 0
					? [`\\binom{${n}}{${k}} = \\hl{1}`]
					: [
							...(j < k ? [`\\binom{${n}}{${k}} = \\binom{${n}}{${j}}`] : []),
							`\\binom{${n}}{${j}} = \\dfrac{${productLine(n, j)}}{${productLine(j, j)}}`,
							...(j > 1 ? [`= \\dfrac{${bigTex(falling(n, j))}}{${bigTex(factorial(j))}}`] : []),
							`= \\hl{${bigTex(coef)}}`
						]
		});
		/** A power or a factor: the fraction when short, else the decimal, exact up to ten decimals (0,3^8 = 0,00006561). */
		const value = (f: Frac) => (p.fraction && readable(f) ? { tex: fracTex(f), exact: true } : approx(f, 10).exact ? approx(f, 10) : approx(f, TERM_DIGITS));
		const powLine = (f: Frac, e: number, v: Frac) => `${power(f, e)} ${value(v).exact ? '=' : '\\approx'} ${value(v).tex}`;
		steps.push({ say: 'Calcola le due potenze.', math: [powLine(p.value, k, pk), powLine(q, n - k, qk)] });
		steps.push({
			say: 'Moltiplica i tre numeri.',
			math: [`${X} ${value(pk).exact && value(qk).exact ? '=' : '\\approx'} ${bigTex(coef)} \\cdot ${value(pk).tex} \\cdot ${value(qk).tex}`, ...(p.fraction && readable(result) ? [`= ${fracTex(result)}`] : []), approxTex(result, DIGITS, true)]
		});
	} else {
		const all = mode === 'massimo' ? `P(X = 0) + \\ldots + P(X = ${k})` : `P(X = ${k}) + \\ldots + P(X = ${n})`;
		const terms = count <= 3 ? Array.from({ length: count }, (_, i) => `P(X = ${from + i})`).join(' + ') : `P(X = ${from}) + \\ldots + P(X = ${to})`;
		if (count === 0) {
			steps.push({
				say: mode === 'massimo' ? `I successi non possono essere più di $${n}$.` : 'Il numero di successi è sempre almeno $0$.',
				math: [`${X} = \\hl{1}`],
				then: "È l'evento certo."
			});
		} else {
			steps.push(
				complement
					? {
							say: "Usa l'evento contrario: ha meno termini da sommare.",
							math: [`${X} = 1 - P(X ${mode === 'massimo' ? '>' : '<'} ${k})`, `= 1 - ${count > 1 ? `[${terms}]` : terms}`],
							then: `Sommare tutti i termini, $${all}$, darebbe lo stesso risultato con più conti.`
						}
					: { say: 'Scrivi la probabilità come somma di termini.', math: [`${X} = ${terms}`] }
			);
			const rounded = (f: Frac) => {
				const s = scaled(f, TERM_DIGITS);
				return Rational.of(Number(s.value), 10 ** TERM_DIGITS);
			};
			steps.push({
				say: 'Calcola ogni termine con la formula della probabilità binomiale.',
				math: [`P(X = i) = \\binom{${n}}{i} \\cdot ${power(p.value, 'i')} \\cdot ${power(q, `${n} - i`)}`],
				table: {
					head: ['$i$', `$\\binom{${n}}{i}$`, '$P(X = i)$'],
					rows: Array.from({ length: count }, (_, idx) => {
						const i = from + idx;
						const tf = term(i);
						const a = approx(tf, TERM_DIGITS);
						const value = p.fraction && readable(tf) ? `${fracTex(tf)} ${a.exact ? '=' : '\\approx'} ${a.tex}` : `${a.exact ? '' : '\\approx '}${a.tex}`;
						return [`$${i}$`, `$${bigTex(binomial(n, i))}$`, `$${value}$`];
					})
				}
			});
			const rs = Array.from({ length: count }, (_, idx) => rounded(term(from + idx)));
			const sumR = rs.reduce((x, y) => x.add(y));
			if (count > 1) steps.push({ say: 'Somma i termini.', math: sumLines(rs, TERM_DIGITS), then: `I termini sono arrotondati a ${TERM_DIGITS} decimali.` });
			if (complement)
				steps.push({ say: 'Togli la somma da $1$.', math: [`${X} \\approx 1 - ${decimalTex(sumR, TERM_DIGITS)}`, `= \\hl{${decimalTex(Rational.of(1).sub(sumR), TERM_DIGITS)}}`] });
		}
	}

	const a = approx(result, DIGITS);
	const rows: ResultRow[] = [];
	const label = `Probabilità di ${what} ${k === 1 && mode === 'uguale' ? 'successo' : 'successi'} su ${n} ${n === 1 ? 'prova' : 'prove'}`;
	const decimalValue = `$${a.exact ? '' : '\\approx '}${a.tex}$`;
	if (p.fraction && readable(result) && result.d !== 1n) rows.push({ label, value: `$${fracTex(result)}$` }, { label: 'In decimali', value: decimalValue });
	else rows.push({ label, value: decimalValue });
	if (result.n * 10000n >= result.d) {
		const pc = approx(mul(result, frac(100n)), 2);
		rows.push({ label: 'In percentuale', value: `$${pc.exact ? '' : '\\approx '}${pc.tex}\\%$` });
	}
	return { ok: true, rows, copy: a.text, steps };
}
