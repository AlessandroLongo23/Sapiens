'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, useFrameLoop, useReducedMotion, num, texNum, THIN, TINT, type V } from '../kit';
import { Arrow, Axes, Ground, QTY } from '../fisica';

/**
 * Lesson 42 (Il moto uniformemente accelerato): a car on a straight road, with sliders for its initial velocity v0
 * (0 to 20 m/s) and its acceleration a (-5 to +3 m/s²). A button starts the clock, which runs to 8 s. Beside the road
 * the v-t graph (a line, with the area under it filled: the distance so far) and the s-t graph (an arc of parabola)
 * are traced instant by instant. With a negative acceleration the car slows down and stops at t = v0/|a|: from there
 * the brakes hold it, v stays 0 and s stays put (the law of the uniformly accelerated motion no longer applies).
 * Closed formulas, no integration. The scales of the road and of the graphs follow the largest s and v the chosen
 * motion reaches in 8 s, rounded up to a round number, so every motion fills the drawing.
 */

const T = 8; // s, length of the run
const PACE = 1.5; // seconds of the problem per second of animation

const f = frame(-0.55, 9.25, -0.75, 5.35);
const ROAD_Y = 4.0, ROAD_X0 = 0.2, ROAD_LEN = 8.2; // road, cm
const GW = 3.4, GH = 2.4; // each graph, cm
const VT = v(0.35, 0.3), ST = v(5.35, 0.3); // graph origins

const NICE = [2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300];
const nice = (x: number) => NICE.find((n) => n >= x - 1e-9) ?? Math.ceil(x / 100) * 100;

/** The motion: velocity and position at time t, with the stop of a braking car. */
function motion(v0: number, a: number, t: number) {
	const stop = a < 0 ? v0 / -a : Infinity;
	const tt = Math.min(t, stop);
	return { v: v0 + a * tt, s: v0 * tt + 0.5 * a * tt * tt, stopped: t >= stop - 1e-9, stop };
}

