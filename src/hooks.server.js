import { redirect, error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createClient } from '$lib/supabase'
// import { migrateContent } from '$lib/migration.js'

// try {
// 	migrateContent();
// } catch {
// 	console.log('Errore')
// }

const handleSupabase = async ({ event, resolve }) => {
	event.locals.supabase = createClient(event.cookies)

	const { data: { session }, error: sessionError } = await event.locals.supabase.auth.getSession()

	if (sessionError) {
		console.error('Session error:', sessionError)
		event.locals.session = null
		event.locals.user = null
		return resolve(event)
	}

	event.locals.session = session

	if (session) {
		const { data: { user }, error: userError } = await event.locals.supabase.auth.getUser()
		if (userError) {
			console.error('User fetch error:', userError)
			await event.locals.supabase.auth.signOut()
			event.locals.session = null
			event.locals.user = null
		} else {
			event.locals.user = user
			
			const now = Math.floor(Date.now() / 1000);
			const sessionExpiresAt = session.expires_at;
			
			if (sessionExpiresAt && sessionExpiresAt - now < 300) {
				console.log('Refreshing session token');
				try {
					const { data, error } = await event.locals.supabase.auth.refreshSession();
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

export const handle = sequence(handleSupabase, handleAuth)