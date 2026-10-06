'use client';

import type { ReactNode } from 'react';
import { v, add, sub, scale, unit, len, THICK, THIN, TINT, DASH, FONT, FONT_MATH, FONT_SIZE, type Frame, type V } from '../kit';

/**
 * The pieces of the heat-engine diagrams (third year, group 43: lessons 114-116), shared by the interactive figures
 * and by the exercises' scene `macchina-termica`: a heat reservoir, the machine as a circle, and the flows of heat and
 * work as fat arrows whose width is the energy they carry. Drawn like the TikZ figure `macchina-termica-schema-flussi`
 * of lesson 114: the hot reservoir `red!15`, the cold one `blue!10`, heat `orange!25`, work `green!15`, the machine
 * `gray!20`. Everything in TikZ centimetres, y upwards.
 */

export const FLUSSO = { caldo: TINT.red, freddo: TINT.blue, calore: TINT.orange, lavoro: TINT.green, macchina: TINT.gray } as const;

/** A heat reservoir: a box centred at `at`, with its words inside. */
export function Sorgente({ f, at, w = 3.4, h = 0.7, calda, children }: { f: Frame; at: V; w?: number; h?: number; calda: boolean; children?: ReactNode }) {
	const a = f.px(v(at.x - w / 2, at.y + h / 2)), b = f.px(v(at.x + w / 2, at.y - h / 2));
	const c = f.px(at);
	return (
		<g pointerEvents="none">
			<rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={calda ? FLUSSO.caldo : FLUSSO.freddo} stroke="#000" strokeWidth={THICK} />
			<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT}>
				{children}
			</text>
		</g>
	);
}

/** The machine: a circle with a word in it. `proibita` draws it dashed, for a device that cannot exist. */
export function Macchina({ f, at, r = 0.65, proibita = false, children }: { f: Frame; at: V; r?: number; proibita?: boolean; children?: ReactNode }) {
	const c = f.px(at);
	const e = f.px(v(at.x + r, at.y));
	return (
		<g pointerEvents="none">
			<circle cx={c.x} cy={c.y} r={e.x - c.x} fill={FLUSSO.macchina} stroke="#000" strokeWidth={THICK} strokeDasharray={proibita ? DASH : undefined} />
			<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={11} fontFamily={FONT}>
				{children}
			</text>
		</g>
	);
}

/**
 * A flow of energy: a fat arrow from `from` to the tip `to`, `w` centimetres wide. Under 0,02 cm it is not drawn (a
 * flow of zero).
 */
export function Flusso({ f, from, to, w, fill = FLUSSO.calore }: { f: Frame; from: V; to: V; w: number; fill?: string }) {
	const L = len(sub(to, from));
	if (w < 0.02 || L < 0.05) return null;
	const u = unit(sub(to, from));
	const n = v(-u.y, u.x);
	const head = Math.min(0.3, L * 0.5);
	const neck = sub(to, scale(u, head));
	const hw = w / 2, wing = w / 2 + 0.15;
	const pts = [add(from, scale(n, hw)), add(neck, scale(n, hw)), add(neck, scale(n, wing)), to, sub(neck, scale(n, wing)), sub(neck, scale(n, hw)), sub(from, scale(n, hw))];
	return <path d={f.path(pts, true)} fill={fill} stroke="#000" strokeWidth={THIN} strokeLinejoin="round" pointerEvents="none" />;
}

/**
 * A quantity's name and value in the drawing: an italic letter with an optional subscript, then upright text
 * (`Q` `c` ` = 1200 J`). Anchored like SVG text at `at`.
 */
export function Grandezza({ f, at, nome, pedice, testo = '', anchor = 'middle', size = FONT_SIZE }: { f: Frame; at: V; nome: string; pedice?: string; testo?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={size} pointerEvents="none">
			<tspan fontFamily={FONT_MATH} fontStyle="italic">{nome}</tspan>
			{pedice && (
				<tspan fontFamily={FONT_MATH} fontStyle="italic" fontSize={size * 0.7} dy="0.3em">
					{pedice}
				</tspan>
			)}
			<tspan fontFamily={FONT} dy={pedice ? '-0.21em' : undefined}>{testo}</tspan>
		</text>
	);
}
