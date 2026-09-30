'use client';

import { Drawing, frame, v, THICK, THIN } from '@/components/content/interactive/kit';
import { Words } from '@/components/content/interactive/fisica/calore';
import { PARTICLE } from '@/components/content/interactive/chimica/particelle-materia';
import type { SceneProps } from '.';

/**
 * Four square boxes of particles, A to D, two by two: the exercises on pure substances and mixtures
 * (chim-sostanze-miscugli, level 3) ask which box shows a pure substance, a homogeneous or a heterogeneous mixture.
 *
 *   { type: 'particelle-riquadri', data: { lato: 2.2, riquadri: [[[0.3, 0.2, 0], [0.6, 0.2, 1], ...], ...] } }
 *
 * Each particle is [x, y, kind] in centimetres inside a box of side `lato` (y upwards), kind 0, 1 or 2 drawn with the
 * fills of the lesson's figures (cyan, orange, green). Only the particles are drawn: the kind of box is the question.
 */
const R = 0.13;
const GAP = 0.55;

export default function ParticelleRiquadri({ data, alt }: SceneProps) {
	const side = Number(data.lato ?? 2.2);
	const boxes = (data.riquadri as [number, number, number][][] | undefined) ?? [];
	const fills = [PARTICLE.a, PARTICLE.b, PARTICLE.c];
	const f = frame(-0.15, 2 * side + GAP + 0.15, -0.15, 2 * side + 2 * GAP - 0.1);
	const pxcm = f.W / (f.x1 - f.x0);
	const origin = (i: number) => v((i % 2) * (side + GAP), (1 - Math.floor(i / 2)) * (side + GAP));
	return (
		<Drawing f={f} label={alt}>
			{boxes.slice(0, 4).map((ps, i) => {
				const o = origin(i);
				return (
					<g key={i}>
						<path d={f.path([o, v(o.x + side, o.y), v(o.x + side, o.y + side), v(o.x, o.y + side)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
						{ps.map(([x, y, k], j) => {
							const q = f.px(v(o.x + x, o.y + y));
							return <circle key={j} cx={q.x} cy={q.y} r={R * pxcm} fill={fills[k] ?? fills[0]} stroke="#000" strokeWidth={THIN} />;
						})}
						<Words f={f} at={v(o.x + side / 2, o.y + side + 0.22)} size={14}>
							{'ABCD'[i]}
						</Words>
					</g>
				);
			})}
		</Drawing>
	);
}
