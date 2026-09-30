'use client';

import { Drawing, Label, frame, v, FONT_SIZE, THICK, THIN, DASH, TINT } from '@/components/content/interactive/kit';
import { Ball, Ground, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A body launched horizontally from a height (lesson 56): a platform (a table, a balcony, a cliff: always a grey
 * block), the ball at its top edge, the launch velocity to the right. `h` and `v0` are the labels ('1,2 m', '2,5 m/s';
 * missing: the letter alone, when the exercise asks for it), `x` the range (x_G), marked on the ground with a bracket when
 * the exercise gives it. The problem's drawing is not to scale. With `traiettoria: { h, x }` (numbers, metres) the
 * scene is the solution's: the parabola drawn to scale from the edge to the landing point, with the range.
 *
 *   { type: 'lancio-orizzontale', data: { h: '1,2 m', v0: '2,5 m/s' } }
 *   { type: 'lancio-orizzontale', data: { h: '1,2 m', v0: '2,5 m/s', x: '1,2 m', traiettoria: { h: 1.2, x: 1.24 } } }
 */

const S = FONT_SIZE * 0.85;
const W = 4.4; // the ground to the right of the platform, cm

export default function LancioOrizzontale({ data, alt }: SceneProps) {
	const path = data.traiettoria as { h: number; x: number } | undefined;
	// the platform's height and the landing point in cm: to scale for the solution, fixed for the problem
	let H = 2.2, X = 3.2;
	if (path && path.h > 0 && path.x > 0) {
		const k = Math.min(2.6 / path.h, W / 1.1 / path.x);
		H = Math.round(path.h * k * 1000) / 1000;
		X = Math.round(path.x * k * 1000) / 1000;
	}
	const hText = typeof data.h === 'string' ? `h = ${data.h}` : 'h';
	const vText = typeof data.v0 === 'string' ? data.v0 : null;
	const showX = typeof data.x === 'string' || !!path;
	const f = frame(-3.4, W + 0.4, showX ? -0.85 : -0.35, H + 0.85);
	const n = 60;
	const pts = Array.from({ length: n + 1 }, (_, i) => {
		const u = i / n;
		return v(X * u, H * (1 - u * u));
	});

	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(-1.3, 0)} to={v(W + 0.3, 0)} />
			<path d={f.path([v(-1.2, 0), v(0, 0), v(0, H), v(-1.2, H)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<Label f={f} at={v(-1.2, H / 2)} dir={v(-1, 0)} upright size={S}>{hText}</Label>
			{path && <path d={f.path(pts)} stroke={QTY.velocita} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			<Ball f={f} at={v(0, H + 0.12)} r={0.12} />
			<Vector f={f} from={v(0, H + 0.12)} to={v(1.0, H + 0.12)} color={QTY.velocita} />
			<Label f={f} at={v(1.0, H + 0.12)} dir={v(1, 0)} upright size={S} color={QTY.velocita}>
				<tspan fontStyle="italic">v</tspan>
				<tspan fontSize={S * 0.7} dy={3}>0</tspan>
				<tspan dy={-3}>{vText ? ` = ${vText}` : ''}</tspan>
			</Label>
			{showX && (
				<>
					{path && <circle cx={f.px(v(X, 0)).x} cy={f.px(v(X, 0)).y} r={2.5} fill={QTY.velocita} />}
					<path d={f.path([v(0, -0.45), v(X, -0.45)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<path d={f.path([v(0, -0.33), v(0, -0.57)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<path d={f.path([v(X, -0.33), v(X, -0.57)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<Label f={f} at={v(X / 2, -0.45)} dir={v(0, -1)} upright size={S}>
						<tspan fontStyle="italic">x</tspan>
						<tspan fontSize={S * 0.7} dy={3}>G</tspan>
						<tspan dy={-3}>{typeof data.x === 'string' ? ` = ${data.x}` : ''}</tspan>
					</Label>
				</>
			)}
		</Drawing>
	);
}
