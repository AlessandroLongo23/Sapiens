import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal, intTex, intText, parseDecimal } from './numbers';

/**
 * Powers with an integer exponent of an integer, decimal or fractional base, in exact arithmetic: a negative
 * exponent is the power of the reciprocal, a zero exponent gives 1, and 0^0 and 0 to a negative exponent have no
 * meaning. Results stay within safe integers, or the tool says the numbers are too large.
 */

/** A number as the student wrote it: the value, and how to show it back. */
export interface Written {
	value: Rational;
	kind: 'int' | 'dec' | 'frac';
	/** For a fraction, numerator and denominator as written (4/6 stays 4/6 until the steps simplify it). */
	num?: number;
	den?: number;
}

/**
 * "3", "-2", "1,5", "2/3", "-4/6", "(−2/3)" → the number, or a string saying what is wrong. Fractions need whole
 * numbers above and below the line.
 */
export function parseNumber(input: string): Written | string | null {
	let s = input.trim().replace(/\s+/g, '').replace(/[−–]/g, '-');
	while (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1);
	// "-(2/3)": the minus in front of the brackets.
	const outside = /^-\((.*)\)$/.exec(s);
	if (outside && !outside[1].startsWith('-')) s = `-${outside[1]}`;
	if (!s) return null;
	if (s.includes('/')) {
		const parts = s.split('/');
		if (parts.length !== 2) return null;
		let [a, b] = parts;
		let sign = 1;
		// "(-2)/3" and "2/(-3)".
		a = a.replace(/^\((.*)\)$/, '$1');
		b = b.replace(/^\((.*)\)$/, '$1');
		const top = parseDecimal(a);
		const bottom = parseDecimal(b);
		if (!top || !bottom || !top.isInteger() || !bottom.isInteger()) return 'In una frazione scrivi due numeri interi, come 2/3.';
		if (bottom.isZero()) return 'Il denominatore di una frazione non può essere zero.';
		if (bottom.num < 0) sign = -1;
		const num = sign * top.num;
		const den = Math.abs(bottom.num);
		return { value: q(num, den), kind: 'frac', num, den };
	}
	const value = parseDecimal(s);
	if (!value) return null;
	return { value, kind: value.isInteger() ? 'int' : 'dec' };
}

/** A number in a formula: integers with thin spaces, terminating decimals with a comma, else a fraction. */
export function numTex(r: Rational, digits = 6): string {
	if (r.isInteger()) return intTex(r.num);
	const d = decimal(r, digits);
	if (d.exact) return d.tex;
	return r.toLatex().replace('\\frac', '\\dfrac');
}

const fracTex = (num: number, den: number) => `${num < 0 ? '-' : ''}\\dfrac{${intTex(Math.abs(num))}}{${intTex(den)}}`;

/** The base as written, in brackets when it is negative or not a whole number. */
function baseTex(w: Written): string {
	if (w.kind === 'frac') return `\\left(${fracTex(w.num!, w.den!)}\\right)`;
	const t = numTex(w.value);
	return w.value.sign() < 0 || w.kind === 'dec' ? `(${t})` : t;
}

/** A rational base in brackets for a power: 2, (-2), (2/3). */
function ratBase(r: Rational): string {
	if (r.isInteger()) return r.num < 0 ? `(${intTex(r.num)})` : intTex(r.num);
	return `\\left(${fracTex(r.num, r.den)}\\right)`;
}

const expTex = (e: number) => (e >= 0 && e < 10 ? `^${e}` : `^{${e}}`);

/** The value of a result: "8", "\dfrac{9}{4} = 2{,}25", "\dfrac{1}{3} \approx 0{,}333333". */
function valueTex(r: Rational): string {
	if (r.isInteger()) return intTex(r.num);
	const d = decimal(r, 6);
	// A value too small for six decimals stays a fraction: "≈ 0" would say nothing.
	if (!d.exact && /^-?0$/.test(d.text)) return fracTex(r.num, r.den);
	return `${fracTex(r.num, r.den)} ${d.exact ? '=' : '\\approx'} ${d.tex}`;
}

const MAX_EXP = 1000;

/** b^e for a whole e >= 0, or null when a numerator or denominator leaves the safe integers. */
function power(b: Rational, e: number): Rational | null {
	if (b.isZero()) return e === 0 ? q(1) : q(0);
	if (b.num === 1 && b.den === 1) return q(1);
	if (b.num === -1 && b.den === 1) return q(e % 2 ? -1 : 1);
	let r = q(1);
	for (let i = 0; i < e; i++) {
		const num = r.num * b.num;
		const den = r.den * b.den;
		if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) return null;
		r = q(num, den);
	}
	return r;
}

