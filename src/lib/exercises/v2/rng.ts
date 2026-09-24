import type { Rng } from './types';

/** mulberry32: small, fast, deterministic 32-bit PRNG. */
export function createRng(seed: number): Rng {
	let state = seed >>> 0;
	const next = (): number => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	return {
		seed,
		next,
		int(a: number, b: number): number {
			if (!Number.isInteger(a) || !Number.isInteger(b) || b < a) {
				throw new Error(`rng.int: invalid range [${a}, ${b}]`);
			}
			return a + Math.floor(next() * (b - a + 1));
		},
		pick<T>(xs: readonly T[]): T {
			if (xs.length === 0) throw new Error('rng.pick: empty array');
			return xs[Math.floor(next() * xs.length)];
		},
	};
}

/** Derive an independent seed from a base seed and a salt (for sub-streams). */
export function deriveSeed(seed: number, salt: number): number {
	let h = (seed ^ Math.imul(salt + 0x9e3779b9, 0x85ebca6b)) >>> 0;
	h = Math.imul(h ^ (h >>> 16), 0x7feb352d) >>> 0;
	h = Math.imul(h ^ (h >>> 15), 0x846ca68b) >>> 0;
	return (h ^ (h >>> 16)) >>> 0;
}
