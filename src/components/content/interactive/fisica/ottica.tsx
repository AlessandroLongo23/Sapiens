'use client';

import { v, add, sub, scale, unit, len, lerp, dot, rot, THIN, THICK, DASH, type V, type Frame } from '../kit';
import { Arrow, Ground } from '../fisica';

/**
 * The pieces of geometrical optics, drawn like the TikZ conventions of docs/lezioni/fisica/README.md ("Ottica"):
 * rays with an arrow in the middle, virtual extensions dashed, plane and spherical mirrors with ticks on the back,
 * thin lenses as a line with arrow tips (outwards: converging; inwards: diverging), the optical axis, foci, objects
 * and images as upright arrows. Plus the geometry: reflection, refraction (Snell), the thin-lens and mirror equation.
 * Everything in TikZ centimetres, y upwards.
 */

/** A light ray: TikZ `orange!90!black`. */
export const RAY = '#e67300';
/** The colour of a second family of rays (the other principal ray, a second wavelength): TikZ `blue!70!black`. */
export const RAY2 = '#0000b3';
/** Mirrors and lenses: TikZ `blue!60!black` for lenses, black for mirrors. */
export const LENS = '#000099';

// ---------------------------------------------------------------- geometry

/** The direction `d` reflected on a surface with normal `n` (any length). */
export function reflect(d: V, n: V): V {
	const u = unit(n);
	return sub(d, scale(u, 2 * dot(d, u)));
}

/**
 * The direction `d` refracted from index n1 into index n2 through a surface with normal `n` (either side), or null
 * when it is totally reflected. Snell: n1 sin θ1 = n2 sin θ2.
 */
export function refract(d: V, n: V, n1: number, n2: number): V | null {
	const i = unit(d);
	let u = unit(n);
	let cos1 = -dot(u, i);
	if (cos1 < 0) {
		u = scale(u, -1);
		cos1 = -cos1;
	}
	const r = n1 / n2;
	const k = 1 - r * r * (1 - cos1 * cos1);
	if (k < 0) return null;
	return unit(add(scale(i, r), scale(u, r * cos1 - Math.sqrt(k))));
}

/** The critical angle (radians) from n1 into n2 < n1, or null when there is none. */
export const criticalAngle = (n1: number, n2: number) => (n2 < n1 ? Math.asin(n2 / n1) : null);

/**
 * Thin lens and spherical mirror, with the lessons' sign convention: distances p (object) and q (image) positive
 * when real, f positive for a converging lens or a concave mirror. 1/p + 1/q = 1/f, magnification G = −q/p.
 * Returns q = Infinity when the object is in the focus.
 */
export function imageDistance(p: number, f: number): number {
	if (Math.abs(p - f) < 1e-12) return Infinity;
	return (p * f) / (p - f);
}
export const magnification = (p: number, q: number) => -q / p;

// ---------------------------------------------------------------- drawing

/** A thick Stealth tip (the same size as fisica.tsx's arrows) with its point at `at`, pointing along `d`. */
const TIP_LEN = 4.169 / 28.4528;
function tip(f: Frame, at: V, d: V) {
	const u = unit(d);
	const n = v(-u.y, u.x);
	const back = sub(at, scale(u, TIP_LEN));
	const notch = sub(at, scale(u, TIP_LEN * 0.668));
	const half = 1.576 / 28.4528;
	return f.path([at, add(back, scale(n, half)), notch, sub(back, scale(n, half))], true);
}


/**
 * A ray from `from` to `to` with an arrow in the middle, as
 * `\draw[thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}] (from) -- (to);`.
 * `virtual` draws the backward extension of a ray (dashed, thin, no arrow). `arrowAt` moves the arrow along it.
 */
export function Ray({ f, from, to, color = RAY, virtual = false, arrowAt = 0.5 }: { f: Frame; from: V; to: V; color?: string; virtual?: boolean; arrowAt?: number }) {
	if (len(sub(to, from)) < 1e-6) return null;
	if (virtual) return <path d={f.path([from, to])} stroke={color} strokeWidth={THIN} strokeDasharray={DASH} fill="none" pointerEvents="none" />;
	const u = unit(sub(to, from));
	// TikZ's `mark=at position 0.5 with {\arrow{Stealth}}` puts the tip's point a little past the middle.
	const m = add(lerp(from, to, arrowAt), scale(u, TIP_LEN / 2));
	return (
		<g pointerEvents="none">
			<path d={f.path([from, to])} stroke={color} strokeWidth={THICK} fill="none" />
			<path d={tip(f, m, u)} fill={color} />
		</g>
	);
}

/** A ray made of several straight pieces (reflected, refracted): one arrow in the middle of each piece. */
export function RayPath({ f, points, color = RAY }: { f: Frame; points: V[]; color?: string }) {
	return (
		<>
			{points.slice(1).map((p, i) => (
				<Ray key={i} f={f} from={points[i]} to={p} color={color} />
			))}
		</>
	);
}

/** The optical axis, thin and dash-dotted, as `\draw[thin, dash dot] (x0,0) -- (x1,0);`. */
export function OpticalAxis({ f, x0, x1, y = 0 }: { f: Frame; x0: number; x1: number; y?: number }) {
	return <path d={f.path([v(x0, y), v(x1, y)])} stroke="#000" strokeWidth={THIN} strokeDasharray="6 2 1.5 2" fill="none" pointerEvents="none" />;
}

