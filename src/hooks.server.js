import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { getContentTree } from '$lib/server/content'
import { oldWikiPathToNew, aliasTarget } from '$lib/seo/slug'
import { isPrivatePath, requiresLogin } from '$lib/config/site'
import { createRequestClient, safeGetSession, hasAuthCookie } from '$lib/auth/server'
import { isStaff } from '$lib/auth/entitlements'

/**
 * Old `/wiki/...` URLs (English level and subject slugs, `/theory` suffix)
 * are redirected permanently to their `/materiale/...` equivalent, and so are
 * the paths of renamed pages listed in PATH_ALIASES. A path that matches no
 * node falls through and gets a real 404.
 */
const handleLegacyWiki = async ({ event, resolve }) => {
	const { pathname, search } = event.url

	if (pathname === '/wiki' || pathname.startsWith('/wiki/')) {
		const tree = await getContentTree()
		const target = oldWikiPathToNew(tree, pathname)
		if (target) {
			redirect(301, target + search)
		}
	}

	const alias = aliasTarget(pathname)
	if (alias) {
		redirect(301, alias + search)
	}

	return resolve(event)
}

/**
 * One Supabase client per request, reading and writing the auth cookies, so
 * the login made in the browser is visible here. `locals.user` is validated
 * with Supabase Auth, and only looked up when an auth cookie is present:
 * anonymous visitors (and cached public pages) cost nothing.
 */
const handleSupabase = async ({ event, resolve }) => {
	event.locals.supabase = createRequestClient(event)
	event.locals.safeGetSession = () => safeGetSession(event.locals.supabase)
	event.locals.session = null
	event.locals.user = null

	if (hasAuthCookie(event)) {
		const { session, user } = await event.locals.safeGetSession()
		event.locals.session = session
		event.locals.user = user
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})
}

/**
 * Signed-in areas send anonymous visitors back to the home page; the admin
 * area also needs `app_metadata.role = 'admin'` (set in the Supabase
 * dashboard; users cannot set it themselves).
 */
const handleAuth = async ({ event, resolve }) => {
	const { pathname } = event.url
	if (!event.locals.user && requiresLogin(pathname)) {
		throw redirect(303, '/')
	}
	if ((pathname === '/admin' || pathname.startsWith('/admin/')) && !isStaff(event.locals.user)) {
		throw redirect(303, '/')
	}

	return resolve(event)
}

/**
 * Authenticated, checkout and API routes carry `X-Robots-Tag: noindex` in
 * addition to the robots meta tag, so responses without HTML are covered too.
 */
const handleRobotsHeader = async ({ event, resolve }) => {
	const response = await resolve(event)

	if (isPrivatePath(event.url.pathname)) {
		try {
			response.headers.set('X-Robots-Tag', 'noindex, nofollow')
		} catch {
			// Immutable headers (static asset responses): nothing to do.
		}
	}

	return response
}

export const handle = sequence(handleLegacyWiki, handleRobotsHeader, handleSupabase, handleAuth)
