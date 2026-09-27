import { Rational, ZERO } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
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
/** "= 12{,}5", or "\\approx 0{,}3333" when rounded: what follows a calculation in a formula. */
const eq = (r: Rational) => (decimal(r, DIGITS).exact ? `= ${t(r)}` : t(r));

/** Values separated by spaces, semicolons or a comma followed by a space ("7,5; 8 6", "4, 5, 6"). */
export function splitList(input: string): string[] {
	return input
		.split(/;|,(?=\s)|\s+/)
		.map((p) => p.trim())
		.filter(Boolean);
}

function readList(input: string, what: string): Rational[] | string {
	const parts = splitList(input);
	if (!parts.length) return `Scrivi ${what}, separati da uno spazio o da un punto e virgola.`;
	if (parts.length > MAX_VALUES) return `Al massimo ${MAX_VALUES} valori alla volta.`;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return `"${p}" non è un numero. Scrivi ${what} separati da uno spazio o da un punto e virgola; per i decimali usa la virgola: 7,5.`;
		out.push(r);
	}
	return out;
}

const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);
const sumTex = (xs: Rational[]) => xs.map((x, i) => (i === 0 ? t(x) : term(x))).join(' + ');
const listTex = (xs: Rational[]) => xs.map(t).join(';\\ ');

export interface Stats {
	n: number;
	sorted: Rational[];
	sum: Rational;
	mean: Rational;
	median: Rational;
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
	const counts = new Map<string, { value: Rational; count: number }>();
	for (const x of sorted) {
		const k = x.toString();
		const c = counts.get(k);
		if (c) c.count++;
		else counts.set(k, { value: x, count: 1 });
	}
	const groups = [...counts.values()];
	const top = Math.max(...groups.map((g) => g.count));
	const modes = groups.every((g) => g.count === top) ? [] : groups.filter((g) => g.count === top).map((g) => g.value);
	const min = sorted[0];
	const max = sorted[n - 1];
	return { n, sorted, sum: s, mean: s.div(Rational.of(n)), median, modes, modeCount: top, min, max, range: max.sub(min) };
}

const times = (k: number) => (k === 1 ? 'una volta' : k === 2 ? 'due volte' : `${k} volte`);
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

