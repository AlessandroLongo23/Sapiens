'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, cross, dot, polar, useFrameLoop, useReducedMotion, texNum, K, THIN, DASH, TINT } from '../kit';
import { Ball, QTY } from '../fisica';

/**
 * Lesson 92 (Dal sistema tolemaico al sistema copernicano), group 36: Ptolemy's deferent and epicycle. The Earth T
 * is at the centre; the centre C of the epicycle goes round the deferent (radius R, drawn 2 cm) and the planet P
 * goes round the epicycle (radius r) n times, measured against fixed directions, while C goes round once:
 * P = R(cos θ, sin θ) + r(cos nθ, sin nθ). The whole path is drawn faint, and the part travelled so far in orange.
 *
 * At the point nearest to the Earth the two velocities are opposite, v_d = 2πR/T_d and v_e = 2πr/T_e, so the planet
 * goes backwards there (and the path has loops) when v_e/v_d = n·r/R is more than 1: the student sees the loops open
 * into waves as the epicycle slows down or shrinks.
 */

const R = 2;
const HALF = R + 0.8 * R + 0.3;
const f = frame(-HALF, HALF, -HALF, HALF);
const TURN = 16; // seconds for one turn of the deferent

export default function EpicicloDeferente({ alt }: { alt?: string }) {
	const [rho, setRho] = useState(0.4);
	const [n, setN] = useState(5);
	const [theta, setTheta] = useState(0.5);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const r = rho * R;
	const at = (t: number) => add(polar(R, t), polar(r, n * t));
	useFrameLoop(playing, (dt) => setTheta((t) => t + (2 * Math.PI * dt) / TURN));
	const play = () => {
		if (reduced) return setTheta((t) => t + Math.PI / 8);
		setPlaying((p) => !p);
	};

	const O = v(0, 0);
	const C = polar(R, theta);
	const P = at(theta);
	const whole = Array.from({ length: 721 }, (_, i) => at((2 * Math.PI * i) / 720));
	const from = Math.max(0, theta - 2 * Math.PI);
	const steps = Math.max(2, Math.ceil((theta - from) / 0.01));
	const done = Array.from({ length: steps + 1 }, (_, i) => at(from + ((theta - from) * i) / steps));
	// The planet's direction seen from the Earth turns counterclockwise (direct motion) when P × P' is positive.
	const vel = add(polar(R, theta + Math.PI / 2), polar(n * r, n * theta + Math.PI / 2));
	const turning = cross(P, vel) / dot(P, P);
	const ratio = n * rho;

	let caption: string;
	if (ratio > 1.001) caption = `Sull'epiciclo il pianeta è più veloce del centro C sul deferente: ogni volta che passa vicino alla Terra torna indietro, e la sua strada fa un cappio. Adesso il suo moto visto dalla Terra è ${turning >= 0 ? 'diretto' : 'retrogrado'}.`;
	else if (ratio < 0.999) caption = "Sull'epiciclo il pianeta è più lento del centro C sul deferente: vicino alla Terra rallenta, ma non torna indietro. La strada ondeggia senza cappi.";
	else caption = 'Le due velocità sono uguali: nel punto più vicino alla Terra il pianeta si ferma per un istante, e la strada fa una punta.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * K} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.path(whole, true)} stroke={QTY.risultante} strokeWidth={THIN} fill="none" opacity={0.35} />
				<path d={f.path(done)} stroke={QTY.risultante} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
				<circle cx={f.px(C).x} cy={f.px(C).y} r={r * K} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.path([O, C, P])} stroke="#000" strokeWidth={THIN} fill="none" />
				<circle cx={f.px(C).x} cy={f.px(C).y} r={2.2} fill="#000" />
				<Ball f={f} at={O} r={0.14} />
				<Label f={f} at={v(0, -0.14)} dir={v(0, -1)}>T</Label>
				<Ball f={f} at={P} r={0.1} fill={TINT.orange} />
				<Label f={f} at={C} dir={polar(1.2, theta)}>C</Label>
			</Drawing>

			<Readout>
				<Tex>{`\\dfrac{r}{R} = ${texNum(rho, 2)}`}</Tex>
				<Tex>{`\\dfrac{v_e}{v_d} = n \\cdot \\dfrac{r}{R} = ${texNum(ratio, 2)}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Raggio dell'epiciclo r/R" value={rho} min={0.2} max={0.8} step={0.05} onChange={setRho} />
				<Slider label="Giri sull'epiciclo n" value={n} min={2} max={8} step={1} onChange={setN} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" onClick={() => { setPlaying(false); setTheta(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
