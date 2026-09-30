'use client';

import { useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, clamp, num, texNum, useFrameLoop, useReducedMotion, TINT, THICK, THIN, DASH, type V } from '../kit';
import { Block, Ground } from '../fisica';
import { EnergyBars, ENERGY_FILL, barsWidth } from './energia';

/**
 * Lessons 63 (La conservazione dell'energia meccanica) and 64 (Forze dissipative e conservazione dell'energia totale):
 * a roller-coaster car of 500 kg on a track 58 m long, drawn at 1 cm per 10 m. The student drags the car to where it
 * starts (at most 33 m high) and lets it go. Beside the track, bars of the kinetic energy K, the potential energy U
 * and, with friction on, the dissipated energy, and a stacked bar with all of them. The bars use the drawing's own
 * scale (m g · 10 m per cm), so the top of the U bar is level with the car and the stacked bar stays at the height the
 * car started from.
 *
 * No physics engine. The track is a height h(x) made of cosine arcs between six points, flat at each of them. The car
 * moves along it with a hand-written step: tangential acceleration −g sin θ, and with friction −μ g cos θ against the
 * motion (a simplified friction, rolling and air together, that ignores the extra push of the curves). The friction
 * dissipates μ m g for each metre travelled horizontally, added up exactly; after each step the speed is taken again
 * from the energy, ½ m v² = E₀ − m g h − E_diss, so the bars add up to the starting energy to the joule. With
 * friction (μ = 0,10) the car stops where it is slow and the slope is gentler than tan θ = μ. The ride runs one and a
 * half times faster than real time, so that with friction it settles in about a minute. With reduced motion the
 * button moves it half a second at a time.
 */

const M = 500;
const G = 9.8;
const MU = 0.1;
const PACE = 1.5; // seconds of the ride per second on screen
const S = 0.1; // cm of drawing per metre
const PTS: [number, number][] = [
	[0, 34],
	[12, 2],
	[24, 20],
	[34, 8],
	[46, 24],
	[58, 36]
];
const X_END = PTS[PTS.length - 1][0];
const H_START_MAX = 33;
const X0 = 3;
const STEP = 1 / 500;
const BARS_X = 6.35;
const f = frame(-0.3, BARS_X + barsWidth(3) + 0.25, -0.62, 3.95);

function seg(x: number) {
	let i = 0;
	while (i < PTS.length - 2 && x > PTS[i + 1][0]) i++;
	return i;
}
/** Height of the track at x (metres). */
function height(x: number) {
	const xc = clamp(x, 0, X_END);
	const i = seg(xc);
	const [x0, h0] = PTS[i], [x1, h1] = PTS[i + 1];
	const t = (xc - x0) / (x1 - x0);
	return h0 + ((h1 - h0) * (1 - Math.cos(Math.PI * t))) / 2;
}
/** Slope dh/dx of the track at x. */
function slope(x: number) {
	const xc = clamp(x, 0, X_END);
	const i = seg(xc);
	const [x0, h0] = PTS[i], [x1, h1] = PTS[i + 1];
	const t = (xc - x0) / (x1 - x0);
	return ((h1 - h0) * Math.PI * Math.sin(Math.PI * t)) / (2 * (x1 - x0));
}

// Where a start is allowed: between the first and the last point below H_START_MAX.
const X_MIN = (() => {
	let x = 0;
	while (height(x) > H_START_MAX) x += 0.01;
	return x;
})();
const X_MAX = (() => {
	let x = X_END;
	while (height(x) > H_START_MAX) x -= 0.01;
	return x;
})();

const TRACK: V[] = Array.from({ length: 233 }, (_, i) => {
	const x = (i / 232) * X_END;
	return v(x * S, height(x) * S);
});

type Car = { x: number; v: number; diss: number; e0: number };
const start = (x: number): Car => ({ x, v: 0, diss: 0, e0: M * G * height(x) });

/** One step of dt seconds; returns true when the car has stopped for good (friction only). */
function advance(c: Car, dt: number, friction: boolean) {
	const sl = slope(c.x);
	const sec = Math.sqrt(1 + sl * sl);
	const sin = sl / sec, cos = 1 / sec;
	let a = -G * sin;
	if (friction) {
		if (Math.abs(c.v) < 0.3 && Math.abs(sl) <= MU) {
			c.v = 0;
			return true;
		}
		const dir = c.v !== 0 ? Math.sign(c.v) : -Math.sign(sl);
		a -= MU * G * cos * dir;
	}
	c.v += a * dt;
	const dx = c.v * cos * dt;
	c.x = clamp(c.x + dx, 0, X_END);
	if (friction) c.diss += MU * M * G * Math.abs(dx);
	// The speed again from the energy, when there is some: the bars add up exactly.
	const k = c.e0 - c.diss - M * G * height(c.x);
	if (k > 1) c.v = Math.sign(c.v || 1) * Math.sqrt((2 * k) / M);
	return false;
}

