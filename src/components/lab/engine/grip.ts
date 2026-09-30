import { Matrix4, Quaternion, Vector3 } from 'three';
import { handQuat, segFrames, SHAPES, type Chain, type FingerAngles, type Grip, type Shape, type Side, type ThumbAngles } from './grasp';
import TABLE from './grips.json';

/*
 * Grip synthesis: a few parameters that describe a grip the way a person would, and a solver that turns them into
 * the wrist's place on the object and every joint of the fingers.
 *
 * A grip has a type from the human grasp taxonomy (Feix et al., "The GRASP Taxonomy of Human Grasp Types", IEEE
 * THMS 2016): a precision grip holds a beaker or a flask with the finger pads and leaves room between the palm and
 * the glass; a power grip wraps the whole hand round something large; a tripod holds a rod like a pen.
 *
 * The parameters place the palm (height on the object, distance from the surface, tilt and roll of the hand) and
 * say where the pads land (how far round the object the fingers and the thumb reach, how many fingers touch). Each
 * finger is then solved on its own, by damped least squares (Levenberg-Marquardt) on three numbers: knuckle
 * flexion, middle-joint flexion and spread. The last joint follows the middle one at two thirds, as it does in a real
 * finger, and the fingers that do not touch curl together by one amount: the hand moves in a few coordinated
 * patterns, not twenty independent joints (Santello, Flanders, Soechting, "Postural hand synergies for tool use",
 * J Neurosci 1998). Every glove vertex a finger carries is kept out of the object's surface.
 */

export type GripType = 'precision' | 'power' | 'tripod';

export type GripSpec = {
	type: GripType;
	/** Height on the object of the palm's centre (precision, power) or of the pinch (tripod), metres. */
	height: number;
	/** Palm to surface, metres: the hand's depth towards the object. */
	gap: number;
	/** The hand moved along the fingers in the horizontal plane, metres: back (−) puts the object under the fingers. */
	slide: number;
	/** Fingers tilted down (+) or up round the palm's normal, degrees; for a tripod the rod's angle to the hand. */
	tilt: number;
	/** Palm turned towards the floor (+) or the sky, round the fingers' direction, degrees. */
	roll: number;
	/** How far round the object the finger pads land, from the palm's side, degrees. */
	wrap: number;
	/** How far round the other way the thumb lands, degrees. */
	thumbWrap: number;
	/** The thumb's pad below (+) the index's, metres. */
	thumbDrop: number;
	/** Each finger lands this much less far round than the one before, degrees. */
	fan: number;
	/** How many fingers touch, from the index. */
	fingers: number;
	/** How much the fingers that do not touch curl, 0 to 1. */
	tuck: number;
};

export const DEFAULTS: Record<GripType, Omit<GripSpec, 'type' | 'height'>> = {
	precision: { gap: 0.012, slide: -0.047, tilt: 15, roll: 0, wrap: 88, thumbWrap: 138, thumbDrop: 0.004, fan: 4, fingers: 3, tuck: 0.6 },
	power: { gap: 0.004, slide: -0.01, tilt: 0, roll: 0, wrap: 150, thumbWrap: 120, thumbDrop: 0.012, fan: 4, fingers: 4, tuck: 0.8 },
	tripod: { gap: 0, slide: 0, tilt: 45, roll: 0, wrap: 0, thumbWrap: 0, thumbDrop: 0, fan: 0, fingers: 2, tuck: 0.75 }
};

const saved = TABLE as Record<string, GripSpec>;

/**
 * The grip for an object: the saved one (the playground writes them), or one made for its shape.
 *
 * The precision grip's rules come from the beaker's grip as tuned by eye in the playground (30 September 2026): the
 * hand sits back so that the object is under the fingers, not the palm (slide = radius + 21 mm), the palm 12 mm off,
 * the grip a third of the way up a vessel, the thumb far round the other side (138°, opposite the fingers across the
 * centre), fingers tilted 15° down, the little finger tucked in on small vessels.
 */
