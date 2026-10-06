import type { Body, Pulley, Rope, RopeEnd, Scene, Surface, Vec } from './engine';

/**
 * Editing a scene of the physics sandbox: adding, moving and removing pieces. Every function takes a scene and gives
 * back a new one. Pieces snap: a body near a surface sits on it, the end of a rope takes the body or the surface it is
 * dropped on, and what rests on a surface, or is tied to it, moves with it.
 *
 * The solid side of a surface is on the right of who walks from `a` to `b` (the hatching of the lessons' figures):
 * a floor goes left to right, a ceiling right to left, a wall that faces right goes top to bottom.
 */

export type PieceKind = 'block' | 'ball' | 'floor' | 'ceiling' | 'wall' | 'incline' | 'pulley';
export type Sel = { type: 'body' | 'surface' | 'rope' | 'pulley'; id: string };

/** The window of the editor, metres. */
export const VIEW = { x0: -2.8, x1: 4.4, y0: -0.4, y1: 3.6 };
const GRID = 0.05;
/** How close a body has to come to a surface, or the end of a rope to a piece, to snap to it. */
const REACH = 0.3;
const MIN_LENGTH = 0.3;

const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const round = (x: number, g = GRID) => Math.round(x / g) * g;
const onGrid = (p: Vec, g = GRID): Vec => ({ x: round(p.x, g), y: round(p.y, g) });
const inView = (p: Vec, margin = 0): Vec => ({ x: Math.min(VIEW.x1 - margin, Math.max(VIEW.x0 + margin, p.x)), y: Math.min(VIEW.y1 - margin, Math.max(VIEW.y0 + margin, p.y)) });

/** A point seen from a surface: how far along it (0 at a, 1 at b) and how far from it on its free side. */
function seen(s: Surface, p: Vec) {
	const d = sub(s.b, s.a);
	const L = Math.hypot(d.x, d.y) || 1e-9;
	const t = mul(d, 1 / L);
	const n = { x: -t.y, y: t.x };
	const rel = sub(p, s.a);
	return { t, n, L, s: dot(t, rel) / L, h: dot(n, rel) };
}
const at = (s: Surface, along: number, off = 0): Vec => {
	const g = seen(s, s.a);
	return add(add(s.a, mul(g.t, along * g.L)), mul(g.n, off));
};

/** Where a body dragged to `p` goes: onto the nearest surface it has come close to, otherwise on the grid. */
export function snapBody(scene: Scene, body: Body, p: Vec): Vec {
	let best: { gap: number; pos: Vec } | null = null;
	for (const s of scene.surfaces) {
		const g = seen(s, p);
		if ((!s.endless && (g.s < 0 || g.s > 1)) || g.h < -REACH / 2 || g.h > body.r + REACH) continue;
		const gap = Math.abs(g.h - body.r);
		if (!best || gap < best.gap) best = { gap, pos: at(s, g.s, body.r) };
	}
	if (best) return best.pos;
	// Under the edge of a pulley, so that the rope it will hang from is vertical.
	const q = onGrid(inView(p, body.r));
	for (const c of scene.pulleys) for (const x of [c.at.x - c.r, c.at.x + c.r]) if (p.y < c.at.y && Math.abs(p.x - x) < 0.12) q.x = x;
	return q;
}

const rests = (s: Surface, b: Body) => {
	const g = seen(s, b.pos);
	return (s.endless || (g.s >= -1e-6 && g.s <= 1 + 1e-6)) && Math.abs(g.h - b.r) < 1e-6;
};
const tied = (s: Surface, p: Vec) => {
	const g = seen(s, p);
	return (s.endless || (g.s >= -1e-6 && g.s <= 1 + 1e-6)) && Math.abs(g.h) < 1e-6;
};

/** Gives a surface new ends; the bodies that rest on it and the rope ends tied to it keep their place along it. */
function reshape(scene: Scene, id: string, a: Vec, b: Vec): Scene {
	const old = scene.surfaces.find((s) => s.id === id);
	if (!old) return scene;
	const next: Surface = { ...old, a, b };
	const end = (e: RopeEnd): RopeEnd => ('point' in e && tied(old, e.point) ? { point: at(next, seen(old, e.point).s) } : e);
	return {
		...scene,
		surfaces: scene.surfaces.map((s) => (s.id === id ? next : s)),
		bodies: scene.bodies.map((body) => (rests(old, body) ? { ...body, pos: at(next, seen(old, body.pos).s, body.r) } : body)),
		ropes: scene.ropes.map((r) => ({ ...r, from: end(r.from), to: end(r.to) }))
	};
}

