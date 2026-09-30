'use client';

import { useState } from 'react';
import { Play, Pause, Scissors, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, useFrameLoop, useReducedMotion, THIN, DASH } from '../kit';
import { Ball, Thread, Vector, QTY } from '../fisica';

/**
 * Lesson 57 (La forza centripeta): a ball of 0,20 kg tied to a thread turns on a smooth table around the thread's
 * fixed end O, seen from above, counterclockwise. The student sets its speed (0,5 to 3,0 m/s) and the radius (0,5 to
 * 1,0 m); the tension of the thread is the centripetal force m v²/r, drawn towards O at 0,3 cm per newton, the
 * velocity tangent at 0,3 cm per (m/s). A button cuts the thread: from then on no horizontal force acts, and the ball
 * goes on in a straight line along the tangent at the point where it was, with the same speed (first principle),
 * leaving a dashed trail. The motion is played three times slower than real.
 *
 * Drawn at 2,2 cm per metre.
 */

const M = 0.2;
const S = 2.2;
const KF = 0.3;
const KV = 0.3;
const SLOW = 3;
const HALF = 1.0 * S + 1.1;
const f = frame(-HALF, HALF, -HALF, HALF);

type Cut = { at: number; t: number };

export default function FiloSpezzato({ alt }: { alt?: string }) {
	const [speed, setSpeed] = useState(2.5);
	const [r, setR] = useState(0.6);
	const [phase, setPhase] = useState(Math.PI / 6);
	const [playing, setPlaying] = useState(false);
	const [cut, setCut] = useState<Cut | null>(null);
	const reduced = useReducedMotion();

	const R = r * S;
	const omega = speed / r;
	const F = (M * speed * speed) / r;

	useFrameLoop(playing, (dt) => {
		const d = dt / SLOW;
		if (cut) {
			const t = cut.t + d;
			const p = add(polar(R, cut.at), scale(polar(1, cut.at + Math.PI / 2), speed * S * t));
			if (Math.abs(p.x) > HALF + 0.3 || Math.abs(p.y) > HALF + 0.3) setPlaying(false);
			setCut({ ...cut, t });
		} else setPhase((x) => (x + omega * d) % (2 * Math.PI));
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setCut(null);
		set(x);
	};
	const toggle = () => {
		if (reduced) return;
		if (cut && !playing) setCut(null);
		setPlaying((x) => !x);
	};
	const snap = () => {
		// with reduced motion the ball is shown straight away some way along the tangent
		setCut({ at: phase, t: reduced ? 1.2 / (speed * S) : 0 });
		if (!reduced) setPlaying(true);
	};
	const reset = () => {
		setCut(null);
		setPlaying(false);
	};

	const theta = cut ? cut.at : phase;
	const breakPoint = polar(R, theta);
	const tangent = polar(1, theta + Math.PI / 2);
	const ball = cut ? add(breakPoint, scale(tangent, speed * S * cut.t)) : breakPoint;
	const inward = scale(polar(1, theta), -1);
	const O = v(0, 0);
	const tipF = add(ball, scale(inward, F * KF));

	let caption: string;
	if (cut) caption = 'Il filo è spezzato: sulla pallina non agisce più nessuna forza orizzontale, e prosegue in linea retta lungo la tangente, con la velocità che aveva. Non si allontana lungo il raggio.';
	else caption = `Per girare su questa circonferenza la pallina ha bisogno di una forza verso il centro di ${F.toFixed(2).replace('.', ',')} N: la esercita il filo. Con la velocità doppia servirebbe una forza quattro volte più grande.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} />
				<circle cx={f.px(O).x} cy={f.px(O).y} r={2.5} fill="#000" />
				<Label f={f} at={O} dir={v(-0.7, -0.7)}>O</Label>
				{cut ? (
					<>
						<Thread f={f} from={O} to={scale(breakPoint, 0.45)} />
						<path d={f.path([breakPoint, ball])} stroke={QTY.velocita} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					</>
				) : (
					<>
						<Thread f={f} from={O} to={ball} />
						{F * KF > 0.05 && <Vector f={f} from={ball} to={tipF} color={QTY.forza} name="T" labelDir={polar(1, theta - Math.PI / 2)} labelAt={0.6} />}
					</>
				)}
				<Ball f={f} at={ball} r={0.14} />
				<Vector f={f} from={ball} to={add(ball, scale(tangent, speed * KV))} color={QTY.velocita} name="v" />
			</Drawing>

			<Readout>
				<Tex>{`m = 0{,}20\\,\\text{kg}`}</Tex>
				<Tex>{`v = ${speed.toFixed(1).replace('.', '{,}')}\\,\\text{m/s}`}</Tex>
				<Tex>{`r = ${r.toFixed(2).replace('.', '{,}')}\\,\\text{m}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`a_c = \\dfrac{v^2}{r} = ${((speed * speed) / r).toFixed(2).replace('.', '{,}')}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`F_c = m\\,\\dfrac{v^2}{r} = ${F.toFixed(2).replace('.', '{,}')}\\,\\text{N}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Velocità v (m/s)" value={speed} min={0.5} max={3} step={0.1} onChange={change(setSpeed)} />
				<Slider label="Raggio r" unit="m" value={r} min={0.5} max={1} step={0.05} onChange={change(setR)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={toggle} disabled={reduced}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Fai girare'}
					</Button>
					<Button variant="secondary" size="sm" onClick={snap} disabled={!!cut}>
						<Scissors className="size-4" aria-hidden="true" />
						Spezza il filo
					</Button>
					<Button variant="secondary" size="sm" onClick={reset} disabled={!cut}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riattacca
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
