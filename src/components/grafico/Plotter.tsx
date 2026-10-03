'use client';

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Dices, Download, FolderOpen, GripVertical, Keyboard, Lightbulb, Link2, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, Plus, Redo2, Settings, SlidersHorizontal, Trash2, Undo2, X } from 'lucide-react';
import { MathField, type MathFieldHandle } from '@/components/math/MathField';
import { PLOT_LAYOUTS, loadMathLive, useKeyboardChoice } from '@/components/math/mathlive';
import { makeWritten, readLabel, readWritten, tidyName, track, type CommandArg, type Made } from '@/lib/grafico/comandi';
import { italian } from '@/lib/grafico/assi';
import { integral, mainRange, type Point } from '@/lib/grafico/curva';
import { DEFAULT_SLIDER, EXAMPLES, HOME, decodeState, encodeState, newRow, type Camera, type PlotDoc, type PlotRow, type PlotState, type SliderSpec } from '@/lib/grafico/documento';
import { COORDINATE, GREEK, MAX_TERMS, cleanLatex, definitions, freeName, isUnnamedFunction, limit, pointNames, readEntry, reseed, sequences, type Entry, type Json } from '@/lib/grafico/formula';
import { asymptotes } from '@/lib/grafico/notevoli';
import { construct, fromFunction, fromImplicit, project, texAngle, texNumber, texRoot, type Geo } from '@/lib/grafico/geometria';
import { Tex } from '@/components/content/interactive/kit';
import { cn } from '@/lib/utils/cn';
import { downloadPlane, standaloneSvg } from './export';
import { useAuth } from '@/lib/state/auth';
import { PLOT_COMPLETER } from './completer';
import { SavedPlots, overwritePlot } from './SavedPlots';
import { GeometryBar, ToolHint } from './GeometryBar';
import { TOOL_EVENT, describe, equationsOf, plainName, plainTex, previewOf, shapeOf, toolOf, useGeometryTool, writtenRows, type ToolId } from './geometry';
import { Plane, type PlaneCurve, type PlaneHandle, type PlaneMark } from './Plane';
import { Collapse, IconButton, InsertMenu, NumberBox, SectionHead, useStoredNumber, ParamSlider, PlaneSettingsPanel, Popover, RowStyle, ValueTable, usePresence, type WindowBounds } from './PlotterParts';
import { useHistory } from './useHistory';

/**
 * The plotter (vault/Prodotti/Studenti/Grafico di funzioni.md): one frame with a bar of actions, the panel of the
 * formulas and their parameters, and the plane that draws them. The page gives the starting formulas already read
 * (MathJSON), so their curves are in the HTML; the reader of LaTeX and MathLive arrive in the browser, for what the
 * student writes. A graph is data (lib/grafico/documento.ts): undo steps through it and a link carries it.
 */

export interface PlotterFormula {
	latex: string;
	json: Json;
}

type Parse = (latex: string) => Json;

/** A point of the plane that is not a curve's, and what a drag of it changes. */
interface Spot {
	id: string;
	row: number;
	/** `glide` is a point bound to an object, dragged along it; `label` a text with no dot, the length on a distance. */
	role: 'point' | 'fixed' | 'tangent' | 'areaStart' | 'areaEnd' | 'glide' | 'label';
	at: { x: number; y: number };
	color: string;
	name?: string;
	text?: string;
}

/** A number as a formula field writes it: 2,5 with MathLive's decimal comma. */
const latexNumber = (x: number) => String(Number(x.toPrecision(10))).replace('.', '{,}');
type Panel = 'settings' | 'examples' | 'download' | 'clear' | 'library';

/** The width of the window, in units, on a phone. */
const NARROW_SPAN = 10;
/** The seconds a slider takes from one end to the other. */
const SWEEP = { slow: 16, normal: 8, fast: 4 };
const FALLBACK_SIZE = { w: 800, h: 560 };
/** The degrees in a unit of the plane: with the angles in degrees the x axis is read in degrees, and 90° sits where π/2 does. */
const DEGREES = 180 / Math.PI;

/** Where t runs for a curve (x(t), y(t)): what the row says, or a whole turn. */
function tRange(row: PlotRow, degrees: boolean): [number, number] {
	return [row.t0 ?? 0, row.t1 ?? (degrees ? 360 : 2 * Math.PI)];
}
/** The width of the panel on a wide screen, in pixels: where it starts and how far the handle takes it. */
const SIDE = { start: 368, min: 220, max: 720 };
/** The rows of the second section: what a tool made on the plane, points and objects built on them. */
/** The names of the points made with the tools, as a formula can write them: A, M, A_1. */
const builtPoints = (rows: PlotRow[]) => rows.flatMap((r) => (r.build && r.name && /^[A-Z]/.test(r.name) ? [r.name.replace(/[{}]/g, '')] : []));
const inConstruction = (row: PlotRow) => !!row.build || !!row.placed;
/** The name written before a colon in a row that is not a function: of a line, of a circle, of a region. A function has its own. */
const labelOf = (row: PlotRow) => {
	const label = row.build ? null : readLabel(row.latex);
	return label && !label.function ? label.name : undefined;
};
/** An equation of a built object: KaTeX writes it again only when it changes, not at every step of a drag of the plane. */
const Formula = memo(function Formula({ tex }: { tex: string }) {
	return <Tex>{tex}</Tex>;
});
/** What the plane is given when a tool is tried from the guide and has nothing to work on. */
const TRY = { line: 'y=\\frac{x}{2}-1', circle: 'x^2+y^2=4' };
const NOT_AN_OBJECT: Geo = { kind: 'none', why: 'Serve un punto, una retta o una curva: la riga da cui partiva è cambiata o non c’è più.' };
/** The colour of what helps to read a drawing and is not a curve of the student's: the line y = x of a cobweb. */
const GUIDE = '#808080';
/** Pixels between the strokes of a field of slopes, and half the length of a stroke. */
const FIELD = { gap: 30, half: 9 };
const NO_VALUES =  'In questa parte del piano la funzione non ha valori: controlla il dominio, o spostati.';

