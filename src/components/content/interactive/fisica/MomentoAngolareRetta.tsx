'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, unit, texNum, num, useFrameLoop, useReducedMotion, THIN, DASH } from '../kit';
import { Ball, Point, Vector, VecLabel, QTY } from '../fisica';

/**
 * Lesson 90 (Il momento angolare), "Il moto rettilineo": a particle of 0,50 kg runs at 2,0 m/s along a horizontal
 * line that passes at a distance b (the student's choice, 0 to 3 m) above the pole O, drawn at 1 cm per metre. The
 * position vector r, the momentum p (1 cm per kg·m/s), the angle φ between them and the arm b are drawn; under the
 * figure r, φ, r sin φ and L = r p sin φ are written. While the particle goes by, r and φ change and L does not.
 *
 * Uniform motion, x = −4 m + v t for 4 s; with reduced motion the button moves it half a second at a time.
 */

const M = 0.5;
const SPEED = 2;
const P = M * SPEED;
const X_START = -4;
const X_END = 4;
const T_END = (X_END - X_START) / SPEED;
const O = v(0, 0);
const f = frame(-4.6, 5.8, -0.55, 3.95);

export default function MomentoAngolareRetta({ alt }: { alt?: string }) {
	const [b, setB] = useState(1.5);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const done = t >= T_END - 1e-9;
	const run = (seconds: number) => setT((now) => Math.min(T_END, now + seconds));
	useFrameLoop(running && !done, run);

	const reset = (arm = b) => {
		setRunning(false);
		setB(arm);
		setT(0);
	};
	const play = () => {
		if (reduced) return run(0.5);
		setRunning((r) => !r);
	};

	const at = v(X_START + SPEED * t, b);
	const r = Math.hypot(at.x, at.y);
	const phi = Math.atan2(at.y, at.x); // between r and p, which points along +x: 0 to π
	const L = M * SPEED * b;
	const u = unit(at);
	const live = running && !done;

	let caption: string;
	if (b === 0) caption = 'La retta passa per il polo: r e p hanno la stessa direzione, il braccio è zero e il momento angolare è nullo in ogni istante.';
	else if (t === 0) caption = `La retta passa a ${num(b, 1)} m dal polo O. Fai partire la particella: che cosa succede a r, a φ e al momento angolare?`;
	else caption = `La distanza r e l'angolo φ cambiano, ma r sin φ resta ${num(b, 1)} m, il braccio: il momento angolare vale sempre m v b = ${num(L, 2)} kg·m²/s, con verso orario (entra nel foglio).`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-4.5, b), v(5.7, b)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				{b > 0 && (
					<>
						<path d={f.path([O, v(0, b)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						<polyline points={f.right(v(0, b), v(1, 0), v(0, -1), 0.18)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={v(0, b / 2)} dir={v(at.x <= 0 ? 1 : -1, 0)}>
							b
						</Label>
						<path d={f.path([at, add(at, scale(u, 0.95))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						<path d={f.arc(at, v(1, 0), u, 0.55)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={add(at, scale(v(Math.cos(phi / 2), Math.sin(phi / 2)), phi < 0.7 ? 1.5 : 0.78))} dir={v(0, 0)}>
							φ
						</Label>
					</>
				)}
				{r > 0.25 && <Vector f={f} from={O} to={at} color={QTY.vettore} />}
				{r > 0.9 && <VecLabel f={f} at={scale(at, 0.5)} dir={at.x < 0 ? v(-u.y, u.x) : v(u.y, -u.x)} name="r" color={QTY.vettore} />}
				<Vector f={f} from={at} to={add(at, v(P, 0))} color={QTY.velocita} name="p" labelDir={v(0, at.x > 0 ? -1 : 1)} />
				<Ball f={f} at={at} r={0.13} />
				<Point f={f} at={O} />
				<Label f={f} at={O} dir={v(0, -1)}>
					O
				</Label>
			</Drawing>

			<Readout>
				<Tex>{`r = ${texNum(r, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`\\varphi = ${texNum((phi * 180) / Math.PI, 0)}^\\circ`}</Tex>
				<Tex>{`r\\sin\\varphi = ${texNum(r * Math.sin(phi), 2)}\\,\\text{m}`}</Tex>
				<Tex>{`L = r\\,p\\sin\\varphi = ${texNum(L, 2)}\\,\\text{kg}\\cdot\\text{m}^2/\\text{s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Braccio b" unit="m" value={b} min={0} max={3} step={0.5} onChange={(x) => reset(Math.round(x * 2) / 2)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={done} onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : live ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di mezzo secondo' : live ? 'Ferma' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti alla partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
