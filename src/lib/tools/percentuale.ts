import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
import { decimal, decimalTex, parseDecimal } from './numbers';

/**
 * The four questions students ask about percentages, each solved with the proportion of the lesson
 * (parte : totale = percentuale : 100), in exact arithmetic.
 */

export type PercentMode = 'di' | 'quale' | 'variazione' | 'sconto';

export interface PercentInput {
	mode: PercentMode;
	/** di: the percentage; quale: the part; variazione: the old value; sconto: the price. */
	a: string;
	/** di: the total; quale: the total; variazione: the new value; sconto: the percentage. */
	b: string;
	/** sconto only: take the percentage off, or add it. */
	up?: boolean;
}

const HUNDRED = q(100);
/** Four decimals at most: a periodic percentage reads 33,3333 %. */
const DIGITS = 4;
const t = (r: Rational) => decimalTex(r, DIGITS);
const pct = (r: Rational) => `${t(r)}\\%`;

export function percentuale({ mode, a, b, up = false }: PercentInput): Outcome {
	const x = parseDecimal(a);
	const y = parseDecimal(b);
	if (!x || !y) return fail('Scrivi due numeri; per i decimali puoi usare la virgola.');

	switch (mode) {
		case 'di': {
			// x% of y
			const r = x.mul(y).div(HUNDRED);
			return {
				ok: true,
				result: `$${pct(x)} \\text{ di } ${t(y)} = ${t(r)}$`,
				copy: decimal(r, DIGITS).text,
				steps: [
					`La percentuale è una frazione con denominatore 100: $${pct(x)} = \\dfrac{${t(x)}}{100}$.`,
					`Moltiplica il totale per questa frazione: $${t(y)} \\cdot \\dfrac{${t(x)}}{100} = \\dfrac{${t(y.mul(x))}}{100} = ${t(r)}$.`
				]
			};
		}
		case 'quale': {
			// x is what percent of y
			if (y.isZero()) return fail('Il totale non può essere zero.');
			const r = x.div(y).mul(HUNDRED);
			return {
				ok: true,
				result: `$${t(x)} \\text{ è il } ${pct(r)} \\text{ di } ${t(y)}$`,
				copy: `${decimal(r, DIGITS).text} %`,
				steps: [
					`Imposta la proporzione parte : totale = percentuale : 100, cioè $${t(x)} : ${t(y)} = p : 100$.`,
					`Ricava $p$: $p = \\dfrac{${t(x)} \\cdot 100}{${t(y)}} = ${t(r)}$.`,
					`Quindi $${t(x)}$ è il $${pct(r)}$ di $${t(y)}$.`
				]
			};
		}
		case 'variazione': {
			// from x to y
			if (x.isZero()) return fail('Il valore iniziale non può essere zero: una variazione percentuale si calcola rispetto a lui.');
			const diff = y.sub(x);
			const r = diff.div(x).mul(HUNDRED);
			const word = r.sign() > 0 ? 'aumento' : r.sign() < 0 ? 'diminuzione' : 'nessuna variazione';
			return {
				ok: true,
				result: r.isZero() ? '$0\\%$: nessuna variazione' : `$${r.sign() > 0 ? '+' : ''}${pct(r)}$ (${word})`,
				copy: `${r.sign() > 0 ? '+' : ''}${decimal(r, DIGITS).text} %`,
				steps: [
					`Calcola la differenza tra valore finale e iniziale: $${t(y)} - ${t(x)} = ${t(diff)}$.`,
					`Dividi per il valore iniziale e moltiplica per 100: $\\dfrac{${t(diff)}}{${t(x)}} \\cdot 100 = ${t(r)}$.`,
					r.isZero() ? 'Il valore non è cambiato.' : `Il segno dice se è un aumento o una diminuzione: qui è ${r.sign() > 0 ? 'un aumento' : 'una diminuzione'} del $${pct(r.abs())}$.`
				]
			};
		}
		case 'sconto': {
			// price x, percentage y, taken off or added
			const change = x.mul(y).div(HUNDRED);
			const r = up ? x.add(change) : x.sub(change);
			const factor = up ? HUNDRED.add(y) : HUNDRED.sub(y);
			return {
				ok: true,
				result: `$${t(r)}$`,
				copy: decimal(r, DIGITS).text,
				steps: [
					`${up ? "L'aumento" : 'Lo sconto'} è il $${pct(y)}$ di $${t(x)}$: $${t(x)} \\cdot \\dfrac{${t(y)}}{100} = ${t(change)}$.`,
					`${up ? 'Aggiungilo al' : 'Toglilo dal'} valore di partenza: $${t(x)} ${up ? '+' : '-'} ${t(change)} = ${t(r)}$.`,
					`In un passaggio solo: $${t(x)} \\cdot \\dfrac{${t(factor)}}{100} = ${t(r)}$.`
				]
			};
		}
	}
}
