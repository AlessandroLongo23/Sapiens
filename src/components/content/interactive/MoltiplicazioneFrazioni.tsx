'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls, Drawing, Figure, Readout, Tex, THICK, THIN, TINT, VERY_THIN, frame, v } from './kit';
import { MathRow, gcd } from './numeri';

/**
 * Lesson 24, "Moltiplicazione": the unit square cut into b horizontal strips, a of them blue, and into d vertical
 * strips, c of them orange. The cells coloured twice are a·c of the b·d cells of the square: a/b of c/d is (a·c)/(b·d).
 */

const S = 5; // the side of the unit square, in TikZ cm
const f = frame(-1.45, 5.5, -1.2, 5.3);
/** The cells in both strips: blue!10 and orange!25 laid over each other, as TikZ's multiply blend would give. */
const BOTH = '#e6c8bf';

export default function MoltiplicazioneFrazioni({ alt }: { alt?: string }) {
	const [a, setA] = useState(2);
	const [b, setB] = useState(3);
	const [c, setC] = useState(4);
	const [d, setD] = useState(5);

	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1));
	const rows = (a / b) * S; // height of the blue strips
	const cols = (c / d) * S; // width of the orange strips
	const n = a * c;
	const m = b * d;
	const g = gcd(n, m);

	const setDen = (set: (x: number) => void, setNum: (f: (y: number) => number) => void) => (x: number) => {
		set(x);
		setNum((y) => Math.min(y, x));
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={box(0, 0, S, rows)} fill={TINT.blue} />
				<polygon points={box(0, 0, cols, S)} fill={TINT.orange} />
				<polygon points={box(0, 0, cols, rows)} fill={BOTH} />
				{/* The cells coloured twice are also hatched, so they do not depend on the colour alone. */}
				<defs>
					<pattern id="prodotto-tratteggio" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeWidth={VERY_THIN} />
					</pattern>
				</defs>
				<polygon points={box(0, 0, cols, rows)} fill="url(#prodotto-tratteggio)" />

				{Array.from({ length: b - 1 }, (_, i) => (
					<polyline key={`r${i}`} points={f.pts(v(0, ((i + 1) / b) * S), v(S, ((i + 1) / b) * S))} stroke="#000" strokeWidth={THIN} />
				))}
				{Array.from({ length: d - 1 }, (_, i) => (
					<polyline key={`c${i}`} points={f.pts(v(((i + 1) / d) * S, 0), v(((i + 1) / d) * S, S))} stroke="#000" strokeWidth={THIN} />
				))}
				{n > 0 && <polygon points={box(0, 0, cols, rows)} fill="none" stroke="#000" strokeWidth={THICK} />}
				<polygon points={box(0, 0, S, S)} fill="none" stroke="#000" strokeWidth={THICK} />

				{/* a/b along the left side, c/d along the bottom, as the lengths of the coloured strips. */}
				{a > 0 && (
					<>
						<polyline points={f.pts(v(-0.25, 0), v(-0.25, rows))} stroke="#000" strokeWidth={THIN} />
						<polyline points={f.pts(v(-0.35, 0), v(-0.15, 0))} stroke="#000" strokeWidth={THIN} />
						<polyline points={f.pts(v(-0.35, rows), v(-0.15, rows))} stroke="#000" strokeWidth={THIN} />
					</>
				)}
				<MathRow f={f} at={v(-0.45, Math.max(rows / 2, 0.35))} anchor="end" items={[[a, b]]} />
				{c > 0 && (
					<>
						<polyline points={f.pts(v(0, -0.25), v(cols, -0.25))} stroke="#000" strokeWidth={THIN} />
						<polyline points={f.pts(v(0, -0.35), v(0, -0.15))} stroke="#000" strokeWidth={THIN} />
						<polyline points={f.pts(v(cols, -0.35), v(cols, -0.15))} stroke="#000" strokeWidth={THIN} />
					</>
				)}
				<MathRow f={f} at={v(Math.max(cols / 2, 0.35), -0.72)} items={[[c, d]]} />
			</Drawing>

			<Caption>
				{n === 0 ? (
					<>Con un numeratore uguale a <Tex>0</Tex> nessuna casella è colorata due volte: il prodotto è <Tex>0</Tex>.</>
				) : (
					<>
						Il quadrato è diviso in <Tex>{`${b} \\cdot ${d} = ${m}`}</Tex> caselle uguali; quelle colorate due volte, tratteggiate, sono <Tex>{`${a} \\cdot ${c} = ${n}`}</Tex>. Sono i <Tex>{`\\frac{${a}}{${b}}`}</Tex> dei <Tex>{`\\frac{${c}}{${d}}`}</Tex> del quadrato.
					</>
				)}
			</Caption>
			<Readout>
				<Tex>{`\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}} = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${n}}{${m}}${n > 0 && g > 1 ? ` = ${m / g === 1 ? n / g : `\\frac{${n / g}}{${m / g}}`}` : ''}`}</Tex>
			</Readout>
			<Controls>
				<Slider label="Numeratore a" value={a} min={0} max={b} step={1} onChange={setA} />
				<Slider label="Denominatore b" value={b} min={1} max={8} step={1} onChange={setDen(setB, setA)} />
				<Slider label="Numeratore c" value={c} min={0} max={d} step={1} onChange={setC} />
				<Slider label="Denominatore d" value={d} min={1} max={8} step={1} onChange={setDen(setD, setC)} />
			</Controls>
		</Figure>
	);
}
