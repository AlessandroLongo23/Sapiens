'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { MAX_NOTES } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useApi } from './useApi';

/** The tutor's own notes on a student, on a squared page, as a note of the Zaino: never shown to the student. */
export function NotesBox({ linkId, notes }: { linkId: string; notes: string }) {
	const { busy, error, call } = useApi();
	const [value, setValue] = useState(notes);
	const [saved, setSaved] = useState(notes);
	const save = async () => {
		if (await call('notes', `/api/tutoring/students/${linkId}`, 'PATCH', { notes: value })) setSaved(value);
	};
	return (
		<div className="space-y-3">
			<p className="flex items-center gap-1.5 text-sm text-fg-subtle"><Lock className="size-3.5" aria-hidden="true" /> Li vedi solo tu</p>
			{error && <Alert tone="error">{error}</Alert>}
			<div className="relative rounded-2xl border border-edge bg-surface shadow-paper">
				{/* The red margin of a notebook page. */}
				<span className="pointer-events-none absolute inset-y-0 left-10 w-px bg-accent/40" aria-hidden="true" />
				<textarea
					id="student-notes"
					aria-label="Appunti"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					maxLength={MAX_NOTES}
					placeholder="Dove fa fatica, cosa avete visto, cosa preparare per la prossima volta."
					className="note-paper block min-h-[21rem] w-full resize-y rounded-2xl bg-transparent py-6 pl-14 pr-5 leading-6 text-fg outline-none placeholder:text-fg-faint focus-visible:ring-3 focus-visible:ring-accent/20"
				/>
			</div>
			<div className="flex items-center justify-end gap-3">
				{value === saved && saved !== '' && <span className="text-sm text-fg-subtle">Salvati</span>}
				<Button variant="secondary" size="sm" loading={busy === 'notes'} disabled={value === saved} onClick={save}>Salva gli appunti</Button>
			</div>
		</div>
	);
}
