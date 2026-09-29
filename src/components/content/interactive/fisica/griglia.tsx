'use client';

import { v, add, sub, scale, len, cross, dot, unit, num, VERY_THIN, FONT, FONT_SIZE, type V, type Frame } from '../kit';
import { VecLabel } from '../fisica';

/**
 * What the vector figures of the chapter "I vettori e le forze" share (group 4): a square grid like TikZ's
 * `\draw[gray!25, very thin] ... grid ...`, points that snap to its crossings, and the placement of a vector's name
 * on the side of the arrow away from the other arrows, so the names never sit on a line. Everything is in grid units
 * (quadretti); `u` is the side of a square in TikZ centimetres.
 */

/** The grid from (x0, y0) to (x1, y1), in grid units, with squares of `u` centimetres. */
export function Grid({ f, u, x0, x1, y0, y1 }: { f: Frame; u: number; x0: number; x1: number; y0: number; y1: number }) {
	const lines: string[] = [];
	for (let x = Math.ceil(x0); x <= x1 + 1e-9; x++) lines.push(f.path([v(x * u, y0 * u), v(x * u, y1 * u)]));
	for (let y = Math.ceil(y0); y <= y1 + 1e-9; y++) lines.push(f.path([v(x0 * u, y * u), v(x1 * u, y * u)]));
	// gray!25 on white; the dark theme inverts it with the rest of the drawing.
	return <path d={lines.join(' ')} stroke="#dfdfdf" strokeWidth={VERY_THIN} fill="none" pointerEvents="none" />;
}

/** The nearest crossing of the grid, kept inside the box. */
export const snap = (p: V, box: { x0: number; x1: number; y0: number; y1: number }) =>
	v(Math.min(box.x1, Math.max(box.x0, Math.round(p.x))), Math.min(box.y1, Math.max(box.y0, Math.round(p.y))));

/** Grid units to centimetres. */
export const cm = (p: V, u: number) => scale(p, u);

/** The unit normal of `d` on the side of `away`'s opposite: a name placed there does not sit on `away`. */
export function sideAway(d: V, away: V): V {
	const n = unit(v(-d.y, d.x));
	const c = cross(d, away);
	if (Math.abs(c) < 1e-9) return dot(n, away) > 0 ? scale(n, -1) : n;
	return c > 0 ? scale(n, -1) : n;
}

/**
 * A vector's name beside the middle of the arrow from `from` to `to` (centimetres), on the side `side` (a unit
 * vector), as `node[midway, above left]` does in the TikZ figures.
 */
export function MidName({ f, from, to, side, name, sub: subscript, color, bare, minus }: { f: Frame; from: V; to: V; side: V; name: string; sub?: string; color: string; bare?: boolean; minus?: boolean }) {
	const m = add(scale(add(from, to), 0.5), scale(side, 0.06));
	return <NamedVec f={f} at={m} dir={side} name={name} sub={subscript} color={color} bare={bare} minus={minus} />;
}

/**
 * VecLabel with an optional minus sign in front, for the opposite of a vector ($-\vec{b}$): VecLabel puts its arrow
 * over the whole name, so the sign is drawn apart, and the name moves right to make room when it would sit on the
 * arrow's side.
 */
export function NamedVec({ f, at, dir, name, sub: subscript, color, bare, minus }: { f: Frame; at: V; dir: V; name: string; sub?: string; color: string; bare?: boolean; minus?: boolean }) {
	if (!minus) return <VecLabel f={f} at={at} dir={dir} name={name} sub={subscript} color={color} bare={bare} />;
	const size = FONT_SIZE;
	const wMinus = size * 0.78; // the sign and the thin space after it, in pixels
	const wName = size * 0.62 * name.length;
	// Where VecLabel starts the name, as it computes it, and a shift right when the sign would go inwards.
	const p = f.px(add(at, scale(dir, 0.22)));
	const x0 = dir.x > 0.3 ? p.x : dir.x < -0.3 ? p.x - wName : p.x - wName / 2;
	const shift = dir.x > 0.3 ? wMinus : dir.x < -0.3 ? 0 : wMinus / 2;
	const base = dir.y > 0.3 ? p.y : dir.y < -0.3 ? p.y + size * 0.95 : p.y + size * 0.35;
	const k = (f.x1 - f.x0) / f.W; // centimetres per pixel
	return (
		<g pointerEvents="none">
			<text x={x0 + shift - wMinus} y={base} fontSize={size} fontFamily={FONT} fill={color}>
				−
			</text>
			<VecLabel f={f} at={add(at, v(shift * k, 0))} dir={dir} name={name} sub={subscript} color={color} bare={bare} />
		</g>
	);
}

/** A length in grid units the Italian way: exact when whole, otherwise to one decimal with ≈. */
export function lengthTex(p: V, digits = 1): string {
	return valueTex(len(p), digits);
}

/** A value exact when whole, otherwise rounded with ≈. */
export function valueTex(x: number, digits = 1): string {
	const whole = Math.abs(x - Math.round(x)) < 1e-9;
	return whole ? `= ${Math.round(x)}` : `\\approx ${num(x, digits).replace(',', '{,}')}`;
}

/** One decimal, or two when one would show two different numbers as equal. */
export const digitsFor = (x: number, y: number) => (Math.abs(x - y) > 1e-9 && num(x, 1) === num(y, 1) ? 2 : 1);

export const same = (a: V, b: V) => Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9;
export const minus = (a: V, b: V) => sub(a, b);

export { placeNames, segToBox, nameBox, type Seg, type NameReq } from './nomi';
