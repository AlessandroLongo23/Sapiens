import { sampleFunction, sampleImplicit, sampleParametric, sampleRegionEdge, type Point, type View } from '@/lib/grafico/curva';
import type { PlaneCurve, PlanePath } from './Plane';

/**
 * A curve as the plane draws it, found once for a window: a curve that has not changed is not found again when
 * another one does, and a curve that takes long is drawn on a wider grid while it keeps changing (the window is
 * being dragged, a slider is running) and on the fine one as soon as it rests.
 */
export interface Sampled {
	lines: Point[][];
	/** For a region: the pieces of its inside. */
	inside?: Point[][];
	/** For straight pieces: whether the first is filled, and the size written beside them. */
	path?: PlanePath;
		/** For a sequence: its terms in the window. */
	dots?: Point[];
	/** Drawn on the wider grid: the plane asks again, fine, once things are still. */
	coarse: boolean;
}

/** The curves kept, by what they are and where they are seen. */
const kept = new Map<string, Sampled>();
const KEEP = 96;
/** When each curve was last found, and how long the fine grid takes for it, in milliseconds. */
const pace = new Map<string, { at: number; cost: number }>();
/** A curve slower than this, found again sooner than `BUSY` after the last time, goes on the wider grid. */
const SLOW = 6;
const BUSY = 140;

export function sampleCurve(c: PlaneCurve, view: View, w: number, h: number, sx: number, sy: number, fine: boolean): Sampled {
	const where = `${view.x0}|${view.x1}|${view.y0}|${view.y1}|${w}|${h}`;
	const key = (coarse: boolean) => (c.stamp === undefined ? null : `${c.id}|${c.stamp}|${where}|${coarse ? 1 : 0}`);
	const fineKey = key(false);
	const known = fineKey ? kept.get(fineKey) : undefined;
	if (known) return known;

	// only what is read on a grid can be read on a wider one: a function or a curve in t is cheap as it is
	const grid = 'implicit' in c || 'region' in c;
	const start = performance.now();
	const before = pace.get(c.id);
	const coarse = grid && !fine && !!before && before.cost > SLOW && start - before.at < BUSY;
	const coarseKey = coarse ? key(true) : null;
	const again = coarseKey ? kept.get(coarseKey) : undefined;
	if (again) return again;

	const k = coarse ? 2 : 1;
	let out: Sampled;
	if ('region' in c) out = { ...sampleRegionEdge(c.region, view, w / k, h / k), coarse };
	else if ('implicit' in c) out = { lines: sampleImplicit(c.implicit, view, w / k, h / k), coarse };
	else if ('parametric' in c) out = { lines: sampleParametric(c.parametric.x, c.parametric.y, c.parametric.t0, c.parametric.t1, view, w, h), coarse };
		else if ('dots' in c) out = { lines: [], dots: c.dots(view), coarse };
	else if ('path' in c) {
		const path = c.path(view, sx, sy);
		out = { lines: path.lines, path, coarse };
	} else out = { lines: sampleFunction(c.f, view, w, h), coarse };

	// a grid twice as wide has a quarter of the points: the fine one would have taken four times as long
	if (grid) pace.set(c.id, { at: start, cost: (performance.now() - start) * k * k });
	const store = coarse ? coarseKey : fineKey;
	if (store) {
		if (kept.size >= KEEP) kept.delete(kept.keys().next().value!);
		kept.set(store, out);
	}
	return out;
}
