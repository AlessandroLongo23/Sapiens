'use client';

import { Fragment } from 'react';
import { FONT, INK, type Frame, type V } from './kit';

/**
 * What the figures on fractions, divisibility and percentages share: whole-number arithmetic and fractions written
 * inside the drawing the way TikZ writes `$\frac{2}{3}$` in a node, with the numerator over a bar over the denominator.
 */

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a: number, b: number) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);

/** A piece of a row of math written in the drawing: text (numbers, signs) or a fraction [numerator, denominator]. */
export type MathItem = string | [number | string, number | string];

const charWidth = (c: string) => (c === ' ' ? 0.28 : /[·=+−<>]/.test(c) ? 0.78 : c === ',' ? 0.28 : 0.5);
const textWidth = (s: string) => [...s].reduce((w, c) => w + charWidth(c), 0);
const itemWidth = (item: MathItem) => (typeof item === 'string' ? textWidth(item) : Math.max(textWidth(String(item[0])), textWidth(String(item[1]))) + 0.3);

/**
 * A row of numbers, signs and fractions set at `at`, anchored at its start, middle or end, with the fraction bars on
 * the line through `at` (TikZ's math axis). Widths are measured in ems of Latin Modern digits, close enough to centre.
 */
export function MathRow({ f, at, items, anchor = 'middle', size = 14, color = INK.black, opacity }: { f: Frame; at: V; items: MathItem[]; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string; opacity?: number }) {
	const p = f.px(at);
	const widths = items.map((it) => itemWidth(it) * size);
	const total = widths.reduce((s, w) => s + w, 0);
	const x0 = p.x - (anchor === 'middle' ? total / 2 : anchor === 'end' ? total : 0);
	// Where each item starts: the widths of those before it.
	const starts = widths.map((_, i) => x0 + widths.slice(0, i).reduce((s, w) => s + w, 0));
	const text = { fontFamily: FONT, fontSize: size, fill: color, textAnchor: 'middle' as const };
	return (
		<g pointerEvents="none" opacity={opacity}>
			{items.map((it, i) => {
				const cx = starts[i] + widths[i] / 2;
				if (typeof it === 'string')
					return (
						<text key={i} x={cx} y={p.y} dy="0.32em" {...text}>
							{it}
						</text>
					);
				const half = (widths[i] - 0.2 * size) / 2;
				return (
					<Fragment key={i}>
						<text x={cx} y={p.y - size * 0.22} {...text}>
							{it[0]}
						</text>
						<line x1={cx - half} x2={cx + half} y1={p.y} y2={p.y} stroke={color} strokeWidth={size / 22} />
						<text x={cx} y={p.y + size * 0.22} dy="0.72em" {...text}>
							{it[1]}
						</text>
					</Fragment>
				);
			})}
		</g>
	);
}

/** A signed number with the typographic minus, the Italian way: −12,5. */
export const signed = (s: string) => s.replace(/^-/, '−');
