import type { V, Frame } from '../kit';

// The few vector helpers of kit.tsx, repeated so this file has no JSX behind it (the scripts can load it).
const v = (x: number, y: number): V => ({ x, y });
const add = (a: V, b: V) => v(a.x + b.x, a.y + b.y);
const sub = (a: V, b: V) => v(a.x - b.x, a.y - b.y);
const scale = (a: V, k: number) => v(a.x * k, a.y * k);
const len = (a: V) => Math.hypot(a.x, a.y);
/** kit.tsx's FONT_SIZE: TikZ's 10pt at the lessons' scale. */
const FONT_SIZE = 15;

/**
 * Where to write the names of the arrows of a drawing so that no name sits on a line or on another name (group 4, the
 * vector figures and the exercise scene `vettori-piano`). Pure geometry, in TikZ centimetres, without React.
 */

/** A segment of the drawing, in centimetres: an arrow, a dashed side, an axis. */
export type Seg = { a: V; b: V };
/** A name to place beside segment `seg`: `chars` letters wide (the arrow over it included). */
export type NameReq = { seg: number; chars: number; up?: boolean };

const PX = 28.4528 * 1.5; // the kit's K: centimetres to pixels
export const nameBox = (chars: number) => ({ w: (FONT_SIZE * (0.62 * chars + 0.2)) / PX, h: (FONT_SIZE * 1.3) / PX });

/** Distance from point p to the rectangle centred at c with half sizes hw, hh (0 inside). */
function toBox(p: V, c: V, hw: number, hh: number) {
	const dx = Math.max(Math.abs(p.x - c.x) - hw, 0), dy = Math.max(Math.abs(p.y - c.y) - hh, 0);
	return Math.hypot(dx, dy);
}
export function segToBox(s: Seg, c: V, hw: number, hh: number) {
	let m = Infinity;
	for (let i = 0; i <= 24; i++) {
		const t = i / 24;
		m = Math.min(m, toBox(v(s.a.x + (s.b.x - s.a.x) * t, s.a.y + (s.b.y - s.a.y) * t), c, hw, hh));
	}
	return m;
}

/**
 * Centres for the names, one after the other: for each name the candidate spot (beside its arrow at a few points
 * along it, on either side, or past its tip) whose box is farthest from every segment and every name already placed,
 * and inside the frame. Pass the centres to VecLabel with `dir` v(0, 0).
 */
export function placeNames(f: Frame, segs: Seg[], reqs: NameReq[], keepOut: V[] = []): V[] {
	const placed: { c: V; hw: number; hh: number }[] = [];
	// The middle of the drawing: between two equally clear spots, the one facing outwards reads as the arrow's own.
	const centre = scale(segs.reduce((acc, g) => add(acc, scale(add(g.a, g.b), 0.5)), v(0, 0)), 1 / (segs.length || 1));
	return reqs.map(({ seg, chars, up }) => {
		const s = segs[seg];
		const { w, h } = nameBox(chars);
		const hw = w / 2, hh = h / 2;
		const d = sub(s.b, s.a);
		const L = len(d) || 1;
		const u = scale(d, 1 / L), n = v(-u.y, u.x);
		const cands: { c: V; pref: number }[] = [];
		for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8])
			for (const sgn of [1, -1])
				for (const extra of [0, 0.2, 0.45]) {
					const m = add(s.a, scale(d, t));
					// Far enough that the box clears the line whatever its slant; farther only if nearer is crowded.
					const off = 0.1 + extra + Math.abs(n.x) * hw + Math.abs(n.y) * hh;
					cands.push({ c: add(m, scale(n, sgn * off)), pref: Math.abs(t - 0.5) * 0.1 + extra * 0.3 });
				}
		for (const extra of [0, 0.25]) cands.push({ c: add(s.b, scale(u, 0.12 + extra + Math.abs(u.x) * hw + Math.abs(u.y) * hh)), pref: 0.06 + extra * 0.3 });
		const allowed = up ? cands.filter(({ c }) => c.y > Math.max(s.a.y, s.b.y)) : cands;
		let best = allowed[0].c, bestScore = -Infinity;
		for (const { c, pref } of allowed) {
			let clear = Infinity;
			// Its own arrow is cleared by construction; the others are measured.
			segs.forEach((o, i) => i !== seg && (clear = Math.min(clear, segToBox(o, c, hw, hh))));
			for (const p of placed) clear = Math.min(clear, Math.max(Math.abs(c.x - p.c.x) - hw - p.hw, Math.abs(c.y - p.c.y) - hh - p.hh));
			for (const k of keepOut) clear = Math.min(clear, toBox(k, c, hw, hh) - 0.12);
			const out = Math.max(f.x0 - (c.x - hw), c.x + hw - f.x1, f.y0 - (c.y - hh), c.y + hh - f.y1, 0);
			const inward = len(sub(c, centre)) < len(sub(scale(add(s.a, s.b), 0.5), centre)) ? 0.08 : 0;
			const score = Math.min(clear, 0.4) - out * 10 - pref - inward;
			if (score > bestScore) {
				bestScore = score;
				best = c;
			}
		}
		placed.push({ c: best, hw, hh });
		return best;
	});
}
