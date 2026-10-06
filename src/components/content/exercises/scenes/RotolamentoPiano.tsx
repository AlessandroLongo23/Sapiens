'use client';

import { Drawing, Label, frame, v, add, scale, polar, TINT, THIN, DASH, FONT_SIZE } from '@/components/content/interactive/kit';
import { Ball, Incline, onIncline } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A round body at the top of an incline, about to roll down (lesson 89, group 35). `forma` picks the drawing:
 * 'anello' and 'sfera-cava' two circles, 'cilindro' a blue disc, 'sfera' an orange disc; `nome` is written
 * beside it ('sfera piena'). With `testoH` the drop is marked by two dashed lines and its text ('0,85 m'); with
 * `angolo` (degrees) the incline is drawn at that angle and `testoAngolo` is written at its foot ('35°'). Without an
 * angle the incline is at 25°. The scene draws the data, never the speed or the acceleration asked for.
 *
 *   { type: 'rotolamento-piano', data: { forma: 'sfera', nome: 'sfera piena', testoH: '0,85 m' } }
 */
const DEG = Math.PI / 180;
const R = 0.3;

export default function RotolamentoPiano({ data, alt }: SceneProps) {
	const deg = Math.min(60, Math.max(10, Number(data.angolo ?? 25)));
	const angle = deg * DEG;
	const slope = 4.2; // length of the slope, cm
	const base = slope * Math.cos(angle);
	const top = slope * Math.sin(angle);
	const corner = v(base, 0);
	const normal = v(-Math.sin(angle), Math.cos(angle));
	const centre = add(onIncline(corner, base, angle, slope - 0.62).at, scale(normal, R));
	const low = add(onIncline(corner, base, angle, 0.8).at, scale(normal, R));
	const forma = String(data.forma ?? 'cilindro');
	const hollow = forma === 'anello' || forma === 'sfera-cava';
	const fill = forma === 'sfera' ? TINT.orange : forma === 'cilindro' ? TINT.blue : 'none';
	const hasH = typeof data.testoH === 'string';
	const f = frame(-0.45, base + (hasH ? 2.2 : 0.5), -0.3, top + 1.15);
	const xH = base + 0.55;

	return (
		<Drawing f={f} label={alt}>
			<Incline f={f} corner={corner} base={base} angle={angle} />
			<Ball f={f} at={centre} r={R} fill={fill} />
			{hollow && <Ball f={f} at={centre} r={R * 0.7} fill="none" />}
			{typeof data.nome === 'string' && (
				<Label f={f} at={add(centre, v(0, R))} dir={v(0, 1)} upright size={FONT_SIZE * 0.85}>
					{data.nome}
				</Label>
			)}
			{typeof data.testoAngolo === 'string' && (
				<Label f={f} at={add(v(0, 0), polar(0.95, angle / 2))} dir={v(1, 0)} upright size={FONT_SIZE * 0.85}>
					{data.testoAngolo}
				</Label>
			)}
			{hasH && (
				<>
					<path d={f.path([centre, v(xH + 0.2, centre.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					<path d={f.path([low, v(xH + 0.2, low.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					<circle cx={f.px(low).x} cy={f.px(low).y} r={R * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
					<path d={f.path([v(xH, low.y), v(xH, centre.y)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<Label f={f} at={v(xH, (low.y + centre.y) / 2)} dir={v(1, 0)} upright size={FONT_SIZE * 0.85}>
						{data.testoH as string}
					</Label>
				</>
			)}
		</Drawing>
	);
}
