'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Caption, Controls, Dot, Drawing, Figure, FONT, Handle, INK, K, Label, Readout, THICK, THIN, TINT, add, cross, dist, dot, frame, intersect, len, lerp, mid, scale, sub, unit, useTween, v, type V } from './kit';

/**
 * Lesson 62, the families of quadrilaterals: the student drags the four vertices of ABCD, which click softly onto
 * parallel sides, congruent sides, right angles and special diagonals. Beside it, the lesson's Venn diagram lights up
 * the family the figure is in, with every family that contains it; on the figure, the diagonals show what is true of
 * them (they bisect each other, are congruent, are perpendicular). Buttons take the figure to each family.
 *
 * Definitions as in the lesson: a trapezoid has exactly two parallel sides (so no parallelogram is a trapezoid), the
 * quadrilaterals are convex. Every property is tested on the coordinates with a tolerance far below what a drag can
 * reach by chance, so a figure is a rectangle only when its angles have clicked onto right ones.
 */

const f = frame(-0.55, 5.55, -0.55, 3.45);
/** The diagram, in the TikZ figure's centimetres at its scale of 0.96. */
const SK = 0.96;
const g = frame(-0.08 * SK, 7.38 * SK, -0.08 * SK, 5.08 * SK);
const BOX = { x0: -0.2, x1: 5.2, y0: -0.2, y1: 3.15 };
const SNAP = 0.18;
const TOL = 1e-7;
const LINE_BLUE = '#0000b3'; // blue!70!black
const ORANGE15 = '#ffecd9'; // orange!15

type Quad = [V, V, V, V];
type Curve = { kind: 'line'; p: V; d: V } | { kind: 'circle'; c: V; r: number };

const PRESETS: { label: string; q: Quad }[] = [
	{ label: 'Quadrato', q: [v(1.1, 0.1), v(3.9, 0.1), v(3.9, 2.9), v(1.1, 2.9)] },
	{ label: 'Rettangolo', q: [v(0.4, 0.3), v(4.6, 0.3), v(4.6, 2.7), v(0.4, 2.7)] },
	{ label: 'Rombo', q: [v(0.3, 1.5), v(2.6, 0.2), v(4.9, 1.5), v(2.6, 2.8)] },
	{ label: 'Parallelogramma', q: [v(0.2, 0.3), v(3.8, 0.3), v(4.9, 2.7), v(1.3, 2.7)] },
	{ label: 'Trapezio isoscele', q: [v(0.2, 0.3), v(4.8, 0.3), v(3.6, 2.6), v(1.4, 2.6)] },
	{ label: 'Trapezio rettangolo', q: [v(0.4, 0.3), v(4.8, 0.3), v(3.0, 2.6), v(0.4, 2.6)] },
	{ label: 'Qualsiasi', q: [v(0.2, 0.2), v(4.2, 0.3), v(4.9, 2.4), v(1.0, 2.8)] }
];
const NAMES = ['A', 'B', 'C', 'D'];

// ---------------------------------------------------------------- properties

const parallel = (a: V, b: V) => Math.abs(cross(a, b)) <= TOL * len(a) * len(b);
const perpendicular = (a: V, b: V) => Math.abs(dot(a, b)) <= TOL * len(a) * len(b);
const same = (x: number, y: number) => Math.abs(x - y) <= TOL * Math.max(x, y);

type Family = 'quadrato' | 'rettangolo' | 'rombo' | 'parallelogramma' | 'isoscele' | 'trapezio-rettangolo' | 'trapezio' | 'nessuna';

