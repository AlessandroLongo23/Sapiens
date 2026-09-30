'use client';

import { ArrowDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, Tex, frame, v, useTween, texNum, TINT, THIN } from '../kit';
import { Arrow, QTY, VecLabel } from '../fisica';
import { Liquid, Piston, Surface, Vessel } from './liquidi';

/**
 * Lesson "La legge di Pascal e il torchio idraulico": a hydraulic press. Sliders set the force F1 on the small piston
 * (50 to 500 N) and the areas S1 (5 to 50 cm²) and S2 (100 to 1000 cm²); the cylinders' widths follow the diameters,
 * so the square root of the areas. The readout gives the pressure p = F1/S1, the same under both pistons, and the
 * force F2 = p · S2 on the big one, with the mass it holds up (a crate on it). "Spingi" pushes the small piston 20 cm
 * down (a tween): the big one rises by s2 = s1 · S1/S2, the same volume of oil. Arrows: F1 in scale (the only force
 * drawn, since F2 can be 200 times larger); the liquid's weight is neglected, as in the lesson.
 */

const G = 9.8;
const STROKE = 20; // cm, the small piston's full push
const Y = 2.2; // both pistons' lower faces at rest
const CM = 0.065; // drawing centimetres per real centimetre of travel
const K = 0.1; // drawing centimetres per √cm² of area (the cylinder's width)
const X1 = 0.35; // the small cylinder's left wall
const X2 = 2.1; // the big cylinder's left wall
const TUBE = 0.45; // the top of the connecting tube
const TOP = 3.6; // the cylinders' rims

const f = frame(-1.25, 5.55, -0.25, 4.25);

/** 12500 → "12\,500": thin spaces from five digits, as the lessons write numbers. */
const big = (x: number) => {
	const s = String(Math.round(x));
	return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
};

export default function TorchioIdraulico({ alt }: { alt?: string }) {
	const [F1, setF1] = useState(200);
	const [S1, setS1] = useState(10);
	const [S2, setS2] = useState(500);
	const [s1, go, running] = useTween(0, 1200);

	const w1 = K * Math.sqrt(S1);
	const w2 = K * Math.sqrt(S2);
	const ratio = S2 / S1;
	const F2 = F1 * ratio;
	const p = F1 / (S1 * 1e-4); // Pa
	const s2 = (s1 * S1) / S2;
	const y1 = Y - s1 * CM;
	const y2 = Y + s2 * CM;
	const xr = X2 + w2;
	const arrow = 0.35 + (F1 / 500) * 0.9; // F1 in scale: 0,9 cm for 500 N
	const crateW = Math.min(w2 - 0.1, 1.3);
	const crateTop = y2 + 0.15 + 0.6;
	const mass = F2 / G;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid
					f={f}
					pts={[v(X1, y1), v(X1, 0), v(xr, 0), v(xr, y2), v(X2, y2), v(X2, TUBE), v(X1 + w1, TUBE), v(X1 + w1, y1)]}
				/>
				<Surface f={f} from={v(X1, y1)} to={v(X1 + w1, y1)} />
				<Vessel
					f={f}
					paths={[
						[v(X1, TOP), v(X1, 0), v(xr, 0), v(xr, TOP)],
						[v(X1 + w1, TOP), v(X1 + w1, TUBE), v(X2, TUBE), v(X2, TOP)],
					]}
				/>
				<Piston f={f} x0={X1} x1={X1 + w1} y={y1} />
				<Piston f={f} x0={X2} x1={xr} y={y2} />
				{/* the load on the big piston: a crate */}
				<path d={f.path([v(X2 + w2 / 2 - crateW / 2, y2 + 0.15), v(X2 + w2 / 2 + crateW / 2, y2 + 0.15), v(X2 + w2 / 2 + crateW / 2, crateTop), v(X2 + w2 / 2 - crateW / 2, crateTop)], true)} fill={TINT.orange} stroke="#000" strokeWidth={1.2} />
				<Label f={f} at={v(X2 + w2 / 2, (y2 + 0.15 + crateTop) / 2)} upright size={12}>
					{mass >= 1000 ? `${(mass / 1000).toFixed(1).replace('.', ',')} t` : `${Math.round(mass)} kg`}
				</Label>
				<Arrow f={f} from={v(X1 + w1 / 2, y1 + 0.15 + arrow)} to={v(X1 + w1 / 2, y1 + 0.15)} color={QTY.forza} />
				<VecLabel f={f} at={v(X1, y1 + 0.15 + arrow * 0.6)} dir={v(-1, 0)} name="F" sub="1" color={QTY.forza} />
				<Label f={f} at={v(X1 + w1, y1 + 0.08)} dir={v(1, 0)} size={13}>
					S<tspan fontSize={9} dy={3} fontStyle="normal">1</tspan>
				</Label>
				<Label f={f} at={v(X2 + w2 / 2, y2 - 0.35)} size={13}>
					S<tspan fontSize={9} dy={3} fontStyle="normal">2</tspan>
				</Label>
				{/* the rest position, dashed, to see how far each piston went */}
				{s1 > 0.5 && <path d={f.path([v(X1 - 0.2, Y), v(X1 + w1 + 0.2, Y)]) + ' ' + f.path([v(X2 - 0.2, Y), v(xr + 0.2, Y)])} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" opacity={0.6} />}
			</Drawing>

			<Readout>
				<span>
					<Tex>{`p = \\dfrac{F_1}{S_1} = ${big(p / 1000)}\\,\\text{kPa}`}</Tex>
				</span>
				<span>
					<Tex>{`\\dfrac{S_2}{S_1} = ${texNum(ratio, 1)}`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`F_2 = p \\cdot S_2 = ${big(F2)}\\,\\text{N}`}</Tex>
				</span>
			</Readout>
			<Readout>
				<span>
					<Tex>{`s_1 = ${texNum(s1, 1)}\\,\\text{cm}`}</Tex>
				</span>
				<span>
					<Tex>{`s_2 = s_1 \\cdot \\dfrac{S_1}{S_2} = ${texNum(s2, 2)}\\,\\text{cm}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{s1 < 0.5 ? (
					<>
						La pressione sotto il pistone grande è la stessa che c&apos;è sotto il piccolo, e la forza è <Tex>{texNum(ratio, 1)}</Tex> volte più grande: regge una massa di{' '}
						{mass >= 1000 ? `${(mass / 1000).toFixed(1).replace('.', ',')} tonnellate` : `${Math.round(mass)} kg`}. Premi «Spingi» per vedere gli spostamenti.
					</>
				) : (
					<>
						Il pistone piccolo è sceso di <Tex>{`${texNum(s1, 1)}\\,\\text{cm}`}</Tex>, quello grande è salito di <Tex>{`${texNum(s2, 2)}\\,\\text{cm}`}</Tex>: <Tex>{texNum(ratio, 1)}</Tex> volte di meno, perché il volume d&apos;olio che passa da un cilindro all&apos;altro è lo stesso.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Forza F₁ sul pistone piccolo" unit="N" value={F1} min={50} max={500} step={10} onChange={setF1} />
				<Slider label="Area S₁ del pistone piccolo (cm²)" value={S1} min={5} max={50} step={5} onChange={setS1} />
				<Slider label="Area S₂ del pistone grande (cm²)" value={S2} min={100} max={1000} step={50} onChange={setS2} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || s1 >= STROKE - 0.01} onClick={() => void go(STROKE)}>
						<ArrowDown className="size-4" aria-hidden="true" />
						Spingi di 20 cm
					</Button>
					<Button variant="secondary" size="sm" disabled={running || s1 <= 0.01} onClick={() => void go(0, 600)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna su
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
