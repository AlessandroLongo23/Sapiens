'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useFrameLoop, texNum, num, TINT, INK, THIN, THICK, VERY_THIN, DASH } from '../kit';
import { Words } from '../fisica/calore';

/**
 * Chemistry lesson 55 (Il tempo di dimezzamento): a sample of nuclei that decay at random, each with the same
 * probability in every instant (1 − 2^(−Δt/t½) in a time Δt), and beside it the count of the nuclei left, drawn as
 * steps over the curve of the law N = N₀ · (1/2)^(t/t½). Time is measured in half-lives, from 0 to 6.
 *
 * The student picks the size of the sample (16, 100 or 400 nuclei) and starts the decay, or advances it by one
 * half-life at a time. With 16 nuclei the steps wander away from the curve and every run is different; with 400 they
 * stay close to it: the law is statistical. The random draws are made with a seed taken outside the state update,
 * so the update itself is a pure function.
 */

const SIZES = { '16': 4, '100': 10, '400': 20 } as const; // nuclei → side of the grid
type Size = keyof typeof SIZES;
const T_MAX = 6; // half-lives shown
const SECONDS_PER_HALF_LIFE = 2.5;

const BOX = 3.4; // side of the sample's square, cm
const GX = 4.55, GW = 3.3, GH = 3.0; // the graph: origin x, width, height
const f = frame(-0.1, GX + GW + 0.45, -0.75, BOX + 0.35);

type Sim = { alive: boolean[]; t: number; hist: [number, number][] };
const fresh = (n: number): Sim => ({ alive: Array.from({ length: n }, () => true), t: 0, hist: [[0, n]] });

