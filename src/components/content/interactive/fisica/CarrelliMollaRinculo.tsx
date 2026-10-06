'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, INK, TINT } from '../kit';
import { Block, Ground, Spring, Vector, QTY } from '../fisica';

/**
 * Lesson 82 (La conservazione della quantità di moto): two carts at rest on a track with a compressed spring between
 * them. The spring always gives the same energy, 6,0 J, so the speeds follow from the two conservation laws:
 * V₁ = √(2 E m₂ / (m₁ (m₁ + m₂))) to the left and V₂ = √(2 E m₁ / (m₂ (m₁ + m₂))) to the right. Masses from 0,5 to
 * 4 kg on sliders; each cart is a block whose width grows with the mass. After the release the carts move at constant
 * speed, 0,5 cm of drawing per metre; above each one its velocity (0,3 cm per m/s) and its momentum (0,35 cm per
 * kg·m/s): the two momentum arrows are always equally long.
 */

const E = 6; // J
const X = 5; // the middle of the spring
const S0 = 0.5, S1 = 0.9; // the spring compressed and at rest, cm
const H = 0.6;
const KS = 0.5, KV = 0.3, KP = 0.35;
const f = frame(0, 10, -0.4, 2.8);

const wOf = (m: number) => 0.6 + 0.25 * m;

export default function CarrelliMollaRinculo({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(1);
	const [m2, setM2] = useState(2);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const V1 = Math.sqrt((2 * E * m2) / (m1 * (m1 + m2)));
	const V2 = Math.sqrt((2 * E * m1) / (m2 * (m1 + m2)));
	const p = m1 * V1; // the same as m2 * V2
	const w1 = wOf(m1), w2 = wOf(m2);

	// The run ends when the tip of an arrow reaches the edge of the figure.
	const reach = (V: number) => Math.max(V * KV, p * KP) + 0.2;
	const END = Math.min((X - S0 / 2 - w1 / 2 - reach(V1)) / (V1 * KS), (10 - X - S0 / 2 - w2 / 2 - reach(V2)) / (V2 * KS));
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

	const right1 = X - S0 / 2 - V1 * KS * t; // the right side of cart 1
	const left2 = X + S0 / 2 + V2 * KS * t; // the left side of cart 2
	const c1 = right1 - w1 / 2, c2 = left2 + w2 / 2;
	const springEnd = Math.min(right1 + S1, left2);
	const moving = t > 0;

	let caption: string;
	if (!moving) caption = 'I carrelli sono fermi: la quantità di moto totale è zero. Premi Libera la molla.';
	else if (m1 === m2) caption = 'Masse uguali: i carrelli partono con la stessa velocità, in versi opposti.';
	else {
		const [light, heavy, ratio] = m1 < m2 ? ['1', '2', m2 / m1] : ['2', '1', m1 / m2];
		caption = `Il carrello ${light} ha una massa ${num(ratio, 2)} volte più piccola del carrello ${heavy} e una velocità ${num(ratio, 2)} volte più grande: le due quantità di moto sono uguali e opposte.`;
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0.1, 0)} to={v(9.9, 0)} />
				<Spring f={f} from={v(right1, H / 2)} to={v(springEnd, H / 2)} coils={7} />
				<Block f={f} at={v(c1, 0)} w={w1} h={H} />
				<Label f={f} at={v(c1, H / 2)} upright size={13}>1</Label>
				<Block f={f} at={v(c2, 0)} w={w2} h={H} fill={TINT.orange} />
				<Label f={f} at={v(c2, H / 2)} upright size={13}>2</Label>
				{moving && (
					<>
						<Vector f={f} from={v(c1, H + 0.4)} to={v(c1 - V1 * KV, H + 0.4)} color={QTY.velocita} name="V" sub="1" labelDir={v(0, 1)} labelAt={0.5} />
						<Vector f={f} from={v(c2, H + 0.4)} to={v(c2 + V2 * KV, H + 0.4)} color={QTY.velocita} name="V" sub="2" labelDir={v(0, 1)} labelAt={0.5} />
						<Vector f={f} from={v(c1, H + 1.3)} to={v(c1 - p * KP, H + 1.3)} color={INK.blue} name="p" sub="1" labelDir={v(0, 1)} labelAt={0.5} />
						<Vector f={f} from={v(c2, H + 1.3)} to={v(c2 + p * KP, H + 1.3)} color={INK.blue} name="p" sub="2" labelDir={v(0, 1)} labelAt={0.5} />
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`V_1 = ${moving ? `-${texNum(V1, 2)}` : '0'}\\,\\text{m/s}`}</Tex>
				<Tex>{`V_2 = ${moving ? texNum(V2, 2) : '0'}\\,\\text{m/s}`}</Tex>
				<Tex>{`p_1 = ${moving ? `-${texNum(p, 2)}` : '0'}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
				<Tex>{`p_2 = ${moving ? texNum(p, 2) : '0'}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
				<Tex>{'p_{tot} = p_1 + p_2 = 0'}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa del carrello 1 (kg)" value={m1} min={0.5} max={4} step={0.5} onChange={set(setM1)} />
				<Slider label="Massa del carrello 2 (kg)" value={m2} min={0.5} max={4} step={0.5} onChange={set(setM2)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={running}>
						<Play className="size-4" aria-hidden="true" />
						Libera la molla
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti vicini
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
