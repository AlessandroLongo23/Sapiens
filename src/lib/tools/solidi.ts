import { q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { parseDecimal } from './numbers';
import { DIGITS, PI, add, cmp, div, int, mul, pythagorasSubs, rootSubs, shown, sqrt, square, sub, val, type Pt, type Shown, type Unit, type Val } from './geometria';

/**
 * Surface and volume of the solids of middle and high school (cube, rectangular box, right prism with a regular base,
 * right pyramid with a square base, cylinder, cone, sphere), one page per solid. It builds on the exact values of the
 * plane figures (geometria.ts): rationals, radicals and multiples of π, each with its decimal. A total area that adds
 * a whole number and a radical stays a sum ("180 + 18√3"), as in the books.
 *
 * Every result carries a sketch of the solid in cabinet projection (depth at 45°, halved), with the hidden edges
 * dashed and the given measures labelled.
 */

// ---------------------------------------------------------------------------------------------------------------
// Values: a Val, or a sum of two exact values that cannot be added (240 + 48√3).

export type Dim = 1 | 2 | 3;

/** A value that may stay a sum of two exact terms. */
type Q = Val & { sum?: [Val, Val] };

const approxOnly = (x: number): Val => ({ c: null, r: 1, pi: 0, x });

/** a + b, kept as a sum when the terms are of different kinds (a number and a radical, π and π√5). */
export function plus(a: Val, b: Val): Q {
	const s: Q = add(a, b);
	if (!s.c && a.c && b.c) s.sum = [a, b];
	return s;
}

/**
 * A rational whose decimals end, but only after many digits (1,2345³ has twelve), is shown as a rounded decimal: a
 * fraction like 59 536 656/9 765 625 would be exact and unreadable.
 */
function tidy(v: Val): Val {
	if (!v.c || v.r !== 1) return v;
	let den = v.c.den;
	while (den % 2 === 0) den /= 2;
	while (den % 5 === 0) den /= 5;
	return v.c.den / den > 1e8 ? approxOnly(v.x) : v;
}

function show(v: Q): Shown {
	if (!v.sum) return shown(tidy(v));
	const [a, b] = v.sum.map((t) => shown(tidy(t)).exact);
	if (!a || !b) return shown(approxOnly(v.x));
	return { exact: { tex: `${a.tex} + ${b.tex}`, text: `${a.text} + ${b.text}` }, approx: shown(approxOnly(v.x)).approx };
}

/** The value inside a formula: the exact form, or the decimal. */
export const vt = (v: Q): string => {
	const s = show(v);
	return s.exact?.tex ?? s.approx!.tex;
};

/** A factor inside a product: a sum in brackets. */
const vp = (v: Q): string => (v.sum ? `\\left(${vt(v)}\\right)` : vt(v));

/** A value raised to a power, in brackets unless it is a plain number. */
const pow = (v: Val, n: 2 | 3): string => {
	const t = vt(v);
	return /^[0-9{},\\]+$/.test(t) ? `${t}^${n}` : `\\left(${t}\\right)^${n}`;
};

/** n when it is a perfect cube of a whole number. */
function icbrt(n: number): number | null {
	if (!Number.isSafeInteger(n) || n < 0) return null;
	const k = Math.round(Math.cbrt(n));
	for (const c of [k - 1, k, k + 1]) if (c >= 0 && c * c * c === n) return c;
	return null;
}

/** ∛v, exact when v is a rational cube times a power of π³; else a decimal. */
export function cbrt(v: Val): Val {
	const x = Math.cbrt(v.x);
	if (v.c && v.r === 1 && v.pi % 3 === 0 && v.c.sign() > 0) {
		const [p, d] = [icbrt(v.c.num), icbrt(v.c.den)];
		if (p !== null && d !== null) return { c: q(p, d), r: 1, pi: v.pi / 3, x };
	}
	return approxOnly(x);
}

const isRational = (v: Val) => !!v.c && v.r === 1 && v.pi === 0;

// ---------------------------------------------------------------------------------------------------------------
// Units and the lines of a calculation.

const unitTex = (u: Unit, dim: Dim) => (u ? `\\,\\text{${u}}${dim > 1 ? `^${dim}` : ''}` : '');
const unitText = (u: Unit, dim: Dim) => (u ? ` ${u}${dim === 2 ? '²' : dim === 3 ? '³' : ''}` : '');

/** The last lines of a calculation: "= \hl{125\,\text{cm}^3}", then "\approx …" when it is not a decimal. */
function resultLines(v: Q, u: Unit, dim: Dim): string[] {
	const s = show(v);
	const U = unitTex(u, dim);
	if (!s.exact) return [`\\approx \\hl{${s.approx!.tex}${U}}`];
	return [`= \\hl{${bracket(v, s.exact.tex, U)}${U}}`, ...(s.approx ? [`\\approx ${s.approx.tex}${U}`] : [])];
}

/** A sum followed by a unit goes in brackets, as in the books: (180 + 18√3) cm². */
const bracket = (v: Q, tex: string, U: string) => (v.sum && U ? `\\left(${tex}\\right)` : tex);

/** The formula, each substitution on its own line after "=", the result; a line equal to the one before is left out. */
function calc(formula: string, subs: string[], v: Q, u: Unit, dim: Dim = 1): string[] {
	const exact = show(v).exact?.tex;
	const lines = [formula];
	let last = '';
	for (const x of subs) {
		if (x === last || x === exact) continue;
		lines.push(`= ${x}`);
		last = x;
	}
	return [...lines, ...resultLines(v, u, dim)];
}

/** The value of a row: "$V = 125\,\text{cm}^3$", with the decimal as a second formula when there is one. */
function rowValue(sym: string, v: Q, u: Unit, dim: Dim): string {
	const s = show(v);
	const U = unitTex(u, dim);
	if (!s.exact) return `$${sym} \\approx ${s.approx!.tex}${U}$`;
	return `$${sym} = ${bracket(v, s.exact.tex, U)}${U}$${s.approx ? ` $\\approx ${s.approx.tex}${U}$` : ''}`;
}

/** Plain text for the copy button: "36π cm³ ≈ 113,10 cm³". */
export function valueText(v: Q, u: Unit = '', dim: Dim = 1): string {
	const s = show(v);
	const U = unitText(u, dim);
	if (!s.exact) return `≈ ${s.approx!.text}${U}`;
	const e = v.sum && U ? `(${s.exact.text})` : s.exact.text;
	return s.approx ? `${e}${U} ≈ ${s.approx.text}${U}` : `${e}${U}`;
}

/** A short label for the drawing: the exact form when short, else the decimal. */
function labelText(v: Q, u: Unit, dim: Dim = 1): string {
	const s = show(v);
	const t = s.exact && (s.exact.text.length <= 8 || !s.approx) ? s.exact.text : (s.approx ?? s.exact)!.text;
	return `${t}${unitText(u, dim)}`;
}

// ---------------------------------------------------------------------------------------------------------------
// The drawing: a cabinet projection, y upwards, depth z going back up and to the right.

export interface SolidLabel {
	from: Pt;
	to: Pt;
	text: string;
	given: boolean;
	/** Where the label goes from the segment, on screen. */
	side: 'above' | 'below' | 'left' | 'right';
	/** Position along the segment, 0.5 by default. */
	at?: number;
}

export interface SolidSketch {
	/** The outline of the solid, faintly tinted. */
	silhouette: Pt[];
	/** Edges of a polyhedron and the sides of round solids; hidden ones dashed. */
	edges: { from: Pt; to: Pt; hidden: boolean }[];
	/** Bases of round solids and the equator of the sphere; the arc between `hidden` angles (radians) is dashed. */
	ellipses: { c: Pt; rx: number; ry: number; hidden?: [number, number] }[];
	/** Heights, radii, apothems, diagonals: thin and dashed. */
	lines: [Pt, Pt][];
	/** Centres of round solids. */
	dots: Pt[];
	labels: SolidLabel[];
	/** Right angles: the corner and a point along each side. */
	right: [Pt, Pt, Pt][];
	/** A given measure that is not a segment (a volume, an area), written under the solid. */
	caption?: { text: string; given: boolean };
}

type P3 = [number, number, number];
const DEPTH = 0.5 * Math.SQRT1_2;
const proj = ([x, y, z]: P3): Pt => [x + z * DEPTH, y + z * DEPTH];
/** Towards the viewer: a face is seen when its outward normal points this way. */
const VIEW: P3 = [DEPTH, DEPTH, -1];

const dot3 = (a: P3, b: P3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mean = (ps: P3[]): P3 => [0, 1, 2].map((i) => ps.reduce((t, p) => t + p[i], 0) / ps.length) as P3;

/** The convex hull of points on screen (Andrew's monotone chain). */
function hull(points: Pt[]): Pt[] {
	const ps = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const half = (list: Pt[]) => {
		const out: Pt[] = [];
		for (const p of list) {
			while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 1e-12) out.pop();
			out.push(p);
		}
		out.pop();
		return out;
	};
	return [...half(ps), ...half([...ps].reverse())];
}

/** A convex polyhedron: each edge dashed unless one of its two faces looks towards the viewer. */
function polyhedron(verts: P3[], faces: number[][]): Pick<SolidSketch, 'silhouette' | 'edges'> {
	const centre = mean(verts);
	const seen = faces.map((f) => {
		// Newell's normal, turned outwards.
		const n: P3 = [0, 0, 0];
		f.forEach((i, j) => {
			const [a, b] = [verts[i], verts[f[(j + 1) % f.length]]];
			n[0] += (a[1] - b[1]) * (a[2] + b[2]);
			n[1] += (a[2] - b[2]) * (a[0] + b[0]);
			n[2] += (a[0] - b[0]) * (a[1] + b[1]);
		});
		const c = mean(f.map((i) => verts[i]));
		const out = dot3(n, [c[0] - centre[0], c[1] - centre[1], c[2] - centre[2]]) >= 0 ? 1 : -1;
		return out * dot3(n, VIEW) > 1e-9;
	});
	const edges = new Map<string, { a: number; b: number; seen: boolean }>();
	faces.forEach((f, k) =>
		f.forEach((i, j) => {
			const k2 = f[(j + 1) % f.length];
			const key = `${Math.min(i, k2)}-${Math.max(i, k2)}`;
			const e = edges.get(key) ?? { a: i, b: k2, seen: false };
			e.seen ||= seen[k];
			edges.set(key, e);
		})
	);
	return {
		silhouette: hull(verts.map(proj)),
		edges: [...edges.values()].map((e) => ({ from: proj(verts[e.a]), to: proj(verts[e.b]), hidden: !e.seen }))
	};
}

/** A regular polygon of side l in the horizontal plane, centred, one side at the front: points (x, z). */
function regularBase(n: number, l: number): [number, number][] {
	const R = l / (2 * Math.sin(Math.PI / n));
	return Array.from({ length: n }, (_, k) => {
		const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n;
		return [R * Math.cos(t), R * Math.sin(t)];
	});
}

function prismShape(base: [number, number][], h: number) {
	const n = base.length;
	const verts: P3[] = [...base.map(([x, z]): P3 => [x, 0, z]), ...base.map(([x, z]): P3 => [x, h, z])];
	const faces = [
		base.map((_, i) => i),
		base.map((_, i) => n + i),
		...base.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])
	];
	return { verts, ...polyhedron(verts, faces) };
}