/** mulberry32: a small seeded generator, so that a step of the simulation is a pure function of (state, dt, seed). */
function random(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** The sample after a time dt (in half-lives): every nucleus still there decays with probability 1 − 2^(−dt). */
function advance(s: Sim, dt: number, seed: number): Sim {
	const step = Math.min(dt, T_MAX - s.t);
	if (step <= 0) return s;
	const rnd = random(seed);
	const p = 1 - Math.pow(0.5, step);
	const alive = s.alive.map((a) => a && rnd() >= p);
	const t = Math.min(T_MAX, s.t + step);
	const before = s.hist[s.hist.length - 1][1];
	const left = alive.filter(Boolean).length;
	return { alive, t, hist: left === before && t < T_MAX ? s.hist : [...s.hist, [t, left]] };
}

export default function DimezzamentoCampioneNuclei({ alt }: { alt?: string }) {
	const [size, setSize] = useState<Size>('100');
	const [sim, setSim] = useState<Sim>(() => fresh(100));
	const [running, setRunning] = useState(false);

	const n0 = Number(size);
	const side = SIZES[size];
	const done = sim.t >= T_MAX - 1e-9;
	const left = sim.alive.filter(Boolean).length;
	const expected = n0 * Math.pow(0.5, sim.t);

	useFrameLoop(running && !done, (dt) => {
		const seed = Math.floor(Math.random() * 4294967296);
		setSim((s) => advance(s, dt / SECONDS_PER_HALF_LIFE, seed));
	});

	const choose = (k: Size) => {
		setRunning(false);
		setSize(k);
		setSim(fresh(Number(k)));
	};
	const jump = () => {
		const seed = Math.floor(Math.random() * 4294967296);
		// to the next whole number of half-lives
		setSim((s) => advance(s, Math.floor(s.t + 1e-9) + 1 - s.t, seed));
	};
	const reset = () => {
		setRunning(false);
		setSim(fresh(n0));
	};

	const px = f.W / (f.x1 - f.x0);
	const cell = BOX / side;
	const r = cell * 0.36 * px;

	// the graph
	const gx = (t: number) => GX + (t / T_MAX) * GW;
	const gy = (n: number) => (n / n0) * GH;
	const law = Array.from({ length: 61 }, (_, i) => v(gx(i / 10), gy(n0 * Math.pow(0.5, i / 10))));
	const steps: ReturnType<typeof v>[] = [];
	sim.hist.forEach(([t, n], i) => {
		if (i > 0) steps.push(v(gx(t), gy(sim.hist[i - 1][1])));
		steps.push(v(gx(t), gy(n)));
	});
	steps.push(v(gx(sim.t), gy(left)));

	let caption: string;
	if (sim.t === 0) caption = `Un campione di ${n0} nuclei. Avvia il decadimento: ogni nucleo decade a caso, e la linea arancione conta quelli rimasti. Seguirà la curva tratteggiata della legge?`;
	else if (!done) caption = `Sono passati ${num(sim.t, 1)} tempi di dimezzamento: restano ${left} nuclei su ${n0}, la legge ne prevede ${num(expected, 1)}.`;
	else if (n0 <= 16) caption = `Con ${n0} nuclei il conteggio segue la legge solo da lontano, e ogni prova va in modo diverso: ricomincia e guarda. Poi prova con 400 nuclei.`;
	else if (n0 <= 100) caption = `Con ${n0} nuclei il conteggio segue la curva, con qualche scarto. Prova con 16 nuclei, e poi con 400.`;
	else caption = `Con ${n0} nuclei il conteggio sta quasi sopra la curva. In un campione vero i nuclei sono miliardi di miliardi, e lo scarto non si vede più.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, 0), v(BOX, 0), v(BOX, BOX), v(0, BOX)], true)} fill="none" stroke="#000" strokeWidth={THIN} />
				{sim.alive.map((a, i) => {
					const c = f.px(v((i % side) * cell + cell / 2, BOX - Math.floor(i / side) * cell - cell / 2));
					return <circle key={i} cx={c.x} cy={c.y} r={r} fill={a ? INK.orange : TINT.gray} stroke="#000" strokeWidth={a ? THIN : VERY_THIN} opacity={a ? 1 : 0.7} />;
				})}
				<circle cx={f.px(v(0.15, -0.32)).x} cy={f.px(v(0.15, -0.32)).y} r={5} fill={INK.orange} stroke="#000" strokeWidth={THIN} />
				<Words f={f} at={v(0.35, -0.32)} anchor="start" size={11}>
					non decaduto
				</Words>
				<circle cx={f.px(v(2.05, -0.32)).x} cy={f.px(v(2.05, -0.32)).y} r={5} fill={TINT.gray} stroke="#000" strokeWidth={VERY_THIN} />
				<Words f={f} at={v(2.25, -0.32)} anchor="start" size={11}>
					decaduto
				</Words>

				<path d={f.path([v(GX, GH + 0.25), v(GX, 0), v(GX + GW + 0.2, 0)])} fill="none" stroke="#000" strokeWidth={THIN} />
				{[1, 2, 3, 4, 5, 6].map((k) => (
					<g key={k}>
						<path d={f.path([v(gx(k), 0), v(gx(k), -0.07)])} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(gx(k), -0.25)} size={10}>
							{k}
						</Words>
					</g>
				))}
				<Words f={f} at={v(GX + GW / 2, -0.58)} size={11}>
					tempo, in tempi di dimezzamento
				</Words>
				{[1, 0.5, 0.25].map((k) => (
					<g key={k}>
						<path d={f.path([v(GX, GH * k), v(GX + GW, GH * k)])} stroke="#000" strokeWidth={VERY_THIN} strokeDasharray="1 3" />
						<Words f={f} at={v(GX - 0.08, GH * k)} anchor="end" size={10}>
							{n0 * k}
						</Words>
					</g>
				))}
				<Words f={f} at={v(GX - 0.08, GH + 0.32)} anchor="end" size={11}>
					nuclei
				</Words>
				<path d={f.path(law)} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={f.path(steps)} fill="none" stroke={INK.orange} strokeWidth={THICK * 1.3} strokeLinejoin="round" />
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(sim.t, 1)}\\ t_{1/2}`}</Tex>
				<span>
					rimasti: {left} su {n0}
				</span>
				<span>previsti dalla legge: {num(expected, 1)}</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Numero di nuclei" value={size} onChange={choose} options={(Object.keys(SIZES) as Size[]).map((k) => ({ value: k, label: k }))} />
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={done} onClick={() => setRunning(!running)}>
						{running && !done ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{running && !done ? 'Pausa' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={done} onClick={jump}>
						<StepForward className="size-4" aria-hidden="true" />
						Un tempo di dimezzamento
					</Button>
					<Button variant="secondary" size="sm" disabled={sim.t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
