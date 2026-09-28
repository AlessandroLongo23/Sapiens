'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, ang, Caption, Controls, DASH, Drawing, Figure, frame, Label, len, rot, scale, sub, THICK, THIN, TINT, useReducedMotion, v, type V } from './kit';

/**
 * The trapezoid becomes the triangle AED: the student drags the triangle DMC around M, which works as a hinge,
 * until it lies on BME. Drawn like the TikZ figure of lesson 98 (same colours, line widths and scale).
 *
 * The triangle is a rigid body with one degree of freedom, its angle θ around M, so it needs no physics engine:
 * real gravity pulls on its centroid, and it rests against two contacts, the quadrilateral ABMD at θ = 0 and the
 * line AE at θ = −π. Both rest positions are stable, since gravity presses the triangle into the contact; let go
 * halfway and it falls into the one on the side of its centroid. The drag is a stiff spring towards the pointer's
 * angle, so the triangle keeps its speed when released and can be flung over.
 *
 * Coordinates are TikZ centimetres with y upwards; the kit's frame `f` turns them into SVG points.
 */

/** Base maggiore AB, base minore DC, altezza, and how far D sits to the right of A. */
type Shape = { big: number; small: number; h: number; shift: number };
const START: Shape = { big: 3.6, small: 1.8, h: 1.8, shift: 0.9 };
const RANGE = { big: [2.4, 4.2], small: [0.8, 2.4], h: [1, 2.2], shift: [-0.3, 2.4] } as const;

/** DC stays shorter than AB, and D left of B, so the centroid of DMC is on the side of ABMD and θ = 0 is stable. */
function limits(s: Shape) {
	return { small: Math.min(RANGE.small[1], s.big - 0.4), shift: Math.min(RANGE.shift[1], s.big - 0.4) };
}
function fit(s: Shape): Shape {
	const l = limits(s);
	return { ...s, small: Math.min(s.small, l.small), shift: Math.min(s.shift, l.shift) };
}

function geometry({ big, small, h, shift }: Shape) {
	const A = v(0, 0), B = v(big, 0), D = v(shift, h), C = v(shift + small, h);
	const M = scale(add(B, C), 0.5);
	const E = v(big + small, 0);
	// The triangle relative to its hinge: its centroid and its moment of inertia about M (unit mass).
	const d = sub(D, M), c = sub(C, M);
	const r = scale(add(d, c), 1 / 3);
	const inertia = (len(d) ** 2 + len(c) ** 2 + len(sub(d, c)) ** 2) / 36 + len(r) ** 2;
	return { A, B, C, D, M, E, d, c, r, inertia };
}
type Geo = ReturnType<typeof geometry>;

/** Everything any shape can reach, the swinging triangle included, so the frame never changes size under the sliders. */
const FRAME = (() => {
	let x0 = 0, x1 = 0, y1 = 0;
	const steps = (a: readonly [number, number]) => [0, 0.25, 0.5, 0.75, 1].map((t) => a[0] + t * (a[1] - a[0]));
	for (const big of steps(RANGE.big)) for (const small of steps(RANGE.small)) for (const h of steps(RANGE.h)) for (const shift of steps(RANGE.shift)) {
		const g = geometry(fit({ big, small, h, shift }));
		const reach = Math.max(len(g.d), len(g.c));
		x0 = Math.min(x0, g.D.x);
		x1 = Math.max(x1, g.E.x, g.M.x + reach);
		y1 = Math.max(y1, g.M.y + reach);
	}
	return { x0: x0 - 0.5, x1: x1 + 0.5, y0: -0.55, y1: y1 + 0.2 };
})();
const f = frame(FRAME.x0, FRAME.x1, FRAME.y0, FRAME.y1);
const { px, pts } = f;

/** Gravity in cm/s², chosen so the fall reads as a fall at this size and not as a slow pendulum. */
const G = 30;
const STEP = 1 / 240;
/** Drag spring: natural frequency and damping ratio of the triangle following the pointer. */
const FOLLOW = 28;
const FOLLOW_DAMPING = 0.9;
const BOUNCE = 0.3;
const END = -Math.PI;

/** Torque of gravity about M at angle θ, per unit of inertia. */
const gravity = (g: Geo, theta: number) => (-G * rot(g.r, theta).x) / g.inertia;

type Body = { theta: number; omega: number };
type Drag = { target: number; pointer: number } | null;

