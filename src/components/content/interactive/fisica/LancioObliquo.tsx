'use client';

import { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, THIN, DASH, FONT } from '../kit';
import { Arrow, Ball, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 76 (Il lancio obliquo e la gittata), "L'angolo di 45 gradi": a ball is launched from the ground with a speed
 * v0 (7 to 14 m/s) at an angle α (15° to 75°, every 5°) that the student sets. The closed laws of the lesson:
 * x = v0 cos α t, y = v0 sin α t − g t²/2, so the flight lasts 2 v0 sin α / g, rises to (v0 sin α)² / 2g and lands at
 * v0² sin 2α / g. Played in real time. The path is traced as the ball flies; the last four paths stay, pale, each
 * with its angle, so 30° and 60° are seen to land on the same point and 45° the farthest.
 *
 * Drawn at 0,3 cm per metre (ticks every 5 m); velocities at 0,09 cm per m/s.
 */

const G = 9.8;
const S = 0.3;
const KV = 0.09;
const R0 = 0.1;
const X_MAX = 20; // m, the range at 45° with 14 m/s
const DEG = Math.PI / 180;
const f = frame(-0.55, X_MAX * S + 0.75, -0.8, 3.25);

type Shot = { a: number; v0: number };
const comp = (s: Shot) => ({ vx: s.v0 * Math.cos(s.a * DEG), vy: s.v0 * Math.sin(s.a * DEG) });
const flight = (s: Shot) => (2 * comp(s).vy) / G;
const pos = (s: Shot, t: number) => {
	const { vx, vy } = comp(s);
	return v(vx * t * S, Math.max(0, vy * t - 0.5 * G * t * t) * S);
};
const pathD = (s: Shot, t1: number) => {
	const n = Math.max(2, Math.ceil(t1 / 0.02));
	return f.path(Array.from({ length: n + 1 }, (_, i) => pos(s, (t1 * i) / n)));
};

export default function LancioObliquo({ alt }: { alt?: string }) {
	const [a, setA] = useState(30);
	const [v0, setV0] = useState(12);
	const [t, setT] = useState(0);
	const [flying, setFlying] = useState(false);
	const [done, setDone] = useState<Shot[]>([]);
	const reduced = useReducedMotion();

	const shot = { a, v0 };
	const { vx, vy } = comp(shot);
	const tv = flight(shot);
	const hMax = (vy * vy) / (2 * G);
	const range = vx * tv;

	const land = () => {
		setT(tv);
		setFlying(false);
		setDone((xs) => [...xs.filter((s) => s.a !== a || s.v0 !== v0), { a, v0 }].slice(-4));
	};
	useFrameLoop(flying, (dt) => {
		const next = t + dt;
		if (next >= tv) land();
		else setT(next);
	});
	const launch = () => {
		if (reduced) return land();
		setT(0);
		setFlying(true);
	};
	const change = (set: (x: number) => void) => (x: number) => {
		setFlying(false);
		setT(0);
		set(x);
	};

	const p = pos(shot, t);
	const landed = !flying && t >= tv - 1e-9 && t > 0;
	const vyNow = vy - G * t;
	const twin = done.find((s) => s.v0 === v0 && s.a === 90 - a && a !== 45);

	let caption: string;
	if (t === 0) caption = `La palla sta per partire a ${num(v0, 1)} m/s con un angolo di ${a}°. Premi Lancia, poi cambia l’angolo e rilancia: le traiettorie restano disegnate.`;
	else if (flying) caption = 'La componente orizzontale della velocità non cambia; quella verticale diminuisce, si annulla nel punto più alto e poi cresce verso il basso.';
	else if (twin) caption = `Con ${a}° la palla ricade a ${num(range, 1)} m, nello stesso punto del lancio a ${twin.a}°: i due angoli sono complementari. Cambiano l’altezza massima e il tempo di volo.`;
	else if (a === 45) caption = `A 45° la palla ricade a ${num(range, 1)} m: è la gittata massima per questa velocità. Prova un angolo più piccolo e uno più grande.`;
	else caption = `Con ${a}° la palla sale fino a ${num(hMax, 1)} m e ricade a ${num(range, 1)} m dopo ${num(tv, 2)} s. Prova l’angolo complementare, ${90 - a}°, con la stessa velocità.`;

	const ticks: string[] = [];
	for (let m = 0; m <= X_MAX; m += 5) ticks.push(f.path([v(m * S, -R0), v(m * S, -R0 - 0.12)]));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-0.5, -R0)} to={v(X_MAX * S + 0.6, -R0)} />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={1} fill="none" />
				{[5, 10, 15, 20].map((m) => {
					const q = f.px(v(m * S, -R0 - 0.42));
					return (
						<text key={m} x={q.x} y={q.y} textAnchor="middle" fontSize={11} fontFamily={FONT}>
							{m} m
						</text>
					);
				})}

				{done
					.filter((s) => !(landed && s.a === a && s.v0 === v0))
					.map((s) => {
						const top = pos(s, flight(s) / 2);
						const end = pos(s, flight(s));
						return (
							<g key={`${s.a}-${s.v0}`} opacity={0.4}>
								<path d={pathD(s, flight(s))} stroke={QTY.velocita} strokeWidth={THIN} fill="none" />
								<circle cx={f.px(end).x} cy={f.px(end).y} r={2.5} fill={QTY.velocita} />
								<Label f={f} at={top} dir={v(0, 1)} upright size={11}>
									{s.a}°
								</Label>
							</g>
						);
					})}

				{t > 0 && <path d={pathD(shot, t)} stroke={QTY.velocita} strokeWidth={1} fill="none" />}
				{landed && (
					<>
						<path d={f.path([v((range * S) / 2, 0), v((range * S) / 2, hMax * S)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} fill="none" />
						<Label f={f} at={v((range * S) / 2, hMax * S)} dir={v(0, 1)} upright size={11}>
							{num(hMax, 1)} m
						</Label>
						<circle cx={f.px(v(range * S, 0)).x} cy={f.px(v(range * S, 0)).y} r={2.5} fill={QTY.velocita} />
					</>
				)}
				{!landed && (
					<>
						{Math.abs(vx * KV) > 0.08 && <Arrow f={f} from={p} to={add(p, v(vx * KV, 0))} color={QTY.velocita} dashed />}
						{Math.abs(vyNow * KV) > 0.08 && <Arrow f={f} from={p} to={add(p, v(0, vyNow * KV))} color={QTY.velocita} dashed />}
						<Vector f={f} from={p} to={add(p, v(vx * KV, vyNow * KV))} color={QTY.velocita} name="v" sub={t === 0 ? '0' : undefined} labelDir={v(0.7, vyNow >= 0 ? 0.7 : -0.7)} />
					</>
				)}
				{t === 0 && a >= 25 && (
					<>
						<path d={f.arc(v(0, 0), v(1, 0), v(vx, vy), 0.45)} stroke="#000" strokeWidth={THIN} fill="none" />
					</>
				)}
				<Ball f={f} at={p} r={R0} />
			</Drawing>

			<Readout>
				<Tex>{`v_{0x} = v_0\\cos\\alpha = ${texNum(vx, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`v_{0y} = v_0\\sin\\alpha = ${texNum(vy, 2)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`t_v = ${texNum(tv, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`h_{max} = ${texNum(hMax, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`L = ${texNum(range, 2)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Angolo α (°)" value={a} min={15} max={75} step={5} onChange={change(setA)} />
				<Slider label="Velocità v₀ (m/s)" value={v0} min={7} max={14} step={0.5} onChange={change(setV0)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={launch} disabled={flying}>
						<Play className="size-4" aria-hidden="true" />
						Lancia
					</Button>
					<Button variant="secondary" size="sm" disabled={done.length === 0} onClick={() => { setDone([]); setT(0); setFlying(false); }}>
						<Trash2 className="size-4" aria-hidden="true" />
						Cancella le traiettorie
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
