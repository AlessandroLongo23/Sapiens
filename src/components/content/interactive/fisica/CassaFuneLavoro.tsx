'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, texNum, num, useFrameLoop, useReducedMotion, THIN, DASH, TINT } from '../kit';
import { Block, Ground, Thread, Vector, Arrow, QTY } from '../fisica';

/**
 * Lesson 59 (Il lavoro di una forza): a crate on the floor pulled by a rope. The student sets the angle α between the
 * rope and the floor (0° to 180°) and the force F (0 to 100 N). From the crate's centre: the force, its dashed
 * components, the one along the displacement (F cos α, "the useful one") in orange, as in the TikZ figure
 * `cassa-fune-componenti-lavoro`. The crate moves 4,0 m to the right whatever the rope does (past 90° something else
 * pushes it: the figure is about the rope's work, not about why the crate moves). The readout gives F_x and the work
 * W = F s cos α, positive, zero or negative; a button slides the crate along its 4 m and the work grows with the
 * distance covered, F_x · d. Drawing: 1 cm per metre, forces at 0,03 cm per newton.
 */

const S = 4; // m, and cm of drawing
const KF = 0.03; // cm per newton
const BW = 1, BH = 0.7;
const ROPE = 3.4; // cm from the centre to the hand
const PACE = 1.6; // m/s of the sliding crate
const f = frame(-3.7, 7.75, -1.05, 3.95);

export default function CassaFuneLavoro({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(30);
	const [F, setF] = useState(50);
	const [d, setD] = useState(0); // metres covered
	const [moving, setMoving] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(moving, (dt) => {
		const next = Math.min(S, d + PACE * dt);
		setD(next);
		if (next >= S) setMoving(false);
	});
	const play = () => {
		if (reduced) return setD(S);
		if (d >= S) setD(0);
		setMoving(true);
	};
	const reset = () => {
		setMoving(false);
		setD(0);
	};

	const a = (deg * Math.PI) / 180;
	const u = polar(1, a);
	const Fx = Math.abs(Math.cos(a)) < 1e-9 ? 0 : F * Math.cos(a);
	const Fy = F * Math.sin(a);
	const W = Fx * S;
	const done = Fx * d;

	const c = v(d, BH / 2);
	const tip = add(c, scale(u, F * KF));
	const tipX = v(c.x + Fx * KF, c.y), tipY = v(c.x, c.y + Fy * KF);
	// Where the rope leaves the crate: the ray from the centre along u meets the rectangle's side.
	const exit = Math.min(Math.abs(u.x) > 1e-9 ? BW / 2 / Math.abs(u.x) : Infinity, Math.abs(u.y) > 1e-9 ? BH / 2 / Math.abs(u.y) : Infinity);
	const hand = add(c, scale(u, ROPE));
	const showX = Math.abs(Fx * KF) > 0.12, showY = Fy * KF > 0.12;
	const arcR = 0.45;

	const sign = Math.abs(Fx) < 1e-9 || F === 0 ? 'zero' : Fx > 0 ? 'positivo' : 'negativo';
	let caption: string;
	if (F === 0) caption = 'Senza forza non c’è lavoro: scegli un modulo per la forza della fune.';
	else if (sign === 'zero') caption = 'A 90° la fune tira in verticale, perpendicolare allo spostamento: la componente utile è zero, e la forza non compie lavoro.';
	else if (sign === 'positivo') caption = `L’angolo è acuto: la componente utile, ${num(Fx, 1)} N, va nel verso dello spostamento, e il lavoro è positivo, un lavoro motore.`;
	else caption = `L’angolo è ottuso: la componente utile punta all’indietro, ${num(Fx, 1)} N, e il lavoro è negativo, un lavoro resistente. La cassa si sposta lo stesso, spinta da qualcos’altro.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-3.6, 0)} to={v(7.65, 0)} />
				{/* where the crate arrives */}
				<path d={f.path([v(S - BW / 2, 0), v(S - BW / 2, BH), v(S + BW / 2, BH), v(S + BW / 2, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.5} />
				<Thread f={f} from={add(c, scale(u, exit))} to={hand} />
				<circle cx={f.px(hand).x} cy={f.px(hand).y} r={2.2} fill="#000" />
				<Block f={f} at={v(d, 0)} w={BW} h={BH} fill={TINT.blue} />
				{F > 0 && (
					<>
						{showX && showY && (
							<>
								<path d={f.path([tip, tipX])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} fill="none" />
								<path d={f.path([tip, tipY])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} fill="none" />
							</>
						)}
						{deg > 0 && deg < 180 && <path d={f.arc(c, v(1, 0), u, arcR)} stroke="#000" strokeWidth={THIN} fill="none" />}
						{deg >= 12 && deg <= 168 && (
							<Label f={f} at={add(c, polar(arcR + 0.22, a / 2))} size={13}>
								α
							</Label>
						)}
						{showY && <Vector f={f} from={c} to={tipY} color={QTY.forza} dashed name="F" sub="y" labelDir={v(Fx >= 0 ? -1 : 1, 0)} />}
						{showX && <Vector f={f} from={c} to={tipX} color={QTY.risultante} dashed name="F" sub="x" labelDir={v(Fx > 0 ? 1 : -1, 0)} />}
						<Vector f={f} from={c} to={tip} color={QTY.forza} name="F" labelDir={u} />
					</>
				)}
				<Arrow f={f} from={v(0, -0.6)} to={v(S, -0.6)} color={QTY.vettore} />
				<Label f={f} at={v(S, -0.6)} dir={v(1, 0)}>
					s
				</Label>
				<Label f={f} at={v(S / 2, -0.6)} dir={v(0, -1)} upright size={12}>
					4,0 m
				</Label>
			</Drawing>

			<Readout>
				<Tex>{`\\alpha = ${deg}^\\circ`}</Tex>
				<Tex>{`F_x = F\\cos\\alpha = ${texNum(Fx, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`W = F\\,s\\cos\\alpha = ${texNum(W, 0)}\\,\\text{J}`}</Tex>
				<span>
					dopo <Tex>{`${texNum(d, 1)}\\,\\text{m}`}</Tex>: <Tex>{`${texNum(done, 0)}\\,\\text{J}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Angolo α della fune (gradi)" value={deg} min={0} max={180} step={1} onChange={setDeg} />
				<Slider label="Forza F (N)" value={F} min={0} max={100} step={5} onChange={setF} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={moving} onClick={play}>
						<Play className="size-4" aria-hidden="true" />
						{d >= S ? 'Rifai lo spostamento' : 'Sposta la cassa'}
					</Button>
					<Button variant="secondary" size="sm" disabled={d === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti la cassa
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
