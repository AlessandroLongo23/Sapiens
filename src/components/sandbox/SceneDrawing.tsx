'use client';

import { useState, type ReactNode, type RefObject } from 'react';
import { Drawing, Label, Dot, frame, v, add, sub, scale, len, unit, TINT, THICK, THIN, DASH, type V } from '@/components/content/interactive/kit';
import { Ball, Block, Ground, Pulley, Thread, VecLabel, Vector, QTY } from '@/components/content/interactive/fisica';
import { nameBox, segToBox, type NameReq, type Seg } from '@/components/content/interactive/fisica/nomi';
import { initial, resting, ropeShape, solve, span, type Force, type Scene, type Solution, type State, type Vec } from '@/lib/sandbox/engine';

/** The window of a scene as a kit frame: at most `maxW` cm wide and `maxH` cm tall, the same scale on both axes. */
export function sceneFrame(scene: Scene, maxW = 10, maxH = 8) {
	const { x0, x1, y0, y1 } = scene.view;
	const S = Math.min(maxW / (x1 - x0), maxH / (y1 - y0));
	return { S, f: frame(x0 * S, x1 * S, y0 * S, y1 * S) };
}

/** Where a name stands with respect to its arrow: beside it at `t` of its length, on one side, or past its tip. */
type Slot = { t: number; side: 1 | -1 | 0; extra: number };
const SLOTS: (Slot & { far: number })[] = [
	...[0.75, 0.6, 0.9, 0.45, 1].flatMap((t) => ([1, -1] as const).flatMap((side) => [0, 0.15, 0.3, 0.5, 0.75].map((extra) => ({ t, side, extra, far: extra + Math.abs(t - 0.75) * 0.3 })))),
	...[0, 0.15, 0.3].map((extra) => ({ t: 1, side: 0 as const, extra, far: extra + 0.05 }))
];

/** For a component, which lies along an axis: past its tip first, where it cannot be taken for the name of another arrow. */
const TIP_FIRST = [...SLOTS.slice(-3).map((x) => ({ ...x, far: x.extra })), ...SLOTS.slice(0, -3).map((x) => ({ ...x, far: x.far + 0.1 }))];

/**
 * Centres for the names of the arrows, as `placeNames` of the lessons' figures gives them, weighed for a scene full of
 * outlines: a name goes where its box is clear of every line and of the other names, beside its arrow or past its tip,
 * and being clear counts more than being near, so a name leaves a small body instead of sitting on its edge.
 *
 * In a scene that moves the best place changes from one frame to the next, and a name that follows it jumps about and
 * cannot be read. So a name keeps the place it has with respect to its arrow (`memory`, by the arrow's key) and moves
 * with it; it looks for another only when that one ends up on a line or on another name.
 */
function placeLabels(f: ReturnType<typeof frame>, segs: Seg[], reqs: (NameReq & { key: string; tip?: boolean })[], keepOut: V[], memory: Map<string, Slot>): V[] {
	const placed: { c: V; hw: number; hh: number }[] = [];
	return reqs.map(({ seg, chars, key, tip }) => {
		const s = segs[seg];
		const { w, h } = nameBox(chars);
		const hw = w / 2, hh = h / 2;
		const d = sub(s.b, s.a);
		const L = len(d) || 1;
		const u = scale(d, 1 / L), n = v(-u.y, u.x);
		const centre = ({ t, side, extra }: Slot) =>
			side ? add(add(s.a, scale(d, t)), scale(n, side * (0.1 + extra + Math.abs(n.x) * hw + Math.abs(n.y) * hh))) : add(s.b, scale(u, 0.12 + extra + Math.abs(u.x) * hw + Math.abs(u.y) * hh));
		const clearOf = (c: V) => {
			let clear = Infinity;
			segs.forEach((o, i) => i !== seg && (clear = Math.min(clear, segToBox(o, c, hw, hh))));
			for (const p of placed) clear = Math.min(clear, Math.max(Math.abs(c.x - p.c.x) - hw - p.hw, Math.abs(c.y - p.c.y) - hh - p.hh));
			for (const k of keepOut) clear = Math.min(clear, Math.max(Math.abs(c.x - k.x) - hw - 0.15, Math.abs(c.y - k.y) - hh - 0.12));
			return clear;
		};
		const outOf = (c: V) => Math.max(f.x0 - (c.x - hw), c.x + hw - f.x1, f.y0 - (c.y - hh), c.y + hh - f.y1, 0);

		const kept = memory.get(key);
		if (kept) {
			const c = centre(kept);
			if (clearOf(c) >= 0.02 && outOf(c) === 0) {
				placed.push({ c, hw, hh });
				return c;
			}
		}
		let best: Slot = SLOTS[0], bestScore = -Infinity;
		for (const slot of tip ? TIP_FIRST : SLOTS) {
			const c = centre(slot);
			const score = Math.min(clearOf(c), 0.12) * 6 - slot.far * 0.35 - outOf(c) * 10;
			if (score > bestScore) {
				bestScore = score;
				best = slot;
			}
			// clear, beside its arrow and inside the drawing: no other place can do better
			if (score >= 0.12 * 6 - 1e-9 && slot.far === 0) break;
		}
		memory.set(key, best);
		const c = centre(best);
		placed.push({ c, hw, hh });
		return c;
	});
}

