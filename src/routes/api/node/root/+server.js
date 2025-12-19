import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import supabase from '$lib/supabase';

export async function GET({ url, locals, params}) {
    const user = locals.user
    try {
        const searchParams = url.searchParams
        let slug = params.slug
        let docs = {}
        let err = {}

        try{
            const {data, error} = await supabase
                .from('content_nodes')
                .select('*')
                .is('parent_id', null)
                .order('position', {ascending: true})
            console.log('query result', data, error)
            docs = data
            err = error
            console.log('query root', docs)
        }catch(err){
            console.log('node id supabase error', err)
        }
        return json(docs)

    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}