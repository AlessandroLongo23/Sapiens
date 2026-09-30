'use client';

import { v, add, rot, THICK, THIN, TINT, type Frame, type V } from '../kit';
import { Arrow } from '../fisica';
import { LIQUID } from './liquidi';

/**
 * A river seen from above and a boat on it (group 14, lesson 46 "La composizione dei moti"), drawn like the TikZ
 * figures of that lesson: the water `\fill[cyan!20]` between the two banks, `\draw[thick]`, the current shown by short
 * thin grey arrows pointing downstream (to the right), and the boat as a small pointed hull turned where its bow points.
 * Used by the interactive figure BarcaFiume.tsx and by the exercise scene `fiume-barca`. TikZ centimetres, y upwards.
 */

/** The water from x0 to x1 between the banks y = 0 and y = width, with the flow arrows at `flow` (their tails). */
export function River({ f, x0, x1, width, flow = [] }: { f: Frame; x0: number; x1: number; width: number; flow?: V[] }) {
	return (
		<g pointerEvents="none">
			<path d={f.path([v(x0, 0), v(x1, 0), v(x1, width), v(x0, width)], true)} fill={LIQUID.acqua} stroke="none" />
			{flow.map((p, i) => (
				<Arrow key={i} f={f} from={p} to={add(p, v(0.8, 0))} color="#808080" weight="thin" />
			))}
			<path d={`${f.path([v(x0, 0), v(x1, 0)])} ${f.path([v(x0, width), v(x1, width)])}`} stroke="#000" strokeWidth={THICK} fill="none" />
		</g>
	);
}

/** A boat centred at `at`, its bow towards `heading` (radians from the x axis), `length` long. */
export function Boat({ f, at, heading, length = 0.5 }: { f: Frame; at: V; heading: number; length?: number }) {
	const L = length, W = length * 0.36;
	const p = (x: number, y: number) => add(at, rot(v(x, y), heading));
	const hull = [p(L / 2, 0), p(L * 0.12, W / 2), p(-L / 2, W / 2 * 0.8), p(-L / 2, -W / 2 * 0.8), p(L * 0.12, -W / 2)];
	return <path d={f.path(hull, true)} fill={TINT.orange} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" pointerEvents="none" />;
}
