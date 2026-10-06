'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, THIN, THICK, TINT, FONT } from '../kit';
import { Arrow, QTY } from '../fisica';

/**
 * Lesson 77 (Il lavoro di una forza variabile), "Il lavoro come somma di tanti piccoli lavori": the graph of the force
 * against the stretch, from 0 to 40 cm, for a spring (F = k x with k = 80 N/m, 32 N at 40 cm) or for the sling of
 * example 3 (F = 32 N · [1 − (1 − x/40 cm)²]). The stretch is cut into N equal pieces (1 to 40) and under the graph
 * stands one rectangle per piece, as tall as the force at the start of the piece. The readout gives the length of a
 * piece, the sum of the rectangles and the area under the graph (6,4 J for the spring, 8,53 J for the sling), which
 * the sum approaches as N grows.
 * Scale: 0,12 cm per cm of stretch, 0,09 cm per newton.
 */

const SX = 0.12;
const SF = 0.09;
const X_MAX = 40; // cm
const F_MAX = 32; // N
const f = frame(-0.95, X_MAX * SX + 1.0, -0.8, F_MAX * SF + 0.75);

type Shape = 'molla' | 'fionda';
const FORCE: Record<Shape, (x: number) => number> = {
	molla: (x) => (F_MAX * x) / X_MAX,
	fionda: (x) => F_MAX * (1 - (1 - x / X_MAX) ** 2)
};
const AREA: Record<Shape, number> = { molla: 0.5 * F_MAX * 0.4, fionda: (2 / 3) * F_MAX * 0.4 };

export default function LavoroRettangoli({ alt }: { alt?: string }) {
	const [shape, setShape] = useState<Shape>('molla');
	const [n, setN] = useState(4);

	const F = FORCE[shape];
	const dx = X_MAX / n;
	const heights = Array.from({ length: n }, (_, i) => F(i * dx));
	const sum = heights.reduce((s, h) => s + h * (dx / 100), 0);
	const exact = AREA[shape];
	const curve = f.path(Array.from({ length: 81 }, (_, i) => v((i / 2) * SX, F(i / 2) * SF)));

	const ticks: string[] = [];
	for (let c = 10; c <= X_MAX; c += 10) ticks.push(f.path([v(c * SX, 0.07), v(c * SX, -0.07)]));
	for (let k = 8; k <= F_MAX; k += 8) ticks.push(f.path([v(0.07, k * SF), v(-0.07, k * SF)]));

	const caption =
		n === 1
			? 'Con un solo tratto la forza si prende uguale a quella iniziale, che è zero: il rettangolo non c’è e la somma è zero. Aumenta i tratti.'
			: `Con ${n} tratti da ${num(dx, 1)} cm i rettangoli danno ${num(sum, 2)} J: mancano ${num(exact - sum, 2)} J all’area sotto il grafico, i triangolini rimasti scoperti. Più tratti, meno ne mancano.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{heights.map((h, i) =>
					h > 0 ? <path key={i} d={f.path([v(i * dx * SX, 0), v((i + 1) * dx * SX, 0), v((i + 1) * dx * SX, h * SF), v(i * dx * SX, h * SF)], true)} fill={TINT.orange} stroke="#000" strokeWidth={n > 20 ? 0.3 : THIN} strokeOpacity={0.55} /> : null
				)}
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{[10, 20, 30, 40].map((c) => {
					const q = f.px(v(c * SX, -0.36));
					return (
						<text key={`x${c}`} x={q.x} y={q.y} dy="0.35em" textAnchor="middle" fontSize={11} fontFamily={FONT}>
							{c}
						</text>
					);
				})}
				{[8, 16, 24, 32].map((k) => {
					const q = f.px(v(-0.14, k * SF));
					return (
						<text key={`y${k}`} x={q.x} y={q.y} dy="0.35em" textAnchor="end" fontSize={11} fontFamily={FONT}>
							{k}
						</text>
					);
				})}
				<Arrow f={f} from={v(-0.3, 0)} to={v(X_MAX * SX + 0.5, 0)} weight="thin" />
				<Arrow f={f} from={v(0, -0.3)} to={v(0, F_MAX * SF + 0.5)} weight="thin" />
				<Label f={f} at={v(X_MAX * SX + 0.5, 0)} dir={v(0, -1)} size={14}>
					x
				</Label>
				<Label f={f} at={v(X_MAX * SX + 0.5, -0.36)} dir={v(0, -1)} upright size={11}>
					(cm)
				</Label>
				<Label f={f} at={v(0, F_MAX * SF + 0.5)} dir={v(1, 0)} size={14}>
					F
				</Label>
				<Label f={f} at={v(0.35, F_MAX * SF + 0.5)} dir={v(1, 0)} upright size={11}>
					(N)
				</Label>
				<path d={curve} stroke={QTY.forza} strokeWidth={THICK} fill="none" />
			</Drawing>

			<Readout>
				<Tex>{`\\Delta x = ${texNum(dx, 1)}\\,\\text{cm}`}</Tex>
				<Tex>{`\\text{somma dei rettangoli} = ${texNum(sum, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`\\text{area} = ${texNum(exact, 2)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Numero di tratti" value={n} min={1} max={40} step={1} onChange={setN} />
				<ButtonRow>
					<ToggleGroup
						label="Forza"
						value={shape}
						onChange={setShape}
						options={[
							{ value: 'molla', label: 'Molla' },
							{ value: 'fionda', label: 'Fionda' }
						]}
					/>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
