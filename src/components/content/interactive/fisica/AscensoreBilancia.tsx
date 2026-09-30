'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, THIN, THICK, TINT } from '../kit';
import { Ball, Block, Point, Vector, QTY } from '../fisica';

/**
 * Lesson 53 (Il diagramma delle forze): a person of 60 kg on a bathroom scale in a lift that travels 15 m, up or down.
 * The trip: 2 s accelerating at 1,5 m/s², 3 s at 3,0 m/s, 2 s braking at 1,5 m/s² (closed formulas for position and
 * speed, time in real seconds). Beside the shaft, the force diagram of the person: the weight (588 N) and the scale's
 * reaction F_v = m (g + a), 1 cm per 400 N, and the acceleration in green, 0,5 cm per m/s². The scale reads F_v / g:
 * 69 kg while the acceleration points up, 51 kg while it points down, 60 kg at rest or at constant speed.
 */

const G = 9.8;
const M = 60;
const A = 1.5;
const T1 = 2, T2 = 5, T3 = 7; // end of the three phases, s
const VC = A * T1; // 3 m/s
const TRIP = A * T1 * T1 + VC * (T2 - T1); // twice 1/2·a·T1², plus VC·(T2 − T1): 3 + 9 + 3 = 15 m
const KZ = 0.3; // cm of drawing per metre of shaft
const KF = 1 / 400; // cm per newton
const KA = 0.5; // cm per m/s²
const CW = 1.6, CH = 2.0;
const f = frame(-0.35, 5.75, -0.45, TRIP * KZ + CH + 0.75);

/** Distance travelled, speed and acceleration (all along the trip's direction) at time t. */
function trip(t: number) {
	if (t <= 0) return { d: 0, s: 0, a: 0 };
	if (t < T1) return { d: (A * t * t) / 2, s: A * t, a: A };
	if (t < T2) return { d: (A * T1 * T1) / 2 + VC * (t - T1), s: VC, a: 0 };
	if (t < T3) {
		const u = t - T2;
		return { d: (A * T1 * T1) / 2 + VC * (T2 - T1) + VC * u - (A * u * u) / 2, s: VC - A * u, a: -A };
	}
	return { d: TRIP, s: 0, a: 0 };
}

export default function AscensoreBilancia({ alt }: { alt?: string }) {
	const [up, setUp] = useState(true);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(running, (dt) => {
		const next = Math.min(T3, t + dt);
		setT(next);
		if (next >= T3) setRunning(false);
	});

	const { d, s, a: along } = trip(t);
	const sign = up ? 1 : -1;
	const a = sign * along; // vertical component, up positive
	const vy = sign * s;
	const z = up ? d : TRIP - d; // height of the cabin floor, m
	const Fv = M * (G + a);
	const reading = Fv / G;
	const P = M * G;

	const play = () => {
		if (running) return setRunning(false);
		if (t >= T3) setT(0);
		if (reduced) return setT(T1 / 2); // no animation: show the first phase
		setRunning(true);
	};
	const restart = (dir = up) => {
		setUp(dir);
		setRunning(false);
		setT(0);
	};

	let phase: string;
	let caption: string;
	if (t <= 0) {
		phase = 'fermo';
		caption = `L'ascensore è fermo al piano ${up ? 'terra' : 'più alto'}: la bilancia segna ${num(reading, 0)} kg, la massa della persona. Premi Parti.`;
	} else if (t >= T3) {
		phase = 'arrivato';
		caption = `L'ascensore è arrivato ed è fermo: la bilancia torna a ${num(reading, 0)} kg.`;
	} else if (along > 0) {
		phase = up ? 'parte in salita' : 'parte in discesa';
		caption = up ? `L'accelerazione è verso l'alto: la bilancia spinge la persona più del peso, con m(g + a), e segna ${num(reading, 0)} kg.` : `L'accelerazione è verso il basso: la bilancia spinge la persona meno del peso, con m(g − a), e segna ${num(reading, 0)} kg.`;
	} else if (along === 0) {
		phase = 'velocità costante';
		caption = `A velocità costante l'accelerazione è zero: la reazione è uguale al peso, anche se l'ascensore ${up ? 'sale' : 'scende'}, e la bilancia segna ${num(reading, 0)} kg.`;
	} else {
		phase = up ? 'frena in salita' : 'frena in discesa';
		caption = up ? `L'ascensore sale ma rallenta: l'accelerazione è verso il basso, e la bilancia segna meno, ${num(reading, 0)} kg.` : `L'ascensore scende ma rallenta: l'accelerazione è verso l'alto, e la bilancia segna di più, ${num(reading, 0)} kg.`;
	}

	// Shaft and cabin.
	const top = TRIP * KZ + CH + 0.45;
	const zc = z * KZ;
	const floors = [0, 5, 10, 15].map((m) => m * KZ);
	// The person's force diagram, beside the shaft.
	const o = v(3.3, 3.2);
	const ao = v(4.75, 3.2);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-0.1, 0), v(-0.1, top), v(CW + 0.1, top), v(CW + 0.1, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(-0.3, 0), v(CW + 0.3, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				{floors.map((y) => (
					<path key={y} d={f.path([v(-0.1, y), v(0.05, y)])} stroke="#000" strokeWidth={THIN} fill="none" />
				))}
				<path d={f.path([v(0.8, zc + CH), v(0.8, top)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={f.path([v(0.1, zc), v(0.1 + CW - 0.2, zc), v(0.1 + CW - 0.2, zc + CH), v(0.1, zc + CH)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
				<rect x={f.px(v(0.35, zc + 0.14)).x} y={f.px(v(0.35, zc + 0.14)).y} width={0.9 * (f.W / (f.x1 - f.x0))} height={0.14 * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<Block f={f} at={v(0.8, zc + 0.14)} w={0.46} h={0.95} />
				<Ball f={f} at={v(0.8, zc + 0.14 + 0.95 + 0.2)} r={0.2} />

				<Vector f={f} from={o} to={v(o.x, o.y + Fv * KF)} color={QTY.forza} name="F" sub="v" labelDir={v(1, 0)} />
				<Vector f={f} from={o} to={v(o.x, o.y - P * KF)} color={QTY.forza} name="P" labelDir={v(1, 0)} />
				<Point f={f} at={o} />
				{Math.abs(a) > 1e-9 && <Vector f={f} from={ao} to={v(ao.x, ao.y + a * KA)} color={QTY.accelerazione} name="a" labelDir={v(1, 0)} />}
				<Label f={f} at={v(3.7, 0.25)} upright size={14}>
					bilancia: {num(reading, 0)} kg
				</Label>
			</Drawing>

			<Readout>
				<span>{phase}</span>
				<Tex>{`a = ${a > 0 ? '+' : ''}${texNum(a, 1)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`v = ${texNum(vy, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`F_v = m\\,(g + a) = ${texNum(Fv, 0)}\\,\\text{N}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Direzione del viaggio"
						options={[
							{ value: 'su', label: 'In salita' },
							{ value: 'giu', label: 'In discesa' }
						]}
						value={up ? 'su' : 'giu'}
						onChange={(k) => restart(k === 'su')}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : t >= T3 ? 'Rifai il viaggio' : t > 0 ? 'Riprendi' : 'Parti'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => restart()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
