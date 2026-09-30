'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, useFrameLoop, useReducedMotion, THICK, THIN, type V } from '../kit';
import { Liquid, Surface, Vessel, LIQUID } from './liquidi';
import { MATERIALS, Words, heatTint } from './calore';

/**
 * Lesson 69 (Conduzione, convezione e irraggiamento): two bars 20 cm long with a section of 1 cm², each of a material
 * the student picks (copper, iron, stainless steel, glass), between boiling water at 100 °C and water with ice at
 * 0 °C. At the start the bars are at 0 °C. The temperature along each bar follows the heat equation
 * dT/dt = α d²T/dx², α = λ / (ρ c), integrated by hand with an explicit step on 40 cells (as many sub-steps as
 * stability asks); time runs one minute, or ten, per second. The bar's cells take the tint of their temperature, a
 * triangle under the bar marks where it passes 50 °C, and the readout gives the temperature halfway and the heat that
 * reaches the cold end each second, λ S (T at the last cells) / Δx, which grows to λ S ΔT / d once the profile is
 * steady (a straight line from 100 to 0 °C).
 */

type Mat = 'rame' | 'ferro' | 'acciaio' | 'vetro';
const MATS: Mat[] = ['rame', 'ferro', 'acciaio', 'vetro'];
const LABEL: Record<Mat, string> = { rame: 'Rame', ferro: 'Ferro', acciaio: 'Acciaio', vetro: 'Vetro' };

const N = 40; // cells
const LEN = 0.2; // m
const S = 1e-4; // m², 1 cm²
const DX = LEN / N;
const HOT = 100, COLD = 0;
const SPEEDS = { '1': 60, '10': 600 } as const; // simulated seconds per real second
type Speed = keyof typeof SPEEDS;

const BAR = 6; // drawn length, cm
const BH = 0.32;
const Y = [2.35, 0.95]; // bars' lower edges
const f = frame(-1.35, 7.35, -0.2, 3.95);

const alpha = (m: Mat) => MATERIALS[m].lambda / (MATERIALS[m].densita * MATERIALS[m].c);
const steady = (m: Mat) => (MATERIALS[m].lambda * S * (HOT - COLD)) / LEN;
const fresh = () => Array.from({ length: N + 1 }, (_, i) => (i === 0 ? HOT : COLD));

/** One explicit step of dt seconds on the nodes (ends held at HOT and COLD). */
function step(T: number[], a: number, dt: number) {
	const k = (a * dt) / (DX * DX);
	const out = T.slice();
	for (let i = 1; i < N; i++) out[i] = T[i] + k * (T[i - 1] - 2 * T[i] + T[i + 1]);
	return out;
}

/** Advances by `total` seconds in stable sub-steps (k ≤ 0,4). */
function advance(T: number[], a: number, total: number) {
	const n = Math.max(1, Math.ceil(total / ((0.4 * DX * DX) / a)));
	let out = T;
	for (let i = 0; i < n; i++) out = step(out, a, total / n);
	return out;
}

/** Two significant figures, the Italian way (20, 4,0, 0,80, 0,050). */
const sig2 = (x: number) => {
	if (x <= 0) return '0';
	const d = Math.max(0, 1 - Math.floor(Math.log10(x)));
	return x.toFixed(d).replace('.', '{,}');
};

