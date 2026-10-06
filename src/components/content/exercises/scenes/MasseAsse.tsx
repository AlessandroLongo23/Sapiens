'use client';

import { Drawing, frame, v, FONT, THIN } from '@/components/content/interactive/kit';
import { Ball } from '@/components/content/interactive/fisica';
import { Asta, Quota } from '@/components/content/interactive/fisica/leve';
import type { SceneProps } from '.';

/**
 * Point masses on a light rod and the axis they turn around, as lesson 87 (Il momento d'inerzia) draws a dumbbell:
 * the rod seen from the side, the spheres on it with their masses written above, the axis as a vertical dash-dot line
 * with its name, and the distances as dimension lines under the rod. Positions are in metres from the rod's left end;
 * the rod is drawn 5,6 cm long.
 *
 *   { type: 'masse-asse', data: {
 *       lunghezza: 1.2,                                           // metres
 *       asse: 0.4,                                                // where the axis crosses the rod
 *       masse: [{ x: 0, valore: '2,0 kg' }, { x: 1.2, valore: '3,5 kg' }],
 *       quote: [{ da: 0, a: 0.4, testo: '0,40 m' }, { da: 0, a: 1.2, testo: '1,2 m', livello: 1 }]
 *   } }
 *
 * The scene draws the data only: no moment of inertia, no distance the exercise does not give.
 */

type Massa = { x: number; valore: string };
type QuotaD = { da: number; a: number; testo: string; livello?: number };

const SIZE = 13;
const CH = 0.2; // an average character, in cm, at SIZE
const WIDTH = 5.6;
const ROD_H = 0.08;
const BALL = 0.2;

export default function MasseAsse({ data, alt }: SceneProps) {
	const L = Number(data.lunghezza ?? 1);
	const asse = Number(data.asse ?? 0);
	const masse = (data.masse as Massa[] | undefined) ?? [];
	const quote = (data.quote as QuotaD[] | undefined) ?? [];
	const k = WIDTH / L;
	const X = (x: number) => x * k;
	const levels = Math.max(0, ...quote.map((q) => q.livello ?? 0));
	const quoteY = (q: QuotaD) => -0.6 - 0.55 * (q.livello ?? 0);
	// A mass on the axis has its value beside the axis line, the others above the sphere.
	const labels = masse.map((m) => {
		const onAxis = Math.abs(m.x - asse) < 1e-9;
		const w = m.valore.length * CH;
		const left = onAxis && asse <= L / 2;
		const x = onAxis ? X(m.x) + (left ? -0.3 : 0.3) : X(m.x);
		return { m, x, anchor: (onAxis ? (left ? 'end' : 'start') : 'middle') as 'start' | 'middle' | 'end', x0: onAxis ? (left ? x - w : x) : x - w / 2, x1: onAxis ? (left ? x : x + w) : x + w / 2 };
	});
	// A distance that ends on the axis has its text clear of the axis line, moved outwards when the segment is short.
	const texts = quote.map((q) => {
		const lo = Math.min(X(q.da), X(q.a)), hi = Math.max(X(q.da), X(q.a));
		const hw = (q.testo.length * CH) / 2;
		let cx = (lo + hi) / 2;
		if (Math.abs(lo - X(asse)) < 1e-6 && cx - hw < lo + 0.12) cx = lo + 0.12 + hw;
		if (Math.abs(hi - X(asse)) < 1e-6 && cx + hw > hi - 0.12) cx = hi - 0.12 - hw;
		return { cx, hw };
	});
	const xs = [0 - BALL, X(L) + BALL, ...labels.flatMap((l) => [l.x0, l.x1]), X(asse) - 0.45, X(asse) + 0.45, ...texts.flatMap((q) => [q.cx - q.hw, q.cx + q.hw])];
	const yBottom = -0.6 - 0.55 * levels - 0.5;
	const f = frame(Math.min(...xs) - 0.2, Math.max(...xs) + 0.2, quote.length ? yBottom : -0.7, 1.65);
	const text = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'middle') => {
		const p = f.px(v(x, y));
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={SIZE} fontFamily={FONT} pointerEvents="none">
				{s}
			</text>
		);
	};

	return (
		<Drawing f={f} label={alt}>
			<Asta f={f} from={v(0, -ROD_H / 2)} to={v(X(L), -ROD_H / 2)} h={ROD_H} />
			{masse.map((m, i) => (
				<Ball key={`b${i}`} f={f} at={v(X(m.x), 0)} r={BALL} />
			))}
			<path d={f.path([v(X(asse), quote.length ? yBottom + 0.1 : -0.6), v(X(asse), 1.15)])} stroke="#000" strokeWidth={THIN} strokeDasharray="7 3 1.5 3" fill="none" />
			{text(X(asse), 1.4, 'asse')}
			{labels.map((l, i) => (
				<g key={`l${i}`}>{text(l.x, 0.55, l.m.valore, l.anchor)}</g>
			))}
			{quote.map((q, i) => {
				const y = quoteY(q);
				return (
					<g key={`q${i}`}>
						<Quota f={f} a={v(X(q.da), y)} b={v(X(q.a), y)} />
						{text(texts[i].cx, y - 0.25, q.testo)}
					</g>
				);
			})}
		</Drawing>
	);
}