export function moveBody(scene: Scene, id: string, p: Vec): Scene {
	return { ...scene, bodies: scene.bodies.map((b) => (b.id === id ? { ...b, pos: snapBody(scene, b, p) } : b)) };
}

/** Moves a whole surface so that its first end is at `a`. */
export function moveSurface(scene: Scene, id: string, a: Vec): Scene {
	const s = scene.surfaces.find((x) => x.id === id);
	if (!s) return scene;
	const to = onGrid(a, 0.1);
	// An endless surface only moves across its own line: along it there is nothing to move.
	if (s.endless && s.kind === 'wall') to.y = s.a.y;
	else if (s.endless) to.x = s.a.x;
	return reshape(scene, id, to, add(to, sub(s.b, s.a)));
}

/** Drags one end of a surface: a floor and a ceiling stay level, a wall upright, an incline turns. */
export function moveSurfaceEnd(scene: Scene, id: string, which: 'a' | 'b', p: Vec): Scene {
	const s = scene.surfaces.find((x) => x.id === id);
	if (!s) return scene;
	const other = which === 'a' ? s.b : s.a;
	const q = onGrid(inView(p), 0.1);
	const sign = which === 'b' ? 1 : -1; // b lies after a in the surface's direction
	if (s.kind === 'floor' || s.kind === 'ceiling') {
		const dir = (s.kind === 'floor' ? 1 : -1) * sign;
		q.y = other.y;
		q.x = dir > 0 ? Math.max(q.x, other.x + MIN_LENGTH) : Math.min(q.x, other.x - MIN_LENGTH);
	} else if (s.kind === 'wall') {
		const dir = Math.sign(s.b.y - s.a.y || -1) * sign;
		q.x = other.x;
		q.y = dir > 0 ? Math.max(q.y, other.y + MIN_LENGTH) : Math.min(q.y, other.y - MIN_LENGTH);
	} else {
		// An incline keeps its solid side below: a is its left end.
		q.x = sign > 0 ? Math.max(q.x, other.x + 0.2) : Math.min(q.x, other.x - 0.2);
		if (dist(q, other) < MIN_LENGTH) return scene;
	}
	return which === 'a' ? reshape(scene, id, q, s.b) : reshape(scene, id, s.a, q);
}

/** An incline at `angle` degrees and `length` metres, turned around its lower end. */
export function setIncline(scene: Scene, id: string, angle: number, length: number): Scene {
	const s = scene.surfaces.find((x) => x.id === id);
	if (!s) return scene;
	const up = s.b.y >= s.a.y;
	const foot = up ? s.a : s.b;
	const rad = (angle * Math.PI) / 180;
	const top = { x: foot.x + (up ? 1 : -1) * length * Math.cos(rad), y: foot.y + length * Math.sin(rad) };
	return up ? reshape(scene, id, s.a, top) : reshape(scene, id, top, s.b);
}

/** The length of a surface, keeping its first end and its direction. */
export function setLength(scene: Scene, id: string, length: number): Scene {
	const s = scene.surfaces.find((x) => x.id === id);
	if (!s) return scene;
	const g = seen(s, s.a);
	return reshape(scene, id, s.a, add(s.a, mul(g.t, length)));
}

/** Lets a floor, a ceiling or a wall go on past its ends without limit, or cuts it back to the stretch between them. */
export function setEndless(scene: Scene, id: string, endless: boolean): Scene {
	return { ...scene, surfaces: scene.surfaces.map((s) => (s.id === id ? { ...s, endless } : s)) };
}

/** Turns a wall to face the other way. */
export function flip(scene: Scene, id: string): Scene {
	const s = scene.surfaces.find((x) => x.id === id);
	return s ? { ...scene, surfaces: scene.surfaces.map((x) => (x.id === id ? { ...x, a: s.b, b: s.a } : x)) } : scene;
}

export function movePulley(scene: Scene, id: string, p: Vec): Scene {
	return rewrap({ ...scene, pulleys: scene.pulleys.map((c) => (c.id === id ? { ...c, at: onGrid(inView(p, c.r)) } : c)) });
}

