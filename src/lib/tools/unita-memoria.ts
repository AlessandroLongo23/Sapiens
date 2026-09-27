import { fail, type Outcome, type Step } from './types';
import { parseDecimal } from './numbers';

/**
 * Units of digital information: the bit, the byte (8 bit), the decimal multiples kB, MB, GB, TB (powers of 1000, as
 * in the International System) and the binary ones KiB, MiB, GiB, TiB (powers of 1024, standard IEC 60027-2 of
 * 1998). A conversion within one family is one multiplication or division by a power of 1000 or 1024; between bits
 * and bytes by 8; between the two families it goes through the byte. Exact arithmetic on big-integer fractions: every
 * factor is made of 2s and 5s, so every result is a decimal that ends, sometimes a very long one.
 */

type Family = 'bit' | 'si' | 'iec';

export interface MemUnit {
	id: string;
	/** The prefix name and the unit: "megabyte". */
	name: string;
	family: Family;
	/** The power of 1000 or 1024 in bytes (the byte is 0 in both families). */
	level: number;
}

export const MEM_UNITS: MemUnit[] = [
	{ id: 'bit', name: 'bit', family: 'bit', level: 0 },
	{ id: 'B', name: 'byte', family: 'si', level: 0 },
	{ id: 'kB', name: 'kilobyte', family: 'si', level: 1 },
	{ id: 'MB', name: 'megabyte', family: 'si', level: 2 },
	{ id: 'GB', name: 'gigabyte', family: 'si', level: 3 },
	{ id: 'TB', name: 'terabyte', family: 'si', level: 4 },
	{ id: 'KiB', name: 'kibibyte', family: 'iec', level: 1 },
	{ id: 'MiB', name: 'mebibyte', family: 'iec', level: 2 },
	{ id: 'GiB', name: 'gibibyte', family: 'iec', level: 3 },
	{ id: 'TiB', name: 'tebibyte', family: 'iec', level: 4 }
];

const find = (id: string) => MEM_UNITS.find((u) => u.id === id || (id === 'KB' && u.id === 'kB'));
const BYTE = MEM_UNITS[1];

/* ---------------------------------------------------------------- exact fractions */

function gcd(a: bigint, b: bigint): bigint {
	while (b) [a, b] = [b, a % b];
	return a;
}

class Q {
	readonly n: bigint;
	readonly d: bigint;
	constructor(n: bigint, d = 1n) {
		const g = gcd(n, d) || 1n;
		this.n = n / g;
		this.d = d / g;
	}
	mul(o: Q) {
		return new Q(this.n * o.n, this.d * o.d);
	}
	div(o: Q) {
		return new Q(this.n * o.d, this.d * o.n);
	}
}

/** How many bytes one unit is worth. */
function bytes(u: MemUnit): Q {
	if (u.family === 'bit') return new Q(1n, 8n);
	return new Q((u.family === 'si' ? 1000n : 1024n) ** BigInt(u.level));
}

/* ---------------------------------------------------------------- numbers */

const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

interface Shown {
	tex: string;
	text: string;
	exact: boolean;
}

/** The decimal digits of x (a fraction whose denominator has only 2s and 5s): x = m · 10^e, m without trailing zeros. */
function digitsOf(x: Q): { m: bigint; e: number } {
	let d = x.d;
	let k = 0;
	while (d !== 1n) {
		if (d % 2n === 0n) d /= 2n;
		else if (d % 5n === 0n) d /= 5n;
		else throw new Error('not a terminating decimal');
		k++;
	}
	let m = (x.n * 10n ** BigInt(k)) / x.d;
	let e = -k;
	while (m !== 0n && m % 10n === 0n) {
		m /= 10n;
		e++;
	}
	return { m, e };
}

/** m · 10^e written out, with a thin space for thousands. */
function plain(m: bigint, e: number): Shown {
	const s = m.toString();
	let int: string;
	let frac = '';
	if (e >= 0) int = s + '0'.repeat(e);
	else if (s.length > -e) {
		int = s.slice(0, s.length + e);
		frac = s.slice(s.length + e);
	} else {
		int = '0';
		frac = '0'.repeat(-e - s.length) + s;
	}
	return { tex: `${group(int, '\\,')}${frac ? `{,}${frac}` : ''}`, text: `${group(int, ' ')}${frac ? `,${frac}` : ''}`, exact: true };
}

