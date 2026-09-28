'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, clamp, Controls, DASH, Drawing, Figure, FONT_MATH, frame, K, Readout, Tex, texNum, THICK, TINT, v } from './kit';
import { Formula, Grip, Line, n, signed, Text, Tick, xc } from './retta';

/**
 * Lesson 57, "Lo scarto quadratico medio": five marks on the line, each joined to the mean by the arrow of its
 * deviation, as in `scarti-dalla-media-voti-luca`. Under the line the squares of the deviations are drawn as real
 * squares (at a smaller scale, the same for all of them), and a dashed square whose area is their mean, σ²: its side
 * is σ. Moving a single mark far away makes its square, and so σ², grow much faster than its arrow.
 */

const U = 0.75; // cm per mark, as in the TikZ figure
const LO = 3, HI = 10;
const X = (t: number) => t * U;
const SQ = 0.25; // cm per mark for the sides of the squares
const ROW = 0.6;
const LUCA = [4, 6, 7, 9, 9];
const MARTA = [6, 7, 7, 7, 8];
const TOP = 3.55; // top of the mean's dashed line
const SQ_TOP = -0.8;
const f = frame(X(2.2), X(10.9), -2.35, TOP + 0.5);
const STROKE = xc('orange', 70);
const FILL = xc('orange', 35);

/** x rounded where binary floating point leaves crumbs: the data are whole numbers, so 3 decimals are exact. */
const clean = (x: number) => Math.round(x * 1000) / 1000;

