/**
 * Pieces shared by the figures of chemistry group 22 (lessons 14-17: states of matter, the particle model, pure
 * substances and mixtures, solutions) and by the scene `particelle-riquadri` of the exercises: the fills of the
 * particles and of the three states, as the TikZ figures of those lessons draw them, and a seeded random generator, so
 * that a figure starts the same on every load.
 */

/**
 * Particle fills: `a` is cyan!25 (the substance, the solvent), `b` orange!50 (a second substance, the solute), `c` a
 * mid violet, darker than the other two so that the three stay apart also in the dark theme's inversion.
 */
export const PARTICLE = { a: '#bff9ff', b: '#ffbf80', c: '#a594f0' } as const;

/** The three states on a temperature scale, as the TikZ figure of lesson 14: solid blue!15, liquid cyan!40, gas orange!25. */
export const STATE_TINT = { solido: '#d9d9ff', liquido: '#99ffff', aeriforme: '#ffdfbf' } as const;

/** A small seeded generator of numbers in [0, 1) (mulberry32). */
export function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A standard normal number from two uniform ones (Box-Muller). */
export function gauss(rnd: () => number) {
	const u = Math.max(1e-12, rnd());
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

/** A number for a label: the minus sign as the typographic one. */
export const signed = (s: string) => s.replace('-', '−');
