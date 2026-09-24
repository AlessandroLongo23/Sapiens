'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '@/lib/hooks/use-media';

/**
 * The sticker over a flashcard's answer. Peeling it off is the reveal.
 *
 * The fold is real geometry, recomputed every frame. A corner C is pulled to a
 * point P; the crease is the perpendicular bisector of CP. The face is clipped
 * to the side of the crease away from C, and a second layer, the sticker's
 * backing, is the part on C's side reflected across the crease: the lifted flap
 * is the exact mirror of what has come off. A tap peels from the bottom-right
 * corner, where the dog-ear is; a drag peels from the corner behind it, so
 * pulling down lifts the sticker from the top, pulling right from the left.
 *
 * Offsets are kept in the bottom-right corner's frame, where peeling inward is
 * negative on both axes, and mirrored to the corner in use when drawn; so every
 * constant below reads the same for every corner. The flap lives in a fixed
 * layer on <body>, so a lifted sticker passes over the card's edge and the
 * lesson column instead of being cut off by them.
 *
 * The motion borrows the pacing of an iPhone box lid: a moment of resistance,
 * then the release. Pressing lifts the corner and holds it there as long as the
 * finger stays down (the adhesive holding); letting go pops it, and the fold
 * sweeps across and the sticker slides away. After the finger lifts, the corner
 * strains for 170ms, the answer is uncovered at about 400ms and the sticker is
 * gone at about 700ms. Dragging peels by hand: the first 20px
 * pull against the glue, then it gives; let go early and it sticks back down.
 *
 * Space and Enter reveal at once (keyboard users are going fast), and so does
 * every input under reduced motion, with a short fade.
 */

type Point = { x: number; y: number };

const REST = 15; // the dog-ear at rest, px along each edge
const HOVER: Point = { x: -21, y: -19 }; // a mouse over the sticker: the corner stirs
const PRESS: Point = { x: -26, y: -22 }; // the corner as the finger lands
const STRAIN: Point = { x: -34, y: -28 }; // where it creeps while held
const LAST: Point = { x: -46, y: -38 }; // the last strain of a tap, just before the glue lets go
const GIVE = 20; // px of pull the glue resists before it lets go
const COMMIT = 0.4; // share peeled past which letting go finishes the job
const FLING = 0.5; // px/ms toward the peel that finishes it regardless

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;

/** The rectangle W×H cut by the half-plane (X − M)·n ≤ 0, or ≥ 0 when `keep` is 1. */
function cut(w: number, h: number, m: Point, n: Point, keep: 1 | -1): Point[] {
	const rect = [
		{ x: 0, y: 0 },
		{ x: w, y: 0 },
		{ x: w, y: h },
		{ x: 0, y: h }
	];
	const side = (p: Point) => keep * dot({ x: p.x - m.x, y: p.y - m.y }, n);
	const out: Point[] = [];
	for (let i = 0; i < rect.length; i++) {
		const a = rect[i];
		const b = rect[(i + 1) % rect.length];
		const sa = side(a);
		const sb = side(b);
		if (sa >= 0) out.push(a);
		if (sa >= 0 !== sb >= 0) out.push(lerp(a, b, sa / (sa - sb)));
	}
	return out;
}

const area = (poly: Point[]) => Math.abs(poly.reduce((s, p, i) => s + p.x * poly[(i + 1) % poly.length].y - poly[(i + 1) % poly.length].x * p.y, 0)) / 2;
const polygon = (poly: Point[]) => (poly.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : `polygon(${poly.map((p) => `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`).join(', ')})`);

/**
 * A CSS gradient along n whose stops are distances from the crease, for an
 * element of size W×H. CSS measures stops along a line through the centre at
 * angle θ, so the crease's position on that line is worked out first.
 */
function gradient(w: number, h: number, m: Point, n: Point, stops: [string, number][]) {
	const theta = Math.atan2(n.x, -n.y);
	const length = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));
	const start = { x: w / 2 - (n.x * length) / 2, y: h / 2 - (n.y * length) / 2 };
	const at = dot({ x: m.x - start.x, y: m.y - start.y }, n);
	return `linear-gradient(${theta}rad, ${stops.map(([color, d]) => `${color} ${(at + d).toFixed(2)}px`).join(', ')})`;
}

