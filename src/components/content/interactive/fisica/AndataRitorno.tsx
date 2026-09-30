'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, useFrameLoop, useReducedMotion, num, texNum, THICK, THIN, TINT, type V } from '../kit';
import { Arrow, QTY } from '../fisica';

/**
 * Lesson 38 (Punto materiale, traiettoria e sistema di riferimento), example 2: a car on a straight road goes from
 * s = 0 to s = 120 m at 10 m/s (12 s), stops for 3 s, and comes back to s = 50 m at 10 m/s (7 s), 22 s in all. The
 * student moves the time or plays it. Above the car, the displacement from the start (a blue arrow, as the lesson's
 * TikZ) and the road travelled (an orange line, one row for the way out and one for the way back): they are equal
 * while the car goes forward, then the displacement shrinks and the distance keeps growing, to 50 m and 190 m.
 */

const S_MAX = 120;
const S_END = 50;
const SPEED = 10; // m/s
const T1 = S_MAX / SPEED; // 12 s, at the far end
const T2 = T1 + 3; // 15 s, leaves again
const T_END = T2 + (S_MAX - S_END) / SPEED; // 22 s
const CM = 0.065; // cm per metre
const x = (s: number) => s * CM;
/** Seconds of animation per second of the motion. */
const PACE = 0.5;

const f = frame(-0.45, 9.9, -0.75, 1.75);
const ORANGE = QTY.risultante;

/** Position at time t (piecewise uniform motion). */
function position(t: number) {
	if (t <= T1) return SPEED * t;
	if (t <= T2) return S_MAX;
	return S_MAX - SPEED * (t - T2);
}

/** A car seen from the side, its front at `at` facing `dir` (1 right, −1 left). */
function Car({ at, dir }: { at: V; dir: 1 | -1 }) {
	const p = (dx: number, y: number) => add(at, v(-dir * dx, y));
	const wheel = (dx: number) => {
		const q = f.px(p(dx, 0.08));
		return <circle cx={q.x} cy={q.y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />;
	};
	return (
		<g pointerEvents="none">
			<polygon points={f.pts(p(0, 0.08), p(0.56, 0.08), p(0.56, 0.24), p(0.44, 0.24), p(0.35, 0.37), p(0.15, 0.37), p(0.07, 0.24), p(0, 0.22))} fill={TINT.blue} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			{wheel(0.13)}
			{wheel(0.44)}
		</g>
	);
}

export default function AndataRitorno({ alt }: { alt?: string }) {
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T_END, t + dt / PACE);
		setT(next);
		if (next >= T_END) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(T_END);
		if (t >= T_END) setT(0);
		setPlaying(true);
	};

	const s = position(t);
	const back = t > T2;
	const outEnd = back || t >= T1 ? S_MAX : s; // the way out, up to 120 m
	const d = back ? S_MAX + (S_MAX - s) : s;
	const dir: 1 | -1 = back ? -1 : 1;
	// The car's front is at s going right; going left its front is at s too, and the body trails to the right.
	const carFront = v(x(s) + (dir === 1 ? 0.28 : -0.28), 0);

	let caption: string;
	if (t === 0) caption = 'Premi Avvia o sposta il tempo: l’auto parte da s = 0.';
	else if (t < T1) caption = 'L’auto va sempre avanti: lo spostamento e la distanza percorsa sono uguali.';
	else if (!back) caption = 'L’auto è ferma in fondo, a 120 m: né lo spostamento né la distanza percorsa cambiano.';
	else if (t < T_END - 1e-9) caption = `Tornando indietro lo spostamento si accorcia, ${num(s, 0)} m, mentre la distanza percorsa continua a crescere, ${num(d, 0)} m.`;
	else caption = 'All’arrivo lo spostamento è 50\u00a0m e la distanza percorsa 120\u00a0m + 70\u00a0m = 190\u00a0m.';

	const ticks: string[] = [];
	for (let k = 0; k <= S_MAX; k += 10) ticks.push(f.path([v(x(k), -0.07), v(x(k), 0.07)]));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-0.3, 0), v(x(S_MAX) + 0.4, 0)])} stroke="#000" strokeWidth={THICK} />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} />
				{[0, 20, 40, 60, 80, 100, 120].map((k) => (
					<Label key={k} f={f} at={v(x(k), -0.2)} dir={v(0, -1)} upright size={12}>
						{k}
					</Label>
				))}
				<Arrow f={f} from={v(x(S_MAX) + 0.3, 0)} to={v(x(S_MAX) + 0.75, 0)} weight="thin" />
				<Label f={f} at={v(x(S_MAX) + 0.75, 0)} dir={v(1, 0)}>
					s
				</Label>
				<Label f={f} at={v(x(S_MAX) + 1.05, 0)} dir={v(1, 0)} upright size={13}>
					(m)
				</Label>

				{/* the road travelled: the way out, then the way back */}
				{outEnd > 0.5 && <path d={f.path([v(0, 1.4), v(x(outEnd), 1.4)])} stroke={ORANGE} strokeWidth={THICK * 1.6} strokeLinecap="round" fill="none" />}
				{back && <path d={f.path([v(x(S_MAX), 1.12), v(x(s), 1.12)])} stroke={ORANGE} strokeWidth={THICK * 1.6} strokeLinecap="round" fill="none" />}
				{outEnd > 0.5 && (
					<Label f={f} at={v(x(outEnd) + 0.05, 1.4)} dir={v(1, 0)} upright size={12} color={ORANGE}>
						andata
					</Label>
				)}
				{back && (
					<Label f={f} at={v(x(S_MAX) + 0.05, 1.12)} dir={v(1, 0)} upright size={12} color={ORANGE}>
						ritorno
					</Label>
				)}
				{/* the displacement from the start */}
				{s > 1 && <Arrow f={f} from={v(0, 0.75)} to={v(x(s), 0.75)} color={QTY.vettore} />}
				{s > 12 && (
					<Label f={f} at={v(x(s) / 2, 0.78)} dir={v(0, 1)} size={14} color={QTY.vettore}>
						Δs
					</Label>
				)}
				<Car at={carFront} dir={dir} />
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 1)}\\,\\text{s}`}</Tex>
				<Tex>{`s = ${texNum(s, 0)}\\,\\text{m}`}</Tex>
				<span>
					spostamento <Tex>{`\\Delta s = ${texNum(s, 0)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					distanza percorsa <Tex>{`d = ${texNum(d, 0)}\\,\\text{m}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Tempo t (secondi)" value={t} min={0} max={T_END} step={0.1} onChange={(y) => { setPlaying(false); setT(Math.min(T_END, y)); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= T_END ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
