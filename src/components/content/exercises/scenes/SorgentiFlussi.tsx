'use client';

import { Drawing, frame, v, K, THICK, TINT } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { QuantityText } from '@/components/content/interactive/fisica/liquidi';
import { COLD_FILL, HEAT, HOT_FILL, Reservoir } from '@/components/content/interactive/fisica/sorgenti';
import type { SceneProps } from '.';

/**
 * Two heat reservoirs side by side, joined by a bar, with the heat that goes from the hot one to the cold one
 * (lesson 118, the entropy of the universe), drawn like the lesson's TikZ figure `calore-due-sorgenti-entropia`. All
 * texts are written by the generator ('400 K', '1200 J'); the drawing is the same whatever the numbers. A machine
 * between two reservoirs is group 43's scene `macchina-termica`.
 *
 *   { type: 'sorgenti-calore', data: { tc: '400 K', tf: '300 K', q: '1200 J' } }
 */
const s = (x: unknown) => (typeof x === 'string' ? x : '');
const f = frame(-0.2, 6.6, -0.25, 2.15);

export default function SorgentiFlussi({ data, alt }: SceneProps) {
	const a = f.px(v(2, 0.85));
	const q = s(data.q);
	return (
		<Drawing f={f} label={alt}>
			<rect x={a.x} y={a.y} width={2.4 * K} height={0.3 * K} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<Reservoir f={f} at={v(1, 0.7)} w={2} h={1.4} fill={HOT_FILL} second={s(data.tc)}>
				calda
			</Reservoir>
			<Reservoir f={f} at={v(5.4, 0.7)} w={2} h={1.4} fill={COLD_FILL} second={s(data.tf)}>
				fredda
			</Reservoir>
			<Arrow f={f} from={v(2.5, 1.25)} to={v(3.9, 1.25)} color={HEAT} />
			<QuantityText f={f} at={v(3.2, 1.7)} text={q ? `Q = ${q}` : 'Q'} />
		</Drawing>
	);
}