function pyramidShape(base: [number, number][], h: number) {
	const n = base.length;
	const verts: P3[] = [...base.map(([x, z]): P3 => [x, 0, z]), [0, h, 0]];
	const faces = [base.map((_, i) => i), ...base.map((_, i) => [i, (i + 1) % n, n])];
	return { verts, ...polyhedron(verts, faces) };
}

/** Points along an ellipse from angle t0 to t1. */
function arc(c: Pt, rx: number, ry: number, t0: number, t1: number, steps = 24): Pt[] {
	return Array.from({ length: steps + 1 }, (_, i) => {
		const t = t0 + ((t1 - t0) * i) / steps;
		return [c[0] + rx * Math.cos(t), c[1] + ry * Math.sin(t)];
	});
}

/** How flat the ellipse of a circular base is drawn. */
const FLAT = 0.3;

const lab = (from: Pt, to: Pt, sym: string, v: Q | null, given: boolean, u: Unit, side: SolidLabel['side'], at?: number): SolidLabel => ({
	from,
	to,
	text: given && v ? `${sym} = ${labelText(v, u)}` : sym,
	given,
	side,
	at
});

const caption = (sym: string, v: Q, u: Unit, dim: Dim) => ({ text: `${sym} = ${labelText(v, u, dim)}`, given: true });

// ---------------------------------------------------------------------------------------------------------------
// Solids, modes and inputs.

export type Solid = 'cubo' | 'parallelepipedo' | 'prisma' | 'piramide' | 'cilindro' | 'cono' | 'sfera';
export type FieldKey = 'a' | 'b' | 'c';
export type PrismBase = 'quadrato' | 'triangolo' | 'esagono';

export const PRISM_BASES: { value: PrismBase; label: string; sides: number; name: string }[] = [
	{ value: 'triangolo', label: 'Triangolare', sides: 3, name: 'triangolo equilatero' },
	{ value: 'quadrato', label: 'Quadrata', sides: 4, name: 'quadrato' },
	{ value: 'esagono', label: 'Esagonale', sides: 6, name: 'esagono regolare' }
];
export const isPrismBase = (s: string): s is PrismBase => PRISM_BASES.some((b) => b.value === s);

export interface Field {
	key: FieldKey;
	label: string;
	/** With the article, for the messages: "lo spigolo". */
	the: string;
	sym: string;
	dim?: Dim;
	/** Accepts a multiple of π, "36π". */
	pi?: boolean;
}

export interface ModeSpec {
	value: string;
	label: string;
	fields: Field[];
	example: Partial<Record<FieldKey, string>>;
	hint?: string;
}

const F = (key: FieldKey, label: string, the: string, sym: string, more: Partial<Field> = {}): Field => ({ key, label, the, sym, ...more });
const PI_HINT = 'Puoi scrivere anche un multiplo di π: 36π, oppure 36pi.';

