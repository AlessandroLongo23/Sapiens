import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient(cookies) {
    return createSupabaseClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: cookies ? {
            get: (key) => cookies.get(key),
            set: (key, value, options) => {
                cookies.set(key, value, {
                    ...options,
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7
                })
            },
            remove: (key) => cookies.delete(key, { path: '/' })
        } : undefined
    });
}

export const supabase = createSupabaseClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)

export const types = ["level", "subject", "chapter", "topic"]

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
