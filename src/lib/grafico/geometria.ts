/**
 * The geometry of the plotter: objects built from other objects (the line through A and B, the circle through three
 * points), found again whenever what they come from moves, and their equations as the school writes them.
 * vault/Prodotti/Studenti/Geometria analitica nel plotter.md
 *
 * Everything is in the coordinates the axes are read in. A row of the plotter is either a formula or a `Build`; both
 * become a `Geo`, so a construction can start from a point typed as A = (2; 3) or from a line typed as y = 2x + 1.
 */

import type { Point } from './curva';

export const BUILD_TYPES = ['on', 'meet', 'midpoint', 'line', 'segment', 'parallel', 'perpendicular', 'bisector', 'circle', 'circle3', 'distance', 'ray', 'vector', 'anglebisector', 'circler', 'compass', 'tangent', 'polygon', 'angle', 'slope', 'centre', 'reflect', 'translate', 'rotate', 'dilate', 'regression'] as const;
export type BuildType = (typeof BUILD_TYPES)[number];

/**
 * How an object is built, from the rows in `of` (by id), in the order its type wants:
 *   on: [object], with `at` where along it        meet: [object, object], with `index` among their common points
 *   midpoint, line, segment, bisector: [A, B]       parallel, perpendicular: [line, point]
 *   circle: [centre, point]   circle3: [A, B, C]    distance: [point or line, point or line]
 *   ray, vector: [A, B]       circler: [centre], with `at` the radius       compass: [A, B, centre], the radius is AB
 *   anglebisector: [A, vertex, C], or [line, line] with `index` for which of the two
 *   tangent: [point, conic or curve], with `index` among the tangents from the point
 *   polygon: its vertices     angle: [A, vertex, C] or [line, line]     slope: [line]
  *   centre: [A, B, C], with `index` 0 for the centroid, 1 the circumcentre, 2 the incentre, 3 the orthocentre
 *   reflect: [object, line or point]     translate: [object, vector] or [object, from, to]
 *   rotate: [object, centre], with `at` the angle in degrees, anticlockwise     dilate: [object, centre], with `at` the ratio
 *   regression: the points the line is fitted to, by least squares
 */
export interface Build {
	type: BuildType;
	of: number[];
	at?: number;
	index?: number;
}

/** The coefficients of A x² + B xy + C y² + D x + E y + F = 0. */
export type Conic = [number, number, number, number, number, number];

export type Geo =
	| { kind: 'point'; x: number; y: number }
	/** The points p + t·d; a segment is t from 0 to 1, a ray t from 0 on. `arrow` for a vector, drawn with its tip. */
		| { kind: 'line'; p: Point; d: Point; segment?: true; ray?: true; arrow?: true; /** For a line fitted to points: r, how well it fits. */ fit?: number }
	/** `f` when the conic is the graph of a function (a parabola written y = x²): a point sits on it by its x. */
	| { kind: 'conic'; q: Conic; circle?: { c: Point; r: number }; f?: (x: number) => number }
	/** A function that is neither a line nor a conic: a point can sit on it, nothing more yet. */
	| { kind: 'curve'; f: (x: number) => number }
	| { kind: 'measure'; value: number; from: Point; to: Point }
	| { kind: 'polygon'; points: Point[] }
	/** The angle at `vertex` between the directions `a` and `b`, in radians, from 0 to π. */
	| { kind: 'angle'; vertex: Point; a: Point; b: Point; value: number }
	/** The slope of a line, shown as a step of one unit from `at`. */
	| { kind: 'slope'; at: Point; value: number }
	/** Nothing to draw, and why, for the row. */
	| { kind: 'none'; why: string };

const none = (why: string): Geo => ({ kind: 'none', why });
const EPS = 1e-9;
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
const length = (a: Point) => Math.hypot(a.x, a.y);

/** a x + b y + c = 0 for a line. */
export function coefficients(line: { p: Point; d: Point }): [number, number, number] {
	const a = line.d.y;
	const b = -line.d.x;
	return [a, b, -(a * line.p.x + b * line.p.y)];
}

const conicAt = (q: Conic, x: number, y: number) => q[0] * x * x + q[1] * x * y + q[2] * y * y + q[3] * x + q[4] * y + q[5];

function circleConic(c: Point, r: number): Geo {
	return { kind: 'conic', q: [1, 0, 1, -2 * c.x, -2 * c.y, c.x * c.x + c.y * c.y - r * r], circle: { c, r } };
}

// ---------------------------------------------------------------- transformations and fits