export const SOLIDS: Record<Solid, { name: string; modes: ModeSpec[] }> = {
	cubo: {
		name: 'cubo',
		modes: [
			{ value: 'spigolo', label: 'Dallo spigolo', fields: [F('a', 'Spigolo (l)', 'lo spigolo', 'l')], example: { a: '5' } },
			{ value: 'volume', label: 'Dal volume', fields: [F('a', 'Volume (V)', 'il volume', 'V', { dim: 3 })], example: { a: '343' } },
			{ value: 'area', label: "Dall'area totale", fields: [F('a', 'Area totale', "l'area totale", 'A_t', { dim: 2 })], example: { a: '96' } },
			{ value: 'diagonale', label: 'Dalla diagonale', fields: [F('a', 'Diagonale (d)', 'la diagonale', 'd')], example: { a: '6' } }
		]
	},
	parallelepipedo: {
		name: 'parallelepipedo',
		modes: [
			{ value: 'dimensioni', label: 'Le tre dimensioni', fields: [F('a', 'Lunghezza (a)', 'la lunghezza', 'a'), F('b', 'Larghezza (b)', 'la larghezza', 'b'), F('c', 'Altezza (c)', "l'altezza", 'c')], example: { a: '8', b: '6', c: '5' } },
			{ value: 'volume', label: 'Volume e base', fields: [F('a', 'Lunghezza (a)', 'la lunghezza', 'a'), F('b', 'Larghezza (b)', 'la larghezza', 'b'), F('c', 'Volume (V)', 'il volume', 'V', { dim: 3 })], example: { a: '8', b: '6', c: '240' } },
			{ value: 'diagonale', label: 'Diagonale e base', fields: [F('a', 'Lunghezza (a)', 'la lunghezza', 'a'), F('b', 'Larghezza (b)', 'la larghezza', 'b'), F('c', 'Diagonale (d)', 'la diagonale', 'd')], example: { a: '3', b: '4', c: '13' } }
		]
	},
	prisma: {
		name: 'prisma',
		modes: [
			{ value: 'lati', label: 'Lato e altezza', fields: [F('a', 'Lato di base (l)', 'il lato di base', 'l'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '6', b: '10' } },
			{ value: 'volume', label: 'Volume e lato', fields: [F('a', 'Lato di base (l)', 'il lato di base', 'l'), F('b', 'Volume (V)', 'il volume', 'V', { dim: 3 })], example: { a: '4', b: '120' } }
		]
	},
	piramide: {
		name: 'piramide',
		modes: [
			{ value: 'altezza', label: 'Lato e altezza', fields: [F('a', 'Lato di base (l)', 'il lato di base', 'l'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '12', b: '8' } },
			{ value: 'apotema', label: 'Lato e apotema', fields: [F('a', 'Lato di base (l)', 'il lato di base', 'l'), F('b', 'Apotema (a)', "l'apotema", 'a')], example: { a: '10', b: '13' } },
			{ value: 'spigolo', label: 'Lato e spigolo laterale', fields: [F('a', 'Lato di base (l)', 'il lato di base', 'l'), F('b', 'Spigolo laterale (s)', 'lo spigolo laterale', 's')], example: { a: '6', b: '5' } },
			{ value: 'altezza-apotema', label: 'Altezza e apotema', fields: [F('a', 'Altezza (h)', "l'altezza", 'h'), F('b', 'Apotema (a)', "l'apotema", 'a')], example: { a: '12', b: '13' } }
		]
	},
	cilindro: {
		name: 'cilindro',
		modes: [
			{ value: 'raggio', label: 'Raggio e altezza', fields: [F('a', 'Raggio (r)', 'il raggio', 'r'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '3', b: '10' } },
			{ value: 'diametro', label: 'Diametro e altezza', fields: [F('a', 'Diametro (d)', 'il diametro', 'd'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '10', b: '12' } },
			{ value: 'volume', label: 'Volume e raggio', fields: [F('a', 'Raggio (r)', 'il raggio', 'r'), F('b', 'Volume (V)', 'il volume', 'V', { dim: 3, pi: true })], example: { a: '5', b: '300π' }, hint: PI_HINT }
		]
	},
	cono: {
		name: 'cono',
		modes: [
			{ value: 'altezza', label: 'Raggio e altezza', fields: [F('a', 'Raggio (r)', 'il raggio', 'r'), F('b', 'Altezza (h)', "l'altezza", 'h')], example: { a: '6', b: '8' } },
			{ value: 'apotema', label: 'Raggio e apotema', fields: [F('a', 'Raggio (r)', 'il raggio', 'r'), F('b', 'Apotema (a)', "l'apotema", 'a')], example: { a: '5', b: '13' } },
			{ value: 'volume', label: 'Volume e raggio', fields: [F('a', 'Raggio (r)', 'il raggio', 'r'), F('b', 'Volume (V)', 'il volume', 'V', { dim: 3, pi: true })], example: { a: '3', b: '12π' }, hint: PI_HINT }
		]
	},
	sfera: {
		name: 'sfera',
		modes: [
			{ value: 'raggio', label: 'Dal raggio', fields: [F('a', 'Raggio (r)', 'il raggio', 'r')], example: { a: '6' } },
			{ value: 'diametro', label: 'Dal diametro', fields: [F('a', 'Diametro (d)', 'il diametro', 'd')], example: { a: '10' } },
			{ value: 'superficie', label: 'Dalla superficie', fields: [F('a', 'Superficie (S)', 'la superficie', 'S', { dim: 2, pi: true })], example: { a: '100π' }, hint: PI_HINT },
			{ value: 'volume', label: 'Dal volume', fields: [F('a', 'Volume (V)', 'il volume', 'V', { dim: 3, pi: true })], example: { a: '36π' }, hint: PI_HINT }
		]
	}
};

/** Clickable examples, per solid: a mode, its values and, for the prism, the base. */
export const SOLID_EXAMPLES: Record<Solid, { label: string; mode: string; values: Partial<Record<FieldKey, string>>; base?: PrismBase }[]> = {
	cubo: [
		{ label: 'l = 3', mode: 'spigolo', values: { a: '3' } },
		{ label: 'l = 2,5', mode: 'spigolo', values: { a: '2,5' } },
		{ label: 'V = 1000', mode: 'volume', values: { a: '1000' } },
		{ label: 'area totale 150', mode: 'area', values: { a: '150' } }
	],
	parallelepipedo: [
		{ label: '10, 4, 3', mode: 'dimensioni', values: { a: '10', b: '4', c: '3' } },
		{ label: '5, 5, 5', mode: 'dimensioni', values: { a: '5', b: '5', c: '5' } },
		{ label: 'V = 360, 9 e 5', mode: 'volume', values: { a: '9', b: '5', c: '360' } },
		{ label: 'd = 15, 5 e 10', mode: 'diagonale', values: { a: '5', b: '10', c: '15' } }
	],
	prisma: [
		{ label: 'quadrata 5 e 12', mode: 'lati', values: { a: '5', b: '12' }, base: 'quadrato' },
		{ label: 'triangolare 4 e 9', mode: 'lati', values: { a: '4', b: '9' }, base: 'triangolo' },
		{ label: 'esagonale 2 e 10', mode: 'lati', values: { a: '2', b: '10' }, base: 'esagono' },
		{ label: 'quadrata V = 200, l = 5', mode: 'volume', values: { a: '5', b: '200' }, base: 'quadrato' }
	],
	piramide: [
		{ label: 'l = 6, h = 4', mode: 'altezza', values: { a: '6', b: '4' } },
		{ label: 'l = 16, a = 17', mode: 'apotema', values: { a: '16', b: '17' } },
		{ label: 'l = 10, s = 13', mode: 'spigolo', values: { a: '10', b: '13' } },
		{ label: 'h = 4, a = 5', mode: 'altezza-apotema', values: { a: '4', b: '5' } }
	],
	cilindro: [
		{ label: 'r = 5, h = 8', mode: 'raggio', values: { a: '5', b: '8' } },
		{ label: 'r = 2,5, h = 4', mode: 'raggio', values: { a: '2,5', b: '4' } },
		{ label: 'd = 6, h = 6', mode: 'diametro', values: { a: '6', b: '6' } },
		{ label: 'V = 500, r = 5', mode: 'volume', values: { a: '5', b: '500' } }
	],
	cono: [
		{ label: 'r = 3, h = 4', mode: 'altezza', values: { a: '3', b: '4' } },
		{ label: 'r = 5, h = 10', mode: 'altezza', values: { a: '5', b: '10' } },
		{ label: 'r = 8, a = 17', mode: 'apotema', values: { a: '8', b: '17' } },
		{ label: 'V = 100π, r = 5', mode: 'volume', values: { a: '5', b: '100π' } }
	],
	sfera: [
		{ label: 'r = 3', mode: 'raggio', values: { a: '3' } },
		{ label: 'd = 7', mode: 'diametro', values: { a: '7' } },
		{ label: 'S = 64π', mode: 'superficie', values: { a: '64π' } },
		{ label: 'V = 1000', mode: 'volume', values: { a: '1000' } }
	]
};

/** Lengths above this are refused; areas and volumes above LIMIT_BIG. */
const LIMIT = 100_000;
const LIMIT_BIG = 1_000_000_000;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** One positive measure; a multiple of π when the field accepts it. */
export function readMeasure(f: Pick<Field, 'the' | 'pi' | 'dim'>, input: string | undefined): Val | string {
	const t = (input ?? '').trim();
	const eg = `per esempio 12 o 7,5${f.pi ? ', oppure un multiplo di π come 36π' : ''}`;
	if (!t) return `Scrivi ${f.the}, ${eg}.`;
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
	if (!r) return `${cap(f.the)}: scrivi un numero, ${eg}.`;
	if (r.sign() <= 0) return `${cap(f.the)} deve essere maggiore di zero: scrivi per esempio 5.`;
	const big = (f.dim ?? 1) > 1;
	if (r.compare(q(big ? LIMIT_BIG : LIMIT)) > 0)
		return big ? 'Usa valori fino a 1 000 000 000, cambiando unità: per esempio 2 m³ invece di 2 000 000 cm³.' : 'Usa misure fino a 100 000, cambiando unità: per esempio 250 km invece di 250 000 m.';
	if (!r.mul(q(10 ** DIGITS)).isInteger()) return 'Usa al massimo quattro cifre decimali, per esempio 7,1234.';
	return withPi ? mul(val(r), PI) : val(r);
}

type Measures = Record<string, Val>;

function readAll(spec: ModeSpec, values: Partial<Record<FieldKey, string>>): Measures | string {
	const out: Measures = {};
	for (const f of spec.fields) {
		const v = readMeasure(f, values[f.key]);
		if (typeof v === 'string') return v;
		out[f.sym] = v;
	}
	return out;
}

export interface SolidResult {
	outcome: Outcome;
	sketch: SolidSketch | null;
}

/** A measure found: its name, its symbol, its value, and whether it is a length, an area or a volume. */
type Item = [label: string, sym: string, v: Q, dim: Dim];

const done = (items: Item[], u: Unit, steps: Step[], sketch: SolidSketch): SolidResult => {
	// Groups only help past five steps (docs/strumenti.md, rule 6).
	if (steps.length <= 5) for (const s of steps) delete s.group;
	return {
		outcome: {
			ok: true,
			rows: items.map(([label, sym, v, dim]) => ({ label, value: rowValue(sym, v, u, dim) })),
			copy: items
				.map(([label, , v, dim]) => {
					const t = valueText(v, u, dim);
					return `${label} ${t.startsWith('≈') ? '' : '= '}${t}`;
				})
				.join('; '),
			steps
		},
		sketch
	};
};

const failed = (error: string): SolidResult => ({ outcome: fail(error), sketch: null });

/** A plain-text number for a message. */
const plain = (v: Val) => {
	const s = shown(v);
	return s.exact && !s.approx ? s.exact.text : s.approx!.text;
};

const HALF = val(q(1, 2));
const half = (v: Val) => mul(v, HALF);
const twice = (v: Val) => mul(v, int(2));

const AB = 'Area di base';
const AL = 'Area laterale';
const AT = 'Area totale';
const VOL = 'Volume';

/** Adds a sentence to the conclusion of a step. */
function note(step: Step, then: string) {
	step.then = step.then ? `${step.then} ${then}` : then;
}

/**
 * A length known only as a decimal (a cube root that is not whole) is rounded to two decimals, as the student would
 * write it, so that every following line can be checked by hand; the step says so.
 */
function snapped(v: Val): Val {
	if (v.c) return v;
	return approxOnly(Number(shown(v).approx!.text.replace(/\s/g, '').replace(',', '.')));
}

const ROUNDED = (what: string) => `${what} è arrotondato a due decimali: i risultati che seguono sono approssimati.`;

// ---------------------------------------------------------------------------------------------------------------
// Polyhedra.

function cubo(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	let l: Val;
	if (mode === 'volume') {
		const V = m.V;
		l = snapped(cbrt(V));
		const subs = [`\\sqrt[3]{${vt(V)}}`];
		if (l.c?.isInteger()) subs.push(`\\sqrt[3]{${pow(l, 3)}}`);
		steps.push({ say: 'Ricava lo spigolo: fai la radice cubica del volume.', math: calc('l = \\sqrt[3]{V}', subs, l, u) });
		if (!l.c) note(steps[0], ROUNDED('Lo spigolo'));
	} else if (mode === 'area') {
		const At = m.A_t;
		const face = div(At, int(6));
		l = sqrt(face);
		steps.push({ say: "Ricava lo spigolo: dividi l'area totale per 6, poi fai la radice quadrata.", math: calc('l = \\sqrt{\\dfrac{A_t}{6}}', [`\\sqrt{\\dfrac{${vt(At)}}{6}}`, ...rootSubs(face)], l, u) });
	} else if (mode === 'diagonale') {
		const d = m.d;
		l = div(d, sqrt(int(3)));
		steps.push({ say: 'Ricava lo spigolo: la diagonale è lo spigolo moltiplicato per $\\sqrt{3}$.', math: calc('l = \\dfrac{d}{\\sqrt{3}}', ['\\dfrac{d\\sqrt{3}}{3}', `\\dfrac{${vt(d)}\\sqrt{3}}{3}`], l, u) });
	} else {
		l = m.l;
	}
	const Ab = square(l);
	const Al = mul(int(4), Ab);
	const At = mul(int(6), Ab);
	const V = mul(Ab, l);
	const l2x3 = mul(int(3), Ab);
	const d = sqrt(l2x3);
	steps.push(
		{ say: "Calcola l'area di una faccia: è un quadrato di lato $l$.", math: calc('A_b = l^2', [pow(l, 2)], Ab, u, 2) },
		{ say: "Calcola l'area laterale: sono le 4 facce intorno al cubo.", math: calc('A_l = 4 \\cdot A_b', [`4 \\cdot ${vp(Ab)}`], Al, u, 2) }
	);
	if (mode !== 'area') steps.push({ say: "Calcola l'area totale: le 6 facce sono uguali.", math: calc('A_t = 6 \\cdot A_b', [`6 \\cdot ${vp(Ab)}`], At, u, 2) });
	if (mode !== 'volume') steps.push({ say: 'Calcola il volume: eleva lo spigolo al cubo.', math: calc('V = l^3', [pow(l, 3)], V, u, 3) });
	if (mode !== 'diagonale')
		steps.push({
			say: 'Calcola la diagonale con Pitagora: la radice della somma dei quadrati dei tre spigoli.',
			math: calc('d = \\sqrt{l^2 + l^2 + l^2}', [`\\sqrt{3 \\cdot ${pow(l, 2)}}`, `\\sqrt{3 \\cdot ${vt(Ab)}}`, ...(isRational(l2x3) ? rootSubs(l2x3) : [])], d, u),
			then: 'In ogni cubo la diagonale è lo spigolo moltiplicato per $\\sqrt{3}$.'
		});
	const items: Item[] = [];
	if (mode !== 'spigolo') items.push(['Spigolo', 'l', l, 1]);
	items.push([AL, 'A_l', Al, 2]);
	if (mode !== 'area') items.push([AT, 'A_t', At, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	if (mode !== 'diagonale') items.push(['Diagonale', 'd', d, 1]);
	const sketch = boxSketch(l, l, l, u, { a: 'l', b: null, c: null }, mode === 'spigolo', d, mode === 'diagonale');
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	if (mode === 'area') sketch.caption = caption('Area totale', m.A_t, u, 2);
	return done(items, u, steps, sketch);
}

/** A box a × b × c (width, depth, height), with the labels asked for and the space diagonal dashed. */
function boxSketch(a: Val, b: Val, c: Val, u: Unit, names: { a: string; b: string | null; c: string | null }, sidesGiven: boolean | { a: boolean; b: boolean; c: boolean }, d: Val, dGiven: boolean): SolidSketch {
	const [x, z, y] = [a.x, b.x, c.x];
	const shape = prismShape(
		[
			[0, 0],
			[x, 0],
			[x, z],
			[0, z]
		],
		y
	);
	const g = typeof sidesGiven === 'boolean' ? { a: sidesGiven, b: sidesGiven, c: sidesGiven } : sidesGiven;
	const P = (p: P3) => proj(p);
	const labels = [lab(P([0, 0, 0]), P([x, 0, 0]), names.a, a, g.a, u, 'below')];
	if (names.b) labels.push(lab(P([x, 0, 0]), P([x, 0, z]), names.b, b, g.b, u, 'right'));
	if (names.c) labels.push(lab(P([0, 0, 0]), P([0, y, 0]), names.c, c, g.c, u, 'left'));
	labels.push(lab(P([0, 0, 0]), P([x, y, z]), 'd', d, dGiven, u, 'above', 0.6));
	return { silhouette: shape.silhouette, edges: shape.edges, ellipses: [], lines: [[P([0, 0, 0]), P([x, y, z])]], dots: [], labels, right: [] };
}

function parallelepipedo(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	const [a, b] = [m.a, m.b];
	const Ab = mul(a, b);
	const abStep: Step = { group: 'La base', say: "Calcola l'area di base: è un rettangolo.", math: calc('A_b = a \\cdot b', [`${vp(a)} \\cdot ${vp(b)}`], Ab, u, 2) };
	let c: Val;
	let d: Val | null = null;
	if (mode === 'volume') {
		const V = m.V;
		c = div(V, Ab);
		steps.push(abStep, { say: "Ricava l'altezza: dividi il volume per l'area di base.", math: calc('c = \\dfrac{V}{A_b}', [`\\dfrac{${vt(V)}}{${vt(Ab)}}`], c, u) });
	} else if (mode === 'diagonale') {
		d = m.d;
		const [a2, b2, d2] = [square(a), square(b), square(d)];
		const rad = sub(sub(d2, a2), b2);
		if (cmp(rad, int(0)) <= 0) return failed(`La diagonale è troppo corta: il suo quadrato deve superare la somma dei quadrati di lunghezza e larghezza (${plain(add(a2, b2))}). Per esempio: 3, 4 e diagonale 13.`);
		c = sqrt(rad);
		steps.push(
			{
				group: "L'altezza",
				say: "Ricava l'altezza con Pitagora: togli dal quadrato della diagonale gli altri due quadrati.",
				math: calc('c = \\sqrt{d^2 - a^2 - b^2}', [`\\sqrt{${pow(d, 2)} - ${pow(a, 2)} - ${pow(b, 2)}}`, `\\sqrt{${vt(d2)} - ${vt(a2)} - ${vt(b2)}}`, ...rootSubs(rad)], c, u)
			},
			abStep
		);
	} else {
		c = m.c;
		steps.push(abStep);
	}
	const p = twice(add(a, b));
	const Al = mul(p, c);
	const twoAb = twice(Ab);
	const At = plus(Al, twoAb);
	const V = mul(Ab, c);
	steps.push(
		{ say: 'Calcola il perimetro di base.', math: calc('2p = 2(a + b)', [`2(${vt(a)} + ${vt(b)})`, `2 \\cdot ${vt(add(a, b))}`], p, u) },
		{ group: 'Le superfici', say: "Calcola l'area laterale: il perimetro di base per l'altezza.", math: calc('A_l = 2p \\cdot c', [`${vp(p)} \\cdot ${vp(c)}`], Al, u, 2) },
		{ say: "Calcola l'area totale: aggiungi le due basi.", math: calc('A_t = A_l + 2A_b', [`${vt(Al)} + 2 \\cdot ${vp(Ab)}`, `${vt(Al)} + ${vt(twoAb)}`], At, u, 2) }
	);
	if (mode !== 'volume') steps.push({ group: mode === 'dimensioni' ? 'Volume e diagonale' : 'Il volume', say: "Calcola il volume: l'area di base per l'altezza.", math: calc('V = A_b \\cdot c', [`${vp(Ab)} \\cdot ${vp(c)}`], V, u, 3) });
	if (!d) {
		const [a2, b2, c2] = [square(a), square(b), square(c)];
		const rad = add(add(a2, b2), c2);
		d = sqrt(rad);
		steps.push({
			group: mode === 'volume' ? 'La diagonale' : undefined,
			say: 'Calcola la diagonale con Pitagora: la radice della somma dei quadrati delle tre dimensioni.',
			math: calc('d = \\sqrt{a^2 + b^2 + c^2}', [`\\sqrt{${pow(a, 2)} + ${pow(b, 2)} + ${pow(c, 2)}}`, `\\sqrt{${vt(a2)} + ${vt(b2)} + ${vt(c2)}}`, ...(isRational(rad) ? rootSubs(rad) : [])], d, u)
		});
	}
	if (cmp(a, b) === 0 && cmp(b, c) === 0) note(steps[steps.length - 1], 'Le tre dimensioni sono uguali: questo parallelepipedo è un cubo.');
	const items: Item[] = [];
	if (mode !== 'dimensioni') items.push(['Altezza', 'c', c, 1]);
	items.push([AL, 'A_l', Al, 2], [AT, 'A_t', At, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	if (mode !== 'diagonale') items.push(['Diagonale', 'd', d, 1]);
	const sketch = boxSketch(a, b, c, u, { a: 'a', b: 'b', c: 'c' }, { a: true, b: true, c: mode === 'dimensioni' }, d, mode === 'diagonale');
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	return done(items, u, steps, sketch);
}

/** The area of a regular base of side l, and its step. */
function baseArea(base: PrismBase, l: Val, u: Unit): [Val, Step] {
	const l2 = square(l);
	if (base === 'quadrato') return [l2, { say: "Calcola l'area di base: è un quadrato di lato $l$.", math: calc('A_b = l^2', [pow(l, 2)], l2, u, 2) }];
	const tri = div(mul(l2, sqrt(int(3))), int(4));
	if (base === 'triangolo')
		return [
			tri,
			{
				say: "Calcola l'area di base: è un triangolo equilatero di lato $l$.",
				math: calc('A_b = \\dfrac{l^2\\sqrt{3}}{4}', [`\\dfrac{${pow(l, 2)}\\sqrt{3}}{4}`, `\\dfrac{${vt(l2)}\\sqrt{3}}{4}`], tri, u, 2)
			}
		];
	const hex = mul(int(6), tri);
	return [
		hex,
		{
			say: "Calcola l'area di base: l'esagono è fatto di 6 triangoli equilateri.",
			math: calc('A_b = 6 \\cdot \\dfrac{l^2\\sqrt{3}}{4}', [`6 \\cdot \\dfrac{${pow(l, 2)}\\sqrt{3}}{4}`, `6 \\cdot \\dfrac{${vt(l2)}\\sqrt{3}}{4}`], hex, u, 2)
		}
	];
}

function prisma(mode: string, m: Measures, u: Unit, base: PrismBase): SolidResult {
	const steps: Step[] = [];
	const { sides } = PRISM_BASES.find((b) => b.value === base)!;
	const l = m.l;
	const [Ab, abStep] = baseArea(base, l, u);
	abStep.group = 'La base';
	steps.push(abStep);
	let h: Val;
	if (mode === 'volume') {
		const V = m.V;
		h = div(V, Ab);
		steps.push({ say: "Ricava l'altezza: dividi il volume per l'area di base.", math: calc('h = \\dfrac{V}{A_b}', [`\\dfrac{${vt(V)}}{${vt(Ab)}}`], h, u) });
	} else {
		h = m.h;
	}
	const p = mul(int(sides), l);
	const Al = mul(p, h);
	const twoAb = twice(Ab);
	const At = plus(Al, twoAb);
	const V = mul(Ab, h);
	steps.push(
		{ say: `Calcola il perimetro di base: i ${sides} lati sono uguali.`, math: calc(`2p = ${sides}l`, [`${sides} \\cdot ${vp(l)}`], p, u) },
		{ group: 'Le superfici', say: "Calcola l'area laterale: il perimetro di base per l'altezza.", math: calc('A_l = 2p \\cdot h', [`${vp(p)} \\cdot ${vp(h)}`], Al, u, 2) },
		{ say: "Calcola l'area totale: aggiungi le due basi.", math: calc('A_t = A_l + 2A_b', [`${vt(Al)} + 2 \\cdot ${vp(Ab)}`, `${vt(Al)} + ${vt(twoAb)}`], At, u, 2) }
	);
	if (mode !== 'volume') steps.push({ group: 'Il volume', say: "Calcola il volume: l'area di base per l'altezza.", math: calc('V = A_b \\cdot h', [`${vp(Ab)} \\cdot ${vp(h)}`], V, u, 3) });
	if (base === 'quadrato' && cmp(l, h) === 0) note(steps[steps.length - 1], "Il lato di base è uguale all'altezza: questo prisma è un cubo.");
	const items: Item[] = [];
	if (mode === 'volume') items.push(['Altezza', 'h', h, 1]);
	items.push([AB, 'A_b', Ab, 2], [AL, 'A_l', Al, 2], [AT, 'A_t', At, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	const pts = regularBase(sides, l.x);
	const shape = prismShape(pts, h.x);
	const [p0, p1] = [pts[0], pts[1]];
	const sketch: SolidSketch = {
		silhouette: shape.silhouette,
		edges: shape.edges,
		ellipses: [],
		lines: [],
		dots: [],
		labels: [lab(proj([p0[0], 0, p0[1]]), proj([p1[0], 0, p1[1]]), 'l', l, true, u, 'below'), lab(proj([p0[0], 0, p0[1]]), proj([p0[0], h.x, p0[1]]), 'h', h, mode !== 'volume', u, 'left')],
		right: []
	};
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	return done(items, u, steps, sketch);
}

function piramide(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	let l: Val;
	let hl: Val;
	let h: Val;
	let a: Val;
	let s: Val | undefined;
	const given = { l: true, h: false, a: false, s: false };
	const halfStep = (): Step => ({
		group: 'Le misure con Pitagora',
		say: 'Calcola metà del lato di base.',
		math: [`\\dfrac{l}{2} = \\dfrac{${vt(l)}}{2} = \\hl{${vt(hl)}${unitTex(u, 1)}}`],
		then: "È la distanza dal centro della base al lato: un cateto dei triangoli rettangoli nascosti nella piramide."
	});
	const HALF_L = '\\left(\\dfrac{l}{2}\\right)^2';
	if (mode === 'altezza-apotema') {
		h = m.h;
		a = m.a;
		given.l = false;
		given.h = given.a = true;
		if (cmp(a, h) <= 0) return failed("L'apotema deve essere più lungo dell'altezza: è l'ipotenusa del triangolo che forma con l'altezza. Per esempio: altezza 12, apotema 13.");
		hl = sqrt(sub(square(a), square(h)));
		l = twice(hl);
		steps.push(
			{ group: 'Le misure con Pitagora', say: "Calcola metà lato con Pitagora: l'apotema è l'ipotenusa, l'altezza un cateto.", math: calc('\\dfrac{l}{2} = \\sqrt{a^2 - h^2}', pythagorasSubs(a, h, '-'), hl, u) },
			{ say: 'Raddoppia: ottieni il lato di base.', math: calc('l = 2 \\cdot \\dfrac{l}{2}', [`2 \\cdot ${vp(hl)}`], l, u) }
		);
	} else {
		l = m.l;
		hl = half(l);
		steps.push(halfStep());
		if (mode === 'apotema') {
			a = m.a;
			given.a = true;
			if (cmp(a, hl) <= 0) return failed(`L'apotema deve essere più lungo di metà lato di base (${plain(hl)}): è l'ipotenusa del triangolo che forma con l'altezza. Per esempio: lato 10, apotema 13.`);
			h = sqrt(sub(square(a), square(hl)));
			steps.push({ say: "Calcola l'altezza con Pitagora: l'apotema è l'ipotenusa.", math: calc(`h = \\sqrt{a^2 - ${HALF_L}}`, pythagorasSubs(a, hl, '-'), h, u) });
		} else if (mode === 'spigolo') {
			s = m.s;
			given.s = true;
			const halfDiagonal = mul(hl, sqrt(int(2)));
			if (cmp(square(s), twice(square(hl))) <= 0)
				return failed(`Lo spigolo laterale deve essere più lungo di metà diagonale della base (circa ${shown(halfDiagonal).approx?.text ?? plain(halfDiagonal)}), altrimenti la piramide non ha altezza. Per esempio: lato 6, spigolo 5.`);
			a = sqrt(sub(square(s), square(hl)));
			h = sqrt(sub(square(a), square(hl)));
			steps.push(
				{ say: "Calcola l'apotema con Pitagora: lo spigolo laterale è l'ipotenusa.", math: calc(`a = \\sqrt{s^2 - ${HALF_L}}`, pythagorasSubs(s, hl, '-'), a, u) },
				{ say: "Calcola l'altezza con Pitagora: l'apotema è l'ipotenusa.", math: calc(`h = \\sqrt{a^2 - ${HALF_L}}`, pythagorasSubs(a, hl, '-'), h, u) }
			);
		} else {
			h = m.h;
			given.h = true;
			a = sqrt(add(square(h), square(hl)));
			steps.push({ say: "Calcola l'apotema con Pitagora: i cateti sono l'altezza e metà lato.", math: calc(`a = \\sqrt{h^2 + ${HALF_L}}`, pythagorasSubs(h, hl, '+'), a, u) });
		}
	}
	s ??= sqrt(add(square(a), square(hl)));
	if (mode !== 'spigolo') steps.push({ say: "Calcola lo spigolo laterale con Pitagora: i cateti sono l'apotema e metà lato.", math: calc(`s = \\sqrt{a^2 + ${HALF_L}}`, pythagorasSubs(a, hl, '+'), s, u) });
	const Ab = square(l);
	const p = mul(int(4), l);
	const Al = div(mul(p, a), int(2));
	const At = plus(Al, Ab);
	const V = div(mul(Ab, h), int(3));
	steps.push(
		{ group: 'Le superfici', say: "Calcola l'area di base: è un quadrato.", math: calc('A_b = l^2', [pow(l, 2)], Ab, u, 2) },
		{ say: 'Calcola il perimetro di base.', math: calc('2p = 4l', [`4 \\cdot ${vp(l)}`], p, u) },
		{ say: "Calcola l'area laterale: sono 4 triangoli con altezza uguale all'apotema.", math: calc('A_l = \\dfrac{2p \\cdot a}{2}', [`\\dfrac{${vp(p)} \\cdot ${vp(a)}}{2}`], Al, u, 2) },
		{ say: "Calcola l'area totale: aggiungi la base.", math: calc('A_t = A_l + A_b', [`${vt(Al)} + ${vt(Ab)}`], At, u, 2) },
		{ group: 'Il volume', say: "Calcola il volume: l'area di base per l'altezza, diviso 3.", math: calc('V = \\dfrac{A_b \\cdot h}{3}', [`\\dfrac{${vp(Ab)} \\cdot ${vp(h)}}{3}`, `\\dfrac{${vt(mul(Ab, h))}}{3}`], V, u, 3) }
	);
	const items: Item[] = [];
	if (mode === 'altezza-apotema') items.push(['Lato di base', 'l', l, 1]);
	if (!given.h) items.push(['Altezza', 'h', h, 1]);
	if (!given.a) items.push(['Apotema', 'a', a, 1]);
	if (!given.s) items.push(['Spigolo laterale', 's', s, 1]);
	items.push([AL, 'A_l', Al, 2], [AT, 'A_t', At, 2], [VOL, 'V', V, 3]);
	const [L, H] = [l.x, h.x];
	const shape = pyramidShape(regularBase(4, L), H);
	const O = proj([0, 0, 0]);
	const top = proj([0, H, 0]);
	const front = proj([0, 0, -L / 2]);
	const corner = proj([L / 2, 0, -L / 2]);
	return done(items, u, steps, {
		silhouette: shape.silhouette,
		edges: shape.edges,
		ellipses: [],
		lines: [
			[O, top],
			[O, front],
			[front, top]
		],
		dots: [],
		labels: [lab(proj([-L / 2, 0, -L / 2]), corner, 'l', l, given.l, u, 'below'), lab(O, top, 'h', h, given.h, u, 'right', 0.45), lab(front, top, 'a', a, given.a, u, 'left', 0.5), lab(corner, top, 's', s, given.s, u, 'right', 0.4)],
		right: [[O, proj([0, 0, -1]), proj([0, 1, 0])]]
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Round solids.

function roundSketch(r: number, h: number, cone: boolean): Pick<SolidSketch, 'silhouette' | 'edges' | 'ellipses'> {
	const ry = FLAT * r;
	if (!cone)
		return {
			silhouette: [...arc([0, 0], r, ry, Math.PI, 2 * Math.PI), ...arc([0, h], r, ry, 0, Math.PI)],
			edges: [
				{ from: [-r, 0], to: [-r, h], hidden: false },
				{ from: [r, 0], to: [r, h], hidden: false }
			],
			ellipses: [
				{ c: [0, 0], rx: r, ry, hidden: [0, Math.PI] },
				{ c: [0, h], rx: r, ry }
			]
		};
	// The sides touch the base where sin t = ry / h, a little behind its widest points.
	const t0 = Math.asin(Math.min(ry / h, 1));
	const [x0, y0] = [r * Math.cos(t0), ry * Math.sin(t0)];
	return {
		silhouette: [...arc([0, 0], r, ry, Math.PI - t0, 2 * Math.PI + t0), [0, h]],
		edges: [
			{ from: [-x0, y0], to: [0, h], hidden: false },
			{ from: [x0, y0], to: [0, h], hidden: false }
		],
		ellipses: [{ c: [0, 0], rx: r, ry, hidden: [t0, Math.PI - t0] }]
	};
}

function cilindro(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	let r: Val;
	let h: Val;
	if (mode === 'diametro') {
		const d = m.d;
		r = half(d);
		h = m.h;
		steps.push({ group: 'Il raggio', say: 'Calcola il raggio: è metà del diametro.', math: calc('r = \\dfrac{d}{2}', [`\\dfrac{${vt(d)}}{2}`], r, u) });
	} else {
		r = m.r;
		h = m.h;
	}
	const Ab = mul(PI, square(r));
	const abStep: Step = { group: 'La base', say: "Calcola l'area di base: è un cerchio di raggio $r$.", math: calc('A_b = \\pi r^2', [`\\pi \\cdot ${pow(r, 2)}`], Ab, u, 2) };
	steps.push(abStep);
	if (mode === 'volume') {
		const V = m.V;
		h = div(V, Ab);
		abStep.group = "L'altezza";
		steps.push({ say: "Ricava l'altezza: dividi il volume per l'area di base.", math: calc('h = \\dfrac{V}{A_b}', [`\\dfrac{${vt(V)}}{${vt(Ab)}}`], h, u) });
	}
	const C = mul(mul(int(2), PI), r);
	const Al = mul(C, h);
	const twoAb = twice(Ab);
	const At = plus(Al, twoAb);
	const V = mul(Ab, h);
	steps.push(
		{ group: mode === 'volume' ? 'Le superfici' : undefined, say: 'Calcola la circonferenza di base.', math: calc('C = 2\\pi r', [`2\\pi \\cdot ${vp(r)}`], C, u) },
		{ group: mode === 'volume' ? undefined : 'Le superfici', say: "Calcola l'area laterale: srotolata è un rettangolo, base $C$ e altezza $h$.", math: calc('A_l = C \\cdot h', [`${vp(C)} \\cdot ${vp(h)}`], Al, u, 2) },
		{ say: "Calcola l'area totale: aggiungi le due basi.", math: calc('A_t = A_l + 2A_b', [`${vt(Al)} + 2 \\cdot ${vp(Ab)}`, `${vt(Al)} + ${vt(twoAb)}`], At, u, 2) }
	);
	if (mode !== 'volume') steps.push({ group: 'Il volume', say: "Calcola il volume: l'area di base per l'altezza.", math: calc('V = A_b \\cdot h', [`${vp(Ab)} \\cdot ${vp(h)}`], V, u, 3) });
	if (mode === 'raggio') note(steps[steps.length - 1], 'Per il decimale si usa $\\pi \\approx 3{,}1416$.');
	const items: Item[] = [];
	if (mode === 'diametro') items.push(['Raggio', 'r', r, 1]);
	if (mode === 'volume') items.push(['Altezza', 'h', h, 1]);
	items.push([AB, 'A_b', Ab, 2], [AL, 'A_l', Al, 2], [AT, 'A_t', At, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	const [R, H] = [r.x, h.x];
	const sketch: SolidSketch = {
		...roundSketch(R, H, false),
		lines: mode === 'diametro' ? [[[0, 0], [0, H]], [[-R, H], [R, H]]] : [[[0, 0], [0, H]], [[0, H], [R, H]]],
		dots: [[0, 0], [0, H]],
		labels: [mode === 'diametro' ? lab([-R, H], [R, H], 'd', m.d, true, u, 'right', 1) : lab([0, H], [R, H], 'r', r, true, u, 'right', 1), lab([R, 0], [R, H], 'h', h, mode !== 'volume', u, 'right')],
		right: mode === 'diametro' ? [] : [[[0, H], [1, H], [0, H - 1]]]
	};
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	return done(items, u, steps, sketch);
}

function cono(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	const r = m.r;
	const Ab = mul(PI, square(r));
	const abStep: Step = { say: "Calcola l'area di base: è un cerchio di raggio $r$.", math: calc('A_b = \\pi r^2', [`\\pi \\cdot ${pow(r, 2)}`], Ab, u, 2) };
	let h: Val;
	let a: Val;
	const given = { h: false, a: false };
	if (mode === 'apotema') {
		a = m.a;
		given.a = true;
		if (cmp(a, r) <= 0) return failed("L'apotema deve essere più lungo del raggio: è l'ipotenusa del triangolo che forma con raggio e altezza. Per esempio: raggio 5, apotema 13.");
		h = sqrt(sub(square(a), square(r)));
		steps.push({ say: "Calcola l'altezza con Pitagora: l'apotema è l'ipotenusa, il raggio un cateto.", math: calc('h = \\sqrt{a^2 - r^2}', pythagorasSubs(a, r, '-'), h, u) }, abStep);
	} else {
		if (mode === 'volume') {
			const V = m.V;
			h = div(mul(int(3), V), Ab);
			steps.push(abStep, { say: "Ricava l'altezza: moltiplica il volume per 3 e dividi per l'area di base.", math: calc('h = \\dfrac{3V}{A_b}', [`\\dfrac{3 \\cdot ${vp(V)}}{${vt(Ab)}}`, `\\dfrac{${vt(mul(int(3), V))}}{${vt(Ab)}}`], h, u) });
		} else {
			h = m.h;
			given.h = true;
		}
		a = sqrt(add(square(h), square(r)));
		steps.push({ say: "Calcola l'apotema con Pitagora: i cateti sono l'altezza e il raggio.", math: calc('a = \\sqrt{h^2 + r^2}', pythagorasSubs(h, r, '+'), a, u) });
		if (mode !== 'volume') steps.push(abStep);
	}
	const Al = mul(mul(PI, r), a);
	const At = plus(Al, Ab);
	const V = div(mul(Ab, h), int(3));
	steps.push(
		{ say: "Calcola l'area laterale: $\\pi$ per il raggio per l'apotema.", math: calc('A_l = \\pi r a', [`\\pi \\cdot ${vp(r)} \\cdot ${vp(a)}`], Al, u, 2) },
		{ say: "Calcola l'area totale: aggiungi la base.", math: calc('A_t = A_l + A_b', [`${vt(Al)} + ${vt(Ab)}`], At, u, 2) }
	);
	if (mode !== 'volume') steps.push({ say: "Calcola il volume: l'area di base per l'altezza, diviso 3.", math: calc('V = \\dfrac{A_b \\cdot h}{3}', [`\\dfrac{${vp(Ab)} \\cdot ${vp(h)}}{3}`, `\\dfrac{${vt(mul(Ab, h))}}{3}`], V, u, 3) });
	const items: Item[] = [];
	if (!given.h) items.push(['Altezza', 'h', h, 1]);
	if (!given.a) items.push(['Apotema', 'a', a, 1]);
	items.push([AB, 'A_b', Ab, 2], [AL, 'A_l', Al, 2], [AT, 'A_t', At, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	const [R, H] = [r.x, h.x];
	const sketch: SolidSketch = {
		...roundSketch(R, H, true),
		lines: [
			[
				[0, 0],
				[0, H]
			],
			[
				[0, 0],
				[R, 0]
			]
		],
		dots: [[0, 0]],
		labels: [lab([0, 0], [R, 0], 'r', r, true, u, 'right', 1), lab([0, 0], [0, H], 'h', h, given.h, u, 'left', 0.3), lab([R, 0], [0, H], 'a', a, given.a, u, 'right')],
		right: [[[0, 0], [1, 0], [0, 1]]]
	};
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	return done(items, u, steps, sketch);
}

function sfera(mode: string, m: Measures, u: Unit): SolidResult {
	const steps: Step[] = [];
	let r: Val;
	if (mode === 'diametro') {
		const d = m.d;
		r = half(d);
		steps.push({ say: 'Calcola il raggio: è metà del diametro.', math: calc('r = \\dfrac{d}{2}', [`\\dfrac{${vt(d)}}{2}`], r, u) });
	} else if (mode === 'superficie') {
		const S = m.S;
		const ratio = div(S, mul(int(4), PI));
		r = snapped(sqrt(ratio));
		steps.push({ say: 'Ricava il raggio: dividi la superficie per $4\\pi$, poi fai la radice quadrata.', math: calc('r = \\sqrt{\\dfrac{S}{4\\pi}}', [`\\sqrt{\\dfrac{${vt(S)}}{4\\pi}}`, ...(isRational(ratio) ? rootSubs(ratio) : [`\\sqrt{${vt(ratio)}}`])], r, u) });
		if (!r.c) note(steps[0], ROUNDED('Il raggio'));
	} else if (mode === 'volume') {
		const V = m.V;
		const ratio = div(mul(int(3), V), mul(int(4), PI));
		r = snapped(cbrt(ratio));
		const subs = [`\\sqrt[3]{\\dfrac{3 \\cdot ${vp(V)}}{4\\pi}}`, `\\sqrt[3]{${vt(ratio)}}`];
		if (r.c?.isInteger()) subs.push(`\\sqrt[3]{${pow(r, 3)}}`);
		steps.push({ say: 'Ricava il raggio: moltiplica il volume per 3, dividi per $4\\pi$, fai la radice cubica.', math: calc('r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}', subs, r, u) });
		if (!r.c) note(steps[0], ROUNDED('Il raggio'));
	} else {
		r = m.r;
	}
	const r2 = square(r);
	const r3 = mul(r2, r);
	const S = mul(mul(int(4), PI), r2);
	const V = mul(mul(val(q(4, 3)), PI), r3);
	if (mode !== 'superficie') steps.push({ say: 'Calcola la superficie sferica: 4 volte il cerchio massimo.', math: calc('S = 4\\pi r^2', [`4\\pi \\cdot ${pow(r, 2)}`, `4\\pi \\cdot ${vt(r2)}`], S, u, 2) });
	if (mode !== 'volume') steps.push({ say: 'Calcola il volume della sfera.', math: calc('V = \\dfrac{4}{3}\\pi r^3', [`\\dfrac{4}{3}\\pi \\cdot ${pow(r, 3)}`, `\\dfrac{4}{3}\\pi \\cdot ${vt(r3)}`], V, u, 3) });
	if (mode === 'raggio') note(steps[steps.length - 1], 'Per il decimale si usa $\\pi \\approx 3{,}1416$.');
	const items: Item[] = [];
	if (mode !== 'raggio') items.push(['Raggio', 'r', r, 1]);
	if (mode !== 'superficie') items.push(['Superficie sferica', 'S', S, 2]);
	if (mode !== 'volume') items.push([VOL, 'V', V, 3]);
	const R = r.x;
	const sketch: SolidSketch = {
		silhouette: arc([0, 0], R, R, 0, 2 * Math.PI, 72),
		edges: [],
		ellipses: [
			{ c: [0, 0], rx: R, ry: R },
			{ c: [0, 0], rx: R, ry: FLAT * R, hidden: [0, Math.PI] }
		],
		lines: mode === 'diametro' ? [[[-R, 0], [R, 0]]] : [[[0, 0], [R, 0]]],
		dots: [[0, 0]],
		labels: mode === 'diametro' ? [lab([-R, 0], [R, 0], 'd', m.d, true, u, 'right', 1)] : [lab([0, 0], [R, 0], 'r', r, mode === 'raggio', u, 'right', 1)],
		right: []
	};
	if (mode === 'superficie') sketch.caption = caption('S', m.S, u, 2);
	if (mode === 'volume') sketch.caption = caption('V', m.V, u, 3);
	return done(items, u, steps, sketch);
}

// ---------------------------------------------------------------------------------------------------------------

/** Surfaces and volume of a solid, from the inputs of one of its modes; `base` only for the prism. */
export function solido(solid: Solid, mode: string, values: Partial<Record<FieldKey, string>>, unit: Unit = '', base: PrismBase = 'triangolo'): SolidResult {
	const spec = SOLIDS[solid].modes.find((x) => x.value === mode) ?? SOLIDS[solid].modes[0];
	const m = readAll(spec, values);
	if (typeof m === 'string') return failed(m);
	try {
		switch (solid) {
			case 'cubo':
				return cubo(spec.value, m, unit);
			case 'parallelepipedo':
				return parallelepipedo(spec.value, m, unit);
			case 'prisma':
				return prisma(spec.value, m, unit, base);
			case 'piramide':
				return piramide(spec.value, m, unit);
			case 'cilindro':
				return cilindro(spec.value, m, unit);
			case 'cono':
				return cono(spec.value, m, unit);
			case 'sfera':
				return sfera(spec.value, m, unit);
		}
	} catch {
		return failed("Questi numeri sono troppo grandi per un calcolo esatto: prova con misure più piccole, per esempio in un'unità più grande.");
	}
}
