import type { NextRequest } from 'next/server';
import { sandboxPage, siteOf } from '../origin';

/**
 * The page of the iframe that shows a web page written in the code editor (src/components/codice/WebBench.tsx). It
 * starts as one script (pagina.ts), which writes the student's page in its place.
 *
 * Like the sandbox of the programs it has an origin of its own, and the student's script can reach nothing: no
 * request leaves the page (there is no `connect-src`), no form is sent, no frame is opened. What a page of a
 * beginner needs is allowed: scripts and styles written in the page, pictures from the web, the dialogs of alert()
 * and prompt().
 */
export function GET(request: NextRequest) {
	const origin = siteOf(request);
	if (!origin) return new Response(null, { status: 400 });
	return sandboxPage(`<script src="${origin}/codice/sandbox/pagina.js" crossorigin="anonymous"></script>`, [
		'sandbox allow-scripts allow-modals',
		"default-src 'none'",
		`script-src 'unsafe-inline' blob: ${origin}/codice/sandbox/`,
		"style-src 'unsafe-inline'",
		`img-src data: blob: https: ${origin}`,
		'font-src data:',
		'media-src data: https:',
		"form-action 'none'",
		"base-uri 'none'",
		`frame-ancestors ${origin}`
	]);
}
