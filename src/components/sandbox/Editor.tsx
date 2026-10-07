'use client';

import 'katex/dist/katex.min.css';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ChevronRight, Lightbulb, Link2, Maximize2, Minimize2, Pause, Play, Redo2, RotateCcw, StepForward, Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/grafico/PlotterParts';
import { cn } from '@/lib/utils/cn';
import { Select } from '@/components/ui/Field';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { K, THICK, TINT, Tex, num, v } from '@/components/content/interactive/kit';
import { ropeShape, span, type Body, type Pulley, type Rope, type RopeEnd, type Scene, type State, type Surface, type Vec } from '@/lib/sandbox/engine';
import { EMPTY, addPiece, addRope, adopt, decode, encode, flip, moveBody, movePulley, moveRopeEnd, moveSurface, moveSurfaceEnd, remove, rewrap, setEndless, setIncline, setLength, target, type PieceKind, type Sel } from '@/lib/sandbox/edit';
import { atwood, cartAndWeight, incline, inclineAndWeight, lampAndWall, launch, twoThreads } from '@/lib/sandbox/scenes';
import { BodyPanel } from './panels';
import { SceneDrawing, sceneFrame } from './SceneDrawing';
import { LiveChart } from './TimeChart';
import { usePreview, useSim, useDuration } from './useSim';

const EXAMPLES: Record<string, { name: string; build: () => Scene }> = {
	'piano-inclinato': { name: 'Piano inclinato con attrito', build: () => incline({ angle: 30, m: 2, muS: 0.3, muK: 0.2 }) },
	atwood: { name: 'Macchina di Atwood', build: () => atwood() },
	'piano-e-peso': { name: 'Piano inclinato e peso appeso', build: () => inclineAndWeight() },
	carrello: { name: 'Blocco sul tavolo e pesetto', build: () => cartAndWeight({ m1: 4, m2: 2, muS: 0.35, muK: 0.25 }) },
	'due-fili': { name: 'Corpo appeso a due fili', build: () => twoThreads() },
	lampada: { name: 'Lampada tra soffitto e parete', build: () => lampAndWall() },
	lancio: { name: 'Lancio da un tavolo', build: () => launch() }
};

/** The speeds of the clock, in the order the button goes through them. */
const SPEEDS = [
	{ k: 1, label: '×1', say: 'normale' },
	{ k: 0.5, label: '×½', say: 'metà' },
	{ k: 0.25, label: '×¼', say: 'un quarto' },
	{ k: 0.125, label: '×⅛', say: 'un ottavo' }
];

const PIECES: { kind: PieceKind | 'rope'; label: string }[] = [
	{ kind: 'block', label: 'Massa' },
	{ kind: 'ball', label: 'Sfera' },
	{ kind: 'rope', label: 'Corda' },
	{ kind: 'pulley', label: 'Carrucola' },
	{ kind: 'floor', label: 'Pavimento' },
	{ kind: 'incline', label: 'Piano inclinato' },
	{ kind: 'wall', label: 'Parete' },
	{ kind: 'ceiling', label: 'Soffitto' }
];
const SURFACE_NAME = { floor: 'Pavimento', ceiling: 'Soffitto', wall: 'Parete', incline: 'Piano inclinato' } as const;

const QUANTITIES = {
	y: { name: 'altezza', unit: 'm', of: (s: State, i: number) => s.pos[i].y },
	x: { name: 'posizione orizzontale', unit: 'm', of: (s: State, i: number) => s.pos[i].x },
	v: { name: 'velocità', unit: 'm/s', of: (s: State, i: number) => Math.hypot(s.vel[i].x, s.vel[i].y) },
	vx: { name: 'velocità orizzontale', unit: 'm/s', of: (s: State, i: number) => s.vel[i].x },
	vy: { name: 'velocità verticale', unit: 'm/s', of: (s: State, i: number) => s.vel[i].y }
} as const;
type Quantity = keyof typeof QUANTITIES;

const ENDED = { pulley: 'Un corpo è arrivato alla carrucola.', edge: 'Il corpo è arrivato in fondo al piano.', away: 'Un corpo è uscito dalla scena.' } as const;
/** Centimetres of arrow per newton, the same for every scene: a force keeps its length whatever is added around it. */
const FORCE_SCALE = 0.06;
/** The scene at its largest, cm: it fills the frame beside the panel and shrinks with it. */
const CANVAS_W = 22, CANVAS_H = 12.3;
const ACCENT = '#e11d48';

