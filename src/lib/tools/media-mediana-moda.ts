import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, decimalTex, parseDecimal } from './numbers';

/**
 * Mean, median, mode and range of a list of numbers, and the weighted mean, as the lesson "Media, mediana e moda"
 * does them (statistica-medie): $\bar{x}$ for the mean, $\text{Me}$ for the median, "la distribuzione non ha moda"
 * when every value has the same frequency. Exact arithmetic with Rational.
 */

export type MeanKind = 'semplice' | 'ponderata';

const MAX_VALUES = 100;
/** Four decimals at most: a periodic mean reads 6,3333. */
const DIGITS = 4;
const t = (r: Rational) => decimalTex(r, DIGITS);
const txt = (r: Rational) => decimal(r, DIGITS).text;
/** A value inside a sum or a product: negatives in brackets. */
const term = (r: Rational) => (r.sign() < 0 ? `(${t(r)})` : t(r));

/** What follows a calculation, highlighted: "= \hl{12{,}5}", or "\approx \hl{0{,}3333}" when rounded. */
export function resultTex(r: Rational, digits = DIGITS): string {
	const d = decimal(r, digits);
	return `${d.exact ? '=' : '\\approx'} \\hl{${d.tex}}`;
}

/** Terms per line of a sum, and characters: more would not fit on a phone. */
const PER_LINE = 4;
const LINE_CHARS = 26;
/** About how many characters a formula takes on screen. */
const width = (tex: string) => tex.replace(/\{,\}/g, ',').replace(/\\,/g, '').replace(/\\hl\{|[{}]/g, '').length;

/**
 * A sum as lines of calculation, none too wide for a phone: on one line when it fits (up to four terms, or a short
 * line); otherwise the terms are added in groups of three or four, each group on a line with its partial sum, then the partial sums the same way. The total is
 * highlighted. Negatives after the first term of a line go in brackets.
 */
export function sumLines(xs: Rational[], digits = DIGITS): string[] {
	const tx = (r: Rational) => decimalTex(r, digits);
	const line = (part: Rational[]) => part.map((x, i) => (i > 0 && x.sign() < 0 ? `(${tx(x)})` : tx(x))).join(' + ');
	const total = sum(xs);
	const one = `${line(xs)} ${resultTex(total, digits)}`;
	if (xs.length <= PER_LINE || width(one) <= LINE_CHARS) return [one];
	const groups = Math.ceil(xs.length / PER_LINE);
	const chunks: Rational[][] = [];
	let at = 0;
	for (let g = 0; g < groups; g++) {
		const size = Math.floor(xs.length / groups) + (g < xs.length % groups ? 1 : 0);
		chunks.push(xs.slice(at, at + size));
		at += size;
	}
	const partials = chunks.map(sum);
	return [...chunks.map((c, i) => `${line(c)} = ${tx(partials[i])}`), ...sumLines(partials, digits)];
}

/** Values separated by spaces, semicolons or a comma followed by a space ("7,5; 8 6", "4, 5, 6"). */
export function splitList(input: string): string[] {
	return input
		.split(/;|,(?=\s)|\s+/)
		.map((p) => p.trim())
		.filter(Boolean);
}

function readList(input: string, what: string, example: string): Rational[] | string {
	const parts = splitList(input);
	if (!parts.length) return `Scrivi ${what} separati da uno spazio o da un punto e virgola, per esempio ${example}.`;
	if (parts.length > MAX_VALUES) return `Al massimo ${MAX_VALUES} valori alla volta: togline qualcuno.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi ${what} separati da uno spazio; per i decimali usa la virgola, per esempio 7,5.`;
		out.push(r);
	}
	return out;
}

function sum(xs: Rational[]): Rational {
	return xs.reduce((a, b) => a.add(b), ZERO);
}

export interface Stats {
	n: number;
	sorted: Rational[];
	sum: Rational;
	mean: Rational;
	median: Rational;
	/** Each distinct value with how many times it appears, in increasing order. */
	counts: { value: Rational; count: number }[];
	/** The values with the highest frequency, in increasing order; empty when every value has the same frequency. */
	modes: Rational[];
	/** How many times each mode appears. */
	modeCount: number;
	min: Rational;
	max: Rational;
	range: Rational;
}

