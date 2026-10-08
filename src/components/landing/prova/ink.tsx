import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Reveal } from './Reveal';

/*
 * What the pen and the pencil leave on the trial landing pages: a ring round a number, an
 * arrow, a tick, a strip of tape. Every stroke carries pathLength="1" and is drawn when the
 * `Reveal` around it comes on screen (`.lp-draw` in landing.css).
 */

type Vars = CSSProperties & Record<`--${string}`, string>;
export const after = (seconds: number): Vars => ({ '--lp-d': `${seconds}s` });

/** A number in a ring of red pen, a little more than one turn and never quite closed. */
export function PenRing({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span className={cn('relative inline-flex size-12 shrink-0 items-center justify-center font-hand text-3xl font-bold leading-none text-fg-strong', className)}>
			<svg viewBox="0 0 48 48" className="lp-draw absolute inset-0 size-full text-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
				<path pathLength={1} d="M30 5.5C18 2 6 10 5 23c-1 13 9 21 20 20.500 12-.5 19-10 18-21C42 11 33 5 22 6.500" />
			</svg>
			<span className="relative">{children}</span>
		</span>
	);
}

/** A curved arrow in pencil, from the top left down to the bottom right; turn it with a class. */
export function PencilArrow({ className, delay = 0 }: { className?: string; delay?: number }) {
	return (
		<svg viewBox="0 0 64 40" className={cn('lp-draw text-(--graphite)', className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path pathLength={1} d="M3 6c22-5 44 4 54 26" style={after(delay)} />
			<path pathLength={1} d="M46 28l11 5 3-12" style={after(delay + 0.45)} />
		</svg>
	);
}

/** The teacher's tick, in red pen. */
export function PenTick({ className, delay = 0 }: { className?: string; delay?: number }) {
	return (
		<svg viewBox="0 0 32 28" className={cn('lp-draw text-accent', className)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path pathLength={1} d="M3 15c4 3 6 6 8 10C15 14 21 7 29 2" style={after(delay)} />
		</svg>
	);
}

/** A strip of paper tape; place it with a class. */
export function Tape({ className }: { className?: string }) {
	return <span className={cn('absolute h-6 w-24 bg-[#f3e2a6]/80 shadow-[0_1px_2px_rgba(60,50,20,0.15)] mix-blend-multiply dark:bg-[#e9d9a0]/60 dark:mix-blend-normal', className)} aria-hidden="true" />;
}

/** The head of a section: a mono eyebrow, the title in the serif, a line of text. */
export function SectionTitle({ eyebrow, title, lead, centered = false, className }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; centered?: boolean; className?: string }) {
	return (
		<Reveal className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
			{eyebrow && <p className="label-mono text-accent-fg">{eyebrow}</p>}
			<h2 className={cn('text-[2rem] font-semibold leading-[1.05] tracking-tight text-fg-strong sm:text-5xl lg:text-[3.4rem]', eyebrow && 'mt-2.5 sm:mt-3')}>{title}</h2>
			{lead && <p className={cn('mt-3 max-w-2xl text-[1.0625rem] leading-[1.55] text-fg-muted sm:mt-5 sm:text-lg sm:leading-relaxed', centered && 'mx-auto')}>{lead}</p>}
		</Reveal>
	);
}
