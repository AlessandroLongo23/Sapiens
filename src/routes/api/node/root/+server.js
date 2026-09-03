import { json } from '@sveltejs/kit';
import { getFlatNodes } from '$lib/server/content';

/**
 * Flat list of content nodes without lesson text (titles, slugs, descriptions,
 * positions, has_theory / has_formulary). Used by the search overlay on pages
 * that did not load the tree themselves.
 */
export async function GET({ setHeaders }) {
    const nodes = await getFlatNodes();
    setHeaders({
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600'
    });
    return json(nodes);
}
