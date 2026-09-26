'use client';

import { useEffect, useState } from 'react';
import type { NoteHit } from '@/lib/zaino/config';
import { useAuth } from '@/lib/state/auth';

/**
 * The student's own notes matching the site search, shown above the catalogue:
 * something they wrote is almost always what they meant. The request only goes
 * out for a signed-in visitor, so the search on a marketing page costs nothing.
 */
export function useNoteHits(query: string): NoteHit[] {
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

	return active && hit.term === term ? hit.notes.slice(0, 4) : [];
}