export function specFor(name: string, variant = ''): GripSpec | null {
	const key = variant ? `${name}@${variant}` : name;
	if (saved[key]) return { ...saved[key] };
	if (saved[name]) return { ...saved[name] };
	return autoSpec(name);
}

/**
 * The saved key of a grip: `Name`, `Name@variant` for an action's grip, and `~2`, `~3`… after either for the
 * alternatives, other ways of taking the same object for the same purpose, one of which the game picks at each grasp.
 */
export const GRIP_KEY = /^([A-Za-z0-9]+)(?:@([a-z]+))?(?:~(\d+))?$/;

export function gripKey(name: string, variant = '', alt = 1) {
	return `${name}${variant ? `@${variant}` : ''}${alt > 1 ? `~${alt}` : ''}`;
}

/** Every saved grip of an object for a purpose, alternatives included, in a table (grips.json's shape). */
export function alternatives(table: Record<string, GripSpec>, name: string, variant = ''): { key: string; alt: number; spec: GripSpec }[] {
	const out: { key: string; alt: number; spec: GripSpec }[] = [];
	for (const [key, spec] of Object.entries(table)) {
		const m = GRIP_KEY.exec(key);
		if (!m || m[1] !== name || (m[2] ?? '') !== variant) continue;
		out.push({ key, alt: m[3] ? Number(m[3]) : 1, spec });
	}
	return out.sort((a, b) => a.alt - b.alt);
}

/** The grip for one grasp: one of the saved alternatives at random, or the grip `specFor` gives. */
export function pickSpec(name: string, variant = '', rnd: () => number = Math.random): GripSpec | null {
	let alts = alternatives(saved, name, variant);
	if (!alts.length && variant) alts = alternatives(saved, name);
	if (!alts.length) return specFor(name, variant);
	return { ...alts[Math.floor(rnd() * alts.length) % alts.length].spec };
}

/**
 * Objects taken in more than one way: the variant's grip is saved as `Name@variant` in grips.json. The game asks for
 * one when an action needs it (pouring, stirring, drawing liquid up); without a saved variant it uses the main grip.
 */
export const VARIANTS: Record<string, { id: string; label: string }[]> = {
	Beaker: [{ id: 'versa', label: 'per versare' }],
	AcidBeaker: [{ id: 'versa', label: 'per versare' }],
	ConicalFlask: [{ id: 'versa', label: 'per versare' }],
	GlassRod: [{ id: 'mescola', label: 'per mescolare' }],
	Pipette: [{ id: 'aspira', label: 'per aspirare con la propipetta' }],
	Spatula: [{ id: 'preleva', label: 'per prelevare la polvere' }],
	Lighter: [{ id: 'accendi', label: 'per accendere' }]
};

/** The grip made from the shape alone, before any tuning. */
export function autoSpec(name: string): GripSpec | null {
	const shape = SHAPES[name];
	if (!shape) return null;
	const type: GripType = shape.kind === 'pen' || shape.kind === 'pinch' ? 'tripod' : shape.radius(shape.grip) > 0.045 ? 'power' : 'precision';
	const spec: GripSpec = { type, height: shape.grip, ...DEFAULTS[type] };
	if (type === 'precision') {
		const vessel = shape.grip < (shape.y1 - shape.y0) * 0.6;
		if (vessel) spec.height = shape.y0 + (shape.y1 - shape.y0) / 3;
		const r = shape.radius(spec.height);
		spec.slide = -(r + 0.021);
		spec.fingers = r < 0.03 ? 3 : 4;
	}
	return spec;
}

/** What the solver needs of a hand, in its hand bone's frame. */
export type HandGeo = {
	side: Side;
	chains: Chain[];
	thumb: Chain;
	/** Palm point (the centre of the palm's surface). */
	palm: Vector3;
	/** Palm and thumb-ball vertices. */
	palmVerts: Vector3[];
};

