import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase }, request, cookies }) => {
    const { error } = await supabase.auth.signOut({ 
        scope: 'local'
    });
    
    cookies.delete('supabase-auth-token', { path: '/' });
    
    if (error) {
        const acceptHeader = request.headers.get('Accept') || '';
        const wantsJson = acceptHeader.includes('application/json');
        
        if (wantsJson) {
            return new Response(JSON.stringify({ error: error.message, redirectTo: '/' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        throw redirect(303, '/');
    }

    const acceptHeader = request.headers.get('Accept') || '';
    const wantsJson = acceptHeader.includes('application/json');
    
    if (wantsJson) {
        return new Response(JSON.stringify({ success: true, redirectTo: '/' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    throw redirect(303, '/');
}