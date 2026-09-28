'use client';

import { useState } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, DASH, Drawing, Figure, FONT_MATH, frame, Label, num, Readout, rot, THIN, TINT, Tex, useTween, v, type V } from './kit';

/** A number for KaTeX: {,} keeps the decimal comma from being set as punctuation, with a space after it. */
const tn = (x: number, digits?: number) => num(x, digits).replace(',', '{,}');

/**
 * Lesson 35, difference of squares: the L left when a square of side b is taken from a square of side a is cut
 * along the dashed line into a strip a − b wide and a tall, and a piece b wide and a − b tall. The strip tips over
 * to the left around its bottom corner, like a domino, and the small piece slides after it: together they make the
 * rectangle with sides a + b and a − b of the TikZ figure `differenza-di-quadrati-con-le-aree`, with a on the left
 * and b on the right of the dashed line. One t from 0 to 1 plays both moves.
 */

const RANGE = { a: [1.5, 3], b: [0.2, 2.8] } as const;
const GAP = 0.2;
const f = frame(-RANGE.a[1] - 0.8, RANGE.a[1] + 0.8, -1.25, RANGE.a[1] + 0.55);

/** Letters italic, signs and brackets upright, as TeX sets $(a + b)(a - b)$. */
const math = (s: string) =>
	s.split(/([a-z])/).map((part, i) =>
		/^[a-z]$/.test(part) ? (
			<tspan key={i} fontStyle="italic" fontFamily={FONT_MATH}>
				{part}
			</tspan>
		) : (
			part
		)
	);

const rect = (x0: number, y0: number, x1: number, y1: number) => [v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1)];

export default function DifferenzaDiQuadrati({ alt }: { alt?: string }) {
	const [a, setA] = useState(2.8);
	const [b, setB] = useState(1.1);
	const [t, go] = useTween(0, 1600);
	const d = a - b;

	// First half: the strip turns a quarter turn counterclockwise around its bottom corner, the origin. Second half: the piece slides left by a − b.
	const turn = clamp(t / 0.5, 0, 1);
	const slide = clamp((t - 0.5) / 0.5, 0, 1);
	const strip = rect(0, 0, d, a).map((p) => rot(p, (turn * Math.PI) / 2));
	const piece = rect(d, 0, a, d).map((p) => add(p, v(-d * slide, 0)));
	const start = t === 0;
	const done = t === 1;

	const ln = (P: V, Q: V, dash?: string) => <line x1={f.px(P).x} y1={f.px(P).y} x2={f.px(Q).x} y2={f.px(Q).y} stroke="#000" strokeWidth={THIN} strokeDasharray={dash} />;
	const setSideA = (x: number) => {
		setA(x);
		setB((y) => Math.min(y, Math.round((x - GAP) * 10) / 10));
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={f.pts(...strip)} fill={TINT.blue20} />
				<polygon points={f.pts(...piece)} fill={TINT.blue20} />
				{start ? (
					<>
						{/* The TikZ figure: the L, the square taken away and the cut, dashed. */}
						<polygon points={f.pts(v(0, 0), v(a, 0), v(a, d), v(d, d), v(d, a), v(0, a))} fill="none" stroke="#000" strokeWidth={THIN} />
						<polyline points={f.pts(v(d, d), v(d, a), v(a, a), v(a, d))} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
						{ln(v(d, 0), v(d, d), DASH)}
						<Label f={f} at={v(a / 2, 0)} dir={v(0, -1)}>a</Label>
						<Label f={f} at={v(0, a / 2)} dir={v(-1, 0)}>a</Label>
						<Label f={f} at={v(d + b / 2, a)} dir={v(0, 1)}>b</Label>
						<Label f={f} at={v(a, d + b / 2)} dir={v(1, 0)}>b</Label>
						<Label f={f} at={v(a / 2, -0.75)} upright>
							{math('a² − b²')}
						</Label>
					</>
				) : done ? (
					<>
						<polygon points={f.pts(...rect(-a, 0, b, d))} fill="none" stroke="#000" strokeWidth={THIN} />
						{ln(v(0, 0), v(0, d), DASH)}
						<Label f={f} at={v((b - a) / 2, 0)} dir={v(0, -1)} upright>
							{math('a + b')}
						</Label>
						<Label f={f} at={v(-a, d / 2)} dir={v(-1, 0)} upright>
							{math('a − b')}
						</Label>
						<Label f={f} at={v((b - a) / 2, -0.75)} upright>
							{math('(a + b)(a − b)')}
						</Label>
					</>
				) : (
					<>
						<polygon points={f.pts(...strip)} fill="none" stroke="#000" strokeWidth={THIN} />
						<polygon points={f.pts(...piece)} fill="none" stroke="#000" strokeWidth={THIN} />
					</>
				)}
			</Drawing>

			<Caption>
				{done
					? 'La stessa superficie è diventata un rettangolo con i lati a + b e a − b: per questo a² − b² = (a + b)(a − b).'
					: 'Premi il bottone: la striscia di sinistra si ribalta verso sinistra sul suo vertice in basso, e il pezzo sotto il quadrato tolto la raggiunge.'}
			</Caption>

			<Readout>
				<Tex>{`a^2 - b^2 = ${tn(a * a)} - ${tn(b * b)} = ${tn(a * a - b * b)}`}</Tex>
				<Tex>{`(a + b)(a - b) = ${tn(a + b)} \\cdot ${tn(a - b)} = ${tn((a + b) * (a - b))}`}</Tex>
			</Readout>

			<Button variant="secondary" size="sm" onClick={() => void go(t > 0.5 ? 0 : 1)}>
				{t > 0.5 ? <RotateCw className="size-4" aria-hidden="true" /> : <RotateCcw className="size-4" aria-hidden="true" />}
				{t > 0.5 ? 'Torna al quadrato' : 'Ricomponi il rettangolo'}
			</Button>

			<Controls>
				<Slider label="Lato a" value={a} min={RANGE.a[0]} max={RANGE.a[1]} onChange={setSideA} />
				<Slider label="Lato b" value={b} min={RANGE.b[0]} max={Math.round((a - GAP) * 10) / 10} onChange={setB} />
			</Controls>
		</Figure>
	);
}
