'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, polar, useFrameLoop, useReducedMotion, texNum, num, THIN, DASH } from '../kit';
import { Arrow, Vector, Point, QTY } from '../fisica';
import { River, Boat } from './fiume';

/**
 * Lesson 46 (La composizione dei moti): a boat crosses a river 48 m wide whose current flows to the right. The student
 * sets the boat's speed relative to the water (1,5 to 3,0 m/s), the current (0 to 2,0 m/s) and how far the bow turns
 * upstream from the perpendicular to the bank (0° to 50°). At the start A the velocity triangle, head to tail: v_b along
 * the bow, v_c from its tip, and their sum v (orange) from A. The dashed line is the straight path to the landing
 * point; "Avvia" sends the boat along it, leaving its track. Under the drawing: the speed relative to the bank, the
 * crossing time d / (v_b cos α) and where the boat lands, downstream or upstream of B, the point facing A.
 * Scale: 20 m per centimetre for the river, 0,7 cm per m/s for the velocities.
 */

const D = 48; // width, m
const M = 20; // metres per cm
const W = D / M;
const KV = 0.7; // cm per m/s
const SPEED = 6; // seconds of the problem per second of animation
const f = frame(-3.6, 4.2, -0.75, W + 0.6);
const FLOW = [v(-3.3, 0.45), v(2.9, 0.45), v(-3.3, W - 0.45), v(2.9, W - 0.45)];

export default function BarcaFiume({ alt }: { alt?: string }) {
	const [vb, setVb] = useState(1.6);
	const [vc, setVc] = useState(1.2);
	const [deg, setDeg] = useState(0);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const a = (deg * Math.PI) / 180;
	const vbx = -vb * Math.sin(a), vby = vb * Math.cos(a);
	const vx = vc + vbx, vy = vby;
	const speed = Math.hypot(vx, vy);
	const T = D / vy; // crossing time
	const land = vx * T; // m, positive downstream
	const done = t >= T - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T, t + dt * SPEED);
		setT(next);
		if (next >= T) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(T);
		if (done) setT(0);
		setPlaying(true);
	};
	/** A slider moved: the boat goes back to A. */
	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(x);
	};

	const A = v(0, 0);
	const boat = v((vx * t) / M, (vy * t) / M);
	const C = v(land / M, W);
	const tipB = add(A, v(vbx * KV, vby * KV));
	const tipV = add(A, v(vx * KV, vy * KV));
	const heading = Math.PI / 2 + a;

	const where = Math.abs(land) < 0.5 ? 'proprio in B, di fronte alla partenza' : land > 0 ? `${num(land, 1)} m a valle di B` : `${num(-land, 1)} m a monte di B`;
	const caption =
		deg === 0
			? `Prua perpendicolare alla riva: la barca attraversa in ${num(T, 1)} s, lo stesso tempo che senza corrente, e la corrente la porta ${where}.`
			: vb * Math.sin(a) < vc - 0.05
				? `Prua controcorrente di ${deg}°: la barca risale di ${num(vb * Math.sin(a), 2)} m/s, meno della corrente, e arriva ${where}.`
				: vb * Math.sin(a) > vc + 0.05
					? `Prua controcorrente di ${deg}°: la barca risale di ${num(vb * Math.sin(a), 2)} m/s, più della corrente, e arriva ${where}.`
					: `La barca risale di ${num(vb * Math.sin(a), 2)} m/s, quanto la corrente: la velocità rispetto alla riva è perpendicolare alla riva, e la barca arriva ${where}.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<River f={f} x0={-3.6} x1={4.2} width={W} flow={FLOW} />
				<path d={f.path([A, v(0, W)])} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([A, C])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Boat f={f} at={boat} heading={heading} />
				{t > 0 && <path d={f.path([A, boat])} stroke={QTY.risultante} strokeWidth={1.2} fill="none" />}
				<Vector f={f} from={A} to={tipB} color={QTY.velocita} name="v" sub="b" labelAt={0.5} labelDir={v(-1, 0.2)} />
				{vc > 0.05 && <Vector f={f} from={tipB} to={add(tipB, v(vc * KV, 0))} color={QTY.velocita} name="v" sub="c" labelAt={0.5} labelDir={v(0, 1)} />}
				<Vector f={f} from={A} to={tipV} color={QTY.risultante} name="v" labelAt={0.55} labelDir={vx >= 0 ? v(1, -0.3) : v(-1, -0.3)} />
				{deg > 0 && <path d={f.arc(A, polar(1, Math.PI / 2), polar(1, heading), 0.45)} stroke="#000" strokeWidth={THIN} fill="none" />}
				{deg >= 12 && <Label f={f} at={add(A, polar(0.62, Math.PI / 2 + a / 2))} size={13}>α</Label>}
				<Point f={f} at={A} />
				<Label f={f} at={A} dir={v(-0.8, -0.8)}>A</Label>
				<Point f={f} at={v(0, W)} />
				<Label f={f} at={v(0, W)} dir={v(-0.8, 0.8)}>B</Label>
				{Math.abs(land) >= 0.5 && Math.abs(C.x) > 0.05 && (
					<>
						<Point f={f} at={C} />
						<Label f={f} at={C} dir={v(0.6, 0.8)}>C</Label>
					</>
				)}
				<Arrow f={f} from={v(3.85, 0)} to={v(3.85, W)} weight="thin" />
				<Arrow f={f} from={v(3.85, W)} to={v(3.85, 0)} weight="thin" />
				<Label f={f} at={v(3.85, W / 2)} dir={v(-1, 0)} upright size={13}>48 m</Label>
			</Drawing>

			<Readout>
				<Tex>{`v = ${speed.toFixed(2).replace('.', '{,}')}\\,\\text{m/s}`}</Tex>
				<Tex>{`t = \\dfrac{d}{v_b\\cos\\alpha} = ${texNum(T, 1)}\\,\\text{s}`}</Tex>
				<span>
					approdo: {where}
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Velocità della barca (m/s)" value={vb} min={1.5} max={3} step={0.1} onChange={change(setVb)} />
				<Slider label="Corrente (m/s)" value={vc} min={0} max={2} step={0.1} onChange={change(setVc)} />
				<Slider label="Prua controcorrente α (gradi)" value={deg} min={0} max={50} step={1} onChange={change(setDeg)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : done ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna in A
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

