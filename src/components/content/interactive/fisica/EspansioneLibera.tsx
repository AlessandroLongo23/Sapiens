'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, useFrameLoop, useReducedMotion, THICK, THIN, DASH, TINT } from '../kit';
import { Words } from './calore';
import { Flashes, Molecules, R_MOL, advance, cloneGas, makeGas, rms, setRms, wallPoints, type Gas } from './molecole';

/**
 * Lesson 108 (L'energia interna): Joule's free expansion with the molecules of the model. 0,100 mol of a monatomic
 * gas fill the left half (2,0 L) of an insulated vessel; the right half is empty. "Nel vuoto": the wall between them
 * is removed, the molecules only ever meet walls at rest and keep their speeds, so the temperature and the internal
 * energy U = (3/2) n R T stay the same while the volume doubles and the pressure halves. "Contro un pistone": the wall
 * is a piston that moves back at 0,3 cm/s, a molecule that hits it leaves with v_x → 2u − v_x, slower than it came,
 * and the gas cools (towards T·2^(−2/3), the adiabatic expansion of a later lesson): the energy went to the piston.
 * The temperature shown is read from the molecules' speeds, T₀·(v_qm/v_qm,0)². On the screen 300 K is 2,4 cm/s.
 */

const HALF = 2.6, H = 2.2, D = 1.6; // the left half of the vessel, in cm
const N = 50;
const SCREEN = 2.4;
const U_PISTON = 0.3; // cm/s
const SPREAD = 6; // seconds the free expansion is followed
const MOL = 0.1, R = 8.31;
const BAR_X = 6.15, BAR_W = 0.42, CM_PER_J = 2.2 / 623.25; // the bar of U: 500 K fill the vessel's height

const f = frame(-0.4, 7.0, -0.75, 2.75);
const speedOf = (T: number) => SCREEN * Math.sqrt(T / 300);

type Mode = 'vuoto' | 'pistone';
type Phase = 'start' | 'running' | 'done';
type Sim = { g: Gas; phase: Phase; t: number };

const fresh = (T: number): Sim => ({ g: makeGas(N, { W: HALF, H, D }, speedOf(T), 3), phase: 'start', t: 0 });

function step(prev: Sim, dt: number, mode: Mode): Sim {
	const g = cloneGas(prev.g);
	const t = prev.t + dt;
	if (mode === 'vuoto') {
		g.W = 2 * HALF;
		advance(g, dt);
		return { g, phase: t >= SPREAD ? 'done' : 'running', t };
	}
	const W = Math.min(2 * HALF, g.W + U_PISTON * dt);
	g.W = W;
	advance(g, dt, { u: U_PISTON, elastic: true });
	return { g, phase: W >= 2 * HALF ? 'done' : 'running', t };
}

