'use client';

import { useState } from 'react';
import { RotateCcw, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, add, polar, clamp, texNum, num, THIN, DASH } from '../kit';
import { Ball, Components, Ground, Thread, Vector, QTY } from '../fisica';

/**
 * Lesson 20 (L'equilibrio di un punto materiale e le reazioni vincolari), section "Il paradosso del filo teso": a
 * body of 2,0 kg hangs at a knot held by two threads of the same length, 1,85 m, tied to two walls. The threads never
 * change length: the knot is where two circles around the points of attachment meet, so it goes down when the walls
 * come closer and up when they move apart. A slider sets the distance between the walls, from 1,6 m to 3,65 m (drawn
 * at 2 cm per metre), and the student drags the two points of attachment up and down the walls.
 *
 * The tensions come from the two equations of equilibrium, in closed form: T1 cos a1 = T2 cos a2,
 * T1 sin a1 + T2 sin a2 = P, so T1 = P cos a2 / sin(a1 + a2) and T2 = P cos a1 / sin(a1 + a2), with the angles each
 * thread makes with the horizontal. The arrows have one scale throughout; with the components shown, the horizontal
 * ones are equal and opposite and the vertical ones add up to the weight. With the walls far apart the threads are
 * almost straight and the tensions grow to several times the weight: the points of attachment are kept close enough
 * in height that the threads stay at least about 7° from a straight line.
 */

const M = 2;
const P = M * 9.8; // 19,6 N
const W0 = 3.2; // half the distance between the walls at the start, cm: 3,2 m at 2 cm per metre
const W_MIN = 1.6, W_MAX = 3.65;
const L = W0 / Math.cos(Math.PI / 6); // each thread, cm: 30° at the start, 1,85 m
const SPAN = 2 * L * Math.cos((7 * Math.PI) / 180); // the points of attachment are never farther apart than this
const Y_MIN = 3, Y_MAX = 4.2; // where the threads can be tied on the walls
const Y0 = 3.9;
const K = 0.04; // arrow cm per newton: the largest tension (about 80 N) is a little shorter than its thread
const f = frame(-W_MAX - 0.4, W_MAX + 0.4, -1.5, Y_MAX + 0.35);
const DEG = 180 / Math.PI;

/** How far apart in height the two points of attachment can be with the walls at ±w. */
const reach = (w: number) => Math.sqrt(Math.max(0, SPAN * SPAN - 4 * w * w));

export default function CorpoDueFili({ alt }: { alt?: string }) {
	const [yA, setYA] = useState(Y0);
	const [yB, setYB] = useState(Y0);
	const [comp, setComp] = useState<'no' | 'si'>('no');
	const [wall, setWall] = useState(W0);

	const A = v(-wall, yA), B = v(wall, yB);
	// The knot: the lower of the two points at distance L from both A and B.
	const half = Math.hypot(2 * wall, yB - yA) / 2;
	const drop = Math.sqrt(Math.max(0, L * L - half * half));
	const O = v((yB - yA) * (drop / (2 * half)), (yA + yB) / 2 - wall * (drop / half));
	const a1 = Math.atan2(A.y - O.y, O.x - A.x), a2 = Math.atan2(B.y - O.y, B.x - O.x);
	const s = Math.sin(a1 + a2);
	const T1 = (P * Math.cos(a2)) / s, T2 = (P * Math.cos(a1)) / s;
	const u1 = polar(1, Math.PI - a1), u2 = polar(1, a2);
	const tip1 = add(O, v(u1.x * T1 * K, u1.y * T1 * K));
	const tip2 = add(O, v(u2.x * T2 * K, u2.y * T2 * K));
	const d1 = a1 * DEG, d2 = a2 * DEG;
	const symmetric = Math.abs(yA - yB) < 0.03;
	const flat = d1 < 12 && d2 < 12;
	const start = yA === Y0 && yB === Y0 && wall === W0;

	/** A point of attachment follows the pointer as far as the other thread lets it. */
	const tie = (y: number, other: number) => clamp(clamp(y, Y_MIN, Y_MAX), other - reach(wall), other + reach(wall));
	/** Moving the walls apart pulls the higher point down towards the other, if the threads would not reach. */
	const move = (w: number) => {
		setWall(w);
		if (Math.abs(yA - yB) > reach(w)) setYA(yB + Math.sign(yA - yB) * reach(w));
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-wall, Y_MAX + 0.25)} to={v(-wall, -1.3)} />
				<Ground f={f} from={v(wall, -1.3)} to={v(wall, Y_MAX + 0.25)} />
				<path d={f.path([add(O, v(-0.65, 0)), add(O, v(0.65, 0))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
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
				<Vector f={f} from={O} to={tip1} color={QTY.forza} name="T" sub="1" labelDir={v(-1, 0.2)} />
				<Vector f={f} from={O} to={tip2} color={QTY.forza} name="T" sub="2" labelDir={v(1, 0.2)} />
				<Vector f={f} from={O} to={add(O, v(0, -P * K))} color={QTY.forza} name="P" labelDir={v(1, 0)} />
				<Handle f={f} at={A} onMove={(p) => setYA(tie(p.y, yB))} label="Attacco del filo di sinistra" step={0.05} />
				<Handle f={f} at={B} onMove={(p) => setYB(tie(p.y, yA))} label="Attacco del filo di destra" step={0.05} />
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
					? `I fili sono quasi tesi: per reggere il peso di ${num(P, 1)} N ognuno tira con ${num(Math.min(T1, T2) / P, 1)} volte il peso o più. Un filo orizzontale non potrebbe reggerlo.`
					: symmetric
						? <>I due fili hanno lo stesso angolo e la stessa tensione, <Tex>{`T = \\dfrac{P}{2\\sin\\alpha} = ${texNum(T1, 1)}\\,\\text{N}`}</Tex>.</>
						: `Il filo più vicino alla verticale, il ${d1 > d2 ? 'primo' : 'secondo'}, tira di più: ${num(Math.max(T1, T2), 1)} N contro ${num(Math.min(T1, T2), 1)} N.`}
				{comp === 'si' && ' Le componenti orizzontali sono uguali e opposte; quelle verticali, insieme, sono uguali al peso.'}
			</Caption>

			<Controls>
				<Slider label="Distanza tra le pareti" unit="m" value={wall} min={W_MIN} max={W_MAX} step={0.05} onChange={(d) => move(Math.round(d * 20) / 20)} />
				<div className="flex justify-center">
					<ToggleGroup label="Componenti" options={[{ value: 'no', label: 'Solo le forze' }, { value: 'si', label: 'Con le componenti' }]} value={comp} onChange={setComp} />
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => { setYA(Y0); setYB(Y0); setWall(W_MAX); }}>
						<MoveHorizontal className="size-4" aria-hidden="true" />
						Tendi i fili
					</Button>
					<Button variant="secondary" size="sm" disabled={start} onClick={() => { setYA(Y0); setYB(Y0); setWall(W0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
