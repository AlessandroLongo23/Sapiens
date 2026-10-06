'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, useFrameLoop, useReducedMotion, TINT, THICK } from '../kit';
import { LIQUID, Liquid, Surface, Vessel } from './liquidi';

/**
 * Lesson 101, "L'attrito viscoso e la velocità limite", example 3: two steel balls fall in glycerine, each in its own
 * cylinder 20 cm tall. The first has a radius of 1,0 mm (limit speed 9,5 mm/s); the student sets the radius of the
 * second between 0,5 and 2,0 mm. Each ball follows v(t) = v_l (1 − e^(−t/τ)), which is the limit speed after a few
 * thousandths of a second; the race stops when the faster one reaches the bottom. Doubling the radius makes the limit
 * speed four times as large. The fall is in scale (0,2 cm per cm), the balls are drawn ten times as large.
 */

const G = 9.8;
const ETA = 1.5; // Pa·s
const DS = 7800, DF = 1260; // kg/m³
const DEPTH = 0.2; // m
const CM = 0.2; // drawing centimetres per centimetre
const W = 1.3;
const X = [0.4, 3.0];
const H = DEPTH * 100 * CM;

const f = frame(-0.2, X[1] + W + 1.25, -0.75, H + 0.55);

const fix = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
/** Limit speed in m/s of a steel ball of radius r (mm) in glycerine, with Archimedes' push. */
const limit = (mm: number) => (2 * (mm / 1000) ** 2 * G * (DS - DF)) / (9 * ETA);
/** τ = m / (6π η r) = 2 r² d_s / (9 η), in seconds. */
const tau = (mm: number) => (2 * (mm / 1000) ** 2 * DS) / (9 * ETA);
/** Distance fallen after t seconds, starting at rest. */
const fallen = (mm: number, t: number) => limit(mm) * (t - tau(mm) * (1 - Math.exp(-t / tau(mm))));

export default function SferetteViscose({ alt }: { alt?: string }) {
	const [r2, setR2] = useState(2);
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const radii = [1, r2];
	const fastest = Math.max(1, r2);
	const tEnd = DEPTH / limit(fastest) + tau(fastest);
	const done = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});
	const play = () => {
		if (reduced) return setT(tEnd);
		if (done) setT(0);
		setPlaying(true);
	};
	const reset = () => {
		setPlaying(false);
		setT(0);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{X.map((x, i) => {
					const y = H - Math.min(DEPTH, fallen(radii[i], t)) * 100 * CM;
					const rr = (radii[i] / 10) * 10 * CM; // ten times as large as in scale
					const c = f.px(v(x + W / 2, Math.max(y, rr)));
					return (
						<g key={i}>
							<Liquid f={f} pts={[v(x, H), v(x, 0), v(x + W, 0), v(x + W, H)]} fill={LIQUID.olio} />
							<Surface f={f} from={v(x, H)} to={v(x + W, H)} />
							<Vessel f={f} pts={[v(x, H + 0.35), v(x, 0), v(x + W, 0), v(x + W, H + 0.35)]} />
							<circle cx={c.x} cy={c.y} r={rr * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
							<Label f={f} at={v(x + W / 2, -0.05)} dir={v(0, -1)} upright size={13}>
								r = {fix(radii[i], radii[i] % 0.5 ? 2 : 1).replace('{,}', ',')} mm
							</Label>
						</g>
					);
				})}
				<Label f={f} at={v(X[1] + W + 0.1, H / 2)} dir={v(1, 0)} upright size={12}>
					20 cm
				</Label>
			</Drawing>

			<Readout>
				<span>
					<Tex>{`v_{l1} = ${fix(limit(1) * 1000, 1)}\\,\\text{mm/s}`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`v_{l2} = ${fix(limit(r2) * 1000, 1)}\\,\\text{mm/s}`}</Tex>
				</span>
				<span>
					<Tex>{`\\dfrac{v_{l2}}{v_{l1}} = ${fix(r2 * r2, r2 * r2 >= 1 ? 2 : 3)}`}</Tex>
				</span>
				<span>
					<Tex>{`t = ${fix(t, 1)}\\,\\text{s}`}</Tex>
				</span>
			</Readout>
			<Caption>
				Due sferette d’acciaio nella glicerina (disegnate dieci volte più grandi del vero).{' '}
				{done ? (
					<>
						La più veloce ha toccato il fondo; l’altra ha percorso <Tex>{`${fix(Math.min(fallen(1, t), fallen(r2, t)) * 100, 1)}\\,\\text{cm}`}</Tex>.
					</>
				) : (
					'Scegli il raggio della seconda e premi Avvia.'
				)}
			</Caption>

			<Controls>
				<Slider label="Raggio della 2ª (mm)" value={r2} min={0.5} max={2} step={0.25} onChange={(x) => { reset(); setR2(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={playing} onClick={play}>
						<Play className="size-4" aria-hidden="true" />
						{done ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Da capo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
