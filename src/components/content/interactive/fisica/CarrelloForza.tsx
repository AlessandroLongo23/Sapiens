'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, THICK, TINT } from '../kit';
import { Block, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 51 (Il secondo principio della dinamica): a cart on a horizontal track, for 4,4 m (1 cm of drawing per metre),
 * pulled by a horizontal force F (0 to 20 N) with a mass m (1 to 5 kg), both on sliders. The weight and the track's
 * reaction balance and are not drawn. With friction on (μs = 0,30, μd = 0,20) a still cart starts only if F exceeds
 * μs m g, and a moving one is slowed by μd m g. F pulls at the cart's front, the friction acts along its base, both red (0,15 cm per newton);
 * the acceleration is green above the cart (0,2 cm per m/s²), the velocity blue while it moves (0,2 cm per m/s). The
 * forces start at the cart's edges and not at its centre, so that the short ones are not hidden by the cart. The motion is integrated by hand, one frame at a time: v += a dt, x += v dt; a moving cart keeps going even
 * with F = 0 when there is no friction (the first principle), and stops after 4,4 m.
 */

const G = 9.8;
const MU_S = 0.3;
const MU_D = 0.2;
const TRACK = 4.4; // metres the cart can travel
const X0 = 0.9; // the cart's centre at the start, cm
const KF = 0.15; // cm per newton
const KA = 0.2; // cm per m/s²
const KV = 0.2; // cm per m/s
const W = 1.2, H = 0.55, WHEEL = 0.13;
const f = frame(-1.75, 9.75, -0.45, 2.75);

export default function CarrelloForza({ alt }: { alt?: string }) {
	const [F, setF] = useState(8);
	const [m, setM] = useState(2);
	const [rough, setRough] = useState(false);
	const [x, setX] = useState(0);
	const [vel, setVel] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const P = m * G;
	const moving = vel > 1e-9;
	const atEnd = x >= TRACK - 1e-9;
	// Friction: none; static (equal to F, up to μs P) when still; kinetic when moving.
	const stuck = rough && !moving && F <= MU_S * P + 1e-9;
	const friction = !rough ? 0 : moving ? MU_D * P : stuck ? F : MU_D * P;
	const Ftot = stuck ? 0 : F - friction;
	const a = atEnd ? 0 : Ftot / m;

	useFrameLoop(running, (dt) => {
		let nv = vel + a * dt;
		let nx = x + ((vel + nv) / 2) * dt;
		if (rough && nv <= 0) {
			nv = 0;
			if (F <= MU_S * P) setRunning(false);
		}
		if (nx >= TRACK) {
			nx = TRACK;
			setRunning(false);
		}
		setX(nx);
		setVel(nx >= TRACK ? 0 : nv);
	});

	const reset = () => {
		setRunning(false);
		setX(0);
		setVel(0);
	};
	const play = () => {
		if (running) return setRunning(false);
		if (atEnd) {
			setX(0);
			setVel(0);
		}
		if (reduced) {
			// No animation: the cart jumps to the end with the speed it would have there.
			const acc = rough ? (F > MU_S * P ? (F - MU_D * P) / m : 0) : F / m;
			if (acc > 0) {
				setX(TRACK);
				setVel(0);
			}
			return;
		}
		setRunning(true);
	};

	const cx = X0 + x;
	const base = v(cx, 2 * WHEEL);
	const c = add(base, v(0, H / 2));

	let caption: string;
	if (atEnd) caption = 'Il carrello ha percorso i 4,4 m della prova: rimettilo al via.';
	else if (stuck && F > 0) caption = `La forza di ${num(F, 1)} N non supera l'attrito statico massimo, μs m g = ${num(MU_S * P, 1)} N: il carrello resta fermo, e l'attrito statico vale ${num(F, 1)} N.`;
	else if (!moving && F === 0) caption = 'Senza forza il carrello fermo resta fermo. Scegli una forza e premi Avvia.';
	else if (!rough && F === 0) caption = 'La forza è zero e non c’è attrito: il carrello non accelera, e continua a muoversi a velocità costante.';
	else if (a < 0) caption = `L'attrito, ${num(friction, 1)} N, è più grande della forza: la forza totale è all'indietro, e il carrello rallenta.`;
	else caption = rough ? `Forza totale ${num(F, 1)} N − ${num(friction, 2)} N = ${num(Ftot, 2)} N; l'accelerazione è la forza totale divisa per la massa, ${num(a, 2)} m/s².` : `Senza attrito la forza totale è F: l'accelerazione è ${num(F, 1)} N / ${num(m, 1)} kg = ${num(a, 2)} m/s², nel verso della forza.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(f.x0 + 0.2, 0)} to={v(f.x1 - 0.2, 0)} />
				{[-0.35, 0.35].map((dx) => {
					const p = f.px(v(cx + dx, WHEEL));
					return <circle key={dx} cx={p.x} cy={p.y} r={WHEEL * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />;
				})}
				<Block f={f} at={base} w={W} h={H} label="m" />
				{F > 0 && <Vector f={f} from={add(c, v(W / 2, 0))} to={add(c, v(W / 2 + F * KF, 0))} color={QTY.forza} name="F" labelDir={v(1, 0)} />}
				{friction * KF > 0.04 && <Vector f={f} from={add(base, v(-W / 2, 0.08))} to={add(base, v(-W / 2 - friction * KF, 0.08))} color={QTY.forza} name="F" sub={moving || !stuck ? 'd' : 's'} labelDir={v(-0.3, 1)} />}
				{Math.abs(a) * KA > 0.04 && <Vector f={f} from={add(c, v(0, 0.8))} to={add(c, v(a * KA, 0.8))} color={QTY.accelerazione} name="a" labelDir={v(a > 0 ? 1 : -1, 0)} />}
				{vel * KV > 0.04 && <Vector f={f} from={add(c, v(0, 1.5))} to={add(c, v(vel * KV, 1.5))} color={QTY.velocita} name="v" labelDir={v(1, 0)} />}
			</Drawing>

			<Readout>
				<Tex>{`F = ${texNum(F, 1)}\\,\\text{N}`}</Tex>
				{rough && <Tex>{`F_${stuck ? 's' : 'd'} = ${texNum(friction, 2)}\\,\\text{N}`}</Tex>}
				<Tex>{`F_{tot} = ${texNum(Ftot, 2)}\\,\\text{N}`}</Tex>
				<Tex>{`a = \\dfrac{F_{tot}}{m} = ${texNum(a, 2)}\\,\\text{m/s}^2`}</Tex>
				<Tex>{`v = ${texNum(vel, 1)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Attrito"
						options={[
							{ value: 'no', label: 'Senza attrito' },
							{ value: 'si', label: 'Con attrito' }
						]}
						value={rough ? 'si' : 'no'}
						onChange={(k) => setRough(k === 'si')}
					/>
				</div>
				<Slider label="Forza F (newton)" value={F} min={0} max={20} step={0.5} onChange={setF} />
				<Slider label="Massa m (kg)" value={m} min={1} max={5} step={0.5} onChange={setM} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={!running && !atEnd && a <= 0 && !moving}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : atEnd ? 'Riparti' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={x === 0 && vel === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti al via
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
