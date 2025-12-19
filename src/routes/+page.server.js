import { redirect } from '@sveltejs/kit'
import supabase from '$lib/supabase'

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
    
    login: async ({ request, locals}) => {
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

        // const redirectPath = user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
        const redirectPath = '/admin';
        throw redirect(303, redirectPath);
    },

    logout: async () => {
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