/** What a rope can be tied to at `p`: a body, a pulley to pass over, a point of a surface, or a nail in the air. */
export function target(scene: Scene, p: Vec): { end: RopeEnd; pulley?: string } {
	for (const b of scene.bodies) if (dist(b.pos, p) <= b.r + 0.12) return { end: { body: b.id } };
	for (const c of scene.pulleys) if (dist(c.at, p) <= c.r + 0.12) return { end: { point: c.at }, pulley: c.id };
	let best: { d: number; point: Vec } | null = null;
	for (const s of scene.surfaces) {
		const g = seen(s, p);
		const point = s.endless ? inView(at(s, g.s)) : at(s, Math.min(1, Math.max(0, g.s)));
		const d = dist(point, p);
		if (d <= REACH && (!best || d < best.d)) best = { d, point };
	}
	return { end: { point: best ? best.point : onGrid(inView(p)) } };
}

/** Moves the fixed end of a rope. */
export function moveRopeEnd(scene: Scene, id: string, which: 'from' | 'to', p: Vec): Scene {
	const { end, pulley } = target(scene, p);
	if (pulley) return scene;
	return rewrap({ ...scene, ropes: scene.ropes.map((r) => (r.id === id ? { ...r, [which]: end } : r)) });
}

const newId = (taken: { id: string }[], prefix: string) => {
	for (let n = 1; ; n++) if (!taken.some((x) => x.id === `${prefix}${n}`)) return `${prefix}${n}`;
};
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const subscript = (n: number) => String(n).split('').map((d) => SUBSCRIPTS[Number(d)]).join('');

/** A new piece, where there is room for it; the scene and what to select. */
export function addPiece(scene: Scene, kind: PieceKind): { scene: Scene; sel: Sel } {
	if (kind === 'block' || kind === 'ball') {
		const id = newId(scene.bodies, 'm');
		const n = scene.bodies.length;
		const body: Body = { id, name: `m${subscript(Number(id.slice(1)))}`, m: 1, r: kind === 'ball' ? 0.12 : 0.15, shape: kind, pos: { x: 0, y: 0 } };
		body.pos = snapBody(scene, body, { x: 0.8 + 0.45 * (n % 4), y: 2 - 0.1 * (n % 3) });
		return { scene: { ...scene, bodies: [...scene.bodies, body] }, sel: { type: 'body', id } };
	}
	if (kind === 'pulley') {
		const id = newId(scene.pulleys, 'c');
		const pulley: Pulley = { id, at: { x: 1.5 + 0.5 * scene.pulleys.length, y: 2.8 }, r: 0.15 };
		return { scene: { ...scene, pulleys: [...scene.pulleys, pulley] }, sel: { type: 'pulley', id } };
	}
	const id = newId(scene.surfaces, 's');
	const k = scene.surfaces.filter((s) => s.kind === kind).length;
	const ends: Record<'floor' | 'ceiling' | 'wall' | 'incline', [Vec, Vec]> = {
		floor: k ? [{ x: -1, y: 0.6 * k }, { x: 1, y: 0.6 * k }] : [{ x: -2.4, y: 0 }, { x: 4, y: 0 }],
		ceiling: [{ x: 3.2, y: 3.2 - 0.5 * k }, { x: -1.6, y: 3.2 - 0.5 * k }],
		wall: [{ x: -2.2 + 0.6 * k, y: 2.8 }, { x: -2.2 + 0.6 * k, y: 0 }],
		incline: [{ x: -0.6 + 0.3 * k, y: 0 }, { x: -0.6 + 0.3 * k + 2.4 * Math.cos(Math.PI / 6), y: 2.4 * Math.sin(Math.PI / 6) }]
	};
	const [a, b] = ends[kind];
	return { scene: { ...scene, surfaces: [...scene.surfaces, { id, kind, a, b, muS: 0, muK: 0, endless: kind === 'ceiling' || kind === 'wall' || (kind === 'floor' && !k) }] }, sel: { type: 'surface', id } };
}

/** The way a rope turns around its pulley: over it, on the side away from the two ends. */
function wrapOf(scene: Scene, rope: Rope): Rope {
	if (!rope.via) return rope;
	const pulley = scene.pulleys.find((c) => c.id === rope.via!.pulley);
	if (!pulley) return { ...rope, via: undefined };
	const where = (e: RopeEnd) => ('point' in e ? e.point : (scene.bodies.find((b) => b.id === e.body)?.pos ?? pulley.at));
	const P = sub(where(rope.from), pulley.at), Q = sub(where(rope.to), pulley.at);
	return { ...rope, via: { pulley: pulley.id, wrap: P.x * Q.y - P.y * Q.x > 0 ? 'cw' : 'ccw' } };
}
/** Ropes are taut in the editor: their length is the one they have, and their turn around a pulley follows the pieces. */
export function rewrap(scene: Scene): Scene {
	return { ...scene, ropes: scene.ropes.map((r) => wrapOf(scene, { ...r, length: undefined })) };
}

