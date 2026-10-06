import { Matrix4, Quaternion, Vector3 } from 'three';

/*
 * How hands hold things.
 *
 * Every object a hand can take has a simple surface model in its own frame: a solid of revolution about its local Y
 * axis, radius as a function of height (glassware, rods, the lighter's body), or a fixed hold for the odd shapes
 * (the dish, the filter paper, the goggles, the gas tap's lever).
 *
 * The hand frame used everywhere is anatomical, not the bones': P is the centre of the palm's surface, F points from
 * the wrist to the middle knuckle, N is the palm's normal pointing out of the palm (into what it holds), and the
 * quaternion maps (X, Y, Z) to (F × N, F, N). For the right hand F × N points to the thumb side; for the left hand to
 * the little-finger side.
 *
 * For a solid of revolution there is no single right grip: the hand can take it anywhere round its axis, thumb up or
 * down. `chooseGrip` tries them all and keeps the one closest to a comfortable hand for the arm that reaches, which
 * is what keeps wrists anatomical. Fingers are not posed by hand either: `closeFingers` curls each finger until its
 * pads touch the surface, the way procedural grasping works in VR.
 */

export type Side = 'L' | 'R';

export type Shape = {
	/** Outer radius at height y, in the object's frame. */
	radius: (y: number) => number;
	y0: number;
	y1: number;
	/** Height where the palm goes. */
	grip: number;
	/** Power grasp round a cylinder, a pinch of something thin, or a pen's tripod grip (thumb, index, middle). */
	kind: 'power' | 'pinch' | 'pen';
	/**
	 * A button the thumb works, on the outside of the surface, in the object's frame (a gas lighter's trigger). The
	 * hand then has one place round the object, the one that puts the thumb's pad on the button: held like a wand, the
	 * four fingers under it and the thumb on top.
	 */
	button?: [number, number, number];
};

/** A fixed hold for the odd shapes: palm point, fingers and palm normal in the object's frame (right hand). */
export type FixedHold = { p: [number, number, number]; f: [number, number, number]; n: [number, number, number]; curl: number };

const cyl = (r: number, y0: number, y1: number, grip: number, kind: Shape['kind'] = 'power'): Shape => ({ radius: () => r, y0, y1, grip, kind });

export const SHAPES: Record<string, Shape> = {
	Beaker: cyl(0.0262, 0, 0.073, 0.034),
	AcidBeaker: cyl(0.0212, 0, 0.059, 0.028),
	CuOJar: cyl(0.0266, 0, 0.066, 0.033),
	ConicalFlask: {
		radius: (y) => (y < 0.012 ? 0.0425 : y < 0.104 ? 0.0425 + ((0.0205 - 0.0425) * (y - 0.012)) / 0.092 : y < 0.112 ? 0.0194 : 0.018),
		y0: 0,
		y1: 0.145,
		grip: 0.124,
		kind: 'power'
	},
	GlassRod: cyl(0.003, 0, 0.2, 0.15, 'pen'),
	Thermometer: cyl(0.0035, 0, 0.3, 0.22, 'pen'),
	Pipette: { radius: (y) => (y < 0.26 ? 0.0096 : 0.0035), y0: 0.26, y1: 0.46, grip: 0.425, kind: 'pinch' },
	Spatula: cyl(0.0045, 0.03, 0.2, 0.15, 'pen'),
	WireLoop: cyl(0.0042, 0.082, 0.2, 0.15, 'pen'),
	Indicator: cyl(0.014, 0, 0.05, 0.026),
	Lighter: { ...cyl(0.0125, 0.12, 0.215, 0.168), button: [0, 0.135, 0.023] },
	Funnel: cyl(0.0036, -0.07, 0, -0.03, 'pinch'),
	BunsenCollar: cyl(0.0078, 0.021, 0.04, 0.03, 'pinch')
};

