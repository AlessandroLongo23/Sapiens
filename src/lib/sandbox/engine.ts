/**
 * The engine of the physics sandbox (vault/Idee/Sandbox di fisica.md): point masses, fixed straight surfaces with
 * Coulomb friction, ideal ropes and fixed ideal pulleys, in SI units with y upwards. No rotation and no collisions
 * between bodies.
 *
 * It is a constraint solver, not a penalty engine: at every step the accelerations and the forces of the constraints
 * (tensions, normal reactions, friction) are the unknowns of one linear system, so a tension or a reaction is a result
 * to read, and a system with constant forces moves exactly as its closed law says (the step is x + v h + a h²/2, and
 * it is cut where friction stops a body, where a body lands and where a rope goes taut). A scene is plain JSON.
 */

export type Vec = { x: number; y: number };

export interface Body {
	id: string;
	/** kg */
	m: number;
	pos: Vec;
	vel?: Vec;
	/** Half size, metres: the distance of the centre from a surface it rests on. */
	r: number;
	shape?: 'block' | 'ball';
	name?: string;
}
/** A fixed segment from a to b: floor, ceiling, wall or incline. Bodies touch it from either side. */
export interface Surface {
	id: string;
	a: Vec;
	b: Vec;
	/** Static and kinetic friction; one alone stands for both. */
	muS?: number;
	muK?: number;
	/** Restitution on landing, 0 by default. */
	e?: number;
	/** What it is in the editor, which decides how its ends can be dragged (src/lib/sandbox/edit.ts). */
	kind?: 'floor' | 'ceiling' | 'wall' | 'incline';
	/** It goes on past both ends without limit, along the same line: a floor nothing falls off. */
	endless?: boolean;
}
export interface Pulley {
	id: string;
	at: Vec;
	r: number;
}
export type RopeEnd = { body: string } | { point: Vec };
/** An ideal rope, taut at the start unless `length` says otherwise; it can pass over one fixed pulley. */
export interface Rope {
	id: string;
	from: RopeEnd;
	to: RopeEnd;
	/** `cw`: going from `from` to `to` the rope turns clockwise around the pulley. */
	via?: { pulley: string; wrap: 'cw' | 'ccw' };
	length?: number;
	/** The letter of its tension in the drawing, T by default. */
	name?: string;
}
export interface Scene {
	g: number;
	bodies: Body[];
	surfaces: Surface[];
	pulleys: Pulley[];
	ropes: Rope[];
	/** The window drawn, metres. */
	view: { x0: number; x1: number; y0: number; y1: number };
}

export interface State {
	t: number;
	pos: Vec[];
	vel: Vec[];
	/** The length of each rope. */
	lengths: number[];
	/** Why the simulation stopped, if it did. */
	ended?: 'pulley' | 'edge' | 'away';
}

export type ForceKind = 'weight' | 'tension' | 'normal' | 'friction';
export interface Force {
	kind: ForceKind;
	v: Vec;
	/** The rope or the surface it comes from. */
	of?: string;
	/** Friction only: static (the body does not slide) or kinetic. */
	static?: boolean;
}
export interface Solution {
	acc: Vec[];
	/** The forces on each body, the weight first. */
	forces: Force[][];
	/** The tension of each rope, 0 when slack. */
	tensions: number[];
}

const EPS = 1e-7;
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const norm = (a: Vec) => Math.hypot(a.x, a.y);
const ZERO: Vec = { x: 0, y: 0 };

// ---------------------------------------------------------------- geometry

/** Where the rope from P touches the pulley, arriving (`arrive`) or leaving, with the given wrap. */
function tangent(P: Vec, c: Vec, r: number, wrap: 'cw' | 'ccw', arrive: boolean) {
	const d = sub(P, c);
	const dist = norm(d);
	if (dist <= r) return null;
	const sign = (wrap === 'cw') === arrive ? -1 : 1;
	const phi = Math.atan2(d.y, d.x) + sign * Math.acos(r / dist);
	return { phi, T: { x: c.x + r * Math.cos(phi), y: c.y + r * Math.sin(phi) } };
}

/** A straight stretch of rope: from end `a` towards `b` (indices of bodies, -1 for a fixed point), `u` from a to b. */
interface Strand {
	a: number;
	b: number;
	u: Vec;
	l: number;
	from: Vec;
	to: Vec;
}
export interface RopeShape {
	length: number;
	strands: Strand[];
	/** The arc on the pulley, for the drawing. */
	arc?: { c: Vec; r: number; from: number; to: number; cw: boolean };
}

