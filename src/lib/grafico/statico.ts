/**
 * The Cartesian plane as a still drawing: the SVG of a window with its grid, axes, curves and marked points, as a
 * string. It is the plane of the exercises (src/lib/exercises/v2/piano.ts): made on the server, with the sampling of
 * the plotter (curva.ts) and the hand of its plane (components/grafico/Plane.tsx: the same greys, axes, arrow tips
 * and fonts), and nothing to run in the browser. `compact` is the size of an option of a multiple choice: four of
 * them stand two by two on a phone, so the line is thicker and the numbers on the axes are few.
 * vault/Decisioni/2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici.md
 */
import { italian } from './assi';
import { sampleFunction, sampleImplicit, tickStep, ticks, type Point, type View } from './curva';

export type StaticShape = { f: (x: number) => number } | { implicit: (x: number, y: number) => number };

export type StaticCurve = StaticShape & { color: string; dash?: 'solid' | 'dashed' | 'dotted' };

export interface StaticPlane {
	view: View;
	curves: StaticCurve[];
	points?: { x: number; y: number; label?: string }[];
	/** The distance between two numbers on the axes. */
	step?: number;
	/** Width over height. Absent, the two axes have the same scale. */
	shape?: number;
	axes?: [string, string];
	alt: string;
}

// The fonts of the figures (components/content/interactive/kit.tsx), written again here: that file is a client one.
const FONT = "KaTeX_Main, 'Latin Modern Roman', 'Times New Roman', serif";
const FONT_MATH = "KaTeX_Math, 'Latin Modern Math', 'Times New Roman', serif";

/** The sizes of the two drawings, in the units of the SVG: the page may shrink it, never stretch it much. */
const LOOKS = {
	full: { width: 360, target: 36, stroke: 2, thin: 1.3, dash: '6 4', dot: '0.1 4.5', point: 4.2, numbers: 13, names: 15, labels: 14 },
	compact: { width: 176, target: 40, stroke: 2.4, thin: 1.5, dash: '5 3.5', dot: '0.1 4', point: 4, numbers: 11, names: 12, labels: 11.5 }
} as const;

