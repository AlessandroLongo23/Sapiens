'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls, Drawing, Figure, frame, Label, Readout, Tex, texNum, THICK, THIN, TINT, DASH, v, type V } from '../kit';

/**
 * Lesson "Incertezza relativa e propagazione delle incertezze" (fis-incertezza-relativa), section "Prodotti e
 * quozienti": the rectangle of `rettangolo-incertezza-area`, with sliders for the sides a, b and their uncertainties
 * Δa, Δb (centimetres, drawn at 0.6 of their size). The orange strips b·Δa and a·Δb and the grey corner Δa·Δb show how much
 * the area can grow; the largest rectangle is dashed outside, the smallest dashed inside. Under the drawing: A = ab,
 * how far the largest and the smallest rectangle are from it (the strips plus or minus the corner), the rule's
 * b·Δa + a·Δb (exactly half their difference), and the relative uncertainty of the area as the sum of the sides'.
 */

const S = 0.6; // drawing centimetres per centimetre of the rectangle
const A_MAX = 8, B_MAX = 6, D_MAX = 1;
const f = frame(-0.75, (A_MAX + D_MAX) * S + 0.75, -0.7, (B_MAX + D_MAX) * S + 0.35);
const ORANGE = '#ffdfbf'; // orange!25
const CORNER = '#c9c9c9'; // gray!35
const SMALL = 13.5;

/** Rounds away binary noise: every quantity here has at most four decimals. */
const clean = (x: number) => Math.round(x * 1e4) / 1e4;

function Rect({ p, q, fill, stroke, width = THIN, dash }: { p: V; q: V; fill?: string; stroke?: string; width?: number; dash?: string }) {
	return <path d={f.path([v(p.x * S, p.y * S), v(q.x * S, p.y * S), v(q.x * S, q.y * S), v(p.x * S, q.y * S)], true)} fill={fill ?? 'none'} stroke={stroke ?? 'none'} strokeWidth={width} strokeDasharray={dash} />;
}

export default function RettangoloIncerto({ alt }: { alt?: string }) {
	const [a, setA] = useState(6);
	const [b, setB] = useState(4);
	const [da, setDa] = useState(0.6);
	const [db, setDb] = useState(0.5);

	const A = clean(a * b);
	const up = clean((a + da) * (b + db) - A);
	const down = clean(A - (a - da) * (b - db));
	const rule = clean(b * da + a * db);
	const corner = clean(da * db);
	const pct = (x: number) => `${texNum(x * 100, 1)}\\%`;
	const ea = da / a, eb = db / b;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Rect p={v(0, 0)} q={v(a, b)} fill={TINT.blue} />
				<Rect p={v(a, 0)} q={v(a + da, b)} fill={ORANGE} />
				<Rect p={v(0, b)} q={v(a, b + db)} fill={ORANGE} />
				<Rect p={v(a, b)} q={v(a + da, b + db)} fill={CORNER} />
				<Rect p={v(0, 0)} q={v(a, b)} stroke="#000" width={THICK} />
				<Rect p={v(0, 0)} q={v(a + da, b + db)} stroke="#000" dash={DASH} />
				{da > 0 && db > 0 && <Rect p={v(0, 0)} q={v(a - da, b - db)} stroke="#000" dash={DASH} />}
				<Label f={f} at={v((a * S) / 2, 0)} dir={v(0, -1)}>a</Label>
				<Label f={f} at={v(0, (b * S) / 2)} dir={v(-1, 0)}>b</Label>
				{da > 0 && (
					<Label f={f} at={v((a + da / 2) * S + 0.12, 0)} dir={v(0.4, -1)} size={SMALL}>
						Δa
					</Label>
				)}
				{db > 0 && (
					<Label f={f} at={v((a + da) * S, (b + db / 2) * S)} dir={v(1, 0)} size={SMALL}>
						Δb
					</Label>
				)}
			</Drawing>
			<Readout>
				<span>
					<Tex>{`A = a \\cdot b = ${texNum(A)}\\ \\text{cm}^2`}</Tex>
				</span>
				<span>
					<Tex>{`A_{\\max} - A = ${texNum(up)}\\ \\text{cm}^2`}</Tex>
				</span>
				<span>
					<Tex>{`A - A_{\\min} = ${texNum(down)}\\ \\text{cm}^2`}</Tex>
				</span>
				<span>
					<Tex>{`\\Delta A = b \\cdot \\Delta a + a \\cdot \\Delta b = ${texNum(rule)}\\ \\text{cm}^2`}</Tex>
				</span>
				<span>
					<Tex>{`\\varepsilon_a \\approx ${pct(ea)}`}</Tex>
				</span>
				<span>
					<Tex>{`\\varepsilon_b \\approx ${pct(eb)}`}</Tex>
				</span>
				<span>
					<Tex>{`\\varepsilon_A = \\frac{\\Delta A}{A} = \\varepsilon_a + \\varepsilon_b \\approx ${pct(rule / A)}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{corner > 0
					? `Il quadratino grigio, di area ${texNum(corner).replace('{,}', ',')} cm², si aggiunge al rettangolo più grande e si toglie dal più piccolo: la regola lo trascura e dà proprio la metà della differenza tra i due, cioè la media di ${texNum(up).replace('{,}', ',')} e ${texNum(down).replace('{,}', ',')}.`
					: 'Con una sola incertezza non c’è quadratino d’angolo: la regola dà esattamente di quanto può cambiare l’area.'}
			</Caption>
			<Controls>
				<Slider label="Lato a" value={a} min={3} max={A_MAX} step={0.1} unit="cm" onChange={setA} />
				<Slider label="Lato b" value={b} min={2} max={B_MAX} step={0.1} unit="cm" onChange={setB} />
				<Slider label="Incertezza Δa" value={da} min={0} max={D_MAX} step={0.1} unit="cm" onChange={setDa} />
				<Slider label="Incertezza Δb" value={db} min={0} max={D_MAX} step={0.1} unit="cm" onChange={setDb} />
			</Controls>
		</Figure>
	);
}
