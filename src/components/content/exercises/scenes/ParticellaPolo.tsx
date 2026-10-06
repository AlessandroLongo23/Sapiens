'use client';

import { Drawing, Label, frame, v, add, polar, THIN, DASH, FONT_SIZE } from '@/components/content/interactive/kit';
import { Ball, Point, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A particle P seen from a pole O (lesson 90, group 35): the position vector r from O to P, drawn horizontal and 3 cm
 * long, its dashed extension beyond P, and the velocity at `angolo` degrees from it (the angle φ between r and v),
 * with the arc of the angle. `testoR` ('2,5 m'), `testoV` ('4,0 m/s') and `testoAngolo` ('35°') are written beside
 * them. The scene draws the data, never the angular momentum.
 *
 *   { type: 'particella-polo', data: { angolo: 35, testoR: '2,5 m', testoV: '4,0 m/s', testoAngolo: '35°' } }
 */
const DEG = Math.PI / 180;

export default function ParticellaPolo({ data, alt }: SceneProps) {
	const deg = Math.min(160, Math.max(10, Number(data.angolo ?? 40)));
	const phi = deg * DEG;
	const O = v(0, 0);
	const P = v(3, 0);
	const tip = add(P, polar(1.5, phi));
	const f = frame(-0.5, 6.9, -0.6, 2.25);

	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([P, v(4.4, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<path d={f.arc(P, v(1, 0), polar(1, phi), 0.6)} stroke="#000" strokeWidth={THIN} fill="none" />
			<Vector f={f} from={O} to={P} color={QTY.vettore} name="r" labelAt={0.5} labelDir={v(0, 1)} />
			<Vector f={f} from={P} to={tip} color={QTY.velocita} name="v" />
			<Ball f={f} at={P} r={0.13} />
			<Point f={f} at={O} />
			<Label f={f} at={O} dir={v(-0.4, -1)}>
				O
			</Label>
			{typeof data.testoR === 'string' && (
				<Label f={f} at={v(1.5, 0)} dir={v(0, -1)} upright size={FONT_SIZE * 0.85}>
					{data.testoR}
				</Label>
			)}
			{typeof data.testoV === 'string' && (
				<Label f={f} at={add(tip, v(0.25, 0))} dir={v(1, 0)} upright size={FONT_SIZE * 0.85} color={QTY.velocita}>
					{`= ${data.testoV}`}
				</Label>
			)}
			{typeof data.testoAngolo === 'string' && (
				<Label f={f} at={add(P, polar(0.95, phi / 2))} dir={v(0.6, 0)} upright size={FONT_SIZE * 0.85}>
					{data.testoAngolo}
				</Label>
			)}
		</Drawing>
	);
}
