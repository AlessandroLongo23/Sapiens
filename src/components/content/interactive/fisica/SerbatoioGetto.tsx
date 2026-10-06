'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, Handle, frame, v, clamp, THIN, THICK, DASH, type V } from '../kit';
import { Arrow, Ground, QTY } from '../fisica';
import { LIQUID, Liquid, Surface, Vessel } from './liquidi';

/**
 * Lesson 100, "Il teorema di Torricelli e l'effetto Venturi": a tank on the ground, full of water up to 1,00 m, with
 * a hole in its right wall that the student drags (or sets with the slider) between 10 and 90 cm above the ground.
 * The water leaves at √(2 g h), h being the depth of the hole, and falls like a projectile thrown horizontally: it
 * lands 2√(h·y) away. The range is largest, 1,00 m, with the hole half way up, and two holes as far from the middle
 * (20 and 80 cm) reach the same spot. Drawn in scale, 3,6 cm per metre.
 */

const G = 9.8;
const H = 1; // m of water
const M = 3.6; // drawing centimetres per metre
const W = 2; // the tank's width, cm
const TOP = H * M + 0.45;

const f = frame(-W - 0.35, H * M + 0.75, -0.75, TOP + 0.2);

const fix = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

export default function SerbatoioGetto({ alt }: { alt?: string }) {
	const [cm, setCm] = useState(50);
	const y = cm / 100;
	const h = H - y;
	const speed = Math.sqrt(2 * G * h);
	const t = Math.sqrt((2 * y) / G);
	const x = speed * t;

	const hole = v(0, y * M);
	const jet: V[] = Array.from({ length: 41 }, (_, i) => {
		const s = (i / 40) * t;
		return v(speed * s * M, (y - 0.5 * G * s * s) * M);
	});
	const gap = 0.07;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[v(-W, H * M), v(-W, 0), v(0, 0), v(0, H * M)]} fill={LIQUID.acqua} />
				<Surface f={f} from={v(-W, H * M)} to={v(0, H * M)} />
				<Vessel f={f} paths={[[v(-W, TOP), v(-W, 0), v(0, 0), v(0, hole.y - gap)], [v(0, hole.y + gap), v(0, TOP)]]} />
				<Ground f={f} from={v(-W - 0.3, 0)} to={v(H * M + 0.7, 0)} />
				<path d={f.path(jet)} stroke="#3aa0d8" strokeWidth={3} fill="none" strokeLinecap="round" />
				{/* the depth of the hole and its height, on one line inside the tank */}
				<path d={f.path([v(-0.75, hole.y), v(0, hole.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
				<Arrow f={f} from={v(-0.6, (hole.y + H * M) / 2)} to={v(-0.6, H * M)} weight="thin" />
				<Arrow f={f} from={v(-0.6, (hole.y + H * M) / 2)} to={v(-0.6, hole.y)} weight="thin" />
				<Label f={f} at={v(-0.6, (hole.y + H * M) / 2)} dir={v(-1, 0)} size={14}>
					h
				</Label>
				<Arrow f={f} from={v(-0.6, hole.y / 2)} to={v(-0.6, hole.y)} weight="thin" />
				<Arrow f={f} from={v(-0.6, hole.y / 2)} to={v(-0.6, 0)} weight="thin" />
				<Label f={f} at={v(-0.6, hole.y / 2)} dir={v(-1, 0)} size={14}>
					y
				</Label>
				<Arrow f={f} from={v(0.08, hole.y + 0.28)} to={v(0.08 + speed * 0.3, hole.y + 0.28)} color={QTY.velocita} />
				{/* the farthest the jet can reach, and where it lands now */}
				<path d={f.path([v(H * M, -0.12), v(H * M, 0.12)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(H * M, -0.2)} dir={v(0, -1)} upright size={12}>
					1,00 m
				</Label>
				<Arrow f={f} from={v((x * M) / 2, -0.32)} to={v(x * M, -0.32)} weight="thin" />
				<Arrow f={f} from={v((x * M) / 2, -0.32)} to={v(0, -0.32)} weight="thin" />
				<Label f={f} at={v(Math.min((x * M) / 2, H * M - 1.3), -0.28)} dir={v(0, -1)} size={14}>
					x
				</Label>
				<Handle f={f} at={hole} label="Foro nella parete" onMove={(q) => setCm(clamp(Math.round((q.y / M) * 20) * 5, 10, 90))} step={0.05 * M} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`h = ${fix(h, 2)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`v = \\sqrt{2\\,g\\,h} = ${fix(speed, 2)}\\,\\text{m/s}`}</Tex>
				</span>
				<span>
					<Tex>{`t = ${fix(t, 2)}\\,\\text{s}`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`x = 2\\sqrt{h \\cdot y} = ${fix(x, 2)}\\,\\text{m}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{cm === 50
					? 'Con il foro a metà altezza il getto arriva più lontano che da ogni altro punto: a un metro.'
					: cm > 50
						? 'Foro in alto: il getto ha tempo per cadere, ma esce piano.'
						: 'Foro in basso: il getto esce veloce, ma tocca terra quasi subito.'}{' '}
				Trascina il foro lungo la parete.
			</Caption>

			<Controls>
				<Slider label="Altezza del foro (cm)" value={cm} min={10} max={90} step={5} onChange={setCm} />
			</Controls>
		</Figure>
	);
}