/** A 2 × 2 matrix by rows: [a, b, c, d] sends (x; y) to (ax + by; cx + dy). */
type Matrix = [number, number, number, number];
const apply = (m: Matrix, p: Point): Point => ({ x: m[0] * p.x + m[1] * p.y, y: m[2] * p.x + m[3] * p.y });

/** An object after p ↦ m·p + t: a symmetry, a translation, a rotation, a dilation. What is only a size has no image. */
function transformed(geo: Geo, m: Matrix, t: Point): Geo {
	const map = (p: Point): Point => {
		const q = apply(m, p);
		return { x: q.x + t.x, y: q.y + t.y };
	};
	if (geo.kind === 'point') return { kind: 'point', ...map(geo) };
	if (geo.kind === 'line') return { ...geo, p: map(geo.p), d: apply(m, geo.d) };
	if (geo.kind === 'polygon') return { kind: 'polygon', points: geo.points.map(map) };
		if (geo.kind === 'conic') {
		const det = m[0] * m[3] - m[1] * m[2];
		// the transformations here keep shapes: a circle goes to the circle of the centre's image
		if (geo.circle) return circleConic(map(geo.circle.c), geo.circle.r * Math.sqrt(Math.abs(det)));
		// a point is on the image when the point it comes from is on the conic
		const back = (x: number, y: number): [number, number] => [(m[3] * (x - t.x) - m[1] * (y - t.y)) / det, (-m[2] * (x - t.x) + m[0] * (y - t.y)) / det];
		return fromImplicit((x, y) => conicAt(geo.q, ...back(x, y))) ?? none('Questa conica non ha un’immagine che si possa scrivere.');
	}
	return none('Si trasformano punti, rette, segmenti, vettori, circonferenze, coniche e poligoni.');
}

/** The line of least squares through some points, y = mx + q, with r, how well it fits (1 or −1 for points in a line). */
export function regression(points: Point[]): { m: number; q: number; r: number; mean: Point } | null {
	const n = points.length;
	const mean = { x: points.reduce((s, p) => s + p.x, 0) / n, y: points.reduce((s, p) => s + p.y, 0) / n };
	const sxx = points.reduce((s, p) => s + (p.x - mean.x) ** 2, 0);
	const syy = points.reduce((s, p) => s + (p.y - mean.y) ** 2, 0);
	const sxy = points.reduce((s, p) => s + (p.x - mean.x) * (p.y - mean.y), 0);
	if (sxx < EPS) return null;
	const m = sxy / sxx;
	return { m, q: mean.y - m * mean.x, r: syy < EPS ? 1 : sxy / Math.sqrt(sxx * syy), mean };
}

/** A x² + B xy + C y² + D x + E y + F = 0, with the first coefficient positive. */
export function conicEquation(q: Conic): string {
	const lead = q.find((v) => Math.abs(v) > 1e-12) ?? 1;
	const k = q.map((v) => v / lead) as Conic;
	const names = ['x^2', 'xy', 'y^2', 'x', 'y', ''];
	let out = '';
	k.forEach((v, i) => (out += term(v, names[i], out === '')));
	return `${out || '0'}=0`;
}

// ---------------------------------------------------------------- a formula as an object

/**
 * The line or the conic that F(x, y) = 0 is, when F is a polynomial of degree two at most: its coefficients are read
 * from six values and checked on four more. Null for anything else.
 */
export function fromImplicit(F: (x: number, y: number) => number): Geo | null {
	const f = F(0, 0);
	const [px, mx, py, my] = [F(1, 0), F(-1, 0), F(0, 1), F(0, -1)];
	const A = (px + mx) / 2 - f;
	const D = (px - mx) / 2;
	const C = (py + my) / 2 - f;
	const E = (py - my) / 2;
	const B = F(1, 1) - A - C - D - E - f;
	const q: Conic = [A, B, C, D, E, f];
	if (!q.every(Number.isFinite)) return null;
	const size = Math.max(...q.map(Math.abs));
	if (size < 1e-12) return null;
	for (const [x, y] of [
		[2, 3],
		[-3, 1.5],
		[0.7, -2.2],
		[5, -4]
	]) {
		const value = F(x, y);
		if (!Number.isFinite(value) || Math.abs(value - conicAt(q, x, y)) > 1e-7 * size * 40) return null;
	}
	const small = (v: number) => Math.abs(v) < 1e-10 * size;
	const tidy = q.map((v) => (small(v) ? 0 : v)) as Conic;
	if (tidy[0] === 0 && tidy[1] === 0 && tidy[2] === 0) {
		if (tidy[3] === 0 && tidy[4] === 0) return null;
		return lineFrom(tidy[3], tidy[4], tidy[5]);
	}
	if (tidy[1] === 0 && Math.abs(tidy[0] - tidy[2]) < 1e-10 * size) {
		const c = { x: -tidy[3] / (2 * tidy[0]), y: -tidy[4] / (2 * tidy[0]) };
		const r2 = c.x * c.x + c.y * c.y - tidy[5] / tidy[0];
		if (r2 > 0) return { kind: 'conic', q: tidy, circle: { c, r: Math.sqrt(r2) } };
	}
	return { kind: 'conic', q: tidy };
}