export type GripResult = {
	grip: Grip;
	angles: FingerAngles;
	/** Distance from each pad to its target, metres (index, middle, ring, little, thumb); NaN if the finger does not touch. */
	miss: number[];
	/** Glove vertices inside the object, and the deepest, metres. */
	inside: number;
	depth: number;
	/** Where the pads were sent, in the object's frame (for the playground). */
	targets: Vector3[];
	/** The grip as chosen before any variation, and where round the object: to vary it again while held. */
	choice?: GripChoice;
};

export type GripChoice = { name: string; spec: GripSpec; phi: number; up: 1 | -1 };

const D = Math.PI / 180;
const Y = new Vector3(0, 1, 0);
const ONE = new Vector3(1, 1, 1);
/** The pad point is the middle of a curved patch of skin, a little under its surface: targets sit this far out. */
const SKIN = 0.0025;

// ---------------------------------------------------------------------------------------------
// the hand's geometry, once per hand

type Finger = { chain: Chain; pad: Vector3; samples: Vector3[][] };

const cache = new WeakMap<Chain, Finger>();

/** The pad of a finger's last segment (the middle of its palm-side skin) and a few vertices of each segment. */
function finger(chain: Chain): Finger {
	let f = cache.get(chain);
	if (f) return f;
	const vs = chain.verts?.[2] ?? [];
	let pad = new Vector3(0, chain.tip * 0.55, 0.007);
	if (vs.length > 8) {
		const ys = vs.map((v) => v.y);
		const y0 = Math.min(...ys);
		const y1 = Math.max(...ys);
		const band = vs.filter((v) => v.y > y0 + (y1 - y0) * 0.3 && v.y < y0 + (y1 - y0) * 0.8);
		const zs = band.map((v) => v.z).sort((a, b) => a - b);
		const z0 = zs[Math.floor(zs.length * 0.75)];
		const top = band.filter((v) => v.z >= z0);
		pad = top.reduce((a, v) => a.add(v), new Vector3()).divideScalar(top.length);
	}
	const samples = (chain.verts ?? [[], [], []]).map((seg) => seg.filter((_, i) => i % Math.max(1, Math.floor(seg.length / 28)) === 0));
	f = { chain, pad, samples };
	cache.set(chain, f);
	return f;
}

/** A finger's joints from the solver's three numbers: the last joint follows the middle one. */
const fingerAngles = (x: number[]) => [x[0], x[1], x[1] * 0.67, x[2]];
/** The thumb's from its four: opposition roll, palmar abduction, base flexion, middle flexion; the last follows at 0.8. */
const thumbAngles = (x: number[]): ThumbAngles => [x[0], x[2], x[3], x[3] * 0.8, x[1]];

// ---------------------------------------------------------------------------------------------
// Levenberg-Marquardt on a few bounded parameters, with a numeric Jacobian

function lm(res: (x: number[]) => number[], x0: number[], lo: number[], hi: number[], iters = 40) {
	let x = x0.slice();
	let r = res(x);
	let cost = r.reduce((a, v) => a + v * v, 0);
	let lambda = 1e-3;
	const n = x.length;
	for (let it = 0; it < iters; it++) {
		const J: number[][] = [];
		for (let j = 0; j < n; j++) {
			const h = 1e-4;
			const xp = x.slice();
			// a forward step, or a backward one at the upper bound
			xp[j] = x[j] + h <= hi[j] ? x[j] + h : x[j] - h;
			const rp = res(xp);
			J.push(rp.map((v, i) => (v - r[i]) / (xp[j] - x[j])));
		}
		// (JᵀJ + λ diag) dx = -Jᵀr
		const A = Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => J[a].reduce((s, v, i) => s + v * J[b][i], 0)));
		const g = Array.from({ length: n }, (_, a) => J[a].reduce((s, v, i) => s + v * r[i], 0));
		let improved = false;
		for (let tries = 0; tries < 8 && !improved; tries++) {
			const M = A.map((row, a) => row.map((v, b) => (a === b ? v * (1 + lambda) + 1e-9 : v)));
			const dx = solve(M, g.map((v) => -v));
			const xn = x.map((v, j) => Math.min(hi[j], Math.max(lo[j], v + dx[j])));
			const rn = res(xn);
			const cn = rn.reduce((a, v) => a + v * v, 0);
			if (cn < cost) {
				x = xn;
				r = rn;
				lambda = Math.max(1e-7, lambda / 3);
				cost = cn;
				improved = true;
			} else lambda *= 4;
		}
		if (!improved) break;
	}
	return { x, cost };
}

