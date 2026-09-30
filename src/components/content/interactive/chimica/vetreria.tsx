'use client';

import { K, THICK, THIN, TINT, v, type Frame, type V } from '../kit';

/**
 * Laboratory glassware for the chemistry figures (group 23: lessons 18-20, separation of mixtures, changes of state,
 * heating curves), drawn like the TikZ figures of those lessons: glass `\draw[thick]`, liquids `\fill[cyan!20]` with
 * a thin free surface (liquidi.tsx), a burner flame `orange!90!black` on `orange!25`, a thermometer with a red
 * column. Everything in TikZ centimetres, y upwards.
 */

/** A burner's flame with its tip at `tip`, `h` tall; `on` false draws nothing. The nozzle is a small grey block below. */
export function Flame({ f, tip, h = 0.42, on = true, nozzle = true }: { f: Frame; tip: V; h?: number; on?: boolean; nozzle?: boolean }) {
	const b = v(tip.x, tip.y - h);
	const w = h * 0.36;
	const d = `M${f.px(b).x},${f.px(b).y} C${f.px(v(b.x - w, b.y + h * 0.45)).x},${f.px(v(b.x - w, b.y + h * 0.45)).y} ${f.px(v(tip.x - w * 0.4, tip.y - h * 0.25)).x},${f.px(v(tip.x - w * 0.4, tip.y - h * 0.25)).y} ${f.px(tip).x},${f.px(tip).y} C${f.px(v(tip.x + w * 0.4, tip.y - h * 0.25)).x},${f.px(v(tip.x + w * 0.4, tip.y - h * 0.25)).y} ${f.px(v(b.x + w, b.y + h * 0.45)).x},${f.px(v(b.x + w, b.y + h * 0.45)).y} ${f.px(b).x},${f.px(b).y} Z`;
	return (
		<g pointerEvents="none">
			{on && <path d={d} fill="#ffdfbf" stroke="#e67300" strokeWidth={THICK} strokeLinejoin="round" />}
			{nozzle && <path d={f.path([v(b.x - 0.1, b.y - 0.02), v(b.x + 0.1, b.y - 0.02), v(b.x + 0.1, b.y - 0.4), v(b.x - 0.1, b.y - 0.4)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />}
		</g>
	);
}

/**
 * A thermometer: a narrow tube from `bottom` up `len` centimetres, the bulb at `bottom`, and the red column up to the
 * fraction `k` (0 to 1) of the tube.
 */
export function Thermometer({ f, bottom, len, k }: { f: Frame; bottom: V; len: number; k: number }) {
	const w = 0.05;
	const top = bottom.y + len;
	const col = bottom.y + 0.05 + Math.max(0, Math.min(1, k)) * (len - 0.15);
	return (
		<g pointerEvents="none">
			<path d={f.path([v(bottom.x - w * 0.6, bottom.y), v(bottom.x + w * 0.6, bottom.y), v(bottom.x + w * 0.6, col), v(bottom.x - w * 0.6, col)], true)} fill="#ff9999" />
			<path d={f.path([v(bottom.x - w, bottom.y + 0.05), v(bottom.x - w, top), v(bottom.x + w, top), v(bottom.x + w, bottom.y + 0.05)])} fill="none" stroke="#000" strokeWidth={THICK} />
			<circle cx={f.px(bottom).x} cy={f.px(bottom).y} r={0.08 * K} fill="#ff9999" stroke="#000" strokeWidth={THICK} />
		</g>
	);
}

/** Points of a circle of radius r around c, from angle a0 to a1 (degrees, counterclockwise), `n` of them. */
export function arcPts(c: V, r: number, a0: number, a1: number, n = 48): V[] {
	return Array.from({ length: n + 1 }, (_, i) => {
		const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
		return v(c.x + r * Math.cos(t), c.y + r * Math.sin(t));
	});
}

/**
 * The liquid in a round flask of centre c and radius r, up to the height y (from c.y - r to c.y + r): the polygon of
 * the circle below the chord, and the chord's ends for the free surface.
 */
export function flaskLiquid(c: V, r: number, y: number): { pts: V[]; left: V; right: V } | null {
	const h = y - c.y;
	if (h <= -r + 1e-3) return null;
	const a = (Math.asin(Math.max(-1, Math.min(1, h / r))) * 180) / Math.PI;
	const pts = arcPts(c, r * 0.97, 180 - a, 360 + a);
	return { pts, left: pts[0], right: pts[pts.length - 1] };
}

/** The volume fraction of a sphere filled up to height h above its bottom, 0 ≤ h ≤ 2r: h²(3r − h)/(4r³). */
export const sphereFill = (h: number, r: number) => (h * h * (3 * r - h)) / (4 * r * r * r);

/** The height above the bottom of a sphere filled to the volume fraction k (inverse of sphereFill, by bisection). */
export function sphereLevel(k: number, r: number) {
	let lo = 0, hi = 2 * r;
	for (let i = 0; i < 40; i++) {
		const m = (lo + hi) / 2;
		if (sphereFill(m, r) < k) lo = m;
		else hi = m;
	}
	return (lo + hi) / 2;
}

/**
 * An Erlenmeyer flask (beuta) standing on y = y0, centred on x, `h` tall, with its liquid up to the fraction k of the
 * conical part's height (a cone: the level grows slower as the flask narrows, computed from the volume).
 */
export function Beuta({ f, x, y0, k, h = 1.3, w = 1.1, neck = 0.36 }: { f: Frame; x: number; y0: number; k: number; h?: number; w?: number; neck?: number }) {
	const shoulder = y0 + h * 0.72;
	const top = y0 + h;
	// Volume of the frustum from the bottom up to height z, with the half width going from w/2 to neck/2.
	const H = shoulder - y0;
	const half = (z: number) => w / 2 - ((w - neck) / 2) * (z / H);
	const vol = (z: number) => {
		let s = 0;
		const n = 40;
		for (let i = 0; i < n; i++) s += half((z * (i + 0.5)) / n) ** 2;
		return (s * z) / n;
	};
	const full = vol(H * 0.85);
	let z = 0;
	if (k > 0) {
		let lo = 0, hi = H * 0.85;
		for (let i = 0; i < 30; i++) {
			const m = (lo + hi) / 2;
			if (vol(m) < k * full) lo = m;
			else hi = m;
		}
		z = (lo + hi) / 2;
	}
	const g = 0.04;
	return (
		<g pointerEvents="none">
			{z > 0.005 && (
				<>
					<path d={f.path([v(x - w / 2 + g, y0 + g), v(x + w / 2 - g, y0 + g), v(x + half(z) - g, y0 + z), v(x - half(z) + g, y0 + z)], true)} fill="#ccffff" />
					<path d={f.path([v(x - half(z) + g, y0 + z), v(x + half(z) - g, y0 + z)])} stroke="#000" strokeWidth={THIN} fill="none" />
				</>
			)}
			<path d={f.path([v(x - neck / 2, top), v(x - neck / 2, shoulder), v(x - w / 2, y0), v(x + w / 2, y0), v(x + neck / 2, shoulder), v(x + neck / 2, top)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
		</g>
	);
}