/** The line a x + b y + c = 0, from its point nearest to the origin, towards the right (or up, when it is vertical). */
function lineFrom(a: number, b: number, c: number): Geo {
	const n = a * a + b * b;
	let d = { x: -b, y: a };
	if (d.x < 0 || (d.x === 0 && d.y < 0)) d = { x: -d.x, y: -d.y };
	return { kind: 'line', p: { x: (-a * c) / n, y: (-b * c) / n }, d };
}

/** y = f(x) as an object: a line, a parabola, or a curve a point can sit on. */
export function fromFunction(f: (x: number) => number): Geo {
	const known = fromImplicit((x, y) => y - f(x));
	if (!known) return { kind: 'curve', f };
	return known.kind === 'conic' ? { ...known, f } : known;
}

// ---------------------------------------------------------------- where two objects meet

/** Whether the common points of two objects can be found: lines and conics, two conics only when their difference is a line (two circles). */
export function canMeet(g: Geo, h: Geo): boolean {
	if (g.kind === 'line') return h.kind === 'line' || h.kind === 'conic';
	if (g.kind === 'conic') return h.kind === 'line' || (h.kind === 'conic' && radical(g.q, h.q) !== null);
	return false;
}

/** The line that two conics with the same square terms have in common (the radical axis of two circles), or null. */
function radical(q: Conic, r: Conic): [number, number, number] | null {
	const lead = [0, 1, 2].reduce((best, i) => (Math.abs(r[i]) > Math.abs(r[best]) ? i : best), 0);
	if (Math.abs(r[lead]) < EPS) return null;
	const k = q[lead] / r[lead];
	const size = Math.max(...q.map(Math.abs), ...r.map((v) => Math.abs(v * k)));
	if ([0, 1, 2].some((i) => Math.abs(q[i] - k * r[i]) > 1e-9 * size)) return null;
	const [a, b, c] = [q[3] - k * r[3], q[4] - k * r[4], q[5] - k * r[5]];
	return Math.abs(a) < 1e-9 * size && Math.abs(b) < 1e-9 * size ? null : [a, b, c];
}

const within = (line: { segment?: true; ray?: true }, t: number) => (!line.segment || (t >= -EPS && t <= 1 + EPS)) && (!line.ray || t >= -EPS);

function lineLine(g: Extract<Geo, { kind: 'line' }>, h: Extract<Geo, { kind: 'line' }>): Point[] {
	const cross = g.d.x * h.d.y - g.d.y * h.d.x;
	if (Math.abs(cross) < EPS * length(g.d) * length(h.d)) return [];
	const w = sub(h.p, g.p);
	const t = (w.x * h.d.y - w.y * h.d.x) / cross;
	const u = (w.x * g.d.y - w.y * g.d.x) / cross;
	return within(g, t) && within(h, u) ? [{ x: g.p.x + t * g.d.x, y: g.p.y + t * g.d.y }] : [];
}

function lineConic(g: Extract<Geo, { kind: 'line' }>, q: Conic): Point[] {
	const { p, d } = g;
	const a = q[0] * d.x * d.x + q[1] * d.x * d.y + q[2] * d.y * d.y;
	const b = 2 * q[0] * p.x * d.x + q[1] * (p.x * d.y + p.y * d.x) + 2 * q[2] * p.y * d.y + q[3] * d.x + q[4] * d.y;
	const c = conicAt(q, p.x, p.y);
	const size = Math.max(Math.abs(a), Math.abs(b), Math.abs(c));
	let ts: number[];
	if (Math.abs(a) < 1e-12 * size) ts = Math.abs(b) < 1e-12 * size ? [] : [-c / b];
	else {
		let disc = b * b - 4 * a * c;
		// a tangent line touches: rounding must not make it miss
		if (disc < 0 && disc > -1e-9 * (b * b + Math.abs(4 * a * c))) disc = 0;
		if (disc < 0) return [];
		const root = Math.sqrt(disc);
		ts = [(-b - root) / (2 * a), (-b + root) / (2 * a)].sort((s, t) => s - t);
	}
	return ts.filter((t) => within(g, t)).map((t) => ({ x: p.x + t * d.x, y: p.y + t * d.y }));
}

