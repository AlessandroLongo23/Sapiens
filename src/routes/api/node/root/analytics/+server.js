import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import supabase, { types, countNodesByType } from '$lib/supabase';

export async function GET({ url, locals, params}) {
    const user = locals.user
    try {
        const searchParams = url.searchParams
        let slug = params.slug
        let analytics = {
            "level": 0,
            "subject": 0,
            "chapter": 0,
            "topic": 0
        }
        let err = {}
        try {
            let counts = await countNodesByType();
            counts.map((count) => analytics[count.node_type] = count.node_count)
            return json(analytics)
        } catch(err) {
            console.log('node id supabase error', err)
        }
    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}