/** The path of a rope with the bodies at `pos`; null when a body is inside the pulley. */
export function ropeShape(scene: Scene, rope: Rope, pos: Vec[]): RopeShape | null {
	const end = (e: RopeEnd): [number, Vec] => {
		if ('point' in e) return [-1, e.point];
		const i = scene.bodies.findIndex((b) => b.id === e.body);
		return [i, pos[i]];
	};
	const [ia, P] = end(rope.from);
	const [ib, Q] = end(rope.to);
	const straight = (a: number, b: number, from: Vec, to: Vec): Strand => {
		const d = sub(to, from);
		const l = norm(d) || 1e-12;
		return { a, b, u: mul(d, 1 / l), l, from, to };
	};
	if (!rope.via) {
		const s = straight(ia, ib, P, Q);
		return { length: s.l, strands: [s] };
	}
	const pulley = scene.pulleys.find((p) => p.id === rope.via!.pulley);
	if (!pulley) return null;
	const cw = rope.via.wrap === 'cw';
	const tin = tangent(P, pulley.at, pulley.r, rope.via.wrap, true);
	const tout = tangent(Q, pulley.at, pulley.r, rope.via.wrap, false);
	if (!tin || !tout) return null;
	const TAU = 2 * Math.PI;
	const sweep = ((((cw ? tin.phi - tout.phi : tout.phi - tin.phi) % TAU) + TAU) % TAU);
	const s1 = straight(ia, -1, P, tin.T);
	const s2 = straight(ib, -1, Q, tout.T);
	return { length: s1.l + pulley.r * sweep + s2.l, strands: [s1, s2], arc: { c: pulley.at, r: pulley.r, from: tin.phi, to: tout.phi, cw } };
}

interface Touch {
	body: number;
	surface: number;
	/** Along the surface, from a to b. */
	t: Vec;
	/** Towards the body. */
	n: Vec;
	/** Distance of the body's edge from the surface. */
	gap: number;
	/** Where along the segment, 0 at a and 1 at b; always inside for an endless surface. */
	s: number;
}
function touch(scene: Scene, bi: number, si: number, p: Vec): Touch {
	const sf = scene.surfaces[si];
	const d = sub(sf.b, sf.a);
	const L = norm(d);
	const t = mul(d, 1 / L);
	const n0 = { x: -t.y, y: t.x };
	const rel = sub(p, sf.a);
	const h = dot(n0, rel);
	const side = h >= 0 ? 1 : -1;
	return { body: bi, surface: si, t, n: mul(n0, side), gap: Math.abs(h) - scene.bodies[bi].r, s: sf.endless ? 0.5 : dot(t, rel) / L };
}

/** The stretch of a surface that is drawn: its two ends, or for an endless one where its line crosses the window. */
export function span(scene: Scene, sf: Surface, margin = 0.3): [Vec, Vec] {
	if (!sf.endless) return [sf.a, sf.b];
	const d = sub(sf.b, sf.a);
	const { x0, x1, y0, y1 } = scene.view;
	let lo = -Infinity, hi = Infinity;
	for (const [p, q, from, to] of [[sf.a.x, d.x, x0 - margin, x1 + margin], [sf.a.y, d.y, y0 - margin, y1 + margin]]) {
		if (Math.abs(q) < 1e-12) {
			if (p < from || p > to) return [sf.a, sf.b];
			continue;
		}
		lo = Math.max(lo, Math.min((from - p) / q, (to - p) / q));
		hi = Math.min(hi, Math.max((from - p) / q, (to - p) / q));
	}
	return lo < hi ? [add(sf.a, mul(d, lo)), add(sf.a, mul(d, hi))] : [sf.a, sf.b];
}

// ---------------------------------------------------------------- linear algebra

