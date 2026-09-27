import { fail, type Outcome, type Step } from './types';
import { digitsTex, digitsText, firstNonZero, isZero, parseDigits, shiftComma, type Digits } from './decimali';

/**
 * Scientific notation, both ways, the way the lessons do it: find the first digit that is not zero, move the comma
 * just after it, and make up for the move with a power of 10; back, move the comma as many places as the exponent
 * says. Digits are kept as strings, so 0,000000000000000000016 and 6,02 · 10^23 are exact.
 *
 * Zeros: those written after the comma are kept ("0,0020" is 2,0 · 10^-3, as in physics); those at the end of a
 * whole number are dropped (45 600 is 4,56 · 10^4).
 *
 * Order of magnitude: the power of 10 closest to the number, with the rule of Italian physics textbooks (Amaldi):
 * 10^n when the first factor is less than 5, 10^(n+1) when it is 5 or more.
 */

export type ScientificMode = 'a' | 'da';

const MAX_DIGITS = 30;
const MAX_EXP = 40;

const pow = (e: number) => `10^{${e}}`;
const powText = (e: number) => `10^${e}`;
const places = (n: number) => (n === 1 ? 'un posto' : `$${n}$ posti`);

/** The number as a × 10^e: the mantissa's digits, the exponent. Zeros at the end of a whole number are dropped. */
function normalise(d: Digits): { mantissa: Digits; exp: number; first: number } {
	const s = d.int + d.frac;
	const point = d.int.length;
	const first = firstNonZero(d);
	let end = s.length;
	while (end > first + 1 && s[end - 1] === '0' && end - 1 < point) end--;
	const digits = s.slice(first, end);
	return { mantissa: { neg: d.neg, int: digits[0], frac: digits.slice(1) }, exp: point - first - 1, first };
}

export const scientificTex = (m: Digits, e: number) => `${digitsTex(m)} \\cdot ${pow(e)}`;
const scientificText = (m: Digits, e: number) => `${digitsText(m)} · ${powText(e)}`;

/** The order of magnitude of a × 10^e, with 1 ≤ a < 10: 10^e below 5, 10^(e+1) from 5 up. */
export const orderOfMagnitude = (m: Digits, e: number) => (Number(m.int) >= 5 ? e + 1 : e);

function orderStep(m: Digits, e: number): Step {
	const up = Number(m.int) >= 5;
	const abs = { ...m, neg: false };
	const order = orderOfMagnitude(m, e);
	return {
		say: 'Trova l’ordine di grandezza: confronta il primo fattore con $5$.',
		math: [`${digitsTex(abs)} ${up ? '\\geq' : '<'} 5`, `\\text{ordine di grandezza} = \\hl{${pow(order)}}`],
		then: up
			? `Il primo fattore è $5$ o più: il numero è più vicino a $${pow(order)}$, e si passa alla potenza successiva.`
			: `Il primo fattore è minore di $5$: il numero è più vicino a $${pow(order)}$.`
	};
}

function toScientific(input: string): Outcome {
	if (!input.trim()) return fail('Scrivi un numero, per esempio 0,000345 oppure 384 400.');
	const d = parseDigits(input, MAX_DIGITS);
	if (!d) return fail(`Scrivi un numero con al massimo ${MAX_DIGITS} cifre, con la virgola per i decimali: per esempio 0,000345.`);
	if (isZero(d)) return fail('Lo zero non si scrive in notazione scientifica: non ha una prima cifra diversa da zero. Prova per esempio 0,000345.');
	const { mantissa, exp, first } = normalise(d);
	const number = digitsTex(d);
	const moved = Math.abs(exp);
	const dir = exp > 0 ? 'sinistra' : 'destra';
	const droppedZeros = d.frac === '' && /0$/.test(d.int) && d.int.length > 1;
	const keptZeros = /0$/.test(d.frac) && mantissa.frac.endsWith('0');
	const steps: Step[] = [
		{
			say: 'Trova la prima cifra diversa da zero.',
			math: [digitsTex(d, [first, first + 1])],
			then: 'La virgola va messa subito dopo questa cifra: così davanti resta un numero tra $1$ e $10$.'
		},
		exp === 0
			? { say: 'La virgola è già subito dopo la prima cifra.', math: [`${number} = ${digitsTex(mantissa)}`], then: 'Non devi spostarla: la potenza di $10$ sarà $10^0 = 1$.' }
			: {
					say: 'Sposta la virgola subito dopo questa cifra.',
					math: [`${number} \\to \\hl{${digitsTex(mantissa)}}`],
					then: `La virgola si sposta di ${places(moved)} verso ${dir}.${droppedZeros ? ' Gli zeri alla fine del numero non si scrivono.' : ''}${keptZeros ? ' Gli zeri scritti dopo la virgola restano: sono cifre significative.' : ''}`
				},
		{
			say: exp === 0 ? 'Scrivi il numero per la potenza $10^0$.' : 'Compensa lo spostamento con una potenza di $10$.',
			math: [`${number} = ${digitsTex(mantissa)} \\cdot \\hl{${pow(exp)}}`],
			then:
				exp > 0
					? `Spostare la virgola di ${places(moved)} a sinistra divide per $${pow(moved)}$: moltiplicare per $${pow(exp)}$ lo compensa.`
					: exp < 0
						? `Spostare la virgola di ${places(moved)} a destra moltiplica per $${pow(moved)}$: moltiplicare per $${pow(exp)}$ lo compensa.`
						: undefined
		},
		orderStep(mantissa, exp)
	];
	return {
		ok: true,
		rows: [
			{ label: 'In notazione scientifica', value: `$${scientificTex(mantissa, exp)}$` },
			{ label: d.neg ? 'Ordine di grandezza del valore assoluto' : 'Ordine di grandezza', value: `$${pow(orderOfMagnitude(mantissa, exp))}$` }
		],
		copy: scientificText(mantissa, exp),
		steps
	};
}

