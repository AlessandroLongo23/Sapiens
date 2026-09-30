/**
 * Shared pieces of the generators of group 10 (ottica-geometrica, riflessione, fis-specchi-sferici): numbers in
 * scientific notation as the physics lessons write them, exact decimals, and the scene `raggi-specchi`
 * (src/components/content/exercises/scenes/RaggiSpecchi.tsx), whose points the generators compute here. The
 * spherical mirror is drawn as in the lessons: an arc three times less curved than the real one, with every
 * reflected ray aimed at the image the equation gives (paraxial rays), so the drawing agrees with the numbers.
 */
import type { SceneRef } from './types';
import { decTex, roundSig } from './vettori';

// ---------------------------------------------------------------------------
// Numbers

/**
 * x (> 0) in scientific notation with n significant figures, as [mantissa, exponent] ("3.84", 8); null when x is
 * too close to a rounding boundary.
 */
export function sciParts(x: number, n: number): [string, number] | null {
	if (!(x > 0) || !Number.isFinite(x)) return null;
	let e = Math.floor(Math.log10(x));
	let m = x / 10 ** e;
	if (m >= 10 - 1e-12) { m /= 10; e += 1; }
	if (m < 1) { m *= 10; e -= 1; }
	let s = roundSig(m, n);
	if (s === null) return null;
	if (Number(s) >= 10) {
		// 9.996 with 3 figures: 10.0, that is 1.00 · 10^(e+1)
		s = roundSig(m / 10, n);
		if (s === null) return null;
		e += 1;
	}
	return [s, e];
}

/** The LaTeX of a number in scientific notation: 3{,}84 \cdot 10^{8}. */
export const sciTex = (m: string, e: number) => `${decTex(m)} \\cdot 10^{${e}}`;

/**
 * A positive result with n significant figures, written plainly between 0.01 and 1000 ("1{,}28", "0{,}120", "500")
 * and in scientific notation outside ("5{,}00 \cdot 10^{2}" is never used: 500 stays 500 only if it keeps n
 * figures without ambiguous zeros). Returns [latex, value for the checker] or null.
 */
export function resultTex(x: number, n: number): [string, string] | null {
	const sp = sciParts(x, n);
	if (!sp) return null;
	const [m, e] = sp;
	if (e >= -2 && e <= 2) {
		const s = roundSig(x, n);
		if (s !== null) return [decTex(s), s];
	}
	return [sciTex(m, e), `${m}e${e}`];
}

/** An exact decimal with at most `d` decimals, as a string without useless zeros ("30", "2.5", "-0.45"). */
export function exact(x: number, d = 2): string {
	const s = x.toFixed(d);
	return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

/** True if x is a multiple of 10^-d (up to floating point). */
export const isDec = (x: number, d = 1) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;

// ---------------------------------------------------------------------------
// Scene

export type P = [number, number];
export type El = Record<string, unknown> & { tipo: string };

const r3 = (x: number) => Math.round(x * 1000) / 1000;
const roundDeep = (x: unknown): unknown => (typeof x === 'number' ? r3(x) : Array.isArray(x) ? x.map(roundDeep) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, roundDeep(v)])) : x);

export function scene(alt: string, elementi: El[]): SceneRef {
	return { type: 'raggi-specchi', data: { elementi: roundDeep(elementi) as El[] }, alt };
}

/** A ray segment. */
export const ray = (da: P, a: P, colore: 1 | 2 | 3 = 1, virtuale = false): El => ({ tipo: 'raggio', da, a, colore, ...(virtuale ? { virtuale: true } : {}) });

/** The point where the line a→b, continued past b, leaves the box |x| ≤ ... : the far end of a reflected ray. */
export function toBox(a: P, b: P, box: { x0: number; x1: number; y0: number; y1: number }): P {
	const d: P = [b[0] - a[0], b[1] - a[1]];
	let t = Infinity;
	if (d[0] > 1e-12) t = Math.min(t, (box.x1 - a[0]) / d[0]);
	if (d[0] < -1e-12) t = Math.min(t, (box.x0 - a[0]) / d[0]);
	if (d[1] > 1e-12) t = Math.min(t, (box.y1 - a[1]) / d[1]);
	if (d[1] < -1e-12) t = Math.min(t, (box.y0 - a[1]) / d[1]);
	return [a[0] + t * d[0], a[1] + t * d[1]];
}

// ---------------------------------------------------------------------------
// Spherical mirrors

/** The x of the drawn mirror's surface at height y: vertex at x = 0, drawn radius Rd. */
export function mirrorX(Rd: number, concave: boolean, y: number) {
	const s = Rd - Math.sqrt(Math.max(Rd * Rd - y * y, 0));
	return concave ? -s : s;
}

/** Where the line through a and b meets the drawn mirror. */
export function bend(a: P, b: P, Rd: number, concave: boolean): P {
	const dx = b[0] - a[0], dy = b[1] - a[1];
	let x = 0;
	for (let k = 0; k < 10; k++) x = mirrorX(Rd, concave, a[1] + (dy * (x - a[0])) / dx);
	return [x, a[1] + (dy * (x - a[0])) / dx];
}

/**
 * The three principal rays from the tip of an object at drawn distance P (height H) in front of a mirror with drawn
 * focal length Fs (positive concave, negative convex): parallel (colour 1), through the focus (2), to the vertex
 * (3), each reflected towards the image I (real) or away from it (virtual), with the dashed extensions to the image
 * and, where the ray goes towards or comes from the focus on the other side, to the focus. Q is the drawn image
 * distance. The far ends stop at the box.
 */
export function principalRays(Pd: number, H: number, Fs: number, Rd: number, box: { x0: number; x1: number; y0: number; y1: number }): { els: El[]; I: P; Q: number } {
	const concave = Fs > 0;
	const Q = (Pd * Fs) / (Pd - Fs);
	const G = -Q / Pd;
	const I: P = [-Q, G * H];
	const real = Q > 0;
	const tip: P = [-Pd, H];
	const F: P = [-Fs, 0];
	const out = (A: P): P => (real ? toBox(A, I, box) : toBox(A, [2 * A[0] - I[0], 2 * A[1] - I[1]], box));
	const els: El[] = [];
	const A1: P = [mirrorX(Rd, concave, H), H];
	const A2 = bend(tip, F, Rd, concave);
	const V: P = [0, 0];
	els.push(ray(tip, A1, 1), ray(A1, out(A1), 1));
	els.push(ray(tip, A2, 2), ray(A2, out(A2), 2));
	els.push(ray(tip, V, 3), ray(V, out(V), 3));
	if (!real) els.push(ray(A1, I, 1, true), ray(A2, I, 2, true), ray(V, I, 3, true));
	if (concave && Pd < Fs) els.push(ray(F, tip, 2, true));
	if (!concave) els.push(ray(A1, F, 1, true), ray(A2, F, 2, true));
	return { els, I, Q };
}