function solve(A: number[][], b: number[]) {
	const n = b.length;
	const M = A.map((row, i) => [...row, b[i]]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
		[M[c], M[p]] = [M[p], M[c]];
		const d = M[c][c] || 1e-12;
		for (let r = 0; r < n; r++) {
			if (r === c) continue;
			const f = M[r][c] / d;
			for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
		}
	}
	return M.map((row, i) => row[n] / (row[i] || 1e-12));
}

// ---------------------------------------------------------------------------------------------
// placing the hand

/** Hand bone frame in the object's frame, for a precision or power grip at azimuth `phi` with the thumb side `up`. */
function placeRound(spec: GripSpec, shape: Shape, hand: HandGeo, phi: number, up: 1 | -1) {
	const mirror = hand.side === 'L' ? -1 : 1;
	const u = new Vector3(Math.cos(phi), 0, Math.sin(phi));
	let N = u.clone().negate();
	let Xs = new Vector3(0, up * mirror, 0);
	let F = new Vector3().crossVectors(N, Xs);
	// tilt round the palm's normal, roll round the fingers
	const tq = new Quaternion().setFromAxisAngle(N, -spec.tilt * D * up * mirror);
	F.applyQuaternion(tq);
	Xs.applyQuaternion(tq);
	const rq = new Quaternion().setFromAxisAngle(F, spec.roll * D * up);
	N = N.applyQuaternion(rq);
	Xs = Xs.applyQuaternion(rq);
	F = F.normalize();
	const q = handQuat(F, N);
	const along = F.clone().setY(0);
	if (along.lengthSq() > 1e-8) along.normalize();
	const P = u
		.clone()
		.multiplyScalar(shape.radius(spec.height) + spec.gap)
		.addScaledVector(along, spec.slide ?? 0)
		.setY(spec.height);
	return { q, P, u, F };
}

/** Pushes the palm out along `u` until every palm vertex is at least `gap` off the surface. */
function clearPalm(q: Quaternion, P: Vector3, u: Vector3, shape: Shape, hand: HandGeo, gap: number) {
	const m = new Matrix4();
	const w = new Vector3();
	const worst = (P2: Vector3) => {
		m.compose(P2.clone().sub(hand.palm.clone().applyQuaternion(q)), q, ONE);
		let pen = -Infinity;
		for (const v of hand.palmVerts) {
			w.copy(v).applyMatrix4(m);
			if (w.y < shape.y0 || w.y > shape.y1) continue;
			pen = Math.max(pen, shape.radius(w.y) - Math.hypot(w.x, w.z));
		}
		return pen;
	};
	let push = 0;
	for (let k = 0; k < 30 && worst(P.clone().addScaledVector(u, push)) > -gap; k++) push += 0.002;
	return P.clone().addScaledVector(u, push);
}

// ---------------------------------------------------------------------------------------------

/**
 * Solves a grip: the wrist's place and every finger. `phi` is where round the object the palm goes and `up` which
 * way the thumb's side faces (for a tripod `phi` turns the hand round the rod).
 */
export function solveGrip(name: string, spec: GripSpec, hand: HandGeo, phi: number, up: 1 | -1 = 1): GripResult | null {
	const shape = SHAPES[name];
	if (!shape) return null;
	return spec.type === 'tripod' ? solveTripod(spec, shape, hand, phi) : solveRound(spec, shape, hand, phi, up);
}

