'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, texNum } from '../kit';
import { QuantityText } from './liquidi';
import { COLD_FILL, Flow, HOT_FILL, Machine, Reservoir, WORK_FILL } from './sorgenti';

/**
 * Lesson 117 (Frigoriferi e pompe di calore): a reversible machine run backwards between a cold reservoir (below) and
 * a hot one (above). The student picks the two temperatures in degrees Celsius and what the machine is for. As a
 * refrigerator it takes Q_f = 1000 J from the cold reservoir, and W = Q_f / COP_f with COP_f = T_f / (T_c - T_f); as a
 * heat pump it gives Q_c = 1000 J to the hot one, and W = Q_c / COP_p with COP_p = T_c / (T_c - T_f). The three flows
 * are bands whose width is the energy, 1 cm per 1000 J, so the work is seen to grow when the temperatures move apart.
 * The starting values are those of the lesson's example 3 (a freezer at -18 °C in a kitchen at 25 °C).
 */

type Mode = 'frigo' | 'pompa';
const PLACES: Record<Mode, { cold: string; hot: string }> = {
	frigo: { cold: 'interno del frigorifero', hot: 'cucina' },
	pompa: { cold: 'aria esterna', hot: 'casa' },
};
const UNIT = 1000; // joule moved
const CM = 1 / 1000; // centimetres per joule

const f = frame(-3.3, 3.3, -0.75, 5.75);
const COLD = v(0, 0), HOT = v(0, 5), MACHINE = v(0, 2.5);
const R = 0.75;
/** A whole number of degrees with a true minus sign. */
const deg = (t: number) => String(t).replace('-', '−');
/** Where each use starts: the lesson's example 3 (a freezer in a kitchen, a house on a winter day). */
const START: Record<Mode, [number, number]> = { frigo: [-18, 25], pompa: [2, 20] };

export default function FrigoriferoCop({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('frigo');
	const [tf, setTf] = useState(-18);
	const [tc, setTc] = useState(25);

	const pick = (m: Mode) => {
		setMode(m);
		setTf(START[m][0]);
		setTc(START[m][1]);
	};

	const Tf = tf + 273, Tc = tc + 273;
	const copF = Tf / (Tc - Tf), copP = Tc / (Tc - Tf);
	const cop = mode === 'frigo' ? copF : copP;
	const W = UNIT / cop;
	const Qf = mode === 'frigo' ? UNIT : UNIT - W;
	const Qc = mode === 'frigo' ? UNIT + W : UNIT;
	const place = PLACES[mode];

	return (
		<Figure>
			<div className="flex justify-center">
				<ToggleGroup label="Uso della macchina" options={[{ value: 'frigo' as Mode, label: 'Frigorifero' }, { value: 'pompa' as Mode, label: 'Pompa di calore' }]} value={mode} onChange={pick} />
			</div>
			<Drawing f={f} label={alt}>
				<Flow f={f} from={v(0, COLD.y + 0.4)} to={v(0, MACHINE.y - R + 0.05)} width={Qf * CM} />
				<Flow f={f} from={v(0, MACHINE.y + R - 0.05)} to={v(0, HOT.y - 0.4)} width={Qc * CM} />
				<Flow f={f} from={v(2.3, MACHINE.y)} to={v(R - 0.05, MACHINE.y)} width={W * CM} fill={WORK_FILL} stroke="#000" />
				<Reservoir f={f} at={COLD} w={4.6} fill={COLD_FILL} second={`${deg(tf)} °C = ${Tf} K`}>
					{place.cold}
				</Reservoir>
				<Reservoir f={f} at={HOT} w={4.6} fill={HOT_FILL} second={`${deg(tc)} °C = ${Tc} K`}>
					{place.hot}
				</Reservoir>
				<Machine f={f} at={MACHINE} r={R} />
				<QuantityText f={f} at={v(-0.95, 1.2)} anchor="end" text={`Q_f = ${num(Qf, 0)} J`} />
				<QuantityText f={f} at={v(-0.95, 3.85)} anchor="end" text={`Q_c = ${num(Qc, 0)} J`} />
				<QuantityText f={f} at={v(1.75, 3.0)} text={`W = ${num(W, 0)} J`} />
			</Drawing>

			<Readout>
				<Tex>{`T_c - T_f = ${Tc - Tf}\\,\\text{K}`}</Tex>
				{mode === 'frigo' ? (
					<Tex>{`\\text{COP}_{f,max} = \\dfrac{T_f}{T_c - T_f} = \\dfrac{${Tf}}{${Tc - Tf}} = ${texNum(copF, copF < 10 ? 2 : 1)}`}</Tex>
				) : (
					<Tex>{`\\text{COP}_{p,max} = \\dfrac{T_c}{T_c - T_f} = \\dfrac{${Tc}}{${Tc - Tf}} = ${texNum(copP, copP < 10 ? 2 : 1)}`}</Tex>
				)}
				<Tex>{`W = \\dfrac{${mode === 'frigo' ? 'Q_f' : 'Q_c'}}{\\text{COP}} = ${texNum(W, 0)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>
				{mode === 'frigo'
					? `Per togliere 1000 J all'interno a ${deg(tf)} °C e cederli alla cucina a ${tc} °C, una macchina reversibile ha bisogno di ${num(W, 0)} J di lavoro: alla cucina ne arrivano ${num(Qc, 0)}. Con le temperature più lontane il lavoro cresce.`
					: `Per cedere 1000 J alla casa a ${tc} °C, una pompa di calore reversibile ne prende ${num(Qf, 0)} dall'aria esterna a ${deg(tf)} °C e ha bisogno di ${num(W, 0)} J di lavoro. Più fuori fa freddo, più lavoro serve.`}
			</Caption>

			<Controls>
				<Slider label="Fredda (°C)" value={tf} min={-25} max={15} step={1} onChange={setTf} />
				<Slider label="Calda (°C)" value={tc} min={18} max={45} step={1} onChange={setTc} />
			</Controls>
		</Figure>
	);
}
