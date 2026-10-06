/**
 * What the figures of the gravitation lessons 95-97 share (group 37): the constants of
 * docs/lezioni/fisica/README.md and numbers written for KaTeX.
 */

export const G = 6.67e-11;
export const M_T = 5.97e24;
export const R_T = 6.37e6;
/** G·M_T, in m³/s². */
export const GM_T = G * M_T;

/** Whole kilometres rounded to the ten, with a thin space every three digits, for <Tex>: 12740 → "12\,740". */
export function km(x: number): string {
	const r = Math.round(x / 10) * 10;
	return String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
}

/** The same for plain text, with a narrow no-break space: "12 740". */
export const kmText = (x: number) => km(x).replace(/\\,/g, '\u202f');
