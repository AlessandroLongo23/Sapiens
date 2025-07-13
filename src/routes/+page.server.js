import { redirect } from '@sveltejs/kit'

export const actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email')
        const password = formData.get('password')

        const { error } = await supabase.auth.signUp({ email, password })
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
    
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email')
        const password = formData.get('password')

        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            return {
                success: false,
                error: error.message
            }
        }

        throw redirect(303, '/private/calendario');
    },

    logout: async ({ locals: { supabase } }) => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            return {
                success: false,
                error: error.message
            }
        }
        
        throw redirect(303, '/')
    }
} 