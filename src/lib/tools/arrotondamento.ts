import { fail, type Outcome, type Step } from './types';
import { digitsTex, digitsText, firstNonZero, fromString, isZero, parseDigits, type Digits } from './decimali';
import { scientificTex } from './notazione-scientifica';

/**
 * Rounding the way Italian textbooks teach it: find the last digit to keep, look at the digit right after it (the
 * one that decides), and if it is 5 or more add 1 to the digit kept, otherwise leave it; then drop the digits after
 * it, or write zeros in their place before the comma. Negative numbers are rounded by their absolute value
 * (-2,35 → -2,4), as in the textbooks. Two ways of choosing the last digit: a place (tens, hundredths…) or a number
 * of significant figures. Digits as strings, so nothing is lost to floating point.
 */

export type RoundMode = 'posto' | 'cifre';

const MAX_DIGITS = 30;
export const MIN_PLACE = -6;
export const MAX_PLACE = 6;
export const MAX_FIGURES = 20;

/** A place, by the number of decimals it keeps (negative: tens, hundreds…): its name in the forms the sentences need. */
interface Place {
	/** "la cifra dei centesimi" */
	of: string;
	/** "arrotondato ai centesimi" */
	to: string;
	/** "dopo i centesimi" */
	the: string;
}

const place = (art: 'i' | 'le', name: string): Place =>
	art === 'i' ? { of: `dei ${name}`, to: `ai ${name}`, the: `i ${name}` } : { of: `delle ${name}`, to: `alle ${name}`, the: `le ${name}` };

export const PLACES: Record<number, Place> = {
	[-6]: place('i', 'milioni'),
	[-5]: place('le', 'centinaia di migliaia'),
	[-4]: place('le', 'decine di migliaia'),
	[-3]: place('le', 'migliaia'),
	[-2]: place('le', 'centinaia'),
	[-1]: place('le', 'decine'),
	0: { of: 'delle unità', to: 'all’unità', the: 'le unità' },
	1: place('i', 'decimi'),
	2: place('i', 'centesimi'),
	3: place('i', 'millesimi'),
	4: place('i', 'decimillesimi'),
	5: place('i', 'centomillesimi'),
	6: place('i', 'milionesimi')
};

interface Rounded {
	result: Digits;
	/** The number with zeros added where the kept or deciding digit was missing: 567 → 0567 for the thousands. */
	shown: Digits;
	kept: number;
	decisive: number;
	up: boolean;
	carry: boolean;
	/** The digits after the kept one were all zero or missing: nothing changes. */
	exact: boolean;
	/** No digit was typed after the kept one. */
	nothingAfter: boolean;
	padLeft: boolean;
	/** The kept digits after rounding, as a whole number: "46" for 0,0046. */
	keptDigits: string;
}

/** Round `d` keeping `p` decimals (p < 0: to tens, hundreds…). */
export function roundAt(d: Digits, p: number): Rounded {
	let s = d.int + d.frac;
	let point = d.int.length;
	const typed = s.length;
	const padL = Math.max(0, 1 - (point + p));
	s = '0'.repeat(padL) + s;
	point += padL;
	const padR = Math.max(0, point + p + 1 - s.length);
	s += '0'.repeat(padR);
	const kept = point + p - 1;
	const decisive = point + p;
	const up = s[decisive] >= '5';
	const keptDigits = (BigInt(s.slice(0, decisive)) + (up ? 1n : 0n)).toString();
	let result: Digits;
	if (p >= 0) {
		const ks = keptDigits.padStart(p + 1, '0');
		result = fromString(d.neg, ks, ks.length - p);
	} else {
		const ks = keptDigits + '0'.repeat(-p);
		result = fromString(d.neg, ks, ks.length);
	}
	return {
		result,
		shown: { neg: d.neg, int: s.slice(0, point), frac: s.slice(point) },
		kept,
		decisive,
		up,
		carry: up && s[kept] === '9',
		exact: /^0*$/.test(s.slice(decisive)),
		nothingAfter: decisive - padL >= typed,
		padLeft: padL > 0,
		keptDigits
	};
}

/** The steps from the digit that decides to the result. */
function roundSteps(d: Digits, r: Rounded, pl: Place | undefined, p: number): Step[] {
	const digit = r.shown.int + r.shown.frac;
	const dec = digit[r.decisive];
	const of = pl ? `la cifra ${pl.of}` : 'l’ultima cifra che tieni';
	const cut: Step =
		p > 0
			? { say: `Togli tutte le cifre dopo ${pl ? pl.the : 'quella'}.`, math: [] }
			: p === 0
				? { say: 'Togli la virgola e tutte le cifre decimali.', math: [] }
				: { say: `Scrivi zeri al posto delle cifre dopo ${pl ? pl.the : 'quella'}${d.frac ? ' e togli i decimali' : ''}.`, math: [] };
	cut.math = [`${digitsTex(d)} ${r.exact ? '=' : '\\approx'} \\hl{${digitsTex(r.result)}}`];
	if (r.carry) cut.then = '$9$ più $1$ fa $10$: scrivi $0$ e aggiungi $1$ alla cifra a sinistra.';
	return [
		{
			say: 'Guarda la cifra subito dopo: è quella che decide.',
			math: [digitsTex(r.shown, [r.decisive, r.decisive + 1])],
			then: r.up
				? `${dec === '5' ? 'È proprio $5$' : `È $${dec}$, più di $5$`}: arrotonda per eccesso, aumenta di $1$ ${of}.`
				: `È $${dec}$, meno di $5$: arrotonda per difetto, ${of} resta $${digit[r.kept]}$.`
		},
		cut
	];
}