/** At most this many significant digits written exactly; beyond, rounded. */
const MAX_SIG = 12;

/**
 * A number as the converter shows it: exact when it is a whole number or has at most 12 significant digits, and sits
 * between a millionth and a million billions; else rounded to 6 significant digits (the first ones), with a power of ten when very large or
 * very small.
 */
function show(x: Q): Shown {
	if (x.n === 0n) return { tex: '0', text: '0', exact: true };
	const { m, e } = digitsOf(x);
	const len = m.toString().length;
	const E = len - 1 + e; // 10^E ≤ x < 10^(E+1)
	const inRange = E >= -6 && E < 15;
	if ((len <= MAX_SIG || e >= 0) && inRange) return plain(m, e);
	// Rounded to 6 significant digits, half up.
	const sig = Math.min(6, len);
	const cut = len - sig;
	let r = cut > 0 ? (m + 5n * 10n ** BigInt(cut - 1)) / 10n ** BigInt(cut) : m;
	let E2 = E;
	if (r.toString().length > sig) {
		r /= 10n;
		E2++;
	}
	const exact = cut === 0;
	if (E2 >= -6 && E2 < 15) {
		const out = plain(r, E2 - (sig - 1));
		// Trim trailing zeros after the comma.
		const tex = out.tex.includes('{,}') ? out.tex.replace(/0+$/, '').replace(/\{,\}$/, '') : out.tex;
		const text = out.text.includes(',') ? out.text.replace(/0+$/, '').replace(/,$/, '') : out.text;
		return { tex, text, exact };
	}
	const digits = r.toString().replace(/0+$/, '') || '0';
	const mant = digits.length > 1 ? `${digits[0]},${digits.slice(1)}` : digits;
	const sup = String(E2).replace(/./g, (c) => SUPERSCRIPT[c] ?? c);
	return { tex: `${mant.replace(',', '{,}')} \\cdot 10^{${E2}}`, text: `${mant} · 10${sup}`, exact };
}

const eqSign = (exact: boolean) => (exact ? '=' : '\\approx');
const unitTex = (u: MemUnit) => `\\text{${u.id}}`;

/* ---------------------------------------------------------------- steps */

/** One hop of a conversion, between two units with a whole factor between them. */
interface Hop {
	from: MemUnit;
	to: MemUnit;
}

/** The hops of a conversion: straight within a family, through the byte between bits and multiples or between families. */
function route(a: MemUnit, b: MemUnit): Hop[] {
	if (a === b) return [];
	const sameFamily = a.family === b.family || (a === BYTE && b.family !== 'bit') || (b === BYTE && a.family !== 'bit');
	if (sameFamily) return [{ from: a, to: b }];
	if (a === BYTE || b === BYTE) return [{ from: a, to: b }];
	return [
		{ from: a, to: BYTE },
		{ from: BYTE, to: b }
	];
}

/** "1 GB = 1000³ B = 1 000 000 000 B": the bigger unit in the smaller one. */
function statement(big: MemUnit, small: MemUnit): { tex: string; factor: bigint } {
	const f = bytes(big).div(bytes(small));
	const factor = f.n; // f ≥ 1 and whole: every bigger unit is a whole number of the smaller.
	if (big.family === 'bit' || small.family === 'bit') return { tex: `1\\ ${unitTex(big)} = \\hl{8}\\ ${unitTex(small)}`, factor };
	const family = big.family === 'iec' || small.family === 'iec' ? 'iec' : 'si';
	const power = big.level - small.level;
	const baseTex = family === 'si' ? '1000' : '1024';
	const full = plain(factor, 0).tex;
	const tex = power === 1 ? `1\\ ${unitTex(big)} = \\hl{${baseTex}}\\ ${unitTex(small)}` : `1\\ ${unitTex(big)} = ${baseTex}^{${power}}\\ ${unitTex(small)} = \\hl{${full}}\\ ${unitTex(small)}`;
	return { tex, factor };
}

