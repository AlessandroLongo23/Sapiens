'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import katex from 'katex';
import { useReducedMotion } from '@/lib/hooks/use-media';

export { useReducedMotion };

/**
 * What every interactive figure of the lessons shares, so they all look like the TikZ figures around them: the
 * same scale, line widths, tints and letters. A figure works in TikZ centimetres with y upwards, like the TikZ code
 * it stands next to, and a `Frame` turns those into SVG points.
 *
 * The drawing goes in <Drawing>, which the dark theme inverts like a compiled TikZ figure (black lines turn light,
 * tints stay tints); controls go outside it, in <Controls>, and use the site's own components (ui/Button, ui/Slider).
 */

// ---------------------------------------------------------------- geometry

export type V = { x: number; y: number };
export const v = (x: number, y: number): V => ({ x, y });
export const add = (a: V, b: V) => v(a.x + b.x, a.y + b.y);
export const sub = (a: V, b: V) => v(a.x - b.x, a.y - b.y);
export const scale = (a: V, k: number) => v(a.x * k, a.y * k);
export const dot = (a: V, b: V) => a.x * b.x + a.y * b.y;
export const cross = (a: V, b: V) => a.x * b.y - a.y * b.x;
export const len = (a: V) => Math.hypot(a.x, a.y);
export const dist = (a: V, b: V) => len(sub(a, b));
export const rot = (a: V, t: number) => v(a.x * Math.cos(t) - a.y * Math.sin(t), a.x * Math.sin(t) + a.y * Math.cos(t));
/** P turned by t around C. */
export const rotAround = (p: V, c: V, t: number) => add(c, rot(sub(p, c), t));
export const ang = (a: V) => Math.atan2(a.y, a.x);
export const lerp = (a: V, b: V, t: number) => v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
export const mid = (a: V, b: V) => lerp(a, b, 0.5);
export const unit = (a: V) => scale(a, 1 / (len(a) || 1));
export const polar = (r: number, t: number) => v(r * Math.cos(t), r * Math.sin(t));
export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
/** The angle at B of the triangle ABC, in degrees (0 to 180). */
export const angleDeg = (a: V, b: V, c: V) => (Math.acos(clamp(dot(unit(sub(a, b)), unit(sub(c, b))), -1, 1)) * 180) / Math.PI;
/** The foot of the perpendicular from P to the line AB. */
export const project = (p: V, a: V, b: V) => {
	const u = sub(b, a);
	return add(a, scale(u, dot(sub(p, a), u) / (dot(u, u) || 1)));
};
/** Where the lines AB and CD meet, or null if they are parallel. */
export function intersect(a: V, b: V, c: V, d: V): V | null {
	const r = sub(b, a), s = sub(d, c);
	const den = cross(r, s);
	if (Math.abs(den) < 1e-12) return null;
	return add(a, scale(r, cross(sub(c, a), s) / den));
}
/** Area of a polygon (positive if counterclockwise). */
export const area = (ps: V[]) => ps.reduce((s, p, i) => s + cross(p, ps[(i + 1) % ps.length]), 0) / 2;

// ---------------------------------------------------------------- style

/** TikZ centimetres to CSS pixels: 28.45 pt per cm, at the lessons' FIGURE_SCALE of 1.5. */
export const K = 28.4528 * 1.5;
/** TikZ's xcolor mixes, as the lessons use them: `blue!10` is 10% blue on white. */
export const TINT = {
	blue: '#e6e6ff', // blue!10
	blue20: '#ccccff', // blue!20
	orange: '#ffdfbf', // orange!25
	green: '#d9f2d9', // green!15 (xcolor green is 0,1,0; 15% on white, softened)
	red: '#ffd9d9', // red!15
	yellow: '#ffffcc', // yellow!20
	gray: '#e6e6e6' // gray!20
} as const;
/** Strong colours for marks and highlights: TikZ's own `blue`, `red`, `orange` and a readable green. */
export const INK = { black: '#000', blue: '#0000ff', red: '#ff0000', orange: '#ff8000', green: '#008000', gray: '#808080' } as const;
export const THICK = 1.2; // thick, 0.8pt
export const THIN = 0.6; // TikZ's default and thin, 0.4pt
export const VERY_THIN = 0.3; // very thin, 0.2pt
export const DASH = '4.5 4.5'; // dashed: 3pt on, 3pt off
export const DOTTED = '0.6 2.4'; // dotted
/** 10pt at FIGURE_SCALE, the size of TikZ's node text in the lessons. */
export const FONT_SIZE = 15;
export const FONT = "KaTeX_Main, 'Latin Modern Roman', 'Times New Roman', serif";
export const FONT_MATH = "KaTeX_Math, 'Latin Modern Math', 'Times New Roman', serif";

