import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
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
/** Decimals shown for a rounded value. */
export const DIGITS = 4;

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

/** A decimal rounded to DIGITS, as TeX and text, without "≈". */
function rounded(x: number): { tex: string; text: string } {
	const n = Math.round(x * 10 ** DIGITS);
	if (Number.isSafeInteger(n)) {
		const d = decimal(Rational.of(n, 10 ** DIGITS), DIGITS);
		return { tex: d.tex, text: d.text };
	}
	// Beyond the safe integers (an intermediate product, never an input): the whole part is enough.
	const whole = BigInt(Math.round(x)).toString();
	return { tex: whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'), text: whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') };
}

/** The exact form: "5\sqrt{2}", "\dfrac{5\sqrt{2}}{2}", "12{,}5\pi", "\dfrac{15}{2\pi}", "\dfrac{10}{3}". */
function exactForm(v: Val & { c: Rational }): { tex: string; text: string; terminating: boolean } {
	const c = v.c;
	const sign = c.num < 0 ? '-' : '';
	const p = Math.abs(c.num);
	const d = decimal(c, DIGITS);
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
	if (v.r === 1 && v.pi < 0 && d.exact) return { tex: `${sign}\\dfrac{${decimal(c.abs(), DIGITS).tex}}{${piTex(-v.pi)}}`, text: `${sign}${decimal(c.abs(), DIGITS).text}/${piText(-v.pi)}`, terminating: false };
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
	const t = s.exact && s.exact.text.length <= 8 ? s.exact.text : s.approx ? `${decimal(Rational.of(Math.round(v.x * 100), 100), 2).text}` : s.exact!.text;
	return `${t}${unitText(u, dim)}`;
}

