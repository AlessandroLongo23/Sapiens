/**
 * The compressions the lessons of "Immagini, suoni e video digitali" show (computer science, third year, group 08):
 * run-length encoding, and a lossy compression of an image by blocks of 8 × 8 pixels, the way JPEG does it. Pure
 * functions, without React: the figures only draw what these return. Tests in tests/unit/informatica-compressione.test.mjs.
 */

// ---------------------------------------------------------------- run-length encoding

/** A run: `quanti` equal symbols one after the other, the first of which is at `da`. */
export type Sequenza<T> = { simbolo: T; quanti: number; da: number };

/** The runs of a row, in order: B B B N N → (3, B) (2, N). An empty row has none. */
export function sequenze<T>(riga: readonly T[]): Sequenza<T>[] {
	const out: Sequenza<T>[] = [];
	riga.forEach((simbolo, i) => {
		const last = out[out.length - 1];
		if (last && last.simbolo === simbolo) last.quanti++;
		else out.push({ simbolo, quanti: 1, da: i });
	});
	return out;
}

/** A text encoded as the lesson writes it, the count before the symbol: BBBNN → 3B2N. */
export const codificaRle = (testo: string): string => sequenze([...testo]).map((s) => `${s.quanti}${s.simbolo}`).join('');

/** The text a code stands for: 3B2N → BBBNN. A count may have more digits; what is not "count, symbol" is null. */
export function decodificaRle(codice: string): string | null {
	if (!/^(\d+\D)*$/.test(codice)) return null;
	return [...codice.matchAll(/(\d+)(\D)/g)].map(([, n, s]) => s.repeat(Number(n))).join('');
}

/**
 * What a row and its code weigh, in bytes, with the model of the lesson: one byte per pixel in the row, two bytes
 * per run in the code (one for the count, one for the colour).
 */
export function pesoRle(riga: readonly unknown[]): { originale: number; compressa: number; sequenze: number } {
	const n = sequenze(riga).length;
	return { originale: riga.length, compressa: 2 * n, sequenze: n };
}

// ---------------------------------------------------------------- lossy compression by blocks

const N = 8;
/** The luminance quantisation table of the JPEG standard (ITU-T T.81, Annex K, table K.1). */
const TABELLA = [
	[16, 11, 10, 16, 24, 40, 51, 61],
	[12, 12, 14, 19, 26, 58, 60, 55],
	[14, 13, 16, 24, 40, 57, 69, 56],
	[14, 17, 22, 29, 51, 87, 80, 62],
	[18, 22, 37, 56, 68, 109, 103, 77],
	[24, 35, 55, 64, 81, 104, 113, 92],
	[49, 64, 78, 87, 103, 121, 120, 101],
	[72, 92, 95, 98, 112, 100, 103, 99]
] as const;

/** cos((2x + 1) u π / 16), with the factor of the first row: the basis of the 8 × 8 cosine transform. */
const BASE = Array.from({ length: N }, (_, u) => Array.from({ length: N }, (_, x) => (u === 0 ? Math.SQRT1_2 : 1) * 0.5 * Math.cos(((2 * x + 1) * u * Math.PI) / 16)));

/** The steps a quality from 1 to 100 gives, as the reference JPEG library scales the table. */
export function passiQuantizzazione(qualita: number): number[][] {
	const q = Math.min(100, Math.max(1, Math.round(qualita)));
	const scale = q < 50 ? 5000 / q : 200 - 2 * q;
	return TABELLA.map((row) => row.map((t) => Math.min(255, Math.max(1, Math.floor((t * scale + 50) / 100)))));
}

/**
 * One channel of an image (values from 0 to 255, sides that are multiples of 8) compressed with loss and brought
 * back: each block of 8 × 8 values is written as 64 amounts of patterns, from the flat one to the finest, each
 * amount is divided by its step and rounded, and the image is rebuilt from the rounded amounts.
 * `diversiDaZero` counts the amounts that are not zero after the rounding, which is what is left to store.
 */
export function comprimiCanale(canale: readonly (readonly number[])[], qualita: number): { valori: number[][]; diversiDaZero: number; numeri: number } {
	const rows = canale.length, cols = canale[0]?.length ?? 0;
	if (rows % N || cols % N) throw new Error('comprimiCanale: the sides must be multiples of 8');
	const passi = passiQuantizzazione(qualita);
	const valori = canale.map((row) => row.map(() => 0));
	let diversiDaZero = 0;
	const tmp = Array.from({ length: N }, () => new Array<number>(N).fill(0));
	const coef = Array.from({ length: N }, () => new Array<number>(N).fill(0));
	for (let by = 0; by < rows; by += N) {
		for (let bx = 0; bx < cols; bx += N) {
			// forward transform, rows then columns
			for (let y = 0; y < N; y++) for (let u = 0; u < N; u++) {
				let s = 0;
				for (let x = 0; x < N; x++) s += (canale[by + y][bx + x] - 128) * BASE[u][x];
				tmp[y][u] = s;
			}
			for (let u = 0; u < N; u++) for (let v = 0; v < N; v++) {
				let s = 0;
				for (let y = 0; y < N; y++) s += tmp[y][u] * BASE[v][y];
				const k = Math.round(s / passi[v][u]);
				if (k !== 0) diversiDaZero++;
				coef[v][u] = k * passi[v][u];
			}
			// and back
			for (let v = 0; v < N; v++) for (let x = 0; x < N; x++) {
				let s = 0;
				for (let u = 0; u < N; u++) s += coef[v][u] * BASE[u][x];
				tmp[v][x] = s;
			}
			for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
				let s = 0;
				for (let v = 0; v < N; v++) s += tmp[v][x] * BASE[v][y];
				valori[by + y][bx + x] = Math.min(255, Math.max(0, Math.round(s + 128)));
			}
		}
	}
	return { valori, diversiDaZero, numeri: rows * cols };
}

/** A colour of an image, as red, green and blue from 0 to 255. */
export type Rgb = readonly [number, number, number];

/**
 * A colour image compressed with loss and brought back, one channel at a time. A simplification of JPEG, which first
 * separates brightness from colour and keeps the colour coarser: here the three channels are treated alike.
 */
export function comprimiImmagine(immagine: readonly (readonly Rgb[])[], qualita: number): { immagine: Rgb[][]; diversiDaZero: number; numeri: number } {
	const channels = [0, 1, 2].map((k) => comprimiCanale(immagine.map((row) => row.map((p) => p[k])), qualita));
	return {
		immagine: immagine.map((row, r) => row.map((_, c) => [channels[0].valori[r][c], channels[1].valori[r][c], channels[2].valori[r][c]] as const)),
		diversiDaZero: channels.reduce((s, ch) => s + ch.diversiDaZero, 0),
		numeri: channels.reduce((s, ch) => s + ch.numeri, 0)
	};
}
