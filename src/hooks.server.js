import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import supabase from '$lib/supabase'
import { getContentTree } from '$lib/server/content'
import { oldWikiPathToNew } from '$lib/seo/slug'
import { isPrivatePath } from '$lib/config/site'

/**
 * Old `/wiki/...` URLs (English level and subject slugs, `/theory` suffix)
 * are redirected permanently to their `/materiale/...` equivalent. A path that
 * matches no node falls through and gets a real 404.
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

	return resolve(event)
}

const handleSupabase = async ({ event, resolve }) => {

	const { data: { session }, error: sessionError } = await supabase.auth.getSession()

	if (sessionError) {
		console.error('Session error:', sessionError)
		event.locals.session = null
		event.locals.user = null
		return resolve(event)
	}

	event.locals.session = session

	if (session) {
		const { data: { user }, error: userError } = await supabase.auth.getUser()
		if (userError) {
			console.error('User fetch error:', userError)
			await supabase.auth.signOut()
			event.locals.session = null
			event.locals.user = null
		} else {
			event.locals.user = user

			const now = Math.floor(Date.now() / 1000);
			const sessionExpiresAt = session.expires_at;

			if (sessionExpiresAt && sessionExpiresAt - now < 300) {
				console.log('Refreshing session token');
				try {
					const { data, error } = await supabase.auth.refreshSession();
					if (error) {
						console.error('Session refresh error:', error);
					} else if (data && data.session) {
						event.locals.session = data.session;
					}
				} catch (refreshError) {
					console.error('Error refreshing session:', refreshError);
				}
			}
		}
	} else {
		event.locals.user = null
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		},
	})
}

const handleAuth = async ({ event, resolve }) => {
	if (!event.locals.session && (event.url.pathname.startsWith('/student') || event.url.pathname.startsWith('/admin'))) {
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
