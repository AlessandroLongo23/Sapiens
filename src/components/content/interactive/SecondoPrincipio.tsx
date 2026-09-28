'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, clamp, Controls, DOTTED, Drawing, Figure, frame, Readout, Tex, texNum, v } from './kit';
import { EndDot, Grip, HLine, Line, n, Text, Tick, xc } from './retta';

/**
 * Lesson 52, "Secondo principio": the true inequality 2 < 5 multiplied by k. The points 2k and 5k slide along the
 * line; while k > 0 they keep their order, at k = 0 they meet in 0, and for k < 0 they have swapped places, which is
 * why the inequality turns from < into >.
 */

const U = 0.27; // cm per unit
const R = 16; // the line reaches ±16, since 5k goes from −15 to 15
const KMAX = 3;
const X = (t: number) => t * U;
const f = frame(X(-R) - 0.35, X(R) + 0.45, -0.6, 1.45);
const BLUE = xc('blue', 60);
const ORANGE = xc('orange', 80, 'black');

export default function SecondoPrincipio({ alt }: { alt?: string }) {
	const [k, setK] = useState(3);
	const snap = (x: number) => clamp(Math.round(x * 10) / 10, -KMAX, KMAX);
	const p = 2 * k, q = 5 * k;
	const sign = k > 0 ? '<' : k < 0 ? '>' : '=';

	const tk = k < 0 ? `(${texNum(k)})` : texNum(k);
	const eq = k === 0 ? `2 \\cdot 0 = 0 \\qquad 5 \\cdot 0 = 0` : `2 \\cdot ${tk} = ${texNum(p)} \\; ${sign} \\; ${texNum(q)} = 5 \\cdot ${tk}`;
	const what =
		k > 0
			? 'Per un numero positivo i due punti restano nello stesso ordine: 2k è a sinistra di 5k, e il verso resta <.'
			: k < 0
				? 'Per un numero negativo i due punti si sono scambiati di posto: 2k ora è a destra di 5k, e il verso diventa >.'
				: 'Con k = 0 i due punti finiscono tutti e due in 0 e la disuguaglianza sparisce: per questo non si moltiplica per 0.';

	const ticks = Array.from({ length: 2 * R + 1 }, (_, i) => i - R);
	// The labels stand at two heights, so they never cover each other when the points are close.
	const tag = (x: number, h: number, text: string, colour: string) => (
		<>
			<Line f={f} from={v(X(x), 0.12)} to={v(X(x), h - 0.12)} dash={DOTTED} color={colour} />
			<Text f={f} at={v(X(x), h)} baseline="bottom" italic color={colour}>
				{text}
			</Text>
		</>
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<HLine f={f} x0={X(-R - 0.6)} x1={X(R + 1)} arrow />
				{ticks.map((t) => (
					<g key={t}>
						<Tick f={f} x={X(t)} h={t % 5 === 0 ? 0.08 : 0.04} />
						{t % 5 === 0 && (
							<Text f={f} at={v(X(t), -0.16)} baseline="top">
								{n(t)}
							</Text>
						)}
					</g>
				))}
				{tag(p, 0.55, '2k', BLUE)}
				{tag(q, 1.05, '5k', ORANGE)}
				<Grip f={f} at={v(X(q), 0)} onMove={(pt) => setK(snap(pt.x / U / 5))} label={`Il punto 5k, che vale ${n(q)}`} step={U * 5 * 0.1} color={ORANGE}>
					<EndDot f={f} at={v(X(q), 0)} filled color={ORANGE} />
				</Grip>
				<Grip f={f} at={v(X(p), 0)} onMove={(pt) => setK(snap(pt.x / U / 2))} label={`Il punto 2k, che vale ${n(p)}`} step={U * 2 * 0.1} color={BLUE}>
					<EndDot f={f} at={v(X(p), 0)} filled color={BLUE} />
				</Grip>
			</Drawing>
			<Readout>
				<Tex>{eq}</Tex>
			</Readout>
			<Caption>Muovi il cursore k, o trascina uno dei due punti. {what}</Caption>
			<Controls>
				<Slider label="k" value={k} min={-KMAX} max={KMAX} step={0.1} onChange={(x) => setK(snap(x))} />
			</Controls>
		</Figure>
	);
}
