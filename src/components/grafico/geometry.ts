import { useState } from 'react';
import type { Point, View } from '@/lib/grafico/curva';
import type { Made } from '@/lib/grafico/comandi';
import { newRow, type PlotRow } from '@/lib/grafico/documento';
import {
	canMeet,
		circleEquation,
	coefficients,
	conicEquation,
	construct,
	intersections,
	lineEquation,
	pointAt,
	pointText,
	polygonArea,
	polygonPerimeter,
	project,
	reach,
	tangents,
	texAngle,
	texNumber,
	texRoot,
	type Build,
	type Geo
} from '@/lib/grafico/geometria';
import type { PlaneCurve, PlaneMark, PlanePath, PlanePick, PlaneScale, PlaneShape } from './Plane';

/**
 * The tools of geometry (vault/Prodotti/Studenti/Geometria analitica nel plotter.md): what each one asks for, click
 * after click, and what it adds to the rows of the plotter. A tool stays in hand until another is chosen; a click
 * on empty space makes a point, on an object a point bound to it, where two objects meet their common point.
 */

export type ToolId =
	| 'move'
	| 'point'
	| 'meet'
	| 'midpoint'
	| 'centre'
	| 'line'
	| 'segment'
	| 'ray'
	| 'vector'
	| 'parallel'
	| 'perpendicular'
	| 'bisector'
	| 'anglebisector'
	| 'tangent'
	| 'circle'
	| 'circler'
	| 'compass'
	| 'circle3'
	| 'polygon'
	| 'distance'
		| 'angle'
	| 'slope'
	| 'reflect'
	| 'translate'
	| 'rotate'
	| 'dilate'
	| 'regression';

/**
 * The tools. `clip` names the short film of the tool at work, in public/grafico/geometria (recorded by
 * scripts/grafico/record-tools.mjs, as .webm, .mp4 and a .jpg to show before it plays).
 */
export const TOOLS: { id: ToolId; name: string; about: string; /** Missing for a tool not yet filmed. */ clip?: string }[] = [
	{ id: 'move', name: 'Muovi', about: 'Trascina un punto: quello che ci è costruito sopra lo segue. Trascinando il vuoto sposti il piano.', clip: 'muovi-un-punto' },
	{ id: 'point', name: 'Punto', about: 'Un clic nel vuoto crea un punto libero. Su una retta o una curva il punto resta vincolato a quell’oggetto; dove due oggetti si incontrano nasce il loro punto in comune.', clip: 'punto' },
	{ id: 'meet', name: 'Intersezione', about: 'Scegli due oggetti: compaiono tutti i loro punti in comune, con le coordinate.', clip: 'intersezione' },
	{ id: 'midpoint', name: 'Punto medio', about: 'Scegli due punti, oppure un segmento.', clip: 'punto-medio' },
	{ id: 'centre', name: 'Punti notevoli del triangolo', about: 'Scegli i tre vertici, o un triangolo, poi quale punto: baricentro, circocentro, incentro oppure ortocentro.', clip: 'punti-notevoli-del-triangolo' },
	{ id: 'line', name: 'Retta per due punti', about: 'Scegli due punti. La riga mostra l’equazione della retta, che cambia mentre li trascini.', clip: 'retta-per-due-punti' },
	{ id: 'segment', name: 'Segmento', about: 'Scegli i due estremi. La riga ne dà la lunghezza.', clip: 'segmento' },
	{ id: 'ray', name: 'Semiretta', about: 'Scegli l’origine, poi un punto per cui passa.', clip: 'semiretta' },
	{ id: 'vector', name: 'Vettore', about: 'Scegli l’inizio, poi la fine. La riga ne dà le componenti e il modulo.', clip: 'vettore' },
	{ id: 'parallel', name: 'Parallela', about: 'Scegli una retta e un punto, in qualunque ordine: la parallela passa per il punto.', clip: 'retta-parallela' },
	{ id: 'perpendicular', name: 'Perpendicolare', about: 'Scegli una retta e un punto, in qualunque ordine: la perpendicolare passa per il punto.', clip: 'retta-perpendicolare' },
	{ id: 'bisector', name: 'Asse del segmento', about: 'Scegli due punti, oppure un segmento: è la perpendicolare per il punto medio.', clip: 'asse-del-segmento' },
	{ id: 'anglebisector', name: 'Bisettrice', about: 'Scegli tre punti, con il vertice per secondo. Oppure due rette: le bisettrici sono due.', clip: 'bisettrice' },
	{ id: 'tangent', name: 'Tangenti', about: 'Scegli una circonferenza, una conica o il grafico di una funzione, e un punto. Da un punto esterno le tangenti sono due.', clip: 'retta-tangente' },
	{ id: 'circle', name: 'Circonferenza: centro e punto', about: 'Scegli il centro, poi un punto della circonferenza. La riga mostra l’equazione, il centro e il raggio.', clip: 'circonferenza-centro-e-punto' },
	{ id: 'circler', name: 'Circonferenza: centro e raggio', about: 'Scegli il centro, poi scrivi il raggio.', clip: 'circonferenza-centro-e-raggio' },
	{ id: 'compass', name: 'Compasso', about: 'Scegli un segmento, o due punti: la loro distanza è il raggio. Poi scegli il centro.', clip: 'compasso' },
	{ id: 'circle3', name: 'Circonferenza per tre punti', about: 'Scegli tre punti non allineati.', clip: 'circonferenza-per-tre-punti' },
	{ id: 'polygon', name: 'Poligono', about: 'Scegli i vertici uno dopo l’altro, e per chiudere torna sul primo. La riga ne dà l’area e il perimetro.', clip: 'poligono' },
	{ id: 'distance', name: 'Distanza', about: 'Tra due punti, tra un punto e una retta, o tra due rette parallele.', clip: 'distanza-punto-retta' },
	{ id: 'angle', name: 'Angolo', about: 'Scegli tre punti, con il vertice per secondo. Oppure due rette: è l’angolo che non supera quello retto.', clip: 'angolo' },
		{ id: 'slope', name: 'Pendenza', about: 'Scegli una retta: di quanto sale quando la x cresce di uno.', clip: 'pendenza' },
	{ id: 'regression', name: 'Retta di regressione', about: 'Scegli i punti uno dopo l’altro, e per finire torna sul primo: è la retta che passa più vicino a tutti. La riga ne dà l’equazione e il coefficiente r.' },
	{ id: 'reflect', name: 'Simmetria', about: 'Scegli un oggetto, poi la retta o il punto rispetto a cui specchiarlo.' },
	{ id: 'translate', name: 'Traslazione', about: 'Scegli un oggetto, poi un vettore, oppure due punti: da dove e fin dove.' },
	{ id: 'rotate', name: 'Rotazione', about: 'Scegli un oggetto, poi il centro, e scrivi l’angolo in gradi: positivo in senso antiorario.' },
	{ id: 'dilate', name: 'Omotetia', about: 'Scegli un oggetto, poi il centro, e scrivi il rapporto: 2 raddoppia, 0,5 dimezza, un numero negativo ribalta.' }
];
export const toolOf = (id: ToolId) => TOOLS.find((t) => t.id === id)!;

