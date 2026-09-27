import { fail, type Outcome, type Step } from './types';
import { intTex, intText } from './numbers';
import { divisionSteps, expansionSteps, groupDigits } from './binario';

/**
 * Signed whole numbers in two's complement on n bits, the way the books do it. From decimal: write the absolute value
 * in binary, fill with zeros to n bits, and for a negative number invert every bit and add 1. From binary: the first
 * bit is the sign; for a negative number invert and add 1 to find the absolute value. The check uses the weights:
 * the first bit weighs −2^(n−1), the others as in plain binary.
 */

export type Direction = 'dec' | 'bin';

export const BIT_SIZES = [8, 16, 32] as const;
const MAX_BITS = 32;

/** The smallest and largest number on n bits. */
export const range = (n: number): [number, number] => [-(2 ** (n - 1)), 2 ** (n - 1) - 1];

/** Bits in typewriter type, grouped by four from the right. */
const bitsTex = (s: string) => `\\mathtt{${groupDigits(s, 2, '\\,')}}`;
/** Bits as text, grouped by four: "1111 0010". */
const bitsText = (s: string) => groupDigits(s, 2, ' ');

const invert = (s: string) => [...s].map((c) => (c === '0' ? '1' : '0')).join('');

/** Adds 1 to a string of bits, keeping its length (the carry out of the first bit is dropped). */
function plusOne(s: string): string {
	const n = BigInt(`0b${s}`) + 1n;
	return n.toString(2).padStart(s.length, '0').slice(-s.length);
}

/** The value of n bits read in two's complement. */
export function fromBits(s: string): number {
	const unsigned = Number(BigInt(`0b${s}`));
	return s[0] === '1' ? unsigned - 2 ** s.length : unsigned;
}

/** The n bits of x in two's complement (x must be in range). */
export function toBits(x: number, n: number): string {
	const u = x < 0 ? 2 ** n + x : x;
	return u.toString(2).padStart(n, '0');
}

function rangeStep(n: number, x?: number): Step {
	const [lo, hi] = range(n);
	return {
		say: `Controlla che il numero stia nell’intervallo di ${n} bit.`,
		math: [`-2^{${n - 1}} \\le x \\le 2^{${n - 1}} - 1`, x === undefined ? `${intTex(lo)} \\le x \\le ${intTex(hi)}` : `${intTex(lo)} \\le ${intTex(x)} \\le ${intTex(hi)}`]
	};
}

function invertStep(before: string): Step {
	return {
		say: 'Inverti tutti i bit: ogni 0 diventa 1 e ogni 1 diventa 0.',
		math: [`${bitsTex(before)} \\to \\hl{${bitsTex(invert(before))}}`]
	};
}

function plusOneStep(inverted: string): Step {
	const result = plusOne(inverted);
	const trailing = /1*$/.exec(inverted)![0].length;
	return {
		say: 'Aggiungi 1, come in una somma in colonna.',
		math: [`\\begin{array}{r} ${bitsTex(inverted)} \\\\ +\\ \\mathtt{1} \\\\ \\hline \\hl{${bitsTex(result)}} \\end{array}`],
		then:
			trailing === 0
				? 'L’ultimo bit è 0: diventa 1 e non c’è riporto.'
				: trailing === inverted.length
					? 'Tutti i bit sono 1: diventano 0 e il riporto finale si scarta.'
					: trailing === 1
						? 'L’ultimo bit è 1: diventa 0 con il riporto, e il bit alla sua sinistra diventa 1.'
						: `Gli ultimi ${trailing} bit sono 1: diventano 0 con il riporto, e il primo 0 alla loro sinistra diventa 1.`
	};
}

/** The check with the weights: the first bit −2^(n−1), the rest as plain binary. */
function checkStep(bits: string): Step {
	const n = bits.length;
	const rest = bits.slice(1).replace(/^0+(?=.)/, '');
	const restValue = Number(BigInt(`0b${bits.slice(1)}`));
	const sign = -(2 ** (n - 1));
	const value = fromBits(bits);
	return {
		say: `Controlla: il primo bit vale $${intTex(sign)}$, gli altri valgono come in binario.`,
		math: [`-2^{${n - 1}} = ${intTex(sign)}`, `${bitsTex(rest)}_2 = ${intTex(restValue)}`, `${intTex(sign)} + ${intTex(restValue)} = \\hl{${intTex(value)}}`]
	};
}

function readInteger(input: string): number | string {
	const s = input.trim().replace(/−/g, '-').replace(/\s+/g, '');
	if (!s) return 'Scrivi un numero intero, per esempio -14.';
	if (!/^[+-]?\d+$/.test(s)) return 'Scrivi un numero intero senza virgola, con il segno meno se è negativo: per esempio -14.';
	if (s.replace(/^[+-]?0*/, '').length > 12) return 'Il numero è troppo grande: con 32 bit si arriva a 2 147 483 647.';
	return Number(s);
}

function readBits(input: string): string {
	return input.trim().replace(/[\s_]+/g, '').replace(/^0b/i, '');
}