/** The hand bone's matrix in the object's frame, from the grip's palm point and rotation. */
function boneInObject(P: Vector3, q: Quaternion, hand: HandGeo) {
	return new Matrix4().compose(P.clone().sub(hand.palm.clone().applyQuaternion(q)), q, ONE);
}

function solveRound(spec: GripSpec, shape: Shape, hand: HandGeo, phi: number, up: 1 | -1): GripResult {
	const place = placeRound(spec, shape, hand, phi, up);
	const P = clearPalm(place.q, place.P, place.u, shape, hand, spec.gap);
	const toObj = boneInObject(P, place.q, hand);
	const toHand = toObj.clone().invert();
	const horiz = place.F.clone().setY(0);
	if (horiz.lengthSq() < 1e-6) horiz.copy(new Vector3(-place.u.z, 0, place.u.x));
	horiz.normalize();
	const surface = (dir: Vector3, y: number) => dir.clone().multiplyScalar(shape.radius(Math.min(shape.y1, Math.max(shape.y0, y))) + SKIN).setY(y);
	const angles: FingerAngles = { f: [], t: [0, 0, 0, 0, 0] };
	const miss: number[] = [];
	const targets: Vector3[] = [];
	const pen = penetration(shape, toObj);
	hand.chains.forEach((chain, i) => {
		const fg = finger(chain);
		const mcp = chain.pos[0].clone().applyMatrix4(toObj);
		if (i >= spec.fingers) {
			angles.f.push(tuck(fg, spec.tuck, [0, -2, -4, -6][i] * D, pen));
			miss.push(NaN);
			return;
		}
		const w = (spec.wrap - spec.fan * i) * D;
		const dir = place.u.clone().multiplyScalar(Math.cos(w)).addScaledVector(horiz, Math.sin(w));
		const onObj = surface(dir, mcp.y);
		targets.push(onObj);
		const target = onObj.clone().applyMatrix4(toHand);
		const r = reach(fg, target, false, pen);
		angles.f.push(fingerAngles(r.x) as [number, number, number, number]);
		miss.push(r.miss);
	});
	// the thumb, round the other side and a little below the index
	const idx = hand.chains[0].pos[0].clone().applyMatrix4(toObj);
	const tw = spec.thumbWrap * D;
	const tdir = place.u.clone().multiplyScalar(Math.cos(tw)).addScaledVector(horiz, -Math.sin(tw));
	const ty = idx.y - spec.thumbDrop * Math.sign(new Vector3(1, 0, 0).applyQuaternion(place.q).y * (hand.side === 'L' ? -1 : 1) || 1);
	const tObj = surface(tdir, ty);
	targets.push(tObj);
	const tt = tObj.clone().applyMatrix4(toHand);
	const th = reach(finger(hand.thumb), tt, true, pen);
	angles.t = thumbAngles(th.x);
	miss.push(th.miss);
	const grip: Grip = { p: P, q: place.q, shape, curl: 0 };
	const count = countInside(hand, angles, shape, toObj);
	return { grip, angles, miss, targets, ...count };
}

