'use client';

import { useMemo } from 'react';
import { regressione, type ScatterData } from '@/lib/tools/regressione';
import { Examples, ToolField, ToolSheet, toolInputClass, useToolState } from './ToolSheet';
import { tick, ticks } from './QuartiliTool';

/** Hours of study and the grade of five tests: a strong positive correlation, a line with decimals. */
const DEFAULTS = { x: '1 2 3 4 5', y: '5 5,5 6,5 7 8,5' };

const EXAMPLES = [
	{ x: '1 2 3', y: '2 4 6' },
	{ x: '10 20 30 40 50', y: '52 48 41 37 30' },
	{ x: '1 2 4 5', y: '3 1 2 5' },
	{ x: '150 160 170 180', y: '48 55 63 70' }
];

const W = 320;
const H = 240;
const PL = 40;
const PR = 12;
const PT = 12;
const PB = 30;
const fmt = (n: number) => Math.round(n * 10) / 10;

/** The range of some values with a margin; at least a unit wide, so equal values still get room. */
function range(vs: number[]): [number, number] {
	const lo = Math.min(...vs);
	const hi = Math.max(...vs);
	const span = hi - lo || Math.max(Math.abs(hi), 1);
	return [lo - span * 0.12, hi + span * 0.12];
}

/** The part of y = mx + q inside the box [x0, x1] × [y0, y1], or null when it misses it. */
function clipLine(m: number, q: number, x0: number, x1: number, y0: number, y1: number): [[number, number], [number, number]] | null {
	let [a, b] = [x0, x1];
	if (m !== 0) {
		// Where the line crosses the bottom and the top of the box.
		const [c, d] = [(y0 - q) / m, (y1 - q) / m].sort((u, v) => u - v);
		[a, b] = [Math.max(a, c), Math.min(b, d)];
	} else if (q < y0 || q > y1) return null;
	return a < b ? [[a, m * a + q], [b, m * b + q]] : null;
}

/**
 * The scatter plot of the pairs and the regression line, as in the lessons: a frame with round numbers on two sides
 * (the axes follow the data, so they need not cross at the origin), the points in ink, the line in the accent colour.
 */
export function ScatterPlot({ plot }: { plot: ScatterData }) {
	const xs = plot.points.map((p) => p[0]);
	const [x0, x1] = range(xs);
	// The points, and the line where the data are, stay in view.
	const [y0, y1] = range([...plot.points.map((p) => p[1]), ...[Math.min(...xs), Math.max(...xs)].map((x) => plot.m * x + plot.q)]);
	const X = (x: number) => fmt(PL + ((x - x0) / (x1 - x0)) * (W - PL - PR));
	const Y = (y: number) => fmt(PT + ((y1 - y) / (y1 - y0)) * (H - PT - PB));
	const gx = ticks(x0, x1, 6);
	const gy = ticks(y0, y1, 5);
	const seg = clipLine(plot.m, plot.q, x0, x1, y0, y1);
	const title = `Grafico a dispersione dei ${plot.points.length} punti con la retta di regressione`;
	return (
		<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<g className="stroke-edge" strokeWidth={1}>
				{gx.map((x) => (
					<line key={`x${x}`} x1={X(x)} y1={PT} x2={X(x)} y2={H - PB} />
				))}
				{gy.map((y) => (
					<line key={`y${y}`} x1={PL} y1={Y(y)} x2={W - PR} y2={Y(y)} />
				))}
			</g>
			<path d={`M${PL},${PT} V${H - PB} H${W - PR}`} fill="none" className="stroke-fg-muted" strokeWidth={1.3} />
			{gx.map((x) => (
				<text key={`tx${x}`} x={X(x)} y={H - PB + 16} textAnchor="middle" fontSize={11} className="fill-fg-subtle">
					{tick(x)}
				</text>
			))}
			{gy.map((y) => (
				<text key={`ty${y}`} x={PL - 6} y={Y(y) + 4} textAnchor="end" fontSize={11} className="fill-fg-subtle">
					{tick(y)}
				</text>
			))}
			<text x={W - PR} y={H - PB - 6} textAnchor="end" fontSize={13} className="fill-fg-muted italic">
				x
			</text>
			<text x={PL + 6} y={PT + 12} fontSize={13} className="fill-fg-muted italic">
				y
			</text>
			{seg && <line x1={X(seg[0][0])} y1={Y(seg[0][1])} x2={X(seg[1][0])} y2={Y(seg[1][1])} className="stroke-accent" strokeWidth={2} />}
			{plot.points.map(([x, y], i) => (
				<circle key={i} cx={X(x)} cy={Y(y)} r={3.8} className="fill-fg stroke-surface" strokeWidth={1.5} />
			))}
		</svg>
	);
}

export function RegressioneTool() {
	const [state, set] = useToolState(DEFAULTS);
	const { outcome, plot } = useMemo(() => regressione(state.x, state.y), [state.x, state.y]);
	return (
		<ToolSheet
			outcome={outcome}
			inputs={
				<>
					<ToolField label="Valori di x">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.x} onChange={(e) => set({ x: e.target.value })} />
					</ToolField>
					<ToolField label="Valori di y" hint="Una y per ogni x, nello stesso ordine: da 2 a 50 coppie. Per i decimali usa la virgola: 5,5.">
						<input className={toolInputClass} inputMode="decimal" autoComplete="off" spellCheck={false} value={state.y} onChange={(e) => set({ y: e.target.value })} />
					</ToolField>
					{plot && <ScatterPlot plot={plot} />}
					<Examples items={EXAMPLES.map((p) => ({ label: `${p.x} | ${p.y}`, apply: () => set(p) }))} />
				</>
			}
		/>
	);
}
