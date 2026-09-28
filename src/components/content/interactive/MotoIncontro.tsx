'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Dot, frame, v, add, useFrameLoop, useReducedMotion, num, THICK, THIN, TINT, FONT_SIZE, type V } from './kit';

/**
 * Lesson 51, example 6: a car leaves A at 80 km/h and a truck leaves B at 60 km/h, 210 km apart, both at 9. The
 * student moves the time t (in hours) or plays it: the car has gone 80t km, the truck 60t, and they meet when the two
 * add up to 210, at t = 3/2, at 10:30, 120 km from A. Drawn like the TikZ figure: AB is 6 cm, the arrows blue!50 and
 * orange!70 at 0,35 cm above it.
 */

const D = 210;
const V_CAR = 80;
const V_TRUCK = 60;
const MEET = D / (V_CAR + V_TRUCK); // 3/2
const LEN = 6;
const km = (x: number) => (x / D) * LEN;
/** Seconds of animation per hour of the problem. */
const PACE = 3;

const f = frame(-0.55, 6.55, -1.45, 1.45);
const BLUE = '#8080ff'; // blue!50
const ORANGE = '#ffa64d'; // orange!70

const clock = (t: number) => {
	const m = Math.round(t * 60);
	return `${9 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
};

/** A car seen from the side, its front at `at` (on the road) facing `dir` (1 right, −1 left). */
function Car({ at, dir }: { at: V; dir: 1 | -1 }) {
	const p = (x: number, y: number) => add(at, v(-dir * x, y));
	return (
		<g>
			<polygon points={f.pts(p(0, 0.1), p(0.62, 0.1), p(0.62, 0.26), p(0.48, 0.26), p(0.38, 0.4), p(0.16, 0.4), p(0.08, 0.26), p(0, 0.24))} fill={TINT.blue} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			<circle cx={f.px(p(0.14, 0.1)).x} cy={f.px(p(0.14, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
			<circle cx={f.px(p(0.48, 0.1)).x} cy={f.px(p(0.48, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
		</g>
	);
}
function Truck({ at, dir }: { at: V; dir: 1 | -1 }) {
	const p = (x: number, y: number) => add(at, v(-dir * x, y));
	return (
		<g>
			<polygon points={f.pts(p(0.22, 0.1), p(0.78, 0.1), p(0.78, 0.46), p(0.22, 0.46))} fill={TINT.orange} stroke="#000" strokeWidth={THIN} />
			<polygon points={f.pts(p(0, 0.1), p(0.2, 0.1), p(0.2, 0.36), p(0.08, 0.36), p(0, 0.24))} fill={TINT.orange} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			<circle cx={f.px(p(0.13, 0.1)).x} cy={f.px(p(0.13, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
			<circle cx={f.px(p(0.64, 0.1)).x} cy={f.px(p(0.64, 0.1)).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
		</g>
	);
}

/** An arrow along y from x0 to x1, as TikZ's `->` on a thick line. */
function Arrow({ x0, x1, y, color }: { x0: number; x1: number; y: number; color: string }) {
	if (Math.abs(x1 - x0) < 0.02) return null;
	const s = Math.sign(x1 - x0);
	const head = Math.min(0.14, Math.abs(x1 - x0));
	return (
		<g>
			<path d={f.path([v(x0, y), v(x1 - s * head * 0.6, y)])} stroke={color} strokeWidth={THICK} fill="none" />
			<polygon points={f.pts(v(x1, y), v(x1 - s * head, y + 0.07), v(x1 - s * head, y - 0.07))} fill={color} />
		</g>
	);
}

export default function MotoIncontro({ alt }: { alt?: string }) {
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = Math.min(MEET, t + dt / PACE);
		setT(next);
		if (next >= MEET) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(MEET);
		if (t >= MEET) setT(0);
		setPlaying(true);
	};

	const car = V_CAR * t, truck = V_TRUCK * t;
	const met = t >= MEET - 1e-9;
	const xc = km(car), xt = LEN - km(truck);
	const hours = met ? '\\tfrac{3}{2}' : num(t);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, 0), v(LEN, 0)])} stroke="#000" strokeWidth={THICK} />
				<Arrow x0={0} x1={xc} y={0.35} color={BLUE} />
				<Arrow x0={LEN} x1={xt} y={0.35} color={ORANGE} />
				<Label f={f} at={v(Math.max(0.9, xc / 2), 0.62)} dir={v(0, 1)} upright size={13}>
					auto, <tspan fontStyle="italic">80t</tspan>
				</Label>
				<Label f={f} at={v(Math.min(LEN - 1.05, LEN - (LEN - xt) / 2), 0.62)} dir={v(0, 1)} upright size={13}>
					camion, <tspan fontStyle="italic">60t</tspan>
				</Label>
				<Car at={v(xc, 0.02)} dir={1} />
				<Truck at={v(xt, 0.02)} dir={-1} />
				<Dot f={f} at={v(0, 0)} r={3} />
				<Dot f={f} at={v(LEN, 0)} r={3} />
				<Label f={f} at={v(0, -0.08)} dir={v(0, -1)}>A</Label>
				<Label f={f} at={v(LEN, -0.08)} dir={v(0, -1)}>B</Label>
				{met && (
					<>
						<Dot f={f} at={v(km(V_CAR * MEET), 0)} r={3} />
						<Label f={f} at={v(km(V_CAR * MEET), -0.08)} dir={v(0, -1)}>P</Label>
					</>
				)}
				<path d={f.path([v(0.1, -0.95), v(LEN - 0.1, -0.95)])} stroke="#000" strokeWidth={THIN} />
				<polygon points={f.pts(v(0, -0.95), v(0.14, -0.9), v(0.14, -1.0))} fill="#000" />
				<polygon points={f.pts(v(LEN, -0.95), v(LEN - 0.14, -0.9), v(LEN - 0.14, -1.0))} fill="#000" />
				<Label f={f} at={v(LEN / 2, -0.98)} dir={v(0, -1)} upright size={FONT_SIZE}>210 km</Label>
			</Drawing>

			<Readout>
				<span>
					<Tex>{`t = ${hours}`}</Tex> h, ore {clock(t)}
				</span>
				<span>
					auto <Tex>{`80t = ${num(car, 1)}`}</Tex> km
				</span>
				<span>
					camion <Tex>{`60t = ${num(truck, 1)}`}</Tex> km
				</span>
			</Readout>
			<Caption>
				{met ? (
					<>
						Alle 10:30 si incontrano in <Tex>P</Tex>, a 120 km da <Tex>A</Tex>: <Tex>{'80 \\cdot \\tfrac{3}{2} + 60 \\cdot \\tfrac{3}{2} = 120 + 90 = 210'}</Tex>.
					</>
				) : t === 0 ? (
					'Sposta il tempo o premi Avvia: auto e camion partono insieme alle 9.'
				) : (
					<>
						Insieme hanno percorso <Tex>{`80t + 60t = 140t = ${num(car + truck, 1)}`}</Tex> km: ne mancano {num(D - car - truck, 1)} per arrivare a 210.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Tempo t (ore)" value={t} min={0} max={MEET} step={0.05} onChange={(x) => { setPlaying(false); setT(Math.min(MEET, x)); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : met ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna alle 9
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
