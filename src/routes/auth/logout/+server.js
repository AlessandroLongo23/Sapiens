import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase } }) => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        });
    }

    return new Response(null, {
        status: 303,
        headers: { Location: '/' }
    });
}