/** Why the factor is what it is, one sentence. */
function why(big: MemUnit, small: MemUnit): string | undefined {
	if (big.family === 'bit' || small.family === 'bit') return 'Un byte è fatto di $8$ bit.';
	const iec = big.family === 'iec' || small.family === 'iec';
	return iec
		? 'I prefissi binari kibi, mebi, gibi e tebi (norma IEC del 1998) valgono potenze di $1024$, cioè di $2^{10}$.'
		: 'I prefissi kilo, mega, giga e tera valgono potenze di $1000$, come nel Sistema Internazionale.';
}

function hopSteps(h: Hop, x: Q, xShown: Shown, last: boolean): { steps: Step[]; y: Q; yShown: Shown } {
	const ratio = bytes(h.from).div(bytes(h.to));
	const down = ratio.n >= ratio.d; // from the bigger unit to the smaller one
	const big = down ? h.from : h.to;
	const small = down ? h.to : h.from;
	const st = statement(big, small);
	const f = new Q(st.factor);
	const y = down ? x.mul(f) : x.div(f);
	const yShown = show(y);
	const fTex = plain(st.factor, 0).tex;
	const exact = xShown.exact && yShown.exact;
	const target = last ? `\\hl{${yShown.tex}\\ ${unitTex(h.to)}}` : `\\hl{${yShown.tex}}\\ ${unitTex(h.to)}`;
	return {
		steps: [
			{ say: `Scrivi quanto vale $1\\ ${unitTex(big)}$ in $${unitTex(small)}$.`, math: [st.tex], then: why(big, small) },
			{
				say: `Da $${unitTex(h.from)}$ a $${unitTex(h.to)}$: ${down ? 'moltiplica' : 'dividi'} per $${fTex}$.`,
				math: [`${xShown.tex} ${down ? '\\cdot' : ':'} ${fTex} ${eqSign(exact)} ${yShown.tex}`, `${xShown.tex}\\ ${unitTex(h.from)} ${eqSign(exact)} ${target}`],
				then: x.n === 0n ? undefined : `L'unità di arrivo è più ${down ? 'piccola' : 'grande'}: il numero diventa più ${down ? 'grande' : 'piccolo'}.`
			}
		],
		y,
		yShown
	};
}

const LIMIT = 10n ** 15n;

export function unitaMemoria(value: string, from: string, to: string): Outcome {
	const a = find(from);
	const b = find(to);
	if (!a || !b) return fail('Scegli le due unità, per esempio GB e MB.');
	const r = parseDecimal(value);
	if (!r) return fail('Scrivi un numero, per esempio 500 oppure 2,5. Per i decimali usa la virgola.');
	if (r.sign() < 0) return fail('Scrivi un numero positivo, per esempio 500.');
	const x = new Q(BigInt(r.num), BigInt(r.den));
	if (x.n > LIMIT * x.d) return fail('Il numero è troppo grande: scrivi un numero più piccolo, per esempio 1000.');
	const xShown = show(x);

	const steps: Step[] = [];
	let y = x;
	let yShown = xShown;
	const hops = route(a, b);
	if (!hops.length) {
		steps.push({ say: 'Le due unità sono uguali: la misura non cambia.', math: [`${xShown.tex}\\ ${unitTex(a)} = \\hl{${xShown.tex}\\ ${unitTex(b)}}`] });
	} else {
		if (hops.length > 1)
			steps.push({
				say: 'Passa per il byte: le altre unità sono tutte definite a partire da lui.',
				then:
					a.family !== 'bit' && b.family !== 'bit'
						? 'Una unità conta per $1000$, l’altra per $1024$: le due famiglie si incontrano solo nel byte.'
						: undefined
			});
		hops.forEach((h, i) => {
			const out = hopSteps(h, y, yShown, i === hops.length - 1);
			steps.push(...out.steps);
			y = out.y;
			yShown = out.yShown;
		});
	}
	const valueTex = `${yShown.exact ? '' : '\\approx '}${yShown.tex}\\ ${unitTex(b)}`;
	return {
		ok: true,
		rows: [{ label: `${xShown.text} ${a.id} in ${b.name}`, value: `$${valueTex}$` }],
		copy: `${yShown.text} ${b.id}`,
		steps
	};
}
