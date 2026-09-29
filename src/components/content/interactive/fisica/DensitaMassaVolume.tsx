'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Dot, frame, v, add, THICK, THIN, DASH, TINT, INK, FONT, type V } from '../kit';
import { Axes } from '../fisica';

/**
 * Lesson "Grandezze derivate: area, volume e densità", the mass-volume graph: a cube of the chosen material grows
 * with the volume slider (5 to 50 cm³, its edge the cube root, to scale), and its point (V, m) runs along the
 * material's line on the graph beside it. The four lines share one scale, so iron's is steep and wood's almost
 * flat; the readout shows m/V staying equal to the density while V and m change together. Densities from the
 * lesson's table, in g/cm³.
 */

const MATERIALS = [
	{ key: 'legno', name: 'legno di abete', d: 0.45, fill: TINT.orange, ink: INK.green },
	{ key: 'acqua', name: 'acqua', d: 1, fill: TINT.blue, ink: INK.blue },
	{ key: 'alluminio', name: 'alluminio', d: 2.7, fill: TINT.gray, ink: INK.orange },
	{ key: 'ferro', name: 'ferro', d: 7.87, fill: TINT.red, ink: INK.red }
] as const;

const V_MAX = 50;
const M_MAX = 400;
const O = v(2.75, 0); // origin of the graph
const SX = 3.8 / V_MAX; // cm of drawing per cm³
const SY = 3.2 / M_MAX; // cm of drawing per gram
const EDGE = 0.42; // cm of drawing per cm of the cube's edge
const f = frame(-0.15, O.x + 5.35, -0.55, 3.75);

const g = (V: number, m: number) => v(O.x + V * SX, O.y + m * SY);
const it = (x: number, digits: number) => x.toFixed(digits).replace('.', '{,}');

/** A cube in oblique projection, its front face's bottom-left corner at `at`, edge `s` centimetres. */
function Cube({ at, s, fill }: { at: V; s: number; fill: string }) {
	const d = v(0.36 * s, 0.22 * s);
	const p = (x: number, y: number) => add(at, v(x, y));
	return (
		<g pointerEvents="none" strokeLinejoin="round">
			<path d={f.path([p(0, s), add(p(0, s), d), add(p(s, s), d), p(s, s)], true)} fill={fill} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([p(s, 0), add(p(s, 0), d), add(p(s, s), d), p(s, s)], true)} fill={fill} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([p(0, 0), p(s, 0), p(s, s), p(0, s)], true)} fill={fill} stroke="#000" strokeWidth={THICK} />
		</g>
	);
}

export default function DensitaMassaVolume({ alt }: { alt?: string }) {
	const [V, setV] = useState(30);
	const [k, setK] = useState(2);
	const mat = MATERIALS[k];
	const m = mat.d * V;
	const P = g(V, m);
	const s = EDGE * Math.cbrt(V);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Cube at={v(0, 0)} s={s} fill={mat.fill} />
				<Axes f={f} o={O} x0={O.x - 0.1} x1={O.x + 4.05} y0={-0.1} y1={3.55} xName="" yName="" />
				{[10, 20, 30, 40, 50].map((x) => (
					<g key={x}>
						<path d={f.path([g(x, 0), add(g(x, 0), v(0, -0.08))])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={g(x, 0)} dir={v(0, -1.3)} upright size={11}>
							{x}
						</Label>
					</g>
				))}
				{[100, 200, 300, 400].map((y) => (
					<g key={y}>
						<path d={f.path([g(0, y), add(g(0, y), v(-0.08, 0))])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={g(0, y)} dir={v(-1, 0)} upright size={11}>
							{y}
						</Label>
					</g>
				))}
				{MATERIALS.map((x, i) => {
					const end = g(V_MAX, x.d * V_MAX);
					return <path key={x.key} d={f.path([O, end])} stroke={i === k ? x.ink : '#999'} strokeWidth={i === k ? THICK : THIN} fill="none" />;
				})}
				<path d={f.path([v(P.x, O.y), P, v(O.x, P.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<Dot f={f} at={P} r={3.2} color={mat.ink} />
				<Label f={f} at={v(O.x + 4.05, 0)} dir={v(1, 0)} size={14}>
					V <tspan fontStyle="normal" fontFamily={FONT} fontSize={12}>(cm³)</tspan>
				</Label>
				<Label f={f} at={v(O.x, 3.55)} dir={v(1, 0.2)} size={14}>
					m <tspan fontStyle="normal" fontFamily={FONT} fontSize={12}>(g)</tspan>
				</Label>
			</Drawing>

			<Readout>
				<span>
					<Tex>{`V = ${V}\\,\\text{cm}^3`}</Tex>
				</span>
				<span>
					<Tex>{`m = ${it(m, 1)}\\,\\text{g}`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`\\dfrac{m}{V} = ${it(mat.d, 2)}\\,\\text{g/cm}^3`}</Tex>
				</span>
			</Readout>
			<Caption>
				Il cubo è di {mat.name}. Cambia il volume: la massa cambia con lui, e il rapporto <Tex>{'\\tfrac{m}{V}'}</Tex> resta{' '}
				<Tex>{`${it(mat.d, 2)}\\,\\text{g/cm}^3`}</Tex>, la densità del materiale.
			</Caption>

			<Controls>
				<Slider label="Volume V (cm³)" value={V} min={5} max={V_MAX} step={1} onChange={setV} />
				<ButtonRow>
					{MATERIALS.map((x, i) => (
						<Button key={x.key} variant={i === k ? 'primary' : 'secondary'} size="sm" aria-pressed={i === k} onClick={() => setK(i)}>
							{x.key}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
