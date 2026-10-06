'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, Dot, Tex, Handle, frame, v, clamp, num, texNum, THICK, THIN, DASH, TINT, FONT, FONT_MATH, type V } from '../kit';
import { Axes } from '../fisica';
import { Ticks, Words } from './calore';

/**
 * Physics lesson 113 (La trasformazione adiabatica): a perfect gas starts from A (2,0 atm, 1,0 L, 300 K) in a
 * horizontal cylinder with insulating walls. Above the cylinder, on the same volume scale, the pressure-volume plane
 * with the two curves through A: the isotherm p V = 2 and the adiabat p V^γ = 2, with γ = 5/3 (monatomic) or 7/5
 * (diatomic). The student moves the piston (slider or drag) from 0,5 to 4,0 L; a dot runs along each curve and the
 * gas takes the colour of its temperature along the adiabat. The question it answers: at the same volume, how far
 * apart are the two pressures, and how cold (or hot) does the insulated gas get?
 */

const PA = 2;
const VA = 1;
const TA = 300;
const V_MIN = 0.5;
const V_MAX = 4;
/** Centimetres per litre and per atmosphere. */
const SX = 1.5;
const SY = 0.6;
const P_TOP = 7;
/** The cylinder under the graph: its axis and half height. */
const CY = -1.85;
const CR = 0.5;
const ROD = 0.85;

const f = frame(-0.85, 7.45, -2.8, 4.95);

type Gas = 'mono' | 'bi';
const GAMMA: Record<Gas, number> = { mono: 5 / 3, bi: 7 / 5 };

const pIso = (V: number) => (PA * VA) / V;
const pAd = (V: number, g: number) => PA * (VA / V) ** g;
const tAd = (V: number, g: number) => TA * (VA / V) ** (g - 1);
const at = (V: number, p: number): V => v(V * SX, p * SY);

/** An axis name with its unit: the letter italic like math, the unit upright. */
function AxisName({ at: p, sym, unit }: { at: V; sym: string; unit: string }) {
	const q = f.px(p);
	return (
		<text x={q.x} y={q.y} dy="0.35em" textAnchor="start" fontSize={12} fontFamily={FONT} pointerEvents="none">
			<tspan fontFamily={FONT_MATH} fontStyle="italic">
				{sym}
			</tspan>{' '}
			({unit})
		</text>
	);
}

function curve(p: (V: number) => number) {
	const pts: V[] = [];
	for (let i = 0; i <= 70; i++) {
		const V = V_MIN + ((V_MAX - V_MIN) * i) / 70;
		pts.push(at(V, p(V)));
	}
	return f.path(pts);
}

/** From cold blue (120 K) to warm red (480 K), through the lessons' tints. */
function tint(T: number) {
	const k = clamp((T - 120) / 360, 0, 1);
	const c = (a: number, b: number) => Math.round(a + (b - a) * k);
	return `rgb(${c(204, 255)},${c(204, 200)},${c(255, 200)})`;
}

