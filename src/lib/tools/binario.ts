import { fail, type Outcome } from './types';

/**
 * Whole numbers between the bases 2, 8, 10 and 16, the way the lessons do it: successive divisions by the base
 * from decimal, the sum of the digits times the powers of the base to decimal, and groups of 3 or 4 bits between
 * binary and octal or hexadecimal (8 = 2³, 16 = 2⁴). BigInt throughout, up to 2^53.
 */

export type Base = 2 | 8 | 10 | 16;

export const BASES: { id: Base; name: string }[] = [
	{ id: 2, name: 'binario' },
	{ id: 8, name: 'ottale' },
	{ id: 10, name: 'decimale' },
	{ id: 16, name: 'esadecimale' }
];

export const MAX = 2n ** 53n;

const DIGIT_ERRORS: Record<Base, string> = {
	2: 'Nella base 2 si usano solo le cifre 0 e 1.',
	8: 'Nella base 8 si usano solo le cifre da 0 a 7.',
	10: 'Scrivi un numero intero senza virgola, con le cifre da 0 a 9.',
	16: 'Nella base 16 si usano le cifre da 0 a 9 e le lettere da A a F.'
};

const PREFIX: Partial<Record<Base, RegExp>> = { 2: /^0b/i, 8: /^0o/i, 16: /^0x/i };

/** The digits of a number as written in a base, spaces and prefixes (0b, 0o, 0x) removed, or an error. */
export function parseInBase(input: string, base: Base): bigint | string {
	let s = input.trim().replace(/[\s_]+/g, '');
	if (!s) return 'Scrivi un numero intero non negativo.';
	if (s.startsWith('-')) return 'Il convertitore lavora con i numeri interi non negativi: togli il segno meno.';
	if (base === 10 && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
	s = s.replace(PREFIX[base] ?? /^$/, '');
	const valid = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/i }[base];
	if (!valid.test(s)) return DIGIT_ERRORS[base];
	if (s.replace(/^0+/, '').length > 60) return tooBig();
	let n = 0n;
	for (const c of s.toLowerCase()) n = n * BigInt(base) + BigInt(parseInt(c, 16));
	if (n > MAX) return tooBig();
	return n;
}

const tooBig = () => 'Il numero è troppo grande: al massimo 2^53, cioè 9 007 199 254 740 992.';

/** Digits in a base, uppercase: "1F". */
export const toBase = (n: bigint, base: Base) => n.toString(base).toUpperCase();

const group3 = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** A number in a base for a formula: decimals grouped by thousands, the others as they are, with the base below. */
function numTex(n: bigint, base: Base): string {
	const s = toBase(n, base);
	return `${base === 10 ? group3(s, '\\,') : `\\mathtt{${s}}`}_{${base}}`;
}

const bigTex = (n: bigint) => group3(n.toString(), '\\,');

/** Digit values of hex letters: "B = 11". */
const HEX_LETTERS = 'Nella base 16 le cifre dopo il 9 sono lettere: $\\mathtt{A} = 10$, $\\mathtt{B} = 11$, $\\mathtt{C} = 12$, $\\mathtt{D} = 13$, $\\mathtt{E} = 14$, $\\mathtt{F} = 15$.';

/** Successive divisions of n by the base: the quotients on the left, the remainders on the right. */
export function divisionSteps(n: bigint, base: Base): string[] {
	const rows: string[] = [];
	const b = BigInt(base);
	let m = n;
	while (m > 0n) {
		const r = m % b;
		const rTex = r >= 10n ? `${r} \\to \\mathtt{${toBase(r, 16)}}` : `${r}`;
		rows.push(`${bigTex(m)} & ${rTex}`);
		m /= b;
	}
	rows.push('0 &');
	const table = `\\begin{array}{r|l} ${rows.join(' \\\\ ')} \\end{array}`;
	return [
		`Dividi ${bigTex(n)} per ${base} e scrivi il resto a destra; poi dividi il quoziente per ${base}, e continua finché il quoziente è 0${base === 16 ? ' (i resti da 10 a 15 diventano le lettere da A a F)' : ''}: $$${table}$$`,
		`Leggi i resti dal basso verso l'alto: $${numTex(n, 10)} = ${numTex(n, base)}$.`
	];
}

/** The positional expansion of a number written in a base, summed to decimal. */
export function expansionSteps(n: bigint, base: Base): string[] {
	const digits = toBase(n, base);
	const len = digits.length;
	const terms = [...digits].map((d, i) => ({ d, p: len - 1 - i, v: BigInt(parseInt(d, 16)) * BigInt(base) ** BigInt(len - 1 - i) }));
	const shown = len > 16 ? terms.filter((t) => t.d !== '0') : terms;
	const values = terms.filter((t) => t.v > 0n);
	const out: string[] = [];
	if (base === 16 && /[A-F]/.test(digits)) out.push(HEX_LETTERS);
	out.push(
		`Moltiplica ogni cifra${len > 16 ? ' diversa da zero' : ''} per la potenza di ${base} del suo posto, contando i posti da destra a partire da 0: $${numTex(n, base)} = ${shown.map((t) => `${parseInt(t.d, 16)} \\cdot ${base}^{${t.p}}`).join(' + ')}$.`
	);
	if (values.length > 1 || (values.length === 1 && values[0].p > 0)) out.push(`Calcola e somma: $${values.map((t) => bigTex(t.v)).join(' + ')} = ${bigTex(n)}$.`);
	out.push(`Quindi $${numTex(n, base)} = ${numTex(n, 10)}$.`);
	return out;
}

