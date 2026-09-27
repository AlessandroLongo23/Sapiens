import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal, parseDecimal } from './numbers';

/**
 * Temperatures between the Celsius, Fahrenheit and Kelvin scales, in exact arithmetic: 0 °C = 32 °F = 273,15 K,
 * and a step of 1 °C is a step of 9/5 °F and of 1 K. Nothing is colder than absolute zero.
 */

export type TempScale = 'C' | 'F' | 'K';

export const TEMP_SCALES: { id: TempScale; text: string; name: string }[] = [
	{ id: 'C', text: '°C', name: 'Celsius' },
	{ id: 'F', text: '°F', name: 'Fahrenheit' },
	{ id: 'K', text: 'K', name: 'Kelvin' }
];

const KELVIN_OFFSET = q(27315, 100);
const NINE_FIFTHS = q(9, 5);
const THIRTY_TWO = q(32);

/** Absolute zero on each scale. */
export const ABSOLUTE_ZERO: Record<TempScale, Rational> = { C: KELVIN_OFFSET.neg(), F: q(-45967, 100), K: q(0) };

const toCelsius = (x: Rational, from: TempScale): Rational => (from === 'C' ? x : from === 'K' ? x.sub(KELVIN_OFFSET) : x.sub(THIRTY_TWO).div(NINE_FIFTHS));
const fromCelsius = (c: Rational, to: TempScale): Rational => (to === 'C' ? c : to === 'K' ? c.add(KELVIN_OFFSET) : c.mul(NINE_FIFTHS).add(THIRTY_TWO));

/** The exact value of temperature x on another scale. */
export function convertTemperature(x: Rational, from: TempScale, to: TempScale): Rational {
	return fromCelsius(toCelsius(x, from), to);
}

const DIGITS = 2;
const unitTex = (s: TempScale) => (s === 'K' ? '\\text{K}' : `{}^\\circ\\text{${s}}`);
/** Exact when the decimal ends within six digits (0,18; 273,15), else rounded to hundredths (37,78). */
const num = (r: Rational) => {
	const d = decimal(r, 6);
	return d.exact ? d : decimal(r, DIGITS);
};
/** A temperature with its unit. */
const tt = (r: Rational, s: TempScale) => `${num(r).tex}\\,${unitTex(s)}`;
/** "=" or "≈" before a value, as rounding requires. */
const eq = (r: Rational) => (num(r).exact ? '=' : '\\approx');
/** A value in a formula: negative ones in brackets. */
const par = (r: Rational) => (r.sign() < 0 ? `(${num(r).tex})` : num(r).tex);

const isScale = (s: string): s is TempScale => s === 'C' || s === 'F' || s === 'K';

/** The steps from one scale to another, each with its formula. */
function formulaSteps(x: Rational, from: TempScale, to: TempScale): string[] {
	const y = convertTemperature(x, from, to);
	if (from === 'C' && to === 'F') {
		const mid = x.mul(NINE_FIFTHS);
		return [
			'Per passare da Celsius a Fahrenheit usa la formula $T_F = T_C \\cdot \\dfrac{9}{5} + 32$: un grado Celsius vale $\\dfrac{9}{5}$ di grado Fahrenheit, e lo zero Celsius corrisponde a 32 °F.',
			`Sostituisci: $T_F = ${par(x)} \\cdot \\dfrac{9}{5} + 32 ${eq(mid)} ${num(mid).tex} + 32 ${eq(y)} ${num(y).tex}$.`
		];
	}
	if (from === 'F' && to === 'C') {
		const mid = x.sub(THIRTY_TWO);
		return [
			'Per passare da Fahrenheit a Celsius usa la formula $T_C = (T_F - 32) \\cdot \\dfrac{5}{9}$: prima togli 32, poi moltiplica per $\\dfrac{5}{9}$.',
			`Sostituisci: $T_C = (${num(x).tex} - 32) \\cdot \\dfrac{5}{9} ${eq(mid)} ${par(mid)} \\cdot \\dfrac{5}{9} ${eq(y)} ${num(y).tex}$.`
		];
	}
	if (from === 'C' && to === 'K') {
		return ['Per passare da Celsius a Kelvin aggiungi 273,15: $T_K = T_C + 273{,}15$. I gradi delle due scale sono uguali, cambia solo lo zero.', `Sostituisci: $T_K = ${num(x).tex} + 273{,}15 ${eq(y)} ${num(y).tex}$.`];
	}
	if (from === 'K' && to === 'C') {
		return ['Per passare da Kelvin a Celsius togli 273,15: $T_C = T_K - 273{,}15$. I gradi delle due scale sono uguali, cambia solo lo zero.', `Sostituisci: $T_C = ${num(x).tex} - 273{,}15 ${eq(y)} ${num(y).tex}$.`];
	}
	// Between Fahrenheit and Kelvin, through Celsius.
	const c = toCelsius(x, from);
	return [`Tra Fahrenheit e Kelvin non c'è una formula da ricordare: passa per i gradi Celsius.`, ...formulaSteps(x, from, 'C'), ...formulaSteps(c, 'C', to).map((s) => s.replace('Per passare', 'Poi, per passare'))];
}

export function temperatura(value: string, from: string, to: string): Outcome {
	if (!isScale(from) || !isScale(to)) return fail('Scegli le due scale di temperatura.');
	const x = parseDecimal(value);
	if (!x) return fail('Scrivi una temperatura, per esempio 36,5 oppure -10.');
	if (Math.abs(x.num / x.den) > 1e9) return fail('La temperatura è troppo grande: scrivi un numero più piccolo.');
	if (x.compare(ABSOLUTE_ZERO[from]) < 0) {
		return fail(`Questa temperatura è sotto lo zero assoluto, che vale 0 K, cioè -273,15 °C e -459,67 °F: nessuna temperatura può essere più bassa. Controlla il numero e la scala.`);
	}
	let y: Rational;
	let steps: string[];
	try {
		y = convertTemperature(x, from, to);
		steps = from === to ? ['Le due scale sono uguali: la temperatura non cambia.'] : formulaSteps(x, from, to);
		const third = (['C', 'F', 'K'] as const).find((s) => s !== from && s !== to);
		if (third && from !== to) {
			const z = convertTemperature(x, from, third);
			steps.push(`Nella terza scala la stessa temperatura è $${tt(x, from)} ${eq(z)} ${tt(z, third)}$.`);
		}
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo.');
	}
	const unit = TEMP_SCALES.find((s) => s.id === to)!.text;
	return {
		ok: true,
		result: `$${tt(x, from)} ${eq(y)} ${tt(y, to)}$`,
		copy: `${num(y).text} ${unit}`,
		steps
	};
}