/** Decimal to two's complement on n bits. */
export function decimaleACompl2(input: string, bits: number): Outcome {
	if (!(BIT_SIZES as readonly number[]).includes(bits)) return fail('Scegli il numero di bit: 8, 16 o 32.');
	const x = readInteger(input);
	if (typeof x === 'string') return fail(x);
	const [lo, hi] = range(bits);
	if (x < lo || x > hi)
		return fail(`Con ${bits} bit si scrivono solo i numeri da ${intText(lo)} a ${intText(hi)}: ${bits < 32 ? 'scegli più bit o un numero più piccolo.' : 'scegli un numero più piccolo.'}`);
	const result = toBits(x, bits);
	const abs = Math.abs(x);
	const absBits = abs.toString(2);
	const padded = absBits.padStart(bits, '0');
	const steps: Step[] = [rangeStep(bits, x)];
	if (x === 0) {
		steps.push({ say: 'Lo zero si scrive con tutti i bit uguali a 0.', math: [`0 = \\hl{${bitsTex(result)}}`] });
	} else {
		const division = divisionSteps(BigInt(abs), 2);
		if (x < 0) division[0] = { ...division[0], say: `Scrivi in binario il valore assoluto, $${intTex(abs)}$: dividi per 2 finché arrivi a 0.` };
		steps.push(...division);
		steps.push({
			say: absBits.length === bits ? `Il numero ha già ${bits} bit.` : `Aggiungi zeri a sinistra fino ad arrivare a ${bits} bit.`,
			math: absBits.length === bits ? [bitsTex(padded)] : [`${bitsTex(absBits)} \\to ${x > 0 ? `\\hl{${bitsTex(padded)}}` : bitsTex(padded)}`],
			then: x > 0 ? 'Il primo bit è 0: il numero è positivo, e hai finito.' : undefined
		});
	}
	if (x < 0) {
		const inverted = invert(padded);
		steps.push(invertStep(padded), plusOneStep(inverted), checkStep(result));
		steps[0] = { ...steps[0], group: 'L’intervallo' };
		steps[1] = { ...steps[1], group: 'Il valore assoluto in binario' };
		const inv = steps.length - 3;
		steps[inv] = { ...steps[inv], group: 'Inverti i bit e aggiungi 1' };
		steps[steps.length - 1] = { ...steps[steps.length - 1], group: 'La verifica' };
		if (x === lo) steps[steps.length - 2] = { ...steps[steps.length - 2], then: `È il numero più piccolo con ${bits} bit: non ha un opposto positivo con ${bits} bit.` };
	}
	return {
		ok: true,
		rows: [
			{ label: `${intText(x)} in complemento a due su ${bits} bit`, value: `$${bitsTex(result)}$` },
			{ label: `Numeri che si scrivono con ${bits} bit`, value: `da $${intTex(lo)}$ a $${intTex(hi)}$` }
		],
		copy: result,
		steps
	};
}

/** Two's complement bits (all of them, their count is n) to decimal. */
export function compl2ADecimale(input: string): Outcome {
	const bits = readBits(input);
	if (!bits) return fail('Scrivi i bit del numero, per esempio 1111 0010.');
	if (!/^[01]+$/.test(bits)) return fail('Nel complemento a due si usano solo le cifre 0 e 1: scrivi per esempio 1111 0010.');
	if (bits.length < 2) return fail('Servono almeno 2 bit: il primo è il segno. Scrivi per esempio 1111 0010.');
	if (bits.length > MAX_BITS) return fail(`Al massimo ${MAX_BITS} bit: questo numero ne ha ${bits.length}.`);
	const n = bits.length;
	const value = fromBits(bits);
	const [lo, hi] = range(n);
	const steps: Step[] = [];
	if (bits[0] === '0') {
		steps.push({ say: 'Guarda il primo bit a sinistra.', math: [bitsTex(bits), `\\text{primo bit} = \\hl{\\mathtt{0}}`], then: 'È 0: il numero è positivo, e si legge come in binario.' });
		if (value === 0) steps.push({ say: 'Tutti i bit sono 0: il numero è zero.', math: [`${bitsTex(bits)} = \\hl{0}`] });
		else steps.push(...expansionSteps(BigInt(value), 2));
	} else {
		const inverted = invert(bits);
		const abs = -value;
		const absBits = plusOne(inverted);
		steps.push({ say: 'Guarda il primo bit a sinistra.', math: [bitsTex(bits), `\\text{primo bit} = \\hl{\\mathtt{1}}`], then: 'È 1: il numero è negativo.' });
		steps.push(invertStep(bits), plusOneStep(inverted));
		const expansion = expansionSteps(BigInt(abs), 2);
		expansion[0] = { ...expansion[0], say: 'Leggi il risultato come in binario: è il valore assoluto.' };
		steps.push(...expansion);
		steps.push({ say: 'Metti il segno meno davanti al valore assoluto.', math: [`${bitsTex(bits)} = \\hl{${intTex(value)}}`], then: absBits === bits ? `È il numero più piccolo con ${n} bit.` : undefined });
		steps.push(checkStep(bits));
		steps[0] = { ...steps[0], group: 'Il segno' };
		steps[1] = { ...steps[1], group: 'Inverti i bit e aggiungi 1' };
		steps[3] = { ...steps[3], group: 'Il valore assoluto' };
		steps[steps.length - 1] = { ...steps[steps.length - 1], group: 'La verifica' };
	}
	return {
		ok: true,
		rows: [
			{ label: `${bitsText(bits)} in complemento a due, in decimale`, value: `$${intTex(value)}$` },
			{ label: `Numeri che si scrivono con ${n} bit`, value: `da $${intTex(lo)}$ a $${intTex(hi)}$` }
		],
		copy: intText(value).replace(/\s/g, ''),
		steps
	};
}

export function complementoADue(input: string, direction: string, bits: number): Outcome {
	return direction === 'bin' ? compl2ADecimale(input) : decimaleACompl2(input, bits);
}
