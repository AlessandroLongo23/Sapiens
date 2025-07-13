import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const load = async ({ locals: { session, user } }) => {
	return {
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseAnonKey: PUBLIC_SUPABASE_ANON_KEY,
		session,
		user
	}
}