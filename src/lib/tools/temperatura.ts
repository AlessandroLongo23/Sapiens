import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
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

const NAMES: Record<TempScale, string> = { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' };
/** The scale's unit in words, for a result label: "gradi Fahrenheit", "kelvin". */
const UNIT_WORDS: Record<TempScale, string> = { C: 'gradi Celsius', F: 'gradi Fahrenheit', K: 'kelvin' };

/** The line that ends a calculation: "T_F = 212", the value highlighted. */
const last = (s: TempScale, r: Rational) => `T_${s} ${eq(r)} \\hl{${num(r).tex}}`;
const conclusion = (r: Rational, s: TempScale) => `La temperatura è $${num(r).exact ? '' : '\\approx '}${tt(r, s)}$.`;

/** The steps from one scale to another, each with its formula; `first` replaces the sentence of the first step. */
function formulaSteps(x: Rational, from: TempScale, to: TempScale, first?: string): Step[] {
	const y = convertTemperature(x, from, to);
	const say = (s: string) => first ?? s;
	if (from === 'C' && to === 'F') {
		const mid = x.mul(NINE_FIFTHS);
		return [
			{ say: say('Usa la formula da Celsius a Fahrenheit.'), math: ['T_F = T_C \\cdot \\dfrac{9}{5} + 32'], then: 'Un grado Celsius vale $1{,}8$ gradi Fahrenheit, e $0\\,{}^\\circ\\text{C}$ sono $32\\,{}^\\circ\\text{F}$.' },
			{ say: `Sostituisci $T_C$ con $${num(x).tex}$.`, math: [`T_F = ${par(x)} \\cdot \\dfrac{9}{5} + 32`] },
			{ say: "Fai prima la moltiplicazione, poi l'addizione.", math: [`T_F ${eq(mid)} \\hl{${par(mid)}} + 32`, last('F', y)], then: conclusion(y, 'F') }
		];
	}
	if (from === 'F' && to === 'C') {
		const mid = x.sub(THIRTY_TWO);
		const top = mid.mul(q(5));
		return [
			{ say: say('Usa la formula da Fahrenheit a Celsius.'), math: ['T_C = (T_F - 32) \\cdot \\dfrac{5}{9}'], then: 'Prima togli 32, poi fai la moltiplicazione.' },
			{ say: `Sostituisci $T_F$ con $${num(x).tex}$.`, math: [`T_C = (${num(x).tex} - 32) \\cdot \\dfrac{5}{9}`] },
			{
				say: 'Fai prima la sottrazione nella parentesi, poi la moltiplicazione.',
				math: [`T_C ${eq(mid)} \\hl{${par(mid)}} \\cdot \\dfrac{5}{9}`, ...(!num(y).exact && top.isInteger() ? [`T_C = \\dfrac{${num(top).tex}}{9}`] : []), last('C', y)],
				then: conclusion(y, 'C')
			}
		];
	}
	if (from === 'C' && to === 'K') {
		return [
			{ say: say('Usa la formula da Celsius a Kelvin.'), math: ['T_K = T_C + 273{,}15'], then: 'I gradi delle due scale sono grandi uguali: cambia solo lo zero.' },
			{ say: `Sostituisci $T_C$ con $${num(x).tex}$ e fai la somma.`, math: [`T_K = ${num(x).tex} + 273{,}15`, last('K', y)], then: conclusion(y, 'K') }
		];
	}
	if (from === 'K' && to === 'C') {
		return [
			{ say: say('Usa la formula da Kelvin a Celsius.'), math: ['T_C = T_K - 273{,}15'], then: 'I gradi delle due scale sono grandi uguali: cambia solo lo zero.' },
			{ say: `Sostituisci $T_K$ con $${num(x).tex}$ e fai la sottrazione.`, math: [`T_C = ${num(x).tex} - 273{,}15`, last('C', y)], then: conclusion(y, 'C') }
		];
	}
	// Between Fahrenheit and Kelvin, through Celsius.
	const c = toCelsius(x, from);
	return [
		...formulaSteps(x, from, 'C', 'Passa per i gradi Celsius: usa prima la formula verso Celsius.').map((s, i) => (i === 0 ? { ...s, group: `Da ${NAMES[from]} a Celsius` } : s)),
		...formulaSteps(c, 'C', to).map((s, i) => (i === 0 ? { ...s, group: `Da Celsius a ${NAMES[to]}` } : s))
	];
}

/** The same temperature on the third scale, from its value in Celsius. */
function thirdStep(c: Rational, third: TempScale): Step {
	const z = convertTemperature(c, 'C', third);
	const say = `Trova la stessa temperatura anche in ${UNIT_WORDS[third]}.`;
	if (third === 'K') return { say, math: [`T_K ${eq(c)} ${num(c).tex} + 273{,}15`, last('K', z)] };
	if (third === 'C') return { say, math: [last('C', z)] };
	const mid = c.mul(NINE_FIFTHS);
	return { say, math: [`T_F ${eq(c)} ${par(c)} \\cdot \\dfrac{9}{5} + 32`, `T_F ${eq(mid)} ${par(mid)} + 32`, last('F', z)] };
}

export function temperatura(value: string, from: string, to: string): Outcome {
	if (!isScale(from) || !isScale(to)) return fail('Scegli le due scale di temperatura, per esempio °C e °F.');
	const x = parseDecimal(value);
	if (!x) return fail('Scrivi una temperatura, per esempio 36,5 oppure -10.');
	if (Math.abs(x.num / x.den) > 1e9) return fail('La temperatura è troppo grande: scrivi un numero più piccolo, per esempio 1000.');
	if (x.compare(ABSOLUTE_ZERO[from]) < 0) {
		return fail('Questa temperatura è sotto lo zero assoluto, che è 0 K, cioè -273,15 °C o -459,67 °F. Controlla il numero e la scala: per esempio -273 °C va bene.');
	}
	let y: Rational;
	let steps: Step[];
	const rows: ResultRow[] = [];
	const row = (r: Rational, s: TempScale) => ({ label: `${num(x).text} ${TEMP_SCALES.find((t) => t.id === from)!.text} in ${UNIT_WORDS[s]}`, value: `$${num(r).exact ? '' : '\\approx '}${tt(r, s)}$` });
	try {
		y = convertTemperature(x, from, to);
		rows.push(row(y, to));
		if (from === to) steps = [{ say: 'Le due scale sono uguali: la temperatura non cambia.', math: [`${tt(x, from)} = \\hl{${tt(y, to)}}`] }];
		else {
			steps = formulaSteps(x, from, to);
			const third = (['C', 'F', 'K'] as const).find((s) => s !== from && s !== to)!;
			const z = convertTemperature(x, from, third);
			rows.push(row(z, third));
			// Between Fahrenheit and Kelvin, Celsius is already on the way.
			if (third !== 'C') steps.push(thirdStep(toCelsius(x, from), third));
		}
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo: scrivi una temperatura più corta, per esempio 36,5.');
	}
	const unit = TEMP_SCALES.find((s) => s.id === to)!.text;
	return { ok: true, rows, copy: `${num(y).text} ${unit}`, steps };
}
