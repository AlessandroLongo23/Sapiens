'use client';

import { v, add, num, TINT, THICK, THIN, FONT, type V, type Frame } from '../kit';
import { Ground, Spring } from '../fisica';

/**
 * A spring balance (dinamometro), as the physics lessons draw it in TikZ (16-forze.md, `dinamometro-struttura`):
 * hung by its ring from a ceiling, a grey tube with the spring inside, the index across the tube at the spring's end,
 * the scale in newton on the right of the tube and the rod down to the hook. Not a figure: a piece for the figures
 * and the exercise scenes of the forces (group 5). A candidate for fisica.tsx once another chapter needs it.
 *
 * Geometry, from the ring's centre `ring` down (TikZ centimetres): tube top 0.15 below, zero of the scale 0.85
 * below, the scale `scaleLen` long, tube bottom 0.2 under the end of the scale. The rod is `scaleLen + 0.5` long,
 * so the hook hangs 0.3 under the tube at zero and goes down with the index. A reading over the capacity stops the
 * index 0.2 cm past the last mark, where the spring has gone beyond its scale.
 */
export type DinamometroProps = {
	f: Frame;
	/** The centre of the ring. */
	ring: V;
	/** Capacity, in newton. */
	portata: number;
	/** Number of divisions of the scale. */
	divisioni: number;
	/** A number every `ogni` divisions. */
	ogni: number;
	/** The force on the hook, in newton (it may exceed the capacity). */
	forza: number;
	/** Length of the scale in centimetres. */
	scaleLen?: number;
	/** Draw the ceiling it hangs from. */
	soffitto?: boolean;
};

export const TUBE_HALF = 0.3;

/** Where the index is and where the hook ends, for hanging things under it. */
export function dinamometroGeometry({ ring, portata, forza, scaleLen = 3 }: Pick<DinamometroProps, 'ring' | 'portata' | 'forza' | 'scaleLen'>) {
	const zero = ring.y - 0.85;
	const over = forza > portata + 1e-9;
	const drop = over ? scaleLen + 0.2 : (Math.max(0, forza) / portata) * scaleLen;
	const index = zero - drop;
	const tubeTop = ring.y - 0.15;
	const tubeBottom = zero - scaleLen - 0.2;
	const hookTop = index - (scaleLen + 0.5);
	/** The lowest point of the hook, where a thread starts. */
	const hookBottom = v(ring.x, hookTop - 0.26);
	return { zero, index, tubeTop, tubeBottom, hookTop, hookBottom, over };
}

export function Dinamometro({ f, ring, portata, divisioni, ogni, forza, scaleLen = 3, soffitto = true }: DinamometroProps) {
	const g = dinamometroGeometry({ ring, portata, forza, scaleLen });
	const x = ring.x;
	const step = scaleLen / divisioni;
	const ticks: string[] = [];
	const major: string[] = [];
	for (let i = 0; i <= divisioni; i++) {
		const y = g.zero - i * step;
		(i % ogni === 0 ? major : ticks).push(f.path([v(x + TUBE_HALF, y), v(x + TUBE_HALF - (i % ogni === 0 ? 0.2 : 0.1), y)]));
	}
	const labels = [];
	for (let i = 0; i <= divisioni; i += ogni) {
		const p = f.px(v(x + TUBE_HALF + 0.12, g.zero - i * step));
		labels.push(
			<text key={i} x={p.x} y={p.y} dy="0.35em" fontSize={10.5} fontFamily={FONT}>
				{num((portata * i) / divisioni, 3)}
			</text>
		);
	}
	const unit = f.px(v(x + TUBE_HALF + 0.12, g.zero + 0.45));
	const hookC = v(x, g.hookTop - 0.13);
	const hk = (a: number) => f.px(add(hookC, v(0.13 * Math.cos(a), 0.13 * Math.sin(a))));
	const h0 = hk(Math.PI / 2), h1 = hk((-200 * Math.PI) / 180);
	const R = 0.13 * (f.W / (f.x1 - f.x0));
	return (
		<g pointerEvents="none">
			{soffitto && (
				<>
					<Ground f={f} from={v(x + 0.9, ring.y + 0.35)} to={v(x - 0.9, ring.y + 0.35)} />
					<path d={f.path([v(x, ring.y + 0.35), v(x, ring.y + 0.15)])} stroke="#000" strokeWidth={THICK} fill="none" />
				</>
			)}
			<circle cx={f.px(ring).x} cy={f.px(ring).y} r={0.15 * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(x - TUBE_HALF, g.tubeTop), v(x + TUBE_HALF, g.tubeTop), v(x + TUBE_HALF, g.tubeBottom), v(x - TUBE_HALF, g.tubeBottom)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(x, g.tubeTop), v(x, g.tubeTop - 0.15)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<Spring f={f} from={v(x, g.tubeTop - 0.15)} to={v(x, g.index)} coils={9} />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={major.join(' ')} stroke="#000" strokeWidth={0.9} fill="none" />
			{labels}
			<text x={unit.x} y={unit.y} dy="0.35em" fontSize={10.5} fontFamily={FONT}>
				N
			</text>
			<path d={f.path([v(x, g.index), v(x, g.hookTop)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([v(x - TUBE_HALF, g.index), v(x + TUBE_HALF, g.index)])} stroke="#000" strokeWidth={1.8} fill="none" />
			<path d={`M${h0.x.toFixed(2)},${h0.y.toFixed(2)} A${R.toFixed(2)},${R.toFixed(2)} 0 1 1 ${h1.x.toFixed(2)},${h1.y.toFixed(2)}`} stroke="#000" strokeWidth={THICK} fill="none" />
		</g>
	);
}
