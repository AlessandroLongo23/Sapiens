'use client';

import { Drawing, frame, v, num, THICK, THIN, DASH, FONT, FONT_MATH, FONT_SIZE } from '@/components/content/interactive/kit';
import { Axes } from '@/components/content/interactive/fisica';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * The temperature-heat graph of a body heated through a change of state (lesson 70, level 5 of fis-passaggi-stato),
 * drawn like the lesson's TikZ graph `grafico-temperatura-calore-acqua`: the heat Q in kJ across, the temperature
 * t in °C up, the broken line through `punti` ([Q, t] pairs, in order). Each corner has dashed lines down to the heat
 * axis and across to the temperature axis, with its value written there, so the plateau's ends can be read exactly.
 * The heat axis sits at 0 °C, or at the lowest temperature if the graph starts below zero.
 *
 *   { type: 'curva-riscaldamento', data: { punti: [[0, -20], [8.4, 0], [141, 0], [183, 40]] } }
 *
 * The scene draws the data only: the plateau's length, the latent heat or the mass are the student's to find.
 */
const W = 5.6, H = 3.0;

/** Labels on the heat axis at every corner but the origin, every other one lower when two would touch. */
function stagger(labels: { x: number; text: string }[]) {
	const out: { x: number; text: string; low: boolean }[] = [];
	labels.forEach((l, i) => {
		const prev = i ? out[i - 1] : { x: 0.2, low: false };
		out.push({ ...l, low: l.x - prev.x < 0.75 ? !prev.low : false });
	});
	return out;
}

export default function CurvaRiscaldamento({ data, alt }: SceneProps) {
	const pts = (Array.isArray(data.punti) ? data.punti : []).filter((p): p is [number, number] => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));
	if (pts.length < 2) return <p className="sr-only">{alt}</p>;
	const qmax = Math.max(...pts.map((p) => p[0]));
	const tmin = Math.min(0, ...pts.map((p) => p[1])), tmax = Math.max(...pts.map((p) => p[1]));
	const X = (qv: number) => (qv / qmax) * W;
	const Y = (tv: number) => ((tv - tmin) / (tmax - tmin)) * H;
	const f = frame(-1.05, W + 1.55, -1.15, H + 0.7);
	const at = pts.map(([qv, tv]) => v(X(qv), Y(tv)));

	const qLabels = stagger(pts.filter(([qv]) => qv > 0).map(([qv]) => ({ x: X(qv), text: num(qv, 1) })));
	// The corners' temperatures, and the axis' own when it is not too close to one of them.
	const corners = [...new Set(pts.map((p) => p[1]))];
	const temps = corners.some((tv) => Math.abs(Y(tv) - Y(tmin)) < 0.3) ? corners : [tmin, ...corners];

	return (
		<Drawing f={f} label={alt}>
			<g pointerEvents="none">
				{at.map((p, i) => (
					<g key={i}>
						{p.y > 0.01 && p.x > 0.01 && <path d={f.path([v(p.x, 0), p])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
						{p.x > 0.01 && Math.abs(Y(pts[i][1])) > 0.01 && <path d={f.path([v(0, p.y), p])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
					</g>
				))}
			</g>
			<Axes f={f} x0={-0.1} x1={W + 0.45} y0={-0.1} y1={H + 0.4} xName="" yName="" />
			<path d={f.path(at)} stroke="#1a1ab3" strokeWidth={THICK * 1.5} fill="none" strokeLinejoin="round" />
			{qLabels.map((l, i) => (
				<Words key={i} f={f} at={v(l.x, l.low ? -0.62 : -0.2)} dy="0.8em" size={12}>
					{l.text}
				</Words>
			))}
			{temps.map((tv, i) => (
				<Words key={i} f={f} at={v(-0.12, Y(tv))} anchor="end" size={12}>
					{String(tv).replace('-', '−')}
				</Words>
			))}
			<text x={f.px(v(W + 0.6, 0)).x} y={f.px(v(W + 0.6, 0)).y} dy="0.35em" textAnchor="start" fontSize={FONT_SIZE - 2} fontFamily={FONT}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">
					Q
				</tspan>{' '}
				(kJ)
			</text>
			<text x={f.px(v(0.12, H + 0.5)).x} y={f.px(v(0.12, H + 0.5)).y} textAnchor="start" fontSize={FONT_SIZE - 2} fontFamily={FONT}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">
					t
				</tspan>{' '}
				(°C)
			</text>
		</Drawing>
	);
}
