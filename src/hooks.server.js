import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createServerSupabaseClient } from '$lib/supabase';

const handleSupabase = async ({ event, resolve }) => {
    // Create a server-side Supabase client with cookie handling
    event.locals.supabase = createServerSupabaseClient(event);

    // Get session from cookies
    const { data: { session }, error: sessionError } = await event.locals.supabase.auth.getSession();

    if (sessionError) {
        console.error('Session error:', sessionError);
        event.locals.session = null;
        event.locals.user = null;
        return resolve(event);
    }

    event.locals.session = session;

    if (session) {
        // Validate session by fetching user
        const { data: { user }, error: userError } = await event.locals.supabase.auth.getUser();
        
        if (userError) {
            console.error('User fetch error:', userError);
            await event.locals.supabase.auth.signOut();
            event.locals.session = null;
            event.locals.user = null;
        } else {
            event.locals.user = user;

            // Refresh session if expiring soon (within 5 minutes)
            const now = Math.floor(Date.now() / 1000);
            const sessionExpiresAt = session.expires_at;

            if (sessionExpiresAt && sessionExpiresAt - now < 300) {
                console.log('Refreshing session token');
                try {
                    const { data, error } = await event.locals.supabase.auth.refreshSession();
                    if (error) {
                        console.error('Session refresh error:', error);
                    } else if (data?.session) {
                        event.locals.session = data.session;
                    }
                } catch (refreshError) {
                    console.error('Error refreshing session:', refreshError);
                }
            }
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        },
    });
};

const handleAuth = async ({ event, resolve }) => {
    // Protect routes that require authentication
    if (!event.locals.session && (event.url.pathname.startsWith('/student') || event.url.pathname.startsWith('/admin'))) {
        throw redirect(303, '/');
    }

    return resolve(event);
};

export const handle = sequence(handleSupabase, handleAuth);