/** The common points of two objects, in an order that does not change while they move: along the line, from its start. */
export function intersections(g: Geo, h: Geo): Point[] {
	if (g.kind === 'line' && h.kind === 'line') return lineLine(g, h);
	if (g.kind === 'line' && h.kind === 'conic') return lineConic(g, h.q);
	if (g.kind === 'conic' && h.kind === 'line') return lineConic(h, g.q);
	if (g.kind === 'conic' && h.kind === 'conic') {
		const axis = radical(g.q, h.q);
		if (!axis) return [];
		return lineConic(lineFrom(...axis) as Extract<Geo, { kind: 'line' }>, g.q);
	}
	return [];
}

// ---------------------------------------------------------------- a point on an object

/** Where along an object the point nearest to p is: t on a line, the angle on a circle, x on a curve. Null where a point cannot sit. */
export function project(g: Geo, p: Point): number | null {
	if (g.kind === 'line') {
		const t = dot(sub(p, g.p), g.d) / dot(g.d, g.d);
		return g.segment ? Math.min(1, Math.max(0, t)) : g.ray ? Math.max(0, t) : t;
	}
	if (g.kind === 'conic' && g.circle) return Math.atan2(p.y - g.circle.c.y, p.x - g.circle.c.x);
	if (g.kind === 'curve' || (g.kind === 'conic' && g.f)) return p.x;
	return null;
}

export function pointAt(g: Geo, at: number): Point | null {
	if (g.kind === 'line') return { x: g.p.x + at * g.d.x, y: g.p.y + at * g.d.y };
	if (g.kind === 'conic' && g.circle) return { x: g.circle.c.x + g.circle.r * Math.cos(at), y: g.circle.c.y + g.circle.r * Math.sin(at) };
	if (g.kind === 'curve' || (g.kind === 'conic' && g.f)) {
		const y = g.f!(at);
		return Number.isFinite(y) ? { x: at, y } : null;
	}
	return null;
}

/** How far the pointer is from an object, in pixels, with `sx` and `sy` pixels to a unit. */
export function reach(g: Geo, p: Point, sx: number, sy: number): number {
	const pixels = (a: Point, b: Point) => Math.hypot((a.x - b.x) * sx, (a.y - b.y) * sy);
	if (g.kind === 'point') return pixels(g, p);
	if (g.kind === 'line') {
		if (g.segment || g.ray) {
			const t = dot(sub(p, g.p), g.d) / dot(g.d, g.d);
			if (t < 0) return pixels(g.p, p);
			if (g.segment && t > 1) return pixels({ x: g.p.x + g.d.x, y: g.p.y + g.d.y }, p);
		}
		const [a, b, c] = coefficients(g);
		return Math.abs(a * p.x + b * p.y + c) / Math.hypot(a / sx, b / sy);
	}
	if (g.kind === 'conic') {
		const gx = 2 * g.q[0] * p.x + g.q[1] * p.y + g.q[3];
		const gy = g.q[1] * p.x + 2 * g.q[2] * p.y + g.q[4];
		const slope = Math.hypot(gx / sx, gy / sy);
		return slope > 0 ? Math.abs(conicAt(g.q, p.x, p.y)) / slope : Infinity;
	}
	if (g.kind === 'polygon') return Math.min(...g.points.map((a, i) => reach({ kind: 'line', p: a, d: sub(g.points[(i + 1) % g.points.length], a), segment: true }, p, sx, sy)));
	if (g.kind === 'curve') {
		const y = g.f(p.x);
		if (!Number.isFinite(y)) return Infinity;
		const h = 1 / sx;
		const m = ((g.f(p.x + h) - g.f(p.x - h)) / (2 * h)) * (sy / sx);
		return (Math.abs(y - p.y) * sy) / Math.sqrt(1 + (Number.isFinite(m) ? m * m : 0));
	}
	return Infinity;
}

// ---------------------------------------------------------------- building

// ---------------------------------------------------------------- tangents, centres

