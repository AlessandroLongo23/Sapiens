import { buildSitemapUrls, renderUrlset, renderSitemapIndex, SITEMAP_CHUNK, XML_HEADERS } from '$lib/server/sitemap';

export const config = {
	isr: {
		expiration: 600
	}
};

export async function GET() {
	const urls = await buildSitemapUrls();

	const body =
		urls.length > SITEMAP_CHUNK
			? renderSitemapIndex(Math.ceil(urls.length / SITEMAP_CHUNK))
			: renderUrlset(urls);

	return new Response(body, { headers: XML_HEADERS });
}
