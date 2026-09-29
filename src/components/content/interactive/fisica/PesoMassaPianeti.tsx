'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, texNum, useTween, TINT, THICK, THIN, FONT } from '../kit';
import { Ground } from '../fisica';
import { Dinamometro, dinamometroGeometry } from './Dinamometro';

/**
 * Lesson 17 (La forza-peso e la massa), "Come si misurano il peso e la massa": the same bag, of mass m, hangs from a
 * spring balance and sits on a two-pan balance, on the Earth, the Moon, Mars or Jupiter (g from the NASA Planetary
 * Fact Sheet, as in the lesson's table). The spring balance reads P = m g, which changes from place to place; the
 * two-pan balance stays level with the same standard masses (0,5 kg each), because both pans weigh g times their
 * mass. The balance of 50 N and 25 divisions holds 2 kg on Jupiter (46,2 N).
 */

type Body = 'terra' | 'luna' | 'marte' | 'giove';
const BODIES: Record<Body, { name: string; g: number; on: string }> = {
	terra: { name: 'Terra', g: 9.8, on: 'sulla Terra' },
	luna: { name: 'Luna', g: 1.6, on: 'sulla Luna' },
	marte: { name: 'Marte', g: 3.7, on: 'su Marte' },
	giove: { name: 'Giove', g: 23.1, on: 'su Giove' }
};
const PORTATA = 50;
const SCALE = 2.5;
const RING = v(0, 0);
const BAG = { w: 0.7, h: 0.6 };

const low = dinamometroGeometry({ ring: RING, portata: PORTATA, forza: 2 * 23.1, scaleLen: SCALE }).hookBottom.y - 0.3 - BAG.h - 0.15;
const f = frame(-1.05, 5.25, low, 0.55);

// The two-pan balance: stand on the ground at the bottom, beam at PIVOT, pans hanging 1,4 cm under the beam's ends.
const FLOOR = low + 0.15;
const PIVOT = v(3.25, FLOOR + 3.0);
const ARM = 1.25;
const PAN_Y = PIVOT.y - 1.4;
const PAN_HALF = 0.7;

function Bag({ x, y, label = true }: { x: number; y: number; label?: boolean }) {
	return (
		<>
			<path d={f.path([v(x - BAG.w / 2, y), v(x + BAG.w / 2, y), v(x + BAG.w / 2, y + BAG.h), v(x - BAG.w / 2, y + BAG.h)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
			{label && (
				<Label f={f} at={v(x, y + BAG.h / 2)}>
					m
				</Label>
			)}
		</>
	);
}

export default function PesoMassaPianeti({ alt }: { alt?: string }) {
	const [body, setBody] = useState<Body>('terra');
	const [m, setM] = useState(1);
	const g = BODIES[body].g;
	const P = m * g;
	const [shown, go] = useTween(P, 500);
	useEffect(() => {
		void go(P);
	}, [P, go]);

	const geo = dinamometroGeometry({ ring: RING, portata: PORTATA, forza: shown, scaleLen: SCALE });
	const bagTop = geo.hookBottom.y - 0.3;
	const standards = Math.round(m / 0.5);
	const left = v(PIVOT.x - ARM, PIVOT.y), right = v(PIVOT.x + ARM, PIVOT.y);
	const pan = (c: typeof left) => (
		<>
			<path d={f.path([c, v(c.x - PAN_HALF + 0.05, PAN_Y)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([c, v(c.x + PAN_HALF - 0.05, PAN_Y)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([v(c.x - PAN_HALF, PAN_Y), v(c.x + PAN_HALF, PAN_Y)])} stroke="#000" strokeWidth={THICK} fill="none" />
		</>
	);
	const stdW = 0.2, stdH = 0.28;
	const stdLabel = f.px(v(right.x, PAN_Y - 0.12));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Dinamometro f={f} ring={RING} portata={PORTATA} divisioni={25} ogni={5} forza={shown} scaleLen={SCALE} />
				<path d={f.path([geo.hookBottom, v(0, bagTop)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Bag x={0} y={bagTop - BAG.h} />

				<Ground f={f} from={v(PIVOT.x - 1.9, FLOOR)} to={v(PIVOT.x + 1.9, FLOOR)} />
				<path d={f.path([v(PIVOT.x - 0.4, FLOOR), v(PIVOT.x + 0.4, FLOOR), v(PIVOT.x + 0.08, FLOOR + 0.18), v(PIVOT.x + 0.08, PIVOT.y - 0.05), v(PIVOT.x - 0.08, PIVOT.y - 0.05), v(PIVOT.x - 0.08, FLOOR + 0.18)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([left, right])} stroke="#000" strokeWidth={THICK} fill="none" />
				<circle cx={f.px(PIVOT).x} cy={f.px(PIVOT).y} r={2.2} fill="#000" />
				{pan(left)}
				{pan(right)}
				<Bag x={left.x} y={PAN_Y} />
				{Array.from({ length: standards }, (_, i) => {
					const x0 = right.x - (standards * stdW + (standards - 1) * 0.05) / 2 + i * (stdW + 0.05);
					return <path key={i} d={f.path([v(x0, PAN_Y), v(x0 + stdW, PAN_Y), v(x0 + stdW, PAN_Y + stdH), v(x0, PAN_Y + stdH)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />;
				})}
				<text x={stdLabel.x} y={stdLabel.y} dy="0.75em" textAnchor="middle" fontSize={10.5} fontFamily={FONT}>
					{standards} × 0,5 kg
				</text>
			</Drawing>

			<Readout>
				<span>
					<Tex>{`m = ${texNum(m, 1)}`}</Tex> kg
				</span>
				<span>
					<Tex>{`g = ${texNum(g, 1)}`}</Tex> N/kg
				</span>
				<span>
					<Tex>{`P = m \\cdot g = ${texNum(P, 2)}`}</Tex> N
				</span>
			</Readout>
			<Caption>
				{body === 'terra' ? (
					<>
						Sulla Terra il sacchetto di {num(m, 1)} kg pesa {num(P, 2)} N. La bilancia a bracci uguali è in equilibrio con {standards} {standards === 1 ? 'massa' : 'masse'} da 0,5 kg.
					</>
				) : (
					<>
						{BODIES[body].on.charAt(0).toUpperCase() + BODIES[body].on.slice(1)} lo stesso sacchetto pesa {num(P, 2)} N, {g < 9.8 ? 'meno' : 'più'} che sulla Terra ({num(m * 9.8, 2)} N). La massa è sempre {num(m, 1)} kg: la bilancia resta in equilibrio con {standards === 1 ? 'la stessa massa campione' : `le stesse ${standards} masse campione`}.
					</>
				)}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Corpo celeste" options={(Object.keys(BODIES) as Body[]).map((k) => ({ value: k, label: BODIES[k].name }))} value={body} onChange={setBody} />
				</div>
				<Slider label="Massa (kg)" value={m} min={0.5} max={2} step={0.5} onChange={setM} />
			</Controls>
		</Figure>
	);
}
