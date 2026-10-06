'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, frame, v, useFrameLoop, useReducedMotion, K, THICK, THIN, DASH, FONT } from '../kit';

/**
 * Lesson 66 (Il legame metallico): a piece of metal in the electron-sea model. The cations sit on a lattice and
 * vibrate around their sites, the more the higher the temperature; the electrons, one per cation, move at random among
 * them. A battery can be connected with the positive pole on the right or on the left: a drift towards the positive
 * pole is added to the random motion, and it is slower at a higher temperature (the vibrating cations hinder the
 * electrons, which is why the resistance of a metal grows when it is heated). A counter gives how many electrons
 * crossed the dashed line in each direction.
 *
 * The electrons leave from one side and come back from the other, as in a closed circuit. No physics engine: a random
 * walk on the direction of each electron, a drift along x, and a bounce on the cations.
 */

const COLS = 7, ROWS = 4, GAP = 0.9;
const X0 = 1.0, Y0 = 0.45;
const LEFT = X0 - GAP / 2, RIGHT = X0 + (COLS - 0.5) * GAP;
const BOTTOM = Y0 - 0.4, TOP = Y0 + (ROWS - 1) * GAP + 0.4;
const MID = X0 + 2.5 * GAP;
const R = 0.24; // cation
const f = frame(0, 7.4, -0.05, TOP + 0.1);
const FILL = '#ffdfbf'; // orange!25

type Battery = 'off' | 'right' | 'left';
type Electron = { x: number; y: number; a: number };

