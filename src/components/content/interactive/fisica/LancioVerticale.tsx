'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, useFrameLoop, useReducedMotion, num, texNum, THIN, DASH } from '../kit';
import { Arrow, Ball, Ground, QTY } from '../fisica';

/**
 * Lesson 44 (La caduta libera e il lancio verticale): a ball thrown straight up from the ground, with a slider for the
 * launch speed v0 (5 to 20 m/s) and a slider for the time. A button throws it: y = v0 t - g t²/2, v = v0 - g t, with
 * g = 9,8 m/s², until it is back on the ground at 2 v0 / g. The blue arrow of the velocity (0,06 cm per m/s) shortens
 * on the way up, vanishes at the top and grows downwards on the way down; the green arrow of the acceleration is
 * always the same, downwards. A dashed mark shows the maximum height v0²/(2g); faint dots mark where the ball was
 * every 0,25 s. The axis is upwards, as in the lesson, so v is signed.
 */

const G = 9.8;
const PACE = 1; // seconds of the problem per second of animation
const SY = 0.24; // cm per metre
const SV = 0.06; // cm per m/s
const R = 0.16; // ball radius, cm
const X = 1.6; // the ball's vertical line, cm
const f = frame(-1.75, 4.75, -1.5, 21 * SY + 1.15);

export default function LancioVerticale({ alt }: { alt?: string }) {
	const [v0, setV0] = useState(14);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const T = (2 * v0) / G;
	const tUp = v0 / G;
	const hMax = (v0 * v0) / (2 * G);

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T, t + dt * PACE);
		setT(next);
		if (next >= T) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(tUp);
		if (t >= T - 1e-9) setT(0);
		setPlaying(true);
	};

	const y = Math.max(0, v0 * t - 0.5 * G * t * t);
	const vel = v0 - G * t;
	const flying = t > 0 && t < T - 1e-9;
	const c = v(X, R + y * SY);
	const vTip = add(c, v(0, vel * SV));
	const top = Math.abs(t - tUp) < 0.04;
	const trail = Array.from({ length: Math.floor(t / 0.25) + 1 }, (_, i) => i * 0.25).filter((s) => s < t - 0.05);

	let caption: string;
	if (t === 0) caption = 'Scegli la velocità di lancio e premi Lancia, oppure sposta il tempo.';
	else if (top) caption = 'In cima la velocità passa per zero, ma l’accelerazione resta g verso il basso: la palla riparte in giù.';
	else if (!flying) caption = `La palla è tornata a terra dopo ${num(T, 2)} s, con velocità −${num(v0, 1)} m/s: uguale e opposta a quella di lancio.`;
	else if (vel > 0) caption = `In salita: velocità verso l'alto, accelerazione verso il basso, e la palla rallenta di 9,8 m/s ogni secondo.`;
	else caption = 'In discesa: velocità e accelerazione verso il basso, e la palla va sempre più veloce.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-0.2, 0)} to={v(3.8, 0)} />
				<path d={f.path([v(-0.5, 0), v(-0.5, 21 * SY + 0.3)])} stroke="#000" strokeWidth={THIN} />
				<polygon points={f.pts(v(-0.5, 21 * SY + 0.45), v(-0.56, 21 * SY + 0.3), v(-0.44, 21 * SY + 0.3))} fill="#000" />
				<Label f={f} at={v(-0.5, 21 * SY + 0.5)} dir={v(0, 1)} size={13}>y</Label>
				{[5, 10, 15, 20].map((m) => (
					<g key={m}>
						<path d={f.path([v(-0.57, R + m * SY), v(-0.43, R + m * SY)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(-0.6, R + m * SY)} dir={v(-1, 0)} upright size={11}>{`${m} m`}</Label>
					</g>
				))}
				<path d={f.path([v(-0.43, R + hMax * SY), v(4.5, R + hMax * SY)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} />
				<Label f={f} at={v(4.55, R + hMax * SY)} dir={v(-0.5, 1)} upright size={12}>
					<tspan fontStyle="italic">h</tspan>
					<tspan fontSize={9} dy={3}>max</tspan>
					<tspan dy={-3}>{` = ${num(hMax, 1)} m`}</tspan>
				</Label>
				{trail.map((s) => {
					const p = f.px(v(X, R + (v0 * s - 0.5 * G * s * s) * SY));
					return <circle key={s} cx={p.x} cy={p.y} r={2} fill="#808080" opacity={0.5} />;
				})}
				<Ball f={f} at={c} r={R} />
				{Math.abs(vel) * SV > 0.05 && <Arrow f={f} from={c} to={vTip} color={QTY.velocita} />}
				{Math.abs(vel) * SV > 0.05 && <Label f={f} at={vTip} dir={v(-1, vel > 0 ? 0.6 : -0.6)} color={QTY.velocita} size={13}>v</Label>}
				<Arrow f={f} from={add(c, v(0.45, G * SV))} to={add(c, v(0.45, 0))} color={QTY.accelerazione} />
				<Label f={f} at={add(c, v(0.45, G * SV * 0.5))} dir={v(1, 0)} color={QTY.accelerazione} size={13}>g</Label>
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`y = ${texNum(y, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`v = ${texNum(vel, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`a = -9{,}8\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`h_{max} = \\dfrac{v_0^2}{2g} = ${texNum(hMax, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`t_{salita} = \\dfrac{v_0}{g} = ${texNum(tUp, 2)}\\,\\text{s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Velocità di lancio v₀ (m/s)" value={v0} min={5} max={20} step={1} onChange={(x) => { setPlaying(false); setT(0); setV0(x); }} />
				<Slider label="Tempo t (s)" value={Math.round(t * 100) / 100} min={0} max={Math.round(T * 100) / 100} step={0.01} onChange={(x) => { setPlaying(false); setT(Math.min(T, x)); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t > 0 && t < T - 1e-9 ? 'Continua' : 'Lancia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Da capo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
