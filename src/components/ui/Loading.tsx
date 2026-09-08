import { Loader2 } from 'lucide-react';

/** What a route shows while its server work runs: a centred spinner that assistive tech announces once. */
export function Loading({ label = 'Caricamento in corso' }: { label?: string }) {
	return (
		<div className="flex min-h-[40vh] items-center justify-center p-8" role="status" aria-live="polite">
			<Loader2 className="size-8 animate-spin text-fg-subtle motion-reduce:animate-none" aria-hidden="true" />
			<span className="sr-only">{label}</span>
		</div>
	);
}
