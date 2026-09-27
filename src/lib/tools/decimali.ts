/**
 * Decimal numbers kept as the digits the student typed, for the tools that move the comma or look at single digits
 * (scientific notation, rounding): no floating point, no length limit of a JS number, and the zeros written after the
 * comma kept, because in "2,50" they count.
 */

export interface Digits {
	neg: boolean;
	/** The integer part, without leading zeros: "0" when there is none. */
	int: string;
	/** The digits after the comma, as typed (trailing zeros included). */
	frac: string;
}

/** "12,5", "-0.0034", "1.000.000", "45 600" → digits, or null. At most `max` digits. */
export function parseDigits(input: string, max = 30): Digits | null {
	let s = input
		.trim()
		.replace(/[\s  ]+/g, '')
		.replace(/[−–]/g, '-');
	// Points between groups of three digits are thousands, as in numbers.ts.
	if (/^[-+]?[1-9]\d{0,2}(\.\d{3})+(,\d*)?$/.test(s)) s = s.replace(/\./g, '');
	s = s.replace(',', '.');
	const m = /^([-+]?)(\d*)(?:\.(\d*))?$/.exec(s);
	if (!m || (!m[2] && !m[3])) return null;
	const int = m[2].replace(/^0+/, '') || '0';
	const frac = m[3] ?? '';
	if (int.length + frac.length > max) return null;
	return { neg: m[1] === '-' && !isZero({ neg: false, int, frac }), int, frac };
}

export const isZero = (d: Digits) => /^0*$/.test(d.int + d.frac);

/** Index of the first digit that is not zero in `int + frac`, or -1 for zero. */
export const firstNonZero = (d: Digits) => (d.int + d.frac).search(/[1-9]/);

/**
 * The number for a formula: comma as "{,}", thin spaces between thousands from 10 000 up, and the digits from
 * `hl[0]` to `hl[1] - 1` (indices in `int + frac`) marked with `\hl`.
 */
export function digitsTex(d: Digits, hl?: [number, number]): string {
	const s = d.int + d.frac;
	const point = d.int.length;
	const group = point > 4;
	let out = d.neg ? '-' : '';
	for (let i = 0; i < s.length; i++) {
		if (i === point) out += '{,}';
		else if (i > 0 && i < point && group && (point - i) % 3 === 0) out += '\\,';
		if (hl && i === hl[0]) out += '\\hl{';
		out += s[i];
		if (hl && i === hl[1] - 1) out += '}';
	}
	return out;
}

/** The number for text: "12 345,67". */
export function digitsText(d: Digits): string {
	const int = d.int.length > 4 ? d.int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : d.int;
	return `${d.neg ? '-' : ''}${int}${d.frac ? `,${d.frac}` : ''}`;
}

/** Digits from a string with the comma after `point` digits (which may be 0 or past the end): leading zeros removed. */
export function fromString(neg: boolean, s: string, point: number): Digits {
	if (point < 0) {
		s = '0'.repeat(-point) + s;
		point = 0;
	}
	if (point > s.length) s = s + '0'.repeat(point - s.length);
	const int = s.slice(0, point).replace(/^0+/, '') || '0';
	const frac = s.slice(point);
	const d = { neg: false, int, frac };
	return { ...d, neg: neg && !isZero(d) };
}

/** The same number with the comma moved `e` places to the right (left when negative), zeros added where needed. */
export function shiftComma(d: Digits, e: number): Digits {
	const s = d.int + d.frac;
	return fromString(d.neg, s, d.int.length + e);
}
