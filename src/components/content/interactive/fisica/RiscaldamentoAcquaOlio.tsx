'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useFrameLoop, useReducedMotion, THICK, THIN, TINT, INK, FONT, type V } from '../kit';
import { LIQUID, Liquid, Surface, Vessel, QuantityText } from './liquidi';

/**
 * Lesson 67 (Calore, capacità termica e calore specifico): two equal pots on two equal stoves, one with 0,50 kg of
 * water and one with 0,50 kg of olive oil, which fills a little more of its pot (density 920 kg/m³, lesson 03). Each
 * stove gives its pot 200 J every second, all of it to the liquid (the pots' own heat capacity is left out). The student
 * plays the time or moves it, 0 to 6 minutes: the temperatures rise at steady rates, ΔT = P t / (c m), 0,096 °C/s for
 * the water (c = 4186) and 0,203 °C/s for the oil (c = 1970), and a temperature-time graph under the pots draws both
 * lines. After 6 minutes both have had 72 kJ; the water is at 54 °C, the oil at 93 °C. The temperature is T, since the
 * time t is in the same formulas (docs/lezioni/fisica/README.md, "Notazioni del secondo anno").
 */

const P = 200; // W, to each pot
const M = 0.5; // kg
const C_W = 4186, C_O = 1970;
const T0 = 20;
const END = 360; // s
const PACE = 30; // s of the experiment per second of animation
const rateW = P / (C_W * M), rateO = P / (C_O * M);

// graph: origin, cm per second, cm per degree
const G0 = v(0.7, 0);
const GX = 4.2 / END;
const GY = 2.1 / 100;
const g = (t: number, T: number): V => v(G0.x + t * GX, G0.y + T * GY);

const POT_W = 1.7, POT_H = 1.45, BASE = 3.45;
const POTS = { acqua: 0.5, olio: 3.45 } as const;
const f = frame(-0.35, 5.85, -0.75, BASE + POT_H + 0.9);
const BLUE = INK.blue;
const OIL = '#b36b00';

