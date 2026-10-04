import type { NextRequest } from 'next/server';
import { sandboxPage, siteOf } from './origin';

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
export function GET(request: NextRequest) {
	const origin = siteOf(request);
	if (!origin) return new Response(null, { status: 400 });
	const files = ['codice', 'pyodide', 'clang'].map((folder) => `${origin}/${folder}/`).join(' ');
	return sandboxPage(`<script type="module" src="${origin}/codice/sandbox/host.js"></script>`, [
		'sandbox allow-scripts',
		"default-src 'none'",
		`script-src ${files} blob: 'wasm-unsafe-eval'`,
		`connect-src ${files}`,
		'worker-src blob:',
		`frame-ancestors ${origin}`
	]);
}
