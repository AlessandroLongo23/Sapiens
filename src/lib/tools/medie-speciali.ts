import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { resultTex, splitList, stats, sumLines } from './media-mediana-moda';
import { sqrtDecimal } from './varianza';

/**
 * The geometric, harmonic and quadratic means of a list of numbers, each compared with the arithmetic mean
 * (media-mediana-moda). $G = \sqrt[n]{x_1 \cdots x_n}$, $H = n : (1/x_1 + \dots + 1/x_n)$,
 * $Q = \sqrt{(x_1^2 + \dots + x_n^2) : n}$. Products and sums of reciprocals grow fast, so they are kept as exact
 * fractions of BigInts; a root is exact when it can be (∛216 = 6), simplified when the radicand is a whole number
 * (∛108 = 3∛4), and always given to four decimals.
 */

export type MeanMode = 'geometrica' | 'armonica' | 'quadratica';

const MAX_VALUES = 30;
const DIGITS = 4;

// --- Exact fractions of BigInts ------------------------------------------------------------------------------------

/** A reduced fraction n/d with d > 0. */
export interface BigFrac {
	n: bigint;
	d: bigint;
}

const bgcd = (a: bigint, b: bigint): bigint => {
	if (a < 0n) a = -a;
	if (b < 0n) b = -b;
	while (b) [a, b] = [b, a % b];
	return a;
};

export function frac(n: bigint, d = 1n): BigFrac {
	if (d < 0n) [n, d] = [-n, -d];
	const g = bgcd(n, d) || 1n;
	return { n: n / g, d: d / g };
}

const fromRational = (r: Rational): BigFrac => frac(BigInt(r.num), BigInt(r.den));
const mulF = (a: BigFrac, b: BigFrac) => frac(a.n * b.n, a.d * b.d);
const addF = (a: BigFrac, b: BigFrac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);

/** Digits grouped by three with `sep`, from 10 000 up, as in the lessons. */
const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** A non-negative scaled integer (value · 10^digits) as an Italian decimal. */
function scaled(v: bigint, digits: number, sign = ''): { tex: string; text: string } {
	const scale = 10n ** BigInt(digits);
	const int = (v / scale).toString();
	const f = (v % scale).toString().padStart(digits, '0').replace(/0+$/, '');
	const s = v === 0n ? '' : sign;
	return { tex: `${s}${group(int, '\\,')}${f ? `{,}${f}` : ''}`, text: `${s}${group(int, ' ')}${f ? `,${f}` : ''}` };
}

/** A fraction as a decimal, rounded half up to `digits` decimals; `exact` when nothing was rounded. */
export function bigDecimal(f: BigFrac, digits = DIGITS): { tex: string; text: string; exact: boolean } {
	const n = f.n < 0n ? -f.n : f.n;
	const scale = 10n ** BigInt(digits);
	return { ...scaled((n * scale * 2n + f.d) / (2n * f.d), digits, f.n < 0n ? '-' : ''), exact: (n * scale) % f.d === 0n };
}

/** A fraction in a formula: a decimal when it ends within six digits, else \dfrac. */
export function fracTex(f: BigFrac): string {
	const d = bigDecimal(f, 6);
	if (d.exact) return d.tex;
	const sign = f.n < 0n ? '-' : '';
	return `${sign}\\dfrac{${group((f.n < 0n ? -f.n : f.n).toString(), '\\,')}}{${group(f.d.toString(), '\\,')}}`;
}

/** A fraction always as a fraction (a whole number stays whole): the reciprocals of the harmonic mean. */
export function ratioTex(f: BigFrac): string {
	const abs = (f.n < 0n ? -f.n : f.n).toString();
	const sign = f.n < 0n ? '-' : '';
	return f.d === 1n ? `${sign}${group(abs, '\\,')}` : `${sign}\\dfrac{${group(abs, '\\,')}}{${group(f.d.toString(), '\\,')}}`;
}

/** ⌊X^(1/k)⌋ for X ≥ 0, by Newton's method from above. */
export function iroot(X: bigint, k: number): bigint {
	if (X < 2n || k === 1) return X;
	const K = BigInt(k);
	let x = 1n << BigInt(Math.ceil(X.toString(2).length / k));
	for (;;) {
		const y = ((K - 1n) * x + X / x ** (K - 1n)) / K;
		if (y >= x) break;
		x = y;
	}
	while (x ** K > X) x--;
	while ((x + 1n) ** K <= X) x++;
	return x;
}