export function stats(xs: Rational[]): Stats {
	const sorted = [...xs].sort((a, b) => a.compare(b));
	const n = sorted.length;
	const s = sum(sorted);
	const median = n % 2 ? sorted[(n - 1) / 2] : sorted[n / 2 - 1].add(sorted[n / 2]).div(Rational.of(2));
	const byValue = new Map<string, { value: Rational; count: number }>();
	for (const x of sorted) {
		const k = x.toString();
		const c = byValue.get(k);
		if (c) c.count++;
		else byValue.set(k, { value: x, count: 1 });
	}
	const counts = [...byValue.values()];
	const top = Math.max(...counts.map((g) => g.count));
	const modes = counts.every((g) => g.count === top) ? [] : counts.filter((g) => g.count === top).map((g) => g.value);
	const min = sorted[0];
	const max = sorted[n - 1];
	return { n, sorted, sum: s, mean: s.div(Rational.of(n)), median, counts, modes, modeCount: top, min, max, range: max.sub(min) };
}

const times = (k: number) => (k === 1 ? 'una volta' : k === 2 ? 'due volte' : `${k} volte`);
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);
const cell = (s: string, on: boolean) => `$${on ? `\\hl{${s}}` : s}$`;

function modeConclusion(s: Stats): string {
	if (!s.modes.length) return `Tutti compaiono ${times(s.modeCount)}, nessuno più degli altri: la distribuzione non ha moda.`;
	if (s.modes.length === 1) return `Il $${t(s.modes[0])}$ compare ${times(s.modeCount)}, più di tutti gli altri: la moda è $${t(s.modes[0])}$.`;
	const names = andList(s.modes.map((m) => `$${t(m)}$`));
	return s.modes.length === 2
		? `${names} compaiono ${times(s.modeCount)} ciascuno, più degli altri: le mode sono due e la distribuzione è bimodale.`
		: `${names} compaiono ${times(s.modeCount)} ciascuno, più degli altri: sono tutti mode.`;
}

function simple(values: string): Outcome {
	const xs = readList(values, 'dei numeri', '7 9 12');
	if (typeof xs === 'string') return fail(xs);
	if (xs.length < 2) return fail('Servono almeno due numeri, per esempio 7 9 12.');
	const s = stats(xs);
	const { n, sorted } = s;
	const odd = n % 2 === 1;
	// Positions (from 1) of the values in the middle.
	const middle = odd ? [(n + 1) / 2] : [n / 2, n / 2 + 1];

	const steps: Step[] = [
		{ group: 'La media', say: 'Somma tutti i valori.', math: sumLines(xs) },
		{ say: `Dividi la somma per quanti sono i valori, cioè $${n}$.`, math: [`\\bar{x} = \\dfrac{${t(s.sum)}}{${n}}`, resultTex(s.mean)] },
		{
			group: 'La mediana',
			say: 'Metti i valori in ordine, dal più piccolo al più grande.',
			table: { head: ['Posto', 'Valore'], rows: sorted.map((x, i) => [cell(`${i + 1}`, middle.includes(i + 1)), cell(t(x), middle.includes(i + 1))]) }
		}
	];
	if (odd) {
		steps.push({
			say: `I valori sono $${n}$, un numero dispari: cerca il posto centrale.`,
			math: [`\\text{posto} = \\dfrac{${n} + 1}{2} = ${middle[0]}`],
			then: `La mediana è il valore al posto ${middle[0]}: $\\text{Me} = ${t(s.median)}$.`
		});
	} else {
		const a = sorted[n / 2 - 1];
		const b = sorted[n / 2];
		steps.push(
			a.equals(b)
				? {
						say: `I valori sono $${n}$, un numero pari: guarda i due al centro.`,
						then: `Sono al posto ${n / 2} e al posto ${n / 2 + 1}, e sono uguali: $\\text{Me} = ${t(s.median)}$.`
					}
				: {
						say: `I valori sono $${n}$, un numero pari: fai la media dei due al centro.`,
						math: [`\\text{Me} = \\dfrac{${t(a)} + ${term(b)}}{2}`, `= \\dfrac{${t(a.add(b))}}{2}`, resultTex(s.median)]
					}
		);
	}
	steps.push(
		{
			group: 'La moda',
			say: 'Conta quante volte compare ogni valore.',
			table: { head: ['Valore', 'Quante volte'], rows: s.counts.map((c) => [cell(t(c.value), s.modes.some((m) => m.equals(c.value))), `$${c.count}$`]) },
			then: modeConclusion(s)
		},
		{ group: 'Il campo di variazione', say: 'Togli il valore più piccolo dal più grande.', math: [`${t(s.max)} - ${term(s.min)} = \\hl{${t(s.range)}}`] }
	);

	const modeText = s.modes.length ? andList(s.modes.map(txt)) : 'nessuna';
	return {
		ok: true,
		rows: [
			{ label: 'Media', value: `$${t(s.mean)}$` },
			{ label: 'Mediana', value: `$${t(s.median)}$` },
			{ label: s.modes.length > 1 ? 'Mode' : 'Moda', value: s.modes.length ? andList(s.modes.map((m) => `$${t(m)}$`)) : 'nessuna' },
			{ label: 'Campo di variazione', value: `$${t(s.range)}$` }
		],
		copy: `media ${txt(s.mean)}; mediana ${txt(s.median)}; ${s.modes.length > 1 ? 'mode' : 'moda'} ${modeText}; campo di variazione ${txt(s.range)}`,
		steps
	};
}

