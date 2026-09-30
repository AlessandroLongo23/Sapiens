'use client';

import { Drawing, frame, v, THICK, THIN, type V } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { Words, heatTint } from '@/components/content/interactive/fisica/calore';
import { QuantityText } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A slab crossed by heat, or a bar between two temperatures (lesson 69, the law of conduction), drawn like the lesson's
 * TikZ figure `lastra-conduzione-calore`. All labels are plain text written by the generator ('6,5 cm', '5,8 m²',
 * '21 °C'); the drawing is the same whatever the numbers, and never shows the answer.
 *
 *   { type: 'lastra-conduzione', data: { spessore: '6,5 cm', area: '6,3 m²', materiale: 'legno', sbarra: false,
 *       caldo: '21 °C', freddo: '3 °C' } }        // or dT: '20 °C' when only the difference is given
 *
 * With `sbarra` the body is a horizontal bar: `spessore` is its length and `area` its section; the hot end on the left.
 */
const s = (x: unknown) => (typeof x === 'string' ? x : '');

export default function LastraConduzione({ data, alt }: SceneProps) {
	const bar = data.sbarra === true;
	const hot = s(data.caldo), cold = s(data.freddo), dT = s(data.dT);
	const mat = s(data.materiale);
	const orange = '#e67300';

	if (bar) {
		const f = frame(-0.4, 6.4, -1.0, 1.35);
		const box = (x0: number, x1: number, fill: string) => (
			<path d={f.path([v(x0, 0), v(x1, 0), v(x1, 0.45), v(x0, 0.45)], true)} fill={fill} stroke="none" />
		);
		return (
			<Drawing f={f} label={alt}>
				{Array.from({ length: 12 }, (_, i) => (
					<g key={i}>{box(0.3 + i * 0.45, 0.3 + (i + 1) * 0.45 + 0.01, heatTint(85 - i * 6))}</g>
				))}
				<path d={f.path([v(0.3, 0), v(5.7, 0), v(5.7, 0.45), v(0.3, 0.45)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
				<Words f={f} at={v(0.3, 0.75)} anchor="middle" size={13}>
					{hot}
				</Words>
				<Words f={f} at={v(5.7, 0.75)} anchor="middle" size={13}>
					{cold}
				</Words>
				{mat && (
					<Words f={f} at={v(3, 0.75)} size={12}>
						{mat}
					</Words>
				)}
				<Arrow f={f} from={v(1.6, 1.12)} to={v(4.4, 1.12)} color={orange} />
				<path d={f.path([v(0.3, -0.3), v(5.7, -0.3)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0.3, -0.2), v(0.3, -0.4)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(5.7, -0.2), v(5.7, -0.4)])} stroke="#000" strokeWidth={THIN} />
				<QuantityText f={f} at={v(1.6, -0.6)} text={`d = ${s(data.spessore)}`} />
				<QuantityText f={f} at={v(4.4, -0.6)} text={`S = ${s(data.area)}`} />
			</Drawing>
		);
	}

	// The slab in perspective: front face 1,5 × 2,5, depth (0,6; 0,6); heat from left to right.
	const f = frame(-1.9, 4.6, -0.95, 3.55);
	const P = (x: number, y: number): V => v(x, y);
	const front = [P(0, 0), P(1.5, 0), P(1.5, 2.5), P(0, 2.5)];
	const top = [P(0, 2.5), P(0.6, 3.1), P(2.1, 3.1), P(1.5, 2.5)];
	const side = [P(1.5, 0), P(2.1, 0.6), P(2.1, 3.1), P(1.5, 2.5)];
	return (
		<Drawing f={f} label={alt}>
			<path d={f.path(front, true)} fill="#e6e6e6" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<path d={f.path(top, true)} fill="#f2f2f2" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<path d={f.path(side, true)} fill="#d4d4d4" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<Words f={f} at={v(1.8, 1.55)} size={13}>
				<tspan fontStyle="italic">S</tspan>
			</Words>
			<Arrow f={f} from={v(-1.6, 1.25)} to={v(-0.15, 1.25)} color={orange} />
			<Arrow f={f} from={v(2.25, 1.25)} to={v(3.7, 1.25)} color={orange} />
			{dT ? (
				<QuantityText f={f} at={v(1.05, 3.4)} text={`ΔT = ${dT}`} />
			) : (
				<>
					<Words f={f} at={v(-0.85, 2.4)} size={13}>
						{hot}
					</Words>
					<Words f={f} at={v(3.1, 2.4)} size={13}>
						{cold}
					</Words>
				</>
			)}
			<path d={f.path([v(0, -0.3), v(1.5, -0.3)])} stroke="#000" strokeWidth={THIN} />
			<path d={f.path([v(0, -0.2), v(0, -0.4)])} stroke="#000" strokeWidth={THIN} />
			<path d={f.path([v(1.5, -0.2), v(1.5, -0.4)])} stroke="#000" strokeWidth={THIN} />
			<QuantityText f={f} at={v(0.75, -0.6)} text={`d = ${s(data.spessore)}`} />
			<QuantityText f={f} at={v(3.1, 0.2)} text={`S = ${s(data.area)}`} />
			{mat && (
				<Words f={f} at={v(3.1, -0.3)} size={12}>
					{mat}
				</Words>
			)}
		</Drawing>
	);
}
