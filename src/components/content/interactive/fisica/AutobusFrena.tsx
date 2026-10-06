'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, THIN, THICK, TINT } from '../kit';
import { Ball, Ground, Pulley, Vector, QTY } from '../fisica';

/**
 * Lesson 72 (Sistemi di riferimento inerziali e non inerziali), example 1: a bus at 12 m/s brakes with A (1,5 to
 * 4,0 m/s², 3,0 at the start), and a ball lies on its smooth floor, 6,0 m from the front wall. The same motion from
 * two observers. From the road the ball keeps its 12 m/s and the bus slows down under it; from the bus the road
 * slides backwards and the ball, starting from rest, accelerates towards the front wall with a' = A. The run ends
 * when the ball touches the wall, at t = sqrt(2·6,0/A), always before the bus stops. Closed formulas, real seconds.
 * Scale: 0,3 cm per metre; velocities 0,1 cm per m/s; accelerations 0,25 cm per m/s². Posts every 6 m mark the road.
 */

const V0 = 12; // m/s
const D = 6; // m, from the ball to the front wall
const LB = 10; // m, the bus
const M = 0.3; // cm per metre
const KV = 0.1; // cm per m/s
const KA = 0.25; // cm per m/s²
const BALL0 = 5; // m, where the ball's front is on the road when the braking starts
const BUS_FIXED = 14; // m, where the bus's rear is drawn when the observer rides on it
const R = 0.15;
const f = frame(-0.3, 12.6, -0.75, 2.55);

type View = 'strada' | 'autobus';

export default function AutobusFrena({ alt }: { alt?: string }) {
	const [view, setView] = useState<View>('strada');
	const [A, setA] = useState(3);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const tEnd = Math.sqrt((2 * D) / A);
	const done = t >= tEnd - 1e-9;

	useFrameLoop(running, (dt) => {
		const next = Math.min(tEnd, t + dt);
		setT(next);
		if (next >= tEnd) setRunning(false);
	});
	const play = () => {
		if (running) return setRunning(false);
		if (reduced) return setT(tEnd);
		if (done) setT(0);
		setRunning(true);
	};
	const reset = () => {
		setRunning(false);
		setT(0);
	};

	// On the road, in metres: the ball's front, the bus's rear.
	const ballRoad = BALL0 + V0 * t;
	const busRoad = BALL0 + D - LB + V0 * t - (A * t * t) / 2;
	const vBus = V0 - A * t;
	const vRel = A * t;
	// What the drawing is fixed to: the road, or the bus.
	const shift = view === 'strada' ? 0 : BUS_FIXED - busRoad;
	const xBus = (busRoad + shift) * M;
	const xBall = (ballRoad + shift) * M - R;
	const posts: number[] = [];
	for (let k = Math.ceil((f.x0 / M - shift) / 6); k * 6 <= f.x1 / M - shift; k++) posts.push(k * 6);

	const braking = t > 0 && !done;
	const caption =
		t === 0
			? `L'autobus e il pallone vanno insieme a 12 m/s. Premi Frena e guarda il pallone ${view === 'strada' ? 'dalla strada' : "dall'autobus"}.`
			: view === 'strada'
				? `Visto dalla strada il pallone va sempre a 12 m/s: nessuna forza orizzontale, nessuna accelerazione. È l'autobus che rallenta, ${done ? 'e la parete davanti è stata raggiunta dal pallone' : 'e la parete davanti gli si avvicina'}.`
				: `Visto dall'autobus il pallone è partito da fermo e accelera in avanti con ${num(A, 1)} m/s², senza che nessuna forza lo spinga: qui il primo principio non vale.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(f.x0, 0)} to={v(f.x1, 0)} />
				{posts.map((m) => {
					const x = (m + shift) * M;
					return (
						<g key={m}>
							<path d={f.path([v(x, 0), v(x, 0.22)])} stroke="#000" strokeWidth={THICK} fill="none" />
							{x > f.x0 + 0.35 && x < f.x1 - 0.35 && (
								<Label f={f} at={v(x, -0.28)} dir={v(0, -1)} upright size={12}>
									{String(m).replace('-', '−')} m
								</Label>
							)}
						</g>
					);
				})}

				<path d={f.path([v(xBus, 0.25), v(xBus + LB * M, 0.25), v(xBus + LB * M, 1.7), v(xBus, 1.7)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(xBus, 0.5), v(xBus + LB * M, 0.5)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{[0.25, 0.9, 1.55, 2.2].map((dx) => (
					<path key={dx} d={f.path([v(xBus + dx, 1.0), v(xBus + dx + 0.5, 1.0), v(xBus + dx + 0.5, 1.45), v(xBus + dx, 1.45)], true)} fill="#fff" stroke="#000" strokeWidth={THIN} />
				))}
				<Pulley f={f} at={v(xBus + 0.6, 0.25)} r={0.25} />
				<Pulley f={f} at={v(xBus + LB * M - 0.6, 0.25)} r={0.25} />
				<Ball f={f} at={v(xBall, 0.5 + R)} r={R} />

				{view === 'strada' ? (
					<>
						<Vector f={f} from={v(xBall, 0.5 + R)} to={v(xBall + V0 * KV, 0.5 + R)} color={QTY.velocita} name="v" labelAt={0.5} labelDir={v(0, 1)} />
						<Vector f={f} from={v(xBus + 0.3, 1.95)} to={v(xBus + 0.3 + vBus * KV, 1.95)} color={QTY.velocita} name="V" labelAt={0} labelDir={v(-1, 0)} />
						{braking && <Vector f={f} from={v(xBus + LB * M - 0.3, 1.95)} to={v(xBus + LB * M - 0.3 - A * KA, 1.95)} color={QTY.accelerazione} name="A" labelAt={0} labelDir={v(1, 0)} />}
					</>
				) : (
					<>
						{vRel > 0.3 && <Vector f={f} from={v(xBall, 0.5 + R)} to={v(xBall + vRel * KV, 0.5 + R)} color={QTY.velocita} name="v′" labelAt={0.5} labelDir={v(0, 1)} />}
						{braking && <Vector f={f} from={v(xBall, 0.82)} to={v(xBall + A * KA, 0.82)} color={QTY.accelerazione} name="a′" labelDir={v(1, 0)} />}
						<Vector f={f} from={v(3.6, 0.62)} to={v(3.6 - vBus * KV, 0.62)} color={QTY.velocita} weight="thin" />
						<Label f={f} at={v(3.6 - (vBus * KV) / 2, 0.62)} dir={v(0, 1.2)} upright size={12}>
							la strada
						</Label>
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`t = ${t.toFixed(1).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				{view === 'strada' ? <Tex>{`v = 12\\,\\text{m/s}`}</Tex> : <Tex>{`v' = A\\,t = ${texNum(vRel, 1)}\\,\\text{m/s}`}</Tex>}
				{view === 'strada' ? <Tex>{`a = 0`}</Tex> : <Tex>{`a' = ${t === 0 ? '0' : `${texNum(A, 1)}\\,\\text{m/s}^2`}`}</Tex>}
				<span>forza orizzontale sul pallone: 0 N</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Punto di vista"
						options={[
							{ value: 'strada', label: 'Dalla strada' },
							{ value: 'autobus', label: "Dall'autobus" }
						]}
						value={view}
						onChange={(k) => setView(k)}
					/>
				</div>
				<Slider
					label="Frenata A (m/s²)"
					value={A}
					min={1.5}
					max={4}
					step={0.5}
					onChange={(x) => {
						reset();
						setA(x);
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : done ? 'Rifai' : t > 0 ? 'Riprendi' : 'Frena'}
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
