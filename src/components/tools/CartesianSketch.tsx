import { useId } from 'react';
import type { Plot, PlotLine } from '@/lib/tools/cartesiano';
import { cn } from '@/lib/utils/cn';

/**
 * A small Cartesian plane, drawn like the figures of the lessons: a light grid, the axes with a few numbers, the
 * points with their names, the segment, the line or the parabola the tool found in the accent colour, the others
 * (the given line, the axis of symmetry, the directrix) dashed. The scale follows the data: everything the tool
 * found is in view, and so is the origin. Lines and points use the same unit on both axes, so right angles look
 * right; a parabola may be stretched, as books do.
 */

const W = 320;
const H = 240;
const M = 14;
/** Samples of the parabola across the view. */
const SAMPLES = 160;

type V = [number, number];
const fmt = (n: number) => Math.round(n * 10) / 10;

/** A round step (1, 2 or 5 times a power of ten) that gives about `target` grid lines over `span`. */
function niceStep(span: number, target: number): number {
	const raw = span / target;
	const p = 10 ** Math.floor(Math.log10(raw));
	const k = raw / p;
	return (k <= 1 ? 1 : k <= 2 ? 2 : k <= 5 ? 5 : 10) * p;
}

/** A tick number, Italian style: "0,5", "−2". */
function tick(v: number): string {
	const s = String(Number(v.toPrecision(6))).replace('.', ',');
	return s.startsWith('-') ? `−${s.slice(1)}` : s;
}

/** The part of the line a·x + b·y + c = 0 inside the box, or null (Liang–Barsky on a long segment of it). */
function clipLine(l: PlotLine, [x0, x1, y0, y1]: number[]): [V, V] | null {
	const len = Math.hypot(l.a, l.b);
	if (!len) return null;
	// A point of the line and its direction.
	const p: V = [(-l.a * l.c) / (len * len), (-l.b * l.c) / (len * len)];
	const d: V = [-l.b / len, l.a / len];
	let [t0, t1] = [-1e9, 1e9];
	const edges: [number, number][] = [
		[-d[0], p[0] - x0],
		[d[0], x1 - p[0]],
		[-d[1], p[1] - y0],
		[d[1], y1 - p[1]]
	];
	for (const [pp, qq] of edges) {
		if (pp === 0) {
			if (qq < 0) return null;
			continue;
		}
		const r = qq / pp;
		if (pp < 0) t0 = Math.max(t0, r);
		else t1 = Math.min(t1, r);
	}
	if (t0 >= t1) return null;
	return [
		[p[0] + d[0] * t0, p[1] + d[1] * t0],
		[p[0] + d[0] * t1, p[1] + d[1] * t1]
	];
}

