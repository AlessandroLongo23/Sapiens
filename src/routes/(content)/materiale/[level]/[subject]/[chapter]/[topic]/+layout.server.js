import { loadNodePage } from '$lib/server/node-page';
import { CONTENT_ROOT } from '$lib/config/site';

/**
 * Lesson pages (theory, esercizi, formulario, flashcards). The explicit
 * four-segment route keeps the lesson rendering code (markdown, KaTeX) out of
 * the index pages served by `[...slug]`.
 */

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params, parent, url }) {
	const { tree } = await parent();
	const segments = [params.level, params.subject, params.chapter, params.topic];
	return loadNodePage({
		tree,
		segments,
		requestPath: `${CONTENT_ROOT}/${segments.join('/')}`,
		url,
		expect: 'topic'
	});
}
