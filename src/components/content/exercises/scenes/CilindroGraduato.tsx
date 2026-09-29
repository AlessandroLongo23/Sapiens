'use client';

import { Drawing, frame, v, THICK, THIN, TINT, FONT } from '@/components/content/interactive/kit';
import type { SceneProps } from '.';

/**
 * A stretch of a graduated cylinder seen up close, with the water's meniscus: the bottom of the meniscus sits on
 * `livello` (mL), the ticks are `divisione` mL apart, and every `ogni` mL a tick is longer and numbered. The stretch
 * drawn goes from `da` to `a` mL (at most 25 divisions), 0,22 cm per division, as the lesson "Gli strumenti di misura"
 * draws the cylinder (menisco-parallasse). The meniscus rises by about one division at the glass.
 *
 *   { type: 'cilindro-graduato', data: { livello: 36, divisione: 1, ogni: 10, da: 25, a: 45 } }
 */
export default function CilindroGraduato({ data, alt }: SceneProps) {
	const div = Number(data.divisione ?? 1);
	const every = Number(data.ogni ?? 10 * div);
	const lo = Number(data.da ?? 0);
	const hi = Math.max(lo + div, Number(data.a ?? lo + 20 * div));
	const level = Number(data.livello ?? (lo + hi) / 2);
	const H = 0.22;
	const Y = (ml: number) => 0.2 + ((ml - lo) / div) * H;
	const W = 2.4;
	const f = frame(-0.35, W + 0.35, 0, Y(hi) + 0.25);
	const ticks: string[] = [];
	const labels: { y: number; t: string }[] = [];
	const n = Math.round((hi - lo) / div);
	for (let k = 0; k <= n; k++) {
		const ml = lo + k * div;
		const long = Math.abs(ml / every - Math.round(ml / every)) < 1e-9;
		ticks.push(f.path([v(0, Y(ml)), v(long ? 0.5 : 0.28, Y(ml))]));
		if (long) labels.push({ y: Y(ml), t: String(ml).replace('.', ',') });
	}
	const y0 = Y(level);
	const rise = 0.9 * H;
	// the meniscus: two quarter-curves from the glass down to the bottom at the middle
	const p = (x: number, y: number) => f.px(v(x, y));
	const a = p(0, y0 + rise), b = p(W / 2, y0), c = p(W, y0 + rise);
	const k1 = p(0.12 * W, y0 + 0.1 * rise), k2 = p(0.3 * W, y0);
	const k3 = p(0.7 * W, y0), k4 = p(0.88 * W, y0 + 0.1 * rise);
	const bottom = p(0, 0), bottomR = p(W, 0);
	const curve = `M${a.x},${a.y} C${k1.x},${k1.y} ${k2.x},${k2.y} ${b.x},${b.y} C${k3.x},${k3.y} ${k4.x},${k4.y} ${c.x},${c.y}`;
	return (
		<Drawing f={f} label={alt}>
			<path d={`${curve} L${bottomR.x},${bottomR.y} L${bottom.x},${bottom.y} Z`} fill={TINT.blue} stroke="none" />
			<path d={curve} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{labels.map((l) => {
				const q = p(0.62, l.y);
				return (
					<text key={l.t} x={q.x} y={q.y} dy="0.35em" textAnchor="start" fontSize={13} fontFamily={FONT}>
						{l.t}
					</text>
				);
			})}
			<path d={f.path([v(0, 0), v(0, Y(hi) + 0.25)])} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(W, 0), v(W, Y(hi) + 0.25)])} stroke="#000" strokeWidth={THICK} />
			<text x={p(W - 0.1, Y(hi) + 0.05).x} y={p(W - 0.1, Y(hi) + 0.05).y} textAnchor="end" fontSize={13} fontFamily={FONT}>
				mL
			</text>
		</Drawing>
	);
}
