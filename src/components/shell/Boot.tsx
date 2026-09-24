'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { appHistory } from '@/lib/app/navigation';
import { authStore } from '@/lib/state/auth';
import { useConsent } from '@/lib/consent/consent';
import { loadAnalyticsIfAllowed } from '@/lib/consent/analytics';
import { useSystemTheme } from '@/lib/hooks/use-theme';

/**
 * Runs once after hydration: marks the page interactive (the end-to-end
 * tests wait for it), reads the login from the cookie session (the auth
 * library loads only when a session cookie exists), reads the cookie
 * consent and starts analytics if it was given, follows the OS theme,
 * registers the service worker (public/sw.js). Not in `next dev`: a cached
 * page would hide the change being worked on. It also counts how deep the
 * student went in the app, for the back arrow (see appHistory).
 */
export function Boot() {
	const router = useRouter();
	const pathname = usePathname();
	const shown = useRef(pathname);
	const popped = useRef(false);
	useSystemTheme();
	useEffect(() => {
		const onPop = () => (popped.current = true);
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, []);
	useEffect(() => {
		if (shown.current === pathname) return;
		shown.current = pathname;
		if (popped.current) appHistory.back();
		else appHistory.forward();
		popped.current = false;
	}, [pathname]);
	useEffect(() => {
		document.documentElement.dataset.hydrated = 'true';
		authStore.setState({ refreshServer: () => router.refresh() });
		if (document.cookie.includes('-auth-token')) authStore.getState().init();
		else authStore.setState({ ready: true });
		useConsent.getState().hydrate();
		loadAnalyticsIfAllowed();
		if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {});
		}
	}, [router]);
	return null;
}
