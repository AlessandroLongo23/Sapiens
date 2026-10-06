'use client';

import { Drawing, Label, frame, v, add, sub, scale, unit, K, FONT_SIZE, THICK, THIN, DASH, TINT } from '@/components/content/interactive/kit';
import { Ball } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * An inner planet at its greatest elongation (lesson 92, group 36): the Sun S, the Earth T below it at 1 AU (drawn
 * 2,6 cm), the planet P on its dashed circular orbit at the point where the line of sight from the Earth is tangent
 * to the orbit, so that the triangle S P T has its right angle in P. `angolo` is the elongation in degrees (the
 * angle in T), `testo` what is written beside it. The distance S P is the unknown: it has only its letter.
 *
 *   { type: 'elongazione-pianeta', data: { angolo: 41, testo: '41°' } }
 */

const D = 2.6;
const S = FONT_SIZE * 0.85;

export default function ElongazionePianeta({ data, alt }: SceneProps) {
	const deg = Math.min(75, Math.max(8, Number(data.angolo ?? 30)));
	const th = (deg * Math.PI) / 180;
	// rounded, so that the server and the browser, whose sines may differ in the last digit, draw the same numbers
	const round = (x: number) => Math.round(x * 1000) / 1000;
	const r = round(D * Math.sin(th));
	const sun = v(0, 0), earth = v(0, -D);
	const planet = v(round(r * Math.cos(th)), round(-r * Math.sin(th)));
	const sight0 = unit(sub(planet, earth));
	const sight = v(round(sight0.x), round(sight0.y));
	const f = frame(-Math.max(r, 1.3) - 0.3, Math.max(r, 1.3) + 0.6, -D - 0.6, r + 0.3);
	const c = f.px(sun);
	const u0 = unit(sub(sun, planet));
	const u = v(round(u0.x), round(u0.y));

	return (
		<Drawing f={f} label={alt}>
			<circle cx={c.x} cy={c.y} r={Math.round(r * K * 100) / 100} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
			<path d={f.path([earth, add(planet, scale(sight, 0.7))])} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([sun, earth])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([sun, planet])} stroke="#000" strokeWidth={THICK} fill="none" />
			<polyline points={f.right(planet, u, scale(sight, -1), 0.18)} fill="none" stroke="#000" strokeWidth={THIN} />
			<path d={f.arc(earth, sight, v(0, 1), 0.55)} stroke="#000" strokeWidth={THIN} fill="none" />
			<Label f={f} at={add(add(earth, scale(sight, 0.7)), v(0.1, -0.12))} dir={v(1, 0)} upright size={S}>{typeof data.testo === 'string' ? data.testo : `${deg}°`}</Label>
			<Ball f={f} at={sun} r={0.16} fill={TINT.yellow} />
			<Label f={f} at={v(-0.16, 0)} dir={v(-1, 0)}>S</Label>
			<Ball f={f} at={earth} r={0.11} />
			<Label f={f} at={v(0, -D - 0.11)} dir={v(0, -1)}>T</Label>
			<Ball f={f} at={planet} r={0.09} fill={TINT.orange} />
			<Label f={f} at={planet} dir={v(1, 0.3)}>P</Label>
			<Label f={f} at={v(0, -(r + D) / 2)} dir={v(-1, 0)} upright size={S}>1 UA</Label>
			<Label f={f} at={scale(planet, 0.55)} dir={v(0.5, 0.9)}>r</Label>
		</Drawing>
	);
}
