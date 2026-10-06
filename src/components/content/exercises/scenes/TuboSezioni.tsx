'use client';

import { Drawing, frame, v, clamp, THIN, DASH, type V } from '@/components/content/interactive/kit';
import { Arrow, QTY } from '@/components/content/interactive/fisica';
import { LIQUID, Liquid, QuantityText, Vessel } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A pipe full of water with two stretches, for the exercises on the continuity equation and on Bernoulli's equation
 * (physics, third year, group 38). `rapporto` is the second diameter over the first, drawn in scale (between 0,25
 * and 4); with `salita` the second stretch is higher than the first. The labels are the data of the text: `uno` and
 * `due` under the two stretches (a section, a diameter, a pressure), `v1` and `v2` above them beside the velocity
 * arrows, `h` beside the rise.
 *
 *   { type: 'tubo-sezioni', data: { rapporto: 0.5, salita: true,
 *     etichette: { uno: 'D_1 = 4,0 cm', due: 'D_2 = 2,0 cm', v1: 'v_1 = 1,5 m/s', v2: 'v_2 = ?', h: 'h = 5,0 m' } } }
 *
 * The two arrows have the same length on purpose: the drawing must not give away the unknown speed.
 */
export default function TuboSezioni({ data, alt }: SceneProps) {
	const ratio = clamp(Number(data.rapporto ?? 1), 0.25, 4);
	const rise = Boolean(data.salita);
	const lab = (data.etichette as Record<string, string> | undefined) ?? {};
	const BIG = 0.55;
	const a = BIG * Math.min(1, 1 / ratio), b = BIG * Math.min(1, ratio);
	const y1 = 0, y2 = rise ? 1.5 : 0;
	const X = { a: 2.6, b: 3.8, end: 6.6 };
	const lower: V[] = [v(0, y1 - a), v(X.a, y1 - a), v(X.b, y2 - b), v(X.end, y2 - b)];
	const upper: V[] = [v(0, y1 + a), v(X.a, y1 + a), v(X.b, y2 + b), v(X.end, y2 + b)];
	const f = frame(-0.2, X.end + (lab.h ? 2.1 : 0.2), Math.min(y1 - a, y2 - b) - 0.75, Math.max(y1 + a, y2 + b) + 0.95);
	return (
		<Drawing f={f} label={alt}>
			<Liquid f={f} pts={[...upper, ...[...lower].reverse()]} fill={LIQUID.acqua} />
			<Vessel f={f} paths={[lower, upper]} />
			<Arrow f={f} from={v(0.5, y1 + a + 0.3)} to={v(1.2, y1 + a + 0.3)} color={QTY.velocita} />
			<Arrow f={f} from={v(X.b + 0.3, y2 + b + 0.3)} to={v(X.b + 1.0, y2 + b + 0.3)} color={QTY.velocita} />
			{lab.v1 && <QuantityText f={f} at={v(0.5, y1 + a + 0.65)} anchor="start" text={lab.v1} color={QTY.velocita} />}
			{lab.v2 && <QuantityText f={f} at={v(X.b + 0.3, y2 + b + 0.65)} anchor="start" text={lab.v2} color={QTY.velocita} />}
			{lab.uno && <QuantityText f={f} at={v(0.2, y1 - a - 0.4)} anchor="start" text={lab.uno} />}
			{lab.due && <QuantityText f={f} at={v(X.b + 0.3, y2 - b - 0.4)} anchor="start" text={lab.due} />}
			{rise && lab.h && (
				<>
					<path d={f.path([v(X.a, y1), v(X.end + 0.55, y1)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
					<path d={f.path([v(X.end, y2), v(X.end + 0.55, y2)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
					<Arrow f={f} from={v(X.end + 0.4, (y1 + y2) / 2)} to={v(X.end + 0.4, y2)} weight="thin" />
					<Arrow f={f} from={v(X.end + 0.4, (y1 + y2) / 2)} to={v(X.end + 0.4, y1)} weight="thin" />
					<QuantityText f={f} at={v(X.end + 0.55, (y1 + y2) / 2)} anchor="start" text={lab.h} />
				</>
			)}
		</Drawing>
	);
}