const bits = (base: Base) => (base === 8 ? 3 : 4);

/** Binary to octal or hexadecimal by groups of 3 or 4 bits from the right. */
export function groupSteps(n: bigint, to: 8 | 16): string[] {
	const k = bits(to);
	const bin = toBase(n, 2);
	const padded = bin.padStart(Math.ceil(bin.length / k) * k, '0');
	const groups = padded.match(new RegExp(`.{${k}}`, 'g'))!;
	const table = `\\begin{array}{${'c'.repeat(groups.length)}} ${groups.map((g) => `\\mathtt{${g}}`).join(' & ')} \\\\ ${groups.map(() => '\\downarrow').join(' & ')} \\\\ ${groups.map((g) => `\\mathtt{${parseInt(g, 2).toString(16).toUpperCase()}}`).join(' & ')} \\end{array}`;
	return [
		`Poiché $${to} = 2^${k}$, ogni cifra in base ${to} corrisponde a un gruppo di ${k} cifre binarie.`,
		`Dividi le cifre binarie in gruppi di ${k} partendo da destra${padded.length > bin.length ? ', aggiungendo degli zeri a sinistra per completare l\'ultimo gruppo' : ''}, e sostituisci ogni gruppo con il suo valore: $$${table}$$`,
		`Quindi $${numTex(n, 2)} = ${numTex(n, to)}$.`
	];
}

/** Octal or hexadecimal to binary, each digit to its group of 3 or 4 bits. */
export function ungroupSteps(n: bigint, from: 8 | 16): string[] {
	const k = bits(from);
	const digits = toBase(n, from);
	const groups = [...digits].map((d) => parseInt(d, 16).toString(2).padStart(k, '0'));
	const table = `\\begin{array}{${'c'.repeat(groups.length)}} ${[...digits].map((d) => `\\mathtt{${d}}`).join(' & ')} \\\\ ${groups.map(() => '\\downarrow').join(' & ')} \\\\ ${groups.map((g) => `\\mathtt{${g}}`).join(' & ')} \\end{array}`;
	const joined = groups.join('');
	const out = [
		`Poiché $${from} = 2^${k}$, ogni cifra in base ${from} corrisponde a un gruppo di ${k} cifre binarie.`,
		`Sostituisci ogni cifra con il suo gruppo di ${k} cifre binarie, scrivendo anche gli zeri iniziali di ogni gruppo: $$${table}$$`
	];
	if (joined.startsWith('0') && n > 0n) out.push(`Togli gli zeri all'inizio: $\\mathtt{${joined}}$ diventa $\\mathtt{${toBase(n, 2)}}$.`);
	out.push(`Quindi $${numTex(n, from)} = ${numTex(n, 2)}$.`);
	return out;
}

/** The answer on one line, or as text that can wrap when the numbers are long. */
function resultLine(n: bigint, from: Base, to: Base): string {
	const a = toBase(n, from);
	const b = toBase(n, to);
	if (a.length + b.length <= 28) return `$${numTex(n, from)} = ${numTex(n, to)}$`;
	const wrap = (s: string, base: Base) => (base === 10 ? group3(s, ' ') : s.replace(/\B(?=(.{4})+$)/g, ' '));
	return `${wrap(a, from)}\${}_{${from}}$ = ${wrap(b, to)}\${}_{${to}}$`;
}

export function convertiBase(value: string, from: number, to: number): Outcome {
	const isBase = (b: number): b is Base => b === 2 || b === 8 || b === 10 || b === 16;
	if (!isBase(from) || !isBase(to)) return fail('Scegli le due basi.');
	const n = parseInBase(value, from);
	if (typeof n === 'string') return fail(n);
	let steps: string[];
	if (from === to) steps = [`Il numero è già in base ${to}: non c'è niente da convertire.`];
	else if (n === 0n) steps = ['Lo zero si scrive 0 in ogni base.'];
	else if (from === 10) steps = divisionSteps(n, to);
	else if (to === 10) steps = expansionSteps(n, from);
	else if (from === 2) steps = groupSteps(n, to as 8 | 16);
	else if (to === 2) steps = ungroupSteps(n, from as 8 | 16);
	else {
		// Octal and hexadecimal, through binary.
		const via = ungroupSteps(n, from as 8 | 16);
		const back = groupSteps(n, to as 8 | 16);
		steps = [`Le basi 8 e 16 sono tutte e due potenze di 2: passa per la base 2.`, ...via.slice(1), ...back.slice(1)];
	}
	return { ok: true, result: resultLine(n, from, to), copy: toBase(n, to), steps };
}
