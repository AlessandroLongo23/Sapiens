'use client';

import { add, len, polar, scale, sub, unit, v, THICK, THIN, TINT, type Frame, type V } from '../kit';
import { Arrow, Ground } from '../fisica';

/**
 * The pieces of rigid bodies and levers (physics, first year, group 7: lessons 22-25), drawn like the TikZ code of
 * those lessons and of the README's table: a rod `\draw[thick, fill=blue!10] (x0,0) rectangle (x1,0.12);`, a fulcrum
 * `\draw[thick, fill=gray!20] (x,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;` on a short piece of ground, a pivot
 * `\draw[thick, fill=white] (P) circle (2pt);` and the curved arrow of a sense of rotation
 * `\draw[-{Stealth}, thin] (…) arc[…];`. Used by the interactive figures ChiaveInglese, Altalena, LevaGeneri,
 * BloccoRibaltamento and by the exercise scene `asta-forze`. Centimetres, y upwards.
 */

/** The rod's thickness in the lessons' figures. */
export const ROD = 0.12;

/**
 * A rod lying on the segment from `from` to `to` (its lower side, where a fulcrum touches it), `h` thick on the left
 * of that direction: above, for a rod drawn left to right.
 */
export function Asta({ f, from, to, h = ROD, fill = TINT.blue }: { f: Frame; from: V; to: V; h?: number; fill?: string }) {
	const u = unit(sub(to, from));
	const n = scale(v(-u.y, u.x), h);
	return <path d={f.path([from, to, add(to, n), add(from, n)], true)} fill={fill} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" pointerEvents="none" />;
}

/** A point of the rod's middle line, `s` centimetres from `from` along it: where forces are applied. */
export function onRod(from: V, to: V, s: number, h = ROD) {
	const u = unit(sub(to, from));
	return add(add(from, scale(u, s)), scale(v(-u.y, u.x), h / 2));
}

/** A fulcrum: the triangle with its tip at `at`, 0.4 wide and 0.35 high, on a piece of ground 1 cm wide (or none). */
export function Fulcro({ f, at, ground = true, height = 0.35 }: { f: Frame; at: V; ground?: boolean; height?: number }) {
	const w = (0.4 * height) / 0.35;
	return (
		<g pointerEvents="none">
			{ground && <Ground f={f} from={v(at.x - 0.5, at.y - height)} to={v(at.x + 0.5, at.y - height)} />}
			<path d={f.path([at, v(at.x - w / 2, at.y - height), v(at.x + w / 2, at.y - height)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
		</g>
	);
}

/** A pivot: a white circle of 2pt, as `\draw[thick, fill=white] (P) circle (2pt);`. */
export function Perno({ f, at }: { f: Frame; at: V }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={3} fill="#fff" stroke="#000" strokeWidth={THICK} pointerEvents="none" />;
}

/**
 * The curved arrow of a rotation around `c`: an arc of radius `r` from angle `a0` to `a1` (radians), counterclockwise
 * when a1 > a0 and clockwise otherwise, with a Stealth tip at a1. Thin and black, as in the lessons, unless `color`.
 */
export function ArcoRotazione({ f, c, r, a0, a1, color = '#000' }: { f: Frame; c: V; r: number; a0: number; a1: number; color?: string }) {
	const n = 24;
	const s = Math.sign(a1 - a0) || 1;
	// The tip takes the last 0.13 cm of the arc; the line stops where it starts.
	const tip = Math.min(0.13 / r, Math.abs(a1 - a0) * 0.6);
	const end = a1 - s * tip;
	const pts: V[] = [];
	for (let i = 0; i <= n; i++) pts.push(add(c, polar(r, a0 + ((end - a0) * i) / n)));
	return (
		<g pointerEvents="none">
			<path d={f.path(pts)} stroke={color} strokeWidth={THIN} fill="none" />
			<Arrow f={f} from={add(c, polar(r, end))} to={add(c, polar(r, a1))} color={color} weight="thin" />
		</g>
	);
}

/** A dimension line `|-|` from a to b, thin, as the lessons mark a distance. */
export function Quota({ f, a, b }: { f: Frame; a: V; b: V }) {
	const u = unit(sub(b, a));
	const n = scale(v(-u.y, u.x), 0.08);
	if (len(sub(b, a)) < 1e-6) return null;
	return <path d={`${f.path([a, b])} ${f.path([add(a, n), sub(a, n)])} ${f.path([add(b, n), sub(b, n)])}`} stroke="#000" strokeWidth={THIN} fill="none" pointerEvents="none" />;
}
