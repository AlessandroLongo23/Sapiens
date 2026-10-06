'use client';

import type { ReactNode } from 'react';
import { add, len, scale, sub, unit, v, K, THICK, THIN, TINT, type Frame, type V } from '../kit';
import { Words } from './calore';

/**
 * Pieces shared by the figures of the second law (group 44: lessons 117-119, frigoriferi, entropia, entropia e
 * disordine) and by their exercise scenes: a heat reservoir with its text, the machine between two reservoirs, and an
 * energy flow drawn as a band whose width is the energy (a Sankey arrow), as the TikZ figure
 * `macchina-termica-e-frigorifero` of lesson 117 draws them with plain arrows. Everything in TikZ centimetres, y
 * upwards, like the rest of the kit.
 */

/** Heat is orange (TikZ `orange!90!black`, the kit's "what stands out"), work is black, as in the lessons' figures. */
export const HEAT = '#e67300';
export const HEAT_FILL = TINT.orange;
export const WORK_FILL = TINT.gray;
export const HOT_FILL = TINT.red;
export const COLD_FILL = TINT.blue;

/** A reservoir: a rectangle centred on `at`, with one or two lines of text inside. */
export function Reservoir({ f, at, w = 3.2, h = 0.8, fill, children, second }: { f: Frame; at: V; w?: number; h?: number; fill: string; children: ReactNode; second?: ReactNode }) {
	const a = f.px(v(at.x - w / 2, at.y + h / 2));
	return (
		<g pointerEvents="none">
			<rect x={a.x} y={a.y} width={w * K} height={h * K} fill={fill} stroke="#000" strokeWidth={THICK} />
			<Words f={f} at={v(at.x, at.y + (second ? 0.17 : 0))} size={13}>
				{children}
			</Words>
			{second && (
				<Words f={f} at={v(at.x, at.y - 0.19)} size={13}>
					{second}
				</Words>
			)}
		</g>
	);
}

/** The machine: a grey disc, as `\draw[thick, fill=gray!20] (C) circle (r);`. */
export function Machine({ f, at, r = 0.55 }: { f: Frame; at: V; r?: number }) {
	const c = f.px(at);
	return <circle cx={c.x} cy={c.y} r={r * K} fill={TINT.gray} stroke="#000" strokeWidth={THICK} pointerEvents="none" />;
}

/**
 * An energy flow from `from` to `to`: a band `width` centimetres wide ending in an arrowhead. Below 0,04 cm it is
 * drawn as a thin line with a small head, so that a flow close to zero is still seen to be there.
 */
export function Flow({ f, from, to, width, fill = HEAT_FILL, stroke = HEAT }: { f: Frame; from: V; to: V; width: number; fill?: string; stroke?: string }) {
	const L = len(sub(to, from));
	if (L < 1e-6) return null;
	const u = unit(sub(to, from));
	const n = v(-u.y, u.x);
	const w = Math.max(width, 0.04) / 2;
	const head = Math.min(0.32 + w * 0.5, L * 0.6);
	const hw = w + 0.13;
	const neck = add(from, scale(u, L - head));
	const pts = [add(from, scale(n, w)), add(neck, scale(n, w)), add(neck, scale(n, hw)), to, add(neck, scale(n, -hw)), add(neck, scale(n, -w)), add(from, scale(n, -w))];
	return <path d={f.path(pts, true)} fill={fill} stroke={stroke} strokeWidth={THIN} strokeLinejoin="round" pointerEvents="none" />;
}
