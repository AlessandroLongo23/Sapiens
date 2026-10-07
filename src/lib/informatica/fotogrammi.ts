/**
 * A tiny video for the figure of lesson 85 (Audio e video digitali): ten frames of 16 × 9 pixels, a ball thrown
 * over a field and then, after a cut, a car on a road at night. A frame is a grid of CSS colours, as
 * `GrigliaPixel` takes it. No React here: the figure shows one frame at a time and what `differenza` says about it.
 */

export const LARGHEZZA = 16;
export const ALTEZZA = 9;

export type Fotogramma = string[][];

const CIELO = '#8ec5ff';
const PRATO = '#4c9a4a';
const SOLE = '#ffd23f';
const PALLA = '#e23d3d';
const NOTTE = '#1d2a5c';
const STRADA = '#3f3f46';
const LUNA = '#f4f1de';
const AUTO = '#f29e38';

function vuoto(sopra: string, sotto: string): Fotogramma {
	return Array.from({ length: ALTEZZA }, (_, r) => Array.from({ length: LARGHEZZA }, () => (r < 6 ? sopra : sotto)));
}
function riquadro(f: Fotogramma, colonna: number, riga: number, larghezza: number, altezza: number, colore: string) {
	for (let r = riga; r < riga + altezza; r++) for (let c = colonna; c < colonna + larghezza; c++) if (f[r]?.[c] !== undefined) f[r][c] = colore;
}

/** Where the ball is in the six frames of the first scene: the left column and the top row of its 2 × 2 square. */
const PALLE: readonly (readonly [number, number])[] = [
	[1, 4],
	[3, 2],
	[5, 1],
	[7, 1],
	[9, 2],
	[11, 4]
];
/** The left column of the car, three pixels long, in the four frames of the second scene. */
const AUTOMOBILI: readonly number[] = [3, 4, 5, 6];

/** The index of the first frame after the cut. */
export const TAGLIO = PALLE.length;

/** The ten frames, in order. */
export function filmato(): Fotogramma[] {
	const giorno = PALLE.map(([colonna, riga]) => {
		const f = vuoto(CIELO, PRATO);
		riquadro(f, 13, 1, 2, 2, SOLE);
		riquadro(f, colonna, riga, 2, 2, PALLA);
		return f;
	});
	const notte = AUTOMOBILI.map((colonna) => {
		const f = vuoto(NOTTE, STRADA);
		riquadro(f, 2, 1, 2, 2, LUNA);
		riquadro(f, colonna, 6, 3, 1, AUTO);
		return f;
	});
	return [...giorno, ...notte];
}

/**
 * What changes from one frame to the next: `cambiato[r][c]` is true where the pixel has another colour, and
 * `quanti` counts them. Without a frame before, every pixel counts: the frame has to be written in full.
 */
export function differenza(prima: Fotogramma | null, dopo: Fotogramma): { cambiato: boolean[][]; quanti: number } {
	const cambiato = dopo.map((riga, r) => riga.map((colore, c) => !prima || prima[r][c] !== colore));
	return { cambiato, quanti: cambiato.reduce((s, riga) => s + riga.filter(Boolean).length, 0) };
}

/** For each frame, how many pixels have been written up to it, storing only the pixels that change. */
export function scritti(fotogrammi: readonly Fotogramma[]): number[] {
	let somma = 0;
	return fotogrammi.map((f, i) => (somma += differenza(i ? fotogrammi[i - 1] : null, f).quanti));
}
