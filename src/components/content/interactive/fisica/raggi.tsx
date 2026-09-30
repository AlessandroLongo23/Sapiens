'use client';

import { v, add, sub, scale, unit, len, lerp, THICK, THIN, DASH, type V, type Frame } from '../kit';
import { Arrow } from '../fisica';
import { RAY } from './ottica';

/**
 * Pieces of group 10 (rays and mirrors) that ottica.tsx does not have, shared by the interactive figures of the
 * lessons 31-33 and by the exercise scene `raggi-specchi`.
 *
 * - `Raggio`: a ray like ottica.tsx's `Ray`, but with the arrow in the middle as large as TikZ's Stealth. `Ray` draws
 *   the arrow on a piece 0.18 cm long, and fisica.tsx's `Arrow` shrinks the tip to 60% of that (0.108 cm instead
 *   of 0.147 cm), so its arrows are about three quarters of the size of those in the TikZ figures next to them.
 * - `Occhio`: the eye of the TikZ figures, an almond looking right with the pupil.
 * - `mirrorX` and `bendOnMirror`: where a ray meets a spherical mirror drawn as an arc, for the paraxial
 *   constructions (the ray is aimed at the point the construction gives: the focus, the image).
 */

/** A light ray from `from` to `to`, arrow in the middle (at `arrowAt`), or dashed and thin when `virtual`. */
export function Raggio({ f, from, to, color = RAY, virtual = false, arrowAt = 0.5 }: { f: Frame; from: V; to: V; color?: string; virtual?: boolean; arrowAt?: number }) {
	const L = len(sub(to, from));
	if (L < 1e-6) return null;
	if (virtual) return <path d={f.path([from, to])} stroke={color} strokeWidth={THIN} strokeDasharray={DASH} fill="none" pointerEvents="none" />;
	const u = unit(sub(to, from));
	const m = lerp(from, to, arrowAt);
	return (
		<g pointerEvents="none">
			<path d={f.path([from, to])} stroke={color} strokeWidth={THICK} fill="none" />
			{L > 0.4 && <Arrow f={f} from={sub(m, scale(u, 0.18))} to={add(m, scale(u, 0.075))} color={color} weight="thick" />}
		</g>
	);
}

/** The eye of the lessons' figures: an almond looking right (or left with `left`), the pupil at `at`. */
export function Occhio({ f, at, left = false }: { f: Frame; at: V; left?: boolean }) {
	const s = left ? -1 : 1;
	const p = (x: number, y: number) => f.px(v(at.x + s * x, at.y + y));
	const a = p(-0.3, 0), b = p(0.1, 0), c1 = p(-0.15, 0.2), c2 = p(0, 0.15), c3 = p(0, -0.15), c4 = p(-0.15, -0.2);
	const d = `M${a.x.toFixed(2)},${a.y.toFixed(2)} C${c1.x.toFixed(2)},${c1.y.toFixed(2)} ${c2.x.toFixed(2)},${c2.y.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)} C${c3.x.toFixed(2)},${c3.y.toFixed(2)} ${c4.x.toFixed(2)},${c4.y.toFixed(2)} ${a.x.toFixed(2)},${a.y.toFixed(2)} Z`;
	const q = f.px(at);
	return (
		<g pointerEvents="none">
			<path d={d} fill="none" stroke="#000" strokeWidth={THICK} />
			<circle cx={q.x} cy={q.y} r={1.8} fill="#000" />
		</g>
	);
}

/**
 * The x of a spherical mirror's surface at height y: vertex at (xv, 0), drawn radius Rd, concave (centre on the
 * left, the edges come towards the light) or convex.
 */
export function mirrorX(xv: number, Rd: number, concave: boolean, y: number) {
	const s = Rd - Math.sqrt(Math.max(Rd * Rd - y * y, 0));
	return concave ? xv - s : xv + s;
}

/** Where the line through a and b (going towards b) meets the mirror's surface: a few fixed-point steps. */
export function bendOnMirror(a: V, b: V, xv: number, Rd: number, concave: boolean): V {
	const d = sub(b, a);
	if (Math.abs(d.x) < 1e-9) return v(a.x, 0);
	let x = xv;
	for (let k = 0; k < 6; k++) {
		const y = a.y + (d.y * (x - a.x)) / d.x;
		x = mirrorX(xv, Rd, concave, y);
	}
	return v(x, a.y + (d.y * (x - a.x)) / d.x);
}
