'use client';

import { Drawing, frame, v } from '@/components/content/interactive/kit';
import { Hit, Target } from '@/components/content/interactive/fisica/BersaglioErrori';
import type { SceneProps } from '.';

/**
 * A target with the shots of an exercise, drawn like the lesson's `bersagli-precisione-accuratezza` and the
 * interactive `bersaglio-errori` (fis-errori-misura). The shots are in units of the outer radius, centre at the
 * origin; the target is drawn with an outer radius of 1.4 cm. It draws the data only: whether the shots are precise
 * or accurate is for the student to say.
 *
 *   { type: 'bersaglio', data: { colpi: [[0.42, 0.35], [0.47, 0.31], ...] } }
 */
const R = 1.4;

export default function Bersaglio({ data, alt }: SceneProps) {
	const shots = ((data.colpi as [number, number][] | undefined) ?? []).filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));
	// The frame holds the target and any shot that falls outside it.
	const reach = Math.max(1, ...shots.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) * R + 0.2;
	const f = frame(-reach, reach, -reach, reach);
	return (
		<Drawing f={f} label={alt}>
			<Target f={f} R={R} />
			{shots.map(([x, y], i) => (
				<Hit key={i} f={f} at={v(x * R, y * R)} />
			))}
		</Drawing>
	);
}
