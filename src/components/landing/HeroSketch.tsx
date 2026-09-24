'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { INK } from './hero-ink';

/*
 * The home page sketch: a sheet of squared paper on which the pen draws a curve,
 * writes its working and the red pen corrects it. The squares are the plot's
 * units. Three subjects share one idea, the tangent: slope in maths, velocity in
 * physics, reaction rate in chemistry. The point on the curve follows the pointer.
 *
 * The markup is the finished drawing; CSS writes it stroke by stroke when motion
 * is allowed, so the first scene draws before hydration and without JS. The
 * client adds the moving point, the scene loop and the tabs.
 */

const S = 22; // one square, in viewBox units
const W = 24 * S;
const H = 16 * S;
const PEN = 560; // handwriting speed, units per second
const LIFT = 0.03; // pause between two strokes, seconds

// The sheet stays light in the dark theme, so its colours are fixed, not tokens.
const INK_COLOR = 'oklch(0.3 0.05 262)';
const RED = 'oklch(0.56 0.22 22)';
const FAINT = 'oklch(0.55 0.02 262)';
const PAPER = 'oklch(0.99 0.004 85)';
const GRID = 'color-mix(in oklab, oklch(0.62 0.09 245) 18%, transparent)';

interface Plot {
	ox: number;
	oy: number;
	sx: number;
	sy: number;
	f: (x: number) => number;
	df: (x: number) => number;
	from: number;
	to: number;
}
const px = (p: Plot, x: number) => p.ox + x * p.sx;
const py = (p: Plot, y: number) => p.oy - y * p.sy;
function curve(p: Plot, a: number, b: number, n = 64) {
	let d = '';
	for (let i = 0; i <= n; i++) {
		const x = a + ((b - a) * i) / n;
		d += `${i ? 'L' : 'M'}${px(p, x).toFixed(1)} ${py(p, p.f(x)).toFixed(1)}`;
	}
	return d;
}
/** A straight arrow from (x1, y1) to (x2, y2) in one path, head included. */
function arrow(x1: number, y1: number, x2: number, y2: number, head = 6) {
	const a = Math.atan2(y2 - y1, x2 - x1);
	const h = (s: number) => `${(x2 - head * Math.cos(a + s)).toFixed(1)} ${(y2 - head * Math.sin(a + s)).toFixed(1)}`;
	return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}M${h(0.45)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${h(-0.45)}`;
}
/** A red-pen loop around (x, y): a little more than one turn, never quite closed. */
function loop(x: number, y: number, rx: number, ry = rx) {
	let d = '';
	for (let i = 0; i <= 28; i++) {
		const a = -2.2 + (i / 28) * 2 * Math.PI * 1.12;
		const k = 1 + 0.07 * Math.sin(i * 0.9);
		d += `${i ? 'L' : 'M'}${(x + rx * k * Math.cos(a)).toFixed(1)} ${(y + ry * k * Math.sin(a)).toFixed(1)}`;
	}
	return d;
}
const tick = (x: number, y: number) => <path key={`t${x}`} d={`M${x} ${y - 3}V${y + 3}`} />;
const vtick = (x: number, y: number) => <path key={`v${y}`} d={`M${x - 3} ${y}H${x + 3}`} />;
const comma = (v: number, digits: number) => v.toFixed(digits).replace('.', ',').replace('-', '–');
const signed = (v: number, digits: number) => (v >= 0.05 ? '+' : '') + comma(Math.abs(v) < 0.05 ? 0 : v, digits);

type Vars = CSSProperties & Record<`--${string}`, string>;
const at = (d: number, t?: number): Vars => ({ '--d': `${d.toFixed(2)}s`, ...(t != null && { '--t': `${t.toFixed(2)}s` }) });

/** How long the pen takes to write formula `id`. */
function inkTime(id: string) {
	return INK[id].s.reduce((sum, [, len]) => sum + len / PEN + LIFT, 0);
}
/** Formula `id` written by the pen from time `t`, baseline-left at (x, y). */
function Ink({ id, x, y, t, color = INK_COLOR, width = 1.5 }: { id: string; x: number; y: number; t: number; color?: string; width?: number }) {
	const strokes = INK[id].s;
	const starts = strokes.map((_, i) => t + strokes.slice(0, i).reduce((sum, [, len]) => sum + len / PEN + LIFT, 0));
	return (
		<g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={width}>
			{strokes.map(([d, len], i) => (
				<path key={i} d={d} pathLength={1} className="sk-draw sk-linear" style={at(starts[i], len / PEN)} />
			))}
		</g>
	);
}
/** A line drawn by the pen from time `t` over `dur` seconds. */
function Stroke({ d, t, dur = 0.5, ...rest }: { d: string; t: number; dur?: number } & React.SVGProps<SVGPathElement>) {
	return <path d={d} pathLength={1} className="sk-draw" style={at(t, dur)} {...rest} />;
}
function Label({ x, y, t, children, anchor = 'middle' }: { x: number; y: number; t: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
	return (
		<text x={x} y={y} textAnchor={anchor} stroke={PAPER} strokeWidth={3} paintOrder="stroke" className="sk-fade" style={at(t)}>
			{children}
		</text>
	);
}
/** The red tick of the corrector. */
function Check({ x, y, t }: { x: number; y: number; t: number }) {
	return <Stroke d={`M${x} ${y}l6 8l14 -22`} t={t} dur={0.35} stroke={RED} strokeWidth={2.4} />;
}
function Caption({ children, color }: { children: string; color: string }) {
	return (
		<text x={S} y={30} fill={color} stroke="none" className="sk-fade font-mono" fontSize={10.5} fontWeight={600} letterSpacing="0.1em" style={at(0)}>
			{children}
		</text>
	);
}

// ---------------------------------------------------------------------------
// The three scenes. Each is the finished drawing with a timeline in `at` delays.

interface Scene {
	key: 'math' | 'physics' | 'chemistry';
	tab: string;
	/** The subject's colour, fixed like the sheet's: captions and tabs. */
	color: string;
	label: string;
	plot: Plot;
	/** Seconds until the drawing is done and the point starts to move. */
	drawn: number;
	readout: (x: number) => string;
	Draw: () => ReactNode;
}

const mathPlot: Plot = { ox: 3 * S + 11, oy: 9 * S, sx: 1.5 * S, sy: S, f: (x) => x * x - 2 * x - 3, df: (x) => 2 * x - 2, from: -1.15, to: 3.15 };
const physPlot: Plot = { ox: 2 * S, oy: 13 * S, sx: 1.5 * S, sy: 1.5 * S, f: (x) => 2 * x - (x * x) / 4, df: (x) => 2 - x / 2, from: 1, to: 7.85 };
const chemPlot: Plot = { ox: 2 * S, oy: 13 * S, sx: 3 * S, sy: 8 * S, f: (x) => 2 ** -x, df: (x) => -Math.LN2 * 2 ** -x, from: 0.3, to: 3.45 };
// Projectile with g = 9.8 m/s²: y = 2x − x²/4 in metres means vx = √(2g), vy(0) = 2vx.
const VX = Math.sqrt(19.6);

/** When each stroke of the math scene starts, in seconds; `end` is when the pen lifts for good. */
const MATH_T = (() => {
	const tEq = 0.15;
	const tAxes = tEq + inkTime('math.eq') * 0.6;
	const tCurve = tAxes + 0.7;
	const tRoots = tCurve + 1.1;
	const tDelta = tRoots + 0.3;
	const tFrac = tDelta + inkTime('math.delta') + 0.1;
	const tX1 = tFrac + inkTime('math.roots') + 0.1;
	const tX2 = tX1 + inkTime('math.x1') + 0.1;
	const tCheck = tX2 + inkTime('math.x2') + 0.15;
	return { tEq, tAxes, tCurve, tRoots, tDelta, tFrac, tX1, tX2, tCheck, end: tCheck + 0.35 };
})();

function MathScene() {
	const { tEq, tAxes, tCurve, tRoots, tDelta, tFrac, tX1, tX2, tCheck } = MATH_T;
	const p = mathPlot;
	const col = 12 * S;
	return (
		<>
			<Caption color="oklch(0.5 0.19 18)">EQUAZIONI DI SECONDO GRADO</Caption>
			<Ink id="math.eq" x={S} y={3 * S + 2} t={tEq} width={1.7} />
			<g stroke={INK_COLOR} strokeWidth={1.2}>
				<Stroke d={arrow(px(p, -2.1), p.oy, px(p, 4.6), p.oy)} t={tAxes} />
				<Stroke d={arrow(p.ox, py(p, -4.8), p.ox, py(p, 5.3))} t={tAxes + 0.15} />
				<g className="sk-fade" style={at(tAxes + 0.4)}>
					{[-1, 1, 2, 3, 4].map((x) => tick(px(p, x), p.oy))}
					{[-4, -2, 2, 4].map((y) => vtick(p.ox, py(p, y)))}
				</g>
			</g>
			<Ink id="math.ax.x" x={px(p, 4.45)} y={p.oy + 20} t={tAxes + 0.45} width={1.3} />
			<Ink id="math.ax.y" x={p.ox + 8} y={py(p, 5.1)} t={tAxes + 0.5} width={1.3} />
			<g fill={FAINT} stroke="none" className="font-mono" fontSize={10}>
				{/* −1 and 3 sit outside their red circles, away from the curve. */}
				{[-1, 1, 2, 3].map((x) => (
					<Label key={x} x={px(p, x) + (x === 1 ? 5 : x === -1 ? -15 : x === 3 ? 15 : 0)} y={p.oy + (x === -1 || x === 3 ? 20 : 15)} t={tAxes + 0.5}>
						{x < 0 ? `–${-x}` : x}
					</Label>
				))}
				{/* −2 would sit under the curve: the tick alone is enough. */}
				{[-4, 2, 4].map((y) => (
					<Label key={y} x={p.ox - 7} y={py(p, y) + 3.5} t={tAxes + 0.5} anchor="end">
						{y < 0 ? `–${-y}` : y}
					</Label>
				))}
				<Label x={px(p, 1) + 8} y={py(p, -4) + 15} t={tCurve + 1} anchor="start">
					V(1; –4)
				</Label>
			</g>
			<Stroke d={curve(p, -1.6, 3.6)} t={tCurve} dur={1.1} stroke={INK_COLOR} strokeWidth={2.2} />
			<circle cx={px(p, 1)} cy={py(p, -4)} r={2.6} fill={INK_COLOR} className="sk-pop" style={at(tCurve + 0.9)} />
			<g stroke={RED} strokeWidth={1.8}>
				<Stroke d={loop(px(p, -1), p.oy, 9)} t={tRoots} dur={0.35} />
				<Stroke d={loop(px(p, 3), p.oy, 9)} t={tRoots + 0.35} dur={0.35} />
			</g>
			<Ink id="math.delta" x={col} y={5 * S} t={tDelta} />
			<Ink id="math.roots" x={col} y={8 * S} t={tFrac} />
			<Ink id="math.x1" x={col} y={11 * S - 2} t={tX1} />
			<Ink id="math.x2" x={col} y={13 * S - 2} t={tX2} />
			<Check x={col + INK['math.x2'].w + 12} y={13 * S - 12} t={tCheck} />
		</>
	);
}

/** When each stroke of the physics scene starts, in seconds; `end` is when the pen lifts for good. */
const PHYS_T = (() => {
	const tEq = 0.15;
	const tAxes = tEq + inkTime('phys.eq') * 0.55;
	const tPath = tAxes + 0.7;
	const tNote = tPath + 1.5;
	const tVy = tNote + inkTime('phys.w1') + inkTime('phys.w2') + 0.15;
	const tCheck = tVy + inkTime('phys.vy') + 0.1;
	return { tEq, tAxes, tPath, tNote, tVy, tCheck, end: tCheck + 0.4 + inkTime('phys.range') };
})();

function PhysicsScene() {
	const { tEq, tAxes, tPath, tNote, tVy, tCheck } = PHYS_T;
	const p = physPlot;
	const col = 15 * S;
	const peak = { x: px(p, 4), y: py(p, 4) };
	return (
		<>
			<Caption color="oklch(0.5 0.15 252)">MOTO PARABOLICO</Caption>
			<Ink id="phys.eq" x={S} y={3 * S + 2} t={tEq} width={1.7} />
			<g stroke={INK_COLOR} strokeWidth={1.2}>
				<Stroke d={arrow(p.ox, p.oy, px(p, 8.9), p.oy)} t={tAxes} />
				<Stroke d={arrow(p.ox, p.oy, p.ox, py(p, 5.2))} t={tAxes + 0.15} />
				<g className="sk-fade" style={at(tAxes + 0.4)}>
					{[2, 4, 6, 8].map((x) => tick(px(p, x), p.oy))}
					{[2, 4].map((y) => vtick(p.ox, py(p, y)))}
				</g>
			</g>
			<Ink id="phys.ax.x" x={px(p, 8.7)} y={p.oy + 20} t={tAxes + 0.45} width={1.3} />
			<Ink id="phys.ax.y" x={p.ox + 8} y={py(p, 5)} t={tAxes + 0.5} width={1.3} />
			<g fill={FAINT} stroke="none" className="font-mono" fontSize={10}>
				{[2, 4, 6, 8].map((x) => (
					<Label key={x} x={px(p, x)} y={p.oy + 15} t={tAxes + 0.5}>
						{`${x} m`}
					</Label>
				))}
				{[2, 4].map((y) => (
					<Label key={y} x={p.ox - 7} y={py(p, y) + 3.5} t={tAxes + 0.5} anchor="end">
						{y}
					</Label>
				))}
			</g>
			<Stroke d={curve(p, 0, 8)} t={tPath} dur={1.3} stroke={INK_COLOR} strokeWidth={1.4} strokeOpacity={0.55} />
			{/* A stroboscopic photo: one ball per equal time step, so equally spaced along x. */}
			{Array.from({ length: 9 }, (_, i) => (
				<circle key={i} cx={px(p, i)} cy={py(p, p.f(i))} r={4.5} fill={PAPER} stroke={INK_COLOR} strokeOpacity={0.45} strokeWidth={1.3} className="sk-pop" style={at(tPath + 0.15 * i)} />
			))}
			<Stroke d={loop(peak.x, peak.y, 11)} t={tVy + 0.2} dur={0.35} stroke={RED} strokeWidth={1.8} />
			<Ink id="phys.w1" x={col} y={6 * S} t={tNote} />
			<Ink id="phys.w2" x={col} y={7.5 * S} t={tNote + inkTime('phys.w1')} />
			<Ink id="phys.vy" x={col} y={10 * S} t={tVy} color={RED} width={1.7} />
			<Check x={col + INK['phys.vy'].w + 12} y={10 * S - 10} t={tCheck} />
			<Ink id="phys.range" x={col} y={11.7 * S} t={tCheck + 0.4} />
		</>
	);
}

/** When each stroke of the chemistry scene starts, in seconds; `end` is when the pen lifts for good. */
const CHEM_T = (() => {
	const tEq = 0.15;
	const tAxes = tEq + inkTime('chem.eq') * 0.6;
	const tCurve = tAxes + 0.7;
	const tGuides = tCurve + 1.1;
	const tHalf = tGuides + 0.5;
	const tNote = tHalf + inkTime('chem.half') + 0.2;
	const tCheck = tNote + inkTime('chem.w1') + inkTime('chem.w2') + 0.15;
	return { tEq, tAxes, tCurve, tGuides, tHalf, tNote, tCheck, end: tCheck + 0.35 };
})();

function ChemistryScene() {
	const { tEq, tAxes, tCurve, tGuides, tHalf, tNote, tCheck } = CHEM_T;
	const p = chemPlot;
	const col = 15 * S;
	const halves = [1, 2, 3];
	const tLabel = ['t½', '2t½', '3t½'];
	const yLabel = ['1/2', '1/4', '1/8'];
	return (
		<>
			<Caption color="oklch(0.48 0.12 158)">CINETICA DEL PRIMO ORDINE</Caption>
			<Ink id="chem.eq" x={S} y={3 * S + 2} t={tEq} width={1.7} />
			<g stroke={INK_COLOR} strokeWidth={1.2}>
				<Stroke d={arrow(p.ox, p.oy, px(p, 3.9), p.oy)} t={tAxes} />
				<Stroke d={arrow(p.ox, p.oy, p.ox, py(p, 1.1))} t={tAxes + 0.15} />
				<g className="sk-fade" style={at(tAxes + 0.4)}>{vtick(p.ox, py(p, 1))}</g>
			</g>
			<Ink id="chem.ax.x" x={px(p, 3.85)} y={p.oy + 20} t={tAxes + 0.45} width={1.3} />
			<Ink id="chem.ax.y" x={p.ox + 9} y={py(p, 1.1) + 5} t={tAxes + 0.5} width={1.3} />
			<Stroke d={curve(p, 0, 3.6)} t={tCurve} dur={1.1} stroke={INK_COLOR} strokeWidth={2.2} />
			{/* Every half-life the concentration halves: the dashed guides land on ½, ¼, ⅛. */}
			<g stroke={FAINT} strokeWidth={1} strokeDasharray="3 4" className="sk-fade" style={at(tGuides)}>
				{halves.map((h) => (
					<path key={h} d={`M${p.ox} ${py(p, p.f(h))}H${px(p, h)}V${p.oy}`} fill="none" />
				))}
			</g>
			<g fill={FAINT} stroke="none" className="font-mono" fontSize={10}>
				<Label x={p.ox - 7} y={py(p, 1) + 3.5} t={tAxes + 0.5} anchor="end">
					1
				</Label>
				{halves.map((h, i) => (
					<g key={h}>
						<Label x={px(p, h)} y={p.oy + 15} t={tGuides + 0.1}>
							{tLabel[i]}
						</Label>
						<Label x={p.ox - 7} y={py(p, p.f(h)) + 3.5} t={tGuides + 0.1} anchor="end">
							{yLabel[i]}
						</Label>
					</g>
				))}
			</g>
			{halves.map((h, i) => (
				<circle key={h} cx={px(p, h)} cy={py(p, p.f(h))} r={3} fill={RED} className="sk-pop" style={at(tGuides + 0.2 + 0.15 * i)} />
			))}
			<Ink id="chem.half" x={col} y={5.5 * S} t={tHalf} />
			<Stroke d={`M${col - 6} ${3.9 * S}h${INK['chem.half'].w + 14}v${3 * S}h${-(INK['chem.half'].w + 14)}z`} t={tHalf + inkTime('chem.half')} dur={0.5} stroke={RED} strokeWidth={1.6} />
			<Ink id="chem.w1" x={col} y={9 * S} t={tNote} />
			<Ink id="chem.w2" x={col} y={10.5 * S} t={tNote + inkTime('chem.w1')} />
			<Check x={col + INK['chem.w2'].w + 12} y={10.5 * S - 10} t={tCheck} />
		</>
	);
}

const SCENES: Scene[] = [
	{
		key: 'math',
		tab: 'Matematica',
		color: 'oklch(0.5 0.19 18)',
		label: 'La parabola y = x² − 2x − 3 disegnata su carta a quadretti, con le soluzioni x = −1 e x = 3 cerchiate in rosso e il calcolo del delta a fianco.',
		plot: mathPlot,
		drawn: MATH_T.end + 0.3,
		readout: (x) => `x = ${comma(x, 2)} · pendenza f′(x) = ${signed(mathPlot.df(x), 2)}`,
		Draw: MathScene
	},
	{
		key: 'physics',
		tab: 'Fisica',
		color: 'oklch(0.5 0.15 252)',
		label: 'La traiettoria parabolica di un proiettile come in una foto stroboscopica, con la velocità nel punto più alto, dove la componente verticale vale zero.',
		plot: physPlot,
		drawn: PHYS_T.end + 0.3,
		readout: (x) => `vx = ${comma(VX, 1)} m/s · vy = ${signed(VX * physPlot.df(x), 1)} m/s`,
		Draw: PhysicsScene
	},
	{
		key: 'chemistry',
		tab: 'Chimica',
		color: 'oklch(0.48 0.12 158)',
		label: 'La concentrazione di un reagente che si dimezza a ogni tempo di dimezzamento, con la formula t½ = ln 2 / k riquadrata in rosso.',
		plot: chemPlot,
		drawn: CHEM_T.end + 0.3,
		readout: (x) => `t = ${comma(x, 2)} t½ · [A] = ${comma(chemPlot.f(x) * 100, 0)}% · velocità = ${comma(-chemPlot.df(x), 2)} [A]₀/t½`,
		Draw: ChemistryScene
	}
];

const SWEEP = 4.6; // seconds the point takes to cross the curve
const HOLD = 0.9; // pause on the finished scene before the next

// ---------------------------------------------------------------------------

export function HeroSketch({ className }: { className?: string }) {
	const uid = useId();
	const [index, setIndex] = useState(0);
	const [checked, setChecked] = useState<boolean[]>([false, false, false]);
	// The scene that is fading out; compared with `index`, so a new scene starts visible.
	const [leavingIndex, setLeavingIndex] = useState(-1);
	const leaving = leavingIndex === index;
	const root = useRef<HTMLDivElement>(null);
	const svg = useRef<SVGSVGElement>(null);
	const probe = useRef<SVGGElement>(null);
	const readout = useRef<SVGTextElement>(null);
	const hint = useRef<SVGTextElement>(null);
	const pointerX = useRef<number | null>(null);
	const scene = SCENES[index];

	/** Puts the moving point at `x` (plot units): the tangent, and for physics the velocity and its components. */
	const place = (x: number | null) => {
		const g = probe.current;
		if (!g) return;
		if (hint.current) hint.current.style.visibility = x == null ? 'visible' : 'hidden';
		if (x == null) {
			g.style.opacity = '0';
			if (readout.current) readout.current.textContent = '';
			return;
		}
		const p = scene.plot;
		const cx = px(p, x);
		const cy = py(p, p.f(x));
		const [dx, dy] = [p.sx, -p.sy * p.df(x)];
		const n = Math.hypot(dx, dy);
		const [ux, uy] = [dx / n, dy / n];
		const set = (sel: string, attrs: Record<string, string | number>) => {
			const el = g.querySelector(sel);
			if (el) for (const k in attrs) el.setAttribute(k, String(attrs[k]));
		};
		g.style.opacity = '1';
		set('[data-dot]', { cx, cy });
		if (scene.key === 'physics') {
			const k = 7.5; // pixels per m/s
			const vy = VX * p.df(x);
			set('[data-tangent]', { d: arrow(cx, cy, cx + k * VX, cy - k * vy, 7) });
			set('[data-vx]', { d: arrow(cx, cy, cx + k * VX, cy, 5) });
			set('[data-vy]', { d: Math.abs(vy) > 0.3 ? arrow(cx, cy, cx, cy - k * vy, 5) : '' });
			set('[data-drop]', { d: '' });
		} else {
			const r = 42;
			set('[data-tangent]', { d: `M${cx - r * ux} ${cy - r * uy}L${cx + r * ux} ${cy + r * uy}` });
			set('[data-vx]', { d: '' });
			set('[data-vy]', { d: '' });
			set('[data-drop]', { d: `M${cx} ${cy}V${p.oy}` });
		}
		if (readout.current) readout.current.textContent = scene.readout(x);
	};

	// The clock: draws, sweeps the point across the curve, moves to the next subject.
	// It stops while the sheet is off screen, while the pointer is on it and when
	// the tab is hidden; with reduced motion it never runs and the point follows only the pointer.
	useEffect(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		place(null);
		const tickOff = () => setChecked((c) => (c[index] ? c : c.map((v, i) => v || i === index)));
		if (reduce) return tickOff();
		let visible = true;
		let elapsed = 0;
		let last = performance.now();
		let frame = 0;
		const end = scene.drawn + SWEEP + HOLD;
		const tick = (now: number) => {
			const dt = Math.min(0.1, (now - last) / 1000);
			last = now;
			if (pointerX.current == null) {
				elapsed += dt;
				const s = (elapsed - scene.drawn) / SWEEP;
				if (s >= 0 && s <= 1) place(scene.plot.from + (scene.plot.to - scene.plot.from) * (0.5 - 0.5 * Math.cos(Math.PI * s)));
				else if (s > 1) place(null);
			}
			// The red tick is the last stroke of the drawing: the card ticks the subject off with it.
			if (elapsed >= scene.drawn - 0.2) tickOff();
			if (elapsed >= end - 0.5) setLeavingIndex(index);
			if (elapsed >= end) {
				setIndex((i) => (i + 1) % SCENES.length);
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		const run = () => {
			cancelAnimationFrame(frame);
			if (!visible || document.hidden) return root.current?.setAttribute('data-paused', '');
			root.current?.removeAttribute('data-paused');
			last = performance.now();
			frame = requestAnimationFrame(tick);
		};
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			run();
		});
		if (root.current) io.observe(root.current);
		document.addEventListener('visibilitychange', run);
		run();
		return () => {
			cancelAnimationFrame(frame);
			io.disconnect();
			document.removeEventListener('visibilitychange', run);
		};
		// `place` reads the current scene; the effect restarts with it.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index]);

	const choose = (i: number) => {
		pointerX.current = null;
		if (i === 0) setChecked([false, false, false]);
		setIndex(i);
		setLeavingIndex(-1);
	};

	const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
		const m = svg.current?.getScreenCTM();
		if (!m) return;
		const x = (e.clientX - m.e) / m.a;
		const p = scene.plot;
		const v = Math.min(p.to, Math.max(p.from, (x - p.ox) / p.sx));
		pointerX.current = v;
		place(v);
	};
	const onLeave = () => {
		pointerX.current = null;
		place(null);
	};

	const Draw = scene.Draw;
	return (
		<div ref={root} className={cn('relative pb-8 pt-9', className)}>
			{/* Tabs, sheet, tape and card are one object at a slight angle; the sheet dims a little in the dark theme, as paper under a lamp. */}
			<div className="relative rotate-[1.5deg] dark:brightness-[0.9]">
				{/* Dividers of a ring binder, one per subject, in the subject's colour, standing on the sheet's top edge. */}
				<div className="absolute bottom-full left-6 flex items-end gap-1.5" role="group" aria-label="Materia dello schizzo">
					{SCENES.map((s, i) => (
						<button
							key={s.key}
							type="button"
							aria-pressed={i === index}
							onClick={() => choose(i)}
							style={i === index ? { backgroundColor: s.color, color: 'oklch(0.99 0.004 85)' } : { color: s.color }}
							className={cn(
								'focus-ring label-mono rounded-t-lg px-3.5 transition-[height,background-color,color] duration-300',
								i === index ? 'h-9' : 'h-7 border border-b-0 border-[oklch(0.86_0.012_85)] bg-[oklch(0.95_0.012_85)] hover:h-8'
							)}
						>
							{s.tab}
						</button>
					))}
				</div>
				<figure className="relative overflow-hidden rounded-2xl border border-edge bg-paper-50 shadow-lift">
					<svg
						ref={svg}
						viewBox={`0 0 ${W} ${H}`}
						className="sk-sheet block h-auto w-full cursor-crosshair touch-pan-y select-none"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						role="img"
						aria-label={scene.label}
						onPointerMove={onPointer}
						onPointerDown={onPointer}
						onPointerLeave={onLeave}
					>
						<defs>
							<pattern id={`${uid}grid`} width={S} height={S} patternUnits="userSpaceOnUse">
								<path d={`M${S} 0H0V${S}`} stroke={GRID} strokeWidth={1} />
							</pattern>
						</defs>
						<rect width={W} height={H} fill={`url(#${uid}grid)`} />
						<g key={index} className={cn('transition-opacity duration-500', leaving && 'opacity-0')}>
							<Draw />
						</g>
						<g ref={probe} style={{ opacity: 0 }} className="transition-opacity duration-300">
							<path data-drop="" stroke={FAINT} strokeWidth={1} strokeDasharray="2 4" />
							<path data-vx="" stroke={RED} strokeWidth={1.4} strokeOpacity={0.7} />
							<path data-vy="" stroke={RED} strokeWidth={1.4} strokeOpacity={0.7} />
							<path data-tangent="" stroke={RED} strokeWidth={1.8} />
							<circle data-dot="" r={4.5} fill={INK_COLOR} stroke="oklch(0.99 0.004 85)" strokeWidth={2} />
						</g>
						<text ref={readout} x={S} y={H - 16} fill={INK_COLOR} fillOpacity={0.8} className="font-mono" fontSize={12} fontWeight={500} />
						<text ref={hint} x={S} y={H - 16} fill={INK_COLOR} fillOpacity={0.7} className="font-mono" fontSize={12}>
							<tspan className="pointer-coarse:hidden">Muovi il puntatore sul grafico</tspan>
							<tspan className="hidden pointer-coarse:inline">Tocca il grafico</tspan>
						</text>
					</svg>
				</figure>
				{/* Paper tape on two corners, the same in both themes: it lies on the sheet. */}
				<span className="pointer-events-none absolute right-0 top-3 h-6 w-20 rotate-[38deg] sm:-right-5 sm:w-24 bg-[oklch(0.9_0.035_80/0.75)] shadow-paper" aria-hidden="true" />
				<span className="pointer-events-none absolute -bottom-2 left-20 h-6 w-24 -rotate-3 bg-[oklch(0.9_0.035_80/0.75)] shadow-paper" aria-hidden="true" />
				<Progress checked={checked} />
			</div>
		</div>
	);
}

/** Today's practice, on an index card slipped under the sheet's corner: one box per subject, ticked in red. */
function Progress({ checked }: { checked: boolean[] }) {
	const done = checked.filter(Boolean).length;
	return (
		<div className="absolute -bottom-9 -right-6 flex rotate-2 items-center gap-3 rounded-lg border border-edge bg-paper-50 px-3.5 py-2.5 shadow-lift" aria-hidden="true">
			<div className="flex gap-1.5">
				{checked.map((c, i) => (
					<svg key={i} viewBox="0 0 20 20" className="size-5" fill="none" strokeLinecap="round" strokeLinejoin="round">
						<rect x="1.5" y="1.5" width="17" height="17" rx="2" stroke="oklch(0.55 0.02 262)" strokeWidth="1.2" />
						{c && <path d="M5 10.5l3.5 4L16 4" stroke={RED} strokeWidth="2.2" pathLength={1} className="sk-draw" style={at(0, 0.3)} />}
					</svg>
				))}
			</div>
			<div className="leading-tight">
				<p className="label-mono text-[0.625rem] text-ink-500">Esercizi di oggi</p>
				<p className="font-display text-lg font-medium text-ink-900 tabular-nums">{done} di 3</p>
			</div>
		</div>
	);
}
