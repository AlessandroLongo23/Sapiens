import type { Pt, Sketch } from '@/lib/tools/geometria';
import { cn } from '@/lib/utils/cn';

/**
 * A figure drawn like a sketch on squared paper: thin ink lines in the text color, dashed heights and diagonals,
 * the given measures in the accent color and the ones to find as a bare symbol. Each label has a halo in the paper
 * color, so a line crossing it never hides a digit. Not to scale when the figure is
 * very long and thin: the short side is stretched, as a teacher would draw it on the board.
 */

const W = 300;
const H = 180;
const PX = 64;
const PY = 30;
/** The longest side is at most this many times the shortest, on screen. */
const MAX_RATIO = 3.5;

type V = [number, number];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const len = (a: V) => Math.hypot(a[0], a[1]);
const unit = (a: V): V => {
	const l = len(a) || 1;
	return [a[0] / l, a[1] / l];
};
const fmt = (n: number) => Math.round(n * 10) / 10;

export function FigureSketch({ sketch, title }: { sketch: Sketch; title: string }) {
	const circle = 'circle' in sketch.outline ? sketch.outline.circle : null;
	const outline = Array.isArray(sketch.outline) ? sketch.outline : [];
	const pts: Pt[] = circle !== null ? [[-circle, -circle], [circle, circle]] : [...outline];
	for (const [a, b] of sketch.lines) pts.push(a, b);
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const w = maxX - minX || 1;
	const h = maxY - minY || 1;
	const s = Math.min(W / w, H / h);
	// Stretch the short side of a long, thin figure so it stays readable.
	const sx = Math.min(W / w, Math.max(s, H / MAX_RATIO / w));
	const sy = Math.min(H / h, Math.max(s, W / MAX_RATIO / h));
	const ox = PX + (W - w * sx) / 2;
	const oy = PY + (H - h * sy) / 2;
	const map = (p: Pt): V => [ox + (p[0] - minX) * sx, oy + (maxY - p[1]) * sy];

	const shape = outline.map(map);
	const center: V = circle !== null ? map([0, 0]) : [shape.reduce((t, p) => t + p[0], 0) / shape.length, shape.reduce((t, p) => t + p[1], 0) / shape.length];
	// Below the label of the bottom side, which sits about 22 units under the figure.
	const captionY = PY * 2 + H + 18;
	const height = sketch.caption ? captionY + 8 : PY * 2 + H;

	return (
		<svg viewBox={`0 0 ${W + 2 * PX} ${height}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			{circle !== null ? (
				<>
					<ellipse cx={fmt(center[0])} cy={fmt(center[1])} rx={fmt(circle * sx)} ry={fmt(circle * sy)} className="fill-accent/10 stroke-current" strokeWidth={1.5} />
					<circle cx={fmt(center[0])} cy={fmt(center[1])} r={2.5} className="fill-current" />
				</>
			) : (
				<polygon points={shape.map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(' ')} className="fill-accent/10 stroke-current" strokeWidth={1.5} strokeLinejoin="round" />
			)}
			{sketch.lines.map(([a, b], i) => {
				const [p, q] = [map(a), map(b)];
				return <line key={i} x1={fmt(p[0])} y1={fmt(p[1])} x2={fmt(q[0])} y2={fmt(q[1])} className="stroke-fg-muted" strokeWidth={1.2} strokeDasharray="5 4" />;
			})}
			{sketch.right.map(([corner, a, b], i) => {
				const c = map(corner);
				const u = unit(sub(map(a), c));
				const v = unit(sub(map(b), c));
				const k = 9;
				const d = `M${fmt(c[0] + u[0] * k)},${fmt(c[1] + u[1] * k)} L${fmt(c[0] + (u[0] + v[0]) * k)},${fmt(c[1] + (u[1] + v[1]) * k)} L${fmt(c[0] + v[0] * k)},${fmt(c[1] + v[1] * k)}`;
				return <path key={i} d={d} fill="none" className="stroke-fg-muted" strokeWidth={1} />;
			})}
			{sketch.labels.map((l, i) => {
				const [p, q] = [map(l.from), map(l.to)];
				// A height drawn inside is labelled near its foot, where the figure is wider, not at its middle.
				const t = l.inside ? 0.7 : 0.5;
				const mid: V = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
				const dir = unit(sub(q, p));
				let n: V = [-dir[1], dir[0]];
				const away = sub(mid, center);
				const dot = n[0] * away[0] + n[1] * away[1];
				// Outside the figure (inside for a height); for a segment through the centre (a diagonal, a radius), above it.
				if (Math.abs(dot) < 1e-6 ? n[1] > 0 : dot < 0 !== !!l.inside) n = [-n[0], -n[1]];
				const at: V = [mid[0] + n[0] * 9, mid[1] + n[1] * 9];
				const anchor = n[0] > 0.35 ? 'start' : n[0] < -0.35 ? 'end' : 'middle';
				const dy = n[1] > 0.35 ? 12 : n[1] < -0.35 ? -3 : 5;
				return (
					<text key={i} x={fmt(at[0])} y={fmt(at[1] + dy)} textAnchor={anchor} fontSize={15} paintOrder="stroke" strokeWidth={4} strokeLinejoin="round" className={cn('stroke-surface', l.given ? 'fill-accent font-medium' : 'fill-fg-muted italic')}>
						{l.text}
					</text>
				);
			})}
			{sketch.caption && (
				<text x={(W + 2 * PX) / 2} y={captionY} textAnchor="middle" fontSize={15} className={sketch.caption.given ? 'fill-accent font-medium' : 'fill-fg-muted'}>
					{sketch.caption.text}
				</text>
			)}
		</svg>
	);
}
