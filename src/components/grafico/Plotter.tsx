'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Download, GripVertical, Keyboard, Lightbulb, Link2, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, Plus, Redo2, Settings, SlidersHorizontal, Undo2, X } from 'lucide-react';
import { MathField, type MathFieldHandle } from '@/components/math/MathField';
import { PLOT_LAYOUTS, loadMathLive, useKeyboardChoice } from '@/components/math/mathlive';
import { italian } from '@/lib/grafico/assi';
import { integral, mainRange } from '@/lib/grafico/curva';
import { DEFAULT_SLIDER, EXAMPLES, HOME, decodeState, encodeState, newRow, type Camera, type PlotDoc, type PlotRow, type PlotState, type SliderSpec } from '@/lib/grafico/documento';
import { GREEK, cleanLatex, definitions, freeName, isUnnamedFunction, readEntry, type Entry, type Json } from '@/lib/grafico/formula';
import { cn } from '@/lib/utils/cn';
import { downloadPlane } from './export';
import { Plane, type PlaneCurve, type PlaneHandle, type PlaneMark } from './Plane';
import { Collapse, IconButton, NumberBox, ParamSlider, PlaneSettingsPanel, Popover, RowStyle, ValueTable, usePresence, type WindowBounds } from './PlotterParts';
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
	role: 'point' | 'fixed' | 'tangent' | 'areaStart' | 'areaEnd';
	at: { x: number; y: number };
	color: string;
	name?: string;
	text?: string;
}

/** A number as a formula field writes it: 2,5 with MathLive's decimal comma. */
const latexNumber = (x: number) => String(Number(x.toPrecision(10))).replace('.', '{,}');
type Panel = 'settings' | 'examples' | 'download';

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
const NO_VALUES = 'In questa parte del piano la funzione non ha valori: controlla il dominio, o spostati.';

