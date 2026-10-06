'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Dot, frame, v, num, texNum, useFrameLoop, useReducedMotion, TINT, THIN, DASH } from '../kit';
import { Block, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 85 (Il centro di massa): cart 1 moves at 2 m/s towards cart 2, at rest; they collide elastically or stick
 * together. Masses from 0,5 to 4 kg; each cart is a block whose width grows with the mass. The black dot above the
 * track is the centre of mass of the two carts (of their centres), and it leaves a tick every half second: the ticks
 * are equally spaced before and after the collision, because v_cm = m₁ v₁ / (m₁ + m₂) does not change. Uniform
 * motion before and after, 1 cm of drawing per metre; velocities 0,45 cm per m/s.
 */

type Kind = 'elastico' | 'anelastico';

const V0 = 2; // m/s
const KS = 1, KV = 0.45;
const H = 0.6;
const XA = 2.2; // the right side of cart 1 at the start
const GAP = 2.4; // between the carts at the start, cm
const Y_CM = 1.75; // the height of the centre of mass's line
const TICK = 0.5; // s
const f = frame(0, 10, -0.4, 2.6);

const wOf = (m: number) => 0.6 + 0.2 * m;

export default function CentroMassaUrto({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(1);
	const [m2, setM2] = useState(3);
	const [kind, setKind] = useState<Kind>('elastico');
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const w1 = wOf(m1), w2 = wOf(m2);
	const M = m1 + m2;
	const vcm = (m1 * V0) / M;
	const V1 = kind === 'elastico' ? ((m1 - m2) / M) * V0 : vcm;
	const V2 = kind === 'elastico' ? ((2 * m1) / M) * V0 : vcm;

	const tHit = GAP / (V0 * KS);
	const xHit = XA + GAP;
	// After the collision: until the tip of a velocity arrow reaches the edge of the figure, 2,6 s at most.
	const room = (c: number, V: number) => (Math.abs(V) < 1e-9 ? Infinity : ((V > 0 ? 9.8 - c : c - 0.2) - Math.abs(V) * KV) / (Math.abs(V) * KS));
	const END = tHit + Math.max(0.5, Math.min(2.6, room(xHit - w1 / 2, V1), room(xHit + w2 / 2, V2)));
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

	const centres = (time: number) => {
		const after = time >= tHit;
		return {
			c1: after ? xHit - w1 / 2 + V1 * KS * (time - tHit) : XA - w1 / 2 + V0 * KS * time,
			c2: after ? xHit + w2 / 2 + V2 * KS * (time - tHit) : xHit + w2 / 2
		};
	};
	const cmAt = (time: number) => {
		const { c1, c2 } = centres(time);
		return (m1 * c1 + m2 * c2) / M;
	};
	const after = t >= tHit;
	const { c1, c2 } = centres(t);
	const xcm = cmAt(t);
	const ticks = Array.from({ length: Math.floor(t / TICK + 1e-9) + 1 }, (_, i) => cmAt(i * TICK));
	const u1 = after ? V1 : V0, u2 = after ? V2 : 0;
	const letter = after ? 'V' : 'v';

	let caption: string;
	if (t === 0) caption = `Il centro di massa parte a ${num(vcm, 2)} m/s, più lento del carrello 1 perché il carrello 2 è fermo. Premi Avvia.`;
	else if (!after) caption = `Il centro di massa avanza di ${num(vcm * TICK, 2)} m ogni mezzo secondo.`;
	else if (kind === 'anelastico') caption = `Dopo l'urto i carrelli viaggiano insieme al centro di massa, a ${num(vcm, 2)} m/s: le tacche hanno la stessa distanza di prima.`;
	else caption = `Le velocità dei carrelli sono cambiate, quella del centro di massa no: ancora ${num(vcm, 2)} m/s, con le tacche alla stessa distanza.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0.1, 0)} to={v(9.9, 0)} />
				<path d={f.path([v(0.3, Y_CM), v(9.7, Y_CM)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.5} />
				{ticks.map((x, i) => (
					<path key={i} d={f.path([v(x, Y_CM - 0.12), v(x, Y_CM + 0.12)])} stroke="#000" strokeWidth={THIN} fill="none" />
				))}
				<Block f={f} at={v(c1, 0)} w={w1} h={H} />
				<Label f={f} at={v(c1, H / 2)} upright size={13}>1</Label>
				<Block f={f} at={v(c2, 0)} w={w2} h={H} fill={TINT.orange} />
				<Label f={f} at={v(c2, H / 2)} upright size={13}>2</Label>
				{Math.abs(u1) > 0.02 && <Vector f={f} from={v(c1, H + 0.3)} to={v(c1 + u1 * KV, H + 0.3)} color={QTY.velocita} name={letter} sub={after && kind === 'anelastico' ? undefined : '1'} labelDir={v(0, 1)} labelAt={0.5} />}
				{Math.abs(u2) > 0.02 && kind === 'elastico' && <Vector f={f} from={v(c2, H + 0.3)} to={v(c2 + u2 * KV, H + 0.3)} color={QTY.velocita} name={letter} sub="2" labelDir={v(0, 1)} labelAt={0.5} />}
				<Dot f={f} at={v(xcm, Y_CM)} r={3.2} />
				<Label f={f} at={v(xcm, Y_CM + 0.12)} dir={v(0, 1)} upright size={13}>cm</Label>
			</Drawing>

			<Readout>
				<Tex>{`v_{cm} = \\dfrac{m_1 v_1}{m_1 + m_2} = ${texNum(vcm, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`V_1 = ${texNum(V1, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`V_2 = ${texNum(V2, 2)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa del carrello 1 (kg)" value={m1} min={0.5} max={4} step={0.5} onChange={set(setM1)} />
				<Slider label="Massa del carrello 2 (kg)" value={m2} min={0.5} max={4} step={0.5} onChange={set(setM2)} />
				<ButtonRow>
					<ToggleGroup
						label="Tipo di urto"
						options={[
							{ value: 'elastico', label: 'Elastico' },
							{ value: 'anelastico', label: 'Anelastico' }
						]}
						value={kind}
						onChange={(k) => {
							setKind(k);
							reset();
						}}
					/>
				</ButtonRow>
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
