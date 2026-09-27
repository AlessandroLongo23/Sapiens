import { Rational } from '@/lib/exercises/v2/rational';

/**
 * Numbers as Italian students write them: a comma for decimals ("12,5"), a point accepted too, spaces or points as
 * thousands separators only when they cannot be decimals ("1.000.000", "1 000"). Parsed to exact rationals, so a
 * percentage of 12,5 is 25/2 and never 12.4999…
 */

/** "12,5", "-3", "0.75", "1 000" → an exact rational, or null when it is not a number. */
export function parseDecimal(input: string): Rational | null {
	let s = input.trim().replace(/\s+/g, '');
	if (!s) return null;
	// Points between groups of three digits, as Italians write thousands ("1.000", "12.500,5"); not after a leading 0 ("0.750" is a decimal).
	if (/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');
	s = s.replace(',', '.');
	const m = /^(-?)(\d*)(?:\.(\d+))?$/.exec(s);
	if (!m || (!m[2] && !m[3])) return null;
	const [, sign, int = '', frac = ''] = m;
	if (int.length + frac.length > 15) return null;
	const den = 10 ** frac.length;
	const num = Number(int || '0') * den + Number(frac || '0');
	return Rational.of(sign ? -num : num, den);
}

/** A positive whole number, or null. */
export function parseNatural(input: string, max = 1e12): number | null {
	const r = parseDecimal(input);
	if (!r || !r.isInteger() || r.num < 0 || r.num > max) return null;
	return r.num;
}

/** Numbers separated by commas, semicolons or spaces: "12, 18 30". A comma between digits with no space is ambiguous, so a list needs spaces or semicolons after decimal commas; whole numbers are always safe. */
export function parseNaturalList(input: string, max = 1e12): number[] | null {
	const parts = input
		.split(/[\s;,]+/)
		.map((p) => p.trim())
		.filter(Boolean);
	if (!parts.length) return null;
	const out: number[] = [];
	for (const p of parts) {
		const n = parseNatural(p, max);
		if (n === null) return null;
		out.push(n);
	}
	return out;
}

/** Numbers separated by semicolons or spaces, decimals with a comma: "7,5; 8 6". */
export function parseDecimalList(input: string): Rational[] | null {
	const parts = input
		.split(/[\s;]+/)
		.map((p) => p.trim())
		.filter(Boolean);
	if (!parts.length) return null;
	const out: Rational[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r) return null;
		out.push(r);
	}
	return out;
}

/**
 * A rational as an Italian decimal: exact when the expansion ends within `digits` decimals ("12,5"), else rounded
 * ("0,3333") with `exact: false`. Thousands get a thin space in LaTeX and a plain space in text.
 */
export function decimal(r: Rational, digits = 6): { text: string; tex: string; exact: boolean } {
	const num = BigInt(Math.abs(r.num));
	const den = BigInt(r.den);
	const scale = 10n ** BigInt(digits);
	const exact = (num * scale) % den === 0n;
	// Rounded half up to `digits` decimals.
	const scaled = (num * scale * 2n + den) / (2n * den);
	const int = scaled / scale;
	const frac = (scaled % scale).toString().padStart(digits, '0').replace(/0+$/, '');
	const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);
	const sign = r.num < 0 && scaled !== 0n ? '-' : '';
	const text = `${sign}${group(int.toString(), ' ')}${frac ? `,${frac}` : ''}`;
	const tex = `${sign}${group(int.toString(), '\\,')}${frac ? `{,}${frac}` : ''}`;
	return { text, tex, exact };
}

/** A decimal for a formula: "12{,}5", or "\approx 0{,}3333" when rounded, for use after "=". */
export function decimalTex(r: Rational, digits = 6): string {
	const d = decimal(r, digits);
	return d.exact ? d.tex : `\\approx ${d.tex}`;
}

/** A whole number with thin spaces from 10 000 up, as in the lessons. */
export function intTex(n: number): string {
	const s = String(Math.abs(n));
	const body = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
	return n < 0 ? `-${body}` : body;
}

/** A whole number for copying: "10 000". */
export function intText(n: number): string {
	const s = String(Math.abs(n));
	const body = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
	return n < 0 ? `-${body}` : body;
}
