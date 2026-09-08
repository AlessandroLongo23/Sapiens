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

export function applyTheme(theme: Theme, explicit = false): void {
	const root = document.documentElement;
	root.classList.add('disable-transitions');
	root.classList.toggle('dark', theme === 'dark');
	if (explicit) {
		localStorage.setItem('theme', theme);
		localStorage.setItem('theme-explicit', '1');
	}
	setTimeout(() => root.classList.remove('disable-transitions'), 100);
	notify();
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
