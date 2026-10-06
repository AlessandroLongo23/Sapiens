'use client';

import { useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Dot, frame, v, useFrameLoop, useReducedMotion, THIN, THICK, VERY_THIN, DASH, FONT, INK } from '../kit';
import { Arrow, Ball, QTY } from '../fisica';

/**
 * Lesson 78 (Forze conservative ed energia potenziale), example 4: a body of 0,50 kg on the x axis with the
 * potential energy of the lesson's piecewise graph, (0; 12 J), (2 m; 2 J), (5 m; 8 J), (7 m; 4 J), (9 m; 4 J). The
 * student picks the starting point between 0 and 2 m (so the mechanical energy E = U(x0), from 12 J down to 2 J) and
 * lets the body go. On the graph: the dashed line of E, the turning points where it meets the graph, and at the body's
 * position the segment of U (orange) with the segment of K = E − U on top of it. Under the graph the x axis with the
 * body and the force on it, −ΔU/Δx of the stretch it is on (0,16 cm per newton). With E under 8 J the body swings in the
 * well; over 8 J it crosses the hill and leaves to the right, where the figure stops it at 9 m.
 *
 * No physics engine: the force is constant on each stretch, steps of 1/2000 s written by hand, and after each step the
 * speed is taken again from the energy, so K + U stays E exactly. With reduced motion the button moves a tenth of a
 * second at a time.
 */

const M = 0.5;
const PTS: [number, number][] = [[0, 12], [2, 2], [5, 8], [7, 4], [9, 4]];
const SX = 0.62; // cm per metre
const SY = 0.27; // cm per joule
const TRACK = -1.45;
const KF = 0.16; // cm per newton
const STEP = 1 / 2000;
const HILL = 8;
const f = frame(-0.95, 7.2, -2.55, 4.2);
/** A number with a fixed count of decimals, the Italian way; `tex` writes the comma for KaTeX. */
const fx = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', ',').replace('-', '−');
const tex = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', '{,}');

const piece = (x: number) => {
	for (let i = 0; i + 1 < PTS.length; i++) if (x <= PTS[i + 1][0] || i + 2 === PTS.length) return i;
	return PTS.length - 2;
};
const slope = (i: number) => (PTS[i + 1][1] - PTS[i][1]) / (PTS[i + 1][0] - PTS[i][0]);
const U = (x: number) => {
	const i = piece(x);
	return PTS[i][1] + slope(i) * (x - PTS[i][0]);
};
/** The force where the body is; at a corner of the graph, the one of the stretch it is moving into. */
const force = (x: number, vel: number) => {
	let i = piece(x);
	if (vel > 0 && i + 2 < PTS.length && Math.abs(x - PTS[i + 1][0]) < 1e-9) i += 1;
	return -slope(i) || 0;
};
const at = (x: number, u: number) => v(x * SX, u * SY);

type State = { x: number; v: number };