/** A pen's grip: the rod runs between the pads of thumb, index and middle, and back over the web of the thumb. */
function solveTripod(spec: GripSpec, shape: Shape, hand: HandGeo, phi: number): GripResult {
	const fi = finger(hand.chains[0]);
	const fm = finger(hand.chains[1]);
	const ft = finger(hand.thumb);
	const rest = {
		i: [38 * D, 42 * D, 0],
		m: [46 * D, 48 * D, 0],
		t: [30 * D, 15 * D, 18 * D, 22 * D]
	};
	const padAt = (fg: Finger, x: number[], thumb: boolean) => fg.pad.clone().applyMatrix4(segFrames(fg.chain, thumb ? thumbAngles(x) : fingerAngles(x), thumb)[2]);
	const pi = padAt(fi, rest.i, false);
	const pt = padAt(ft, rest.t, true);
	const pm = padAt(fm, rest.m, false);
	const A = pi.clone().lerp(pt, 0.5);
	const thumbBase = hand.thumb.pos[1].clone().applyMatrix4(new Matrix4().compose(hand.thumb.pos[0], hand.thumb.rot[0], ONE));
	const sx = Math.sign(thumbBase.x) || 1;
	const t = spec.tilt * D;
	// the rod's upper end, in the hand bone's frame: back over the web, towards the thumb's side
	const axis = new Vector3(0.3 * sx, -Math.cos(t), -Math.sin(t)).normalize();
	const oq = new Quaternion().setFromUnitVectors(Y, axis).multiply(new Quaternion().setFromAxisAngle(Y, phi));
	const op = A.clone().addScaledVector(axis, -spec.height);
	const objInHand = new Matrix4().compose(op, oq, ONE);
	const toObj = objInHand.clone().invert();
	const pen = penetration(shape, toObj);
	const r = shape.radius(spec.height);
	const targets: Vector3[] = [];
	const onRod = (p: Vector3) => {
		const c = A.clone().addScaledVector(axis, p.clone().sub(A).dot(axis));
		const d = p.clone().sub(c);
		if (d.lengthSq() < 1e-10) d.set(0, 0, 1);
		return c.addScaledVector(d.normalize(), r + SKIN);
	};
	const angles: FingerAngles = { f: [], t: [0, 0, 0, 0, 0] };
	const miss: number[] = [];
	const ri = reach(fi, onRod(pi), false, pen, rest.i);
	const rm = reach(fm, onRod(pm), false, pen, rest.m);
	angles.f.push(fingerAngles(ri.x) as [number, number, number, number], fingerAngles(rm.x) as [number, number, number, number]);
	miss.push(ri.miss, rm.miss);
	for (let i = 2; i < 4; i++) {
		angles.f.push(tuck(finger(hand.chains[i]), spec.tuck, [0, -2, -4, -6][i] * D, pen));
		miss.push(NaN);
	}
	for (const p of [pi, pm, pt]) targets.push(onRod(p).applyMatrix4(toObj));
	const rt = reach(ft, onRod(pt), true, pen, rest.t);
	angles.t = thumbAngles(rt.x);
	miss.push(rt.miss);
	// the grip: the hand in the object's frame, palm point P
	const q = oq.clone().invert();
	const P = hand.palm.clone().applyMatrix4(toObj);
	const count = countInside(hand, angles, shape, toObj);
	return { grip: { p: P, q, shape, curl: 0 }, angles, miss, targets, ...count };
}

// ---------------------------------------------------------------------------------------------

/** How deep a point of the hand bone's frame is inside the object (positive inside). */
function penetration(shape: Shape, toObj: Matrix4) {
	const w = new Vector3();
	return (p: Vector3) => {
		w.copy(p).applyMatrix4(toObj);
		if (w.y < shape.y0 || w.y > shape.y1) return -1;
		return shape.radius(w.y) - Math.hypot(w.x, w.z);
	};
}

