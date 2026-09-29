'use client';

import { useState } from 'react';
import { RotateCcw, ChevronsLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, Tex, Handle, frame, v, add, polar, clamp, useTween, num, texNum, THICK, THIN, INK, TINT, type V } from '../kit';

/**
 * Physics lesson 12 (Proporzionalità inversa e quadratica), example 1: a closed syringe full of air with a pressure
 * gauge on its tip. The student moves the plunger (slider or drag) and the volume goes from 20 to 60 cm³; the
 * pressure is p = 3000 / V kPa (Boyle's law, the lesson's constant 3,0 · 10³ kPa · cm³), shown by the gauge's needle
 * and under the drawing, with the product p · V, which stays 3000. The air's dots crowd together as the volume
 * shrinks. "Dimezza il volume" halves it with an animation, to see the pressure double.
 */

const K = 3000;
const V_MIN = 20;
const V_MAX = 60;
/** Drawing centimetres per cm³ along the barrel. */
const S = 1 / 12;
const R = 0.5; // half the barrel's height
const GAUGE: V = v(-1.35, 0);
const GAUGE_R = 0.8;
const P_MAX = 200;
/** The gauge's scale: 0 kPa at 225°, P_MAX at −45°, clockwise. */
const needleAngle = (p: number) => ((225 - (270 * p) / P_MAX) * Math.PI) / 180;

const f = frame(-2.3, 6.35, -1.25, 1.15);

/** Fixed places for the air's dots, as fractions of the gas column (x) and of the barrel's height (y). */
const frac = (x: number) => x - Math.floor(x);
const DOTS = Array.from({ length: 26 }, (_, i) => v(frac(Math.sin(i * 12.9898 + 1) * 43758.5453) * 0.92 + 0.04, frac(Math.sin(i * 78.233 + 2) * 12543.853) * 0.8 + 0.1));

export default function SiringaPressione({ alt }: { alt?: string }) {
	const [V, go] = useTween(V_MAX, 700);
	const [busy, setBusy] = useState(false);
	const p = K / V;
	const xp = V * S; // the plunger's face

	const setV = (x: number) => void go(clamp(Math.round(x), V_MIN, V_MAX), 0);
	const halve = async () => {
		setBusy(true);
		await go(Math.max(V_MIN, Math.round(V / 2)));
		setBusy(false);
	};

	const ticks: string[] = [];
	for (let c = 0; c <= V_MAX; c += 5) ticks.push(f.path([v(c * S, R), v(c * S, R + (c % 10 === 0 ? 0.16 : 0.09))]));
	const gaugeTicks: string[] = [];
	for (let q = 0; q <= P_MAX; q += 20) {
		const t = needleAngle(q);
		gaugeTicks.push(f.path([add(GAUGE, polar(GAUGE_R - (q % 100 === 0 ? 0.2 : 0.12), t)), add(GAUGE, polar(GAUGE_R, t))]));
	}
	const round = (x: number) => (Math.abs(x - Math.round(x)) < 0.05 ? String(Math.round(x)) : num(x, 1));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* gas */}
				<path d={f.path([v(0, -R), v(xp, -R), v(xp, R), v(0, R)], true)} fill={TINT.blue} />
				{DOTS.map((d, i) => {
					const q = f.px(v(d.x * xp, -R + d.y * 2 * R));
					return <circle key={i} cx={q.x} cy={q.y} r={1.6} fill={INK.blue} opacity={0.7} />;
				})}
				{/* barrel, nozzle and tube to the gauge */}
				<path d={f.path([v(0, R), v(V_MAX * S + 0.35, R)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(0, -R), v(V_MAX * S + 0.35, -R)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(0, R), v(0, 0.1)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(0, -R), v(0, -0.1)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(0, 0.1), v(GAUGE.x + GAUGE_R * 0.97, 0.1)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0, -0.1), v(GAUGE.x + GAUGE_R * 0.97, -0.1)])} stroke="#000" strokeWidth={THIN} />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} />
				{[20, 40, 60].map((c) => (
					<Label key={c} f={f} at={v(c * S, R + 0.1)} dir={v(0, 1)} upright size={11}>
						{c}
					</Label>
				))}
				{/* plunger and rod */}
				<path d={f.path([v(xp, -R + 0.03), v(xp + 0.16, -R + 0.03), v(xp + 0.16, R - 0.03), v(xp, R - 0.03)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(xp + 0.16, -0.08), v(xp + 1.0, -0.08), v(xp + 1.0, 0.08), v(xp + 0.16, 0.08)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(xp + 1.0, -0.45), v(xp + 1.1, -0.45), v(xp + 1.1, 0.45), v(xp + 1.0, 0.45)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				{/* gauge */}
				<circle cx={f.px(GAUGE).x} cy={f.px(GAUGE).y} r={GAUGE_R * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={gaugeTicks.join(' ')} stroke="#000" strokeWidth={THIN} />
				{[0, 100, 200].map((q) => (
					<Label key={q} f={f} at={add(GAUGE, polar(GAUGE_R - 0.4, needleAngle(q)))} upright size={9}>
						{q}
					</Label>
				))}
				<Label f={f} at={v(GAUGE.x, GAUGE.y - 0.6)} upright size={9}>
					kPa
				</Label>
				<path d={f.path([GAUGE, add(GAUGE, polar(GAUGE_R - 0.14, needleAngle(p)))])} stroke={INK.red} strokeWidth={THICK} strokeLinecap="round" />
				<circle cx={f.px(GAUGE).x} cy={f.px(GAUGE).y} r={2} fill="#000" />
				<Handle f={f} at={v(xp + 1.05, 0)} label="Stantuffo" onMove={(q) => setV((q.x - 1.05) / S)} step={S} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`V = ${round(V)}\\ \\text{cm}^3`}</Tex>
				</span>
				<span>
					<Tex>{`p = ${texNum(p, 0)}\\ \\text{kPa}`}</Tex>
				</span>
				<span>
					<Tex>{`p \\cdot V = ${K}\\ \\text{kPa} \\cdot \\text{cm}^3`}</Tex>
				</span>
			</Readout>
			<Caption>
				{V >= V_MAX - 0.01 ? (
					'Sposta lo stantuffo verso sinistra: l’aria si comprime e la pressione cresce.'
				) : (
					<>
						Rispetto a <Tex>{'60\\ \\text{cm}^3'}</Tex> il volume è diviso per {round(V_MAX / V)} e la pressione è moltiplicata per {round(p / (K / V_MAX))}: da 50 kPa a {texNum(p, 0).replace('{,}', ',')} kPa.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Volume" unit="cm³" value={Math.round(V)} min={V_MIN} max={V_MAX} step={1} onChange={setV} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={busy || V / 2 < V_MIN - 0.01} onClick={halve}>
						<ChevronsLeft className="size-4" aria-hidden="true" />
						Dimezza il volume
					</Button>
					<Button variant="secondary" size="sm" disabled={busy || V >= V_MAX - 0.01} onClick={() => void go(V_MAX)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna a 60 cm³
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
