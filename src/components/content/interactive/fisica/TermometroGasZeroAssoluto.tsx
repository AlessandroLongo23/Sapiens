'use client';

import { useState } from 'react';
import { RotateCcw, MoveDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, THICK, THIN, DASH, INK, TINT } from '../kit';
import { Axes } from '../fisica';
import { Ticks, Words, heatTint } from './calore';
import { Gauge } from '../chimica/gas';

/**
 * Physics lesson 103 (le leggi di Gay-Lussac): a constant-volume gas thermometer. A bulb of gas sits in a bath whose
 * temperature the student sets between −100 and 150 °C; a gauge reads the pressure, p = p0 (1 + t/273), and every
 * temperature tried leaves a point on the graph of p against t in degrees Celsius. "Prolunga la retta" continues the
 * line below the measured range: it reaches p = 0 at −273 °C. With more or less gas in the bulb (p0 = 60, 100 or
 * 140 kPa) the line has another slope and the same crossing. The question of the lesson: at what temperature would
 * the pressure vanish, and does it depend on how much gas there is?
 */

const T_MIN = -100, T_MAX = 150;
const ZERO = -273;
const AMOUNTS = { poco: 60, medio: 100, tanto: 140 } as const; // p0 in kPa
type Amount = keyof typeof AMOUNTS;
const P_MAX = 230;

const f = frame(-0.75, 8.1, -0.75, 5.1);
// the graph: t from −300 to 150 °C on 4,3 cm, p from 0 to 230 kPa on 3,7 cm
const X300 = 3.25, XS = 4.3 / 450;
const GY = 0.55, YS = 3.7 / P_MAX;
const gx = (t: number) => X300 + (t + 300) * XS;
const gy = (p: number) => GY + p * YS;
const law = (p0: number, t: number) => p0 * (1 + t / 273);

