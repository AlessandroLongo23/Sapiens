/**
 * A graph of the plotter as data: its rows with their look, the sliders of its parameters, the settings of the
 * plane and the window. It is what "undo" steps through, what a link to a graph carries and what an example is.
 * vault/Prodotti/Studenti/Grafico di funzioni.md
 */

import { BUILD_TYPES, type Build } from './geometria';

export type LineWidth = 'thin' | 'normal' | 'thick';
export type LineDash = 'solid' | 'dashed' | 'dotted';

export interface PlotRow {
	id: number;
	latex: string;
	hidden: boolean;
	/** A colour of PALETTE, as #rrggbb. */
	color: string;
	width: LineWidth;
	dash: LineDash;
	/** Writes the function's letter beside its curve. */
	label: boolean;
	/** For a curve (x(t), y(t)) or r = f(θ): where t or θ starts and ends. Absent, a whole turn: 0 to 2π, or to 360 in degrees. */
	t0?: number;
	t1?: number;
	/** For a function: the x where its tangent is drawn, as the axis reads it. */
	tangent?: number;
	/** For a function: the two ends of the area between the curve and the x axis. */
	area?: [number, number];
	/** For a function: a table of its values, from this x and by this step. */
	table?: { from: number; step: number };
	/** A row that is not a formula but an object built from other rows: the line through A and B. Its `latex` is empty. */
	build?: Build;
	/** The name of a built object, in LaTeX: A, r, \gamma_1. A formula has its name in the formula. */
	name?: string;
	/** A point made with a tool on the plane: a formula like any other, shown with the construction it belongs to. */
	placed?: boolean;
}

export type SliderSpeed = 'slow' | 'normal' | 'fast';
/** Back and forth, from the start again, or once to the end. */
export type SliderMode = 'bounce' | 'loop' | 'once';

export interface SliderSpec {
	value: number;
	min: number;
	max: number;
	step: number;
	speed: SliderSpeed;
	mode: SliderMode;
}

export interface PlaneSettings {
	grid: boolean;
	/** The grid of polar coordinates, circles around the origin and rays from it, in place of the squares. */
	polar: boolean;
	axes: boolean;
	numbers: boolean;
	/** The marks of the x axis: numbers, or fractions of π. In degrees they are degrees. */
	xAxis: 'numbers' | 'pi';
	degrees: boolean;
	/** The names written on the two axes: x and y, or t and s for a graph of physics. */
	xName: string;
	yName: string;
}

/**
 * Where the plane looks: the centre of the window and its width, in units. The height follows the drawing's shape
 * and `stretch`, the pixels of a unit of y over those of a unit of x: 1 is the same scale on both axes.
 */
export interface Camera {
	cx: number;
	cy: number;
	span: number;
	stretch: number;
}

/** What "undo" steps through. The window is not part of it: moving around is not a change to the graph. */
export interface PlotDoc {
	rows: PlotRow[];
	sliders: Record<string, SliderSpec>;
	settings: PlaneSettings;
}

/** A whole graph, as a link carries it. */
export interface PlotState extends PlotDoc {
	camera: Camera;
}

/** The colours of the curves, in the order a new row takes them: TikZ's blue, red, green, orange, violet, teal, magenta and black. */
export const PALETTE = ['#0000ff', '#ff0000', '#008000', '#ff8000', '#800080', '#008080', '#c000c0', '#000000'] as const;
export const COLOR_NAMES: Record<string, string> = {
	'#0000ff': 'Blu',
	'#ff0000': 'Rosso',
	'#008000': 'Verde',
	'#ff8000': 'Arancione',
	'#800080': 'Viola',
	'#008080': 'Verde acqua',
	'#c000c0': 'Magenta',
	'#000000': 'Nero'
};

export const HOME: Camera = { cx: 0, cy: 0, span: 20, stretch: 1 };
export const DEFAULT_SETTINGS: PlaneSettings = { grid: true, polar: false, axes: true, numbers: true, xAxis: 'numbers', degrees: false, xName: 'x', yName: 'y' };
export const DEFAULT_SLIDER: SliderSpec = { value: 1, min: -10, max: 10, step: 0.1, speed: 'normal', mode: 'bounce' };

