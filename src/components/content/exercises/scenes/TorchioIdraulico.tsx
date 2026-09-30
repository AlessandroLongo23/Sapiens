'use client';

import { Drawing, Label, frame, v, TINT, THICK, THIN, DASH } from '@/components/content/interactive/kit';
import { Arrow, QTY } from '@/components/content/interactive/fisica';
import { Liquid, Piston, QuantityText, Surface, Vessel } from '@/components/content/interactive/fisica/liquidi';
import type { SceneProps } from '.';

/**
 * A hydraulic press, as the lesson "La legge di Pascal e il torchio idraulico" draws it: two cylinders of oil joined at
 * the bottom, a small piston on the left and a big one on the right. The widths follow the data: `diametri` [D1, D2]
 * (any unit) or `aree` [S1, S2] (the widths go as their square roots); the big cylinder is 2,6 cm wide.
 *
 *   { type: 'torchio-idraulico', data: { aree: [10, 500], etichette: ['S_1 = 10 cm²', 'S_2 = 500 cm²'],
 *     forza: 'F_1 = 200 N', carico: '1200 kg', spostamento: 's_1 = 20 cm' } }
 *
 * `etichette` name the two pistons; `forza` draws the push on the small piston with its label; `carico` puts a crate
 * with that text on the big one; `spostamento` draws the small piston pushed down, its rest position dashed and
 * the label beside it (the big piston is not moved: how far it rises is what the exercise asks). Only the data are
 * written: the scene never shows the answer.
 */
export default function TorchioIdraulico({ data, alt }: SceneProps) {
	const W2 = 2.6;
	const d = (data.diametri as number[] | undefined) ?? null;
	const a = (data.aree as number[] | undefined) ?? [1, 25];
	const w1 = Math.max(0.3, d ? (W2 * d[0]) / d[1] : W2 * Math.sqrt(a[0] / a[1]));
	const labels = (data.etichette as string[] | undefined) ?? [];
	const forza = typeof data.forza === 'string' ? data.forza : null;
	const carico = typeof data.carico === 'string' ? data.carico : null;
	const sposta = typeof data.spostamento === 'string' ? data.spostamento : null;

	const X1 = 0;
	const X2 = X1 + w1 + 1.2;
	const xr = X2 + W2;
	const TUBE = 0.45;
	const Y = 2.1;
	const y1 = sposta ? Y - 0.9 : Y;
	const TOP = 3.3;
	const top = carico ? Math.max(TOP, Y + 0.15 + 0.65) : TOP;
	const f = frame(X1 - 2.7, xr + 0.35, -0.25, (forza ? Math.max(top, Y + 1.25) : top) + 0.2);

	return (
		<Drawing f={f} label={alt}>
			<Liquid f={f} pts={[v(X1, y1), v(X1, 0), v(xr, 0), v(xr, Y), v(X2, Y), v(X2, TUBE), v(X1 + w1, TUBE), v(X1 + w1, y1)]} />
			<Surface f={f} from={v(X1, y1)} to={v(X1 + w1, y1)} />
			<Vessel
				f={f}
				paths={[
					[v(X1, TOP), v(X1, 0), v(xr, 0), v(xr, TOP)],
					[v(X1 + w1, TOP), v(X1 + w1, TUBE), v(X2, TUBE), v(X2, TOP)],
				]}
			/>
			<Piston f={f} x0={X1} x1={X1 + w1} y={y1} />
			<Piston f={f} x0={X2} x1={xr} y={Y} />
			{sposta && (
				<>
					<path d={f.path([v(X1 - 0.5, Y + 0.15), v(X1 + w1 + 0.2, Y + 0.15)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					<Arrow f={f} from={v(X1 - 0.3, Y + 0.15)} to={v(X1 - 0.3, y1 + 0.15)} weight="thin" />
					<QuantityText f={f} at={v(X1 - 0.45, (Y + y1) / 2 + 0.15)} anchor="end" text={sposta} />
				</>
			)}
			{carico && (
				<>
					<path d={f.path([v(X2 + 0.45, Y + 0.15), v(xr - 0.45, Y + 0.15), v(xr - 0.45, Y + 0.8), v(X2 + 0.45, Y + 0.8)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} />
					<Label f={f} at={v((X2 + xr) / 2, Y + 0.475)} upright size={13}>
						{carico}
					</Label>
				</>
			)}
			{forza && (
				<>
					<Arrow f={f} from={v(X1 + w1 / 2, y1 + 0.15 + 0.9)} to={v(X1 + w1 / 2, y1 + 0.15)} color={QTY.forza} />
					<QuantityText f={f} at={v(X1 - 0.25, y1 + 0.15 + 0.6)} anchor="end" text={forza} color={QTY.forza} />
				</>
			)}
			{labels[0] && <QuantityText f={f} at={v(X1 - 0.25, y1 - 0.3)} anchor="end" text={labels[0]} />}
			{labels[1] && <QuantityText f={f} at={v((X2 + xr) / 2, Y - 0.4)} text={labels[1]} />}
		</Drawing>
	);
}
