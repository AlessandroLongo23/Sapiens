import { PRIVATE_PATH_PREFIXES, SITE_URL } from '@/lib/config/site';

export const revalidate = 86400;

export function GET() {
	const lines = ['User-agent: *', ...PRIVATE_PATH_PREFIXES.map((p) => `Disallow: ${p}`), 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
