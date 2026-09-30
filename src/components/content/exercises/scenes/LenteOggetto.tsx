'use client';

import { Drawing, frame, v, add, scale, FONT, type V } from '@/components/content/interactive/kit';
import { Ray, RAY, RAY2, OpticalAxis, ThinLens, AxisPoint, Arrowhead } from '@/components/content/interactive/fisica/ottica';
import type { SceneProps } from '.';

/**
 * A thin lens and an object, for the exercises of "Le lenti sottili" and "L'occhio e gli strumenti ottici" (group 11).
 * Distances in real centimetres, with the lessons' signs (p > 0; q > 0 real image on the other side, q < 0 virtual
 * image on the object's side; f < 0 for a diverging lens). The drawing is scaled to fit. The foci are drawn only when
 * `f` is given, the image only when `q` is given (with its magnification G), the principal rays only with `raggi`:
 * the generator leaves out of the problem scene what the student has to find.
 *
 *   { type: 'lente-oggetto', data: { lente: 'convergente', p: 30, f: 10, q: 15, G: -0.5, raggi: true } }
 */
const H = 0.7; // drawn height of the object, cm
/** A distance for a label: at most one decimal, with the decimal comma. */
const fmt = (x: number) => String(Number(x.toFixed(1))).replace('.', ',');
const HALF = 1.6;
const YMAX = 2.1;

export default function LenteOggetto({ data, alt }: SceneProps) {
	const conv = data.lente !== 'divergente';
	const p = Number(data.p ?? 30);
	const fr = data.f === undefined ? null : Number(data.f);
	const q = data.q === undefined ? null : Number(data.q);
	const G = data.G === undefined ? null : Number(data.G);
	const rays = data.raggi === true && fr !== null;

	// Scale: the farthest of object, image and foci at about 4 cm from the lens.
	const reach = Math.max(p, q === null ? 0 : Math.abs(q), fr === null ? 0 : 1.3 * Math.abs(fr));
	const s = 4 / reach;
	const x0 = -Math.max(p * s, q !== null && q < 0 ? -q * s : 0, fr === null ? 0 : Math.abs(fr) * s) - 0.5;
	const x1 = Math.max(q !== null && q > 0 ? q * s : 0, fr === null ? 0 : Math.abs(fr) * s, 0.8) + 0.6;
	const f = frame(x0, x1, -YMAX - 0.1, YMAX + 0.1);
	const O = v(0, 0);
	const T = v(-p * s, H);
	const hImg = G === null ? 0 : Math.max(-YMAX, Math.min(YMAX, G * H));
	const I = q === null ? null : v(q * s, hImg);

	const toEdge = (a: V, d: V) => {
		const ts = [d.x > 1e-9 ? (f.x1 - a.x) / d.x : Infinity, d.y > 1e-9 ? (YMAX - a.y) / d.y : Infinity, d.y < -1e-9 ? (-YMAX - a.y) / d.y : Infinity];
		return add(a, scale(d, Math.max(0, Math.min(...ts))));
	};
	const fd = fr === null ? 0 : fr * s;
	const y3 = fr === null || Math.abs(p - fr) < 1e-9 ? null : (-H * fr) / (p - fr);
	const paths = rays
		? [
				{ at: v(0, H), out: v(1, -H / fd), color: RAY },
				{ at: O, out: v(1, -H / (p * s)), color: RAY2 },
				...(y3 !== null && Math.abs(y3) < HALF ? [{ at: v(0, y3), out: v(1, 0), color: RAY }] : []),
			]
		: [];
	const real = q !== null && q > 0;

	const label = (at: V, text: string) => {
		const P = f.px(at);
		return (
			<text x={P.x} y={P.y} dy="0.35em" textAnchor="middle" fontSize={12} fontFamily={FONT} pointerEvents="none">
				{text}
			</text>
		);
	};

	return (
		<Drawing f={f} label={alt}>
			<OpticalAxis f={f} x0={f.x0} x1={f.x1} />
			<ThinLens f={f} at={O} half={HALF} converging={conv} />
			{fr !== null && (
				<>
					<AxisPoint f={f} at={v(-Math.abs(fd), 0)} name="F" />
					<AxisPoint f={f} at={v(Math.abs(fd), 0)} name="F′" />
				</>
			)}
			{paths.map((r, i) => (
				<g key={i}>
					<Ray f={f} from={T} to={r.at} color={r.color} />
					<Ray f={f} from={r.at} to={toEdge(r.at, r.out)} color={r.color} arrowAt={0.3} />
					{!real && I && <Ray f={f} from={r.at} to={I} color={r.color} virtual />}
				</g>
			))}
			<Arrowhead f={f} foot={v(-p * s, 0)} h={H} />
			{I && <Arrowhead f={f} foot={v(I.x, 0)} h={I.y} image virtual={!real} />}
			{label(v(-p * s, -0.72), `${fmt(p)} cm`)}
			{I && label(v(I.x, I.y > 0 ? -0.72 : 0.3), `${fmt(Math.abs(q!))} cm`)}
		</Drawing>
	);
}
