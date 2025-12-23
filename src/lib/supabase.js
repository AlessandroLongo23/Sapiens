import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client for server-side operations with cookie handling
 * @param {object} event - SvelteKit request event with cookies
 */
export function createServerSupabaseClient(event) {
    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => {
                return event.cookies.getAll();
            },
            setAll: (cookies) => {
                cookies.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, {
                        ...options,
                        path: '/',
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax'
                    });
                });
            }
        }
    });
}

/**
 * Create a Supabase client for browser-side operations
 */
export function createBrowserSupabaseClient() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

// A basic client for simple operations (without cookie handling) - for API routes
export const supabase = createSupabaseClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const types = ["level", "subject", "chapter", "topic"];

export async function countNodesByType() {
    const { data, error } = await supabase
        .rpc('count_nodes_by_type');

    if (error) {
        console.error("❌ Errore durante il conteggio raggruppato:", error);
        return null;
    }

    return data;
}

export default supabase;