export function Plotter({ initial, read }: { initial: PlotState; /** The reading of the starting formulas, made on the server. */ read: PlotterFormula[] }) {
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
	const [full, setFull] = useState(false);
	const [copied, setCopied] = useState(false);
	const [playing, setPlaying] = useState<Record<string, true>>({});
	const root = useRef<HTMLDivElement>(null);
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
			if (!row.latex.trim()) return null;
			if (parse) return parse(cleanLatex(row.latex));
			return given.get(row.latex) ?? null;
		});
		// a row "f(x) = …" names a function the other rows can use: f(x) + 1, f′(x)
		const defs = definitions(jsons.filter((j): j is Json => j !== null));
		return jsons.map((j) => (j === null ? { kind: 'empty' } : readEntry(j, defs, { degrees: settings.degrees })));
	}, [rows, parse, read, settings.degrees]);

	// on the polar grid the x axis measures the radius, a length: only the angles are in degrees
	const polarGrid = settings.grid && settings.polar;
	const xUnit = settings.degrees && !polarGrid ? DEGREES : 1;
	const params = useMemo(() => [...new Set(entries.flatMap((e) => ('params' in e ? e.params : [])))].sort(), [entries]);
	const specOf = useCallback((name: string): SliderSpec => sliders[name] ?? DEFAULT_SLIDER, [sliders]);

	/**
	 * What the rows put on the plane: their curves and regions, the points that are not curves (the student's points,
	 * the foot of a tangent, the ends of an area) and, for the table of values, each function as the axis reads it.
	 */
	const drawing = useMemo(() => {
		const curves: PlaneCurve[] = [];
		const spots: Spot[] = [];
		const functions = new Map<number, (x: number) => number>();
		rows.forEach((row, i) => {
			const entry = entries[i];
			if (entry.kind === 'empty' || entry.kind === 'error') return;
			// one scope for all the evaluations of a curve: the sampling calls it thousands of times a frame
			const scope: Record<string, number> = { x: 0, y: 0, t: 0, theta: 0 };
			for (const p of entry.params) scope[p] = specOf(p).value;
			const look = { id: String(row.id), color: row.color, width: row.width, dash: row.dash };

			if (entry.kind === 'function') {
				// the formula's x is the x written on the axis
				const at = (x: number) => ((scope.x = x), entry.f(scope));
				functions.set(row.id, at);
				if (row.hidden) return;
				const tangent = row.tangent === undefined ? undefined : { x: row.tangent / xUnit, slope: ((scope.x = row.tangent), entry.d(scope)) * xUnit };
				const area = row.area ? { a: row.area[0] / xUnit, b: row.area[1] / xUnit, text: `∫ = ${italian(integral(at, row.area[0], row.area[1]), 3)}` } : undefined;
				curves.push({ ...look, label: row.label ? entry.name : undefined, f: (x) => at(x * xUnit), tangent, area });
				if (tangent) spots.push({ id: `tangent:${row.id}`, row: row.id, role: 'tangent', at: { x: tangent.x, y: at(row.tangent!) }, color: row.color, text: `m = ${italian(tangent.slope / xUnit, 3)}` });
				if (row.area) row.area.forEach((x, end) => spots.push({ id: `area${end}:${row.id}`, row: row.id, role: end ? 'areaEnd' : 'areaStart', at: { x: x / xUnit, y: 0 }, color: row.color }));
				return;
			}
			if (row.hidden) return;
			if (entry.kind === 'implicit') curves.push({ ...look, implicit: (x, y) => ((scope.x = x * xUnit), (scope.y = y), entry.f(scope)) });
			else if (entry.kind === 'inequality') curves.push({ ...look, strict: entry.strict, region: (x, y) => ((scope.x = x * xUnit), (scope.y = y), entry.f(scope)) });
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
		return { curves, spots, functions };
	}, [rows, entries, specOf, xUnit, settings.degrees]);
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
		const copy = { ...newRow(current.current.rows, row.latex), width: row.width, dash: row.dash };
		setRows((list) => list.flatMap((r) => (r.id === row.id ? [r, copy] : [r])));
	};
	const remove = (id: number) => {
		setRows((list) => list.filter((r) => r.id !== id));
		if (styled === id) setStyled(null);
	};

	// A function written without a name gets one when the student has finished writing it: the first letter free,
	// from f. With a name the other rows can use it, f(x) + 1 or f′(x).
	const nameIt = (id: number, latex: string) => {
		if (!parse || !latex.trim()) return;
		const others = current.current.rows.filter((r) => r.id !== id && r.latex.trim()).map((r) => parse(cleanLatex(r.latex)));
		const json = parse(cleanLatex(latex));
		if (!isUnnamedFunction(json, definitions(others))) return;
		const name = freeName([...others, json]);
		if (!name) return;
		const named = `${name}\\left(x\\right)=${latex}`;
		fields.current.get(id)?.set(named);
		updateRow(id, { latex: named }, `row:${id}`);
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
	const dragRow = (clientY: number) => {
		if (gripped.current === null) return;
		const items = [...(root.current?.querySelectorAll<HTMLElement>('[data-row]') ?? [])];
		const over = items.findIndex((el) => {
			const box = el.getBoundingClientRect();
			return clientY >= box.top && clientY <= box.bottom;
		});
		if (over >= 0) moveRow(gripped.current, over);
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

	// ------------------------------------------------------------ the bar's actions

	const stepBack = () => {
		undo();
		setSynced((n) => n + 1);
	};
	const stepForward = () => {
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

	const share = async () => {
		const url = `${window.location.origin}${window.location.pathname}#g=${encodeState({ ...doc, camera })}`;
		window.history.replaceState(null, '', url);
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2200);
		} catch {
			// no clipboard here: the address bar has the link all the same
		}
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
	// a tool switched on starts in the middle of the window, on round numbers
	const round = (x: number) => Number(x.toPrecision(2));
	const toolDefaults = { tangent: round(camera.cx * xUnit), area: [round((camera.cx - camera.span / 8) * xUnit), round((camera.cx + camera.span / 8) * xUnit)] as [number, number] };
	const look = { grid: settings.grid, axes: settings.axes, numbers: settings.numbers, xAxis: polarGrid ? ('numbers' as const) : settings.degrees ? ('degrees' as const) : settings.xAxis, xUnit, xName: settings.xName, yName: settings.yName, polar: settings.polar ? (settings.degrees ? ('degrees' as const) : ('radians' as const)) : undefined };
	const withKeyboard = keyboardHeight > 0;

	return (
		<div
			ref={root}
			onKeyDown={shortcuts}
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
				<span data-popover="download">
					<IconButton label="Scarica l’immagine" onClick={() => toggle('download')} pressed={panel === 'download'}>
						<Download className="size-4" aria-hidden="true" />
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
						marks={marks}
						onFit={fit}
						look={look}
						label={names ? `Piano cartesiano con ${names === 1 ? 'una funzione' : `${names} funzioni`}` : 'Piano cartesiano'}
					/>

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
						'flex min-h-0 flex-col lg:order-1 lg:shrink-0 lg:overflow-hidden lg:border-edge lg:transition-[width,opacity] lg:duration-300 lg:ease-out motion-reduce:transition-none',
						sidebar ? 'lg:w-[23rem] lg:border-r lg:opacity-100' : 'lg:w-0 lg:opacity-0',
						full && 'max-lg:max-h-[46%] max-lg:border-t max-lg:border-edge'
					)}
				>
					<div ref={sidePanel} className="flex min-h-0 flex-1 flex-col lg:w-[23rem]">
					{/* with the keyboard open on a phone every line counts: the heading gives way to the formula */}
					<div className={cn('flex shrink-0 items-center justify-between border-b border-edge-soft py-1 pr-1.5 pl-3', withKeyboard && 'max-lg:hidden')}>
						<p className="label-mono m-0 text-fg-subtle">Funzioni</p>
						{keyboard && (
							<IconButton label={keyboard === 'sapiens' ? 'Usa la tastiera del dispositivo' : 'Usa la tastiera di Sapiens'} onClick={switchKeyboard} pressed={keyboard === 'sapiens'}>
								<Keyboard className="size-4" aria-hidden="true" />
							</IconButton>
						)}
					</div>

					<div className={cn('min-h-0 flex-1 lg:overflow-y-auto', full && 'overflow-y-auto')}>
						<ul className="m-0 list-none p-0">
							{rows.map((row, i) => {
								const entry = entries[i];
								const message = entry.kind === 'error' ? entry.message : blank.has(row.id) ? NO_VALUES : entry.kind === 'function' ? entry.note : undefined;
								return (
									<li key={row.id} data-row={row.id} onFocus={() => (lastField.current = row.id)} className="border-b border-edge-soft transition-colors focus-within:bg-surface-2" style={{ scrollMarginBottom: keyboardHeight + 12 }}>
										<div className="flex items-center gap-0.5 py-1 pr-1">
											<button
												type="button"
												aria-label={`Sposta la riga ${i + 1}: trascina, oppure usa le frecce su e giù`}
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
													moveRow(row.id, i + (e.key === 'ArrowUp' ? -1 : 1));
												}}
											>
												<GripVertical className="size-4" aria-hidden="true" />
											</button>
											<button
												type="button"
												onClick={() => updateRow(row.id, { hidden: !row.hidden })}
												aria-pressed={!row.hidden}
												aria-label={row.hidden ? `Mostra la curva ${i + 1}` : `Nascondi la curva ${i + 1}`}
												title={row.hidden ? 'Mostra la curva' : 'Nascondi la curva'}
												className="flex size-9 shrink-0 items-center justify-center rounded-lg focus-ring"
											>
												<span className="plot-swatch block size-4 rounded-full border-2" style={{ borderColor: row.color, backgroundColor: row.hidden ? 'transparent' : row.color }} />
											</button>
											<MathField
												ref={(handle) => {
													if (handle) fields.current.set(row.id, handle);
													else fields.current.delete(row.id);
												}}
												initial={row.latex}
												onChange={(latex) => updateRow(row.id, { latex }, `row:${row.id}`)}
												onDone={(latex) => nameIt(row.id, latex)}
												label={`Funzione ${i + 1}`}
												layouts={PLOT_LAYOUTS}
												keyboard={keyboard}
												onEnter={add}
												className="flex-1 py-2.5 pl-1 text-lg text-fg-strong"
											/>
											<IconButton label={`Aspetto della curva ${i + 1}`} onClick={() => setStyled((s) => (s === row.id ? null : row.id))} pressed={styled === row.id}>
												<SlidersHorizontal className="size-4" aria-hidden="true" />
											</IconButton>
											<IconButton label={`Togli la funzione ${i + 1}`} onClick={() => remove(row.id)}>
												<X className="size-4" aria-hidden="true" />
											</IconButton>
										</div>
										{message && (
											<p role="status" className="mt-0 mb-2 px-3 text-sm text-fg-muted">
												{message}
											</p>
										)}
										{(entry.kind === 'parametric' || entry.kind === 'polar') && (
											<div className="flex items-end gap-2 px-3 pb-2.5">
												<span className="pb-1.5 font-[KaTeX_Math,serif] text-base text-fg-muted italic">{entry.kind === 'polar' ? 'θ' : 't'}</span>
												<NumberBox label="da" pi={!settings.degrees} value={tRange(row, settings.degrees)[0]} valid={(v) => v < tRange(row, settings.degrees)[1]} onChange={(t0) => updateRow(row.id, { t0 })} className="w-24" />
												<NumberBox label="a" pi={!settings.degrees} value={tRange(row, settings.degrees)[1]} valid={(v) => v > tRange(row, settings.degrees)[0]} onChange={(t1) => updateRow(row.id, { t1 })} className="w-24" />
											</div>
										)}
										{entry.kind === 'function' && (
											<Collapse open={!!row.table}>
												<ValueTable row={row} name={entry.name ? `${entry.name}(${settings.xName})` : settings.yName} variable={settings.xName} f={drawing.functions.get(row.id) ?? (() => NaN)} onChange={(table) => updateRow(row.id, { table }, `table:${row.id}`)} />
											</Collapse>
										)}
										<Collapse open={styled === row.id}>
											<RowStyle
												row={row}
												name={entry.kind === 'function' ? entry.name : undefined}
												tools={entry.kind === 'function' ? toolDefaults : undefined}
												onChange={(part) => updateRow(row.id, part)}
												onDuplicate={() => duplicate(row)}
												onRemove={() => remove(row.id)}
											/>
										</Collapse>
									</li>
								);
							})}
						</ul>

						<button type="button" onClick={add} className="flex min-h-11 w-full items-center gap-2 px-3 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg-strong focus-ring">
							<Plus className="size-4" aria-hidden="true" />
							Aggiungi una funzione
						</button>

						{params.length > 0 && (
							<div className="flex flex-col gap-3 border-t border-edge px-2 py-3">
								<p className="label-mono m-0 px-1 text-fg-subtle">Parametri</p>
								{params.map((p) => (
									<ParamSlider key={p} name={GREEK[p] ?? p} spec={specOf(p)} playing={!!moving[p]} onPlay={() => togglePlay(p)} onChange={(part) => setSlider(p, part)} />
								))}
							</div>
						)}
					</div>
					</div>
				</div>
			</div>
		</div>
	);
}
