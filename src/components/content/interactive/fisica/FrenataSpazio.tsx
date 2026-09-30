'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, texNum, num, useFrameLoop, useReducedMotion, THIN, THICK, DASH, TINT, FONT, INK, type V } from '../kit';

/**
 * Lesson 61 (L'energia cinetica e il teorema dell'energia cinetica), "Lo spazio di frenata": two cars on two lanes of
 * the same road start braking on the same line at the same instant, the lower one at twice the speed of the upper
 * one. The student sets the upper speed (10 to 65 km/h) and the road (dry, μd = 0,70, or wet, μd = 0,40: indicative
 * values, as in the lesson's example). With "Frena" both slow down with a = μd g, positions from the closed formula
 * x = v t − ½ a t², played at twice real time; where each stops a line stays on the road, and the readout gives
 * d = v²/(2 μd g) and 4d. Road drawn at 0,045 cm per metre, 170 m long (the longest stop, 130 km/h on wet asphalt,
 * is 166 m); the cars are not to scale.
 */

const G = 9.8;
const SC = 0.045; // cm per metre
const ROAD = 170; // m
const LANE = [1.0, 0]; // y of the two lanes' kerb line under the cars
const SPEEDUP = 2; // animation runs at twice real time
const f = frame(-1.75, ROAD * SC + 0.45, -0.95, 2.1);

type Road = 'asciutto' | 'bagnato';
const MU: Record<Road, number> = { asciutto: 0.7, bagnato: 0.4 };

/** A car seen from the side, its front bumper at `at` (on the road), facing right. */
function Car({ at, fill }: { at: V; fill: string }) {
	const p = (x: number, y: number) => add(at, v(-x, y));
	const wheel = (x: number) => f.px(p(x, 0.09));
	return (
		<g>
			<polygon points={f.pts(p(0, 0.09), p(0.62, 0.09), p(0.62, 0.25), p(0.48, 0.25), p(0.38, 0.39), p(0.16, 0.39), p(0.08, 0.25), p(0, 0.23))} fill={fill} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" />
			<circle cx={wheel(0.14).x} cy={wheel(0.14).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
			<circle cx={wheel(0.48).x} cy={wheel(0.48).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
		</g>
	);
}

export default function FrenataSpazio({ alt }: { alt?: string }) {
	const [kmh, setKmh] = useState(36);
	const [road, setRoad] = useState<Road>('asciutto');
	const [t, setT] = useState(0); // seconds since braking began
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const mu = MU[road];
	const a = mu * G;
	const speeds = [kmh / 3.6, (2 * kmh) / 3.6];
	const stops = speeds.map((s) => (s * s) / (2 * a));
	const tEnd = speeds[1] / a;
	const pos = speeds.map((s) => {
		const tt = Math.min(t, s / a);
		return s * tt - 0.5 * a * tt * tt;
	});
	const stopped = speeds.map((s) => t >= s / a - 1e-9);
	const over = t >= tEnd - 1e-9;

	useFrameLoop(playing, (dt) => {
		const next = Math.min(tEnd, t + dt * SPEEDUP);
		setT(next);
		if (next >= tEnd) setPlaying(false);
	});
	const play = () => {
		if (reduced) return setT(tEnd);
		setT(0);
		setPlaying(true);
	};
	const reset = () => {
		setPlaying(false);
		setT(0);
	};

	const ticks: string[] = [];
	const labels: { x: number; text: string }[] = [];
	for (let m = 0; m <= ROAD; m += 10) {
		const big = m % 50 === 0;
		ticks.push(f.path([v(m * SC, -0.08), v(m * SC, big ? -0.24 : -0.16)]));
		if (big) labels.push({ x: m * SC, text: String(m) });
	}
	const names = ['v', '2v'];
	const fills = [TINT.blue, TINT.orange];

	let caption: string;
	if (t === 0) caption = `Le due auto cominciano a frenare sulla stessa linea, a ${num(kmh, 0)} e a ${num(2 * kmh, 0)} km/h. Premi Frena.`;
	else if (!over) caption = stopped[0] ? `L’auto più lenta si è già fermata dopo ${num(stops[0], 1)} m; l’altra corre ancora.` : 'Le due auto frenano con la stessa decelerazione.';
	else caption = `Al doppio della velocità lo spazio di frenata è quattro volte più lungo: ${num(stops[1], 1)} m contro ${num(stops[0], 1)} m. L’energia cinetica da togliere è quattro volte più grande, e l’attrito che la toglie è lo stesso.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the two lanes */}
				{LANE.map((y, i) => (
					<path key={i} d={f.path([v(-1.55, y), v(ROAD * SC + 0.3, y)])} stroke="#000" strokeWidth={THICK} fill="none" />
				))}
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{labels.map((l) => {
					const p = f.px(v(l.x, -0.3));
					return (
						<text key={l.text} x={p.x} y={p.y} dy="0.75em" textAnchor="middle" fontSize={11} fontFamily={FONT}>
							{l.text}
						</text>
					);
				})}
				<Label f={f} at={v(ROAD * SC + 0.1, -0.3)} dir={v(0, -1)} upright size={11}>
					m
				</Label>
				{/* where braking begins */}
				<path d={f.path([v(0, -0.05), v(0, LANE[0] + 0.55)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				{LANE.map((y, i) => (
					<g key={i}>
						{stopped[i] && t > 0 && (
							<>
								<path d={f.path([v(stops[i] * SC, y), v(stops[i] * SC, y + 0.55)])} stroke={INK.red} strokeWidth={THICK} fill="none" />
								<Label f={f} at={v(stops[i] * SC, y + 0.55)} dir={v(0, 1)} upright size={11} color={INK.red}>
									{`${num(stops[i], 1)} m`}
								</Label>
							</>
						)}
						<Car at={v(pos[i] * SC, y)} fill={fills[i]} />
						<Label f={f} at={v(-1.55, y + 0.2)} dir={v(1, 0)} size={13}>
							{names[i]}
						</Label>
					</g>
				))}
			</Drawing>

			<Readout>
				<span>
					<Tex>{`v = ${num(kmh, 0)}\\,\\text{km/h} = ${texNum(speeds[0], 1)}\\,\\text{m/s}`}</Tex>: <Tex>{`d = ${texNum(stops[0], 1)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`2v = ${num(2 * kmh, 0)}\\,\\text{km/h}`}</Tex>: <Tex>{`d = ${texNum(stops[1], 1)}\\,\\text{m}`}</Tex>
				</span>
				<Tex>{`\\mu_d = ${road === 'asciutto' ? '0{,}70' : '0{,}40'}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Strada" options={[{ value: 'asciutto', label: 'Asfalto asciutto' }, { value: 'bagnato', label: 'Asfalto bagnato' }]} value={road} onChange={(r) => { setRoad(r); reset(); }} />
				</div>
				<Slider label="Velocità v dell'auto in alto (km/h)" value={kmh} min={10} max={65} step={1} onChange={(x) => { setKmh(x); reset(); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={playing} onClick={play}>
						<Play className="size-4" aria-hidden="true" />
						Frena
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta le auto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
