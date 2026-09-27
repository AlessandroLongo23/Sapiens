import type { ReactNode, SVGProps } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The small drawings on the cards of the tools index: one per tool, all in one hand. The same rules as the sketches in
 * the tools (FigureSketch, SolidSketch): thin ink lines in the text colour, the part the tool finds in the accent
 * colour, a pale accent fill for the shape, dashed lines for heights, diagonals and hidden edges, letters in italic.
 * No numbers unless the tool is about digits (binary, Roman numerals): a card has to be read at a glance.
 *
 * Every drawing is on a 120 × 80 grid, with about 8 units of margin. The strokes do not scale, so a drawing keeps the
 * same line weight at any size.
 */

export const ART_W = 120;
export const ART_H = 80;

export function Art({ children, label }: { children: ReactNode; label?: string }) {
	return (
		<svg
			viewBox={`0 0 ${ART_W} ${ART_H}`}
			aria-hidden={label ? undefined : true}
			role={label ? 'img' : undefined}
			aria-label={label}
			className="h-full w-full overflow-visible text-fg"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{children}
		</svg>
	);
}

type Shape = SVGProps<SVGPathElement>;

/** A shape of the figure, filled with the pale accent. */
export const Fill = ({ className, ...p }: Shape) => <path {...p} className={cn('fill-accent/10', className)} vectorEffect="non-scaling-stroke" />;
/** The line the tool finds: the accent colour, a little heavier. */
export const Accent = ({ className, ...p }: Shape) => <path {...p} className={cn('stroke-accent', className)} strokeWidth={2} vectorEffect="non-scaling-stroke" />;
/** A plain ink line. */
export const Ink = (p: Shape) => <path {...p} vectorEffect="non-scaling-stroke" />;
/** A height, a diagonal, a hidden edge: dashed and paler. */
export const Dashed = ({ className, ...p }: Shape) => <path {...p} className={cn('stroke-fg-muted', className)} strokeWidth={1.2} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />;

export const Dot = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => <circle cx={x} cy={y} r={2.4} stroke="none" className={accent ? 'fill-accent' : 'fill-current'} />;

/** A letter or a short word, in italic like a variable; `accent` for what the tool finds, `plain` for upright text. */
export function Label({ x, y, children, accent, plain, anchor = 'middle', size = 12 }: { x: number; y: number; children: ReactNode; accent?: boolean; plain?: boolean; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
	return (
		<text
			x={x}
			y={y}
			textAnchor={anchor}
			dominantBaseline="middle"
			fontSize={size}
			stroke="none"
			// Letters in the maths italic of the formulas beside them; words and digits in the text face.
			style={plain ? undefined : { fontFamily: 'KaTeX_Math, serif' }}
			className={cn(accent ? 'fill-accent' : 'fill-fg-muted', plain && 'font-sans')}
		>
			{children}
		</text>
	);
}

/** The small square that marks a right angle at (x, y), with its sides along the directions (ux, uy) and (vx, vy). */
export function RightAngle({ x, y, u, v, k = 6 }: { x: number; y: number; u: [number, number]; v: [number, number]; k?: number }) {
	const d = `M${x + u[0] * k},${y + u[1] * k} L${x + (u[0] + v[0]) * k},${y + (u[1] + v[1]) * k} L${x + v[0] * k},${y + v[1] * k}`;
	return <path d={d} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />;
}

/** Two axes crossing at (ox, oy), with arrow tips, for the drawings on the Cartesian plane. */
export function Axes({ ox, oy }: { ox: number; oy: number }) {
	return (
		<g className="stroke-fg-muted" strokeWidth={1}>
			<path d={`M6,${oy} H114 M110,${oy - 3} L114,${oy} L110,${oy + 3}`} vectorEffect="non-scaling-stroke" />
			<path d={`M${ox},76 V4 M${ox - 3},8 L${ox},4 L${ox + 3},8`} vectorEffect="non-scaling-stroke" />
		</g>
	);
}
