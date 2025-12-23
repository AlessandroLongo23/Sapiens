import { redirect } from '@sveltejs/kit'

export const actions = {
    signup: async ({ request, locals }) => {
        const formData = await request.formData()
        const email = formData.get('email')
        const password = formData.get('password')

        const { error } = await locals.supabase.auth.signUp({ email, password })
        if (error) {
            return {
                success: false,
                error: error.message
            }
        }
        
        return {
            success: true
        }
    },
    
    login: async ({ request, locals }) => {
        const formData = await request.formData()
        const email = formData.get('email')
        const password = formData.get('password')

        const { data: { user }, error } = await locals.supabase.auth.signInWithPassword({ email, password })
        if (error) {
            return {
                success: false,
                error: error.message
            }
        }

        const redirectPath = '/admin';
        throw redirect(303, redirectPath);
    },

    logout: async ({ locals }) => {
        const { error } = await locals.supabase.auth.signOut()
        if (error) {
            return {
                success: false,
                error: error.message
            }
        }
        
        throw redirect(303, '/')
    }
}
