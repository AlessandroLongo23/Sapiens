'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Handle, Dot, frame, v, clamp, texNum, num, useFrameLoop, useReducedMotion, THIN, THICK, DASH, TINT, FONT } from '../kit';
import { Arrow, Ground, Spring, QTY } from '../fisica';

/**
 * Lesson 59 (Il lavoro di una forza), "Il lavoro come area sotto il grafico": a spring fixed to a wall, its free end
 * pulled to the right by a hand, and under it, on the same horizontal scale, the graph of the hand's force F = k x
 * against the stretch x (drawn for this figure: ticks every 5 cm and every 10 N). The student drags the spring's end,
 * or uses the sliders for x (0 to 20 cm) and k (50 to 200 N/m); the triangle under the line up to x fills in, and the
 * readout gives F = k x and W = ½ k x². A button stretches the spring slowly from zero, and the area grows with it.
 * Scale: 0,25 cm of drawing per cm of stretch, 0,075 cm per newton on the graph (40 N at 3 cm).
 */

const SX = 0.25; // drawing cm per cm of stretch
const SF = 0.075; // drawing cm per newton
const X_MAX = 20; // cm
const Y_SPRING = 4.35;
const WALL = -3; // the spring's fixed end
const KA = 0.04; // cm per newton for the hand's arrow
const PACE = 5; // cm of stretch per second
const f = frame(-3.45, 6.55, -0.85, 5.05);

export default function MollaAreaLavoro({ alt }: { alt?: string }) {
	const [x, setX] = useState(10); // cm
	const [k, setK] = useState(100); // N/m
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = Math.min(X_MAX, x + PACE * dt);
		setX(next);
		if (next >= X_MAX) setPlaying(false);
	});
	const play = () => {
		if (reduced) return setX(X_MAX);
		setX(0);
		setPlaying(true);
	};

	const xm = x / 100;
	const F = k * xm;
	const W = 0.5 * k * xm * xm;
	const X = x * SX;
	const end = v(X, Y_SPRING);
	const top = v(X, F * SF);
	const lineEnd = v(X_MAX * SX, k * (X_MAX / 100) * SF);

	const ticks: string[] = [];
	const numbers: { at: ReturnType<typeof v>; text: string; anchor: 'middle' | 'end' }[] = [];
	for (let c = 5; c <= X_MAX; c += 5) {
		ticks.push(f.path([v(c * SX, 0.07), v(c * SX, -0.07)]));
		numbers.push({ at: v(c * SX, -0.36), text: String(c), anchor: 'middle' });
	}
	for (let n = 10; n <= 40; n += 10) {
		ticks.push(f.path([v(0.07, n * SF), v(-0.07, n * SF)]));
		numbers.push({ at: v(-0.14, n * SF - 0.1), text: String(n), anchor: 'end' });
	}

	const half = 0.5 * k * (xm / 2) ** 2;
	const caption =
		x === 0
			? 'La molla è a riposo: la mano non tira e il lavoro è zero. Trascina la fine della molla o premi Allunga.'
			: `Per allungare la molla di ${num(x, 1)} cm la mano arriva a tirare con ${num(F, 1)} N e compie ${num(W, 3)} J, l’area del triangolo. Con metà allungamento il lavoro sarebbe un quarto: ${num(half, 3)} J.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(WALL, Y_SPRING + 0.6)} to={v(WALL, Y_SPRING - 0.6)} />
				<Spring f={f} from={v(WALL, Y_SPRING)} to={end} coils={12} />
				{/* the rest position of the free end */}
				<path d={f.path([v(0, Y_SPRING - 0.45), v(0, Y_SPRING + 0.45)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				{F > 0 && <Arrow f={f} from={end} to={v(X + F * KA, Y_SPRING)} color={QTY.forza} />}
				{F * KA > 0.25 && (
					<Label f={f} at={v(X + (F * KA) / 2, Y_SPRING + 0.05)} dir={v(0, 1)} size={14}>
						F
					</Label>
				)}
				{/* the stretch, joined to its point on the graph */}
				<path d={f.path([end, v(X, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.45} />

				{/* the graph */}
				{x > 0 && <path d={f.path([v(0, 0), v(X, 0), top], true)} fill={TINT.orange} stroke="none" />}
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{numbers.map((n) => {
					const p = f.px(n.at);
					return (
						<text key={`${n.text}-${n.anchor}`} x={p.x} y={p.y} dy="0.35em" textAnchor={n.anchor} fontSize={11} fontFamily={FONT}>
							{n.text}
						</text>
					);
				})}
				<Arrow f={f} from={v(-0.3, 0)} to={v(5.75, 0)} weight="thin" />
				<Arrow f={f} from={v(0, -0.3)} to={v(0, 3.4)} weight="thin" />
				<Label f={f} at={v(5.75, 0)} dir={v(0, -1)} size={14}>
					x
				</Label>
				<Label f={f} at={v(5.75, -0.36)} dir={v(0, -1)} upright size={11}>
					(cm)
				</Label>
				<Label f={f} at={v(0, 3.4)} dir={v(1, 0)} size={14}>
					F
				</Label>
				<Label f={f} at={v(0.35, 3.4)} dir={v(1, 0)} upright size={11}>
					(N)
				</Label>
				<path d={f.path([v(0, 0), lineEnd])} stroke={QTY.forza} strokeWidth={THICK} fill="none" />
				{x > 0 && <Dot f={f} at={top} />}
				<Handle f={f} at={end} label="Fine della molla" step={0.125} onMove={(p) => { setPlaying(false); setX(clamp(Math.round((p.x / SX) * 2) / 2, 0, X_MAX)); }} />
			</Drawing>

			<Readout>
				<Tex>{`x = ${texNum(x, 1)}\\,\\text{cm} = ${texNum(xm, 3)}\\,\\text{m}`}</Tex>
				<Tex>{`F = k\\,x = ${texNum(F, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`W = \\tfrac{1}{2}k\\,x^2 = ${texNum(W, 3)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Allungamento x (cm)" value={x} min={0} max={X_MAX} step={0.5} onChange={(val) => { setPlaying(false); setX(val); }} />
				<Slider label="Costante elastica k (N/m)" value={k} min={50} max={200} step={10} onChange={setK} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={playing} onClick={play}>
						<Play className="size-4" aria-hidden="true" />
						Allunga da zero
					</Button>
					<Button variant="secondary" size="sm" disabled={x === 0} onClick={() => { setPlaying(false); setX(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Molla a riposo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
