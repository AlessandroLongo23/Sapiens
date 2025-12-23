import { reconstructTree } from "$lib/utils/tree"

export const load = async ({ depends, fetch, locals }) => {
    depends('supabase:auth')

    const resp = await fetch(`/api/node/root`)
    const nodes = (resp.ok && await resp.json()) || []
    const tree = reconstructTree(nodes)

    // Use session and user from locals (set by hooks.server.js)
    const { session, user } = locals;
    
    if (!session || !user) {
        return { tree, session: null, user: null }
    }

    return { 
        tree,
        session, 
        user
    }
}