/** Bends a finger (or the thumb) so that its pad reaches `target`, keeping every vertex it carries outside. */
function reach(fg: Finger, target: Vector3, thumb: boolean, pen: (p: Vector3) => number, start?: number[]) {
	const lo = thumb ? [-30 * D, -15 * D, -30 * D, -20 * D] : [-15 * D, 0, -20 * D];
	const hi = thumb ? [60 * D, 90 * D, 60 * D, 80 * D] : [95 * D, 110 * D, 20 * D];
	const x0 = start ?? (thumb ? [20 * D, 20 * D, 10 * D, 20 * D] : [30 * D, 40 * D, 0]);
	const p = new Vector3();
	const res = (x: number[]) => {
		const fr = segFrames(fg.chain, thumb ? thumbAngles(x) : fingerAngles(x), thumb);
		p.copy(fg.pad).applyMatrix4(fr[2]);
		const out = [p.x - target.x, p.y - target.y, p.z - target.z];
		for (let s = 0; s < 3; s++)
			for (const v of fg.samples[s]) {
				const d = pen(p.copy(v).applyMatrix4(fr[s]));
				out.push(d > 0.0005 ? (d - 0.0005) * 4 : 0);
			}
		// a slight preference for no spread and no roll
		if (!thumb) out.push(x[2] * 0.004);
		return out;
	};
	// a few starts, the best solution wins: the surface makes the problem full of local minima
	const starts = thumb ? [x0, [0, 40 * D, 20 * D, 30 * D], [40 * D, 10 * D, 0, 40 * D], [50 * D, 50 * D, 30 * D, 10 * D]] : [x0, [15 * D, 70 * D, 0], [55 * D, 55 * D, 0], [70 * D, 20 * D, 0], [10 * D, 100 * D, 0]];
	let x = x0;
	let best = Infinity;
	for (const s0 of starts) {
		const r = lm(res, s0, lo, hi);
		if (r.cost < best - 1e-9) {
			best = r.cost;
			x = r.x;
		}
	}
	const fr = segFrames(fg.chain, thumb ? thumbAngles(x) : fingerAngles(x), thumb);
	return { x, miss: fg.pad.clone().applyMatrix4(fr[2]).distanceTo(target) };
}

/** A finger that does not touch: curled by `k` of a full curl, less if it would go into the object. */
function tuck(fg: Finger, k: number, spread: number, pen: (p: Vector3) => number): [number, number, number, number] {
	const at = (c: number) => [70 * D * c, 85 * D * c, 85 * D * c * 0.67, spread];
	const clear = (c: number) => {
		const fr = segFrames(fg.chain, at(c), false);
		const p = new Vector3();
		for (let s = 0; s < 3; s++) for (const v of fg.samples[s]) if (pen(p.copy(v).applyMatrix4(fr[s])) > 0) return false;
		return true;
	};
	let c = k;
	while (c > 0 && !clear(c)) c -= 0.05;
	return at(Math.max(0, c)) as [number, number, number, number];
}

/** Glove vertices of the fingers and palm inside the object, for the playground's readout. */
function countInside(hand: HandGeo, angles: FingerAngles, shape: Shape, toObj: Matrix4) {
	const pen = penetration(shape, toObj);
	let inside = 0;
	let depth = 0;
	const p = new Vector3();
	const add = (d: number) => {
		if (d > 0.001) {
			inside++;
			depth = Math.max(depth, d);
		}
	};
	for (const v of hand.palmVerts) add(pen(p.copy(v)));
	hand.chains.forEach((chain, i) => {
		const fr = segFrames(chain, angles.f[i], false);
		(chain.verts ?? []).forEach((seg, s) => seg.forEach((v) => add(pen(p.copy(v).applyMatrix4(fr[s])))));
	});
	const ft = segFrames(hand.thumb, angles.t, true);
	(hand.thumb.verts ?? []).forEach((seg, s) => seg.forEach((v) => add(pen(p.copy(v).applyMatrix4(ft[s])))));
	return { inside, depth };
}

/**
 * The grip the game uses: the saved spec (or the default), placed where round the object the hand is most comfortable
 * (a hand rotation in world space), then solved.
 */
export function synthesize(name: string, hand: HandGeo, objectQ: Quaternion, comfort: Quaternion, variant = '', vary = false): GripResult | null {
	const chosen = vary ? pickSpec(name, variant) : specFor(name, variant);
	const shape = SHAPES[name];
	if (!chosen || !shape) return null;
	// a little different at every grasp (JITTER); if the variation sinks the glove into the object, the grip as tuned
	const varied = vary ? jitter(chosen) : null;
	const spec = varied ? varied.spec : chosen;
	let best: { phi: number; up: 1 | -1 } | null = null;
	let bestCost = Infinity;
	const wq = new Quaternion();
	const tries = spec.type === 'tripod' ? 24 : 16;
	for (let k = 0; k < tries; k++) {
		const phi = (k / tries) * Math.PI * 2;
		for (const up of spec.type === 'tripod' ? ([1] as const) : ([1, -1] as const)) {
			const q = spec.type === 'tripod' ? tripodFrame(spec, hand, phi) : placeRound(spec, shape, hand, phi, up).q;
			const cost = wq.copy(objectQ).multiply(q).angleTo(comfort);
			if (cost < bestCost) {
				bestCost = cost;
				best = { phi, up };
			}
		}
	}
	if (!best) return null;
	const choice: GripChoice = { name, spec: chosen, phi: best.phi, up: best.up };
	if (!varied) {
		const r = solveGrip(name, chosen, hand, best.phi, best.up);
		return r && { ...r, choice };
	}
	return solveVaried(choice, hand, varied);
}