/** The first colour of the palette no row has; when all are taken, the one after the last row's. */
export function nextColor(rows: PlotRow[]): string {
	const free = PALETTE.find((c) => !rows.some((r) => r.color === c));
	if (free) return free;
	const last = PALETTE.indexOf(rows[rows.length - 1].color as (typeof PALETTE)[number]);
	return PALETTE[(last + 1) % PALETTE.length];
}

export function newRow(rows: PlotRow[], latex = ''): PlotRow {
	return { id: rows.reduce((max, r) => Math.max(max, r.id), -1) + 1, latex, hidden: false, color: nextColor(rows), width: 'normal', dash: 'solid', label: false };
}

/** A graph from its formulas, with everything else as a new graph has it. */
export function stateOf(formulas: string[], more: Partial<Omit<PlotState, 'rows'>> = {}): PlotState {
	const rows: PlotRow[] = [];
	for (const latex of formulas) rows.push(newRow(rows, latex));
	return { rows, sliders: {}, settings: DEFAULT_SETTINGS, camera: HOME, ...more };
}

// ---------------------------------------------------------------- the link to a graph

const WIDTHS: LineWidth[] = ['thin', 'normal', 'thick'];
const DASHES: LineDash[] = ['solid', 'dashed', 'dotted'];
const SPEEDS: SliderSpeed[] = ['slow', 'normal', 'fast'];
const MODES: SliderMode[] = ['bounce', 'loop', 'once'];

const MAX_ROWS = 120;
const MAX_LATEX = 600;

/** What only some rows have: the tangent's x, the ends of the area, the start and step of the table. */
type RowExtras = { g?: number; i?: [number, number]; v?: [number, number]; /** A build: its type, the places of its rows in the list, then `at` and `index`. */ b?: [string, number[], (number | null)?, (number | null)?]; m?: string; /** Placed with a tool. */ k?: 1 };

type Packed = {
	v: 1;
	r: [string, string, number, number, number, number, (number | null)?, (number | null)?, RowExtras?][];
	n?: [string, string];
	s: Record<string, [number, number, number, number, number, number]>;
	o: [number, number, number, number, number, number?];
	c: [number, number, number, number];
};