export default function TermometroGasZeroAssoluto({ alt }: { alt?: string }) {
	const [t, setT] = useState(20);
	const [amount, setAmount] = useState<Amount>('medio');
	const [seen, setSeen] = useState<number[]>([20]);
	const [extended, setExtended] = useState(false);

	const p0 = AMOUNTS[amount];
	const p = law(p0, t);
	const move = (x: number) => {
		const next = Math.round(x / 10) * 10;
		setT(next);
		setSeen((s) => (s.includes(next) ? s : [...s, next]));
	};
	const pick = (a: Amount) => {
		setAmount(a);
		setSeen([t]);
	};
	const reset = () => {
		setT(20);
		setAmount('medio');
		setSeen([20]);
		setExtended(false);
	};

	const lo = Math.min(...seen), hi = Math.max(...seen);
	const others = (Object.keys(AMOUNTS) as Amount[]).filter((a) => a !== amount);
	const bulb = f.px(v(1, 0.9));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* bath, bulb, tube and gauge */}
				<path d={f.path([v(-0.2, 0), v(2.2, 0), v(2.2, 2.0), v(-0.2, 2.0)], true)} fill={heatTint(t, T_MIN, T_MAX)} />
				<path d={f.path([v(-0.2, 2.0), v(2.2, 2.0)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(-0.2, 2.4), v(-0.2, 0), v(2.2, 0), v(2.2, 2.4)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<path d={f.path([v(0.95, 1.4), v(0.95, 3.1)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(1.05, 1.4), v(1.05, 3.1)])} stroke="#000" strokeWidth={THIN} />
				<circle cx={bulb.x} cy={bulb.y} r={0.55 * (f.W / (f.x1 - f.x0))} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				<Words f={f} at={v(1, 0.9)} size={12}>
					gas
				</Words>
				<Gauge f={f} at={v(1, 4.0)} r={0.92} value={p} max={200} every={50} minor={10} unit="kPa" />
				<Words f={f} at={v(1, -0.3)} size={12}>
					bagno a {t} °C
				</Words>

				{/* graph of p against t */}
				<Axes f={f} o={v(gx(0), GY)} x0={gx(-300)} x1={gx(T_MAX) + 0.35} y0={GY} y1={gy(P_MAX) + 0.3} xName="" yName="" />
				<Ticks f={f} o={v(gx(0), GY)} xs={[-200, -100, 100].map(gx)} xl={['−200', '−100', '100']} ys={[50, 100, 150, 200].map(gy)} yl={['50', '100', '150', '200']} size={10} />
				<Words f={f} at={v(gx(T_MAX) + 0.4, GY - 0.55)} anchor="end" size={11}>
					<tspan fontStyle="italic">t</tspan> (°C)
				</Words>
				<Words f={f} at={v(gx(0) + 0.12, gy(P_MAX) + 0.45)} anchor="start" size={11}>
					<tspan fontStyle="italic">p</tspan> (kPa)
				</Words>
				{extended &&
					others.map((a) => (
						<path key={a} d={f.path([v(gx(ZERO), gy(0)), v(gx(T_MAX), gy(law(AMOUNTS[a], T_MAX)))])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					))}
				{extended && <path d={f.path([v(gx(ZERO), gy(0)), v(gx(lo), gy(law(p0, lo)))])} stroke="#6666ff" strokeWidth={THICK} strokeDasharray={DASH} fill="none" />}
				{hi > lo && <path d={f.path([v(gx(lo), gy(law(p0, lo))), v(gx(hi), gy(law(p0, hi)))])} stroke="#6666ff" strokeWidth={THICK} fill="none" />}
				{seen.map((s) => {
					const c = f.px(v(gx(s), gy(law(p0, s))));
					return <circle key={s} cx={c.x} cy={c.y} r={2.4} fill="#000" />;
				})}
				<circle cx={f.px(v(gx(t), gy(p))).x} cy={f.px(v(gx(t), gy(p))).y} r={3.6} fill={INK.orange} />
				{extended && (
					<>
						<circle cx={f.px(v(gx(ZERO), gy(0))).x} cy={f.px(v(gx(ZERO), gy(0))).y} r={3.4} fill={INK.red} />
						<Words f={f} at={v(gx(ZERO), GY - 0.3)} size={11} color={INK.red}>
							−273
						</Words>
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`t = ${t < 0 ? '-' : ''}${Math.abs(t)}\\,^\\circ\\text{C}`}</Tex>
				<Tex>{`p = ${texNum(p, 1)}\\,\\text{kPa}`}</Tex>
				<Tex>{`p_0 = ${p0}\\,\\text{kPa}`}</Tex>
				<span>{seen.length === 1 ? '1 misura' : `${seen.length} misure`}</span>
			</Readout>
			<Caption>
				{extended ? (
					<>
						La retta, prolungata sotto le temperature misurate, arriva a pressione zero a −273 °C. Cambia la quantità di gas: la pendenza cambia, il punto di arrivo no.
					</>
				) : seen.length < 3 ? (
					<>Cambia la temperatura del bagno: ogni temperatura che provi lascia un punto sul grafico. La pressione a 0 °C è <Tex>{'p_0'}</Tex>.</>
				) : (
					<>
						I punti stanno su una retta: a ogni grado in più la pressione cresce di <Tex>{`p_0/273 = ${texNum(p0 / 273, 2)}\\,\\text{kPa}`}</Tex>. Prolunga la retta per vedere dove va a finire.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Temperatura del bagno" unit="°C" value={t} min={T_MIN} max={T_MAX} step={10} onChange={move} />
				<div className="flex justify-center">
					<ToggleGroup
						label="Gas nel bulbo"
						options={[
							{ value: 'poco', label: 'Poco' },
							{ value: 'medio', label: 'Medio' },
							{ value: 'tanto', label: 'Tanto' },
						]}
						value={amount}
						onChange={pick}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setExtended((e) => !e)}>
						<MoveDownLeft className="size-4" aria-hidden="true" />
						{extended ? 'Nascondi il prolungamento' : 'Prolunga la retta'}
					</Button>
					<Button variant="secondary" size="sm" onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
