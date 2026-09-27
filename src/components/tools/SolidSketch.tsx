import type { Pt } from '@/lib/tools/geometria';
import type { SolidSketch as Sketch } from '@/lib/tools/solidi';
import { cn } from '@/lib/utils/cn';

/**
 * A solid drawn like a sketch on squared paper, in the style of FigureSketch: thin ink lines in the text color, the
 * hidden edges and the back of the round bases dashed, heights, radii and apothems dashed and muted, the given measures
 * in the accent color and the ones to find as a bare symbol. The engine gives the solid already projected (cabinet
 * projection, depth at 45°); here it is scaled to the box, and a very tall or very flat solid is stretched on its
 * short side, as a teacher would draw it on the board.
 */

const W = 300;
const H = 200;
const PX = 64;
const PY = 30;
/** The longest side is at most this many times the shortest, on screen. */
const MAX_RATIO = 2.5;

type V = [number, number];
const fmt = (n: number) => Math.round(n * 10) / 10;
const unit = (a: V): V => {
	const l = Math.hypot(a[0], a[1]) || 1;
	return [a[0] / l, a[1] / l];
};

/** Points along an ellipse from angle t0 to t1, in the solid's units. */
function arc(c: Pt, rx: number, ry: number, t0: number, t1: number): Pt[] {
	const steps = Math.max(8, Math.ceil((Math.abs(t1 - t0) / Math.PI) * 32));
	return Array.from({ length: steps + 1 }, (_, i) => {
		const t = t0 + ((t1 - t0) * i) / steps;
		return [c[0] + rx * Math.cos(t), c[1] + ry * Math.sin(t)];
	});
}

const OFFSET: Record<Sketch['labels'][number]['side'], { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
	above: { dx: 0, dy: -8, anchor: 'middle' },
	below: { dx: 0, dy: 20, anchor: 'middle' },
	left: { dx: -9, dy: 5, anchor: 'end' },
	right: { dx: 9, dy: 5, anchor: 'start' }
};

export function SolidSketch({ sketch, title }: { sketch: Sketch; title: string }) {
	const pts: Pt[] = [...sketch.silhouette];
	for (const e of sketch.edges) pts.push(e.from, e.to);
	for (const e of sketch.ellipses) pts.push([e.c[0] - e.rx, e.c[1] - e.ry], [e.c[0] + e.rx, e.c[1] + e.ry]);
	for (const [a, b] of sketch.lines) pts.push(a, b);
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const w = maxX - minX || 1;
	const h = maxY - minY || 1;
	const s = Math.min(W / w, H / h);
	const sx = Math.min(W / w, Math.max(s, H / MAX_RATIO / w));
	const sy = Math.min(H / h, Math.max(s, W / MAX_RATIO / h));
	const ox = PX + (W - w * sx) / 2;
	const oy = PY + (H - h * sy) / 2;
	const map = (p: Pt): V => [ox + (p[0] - minX) * sx, oy + (maxY - p[1]) * sy];
	const path = (list: Pt[], close = false) => list.map((p, i) => `${i ? 'L' : 'M'}${fmt(map(p)[0])},${fmt(map(p)[1])}`).join(' ') + (close ? ' Z' : '');

	const captionY = PY * 2 + H + 18;
	const height = sketch.caption ? captionY + 8 : PY * 2 + H;
	const dashed = { strokeDasharray: '5 4' };

	return (
		<svg viewBox={`0 0 ${W + 2 * PX} ${height}`} role="img" aria-label={title} className="h-auto w-full max-w-md self-center text-fg">
			<title>{title}</title>
			<path d={path(sketch.silhouette, true)} className="fill-accent/10" stroke="none" />
			{sketch.edges.map((e, i) => {
				const [p, q] = [map(e.from), map(e.to)];
				return <line key={`e${i}`} x1={fmt(p[0])} y1={fmt(p[1])} x2={fmt(q[0])} y2={fmt(q[1])} className={e.hidden ? 'stroke-fg-muted' : 'stroke-current'} strokeWidth={e.hidden ? 1.1 : 1.5} strokeLinecap="round" {...(e.hidden ? dashed : {})} />;
			})}
			{sketch.ellipses.map((e, i) => {
				const [h0, h1] = e.hidden ?? [0, 0];
				return (
					<g key={`o${i}`} fill="none">
						<path d={path(arc(e.c, e.rx, e.ry, h1, h0 + 2 * Math.PI))} className="stroke-current" strokeWidth={1.5} />
						{e.hidden && <path d={path(arc(e.c, e.rx, e.ry, h0, h1))} className="stroke-fg-muted" strokeWidth={1.1} {...dashed} />}
					</g>
				);
			})}
			{sketch.lines.map(([a, b], i) => {
				const [p, q] = [map(a), map(b)];
				return <line key={`l${i}`} x1={fmt(p[0])} y1={fmt(p[1])} x2={fmt(q[0])} y2={fmt(q[1])} className="stroke-fg-muted" strokeWidth={1.2} {...dashed} />;
			})}
			{sketch.right.map(([corner, a, b], i) => {
				const c = map(corner);
				const u = unit([map(a)[0] - c[0], map(a)[1] - c[1]]);
				const v = unit([map(b)[0] - c[0], map(b)[1] - c[1]]);
				const k = 8;
				const d = `M${fmt(c[0] + u[0] * k)},${fmt(c[1] + u[1] * k)} L${fmt(c[0] + (u[0] + v[0]) * k)},${fmt(c[1] + (u[1] + v[1]) * k)} L${fmt(c[0] + v[0] * k)},${fmt(c[1] + v[1] * k)}`;
				return <path key={`r${i}`} d={d} fill="none" className="stroke-fg-muted" strokeWidth={1} />;
			})}
			{sketch.dots.map((d, i) => {
				const p = map(d);
				return <circle key={`d${i}`} cx={fmt(p[0])} cy={fmt(p[1])} r={2.5} className="fill-current" />;
			})}
			{sketch.labels.map((l, i) => {
				const [p, q] = [map(l.from), map(l.to)];
				const t = l.at ?? 0.5;
				const o = OFFSET[l.side];
				return (
					<text
						key={`t${i}`}
						x={fmt(p[0] + (q[0] - p[0]) * t + o.dx)}
						y={fmt(p[1] + (q[1] - p[1]) * t + o.dy)}
						textAnchor={o.anchor}
						fontSize={15}
						paintOrder="stroke"
						strokeWidth={4}
						strokeLinejoin="round"
						className={cn('stroke-surface', l.given ? 'fill-accent font-medium' : 'fill-fg-muted italic')}
					>
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
