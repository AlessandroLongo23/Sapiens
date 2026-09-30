'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, num, texNum, useFrameLoop, useReducedMotion, THIN, THICK, DASH, TINT, type V } from '../kit';
import { Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 50 (Il primo principio della dinamica): Galileo's two inclined planes. A ball slides without friction from a
 * height h = 1,6 m down a plane at 30° and up a second plane, whose inclination the student sets from 40° down to 0°
 * (1 cm of drawing per metre). The ball always climbs back to the height h, marked by a dashed line, and the gentler
 * the second plane the longer the road, h / sin θ; on a horizontal plane it never gets back up and goes on at
 * constant speed, √(2gh) = 5,6 m/s, out of the figure. The motion is integrated by hand along the path (the
 * acceleration is g sin of the slope, down the slope), at half speed so it can be followed; the ball swings back and
 * forth between the two planes when the second one is inclined.
 */

const G = 9.8;
const H = 1.6;
const A1 = (30 * Math.PI) / 180;
const L1 = H / Math.sin(A1); // 3,2 m along the first plane
const FOOT = v(H / Math.tan(A1), 0);
const U1 = v(Math.cos(A1), -Math.sin(A1)); // down the first plane
const TOP1 = add(FOOT, scale(U1, -L1));
const R = 0.15;
const SLOW = 0.5;
const KV = 0.2; // cm per m/s
const f = frame(-0.45, 10.45, -0.55, 2.55);
const VMAX = Math.sqrt(2 * G * H);

export default function PianoDoppioGalileo({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(20);
	const [s, setS] = useState(0);
	const [vel, setVel] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const a2 = (deg * Math.PI) / 180;
	const U2 = v(Math.cos(a2), Math.sin(a2));
	const road = deg > 0 ? H / Math.sin(a2) : Infinity;

	const pos = (x: number): { p: V; n: V } => (x <= L1 ? { p: add(TOP1, scale(U1, x)), n: v(Math.sin(A1), Math.cos(A1)) } : { p: add(FOOT, scale(U2, x - L1)), n: v(-Math.sin(a2), Math.cos(a2)) });
	const acc = (x: number) => (x <= L1 ? G * Math.sin(A1) : -G * Math.sin(a2));

	const { p, n } = pos(s);
	const centre = add(p, scale(n, R));
	const out = centre.x > f.x1 + R;

	useFrameLoop(running, (dt) => {
		let x = s, w = vel;
		const steps = 8, h = (dt * SLOW) / steps;
		for (let i = 0; i < steps; i++) {
			w += acc(x) * h;
			x += w * h;
			if (x < 0) {
				x = 0;
				w = 0;
			}
		}
		setS(x);
		setVel(w);
		if (deg === 0 && pos(x).p.x > f.x1 + 0.5) setRunning(false);
	});

	const reset = (d = deg) => {
		setDeg(d);
		setRunning(false);
		setS(0);
		setVel(0);
	};
	const play = () => {
		if (running) return setRunning(false);
		if (reduced) {
			// No animation: the ball is shown where it turns back, or gone on the horizontal plane.
			setS(deg > 0 ? L1 + road : L1 + 20);
			setVel(0);
			return;
		}
		if (out && deg === 0) {
			setS(0);
			setVel(0);
		}
		setRunning(true);
	};

	// The second plane: up to a little above h, or to the edge of the figure.
	const end = deg === 0 ? v(f.x1 - 0.1, 0) : (() => {
		const toH = add(FOOT, scale(U2, (H + 0.35) / Math.sin(a2)));
		return toH.x <= f.x1 - 0.1 ? toH : add(FOOT, scale(U2, (f.x1 - 0.1 - FOOT.x) / Math.cos(a2)));
	})();
	const y = Math.max(0, H - (vel * vel) / (2 * G));
	const speed = Math.abs(vel);
	const onSecond = s > L1;

	let caption: string;
	if (s === 0 && !running) caption = deg === 0 ? 'Il secondo piano è orizzontale: lascia andare la pallina e guarda se si ferma.' : `Lascia andare la pallina: sul secondo piano, inclinato di ${deg}°, deve percorrere ${num(road, 1)} m per tornare all'altezza di partenza.`;
	else if (deg === 0 && onSecond) caption = `Sul piano orizzontale nessuna forza la frena: la pallina va avanti a ${num(VMAX, 1)} m/s, e senza attrito non si fermerebbe mai.`;
	else if (out) caption = `La pallina è uscita dalla figura: sale lungo il piano fino a ${num(road, 1)} m dal fondo, all'altezza di partenza, e poi torna indietro.`;
	else caption = deg === 0 ? 'La pallina scende e prende velocità.' : `La pallina risale fino all'altezza di partenza, dopo ${num(road, 1)} m sul secondo piano; poi torna indietro, e oscilla tra i due piani.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(f.x0 + 0.1, 0)} to={v(f.x1 - 0.1, 0)} />
				<path d={f.path([v(0, H), v(f.x1 - 0.1, H)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(TOP1.x - 0.25, TOP1.y + 0.25 * Math.tan(A1)), FOOT, end])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{deg > 0 && <path d={f.arc(FOOT, v(1, 0), U2, 0.7)} stroke="#000" strokeWidth={THIN} fill="none" />}
				{deg >= 6 && <Label f={f} at={add(FOOT, v(0.95 * Math.cos(a2 / 2), 0.95 * Math.sin(a2 / 2)))} size={13}>θ</Label>}
				<path d={f.path([v(-0.25, 0), v(-0.25, H)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-0.25, H / 2)} dir={v(-1, 0)}>h</Label>
				{!out && (
					<>
						<circle cx={f.px(centre).x} cy={f.px(centre).y} r={R * (f.W / (f.x1 - f.x0))} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
						{speed * KV > 0.08 && <Vector f={f} from={centre} to={add(centre, scale(onSecond ? U2 : U1, (vel >= 0 ? 1 : -1) * speed * KV))} color={QTY.velocita} name="v" labelDir={v(0, 1)} />}
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`\\theta = ${deg}^\\circ`}</Tex>
				<Tex>{deg > 0 ? `\\dfrac{h}{\\sin\\theta} = ${texNum(road, 1)}\\,\\text{m}` : `\\dfrac{h}{\\sin\\theta} \\to \\infty`}</Tex>
				<Tex>{`v = ${texNum(speed, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`\\text{altezza} = ${texNum(y, 1)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Inclinazione del secondo piano θ (gradi)" value={deg} min={0} max={40} step={1} onChange={(d) => reset(d)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={s === 0 && !running} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti in cima
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