function classify(q: Quad) {
	const [A, B, C, D] = q;
	const sides = [sub(B, A), sub(C, B), sub(D, C), sub(A, D)];
	const lengths = sides.map(len);
	const p1 = parallel(sides[0], sides[2]);
	const p2 = parallel(sides[1], sides[3]);
	const rightAt = [0, 1, 2, 3].map((i) => perpendicular(sides[(i + 3) % 4], sides[i]));
	const M = intersect(A, C, B, D) ?? mid(A, C);
	const halves = same(dist(A, M), dist(M, C)) && same(dist(B, M), dist(M, D));
	const equalDiagonals = same(dist(A, C), dist(B, D));
	const perpDiagonals = perpendicular(sub(C, A), sub(D, B));
	let family: Family;
	if (p1 && p2) {
		const right = rightAt[0];
		const rhombus = same(lengths[0], lengths[1]);
		family = right && rhombus ? 'quadrato' : right ? 'rettangolo' : rhombus ? 'rombo' : 'parallelogramma';
	} else if (p1 || p2) {
		// The legs are the two sides that are not parallel.
		const legs = p1 ? [1, 3] : [0, 2];
		family = same(lengths[legs[0]], lengths[legs[1]]) ? 'isoscele' : rightAt.some(Boolean) ? 'trapezio-rettangolo' : 'trapezio';
	} else family = 'nessuna';
	return { family, lengths, rightAt, M, halves, equalDiagonals, perpDiagonals };
}

/** Convex, not flat anywhere, inside the box, sides not too short: a quadrilateral of the lesson. */
function valid(q: Quad) {
	for (let i = 0; i < 4; i++) {
		const p = q[i];
		if (p.x < BOX.x0 - 1e-9 || p.x > BOX.x1 + 1e-9 || p.y < BOX.y0 - 1e-9 || p.y > BOX.y1 + 1e-9) return false;
		const a = sub(q[(i + 1) % 4], p), b = sub(q[(i + 2) % 4], q[(i + 1) % 4]);
		if (len(a) < 0.6) return false;
		// Counterclockwise, and every angle clearly less than a straight one.
		if (cross(a, b) < 0.12 * len(a) * len(b)) return false;
	}
	return true;
}

// ---------------------------------------------------------------- snapping

/** Every place vertex i could click onto, given the other three. */
function curves(q: Quad, i: number): Curve[] {
	const R = q[(i + 1) % 4], S = q[(i + 2) % 4], Q = q[(i + 3) % 4];
	const perp = (d: V) => v(-d.y, d.x);
	return [
		{ kind: 'line', p: R, d: sub(Q, S) }, // PR ∥ SQ
		{ kind: 'line', p: Q, d: sub(R, S) }, // QP ∥ RS
		{ kind: 'circle', c: mid(Q, R), r: dist(Q, R) / 2 }, // right angle at P
		{ kind: 'line', p: Q, d: perp(sub(S, Q)) }, // right angle at Q
		{ kind: 'line', p: R, d: perp(sub(S, R)) }, // right angle at R
		{ kind: 'circle', c: R, r: dist(R, S) }, // PR = RS
		{ kind: 'circle', c: Q, r: dist(Q, S) }, // QP = SQ
		{ kind: 'circle', c: R, r: dist(Q, S) }, // PR = SQ, opposite sides
		{ kind: 'circle', c: Q, r: dist(R, S) }, // QP = RS, opposite sides
		{ kind: 'line', p: mid(Q, R), d: perp(sub(R, Q)) }, // PQ = PR
		{ kind: 'circle', c: S, r: dist(Q, R) }, // congruent diagonals
		{ kind: 'line', p: S, d: perp(sub(R, Q)) } // perpendicular diagonals
	];
}

function nearest(c: Curve, p: V): V {
	if (c.kind === 'line') {
		const u = unit(c.d);
		return add(c.p, scale(u, dot(sub(p, c.p), u)));
	}
	const d = sub(p, c.c);
	return len(d) < 1e-9 ? add(c.c, v(c.r, 0)) : add(c.c, scale(unit(d), c.r));
}
const onCurve = (c: Curve, p: V) => (c.kind === 'line' ? Math.abs(cross(unit(c.d), sub(p, c.p))) : Math.abs(dist(p, c.c) - c.r)) < 1e-7;