const PAIRS_EXAMPLE = 'per esempio 6:2 8:2 5:1';

/** Pairs "valore:peso" in one field ("6:1 8:2"), when the weights field is empty. */
function readPairs(values: string): { xs: Rational[]; ws: Rational[] } | string | null {
	const parts = splitList(values);
	if (!parts.some((p) => p.includes(':'))) return null;
	const xs: Rational[] = [];
	const ws: Rational[] = [];
	for (const p of parts) {
		const [x, w, extra] = p.split(':');
		const rx = parseDecimal(x ?? '');
		const rw = parseDecimal(w ?? '');
		if (extra !== undefined || !rx || !rw) return `"${p}" non va bene. Scrivi ogni coppia come valore:peso, ${PAIRS_EXAMPLE}.`;
		xs.push(rx);
		ws.push(rw);
	}
	return { xs, ws };
}

function weighted(values: string, weights: string): Outcome {
	let xs: Rational[];
	let ws: Rational[];
	const pairs = weights.trim() ? null : readPairs(values);
	if (typeof pairs === 'string') return fail(pairs);
	if (pairs) {
		({ xs, ws } = pairs);
		if (xs.length > MAX_VALUES) return fail(`Al massimo ${MAX_VALUES} valori alla volta: togline qualcuno.`);
	} else {
		const rx = readList(values, 'i valori', '6 8 5');
		if (typeof rx === 'string') return fail(rx);
		if (!weights.trim()) return fail(`Scrivi i pesi, uno per ogni valore e nello stesso ordine, per esempio 2 2 1. Oppure scrivi le coppie valore:peso nel primo campo, ${PAIRS_EXAMPLE}.`);
		const rw = readList(weights, 'i pesi', '2 2 1');
		if (typeof rw === 'string') return fail(rw);
		xs = rx;
		ws = rw;
	}
	if (xs.length !== ws.length)
		return fail(`Hai scritto ${xs.length} ${xs.length === 1 ? 'valore' : 'valori'} e ${ws.length} ${ws.length === 1 ? 'peso' : 'pesi'}: serve un peso per ogni valore, per esempio valori 6 8 5 e pesi 2 2 1.`);
	if (xs.length < 2) return fail(`Servono almeno due valori, ${PAIRS_EXAMPLE}.`);
	if (ws.some((w) => w.sign() <= 0)) return fail('I pesi devono essere numeri maggiori di zero, per esempio 2 2 1.');

	const products = xs.map((x, i) => x.mul(ws[i]));
	const P = sum(products);
	const W = sum(ws);
	const mean = P.div(W);
	const steps: Step[] = [
		{
			say: 'Moltiplica ogni valore per il suo peso.',
			table: { head: ['Valore', 'Peso', 'Valore per peso'], rows: xs.map((x, i) => [`$${t(x)}$`, `$${t(ws[i])}$`, `$${term(x)} \\cdot ${term(ws[i])} = ${t(products[i])}$`]) }
		},
		{ say: 'Somma i prodotti.', math: sumLines(products) },
		{ say: 'Somma i pesi.', math: sumLines(ws) },
		{
			say: 'Dividi la somma dei prodotti per la somma dei pesi.',
			math: [`\\bar{x} = \\dfrac{${t(P)}}{${t(W)}}`, resultTex(mean)],
			then: W.equals(Rational.of(xs.length)) ? undefined : `Si divide per la somma dei pesi ($${t(W)}$), non per quanti sono i valori ($${xs.length}$).`
		}
	];
	return { ok: true, rows: [{ label: 'Media ponderata', value: `$${t(mean)}$` }], copy: txt(mean), steps };
}

export function medie(kind: MeanKind, values: string, weights = ''): Outcome {
	try {
		return kind === 'ponderata' ? weighted(values, weights) : simple(values);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre, per esempio 7,5 invece di 7,4999.');
	}
}
