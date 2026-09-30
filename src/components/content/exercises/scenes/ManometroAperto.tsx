'use client';

import { Drawing, frame, v, THICK, THIN, DASH, INK, TINT, FONT, FONT_MATH } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { LIQUID, Liquid, QuantityText, Surface } from '@/components/content/interactive/fisica/liquidi';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * Chemistry, lesson 30 (La pressione dei gas): a flask of gas joined to an open-tube mercury manometer, drawn as the
 * lesson's TikZ figure `pressione-manometro-aperto`. The mercury stands higher in the open branch (`lato: 'aperto'`,
 * the gas presses more than the air) or on the gas side (`lato: 'gas'`), by `dislivello` millimetres, drawn in scale
 * (1 cm of drawing for 180 mm, at most 1,4 cm). The difference in height carries the label `etichetta`; the air's
 * pressure p₀ presses into the open branch. The scene shows the data, not the gas's pressure.
 *
 *   { type: 'manometro-aperto', data: { dislivello: 38, lato: 'aperto', etichetta: 'Δh = 38 mm' } }
 */
export default function ManometroAperto({ data, alt }: SceneProps) {
	const dh = Math.min(1.4, Math.max(0.15, Number(data.dislivello ?? 50) / 180));
	const open = data.lato !== 'gas';
	const label = String(data.etichetta ?? '');
	// the U-tube: left branch from x = 1.9 to 2.15 (gas side), right branch from 2.85 to 3.1 (open), bottom at 0.2
	const mid = 1.3;
	const yl = open ? mid - dh / 2 : mid + dh / 2; // mercury on the gas side
	const yr = open ? mid + dh / 2 : mid - dh / 2; // mercury in the open branch
	const TOP = 2.9;
	const f = frame(-0.05, 5.9, -0.05, TOP + 0.55);
	const bulb = v(0.7, 2.2);
	const R = 0.6;
	const arc = (a0: number, a1: number) => {
		const n = 40;
		return Array.from({ length: n + 1 }, (_, i) => {
			const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
			return v(bulb.x + R * Math.cos(a), bulb.y + R * Math.sin(a));
		});
	};
	const px = f.W / (f.x1 - f.x0);
	const bp = f.px(bulb);
	return (
		<Drawing f={f} label={alt}>
			{/* gas: the flask, the tube and the left branch above the mercury */}
			<circle cx={bp.x} cy={bp.y} r={R * px} fill={TINT.blue} />
			<Liquid f={f} pts={[v(1.2, 2.05), v(2.15, 2.05), v(2.15, 2.3), v(1.2, 2.3)]} fill={TINT.blue} />
			<Liquid f={f} pts={[v(1.9, yl), v(2.15, yl), v(2.15, 2.3), v(1.9, 2.3)]} fill={TINT.blue} />
			{/* mercury */}
			<Liquid f={f} pts={[v(1.9, yl), v(1.9, 0.2), v(3.1, 0.2), v(3.1, yr), v(2.85, yr), v(2.85, 0.45), v(2.15, 0.45), v(2.15, yl)]} fill={LIQUID.mercurio} />
			<Surface f={f} from={v(1.9, yl)} to={v(2.15, yl)} />
			<Surface f={f} from={v(2.85, yr)} to={v(3.1, yr)} />
			{/* glass */}
			<path d={f.path(arc(9.6, 345.5))} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([v(1.29, 2.3), v(2.15, 2.3), v(2.15, 0.45), v(2.85, 0.45), v(2.85, TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<path d={f.path([v(1.28, 2.05), v(1.9, 2.05), v(1.9, 0.2), v(3.1, 0.2), v(3.1, TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<Words f={f} at={bulb} size={13}>
				gas
			</Words>
			{/* the difference in height */}
			<path d={f.path([v(2.15, Math.max(yl, yr)), v(3.75, Math.max(yl, yr))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<path d={f.path([v(2.15, Math.min(yl, yr)), v(3.75, Math.min(yl, yr))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<Arrow f={f} from={v(3.6, mid)} to={v(3.6, Math.max(yl, yr))} weight="thin" />
			<Arrow f={f} from={v(3.6, mid)} to={v(3.6, Math.min(yl, yr))} weight="thin" />
			{label && <QuantityText f={f} at={v(3.72, mid)} anchor="start" text={label} />}
			{/* the air presses into the open branch */}
			<Arrow f={f} from={v(2.975, TOP + 0.35)} to={v(2.975, TOP - 0.45)} color={INK.red} />
			<text x={f.px(v(3.12, TOP + 0.3)).x} y={f.px(v(3.12, TOP + 0.3)).y} dy="0.35em" fontSize={15} fill={INK.red} pointerEvents="none">
				<tspan fontFamily={FONT_MATH} fontStyle="italic">
					p
				</tspan>
				<tspan fontFamily={FONT} fontSize={10} dy={4}>
					0
				</tspan>
			</text>
		</Drawing>
	);
}