// ---------------------------------------------------------------- frame

export type Frame = ReturnType<typeof frame>;

/**
 * The drawing's window in TikZ centimetres. Pick it to hold everything the figure can reach under its controls, so
 * the figure never changes size while the student plays with it.
 */
export function frame(x0: number, x1: number, y0: number, y1: number) {
	const W = (x1 - x0) * K;
	const H = (y1 - y0) * K;
	// Rounded to a hundredth of a pixel: the server and the browser can disagree on the last digits of a sine, and
	// an SVG attribute that differs by 1e-15 breaks the hydration of a figure rendered on the server (the scenes).
	const r2 = (x: number) => Math.round(x * 100) / 100;
	const px = (p: V) => v(r2((p.x - x0) * K), r2((y1 - p.y) * K));
	const n = (x: number) => x.toFixed(2);
	/** Points for <polyline>/<polygon>. */
	const pts = (...ps: V[]) => ps.map((p) => { const q = px(p); return `${n(q.x)},${n(q.y)}`; }).join(' ');
	/** A path through the points, closed with `closed`. */
	const path = (ps: V[], closed = false) => ps.map((p, i) => { const q = px(p); return `${i ? 'L' : 'M'}${n(q.x)},${n(q.y)}`; }).join(' ') + (closed ? ' Z' : '');
	/** An arc of radius ρ at P, counterclockwise from direction a to direction b: the mark of the angle between them. */
	const arc = (P: V, a: V, b: V, rho = 0.3) => {
		const t0 = ang(a);
		let t1 = ang(b);
		if (t1 < t0) t1 += 2 * Math.PI;
		const s = px(add(P, polar(rho, t0)));
		const e = px(add(P, polar(rho, t1)));
		return `M${n(s.x)},${n(s.y)} A${n(rho * K)},${n(rho * K)} 0 ${t1 - t0 > Math.PI ? 1 : 0} 0 ${n(e.x)},${n(e.y)}`;
	};
	/** The same arc as a filled sector, for a coloured angle. */
	const sector = (P: V, a: V, b: V, rho = 0.3) => {
		const c = px(P);
		return `M${n(c.x)},${n(c.y)} ${arc(P, a, b, rho).replace(/^M/, 'L')} Z`;
	};
	/** The small square of a right angle at P, between directions a and b. */
	const right = (P: V, a: V, b: V, s = 0.2) => pts(add(P, scale(unit(a), s)), add(add(P, scale(unit(a), s)), scale(unit(b), s)), add(P, scale(unit(b), s)));
	/** The tick (or `count` ticks) that marks segment PQ as congruent to another, as a path. */
	const tick = (P: V, Q: V, count = 1, half = 0.11) => {
		const u = unit(sub(Q, P));
		const nn = scale(v(-u.y, u.x), half);
		return Array.from({ length: count }, (_, i) => {
			const m = add(mid(P, Q), scale(u, (i - (count - 1) / 2) * 0.08));
			return path([add(m, nn), sub(m, nn)]);
		}).join(' ');
	};
	/** A pointer event's position, in TikZ centimetres. */
	const toTikz = (e: { clientX: number; clientY: number }, svg: SVGSVGElement) => {
		const box = svg.getBoundingClientRect();
		return v(x0 + (((e.clientX - box.left) / box.width) * W) / K, y1 - (((e.clientY - box.top) / box.height) * H) / K);
	};
	return { x0, x1, y0, y1, W, H, px, pts, path, arc, sector, right, tick, toTikz };
}

// ---------------------------------------------------------------- drawing

/**
 * The SVG of a figure. At TikZ's scale on a wide screen, shrunk with the column on a phone; `.tikz-drawing` is what
 * the dark theme inverts. Vertical page scrolling still works over it, except on the handles.
 */