/** The event by which the page asks the plotter to take a tool in hand: the guide under it has a button for each tool. */
export const TOOL_EVENT = 'sapiens:plot-tool';
/** Asks the plotter of this page to take a tool in hand and to come into view. */
export const tryTool = (id: ToolId) => window.dispatchEvent(new CustomEvent<ToolId>(TOOL_EVENT, { detail: id }));

/** The bar shows one button for each group: the tool of the group used last, with the others a click away. */
export const GROUPS: { name: string; tools: ToolId[] }[] = [
	{ name: 'Muovi', tools: ['move'] },
	{ name: 'Punti', tools: ['point', 'meet', 'midpoint', 'centre'] },
	{ name: 'Rette, segmenti e vettori', tools: ['line', 'segment', 'ray', 'vector'] },
	{ name: 'Rette da una condizione', tools: ['parallel', 'perpendicular', 'bisector', 'anglebisector', 'tangent'] },
	{ name: 'Circonferenze', tools: ['circle', 'circler', 'compass', 'circle3'] },
	{ name: 'Poligoni', tools: ['polygon'] },
		{ name: 'Misure', tools: ['distance', 'angle', 'slope', 'regression'] },
	{ name: 'Trasformazioni', tools: ['reflect', 'translate', 'rotate', 'dilate'] }
];
/** Where the films of the tools are, and their size in pixels. */
export const CLIPS = { path: '/grafico/geometria', width: 640, height: 400 };

/** Something already chosen for the object being built. */
interface Picked {
	id: number;
	kind: 'point' | 'line' | 'object';
}

/** What is under the pointer, as a tool reads it. `at` is in the coordinates of the axes. */
type Target = { at: Point; /** The object nearest to the pointer that is not a point. */ object?: number } & ({ kind: 'point'; id: number } | { kind: 'meet'; of: [number, number]; index: number } | { kind: 'on'; of: number; param: number } | { kind: 'free' });

/** What a tool asks for that is not a click: a number to type, or a choice among a few. */
export type Ask = { kind: 'number'; label: string } | { kind: 'choice'; options: string[] };

const POINT_REACH = 14;
const OBJECT_REACH = 10;
const PREVIEW = '#808080';
/** The id that stands for the pointer in the object shown before the last click. */
const POINTER = -1;
const MAX_VERTICES = 12;
const CENTRES = ['Baricentro', 'Circocentro', 'Incentro', 'Ortocentro'];
/** The letters the four centres usually have. */
const CENTRE_LETTERS = ['G', 'O', 'I', 'H'];

// ---------------------------------------------------------------- names

const GREEK_TEXT: Record<string, string> = { gamma: 'γ', alpha: 'α', beta: 'β', delta: 'δ', varepsilon: 'ε', theta: 'θ', varphi: 'φ' };
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';

/** A name written in LaTeX as plain text, for a sentence: \gamma_1 is γ₁. */
export function plainName(tex: string): string {
	return tex
		.replace(/\\([a-z]+)/g, (_, word: string) => GREEK_TEXT[word] ?? word)
		.replace(/_\{?(\d+)\}?/g, (_, digits: string) => [...digits].map((d) => SUBSCRIPTS[Number(d)]).join(''));
}

/** A number or a length in LaTeX as plain text, for the plane: √13, (3√2)/2, 45°, π/4. */
export function plainTex(tex: string): string {
	return (
		tex
			.replace(/\\sqrt\{(\d+)\}/g, '√$1')
			.replace(/\\pi/g, 'π')
			.replace(/\^\\circ/g, '°')
			// a root over a number is written with its brackets, or √290/10 would read as the root of a fraction
			.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_, top: string, bottom: string) => (top.includes('√') ? `(${top})/${bottom}` : `${top}/${bottom}`))
			.replace(/\{,\}/g, ',')
	);
}

