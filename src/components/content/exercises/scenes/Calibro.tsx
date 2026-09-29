'use client';

import { Drawing, frame } from '@/components/content/interactive/kit';
import { NonioScala } from '@/components/content/interactive/fisica/CalibroNonio';
import type { SceneProps } from '.';

/**
 * The scales of a caliper up close, as the lesson "Gli strumenti di misura" draws them: the vernier's zero at
 * `lettura` mm, a decimal (`nonio: 10`) or twentieths (`nonio: 20`) vernier, the division that meets a main-scale tick
 * marked in orange with a triangle. The stretch of main scale drawn starts at the numbered centimetre before the
 * vernier's zero (or two millimetres before it) and holds the whole vernier, at most 6,9 cm wide: 0,42 cm per mm for the
 * decimal vernier and 0,29 for the other when there is room, less when the stretch is longer.
 *
 *   { type: 'calibro', data: { lettura: 23.7, nonio: 10 } }
 */
export default function Calibro({ data, alt }: SceneProps) {
	const n = Number(data.nonio) === 20 ? 20 : 10;
	const reading = Math.max(0, Number(data.lettura ?? 0));
	// From the numbered centimetre at or before the vernier's zero, so the whole millimetres can be counted from a number.
	const whole = Math.floor(reading + 1e-9);
	const from = Math.max(0, Math.min(whole - 2, 10 * Math.floor(whole / 10)));
	const to = Math.max(from + (n === 10 ? 15 : 24), whole + n + 2);
	const mm = Math.min(n === 10 ? 0.42 : 0.29, 6.9 / (to - from));
	const f = frame(-0.3, (to - from) * mm + 0.3, -1.1, 1.1);
	return (
		<Drawing f={f} label={alt}>
			<NonioScala f={f} reading={reading} n={n} from={from} to={to} mm={mm} />
		</Drawing>
	);
}
