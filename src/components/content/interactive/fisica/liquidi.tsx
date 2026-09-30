'use client';

import { FONT, FONT_MATH, THICK, THIN, TINT, type Frame, type V } from '../kit';

/**
 * Liquids and their containers, drawn like the TikZ code of the physics lessons (docs/lezioni/fisica/README.md,
 * "Liquido"): the liquid is `\fill[cyan!20]`, its free surface `\draw[thin]`, the container `\draw[thick]` and open at
 * the top. Written for the chapter on fluids (lessons 26-28: pressure, Pascal, Stevin) and meant for the rest of it
 * (atmospheric pressure, Archimedes). Everything in TikZ centimetres, y upwards.
 */

/** The fills of the liquids, as TikZ mixes on white: water `cyan!20`, oil `yellow!20` (as in the Archimedes figures), mercury `gray!40`. */
export const LIQUID = {
	acqua: '#ccffff',
	olio: TINT.yellow,
	mercurio: '#b3b3b3', // gray!60: gray!40 almost disappears in a narrow tube in the dark theme
} as const;

/** A body of liquid: the polygon filled, without an outline (the container and the surface draw the lines). */
export function Liquid({ f, pts, fill = LIQUID.acqua }: { f: Frame; pts: V[]; fill?: string }) {
	return <path d={f.path(pts, true)} fill={fill} stroke="none" pointerEvents="none" />;
}

/** The free surface of a liquid, or the boundary between two liquids: a thin line. */
export function Surface({ f, from, to }: { f: Frame; from: V; to: V }) {
	return <path d={f.path([from, to])} stroke="#000" strokeWidth={THIN} fill="none" pointerEvents="none" />;
}

/** The walls of a container, open where the path is open: a thick polyline (several with `paths`). */
export function Vessel({ f, pts, paths }: { f: Frame; pts?: V[]; paths?: V[][] }) {
	const all = paths ?? (pts ? [pts] : []);
	return <path d={all.map((p) => f.path(p)).join(' ')} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" pointerEvents="none" />;
}

/** A piston that closes a vertical cylinder from x0 to x1, its lower face at y, `h` thick, as `\draw[thick, fill=gray!20]`. */
export function Piston({ f, x0, x1, y, h = 0.15 }: { f: Frame; x0: number; x1: number; y: number; h?: number }) {
	const g = 0.02; // a hair's gap from the walls, as in the TikZ figures
	return <path d={f.path([{ x: x0 + g, y }, { x: x1 - g, y }, { x: x1 - g, y: y + h }, { x: x0 + g, y: y + h }], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" pointerEvents="none" />;
}

/**
 * A label for a scene of the exercises, written by the generator as plain text: `S_1 = 10 cm²`, `h = 2,5 m`,
 * `F_1 = 1,2 · 10² N`. The name before " = " is set in italic with its subscript (after `_`), the rest upright, like
 * `$S_1 = 10\,\text{cm}^2$` in the lessons, centred vertically on `at`; `anchor` as in SVG.
 */
export function QuantityText({ f, at, text, anchor = 'middle', size = 13, color = '#000' }: { f: Frame; at: V; text: string; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string }) {
	const { x, y } = f.px(at);
	const i = text.indexOf(' = ');
	const name = i >= 0 ? text.slice(0, i) : '';
	const rest = i >= 0 ? text.slice(i) : text;
	const [letter, sub] = name.split('_');
	return (
		<text x={x} y={y} dy="0.35em" textAnchor={anchor} fontSize={size} fontFamily={FONT} fill={color} pointerEvents="none">
			{letter && (
				<tspan fontFamily={FONT_MATH} fontStyle="italic">
					{letter}
				</tspan>
			)}
			{sub && (
				<tspan fontSize={size * 0.7} dy={size * 0.25}>
					{sub}
				</tspan>
			)}
			<tspan dy={sub ? -size * 0.25 : 0}>{rest}</tspan>
		</text>
	);
}