const andList = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`);

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
	if (!t) return f.optional ? null : `Scrivi ${f.the}.`;
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
	if (r.sign() <= 0) return `${cap(f.the)} deve essere maggiore di zero.`;
	if (r.compare(q(MAX)) > 0) return 'Usa misure fino a 100 000.';
	if (r.den > 10 ** DIGITS) return 'Usa al massimo quattro cifre decimali.';
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

/** The result line and the copy text from the measures found. */
function answer(items: [string, Val, 1 | 2][], u: Unit): { result: string; copy: string } {
	return {
		result: andList(items.map(([sym, v, dim]) => `$${sym}${eq(v, u, dim)}$`)),
		copy: items
			.map(([sym, v, dim]) => {
				const t = valueText(v, u, dim);
				return `${sym.replace(/_(\d)/, '$1')} ${t.startsWith('≈') ? '' : '= '}${t}`;
			})
			.join('; ')
	};
}

const done = (items: [string, Val, 1 | 2][], u: Unit, steps: string[], sketch: Sketch | null): FigureResult => ({
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

/** "\sqrt{50} = 5\sqrt{2} \approx 7{,}0711": the root of a value, with the simplification when there is one. */
function rootChain(radicand: Val, u: Unit, dim: 1 | 2 = 1): string {
	const r = sqrt(radicand);
	const t = vt(radicand);
	const s = shown(r);
	// \sqrt{25} = 5, \sqrt{50} = 5\sqrt{2}: say it only when the root changed shape.
	if (s.exact && s.exact.tex === `\\sqrt{${t}}`) return `\\sqrt{${t}}${s.approx ? ` \\approx ${s.approx.tex}${unitTex(u, dim)}` : ''}`;
	return `\\sqrt{${t}}${eq(r, u, dim)}`;
}

// ---------------------------------------------------------------------------------------------------------------
// The figures.

function quadrato(mode: string, m: Measures, u: Unit): FigureResult {
	const two = int(2);
	let l: Val;
	const steps: string[] = [];
	const given = { l: false, d: false };
	if (mode === 'diagonale') {
		const d = m.d!;
		given.d = true;
		l = div(d, sqrt(two));
		const A = div(square(d), two);
		const p = mul(int(4), l);
		steps.push(
			`La diagonale divide il quadrato in due triangoli rettangoli isosceli, quindi $d = l\\sqrt{2}$. Ricava il lato: $l = \\dfrac{d}{\\sqrt{2}} = \\dfrac{d\\sqrt{2}}{2} = \\dfrac{${vt(d)}\\sqrt{2}}{2}${eq(l, u)}$.`,
			`Calcola l'area: il quadrato è anche un rombo, quindi $A = \\dfrac{d^2}{2} = \\dfrac{${sqt(d)}}{2}${eq(A, u, 2)}$.`,
			`Calcola il perimetro: $2p = 4l = 4 \\cdot ${vt(l)}${eq(p, u)}$.`
		);
		return done([['l', l, 1], ['A', A, 2], ['2p', p, 1]], u, steps, squareSketch(l, d, given, u));
	}
	if (mode === 'area') {
		const A = m.A!;
		l = sqrt(A);
		steps.push(`L'area del quadrato è $A = l^2$: ricava il lato con la radice quadrata, $l = \\sqrt{A} = ${rootChain(A, u)}$.`);
	} else if (mode === 'perimetro') {
		const p = m['2p']!;
		l = div(p, int(4));
		steps.push(`I quattro lati sono uguali: dividi il perimetro per 4, $l = \\dfrac{2p}{4} = \\dfrac{${vt(p)}}{4}${eq(l, u)}$.`);
	} else {
		l = m.l!;
		given.l = true;
	}
	const A = square(l);
	const p = mul(int(4), l);
	const d = mul(l, sqrt(two));
	if (mode !== 'perimetro') steps.push(`Calcola il perimetro: i quattro lati sono uguali, quindi $2p = 4l = 4 \\cdot ${vt(l)}${eq(p, u)}$.`);
	if (mode !== 'area') steps.push(`Calcola l'area moltiplicando il lato per sé stesso: $A = l^2 = ${sqt(l)}${eq(A, u, 2)}$.`);
	const dSub = isRational(l) ? `${vt(l)}\\sqrt{2}` : `${vt(l)} \\cdot \\sqrt{2}`;
	steps.push(`Trova la diagonale con il teorema di Pitagora: è l'ipotenusa di un triangolo rettangolo che ha per cateti due lati, quindi $d = \\sqrt{l^2 + l^2} = l\\sqrt{2}${shown(d).exact?.tex === dSub ? '' : ` = ${dSub}`}${eq(d, u)}$.`);
	const items: [string, Val, 1 | 2][] = mode === 'lato' ? [['A', A, 2], ['2p', p, 1], ['d', d, 1]] : mode === 'area' ? [['l', l, 1], ['2p', p, 1], ['d', d, 1]] : [['l', l, 1], ['A', A, 2], ['d', d, 1]];
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
	const steps: string[] = [];
	const b = m.b!;
	let h: Val;
	let d: Val | null = null;
	const given = { b: true, h: false, d: false };
	if (mode === 'diagonale') {
		d = m.d!;
		given.d = true;
		if (cmp(d, b) <= 0) return failed('La diagonale è l\'ipotenusa del triangolo che forma con base e altezza: deve essere più lunga della base.');
		h = sqrt(sub(square(d), square(b)));
		steps.push(`Base, altezza e diagonale formano un triangolo rettangolo in cui la diagonale è l'ipotenusa. Ricava l'altezza con il teorema di Pitagora: $h = \\sqrt{d^2 - b^2} = \\sqrt{${sqt(d)} - ${sqt(b)}} = ${rootChain(sub(square(d), square(b)), u)}$.`);
	} else if (mode === 'area') {
		const A = m.A!;
		h = div(A, b);
		steps.push(`L'area è base per altezza, quindi l'altezza è l'area divisa per la base: $h = \\dfrac{A}{b} = \\dfrac{${vt(A)}}{${vt(b)}}${eq(h, u)}$.`);
	} else if (mode === 'perimetro') {
		const p = m['2p']!;
		if (cmp(p, twice(b)) <= 0) return failed(`Il perimetro deve essere più del doppio della base (${plain(twice(b))}): altrimenti per l'altezza non resta niente.`);
		const sp = half(p);
		h = sub(sp, b);
		steps.push(`Il semiperimetro è la somma di base e altezza: $p = \\dfrac{2p}{2} = \\dfrac{${vt(p)}}{2}${eq(sp, u)}$.`, `Togli la base dal semiperimetro: $h = p - b = ${vt(sp)} - ${vt(b)}${eq(h, u)}$.`);
	} else {
		h = m.h!;
		given.h = true;
	}
	const A = mul(b, h);
	const p = twice(add(b, h));
	if (mode !== 'area') steps.push(`Calcola l'area: $A = b \\cdot h = ${vt(b)} \\cdot ${vt(h)}${eq(A, u, 2)}$.`);
	if (mode !== 'perimetro') steps.push(`Calcola il perimetro, il doppio della somma di base e altezza: $2p = 2(b + h) = 2(${vt(b)} + ${vt(h)})${eq(p, u)}$.`);
	if (!d) {
		d = sqrt(add(square(b), square(h)));
		steps.push(`Trova la diagonale con il teorema di Pitagora: $d = \\sqrt{b^2 + h^2} = \\sqrt{${sqt(b)} + ${sqt(h)}} = ${rootChain(add(square(b), square(h)), u)}$.`);
	}
	if (cmp(b, h) === 0) steps.push('Base e altezza sono uguali: questo rettangolo è un quadrato.');
	const items: [string, Val, 1 | 2][] = mode === 'lati' ? [['A', A, 2], ['2p', p, 1], ['d', d, 1]] : mode === 'area' ? [['h', h, 1], ['2p', p, 1], ['d', d, 1]] : mode === 'perimetro' ? [['h', h, 1], ['A', A, 2], ['d', d, 1]] : [['h', h, 1], ['A', A, 2], ['2p', p, 1]];
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
	if (c === 0) return `Queste misure non formano un triangolo: il lato più lungo (${plain(big)}) è uguale alla somma degli altri due, e i tre vertici starebbero su una retta.`;
	return `Queste misure non formano un triangolo: il lato più lungo (${plain(big)}) deve essere minore della somma degli altri due (${plain(s1)} + ${plain(s2)} = ${plain(sum)}).`;
}

