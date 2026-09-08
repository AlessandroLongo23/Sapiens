import { analyticsAllowed } from './consent';

/**
 * Vercel Web Analytics and Speed Insights are loaded only after the visitor
 * has accepted analytics, never before. Both scripts are cookieless, but
 * they still measure a person's visit, and many visitors are minors: the
 * banner's promise ("only with your consent") is kept here.
 */
let injected = false;

export async function loadAnalyticsIfAllowed(): Promise<void> {
	if (injected || typeof window === 'undefined' || !analyticsAllowed()) return;
	injected = true;
	try {
		const [{ inject }, { injectSpeedInsights }] = await Promise.all([import('@vercel/analytics'), import('@vercel/speed-insights')]);
		inject({ mode: process.env.NODE_ENV === 'development' ? 'development' : 'production' });
		injectSpeedInsights({ framework: 'next' });
	} catch (err) {
		console.error('analytics failed to load', err);
	}
}
