'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useFrameLoop, useReducedMotion, texNum, num, THICK, THIN, TINT } from '../kit';
import { GraphAxes, Road, TopVehicle, Txt, at, type GraphScale } from './stradaGrafico';

/**
 * Lesson 40 (Il moto rettilineo uniforme e il grafico spazio-tempo), examples 4 and 5: two vehicles in uniform motion
 * on the same straight road, drawn upright beside their space-time graph with the same vertical scale. "Incontro": a
 * car leaves s = 0 at 8 m/s and a truck leaves s = 420 m at −6 m/s; they meet at 30 s, at 240 m. "Inseguimento": a
 * car leaves s = 0 at 30 m/s behind a truck at s = 200 m going at 22 m/s; it catches up at 25 s, at 750 m. The student
 * plays or moves the time: the two lines are traced, and where they cross (the same position at the same instant)
 * the meeting point is marked, with its coordinates. Colours as the TikZ figures: blue!50 and orange!70.
 */

type Case = 'incontro' | 'inseguimento';
const CASES: Record<Case, { label: string; g: GraphScale; tStep: number; sStep: number; a: [number, number]; b: [number, number]; meet: [number, number] }> = {
	incontro: { label: 'Si vengono incontro', g: { tMax: 40, sMax: 450, w: 6, h: 4.2 }, tStep: 5, sStep: 50, a: [0, 8], b: [420, -6], meet: [30, 240] },
	inseguimento: { label: 'Inseguimento', g: { tMax: 30, sMax: 900, w: 6, h: 4.2 }, tStep: 5, sStep: 100, a: [0, 30], b: [200, 22], meet: [25, 750] },
};
const f = frame(-2.15, 7.1, -0.75, 4.85);
const BLUE = '#8080ff'; // blue!50
const ORANGE = '#ffa64d'; // orange!70
const ROAD_X0 = -1.9, ROAD_X1 = -1.1;
/** Seconds of animation per second of the motion. */
const PACE = 0.2;

export default function IncontroRette({ alt }: { alt?: string }) {
	const [which, setWhich] = useState<Case>('incontro');
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const C = CASES[which];
	const g = C.g;
	const tEnd = g.tMax;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt / PACE);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(tEnd);
		if (t >= tEnd) setT(0);
		setPlaying(true);
	};
	const choose = (c: Case) => {
		setPlaying(false);
		setT(0);
		setWhich(c);
	};

	const sa = C.a[0] + C.a[1] * t, sb = C.b[0] + C.b[1] * t;
	const pa = at(g, t, sa), pb = at(g, t, sb);
	const met = t >= C.meet[0] - 1e-9;
	const P = at(g, C.meet[0], C.meet[1]);
	// Traffic keeps to the right: going up is the right lane; in the chase the car overtakes on the left.
	const left = ROAD_X0 + 0.2, right = ROAD_X1 - 0.2;
	const laneA = which === 'incontro' ? right : left, laneB = which === 'incontro' ? left : right;

	let caption: string;
	if (t === 0) caption = which === 'incontro' ? 'L’auto parte da s = 0 verso l’alto, il camion da 420 m verso il basso. Premi Avvia.' : 'L’auto parte da s = 0 a 30 m/s, il camion è 200 m più avanti a 22 m/s. Premi Avvia.';
	else if (!met) caption = `Le due rette non si sono ancora tagliate: tra l’auto e il camion ci sono ancora ${num(Math.abs(sb - sa), 0)} m.`;
	else caption = `Le rette si tagliano nel punto P: a t = ${C.meet[0]} s l’auto e il camion sono tutti e due in s = ${C.meet[1]} m. È l’istante dell’incontro.`;

	const eq = (x: [number, number]) => `${x[0] ? `${x[0]} ${x[1] < 0 ? '-' : '+'} ${Math.abs(x[1])}\\,t` : `${x[1]}\\,t`}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Road f={f} x0={ROAD_X0} x1={ROAD_X1} h={g.h} />
				<GraphAxes f={f} g={g} tStep={C.tStep} sStep={C.sStep} />
				{met && (
					<g>
						<path d={f.path([v(0, P.y), P, v(P.x, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
						<Txt f={f} p={v(P.x - 0.1, P.y + 0.25)} anchor="end" italic size={15}>
							P
						</Txt>
					</g>
				)}
				{t > 0 && <path d={f.path([at(g, 0, C.a[0]), pa])} stroke={BLUE} strokeWidth={THICK * 1.4} fill="none" />}
				{t > 0 && <path d={f.path([at(g, 0, C.b[0]), pb])} stroke={ORANGE} strokeWidth={THICK * 1.4} fill="none" />}
				{met && <circle cx={f.px(P).x} cy={f.px(P).y} r={3.6} fill="#000" />}
				<circle cx={f.px(pa).x} cy={f.px(pa).y} r={3} fill={BLUE} />
				<circle cx={f.px(pb).x} cy={f.px(pb).y} r={3} fill={ORANGE} />
				<path d={f.path([v(ROAD_X1 + 0.05, pa.y), pa])} stroke={BLUE} strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
				<path d={f.path([v(ROAD_X1 + 0.05, pb.y), pb])} stroke={ORANGE} strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
				<TopVehicle f={f} c={v(laneA, pa.y)} dir={1} fill={TINT.blue} />
				<TopVehicle f={f} c={v(laneB, pb.y)} dir={C.b[1] < 0 ? -1 : 1} fill={TINT.orange} long />
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<span>
					auto <Tex>{`s_A = ${eq(C.a)} = ${texNum(sa, 1)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					camion <Tex>{`s_B = ${eq(C.b)} = ${texNum(sb, 1)}\\,\\text{m}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Moto" options={(Object.keys(CASES) as Case[]).map((k) => ({ value: k, label: CASES[k].label }))} value={which} onChange={choose} />
				</div>
				<Slider label="Tempo t (secondi)" value={t} min={0} max={tEnd} step={0.5} onChange={(x) => { setPlaying(false); setT(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= tEnd ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna a t = 0
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