const clock = (s: number) => {
	const m = Math.floor(s / 60);
	if (m < 60) return `${m} min ${String(Math.floor(s % 60)).padStart(2, '0')} s`;
	return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`;
};

function Bar({ y, T, name }: { y: number; T: number[]; name: string }) {
	const w = BAR / N;
	// where the bar passes 50 °C, between the two nodes around it
	let mark: number | null = null;
	for (let i = 0; i < N; i++)
		if (T[i] >= 50 && T[i + 1] < 50) {
			mark = (i + (T[i] - 50) / (T[i] - T[i + 1])) * w;
			break;
		}
	const tri = (x: number): V[] => [v(x, y - 0.06), v(x - 0.11, y - 0.26), v(x + 0.11, y - 0.26)];
	return (
		<g>
			{/* the ends dipped in the baths */}
			<path d={f.path([v(-0.75, y), v(0, y), v(0, y + BH), v(-0.75, y + BH)], true)} fill={heatTint(HOT)} stroke="none" />
			<path d={f.path([v(BAR, y), v(BAR + 0.75, y), v(BAR + 0.75, y + BH), v(BAR, y + BH)], true)} fill={heatTint(COLD)} stroke="none" />
			{T.slice(0, N).map((_, i) => (
				<path key={i} d={f.path([v(i * w, y), v((i + 1) * w + 0.01, y), v((i + 1) * w + 0.01, y + BH), v(i * w, y + BH)], true)} fill={heatTint((T[i] + T[i + 1]) / 2)} stroke="none" />
			))}
			<path d={f.path([v(-0.75, y), v(BAR + 0.75, y), v(BAR + 0.75, y + BH), v(-0.75, y + BH)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
			{mark !== null && mark > w && <path d={f.path(tri(mark), true)} fill="#000" />}
			<Words f={f} at={v(BAR / 2, y + BH + 0.22)} size={13}>
				{name}
			</Words>
		</g>
	);
}

export default function ConduzioneSbarra({ alt }: { alt?: string }) {
	const [mats, setMats] = useState<[Mat, Mat]>(['rame', 'ferro']);
	const [temps, setTemps] = useState<[number[], number[]]>([fresh(), fresh()]);
	const [time, setTime] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [speed, setSpeed] = useState<Speed>('1');
	const reduced = useReducedMotion();

	const reset = (m: [Mat, Mat] = mats) => {
		setPlaying(false);
		setMats(m);
		setTemps([fresh(), fresh()]);
		setTime(0);
	};

	useFrameLoop(playing, (dt) => {
		const sim = dt * SPEEDS[speed];
		setTemps(([a, b]) => [advance(a, alpha(mats[0]), sim), advance(b, alpha(mats[1]), sim)]);
		setTime((x) => x + sim);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) {
			// no animation: jump twenty minutes ahead
			const [a, b] = temps;
			setTemps([advance(a, alpha(mats[0]), 1200), advance(b, alpha(mats[1]), 1200)]);
			setTime((x) => x + 1200);
			return;
		}
		setPlaying(true);
	};

	const flux = (i: 0 | 1) => (MATERIALS[mats[i]].lambda * S * (temps[i][N - 1] - temps[i][N])) / DX;
	const half = (i: 0 | 1) => temps[i][N / 2];
	const settled = (i: 0 | 1) => Math.abs(flux(i) - steady(mats[i])) < 0.02 * steady(mats[i]);

	let caption: string;
	if (time === 0) caption = 'Le sbarre sono a 0 °C. Premi Avvia: il calore entra dall’estremità nell’acqua che bolle e avanza verso il ghiaccio. Il triangolo segna fin dove la sbarra ha superato 50 °C.';
	else if (settled(0) && settled(1)) caption = 'Tutte e due le sbarre hanno raggiunto il profilo stabile: la temperatura scende in modo uniforme da 100 a 0 °C, e ogni secondo passa il calore dato dalla legge della conduzione.';
	else {
		const faster = alpha(mats[0]) >= alpha(mats[1]) ? 0 : 1;
		caption = mats[0] === mats[1] ? 'Le due sbarre sono dello stesso materiale: si scaldano allo stesso modo.' : `Il calore avanza più in fretta nella sbarra di ${MATERIALS[mats[faster]].nome}. ${settled(faster) ? 'Quella è già arrivata al profilo stabile.' : ''}`;
	}

	const bath = (x0: number, x1: number, fill: string, text: string) => (
		<>
			<Liquid f={f} pts={[v(x0, 0.2), v(x1, 0.2), v(x1, 3.3), v(x0, 3.3)]} fill={fill} />
			<Surface f={f} from={v(x0, 3.3)} to={v(x1, 3.3)} />
			<Vessel f={f} pts={[v(x0, 3.7), v(x0, 0.2), v(x1, 0.2), v(x1, 3.7)]} />
			<Words f={f} at={v((x0 + x1) / 2, 3.85)} size={12}>
				{text}
			</Words>
		</>
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{bath(-1.2, -0.25, heatTint(HOT, 0, 100), '100 °C')}
				{bath(BAR + 0.25, BAR + 1.2, LIQUID.acqua, '0 °C')}
				{/* ice cubes in the cold bath */}
				{[v(BAR + 0.35, 2.95), v(BAR + 0.7, 3.0), v(BAR + 0.5, 1.6)].map((p, i) => (
					<path key={i} d={f.path([p, v(p.x + 0.26, p.y), v(p.x + 0.26, p.y + 0.24), v(p.x, p.y + 0.24)], true)} fill="#fff" stroke="#000" strokeWidth={THIN} />
				))}
				<Bar y={Y[0]} T={temps[0]} name={MATERIALS[mats[0]].nome} />
				<Bar y={Y[1]} T={temps[1]} name={MATERIALS[mats[1]].nome} />
				<path d={f.path([v(0, 0.35), v(BAR, 0.35)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0, 0.27), v(0, 0.43)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(BAR, 0.27), v(BAR, 0.43)])} stroke="#000" strokeWidth={THIN} />
				<Words f={f} at={v(BAR / 2, 0.35)} dy="1.05em" size={12}>
					20 cm
				</Words>
			</Drawing>

			<Readout>
				<span>tempo {clock(time)}</span>
				{([0, 1] as const).map((i) => (
					<span key={i}>
						{MATERIALS[mats[i]].nome}: <Tex>{`t_{metà} = ${texNum(half(i), 1)}\\,^\\circ\\text{C}`}</Tex>, <Tex>{`Q/\\Delta t = ${sig2(flux(i))}\\,\\text{W}`}</Tex>
					</span>
				))}
			</Readout>
			<Readout>
				{([0, 1] as const).map((i) => (
					<span key={i}>
						a regime, {MATERIALS[mats[i]].nome}: <Tex>{`\\lambda\\,\\dfrac{S\\,\\Delta T}{d} = ${sig2(steady(mats[i]))}\\,\\text{W}`}</Tex>
					</span>
				))}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				{([0, 1] as const).map((i) => (
					<div key={i} className="flex flex-col items-center gap-1">
						<span className="text-sm text-fg-muted">{i === 0 ? 'Sbarra di sopra' : 'Sbarra di sotto'}</span>
						<ToggleGroup
							label={`Materiale della sbarra ${i === 0 ? 'di sopra' : 'di sotto'}`}
							options={MATS.map((k) => ({ value: k, label: LABEL[k] }))}
							value={mats[i]}
							onChange={(m) => reset(i === 0 ? [m, mats[1]] : [mats[0], m])}
						/>
					</div>
				))}
				<div className="flex justify-center">
					<ToggleGroup label="Velocità del tempo" options={[{ value: '1' as Speed, label: '1 minuto al secondo' }, { value: '10' as Speed, label: '10 minuti al secondo' }]} value={speed} onChange={setSpeed} />
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : time > 0 ? 'Continua' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={time === 0} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