export function addRope(scene: Scene, from: RopeEnd, to: RopeEnd, pulley?: string): { scene: Scene; sel: Sel } {
	const id = newId(scene.ropes, 'filo');
	const rope: Rope = { id, from, to, via: pulley ? { pulley, wrap: 'cw' } : undefined };
	return { scene: rewrap({ ...scene, ropes: [...scene.ropes, rope] }), sel: { type: 'rope', id } };
}

export function remove(scene: Scene, sel: Sel): Scene {
	if (sel.type === 'body') return { ...scene, bodies: scene.bodies.filter((b) => b.id !== sel.id), ropes: scene.ropes.filter((r) => !(('body' in r.from && r.from.body === sel.id) || ('body' in r.to && r.to.body === sel.id))) };
	if (sel.type === 'pulley') return { ...scene, pulleys: scene.pulleys.filter((c) => c.id !== sel.id), ropes: scene.ropes.map((r) => (r.via?.pulley === sel.id ? { ...r, via: undefined } : r)) };
	if (sel.type === 'rope') return { ...scene, ropes: scene.ropes.filter((r) => r.id !== sel.id) };
	return { ...scene, surfaces: scene.surfaces.filter((s) => s.id !== sel.id) };
}

/** A scene made elsewhere (an example, a link), ready for the editor: its window, and the kind of each surface. */
export function adopt(scene: Scene): Scene {
	const surfaces = scene.surfaces.map((s): Surface => {
		if (s.kind) return s;
		if (Math.abs(s.a.y - s.b.y) < 1e-9) return { ...s, kind: s.a.x < s.b.x ? 'floor' : 'ceiling' };
		if (Math.abs(s.a.x - s.b.x) < 1e-9) return { ...s, kind: 'wall' };
		return s.a.x < s.b.x ? { ...s, kind: 'incline' } : { ...s, kind: 'incline', a: s.b, b: s.a };
	});
	// The ground of a scene made for a lesson stops at the edge of its figure; here it goes on, so nothing falls off it.
	const ground = Math.min(...surfaces.filter((s) => s.kind === 'floor').map((s) => s.a.y));
	return rewrap({ ...scene, surfaces: surfaces.map((s) => (s.kind === 'floor' && s.endless === undefined && s.a.y === ground ? { ...s, endless: true } : s)), view: VIEW });
}

export const EMPTY: Scene = { g: 9.8, bodies: [], surfaces: [], pulleys: [], ropes: [], view: VIEW };

/** A scene as the text of a link, and back; null when the text is not a scene. */
export function encode(scene: Scene): string {
	return btoa(unescape(encodeURIComponent(JSON.stringify({ ...scene, view: undefined }))));
}
export function decode(text: string): Scene | null {
	try {
		const raw = JSON.parse(decodeURIComponent(escape(atob(text)))) as Partial<Scene>;
		if (!Array.isArray(raw.bodies) || !Array.isArray(raw.surfaces) || !Array.isArray(raw.ropes) || !Array.isArray(raw.pulleys)) return null;
		const num = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
		if (!raw.bodies.every((b) => b && typeof b.id === 'string' && num(b.m) && b.m > 0 && num(b.r) && num(b.pos?.x) && num(b.pos?.y))) return null;
		if (!raw.surfaces.every((s) => s && typeof s.id === 'string' && num(s.a?.x) && num(s.a?.y) && num(s.b?.x) && num(s.b?.y))) return null;
		if (!raw.pulleys.every((c) => c && typeof c.id === 'string' && num(c.r) && num(c.at?.x) && num(c.at?.y))) return null;
		return adopt({ g: num(raw.g) ? (raw.g as number) : 9.8, bodies: raw.bodies.slice(0, 12), surfaces: raw.surfaces.slice(0, 12), pulleys: raw.pulleys.slice(0, 6), ropes: raw.ropes.slice(0, 12), view: VIEW });
	} catch {
		return null;
	}
}
