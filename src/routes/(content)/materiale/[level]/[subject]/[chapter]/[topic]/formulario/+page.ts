import { error } from '@sveltejs/kit';
import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.svelte.js';

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { node, formulary } = await parent();

	if (node.type !== 'topic') {
		throw error(404, 'Pagina non trovata.');
	}

	if (!formulary) {
		return { content: null, sections: [] };
	}

	const flatToc = extractTableOfContents(formulary);
	return {
		content: renderMarkdown(formulary),
		sections: structureTableOfContents(flatToc)
	};
}
