'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * True inside the installed app (a PWA opened from the home screen, or the
 * Capacitor app). The inline script in the root layout marks `html.app`
 * before paint and it never changes afterwards. The server and the first
 * client render say false, so hydration matches; the app-only parts appear
 * right after.
 */
export function useAppMode(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => document.documentElement.classList.contains('app'),
		() => false
	);
}
