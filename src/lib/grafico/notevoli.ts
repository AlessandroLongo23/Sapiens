/**
 * The notable points of the curves in a window, found with numbers: zeros, the crossing of the y axis, maxima and
 * minima, and where two curves meet. vault/Decisioni/2026-10-01 Il plotter trova i punti notevoli, senza lo studio
 * di funzione.md
 */
import type { Point, View } from './curva';

export type NotableKind = 'zero' | 'intercept' | 'max' | 'min' | 'meet';
export interface Notable extends Point {
	kind: NotableKind;
}

type F = (x: number) => number;

/** Steps of the scan across the window. */
const SCAN = 800;
/** More than this many points of one kind is a curve that oscillates across the window: none are shown. */
const MAX_PER_KIND = 24;

const ok = Number.isFinite;

/** A number without the dust of the search: 1.9999999997 is 2. */
function tidy(x: number, scale: number): number {
	const unit = Math.pow(10, Math.floor(Math.log10(scale)) - 9);
	const r = Math.round(x / unit) * unit;
	const snapped = Number(r.toPrecision(12));
	return Object.is(snapped, -0) ? 0 : snapped;
}

/** The zero of f between a and b, where f changes sign; null when the change is a pole (the values grow, not shrink). */
function bisect(f: F, a: number, b: number): number | null {
	let fa = f(a);
	const span = Math.abs(f(b) - fa);
	for (let i = 0; i < 80; i++) {
		const m = (a + b) / 2;
		const fm = f(m);
		if (!ok(fm)) return null;
		if (fm === 0) return m;
		if (fa < 0 === fm < 0) {
			a = m;
			fa = fm;
		} else b = m;
	}
	const x = (a + b) / 2;
	return Math.abs(f(x)) <= span * 1e-6 + 1e-12 ? x : null;
}

/** The zeros of f in [x0, x1]: where it changes sign, and where it touches the axis without crossing. */
export function zeros(f: F, x0: number, x1: number): number[] {
	const out: number[] = [];
	const dx = (x1 - x0) / SCAN;
	const scale = x1 - x0;
	let a = x0;
	let fa = f(a);
	let before = NaN;
	for (let i = 1; i <= SCAN; i++) {
		const b = x0 + i * dx;
		const fb = f(b);
		if (ok(fa) && ok(fb)) {
			if (fa === 0) out.push(a);
			else if (fa < 0 !== fb < 0 && fb !== 0) {
				const r = bisect(f, a, b);
				if (r !== null) out.push(r);
			} else if (ok(before) && Math.abs(fa) < Math.abs(before) && Math.abs(fa) <= Math.abs(fb) && fb !== 0) {
				// |f| dips between the neighbours without a change of sign: a zero only if the dip reaches the axis
				const r = golden((x) => Math.abs(f(x)), a - dx, b);
				const height = Math.max(Math.abs(before), Math.abs(fb));
				if (ok(f(r)) && Math.abs(f(r)) <= height * 1e-7) out.push(r);
			}
		}
		before = fa;
		a = b;
		fa = fb;
	}
	if (ok(fa) && fa === 0) out.push(a);
	return unique(out.map((x) => tidy(x, scale)), scale);
}

/** The x of the minimum of g on [a, b], where g has one dip. */
function golden(g: F, a: number, b: number): number {
	const phi = (Math.sqrt(5) - 1) / 2;
	let c = b - phi * (b - a);
	let d = a + phi * (b - a);
	let gc = g(c);
	let gd = g(d);
	for (let i = 0; i < 90; i++) {
		if (gc < gd) {
			b = d;
			d = c;
			gd = gc;
			c = b - phi * (b - a);
			gc = g(c);
		} else {
			a = c;
			c = d;
			gc = gd;
			d = a + phi * (b - a);
			gd = g(d);
		}
	}
	return (a + b) / 2;
}

function unique(xs: number[], scale: number): number[] {
	const sorted = [...xs].sort((a, b) => a - b);
	return sorted.filter((x, i) => i === 0 || x - sorted[i - 1] > scale * 1e-7);
}

/** The maxima and minima of f inside [x0, x1], away from the edges of its domain. */
export function extrema(f: F, x0: number, x1: number): { x: number; kind: 'max' | 'min' }[] {
	const out: { x: number; kind: 'max' | 'min' }[] = [];
	const dx = (x1 - x0) / SCAN;
	const scale = x1 - x0;
	// the slope as a symmetric difference: its zero is the turning point, and a corner (|x|) is found exactly
	const h = dx * 1e-3;
	const slope = (x: number) => (f(x + h) - f(x - h)) / (2 * h);
	let fa = f(x0);
	let fb = f(x0 + dx);
	for (let i = 2; i <= SCAN; i++) {
		const c = x0 + i * dx;
		const fc = f(c);
		if (ok(fa) && ok(fb) && ok(fc)) {
			const up = fb > fa && fb >= fc && (fb > fc || fa < fc);
			const down = fb < fa && fb <= fc && (fb < fc || fa > fc);
			if (up || down) {
				let lo = c - 2 * dx;
				let hi = c;
				let slo = slope(lo);
				// a turn of the slope's sign; where there is none the dip is a jump or the edge of the domain
				if (ok(slo) && ok(slope(hi)) && slo > 0 === up && slope(hi) > 0 !== up) {
					for (let k = 0; k < 60; k++) {
						const m = (lo + hi) / 2;
						const sm = slope(m);
						if (!ok(sm)) break;
						if (sm > 0 === slo > 0 && sm !== 0) {
							lo = m;
							slo = sm;
						} else hi = m;
					}
					const x = (lo + hi) / 2;
					if (hi - lo < dx * 1e-6 && ok(f(x))) out.push({ x: tidy(x, scale), kind: up ? 'max' : 'min' });
				}
			}
		}
		fa = fb;
		fb = fc;
	}
	return out.filter((p, i) => i === 0 || p.x - out[i - 1].x > scale * 1e-7);
}

/**
 * The notable points of the functions in the view. Zeros and turning points of each, its crossing of the y axis,
 * and the meetings of each pair. A kind with too many points (sin 50x) is left out for that curve.
 */
export function notablePoints(fs: F[], view: View): Notable[][] {
	const { x0, x1 } = view;
	const yScale = view.y1 - view.y0;
	const point = (f: F, x: number, kind: NotableKind): Notable => ({ x, y: tidy(f(x), yScale), kind });
	const few = <T>(items: T[]) => (items.length > MAX_PER_KIND ? [] : items);

	return fs.map((f, i) => {
		const out: Notable[] = [];
		for (const x of few(zeros(f, x0, x1))) out.push({ x, y: 0, kind: 'zero' });
		if (x0 <= 0 && x1 >= 0 && ok(f(0)) && f(0) !== 0) out.push(point(f, 0, 'intercept'));
		for (const e of few(extrema(f, x0, x1))) out.push(point(f, e.x, e.kind));
		for (let k = 0; k < i; k++) {
			const g = fs[k];
			for (const x of few(zeros((t) => f(t) - g(t), x0, x1))) out.push(point(f, x, 'meet'));
		}
		// one dot per place: a zero that is also a minimum (x²) stays a zero
		return out.filter((p, n) => !out.slice(0, n).some((q) => Math.abs(q.x - p.x) <= (x1 - x0) * 1e-7 && Math.abs(q.y - p.y) <= yScale * 1e-7));
	});
}