function fromScientific(m: string, e: string): Outcome {
	if (!m.trim() || !e.trim()) return fail('Scrivi il numero davanti e l’esponente di 10, per esempio 4,56 e 4.');
	const a = parseDigits(m, MAX_DIGITS);
	if (!a) return fail(`Scrivi il numero davanti alla potenza con al massimo ${MAX_DIGITS} cifre, per esempio 4,56.`);
	const es = e.trim().replace(/[−–]/g, '-');
	if (!/^[-+]?\d+$/.test(es) || Math.abs(Number(es)) > MAX_EXP) return fail(`L’esponente è un numero intero tra -${MAX_EXP} e ${MAX_EXP}, per esempio 4 oppure -3.`);
	const exp = Number(es);
	if (isZero(a)) return fail('Con zero davanti il numero vale zero: scrivi un numero diverso da zero, per esempio 4,56.');

	const given = scientificTex(a, exp);
	const result = shiftComma(a, exp);
	const norm = normalise(a);
	const nm = norm.mantissa;
	const ne = norm.exp + exp;
	const normalised = norm.exp === 0 && a.int.length === 1;
	const steps: Step[] = [];
	if (!normalised) {
		steps.push({
			say: 'Il primo fattore non è tra $1$ e $10$: sistemalo.',
			math: [`${digitsTex({ ...a, neg: false })} = ${digitsTex({ ...nm, neg: false })} \\cdot ${pow(norm.exp)}`, `${given} = ${digitsTex(nm)} \\cdot ${pow(norm.exp)} \\cdot ${pow(exp)}`, `= \\hl{${scientificTex(nm, ne)}}`],
			then: 'Le potenze con la stessa base si moltiplicano sommando gli esponenti.'
		});
	}
	const count = (x: Digits) => (x.int === '0' ? 0 : x.int.length) + x.frac.length;
	const added = count(result) > count(a);
	steps.push(
		exp === 0
			? { say: 'L’esponente è $0$: la potenza vale $1$.', math: [`${pow(0)} = 1`, `${given} = \\hl{${digitsTex(result)}}`] }
			: {
					say: `L’esponente è $${exp}$: sposta la virgola di ${places(Math.abs(exp))} verso ${exp > 0 ? 'destra' : 'sinistra'}.`,
					math: [`${given} = \\hl{${digitsTex(result)}}`],
					then: added ? `Dove le cifre mancano, aggiungi degli zeri.` : undefined
				}
	);
	steps.push(orderStep(nm, ne));
	const rows = [{ label: 'Come numero decimale', value: `$${digitsTex(result)}$` }];
	if (!normalised) rows.push({ label: 'In notazione scientifica corretta', value: `$${scientificTex(nm, ne)}$` });
	rows.push({ label: a.neg ? 'Ordine di grandezza del valore assoluto' : 'Ordine di grandezza', value: `$${pow(orderOfMagnitude(nm, ne))}$` });
	return { ok: true, rows, copy: digitsText(result), steps };
}

export function notazioneScientifica(mode: ScientificMode, input: { n?: string; m?: string; e?: string }): Outcome {
	return mode === 'da' ? fromScientific(input.m ?? '', input.e ?? '') : toScientific(input.n ?? '');
}
