'use client';

import { Drawing, Dot, Label, frame, v, THICK, THIN, DASH, FONT, FONT_MATH, type V } from '@/components/content/interactive/kit';
import { Arrow, Axes } from '@/components/content/interactive/fisica';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * A transformation of a perfect gas in the pressure-volume plane, from the state A to the state B along one curve
 * (lesson 113, levels 2 and 6 of fis-trasformazione-adiabatica), drawn like the lesson's TikZ graphs: volume across,
 * pressure up, the curve thick with an arrowhead that gives its direction, dashed lines from A and B to the axes.
 *
 *   { type: 'curve-pv', data: { curva: 'adiabatica', gamma: 1.4, VA: 1.5, pA: 2, VB: 4.5, unitaV: 'L', unitaP: 'atm',
 *     testi: { VA: '1,50', pA: '2,00', VB: '4,50' } } }
 *
 * `curva` is 'adiabatica' (p V^gamma constant) or 'isoterma' (p V constant). The axes have no scale: only the values
 * in `testi` are written, at the feet of the dashed lines. `testi.pB` is for the solution's scene; without it B's
 * pressure is left blank, because it is what the student has to find.
 */
const W = 5.0, H = 3.3;

const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : null);
const str = (x: unknown) => (typeof x === 'string' ? x : '');

function AxisName({ at, sym, unit, f }: { at: V; sym: string; unit: string; f: ReturnType<typeof frame> }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor="start" fontSize={13} fontFamily={FONT} pointerEvents="none">
			<tspan fontFamily={FONT_MATH} fontStyle="italic">
				{sym}
			</tspan>
			{unit ? ` (${unit})` : ''}
		</text>
	);
}

export default function CurvePV({ data, alt }: SceneProps) {
	const VA = num(data.VA), pA = num(data.pA), VB = num(data.VB);
	const g = data.curva === 'isoterma' ? 1 : num(data.gamma);
	if (!VA || !pA || !VB || !g || VA === VB) return <p className="sr-only">{alt}</p>;
	const testi = (data.testi && typeof data.testi === 'object' ? data.testi : {}) as Record<string, unknown>;
	const p = (V: number) => pA * (VA / V) ** g;
	const pB = p(VB);
	const vmax = Math.max(VA, VB) * 1.1, pmax = Math.max(pA, pB) * 1.1;
	const X = (V: number) => (V / vmax) * W;
	const Y = (pp: number) => (pp / pmax) * H;
	const f = frame(-1.25, W + 1.75, -0.75, H + 0.75);
	const A = v(X(VA), Y(pA)), B = v(X(VB), Y(pB));
	const pts: V[] = [];
	for (let i = 0; i <= 40; i++) {
		const V = VA + ((VB - VA) * i) / 40;
		pts.push(v(X(V), Y(p(V))));
	}
	const dashed = (a: V, b: V) => <path d={f.path([a, b])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />;
	// The curve bends towards the origin: above and to the right of a point there is only blank paper.
	const up = v(0.75, 0.75);

	return (
		<Drawing f={f} label={alt}>
			<g pointerEvents="none">
				{dashed(v(A.x, 0), A)}
				{dashed(v(0, A.y), A)}
				{dashed(v(B.x, 0), B)}
				{str(testi.pB) && dashed(v(0, B.y), B)}
			</g>
			<Axes f={f} x0={-0.1} x1={W + 0.4} y0={-0.1} y1={H + 0.4} xName="" yName="" />
			<AxisName f={f} at={v(W + 0.5, 0)} sym="V" unit={str(data.unitaV)} />
			<AxisName f={f} at={v(0.15, H + 0.52)} sym="p" unit={str(data.unitaP)} />
			<path d={f.path(pts)} stroke="#cc0000" strokeWidth={THICK * 1.5} fill="none" strokeLinejoin="round" />
			<Arrow f={f} from={pts[17]} to={pts[22]} color="#cc0000" />
			<Dot f={f} at={A} r={2.8} />
			<Dot f={f} at={B} r={2.8} />
			<Label f={f} at={A} dir={up}>
				A
			</Label>
			<Label f={f} at={B} dir={up}>
				B
			</Label>
			<Words f={f} at={v(A.x, -0.14)} dy="0.8em" size={12}>
				{str(testi.VA)}
			</Words>
			<Words f={f} at={v(B.x, -0.14)} dy="0.8em" size={12}>
				{str(testi.VB)}
			</Words>
			<Words f={f} at={v(-0.12, A.y)} anchor="end" size={12}>
				{str(testi.pA)}
			</Words>
			{str(testi.pB) && (
				<Words f={f} at={v(-0.12, B.y)} anchor="end" size={12}>
					{str(testi.pB)}
				</Words>
			)}
		</Drawing>
	);
}
