/**
 * The curve of y = f(x) as polylines for a window of the plane. Asymptotes and jumps break the line (tan x, 1/x),
 * the edge of the domain is reached exactly (√x starts at 0, ln x goes down along the axis), and the line is
 * refined where it bends. vault/Prodotti/Studenti/Grafico di funzioni.md
 */

export interface View {
	x0: number;
	x1: number;
	y0: number;
	y1: number;
}

export type Point = { x: number; y: number };

/** How many times an interval between two samples may be halved. */
const MAX_DEPTH = 12;
/** A midpoint farther than this from the chord, in pixels, asks for a finer line. */
const BEND = 0.3;
/** At the finest step, a rise of more than this many pixels that has stopped shrinking is a jump. */
const JUMP = 2;

/**
 * The polylines of f over the view, for a drawing `width` × `height` pixels. Points far above or below are kept at
 * three view heights, so a branch leaves the picture along its own direction.
 */
export function sampleFunction(f: (x: number) => number, view: View, width: number, height: number): Point[][] {
	const { x0, x1, y0, y1 } = view;
	const span = y1 - y0;
	const sy = height / span;
	const n = Math.round(Math.min(1400, Math.max(160, width)));
	const top = y1 + 3 * span;
	const bottom = y0 - 3 * span;
	const ok = Number.isFinite;

	const paths: Point[][] = [];
	let line: Point[] = [];
	const push = (x: number, y: number) => line.push({ x, y: Math.min(top, Math.max(bottom, y)) });
	const cut = () => {
		if (line.length > 1) paths.push(line);
		line = [];
	};
	const outside = (a: number, b: number) => (a > y1 && b > y1) || (a < y0 && b < y0);

	/** The last x on the finite side where f is still a number, between a finite end and one that is not. */
	const edge = (inside: number, out: number) => {
		let lo = inside;
		let hi = out;
		for (let i = 0; i < 48; i++) {
			const m = (lo + hi) / 2;
			if (ok(f(m))) lo = m;
			else hi = m;
		}
		return lo;
	};

	/** Adds the points of (a, b]; a is already on the line when f(a) is a number. `rise` is |Δy| of the interval this one halves. */
	const walk = (a: number, fa: number, b: number, fb: number, depth: number, rise: number) => {
		if (!ok(fa) && !ok(fb)) {
			// A base interval can hide a piece of the domain: look once in the middle.
			if (depth === 0) {
				const m = (a + b) / 2;
				const fm = f(m);
				if (ok(fm)) {
					walk(a, fa, m, fm, 1, Infinity);
					walk(m, fm, b, fb, 1, Infinity);
					return;
				}
			}
			cut();
			return;
		}
		if (!ok(fb)) {
			const e = edge(a, b);
			if (e !== a) push(e, f(e));
			cut();
			return;
		}
		if (!ok(fa)) {
			cut();
			const e = edge(b, a);
			if (e !== b) push(e, f(e));
			push(b, fb);
			return;
		}
		if (outside(fa, fb)) {
			push(b, fb);
			return;
		}
		const dy = Math.abs(fb - fa);
		if (depth >= MAX_DEPTH) {
			if (dy * sy > JUMP && dy > 0.75 * rise) cut();
			push(b, fb);
			return;
		}
		const m = (a + b) / 2;
		const fm = f(m);
		const bend = ok(fm) ? Math.abs(fm - (fa + fb) / 2) * sy : Infinity;
		if (bend > BEND || dy * sy > height) {
			walk(a, fa, m, fm, depth + 1, dy);
			walk(m, fm, b, fb, depth + 1, dy);
			return;
		}
		push(b, fb);
	};

	const dx = (x1 - x0) / n;
	let a = x0;
	let fa = f(a);
	if (ok(fa)) push(a, fa);
	for (let i = 1; i <= n; i++) {
		const b = i === n ? x1 : x0 + i * dx;
		const fb = f(b);
		walk(a, fa, b, fb, 0, Infinity);
		a = b;
		fa = fb;
	}
	cut();
	return paths;
}

