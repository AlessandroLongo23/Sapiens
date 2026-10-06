/**
 * The plane of an exercise (piano.ts) from its data to its drawing: the formulas are read here, with the reader of
 * LaTeX the plotter uses, and drawn by src/lib/grafico/statico.ts. For the server and the scripts only: a page gets
 * the finished SVG, in the scene's `data.svg` or as the HTML of an option, so this file and the reader of LaTeX it
 * imports never reach the browser.
 */
import { parse } from '@cortex-js/compute-engine/latex-syntax';
import { PALETTE } from '../../grafico/documento';
import { cleanLatex, readEntry, type Entry, type Json, type Scope } from '../../grafico/formula';
import { planeSvg, type StaticCurve, type StaticPlane } from '../../grafico/statico';
import { PIANO, pianoData, type PianoCurve } from './piano';
import type { SceneRef } from './types';

const GRAY = '#808080';
const COLORS: Record<NonNullable<PianoCurve['colore']>, string> = { blu: PALETTE[0], rosso: PALETTE[1], verde: PALETTE[2], arancione: PALETTE[3], viola: PALETTE[4], nero: PALETTE[7], grigio: GRAY };
const DASH = { tratteggiato: 'dashed', punteggiato: 'dotted' } as const;

/** The formulas already read: a generator writes the same few many times. */
const read = new Map<string, Entry>();
const KEEP = 400;

function entryOf(formula: string): Entry {
	const known = read.get(formula);
	if (known) return known;
	let entry: Entry;
	try {
		entry = readEntry(parse(cleanLatex(formula)) as Json);
	} catch (e) {
		entry = { kind: 'error', message: String((e as Error).message ?? e) };
	}
	if (read.size >= KEEP) read.delete(read.keys().next().value!);
	read.set(formula, entry);
	return entry;
}

/** The plane of a scene with its formulas read, or why it cannot be drawn. */
export function readPlane(scene: SceneRef): { plane: StaticPlane | null; errors: string[] } {
	const { data, errors } = pianoData(scene);
	if (!data) return { plane: null, errors: errors.length ? errors : [`la scena ${scene.type} non è un piano`] };
	const curves: StaticCurve[] = [];
	let solid = 0;
	for (const c of data.curve) {
		const entry = entryOf(c.formula);
		const dash = c.tratto ? DASH[c.tratto] : 'solid';
		// the curves take the colours of the plotter in order; a dashed line with no colour is grey
		const color = c.colore ? COLORS[c.colore] : dash === 'solid' ? PALETTE[solid++ % PALETTE.length] : GRAY;
		if (entry.kind !== 'function' && entry.kind !== 'implicit') {
			errors.push(`${c.formula}: ${entry.kind === 'error' ? entry.message : 'non è una funzione né una curva'}`);
			continue;
		}
		if (entry.params.length) {
			errors.push(`${c.formula}: le lettere ${entry.params.join(', ')} non hanno un valore`);
			continue;
		}
		// one scope for all the evaluations of a curve, as the plane of the lessons does
		const scope: Scope = { x: 0, y: 0, t: 0, theta: 0 };
		const f = entry.f;
		curves.push(entry.kind === 'function' ? { color, dash, f: (x) => ((scope.x = x), f(scope)) } : { color, dash, implicit: (x, y) => ((scope.x = x), (scope.y = y), f(scope)) });
	}
	if (errors.length) return { plane: null, errors };
	const [x0, x1, y0, y1] = data.finestra;
	return {
		plane: { view: { x0, x1, y0, y1 }, curves, points: (data.punti ?? []).map((p) => ({ x: p.x, y: p.y, label: p.etichetta })), step: data.passo, shape: data.forma, axes: data.assi, alt: scene.alt },
		errors: []
	};
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * The scene as the page takes it: a plane with its drawing in `data.svg`, which the scene's component only places
 * (components/content/exercises/scenes/PianoCartesiano.tsx); a scene of another type as it is.
 */
export function drawnScene(scene: SceneRef): SceneRef {
	if (scene.type !== PIANO) return scene;
	const { plane, errors } = readPlane(scene);
	if (!plane) {
		console.error(`piano-cartesiano: ${errors.join('; ')}`);
		return scene;
	}
	return { ...scene, data: { ...scene.data, svg: planeSvg(plane) } };
}

/** A scene that is an option of a multiple choice, as HTML: the small drawing of a plane. Other scenes have none yet. */
export function sceneOptionHtml(scene: SceneRef): string {
	const { plane, errors } = readPlane(scene);
	if (!plane) {
		console.error(`piano-cartesiano: ${errors.join('; ')}`);
		return `<span>${escape(scene.alt)}</span>`;
	}
	return planeSvg(plane, true);
}
