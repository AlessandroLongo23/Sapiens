import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

// Cookieless Vercel Web Analytics and Speed Insights. Both are no-ops on the
// server and only send data from production deployments.
injectAnalytics({ mode: dev ? 'development' : 'production' });
injectSpeedInsights();
