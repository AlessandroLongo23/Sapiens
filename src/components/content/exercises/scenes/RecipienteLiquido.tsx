'use client';

import { Drawing, Label, Dot, frame, v, THIN, DASH } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { LIQUID, Liquid, QuantityText, Surface, Vessel } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A container of liquid with a point P in it, for the exercises on Stevin's law: the liquid is `livello` deep (any
 * unit) and P is either `profondita` below the free surface or `dalFondo` above the bottom, in scale. The dimension
 * lines drawn are those with a label in `etichette`: `h` (from the surface down to P, on the right), `H` (the whole
 * liquid, on the left), `y` (from the bottom up to P, on the right).
 *
 *   { type: 'recipiente-liquido', data: { livello: 1.8, dalFondo: 0.3, liquido: 'acqua',
 *     etichette: { H: '1,8 m', y: '30 cm' } } }
 *
 * The liquid is `acqua`, `olio` or `mercurio` (its fill). Only the data are labelled.
 */
export default function RecipienteLiquido({ data, alt }: SceneProps) {
	const L = Number(data.livello ?? 1);
	const depth = data.profondita !== undefined ? Number(data.profondita) : L - Number(data.dalFondo ?? L / 2);
	const fill = LIQUID[(data.liquido as keyof typeof LIQUID) ?? 'acqua'] ?? LIQUID.acqua;
	const lab = (data.etichette as Record<string, string> | undefined) ?? {};
	const W = 3;
	const LEVEL = 2.4;
	const TOP = 2.9;
	const yP = LEVEL * (1 - depth / L);
	const P = v(W * 0.45, yP);
	const XR = W + 0.35;
	const XL = -0.35;
	const f = frame(lab.H ? -2.0 : -0.3, lab.h || lab.y ? XR + 2.0 : W + 0.3, -0.25, TOP + 0.2);
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
	return (
		<Drawing f={f} label={alt}>
			<Liquid f={f} pts={[v(0, LEVEL), v(0, 0), v(W, 0), v(W, LEVEL)]} fill={fill} />
			<Surface f={f} from={v(0, LEVEL)} to={v(W, LEVEL)} />
			<Vessel f={f} pts={[v(0, TOP), v(0, 0), v(W, 0), v(W, TOP)]} />
			<path d={f.path([P, v(XR + 0.1, yP)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
			{lab.h && <path d={f.path([v(W, LEVEL), v(XR + 0.1, LEVEL)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />}
			<Dot f={f} at={P} r={2.6} />
			<Label f={f} at={P} dir={v(-0.8, 0.6)} size={14}>
				P
			</Label>
			{lab.h && dim(XR, yP, LEVEL, lab.h, 1)}
			{lab.y && dim(XR, 0, yP, lab.y, 1)}
			{lab.H && dim(XL, 0, LEVEL, lab.H, -1)}
		</Drawing>
	);
}