export default function MontagneRusseEnergia({ alt, attritoIniziale = false }: { alt?: string; attritoIniziale?: boolean }) {
	const [friction, setFriction] = useState(attritoIniziale);
	const [running, setRunning] = useState(false);
	const [stopped, setStopped] = useState(false);
	const [, setTick] = useState(0);
	const car = useRef<Car>(start(X0));
	const startX = useRef(X0);
	const spare = useRef(0);
	const reduced = useReducedMotion();
	const redraw = () => setTick((t) => t + 1);

	const run = (seconds: number) => {
		spare.current += seconds;
		for (; spare.current >= STEP; spare.current -= STEP) {
			if (advance(car.current, STEP, friction)) {
				spare.current = 0;
				setRunning(false);
				setStopped(true);
				break;
			}
		}
		redraw();
	};
	useFrameLoop(running, (dt) => run(dt * PACE));

	const reset = (x = startX.current) => {
		setRunning(false);
		setStopped(false);
		startX.current = x;
		car.current = start(x);
		spare.current = 0;
		redraw();
	};
	const play = () => {
		if (reduced) return run(0.5);
		if (stopped) reset();
		setRunning((r) => !r);
	};

	const c = car.current;
	const h = height(c.x);
	const U = M * G * h;
	const K = 0.5 * M * c.v * c.v;
	const E = K + U;
	const sl = slope(c.x);
	const theta = Math.atan(sl);
	const nrm = v(-Math.sin(theta), Math.cos(theta));
	const at = v(c.x * S + nrm.x * 0.02, h * S + nrm.y * 0.02);
	const centre = v(at.x + nrm.x * 0.12, at.y + nrm.y * 0.12);
	const moved = c.x !== startX.current || c.diss > 0;
	const kj = (x: number) => texNum(x / 1000, 1);

	const bars = [
		{ value: K, fill: ENERGY_FILL.K, name: 'K' },
		{ value: U, fill: ENERGY_FILL.U, name: 'U' },
		...(friction ? [{ value: c.diss, fill: ENERGY_FILL.diss, name: 'diss.', upright: true }] : [])
	];

	let caption: string;
	if (!moved && !running) caption = `Trascina il carrello dove vuoi farlo partire, poi premi ${reduced ? 'Avanti' : 'Lascia andare'}. Parte da fermo: tutta la sua energia è potenziale.`;
	else if (stopped) caption = `Il carrello si è fermato: l'attrito ha dissipato tutti i ${num(c.diss / 1000, 1)} kJ di energia che aveva in più rispetto al fondo di questa valle.`;
	else if (!friction) caption = `Senza attrito K e U si scambiano, ma la loro somma resta ${num(c.e0 / 1000, 1)} kJ: il carrello torna sempre alla quota di partenza, ${num(c.e0 / (M * G), 1)} m, e non la supera mai.`;
	else caption = `Con l'attrito l'energia meccanica diminuisce: ne sono già stati dissipati ${num(c.diss / 1000, 1)} kJ, e il carrello non torna più alla quota di partenza. La somma delle tre barre resta ${num(c.e0 / 1000, 1)} kJ.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, 0), ...TRACK, v(X_END * S, 0)], true)} fill={TINT.gray} stroke="none" />
				<Ground f={f} from={v(-0.2, 0)} to={v(X_END * S + 0.2, 0)} />
				<path d={f.path(TRACK)} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(-0.2, (c.e0 / (M * G)) * S), v(BARS_X - 0.1, (c.e0 / (M * G)) * S)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Block f={f} at={at} w={0.5} h={0.24} angle={theta} />
				{[-0.15, 0.15].map((d) => {
					const p = f.px(v(at.x + Math.cos(theta) * d, at.y + Math.sin(theta) * d));
					return <circle key={d} cx={p.x} cy={p.y} r={2.4} fill="#fff" stroke="#000" strokeWidth={THIN} />;
				})}
				{!running && <Handle f={f} at={centre} label="Il carrello" step={0.1} onMove={(p) => reset(clamp(p.x / S, X_MIN, X_MAX))} />}
				<EnergyBars f={f} at={v(BARS_X, 0)} bars={bars} scale={S / (M * G)} total={c.e0} totalName={friction ? 'tot.' : 'E'} />
			</Drawing>

			<Readout>
				<Tex>{`h = ${texNum(h, 1)}\\,\\text{m}`}</Tex>
				<Tex>{`v = ${texNum(Math.abs(c.v), 1)}\\,\\text{m/s}`}</Tex>
				<Tex>{`K = ${kj(K)}\\,\\text{kJ}`}</Tex>
				<Tex>{`U = ${kj(U)}\\,\\text{kJ}`}</Tex>
				<Tex>{`E = K + U = ${kj(E)}\\,\\text{kJ}`}</Tex>
				{friction && <span>dissipata <Tex>{`${kj(c.diss)}\\,\\text{kJ}`}</Tex></span>}
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
						value={friction ? 'si' : 'no'}
						onChange={(x) => {
							setFriction(x === 'si');
							reset();
						}}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di mezzo secondo' : running ? 'Ferma' : stopped ? 'Riparti' : 'Lascia andare'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti alla partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
