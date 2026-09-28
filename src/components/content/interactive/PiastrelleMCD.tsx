'use client';

import { useState } from 'react';
import { Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, Drawing, Figure, INK, Label, Readout, Tex, THICK, TINT, THIN, VERY_THIN, frame, v } from './kit';
import { gcd } from './numeri';

/**
 * Lesson 7, "Problemi con MCD e MCM", example 6: the floor of the TikZ figure (360 × 264 cm, 60 cm to a TikZ cm) under
 * square tiles of the side the student picks. Where the side does not divide a measure, a strip is left that needs cut
 * tiles, in red and hatched. The largest side that leaves no strip is the greatest common divisor.
 */

const SCALE = 1 / 60; // TikZ cm per cm of floor
const MAX = 360;
const f = frame(-1.6, 6.3, -0.75, MAX * SCALE + 0.25);

export default function PiastrelleMCD({ alt }: { alt?: string }) {
	const [l, setL] = useState(360);
	const [w, setW] = useState(264);
	const [s, setS] = useState(30);

	const g = gcd(l, w);
	const side = Math.min(s, l, w);
	const nx = Math.floor(l / side);
	const ny = Math.floor(w / side);
	const rx = l - nx * side; // the strip left along the length
	const ry = w - ny * side;
	const X = (cm: number) => cm * SCALE;
	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(v(X(x0), X(y0)), v(X(x1), X(y0)), v(X(x1), X(y1)), v(X(x0), X(y1)));

	const fit = (next: { l?: number; w?: number }) => {
		const L = next.l ?? l, W = next.w ?? w;
		if (next.l !== undefined) setL(L);
		if (next.w !== undefined) setW(W);
		setS((x) => Math.min(x, L, W));
	};

	const good = rx === 0 && ry === 0;
	const bad = [rx > 0 && l, ry > 0 && w].filter(Boolean) as number[];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<pattern id="piastrelle-scarto" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="5" stroke={INK.red} strokeWidth={THIN} />
					</pattern>
				</defs>
				{/* The strips to cut, along the length (on the right) and along the width (on top). */}
				{rx > 0 && (
					<>
						<polygon points={box(nx * side, 0, l, w)} fill={TINT.red} />
						<polygon points={box(nx * side, 0, l, w)} fill="url(#piastrelle-scarto)" />
					</>
				)}
				{ry > 0 && (
					<>
						<polygon points={box(0, ny * side, nx * side, w)} fill={TINT.red} />
						<polygon points={box(0, ny * side, nx * side, w)} fill="url(#piastrelle-scarto)" />
					</>
				)}
				{/* The whole tiles, as TikZ's grey grid. */}
				{Array.from({ length: nx + 1 }, (_, i) => (
					<polyline key={`x${i}`} points={f.pts(v(X(i * side), 0), v(X(i * side), X(ny * side)))} stroke={INK.gray} strokeWidth={side < 12 ? VERY_THIN : THIN} />
				))}
				{Array.from({ length: ny + 1 }, (_, j) => (
					<polyline key={`y${j}`} points={f.pts(v(0, X(j * side)), v(X(nx * side), X(j * side)))} stroke={INK.gray} strokeWidth={side < 12 ? VERY_THIN : THIN} />
				))}
				<polygon points={box(0, 0, l, w)} fill="none" stroke="#000" strokeWidth={THICK} />
				<Label f={f} at={v(X(l / 2), 0)} dir={v(0, -1)} upright>{`${l} cm`}</Label>
				<Label f={f} at={v(0, X(w / 2))} dir={v(-1, 0)} upright>{`${w} cm`}</Label>
			</Drawing>

			<Caption>
				{good && side === g ? (
					<>
						Nessuno scarto, e nessun lato più grande funziona: <Tex>{`${side} = \\text{MCD}(${l}, ${w})`}</Tex>. Servono <Tex>{`${nx} \\cdot ${ny} = ${nx * ny}`}</Tex> piastrelle.
					</>
				) : good ? (
					<>
						Nessuno scarto: <Tex>{String(side)}</Tex> divide sia <Tex>{String(l)}</Tex> sia <Tex>{String(w)}</Tex>. C&apos;è però un lato più grande che funziona.
					</>
				) : (
					<>
						Il lato <Tex>{String(side)}</Tex> non divide <Tex>{bad.join('\\text{ né }')}</Tex>: le strisce tratteggiate vanno coperte con piastrelle tagliate. Cerca il lato più grande che non lascia scarti.
					</>
				)}
			</Caption>
			<Readout>
				<Tex>{`${l} = ${side} \\cdot ${nx} + ${rx}`}</Tex>
				<Tex>{`${w} = ${side} \\cdot ${ny} + ${ry}`}</Tex>
				<span>
					piastrelle intere: <Tex>{`${nx} \\cdot ${ny} = ${nx * ny}`}</Tex>
				</span>
			</Readout>
			<ButtonRow>
				<Button variant="secondary" size="sm" onClick={() => setS(g)}>
					<Grid3x3 className="size-4" aria-hidden="true" />
					Prova il MCD
				</Button>
			</ButtonRow>
			<Controls>
				<Slider label="Lato della piastrella" value={side} min={1} max={Math.min(l, w)} step={1} unit="cm" onChange={setS} />
				<Slider label="Lunghezza" value={l} min={60} max={MAX} step={1} unit="cm" onChange={(x) => fit({ l: x })} />
				<Slider label="Larghezza" value={w} min={60} max={MAX} step={1} unit="cm" onChange={(x) => fit({ w: x })} />
			</Controls>
		</Figure>
	);
}
