'use client';

import { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, THIN, DASH, TINT, THICK } from '../kit';
import { Arrow, Ball, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 56 (Il moto di un proiettile lanciato in orizzontale): a ball leaves the edge of a table 1,2 m high with a
 * horizontal speed v0 that the student sets (0,5 to 4,0 m/s). The closed laws of the lesson: x = v0 t,
 * y = h − g t²/2, so it flies for √(2h/g) = 0,49 s whatever v0 is and lands at v0 √(2h/g). The flight is played four
 * times slower than real. The path is traced as the ball flies, with a dot every 0,05 s; a hollow dot on the floor
 * follows x (uniform motion) and one on the vertical line on the right follows y (free fall). The velocity is drawn
 * at the ball with its two components, dashed. The last three paths stay, pale, with their range.
 *
 * Drawn at 2,5 cm per metre; velocities at 0,25 cm per m/s.
 */

const G = 9.8;
const H = 1.2;
const S = 2.5;
const TV = Math.sqrt((2 * H) / G);
const SLOW = 4;
const XL = 5.45; // the vertical line of the free-fall shadow, cm
const KV = 0.25;
const R0 = 0.12; // the ball's radius: its centre flies from h above the floor, which is drawn R0 lower
const Y0 = -R0;
const f = frame(-1.75, 6.05, -1.15, H * S + 0.85);

type Path = { v0: number };
const pos = (v0: number, t: number) => v(v0 * t * S, (H - 0.5 * G * t * t) * S);
const pathD = (v0: number, t1: number) => {
	const n = Math.max(2, Math.ceil(t1 / 0.01));
	return f.path(Array.from({ length: n + 1 }, (_, i) => pos(v0, (t1 * i) / n)));
};

export default function ProiettileTavolo({ alt }: { alt?: string }) {
	const [v0, setV0] = useState(2);
	const [t, setT] = useState(0);
	const [flying, setFlying] = useState(false);
	const [done, setDone] = useState<Path[]>([]);
	const reduced = useReducedMotion();

	const land = () => {
		setT(TV);
		setFlying(false);
		setDone((xs) => [...xs, { v0 }].slice(-3));
	};
	useFrameLoop(flying, (dt) => {
		const next = t + dt / SLOW;
		if (next >= TV) land();
		else setT(next);
	});
	const launch = () => {
		if (reduced) {
			land();
			return;
		}
		setT(0);
		setFlying(true);
	};
	const change = (x: number) => {
		setFlying(false);
		setT(0);
		setV0(x);
	};

	const p = pos(v0, t);
	const vy = -G * t;
	const landed = !flying && t >= TV - 1e-9;
	const range = v0 * TV;
	const dots = Array.from({ length: Math.floor(t / 0.05 + 1e-9) + 1 }, (_, i) => pos(v0, i * 0.05));

	let caption: string;
	if (t === 0) caption = `La pallina sta per lasciare il tavolo con una velocità orizzontale di ${num(v0, 1)} m/s. Premi Lancia: il volo è mostrato quattro volte più lento del vero.`;
	else if (flying) caption = "Sul pavimento l'ombra della pallina avanza a velocità costante; sulla linea di destra la sua altezza scende come in caduta libera, sempre più in fretta.";
	else caption = `La pallina tocca il pavimento dopo ${num(TV, 2)} s, a ${num(range, 2)} m dal tavolo. Cambia la velocità e rilancia: il tempo di volo non cambia, la gittata sì, in proporzione.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-1.7, Y0)} to={v(6, Y0)} />
				<path d={f.path([v(-1.5, Y0), v(0, Y0), v(0, H * S + Y0), v(-1.5, H * S + Y0)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(XL, Y0), v(XL, H * S + 0.3)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-1.5, H * S / 2)} dir={v(1, 0)} upright size={13}>
					1,2 m
				</Label>

				{done.map((d, i) => (
					<g key={i} opacity={0.35}>
						<path d={pathD(d.v0, TV)} stroke={QTY.velocita} strokeWidth={THIN} fill="none" />
						<circle cx={f.px(pos(d.v0, TV)).x} cy={f.px(pos(d.v0, TV)).y} r={2.5} fill={QTY.velocita} />
					</g>
				))}

				{t > 0 && (
					<>
						<path d={pathD(v0, t)} stroke={QTY.velocita} strokeWidth={THIN} fill="none" />
						{dots.map((q, i) => (
							<g key={i}>
								<circle cx={f.px(q).x} cy={f.px(q).y} r={2} fill={QTY.velocita} opacity={0.5} />
								<circle cx={f.px(v(q.x, Y0)).x} cy={f.px(v(q.x, Y0)).y} r={2} fill="none" stroke="#000" strokeWidth={0.5} opacity={0.5} />
								<circle cx={f.px(v(XL, q.y)).x} cy={f.px(v(XL, q.y)).y} r={2} fill="none" stroke="#000" strokeWidth={0.5} opacity={0.5} />
							</g>
						))}
						<path d={f.path([p, v(p.x, Y0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.5} fill="none" />
						<path d={f.path([p, v(XL, p.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.5} fill="none" />
					</>
				)}
				<circle cx={f.px(v(p.x, Y0)).x} cy={f.px(v(p.x, Y0)).y} r={4} fill="#fff" stroke="#000" strokeWidth={1} />
				<circle cx={f.px(v(XL, p.y)).x} cy={f.px(v(XL, p.y)).y} r={4} fill="#fff" stroke="#000" strokeWidth={1} />
				<Ball f={f} at={p} r={R0} />

				{!landed && (
					<>
						{t > 0 && <Arrow f={f} from={p} to={add(p, v(v0 * KV, 0))} color={QTY.velocita} dashed />}
						{t > 0 && -vy * KV > 0.06 && <Arrow f={f} from={p} to={add(p, v(0, vy * KV))} color={QTY.velocita} dashed />}
						<Vector f={f} from={p} to={add(p, v(v0 * KV, vy * KV))} color={QTY.velocita} name="v" sub={t === 0 ? '0' : undefined} labelDir={v(0.6, 0.8)} />
					</>
				)}
				{landed && (
					<>
						<path d={f.path([v(0, -0.5), v(range * S, -0.5)])} stroke="#000" strokeWidth={THIN} fill="none" />
						<path d={f.path([v(0, -0.4), v(0, -0.6)])} stroke="#000" strokeWidth={THIN} fill="none" />
						<path d={f.path([v(range * S, -0.4), v(range * S, -0.6)])} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={v((range * S) / 2, -0.5)} dir={v(0, -1)} size={13}>
							x<tspan fontSize={10} dy={3}>G</tspan>
						</Label>
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`x = v_0\\,t = ${texNum(v0 * t, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`y = h - \\tfrac{1}{2}g\\,t^2 = ${texNum(Math.max(0, H - 0.5 * G * t * t), 2)}\\,\\text{m}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`v_x = ${v0.toFixed(1).replace('.', '{,}')}\\,\\text{m/s}`}</Tex>
				<Tex>{`v_y = ${texNum(vy, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`t_v = \\sqrt{2h/g} = ${texNum(TV, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`x_G = v_0\\,t_v = ${texNum(range, 2)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Velocità v₀ (m/s)" value={v0} min={0.5} max={4} step={0.1} onChange={change} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={launch} disabled={flying}>
						<Play className="size-4" aria-hidden="true" />
						Lancia
					</Button>
					<Button variant="secondary" size="sm" disabled={done.length === 0} onClick={() => setDone([])}>
						<Trash2 className="size-4" aria-hidden="true" />
						Cancella le traiettorie
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