export interface PlaneLayout {
	W: number;
	H: number;
	X: (x: number) => number;
	Y: (y: number) => number;
	/** The numbers written on the axes, and the lines of the grid. */
	xNumbers: number[];
	yNumbers: number[];
	xGrid: number[];
	yGrid: number[];
	/** The polylines of each curve, in the coordinates of the plane. */
	lines: Point[][][];
	digits: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The grid under the numbers: every unit where the numbers go by 2 or by 5 and the squares stay wide enough. */
function gridStep(step: number, pixels: number): number {
	const mantissa = Math.round(step / Math.pow(10, Math.floor(Math.log10(step) + 1e-9)));
	if (mantissa === 2 && pixels / 2 >= 10) return step / 2;
	if (mantissa === 5 && pixels / 5 >= 8) return step / 5;
	return step;
}

export function layoutPlane(plane: StaticPlane, compact = false): PlaneLayout {
	const look = compact ? LOOKS.compact : LOOKS.full;
	const { x0, x1, y0, y1 } = plane.view;
	const W = look.width;
	const H = Math.round(W / (plane.shape ?? (x1 - x0) / (y1 - y0)));
	const sx = W / (x1 - x0);
	const sy = H / (y1 - y0);
	const xStep = plane.step ?? tickStep(1 / sx, look.target);
	const yStep = plane.step ?? tickStep(1 / sy, look.target);
	const lines = plane.curves.map((c) => ('f' in c ? sampleFunction(c.f, plane.view, W, H) : sampleImplicit(c.implicit, plane.view, W, H)));
	return {
		W,
		H,
		X: (x) => (x - x0) * sx,
		Y: (y) => (y1 - y) * sy,
		xNumbers: ticks(x0, x1, xStep),
		yNumbers: ticks(y0, y1, yStep),
		xGrid: ticks(x0, x1, gridStep(xStep, xStep * sx)),
		yGrid: ticks(y0, y1, gridStep(yStep, yStep * sy)),
		lines,
		digits: Math.max(0, -Math.floor(Math.log10(Math.min(xStep, yStep)) + 1e-9))
	};
}

/** A polyline with the points that do not bend it left out (Douglas and Peucker), so the page carries a short path. */
function thin(points: [number, number][], tolerance: number): [number, number][] {
	if (points.length < 3) return points;
	const keep = new Uint8Array(points.length);
	keep[0] = keep[points.length - 1] = 1;
	const stack: [number, number][] = [[0, points.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop()!;
		const [ax, ay] = points[a];
		const [bx, by] = points[b];
		const length = Math.hypot(bx - ax, by - ay) || 1;
		let far = -1;
		let most = tolerance;
		for (let i = a + 1; i < b; i++) {
			const d = Math.abs((bx - ax) * (ay - points[i][1]) - (ax - points[i][0]) * (by - ay)) / length;
			if (d > most) [most, far] = [d, i];
		}
		if (far > 0) {
			keep[far] = 1;
			stack.push([a, far], [far, b]);
		}
	}
	return points.filter((_, i) => keep[i]);
}

/** The slope of the first function of the plane at x, to keep a label off its curve; 0 when there is none. */
function slopeAt(plane: StaticPlane, x: number): number {
	const curve = plane.curves.find((c) => 'f' in c && (c.dash ?? 'solid') === 'solid');
	if (!curve || !('f' in curve)) return 0;
	const h = (plane.view.x1 - plane.view.x0) / 400;
	const s = (curve.f(x + h) - curve.f(x - h)) / (2 * h);
	return Number.isFinite(s) ? s : 0;
}

/** The drawing of the plane as an SVG. */
export function planeSvg(plane: StaticPlane, compact = false): string {
	const look = compact ? LOOKS.compact : LOOKS.full;
	const l = layoutPlane(plane, compact);
	const { W, H, X, Y } = l;
	const { x0, x1, y0, y1 } = plane.view;
	const out: string[] = [];
	const line = (xa: number, ya: number, xb: number, yb: number, stroke: string, width: number) => `<line x1="${r1(xa)}" y1="${r1(ya)}" x2="${r1(xb)}" y2="${r1(yb)}" stroke="${stroke}" stroke-width="${width}"/>`;

	// its own white sheet, whatever it lies on: the squared paper of the page, the green of a right answer
	out.push(`<rect width="${W}" height="${H}" rx="3" fill="#fff"/>`);

	for (const x of l.xGrid) out.push(line(X(x), 0, X(x), H, '#d9d9d9', 0.6));
	for (const y of l.yGrid) out.push(line(0, Y(y), W, Y(y), '#d9d9d9', 0.6));

	const xAxisIn = y0 <= 0 && y1 >= 0;
	const yAxisIn = x0 <= 0 && x1 >= 0;
	if (xAxisIn) out.push(line(0, Y(0), W - 4, Y(0), '#000', 0.9), `<path d="M${W},${r1(Y(0))} l-8,-3 l2,3 l-2,3 Z" fill="#000"/>`);
	if (yAxisIn) out.push(line(X(0), 4, X(0), H, '#000', 0.9), `<path d="M${r1(X(0))},0 l-3,8 l3,-2 l3,2 Z" fill="#000"/>`);

	// the numbers beside the axes, or along the edge when an axis is out of the window; none too near an edge
	const axisY = Math.min(Math.max(xAxisIn ? Y(0) : y0 > 0 ? H : 0, 0), H);
	const axisX = Math.min(Math.max(yAxisIn ? X(0) : x0 > 0 ? 0 : W, 0), W);
	const below = axisY + look.numbers + 4 <= H;
	const left = axisX - look.numbers * 1.4 >= 0;
	const text: string[] = [];
	const edge = look.numbers;
	for (const x of l.xNumbers) {
		if (Math.abs(x) < 1e-12 || X(x) < edge || X(x) > W - edge * 1.6) continue;
		text.push(`<text x="${r1(X(x))}" y="${r1(below ? axisY + look.numbers + 1 : axisY - 5)}" text-anchor="middle">${italian(x, l.digits)}</text>`);
	}
	for (const y of l.yNumbers) {
		if (Math.abs(y) < 1e-12 || Y(y) < edge * 1.6 || Y(y) > H - edge * 0.8) continue;
		text.push(`<text x="${r1(left ? axisX - 5 : axisX + 5)}" y="${r1(Y(y))}" dy="0.32em" text-anchor="${left ? 'end' : 'start'}">${italian(y, l.digits)}</text>`);
	}
	const names: string[] = [];
	if (xAxisIn) names.push(`<text x="${W - 6}" y="${r1(Math.max(look.names, Y(0) - 6))}" text-anchor="end">${xml(plane.axes?.[0] ?? 'x')}</text>`);
	if (yAxisIn) names.push(`<text x="${r1(Math.min(W - look.names, X(0) + 7))}" y="${look.names - 2}">${xml(plane.axes?.[1] ?? 'y')}</text>`);
	out.push(
		`<g font-family="${FONT}" font-size="${look.numbers}" fill="#000" stroke="#fff" stroke-width="3" paint-order="stroke" stroke-linejoin="round">${text.join('')}<g font-family="${FONT_MATH}" font-style="italic" font-size="${look.names}">${names.join('')}</g></g>`
	);

	plane.curves.forEach((c, i) => {
		const d = l.lines[i]
			.map((path) => thin(path.map((p): [number, number] => [X(p.x), Y(p.y)]), 0.12))
			.map((path) => path.map(([x, y], k) => `${k ? 'L' : 'M'}${r1(x)},${r1(y)}`).join(''))
			.join('');
		const dash = c.dash === 'dashed' ? ` stroke-dasharray="${look.dash}"` : c.dash === 'dotted' ? ` stroke-dasharray="${look.dot}"` : '';
		if (d) out.push(`<path d="${d}" fill="none" stroke="${c.color}" stroke-width="${c.dash && c.dash !== 'solid' ? look.thin : look.stroke}"${dash} stroke-linejoin="round" stroke-linecap="round"/>`);
	});

	for (const p of plane.points ?? []) {
		const [px, py] = [X(p.x), Y(p.y)];
		out.push(`<circle cx="${r1(px)}" cy="${r1(py)}" r="${look.point}" fill="#000" stroke="#fff" stroke-width="1.2"/>`);
		if (!p.label) continue;
		// beside the point, on the side the curve leaves free: up and left where it rises, up and right where it falls
		const rising = slopeAt(plane, p.x) >= 0;
		const above = py > look.labels * 1.8;
		const toLeft = (rising === above && px > p.label.length * look.labels * 0.5) || px > W - p.label.length * look.labels * 0.5;
		out.push(
			`<text x="${r1(px + (toLeft ? -7 : 7))}" y="${r1(py + (above ? -7 : look.labels + 5))}" text-anchor="${toLeft ? 'end' : 'start'}" font-family="${FONT}" font-size="${look.labels}" fill="#000" stroke="#fff" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round">${xml(p.label)}</text>`
		);
	}

	out.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="3" fill="none" stroke="#b3b3b3" stroke-width="1"/>`);
	// `.plane-drawing` is what the dark theme inverts (app/globals.css), as for the plane of the plotter
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="plane-drawing${compact ? ' plane-compact' : ''}" style="max-width:100%;height:auto" role="img" aria-label="${xml(plane.alt)}">${out.join('')}</svg>`;
}