const LETTERS = { point: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'], line: ['r', 's', 't', 'u', 'v', 'w'], circle: ['\\gamma'], angle: ['\\alpha', '\\beta', '\\delta', '\\varepsilon', '\\theta', '\\varphi'] };

/** The first name of its kind that nothing has: A, B, C for points; r, s, t for lines; γ for circles; α, β for angles; then with a number. */
export function freshName(kind: keyof typeof LETTERS, used: Set<string>, wish?: string): string {
	if (wish && !used.has(wish)) return wish;
	for (let n = 0; ; n++)
		for (const letter of LETTERS[kind]) {
			const name = n ? `${letter}_${n > 9 ? `{${n}}` : n}` : letter;
			if (!used.has(name)) return name;
		}
}

/** The rows a written command adds (lib/grafico/comandi.ts), each with its name: the one asked for, or the first free of its kind. */
export function writtenRows(made: Made[], rows: PlotRow[], used: Set<string>, wish?: string): PlotRow[] {
	const names = new Set(used);
	const added: PlotRow[] = [];
	made.forEach((m, i) => {
		const name = m.name ? freshName(m.name, names, i === 0 ? (wish ?? m.wish) : m.wish) : undefined;
		if (name) names.add(name);
		added.push({ ...newRow([...rows, ...added]), build: m.build, ...(name ? { name } : {}), ...(name && m.label ? { label: true } : {}) });
	});
	return added;
}

/** What some builds would put on the plane, drawn as a thing not yet made: the object a tool or a command is about to add. */
export function previewOf(builds: Build[], get: (id: number) => Geo, xUnit: number, id = 'written'): { curves: PlaneCurve[]; marks: PlaneMark[] } {
	const preview: { curves: PlaneCurve[]; marks: PlaneMark[] } = { curves: [], marks: [] };
	builds.forEach((build, i) => {
		const geo = construct(build, get);
		const shape = shapeOf(geo, xUnit);
		if (shape) preview.curves.push({ ...shape, id: `${id}${i}`, color: PREVIEW, width: 'thin', dash: 'dashed' });
		if (geo.kind === 'point') preview.marks.push({ id: `${id}-point${i}`, at: { x: geo.x / xUnit, y: geo.y }, color: PREVIEW });
	});
	return preview;
}

// ---------------------------------------------------------------- an object on the plane and in its row

/**
 * A built object as the plane draws it; `xUnit` is what a unit of the plane is worth on the x axis, and `text` what
 * is written beside an angle or a slope.
 */
export function shapeOf(geo: Geo, xUnit: number, text = ''): PlaneShape | null {
	/** A point of geometry as a point of the plane. */
	const on = (p: Point): Point => ({ x: p.x / xUnit, y: p.y });
	if (geo.kind === 'line') {
		const p = on(geo.p);
		const d = on(geo.d);
		if (geo.arrow)
			return {
				path: (_view, sx, sy): PlanePath => {
					// the tip: two strokes of ten pixels, at 25° from the vector
					const end = { x: p.x + d.x, y: p.y + d.y };
					const along = Math.atan2(d.y * sy, d.x * sx);
					const barb = (turn: number): Point => ({ x: end.x - (10 * Math.cos(along + turn)) / sx, y: end.y - (10 * Math.sin(along + turn)) / sy });
					return {
						lines: [
							[p, end],
							[barb(0.44), end, barb(-0.44)]
						]
					};
				}
			};
		if (geo.segment) return { parametric: { t0: 0, t1: 1, x: (t) => p.x + t * d.x, y: (t) => p.y + t * d.y } };
		if (geo.ray)
			return {
				path: (view: View): PlanePath => {
					// as far as the farthest corner of the window, and a little more
					const far = (Math.hypot(view.x1 - view.x0, view.y1 - view.y0) + Math.hypot(p.x - (view.x0 + view.x1) / 2, p.y - (view.y0 + view.y1) / 2)) / Math.hypot(d.x, d.y);
					return { lines: [[p, { x: p.x + far * d.x, y: p.y + far * d.y }]] };
				}
			};
		const [a, b, c] = coefficients(geo);
		// a vertical line is no function of x
		if (Math.abs(b) < 1e-9 * Math.abs(a)) return { implicit: (x, y) => a * x * xUnit + b * y + c };
		return { f: (x) => -(a * x * xUnit + c) / b };
	}
	if (geo.kind === 'conic') {
		if (geo.circle) {
			const { c, r } = geo.circle;
			return { parametric: { t0: 0, t1: 2 * Math.PI, x: (t) => (c.x + r * Math.cos(t)) / xUnit, y: (t) => c.y + r * Math.sin(t) } };
		}
		const q = geo.q;
		return { implicit: (X, y) => ((x) => q[0] * x * x + q[1] * x * y + q[2] * y * y + q[3] * x + q[4] * y + q[5])(X * xUnit) };
	}
	if (geo.kind === 'measure') {
		const [from, to] = [on(geo.from), on(geo.to)];
		return { parametric: { t0: 0, t1: 1, x: (t) => from.x + t * (to.x - from.x), y: (t) => from.y + t * (to.y - from.y) } };
	}
	if (geo.kind === 'polygon') {
		const points = geo.points.map(on);
		return { path: (): PlanePath => ({ lines: [[...points, points[0]]], fill: true }) };
	}
	if (geo.kind === 'angle') {
		const vertex = on(geo.vertex);
		const [a, b] = [on(geo.a), on(geo.b)];
		const right = Math.abs(geo.value - Math.PI / 2) < 1e-9;
		return {
			path: (_view, sx, sy): PlanePath => {
				// on the screen: the arc is a round one whatever the two scales are
				const from = Math.atan2(a.y * sy, a.x * sx);
				let sweep = Math.atan2(b.y * sy, b.x * sx) - from;
				if (sweep > Math.PI) sweep -= 2 * Math.PI;
				if (sweep < -Math.PI) sweep += 2 * Math.PI;
				const at = (angle: number, pixels: number): Point => ({ x: vertex.x + (pixels * Math.cos(angle)) / sx, y: vertex.y + (pixels * Math.sin(angle)) / sy });
				const label = { at: at(from + sweep / 2, 44), text };
				// a right angle has its little square
				if (right) return { lines: [[at(from, 14), at(from + sweep / 2, 14 * Math.SQRT2), at(from + sweep, 14)]], label };
				return { lines: [Array.from({ length: 25 }, (_, k) => at(from + (sweep * k) / 24, 24))], label };
			}
		};
	}
	if (geo.kind === 'slope') {
		// a step of one to the right, and the rise of the line over it
		const [start, across, up] = [on(geo.at), on({ x: geo.at.x + 1, y: geo.at.y }), on({ x: geo.at.x + 1, y: geo.at.y + geo.value })];
		return { path: (_view, sx): PlanePath => ({ lines: [[start, across, up]], label: { at: { x: across.x + (text.length * 4 + 10) / sx, y: (across.y + up.y) / 2 }, text } }) };
	}
	return null;
}

/** What a build is, in words, with the names of what it comes from. */
export function describe(build: Build, nameOf: (id: number) => string): string {
	const names = build.of.map(nameOf);
	const [a, b, c] = names;
	switch (build.type) {
		case 'on':
			return `punto su ${a}`;
		case 'meet':
			return `intersezione di ${a} e ${b}`;
		case 'midpoint':
			return `punto medio di ${a}${b}`;
		case 'line':
			return `retta per ${a} e ${b}`;
		case 'segment':
			return `segmento ${a}${b}`;
		case 'ray':
			return `semiretta da ${a} per ${b}`;
		case 'vector':
			return `vettore ${a}${b}`;
		case 'parallel':
			return `parallela a ${a} per ${b}`;
		case 'perpendicular':
			return `perpendicolare a ${a} per ${b}`;
		case 'bisector':
			return `asse di ${a}${b}`;
		case 'anglebisector':
			return names.length === 2 ? `bisettrice di ${a} e ${b}` : `bisettrice dell’angolo ${a}${b}${c}`;
		case 'tangent':
			return `tangente a ${b} per ${a}`;
		case 'circle':
			return `circonferenza di centro ${a} per ${b}`;
		case 'circler':
			return `circonferenza di centro ${a} e raggio ${String(build.at ?? 0).replace('.', ',')}`;
		case 'compass':
			return `circonferenza di centro ${c} e raggio ${a}${b}`;
		case 'circle3':
			return `circonferenza per ${a}, ${b} e ${c}`;
		case 'polygon':
			return `${names.length === 3 ? 'triangolo' : names.length === 4 ? 'quadrilatero' : 'poligono'} ${names.join('')}`;
		case 'distance':
			return `distanza tra ${a} e ${b}`;
		case 'angle':
			return names.length === 2 ? `angolo tra ${a} e ${b}` : `angolo ${a}${b}${c}`;
		case 'slope':
			return `pendenza di ${a}`;
				case 'centre':
			return `${CENTRES[build.index ?? 0].toLowerCase()} di ${a}${b}${c}`;
		case 'reflect':
			return `simmetrico di ${a} rispetto a ${b}`;
		case 'translate':
			return names.length === 3 ? `traslato di ${a} del vettore ${b}${c}` : `traslato di ${a} del vettore ${b}`;
		case 'rotate':
			return `ruotato di ${a} attorno a ${b} di ${String(build.at ?? 0).replace('.', ',').replace('-', '−')}°`;
		case 'dilate':
			return `omotetico di ${a} dal centro ${b}, rapporto ${String(build.at ?? 1).replace('.', ',').replace('-', '−')}`;
		case 'regression':
			return `retta di regressione di ${names.join(', ')}`;
	}
}

/** The lines of LaTeX a built object shows in its row: its equation, its coordinates, its length. Empty where it is not there. */
export function equationsOf(row: PlotRow, geo: Geo, degrees = true): string[] {
	const name = row.name ?? '';
	if (geo.kind === 'point') return [`${name ? `${name}=` : ''}${pointText(geo)}`];
	if (geo.kind === 'line') {
		const size = texRoot(geo.d.x * geo.d.x + geo.d.y * geo.d.y);
		if (geo.arrow) return [`\\text{componenti } ${pointText(geo.d)}`, `\\text{modulo } ${size}`];
				if (geo.segment) return [`\\text{lunghezza } ${size}`];
		// a line fitted to points says how well it fits
		return geo.fit === undefined ? [lineEquation(geo)] : [lineEquation(geo), `r=${texNumber(Number(geo.fit.toFixed(4)))}`];
	}
	if (geo.kind === 'conic' && !geo.circle) return [conicEquation(geo.q)];
	if (geo.kind === 'conic' && geo.circle) return [circleEquation(geo.circle), `\\text{centro } ${pointText(geo.circle.c)},\\ \\text{raggio } ${texRoot(geo.circle.r ** 2)}`];
	if (geo.kind === 'measure') return [`d=${texRoot(geo.value ** 2)}`];
	if (geo.kind === 'polygon') return [`\\text{area } ${texNumber(polygonArea(geo.points))}`, `\\text{perimetro } ${texNumber(polygonPerimeter(geo.points))}`];
	if (geo.kind === 'angle') return [`${name ? `${name}=` : ''}${texAngle(geo.value, degrees)}`];
	if (geo.kind === 'slope') return [`m=${texNumber(geo.value)}`];
	return [];
}

// ---------------------------------------------------------------- the tool in hand

const tidy = (x: number) => Number(x.toPrecision(10));
/** A number as a formula field writes it: 2,5 with MathLive's decimal comma. */
const latexNumber = (x: number) => String(tidy(x)).replace('.', '{,}');

interface Args {
	rows: PlotRow[];
	/** Every row as an object of geometry, where it is one. */
	geos: Map<number, Geo>;
	/** The names taken: of points, of functions, of parameters, of built objects. */
	used: Set<string>;
	xUnit: number;
	/** Adds rows to the graph, as one step. */
	append: (rows: PlotRow[]) => void;
}

const TWO = (first: string, second: string) => (p: Picked[]) => (p.length ? second : first);
const LINE_AND_POINT = (p: Picked[]) => (!p.length ? 'Scegli la retta, oppure il punto.' : p[0].kind === 'line' ? 'Ora il punto per cui passa.' : 'Ora la retta.');
const THREE_OR_LINES = (p: Picked[]) => (!p.length ? 'Scegli tre punti, con il vertice per secondo; oppure due rette.' : p[0].kind === 'line' ? 'Ora la seconda retta.' : p.length === 1 ? 'Ora il vertice.' : 'Ora il terzo punto.');

const HINTS: Record<ToolId, (picks: Picked[]) => string> = {
	move: () => '',
	point: () => 'Fai clic sul piano, su una curva o dove due oggetti si incontrano.',
	meet: TWO('Scegli il primo oggetto, o fai clic dove due oggetti si incontrano.', 'Ora il secondo oggetto.'),
	midpoint: TWO('Scegli il primo punto, oppure un segmento.', 'Ora il secondo punto.'),
	centre: (p) => ['Scegli il primo vertice, oppure un triangolo.', 'Ora il secondo vertice.', 'Ora il terzo.', 'Quale punto?'][p.length],
	line: TWO('Scegli il primo punto.', 'Ora il secondo punto.'),
	segment: TWO('Scegli il primo estremo.', 'Ora il secondo estremo.'),
	ray: TWO('Scegli l’origine.', 'Ora un punto per cui passa.'),
	vector: TWO('Scegli l’inizio.', 'Ora la fine.'),
	parallel: LINE_AND_POINT,
	perpendicular: LINE_AND_POINT,
	bisector: TWO('Scegli il primo punto, oppure un segmento.', 'Ora il secondo punto.'),
	anglebisector: THREE_OR_LINES,
	tangent: (p) => (!p.length ? 'Scegli la curva, oppure il punto.' : p[0].kind === 'point' ? 'Ora la curva: una circonferenza, una conica, un grafico.' : 'Ora il punto: sulla curva, o fuori.'),
	circle: TWO('Scegli il centro.', 'Ora un punto della circonferenza.'),
	circler: TWO('Scegli il centro.', 'Scrivi il raggio.'),
	compass: (p) => ['Scegli un segmento, o il primo di due punti: la loro distanza è il raggio.', 'Ora il secondo punto.', 'Ora il centro.'][p.length],
	circle3: (p) => ['Scegli il primo punto.', 'Ora il secondo.', 'Ora il terzo.'][p.length],
	polygon: (p) => (p.length < 3 ? ['Scegli il primo vertice.', 'Ora il secondo.', 'Ora il terzo.'][p.length] : 'Un altro vertice, oppure torna sul primo per chiudere.'),
	distance: TWO('Scegli un punto, o una retta.', 'Ora il secondo punto, o una retta.'),
	angle: THREE_OR_LINES,
		slope: () => 'Scegli una retta.',
	reflect: TWO('Scegli l’oggetto da specchiare.', 'Ora la retta, oppure il punto, rispetto a cui specchiarlo.'),
	translate: (p) => ['Scegli l’oggetto da spostare.', 'Ora un vettore, oppure il punto da cui parte lo spostamento.', 'Ora il punto in cui arriva.'][p.length],
	rotate: (p) => ['Scegli l’oggetto da ruotare.', 'Ora il centro della rotazione.', 'Scrivi l’angolo, in gradi.'][p.length],
	dilate: (p) => ['Scegli l’oggetto da ingrandire o ridurre.', 'Ora il centro dell’omotetia.', 'Scrivi il rapporto.'][p.length],
	regression: (p) => (p.length < 2 ? ['Scegli il primo punto.', 'Ora il secondo.'][p.length] : 'Un altro punto, oppure torna sul primo per finire.')
};

export function useGeometryTool({ rows, geos, used, xUnit, append }: Args) {
	const [tool, setTool] = useState<ToolId>('move');
	const [picks, setPicks] = useState<Picked[]>([]);
	const [hover, setHover] = useState<Target | null>(null);
	const [note, setNote] = useState<string | null>(null);
	const [ask, setAsk] = useState<Ask | null>(null);

	const reset = () => {
		setPicks([]);
		setHover(null);
		setNote(null);
		setAsk(null);
	};
	const choose = (next: ToolId) => {
		setTool(next);
		reset();
	};
	/** Esc: first lets go of what was chosen, then of the tool. */
	const cancel = () => {
		if (picks.length) reset();
		else choose('move');
	};

	/** What a click or the pointer at this place of the plane means. */
	const locate = (plane: Point, scale: PlaneScale): Target => {
		const p = { x: plane.x * xUnit, y: plane.y };
		const sx = scale.sx / xUnit;
		const sy = scale.sy;
		const seen = rows.filter((r) => !r.hidden && geos.has(r.id)).map((r) => ({ id: r.id, geo: geos.get(r.id)!, far: reach(geos.get(r.id)!, p, sx, sy) }));
		const near = seen.filter((o) => o.geo.kind !== 'point' && o.far <= OBJECT_REACH).sort((a, b) => a.far - b.far);
		const object = near[0]?.id;

		const point = seen.filter((o) => o.geo.kind === 'point' && o.far <= POINT_REACH).sort((a, b) => a.far - b.far)[0];
		if (point) return { kind: 'point', id: point.id, at: point.geo as Point, object };

		let meet: { of: [number, number]; index: number; at: Point } | null = null;
		let nearest = POINT_REACH;
		const few = near.slice(0, 4);
		for (let i = 0; i < few.length; i++)
			for (let k = i + 1; k < few.length; k++) {
				if (!canMeet(few[i].geo, few[k].geo)) continue;
				const common = intersections(few[i].geo, few[k].geo);
				for (let index = 0; index < common.length; index++) {
					const far = Math.hypot((common[index].x - p.x) * sx, (common[index].y - p.y) * sy);
					if (far > nearest) continue;
					nearest = far;
					meet = { of: [few[i].id, few[k].id], index, at: common[index] };
				}
			}
		if (meet) return { kind: 'meet', ...meet, object };

		if (near[0]) {
			const param = project(near[0].geo, p);
			const at = param === null ? null : pointAt(near[0].geo, param);
			if (param !== null && at) return { kind: 'on', of: near[0].id, param, at, object };
		}

		// a free point stops where the lines of the grid cross, when it is near
		const snap = (v: number, step: number, pixels: number) => {
			const line = Math.round(v / step) * step;
			// off the grid, the decimals a pixel can tell apart
			return Math.abs(line - v) * pixels < 8 ? tidy(line) : Number(v.toFixed(Math.min(8, Math.max(0, Math.ceil(Math.log10(pixels))))));
		};
		return { kind: 'free', at: { x: snap(p.x, scale.gx * xUnit, sx), y: snap(p.y, scale.gy, sy) }, object };
	};

	const straight = (id: number | undefined) => (id !== undefined && geos.get(id)?.kind === 'line' ? id : undefined);
	/** A conic or the graph of a function: what a tangent touches. */
	const curved = (id: number | undefined) => (id !== undefined && ['conic', 'curve'].includes(geos.get(id)?.kind ?? '') ? id : undefined);

	/** The rows a tool adds, with their names: what a click and an answer have in common. */
	const maker = () => {
		const added: PlotRow[] = [];
		const names = new Set(used);
		const take = (kind: 'point' | 'line' | 'circle' | 'angle', wish?: string) => {
			const name = freshName(kind, names, wish);
			names.add(name);
			return name;
		};
				const fresh = () => newRow([...rows, ...added]);
		/** The image of an object: a point keeps a letter, a line and a circle theirs, a segment or a polygon none. */
		const imageOf = (b: Build, subject: number, make: (b: Build, name?: string, label?: boolean) => number, name: (kind: 'point' | 'line' | 'circle' | 'angle', wish?: string) => string) => {
			const geo = geos.get(subject);
			if (geo?.kind === 'point') make(b, name('point'));
			else if (geo?.kind === 'line' && !geo.segment) make(b, name('line'));
			else if (geo?.kind === 'conic') make(b, name('circle'));
			else make(b);
		};
		// a line or a circle has its letter written beside it; a point always has
		const build = (b: Build, name?: string, label = !!name) => added.push({ ...fresh(), build: b, ...(name ? { name } : {}), ...(label ? { label: true } : {}) });
		return { added, take, fresh, build, imageOf };
	};

	const onPick = (plane: Point, scale: PlaneScale) => {
		// a tool that waits for a number or a choice does not take clicks
		if (ask) return;
		const target = locate(plane, scale);
		const { added, take, fresh, build, imageOf } = maker();
		/** The row of the point under the click: the one that is there, or a new one. */
		const pointId = (t: Target): number => {
			if (t.kind === 'point') return t.id;
			const name = take('point');
			const row: PlotRow =
				t.kind === 'free'
					? { ...fresh(), placed: true, latex: `${name}=\\left(${latexNumber(t.at.x)};${latexNumber(t.at.y)}\\right)` }
					: { ...fresh(), name, build: t.kind === 'on' ? { type: 'on', of: [t.of], at: t.param } : { type: 'meet', of: t.of, index: t.index } };
			added.push(row);
			return row.id;
		};
		let next: Picked[] = picks;
		let say: string | null = null;
		let question: Ask | null = null;
		const has = (id: number) => picks.some((p) => p.id === id);

		const twoPoints = (finish: (a: number, b: number) => void) => {
			const id = pointId(target);
			if (!picks.length) next = [{ id, kind: 'point' }];
			else if (id !== picks[0].id) {
				finish(picks[0].id, id);
				next = [];
			}
		};
		/** What is built on the object under the click, when it is of this type: a segment taken for its two ends. */
		const builtUnder = (type: Build['type']) => {
			if (picks.length || target.kind === 'point' || target.object === undefined) return null;
			const row = rows.find((r) => r.id === target.object);
			return row?.build?.type === type ? row.build : null;
		};
					/** The row under the click, when it was built as this type: a vector, taken as it is. */
			const builtUnderAny = (type: Build['type']) => {
				const row = target.object === undefined ? undefined : rows.find((r) => r.id === target.object);
				return row?.build?.type === type ? row.id : null;
			};
			/** The image of an object under a transformation, with the name its kind takes. */
			const image = (b: Build, subject: number) => imageOf(b, subject, build, take);
			/** Three points, vertex second, or two lines: the bisector of an angle and its size ask for the same. */
		const pointsOrLines = (ofPoints: (a: number, b: number, c: number) => void, ofLines: (g: number, h: number) => void) => {
			const line = straight(target.object);
			if (!picks.length) next = [target.kind !== 'point' && line !== undefined ? { id: line, kind: 'line' } : { id: pointId(target), kind: 'point' }];
			else if (picks[0].kind === 'line') {
				if (line === undefined || line === picks[0].id) say = 'Qui non c’è un’altra retta.';
				else {
					ofLines(picks[0].id, line);
					next = [];
				}
			} else {
				const id = pointId(target);
				if (has(id)) return;
				if (picks.length < 2) next = [...picks, { id, kind: 'point' }];
				else {
					ofPoints(picks[0].id, picks[1].id, id);
					next = [];
				}
			}
		};

		switch (tool) {
			case 'move':
				return;
			case 'point':
				pointId(target);
				break;
			case 'line':
			case 'ray':
				twoPoints((a, b) => build({ type: tool, of: [a, b] }, take('line')));
				break;
			case 'segment':
			case 'vector':
				twoPoints((a, b) => build({ type: tool, of: [a, b] }));
				break;
			case 'circle':
				twoPoints((a, b) => build({ type: 'circle', of: [a, b] }, take('circle')));
				break;
			case 'midpoint':
			case 'bisector': {
				const finish = (a: number, b: number) => (tool === 'midpoint' ? build({ type: 'midpoint', of: [a, b] }, take('point', 'M')) : build({ type: 'bisector', of: [a, b] }, take('line')));
				const segment = builtUnder('segment');
				if (segment) finish(segment.of[0], segment.of[1]);
				else twoPoints(finish);
				break;
			}
			case 'circle3': {
				const id = pointId(target);
				if (has(id)) break;
				if (picks.length < 2) next = [...picks, { id, kind: 'point' }];
				else {
					build({ type: 'circle3', of: [picks[0].id, picks[1].id, id] }, take('circle'));
					next = [];
				}
				break;
			}
			case 'circler':
				next = [{ id: pointId(target), kind: 'point' }];
				question = { kind: 'number', label: 'Raggio' };
				break;
			case 'compass': {
				const segment = builtUnder('segment');
				if (segment) {
					next = [
						{ id: segment.of[0], kind: 'point' },
						{ id: segment.of[1], kind: 'point' }
					];
					break;
				}
				const id = pointId(target);
				if (picks.length < 2) {
					if (!has(id)) next = [...picks, { id, kind: 'point' }];
				} else {
					build({ type: 'compass', of: [picks[0].id, picks[1].id, id] }, take('circle'));
					next = [];
				}
				break;
			}
			case 'centre': {
				const triangle = builtUnder('polygon');
				if (triangle?.of.length === 3) next = triangle.of.map((id) => ({ id, kind: 'point' as const }));
				else {
					const id = pointId(target);
					if (has(id)) break;
					next = [...picks, { id, kind: 'point' }];
				}
				if (next.length === 3) question = { kind: 'choice', options: CENTRES };
				break;
			}
			case 'polygon': {
				const id = pointId(target);
				if (picks.length >= 3 && id === picks[0].id) {
					build({ type: 'polygon', of: picks.map((p) => p.id) });
					next = [];
				} else if (!has(id) && picks.length < MAX_VERTICES) next = [...picks, { id, kind: 'point' }];
				break;
			}
			case 'parallel':
			case 'perpendicular': {
				const line = straight(target.object);
				const have = picks[0];
				if (!have) next = [target.kind !== 'point' && line !== undefined ? { id: line, kind: 'line' } : { id: pointId(target), kind: 'point' }];
				else if (have.kind === 'line') {
					build({ type: tool, of: [have.id, pointId(target)] }, take('line'));
					next = [];
				} else if (line !== undefined) {
					build({ type: tool, of: [line, have.id] }, take('line'));
					next = [];
				} else say = 'Qui non c’è una retta.';
				break;
			}
			case 'anglebisector':
				pointsOrLines(
					(a, b, c) => build({ type: 'anglebisector', of: [a, b, c] }, take('line')),
					(g, h) => [0, 1].forEach((index) => build({ type: 'anglebisector', of: [g, h], index }, take('line')))
				);
				break;
			case 'angle':
				pointsOrLines(
					(a, b, c) => build({ type: 'angle', of: [a, b, c] }, take('angle'), false),
					(g, h) => build({ type: 'angle', of: [g, h] }, take('angle'), false)
				);
				break;
			case 'tangent': {
				const curve = curved(target.object);
				const have = picks[0];
				const finish = (point: number, at: Point, on: number) => {
					const count = tangents(at, geos.get(on)!).length;
					if (!count) say = 'Da questo punto non partono tangenti: è dentro la curva.';
					for (let index = 0; index < count; index++) build({ type: 'tangent', of: [point, on], index }, take('line'));
					next = [];
				};
				if (!have) next = [target.kind !== 'point' && curve !== undefined ? { id: curve, kind: 'object' } : { id: pointId(target), kind: 'point' }];
				else if (have.kind === 'object') finish(pointId(target), target.at, have.id);
				else if (curve !== undefined) finish(have.id, geos.get(have.id) as Point, curve);
				else say = 'Qui non c’è una curva: scegli una circonferenza, una conica o un grafico.';
				break;
			}
						case 'reflect':
			case 'translate':
			case 'rotate':
			case 'dilate': {
				// the object first: the point under the click, or what is drawn there, or a new point
				if (!picks.length) {
					next = [target.kind !== 'point' && target.object !== undefined ? { id: target.object, kind: 'object' } : { id: pointId(target), kind: 'point' }];
					break;
				}
				const subject = picks[0].id;
				if (tool === 'reflect') {
					const line = straight(target.object);
					const mirror = target.kind !== 'point' && line !== undefined ? line : pointId(target);
					if (mirror !== subject) {
						image({ type: 'reflect', of: [subject, mirror] }, subject);
						next = [];
					}
				} else if (tool === 'translate') {
					const vector = picks.length === 1 && target.kind !== 'point' ? builtUnderAny('vector') : null;
					if (vector !== null) {
						image({ type: 'translate', of: [subject, vector] }, subject);
						next = [];
					} else if (picks.length === 1) next = [...picks, { id: pointId(target), kind: 'point' }];
					else {
						const to = pointId(target);
						if (to !== picks[1].id) {
							image({ type: 'translate', of: [subject, picks[1].id, to] }, subject);
							next = [];
						}
					}
				} else {
					next = [...picks, { id: pointId(target), kind: 'point' }];
					question = { kind: 'number', label: tool === 'rotate' ? 'Angolo in gradi' : 'Rapporto' };
				}
				break;
			}
			case 'regression': {
				const id = pointId(target);
				if (picks.length >= 2 && id === picks[0].id) {
					build({ type: 'regression', of: picks.map((p) => p.id) }, take('line'));
					next = [];
				} else if (!has(id) && picks.length < MAX_VERTICES) next = [...picks, { id, kind: 'point' }];
				break;
			}
			case 'slope': {
				const line = straight(target.object);
				if (line === undefined) say = 'Qui non c’è una retta.';
				else build({ type: 'slope', of: [line] });
				break;
			}
			case 'meet': {
				if (!picks.length && target.kind === 'meet') {
					pointId(target);
					break;
				}
				const id = target.object;
				if (id === undefined) say = 'Qui non c’è un oggetto: scegli una retta, una circonferenza, una parabola.';
				else if (!picks.length) next = [{ id, kind: 'object' }];
				else if (id !== picks[0].id) {
					const [g, h] = [geos.get(picks[0].id)!, geos.get(id)!];
					const points = canMeet(g, h) ? intersections(g, h) : null;
					if (!points) say = 'Per ora le intersezioni si trovano tra rette, circonferenze e coniche.';
					else if (!points.length) say = 'I due oggetti non si incontrano.';
					else
						points.forEach((at, index) => {
							// a tangent gives the same point twice
							if (index && Math.hypot(at.x - points[0].x, at.y - points[0].y) < 1e-9) return;
							build({ type: 'meet', of: [picks[0].id, id], index }, take('point'));
						});
					next = [];
				}
				break;
			}
			case 'distance': {
				const line = straight(target.object);
				const one: Picked = target.kind !== 'point' && line !== undefined ? { id: line, kind: 'line' } : { id: pointId(target), kind: 'point' };
				if (!picks.length) next = [one];
				else if (one.id !== picks[0].id) {
					build({ type: 'distance', of: [picks[0].id, one.id] });
					next = [];
				}
				break;
			}
		}
		if (added.length) append(added);
		setPicks(next);
		setNote(say);
		setAsk(question);
		setHover(null);
	};

	/** The number typed, or the choice made, for the tool that was waiting for it. False when it cannot be used. */
	const answer = (value: number): boolean => {
		const { added, take, build, imageOf } = maker();
		if ((tool === 'rotate' || tool === 'dilate') && picks.length === 2) {
			if (!Number.isFinite(value) || (tool === 'dilate' && value === 0)) return false;
			imageOf({ type: tool, of: [picks[0].id, picks[1].id], at: tidy(value) }, picks[0].id, build, take);
		} else if (tool === 'circler' && picks[0]) {
			if (!(value > 0)) return false;
			build({ type: 'circler', of: [picks[0].id], at: tidy(value) }, take('circle'));
		} else if (tool === 'centre' && picks.length === 3) build({ type: 'centre', of: picks.map((p) => p.id), index: value }, take('point', CENTRE_LETTERS[value]));
		else return false;
		append(added);
		reset();
		return true;
	};

	const onHover = (plane: Point | null, scale: PlaneScale) => {
		const target = plane && !ask ? locate(plane, scale) : null;
		setHover((was) => (was && target && was.kind === target.kind && was.at.x === target.at.x && was.at.y === target.at.y && was.object === target.object ? was : target));
	};

	// What the next click would make, drawn before it: the point under the pointer, and the object when this is its last click.
	const preview: { curves: PlaneCurve[]; marks: PlaneMark[] } = { curves: [], marks: [] };
	if (tool !== 'move' && hover) {
		const onLine = straight(hover.object);
		const first = picks[0];
		const wantsObject = tool === 'meet' || tool === 'slope' || ((tool === 'parallel' || tool === 'perpendicular' || tool === 'tangent') && first?.kind === 'point') || ((tool === 'angle' || tool === 'anglebisector') && first?.kind === 'line');
		if (hover.kind !== 'point' && !wantsObject) preview.marks.push({ id: 'preview', at: { x: hover.at.x / xUnit, y: hover.at.y }, color: PREVIEW });
		const pointer = hover.kind === 'point' ? hover.id : POINTER;
		const get = (id: number): Geo => (id === POINTER ? { kind: 'point', ...hover.at } : (geos.get(id) ?? { kind: 'none', why: '' }));
		let build: Build | null = null;
		if (first && (tool === 'line' || tool === 'segment' || tool === 'ray' || tool === 'vector' || tool === 'circle' || tool === 'bisector' || tool === 'midpoint' || tool === 'distance')) build = { type: tool, of: [first.id, tool === 'distance' && hover.kind !== 'point' && onLine !== undefined ? onLine : pointer] };
		else if ((tool === 'circle3' || tool === 'compass' || tool === 'anglebisector') && picks.length === 2 && first.kind === 'point') build = { type: tool, of: [picks[0].id, picks[1].id, pointer] };
		else if ((tool === 'parallel' || tool === 'perpendicular') && first) build = first.kind === 'line' ? { type: tool, of: [first.id, pointer] } : onLine !== undefined ? { type: tool, of: [onLine, first.id] } : null;
		else if (tool === 'polygon' && first) build = { type: 'polygon', of: [...picks.map((p) => p.id), pointer] };
		let geo = build && new Set(build.of).size === build.of.length ? construct(build, get) : null;
		// two vertices are not a polygon yet: the side so far
		if (build?.type === 'polygon' && build.of.length === 2) geo = construct({ type: 'segment', of: build.of }, get);
		const shape = geo && shapeOf(geo, xUnit);
		if (shape) preview.curves.push({ ...shape, id: 'preview', color: PREVIEW, width: 'thin', dash: 'dashed' });
		if (geo?.kind === 'point') preview.marks.push({ id: 'preview-point', at: { x: geo.x / xUnit, y: geo.y }, color: PREVIEW });
	}

	const pick: PlanePick | undefined = tool === 'move' ? undefined : { onPick, onHover };
	return { tool, choose, cancel, pick, preview, hint: note ?? HINTS[tool](picks), ask, answer };
}
