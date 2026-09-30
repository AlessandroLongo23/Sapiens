'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, clamp, useFrameLoop, useReducedMotion, THICK, THIN, DASH, INK, TINT, type V } from '../kit';
import { Axes } from '../fisica';
import { Piston } from '../fisica/liquidi';
import { Ticks, Words, heatTint } from '../fisica/calore';
import { Gauge, particle, step, type Particle, type Wall } from './gas';

/**
 * Chemistry lessons 31, 32 and 34 (Boyle, Charles e Gay-Lussac, Avogadro): a gas in a vertical cylinder closed by a
 * piston, with a gauge on its side and a small graph next to it. The student picks what stays constant:
 *
 * - the temperature (Boyle): the piston is moved by hand (slider or its handle) and p = N k T / V; the graph is p
 *   against V, with the isotherm p V = const;
 * - the volume (Gay-Lussac): the piston is held by two stops, the temperature slider changes p = N k T / V; the graph
 *   is p against T, a line through the origin (dashed below 150 K, where no gas stays a gas);
 * - the pressure (Charles, and Avogadro with the particles' slider): the piston is free and carries a weight, and
 *   V = N k T / p; the graph is V against T.
 *
 * The number of particles N (10 to 60) can change in every mode. The constant k = 1 atm · 2 L / (30 · 300 K), so the
 * starting state is 30 particles, 300 K, 2,0 L and 1,00 atm. Changing mode starts again from there, which keeps every
 * state inside the drawing (V from 0,5 to 5 L, p up to 5 atm).
 *
 * The particles are drawn as they are counted: N discs moving in straight lines, with speeds drawn from the Maxwell
 * distribution whose mean goes as √T, bouncing off the walls (no collisions between them: in the ideal gas they do
 * not matter for the pressure). Each hit on a wall leaves a short red mark that fades: more marks, more pressure. The
 * values shown come from the formula, not from counting the hits, which would be noisy. With reduced motion the
 * particles stand still.
 */

export type Costante = 'T' | 'V' | 'p';

const K_GAS = (1 * 2) / (30 * 300); // atm · L / K per particle
const N0 = 30, T0 = 300, V0 = 2, P0 = 1;
const V_MIN = 0.5, V_MAX = 5, P_MAX = 5, T_MIN = 150, T_MAX = 600, N_MIN = 10, N_MAX = 60;

// Drawing, in TikZ centimetres: the cylinder's inside from x = 0 to 2, bottom at y = 0; 0,7 cm per litre.
const CW = 2;
const HV = 0.7;
const TOP = V_MAX * HV + 0.75; // the walls' top
const R = 0.055; // a particle's radius
const MEAN0 = 2.4; // mean speed at 300 K, cm/s of the drawing
const GAUGE: V = v(-1.15, 1.0);
const G0: V = v(3.55, 0.45); // the graph's origin
const GL = 3.0; // the graph's side
const f = frame(-2.0, 7.2, -0.8, TOP + 0.35);

const HIT_LIFE = 0.35; // seconds a hit's mark lasts

const mean = (T: number) => MEAN0 * Math.sqrt(T / T0);
const box = (h: number) => ({ x0: 0, x1: CW, y0: 0, y1: h });

type Hit = { x: number; y: number; wall: Wall; age: number };

/** x with exactly d decimals, the Italian way: 1 → "1,00"; `tx` writes the comma as {,} for KaTeX. */
const fx = (x: number, d: number) => x.toFixed(d).replace('.', ',');
const tx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

/** "3{,}33 \cdot 10^{-3}" for a small ratio, three significant figures. */
function sci(x: number) {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toFixed(2));
	if (m >= 10) {
		m /= 10;
		e += 1;
	}
	return `${tx(m, 2)} \\cdot 10^{${e}}`;
}

