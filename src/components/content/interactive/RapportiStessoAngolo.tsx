'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls, Drawing, Figure, frame, Label, Readout, Tex, texNum, THICK, THIN, v } from './kit';

/**
 * Lesson 101, "I rapporti dipendono solo dall'angolo": the right triangle ABC (right angle in C, α in A, as in the
 * lesson) with two sliders, the angle α and the hypotenuse c. The sides change with both; the three ratios a/c, b/c
 * and a/b change only with α. The sides are shown in the lesson's units, 0.4 TikZ centimetres each.
 */

const U = 0.4; // TikZ centimetres per unit of length
const C_RANGE = [3, 12] as const; // 10 is the lesson's triangle 6, 8, 10
const f = frame(-0.55, C_RANGE[1] * U * Math.cos((10 * Math.PI) / 180) + 0.55, -0.55, C_RANGE[1] * U * Math.sin((80 * Math.PI) / 180) + 0.45);
const FILL = '#ebebff'; // blue!8

export default function RapportiStessoAngolo({ alt }: { alt?: string }) {
	const [alpha, setAlpha] = useState(37);
	const [c, setC] = useState(10);
	const t = (alpha * Math.PI) / 180;
	const a = c * Math.sin(t), b = c * Math.cos(t);
	const A = v(0, 0), C = v(b * U, 0), B = v(b * U, a * U);
	const r = Math.min(0.55, 0.45 * b * U);
	const sq = Math.min(0.18, 0.3 * a * U, 0.3 * b * U);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={f.pts(A, B, C)} fill={FILL} />
				<polygon points={f.pts(A, B, C)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<polyline points={f.right(C, v(-1, 0), v(0, 1), sq)} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.arc(A, v(1, 0), v(Math.cos(t), Math.sin(t)), r)} fill="none" stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v((r + 0.18) * Math.cos(t / 2), (r + 0.18) * Math.sin(t / 2))} size={12.75}>
					α
				</Label>
				<Label f={f} at={v(C.x, B.y / 2)} dir={v(1, 0)}>a</Label>
				<Label f={f} at={v(C.x / 2, 0)} dir={v(0, -1)}>b</Label>
				<Label f={f} at={v(B.x / 2, B.y / 2)} dir={v(-Math.sin(t), Math.cos(t))}>c</Label>
				<Label f={f} at={A} dir={v(-0.7, -0.7)}>A</Label>
				<Label f={f} at={B} dir={v(0.7, 0.7)}>B</Label>
				<Label f={f} at={C} dir={v(0.7, -0.7)}>C</Label>
			</Drawing>
			<Readout>
				<Tex>{`a = ${texNum(a, 2)}`}</Tex>
				<Tex>{`b = ${texNum(b, 2)}`}</Tex>
				<Tex>{`c = ${texNum(c, 2)}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`\\dfrac{a}{c} = ${texNum(a / c, 3)}`}</Tex>
				<Tex>{`\\dfrac{b}{c} = ${texNum(b / c, 3)}`}</Tex>
				<Tex>{`\\dfrac{a}{b} = ${texNum(a / b, 3)}`}</Tex>
			</Readout>
			<Caption>
				Ingrandisci il triangolo: i lati cambiano, i tre rapporti no. Cambiano solo se cambi <Tex>{'\\alpha'}</Tex>. Nel prossimo paragrafo questi rapporti prendono un nome: seno, coseno e tangente di <Tex>{'\\alpha'}</Tex>.
			</Caption>
			<Controls>
				<Slider label="Angolo α" value={alpha} min={10} max={80} step={1} unit="°" onChange={setAlpha} />
				<Slider label="Ipotenusa c" value={c} min={C_RANGE[0]} max={C_RANGE[1]} step={0.1} onChange={setC} />
			</Controls>
		</Figure>
	);
}
