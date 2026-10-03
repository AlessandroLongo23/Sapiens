'use client';

import { useCallback, useDeferredValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react';
import { Home, Minus, Plus, Scan } from 'lucide-react';
import { FONT, FONT_MATH, THIN, VERY_THIN } from '@/components/content/interactive/kit';
import { axisMarks, italian, type AxisKind } from '@/lib/grafico/assi';
import type { Point, View } from '@/lib/grafico/curva';
import { HOME, type Camera, type LineDash, type LineWidth } from '@/lib/grafico/documento';
import { notablePoints, type Notable, type NotableKind } from '@/lib/grafico/notevoli';
import { cn } from '@/lib/utils/cn';
import { sampleCurve } from './sampling';

/**
 * The Cartesian plane of the site (vault/Decisioni/2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza
 * librerie di grafici.md): axes, squared grid and curves in SVG, in the hand of the TikZ figures. With `onCamera`
 * the student moves it: drag to pan, two fingers or the wheel to zoom, the arrows and + − from the keyboard.
 * Without it the window is fixed, as a lesson sets it, and the page scrolls over the figure.
 *
 * Reading the graph: the notable points are marked, a point follows the mouse along the nearest curve, and a
 * click on a curve or on a notable point leaves a label there until it is clicked again.
 */

/** What a curve is: y = f(x), F(x, y) = 0, (x(t), y(t)) for t in a range, or the region where F(x, y) < 0. */
export type PlaneShape =
	| { f: (x: number) => number; /** The tangent at this x, with its slope on the plane. */ tangent?: { x: number; slope: number }; /** The area between the curve and the x axis, from a to b, with what to write in it. */ area?: { a: number; b: number; text: string } }
	| { implicit: (x: number, y: number) => number }
	| { parametric: { x: (t: number) => number; y: (t: number) => number; t0: number; t1: number } }
	| { region: (x: number, y: number) => number; strict: boolean }
		/** Points on their own, found for the window in view: the terms of a sequence, (n; a_n). */
		| { dots: (view: View) => Point[]; /** Many points that make a figure together, each a speck: the thousands of a chaos game. */ small?: boolean }
	/** Straight pieces found for the window in view: a ray up to its edge, a polygon, the arc of an angle with its size beside it. */
	| { path: (view: View, sx: number, sy: number) => PlanePath };

export interface PlanePath {
	lines: Point[][];
	/** The first line is closed and filled, lightly. */
	fill?: boolean;
	/** Written on the plane, centred at this point. */
	label?: { at: Point; text: string };
}

/** A point on the plane that is not a curve's: a point the student wrote, the foot of a tangent, an end of an area. */
export interface PlaneMark {
	id: string;
	at: Point;
	color: string;
	/** Its letter, beside it. */
	name?: string;
	/** Written in a label beside it: the slope of a tangent. */
	text?: string;
	/** Given, the point can be dragged: it gets where the pointer is, and decides where it goes. */
	onDrag?: (to: Point) => void;
	/** A dragged point stops on the lines of the grid when it comes near them. */
	snap?: boolean;
	/** False for a label with no dot under it: the length written on a distance. */
	dot?: boolean;
}

/** The pixels to a unit on the two axes, and the step of the grid's thin lines, for who reads a click on the plane. */
export interface PlaneScale {
	sx: number;
	sy: number;
	gx: number;
	gy: number;
}

/**
 * A tool is in hand: the plane gives the clicks and the pointer's place to it, in the plane's coordinates, and keeps
 * its own points and labels out of the way. Dragging still moves the window.
 */
export interface PlanePick {
	onPick: (at: Point, scale: PlaneScale) => void;
	onHover: (at: Point | null, scale: PlaneScale) => void;
}

export type PlaneCurve = PlaneShape & {
	id: string;
	color: string;
	width?: LineWidth;
	dash?: LineDash;
		/** Written beside the curve: the function's letter. */
	label?: string;
	/** Says what the curve is: while it stays the same the curve has not changed, and is not found again. Without it the curve is found again at every drawing. */
	stamp?: string;
};

/** The curve as a function of x, for what only a function has (its notable points, the point that follows the mouse). */
const NOWHERE = () => NaN;
const asFunction = (c: PlaneCurve) => ('f' in c ? c.f : NOWHERE);

export interface PlaneLook {
	grid: boolean;
	axes: boolean;
	numbers: boolean;
	/** The grid of polar coordinates in place of the squares, with its rays named in radians or in degrees. */
	polar?: 'radians' | 'degrees';
	/** The marks of the x axis. */
	xAxis: AxisKind;
	/** The names written on the axes; x and y when absent. */
	xName?: string;
	yName?: string;
	/**
	 * What one unit of the plane is worth on the x axis, where the axis is read in another unit: 180/π in degrees, so
	 * that 90° sits where π/2 does and the picture keeps its shape. 1 when absent.
	 */
	xUnit?: number;
}

export interface PlaneHandle {
	/** The drawing as it is now, for an image to download. */
	svg: () => SVGSVGElement | null;
	/** The size of the drawing in pixels, which a window given in numbers needs. */
	size: () => { w: number; h: number };
}

const NO_MARKS: PlaneMark[] = [];
const NO_CURVES: PlaneCurve[] = [];
const DEFAULT_LOOK: PlaneLook = { grid: true, axes: true, numbers: true, xAxis: 'numbers' };
const MIN_SPAN = 0.002;
const MAX_SPAN = 200000;
/** The size the server draws at, and the browser until it has measured the box. */
const DEFAULT_SIZE = { w: 800, h: 560 };

const KIND_NAMES: Record<NotableKind, string> = {
	zero: 'Zero',
	intercept: 'Intersezione con l’asse y',
	max: 'Massimo',
	min: 'Minimo',
	meet: 'Intersezione'
};

const STROKE: Record<LineWidth, number> = { thin: 1.1, normal: 1.7, thick: 2.8 };
const DASH: Record<LineDash, string | undefined> = { solid: undefined, dashed: '7 5', dotted: '0.1 5' };

const r2 = (x: number) => Math.round(x * 100) / 100;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** The coordinates of a point as the school writes them: (1,5; −2). `xMark` follows the x: the sign of degrees. */
export function coordinates(p: Point, digits = 3, xMark = '') {
	return `(${italian(p.x, digits)}${xMark}; ${italian(p.y, digits)})`;
}

/** A label the student has left on a curve: at this x, whatever the curve becomes. */
interface Pin {
	curve: string;
	x: number;
}

export function Plane({
	ref,
	camera,
	onCamera,
	home = HOME,
	curves,
	marks = NO_MARKS,
	onFit,
	pick,
	overlay = NO_CURVES,
	look = DEFAULT_LOOK,
	notable = true,
	wheel = 'zoom',
	label,
	className
}: {
	ref?: Ref<PlaneHandle>;
	camera: Camera;
	/** Given, the student moves the window; absent, the window is fixed. */
	onCamera?: (camera: Camera) => void;
	/** Where the home button and the 0 key go back to. */
	home?: Camera;
	curves: PlaneCurve[];
	marks?: PlaneMark[];
	/** Given, a button asks for the window that holds the curves. */
	onFit?: () => void;
	/** Given, a tool is in hand: see PlanePick. */
	pick?: PlanePick;
	/** Curves drawn over the others and apart from them, which change with the pointer: what a tool is about to make. */
	overlay?: PlaneCurve[];
	look?: PlaneLook;
	/** Marks zeros, turning points and meetings. */
	notable?: boolean;
	/** 'zoom': the wheel zooms. 'ctrl': only with Ctrl or a pinch on the trackpad, so the page still scrolls over a figure. */
	wheel?: 'zoom' | 'ctrl';
	label: string;
	className?: string;
}) {
	const box = useRef<HTMLDivElement>(null);
	const svg = useRef<SVGSVGElement>(null);
	const [size, setSize] = useState(DEFAULT_SIZE);
	const [shown, setShown] = useState<string | null>(null);
	const [trace, setTrace] = useState<Pin | null>(null);
	const [pins, setPins] = useState<Pin[]>([]);
	const free = !!onCamera;

	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const measure = () => {
			const { width, height } = node.getBoundingClientRect();
			if (width > 0 && height > 0) setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const { w, h } = size;
	const sx = w / camera.span;
	const sy = sx * camera.stretch;
	const view: View = useMemo(
		() => ({ x0: camera.cx - camera.span / 2, x1: camera.cx + camera.span / 2, y0: camera.cy - h / (2 * sy), y1: camera.cy + h / (2 * sy) }),
		[camera.cx, camera.cy, camera.span, h, sy]
	);
	const X = (x: number) => r2((x - view.x0) * sx);
	const Y = (y: number) => r2((view.y1 - y) * sy);

	// ------------------------------------------------------------ moving the window

	// The gestures read the camera from a ref: several pointer events can arrive before the next render.
		const cam = useRef(camera);
	const dims = useRef(size);
	// The camera the plane has asked for and not yet seen drawn. Until it comes back the ref is ahead of the drawing
	// and must stay so: put back to the camera of a drawing that is late, the next step of a drag would start from
	// an old place, and the plane would jump back and forth under the pointer.
	const asked = useRef<{ camera: Camera; at: number } | null>(null);
	useEffect(() => {
		dims.current = size;
		const waiting = asked.current;
		// a camera set from outside (the window typed in numbers, an example) wins once the plane has been still
		if (waiting && camera !== waiting.camera && performance.now() - waiting.at < 400) return;
		asked.current = null;
		cam.current = camera;
	});
	useImperativeHandle(ref, () => ({ svg: () => svg.current, size: () => dims.current }));

	const move = useCallback(
		(next: Camera) => {
						cam.current = { ...next, span: clamp(next.span, MIN_SPAN, MAX_SPAN) };
			asked.current = { camera: cam.current, at: performance.now() };
			onCamera?.(cam.current);
		},
		[onCamera]
	);
	/** Zooms by k (below 1 goes closer) keeping the point of the drawing at (px, py) where it is. */
	const zoomAt = useCallback(
		(px: number, py: number, k: number) => {
			const c = cam.current;
			const { w, h } = dims.current;
			const s = w / c.span;
			const span = clamp(c.span * k, MIN_SPAN, MAX_SPAN);
			const s2 = w / span;
			const wx = c.cx + (px - w / 2) / s;
			const wy = c.cy - (py - h / 2) / (s * c.stretch);
			move({ ...c, cx: wx - (px - w / 2) / s2, cy: wy + (py - h / 2) / (s2 * c.stretch), span });
		},
		[move]
	);

	const pointers = useRef(new Map<number, { x: number; y: number }>());
	/** Where the press began, to tell a click from a drag. */
	const press = useRef<{ x: number; y: number; moved: boolean } | null>(null);
	const local = (e: { clientX: number; clientY: number }) => {
		const rect = svg.current!.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	};

	/** The curve under a point of the drawing, within `reach` pixels above or below, and the x there. */
	const curveAt = (p: { x: number; y: number }, reach: number): Pin | null => {
		const x = view.x0 + p.x / sx;
		let best: Pin | null = null;
		let distance = reach;
		for (const c of curves) {
			const y = asFunction(c)(x);
			if (!Number.isFinite(y)) continue;
			const d = Math.abs((view.y1 - y) * sy - p.y);
			if (d < distance) {
				distance = d;
				best = { curve: c.id, x };
			}
		}
		return best;
	};
	// the x axis as it is read: in degrees a point of the plane at π/2 is written 90°
	const xUnit = look.xUnit ?? 1;
	const xMark = look.xAxis === 'degrees' ? '°' : '';
	const written = (p: Point) => coordinates({ x: p.x * xUnit, y: p.y }, 3, xMark);
	// a traced x has the decimals the zoom can tell apart, so the label reads 1,25 and not 1,2483
	const traceDigits = clamp(Math.ceil(Math.log10(sx / xUnit)) + 1, 0, 8);
	const tidyX = (x: number) => Number((x * xUnit).toFixed(traceDigits)) / xUnit;

	/** A place of the drawing in the plane's coordinates, and the scale a tool reads it with. */
	const world = (p: { x: number; y: number }): Point => ({ x: view.x0 + p.x / sx, y: view.y1 - p.y / sy });
	const scale = (): PlaneScale => ({ sx, sy, gx: gridStep.x, gy: gridStep.y });

	const down = (e: PointerEvent<SVGSVGElement>) => {
		const p = local(e);
		press.current = { ...p, moved: false };
		if (!free) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		pointers.current.set(e.pointerId, p);
	};
	const drag = (e: PointerEvent<SVGSVGElement>) => {
		const now = local(e);
		const before = pointers.current.get(e.pointerId);
		if (!before) {
			if (pick) {
				if (e.pointerType === 'mouse') pick.onHover(world(now), scale());
				return;
			}
			// no button down: the point follows the mouse along the curve under it
			if (e.pointerType === 'mouse') {
				const at = curveAt(now, 14);
				setTrace(at && { ...at, x: tidyX(at.x) });
			}
			return;
		}
		if (press.current && Math.hypot(now.x - press.current.x, now.y - press.current.y) > 5) press.current.moved = true;
		const c = cam.current;
		const s = dims.current.w / c.span;
		if (pointers.current.size === 1) {
			// a press that has not moved yet may be a click: the plane waits
			if (!press.current?.moved) return;
			move({ ...c, cx: c.cx - (now.x - before.x) / s, cy: c.cy + (now.y - before.y) / (s * c.stretch) });
		} else if (pointers.current.size === 2) {
			const other = [...pointers.current.entries()].find(([id]) => id !== e.pointerId)![1];
			const d0 = Math.hypot(before.x - other.x, before.y - other.y);
			const d1 = Math.hypot(now.x - other.x, now.y - other.y);
			// the other finger stays where it is: the plane stretches around it
			if (d0 > 0 && d1 > 0) zoomAt(other.x, other.y, d0 / d1);
		}
		pointers.current.set(e.pointerId, now);
	};
	const samePin = (a: Pin, b: Pin) => a.curve === b.curve && Math.abs(a.x - b.x) * sx < 9;
	const togglePin = (pin: Pin) => setPins((list) => (list.some((p) => samePin(p, pin)) ? list.filter((p) => !samePin(p, pin)) : [...list, pin]));
	const up = (e: PointerEvent<SVGSVGElement>) => {
		const wasClick = press.current && !press.current.moved && pointers.current.size <= 1;
		pointers.current.delete(e.pointerId);
		if (!wasClick || e.type === 'pointercancel') return;
		if (pick) {
			pick.onPick(world(local(e)), scale());
			return;
		}
		// a click on a curve leaves a label there; a click on a label takes it away
		const at = curveAt(local(e), e.pointerType === 'mouse' ? 14 : 22);
		if (at) togglePin({ ...at, x: tidyX(at.x) });
	};

	// React's wheel listener is passive: the page would scroll under the zoom.
	useEffect(() => {
		const node = svg.current;
		if (!node || !free) return;
		const onWheel = (e: WheelEvent) => {
			if (wheel === 'ctrl' && !e.ctrlKey) return;
			e.preventDefault();
			const rect = node.getBoundingClientRect();
			// a pinch on a trackpad arrives as a wheel with Ctrl and small steps
			zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
		};
		node.addEventListener('wheel', onWheel, { passive: false });
		return () => node.removeEventListener('wheel', onWheel);
	}, [free, wheel, zoomAt]);

	const keys = (e: KeyboardEvent<SVGSVGElement>) => {
		if (!free || e.target !== e.currentTarget) return;
		const c = cam.current;
		const step = c.span * 0.1;
		const to: Record<string, Camera> = {
			ArrowLeft: { ...c, cx: c.cx - step },
			ArrowRight: { ...c, cx: c.cx + step },
			ArrowUp: { ...c, cy: c.cy + step / c.stretch },
			ArrowDown: { ...c, cy: c.cy - step / c.stretch },
			'+': { ...c, span: c.span / 1.25 },
			'=': { ...c, span: c.span / 1.25 },
			'-': { ...c, span: c.span * 1.25 },
			'0': home
		};
		if (!to[e.key]) return;
		e.preventDefault();
		move(to[e.key]);
	};

	// ------------------------------------------------------------ what is drawn

	// the marks of the x axis are found in the unit the axis is read in, and drawn where they fall on the plane
	const xRead = axisMarks(look.xAxis, view.x0 * xUnit, view.x1 * xUnit, xUnit / sx);
	const xMarks = { major: xRead.major.map((v) => v / xUnit), minor: xRead.minor.map((v) => v / xUnit), label: (x: number) => xRead.label(x * xUnit) };
	const yMarks = axisMarks('numbers', view.y0, view.y1, 1 / sy);
	const gridStep = { x: xMarks.minor.length > 1 ? xMarks.minor[1] - xMarks.minor[0] : 1, y: yMarks.minor.length > 1 ? yMarks.minor[1] - yMarks.minor[0] : 1 };
	const axisX = clamp(X(0), 0, w);
	const axisY = clamp(Y(0), 0, h);
	// the numbers follow their axis, and stay on the edge when the axis is out of the window
	const xNumbersBelow = axisY < h - 22;
	const yNumbersLeft = axisX > 34;
	const xAxisIn = view.y0 <= 0 && view.y1 >= 0;
	const yAxisIn = view.x0 <= 0 && view.x1 >= 0;

	// Found again only for what has changed; a slow curve that keeps changing is drawn coarse, and asked again fine
	// once the window and the curves have been still for a moment.
	const [rested, setRested] = useState<{ curves: PlaneCurve[]; view: View } | null>(null);
	const fine = rested !== null && rested.curves === curves && rested.view === view;
	const sampled = useMemo(() => curves.map((c) => sampleCurve(c, view, w, h, sx, sy, fine)), [curves, view, w, h, sx, sy, fine]);
	const anyCoarse = sampled.some((s) => s.coarse);
	useEffect(() => {
		if (!anyCoarse) return;
		const timer = window.setTimeout(() => setRested({ curves, view }), 180);
		return () => window.clearTimeout(timer);
	}, [anyCoarse, curves, view]);
	const lines = sampled.map((s) => s.lines);
	const pathOf = (curve: Point[][]) => curve.map((line) => line.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(2)},${Y(p.y).toFixed(2)}`).join('')).join('');
	const paths = lines.map(pathOf);

	// The points are searched for after the curves are drawn: while the window moves they may trail by a frame,
	// which a heavy formula (a series of 2000 terms) would otherwise pay twice.
	const settled = useDeferredValue(view);
	const points: Notable[][] = useMemo(() => (notable ? notablePoints(curves.map(asFunction), settled) : []), [curves, settled, notable]);

	/** The point of the plane under the pointer, for a mark being dragged: on a line of the grid when it is near one. */
	const toPlane = (e: { clientX: number; clientY: number }, snap: boolean): Point => {
		const p = local(e);
		let x = view.x0 + p.x / sx;
		let y = view.y1 - p.y / sy;
		if (snap) {
			const near = (v: number, lines: number[], scale: number) => {
				const line = lines.reduce((best, l) => (Math.abs(l - v) < Math.abs(best - v) ? l : best), Infinity);
				return Math.abs(line - v) * scale < 7 ? line : v;
			};
			x = near(x, xMarks.minor, sx);
			y = near(y, yMarks.minor, sy);
		}
		const digits = clamp(Math.ceil(Math.log10(sy)) + 1, 0, 8);
		return { x: tidyX(x), y: Number(y.toFixed(digits)) };
	};

	/** Where a curve's letter goes: on the curve, towards the right of the window and clear of its edges. */
	const nameSpot = (curve: Point[][]): Point | null => {
		let best: Point | null = null;
		let distance = Infinity;
		for (const line of curve)
			for (const p of line) {
				const px = (p.x - view.x0) * sx;
				const py = (view.y1 - p.y) * sy;
				if (px < 24 || px > w - 40 || py < 26 || py > h - 26) continue;
				const d = Math.abs(px - w * 0.82);
				if (d < distance) {
					distance = d;
					best = p;
				}
			}
		return best;
	};

	/** The label of a point on a curve: its coordinates, and what it is when it is one of the notable points. */
	const labelOf = (pin: Pin): { at: Point; color: string; name?: string } | null => {
		const ci = curves.findIndex((c) => c.id === pin.curve);
		if (ci < 0) return null;
		const known = points[ci]?.find((p) => Math.abs(p.x - pin.x) * sx < 9);
		const at = known ?? { x: pin.x, y: asFunction(curves[ci])(pin.x) };
		if (!Number.isFinite(at.y)) return null;
		return { at, color: curves[ci].color, name: known ? KIND_NAMES[known.kind] : undefined };
	};

	const shownPoint = (() => {
		if (!shown) return null;
		const [ci, pi] = shown.split(':').map(Number);
		const p = points[ci]?.[pi];
		return p ? { at: p as Point, color: curves[ci].color, name: KIND_NAMES[p.kind] } : null;
	})();
	const tracePoint = trace && !shownPoint ? labelOf(trace) : null;
	const pinned = pins.map(labelOf).filter((p) => p !== null);

	return (
		<div ref={box} className={cn('relative h-full w-full overflow-hidden', className)}>
			<svg
				ref={svg}
				viewBox={`0 0 ${r2(w)} ${r2(h)}`}
				className={cn('plane-drawing absolute inset-0 h-full w-full select-none outline-none', free && 'focus-visible:ring-2 focus-visible:ring-accent', free && (pick ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'))}
				style={{ touchAction: free ? 'none' : 'pan-y' }}
				role="group"
				aria-label={free ? `${label}. Trascina per spostarti, usa le frecce, più e meno per ingrandire.` : label}
				tabIndex={free ? 0 : undefined}
				onPointerDown={down}
				onPointerMove={drag}
				onPointerUp={up}
				onPointerCancel={up}
				onPointerLeave={() => {
					setTrace(null);
					pick?.onHover(null, scale());
				}}
				onKeyDown={keys}
			>
				<g aria-hidden="true">
					{look.grid && look.polar && <PolarGrid view={view} w={w} h={h} X={X} Y={Y} sx={sx} sy={sy} marks={xMarks} unit={look.polar} numbers={look.numbers} />}
					{look.grid && !look.polar && (
						<>
							{xMarks.minor.map((x) => (
								<line key={`mx${x}`} x1={X(x)} x2={X(x)} y1={0} y2={h} stroke="#d9d9d9" strokeWidth={VERY_THIN} />
							))}
							{yMarks.minor.map((y) => (
								<line key={`my${y}`} x1={0} x2={w} y1={Y(y)} y2={Y(y)} stroke="#d9d9d9" strokeWidth={VERY_THIN} />
							))}
							{xMarks.major.map((x) => (
								<line key={`gx${x}`} x1={X(x)} x2={X(x)} y1={0} y2={h} stroke="#b3b3b3" strokeWidth={VERY_THIN * 1.5} />
							))}
							{yMarks.major.map((y) => (
								<line key={`gy${y}`} x1={0} x2={w} y1={Y(y)} y2={Y(y)} stroke="#b3b3b3" strokeWidth={VERY_THIN * 1.5} />
							))}
						</>
					)}

					{sampled.map((s, i) => s.inside && <path key={`fill${curves[i].id}`} d={s.inside.map((part) => `${pathOf([part])}Z`).join('')} fill={curves[i].color} fillOpacity={0.16} />)}
					{sampled.map(({ path }, i) => path?.fill && path.lines[0] && <path key={`inside${curves[i].id}`} d={`${pathOf([path.lines[0]])}Z`} fill={curves[i].color} fillOpacity={0.12} />)}
					{curves.map((c) => {
						if (!('f' in c) || !c.area) return null;
						// the area between the curve and the axis, piece by piece where the function has a value
						const { a, b } = c.area;
						const pieces: string[] = [];
						let run: Point[] = [];
						const close = () => {
							if (run.length > 1) pieces.push(`M${X(run[0].x)},${Y(0)}${run.map((p) => `L${X(p.x)},${Y(clamp(p.y, view.y0 - 1, view.y1 + 1))}`).join('')}L${X(run[run.length - 1].x)},${Y(0)}Z`);
							run = [];
						};
						for (let k = 0; k <= 240; k++) {
							const x = a + ((b - a) * k) / 240;
							const y = c.f(x);
							if (Number.isFinite(y)) run.push({ x, y });
							else close();
						}
						close();
						return <path key={`area${c.id}`} d={pieces.join('')} fill={c.color} fillOpacity={0.2} />;
					})}

					{/* the axes, with TikZ's arrow tips, when they are in the window */}
					{look.axes && xAxisIn && (
						<>
							<line x1={0} x2={w - 4} y1={Y(0)} y2={Y(0)} stroke="#000" strokeWidth={THIN * 1.5} />
							<path d={`M${w},${Y(0)} l-8,-3 l2,3 l-2,3 Z`} fill="#000" />
						</>
					)}
					{look.axes && yAxisIn && (
						<>
							<line x1={X(0)} x2={X(0)} y1={4} y2={h} stroke="#000" strokeWidth={THIN * 1.5} />
							<path d={`M${X(0)},0 l-3,8 l3,-2 l3,2 Z`} fill="#000" />
						</>
					)}

					<g fontFamily={FONT} fontSize={13} fill="#000" stroke="#fff" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">
						{look.numbers && (
							<>
								{xMarks.major
									.filter((x) => Math.abs(x) > 1e-12 && X(x) > 16 && X(x) < w - 24)
									.map((x) => (
										<text key={`nx${x}`} x={X(x)} y={xNumbersBelow ? axisY + 15 : h - 6} textAnchor="middle">
											{xMarks.label(x)}
										</text>
									))}
								{yMarks.major
									.filter((y) => Math.abs(y) > 1e-12 && Y(y) > 24 && Y(y) < h - 10)
									.map((y) => (
										<text key={`ny${y}`} x={yNumbersLeft ? axisX - 6 : 6} y={Y(y)} dy="0.32em" textAnchor={yNumbersLeft ? 'end' : 'start'}>
											{yMarks.label(y)}
										</text>
									))}
								{view.x0 < 0 && view.x1 > 0 && view.y0 < 0 && view.y1 > 0 && (
									<text x={X(0) - 6} y={Y(0) + 15} textAnchor="end">
										0
									</text>
								)}
							</>
						)}
						{look.axes && (
							<g fontFamily={FONT_MATH} fontStyle="italic" fontSize={15}>
								{xAxisIn && (
									<text x={w - 8} y={Y(0) - 8} textAnchor="end">
										{look.xName ?? 'x'}
									</text>
								)}
								{yAxisIn && (
									<text x={X(0) + 9} y={14}>
										{look.yName ?? 'y'}
									</text>
								)}
							</g>
						)}
					</g>

					{paths.map((d, i) => {
						const c = curves[i];
						// the edge of a region that does not hold it is dashed, as on the blackboard
						const dash = 'region' in c && c.strict && (c.dash ?? 'solid') === 'solid' ? DASH.dashed : DASH[c.dash ?? 'solid'];
						return <path key={c.id} d={d} fill="none" stroke={c.color} strokeWidth={STROKE[c.width ?? 'normal']} strokeDasharray={dash} strokeLinejoin="round" strokeLinecap="round" />;
					})}
										{sampled.map((s, i) => {
						const c = curves[i];
						const small = 'dots' in c && c.small;
						return s.dots?.map((p, k) => <circle key={`dot${c.id}:${k}`} cx={X(p.x)} cy={Y(p.y)} r={small ? 1.3 : 3.2} fill={c.color} stroke={small ? 'none' : '#fff'} strokeWidth={0.8} />);
					})}
					{overlay.map((c) => (
						<path key={`over${c.id}`} d={pathOf(sampleCurve(c, view, w, h, sx, sy, true).lines)} fill="none" stroke={c.color} strokeWidth={STROKE[c.width ?? 'normal']} strokeDasharray={DASH[c.dash ?? 'solid']} strokeLinecap="round" data-export="no" />
					))}
					{curves.map((c) => {
						if (!('f' in c) || !c.tangent) return null;
						const { x, slope } = c.tangent;
						const y = c.f(x);
						if (!Number.isFinite(y) || !Number.isFinite(slope)) return null;
						return <line key={`tan${c.id}`} x1={0} y1={Y(y + slope * (view.x0 - x))} x2={w} y2={Y(y + slope * (view.x1 - x))} stroke={c.color} strokeWidth={STROKE.thin} />;
					})}
					{curves.map((c) => {
						if (!('f' in c) || !c.area) return null;
						const mid = (c.area.a + c.area.b) / 2;
						const y = c.f(mid);
						return (
							<text key={`areaText${c.id}`} x={X(mid)} y={Y(Number.isFinite(y) ? clamp(y / 2, view.y0, view.y1) : 0)} dy="0.32em" textAnchor="middle" fontFamily={FONT} fontSize={14} fill="#000" stroke="#fff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
								{c.area.text}
							</text>
						);
					})}

					{sampled.map(
						({ path: d }, i) =>
							d?.label && (
								<text key={`size${curves[i].id}`} x={X(d.label.at.x)} y={Y(d.label.at.y)} dy="0.32em" textAnchor="middle" fontFamily={FONT} fontSize={13} fill={curves[i].color} stroke="#fff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
									{d.label.text}
								</text>
							)
					)}
					{curves.map((c, i) => {
						const at = c.label ? nameSpot(lines[i]) : null;
						return (
							at && (
								<text key={`name${c.id}`} x={X(at.x) + 7} y={Y(at.y) - 8} fontFamily={FONT_MATH} fontStyle="italic" fontSize={17} fill={c.color} stroke="#fff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
									{c.label}
								</text>
							)
						);
					})}
				</g>

				{/* with a tool in hand the notable points are only seen: the click belongs to the tool */}
				{pick &&
					points.map((list, ci) => list.map((p) => <circle key={`${curves[ci].id}:${p.kind}:${p.x}`} cx={X(p.x)} cy={Y(p.y)} r={3.2} fill="#808080" stroke="#fff" strokeWidth={1} pointerEvents="none" />))}
				{!pick &&
					points.map((list, ci) =>
					list.map((p, pi) => {
						const id = `${ci}:${pi}`;
						const pin = { curve: curves[ci].id, x: p.x };
						return (
							<g
								key={`${curves[ci].id}:${p.kind}:${p.x}`}
								role="button"
								tabIndex={0}
								aria-label={`${KIND_NAMES[p.kind]} in ${written(p)}`}
								className="cursor-pointer outline-none"
								onPointerDown={(e) => e.stopPropagation()}
								onPointerUp={(e) => e.stopPropagation()}
								onPointerEnter={(e) => e.pointerType === 'mouse' && setShown(id)}
								onPointerLeave={() => setShown((s) => (s === id ? null : s))}
								onClick={() => togglePin(pin)}
								onKeyDown={(e) => {
									if (e.key !== 'Enter' && e.key !== ' ') return;
									e.preventDefault();
									togglePin(pin);
								}}
								onFocus={() => setShown(id)}
								onBlur={() => setShown((s) => (s === id ? null : s))}
							>
								<circle cx={X(p.x)} cy={Y(p.y)} r={14} fill="transparent" data-export="no" />
								<circle cx={X(p.x)} cy={Y(p.y)} r={shown === id ? 4.5 : 3.2} fill={shown === id ? curves[ci].color : '#808080'} stroke="#fff" strokeWidth={1} />
							</g>
						);
					})
				)}

				{marks.map((m) => (
					<Mark key={m.id} mark={pick ? { ...m, onDrag: undefined } : m} x={X(m.at.x)} y={Y(m.at.y)} w={w} toPlane={toPlane} step={gridStep} onTouch={() => setTrace(null)} />
				))}

				{!pick && pinned.map((p, i) => (
					<PointLabel key={`pin${i}`} x={X(p.at.x)} y={Y(p.at.y)} w={w} color={p.color} name={p.name} text={written(p.at)} />
				))}
				{tracePoint && (
					<g data-export="no">
						<PointLabel x={X(tracePoint.at.x)} y={Y(tracePoint.at.y)} w={w} color={tracePoint.color} name={tracePoint.name} text={written(tracePoint.at)} />
					</g>
				)}
				{shownPoint && (
					<g data-export="no">
						<PointLabel x={X(shownPoint.at.x)} y={Y(shownPoint.at.y)} w={w} color={shownPoint.color} name={shownPoint.name} text={written(shownPoint.at)} />
					</g>
				)}
			</svg>

			{free && (
				<div className="absolute right-2 bottom-2 flex flex-col overflow-hidden rounded-xl border border-edge-strong bg-surface shadow-paper">
					<PlaneButton label="Ingrandisci" onClick={() => zoomAt(w / 2, h / 2, 1 / 1.5)}>
						<Plus className="size-4" aria-hidden="true" />
					</PlaneButton>
					<PlaneButton label="Rimpicciolisci" onClick={() => zoomAt(w / 2, h / 2, 1.5)}>
						<Minus className="size-4" aria-hidden="true" />
					</PlaneButton>
					<PlaneButton label="Torna alla vista iniziale" onClick={() => move(home)}>
						<Home className="size-4" aria-hidden="true" />
					</PlaneButton>
					{onFit && (
						<PlaneButton label="Inquadra le curve" onClick={onFit}>
							<Scan className="size-4" aria-hidden="true" />
						</PlaneButton>
					)}
				</div>
			)}
		</div>
	);
}

/** k twelfths of a turn's half, as a ray of the polar grid is named: π/6, 3π/4, or 30°, 135°. */
function rayName(k: number, unit: 'radians' | 'degrees') {
	if (unit === 'degrees') return `${k * 15}°`;
	if (k === 0) return '0';
	const g = [12, 6, 4, 3, 2, 1].find((d) => k % d === 0)!;
	const num = k / g;
	const den = 12 / g;
	return `${num === 1 ? '' : num}π${den === 1 ? '' : `/${den}`}`;
}

/**
 * The grid of polar coordinates: circles around the origin at the marks of the x axis, rays every 15°, and the name
 * of every other ray where it leaves the window. On a stretched plane the circles are ellipses, as the curves are.
 */
function PolarGrid({ view, w, h, X, Y, sx, sy, marks, unit, numbers }: { view: View; w: number; h: number; X: (x: number) => number; Y: (y: number) => number; sx: number; sy: number; marks: { major: number[]; minor: number[] }; unit: 'radians' | 'degrees'; numbers: boolean }) {
	// from the nearest point of the window to the farthest, as far as the origin is concerned
	const nearX = view.x0 > 0 ? view.x0 : view.x1 < 0 ? -view.x1 : 0;
	const nearY = view.y0 > 0 ? view.y0 : view.y1 < 0 ? -view.y1 : 0;
	const near = Math.hypot(nearX, nearY);
	const far = Math.hypot(Math.max(Math.abs(view.x0), Math.abs(view.x1)), Math.max(Math.abs(view.y0), Math.abs(view.y1)));
	const majorStep = marks.major.length > 1 ? marks.major[1] - marks.major[0] : far;
	const minorStep = marks.minor.length > 1 ? marks.minor[1] - marks.minor[0] : majorStep;
	const radii = (step: number) => {
		const out: number[] = [];
		for (let k = Math.max(1, Math.ceil(near / step)); k * step <= far && out.length < 400; k++) out.push(k * step);
		return out;
	};
	const major = radii(majorStep);
	const minor = radii(minorStep).filter((r) => !major.some((m) => Math.abs(m - r) < minorStep / 4));
	const cx = X(0);
	const cy = Y(0);
	const inside = view.x0 < 0 && view.x1 > 0 && view.y0 < 0 && view.y1 > 0;
	const rays = Array.from({ length: 24 }, (_, k) => k);
	return (
		<>
			{minor.map((r) => (
				<ellipse key={`pm${r}`} cx={cx} cy={cy} rx={r2(r * sx)} ry={r2(r * sy)} fill="none" stroke="#d9d9d9" strokeWidth={VERY_THIN} />
			))}
			{major.map((r) => (
				<ellipse key={`pM${r}`} cx={cx} cy={cy} rx={r2(r * sx)} ry={r2(r * sy)} fill="none" stroke="#b3b3b3" strokeWidth={VERY_THIN * 1.5} />
			))}
			{rays.map((k) => {
				const a = (k * Math.PI) / 12;
				return <line key={`ray${k}`} x1={cx} y1={cy} x2={r2(cx + Math.cos(a) * far * sx)} y2={r2(cy - Math.sin(a) * far * sy)} stroke={k % 2 ? '#d9d9d9' : '#b3b3b3'} strokeWidth={k % 2 ? VERY_THIN : VERY_THIN * 1.5} />;
			})}
			{numbers && inside && (
				<g fontFamily={FONT} fontSize={12} fill="#666" stroke="#fff" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round" textAnchor="middle">
					{rays
						.filter((k) => k % 2 === 0 && k % 6 !== 0)
						.map((k) => {
							// where the ray leaves the window, a little inside it
							const a = (k * Math.PI) / 12;
							const dx = Math.cos(a) * sx;
							const dy = -Math.sin(a) * sy;
							const reach = Math.min(dx > 0 ? (w - 26 - cx) / dx : (26 - cx) / dx, dy > 0 ? (h - 16 - cy) / dy : (16 - cy) / dy);
							return (
								<text key={`rn${k}`} x={r2(cx + dx * reach)} y={r2(cy + dy * reach)} dy="0.32em">
									{rayName(k, unit)}
								</text>
							);
						})}
				</g>
			)}
		</>
	);
}

function PlaneButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
	return (
		<button type="button" aria-label={label} title={label} onClick={onClick} className="flex size-10 items-center justify-center text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring">
			{children}
		</button>
	);
}

/**
 * A mark: its dot, its letter, its label. One that can be dragged follows the pointer (the plane does not move
 * under it) and moves by a step of the grid with the arrows.
 */
function Mark({ mark, x, y, w, toPlane, step, onTouch }: { mark: PlaneMark; x: number; y: number; w: number; toPlane: (e: { clientX: number; clientY: number }, snap: boolean) => Point; step: { x: number; y: number }; /** The pointer is on the mark: the label that followed it along a curve goes. */ onTouch: () => void }) {
	const [held, setHeld] = useState(false);
	const drag = mark.onDrag;
	const label = mark.text && (
		<g pointerEvents="none">
			<rect x={r2(x + 10 + mark.text.length * 7.6 + 16 > w ? x - 26 - mark.text.length * 7.6 : x + 10)} y={r2(y - 32)} width={r2(mark.text.length * 7.6 + 16)} height={22} rx={4} fill="#fff" stroke="#000" strokeWidth={THIN} />
			<text x={r2((x + 10 + mark.text.length * 7.6 + 16 > w ? x - 26 - mark.text.length * 7.6 : x + 10) + 8)} y={r2(y - 17)} fontFamily={FONT} fontSize={14} fill="#000">
				{mark.text}
			</text>
		</g>
	);
	const name = mark.name && (
		<text x={x + 8} y={y - 9} fontFamily={FONT_MATH} fontStyle="italic" fontSize={17} fill={mark.color} stroke="#fff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round" pointerEvents="none">
			{mark.name}
		</text>
	);
	if (!drag)
		return (
			<g aria-hidden="true" pointerEvents="none">
				{mark.dot !== false && <circle cx={x} cy={y} r={4.2} fill={mark.color} stroke="#fff" strokeWidth={1} />}
				{name}
				{label}
			</g>
		);
	const keys = (e: KeyboardEvent<SVGGElement>) => {
		const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
		if (!d) return;
		e.preventDefault();
		e.stopPropagation();
		const many = e.shiftKey ? 5 : 1;
		drag({ x: Number((mark.at.x + d[0] * step.x * many).toPrecision(12)), y: Number((mark.at.y + d[1] * step.y * many).toPrecision(12)) });
	};
	return (
		<g
			role="button"
			tabIndex={0}
			aria-label={`${mark.name ? `Punto ${mark.name}` : 'Punto'}: trascinalo, oppure usa le frecce`}
			className="cursor-grab outline-none active:cursor-grabbing"
			style={{ touchAction: 'none' }}
			onPointerEnter={onTouch}
			onPointerDown={(e) => {
				e.stopPropagation();
				e.currentTarget.setPointerCapture(e.pointerId);
				setHeld(true);
				onTouch();
			}}
			onPointerMove={(e) => {
				e.stopPropagation();
				if (held) drag(toPlane(e, !!mark.snap));
			}}
			onPointerUp={(e) => {
				e.stopPropagation();
				setHeld(false);
			}}
			onPointerCancel={() => setHeld(false)}
			onKeyDown={keys}
		>
			<circle cx={x} cy={y} r={16} fill="transparent" data-export="no" />
			<circle cx={x} cy={y} r={held ? 9 : 7.5} fill={mark.color} fillOpacity={0.18} data-export="no" />
			<circle cx={x} cy={y} r={4.5} fill={mark.color} stroke="#fff" strokeWidth={1} />
			{name}
			{label}
		</g>
	);
}

/** A point on a curve with its coordinates beside it, and its name when it has one, inside the drawing. */
function PointLabel({ x, y, w, color, name, text }: { x: number; y: number; w: number; color: string; name?: string; text: string }) {
	const width = Math.max(text.length * 7.6, (name?.length ?? 0) * 6.4) + 16;
	const height = name ? 36 : 22;
	const left = x + 10 + width > w ? x - 10 - width : x + 10;
	const top = y - height - 10 < 0 ? y + 10 : y - height - 10;
	return (
		<g pointerEvents="none" aria-hidden="true">
			<circle cx={x} cy={y} r={4.5} fill={color} stroke="#fff" strokeWidth={1} />
			<rect x={r2(left)} y={r2(top)} width={r2(width)} height={height} rx={4} fill="#fff" stroke="#000" strokeWidth={THIN} />
			{name && (
				<text x={r2(left + 8)} y={r2(top + 14)} fontFamily={FONT} fontSize={11} fill="#666">
					{name}
				</text>
			)}
			<text x={r2(left + 8)} y={r2(top + height - 7)} fontFamily={FONT} fontSize={14} fill="#000">
				{text}
			</text>
		</g>
	);
}