export default function GasCilindro({ alt, costante = 'T' }: { alt?: string; costante?: Costante }) {
	const [mode, setMode] = useState<Costante>(costante);
	const [N, setNState] = useState(N0);
	const [T, setTState] = useState(T0);
	const [Vset, setVset] = useState(V0);
	const reduced = useReducedMotion();

	const V = mode === 'p' ? (N * K_GAS * T) / P0 : Vset;
	const p = mode === 'p' ? P0 : (N * K_GAS * T) / V;
	const h = V * HV;

	// The particles and the fading marks of their hits, advanced by hand on every frame.
	const [sim, setSim] = useState<{ parts: Particle[]; hits: Hit[] }>(() => ({ parts: Array.from({ length: N0 }, () => particle(box(V0 * HV), R, mean(T0))), hits: [] }));

	useFrameLoop(!reduced, (dt) => {
		const b = box(h);
		setSim((s) => {
			const parts = s.parts.map((q) => ({ ...q }));
			const hits = s.hits.map((q) => ({ ...q, age: q.age + dt })).filter((q) => q.age < HIT_LIFE);
			for (const q of parts) {
				const wall = step(q, b, R, dt);
				if (wall && hits.length < 80) hits.push({ x: q.x, y: q.y, wall, age: 0 });
			}
			return { parts, hits };
		});
	});
	const rescale = (k: number) => setSim((s) => ({ ...s, parts: s.parts.map((q) => ({ ...q, vx: q.vx * k, vy: q.vy * k })) }));

	// Ranges that keep the state inside the drawing.
	const vLo = Math.max(V_MIN, Math.ceil(((N * K_GAS * T) / P_MAX) * 10) / 10);
	const nHiBoyle = Math.min(N_MAX, Math.floor((P_MAX * V) / (K_GAS * T)));
	const tLoP = Math.max(T_MIN, Math.ceil((V_MIN * P0) / (N * K_GAS) / 10) * 10);
	const tHiP = Math.min(T_MAX, Math.floor((V_MAX * P0) / (N * K_GAS) / 10) * 10);
	const nLoP = Math.max(N_MIN, Math.ceil((V_MIN * P0) / (K_GAS * T)));
	const nHiP = Math.min(N_MAX, Math.floor((V_MAX * P0) / (K_GAS * T)));

	const setT = (x: number) => {
		const next = clamp(x, T_MIN, T_MAX);
		rescale(Math.sqrt(next / T));
		setTState(next);
	};
	const setN = (x: number) => {
		const next = Math.round(x);
		const b = box(h);
		setSim((s) => ({ ...s, parts: s.parts.length >= next ? s.parts.slice(0, next) : [...s.parts, ...Array.from({ length: next - s.parts.length }, () => particle(b, R, mean(T)))] }));
		setNState(next);
	};
	const reset = (m: Costante) => {
		rescale(Math.sqrt(T0 / T));
		setMode(m);
		setTState(T0);
		setVset(V0);
		setN(N0);
	};

	// The graph: what it plots in this mode, and the current state on it.
	const gx = (x: number, max: number) => G0.x + (x / max) * GL;
	const gy = (y: number, max: number) => G0.y + (y / max) * GL;
	let curve: V[] = [];
	let dashed: V[] = [];
	let point: V;
	let xName: string, xUnit: string, yName: string, yUnit: string;
	let xTicks: number[], xMax: number;
	if (mode === 'T') {
		const C = N * K_GAS * T; // p V
		const from = Math.max(C / P_MAX, 0.2);
		curve = Array.from({ length: 61 }, (_, i) => from + ((V_MAX - from) * i) / 60).map((x) => v(gx(x, V_MAX), gy(C / x, P_MAX)));
		point = v(gx(V, V_MAX), gy(p, P_MAX));
		[xName, xUnit, yName, yUnit, xTicks, xMax] = ['V', 'L', 'p', 'atm', [1, 2, 3, 4, 5], V_MAX];
	} else {
		const slope = mode === 'V' ? (N * K_GAS) / V : (N * K_GAS) / P0; // p/T or V/T
		const yMax = mode === 'V' ? P_MAX : V_MAX;
		const end = Math.min(T_MAX, yMax / slope);
		dashed = [v(gx(0, T_MAX), gy(0, yMax)), v(gx(T_MIN, T_MAX), gy(slope * T_MIN, yMax))];
		curve = [v(gx(T_MIN, T_MAX), gy(slope * T_MIN, yMax)), v(gx(end, T_MAX), gy(slope * end, yMax))];
		point = v(gx(T, T_MAX), gy(mode === 'V' ? p : V, yMax));
		[xName, xUnit, yName, yUnit, xTicks, xMax] = ['T', 'K', mode === 'V' ? 'p' : 'V', mode === 'V' ? 'atm' : 'L', [200, 400, 600], T_MAX];
	}
	const yTicks = [1, 2, 3, 4, 5];

	// Hits: a short mark on the wall that was hit.
	const marks = sim.hits.map((q, i) => {
		const a = q.wall === 'x0' || q.wall === 'x1' ? v(q.wall === 'x0' ? 0 : CW, q.y - 0.09) : v(q.x - 0.09, q.wall === 'y0' ? 0 : h);
		const b = q.wall === 'x0' || q.wall === 'x1' ? v(a.x, q.y + 0.09) : v(q.x + 0.09, a.y);
		return <path key={i} d={f.path([a, b])} stroke={INK.red} strokeWidth={2.2} opacity={1 - q.age / HIT_LIFE} />;
	});

	let caption: string;
	if (mode === 'T') caption = `Temperatura costante, ${T0} K: sposta il pistone. Con meno volume le particelle urtano le pareti più spesso e la pressione cresce, ma il prodotto p·V resta ${fx(p * V, 2)} atm·L finché non cambi il numero di particelle.`;
	else if (mode === 'V') caption = `Volume costante, ${fx(V, 1)} L: il pistone è bloccato. Scaldando, le particelle urtano più spesso e più forte, e la pressione cresce in proporzione alla temperatura assoluta.`;
	else caption = `Pressione costante, ${fx(P0, 2)} atm: il pistone è libero e porta un peso. Se scaldi il gas o aggiungi particelle, il pistone sale finché la pressione torna quella di prima: il volume cresce in proporzione.`;

	const ratio =
		mode === 'T'
			? `p \\cdot V = ${tx(p * V, 2)}\\,\\text{atm} \\cdot \\text{L}`
			: mode === 'V'
				? `p/T = ${sci(p / T)}\\,\\text{atm/K}`
				: `V/T = ${sci(V / T)}\\,\\text{L/K}`;

	const rodTop = h + 0.2 + 0.55;
	const pistonColor = heatTint(T, T_MIN, T_MAX);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* gas and particles */}
				<path d={f.path([v(0, 0), v(CW, 0), v(CW, h), v(0, h)], true)} fill={pistonColor} />
				{sim.parts.map((q, i) => {
					const c = f.px(v(q.x, q.y));
					return <circle key={i} cx={c.x} cy={c.y} r={R * (f.W / (f.x1 - f.x0))} fill={INK.blue} opacity={0.8} />;
				})}
				{marks}
				{/* cylinder */}
				<path d={f.path([v(0, TOP), v(0, 0), v(CW, 0), v(CW, TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<Piston f={f} x0={0} x1={CW} y={h} h={0.2} />
				{mode === 'T' && (
					<>
						<path d={f.path([v(CW / 2, h + 0.2), v(CW / 2, rodTop)])} stroke="#000" strokeWidth={THICK} />
						<Handle f={f} at={v(CW / 2, rodTop)} label="Pistone" step={0.1 * HV} onMove={(q) => setVset(clamp(Math.round(((q.y - 0.75) / HV) * 10) / 10, vLo, V_MAX))} />
					</>
				)}
				{mode === 'V' && (
					<>
						<path d={f.path([v(0, h + 0.2), v(0.2, h + 0.2), v(0.2, h + 0.36), v(0, h + 0.36)], true)} fill="#666" stroke="#000" strokeWidth={THIN} />
						<path d={f.path([v(CW, h + 0.2), v(CW - 0.2, h + 0.2), v(CW - 0.2, h + 0.36), v(CW, h + 0.36)], true)} fill="#666" stroke="#000" strokeWidth={THIN} />
					</>
				)}
				{mode === 'p' && (
					<>
						<path d={f.path([v(0.45, h + 0.2), v(CW - 0.45, h + 0.2), v(CW - 0.45, h + 0.62), v(0.45, h + 0.62)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
						<Words f={f} at={v(CW / 2, h + 0.41)} size={10}>
							peso
						</Words>
					</>
				)}
				{/* gauge and its tube */}
				<path d={f.path([v(GAUGE.x + 0.66, GAUGE.y + 0.05), v(0, GAUGE.y + 0.05)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(GAUGE.x + 0.66, GAUGE.y - 0.05), v(0, GAUGE.y - 0.05)])} stroke="#000" strokeWidth={THIN} />
				<Gauge f={f} at={GAUGE} r={0.7} value={p} max={P_MAX} every={1} minor={0.5} unit="atm" />

				{/* graph */}
				<Axes f={f} o={G0} x0={G0.x} x1={G0.x + GL + 0.35} y0={G0.y} y1={G0.y + GL + 0.35} xName="" yName="" />
				<Ticks f={f} o={G0} xs={xTicks.map((x) => gx(x, xMax))} xl={xTicks.map(String)} ys={yTicks.map((y) => gy(y, 5))} yl={yTicks.map(String)} size={10} />
				<Words f={f} at={v(G0.x + GL + 0.4, G0.y - 0.5)} anchor="end" size={11}>
					<tspan fontStyle="italic">{xName}</tspan> ({xUnit})
				</Words>
				<Words f={f} at={v(G0.x + 0.1, G0.y + GL + 0.55)} anchor="start" size={11}>
					<tspan fontStyle="italic">{yName}</tspan> ({yUnit})
				</Words>
				{dashed.length > 0 && <path d={f.path(dashed)} stroke="#6666ff" strokeWidth={THICK} strokeDasharray={DASH} fill="none" />}
				<path d={f.path(curve)} stroke="#6666ff" strokeWidth={THICK} fill="none" />
				<circle cx={f.px(point).x} cy={f.px(point).y} r={3.4} fill={INK.orange} />
			</Drawing>

			<Readout>
				<Tex>{`p = ${tx(p, 2)}\\,\\text{atm}`}</Tex>
				<Tex>{`V = ${tx(V, 2)}\\,\\text{L}`}</Tex>
				<Tex>{`T = ${Math.round(T)}\\,\\text{K}`}</Tex>
				<span>{N} particelle</span>
				<Tex>{ratio}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Grandezza tenuta costante"
						options={[
							{ value: 'T', label: 'T costante' },
							{ value: 'V', label: 'V costante' },
							{ value: 'p', label: 'p costante' },
						]}
						value={mode}
						onChange={(m) => reset(m)}
					/>
				</div>
				{mode === 'T' ? (
					<Slider label="Volume V" unit="L" value={V} min={vLo} max={V_MAX} step={0.1} onChange={(x) => setVset(clamp(x, vLo, V_MAX))} />
				) : (
					<Slider label="Temperatura T" unit="K" value={T} min={mode === 'p' ? tLoP : T_MIN} max={mode === 'p' ? tHiP : T_MAX} step={10} onChange={setT} />
				)}
				<Slider label="Particelle" value={N} min={mode === 'p' ? nLoP : N_MIN} max={mode === 'p' ? nHiP : mode === 'T' ? nHiBoyle : N_MAX} step={1} onChange={setN} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => reset(mode)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
