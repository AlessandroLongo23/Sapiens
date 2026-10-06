'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, TINT } from '../kit';
import { Arrow, QTY } from '../fisica';
import { BarreSegno, Cilindro, tintaTemperatura } from './pianoPV';

/**
 * Lesson 110 (Il primo principio della termodinamica), after the sign conventions: one mole of a monatomic perfect
 * gas at 300 K in a cylinder. Two sliders give the heat Q and the work W of a transformation, each from −600 J to
 * 600 J; the drawing shows the heat as an arrow that enters the cylinder from below (Q > 0) or leaves it, the work
 * as an arrow on the piston, outwards when the gas does it (W > 0) and inwards when it is done on the gas, and three
 * bars for Q, W and ΔU = Q − W. The gas is tinted by its final temperature, 300 K + ΔU / (3/2 · n R) with
 * 3/2 · 1 mol · 8,31 J/(mol·K) = 12,465 J/K. The piston's displacement is only a sketch of the sign of W.
 */

const CV = 1.5 * 8.31; // J/K for one mole
const T0 = 300;
const MAX = 600;
const KE = 0.0014; // cm per joule, bars
const KA = 0.002; // cm per joule, arrows and piston
const Y = 2.75;
const R = 0.6;
const LEN = 5.0;
const HEAT = '#e67300';
const f = frame(-0.5, 9.4, 0.35, 4.75);

const PRESET = [
	{ label: 'Scaldo a pistone bloccato', Q: 300, W: 0 },
	{ label: 'Comprimo senza calore', Q: 0, W: -300 },
	{ label: 'Tutto il calore in lavoro', Q: 300, W: 300 }
] as const;

export default function PrimoPrincipioBilancio({ alt }: { alt?: string }) {
	const [Q, setQ] = useState(500);
	const [W, setW] = useState(200);
	const dU = Q - W;
	const dT = dU / CV;
	const T = T0 + dT;
	const x = 2.6 + W * KA;
	const yIn = Y - R - 0.12;

	const calore = Q > 0 ? `assorbe ${Q} J di calore` : Q < 0 ? `cede ${-Q} J di calore` : 'non scambia calore';
	const lav = W > 0 ? `compie ${W} J di lavoro` : W < 0 ? `subisce ${-W} J di lavoro` : 'non scambia lavoro';
	const esito = dU > 0 ? `l’energia interna aumenta di ${dU} J e la temperatura sale da 300 K a ${num(T, 0)} K` : dU < 0 ? `l’energia interna diminuisce di ${-dU} J e la temperatura scende da 300 K a ${num(T, 0)} K` : 'l’energia interna non cambia e la temperatura resta 300 K';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Cilindro f={f} x0={0} x={x} y={Y} r={R} lunghezza={LEN} fill={tintaTemperatura((T - 200) / 200)} fermo={W === 0} />
				{Q !== 0 && <Arrow f={f} from={v(1.3, Q > 0 ? yIn - Math.abs(Q) * KA : yIn)} to={v(1.3, Q > 0 ? yIn : yIn - Math.abs(Q) * KA)} color={HEAT} weight="veryThick" />}
				<Label f={f} at={v(1.45, yIn - 0.45)} dir={v(1, 0)} size={14} color={HEAT}>
					Q
				</Label>
				{W !== 0 && <Arrow f={f} from={v(W > 0 ? x + 0.16 : x + 0.16 + Math.abs(W) * KA, Y + R + 0.25)} to={v(W > 0 ? x + 0.16 + W * KA : x + 0.16, Y + R + 0.25)} color={QTY.vettore} weight="veryThick" />}
				<Label f={f} at={v(x + 0.16 + (Math.abs(W) * KA) / 2, Y + R + 0.3)} dir={v(0, 1)} size={14} color={QTY.vettore}>
					W
				</Label>
				<Label f={f} at={v(LEN + 0.15, Y)} dir={v(1, 0)} upright size={13}>
					{`${num(T, 0)} K`}
				</Label>
				<BarreSegno
					f={f}
					at={v(7.0, 2.75)}
					scale={KE}
					max={2 * MAX}
					bars={[
						{ nome: 'Q', value: Q, fill: TINT.orange },
						{ nome: 'W', value: W, fill: TINT.blue },
						{ nome: 'U', delta: true, value: dU, fill: TINT.green }
					]}
				/>
			</Drawing>

			<Readout>
				<Tex>{`Q = ${texNum(Q, 0)}\\,\\text{J}`}</Tex>
				<Tex>{`W = ${texNum(W, 0)}\\,\\text{J}`}</Tex>
				<Tex>{`\\Delta U = Q - W = ${texNum(dU, 0)}\\,\\text{J}`}</Tex>
				<Tex>{`\\Delta T = ${texNum(dT, 0)}\\,\\text{K}`}</Tex>
			</Readout>
			<Caption>{`Il gas ${calore} e ${lav}: ${esito}.`}</Caption>

			<Controls>
				<Slider label="Calore Q (J)" value={Q} min={-MAX} max={MAX} step={50} onChange={setQ} />
				<Slider label="Lavoro W (J)" value={W} min={-MAX} max={MAX} step={50} onChange={setW} />
				<ButtonRow>
					{PRESET.map((p) => (
						<Button key={p.label} variant="secondary" size="sm" onClick={() => { setQ(p.Q); setW(p.W); }}>
							{p.label}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
