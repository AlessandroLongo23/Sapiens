import { error } from '@sveltejs/kit';
import { findNodeByPath } from '$lib/utils/tree';

/** @type {import('./$types').LayoutLoad} */
export async function load({ params, parent }) {
    const { tree } = await parent();
    const slugPath = params.slug.split('/');
    
    const { node, ancestors } = findNodeByPath(tree, slugPath);
    
    if (!node) {
        throw error(404, 'Nodo non trovato.');
    }

    const parentNode = ancestors.length > 1 ? ancestors[ancestors.length - 2] : null;
    const navigation = parentNode ? {
        parent: {
            url: `/wiki/${ancestors.slice(0, -1).map(n => n.slug).join('/')}`,
            label: parentNode.title
        }
    } : null;

    return {
        node,
        pathSegments: ancestors,
        title: node.title,
        navigation
    };
}


