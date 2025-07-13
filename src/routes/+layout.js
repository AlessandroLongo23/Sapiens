import { createBrowserClient, isBrowser } from '@supabase/ssr'

export const load = async ({ data, depends, fetch }) => {
	depends('supabase:auth')

	const supabase = createBrowserClient(data.supabaseUrl, data.supabaseAnonKey, {
		global: {
			fetch,
		},
	})

	const {
		data: { session },
	} = await supabase.auth.getSession()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return { session, supabase, user }
}