/**
 * The path a body has followed, as the lines to draw: a stretch it has already been along is not drawn again. A
 * pendulum goes over the same arc for as long as the clock runs, and its path stays one arc long, not one that grows
 * by a point at every frame and is painted again, dashes over dashes, sixty times a second.
 */
function traces(trail: Vec[], cell = 0.02): Vec[][] {
	const seen = new Set<number>();
	const lines: Vec[][] = [];
	let line: Vec[] = [];
	let skipped: Vec | null = null;
	for (const p of trail) {
		const key = Math.round(p.x / cell) * 100003 + Math.round(p.y / cell);
		if (seen.has(key)) {
			skipped = p;
			continue;
		}
		seen.add(key);
		const last = line[line.length - 1];
		// back on new ground after a stretch already drawn: a new line from where the body left the old one
		if (skipped && last && Math.hypot(skipped.x - last.x, skipped.y - last.y) > 2 * cell) {
			lines.push(line);
			line = [skipped];
		}
		skipped = null;
		line.push(p);
	}
	lines.push(line);
	return lines.filter((l) => l.length > 1);
}

function gridLines(scene: Scene, step: number): [Vec, Vec][] {
	const { x0, x1, y0, y1 } = scene.view;
	const lines: [Vec, Vec][] = [];
	for (let x = Math.ceil(x0 / step) * step; x <= x1 + 1e-9; x += step) lines.push([{ x, y: y0 }, { x, y: y1 }]);
	for (let y = Math.ceil(y0 / step) * step; y <= y1 + 1e-9; y += step) lines.push([{ x: x0, y }, { x: x1, y }]);
	return lines;
}

/**
 * A scale for the arrows of a scene, cm per newton: the largest force at its start is 1,7 cm long. Worked out once
 * and kept while the sliders move and the time runs, otherwise the arrow of a force that does not change would.
 */
export function forceScaleOf(scene: Scene) {
	const largest = Math.max(1e-9, ...solve(scene, initial(scene)).forces.flat().map((x) => Math.hypot(x.v.x, x.v.y)));
	return 1.7 / largest;
}

/** The letter of a force and its subscript, as the lessons write them: P, F_v for a surface's reaction, F_s and F_d for friction. */
export function forceName(force: Force, scene: Scene): [string, string | undefined] {
	if (force.kind === 'weight') return ['P', undefined];
	if (force.kind === 'normal') return ['F', 'v'];
	if (force.kind === 'friction') return ['F', force.static ? 's' : 'd'];
	const rope = scene.ropes.find((r) => r.id === force.of);
	if (rope?.name) return [rope.name, undefined];
	return ['T', scene.ropes.length > 1 ? String(scene.ropes.findIndex((r) => r.id === force.of) + 1) : undefined];
}

/**
 * A scene of the physics sandbox in one state, drawn with the pieces of the lessons' figures: surfaces, pulleys,
 * ropes and bodies, the forces on the bodies chosen in `forces`, and the path the selected body has followed.
 * A click on a body selects it.
 */
