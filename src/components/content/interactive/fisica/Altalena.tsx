'use client';

import { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, dot, Drawing, Figure, frame, Handle, Readout, rot, sub, Tex, TINT, useTween, v, type V } from '../kit';
import { Block, Ground, QTY, Vector } from '../fisica';
import { Asta, Fulcro, ROD } from './leve';

/**
 * Lesson 23 (L'equilibrio di un corpo rigido), "L'asta appoggiata su un fulcro": a seesaw, a board of negligible
 * weight resting on a fulcrum at its middle, with a child on each side. The student drags the children along the
 * board and sets their weights; under the drawing the two moments about the fulcrum (the left child's
 * counterclockwise, positive; the right child's clockwise, negative) and the total. No physics engine: the sign of
 * the total moment decides where the board goes, down on the side of the larger moment until its end touches the
 * ground, or level when the moments are equal, and a tween moves it there.
 *
 * Scale: 1,5 cm of the drawing per metre of board (2,0 m on each side), and 1 cm of arrow per 600 N. Positions go by
 * 0,1 m and weights by 50 N, so the total moment is computed exactly in integers (newton times decimetres).
 */

const HALF = 3; // cm, half the board: 2,0 m
const CM_PER_DM = 0.15;
const HEIGHT = 1; // the fulcrum, so the board tilts by asin(1/3)
const TILT = Math.asin(HEIGHT / HALF);
const K = 1 / 600; // cm per newton
const TIP = v(0, HEIGHT);
const f = frame(-3.7, 3.7, -1.25, 3.45);

/** The board at angle t: a point `s` cm from the fulcrum along it (negative on the left), at height `h` above its underside. */
const at = (t: number, s: number, h = 0) => add(TIP, rot(v(s, h), t));

type Kid = { dm: number; P: number };
const blockH = (P: number) => 0.3 + P / 900;

export default function Altalena({ alt }: { alt?: string }) {
	const [left, setLeft] = useState<Kid>({ dm: 15, P: 300 });
	const [right, setRight] = useState<Kid>({ dm: 10, P: 450 });
	const M1 = left.P * left.dm; // N·dm, counterclockwise
	const M2 = right.P * right.dm; // N·dm, clockwise
	const M = M1 - M2;
	const target = M === 0 ? 0 : M > 0 ? TILT : -TILT;
	const [t, go] = useTween(target, 900);
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		void go(target);
	}, [target, go]);

	const dir = v(Math.cos(t), Math.sin(t));
	const drag = (side: -1 | 1) => (p: V) => {
		const s = side * dot(sub(p, TIP), dir);
		const dm = clamp(Math.round(s / CM_PER_DM), 2, 20);
		(side < 0 ? setLeft : setRight)((k) => ({ ...k, dm }));
	};

	const kid = (k: Kid, side: -1 | 1, fill: string, sub_: string) => {
		const s = side * k.dm * CM_PER_DM;
		const h = blockH(k.P);
		const base = at(t, s, ROD);
		const centre = at(t, s, ROD + h / 2);
		return (
			<g key={sub_}>
				<Block f={f} at={base} w={0.5} h={h} angle={t} fill={fill} />
				<Vector f={f} from={centre} to={add(centre, v(0, -k.P * K))} color={QTY.forza} name="P" sub={sub_} labelDir={v(side, 0)} labelAt={0.85} />
			</g>
		);
	};

	const dmText = (dm: number) => (dm / 10).toFixed(1).replace('.', '{,}');
	const mText = (x: number) => (x / 10).toFixed(0);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-3.6, 0)} to={v(3.6, 0)} />
				<Fulcro f={f} at={TIP} ground={false} height={HEIGHT} />
				<Asta f={f} from={at(t, -HALF)} to={at(t, HALF)} />
				{kid(left, -1, TINT.blue, '1')}
				{kid(right, 1, TINT.orange, '2')}
				<Handle f={f} at={at(t, -left.dm * CM_PER_DM, ROD)} onMove={drag(-1)} step={CM_PER_DM} label="Bambino a sinistra, lungo l'asse" color={QTY.forza} />
				<Handle f={f} at={at(t, right.dm * CM_PER_DM, ROD)} onMove={drag(1)} step={CM_PER_DM} label="Bambino a destra, lungo l'asse" color={QTY.forza} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`M_1 = +${left.P} \\cdot ${dmText(left.dm)} = +${mText(M1)}\\,\\text{N} \\cdot \\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`M_2 = -${right.P} \\cdot ${dmText(right.dm)} = -${mText(M2)}\\,\\text{N} \\cdot \\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`M = ${M > 0 ? '+' : M < 0 ? '-' : ''}${mText(Math.abs(M))}\\,\\text{N} \\cdot \\text{m}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{M === 0
					? 'I due momenti sono uguali e opposti: il momento totale è zero e l’altalena resta orizzontale, in equilibrio. Sposta un bambino o cambia il suo peso.'
					: M > 0
						? 'Il momento del bambino a sinistra, antiorario, è più grande: il momento totale è positivo e l’altalena scende a sinistra.'
						: 'Il momento del bambino a destra, orario, è più grande: il momento totale è negativo e l’altalena scende a destra.'}
			</Caption>

			<Controls>
				<Slider label="Peso del bambino a sinistra" value={left.P} min={200} max={600} step={50} unit="N" onChange={(P) => setLeft((k) => ({ ...k, P: Math.round(P) }))} />
				<Slider label="Peso del bambino a destra" value={right.P} min={200} max={600} step={50} unit="N" onChange={(P) => setRight((k) => ({ ...k, P: Math.round(P) }))} />
				<Slider label="Distanza dal fulcro, a sinistra" value={left.dm / 10} min={0.2} max={2} step={0.1} unit="m" onChange={(x) => setLeft((k) => ({ ...k, dm: Math.round(x * 10) }))} />
				<Slider label="Distanza dal fulcro, a destra" value={right.dm / 10} min={0.2} max={2} step={0.1} unit="m" onChange={(x) => setRight((k) => ({ ...k, dm: Math.round(x * 10) }))} />
			</Controls>
		</Figure>
	);
}
