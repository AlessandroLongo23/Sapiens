import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { PERIODIC_PATH, PERIODIC_SLUG, PeriodicPage } from '@/components/tools/periodic/PeriodicPage';

/**
 * The periodic table (vault/Prodotti/Studenti/Tavola periodica interattiva.md): a tool with a page of its own. Static:
 * every element is in the HTML; the view and the open element live in the query string and the canonical is the
 * plain address.
 */

// The links to lessons follow the content tree.
export const revalidate = 3600;

export function generateMetadata(): Metadata {
	const tool = toolBySlug(PERIODIC_SLUG)!;
	return pageMetadata({ title: `Tavola periodica degli elementi interattiva e da stampare | ${SITE_NAME}`, description: tool.description, path: PERIODIC_PATH });
}

export default async function PeriodicTableRoute() {
	const tool = toolBySlug(PERIODIC_SLUG)!;
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(tool.slug)]);
	return <PeriodicPage tool={tool} lessons={lessons} articleHtml={articleHtml} />;
}