/** A car seen from the side, its front at `at`, facing right. */
function Car({ at }: { at: V }) {
	const p = (x: number, y: number) => add(at, v(-x, y));
	return (
		<g>
			<polygon points={f.pts(p(0, 0.1), p(0.62, 0.1), p(0.62, 0.26), p(0.48, 0.26), p(0.38, 0.4), p(0.16, 0.4), p(0.08, 0.26), p(0, 0.24))} fill={TINT.blue} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			<circle cx={f.px(p(0.14, 0.1)).x} cy={f.px(p(0.14, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
			<circle cx={f.px(p(0.48, 0.1)).x} cy={f.px(p(0.48, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
		</g>
	);
}

export default function AutoAccelerataGrafici({ alt }: { alt?: string }) {
	const [v0, setV0] = useState(10);
	const [a, setA] = useState(1.5);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T, t + dt * PACE);
		setT(next);
		if (next >= T) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(T);
		if (t >= T) setT(0);
		setPlaying(true);
	};
	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(x);
	};

	const end = motion(v0, a, T);
	const Vmax = nice(Math.max(v0, end.v, 1));
	const Smax = nice(Math.max(end.s, 1));
	const now = motion(v0, a, t);

	// Graph points, sampled from 0 to t.
	const N = 80;
	const ts = Array.from({ length: N + 1 }, (_, i) => (t * i) / N);
	const vt = (x: number, y: number) => v(VT.x + (x / T) * GW, VT.y + (y / Vmax) * GH);
	const st = (x: number, y: number) => v(ST.x + (x / T) * GW, ST.y + (y / Smax) * GH);
	const vPts = ts.map((x) => vt(x, motion(v0, a, x).v));
	const sPts = ts.map((x) => st(x, motion(v0, a, x).s));
	const area = t > 0 ? [vt(0, 0), ...vPts, vt(t, 0)] : [];

	const front = v(ROAD_X0 + 0.62 + (now.s / Smax) * (ROAD_LEN - 0.7), ROAD_Y + 0.02);
	const centre = add(front, v(-0.31, 0.28));
	const vLen = (now.v / Vmax) * 1.3;
	const aNow = now.stopped ? 0 : a;

	let caption: string;
	if (t === 0) caption = a < 0 ? 'Accelerazione negativa: l\'auto frenerà. Premi Avvia.' : 'Scegli la velocità iniziale e l\'accelerazione, poi premi Avvia.';
	else if (now.stopped) caption = `L'auto si è fermata dopo ${num(now.stop, 1)} s, in ${num(now.s, 1)} m: da qui la velocità resta zero, i freni non la spingono indietro.`;
	else if (a > 0) caption = `La velocità cresce di ${num(a, 1)} m/s ogni secondo: il grafico v-t è una retta che sale, il grafico s-t una parabola sempre più ripida.`;
	else if (a < 0) caption = `La velocità cala di ${num(-a, 1)} m/s ogni secondo: il grafico s-t si appiattisce.`;
	else caption = 'Con accelerazione zero il moto è uniforme: il grafico v-t è orizzontale, il grafico s-t una retta.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0, ROAD_Y)} to={v(ROAD_X0 + ROAD_LEN + 0.3, ROAD_Y)} />
				<path d={f.path([v(ROAD_X0, ROAD_Y - 0.08), v(ROAD_X0, ROAD_Y + 0.12)])} stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v(ROAD_X0, ROAD_Y - 0.12)} dir={v(0, -1)} upright size={12}>0</Label>
				<Label f={f} at={v(ROAD_X0 + ROAD_LEN, ROAD_Y - 0.12)} dir={v(0, -1)} upright size={12}>{`${Smax} m`}</Label>
				<Car at={front} />
				{Math.abs(vLen) > 0.03 && <Arrow f={f} from={add(centre, v(0, 0.3))} to={add(centre, v(vLen, 0.3))} color={QTY.velocita} />}
				{Math.abs(vLen) > 0.03 && <Label f={f} at={add(centre, v(vLen, 0.3))} dir={v(1, 0)} color={QTY.velocita} size={13}>v</Label>}
				{aNow !== 0 && <Arrow f={f} from={add(centre, v(0, 0.62))} to={add(centre, v((aNow / 5) * 0.9, 0.62))} color={QTY.accelerazione} />}
				{aNow !== 0 && <Label f={f} at={add(centre, v((aNow / 5) * 0.9, 0.62))} dir={v(Math.sign(aNow), 0)} color={QTY.accelerazione} size={13}>a</Label>}

				{/* v-t */}
				{area.length > 2 && <path d={f.path(area, true)} fill={TINT.blue} stroke="none" />}
				<Axes f={f} o={VT} x0={VT.x} x1={VT.x + GW + 0.35} y0={VT.y} y1={VT.y + GH + 0.4} xName="t" yName="v" />
				{vPts.length > 1 && t > 0 && <path d={f.path(vPts)} stroke={QTY.velocita} strokeWidth={1.2} fill="none" />}
				{/* s-t */}
				<Axes f={f} o={ST} x0={ST.x} x1={ST.x + GW + 0.35} y0={ST.y} y1={ST.y + GH + 0.4} xName="t" yName="s" />
				{sPts.length > 1 && t > 0 && <path d={f.path(sPts)} stroke={QTY.velocita} strokeWidth={1.2} fill="none" />}
				{[
					[VT, Vmax, 'm/s'],
					[ST, Smax, 'm']
				].map(([o, max, u]) => {
					const O = o as V;
					return (
						<g key={u as string}>
							<path d={f.path([v(O.x - 0.07, O.y + GH), v(O.x + 0.07, O.y + GH)])} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(O.x - 0.08, O.y + GH)} dir={v(-1, 0)} upright size={11}>{String(max)}</Label>
							<path d={f.path([v(O.x + GW, O.y - 0.07), v(O.x + GW, O.y + 0.07)])} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(O.x + GW, O.y - 0.1)} dir={v(0, -1)} upright size={11}>{`${T} s`}</Label>
							<Label f={f} at={v(O.x + 0.05, O.y + GH + 0.42)} dir={v(1, 0)} upright size={11}>{`(${u})`}</Label>
						</g>
					);
				})}
				{t > 0 && <circle cx={f.px(vt(t, now.v)).x} cy={f.px(vt(t, now.v)).y} r={2.6} fill={QTY.velocita} />}
				{t > 0 && <circle cx={f.px(st(t, now.s)).x} cy={f.px(st(t, now.s)).y} r={2.6} fill={QTY.velocita} />}
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<Tex>{`v = ${texNum(now.v, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`s = ${texNum(now.s, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`a = ${texNum(aNow, 1)}\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Velocità iniziale v₀ (m/s)" value={v0} min={0} max={20} step={1} onChange={change(setV0)} />
				<Slider label="Accelerazione a (m/s²)" value={a} min={-5} max={3} step={0.5} onChange={change(setA)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= T ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Da capo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
