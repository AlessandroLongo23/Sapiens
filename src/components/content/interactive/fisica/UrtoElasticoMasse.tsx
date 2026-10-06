'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, TINT } from '../kit';
import { Block, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 84 (Gli urti elastici): two carts on a track collide elastically. Cart 1 always starts at 2 m/s to the
 * right; cart 2 is at rest or comes towards it at up to 2 m/s. Masses from 0,5 to 4 kg; each cart is a block whose
 * width grows with the mass. The final velocities are the lesson's formulas,
 * V₁ = ((m₁ − m₂) v₁ + 2 m₂ v₂) / (m₁ + m₂) and V₂ = ((m₂ − m₁) v₂ + 2 m₁ v₁) / (m₁ + m₂). Uniform motion before and
 * after, 0,6 cm of drawing per metre; velocities above the carts, 0,45 cm per m/s.
 */

const V1_START = 2; // m/s
const KS = 0.6, KV = 0.45;
const H = 0.6;
const XA = 2.4; // the right side of cart 1 at the start
const GAP = 3; // between the carts at the start, cm
const f = frame(0, 10, -0.4, 1.9);

const wOf = (m: number) => 0.6 + 0.2 * m;

export default function UrtoElasticoMasse({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(1);
	const [m2, setM2] = useState(2);
	const [approach, setApproach] = useState(0); // the speed of cart 2 towards cart 1, m/s
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const v1 = V1_START, v2 = -approach;
	const w1 = wOf(m1), w2 = wOf(m2);
	const V1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
	const V2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
	const p = m1 * v1 + m2 * v2;
	const K = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

	const tHit = GAP / ((v1 - v2) * KS);
	const xHit = XA + v1 * KS * tHit; // where the two carts touch
	// After the collision: until the tip of a velocity arrow reaches the edge of the figure, 2,2 s at most.
	const room = (c: number, V: number) => (Math.abs(V) < 1e-9 ? Infinity : ((V > 0 ? 9.8 - c : c - 0.2) - Math.abs(V) * KV) / (Math.abs(V) * KS));
	const END = tHit + Math.max(0.4, Math.min(2.2, room(xHit - w1 / 2, V1), room(xHit + w2 / 2, V2)));
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
	const c1 = after ? xHit - w1 / 2 + V1 * KS * (t - tHit) : XA - w1 / 2 + v1 * KS * t;
	const c2 = after ? xHit + w2 / 2 + V2 * KS * (t - tHit) : XA + GAP + w2 / 2 + v2 * KS * t;
	const u1 = after ? V1 : v1, u2 = after ? V2 : v2;
	const letter = after ? 'V' : 'v';

	let caption: string;
	if (t === 0) caption = `Il carrello 1 parte a ${num(v1, 1)} m/s${approach ? ` e il carrello 2 gli viene incontro a ${num(approach, 1)} m/s` : '; il carrello 2 è fermo'}. Premi Avvia.`;
	else if (!after) caption = 'I carrelli si avvicinano.';
	else if (approach === 0 && m1 === m2) caption = 'Masse uguali: il carrello 1 si ferma e il carrello 2 parte con la velocità che aveva il primo.';
	else if (approach === 0 && m1 > m2) caption = 'Il carrello 1 è più pesante: prosegue in avanti, più piano, e il carrello 2 parte più veloce di lui.';
	else if (approach === 0) caption = 'Il carrello 1 è più leggero: rimbalza e torna indietro.';
	else caption = `La velocità relativa si è invertita: prima dell'urto era ${num(v1 - v2, 2)} m/s, dopo è ${num(V1 - V2, 2).replace('-', '−')} m/s.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0.1, 0)} to={v(9.9, 0)} />
				<Block f={f} at={v(c1, 0)} w={w1} h={H} />
				<Label f={f} at={v(c1, H / 2)} upright size={13}>1</Label>
				<Block f={f} at={v(c2, 0)} w={w2} h={H} fill={TINT.orange} />
				<Label f={f} at={v(c2, H / 2)} upright size={13}>2</Label>
				{Math.abs(u1) > 0.02 && <Vector f={f} from={v(c1, H + 0.4)} to={v(c1 + u1 * KV, H + 0.4)} color={QTY.velocita} name={letter} sub="1" labelDir={v(0, 1)} labelAt={0.5} />}
				{Math.abs(u2) > 0.02 && <Vector f={f} from={v(c2, H + 0.4)} to={v(c2 + u2 * KV, H + 0.4)} color={QTY.velocita} name={letter} sub="2" labelDir={v(0, 1)} labelAt={0.5} />}
			</Drawing>

			<Readout>
				<Tex>{`V_1 = ${texNum(V1, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`V_2 = ${texNum(V2, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`p_{tot} = ${texNum(p, 2)}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
				<Tex>{`K_{tot} = ${texNum(K, 2)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa del carrello 1 (kg)" value={m1} min={0.5} max={4} step={0.5} onChange={set(setM1)} />
				<Slider label="Massa del carrello 2 (kg)" value={m2} min={0.5} max={4} step={0.5} onChange={set(setM2)} />
				<Slider label="Velocità del 2 verso l'1 (m/s)" value={approach} min={0} max={2} step={0.5} onChange={set(setApproach)} />
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