/** The tangents from a point to a conic or to the graph of a function: the one at the point when it is on the curve, those through it otherwise. */
export function tangents(P: Point, g: Geo): Extract<Geo, { kind: 'line' }>[] {
	if (g.kind === 'curve') {
		// on a curve that is no conic: the tangent where the curve has the x of the point
		const h = 1e-5 * Math.max(1, Math.abs(P.x));
		const y = g.f(P.x);
		const m = (g.f(P.x + h) - g.f(P.x - h)) / (2 * h);
		return Number.isFinite(y) && Number.isFinite(m) ? [{ kind: 'line', p: { x: P.x, y }, d: { x: 1, y: m } }] : [];
	}
	if (g.kind !== 'conic') return [];
	const q = g.q;
	// the polar of the point: the tangent itself when the point is on the conic, the line of the two points of tangency otherwise
	const polar: [number, number, number] = [2 * q[0] * P.x + q[1] * P.y + q[3], q[1] * P.x + 2 * q[2] * P.y + q[4], q[3] * P.x + q[4] * P.y + 2 * q[5]];
	if (Math.abs(polar[0]) + Math.abs(polar[1]) < EPS) return [];
	const size = Math.abs(q[0] * P.x * P.x) + Math.abs(q[1] * P.x * P.y) + Math.abs(q[2] * P.y * P.y) + Math.abs(q[3] * P.x) + Math.abs(q[4] * P.y) + Math.abs(q[5]);
	const line = lineFrom(...polar) as Extract<Geo, { kind: 'line' }>;
	if (Math.abs(conicAt(q, P.x, P.y)) < 1e-7 * Math.max(1, size)) return [line];
	const touch = lineConic(line, q);
	if (touch.length === 2 && length(sub(touch[0], touch[1])) < EPS) return [];
	return touch.map((T) => ({ kind: 'line', p: P, d: sub(T, P) }));
}

/** The centre of the circle through three points, or null when they are on a line. */
function circumcentre(A: Point, B: Point, C: Point): Point | null {
	const [ab, ac] = [sub(B, A), sub(C, A)];
	const cross = ab.x * ac.y - ab.y * ac.x;
	if (Math.abs(cross) < EPS * Math.max(1, length(ab) * length(ac))) return null;
	const [b2, c2] = [dot(ab, ab), dot(ac, ac)];
	return { x: A.x + (ac.y * b2 - ab.y * c2) / (2 * cross), y: A.y + (ab.x * c2 - ac.x * b2) / (2 * cross) };
}

const unit = (v: Point): Point => ({ x: v.x / length(v), y: v.y / length(v) });
const ALIGNED = 'I tre punti sono allineati: non fanno un triangolo.';

const NO_POINT = 'Serve un punto: quello da cui partiva non c’è più.';
const NO_LINE = 'Serve una retta: quella da cui partiva non c’è più.';

