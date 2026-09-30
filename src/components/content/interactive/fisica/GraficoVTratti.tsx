'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Handle, frame, v, clamp, texNum, THIN, TINT, type V } from '../kit';
import { Axes, QTY } from '../fisica';

/**
 * Lesson 43 (Il grafico velocità-tempo): a v-t graph made of three straight pieces, from 0 to 12 s. The student drags
 * its four vertices: the two ends up and down, the two in the middle also sideways. Times snap to whole seconds (at
 * least 1 s apart), velocities to whole m/s between -8 and +10. The areas between the graph and the time axis are
 * filled blue above the axis and red below (each piece cut where it crosses the axis). Under the drawing: the
 * acceleration of each piece (its slope), the displacement (areas with their sign) and the distance travelled (areas
 * all positive). Starts at (0, 0), (4, 8), (8, 8), (12, -8): 16 + 32 + 8 - 8, displacement 48 m, distance 64 m.
 */

const TMAX = 12, VMIN = -8, VMAX = 10;
const SX = 0.5, SY = 0.26; // cm per s, cm per m/s
const f = frame(-1.05, TMAX * SX + 1.2, VMIN * SY - 0.55, VMAX * SY + 0.75);
const P = (t: number, w: number): V => v(t * SX, w * SY);
const RED = '#ffd9d9';

type Pt = { t: number; v: number };
const START: Pt[] = [{ t: 0, v: 0 }, { t: 4, v: 8 }, { t: 8, v: 8 }, { t: 12, v: -8 }];

/** A piece's area split at the axis: [positive part, negative part] as polygons and values. */
function pieces(a: Pt, b: Pt) {
	const pos: V[][] = [], neg: V[][] = [];
	let up = 0, down = 0;
	const push = (p: Pt, q: Pt) => {
		const m = (p.v + q.v) / 2;
		const area = ((p.v + q.v) / 2) * (q.t - p.t);
		const poly = [P(p.t, 0), P(p.t, p.v), P(q.t, q.v), P(q.t, 0)];
		if (m > 0) { pos.push(poly); up += area; } else if (m < 0) { neg.push(poly); down += area; }
	};
	if (a.v * b.v < 0) {
		const tc = a.t + ((b.t - a.t) * a.v) / (a.v - b.v);
		push(a, { t: tc, v: 0 });
		push({ t: tc, v: 0 }, b);
	} else push(a, b);
	return { pos, neg, up, down };
}

export default function GraficoVTratti({ alt }: { alt?: string }) {
	const [pts, setPts] = useState<Pt[]>(START);

	const move = (i: number) => (p: V) => {
		setPts((old) => {
			const next = old.map((q) => ({ ...q }));
			next[i].v = clamp(Math.round(p.y / SY), VMIN, VMAX);
			if (i === 1) next[1].t = clamp(Math.round(p.x / SX), 1, old[2].t - 1);
			if (i === 2) next[2].t = clamp(Math.round(p.x / SX), old[1].t + 1, TMAX - 1);
			return next;
		});
	};

	const parts = [0, 1, 2].map((i) => pieces(pts[i], pts[i + 1]));
	const acc = [0, 1, 2].map((i) => (pts[i + 1].v - pts[i].v) / (pts[i + 1].t - pts[i].t));
	const disp = parts.reduce((s, p) => s + p.up + p.down, 0);
	const dist = parts.reduce((s, p) => s + p.up - p.down, 0);
	const back = parts.some((p) => p.down < 0);

	const grid: string[] = [];
	for (let t = 1; t <= TMAX; t++) grid.push(f.path([P(t, VMIN), P(t, VMAX)]));
	for (let w = VMIN; w <= VMAX; w++) if (w) grid.push(f.path([P(0, w), P(TMAX, w)]));

	const fmt = (x: number) => texNum(x, 2);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={0.3} fill="none" />
				{parts.flatMap((p, i) => [
					...p.pos.map((poly, j) => <path key={`p${i}${j}`} d={f.path(poly, true)} fill={TINT.blue} stroke="none" />),
					...p.neg.map((poly, j) => <path key={`n${i}${j}`} d={f.path(poly, true)} fill={RED} stroke="none" />)
				])}
				<Axes f={f} x0={0} x1={TMAX * SX + 0.7} y0={VMIN * SY - 0.2} y1={VMAX * SY + 0.4} xName="t" yName="v" />
				{[2, 4, 6, 8, 10, 12].map((t) => (
					<g key={t}>
						<path d={f.path([v(t * SX, -0.07), v(t * SX, 0.07)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(t * SX, -0.05)} dir={v(0, -1)} upright size={11}>{String(t)}</Label>
					</g>
				))}
				{[-8, -4, 4, 8].map((w) => (
					<g key={w}>
						<path d={f.path([v(-0.07, w * SY), v(0.07, w * SY)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(-0.05, w * SY)} dir={v(-1, 0)} upright size={11}>{w < 0 ? `−${-w}` : String(w)}</Label>
					</g>
				))}
				<Label f={f} at={v(TMAX * SX + 0.75, -0.3)} dir={v(0, -1)} upright size={11}>(s)</Label>
				<Label f={f} at={v(0.1, VMAX * SY + 0.42)} dir={v(1, 0)} upright size={11}>(m/s)</Label>
				<path d={f.path(pts.map((p) => P(p.t, p.v)))} stroke={QTY.velocita} strokeWidth={1.2} fill="none" strokeLinejoin="round" />
				{pts.map((p, i) => (
					<Handle key={i} f={f} at={P(p.t, p.v)} onMove={move(i)} color={QTY.velocita} step={SY} label={`Vertice ${i + 1} del grafico`} />
				))}
			</Drawing>

			<Readout>
				{acc.map((a, i) => (
					<Tex key={i}>{`a_{${i + 1}} = ${fmt(a)}\\,\\text{m/s}^2`}</Tex>
				))}
			</Readout>
			<Readout>
				<Tex>{`\\Delta s = ${fmt(disp)}\\,\\text{m}`}</Tex>
				<Tex>{`\\text{distanza} = ${fmt(dist)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>
				{back
					? 'Dove il grafico è sotto l’asse il corpo torna indietro: le aree rosse si tolgono dallo spostamento e si sommano alla distanza percorsa.'
					: 'Il grafico è tutto sopra l’asse: il corpo va sempre nello stesso verso, e lo spostamento è uguale alla distanza percorsa.'}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setPts(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Grafico iniziale
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
