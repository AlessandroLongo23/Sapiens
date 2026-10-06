'use client';

import { memo, useMemo } from 'react';
import { Drawing, Dot, Label, frame, v, num, THICK, THIN, DASH, INK } from '@/components/content/interactive/kit';

type Point = { t: number; y: number };

/** Round numbers that cover lo..hi in about `about` steps: 0; 0,5; 1; … */
function ticks(lo: number, hi: number, about = 4) {
	const span = hi - lo || 1;
	const mag = 10 ** Math.floor(Math.log10(span / about));
	const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= about + 0.5) ?? 10 * mag;
	const from = Math.floor(lo / step + 1e-9) * step, to = Math.ceil(hi / step - 1e-9) * step;
	const all: number[] = [];
	for (let x = from; x <= to + step / 2; x += step) all.push(Math.abs(x) < step / 1e6 ? 0 : x);
	return all;
}

/**
 * A quantity of a body against time. With `ahead`, the whole course worked out before the scene starts, the axes are
 * set once on its extremes and it is drawn dashed; the part already lived is drawn over it, solid and thicker, up to
 * the dot of the instant shown: the curve grows along a path that is already there, and the axes stay still. Without
 * `ahead` the axes follow the curve. A grid and numbered ticks on both axes.
 */
/** The same chart, drawn again only when what it is given changes: the editor hands it new points every few frames. */
export const LiveChart = memo(TimeChart);

export function TimeChart({ points, ahead, at, name, unit: unitName, label, w: W = 6.4, h: H = 2.6 }: { points: Point[]; /** The course from the start to the end, known in advance. */ ahead?: Point[] | null; at: number; name: string; unit: string; label: string; /** The plot's size, cm. */ w?: number; h?: number }) {
	const f = frame(-1.2, W + 0.5, -1.05, H + 0.55);
	const all = ahead?.length ? [...ahead, ...points] : points;
	let lo = Math.min(0, ...all.map((p) => p.y));
	let hi = Math.max(0, ...all.map((p) => p.y));
	// rounding leaves a velocity of -1e-17 on a body at rest: that is zero, not a negative axis
	if (lo > -1e-9) lo = 0;
	if (hi < 1e-9) hi = 0;
	if (hi - lo < 1e-9) hi = lo + 1;
	const ys = ticks(lo, hi);
	const ts = ticks(0, Math.max(1, ...all.map((p) => p.t)));
	const y0 = ys[0], y1 = ys[ys.length - 1], t1 = ts[ts.length - 1];
	const X = (t: number) => (t / t1) * W;
	const Y = (y: number) => ((y - y0) / (y1 - y0)) * H;
	const now = points[Math.min(at, points.length - 1)];
	const lived = points.slice(0, Math.min(at, points.length - 1) + 1);
	const line = (ps: Point[]) => f.path(ps.map((p) => v(X(p.t), Y(p.y))));

	// What does not move with the clock (grid, axes, numbers, the course ahead) is built once for a given set of axes.
	const axes = `${ys.join()}|${ts.join()}`;
	const still = useMemo(
		() => (
			<>
			<path d={[...ts.map((t) => f.path([v(X(t), 0), v(X(t), H)])), ...ys.map((y) => f.path([v(0, Y(y)), v(W, Y(y))]))].join(' ')} stroke="#000" strokeOpacity={0.1} strokeWidth={THIN} fill="none" />
			<path d={[...ts.map((t) => f.path([v(X(t), Y(0) - 0.07), v(X(t), Y(0) + 0.07)])), ...ys.map((y) => f.path([v(-0.07, Y(y)), v(0.07, Y(y))]))].join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={`${f.path([v(0, 0), v(0, H)])} ${f.path([v(0, Y(0)), v(W, Y(0))])}`} stroke="#000" strokeWidth={THIN} fill="none" />
			{ahead && ahead.length > 1 && <path d={line(ahead)} stroke={INK.blue} strokeOpacity={0.55} strokeWidth={THIN * 1.5} strokeDasharray={DASH} fill="none" strokeLinejoin="round" />}
			{ys.map((y) => <Label key={`y${y}`} f={f} at={v(-0.05, Y(y))} dir={v(-1, 0)} size={11} upright>{num(y, 2)}</Label>)}
			{ts.map((t) => <Label key={`t${t}`} f={f} at={v(X(t), Math.min(0, Y(0)) - 0.05)} dir={v(0, -1)} size={11} upright>{num(t, 2)}</Label>)}
			<Label f={f} at={v(W / 2, Math.min(0, Y(0)) - 0.45)} dir={v(0, -1)} size={11} upright>tempo (s)</Label>
			<Label f={f} at={v(W / 2, H + 0.08)} dir={v(0, 1)} size={12} upright>{`${name} (${unitName})`}</Label>
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- `axes` stands for ys and ts, and with them for the scales
		[axes, ahead, name, unitName, W, H]
	);

	return (
		<Drawing f={f} label={label}>
			{still}
			{lived.length > 1 && <path d={line(lived)} stroke={INK.blue} strokeWidth={THICK * 1.4} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
			{now && <Dot f={f} at={v(X(now.t), Y(now.y))} color={INK.red} r={3} />}
		</Drawing>
	);
}
