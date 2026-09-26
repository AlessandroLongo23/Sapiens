import { getSearchSections } from '@/lib/server/search-index';

/** The sections of every written lesson, for the site search to point inside a lesson. */
export async function GET() {
	return Response.json(await getSearchSections(), { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600' } });
}
