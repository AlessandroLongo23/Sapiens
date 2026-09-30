'use client';

import { FONT, K, THIN, type Frame, type V } from '../kit';

/**
 * Atoms drawn as Dalton's solid spheres, as the TikZ figures of lessons 25-28 draw them (chemistry, first year, group
 * 25): a circle with a `thick` outline, a tint per element and the symbol inside. The tints are those of the TikZ code
 * (`gray!45` for carbon, `red!30` for oxygen...), so the figures and the drawings around them agree, and the dark
 * theme inverts them like the rest of the drawing.
 */

/** TikZ tints of the elements: `gray!45`, `red!30`, `blue!25`, `yellow!40`, `gray!8`, `orange!30`... */
export const ATOM_TINT: Record<string, string> = {
	H: '#ebebeb', // gray!8
	C: '#b8b8b8', // gray!45
	N: '#bfbfff', // blue!25
	O: '#ffb3b3', // red!30
	S: '#ffff99', // yellow!40
	Fe: '#ffd1a3', // orange!30 (a little softened)
	Ca: '#d9f2d9', // green!15
	Al: '#d9d9e6', // gray-blue
	Cu: '#c9e6f2', // cyan-ish, for the blue crystals of copper sulfate
	Cl: '#bfffbf', // green!25
	Na: '#dfbfdf', // violet!25
};

/** One atom: a sphere of radius r (TikZ cm) with its symbol. */
export function Sphere({ f, at, el, r = 0.2, size }: { f: Frame; at: V; el: string; r?: number; size?: number }) {
	const p = f.px(at);
	const fs = size ?? Math.round(r * K * (el.length > 1 ? 1.0 : 1.3));
	return (
		<g pointerEvents="none">
			<circle cx={p.x} cy={p.y} r={r * K} fill={ATOM_TINT[el] ?? '#e6e6e6'} stroke="#000" strokeWidth={THIN * 1.6} />
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={fs} fontFamily={FONT} fill="#000">
				{el}
			</text>
		</g>
	);
}