/** A step for the labelled marks of an axis: 1, 2 or 5 times a power of ten, about `target` pixels apart. */
export function tickStep(unitsPerPixel: number, target = 80): number {
	const raw = unitsPerPixel * target;
	const power = Math.pow(10, Math.floor(Math.log10(raw)));
	const m = raw / power;
	return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * power;
}

/** The multiples of `step` inside [a, b], without the dust of floating point (0.30000000000000004). */
export function ticks(a: number, b: number, step: number): number[] {
	const out: number[] = [];
	const digits = Math.max(0, -Math.floor(Math.log10(step)) + 1);
	for (let k = Math.ceil(a / step); k * step <= b; k++) out.push(Number((k * step).toFixed(digits)));
	return out;
}

// ---------------------------------------------------------------- parametric curves

/**
 * The polylines of the curve (x(t), y(t)) for t from t0 to t1, for a drawing `width` × `height` pixels. The line is
 * refined where it bends or runs far between two values of t, and breaks where the curve has no value or jumps.
 */
export function sampleParametric(x: (t: number) => number, y: (t: number) => number, t0: number, t1: number, view: View, width: number, height: number): Point[][] {
	const sx = width / (view.x1 - view.x0);
	const sy = height / (view.y1 - view.y0);
	const far = 3 * Math.max(width, height);
	const ok = (p: Point) => Number.isFinite(p.x) && Number.isFinite(p.y);
	const at = (t: number): Point => ({ x: x(t), y: y(t) });
	/** The distance of two points on the screen, in pixels. */
	const apart = (p: Point, q: Point) => Math.hypot((p.x - q.x) * sx, (p.y - q.y) * sy);
	const off = (p: Point, q: Point) => (p.x < view.x0 && q.x < view.x0) || (p.x > view.x1 && q.x > view.x1) || (p.y < view.y0 && q.y < view.y0) || (p.y > view.y1 && q.y > view.y1);

	const paths: Point[][] = [];
	let line: Point[] = [];
	// a point far out of the picture is kept at three screens from its centre, along its own direction
	const push = (p: Point) => {
		const dx = (p.x - (view.x0 + view.x1) / 2) * sx;
		const dy = (p.y - (view.y0 + view.y1) / 2) * sy;
		const d = Math.hypot(dx, dy);
		line.push(d > far ? { x: (view.x0 + view.x1) / 2 + (dx * far) / d / sx, y: (view.y0 + view.y1) / 2 + (dy * far) / d / sy } : p);
	};
	const cut = () => {
		if (line.length > 1) paths.push(line);
		line = [];
	};

	const walk = (a: number, pa: Point, b: number, pb: Point, depth: number, gap: number) => {
		if (!ok(pa) && !ok(pb)) {
			cut();
			return;
		}
		if (!ok(pa) || !ok(pb)) {
			// the edge of the curve's domain in t: go to it from the side that has a value
			let [lo, hi] = ok(pa) ? [a, b] : [b, a];
			for (let i = 0; i < 40; i++) {
				const m = (lo + hi) / 2;
				if (ok(at(m))) lo = m;
				else hi = m;
			}
			const edge = at(lo);
			if (ok(pa)) {
				if (lo !== a) push(edge);
				cut();
			} else {
				cut();
				if (lo !== b) push(edge);
				push(pb);
			}
			return;
		}
		if (off(pa, pb)) {
			push(pb);
			return;
		}
		const d = apart(pa, pb);
		if (depth >= MAX_DEPTH) {
			if (d > JUMP && d > 0.75 * gap) cut();
			push(pb);
			return;
		}
		const m = (a + b) / 2;
		const pm = at(m);
		const bend = ok(pm) ? Math.hypot(((pa.x + pb.x) / 2 - pm.x) * sx, ((pa.y + pb.y) / 2 - pm.y) * sy) : Infinity;
		if (bend > BEND || d > 12) {
			walk(a, pa, m, pm, depth + 1, d);
			walk(m, pm, b, pb, depth + 1, d);
			return;
		}
		push(pb);
	};

	const n = 240;
	let a = t0;
	let pa = at(a);
	if (ok(pa)) push(pa);
	for (let i = 1; i <= n; i++) {
		const b = i === n ? t1 : t0 + ((t1 - t0) * i) / n;
		const pb = at(b);
		walk(a, pa, b, pb, 0, Infinity);
		a = b;
		pa = pb;
	}
	cut();
	return paths;
}

