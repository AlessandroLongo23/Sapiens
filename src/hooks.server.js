import { redirect, error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createClient } from '$lib/supabase'

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
	if (!event.locals.session && event.url.pathname.startsWith('/student') || event.url.pathname.startsWith('/admin')) {
		throw redirect(303, '/')
	}

	return resolve(event)
}

export const handle = sequence(handleSupabase, handleAuth)