/** The k-th root of n/d ≥ 0 to `digits` decimals, rounded half up; exact when the root is a short decimal. */
export function rootDecimal(n: bigint, d: bigint, k: number, digits = DIGITS): { tex: string; text: string; exact: boolean } {
	const K = BigInt(k);
	const scale = 10n ** BigInt(digits + 1);
	const top = n * scale ** K;
	const X = top / d;
	const r = iroot(X, k);
	const exact = X * d === top && r ** K === X && r % 10n === 0n;
	return { ...scaled((r + 5n) / 10n, digits), exact };
}

/** m = out^k · rest, with rest free of k-th powers (by trial division: m must be at most about 10^12). */
function extractPower(m: number, k: number): { out: number; rest: number } {
	let out = 1;
	let rest = 1;
	let left = m;
	for (let p = 2; p * p <= left; p++) {
		let e = 0;
		while (left % p === 0) {
			left /= p;
			e++;
		}
		out *= p ** Math.floor(e / k);
		rest *= p ** (e % k);
	}
	if (left > 1) rest *= left;
	return { out, rest };
}

const rootSign = (k: number, inside: string) => (k === 2 ? `\\sqrt{${inside}}` : `\\sqrt[${k}]{${inside}}`);

/**
 * The k-th root of a positive fraction: exact when numerator and denominator are k-th powers, simplified as
 * a·ⁿ√b when the radicand is a whole number with a k-th power inside, and always as a decimal.
 */
function root(f: BigFrac, k: number) {
	const a = iroot(f.n, k);
	const b = iroot(f.d, k);
	const K = BigInt(k);
	const exact = a ** K === f.n && b ** K === f.d ? frac(a, b) : null;
	let split: { out: number; rest: number } | null = null;
	if (!exact && f.d === 1n && f.n <= 1_000_000_000_000n) {
		const p = extractPower(Number(f.n), k);
		if (p.out > 1) split = p;
	}
	return { exact, split, dec: rootDecimal(f.n, f.d, k) };
}

// --- Reading the list ----------------------------------------------------------------------------------------------

function readList(input: string, positive: boolean): Rational[] | string {
	const parts = splitList(input);
	const example = positive ? 'per esempio 2 6 9' : 'per esempio 3 5 7';
	if (!parts.length) return `Scrivi i numeri separati da uno spazio o da un punto e virgola, ${example}.`;
	if (parts.length > MAX_VALUES) return `Al massimo ${MAX_VALUES} numeri alla volta: togline qualcuno.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi i numeri separati da uno spazio; per i decimali usa la virgola, per esempio 7,5.`;
		if (positive && r.sign() <= 0) return `Questa media si calcola solo su numeri maggiori di zero, e "${p}" non lo è. Scrivi numeri positivi, ${example}.`;
		out.push(r);
	}
	if (out.length < 2) return `Servono almeno due numeri, ${example}.`;
	return out;
}

