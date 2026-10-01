import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { ORBITAL_PATH, ORBITAL_SLUG, OrbitalPage } from '@/components/orbitali/OrbitalPage';

/**
 * The orbital viewer (vault/Prodotti/Studenti/Orbitali atomici interattivi.md): a tool with a page of its own. Static; the
 * orbital, the view and the element of the table of sublevels live in the query string, and the canonical is the plain
 * address.
 */

// The links to lessons follow the content tree.
export const revalidate = 3600;

export function generateMetadata(): Metadata {
	const tool = toolBySlug(ORBITAL_SLUG)!;
	return pageMetadata({ title: `Orbitali atomici in 3D e configurazione elettronica | ${SITE_NAME}`, description: tool.description, path: ORBITAL_PATH });
}

export default async function OrbitalRoute() {
	const tool = toolBySlug(ORBITAL_SLUG)!;
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(tool.slug)]);
	return <OrbitalPage tool={tool} lessons={lessons} articleHtml={articleHtml} />;
}