type Phase = 'idle' | 'pressed' | 'dragging' | 'releasing' | 'leaving' | 'gone';
const noSubscribe = () => () => {};
/** A corner: 1 is the right or bottom edge, 0 the left or top. */
type Corner = { x: 0 | 1; y: 0 | 1 };
const HOME: Corner = { x: 1, y: 1 };
/** From the bottom-right frame to the corner's own (the same flip turns a screen move into the frame). */
const mirror = (p: Point, c: Corner): Point => ({ x: c.x ? p.x : -p.x, y: c.y ? p.y : -p.y });

export function PeelSticker({ revealed, onPeel }: { revealed: boolean; onPeel: () => void }) {
	const reduced = useReducedMotion();
	const [gone, setGone] = useState(false);
	const root = useRef<HTMLButtonElement>(null);
	const face = useRef<HTMLSpanElement>(null);
	const shade = useRef<HTMLSpanElement>(null);
	const flap = useRef<HTMLSpanElement>(null);
	const lift = useRef<HTMLSpanElement>(null);
	// The flap's layer: fixed on <body>, above the page, so nothing clips the lift. There
	// is no <body> to portal into on the server, so the flap arrives with hydration.
	const client = useSyncExternalStore(noSubscribe, () => true, () => false);
	const layer = client ? document.body : null;
	const state = useRef({ phase: 'idle' as Phase, corner: HOME, p: { x: -REST, y: -REST } as Point, base: PRESS, frame: 0, start: { x: 0, y: 0 } as Point, last: { x: 0, y: 0, t: 0 }, v: 0, gave: false, settling: false });

	/** Draws the sticker with its corner pulled by p (in the bottom-right frame). */
	const draw = (p: Point, opacity = 1) => {
		const el = root.current;
		if (!el || !face.current || !flap.current || !shade.current || !lift.current) return;
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		const corner = state.current.corner;
		const c = { x: corner.x * w, y: corner.y * h };
		const q = mirror(p, corner);
		const len = Math.hypot(q.x, q.y) || 0.001;
		const n = { x: -q.x / len, y: -q.y / len }; // from P toward C
		const m = { x: c.x + q.x / 2, y: c.y + q.y / 2 };
		// The flap's layer sits on <body>: keep it over the sticker.
		const box = el.getBoundingClientRect();
		lift.current.style.transform = `translate(${box.left}px, ${box.top}px)`;
		lift.current.style.width = `${w}px`;
		lift.current.style.height = `${h}px`;
		// Both clips meet on the crease, where the face's antialiased edge would show as a
		// coloured hairline beside the flap: the face stops half a pixel short, and the
		// flap reaches a pixel past it.
		const back = (d: number) => ({ x: m.x - n.x * d, y: m.y - n.y * d });
		face.current.style.clipPath = polygon(cut(w, h, back(0.5), n, -1));
		shade.current.style.backgroundImage = gradient(w, h, m, n, [
			['transparent', -Math.min(22, len)],
			['rgb(0 0 0 / 0.26)', 0]
		]);
		// The flap: the lifted part, reflected across the crease so C lands on P.
		const k = 2 * dot(m, n);
		const matrix = [1 - 2 * n.x * n.x, -2 * n.x * n.y, -2 * n.x * n.y, 1 - 2 * n.y * n.y, k * n.x, k * n.y];
		flap.current.style.transform = `matrix(${matrix.map((v) => v.toFixed(5)).join(',')})`;
		flap.current.style.clipPath = polygon(cut(w, h, back(1), n, 1));
		// The bend catches the light, then the backing settles to plain paper.
		flap.current.style.backgroundImage = gradient(w, h, m, n, [
			['rgb(0 0 0 / 0.16)', 0],
			['rgb(255 255 255 / 0.9)', 5],
			['rgb(255 255 255 / 0)', 26],
			['rgb(0 0 0 / 0.05)', Math.max(60, len)]
		]);
		lift.current.style.opacity = String(opacity);
	};

	const peeled = (p: Point) => {
		const el = root.current;
		if (!el) return 0;
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		const corner = state.current.corner;
		const q = mirror(p, corner);
		const len = Math.hypot(q.x, q.y) || 0.001;
		const n = { x: -q.x / len, y: -q.y / len };
		return 1 - area(cut(w, h, { x: corner.x * w + q.x / 2, y: corner.y * h + q.y / 2 }, n, -1)) / (w * h);
	};

	/** Moves the corner along a path over `ms`, then calls `done`. Cancels whatever was running. */
	const animate = (path: (t: number) => { p: Point; opacity?: number }, ms: number, done?: () => void) => {
		const s = state.current;
		cancelAnimationFrame(s.frame);
		const t0 = performance.now();
		const tick = (now: number) => {
			const t = Math.min(1, (now - t0) / ms);
			const { p, opacity } = path(t);
			s.p = p;
			draw(p, opacity);
			if (t < 1) s.frame = requestAnimationFrame(tick);
			else done?.();
		};
		s.frame = requestAnimationFrame(tick);
	};

	/** The whole sticker leaves: the fold runs past the far corner and the flap slides off, fading. */
	const leave = (from: Point, ms: number) => {
		const s = state.current;
		const el = root.current;
		if (!el || s.phase === 'leaving' || s.phase === 'gone') return;
		s.phase = 'leaving';
		onPeel();
		navigator.vibrate?.(8);
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		// Carry on in the direction the corner is already travelling, bent a little toward the far side.
		const len = Math.hypot(from.x, from.y) || 1;
		const dir = { x: from.x / len - 0.6, y: from.y / len * 0.7 };
		const dl = Math.hypot(dir.x, dir.y);
		const v = { x: dir.x / dl, y: dir.y / dl };
		// Far enough that the crease clears every corner (in the corner's frame the sticker
		// spans −w…0 and −h…0), then a little more for the slide.
		const reach = 2 * Math.max(...[{ x: -w, y: -h }, { x: -w, y: 0 }, { x: 0, y: -h }].map((q) => dot(q, v))) * 1.25;
		const to = { x: v.x * reach, y: v.y * reach };
		animate((t) => ({ p: lerp(from, to, easeOut(t)), opacity: t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4 }), ms, () => {
			s.phase = 'gone';
			setGone(true);
		});
	};

	/** At once: the keyboard, and every input under reduced motion. */
	const vanish = () => {
		const s = state.current;
		if (s.phase === 'leaving' || s.phase === 'gone') return;
		cancelAnimationFrame(s.frame);
		s.phase = 'leaving';
		onPeel();
		const el = root.current;
		if (el) {
			el.style.transition = 'opacity 120ms cubic-bezier(0.2, 0, 0, 1)';
			el.style.opacity = '0';
		}
		setTimeout(() => {
			s.phase = 'gone';
			setGone(true);
		}, 130);
	};

	// The dog-ear at rest, and redrawn when the card resizes or the page scrolls.
	useEffect(() => {
		const el = root.current;
		if (!el || !layer) return;
		const redraw = () => draw(state.current.p);
		redraw();
		const observer = new ResizeObserver(redraw);
		observer.observe(el);
		window.addEventListener('scroll', redraw, { capture: true, passive: true });
		const s = state.current;
		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', redraw, { capture: true });
			cancelAnimationFrame(s.frame);
		};
	}, [layer]);

	// Revealed from outside (Space or Enter on the card): no show.
	useEffect(() => {
		if (revealed && state.current.phase !== 'leaving' && state.current.phase !== 'gone') vanish();
	});

	// A mouse over the sticker lifts the corner a little: the first beat of the tension.
	const onPointerEnter = (e: ReactPointerEvent<HTMLButtonElement>) => {
		const s = state.current;
		if (reduced || e.pointerType !== 'mouse' || s.phase !== 'idle') return;
		const from = s.p;
		animate((t) => ({ p: lerp(from, HOVER, easeOut(t)) }), 220);
	};
	const onPointerLeave = (e: ReactPointerEvent<HTMLButtonElement>) => {
		const s = state.current;
		if (reduced || e.pointerType !== 'mouse' || s.phase !== 'idle') return;
		const from = s.p;
		animate((t) => ({ p: lerp(from, { x: -REST, y: -REST }, easeOut(t)) }), 260);
	};

	const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
		const s = state.current;
		if (reduced || e.button !== 0 || s.phase !== 'idle') return;
		s.phase = 'pressed';
		s.gave = false;
		s.settling = false;
		s.v = 0;
		s.start = { x: e.clientX, y: e.clientY };
		s.last = { x: e.clientX, y: e.clientY, t: performance.now() };
		e.currentTarget.setPointerCapture(e.pointerId);
		const from = s.p;
		// The corner comes up under the finger, then creeps while it is held: the glue resisting.
		animate((t) => ({ p: t < 0.3 ? lerp(from, PRESS, easeInOut(t / 0.3)) : lerp(PRESS, STRAIN, easeOut((t - 0.3) / 0.7)) }), 420);
	};

	const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
		const s = state.current;
		if (s.phase !== 'pressed' && s.phase !== 'dragging') return;
		const raw = { x: e.clientX - s.start.x, y: e.clientY - s.start.y };
		if (s.phase === 'pressed') {
			if (Math.hypot(raw.x, raw.y) < 5) return;
			s.phase = 'dragging';
			cancelAnimationFrame(s.frame);
			// Peel from the corner behind the pull. A pull that is mostly along one axis
			// keeps the dog-eared corner on the other, so a sideways drag still starts there.
			const corner: Corner = {
				x: Math.abs(raw.x) < 0.35 * Math.abs(raw.y) ? state.current.corner.x : raw.x < 0 ? 1 : 0,
				y: Math.abs(raw.y) < 0.35 * Math.abs(raw.x) ? state.current.corner.y : raw.y < 0 ? 1 : 0
			};
			// The pull is measured from where the corner already is: the pressed dog-ear, or
			// flat for another corner (the dog-ear lies back down as that one lifts).
			s.base = PRESS;
			if (corner.x !== s.corner.x || corner.y !== s.corner.y) {
				s.corner = corner;
				s.base = { x: -2, y: -2 };
			}
		}
		// The pull in the corner's frame: inward is negative. Pushing outward does nothing.
		const f = mirror(raw, s.corner);
		const d = { x: Math.min(8, f.x), y: Math.min(8, f.y) };
		const pull = Math.hypot(d.x, d.y);
		const now = performance.now();
		// Speed along the peel, for the fling.
		const dt = Math.max(1, now - s.last.t);
		const step = mirror({ x: e.clientX - s.last.x, y: e.clientY - s.last.y }, s.corner);
		const along = Math.hypot(s.p.x, s.p.y) || 1;
		s.v = 0.8 * s.v + (0.2 * dot(step, { x: s.p.x / along, y: s.p.y / along })) / dt;
		s.last = { x: e.clientX, y: e.clientY, t: now };
		// Below GIVE the glue holds: the corner follows at under half the pull. Past it, one to one.
		const held = { x: s.base.x + d.x * 0.45, y: s.base.y + d.y * 0.45 };
		const free = { x: s.base.x + d.x, y: s.base.y + d.y };
		if (!s.gave && pull >= GIVE) {
			s.gave = true;
			s.settling = true;
			navigator.vibrate?.(8);
			// The catch-up from held to free is quick but not instant: the pop. It
			// chases the latest pointer each frame, so moves during it only record.
			const from = s.p;
			const t0 = now;
			const settle = (at: number) => {
				if (s.phase !== 'dragging') return;
				const t = Math.min(1, (at - t0) / 90);
				const g = mirror({ x: s.last.x - s.start.x, y: s.last.y - s.start.y }, s.corner);
				const target = { x: s.base.x + Math.min(8, g.x), y: s.base.y + Math.min(8, g.y) };
				s.p = lerp(from, { x: Math.min(-1, target.x), y: Math.min(-1, target.y) }, easeOut(t));
				draw(s.p);
				if (t < 1) s.frame = requestAnimationFrame(settle);
				else s.settling = false;
			};
			s.frame = requestAnimationFrame(settle);
			return;
		}
		if (s.settling) return;
		s.p = s.gave ? { x: Math.min(-1, free.x), y: Math.min(-1, free.y) } : { x: Math.min(-1, held.x), y: Math.min(-1, held.y) };
		draw(s.p);
	};

	const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
		const s = state.current;
		if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
		if (s.phase === 'pressed') {
			// A tap: the corner strains a little further against the glue, slowing as it
			// goes, and the glue lets go. That beat is what the release is measured against.
			s.phase = 'releasing';
			const from = s.p;
			animate((t) => ({ p: lerp(from, LAST, easeInOut(t)) }), 170, () => leave(s.p, 520));
			return;
		}
		if (s.phase !== 'dragging') return;
		if (peeled(s.p) >= COMMIT || s.v >= FLING) {
			leave(s.p, 240);
			return;
		}
		// Not far enough: it sticks back down, with a small overshoot as the glue takes it.
		s.phase = 'idle';
		s.settling = false;
		const from = s.p;
		const home = s.corner.x === HOME.x && s.corner.y === HOME.y;
		const rest = home ? { x: -REST, y: -REST } : { x: -0.5, y: -0.5 };
		const over = { x: rest.x * 0.55, y: rest.y * 0.55 };
		animate((t) => ({ p: t < 0.7 ? lerp(from, over, easeOut(t / 0.7)) : lerp(over, rest, easeInOut((t - 0.7) / 0.3)) }), 260, () => {
			// Back flat on a far corner: the dog-ear returns where it lives.
			if (!home && s.phase === 'idle') {
				s.corner = HOME;
				animate((t) => ({ p: lerp({ x: -1, y: -1 }, { x: -REST, y: -REST }, easeOut(t)) }), 200);
			}
		});
	};

	if (gone) return null;

	return (
		<button
			ref={root}
			type="button"
			aria-label="Mostra la risposta"
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			onClick={(e) => {
				// A pointer tap is handled on pointer up; a click with no pointer is the keyboard.
				if (e.detail === 0 || reduced) vanish();
			}}
			// The sticker takes drags in every direction, so it can be peeled downward too.
			className="group absolute inset-x-3 inset-y-2 z-10 touch-none select-none rounded-xl text-left focus-ring-offset"
		>
			{/* The flat part of the sticker, still stuck down. */}
			<span ref={face} className="absolute inset-0 overflow-hidden rounded-xl bg-tint-cover text-tint-cover-fg shadow-paper" aria-hidden="true">
				<span className="grid-paper absolute inset-0 opacity-60 [--grid:color-mix(in_oklab,white_14%,transparent)]" />
				<span className="relative flex h-full flex-col items-center justify-center gap-1.5 px-6 text-center">
					<span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Mostra la risposta</span>
					<span className="label-mono text-white/75">
						<span className="pointer-coarse:hidden">Clic, trascina l&apos;angolo o Spazio</span>
						<span className="hidden pointer-coarse:inline">Tocca o tira l&apos;angolo</span>
					</span>
				</span>
				{/* The shadow the lifted flap throws on what is still stuck. */}
				<span ref={shade} className="absolute inset-0" />
			</span>
			{/* The lifted flap: the backing, white paper, mirrored across the crease. */}
			{layer &&
				createPortal(
					<span ref={lift} className="pointer-events-none fixed left-0 top-0 z-40 drop-shadow-[0_3px_5px_rgb(0_0_0/0.22)]" aria-hidden="true">
						<span ref={flap} className="absolute inset-0 origin-top-left rounded-xl bg-paper-50" />
					</span>,
					layer
				)}
		</button>
	);
}
