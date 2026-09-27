import { Rational, ZERO, lcm } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, decimalTex, parseDecimal } from './numbers';
import { resultTex, splitList, sumLines } from './media-mediana-moda';

/**
 * Variance, standard deviation (scarto quadratico medio) and coefficient of variation of a list of numbers, as the
 * lesson "Indici di variabilità" (statistica-variabilita) does them: the mean $\bar{x}$, a table with each datum, its
 * deviation $x_i - \bar{x}$ and its square, the variance $\sigma^2$ dividing by $n$ (the population variance of the
 * school books), $\sigma = \sqrt{\sigma^2}$, then the sample variance $s^2$ dividing by $n - 1$ as one more line.
 *
 * Exact arithmetic with Rational. When the mean is a finite decimal the table is in decimals; when it is periodic
 * (7/3) the deviations are fractions over a common denominator, as a teacher would keep them, so every line is exact.
 */

const MAX_VALUES = 100;
/** Decimals of the results, as in the mean tool: 1,8028. */
const DIGITS = 4;
/** Decimals shown exactly in the table: squares of data with up to four decimals. */
const TABLE_DIGITS = 8;

const t = (r: Rational, digits = DIGITS) => decimalTex(r, digits);
const txt = (r: Rational, digits = DIGITS) => decimal(r, digits).text;

/** A scaled integer (value · 10^digits, rounded) as an Italian decimal. */
function scaledDecimal(scaled: bigint, digits: number): { tex: string; text: string } {
	const scale = 10n ** BigInt(digits);
	const int = (scaled / scale).toString();
	const frac = (scaled % scale).toString().padStart(digits, '0').replace(/0+$/, '');
	const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);
	return { tex: `${group(int, '\\,')}${frac ? `{,}${frac}` : ''}`, text: `${group(int, ' ')}${frac ? `,${frac}` : ''}` };
}

function isqrt(n: bigint): bigint {
	if (n < 2n) return n;
	let x = BigInt(Math.floor(Math.sqrt(Number(n))));
	while (x * x > n) x--;
	while ((x + 1n) * (x + 1n) <= n) x++;
	// Newton from the float guess, for numbers past 2^53.
	for (;;) {
		const y = (x + n / x) >> 1n;
		if (y >= x) break;
		x = y;
	}
	while (x * x > n) x--;
	while ((x + 1n) * (x + 1n) <= n) x++;
	return x;
}

const gcdBig = (a: bigint, b: bigint): bigint => {
	while (b) [a, b] = [b, a % b];
	return a < 0n ? -a : a;
};

/** A reduced fraction of BigInts as a Rational; throws, like Rational, when it leaves the safe integers. */
function ratio(num: bigint, den: bigint): Rational {
	const g = gcdBig(num, den) || 1n;
	return Rational.of(Number(num / g), Number(den / g));
}

/** The square root of num/den (≥ 0) to `digits` decimals, rounded half up; exact when the root is a short decimal. */
function sqrtBig(num: bigint, den: bigint, digits: number): { tex: string; text: string; exact: boolean } {
	const g = gcdBig(num, den) || 1n;
	num /= g;
	den /= g;
	const scale = 10n ** BigInt(digits);
	const a = isqrt(num);
	const b = isqrt(den);
	if (a * a === num && b * b === den) return { ...scaledDecimal((a * scale * 2n + b) / (2n * b), digits), exact: (a * scale) % b === 0n };
	// sqrt(num/den) = sqrt(num·den)/den; x ≈ 2 · sqrt(num·den) · 10^digits.
	const x = isqrt(num * den * scale * scale * 4n);
	return { ...scaledDecimal((x + den) / (2n * den), digits), exact: false };
}

/**
 * The square root of a non-negative rational to `digits` decimals: exact when the root is a rational with a short
 * decimal ($\sqrt{3{,}24} = 1{,}8$), else rounded half up.
 */
export const sqrtDecimal = (r: Rational, digits = DIGITS) => sqrtBig(BigInt(r.num), BigInt(r.den), digits);

/** A root for a formula after "=": "= 2" or "\approx 1{,}8028". */
function rootTex(r: Rational, highlight = false): string {
	const d = sqrtDecimal(r);
	const v = highlight ? `\\hl{${d.tex}}` : d.tex;
	return `${d.exact ? '=' : '\\approx'} ${v}`;
}

