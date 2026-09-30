'use client';

import { Drawing, Label, frame, v, add, scale, polar, THIN, DASH, FONT_SIZE, type V } from '@/components/content/interactive/kit';
import { Arrow, Vector, Point, QTY } from '@/components/content/interactive/fisica';
import { River, Boat } from '@/components/content/interactive/fisica/fiume';
import type { SceneProps } from '.';

/**
 * A boat crossing a river (lesson 46, "La composizione dei moti"), seen from above, the current flowing to the right.
 * The boat starts at A on the lower bank; its velocity relative to the water, `vb` m/s, points `alfa` degrees
 * upstream of the perpendicular to the bank (0: straight across). `vc` is the current. The velocities are drawn to
 * scale with each other; the river's width is not to scale and is only written (`larghezza`, '48 m'). `testoVb` and
 * `testoVc` are written by the arrows ('1,6 m/s'), `testoAlfa` by the angle ('37°', or 'α' when the angle is asked).
 * With `risultante` (the solution) the current is drawn head to tail on the boat's velocity, their sum v in orange
 * from A, and the dashed straight path to the other bank.
 *
 *   { type: 'fiume-barca', data: { vb: 1.6, vc: 1.2, alfa: 0, larghezza: '48 m', testoVb: '1,6 m/s', testoVc: '1,2 m/s' } }
 */
const W = 2.4; // drawn width of the river, cm
const X0 = -2.6, X1 = 3.4;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const rd = (p: V) => v(r3(p.x), r3(p.y));

export default function FiumeBarca({ data, alt }: SceneProps) {
	const vb = Number(data.vb ?? 1.6), vc = Number(data.vc ?? 1.2);
	const deg = Math.min(70, Math.max(0, Number(data.alfa ?? 0)));
	const a = (deg * Math.PI) / 180;
	const withSum = data.risultante === true;
	const k = 1.6 / Math.max(vb, vc, 0.01); // cm per m/s
	const A = v(0, 0);
	const heading = Math.PI / 2 + a;
	const tipB = rd(add(A, polar(vb * k, heading)));
	const tipV = rd(add(tipB, v(vc * k, 0)));
	// Where the straight path meets the other bank, or the right edge of the drawing.
	const vx = tipV.x, vy = tipV.y;
	const land = vy > 1e-6 ? rd(v((W * vx) / vy, W)) : v(X1, 0);
	const end = land.x > X1 - 0.2 ? rd(v(X1 - 0.2, ((X1 - 0.2) * vy) / vx)) : land.x < X0 + 0.2 ? rd(v(X0 + 0.2, ((X0 + 0.2) * vy) / vx)) : land;
	const f = frame(X0, X1, -0.7, W + 0.55);
	const current = { from: v(1.5, W - 0.45), to: rd(v(1.5 + vc * k, W - 0.45)) };

	return (
		<Drawing f={f} label={alt}>
			<River f={f} x0={X0} x1={X1} width={W} flow={[v(-2.4, 0.4), v(-2.4, W - 0.4)]} />
			<path d={f.path([A, v(0, W)])} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			{withSum && <path d={f.path([A, end])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			<Boat f={f} at={v(0, -0.02)} heading={heading} length={0.42} />
			<Vector f={f} from={A} to={tipB} color={QTY.velocita} name="v" sub="b" labelAt={0.55} labelDir={v(-1, 0.1)} />
			{typeof data.testoVb === 'string' && (
				<Label f={f} at={add(A, polar(vb * k * 0.22, heading))} dir={v(-1, 0)} upright size={FONT_SIZE * 0.8} color={QTY.velocita}>
					{data.testoVb}
				</Label>
			)}
			{withSum ? (
				<>
					<Vector f={f} from={tipB} to={tipV} color={QTY.velocita} name="v" sub="c" labelAt={0.5} labelDir={v(0, 1)} />
					<Vector f={f} from={A} to={tipV} color={QTY.risultante} name="v" labelAt={0.55} labelDir={v(1, -0.4)} />
				</>
			) : (
				vc > 0 && (
					<>
						<Vector f={f} from={current.from} to={current.to} color={QTY.velocita} name="v" sub="c" labelAt={0} labelDir={v(-1, 0)} />
						{typeof data.testoVc === 'string' && (
							<Label f={f} at={scale(add(current.from, current.to), 0.5)} dir={v(0, -1)} upright size={FONT_SIZE * 0.8} color={QTY.velocita}>
								{data.testoVc}
							</Label>
						)}
					</>
				)
			)}
			{deg > 0 && <path d={f.arc(A, polar(1, Math.PI / 2), polar(1, heading), 0.5)} stroke="#000" strokeWidth={THIN} fill="none" />}
			{deg > 0 && typeof data.testoAlfa === 'string' && (
				<Label f={f} at={add(A, polar(0.78, Math.PI / 2 + a / 2))} upright={data.testoAlfa !== 'α'} size={FONT_SIZE * 0.8}>
					{data.testoAlfa}
				</Label>
			)}
			<Point f={f} at={A} />
			<Label f={f} at={A} dir={v(0.8, -0.8)}>A</Label>
			{typeof data.larghezza === 'string' && (
				<>
					<Arrow f={f} from={v(X1 - 0.25, 0)} to={v(X1 - 0.25, W)} weight="thin" />
					<Arrow f={f} from={v(X1 - 0.25, W)} to={v(X1 - 0.25, 0)} weight="thin" />
					<Label f={f} at={v(X1 - 0.25, W / 2)} dir={v(-1, 0)} upright size={FONT_SIZE * 0.85}>
						{data.larghezza}
					</Label>
				</>
			)}
		</Drawing>
	);
}
