'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, scale, sub, polar, useFrameLoop, useReducedMotion, texNum, num, THIN } from '../kit';
import { Ball } from '../fisica';
import { Asta, Perno, ArcoRotazione, Quota } from './leve';

/**
 * Lesson 87 (Il momento d'inerzia), "Il momento d'inerzia di più masse": a light rod seen from above, pivoted at its
 * centre, carries two equal masses m (0,5 to 2,0 kg) at the same distance r from the axis (0,4 to 1,0 m). A constant
 * moment of 0,40 N·m acts on it for four seconds. I = 2mr², α = M/I, ω = αt, θ = αt²/2: with the masses twice as far
 * the rod turns a quarter as much in the same time.
 *
 * Drawn at 2 cm per metre; the balls grow with their mass.
 */

const M0 = 0.4; // N·m
const T_RUN = 4; // s
const S = 2; // cm per metre
const HALF = 2.25; // half the rod, cm
const ROD_H = 0.1;
const f = frame(-2.7, 2.7, -2.7, 2.7);

export default function AstaMasseMomentoInerzia({ alt }: { alt?: string }) {
	const [r, setR] = useState(0.5);
	const [m, setM] = useState(1);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const I = 2 * m * r * r;
	const alpha = M0 / I;
	const w = alpha * t;
	const theta = 0.5 * alpha * t * t;
	const ended = t >= T_RUN - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T_RUN, t + dt);
		setT(next);
		if (next >= T_RUN) setPlaying(false);
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(Math.round(x * 10) / 10);
	};
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(ended ? 0 : T_RUN);
		if (ended) setT(0);
		setPlaying(true);
	};

	const u = polar(1, theta);
	const n = v(-u.y, u.x);
	const off = scale(n, ROD_H / 2);
	const A = scale(u, r * S), B = scale(u, -r * S);
	const ballR = 0.14 + 0.07 * m;
	const turns = theta / (2 * Math.PI);

	let caption: string;
	if (t === 0) caption = `Le due masse danno all'asta un momento d'inerzia di ${num(I, 2)} kg·m²: con un momento di ${num(M0, 2)} N·m l'accelerazione angolare è ${num(alpha, 2)} rad/s².`;
	else if (ended) caption = `In ${num(T_RUN, 0)} s l'asta ha fatto ${num(turns, 2)} giri e ora gira a ${num(w, 2)} rad/s. Sposta le masse a una distanza diversa e riprova con lo stesso momento.`;
	else caption = `Il momento è sempre ${num(M0, 2)} N·m: la velocità angolare cresce di ${num(alpha, 2)} rad/s ogni secondo.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Asta f={f} from={sub(scale(u, -HALF), off)} to={sub(scale(u, HALF), off)} h={ROD_H} />
				<Ball f={f} at={A} r={ballR} />
				<Ball f={f} at={B} r={ballR} />
				<Perno f={f} at={v(0, 0)} />
				{!ended && <ArcoRotazione f={f} c={v(0, 0)} r={0.45} a0={theta + 0.5} a1={theta + 2.4} />}
				{t === 0 && (
					<>
						<Quota f={f} a={v(0, -0.55)} b={v(r * S, -0.55)} />
						<Label f={f} at={v((r * S) / 2, -0.6)} dir={v(0, -1)}>r</Label>
					</>
				)}
				<path d={f.path([v(-2.55, -2.5), v(-0.55, -2.5)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={`${f.path([v(-2.55, -2.43), v(-2.55, -2.57)])} ${f.path([v(-0.55, -2.43), v(-0.55, -2.57)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-1.55, -2.5)} dir={v(0, 1)} upright size={12}>1 m</Label>
			</Drawing>

			<Readout>
				<Tex>{`I = 2\\,m\\,r^2 = ${texNum(I, 2)}\\,\\text{kg}\\cdot\\text{m}^2`}</Tex>
				<Tex>{`\\alpha = \\dfrac{M}{I} = ${texNum(alpha, 2)}\\,\\text{rad/s}^2`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<Tex>{`\\omega = ${texNum(w, 2)}\\,\\text{rad/s}`}</Tex>
				<Tex>{`\\text{giri} = ${texNum(turns, 2)}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Distanza r (m)" value={r} min={0.4} max={1} step={0.1} onChange={change(setR)} />
				<Slider label="Massa m (kg)" value={m} min={0.5} max={2} step={0.1} onChange={change(setM)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : ended ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta da fermo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
