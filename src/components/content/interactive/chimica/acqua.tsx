'use client';

import { THIN, v, type Frame, type V } from '../kit';

/**
 * Pieces of the water figures (chemistry, second year, group 29: lessons 44-47, la chimica dell'acqua): a water
 * molecule drawn like the lessons' TikZ (oxygen `red!20`, hydrogens `blue!10`, bonds as lines, the angle H-O-H of
 * 104,5°), a hydrogen bond (dashed, `orange!90!black`) and an ion. Everything in TikZ centimetres, y upwards.
 */

/** Oxygen and hydrogen fills: TikZ red!20 and blue!10, tints that the dark theme keeps tints. */
export const FILL_O = '#ffcccc';
export const FILL_H = '#e6e6ff';
/** The hydrogen bond, TikZ orange!90!black. */
export const HBOND = '#e67300';
/** Half the angle H-O-H, 104,5° / 2, in radians. */
export const HALF = (52.25 * Math.PI) / 180;

export type Water = { at: V; th: number };

/** Sizes of the molecule: radii of O and H, length O-H, all in cm. */
export const SIZE = { rO: 0.17, rH: 0.105, oh: 0.3 };

/** The two hydrogens of a molecule whose bisector (from O towards the middle of the hydrogens) points at angle th. */
export function hydrogens(w: Water, oh = SIZE.oh): [V, V] {
	return [v(w.at.x + oh * Math.cos(w.th - HALF), w.at.y + oh * Math.sin(w.th - HALF)), v(w.at.x + oh * Math.cos(w.th + HALF), w.at.y + oh * Math.sin(w.th + HALF))];
}

/**
 * A water molecule. `back` draws the second hydrogen towards the viewer, out of the drawing's plane (short and pale,
 * over the oxygen): the ice's third dimension in a flat picture. `scale` shrinks or grows the whole molecule.
 */
export function WaterMolecule({ f, w, back = false, scale = 1, opacity = 1 }: { f: Frame; w: Water; back?: boolean; scale?: number; opacity?: number }) {
	const rO = SIZE.rO * scale, rH = SIZE.rH * scale, oh = SIZE.oh * scale;
	const [h1, h2] = hydrogens(w, oh);
	const o = f.px(w.at);
	const p1 = f.px(h1);
	const p2 = f.px(h2);
	const K = f.W / (f.x1 - f.x0);
	const up = f.px(v(w.at.x, w.at.y + 0.2 * scale));
	return (
		<g opacity={opacity}>
			<line x1={o.x} y1={o.y} x2={p1.x} y2={p1.y} stroke="#000" strokeWidth={THIN * 1.6} />
			{!back && <line x1={o.x} y1={o.y} x2={p2.x} y2={p2.y} stroke="#000" strokeWidth={THIN * 1.6} />}
			<circle cx={p1.x} cy={p1.y} r={rH * K} fill={FILL_H} stroke="#000" strokeWidth={THIN} />
			{!back && <circle cx={p2.x} cy={p2.y} r={rH * K} fill={FILL_H} stroke="#000" strokeWidth={THIN} />}
			<circle cx={o.x} cy={o.y} r={rO * K} fill={FILL_O} stroke="#000" strokeWidth={THIN} />
			{back && <circle cx={up.x} cy={up.y} r={rH * 0.85 * K} fill={FILL_H} stroke="#000" strokeWidth={THIN} opacity={0.75} />}
		</g>
	);
}

/** A hydrogen bond from a hydrogen at `h` to an oxygen at `o`, dashed, between the two circles. */
export function HydrogenBond({ f, h, o, scale = 1 }: { f: Frame; h: V; o: V; scale?: number }) {
	const dx = o.x - h.x, dy = o.y - h.y;
	const d = Math.hypot(dx, dy) || 1;
	const a = f.px(v(h.x + (dx / d) * SIZE.rH * scale, h.y + (dy / d) * SIZE.rH * scale));
	const b = f.px(v(o.x - (dx / d) * SIZE.rO * scale, o.y - (dy / d) * SIZE.rO * scale));
	if (d < (SIZE.rH + SIZE.rO) * scale) return null;
	return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HBOND} strokeWidth={THIN * 2.2} strokeDasharray="3.5 2.5" />;
}

/** A small seeded random generator (mulberry32), so a figure starts the same way every time. */
export function seeded(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A standard normal number from a uniform generator (Box-Muller). */
export function gauss(rnd: () => number) {
	const u = Math.max(rnd(), 1e-12);
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}
