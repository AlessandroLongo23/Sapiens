import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex, intText, parseDecimal } from './numbers';

/**
 * Area and perimeter of the plane figures of the first years (square, rectangle, triangle, trapezoid, rhombus,
 * parallelogram, circle), one page per figure. Each figure has the input sets used at school, as modes. Lengths
 * are kept exact while they can be: rationals, radicals like 5√2 and multiples of π, each with its decimal; a
 * value that cannot stay exact (or would overflow) falls back to a decimal with "≈".
 *
 * Every result also carries a sketch of the figure in its own units, drawn by the page with the given measures
 * labelled.
 */

// ---------------------------------------------------------------------------------------------------------------
// Exact values: c·√r·π^pi, with c rational and r square-free; `x` is the value as a float, always present.

export interface Val {
	/** The rational coefficient, or null when the value is known only as a decimal. */
	c: Rational | null;
	/** Square-free radicand, 1 for none. */
	r: number;
	/** Power of π. */
	pi: number;
	x: number;
}

/** Radicands above this are not simplified (the search for square factors would take too long). */
const MAX_RADICAND = 1e10;
/** Decimals accepted in an input, and kept in an exact decimal result. */
export const DIGITS = 4;
/** Decimals of a rounded result, as at school: 31,42. */
export const ROUND = 2;
/** An exact decimal is written out when it ends within this many decimals (1,2345² = 1,52399025). */
const EXACT_DIGITS = 8;

const approxOnly = (x: number): Val => ({ c: null, r: 1, pi: 0, x });

/** Exact arithmetic throws when a number leaves the safe integers: then the value is kept as a decimal. */
function attempt<T>(f: () => T | null): T | null {
	try {
		return f();
	} catch {
		return null;
	}
}

/** n = k²·r with r square-free, or null when n is too large to factor. */
export function squareFree(n: number): { k: number; r: number } | null {
	if (!Number.isSafeInteger(n) || n < 0 || n > MAX_RADICAND) return null;
	let k = 1;
	let r = n;
	for (let i = 2; i * i <= r; i++) {
		while (r % (i * i) === 0) {
			r /= i * i;
			k *= i;
		}
	}
	return { k, r };
}

export const val = (c: Rational): Val => ({ c, r: 1, pi: 0, x: c.num / c.den });
export const int = (n: number): Val => val(q(n));
export const PI: Val = { c: q(1), r: 1, pi: 1, x: Math.PI };
/** √n for a whole n. */
export const root = (n: number): Val => sqrt(int(n));

export function mul(a: Val, b: Val): Val {
	const x = a.x * b.x;
	const e = attempt(() => {
		if (!a.c || !b.c) return null;
		const s = squareFree(a.r * b.r);
		if (!s) return null;
		return { c: a.c.mul(b.c).mul(q(s.k)), r: s.r, pi: a.pi + b.pi };
	});
	return e ? { ...e, x } : approxOnly(x);
}

function inv(a: Val): Val {
	const x = 1 / a.x;
	// 1 / (c√r) = √r / (c·r)
	const e = attempt(() => (a.c && !a.c.isZero() ? { c: q(1).div(a.c.mul(q(a.r))), r: a.r, pi: -a.pi } : null));
	return e ? { ...e, x } : approxOnly(x);
}

export const div = (a: Val, b: Val): Val => mul(a, inv(b));

function addSigned(a: Val, b: Val, sign: 1 | -1): Val {
	const x = a.x + sign * b.x;
	const e = attempt(() => {
		if (!a.c || !b.c) return null;
		const bc = sign === 1 ? b.c : b.c.neg();
		if (b.c.isZero()) return { c: a.c, r: a.r, pi: a.pi };
		if (a.c.isZero()) return { c: bc, r: b.r, pi: b.pi };
		if (a.r !== b.r || a.pi !== b.pi) return null;
		const c = a.c.add(bc);
		return c.isZero() ? { c, r: 1, pi: 0 } : { c, r: a.r, pi: a.pi };
	});
	return e ? { ...e, x } : approxOnly(x);
}

export const add = (a: Val, b: Val): Val => addSigned(a, b, 1);
export const sub = (a: Val, b: Val): Val => addSigned(a, b, -1);
export const square = (a: Val): Val => mul(a, a);

export function sqrt(a: Val): Val {
	const x = Math.sqrt(a.x);
	const e = attempt(() => {
		if (!a.c || a.r !== 1 || a.pi % 2 !== 0 || a.c.sign() < 0) return null;
		// √(p/q) = √(p·q) / q
		const s = squareFree(a.c.num * a.c.den);
		if (!s) return null;
		return { c: q(s.k, a.c.den), r: s.r, pi: a.pi / 2 };
	});
	return e ? { ...e, x } : approxOnly(x);
}

/** A rational value (no root, no π). */
const isRational = (v: Val): v is Val & { c: Rational } => !!v.c && v.r === 1 && v.pi === 0;

/** Compares two values, exactly when both are rational. */
export function cmp(a: Val, b: Val): -1 | 0 | 1 {
	// Exact only when the cross products stay safe integers: Rational.compare does not check them.
	const safe = a.c && b.c && Number.isSafeInteger(a.c.num * b.c.den) && Number.isSafeInteger(b.c.num * a.c.den);
	if (safe && a.r === b.r && a.pi === b.pi) return a.c!.compare(b.c!);
	const d = a.x - b.x;
	if (Math.abs(d) <= 1e-12 * Math.max(Math.abs(a.x), Math.abs(b.x))) return 0;
	return d > 0 ? 1 : -1;
}

// ---------------------------------------------------------------------------------------------------------------
// Showing values.

/**
 * A decimal rounded to ROUND places, as TeX and text, without "≈". The zeros stay ("5,00"), so a rounded value never
 * looks exact; a small value keeps two significant digits ("0,0071").
 */
function rounded(x: number): { tex: string; text: string } {
	let digits = ROUND;
	while (digits < EXACT_DIGITS && x !== 0 && Math.abs(x) < 10 ** (1 - digits)) digits++;
	const n = Math.round(Math.abs(x) * 10 ** digits);
	const sign = x < 0 && n !== 0 ? '-' : '';
	const group = (t: string, sep: string) => (t.length > 4 ? t.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : t);
	if (Number.isSafeInteger(n)) {
		const s = String(n).padStart(digits + 1, '0');
		const [whole, frac] = [s.slice(0, -digits), s.slice(-digits)];
		return { tex: `${sign}${group(whole, '\\,')}{,}${frac}`, text: `${sign}${group(whole, ' ')},${frac}` };
	}
	// Beyond the safe integers (an intermediate product, never an input): the whole part is enough.
	const whole = BigInt(Math.round(x)).toString();
	return { tex: group(whole, '\\,'), text: group(whole, ' ') };
}

/** The exact form: "5\sqrt{2}", "\dfrac{5\sqrt{2}}{2}", "12{,}5\pi", "\dfrac{15}{2\pi}", "\dfrac{10}{3}". */
function exactForm(v: Val & { c: Rational }): { tex: string; text: string; terminating: boolean } {
	const c = v.c;
	const sign = c.num < 0 ? '-' : '';
	const p = Math.abs(c.num);
	const d = decimal(c, EXACT_DIGITS);
	if (v.r === 1 && v.pi === 0) {
		if (d.exact) return { tex: d.tex, text: d.text, terminating: true };
		return { tex: `${sign}\\dfrac{${intTex(p)}}{${intTex(c.den)}}`, text: `${sign}${intText(p)}/${intText(c.den)}`, terminating: false };
	}
	const rootTex = v.r > 1 ? `\\sqrt{${intTex(v.r)}}` : '';
	const rootText = v.r > 1 ? `√${intText(v.r)}` : '';
	const piTex = (n: number) => (n === 1 ? '\\pi' : `\\pi^{${n}}`);
	const piText = (n: number) => (n === 1 ? 'π' : `π^${n}`);
	const upTex = v.pi > 0 ? piTex(v.pi) : '';
	const upText = v.pi > 0 ? piText(v.pi) : '';
	// A multiple of π with a decimal coefficient reads as at school: 12,5π.
	if (v.r === 1 && v.pi > 0 && d.exact) {
		const one = c.equals(q(1));
		return { tex: `${one ? '' : d.tex}${upTex}`, text: `${one ? '' : d.text}${upText}`, terminating: false };
	}
	// Over π with a decimal coefficient: \dfrac{15{,}7}{\pi}.
	if (v.r === 1 && v.pi < 0 && d.exact) return { tex: `${sign}\\dfrac{${decimal(c.abs(), EXACT_DIGITS).tex}}{${piTex(-v.pi)}}`, text: `${sign}${decimal(c.abs(), EXACT_DIGITS).text}/${piText(-v.pi)}`, terminating: false };
	const bare = p === 1 && (rootTex || upTex);
	const topTex = `${bare ? '' : intTex(p)}${rootTex}${upTex}`;
	const topText = `${bare ? '' : intText(p)}${rootText}${upText}`;
	const downTex = `${c.den === 1 ? '' : intTex(c.den)}${v.pi < 0 ? piTex(-v.pi) : ''}`;
	const downText = `${c.den === 1 ? '' : intText(c.den)}${v.pi < 0 ? piText(-v.pi) : ''}`;
	if (!downTex) return { tex: `${sign}${topTex}`, text: `${sign}${topText}`, terminating: false };
	const paren = c.den !== 1 && v.pi < 0;
	return { tex: `${sign}\\dfrac{${topTex}}{${downTex}}`, text: `${sign}${topText}/${paren ? `(${downText})` : downText}`, terminating: false };
}

