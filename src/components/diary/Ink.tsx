import { cn } from '@/lib/utils/cn';

/**
 * What a pen leaves on the diary's paper, drawn as strokes: a box ticked by hand, a loop around a date, a line
 * through what is done, tally marks. Every stroke has pathLength 1, so `.ink-draw` writes it once when it appears.
 * Decorative: the text next to each says what it means.
 */

/** A square drawn by hand, and the tick in it when `checked`. */
export function HandBox({ checked, className }: { checked: boolean; className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={cn('size-6 shrink-0 overflow-visible', className)} aria-hidden="true">
			<path
				d="M4.2 5.1c4.8-.7 10.1-.9 15.3-.4.5 4.9.6 9.8.1 14.6-5 .6-10.2.5-15.2.1-.5-4.7-.6-9.5-.2-14.3Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinejoin="round"
				className="opacity-60"
			/>
			{checked && (
				<path
					d="M6.5 12.8c1.6 1.2 2.9 2.7 4 4.6 2.5-5.3 5.9-9.6 10.6-13.4"
					fill="none"
					stroke="var(--pen)"
					strokeWidth="2.6"
					strokeLinecap="round"
					strokeLinejoin="round"
					pathLength={1}
					className="ink-draw"
				/>
			)}
		</svg>
	);
}

/** A loop drawn around what is inside the positioned parent, as a student circles a date. */
export function HandCircle({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 100 60"
			preserveAspectRatio="none"
			className={cn('pointer-events-none absolute -left-2 -top-0.5 h-[calc(100%+0.1rem)] w-[calc(100%+1rem)] overflow-visible max-sm:-left-1 max-sm:w-[calc(100%+0.5rem)]', className)}
			aria-hidden="true"
		>
			<path
				d="M58 4C30 1 5 10 4 30s25 27 50 26 43-9 42-28C95 12 72 3 44 6"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				pathLength={1}
				className="ink-draw"
			/>
		</svg>
	);
}

/** A line through words that are done, a little wavy, over the positioned parent. */
export function Strike() {
	return (
		<svg
			viewBox="0 0 100 10"
			preserveAspectRatio="none"
			className="pointer-events-none absolute inset-x-[-2px] top-[52%] h-2.5 w-[calc(100%+4px)] -translate-y-1/2 overflow-visible"
			aria-hidden="true"
		>
			<path d="M1 6c14-2 26 1 40-1s30-2 44 0 11-1 14-1" fill="none" stroke="var(--pen)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="ink-draw" />
		</svg>
	);
}

/** Tally marks for the days in a row, in groups of five with the fifth across; past thirty only the number is written. */
export function Tally({ count, className }: { count: number; className?: string }) {
	const shown = Math.min(count, 30);
	const groups = Math.ceil(shown / 5);
	return (
		<span className={cn('inline-flex flex-wrap items-center gap-2', className)} aria-hidden="true">
			{Array.from({ length: groups }, (_, g) => {
				const n = Math.min(5, shown - g * 5);
				return (
					<svg key={g} viewBox="0 0 30 28" className="h-7 w-[30px] overflow-visible">
						{Array.from({ length: Math.min(n, 4) }, (_, i) => (
							<path
								key={i}
								d={`M${4 + i * 6.5} ${3 + (i % 2)}c.6 7 .3 14 .9 ${21 - (i % 3)}`}
								fill="none"
								stroke="var(--pen)"
								strokeWidth="2.2"
								strokeLinecap="round"
								pathLength={1}
								className="ink-draw"
								style={{ ['--d' as string]: `${(g * 5 + i) * 0.05}s` }}
							/>
						))}
						{n === 5 && (
							<path
								d="M1 19c9-4 18-8 28-13"
								fill="none"
								stroke="var(--pen)"
								strokeWidth="2.2"
								strokeLinecap="round"
								pathLength={1}
								className="ink-draw"
								style={{ ['--d' as string]: `${(g * 5 + 4) * 0.05}s` }}
							/>
						)}
					</svg>
				);
			})}
		</span>
	);
}

/** A strip of paper tape, as holds a note on a page. */
export function Tape({ className }: { className?: string }) {
	return <span className={cn('diary-tape', className)} aria-hidden="true" />;
}

/** A pencil arrow curving down to the right, pointing from a note in the margin to what it is about. */
export function Arrow({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 40 30" className={cn('h-6 w-8 overflow-visible', className)} aria-hidden="true">
			<path d="M3 4c10 1 22 6 30 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className="ink-draw" />
			<path d="M26 22.5l7.3 1.2 1-7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