export function potenza(baseInput: string, expInput: string): Outcome {
	if (!baseInput.trim() || !expInput.trim()) return fail('Scrivi la base e l\'esponente, per esempio 2 e 5.');
	const w = parseNumber(baseInput);
	if (typeof w === 'string') return fail(w);
	if (!w) return fail('Scrivi la base come numero intero, decimale (con la virgola) o frazione, per esempio 3, 1,5 o 2/3.');
	const eR = parseDecimal(expInput.replace(/[−–]/g, '-').replace(/[()]/g, ''));
	if (!eR || !eR.isInteger()) return fail("L'esponente deve essere un numero intero, anche negativo o zero: per esempio 3, 0 o -2.");
	const e = eR.num;
	if (Math.abs(e) > MAX_EXP) return fail(`Usa un esponente tra -${MAX_EXP} e ${MAX_EXP}.`);

	const b = w.value;
	if (b.isZero() && e === 0) return fail('0 elevato a 0 non ha significato: la regola "ogni numero elevato a zero dà 1" vale solo per una base diversa da zero, perché nasce da una divisione per la base stessa.');
	if (b.isZero() && e < 0) return fail('0 elevato a un esponente negativo non ha significato: vorrebbe dire fare il reciproco di 0, cioè dividere 1 per 0, e per zero non si divide.');

	const left = `${baseTex(w)}${expTex(e)}`;
	const steps: string[] = [];

	// The base as a reduced fraction.
	if (w.kind === 'dec') steps.push(`Scrivi il numero decimale come frazione: $${numTex(b)} = ${fracTex(b.num, b.den)}$.`);
	if (w.kind === 'frac' && (w.num !== b.num || w.den !== b.den)) steps.push(`Semplifica la frazione della base: $${fracTex(w.num!, w.den!)} = ${b.isInteger() ? intTex(b.num) : fracTex(b.num, b.den)}$.`);

	if (e === 0) {
		steps.push(`Ogni numero diverso da zero elevato a zero dà 1: $a^0 = 1$. Il motivo: $a^n : a^n = a^{n-n} = a^0$, e un numero diviso per sé stesso fa 1.`);
		return { ok: true, result: `$${left} = 1$`, copy: '1', steps };
	}

	let base = b;
	let n = e;
	if (e < 0) {
		base = q(1).div(b);
		n = -e;
		const tex = (x: Rational) => (x.isInteger() ? intTex(x.num) : fracTex(x.num, x.den));
		steps.push(`L'esponente è negativo: fai il reciproco della base e cambia segno all'esponente, $a^{-n} = \\left(\\dfrac{1}{a}\\right)^n$. Il reciproco di $${tex(b)}$ è $${tex(base)}$, quindi $${left} = ${ratBase(base)}${expTex(n)}$.`);
	}

	const r = power(base, n);
	if (!r) return fail('Il risultato è troppo grande per scriverlo per intero: prova con una base o un esponente più piccoli.');

	const bt = ratBase(base);
	if (base.sign() < 0 && n > 1) {
		steps.push(n % 2 === 0 ? "La base è negativa e l'esponente è pari: il risultato è positivo, perché i segni meno si accoppiano." : "La base è negativa e l'esponente è dispari: il risultato è negativo, perché resta un segno meno spaiato.");
		if (n % 2 === 0 && w.kind === 'int') steps.push(`Attento alle parentesi: $(${intTex(b.num)})${expTex(e)}$ è diverso da $${intTex(b.num)}${expTex(e)}$, dove l'esponente riguarda solo $${intTex(-b.num)}$ e il meno resta davanti.`);
	}
	if (n === 1) {
		steps.push(`Un numero elevato a 1 è il numero stesso: $${bt}^1 = ${valueTex(r)}$.`);
	} else if (base.isInteger()) {
		const product = n <= 6 ? `${Array(n).fill(bt).join(' \\cdot ')} = ` : '';
		steps.push(`Moltiplica la base per sé stessa ${n} volte: $${bt}${expTex(n)} = ${product}${intTex(r.num)}$.`);
	} else {
		const sign = r.sign() < 0 ? '-' : '';
		const top = intTex(Math.abs(base.num));
		const bottom = intTex(base.den);
		steps.push(`Eleva all'esponente ${n} sia il numeratore sia il denominatore: $${bt}${expTex(n)} = ${sign}\\dfrac{${top}${expTex(n)}}{${bottom}${expTex(n)}} = ${fracTex(r.num, r.den)}$.`);
	}
	if (!r.isInteger() && valueTex(r) !== fracTex(r.num, r.den)) {
		const d = decimal(r, 6);
		steps.push(`Se ti serve il numero decimale, dividi il numeratore per il denominatore: $${fracTex(r.num, r.den)} ${d.exact ? '=' : '\\approx'} ${d.tex}$.`);
	}

	const d = decimal(r, 6);
	const copy = r.isInteger() ? intText(r.num) : w.kind === 'dec' && d.exact ? d.text : `${r.num}/${r.den}`;
	return { ok: true, result: `$${left} = ${valueTex(r)}$`, copy, steps };
}
