import type { Vector3 } from 'three';

/*
 * Damped springs, for everything that should move like a body and not like a machine. Chasing a target with an
 * exponential (x += (t - x) * k) moves fastest in the very first instant, so every start is a jolt; a spring starts
 * gently, speeds up and settles, the S-shaped curve of a limb. `omega` sets how quick it is (rad/s: a critically
 * damped spring covers 90% of a step in about 3.9 / omega seconds), `zeta` how much it overshoots (1 never, 0.7 a
 * little, which reads as weight).
 */

/** Longest step integrated at once: stiff springs stay stable at a low frame rate. */
const SUB = 1 / 240;

export type Spring = { x: number; v: number };

export function spring(s: Spring, target: number, omega: number, zeta: number, dt: number) {
	for (let left = dt; left > 1e-9; left -= SUB) {
		const h = Math.min(SUB, left);
		s.v += (omega * omega * (target - s.x) - 2 * zeta * omega * s.v) * h;
		s.x += s.v * h;
	}
	return s.x;
}

/** The same, for a vector `x` with its speed `v`, both changed in place. */
export function springVec(x: Vector3, v: Vector3, target: Vector3, omega: number, zeta: number, dt: number) {
	for (let left = dt; left > 1e-9; left -= SUB) {
		const h = Math.min(SUB, left);
		v.x += (omega * omega * (target.x - x.x) - 2 * zeta * omega * v.x) * h;
		v.y += (omega * omega * (target.y - x.y) - 2 * zeta * omega * v.y) * h;
		v.z += (omega * omega * (target.z - x.z) - 2 * zeta * omega * v.z) * h;
		x.addScaledVector(v, h);
	}
	return x;
}
