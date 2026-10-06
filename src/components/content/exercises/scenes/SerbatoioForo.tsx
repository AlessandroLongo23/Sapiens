'use client';

import { Drawing, Label, frame, v, clamp, THIN, DASH } from '@/components/content/interactive/kit';
import { Arrow, Ground } from '@/components/content/interactive/fisica';
import { LIQUID, Liquid, QuantityText, Surface, Vessel } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * An open tank of water with a small hole in its right wall, for the exercises on Torricelli's theorem (physics,
 * third year, group 38). `livello` is the height of the water and `foro` the height of the hole, both from the bottom
 * and in the same unit: they are drawn in scale. The dimension lines drawn are those with a label in `etichette`:
 * `h` (from the free surface down to the hole), `H` (the whole water, on the left) and `y` (from the bottom up to the
 * hole). With `suolo` the tank stands on the ground and a "?" marks the distance asked for.
 *
 *   { type: 'serbatoio-foro', data: { livello: 1.25, foro: 0.45, suolo: true,
 *     etichette: { H: 'H = 1,25 m', y: 'y = 0,45 m' } } }
 *
 * Only the beginning of the jet is drawn, always the same: where it lands is the answer.
 */
export default function SerbatoioForo({ data, alt }: SceneProps) {
	const L = Number(data.livello ?? 1);
	const hole = clamp(Number(data.foro ?? L / 2) / L, 0.06, 0.94);
	const ground = Boolean(data.suolo);
	const lab = (data.etichette as Record<string, string> | undefined) ?? {};
	const W = 2.4, LEVEL = 2.8, TOP = 3.25;
	const y = hole * LEVEL;
	const gap = 0.07;
	const f = frame(lab.H ? -2.3 : -0.3, W + (ground ? 2.9 : 1.6), ground ? -1.05 : -0.3, TOP + 0.2);
	const dim = (x: number, y0: number, y1: number, text: string, anchor: 'start' | 'end') => (
		<>
			{Math.abs(y1 - y0) > 0.3 && (
				<>
					<Arrow f={f} from={v(x, (y0 + y1) / 2)} to={v(x, y1)} weight="thin" />
					<Arrow f={f} from={v(x, (y0 + y1) / 2)} to={v(x, y0)} weight="thin" />
				</>
			)}
			<QuantityText f={f} at={v(x + (anchor === 'start' ? 0.15 : -0.15), (y0 + y1) / 2)} anchor={anchor} text={text} />
		</>
	);
	// the first stretch of the jet, the same whatever the data
	const jet = Array.from({ length: 9 }, (_, i) => v(W + (i / 8) * 0.9, y - 0.35 * (i / 8) ** 2));
	return (
		<Drawing f={f} label={alt}>
			<Liquid f={f} pts={[v(0, LEVEL), v(0, 0), v(W, 0), v(W, LEVEL)]} fill={LIQUID.acqua} />
			<Surface f={f} from={v(0, LEVEL)} to={v(W, LEVEL)} />
			<Vessel f={f} paths={[[v(0, TOP), v(0, 0), v(W, 0), v(W, y - gap)], [v(W, y + gap), v(W, TOP)]]} />
			{ground && <Ground f={f} from={v(-0.25, 0)} to={v(W + 2.8, 0)} />}
			<path d={f.path(jet)} stroke="#3aa0d8" strokeWidth={3} fill="none" strokeLinecap="round" />
			<path d={f.path([v(0.5, y), v(W, y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
			{lab.h && dim(0.75, y, LEVEL, lab.h, 'start')}
			{lab.y && dim(0.75, 0, y, lab.y, 'start')}
			{lab.H && dim(-0.35, 0, LEVEL, lab.H, 'end')}
			{ground && (
				<>
					<Arrow f={f} from={v(W + 1.3, -0.38)} to={v(W + 2.6, -0.38)} weight="thin" />
					<Arrow f={f} from={v(W + 1.3, -0.38)} to={v(W, -0.38)} weight="thin" />
					<Label f={f} at={v(W + 1.3, -0.36)} dir={v(0, -1)} upright size={13}>
						x = ?
					</Label>
				</>
			)}
		</Drawing>
	);
}
