'use client';

import { Check, CloudOff, Loader2 } from 'lucide-react';
import { useNoteEditor } from '@/lib/state/note-editor';

const clock = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' });

/**
 * Whether the note is safe. One polite announcement per transition, so a
 * screen reader hears "Salvato" once and not a running commentary. `dirty` is
 * silent on purpose: autosave is under a second away and a permanent
 * "non salvato" would read as a fault.
 */
export function SaveStatus() {
	const { status, savedAt } = useNoteEditor();
	return (
		<p role="status" aria-live="polite" className="flex h-4 min-w-0 items-center gap-1.5 text-xs text-fg-subtle">
			{status === 'saving' && (
				<>
					<Loader2 className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
					<span>Salvataggio…</span>
				</>
			)}
			{status === 'saved' && (
				<>
					<Check className="size-3.5 shrink-0 text-ok-fg" aria-hidden="true" />
					<span className="truncate">{savedAt ? `Salvato alle ${clock.format(savedAt)}` : 'Salvato'}</span>
				</>
			)}
			{(status === 'error' || status === 'conflict') && (
				<>
					<CloudOff className="size-3.5 shrink-0 text-danger-fg" aria-hidden="true" />
					<span>Non salvato</span>
				</>
			)}
		</p>
	);
}
