/**
 * The Cartesian plane of an exercise: a scene (`SceneRef`) that draws curves from their formulas, still, under the
 * problem, with the solution, or as an option of a multiple choice (`ChoiceOption.scene`). A generator describes it
 * with the data below and never draws: the server reads the formulas and makes the drawing (src/lib/server/piano.ts,
 * src/lib/grafico/statico.ts), so the browser carries neither the reader of LaTeX nor the sampling of the curves.
 * scripts/exercises/README.md, "Esercizi con i grafici".
 *
 *   piano({ finestra: [-4, 4, -2, 6], curve: [{ formula: 'y=3^x' }], punti: [{ x: 0, y: 1 }, { x: 1, y: 3 }] },
 *     'Una curva che sale da sinistra a destra e passa per i punti (0, 1) e (1, 3)')
 */
import type { SceneRef } from './types';

export const PIANO = 'piano-cartesiano';

export interface PianoCurve {
	/**
	 * The formula in LaTeX, as the plotter and the `grafico` blocks of the lessons read it: `y=3^{x-1}+2` or
	 * `f(x)=…` for a function, `y=2` or `x=-1` for a line, `x^2+y^2=4` for a curve given by an equation. No
	 * parameters: every letter but x and y must have a value.
	 */
	formula: string;
	/** Dashed or dotted: an asymptote, an axis of symmetry, a curve of comparison. */
	tratto?: 'tratteggiato' | 'punteggiato';
	/** Blue for the first curve, when absent; grey for a dashed line. */
	colore?: 'blu' | 'rosso' | 'verde' | 'arancione' | 'viola' | 'nero' | 'grigio';
}

export interface PianoPoint {
	x: number;
	y: number;
	/** Written beside the point: its letter (`A`) or its coordinates (`(1, 3)`). Absent, the point is read on the grid. */
	etichetta?: string;
}

export interface PianoData {
	/** The window: x from the first to the second number, y from the third to the fourth. */
	finestra: [x0: number, x1: number, y0: number, y1: number];
	curve: PianoCurve[];
	punti?: PianoPoint[];
	/** The distance between two numbers written on the axes. Absent, it follows the size of the drawing. */
	passo?: number;
	/** Width over height of the drawing. Absent, the two axes have the same scale. */
	forma?: number;
	/** The names of the axes; x and y when absent. */
	assi?: [string, string];
}

/** The scene of a plane. `alt` says what the drawing shows to who cannot see it, without giving the answer away. */
export function piano(data: PianoData, alt: string): SceneRef {
	return { type: PIANO, data: data as unknown as Record<string, unknown>, alt };
}

/** The data of a plane scene, or what is wrong with them. A scene of another type is not a plane: null, no errors. */
export function pianoData(scene: SceneRef): { data: PianoData | null; errors: string[] } {
	if (scene.type !== PIANO) return { data: null, errors: [] };
	const errors: string[] = [];
	const d = scene.data as Partial<PianoData>;
	const w = d.finestra;
	if (!Array.isArray(w) || w.length !== 4 || !w.every(Number.isFinite) || !(w[1] > w[0]) || !(w[3] > w[2])) errors.push('finestra non valida');
	if (!Array.isArray(d.curve) || d.curve.some((c) => !c || typeof c.formula !== 'string' || !c.formula.trim())) errors.push('curve non valide');
	if (d.punti !== undefined && (!Array.isArray(d.punti) || d.punti.some((p) => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y)))) errors.push('punti non validi');
	if (d.passo !== undefined && !(d.passo > 0)) errors.push('passo non valido');
	if (d.forma !== undefined && !(d.forma >= 0.5 && d.forma <= 4)) errors.push('forma non valida');
	if (!scene.alt.trim()) errors.push('manca il testo alternativo');
	return { data: errors.length ? null : (d as PianoData), errors };
}
