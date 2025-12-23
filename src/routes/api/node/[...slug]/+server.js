import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import supabase from '$lib/supabase';

export async function GET({ url, locals, params}) {
    const user = locals.user
    try {
        const searchParams = url.searchParams
        let slug = params.slug
        console.log('params.slug', params.slug)
        let parent = {}
        let doc = {}
        let err = {}

        try{
            const {data, error} = await supabase
                .from('content_nodes')
                .select('*')
                .eq('slug', slug);
            doc = data[0]
            err = error

            const resp = await supabase
                .from('content_nodes')
                .select('*')
                .eq('parent_id', doc.id);
            doc.children = resp.data
            err = resp.error
            console.log('doc', doc)
            return json(doc)
        }catch(err){
            console.log('node id supabase error', err)
        }
        console.log(docs)

    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}