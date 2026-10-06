'use client';

import { Drawing, Label, frame, v, K, FONT_SIZE, THICK, THIN, DASH, TINT } from '@/components/content/interactive/kit';
import { Ball, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * An elliptical orbit with the Sun in the left focus (lesson 93, group 36): the ellipse is drawn with its true
 * eccentricity `e` (at most 0,92) and a semi-major axis of 2,4 cm, the perihelion on the left and the aphelion on
 * the right. Under the orbit two quotes mark the distances r_p and r_a, and their values (`rp`, `ra`, strings with
 * the unit) are written below. With `vp` or `va` the body is drawn at the perihelion or at the aphelion with its
 * velocity, and the value is written with the others; the velocity at the other end is what the exercise asks, and
 * is not drawn.
 *
 *   { type: 'orbita-perielio-afelio', data: { e: 0.6, rp: '0,8 UA', ra: '3,2 UA', vp: '42 km/s' } }
 */

const A = 2.4;
const S = FONT_SIZE * 0.85;

function Sub({ name, sub, text }: { name: string; sub: string; text?: string }) {
	return (
		<>
			<tspan fontStyle="italic">{name}</tspan>
			<tspan fontSize={S * 0.7} dy={3} fontStyle="italic">{sub}</tspan>
			<tspan dy={-3}>{text ? ` = ${text}` : ''}</tspan>
		</>
	);
}

export default function OrbitaPerielioAfelio({ data, alt }: SceneProps) {
	const e = Math.min(0.92, Math.max(0, Number(data.e ?? 0.5)));
	const b = A * Math.sqrt(1 - e * e);
	const c = A * e;
	const sun = v(-c, 0), peri = v(-A, 0), aph = v(A, 0);
	const vp = typeof data.vp === 'string' ? data.vp : null;
	const va = typeof data.va === 'string' ? data.va : null;
	const y0 = -b - 0.4;
	const rows = vp || va ? 2 : 1;
	const top = Math.max(b, vp || va ? 1.2 : 0) + 0.3;
	const f = frame(-A - 0.7, A + 0.7, y0 - 0.8 - rows * 0.5, top);
	const centre = f.px(v(0, 0));
	const tick = (x: number) => f.path([v(x, y0 - 0.08), v(x, y0 + 0.08)]);

	return (
		<Drawing f={f} label={alt}>
			<ellipse cx={centre.x} cy={centre.y} rx={A * K} ry={b * K} fill="none" stroke="#000" strokeWidth={THICK} />
			<path d={f.path([peri, aph])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<Ball f={f} at={sun} r={0.15} fill={TINT.yellow} />
			<Label f={f} at={v(-c + 0.12, -0.12)} dir={v(1, -1)} upright size={S}>Sole</Label>
			{vp && <Vector f={f} from={peri} to={v(-A, -1.2)} color={QTY.velocita} name="v" sub="p" labelAt={0.6} labelDir={v(-1, 0)} />}
			{va && <Vector f={f} from={aph} to={v(A, 1.2)} color={QTY.velocita} name="v" sub="a" labelAt={0.6} labelDir={v(1, 0)} />}
			{vp && <Ball f={f} at={peri} r={0.09} />}
			{va && <Ball f={f} at={aph} r={0.09} />}
			<path d={`${f.path([v(-A, y0), v(A, y0)])} ${tick(-A)} ${tick(-c)} ${tick(A)}`} stroke="#000" strokeWidth={THIN} fill="none" />
			<Label f={f} at={v((-A - c) / 2, y0)} dir={v(0, -1)} upright size={S}><Sub name="r" sub="p" /></Label>
			<Label f={f} at={v((A - c) / 2, y0)} dir={v(0, -1)} upright size={S}><Sub name="r" sub="a" /></Label>
			<Label f={f} at={v(-1.35, y0 - 0.6)} dir={v(0, -1)} upright size={S}><Sub name="r" sub="p" text={typeof data.rp === 'string' ? data.rp : undefined} /></Label>
			<Label f={f} at={v(1.35, y0 - 0.6)} dir={v(0, -1)} upright size={S}><Sub name="r" sub="a" text={typeof data.ra === 'string' ? data.ra : undefined} /></Label>
			{(vp || va) && (
				<Label f={f} at={v(0, y0 - 1.1)} dir={v(0, -1)} upright size={S} color={QTY.velocita}><Sub name="v" sub={vp ? 'p' : 'a'} text={(vp ?? va) as string} /></Label>
			)}
		</Drawing>
	);
}