function meet(a: Curve, b: Curve): V[] {
	if (a.kind === 'line' && b.kind === 'line') {
		const x = intersect(a.p, add(a.p, a.d), b.p, add(b.p, b.d));
		return x ? [x] : [];
	}
	if (a.kind === 'circle' && b.kind === 'circle') {
		const d = dist(a.c, b.c);
		if (d < 1e-9 || d > a.r + b.r || d < Math.abs(a.r - b.r)) return [];
		const x = (d * d + a.r * a.r - b.r * b.r) / (2 * d);
		const h = Math.sqrt(Math.max(0, a.r * a.r - x * x));
		const u = unit(sub(b.c, a.c));
		const m = add(a.c, scale(u, x));
		return [add(m, scale(v(-u.y, u.x), h)), add(m, scale(v(u.y, -u.x), h))];
	}
	const [l, c] = a.kind === 'line' ? [a, b as Extract<Curve, { kind: 'circle' }>] : [b as Extract<Curve, { kind: 'line' }>, a];
	const foot = nearest(l, c.c);
	const h2 = c.r * c.r - dist(foot, c.c) ** 2;
	if (h2 < 0) return [];
	const u = unit(l.d);
	return [add(foot, scale(u, Math.sqrt(h2))), sub(foot, scale(u, Math.sqrt(h2)))];
}

/** The point near p that satisfies the most conditions at once, or p itself. */
function snap(q: Quad, i: number, p: V): V {
	const near = curves(q, i).filter((c) => dist(nearest(c, p), p) < SNAP);
	const options: V[] = near.map((c) => nearest(c, p));
	for (let a = 0; a < near.length; a++) for (let b = a + 1; b < near.length; b++) options.push(...meet(near[a], near[b]).filter((x) => dist(x, p) < SNAP));
	let best = p, score = 0, gap = 0;
	for (const o of options) {
		const trial = q.map((x, k) => (k === i ? o : x)) as Quad;
		if (!valid(trial)) continue;
		const s = near.filter((c) => onCurve(c, o)).length;
		const d = dist(o, p);
		if (s > score || (s === score && d < gap)) [best, score, gap] = [o, s, d];
	}
	return best;
}

// ---------------------------------------------------------------- the diagram

type Region = { key: string; name: string; at: V; sets: string[] };
/** Where the figure's marker goes for each family, and the sets that contain it (TikZ coordinates). */
const REGION: Record<Family, Region> = {
	nessuna: { key: 'nessuna', name: 'quadrilatero', at: v(0.42, 0.32), sets: ['Q'] },
	trapezio: { key: 'trapezio', name: 'trapezio scaleno', at: v(1.3, 0.72), sets: ['Q', 'T'] },
	isoscele: { key: 'isoscele', name: 'trapezio isoscele', at: v(0.62, 2.65), sets: ['Q', 'T', 'TI'] },
	'trapezio-rettangolo': { key: 'trapezio-rettangolo', name: 'trapezio rettangolo', at: v(0.62, 1.45), sets: ['Q', 'T', 'TR'] },
	parallelogramma: { key: 'parallelogramma', name: 'parallelogramma', at: v(3.05, 3.55), sets: ['Q', 'P'] },
	rettangolo: { key: 'rettangolo', name: 'rettangolo', at: v(3.35, 1.5), sets: ['Q', 'P', 'R'] },
	rombo: { key: 'rombo', name: 'rombo', at: v(6.35, 1.5), sets: ['Q', 'P', 'H'] },
	quadrato: { key: 'quadrato', name: 'quadrato', at: v(4.83, 1.45), sets: ['Q', 'P', 'R', 'H', 'QQ'] }
};
const SENTENCE: Record<Family, string> = {
	quadrato: 'È un quadrato: è anche un rettangolo e un rombo, e quindi un parallelogramma.',
	rettangolo: 'È un rettangolo, quindi anche un parallelogramma.',
	rombo: 'È un rombo, quindi anche un parallelogramma.',
	parallelogramma: 'È un parallelogramma: i lati opposti sono paralleli.',
	isoscele: 'È un trapezio isoscele: due soli lati paralleli e i lati obliqui congruenti.',
	'trapezio-rettangolo': 'È un trapezio rettangolo: due soli lati paralleli e un lato obliquo perpendicolare alle basi.',
	trapezio: 'È un trapezio scaleno: due soli lati paralleli, lati obliqui diversi.',
	nessuna: 'Non ha lati paralleli: sta fuori dai trapezi e dai parallelogrammi.'
};

