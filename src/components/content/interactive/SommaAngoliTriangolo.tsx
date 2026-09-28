'use client';

import { useState } from 'react';
import { MoveUpRight, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, Drawing, Figure, Handle, Label, Readout, Tex, THICK, THIN, add, angleDeg, clamp, frame, mid, polar, rotAround, useTween, v, type V } from './kit';

/**
 * Lesson 60, the angles of a triangle add up to a straight angle: the student drags C, and the line r through C
 * parallel to AB follows it. The button turns the angles at A and at B by half a turn, around the midpoints of AC and
 * of BC, which is exactly what takes each one onto its alternate interior angle at C: there the three coloured angles
 * sit side by side along r. Colours as in the TikZ figure (blue!25 at A, orange!30 at B, green!25 at C).
 *
 * C moves so that the angles at A and at B are whole degrees, so the readout is exact and adds up to 180.
 */

const f = frame(-1.65, 5.65, -0.6, 3.25);
const BLUE = '#bfbfff'; // blue!25
const ORANGE = '#ffdab3'; // orange!30
const GREEN = '#bfffbf'; // green!25
const R_BLUE = '#0000b3'; // blue!70!black
const A = v(0, 0);
const B = v(4, 0);
const rad = (d: number) => (d * Math.PI) / 180;

/** C from the angles at A and at B, in degrees (law of sines on AB = 4). */
function apex(alpha: number, beta: number) {
	const d = (4 * Math.sin(rad(beta))) / Math.sin(rad(alpha + beta));
	return polar(d, rad(alpha));
}

export default function SommaAngoliTriangolo({ alt }: { alt?: string }) {
	const [angles, setAngles] = useState({ alpha: 58, beta: 40 });
	const [t, go, running] = useTween(0, 1400);
	const { alpha, beta } = angles;
	const C = apex(alpha, beta);
	const gamma = Math.round(angleDeg(A, C, B));

	const drag = (p: V) => {
		const q = v(clamp(p.x, -1.1, 5.1), clamp(p.y, 0.45, 2.75));
		let a = Math.round((Math.atan2(q.y, q.x) * 180) / Math.PI);
		let b = Math.round((Math.atan2(q.y, 4 - q.x) * 180) / Math.PI);
		a = clamp(a, 10, 150);
		b = clamp(b, 10, 150);
		if (a + b > 165) {
			const over = a + b - 165;
			a -= Math.ceil(over / 2);
			b -= Math.floor(over / 2);
		}
		// Not above the drawing: lower C along the ray from A until it fits.
		while (apex(a, b).y > 2.8 && b > 10) b -= 1;
		setAngles({ alpha: a, beta: b });
	};

	// The copies of the angles at A and at B, turned by half a turn around the midpoints of AC and BC.
	// Each turns across the inside of the triangle, which keeps it in the drawing however tall the triangle is.
	const turnA = Math.PI * t;
	const turnB = -Math.PI * t;
	const MA = mid(A, C), MB = mid(B, C);
	const vA = rotAround(A, MA, turnA);
	const vB = rotAround(B, MB, turnB);
	const rho = 0.45 - 0.05 * t;
	const sectorA = f.sector(vA, polar(1, turnA), polar(1, rad(alpha) + turnA), rho);
	const arcA = f.arc(vA, polar(1, turnA), polar(1, rad(alpha) + turnA), rho);
	const sectorB = f.sector(vB, polar(1, Math.PI - rad(beta) + turnB), polar(1, Math.PI + turnB), rho);
	const arcB = f.arc(vB, polar(1, Math.PI - rad(beta) + turnB), polar(1, Math.PI + turnB), rho);

	const rLeft = clamp(C.x - 2.1, f.x0 + 0.1, 0);
	const rRight = clamp(C.x + 2.2, 4, f.x1 - 0.45);
	const line = (P: V, Q: V) => {
		const p = f.px(P), q = f.px(Q);
		return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
	};
	const done = t === 1;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* The angles of the triangle. */}
				<path d={f.sector(A, v(1, 0), polar(1, rad(alpha)), 0.45)} fill={BLUE} />
				<path d={f.arc(A, v(1, 0), polar(1, rad(alpha)), 0.45)} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.sector(B, polar(1, Math.PI - rad(beta)), v(-1, 0), 0.45)} fill={ORANGE} />
				<path d={f.arc(B, polar(1, Math.PI - rad(beta)), v(-1, 0), 0.45)} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.sector(C, v(-C.x, -C.y), v(B.x - C.x, -C.y), 0.4)} fill={GREEN} />
				<path d={f.arc(C, v(-C.x, -C.y), v(B.x - C.x, -C.y), 0.4)} fill="none" stroke="#000" strokeWidth={THIN} />

				{/* Their copies, on their way to C (or there). */}
				{t > 0 && (
					<>
						<path d={sectorA} fill={BLUE} />
						<path d={arcA} fill="none" stroke="#000" strokeWidth={THIN} />
						<path d={sectorB} fill={ORANGE} />
						<path d={arcB} fill="none" stroke="#000" strokeWidth={THIN} />
					</>
				)}

				<polygon points={f.pts(A, B, C)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="miter" />
				<line {...line(v(rLeft, C.y), v(rRight, C.y))} stroke={R_BLUE} strokeWidth={THICK} />
				<Label f={f} at={v(rRight, C.y)} dir={v(1, 0)}>r</Label>
				<Label f={f} at={A} dir={v(-0.7, -0.7)}>A</Label>
				<Label f={f} at={B} dir={v(0.7, -0.7)}>B</Label>
				<Label f={f} at={add(C, v(0, 0.05))} dir={v(0, 1)}>C</Label>
				<Handle f={f} at={C} onMove={drag} label="Il vertice C" step={0.1} />
			</Drawing>

			<Caption>
				{done ? (
					<>
						Girati di mezzo giro, gli angoli in A e in B diventano gli alterni interni in C: con <Tex>{'\\hat{C}'}</Tex> riempiono l&apos;angolo piatto lungo r.
					</>
				) : (
					'Trascina C: la retta r resta parallela ad AB. Poi porta gli angoli in A e in B fino a C.'
				)}
			</Caption>

			<Readout>
				<Tex>{`\\hat{A} = ${alpha}^\\circ`}</Tex>
				<Tex>{`\\hat{B} = ${beta}^\\circ`}</Tex>
				<Tex>{`\\hat{C} = ${gamma}^\\circ`}</Tex>
				<Tex>{`\\hat{A} + \\hat{B} + \\hat{C} = ${alpha + beta + gamma}^\\circ`}</Tex>
			</Readout>

			<ButtonRow>
				{t > 0.5 ? (
					<Button variant="secondary" size="sm" onClick={() => void go(0)} disabled={running}>
						<Undo2 className="size-4" aria-hidden="true" />
						Riporta gli angoli
					</Button>
				) : (
					<Button variant="secondary" size="sm" onClick={() => void go(1)} disabled={running}>
						<MoveUpRight className="size-4" aria-hidden="true" />
						Porta gli angoli in C
					</Button>
				)}
			</ButtonRow>
		</Figure>
	);
}
