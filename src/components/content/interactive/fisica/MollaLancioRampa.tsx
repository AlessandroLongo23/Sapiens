'use client';

import { useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, texNum, num, useFrameLoop, useReducedMotion, THIN, DASH, FONT_SIZE, type V } from '../kit';
import { Block, Ground, Incline, Spring } from '../fisica';
import { EnergyBars, ENERGY_FILL, barsWidth } from './energia';

/**
 * Lesson 63 (La conservazione dell'energia meccanica), "La molla che lancia un blocco": a spring with k = 400 N/m,
 * 25 cm long at rest, against a wall; the student picks how much to compress it (2 to 12 cm) with a block of 0,50 kg
 * against it, then launches. The block leaves the spring when it is back at rest, slides on a smooth floor (60 cm to
 * the foot of the ramp) and climbs a smooth ramp at 30°, up to h = k x² / (2 m g), then comes back, compresses the
 * spring again and so on for ever. Drawn at 3 cm per metre (the block is drawn bigger than it would be). Beside it the
 * bars of the elastic energy, the kinetic energy, the gravitational potential energy and their sum, at the drawing's
 * scale (m g · 1 m per 3 cm), so the top of the U bar is level with the block's base and the dashed line of the total
 * marks the height where it will stop.
 *
 * No physics engine: one coordinate s along the path (the spring's free end moves with the block while s < 0), with
 * acceleration −k s / m on the spring, 0 on the floor and −g sin 30° on the ramp, in hand-written steps of 1/2000 s;
 * after each step the speed is taken again from the energy, so the bars add up exactly. With reduced motion the
 * button moves it a tenth of a second at a time.
 */

const K_EL = 400;
const M = 0.5;
const G = 9.8;
const ALPHA = Math.PI / 6;
const S = 3; // cm per metre
const REST = 0.25; // spring length at rest, m
const BW = 0.5, BH = 0.4; // block in the drawing, cm
const BWM = BW / S; // block width in metres
const FOOT = REST + 0.6; // where the ramp starts, m from the wall
const RAMP = 1.35; // ramp length, m
const STEP = 1 / 2000;
const BARS_X = 6.55;
const RAMP_BASE = RAMP * Math.cos(ALPHA) * S;
const RAMP_TOP = v(FOOT * S + RAMP_BASE, RAMP * Math.sin(ALPHA) * S);
const f = frame(-0.35, BARS_X + barsWidth(3) + 0.25, -0.62, RAMP_TOP.y + 0.35);

type State = { s: number; v: number; e0: number };
const start = (xcm: number): State => ({ s: -xcm / 100, v: 0, e0: 0.5 * K_EL * (xcm / 100) ** 2 });

/** Distance along the ramp of the block's bottom centre (0 before the ramp). */
const onRamp = (s: number) => Math.max(0, REST + s + BWM / 2 - FOOT);
const accel = (s: number) => (s < 0 ? (-K_EL * s) / M : 0) - (onRamp(s) > 0 ? G * Math.sin(ALPHA) : 0);
const energies = (st: State) => {
	const Uel = st.s < 0 ? 0.5 * K_EL * st.s * st.s : 0;
	const Ug = M * G * onRamp(st.s) * Math.sin(ALPHA);
	return { Uel, Ug, K: 0.5 * M * st.v * st.v };
};

