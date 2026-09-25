import { useEffect } from 'react';
import { create } from 'zustand';
import { useAuth } from './auth';

/** Levels passed out of the levels a lesson offers. */
export interface LessonProgress {
	passed: number;
	total: number;
}

/** After this long the progress is asked for again the next time a page wants it. */
const FRESH_MS = 60_000;

interface ProgressState {
	/** Whose progress this is: a different user, or none, throws it away. */
	user: string | null;
	lessons: Record<string, LessonProgress> | null;
	at: number;
	inflight: Promise<void> | null;
	load: (user: string) => Promise<void>;
	/** After a run: the next page that shows progress asks again. */
	invalidate: () => void;
}

/**
 * The student's progress on the lessons, for the badges of the material's pages. Those pages are cached for
 * everybody, so the badges are added in the browser: one request per user, shared by every badge of the page and
 * kept for a minute, or until a run ends.
 */
export const progressStore = create<ProgressState>((set, get) => ({
	user: null,
	lessons: null,
	at: 0,
	inflight: null,
	load: (user) => {
		const state = get();
		if (state.user === user && state.lessons && Date.now() - state.at < FRESH_MS) return Promise.resolve();
		if (state.user === user && state.inflight) return state.inflight;
		const inflight = fetch('/api/esercizi/progressi', { cache: 'no-store' })
			.then((res) => (res.ok ? res.json() : null))
			.then((body: { lessons?: Record<string, LessonProgress> } | null) => {
				// A sign-out or another user while the request was out: the answer is not theirs.
				if (get().user !== user) return;
				set({ lessons: body?.lessons ?? {}, at: Date.now(), inflight: null });
			})
			.catch(() => {
				if (get().user === user) set({ inflight: null });
			});
		set({ user, lessons: state.user === user ? state.lessons : null, inflight });
		return inflight;
	},
	invalidate: () => set({ at: 0 })
}));

/** The signed-in student's progress by lesson database path; null while unknown or signed out. */
export function useLessonProgress(): Record<string, LessonProgress> | null {
	const { user, ready } = useAuth();
	const id = user?.id ?? null;
	const lessons = progressStore((s) => (s.user === id ? s.lessons : null));
	useEffect(() => {
		if (!ready) return;
		if (id) progressStore.getState().load(id);
		else progressStore.setState({ user: null, lessons: null, at: 0, inflight: null });
	}, [ready, id]);
	return id ? lessons : null;
}