export function Plotter({
	initial,
	read,
	view = false,
	origin = null,
	onState,
	onOrigin
}: {
	initial: PlotState;
	/** The reading of the starting formulas, made on the server; empty where the page has none, and the browser reads them. */
	read: PlotterFormula[];
	/** Only the plane, with what the graph draws and nothing to change it with: a graph shown in a note. */
	view?: boolean;
	/** The saved graph this one was loaded from: "Salva" writes over it. */
	origin?: { id: string; title: string } | null;
	/** Told the graph as a link would carry it, each time it changes: a note keeps its own copy. */
	onState?: (code: string) => void;
	/** Told the saved graph the plane now comes from, after a load or a save. */
	onOrigin?: (origin: { id: string; title: string } | null) => void;
}) {
	const { value: doc, change, undo, redo, canUndo, canRedo } = useHistory<PlotDoc>(() => ({ rows: initial.rows, sliders: initial.sliders, settings: initial.settings }));
	const [home, setHome] = useState<Camera>(initial.camera);
	const [camera, setCamera] = useState<Camera>(initial.camera);
	const [parse, setParse] = useState<Parse | null>(null);
	const [keyboard, setKeyboard] = useKeyboardChoice();
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [panel, setPanel] = useState<Panel | null>(null);
	const [content, setContent] = useState<Panel | null>(null);
	const [styled, setStyled] = useState<number | null>(null);
	const [sidebar, setSidebar] = useState(true);
	const [closed, setClosed] = useState({ formulas: false, built: false });
	const [full, setFull] = useState(false);
	const [copied, setCopied] = useState(false);
	const [playing, setPlaying] = useState<Record<string, true>>({});
		// Counts the times the numbers by chance were drawn again: what is drawn with them is found again.
	const [seed, setSeed] = useState(0);
	// The row whose formula is being written, until Enter or the focus leaving it.
	const [editing, setEditing] = useState<number | null>(null);
	const root = useRef<HTMLDivElement>(null);
	// The width of the panel: the one remembered on this device, or the one being dragged.
	const [savedSide, saveSide] = useStoredNumber('sapiens:plot-side', SIDE.start);
	const [dragWidth, setDragWidth] = useState<number | null>(null);
	const fitSide = (px: number) => Math.round(Math.max(SIDE.min, Math.min(SIDE.max, px, (root.current?.clientWidth ?? 1200) - 320)));
	const side = dragWidth ?? fitSide(savedSide);
	const plane = useRef<PlaneHandle>(null);
	const sidePanel = useRef<HTMLDivElement>(null);
	// Closed on a wide screen, the panel is out of reach of Tab; on a narrow one it is always there.
	useEffect(() => {
		const wide = window.matchMedia('(min-width: 64rem)');
		const apply = () => sidePanel.current && (sidePanel.current.inert = !sidebar && wide.matches);
		apply();
		wide.addEventListener('change', apply);
		return () => wide.removeEventListener('change', apply);
	}, [sidebar]);
	const fields = useRef(new Map<number, MathFieldHandle>());
	const { rows, sliders, settings } = doc;

	// ------------------------------------------------------------ loading

	// A narrow screen starts closer: the same squares as on a wide one, fewer of them. Before the first paint.
	useLayoutEffect(() => {
		if (!root.current || root.current.clientWidth >= 640 || initial.camera.span !== HOME.span) return;
		const narrow = { ...initial.camera, span: NARROW_SPAN };
		setHome(narrow);
		setCamera(narrow);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let cancelled = false;
		import('@cortex-js/compute-engine/latex-syntax')
			.then((m) => !cancelled && setParse(() => (latex: string) => m.parse(latex) as Json))
			.catch((err) => console.error('latex-syntax:', err));
		return () => {
			cancelled = true;
		};
	}, []);

	/** What the fields show follows a graph put in place from outside them: an undo, a link, an example. */
	const [synced, setSynced] = useState(0);
	const current = useRef(doc);
	useEffect(() => {
		current.current = doc;
	});
	useEffect(() => {
		if (synced) for (const row of current.current.rows) fields.current.get(row.id)?.set(row.latex);
	}, [synced]);

	const load = useCallback(
		(state: PlotState) => {
			change({ rows: state.rows, sliders: state.sliders, settings: state.settings });
			setCamera(state.camera);
			setHome(state.camera);
			setPlaying({});
			setStyled(null);
			setHeld(null);
			setSynced((n) => n + 1);
		},
		[change]
	);

	// A link to a graph carries it after "#g=".
	useEffect(() => {
		const code = /^#g=(.+)$/.exec(window.location.hash)?.[1];
		const state = code ? decodeState(code) : null;
		if (state) load(state);
	}, [load]);

	// ------------------------------------------------------------ reading the formulas

	const entries: Entry[] = useMemo(() => {
		const given = new Map(read.map((r) => [r.latex, r.json]));
		const jsons = rows.map((row): Json | null => {
			// a command of geometry, retta(A; B), is not a formula: it is read by itself, further down
			if (!row.latex.trim() || readWritten(row.latex)) return null;
			// nor are the letters of a word on its way, "tra" before "tratti": they are not a product to draw
			if (row.id === editing && /^[a-z]{2,}$/.test(row.latex) && track(row.latex)?.word === row.latex) return null;
			// "r: y = 2x + 1" is the formula after the colon, with r as its name
			if (parse) return parse(cleanLatex(readLabel(row.latex)?.formula ?? row.latex));
			return given.get(row.latex) ?? null;
		});
		// a row "f(x) = …" names a function the other rows can use: f(x) + 1, f′(x)
				const defs = definitions(jsons.filter((j): j is Json => j !== null));
		// a row "a_{n+1} = …" makes a sequence, and a_5 in another row is its term
		const seqs = sequences(jsons.filter((j): j is Json => j !== null));
		return jsons.map((j) => (j === null ? { kind: 'empty' } : readEntry(j, defs, { degrees: settings.degrees, sequences: seqs, points: [...pointNames(jsons.filter((k): k is Json => k !== null)), ...builtPoints(rows)] })));
	}, [rows, parse, read, settings.degrees, editing]);

	// on the polar grid the x axis measures the radius, a length: only the angles are in degrees
	const polarGrid = settings.grid && settings.polar;
	const xUnit = settings.degrees && !polarGrid ? DEGREES : 1;
	// The rows of the points with a name: a formula takes their coordinates as x_P and y_P, which are not parameters with a slider.
	const pointRows = useMemo(() => {
		const byName = new Map<string, number>();
		rows.forEach((row, i) => {
			const entry = entries[i];
			const name = row.build ? row.name?.replace(/[{}]/g, '') : entry.kind === 'point' ? entry.name : undefined;
			if (name && !byName.has(name)) byName.set(name, row.id);
		});
		return byName;
	}, [rows, entries]);
	const params = useMemo(() => [...new Set(entries.flatMap((e) => ('params' in e ? e.params : [])))].filter((p) => !pointRows.has(COORDINATE.exec(p)?.[2] ?? '')).sort(), [entries, pointRows]);
	const specOf = useCallback((name: string): SliderSpec => sliders[name] ?? DEFAULT_SLIDER, [sliders]);
	// While a formula is being written its letters draw the curve, each worth what its slider says or 1, but the
	// sliders on show stay the ones there were: "tra" on the way to "tratti" is not three parameters. The list
	// follows the formulas again once the writing is confirmed, by Enter or by leaving the field.
	const [held, setHeld] = useState<string[] | null>(null);
	const paramsNow = useRef(params);
	useEffect(() => {
		paramsNow.current = params;
	});
	const shownParams = held ?? params;

		/** The value of a letter of a formula: a coordinate of a point (x_P), read from the point as it is now, or a parameter's slider. */
	const valueOf = useCallback(
		(name: string, get: (id: number) => Geo | undefined) => {
			const coordinate = COORDINATE.exec(name);
			const row = coordinate ? pointRows.get(coordinate[2]) : undefined;
			if (!coordinate || row === undefined) return specOf(name).value;
			const point = get(row);
			return point?.kind === 'point' ? point[coordinate[1] as 'x' | 'y'] : NaN;
		},
		[pointRows, specOf]
	);

	/**
	 * Every row as an object of geometry, where it is one: a point, a line or a circle written as a formula, and what
	 * is built from other rows, found again from them.
	 */
	const geos = useMemo(() => {
		const found = new Map<number, Geo>();
		const open = new Set<number>();
		const place = new Map(rows.map((r, i) => [r.id, i]));
		const get = (id: number): Geo => {
			const known = found.get(id);
			if (known) return known;
			const i = place.get(id);
			let geo = NOT_AN_OBJECT;
			if (i !== undefined && !open.has(id)) {
				open.add(id);
				const row = rows[i];
				const entry = entries[i];
				if (row.build) geo = construct(row.build, get);
				else if (entry.kind === 'point' || entry.kind === 'function' || entry.kind === 'implicit') {
										const scope: Record<string, number> = { x: 0, y: 0, t: 0, theta: 0 };
					for (const p of entry.params) scope[p] = valueOf(p, get);
					if (entry.kind === 'point') geo = { kind: 'point', x: entry.x(scope), y: entry.y(scope) };
					else if (entry.kind === 'function') geo = fromFunction((x) => ((scope.x = x), entry.f(scope)));
					else geo = fromImplicit((x, y) => ((scope.x = x), (scope.y = y), entry.f(scope))) ?? NOT_AN_OBJECT;
				}
				open.delete(id);
			}
			found.set(id, geo);
			return geo;
		};
		rows.forEach((r) => get(r.id));
		return found;
	}, [rows, entries, valueOf]);


	/**
	 * What the rows put on the plane: their curves and regions, the points that are not curves (the student's points,
	 * the foot of a tangent, the ends of an area) and, for the table of values, each function as the axis reads it.
	 */
	const drawing = useMemo(() => {
		const curves: PlaneCurve[] = [];
		const spots: Spot[] = [];
		/** The fields of slopes, for the curves that follow them through the points of the plane. */
		const fields: { row: PlotRow; slope: (X: number, y: number) => number; stamp: string }[] = [];
				const functions = new Map<number, (x: number) => number>();
		// the rows that give a name to a function: what any other formula may be using
		const named = rows.filter((_, i) => ['definition', 'sequence', 'given', 'orbit'].includes(entries[i].kind) || (entries[i].kind === 'point' && /_\d+$/.test(entries[i].name ?? '')) || (entries[i].kind === 'function' && 'name' in entries[i] && entries[i].name)).map((r) => r.latex).join('\n');
		rows.forEach((row, i) => {
			const entry = entries[i];
			if (row.build) {
				const geo = geos.get(row.id);
				if (!geo || row.hidden) return;
				const name = row.name ? plainName(row.name) : undefined;
				if (geo.kind === 'point') {
					spots.push({ id: `built:${row.id}`, row: row.id, role: row.build.type === 'on' ? 'glide' : 'fixed', at: { x: geo.x / xUnit, y: geo.y }, color: row.color, name });
					return;
				}
				// an angle and a slope have their size written beside them; an angle of geometry is read in degrees, whatever the functions use
				const shape = shapeOf(geo, xUnit, geo.kind === 'angle' ? plainTex(texAngle(geo.value, true)) : geo.kind === 'slope' ? `m = ${plainTex(texNumber(geo.value))}` : '');
				
				if (!shape) return;
				const measure = geo.kind === 'measure';
								// a built object is what its numbers are
				const size = geo.kind === 'angle' ? plainTex(texAngle(geo.value, true)) : geo.kind === 'slope' ? `m = ${plainTex(texNumber(geo.value))}` : '';
				curves.push({ ...shape, id: String(row.id), stamp: `${JSON.stringify(geo)}|${xUnit}|${size}`, color: row.color, width: measure ? 'thin' : row.width, dash: measure ? 'dashed' : row.dash, label: row.label ? name : undefined });
				if (measure) spots.push({ id: `measure:${row.id}`, row: row.id, role: 'label', at: { x: (geo.from.x + geo.to.x) / 2 / xUnit, y: (geo.from.y + geo.to.y) / 2 }, color: row.color, text: plainTex(texRoot(geo.value ** 2)) });
				return;
			}
			// a function of two letters gives the other rows a name to use, and draws nothing itself
						if (entry.kind === 'empty' || entry.kind === 'error' || entry.kind === 'definition' || entry.kind === 'given') return;
			// one scope for all the evaluations of a curve: the sampling calls it thousands of times a frame
			const scope: Record<string, number> = { x: 0, y: 0, t: 0, theta: 0 };
									for (const p of entry.params) scope[p] = valueOf(p, (id) => geos.get(id));
			// What the curve is: its formula, the functions it may use, the values of its letters, how the plane reads it.
			// While this stays the same the plane does not find the curve again: dragging a point leaves the others alone.
			const stamp = `${row.latex}|${named}|${entry.params.map((p) => scope[p]).join(',')}|${xUnit}|${settings.degrees}|${row.t0},${row.t1}|${seed}`;
			const look = { id: String(row.id), stamp, color: row.color, width: row.width, dash: row.dash };

												if (entry.kind === 'orbit') {
				// the terms of a sequence of points, as many as the plotter keeps: a speck each, a figure together
				if (row.hidden) return;
				const { index, x, y, from } = entry;
				curves.push({
					...look,
					small: true,
					dots: () => {
						const points: Point[] = [];
						for (let k = from; k < from + MAX_TERMS; k++) {
							scope[index] = k;
							const at = { x: x(scope) / xUnit, y: y(scope) };
							if (Number.isFinite(at.x) && Number.isFinite(at.y)) points.push(at);
						}
						return points;
					}
				});
				return;
			}
			if (entry.kind === 'field') {
				if (row.hidden) return;
				// the slope at a place of the plane, as the plane's own axes read it
				const slope = (X: number, y: number) => ((scope.x = X * xUnit), (scope.y = y), entry.f(scope) * xUnit);
				fields.push({ row, slope, stamp });
				curves.push({
					...look,
					width: 'thin',
					dash: 'solid',
					// a short stroke at every crossing of a grid that stays with the plane, as long on the screen whatever its slope
					path: (view, sx, sy) => {
						const lines: Point[][] = [];
						const [gx, gy] = [FIELD.gap / sx, FIELD.gap / sy];
						for (let i = Math.ceil(view.x0 / gx); i * gx <= view.x1; i++)
							for (let j = Math.ceil(view.y0 / gy); j * gy <= view.y1; j++) {
								const [X, y] = [i * gx, j * gy];
								const m = slope(X, y);
								if (Number.isNaN(m)) continue;
								const [ux, uy] = Number.isFinite(m) ? [sx, m * sy] : [0, 1];
								const norm = Math.hypot(ux, uy);
								const [hx, hy] = [(FIELD.half * ux) / norm / sx, (FIELD.half * uy) / norm / sy];
								lines.push([
									{ x: X - hx, y: y - hy },
									{ x: X + hx, y: y + hy }
								]);
							}
						return { lines };
					}
				});
				return;
			}
			if (entry.kind === 'sequence') {
				// the terms of a sequence are points, (n; a_n), for the whole numbers in the window; one that depends on x has none
				if (row.hidden || entry.plane) return;
				const { index, f, from = 0 } = entry;
				if (row.cobweb && entry.step) {
					// the rule's curve, the line y = x, and the stair between them from the first term
					const g = entry.step;
					curves.push({ id: `${row.id}:rule`, stamp, color: row.color, width: 'thin', dash: 'solid', f: (x) => ((scope.x = x), g(scope)) });
					curves.push({ id: `${row.id}:diagonal`, stamp: 'diagonal', color: GUIDE, width: 'thin', dash: 'dashed', f: (x) => x });
					curves.push({
						...look,
						id: `${row.id}:web`,
						path: () => {
							const stair: Point[] = [];
							scope[index] = from;
							let a = f(scope);
							if (Number.isFinite(a)) stair.push({ x: a, y: 0 });
							for (let k = from + 1; k <= from + 80 && Number.isFinite(a) && Math.abs(a) < 1e6; k++) {
								scope[index] = k;
								const next = f(scope);
								if (!Number.isFinite(next)) break;
								stair.push({ x: a, y: next }, { x: next, y: next });
								a = next;
							}
							return { lines: stair.length > 1 ? [stair] : [] };
						}
					});
				}
				curves.push({
					...look,
					dots: (view) => {
						const first = Math.max(from, Math.ceil(view.x0 * xUnit));
						const last = Math.min(Math.floor(view.x1 * xUnit), first + 2000);
						// a window with thousands of whole numbers shows one term every few
						const step = Math.max(1, Math.ceil((last - first) / 600));
						const points = [];
						for (let k = first; k <= last; k += step) {
							scope[index] = k;
							const y = f(scope);
							if (Number.isFinite(y)) points.push({ x: k / xUnit, y });
						}
						return points;
					}
				});
				return;
			}
			if (entry.kind === 'function') {
				// the formula's x is the x written on the axis
				const at = (x: number) => ((scope.x = x), entry.f(scope));
				functions.set(row.id, at);
				if (row.hidden) return;
				// where the function has no value, or no slope, there is no tangent: its point waits on the axis to be moved
				const slopeThere = row.tangent === undefined ? NaN : ((scope.x = row.tangent), entry.d(scope)) * xUnit;
				const tangent = row.tangent !== undefined && Number.isFinite(slopeThere) && Number.isFinite(at(row.tangent)) ? { x: row.tangent / xUnit, slope: slopeThere } : undefined;
				const area = row.area ? { a: row.area[0] / xUnit, b: row.area[1] / xUnit, text: `∫ = ${italian(integral(at, row.area[0], row.area[1]), 3)}` } : undefined;
				curves.push({ ...look, label: row.label ? entry.name : undefined, f: (x) => at(x * xUnit), tangent, area });
				if (row.asymptotes)
					curves.push({
						id: `${row.id}:asymptotes`,
						stamp,
						color: row.color,
						width: 'thin',
						dash: 'dashed',
						// found again for the stretch of the axis in view: a vertical one is looked for where the window is
						path: (view) => {
							const found = asymptotes(at, view.x0 * xUnit, view.x1 * xUnit, limit);
							return {
								lines: [
									...found.vertical.map((a) => [
										{ x: a / xUnit, y: view.y0 },
										{ x: a / xUnit, y: view.y1 }
									]),
									...found.lines.map(({ m, q }) => [
										{ x: view.x0, y: m * view.x0 * xUnit + q },
										{ x: view.x1, y: m * view.x1 * xUnit + q }
									])
								]
							};
						}
					});
				if (tangent) spots.push({ id: `tangent:${row.id}`, row: row.id, role: 'tangent', at: { x: tangent.x, y: at(row.tangent!) }, color: row.color, text: `m = ${italian(tangent.slope / xUnit, 3)}` });
				else if (row.tangent !== undefined) spots.push({ id: `tangent:${row.id}`, row: row.id, role: 'tangent', at: { x: row.tangent / xUnit, y: 0 }, color: row.color, text: 'qui non c’è tangente' });
				if (row.area) row.area.forEach((x, end) => spots.push({ id: `area${end}:${row.id}`, row: row.id, role: end ? 'areaEnd' : 'areaStart', at: { x: x / xUnit, y: 0 }, color: row.color }));
				return;
			}
			if (row.hidden) return;
			const label = row.label && labelOf(row) ? plainName(labelOf(row)!) : undefined;
			if (entry.kind === 'implicit') curves.push({ ...look, label, implicit: (x, y) => ((scope.x = x * xUnit), (scope.y = y), entry.f(scope)) });
			else if (entry.kind === 'inequality') curves.push({ ...look, label, strict: entry.strict, region: (x, y) => ((scope.x = x * xUnit), (scope.y = y), entry.f(scope)) });
			else if (entry.kind === 'point') spots.push({ id: `point:${row.id}`, row: row.id, role: entry.free ? 'point' : 'fixed', at: { x: entry.x(scope) / xUnit, y: entry.y(scope) }, color: row.color, name: entry.name });
			else {
				const [t0, t1] = tRange(row, settings.degrees);
				if (entry.kind === 'polar') {
					// r = f(θ) is the curve (r cos θ, r sin θ); a radius is a length, whatever the x axis is read in
					const turn = settings.degrees ? Math.PI / 180 : 1;
					const r = (theta: number) => ((scope.theta = theta), entry.r(scope));
					curves.push({ ...look, parametric: { t0, t1, x: (theta) => (r(theta) * Math.cos(theta * turn)) / xUnit, y: (theta) => r(theta) * Math.sin(theta * turn) } });
				} else curves.push({ ...look, parametric: { t0, t1, x: (t) => ((scope.t = t), entry.x(scope) / xUnit), y: (t) => ((scope.t = t), entry.y(scope)) } });
			}
		});
				// Through every point of the plane, the curve that follows a field of slopes: the solution that passes there.
		const through = spots.filter((s) => s.role === 'point' || s.role === 'fixed' || s.role === 'glide');
		for (const { row, slope, stamp } of fields)
			through.forEach((spot, k) => {
				curves.push({
					id: `${row.id}:solution${k}`,
					stamp: `${stamp}|${spot.at.x},${spot.at.y}`,
					color: row.color,
					width: row.width,
					dash: row.dash,
					path: (view, sx) => {
						// Runge and Kutta's four slopes a step, a few pixels long, each way until the curve leaves the window
						const h = 3 / sx;
						const tall = view.y1 - view.y0;
						const run = (dir: 1 | -1) => {
							const line: Point[] = [];
							let { x, y } = spot.at;
							for (let n = 0; n < 4000 && x >= view.x0 - h && x <= view.x1 + h && y > view.y0 - tall && y < view.y1 + tall; n++) {
								line.push({ x, y });
								const d = dir * h;
								const k1 = slope(x, y);
								const k2 = slope(x + d / 2, y + (d / 2) * k1);
								const k3 = slope(x + d / 2, y + (d / 2) * k2);
								const k4 = slope(x + d, y + d * k3);
								const next = y + (d / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
								if (!Number.isFinite(next)) break;
								x += d;
								y = next;
							}
							return line;
						};
						return { lines: [[...run(-1).reverse(), ...run(1).slice(1)]] };
					}
				});
			});
				return { curves, spots, functions };
	}, [rows, entries, geos, valueOf, xUnit, settings.degrees, seed]);
	const { curves } = drawing;

	// A function with no value anywhere in the window draws nothing: the row says so, or it looks broken.
	const blank = useMemo(() => {
		const x0 = camera.cx - camera.span / 2;
		const out = new Set<number>();
		for (const c of curves) {
			if (!('f' in c)) continue;
			let found = false;
			for (let i = 0; i <= 240 && !found; i++) found = Number.isFinite(c.f(x0 + (camera.span * i) / 240));
			if (!found) out.add(Number(c.id));
		}
		return out;
	}, [curves, camera.cx, camera.span]);

	// ------------------------------------------------------------ changing the graph

	const setRows = (next: (rows: PlotRow[]) => PlotRow[], tag?: string) => change((d) => ({ ...d, rows: next(d.rows) }), tag);
	const updateRow = (id: number, part: Partial<PlotRow>, tag?: string) => setRows((list) => list.map((r) => (r.id === id ? { ...r, ...part } : r)), tag);
	/** Where each moving slider is, between its steps, and which way it goes. */
	const motion = useRef(new Map<string, { at: number; dir: 1 | -1 }>());
	const setSlider = (name: string, part: Partial<SliderSpec>) => {
		// a slider dragged while it moves goes on from where it was left
		if (part.value !== undefined) motion.current.set(name, { at: part.value, dir: motion.current.get(name)?.dir ?? 1 });
		change((d) => ({ ...d, sliders: { ...d.sliders, [name]: { ...(d.sliders[name] ?? DEFAULT_SLIDER), ...part } } }), `slider:${name}`);
	};

	const focusRow = (id: number) => {
		// the new field takes the focus once MathLive has made it
		const focus = (tries: number) => {
			const field = root.current?.querySelector<HTMLElement>(`[data-row="${id}"] math-field`);
			if (field) field.focus();
			else if (tries > 0) window.setTimeout(() => focus(tries - 1), 60);
		};
		window.setTimeout(() => focus(20), 0);
	};
	const add = () => {
		const row = newRow(current.current.rows);
		setRows((list) => [...list, row]);
		setSidebar(true);
		focusRow(row.id);
	};
	const duplicate = (row: PlotRow) => {
		const copy = { ...newRow(current.current.rows, row.latex), width: row.width, dash: row.dash, ...(row.build ? { build: row.build } : {}) };
		setRows((list) => list.flatMap((r) => (r.id === row.id ? [r, copy] : [r])));
	};
	// What is built from a row goes with it: without A there is no line through A and B.
	const remove = (id: number) => {
		setRows((list) => {
			const gone = new Set([id]);
			for (let grew = true; grew; ) {
				grew = false;
				for (const r of list)
					if (!gone.has(r.id) && r.build?.of.some((o) => gone.has(o))) {
						gone.add(r.id);
						grew = true;
					}
			}
			return list.filter((r) => !gone.has(r.id));
		});
		if (styled === id) setStyled(null);
	};

	// ------------------------------------------------------------ the tools of geometry

	/** The name a row is called by in the description of what is built from it. */
	const nameOf = (id: number) => {
		const i = rows.findIndex((r) => r.id === id);
		const entry = entries[i];
		if (i < 0) return '?';
		if (rows[i].name) return plainName(rows[i].name!);
		if (labelOf(rows[i])) return plainName(labelOf(rows[i])!);
		if ((entry.kind === 'point' || entry.kind === 'function') && entry.name) return entry.name;
		return `formula ${rows.filter((r) => !inConstruction(r)).indexOf(rows[i]) + 1}`;
	};
	const usedNames = new Set([...rows.flatMap((r) => (r.name ? [r.name] : [])), ...rows.flatMap((r) => labelOf(r) ?? []), ...entries.flatMap((e) => ((e.kind === 'point' || e.kind === 'function' || e.kind === 'definition') && e.name ? [e.name] : [])), ...params]);
	const geometry = useGeometryTool({ rows, geos, used: usedNames, xUnit, append: (added) => setRows((list) => [...list, ...added]) });
	/**
	 * A row that is a command of geometry being written, retta(A; B): the rows it would add, or what it still
	 * needs. Null for any other formula.
	 */
	const writtenOf = (latex: string, self: number): { made: Made[]; wish?: string } | { why: string } | null => {
		const written = readWritten(latex);
		if (!written) return null;
		// the objects a command can name: the points, the functions with a name, what was built with a letter of its own
		const byName = new Map<string, number>();
		rows.forEach((r, i) => {
			const entry = entries[i];
			const name = r.build ? r.name : entry && (entry.kind === 'point' || entry.kind === 'function') ? entry.name : labelOf(r);
			if (name && r.id !== self && !byName.has(tidyName(name))) byName.set(tidyName(name), r.id);
		});
		const args: CommandArg[] = [];
		for (const text of written.args) {
			const id = byName.get(text);
			if (id !== undefined) {
				args.push({ id, name: text });
				continue;
			}
			if (!text || text.includes('placeholder')) return { why: `Scrivi ${written.command.uses.join(' oppure ')}.` };
			// what is not a name is a number, written as any formula with no letters: 3, 2,5, √2
			const number = parse ? readEntry(parse(cleanLatex(text))) : null;
			if (number?.kind !== 'function' || number.params.length || number.name) return { why: `Non c’è un oggetto ${plainName(text)}: i punti si chiamano A, B, C; le rette e le circonferenze hanno il nome scritto nella loro riga.` };
			args.push({ value: number.f({ x: 0, y: 0, t: 0, theta: 0 }) });
		}
		const made = makeWritten(written.command.word, args, (id) => geos.get(id));
		return typeof made === 'string' ? { why: made } : { made, wish: written.name };
	};
	/**
	 * The written command of a row becomes its objects, added to the construction. The row stays, empty: after Enter
	 * it is where the next formula is written, and left empty it goes like any other.
	 */
	const converted = useRef<number | null>(null);
	const makeWrittenRow = (id: number, latex: string) => {
		const written = writtenOf(latex, id);
		if (!written || 'why' in written) return false;
		const added = writtenRows(written.made, rows, usedNames, written.wish);
		fields.current.get(id)?.set('');
		setRows((list) => [...list.map((r) => (r.id === id ? { ...r, latex: '' } : r)), ...added]);
		converted.current = id;
		return true;
	};
	// What the commands being written would make, on the plane before Enter makes it.
	const writing = rows.flatMap((r) => {
		const written = r.build ? null : writtenOf(r.latex, r.id);
		return written && 'made' in written ? [previewOf(written.made.map((m) => m.build), (id) => geos.get(id) ?? NOT_AN_OBJECT, xUnit, `written${r.id}-`)] : [];
	});
	const previewCurves = [...geometry.preview.curves, ...writing.flatMap((w) => w.curves)];
	const previewMarks = [...geometry.preview.marks, ...writing.flatMap((w) => w.marks)];
	const cancelTool = useRef(geometry.cancel);
	useEffect(() => {
		cancelTool.current = geometry.cancel;
	});
	// The guide under the plotter has a button for each tool: the tool is taken in hand and the plane comes into view.
	// A tool that works on an object finds one there: a line for the parallel and the slope, a curve for the tangent, two
	// objects that meet for the intersection. What the plane already has is used, and nothing of the student's is touched.
	const takeTool = (id: ToolId) => {
		const kinds = rows.filter((r) => !r.hidden).map((r) => geos.get(r.id)?.kind);
		const has = (kind: Geo['kind']) => kinds.includes(kind);
		const missing: string[] = [];
		if (['parallel', 'perpendicular', 'slope'].includes(id) && !has('line')) missing.push(TRY.line);
		if (id === 'tangent' && !has('conic') && !has('curve')) missing.push(TRY.circle);
		if (id === 'meet' && kinds.filter((k) => k === 'line' || k === 'conic').length < 2) missing.push(has('line') ? TRY.circle : TRY.line);
		if (missing.length)
			setRows((list) => {
				// before a last row left empty, where the student goes on writing
				const empty = list.length && !list[list.length - 1].latex.trim() && !list[list.length - 1].build ? list.slice(-1) : [];
				const next = list.slice(0, list.length - empty.length);
				for (const latex of missing) next.push(newRow([...next, ...empty], latex));
				return [...next, ...empty];
			});
		geometry.choose(id);
	};
	const chooseTool = useRef(takeTool);
	useEffect(() => {
		chooseTool.current = takeTool;
	});
	useEffect(() => {
		const take = (e: Event) => {
			chooseTool.current((e as CustomEvent<ToolId>).detail);
			root.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
		};
		window.addEventListener(TOOL_EVENT, take);
		return () => window.removeEventListener(TOOL_EVENT, take);
	}, []);
	const toolInHand = geometry.tool !== 'move';
	useEffect(() => {
		if (!toolInHand) return;
		const escape = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && cancelTool.current();
		document.addEventListener('keydown', escape);
		return () => document.removeEventListener('keydown', escape);
	}, [toolInHand]);

	// A function written without a name gets one when the student has finished writing it: the first letter free,
	// from f. With a name the other rows can use it, f(x) + 1 or f′(x).
	const nameIt = (id: number, latex: string) => {
		if (!parse || !latex.trim() || readWritten(latex) || readLabel(latex)) return;
		const others = current.current.rows.filter((r) => r.id !== id && r.latex.trim()).map((r) => parse(cleanLatex(r.latex)));
		const json = parse(cleanLatex(latex));
		if (!isUnnamedFunction(json, definitions(others), { points: [...pointRows.keys()] })) return;
		const name = freeName([...others, json]);
		if (!name) return;
		const named = `${name}\\left(x\\right)=${latex}`;
		fields.current.get(id)?.set(named);
		updateRow(id, { latex: named }, `row:${id}`);
	};

			// A formula left empty does not stay: once the focus has gone out of its row, the row goes. A moment later, because
	// a tap on the field takes the focus away and gives it back. A press on the row's own buttons keeps the row: the
	// press is looked at too, since Safari does not give the focus to a button that is clicked.
	const lastPress = useRef<{ target: EventTarget | null; time: number }>({ target: null, time: 0 });
	const dropIfEmpty = (id: number, latex: string) => {
		if (latex.trim()) return;
		window.setTimeout(() => {
			const row = current.current.rows.find((r) => r.id === id);
			const item = root.current?.querySelector(`[data-row="${id}"]`);
			if (!row || row.latex.trim() || !item || item.contains(document.activeElement)) return;
			const { target, time } = lastPress.current;
			if (target instanceof Node && item.contains(target) && performance.now() - time < 600) return;
			remove(id);
		}, 120);
	};

	// ------------------------------------------------------------ the window in numbers

	const bounds = (): WindowBounds => {
		const { w, h } = plane.current?.size() ?? FALLBACK_SIZE;
		const half = (h * camera.span) / (2 * w * camera.stretch);
		return { x0: (camera.cx - camera.span / 2) * xUnit, x1: (camera.cx + camera.span / 2) * xUnit, y0: camera.cy - half, y1: camera.cy + half };
	};
	const setBounds = (b: WindowBounds) => {
		const { w, h } = plane.current?.size() ?? FALLBACK_SIZE;
		const span = (b.x1 - b.x0) / xUnit;
		setCamera({ cx: (b.x0 + b.x1) / (2 * xUnit), cy: (b.y0 + b.y1) / 2, span, stretch: (h * span) / (w * (b.y1 - b.y0)) });
	};

	/** The window that holds what is drawn: the height of the functions over the x in view, and all of a curve in t or of the points. */
	const fit = () => {
		const { w, h } = plane.current?.size() ?? FALLBACK_SIZE;
		const x0 = camera.cx - camera.span / 2;
		const xs: number[] = [];
		const ys: number[] = [];
		let wide = false;
		for (const c of curves) {
			if ('f' in c) for (let k = 0; k <= 400; k++) ys.push(c.f(x0 + (camera.span * k) / 400));
			else if ('parametric' in c) {
				wide = true;
				for (let k = 0; k <= 600; k++) {
					const t = c.parametric.t0 + ((c.parametric.t1 - c.parametric.t0) * k) / 600;
					xs.push(c.parametric.x(t));
					ys.push(c.parametric.y(t));
				}
			}
		}
		for (const spot of drawing.spots) {
			if (spot.role === 'point' || spot.role === 'fixed') wide = true;
			xs.push(spot.at.x);
			ys.push(spot.at.y);
		}
		const yr = mainRange(ys);
		if (!yr) return;
		const pad = (lo: number, hi: number): [number, number] => (hi - lo < 1e-9 ? [lo - 1, hi + 1] : [lo - (hi - lo) * 0.12, hi + (hi - lo) * 0.12]);
		const [y0, y1] = pad(...yr);
		const xr = wide ? mainRange(xs) : null;
		if (!xr) {
			// functions only: the x in view stay, the height follows the curves
			setCamera({ cx: camera.cx, cy: (y0 + y1) / 2, span: camera.span, stretch: (h * camera.span) / (w * (y1 - y0)) });
			return;
		}
		// a curve in t or a set of points keeps its shape: the same scale on both axes
		const [a, b] = pad(...xr);
		setCamera({ cx: (a + b) / 2, cy: (y0 + y1) / 2, span: Math.max(b - a, ((y1 - y0) * w) / h), stretch: 1 });
	};

	/** The points of the plane with what a drag of each one changes. */
	const marks: PlaneMark[] = drawing.spots.map((spot) => {
		const { id, at, color, name, text } = spot;
		const row = rows.find((r) => r.id === spot.row)!;
		if (spot.role === 'fixed') return { id, at, color, name };
		if (spot.role === 'label') return { id, at, color, text, dot: false };
		if (spot.role === 'glide')
			return {
				id,
				at,
				color,
				name,
				// a point bound to an object slides along it, to where the object is nearest to the pointer
				onDrag: (to) => {
					const on = geos.get(row.build!.of[0]);
					const param = on ? project(on, { x: to.x * xUnit, y: to.y }) : null;
					if (param !== null) updateRow(row.id, { build: { ...row.build!, at: param } }, `glide:${row.id}`);
				}
			};
		if (spot.role === 'tangent') return { id, at, color, text, onDrag: (to) => updateRow(row.id, { tangent: Number((to.x * xUnit).toPrecision(10)) }, `tangent:${row.id}`) };
		if (spot.role === 'point')
			return {
				id,
				at,
				color,
				name,
				snap: true,
				// a dragged point rewrites its own row
				onDrag: (to) => {
					const latex = `${name ? `${name}=` : ''}\\left(${latexNumber(to.x * xUnit)};${latexNumber(to.y)}\\right)`;
					fields.current.get(row.id)?.set(latex);
					updateRow(row.id, { latex }, `point:${row.id}`);
				}
			};
		const end = spot.role === 'areaEnd' ? 1 : 0;
		return {
			id,
			at,
			color,
			snap: true,
			onDrag: (to) => {
				const area: [number, number] = [...row.area!];
				area[end] = Number((to.x * xUnit).toPrecision(10));
				updateRow(row.id, { area }, `area:${row.id}`);
			}
		};
	});

	// Rows change place by their grip: dragged over another row, or with the arrows.
	const gripped = useRef<number | null>(null);
	const moveRow = (id: number, to: number) =>
		setRows((list) => {
			const from = list.findIndex((r) => r.id === id);
			if (from < 0 || to < 0 || to >= list.length || to === from) return list;
			const next = [...list];
			next.splice(to, 0, next.splice(from, 1)[0]);
			return next;
		}, 'reorder');
	// A row moves among those of its own section: the panel shows the two apart, the list keeps them together.
	const dragRow = (clientY: number) => {
		if (gripped.current === null) return;
		const held = rows.find((r) => r.id === gripped.current);
		const over = [...(root.current?.querySelectorAll<HTMLElement>('[data-row]') ?? [])].find((el) => {
			const box = el.getBoundingClientRect();
			return clientY >= box.top && clientY <= box.bottom;
		});
		const target = over && rows.find((r) => r.id === Number(over.dataset.row));
		if (held && target && inConstruction(held) === inConstruction(target)) moveRow(held.id, rows.indexOf(target));
	};
	const moveWithin = (id: number, by: -1 | 1) => {
		const held = rows.find((r) => r.id === id);
		if (!held) return;
		const section = rows.filter((r) => inConstruction(r) === inConstruction(held));
		const next = section[section.indexOf(held) + by];
		if (next) moveRow(id, rows.indexOf(next));
	};

	const changeSettings = (part: Partial<PlotDoc['settings']>) => {
		// an angle written for one unit is kept as the same angle in the other: θ up to 6π becomes θ up to 1080
		const turn = part.degrees === undefined || part.degrees === settings.degrees ? 1 : part.degrees ? DEGREES : 1 / DEGREES;
		const polar = new Set(rows.filter((_, i) => entries[i].kind === 'polar').map((r) => r.id));
		const angle = (v: number | undefined) => (v === undefined ? undefined : Number((v * turn).toPrecision(12)));
		change((d) => ({ ...d, settings: { ...d.settings, ...part }, rows: turn === 1 ? d.rows : d.rows.map((r) => (polar.has(r.id) ? { ...r, t0: angle(r.t0), t1: angle(r.t1) } : r)) }));
	};

	// ------------------------------------------------------------ sliders in motion

	const anyPlaying = Object.keys(playing).length > 0;
	useEffect(() => {
		if (!anyPlaying) return;
		let id = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.1);
			last = now;
			const doc = current.current;
			const next = { ...doc.sliders };
			const stopped: string[] = [];
			let moved = false;
			for (const name of Object.keys(playing)) {
				const spec = doc.sliders[name] ?? DEFAULT_SLIDER;
				const m = motion.current.get(name) ?? { at: spec.value, dir: 1 as const };
				let at = m.at + (m.dir * (spec.max - spec.min) * dt) / SWEEP[spec.speed];
				let dir = m.dir;
				if (at > spec.max || at < spec.min) {
					if (spec.mode === 'loop') at = spec.min;
					else if (spec.mode === 'once') {
						at = spec.max;
						stopped.push(name);
					} else {
						dir = dir === 1 ? -1 : 1;
						at = Math.min(spec.max, Math.max(spec.min, at));
					}
				}
				motion.current.set(name, { at, dir });
				const value = Math.min(spec.max, Number((spec.min + Math.round((at - spec.min) / spec.step) * spec.step).toFixed(8)));
				if (value !== spec.value) {
					next[name] = { ...spec, value };
					moved = true;
				}
			}
			// not a step to undo: the slider is only moving
			if (moved) change((d) => ({ ...d, sliders: { ...d.sliders, ...Object.fromEntries(Object.keys(playing).map((name) => [name, next[name] ?? DEFAULT_SLIDER])) } }), false);
			if (stopped.length) setPlaying((p) => Object.fromEntries(Object.entries(p).filter(([name]) => !stopped.includes(name))) as Record<string, true>);
			id = requestAnimationFrame(tick);
		};
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	}, [anyPlaying, playing, change]);

	const togglePlay = (name: string) => {
		const spec = specOf(name);
		// from the end, "once" starts again from the beginning
		const at = spec.mode === 'once' && spec.value >= spec.max ? spec.min : spec.value;
		motion.current.set(name, { at, dir: 1 });
		setPlaying((p) => {
			const { [name]: was, ...rest } = p;
			return was ? rest : { ...p, [name]: true };
		});
	};
	// a parameter that is no longer in any formula is not moving
	const moving = useMemo(() => Object.fromEntries(Object.entries(playing).filter(([name]) => params.includes(name))), [playing, params]);

	// ------------------------------------------------------------ the keyboard on screen, the whole screen

	// The keyboard on screen covers the bottom of the page: the plotter makes room for it.
	useEffect(() => {
		let off = () => {};
		let cancelled = false;
		loadMathLive()
			.then(() => {
				if (cancelled) return;
				const kb = window.mathVirtualKeyboard;
				const onGeometry = () => setKeyboardHeight(kb.visible ? kb.boundingRect.height : 0);
				kb.addEventListener('geometrychange', onGeometry);
				off = () => {
					kb.removeEventListener('geometrychange', onGeometry);
					kb.hide();
				};
			})
			.catch(() => {});
		return () => {
			cancelled = true;
			off();
		};
	}, []);
	useEffect(() => {
		if (!keyboardHeight) return;
		const active = root.current?.querySelector<HTMLElement>('[data-row]:focus-within');
		requestAnimationFrame(() => active?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
	}, [keyboardHeight]);

	// The whole screen. The browser's own full screen where it has one, which nothing of the site can cover; where
	// it has none (an iPhone) the plotter is fixed over the page, and the layers that hold it are raised above the
	// site's bars. Sapiens's keyboard lives in the page's body, outside what the browser shows full screen, so it
	// moves inside the plotter for the time.
	const enterFull = () => {
		setFull(true);
		root.current?.requestFullscreen?.().catch(() => {});
	};
	const exitFull = () => {
		setFull(false);
		if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
	};
	useEffect(() => {
		const onChange = () => !document.fullscreenElement && setFull(false);
		document.addEventListener('fullscreenchange', onChange);
		return () => document.removeEventListener('fullscreenchange', onChange);
	}, []);
	useEffect(() => {
		if (!full || !root.current) return;
		const node = root.current;
		const undo: (() => void)[] = [];
		for (let up = node.parentElement; up && up !== document.body; up = up.parentElement) {
			const style = getComputedStyle(up);
			const el = up;
			if (style.zIndex !== 'auto') {
				const before = el.style.zIndex;
				el.style.zIndex = '2147483000';
				undo.push(() => (el.style.zIndex = before));
			}
			if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
				const before = el.style.overflowY;
				el.style.overflowY = 'hidden';
				undo.push(() => (el.style.overflowY = before));
			}
		}
		const kb = window.mathVirtualKeyboard;
		if (kb) {
			kb.container = node;
			undo.push(() => (kb.container = document.body));
		}
		// the browser's full screen leaves on Escape by itself
		const escape = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && !panel && !document.fullscreenElement && setFull(false);
		document.addEventListener('keydown', escape);
		return () => {
			undo.forEach((f) => f());
			document.removeEventListener('keydown', escape);
		};
	}, [full, panel]);

	// The button shows the keyboard at once, on the formula that was being written (or the first one), and puts it away.
	const lastField = useRef<number | null>(null);
	const switchKeyboard = () => {
		const next = keyboard === 'sapiens' ? 'device' : 'sapiens';
		setKeyboard(next);
		if (next === 'device') {
			window.mathVirtualKeyboard?.hide();
			return;
		}
		const row = lastField.current !== null && rows.some((r) => r.id === lastField.current) ? lastField.current : rows[0]?.id;
		const field = root.current?.querySelector<HTMLElement>(row === undefined ? 'math-field' : `[data-row="${row}"] math-field`);
		field?.focus();
		window.mathVirtualKeyboard?.show();
	};

	// A ready formula goes where the student was writing; with no formula in hand, in the last row if it is empty, or in a new one.
	const insertTemplate = (template: string) => {
		const list = current.current.rows;
		const last = list[list.length - 1];
		let id = lastField.current !== null && list.some((r) => r.id === lastField.current && !r.build) ? lastField.current : last && !last.latex.trim() && !last.build ? last.id : null;
		if (id === null) {
			const row = newRow(list);
			setRows((all) => [...all, row]);
			id = row.id;
		}
		const target = id;
		// a new row has its field a render later
		const write = (tries: number) => {
			const field = fields.current.get(target);
			if (field) field.insert(template);
			else if (tries > 0) window.setTimeout(() => write(tries - 1), 30);
		};
		write(20);
	};

	// ------------------------------------------------------------ the bar's actions

	const stepBack = () => {
		setHeld(null);
		undo();
		setSynced((n) => n + 1);
	};
	const stepForward = () => {
		setHeld(null);
		redo();
		setSynced((n) => n + 1);
	};
	// Inside a formula field Ctrl+Z belongs to the field, which undoes the typing.
	const shortcuts = (e: KeyboardEvent<HTMLDivElement>) => {
		if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z' || (e.target as HTMLElement).closest('math-field, input')) return;
		e.preventDefault();
		if (e.shiftKey) stepForward();
		else stepBack();
	};

	/** The link to the graph as it is, copied; the address bar has it too. */
	const copyLink = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2200);
		} catch {
			// no clipboard here: the address bar has the link all the same
		}
	};
	const linkNow = () => `${window.location.origin}${window.location.pathname}#g=${encodeState({ ...doc, camera })}`;
	const share = async () => {
		const url = linkNow();
		window.history.replaceState(null, '', url);
		await copyLink(url);
	};
	// Everything off the plane: the formulas, what was built, the sliders. The settings of the plane stay, and the step
	// can be undone. `keep` copies the link to the graph first, which is how a graph is kept for now.
	const hasContent = rows.some((r) => r.latex.trim() || r.build);
	// The saved graph the plane was loaded from, or last saved as, with what it held then: "Salva" writes over it.
	// What is compared leaves the window out: looking around a graph is not a change to save.
	const user = useAuth((s) => s.user);
	const [saved, setSaved] = useState<{ id: string; title: string; code: string } | null>(() => origin && { ...origin, code: encodeState({ rows: initial.rows, sliders: initial.sliders, settings: initial.settings, camera: HOME }) });
	const docCode = useMemo(() => encodeState({ ...doc, camera: HOME }), [doc]);
	// Who holds the plotter (a note) is told what is on the plane and which saved graph it comes from.
	const tell = useRef({ onState, onOrigin });
	useEffect(() => {
		tell.current = { onState, onOrigin };
	});
	useEffect(() => {
		tell.current.onState?.(encodeState({ ...doc, camera }));
	}, [doc, camera]);
	const savedId = saved?.id;
	const savedTitle = saved?.title;
	useEffect(() => {
		tell.current.onOrigin?.(savedId && savedTitle ? { id: savedId, title: savedTitle } : null);
	}, [savedId, savedTitle]);
	const dirty = saved ? saved.code !== docCode : hasContent;
	const stateNow = () => encodeState({ ...doc, camera });
	/** The plane as a picture, kept with a saved graph for the list. */
	const pictureNow = () => {
		const svg = plane.current?.svg();
		return svg ? standaloneSvg(svg).text : null;
	};
	const clear = async (keep: 'link' | 'save' | null) => {
		if (keep === 'link') await copyLink(linkNow());
		if (keep === 'save' && saved) {
			try {
				await overwritePlot(saved.id, stateNow(), pictureNow());
			} catch {
				// not saved: the plane is not emptied, and the library says why
				toggle('library');
				return;
			}
		}
		setSaved(null);
		cancelTool.current();
		const row = newRow([]);
		change((d) => ({ ...d, rows: [row], sliders: {} }));
		window.history.replaceState(null, '', window.location.pathname);
		setCamera(home);
		setPlaying({});
		setStyled(null);
		setHeld(null);
		setSynced((n) => n + 1);
		setPanel(null);
	};
	const download = (kind: 'svg' | 'png') => {
		const svg = plane.current?.svg();
		if (svg) void downloadPlane(svg, kind);
		setPanel(null);
	};
	const closePanel = useCallback(() => setPanel(null), []);
	const toggle = (p: Panel) => {
		setPanel((open) => (open === p ? null : p));
		setContent(p);
	};
	// the panel that is closing keeps its content for the time of its way out
	const presence = usePresence(panel !== null);
	const drawn = presence.mounted ? (panel ?? content) : null;
	const visible = presence.visible && panel !== null && panel === drawn;

	const names = rows.filter((r) => r.latex.trim()).length;
	const formulaRows = rows.filter((r) => !inConstruction(r));
	const builtRows = rows.filter(inConstruction);
	// a tool switched on starts in the middle of the window, on round numbers
	const round = (x: number) => Number(x.toPrecision(2));
	const toolDefaults = { tangent: round(camera.cx * xUnit), area: [round((camera.cx - camera.span / 8) * xUnit), round((camera.cx + camera.span / 8) * xUnit)] as [number, number] };
	const look = { grid: settings.grid, axes: settings.axes, numbers: settings.numbers, xAxis: polarGrid ? ('numbers' as const) : settings.degrees ? ('degrees' as const) : settings.xAxis, xUnit, xName: settings.xName, yName: settings.yName, polar: settings.polar ? (settings.degrees ? ('degrees' as const) : ('radians' as const)) : undefined };
	const withKeyboard = keyboardHeight > 0;

				/** Where a tangent starts when it is switched on: the middle of the window, or the nearest place beside it where the function has a value. */
	const tangentStart = (id: number, middle: number) => {
		const at = drawing.functions.get(id);
		if (!at || Number.isFinite(at(middle))) return middle;
		const step = round((camera.span * xUnit) / 16);
		for (let k = 1; k <= 8; k++) for (const x of [middle + k * step, middle - k * step]) if (Number.isFinite(at(x))) return Number(x.toPrecision(10));
		return middle;
	};
	/** A row that is a number: what it is worth. A limit that grows without end, or that is not there, says so. */
	const valueText = (v: number) => (v === Infinity ? 'Vale +∞.' : v === -Infinity ? 'Vale −∞.' : Number.isNaN(v) ? 'Non ha un valore: se è un limite, da destra e da sinistra non coincidono, oppure non esiste.' : `Vale ${italian(v, 6)}.`);
	/** The asymptotes of a function in the stretch of the axis in view, in words. */
	const asymptoteText = (id: number) => {
		const at = drawing.functions.get(id);
		if (!at) return undefined;
		const found = asymptotes(at, (camera.cx - camera.span / 2) * xUnit, (camera.cx + camera.span / 2) * xUnit, limit);
		const line = ({ m, q }: { m: number; q: number }) => (m === 0 ? `y = ${italian(q, 4)}` : `y = ${m === 1 ? '' : m === -1 ? '−' : italian(m, 4)}x${q === 0 ? '' : q > 0 ? ` + ${italian(q, 4)}` : ` − ${italian(-q, 4)}`}`);
		const all = [...found.vertical.map((a) => `x = ${italian(a, 4)}`), ...found.lines.map(line)];
		return all.length ? `${all.length === 1 ? 'Asintoto' : 'Asintoti'}: ${all.join('; ')}.` : 'Nessun asintoto in questa parte del piano.';
	};
	// A row of the panel: a formula with its field, or a built object with its definition and its equation. `n` is its place in its section.
	const renderRow = (row: PlotRow, n: number) => {
		const built = inConstruction(row);
								const i = rows.indexOf(row);
		const entry = entries[i];
								const geo = row.build ? geos.get(row.id) : undefined;
								const written = row.build ? null : writtenOf(row.latex, row.id);
								const message =
									written ? ('why' in written ? written.why : `Premi Invio per creare: ${[...new Set(written.made.map((m) => describe(m.build, nameOf)))].join(', ')}${written.made.length > 1 ? ` (${written.made.length} oggetti)` : ''}.`) : geo?.kind === 'none' ? geo.why : entry.kind === 'error' ? entry.message : entry.kind === 'function' && entry.constant ? valueText(drawing.functions.get(row.id)?.(0) ?? NaN) : blank.has(row.id) ? NO_VALUES : entry.kind === 'function' ? (row.asymptotes ? asymptoteText(row.id) : entry.note) : entry.kind === 'orbit' ? `I primi ${MAX_TERMS} punti della successione ${entry.name}.` : entry.kind === 'field' ? 'Un trattino per ogni pendenza. Metti un punto sul piano per vedere la soluzione che ci passa.' : entry.kind === 'sequence' && row.cobweb && !entry.step ? 'La ragnatela si disegna per una regola a un passo senza l’indice, come aₙ₊₁ = g(aₙ).' : entry.kind === 'sequence' && entry.plane ? `I termini di ${entry.name} dipendono da x o da y: non hanno punti loro. Usane uno in un’altra riga, come ${entry.name}₁₀ ≤ 4.` : entry.kind === 'definition' ? `${entry.name} dipende da ${entry.vars.join(' e ')}: non ha una curva sua. Usala in un’altra riga, come ${entry.name} = 4 oppure ${entry.name}(${entry.vars.join('; ')}) < 1.` : undefined;
								return (
									<li
										key={row.id}
										data-row={row.id}
										onFocus={(e) => {
											lastField.current = row.id;
											if (!(e.target as HTMLElement).closest('math-field')) return;
											setHeld((h) => h ?? paramsNow.current);
											setEditing(row.id);
										}} className="border-b border-edge-soft transition-colors focus-within:bg-surface-2" style={{ scrollMarginBottom: keyboardHeight + 12 }}>
										<div className="flex items-center gap-0.5 py-1 pr-1">
											<button
												type="button"
												aria-label={`Sposta la riga ${n + 1}: trascina, oppure usa le frecce su e giù`}
												title="Sposta la riga"
												className="flex h-9 w-5 shrink-0 cursor-grab touch-none items-center justify-center text-fg-faint hover:text-fg-muted focus-ring active:cursor-grabbing"
												onPointerDown={(e) => {
													e.currentTarget.setPointerCapture(e.pointerId);
													gripped.current = row.id;
												}}
												onPointerMove={(e) => dragRow(e.clientY)}
												onPointerUp={() => (gripped.current = null)}
												onPointerCancel={() => (gripped.current = null)}
												onKeyDown={(e) => {
													if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
													e.preventDefault();
													moveWithin(row.id, e.key === 'ArrowUp' ? -1 : 1);
												}}
											>
												<GripVertical className="size-4" aria-hidden="true" />
											</button>
											<button
												type="button"
												onClick={() => updateRow(row.id, { hidden: !row.hidden })}
												aria-pressed={!row.hidden}
												aria-label={row.hidden ? `Mostra la curva ${n + 1}` : `Nascondi la curva ${n + 1}`}
												title={row.hidden ? 'Mostra la curva' : 'Nascondi la curva'}
												className="flex size-9 shrink-0 items-center justify-center rounded-lg focus-ring"
											>
												<span className="plot-swatch block size-4 rounded-full border-2" style={{ borderColor: row.color, backgroundColor: row.hidden ? 'transparent' : row.color }} />
											</button>
											{row.build ? (
												<div className="min-w-0 flex-1 py-2 pl-1">
													<p className="m-0 truncate text-sm text-fg-muted" title={describe(row.build, nameOf)}>
														{row.name && geo?.kind !== 'point' && <span className="font-[KaTeX_Math,serif] text-base text-fg-strong italic">{plainName(row.name)}: </span>}
														{describe(row.build, nameOf)}
													</p>
													{geo &&
														equationsOf(row, geo).map((tex, k) => (
															<p key={k} className={cn('m-0 truncate', k ? 'text-sm text-fg-muted' : 'text-lg text-fg-strong')}>
																<Formula tex={tex} />
															</p>
														))}
												</div>
											) : (
											<MathField
												ref={(handle) => {
													if (handle) fields.current.set(row.id, handle);
													else fields.current.delete(row.id);
												}}
												initial={row.latex}
												onChange={(latex) => updateRow(row.id, { latex }, `row:${row.id}`)}
												onDone={(latex) => {
													setHeld(null);
													setEditing(null);
													converted.current = null;
													if (makeWrittenRow(row.id, latex)) return dropIfEmpty(row.id, '');
													nameIt(row.id, latex);
													dropIfEmpty(row.id, latex);
												}}
												label={`Formula ${n + 1}`}
												layouts={PLOT_LAYOUTS}
												completer={PLOT_COMPLETER}
												keyboard={keyboard}
												// after a command the row is empty again, and the next formula goes there
												onEnter={() => converted.current !== row.id && add()}
												className="flex-1 overflow-hidden py-2.5 pl-1 text-lg text-fg-strong"
											/>
											)}
											<IconButton label={`Aspetto della curva ${n + 1}`} onClick={() => setStyled((s) => (s === row.id ? null : row.id))} pressed={styled === row.id}>
												<SlidersHorizontal className="size-4" aria-hidden="true" />
											</IconButton>
											<IconButton label={built ? `Togli l’oggetto ${n + 1}` : `Togli la formula ${n + 1}`} onClick={() => remove(row.id)}>
												<X className="size-4" aria-hidden="true" />
											</IconButton>
										</div>
																				{message && (
											<p role="status" className="mt-0 mb-2 px-3 text-sm text-fg-muted">
												{message}
											</p>
										)}
										{/* numbers by chance stay the same while the graph is looked at: this draws them again */}
										{!row.build && /casuale|random/.test(row.latex) && entry.kind !== 'error' && (
											<div className="mb-2 px-3">
												<button
													type="button"
													onClick={() => {
														reseed();
														setSeed((n) => n + 1);
													}}
													className="flex h-8 items-center gap-1.5 rounded-lg border border-edge-strong bg-surface px-2.5 text-sm font-medium text-fg-strong shadow-paper hover:bg-surface-3 focus-ring"
												>
													<Dices className="size-3.5" aria-hidden="true" />
													Estrai di nuovo
												</button>
											</div>
										)}
										{(entry.kind === 'parametric' || entry.kind === 'polar') && (
											<div className="flex items-end gap-2 px-3 pb-2.5">
												<span className="pb-1.5 font-[KaTeX_Math,serif] text-base text-fg-muted italic">{entry.kind === 'polar' ? 'θ' : 't'}</span>
												<NumberBox label="da" pi={!settings.degrees} value={tRange(row, settings.degrees)[0]} valid={(v) => v < tRange(row, settings.degrees)[1]} onChange={(t0) => updateRow(row.id, { t0 })} className="w-24" />
												<NumberBox label="a" pi={!settings.degrees} value={tRange(row, settings.degrees)[1]} valid={(v) => v > tRange(row, settings.degrees)[0]} onChange={(t1) => updateRow(row.id, { t1 })} className="w-24" />
											</div>
										)}
										{entry.kind === 'sequence' && !entry.plane && (
											<Collapse open={!!row.table}>
												<ValueTable
													row={row}
													name={`${entry.name}_${entry.index}`}
													variable={entry.index}
													whole
													f={(k) => entry.f({ x: 0, y: 0, t: 0, theta: 0, ...Object.fromEntries(entry.params.map((p) => [p, valueOf(p, (id) => geos.get(id))])), [entry.index]: Math.round(k) })}
													onChange={(table) => updateRow(row.id, { table }, `table:${row.id}`)}
												/>
											</Collapse>
										)}
										{entry.kind === 'function' && (
											<Collapse open={!!row.table}>
												<ValueTable row={row} name={entry.name ? `${entry.name}(${settings.xName})` : settings.yName} variable={settings.xName} f={drawing.functions.get(row.id) ?? (() => NaN)} onChange={(table) => updateRow(row.id, { table }, `table:${row.id}`)} />
											</Collapse>
										)}
										<Collapse open={styled === row.id}>
											<RowStyle
												row={row}
												name={entry.kind === 'function' ? entry.name : labelOf(row) ? plainName(labelOf(row)!) : row.build && row.name && geo && (geo.kind === 'line' || geo.kind === 'conic') ? plainName(row.name) : undefined}
												tools={entry.kind === 'function' ? { ...toolDefaults, tangent: tangentStart(row.id, toolDefaults.tangent) } : undefined}
												sequence={entry.kind === 'sequence' && !entry.plane ? { from: entry.from ?? 0, rule: !!entry.step } : undefined}
												onChange={(part) => updateRow(row.id, part)}
												onDuplicate={() => duplicate(row)}
												onRemove={() => remove(row.id)}
											/>
										</Collapse>
									</li>
								);
	};

		// In a note the graph is looked at: the plane alone, which can be moved and brought back.
	if (view)
		return (
			<div ref={root} className="relative h-full w-full overflow-hidden">
				<Plane ref={plane} camera={camera} onCamera={setCamera} home={home} wheel="ctrl" curves={curves} marks={marks.map((m) => ({ ...m, onDrag: undefined }))} look={look} label={names ? `Piano cartesiano con ${names === 1 ? 'una funzione' : `${names} funzioni`}` : 'Piano cartesiano'} />
			</div>
		);

	return (
		<div
			ref={root}
			onKeyDown={shortcuts}
			onPointerDownCapture={(e) => (lastPress.current = { target: e.target, time: performance.now() })}
			className={cn('flex flex-col border-edge bg-surface', full ? 'fixed inset-0 z-50 overflow-hidden' : 'overflow-clip rounded-2xl border shadow-paper lg:h-[min(78vh,54rem)] lg:overflow-hidden')}
			style={{ paddingBottom: withKeyboard && full ? keyboardHeight : undefined, marginBottom: withKeyboard && !full ? keyboardHeight : undefined }}
		>
			<div className="flex shrink-0 items-center gap-0.5 border-b border-edge bg-surface-2 px-1.5 py-1.5">
				<IconButton label={sidebar ? 'Chiudi l’elenco delle funzioni' : 'Apri l’elenco delle funzioni'} onClick={() => setSidebar((s) => !s)} pressed={sidebar} className="max-lg:hidden">
					{sidebar ? <PanelLeftClose className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
				</IconButton>
				<IconButton label="Annulla" onClick={stepBack} disabled={!canUndo}>
					<Undo2 className="size-4" aria-hidden="true" />
				</IconButton>
				<IconButton label="Ripeti" onClick={stepForward} disabled={!canRedo}>
					<Redo2 className="size-4" aria-hidden="true" />
				</IconButton>
				<span className="flex-1" />
				<span role="status" className={cn('mr-1 text-xs text-fg-muted transition-opacity', copied ? 'opacity-100' : 'opacity-0')}>
					{copied ? 'Link copiato' : ''}
				</span>
				<span data-popover="examples">
					<IconButton label="Esempi" text="Esempi" onClick={() => toggle('examples')} pressed={panel === 'examples'}>
						<Lightbulb className="size-4" aria-hidden="true" />
					</IconButton>
				</span>
				<IconButton label="Copia il link a questo grafico" text="Condividi" onClick={() => void share()}>
					<Link2 className="size-4" aria-hidden="true" />
				</IconButton>
				<span data-popover="library">
					<IconButton label={saved ? `I miei grafici: sul piano c’è ${saved.title}${dirty ? ', con modifiche non salvate' : ''}` : 'I miei grafici: salva e riapri'} text={saved ? `${saved.title}${dirty ? ' •' : ''}` : 'I miei grafici'} onClick={() => toggle('library')} pressed={panel === 'library'}>
						<FolderOpen className="size-4" aria-hidden="true" />
					</IconButton>
				</span>
				<span data-popover="download">
					<IconButton label="Scarica l’immagine" onClick={() => toggle('download')} pressed={panel === 'download'}>
						<Download className="size-4" aria-hidden="true" />
					</IconButton>
				</span>
				<span data-popover="clear">
					<IconButton label="Svuota il piano" onClick={() => toggle('clear')} pressed={panel === 'clear'} disabled={!hasContent}>
						<Trash2 className="size-4" aria-hidden="true" />
					</IconButton>
				</span>
				<span data-popover="settings">
					<IconButton label="Impostazioni del piano" onClick={() => toggle('settings')} pressed={panel === 'settings'}>
						<Settings className="size-4" aria-hidden="true" />
					</IconButton>
				</span>
				<IconButton label={full ? 'Esci dallo schermo intero' : 'Schermo intero'} onClick={full ? exitFull : enterFull} pressed={full}>
					{full ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
				</IconButton>
			</div>

			<div className="flex min-h-0 flex-1 flex-col lg:flex-row">
				{/* with the keyboard open on a narrow screen the plane stays under the site's bar, and leaves a strip for the formula being written */}
				<div
					className={cn(
						'relative min-h-0 lg:order-2 lg:h-auto lg:flex-1',
						full ? 'min-h-[38%] flex-1' : withKeyboard ? 'z-10 bg-surface max-lg:sticky max-lg:top-[var(--header-h,64px)] max-lg:h-[max(10rem,calc(100svh-var(--kb)-var(--header-h,64px)-5.5rem))] max-lg:border-b max-lg:border-edge' : 'h-[56svh]'
					)}
					style={{ '--kb': `${keyboardHeight}px` } as CSSProperties}
				>
					<Plane
						ref={plane}
						camera={camera}
						onCamera={setCamera}
						home={home}
						curves={curves}
						marks={previewMarks.length ? [...marks, ...previewMarks] : marks}
						overlay={previewCurves}
						pick={geometry.pick}
						onFit={fit}
						look={look}
						label={names ? `Piano cartesiano con ${names === 1 ? 'una funzione' : `${names} funzioni`}` : 'Piano cartesiano'}
					/>

					<GeometryBar tool={geometry.tool} onChoose={geometry.choose} />
					{toolInHand && <ToolHint name={toolOf(geometry.tool).name} hint={geometry.hint} ask={geometry.ask} onAnswer={geometry.answer} />}

					{drawn === 'settings' && (
						<Popover title="Impostazioni del piano" anchor="settings" onClose={closePanel} visible={visible}>
							<PlaneSettingsPanel
								settings={settings}
								onChange={changeSettings}
								bounds={bounds()}
								onBounds={setBounds}
								square={Math.abs(camera.stretch - 1) < 1e-9}
								onSquare={() => setCamera((c) => ({ ...c, stretch: 1 }))}
							/>
						</Popover>
					)}
					{drawn === 'examples' && (
						<Popover title="Esempi" anchor="examples" onClose={closePanel} visible={visible}>
							<ul className="m-0 flex list-none flex-col gap-1 p-0">
								{EXAMPLES.map((example) => (
									<li key={example.title}>
										<button
											type="button"
											onClick={() => {
												load(example.state);
											// an example is not the saved graph that was on the plane
											setSaved(null);
											setPanel(null);
											}}
											className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left hover:bg-surface-3 focus-ring"
										>
											<span className="text-sm font-medium text-fg-strong">{example.title}</span>
											<span className="text-xs text-fg-muted">{example.about}</span>
										</button>
									</li>
								))}
							</ul>
						</Popover>
					)}
					{drawn === 'clear' && (
						<Popover title="Svuotare il piano?" anchor="clear" onClose={closePanel} visible={visible}>
							<p className="mt-0 mb-3 text-sm text-fg-muted">
								Togli tutte le formule, i punti e gli oggetti costruiti. {user && saved && !dirty ? `“${saved.title}” resta tra i tuoi grafici.` : dirty ? 'Ci sono modifiche non salvate.' : ''} “Annulla” riporta tutto indietro finché resti su questa pagina.
							</p>
							<div className="flex flex-col gap-2">
								{/* with an account the graph is saved first: over the one it came from, or with a name from the library */}
								{user && saved && dirty ? (
									<button type="button" onClick={() => void clear('save')} className="h-10 rounded-lg border border-edge-strong bg-surface text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
										Salva “{saved.title}” e svuota
									</button>
								) : user && !saved ? (
									<button type="button" onClick={() => toggle('library')} className="h-10 rounded-lg border border-edge-strong bg-surface text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
										Salva con nome…
									</button>
								) : !user ? (
									<button type="button" onClick={() => void clear('link')} className="h-10 rounded-lg border border-edge-strong bg-surface text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
										Copia il link e svuota
									</button>
								) : null}
								<button type="button" onClick={() => void clear(null)} className="h-10 rounded-lg bg-accent text-sm font-medium text-white hover:opacity-90 focus-ring">
									{user && saved && !dirty ? 'Svuota' : 'Svuota senza salvare'}
								</button>
								<button type="button" onClick={closePanel} className="h-10 rounded-lg text-sm font-medium text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring">
									Lascia tutto com’è
								</button>
							</div>
						</Popover>
					)}
					{drawn === 'library' && (
						<Popover title="I miei grafici" anchor="library" onClose={closePanel} visible={visible}>
							<SavedPlots
								current={saved}
								dirty={dirty}
								empty={!hasContent}
								state={stateNow}
								preview={pictureNow}
								onSaved={(plot) => setSaved({ id: plot.id, title: plot.title, code: docCode })}
								onLoad={(plot) => {
									const state = decodeState(plot.state);
									if (!state) return;
									load(state);
									setSaved({ id: plot.id, title: plot.title, code: encodeState({ ...state, camera: HOME }) });
									setPanel(null);
								}}
								onGone={() => setSaved(null)}
							/>
						</Popover>
					)}
					{drawn === 'download' && (
						<Popover title="Scarica l’immagine" anchor="download" onClose={closePanel} visible={visible}>
							<p className="mt-0 mb-3 text-sm text-fg-muted">Il piano com’è ora, a colori su fondo bianco.</p>
							<div className="flex gap-2">
								<button type="button" onClick={() => download('png')} className="h-10 flex-1 rounded-lg border border-edge-strong bg-surface text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
									PNG
								</button>
								<button type="button" onClick={() => download('svg')} className="h-10 flex-1 rounded-lg border border-edge-strong bg-surface text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
									SVG
								</button>
							</div>
						</Popover>
					)}
				</div>

				{/* from `lg` up the panel slides shut: its content keeps its width and the plane takes the room */}
				<div
					className={cn(
						'flex min-h-0 flex-col lg:order-1 lg:shrink-0 lg:overflow-hidden lg:border-edge motion-reduce:transition-none',
						dragWidth === null && 'lg:transition-[width,opacity] lg:duration-300 lg:ease-out',
						sidebar ? 'lg:w-[var(--side)] lg:border-r lg:opacity-100' : 'lg:w-0 lg:opacity-0',
						full && 'max-lg:max-h-[46%] max-lg:border-t max-lg:border-edge'
					)}
					style={{ '--side': `${side}px` } as CSSProperties}
				>
					<div ref={sidePanel} className="flex min-h-0 flex-1 flex-col lg:w-[var(--side)]">
					<div className={cn('min-h-0 flex-1 lg:overflow-y-auto', full && 'overflow-y-auto')}>
						{/* what is typed: functions, equations, regions. With the keyboard open on a phone every line counts: the heading gives way to the formula */}
						<SectionHead title="Formule" count={formulaRows.filter((r) => r.latex.trim()).length} open={!closed.formulas} onToggle={() => setClosed((c) => ({ ...c, formulas: !c.formulas }))} className={cn('z-[6]', withKeyboard && 'max-lg:hidden')}>
							<InsertMenu onPick={insertTemplate} />
							{keyboard && (
								<IconButton label={keyboard === 'sapiens' ? 'Usa la tastiera del dispositivo' : 'Usa la tastiera di Sapiens'} onClick={switchKeyboard} pressed={keyboard === 'sapiens'}>
									<Keyboard className="size-4" aria-hidden="true" />
								</IconButton>
							)}
						</SectionHead>
						<Collapse open={!closed.formulas}>
							<ul className="m-0 list-none p-0">{formulaRows.map(renderRow)}</ul>
							<button type="button" onClick={add} className="flex min-h-11 w-full items-center gap-2 px-3 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg-strong focus-ring">
								<Plus className="size-4" aria-hidden="true" />
								Aggiungi una formula
							</button>
						</Collapse>

						{shownParams.length > 0 && (
							<div className="flex flex-col gap-3 border-t border-edge px-2 py-3">
								<p className="label-mono m-0 px-1 text-fg-subtle">Parametri</p>
								{shownParams.map((p) => (
									<ParamSlider key={p} name={plainName(p.replace(/^[a-z]{2,}/, (word) => GREEK[word] ?? word))} spec={specOf(p)} playing={!!moving[p]} onPlay={() => togglePlay(p)} onChange={(part) => setSlider(p, part)} />
								))}
							</div>
						)}

						{/* what is made on the plane with the tools, in the order it was made */}
						{builtRows.length > 0 && (
							<>
								<SectionHead title="Costruzione" count={builtRows.length} open={!closed.built} onToggle={() => setClosed((c) => ({ ...c, built: !c.built }))} className="border-t border-edge" />
								<Collapse open={!closed.built}>
									<ul className="m-0 list-none p-0">{builtRows.map(renderRow)}</ul>
								</Collapse>
							</>
						)}
					</div>
					</div>
				</div>
				{/* the edge between the panel and the plane is a handle: dragged, or with the arrows, it sets the panel's width */}
				<div
					role="separator"
					aria-orientation="vertical"
					aria-label="Larghezza dell’elenco: trascina, oppure usa le frecce"
					aria-valuenow={Math.round(side)}
					aria-valuemin={SIDE.min}
					aria-valuemax={SIDE.max}
					tabIndex={0}
					title="Trascina per allargare o stringere l’elenco"
					className={cn('group relative z-10 -mx-1.5 w-3 shrink-0 cursor-col-resize touch-none outline-none max-lg:hidden lg:order-1', !sidebar && 'hidden')}
					onPointerDown={(e) => {
						e.currentTarget.setPointerCapture(e.pointerId);
						setDragWidth(side);
					}}
					onPointerMove={(e) => dragWidth !== null && root.current && setDragWidth(fitSide(e.clientX - root.current.getBoundingClientRect().left))}
					onPointerUp={() => {
						if (dragWidth !== null) saveSide(dragWidth);
						setDragWidth(null);
					}}
					onPointerCancel={() => setDragWidth(null)}
					onDoubleClick={() => saveSide(SIDE.start)}
					onKeyDown={(e) => {
						if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
						e.preventDefault();
						saveSide(fitSide(side + (e.key === 'ArrowLeft' ? -16 : 16)));
					}}
				>
					<span className={cn('absolute top-1/2 left-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors group-hover:bg-accent group-focus-visible:bg-accent', dragWidth !== null ? 'bg-accent' : 'bg-edge-strong')} />
				</div>
			</div>
		</div>
	);
}