export const HOLDS: Record<string, FixedHold> = {
	EvapDish: { p: [0.056, 0.022, 0], f: [0, -0.35, -1], n: [-1, 0, 0], curl: 0.5 },
	FilterPaper: { p: [0.045, 0.012, 0], f: [-1, 0, 0], n: [0, -1, 0], curl: 0.25 },
	Goggles: { p: [0.088, 0.035, -0.045], f: [0, 0, -1], n: [-1, 0, 0], curl: 0.55 },
	CobaltGlass: { p: [0.03, 0.009, 0], f: [-1, 0, 0], n: [0, -1, 0], curl: 0.3 },
	GasTapHandle: { p: [0.052, 0.024, 0], f: [1, 0, 0], n: [0, -1, 0], curl: 0.35 }
};

export function canHold(name: string) {
	return name in SHAPES || name in HOLDS;
}

/** The hand's quaternion from its fingers direction and palm normal (orthonormalised, F kept). */
export function handQuat(F: Vector3, N: Vector3) {
	const y = F.clone().normalize();
	const z = N.clone().addScaledVector(y, -N.dot(y)).normalize();
	const x = new Vector3().crossVectors(y, z);
	return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
}

/** Where the hand sits on an object: palm point and hand rotation, in the object's frame. */
export type Grip = { p: Vector3; q: Quaternion; shape: Shape | null; curl: number };

/**
 * The grip on `name` that makes the hand closest to `comfort` (a hand rotation in world space), given how the object
 * is turned in the world now (`objectQ`).
 */
export function chooseGrip(name: string, side: Side, objectQ: Quaternion, comfort: Quaternion): Grip | null {
	const shape = SHAPES[name];
	const mirror = side === 'L' ? -1 : 1;
	if (!shape) {
		const h = HOLDS[name];
		if (!h) return null;
		const m = (v: [number, number, number]) => new Vector3(v[0] * mirror, v[1], v[2]);
		return { p: m(h.p), q: handQuat(m(h.f), m(h.n)), shape: null, curl: h.curl };
	}
	const pad = shape.kind === 'power' ? 0.0125 : 0.011;
	const r = shape.radius(shape.grip) + pad;
	let best: Grip | null = null;
	let bestCost = Infinity;
	const worldQ = new Quaternion();
	for (let k = 0; k < 16; k++) {
		const phi = (k / 16) * Math.PI * 2;
		const radial = new Vector3(Math.cos(phi), 0, Math.sin(phi));
		const N = radial.clone().negate();
		for (const up of [1, -1]) {
			// the thumb runs along the axis; X = F × N is the thumb side for the right hand, the other side for the left
			const thumb = new Vector3(0, up, 0);
			const X = thumb.clone().multiplyScalar(mirror);
			const F = new Vector3().crossVectors(N, X);
			const q = handQuat(F, N);
			worldQ.copy(objectQ).multiply(q);
			const cost = worldQ.angleTo(comfort);
			if (cost < bestCost) {
				bestCost = cost;
				best = { p: radial.clone().multiplyScalar(r).setY(shape.grip), q, shape, curl: 0 };
			}
		}
	}
	return best;
}

// ---------------------------------------------------------------------------------------------
// fingers

/** Flexion of a finger's three joints, and its spread; the thumb's opposition roll, then its three flexions. */
/** The thumb: opposition roll, three flexions, and palmar abduction (away from the palm's plane). */
export type ThumbAngles = [number, number, number, number, number];
export type FingerAngles = { f: [number, number, number, number][]; t: ThumbAngles };

const D = Math.PI / 180;

/** The relaxed hand: a gentle cascade, more curl towards the little finger. */
export const RELAXED: FingerAngles = {
	f: [
		[10 * D, 16 * D, 9 * D, 2 * D],
		[13 * D, 20 * D, 11 * D, 0],
		[16 * D, 24 * D, 13 * D, -2 * D],
		[20 * D, 28 * D, 15 * D, -5 * D]
	],
	t: [8 * D, 6 * D, 10 * D, 8 * D, 10 * D]
};

/** Wide open before a grasp: fingers extended and spread, thumb swung out. */
export const OPEN: FingerAngles = {
	f: [
		[-6 * D, 4 * D, 2 * D, 7 * D],
		[-6 * D, 4 * D, 2 * D, 1 * D],
		[-5 * D, 5 * D, 2 * D, -5 * D],
		[-4 * D, 6 * D, 3 * D, -11 * D]
	],
	t: [-12 * D, -8 * D, 0, 0, 0]
};