export default function AdiabaticaIsoterma({ alt }: { alt?: string }) {
	const [V, setVol] = useState(VA);
	const [gas, setGas] = useState<Gas>('mono');
	const g = GAMMA[gas];
	const setV = (x: number) => setVol(clamp(Math.round(x * 10) / 10, V_MIN, V_MAX));
	const pi = pIso(V), pa = pAd(V, g), T = tAd(V, g);
	const xp = V * SX;
	const moved = Math.abs(V - VA) > 0.01;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Axes f={f} x0={-0.1} x1={6.5} y0={-0.1} y1={4.6} xName="" yName="" grid={1.5} />
				<Ticks f={f} xs={[1, 2, 3, 4].map((x) => x * SX)} xl={['1', '2', '3', '4']} ys={[2, 4, 6].map((y) => y * SY)} yl={['2', '4', '6']} />
				<AxisName at={v(6.6, 0)} sym="V" unit="L" />
				<AxisName at={v(0.15, 4.75)} sym="p" unit="atm" />
				<path d={curve(pIso)} stroke="#6666ff" strokeWidth={THICK * 1.4} fill="none" />
				<path d={curve((x) => Math.min(pAd(x, g), P_TOP + 0.5))} stroke="#cc0000" strokeWidth={THICK * 1.4} fill="none" />
				<Words f={f} at={v(6.1, pIso(V_MAX) * SY + 0.28)} anchor="end" size={12} color="#6666ff">
					isoterma
				</Words>
				<Words f={f} at={v(0.98, 3.3)} anchor="start" size={12} color="#cc0000">
					adiabatica
				</Words>
				{/* the volume read on both curves, down to the piston */}
				<path d={f.path([v(xp, CY + CR), v(xp, -0.5)]) + ' ' + f.path([v(xp, 0), v(xp, Math.max(pi, pa) * SY)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Dot f={f} at={at(VA, PA)} r={2.6} />
				<Label f={f} at={at(VA, PA)} dir={v(0.8, 0.8)}>
					A
				</Label>
				{moved && <Dot f={f} at={at(V, pi)} r={3.2} color="#6666ff" />}
				{moved && <Dot f={f} at={at(V, pa)} r={3.2} color="#cc0000" />}

				{/* insulating walls, gas, piston */}
				<path d={f.path([v(-0.2, CY - CR - 0.2), v(6.3, CY - CR - 0.2), v(6.3, CY - CR), v(0, CY - CR), v(0, CY + CR), v(6.3, CY + CR), v(6.3, CY + CR + 0.2), v(-0.2, CY + CR + 0.2)], true)} fill="#bdbdbd" />
				<path d={f.path([v(0, CY - CR), v(xp, CY - CR), v(xp, CY + CR), v(0, CY + CR)], true)} fill={tint(T)} />
				<path d={f.path([v(6.3, CY + CR), v(0, CY + CR), v(0, CY - CR), v(6.3, CY - CR)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(xp, CY - CR + 0.03), v(xp + 0.18, CY - CR + 0.03), v(xp + 0.18, CY + CR - 0.03), v(xp, CY + CR - 0.03)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(xp + 0.18, CY - 0.07), v(xp + ROD, CY - 0.07), v(xp + ROD, CY + 0.07), v(xp + 0.18, CY + 0.07)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<Words f={f} at={xp >= 1.5 ? v(xp / 2, CY) : v(xp + ROD + 0.35, CY)} anchor={xp >= 1.5 ? 'middle' : 'start'} size={12}>
					{num(T, 0)} K
				</Words>
				<Handle f={f} at={v(xp + ROD, CY)} label="Pistone" onMove={(q) => setV((q.x - ROD) / SX)} step={SX / 10} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`V = ${texNum(V, 1)}\\ \\text{L}`}</Tex>
				</span>
				<span>
					<Tex>{`p_{\\text{isot.}} = ${texNum(pi, 2)}\\ \\text{atm}`}</Tex>
				</span>
				<span>
					<Tex>{`p_{\\text{adiab.}} = ${texNum(pa, 2)}\\ \\text{atm}`}</Tex>
				</span>
				<span>
					<Tex>{`T_{\\text{adiab.}} = ${texNum(T, 0)}\\ \\text{K}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{!moved
					? 'Il gas è nello stato A, a 300 K. Sposta il pistone: le due curve partono insieme e poi si separano.'
					: V > VA
						? `Espansione: il gas isolato si raffredda fino a ${num(T, 0)} K, e la sua pressione è più bassa di quella dell’isoterma.`
						: `Compressione: il gas isolato si scalda fino a ${num(T, 0)} K, e la sua pressione è più alta di quella dell’isoterma.`}
			</Caption>

			<Controls>
				<Slider label="Volume" unit="L" value={V} min={V_MIN} max={V_MAX} step={0.1} onChange={setV} />
				<div className="flex justify-center">
					<ToggleGroup
						label="Tipo di gas"
						options={[
							{ value: 'mono', label: 'Monoatomico' },
							{ value: 'bi', label: 'Biatomico' }
						]}
						value={gas}
						onChange={setGas}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => setVol(VA)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna ad A
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
