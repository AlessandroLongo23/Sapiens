'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, DASH, Drawing, Figure, FONT_MATH, frame, Handle, INK, K as SCALE, Label, mid, num, Readout, rot, sub, THICK, THIN, TINT, Tex, v, type V } from './kit';

/** A number for KaTeX: {,} keeps the decimal comma from being set as punctuation, with a space after it. */
const tn = (x: number, digits?: number) => num(x, digits).replace(',', '{,}');

/**
 * Lesson 100, Pythagoras: the figure `pitagora-quadrati` with C on the semicircle of diameter AB. The squares on the
 * legs change, the square on the hypotenuse does not, and the height CH, extended, splits it into two rectangles
 * with the colours of the squares they are equivalent to (first theorem of Euclid).
 */

const c = 2.5;
// Past these the smaller square is too small to hold its label.
const ALPHA = [20, 70] as const;
const f = frame(-1.75, 1.5 * c + 0.45, -c - 0.35, 1.21 * c + 0.45);
const quarter = (p: V) => rot(p, Math.PI / 2);

function geometry(alpha: number) {
	const k = (alpha * Math.PI) / 180;
	const A = v(0, 0), B = v(c, 0);
	const C = v(c * Math.cos(k) ** 2, c * Math.cos(k) * Math.sin(k));
	const H = v(C.x, 0);
	// The squares on the legs, on the side away from the triangle.
	const onAC = [A, C, add(C, quarter(C)), quarter(C)];
	const e = quarter(sub(B, C));
	const onBC = [C, B, add(B, e), add(C, e)];
	return { A, B, C, H, onAC, onBC, k };
}

const math = (s: string) => <tspan fontStyle="italic" fontFamily={FONT_MATH}>{s}</tspan>;

export default function PitagoraQuadrati({ alt }: { alt?: string }) {
	const [alpha, setAlpha] = useState((Math.acos(0.6) * 180) / Math.PI);
	const { A, B, C, H, onAC, onBC, k } = geometry(alpha);
	const moveC = (p: V) => {
		// On the semicircle on AB the angle at the centre is twice the angle at A.
		const beta = Math.atan2(Math.max(p.y, 0), p.x - c / 2);
		setAlpha(clamp((beta * 90) / Math.PI, ALPHA[0], ALPHA[1]));
	};
	// Measures with AB = 10: a = BC, b = AC, c = AB, as in the lesson.
	// Rounded to hundredths, b² from a² (it is 100 − a² exactly), so the numbers shown add up as shown.
	const a2 = Math.round(100 * Math.sin(k) ** 2 * 100) / 100;
	const b2 = Math.round((100 - a2) * 100) / 100;
	const center = (ps: V[]) => mid(ps[0], ps[2]);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<polygon points={f.pts(...onAC)} fill={TINT.blue20} stroke="#000" strokeWidth={THICK} />
				<polygon points={f.pts(...onBC)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} />
				<polygon points={f.pts(A, H, v(H.x, -c), v(0, -c))} fill={TINT.blue20} />
				<polygon points={f.pts(H, B, v(c, -c), v(H.x, -c))} fill={TINT.orange} />
				<polygon points={f.pts(A, B, v(c, -c), v(0, -c))} fill="none" stroke="#000" strokeWidth={THICK} />
				<line x1={f.px(C).x} y1={f.px(C).y} x2={f.px(v(H.x, -c)).x} y2={f.px(v(H.x, -c)).y} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={`M${f.px(B).x},${f.px(B).y} A${(c / 2) * SCALE},${(c / 2) * SCALE} 0 0 0 ${f.px(A).x},${f.px(A).y}`} fill="none" stroke={INK.gray} strokeWidth={THIN} strokeDasharray="2 3" />
				<polygon points={f.pts(A, B, C)} fill="none" stroke="#000" strokeWidth={THICK} />
				<polyline points={f.right(C, sub(A, C), sub(B, C), 0.16)} fill="none" stroke="#000" strokeWidth={THIN} />

				<Label f={f} at={A} dir={v(-1, 0)}>A</Label>
				<Label f={f} at={B} dir={v(1, 0)}>B</Label>
				<Label f={f} at={C} dir={v(0, 1)}>C</Label>
				{H.x > 0.45 && H.x < c - 0.45 && (
					<Label f={f} at={H} dir={v(0.7, 0.7)} size={13}>
						H
					</Label>
				)}
				<Label f={f} at={center(onAC)} upright size={13}>
					{math('b')}²
				</Label>
				<Label f={f} at={center(onBC)} upright size={13}>
					{math('a')}²
				</Label>
				<Label f={f} at={v(c / 2, -c / 2)} upright size={13}>
					{math('c')}²
				</Label>
				<Handle f={f} at={C} onMove={moveC} label="Vertice C, sulla semicirconferenza di diametro AB" step={0.08} />
			</Drawing>

			<Caption>Trascina C sulla semicirconferenza: i quadrati sui cateti cambiano, ma insieme fanno sempre il quadrato sull&apos;ipotenusa.</Caption>

			<Readout>
				<span>
					Con <Tex>{'c = 10'}</Tex>:
				</span>
				<Tex>{`a^2 = ${tn(a2)}`}</Tex>
				<Tex>{`b^2 = ${tn(b2)}`}</Tex>
				<Tex>{`a^2 + b^2 = ${tn(a2 + b2)}`}</Tex>
				<Tex>{`c^2 = 100`}</Tex>
			</Readout>

			<Controls>
				<Slider label="Angolo in A" value={Math.round(alpha)} min={ALPHA[0]} max={ALPHA[1]} step={1} unit="°" onChange={setAlpha} />
			</Controls>
		</Figure>
	);
}