function read(n: string): Digits | string {
	if (!n.trim()) return 'Scrivi un numero, per esempio 12,3456.';
	const d = parseDigits(n, MAX_DIGITS);
	if (!d) return `Scrivi un numero con al massimo ${MAX_DIGITS} cifre, con la virgola per i decimali: per esempio 12,3456.`;
	return d;
}

export function arrotondaPosto(n: string, placeInput: string): Outcome {
	const d = read(n);
	if (typeof d === 'string') return fail(d);
	const p = Number(placeInput);
	if (!Number.isInteger(p) || p < MIN_PLACE || p > MAX_PLACE) return fail('Scegli a che cifra arrotondare, per esempio ai centesimi.');
	const pl = PLACES[p];
	const r = roundAt(d, p);
	const label = `${digitsText(d)} arrotondato ${pl.to}`;
	const rows = [{ label, value: `$${digitsTex(r.result)}$` }];
	if (r.nothingAfter)
		return {
			ok: true,
			rows,
			copy: digitsText(r.result),
			steps: [
				{
					say: `Il numero non ha cifre dopo ${pl.the}: non c’è niente da arrotondare.`,
					math: [`${digitsTex(d)} = \\hl{${digitsTex(r.result)}}`],
					then: r.result.frac.length > d.frac.length ? `Aggiungi zeri fino ${pl.to}, se ti serve quel numero di decimali.` : undefined
				}
			]
		};
	const steps: Step[] = [
		{
			say: `Trova la cifra ${pl.of}: è l’ultima che tieni.`,
			math: [digitsTex(r.shown, [r.kept, r.kept + 1])],
			then: r.padLeft ? `Il numero non arriva ${pl.to}: la cifra ${pl.of} è $0$.` : undefined
		},
		...roundSteps(d, r, pl, p)
	];
	return { ok: true, rows, copy: digitsText(r.result), steps };
}

export function arrotondaCifre(n: string, figures: string): Outcome {
	const d = read(n);
	if (typeof d === 'string') return fail(d);
	const k = Number(figures.trim());
	if (!Number.isInteger(k) || k < 1 || k > MAX_FIGURES) return fail(`Scrivi quante cifre significative tenere: un numero intero da 1 a ${MAX_FIGURES}, per esempio 3.`);
	if (isZero(d)) return fail('Lo zero non ha cifre significative. Scrivi un numero diverso da zero, per esempio 0,004567.');
	const first = firstNonZero(d);
	const p = first + k - d.int.length;
	const pl = PLACES[p];
	const r = roundAt(d, p);
	// The kept digits as a × 10^e with k digits (a carry can add a zero at the end: 999 → 1,0 · 10^3).
	const ks = r.keptDigits.padEnd(k, '0').slice(0, k);
	const exp = r.keptDigits.length - 1 - p;
	const mantissa: Digits = { neg: d.neg, int: ks[0], frac: ks.slice(1) };
	const figuresText = k === 1 ? 'una cifra significativa' : `${k} cifre significative`;
	const rows = [
		{ label: `${digitsText(d)} con ${figuresText}`, value: `$${digitsTex(r.result)}$` },
		{ label: 'In notazione scientifica', value: `$${scientificTex(mantissa, exp)}$` }
	];
	const firstStep: Step = {
		say: 'Trova la prima cifra diversa da zero: è la prima cifra significativa.',
		math: [digitsTex(d, [first, first + 1])],
		then: first > 0 ? 'Gli zeri all’inizio non sono cifre significative: servono solo a mettere la virgola.' : undefined
	};
	if (r.nothingAfter)
		return {
			ok: true,
			rows,
			copy: digitsText(r.result),
			steps: [
				firstStep,
				{
					say: `Il numero non ha più di ${k === 1 ? 'una cifra significativa' : `$${k}$ cifre significative`}: non c’è niente da arrotondare.`,
					math: [`${digitsTex(d)} = \\hl{${digitsTex(r.result)}}`],
					then: r.result.frac.length > d.frac.length ? 'Gli zeri aggiunti dopo la virgola portano il numero di cifre significative a quello chiesto.' : undefined
				}
			]
		};
	const steps: Step[] = [
		firstStep,
		{
			say: `Conta $${k}$ cifre da lì: sono quelle che tieni.`,
			math: [digitsTex(r.shown, [first, first + k])],
			then: pl ? `L’ultima è la cifra ${pl.of}.` : undefined
		},
		...roundSteps(d, r, pl, p)
	];
	const last = steps[steps.length - 1];
	if (p < 0) last.then = `${last.then ? `${last.then} ` : ''}Gli zeri prima della virgola non sono significativi: la notazione scientifica lo chiarisce.`;
	return { ok: true, rows, copy: digitsText(r.result), steps };
}

export function arrotondamento(mode: RoundMode, input: { n: string; p?: string; k?: string }): Outcome {
	return mode === 'cifre' ? arrotondaCifre(input.n, input.k ?? '') : arrotondaPosto(input.n, input.p ?? '');
}