/**
 * The same grip varied again (JITTER): the fingers settling on an object already held. If the variation sinks the
 * glove into the object, the grip as tuned.
 */
export function revary(choice: GripChoice, hand: HandGeo, rnd: () => number = Math.random): GripResult | null {
	return solveVaried(choice, hand, jitter(choice.spec, rnd));
}

function solveVaried(choice: GripChoice, hand: HandGeo, varied: { spec: GripSpec; dphi: number }) {
	const { name, spec, phi, up } = choice;
	let r = solveGrip(name, varied.spec, hand, phi + varied.dphi, up);
	if (r && (r.inside > 2 || r.depth > 0.0015)) r = solveGrip(name, spec, hand, phi, up);
	return r && { ...r, choice };
}

/** Just the hand's rotation in the object's frame for a tripod at `phi` (for choosing it; the solve does the rest). */
function tripodFrame(spec: GripSpec, hand: HandGeo, phi: number) {
	const thumbBase = hand.thumb.pos[1].clone().applyMatrix4(new Matrix4().compose(hand.thumb.pos[0], hand.thumb.rot[0], ONE));
	const sx = Math.sign(thumbBase.x) || 1;
	const t = spec.tilt * D;
	const axis = new Vector3(0.3 * sx, -Math.cos(t), -Math.sin(t)).normalize();
	return new Quaternion().setFromUnitVectors(Y, axis).multiply(new Quaternion().setFromAxisAngle(Y, phi)).invert();
}


/**
 * How much a grip changes from one grasp to the next, so the same hand never closes twice the same way: where on the
 * object it lands, the fingers' tilt, and the fingers that do not touch. What makes the grip right (depth, wrap, the
 * fingers in contact) stays as it was tuned.
 */
export type Jitter = { height: number; phi: number; tilt: number; tuck: number; fan: number };

/**
 * The ranges, each way up, by grip type. The fingertip grip's were chosen by eye on two sheets of the beaker
 * (30 September 2026): the narrow ranges did not show, these read as organic without spoiling the grip. The others
 * keep the narrow ranges until they are looked at.
 */
export const JITTER: Record<GripType, Jitter> = {
	precision: { height: 0.006, phi: (15 * Math.PI) / 180, tilt: 7, tuck: 0.25, fan: 5 },
	power: { height: 0.003, phi: (8 * Math.PI) / 180, tilt: 3, tuck: 0.1, fan: 2 },
	tripod: { height: 0.003, phi: (8 * Math.PI) / 180, tilt: 3, tuck: 0.1, fan: 2 }
};

/** A small generator with a seed, so a variation can be named and made again. */
export function seeded(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A varied copy of a grip, and how far round the object to move it (radians). */
export function jitter(spec: GripSpec, rnd: () => number = Math.random, range: Jitter = JITTER[spec.type]): { spec: GripSpec; dphi: number } {
	const s = (k: number) => (rnd() * 2 - 1) * k;
	const out: GripSpec = {
		...spec,
		height: spec.height + s(range.height),
		tilt: spec.tilt + s(range.tilt),
		tuck: Math.max(0, Math.min(1, spec.tuck + s(range.tuck))),
		fan: spec.fan + s(range.fan)
	};
	return { spec: out, dphi: s(range.phi) };
}
