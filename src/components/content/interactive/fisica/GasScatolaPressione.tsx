'use client';

import { useState } from 'react';
import { Play, Pause, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, useFrameLoop, useReducedMotion, THICK, THIN, TINT } from '../kit';
import { Flashes, Molecules, R_MOL, wallPoints, advance, cloneGas, kineticPressure, makeGas, setCount, setRms, setWidth, wallArea, type Gas } from './molecole';

/**
 * Lesson 105 (La teoria cinetica dei gas): the gas of the model in a box seen from the front. The student changes the
 * number of molecules, the volume (the right wall moves) and the temperature, which sets the molecules' speed, and
 * reads the pressure twice: counted from the impulse the hits give to the walls over the last seconds, and from
 * p = N m v_qm² / (3V). Both are written as multiples of the starting pressure p₀ (40 molecules, 2,0 L, 300 K), so
 * the three proportionalities of the lesson can be read off: twice the molecules, half the volume or twice the
 * temperature each double it. The speed written is nitrogen's, √(3RT/M); on the screen 300 K is 2,4 cm/s.
 */

const H = 3.2, D = 1.6, W_FULL = 5; // the box at its largest, in cm
const V_FULL = 2; // litres it stands for
const N0 = 40, T0 = 300;
const SCREEN = 2.4; // cm/s of root-mean-square speed at 300 K
const WINDOW = 4; // seconds over which the hits are counted
const R = 8.31, M_N2 = 0.028;

const f = frame(-0.4, 5.75, -0.4, 3.6);
const screenSpeed = (T: number) => SCREEN * Math.sqrt(T / T0);
const P0 = (N0 * SCREEN ** 2) / (3 * W_FULL * H * D);

type Sample = { t: number; j: number };

export default function GasScatolaPressione({ alt }: { alt?: string }) {
	const [N, setN] = useState(N0);
	const [vol, setVol] = useState(V_FULL);
	const [T, setT] = useState(T0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	// The gas and the impulses of the last seconds: copied, changed and stored again, never changed in place.
	const [sim, setSim] = useState<{ g: Gas; samples: Sample[] }>(() => ({ g: makeGas(N0, { W: W_FULL, H, D }, SCREEN), samples: [] }));
	const change = (act: (g: Gas) => void) =>
		setSim((prev) => {
			const g = cloneGas(prev.g);
			act(g);
			return { g, samples: prev.samples };
		});

	const run = (dt: number) =>
		setSim((prev) => {
			const g = cloneGas(prev.g);
			advance(g, dt);
			const samples = [...prev.samples.filter((x) => x.t >= g.time - WINDOW), { t: g.time, j: g.impulse / wallArea(g) }];
			g.impulse = 0;
			return { g, samples };
		});
	useFrameLoop(playing, run);

	const changeN = (x: number) => {
		setN(x);
		change((g) => setCount(g, x, screenSpeed(T)));
	};
	const changeT = (x: number) => {
		setT(x);
		change((g) => setRms(g, screenSpeed(x)));
	};
	const changeV = (x: number) => {
		setVol(x);
		change((g) => setWidth(g, (x / V_FULL) * W_FULL));
	};

	const { g, samples: s } = sim;
	const span = s.length > 1 ? g.time - s[0].t : 0;
	const counted = span > 1.5 ? s.reduce((a, b) => a + b.j, 0) / span / P0 : null;
	const formula = kineticPressure(g) / P0;
	const vqm = Math.sqrt((3 * R * T) / M_N2);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path(wallPoints({ W: W_FULL, H }), true)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray="2 3" opacity={0.5} />
				<path d={f.path([v(g.W + R_MOL, -R_MOL), v(g.W + R_MOL + 0.22, -R_MOL), v(g.W + R_MOL + 0.22, H + R_MOL), v(g.W + R_MOL, H + R_MOL)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<Molecules f={f} g={g} arrows={!playing && g.time === 0 && N <= 40} />
				<path d={f.path(wallPoints(g), true)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<Flashes f={f} g={g} />
			</Drawing>

			<Readout>
				<Tex>{`v_{qm} = ${texNum(vqm, 0)}\\,\\text{m/s}`}</Tex>
				<span>
					dalla formula <Tex>{`p = ${fixed(formula, 2)}\\,p_0`}</Tex>
				</span>
				<span>
					dagli urti <Tex>{counted === null ? 'p = \\ldots' : `p \\approx ${fixed(counted, 1)}\\,p_0`}</Tex>
				</span>
			</Readout>
			<Caption>
				{N === N0 && vol === V_FULL && T === T0 ? (
					<>
						Lo stato di partenza: {N0} molecole in 2 litri a 300 K, con pressione <Tex>p_0</Tex>. {playing ? 'Ogni segno arancione è un urto contro la parete.' : reduced ? 'Fai avanzare il tempo e cambia una grandezza alla volta.' : 'Premi Avvia e cambia una grandezza alla volta.'}
					</>
				) : (
					<>
						Rispetto alla partenza le molecole sono {texRatio(N / N0)} volte, il volume {texRatio(vol / V_FULL)} volte, il quadrato della velocità {texRatio(T / T0)} volte: la pressione è <Tex>{`\\dfrac{${texNum(N / N0, 2)} \\cdot ${texNum(T / T0, 2)}}{${texNum(vol / V_FULL, 2)}} = ${texNum(formula, 2)}`}</Tex> volte <Tex>p_0</Tex>.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Molecole N" value={N} min={10} max={80} step={5} onChange={changeN} />
				<Slider label="Volume V" unit="L" value={vol} min={1} max={2} step={0.1} onChange={changeV} />
				<Slider label="Temperatura T" unit="K" value={T} min={100} max={600} step={25} onChange={changeT} />
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

/** A number with exactly d decimals, for <Tex>: 1{,}00. */
const fixed = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

/** A ratio in words-friendly form: 2, 0,5, 1,25. */
function texRatio(x: number) {
	return String(Number(x.toFixed(2))).replace('.', ',');
}
