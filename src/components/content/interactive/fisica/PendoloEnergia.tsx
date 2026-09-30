'use client';

import { useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, add, scale, polar, texNum, num, useFrameLoop, useReducedMotion, THIN, DASH, type V } from '../kit';
import { Ball, Ground, Thread, Vector, QTY } from '../fisica';
import { EnergyBars, ENERGY_FILL, barsWidth } from './energia';

/**
 * Lesson 63 (La conservazione dell'energia meccanica), "Il pendolo": a ball of 0,50 kg on a thread 1,0 m long, drawn
 * at 3 cm per metre, released from rest at the angle the student picks (10° to 60°). Beside it the bars of the
 * potential energy U = m g h (h above the lowest point), the kinetic energy K and their sum, drawn at 6 cm per metre
 * of height (twice the drawing's scale, to be readable at small angles). The velocity arrow is tangent to the arc,
 * 0,35 cm per m/s.
 *
 * No physics engine: the angle follows θ'' = −(g/L) sin θ with a hand-written step (semi-implicit Euler, 1/1000 s),
 * and after each step the angular speed is taken again from the energy, ω² = 2 g (cos θ − cos θ₀) / L, so the bars
 * add up exactly and the ball comes back to the same height for ever. With reduced motion the button moves it a
 * quarter of a second at a time.
 */

const M = 0.5;
const G = 9.8;
const L = 1;
const S = 3; // cm per metre
const BAR_SCALE = (2 * S) / (M * G); // cm per joule: 6 cm per metre of height
const PIVOT = v(0, 3.4);
const STEP = 1 / 1000;
const BARS_X = 3.05;
const f = frame(-2.85, BARS_X + barsWidth(2) + 0.3, -0.35, 3.72);
const DEG = Math.PI / 180;

type Bob = { th: number; om: number };

export default function PendoloEnergia({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(40);
	const [running, setRunning] = useState(false);
	const [, setTick] = useState(0);
	const bob = useRef<Bob>({ th: 40 * DEG, om: 0 });
	const spare = useRef(0);
	const reduced = useReducedMotion();
	const th0 = deg * DEG;

	const run = (seconds: number) => {
		const b = bob.current;
		spare.current += seconds;
		for (; spare.current >= STEP; spare.current -= STEP) {
			b.om += (-(G / L) * Math.sin(b.th)) * STEP;
			b.th += b.om * STEP;
			const w2 = ((2 * G) / L) * (Math.cos(b.th) - Math.cos(th0));
			if (w2 > 1e-4) b.om = Math.sign(b.om || -1) * Math.sqrt(w2);
		}
		setTick((t) => t + 1);
	};
	useFrameLoop(running, run);

	const reset = (d = deg) => {
		setRunning(false);
		setDeg(d);
		bob.current = { th: d * DEG, om: 0 };
		spare.current = 0;
		setTick((t) => t + 1);
	};
	const play = () => {
		if (reduced) return run(0.25);
		setRunning((r) => !r);
	};

	const { th, om } = bob.current;
	const ball: V = add(PIVOT, v(L * S * Math.sin(th), -L * S * Math.cos(th)));
	const low = add(PIVOT, v(0, -L * S));
	const h = L * (1 - Math.cos(th));
	const h0 = L * (1 - Math.cos(th0));
	const U = M * G * h;
	const K = 0.5 * M * (om * L) ** 2;
	const E = M * G * h0;
	const speed = Math.abs(om) * L;
	const tangent = polar(1, th); // direction of increasing θ
	const tip = add(ball, scale(tangent, Math.sign(om) * speed * 0.35));
	const moved = Math.abs(th - th0) > 1e-9 || om !== 0;
	const arc: V[] = Array.from({ length: 61 }, (_, i) => {
		const t = -th0 + (2 * th0 * i) / 60;
		return add(PIVOT, v(L * S * Math.sin(t), -L * S * Math.cos(t)));
	});
	const yRelease = PIVOT.y - L * S * Math.cos(th0);

	let caption: string;
	if (!moved) caption = `La pallina è ferma a ${num(h0 * 100, 1)} cm sopra il punto più basso: tutta la sua energia, ${num(E, 2)} J, è potenziale.`;
	else if (h < 0.004 * h0 + 1e-6) caption = `Nel punto più basso l'energia è quasi tutta cinetica, e la velocità è la massima, √(2gh) = ${num(Math.sqrt(2 * G * h0), 2)} m/s.`;
	else caption = `U e K si scambiano, e la loro somma resta ${num(E, 2)} J: la pallina risale sempre fino alla linea tratteggiata, da una parte e dall'altra.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(1.3, PIVOT.y)} to={v(-1.3, PIVOT.y)} />
				<path d={f.path(arc)} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([PIVOT, low])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<path d={f.path([v(-2.8, yRelease), v(2.8, yRelease)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(-0.5, low.y), v(2.8, low.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<Thread f={f} from={PIVOT} to={ball} />
				<circle cx={f.px(PIVOT).x} cy={f.px(PIVOT).y} r={2.2} fill="#000" />
				<Ball f={f} at={ball} r={0.15} />
				{speed * 0.35 > 0.08 && <Vector f={f} from={ball} to={tip} color={QTY.velocita} name="v" />}
				<EnergyBars
					f={f}
					at={v(BARS_X, low.y)}
					bars={[
						{ value: K, fill: ENERGY_FILL.K, name: 'K' },
						{ value: U, fill: ENERGY_FILL.U, name: 'U' }
					]}
					scale={BAR_SCALE}
					total={E}
					totalName="E"
				/>
			</Drawing>

			<Readout>
				<Tex>{`h = ${texNum(h * 100, 1)}\\,\\text{cm}`}</Tex>
				<Tex>{`v = ${texNum(speed, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`U = ${texNum(U, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`K = ${texNum(K, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`E = K + U = ${texNum(E, 2)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Angolo di partenza θ" unit="°" value={deg} min={10} max={60} step={1} onChange={(x) => reset(Math.round(x))} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di un quarto di secondo' : running ? 'Ferma' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti alla partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