// ---------------------------------------------------------------- implicit curves

/** The side of a grid cell, in pixels. */
const CELL = 4;

/**
 * The polylines of F(x, y) = 0 over the view (marching squares): F is read on a grid of cells a few pixels wide,
 * a crossing is looked for on every side where F changes sign, and the crossings of a cell are joined. A change of
 * sign where F does not go to zero (the two sides of 1/x) is not the curve and is left out. A curve that touches
 * zero without crossing it, like (x² + y² − 1)² = 0, has no change of sign and is not found.
 */
export function sampleImplicit(F: (x: number, y: number) => number, view: View, width: number, height: number): Point[][] {
	return marching(F, view, width, height, false).lines;
}

/**
 * The edge of the region where F(x, y) is below zero and its inside, from one reading of F: the inside is the cells
 * of the same grid, whole where their four corners are in, cut along the edge where they are not. It matches the
 * edge to the pixel and costs no reading more than the edge alone.
 */
export function sampleRegionEdge(F: (x: number, y: number) => number, view: View, width: number, height: number): { lines: Point[][]; inside: Point[][] } {
	return marching(F, view, width, height, true);
}

function marching(F: (x: number, y: number) => number, view: View, width: number, height: number, fill: boolean): { lines: Point[][]; inside: Point[][] } {
	const dx = (view.x1 - view.x0) / Math.max(8, Math.min(400, Math.round(width / CELL)));
	const dy = (view.y1 - view.y0) / Math.max(8, Math.min(400, Math.round(height / CELL)));
		// The grid belongs to the plane, not to the window: its nodes are the same points wherever the window is, so
	// a curve dragged across the screen keeps its shape to the pixel. Tied to the window, every step of a drag would
	// read the curve at other points, and a fine outline (a fractal, a thin spike) would quiver as it moves.
	// The nodes are set off the round numbers by a part of a cell: a curve through the nodes themselves (x = 3, a
	// circle of radius 2) would be a string of exact zeros, which have no sign.
	const i0 = Math.floor(view.x0 / dx) - 1;
	const j0 = Math.floor(view.y0 / dy) - 1;
	const X = (i: number) => (i0 + i + 0.6181) * dx;
	const Y = (j: number) => (j0 + j + 0.382) * dy;
	const nx = Math.ceil((view.x1 - X(0)) / dx) + 1;
	const ny = Math.ceil((view.y1 - Y(0)) / dy) + 1;
	const cols = nx + 1;
	const values = new Float64Array(cols * (ny + 1));
	for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) values[j * cols + i] = F(X(i), Y(j));

	/** Crossings by the side they are on: side 2k is the one going right from node k, 2k + 1 the one going up. */
	const crossings = new Map<number, Point | null>();
	const crossing = (side: number): Point | null => {
		const known = crossings.get(side);
		if (known !== undefined) return known;
		const k = side >> 1;
		const i = k % cols;
		const j = (k - i) / cols;
		const right = (side & 1) === 0;
		let a: Point = { x: X(i), y: Y(j) };
		let b: Point = right ? { x: X(i + 1), y: Y(j) } : { x: X(i), y: Y(j + 1) };
		let fa = values[k];
		let fb = values[right ? k + 1 : k + cols];
		const size = Math.max(Math.abs(fa), Math.abs(fb));
		let found: Point | null = null;
		for (let step = 0; step < 10; step++) {
			const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
						const fm = F(m.x, m.y);
			// for a curve, a place with no value ends the search; for a region it is outside, and the search goes on
			if (!fill && !Number.isFinite(fm)) break;
			if (fm < 0 === fa < 0) {
				a = m;
				fa = fm;
			} else {
				b = m;
				fb = fm;
			}
		}
				if (Number.isFinite(fa) && Number.isFinite(fb)) {
			// at a zero F has shrunk towards it; between the two sides of a pole it has grown
			if (Math.max(Math.abs(fa), Math.abs(fb)) <= size * 0.25 || (fill && !Number.isFinite(size))) {
				// the last step is a straight line between the two ends, exact where F is one
				const u = fa === fb ? 0.5 : fa / (fa - fb);
				found = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
			}
		} else if (fill) {
			// A region ends where its condition stops having a value: the terms of z² + c that have run away to
			// infinity, the left of zero for a root. The edge is there, between the last point in and the first out.
			found = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
		}
		crossings.set(side, found);
		return found;
	};

	/** Pairs of sides joined across a cell, each as [side, side]. */
	const links = new Map<number, number[]>();
	const link = (s: number, t: number) => {
		if (!crossing(s) || !crossing(t)) return;
		(links.get(s) ?? links.set(s, []).get(s)!).push(t);
		(links.get(t) ?? links.set(t, []).get(t)!).push(s);
	};
		const inside: Point[][] = [];
	for (let j = 0; j < ny; j++) {
		// the cells wholly inside, side by side, are one rectangle
		let run = -1;
		const flush = (to: number) => {
			if (run >= 0) inside.push([{ x: X(run), y: Y(j) }, { x: X(to), y: Y(j) }, { x: X(to), y: Y(j + 1) }, { x: X(run), y: Y(j + 1) }]);
			run = -1;
		};
		for (let i = 0; i < nx; i++) {
			const k = j * cols + i;
						const v0 = values[k];
			const v1 = values[k + 1];
			const v2 = values[k + cols + 1];
			const v3 = values[k + cols];
			const n0 = v0 < 0;
			// most cells are all on one side: nothing to look for
			if (n0 === v1 < 0 && n0 === v2 < 0 && n0 === v3 < 0) {
				if (fill && n0 && run < 0) run = i;
				if (!n0) flush(i);
				continue;
			}
			flush(i);
			const f = [v0, v1, v2, v3];
			const sides = [2 * k, 2 * (k + 1) + 1, 2 * (k + cols), 2 * k + 1];
			if (fill) {
				// the part of the cell that is in: its corners inside, and the crossings between a corner in and one out
				const corners = [
					{ x: X(i), y: Y(j) },
					{ x: X(i + 1), y: Y(j) },
					{ x: X(i + 1), y: Y(j + 1) },
					{ x: X(i), y: Y(j + 1) }
				];
				const part: Point[] = [];
				for (let s = 0; s < 4; s++) {
					if (f[s] < 0) part.push(corners[s]);
					const at = f[s] < 0 !== f[(s + 1) % 4] < 0 ? crossing(sides[s]) : null;
					if (at) part.push(at);
				}
				if (part.length > 2) inside.push(part);
			}
						// a curve is not looked for where F has no value; a region has its edge there too
			if (!fill && !(Number.isFinite(v0) && Number.isFinite(v1) && Number.isFinite(v2) && Number.isFinite(v3))) continue;
			// bottom, right, top, left: the sides where the sign changes
			const cut = [0, 1, 2, 3].filter((s) => f[s] < 0 !== f[(s + 1) % 4] < 0).map((s) => sides[s]);
			if (cut.length === 2) link(cut[0], cut[1]);
			else if (cut.length === 4) {
				// a saddle: the value at the centre says which corners are on the same side
				const centre = F(X(i) + dx / 2, Y(j) + dy / 2);
				if (centre < 0 === f[0] < 0) {
					link(sides[0], sides[1]);
					link(sides[2], sides[3]);
				} else {
										link(sides[0], sides[3]);
					link(sides[1], sides[2]);
				}
			}
		}
		flush(nx);
	}


	// the links are the pieces of the curve: walk them into lines, from the loose ends first, then the closed loops
	const paths: Point[][] = [];
	const used = new Set<string>();
	const key = (s: number, t: number) => (s < t ? `${s}:${t}` : `${t}:${s}`);
	const follow = (start: number) => {
		const line: Point[] = [crossing(start)!];
		let at = start;
		for (;;) {
			const next = links.get(at)?.find((t) => !used.has(key(at, t)));
			if (next === undefined) break;
			used.add(key(at, next));
			line.push(crossing(next)!);
			at = next;
		}
		if (line.length > 1) paths.push(line);
	};
		for (const [side, to] of links) if (to.length === 1) follow(side);
	for (const side of links.keys()) follow(side);
	return { lines: paths, inside };
}

