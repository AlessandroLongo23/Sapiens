'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, useFrameLoop, useReducedMotion, texNum, num, THIN, THICK, TINT } from '../kit';
import { Vector, Point, QTY } from '../fisica';

/**
 * Lesson 86 (Velocità angolare e accelerazione angolare), "Dalle grandezze angolari a quelle lineari": a disc seen from
 * above starts from rest and turns counterclockwise with the constant angular acceleration the student picks (0,5 to
 * 2,0 rad/s²). A point P of the disc, at the distance r the student picks (1,0 to 2,0 m; nearer the axis the arrows and their names pile up on the centre), carries the tangential acceleration αr (tangent, thin), the centripetal one ω²r (towards the axis, thin) and
 * their sum (the velocity, on the same line as αr, is only in the readout). The run stops when ω reaches 1,8 rad/s, so the centripetal arrow never passes the centre.
 *
 * The closed laws of the lesson: ω = αt, θ = αt²/2, v = ωr, a_t = αr, a_c = ω²r. Drawn at 1 cm per metre; the
 * accelerations at 0,3 cm per m/s² (the components thin and solid, not dashed: they are too short for dashes).
 */

const R_DISC = 2.2; // the disc's radius, metres (and centimetres)
const W_END = 1.8; // rad/s
const KA = 0.3;
const f = frame(-2.75, 2.75, -2.75, 2.75);

export default function DiscoAccelerazioneAngolare({ alt }: { alt?: string }) {
	const [alpha, setAlpha] = useState(1);
	const [r, setR] = useState(1.5);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const tEnd = W_END / alpha;
	const w = alpha * t;
	const theta = 0.5 * alpha * t * t;
	const ended = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(Math.round(x * 10) / 10);
	};
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(ended ? 0 : tEnd);
		if (ended) setT(0);
		setPlaying(true);
	};

	const O = v(0, 0);
	const P = polar(r, theta);
	const tang = polar(1, theta + Math.PI / 2);
	const inward = polar(1, theta + Math.PI);
	const vel = w * r, at = alpha * r, ac = w * w * r;
	const a = Math.hypot(at, ac);
	const atTip = add(P, scale(tang, at * KA));
	const acTip = add(P, scale(inward, ac * KA));
	const aTip = add(atTip, scale(inward, ac * KA));

	let caption: string;
	if (t === 0) caption = `Il disco è fermo: la velocità angolare è zero, e con lei la componente centripeta. Il punto ha solo l'accelerazione tangenziale, ${num(at, 2)} m/s².`;
	else if (ended) caption = `Dopo ${num(t, 1)} s il disco gira a ${num(W_END, 1)} rad/s: la componente tangenziale è rimasta ${num(at, 2)} m/s², quella centripeta è arrivata a ${num(ac, 2)} m/s².`;
	else caption = `La componente tangenziale resta ${num(at, 2)} m/s²; quella centripeta cresce con il quadrato della velocità angolare, e l'accelerazione totale ruota verso il centro.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R_DISC * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([O, polar(R_DISC, theta)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Point f={f} at={O} />
				{ac * KA > 0.06 && <Vector f={f} from={P} to={acTip} color={QTY.accelerazione} weight="thin" name="a" sub="c" labelAt={0.6} labelDir={scale(tang, -1)} />}
				<Vector f={f} from={P} to={atTip} color={QTY.accelerazione} weight={ac * KA > 0.06 ? 'thin' : 'thick'} name="a" sub="t" labelAt={0.9} labelDir={polar(1, theta)} />
				{ac * KA > 0.06 && <Vector f={f} from={P} to={aTip} color={QTY.accelerazione} name="a" labelDir={tang} />}
				<Point f={f} at={P} r={3} />
				<Label f={f} at={P} dir={polar(1, theta - Math.PI / 4)}>P</Label>
				<path d={f.path([v(-2.65, -2.55), v(-1.65, -2.55)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={`${f.path([v(-2.65, -2.48), v(-2.65, -2.62)])} ${f.path([v(-1.65, -2.48), v(-1.65, -2.62)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-2.15, -2.55)} dir={v(0, 1)} upright size={12}>1 m</Label>
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<Tex>{`\\omega = \\alpha\\,t = ${texNum(w, 2)}\\,\\text{rad/s}`}</Tex>
				<Tex>{`\\theta = ${texNum(theta, 2)}\\,\\text{rad}`}</Tex>
				<Tex>{`v = \\omega\\,r = ${texNum(vel, 2)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`a_t = \\alpha\\,r = ${texNum(at, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`a_c = \\omega^2 r = ${texNum(ac, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`a = ${texNum(a, 2)}\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="α (rad/s²)" value={alpha} min={0.5} max={2} step={0.1} onChange={change(setAlpha)} />
				<Slider label="Distanza r (m)" value={r} min={1} max={2} step={0.1} onChange={change(setR)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : ended ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta da fermo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
