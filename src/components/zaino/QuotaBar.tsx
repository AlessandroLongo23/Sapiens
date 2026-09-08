import Link from 'next/link';
import type { Quota } from '@/lib/zaino/config';

/** How much of the free plan is left. Paid plans have no ceiling, so nothing is shown. */
export function QuotaBar({ quota }: { quota: Quota }) {
	if (quota.unlimited) return null;
	const { notebooks, notes } = quota;
	return (
		<p className="text-sm text-fg-subtle">
			Piano gratuito: {notebooks.used} quaderno su {notebooks.max}, {notes.used} note su {notes.max}.{' '}
			<Link href="/pricing" className="rounded font-medium text-accent-fg underline underline-offset-2 focus-ring">
				Passa a un piano superiore
			</Link>{' '}
			per non avere limiti.
		</p>
	);
}
