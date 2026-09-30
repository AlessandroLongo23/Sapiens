'use client';

import { Drawing, Label, frame, v, TINT, THICK, THIN, DASH, FONT_SIZE, type V } from '@/components/content/interactive/kit';
import { Block, Ground, Vector, VecLabel, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A smooth track from A down to B (lessons 63 and 64, group 18): A on the left at height `hA`, B on the right at `hB`
 * (metres; 0 puts B on the ground, as at the foot of a slide), drawn with A always 2,4 cm above the ground and B in
 * proportion. `testoA` and `testoB` are written beside the dashed quotes ('15 m'); `vA`, if given, is the text of the
 * speed at A ('4,0 m/s'), drawn as a velocity arrow above the car. The scene draws the data, never the answer.
 *
 *   { type: 'pista-energia', data: { hA: 15, hB: 6.5, testoA: '15 m', testoB: '6,5 m', vA: '4,0 m/s' } }
 */
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const bez = (p0: V, p1: V, p2: V, p3: V, t: number) => {
	const s = 1 - t;
	return v(s * s * s * p0.x + 3 * s * s * t * p1.x + 3 * s * t * t * p2.x + t * t * t * p3.x, s * s * s * p0.y + 3 * s * s * t * p1.y + 3 * s * t * t * p2.y + t * t * t * p3.y);
};

export default function PistaEnergia({ data, alt }: SceneProps) {
	const hA = Math.max(0.1, Number(data.hA ?? 10));
	const hB = Math.min(hA, Math.max(0, Number(data.hB ?? 0)));
	const k = 2.4 / hA;
	const yA = 2.4, yB = r3(hB * k);
	const A = v(0.5, yA), B = v(4.1, yB);
	const curve = Array.from({ length: 41 }, (_, i) => {
		const p = bez(A, v(2.1, yA), v(2.5, yB), B, i / 40);
		return v(r3(p.x), r3(p.y));
	});
	const track = [v(0, yA), ...curve, v(4.7, yB)];
	const hasV = typeof data.vA === 'string';
	const f = frame(-1.35, 5.2, -0.3, yA + (hasV ? 1.15 : 0.7));

	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(0, 0), ...track, v(4.7, 0)], true)} fill={TINT.gray} stroke="none" />
			<Ground f={f} from={v(-0.3, 0)} to={v(5.0, 0)} />
			<path d={f.path(track)} stroke="#000" strokeWidth={THICK} fill="none" />
			<Block f={f} at={v(A.x - 0.05, yA)} w={0.5} h={0.26} />
			<circle cx={f.px(A).x} cy={f.px(A).y} r={2.2} fill="#000" />
			<Label f={f} at={v(A.x + 0.35, yA + 0.05)} dir={v(0.7, 0.7)}>A</Label>
			<path d={f.path([v(A.x, yA), v(A.x, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			{typeof data.testoA === 'string' && (
				<Label f={f} at={v(A.x - 0.08, yA / 2)} dir={v(-1, 0)} upright size={FONT_SIZE * 0.85}>
					{data.testoA}
				</Label>
			)}
			<circle cx={f.px(B).x} cy={f.px(B).y} r={2.2} fill="#000" />
			<Label f={f} at={v(B.x, yB + 0.05)} dir={v(0, 1)}>B</Label>
			{yB > 0.05 && <path d={f.path([v(B.x, yB), v(B.x, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			{typeof data.testoB === 'string' && yB > 0.05 && (
				<Label f={f} at={v(B.x + 0.08, Math.max(0.2, yB / 2))} dir={v(1, 0)} upright size={FONT_SIZE * 0.85}>
					{data.testoB}
				</Label>
			)}
			{hasV && (
				<>
					<Vector f={f} from={v(A.x - 0.3, yA + 0.62)} to={v(A.x + 0.6, yA + 0.62)} color={QTY.velocita} />
					<VecLabel f={f} at={v(A.x + 0.65, yA + 0.62)} dir={v(1, 0)} name="v" sub="A" color={QTY.velocita} />
					<Label f={f} at={v(A.x + 1.2, yA + 0.62)} dir={v(1, 0)} upright size={FONT_SIZE * 0.85} color={QTY.velocita}>
						{`= ${data.vA}`}
					</Label>
				</>
			)}
		</Drawing>
	);
}
