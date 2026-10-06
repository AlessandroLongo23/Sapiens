'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, rot, polar, texNum, useFrameLoop, useReducedMotion, THIN, THICK, TINT } from '../kit';
import { Ball, Point, Vector, QTY } from '../fisica';

/**
 * Lesson 75 (Le forze apparenti), example 8: a platform of radius 3,0 m turns at ω (−0,8 to 0,8 rad/s, positive
 * counterclockwise, 0,4 at the start); a ball leaves the centre at 2,0 m/s towards a child sitting on the rim, and
 * slides without friction, so it reaches the rim after 1,5 s. Seen from the ground the ball goes straight while the
 * platform, with its spokes and the child, turns; seen from the platform the child is still, a tree outside turns the
 * other way and the ball's path bends: to the right of its motion for a counterclockwise rotation, to the left for a
 * clockwise one. The ball's velocity in the chosen frame is drawn on it. Closed formulas; the animation runs at 0,6
 * of real time. Scale: 0,9 cm per metre; velocities 0,4 cm per m/s.
 */

const R = 3; // m
const SPEED_BALL = 2; // m/s
const TF = R / SPEED_BALL; // 1,5 s
const M = 0.9; // cm per metre
const KV = 0.4; // cm per m/s
const RATE = 0.6;
const f = frame(-4.3, 4.3, -3.45, 3.45);
const O = v(0, 0);

type View = 'suolo' | 'giostra';

export default function GiostraCoriolis({ alt }: { alt?: string }) {
	const [view, setView] = useState<View>('giostra');
	const [w, setW] = useState(0.4);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();
	const done = t >= TF - 1e-9;

	useFrameLoop(running, (dt) => {
		const next = Math.min(TF, t + dt * RATE);
		setT(next);
		if (next >= TF) setRunning(false);
	});
	const play = () => {
		if (running) return setRunning(false);
		if (reduced) return setT(TF);
		if (done) setT(0);
		setRunning(true);
	};
	const reset = () => {
		setRunning(false);
		setT(0);
	};

	// Angles in the drawing: the platform's, and the one everything fixed to the ground is turned by.
	const platform = view === 'suolo' ? w * t : 0;
	const ground = view === 'suolo' ? 0 : -w * t;
	/** The ball at time tau: straight for the ground, turned back by the platform's angle for the platform. */
	const ball = (tau: number) => rot(v(SPEED_BALL * tau * M, 0), view === 'suolo' ? 0 : -w * tau);
	const trace = Array.from({ length: 31 }, (_, i) => ball((t * i) / 30));
	const b = ball(t);
	const vel = view === 'suolo' ? v(SPEED_BALL, 0) : rot(v(SPEED_BALL, -w * SPEED_BALL * t), -w * t);
	const child = polar(R * M, platform);
	const tree = polar(R * M + 0.42, Math.PI / 2 + ground);
	const arc = Math.abs(w) * R * t;
	const side = w > 0 ? 'destra' : 'sinistra';

	const caption =
		w === 0
			? 'La piattaforma è ferma: la palla va dritta e arriva al bambino, in tutti e due i sistemi.'
			: view === 'suolo'
				? `Vista dal suolo la palla va dritta a 2 m/s, perché nessuna forza orizzontale agisce su di lei. Intanto la piattaforma ${done ? 'ha portato' : 'porta'} via il bambino.`
				: `Vista dalla piattaforma il bambino è fermo e la palla curva verso ${side} rispetto al verso del suo moto: chi sta sulla piattaforma lo spiega con la forza di Coriolis.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * M * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				{[0, 1, 2, 3].map((k) => (
					<path key={k} d={f.path([O, polar(R * M, platform + (k * Math.PI) / 2 + Math.PI / 4)])} stroke="#808080" strokeWidth={THIN} fill="none" />
				))}
				{/* a tree on the ground, outside the platform */}
				<circle cx={f.px(tree).x} cy={f.px(tree).y} r={7} fill="#008000" stroke="#000" strokeWidth={THIN} />
				{t > 0 && <path d={f.path(trace)} stroke={QTY.velocita} strokeWidth={THICK} fill="none" />}
				{view === 'suolo' && w !== 0 && t > 0 && <circle cx={f.px(polar(R * M, 0)).x} cy={f.px(polar(R * M, 0)).y} r={5} fill="none" stroke="#000" strokeWidth={THIN} />}
				<circle cx={f.px(child).x} cy={f.px(child).y} r={5.5} fill={QTY.risultante} stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={child} dir={add(polar(1.3, platform), v(0, 0.2))} upright size={12}>
					bambino
				</Label>
				<Point f={f} at={O} />
				{!done && <Vector f={f} from={b} to={add(b, v(vel.x * KV, vel.y * KV))} color={QTY.velocita} name={view === 'suolo' ? 'v' : 'v′'} labelDir={v(0.3, 1)} />}
				<Ball f={f} at={b} r={0.1} fill="#fff" />
			</Drawing>

			<Readout>
				<Tex>{`t = ${t.toFixed(1).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				<Tex>{`\\omega\\,r\\,t = ${texNum(arc, 1)}\\,\\text{m}`}</Tex>
				<span>{w === 0 ? 'nessuna deviazione' : view === 'giostra' ? `la palla devia a ${side}` : 'la palla va dritta'}</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Punto di vista"
						options={[
							{ value: 'suolo', label: 'Dal suolo' },
							{ value: 'giostra', label: 'Dalla piattaforma' }
						]}
						value={view}
						onChange={(k) => setView(k)}
					/>
				</div>
				<Slider
					label="Rotazione ω (rad/s)"
					value={w}
					min={-0.8}
					max={0.8}
					step={0.2}
					onChange={(x) => {
						reset();
						setW(Math.abs(x) < 1e-9 ? 0 : x);
					}}
				/>
				<p className="m-0 text-center text-xs text-fg-muted">ω positiva: senso antiorario. Sopra, ω r t è quanto si sposta il bambino lungo il bordo.</p>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : done ? 'Rifai' : t > 0 ? 'Riprendi' : 'Lancia'}
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
