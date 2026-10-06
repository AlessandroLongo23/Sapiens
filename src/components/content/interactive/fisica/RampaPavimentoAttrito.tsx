'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, sub, dist, lerp, ang, useFrameLoop, useReducedMotion, TINT, THIN, THICK, DASH, FONT, FONT_SIZE, type V } from '../kit';
import { Block, Ground } from '../fisica';
import { EnergyBars, ENERGY_FILL, barsWidth } from './energia';

/**
 * Lesson 79 (Il bilancio dell'energia con le forze non conservative), example 1: a block leaves from rest the top of
 * a smooth curved ramp of height h (0,5 to 2,0 m) and goes on along a level floor with kinetic friction μd (0,20 to
 * 0,60), where it stops after d = h / μd (0,83 to 10 m), whatever its mass (1 to 5 kg). Drawn at 0,55 cm per metre,
 * with a mark every metre of floor; beside it the bars of U, K and the dissipated energy, scaled so that their sum,
 * m g h, is always 2 cm tall (the joules are in the readout).
 *
 * No physics engine: on the ramp the speed comes from the energy, √(2 g (h − y)), and the block advances along the
 * curve by v·dt (with a floor of 0,3 m/s so that it leaves the flat top); on the floor x = v t − ½ μd g t² until it
 * stops. With reduced motion the button moves a quarter of a second at a time.
 */

const G = 9.8;
const S = 0.55; // cm per metre
const RAMP = 2; // horizontal length of the ramp, m
const FLOOR = 10.4;
const BW = 0.5, BH = 0.3;
const BARS_X = FLOOR * S + 0.45;
const BAR_H = 2;
const f = frame(-RAMP * S - 0.45, BARS_X + barsWidth(3) + 0.2, -0.78, 2.55);
const fx = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', ',');
const tex = (x: number, d: number) => fx(x, d).replace(',', '{,}');

/** The ramp's profile in metres, from the top (−2; h) to the foot (0; 0), as a polyline with its lengths. */
function profile(h: number) {
	const p0 = v(-RAMP, h), p1 = v(-RAMP / 2, h), p2 = v(-RAMP / 2, 0), p3 = v(0, 0);
	const pts: V[] = [];
	for (let i = 0; i <= 60; i++) {
		const t = i / 60, s = 1 - t;
		pts.push(v(s * s * s * p0.x + 3 * s * s * t * p1.x + 3 * s * t * t * p2.x + t * t * t * p3.x, s * s * s * p0.y + 3 * s * s * t * p1.y + 3 * s * t * t * p2.y + t * t * t * p3.y));
	}
	const cum = [0];
	for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]));
	return { pts, cum, length: cum[cum.length - 1] };
}
function onProfile(p: ReturnType<typeof profile>, s: number) {
	let i = 1;
	while (i < p.cum.length - 1 && p.cum[i] < s) i++;
	const t = (s - p.cum[i - 1]) / (p.cum[i] - p.cum[i - 1] || 1);
	return { at: lerp(p.pts[i - 1], p.pts[i], Math.min(1, Math.max(0, t))), angle: ang(sub(p.pts[i], p.pts[i - 1])) };
}

type State = { s: number; t: number; x: number };

