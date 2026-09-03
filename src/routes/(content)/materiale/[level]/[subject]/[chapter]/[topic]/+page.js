import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.svelte.js';

/**
 * The lesson page renders the theory markdown here, so the HTML is part of the
 * server response and the table of contents is available to the sidebar.
 */

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { theory } = await parent();

	if (!theory) {
		return { content: null, sections: [] };
	}

	const flatToc = extractTableOfContents(theory);
	return {
		content: renderMarkdown(theory),
		sections: structureTableOfContents(flatToc)
	};
}