/** The small drawing of a piece in the library. */
function PieceIcon({ kind }: { kind: PieceKind | 'rope' }) {
	const line = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	const hatch = (x1: number, y1: number, dx: number, dy: number, n: number, sx: number, sy: number) => Array.from({ length: n }, (_, i) => <path key={i} d={`M${x1 + i * sx},${y1 + i * sy} l${dx},${dy}`} {...line} strokeWidth={1} />);
	return (
		<svg viewBox="0 0 32 24" width={56} height={42} aria-hidden="true" className="shrink-0">
			{kind === 'block' && <rect x={9} y={5} width={14} height={14} rx={1} {...line} fill="var(--accent-soft)" />}
			{kind === 'ball' && <circle cx={16} cy={12} r={7} {...line} fill="var(--accent-soft)" />}
			{kind === 'rope' && <><path d="M5,19 L27,5" {...line} strokeWidth={1.2} /><circle cx={5} cy={19} r={2} fill="currentColor" /><circle cx={27} cy={5} r={2} fill="currentColor" /></>}
			{kind === 'pulley' && <><circle cx={16} cy={12} r={7} {...line} /><circle cx={16} cy={12} r={1.5} fill="currentColor" /></>}
			{kind === 'floor' && <><path d="M3,13 H29" {...line} />{hatch(6, 13, -3, 4, 6, 4.4, 0)}</>}
			{kind === 'ceiling' && <><path d="M3,11 H29" {...line} />{hatch(6, 11, 3, -4, 6, 4.4, 0)}</>}
			{kind === 'wall' && <><path d="M13,2 V22" {...line} />{hatch(13, 4, -4, 3, 5, 0, 3.6)}</>}
			{kind === 'incline' && <path d="M4,20 H28 V7 Z" {...line} fill="var(--surface-3)" />}
		</svg>
	);
}

/**
 * A value of the selected piece: its name with the unit in brackets on one line, and under it the slider, as wide as
 * the panel allows, with a field for the exact number. `label` can hold a formula; `name` is what a screen reader says.
 */
function Knob({ label, name, unit, value, min, max, step, onChange }: { label: ReactNode; name: string; unit?: string; value: number; min: number; max: number; step: number; onChange: (x: number) => void }) {
	const digits = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
	const set = (x: number) => { if (Number.isFinite(x)) onChange(Number(Math.min(max, Math.max(min, x)).toFixed(digits))); };
	return (
		<div className="flex flex-col gap-0.5 text-sm text-fg-muted">
			<span>
				{label}
				{unit && <span className="text-fg-subtle"> [{unit}]</span>}
			</span>
			<div className="flex items-center gap-2">
				<input type="range" className="slider min-w-0 flex-1" style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties} value={value} min={min} max={max} step={step} onChange={(ev) => set(ev.target.valueAsNumber)} aria-label={name} />
				<input type="number" className="w-[4.5rem] rounded-lg border border-edge bg-surface px-1.5 py-1 text-right text-sm tabular-nums text-fg outline-none focus:border-accent" value={Number(value.toFixed(digits))} min={min} max={max} step={step} onChange={(ev) => set(ev.target.valueAsNumber)} aria-label={`${name}${unit ? `, ${unit}` : ''}`} />
			</div>
		</div>
	);
}