export default function MollaLancioRampa({ alt }: { alt?: string }) {
	const [xcm, setX] = useState(10);
	const [running, setRunning] = useState(false);
	const [, setTick] = useState(0);
	const st = useRef<State>(start(10));
	const spare = useRef(0);
	const reduced = useReducedMotion();

	const run = (seconds: number) => {
		const b = st.current;
		spare.current += seconds;
		for (; spare.current >= STEP; spare.current -= STEP) {
			b.v += accel(b.s) * STEP;
			b.s += b.v * STEP;
			const { Uel, Ug } = energies(b);
			const k = b.e0 - Uel - Ug;
			if (k > 1e-3) b.v = Math.sign(b.v || 1) * Math.sqrt((2 * k) / M);
		}
		setTick((t) => t + 1);
	};
	useFrameLoop(running, run);

	const reset = (x = xcm) => {
		setRunning(false);
		setX(x);
		st.current = start(x);
		spare.current = 0;
		setTick((t) => t + 1);
	};
	const play = () => {
		if (reduced) return run(0.1);
		setRunning((r) => !r);
	};

	const b = st.current;
	const { Uel, Ug, K } = energies(b);
	const r = onRamp(b.s);
	const h = r * Math.sin(ALPHA);
	const hMax = b.e0 / (M * G);
	const up = polar(1, ALPHA);
	const foot = v(FOOT * S, 0);
	const base: V = r > 0 ? add(foot, scale(up, r * S)) : v((REST + b.s + BWM / 2) * S, 0);
	const springEnd = Math.min(REST + b.s, REST) * S;
	const moved = b.s !== -xcm / 100 || b.v !== 0;
	const scaleE = S / (M * G);

	let caption: string;
	if (!moved) caption = `La molla compressa di ${xcm} cm ha un'energia elastica di ${num(b.e0, 2)} J: premi Lancia.`;
	else if (b.s < 0) caption = "La molla si allunga e spinge il blocco: l'energia elastica diventa energia cinetica.";
	else if (r <= 0) caption = `Sul piano liscio la velocità resta ${num(Math.abs(b.v), 2)} m/s: tutta l'energia è cinetica.`;
	else caption = `Sulla rampa l'energia cinetica diventa potenziale gravitazionale: il blocco si ferma a h = kx²/(2mg) = ${num(hMax * 100, 1)} cm, sulla linea tratteggiata, e torna indietro.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0, 0.75)} to={v(0, 0)} />
				<Ground f={f} from={v(0, 0)} to={v(RAMP_TOP.x + 0.2, 0)} />
				<Incline f={f} corner={v(RAMP_TOP.x, 0)} base={RAMP_BASE} angle={ALPHA} ground={false} />
				<path d={f.path([v(REST * S, 0.05), v(REST * S, 0.62)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Spring f={f} from={v(0, BH / 2)} to={v(springEnd, BH / 2)} coils={9} />
				<path d={f.path([v(0, hMax * S), v(BARS_X - 0.1, hMax * S)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.7} />
				<Block f={f} at={base} w={BW} h={BH} angle={r > 0 ? ALPHA : 0} />
				<Label f={f} at={add(foot, polar(1.0, ALPHA / 2))} upright size={FONT_SIZE * 0.8}>
					30°
				</Label>
				<EnergyBars
					f={f}
					at={v(BARS_X, 0)}
					bars={[
						{ value: Uel, fill: ENERGY_FILL.Uel, name: 'U', sub: 'el' },
						{ value: K, fill: ENERGY_FILL.K, name: 'K' },
						{ value: Ug, fill: ENERGY_FILL.U, name: 'U', sub: 'g' }
					]}
					scale={scaleE}
					total={b.e0}
					totalName="E"
				/>
			</Drawing>

			<Readout>
				<Tex>{`v = ${texNum(Math.abs(b.v), 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`h = ${texNum(h * 100, 1)}\\,\\text{cm}`}</Tex>
				<Tex>{`U_{el} = ${texNum(Uel, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`K = ${texNum(K, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`U_g = ${texNum(Ug, 2)}\\,\\text{J}`}</Tex>
				<Tex>{`E = ${texNum(b.e0, 2)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Compressione x" unit="cm" value={xcm} min={2} max={12} step={1} onChange={(x) => reset(Math.round(x))} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{reduced ? <StepForward className="size-4" aria-hidden="true" /> : running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? 'Avanti di un decimo di secondo' : running ? 'Ferma' : 'Lancia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomprimi la molla
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
