'use client';

import { type ReactNode } from 'react';
import { v, dist, sub, unit, scale, add, rot, len, type V, type Frame, THIN, FONT, FONT_MATH, FONT_SIZE } from './kit';

/**
 * What the figures on sets and relations share: Eulero-Venn diagrams with two or three circles (the zones, their
 * fills, a point inside each), the arrows of the arrow diagrams and of the relations (TikZ's default tip and
 * `stealth`, straight, bent and loops), and small expressions on sets evaluated zone by zone.
 */

// ---------------------------------------------------------------- Venn layouts

export type Circle = { c: V; r: number; name: string; label: V };
export type Layout = { x0: number; x1: number; y0: number; y1: number; circles: Circle[]; universe: string };

/** Two circles in U, as in the lessons: rectangle (-3,-2)–(3,2), circles of radius 1.4 at (∓1, 0), labels outside. */
export const VENN2: Layout = {
	x0: -3,
	x1: 3,
	y0: -2,
	y1: 2,
	universe: 'U',
	circles: [
		{ c: v(-1, 0), r: 1.4, name: 'A', label: v(-2.1, 1.35) },
		{ c: v(1, 0), r: 1.4, name: 'B', label: v(2.1, 1.35) }
	]
};

/** Three circles, as in the three-sports problem of lesson 64. */
export const VENN3: Layout = {
	x0: -3,
	x1: 3,
	y0: -2.4,
	y1: 2,
	universe: 'U',
	circles: [
		{ c: v(-0.75, 0.35), r: 1.3, name: 'A', label: v(-2.2, 1.55) },
		{ c: v(0.75, 0.35), r: 1.3, name: 'B', label: v(2.2, 1.55) },
		{ c: v(0, -0.9), r: 1.3, name: 'C', label: v(-1.3, -1.95) }
	]
};

/**
 * The zone of a point: bit i set when it is inside circle i (0 is the part of U outside every circle), or null outside
 * the rectangle.
 */
export function zoneAt(L: Layout, p: V): number | null {
	if (p.x < L.x0 || p.x > L.x1 || p.y < L.y0 || p.y > L.y1) return null;
	return L.circles.reduce((m, c, i) => (dist(p, c.c) < c.r ? m | (1 << i) : m), 0);
}

/** How far a point is from every line of the diagram. */
function clearance(L: Layout, p: V) {
	return Math.min(p.x - L.x0, L.x1 - p.x, p.y - L.y0, L.y1 - p.y, ...L.circles.map((c) => Math.abs(dist(p, c.c) - c.r)));
}

/** For every zone, the point farthest from its borders (on a grid): where a mark or a focus ring goes. */
export function zoneCenters(L: Layout): V[] {
	const best: { p: V; d: number }[] = Array.from({ length: 1 << L.circles.length }, () => ({ p: v(0, 0), d: -1 }));
	for (let x = L.x0; x <= L.x1; x += 0.05)
		for (let y = L.y0; y <= L.y1; y += 0.05) {
			const p = v(x, y);
			const z = zoneAt(L, p);
			if (z === null) continue;
			// Outside the circles, prefer the corners away from the letters: plain clearance would pick the middle of an edge.
			const d = clearance(L, p) - (z === 0 ? 0.3 * Math.abs(p.y - L.y0) : 0);
			if (d > best[z].d) best[z] = { p, d };
		}
	return best.map((b) => b.p);
}

export const zoneName = (L: Layout, z: number) => {
	const names = L.circles.map((c) => c.name);
	const inside = names.filter((_, i) => z & (1 << i));
	const outside = names.filter((_, i) => !(z & (1 << i)));
	if (!inside.length) return `fuori da ${names.length === 2 ? 'A e da B' : 'tutti i cerchi'}`;
	if (!outside.length) return names.length === 2 ? 'dentro A e dentro B' : 'dentro tutti e tre i cerchi';
	return `dentro ${inside.join(' e ')}, fuori da ${outside.join(' e ')}`;
};

/**
 * The clip paths and masks the zones are drawn with: circle i as clip `${id}c${i}`, and for zone z a mask that hides
 * the circles z is outside of. Put once in the drawing, before the zones.
 */