export default function EspansioneLibera({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('vuoto');
	const [T0, setT0] = useState(300);
	const [sim, setSim] = useState<Sim>(() => fresh(300));
	const reduced = useReducedMotion();
	useFrameLoop(sim.phase === 'running', (dt) => setSim((prev) => step(prev, dt, mode)));

	const go = () => {
		if (sim.phase !== 'start') return setSim(fresh(T0));
		if (!reduced) return setSim((prev) => ({ ...prev, phase: 'running' }));
		// no animation: the end state, the gas spread over the whole vessel and, with the piston, colder
		const g = makeGas(N, { W: 2 * HALF, H, D }, speedOf(T0), 3);
		if (mode === 'pistone') setRms(g, speedOf(T0 * 2 ** (-2 / 3)));
		setSim({ g, phase: 'done', t: 0 });
	};
	const reset = (T: number) => setSim(fresh(T));

	const { g, phase } = sim;
	const T = T0 * (rms(g) / speedOf(T0)) ** 2;
	const U = 1.5 * MOL * R * T;
	const U0 = 1.5 * MOL * R * T0;
	const V = (g.W / HALF) * 2;
	const settled = phase !== 'running' || mode === 'pistone';
	const p = (MOL * R * T) / V; // kPa, with V in litres
	const wallX = g.W + R_MOL;
	const top = H + R_MOL, bottom = -R_MOL;
	const rect = (x: number, y0: number, h: number, fill: string) => {
		const a = f.px(v(x, y0 + h)), b = f.px(v(x + BAR_W, y0));
		return <rect x={a.x} y={a.y} width={b.x - a.x} height={Math.max(0, b.y - a.y)} fill={fill} stroke="#000" strokeWidth={THIN} />;
	};

	let caption: string;
	if (phase === 'start') caption = mode === 'vuoto' ? 'Il gas occupa la metà di sinistra; a destra c’è il vuoto. Togli la parete.' : 'La parete è un pistone che può arretrare. Lascialo andare: il gas lo spinge.';
	else if (mode === 'vuoto') caption = phase === 'running' ? 'Le molecole entrano nel vano vuoto. Urtano solo pareti ferme: nessuna cambia velocità per questo.' : `Volume doppio, pressione dimezzata, ma la temperatura è ancora ${Math.round(T)} K: l’energia interna non è cambiata.`;
	else caption = phase === 'running' ? 'Ogni molecola che urta il pistone che arretra rimbalza più lenta: il gas cede energia al pistone.' : `Il gas ha spinto il pistone e si è raffreddato fino a ${Math.round(T)} K: ha perso ${Math.round(U0 - U)} J di energia interna.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path(wallPoints({ W: 2 * HALF, H }), true)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				{(phase === 'start' || mode === 'pistone') && g.W < 2 * HALF - 0.01 && (
					<path d={f.path([v(wallX, bottom), v(wallX + 0.16, bottom), v(wallX + 0.16, top), v(wallX, top)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				)}
				{g.W < 2 * HALF - 0.6 && (
					<Words f={f} at={v((g.W + 2 * HALF) / 2 + 0.2, H / 2)} size={13}>
						vuoto
					</Words>
				)}
				<Molecules f={f} g={g} />
				<Flashes f={f} g={g} walls={mode === 'pistone' && phase === 'running' ? ['right'] : []} />

				{rect(BAR_X, 0, U * CM_PER_J, TINT.orange)}
				<path d={f.path([v(BAR_X - 0.12, 0), v(BAR_X + BAR_W + 0.12, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(BAR_X - 0.12, U0 * CM_PER_J), v(BAR_X + BAR_W + 0.12, U0 * CM_PER_J)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Words f={f} at={v(BAR_X + BAR_W / 2, -0.35)} size={14}>
					<tspan fontStyle="italic">U</tspan>
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`V = ${V.toFixed(1).replace('.', '{,}')}\\,\\text{L}`}</Tex>
				<Tex>{settled ? `p = ${texNum(p, 0)}\\,\\text{kPa}` : 'p = \\;?'}</Tex>
				<Tex>{`T = ${texNum(T, 0)}\\,\\text{K}`}</Tex>
				<Tex>{`U = \\tfrac{3}{2}\\,nRT = ${texNum(U, 0)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Come si espande il gas"
						options={[
							{ value: 'vuoto', label: 'Nel vuoto' },
							{ value: 'pistone', label: 'Contro un pistone' }
						]}
						value={mode}
						onChange={(x) => {
							setMode(x);
							reset(T0);
						}}
					/>
				</div>
				<Slider
					label="Temperatura iniziale"
					unit="K"
					value={T0}
					min={200}
					max={500}
					step={25}
					onChange={(x) => {
						setT0(x);
						reset(x);
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={phase === 'running'} onClick={go}>
						{phase === 'start' ? <Play className="size-4" aria-hidden="true" /> : <RotateCcw className="size-4" aria-hidden="true" />}
						{phase !== 'start' ? 'Ricomincia' : mode === 'vuoto' ? 'Togli la parete' : 'Lascia andare il pistone'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