export function CartesianSketch({ plot, title }: { plot: Plot; title: string }) {
	const clipId = useId();
	const xs = [0];
	const ys = [0];
	for (const p of plot.points) {
		xs.push(p.x);
		ys.push(p.y);
	}
	for (const s of plot.segments) {
		xs.push(s.from[0], s.to[0]);
		ys.push(s.from[1], s.to[1]);
	}
	// A given line is in view where it passes closest to the first point (for a perpendicular, where they meet).
	const first = plot.points[0];
	if (first)
		for (const l of plot.lines) {
			const n2 = l.a * l.a + l.b * l.b;
			if (l.main || !n2) continue;
			const k = (l.a * first.x + l.b * first.y + l.c) / n2;
			const foot: V = [first.x - l.a * k, first.y - l.b * k];
			// And a stretch of it on both sides, as long as the distance from the point.
			const reach = Math.abs(k) * Math.sqrt(n2) + 1;
			const d: V = [-l.b / Math.sqrt(n2), l.a / Math.sqrt(n2)];
			for (const t of [-reach, 0, reach]) {
				xs.push(foot[0] + d[0] * t);
				ys.push(foot[1] + d[1] * t);
			}
		}
	const para = plot.parabola;
	const at = (x: number) => (para ? para.a * x * x + para.b * x + para.c : 0);
	if (para) {
		// Wide enough around the vertex to show the curve bend, and every point the tool found.
		const xv = -para.b / (2 * para.a);
		const w = Math.max(...plot.points.map((p) => Math.abs(p.x - xv)), 2 / Math.sqrt(Math.abs(para.a)), 1) * 1.15;
		for (const x of [xv - w, xv + w]) {
			xs.push(x);
			ys.push(at(x));
		}
	}
	let [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	// A margin around the data, and at least a little room when the data sit on a line.
	const pad = (lo: number, hi: number): [number, number] => {
		const span = Math.max(hi - lo, 2);
		const mid = (lo + hi) / 2;
		return [mid - span * 0.56, mid + span * 0.56];
	};
	[x0, x1] = pad(x0, x1);
	[y0, y1] = pad(y0, y1);
	let sx = W / (x1 - x0);
	let sy = H / (y1 - y0);
	if (plot.equal) {
		// One unit on both axes: widen the short side to fill the frame.
		const s = Math.min(sx, sy);
		const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
		[x0, x1] = [cx - W / s / 2, cx + W / s / 2];
		[y0, y1] = [cy - H / s / 2, cy + H / s / 2];
		sx = sy = s;
	}
	const map = (x: number, y: number): V => [M + (x - x0) * sx, M + (y1 - y) * sy];
	const box = [x0, x1, y0, y1];

	const stepX = niceStep(x1 - x0, 10);
	const stepY = plot.equal ? stepX : niceStep(y1 - y0, 8);
	const range = (lo: number, hi: number, step: number) => {
		const out: number[] = [];
		for (let k = Math.ceil(lo / step); k * step <= hi; k++) out.push(k * step);
		return out;
	};
	const gx = range(x0, x1, stepX);
	const gy = range(y0, y1, stepY);
	// Numbers on the axes: about five per axis, never on the origin.
	const every = (n: number) => Math.max(1, Math.ceil(n / 5));
	const [ex, ey] = [every(gx.length), every(gy.length)];
	const [ox, oy] = map(0, 0);

	const parabolaPath = para
		? Array.from({ length: SAMPLES + 1 }, (_, i) => {
				const x = x0 + ((x1 - x0) * i) / SAMPLES;
				const y = Math.max(y0 - (y1 - y0), Math.min(y1 + (y1 - y0), at(x)));
				const [px, py] = map(x, y);
				return `${i ? 'L' : 'M'}${fmt(px)},${fmt(py)}`;
			}).join(' ')
		: null;

	const label = (text: string, x: number, y: number, props: { anchor?: 'start' | 'middle' | 'end'; className?: string; size?: number } = {}) => (
		<text x={fmt(x)} y={fmt(y)} textAnchor={props.anchor ?? 'start'} fontSize={props.size ?? 14} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className={cn('stroke-surface', props.className ?? 'fill-fg')}>
			{text}
		</text>
	);

	return (
		<svg viewBox={`0 0 ${W + 2 * M} ${H + 2 * M}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<defs>
				<clipPath id={clipId}>
					<rect x={M} y={M} width={W} height={H} />
				</clipPath>
			</defs>
			<g className="stroke-edge" strokeWidth={1}>
				{gx.map((x) => {
					const [px] = map(x, 0);
					return <line key={`x${x}`} x1={fmt(px)} y1={M} x2={fmt(px)} y2={M + H} />;
				})}
				{gy.map((y) => {
					const [, py] = map(0, y);
					return <line key={`y${y}`} x1={M} y1={fmt(py)} x2={M + W} y2={fmt(py)} />;
				})}
			</g>
			<g className="stroke-fg-muted" strokeWidth={1.3}>
				<line x1={M} y1={fmt(oy)} x2={M + W} y2={fmt(oy)} />
				<line x1={fmt(ox)} y1={M} x2={fmt(ox)} y2={M + H} />
				<path d={`M${M + W - 7},${fmt(oy - 4)} L${M + W},${fmt(oy)} L${M + W - 7},${fmt(oy + 4)}`} fill="none" />
				<path d={`M${fmt(ox - 4)},${M + 7} L${fmt(ox)},${M} L${fmt(ox + 4)},${M + 7}`} fill="none" />
			</g>
			{label('x', M + W - 4, oy - 8, { anchor: 'end', className: 'fill-fg-muted italic' })}
			{label('y', ox + 8, M + 12, { className: 'fill-fg-muted italic' })}
			<g clipPath={`url(#${clipId})`}>
				{plot.lines.map((l, i) => {
					const seg = clipLine(l, box);
					if (!seg) return null;
					const [p, q] = [map(...seg[0]), map(...seg[1])];
					return <line key={i} x1={fmt(p[0])} y1={fmt(p[1])} x2={fmt(q[0])} y2={fmt(q[1])} className={l.main ? 'stroke-accent' : 'stroke-fg-muted'} strokeWidth={l.main ? 2 : 1.3} strokeDasharray={l.main ? undefined : '6 4'} />;
				})}
				{parabolaPath && <path d={parabolaPath} fill="none" className="stroke-accent" strokeWidth={2} strokeLinejoin="round" />}
				{plot.segments.map((s, i) => {
					const [p, q] = [map(...s.from), map(...s.to)];
					return <line key={i} x1={fmt(p[0])} y1={fmt(p[1])} x2={fmt(q[0])} y2={fmt(q[1])} className={s.main ? 'stroke-accent' : 'stroke-fg-muted'} strokeWidth={s.main ? 2 : 1.2} strokeDasharray={s.main ? undefined : '5 4'} />;
				})}
			</g>
			{gx.map((x) => {
				if (Math.abs(x) < stepX / 2 || Math.round(x / stepX) % ex) return null;
				const [px] = map(x, 0);
				return <g key={`tx${x}`}>{label(tick(x), px, Math.min(oy + 15, M + H - 2), { anchor: 'middle', size: 11, className: 'fill-fg-subtle' })}</g>;
			})}
			{gy.map((y) => {
				if (Math.abs(y) < stepY / 2 || Math.round(y / stepY) % ey) return null;
				const [, py] = map(0, y);
				return <g key={`ty${y}`}>{label(tick(y), Math.max(ox - 5, M + 18), py + 4, { anchor: 'end', size: 11, className: 'fill-fg-subtle' })}</g>;
			})}
			{plot.lines.map((l, i) => {
				if (!l.name) return null;
				const seg = clipLine(l, box);
				if (!seg) return null;
				// Near the end of the visible part, where it is least likely to sit on a point.
				const [p, q] = [map(...seg[0]), map(...seg[1])];
				// The line found at one end, the given ones at the other, so their names never meet.
				const t = l.main ? 0.88 : 0.12;
				const at: V = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
				return <g key={`n${i}`}>{label(l.name, Math.min(at[0] + 7, M + W - 10), Math.max(at[1] - 7, M + 14), { className: cn('italic', l.main ? 'fill-accent font-medium' : 'fill-fg-muted') })}</g>;
			})}
			{plot.points.map((pt, i) => {
				const [px, py] = map(pt.x, pt.y);
				return (
					<g key={`p${i}`}>
						<circle cx={fmt(px)} cy={fmt(py)} r={pt.main ? 4 : 3.5} className={cn('stroke-surface', pt.main ? 'fill-accent' : 'fill-fg')} strokeWidth={1.5} />
						{pt.name &&
							(pt.side === 'left'
								? label(pt.name, Math.max(px - 8, M + 12), py + 5, { anchor: 'end', className: pt.main ? 'fill-accent font-medium' : 'fill-fg' })
								: pt.side === 'right'
									? label(pt.name, Math.min(px + 8, M + W - 8), py + 5, { className: pt.main ? 'fill-accent font-medium' : 'fill-fg' })
									: label(pt.name, Math.min(px + 7, M + W - 8), Math.max(py - 7, M + 12), { className: pt.main ? 'fill-accent font-medium' : 'fill-fg' }))}
					</g>
				);
			})}
		</svg>
	);
}
