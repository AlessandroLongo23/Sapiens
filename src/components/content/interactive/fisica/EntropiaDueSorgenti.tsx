'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, texNum, K, THICK, TINT } from '../kit';
import { Words } from './calore';
import { QuantityText } from './liquidi';
import { COLD_FILL, Flow, HOT_FILL, Reservoir } from './sorgenti';

/**
 * Lesson 118 (L'entropia), example 4: 1200 J of heat pass between two reservoirs joined by a bar. The student picks
 * the two temperatures in kelvin and the direction of the heat: from the hotter to the colder one, as it goes by
 * itself, or the other way round, which never happens. Three signed bars on a zero line show the entropy changes of
 * the two reservoirs, ∓Q/T, and of the universe, their sum: positive in the first case, smaller as the temperatures
 * get closer, and negative in the second. Bars at 0,35 cm per J/K, like the lesson's TikZ figure
 * `barre-entropia-due-sorgenti` (0,5 cm per J/K there).
 */

type Way = 'spontaneo' | 'inverso';
const Q = 1200;
const SCALE = 0.35; // centimetres per J/K
const ZERO = 1.9; // height of the zero line
const BAR_W = 0.8;
const XS = [0.9, 2.9, 4.9]; // left edges of the three bars

const f = frame(-0.25, 6.65, -0.55, 6.4);

function Bar({ x, value, fill, name }: { x: number; value: number; fill: string; name: string }) {
	const h = value * SCALE;
	const a = f.px(v(x, ZERO + Math.max(h, 0)));
	const up = value >= 0;
	return (
		<g pointerEvents="none">
			{Math.abs(h) > 0.004 && <rect x={a.x} y={a.y} width={BAR_W * K} height={Math.abs(h) * K} fill={fill} stroke="#000" strokeWidth={THICK} />}
			<Words f={f} at={v(x + BAR_W / 2, ZERO + (up ? -0.28 : 0.28))} size={14}>
				Δ<tspan fontStyle="italic">S</tspan>
				<tspan fontSize={10} dy={3} fontStyle="italic">
					{name}
				</tspan>
			</Words>
			<Words f={f} at={v(x + BAR_W / 2, ZERO + h + (up ? 0.25 : -0.25))} size={12}>
				{`${value > 0 ? '+' : value < 0 ? '−' : ''}${num(Math.abs(value), 2)} J/K`}
			</Words>
		</g>
	);
}

export default function EntropiaDueSorgenti({ alt }: { alt?: string }) {
	const [t1, setT1] = useState(400);
	const [t2, setT2] = useState(300);
	const [way, setWay] = useState<Way>('spontaneo');

	const equal = t1 === t2;
	// The heat leaves reservoir 1 when it is the hotter one and the heat goes its own way, or the colder one and it does not.
	const from1 = (t1 > t2) === (way === 'spontaneo');
	const s1 = equal ? 0 : (from1 ? -Q : Q) / t1;
	const s2 = equal ? 0 : (from1 ? Q : -Q) / t2;
	const su = s1 + s2;
	const fill1 = t1 >= t2 ? HOT_FILL : COLD_FILL, fill2 = t2 > t1 ? HOT_FILL : COLD_FILL;

	let caption: string;
	if (equal) caption = 'Alla stessa temperatura le due sorgenti sono in equilibrio termico: il calore non passa, e nessuna entropia cambia.';
	else if (way === 'spontaneo') caption = `Il calore va dalla sorgente a ${Math.max(t1, t2)} K a quella a ${Math.min(t1, t2)} K. La fredda guadagna più entropia di quanta ne perde la calda: l'entropia dell'universo aumenta di ${num(su, 2)} J/K. Più le temperature sono vicine, meno aumenta.`;
	else caption = `Il calore andrebbe dalla sorgente a ${Math.min(t1, t2)} K a quella a ${Math.max(t1, t2)} K: l'energia si conserverebbe, ma l'entropia dell'universo diminuirebbe di ${num(-su, 2)} J/K. Questo passaggio non avviene mai da solo.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={f.px(v(2.1, 5.2)).x} y={f.px(v(2.1, 5.2)).y} width={2.2 * K} height={0.3 * K} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<Reservoir f={f} at={v(1.1, 5.05)} w={2} h={1.1} fill={fill1} second={`${t1} K`}>
					sorgente 1
				</Reservoir>
				<Reservoir f={f} at={v(5.3, 5.05)} w={2} h={1.1} fill={fill2} second={`${t2} K`}>
					sorgente 2
				</Reservoir>
				{!equal && <Flow f={f} from={v(from1 ? 2.3 : 4.1, 5.75)} to={v(from1 ? 4.1 : 2.3, 5.75)} width={0.18} />}
				{!equal && <QuantityText f={f} at={v(3.2, 6.15)} text={`Q = ${Q} J`} />}

				<path d={f.path([v(0.3, ZERO), v(6.3, ZERO)])} stroke="#000" strokeWidth={THICK} />
				<Bar x={XS[0]} value={s1} fill={fill1} name="1" />
				<Bar x={XS[1]} value={s2} fill={fill2} name="2" />
				<Bar x={XS[2]} value={su} fill={su >= 0 ? TINT.orange : TINT.gray} name="univ" />
			</Drawing>

			<Readout>
				<Tex>{`\\Delta S_1 = ${equal ? '0' : `${from1 ? '-' : '+'}\\dfrac{${Q}\\,\\text{J}}{${t1}\\,\\text{K}} = ${texNum(s1, 2)}\\,\\text{J/K}`}`}</Tex>
				<Tex>{`\\Delta S_2 = ${equal ? '0' : `${from1 ? '+' : '-'}\\dfrac{${Q}\\,\\text{J}}{${t2}\\,\\text{K}} = ${texNum(s2, 2)}\\,\\text{J/K}`}`}</Tex>
				<Tex>{`\\Delta S_{univ} = ${texNum(su, 2)}\\,\\text{J/K}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Sorgente 1 (K)" value={t1} min={250} max={600} step={10} onChange={setT1} />
				<Slider label="Sorgente 2 (K)" value={t2} min={250} max={600} step={10} onChange={setT2} />
				<div className="flex justify-center">
					<ToggleGroup label="Verso del calore" options={[{ value: 'spontaneo' as Way, label: 'Dal caldo al freddo' }, { value: 'inverso' as Way, label: 'Dal freddo al caldo' }]} value={way} onChange={setWay} />
				</div>
			</Controls>
		</Figure>
	);
}
