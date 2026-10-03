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
	Lighter: { ...cyl(0.0125, 0.12, 0.215, 0.168), button: [0, 0.135, 0.023] },
	Funnel: cyl(0.0036, -0.07, 0, -0.03, 'pinch'),
	BunsenCollar: cyl(0.0078, 0.021, 0.04, 0.03, 'pinch')
};

export const HOLDS: Record<string, FixedHold> = {
	EvapDish: { p: [0.056, 0.022, 0], f: [0, -0.35, -1], n: [-1, 0, 0], curl: 0.5 },
	FilterPaper: { p: [0.045, 0.012, 0], f: [-1, 0, 0], n: [0, -1, 0], curl: 0.25 },
	Goggles: { p: [0.088, 0.035, -0.045], f: [0, 0, -1], n: [-1, 0, 0], curl: 0.55 },
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