/** Apex of a triangle on the base from (0,0) to (a,0), with the other sides b (left) and c (right). */
function apex(a: number, b: number, c: number): Pt {
	const x = (a * a + b * b - c * c) / (2 * a);
	return [x, Math.sqrt(Math.max(b * b - x * x, 0))];
}

function triangolo(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: string[] = [];
	if (mode === 'equilatero') {
		const l = m.l!;
		const h = half(mul(l, root(3)));
		const A = half(mul(l, h));
		const p = mul(int(3), l);
		steps.push(
			`Calcola il perimetro: i tre lati sono uguali, $2p = 3l = 3 \\cdot ${vt(l)}${eq(p, u)}$.`,
			`L'altezza divide il triangolo in due triangoli rettangoli con ipotenusa $l$ e cateto $\\dfrac{l}{2}$. Con il teorema di Pitagora: $h = \\sqrt{l^2 - \\left(\\dfrac{l}{2}\\right)^2} = \\dfrac{l\\sqrt{3}}{2} = \\dfrac{${vt(l)}\\sqrt{3}}{2}${eq(h, u)}$.`,
			`Calcola l'area: $A = \\dfrac{l \\cdot h}{2} = \\dfrac{l^2\\sqrt{3}}{4} = \\dfrac{${sqt(l)}\\sqrt{3}}{4}${eq(A, u, 2)}$.`
		);
		const s = l.x;
		const top: Pt = [s / 2, (s * Math.sqrt(3)) / 2];
		return done([['A', A, 2], ['2p', p, 1], ['h', h, 1]], u, steps, {
			outline: [[0, 0], [s, 0], top],
			lines: [[top, [s / 2, 0]]],
			labels: [lab([0, 0], [s, 0], 'l', l, true, u), lab(top, [s / 2, 0], 'h', h, false, u, true)],
			right: [[[s / 2, 0], [s, 0], top]]
		});
	}
	if (mode === 'lati') {
		const [a, b, c] = [m.a!, m.b!, m.c!];
		const bad = triangleCheck([a, b, c]);
		if (bad) return failed(bad);
		const sorted = [a, b, c].sort((x, y) => cmp(x, y));
		const p2 = add(add(a, b), c);
		const p = half(p2);
		const [pa, pb, pc] = [sub(p, a), sub(p, b), sub(p, c)];
		const radicand = mul(mul(p, pa), mul(pb, pc));
		const A = sqrt(radicand);
		steps.push(
			`Controlla che i lati formino un triangolo: il più lungo, $${vt(sorted[2])}$, è minore della somma degli altri due, $${vt(sorted[0])} + ${vt(sorted[1])}${eq(add(sorted[0], sorted[1]))}$.`,
			`Calcola il perimetro: $2p = a + b + c = ${vt(a)} + ${vt(b)} + ${vt(c)}${eq(p2, u)}$.`,
			`Dividilo per 2 per avere il semiperimetro: $p${eq(p, u)}$.`,
			`Calcola le differenze tra il semiperimetro e ciascun lato: $p - a${eq(pa)}$, $p - b${eq(pb)}$, $p - c${eq(pc)}$.`,
			`Applica la formula di Erone: $A = \\sqrt{p(p - a)(p - b)(p - c)} = \\sqrt{${vt(p)} \\cdot ${vt(pa)} \\cdot ${vt(pb)} \\cdot ${vt(pc)}} = ${rootChain(radicand, u, 2)}$.`
		);
		const [s0, s1, s2] = sorted;
		const right = cmp(add(square(s0), square(s1)), square(s2)) === 0;
		const equal = [cmp(a, b), cmp(b, c), cmp(a, c)].filter((x) => x === 0).length;
		const kind = equal === 3 ? 'equilatero' : equal === 1 ? 'isoscele' : 'scaleno';
		if (right) steps.push(`Il triangolo è ${kind === 'isoscele' ? 'rettangolo isoscele' : 'rettangolo'}, perché $${sqt(s0)} + ${sqt(s1)} = ${sqt(s2)}$: l'area è anche metà del prodotto dei cateti, $\\dfrac{${vt(s0)} \\cdot ${vt(s1)}}{2}${eq(half(mul(s0, s1)), u, 2)}$.`);
		else steps.push(`Il triangolo è ${kind}${kind === 'equilatero' ? '' : `, ${cmp(add(square(s0), square(s1)), square(s2)) < 0 ? 'ottusangolo' : 'acutangolo'}`}.`);
		const top = apex(a.x, b.x, c.x);
		return done([['A', A, 2], ['2p', p2, 1]], u, steps, {
			outline: [[0, 0], [a.x, 0], top],
			lines: [],
			labels: [lab([0, 0], [a.x, 0], 'a', a, true, u), lab([0, 0], top, 'b', b, true, u), lab([a.x, 0], top, 'c', c, true, u)],
			right: []
		});
	}
	// Base and height, and the other two sides when known.
	const [b, h, l1, l2] = [m.b!, m.h!, m.l_1, m.l_2];
	const A = half(mul(b, h));
	steps.push(`Calcola l'area, metà del prodotto della base per l'altezza: $A = \\dfrac{b \\cdot h}{2} = \\dfrac{${vt(b)} \\cdot ${vt(h)}}{2}${eq(A, u, 2)}$.`);
	if (!l1 !== !l2) return failed('Per il perimetro servono tutti e due gli altri lati: scrivili entrambi, oppure lasciali vuoti.');
	let top: Pt = [b.x * 0.35, h.x];
	const items: [string, Val, 1 | 2][] = [['A', A, 2]];
	const labels = [lab([0, 0], [b.x, 0], 'b', b, true, u)];
	if (l1 && l2) {
		const bad = triangleCheck([b, l1, l2]);
		if (bad) return failed(bad);
		if (cmp(l1, h) < 0 || cmp(l2, h) < 0) return failed("Un lato non può essere più corto dell'altezza: l'altezza è la distanza del vertice dalla base, e ogni lato che parte dal vertice è lungo almeno quanto lei.");
		const p = add(add(b, l1), l2);
		steps.push(
			`Controlla che i tre lati formino un triangolo: ognuno deve essere minore della somma degli altri due, e qui lo è.`,
			`Calcola il perimetro, la somma dei tre lati: $2p = b + l_1 + l_2 = ${vt(b)} + ${vt(l1)} + ${vt(l2)}${eq(p, u)}$.`
		);
		items.push(['2p', p, 1]);
		// Draw with the sides; the height drawn is the one they give.
		const t = apex(b.x, l1.x, l2.x);
		top = [t[0], t[1]];
		labels.push(lab([0, 0], top, 'l_1', l1, true, u), lab([b.x, 0], top, 'l_2', l2, true, u));
		// The height the three sides give, to warn about data that do not agree.
		const s = (b.x + l1.x + l2.x) / 2;
		const hSides = (2 * Math.sqrt(Math.max(s * (s - b.x) * (s - l1.x) * (s - l2.x), 0))) / b.x;
		if (Math.abs(hSides - h.x) > 1e-6 * Math.max(1, h.x)) steps.push(`Attenzione: con questi tre lati l'altezza relativa alla base misura circa $${rounded(hSides).tex}${unitTex(u, 1)}$, non $${vt(h)}${unitTex(u, 1)}$. Controlla i dati del problema.`);
	} else {
		steps.push('Per il perimetro servono i tre lati: scrivi anche gli altri due, se li conosci.');
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
	if (cmp(B, b) <= 0) return failed(cmp(B, b) === 0 ? 'Con le basi uguali la figura è un parallelogramma, non un trapezio.' : 'La base maggiore deve essere più lunga della base minore: scambiale.');
	const steps: string[] = [];
	const A = half(mul(add(B, b), h));
	const areaStep = `Calcola l'area, la somma delle basi per l'altezza diviso 2: $A = \\dfrac{(B + b) \\cdot h}{2} = \\dfrac{(${vt(B)} + ${vt(b)}) \\cdot ${vt(h)}}{2}${eq(A, u, 2)}$.`;
	const diff = sub(B, b);
	let left: number;
	const labels = [lab([0, 0], [B.x, 0], 'B', B, true, u)];
	const items: [string, Val, 1 | 2][] = [['A', A, 2]];
	const right: [Pt, Pt, Pt][] = [];
	if (mode === 'isoscele') {
		const proj = half(diff);
		const l = sqrt(add(square(h), square(proj)));
		const p = add(add(B, b), twice(l));
		steps.push(
			`In un trapezio isoscele le due altezze tracciate dagli estremi della base minore staccano sulla base maggiore due segmenti uguali: $\\dfrac{B - b}{2} = \\dfrac{${vt(B)} - ${vt(b)}}{2}${eq(proj, u)}$.`,
			`Ogni lato obliquo è l'ipotenusa di un triangolo rettangolo che ha per cateti l'altezza e quel segmento. Con il teorema di Pitagora: $l = \\sqrt{${sqt(h)} + ${sqt(proj)}} = ${rootChain(add(square(h), square(proj)), u)}$.`,
			areaStep,
			`Calcola il perimetro: $2p = B + b + 2l = ${vt(B)} + ${vt(b)} + 2 \\cdot ${vt(l)}${eq(p, u)}$.`
		);
		items.push(['2p', p, 1], ['l', l, 1]);
		left = proj.x;
		labels.push(lab([B.x, 0], [left + b.x, h.x], 'l', l, false, u));
	} else if (mode === 'rettangolo') {
		const l = sqrt(add(square(h), square(diff)));
		const p = add(add(add(B, b), h), l);
		steps.push(
			`In un trapezio rettangolo un lato è perpendicolare alle basi ed è l'altezza. L'altezza tracciata dall'altro estremo della base minore stacca sulla base maggiore il segmento $B - b = ${vt(B)} - ${vt(b)}${eq(diff, u)}$.`,
			`Il lato obliquo è l'ipotenusa del triangolo rettangolo che ha per cateti l'altezza e quel segmento: $l = \\sqrt{${sqt(h)} + ${sqt(diff)}} = ${rootChain(add(square(h), square(diff)), u)}$.`,
			areaStep,
			`Calcola il perimetro: i lati sono le due basi, l'altezza e il lato obliquo, $2p = B + b + h + l = ${vt(B)} + ${vt(b)} + ${vt(h)} + ${vt(l)}${eq(p, u)}$.`
		);
		items.push(['2p', p, 1], ['l', l, 1]);
		left = 0;
		labels.push(lab([B.x, 0], [b.x, h.x], 'l', l, false, u));
		right.push([[0, 0], [1, 0], [0, 1]]);
	} else {
		const [l1, l2] = [m.l_1, m.l_2];
		steps.push(areaStep);
		if (!l1 !== !l2) return failed('Per il perimetro servono tutti e due i lati obliqui: scrivili entrambi, oppure lasciali vuoti.');
		if (l1 && l2) {
			if (cmp(l1, h) < 0 || cmp(l2, h) < 0) return failed("Un lato obliquo non può essere più corto dell'altezza: l'altezza è la distanza tra le due basi.");
			const p = add(add(B, b), add(l1, l2));
			steps.push(`Calcola il perimetro, la somma dei quattro lati: $2p = B + b + l_1 + l_2 = ${vt(B)} + ${vt(b)} + ${vt(l1)} + ${vt(l2)}${eq(p, u)}$.`);
			items.push(['2p', p, 1]);
			const p1 = Math.sqrt(Math.max(l1.x ** 2 - h.x ** 2, 0));
			const p2 = Math.sqrt(Math.max(l2.x ** 2 - h.x ** 2, 0));
			// The oblique sides agree with the bases when their projections add up to B - b.
			if (Math.abs(p1 + p2 - diff.x) > 1e-6 * Math.max(1, diff.x) && Math.abs(Math.abs(p1 - p2) - diff.x) > 1e-6 * Math.max(1, diff.x))
				steps.push(`Attenzione: le proiezioni dei lati obliqui sulla base maggiore misurano circa $${rounded(p1).tex}$ e $${rounded(p2).tex}$, e la loro somma dovrebbe essere $B - b${eq(diff)}$. Controlla i dati del problema.`);
			left = p1 + p2 > 0 ? (p1 / (p1 + p2)) * diff.x : diff.x / 2;
			labels.push(lab([0, 0], [left, h.x], 'l_1', l1, true, u), lab([B.x, 0], [left + b.x, h.x], 'l_2', l2, true, u));
		} else {
			steps.push('Per il perimetro servono anche i lati obliqui: scrivili, se li conosci, oppure scegli il trapezio isoscele o rettangolo.');
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
	const steps: string[] = [];
	const l0 = m.l ?? null;
	let d1: Val;
	let d2: Val;
	let l: Val;
	const given = { d1: false, d2: false, l: false };
	if (mode === 'lato-altezza') {
		l = l0!;
		const h = m.h!;
		if (cmp(h, l) > 0) return failed("L'altezza non può superare il lato: è la distanza tra due lati paralleli, e il lato è obliquo.");
		const A = mul(l, h);
		const p = mul(int(4), l);
		steps.push(
			`Il rombo è un parallelogramma: l'area è il lato per l'altezza relativa, $A = l \\cdot h = ${vt(l)} \\cdot ${vt(h)}${eq(A, u, 2)}$.`,
			`Calcola il perimetro: i quattro lati sono uguali, $2p = 4l = 4 \\cdot ${vt(l)}${eq(p, u)}$.`
		);
		if (cmp(h, l) === 0) steps.push("L'altezza è uguale al lato: questo rombo è un quadrato.");
		// Diagonals for the drawing: D² + d² = 4l², D·d = 2lh.
		const s = Math.sqrt(4 * l.x ** 2 + 4 * l.x * h.x);
		const t = Math.sqrt(Math.max(4 * l.x ** 2 - 4 * l.x * h.x, 0));
		const [D, d] = [(s + t) / 2, (s - t) / 2];
		return done([['A', A, 2], ['2p', p, 1]], u, steps, {
			outline: [[-D / 2, 0], [0, -d / 2], [D / 2, 0], [0, d / 2]],
			lines: [],
			labels: [lab([D / 2, 0], [0, d / 2], 'l', l, true, u)],
			right: [],
			caption: { text: `h = ${labelText(h, u)}`, given: true }
		});
	}
	if (mode === 'lato-diagonale') {
		l = l0!;
		d1 = m.d_1!;
		given.l = given.d1 = true;
		if (cmp(d1, twice(l)) >= 0) return failed(`La diagonale deve essere minore del doppio del lato (${plain(twice(l))}): metà diagonale e lato formano un triangolo rettangolo in cui il lato è l'ipotenusa.`);
		const hd = half(d1);
		const other = sub(square(l), square(hd));
		const ho = sqrt(other);
		d2 = twice(ho);
		steps.push(
			`Le diagonali del rombo sono perpendicolari e si tagliano a metà: il lato è l'ipotenusa di un triangolo rettangolo con cateti le due metà delle diagonali. Metà della diagonale nota è $\\dfrac{d_1}{2}${eq(hd, u)}$.`,
			`Trova l'altra metà con il teorema di Pitagora: $\\dfrac{d_2}{2} = \\sqrt{l^2 - \\left(\\dfrac{d_1}{2}\\right)^2} = \\sqrt{${sqt(l)} - ${sqt(hd)}} = ${rootChain(other, u)}$.`,
			`Raddoppiala per avere la diagonale: $d_2 = 2 \\cdot ${vt(ho)}${eq(d2, u)}$.`
		);
	} else {
		d1 = m.d_1!;
		d2 = m.d_2!;
		given.d1 = given.d2 = true;
		const [h1, h2] = [half(d1), half(d2)];
		const rad = add(square(h1), square(h2));
		l = sqrt(rad);
		steps.push(
			`Le diagonali del rombo sono perpendicolari e si tagliano a metà: dividono il rombo in quattro triangoli rettangoli con cateti $\\dfrac{d_1}{2}${eq(h1, u)}$ e $\\dfrac{d_2}{2}${eq(h2, u)}$.`,
			`Il lato è l'ipotenusa di questi triangoli: $l = \\sqrt{${sqt(h1)} + ${sqt(h2)}} = ${rootChain(rad, u)}$.`
		);
	}
	const A = half(mul(d1, d2));
	const p = mul(int(4), l);
	steps.push(`Calcola l'area, metà del prodotto delle diagonali: $A = \\dfrac{d_1 \\cdot d_2}{2} = \\dfrac{${vt(d1)} \\cdot ${vt(d2)}}{2}${eq(A, u, 2)}$.`, `Calcola il perimetro: i quattro lati sono uguali, $2p = 4l = 4 \\cdot ${vt(l)}${eq(p, u)}$.`);
	if (cmp(d1, d2) === 0) steps.push('Le diagonali sono uguali: questo rombo è un quadrato.');
	const items: [string, Val, 1 | 2][] = mode === 'diagonali' ? [['A', A, 2], ['2p', p, 1], ['l', l, 1]] : [['A', A, 2], ['2p', p, 1], ['d_2', d2, 1]];
	const [X, Y] = [d1.x / 2, d2.x / 2];
	return done(items, u, steps, {
		outline: [[-X, 0], [0, -Y], [X, 0], [0, Y]],
		lines: [
			[[-X, 0], [X, 0]],
			[[0, -Y], [0, Y]]
		],
		labels: [lab([-X, 0], [0, 0], 'd_1', d1, given.d1, u), lab([0, -Y], [0, 0], 'd_2', d2, given.d2, u), lab([X, 0], [0, Y], 'l', l, given.l, u)],
		right: [[[0, 0], [1, 0], [0, 1]]]
	});
}

function parallelogramma(mode: string, m: Measures, u: Unit): FigureResult {
	const steps: string[] = [];
	const b = m.b!;
	const l = m.l;
	let h: Val;
	let A: Val;
	if (mode === 'area') {
		A = m.A!;
		h = div(A, b);
		steps.push(`L'area è base per altezza: ricava l'altezza dividendo l'area per la base, $h = \\dfrac{A}{b} = \\dfrac{${vt(A)}}{${vt(b)}}${eq(h, u)}$.`);
	} else {
		h = m.h!;
		A = mul(b, h);
		steps.push(`Calcola l'area, base per altezza come nel rettangolo in cui il parallelogramma si trasforma spostando un triangolo: $A = b \\cdot h = ${vt(b)} \\cdot ${vt(h)}${eq(A, u, 2)}$.`);
	}
	const items: [string, Val, 1 | 2][] = mode === 'area' ? [['h', h, 1]] : [['A', A, 2]];
	let shift = h.x * 0.5;
	const labels = [lab([0, 0], [b.x, 0], 'b', b, true, u)];
	if (l) {
		if (cmp(l, h) < 0) return failed("Il lato obliquo non può essere più corto dell'altezza: l'altezza è la distanza tra le due basi.");
		const p = twice(add(b, l));
		const h2 = div(A, l);
		steps.push(
			`Calcola il perimetro: i lati opposti sono uguali, quindi $2p = 2(b + l) = 2(${vt(b)} + ${vt(l)})${eq(p, u)}$.`,
			`L'area non cambia se prendi come base il lato obliquo: l'altezza relativa a quel lato è $h_l = \\dfrac{A}{l} = \\dfrac{${vt(A)}}{${vt(l)}}${eq(h2, u)}$.`
		);
		if (cmp(l, h) === 0) steps.push("Il lato obliquo è uguale all'altezza, quindi è perpendicolare alla base: questo parallelogramma è un rettangolo.");
		items.push(['2p', p, 1]);
		shift = Math.sqrt(Math.max(l.x ** 2 - h.x ** 2, 0));
		labels.push(lab([0, 0], [shift, h.x], 'l', l, true, u));
	} else {
		steps.push('Per il perimetro serve anche il lato obliquo: scrivilo, se lo conosci.');
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
	const steps: string[] = [];
	let r: Val;
	let d: Val;
	let C: Val;
	let A: Val;
	if (mode === 'diametro') {
		d = m.d!;
		r = half(d);
		steps.push(`Il raggio è metà del diametro: $r = \\dfrac{d}{2} = \\dfrac{${vt(d)}}{2}${eq(r, u)}$.`);
	} else if (mode === 'circonferenza') {
		C = m.C!;
		r = div(C, mul(int(2), PI));
		steps.push(`Dalla formula $C = 2\\pi r$ ricava il raggio: $r = \\dfrac{C}{2\\pi} = \\dfrac{${vt(C)}}{2\\pi}${eq(r, u)}$.`);
	} else if (mode === 'area') {
		A = m.A!;
		const ratio = div(A, PI);
		r = sqrt(ratio);
		steps.push(`Dalla formula $A = \\pi r^2$ ricava il raggio: $r = \\sqrt{\\dfrac{A}{\\pi}} = \\sqrt{\\dfrac{${vt(A)}}{\\pi}}${isRational(ratio) ? ` = \\sqrt{${vt(ratio)}}` : ''}${eq(r, u)}$.`);
	} else {
		r = m.r!;
	}
	d = twice(r);
	C = mul(mul(int(2), PI), r);
	A = mul(PI, square(r));
	// A radius known only as a decimal is written as the root it comes from.
	const rSub = r.c ? vt(r) : `\\sqrt{\\dfrac{${vt(m.A!)}}{\\pi}}`;
	if (mode !== 'diametro') steps.push(`Il diametro è il doppio del raggio: $d = 2r = 2 \\cdot ${rSub}${eq(d, u)}$.`);
	if (mode !== 'circonferenza') {
		if (mode === 'area' && !r.c) steps.push(`Calcola la lunghezza della circonferenza: $C = 2\\pi r = 2\\sqrt{\\pi A} = 2\\sqrt{${vt(A)}\\pi}${eq(C, u)}$.`);
		else steps.push(`Calcola la lunghezza della circonferenza: $C = 2\\pi r = 2\\pi \\cdot ${vt(r)}${eq(C, u)}$.`);
	}
	if (mode !== 'area') steps.push(`Calcola l'area del cerchio: $A = \\pi r^2 = \\pi \\cdot ${sqt(r)}${eq(A, u, 2)}$.`);
	if (mode === 'raggio' || mode === 'diametro') steps.push(`Per il valore decimale usa $\\pi \\approx 3{,}1416$; a mano, con $\\pi \\approx 3{,}14$, il risultato cambia di poco nelle ultime cifre.`);
	const items: [string, Val, 1 | 2][] =
		mode === 'raggio' ? [['C', C, 1], ['A', A, 2], ['d', d, 1]] : mode === 'diametro' ? [['r', r, 1], ['C', C, 1], ['A', A, 2]] : mode === 'circonferenza' ? [['r', r, 1], ['d', d, 1], ['A', A, 2]] : [['r', r, 1], ['d', d, 1], ['C', C, 1]];
	const R = r.x;
	const sketch: Sketch = {
		outline: { circle: R },
		lines: mode === 'diametro' ? [[[-R, 0], [R, 0]]] : [[[0, 0], [R * Math.SQRT1_2, R * Math.SQRT1_2]]],
		labels: mode === 'diametro' ? [lab([-R, 0], [R, 0], 'd', d, true, u)] : [lab([0, 0], [R * Math.SQRT1_2, R * Math.SQRT1_2], 'r', r, mode === 'raggio', u)],
		right: []
	};
	if (mode === 'circonferenza') sketch.caption = { text: `C = ${labelText(m.C!, u)}`, given: true };
	if (mode === 'area') sketch.caption = { text: `A = ${labelText(m.A!, u, 2)}`, given: true };
	return done(items, u, steps, sketch);
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
		return failed('Questi numeri sono troppo grandi per un calcolo esatto: prova con misure più piccole.');
	}
}
