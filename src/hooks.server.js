import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const handleSupabase = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' })
				})
			}
		}
	})

	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession()

	event.locals.session = session

	if (session) {
		event.locals.user = session.user
	} else {
		event.locals.user = null
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		}
	})
}

const handleAuth = async ({ event, resolve }) => {
	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		throw redirect(303, '/')
	}

	return resolve(event)
}

export const handle = sequence(handleSupabase, handleAuth)