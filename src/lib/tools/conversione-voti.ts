import { q, type Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';

/**
 * A mark from one scale to another (tenths, fifteenths, twentieths, thirtieths, hundredths) with a proportion:
 * x = v · B / A. Exact when the result has at most two decimals, else rounded to hundredths. School grids are not
 * always proportional (the old maturità grids gave the pass mark as 10/15, the proportion gives 9/15): the page says so.
 */

export const SCALES = [10, 15, 20, 30, 100] as const;
export type Scale = (typeof SCALES)[number];

export const SCALE_NAMES: Record<Scale, string> = { 10: 'decimi', 15: 'quindicesimi', 20: 'ventesimi', 30: 'trentesimi', 100: 'centesimi' };

const DIGITS = 2;
/** Exact when the decimal ends within two digits, else rounded to hundredths. */
const num = (r: Rational) => decimal(r, DIGITS);
const eq = (r: Rational) => (num(r).exact ? '=' : '\\approx');

const isScale = (n: number): n is Scale => (SCALES as readonly number[]).includes(n);

export function convertiVoto(value: string, from: number, to: number): Outcome {
	if (!isScale(from) || !isScale(to)) return fail('Scegli le due scale, per esempio decimi e quindicesimi.');
	if (!value.trim()) return fail(`Scrivi il voto in ${SCALE_NAMES[from]}, per esempio ${from === 10 ? '7' : Math.round(from * 0.7)}.`);
	const v = parseDecimal(value);
	if (!v) return fail(`Scrivi il voto come numero, con la virgola per i decimali: per esempio ${from === 10 ? '7,5' : Math.round(from * 0.7)}.`);
	if (v.sign() < 0 || v.compare(q(from)) > 0) return fail(`Un voto in ${SCALE_NAMES[from]} va da 0 a ${from}: scrivi per esempio ${Math.round(from * 0.7)}.`);
	const x = v.mul(q(to)).div(q(from));
	const vt = decimal(v, 6).tex;
	const xt = num(x);
	const product = v.mul(q(to));

	const steps: Step[] = [];
	if (from === to) {
		steps.push({ say: 'Le due scale sono uguali: il voto non cambia.', math: [`${vt} = \\hl{${xt.tex}}`] });
	} else {
		steps.push(
			{
				say: 'Scrivi la proporzione: il voto sta al massimo come x sta al nuovo massimo.',
				math: [`${vt} : ${from} = x : ${to}`]
			},
			{
				say: 'Moltiplica il voto per il nuovo massimo e dividi per il vecchio.',
				math: [`x = \\dfrac{${vt} \\cdot ${to}}{${from}}`, `x = \\dfrac{${decimal(product, 6).tex}}{${from}}`, `x ${eq(x)} \\hl{${xt.tex}}`],
				then: xt.exact ? undefined : 'Il risultato è arrotondato ai centesimi.'
			}
		);
	}
	steps.push({
		say: 'Confronta il voto nelle altre scale.',
		table: {
			head: ['Scala', 'Voto', 'Il 6 in proporzione'],
			rows: SCALES.map((s) => {
				const y = v.mul(q(s)).div(q(from));
				const cell = `$${num(y).exact ? '' : '\\approx '}${num(y).tex}$ su $${s}$`;
				const pass = num(q(6 * s, 10)).tex;
				return [SCALE_NAMES[s], s === to ? `$\\hl{${num(y).exact ? '' : '\\approx '}${num(y).tex}}$ su $${s}$` : cell, `$${pass}$`];
			})
		},
		then: 'A scuola le griglie non sono sempre proporzionali: nella maturità fino al 2018 la sufficienza negli scritti era 10 su 15, non 9. Controlla la griglia del tuo docente.'
	});
	return {
		ok: true,
		rows: [{ label: `${decimal(v, 6).text} su ${from} in ${SCALE_NAMES[to]}`, value: `$${xt.exact ? '' : '\\approx '}${xt.tex}$ su $${to}$` }],
		copy: xt.text,
		steps
	};
}
