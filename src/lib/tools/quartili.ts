import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { splitList, stats } from './media-mediana-moda';

/**
 * Quartiles, interquartile range and the five numbers of a box plot, with the method of the Italian school books:
 * sort the data, $Q_2$ is the median, $Q_1$ the median of the half before it and $Q_3$ the median of the half after
 * it; with an odd number of data the median belongs to neither half. Calculators and spreadsheets use other rules
 * (interpolating between positions), which can give slightly different quartiles; the article says so.
 */

const MAX_VALUES = 100;
const DIGITS = 12;

/** The five numbers of the box plot, as plain numbers for the drawing. */
export interface BoxData {
	min: number;
	q1: number;
	med: number;
	q3: number;
	max: number;
}

const tex = (r: Rational) => decimal(r, DIGITS).tex;
const text = (r: Rational) => decimal(r, DIGITS).text;
const num = (r: Rational) => r.num / r.den;
/** A value inside a sum: negatives in brackets. */
const term = (r: Rational) => (r.sign() < 0 ? `(${tex(r)})` : tex(r));

function readList(input: string): Rational[] | string {
	const parts = splitList(input);
	const example = 'per esempio 2 4 5 7 8 9 12';
	if (!parts.length) return `Scrivi i dati separati da uno spazio o da un punto e virgola, ${example}.`;
	if (parts.length > MAX_VALUES) return `Al massimo ${MAX_VALUES} dati alla volta: togline qualcuno.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi i dati separati da uno spazio; per i decimali usa la virgola, per esempio 7,5.`;
		out.push(r);
	}
	if (out.length < 4) return `Servono almeno quattro dati, ${example}.`;
	return out;
}

/** Positions (from 1) of the middle of a list of n: one when n is odd, two when it is even. */
const middle = (n: number) => (n % 2 ? [(n + 1) / 2] : [n / 2, n / 2 + 1]);

/** A list of sorted values in a row, positions above, the middle ones highlighted. */
function rowTable(values: Rational[], offset = 0): Step['table'] {
	const mid = middle(values.length);
	return {
		head: values.map((_, i) => `$${i + 1 + offset}$`),
		rows: [values.map((v, i) => (mid.includes(i + 1) ? `$\\hl{${tex(v)}}$` : `$${tex(v)}$`))]
	};
}

/** The median of sorted values, as a step: the middle value, or the mean of the two in the middle. */
function medianStep(values: Rational[], name: string, say: string, whole = false): Step {
	const n = values.length;
	const med = stats(values).median;
	if (n % 2) return { say, math: [`${name} = \\hl{${tex(med)}}`], then: whole ? `È il dato al posto ${(n + 1) / 2}, con ${(n - 1) / 2} dati prima e ${(n - 1) / 2} dopo.` : 'È il dato al centro di questa metà.' };
	const a = values[n / 2 - 1];
	const b = values[n / 2];
	if (a.equals(b)) return { say, math: [`${name} = \\hl{${tex(med)}}`], then: 'I due dati al centro sono uguali.' };
	return { say, math: [`${name} = \\dfrac{${tex(a)} + ${term(b)}}{2}`, `= \\dfrac{${tex(a.add(b))}}{2}`, `= \\hl{${tex(med)}}`] };
}

function compute(input: string): { outcome: Outcome; box: BoxData | null } {
	const xs = readList(input);
	if (typeof xs === 'string') return { outcome: fail(xs), box: null };
	const s = stats(xs);
	const { n, sorted } = s;
	const odd = n % 2 === 1;
	const half = Math.floor(n / 2);
	const lower = sorted.slice(0, half);
	const upper = sorted.slice(n - half);
	const q1 = stats(lower).median;
	const q3 = stats(upper).median;
	const iqr = q3.sub(q1);

	const steps: Step[] = [
		{ group: 'La mediana', say: 'Metti i dati in ordine, dal più piccolo al più grande.', table: rowTable(sorted) },
		medianStep(sorted, 'Q_2 = \\text{Me}', odd ? `I dati sono $${n}$, un numero dispari: prendi quello al centro.` : `I dati sono $${n}$, un numero pari: fai la media dei due al centro.`, true),
		{
			group: 'Il primo quartile',
			say: odd ? `Prendi i $${half}$ dati prima della mediana.` : `Prendi la prima metà dei dati, cioè i primi $${half}$.`,
			table: rowTable(lower),
			then: odd ? 'Con un numero dispari di dati la mediana non entra in nessuna delle due metà.' : undefined
		},
		medianStep(lower, 'Q_1', 'Trova la mediana di questa metà.'),
		{
			group: 'Il terzo quartile',
			say: odd ? `Prendi i $${half}$ dati dopo la mediana.` : `Prendi la seconda metà dei dati, cioè gli ultimi $${half}$.`,
			table: rowTable(upper, n - half)
		},
		medianStep(upper, 'Q_3', 'Trova la mediana di questa metà.'),
		{
			group: 'Lo scarto interquartile',
			say: 'Togli il primo quartile dal terzo.',
			math: [`Q_3 - Q_1 = ${tex(q3)} - ${term(q1)} = \\hl{${tex(iqr)}}`],
			then: 'Tra $Q_1$ e $Q_3$ sta la metà centrale dei dati: è la scatola del box plot.'
		},
		{
			group: 'Il box plot',
			say: "Leggi il minimo e il massimo: sono il primo e l'ultimo dato in ordine.",
			then: `I baffi del box plot vanno da $${tex(s.min)}$ a $${tex(s.max)}$; la linea dentro la scatola è la mediana, $${tex(s.median)}$.`
		}
	];

	return {
		outcome: {
			ok: true,
			rows: [
				{ label: 'Minimo', value: `$${tex(s.min)}$` },
				{ label: 'Primo quartile (Q1)', value: `$${tex(q1)}$` },
				{ label: 'Mediana (Q2)', value: `$${tex(s.median)}$` },
				{ label: 'Terzo quartile (Q3)', value: `$${tex(q3)}$` },
				{ label: 'Massimo', value: `$${tex(s.max)}$` },
				{ label: 'Scarto interquartile', value: `$${tex(iqr)}$` }
			],
			copy: `minimo ${text(s.min)}; Q1 ${text(q1)}; mediana ${text(s.median)}; Q3 ${text(q3)}; massimo ${text(s.max)}; scarto interquartile ${text(iqr)}`,
			steps
		},
		box: { min: num(s.min), q1: num(q1), med: num(s.median), q3: num(q3), max: num(s.max) }
	};
}

/** The quartiles of a list of numbers, with the steps and the five numbers for the box plot. */
export function quartili(input: string): { outcome: Outcome; box: BoxData | null } {
	try {
		return compute(input);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return { outcome: fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre.'), box: null };
	}
}
