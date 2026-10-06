'use client';

import { Drawing, frame, v, add, polar, K, THICK, THIN } from '@/components/content/interactive/kit';
import { Arrow, QTY } from '@/components/content/interactive/fisica';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * A few molecules in a box, each with the arrow of its velocity and its speed written beside it (third year, group
 * 40: fis-teoria-cinetica, the root-mean-square speed of a few molecules). The arrows are to scale, the fastest one
 * 1,1 cm long; places and directions depend only on the molecule's index, so the server and the browser draw the
 * same. Up to six molecules.
 *
 *   { type: 'molecole-velocita', data: { velocita: [300, 450, 520] } }   // metres per second
 *
 * The scene draws the data: the speeds, not their mean.
 */
const W = 6.2, H = 2.9;
const f = frame(-0.2, W + 0.2, -0.2, H + 0.2);
/** The direction of each arrow, in degrees, and whether the molecule sits in the upper or in the lower row. */
const DIRECTION = [20, 205, 335, 160, 40, 190];
const R = 0.09;

export default function MolecoleVelocita({ data, alt }: SceneProps) {
	const speeds = (Array.isArray(data.velocita) ? (data.velocita as unknown[]) : []).map(Number).filter((x) => x > 0).slice(0, 6);
	if (!speeds.length) return <p className="sr-only">{alt}</p>;
	const top = Math.max(...speeds);
	const cell = W / speeds.length;
	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(0, 0), v(W, 0), v(W, H), v(0, H)], true)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			{speeds.map((speed, i) => {
				const up = i % 2 === 0;
				const angle = (DIRECTION[i] * Math.PI) / 180;
				const length = (speed / top) * 1.1;
				// the arrow is centred in its cell, so that neither end leaves it
				const centre = v(cell * (i + 0.5), up ? H * 0.7 : H * 0.36);
				const from = add(centre, polar(-length / 2, angle));
				const to = add(centre, polar(length / 2, angle));
				const p = f.px(from);
				return (
					<g key={i}>
						<Arrow f={f} from={from} to={to} color={QTY.velocita} />
						<circle cx={p.x} cy={p.y} r={R * K} fill="#b3b3ff" stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(centre.x, centre.y - 0.62)} size={13}>
							{speed} m/s
						</Words>
					</g>
				);
			})}
		</Drawing>
	);
}
