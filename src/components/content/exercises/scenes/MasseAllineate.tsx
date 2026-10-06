'use client';

import { Drawing, Label, frame, v, FONT_SIZE, THIN, DASH } from '@/components/content/interactive/kit';
import { Ball } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * Bodies on a line that attract one another (lesson 94, group 36): each body is a ball on a dashed line, with its
 * name and its mass above it, and the distances between neighbours are quoted under the line. `x` is the position
 * along the line from 0 to 1 (the line is 5,4 cm long); two neighbours are never drawn closer than 1,3 cm, so the
 * drawing is not to scale when one distance is much smaller than the other. No force is drawn: the forces are what
 * the exercise asks.
 *
 *   { type: 'masse-allineate', data: { corpi: [{ x: 0, nome: 'A', massa: '45 kg' }, { x: 0.3, nome: 'B', massa: '12 kg' },
 *       { x: 1, nome: 'C', massa: '78 kg' }], quote: ['1,2 m', '2,8 m'] } }
 */

type Corpo = { x: number; nome: string; massa: string };
const L = 5.4;
const MIN = 1.3;
const S = FONT_SIZE * 0.85;

export default function MasseAllineate({ data, alt }: SceneProps) {
	const corpi = (Array.isArray(data.corpi) ? data.corpi : []) as Corpo[];
	const quote = (Array.isArray(data.quote) ? data.quote : []) as string[];
	// positions in cm, pushed apart where two neighbours would touch
	const xs = corpi.map((c) => Math.min(1, Math.max(0, Number(c.x))) * L);
	for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + MIN);
	for (let i = xs.length - 2; i >= 0; i--) xs[i] = Math.min(xs[i], xs[i + 1] - MIN);
	const end = xs.length ? xs[xs.length - 1] : L;
	const f = frame(-0.9, end + 0.9, -1.35, 1.25);
	const y0 = -0.6;

	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(0, 0), v(end, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			{corpi.map((c, i) => (
				<g key={i}>
					<Ball f={f} at={v(xs[i], 0)} r={0.2} />
					<Label f={f} at={v(xs[i], 0.25)} dir={v(0, 1)}>{c.nome}</Label>
					<Label f={f} at={v(xs[i], 0.68)} dir={v(0, 1)} upright size={S}>{c.massa}</Label>
				</g>
			))}
			{xs.slice(1).map((x, i) => (
				<g key={i}>
					<path d={`${f.path([v(xs[i], y0), v(x, y0)])} ${f.path([v(xs[i], y0 - 0.08), v(xs[i], y0 + 0.08)])} ${f.path([v(x, y0 - 0.08), v(x, y0 + 0.08)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
					{typeof quote[i] === 'string' && <Label f={f} at={v((xs[i] + x) / 2, y0)} dir={v(0, -1)} upright size={S}>{quote[i]}</Label>}
				</g>
			))}
		</Drawing>
	);
}
