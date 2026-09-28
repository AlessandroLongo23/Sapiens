'use client';

import { useState } from 'react';
import { Caption, clamp, dist, Dot, Drawing, Figure, frame, Handle, Label, lerp, Readout, Tex, texNum, THICK, type V, v } from './kit';

/**
 * Lesson 102, "Il teorema di Talete": the parallels a, b, c cut by the transversals r and s, drawn as the TikZ
 * figure. The student drags A' and C' along a and c (which moves s) and B along r (which moves the parallel b).
 * The four segments change, and AB : BC = A'B' : B'C' stays true: both ratios are computed from the points, each
 * on its own transversal.
 */

const f = frame(-0.3, 5.75, -0.5, 3.5);
const X0 = -0.2, X1 = 5.0; // the parallels
const YA = 0, YC = 2.6;
const TRANSVERSAL = '#0000b3'; // blue!70!black
// r is fixed, as in the figure: through (0.40, 0) and (1.05, 2.6).
const rAt = (y: number) => v(0.4 + ((1.05 - 0.4) * y) / YC, y);

/** The line through P and Q, from height y0 to y1. */
const along = (P: V, Q: V, y: number) => lerp(P, Q, (y - P.y) / (Q.y - P.y));

export default function TaleteProporzionali({ alt }: { alt?: string }) {
	const [yb, setYb] = useState(1);
	const [xa, setXa] = useState(2.3); // A' on a
	const [xc, setXc] = useState(4.77); // C' on c

	const A = rAt(YA), B = rAt(yb), C = rAt(YC);
	const A2 = v(xa, YA), C2 = v(xc, YC);
	const B2 = along(A2, C2, yb);
	const ab = dist(A, B), bc = dist(B, C), ab2 = dist(A2, B2), bc2 = dist(B2, C2);
	const rEnds = [rAt(-0.35), rAt(2.95)];
	const sEnds = [along(A2, C2, -0.35), along(A2, C2, 2.95)];

	// B slides on r between a and c; A' and C' slide on their parallels, with s kept to the right of r.
	const moveB = (p: V) => setYb(Math.round(clamp(p.y, 0.3, YC - 0.3) * 20) / 20);
	const moveA2 = (p: V) => setXa(Math.round(clamp(p.x, 1.4, 4.2) * 20) / 20);
	const moveC2 = (p: V) => setXc(Math.round(clamp(p.x, 2.1, 4.9) * 20) / 20);

	const parallel = (y: number, name: string) => (
		<g key={name}>
			<path d={f.path([v(X0, y), v(X1, y)])} stroke="#000" strokeWidth={THICK} />
			<Label f={f} at={v(X1, y)} dir={v(1, 0)}>{name}</Label>
		</g>
	);
	const m = (x: number) => texNum(x, 2);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{parallel(YA, 'a')}
				{parallel(yb, 'b')}
				{parallel(YC, 'c')}
				<path d={f.path(rEnds)} stroke={TRANSVERSAL} strokeWidth={THICK} />
				<Label f={f} at={rEnds[1]} dir={v(0, 1)}>r</Label>
				<path d={f.path(sEnds)} stroke={TRANSVERSAL} strokeWidth={THICK} />
				<Label f={f} at={sEnds[1]} dir={v(0, 1)}>s</Label>
				<Dot f={f} at={A} />
				<Dot f={f} at={C} />
				<Dot f={f} at={B2} />
				<Label f={f} at={A} dir={v(-0.7, 0.7)}>A</Label>
				<Label f={f} at={B} dir={v(-0.7, 0.7)}>B</Label>
				<Label f={f} at={C} dir={v(-0.7, 0.7)}>C</Label>
				<Label f={f} at={A2} dir={v(-0.7, 0.7)}>A′</Label>
				<Label f={f} at={B2} dir={v(-0.7, 0.7)}>B′</Label>
				<Label f={f} at={C2} dir={v(-0.7, 0.7)}>C′</Label>
				<Handle f={f} at={B} onMove={moveB} label="Punto B, sposta la parallela b" step={0.05} />
				<Handle f={f} at={A2} onMove={moveA2} label="Punto A′, sposta la trasversale s" step={0.05} />
				<Handle f={f} at={C2} onMove={moveC2} label="Punto C′, sposta la trasversale s" step={0.05} />
			</Drawing>
			<Readout>
				<Tex>{`\\overline{AB} : \\overline{BC} = ${m(ab)} : ${m(bc)} = ${m(ab / bc)}`}</Tex>
				<Tex>{`\\overline{A'B'} : \\overline{B'C'} = ${m(ab2)} : ${m(bc2)} = ${m(ab2 / bc2)}`}</Tex>
			</Readout>
			<Caption>
				Trascina <Tex>{"A'"}</Tex> e <Tex>{"C'"}</Tex> per cambiare la trasversale <Tex>s</Tex>, e <Tex>B</Tex> per spostare la parallela <Tex>b</Tex>. I segmenti cambiano, ma i due rapporti restano uguali.
			</Caption>
		</Figure>
	);
}