/** A small seeded generator, so the first frame is always the same. */
function mulberry(seed: number) {
	let s = seed;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const SITES = Array.from({ length: COLS * ROWS }, (_, i) => ({ x: X0 + (i % COLS) * GAP, y: Y0 + Math.floor(i / COLS) * GAP, ph: i * 2.4 }));

function start(): Electron[] {
	const rnd = mulberry(7);
	return SITES.map((s) => {
		const a = rnd() * 2 * Math.PI;
		return { x: s.x + 0.45 * Math.cos(Math.PI / 4 + (rnd() - 0.5)), y: Math.min(TOP - 0.05, s.y + 0.45 * Math.sin(Math.PI / 4 + (rnd() - 0.5))), a };
	});
}

const OPTIONS: { value: Battery; label: string }[] = [
	{ value: 'off', label: 'Senza pila' },
	{ value: 'right', label: 'Polo + a destra' },
	{ value: 'left', label: 'Polo + a sinistra' },
];

type Sim = { t: number; es: Electron[]; right: number; left: number };

const cationAt = (i: number, t: number, amp: number) => {
	const s = SITES[i];
	return { x: s.x + amp * Math.sin(9 * t + s.ph), y: s.y + amp * Math.cos(8 * t + 1.7 * s.ph) };
};

/** One step of the simulation: the electrons wander, drift, bounce on the cations and are counted at the line. */
function step(sim: Sim, dt: number, amp: number, drift: number, speed: number): Sim {
	// the first frame can come with a time before the loop's start
	if (!(dt > 0)) return sim;
	const t = sim.t + dt;
	let { right, left } = sim;
	const es = sim.es.map((old) => {
		const e = { ...old };
		e.a += (Math.random() - 0.5) * 9 * Math.sqrt(dt);
		e.x += (speed * Math.cos(e.a) + drift) * dt;
		e.y += speed * Math.sin(e.a) * dt;
		if (e.y > TOP - 0.05 || e.y < BOTTOM + 0.05) {
			e.y = Math.min(TOP - 0.05, Math.max(BOTTOM + 0.05, e.y));
			e.a = -e.a;
		}
		for (let i = 0; i < SITES.length; i++) {
			const c = cationAt(i, t, amp);
			const dx = e.x - c.x, dy = e.y - c.y;
			const d = Math.hypot(dx, dy);
			if (d < R + 0.05 && d > 0) {
				e.x = c.x + (dx / d) * (R + 0.05);
				e.y = c.y + (dy / d) * (R + 0.05);
				e.a = Math.atan2(dy, dx) + (Math.random() - 0.5);
			}
		}
		if (old.x < MID && e.x >= MID) right++;
		if (old.x >= MID && e.x < MID) left++;
		if (e.x > RIGHT) e.x -= RIGHT - LEFT;
		if (e.x < LEFT) e.x += RIGHT - LEFT;
		return e;
	});
	return { t, es, right, left };
}

export default function MetallicoMareElettroni({ alt }: { alt?: string }) {
	const [battery, setBattery] = useState<Battery>('off');
	const [temp, setTemp] = useState(1);
	const [sim, setSim] = useState<Sim>(() => ({ t: 0, es: start(), right: 0, left: 0 }));
	const reduced = useReducedMotion();

	const amp = 0.015 + 0.022 * temp;
	const drift = battery === 'off' ? 0 : ((battery === 'right' ? 1 : -1) * 1.5) / (0.55 + 0.45 * temp);
	const speed = 1.1 + 0.12 * temp;

	useFrameLoop(!reduced, (dt) => setSim((s) => step(s, dt, amp, drift, speed)));

	const reset = () => setSim((s) => ({ ...s, right: 0, left: 0 }));
	const count = sim;
	const net = count.right - count.left;
	const box = f.px(v(LEFT, TOP));

	const caption =
		battery === 'off'
			? 'Senza pila gli elettroni si muovono a caso tra i cationi: attraversano la linea tratteggiata in tutti e due i versi, e il conto netto resta vicino a zero.'
			: `Con la pila gli elettroni continuano a muoversi a caso, ma nell'insieme si spostano verso il polo positivo, a ${battery === 'right' ? 'destra' : 'sinistra'}: è la corrente elettrica. ${temp >= 4 ? 'A temperatura alta i cationi vibrano molto e lo spostamento è più lento.' : 'Alza la temperatura e guarda come cambia il conto.'}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={box.x} y={box.y} width={(RIGHT - LEFT) * K} height={(TOP - BOTTOM) * K} fill="#f2f2f2" stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(MID, BOTTOM), v(MID, TOP)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				{SITES.map((_, i) => {
					const c = f.px(cationAt(i, sim.t, amp));
					return (
						<g key={i}>
							<circle cx={c.x} cy={c.y} r={R * K} fill={FILL} stroke="#000" strokeWidth={THICK} />
							<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT} fill="#000">
								+
							</text>
						</g>
					);
				})}
				{sim.es.map((e, i) => {
					const p = f.px(v(e.x, e.y));
					return <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="#0000ff" />;
				})}
				{battery !== 'off' && (
					<>
						<Label f={f} at={v(battery === 'right' ? RIGHT + 0.22 : LEFT - 0.22, (TOP + BOTTOM) / 2)} upright size={22} color="#ff0000">
							+
						</Label>
						<Label f={f} at={v(battery === 'right' ? LEFT - 0.22 : RIGHT + 0.22, (TOP + BOTTOM) / 2)} upright size={22}>
							−
						</Label>
					</>
				)}
			</Drawing>
			<Readout>
				<span>verso destra: {count.right}</span>
				<span>verso sinistra: {count.left}</span>
				<span>
					netto: {net === 0 ? '0' : `${Math.abs(net)} verso ${net > 0 ? 'destra' : 'sinistra'}`}
				</span>
			</Readout>
			<Caption>{reduced ? 'Con le animazioni ridotte la figura resta ferma: gli elettroni, in blu, sono sparsi tra i cationi del reticolo.' : caption}</Caption>
			<Controls>
				<ButtonRow>
					{OPTIONS.map((o) => (
						<Button
							key={o.value}
							variant={o.value === battery ? 'primary' : 'secondary'}
							size="sm"
							aria-pressed={o.value === battery}
							onClick={() => {
								setBattery(o.value);
								reset();
							}}
						>
							{o.label}
						</Button>
					))}
				</ButtonRow>
				<Slider
					label="Temperatura (1 bassa, 5 alta)"
					value={temp}
					min={1}
					max={5}
					step={1}
					onChange={(x) => {
						setTemp(x);
						reset();
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Azzera il conto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