export function lerpAngles(a: FingerAngles, b: FingerAngles, k: number, out: FingerAngles = cloneAngles(a)): FingerAngles {
	for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) out.f[i][j] = a.f[i][j] + (b.f[i][j] - a.f[i][j]) * k;
	for (let j = 0; j < 5; j++) out.t[j] = a.t[j] + (b.t[j] - a.t[j]) * k;
	return out;
}

export function cloneAngles(a: FingerAngles): FingerAngles {
	return { f: a.f.map((x) => [...x] as [number, number, number, number]), t: [...a.t] as ThumbAngles };
}

/**
 * A finger's bones at rest, relative to the hand bone: positions and rotations of each segment, the tip length, and
 * the glove's vertices that each segment carries (in that bone's frame), for contact against the real surface.
 */
export type Chain = { pos: Vector3[]; rot: Quaternion[]; tip: number; verts?: Vector3[][]; abd?: Vector3 };

const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
const Z = new Vector3(0, 0, 1);

/** Each segment's frame in the hand bone's frame, for given joint angles (radians, the layout of FingerAngles). */
export function segFrames(chain: Chain, angles: number[], thumb: boolean) {
	const out: Matrix4[] = [];
	const m = new Matrix4();
	const q = new Quaternion();
	const qx = new Quaternion();
	for (let i = 0; i < 3; i++) {
		q.copy(chain.rot[i]);
		if (i === 0) {
			if (thumb) {
				q.multiply(qx.setFromAxisAngle(Y, angles[0]));
				if (chain.abd && angles[4]) q.multiply(qx.setFromAxisAngle(chain.abd, angles[4]));
			} else q.multiply(qx.setFromAxisAngle(Z, angles[3]));
		}
		q.multiply(qx.setFromAxisAngle(X, thumb ? angles[i + 1] : angles[i]));
		m.multiply(new Matrix4().compose(chain.pos[i], q, new Vector3(1, 1, 1)));
		out.push(m.clone());
	}
	return out;
}

// ---------------------------------------------------------------------------------------------
// a flat thing pinched at a corner

/**
 * Flat, thin things held as a card is: by a corner, the thumb on the face towards the eyes and the index and the
 * middle finger behind, the other two fingers closed out of the way. Half the side and the thickness, metres; the
 * thing lies in its local XZ plane, from Y = 0 to its thickness.
 */
export const PINCHED: Record<string, { half: number; thick: number }> = { CobaltGlass: { half: 0.025, thick: 0.003 } };

/** How far in from the corner, along the diagonal, the fingers hold it. */
const PINCH_IN = 0.013;
const PINCH_FINGERS: [number, number, number, number][] = [
	[34 * D, 78 * D, 30 * D, -4 * D],
	[42 * D, 80 * D, 30 * D, 0],
	[84 * D, 96 * D, 56 * D, 2 * D],
	[88 * D, 98 * D, 58 * D, 0]
];

/**
 * The pad of the thumb's last segment: where it is and where it faces, in the hand's frame. `side` is which way of
 * the segment's own Z the pad is (+1 or -1): the bones' frames do not say, and the search tries both.
 */
function thumbPad(chain: Chain, frames: Matrix4[], side: number) {
	const m = frames[2];
	const local = new Vector3(0, chain.tip * 0.6, 0.006 * side);
	// on the glove itself, where its vertices are known: the outermost ones of that side, in the middle of the segment
	const vs = (chain.verts?.[2] ?? []).filter((v) => v.y > chain.tip * 0.3 && v.y < chain.tip * 0.9);
	if (vs.length > 8) {
		const top = [...vs].sort((a, b) => (b.z - a.z) * side).slice(0, Math.max(3, Math.floor(vs.length * 0.15)));
		local.set(0, 0, 0);
		for (const v of top) local.add(v);
		local.multiplyScalar(1 / top.length);
	}
	return { p: local.applyMatrix4(m), n: new Vector3(0, 0, side).transformDirection(m) };
}

const pinches = new WeakMap<Chain, { grip: Grip; angles: FingerAngles }>();

