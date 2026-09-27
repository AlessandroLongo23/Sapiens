'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * Light or dark. The inline script in the root layout applies the stored or
 * system theme before paint; this hook keeps `html.dark` in step afterwards.
 * Only an explicit choice (the toggle) is persisted, so a visitor who never
 * touched the toggle keeps following the OS setting.
 */
export type Theme = 'light' | 'dark';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const current = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

/** The reveal travels left to right, 15° below the horizontal; its edge is perpendicular to that. */
const TILT = Math.tan((15 * Math.PI) / 180);

let swapping = false;

export function applyTheme(theme: Theme, explicit = false): void {
	if (swapping) return;
	const root = document.documentElement;
	if (explicit) {
		localStorage.setItem('theme', theme);
		localStorage.setItem('theme-explicit', '1');
	}
	const swap = () => {
		root.classList.toggle('dark', theme === 'dark');
		notify();
	};
	root.classList.add('disable-transitions');
	const done = () => root.classList.remove('disable-transitions');

	// Only the toggle gets the reveal; following the OS stays an instant swap.
	const reveal = explicit && !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!reveal) {
		swap();
		setTimeout(done, 100);
		return;
	}
	swapping = true;

	// The new theme is a snapshot masked by a straight edge that sweeps from
	// the left of the viewport to past its right side. The edge leans with its
	// top ahead of its bottom by `lean`. The page underneath is not
	// re-rendered, so nothing on it replays its entrance.
	const w = window.innerWidth;
	const h = window.innerHeight;
	const lean = Math.ceil(h * TILT);
	const edge = (top: number) => `polygon(${-lean}px 0px, ${top}px 0px, ${top - lean}px ${h}px, ${-lean}px ${h}px)`;

	root.classList.add('theme-swap');
	const transition = document.startViewTransition(swap);
	transition.ready.then(() => {
		root.animate(
			{ clipPath: [edge(0), edge(w + lean)] },
			// Ease-out: the edge moves on the first frame after the click, so the
			// toggle feels immediate; an ease-in start reads as lag.
			{ duration: 500, easing: 'cubic-bezier(0.33, 0.5, 0.2, 1)', fill: 'forwards', pseudoElement: '::view-transition-new(root)' }
		);
	});
	transition.finished.finally(() => {
		root.classList.remove('theme-swap');
		done();
		swapping = false;
	});
}

export function useTheme(): [Theme, () => void] {
	const theme = useSyncExternalStore(
		(l) => {
			listeners.add(l);
			return () => listeners.delete(l);
		},
		current,
		() => 'light' as Theme
	);
	const toggle = useCallback(() => applyTheme(current() === 'dark' ? 'light' : 'dark', true), []);
	return [theme, toggle];
}

/** Follows the OS while the visitor has not picked a theme explicitly. Mount once. */
export function useSystemTheme(): void {
	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const follow = (e: MediaQueryListEvent) => !localStorage.getItem('theme-explicit') && applyTheme(e.matches ? 'dark' : 'light');
		media.addEventListener('change', follow);
		return () => media.removeEventListener('change', follow);
	}, []);
}
