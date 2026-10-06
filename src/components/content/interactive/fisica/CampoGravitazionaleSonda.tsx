'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Label, Handle, frame, v, len, scale, unit, polar, clamp, texNum, num, TINT, THICK, THIN, DASH, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { km } from './gravita';

/**
 * Lesson 95 (Il campo gravitazionale, group 37): the Earth and a probe the student drags around it, from the surface
 * to four Earth radii from the centre. The green arrow on the probe is the field there, always towards the centre, to
 * scale (0,11 cm per N/kg, so that at the surface it stays inside the planet); dashed circles mark 2, 3 and 4 radii. The readout gives the distance from the centre in radii and in kilometres, the height, the field
 * g = g0 (R_T / r)² with g0 = 9,8 N/kg, and its fraction of g0. The question of the lesson: where is the field a
 * quarter of the one on the ground, and where a half?
 *
 * Drawn at 1,1 cm per Earth radius.
 */

const RE = 1.1;
const G0 = 9.8;
const RT_KM = 6370;
const KG = 0.11;
const MAX = 4;
const HALF = MAX * RE + 0.4;
const f = frame(-HALF, HALF, -HALF, HALF);
const O = v(0, 0);
const GRAY = '#999999';

export default function CampoGravitazionaleSonda({ alt }: { alt?: string }) {
	const [p, setP] = useState<V>(polar(2 * RE, Math.PI / 6));

	const move = (q: V) => {
		const d = len(q) < 1e-6 ? v(1, 0) : unit(q);
		// The distance snaps to a twentieth of a radius, so that 2 and 1,4 radii can be reached exactly.
		const n = Math.round(clamp(len(q) / RE, 1, MAX) * 20) / 20;
		setP(scale(d, n * RE));
	};

	const n = len(p) / RE;
	const g = G0 / (n * n);
	const inward = scale(unit(p), -1);
	const tip = v(p.x + inward.x * g * KG, p.y + inward.y * g * KG);
	const side = v(-inward.y, inward.x);
	const circle = (k: number, dashed: boolean) => (
		<circle key={k} cx={f.px(O).x} cy={f.px(O).y} r={k * RE * (f.W / (f.x1 - f.x0))} fill={dashed ? 'none' : TINT.blue} stroke={dashed ? GRAY : '#000'} strokeWidth={dashed ? THIN : THICK} strokeDasharray={dashed ? DASH : undefined} />
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{[2, 3, 4].map((k) => circle(k, true))}
				{[2, 3, 4].map((k) => (
					<Label key={k} f={f} at={polar(k * RE, -Math.PI / 2)} dir={v(0, 1)} upright size={11} color={GRAY}>
						{k} R<tspan fontSize={8} dy={3}>T</tspan>
					</Label>
				))}
				<path d={f.path([O, p])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				{circle(1, false)}
				<Label f={f} at={v(0, -0.05)} upright size={12}>Terra</Label>
				<Arrow f={f} from={p} to={tip} color={QTY.accelerazione} />
				{g * KG > 0.12 && <VecLabel f={f} at={v((p.x + tip.x) / 2, (p.y + tip.y) / 2)} dir={side} name="g" color={QTY.accelerazione} />}
				<Handle f={f} at={p} onMove={move} label="La sonda" step={RE / 20} />
			</Drawing>

			<Readout>
				<Tex>{`r = ${texNum(n, 2)}\\,R_T = ${km(n * RT_KM)}\\,\\text{km}`}</Tex>
				<Tex>{`h = ${km((n - 1) * RT_KM)}\\,\\text{km}`}</Tex>
				<Tex>{`g = ${texNum(g, g < 1 ? 3 : 2)}\\,\\text{N/kg}`}</Tex>
				<Tex>{`\\dfrac{g}{g_0} = ${texNum((100 * g) / G0, 1)}\\,\\%`}</Tex>
			</Readout>
			<Caption>
				{n < 1.001
					? 'La sonda è al suolo: il campo vale 9,8 N/kg. Trascinala lontano dalla Terra.'
					: `A ${num(n, 2)} raggi terrestri dal centro il campo è 9,8 diviso per ${num(n, 2)} al quadrato, cioè ${num(g, g < 1 ? 3 : 2)} N/kg: la direzione cambia con il punto, ma la freccia punta sempre verso il centro.`}
			</Caption>
		</Figure>
	);
}
