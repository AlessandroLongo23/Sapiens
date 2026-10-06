'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, polar, num, texNum, useFrameLoop, useReducedMotion, THICK, THIN } from '../kit';
import { Block, Ground, Pulley, Thread, Vector, QTY } from '../fisica';

/**
 * Lesson 88 (Momento torcente e dinamica delle rotazioni), "La carrucola con massa": a disc pulley of mass M (0 to
 * 8 kg) and radius 0,10 m hangs from the ceiling, with a rope wound on it that carries a bucket of mass m (1 to
 * 4 kg). The closed laws of the lesson's example 4: a = mg / (m + M/2), T = Ma/2, α = a/R; released from rest the
 * bucket goes down by at²/2 for 1,5 m while the pulley turns by the same length of rope. Weight and tension are drawn
 * from the bucket's centre at 0,06 cm per newton.
 *
 * Drawn at 1,2 cm per metre of descent; the pulley is drawn larger than to scale, with a spoke that shows it turning.
 */

const G = 9.8;
const R_REAL = 0.1; // m
const R = 0.6; // the pulley as drawn, cm
const S = 1.2; // cm per metre
const RUN = 1.5; // m
const KF = 0.06; // cm per newton
const TOP0 = -1.2; // the bucket's top at the start, cm
const BW = 0.7, BH = 0.55;
const f = frame(-2.4, 2.4, -5.85, 1.3);

export default function CarrucolaMassaSecchio({ alt }: { alt?: string }) {
	const [M, setM] = useState(4);
	const [m, setMass] = useState(2);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const a = (m * G) / (m + M / 2);
	const T = (M * a) / 2;
	const P = m * G;
	const tEnd = Math.sqrt((2 * RUN) / a);
	const s = Math.min(RUN, 0.5 * a * t * t); // metres
	const ended = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(Math.round(x * 2) / 2);
	};
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(ended ? 0 : tEnd);
		if (ended) setT(0);
		setPlaying(true);
	};

	const top = TOP0 - s * S;
	const c = v(R, top - BH / 2);
	const spoke = polar(R, 0.75 * Math.PI - s / R_REAL);
	const accLen = 0.25 + 0.1 * a;

	let caption: string;
	if (M === 0) caption = `Una carrucola senza massa gira senza bisogno di momento: la fune non è tesa e il secchio cade con l'accelerazione di gravità, ${num(G, 1)} m/s².`;
	else if (t === 0) caption = `La fune deve far girare la carrucola: è tesa con ${num(T, 1)} N, meno del peso del secchio, e il secchio scende con ${num(a, 2)} m/s² invece di ${num(G, 1)}.`;
	else if (ended) caption = `Il secchio è sceso di ${num(RUN, 1)} m in ${num(tEnd, 2)} s; in caduta libera ne avrebbe impiegati ${num(Math.sqrt((2 * RUN) / G), 2)} s.`;
	else caption = `Il secchio scende e la carrucola gira sempre più in fretta: la sua accelerazione angolare è ${num(a / R_REAL, 1)} rad/s².`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(1.3, 1.1)} to={v(-1.3, 1.1)} />
				<path d={f.path([v(0, 1.1), v(0, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Thread f={f} from={v(R, 0)} to={v(R, top)} />
				<Pulley f={f} at={v(0, 0)} r={R} />
				<path d={f.path([v(0, 0), spoke])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-R - 0.05, 0)} dir={v(-1, 0)}>M</Label>
				<Block f={f} at={v(R, top - BH)} w={BW} h={BH} />
				<Label f={f} at={add(c, v(-BW / 2 - 0.05, 0))} dir={v(-1, 0)}>m</Label>
				{T * KF > 0.06 && <Vector f={f} from={c} to={add(c, v(0, T * KF))} color={QTY.forza} name="T" labelDir={v(1, 0)} labelAt={0.7} />}
				<Vector f={f} from={c} to={add(c, v(0, -P * KF))} color={QTY.forza} name="P" labelDir={v(1, 0)} labelAt={0.85} />
				<Vector f={f} from={add(c, v(1.35, accLen / 2))} to={add(c, v(1.35, -accLen / 2))} color={QTY.accelerazione} name="a" labelDir={v(1, 0)} labelAt={0.5} />
			</Drawing>

			<Readout>
				<Tex>{`a = \\dfrac{m\\,g}{m + \\frac{1}{2}M} = ${texNum(a, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`T = \\dfrac{1}{2}\\,M\\,a = ${texNum(T, 1)}\\,\\text{N}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`P = m\\,g = ${texNum(P, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`\\alpha = \\dfrac{a}{R} = ${texNum(a / R_REAL, 1)}\\,\\text{rad/s}^2`}</Tex>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Carrucola M (kg)" value={M} min={0} max={8} step={0.5} onChange={change(setM)} />
				<Slider label="Secchio m (kg)" value={m} min={1} max={4} step={0.5} onChange={change(setMass)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : ended ? 'Riparti' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta su
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
