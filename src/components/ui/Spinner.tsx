import { cn } from '@/lib/utils/cn';

/**
 * Something is on its way: a ring drawn by hand, as with a pen, that keeps
 * drawing and rubbing itself out while it turns. Sized and coloured like an
 * icon (24px unless a `size-*` says otherwise, the text colour), so it goes
 * wherever Loader2 went.
 * With reduced motion the ring is whole and only breathes.
 */
export function Spinner({ className }: { className?: string }) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cn('spinner', className)} aria-hidden="true">
			<path
				pathLength={100}
				d="M12.4 3.3c4.9-.2 8.4 3.6 8.3 8.7-.1 4.9-3.8 8.7-8.9 8.6-4.8-.1-8.4-3.9-8.2-8.8.2-4.4 3.3-8 7.9-8.5 1.2-.1 2.6 0 3.6.3"
				stroke="currentColor"
				strokeWidth="2.25"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