export function SceneDrawing({ scene, state, solution, selected, onSelect, forces, forceScale: kf, velocityScale: kv = 0.25, components = false, trail, label, maxW, maxH, grid, svgRef, children }: { /** The arrows of the selected body are also drawn split along x and y. */ components?: boolean; /** Centimetres of arrow per m/s for the velocities, fixed like the forces' scale; 0 hides them. */ velocityScale?: number; /** Lines every `grid` metres behind the scene. */ grid?: number; svgRef?: RefObject<SVGSVGElement | null>; /** Drawn above the scene, in the same SVG: the editor's handles. Without `onSelect` the bodies are not clickable here. */ children?: ReactNode; /** Centimetres of arrow per newton: fixed, so an arrow changes length only when its force does. */ forceScale: number; maxW?: number; maxH?: number; scene: Scene; state: State; solution: Solution; selected: number; onSelect?: (i: number) => void; forces: 'all' | 'selected' | 'none'; trail: Vec[]; label: string }) {
	const { S, f } = sceneFrame(scene, maxW, maxH);
	// where each name stands beside its arrow, kept from one frame to the next (see placeLabels)
	const [memory] = useState(() => new Map<string, Slot>());
	const P = (p: Vec): V => v(p.x * S, p.y * S);
	const up = resting(scene, state.pos);

	// Every arrow of the scene, from the centre of its body: the forces and the velocity, each at its fixed scale.
	const arrows: { key: string; body: number; from: V; to: V; color: string; name: string; sub?: string; /** A component of another arrow, along x or y. */ part?: boolean }[] = [];
	scene.bodies.forEach((b, i) => {
		const c = P(state.pos[i]);
		if (forces === 'all' || (forces === 'selected' && i === selected))
			solution.forces[i].forEach((force, k) => {
				const arrow = scale(v(force.v.x, force.v.y), kf);
				if (len(arrow) < 0.12) return;
				const [name, sub] = forceName(force, scene);
				arrows.push({ key: `${b.id}-f${k}`, body: i, from: c, to: add(c, arrow), color: QTY.forza, name, sub });
			});
		const vel = scale(v(state.vel[i].x, state.vel[i].y), kv);
		if (kv > 0 && len(vel) >= 0.12) arrows.push({ key: `${b.id}-v`, body: i, from: c, to: add(c, vel), color: QTY.velocita, name: 'v' });
	});
	// The arrows of the selected body split along the axes: for each one that is not already along an axis, its two
	// components from the same point, dashed, and the two lines that close the rectangle.
	const guides: V[][] = [];
	if (components)
		for (const a of arrows.filter((x) => x.body === selected)) {
			const d = sub(a.to, a.from);
			if (Math.abs(d.x) < 0.12 || Math.abs(d.y) < 0.12) continue;
			const along = (axis: 'x' | 'y', to: V) => arrows.push({ key: `${a.key}-${axis}`, body: a.body, from: a.from, to, color: a.color, name: a.name, sub: a.sub ? `${a.sub},${axis}` : axis, part: true });
			const px = add(a.from, v(d.x, 0)), py = add(a.from, v(0, d.y));
			along('x', px);
			along('y', py);
			guides.push([px, a.to], [py, a.to]);
		}
	// The outline of each body, as segments the names have to keep clear of, with the ropes and the surfaces.
	const outline = scene.bodies.flatMap((b, i) => {
		const c = P(state.pos[i]);
		const n = up[i] ?? { x: 0, y: 1 };
		const r = b.r * S;
		const sides = b.shape === 'ball' ? 8 : 4;
		const turn = Math.atan2(n.y, n.x) + (b.shape === 'ball' ? 0 : Math.PI / 4);
		const corner = (k: number) => add(c, scale(v(Math.cos(turn + (k * 2 * Math.PI) / sides), Math.sin(turn + (k * 2 * Math.PI) / sides)), b.shape === 'ball' ? r : r * Math.SQRT2));
		return Array.from({ length: sides }, (_, k) => ({ a: corner(k), b: corner(k + 1) }));
	});
	const lines = [
		...scene.surfaces.map((s) => span(scene, s)).map(([a, b]) => ({ a: P(a), b: P(b) })),
		...scene.ropes.flatMap((r) => ropeShape(scene, r, state.pos)?.strands.map((s) => ({ a: P(s.from), b: P(s.to) })) ?? [])
	];
	// The name of a body with arrows on it moves from the centre, where the arrows start, towards the corner of the
	// block that is farthest from every arrow.
	const names = scene.bodies.map((b, i) => {
		const own = arrows.filter((a) => a.body === i).map((a) => Math.atan2(a.to.y - a.from.y, a.to.x - a.from.x));
		if (!own.length || b.shape === 'ball') return null;
		const n = up[i] ?? { x: 0, y: 1 };
		const apart = (x: number, y: number) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
		const corners = [3, 0, 2, 1].map((k) => Math.atan2(n.y, n.x) + Math.PI / 4 + (k * Math.PI) / 2);
		// The first corner with room enough, in a fixed order (the two away from the surface first): the name stays
		// where it is while the arrows change length, and moves only when one comes close to it.
		const room = (q: number) => Math.min(...own.map((o) => apart(q, o)));
		const best = corners.find((q) => room(q) >= 0.5) ?? corners.reduce((p, q) => (room(q) > room(p) + 1e-6 ? q : p));
		// In a small block there is no room for it: it is placed outside, with the names of the arrows.
		return { inside: b.r * S >= 0.4, at: add(P(state.pos[i]), scale(v(Math.cos(best), Math.sin(best)), b.r * S * 0.72)), towards: v(Math.cos(best), Math.sin(best)) };
	});
	// Where each arrow's name is written: clear of every line of the drawing and of the other names.
	// A force too short to leave its body is named as if it reached past the outline, so its name is outside too.
	const reach = (a: (typeof arrows)[number]) => {
		const d = sub(a.to, a.from);
		const out = scene.bodies[a.body].r * S * Math.SQRT2 + 0.15;
		return len(d) >= out ? a.to : add(a.from, scale(unit(d), out));
	};
	const outside = names.flatMap((n, i) => (n && !n.inside ? [{ body: i, a: P(state.pos[i]), b: add(P(state.pos[i]), scale(n.towards, scene.bodies[i].r * S * Math.SQRT2 + 0.1)) }] : []));
	const placed = placeLabels(
		f,
		[...arrows.map((a) => ({ a: a.from, b: reach(a) })), ...outside, ...outline, ...lines, ...guides.map(([a, b]) => ({ a, b }))],
		[...arrows.map((a, k) => ({ seg: k, chars: a.sub ? (a.part ? 3 : 2) : 1, key: a.key, tip: a.part })), ...outside.map((o, k) => ({ seg: arrows.length + k, chars: 2, key: `name-${scene.bodies[o.body].id}` }))],
		names.flatMap((n) => (n?.inside ? [n.at] : [])),
		memory
	);
	const spots = placed.slice(0, arrows.length);
	const nameAt = scene.bodies.map((_, i) => {
		const n = names[i];
		if (!n) return null;
		const k = outside.findIndex((o) => o.body === i);
		return k >= 0 ? placed[arrows.length + k] : n.at;
	});

	return (
		<Drawing f={f} label={label} svgRef={svgRef}>
			{grid && <path d={gridLines(scene, grid).map(([a, b]) => f.path([P(a), P(b)])).join(' ')} stroke="#000" strokeOpacity={0.08} strokeWidth={THIN} fill="none" />}
			{scene.surfaces.map((s) => {
				const [a, b] = span(scene, s).map(P);
				const flat = Math.abs(a.y - b.y) < 1e-9 || Math.abs(a.x - b.x) < 1e-9;
				if (flat) return <Ground key={s.id} f={f} from={a} to={b} />;
				const corner = v(a.y < b.y ? b.x : a.x, Math.min(a.y, b.y));
				return <path key={s.id} d={f.path([a, b, corner], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />;
			})}
			{scene.ropes.map((rope) => {
				const shape = ropeShape(scene, rope, state.pos);
				if (!shape) return null;
				const arc: V[] = [];
				if (shape.arc) {
					const { c, r, from, to, cw } = shape.arc;
					const TAU = 2 * Math.PI;
					const sweep = ((((cw ? from - to : to - from) % TAU) + TAU) % TAU);
					for (let k = 0; k <= 16; k++) {
						const phi = from + ((cw ? -1 : 1) * sweep * k) / 16;
						arc.push(P({ x: c.x + r * Math.cos(phi), y: c.y + r * Math.sin(phi) }));
					}
				}
				return (
					<g key={rope.id}>
						{shape.strands.map((s, k) => <Thread key={k} f={f} from={P(s.from)} to={P(s.to)} />)}
						{arc.length > 0 && <path d={f.path(arc)} stroke="#000" strokeWidth={THIN} fill="none" />}
						{[rope.from, rope.to].map((e, k) => ('point' in e ? <Dot key={k} f={f} at={P(e.point)} /> : null))}
					</g>
				);
			})}
			{scene.pulleys.map((p) => <Pulley key={p.id} f={f} at={P(p.at)} r={p.r * S} />)}
			{trail.length > 1 && <path d={traces(trail).map((line) => f.path(line.map(P))).join(' ')} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}

			{scene.bodies.map((b, i) => {
				const c = P(state.pos[i]);
				const n = up[i] ?? { x: 0, y: 1 };
				const r = b.r * S;
				const px = f.px(c);
				return (
					<g key={b.id}>
						{b.shape === 'ball' ? <Ball f={f} at={c} r={r} fill={i === selected ? TINT.orange : TINT.blue} /> : <Block f={f} at={add(c, scale(v(n.x, n.y), -r))} w={2 * r} h={2 * r} angle={Math.atan2(n.y, n.x) - Math.PI / 2} fill={i === selected ? TINT.orange : TINT.blue} />}
						{b.name && b.shape !== 'ball' && <Label f={f} at={nameAt[i] ?? c} size={12}>{b.name}</Label>}
						{onSelect && <circle cx={px.x} cy={px.y} r={Math.max(r * (f.W / (f.x1 - f.x0)) * 1.5, 18)} fill="transparent" style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`Seleziona ${b.name ?? 'il corpo'}`} aria-pressed={i === selected} onClick={() => onSelect(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(i); } }} />}
					</g>
				);
			})}
			{guides.length > 0 && <path d={guides.map((g) => f.path(g)).join(' ')} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			{arrows.map((a) => <Vector key={a.key} f={f} from={a.from} to={a.to} color={a.color} dashed={a.part} weight={a.part ? 'thin' : 'thick'} />)}
			{arrows.map((a, k) => <VecLabel key={a.key} f={f} at={spots[k]} name={a.name} sub={a.sub} color={a.color} />)}
			{children}
		</Drawing>
	);
}
