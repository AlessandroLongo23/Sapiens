import supabase from "$lib/supabase"

export const load = async ({ data, depends, fetch }) => {
    depends('supabase:auth')

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
        return { session: null, user: null }
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return { session: null, user: null }
    }

    return { 
        session: session, 
        user: user.toObject() }
}