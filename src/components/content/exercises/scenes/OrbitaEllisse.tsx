'use client';

import { Drawing, Label, frame, v, TINT, THICK, THIN, DASH, FONT_SIZE } from '@/components/content/interactive/kit';
import { Ball, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * An elliptical orbit with the Sun (or `centro`, the name of the body at the focus) and the two points on the major
 * axis (lesson 91, group 35): the nearest on the right, at `rp`, the farthest on the left, at `ra` (any unit, only
 * their ratio is drawn, between 1 and 4). `testoRp` and `testoRa` are written along the axis, `testoVp` beside the
 * velocity at the nearest point, `nota` under the orbit ('distanze in milioni di km'). The velocity at the farthest point is what the exercise asks: it is not drawn.
 *
 *   { type: 'orbita-ellisse', data: { rp: 46, ra: 70, testoRp: '46', testoRa: '70', testoVp: '59 km/s' } }
 */
export default function OrbitaEllisse({ data, alt }: SceneProps) {
	const ratio = Math.min(4, Math.max(1, Number(data.ra ?? 2) / Math.max(1e-9, Number(data.rp ?? 1))));
	const A = 2.4; // semi-major axis, cm
	const rp = (2 * A) / (1 + ratio);
	const c = A - rp;
	const B = Math.sqrt(A * A - c * c);
	const sun = v(c, 0);
	const near = v(A, 0), far = v(-A, 0);
	const f = frame(-A - 0.45, A + 3.0, -B - (typeof data.nota === 'string' ? 0.85 : 0.3), B + 0.3);
	const k = f.W / (f.x1 - f.x0);
	const centre = f.px(v(0, 0));

	return (
		<Drawing f={f} label={alt}>
			<ellipse cx={centre.x} cy={centre.y} rx={A * k} ry={B * k} fill="none" stroke="#000" strokeWidth={THICK} />
			<path d={f.path([far, near])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<Ball f={f} at={sun} r={0.2} fill={TINT.orange} />
			<Label f={f} at={v(sun.x, -0.2)} dir={v(0, -1)} upright size={FONT_SIZE * 0.8}>
				{typeof data.centro === 'string' ? data.centro : 'Sole'}
			</Label>
			<Vector f={f} from={near} to={v(A, 1.3)} color={QTY.velocita} name="v" sub="p" labelAt={0.55} labelDir={v(1, 0)} />
			{typeof data.testoVp === 'string' && (
				<Label f={f} at={v(A + 0.62, 1.3 * 0.55)} dir={v(1, 0)} upright size={FONT_SIZE * 0.85} color={QTY.velocita}>
					{`= ${data.testoVp}`}
				</Label>
			)}
			<Ball f={f} at={near} r={0.1} />
			<Ball f={f} at={far} r={0.1} />
			{typeof data.testoRp === 'string' && (
				<Label f={f} at={v((sun.x + 0.2 + A) / 2, 0)} dir={v(0, 1)} upright size={FONT_SIZE * 0.8}>
					{data.testoRp}
				</Label>
			)}
			{typeof data.nota === 'string' && (
				<Label f={f} at={v(0, -B - 0.15)} dir={v(0, -1)} upright size={FONT_SIZE * 0.8}>
					{data.nota}
				</Label>
			)}
			{typeof data.testoRa === 'string' && (
				<Label f={f} at={v((sun.x - 0.2 - A) / 2, 0)} dir={v(0, 1)} upright size={FONT_SIZE * 0.8}>
					{data.testoRa}
				</Label>
			)}
		</Drawing>
	);
}
