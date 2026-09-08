import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isAdminPath, isPrivatePath, requiresLogin } from '@/lib/config/site';
import { aliasTarget } from '@/lib/seo/slug';

/**
 * Runs before every page and API route.
 *
 * Renamed pages listed in PATH_ALIASES redirect permanently, query string
 * included. Signed-in areas send anonymous visitors back to the home page;
 * the admin area also needs `app_metadata.role = 'admin'` (set in the
 * Supabase dashboard; users cannot set it themselves). The session token is
 * verified locally from its claims (a network round trip only when the
 * project still signs with a shared secret, or when the token has to be
 * refreshed) and only when an auth cookie is present, so anonymous visitors
 * and cached public pages cost nothing; refreshed tokens are written back to
 * the cookies. Private routes carry `X-Robots-Tag: noindex` in addition to
 * the robots meta tag, so responses without HTML are covered too.
 */
export default async function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	// Malformed percent-encoding would make the router throw a 500; it is a 404 like any other bad address.
	try {
		decodeURIComponent(pathname);
	} catch {
		return NextResponse.rewrite(new URL('/__not-found__', request.url), { status: 404 });
	}

	const alias = aliasTarget(pathname);
	if (alias) return NextResponse.redirect(new URL(alias + search, request.url), 308);

	let response = NextResponse.next({ request });

	const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'));
	if (hasAuthCookie || requiresLogin(pathname)) {
		const supabase = createServerClient(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.PUBLIC_SUPABASE_ANON_KEY ?? '', {
			cookies: {
				getAll: () => request.cookies.getAll(),
				setAll: (toSet) => {
					toSet.forEach(({ name, value }) => request.cookies.set(name, value));
					response = NextResponse.next({ request });
					toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, path: '/' }));
				}
			}
		});
		const claims = hasAuthCookie ? (await supabase.auth.getClaims()).data?.claims ?? null : null;
		const role = (claims?.app_metadata as { role?: unknown } | undefined)?.role;
		if ((requiresLogin(pathname) && !claims) || (isAdminPath(pathname) && role !== 'admin')) {
			response = NextResponse.redirect(new URL('/', request.url), 303);
		}
	}

	if (isPrivatePath(pathname)) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	return response;
}

export const config = {
	// Everything but Next's own assets and the static files in /public.
	matcher: ['/((?!_next/|favicon|apple-touch-icon|icon-|og-image|site.webmanifest|sapiens/|images/|characters/).*)']
};
