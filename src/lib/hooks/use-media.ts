'use client';

import { useSyncExternalStore } from 'react';

/**
 * A media query as a boolean, false during server rendering and until the
 * first read after hydration. Components that must mount a piece of UI once
 * (not once per layout) branch on these instead of rendering both copies.
 */
export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		(onChange) => {
			const list = window.matchMedia(query);
			list.addEventListener('change', onChange);
			return () => list.removeEventListener('change', onChange);
		},
		() => window.matchMedia(query).matches,
		() => false
	);
}

/** Tailwind's breakpoints, mirrored: sm centres dialogs, md is the desktop header, lg puts the lesson sidebars beside the text. */
export const useMd = () => useMediaQuery('(min-width: 768px)');
export const useLg = () => useMediaQuery('(min-width: 1024px)');
/** Touch as the main pointer (phones and tablets). */
export const useCoarsePointer = () => useMediaQuery('(pointer: coarse)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
