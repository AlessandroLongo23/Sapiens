/**
 * Single source of truth for everything that depends on the public hostname.
 * Set PUBLIC_SITE_URL in the deployment environment when the custom domain is
 * attached; nothing else in the code has to change. Public variables keep
 * their SvelteKit names: next.config.ts inlines them into the client bundle.
 */
const FALLBACK_SITE_URL = 'https://sapiens-edu.vercel.app';

export const SITE_URL: string = (process.env.PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');

export const SITE_NAME = 'Sapiens';
export const SITE_LANG = 'it';
export const SITE_LOCALE = 'it_IT';

export const DEFAULT_TITLE = 'Sapiens: materiale didattico per medie, superiori e università';
export const DEFAULT_DESCRIPTION =
	'Teoria, formulari ed esercizi svolti di matematica, fisica, chimica e informatica per scuola media, scuola superiore e università. Con Premium hai lezioni individuali.';

/** Social preview image, generated from the logo (see public/og-image.jpg). */
export const OG_IMAGE = {
	path: '/og-image.jpg',
	width: 1200,
	height: 630,
	alt: 'Sapiens, materiale didattico online per medie, superiori e università'
};

/** Optional. Rendered on the contacts page only when set. */
export const CONTACT_EMAIL: string = process.env.PUBLIC_CONTACT_EMAIL || '';

/** Google Search Console HTML-tag verification token, rendered only when set. */
export const GSC_VERIFICATION: string = process.env.PUBLIC_GSC_VERIFICATION || '';

/** Public path of the content library. */
export const CONTENT_ROOT = '/materiale';

/** Public path of the tutoring marketplace (list of tutors and their profiles). */
export const TUTORING_ROOT = '/ripetizioni';

/** Path of the student's backpack: quaderni and note. */
export const ZAINO_ROOT = '/zaino';

/**
 * Where the installed app (PWA or Capacitor) opens, in place of the landing
 * page: the beta's only subject, until an onboarding asks the student's class.
 */
export const APP_START = `${CONTENT_ROOT}/scuola-superiore/matematica`;

/**
 * Path prefixes that must never be indexed: authenticated areas, checkout
 * results, API. Used by the robots meta, the X-Robots-Tag header, robots.txt
 * and the sitemap so the four cannot drift apart.
 */
export const PRIVATE_PATH_PREFIXES = [
	'/admin',
	'/zaino',
	'/api',
	'/subscription',
	'/richieste',
	'/dashboard',
	'/leads',
	'/profile-editor',
	'/pricing/success',
	'/pricing/cancel'
];

const startsWithAny = (pathname: string, prefixes: string[]) =>
	prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));

export const isPrivatePath = (pathname: string): boolean => startsWithAny(pathname, PRIVATE_PATH_PREFIXES);

/**
 * Areas that need a signed-in user (the proxy redirects anonymous visitors to
 * `/`). API routes and the checkout result pages handle their own state; the
 * backpack is noindex but reachable, because its signed-out state is what
 * sells it.
 */
export const AUTH_REQUIRED_PREFIXES = PRIVATE_PATH_PREFIXES.filter(
	(p) => p !== '/api' && p !== ZAINO_ROOT && !p.startsWith('/pricing/')
);

export const requiresLogin = (pathname: string): boolean => startsWithAny(pathname, AUTH_REQUIRED_PREFIXES);

export const isAdminPath = (pathname: string): boolean => startsWithAny(pathname, ['/admin']);

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
