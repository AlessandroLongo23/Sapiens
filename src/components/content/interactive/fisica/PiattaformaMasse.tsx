'use client';

import { useState } from 'react';
import { Pause, Play, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, polar, scale, texNum, num, useFrameLoop, useReducedMotion, TINT, THICK, THIN, DASH } from '../kit';
import { Arrow, Ball } from '../fisica';

/**
 * Lesson 91 (La conservazione del momento angolare), "Quando cambia il momento d'inerzia": a platform seen from above
 * (moment of inertia 1,0 kg·m²) that turns about its centre with two masses of 2,0 kg on opposite sides, at the
 * distance r the student picks (0,2 to 1,0 m, drawn at 2,2 cm per metre). No external torque: L stays 10 kg·m²/s,
 * the value it has with the masses at 1,0 m and ω = 2,0 rad/s. So I = 1,0 + 2 · 2,0 · r², ω = L / I and
 * K = L² / (2 I). The curved arrow is 15° long per rad/s. The angle advances by ω dt; with reduced motion the button
 * moves it a quarter of a second at a time.
 */

const I0 = 1;
const MASS = 2;
const L = 10;
const S = 2.2; // cm per metre
const O = v(0, 0);
const f = frame(-3.15, 3.15, -3.0, 3.0);

export default function PiattaformaMasse({ alt }: { alt?: string }) {
	const [r, setR] = useState(1);
	const [angle, setAngle] = useState(0.4);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const I = I0 + 2 * MASS * r * r;
	const omega = L / I;
	const K = (L * L) / (2 * I);
	const run = (seconds: number) => setAngle((a) => (a + omega * seconds) % (2 * Math.PI));
	useFrameLoop(running, run);
	const play = () => {
		if (reduced) return run(0.25);
		setRunning((x) => !x);
	};

	const a = polar(r * S, angle);
	const b = scale(a, -1);
	const sweep = (omega * 15 * Math.PI) / 180;
	const arc = Array.from({ length: 41 }, (_, i) => polar(2.75, 0.5 + (sweep * i) / 40));
	const tip = arc[40];

	let caption: string;
	if (r >= 0.99) caption = 'Con le masse a 1 m dall\'asse la piattaforma gira piano. Avvicinale: nessuno la spinge, eppure accelera.';
	else caption = `Il momento d'inerzia è sceso a ${num(I, 2)} kg·m² e la velocità angolare è salita a ${num(omega, 2)} rad/s: il prodotto resta 10 kg·m²/s. L'energia cinetica è cresciuta, per il lavoro di chi ha tirato le masse verso l'asse.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={2.45 * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<circle cx={f.px(O).x} cy={f.px(O).y} r={r * S * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.path([b, a])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Ball f={f} at={a} r={0.2} />
				<Ball f={f} at={b} r={0.2} />
				<circle cx={f.px(O).x} cy={f.px(O).y} r={2.2} fill="#000" />
				<path d={f.path(arc.slice(0, 34))} stroke="#000" strokeWidth={THICK} fill="none" />
				<Arrow f={f} from={arc[32]} to={tip} />
				<Label f={f} at={polar(2.75, 0.5)} dir={v(0.9, -0.6)}>
					ω
				</Label>
			</Drawing>

			<Readout>
				<Tex>{`I = ${texNum(I, 2)}\\,\\text{kg}\\cdot\\text{m}^2`}</Tex>
				<Tex>{`\\omega = ${texNum(omega, 2)}\\,\\text{rad/s}`}</Tex>
				<Tex>{`L = I\\,\\omega = ${texNum(I * omega, 2)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}`}</Tex>
				<Tex>{`K_{rot} = ${texNum(K, 1)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Distanza dall'asse r" unit="m" value={r} min={0.2} max={1} step={0.1} onChange={(x) => setR(Math.round(x * 10) / 10)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di un quarto di secondo' : running ? 'Ferma' : 'Fai girare'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