export function VennDefs({ L, f, id }: { L: Layout; f: Frame; id: string }) {
	const n = L.circles.length;
	const tl = f.px(v(L.x0, L.y1)), br = f.px(v(L.x1, L.y0));
	return (
		<defs>
			{L.circles.map((c, i) => {
				const p = f.px(c.c);
				return (
					<clipPath key={i} id={`${id}c${i}`}>
						<circle cx={p.x} cy={p.y} r={c.r * (f.W / (f.x1 - f.x0))} />
					</clipPath>
				);
			})}
			{Array.from({ length: 1 << n }, (_, z) => (
				<mask key={z} id={`${id}m${z}`} maskUnits="userSpaceOnUse" x={0} y={0} width={f.W} height={f.H}>
					<rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill="#fff" />
					{L.circles.map((c, i) => {
						if (z & (1 << i)) return null;
						const p = f.px(c.c);
						return <circle key={i} cx={p.x} cy={p.y} r={c.r * (f.W / (f.x1 - f.x0))} fill="#000" />;
					})}
				</mask>
			))}
			<pattern id={`${id}h1`} patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
				<line x1={0} y1={0} x2={0} y2={8} stroke="#000" strokeWidth={0.7} />
			</pattern>
			<pattern id={`${id}h2`} patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(-45)">
				<line x1={0} y1={0} x2={0} y2={8} stroke="#000" strokeWidth={0.7} />
			</pattern>
		</defs>
	);
}

/** One zone filled with `fill` (a colour or a pattern url). */
export function Zone({ L, f, id, z, fill }: { L: Layout; f: Frame; id: string; z: number; fill: string }) {
	const tl = f.px(v(L.x0, L.y1)), br = f.px(v(L.x1, L.y0));
	let inner: ReactNode = <rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill={fill} />;
	L.circles.forEach((_, i) => {
		if (z & (1 << i)) inner = <g clipPath={`url(#${id}c${i})`}>{inner}</g>;
	});
	return (
		<g mask={`url(#${id}m${z})`} pointerEvents="none">
			{inner}
		</g>
	);
}

/** A letter of the diagram, as a TikZ node. */
function Name({ f, at, children, italic = true, anchor = 'middle', dy = '0.35em' }: { f: Frame; at: V; children: ReactNode; italic?: boolean; anchor?: 'start' | 'middle' | 'end'; dy?: string }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy={dy} textAnchor={anchor} fontSize={FONT_SIZE} fontStyle={italic ? 'italic' : 'normal'} fontFamily={italic ? FONT_MATH : FONT} fill="#000">
			{children}
		</text>
	);
}

/** The rectangle of U, the circles and their letters, drawn over the fills. */
export function VennOutline({ L, f, circles = L.circles }: { L: Layout; f: Frame; circles?: Circle[] }) {
	const tl = f.px(v(L.x0, L.y1)), br = f.px(v(L.x1, L.y0));
	const k = f.W / (f.x1 - f.x0);
	return (
		<g pointerEvents="none">
			<rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill="none" stroke="#000" strokeWidth={THIN} />
			{circles.map((c) => {
				const p = f.px(c.c);
				return <circle key={c.name} cx={p.x} cy={p.y} r={c.r * k} fill="none" stroke="#000" strokeWidth={THIN} />;
			})}
			<Name f={f} at={v(L.x1 - 0.12, L.y1 - 0.1)} italic={L.universe === 'U' || L.universe === 'Ω'} anchor="end" dy="0.8em">
				{L.universe}
			</Name>
			{circles.map((c) => (
				<Name key={c.name} f={f} at={c.label}>
					{c.name}
				</Name>
			))}
		</g>
	);
}

// ---------------------------------------------------------------- expressions on sets

/** A set built from A, B, C: its TeX and, for a diagram with n circles, the zones it covers as a bit mask. */
export type Expr = { tex: string; zones: (n: number) => number; op?: 'cup' | 'cap' | 'minus' | 'bar' | 'set'; kids?: Expr[] };

