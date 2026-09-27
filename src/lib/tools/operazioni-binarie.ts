import { fail, type Outcome, type Step } from './types';
import { intTex } from './numbers';
import { groupDigits } from './binario';

/**
 * Addition, subtraction and multiplication of two whole numbers in base 2, in column, the way the books do them. The
 * addition goes right to left with the carries (1 + 1 = 10: write 0, carry 1); the subtraction with the borrows
 * (0 − 1: borrow 1 from the column on the left, which is worth 2 here, and write 1); the multiplication writes a copy
 * of the first number, shifted, for every 1 of the second, and adds the rows. Each operation in a table with one
 * column per bit, then a check in base 10. Unsigned numbers: a negative difference is for the two's complement tool.
 */

export type BinOp = 'somma' | 'sottrazione' | 'moltiplicazione';

const MAX_BITS = 32;
const MAX_BITS_MUL = 16;

const tt = (s: string) => `\\mathtt{${s}}`;
const bitCell = (b: string, hl = false) => (b === '' ? '' : `$${hl ? `\\hl{${tt(b)}}` : tt(b)}$`);
/** Bits grouped by four for a formula, with the base: 1011_2. */
const binTex = (s: string, hl = false) => `${hl ? `\\hl{${tt(groupDigits(s, 2, '\\,'))}}` : tt(groupDigits(s, 2, '\\,'))}_{2}`;

function readBits(input: string, which: string, max: number): string {
	const s = input.trim().replace(/[\s_]+/g, '').replace(/^0b/i, '');
	if (!s) return `Scrivi il ${which} numero in binario, con le cifre 0 e 1: per esempio 1011.`;
	if (/^-/.test(s)) return 'Scrivi numeri senza segno. Per i numeri negativi c’è il complemento a due.';
	if (!/^[01]+$/.test(s)) return `Nel ${which} numero ci sono cifre diverse da 0 e 1: in binario si usano solo quelle, per esempio 1011.`;
	const trimmed = s.replace(/^0+(?=.)/, '');
	if (trimmed.length > max) return `Il ${which} numero ha ${trimmed.length} bit: al massimo ${max}.`;
	return trimmed;
}

const value = (s: string) => BigInt(`0b${s}`);
const bigTex = (n: bigint) => intTex(Number(n));

/** The rules of one column, as a small table. */
const SUM_RULES: Step = {
	say: 'Ricorda le regole della somma di due bit.',
	table: {
		head: ['Somma', 'Scrivi', 'Riporto'],
		rows: [
			['$0 + 0 = 0$', '$0$', '$0$'],
			['$0 + 1 = 1$', '$1$', '$0$'],
			['$1 + 1 = 2$', '$0$', '$1$'],
			['$1 + 1 + 1 = 3$', '$1$', '$1$']
		]
	},
	then: 'In base $2$ il due si scrive $10$: scrivi $0$ e porta $1$ nella colonna a sinistra.'
};

const SUB_RULES: Step = {
	say: 'Ricorda le regole della sottrazione di due bit.',
	table: {
		head: ['Sottrazione', 'Scrivi', 'Prestito'],
		rows: [
			['$0 - 0$', '$0$', 'no'],
			['$1 - 0$', '$1$', 'no'],
			['$1 - 1$', '$0$', 'no'],
			['$0 - 1$', '$1$', 'sì']
		]
	},
	then: 'Per fare $0 - 1$ prendi in prestito $1$ dalla colonna a sinistra: qui vale $2$, e $2 - 1 = 1$.'
};

/** The column grid: a label, then one cell per column, the leftmost first. */
function gridRow(label: string, bits: string, width: number, hl = false): string[] {
	const cells = bits.padStart(width, ' ').split('').map((b) => (b === ' ' ? '' : bitCell(b, hl)));
	return [label, ...cells];
}

function checkStep(a: string, b: string, r: string, sign: string, op: bigint): Step {
	return {
		say: 'Controlla in base $10$.',
		math: [`${binTex(a)} = ${bigTex(value(a))}`, `${binTex(b)} = ${bigTex(value(b))}`, `${bigTex(value(a))} ${sign} ${bigTex(value(b))} = ${bigTex(op)}`, `${binTex(r)} = \\hl{${bigTex(value(r))}}`],
		then: value(r) === op ? 'I due risultati coincidono: il calcolo è giusto.' : undefined
	};
}

function somma(a: string, b: string): Outcome {
	const width = Math.max(a.length, b.length) + 1;
	const A = a.padStart(width, '0');
	const B = b.padStart(width, '0');
	const carries = Array(width + 1).fill(0);
	const out: string[] = Array(width).fill('0');
	const detail: string[][] = [];
	for (let i = width - 1; i >= 0; i--) {
		const x = Number(A[i]);
		const y = Number(B[i]);
		const c = carries[i + 1];
		const total = x + y + c;
		out[i] = String(total % 2);
		carries[i] = total >= 2 ? 1 : 0;
		const col = width - i;
		if (i > 0 || total > 0)
			detail.push([`$${col}$`, c ? `$${x} + ${y} + ${c} = ${total}$` : `$${x} + ${y} = ${total}$`, `$\\hl{${total % 2}}$`, `$${total >= 2 ? 1 : 0}$`]);
	}
	const result = out.join('').replace(/^0+(?=.)/, '');
	// The carry into a column is written over it.
	const carryCells = ['Riporti', ...Array.from({ length: width }, (_, j) => (carries[j + 1] ? '$1$' : ''))];
	const steps: Step[] = [
		SUM_RULES,
		{
			say: 'Somma colonna per colonna, partendo da destra.',
			table: { head: ['Colonna', 'Bit e riporto', 'Scrivi', 'Riporto'], rows: detail },
			then: carries[0] ? 'L’ultimo riporto diventa una cifra nuova, a sinistra.' : undefined
		},
		{
			say: 'Ecco la somma in colonna, con i riporti sopra.',
			table: {
				rows: [carryCells, gridRow('$a$', a, width), gridRow('$b$', b, width), gridRow('$a + b$', result, width, true)]
			}
		},
		checkStep(a, b, result, '+', value(a) + value(b))
	];
	return {
		ok: true,
		rows: [
			{ label: `Somma di ${groupDigits(a, 2, ' ')} e ${groupDigits(b, 2, ' ')} in binario`, value: `$${binTex(result)}$` },
			{ label: 'In base 10', value: `$${bigTex(value(result))}$` }
		],
		copy: result,
		steps
	};
}

