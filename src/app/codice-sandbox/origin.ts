import type { NextRequest } from 'next/server';

/** The origin the visitor's browser asked, which behind a proxy is not the one the server listens on. */
export function siteOf(request: NextRequest): string | null {
	const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
	// it goes in a header and in the page: nothing but a host name and a port
	if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return null;
	const protocol = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');
	return `${protocol === 'http' ? 'http' : 'https'}://${host}`;
}

/** A page of the sandbox: one script and a policy. */
export function sandboxPage(script: string, policy: string[]) {
	return new Response(`<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Sapiens</title></head><body>${script}</body></html>`, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Content-Security-Policy': policy.join('; '),
			'X-Content-Type-Options': 'nosniff',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'X-Robots-Tag': 'noindex, nofollow',
			'Cache-Control': 'private, no-store'
		}
	});
}
