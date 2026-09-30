'use client';

import { Label, v, TINT, THICK, THIN, DASH, FONT_SIZE, type Frame, type V } from '../kit';
import { VecLabel } from '../fisica';

/**
 * The energy bars of the second-year energy figures (group 18: MontagneRusseEnergia, PendoloEnergia,
 * MollaLancioRampa): vertical bars standing on a base line, one per form of energy, and a last stacked bar with all of
 * them, whose top does not move while the energy is conserved. Drawn inside the figure's <Drawing>, in TikZ
 * centimetres, with the tints of the TikZ bar figures of lessons 63 and 64 (`orange!25` for the gravitational
 * potential energy, `blue!10` for the kinetic energy, `red!15` for the dissipated energy, `green!15` for the elastic
 * one). `scale` is centimetres per unit of energy; `total` draws a dashed line at that level across all the bars.
 */

export const ENERGY_FILL = { K: TINT.blue, U: TINT.orange, Uel: TINT.green, diss: TINT.red } as const;

export type Bar = { value: number; fill: string; name: string; sub?: string; upright?: boolean };

export const BAR_W = 0.42;
export const BAR_GAP = 0.26;

/** Width of a set of `n` bars plus the stacked one. */
export const barsWidth = (n: number) => (n + 1) * BAR_W + n * BAR_GAP;

export function EnergyBars({ f, at, bars, scale, total, totalName = 'tot.' }: { f: Frame; at: V; bars: Bar[]; scale: number; total?: number; totalName?: string }) {
	const rect = (x: number, y0: number, h: number, fill: string, key: string) => {
		if (h < 0.004) return null;
		const a = f.px(v(x, y0 + h)), b = f.px(v(x + BAR_W, y0));
		return <rect key={key} x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={fill} stroke="#000" strokeWidth={THIN} />;
	};
	const xs = bars.map((_, i) => at.x + i * (BAR_W + BAR_GAP));
	const xt = at.x + bars.length * (BAR_W + BAR_GAP);
	let y = at.y;
	const stack = bars.map((b, i) => {
		const h = Math.max(0, b.value) * scale;
		const r = rect(xt, y, h, b.fill, `s${i}`);
		y += h;
		return r;
	});
	const right = xt + BAR_W;
	return (
		<g pointerEvents="none">
			{bars.map((b, i) => rect(xs[i], at.y, Math.max(0, b.value) * scale, b.fill, `b${i}`))}
			{stack}
			<path d={f.path([v(at.x - 0.1, at.y), v(right + 0.1, at.y)])} stroke="#000" strokeWidth={THICK} fill="none" />
			{total !== undefined && <path d={f.path([v(at.x - 0.1, at.y + total * scale), v(right + 0.1, at.y + total * scale)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			{bars.map((b, i) =>
				b.upright ? (
					<Label key={`l${i}`} f={f} at={v(xs[i] + BAR_W / 2, at.y - 0.02)} dir={v(0, -1)} upright size={FONT_SIZE * 0.72}>
						{b.name}
					</Label>
				) : (
					<VecLabel key={`l${i}`} f={f} at={v(xs[i] + BAR_W / 2, at.y - 0.02)} dir={v(0, -1)} name={b.name} sub={b.sub} bare size={FONT_SIZE * 0.9} />
				)
			)}
			{totalName.length === 1 ? (
				<VecLabel f={f} at={v(xt + BAR_W / 2, at.y - 0.02)} dir={v(0, -1)} name={totalName} bare size={FONT_SIZE * 0.9} />
			) : (
				<Label f={f} at={v(xt + BAR_W / 2, at.y - 0.02)} dir={v(0, -1)} upright size={FONT_SIZE * 0.72}>
					{totalName}
				</Label>
			)}
		</g>
	);
}
