'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, THIN, THICK, DASH, TINT } from '../kit';
import { Arrow, Ball, Pulley, Vector, QTY } from '../fisica';

/**
 * Lesson 73 (Le trasformazioni di Galileo e la composizione delle velocità): a wagon 30 m long moves along a
 * platform at V (0 to 8 m/s), and a passenger walks inside it at v' (−4 to 4 m/s), starting 15 m from the tail. The
 * platform carries the scale of S (metres from O), the wagon the scale of S' (metres from its tail O'). Under the
 * platform three dimension lines: V·t from O to O', x' from O' to the passenger, and their sum x. Above the wagon the
 * velocities head to tail, V then v', and their sum v in orange. The run lasts 3 s (real seconds); closed formulas.
 * Scale: 0,2 cm per metre; velocities 0,15 cm per m/s.
 */

const M = 0.2; // cm per metre
const KV = 0.15; // cm per m/s
const LEN = 30; // m, the wagon
const X0 = 15; // m, the passenger from the tail at t = 0
const T = 3; // s
const f = frame(-0.5, 12.6, -2.0, 3.35);

export default function VagoneGalileo({ alt }: { alt?: string }) {
	const [V, setV] = useState(6);
	const [vp, setVp] = useState(2);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();
	const done = t >= T - 1e-9;

	useFrameLoop(running, (dt) => {
		const next = Math.min(T, t + dt);
		setT(next);
		if (next >= T) setRunning(false);
	});
	const play = () => {
		if (running) return setRunning(false);
		if (reduced) return setT(T);
		if (done) setT(0);
		setRunning(true);
	};
	const reset = () => {
		setRunning(false);
		setT(0);
	};
	const change = (set: (x: number) => void) => (x: number) => {
		reset();
		set(x);
	};

	const tail = V * t; // m, O' on the platform
	const xp = X0 + vp * t; // m, the passenger in the wagon
	const x = xp + tail;
	const vel = vp + V;
	const px = x * M;
	const o = tail * M;

	const caption =
		Math.abs(vel) < 1e-9
			? `Il passeggero cammina verso la coda con la stessa velocità con cui il vagone avanza: per chi sta sulla banchina è fermo, e la sua x non cambia.`
			: vel < 0
				? `Il passeggero cammina verso la coda più in fretta di quanto il vagone avanzi: visto dalla banchina va all'indietro, a ${num(-vel, 0)} m/s.`
				: vp === 0
					? `Il passeggero è fermo nel vagone: per la banchina ha la velocità del vagone, ${num(V, 0)} m/s.`
					: `Per la banchina il passeggero va a ${num(vel, 0)} m/s: la sua velocità nel vagone ${vp > 0 ? 'più' : 'meno'} quella del vagone${vp > 0 ? '' : ', perché cammina verso la coda'}.`;

	const dim = (a: number, b: number, y: number, text: string, above = true) =>
		Math.abs(b - a) > 0.25 ? (
			<g>
				<Arrow f={f} from={v(a, y)} to={v(b, y)} weight="thin" />
				<Arrow f={f} from={v(b, y)} to={v(a, y)} weight="thin" />
				<Label f={f} at={v((a + b) / 2, y)} dir={v(0, above ? 0.9 : -0.9)} size={13}>
					{text}
				</Label>
			</g>
		) : null;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the platform, S */}
				<path d={f.path([v(-0.3, 0), v(12.4, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				{[0, 10, 20, 30, 40, 50, 60].map((m) => (
					<g key={m}>
						<path d={f.path([v(m * M, 0), v(m * M, -0.12)])} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={v(m * M, -0.12)} dir={v(0, -0.6)} upright size={11}>
							{m}
						</Label>
					</g>
				))}
				<Label f={f} at={v(12.4, 0)} dir={v(0, 1)}>x</Label>

				{/* the wagon, S' */}
				<path d={f.path([v(o, 0.3), v(o + LEN * M, 0.3), v(o + LEN * M, 1.7), v(o, 1.7)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<Pulley f={f} at={v(o + 0.7, 0.3)} r={0.22} />
				<Pulley f={f} at={v(o + LEN * M - 0.7, 0.3)} r={0.22} />
				<path d={f.path([v(o, 0.75), v(o + LEN * M, 0.75)])} stroke={QTY.velocita} strokeWidth={THIN} fill="none" />
				{[0, 10, 20, 30].map((m) => (
					<g key={m}>
						<path d={f.path([v(o + m * M, 0.75), v(o + m * M, 0.63)])} stroke={QTY.velocita} strokeWidth={THIN} fill="none" />
						{m > 0 && m < 30 && (
							<Label f={f} at={v(o + m * M, 0.75)} dir={v(0, 0.55)} upright size={11} color={QTY.velocita}>
								{m}
							</Label>
						)}
					</g>
				))}
				<Label f={f} at={v(o + LEN * M - 0.25, 0.75)} dir={v(0, 0.7)} color={QTY.velocita} size={13}>x′</Label>
				<Ball f={f} at={v(px, 1.3)} r={0.16} />
				<path d={f.path([v(px, 1.14), v(px, -1.6)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(o, 0.3), v(o, -1.1)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(0, 0), v(0, -1.6)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />

				{dim(0, o, -1.0, 'V t')}
				{dim(o, px, -1.0, 'x′')}
				{dim(0, px, -1.5, 'x', false)}

				{/* velocities, head to tail */}
				{V > 0 && <Vector f={f} from={v(px, 2.2)} to={v(px + V * KV, 2.2)} color={QTY.velocita} name="V" labelAt={0} labelDir={v(-1, 0)} />}
				{vp !== 0 && <Vector f={f} from={v(px + V * KV, 2.55)} to={v(px + (V + vp) * KV, 2.55)} color={QTY.velocita} name="v′" labelAt={vp > 0 ? 1 : 0} labelDir={v(1, 0)} />}
				{Math.abs(vel) > 1e-9 && <Vector f={f} from={v(px, 2.95)} to={v(px + vel * KV, 2.95)} color={QTY.risultante} name="v" labelAt={vel > 0 ? 1 : 0} labelDir={v(vel > 0 ? 1 : 1.2, 0)} />}
			</Drawing>

			<Readout>
				<Tex>{`t = ${t.toFixed(1).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				<Tex>{`x' = ${texNum(xp, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`x = x' + V\\,t = ${texNum(x, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`v = v' + V = ${texNum(vel, 0)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Vagone V (m/s)" value={V} min={0} max={8} step={1} onChange={change(setV)} />
				<Slider label="Passeggero v′ (m/s)" value={vp} min={-4} max={4} step={1} onChange={change(setVp)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : done ? 'Rifai' : t > 0 ? 'Riprendi' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
