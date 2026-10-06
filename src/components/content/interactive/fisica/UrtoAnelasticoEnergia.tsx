'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, TINT } from '../kit';
import { Block, Ground, Vector, QTY } from '../fisica';
import { EnergyBars, ENERGY_FILL } from './energia';

/**
 * Lesson 83 (Gli urti anelastici): a cart of mass m₁ moving at v₁ hits a cart of mass m₂ at rest and sticks to it;
 * the two go on at V = m₁ v₁ / (m₁ + m₂). Masses from 0,5 to 4 kg and v₁ from 1 to 4 m/s on sliders; each cart is a
 * block whose width grows with the mass. Uniform motion before and after, 0,6 cm of drawing per metre. Beside the
 * track two bars, the kinetic energy and the dissipated energy, drawn as fractions of the initial kinetic energy (the
 * dashed line, always at the same height):
 * at the collision the fraction m₂ / (m₁ + m₂) moves from the first bar to the second, whatever the speed.
 */

const KS = 0.6; // cm of drawing per metre
const KV = 0.4; // cm per m/s
const H = 0.6;
const X2 = 3.6; // the left side of cart 2 before the collision
const START = 0.3; // the left side of cart 1 at the start
const TRACK = 6.9;
const BAR_H = 2.2; // the height of the bar of the initial kinetic energy, whatever its value: the figure shows fractions
const f = frame(0, 10, -0.75, 2.75);

const wOf = (m: number) => 0.6 + 0.2 * m;

export default function UrtoAnelasticoEnergia({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(2);
	const [m2, setM2] = useState(2);
	const [v1, setV1] = useState(3);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const w1 = wOf(m1), w2 = wOf(m2);
	const V = (m1 * v1) / (m1 + m2);
	const Ki = 0.5 * m1 * v1 * v1;
	const Kf = 0.5 * (m1 + m2) * V * V;
	const lost = m2 / (m1 + m2);
	const dJ = Ki < 10 ? 2 : 1; // decimals of the energies: a slow light cart has a few hundredths of a joule

	const tHit = (X2 - START - w1) / (v1 * KS);
	// After the collision the carts run to the end of the track, for 2,5 s at most (a slow pair would take much longer).
	const END = tHit + Math.min(2.5, (TRACK - X2 - w2 - V * KV - 0.35) / (V * KS));
	useFrameLoop(running, (dt) => {
		const next = Math.min(END, t + dt);
		setT(next);
		if (next >= END) setRunning(false);
	});
	const reset = () => {
		setRunning(false);
		setT(0);
	};
	const set = (fn: (x: number) => void) => (x: number) => {
		fn(x);
		reset();
	};
	const play = () => {
		if (reduced) return setT(END);
		setT(0);
		setRunning(true);
	};

	const after = t >= tHit;
	const shift = after ? V * KS * (t - tHit) : 0;
	const left1 = after ? X2 - w1 + shift : START + v1 * KS * t;
	const left2 = X2 + shift;
	const c1 = left1 + w1 / 2, c2 = left2 + w2 / 2;

	let caption: string;
	if (t === 0) caption = `Il carrello 1 ha ${num(Ki, dJ)} J di energia cinetica; il carrello 2 è fermo. Premi Avvia.`;
	else if (!after) caption = "Prima dell'urto l'energia cinetica è tutta del carrello 1.";
	else caption = `Dopo l'urto restano ${num(Kf, dJ)} J: si è dissipato il ${num(lost * 100, 0)}% dell'energia cinetica, la frazione m₂/(m₁ + m₂), qualunque sia la velocità.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0.1, 0)} to={v(TRACK, 0)} />
				<Block f={f} at={v(c1, 0)} w={w1} h={H} />
				<Label f={f} at={v(c1, H / 2)} upright size={13}>1</Label>
				<Block f={f} at={v(c2, 0)} w={w2} h={H} fill={TINT.orange} />
				<Label f={f} at={v(c2, H / 2)} upright size={13}>2</Label>
				{!after && <Vector f={f} from={v(c1, H + 0.4)} to={v(c1 + v1 * KV, H + 0.4)} color={QTY.velocita} name="v" sub="1" labelDir={v(0, 1)} labelAt={0.5} />}
				{after && <Vector f={f} from={v(left2, H + 0.4)} to={v(left2 + V * KV, H + 0.4)} color={QTY.velocita} name="V" labelDir={v(0, 1)} labelAt={0.5} />}
				<EnergyBars
					f={f}
					at={v(7.75, 0)}
					scale={BAR_H / Ki}
					total={Ki}
					bars={[
						{ value: after ? Kf : Ki, fill: ENERGY_FILL.K, name: 'K' },
						{ value: after ? Ki - Kf : 0, fill: ENERGY_FILL.diss, name: 'E', sub: 'd' }
					]}
				/>
			</Drawing>

			<Readout>
				<Tex>{`V = \\dfrac{m_1 v_1}{m_1 + m_2} = ${texNum(V, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`K_i = ${texNum(Ki, dJ)}\\,\\text{J}`}</Tex>
				<Tex>{`K_f = ${texNum(Kf, dJ)}\\,\\text{J}`}</Tex>
				<Tex>{`\\dfrac{E_d}{K_i} = ${texNum(lost * 100, 0)}\\%`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa del carrello 1 (kg)" value={m1} min={0.5} max={4} step={0.5} onChange={set(setM1)} />
				<Slider label="Massa del carrello 2 (kg)" value={m2} min={0.5} max={4} step={0.5} onChange={set(setM2)} />
				<Slider label="Velocità del carrello 1 (m/s)" value={v1} min={1} max={4} step={0.5} onChange={set(setV1)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={running}>
						<Play className="size-4" aria-hidden="true" />
						Avvia
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Da capo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
