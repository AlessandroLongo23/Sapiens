import { create } from 'zustand';
import type { PlacedSticker } from '@/lib/zaino/stickers';

/** After this long the covers are asked for again the next time a page shows one. */
const FRESH_MS = 60_000;
const STORAGE_KEY = 'sapiens:covers';

/** Every cover the student has changed, by page path; a page missing here still has what it comes with. */
export type Covers = Record<string, PlacedSticker[]>;

interface CoversState {
	/** Whose covers these are: a different user, or none, throws them away. */
	user: string | null;
	covers: Covers | null;
	/** True once the server has answered in this visit; before that `covers` is the browser's copy. */
	fresh: boolean;
	/** A session cookie was there before the first paint (html.signed-in): until the session is read, the copy stands. */
	hinted: boolean;
	at: number;
	inflight: Promise<void> | null;
	/** The browser's copy from the last visit, to draw before the server answers. */
	restore: () => void;
	load: (user: string) => Promise<void>;
	/** After a save: the new set for one page, here and in the browser's copy. */
	put: (user: string, page: string, stickers: PlacedSticker[]) => void;
}

function persist(user: string, covers: Covers) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, covers }));
	} catch {
		// Private windows and full storage: the covers still come from the server.
	}
}

/**
 * The student's covers of the material's pages (CoverStickers). The pages are cached for everybody,
 * so the covers are added in the browser: one request for all of them, shared by every page and kept
 * for a minute, and a copy in the browser so a page draws its stickers before the request is back.
 * The database stays the source of truth: the copy is only ever a first guess.
 */
export const coversStore = create<CoversState>((set, get) => ({
	user: null,
	covers: null,
	fresh: false,
	hinted: false,
	at: 0,
	inflight: null,
	restore: () => {
		set({ hinted: document.documentElement.classList.contains('signed-in') });
		if (get().covers) return;
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as { user?: string; covers?: Covers } | null;
			if (saved?.user && saved.covers) set({ user: saved.user, covers: saved.covers, fresh: false });
		} catch {
			// No copy: the page waits for the server.
		}
	},
	load: (user) => {
		const state = get();
		if (state.user === user && state.fresh && Date.now() - state.at < FRESH_MS) return Promise.resolve();
		if (state.user === user && state.inflight) return state.inflight;
		const inflight = fetch('/api/adesivi', { cache: 'no-store' })
			.then((res) => (res.ok ? res.json() : null))
			.catch(() => null)
			.then((body: { covers?: Covers } | null) => {
				if (get().user !== user) return;
				// A failed read keeps the cover still: a save from a guessed set would overwrite the real one.
				if (!body?.covers) return void set({ inflight: null });
				set({ covers: body.covers, fresh: true, at: Date.now(), inflight: null });
				persist(user, body.covers);
			});
		// Another user's copy is not a guess for this one.
		set(state.user === user ? { inflight } : { user, covers: null, fresh: false, inflight });
		return inflight;
	},
	put: (user, page, stickers) => {
		const state = get();
		if (state.user !== user || !state.covers) return;
		const covers = { ...state.covers, [page]: stickers };
		set({ covers });
		persist(user, covers);
	}
}));

/** Signed out: nobody's covers stay in memory or in the browser. */
export function clearCovers() {
	coversStore.setState({ user: null, covers: null, fresh: false, hinted: false, at: 0, inflight: null });
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// Nothing stored.
	}
}
