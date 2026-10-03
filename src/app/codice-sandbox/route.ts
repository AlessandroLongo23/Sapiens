import type { NextRequest } from 'next/server';

/**
 * The page of the iframe the code editor runs its programs in (src/components/codice/sandbox.ts). It is nothing but
 * the script of the sandbox; what matters is its policy.
 *
 * `sandbox allow-scripts` gives the page an origin of its own even when someone opens it directly: no cookies of
 * the site, no storage, no service worker. The rest keeps a program from the network: scripts and requests only to
 * the files of the languages, workers only from the page's own blobs (they inherit this policy), and the page only
 * inside the site. The origin is written out, because 'self' in a page without an origin is not read the same way
 * by every browser.
 */

/** The origin the visitor's browser asked, which behind a proxy is not the one the server listens on. */
function siteOf(request: NextRequest): string | null {
	const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
	// it goes in a header and in the page: nothing but a host name and a port
	if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return null;
	const protocol = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
	return `${protocol === 'http' ? 'http' : 'https'}://${host}`;
}

export function GET(request: NextRequest) {
	const origin = siteOf(request);
	if (!origin) return new Response(null, { status: 400 });
	const files = ['codice', 'pyodide', 'clang'].map((folder) => `${origin}/${folder}/`).join(' ');
	const policy = [
		'sandbox allow-scripts',
		"default-src 'none'",
		`script-src ${files} blob: 'wasm-unsafe-eval'`,
		`connect-src ${files}`,
		'worker-src blob:',
		`frame-ancestors ${origin}`
	].join('; ');
	const page = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Sapiens</title></head><body><script type="module" src="${origin}/codice/sandbox/host.js"></script></body></html>`;
	return new Response(page, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Content-Security-Policy': policy,
			'X-Content-Type-Options': 'nosniff',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'X-Robots-Tag': 'noindex, nofollow',
			'Cache-Control': 'private, no-store'
		}
	});
}