function Diagram({ family }: { family: Family }) {
	const r = REGION[family];
	const on = (k: string) => r.sets.includes(k);
	const w = (k: string) => (on(k) ? THICK * 1.8 : THIN);
	const s = (x: number, y: number) => v(x * SK, y * SK);
	const ellipse = (cx: number, cy: number, rx: number, ry: number, k: string) => {
		const c = g.px(s(cx, cy));
		return <ellipse cx={c.x} cy={c.y} rx={rx * SK * K} ry={ry * SK * K} fill="none" stroke="#000" strokeWidth={w(k)} />;
	};
	const rect = (x0: number, y0: number, x1: number, y1: number, rr: number, k: string, fill = 'none') => {
		const a = g.px(s(x0, y1)), b = g.px(s(x1, y0));
		return <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={rr} fill={fill} stroke="#000" strokeWidth={w(k)} />;
	};
	const text = (x: number, y: number, t: string, k: string, small = false, anchor: 'middle' | 'start' = 'middle') => {
		const p = g.px(s(x, y));
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={small ? 11 : 13} fontFamily={FONT} fontWeight={on(k) ? 700 : 400} fill="#000">
				{t}
			</text>
		);
	};
	const centre = g.px(s(1.3, 2.2));
	const marker = g.px(s(r.at.x, r.at.y));
	return (
		<Drawing f={g} label={`Schema delle famiglie di quadrilateri: la figura è un ${r.name}`}>
			{rect(0, 0, 7.3, 5, 9, 'Q')}
			{text(0.12, 4.72, 'Quadrilateri', 'Q', false, 'start')}
			<ellipse cx={centre.x} cy={centre.y} rx={1.1 * SK * K} ry={1.75 * SK * K} fill={ORANGE15} />
			{ellipse(1.3, 2.2, 1.1, 1.75, 'T')}
			{text(1.3, 3.55, 'Trapezi', 'T')}
			{ellipse(1.3, 2.65, 0.85, 0.42, 'TI')}
			{text(1.45, 2.65, 'isosceli', 'TI', true)}
			{ellipse(1.3, 1.45, 0.85, 0.42, 'TR')}
			{text(1.45, 1.45, 'rettangoli', 'TR', true)}
			{rect(2.55, 0.3, 7.1, 4.3, 14, 'P', TINT.blue)}
			{text(4.83, 3.75, 'Parallelogrammi', 'P')}
			{ellipse(4.15, 1.95, 1.4, 1.0, 'R')}
			{ellipse(5.51, 1.95, 1.4, 1.0, 'H')}
			{text(3.5, 1.95, 'Rettangoli', 'R', true)}
			{text(6.25, 1.95, 'Rombi', 'H', true)}
			{text(4.83, 1.95, 'Quadrati', 'QQ', true)}
			<circle cx={marker.x} cy={marker.y} r={6} fill={INK.red} stroke="#000" strokeWidth={THIN} />
		</Drawing>
	);
}

// ---------------------------------------------------------------- the figure

