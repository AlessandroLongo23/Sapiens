import { labelOf, type Stmt } from './blocco';
import { textOf, type Part } from './espressione';

/**
 * The drawing of a flowchart: its blocks, where each one sits, and the lines between them. The program is
 * structured, so the drawing is computed from it and nobody places a block by hand: a sequence goes down an axis,
 * a selection with two branches opens a column on each side ("sì" on the left), a selection with one branch and a
 * loop keep the branch "sì" on the axis and take "no" around it on the right; a loop comes back up on the left.
 *
 * The same blocks are what the run walks (esecuzione.ts): each one knows the block that follows it.
 */

export type Shape = 'terminal' | 'action' | 'data' | 'decision';
export type Branch = 'next' | 'yes' | 'no';
type Point = [number, number];

/** `x` is the centre of the block, `y` its top. */
export type ChartNode = { id: number; shape: Shape; x: number; y: number; w: number; h: number; label: Part[]; stmt: Stmt | null; next?: number; yes?: number; no?: number };
export type EdgeLabel = { text: string; x: number; y: number; anchor: 'start' | 'end' };
/** `arrows` are the points of the line that carry an arrowhead, coming from the point before. */
export type ChartEdge = { from: number; branch: Branch; to: number; points: Point[]; arrows: number[]; label?: EdgeLabel };
export type Chart = { nodes: ChartNode[]; edges: ChartEdge[]; width: number; height: number };

/** A line that has left its block and not yet reached the next one. */
type Dangling = { from: number; branch: Branch; points: Point[]; arrows: number[]; label?: EdgeLabel };

const GAP = 28;
const PAD = 12;
const AROUND = 28;
/** The width of a character of the labels (14 px, see .flowchart in globals.css): an estimate, on the wide side. */
const CHAR = 7.9;

const shapeOf = (stmt: Stmt): Shape => (stmt.kind === 'assign' ? 'action' : stmt.kind === 'input' || stmt.kind === 'output' ? 'data' : 'decision');

function sizeOf(shape: Shape, label: Part[]): { w: number; h: number } {
	const text = textOf(label).length * CHAR;
	if (shape === 'decision') return { w: Math.max(124, Math.round(text * 1.4 + 24)), h: 56 };
	if (shape === 'data') return { w: Math.max(112, Math.round(text + 48)), h: 36 };
	if (shape === 'terminal') return { w: Math.max(84, Math.round(text + 36)), h: 32 };
	return { w: Math.max(112, Math.round(text + 28)), h: 36 };
}

const half = (stmt: Stmt) => sizeOf(shapeOf(stmt), labelOf(stmt)).w / 2;

/** How far the two columns of a selection stand from its axis. */
function columns(stmt: Extract<Stmt, { kind: 'if' }>): { left: number; right: number } {
	const dw = half(stmt);
	return { left: Math.max(dw + 22, extent(stmt.then).right + 14), right: Math.max(dw + 22, extent(stmt.else ?? []).left + 14) };
}

/** How far a run of blocks reaches on each side of its axis. */
function extent(stmts: Stmt[]): { left: number; right: number } {
	let left = 0;
	let right = 0;
	for (const stmt of stmts) {
		const dw = half(stmt);
		let l = dw;
		let r = dw;
		if (stmt.kind === 'while') {
			const body = extent(stmt.body);
			l = Math.max(body.left, dw) + AROUND;
			r = Math.max(body.right, dw) + AROUND;
		} else if (stmt.kind === 'if' && stmt.else) {
			const off = columns(stmt);
			l = off.left + extent(stmt.then).left;
			r = off.right + extent(stmt.else).right;
		} else if (stmt.kind === 'if') {
			const body = extent(stmt.then);
			l = Math.max(body.left, dw);
			r = Math.max(body.right, dw) + AROUND;
		}
		left = Math.max(left, l);
		right = Math.max(right, r);
	}
	return { left, right };
}

