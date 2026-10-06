'use client';

import type { ReactNode } from 'react';
import { Label, add, scale, sub, unit, v, TINT, THICK, type Frame, type V } from '../kit';

/**
 * A neural network as the lessons draw it: units as circles, connections as lines whose weight is read from the line
 * itself. A heavier weight is a thicker and darker line; a negative weight is dashed. A unit's activation (0 to 1)
 * tints it, and can be written inside it.
 */

export type Unita = {
	id: string;
	at: V;
	/** Its name, set beside it on the side of `lato` (default: above). */
	nome?: ReactNode;
	lato?: V;
	/** Activation between 0 and 1: tints the circle. */
	valore?: number;
	/** Written inside the circle (the activation, usually). */
	dentro?: string;
	/** Written under it (the bias). */
	sotto?: ReactNode;
};
export type Arco = { da: string; a: string; peso: number };

export const RAGGIO = 0.34;

/** Line width and grey of a weight, against the heaviest one of the network. */
export function trattoPeso(peso: number, massimo: number) {
	const t = massimo > 0 ? Math.min(1, Math.abs(peso) / massimo) : 0;
	const grigio = Math.round(175 * (1 - t));
	return { width: 0.9 + 3.1 * t, color: `rgb(${grigio},${grigio},${grigio})`, dash: peso < 0 ? '6 4' : undefined };
}

const mix = (t: number) => {
	// white to orange!25, the tint the lessons use for what must stand out
	const a = [255, 255, 255], b = [255, 223, 191];
	return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`;
};

export function Rete({ f, unita, archi, pesi = false }: { f: Frame; unita: Unita[]; archi: Arco[]; /** Write each weight beside its line. */ pesi?: boolean }) {
	const massimo = Math.max(...archi.map((a) => Math.abs(a.peso)), 0);
	const by = new Map(unita.map((u) => [u.id, u]));
	return (
		<g>
			{archi.map((a, i) => {
				const p = by.get(a.da), q = by.get(a.a);
				if (!p || !q) return null;
				const d = unit(sub(q.at, p.at));
				const da = add(p.at, scale(d, RAGGIO)), fino = sub(q.at, scale(d, RAGGIO));
				const s = trattoPeso(a.peso, massimo);
				// the number sits a third of the way along, on the left of the line, clear of the crossings in the middle
				const posto = add(add(da, scale(sub(fino, da), 0.3)), scale(v(-d.y, d.x), 0.27));
				return (
					<g key={i}>
						<path d={f.path([da, fino])} stroke={s.color} strokeWidth={s.width} strokeDasharray={s.dash} strokeLinecap="round" fill="none" />
						{pesi && <Label f={f} at={posto} upright size={12}>{String(a.peso).replace('.', ',').replace('-', '−')}</Label>}
					</g>
				);
			})}
			{unita.map((u) => {
				const c = f.px(u.at);
				return (
					<g key={u.id}>
						<circle cx={c.x} cy={c.y} r={RAGGIO * (f.W / (f.x1 - f.x0))} fill={u.valore === undefined ? TINT.gray : mix(u.valore)} stroke="#000" strokeWidth={THICK} />
						{u.dentro !== undefined && <Label f={f} at={u.at} upright>{u.dentro}</Label>}
						{u.nome && <Label f={f} at={add(u.at, scale(u.lato ?? v(0, 1), RAGGIO + 0.02))} dir={u.lato ?? v(0, 1)}>{u.nome}</Label>}
						{u.sotto && <Label f={f} at={add(u.at, v(0, -RAGGIO - 0.04))} dir={v(0, -1)} upright size={12}>{u.sotto}</Label>}
					</g>
				);
			})}
		</g>
	);
}
