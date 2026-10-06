import type { ReactNode } from 'react';
import type { Frame } from '../kit';

/**
 * What the figures of the chapter "La struttura elettronica dell'atomo" (lessons 48-51, group A) share: the
 * constants of the lessons, numbers written in scientific notation for <Tex>, the colour of a wavelength, and the
 * layer that keeps those colours out of the dark theme's inversion.
 */

/** The constants as the lessons round them. */
export const C = 3.0e8; // m/s
export const H = 6.63e-34; // J·s
export const N_A = 6.02e23; // 1/mol
export const RYDBERG_J = 2.18e-18; // J, the hydrogen levels: E_n = -2,18·10⁻¹⁸ J / n²

/** 5.66e14 → `5{,}66 \cdot 10^{14}` for <Tex>, with `digits` significant figures. */
export function texSci(x: number, digits = 3) {
	if (x === 0) return '0';
	let e = Math.floor(Math.log10(Math.abs(x)));
	let m = x / 10 ** e;
	if (Math.abs(Number(m.toFixed(digits - 1))) >= 10) {
		m /= 10;
		e += 1;
	}
	return `${m.toFixed(digits - 1).replace('.', '{,}')} \\cdot 10^{${e}}`;
}

/**
 * The colour of a wavelength in nanometres, as [r, g, b] between 0 and 1: Dan Bruton's approximation, dimmer towards
 * the two ends and black outside 400-700 nm, the visible range the lessons give. Indicative: a screen cannot show
 * spectral colours.
 */
export function wavelengthRgb(nm: number): [number, number, number] {
	let r = 0, g = 0, b = 0;
	if (nm >= 380 && nm < 440) [r, g, b] = [(440 - nm) / 60, 0, 1];
	else if (nm >= 440 && nm < 490) [r, g, b] = [0, (nm - 440) / 50, 1];
	else if (nm >= 490 && nm < 510) [r, g, b] = [0, 1, (510 - nm) / 20];
	else if (nm >= 510 && nm < 580) [r, g, b] = [(nm - 510) / 70, 1, 0];
	else if (nm >= 580 && nm < 645) [r, g, b] = [1, (645 - nm) / 65, 0];
	else if (nm >= 645) [r, g, b] = [1, 0, 0];
	const k = nm < 400 || nm > 700 ? 0 : nm < 430 ? 0.55 + (0.45 * (nm - 400)) / 30 : nm <= 650 ? 1 : 1 - (0.4 * (nm - 650)) / 50;
	return [r, g, b].map((x) => (x * k) ** 0.8) as [number, number, number];
}

export function wavelengthCss(nm: number) {
	const [r, g, b] = wavelengthRgb(nm);
	const h = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
	return `#${h(r)}${h(g)}${h(b)}`;
}

/**
 * The name of the colour, or of the region outside the visible (400-700 nm, as the lessons say). The boundaries are
 * set so that the hydrogen lines get the names lesson 48 gives them: 410 violetto, 434 blu, 486 verde-azzurro, 656 rosso.
 */
export function colourName(nm: number) {
	if (nm < 400) return 'ultravioletto';
	if (nm < 425) return 'violetto';
	if (nm < 475) return 'blu';
	if (nm < 500) return 'verde-azzurro';
	if (nm < 570) return 'verde';
	if (nm < 590) return 'giallo';
	if (nm < 620) return 'arancione';
	if (nm <= 700) return 'rosso';
	return 'infrarosso';
}

/**
 * A second SVG laid exactly over a <Drawing> with the same frame and left out of the dark theme's inversion, as
 * PrismaDispersione does: what is drawn here keeps its colours on both backgrounds. Wrap the Drawing and this layer
 * in a `<div className="relative max-w-full">`.
 */
export function ColourLayer({ f, children }: { f: Frame; children: ReactNode }) {
	return (
		<svg viewBox={`0 0 ${f.W.toFixed(1)} ${f.H.toFixed(1)}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
			{children}
		</svg>
	);
}
