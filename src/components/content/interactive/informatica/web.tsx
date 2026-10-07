'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The web pieces of the computer science kit (docs/lezioni/informatica/README.md, "Figure interattive").
 */

export type Scatola = { /** `width` and `height` as written in the CSS, in pixels. */ width: number; height: number; padding: number; border: number; margin: number; /** `box-sizing: border-box`: width and height include padding and border. */ borderBox?: boolean };

/** The sizes of a box as the browser computes them from its CSS. */
export function misure({ width, height, padding, border, margin, borderBox = false }: Scatola) {
	const inside = 2 * (padding + border);
	const contentW = borderBox ? Math.max(0, width - inside) : width;
	const contentH = borderBox ? Math.max(0, height - inside) : height;
	return { contentW, contentH, boxW: contentW + inside, boxH: contentH + inside, totalW: contentW + inside + 2 * margin, totalH: contentH + inside + 2 * margin };
}

/** The name of a layer, in the corner of its strip when the strip is thick enough to hold it. */
function Nome({ show, className, children }: { show: boolean; className?: string; children: ReactNode }) {
	return show ? <span className={cn('pointer-events-none absolute top-0 left-1 font-mono text-[10px] leading-[14px]', className)}>{children}</span> : null;
}

/**
 * The CSS box model drawn to scale: the margin (empty space, hatched), the border (the solid band), the padding
 * (tinted) and the content, one inside the other, with the size of the content written in it. `scala` is how many
 * pixels of the page one CSS pixel takes; `spazio` (a box with the largest values the figure allows) keeps the
 * drawing the same size while the student moves the sliders.
 */
export function ScatolaCss({ scatola, scala = 1, spazio, contenuto = 'contenuto' }: { scatola: Scatola; scala?: number; spazio?: Scatola; contenuto?: string }) {
	const m = misure(scatola);
	const room = spazio ? misure(spazio) : m;
	const k = scala;
	const { padding, border, margin } = scatola;
	return (
		<div className="flex items-center justify-center" style={{ width: room.totalW * k, height: room.totalH * k }} role="img" aria-label={`Una scatola CSS: contenuto di ${m.contentW} per ${m.contentH} pixel, padding ${padding}, bordo ${border}, margine ${margin}. In tutto occupa ${m.totalW} per ${m.totalH} pixel.`} data-scatola-css>
			{/* margin: outside the box, nothing is drawn there by the browser */}
			<div
				className="relative box-content rounded-[3px] outline-1 outline-dashed outline-edge-strong motion-safe:transition-[padding] motion-safe:duration-150"
				style={{ padding: margin * k, backgroundImage: 'repeating-linear-gradient(135deg, var(--edge) 0 1px, transparent 1px 6px)' }}
			>
				<Nome show={margin * k >= 14} className="text-fg-subtle">
					margin
				</Nome>
				{/* border and padding: the border is the band, the padding is the tinted room inside it */}
				<div className="relative box-content border-solid border-[oklch(0.7_var(--chroma)_var(--hue))] bg-tint-soft motion-safe:transition-[padding,border-width] motion-safe:duration-150" style={{ borderWidth: border * k, padding: padding * k }}>
					<Nome show={border * k >= 14} className="text-ink-950" >
						<span style={{ position: 'relative', top: -border * k, left: -border * k }}>border</span>
					</Nome>
					<Nome show={padding * k >= 14} className="text-tint-fg">
						padding
					</Nome>
					<div className="box-content flex items-center justify-center overflow-hidden border border-dashed border-tint-edge bg-surface text-center motion-safe:transition-[width,height] motion-safe:duration-150" style={{ width: Math.max(0, m.contentW * k - 2), height: Math.max(0, m.contentH * k - 2) }}>
						<span className="font-mono text-[11px] leading-tight text-fg-muted">
							{contenuto}
							<br />
							<span className="font-semibold text-fg-strong tabular-nums">
								{m.contentW} × {m.contentH}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
