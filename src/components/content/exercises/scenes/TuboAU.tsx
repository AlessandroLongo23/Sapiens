'use client';

import { Drawing, frame, v, FONT, THIN, DASH } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { LIQUID, Liquid, QuantityText, Surface, Vessel } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A U-tube with two liquids that do not mix, in scale: the denser one (`liquidi[1]`, density `d2`) at the bottom and in
 * the right branch, the other (`liquidi[0]`, density `d1`) poured into the left branch, a column `h1` high above the
 * interface (any unit). The first liquid stands d1·h1/d2 above the interface's plane on the right, as Stevin's law
 * says. The dashed line is that plane; the heights drawn are those with a label in `etichette` (`h1`, `h2`).
 *
 *   { type: 'tubo-a-u', data: { d1: 920, d2: 1000, h1: 12, liquidi: ['olio', 'acqua'],
 *     etichette: { h1: 'h₁ = 12 cm', h2: 'h₂ = ?' } } }
 */
export default function TuboAU({ data, alt }: SceneProps) {
	const d1 = Number(data.d1 ?? 920);
	const d2 = Number(data.d2 ?? 1000);
	const h1 = Number(data.h1 ?? 10);
	const h2 = (d1 * h1) / d2;
	const names = (data.liquidi as string[] | undefined) ?? ['olio', 'acqua'];
	const fill = (n: string) => LIQUID[n as keyof typeof LIQUID] ?? LIQUID.acqua;
	const lab = (data.etichette as Record<string, string> | undefined) ?? {};
	const W = 0.6;
	const XR = 1.8;
	const BOTTOM = 0.55;
	const yi = 1.0;
	const sc = 2.2 / Math.max(h1, h2);
	const yt = yi + h1 * sc;
	const yr = yi + h2 * sc;
	const TOP = Math.max(yt, yr) + 0.45;
	const tx = -0.35;
	const rx = XR + W + 0.35;
	const f = frame(lab.h1 ? -2.3 : -0.5, lab.h2 ? rx + 1.9 : XR + W + 0.5, -0.2, TOP + 0.15);
	const dim = (x: number, y0: number, y1: number, text: string, side: 1 | -1) => (
		<>
			{Math.abs(y1 - y0) > 0.25 && (
				<>
					<Arrow f={f} from={v(x, (y0 + y1) / 2)} to={v(x, y1)} weight="thin" />
					<Arrow f={f} from={v(x, (y0 + y1) / 2)} to={v(x, y0)} weight="thin" />
				</>
			)}
			<QuantityText f={f} at={v(x + side * 0.2, (y0 + y1) / 2)} anchor={side > 0 ? 'start' : 'end'} text={text} />
		</>
	);
	const name = (n: string, x: number, y0: number, y1: number) =>
		y1 - y0 > 0.9 ? (
			<text transform={`translate(${f.px(v(x, (y0 + y1) / 2)).x.toFixed(1)} ${f.px(v(x, (y0 + y1) / 2)).y.toFixed(1)}) rotate(-90)`} textAnchor="middle" dy="0.35em" fontSize={12} fontFamily={FONT} pointerEvents="none">
				{n}
			</text>
		) : null;
	return (
		<Drawing f={f} label={alt}>
			<Liquid f={f} pts={[v(0, yi), v(0, 0), v(XR + W, 0), v(XR + W, yr), v(XR, yr), v(XR, BOTTOM), v(W, BOTTOM), v(W, yi)]} fill={fill(names[1])} />
			<Liquid f={f} pts={[v(0, yi), v(W, yi), v(W, yt), v(0, yt)]} fill={fill(names[0])} />
			<Surface f={f} from={v(0, yi)} to={v(W, yi)} />
			<Surface f={f} from={v(0, yt)} to={v(W, yt)} />
			<Surface f={f} from={v(XR, yr)} to={v(XR + W, yr)} />
			<Vessel
				f={f}
				paths={[
					[v(0, TOP), v(0, 0), v(XR + W, 0), v(XR + W, TOP)],
					[v(W, TOP), v(W, BOTTOM), v(XR, BOTTOM), v(XR, TOP)],
				]}
			/>
			<path d={f.path([v(tx - 0.15, yi), v(rx + 0.15, yi)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.7} />
			{name(names[0], W / 2, yi, yt)}
			{name(names[1], XR + W / 2, yi, yr)}
			{lab.h1 && dim(tx, yi, yt, lab.h1, -1)}
			{lab.h2 && dim(rx, yi, yr, lab.h2, 1)}
		</Drawing>
	);
}
