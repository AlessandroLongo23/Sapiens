'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, Label, frame, v, add, sub, scale, unit, len, dot, clamp, texNum, num, THIN, DASH, type V } from '../kit';
import { Vector, Point, QTY } from '../fisica';

/**
 * Lesson 45 (Spostamento e velocità nel piano): the average velocity turns into the instantaneous one. A point moves
 * along a curved path, x = 0,3 + 1,0·t and y = 0,25·t² (metres, one centimetre of drawing per metre and per m/s), so
 * its velocity is (1,0; 0,5·t). The student sets the instant of P and the interval Δt with sliders, or drags Q along
 * the path. From P: the displacement to Q (the chord, blue), the average velocity Δs/Δt (dark blue, along the chord)
 * and the instantaneous velocity at P (orange, on the dashed tangent). As Δt shrinks the chord turns towards the
 * tangent and the average velocity becomes the instantaneous one; the readout gives the angle between them.
 */

const T_END = 4;
const DT_MIN = 0.05;
const pos = (t: number) => v(0.3 + t, 0.25 * t * t);
const vel = (t: number) => v(1, 0.5 * t);
const f = frame(-0.5, 5.0, -0.7, 4.5);
const GRAY = '#999999'; // gray!60
const PATH = Array.from({ length: 81 }, (_, i) => pos((i / 80) * T_END));

export default function VelocitaMediaTangente({ alt }: { alt?: string }) {
	const [t1, setT1] = useState(1);
	const [dt, setDt] = useState(2);

	const P = pos(t1), Q = pos(t1 + dt);
	const ds = sub(Q, P);
	const vm = scale(ds, 1 / dt);
	const vi = vel(t1);
	const angle = (Math.acos(clamp(dot(unit(vm), unit(vi)), -1, 1)) * 180) / Math.PI;
	const tg = unit(vi);
	const left = v(-tg.y, tg.x);

	const moveT1 = (x: number) => {
		setT1(x);
		setDt((d) => clamp(d, DT_MIN, T_END - x));
	};
	/** Q follows the pointer along the path, never before P. */
	const dragQ = (p: V) => {
		let best = t1 + DT_MIN, bestD = Infinity;
		for (let i = 0; i <= 400; i++) {
			const t = t1 + DT_MIN + ((T_END - t1 - DT_MIN) * i) / 400;
			const d = len(sub(pos(t), p));
			if (d < bestD) {
				bestD = d;
				best = t;
			}
		}
		setDt(Math.round((best - t1) * 100) / 100);
	};

	const caption =
		angle < 2
			? `Con Δt = ${num(dt)} s la corda è quasi tangente: la velocità media e la velocità istantanea in P differiscono di meno di 2°.`
			: `Con Δt = ${num(dt)} s la velocità media va lungo la corda PQ, a ${num(angle, 0)}° dalla tangente: avvicina Q a P e guarda come si allinea.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path(PATH)} stroke={GRAY} strokeWidth={1.2} fill="none" />
				<path d={f.path([add(P, scale(tg, -1.2)), add(P, scale(tg, 4.5))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Vector f={f} from={P} to={Q} color={QTY.vettore} weight="thin" />
				<Vector f={f} from={P} to={add(P, vi)} color={QTY.risultante} name="v" labelDir={scale(left, -1)} />
				<Vector f={f} from={P} to={add(P, vm)} color={QTY.velocita} name="v" sub="m" labelDir={left} />
				<Point f={f} at={P} />
				<Label f={f} at={P} dir={v(-0.7, 0.7)}>P</Label>
				<Handle f={f} at={Q} onMove={dragQ} label="Il punto Q" color={QTY.vettore} />
				<Label f={f} at={Q} dir={v(1, -0.3)}>Q</Label>
			</Drawing>

			<Readout>
				<Tex>{`\\Delta t = ${texNum(dt)}\\,\\text{s}`}</Tex>
				<Tex>{`\\Delta s = ${texNum(len(ds))}\\,\\text{m}`}</Tex>
				<Tex>{`v_m = ${texNum(len(vm))}\\,\\text{m/s}`}</Tex>
				<Tex>{`v = ${texNum(len(vi))}\\,\\text{m/s}`}</Tex>
				<Tex>{`\\text{angolo tra } \\vec v_m \\text{ e } \\vec v = ${texNum(angle, 1)}^\\circ`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Istante di P (s)" value={t1} min={0} max={3} step={0.1} onChange={moveT1} />
				<Slider label="Intervallo Δt (s)" value={dt} min={DT_MIN} max={Math.round((T_END - t1) * 100) / 100} step={0.05} onChange={(x) => setDt(clamp(x, DT_MIN, T_END - t1))} />
			</Controls>
		</Figure>
	);
}
