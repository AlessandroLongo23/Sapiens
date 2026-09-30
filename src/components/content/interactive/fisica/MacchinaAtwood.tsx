'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, THICK } from '../kit';
import { Block, Ground, Pulley, Thread, Vector, QTY } from '../fisica';

/**
 * Lesson 55 (Corpi collegati e tensione dei fili), "La macchina di Atwood": a pulley hanging from the ceiling with a
 * thread carrying m1 on the left and m2 on the right, each from 0,1 to 2,0 kg. The closed laws of the lesson:
 * a = (m2 − m1) g / (m1 + m2), T = 2 m1 m2 g / (m1 + m2); from rest the heavier mass goes down by a t²/2 and the other
 * goes up as much, until one of them reaches the end of its run (0,7 m from the start). Weights and tension are drawn
 * from each block's centre at 0,05 cm per newton, the tension the same on both sides; the blocks grow with their mass.
 *
 * Drawn at 2 cm per metre; the blocks start level, 1,4 m under the pulley.
 */

const G = 9.8;
const S = 2; // cm per metre
const R = 0.45; // pulley radius, cm
const Y0 = -2.9; // the blocks' centres at the start, cm
const RUN = 0.7; // metres each block can move
const KF = 0.05; // cm per newton
const BW = 0.6;
const f = frame(-2.45, 2.45, -5.45, 0.95);

const blockH = (m: number) => 0.25 + 0.25 * m;

export default function MacchinaAtwood({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(1.2);
	const [m2, setM2] = useState(1.5);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const a = ((m2 - m1) * G) / (m1 + m2); // positive: m2 goes down
	const T = (2 * m1 * m2 * G) / (m1 + m2);
	const tEnd = Math.abs(a) < 1e-9 ? Infinity : Math.sqrt((2 * RUN) / Math.abs(a));
	const s = 0.5 * a * t * t; // m2's descent, metres (negative: m2 goes up)
	const ended = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(Math.round(x * 10) / 10);
	};
	const play = () => {
		if (playing) return setPlaying(false);
		if (a === 0) return;
		if (reduced) return setT(tEnd);
		if (ended) setT(0);
		setPlaying(true);
	};

	const c1 = v(-R, Y0 + s * S);
	const c2 = v(R, Y0 - s * S);
	const h1 = blockH(m1), h2 = blockH(m2);
	const P1 = m1 * G, P2 = m2 * G;
	const vNow = a * t;
	/** The acceleration's arrow: 0,25 cm plus 0,15 cm per m/s², at most 1,2 cm. */
	const accLen = Math.min(1.2, 0.25 + 0.15 * Math.abs(a));

	const heavier = m2 > m1 ? 'destra' : 'sinistra';
	let caption: string;
	if (Math.abs(m1 - m2) < 1e-9) caption = 'Le masse sono uguali: la tensione bilancia ciascun peso, e il sistema resta fermo. Cambia una delle due masse.';
	else if (t === 0) caption = `La massa di ${heavier} è più pesante: lasciato andare, il sistema accelera di ${num(Math.abs(a), 2)} m/s², e la tensione, ${num(T, 1)} N, sta tra i due pesi.`;
	else if (ended) caption = `Dopo ${num(t, 2)} s le masse si sono spostate di ${num(RUN, 1)} m, e si muovono a ${num(Math.abs(vNow), 2)} m/s.`;
	else caption = `La massa di ${heavier} scende e l'altra sale, con la stessa accelerazione di ${num(Math.abs(a), 2)} m/s²: la velocità cresce in proporzione al tempo.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(1.3, 0.8)} to={v(-1.3, 0.8)} />
				<path d={f.path([v(0, 0.8), v(0, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Thread f={f} from={v(-R, 0)} to={add(c1, v(0, h1 / 2))} />
				<Thread f={f} from={v(R, 0)} to={add(c2, v(0, h2 / 2))} />
				<Pulley f={f} at={v(0, 0)} r={R} />
				<Block f={f} at={add(c1, v(0, -h1 / 2))} w={BW} h={h1} />
				<Block f={f} at={add(c2, v(0, -h2 / 2))} w={BW} h={h2} />
				<Label f={f} at={add(c1, v(-BW / 2 - 0.05, 0))} dir={v(-1, 0)}>
					m<tspan fontSize={10} dy={3}>1</tspan>
				</Label>
				<Label f={f} at={add(c2, v(BW / 2 + 0.05, 0))} dir={v(1, 0)}>
					m<tspan fontSize={10} dy={3}>2</tspan>
				</Label>
				<Vector f={f} from={c1} to={add(c1, v(0, T * KF))} color={QTY.forza} name="T" labelDir={v(-1, 0)} labelAt={0.85} />
				<Vector f={f} from={c1} to={add(c1, v(0, -P1 * KF))} color={QTY.forza} name="P" sub="1" labelDir={v(-1, 0)} labelAt={0.8} />
				<Vector f={f} from={c2} to={add(c2, v(0, T * KF))} color={QTY.forza} name="T" labelDir={v(1, 0)} labelAt={0.85} />
				<Vector f={f} from={c2} to={add(c2, v(0, -P2 * KF))} color={QTY.forza} name="P" sub="2" labelDir={v(1, 0)} labelAt={0.8} />
				{Math.abs(a) > 1e-9 && (
					<>
						<Vector f={f} from={add(c1, v(-1.55, -accLen / 2 * Math.sign(a)))} to={add(c1, v(-1.55, (accLen / 2) * Math.sign(a)))} color={QTY.accelerazione} name="a" labelDir={v(-1, 0)} labelAt={0.5} />
						<Vector f={f} from={add(c2, v(1.55, (accLen / 2) * Math.sign(a)))} to={add(c2, v(1.55, -accLen / 2 * Math.sign(a)))} color={QTY.accelerazione} name="a" labelDir={v(1, 0)} labelAt={0.5} />
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`a = \\dfrac{m_2 - m_1}{m_1 + m_2}\\,g = ${texNum(Math.abs(a), 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`T = \\dfrac{2\\,m_1 m_2}{m_1 + m_2}\\,g = ${texNum(T, 2)}\\,\\text{N}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`P_1 = ${texNum(P1, 2)}\\,\\text{N}`}</Tex>
				<Tex>{`P_2 = ${texNum(P2, 2)}\\,\\text{N}`}</Tex>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`v = ${texNum(Math.abs(vNow), 2)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa m₁" unit="kg" value={m1} min={0.1} max={2} step={0.1} onChange={change(setM1)} />
				<Slider label="Massa m₂" unit="kg" value={m2} min={0.1} max={2} step={0.1} onChange={change(setM2)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={Math.abs(a) < 1e-9}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : ended ? 'Riparti' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta alla partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