/** The object a build gives, from the objects of its rows. */
export function construct(build: Build, get: (id: number) => Geo): Geo {
	const parts = build.of.map(get);
	const broken = parts.find((g) => g.kind === 'none');
	if (broken) return broken;
	const point = (i: number) => (parts[i]?.kind === 'point' ? (parts[i] as Extract<Geo, { kind: 'point' }>) : null);
	const line = (i: number) => (parts[i]?.kind === 'line' ? (parts[i] as Extract<Geo, { kind: 'line' }>) : null);
	const [A, B, C] = [point(0), point(1), point(2)];

	switch (build.type) {
		case 'on': {
			const at = parts[0] && pointAt(parts[0], build.at ?? 0);
			return at ? { kind: 'point', ...at } : none('Qui l’oggetto su cui sta il punto non ha un valore.');
		}
		case 'meet': {
			if (parts.length < 2 || !canMeet(parts[0], parts[1])) return none('Per ora le intersezioni si trovano tra rette, circonferenze e coniche.');
			const at = intersections(parts[0], parts[1])[build.index ?? 0];
			return at ? { kind: 'point', ...at } : none('I due oggetti qui non si incontrano.');
		}
		case 'midpoint':
			return A && B ? { kind: 'point', x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 } : none(NO_POINT);
		case 'line':
		case 'segment': {
			if (!A || !B) return none(NO_POINT);
			const d = sub(B, A);
			if (length(d) < EPS) return none('I due punti coincidono: di rette ce ne sono infinite.');
			return build.type === 'segment' ? { kind: 'line', p: A, d, segment: true } : { kind: 'line', p: A, d };
		}
		case 'ray':
		case 'vector': {
			if (!A || !B) return none(NO_POINT);
			const d = sub(B, A);
			if (length(d) < EPS) return none('I due punti coincidono.');
			return build.type === 'ray' ? { kind: 'line', p: A, d, ray: true } : { kind: 'line', p: A, d, segment: true, arrow: true };
		}
		case 'anglebisector': {
			if (parts.length === 2) {
				const [g, h] = [line(0), line(1)];
				if (!g || !h) return none(NO_LINE);
				const [at] = lineLine({ ...g, segment: undefined, ray: undefined }, { ...h, segment: undefined, ray: undefined });
				if (!at) return none('Le due rette sono parallele: non fanno un angolo.');
				const [u, v] = [unit(g.d), unit(h.d)];
				return { kind: 'line', p: at, d: build.index ? sub(u, v) : { x: u.x + v.x, y: u.y + v.y } };
			}
			if (!A || !B || !C) return none(NO_POINT);
			if (length(sub(A, B)) < EPS || length(sub(C, B)) < EPS) return none('Un lato dell’angolo è un punto solo.');
			const [u, v] = [unit(sub(A, B)), unit(sub(C, B))];
			const d = { x: u.x + v.x, y: u.y + v.y };
			// a straight angle is halved by the perpendicular
			return { kind: 'line', p: B, d: length(d) < EPS ? { x: -u.y, y: u.x } : d };
		}
		case 'circler':
			if (!A) return none(NO_POINT);
			return (build.at ?? 0) > 0 ? circleConic(A, build.at!) : none('Il raggio è un numero maggiore di zero.');
		case 'compass': {
			if (!A || !B || !C) return none(NO_POINT);
			const r = length(sub(B, A));
			return r < EPS ? none('I due punti coincidono: il raggio è zero.') : circleConic(C, r);
		}
		case 'tangent': {
			if (!A) return none(NO_POINT);
			if (!parts[1] || (parts[1].kind !== 'conic' && parts[1].kind !== 'curve')) return none('La tangente si traccia a una conica o al grafico di una funzione.');
			return tangents(A, parts[1])[build.index ?? 0] ?? none('Da questo punto non partono tangenti: è dentro la curva.');
		}
				case 'reflect': {
			const mirror = parts[1];
			if (!parts[0] || !mirror) return none(NO_POINT);
			// in a point: every point goes as far on the other side
			if (mirror.kind === 'point') return transformed(parts[0], [-1, 0, 0, -1], { x: 2 * mirror.x, y: 2 * mirror.y });
			if (mirror.kind !== 'line') return none('La simmetria è rispetto a una retta o a un punto.');
			const u = unit(mirror.d);
			// p ↦ 2 (p·u) u − p about the line's point: the matrix 2uuᵀ − 1
			const m: Matrix = [2 * u.x * u.x - 1, 2 * u.x * u.y, 2 * u.x * u.y, 2 * u.y * u.y - 1];
			return transformed(parts[0], m, sub(mirror.p, apply(m, mirror.p)));
		}
		case 'translate': {
			const by = parts.length === 3 && B && C ? sub(C, B) : line(1)?.d;
			if (!parts[0] || !by) return none('La traslazione vuole un vettore, oppure due punti: da dove e fin dove.');
			return transformed(parts[0], [1, 0, 0, 1], by);
		}
		case 'rotate': {
			if (!parts[0] || !B) return none(NO_POINT);
			const angle = ((build.at ?? 0) * Math.PI) / 180;
			const [c, s] = [Math.cos(angle), Math.sin(angle)];
			const m: Matrix = [c, -s, s, c];
			return transformed(parts[0], m, sub(B, apply(m, B)));
		}
		case 'dilate': {
			if (!parts[0] || !B) return none(NO_POINT);
			const k = build.at ?? 1;
			if (Math.abs(k) < EPS) return none('Il rapporto di un’omotetia non è zero.');
			return transformed(parts[0], [k, 0, 0, k], { x: B.x * (1 - k), y: B.y * (1 - k) });
		}
		case 'regression': {
			const points = parts.filter((g): g is Extract<Geo, { kind: 'point' }> => g.kind === 'point');
			if (points.length !== parts.length || points.length < 2) return none('La retta di regressione vuole almeno due punti.');
			const fit = regression(points);
			return fit ? { kind: 'line', p: { x: fit.mean.x, y: fit.mean.y }, d: { x: 1, y: fit.m }, fit: fit.r } : none('I punti hanno tutti la stessa x: la retta sarebbe verticale.');
		}
		case 'polygon': {
			const points = parts.filter((g): g is Extract<Geo, { kind: 'point' }> => g.kind === 'point');
			return points.length === parts.length && points.length >= 3 ? { kind: 'polygon', points: points.map(({ x, y }) => ({ x, y })) } : none(NO_POINT);
		}
		case 'angle': {
			if (parts.length === 2) {
				const [g, h] = [line(0), line(1)];
				if (!g || !h) return none(NO_LINE);
				const [at] = lineLine({ ...g, segment: undefined, ray: undefined }, { ...h, segment: undefined, ray: undefined });
				if (!at) return none('Le due rette sono parallele: non fanno un angolo.');
				// of the angles two lines make, the one that is not obtuse
				const b = dot(g.d, h.d) < 0 ? { x: -h.d.x, y: -h.d.y } : h.d;
				return { kind: 'angle', vertex: at, a: g.d, b, value: Math.acos(Math.min(1, dot(g.d, b) / (length(g.d) * length(b)))) };
			}
			if (!A || !B || !C) return none(NO_POINT);
			const [u, v] = [sub(A, B), sub(C, B)];
			if (length(u) < EPS || length(v) < EPS) return none('Un lato dell’angolo è un punto solo.');
			return { kind: 'angle', vertex: B, a: u, b: v, value: Math.acos(Math.min(1, Math.max(-1, dot(u, v) / (length(u) * length(v))))) };
		}
		case 'slope': {
			const l = line(0);
			if (!l) return none(NO_LINE);
			const [a, b] = coefficients(l);
			return Math.abs(b) < 1e-12 * Math.max(1, Math.abs(a)) ? none('Una retta verticale non ha una pendenza.') : { kind: 'slope', at: l.p, value: -a / b };
		}
		case 'centre': {
			if (!A || !B || !C) return none(NO_POINT);
			const O = circumcentre(A, B, C);
			if (!O) return none(ALIGNED);
			if (build.index === 1) return { kind: 'point', ...O };
			if (build.index === 3) return { kind: 'point', x: A.x + B.x + C.x - 2 * O.x, y: A.y + B.y + C.y - 2 * O.y };
			// the incentre weighs each vertex by the side in front of it; the centroid weighs them the same
			const [a, b, c] = build.index === 2 ? [length(sub(B, C)), length(sub(C, A)), length(sub(A, B))] : [1, 1, 1];
			return { kind: 'point', x: (a * A.x + b * B.x + c * C.x) / (a + b + c), y: (a * A.y + b * B.y + c * C.y) / (a + b + c) };
		}
		case 'parallel':
		case 'perpendicular': {
			const l = line(0);
			const P = point(1);
			if (!l) return none(NO_LINE);
			if (!P) return none(NO_POINT);
			return { kind: 'line', p: P, d: build.type === 'parallel' ? l.d : { x: -l.d.y, y: l.d.x } };
		}
		case 'bisector': {
			if (!A || !B) return none(NO_POINT);
			const d = sub(B, A);
			if (length(d) < EPS) return none('I due punti coincidono: l’asse non c’è.');
			return { kind: 'line', p: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, d: { x: -d.y, y: d.x } };
		}
		case 'circle': {
			if (!A || !B) return none(NO_POINT);
			const r = length(sub(B, A));
			return r < EPS ? none('Il punto è sul centro: il raggio è zero.') : circleConic(A, r);
		}
		case 'circle3': {
			if (!A || !B || !C) return none(NO_POINT);
			const c = circumcentre(A, B, C);
			return c ? circleConic(c, length(sub(A, c))) : none('I tre punti sono allineati: per loro passa una retta, non una circonferenza.');
		}
		case 'distance': {
			const [g, h] = parts;
			if (!g || !h) return none(NO_POINT);
			if (g.kind === 'point' && h.kind === 'point') return { kind: 'measure', value: length(sub(g, h)), from: g, to: h };
			const foot = (P: Point, l: Extract<Geo, { kind: 'line' }>): Point => {
				const t = dot(sub(P, l.p), l.d) / dot(l.d, l.d);
				return { x: l.p.x + t * l.d.x, y: l.p.y + t * l.d.y };
			};
			if (g.kind === 'point' && h.kind === 'line') return { kind: 'measure', value: length(sub(g, foot(g, h))), from: g, to: foot(g, h) };
			if (g.kind === 'line' && h.kind === 'point') return { kind: 'measure', value: length(sub(h, foot(h, g))), from: h, to: foot(h, g) };
			if (g.kind === 'line' && h.kind === 'line') {
				if (Math.abs(g.d.x * h.d.y - g.d.y * h.d.x) > EPS * length(g.d) * length(h.d)) return none('Le due rette si incontrano: la loro distanza è 0.');
				return { kind: 'measure', value: length(sub(g.p, foot(g.p, h))), from: g.p, to: foot(g.p, h) };
			}
			return none('La distanza si misura tra punti e rette.');
		}
	}
}

