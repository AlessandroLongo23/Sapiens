'use client';

import { Drawing, frame, v, TINT, THICK, THIN, FONT } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A block floating in a tank with its faces level (fis-archimede, level 5): its height `altezza` and the height
 * `immersa` of the part under the surface, both in cm and both data of the exercise, drawn to scale and marked on the
 * left and on the right with their values. The liquid is `cyan!20`, as in the lessons' TikZ.
 *
 * The labels are `testoAltezza` and `testoImmersa` when given ("6,0 cm", with the exercise's figures).
 *
 *   { type: 'galleggiante-quote', data: { altezza: 10, immersa: 6, testoAltezza: '10 cm', testoImmersa: '6,0 cm' } }
 */
const H = 1.6; // the block's height in drawing cm, whatever its real height
const W = 1.4;
const TANK = 1.6; // half width

const cm = (x: number) => `${String(Math.round(x * 100) / 100).replace('.', ',')} cm`;

export default function GalleggianteQuote({ data, alt }: SceneProps) {
	const h = Number(data.altezza ?? 10);
	const hi = Number(data.immersa ?? 5);
	const sub = (H * hi) / h;
	const surface = sub + 0.5;
	const bottom = surface - sub;
	const top = bottom + H;
	const rim = Math.max(surface + 0.4, top - 0.2);
	const f = frame(-TANK - 1.45, TANK + 1.55, -0.1, top + 0.2);
	const dim = (x: number, y0: number, y1: number) => {
		const m = (y0 + y1) / 2;
		return (
			<>
				<Arrow f={f} from={v(x, m)} to={v(x, y1)} weight="thin" />
				<Arrow f={f} from={v(x, m)} to={v(x, y0)} weight="thin" />
			</>
		);
	};
	const label = (x: number, y: number, text: string, anchor: 'start' | 'end') => {
		const p = f.px(v(x, y));
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={12} fontFamily={FONT}>
				{text}
			</text>
		);
	};
	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(-TANK, 0), v(TANK, 0), v(TANK, surface), v(-TANK, surface)], true)} fill="#ccffff" />
			<path d={f.path([v(-W / 2, bottom), v(W / 2, bottom), v(W / 2, top), v(-W / 2, top)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} />
			<path d={`${f.path([v(-TANK, surface), v(-W / 2, surface)])} ${f.path([v(W / 2, surface), v(TANK, surface)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([v(-TANK, rim), v(-TANK, 0), v(TANK, 0), v(TANK, rim)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			{/* the whole height on the left, the part under the surface on the right */}
			<path d={`${f.path([v(-W / 2, top), v(-TANK - 0.35, top)])} ${f.path([v(-W / 2, bottom), v(-TANK - 0.35, bottom)])}`} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
			{dim(-TANK - 0.25, bottom, top)}
			{label(-TANK - 0.35, (bottom + top) / 2, String(data.testoAltezza ?? cm(h)), 'end')}
			<path d={`${f.path([v(W / 2, bottom), v(TANK + 0.35, bottom)])} ${f.path([v(TANK, surface), v(TANK + 0.35, surface)])}`} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" />
			{dim(TANK + 0.25, bottom, surface)}
			{label(TANK + 0.35, (bottom + surface) / 2, String(data.testoImmersa ?? cm(hi)), 'start')}
		</Drawing>
	);
}
