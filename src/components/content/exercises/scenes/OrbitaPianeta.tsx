'use client';

import { Drawing, Label, frame, v, TINT, THICK, THIN, DASH, FONT_SIZE, type V, type Frame } from '@/components/content/interactive/kit';
import { Arrow, Ball, Point, Vector, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A planet and a body at a height above it (lessons 95-97, group 37): the planet of radius R on the left, the body at
 * r = R + h from its centre, with r always 2,6 cm long and the planet's radius in proportion to `rapporto` = r / R
 * (never under 0,3 cm). The quotes R (above the axis, inside the planet or over a small one), h (below) and r are drawn only for the values that are given, and each given value is
 * written under the drawing ("R = 6,37 · 10⁶ m"). With `orbita` the body is a satellite on its dashed circular orbit,
 * with its velocity; with `lancio` it leaves the surface with a velocity straight up. The scene draws the data,
 * never the answer.
 *
 *   { type: 'orbita-pianeta', data: { rapporto: 1.5, orbita: true, R: { m: '6,37', e: 6, u: 'm' }, h: { m: '3,19', e: 6, u: 'm' } } }
 */
type Val = { m: string; e?: number; u: string };
const isVal = (x: unknown): x is Val => typeof x === 'object' && x !== null && typeof (x as Val).m === 'string' && typeof (x as Val).u === 'string';
const D = 2.6;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const power = (e: number) => (e < 0 ? '⁻' : '') + String(Math.abs(e)).split('').map((c) => SUP[Number(c)]).join('');
const text = (name: string, x: Val) => `${name} = ${x.m}${x.e === undefined ? '' : ` · 10${power(x.e)}`} ${x.u}`;

/** A quote between two points of the axis, at height y: a thin double arrow with its letter. */
function Quote({ f, a, b, y, name, above = false }: { f: Frame; a: number; b: number; y: number; name: string; above?: boolean }) {
	const m = (a + b) / 2;
	return (
		<>
			<Arrow f={f} from={v(m, y)} to={v(a, y)} weight="thin" />
			<Arrow f={f} from={v(m, y)} to={v(b, y)} weight="thin" />
			<Label f={f} at={v(m, y)} dir={v(0, above ? 1 : -1)}>{name}</Label>
		</>
	);
}

export default function OrbitaPianeta({ data, alt }: SceneProps) {
	const ratio = Math.max(1.02, Number(data.rapporto ?? 1.5));
	const orbit = data.orbita === true;
	const launch = data.lancio === true;
	const a = Math.max(0.3, D / ratio);
	const R = isVal(data.R) ? data.R : null;
	const h = isVal(data.h) ? data.h : null;
	const r = isVal(data.r) ? data.r : null;
	const lines = [R && text('R', R), h && text('h', h), r && text('r', r)].filter((x): x is string => typeof x === 'string');

	const O = v(0, 0);
	const P: V = v(D, 0);
	const below = orbit ? D + 0.35 : a + 0.75;
	// The quote of R: inside the planet above the axis, or just above a planet too small to hold its letter.
	const yR = a >= 1 ? 0.3 : a + 0.2;
	const top = orbit ? D + 0.35 : Math.max(a + 0.3, r ? a + 0.95 + (R && a < 1 ? 0.7 : 0) : 0, R ? yR + 0.6 : 0);
	const f = frame(orbit ? -D - 0.35 : -a - 0.3, D + 0.9, -below - lines.length * 0.5 - 0.1, top);
	const k = f.W / (f.x1 - f.x0);
	const yQ = -0.35;

	return (
		<Drawing f={f} label={alt}>
			{orbit && <circle cx={f.px(O).x} cy={f.px(O).y} r={D * k} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
			<circle cx={f.px(O).x} cy={f.px(O).y} r={a * k} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([O, P])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
			<Point f={f} at={O} />
			{R && <Quote f={f} a={0} b={a} y={yR} name="R" above />}
			{h && <Quote f={f} a={a} b={D} y={yQ} name="h" />}
			{r && (
				<>
					<Quote f={f} a={0} b={D} y={orbit ? -0.35 - (h ? 0.7 : 0) : a + 0.4 + (R && a < 1 ? 0.7 : 0)} name="r" above={!orbit} />
					{!orbit && <path d={`${f.path([O, v(0, a + 0.4 + (R && a < 1 ? 0.7 : 0))])} ${f.path([P, v(D, a + 0.4 + (R && a < 1 ? 0.7 : 0))])}`} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				</>
			)}
			{orbit && <Vector f={f} from={P} to={v(D, 0.95)} color={QTY.velocita} name="v" labelDir={v(1, 0)} />}
			{launch ? (
				<>
					<Vector f={f} from={v(a, 0)} to={v(a + 0.8, 0)} color={QTY.velocita} name="v" sub="0" labelAt={0.6} labelDir={v(0, 1)} />
					<Point f={f} at={v(a, 0)} r={3} />
				</>
			) : (
				<Ball f={f} at={P} r={0.09} fill={TINT.gray} />
			)}
			{lines.map((line, i) => (
				<Label key={line} f={f} at={v((f.x0 + f.x1) / 2, -below - 0.3 - i * 0.5)} upright size={FONT_SIZE * 0.85}>
					{line}
				</Label>
			))}
		</Drawing>
	);
}