export default function FamiglieQuadrilateri({ alt }: { alt?: string }) {
	const [quad, setQuad] = useState<Quad>(PRESETS[6].q);
	const [anim, setAnim] = useState<{ from: Quad; to: Quad } | null>(null);
	const [t, go, running] = useTween(0, 800);
	const shown: Quad = anim ? (anim.from.map((p, i) => lerp(p, anim.to[i], t)) as Quad) : quad;
	const info = classify(quad);
	const settled = !anim;

	const move = (i: number) => (p: V) => {
		if (anim) {
			void go(0, 0);
			setAnim(null);
		}
		const raw = v(Math.min(BOX.x1, Math.max(BOX.x0, p.x)), Math.min(BOX.y1, Math.max(BOX.y0, p.y)));
		const next = snap(quad, i, raw);
		const trial = quad.map((x, k) => (k === i ? next : x)) as Quad;
		if (valid(trial)) setQuad(trial);
	};
	const preset = (to: Quad) => {
		setAnim({ from: shown, to });
		setQuad(to);
		void go(0, 0).then(() => go(1).then(() => setAnim(null)));
	};

	const [A, B, C, D] = shown;
	const M = settled ? info.M : (intersect(A, C, B, D) ?? mid(A, C));
	const centroid = scale(add(add(A, B), add(C, D)), 0.25);
	const seg = (P: V, Q: V) => {
		const a = f.px(P), b = f.px(Q);
		return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
	};

	// Congruent sides: ticks, one mark per group of equal lengths.
	const groups: number[][] = [];
	if (settled)
		info.lengths.forEach((l, i) => {
			const grp = groups.find((gr) => same(info.lengths[gr[0]], l));
			if (grp) grp.push(i);
			else groups.push([i]);
		});
	const ticks = groups.filter((gr) => gr.length > 1);
	// The halves of the diagonals take the next counts of ticks, so no mark says that a half equals a side.
	const halfA = ticks.length + 1;
	const halfB = info.equalDiagonals ? halfA : halfA + 1;

	const yes = (b: boolean) => (b ? 'sì' : 'no');

	return (
		<Figure>
			<div className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4">
				<Drawing f={f} label={alt}>
					<polygon points={f.pts(A, B, C, D)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} strokeLinejoin="miter" />
					<line {...seg(A, C)} stroke={LINE_BLUE} strokeWidth={THIN} />
					<line {...seg(B, D)} stroke={LINE_BLUE} strokeWidth={THIN} />
					{settled && info.perpDiagonals && <polyline points={f.right(M, sub(C, M), sub(D, M), 0.17)} fill="none" stroke="#000" strokeWidth={THIN} />}
					{settled && info.halves && (
						<>
							<path d={`${f.tick(A, M, halfA, 0.09)} ${f.tick(M, C, halfA, 0.09)}`} stroke={LINE_BLUE} strokeWidth={THIN} />
							<path d={`${f.tick(B, M, halfB, 0.09)} ${f.tick(M, D, halfB, 0.09)}`} stroke={LINE_BLUE} strokeWidth={THIN} />
						</>
					)}
					{ticks.map((gr, n) =>
						gr.map((i) => <path key={`${n}-${i}`} d={f.tick(shown[i], shown[(i + 1) % 4], n + 1)} stroke="#000" strokeWidth={THIN} />)
					)}
					{settled &&
						info.rightAt.map((r, i) =>
							r ? <polyline key={i} points={f.right(shown[i], sub(shown[(i + 1) % 4], shown[i]), sub(shown[(i + 3) % 4], shown[i]), 0.22)} fill="none" stroke="#000" strokeWidth={THIN} /> : null
						)}
					<Dot f={f} at={M} r={1.8} color={LINE_BLUE} />
					{shown.map((p, i) => (
						<Label key={i} f={f} at={p} dir={unit(sub(p, centroid))}>
							{NAMES[i]}
						</Label>
					))}
					{shown.map((p, i) => (
						<Handle key={i} f={f} at={p} onMove={move(i)} label={`Il vertice ${NAMES[i]}`} step={0.25} />
					))}
				</Drawing>
				<Diagram family={info.family} />
			</div>

			<Caption>{settled ? SENTENCE[info.family] : ' '}</Caption>
			<Readout>
				<span>diagonali che si tagliano a metà: {yes(info.halves)}</span>
				<span>congruenti: {yes(info.equalDiagonals)}</span>
				<span>perpendicolari: {yes(info.perpDiagonals)}</span>
			</Readout>

			<Controls>
				<p className="m-0 text-center text-sm text-fg-muted">
					Trascina i vertici: si agganciano a lati paralleli, lati congruenti e angoli retti. Oppure parti da una famiglia:
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					{PRESETS.map((p) => (
						<Button key={p.label} variant="secondary" size="sm" onClick={() => preset(p.q)} disabled={running}>
							{p.label}
						</Button>
					))}
				</div>
			</Controls>
		</Figure>
	);
}
