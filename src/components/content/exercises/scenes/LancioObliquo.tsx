'use client';

import { Drawing, Label, frame, v, add, polar, FONT_SIZE, THICK, THIN, DASH, TINT } from '@/components/content/interactive/kit';
import { Ball, Ground, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A body launched at an angle (lesson 76, Il lancio obliquo e la gittata; group 30): the ground, the ball, the launch
 * velocity drawn at `angolo` degrees above the horizontal, with the arc of the angle. `v0` and `alfa` are the labels
 * ('12 m/s', '35°'; missing: the letter alone, when the exercise asks for it). With `h` ('12 m') the ball starts from
 * the top of a platform (a balcony, a cliff: always a grey block). `L` is the label of the range, marked on the ground
 * with a bracket when the exercise gives it. The problem's drawing is not to scale, except for the angle. With
 * `traiettoria: { L, h }` (numbers, metres; h is 0 for a launch from the ground) the scene is the solution's: the
 * parabola that leaves at `angolo` from the height h and lands L metres away, drawn to scale, with the range.
 *
 *   { type: 'lancio-obliquo', data: { angolo: 35, v0: '12 m/s', alfa: '35°' } }
 *   { type: 'lancio-obliquo', data: { angolo: 30, v0: '15 m/s', alfa: '30°', h: '12 m', L: '33 m', traiettoria: { L: 32.6, h: 12 } } }
 */

const S = FONT_SIZE * 0.85;
const W = 4.8; // the ground to the right of the launch point, cm
const DEG = Math.PI / 180;

export default function LancioObliquo({ data, alt }: SceneProps) {
	const angle = Math.min(85, Math.max(5, Number(data.angolo) || 45));
	const tan = Math.tan(angle * DEG);
	const path = data.traiettoria as { L: number; h: number } | undefined;
	const raised = typeof data.h === 'string';
	// the platform's height and the landing point in cm: to scale for the solution, fixed for the problem
	let H = raised ? 1.5 : 0, X = 4.0, top = H + 1.5;
	let pts: ReturnType<typeof v>[] = [];
	if (path && path.L > 0) {
		// y = h + x tan α − c x², zero at x = L
		const c = (path.h + path.L * tan) / (path.L * path.L);
		const peak = path.h + (tan * tan) / (4 * c);
		const k = Math.min((W - 0.4) / path.L, 3.0 / peak);
		const r = (x: number) => Math.round(x * 1000) / 1000;
		H = r(path.h * k);
		X = r(path.L * k);
		top = Math.max(r(peak * k), H + 1.3);
		pts = Array.from({ length: 61 }, (_, i) => {
			const x = (path.L * i) / 60;
			return v(r(x * k), r(Math.max(0, path.h + x * tan - c * x * x) * k));
		});
	}
	const showL = typeof data.L === 'string' || !!path;
	const from = v(0, H + 0.12);
	const tip = add(from, polar(1.3, angle * DEG));
	const f = frame(raised ? -2.6 : -0.8, W + 0.4, showL ? -1.1 : -0.35, Math.max(top, tip.y) + 0.55);
	const alfa = typeof data.alfa === 'string' ? data.alfa : 'α';
	const mid = (angle / 2) * DEG;

	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(raised ? -1.3 : -0.7, 0)} to={v(W + 0.3, 0)} />
			{raised && (
				<>
					<path d={f.path([v(-1.2, 0), v(0, 0), v(0, H), v(-1.2, H)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
					<Label f={f} at={v(-1.2, H / 2)} dir={v(-1, 0)} upright size={S}>{`h = ${data.h}`}</Label>
				</>
			)}
			{pts.length > 0 && <path d={f.path(pts)} stroke={QTY.velocita} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			<path d={f.path([from, add(from, v(1.5, 0))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.6} fill="none" />
			<path d={f.arc(from, v(1, 0), polar(1, angle * DEG), 0.6)} stroke="#000" strokeWidth={THIN} fill="none" />
			<Label f={f} at={angle < 25 ? add(from, v(1.8, 0.02)) : add(from, polar(0.95, mid))} upright={alfa !== 'α'} size={S}>
				{alfa}
			</Label>
			<Vector f={f} from={from} to={tip} color={QTY.velocita} />
			<Label f={f} at={tip} dir={v(angle > 60 ? 1 : 0.4, angle > 60 ? 0 : 1)} upright size={S} color={QTY.velocita}>
				<tspan fontStyle="italic">v</tspan>
				<tspan fontSize={S * 0.7} dy={3}>0</tspan>
				<tspan dy={-3}>{typeof data.v0 === 'string' ? ` = ${data.v0}` : ''}</tspan>
			</Label>
			<Ball f={f} at={from} r={0.12} />
			{showL && (
				<>
					{path && <circle cx={f.px(v(X, 0)).x} cy={f.px(v(X, 0)).y} r={2.5} fill={QTY.velocita} />}
					<path d={f.path([v(0, -0.45), v(X, -0.45)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<path d={f.path([v(0, -0.33), v(0, -0.57)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<path d={f.path([v(X, -0.33), v(X, -0.57)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<Label f={f} at={v(X / 2, -0.45)} dir={v(0, -1)} upright size={S}>
						<tspan fontStyle="italic">L</tspan>
						{typeof data.L === 'string' ? ` = ${data.L}` : ''}
					</Label>
				</>
			)}
		</Drawing>
	);
}