export default function RampaPavimentoAttrito({ alt }: { alt?: string }) {
	const [h, setH] = useState(1.2);
	const [mu, setMu] = useState(0.3);
	const [m, setM] = useState(2);
	const [running, setRunning] = useState(false);
	const [b, setB] = useState<State>({ s: 0, t: 0, x: 0 });
	const reduced = useReducedMotion();
	const prof = profile(h);
	const vB = Math.sqrt(2 * G * h);
	const d = h / mu;
	const tStop = vB / (mu * G);

	const run = (seconds: number) => {
		const n = { ...b };
		let left = seconds;
		while (left > 0 && n.s < prof.length) {
			const dt = Math.min(left, 1 / 600);
			const y = onProfile(prof, n.s).at.y;
			n.s += Math.max(0.3, Math.sqrt(2 * G * Math.max(0, h - y))) * dt;
			left -= dt;
		}
		if (n.s >= prof.length) {
			n.s = prof.length;
			n.t = Math.min(tStop, n.t + left);
			n.x = vB * n.t - 0.5 * mu * G * n.t * n.t;
			if (n.t >= tStop) {
				n.x = d;
				setRunning(false);
			}
		}
		setB(n);
	};
	useFrameLoop(running, run);

	const reset = () => {
		setRunning(false);
		setB({ s: 0, t: 0, x: 0 });
	};
	const change = (set: (x: number) => void) => (x: number) => {
		set(x);
		reset();
	};
	const play = () => {
		if (reduced) return run(0.25);
		setRunning((r) => !r);
	};

	const ramp = b.s < prof.length;
	const pos = ramp ? onProfile(prof, b.s) : { at: v(b.x, 0), angle: 0 };
	const E = m * G * h;
	const U = m * G * pos.at.y;
	const diss = ramp ? 0 : mu * m * G * b.x;
	const K = Math.max(0, E - U - diss);
	const moved = b.s > 0;
	const stopped = !ramp && b.t >= tStop;

	const marks: string[] = [];
	for (let x = 1; x <= 10; x++) marks.push(f.path([v(x * S, 0), v(x * S, -0.32)]));

	const caption = !moved
		? `In cima il blocco ha U = m g h = ${fx(E, 1)} J: premi Lascia andare.`
		: ramp
			? "Sulla rampa liscia non lavorano forze non conservative: l'energia potenziale diventa cinetica."
			: stopped
				? `Il blocco si ferma dopo d = h/μd = ${fx(d, 2)} m: l'attrito ha dissipato tutti i ${fx(E, 1)} J.`
				: "Sul pavimento l'attrito compie un lavoro negativo: l'energia cinetica diventa energia dissipata.";

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-RAMP * S, 0), ...prof.pts.map((p) => v(p.x * S, p.y * S))], true)} fill={TINT.gray} stroke="none" />
				<Ground f={f} from={v(-RAMP * S - 0.2, 0)} to={v(FLOOR * S, 0)} />
				<path d={marks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{[0, 2, 4, 6, 8, 10, 11].map((x) => {
					const q = f.px(v(x === 11 ? 10.7 * S : x * S, -0.36));
					return (
						<text key={x} x={q.x} y={q.y} dy="0.8em" textAnchor="middle" fontSize={11} fontFamily={FONT}>
							{x === 11 ? 'm' : x}
						</text>
					);
				})}
				<path d={f.path([v(-RAMP * S - 0.2, h * S), ...prof.pts.map((p) => v(p.x * S, p.y * S))])} stroke="#000" strokeWidth={THICK} fill="none" />
				{/* the height */}
				<path d={f.path([v(-RAMP * S - 0.32, 0), v(-RAMP * S - 0.32, h * S)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-RAMP * S - 0.3, h * S + 0.02)} dir={v(0.2, 1)} size={FONT_SIZE * 0.85}>
					h
				</Label>
				{stopped && <path d={f.path([v(d * S, 0.02), v(d * S, 0.75)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				<Block f={f} at={v(pos.at.x * S, pos.at.y * S)} w={BW} h={BH} angle={pos.angle} />
				<EnergyBars
					f={f}
					at={v(BARS_X, 0)}
					bars={[
						{ value: U, fill: ENERGY_FILL.U, name: 'U' },
						{ value: K, fill: ENERGY_FILL.K, name: 'K' },
						{ value: diss, fill: ENERGY_FILL.diss, name: 'diss.', upright: true }
					]}
					scale={BAR_H / E}
					total={E}
				/>
			</Drawing>

			<Readout>
				<Tex>{`v_B = \\sqrt{2 g h} = ${tex(vB, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`d = \\dfrac{h}{\\mu_d} = ${tex(d, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`U = ${tex(U, 1)}\\,\\text{J}`}</Tex>
				<Tex>{`K = ${tex(K, 1)}\\,\\text{J}`}</Tex>
				<Tex>{`E_{diss} = ${tex(diss, 1)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Altezza h" unit="m" value={h} min={0.5} max={2} step={0.1} onChange={change((x) => setH(Math.round(x * 10) / 10))} />
				<Slider label="Attrito μd" value={mu} min={0.2} max={0.6} step={0.05} onChange={change((x) => setMu(Math.round(x * 20) / 20))} />
				<Slider label="Massa m" unit="kg" value={m} min={1} max={5} step={1} onChange={change((x) => setM(Math.round(x)))} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={stopped} onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di un quarto di secondo' : running ? 'Ferma' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta in cima
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
