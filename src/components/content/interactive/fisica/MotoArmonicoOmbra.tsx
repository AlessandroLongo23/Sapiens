'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, useFrameLoop, useReducedMotion, texNum, THIN, THICK, DASH } from '../kit';
import { Vector, Point, QTY } from '../fisica';

/**
 * Lesson 49 (Il moto armonico): harmonic motion as the shadow of uniform circular motion. P turns counterclockwise
 * on a circle of radius A, starting on the right at t = 0; a dashed vertical line drops from P to its shadow Q on a
 * rail drawn under the circle, so Q moves as x = A cos(ωt). On P, faint, its velocity (tangent) and centripetal
 * acceleration; on Q, solid, their horizontal components: the velocity above the rail, the acceleration below it,
 * always towards the centre. The student sets the amplitude (0,05 to 0,20 m, drawn at one centimetre per 0,1 m) and
 * the period (2,0 to 6,0 s) and plays the motion in real time. Readout: t, x, v and a of Q, v_max = ωA and
 * a_max = ω²A. Scales: 3 cm per m/s, 1 cm per m/s² (with T ≥ 2 s the acceleration never reaches past the centre).
 */

const M = 10; // cm of drawing per metre
const KV = 3;
const KA = 1;
const RAIL = -2.6;
const f = frame(-3, 3, -3.6, 2.85);
/** A value with fixed decimals for <Tex>, decimal comma, no minus zero. */
const fx = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', '{,}');
const GRAY = '#999999'; // gray!60

export default function MotoArmonicoOmbra({ alt }: { alt?: string }) {
	const [A, setA] = useState(0.15);
	const [T, setT] = useState(2);
	const [t, setTime] = useState(0.4);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const w = (2 * Math.PI) / T;
	useFrameLoop(playing, (dt) => setTime((x) => x + dt));
	const play = () => {
		if (reduced) return setTime((x) => x + T / 8);
		setPlaying((p) => !p);
	};

	const th = w * t;
	const x = A * Math.cos(th);
	const vx = -w * A * Math.sin(th);
	const ax = -w * w * A * Math.cos(th);
	const R = A * M;
	const O = v(0, 0);
	const P = polar(R, th);
	const Q = v(P.x, RAIL);
	const vP = scale(polar(1, th + Math.PI / 2), w * A * KV);
	const aP = scale(polar(1, th + Math.PI), w * w * A * KA);
	const up = v(0, 0.22), down = v(0, -0.22);
	const vQ = vx * KV, aQ = ax * KA;

	const atCentre = Math.abs(x) < 0.08 * A;
	const atEnd = Math.abs(x) > 0.97 * A;
	const caption = atCentre
		? 'Q passa per il centro: la velocità è massima e l’accelerazione è quasi zero.'
		: atEnd
			? 'Q è vicino a un’estremità: si ferma per un istante e torna indietro, con l’accelerazione massima verso il centro.'
			: vx * x < 0
				? 'Q va verso il centro: velocità e accelerazione hanno lo stesso verso, e Q accelera.'
				: 'Q si allontana dal centro: l’accelerazione è opposta alla velocità, e Q rallenta.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R * (f.W / (f.x1 - f.x0))} fill="none" stroke={GRAY} strokeWidth={THICK} />
				<path d={f.path([v(-2.3, 0), v(2.3, 0)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={f.path([O, P])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={f.path([P, Q])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				{/* the rail of the shadow, with the centre and the two ends */}
				<path d={f.path([v(-2.5, RAIL), v(2.5, RAIL)])} stroke="#000" strokeWidth={THICK} fill="none" />
				{[-R, 0, R].map((xx, i) => (
					<path key={i} d={f.path([v(xx, RAIL + 0.1), v(xx, RAIL - 0.1)])} stroke="#000" strokeWidth={THIN} fill="none" />
				))}
				<Label f={f} at={v(-R, 0)} dir={v(-0.7, -0.7)} size={13}>−A</Label>
				<Label f={f} at={v(R, 0)} dir={v(0.7, -0.7)} size={13}>A</Label>
				<Label f={f} at={O} dir={v(-0.5, 0.8)} size={13}>O</Label>
				<g opacity={0.45}>
					<Vector f={f} from={P} to={add(P, vP)} color={QTY.velocita} weight="thin" />
					{w * w * A * KA > 0.06 && <Vector f={f} from={P} to={add(P, aP)} color={QTY.accelerazione} weight="thin" />}
				</g>
				{Math.abs(vQ) > 0.06 && <Vector f={f} from={add(Q, up)} to={add(Q, v(vQ, 0.22))} color={QTY.velocita} name="v" />}
				{Math.abs(aQ) > 0.06 && <Vector f={f} from={add(Q, down)} to={add(Q, v(aQ, -0.22))} color={QTY.accelerazione} name="a" />}
				<Point f={f} at={O} />
				<Point f={f} at={P} r={3} />
				<Label f={f} at={P} dir={v(Math.cos(th) >= 0 ? 1 : -1, Math.sin(th) >= 0 ? 0.7 : 0.2)}>P</Label>
				<circle cx={f.px(Q).x} cy={f.px(Q).y} r={5} fill={QTY.risultante} stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={add(Q, v(0, -0.42))} dir={v(0, -1)}>Q</Label>
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`x = A\\cos(\\omega t) = ${fx(x, 3)}\\,\\text{m}`}</Tex>
				<Tex>{`v = ${fx(vx, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`a = -\\omega^2 x = ${fx(ax, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`v_{max} = \\omega A = ${fx(w * A, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`a_{max} = \\omega^2 A = ${fx(w * w * A, 2)}\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Ampiezza A (m)" value={A} min={0.05} max={0.2} step={0.01} onChange={setA} />
				<Slider label="Periodo T (s)" value={T} min={2} max={6} step={0.5} onChange={setT} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setTime(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna a t = 0
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
