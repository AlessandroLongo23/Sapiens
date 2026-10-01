type Rgb = [number, number, number];

/**
 * The inks of the orbital figures, as RGB from 0 to 1. Two are enough: the regions of a cloud change ink across every
 * node, so two neighbouring shells or lobes are never the same. In a real orbital they are the two signs of the wave
 * function, red and blue; a state in motion has no sign, and takes another pair so as not to suggest one. Then the
 * page the far points fade to, and the line of axes and nodes. WebGL and the canvas cannot read the theme's oklch
 * tokens, so the two themes are written out here.
 */
export interface Ink {
	positive: Rgb;
	negative: Rgb;
	/** The two inks of a state in motion, alternating from one shell to the next. */
	motion: [Rgb, Rgb];
	page: Rgb;
	line: Rgb;
}

export const INK: { light: Ink; dark: Ink } = {
	light: {
		positive: [0.8, 0.13, 0.25],
		negative: [0.16, 0.36, 0.74],
		motion: [
			[0.2, 0.3, 0.68],
			[0.88, 0.47, 0.08]
		],
		page: [0.972, 0.961, 0.937],
		line: [0.2, 0.2, 0.24]
	},
	dark: {
		positive: [0.98, 0.42, 0.5],
		negative: [0.45, 0.66, 1],
		motion: [
			[0.55, 0.68, 1],
			[1, 0.68, 0.3]
		],
		page: [0.086, 0.094, 0.122],
		line: [0.85, 0.86, 0.9]
	}
};

/** The ink of the regions where `signs` is +1 and of those where it is −1. */
export const pair = (ink: Ink, kind: 'reale' | 'complesso'): [Rgb, Rgb] => (kind === 'reale' ? [ink.positive, ink.negative] : ink.motion);

export const currentInk = (): Ink => (document.documentElement.classList.contains('dark') ? INK.dark : INK.light);

export const css = ([r, g, b]: Rgb, alpha = 1): string => `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${alpha})`;

/** Calls `paint` when the theme changes; returns how to stop. */
export function onThemeChange(paint: () => void): () => void {
	const observer = new MutationObserver(paint);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	return () => observer.disconnect();
}

/** Seconds for a turn of a point at n² Bohr radii from the axis, with m = 1, when each level has its own time scale. */
export const TURN = 10;
/**
 * The angular velocity at 1 Bohr radius from the axis with m = 1, in radians per second, when all levels share one
 * time scale: a point of 2p, 4 radii from the axis, takes about 5 seconds for a turn.
 */
export const SHARED_RATE = 20;

/** The factor of m/ρ² in the angular velocity of the flow, for an orbital of level n. */
export const flowFactor = (n: number, sameScale: boolean): number => (sameScale ? SHARED_RATE : ((2 * Math.PI) / TURN) * n ** 4);
/** Below this distance from the axis the flow is held at one speed, or the points near the axis would blur. */
export const flowFloor = (n: number): number => 0.12 * n * n;
