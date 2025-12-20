import supabase from "$lib/supabase"
import { reconstructTree } from "$lib/utils/tree"

export const load = async ({ depends, fetch }) => {
    depends('supabase:auth')

    const resp = await fetch(`/api/node/root`)
    const nodes = (resp.ok && await resp.json()) || []
    const tree = reconstructTree(nodes)

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
        return { tree, session: null, user: null }
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return { tree, session: null, user: null }
    }

    return { 
        tree,
        session, 
        user: user.toObject() 
    }
}