export default function ScartiQuadrati({ alt }: { alt?: string }) {
	const [xs, setXs] = useState(LUCA);
	const S = xs.reduce((s, x) => s + x, 0);
	const m = clean(S / 5);
	const d = xs.map((x) => clean(x - m));
	const q = d.map((x) => clean(x * x));
	const Q = clean(q.reduce((s, x) => s + x, 0));
	const s2 = clean(Q / 5);
	const s = Math.sqrt(s2);
	const exact = Math.abs(Math.round(s * 100) ** 2 - s2 * 10000) < 1e-6;
	const move = (i: number, x: number) => setXs((a) => a.map((y, j) => (j === i ? clamp(Math.round(x / U), LO, HI) : y)));

	// The squares, left to right in the order of the rows, then the dashed one of side σ.
	const sides = d.map((x) => Math.abs(x) * SQ);
	const room = sides.map((side) => side + (side > 0 ? 0.18 : 0.12));
	const squares = sides.map((side, i) => ({ side, x: f.x0 + 0.25 + room.slice(0, i).reduce((a, w) => a + w, 0) }));
	const sigmaX = f.x0 + 0.25 + room.reduce((a, w) => a + w, 0) + 0.25;
	const sigmaSide = s * SQ;

	const lines = [
		`\\bar{x} = \\frac{${xs.join(' + ')}}{5} = \\frac{${S}}{5} = ${texNum(m, 1)}`,
		`\\sigma^2 = \\frac{${q.map((x) => texNum(x, 2)).join(' + ')}}{5} = \\frac{${texNum(Q, 2)}}{5} = ${texNum(s2, 3)}`,
		// Rounded to the hundredth like the lesson, trailing zero included (√3,6 ≈ 1,90); exact roots as they are.
		`\\sigma = \\sqrt{${texNum(s2, 3)}} ${exact ? `= ${texNum(s, 2)}` : `\\approx ${s.toFixed(2).replace('.', '{,}')}`}`
	];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Line f={f} from={v(X(2.5), 0)} to={v(X(10.6), 0)} arrow />
				{Array.from({ length: HI - LO + 1 }, (_, i) => i + LO).map((t) => (
					<g key={t}>
						<Tick f={f} x={X(t)} h={0.11} />
						<Text f={f} at={v(X(t), -0.16)} baseline="top">
							{t}
						</Text>
					</g>
				))}
				<Line f={f} from={v(X(m), 0)} to={v(X(m), TOP)} color={xc('gray', 100)} dash={DASH} />
				<Formula f={f} at={v(X(m), TOP + 0.22)} items={[{ xbar: true }, ' = ', n(m, 1)]} size={15} />
				{xs.map((x, i) => {
					const y = ROW * (5 - i);
					const label = signed(d[i], 1);
					const arrow = Math.abs(X(x) - X(m)) > 0.2;
					// Over its arrow when there is room, beside the mark (on the far side from the mean) when not.
					const over = Math.abs(X(x) - X(m)) > label.length * 0.16 + 0.5;
					const side = x < m ? -1 : 1;
					return (
						<g key={i}>
							{arrow && <Line f={f} from={v(X(m), y)} to={v(X(x) - side * 0.14, y)} color={STROKE} width={THICK} arrow />}
							<Text f={f} at={over ? v((X(x) + X(m)) / 2, y + 0.05) : v(X(x) + side * 0.17, y)} anchor={over ? 'middle' : side < 0 ? 'end' : 'start'} baseline={over ? 'bottom' : 'middle'} size={13.5}>
								{label}
							</Text>
							<Grip f={f} at={v(X(x), y)} onMove={(p) => move(i, p.x)} label={`Voto ${i + 1}, ${x}`} step={U} ring={8}>
								<circle cx={f.px(v(X(x), y)).x} cy={f.px(v(X(x), y)).y} r={0.1 * K} fill={FILL} stroke={STROKE} strokeWidth={0.6} />
							</Grip>
						</g>
					);
				})}
				{squares.map(({ x, side }, i) =>
					side > 0 ? (
						<g key={i}>
							<rect x={f.px(v(x, SQ_TOP)).x} y={f.px(v(x, SQ_TOP)).y} width={side * K} height={side * K} fill={TINT.orange} stroke={STROKE} strokeWidth={0.6} />
							{side * K > n(q[i], 2).length * 6.5 + 4 && (
								<Text f={f} at={v(x + side / 2, SQ_TOP - side / 2)} size={12}>
									{n(q[i], 2)}
								</Text>
							)}
						</g>
					) : (
						<circle key={i} cx={f.px(v(x, SQ_TOP)).x} cy={f.px(v(x, SQ_TOP)).y} r={1.2} fill={STROKE} />
					)
				)}
				{sigmaSide > 0 && (
					<>
						<rect x={f.px(v(sigmaX, SQ_TOP)).x} y={f.px(v(sigmaX, SQ_TOP)).y} width={sigmaSide * K} height={sigmaSide * K} fill={TINT.blue} stroke="#000" strokeWidth={0.6} strokeDasharray={DASH} />
						<Text f={f} at={v(sigmaX + sigmaSide / 2, SQ_TOP - sigmaSide - 0.08)} baseline="top" size={13.5} italic>
							σ
						</Text>
					</>
				)}
				<Text f={f} at={sigmaSide >= 0.45 ? v(sigmaX + sigmaSide / 2, SQ_TOP - sigmaSide / 2) : v(sigmaX + sigmaSide + 0.1, SQ_TOP - Math.max(sigmaSide, 0.3) / 2)} anchor={sigmaSide >= 0.45 ? 'middle' : 'start'} size={13.5}>
					<tspan fontStyle="italic" fontFamily={FONT_MATH}>
							σ
						</tspan>
					<tspan dy="-0.4em" fontSize="0.7em">
						2
					</tspan>
				</Text>
			</Drawing>
			<Readout>
				{lines.map((l) => (
					<Tex key={l}>{l}</Tex>
				))}
			</Readout>
			<Caption>
				Trascina i voti sulla retta. Le frecce sono gli scarti dalla media; sotto la retta ci sono i quadrati degli scarti, disegnati come quadrati veri, e quello tratteggiato ha per area
				la loro media, la varianza {`σ² = ${n(s2, 3)}`}, e per lato lo scarto quadratico medio. Allontana un solo voto dagli altri: la sua freccia si allunga, il suo quadrato cresce molto di più.
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setXs(LUCA)}>
						Voti di Luca
					</Button>
					<Button variant="secondary" size="sm" onClick={() => setXs(MARTA)}>
						Voti di Marta
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
