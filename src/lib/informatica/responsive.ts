/**
 * What the lesson "Pagine responsive e accessibili" (informatica, third year) computes, as pure functions without
 * React: the contrast ratio between two colours, and which media queries of a style sheet hold at a given width.
 *
 * The contrast is that of the Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation of 12 December
 * 2024: the definitions of "relative luminance" and "contrast ratio", and the thresholds of the success criteria
 * 1.4.3 (level AA) and 1.4.6 (level AAA).
 */

export type Rgb = readonly [r: number, g: number, b: number];

/** `#rrggbb` or `#rgb` (the `#` may be missing) as three numbers from 0 to 255, or null when it is not a colour. */
export function leggiColore(testo: string): Rgb | null {
	const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(testo.trim());
	if (!m) return null;
	const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
	return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as unknown as Rgb;
}

/** Three numbers from 0 to 255 as `#rrggbb`. */
export const scriviColore = (colore: Rgb) => `#${colore.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** One channel from 0 to 255 made linear, as the definition of relative luminance asks. */
const lineare = (c8: number) => {
	const c = c8 / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** The relative luminance of a colour: 0 for black, 1 for white. */
export const luminanza = ([r, g, b]: Rgb) => 0.2126 * lineare(r) + 0.7152 * lineare(g) + 0.0722 * lineare(b);

/** The contrast ratio between two colours, from 1 (the same colour) to 21 (black and white). The order does not count. */
export function contrasto(a: Rgb, b: Rgb): number {
	const [chiaro, scuro] = [luminanza(a), luminanza(b)].sort((x, y) => y - x);
	return (chiaro + 0.05) / (scuro + 0.05);
}

/** The lowest ratios the guidelines accept: level AA (1.4.3) and level AAA (1.4.6), for normal and for large text. */
export const SOGLIE = { AA: { normale: 4.5, grande: 3 }, AAA: { normale: 7, grande: 4.5 } } as const;

/** Whether a ratio is enough for normal text and for large text (at least 24 px, or 18,66 px in bold), at level AA. */
export const supera = (rapporto: number) => ({ normale: rapporto >= SOGLIE.AA.normale, grande: rapporto >= SOGLIE.AA.grande });

/**
 * A ratio as it is written, with two decimals cut and not rounded: 4,499 must not read "4,50" and look enough.
 * The comma is the Italian decimal mark.
 */
export const scriviRapporto = (rapporto: number) => (Math.floor(rapporto * 100 + 1e-9) / 100).toFixed(2).replace('.', ',');

/** A media query of the lesson: `(min-width: 600px)` or `(max-width: 599px)`. */
export type Condizione = { tipo: 'min-width' | 'max-width'; px: number };

/** Whether the condition holds in a window that many CSS pixels wide. The limits are included, as in CSS. */
export const vale = (condizione: Condizione, larghezza: number) => (condizione.tipo === 'min-width' ? larghezza >= condizione.px : larghezza <= condizione.px);

/** A declaration of a style sheet, outside any media query (`quando` missing) or inside one. */
export type Dichiarazione = { selettore: string; proprieta: string; valore: string; quando?: Condizione };

/**
 * The value each property of each selector has at a width: among the declarations that hold, the last one written
 * wins (they have the same selector, so the same weight). The key is `selettore|proprieta`.
 */
export function valori(foglio: readonly Dichiarazione[], larghezza: number): Map<string, string> {
	const out = new Map<string, string>();
	for (const d of foglio) if (!d.quando || vale(d.quando, larghezza)) out.set(`${d.selettore}|${d.proprieta}`, d.valore);
	return out;
}