export interface Shown {
	/** The exact form, null when the value is known only as a decimal. */
	exact: { tex: string; text: string } | null;
	/** The rounded decimal, null when the exact form is already a decimal. */
	approx: { tex: string; text: string } | null;
}

export function shown(v: Val): Shown {
	if (!v.c) return { exact: null, approx: rounded(v.x) };
	const e = exactForm(v as Val & { c: Rational });
	return { exact: { tex: e.tex, text: e.text }, approx: e.terminating ? null : rounded(v.x) };
}

/** The value to write inside a formula: the exact form, or the decimal. */
export const vt = (v: Val): string => {
	const s = shown(v);
	return s.exact?.tex ?? s.approx!.tex;
};

/** A value squared inside a formula, in brackets unless it is a plain number. */
export const sqt = (v: Val): string => {
	const t = vt(v);
	return /^[0-9{},\\]+$/.test(t) ? `${t}^2` : `\\left(${t}\\right)^2`;
};

export type Unit = '' | 'mm' | 'cm' | 'dm' | 'm' | 'km';
export const UNITS: Unit[] = ['mm', 'cm', 'dm', 'm', 'km'];
export const isUnit = (u: string): u is Unit => u === '' || (UNITS as string[]).includes(u);

const unitTex = (u: Unit, dim: 1 | 2) => (u ? `\\,\\text{${u}}${dim === 2 ? '^2' : ''}` : '');
const unitText = (u: Unit, dim: 1 | 2) => (u ? ` ${u}${dim === 2 ? '²' : ''}` : '');

/** What follows the formula: " = 5\sqrt{2}\,\text{cm} \approx 7{,}0711\,\text{cm}", or " \approx 7{,}0711\,\text{cm}". */
export function eq(v: Val, u: Unit = '', dim: 1 | 2 = 1): string {
	const s = shown(v);
	const U = unitTex(u, dim);
	const tail = s.approx ? ` \\approx ${s.approx.tex}${U}` : '';
	return s.exact ? ` = ${s.exact.tex}${U}${tail}` : tail;
}

/** The value as plain text, for the copy button: "5√2 cm ≈ 7,0711 cm". */
export function valueText(v: Val, u: Unit = '', dim: 1 | 2 = 1): string {
	const s = shown(v);
	const U = unitText(u, dim);
	if (!s.exact) return `≈ ${s.approx!.text}${U}`;
	return s.approx ? `${s.exact.text}${U} ≈ ${s.approx.text}${U}` : `${s.exact.text}${U}`;
}

/** A short label for a drawing: the exact form when short, else the decimal. */
function labelText(v: Val, u: Unit, dim: 1 | 2 = 1): string {
	const s = shown(v);
	const t = s.exact && s.exact.text.length <= 8 ? s.exact.text : rounded(v.x).text;
	return `${t}${unitText(u, dim)}`;
}

// ---------------------------------------------------------------------------------------------------------------
// Writing a calculation: one line per transformation (docs/strumenti.md, "Leggibilità").

/** The last lines of a calculation: "= \hl{5\sqrt{2}\,\text{cm}}", then "\approx 7{,}07\,\text{cm}". */
export function resultLines(v: Val, u: Unit = '', dim: 1 | 2 = 1): string[] {
	const s = shown(v);
	const U = unitTex(u, dim);
	if (!s.exact) return [`\\approx \\hl{${s.approx!.tex}${U}}`];
	return [`= \\hl{${s.exact.tex}${U}}`, ...(s.approx ? [`\\approx ${s.approx.tex}${U}`] : [])];
}

/**
 * A calculation, a line each: the formula with letters, the substitutions and simplifications (each written after
 * "="), the result with its unit. A line equal to the one before it, or to the result, is left out.
 */
export function calc(formula: string, subs: string[], v: Val, u: Unit = '', dim: 1 | 2 = 1): string[] {
	const exact = shown(v).exact?.tex;
	const lines = [formula];
	let last = '';
	for (const x of subs) {
		if (x === last || x === exact) continue;
		lines.push(`= ${x}`);
		last = x;
	}
	return [...lines, ...resultLines(v, u, dim)];
}

/** "\sqrt{50}", then "\sqrt{5^2 \cdot 2}" when a square factor comes out: the lines of a root before its result. */
export function rootSubs(radicand: Val): string[] {
	const lines = [`\\sqrt{${vt(radicand)}}`];
	const r = sqrt(radicand);
	if (radicand.c?.isInteger() && r.c?.isInteger() && r.r > 1 && r.c.num > 1) lines.push(`\\sqrt{${intTex(r.c.num)}^2 \\cdot ${intTex(r.r)}}`);
	return lines;
}

/** "c_2 = \\sqrt{50}", "= \\sqrt{5^2 \\cdot 2}", "= 5\\sqrt{2}": a root and its result; "c_2 = \\sqrt{5}" once when it stays a root. */
export function rootCalc(sym: string, radicand: Val, root: Val, u: Unit = ''): string[] {
	const subs = rootSubs(radicand);
	if (shown(root).exact?.tex !== subs[0]) return calc(`${sym} = ${subs[0]}`, subs.slice(1), root, u);
	const [first, ...rest] = resultLines(root, u);
	return [`${sym} ${first}`, ...rest];
}

/** The lines of a square root of a sum or a difference of squares: "\sqrt{8^2 + 6^2}", "\sqrt{64 + 36}", "\sqrt{100}". */
export function pythagorasSubs(a: Val, b: Val, sign: '+' | '-'): string[] {
	const [a2, b2] = [square(a), square(b)];
	const radicand = sign === '+' ? add(a2, b2) : sub(a2, b2);
	return [`\\sqrt{${sqt(a)} ${sign} ${sqt(b)}}`, `\\sqrt{${vt(a2)} ${sign} ${vt(b2)}}`, ...rootSubs(radicand)];
}

// ---------------------------------------------------------------------------------------------------------------
// Figures, their modes and their inputs.

export type Figure = 'quadrato' | 'rettangolo' | 'triangolo' | 'trapezio' | 'rombo' | 'parallelogramma' | 'cerchio';
export type FieldKey = 'a' | 'b' | 'c' | 'd' | 'e';

export interface Field {
	key: FieldKey;
	/** The label over the input. */
	label: string;
	/** With the article, for the messages: "il lato". */
	the: string;
	/** Symbol in the formulas: "l", "2p", "c_1". */
	sym: string;
	/** Area or length: decides the unit. */
	dim?: 1 | 2;
	optional?: boolean;
	/** Accepts a multiple of π, "10π". */
	pi?: boolean;
}

export interface ModeSpec {
	value: string;
	label: string;
	fields: Field[];
	/** The values the mode opens with. */
	example: Partial<Record<FieldKey, string>>;
	/** A line under the inputs. */
	hint?: string;
}

const F = (key: FieldKey, label: string, the: string, sym: string, more: Partial<Field> = {}): Field => ({ key, label, the, sym, ...more });

