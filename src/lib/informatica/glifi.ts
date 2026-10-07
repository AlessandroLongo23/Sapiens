/**
 * The glyph of the figure of lesson 86 (Caratteri tipografici e font): a capital R described by its outline, as a
 * vector font does, and the way an outline becomes pixels at a given size. No React here.
 *
 * An outline is a list of closed paths in a box `LARGA` wide and `ALTA` tall, y downwards. A path is a list of
 * points: a point `su` the curve is where a stroke ends; a point not on it is the control point of a quadratic
 * Bézier curve between the points before and after it, as in the fonts with quadratic outlines.
 */

export const LARGA = 8;
export const ALTA = 10;

export type Punto = { x: number; y: number; su: boolean };
export type Contorno = readonly (readonly Punto[])[];

const su = (x: number, y: number): Punto => ({ x, y, su: true });
const fuori = (x: number, y: number): Punto => ({ x, y, su: false });

/** The capital R: the outside, and the hole of its bowl. */
export const ERRE: Contorno = [
	[su(1, 1), su(4.4, 1), fuori(7, 1), su(7, 3.5), fuori(7, 5.3), su(5.5, 5.8), su(7.3, 9), su(5.4, 9), su(3.8, 6), su(2.7, 6), su(2.7, 9), su(1, 9)],
	[su(2.7, 2.4), su(4.2, 2.4), fuori(5.3, 2.4), su(5.3, 3.5), fuori(5.3, 4.6), su(4.2, 4.6), su(2.7, 4.6)]
];

/** How many points describe an outline. */
export const punti = (contorno: Contorno) => contorno.reduce((s, tratto) => s + tratto.length, 0);

/** A path as the `d` of an SVG <path>. */
export function tracciato(contorno: Contorno): string {
	return contorno
		.map((tratto) => {
			let d = `M${tratto[0].x},${tratto[0].y}`;
			for (let i = 1; i <= tratto.length; i++) {
				const p = tratto[i % tratto.length];
				if (p.su) d += `L${p.x},${p.y}`;
				else {
					const q = tratto[(i + 1) % tratto.length];
					d += `Q${p.x},${p.y} ${q.x},${q.y}`;
					i++;
				}
			}
			return `${d}Z`;
		})
		.join('');
}

/** Each path as a polygon, its curves cut into `passi` straight pieces. */
export function poligoni(contorno: Contorno, passi = 16): { x: number; y: number }[][] {
	return contorno.map((tratto) => {
		const out: { x: number; y: number }[] = [{ x: tratto[0].x, y: tratto[0].y }];
		for (let i = 1; i <= tratto.length; i++) {
			const p = tratto[i % tratto.length];
			if (p.su) out.push({ x: p.x, y: p.y });
			else {
				const a = out[out.length - 1];
				const b = tratto[(i + 1) % tratto.length];
				for (let k = 1; k <= passi; k++) {
					const t = k / passi;
					out.push({ x: (1 - t) * (1 - t) * a.x + 2 * t * (1 - t) * p.x + t * t * b.x, y: (1 - t) * (1 - t) * a.y + 2 * t * (1 - t) * p.y + t * t * b.y });
				}
				i++;
			}
		}
		return out;
	});
}

/** Whether a point is inside the outline: an odd number of crossings, so a path inside another is a hole. */
export function dentro(forme: readonly (readonly { x: number; y: number }[])[], x: number, y: number): boolean {
	let inside = false;
	for (const forma of forme) {
		for (let i = 0, j = forma.length - 1; i < forma.length; j = i++) {
			const a = forma[i], b = forma[j];
			if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
		}
	}
	return inside;
}

/**
 * The outline turned into pixels, `scala` pixels for each unit of the box: a pixel is black when at least half of
 * it (of 4 × 4 points taken in it) is inside the outline.
 */
export function rasterizza(contorno: Contorno, scala: number): boolean[][] {
	const forme = poligoni(contorno);
	const S = 4;
	return Array.from({ length: ALTA * scala }, (_, r) =>
		Array.from({ length: LARGA * scala }, (_, c) => {
			let n = 0;
			for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) if (dentro(forme, (c + (j + 0.5) / S) / scala, (r + (i + 0.5) / S) / scala)) n++;
			return n * 2 >= S * S;
		})
	);
}

/**
 * The same R as a bitmap font holds it: one drawing of 8 × 10 pixels, made for that size and for no other.
 * `#` is a black pixel.
 */
export const ERRE_BITMAP: readonly string[] = [
	'........',
	'.#####..',
	'.##..##.',
	'.##..##.',
	'.##..##.',
	'.#####..',
	'.##.##..',
	'.##..##.',
	'.##..##.',
	'........'
];

/** A bitmap enlarged `scala` times the only way it can be: every pixel becomes a square of `scala` × `scala`. */
export function ingrandisci(bitmap: readonly string[], scala: number): boolean[][] {
	return Array.from({ length: bitmap.length * scala }, (_, r) => Array.from({ length: bitmap[0].length * scala }, (_, c) => bitmap[Math.floor(r / scala)][Math.floor(c / scala)] === '#'));
}
