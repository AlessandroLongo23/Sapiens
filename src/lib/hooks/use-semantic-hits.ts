'use client';

import { useEffect, useState } from 'react';
import type { SemanticHit } from '@/lib/search/rank';

/**
 * The lesson sections near a question in meaning (/api/search/semantic), for
 * the site search. Asked after a pause in typing and only when `wanted`: a
 * short title search is answered by the words alone, and costs nothing.
 */
export function useSemanticHits(query: string, wanted: boolean): { hits: SemanticHit[]; pending: boolean } {
	const term = query.trim().toLowerCase().replace(/\s+/g, ' ');
	const active = wanted && term.length >= 4;
	// Kept with its term, so the answer to an older question is never shown for a newer one.
	const [hit, setHit] = useState<{ term: string; hits: SemanticHit[] }>({ term: '', hits: [] });

	useEffect(() => {
		if (!active) return;
		const controller = new AbortController();
		const timer = setTimeout(() => {
			fetch(`/api/search/semantic?q=${encodeURIComponent(term)}`, { signal: controller.signal })
				.then((r) => (r.ok ? r.json() : []))
				.then((hits: SemanticHit[]) => setHit({ term, hits }))
				.catch(() => {});
		}, 350);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [term, active]);

	if (!active) return { hits: [], pending: false };
	return hit.term === term ? { hits: hit.hits, pending: false } : { hits: [], pending: true };
}