/** Solves A x = b by elimination with pivoting; A is small and, with redundant constraints, barely regularised. */
function linsolve(A: number[][], b: number[]) {
	const n = b.length;
	const M = A.map((row, i) => [...row.map((x, j) => x + (i === j ? 1e-11 : 0)), b[i]]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		[M[c], M[p]] = [M[p], M[c]];
		const piv = M[c][c];
		if (Math.abs(piv) < 1e-14) continue;
		for (let r = c + 1; r < n; r++) {
			const k = M[r][c] / piv;
			if (k) for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j];
		}
	}
	const x = new Array<number>(n).fill(0);
	for (let r = n - 1; r >= 0; r--) {
		let s = M[r][n];
		for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j];
		x[r] = Math.abs(M[r][r]) < 1e-14 ? 0 : s / M[r][r];
	}
	return x;
}

/** One row of the constraints: what it measures (`jac`) and the force it puts on the bodies per unit of λ (`dir`). */
interface Row {
	jac: { i: number; v: Vec }[];
	dir: { i: number; v: Vec }[];
	rhs: number;
}
/** λ such that jac · (M⁻¹ (F + Σ λ dir)) = rhs for every row; `drive` is M⁻¹ F (or a velocity, or zero). */
function multipliers(scene: Scene, rows: Row[], drive: Vec[]) {
	const inv = scene.bodies.map((b) => 1 / b.m);
	const A = rows.map((r) => rows.map((c) => r.jac.reduce((s, j) => s + c.dir.filter((d) => d.i === j.i).reduce((q, d) => q + dot(j.v, d.v) * inv[j.i], 0), 0)));
	const b = rows.map((r) => r.rhs - r.jac.reduce((s, j) => s + dot(j.v, drive[j.i]), 0));
	return linsolve(A, b);
}
function applied(scene: Scene, rows: Row[], lambda: number[], base: Vec[]) {
	const out = base.map((p) => ({ ...p }));
	rows.forEach((r, k) => r.dir.forEach((d) => { out[d.i] = add(out[d.i], mul(d.v, lambda[k] / scene.bodies[d.i].m)); }));
	return out;
}

const ropeJac = (shape: RopeShape) => shape.strands.flatMap((s) => [{ i: s.a, v: s.u }, { i: s.b, v: mul(s.u, -1) }]).filter((j) => j.i >= 0);
/** How fast the rope gets shorter: positive when the bodies move towards it. */
const ropeRate = (shape: RopeShape, vel: Vec[]) => ropeJac(shape).reduce((s, j) => s + dot(j.v, vel[j.i]), 0);

// ---------------------------------------------------------------- the forces at one instant

interface Active {
	sol: Solution;
	/** Ropes that pull and contacts that push, with the friction mode of each contact. */
	ropes: { k: number; shape: RopeShape }[];
	contacts: { c: Touch; mode: 'static' | 'kinetic' | 'free'; sigma: number }[];
}

function friction(sf: Surface) {
	const muK = sf.muK ?? sf.muS ?? 0;
	return { muK, muS: Math.max(sf.muS ?? muK, muK) };
}

