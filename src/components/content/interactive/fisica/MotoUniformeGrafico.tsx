'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useFrameLoop, useReducedMotion, texNum, THICK, THIN, INK } from '../kit';
import { GraphAxes, Road, TopVehicle, Txt, at, type GraphScale } from './stradaGrafico';

/**
 * Lesson 40 (Il moto rettilineo uniforme e il grafico spazio-tempo): a car on a straight road, drawn upright on the
 * left with the same vertical scale as the space-time graph beside it. The student sets the starting position s0
 * (0 to 120 m) and the velocity v (−10 to 10 m/s), then plays the time or moves it: the car goes along the road with
 * s = s0 + v t and its graph is traced as it goes, a straight line that starts at s0 on the s axis and whose slope is
 * v. A dashed line joins the car to its point on the graph. The motion stops at 12 s or at the end of the road.
 */

const g: GraphScale = { tMax: 12, sMax: 120, w: 6, h: 4.2 };
const f = frame(-2.15, 7.1, -0.75, 4.85);
const LINE = '#6666ff'; // blue!60, the lessons' graphs
const ROAD_X0 = -1.9, ROAD_X1 = -1.1;
/** Seconds of animation per second of the motion. */
const PACE = 0.6;

export default function MotoUniformeGrafico({ alt }: { alt?: string }) {
	const [s0, setS0] = useState(20);
	const [vel, setVel] = useState(8);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	// The motion ends at 12 s or when the car reaches an end of the road.
	const tEnd = Math.min(g.tMax, vel > 0 ? (g.sMax - s0) / vel : vel < 0 ? s0 / -vel : g.tMax);
	const s = s0 + vel * t;
	const done = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt / PACE);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(tEnd);
		if (done) setT(0);
		setPlaying(true);
	};
	const restart = () => {
		setPlaying(false);
		setT(0);
	};

	const p0 = at(g, 0, s0), p = at(g, t, s);
	const car = v((ROAD_X0 + ROAD_X1) / 2, p.y);

	let caption: string;
	if (vel === 0) caption = `Con v = 0 l’auto resta ferma in ${s0} m: il grafico è una retta orizzontale, con pendenza zero.`;
	else if (t === 0) caption = 'Premi Avvia o sposta il tempo: il grafico si disegna mentre l’auto si muove.';
	else if (vel > 0) caption = `La retta parte da s₀ = ${s0} m sull’asse s e sale di ${vel} m ogni secondo: la pendenza è la velocità, ${vel} m/s.`;
	else caption = `La retta parte da s₀ = ${s0} m e scende di ${-vel} m ogni secondo: l’auto va nel verso negativo, e la pendenza è la velocità, −${-vel} m/s.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Road f={f} x0={ROAD_X0} x1={ROAD_X1} h={g.h} />
				<GraphAxes f={f} g={g} tStep={2} sStep={20} />
				{t > 0 && <path d={f.path([p0, p])} stroke={LINE} strokeWidth={THICK * 1.3} fill="none" />}
				<path d={f.path([v(ROAD_X1 + 0.05, p.y), p])} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
				<circle cx={f.px(p0).x} cy={f.px(p0).y} r={3.2} fill={INK.orange} />
				<Txt f={f} p={v(p0.x + 0.14, p0.y + (vel < 0 ? 0.22 : -0.22))} anchor="start" italic color={INK.orange} size={14}>
					s₀
				</Txt>
				<circle cx={f.px(p).x} cy={f.px(p).y} r={3.2} fill="#000" />
				<TopVehicle f={f} c={car} dir={vel < 0 ? -1 : 1} />
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<Tex>{`s = s_0 + v\\,t = ${s0} ${vel < 0 ? '-' : '+'} ${Math.abs(vel)} \\cdot ${texNum(t, 1)} = ${texNum(s, 1)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Posizione iniziale s₀ (m)" value={s0} min={0} max={120} step={10} onChange={(x) => { restart(); setS0(x); }} />
				<Slider label="Velocità v (m/s)" value={vel} min={-10} max={10} step={1} onChange={(x) => { restart(); setVel(x); }} />
				<Slider label="Tempo t (secondi)" value={t} min={0} max={g.tMax} step={0.1} onChange={(x) => { setPlaying(false); setT(Math.min(tEnd, x)); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={tEnd <= 0}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : done && t > 0 ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={restart}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna a t = 0
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
