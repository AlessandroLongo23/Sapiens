'use client';

import { Drawing, Label, frame, v, FONT_SIZE, THICK } from '@/components/content/interactive/kit';
import { Block, Ground, Pulley, Thread, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * Bodies tied by a thread (lesson 55), in one of three setups, with the masses written by the bodies ('2,0 kg'):
 * `tipo: 'traino'`, two carts on a floor, the thread between them, the force `F` ('15 N') pulling the right-hand one
 * (m1) to the right; `tipo: 'tavolo'`, a cart (m1) on a table tied over a pulley at the edge to a hanging mass (m2);
 * `tipo: 'atwood'`, a pulley hanging from the ceiling with m1 on the left and m2 on the right, level. No
 * acceleration, no tension: the scene draws the data only.
 *
 *   { type: 'corpi-collegati', data: { tipo: 'tavolo', m1: '4,0 kg', m2: '1,0 kg' } }
 */

const S = FONT_SIZE * 0.85;

export default function CorpiCollegati({ data, alt }: SceneProps) {
	const kind = data.tipo === 'tavolo' || data.tipo === 'atwood' ? data.tipo : 'traino';
	const m1 = String(data.m1 ?? ''), m2 = String(data.m2 ?? '');

	if (kind === 'traino') {
		const f = frame(-0.4, 6.4, -0.35, 1.35);
		return (
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-0.3, 0)} to={v(6.3, 0)} />
				<Block f={f} at={v(1.1, 0)} w={1.2} h={0.7} />
				<Block f={f} at={v(3.9, 0)} w={1.2} h={0.7} />
				<Thread f={f} from={v(1.7, 0.25)} to={v(3.3, 0.25)} />
				<Label f={f} at={v(1.1, 0.7)} dir={v(0, 1)} upright size={S}>{m2}</Label>
				<Label f={f} at={v(3.9, 0.7)} dir={v(0, 1)} upright size={S}>{m1}</Label>
				<Vector f={f} from={v(4.5, 0.35)} to={v(5.7, 0.35)} color={QTY.forza} />
				{typeof data.F === 'string' && (
					<Label f={f} at={v(5.1, 0.35)} dir={v(0, 1)} upright size={S} color={QTY.forza}>{data.F}</Label>
				)}
			</Drawing>
		);
	}

	if (kind === 'tavolo') {
		const f = frame(-0.4, 5.9, -0.3, 3.05);
		return (
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-0.3, 2)} to={v(4, 2)} />
				<path d={f.path([v(4, 2), v(4, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(4, 2), v(4.3, 2)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Block f={f} at={v(1.6, 2)} w={1.2} h={0.6} />
				<Thread f={f} from={v(2.2, 2.3)} to={v(4.3, 2.3)} />
				<Thread f={f} from={v(4.6, 2)} to={v(4.6, 0.9)} />
				<Pulley f={f} at={v(4.3, 2)} r={0.3} />
				<Block f={f} at={v(4.6, 0.3)} w={0.6} h={0.6} />
				<Label f={f} at={v(1.6, 2.6)} dir={v(0, 1)} upright size={S}>{m1}</Label>
				<Label f={f} at={v(4.9, 0.6)} dir={v(1, 0)} upright size={S}>{m2}</Label>
			</Drawing>
		);
	}

	const f = frame(-2.6, 2.6, 0.3, 4.75);
	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(1, 4.6)} to={v(-1, 4.6)} />
			<path d={f.path([v(0, 4.6), v(0, 4)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<Thread f={f} from={v(-0.4, 4)} to={v(-0.4, 1.8)} />
			<Thread f={f} from={v(0.4, 4)} to={v(0.4, 1.8)} />
			<Pulley f={f} at={v(0, 4)} r={0.4} />
			<Block f={f} at={v(-0.4, 1.2)} w={0.55} h={0.6} />
			<Block f={f} at={v(0.4, 1.2)} w={0.55} h={0.6} />
			<Label f={f} at={v(-0.7, 1.5)} dir={v(-1, 0)} upright size={S}>{m1}</Label>
			<Label f={f} at={v(0.7, 1.5)} dir={v(1, 0)} upright size={S}>{m2}</Label>
		</Drawing>
	);
}
