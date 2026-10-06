'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, TINT, THIN, THICK, VERY_THIN, DASH, FONT } from '../kit';
import { Arrow, QTY } from '../fisica';

/**
 * Lesson 81 (L'impulso e il teorema dell'impulso), example 3: a passenger of 72 kg travelling at 15 m/s is stopped,
 * so the impulse is fixed, 1080 N·s. The student picks how long the stop lasts, from 0,02 to 0,30 s, and the graph of
 * the mean force against time shows a rectangle of that base whose area never changes: 54 kN at 0,02 s, 3,6 kN at
 * 0,30 s. A dashed outline keeps the rectangle of the airbag of the example (0,15 s, 7,2 kN) for comparison, and the
 * readout says how many times the passenger's weight (706 N) the force is. Scale: 18 cm per second, 0,06 cm per kN.
 */

const M = 72;
const V0 = 15;
const DP = M * V0; // 1080 N·s
const WEIGHT = M * 9.8;
const SX = 18; // cm per second
const SY = 0.06; // cm per kN
const f = frame(-0.95, 6.8, -0.8, 4.35);
const fx = (x: number, d: number) => x.toFixed(d).replace('.', ',');
const tex = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

export default function ImpulsoTempoArresto({ alt }: { alt?: string }) {
	const [dt, setDt] = useState(0.15);
	const F = DP / dt; // N
	const kN = F / 1000;
	const a = f.px(v(0, kN * SY)), b = f.px(v(dt * SX, 0));

	const grid: string[] = [];
	const ticks: string[] = [];
	for (let i = 1; i <= 6; i++) {
		grid.push(f.path([v(i * 0.05 * SX, 0), v(i * 0.05 * SX, 60 * SY)]));
		ticks.push(f.path([v(i * 0.05 * SX, 0.06), v(i * 0.05 * SX, -0.06)]));
	}
	for (let k = 10; k <= 60; k += 10) {
		grid.push(f.path([v(0, k * SY), v(0.3 * SX, k * SY)]));
		ticks.push(f.path([v(0.06, k * SY), v(-0.06, k * SY)]));
	}
	const text = (x: number, y: number, s: string, anchor: 'middle' | 'end', dy: string) => {
		const q = f.px(v(x, y));
		return (
			<text key={`${s}-${anchor}`} x={q.x} y={q.y} dy={dy} textAnchor={anchor} fontSize={11} fontFamily={FONT}>
				{s}
			</text>
		);
	};

	const caption = `Fermato in ${fx(dt, 2)} s, il passeggero subisce una forza media di ${fx(kN, 1)} kN, ${fx(F / WEIGHT, 1)} volte il suo peso. L'area del rettangolo è sempre 1080 N·s: con metà del tempo la forza raddoppia.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={VERY_THIN} fill="none" />
				<rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={TINT.orange} stroke={QTY.forza} strokeWidth={THICK} />
				{/* the airbag of the example, for comparison */}
				<path d={f.path([v(0, 7.2 * SY), v(0.15 * SX, 7.2 * SY), v(0.15 * SX, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{[0.1, 0.2, 0.3].map((t) => text(t * SX, -0.12, fx(t, 2), 'middle', '0.8em'))}
				{[20, 40, 60].map((k) => text(-0.13, k * SY, String(k), 'end', '0.35em'))}
				<Arrow f={f} from={v(-0.3, 0)} to={v(5.75, 0)} weight="thin" />
				<Arrow f={f} from={v(0, -0.3)} to={v(0, 3.95)} weight="thin" />
				<Label f={f} at={v(5.75, 0)} dir={v(1, 0)} size={13}>
					t
				</Label>
				<Label f={f} at={v(5.95, 0)} dir={v(1, 0)} upright size={11}>
					(s)
				</Label>
				<Label f={f} at={v(0, 3.98)} dir={v(0, 1)} size={13}>
					F
				</Label>
				<Label f={f} at={v(0.22, 3.98)} dir={v(1, 1)} upright size={11}>
					(kN)
				</Label>
				<Label f={f} at={kN > 45 ? v(dt * SX + 0.1, 3.0) : v(0.15, kN * SY + 0.08)} dir={kN > 45 ? v(1, 0) : v(1, 1)} upright size={12}>
					{`${fx(kN, 1)} kN per ${fx(dt, 2)} s`}
				</Label>
			</Drawing>

			<Readout>
				<Tex>{`I = \\Delta p = 72\\,\\text{kg} \\cdot 15\\,\\text{m/s} = 1080\\,\\text{N}\\cdot\\text{s}`}</Tex>
				<Tex>{`F_m = \\dfrac{\\Delta p}{\\Delta t} = ${tex(kN, 1)}\\,\\text{kN}`}</Tex>
				<Tex>{`\\dfrac{F_m}{m g} = ${tex(F / WEIGHT, 1)}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Durata Δt (s)" value={dt} min={0.02} max={0.3} step={0.01} onChange={(x) => setDt(Math.round(x * 100) / 100)} />
			</Controls>
		</Figure>
	);
}