function sottrazione(a: string, b: string): Outcome {
	if (value(a) < value(b))
		return fail('Il primo numero è più piccolo del secondo: la differenza sarebbe negativa. Scambia i numeri, oppure usa il complemento a due.');
	const width = a.length;
	const A = a;
	const B = b.padStart(width, '0');
	const borrows = Array(width + 1).fill(0); // borrows[i]: the column i pays 1 to the column on its right
	const out: string[] = Array(width).fill('0');
	const detail: string[][] = [];
	for (let i = width - 1; i >= 0; i--) {
		const x = Number(A[i]);
		const y = Number(B[i]);
		const owe = borrows[i + 1];
		let d = x - y - owe;
		const borrow = d < 0 ? 1 : 0;
		if (borrow) d += 2;
		borrows[i] = borrow;
		out[i] = String(d);
		const calc = owe ? `${x} - ${y} - 1` : `${x} - ${y}`;
		detail.push([`$${width - i}$`, borrow ? `$${calc} \\to ${x + 2} - ${y}${owe ? ' - 1' : ''} = ${d}$` : `$${calc} = ${d}$`, `$\\hl{${d}}$`, borrow ? 'sì' : 'no']);
	}
	const result = out.join('').replace(/^0+(?=.)/, '');
	// A borrow is written as −1 over the column that gives it: column j gives when column j + 1 borrowed.
	const cells = Array.from({ length: width }, (_, j) => (borrows[j + 1] ? '$-1$' : ''));
	const steps: Step[] = [
		SUB_RULES,
		{
			say: 'Sottrai colonna per colonna, partendo da destra.',
			table: { head: ['Colonna', 'Bit e prestito', 'Scrivi', 'Prestito'], rows: detail },
			then: 'Quando una colonna prende in prestito, alla colonna a sinistra togli $1$.'
		},
		{
			say: 'Ecco la sottrazione in colonna, con i prestiti sopra.',
			table: { rows: [['Prestiti', ...cells], gridRow('$a$', a, width), gridRow('$b$', b, width), gridRow('$a - b$', result, width, true)] }
		},
		checkStep(a, b, result, '-', value(a) - value(b))
	];
	return {
		ok: true,
		rows: [
			{ label: `Differenza tra ${groupDigits(a, 2, ' ')} e ${groupDigits(b, 2, ' ')} in binario`, value: `$${binTex(result)}$` },
			{ label: 'In base 10', value: `$${bigTex(value(result))}$` }
		],
		copy: result,
		steps
	};
}

function moltiplicazione(a: string, b: string): Outcome {
	const result = (value(a) * value(b)).toString(2);
	const width = Math.max(result.length, a.length + b.length - 1);
	const partials: string[][] = [];
	const bits = b.split('').reverse();
	bits.forEach((bit, k) => {
		// The shifted places are left empty, as in the books.
		const shown = (bit === '1' ? a : '0'.repeat(a.length)).padStart(width - k, ' ') + ' '.repeat(k);
		partials.push([`$a \\cdot ${bit}$`, ...shown.split('').map((c) => (c === ' ' ? '' : bitCell(c)))]);
	});
	const steps: Step[] = [
		{
			say: 'Ricorda che in binario si moltiplica solo per $0$ o per $1$.',
			math: [`${tt('1')} \\cdot a = a`, `${tt('0')} \\cdot a = 0`],
			then: 'Per ogni bit del secondo numero scrivi il primo numero oppure una riga di zeri.'
		},
		{
			say: 'Parti dal bit più a destra di $b$: ogni riga va un posto più a sinistra.',
			table: { rows: [gridRow('$a$', a, width), gridRow('$b$', b, width), ...partials, gridRow('$a \\cdot b$', result, width, true)] },
			then: 'Poi somma le righe in colonna, con i riporti, come nella somma.'
		},
		checkStep(a, b, result, '\\cdot', value(a) * value(b))
	];
	return {
		ok: true,
		rows: [
			{ label: `Prodotto di ${groupDigits(a, 2, ' ')} e ${groupDigits(b, 2, ' ')} in binario`, value: `$${binTex(result)}$` },
			{ label: 'In base 10', value: `$${bigTex(value(result))}$` }
		],
		copy: result,
		steps
	};
}

export function operazioniBinarie(inputA: string, inputB: string, op: string): Outcome {
	if (op !== 'somma' && op !== 'sottrazione' && op !== 'moltiplicazione') return fail('Scegli l’operazione: somma, sottrazione o moltiplicazione.');
	const max = op === 'moltiplicazione' ? MAX_BITS_MUL : MAX_BITS;
	const a = readBits(inputA, 'primo', max);
	if (!/^[01]+$/.test(a)) return fail(a);
	const b = readBits(inputB, 'secondo', max);
	if (!/^[01]+$/.test(b)) return fail(b);
	if (op === 'somma') return somma(a, b);
	if (op === 'sottrazione') return sottrazione(a, b);
	return moltiplicazione(a, b);
}