function toBase64Url(text: string): string {
	const bytes = new TextEncoder().encode(text);
	let binary = '';
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code: string): string {
	const binary = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
	return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

/** The graph as the text a link carries after "#g=". */
export function encodeState(state: PlotState): string {
	const r6 = (x: number) => Number(x.toPrecision(8));
	const packed: Packed = {
		v: 1,
		r: state.rows.map((r) => {
			const packed: Packed['r'][number] = [r.latex, r.color, WIDTHS.indexOf(r.width), DASHES.indexOf(r.dash), r.label ? 1 : 0, r.hidden ? 1 : 0];
			const extras: RowExtras = {};
			if (r.tangent !== undefined) extras.g = r.tangent;
			if (r.area) extras.i = r.area;
			if (r.table) extras.v = [r.table.from, r.table.step];
			// a link numbers the rows by their place: a build points to places
			if (r.build) extras.b = [r.build.type, r.build.of.map((id) => state.rows.findIndex((o) => o.id === id)), r.build.at ?? null, r.build.index ?? null];
			if (r.name) extras.m = r.name;
			if (r.placed) extras.k = 1;
			const more = Object.keys(extras).length > 0;
			if (more || r.t0 !== undefined || r.t1 !== undefined) packed.push(r.t0 ?? null, r.t1 ?? null);
			if (more) packed.push(extras);
			return packed;
		}),
		s: Object.fromEntries(Object.entries(state.sliders).map(([name, s]) => [name, [s.value, s.min, s.max, s.step, SPEEDS.indexOf(s.speed), MODES.indexOf(s.mode)]])),
		o: [state.settings.grid ? 1 : 0, state.settings.axes ? 1 : 0, state.settings.numbers ? 1 : 0, state.settings.xAxis === 'pi' ? 1 : 0, state.settings.degrees ? 1 : 0, state.settings.polar ? 1 : 0],
		...(state.settings.xName !== 'x' || state.settings.yName !== 'y' ? { n: [state.settings.xName, state.settings.yName] as [string, string] } : {}),
		c: [r6(state.camera.cx), r6(state.camera.cy), r6(state.camera.span), r6(state.camera.stretch)]
	};
	return toBase64Url(JSON.stringify(packed));
}

const finite = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const pick = <T>(list: T[], i: unknown, fallback: T): T => (typeof i === 'number' && list[i] !== undefined ? list[i] : fallback);

/** The name of an axis: a few letters, nothing that could be markup. */
export function axisName(name: unknown, fallback: string): string {
	return typeof name === 'string' && /^[\p{L}\p{N}_ ()/°]{1,8}$/u.test(name.trim()) ? name.trim() : fallback;
}

/** The name of a built object: a letter or a Greek one, with a number below. */
const BUILT_NAME = /^(?:[A-Za-z]|\\[a-z]{2,8})(?:_\{?[0-9]{1,3}\}?)?$/;

function rowExtras(e: unknown, self: number, count: number): Partial<PlotRow> {
	if (typeof e !== 'object' || e === null) return {};
	const { g, i, v, b, m, k } = e as RowExtras;
	const place = (k: unknown) => Number.isInteger(k) && (k as number) >= 0 && (k as number) < count && k !== self;
	const built = Array.isArray(b) && (BUILD_TYPES as readonly string[]).includes(b[0]) && Array.isArray(b[1]) && b[1].length >= 1 && b[1].length <= 12 && b[1].every(place);
	return {
		...(built ? { build: { type: b[0] as Build['type'], of: b[1], ...(finite(b[2]) ? { at: b[2] } : {}), ...(Number.isInteger(b[3]) && (b[3] as number) >= 0 && (b[3] as number) < 4 ? { index: b[3] as number } : {}) } } : {}),
		...(typeof m === 'string' && BUILT_NAME.test(m) ? { name: m } : {}),
		...(k === 1 ? { placed: true } : {}),
		...(finite(g) ? { tangent: g } : {}),
		...(Array.isArray(i) && finite(i[0]) && finite(i[1]) ? { area: [i[0], i[1]] as [number, number] } : {}),
		...(Array.isArray(v) && finite(v[0]) && finite(v[1]) && v[1] > 0 ? { table: { from: v[0], step: v[1] } } : {})
	};
}

/** The graph a link carries, or null when the text is not one: a link can be cut short or written by hand. */
export function decodeState(code: string): PlotState | null {
	try {
		const p = JSON.parse(fromBase64Url(code)) as Partial<Packed>;
		if (p.v !== 1 || !Array.isArray(p.r)) return null;
		const count = Math.min(p.r.length, MAX_ROWS);
		const rows: PlotRow[] = p.r.slice(0, MAX_ROWS).map((r, id) => {
			if (!Array.isArray(r) || typeof r[0] !== 'string' || r[0].length > MAX_LATEX) throw new Error('row');
			return {
				id,
				latex: r[0],
				color: (PALETTE as readonly string[]).includes(r[1]) ? r[1] : PALETTE[id % PALETTE.length],
				width: pick(WIDTHS, r[2], 'normal'),
				dash: pick(DASHES, r[3], 'solid'),
				label: r[4] === 1,
				hidden: r[5] === 1,
				...(finite(r[6]) ? { t0: r[6] } : {}),
				...(finite(r[7]) ? { t1: r[7] } : {}),
				...rowExtras(r[8], id, count)
			};
		});
		const sliders: Record<string, SliderSpec> = {};
		for (const [name, s] of Object.entries(p.s ?? {})) {
			if (!/^[A-Za-z]+(_[A-Za-z0-9]+)?$/.test(name) || name.length > 12 || !Array.isArray(s)) continue;
			const [value, min, max, step] = s;
			if (!finite(value) || !finite(min) || !finite(max) || !finite(step) || !(max > min) || !(step > 0)) continue;
			sliders[name] = { value: Math.min(max, Math.max(min, value)), min, max, step, speed: pick(SPEEDS, s[4], 'normal'), mode: pick(MODES, s[5], 'bounce') };
		}
		const o = Array.isArray(p.o) ? p.o : [1, 1, 1, 0, 0];
		const c = Array.isArray(p.c) && p.c.every(finite) && p.c[2] > 0 && p.c[3] > 0 ? p.c : [HOME.cx, HOME.cy, HOME.span, HOME.stretch];
		return {
			rows,
			sliders,
			settings: { grid: o[0] !== 0, axes: o[1] !== 0, numbers: o[2] !== 0, xAxis: o[3] === 1 ? 'pi' : 'numbers', degrees: o[4] === 1, polar: o[5] === 1, xName: axisName(p.n?.[0], 'x'), yName: axisName(p.n?.[1], 'y') },
			camera: { cx: c[0], cy: c[1], span: c[2], stretch: c[3] }
		};
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------- examples

export interface PlotExample {
	title: string;
	/** What the example shows, in a line. */
	about: string;
	state: PlotState;
}

const slider = (value: number, more: Partial<SliderSpec> = {}): SliderSpec => ({ ...DEFAULT_SLIDER, value, ...more });
const named = (state: PlotState, labels: number[]): PlotState => ({ ...state, rows: state.rows.map((r, i) => (labels.includes(i) ? { ...r, label: true } : r)) });

/** Graphs ready to open, from the programme of the Italian school. */
// ---------------------------------------------------------------- showpieces

/*
 * Graphs made to see how far the plotter goes (Alessandro, 2 October 2026: "to test the absolute limit", to be taken
 * away later). They lean on three things: a function of two letters used by its name alone, the coordinates of a
 * point in a formula (x_A), and a piece of a formula that is evaluated once however many times it is used.
 */

/** The distance of (x; y) from the point P, and its square. */
const square = (P: string) => `\\left(x-x_${P}\\right)^2+\\left(y-y_${P}\\right)^2`;
const distance = (P: string) => `\\sqrt{${square(P)}}`;
const point = (name: string, x: number, y: number) => `${name}=\\left(${String(x).replace('.', '{,}')};${String(y).replace('.', '{,}')}\\right)`;
const xy = '\\left(x,y\\right)';

const SHOWPIECES: PlotExample[] = [
	{
		title: 'Metaball',
		about: 'Tre punti da trascinare: è colorato dove la somma dei loro campi supera k.',
		state: stateOf([point('A', -1.5, 0.5), point('B', 1.5, 1), point('C', 0, -1.5), `m${xy}=\\frac{1}{${square('A')}}+\\frac{1}{${square('B')}}+\\frac{1}{${square('C')}}`, 'm\\ge k'], {
			sliders: { k: slider(1, { min: 0.3, max: 3, step: 0.05 }) },
			camera: { cx: 0, cy: 0, span: 11, stretch: 1 }
		})
	},
	{
		title: 'Interferenza di due sorgenti',
		about: 'Le onde di A e di B si sommano. Trascina le sorgenti, e fai partire w per vederle correre.',
		state: stateOf([point('A', -2, 0), point('B', 2, 0), `u${xy}=${distance('A')}`, `v${xy}=${distance('B')}`, '\\sin\\left(ku-w\\right)+\\sin\\left(kv-w\\right)>0'], {
			sliders: { k: slider(4, { min: 1, max: 8 }), w: slider(0, { min: 0, max: 6.28, step: 0.04, speed: 'fast', mode: 'loop' }) },
			camera: { cx: 0, cy: 0, span: 16, stretch: 1 }
		})
	},
	{
				title: 'Insieme di Mandelbrot',
		about: 'z² + c come due successioni che si leggono a vicenda: resta colorato il c da cui z non scappa dopo k passi.',
		state: stateOf(['a_{n+1}=a_n^2-b_n^2+x', 'b_{n+1}=2a_nb_n+y', 'a_0=0', 'b_0=0', 'a_k^2+b_k^2\\le4'], {
			sliders: { k: slider(12, { min: 1, max: 40, step: 1, speed: 'slow' }) },
			camera: { cx: -0.65, cy: 0, span: 3.6, stretch: 1 }
		})
	},
	{
		title: 'Ellisse, iperbole e ovale dagli stessi fuochi',
		about: 'Somma, differenza e prodotto delle distanze da A e B. Trascina i fuochi.',
		state: stateOf([point('A', -2, 0), point('B', 2, 0), `p${xy}=${distance('A')}`, `q${xy}=${distance('B')}`, 'p+q=k', '\\left|p-q\\right|=h', 'pq=c'], {
			sliders: { k: slider(6, { min: 4.1, max: 10 }), h: slider(2, { min: 0.1, max: 3.9 }), c: slider(4.5, { min: 0.5, max: 12 }) },
			camera: { cx: 0, cy: 0, span: 14, stretch: 1 }
		})
	},
	{
		title: 'Linee di livello di un dipolo',
		about: 'Il potenziale di due cariche opposte in A e B: una riga sola disegna tutte le linee.',
		state: stateOf([point('A', -2, 0), point('B', 2, 0), `p${xy}=${distance('A')}`, `q${xy}=${distance('B')}`, '\\sin\\left(k\\pi\\left(\\frac{1}{p}-\\frac{1}{q}\\right)\\right)=0'], {
			sliders: { k: slider(4, { min: 1, max: 10, step: 0.5 }) },
			camera: { cx: 0, cy: 0, span: 14, stretch: 1 }
		})
	},
	{
		title: 'Cuore che batte',
		about: 'Una disequazione di sesto grado. Fai partire a.',
		state: {
			...stateOf([], { sliders: { a: slider(1, { min: 0.7, max: 1.3, step: 0.01, speed: 'fast' }) }, camera: { cx: 0, cy: 0.2, span: 5, stretch: 1 } }),
			rows: [{ ...newRow([], '\\left(x^2+y^2-a\\right)^3\\le x^2y^3'), color: PALETTE[1] }]
		}
	},
	{
		title: 'Curva a farfalla',
		about: 'Una sola curva polare, con θ che fa dodici giri.',
		state: {
			...stateOf([], { settings: { ...DEFAULT_SETTINGS, polar: true }, camera: { cx: 0, cy: 0.8, span: 11, stretch: 1 } }),
			rows: [{ ...newRow([], 'r=e^{\\sin\\theta}-2\\cos\\left(4\\theta\\right)+\\sin^5\\left(\\frac{2\\theta-\\pi}{24}\\right)'), t0: 0, t1: 24 * Math.PI, color: PALETTE[4] }]
		}
	}
];

/** A graph with objects built on its rows: each build names its rows by their place in the list. */
function withBuilds(state: PlotState, builds: [Build, string?][]): PlotState {
	const rows: PlotRow[] = state.rows.map((r) => ({ ...r, placed: true }));
	for (const [build, name] of builds) rows.push({ ...newRow(rows), build, ...(name ? { name, label: !/^[A-Z]/.test(name) } : {}) });
	return { ...state, rows };
}

export const EXAMPLES: PlotExample[] = [
	{
		title: 'Parabola',
		about: 'Muovi a, b e c e guarda come cambiano vertice e zeri.',
		state: stateOf(['f\\left(x\\right)=ax^2+bx+c'], { sliders: { a: slider(1, { min: -5, max: 5 }), b: slider(-2, { min: -8, max: 8 }), c: slider(-1, { min: -8, max: 8 }) } })
	},
	{
		title: 'Retta e parabola',
		about: 'Le intersezioni sono le soluzioni del sistema.',
		state: stateOf(['f\\left(x\\right)=x^2-2x-1', 'g\\left(x\\right)=mx+q'], { sliders: { m: slider(1, { min: -5, max: 5 }), q: slider(1, { min: -8, max: 8 }) } })
	},
	{
		title: 'Seno e coseno',
		about: 'Sull’asse x i multipli di π.',
		state: named(stateOf(['f\\left(x\\right)=\\sin\\left(x\\right)', 'g\\left(x\\right)=\\cos\\left(x\\right)'], { settings: { ...DEFAULT_SETTINGS, xAxis: 'pi' }, camera: { cx: 0, cy: 0, span: 4.4 * Math.PI, stretch: 1.6 } }), [0, 1])
	},
	{
		title: 'Sinusoide',
		about: 'Ampiezza, pulsazione e fase di A sin(ωx + φ).',
		state: stateOf(['f\\left(x\\right)=A\\sin\\left(wx+p\\right)'], {
			sliders: { A: slider(2, { min: 0, max: 5 }), w: slider(1, { min: 0.1, max: 5 }), p: slider(0, { min: -3.2, max: 3.2 }) },
			settings: { ...DEFAULT_SETTINGS, xAxis: 'pi' },
			camera: { cx: 0, cy: 0, span: 4.4 * Math.PI, stretch: 1 }
		})
	},
	{
		title: 'Esponenziale e logaritmo',
		about: 'Una è la simmetrica dell’altra rispetto alla bisettrice.',
		state: named(stateOf(['f\\left(x\\right)=a^x', 'g\\left(x\\right)=\\log_a\\left(x\\right)', 'y=x'], { sliders: { a: slider(2, { min: 0.1, max: 5 }) }, camera: { cx: 0, cy: 0, span: 14, stretch: 1 } }), [0, 1])
	},
	{
		title: 'Funzione omografica',
		about: 'Un’iperbole con i suoi due asintoti.',
		state: stateOf(['f\\left(x\\right)=\\frac{ax+b}{x+d}'], { sliders: { a: slider(2, { min: -5, max: 5 }), b: slider(1, { min: -5, max: 5 }), d: slider(1, { min: -5, max: 5 }) } })
	},
	{
		title: 'Una cubica e la sua derivata',
		about: 'Dove f′ si annulla, f ha un massimo o un minimo.',
		state: named(stateOf(['f\\left(x\\right)=x^3-3x', "g\\left(x\\right)=f^{\\prime}\\left(x\\right)"], { camera: { cx: 0, cy: 0, span: 10, stretch: 1 } }), [0, 1])
	},
	{
		title: 'Valore assoluto',
		about: 'Il grafico si ribalta sopra l’asse x.',
		state: named(stateOf(['f\\left(x\\right)=x^2-4', 'g\\left(x\\right)=\\left|f\\left(x\\right)\\right|'], { camera: { cx: 0, cy: 1, span: 12, stretch: 1 } }), [0, 1])
	},
	{
		title: 'Circonferenza ed ellisse',
		about: 'Due equazioni in x e y, con il raggio e i semiassi da muovere.',
		state: stateOf(['x^2+y^2=r^2', '\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1'], { sliders: { r: slider(2, { min: 0.1, max: 6 }), a: slider(5, { min: 0.1, max: 8 }), b: slider(3, { min: 0.1, max: 6 }) }, camera: { cx: 0, cy: 0, span: 16, stretch: 1 } })
	},
	{
		title: 'Iperbole e asintoti',
		about: 'I due rami si avvicinano alle rette senza toccarle.',
		state: stateOf(['\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1', 'y=\\frac{b}{a}x', 'y=-\\frac{b}{a}x'], { sliders: { a: slider(2, { min: 0.1, max: 6 }), b: slider(1.5, { min: 0.1, max: 6 }) }, camera: { cx: 0, cy: 0, span: 16, stretch: 1 } })
	},
	{
		title: 'Cicloide',
		about: 'La curva di un punto su una ruota che rotola, scritta con il parametro t.',
		state: {
			...stateOf(['\\left(r\\left(t-\\sin\\left(t\\right)\\right);r\\left(1-\\cos\\left(t\\right)\\right)\\right)'], { sliders: { r: slider(1, { min: 0.1, max: 3 }) }, camera: { cx: 6.3, cy: 2, span: 16, stretch: 1 } }),
			rows: [{ ...newRow([], '\\left(r\\left(t-\\sin\\left(t\\right)\\right);r\\left(1-\\cos\\left(t\\right)\\right)\\right)'), t0: 0, t1: 4 * Math.PI }]
		}
	},
	{
		title: 'Spirale di Archimede',
		about: 'In coordinate polari il raggio cresce con l’angolo: r = aθ.',
		state: {
			...stateOf([], { sliders: { a: slider(0.3, { min: 0.05, max: 1, step: 0.05 }) }, settings: { ...DEFAULT_SETTINGS, polar: true }, camera: { cx: 0, cy: 0, span: 16, stretch: 1 } }),
			rows: [{ ...newRow([], 'r=a\\theta'), t0: 0, t1: 6 * Math.PI }]
		}
	},
	{
		title: 'Rosa e cardioide',
		about: 'Due curve che si scrivono in una riga solo in r e θ.',
		state: stateOf(['r=3\\cos\\left(k\\theta\\right)', 'r=1+\\cos\\left(\\theta\\right)'], { sliders: { k: slider(2, { min: 1, max: 8, step: 1 }) }, settings: { ...DEFAULT_SETTINGS, polar: true }, camera: { cx: 0, cy: 0, span: 10, stretch: 1 } })
	},
	{
		title: 'Funzione a tratti',
		about: 'Un pezzo per ogni condizione, come nel sistema con la graffa.',
		state: stateOf(['f\\left(x\\right)=\\begin{cases}x^2 & x<1\\\\ 2-x & x\\ge1\\end{cases}'], { camera: { cx: 0, cy: 1, span: 12, stretch: 1 } })
	},
	{
		title: 'Sistema di disequazioni',
		about: 'La soluzione è la parte del piano dove le regioni si sovrappongono.',
		state: stateOf(['y\\le-x+4', 'y>x^2-2', 'x\\ge0'], { camera: { cx: 0, cy: 1, span: 14, stretch: 1 } })
	},
	{
		title: 'Circonferenza per tre punti',
		about: 'Il centro è dove si incontrano gli assi dei lati: trascina i vertici.',
		state: withBuilds(stateOf(['A=\\left(-3;0\\right)', 'B=\\left(3;0\\right)', 'C=\\left(1;4\\right)'], { camera: { cx: 0, cy: 1, span: 14, stretch: 1 } }), [
			[{ type: 'segment', of: [0, 1] }],
			[{ type: 'segment', of: [1, 2] }],
			[{ type: 'segment', of: [2, 0] }],
			[{ type: 'circle3', of: [0, 1, 2] }, '\\gamma'],
			[{ type: 'bisector', of: [0, 1] }, 'r'],
			[{ type: 'bisector', of: [1, 2] }, 's'],
			[{ type: 'meet', of: [7, 8], index: 0 }, 'O']
		])
	},
		{
		title: 'Successioni e limiti',
		about: 'Un termine generale che sale verso e, e una ricorrenza che scende verso √2.',
		state: stateOf(['a_n=\\left(1+\\frac{1}{n}\\right)^n', 'y=e', 'b_{n+1}=\\frac{b_n}{2}+\\frac{1}{b_n}', 'b_0=4', 'y=\\sqrt{2}'], { camera: { cx: 9, cy: 2.2, span: 22, stretch: 3 } })
	},
	{
		title: 'Successione di Fibonacci',
		about: 'Ogni termine è la somma dei due prima: servono due valori di partenza.',
		state: stateOf(['F_{n+2}=F_{n+1}+F_n', 'F_0=0', 'F_1=1'], { camera: { cx: 5.5, cy: 28, span: 14, stretch: 0.14 } })
	},
	{
		title: 'Funzione integrale',
		about: 'L’area sotto f da 0 a x, come funzione di x: la sua pendenza è f.',
		state: stateOf(['f\\left(x\\right)=e^{-x^2}', 'F\\left(x\\right)=\\int_0^{x}f\\left(t\\right)\\,dt'], { camera: { cx: 0, cy: 0, span: 8, stretch: 1 } })
	},
	{
		title: 'Tangente e area',
		about: 'Trascina il punto di tangenza e gli estremi dell’area.',
		state: {
			...stateOf([], { camera: { cx: 1, cy: 1, span: 12, stretch: 1 } }),
			rows: [{ ...newRow([], 'f\\left(x\\right)=-\\frac{x^2}{2}+2x+1'), tangent: 0, area: [1, 4] }]
		}
	},
	{
		title: 'Triangolo di punti',
		about: 'Tre punti con un nome, da trascinare sulla griglia.',
		state: stateOf(['A=\\left(-3;-1\\right)', 'B=\\left(4;0\\right)', 'C=\\left(1;4\\right)'], { camera: { cx: 0, cy: 1, span: 14, stretch: 1 } })
	},
	{
		title: 'Polinomi di Taylor del seno',
		about: 'Più termini, più a lungo il polinomio segue la curva.',
		state: stateOf(['f\\left(x\\right)=\\sin\\left(x\\right)', 'g\\left(x\\right)=\\sum_{k=0}^{n}\\frac{\\left(-1\\right)^k x^{2k+1}}{\\left(2k+1\\right)!}'], {
			sliders: { n: slider(2, { min: 0, max: 10, step: 1, speed: 'slow' }) },
			settings: { ...DEFAULT_SETTINGS, xAxis: 'pi' },
			camera: { cx: 0, cy: 0, span: 6 * Math.PI, stretch: 2 }
		})
	},
	...SHOWPIECES
];