export const FIGURES: Record<Figure, { name: string; modes: ModeSpec[] }> = {
	quadrato: {
		name: 'quadrato',
		modes: [
			{ value: 'lato', label: 'Dal lato', fields: [F('a', 'Lato (l)', 'il lato', 'l')], example: { a: '5' } },
			{ value: 'diagonale', label: 'Dalla diagonale', fields: [F('a', 'Diagonale (d)', 'la diagonale', 'd')], example: { a: '8' } },
			{ value: 'area', label: "Dall'area", fields: [F('a', 'Area (A)', "l'area", 'A', { dim: 2 })], example: { a: '36' } },
			{ value: 'perimetro', label: 'Dal perimetro', fields: [F('a', 'Perimetro (2p)', 'il perimetro', '2p')], example: { a: '28' } }
		]
	},
	rettangolo: {
		name: 'rettangolo',
		modes: [
			{ value: 'lati', label: 'Base e altezza', fields: [F('a', 'Base (b)', 'la base', 'b'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '8', b: '6' } },
			{ value: 'diagonale', label: 'Base e diagonale', fields: [F('a', 'Base (b)', 'la base', 'b'), F('b', 'Diagonale (d)', 'la diagonale', 'd')], example: { a: '12', b: '13' } },
			{ value: 'area', label: 'Area e base', fields: [F('a', 'Area (A)', "l'area", 'A', { dim: 2 }), F('b', 'Base (b)', 'la base', 'b')], example: { a: '60', b: '12' } },
			{ value: 'perimetro', label: 'Perimetro e base', fields: [F('a', 'Perimetro (2p)', 'il perimetro', '2p'), F('b', 'Base (b)', 'la base', 'b')], example: { a: '34', b: '12' } }
		]
	},
	triangolo: {
		name: 'triangolo',
		modes: [
			{
				value: 'base',
				label: 'Base e altezza',
				fields: [F('a', 'Base (b)', 'la base', 'b'), F('b', 'Altezza (h)', "l'altezza", 'h'), F('c', 'Lato (l₁)', 'il primo lato', 'l_1', { optional: true }), F('d', 'Lato (l₂)', 'il secondo lato', 'l_2', { optional: true })],
				example: { a: '14', b: '12', c: '13', d: '15' },
				hint: 'Gli altri due lati servono solo per il perimetro: puoi lasciarli vuoti.'
			},
			{ value: 'lati', label: 'Tre lati (Erone)', fields: [F('a', 'Lato (a)', 'il lato a', 'a'), F('b', 'Lato (b)', 'il lato b', 'b'), F('c', 'Lato (c)', 'il lato c', 'c')], example: { a: '5', b: '6', c: '7' } },
			{ value: 'equilatero', label: 'Equilatero', fields: [F('a', 'Lato (l)', 'il lato', 'l')], example: { a: '6' } }
		]
	},
	trapezio: {
		name: 'trapezio',
		modes: [
			{
				value: 'generico',
				label: 'Basi e altezza',
				fields: [F('a', 'Base maggiore (B)', 'la base maggiore', 'B'), F('b', 'Base minore (b)', 'la base minore', 'b'), F('c', 'Altezza (h)', "l'altezza", 'h'), F('d', 'Lato obliquo (l₁)', 'il primo lato obliquo', 'l_1', { optional: true }), F('e', 'Lato obliquo (l₂)', 'il secondo lato obliquo', 'l_2', { optional: true })],
				example: { a: '24', b: '10', c: '12', d: '13', e: '15' },
				hint: 'I lati obliqui servono solo per il perimetro: puoi lasciarli vuoti.'
			},
			{ value: 'isoscele', label: 'Isoscele', fields: [F('a', 'Base maggiore (B)', 'la base maggiore', 'B'), F('b', 'Base minore (b)', 'la base minore', 'b'), F('c', 'Altezza (h)', "l'altezza", 'h')], example: { a: '12', b: '6', c: '4' } },
			{ value: 'rettangolo', label: 'Rettangolo', fields: [F('a', 'Base maggiore (B)', 'la base maggiore', 'B'), F('b', 'Base minore (b)', 'la base minore', 'b'), F('c', 'Altezza (h)', "l'altezza", 'h')], example: { a: '15', b: '9', c: '8' } }
		]
	},
	rombo: {
		name: 'rombo',
		modes: [
			{ value: 'diagonali', label: 'Diagonali', fields: [F('a', 'Diagonale (d₁)', 'la prima diagonale', 'd_1'), F('b', 'Diagonale (d₂)', 'la seconda diagonale', 'd_2')], example: { a: '16', b: '12' } },
			{ value: 'lato-diagonale', label: 'Lato e diagonale', fields: [F('a', 'Lato (l)', 'il lato', 'l'), F('b', 'Diagonale (d₁)', 'la diagonale', 'd_1')], example: { a: '13', b: '10' } },
			{ value: 'lato-altezza', label: 'Lato e altezza', fields: [F('a', 'Lato (l)', 'il lato', 'l'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '10', b: '8' } }
		]
	},
	parallelogramma: {
		name: 'parallelogramma',
		modes: [
			{
				value: 'base',
				label: 'Base e altezza',
				fields: [F('a', 'Base (b)', 'la base', 'b'), F('b', 'Altezza (h)', "l'altezza", 'h'), F('c', 'Lato obliquo (l)', 'il lato obliquo', 'l', { optional: true })],
				example: { a: '10', b: '4', c: '5' },
				hint: 'Il lato obliquo serve solo per il perimetro: puoi lasciarlo vuoto.'
			},
			{
				value: 'area',
				label: 'Area e base',
				fields: [F('a', 'Area (A)', "l'area", 'A', { dim: 2 }), F('b', 'Base (b)', 'la base', 'b'), F('c', 'Lato obliquo (l)', 'il lato obliquo', 'l', { optional: true })],
				example: { a: '48', b: '8', c: '' },
				hint: 'Il lato obliquo serve solo per il perimetro: puoi lasciarlo vuoto.'
			}
		]
	},
	cerchio: {
		name: 'cerchio',
		modes: [
			{ value: 'raggio', label: 'Dal raggio', fields: [F('a', 'Raggio (r)', 'il raggio', 'r')], example: { a: '5' } },
			{ value: 'diametro', label: 'Dal diametro', fields: [F('a', 'Diametro (d)', 'il diametro', 'd')], example: { a: '12' } },
			{ value: 'circonferenza', label: 'Dalla circonferenza', fields: [F('a', 'Circonferenza (C)', 'la circonferenza', 'C', { pi: true })], example: { a: '10π' }, hint: 'Puoi scrivere anche un multiplo di π: 10π, oppure 10pi.' },
			{ value: 'area', label: "Dall'area", fields: [F('a', 'Area (A)', "l'area", 'A', { dim: 2, pi: true })], example: { a: '50' }, hint: 'Puoi scrivere anche un multiplo di π: 25π, oppure 25pi.' }
		]
	}
};

/** Clickable examples, per figure: a mode and its values. */
export const FIGURE_EXAMPLES: Record<Figure, { label: string; mode: string; values: Partial<Record<FieldKey, string>> }[]> = {
	quadrato: [
		{ label: 'l = 7', mode: 'lato', values: { a: '7' } },
		{ label: 'd = 10', mode: 'diagonale', values: { a: '10' } },
		{ label: 'A = 50', mode: 'area', values: { a: '50' } },
		{ label: '2p = 36', mode: 'perimetro', values: { a: '36' } }
	],
	rettangolo: [
		{ label: 'b = 12, h = 5', mode: 'lati', values: { a: '12', b: '5' } },
		{ label: 'b = 8, d = 10', mode: 'diagonale', values: { a: '8', b: '10' } },
		{ label: 'A = 45, b = 9', mode: 'area', values: { a: '45', b: '9' } },
		{ label: '2p = 30, b = 10', mode: 'perimetro', values: { a: '30', b: '10' } }
	],
	triangolo: [
		{ label: 'b = 12, h = 7', mode: 'base', values: { a: '12', b: '7', c: '', d: '' } },
		{ label: '5, 12, 13', mode: 'lati', values: { a: '5', b: '12', c: '13' } },
		{ label: '4, 5, 6', mode: 'lati', values: { a: '4', b: '5', c: '6' } },
		{ label: 'equilatero l = 10', mode: 'equilatero', values: { a: '10' } }
	],
	trapezio: [
		{ label: 'B = 20, b = 10, h = 6', mode: 'generico', values: { a: '20', b: '10', c: '6', d: '', e: '' } },
		{ label: 'isoscele 16, 10, 4', mode: 'isoscele', values: { a: '16', b: '10', c: '4' } },
		{ label: 'rettangolo 11, 7, 3', mode: 'rettangolo', values: { a: '11', b: '7', c: '3' } }
	],
	rombo: [
		{ label: 'd₁ = 24, d₂ = 10', mode: 'diagonali', values: { a: '24', b: '10' } },
		{ label: 'd₁ = 6, d₂ = 6', mode: 'diagonali', values: { a: '6', b: '6' } },
		{ label: 'l = 5, d₁ = 8', mode: 'lato-diagonale', values: { a: '5', b: '8' } },
		{ label: 'l = 12, h = 9', mode: 'lato-altezza', values: { a: '12', b: '9' } }
	],
	parallelogramma: [
		{ label: 'b = 15, h = 8', mode: 'base', values: { a: '15', b: '8', c: '' } },
		{ label: 'b = 12, h = 6, l = 10', mode: 'base', values: { a: '12', b: '6', c: '10' } },
		{ label: 'A = 72, b = 9', mode: 'area', values: { a: '72', b: '9', c: '' } }
	],
	cerchio: [
		{ label: 'r = 3', mode: 'raggio', values: { a: '3' } },
		{ label: 'd = 10', mode: 'diametro', values: { a: '10' } },
		{ label: 'C = 31,4', mode: 'circonferenza', values: { a: '31,4' } },
		{ label: 'A = 49π', mode: 'area', values: { a: '49π' } }
	]
};

// ---------------------------------------------------------------------------------------------------------------
// The drawing.

export type Pt = [number, number];

/**
 * A sketch in the figure's own units, y upwards. The page scales it, draws the outline, the dashed helper lines,
 * the right angles, and puts each label at the middle of its segment, outside the figure.
 */
export interface Sketch {
	outline: Pt[] | { circle: number };
	/** Heights, diagonals, radii: dashed. */
	lines: [Pt, Pt][];
	/** `inside`: on the side of the segment towards the middle of the figure (for a height drawn inside it). */
	labels: { from: Pt; to: Pt; text: string; given: boolean; inside?: boolean }[];
	/** Right angles: the corner and a point along each side. */
	right: [Pt, Pt, Pt][];
	/** A measure that is not a segment (an area, a circumference), written under the figure. */
	caption?: { text: string; given: boolean };
}

export interface FigureResult {
	outcome: Outcome;
	sketch: Sketch | null;
}

// ---------------------------------------------------------------------------------------------------------------
// Reading inputs.

/** Inputs larger than this are refused: every result must stay exact or well within a float's precision. */
const MAX = 100_000;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** One measure, positive; a multiple of π when the field accepts it. Null when optional and empty. */
export function readMeasure(f: Pick<Field, 'the' | 'optional' | 'pi'>, input: string | undefined): Val | null | string {
	const t = (input ?? '').trim();
	if (!t) return f.optional ? null : `Scrivi ${f.the}, per esempio 12 o 7,5${f.pi ? ', oppure un multiplo di π come 10π' : ''}.`;
	let body = t;
	let withPi = false;
	if (f.pi) {
		const m = /^(.*?)\s*\*?\s*(π|pi|pigreco)$/i.exec(t);
		if (m) {
			withPi = true;
			body = m[1].trim() || '1';
		}
	}
	const r = parseDecimal(body);
	if (!r) return `${cap(f.the)}: scrivi un numero, per esempio 12 o 7,5${f.pi ? ', oppure un multiplo di π come 10π' : ''}.`;
	if (r.sign() <= 0) return `${cap(f.the)} deve essere maggiore di zero: scrivi per esempio 5.`;
	if (r.compare(q(MAX)) > 0) return 'Usa misure fino a 100 000, cambiando unità: per esempio 250 km invece di 250 000 m.';
	if (r.den > 10 ** DIGITS) return 'Usa al massimo quattro cifre decimali, per esempio 7,1234.';
	return withPi ? mul(val(r), PI) : val(r);
}

type Measures = Record<string, Val | null>;

function readAll(spec: ModeSpec, values: Partial<Record<FieldKey, string>>): Measures | string {
	const out: Measures = {};
	for (const f of spec.fields) {
		const v = readMeasure(f, values[f.key]);
		if (typeof v === 'string') return v;
		out[f.sym] = v;
	}
	return out;
}


/** A measure found: its name in words, its symbol, its value, length or area. */
type Item = [label: string, sym: string, v: Val, dim: 1 | 2];

/**
 * The value of a row: "$d = 5\\sqrt{2}\\,\\text{cm}$ $\\approx 7{,}07\\,\\text{cm}$". The exact value and the decimal are
 * two formulas, so on a narrow screen the decimal goes to the next line instead of off the edge.
 */
export function rowValue(sym: string, v: Val, u: Unit = '', dim: 1 | 2 = 1): string {
	const s = shown(v);
	const U = unitTex(u, dim);
	if (!s.exact) return `$${sym} \\approx ${s.approx!.tex}${U}$`;
	return `$${sym} = ${s.exact.tex}${U}$${s.approx ? ` $\\approx ${s.approx.tex}${U}$` : ''}`;
}

/** One row per measure found, and the copy text: "A = 25 cm²; 2p = 20 cm; d = 5√2 cm ≈ 7,07 cm". */
function answer(items: Item[], u: Unit): { rows: { label: string; value: string }[]; copy: string } {
	return {
		rows: items.map(([label, sym, v, dim]) => ({ label, value: rowValue(sym, v, u, dim) })),
		copy: items
			.map(([, sym, v, dim]) => {
				const t = valueText(v, u, dim);
				return `${sym.replace(/_(\d)/, '$1')} ${t.startsWith('≈') ? '' : '= '}${t}`;
			})
			.join('; ')
	};
}

const done = (items: Item[], u: Unit, steps: Step[], sketch: Sketch | null): FigureResult => ({
	outcome: { ok: true, ...answer(items, u), steps },
	sketch
});

const failed = (error: string): FigureResult => ({ outcome: fail(error), sketch: null });

/** A plain-text number for an error message. */
const plain = (v: Val) => {
	const s = shown(v);
	return s.exact && !s.approx ? s.exact.text : `${s.approx!.text}`;
};

/** A label on a drawn segment: the value when given, the symbol when found. */
function lab(from: Pt, to: Pt, sym: string, v: Val | null, given: boolean, u: Unit, inside = false) {
	const name = sym.replace('_1', '₁').replace('_2', '₂');
	return { from, to, text: given && v ? `${name} = ${labelText(v, u)}` : name, given, inside };
}

const HALF = q(1, 2);
const half = (v: Val) => mul(v, val(HALF));
const twice = (v: Val) => mul(v, int(2));

/** The names of the measures, for the rows. */
const AREA = 'Area';
const PERIMETER = 'Perimetro';

/** Adds a conclusion to the last step: "Base e altezza sono uguali: questo rettangolo è un quadrato." */
function conclude(steps: Step[], then: string) {
	const last = steps[steps.length - 1];
	last.then = last.then ? `${last.then} ${then}` : then;
}

/** The triangle inequality, written out: the two shorter sides added, then compared with the longest. */
function inequalityStep(sides: Val[]): Step {
	const [s0, s1, big] = [...sides].sort((x, y) => cmp(x, y));
	const sum = add(s0, s1);
	return {
		say: 'Controlla che i tre lati formino un triangolo.',
		math: [`${vt(s0)} + ${vt(s1)} = ${vt(sum)}`, `\\hl{${vt(big)} < ${vt(sum)}}`],
		then: 'Il lato più lungo è minore della somma degli altri due: il triangolo esiste.'
	};
}

// ---------------------------------------------------------------------------------------------------------------
// The figures.

function quadrato(mode: string, m: Measures, u: Unit): FigureResult {
	const two = int(2);
	let l: Val;
	const steps: Step[] = [];
	const given = { l: false, d: false };
	if (mode === 'diagonale') {
		const d = m.d!;
		given.d = true;
		l = div(d, sqrt(two));
		const A = div(square(d), two);
		const p = mul(int(4), l);
		steps.push(
			{ say: 'Ricava il lato: la diagonale è il lato moltiplicato per $\\sqrt{2}$.', math: calc('l = \\dfrac{d}{\\sqrt{2}}', ['\\dfrac{d\\sqrt{2}}{2}', `\\dfrac{${vt(d)}\\sqrt{2}}{2}`], l, u) },
			{ say: "Calcola l'area con la diagonale: il quadrato è anche un rombo.", math: calc('A = \\dfrac{d^2}{2}', [`\\dfrac{${sqt(d)}}{2}`, `\\dfrac{${vt(square(d))}}{2}`], A, u, 2) },
			{ say: 'Calcola il perimetro: i quattro lati sono uguali.', math: calc('2p = 4l', [`4 \\cdot ${vt(l)}`], p, u) }
		);
		return done(
			[
				['Lato', 'l', l, 1],
				[AREA, 'A', A, 2],
				[PERIMETER, '2p', p, 1]
			],
			u,
			steps,
			squareSketch(l, d, given, u)
		);
	}
	if (mode === 'area') {
		const A = m.A!;
		l = sqrt(A);
		steps.push({ say: "Ricava il lato: l'area è il lato per sé stesso, quindi fai la radice quadrata.", math: calc('l = \\sqrt{A}', rootSubs(A), l, u) });
	} else if (mode === 'perimetro') {
		const p = m['2p']!;
		l = div(p, int(4));
		steps.push({ say: 'Ricava il lato: dividi il perimetro per 4.', math: calc('l = \\dfrac{2p}{4}', [`\\dfrac{${vt(p)}}{4}`], l, u) });
	} else {
		l = m.l!;
		given.l = true;
	}
	const A = square(l);
	const p = mul(int(4), l);
	const d = mul(l, sqrt(two));
	if (mode !== 'perimetro') steps.push({ say: 'Calcola il perimetro: i quattro lati sono uguali.', math: calc('2p = 4l', [`4 \\cdot ${vt(l)}`], p, u) });
	if (mode !== 'area') steps.push({ say: "Calcola l'area: moltiplica il lato per sé stesso.", math: calc('A = l^2', [sqt(l)], A, u, 2) });
	steps.push({
		say: "Calcola la diagonale con Pitagora: è l'ipotenusa, e i cateti sono due lati.",
		math: calc('d = \\sqrt{l^2 + l^2}', pythagorasSubs(l, l, '+'), d, u),
		then: 'In ogni quadrato la diagonale è il lato moltiplicato per $\\sqrt{2}$.'
	});
	const items: Item[] = [];
	if (mode !== 'lato') items.push(['Lato', 'l', l, 1]);
	if (mode !== 'area') items.push([AREA, 'A', A, 2]);
	if (mode !== 'perimetro') items.push([PERIMETER, '2p', p, 1]);
	items.push(['Diagonale', 'd', d, 1]);
	const sketch = squareSketch(l, d, given, u);
	if (mode === 'area') sketch.caption = { text: `A = ${labelText(m.A!, u, 2)}`, given: true };
	if (mode === 'perimetro') sketch.caption = { text: `2p = ${labelText(m['2p']!, u)}`, given: true };
	return done(items, u, steps, sketch);
}

function squareSketch(l: Val, d: Val, given: { l: boolean; d: boolean }, u: Unit): Sketch {
	const s = l.x;
	return {
		outline: [
			[0, 0],
			[s, 0],
			[s, s],
			[0, s]
		],
		lines: [
			[
				[0, 0],
				[s, s]
			]
		],
		labels: [lab([0, 0], [s, 0], 'l', l, given.l, u), lab([0, 0], [s, s], 'd', d, given.d, u)],
		right: [
			[
				[0, 0],
				[1, 0],
				[0, 1]
			]
		]
	};
}

function rettangolo(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: Step[] = [];
	const b = m.b!;
	let h: Val;
	let d: Val | null = null;
	const given = { b: true, h: false, d: false };
	if (mode === 'diagonale') {
		d = m.d!;
		given.d = true;
		if (cmp(d, b) <= 0) return failed("La diagonale deve essere più lunga della base: è l'ipotenusa del triangolo che forma con base e altezza. Per esempio: base 12, diagonale 13.");
		h = sqrt(sub(square(d), square(b)));
		steps.push({ say: "Ricava l'altezza con Pitagora: la diagonale è l'ipotenusa, la base un cateto.", math: calc('h = \\sqrt{d^2 - b^2}', pythagorasSubs(d, b, '-'), h, u) });
	} else if (mode === 'area') {
		const A = m.A!;
		h = div(A, b);
		steps.push({ say: "Ricava l'altezza: dividi l'area per la base.", math: calc('h = \\dfrac{A}{b}', [`\\dfrac{${vt(A)}}{${vt(b)}}`], h, u) });
	} else if (mode === 'perimetro') {
		const p = m['2p']!;
		if (cmp(p, twice(b)) <= 0) return failed(`Il perimetro deve essere più del doppio della base (${plain(twice(b))}), altrimenti per l'altezza non resta niente. Per esempio: perimetro 34, base 12.`);
		const sp = half(p);
		h = sub(sp, b);
		steps.push(
			{ say: 'Dividi il perimetro per 2: ottieni il semiperimetro, cioè base più altezza.', math: calc('p = \\dfrac{2p}{2}', [`\\dfrac{${vt(p)}}{2}`], sp, u) },
			{ say: "Togli la base dal semiperimetro: resta l'altezza.", math: calc('h = p - b', [`${vt(sp)} - ${vt(b)}`], h, u) }
		);
	} else {
		h = m.h!;
		given.h = true;
	}
	const A = mul(b, h);
	const p = twice(add(b, h));
	if (mode !== 'area') steps.push({ say: "Calcola l'area: moltiplica la base per l'altezza.", math: calc('A = b \\cdot h', [`${vt(b)} \\cdot ${vt(h)}`], A, u, 2) });
	if (mode !== 'perimetro') steps.push({ say: "Calcola il perimetro: il doppio della somma di base e altezza.", math: calc('2p = 2(b + h)', [`2(${vt(b)} + ${vt(h)})`, `2 \\cdot ${vt(add(b, h))}`], p, u) });
	if (!d) {
		d = sqrt(add(square(b), square(h)));
		steps.push({ say: "Calcola la diagonale con Pitagora: è l'ipotenusa, base e altezza sono i cateti.", math: calc('d = \\sqrt{b^2 + h^2}', pythagorasSubs(b, h, '+'), d, u) });
	}
	if (cmp(b, h) === 0) conclude(steps, 'Base e altezza sono uguali: questo rettangolo è un quadrato.');
	const items: Item[] = [];
	if (mode !== 'lati') items.push(['Altezza', 'h', h, 1]);
	if (mode !== 'area') items.push([AREA, 'A', A, 2]);
	if (mode !== 'perimetro') items.push([PERIMETER, '2p', p, 1]);
	if (mode !== 'diagonale') items.push(['Diagonale', 'd', d, 1]);
	const [w, t] = [b.x, h.x];
	const sketch: Sketch = {
		outline: [
			[0, 0],
			[w, 0],
			[w, t],
			[0, t]
		],
		lines: [
			[
				[0, 0],
				[w, t]
			]
		],
		labels: [lab([0, 0], [w, 0], 'b', b, given.b, u), lab([w, 0], [w, t], 'h', h, given.h, u), lab([0, 0], [w, t], 'd', d, given.d, u)],
		right: [
			[
				[0, 0],
				[1, 0],
				[0, 1]
			]
		]
	};
	if (mode === 'area') sketch.caption = { text: `A = ${labelText(m.A!, u, 2)}`, given: true };
	if (mode === 'perimetro') sketch.caption = { text: `2p = ${labelText(m['2p']!, u)}`, given: true };
	return done(items, u, steps, sketch);
}

/** The triangle inequality, with a message naming the longest side when it fails. */
function triangleCheck(sides: Val[]): string | null {
	const sorted = [...sides].sort((x, y) => cmp(x, y));
	const [s1, s2, big] = sorted;
	const sum = add(s1, s2);
	const c = cmp(big, sum);
	if (c < 0) return null;
	const fix = 'Controlla i dati: per esempio 5, 6 e 7 formano un triangolo.';
	if (c === 0) return `Queste misure non formano un triangolo: il lato più lungo (${plain(big)}) è uguale alla somma degli altri due, e i tre vertici starebbero su una retta. ${fix}`;
	return `Queste misure non formano un triangolo: il lato più lungo (${plain(big)}) deve essere minore della somma degli altri due (${plain(s1)} + ${plain(s2)} = ${plain(sum)}). ${fix}`;
}

/** Apex of a triangle on the base from (0,0) to (a,0), with the other sides b (left) and c (right). */
function apex(a: number, b: number, c: number): Pt {
	const x = (a * a + b * b - c * c) / (2 * a);
	return [x, Math.sqrt(Math.max(b * b - x * x, 0))];
}

function triangolo(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: Step[] = [];
	if (mode === 'equilatero') {
		const l = m.l!;
		const h = half(mul(l, root(3)));
		const A = half(mul(l, h));
		const p = mul(int(3), l);
		steps.push(
			{ say: 'Calcola il perimetro: i tre lati sono uguali.', math: calc('2p = 3l', [`3 \\cdot ${vt(l)}`], p, u) },
			{
				say: "Calcola l'altezza con Pitagora: l'ipotenusa è un lato, un cateto è metà lato.",
				math: calc('h = \\sqrt{l^2 - \\left(\\dfrac{l}{2}\\right)^2}', ['\\sqrt{\\dfrac{3l^2}{4}}', '\\dfrac{l\\sqrt{3}}{2}', `\\dfrac{${vt(l)}\\sqrt{3}}{2}`], h, u)
			},
			{
				say: "Calcola l'area: base per altezza, diviso 2.",
				math: calc('A = \\dfrac{l \\cdot h}{2}', ['\\dfrac{l^2\\sqrt{3}}{4}', `\\dfrac{${sqt(l)}\\sqrt{3}}{4}`, `\\dfrac{${vt(square(l))}\\sqrt{3}}{4}`], A, u, 2)
			}
		);
		const s = l.x;
		const top: Pt = [s / 2, (s * Math.sqrt(3)) / 2];
		return done(
			[
				[AREA, 'A', A, 2],
				[PERIMETER, '2p', p, 1],
				['Altezza', 'h', h, 1]
			],
			u,
			steps,
			{
				outline: [[0, 0], [s, 0], top],
				lines: [[top, [s / 2, 0]]],
				labels: [lab([0, 0], [s, 0], 'l', l, true, u), lab(top, [s / 2, 0], 'h', h, false, u, true)],
				right: [[[s / 2, 0], [s, 0], top]]
			}
		);
	}
	if (mode === 'lati') {
		const [a, b, c] = [m.a!, m.b!, m.c!];
		const bad = triangleCheck([a, b, c]);
		if (bad) return failed(bad);
		const p2 = add(add(a, b), c);
		const p = half(p2);
		const [pa, pb, pc] = [sub(p, a), sub(p, b), sub(p, c)];
		const radicand = mul(mul(p, pa), mul(pb, pc));
		const A = sqrt(radicand);
		const diffRow = (name: string, side: Val, d: Val) => [`$p - ${name}$`, `$${vt(p)} - ${vt(side)}$`, `$${vt(d)}$`];
		steps.push(
			{ ...inequalityStep([a, b, c]), group: 'Il controllo dei lati' },
			{ group: 'Il perimetro', say: 'Somma i tre lati.', math: calc('2p = a + b + c', [`${vt(a)} + ${vt(b)} + ${vt(c)}`], p2, u) },
			{ say: 'Dividi il perimetro per 2: ottieni il semiperimetro $p$.', math: calc('p = \\dfrac{2p}{2}', [`\\dfrac{${vt(p2)}}{2}`], p, u) },
			{
				group: "L'area con la formula di Erone",
				say: 'Togli ogni lato dal semiperimetro.',
				table: { head: ['Differenza', 'Calcolo', 'Risultato'], rows: [diffRow('a', a, pa), diffRow('b', b, pb), diffRow('c', c, pc)] }
			},
			{
				say: 'Moltiplica il semiperimetro per le tre differenze, poi fai la radice quadrata.',
				math: calc('A = \\sqrt{p(p - a)(p - b)(p - c)}', [`\\sqrt{${vt(p)} \\cdot ${vt(pa)} \\cdot ${vt(pb)} \\cdot ${vt(pc)}}`, ...rootSubs(radicand)], A, u, 2)
			}
		);
		const [s0, s1, s2] = [a, b, c].sort((x, y) => cmp(x, y));
		const [q0, q1, q2] = [square(s0), square(s1), square(s2)];
		const legs = add(q0, q1);
		const angle = cmp(q2, legs);
		const equal = [cmp(a, b), cmp(b, c), cmp(a, c)].filter((x) => x === 0).length;
		const kind = equal === 3 ? 'I tre lati sono uguali: il triangolo è equilatero.' : equal === 1 ? 'Due lati sono uguali: il triangolo è isoscele.' : 'I tre lati sono diversi: il triangolo è scaleno.';
		const angleText =
			angle === 0 ? 'Sono uguali: il triangolo è rettangolo.' : angle < 0 ? `$${vt(q2)} < ${vt(legs)}$: il triangolo è acutangolo.` : `$${vt(q2)} > ${vt(legs)}$: il triangolo è ottusangolo.`;
		steps.push({
			group: 'Che triangolo è',
			say: 'Confronta il quadrato del lato più lungo con la somma dei quadrati degli altri.',
			math: [`${sqt(s0)} + ${sqt(s1)} = ${vt(q0)} + ${vt(q1)} = ${vt(legs)}`, `${sqt(s2)} = ${vt(q2)}`],
			then: `${angleText} ${kind}`
		});
		if (angle === 0) steps.push({ say: "Controlla l'area con i cateti: è metà del loro prodotto.", math: calc('A = \\dfrac{c_1 \\cdot c_2}{2}', [`\\dfrac{${vt(s0)} \\cdot ${vt(s1)}}{2}`, `\\dfrac{${vt(mul(s0, s1))}}{2}`], half(mul(s0, s1)), u, 2) });
		const top = apex(a.x, b.x, c.x);
		return done(
			[
				[AREA, 'A', A, 2],
				[PERIMETER, '2p', p2, 1]
			],
			u,
			steps,
			{
				outline: [[0, 0], [a.x, 0], top],
				lines: [],
				labels: [lab([0, 0], [a.x, 0], 'a', a, true, u), lab([0, 0], top, 'b', b, true, u), lab([a.x, 0], top, 'c', c, true, u)],
				right: []
			}
		);
	}
	// Base and height, and the other two sides when known.
	const [b, h, l1, l2] = [m.b!, m.h!, m.l_1, m.l_2];
	const A = half(mul(b, h));
	steps.push({ say: "Calcola l'area: moltiplica la base per l'altezza e dividi per 2.", math: calc('A = \\dfrac{b \\cdot h}{2}', [`\\dfrac{${vt(b)} \\cdot ${vt(h)}}{2}`, `\\dfrac{${vt(mul(b, h))}}{2}`], A, u, 2) });
	if (!l1 !== !l2) return failed('Per il perimetro servono tutti e due gli altri lati: scrivili entrambi, oppure lasciali vuoti.');
	let top: Pt = [b.x * 0.35, h.x];
	const items: Item[] = [[AREA, 'A', A, 2]];
	const labels = [lab([0, 0], [b.x, 0], 'b', b, true, u)];
	if (l1 && l2) {
		const bad = triangleCheck([b, l1, l2]);
		if (bad) return failed(bad);
		if (cmp(l1, h) < 0 || cmp(l2, h) < 0) return failed("Un lato non può essere più corto dell'altezza: l'altezza è la distanza del vertice dalla base, e ogni lato che parte dal vertice è lungo almeno quanto lei. Per esempio: base 14, altezza 12, lati 13 e 15.");
		const p = add(add(b, l1), l2);
		steps.push(inequalityStep([b, l1, l2]), { say: 'Calcola il perimetro: somma i tre lati.', math: calc('2p = b + l_1 + l_2', [`${vt(b)} + ${vt(l1)} + ${vt(l2)}`], p, u) });
		items.push([PERIMETER, '2p', p, 1]);
		// Draw with the sides; the height drawn is the one they give.
		const t = apex(b.x, l1.x, l2.x);
		top = [t[0], t[1]];
		labels.push(lab([0, 0], top, 'l_1', l1, true, u), lab([b.x, 0], top, 'l_2', l2, true, u));
		// The height the three sides give, to warn about data that do not agree.
		const s = (b.x + l1.x + l2.x) / 2;
		const hSides = (2 * Math.sqrt(Math.max(s * (s - b.x) * (s - l1.x) * (s - l2.x), 0))) / b.x;
		if (Math.abs(hSides - h.x) > 1e-6 * Math.max(1, h.x))
			steps.push({
				say: "Attenzione: con questi tre lati l'altezza viene diversa.",
				math: [`h \\approx ${rounded(hSides).tex}${unitTex(u, 1)}`],
				then: `Il problema dà $h = ${vt(h)}${unitTex(u, 1)}$: controlla i dati.`
			});
	} else {
		steps.push({ say: 'Per il perimetro servono anche gli altri due lati.', then: 'Scrivili nei campi $l_1$ e $l_2$, se li conosci.' });
	}
	const foot: Pt = [top[0], 0];
	const lines: [Pt, Pt][] = [[top, foot]];
	if (foot[0] < 0) lines.push([foot, [0, 0]]);
	if (foot[0] > b.x) lines.push([[b.x, 0], foot]);
	labels.push(lab(top, foot, 'h', h, true, u, foot[0] >= 0 && foot[0] <= b.x));
	return done(items, u, steps, {
		outline: [[0, 0], [b.x, 0], top],
		lines,
		labels,
		right: [[foot, [foot[0] + (foot[0] > b.x / 2 ? -1 : 1), 0], top]]
	});
}

function trapezio(mode: string, m: Measures, u: Unit): FigureResult {
	const [B, b, h] = [m.B!, m.b!, m.h!];
	if (cmp(B, b) <= 0) return failed(cmp(B, b) === 0 ? 'Con le basi uguali la figura è un parallelogramma, non un trapezio: usa il calcolatore del parallelogramma.' : 'La base maggiore deve essere più lunga della base minore: scambiale.');
	const steps: Step[] = [];
	const sum = add(B, b);
	const A = half(mul(sum, h));
	const areaStep: Step = {
		say: "Calcola l'area: somma le basi, moltiplica per l'altezza e dividi per 2.",
		math: calc('A = \\dfrac{(B + b) \\cdot h}{2}', [`\\dfrac{(${vt(B)} + ${vt(b)}) \\cdot ${vt(h)}}{2}`, `\\dfrac{${vt(sum)} \\cdot ${vt(h)}}{2}`, `\\dfrac{${vt(mul(sum, h))}}{2}`], A, u, 2)
	};
	const diff = sub(B, b);
	let left: number;
	const labels = [lab([0, 0], [B.x, 0], 'B', B, true, u)];
	const items: Item[] = [[AREA, 'A', A, 2]];
	const right: [Pt, Pt, Pt][] = [];
	if (mode === 'isoscele') {
		const proj = half(diff);
		const l = sqrt(add(square(h), square(proj)));
		const p = add(sum, twice(l));
		steps.push(
			{ say: 'Calcola $x$, il pezzo che ogni altezza stacca sulla base maggiore.', math: calc('x = \\dfrac{B - b}{2}', [`\\dfrac{${vt(B)} - ${vt(b)}}{2}`, `\\dfrac{${vt(diff)}}{2}`], proj, u) },
			{ say: 'Calcola il lato obliquo con Pitagora: i cateti sono $h$ e $x$.', math: calc('l = \\sqrt{h^2 + x^2}', pythagorasSubs(h, proj, '+'), l, u) },
			areaStep,
			{ say: 'Calcola il perimetro: le due basi e due volte il lato obliquo.', math: calc('2p = B + b + 2l', [`${vt(B)} + ${vt(b)} + 2 \\cdot ${vt(l)}`, `${vt(sum)} + ${vt(twice(l))}`], p, u) }
		);
		items.push([PERIMETER, '2p', p, 1], ['Lato obliquo', 'l', l, 1]);
		left = proj.x;
		labels.push(lab([B.x, 0], [left + b.x, h.x], 'l', l, false, u));
	} else if (mode === 'rettangolo') {
		const l = sqrt(add(square(h), square(diff)));
		const p = add(add(sum, h), l);
		steps.push(
			{ say: "Calcola $x$, il pezzo che l'altezza stacca sulla base maggiore.", math: calc('x = B - b', [`${vt(B)} - ${vt(b)}`], diff, u), then: "L'altro lato è perpendicolare alle basi: è l'altezza." },
			{ say: 'Calcola il lato obliquo con Pitagora: i cateti sono $h$ e $x$.', math: calc('l = \\sqrt{h^2 + x^2}', pythagorasSubs(h, diff, '+'), l, u) },
			areaStep,
			{ say: "Calcola il perimetro: le due basi, l'altezza e il lato obliquo.", math: calc('2p = B + b + h + l', [`${vt(B)} + ${vt(b)} + ${vt(h)} + ${vt(l)}`], p, u) }
		);
		items.push([PERIMETER, '2p', p, 1], ['Lato obliquo', 'l', l, 1]);
		left = 0;
		labels.push(lab([B.x, 0], [b.x, h.x], 'l', l, false, u));
		right.push([[0, 0], [1, 0], [0, 1]]);
	} else {
		const [l1, l2] = [m.l_1, m.l_2];
		steps.push(areaStep);
		if (!l1 !== !l2) return failed('Per il perimetro servono tutti e due i lati obliqui: scrivili entrambi, oppure lasciali vuoti.');
		if (l1 && l2) {
			if (cmp(l1, h) < 0 || cmp(l2, h) < 0) return failed("Un lato obliquo non può essere più corto dell'altezza: l'altezza è la distanza tra le due basi. Per esempio: altezza 12, lati obliqui 13 e 15.");
			const p = add(sum, add(l1, l2));
			steps.push({ say: 'Calcola il perimetro: somma i quattro lati.', math: calc('2p = B + b + l_1 + l_2', [`${vt(B)} + ${vt(b)} + ${vt(l1)} + ${vt(l2)}`], p, u) });
			items.push([PERIMETER, '2p', p, 1]);
			const p1 = Math.sqrt(Math.max(l1.x ** 2 - h.x ** 2, 0));
			const p2 = Math.sqrt(Math.max(l2.x ** 2 - h.x ** 2, 0));
			// The oblique sides agree with the bases when their projections add up to B - b.
			if (Math.abs(p1 + p2 - diff.x) > 1e-6 * Math.max(1, diff.x) && Math.abs(Math.abs(p1 - p2) - diff.x) > 1e-6 * Math.max(1, diff.x))
				steps.push({
					say: "Attenzione: i lati obliqui non vanno d'accordo con le basi.",
					table: {
						head: ['Proiezione', 'Misura'],
						rows: [
							['di $l_1$', `$\\approx ${rounded(p1).tex}$`],
							['di $l_2$', `$\\approx ${rounded(p2).tex}$`],
							['somma attesa, $B - b$', `$${vt(diff)}$`]
						]
					},
					then: 'Le due proiezioni dovrebbero sommarsi a $B - b$: controlla i dati.'
				});
			left = p1 + p2 > 0 ? (p1 / (p1 + p2)) * diff.x : diff.x / 2;
			labels.push(lab([0, 0], [left, h.x], 'l_1', l1, true, u), lab([B.x, 0], [left + b.x, h.x], 'l_2', l2, true, u));
		} else {
			steps.push({ say: 'Per il perimetro servono anche i lati obliqui.', then: 'Scrivili, se li conosci, oppure scegli il trapezio isoscele o rettangolo.' });
			left = diff.x * 0.3;
		}
	}
	labels.push(lab([left, h.x], [left + b.x, h.x], 'b', b, true, u));
	const foot: Pt = [left + b.x, 0];
	const hx = mode === 'rettangolo' ? 0 : left + b.x;
	labels.push(lab([hx, h.x], [hx, 0], 'h', h, true, u, mode !== 'rettangolo'));
	if (mode !== 'rettangolo') right.push([foot, [foot[0] - 1, 0], [foot[0], 1]]);
	return done(items, u, steps, {
		outline: [[0, 0], [B.x, 0], [left + b.x, h.x], [left, h.x]],
		lines: mode === 'rettangolo' ? [] : [[[hx, h.x], [hx, 0]]],
		labels,
		right
	});
}

function rombo(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: Step[] = [];
	const l0 = m.l ?? null;
	let d1: Val;
	let d2: Val;
	let l: Val;
	const given = { d1: false, d2: false, l: false };
	const perimeter = (side: Val, p: Val): Step => ({ say: 'Calcola il perimetro: i quattro lati sono uguali.', math: calc('2p = 4l', [`4 \\cdot ${vt(side)}`], p, u) });
	if (mode === 'lato-altezza') {
		l = l0!;
		const h = m.h!;
		if (cmp(h, l) > 0) return failed("L'altezza non può superare il lato: è la distanza tra due lati paralleli, e il lato è obliquo. Per esempio: lato 10, altezza 8.");
		const A = mul(l, h);
		const p = mul(int(4), l);
		steps.push({ say: "Calcola l'area: il rombo è un parallelogramma, quindi lato per altezza.", math: calc('A = l \\cdot h', [`${vt(l)} \\cdot ${vt(h)}`], A, u, 2) }, perimeter(l, p));
		if (cmp(h, l) === 0) conclude(steps, "L'altezza è uguale al lato: questo rombo è un quadrato.");
		// Diagonals for the drawing: D² + d² = 4l², D·d = 2lh.
		const s = Math.sqrt(4 * l.x ** 2 + 4 * l.x * h.x);
		const t = Math.sqrt(Math.max(4 * l.x ** 2 - 4 * l.x * h.x, 0));
		const [D, d] = [(s + t) / 2, (s - t) / 2];
		return done(
			[
				[AREA, 'A', A, 2],
				[PERIMETER, '2p', p, 1]
			],
			u,
			steps,
			{
				outline: [[-D / 2, 0], [0, -d / 2], [D / 2, 0], [0, d / 2]],
				lines: [],
				labels: [lab([D / 2, 0], [0, d / 2], 'l', l, true, u)],
				right: [],
				caption: { text: `h = ${labelText(h, u)}`, given: true }
			}
		);
	}
	if (mode === 'lato-diagonale') {
		l = l0!;
		d1 = m.d_1!;
		given.l = given.d1 = true;
		if (cmp(d1, twice(l)) >= 0) return failed(`La diagonale deve essere minore del doppio del lato (${plain(twice(l))}): metà diagonale e lato formano un triangolo rettangolo in cui il lato è l'ipotenusa. Per esempio: lato 13, diagonale 10.`);
		const hd = half(d1);
		const ho = sqrt(sub(square(l), square(hd)));
		d2 = twice(ho);
		steps.push(
			{ say: 'Dividi per 2 la diagonale nota: le diagonali si tagliano a metà.', math: calc('\\dfrac{d_1}{2}', [`\\dfrac{${vt(d1)}}{2}`], hd, u) },
			{ say: "Trova metà dell'altra diagonale con Pitagora: il lato è l'ipotenusa.", math: calc('\\dfrac{d_2}{2} = \\sqrt{l^2 - \\left(\\dfrac{d_1}{2}\\right)^2}', pythagorasSubs(l, hd, '-'), ho, u) },
			{ say: 'Raddoppiala: ottieni la seconda diagonale.', math: calc('d_2 = 2 \\cdot \\dfrac{d_2}{2}', [`2 \\cdot ${vt(ho)}`], d2, u) }
		);
	} else {
		d1 = m.d_1!;
		d2 = m.d_2!;
		given.d1 = given.d2 = true;
		const [h1, h2] = [half(d1), half(d2)];
		l = sqrt(add(square(h1), square(h2)));
		steps.push(
			{
				say: 'Dividi per 2 le due diagonali: si tagliano a metà.',
				math: [`\\dfrac{d_1}{2} = \\dfrac{${vt(d1)}}{2} = \\hl{${vt(h1)}}`, `\\dfrac{d_2}{2} = \\dfrac{${vt(d2)}}{2} = \\hl{${vt(h2)}}`]
			},
			{ say: 'Calcola il lato con Pitagora: i cateti sono le metà delle diagonali.', math: calc('l = \\sqrt{\\left(\\dfrac{d_1}{2}\\right)^2 + \\left(\\dfrac{d_2}{2}\\right)^2}', pythagorasSubs(h1, h2, '+'), l, u) }
		);
	}
	const A = half(mul(d1, d2));
	const p = mul(int(4), l);
	steps.push({ say: "Calcola l'area: moltiplica le diagonali e dividi per 2.", math: calc('A = \\dfrac{d_1 \\cdot d_2}{2}', [`\\dfrac{${vt(d1)} \\cdot ${vt(d2)}}{2}`, `\\dfrac{${vt(mul(d1, d2))}}{2}`], A, u, 2) }, perimeter(l, p));
	if (cmp(d1, d2) === 0) conclude(steps, 'Le diagonali sono uguali: questo rombo è un quadrato.');
	const items: Item[] = [
		[AREA, 'A', A, 2],
		[PERIMETER, '2p', p, 1],
		mode === 'diagonali' ? ['Lato', 'l', l, 1] : ['Seconda diagonale', 'd_2', d2, 1]
	];
	// The longer diagonal lies flat, so each label has room along its half.
	const flat = d1.x >= d2.x;
	const [X, Y] = flat ? [d1.x / 2, d2.x / 2] : [d2.x / 2, d1.x / 2];
	const [hName, hVal, hGiven, vName, vVal, vGiven] = flat ? (['d_1', d1, given.d1, 'd_2', d2, given.d2] as const) : (['d_2', d2, given.d2, 'd_1', d1, given.d1] as const);
	return done(items, u, steps, {
		outline: [[-X, 0], [0, -Y], [X, 0], [0, Y]],
		lines: [
			[[-X, 0], [X, 0]],
			[[0, -Y], [0, Y]]
		],
		labels: [lab([-X, 0], [0, 0], hName, hVal, hGiven, u), lab([0, -Y], [0, 0], vName, vVal, vGiven, u), lab([X, 0], [0, Y], 'l', l, given.l, u)],
		right: [[[0, 0], [1, 0], [0, 1]]]
	});
}

function parallelogramma(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: Step[] = [];
	const b = m.b!;
	const l = m.l;
	let h: Val;
	let A: Val;
	if (mode === 'area') {
		A = m.A!;
		h = div(A, b);
		steps.push({ say: "Ricava l'altezza: dividi l'area per la base.", math: calc('h = \\dfrac{A}{b}', [`\\dfrac{${vt(A)}}{${vt(b)}}`], h, u) });
	} else {
		h = m.h!;
		A = mul(b, h);
		steps.push({ say: "Calcola l'area: base per altezza, come nel rettangolo.", math: calc('A = b \\cdot h', [`${vt(b)} \\cdot ${vt(h)}`], A, u, 2) });
	}
	const items: Item[] = mode === 'area' ? [['Altezza', 'h', h, 1]] : [[AREA, 'A', A, 2]];
	let shift = h.x * 0.5;
	const labels = [lab([0, 0], [b.x, 0], 'b', b, true, u)];
	if (l) {
		if (cmp(l, h) < 0) return failed("Il lato obliquo non può essere più corto dell'altezza: l'altezza è la distanza tra le due basi. Per esempio: altezza 4, lato obliquo 5.");
		const p = twice(add(b, l));
		const h2 = div(A, l);
		steps.push(
			{ say: 'Calcola il perimetro: i lati opposti sono uguali.', math: calc('2p = 2(b + l)', [`2(${vt(b)} + ${vt(l)})`, `2 \\cdot ${vt(add(b, l))}`], p, u) },
			{ say: "Trova l'altezza relativa al lato obliquo: dividi l'area per quel lato.", math: calc('h_l = \\dfrac{A}{l}', [`\\dfrac{${vt(A)}}{${vt(l)}}`], h2, u) }
		);
		if (cmp(l, h) === 0) conclude(steps, "Il lato obliquo è uguale all'altezza, quindi è perpendicolare alla base: questo parallelogramma è un rettangolo.");
		items.push([PERIMETER, '2p', p, 1]);
		shift = Math.sqrt(Math.max(l.x ** 2 - h.x ** 2, 0));
		labels.push(lab([0, 0], [shift, h.x], 'l', l, true, u));
	} else {
		steps.push({ say: 'Per il perimetro serve anche il lato obliquo.', then: 'Scrivilo nel campo del lato obliquo, se lo conosci.' });
	}
	labels.push(lab([shift, h.x], [shift, 0], 'h', h, mode !== 'area', u, shift > 0));
	return done(items, u, steps, {
		outline: [[0, 0], [b.x, 0], [b.x + shift, h.x], [shift, h.x]],
		lines: shift > 0 ? [[[shift, h.x], [shift, 0]]] : [],
		labels,
		right: shift > 0 ? [[[shift, 0], [shift + 1, 0], [shift, 1]]] : [[[0, 0], [1, 0], [0, 1]]],
		caption: mode === 'area' ? { text: `A = ${labelText(A, u, 2)}`, given: true } : undefined
	});
}

function cerchio(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: Step[] = [];
	let r: Val;
	if (mode === 'diametro') {
		const d = m.d!;
		r = half(d);
		steps.push({ say: 'Calcola il raggio: è metà del diametro.', math: calc('r = \\dfrac{d}{2}', [`\\dfrac{${vt(d)}}{2}`], r, u) });
	} else if (mode === 'circonferenza') {
		const C = m.C!;
		r = div(C, mul(int(2), PI));
		steps.push({ say: 'Ricava il raggio: dividi la circonferenza per $2\\pi$.', math: calc('r = \\dfrac{C}{2\\pi}', [`\\dfrac{${vt(C)}}{2\\pi}`], r, u) });
	} else if (mode === 'area') {
		const A = m.A!;
		const ratio = div(A, PI);
		r = sqrt(ratio);
		steps.push({ say: "Ricava il raggio: dividi l'area per $\\pi$, poi fai la radice quadrata.", math: calc('r = \\sqrt{\\dfrac{A}{\\pi}}', [`\\sqrt{\\dfrac{${vt(A)}}{\\pi}}`, ...(isRational(ratio) ? rootSubs(ratio) : [])], r, u) });
	} else {
		r = m.r!;
	}
	const d = twice(r);
	const C = mul(mul(int(2), PI), r);
	const A = mul(PI, square(r));
	// A radius known only as a decimal is written as the root it comes from.
	const rSub = r.c ? vt(r) : `\\sqrt{\\dfrac{${vt(m.A!)}}{\\pi}}`;
	if (mode !== 'diametro') steps.push({ say: 'Calcola il diametro: è il doppio del raggio.', math: calc('d = 2r', [`2 \\cdot ${rSub}`], d, u) });
	if (mode !== 'circonferenza') {
		const subs = mode === 'area' && !r.c ? ['2\\sqrt{\\pi A}', `2\\sqrt{${vt(m.A!)}\\pi}`] : [`2\\pi \\cdot ${vt(r)}`];
		steps.push({ say: 'Calcola la lunghezza della circonferenza.', math: calc('C = 2\\pi r', subs, C, u) });
	}
	if (mode !== 'area') steps.push({ say: "Calcola l'area del cerchio.", math: calc('A = \\pi r^2', [`\\pi \\cdot ${sqt(r)}`, `\\pi \\cdot ${vt(square(r))}`], A, u, 2) });
	if (mode === 'raggio' || mode === 'diametro') conclude(steps, "Per il decimale si usa $\\pi \\approx 3{,}1416$. Con $3{,}14$ l'ultima cifra può cambiare di poco.");
	const all: Record<string, Item> = { r: ['Raggio', 'r', r, 1], d: ['Diametro', 'd', d, 1], C: ['Circonferenza', 'C', C, 1], A: [AREA, 'A', A, 2] };
	const order = mode === 'raggio' ? ['C', 'A', 'd'] : mode === 'diametro' ? ['r', 'C', 'A'] : mode === 'circonferenza' ? ['r', 'd', 'A'] : ['r', 'd', 'C'];
	const R = r.x;
	const sketch: Sketch = {
		outline: { circle: R },
		lines: mode === 'diametro' ? [[[-R, 0], [R, 0]]] : [[[0, 0], [R * Math.SQRT1_2, R * Math.SQRT1_2]]],
		labels: mode === 'diametro' ? [lab([-R, 0], [R, 0], 'd', d, true, u)] : [lab([0, 0], [R * Math.SQRT1_2, R * Math.SQRT1_2], 'r', r, mode === 'raggio', u)],
		right: []
	};
	if (mode === 'circonferenza') sketch.caption = { text: `C = ${labelText(m.C!, u)}`, given: true };
	if (mode === 'area') sketch.caption = { text: `A = ${labelText(m.A!, u, 2)}`, given: true };
	return done(
		order.map((k) => all[k]),
		u,
		steps,
		sketch
	);
}

const SOLVERS: Record<Figure, (mode: string, m: Measures, u: Unit) => FigureResult> = { quadrato, rettangolo, triangolo, trapezio, rombo, parallelogramma, cerchio };

/** Area, perimeter and the other measures of a figure, from the inputs of one of its modes. */
export function figura(figure: Figure, mode: string, values: Partial<Record<FieldKey, string>>, unit: Unit = ''): FigureResult {
	const spec = FIGURES[figure].modes.find((x) => x.value === mode) ?? FIGURES[figure].modes[0];
	const m = readAll(spec, values);
	if (typeof m === 'string') return failed(m);
	try {
		return SOLVERS[figure](spec.value, m, unit);
	} catch {
		return failed("Questi numeri sono troppo grandi per un calcolo esatto: prova con misure più piccole, per esempio in un'unità più grande.");
	}
}
