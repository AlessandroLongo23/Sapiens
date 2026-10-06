'use client';

import { Drawing, frame, v, clamp, THICK, THIN, DASH, TINT } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { Piston, QuantityText } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A gas in a vertical cylinder closed by a piston, for the exercises on the gas laws (physics, third year, group 39:
 * fis-legge-boyle, fis-leggi-gay-lussac), drawn like the TikZ figures of those lessons.
 *
 *   { type: 'cilindro-pistone', data: {
 *       altezza: 30, scala: 40,              // the piston's height and the height the cylinder can show, same unit
 *       corpo: true,                         // a body resting on the piston
 *       prima: 24,                           // a dashed line where the piston was (the solution's scene)
 *       caldo: true,                         // the gas tinted red instead of blue
 *       etichette: { h: 'h_1 = 30,0 cm', corpo: 'm = 4,0 kg', S: 'S = 20 cm²', gas: 'T_1 = 300 K' } } }
 *
 * The labels are plain text, written by the generator: the scene draws the data, not the answer.
 */
type Labels = { h?: string; corpo?: string; S?: string; gas?: string };

const CW = 2.2; // the cylinder's inside width
const HMAX = 3.4; // the tallest gas column the drawing holds
const TOP = HMAX + 1.15;

export default function CilindroPistone({ data, alt }: SceneProps) {
	const scala = Number(data.scala) > 0 ? Number(data.scala) : 1;
	const rel = (x: unknown) => clamp(Number(x) / scala, 0.12, 1) * HMAX;
	const h = rel(data.altezza);
	const labels = (data.etichette ?? {}) as Labels;
	const before = data.prima === undefined ? null : rel(data.prima);
	const f = frame(labels.h ? -2.75 : -0.4, CW + (labels.corpo ? 2.5 : 0.4), labels.S ? -0.75 : -0.25, TOP + 0.15);

	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(0, 0), v(CW, 0), v(CW, h), v(0, h)], true)} fill={data.caldo ? TINT.red : TINT.blue} />
			{before !== null && <path d={f.path([v(0, before), v(CW, before)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
			<path d={f.path([v(0, TOP), v(0, 0), v(CW, 0), v(CW, TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<Piston f={f} x0={0} x1={CW} y={h} h={0.22} />
			{Boolean(data.corpo) && <path d={f.path([v(0.6, h + 0.22), v(CW - 0.6, h + 0.22), v(CW - 0.6, h + 0.75), v(0.6, h + 0.75)], true)} fill="#b3b3b3" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />}
			{labels.corpo && <QuantityText f={f} at={v(CW + 0.2, h + 0.48)} text={labels.corpo} anchor="start" />}
			{labels.gas && <QuantityText f={f} at={v(CW / 2, h / 2)} text={labels.gas} />}
			{labels.S && <QuantityText f={f} at={v(CW / 2, -0.4)} text={labels.S} />}
			{labels.h && (
				<>
					<Arrow f={f} from={v(-0.3, h / 2)} to={v(-0.3, h)} weight="thin" />
					<Arrow f={f} from={v(-0.3, h / 2)} to={v(-0.3, 0)} weight="thin" />
					<QuantityText f={f} at={v(-0.45, h / 2)} text={labels.h} anchor="end" />
				</>
			)}
		</Drawing>
	);
}
