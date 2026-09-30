'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, TINT } from '../kit';
import { Block, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 52 (Il terzo principio della dinamica): two skaters on ice push each other for 0,40 s with a force F (50 to
 * 200 N), then glide apart at constant speed (no friction). Masses from 40 to 100 kg on sliders; each skater is a block
 * whose height grows with the mass. During the push the two forces are equal and opposite, red, 0,01 cm per newton,
 * and the accelerations F/m are green, 0,3 cm per m/s²: the lighter skater accelerates more. After the push the
 * velocities are blue, 0,5 cm per m/s. Closed formulas: uniformly accelerated during the push, uniform after; 1 cm of
 * drawing per metre, in real time, until the faster skater reaches the edge of the figure.
 */

const PUSH = 0.4; // s
const KF = 0.01, KA = 0.3, KV = 0.5;
const X = 4.75; // where their hands meet
const W = 0.8;
const f = frame(-0.3, 9.8, -0.4, 3.0);
const ROOM = X - W - (f.x0 + 0.1) - 0.8; // metres a skater can glide before the edge of the figure

const hOf = (m: number) => 0.6 + m / 60;

export default function PattinatoriSpinta({ alt }: { alt?: string }) {
	const [F, setF] = useState(120);
	const [mA, setMA] = useState(50);
	const [mB, setMB] = useState(80);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const aA = F / mA, aB = F / mB;
	// Distance from the start and speed of a skater with acceleration a at time t.
	const motion = (a: number) => {
		if (t <= PUSH) return { d: (a * t * t) / 2, s: a * t };
		return { d: (a * PUSH * PUSH) / 2 + a * PUSH * (t - PUSH), s: a * PUSH };
	};
	const A = motion(aA), B = motion(aB);
	const pushing = t > 0 && t < PUSH;
	const after = t >= PUSH;

	// The animation ends when the faster skater reaches the edge of the figure.
	const aMax = Math.max(aA, aB);
	const END = PUSH + (ROOM - (aMax * PUSH * PUSH) / 2) / (aMax * PUSH);
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
		if (reduced) return setT(PUSH / 2);
		setT(0);
		setRunning(true);
	};

	const xA = X - W / 2 - A.d, xB = X + W / 2 + B.d; // the middles of the two blocks, touching at X before the push
	const hA = hOf(mA), hB = hOf(mB);
	const cA = v(xA, hA / 2), cB = v(xB, hB / 2);
	const show = t === 0 || pushing; // before and during the push: forces and accelerations

	let caption: string;
	if (t === 0) caption = `Premi Spingi: per ${num(PUSH * 1000, 0)} millesimi di secondo A spinge B con ${num(F, 0)} N, e B spinge A con ${num(F, 0)} N nel verso opposto.`;
	else if (pushing) caption = `Le due forze sono uguali, ${num(F, 0)} N, ma A accelera di ${num(aA, 2)} m/s² e B di ${num(aB, 2)} m/s²: ${mA < mB ? 'A ha meno massa e accelera di più' : mA > mB ? 'B ha meno massa e accelera di più' : 'con masse uguali le accelerazioni sono uguali'}.`;
	else caption = `Finita la spinta non ci sono più forze orizzontali: A scivola a ${num(A.s, 2)} m/s e B a ${num(B.s, 2)} m/s, a velocità costante.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(f.x0 + 0.1, 0)} to={v(f.x1 - 0.1, 0)} />
				<Block f={f} at={v(xA, 0)} w={W} h={hA} />
				<Label f={f} at={v(xA, 0.28)} size={14}>A</Label>
				<Block f={f} at={v(xB, 0)} w={W} h={hB} fill={TINT.orange} />
				<Label f={f} at={v(xB, 0.28)} size={14}>B</Label>
				{show && (
					<>
						<Vector f={f} from={cA} to={v(xA - F * KF, hA / 2)} color={QTY.forza} name="F" sub="BA" labelDir={v(0, 1)} />
						<Vector f={f} from={cB} to={v(xB + F * KF, hB / 2)} color={QTY.forza} name="F" sub="AB" labelDir={v(0, 1)} />
						<Vector f={f} from={v(xA, hA + 0.35)} to={v(xA - aA * KA, hA + 0.35)} color={QTY.accelerazione} name="a" sub="A" labelDir={v(-1, 0)} />
						<Vector f={f} from={v(xB, hB + 0.35)} to={v(xB + aB * KA, hB + 0.35)} color={QTY.accelerazione} name="a" sub="B" labelDir={v(1, 0)} />
					</>
				)}
				{after && (
					<>
						<Vector f={f} from={add(cA, v(0, hA / 2 + 0.35))} to={add(cA, v(-A.s * KV, hA / 2 + 0.35))} color={QTY.velocita} name="v" sub="A" labelDir={v(-1, 0)} />
						<Vector f={f} from={add(cB, v(0, hB / 2 + 0.35))} to={add(cB, v(B.s * KV, hB / 2 + 0.35))} color={QTY.velocita} name="v" sub="B" labelDir={v(1, 0)} />
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`F_{AB} = F_{BA} = ${texNum(F, 0)}\\,\\text{N}`}</Tex>
				<Tex>{`a_A = \\dfrac{F}{m_A} = ${texNum(aA, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`a_B = \\dfrac{F}{m_B} = ${texNum(aB, 2)}\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Forza della spinta F (newton)" value={F} min={50} max={200} step={10} onChange={set(setF)} />
				<Slider label="Massa di A (kg)" value={mA} min={40} max={100} step={5} onChange={set(setMA)} />
				<Slider label="Massa di B (kg)" value={mB} min={40} max={100} step={5} onChange={set(setMB)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={running}>
						<Play className="size-4" aria-hidden="true" />
						Spingi
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