/** A section of the panel, with the heading of the plotter's sections: it opens and closes, and holds its own button. */
function Card({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
	const [open, setOpen] = useState(true);
	return (
		<section className="border-b border-edge-soft">
			<div className="flex items-center gap-0.5 py-1 pr-1.5 pl-1">
				<button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex h-9 min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1.5 text-left hover:bg-surface-2 focus-ring">
					<ChevronRight className={cn('size-4 shrink-0 text-fg-faint transition-transform duration-200 motion-reduce:transition-none', open && 'rotate-90')} aria-hidden="true" />
					<span className="label-mono truncate text-fg-subtle">{title}</span>
				</button>
				{action}
			</div>
			{open && <div className="flex flex-col gap-3 px-3 pt-1 pb-3">{children}</div>}
		</section>
	);
}

/**
 * The physics sandbox with its editor (vault/Prodotti/Studenti/Sandbox di fisica.md). On the left the library of
 * pieces: a click puts one in the scene, selected. In the middle the scene: pieces are dragged, a body snaps onto a
 * surface and takes its slope, the ends of a rope take what they are dropped on, and what rests on a surface moves
 * with it. On the right the values of the selected piece and, for a body, its forces and a graph. The clock runs the
 * scene as it is; any change brings it back to the start.
 */
export function Editor({ example = 'piano-inclinato' }: { example?: string }) {
	const [hist, setHist] = useState(() => ({ past: [] as Scene[], doc: adopt((EXAMPLES[example] ?? EXAMPLES['piano-inclinato']).build()), future: [] as Scene[] }));
	const doc = hist.doc;
	const [sel, setSel] = useState<Sel | null>(null);
	/** Tying a rope: the first end chosen, the pulley it passes over, and where the pointer is. */
	const [tying, setTying] = useState<{ from?: RopeEnd; pulley?: string; at?: Vec } | null>(null);
	/** Which of SPEEDS the clock runs at. */
	const [speed, setSpeed] = useState(0);
	const [chart, setChart] = useState<Quantity>('v');
	const [split, setSplit] = useState(false);
	const [copied, setCopied] = useState(false);
	const [examples, setExamples] = useState(false);
	const sim = useSim(doc, SPEEDS[speed].k);
	// The course of the scene, for the graph of the selected body; not worked out while nothing is selected.
	const ahead = usePreview(doc, sel?.type === 'body');
	const editing = sim.state.t === 0;
	// The time bar is as long as the scene lasts, known before it starts; a scene that got further than expected stretches it.
	const length = Math.max(useDuration(doc), sim.state.t, 0.1);

	const svgRef = useRef<SVGSVGElement | null>(null);
	const drag = useRef<{ move: (p: Vec) => (d: Scene) => Scene; pushed: boolean } | null>(null);
	const lastTag = useRef({ tag: '', time: 0 });
	// Full screen: the browser's own where it exists, otherwise the frame fixed over the page (iPhone), as in the plotter.
	const [full, setFull] = useState(false);
	const root = useRef<HTMLDivElement | null>(null);
	const stage = useRef<HTMLDivElement | null>(null);
	const [room, setRoom] = useState<{ w: number; h: number } | null>(null);
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
	// On the full screen the scene takes the room there is, measured as it changes.
	useEffect(() => {
		const el = stage.current;
		if (!el || !full) return;
		const watch = new ResizeObserver(([entry]) => setRoom({ w: entry.contentRect.width, h: entry.contentRect.height }));
		watch.observe(el);
		return () => watch.disconnect();
	}, [full]);
	const canvasW = full && room ? Math.max(6, room.w / K) : CANVAS_W;
	const canvasH = full && room ? Math.max(4, room.h / K) : CANVAS_H;
	const { S, f } = sceneFrame(doc, canvasW, canvasH);
	const px = (p: Vec) => f.px(v(p.x * S, p.y * S));
	const toWorld = (e: { clientX: number; clientY: number }): Vec => {
		const p = f.toTikz(e, svgRef.current!);
		return { x: p.x / S, y: p.y / S };
	};

	/** A change to undo as one step; changes with the same tag made within a second (a slider being dragged) are one step. */
	const commit = (next: Scene, tag = '') => {
		const now = Date.now();
		const merge = tag !== '' && lastTag.current.tag === tag && now - lastTag.current.time < 1000;
		lastTag.current = { tag, time: now };
		setHist((h) => ({ past: merge ? h.past : [...h.past, h.doc].slice(-60), doc: next, future: [] }));
	};
	const undo = () => setHist((h) => (h.past.length ? { past: h.past.slice(0, -1), doc: h.past[h.past.length - 1], future: [h.doc, ...h.future] } : h));
	const redo = () => setHist((h) => (h.future.length ? { past: [...h.past, h.doc], doc: h.future[0], future: h.future.slice(1) } : h));
	const drop = () => {
		if (!sel) return;
		commit(remove(doc, sel));
		setSel(null);
	};

	// A scene in the link opens instead of the example, now and whenever the link changes.
	useEffect(() => {
		const read = () => {
			const m = /^#s=(.+)$/.exec(window.location.hash);
			const scene = m && decode(m[1]);
			if (scene) setHist({ past: [], doc: scene, future: [] });
		};
		const id = requestAnimationFrame(read);
		window.addEventListener('hashchange', read);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('hashchange', read);
		};
	}, []);
	useEffect(() => {
		const key = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLElement && e.target.closest('input, select, textarea')) return;
			if (e.key === 'Escape') {
				if (!tying && !examples && !document.fullscreenElement) setFull(false);
				setTying(null);
				setExamples(false);
			}
			else if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { e.preventDefault(); drop(); }
			else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
		};
		window.addEventListener('keydown', key);
		return () => window.removeEventListener('keydown', key);
	});

	const pick = (kind: PieceKind | 'rope') => {
		if (kind === 'rope') {
			setSel(null);
			return setTying({});
		}
		setTying(null);
		const added = addPiece(doc, kind);
		commit(added.scene);
		setSel(added.sel);
	};
	// The library never changes while the clock runs: it is built once, and its buttons reach the latest `pick`.
	const pickNow = useRef(pick);
	useEffect(() => {
		pickNow.current = pick;
	});
	const roping = !!tying;
	const library = useMemo(
		() => (
			<>
								{PIECES.map((p) => (
									<button key={p.kind} type="button" onClick={() => pickNow.current(p.kind)} aria-pressed={p.kind === 'rope' ? roping : undefined} className={cn('flex h-[5.25rem] flex-col items-center rounded-xl border px-2 pt-2 pb-1 text-center transition-colors focus-ring', p.kind === 'rope' && roping ? 'border-accent bg-accent-soft text-accent-fg' : 'border-edge bg-surface text-fg hover:bg-surface-2')}>
										<span className="w-full truncate text-sm leading-tight">{p.label}</span>
										<span className="flex flex-1 items-center justify-center"><PieceIcon kind={p.kind} /></span>
									</button>
								))}
			</>
		),
		[roping]
	);
	const tie = (p: Vec) => {
		if (!tying) return;
		const t = target(doc, p);
		if (!tying.from) return t.pulley ? undefined : setTying({ from: t.end, at: p });
		if (t.pulley) return tying.pulley ? undefined : setTying({ ...tying, pulley: t.pulley });
		const added = addRope(doc, tying.from, t.end, tying.pulley);
		commit(added.scene);
		setSel(added.sel);
		setTying(null);
	};

	/** The handlers of a piece that is selected with a click and moved by dragging; `start` gets where it was grabbed. */
	const grab = (piece: Sel, start: (p: Vec) => (p: Vec) => (d: Scene) => Scene) => ({
		onPointerDown: (e: PointerEvent<SVGElement>) => {
			e.stopPropagation();
			setSel(piece);
			if (!editing) return;
			e.currentTarget.setPointerCapture(e.pointerId);
			drag.current = { move: start(toWorld(e)), pushed: false };
		},
		onPointerMove: (e: PointerEvent<SVGElement>) => {
			const d = drag.current;
			if (!d) return;
			const apply = d.move(toWorld(e));
			const first = !d.pushed;
			d.pushed = true;
			setHist((h) => ({ past: first ? [...h.past, h.doc].slice(-60) : h.past, doc: apply(h.doc), future: [] }));
		},
		onPointerUp: () => { drag.current = null; },
		onPointerCancel: () => { drag.current = null; },
		style: { cursor: editing ? 'grab' : 'pointer', touchAction: 'none' as const }
	});
	const off = (from: Vec, p0: Vec) => (p: Vec): Vec => ({ x: p.x + from.x - p0.x, y: p.y + from.y - p0.y });

	const bi = sel?.type === 'body' ? doc.bodies.findIndex((b) => b.id === sel.id) : -1;
	const body: Body | undefined = doc.bodies[bi];
	const surface: Surface | undefined = sel?.type === 'surface' ? doc.surfaces.find((s) => s.id === sel.id) : undefined;
	const rope: Rope | undefined = sel?.type === 'rope' ? doc.ropes.find((r) => r.id === sel.id) : undefined;
	const pulley: Pulley | undefined = sel?.type === 'pulley' ? doc.pulleys.find((c) => c.id === sel.id) : undefined;
	const where = (e: RopeEnd): Vec => ('point' in e ? e.point : (sim.state.pos[doc.bodies.findIndex((b) => b.id === e.body)] ?? { x: 0, y: 0 }));
	const endName = (e: RopeEnd) => ('point' in e ? 'un punto fisso' : (doc.bodies.find((b) => b.id === e.body)?.name ?? 'un corpo'));
	const still = sim.still && !sim.broken;

	let hint: string;
	if (tying) hint = !tying.from ? 'Corda: clicca il corpo o il punto a cui legare il primo capo.' : `Ora clicca dove legare l'altro capo${doc.pulleys.length && !tying.pulley ? ', oppure prima una carrucola su cui farla passare' : ''}. Esc per annullare.`;
	else if (sim.broken) hint = 'Questa disposizione non si può risolvere: sposta un pezzo o togli una corda.';
	else if (sim.state.ended) hint = ENDED[sim.state.ended];
	else if (!editing) hint = `t = ${num(sim.state.t, 2)} s. Per cambiare la scena torna da capo, oppure sposta un valore.`;
	else if (!doc.bodies.length && !doc.surfaces.length) hint = 'La scena è vuota: scegli un pezzo dalla libreria.';
	else if (still && doc.bodies.length) hint = 'Così la scena è in equilibrio. Trascina i pezzi per spostarli: una massa si appoggia da sola al piano a cui la avvicini.';
	else hint = 'Trascina i pezzi per spostarli, clicca un pezzo per cambiarne i valori, poi premi Avvia.';

	// The numbers beside the scene change a few times a second while it runs, and the scene at every frame.
	const read = sim.running ? sim.frames[sim.cursor - (sim.cursor % 6)] : sim.state;
	// The chart follows three frames behind at most, for the same reason.
	const charted = sim.running ? sim.cursor - (sim.cursor % 3) : sim.cursor;
	const upTo = sim.frames[charted];
	// eslint-disable-next-line react-hooks/exhaustive-deps -- a state is in one list of frames only: `upTo` stands for the list up to it
	const lived = useMemo(() => (bi >= 0 ? sim.frames.slice(0, charted + 1).map((s) => ({ t: s.t, y: QUANTITIES[chart].of(s, bi) })) : []), [upTo, chart, bi]);
	const aheadPoints = useMemo(() => (bi >= 0 ? ahead?.map((s) => ({ t: s.t, y: QUANTITIES[chart].of(s, bi) })) : null), [ahead, chart, bi]);

	return (
		<div ref={root} className={cn('flex flex-col border-edge bg-surface', full ? 'fixed inset-0 z-50 overflow-hidden' : 'overflow-clip rounded-2xl border shadow-paper lg:min-h-[min(82vh,46rem)]')} data-sandbox-editor>
			{/* the bar of the plotter: undo on the left, examples, link and clear on the right */}
			<div className="relative flex shrink-0 items-center gap-0.5 border-b border-edge bg-surface-2 px-1.5 py-1.5">
				<IconButton label="Annulla" onClick={undo} disabled={!hist.past.length}>
					<Undo2 className="size-4" aria-hidden="true" />
				</IconButton>
				<IconButton label="Ripeti" onClick={redo} disabled={!hist.future.length}>
					<Redo2 className="size-4" aria-hidden="true" />
				</IconButton>
				<span className="flex-1" />
				<span role="status" className={cn('mr-1 text-xs text-fg-muted transition-opacity', copied ? 'opacity-100' : 'opacity-0')}>
					{copied ? 'Link copiato' : ''}
				</span>
				<IconButton label="Esempi" text="Esempi" onClick={() => setExamples((x) => !x)} pressed={examples}>
					<Lightbulb className="size-4" aria-hidden="true" />
				</IconButton>
				<IconButton label="Copia il link a questa scena" text="Condividi" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#s=${encode(doc)}`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
					<Link2 className="size-4" aria-hidden="true" />
				</IconButton>
				<IconButton label="Svuota la scena" onClick={() => { commit(EMPTY); setSel(null); setTying(null); }} disabled={!doc.bodies.length && !doc.surfaces.length && !doc.pulleys.length && !doc.ropes.length}>
					<Trash2 className="size-4" aria-hidden="true" />
				</IconButton>
				<IconButton label={full ? 'Esci dallo schermo intero' : 'Schermo intero'} onClick={full ? exitFull : enterFull} pressed={full}>
					{full ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
				</IconButton>
				{examples && (
					<div className="absolute top-full right-1.5 z-20 mt-1 w-72 rounded-xl border border-edge bg-surface p-1.5 shadow-paper" role="dialog" aria-label="Esempi">
						<ul className="m-0 flex list-none flex-col gap-0.5 p-0">
							{Object.entries(EXAMPLES).map(([k, x]) => (
								<li key={k}>
									<button type="button" className="flex w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring" onClick={() => { commit(adopt(x.build())); setSel(null); setTying(null); setExamples(false); }}>
										{x.name}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div className="flex min-h-0 flex-1 flex-col lg:flex-row">
				<div className={cn('flex min-w-0 flex-col lg:order-2 lg:flex-1', full && 'min-h-0 flex-1')}>
					<p className="m-0 border-b border-edge-soft px-3 py-2 text-sm text-fg-muted" aria-live="polite">{hint}</p>
					<div ref={stage} className={cn('flex min-w-0 flex-1 items-center justify-center', full ? 'm-2 min-h-0 overflow-hidden' : 'p-2')}>
					<SceneDrawing svgRef={svgRef} grid={0.5} scene={doc} state={sim.state} solution={sim.solution} selected={bi} forces="all" forceScale={FORCE_SCALE} velocityScale={0.4} components={split} trail={bi >= 0 ? sim.frames.slice(0, sim.cursor + 1).map((s) => s.pos[bi]) : []} label="La scena della sandbox: i pezzi si trascinano" maxW={canvasW} maxH={canvasH}>
						{/* a click on the empty scene lets go of the selection */}
						<rect x={0} y={0} width={f.W} height={f.H} fill="transparent" onPointerDown={() => setSel(null)} />
						{doc.surfaces.map((s) => {
							const [a, b] = span(doc, s, 0).map(px);
							const on = sel?.type === 'surface' && sel.id === s.id;
							return (
								<g key={s.id}>
									{on && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT} strokeWidth={4} strokeOpacity={0.55} strokeLinecap="round" pointerEvents="none" />}
									<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={22} strokeLinecap="round" role="button" aria-label={SURFACE_NAME[s.kind ?? 'incline']} {...grab({ type: 'surface', id: s.id }, (p0) => { const o = off(s.a, p0); return (p) => (d) => moveSurface(d, s.id, o(p)); })} />
								</g>
							);
						})}
						{doc.ropes.map((r) => {
							const shape = ropeShape(doc, r, sim.state.pos);
							const on = sel?.type === 'rope' && sel.id === r.id;
							return shape?.strands.map((st, k) => {
								const a = px(st.from), b = px(st.to);
								return (
									<g key={`${r.id}-${k}`}>
										{on && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT} strokeWidth={3} strokeOpacity={0.55} pointerEvents="none" />}
										<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={16} role="button" aria-label="Corda" style={{ cursor: 'pointer' }} onPointerDown={(ev) => { ev.stopPropagation(); setSel({ type: 'rope', id: r.id }); }} />
									</g>
								);
							});
						})}
						{doc.pulleys.map((c) => {
							const p = px(c.at);
							const R = c.r * S * (f.W / (f.x1 - f.x0));
							return (
								<g key={c.id}>
									{/* the selected piece changes colour, as the bodies do: nothing is drawn around it, where the arrows are */}
									{sel?.type === 'pulley' && sel.id === c.id && <><circle cx={p.x} cy={p.y} r={R} fill={TINT.orange} stroke="#000" strokeWidth={THICK} pointerEvents="none" /><circle cx={p.x} cy={p.y} r={1.5} fill="#000" pointerEvents="none" /></>}
									<circle cx={p.x} cy={p.y} r={Math.max(R, 14)} fill="transparent" role="button" aria-label="Carrucola" {...grab({ type: 'pulley', id: c.id }, (p0) => { const o = off(c.at, p0); return (q) => (d) => movePulley(d, c.id, o(q)); })} />
								</g>
							);
						})}
						{doc.bodies.map((b, i) => {
							const p = px(sim.state.pos[i] ?? b.pos);
							const R = b.r * S * (f.W / (f.x1 - f.x0));
							return (
								<g key={b.id}>
									<circle cx={p.x} cy={p.y} r={Math.max(R * 1.3, 16)} fill="transparent" role="button" tabIndex={0} aria-label={`${b.shape === 'ball' ? 'Sfera' : 'Massa'} ${b.name ?? ''}`} aria-pressed={i === bi} className="outline-none" onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSel({ type: 'body', id: b.id }); } }} {...grab({ type: 'body', id: b.id }, (p0) => { const o = off(b.pos, p0); return (q) => (d) => rewrap(moveBody(d, b.id, o(q))); })} />
								</g>
							);
						})}
						{/* the ends of the selected surface and the fixed ends of the selected rope are dragged on their own */}
						{surface && editing && !surface.endless && (['a', 'b'] as const).map((w) => {
							const p = px(surface[w]);
							return <circle key={w} cx={p.x} cy={p.y} r={7} fill="#fff" stroke={ACCENT} strokeWidth={2} role="button" aria-label={`Estremo del ${SURFACE_NAME[surface.kind ?? 'incline'].toLowerCase()}`} {...grab({ type: 'surface', id: surface.id }, () => (q) => (d) => moveSurfaceEnd(d, surface.id, w, q))} />;
						})}
						{rope && editing && (['from', 'to'] as const).map((w) => {
							const end = rope[w];
							if (!('point' in end)) return null;
							const p = px(end.point);
							return <circle key={w} cx={p.x} cy={p.y} r={7} fill="#fff" stroke={ACCENT} strokeWidth={2} role="button" aria-label="Capo fisso della corda" {...grab({ type: 'rope', id: rope.id }, () => (q) => (d) => moveRopeEnd(d, rope.id, w, q))} />;
						})}
						{tying && (
							<>
								{tying.from && tying.at && (() => { const a = px(where(tying.from)), b = px(tying.at); return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT} strokeWidth={1.5} strokeDasharray="5 4" pointerEvents="none" />; })()}
								<rect x={0} y={0} width={f.W} height={f.H} fill="transparent" style={{ cursor: 'crosshair', touchAction: 'none' }} onPointerMove={(ev) => { if (tying.from) setTying({ ...tying, at: toWorld(ev) }); }} onPointerDown={(ev) => { ev.stopPropagation(); tie(toWorld(ev)); }} />
							</>
						)}
					</SceneDrawing>
					</div>
					{/* the clock, under the scene */}
					<div className="mt-auto flex flex-wrap items-center gap-2 border-t border-edge bg-surface-2 px-2 py-2">
						{/* symbols only, in the order of a player: back to the start, play or pause, one step; then the speed, which a click takes to the next slower one and round again */}
						<IconButton label="Da capo" onClick={sim.restart} disabled={editing}>
							<RotateCcw className="size-4" aria-hidden="true" />
						</IconButton>
						<Button size="sm" className="px-2.5" onClick={sim.play} disabled={sim.done || sim.still || sim.broken || !doc.bodies.length} aria-label={sim.running ? 'Pausa' : sim.state.t > 0 ? 'Riprendi' : 'Avvia'} title={sim.running ? 'Pausa' : sim.state.t > 0 ? 'Riprendi' : 'Avvia'}>
							{sim.running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4 translate-x-px" aria-hidden="true" />}
						</Button>
						<IconButton label="Un passo" onClick={() => sim.forward(0.05)} disabled={sim.done || sim.still || sim.broken || !doc.bodies.length}>
							<StepForward className="size-4" aria-hidden="true" />
						</IconButton>
						<button type="button" onClick={() => setSpeed((x) => (x + 1) % SPEEDS.length)} aria-label={`Velocità del tempo: ${SPEEDS[speed].say}. Clicca per cambiarla`} title="Velocità del tempo" className="h-9 min-w-11 rounded-lg px-2 text-sm font-semibold tabular-nums text-fg-muted hover:bg-surface-3 hover:text-fg focus-ring">
							{SPEEDS[speed].label}
						</button>
						<label className="flex min-w-40 flex-1 items-center gap-2 text-sm text-fg-muted">
							Tempo
							<input type="range" className="slider w-full" style={{ '--fill': `${(sim.state.t / length) * 100}%` } as CSSProperties} min={0} max={length} step={0.01} value={sim.state.t} disabled={(sim.still && sim.frames.length === 1) || sim.broken || !doc.bodies.length} onChange={(ev) => sim.seekTime(Number(ev.target.value))} aria-valuetext={`${num(sim.state.t, 2)} secondi su ${num(length, 2)}`} />
							<span className="shrink-0 text-right tabular-nums">
								{num(sim.state.t, 2)} / {num(length, 2)} s
							</span>
						</label>
					</div>
				</div>

				<div className={cn('relative border-edge max-lg:border-t lg:order-1 lg:w-80 lg:shrink-0 lg:border-r', full && 'max-lg:max-h-[42%] max-lg:overflow-y-auto')}>
					<div className="lg:absolute lg:inset-0 lg:overflow-y-auto">
						<Card title="Pezzi">
							<div className="grid grid-cols-2 gap-1.5">
								{library}
							</div>
						</Card>
						{!sel && (
							<Card title="Nessun pezzo scelto">
								<p className="m-0 text-sm text-fg-muted">Clicca un pezzo della scena per cambiarne i valori o toglierlo. Per una corda scegli Corda nella libreria, poi clicca i due punti da collegare.</p>
							</Card>
						)}
						{body && (
							<Card title={`${body.shape === 'ball' ? 'Sfera' : 'Massa'} ${body.name ?? ''}`} action={<Remove onClick={drop} />}>
								<Knob label="Massa" name="Massa" unit="kg" value={body.m} min={0.1} max={10} step={0.1} onChange={(x) => commit({ ...doc, bodies: doc.bodies.map((b) => (b.id === body.id ? { ...b, m: x } : b)) }, `m-${body.id}`)} />
								<Knob label={<>Velocità iniziale <Tex>{'v_x'}</Tex></>} name="Velocità iniziale orizzontale" unit="m/s" value={body.vel?.x ?? 0} min={-6} max={6} step={0.1} onChange={(x) => commit({ ...doc, bodies: doc.bodies.map((b) => (b.id === body.id ? { ...b, vel: { x, y: b.vel?.y ?? 0 } } : b)) }, `vx-${body.id}`)} />
								<Knob label={<>Velocità iniziale <Tex>{'v_y'}</Tex></>} name="Velocità iniziale verticale" unit="m/s" value={body.vel?.y ?? 0} min={-6} max={6} step={0.1} onChange={(x) => commit({ ...doc, bodies: doc.bodies.map((b) => (b.id === body.id ? { ...b, vel: { x: b.vel?.x ?? 0, y: x } } : b)) }, `vy-${body.id}`)} />
								<ToggleGroup label="Forma" compact value={body.shape === 'ball' ? 'ball' : 'block'} onChange={(shape) => commit({ ...doc, bodies: doc.bodies.map((b) => (b.id === body.id ? { ...b, shape } : b)) })} options={[{ value: 'block', label: 'Blocco' }, { value: 'ball', label: 'Sfera' }]} />
							</Card>
						)}
						{surface && (
							<Card title={SURFACE_NAME[surface.kind ?? 'incline']} action={<Remove onClick={drop} />}>
								{surface.kind === 'incline' ? (
									<>
										<Knob label="Inclinazione" name="Inclinazione" unit="°" value={Math.round((Math.atan2(Math.abs(surface.b.y - surface.a.y), Math.abs(surface.b.x - surface.a.x)) * 180) / Math.PI)} min={5} max={75} step={1} onChange={(x) => commit(setIncline(doc, surface.id, x, Math.hypot(surface.b.x - surface.a.x, surface.b.y - surface.a.y)), `ang-${surface.id}`)} />
										<Knob label="Lunghezza" name="Lunghezza" unit="m" value={Math.round(Math.hypot(surface.b.x - surface.a.x, surface.b.y - surface.a.y) * 10) / 10} min={0.5} max={5} step={0.1} onChange={(x) => commit(setIncline(doc, surface.id, (Math.atan2(Math.abs(surface.b.y - surface.a.y), Math.abs(surface.b.x - surface.a.x)) * 180) / Math.PI, x), `len-${surface.id}`)} />
									</>
								) : (
									<>
										<ToggleGroup label="Estensione" compact value={surface.endless ? 'endless' : 'finite'} onChange={(x) => commit(setEndless(doc, surface.id, x === 'endless'))} options={[{ value: 'endless', label: 'Senza fine' }, { value: 'finite', label: 'Limitata' }]} />
										{!surface.endless && <Knob label="Lunghezza" name="Lunghezza" unit="m" value={Math.round(Math.hypot(surface.b.x - surface.a.x, surface.b.y - surface.a.y) * 10) / 10} min={0.3} max={7} step={0.1} onChange={(x) => commit(setLength(doc, surface.id, x), `len-${surface.id}`)} />}
									</>
								)}
								<Knob label={<>Attrito statico <Tex>{'\\mu_s'}</Tex></>} name="Attrito statico" value={surface.muS ?? surface.muK ?? 0} min={0} max={1} step={0.05} onChange={(x) => commit({ ...doc, surfaces: doc.surfaces.map((s) => (s.id === surface.id ? { ...s, muS: x, muK: Math.min(s.muK ?? 0, x) } : s)) }, `mus-${surface.id}`)} />
								<Knob label={<>Attrito dinamico <Tex>{'\\mu_d'}</Tex></>} name="Attrito dinamico" value={surface.muK ?? 0} min={0} max={1} step={0.05} onChange={(x) => commit({ ...doc, surfaces: doc.surfaces.map((s) => (s.id === surface.id ? { ...s, muK: x, muS: Math.max(s.muS ?? 0, x) } : s)) }, `muk-${surface.id}`)} />
								{surface.kind === 'wall' && <Button variant="secondary" size="sm" onClick={() => commit(flip(doc, surface.id))}>Gira la parete</Button>}
							</Card>
						)}
						{rope && (
							<Card title="Corda" action={<Remove onClick={drop} />}>
								<p className="m-0 text-sm text-fg-muted">Collega {endName(rope.from)} e {endName(rope.to)}. È ideale: non si allunga e non pesa.</p>
								{doc.pulleys.length > 0 && (
									<label className="flex flex-col gap-1 text-sm text-fg-muted">
										Passa per
										<Select value={rope.via?.pulley ?? ''} onChange={(ev) => commit(rewrap({ ...doc, ropes: doc.ropes.map((r) => (r.id === rope.id ? { ...r, via: ev.target.value ? { pulley: ev.target.value, wrap: 'cw' as const } : undefined } : r)) }))}>
											<option value="">nessuna carrucola</option>
											{doc.pulleys.map((c, i) => <option key={c.id} value={c.id}>{`la carrucola ${i + 1}`}</option>)}
										</Select>
									</label>
								)}
							</Card>
						)}
						{pulley && (
							<Card title="Carrucola" action={<Remove onClick={drop} />}>
								<Knob label="Raggio" name="Raggio" unit="m" value={pulley.r} min={0.08} max={0.3} step={0.01} onChange={(x) => commit(rewrap({ ...doc, pulleys: doc.pulleys.map((c) => (c.id === pulley.id ? { ...c, r: x } : c)) }), `r-${pulley.id}`)} />
								<p className="m-0 text-sm text-fg-muted">È fissa e ideale: non pesa e gira senza attrito.</p>
							</Card>
						)}

						{body && bi >= 0 && (
							<>
								<Card title={`Forze su ${body.name ?? 'il corpo'}`}>
									<label className="flex cursor-pointer items-center gap-2 text-sm text-fg">
										<input type="checkbox" className="size-4 accent-[var(--accent)]" checked={split} onChange={(ev) => setSplit(ev.target.checked)} />
										Componenti lungo x e y
									</label>
									<BodyPanel scene={doc} state={read} body={bi} components={split} />
								</Card>
								<Card title="Grafico" action={<Select aria-label="Grandezza del grafico" className="!w-44 py-1 text-sm" value={chart} onChange={(ev) => setChart(ev.target.value as Quantity)}>{Object.entries(QUANTITIES).map(([id, x]) => <option key={id} value={id}>{x.name}</option>)}</Select>}>
									<div className="flex justify-center">
										<LiveChart w={5} h={2.8} ahead={aheadPoints} points={lived} at={lived.length - 1} name={QUANTITIES[chart].name} unit={QUANTITIES[chart].unit} label={`${QUANTITIES[chart].name} di ${body.name ?? 'il corpo'} in funzione del tempo`} />
									</div>
								</Card>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function Remove({ onClick }: { onClick: () => void }) {
	return (
		<IconButton label="Togli questo pezzo" text="Togli" onClick={onClick}>
			<Trash2 className="size-4" aria-hidden="true" />
		</IconButton>
	);
}