function Stove({ x, on }: { x: number; on: boolean }) {
	const flames = [0.35, 0.85, 1.35];
	return (
		<g pointerEvents="none">
			<path d={f.path([v(x - 0.1, BASE - 0.44), v(x + POT_W + 0.1, BASE - 0.44), v(x + POT_W + 0.1, BASE - 0.27), v(x - 0.1, BASE - 0.27)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			{on &&
				flames.map((dx) => {
					const b = v(x + dx, BASE - 0.26);
					return <path key={dx} d={f.path([v(b.x - 0.1, b.y), v(b.x, b.y + 0.24), v(b.x + 0.1, b.y)], true)} fill={TINT.orange} stroke={INK.orange} strokeWidth={THIN} />;
				})}
		</g>
	);
}

function Pot({ x, level, fill, T, name }: { x: number; level: number; fill: string; T: number; name: string }) {
	const top = BASE + level;
	const tx = x + POT_W - 0.3;
	const col = BASE + 0.25 + (Math.min(T, 110) / 110) * (POT_H + 0.25);
	return (
		<g pointerEvents="none">
			<Liquid f={f} pts={[v(x, BASE), v(x + POT_W, BASE), v(x + POT_W, top), v(x, top)]} fill={fill} />
			<Surface f={f} from={v(x, top)} to={v(x + POT_W, top)} />
			<Vessel f={f} pts={[v(x, BASE + POT_H), v(x, BASE), v(x + POT_W, BASE), v(x + POT_W, BASE + POT_H)]} />
			{/* the thermometer */}
			<circle cx={f.px(v(tx, BASE + 0.18)).x} cy={f.px(v(tx, BASE + 0.18)).y} r={3.4} fill="#ff8080" />
			<path d={f.path([v(tx, BASE + 0.18), v(tx, col)])} stroke="#ff8080" strokeWidth={2.2} />
			<path d={f.path([v(tx - 0.06, BASE + 0.24), v(tx - 0.06, BASE + POT_H + 0.3), v(tx + 0.06, BASE + POT_H + 0.3), v(tx + 0.06, BASE + 0.24)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<QuantityText f={f} at={v(x + POT_W / 2, BASE + POT_H + 0.62)} text={`${name} ${num(T, 1)} °C`} size={12} />
			<QuantityText f={f} at={v(x + POT_W / 2 - 0.15, BASE + 0.45)} text="0,50 kg" size={11} />
		</g>
	);
}

export default function RiscaldamentoAcquaOlio({ alt }: { alt?: string }) {
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = Math.min(END, t + dt * PACE);
		setT(next);
		if (next >= END) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(END);
		if (t >= END) setT(0);
		setPlaying(true);
	};

	const Tw = T0 + rateW * t, To = T0 + rateO * t;
	const Q = P * t;
	const ticksX = [0, 60, 120, 180, 240, 300, 360];
	const ticksY = [20, 40, 60, 80, 100];
	const line = (rate: number) => f.path([g(0, T0), g(t, T0 + rate * t)]);
	const label = (at: V, s: string, anchor: 'start' | 'middle' | 'end' = 'middle') => {
		const p = f.px(at);
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={11} fontFamily={FONT} fill="#000" pointerEvents="none">
				{s}
			</text>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Stove x={POTS.acqua} on={t > 0 && t < END ? true : playing} />
				<Stove x={POTS.olio} on={t > 0 && t < END ? true : playing} />
				<Pot x={POTS.acqua} level={0.72} fill={LIQUID.acqua} T={Tw} name="acqua" />
				<Pot x={POTS.olio} level={0.72 * (1000 / 920)} fill={LIQUID.olio} T={To} name="olio" />

				{/* the graph */}
				{ticksY.map((T) => (
					<path key={T} d={f.path([g(0, T), g(END, T)])} stroke="#bfbfbf" strokeWidth={0.3} pointerEvents="none" />
				))}
				{ticksX.slice(1).map((s) => (
					<path key={s} d={f.path([g(s, 0), g(s, 100)])} stroke="#bfbfbf" strokeWidth={0.3} pointerEvents="none" />
				))}
				<path d={f.path([g(0, 0), g(END, 0)])} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
				<path d={f.path([g(0, 0), g(0, 108)])} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
				{ticksX.map((s) => <g key={s}>{label(v(g(s, 0).x, -0.25), String(s / 60))}</g>)}
				{label(v(g(END, 0).x + 0.15, -0.55), 't (min)', 'end')}
				{[0, ...ticksY].map((T) => <g key={T}>{label(v(G0.x - 0.12, g(0, T).y), String(T), 'end')}</g>)}
				{label(v(G0.x - 0.12, g(0, 108).y + 0.2), 'T (°C)', 'start')}
				{t > 0 && (
					<>
						<path d={line(rateW)} stroke={BLUE} strokeWidth={THICK} fill="none" pointerEvents="none" />
						<path d={line(rateO)} stroke={OIL} strokeWidth={THICK} fill="none" pointerEvents="none" />
					</>
				)}
				<circle cx={f.px(g(t, Tw)).x} cy={f.px(g(t, Tw)).y} r={3} fill={BLUE} pointerEvents="none" />
				<circle cx={f.px(g(t, To)).x} cy={f.px(g(t, To)).y} r={3} fill={OIL} pointerEvents="none" />
				{label(v(g(t, To).x + 0.12, g(t, To).y + 0.12), 'olio', 'start')}
				{label(v(g(t, Tw).x + 0.12, g(t, Tw).y - 0.14), 'acqua', 'start')}
			</Drawing>

			<Readout>
				<span>
					<Tex>{`t = ${Math.round(t)}\\,\\text{s}`}</Tex>
				</span>
				<Tex>{`Q = P\\,t = ${texNum(Q / 1000, 1)}\\,\\text{kJ}`}</Tex>
				<Tex>{`T_{acqua} = ${texNum(Tw, 1)}\\,^\\circ\\text{C}`}</Tex>
				<Tex>{`T_{olio} = ${texNum(To, 1)}\\,^\\circ\\text{C}`}</Tex>
			</Readout>
			<Caption>
				{t === 0
					? 'Acqua e olio partono da 20 °C. Avvia i fornelli: ogni pentolino riceve 200 J al secondo.'
					: `Tutti e due hanno ricevuto ${num(Q / 1000, 1)} kJ. L'acqua è salita di ${num(Tw - T0, 1)} °C, l'olio di ${num(To - T0, 1)} °C: ${num((To - T0) / (Tw - T0), 2)} volte tanto, come 4186 diviso 1970.`}
			</Caption>

			<Controls>
				<Slider label="Tempo (s)" value={Math.round(t)} min={0} max={END} step={5} onChange={(x) => { setPlaying(false); setT(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= END ? 'Riparti' : 'Accendi i fornelli'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
