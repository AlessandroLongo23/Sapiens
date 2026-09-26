import type { CSSProperties, ReactNode } from 'react';

/*
 * The line drawings on the covers of the library: one figure per subject, drawn in
 * chalk on the textbook cover.
 * Each figure is the finished drawing; the strokes marked `cover-ink` are the last
 * ones the pen adds, drawn when the cover is hovered (see globals.css).
 * Every figure lives in a 160 × 120 box.
 */

type Vars = CSSProperties & Record<`--${string}`, string>;
const after = (s: number): Vars => ({ '--d': `${s}s` });

const f = (n: number) => n.toFixed(1);

/** A straight arrow from (x1, y1) to (x2, y2) in one path, head included. */
function arrow(x1: number, y1: number, x2: number, y2: number, head = 5) {
	const a = Math.atan2(y2 - y1, x2 - x1);
	const h = (s: number) => `${f(x2 - head * Math.cos(a + s))} ${f(y2 - head * Math.sin(a + s))}`;
	return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}M${h(0.5)}L${f(x2)} ${f(y2)}L${h(-0.5)}`;
}

/** y = fn(x) sampled from a to b, as a path. */
function plot(fn: (x: number) => number, a: number, b: number, n = 48) {
	let d = '';
	for (let i = 0; i <= n; i++) {
		const x = a + ((b - a) * i) / n;
		d += `${i ? 'L' : 'M'}${f(x)} ${f(fn(x))}`;
	}
	return d;
}

/** A stroke the pen adds on hover, `delay` seconds after the first. */
function Ink({ d, delay = 0, width }: { d: string; delay?: number; width?: number }) {
	return <path d={d} className="cover-ink" pathLength={1} style={after(delay)} strokeWidth={width} />;
}

// Middle school, maths: the theorem of Pythagoras on the 3-4-5 triangle, the square on the hypotenuse added last.
const pythagoras = (
	<>
		<path d="M50 74H82V106H50ZM50 50H26V74H50" />
		<path d="M50 74L82 74L50 50Z" strokeWidth={2} />
		<path d="M50 68H56V74" />
		<Ink d="M82 74L50 50L74 18L106 42Z" />
		<Ink d="M62 45l20 15M70 36l20 15" delay={0.35} width={1} />
	</>
);

// Middle school, science: a leaf and the magnifying glass that looks at its veins.
const leaf = (
	<>
		<path d="M24 100C22 62 50 30 104 22C104 70 76 98 24 100Z" strokeWidth={2} />
		<path d="M24 100Q62 64 104 22M48 76L44 58M48 76L66 78M64 60L62 42M64 60L82 60M80 44L80 32M80 44L92 44" />
		<Ink d="M92 56m-17 0a17 17 0 1 0 34 0a17 17 0 1 0 -34 0" />
		<Ink d="M104 68L128 94" delay={0.35} width={4} />
	</>
);

// Middle school, technology: a block and its front view, the projection lines drawn last.
const projection = (
	<>
		<path d="M22 56H62V96H22ZM22 56L40 40H80L62 56M80 40V80L62 96" strokeWidth={2} />
		<path d="M110 56H150V96H110Z" />
		<Ink d="M62 56H110M62 96H110" />
		<Ink d="M130 30V50" delay={0.3} />
	</>
);

// High school, maths: a parabola and its tangent at a point.
const parabola = (
	<>
		<path d="M12 70H150M30 112V8" />
		<path d="M146 70l-5 -3M146 70l-5 3M30 10l-3 5M30 10l3 5" />
		<path d="M35 20Q85 150 135 20" strokeWidth={2} />
		<Ink d="M84 102L136 35" />
		<circle cx={110} cy={69} r={3} className="cover-dot" fill="currentColor" stroke="none" />
	</>
);

// High school, physics: a pendulum, which swings while the cover is hovered.
const pendulum = (
	<>
		<path d="M50 14H110" strokeWidth={2} />
		<path d="M56 14l-6 -6M68 14l-6 -6M80 14l-6 -6M92 14l-6 -6M104 14l-6 -6" />
		<Ink d="M40 84A82 82 0 0 0 120 84" />
		<g className="cover-swing">
			<path d="M80 14V88" />
			<circle cx={80} cy={95} r={7} strokeWidth={2} />
		</g>
	</>
);

// High school, computer science: a flowchart, its arrows drawn last.
const flowchart = (
	<>
		<ellipse cx={70} cy={14} rx={24} ry={8} strokeWidth={2} />
		<path d="M70 38L90 52L70 66L50 52Z" strokeWidth={2} />
		<path d="M108 44H150V60H108ZM48 84H92V100H48Z" strokeWidth={2} />
		<Ink d={arrow(70, 22, 70, 37)} />
		<Ink d={arrow(90, 52, 107, 52)} delay={0.2} />
		<Ink d={arrow(70, 66, 70, 83)} delay={0.35} />
		<Ink d={`M129 60V112H24V52H${49}`} delay={0.5} width={1.2} />
	</>
);

// High school, chemistry: benzene with a side chain, the ring of delocalised electrons drawn last.
const benzene = (
	<>
		<path d="M64 30L90 45V75L64 90L38 75V45Z" strokeWidth={2} />
		<path d="M90 45L116 30L142 45M116 30V10" />
		<path d="M142 45L142 64" />
		<Ink d="M64 60m-16 0a16 16 0 1 0 32 0a16 16 0 1 0 -32 0" />
	</>
);

// University, Analisi I: a curve and the rectangles of a Riemann sum under it.
const riemannCurve = (x: number) => 70 - 34 * Math.sin((x - 20) / 38);
const riemann = (
	<>
		<path d="M16 100H150M26 112V8" />
		<path d={plot(riemannCurve, 26, 148)} strokeWidth={2} />
		{[40, 60, 80, 100, 120].map((x, i) => (
			<Ink key={x} d={`M${x} 100V${f(riemannCurve(x))}H${x + 20}V100`} delay={i * 0.12} width={1.2} />
		))}
	</>
);

// University, Analisi II: sin x and its Taylor polynomials, which get closer one after another.
const tx = (x: number) => (x - 80) / 24; // x in the box to x on the plot
const ty = (y: number) => 60 - y * 30;
const taylor = (
	<>
		<path d="M10 60H150M80 112V8" />
		<path d={plot((x) => ty(Math.sin(tx(x))), 10, 150)} strokeWidth={2} />
		<Ink d={plot((x) => ty(tx(x)), 52, 108, 2)} width={1.2} />
		<Ink d={plot((x) => ty(tx(x) - tx(x) ** 3 / 6), 30, 130)} delay={0.3} width={1.2} />
		<Ink d={plot((x) => ty(tx(x) - tx(x) ** 3 / 6 + tx(x) ** 5 / 120), 16, 144)} delay={0.6} width={1.2} />
	</>
);

// University, Fisica I: a block on an inclined plane and the forces on it.
const incline = (() => {
	const [x0, y0, x1, y1] = [14, 104, 146, 44];
	const len = Math.hypot(x1 - x0, y1 - y0);
	const [dx, dy] = [(x1 - x0) / len, (y1 - y0) / len]; // up the slope
	const [nx, ny] = [dy, -dx]; // away from the slope
	const s = 72;
	const [bx, by] = [x0 + dx * s, y0 + dy * s];
	const c = (a: number, b: number) => `${f(bx + dx * a + nx * b)} ${f(by + dy * a + ny * b)}`;
	const [cx, cy] = [bx + nx * 11, by + ny * 11];
	return (
		<>
			<path d={`M${x0} ${y0}H${x1}V${y1}Z`} strokeWidth={2} />
			<path d={`M${c(-11, 0)}L${c(11, 0)}L${c(11, 22)}L${c(-11, 22)}Z`} strokeWidth={2} />
			<Ink d={arrow(cx, cy, cx, cy + 34)} />
			<Ink d={arrow(cx, cy, cx + nx * 28, cy + ny * 28)} delay={0.2} />
			<Ink d={arrow(cx - dx * 11, cy - dy * 11, cx - dx * 36, cy - dy * 36)} delay={0.4} />
		</>
	);
})();

// University, Fisica II: the field of two opposite charges, its direction drawn last.
const field = (
	<>
		<circle cx={46} cy={60} r={8} strokeWidth={2} />
		<circle cx={114} cy={60} r={8} strokeWidth={2} />
		<path d="M42 60h8M46 56v8M110 60h8" />
		<path d="M54 60H106" />
		{[18, 36, 56].map((k, i) => (
			<path key={k} d={`M52 ${60 - k * 0.12}Q80 ${60 - k * 1.4} 108 ${60 - k * 0.12}M52 ${60 + k * 0.12}Q80 ${60 + k * 1.4} 108 ${60 + k * 0.12}`} strokeWidth={1.1} opacity={1 - i * 0.2} />
		))}
		{/* The arrows along the lines, from + to −. */}
		<Ink d="M77 56l4 4l-4 4" />
		{[18, 36, 56].map((k, i) => (
			<Ink key={k} d={`M77 ${f(60 - k * 0.76 - 4)}l4 4l-4 4M77 ${f(60 + k * 0.76 - 4)}l4 4l-4 4`} delay={0.12 * (i + 1)} />
		))}
	</>
);

// University, Fondamenti di informatica: an AND gate into a NOT gate, the wires drawn last.
const gates = (
	<>
		<path d="M36 38H58A22 22 0 0 1 58 82H36Z" strokeWidth={2} />
		<path d="M98 46L122 60L98 74Z" strokeWidth={2} />
		<circle cx={126} cy={60} r={3.5} />
		<Ink d="M12 48H36M12 72H36" />
		<Ink d="M80 60H98" delay={0.25} />
		<Ink d="M130 60H152" delay={0.4} />
	</>
);

const SUBJECT_FIGURES: Record<string, ReactNode> = {
	'middle_school/math': pythagoras,
	'middle_school/science': leaf,
	'middle_school/technology': projection,
	'high_school/math': parabola,
	'high_school/physics': pendulum,
	'high_school/computer-science': flowchart,
	'high_school/chemistry': benzene,
	'university/analisi-1': riemann,
	'university/analisi-2': taylor,
	'university/fisica-1': incline,
	'university/fisica-2': field,
	'university/fondamenti-informatica': gates
};

/** The chalk figure on a subject's cover, keyed by `level/subject`; nothing for a subject without one. */
export function SubjectFigure({ id, className }: { id: string; className?: string }) {
	const figure = SUBJECT_FIGURES[id];
	if (!figure) return null;
	return (
		<svg viewBox="0 0 160 120" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			{figure}
		</svg>
	);
}