function step(g: Geo, body: Body, drag: Drag) {
	let alpha = gravity(g, body.theta);
	if (drag) alpha += FOLLOW * FOLLOW * (drag.target - body.theta) - 2 * FOLLOW_DAMPING * FOLLOW * body.omega;
	else alpha -= 0.3 * body.omega; // a little friction in the hinge
	body.omega += alpha * STEP;
	body.theta += body.omega * STEP;
	// The two contacts: ABMD above θ = 0, the line AE below θ = −π.
	if (body.theta > 0) {
		body.theta = 0;
		if (body.omega > 0) body.omega = Math.abs(body.omega) < 0.8 ? 0 : -BOUNCE * body.omega;
	} else if (body.theta < END) {
		body.theta = END;
		if (body.omega < 0) body.omega = Math.abs(body.omega) < 0.8 ? 0 : -BOUNCE * body.omega;
	}
}

/** Resting against a contact, pressed into it by gravity. */
function atRest(g: Geo, body: Body) {
	if (body.omega !== 0) return false;
	if (body.theta === 0) return gravity(g, 0) >= 0;
	if (body.theta === END) return gravity(g, END) <= 0;
	return false;
}

export default function TrapezioTriangolo({ alt }: { alt?: string }) {
	const [shape, setShape] = useState(START);
	const g = useMemo(() => geometry(shape), [shape]);
	const [theta, setTheta] = useState(0);
	const body = useRef<Body>({ theta: 0, omega: 0 });
	const drag = useRef<Drag>(null);
	const geo = useRef(g);
	geo.current = g;
	const svg = useRef<SVGSVGElement>(null);
	const raf = useRef(0);
	// Read from the animation loop, which is created once: a ref that follows the setting.
	const reducedMotion = useReducedMotion();
	const reduced = useRef(reducedMotion);
	useEffect(() => {
		reduced.current = reducedMotion;
	}, [reducedMotion]);

	useEffect(() => () => cancelAnimationFrame(raf.current), []);

	/** Runs the body until it lies still against a contact, then stops asking for frames. */
	const run = useCallback(() => {
		if (raf.current) return;
		let last = performance.now();
		let spare = 0;
		const tick = (now: number) => {
			spare += Math.min((now - last) / 1000, 1 / 30);
			last = now;
			const b = body.current;
			if (reduced.current && !drag.current) {
				// No fall to watch: the triangle goes straight to the side gravity would take it to.
				b.theta = gravity(geo.current, b.theta) > 0 ? 0 : END;
				b.omega = 0;
				spare = 0;
			}
			for (; spare >= STEP; spare -= STEP) step(geo.current, b, drag.current);
			setTheta(b.theta);
			if (!drag.current && atRest(geo.current, b)) {
				raf.current = 0;
				return;
			}
			// Balanced on the tipping point: a breath of air decides.
			if (!drag.current && Math.abs(b.omega) < 1e-4 && Math.abs(gravity(geo.current, b.theta)) < 1e-3) b.omega -= 0.05;
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
	}, []);

	/** The pointer's angle around M, in TikZ coordinates. */
	const pointerAngle = (e: React.PointerEvent) => {
		const q = sub(f.toTikz(e, svg.current!), geo.current.M);
		return len(q) < 0.15 ? null : ang(q);
	};

	const grab = (e: React.PointerEvent<SVGPolygonElement>) => {
		const a = pointerAngle(e);
		if (a === null) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		drag.current = { target: body.current.theta, pointer: a };
		run();
	};
	const move = (e: React.PointerEvent) => {
		const d = drag.current;
		const a = d && pointerAngle(e);
		if (!d || a === null) return;
		// Unwrapped, so a pointer that circles M keeps turning the triangle the same way.
		let delta = a - d.pointer;
		delta -= 2 * Math.PI * Math.round(delta / (2 * Math.PI));
		d.pointer = a;
		// A little past each contact, so the spring can press the triangle into it.
		d.target = Math.min(0.2, Math.max(END - 0.2, d.target + delta));
		if (reduced.current) body.current.theta = Math.min(0, Math.max(END, d.target));
	};
	const release = () => {
		drag.current = null;
		run();
	};

	/** The button and the keyboard: a push just strong enough to carry the triangle over its tipping point, to the other contact. */
	const flip = () => {
		const b = body.current, gc = geo.current;
		const toEnd = gravity(gc, b.theta) >= 0;
		if (reduced.current) {
			b.theta = toEnd ? END : 0;
			b.omega = 0;
			setTheta(b.theta);
			return;
		}
		const climb = Math.max(0, len(gc.r) - rot(gc.r, b.theta).y);
		b.omega = (toEnd ? -1 : 1) * (Math.sqrt((2 * G * climb) / gc.inertia) * 1.25 + 0.5);
		run();
	};
	const flipKey = (e: React.KeyboardEvent) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		flip();
	};

	const change = (key: keyof Shape) => (x: number) => {
		setShape((s) => fit({ ...s, [key]: x }));
		// The triangle stays where it was; a new shape may tip it over, so it gets to move.
		run();
	};

	const { A, B, C, D, M, E } = g;
	const at = (p: V) => add(M, rot(sub(p, M), theta));
	const tD = at(D), tC = at(C);
	const done = theta === END;
	// Where the triangle is going, or lies: past its tipping point gravity takes it to BME.
	const triangle = gravity(g, theta) < 0;
	const l = limits(shape);

	return (
		<Figure>
			<Drawing f={f} label={alt} svgRef={svg}>
				{/* Where the triangle can be: its slot DMC and its place BME, dashed as in the figure. */}
				<polyline points={pts(D, C, M)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<polyline points={pts(B, E, M)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.arc(B, sub(E, B), sub(M, B))} fill="none" stroke="#000" strokeWidth={THIN} />

				<polygon points={pts(A, B, M, D)} fill={TINT.blue} />
				<polyline points={pts(D, A, B, M)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="miter" />
				<line x1={px(D).x} y1={px(D).y} x2={px(M).x} y2={px(M).y} stroke="#000" strokeWidth={THIN} />
				<path d={f.tick(M, B)} stroke="#000" strokeWidth={THIN} />

				<g
					role="button"
					tabIndex={0}
					aria-label={done ? 'Triangolo DMC, ora su BME: premi Invio per riportarlo in DMC' : 'Triangolo DMC: premi Invio per ruotarlo intorno a M fino a BME'}
					onKeyDown={flipKey}
					className="cursor-grab outline-none focus-visible:[&>polygon]:stroke-[var(--accent)] active:cursor-grabbing"
				>
					<polygon points={pts(tD, tC, M)} fill={TINT.orange} stroke="transparent" strokeWidth={2} style={{ touchAction: 'none' }} onPointerDown={grab} onPointerMove={move} onPointerUp={release} onPointerCancel={release} />
					<polyline points={pts(tD, tC, M)} fill="none" stroke="#000" strokeWidth={THICK} pointerEvents="none" />
					<line x1={px(M).x} y1={px(M).y} x2={px(tD).x} y2={px(tD).y} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
					<path d={f.arc(tC, sub(tD, tC), sub(M, tC))} fill="none" stroke="#000" strokeWidth={THIN} pointerEvents="none" />
					<path d={f.tick(M, tC)} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
				</g>
				<circle cx={px(M).x} cy={px(M).y} r={1.6} fill="#000" />

				<Label f={f} at={A} dir={v(-0.7, -0.7)}>A</Label>
				<Label f={f} at={B} dir={v(0, -1)}>B</Label>
				<Label f={f} at={C} dir={v(0.7, 0.7)}>C</Label>
				<Label f={f} at={D} dir={v(-0.7, 0.7)}>D</Label>
				<Label f={f} at={E} dir={v(0.7, -0.7)}>E</Label>
				<Label f={f} at={M} dir={v(1, 0)}>M</Label>
			</Drawing>

			<Caption>
				{done ? 'Il trapezio ABCD è diventato il triangolo AED: stessa area, e la base AE è lunga AB + DC.' : 'Trascina il triangolo arancione: ruota intorno a M.'}
			</Caption>

			<Button variant="secondary" size="sm" onClick={flip}>
				{triangle ? <RotateCcw className="size-4" aria-hidden="true" /> : <RotateCw className="size-4" aria-hidden="true" />}
				{triangle ? 'Torna al trapezio' : 'Trasforma in triangolo'}
			</Button>

			<Controls>
				<Slider label="Base maggiore AB" value={shape.big} min={RANGE.big[0]} max={RANGE.big[1]} onChange={change('big')} />
				<Slider label="Base minore DC" value={shape.small} min={RANGE.small[0]} max={l.small} onChange={change('small')} />
				<Slider label="Altezza" value={shape.h} min={RANGE.h[0]} max={RANGE.h[1]} onChange={change('h')} />
				<Slider label="Posizione di D" value={shape.shift} min={RANGE.shift[0]} max={l.shift} onChange={change('shift')} />
			</Controls>
		</Figure>
	);
}
