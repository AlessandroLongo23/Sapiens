import type { Scene } from './engine';

/**
 * The first scenes of the physics sandbox, each built from a few numbers: what the sandbox opens with, and what the
 * tests compare with the closed laws. A scene is plain JSON, so the same shape can come from a lesson or a link.
 */

const G = 9.8;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** Half side of a block, metres: it grows a little with the mass, as in the lessons' figures. */
const half = (m: number) => 0.1 + 0.03 * Math.min(m, 4);

/** A block on an incline that rises to the right, `d` metres up the slope from its foot. */
export function incline({ angle = 30, m = 2, muS = 0, muK = 0, d = 2.2, v0 = 0, L = 3 }: { angle?: number; m?: number; muS?: number; muK?: number; d?: number; v0?: number; L?: number } = {}): Scene {
	const a = rad(angle);
	const r = half(m);
	const t = { x: Math.cos(a), y: Math.sin(a) };
	const n = { x: -t.y, y: t.x };
	return {
		g: G,
		bodies: [{ id: 'm', name: 'm', m, r, shape: 'block', pos: { x: t.x * d + n.x * r, y: t.y * d + n.y * r }, vel: { x: t.x * v0, y: t.y * v0 } }],
		surfaces: [
			{ id: 'piano', a: { x: 0, y: 0 }, b: { x: t.x * L, y: t.y * L }, muS, muK },
			{ id: 'pavimento', a: { x: -1.2, y: 0 }, b: { x: 0, y: 0 } }
		],
		pulleys: [],
		ropes: [],
		view: { x0: -1.3, x1: Math.max(3.2, t.x * L + 0.2), y0: -0.3, y1: Math.max(2.9, t.y * L + 0.5) }
	};
}

/** Atwood's machine: m1 on the left and m2 on the right of a pulley, level at the start, above a floor. */
export function atwood({ m1 = 1.2, m2 = 1.5 }: { m1?: number; m2?: number } = {}): Scene {
	const R = 0.2;
	return {
		g: G,
		bodies: [
			{ id: 'm1', name: 'm₁', m: m1, r: half(m1), shape: 'block', pos: { x: -R, y: 1.2 } },
			{ id: 'm2', name: 'm₂', m: m2, r: half(m2), shape: 'block', pos: { x: R, y: 1.2 } }
		],
		surfaces: [
			{ id: 'soffitto', a: { x: 0.9, y: 3 }, b: { x: -0.9, y: 3 } },
			{ id: 'pavimento', a: { x: -1.5, y: 0 }, b: { x: 1.5, y: 0 } }
		],
		pulleys: [{ id: 'c', at: { x: 0, y: 2.5 }, r: R }],
		ropes: [{ id: 'filo', from: { body: 'm1' }, to: { body: 'm2' }, via: { pulley: 'c', wrap: 'cw' } }],
		view: { x0: -1.6, x1: 1.6, y0: -0.3, y1: 3.2 }
	};
}

/** A block on an incline pulled by a hanging one, through a pulley at the top of the slope. */
export function inclineAndWeight({ angle = 30, m1 = 2, m2 = 1.5, muS = 0, muK = 0 }: { angle?: number; m1?: number; m2?: number; muS?: number; muK?: number } = {}): Scene {
	const a = rad(angle);
	const L = 3;
	const r1 = half(m1);
	const R = 0.15;
	const t = { x: Math.cos(a), y: Math.sin(a) };
	const n = { x: -t.y, y: t.x };
	const top = { x: t.x * L, y: t.y * L };
	// The rope runs parallel to the slope at the height of the block's centre and passes over the pulley.
	const c = { x: top.x + t.x * 0.25 + n.x * (r1 - R), y: top.y + t.y * 0.25 + n.y * (r1 - R) };
	return {
		g: G,
		bodies: [
			{ id: 'm1', name: 'm₁', m: m1, r: r1, shape: 'block', pos: { x: t.x * 1.4 + n.x * r1, y: t.y * 1.4 + n.y * r1 } },
			{ id: 'm2', name: 'm₂', m: m2, r: half(m2), shape: 'block', pos: { x: c.x + R, y: c.y - 0.9 } }
		],
		surfaces: [
			{ id: 'piano', a: { x: 0, y: 0 }, b: top, muS, muK },
			{ id: 'pavimento', a: { x: -0.6, y: 0 }, b: { x: top.x + 1.2, y: 0 } }
		],
		pulleys: [{ id: 'c', at: c, r: R }],
		ropes: [{ id: 'filo', from: { body: 'm1' }, to: { body: 'm2' }, via: { pulley: 'c', wrap: 'cw' } }],
		view: { x0: -0.7, x1: top.x + 1.3, y0: -0.3, y1: Math.max(top.y, c.y) + 0.6 }
	};
}