export default function GraficoEnergiaPotenziale({ alt }: { alt?: string }) {
	const [x0, setX0] = useState(1);
	const [running, setRunning] = useState(false);
	const [, setTick] = useState(0);
	const st = useRef<State>({ x: 1, v: 0 });
	const spare = useRef(0);
	const reduced = useReducedMotion();
	const E = U(x0);
	const still = E - 2 < 1e-9; // at the bottom of the well
	const onTop = Math.abs(E - HILL) < 1e-9;

	const run = (seconds: number) => {
		const b = st.current;
		spare.current += seconds;
		for (; spare.current >= STEP; spare.current -= STEP) {
			if (still || b.x >= 9) break;
			b.v += (force(b.x, b.v) / M) * STEP;
			b.x += b.v * STEP;
			if (b.x < 0) {
				b.x = 0;
				b.v = 0;
			}
			if (onTop && b.x >= 5) {
				b.x = 5;
				b.v = 0;
				break;
			}
			const k = E - U(b.x);
			if (onTop && b.x > 4.9 && k <= 1e-4) {
				b.x = 5;
				b.v = 0;
				break;
			}
			if (k > 1e-4) b.v = Math.sign(b.v || 1) * Math.sqrt((2 * k) / M);
			else if (k < 0) {
				// past a turning point by a hair: back onto it, at rest, and the force sends it back
				b.x -= b.v * STEP;
				b.v = 0;
			}
		}
		if (b.x >= 9) {
			b.x = 9;
			setRunning(false);
		}
		if (onTop && b.x >= 5) setRunning(false);
		setTick((t) => t + 1);
	};
	useFrameLoop(running, run);

	const reset = (x = x0) => {
		setRunning(false);
		setX0(x);
		st.current = { x, v: 0 };
		spare.current = 0;
		setTick((t) => t + 1);
	};
	const play = () => {
		if (reduced) return run(0.1);
		setRunning((r) => !r);
	};

	const b = st.current;
	const u = U(b.x);
	const k = Math.max(0, E - u);
	const speed = Math.sqrt((2 * k) / M);
	const F = still || b.x >= 9 || (onTop && b.x >= 5) ? 0 : force(b.x, b.v);
	const moved = b.x !== x0 || b.v !== 0;
	const out = b.x >= 9;
	// the second turning point, on the rising stretch from (2; 2) to (5; 8), when the body stays in the well
	const turn = E < HILL && !onTop ? 2 + (E - 2) / 2 : null;

	const ticks: string[] = [];
	const grid: string[] = [];
	for (let x = 1; x <= 9; x++) {
		ticks.push(f.path([at(x, 0.25), at(x, -0.25)]));
		grid.push(f.path([at(x, 0), at(x, 12)]));
	}
	for (let y = 2; y <= 12; y += 2) {
		ticks.push(f.path([v(0.06, y * SY), v(-0.06, y * SY)]));
		grid.push(f.path([at(0, y), at(9, y)]));
	}
	const text = (p: ReturnType<typeof v>, s: string, anchor: 'middle' | 'end', dy: string) => {
		const q = f.px(p);
		return (
			<text key={`${s}-${anchor}`} x={q.x} y={q.y} dy={dy} textAnchor={anchor} fontSize={11} fontFamily={FONT}>
				{s}
			</text>
		);
	};

	let caption: string;
	if (still) caption = 'In fondo alla buca la forza è zero e il corpo resta fermo: è un equilibrio stabile.';
	else if (!moved) caption = `Lasciato fermo in x = ${fx(x0, 1)} m il corpo ha E = U = ${fx(E, 1)} J${E > HILL ? ', più degli 8 J della collina' : E < HILL ? ', meno degli 8 J della collina' : ', proprio gli 8 J della collina'}: premi Lascia andare.`;
	else if (out) caption = `Il corpo ha superato la collina e prosegue verso destra con K = ${fx(E - 4, 1)} J, senza tornare.`;
	else if (onTop && b.x >= 5) caption = 'Il corpo arriva in cima alla collina con velocità zero: è un equilibrio instabile.';
	else if (onTop) caption = 'Con E = 8,0 J il corpo ha proprio l’energia della collina: ci arriva in cima con velocità zero.';
	else if (turn !== null) caption = `Con E = ${fx(E, 1)} J il corpo oscilla tra x = ${fx(x0, 1)} m e x = ${fx(turn, 2)} m, i due punti in cui il grafico incontra la retta di E.`;
	else caption = `Con E = ${fx(E, 1)} J la retta passa sopra la collina: in cima, al corpo restano ${fx(E - HILL, 1)} J di energia cinetica.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={VERY_THIN} fill="none" />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => text(v(x * SX, -0.12), String(x), 'middle', '0.8em'))}
				{[2, 4, 6, 8, 10, 12].map((y) => text(v(-0.13, y * SY), String(y), 'end', '0.35em'))}
				<Arrow f={f} from={v(-0.3, 0)} to={v(6.05, 0)} weight="thin" />
				<Arrow f={f} from={v(0, -0.3)} to={v(0, 3.75)} weight="thin" />
				<Label f={f} at={v(6.05, 0)} dir={v(1, 0)} size={13}>
					x
				</Label>
				<Label f={f} at={v(6.28, 0)} dir={v(1, 0)} upright size={11}>
					(m)
				</Label>
				<Label f={f} at={v(0, 3.78)} dir={v(0, 1)} size={13}>
					U
				</Label>
				<Label f={f} at={v(0.26, 3.78)} dir={v(1, 1)} upright size={11}>
					(J)
				</Label>

				{/* U and K at the body's position */}
				<path d={f.path([at(b.x, 0), at(b.x, u)])} stroke={INK.orange} strokeWidth={3} fill="none" />
				{k > 0.02 && <path d={f.path([at(b.x, u), at(b.x, E)])} stroke={QTY.velocita} strokeWidth={3} fill="none" />}
				<path d={f.path(PTS.map(([x, y]) => at(x, y)))} stroke={INK.blue} strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<path d={f.path([at(0, E), at(9, E)])} stroke="#000" strokeWidth={THICK} strokeDasharray={DASH} fill="none" />
				<Label f={f} at={at(9, E)} dir={v(1, 0)} size={13}>
					E
				</Label>
				{!still && <Dot f={f} at={at(x0, E)} />}
				{turn !== null && !still && <Dot f={f} at={at(turn, E)} />}
				{k > 1.6 && (
					<Label f={f} at={v(b.x * SX + (b.x > 8 ? -0.08 : 0.08), (u + k / 2) * SY)} dir={v(b.x > 8 ? -1 : 1, 0)} size={13} color={QTY.velocita}>
						K
					</Label>
				)}

				{/* the x axis the body moves on */}
				<path d={f.path([at(b.x, 0), v(b.x * SX, TRACK + 0.2)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.45} />
				<Arrow f={f} from={v(-0.3, TRACK)} to={v(6.05, TRACK)} weight="thin" />
				<Label f={f} at={v(6.05, TRACK)} dir={v(1, 0)} size={13}>
					x
				</Label>
				<Ball f={f} at={v(b.x * SX, TRACK)} r={0.17} />
				{F !== 0 && <Arrow f={f} from={v(b.x * SX, TRACK - 0.38)} to={v(b.x * SX + F * KF, TRACK - 0.38)} color={QTY.forza} />}
				{F !== 0 && (
					<Label f={f} at={v(b.x * SX + (F * KF) / 2, TRACK - 0.42)} dir={v(0, -1)} size={13} color={QTY.forza}>
						F
					</Label>
				)}
			</Drawing>

			<Readout>
				<Tex>{`x = ${tex(b.x, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`U = ${tex(u, 1)}\\,\\text{J}`}</Tex>
				<Tex>{`K = E - U = ${tex(k, 1)}\\,\\text{J}`}</Tex>
				<Tex>{`v = ${tex(speed, 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`F_x = ${tex(F, 1)}\\,\\text{N}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Partenza" unit="m" value={x0} min={0} max={2} step={0.1} onChange={(x) => reset(Math.round(x * 10) / 10)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={still || out || (onTop && b.x >= 5)} onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di un decimo di secondo' : running ? 'Ferma' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta alla partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
