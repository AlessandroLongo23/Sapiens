'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, texNum, THIN, DASH } from '../kit';
import { Ball, Vector, QTY } from '../fisica';

/**
 * Lesson 94 (La legge di gravitazione universale), group 36: two planets on a line and the pair of forces between
 * them. The student sets the two masses (1 to 2 · 10²⁴ kg) and the distance between the centres (1 to 3 · 10⁸ m,
 * drawn 1,6 cm each); F = G m₁ m₂ / r² = 6,67 · m₁ m₂ / r² · 10²¹ N. The two arrows are always equal, 1,1 cm for
 * each 6,67 · 10²¹ N: the one on the left planet is drawn just above the line of the centres and the one on the
 * right planet just below, so that they can pass each other when the force is large. The balls' radii grow with the
 * cube root of the mass.
 */

const S = 1.6; // cm for 10⁸ m
const KF = 1.1; // cm for m₁ m₂ / r² = 1
const OFF = 0.42;
const f = frame(-3.75, 3.75, -1.55, 1.3);

/** x as a · 10ⁿ with three significant figures, for <Tex>. */
function sciTex(x: number) {
	let n = Math.floor(Math.log10(x));
	let a = Number((x / 10 ** n).toFixed(2));
	if (a >= 10) {
		a /= 10;
		n += 1;
	}
	return `${a.toFixed(2).replace('.', '{,}')} \\cdot 10^{${n}}`;
}

export default function GravitazioneDueMasse({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(2);
	const [m2, setM2] = useState(1);
	const [r, setR] = useState(1.5);

	const k = (m1 * m2) / (r * r);
	const F = 6.67e21 * k;
	const A = v((-r * S) / 2, 0);
	const B = v((r * S) / 2, 0);
	const radius = (m: number) => 0.2 * Math.cbrt(m);
	const L = k * KF;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([A, B])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Ball f={f} at={A} r={radius(m1)} />
				<Ball f={f} at={B} r={radius(m2)} />
				<Vector f={f} from={v(A.x, OFF)} to={v(A.x + L, OFF)} color={QTY.forza} name="F" sub="1" labelAt={0} labelDir={v(-1, 0)} />
				<Vector f={f} from={v(B.x, -OFF)} to={v(B.x - L, -OFF)} color={QTY.forza} name="F" sub="2" labelAt={0} labelDir={v(1, 0)} />
				<path d={`${f.path([v(A.x, -1.05), v(B.x, -1.05)])} ${f.path([v(A.x, -0.97), v(A.x, -1.13)])} ${f.path([v(B.x, -0.97), v(B.x, -1.13)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(0, -1.05)} dir={v(0, -1)}>r</Label>
			</Drawing>

			<Readout>
				<Tex>{`m_1 = ${texNum(m1, 2)} \\cdot 10^{24}\\,\\text{kg}`}</Tex>
				<Tex>{`m_2 = ${texNum(m2, 2)} \\cdot 10^{24}\\,\\text{kg}`}</Tex>
				<Tex>{`r = ${texNum(r, 2)} \\cdot 10^{8}\\,\\text{m}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`F_1 = F_2 = G\\,\\dfrac{m_1 m_2}{r^2} = ${sciTex(F)}\\,\\text{N}`}</Tex>
			</Readout>
			<Caption>Le due forze hanno sempre lo stesso modulo, anche quando le masse sono diverse. Una massa doppia raddoppia la forza; una distanza doppia la riduce a un quarto, una tripla a un nono.</Caption>

			<Controls>
				<Slider label="Massa m₁" value={m1} min={1} max={2} step={0.5} onChange={setM1} />
				<Slider label="Massa m₂" value={m2} min={1} max={2} step={0.5} onChange={setM2} />
				<Slider label="Distanza r" value={r} min={1} max={3} step={0.5} onChange={setR} />
			</Controls>
		</Figure>
	);
}