function solveActive(scene: Scene, st: State): Active {
	const n = scene.bodies.length;
	const gravity = scene.bodies.map(() => ({ x: 0, y: -scene.g }));

	let ropes: Active['ropes'] = [];
	scene.ropes.forEach((rope, k) => {
		const shape = ropeShape(scene, rope, st.pos);
		if (shape && Math.abs(shape.length - st.lengths[k]) < 1e-6 && ropeRate(shape, st.vel) < 1e-6) ropes.push({ k, shape });
	});
	let contacts: Active['contacts'] = [];
	for (let i = 0; i < n; i++)
		for (let s = 0; s < scene.surfaces.length; s++) {
			const c = touch(scene, i, s, st.pos[i]);
			if (Math.abs(c.gap) > 1e-6 || c.s < 0 || c.s > 1 || dot(c.n, st.vel[i]) > 1e-6) continue;
			const { muK, muS } = friction(scene.surfaces[s]);
			const vt = dot(c.t, st.vel[i]);
			if (Math.abs(vt) > EPS) contacts.push({ c, mode: muK > 0 ? 'kinetic' : 'free', sigma: -Math.sign(vt) });
			else contacts.push({ c, mode: muS > 0 ? 'static' : 'free', sigma: 0 });
		}

	for (let pass = 0; pass < 40; pass++) {
		const rows: Row[] = [];
		for (const { shape } of ropes) {
			const jac = ropeJac(shape);
			// The rope keeps its length: the centripetal term of each strand that turns.
			const rhs = shape.strands.reduce((sum, s) => {
				const vr = sub(s.a >= 0 ? st.vel[s.a] : ZERO, s.b >= 0 ? st.vel[s.b] : ZERO);
				const along = dot(vr, s.u);
				return sum + (dot(vr, vr) - along * along) / s.l;
			}, 0);
			rows.push({ jac, dir: jac, rhs });
		}
		const firstContact = rows.length;
		for (const { c, mode, sigma } of contacts) {
			const { muK } = friction(scene.surfaces[c.surface]);
			const push = mode === 'kinetic' ? add(c.n, mul(c.t, muK * sigma)) : c.n;
			rows.push({ jac: [{ i: c.body, v: c.n }], dir: [{ i: c.body, v: push }], rhs: 0 });
		}
		const firstStatic = rows.length;
		const statics = contacts.filter((x) => x.mode === 'static');
		for (const { c } of statics) rows.push({ jac: [{ i: c.body, v: c.t }], dir: [{ i: c.body, v: c.t }], rhs: 0 });

		const lambda = multipliers(scene, rows, gravity);

		// A rope cannot push and a surface cannot pull: drop the worst one and solve again.
		let worst = -1;
		for (let k = 0; k < firstStatic; k++) if (lambda[k] < -1e-9 && (worst < 0 || lambda[k] < lambda[worst])) worst = k;
		if (worst >= 0) {
			if (worst < firstContact) ropes = ropes.filter((_, k) => k !== worst);
			else contacts = contacts.filter((_, k) => k !== worst - firstContact);
			continue;
		}
		// Static friction holds up to μs N; beyond that the body slides against the force that was holding it.
		let slipped = false;
		statics.forEach((x, k) => {
			const N = lambda[firstContact + contacts.indexOf(x)];
			const f = lambda[firstStatic + k];
			if (!slipped && Math.abs(f) > friction(scene.surfaces[x.c.surface]).muS * N + 1e-9) {
				x.mode = 'kinetic';
				x.sigma = Math.sign(f);
				slipped = true;
			}
		});
		if (slipped) continue;

		const acc = applied(scene, rows, lambda, gravity);
		const forces: Force[][] = scene.bodies.map((b) => [{ kind: 'weight', v: { x: 0, y: -b.m * scene.g } }]);
		const tensions = scene.ropes.map(() => 0);
		ropes.forEach(({ k, shape }, row) => {
			tensions[k] = lambda[row];
			for (const s of shape.strands) {
				if (s.a >= 0) forces[s.a].push({ kind: 'tension', v: mul(s.u, lambda[row]), of: scene.ropes[k].id });
				if (s.b >= 0) forces[s.b].push({ kind: 'tension', v: mul(s.u, -lambda[row]), of: scene.ropes[k].id });
			}
		});
		contacts.forEach((x, k) => {
			const N = lambda[firstContact + k];
			const id = scene.surfaces[x.c.surface].id;
			forces[x.c.body].push({ kind: 'normal', v: mul(x.c.n, N), of: id });
			if (x.mode === 'kinetic') forces[x.c.body].push({ kind: 'friction', v: mul(x.c.t, friction(scene.surfaces[x.c.surface]).muK * x.sigma * N), of: id, static: false });
			if (x.mode === 'static') forces[x.c.body].push({ kind: 'friction', v: mul(x.c.t, lambda[firstStatic + statics.indexOf(x)]), of: id, static: true });
		});
		return { sol: { acc, forces, tensions }, ropes, contacts };
	}
	throw new Error('sandbox: the constraints did not settle');
}

/** Accelerations and forces with the scene in this state. */
export function solve(scene: Scene, st: State): Solution {
	return solveActive(scene, st).sol;
}

// ---------------------------------------------------------------- time

export function initial(scene: Scene): State {
	const pos = scene.bodies.map((b) => ({ ...b.pos }));
	return {
		t: 0,
		pos,
		vel: scene.bodies.map((b) => ({ ...(b.vel ?? ZERO) })),
		lengths: scene.ropes.map((r) => r.length ?? ropeShape(scene, r, pos)?.length ?? 0)
	};
}

const moved = (st: State, acc: Vec[], h: number) => st.pos.map((p, i) => add(p, add(mul(st.vel[i], h), mul(acc[i], (h * h) / 2))));

