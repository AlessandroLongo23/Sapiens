import { Spinner } from '@/components/ui/Spinner';

/**
 * What a route shows while its server work runs, announced once to assistive
 * tech. It appears only after a moment, so a page that arrives quickly does not
 * flash a loader first.
 */
export function Loading({ label = 'Caricamento in corso' }: { label?: string }) {
	return (
		<div className="loading-late flex min-h-[40vh] items-center justify-center p-8" role="status" aria-live="polite">
			<Spinner className="size-7 text-fg-subtle" />
			<span className="sr-only">{label}</span>
		</div>
	);
}