/** A value as typed, exactly: a decimal up to six digits, else a fraction. */
const v = (r: Rational) => fracTex(fromRational(r));
const txt = (r: Rational) => decimal(r, DIGITS).text;
const PER_LINE = 4;
const LINE_CHARS = 26;
const width = (tex: string) => tex.replace(/\\dfrac/g, '').replace(/\{,\}/g, ',').replace(/\\,/g, '').replace(/\\hl\{|\\cdot|[{}]/g, '').length;

/** Split a list in groups of at most four, as even as possible. */
function chunks<T>(xs: T[]): T[][] {
	const groups = Math.ceil(xs.length / PER_LINE);
	const out: T[][] = [];
	let at = 0;
	for (let g = 0; g < groups; g++) {
		const size = Math.floor(xs.length / groups) + (g < xs.length % groups ? 1 : 0);
		out.push(xs.slice(at, at + size));
		at += size;
	}
	return out;
}

/** A product as lines of calculation, none too wide for a phone, as `sumLines` does for a sum. */
function productLines(fs: BigFrac[]): string[] {
	const total = fs.reduce(mulF);
	const one = `${fs.map(fracTex).join(' \\cdot ')} = \\hl{${fracTex(total)}}`;
	if (fs.length <= PER_LINE || width(one) <= LINE_CHARS) return [one];
	const parts = chunks(fs);
	const partials = parts.map((c) => c.reduce(mulF));
	return [...parts.map((c, i) => `${c.map(fracTex).join(' \\cdot ')} = ${fracTex(partials[i])}`), ...productLines(partials)];
}

/** A sum of fractions: over the common denominator when it is short, else in groups with partial sums. */
function fractionSumLines(fs: BigFrac[]): string[] {
	const total = fs.reduce(addF);
	const L = fs.reduce((a, f) => (a * f.d) / bgcd(a, f.d), 1n);
	const terms = fs.map(ratioTex).join(' + ');
	if (fs.length <= 6 && L <= 1_000_000n && L > 1n) {
		const nums = fs.map((f) => f.n * (L / f.d));
		const over = nums.reduce((a, b) => a + b, 0n);
		const lines = [`${terms} = \\dfrac{${nums.map((x) => group(x.toString(), '\\,')).join(' + ')}}{${group(L.toString(), '\\,')}}`];
		const plain = frac(over, L);
		if (plain.n === over && plain.d === L) lines.push(`= \\hl{${ratioTex(total)}}`);
		else lines.push(`= \\dfrac{${group(over.toString(), '\\,')}}{${group(L.toString(), '\\,')}}`, `= \\hl{${ratioTex(total)}}`);
		return lines;
	}
	if (fs.length <= 3) return [`${terms} = \\hl{${ratioTex(total)}}`];
	const parts = chunks(fs);
	const partials = parts.map((c) => c.reduce(addF));
	return [...parts.map((c, i) => `${c.map(ratioTex).join(' + ')} = ${ratioTex(partials[i])}`), ...fractionSumLines(partials)];
}

// --- The three means -----------------------------------------------------------------------------------------------

interface Mean {
	/** The value for the result row, without "$": "3\sqrt[3]{4} \approx 4{,}7622". */
	tex: string;
	text: string;
	steps: Step[];
}

type Root = ReturnType<typeof root>;
const simplifiedTex = (k: number, p: { out: number; rest: number }) => `${p.out}${rootSign(k, String(p.rest))}`;

/** A root for the result row: "6", "3\sqrt[3]{4} \approx 4{,}7622", "\approx 1{,}4142". */
function valueTex(r: Root, k: number, radicand: BigFrac): string {
	if (r.exact) return fracTex(r.exact) + (bigDecimal(r.exact, 6).exact ? '' : ` \\approx ${bigDecimal(r.exact).tex}`);
	if (r.split) return `${simplifiedTex(k, r.split)} \\approx ${r.dec.tex}`;
	// A short whole radicand is worth keeping: √30 ≈ 5,4772.
	const short = radicand.d === 1n && radicand.n < 1_000_000n;
	return `${short ? `${rootSign(k, fracTex(radicand))} ` : ''}\\approx ${r.dec.tex}`;
}

function rootLines(name: string, k: number, radicand: string, r: Root): string[] {
	const lines = [`${name} = ${rootSign(k, radicand)}`];
	if (r.exact) {
		lines.push(`= \\hl{${fracTex(r.exact)}}`);
		if (!bigDecimal(r.exact, 6).exact) lines.push(`\\approx ${bigDecimal(r.exact).tex}`);
		return lines;
	}
	if (r.split) lines.push(`= ${rootSign(k, `${r.split.out}^{${k}} \\cdot ${r.split.rest}`)}`, `= ${simplifiedTex(k, r.split)}`);
	lines.push(`\\approx \\hl{${r.dec.tex}}`);
	return lines;
}

function geometric(xs: Rational[]): Mean {
	const n = xs.length;
	const fs = xs.map(fromRational);
	const P = fs.reduce(mulF);
	const r = root(P, n);
	const steps: Step[] = [
		{ say: 'Moltiplica tutti i valori.', math: productLines(fs) },
		{
			say: n === 2 ? 'Fai la radice quadrata del prodotto.' : `Fai la radice di indice $${n}$ del prodotto.`,
			math: rootLines('G', n, fracTex(P), r),
			then: r.split ? `Il fattore $${r.split.out}^{${n}}$ esce dalla radice come $${r.split.out}$.` : undefined
		}
	];
	return { tex: valueTex(r, n, P), text: r.exact ? bigDecimal(r.exact).text : r.dec.text, steps };
}

function harmonic(xs: Rational[]): Mean {
	const n = xs.length;
	const recips = xs.map((x) => frac(BigInt(x.den), BigInt(x.num)));
	const S = recips.reduce(addF);
	const H = frac(BigInt(n) * S.d, S.n);
	const inv = frac(S.d, S.n);
	const dec = bigDecimal(H);
	const exactShort = bigDecimal(H, 6).exact;
	const steps: Step[] = [
		{
			say: 'Scrivi il reciproco di ogni valore.',
			table: {
				head: ['$x$', '$\\dfrac{1}{x}$'],
				rows: xs.map((x, i) => [`$${v(x)}$`, x.isInteger() ? `$\\dfrac{1}{${v(x)}}$` : `$\\dfrac{1}{${v(x)}} = ${ratioTex(recips[i])}$`])
			}
		},
		{ say: 'Somma i reciproci.', math: fractionSumLines(recips) },
		{
			say: `Dividi $${n}$, il numero dei valori, per la somma dei reciproci.`,
			math: [
				`H = ${n} : ${ratioTex(S)}`,
				`= ${n} \\cdot ${ratioTex(inv)}`,
				`= \\hl{${ratioTex(H)}}`,
				...(H.d === 1n ? [] : [`${exactShort ? '=' : '\\approx'} ${bigDecimal(H, exactShort ? 6 : DIGITS).tex}`])
			]
		}
	];
	return { tex: H.d === 1n ? ratioTex(H) : `${ratioTex(H)} ${exactShort ? '=' : '\\approx'} ${bigDecimal(H, exactShort ? 6 : DIGITS).tex}`, text: dec.text, steps };
}

function quadratic(xs: Rational[]): Mean {
	const n = xs.length;
	const squares = xs.map((x) => x.mul(x));
	const S = squares.reduce((a, b) => a.add(b));
	const M = S.div(Rational.of(n));
	const mTex = fracTex(fromRational(M));
	const r = root(fromRational(M), 2);
	// The decimal from the variance tool's square root, the same digits on both pages.
	const d = sqrtDecimal(M);
	const steps: Step[] = [
		{
			say: 'Eleva al quadrato ogni valore.',
			table: { head: ['$x$', '$x^2$'], rows: xs.map((x, i) => [`$${v(x)}$`, `$${x.sign() < 0 ? `(${v(x)})` : v(x)}^2 = ${v(squares[i])}$`]) }
		},
		{ say: 'Somma i quadrati.', math: sumLines(squares, 8) },
		{ say: `Dividi la somma per $${n}$, il numero dei valori.`, math: [`\\dfrac{${v(S)}}{${n}} = \\hl{${mTex}}`] },
		{ say: 'Fai la radice quadrata del risultato.', math: rootLines('Q', 2, mTex, r) }
	];
	return { tex: valueTex(r, 2, fromRational(M)), text: d.text, steps };
}

const NAMES: Record<MeanMode, { name: string; letter: string; less: boolean }> = {
	geometrica: { name: 'La media geometrica', letter: 'G', less: true },
	armonica: { name: 'La media armonica', letter: 'H', less: true },
	quadratica: { name: 'La media quadratica', letter: 'Q', less: false }
};

function compute(mode: MeanMode, input: string): Outcome {
	const xs = readList(input, mode !== 'quadratica');
	if (typeof xs === 'string') return fail(xs);
	const m = mode === 'geometrica' ? geometric(xs) : mode === 'armonica' ? harmonic(xs) : quadratic(xs);
	const { name, letter, less } = NAMES[mode];
	const s = stats(xs);
	const allEqual = s.min.equals(s.max);
	const meanDec = decimal(s.mean, DIGITS);
	const steps: Step[] = [
		{ ...m.steps[0], group: name },
		...m.steps.slice(1),
		{
			group: 'Il confronto con la media aritmetica',
			say: 'Calcola la media aritmetica: somma i valori e dividi per il loro numero.',
			math: [`\\bar{x} = \\dfrac{${v(s.sum)}}{${xs.length}}`, resultTex(s.mean)],
			then: allEqual
				? 'I valori sono tutti uguali: le due medie sono uguali.'
				: less
					? `$${letter}$ è minore di $\\bar{x}$: succede sempre, se i valori non sono tutti uguali.`
					: `$${letter}$ è maggiore di $\\bar{x}$: succede sempre, se i valori non sono tutti uguali.`
		}
	];
	const rowName = mode === 'geometrica' ? 'Media geometrica' : mode === 'armonica' ? 'Media armonica' : 'Media quadratica';
	return {
		ok: true,
		rows: [
			{ label: rowName, value: `$${m.tex}$` },
			{ label: 'Media aritmetica, per confronto', value: `$${meanDec.exact ? '' : '\\approx '}${meanDec.tex}$` }
		],
		copy: `${rowName.toLowerCase()} ${m.text}; media aritmetica ${txt(s.mean)}`,
		steps
	};
}

/** The mean of the given kind of a list of numbers ("2 6 9"), with its steps and the arithmetic mean beside it. */
export function medieSpeciali(mode: MeanMode, input: string): Outcome {
	try {
		return compute(mode, input);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre, per esempio 7,5 invece di 7,4999.');
	}
}
