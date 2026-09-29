'use client';

import { Drawing, frame, v, TINT, THICK, THIN, FONT } from '@/components/content/interactive/kit';
import { Ground, Spring } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * The same spring twice beside a ruler in centimetres, both hanging from the ceiling at the ruler's zero: on the left
 * at rest, `l0` long; on the right with a body hanging from it, `l` long (fis-forza-elastica, level 4). The lengths
 * are read on the ruler, which has a mark every centimetre and a number every 5, up to `righello` cm. Drawn at a
 * fifth of real size.
 *
 *   { type: 'molla-righello', data: { l0: 12, l: 16, righello: 25 } }
 */
const S = 0.2;

export default function MollaRighello({ data, alt }: SceneProps) {
	const l0 = Number(data.l0 ?? 10);
	const l = Number(data.l ?? 15);
	const max = Number(data.righello ?? Math.ceil((l + 3) / 5) * 5);
	const bottom = -max * S;
	const f = frame(-0.75, 2.6, Math.min(bottom, -l * S - 0.55) - 0.55, 0.45);
	const ticks: string[] = [];
	for (let c = 0; c <= max; c++) {
		const y = -c * S;
		const w = c % 5 === 0 ? 0.2 : 0.11;
		ticks.push(f.path([v(0.45, y), v(0.45 + w, y)]), f.path([v(1.35, y), v(1.35 - w, y)]));
	}
	const labels = [];
	for (let c = 5; c <= max; c += 5) {
		const p = f.px(v(0.9, -c * S));
		labels.push(
			<text key={c} x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={10.5} fontFamily={FONT}>
				{c}
			</text>,
		);
	}
	const caption = (x: number, text: string) => {
		const p = f.px(v(x, f.y0 + 0.12));
		return (
			<text x={p.x} y={p.y} textAnchor="middle" fontSize={10.5} fontFamily={FONT}>
				{text}
			</text>
		);
	};
	const end = -l * S;
	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(2.45, 0)} to={v(-0.6, 0)} />
			<path d={f.path([v(0.45, 0), v(1.35, 0), v(1.35, bottom), v(0.45, bottom)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={THIN} />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{labels}
			<Spring f={f} from={v(0, 0)} to={v(0, -l0 * S)} coils={10} />
			<circle cx={f.px(v(0, -l0 * S)).x} cy={f.px(v(0, -l0 * S)).y} r={2.2} fill="#000" />
			<Spring f={f} from={v(1.85, 0)} to={v(1.85, end)} coils={10} />
			<circle cx={f.px(v(1.85, end)).x} cy={f.px(v(1.85, end)).y} r={2.2} fill="#000" />
			<path d={f.path([v(1.55, end), v(2.15, end), v(2.15, end - 0.45), v(1.55, end - 0.45)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
			{caption(0, 'a riposo')}
			{caption(1.95, 'con il corpo')}
		</Drawing>
	);
}