/** Brings positions back on the constraints that hold (`value` to zero), moving light bodies more than heavy ones. */
function settle(scene: Scene, pos: Vec[], cons: (pos: Vec[]) => { value: number; grad: { i: number; v: Vec }[] }[]) {
	let p = pos;
	for (let it = 0; it < 6; it++) {
		const cs = cons(p);
		if (!cs.length || cs.every((c) => Math.abs(c.value) < 1e-12)) break;
		const rows: Row[] = cs.map((c) => ({ jac: c.grad, dir: c.grad, rhs: -c.value }));
		p = applied(scene, rows, multipliers(scene, rows, p.map(() => ZERO)), p);
	}
	return p;
}

/** One uncut stretch of motion, at most `h` long; returns the new state and the time it covered. */
function stretch(scene: Scene, st: State, hMax: number): [State, number] {
	const { sol, ropes, contacts } = solveActive(scene, st);
	const acc = sol.acc;
	let h = hMax;
	let stop: Touch | null = null;
	let landing: Touch | null = null;
	let jerk = -1;

	// Friction brings a sliding body to rest: stop there, and let the next step decide whether it stays.
	for (const { c, mode } of contacts) {
		if (mode !== 'kinetic') continue;
		const vt = dot(c.t, st.vel[c.body]);
		const at = dot(c.t, acc[c.body]);
		if (vt * at < 0 && -vt / at < h) {
			h = -vt / at;
			stop = c;
		}
	}
	// A body in flight reaches a surface: the distance from it is a parabola in time.
	for (let i = 0; i < scene.bodies.length; i++)
		for (let s = 0; s < scene.surfaces.length; s++) {
			const c = touch(scene, i, s, st.pos[i]);
			if (c.gap <= 1e-6) continue;
			const A = dot(c.n, acc[i]) / 2;
			const B = dot(c.n, st.vel[i]);
			const C = c.gap;
			let root = Infinity;
			if (Math.abs(A) < 1e-14) root = B < 0 ? -C / B : Infinity;
			else {
				const disc = B * B - 4 * A * C;
				if (disc >= 0) {
					const q = Math.sqrt(disc);
					const r1 = (-B - q) / (2 * A), r2 = (-B + q) / (2 * A);
					root = Math.min(r1 > 1e-12 ? r1 : Infinity, r2 > 1e-12 ? r2 : Infinity);
				}
			}
			if (root >= h) continue;
			const at = touch(scene, i, s, moved(st, acc, root)[i]);
			if (at.s < 0 || at.s > 1) continue;
			h = root;
			landing = at;
			stop = null;
		}
	// A slack rope runs out: find when by bisection along the same motion.
	scene.ropes.forEach((rope, k) => {
		if (ropes.some((r) => r.k === k)) return;
		const slack = (tau: number) => st.lengths[k] - (ropeShape(scene, rope, moved(st, acc, tau))?.length ?? 0);
		if (slack(0) < 1e-6 || slack(h) >= 0) return;
		let lo = 0, hi = h;
		for (let it = 0; it < 50; it++) {
			const midT = (lo + hi) / 2;
			if (slack(midT) > 0) lo = midT;
			else hi = midT;
		}
		h = hi;
		jerk = k;
		stop = null;
		landing = null;
	});

	// A body that slides into another surface (the floor at the foot of an incline) has reached the end of its run:
	// passing from one surface to the next is not there yet.
	const corner = !!landing && contacts.some((x) => x.c.body === (landing as Touch).body);
	if (corner) landing = null;

	let pos = moved(st, acc, h);
	let vel = st.vel.map((v, i) => add(v, mul(acc[i], h)));
	// On a rope that turns the forces change along the stretch: average the acceleration at its two ends.
	if (ropes.length && !stop && !landing && jerk < 0 && h > 1e-9) {
		const end = solveActive(scene, { ...st, pos, vel }).sol.acc;
		vel = st.vel.map((v, i) => add(v, mul(add(acc[i], end[i]), h / 2)));
	}

	// The constraints that hold after the stretch: what was pulling or pushing, plus the rope or the surface just met.
	const holdRopes = [...ropes.map((r) => r.k), ...(jerk >= 0 ? [jerk] : [])];
	const holdTouch = [...contacts.map((x) => x.c), ...(landing ? [landing as Touch] : [])];
	pos = settle(scene, pos, (p) => [
		...holdRopes.flatMap((k) => {
			const shape = ropeShape(scene, scene.ropes[k], p);
			return shape ? [{ value: st.lengths[k] - shape.length, grad: ropeJac(shape) }] : [];
		}),
		...holdTouch.map((c) => {
			const now = touch(scene, c.body, c.surface, p[c.body]);
			return { value: now.gap, grad: [{ i: c.body, v: now.n }] };
		})
	]);
	if (landing) {
		const c = landing as Touch;
		const vn = dot(c.n, vel[c.body]);
		if (vn < 0) vel[c.body] = sub(vel[c.body], mul(c.n, (1 + (scene.surfaces[c.surface].e ?? 0)) * vn));
	}
	if (stop) {
		const c = stop as Touch;
		vel[c.body] = sub(vel[c.body], mul(c.t, dot(c.t, vel[c.body])));
	}
	// Velocities too: nothing moves into a surface or stretches a rope (a rope that goes taut gives an inelastic tug).
	const rows: Row[] = [
		...holdRopes.flatMap((k) => {
			const shape = ropeShape(scene, scene.ropes[k], pos);
			if (!shape) return [];
			const jac = ropeJac(shape);
			// A rope only pulls: after a landing or a tug, bodies that come towards it are left alone and it goes slack.
			return (landing || k === jerk) && ropeRate(shape, vel) >= 0 ? [] : [{ jac, dir: jac, rhs: 0 }];
		}),
		...contacts.map((x) => {
			const now = touch(scene, x.c.body, x.c.surface, pos[x.c.body]);
			return { jac: [{ i: x.c.body, v: now.n }], dir: [{ i: x.c.body, v: now.n }], rhs: 0 };
		})
	];
	if (rows.length) vel = applied(scene, rows, multipliers(scene, rows, vel), vel);

	const next: State = { t: st.t + h, pos, vel, lengths: st.lengths };
	if (corner) next.ended = 'edge';
	// A body that slides off the end of a surface flies, unless another surface is in its way there.
	for (const { c } of contacts) {
		const now = touch(scene, c.body, c.surface, pos[c.body]);
		if (now.s >= 0 && now.s <= 1) continue;
		const blocked = scene.surfaces.some((_, s) => {
			if (s === c.surface) return false;
			const other = touch(scene, c.body, s, pos[c.body]);
			return other.gap < -1e-6 && other.s >= 0 && other.s <= 1;
		});
		if (blocked) next.ended = 'edge';
	}
	scene.ropes.forEach((rope) => {
		const shape = ropeShape(scene, rope, pos);
		if (!shape) next.ended = 'pulley';
		else if (rope.via) for (const s of shape.strands) if (s.a >= 0 && s.l < scene.bodies[s.a].r) next.ended = 'pulley';
	});
	const { x0, x1, y0, y1 } = scene.view;
	const far = Math.max(x1 - x0, y1 - y0);
	if (pos.some((p) => p.x < x0 - far || p.x > x1 + far || p.y < y0 - far || !Number.isFinite(p.x + p.y))) next.ended = 'away';
	return [next, h];
}