// ---------------------------------------------------------------- equations

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** x as a fraction with a small denominator, when it is one. */
export function fraction(x: number, maxDen = 2000): [number, number] | null {
	if (!Number.isFinite(x)) return null;
	for (let den = 1; den <= maxDen; den++) {
		const num = Math.round(x * den);
		if (Math.abs(x * den - num) < 1e-9 * Math.max(1, Math.abs(x * den))) return [num, den];
	}
	return null;
}

const decimal = (x: number, digits = 3) => String(Number(x.toFixed(digits))).replace('.', '{,}');

/** A number in LaTeX: a whole number, a fraction, or three decimals with the comma. */
export function texNumber(x: number): string {
	const f = fraction(x);
	if (!f) return decimal(x);
	const [n, d] = f;
	return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}

/** √(x) for a length whose square is known, as the school writes it: 5, √13, (3√2)/2; decimals when the square is no fraction. */
export function texRoot(square: number): string {
	const f = fraction(square);
	if (!f || f[0] < 0) return decimal(Math.sqrt(Math.max(0, square)));
	// √(n/d) = √(n·d) / d, with the squares taken out of the root
	let inside = f[0] * f[1];
	let out = 1;
	for (let k = 2; k * k <= inside && k < 5000; k++)
		while (inside % (k * k) === 0) {
			inside /= k * k;
			out *= k;
		}
	const g = gcd(out, f[1]);
	const [num, den] = [out / g, f[1] / g];
	if (inside > 1e6) return decimal(Math.sqrt(square));
	const top = inside === 1 ? String(num) : `${num === 1 ? '' : num}\\sqrt{${inside}}`;
	return den === 1 ? top : `\\frac{${top}}{${den}}`;
}

