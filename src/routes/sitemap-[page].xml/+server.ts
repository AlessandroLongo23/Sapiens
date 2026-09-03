import { error } from '@sveltejs/kit';
import { buildSitemapUrls, renderUrlset, SITEMAP_CHUNK, XML_HEADERS } from '$lib/server/sitemap';

export const config = {
	isr: {
		expiration: 600
	}
};

/** Chunk N of the sitemap index, only used once the site has more than SITEMAP_CHUNK URLs. */
export async function GET({ params }) {
	const page = Number(params.page);
	if (!Number.isInteger(page) || page < 1) throw error(404, 'Not found');

	const urls = await buildSitemapUrls();
	const chunk = urls.slice((page - 1) * SITEMAP_CHUNK, page * SITEMAP_CHUNK);
	if (chunk.length === 0) throw error(404, 'Not found');

	return new Response(renderUrlset(chunk), { headers: XML_HEADERS });
}
