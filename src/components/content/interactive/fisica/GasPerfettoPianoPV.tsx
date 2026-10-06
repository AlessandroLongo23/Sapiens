'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, frame, v, clamp, texNum, THICK, THIN, DASH, INK, type V } from '../kit';
import { Axes } from '../fisica';
import { Ticks, Words } from './calore';

/**
 * Physics lesson 104 (l'equazione di stato del gas perfetto): the state of n moles of a perfect gas as a point of the
 * pressure-volume plane, which the student drags. The temperature is not chosen: it is read from the state,
 * T = p V / (n R), and the isotherm through the point is drawn over the fixed ones at 200, 400 and 600 K. The point
 * can be left free or held on its isotherm, on a horizontal line (constant pressure) or on a vertical one (constant
 * volume): the three laws of the gases as three ways of moving in the plane, with p V / (n T) always 8,31 J/(mol·K).
 * The question of the lesson: in how many ways can the gas go from 300 K to 600 K?
 *
 * Pressures in kPa and volumes in litres, so their product is in joules.
 */

const R = 8.31;
const V_AXIS = 50, P_AXIS = 250;
const V_LO = 5, V_HI = 48, P_LO = 20, P_HI = 240;
const GW = 6.2, GH = 4.6;
const f = frame(-0.95, GW + 1.25, -0.9, GH + 0.8);
const gx = (V: number) => (V / V_AXIS) * GW;
const gy = (p: number) => (p / P_AXIS) * GH;

type Mode = 'libero' | 'T' | 'p' | 'V';

/** The isotherm p V = c (joules), cut to the sheet. */
function isotherm(c: number): V[] {
	const from = Math.max(c / P_AXIS, 0.5);
	return Array.from({ length: 81 }, (_, i) => from + ((V_AXIS - from) * i) / 80).map((x) => v(gx(x), gy(c / x)));
}

export default function GasPerfettoPianoPV({ alt }: { alt?: string }) {
	const [state, setState] = useState({ p: 99.72, V: 25 });
	const [n, setN] = useState(1);
	const [mode, setMode] = useState<Mode>('libero');

	const { p, V } = state;
	const T = (p * V) / (n * R);

	const move = (q: V) => {
		const Vq = clamp(Math.round((q.x / GW) * V_AXIS * 2) / 2, V_LO, V_HI);
		const pq = clamp(Math.round((q.y / GH) * P_AXIS), P_LO, P_HI);
		if (mode === 'libero') setState({ p: pq, V: Vq });
		else if (mode === 'p') setState({ p, V: Vq });
		else if (mode === 'V') setState({ p: pq, V });
		else {
			const c = p * V;
			const Vt = clamp(Vq, Math.max(V_LO, c / P_HI), Math.min(V_HI, c / P_LO));
			setState({ p: c / Vt, V: Vt });
		}
	};

	const at = v(gx(V), gy(p));
	const caption =
		mode === 'T' ? (
			<>
				Il punto scorre sulla sua isoterma: la temperatura resta {Math.round(T)} K e il prodotto <Tex>{`p \\cdot V`}</Tex> resta {texNum(p * V, 0).replace('{,}', ',')} J. È la legge di Boyle.
			</>
		) : mode === 'p' ? (
			<>
				A pressione costante il punto si muove in orizzontale e attraversa le isoterme: se il volume raddoppia, raddoppia la temperatura assoluta. È la prima legge di Gay-Lussac.
			</>
		) : mode === 'V' ? (
			<>
				A volume costante il punto si muove in verticale: se la pressione raddoppia, raddoppia la temperatura assoluta. È la seconda legge di Gay-Lussac.
			</>
		) : (
			<>
				Trascina lo stato dove vuoi: la temperatura la decidono pressione e volume, <Tex>{'T = \\dfrac{p\\,V}{n\\,R}'}</Tex>. La curva arancione è l&apos;isoterma che passa per il punto.
			</>
		);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Axes f={f} x0={0} x1={GW + 0.4} y0={0} y1={GH + 0.4} xName="" yName="" grid={GW / 5} />
				<Ticks f={f} xs={[10, 20, 30, 40, 50].map(gx)} xl={['10', '20', '30', '40', '50']} ys={[50, 100, 150, 200, 250].map(gy)} yl={['50', '100', '150', '200', '250']} size={11} />
				<Words f={f} at={v(GW + 0.45, -0.62)} anchor="end" size={12}>
					<tspan fontStyle="italic">V</tspan> (L)
				</Words>
				<Words f={f} at={v(0.12, GH + 0.55)} anchor="start" size={12}>
					<tspan fontStyle="italic">p</tspan> (kPa)
				</Words>
				{[200, 400, 600].map((Ti) => (
					<g key={Ti}>
						<path d={f.path(isotherm(n * R * Ti))} stroke="#999" strokeWidth={THIN} fill="none" />
						<Words f={f} at={v(GW + 0.08, gy((n * R * Ti) / V_AXIS))} anchor="start" size={11} color="#666">
							{Ti} K
						</Words>
					</g>
				))}
				<path d={f.path(isotherm(p * V))} stroke={INK.orange} strokeWidth={THICK} fill="none" />
				{mode === 'p' && <path d={f.path([v(0, at.y), v(GW, at.y)])} stroke="#6666ff" strokeWidth={THICK} strokeDasharray={DASH} />}
				{mode === 'V' && <path d={f.path([v(at.x, 0), v(at.x, GH)])} stroke="#6666ff" strokeWidth={THICK} strokeDasharray={DASH} />}
				{mode !== 'p' && mode !== 'V' && <path d={f.path([v(at.x, 0), at, v(0, at.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				<Handle f={f} at={at} label="Stato del gas" color={INK.blue} step={0.12} onMove={move} />
			</Drawing>

			<Readout>
				<Tex>{`p = ${texNum(p, 0)}\\,\\text{kPa}`}</Tex>
				<Tex>{`V = ${texNum(V, 1)}\\,\\text{L}`}</Tex>
				<Tex>{`T = ${Math.round(T)}\\,\\text{K}`}</Tex>
				<Tex>{`\\dfrac{p\\,V}{n\\,T} = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Che cosa resta costante"
						options={[
							{ value: 'libero', label: 'Libero' },
							{ value: 'T', label: 'T fissa' },
							{ value: 'p', label: 'p fissa' },
							{ value: 'V', label: 'V fisso' },
						]}
						value={mode}
						onChange={setMode}
					/>
				</div>
				<Slider label="Moli di gas n (mol)" value={n} min={0.5} max={2} step={0.5} onChange={(x) => setN(clamp(Math.round(x * 2) / 2, 0.5, 2))} />
			</Controls>
		</Figure>
	);
}
