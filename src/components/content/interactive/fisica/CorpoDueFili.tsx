'use client';

import { useState } from 'react';
import { RotateCcw, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, add, polar, clamp, texNum, num, THIN, DASH } from '../kit';
import { Ball, Components, Ground, Thread, Vector, QTY } from '../fisica';

/**
 * Lesson 20 (L'equilibrio di un punto materiale e le reazioni vincolari), section "Il paradosso del filo teso": a
 * body of 2,0 kg hangs at a knot held by two threads, tied to two walls. The student drags the two points where the
 * threads are tied up and down the walls; the knot stays where it is (the threads get longer or shorter), so each
 * thread's angle with the horizontal changes from about 7° to about 43°. The tensions come from the two equations of
 * equilibrium, in closed form: T1 cos a1 = T2 cos a2, T1 sin a1 + T2 sin a2 = P, so T1 = P cos a2 / sin(a1 + a2) and
 * T2 = P cos a1 / sin(a1 + a2). The arrows are to scale; with the components shown, the horizontal ones are equal and
 * opposite and the vertical ones add up to the weight. Near the horizontal the tensions grow to four times the weight.
 */

const M = 2;
const P = M * 9.8; // 19,6 N
const WALL = 3.2; // the walls are at x = ±WALL, the knot at the origin
const Y_MIN = 0.4, Y_MAX = 3; // where the threads can be tied on the walls: angles from 7,1° to 43,2°
const Y0 = WALL * Math.tan(Math.PI / 6); // 30°
const K = 0.034; // arrow cm per newton: the largest tension (about 79 N) stays well inside the thread
const f = frame(-WALL - 0.4, WALL + 0.4, -1.25, Y_MAX + 0.35);
const O = v(0, 0);
const DEG = 180 / Math.PI;

export default function CorpoDueFili({ alt }: { alt?: string }) {
	const [yA, setYA] = useState(Y0);
	const [yB, setYB] = useState(Y0);
	const [comp, setComp] = useState<'no' | 'si'>('no');

	const a1 = Math.atan2(yA, WALL), a2 = Math.atan2(yB, WALL);
	const s = Math.sin(a1 + a2);
	const T1 = (P * Math.cos(a2)) / s, T2 = (P * Math.cos(a1)) / s;
	const A = v(-WALL, yA), B = v(WALL, yB);
	const u1 = polar(1, Math.PI - a1), u2 = polar(1, a2);
	const tip1 = add(O, v(u1.x * T1 * K, u1.y * T1 * K));
	const tip2 = add(O, v(u2.x * T2 * K, u2.y * T2 * K));
	const d1 = a1 * DEG, d2 = a2 * DEG;
	const symmetric = Math.abs(yA - yB) < 0.03;
	const flat = d1 < 12 && d2 < 12;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-WALL, Y_MAX + 0.25)} to={v(-WALL, -1.05)} />
				<Ground f={f} from={v(WALL, -1.05)} to={v(WALL, Y_MAX + 0.25)} />
				<path d={f.path([v(-0.65, 0), v(0.65, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.arc(O, u1, v(-1, 0), 0.45)} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={f.arc(O, v(1, 0), u2, 0.45)} stroke="#000" strokeWidth={THIN} fill="none" />
				<Thread f={f} from={A} to={O} />
				<Thread f={f} from={B} to={O} />
				{comp === 'si' && (
					<>
						<Components f={f} o={O} p={tip1} color={QTY.forza} />
						<Components f={f} o={O} p={tip2} color={QTY.forza} />
					</>
				)}
				<Ball f={f} at={O} r={0.14} />
				<Vector f={f} from={O} to={tip1} color={QTY.forza} name="T" sub="1" labelAt={0.75} labelDir={v(-Math.sin(a1), -Math.cos(a1))} />
				<Vector f={f} from={O} to={tip2} color={QTY.forza} name="T" sub="2" labelAt={0.75} labelDir={v(Math.sin(a2), -Math.cos(a2))} />
				<Vector f={f} from={O} to={v(0, -P * K)} color={QTY.forza} name="P" labelDir={v(1, 0)} />
				<Handle f={f} at={A} onMove={(p) => setYA(clamp(p.y, Y_MIN, Y_MAX))} label="Attacco del filo di sinistra" step={0.05} />
				<Handle f={f} at={B} onMove={(p) => setYB(clamp(p.y, Y_MIN, Y_MAX))} label="Attacco del filo di destra" step={0.05} />
			</Drawing>

			<Readout>
				<Tex>{`\\alpha_1 = ${texNum(d1, 0)}^\\circ`}</Tex>
				<Tex>{`\\alpha_2 = ${texNum(d2, 0)}^\\circ`}</Tex>
				<Tex>{`T_1 = ${texNum(T1, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`T_2 = ${texNum(T2, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`P = ${texNum(P, 1)}\\,\\text{N}`}</Tex>
			</Readout>
			<Caption>
				{flat
					? `I fili sono quasi orizzontali: per reggere il peso di ${num(P, 1)} N ognuno tira con ${num(Math.min(T1, T2) / P, 1)} volte il peso o più. Un filo orizzontale non potrebbe reggerlo.`
					: symmetric
						? <>I due fili hanno lo stesso angolo e la stessa tensione, <Tex>{`T = \\dfrac{P}{2\\sin\\alpha} = ${texNum(T1, 1)}\\,\\text{N}`}</Tex>.</>
						: `Il filo più vicino alla verticale, il ${d1 > d2 ? 'primo' : 'secondo'}, tira di più: ${num(Math.max(T1, T2), 1)} N contro ${num(Math.min(T1, T2), 1)} N.`}
				{comp === 'si' && ' Le componenti orizzontali sono uguali e opposte; quelle verticali, insieme, sono uguali al peso.'}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Componenti" options={[{ value: 'no', label: 'Solo le forze' }, { value: 'si', label: 'Con le componenti' }]} value={comp} onChange={setComp} />
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => { setYA(Y_MIN); setYB(Y_MIN); }}>
						<MoveHorizontal className="size-4" aria-hidden="true" />
						Tendi i fili
					</Button>
					<Button variant="secondary" size="sm" disabled={yA === Y0 && yB === Y0} onClick={() => { setYA(Y0); setYB(Y0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
