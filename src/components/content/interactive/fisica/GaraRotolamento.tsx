'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, texNum, num, useFrameLoop, useReducedMotion, TINT, THICK, THIN, DASH, FONT_SIZE } from '../kit';
import { Ball, Block } from '../fisica';

/**
 * Lesson 89 (L'energia cinetica di rotazione e il rotolamento), "La gara tra anello, cilindro e sfera": four lanes of
 * the same incline, 2,0 m long, seen from the side one above the other and drawn at 3 cm per metre. On them a block
 * that slides without friction and a solid sphere, a solid cylinder and a ring that roll without slipping, all
 * released together from rest. The student picks the angle β (10° to 40°).
 *
 * Every motion has its formula: the centre of mass goes down with a = g sin β / (1 + c), with c = 0 for the block,
 * 2/5 for the sphere, 1/2 for the cylinder and 1 for the ring, so s = a t² / 2 up to the end of the lane. The spoke
 * drawn on the rolling bodies turns by s / r, as rolling without slipping asks. The race runs at half speed, and the
 * caption says so; with reduced motion the button moves it two tenths of a second at a time.
 */

const G = 9.8;
const LEN = 2; // metres
const S = 3; // cm per metre
const R = 0.25; // radius of the bodies, cm
const GAP = 0.85; // between the lanes, cm
const X0 = 0;
const DEG = Math.PI / 180;
const SLOW = 0.5;
const BODIES = [
	{ name: 'blocco', c: 0 },
	{ name: 'sfera', c: 2 / 5 },
	{ name: 'cilindro', c: 1 / 2 },
	{ name: 'anello', c: 1 }
] as const;
const f = frame(-1.75, LEN * S + 0.45, -0.3, 3 * GAP + LEN * S * Math.sin(40 * DEG) + 0.75);

export default function GaraRotolamento({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(30);
	const [running, setRunning] = useState(false);
	const [t, setT] = useState(0);
	const reduced = useReducedMotion();

	const beta = deg * DEG;
	const acc = BODIES.map((b) => (G * Math.sin(beta)) / (1 + b.c));
	const arrival = acc.map((a) => Math.sqrt((2 * LEN) / a));
	const tEnd = arrival[3];

	const done = t >= tEnd - 1e-9;
	const run = (seconds: number) => setT((now) => Math.min(tEnd, now + seconds * SLOW));
	useFrameLoop(running && !done, run);

	const reset = (d = deg) => {
		setRunning(false);
		setDeg(d);
		setT(0);
	};
	const play = () => {
		if (reduced) return run(0.2 / SLOW);
		setRunning((r) => !r);
	};

	const down = polar(1, -beta); // along the lane, downhill
	const normal = v(Math.sin(beta), Math.cos(beta));
	const lanes = BODIES.map((b, i) => {
		const end = v(X0 + LEN * S * Math.cos(beta), (3 - i) * GAP);
		const start = v(X0, end.y + LEN * S * Math.sin(beta));
		const s = Math.min(LEN, 0.5 * acc[i] * t * t);
		const at = add(start, scale(down, s * S));
		return { ...b, start, end, s, at, centre: add(at, scale(normal, R)), turn: (s * S) / R };
	});
	const foot = lanes[3].end;
	const xEnd = foot.x;

	let caption: string;
	if (t === 0) caption = `Il piano è lungo 2 m ed è inclinato di ${deg}°. I quattro corpi partono da fermi dalla stessa linea: chi arriva prima in fondo?`;
	else if (!done) caption = 'La gara è al rallentatore, a metà velocità. Il blocco scivola senza attrito; gli altri tre rotolano, e una parte della loro energia serve a farli girare.';
	else caption = `Arrivano nell'ordine blocco, sfera, cilindro, anello, a qualunque inclinazione. L'anello impiega ${num(arrival[3] / arrival[0], 2)} volte il tempo del blocco.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(X0, lanes[3].start.y - 0.1), v(X0, lanes[0].start.y + 0.75)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(xEnd, foot.y - 0.1), v(xEnd, lanes[0].end.y + 0.75)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([foot, v(foot.x - 1.6, foot.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.arc(foot, polar(1, Math.PI - beta), v(-1, 0), 1.1)} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={add(foot, polar(1.35, Math.PI - beta / 2))} dir={v(-0.2, 0)}>
					β
				</Label>
				{lanes.map((l) => (
					<g key={l.name}>
						<path d={f.path([l.start, l.end])} stroke="#000" strokeWidth={THICK} fill="none" />
						<Label f={f} at={v(X0 - 0.1, l.start.y + R)} dir={v(-1, 0)} upright size={FONT_SIZE * 0.85}>
							{l.name}
						</Label>
						{l.name === 'blocco' ? (
							<Block f={f} at={l.at} w={0.6} h={0.4} angle={-beta} />
						) : (
							<>
								<Ball f={f} at={l.centre} r={R} fill={l.name === 'sfera' ? TINT.orange : l.name === 'cilindro' ? TINT.blue : 'none'} />
								{l.name === 'anello' && <Ball f={f} at={l.centre} r={R * 0.7} fill="none" />}
								<path
									d={f.path([l.name === 'anello' ? add(l.centre, polar(R * 0.7, Math.PI / 2 - beta - l.turn)) : l.centre, add(l.centre, polar(R, Math.PI / 2 - beta - l.turn))])}
									stroke="#000"
									strokeWidth={THICK}
									fill="none"
								/>
							</>
						)}
					</g>
				))}
			</Drawing>

			<Readout>
				{BODIES.map((b, i) => (
					<Tex key={b.name}>{`\\text{${b.name}: } a = ${texNum(acc[i], 2)}\\,\\text{m/s}^2,\\ t = ${texNum(arrival[i], 2)}\\,\\text{s}`}</Tex>
				))}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Inclinazione β" unit="°" value={deg} min={10} max={40} step={1} onChange={(x) => reset(Math.round(x))} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={done} onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running && !done ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di due decimi di secondo' : running && !done ? 'Ferma' : 'Via'}
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
