'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, num, texNum, useFrameLoop, useReducedMotion, THIN, THICK, TINT } from '../kit';
import { Ball, Vector, QTY } from '../fisica';
import { LIQUID } from './liquidi';

/**
 * Lesson 74 (Il principio di relatività galileiana), example 2: a ship sails at V (0 to 8 m/s, 8 at the start) and a
 * stone is dropped from the top of its mast, 19,6 m above the deck, so the fall lasts 2,0 s whatever V is. Seen from
 * the shore the ship advances and the stone, which starts with the ship's velocity, draws an arc of parabola; seen
 * from the ship the buoys slide backwards and the stone falls straight down. In both it lands at the foot of the
 * mast. The stone's velocity in the chosen frame is drawn on it. Closed formulas, real seconds.
 * Scale: 0,2 cm per metre; velocities 0,05 cm per m/s. Buoys every 5 m mark the water.
 */

const G = 9.8;
const H = 19.6; // m
const TF = Math.sqrt((2 * H) / G); // 2 s
const M = 0.2; // cm per metre
const KV = 0.05; // cm per m/s
const DECK = 0.5; // cm above the water line
const OFF = 0.12; // cm, the stone beside the mast
const START = 9; // m, where the mast is at t = 0 seen from the shore
const FIXED = 22; // m, where the mast is drawn seen from the ship
const f = frame(-0.4, 8.6, -0.75, 5.0);

type View = 'riva' | 'nave';

export default function NaveGalileo({ alt }: { alt?: string }) {
	const [view, setView] = useState<View>('riva');
	const [V, setV] = useState(8);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();
	const done = t >= TF - 1e-9;

	useFrameLoop(running, (dt) => {
		const next = Math.min(TF, t + dt);
		setT(next);
		if (next >= TF) setRunning(false);
	});
	const play = () => {
		if (running) return setRunning(false);
		if (reduced) return setT(TF);
		if (done) setT(0);
		setRunning(true);
	};
	const reset = () => {
		setRunning(false);
		setT(0);
	};

	// What is fixed in the drawing: the water (from the shore) or the ship.
	const mastAt = (tau: number) => (view === 'riva' ? START + V * tau : FIXED) * M;
	const mast = mastAt(t);
	const top = DECK + H * M;
	/** The stone at time tau, in the drawing: it has the ship's horizontal velocity from the start. */
	const stone = (tau: number) => v((view === 'riva' ? START + V * tau : FIXED) * M + OFF, top - ((G * tau * tau) / 2) * M);
	const trace = Array.from({ length: 25 }, (_, i) => stone((t * i) / 24));
	const s = stone(t);
	const vx = view === 'riva' ? V : 0;
	const vy = -G * t;
	const shift = view === 'riva' ? 0 : FIXED - (START + V * t); // metres the water is moved by in the drawing
	const buoys: number[] = [];
	for (let k = Math.ceil((f.x0 / M - shift) / 5); k * 5 <= f.x1 / M - shift; k++) buoys.push(k * 5);

	const caption = done
		? `Il sasso tocca il ponte ai piedi dell'albero dopo 2,0 s. ${V === 0 ? 'La nave è ferma, e la caduta è verticale per tutti e due gli osservatori.' : view === 'riva' ? `Vista dalla riva la traiettoria è un arco di parabola largo ${num(V * TF, 0)} m, gli stessi metri di cui è avanzata la nave.` : 'Vista dalla nave la caduta è verticale, qualunque sia la velocità della nave.'}`
		: t === 0
			? `La nave va a ${num(V, 0)} m/s. Lascia cadere il sasso e guarda dove arriva, ${view === 'riva' ? 'dalla riva' : 'dalla nave'}.`
			: view === 'riva'
				? `Visto dalla riva il sasso conserva la velocità orizzontale della nave, ${num(V, 0)} m/s, e intanto cade: resta sempre accanto all'albero.`
				: `Visto dalla nave il sasso non ha velocità orizzontale: cade in verticale, come a nave ferma.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(f.x0, f.y0), v(f.x1, f.y0), v(f.x1, 0.2), v(f.x0, 0.2)], true)} fill={LIQUID.acqua} stroke="none" />
				<path d={f.path([v(f.x0, 0.2), v(f.x1, 0.2)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{buoys.map((m) => {
					const x = (m + shift) * M;
					return (
						<g key={m}>
							<circle cx={f.px(v(x, -0.15)).x} cy={f.px(v(x, -0.15)).y} r={3.5} fill="#ff8000" stroke="#000" strokeWidth={THIN} />
							{x > f.x0 + 0.3 && x < f.x1 - 0.3 && (
								<Label f={f} at={v(x, -0.3)} dir={v(0, -1)} upright size={11}>
									{String(m).replace('-', '−')} m
								</Label>
							)}
						</g>
					);
				})}

				<path d={f.path([v(mast - 1.0, 0), v(mast + 1.0, 0), v(mast + 1.4, DECK), v(mast - 1.4, DECK)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(mast, DECK), v(mast, top)])} stroke="#000" strokeWidth={THICK} fill="none" />
				{t > 0 && <path d={f.path(trace)} stroke={QTY.velocita} strokeWidth={THICK} fill="none" />}
				<Ball f={f} at={s} r={0.08} fill="#808080" />
				{vx > 0 && !done && <Vector f={f} from={s} to={v(s.x + vx * KV, s.y)} color={QTY.velocita} dashed />}
				{t > 0 && !done && <Vector f={f} from={s} to={v(s.x, s.y + vy * KV)} color={QTY.velocita} dashed={vx > 0} />}
				{t > 0 && vx > 0 && !done && <Vector f={f} from={s} to={v(s.x + vx * KV, s.y + vy * KV)} color={QTY.velocita} name="v" labelDir={v(1, -0.3)} />}
				{view === 'riva' && V > 0 && <Vector f={f} from={v(mast - 1.2, DECK + 0.35)} to={v(mast - 1.2 + V * KV, DECK + 0.35)} color={QTY.velocita} name="V" labelAt={0.5} labelDir={v(0, 1)} />}
			</Drawing>

			<Readout>
				<Tex>{`t = ${t.toFixed(1).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				<Tex>{`v_x = ${texNum(vx, 0)}\\,\\text{m/s}`}</Tex>
				<Tex>{`v_y = ${texNum(vy, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`a = 9{,}8\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Punto di vista"
						options={[
							{ value: 'riva', label: 'Dalla riva' },
							{ value: 'nave', label: 'Dalla nave' }
						]}
						value={view}
						onChange={(k) => setView(k)}
					/>
				</div>
				<Slider
					label="Nave V (m/s)"
					value={V}
					min={0}
					max={8}
					step={1}
					onChange={(x) => {
						reset();
						setV(x);
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running ? 'Ferma' : done ? 'Rifai' : t > 0 ? 'Riprendi' : 'Lascia cadere'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
