'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { reconstructTree, type ContentNode } from '@/lib/utils/tree';

interface TreeState {
	levels: ContentNode[];
	full: ContentNode[] | null;
	load: () => void;
}

const Ctx = createContext<TreeState>({ levels: [], full: null, load: () => {} });

// Fetched once per visit and shared by every shell: the tree changes only when a lesson is published.
let request: Promise<ContentNode[]> | null = null;
const loadTree = () =>
	(request ??= fetch('/api/node/root')
		.then((r) => (r.ok ? r.json() : []))
		.then(reconstructTree)
		.catch(() => {
			request = null;
			return [];
		}));

/**
 * The content tree for the header and the search. The layouts pass only the
 * levels (a constant, lib/content/levels), which is all the bar and the phone
 * menu draw; the whole tree is fetched the first time the level menu or the
 * search asks for it. Inlined in the pages it weighed about 526 KB on each of
 * them, and every lesson published changed the cached copy of every page on
 * the site.
 */
export function ContentTreeProvider({ tree, children }: { tree: ContentNode[]; children: ReactNode }) {
	const [full, setFull] = useState<ContentNode[] | null>(null);
	const load = useCallback(() => {
		loadTree().then(setFull);
	}, []);
	// Another shell (the site and the library have one each) already asked for it.
	useEffect(() => {
		if (request) load();
	}, [load]);
	const state = useMemo(() => ({ levels: tree, full, load }), [tree, full, load]);
	return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

/** The levels, with everything under them once the whole tree has been fetched. */
export function useContentTree(): ContentNode[] {
	const { levels, full } = useContext(Ctx);
	return full?.length ? full : levels;
}

/** The whole tree, `null` until it has been fetched, and the call that fetches it. */
export function useFullContentTree(): { tree: ContentNode[] | null; load: () => void } {
	const { full, load } = useContext(Ctx);
	return { tree: full, load };
}