/** The normal to a surface at a point: thin and dashed, `length` on each side, as `\draw[thin, dashed]`. */
export function Normal({ f, at, n, length = 1 }: { f: Frame; at: V; n: V; length?: number }) {
	const u = scale(unit(n), length);
	return <path d={f.path([sub(at, u), add(at, u)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" pointerEvents="none" />;
}

/** A plane mirror from `from` to `to`, reflecting on its left side: thick, with the ticks on the back (right side). */
export function PlaneMirror({ f, from, to }: { f: Frame; from: V; to: V }) {
	return <Ground f={f} from={from} to={to} step={0.12} />;
}

/**
 * A spherical mirror with its vertex at `vertex` on a horizontal axis, radius R (so the focus is at R/2), `half` its
 * half-height. Light comes from the left. Concave: the centre is on the left of the vertex (the mirror curves towards
 * the light); convex: on the right. Ticks on the back, as the plane mirror.
 */
export function SphericalMirror({ f, vertex, R, half = 1.4, concave = true }: { f: Frame; vertex: V; R: number; half?: number; concave?: boolean }) {
	const c = add(vertex, v(concave ? -R : R, 0));
	const a = Math.asin(Math.min(half / R, 0.99));
	const pts: V[] = [];
	const ticks: string[] = [];
	const N = 40;
	for (let i = 0; i <= N; i++) {
		const t = -a + (2 * a * i) / N;
		const p = concave ? add(c, v(R * Math.cos(t), R * Math.sin(t))) : add(c, v(-R * Math.cos(t), R * Math.sin(t)));
		pts.push(p);
	}
	// ticks every ~0.12 cm along the arc, on the side away from the light (right)
	const arc = R * 2 * a;
	const n = Math.max(2, Math.round(arc / 0.12));
	for (let i = 1; i < n; i++) {
		const t = -a + (2 * a * i) / n;
		const p = concave ? add(c, v(R * Math.cos(t), R * Math.sin(t))) : add(c, v(-R * Math.cos(t), R * Math.sin(t)));
		ticks.push(f.path([p, add(p, v(0.12, -0.12))]));
	}
	return (
		<g pointerEvents="none">
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path(pts)} stroke="#000" strokeWidth={THICK} fill="none" />
		</g>
	);
}

/**
 * A thin lens at `at` (on the axis), `half` its half-height: a vertical line with Stealth tips, pointing outwards
 * for a converging lens and inwards for a diverging one, as
 * `\draw[{Stealth}-{Stealth}, thick, blue!60!black] (x,-h) -- (x,h);` and `\draw[{Stealth[reversed]}-{Stealth[reversed]}, ...]`.
 */
export function ThinLens({ f, at, half = 1.5, converging = true }: { f: Frame; at: V; half?: number; converging?: boolean }) {
	const top = add(at, v(0, half)), bottom = add(at, v(0, -half));
	if (converging)
		return (
			<g pointerEvents="none">
				<Arrow f={f} from={at} to={top} color={LENS} weight="thick" />
				<Arrow f={f} from={at} to={bottom} color={LENS} weight="thick" />
			</g>
		);
	// Stealth[reversed]: the tip's back on the end of the line, its point inwards.
	return (
		<g pointerEvents="none">
			<path d={f.path([bottom, top])} stroke={LENS} strokeWidth={THICK} fill="none" />
			<path d={tip(f, sub(top, v(0, TIP_LEN)), v(0, -1))} fill={LENS} />
			<path d={tip(f, add(bottom, v(0, TIP_LEN)), v(0, 1))} fill={LENS} />
		</g>
	);
}

/** A focus or a centre on the axis: a dot (1.5pt) with its name below, as `\fill (x,0) circle (1.5pt) node[below] {$F$};`. */
export function AxisPoint({ f, at, name, sub: subscript }: { f: Frame; at: V; name: string; sub?: string }) {
	const p = f.px(at);
	return (
		<g pointerEvents="none">
			<circle cx={p.x} cy={p.y} r={2.25} fill="#000" />
			<text x={p.x} y={p.y + 16} textAnchor="middle" fontSize={15} fontStyle="italic" fontFamily="KaTeX_Math, 'Latin Modern Math', 'Times New Roman', serif">
				{name}
				{subscript && <tspan fontSize={10.5} dy={3.3}>{subscript}</tspan>}
			</text>
		</g>
	);
}

/**
 * An object or an image: an upright arrow from the axis at `foot` to height h (negative: upside down), black and
 * thick for the object, as `\draw[-{Stealth}, very thick] (x,0) -- (x,h);`; `image` draws it in the ray colour,
 * dashed when `virtual`.
 */
export function Arrowhead({ f, foot, h, image = false, virtual = false }: { f: Frame; foot: V; h: number; image?: boolean; virtual?: boolean }) {
	if (Math.abs(h) < 1e-6) return null;
	return <Arrow f={f} from={foot} to={add(foot, v(0, h))} color={image ? RAY2 : '#000'} weight="veryThick" dashed={virtual} />;
}

/** A point turned around a centre: handy for a plane mirror at an angle. */
export const turn = (p: V, c: V, t: number) => add(c, rot(sub(p, c), t));
