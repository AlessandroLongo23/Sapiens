'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, Controls, Drawing, Figure, FONT_MATH, frame, Label, num, Readout, scale, Tex, texNum, THICK, THIN, TINT, v } from './kit';

/**
 * Lesson 103, "Perimetri, altezze e aree": the triangle of sides 13, 14 and 15 cm (perimeter 42 cm, area 84 cm²)
 * enlarged by k. The enlarged triangle is ruled with the lattice of copies of the first one, which is the orange
 * copy in the corner: for a whole k it holds exactly k² copies, and in between the whole copies are ⌊k⌋² with pieces
 * of others along the edge. Perimeter and area are computed as k · 42 and k² · 84.
 */

const S = 0.08; // TikZ centimetres per cm of the triangle
const E1 = v(14 * S, 0); // side 14 on the base
const E2 = v(5 * S, 12 * S); // side 13 on the left, apex at height 12
const K_MAX = 4;
const f = frame(-0.35, K_MAX * E1.x + 0.35, -0.55, K_MAX * E2.y + 0.3);
const FILL = '#ebebff'; // blue!8
const P = 42, AREA = 84;

/** The point u·e1 + w·e2 of the lattice. */
const at = (u: number, w: number) => add(scale(E1, u), scale(E2, w));

export default function SimilitudineAree({ alt }: { alt?: string }) {
	const [k, setK] = useState(2);
	const n = Math.floor(k + 1e-9);
	const whole = Math.abs(k - Math.round(k)) < 1e-9;
	const lines: [number, number, number, number][] = [];
	for (let i = 1; i < k - 1e-9; i++) {
		lines.push([i, 0, i, k - i]); // parallel to the left side
		lines.push([0, i, k - i, i]); // parallel to the base
		lines.push([i, 0, 0, i]); // parallel to the right side
	}
	const k2 = Math.round(k * k * 100) / 100;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={f.pts(at(0, 0), at(k, 0), at(0, k))} fill={FILL} />
				<polygon points={f.pts(at(0, 0), at(1, 0), at(0, 1))} fill={TINT.orange} />
				{lines.map(([u0, w0, u1, w1], i) => (
					<path key={i} d={f.path([at(u0, w0), at(u1, w1)])} stroke="#000" strokeWidth={THIN} />
				))}
				<polygon points={f.pts(at(0, 0), at(1, 0), at(0, 1))} fill="none" stroke="#000" strokeWidth={THIN} />
				<polygon points={f.pts(at(0, 0), at(k, 0), at(0, k))} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<Label f={f} at={v((k * E1.x) / 2, 0)} dir={v(0, -1)} upright size={12.75}>
					<tspan fontStyle="italic" fontFamily={FONT_MATH}>k</tspan> = {num(k, 1)}
				</Label>
			</Drawing>
			<Readout>
				<Tex>{`2p' = ${texNum(k, 1)} \\cdot ${P} = ${texNum(k * P, 1)}\\ \\text{cm}`}</Tex>
				<Tex>{`\\mathcal{A}' = ${texNum(k, 1)}^2 \\cdot ${AREA} = ${texNum(k2, 2)} \\cdot ${AREA} = ${texNum(k2 * AREA, 2)}\\ \\text{cm}^2`}</Tex>
			</Readout>
			<Caption>
				{k === 1 ? (
					<>
						Con <Tex>{'k = 1'}</Tex> il triangolo è quello di partenza, arancione, con i lati di <Tex>13</Tex>, <Tex>14</Tex> e <Tex>15</Tex> cm. Aumenta <Tex>k</Tex> e guarda quante copie ci stanno.
					</>
				) : whole ? (
					<>
						Con <Tex>{`k = ${n}`}</Tex> il triangolo contiene <Tex>{`${n}^2 = ${n * n}`}</Tex> copie di quello arancione: il perimetro è <Tex>{`${n}`}</Tex> volte, l&apos;area <Tex>{`${n * n}`}</Tex> volte.
					</>
				) : (
					<>
						Con <Tex>{`k = ${texNum(k, 1)}`}</Tex> l&apos;area è <Tex>{`${texNum(k2, 2)}`}</Tex> volte quella del triangolo arancione: <Tex>{`${n * n}`}</Tex> {n === 1 ? 'copia intera' : 'copie intere'} e pezzi di altre lungo il bordo. Il perimetro è <Tex>{texNum(k, 1)}</Tex> volte.
					</>
				)}
			</Caption>
			<Controls>
				<Slider label="Rapporto k" value={k} min={1} max={K_MAX} step={0.1} onChange={setK} />
			</Controls>
		</Figure>
	);
}
