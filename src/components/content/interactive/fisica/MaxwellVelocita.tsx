'use client';

import { useState } from 'react';
import { Play, Pause, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, useFrameLoop, useReducedMotion, THICK, THIN, TINT } from '../kit';
import { Axes } from '../fisica';
import { Ticks, Words } from './calore';
import { Molecules, advance, cloneGas, makeGas, maxwell, setRms, wallPoints, type Gas } from './molecole';

/**
 * Lesson 106 (Temperatura ed energia cinetica delle molecole): sixty atoms of a noble gas in a box and, under it, the
 * histogram of their speeds with Maxwell's curve at the same temperature. The student changes the temperature
 * (150-600 K) and the gas (neon, argon, krypton): the root-mean-square speed is √(3RT/M), so four times the
 * temperature doubles it and four times the mass halves it, while the mean kinetic energy (3/2)k_B T does not depend
 * on the gas. The histogram is averaged over the last seconds of motion, which smooths what sixty atoms alone would
 * draw. On the screen 517 m/s are 2,4 cm/s, as in the figure of lesson 105.
 */

const GASES = {
	neon: { label: 'Neon', nome: 'neon', M: 20.2, r: 0.07 },
	argon: { label: 'Argon', nome: 'argon', M: 39.9, r: 0.09 },
	kripton: { label: 'Kripton', nome: 'kripton', M: 83.8, r: 0.115 }
} as const;
type GasName = keyof typeof GASES;

const N = 60;
const BOX = { W: 6.2, H: 2.3, D: 1.6 };
const BOX_AT = v(0, 4.35);
const R = 8.31, KB = 1.38e-23;
const PER_CM = 517 / 2.4; // metres per second of a screen centimetre per second
const V_MAX = 1800, BIN = 60, BINS = V_MAX / BIN;
const GW = 6.2, GH = 3.1; // the graph: V_MAX wide; the tallest curve (krypton at 150 K) fills 92% of GH
const TAU = 2.5; // seconds over which the histogram is averaged

const f = frame(-0.5, 6.95, -0.75, 7.0);
const vqmOf = (T: number, gas: GasName) => Math.sqrt((3 * R * T) / (GASES[gas].M / 1000));
/** The density of the speeds that fills the graph's height: the peak of the narrowest curve, 0,587/a with a = v_qm/√3. */
const F_TOP = (0.587 * Math.sqrt(3)) / vqmOf(150, 'kripton') / 0.92;

/** How many of the atoms are in each class of speed, now. */
function histogram(g: Gas) {
	const h = new Array<number>(BINS).fill(0);
	for (let i = 0; i < g.x.length; i++) {
		const k = Math.floor((Math.hypot(g.vx[i], g.vy[i], g.vz[i]) * PER_CM) / BIN);
		if (k < BINS) h[k]++;
	}
	return h;
}

type Sim = { g: Gas; hist: number[] };

export default function MaxwellVelocita({ alt }: { alt?: string }) {
	const [T, setT] = useState(300);
	const [gas, setGas] = useState<GasName>('argon');
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const [sim, setSim] = useState<Sim>(() => {
		const g = makeGas(N, BOX, vqmOf(300, 'argon') / PER_CM, 11);
		return { g, hist: histogram(g) };
	});

	const run = (dt: number) =>
		setSim((prev) => {
			const g = cloneGas(prev.g);
			advance(g, dt);
			const now = histogram(g);
			const k = Math.min(1, dt / TAU);
			return { g, hist: prev.hist.map((x, i) => x + (now[i] - x) * k) };
		});
	useFrameLoop(playing, run);

	/** A new temperature or gas: every speed is multiplied by the same number, and the histogram starts again. */
	const retune = (t: number, name: GasName) =>
		setSim((prev) => {
			const g = cloneGas(prev.g);
			setRms(g, vqmOf(t, name) / PER_CM);
			return { g, hist: histogram(g) };
		});

	const vqm = vqmOf(T, gas);
	const Km = 1.5 * KB * T;
	const mx = maxwell(vqm);
	const xOf = (speed: number) => (speed / V_MAX) * GW;
	const yOf = (density: number) => (density / F_TOP) * GH;
	const curve = Array.from({ length: 121 }, (_, i) => (i / 120) * V_MAX).map((s) => v(xOf(s), yOf(mx.density(s))));
	const { g, hist } = sim;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Molecules f={f} g={g} at={BOX_AT} r={GASES[gas].r} />
				<path d={f.path(wallPoints(BOX, BOX_AT), true)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />

				{hist.map((count, k) => {
					const h = yOf(count / N / BIN);
					if (h < 0.004) return null;
					const a = f.px(v(xOf(k * BIN), h)), b = f.px(v(xOf((k + 1) * BIN), 0));
					return <rect key={k} x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={TINT.blue20} stroke="#000" strokeWidth={THIN} />;
				})}
				<Axes f={f} x0={0} x1={GW + 0.45} y0={0} y1={GH + 0.45} xName="" yName="" />
				<Ticks f={f} xs={[0, 300, 600, 900, 1200, 1500, 1800].map(xOf)} xl={['0', '', '600', '', '1200', '', '1800']} />
				<Words f={f} at={v(GW + 0.45, -0.5)} anchor="end" size={12}>
					<tspan fontStyle="italic">v</tspan> (m/s)
				</Words>
				<Words f={f} at={v(0.15, GH + 0.45)} anchor="start" size={12}>
					numero di atomi
				</Words>
				<path d={f.path(curve)} stroke="#6666ff" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(xOf(vqm), 0), v(xOf(vqm), GH * 0.97)])} stroke="#e67300" strokeWidth={THICK} fill="none" />
				<Words f={f} at={v(xOf(vqm) + 0.08, GH * 0.97)} anchor="start" size={13} color="#e67300">
					<tspan fontStyle="italic">v</tspan>
					<tspan fontSize={9} dy={3} fontStyle="italic">
						qm
					</tspan>
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`v_{qm} = \\sqrt{\\dfrac{3RT}{M}} = ${texNum(vqm, 0)}\\,\\text{m/s}`}</Tex>
				<Tex>{`K_m = \\tfrac{3}{2}\\,k_B T = ${(Km * 1e21).toFixed(2).replace('.', '{,}')} \\cdot 10^{-21}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>
				A {T} K gli atomi di {GASES[gas].nome} ({texPlain(GASES[gas].M)} g/mol) hanno velocità quadratica media {Math.round(vqm)} m/s. L&apos;energia cinetica media dipende solo dalla temperatura: è la stessa per i tre gas.
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Gas"
						options={(Object.keys(GASES) as GasName[]).map((k) => ({ value: k, label: GASES[k].label }))}
						value={gas}
						onChange={(x) => {
							setGas(x);
							retune(T, x);
						}}
					/>
				</div>
				<Slider
					label="Temperatura T"
					unit="K"
					value={T}
					min={150}
					max={600}
					step={25}
					onChange={(x) => {
						setT(x);
						retune(x, gas);
					}}
				/>
				<ButtonRow>
					{reduced ? (
						<Button variant="secondary" size="sm" onClick={() => run(1)}>
							<StepForward className="size-4" aria-hidden="true" />
							Avanti di un secondo
						</Button>
					) : (
						<Button variant="secondary" size="sm" onClick={() => setPlaying((x) => !x)}>
							{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
							{playing ? 'Ferma' : 'Avvia'}
						</Button>
					)}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

const texPlain = (x: number) => String(x).replace('.', ',');
