import type { NextConfig } from 'next';

/**
 * Public variables keep the names the deployment already uses (PUBLIC_*),
 * inlined into both bundles at build time (a change on Vercel needs a
 * redeploy). Secrets are read with process.env on the server only and never
 * listed here.
 */
const PUBLIC_KEYS = [
	'PUBLIC_SITE_URL',
	'PUBLIC_SUPABASE_URL',
	'PUBLIC_SUPABASE_ANON_KEY',
	'PUBLIC_GSC_VERIFICATION',
	'PUBLIC_CONTACT_EMAIL',
	'PUBLIC_LEGAL_NAME',
	'PUBLIC_LEGAL_ADDRESS',
	'PUBLIC_LEGAL_VAT',
	'PUBLIC_PRIVACY_EMAIL',
	'PUBLIC_STRIPE_PRICE_LITE',
	'PUBLIC_STRIPE_PRICE_BASE',
	'PUBLIC_STRIPE_PRICE_PRO',
	'PUBLIC_STRIPE_PRICE_LITE_SEMESTER',
	'PUBLIC_STRIPE_PRICE_BASE_SEMESTER',
	'PUBLIC_STRIPE_PRICE_PRO_SEMESTER'
];

const supabaseHost = (() => {
	try {
		return new URL(process.env.PUBLIC_SUPABASE_URL ?? '').host;
	} catch {
		return '*.supabase.co';
	}
})();

/**
 * Content Security Policy. Next's own inline scripts (the streamed React
 * payload) change per page, so `script-src` keeps 'unsafe-inline' instead of
 * a nonce: a nonce would need `headers()` in the root layout and end the
 * static caching of every page. Everything else is locked to what the site
 * actually talks to: Supabase (auth), Vercel's analytics, TikZJax's CDN for
 * the diagrams, and its WebAssembly.
 *
 * `next dev` alone adds 'unsafe-eval': React's development build replays
 * server-side console output with reconstructed call stacks through eval(),
 * and without it every such message becomes a console error. The production
 * build never calls eval(), so the policy served by Vercel is unchanged (the
 * smoke suite checks that it stays so).
 */
const isDev = process.env.NODE_ENV === 'development';

const CSP = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''} https://tikzjax.com https://va.vercel-scripts.com`,
	"style-src 'self' 'unsafe-inline' https://tikzjax.com",
	"img-src 'self' data: blob: https:",
	"font-src 'self' data: https://tikzjax.com",
	`connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://tikzjax.com https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
	"worker-src 'self' blob: https://tikzjax.com",
	"frame-src https://js.stripe.com https://checkout.stripe.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'"
].join('; ');

const SECURITY_HEADERS = [
	{ key: 'Content-Security-Policy', value: CSP },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
	{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
];

const config: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	env: Object.fromEntries(PUBLIC_KEYS.map((key) => [key, process.env[key] ?? ''])),
	// The hero screenshot is served as AVIF/WebP with a srcset by next/image.
	images: { formats: ['image/avif', 'image/webp'] },
	async headers() {
		return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
	},
	// Chunked sitemaps keep their public name (`/sitemap-2.xml`); a segment name cannot mix text and a parameter.
	async rewrites() {
		return [{ source: '/sitemap-:page(\\d+).xml', destination: '/sitemap/:page' }];
	}
};

export default config;
