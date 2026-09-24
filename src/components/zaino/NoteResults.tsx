'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NotebookPen } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteHit } from '@/lib/zaino/config';
import { useAuth } from '@/lib/state/auth';

/**
 * The student's own notes inside the site search, above the catalogue results:
 * something they wrote is almost always what they meant. The request only goes
 * out for a signed-in visitor, so the search on a marketing page costs nothing.
 */
export function NoteResults({ query, onNavigate }: { query: string; onNavigate: () => void }) {
	const user = useAuth((s) => s.user);
	// The term is kept with its results, so a stale response for a term that has
	// since been edited is simply not rendered. Clearing state from the effect
	// instead would cost a second render on every keystroke.
	const [hit, setHit] = useState<{ term: string; notes: NoteHit[] }>({ term: '', notes: [] });
	const term = query.trim();
	const active = !!user && term.length >= 2;

	useEffect(() => {
		if (!active) return;
		const controller = new AbortController();
		// Typing is faster than the round trip; the last one in wins.
		const timer = setTimeout(() => {
			fetch(`/api/zaino/cerca?q=${encodeURIComponent(term)}`, { signal: controller.signal })
				.then((r) => (r.ok ? r.json() : { notes: [] }))
				.then((payload) => setHit({ term, notes: payload.notes ?? [] }))
				.catch(() => {});
		}, 200);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [term, active]);

	const notes = hit.term === term ? hit.notes : [];
	if (!active || notes.length === 0) return null;

	return (
		<section aria-labelledby="note-trovate" className="w-full max-w-4xl">
			<h2 id="note-trovate" className="mb-2 flex items-center gap-2 px-1 text-sm font-medium text-fg-subtle">
				<NotebookPen className="size-4" aria-hidden="true" />
				Dai tuoi appunti
			</h2>
			<ul className="flex flex-col gap-1">
				{notes.slice(0, 5).map((note) => (
					<li key={note.id}>
						<Link
							href={`${ZAINO_ROOT}/nota/${note.id}`}
							onClick={onNavigate}
							className="flex items-center gap-3 rounded-xl border border-transparent p-3 no-underline transition-all hover:border-edge-strong hover:bg-surface-2 focus-ring"
						>
							<span data-notebook={note.notebook_color} className="h-8 w-1 shrink-0 rounded-full bg-tint" aria-hidden="true" />
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate font-medium text-fg">{note.title}</span>
								<span className="truncate text-sm text-fg-subtle">{note.excerpt || 'Nota vuota'}</span>
							</span>
							<span className="hidden shrink-0 text-xs text-fg-faint sm:block">{note.notebook_title}</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