function simple(values: string): Outcome {
	const xs = readList(values, 'dei numeri');
	if (typeof xs === 'string') return fail(xs);
	if (xs.length < 2) return fail('Servono almeno due numeri.');
	const s = stats(xs);
	const { n, sorted } = s;

	const steps = [
		`Somma tutti i valori: $${sumTex(xs)} = ${t(s.sum)}$.`,
		`Dividi per il numero dei valori, che sono ${n}: $\\bar{x} = \\dfrac{${t(s.sum)}}{${n}} ${eq(s.mean)}$.`,
		`Per la mediana metti i valori in ordine crescente: $${listTex(sorted)}$.`
	];
	if (n % 2) {
		const pos = (n + 1) / 2;
		steps.push(`I valori sono ${n}, un numero dispari: la mediana è il valore al centro, al posto $\\dfrac{${n} + 1}{2} = ${pos}$. Quindi $\\text{Me} = ${t(s.median)}$.`);
	} else {
		const a = sorted[n / 2 - 1];
		const b = sorted[n / 2];
		steps.push(
			a.equals(b)
				? `I valori sono ${n}, un numero pari: i due al centro, al ${n / 2}° e al ${n / 2 + 1}° posto, sono uguali, quindi $\\text{Me} = ${t(s.median)}$.`
				: `I valori sono ${n}, un numero pari: la mediana è la media dei due al centro, al ${n / 2}° e al ${n / 2 + 1}° posto: $\\text{Me} = \\dfrac{${t(a)} + ${term(b)}}{2} = ${t(s.median)}$.`
		);
	}
	if (!s.modes.length) {
		steps.push(`Conta quante volte compare ogni valore: tutti compaiono ${times(s.modeCount)}, nessuno più degli altri, quindi la distribuzione non ha moda.`);
	} else if (s.modes.length === 1) {
		steps.push(`Conta quante volte compare ogni valore: $${t(s.modes[0])}$ compare ${times(s.modeCount)}, più di tutti gli altri, quindi è la moda.`);
	} else {
		const names = s.modes.map((m) => `$${t(m)}$`);
		steps.push(
			`Conta quante volte compare ogni valore: ${andList(names)} compaiono ${times(s.modeCount)} ciascuno, più di tutti gli altri, ${s.modes.length === 2 ? 'quindi sono entrambi mode e la distribuzione è bimodale' : 'quindi sono tutti mode'}.`
		);
	}
	steps.push(`Il campo di variazione è la differenza tra il valore più grande e il più piccolo: $${t(s.max)} - ${term(s.min)} = ${t(s.range)}$.`);

	const modeTex = s.modes.length ? t(s.modes[0]) : '';
	const modeText = s.modes.length ? andList(s.modes.map(txt)) : 'nessuna';
	const modeResult = !s.modes.length ? 'nessuna moda' : s.modes.length === 1 ? `moda $${modeTex}$` : `mode ${andList(s.modes.map((m) => `$${t(m)}$`))}`;
	return {
		ok: true,
		result: `$\\bar{x} ${eq(s.mean)}$, $\\text{Me} = ${t(s.median)}$, ${modeResult}`,
		copy: `media ${txt(s.mean)}; mediana ${txt(s.median)}; ${s.modes.length > 1 ? 'mode' : 'moda'} ${modeText}; campo di variazione ${txt(s.range)}`,
		steps
	};
}

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
		if (extra !== undefined || !rx || !rw) return `Scrivi ogni coppia come valore:peso, per esempio 6:1 8:2; "${p}" non va bene.`;
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
		if (xs.length > MAX_VALUES) return fail(`Al massimo ${MAX_VALUES} valori alla volta.`);
	} else {
		const rx = readList(values, 'i valori');
		if (typeof rx === 'string') return fail(rx);
		if (!weights.trim()) return fail('Scrivi i pesi, uno per ogni valore e nello stesso ordine, oppure le coppie valore:peso nel primo campo.');
		const rw = readList(weights, 'i pesi');
		if (typeof rw === 'string') return fail(rw);
		xs = rx;
		ws = rw;
	}
	if (xs.length !== ws.length) return fail(`Hai scritto ${xs.length} ${xs.length === 1 ? 'valore' : 'valori'} e ${ws.length} ${ws.length === 1 ? 'peso' : 'pesi'}: serve un peso per ogni valore.`);
	if (xs.length < 2) return fail('Servono almeno due valori.');
	if (ws.some((w) => w.sign() <= 0)) return fail('I pesi devono essere numeri maggiori di zero.');

	const products = xs.map((x, i) => x.mul(ws[i]));
	const P = sum(products);
	const W = sum(ws);
	const mean = P.div(W);
	const productsTex = xs.map((x, i) => `${term(x)} \\cdot ${term(ws[i])}`).join(' + ');
	return {
		ok: true,
		result: `$\\bar{x} ${eq(mean)}$`,
		copy: txt(mean),
		steps: [
			`Moltiplica ogni valore per il suo peso e somma i prodotti: $${productsTex} = ${t(P)}$.`,
			`Somma i pesi: $${sumTex(ws)} = ${t(W)}$.`,
			`Dividi la somma dei prodotti per la somma dei pesi, e non per il numero dei valori: $\\bar{x} = \\dfrac{${t(P)}}{${t(W)}} ${eq(mean)}$.`
		]
	};
}

export function medie(kind: MeanKind, values: string, weights = ''): Outcome {
	try {
		return kind === 'ponderata' ? weighted(values, weights) : simple(values);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return fail('I numeri sono troppo grandi o hanno troppi decimali per un calcolo esatto: prova con meno cifre.');
	}
}