// ---------------------------------------------------------------- regions

/** A horizontal strip of a region: from x0 to x1, between y0 and y1. */
export type Strip = [x0: number, x1: number, y0: number, y1: number];

/**
 * The region where F(x, y) is below zero, as horizontal strips two pixels high. Along each strip F is read every
 * few pixels and the ends are placed where it changes sign, so the edge is as fine as the curve drawn over it.
 * Where F has no value the point is outside.
 */
export function sampleRegion(F: (x: number, y: number) => number, view: View, width: number, height: number): Strip[] {
	const nx = Math.max(8, Math.min(400, Math.round(width / CELL)));
	const ny = Math.max(8, Math.min(600, Math.round(height / 2)));
	const dx = (view.x1 - view.x0) / nx;
	const dy = (view.y1 - view.y0) / ny;
	const strips: Strip[] = [];
	const row = new Float64Array(nx + 1);
	for (let j = 0; j < ny; j++) {
		const y0 = view.y0 + j * dy;
		const y = y0 + dy / 2;
		for (let i = 0; i <= nx; i++) row[i] = F(view.x0 + i * dx, y);
		let start: number | null = null;
		for (let i = 0; i <= nx; i++) {
			const inside = row[i] < 0;
			const x = view.x0 + i * dx;
			if (inside && start === null) {
				// the edge is between this point and the one before, where F crosses zero
				const before = row[i - 1];
				start = i > 0 && Number.isFinite(before) ? x - (dx * row[i]) / (row[i] - before) : x;
			} else if (!inside && start !== null) {
				const before = row[i - 1];
				strips.push([start, Number.isFinite(row[i]) ? x - dx + (dx * before) / (before - row[i]) : x - dx, y0, y0 + dy]);
				start = null;
			}
		}
		if (start !== null) strips.push([start, view.x1, y0, y0 + dy]);
	}
	return strips;
}

// ---------------------------------------------------------------- numbers from a curve

/** The integral of f from a to b (Simpson's rule on 2000 pieces); NaN where f has no value on the way. */
export function integral(f: (x: number) => number, a: number, b: number): number {
	if (a === b) return 0;
	const n = 2000;
	const h = (b - a) / n;
	let sum = f(a) + f(b);
	for (let i = 1; i < n; i++) sum += f(a + i * h) * (i % 2 ? 4 : 2);
	return (sum * h) / 3;
}

/**
 * The lowest and highest value that matter in a list: the 2nd and 98th in a hundred, so that the branch of an
 * asymptote does not decide the window. Null with no finite value.
 */
export function mainRange(values: number[]): [number, number] | null {
	const finite = values.filter(Number.isFinite).sort((a, b) => a - b);
	if (!finite.length) return null;
	const at = (q: number) => finite[Math.min(finite.length - 1, Math.max(0, Math.round(q * (finite.length - 1))))];
	return [at(0.02), at(0.98)];
}
