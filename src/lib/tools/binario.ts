import { fail, type Outcome, type Step } from './types';

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
	2: 'Nella base 2 si usano solo le cifre 0 e 1: scrivi per esempio 101101.',
	8: 'Nella base 8 si usano solo le cifre da 0 a 7: scrivi per esempio 755.',
	10: 'Scrivi un numero intero senza virgola, con le cifre da 0 a 9: per esempio 156.',
	16: 'Nella base 16 si usano le cifre da 0 a 9 e le lettere da A a F: scrivi per esempio 1F4.'
};

const EXAMPLE: Record<Base, string> = { 2: '101101', 8: '755', 10: '156', 16: '1F4' };

const PREFIX: Partial<Record<Base, RegExp>> = { 2: /^0b/i, 8: /^0o/i, 16: /^0x/i };

/** The digits of a number as written in a base, spaces and prefixes (0b, 0o, 0x) removed, or an error. */
export function parseInBase(input: string, base: Base): bigint | string {
	let s = input.trim().replace(/[\s_]+/g, '');
	if (!s) return `Scrivi un numero intero, per esempio ${EXAMPLE[base]}.`;
	if (s.startsWith('-')) return `Il convertitore lavora con i numeri interi senza segno: togli il segno meno, per esempio ${EXAMPLE[base]}.`;
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

const tooBig = () => 'Il numero è troppo grande: scrivi un numero fino a 2^53, cioè 9 007 199 254 740 992.';

/** Digits in a base, uppercase: "1F". */
export const toBase = (n: bigint, base: Base) => n.toString(base).toUpperCase();

const group3 = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/**
 * Digits grouped so a long number can be read: decimals by thousands, binary and hexadecimal by four from the right
 * (a group of four bits is one hexadecimal digit), octal by three.
 */
export function groupDigits(s: string, base: Base, sep: string): string {
	if (base === 10) return group3(s, sep);
	const k = base === 8 ? 3 : 4;
	if (s.length <= k + 1) return s;
	return s.replace(new RegExp(`\\B(?=(.{${k}})+$)`, 'g'), sep);
}

/** A number in a base for a formula: digits grouped, in typewriter type for bases other than 10, the base below. */
function numTex(n: bigint, base: Base, hl = false): string {
	const s = groupDigits(toBase(n, base), base, '\\,');
	const body = base === 10 ? s : `\\mathtt{${s}}`;
	return `${hl ? `\\hl{${body}}` : body}_{${base}}`;
}

/** Digits as written, in typewriter type: "\mathtt{0101}". */
const tt = (s: string) => `\\mathtt{${s}}`;
const bigTex = (n: bigint) => group3(n.toString(), '\\,');

/** The hexadecimal letters and their values, as a table. */
const HEX_LETTERS: Step = {
	say: 'Ricorda che in base 16 le lettere sono cifre.',
	table: { head: ['Cifra', ...'ABCDEF'.split('').map((c) => `$${tt(c)}$`)], rows: [['Valore', ...[10, 11, 12, 13, 14, 15].map((v) => `$${v}$`)]] }
};

/** Successive divisions of n by the base, in a table; the remainders, read from the bottom, are the digits. */
export function divisionSteps(n: bigint, base: Base): Step[] {
	const rows: string[][] = [];
	const b = BigInt(base);
	let m = n;
	while (m > 0n) {
		const r = m % b;
		const rTex = r >= 10n ? `${r} = \\hl{${tt(toBase(r, 16))}}` : `\\hl{${r}}`;
		rows.push([`$${bigTex(m)}$`, `$${bigTex(m / b)}$`, `$${rTex}$`]);
		m /= b;
	}
	return [
		{
			say: `Dividi il numero per ${base}, poi dividi ogni quoziente per ${base}, finché arrivi a 0.`,
			table: { head: ['Numero', `Diviso per ${base}`, 'Resto'], rows },
			then: base === 16 ? 'I resti da 10 a 15 si scrivono con le lettere da A a F.' : undefined
		},
		{ say: "Leggi i resti dal basso verso l'alto.", math: [`${numTex(n, 10)} = ${numTex(n, base, true)}`] }
	];
}

/** A sum of many terms on several lines, four terms each, every line carrying its running total. */
function sumLines(values: bigint[]): string[] {
	if (values.length <= 5) return [`${values.map(bigTex).join(' + ')} = \\hl{${bigTex(values.reduce((a, b) => a + b, 0n))}}`];
	const lines: string[] = [];
	let total = 0n;
	for (let i = 0; i < values.length; i += 4) {
		const chunk = values.slice(i, i + 4);
		const next = chunk.reduce((a, b) => a + b, total);
		const terms = [...(i ? [bigTex(total)] : []), ...chunk.map(bigTex)].join(' + ');
		lines.push(`${terms} = ${i + 4 >= values.length ? `\\hl{${bigTex(next)}}` : bigTex(next)}`);
		total = next;
	}
	return lines;
}

/** The positional expansion of a number written in a base: a table of digits and powers, then the sum. */
export function expansionSteps(n: bigint, base: Base): Step[] {
	const digits = toBase(n, base);
	const len = digits.length;
	const terms = [...digits].map((d, i) => {
		const p = len - 1 - i;
		const power = BigInt(base) ** BigInt(p);
		return { d, p, power, v: BigInt(parseInt(d, 16)) * power };
	});
	// On a long number the zeros add nothing: the table keeps the digits that count.
	const shown = len > 16 ? terms.filter((t) => t.d !== '0') : terms;
	const out: Step[] = [];
	if (base === 16 && /[A-F]/.test(digits)) out.push(HEX_LETTERS);
	const digitCell = (d: string) => (/[A-F]/.test(d) ? `$${tt(d)} = ${parseInt(d, 16)}$` : `$${tt(d)}$`);
	out.push({
		say: `Numera i posti da destra, partendo da 0: ogni posto è una potenza di ${base}.`,
		table: {
			head: ['Cifra', `Potenza di ${base}`, 'Valore'],
			rows: shown.map((t) => [digitCell(t.d), `$${base}^{${t.p}} = ${bigTex(t.power)}$`, `$${parseInt(t.d, 16)} \\cdot ${bigTex(t.power)} = \\hl{${bigTex(t.v)}}$`])
		},
		then: len > 16 ? 'Le cifre uguali a 0 valgono 0: la tabella le salta.' : undefined
	});
	const values = terms.filter((t) => t.v > 0n).map((t) => t.v);
	out.push({
		say: 'Somma i valori.',
		math: [...(values.length > 1 ? sumLines(values) : []), `${numTex(n, base)} = ${numTex(n, 10, true)}`]
	});
	return out;
}

const bits = (base: Base) => (base === 8 ? 3 : 4);

/** Why groups of bits work: 8 = 2³, 16 = 2⁴. */
const groupsReason = (base: 8 | 16): Step => ({
	say: `Ricorda che una cifra in base ${base} vale un gruppo di ${bits(base)} cifre binarie.`,
	math: [`${base} = 2^${bits(base)}`]
});

/** The rows of a table that turns groups of bits into digits, or back: the value in base 10 in the middle for base 16. */
function groupTable(groups: string[], base: 8 | 16, fromBinary: boolean): string[][] {
	const digit = (g: string) => parseInt(g, 2).toString(16).toUpperCase();
	const groupRow = ['Gruppo', ...groups.map((g) => `$${fromBinary ? tt(g) : `\\hl{${tt(g)}}`}$`)];
	const digitRow = ['Cifra', ...groups.map((g) => `$${fromBinary ? `\\hl{${tt(digit(g))}}` : tt(digit(g))}$`)];
	const valueRow = base === 16 && groups.some((g) => parseInt(g, 2) >= 10) ? [['Valore', ...groups.map((g) => `$${parseInt(g, 2)}$`)]] : [];
	return fromBinary ? [groupRow, ...valueRow, digitRow] : [digitRow, ...valueRow, groupRow];
}

/** Binary to octal or hexadecimal by groups of 3 or 4 bits from the right. */
export function groupSteps(n: bigint, to: 8 | 16, reason = true): Step[] {
	const k = bits(to);
	const bin = toBase(n, 2);
	const padded = bin.padStart(Math.ceil(bin.length / k) * k, '0');
	const groups = padded.match(new RegExp(`.{${k}}`, 'g'))!;
	return [
		...(reason ? [groupsReason(to)] : []),
		{
			say: `Dividi le cifre binarie in gruppi di ${k}, partendo da destra.`,
			table: { rows: [['Gruppo', ...groups.map((g) => `$${tt(g)}$`)]] },
			then: padded.length > bin.length ? 'Al primo gruppo a sinistra mancavano cifre: gli zeri davanti lo completano.' : undefined
		},
		{
			say: `Sostituisci ogni gruppo con la sua cifra in base ${to}.`,
			table: { rows: groupTable(groups, to, true) }
		},
		{ say: "Scrivi le cifre una dopo l'altra, nello stesso ordine.", math: [`${numTex(n, 2)} = ${numTex(n, to, true)}`] }
	];
}

/** Octal or hexadecimal to binary, each digit to its group of 3 or 4 bits. */
export function ungroupSteps(n: bigint, from: 8 | 16, reason = true): Step[] {
	const k = bits(from);
	const digits = toBase(n, from);
	const groups = [...digits].map((d) => parseInt(d, 16).toString(2).padStart(k, '0'));
	const joined = groups.join('');
	const out: Step[] = [
		...(reason ? [groupsReason(from)] : []),
		{
			say: `Scrivi ogni cifra come gruppo di ${k} cifre binarie, con gli zeri davanti.`,
			table: { rows: groupTable(groups, from, false) }
		}
	];
	if (joined.startsWith('0')) {
		out.push({ say: "Scrivi i gruppi uno dopo l'altro e togli gli zeri all'inizio.", math: [`${tt(groups.join('\\,'))} \\to ${tt(groupDigits(toBase(n, 2), 2, '\\,'))}`, `${numTex(n, from)} = ${numTex(n, 2, true)}`] });
	} else {
		out.push({ say: "Scrivi i gruppi uno dopo l'altro, nello stesso ordine.", math: [`${numTex(n, from)} = ${numTex(n, 2, true)}`] });
	}
	return out;
}

/** The base's name, for a result label: "binario". */
const baseName = (b: Base) => BASES.find((x) => x.id === b)!.name;

export function convertiBase(value: string, from: number, to: number): Outcome {
	const isBase = (b: number): b is Base => b === 2 || b === 8 || b === 10 || b === 16;
	if (!isBase(from) || !isBase(to)) return fail('Scegli le due basi, per esempio 10 e 2.');
	const n = parseInBase(value, from);
	if (typeof n === 'string') return fail(n);
	let steps: Step[];
	if (from === to) steps = [{ say: `Il numero è già in base ${to}: non c'è niente da convertire.` }];
	else if (n === 0n) steps = [{ say: 'Lo zero si scrive 0 in ogni base.' }];
	else if (from === 10) steps = divisionSteps(n, to);
	else if (to === 10) steps = expansionSteps(n, from);
	else if (from === 2) steps = groupSteps(n, to as 8 | 16);
	else if (to === 2) steps = ungroupSteps(n, from as 8 | 16);
	else {
		// Octal and hexadecimal, through binary.
		const via = ungroupSteps(n, from as 8 | 16, false);
		const back = groupSteps(n, to as 8 | 16, false);
		steps = [
			{ say: 'Passa per la base 2: 8 e 16 sono tutte e due potenze di 2.', math: ['8 = 2^3', '16 = 2^4'] },
			...via.map((s, i) => (i === 0 ? { ...s, group: `Dalla base ${from} alla base 2` } : s)),
			...back.map((s, i) => (i === 0 ? { ...s, group: `Dalla base 2 alla base ${to}` } : s))
		];
	}
	const fromText = groupDigits(toBase(n, from), from, ' ');
	return {
		ok: true,
		rows: [{ label: `${fromText}${from === 10 ? '' : ` (base ${from})`} in ${baseName(to)}`, value: `$${numTex(n, to)}$` }],
		copy: toBase(n, to),
		steps
	};
}
