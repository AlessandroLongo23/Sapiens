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
	if (!x || !y) return fail('Scrivi due numeri. Per i decimali puoi usare la virgola, per esempio 12,5.');

	switch (mode) {
		case 'di': {
			// x% of y
			const r = x.mul(y).div(HUNDRED);
			return {
				ok: true,
				rows: [{ label: `Il ${decimal(x, DIGITS).text}% di ${decimal(y, DIGITS).text}`, value: `$${t(r)}$` }],
				copy: decimal(r, DIGITS).text,
				steps: [
					{ say: 'Scrivi la percentuale come frazione con denominatore 100.', math: [`${pct(x)} = \\frac{${t(x)}}{100}`] },
					{ say: 'Moltiplica il numero per questa frazione.', math: [`${t(y)} \\cdot \\frac{${t(x)}}{100} = \\frac{${t(y.mul(x))}}{100}`, `= \\hl{${t(r)}}`] }
				]
			};
		}
		case 'quale': {
			// x is what percent of y
			if (y.isZero()) return fail('Il totale non può essere zero.');
			const r = x.div(y).mul(HUNDRED);
			return {
				ok: true,
				rows: [{ label: `${decimal(x, DIGITS).text} su ${decimal(y, DIGITS).text} è il`, value: `$${pct(r)}$` }],
				copy: `${decimal(r, DIGITS).text} %`,
				steps: [
					{ say: 'Scrivi la proporzione: parte sta a totale come percentuale sta a 100.', math: [`${t(x)} : ${t(y)} = p : 100`] },
					{ say: 'Ricava $p$: moltiplica la parte per 100 e dividi per il totale.', math: [`p = \\frac{${t(x)} \\cdot 100}{${t(y)}}`, `p = \\hl{${t(r)}}`] }
				]
			};
		}
		case 'variazione': {
			// from x to y
			if (x.isZero()) return fail('Il valore iniziale non può essere zero: la variazione percentuale si calcola rispetto a lui.');
			const diff = y.sub(x);
			const r = diff.div(x).mul(HUNDRED);
			const sign = r.sign() > 0 ? '+' : '';
			return {
				ok: true,
				rows: [{ label: r.sign() > 0 ? 'Aumento' : r.sign() < 0 ? 'Diminuzione' : 'Nessuna variazione', value: `$${sign}${pct(r)}$` }],
				copy: `${sign}${decimal(r, DIGITS).text} %`,
				steps: [
					{ say: 'Calcola la differenza: valore finale meno valore iniziale.', math: [`${t(y)} - ${t(x)} = \\hl{${t(diff)}}`] },
					{ say: 'Dividi la differenza per il valore iniziale e moltiplica per 100.', math: [`\\frac{${t(diff)}}{${t(x)}} \\cdot 100 = \\hl{${t(r)}}`] },
					{
						say: 'Guarda il segno.',
						then: r.isZero() ? 'Il valore non è cambiato.' : r.sign() > 0 ? `Il segno è più: è un aumento del ${decimal(r, DIGITS).text}%.` : `Il segno è meno: è una diminuzione del ${decimal(r.abs(), DIGITS).text}%.`
					}
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
				rows: [
					{ label: up ? "L'aumento" : 'Lo sconto', value: `$${t(change)}$` },
					{ label: up ? 'Il valore aumentato' : 'Il prezzo scontato', value: `$${t(r)}$` }
				],
				copy: decimal(r, DIGITS).text,
				steps: [
					{ say: `Calcola ${up ? "l'aumento" : 'lo sconto'}: il ${decimal(y, DIGITS).text}% di ${decimal(x, DIGITS).text}.`, math: [`${t(x)} \\cdot \\frac{${t(y)}}{100} = \\hl{${t(change)}}`] },
					{ say: `${up ? 'Aggiungilo al' : 'Toglilo dal'} valore di partenza.`, math: [`${t(x)} ${up ? '+' : '-'} ${t(change)} = \\hl{${t(r)}}`] },
					{ say: 'Oppure fai tutto in un passaggio.', math: [`${t(x)} \\cdot \\frac{${t(factor)}}{100} = ${t(r)}`] }
				]
			};
		}
	}
}
