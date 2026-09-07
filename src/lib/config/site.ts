import { env } from '$env/dynamic/public';

/**
 * Single source of truth for everything that depends on the public hostname.
 * Set PUBLIC_SITE_URL in the deployment environment when the custom domain is
 * attached; nothing else in the code has to change.
 */
const FALLBACK_SITE_URL = 'https://sapiens-edu.vercel.app';

export const SITE_URL: string = (env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');

export const SITE_NAME = 'Sapiens';
export const SITE_LANG = 'it';
export const SITE_LOCALE = 'it_IT';

export const DEFAULT_TITLE = 'Sapiens: materiale didattico per medie, superiori e università';
export const DEFAULT_DESCRIPTION =
	'Teoria, formulari ed esercizi svolti di matematica, fisica, chimica e informatica per scuola media, scuola superiore e università. Con Premium hai lezioni individuali.';

/** Social preview image, generated from the logo (see static/og-image.jpg). */
export const OG_IMAGE = {
	path: '/og-image.jpg',
	width: 1200,
	height: 630,
	alt: 'Sapiens, materiale didattico online per medie, superiori e università'
};

/** Optional. Rendered on the contacts page only when set. */
export const CONTACT_EMAIL: string = env.PUBLIC_CONTACT_EMAIL || '';

/** Google Search Console HTML-tag verification token, rendered only when set. */
export const GSC_VERIFICATION: string = env.PUBLIC_GSC_VERIFICATION || '';

/** Public path of the content library. */
export const CONTENT_ROOT = '/materiale';

/** Public path of the tutoring marketplace (list of tutors and their profiles). */
export const TUTORING_ROOT = '/ripetizioni';

/**
 * Path prefixes that must never be indexed: authenticated areas, checkout
 * results, API. Used by the robots meta, the X-Robots-Tag header, robots.txt
 * and the sitemap so the four cannot drift apart.
 */
export const PRIVATE_PATH_PREFIXES = [
	'/admin',
	'/api',
	'/student',
	'/home',
	'/calendar',
	'/chat',
	'/library',
	'/settings',
	'/subscription',
	'/richieste',
	'/dashboard',
	'/billing',
	'/leads',
	'/profile-editor',
	'/analytics',
	'/assignments',
	'/classes',
	'/inclusion',
	'/pricing/success',
	'/pricing/cancel'
];

export function isPrivatePath(pathname: string): boolean {
	return PRIVATE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

/**
 * Areas that need a signed-in user (the hook redirects anonymous visitors to
 * `/`). API routes and the checkout result pages handle their own state.
 */
export const AUTH_REQUIRED_PREFIXES = PRIVATE_PATH_PREFIXES.filter(
	(p) => p !== '/api' && !p.startsWith('/pricing/')
);

export function requiresLogin(pathname: string): boolean {
	return AUTH_REQUIRED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