export function buildChart(program: Stmt[]): Chart {
	const nodes: ChartNode[] = [];
	const edges: ChartEdge[] = [];

	const add = (shape: Shape, label: Part[], stmt: Stmt | null, x: number, y: number): ChartNode => {
		const node: ChartNode = { id: nodes.length, shape, x, y, label, stmt, ...sizeOf(shape, label) };
		nodes.push(node);
		return node;
	};

	const arrive = (incoming: Dangling[], node: ChartNode, head = true) => {
		for (const line of incoming) {
			line.points.push([node.x, node.y]);
			edges.push({ from: line.from, branch: line.branch, to: node.id, points: line.points, arrows: head ? [...line.arrows, line.points.length - 1] : line.arrows, label: line.label });
			nodes[line.from][line.branch] = node.id;
		}
	};

	const place = (stmts: Stmt[], x: number, top: number, arriving: Dangling[]): { y: number; out: Dangling[] } => {
		let y = top;
		let incoming = arriving;
		for (const stmt of stmts) {
			y += GAP;
			const node = add(shapeOf(stmt), labelOf(stmt), stmt, x, y);
			arrive(incoming, node);
			const bottom = y + node.h;
			if (stmt.kind !== 'if' && stmt.kind !== 'while') {
				y = bottom;
				incoming = [{ from: node.id, branch: 'next', points: [[x, y]], arrows: [] }];
				continue;
			}
			const dw = node.w / 2;
			const cy = y + node.h / 2;
			const down: Dangling = { from: node.id, branch: 'yes', points: [[x, bottom]], arrows: [], label: { text: 'sì', x: x + 7, y: bottom + 15, anchor: 'start' } };
			const aside = (r: number, to: number): Dangling => ({
				from: node.id,
				branch: 'no',
				points: [
					[x + dw, cy],
					[x + r, cy],
					[x + r, to],
					[x, to]
				],
				arrows: [],
				label: { text: 'no', x: x + dw + 5, y: cy - 6, anchor: 'start' }
			});
			if (stmt.kind === 'while') {
				const body = extent(stmt.body);
				const inner = place(stmt.body, x, bottom, [down]);
				const left = x - Math.max(body.left, dw) - AROUND;
				const join = y - GAP / 2;
				// the way back: under the body, up the left side, and into the line that enters the condition
				for (const line of inner.out) {
					line.points.push([x, inner.y + 14], [left, inner.y + 14], [left, join], [x, join]);
					line.arrows.push(line.points.length - 1);
					arrive([line], node, false);
				}
				y = inner.y + 28;
				incoming = [aside(Math.max(body.right, dw) + AROUND, y)];
			} else if (!stmt.else) {
				const body = extent(stmt.then);
				const inner = place(stmt.then, x, bottom, [down]);
				y = inner.y + 14;
				incoming = [...inner.out, aside(Math.max(body.right, dw) + AROUND, y)];
			} else {
				const off = columns(stmt);
				const yes: Dangling = {
					from: node.id,
					branch: 'yes',
					points: [
						[x - dw, cy],
						[x - off.left, cy]
					],
					arrows: [],
					label: { text: 'sì', x: x - dw - 5, y: cy - 6, anchor: 'end' }
				};
				const no: Dangling = {
					from: node.id,
					branch: 'no',
					points: [
						[x + dw, cy],
						[x + off.right, cy]
					],
					arrows: [],
					label: { text: 'no', x: x + dw + 5, y: cy - 6, anchor: 'start' }
				};
				const then = place(stmt.then, x - off.left, cy + 8, [yes]);
				const otherwise = place(stmt.else, x + off.right, cy + 8, [no]);
				y = Math.max(then.y, otherwise.y) + 18;
				for (const line of then.out) line.points.push([x - off.left, y], [x, y]);
				for (const line of otherwise.out) line.points.push([x + off.right, y], [x, y]);
				incoming = [...then.out, ...otherwise.out];
			}
		}
		return { y, out: incoming };
	};

	const reach = extent(program);
	const x = Math.round(Math.max(reach.left, 42) + PAD);
	const start = add('terminal', [{ text: 'inizio' }], null, x, PAD);
	const body = place(program, x, PAD + start.h, [{ from: start.id, branch: 'next', points: [[x, PAD + start.h]], arrows: [] }]);
	const end = add('terminal', [{ text: 'fine' }], null, x, body.y + GAP);
	arrive(body.out, end);
	return { nodes, edges, width: Math.round(x + Math.max(reach.right, 42) + PAD), height: end.y + end.h + PAD };
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function shape(node: ChartNode): string {
	const { x, y, w, h } = node;
	const l = x - w / 2;
	if (node.shape === 'terminal') return `<rect class="fc-shape" x="${l}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`;
	if (node.shape === 'action') return `<rect class="fc-shape" x="${l}" y="${y}" width="${w}" height="${h}"/>`;
	if (node.shape === 'data') return `<polygon class="fc-shape" points="${l + 12},${y} ${l + w},${y} ${l + w - 12},${y + h} ${l},${y + h}"/>`;
	return `<polygon class="fc-shape" points="${x},${y} ${l + w},${y + h / 2} ${x},${y + h} ${l},${y + h / 2}"/>`;
}

function head([fx, fy]: Point, [tx, ty]: Point): string {
	const length = Math.hypot(tx - fx, ty - fy) || 1;
	const ux = (tx - fx) / length;
	const uy = (ty - fy) / length;
	const bx = tx - ux * 9;
	const by = ty - uy * 9;
	return `<polygon class="fc-head" points="${tx},${ty} ${bx - uy * 4.5},${by + ux * 4.5} ${bx + uy * 4.5},${by - ux * 4.5}"/>`;
}

function line(edge: ChartEdge, taken: boolean): string {
	// the line that was just walked shows its arrowhead at the end too, where a way back has none of its own
	const arrows = taken ? [...new Set([...edge.arrows, edge.points.length - 1])] : edge.arrows;
	const heads = arrows.map((i) => head(edge.points[i - 1], edge.points[i])).join('');
	const label = edge.label ? `<text class="fc-label" x="${edge.label.x}" y="${edge.label.y}" text-anchor="${edge.label.anchor}">${edge.label.text}</text>` : '';
	return `<g class="fc-line${taken ? ' fc-taken' : ''}" data-edge="${edge.from}-${edge.branch}"><polyline class="fc-edge" points="${edge.points.map((p) => p.join(',')).join(' ')}"/>${heads}${label}</g>`;
}

export type ChartMark = { at?: number; taken?: string | null; wrong?: boolean };

/**
 * The chart as SVG, the same on the server (the lesson as it is published, and printed) and in the page while the
 * chart runs: `at` is the block the run is on, `taken` the line it came by.
 */
export function chartSvg(chart: Chart, alt: string, mark: ChartMark = {}): string {
	const key = (edge: ChartEdge) => `${edge.from}-${edge.branch}`;
	const lines = [...chart.edges].sort((a, b) => Number(key(a) === mark.taken) - Number(key(b) === mark.taken)).map((edge) => line(edge, key(edge) === mark.taken));
	const blocks = chart.nodes.map((node) => {
		const text = node.label.map((part) => (part.name ? `<tspan font-style="italic">${escape(part.text)}</tspan>` : escape(part.text))).join('');
		const on = node.id === mark.at ? (mark.wrong ? ' fc-on fc-wrong' : ' fc-on') : '';
		return `<g class="fc-node fc-${node.shape}${on}" data-node="${node.id}">${shape(node)}<text x="${node.x}" y="${node.y + node.h / 2}" text-anchor="middle" dominant-baseline="central">${text}</text></g>`;
	});
	return `<svg class="flowchart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${chart.width} ${chart.height}" width="${chart.width}" height="${chart.height}" role="img" aria-label="${escape(alt)}">${lines.join('')}${blocks.join('')}</svg>`;
}