/** A rational in a formula: a decimal when it is exact, else a fraction. */
function numTex(r: Rational, digits = TABLE_DIGITS): string {
	const d = decimal(r, digits);
	if (d.exact) return d.tex;
	const sign = r.sign() < 0 ? '-' : '';
	return `${sign}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
}

function readList(input: string): Rational[] | string {
	const parts = splitList(input);
	const example = 'per esempio 3 5 6 8';
	if (!parts.length) return `Scrivi i dati separati da uno spazio o da un punto e virgola, ${example}.`;
	if (parts.length > MAX_VALUES) return `Al massimo ${MAX_VALUES} dati alla volta: togline qualcuno.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi i dati separati da uno spazio; per i decimali usa la virgola, per esempio 7,5.`;
		out.push(r);
	}
	if (out.length < 2) return `Servono almeno due dati, ${example}.`;
	return out;
}

const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);

export interface Spread {
	n: number;
	mean: Rational;
	/** $x_i - \bar{x}$, in the order of the data. */
	deviations: Rational[];
	squares: Rational[];
	/** Sum of the squared deviations. */
	ss: Rational;
	/** Population variance, dividing by n. */
	variance: Rational;
	/** Sample variance, dividing by n - 1. */
	sampleVariance: Rational;
}

export function spread(xs: Rational[]): Spread {
	const n = xs.length;
	const N = BigInt(n);
	// On whole numbers: y = x · D, with D the common denominator of the data. A deviation is (n·y - Σy) / (n·D).
	const D = BigInt(xs.reduce((a, x) => lcm(a, x.den), 1));
	const ys = xs.map((x) => BigInt(x.num) * (D / BigInt(x.den)));
	const S = ys.reduce((a, y) => a + y, 0n);
	const devs = ys.map((y) => N * y - S);
	const ssNum = devs.reduce((a, d) => a + d * d, 0n);
	const ssDen = N * N * D * D;
	return {
		n,
		mean: ratio(S, N * D),
		deviations: devs.map((d) => ratio(d, N * D)),
		squares: devs.map((d) => ratio(d * d, ssDen)),
		ss: ratio(ssNum, ssDen),
		variance: ratio(ssNum, ssDen * N),
		sampleVariance: ratio(ssNum, ssDen * (N - 1n))
	};
}

function compute(input: string): Outcome {
	const xs = readList(input);
	if (typeof xs === 'string') return fail(xs);
	const s = spread(xs);
	const { n, mean, deviations, squares, ss, variance, sampleVariance } = s;
	// Decimals when every deviation and square is a short decimal; else fractions over a common denominator.
	const decimals = decimal(mean, DIGITS).exact && squares.every((q) => decimal(q, TABLE_DIGITS).exact);
	const L = decimals ? 1 : deviations.reduce((a, d) => lcm(a, d.den), 1);
	const cellNum = (r: Rational) => (decimals ? numTex(r) : r.isZero() ? '0' : `${r.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num * (L / r.den))}}{${L}}`);
	const cellSq = (r: Rational) => (decimals ? numTex(r) : `\\dfrac{${(r.num * ((L * L) / r.den)).toString()}}{${L * L}}`);

	const steps: Step[] = [
		{ group: 'La media', say: 'Somma tutti i dati.', math: sumLines(xs) },
		{
			say: `Dividi la somma per quanti sono i dati, cioè $${n}$.`,
			math: decimals
				? [`\\bar{x} = \\dfrac{${t(sum(xs))}}{${n}}`, resultTex(mean)]
				: [
						...(mean.den === n && sum(xs).isInteger() ? [`\\bar{x} = \\hl{${numTex(mean)}}`] : [`\\bar{x} = \\dfrac{${t(sum(xs))}}{${n}}`, `= \\hl{${numTex(mean)}}`]),
						`\\approx ${decimal(mean, DIGITS).tex}`
					],
			then: decimals ? undefined : 'La media non è un decimale finito: tienila come frazione, così i conti restano esatti.'
		},
		{
			group: 'Gli scarti dalla media',
			say: 'Togli la media da ogni dato, poi eleva al quadrato.',
			table: {
				head: ['$x_i$', '$x_i - \\bar{x}$', '$(x_i - \\bar{x})^2$'],
				rows: [...xs.map((x, i) => [`$${t(x, TABLE_DIGITS)}$`, `$${cellNum(deviations[i])}$`, `$${cellSq(squares[i])}$`]), ['somma', '$0$', `$\\hl{${decimals ? numTex(ss) : cellSq(ss)}}$`]]
			},
			then: 'La somma degli scarti è $0$: la media è giusta.'
		}
	];

	if (decimals) steps.push({ say: 'Somma i quadrati degli scarti.', math: sumLines(squares, TABLE_DIGITS) });
	else {
		const nums = squares.map((q) => Rational.of(q.num * ((L * L) / q.den)));
		const total = nums.reduce((a, b) => a + b.num, 0);
		const reduced = ss.den !== L * L;
		steps.push({
			say: `I quadrati hanno tutti denominatore $${L * L}$: somma i numeratori.`,
			math: [...sumLines(nums, 0).map((l) => l.replace(/\\hl\{([^}]*)\}$/, '$1')), reduced ? `\\dfrac{${total}}{${L * L}} = \\hl{${numTex(ss)}}` : `\\hl{\\dfrac{${total}}{${L * L}}}`]
		});
	}

	const ssTex = numTex(ss);
	/** The sum of squares divided by d: a fraction line with decimals, a division with a fraction. */
	const divide = (name: string, d: number, r: Rational) => [
		`${name} = ${decimals ? `\\dfrac{${ssTex}}{${d}}` : `${ssTex} : ${d}`}`,
		...(decimals || decimal(r, TABLE_DIGITS).exact ? [] : [`= ${numTex(r)}`]),
		resultTex(r)
	];
	steps.push({
		group: 'La varianza e lo scarto quadratico medio',
		say: `Dividi la somma dei quadrati per $${n}$, il numero dei dati.`,
		math: divide('\\sigma^2', n, variance)
	});
	steps.push({
		say: 'Fai la radice quadrata della varianza.',
		math: [`\\sigma = \\sqrt{${numTex(variance)}}`, rootTex(variance, true)],
		then: 'È lo scarto quadratico medio, detto anche deviazione standard.'
	});

	const sigma = sqrtDecimal(variance);
	let cvRow = 'non si calcola: la media è $0$';
	let cvText = 'non si calcola';
	if (mean.isZero()) steps.push({ group: 'Il coefficiente di variazione', say: 'Il coefficiente di variazione divide per la media.', then: 'Qui la media è $0$: il coefficiente di variazione non si può calcolare.' });
	else {
		// CV = σ / |x̄|, computed as the root of σ² / x̄² so it is rounded once.
		// σ² / x̄², on BigInt: the product of the two denominators can pass the safe integers.
		const cvNum = BigInt(variance.num) * BigInt(mean.den) ** 2n;
		const cvDen = BigInt(variance.den) * BigInt(mean.num) ** 2n;
		const cv = sqrtBig(cvNum, cvDen, DIGITS);
		const pct = sqrtBig(cvNum * 10000n, cvDen, 2);
		const absMean = mean.abs();
		cvRow = `$${pct.exact ? '' : '\\approx '}${pct.tex}\\%$`;
		cvText = `${pct.text} %`;
		steps.push({
			group: 'Il coefficiente di variazione',
			say: 'Dividi lo scarto quadratico medio per la media, senza segno.',
			math: [
				`\\text{CV} = \\dfrac{\\sigma}{|\\bar{x}|}`,
				`${sigma.exact && decimal(absMean, DIGITS).exact ? '=' : '\\approx'} \\dfrac{${sigma.tex}}{${t(absMean).replace('\\approx ', '')}}`,
				`${cv.exact ? '=' : '\\approx'} ${cv.tex}`,
				`${pct.exact ? '=' : '\\approx'} \\hl{${pct.tex}\\%}`
			],
			then: xs.some((x) => x.sign() < 0) ? 'Con dati negativi il coefficiente dice poco: si usa per dati tutti positivi.' : 'Dice quanto sono dispersi i dati rispetto alla loro media, in percentuale.'
		});
	}

	const sd = sqrtDecimal(sampleVariance);
	steps.push({
		group: 'Se i dati sono un campione',
		say: `Dividi la somma dei quadrati per $${n - 1}$, cioè $n - 1$.`,
		math: [...divide('s^2', n - 1, sampleVariance), `s = \\sqrt{s^2} ${sd.exact ? '=' : '\\approx'} ${sd.tex}`],
		then: 'È la varianza campionaria, il tasto $s_x$ della calcolatrice. A scuola di solito si divide per $n$.'
	});

	return {
		ok: true,
		rows: [
			{ label: 'Media', value: `$${t(mean)}$` },
			{ label: 'Varianza', value: `$${t(variance)}$` },
			{ label: 'Deviazione standard (scarto quadratico medio)', value: `$${sigma.exact ? '' : '\\approx '}${sigma.tex}$` },
			{ label: 'Coefficiente di variazione', value: cvRow },
			{ label: 'Varianza campionaria (divisore n − 1)', value: `$${t(sampleVariance)}$` }
		],
		copy: `media ${txt(mean)}; varianza ${txt(variance)}; deviazione standard ${sigma.text}; coefficiente di variazione ${cvText}; varianza campionaria ${txt(sampleVariance)}`,
		steps
	};
}

export function varianza(input: string): Outcome {
	try {
		return compute(input);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre, per esempio 7,5 invece di 7,4999.');
	}
}
