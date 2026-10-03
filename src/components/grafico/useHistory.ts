import { useCallback, useRef, useState } from 'react';

/** How long two changes with the same tag (typing in one field, dragging one slider) count as one step. */
const MERGE_MS = 1200;
const MAX_STEPS = 100;

/**
 * A value with its past: what "undo" and "redo" step through. A change can carry a tag, and changes with the same
 * tag close in time are one step, so a formula typed letter by letter is undone whole. A silent change (tag `false`)
 * leaves no step: an animation moving a slider is not something to undo.
 */
export function useHistory<T>(initial: T | (() => T)) {
	const [state, setState] = useState(() => ({ past: [] as T[], present: typeof initial === 'function' ? (initial as () => T)() : initial, future: [] as T[] }));
	const last = useRef<{ tag: string | null; time: number }>({ tag: null, time: 0 });

	const change = useCallback((next: T | ((current: T) => T), tag?: string | false) => {
		// decided here, not in the updater, which React may run twice
		const now = Date.now();
		const silent = tag === false;
		const merge = !silent && tag !== undefined && tag === last.current.tag && now - last.current.time < MERGE_MS;
		if (!silent) last.current = { tag: tag ?? null, time: now };
		setState((s) => {
			const present = typeof next === 'function' ? (next as (current: T) => T)(s.present) : next;
			if (present === s.present) return s;
			if (silent) return { ...s, present };
			return merge ? { ...s, present, future: [] } : { past: [...s.past, s.present].slice(-MAX_STEPS), present, future: [] };
		});
	}, []);

	const undo = useCallback(() => {
		last.current = { tag: null, time: 0 };
		setState((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] } : s));
	}, []);
	const redo = useCallback(() => {
		last.current = { tag: null, time: 0 };
		setState((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s));
	}, []);

	return { value: state.present, change, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0 };
}