/** k·name as a term after others: " + 2x", " - x", "" for zero. */
function term(k: number, name: string, first: boolean): string {
	if (Math.abs(k) < 1e-12) return '';
	const size = Math.abs(k);
	const body = name && Math.abs(size - 1) < 1e-12 ? name : `${texNumber(size)}${name}`;
	if (first) return `${k < 0 ? '-' : ''}${body}`;
	return `${k < 0 ? '-' : '+'}${body}`;
}

/** y = mx + q, or x = k for a vertical line. */
export function lineEquation(line: { p: Point; d: Point }): string {
	const [a, b, c] = coefficients(line);
	if (Math.abs(b) < 1e-12 * Math.max(1, Math.abs(a))) return `x=${texNumber(-c / a)}`;
	const right = term(-a / b, 'x', true) + term(-c / b, '', Math.abs(a / b) < 1e-12);
	return `y=${right || '0'}`;
}

/** x² + y² + ax + by + c = 0. */
export function circleEquation(circle: { c: Point; r: number }): string {
	const { c, r } = circle;
	return `x^2+y^2${term(-2 * c.x, 'x', false)}${term(-2 * c.y, 'y', false)}${term(c.x * c.x + c.y * c.y - r * r, '', false)}=0`;
}

/** The area of a polygon, by its vertices in order. */
export function polygonArea(points: Point[]): number {
	return Math.abs(points.reduce((sum, p, i) => sum + p.x * points[(i + 1) % points.length].y - points[(i + 1) % points.length].x * p.y, 0)) / 2;
}
export function polygonPerimeter(points: Point[]): number {
	return points.reduce((sum, p, i) => sum + length(sub(points[(i + 1) % points.length], p)), 0);
}

/** An angle in LaTeX, in degrees (45°, 37,2°) or in radians (π/4, 0,65). */
export function texAngle(radians: number, degrees: boolean): string {
	if (degrees) return `${String(Number(((radians * 180) / Math.PI).toFixed(1))).replace('.', '{,}')}^\\circ`;
	const f = fraction(radians / Math.PI, 24);
	if (!f) return decimal(radians);
	const [n, d] = f;
	if (n === 0) return '0';
	const top = `${n === 1 ? '' : n}\\pi`;
	return d === 1 ? top : `\\frac{${top}}{${d}}`;
}

export const pointText = (p: Point) => `\\left(${texNumber(p.x)};\\,${texNumber(p.y)}\\right)`;