const full = (n: number) => (1 << (1 << n)) - 1;
export const set = (i: number): Expr => ({
	tex: 'ABC'[i],
	op: 'set',
	zones: (n) => {
		let m = 0;
		for (let z = 0; z < 1 << n; z++) if (z & (1 << i)) m |= 1 << z;
		return m;
	}
});
const wrap = (e: Expr, parens: boolean) => (parens && (e.op === 'cup' || e.op === 'cap' || e.op === 'minus') ? `(${e.tex})` : e.tex);
export const cup = (a: Expr, b: Expr): Expr => ({ tex: `${wrap(a, a.op !== 'cup')} \\cup ${wrap(b, b.op !== 'cup')}`, op: 'cup', kids: [a, b], zones: (n) => a.zones(n) | b.zones(n) });
export const cap = (a: Expr, b: Expr): Expr => ({ tex: `${wrap(a, a.op !== 'cap')} \\cap ${wrap(b, b.op !== 'cap')}`, op: 'cap', kids: [a, b], zones: (n) => a.zones(n) & b.zones(n) });
export const minus = (a: Expr, b: Expr): Expr => ({ tex: `${wrap(a, true)} \\setminus ${wrap(b, true)}`, op: 'minus', kids: [a, b], zones: (n) => a.zones(n) & ~b.zones(n) & full(n) });
export const bar = (a: Expr): Expr => ({ tex: `\\overline{${a.tex}}`, op: 'bar', kids: [a], zones: (n) => ~a.zones(n) & full(n) });

export const zonesOf = (mask: number, n: number) => Array.from({ length: 1 << n }, (_, z) => z).filter((z) => mask & (1 << z));

// ---------------------------------------------------------------- arrows

/** TikZ's default arrow tip (`to`): two curved barbs ending at `tip`, pointing along `d`, as a stroked path. */
export function tipTo(f: Frame, tip: V, d: V, size = 0.13) {
	const u = unit(d);
	const n = v(-u.y, u.x);
	const back = sub(tip, scale(u, size));
	const l = add(back, scale(n, size * 0.75)), r = sub(back, scale(n, size * 0.75));
	const q = (p: V) => { const s = f.px(p); return `${s.x.toFixed(2)},${s.y.toFixed(2)}`; };
	const cl = add(sub(tip, scale(u, size * 0.35)), scale(n, size * 0.1)), cr = sub(sub(tip, scale(u, size * 0.35)), scale(n, size * 0.1));
	return `M${q(l)} Q${q(cl)} ${q(tip)} Q${q(cr)} ${q(r)}`;
}

/** TikZ's `stealth` tip: a filled dart, as a closed path. */
export function tipStealth(f: Frame, tip: V, d: V, size = 0.2) {
	const u = unit(d);
	const n = v(-u.y, u.x);
	const back = sub(tip, scale(u, size));
	const inset = sub(tip, scale(u, size * 0.7));
	const l = add(back, scale(n, size * 0.45)), r = sub(back, scale(n, size * 0.45));
	return `${f.path([tip, l, inset, r], true)}`;
}

/** A cubic Bézier in TikZ coordinates, and its point and tangent at the end. */
export type Curve = { p0: V; c1: V; c2: V; p1: V };
export const curvePath = (f: Frame, c: Curve) => {
	const q = (p: V) => { const s = f.px(p); return `${s.x.toFixed(2)},${s.y.toFixed(2)}`; };
	return `M${q(c.p0)} C${q(c.c1)} ${q(c.c2)} ${q(c.p1)}`;
};

/**
 * From node P to node Q, leaving the nodes' borders (radius `r`) plus TikZ's `shorten` of 2pt. `bend` in degrees turns
 * the line into TikZ's `bend left`: it leaves at that angle to the left of PQ and arrives symmetric.
 */
export function edge(P: V, Q: V, r: number, bend = 0): Curve {
	const t = (bend * Math.PI) / 180;
	const u = unit(sub(Q, P));
	const out = rot(u, t), inn = rot(u, -t);
	const p0 = add(P, scale(out, r)), p1 = sub(Q, scale(inn, r));
	const k = 0.3915 * len(sub(p1, p0));
	return { p0, c1: add(p0, scale(out, k)), c2: sub(p1, scale(inn, k)), p1 };
}

/** TikZ's `to[out=a+30, in=a-30, looseness=8]` from a node to itself: a loop pointing in direction `a` (radians). */
export function loop(P: V, a: number, r: number, reach = 0.75): Curve {
	const o = v(Math.cos(a + 0.52), Math.sin(a + 0.52)), i = v(Math.cos(a - 0.52), Math.sin(a - 0.52));
	const p0 = add(P, scale(o, r)), p1 = add(P, scale(i, r));
	return { p0, c1: add(p0, scale(o, reach)), c2: add(p1, scale(i, reach)), p1 };
}

/** The direction a curve arrives in, for its tip. */
export const endDir = (c: Curve) => {
	const d = sub(c.p1, c.c2);
	return len(d) > 1e-9 ? d : sub(c.p1, c.p0);
};
