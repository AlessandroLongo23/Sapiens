import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { splitList } from './media-mediana-moda';
import { frac, fracTex, rootDecimal } from './medie-speciali';

/**
 * The least-squares line $y = mx + q$ and Pearson's correlation coefficient $r$ of pairs (x, y), with the table of
 * products ($x^2$, $y^2$, $xy$ and their sums) and the formulas on sums that the Italian books use:
 * $m = \dfrac{n\Sigma xy - \Sigma x \Sigma y}{n\Sigma x^2 - (\Sigma x)^2}$, $q = \bar{y} - m\bar{x}$,
 * $r = \dfrac{n\Sigma xy - \Sigma x \Sigma y}{\sqrt{(n\Sigma x^2 - (\Sigma x)^2)(n\Sigma y^2 - (\Sigma y)^2)}}$.
 * Exact arithmetic: m and q as decimals or fractions, r as a decimal to four places (exact when it is ±1).
 */

const MAX_PAIRS = 50;
const DIGITS = 4;

/** What the scatter plot draws: the points, and the line when there is one. */
export interface ScatterData {
	points: [number, number][];
	m: number;
	q: number;
}

/** A rational in a formula: a decimal when it ends within six digits, else a fraction. */
function ex(r: Rational): string {
	const d = decimal(r, 6);
	if (d.exact) return d.tex;
	return `${r.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
}
/** The same inside a product or after a minus: negatives in brackets. */
const br = (r: Rational) => (r.sign() < 0 ? `(${ex(r)})` : ex(r));
const approx = (r: Rational) => decimal(r, DIGITS);
const isShort = (r: Rational) => decimal(r, 6).exact;

function readList(input: string, name: string): Rational[] | string {
	const parts = splitList(input);
	const example = name === 'x' ? 'per esempio 1 2 3 4 5' : 'per esempio 5 5,5 6,5 7 8,5';
	if (!parts.length) return `Scrivi i valori di ${name} separati da uno spazio, ${example}.`;
	if (parts.length > MAX_PAIRS) return `Al massimo ${MAX_PAIRS} coppie alla volta: togline qualcuna.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi i valori di ${name} separati da uno spazio; per i decimali usa la virgola, per esempio 7,5.`;
		out.push(r);
	}
	return out;
}

const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), Rational.of(0));

/** "2x + 3", "-x", "\dfrac{7}{3}x - \dfrac{1}{2}", "4": the right side of y = mx + q. */
export function lineTex(m: Rational, q: Rational, fmt: (r: Rational) => string = ex): string {
	let s = '';
	if (!m.isZero()) s = m.equals(Rational.of(1)) ? 'x' : m.equals(Rational.of(-1)) ? '-x' : `${fmt(m)}x`;
	if (q.isZero()) return s || '0';
	if (!s) return fmt(q);
	return q.sign() < 0 ? `${s} - ${fmt(q.neg())}` : `${s} + ${fmt(q)}`;
}

/** Strength of a linear correlation from r² = n/d, with the thresholds of the school books (0,3 and 0,7). */
function strength(n: bigint, d: bigint, positive: boolean): string {
	const side = positive ? 'positiva' : 'negativa';
	if (n === d) return `correlazione perfetta e ${side}, con i punti tutti sulla retta`;
	if (n === 0n) return 'nessuna correlazione lineare';
	if (n * 100n >= d * 49n) return `correlazione forte e ${side}`;
	if (n * 100n >= d * 9n) return `correlazione moderata e ${side}`;
	return `correlazione debole e ${side}`;
}

function compute(xInput: string, yInput: string): { outcome: Outcome; plot: ScatterData | null } {
	const nothing = (error: string) => ({ outcome: fail(error), plot: null });
	const xs = readList(xInput, 'x');
	if (typeof xs === 'string') return nothing(xs);
	const ys = readList(yInput, 'y');
	if (typeof ys === 'string') return nothing(ys);
	if (xs.length !== ys.length) return nothing(`Hai scritto ${xs.length} valori di x e ${ys.length} di y: serve una y per ogni x, nello stesso ordine.`);
	const n = xs.length;
	if (n < 2) return nothing('Servono almeno due coppie, per esempio x: 1 2 3 e y: 2 4 5.');
	const points: [number, number][] = xs.map((x, i) => [x.num / x.den, ys[i].num / ys[i].den]);

	const N = Rational.of(n);
	const Sx = sum(xs);
	const Sy = sum(ys);
	const Sxx = sum(xs.map((x) => x.mul(x)));
	const Syy = sum(ys.map((y) => y.mul(y)));
	const Sxy = sum(xs.map((x, i) => x.mul(ys[i])));
	const num = N.mul(Sxy).sub(Sx.mul(Sy));
	const Dx = N.mul(Sxx).sub(Sx.mul(Sx));
	const Dy = N.mul(Syy).sub(Sy.mul(Sy));
	if (Dx.isZero()) return nothing('Le x sono tutte uguali: i punti stanno su una retta verticale, che non si scrive nella forma y = mx + q. Scrivi almeno due x diverse.');

	const mx = Sx.div(N);
	const my = Sy.div(N);
	const m = num.div(Dx);
	const q = my.sub(m.mul(mx));

	const table: Step['table'] = {
		head: ['', '$x$', '$y$', '$x^2$', '$y^2$', '$x \\cdot y$'],
		rows: [
			...xs.map((x, i) => [`$${i + 1}$`, `$${ex(x)}$`, `$${ex(ys[i])}$`, `$${ex(x.mul(x))}$`, `$${ex(ys[i].mul(ys[i]))}$`, `$${ex(x.mul(ys[i]))}$`]),
			['somma', `$\\hl{${ex(Sx)}}$`, `$\\hl{${ex(Sy)}}$`, `$\\hl{${ex(Sxx)}}$`, `$\\hl{${ex(Syy)}}$`, `$\\hl{${ex(Sxy)}}$`]
		]
	};

	/** "\bar{x} = \dfrac{15}{5} = 3", or "\bar{x} = \dfrac{7}{3} \approx 2{,}3333" when the mean is the fraction itself. */
	const meanLine = (name: string, S: Rational, mean: Rational) => {
		const over = `\\dfrac{${ex(S)}}{${n}}`;
		const value = isShort(mean) ? `= ${ex(mean)}` : ex(mean) === over ? `\\approx ${approx(mean).tex}` : `= ${ex(mean)} \\approx ${approx(mean).tex}`;
		return `${name} = ${over} ${value}`;
	};
	const valueLine = (r: Rational) => (isShort(r) ? [`= \\hl{${ex(r)}}`] : [`= \\hl{${ex(r)}}`, `\\approx ${approx(r).tex}`]);
	const steps: Step[] = [
		{ group: 'La tabella dei prodotti', say: 'Per ogni coppia calcola $x^2$, $y^2$ e $x \\cdot y$, poi somma le colonne.', table, then: `Le coppie sono $n = ${n}$.` },
		{
			group: 'La retta di regressione',
			say: 'Calcola le medie di $x$ e di $y$.',
			math: [meanLine('\\bar{x}', Sx, mx), meanLine('\\bar{y}', Sy, my)]
		},
		{
			say: 'Calcola il coefficiente angolare $m$ con le somme della tabella.',
			math: [
				`m = \\dfrac{n\\,\\Sigma xy - \\Sigma x\\,\\Sigma y}{n\\,\\Sigma x^2 - (\\Sigma x)^2}`,
				`= \\dfrac{${n} \\cdot ${br(Sxy)} - ${br(Sx)} \\cdot ${br(Sy)}}{${n} \\cdot ${br(Sxx)} - ${br(Sx)}^2}`,
				`= \\dfrac{${ex(num)}}{${ex(Dx)}}`,
				...valueLine(m)
			]
		},
		{
			say: 'Calcola il termine noto $q$.',
			math: [`q = \\bar{y} - m\\,\\bar{x}`, `= ${ex(my)} - ${br(m)} \\cdot ${br(mx)}`, ...valueLine(q)],
			then: `La retta di regressione è $y = ${lineTex(m, q)}$.`
		}
	];

	let rRow: string;
	let rText: string;
	if (Dy.isZero()) {
		rRow = 'non si calcola: le $y$ sono tutte uguali';
		rText = 'non si calcola';
		steps.push({
			group: 'Il coefficiente di correlazione',
			say: 'Guarda le $y$: sono tutte uguali.',
			then: 'La retta è orizzontale e il coefficiente $r$ non si calcola: nella formula si dividerebbe per $0$.'
		});
	} else {
		// P = Dx · Dy and r² = num² / P, on BigInt: the products can pass the safe integers.
		const P = frac(BigInt(Dx.num) * BigInt(Dy.num), BigInt(Dx.den) * BigInt(Dy.den));
		const r2 = frac(BigInt(num.num) ** 2n * P.d, BigInt(num.den) ** 2n * P.n);
		const root = rootDecimal(r2.n, r2.d, 2, DIGITS);
		const sign = num.sign() < 0 ? '-' : '';
		const rTex = `${root.exact ? '' : '\\approx '}${sign}${root.tex}`;
		const words = strength(r2.n, r2.d, num.sign() >= 0);
		rRow = `$${rTex}$: ${words}`;
		rText = `${sign}${root.text}`;
		steps.push(
			{
				group: 'Il coefficiente di correlazione',
				say: 'Calcola per le $y$ la stessa differenza del denominatore di $m$.',
				math: [`n\\,\\Sigma y^2 - (\\Sigma y)^2 = ${n} \\cdot ${br(Syy)} - ${br(Sy)}^2`, `= \\hl{${ex(Dy)}}`]
			},
			{
				say: 'Dividi il numeratore di $m$ per la radice del prodotto delle due differenze.',
				math: [
					`r = \\dfrac{n\\,\\Sigma xy - \\Sigma x\\,\\Sigma y}{\\sqrt{(n\\,\\Sigma x^2 - (\\Sigma x)^2)(n\\,\\Sigma y^2 - (\\Sigma y)^2)}}`,
					`= \\dfrac{${ex(num)}}{\\sqrt{${ex(Dx)} \\cdot ${ex(Dy)}}}`,
					`= \\dfrac{${ex(num)}}{\\sqrt{${fracTex(P)}}}`,
					`${root.exact ? '=' : '\\approx'} \\hl{${sign}${root.tex}}`
				],
				then: `${words[0].toUpperCase()}${words.slice(1)}.`
			}
		);
	}

	const approxLine = isShort(m) && isShort(q) ? '' : `, cioè $y \\approx ${lineTex(m, q, (r) => approx(r).tex)}$`;
	return {
		outcome: {
			ok: true,
			rows: [
				{ label: 'Retta di regressione', value: `$y = ${lineTex(m, q)}$${approxLine}` },
				{ label: 'Coefficiente di correlazione di Pearson', value: rRow }
			],
			copy: `y = ${lineTex(m, q, (r) => approx(r).text)}; r = ${rText}`,
			steps
		},
		plot: { points, m: m.num / m.den, q: q.num / q.den }
	};
}

/** The regression line and the correlation of pairs with x values `xInput` and y values `yInput`, in the same order. */
export function regressione(xInput: string, yInput: string): { outcome: Outcome; plot: ScatterData | null } {
	try {
		return compute(xInput, yInput);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return { outcome: fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre.'), plot: null };
	}
}