export function Drawing({ f, label, children, svgRef }: { f: Frame; label?: string; children: ReactNode; svgRef?: RefObject<SVGSVGElement | null> }) {
	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${f.W.toFixed(1)} ${f.H.toFixed(1)}`}
			width={f.W}
			height={f.H}
			className="tikz-drawing max-w-full select-none"
			style={{ height: 'auto', touchAction: 'pan-y' }}
			role="img"
			aria-label={label}
		>
			{children}
		</svg>
	);
}

/**
 * A TikZ node: text set off from its point in the direction `dir` (like `above right`: v(0.7, 0.7)). Letters are
 * italic like math; pass `upright` for numbers and words.
 */
export function Label({ f, at, dir = v(0, 0), upright = false, size = FONT_SIZE, color = '#000', children }: { f: Frame; at: V; dir?: V; upright?: boolean; size?: number; color?: string; children: ReactNode }) {
	const p = f.px(add(at, scale(dir, 0.2)));
	const anchor = dir.x > 0.3 ? 'start' : dir.x < -0.3 ? 'end' : 'middle';
	const dy = dir.y > 0.3 ? '0' : dir.y < -0.3 ? '0.75em' : '0.35em';
	return (
		<text x={p.x} y={p.y} dy={dy} textAnchor={anchor} fontSize={size} fontStyle={upright ? 'normal' : 'italic'} fontFamily={upright ? FONT : FONT_MATH} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}

/** A filled dot, as TikZ's `\fill (P) circle (1.5pt)`. */
export function Dot({ f, at, r = 2.2, color = '#000' }: { f: Frame; at: V; r?: number; color?: string }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={r} fill={color} pointerEvents="none" />;
}

// ---------------------------------------------------------------- interaction

/**
 * A point the student drags. It draws its dot, a ring when hovered or focused, and a large invisible target for a
 * finger. `onMove` gets the pointer in TikZ centimetres and decides where the point goes (clamp it, snap it, keep it
 * on a curve). With the keyboard it moves by `step` with the arrows (ten times with Shift).
 */
export function Handle({ f, at, onMove, label, color = '#000', step = 0.1, onEnd }: { f: Frame; at: V; onMove: (p: V) => void; label: string; color?: string; step?: number; onEnd?: () => void }) {
	const p = f.px(at);
	const [active, setActive] = useState(false);
	const down = (e: PointerEvent<SVGGElement>) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.setPointerCapture(e.pointerId);
		setActive(true);
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		if (!active) return;
		const svg = e.currentTarget.ownerSVGElement;
		if (svg) onMove(f.toTikz(e, svg));
	};
	const up = () => {
		setActive(false);
		onEnd?.();
	};
	const key = (e: KeyboardEvent<SVGGElement>) => {
		const d = { ArrowLeft: v(-1, 0), ArrowRight: v(1, 0), ArrowUp: v(0, 1), ArrowDown: v(0, -1) }[e.key];
		if (!d) return;
		e.preventDefault();
		onMove(add(at, scale(d, step * (e.shiftKey ? 10 : 1))));
		onEnd?.();
	};
	return (
		<g
			role="button"
			tabIndex={0}
			aria-label={`${label}: trascinalo, oppure usa le frecce`}
			className="group cursor-grab outline-none active:cursor-grabbing"
			style={{ touchAction: 'none' }}
			onPointerDown={down}
			onPointerMove={move}
			onPointerUp={up}
			onPointerCancel={up}
			onKeyDown={key}
		>
			<circle cx={p.x} cy={p.y} r={16} fill="transparent" />
			<circle cx={p.x} cy={p.y} r={7} fill="none" stroke={color} strokeWidth={1} className={active ? 'opacity-60' : 'opacity-0 transition-opacity group-hover:opacity-40 group-focus-visible:opacity-80'} />
			<circle cx={p.x} cy={p.y} r={3} fill={color} />
		</g>
	);
}

/** Dragging a whole piece (not a point): the pointer's movement in TikZ centimetres since the last event. */
export function usePieceDrag(f: Frame, onDelta: (d: V, at: V) => void, onEnd?: () => void) {
	const last = useRef<V | null>(null);
	return {
		onPointerDown: (e: PointerEvent<SVGElement>) => {
			const svg = e.currentTarget.ownerSVGElement;
			if (!svg) return;
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			last.current = f.toTikz(e, svg);
		},
		onPointerMove: (e: PointerEvent<SVGElement>) => {
			const svg = e.currentTarget.ownerSVGElement;
			if (!last.current || !svg) return;
			const p = f.toTikz(e, svg);
			onDelta(sub(p, last.current), p);
			last.current = p;
		},
		onPointerUp: () => {
			last.current = null;
			onEnd?.();
		},
		onPointerCancel: () => {
			last.current = null;
			onEnd?.();
		},
		style: { touchAction: 'none' as const, cursor: 'grab' }
	};
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * A number that animates towards the targets it is given: `[t, go, running]`, where `go(1)` moves t to 1 over `ms`
 * and `go(x, 0)` sets it at once (a slider for the construction's progress). Figures
 * that play a construction (pieces sliding into place) drive every moving part from one t between 0 and 1. With
 * reduced motion it jumps.
 */
export function useTween(initial = 0, ms = 900): [number, (target: number, duration?: number) => Promise<void>, boolean] {
	const [value, setValue] = useState(initial);
	const [running, setRunning] = useState(false);
	const current = useRef(initial);
	const frameId = useRef(0);
	const reduced = useReducedMotion();
	useEffect(() => () => cancelAnimationFrame(frameId.current), []);
	const go = useCallback(
		(target: number, duration = ms) =>
			new Promise<void>((resolve) => {
				cancelAnimationFrame(frameId.current);
				const from = current.current;
				if (reduced || duration <= 0 || from === target) {
					current.current = target;
					setValue(target);
					resolve();
					return;
				}
				const start = performance.now();
				setRunning(true);
				const tick = (now: number) => {
					const t = Math.min(1, (now - start) / duration);
					current.current = from + (target - from) * easeInOut(t);
					setValue(current.current);
					if (t < 1) frameId.current = requestAnimationFrame(tick);
					else {
						setRunning(false);
						resolve();
					}
				};
				frameId.current = requestAnimationFrame(tick);
			}),
		[ms, reduced]
	);
	return [value, go, running];
}

/** Runs `step(dt)` on every animation frame while `on` is true (simulations). dt in seconds, at most 1/30. */
export function useFrameLoop(on: boolean, step: (dt: number) => void) {
	const cb = useRef(step);
	useEffect(() => {
		cb.current = step;
	});
	useEffect(() => {
		if (!on) return;
		let id = 0;
		let last = performance.now();
		const tick = (now: number) => {
			cb.current(Math.min((now - last) / 1000, 1 / 30));
			last = now;
			id = requestAnimationFrame(tick);
		};
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	}, [on]);
}

// ---------------------------------------------------------------- layout

/** The whole figure: drawing, caption, controls, one under the other and centred. */
export function Figure({ children }: { children: ReactNode }) {
	return <div className="flex w-full flex-col items-center gap-4">{children}</div>;
}

/** What the figure shows now, in a sentence; read out when it changes. May hold <Tex>. */
export function Caption({ children }: { children: ReactNode }) {
	return (
		<p className="m-0 max-w-xl text-center text-sm text-fg-muted" aria-live="polite">
			{children}
		</p>
	);
}

/** Sliders, one per line, and a row of buttons. */
export function Controls({ children }: { children: ReactNode }) {
	return <div className="flex w-full max-w-lg flex-col gap-3">{children}</div>;
}
export function ButtonRow({ children }: { children: ReactNode }) {
	return <div className="flex flex-wrap justify-center gap-2">{children}</div>;
}

/** A readout of values ($|A \cup B| = 7$ and the like), in the figure's own row under the drawing. */
export function Readout({ children }: { children: ReactNode }) {
	return <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-fg">{children}</div>;
}

/** Inline KaTeX for captions, readouts and labels outside the drawing. */
export function Tex({ children, display = false }: { children: string; display?: boolean }) {
	// typeset once per formula, not at every frame of a figure that moves
	const html = useMemo(() => katex.renderToString(children, { displayMode: display, throwOnError: false, output: 'html' }), [children, display]);
	return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A number the Italian way: 2.5 → "2,5", with at most `digits` decimals and no trailing zeros. */
export function num(x: number, digits = 2) {
	const r = Number(x.toFixed(digits));
	return (Object.is(r, -0) ? 0 : r).toString().replace('.', ',');
}

/** The same number for <Tex>: KaTeX spaces a bare comma, so the decimal comma is written `{,}` (2{,}5). */
export function texNum(x: number, digits = 2) {
	return num(x, digits).replace(',', '{,}');
}
