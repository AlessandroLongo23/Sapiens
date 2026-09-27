import Link from 'next/link';
import type { Quota } from '@/lib/zaino/config';

/** One dot per place the free plan gives, filled for each one taken. */
function Dots({ used, max }: { used: number; max: number }) {
	return (
		<span className="inline-flex gap-1" aria-hidden="true">
			{Array.from({ length: max }, (_, i) => (
				<span key={i} className={i < used ? 'size-2 rounded-full bg-accent' : 'size-2 rounded-full border border-edge-strong'} />
			))}
		</span>
	);
}

/** How much of the free plan is left. Paid plans have no ceiling, so nothing is shown. */
export function QuotaBar({ quota }: { quota: Quota }) {
	if (quota.unlimited) return null;
	const { notebooks, notes } = quota;
	return (
		<p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-subtle">
			<span className="sr-only">
				Piano gratuito: {notebooks.used} quaderno su {notebooks.max}, {notes.used} note su {notes.max}.
			</span>
			<span className="label-mono" aria-hidden="true">Piano gratuito</span>
			{notebooks.max !== null && (
				<span className="inline-flex items-center gap-1.5" aria-hidden="true">
					<Dots used={notebooks.used} max={notebooks.max} />
					<span className="font-mono text-xs">
						{notebooks.used}/{notebooks.max} {notebooks.max === 1 ? 'quaderno' : 'quaderni'}
					</span>
				</span>
			)}
			{notes.max !== null && (
				<span className="inline-flex items-center gap-1.5" aria-hidden="true">
					<Dots used={notes.used} max={notes.max} />
					<span className="font-mono text-xs">
						{notes.used}/{notes.max} note
					</span>
				</span>
			)}
			<Link href="/pricing" className="rounded font-medium text-accent-fg underline underline-offset-2 focus-ring">
				Senza limiti con un piano
			</Link>
		</p>
	);
}
