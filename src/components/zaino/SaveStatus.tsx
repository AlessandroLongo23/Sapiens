'use client';

import { Check, CloudOff } from 'lucide-react';
import { useNoteEditor } from '@/lib/state/note-editor';
import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/Spinner';

const clock = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' });

/**
 * Whether the note is safe. One polite announcement per transition, so a
 * screen reader hears "Salvato" once and not a running commentary. `dirty` is
 * silent on purpose: autosave is under a second away and a permanent
 * "non salvato" would read as a fault.
 */
export function SaveStatus({ compact = false }: { compact?: boolean }) {
	const { status, savedAt } = useNoteEditor();
	return (
		<p role="status" aria-live="polite" className={cn('flex h-4 min-w-0 items-center gap-1.5 text-xs text-fg-subtle', compact && 'shrink-0')}>
			{status === 'saving' && (
				<>
					<Spinner className="size-3.5 shrink-0" />
					<span className={cn(compact && 'sr-only sm:not-sr-only')}>Salvataggio…</span>
				</>
			)}
			{status === 'saved' && (
				<>
					<Check className="size-3.5 shrink-0 text-ok-fg" aria-hidden="true" />
					<span className={cn('truncate', compact && 'sr-only sm:not-sr-only')} title={savedAt ? `Salvato alle ${clock.format(savedAt)}` : undefined}>
						{compact ? 'Salvato' : savedAt ? `Salvato alle ${clock.format(savedAt)}` : 'Salvato'}
					</span>
				</>
			)}
			{(status === 'error' || status === 'conflict') && (
				<>
					<CloudOff className="size-3.5 shrink-0 text-danger-fg" aria-hidden="true" />
					<span className={cn(compact && 'sr-only sm:not-sr-only')}>Non salvato</span>
				</>
			)}
		</p>
	);
}