/** The state `dt` seconds later. Long stretches are split so that a swinging rope stays accurate. */
export function advance(scene: Scene, st: State, dt: number, maxStep = 1 / 600): State {
	let now = st;
	let left = dt;
	for (let guard = 0; left > 1e-12 && !now.ended && guard < 100000; guard++) {
		const [next, h] = stretch(scene, now, Math.min(left, maxStep));
		now = next;
		left -= h;
		if (h < 1e-13) left -= 1e-9; // an event at this very instant: handled, move on
	}
	return now.ended ? now : { ...now, t: st.t + dt };
}

/** For the drawing: the direction away from the surface each body rests on, or null in the air. */
export function resting(scene: Scene, pos: Vec[]): (Vec | null)[] {
	return scene.bodies.map((_, i) => {
		for (let s = 0; s < scene.surfaces.length; s++) {
			const c = touch(scene, i, s, pos[i]);
			if (Math.abs(c.gap) < 1e-4 && c.s >= 0 && c.s <= 1) return c.n;
		}
		return null;
	});
}

/** Kinetic and potential energy of the whole scene, joules; heights from y = 0. */
export function energy(scene: Scene, st: State) {
	let kinetic = 0, potential = 0;
	scene.bodies.forEach((b, i) => {
		kinetic += (b.m * dot(st.vel[i], st.vel[i])) / 2;
		potential += b.m * scene.g * st.pos[i].y;
	});
	return { kinetic, potential };
}