/** A body hanging from the ceiling by two threads, at `alpha` and `beta` degrees from the horizontal. */
export function twoThreads({ m = 3, alpha = 30, beta = 60 }: { m?: number; alpha?: number; beta?: number } = {}): Scene {
	const drop = 1.2;
	const top = 2.4;
	return {
		g: G,
		bodies: [{ id: 'm', name: 'm', m, r: half(m), shape: 'block', pos: { x: 0, y: top - drop } }],
		surfaces: [{ id: 'soffitto', a: { x: 2.6, y: top }, b: { x: -2.6, y: top } }],
		pulleys: [],
		ropes: [
			{ id: 'filo1', from: { body: 'm' }, to: { point: { x: -drop / Math.tan(rad(alpha)), y: top } } },
			{ id: 'filo2', from: { body: 'm' }, to: { point: { x: drop / Math.tan(rad(beta)), y: top } } }
		],
		view: { x0: -2.7, x1: 2.7, y0: 0, y1: 2.7 }
	};
}

/** A ball rolling off a table `h` metres high at `v0`, onto a rough floor. */
export function launch({ h = 1.2, v0 = 2, mu = 0.5 }: { h?: number; v0?: number; mu?: number } = {}): Scene {
	const r = 0.08;
	return {
		g: G,
		bodies: [{ id: 'p', name: 'P', m: 0.2, r, shape: 'ball', pos: { x: -0.4, y: h + r }, vel: { x: v0, y: 0 } }],
		surfaces: [
			{ id: 'tavolo', a: { x: -0.9, y: h }, b: { x: 0, y: h } },
			{ id: 'pavimento', a: { x: -0.9, y: 0 }, b: { x: 4, y: 0 }, muK: mu }
		],
		pulleys: [],
		ropes: [],
		view: { x0: -1, x1: 4.1, y0: -0.3, y1: Math.max(2, h + 0.6) }
	};
}

/**
 * A lamp of weight `P` newtons held by a thread to the ceiling, at `angle` degrees from the vertical, and by a
 * horizontal thread to a wall on the left: the tensions are T and F, as in lesson 20.
 */
export function lampAndWall({ P = 20, angle = 30 }: { P?: number; angle?: number } = {}): Scene {
	const y = 1, top = 2.2, wall = -1.6;
	return {
		g: G,
		bodies: [{ id: 'lampada', name: 'la lampada', m: P / G, r: 0.1, shape: 'ball', pos: { x: 0, y } }],
		surfaces: [
			{ id: 'soffitto', a: { x: 2.4, y: top }, b: { x: -0.6, y: top } },
			{ id: 'parete', a: { x: wall, y: y + 0.7 }, b: { x: wall, y: y - 0.7 } }
		],
		pulleys: [],
		ropes: [
			{ id: 'inclinato', name: 'T', from: { body: 'lampada' }, to: { point: { x: (top - y) * Math.tan(rad(angle)), y: top } } },
			{ id: 'orizzontale', name: 'F', from: { body: 'lampada' }, to: { point: { x: wall, y } } }
		],
		view: { x0: -1.9, x1: 2.5, y0: -0.3, y1: 2.45 }
	};
}

/** A cart on a table pulled, through a pulley on the edge, by a small weight that hangs beside the table. */
export function cartAndWeight({ m1 = 4, m2 = 1, muS = 0, muK = 0 }: { m1?: number; m2?: number; muS?: number; muK?: number } = {}): Scene {
	const h = 1.4, edge = 2.2, R = 0.13;
	const r1 = half(m1), r2 = half(m2);
	const c = { x: edge + 0.12, y: h + r1 - R };
	return {
		g: G,
		bodies: [
			{ id: 'm1', name: 'm₁', m: m1, r: r1, shape: 'block', pos: { x: 0.55, y: h + r1 } },
			{ id: 'm2', name: 'm₂', m: m2, r: r2, shape: 'block', pos: { x: c.x + R, y: 0.95 } }
		],
		surfaces: [
			{ id: 'tavolo', a: { x: -0.1, y: h }, b: { x: edge, y: h }, muS, muK },
			{ id: 'fianco', a: { x: edge, y: h }, b: { x: edge, y: 0 } },
			{ id: 'pavimento', a: { x: edge, y: 0 }, b: { x: 3.2, y: 0 } }
		],
		pulleys: [{ id: 'c', at: c, r: R }],
		ropes: [{ id: 'filo', from: { body: 'm1' }, to: { body: 'm2' }, via: { pulley: 'c', wrap: 'cw' } }],
		view: { x0: -0.2, x1: 3.3, y0: -0.3, y1: 2.85 }
	};
}
