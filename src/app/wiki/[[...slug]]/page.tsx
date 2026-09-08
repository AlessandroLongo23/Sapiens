import { notFound, permanentRedirect } from 'next/navigation';
import { getContentTree } from '@/lib/server/content';
import { oldWikiPathToNew } from '@/lib/seo/slug';

type Props = { params: Promise<{ slug?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Old `/wiki/...` URLs (English level and subject slugs, `/theory` suffix)
 * are redirected permanently to their `/materiale/...` equivalent, query
 * string included, so tracked links keep their parameters. A path that
 * matches no node gets a real 404. Reading the query makes this route
 * dynamic; it only ever answers with a redirect from the cached tree.
 */
export default async function LegacyWikiPage({ params, searchParams }: Props) {
	const [{ slug = [] }, query] = await Promise.all([params, searchParams]);
	const target = oldWikiPathToNew(await getContentTree(), ['', 'wiki', ...slug].join('/'));
	if (!target) notFound();
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) search.append(key, v);
	const qs = search.toString();
	permanentRedirect(qs ? `${target}?${qs}` : target);
}
