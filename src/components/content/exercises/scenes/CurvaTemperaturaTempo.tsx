'use client';

import { Drawing, frame, v, num, THICK, THIN, FONT, FONT_MATH, FONT_SIZE } from '@/components/content/interactive/kit';
import { Axes } from '@/components/content/interactive/fisica';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * The heating or cooling curve of a chemistry exercise (group 23: chim-curve-riscaldamento), drawn like the TikZ
 * graphs of lesson 20: the time in minutes across, the temperature in °C up, the broken line through `punti`
 * ([min, °C] pairs, in order). A light grid with numbered ticks every `passoTempo` minutes and every `passoTemp`
 * degrees, so a plateau or a corner can be read on it; `temperature` adds numbered ticks at other temperatures (the
 * plateaus of a graph whose values are not on the grid), and they get a dashed line across.
 *
 *   { type: 'curva-temperatura-tempo', data: { punti: [[0, 20], [4, 80], [10, 80], [14, 160]], passoTempo: 2, passoTemp: 20 } }
 *
 * The scene draws the data only: which plateau is which, and what it means, are the student's to say.
 */
const W = 5.4, H = 3.2;

export default function CurvaTemperaturaTempo({ data, alt }: SceneProps) {
	const pts = (Array.isArray(data.punti) ? data.punti : []).filter((p): p is [number, number] => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));
	if (pts.length < 2) return <p className="sr-only">{alt}</p>;
	const dt = Number(data.passoTempo) > 0 ? Number(data.passoTempo) : 2;
	const dT = Number(data.passoTemp) > 0 ? Number(data.passoTemp) : 20;
	const extra = (Array.isArray(data.temperature) ? data.temperature : []).filter((x): x is number => Number.isFinite(x));
	const tmax = Math.ceil(Math.max(...pts.map((p) => p[0])) / dt) * dt;
	const lo = Math.floor(Math.min(...pts.map((p) => p[1])) / dT) * dT;
	const hi = Math.ceil(Math.max(...pts.map((p) => p[1])) / dT) * dT;
	const X = (m: number) => (m / tmax) * W;
	const Y = (T: number) => ((T - lo) / (hi - lo)) * H;
	const f = frame(-1.0, W + 0.6, -1.05, H + 0.75);
	const at = pts.map(([m, T]) => v(X(m), Y(T)));

	const xs: number[] = [];
	for (let m = dt; m <= tmax + 1e-9; m += dt) xs.push(m);
	const ys: number[] = [];
	for (let T = lo; T <= hi + 1e-9; T += dT) ys.push(T);
	const grid = [...xs.map((m) => f.path([v(X(m), 0), v(X(m), H)])), ...ys.map((T) => f.path([v(0, Y(T)), v(W, Y(T))]))];
	// Numbers on the time axis every other tick when they would touch.
	const every = (W / xs.length) < 0.55 ? 2 : 1;
	const deg = (T: number) => String(T).replace('-', '−');
	const everyT = H / (ys.length - 1) < 0.3 ? 2 : 1;

	return (
		<Drawing f={f} label={alt}>
			<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={0.4} fill="none" />
			{extra.map((T) => (
				<path key={`e${T}`} d={f.path([v(0, Y(T)), v(W, Y(T))])} stroke="#999" strokeWidth={THIN} strokeDasharray="4.5 4.5" fill="none" />
			))}
			<Axes f={f} x0={0} x1={W + 0.4} y0={0} y1={H + 0.4} xName="" yName="" />
			<path d={f.path(at)} stroke="#1a1ab3" strokeWidth={THICK * 1.5} fill="none" strokeLinejoin="round" />
			<g pointerEvents="none">
				{xs.map((m, i) => (
					<g key={`x${m}`}>
						<path d={f.path([v(X(m), 0.07), v(X(m), -0.07)])} stroke="#000" strokeWidth={THIN} />
						{(i + 1) % every === 0 && (
							<Words f={f} at={v(X(m), -0.2)} dy="0.8em" size={12}>
								{num(m, 1)}
							</Words>
						)}
					</g>
				))}
				<Words f={f} at={v(0, -0.2)} dy="0.8em" size={12}>
					0
				</Words>
				{ys.map((T, j) => (
					<g key={`y${T}`}>
						<path d={f.path([v(0.07, Y(T)), v(-0.07, Y(T))])} stroke="#000" strokeWidth={THIN} />
						{j % everyT === 0 && extra.every((e) => Math.abs(Y(e) - Y(T)) > 0.22) && (
							<Words f={f} at={v(-0.13, Y(T))} anchor="end" size={12}>
								{deg(T)}
							</Words>
						)}
					</g>
				))}
				{extra.map((T) => (
					<Words key={`t${T}`} f={f} at={v(-0.13, Y(T))} anchor="end" size={12}>
						{deg(T)}
					</Words>
				))}
			</g>
			<text x={f.px(v(W + 0.5, -0.2)).x} y={f.px(v(W + 0.5, -0.2)).y} dy="2.0em" textAnchor="end" fontSize={FONT_SIZE - 2} fontFamily={FONT}>
				tempo (min)
			</text>
			<text x={f.px(v(0.12, H + 0.55)).x} y={f.px(v(0.12, H + 0.55)).y} textAnchor="start" fontSize={FONT_SIZE - 2} fontFamily={FONT}>
				<tspan fontFamily={FONT_MATH} fontStyle="italic">
					t
				</tspan>{' '}
				(°C)
			</text>
		</Drawing>
	);
}