/**
 * The pinch of a flat thing for a hand, as a card is held up to look at it: the forearm half turned, the back of the
 * hand outwards, the thumb towards the eyes. The index and the middle finger are curled side by side behind the
 * thing, which stands in the plane the fingers bend in, against the index's thumb side; the thumb lies on its near
 * face. The fingers' pose is fixed; the thumb's five angles are searched until its pad is on the thing over the
 * index's last segment, facing it (they depend on the hand's own bones). From the corner held, the thing goes on
 * away from the hand: half towards the fingertips' side, half out of the palm.
 */
export function pinchGrip(name: string, chains: Chain[], thumb: Chain, palm: Vector3): { grip: Grip; angles: FingerAngles } | null {
	const flat = PINCHED[name];
	if (!flat) return null;
	const done = pinches.get(thumb);
	if (done) return done;
	// which way along the hand's X the thumb is: the right hand's one way, the left's the other
	const side = Math.sign(thumb.pos[0].x - chains[1].pos[0].x) || 1;
	const out = new Vector3(side, 0, 0);
	// the index as bent: how far its last two segments come towards the thumb, and where its last one is
	const frames = segFrames(chains[0], PINCH_FINGERS[0], false);
	let x0 = -Infinity;
	const at = new Vector3();
	let n = 0;
	for (const seg of [1, 2])
		for (const v of chains[0].verts?.[seg] ?? []) {
			const w = v.clone().applyMatrix4(frames[seg]);
			x0 = Math.max(x0, w.x * side);
			if (seg === 2) {
				at.add(w);
				n++;
			}
		}
	if (n) at.multiplyScalar(1 / n);
	else {
		at.set(0, chains[0].tip * 0.5, 0).applyMatrix4(frames[2]);
		x0 = at.x * side + 0.008;
	}
	// on the thing's far face, over the middle of the index's last segment
	at.x = (x0 + 0.0005) * side;
	const want = at.clone().addScaledVector(out, flat.thick + 0.001);
	let best: ThumbAngles = [...RELAXED.t] as ThumbAngles;
	let cost = Infinity;
	for (let opp = -20; opp <= 90; opp += 10)
		for (let abd = 0; abd <= 70; abd += 10)
			for (let f1 = 0; f1 <= 40; f1 += 10)
				for (let f2 = 0; f2 <= 50; f2 += 10)
					for (let f3 = 0; f3 <= 40; f3 += 20) {
						const t: ThumbAngles = [opp * D, f1 * D, f2 * D, f3 * D, abd * D];
						const tf = segFrames(thumb, t, true);
						for (const s of [1, -1]) {
							const pad = thumbPad(thumb, tf, s);
							// on the near face, and flat on it
							const c = pad.p.distanceTo(want) + 0.008 * (1 + pad.n.dot(out));
							if (c < cost) {
								cost = c;
								best = t;
							}
						}
					}
	// the thing's axes in the hand's frame: its normal from the thumb to the fingers, its sides along the fingers and
	// out of the palm, the corner held towards the wrist and the back of the hand
	const a = out.clone().negate();
	const u = new Vector3(0, 1, 1).normalize();
	const v = new Vector3().crossVectors(a, u);
	const x = u.clone().add(v).normalize();
	const z = new Vector3().crossVectors(x, a);
	const origin = at.clone().addScaledVector(u, flat.half * Math.SQRT2 - PINCH_IN);
	const inv = new Matrix4().makeBasis(x, a, z).setPosition(origin).invert();
	const grip: Grip = { p: palm.clone().applyMatrix4(inv), q: new Quaternion().setFromRotationMatrix(inv), shape: null, curl: 0 };
	const result = { grip, angles: { f: PINCH_FINGERS.map((f) => [...f] as [number, number, number, number]), t: best } };
	pinches.set(thumb, result);
	return result;
}

/** A fixed amount of curl, for holds without a surface model. */
export function curled(k: number): FingerAngles {
	const out = cloneAngles(RELAXED);
	for (let i = 0; i < 4; i++) {
		out.f[i][0] = (70 * k + 8) * D;
		out.f[i][1] = (85 * k + 10) * D;
		out.f[i][2] = (50 * k + 6) * D;
	}
	out.t = [22 * D, 20 * D * k + 8 * D, 30 * D * k, 30 * D * k, 25 * D * k];
	return out;
}
